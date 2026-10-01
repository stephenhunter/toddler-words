/*
 * neural-tts.js — tiny in-browser Piper (VITS) TTS engine for Toddler Words.
 * Offline, no API key. Uses:
 *   - onnxruntime-web (vendor/ort.wasm.min.js + ort-wasm-simd-threaded.{mjs,wasm})  [MIT]
 *   - piper_phonemize / espeak-ng compiled to WASM (vendor/piper_phonemize.{mjs,wasm,data}) [from @diffusionstudio/piper-wasm, MIT wrapper; espeak-ng is GPL-3]
 *   - Piper voice models in voices/*.onnx (+ .onnx.json)
 * Must be served over http(s)/localhost; file:// blocks fetch() of the model.
 *
 * API (window.NeuralTTS):
 *   NeuralTTS.VOICES                         -> list of male en_GB voices shipped
 *   await NeuralTTS.load(voiceKey, onProgress) -> loads runtime + model (idempotent)
 *   NeuralTTS.isReady(voiceKey)
 *   await NeuralTTS.synth(text, {lengthScale}) -> {pcm: Float32Array, sampleRate}
 *   await NeuralTTS.play(text, {lengthScale, audioCtx}) -> resolves when playback ends
 *   await NeuralTTS.wav(text, opts)            -> Blob (audio/wav)
 */
(function () {
  'use strict';
  var scriptSrc = (document.currentScript && document.currentScript.src) || location.href;
  var BASE = new URL('.', scriptSrc).href;            // folder containing this file
  var VENDOR = BASE + 'vendor/';
  var VOICE_DIR = BASE + 'voices/';

  // Male British voices only (user requirement). Female en_GB Piper voices are deliberately not shipped.
  var VOICES = [
    { key: 'en_GB-northern_english_male-medium', label: 'Northern English Male (British, neural) — default', speaker: 0 }
  ];

  var ortPromise = null, phonPromise = null;
  var sessions = {};          // voiceKey -> {session, config}
  var loading = {};           // voiceKey -> Promise
  var memCache = new Map();   // cacheKey -> {pcm, sampleRate}
  var queue = Promise.resolve(); // serialize inference (WASM single session)

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = res; s.onerror = function () { rej(new Error('Failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }
  async function fetchBuf(url, onProgress) {
    var r = await fetch(url);
    if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + url);
    var total = +(r.headers.get('Content-Length') || 0);
    if (!r.body || !onProgress) return await r.arrayBuffer();
    var reader = r.body.getReader(), chunks = [], got = 0;
    for (;;) {
      var x = await reader.read();
      if (x.done) break;
      chunks.push(x.value); got += x.value.length;
      onProgress({ url: url, loaded: got, total: total });
    }
    var out = new Uint8Array(got), o = 0;
    chunks.forEach(function (c) { out.set(c, o); o += c.length; });
    return out.buffer;
  }

  function getOrt() {
    if (!ortPromise) {
      ortPromise = (async function () {
        if (!window.ort) await loadScript(VENDOR + 'ort.wasm.min.js');
        var ort = window.ort;
        ort.env.wasm.wasmPaths = VENDOR;
        // Multi-threading needs cross-origin isolation (COOP/COEP headers); plain static servers don't send them.
        ort.env.wasm.numThreads = self.crossOriginIsolated ? Math.min(4, navigator.hardwareConcurrency || 1) : 1;
        return ort;
      })();
      ortPromise.catch(function () { ortPromise = null; });
    }
    return ortPromise;
  }

  function getPhonemizer() {
    if (!phonPromise) {
      phonPromise = (async function () {
        var mod = await import(VENDOR + 'piper_phonemize.mjs');
        var bufs = await Promise.all([fetchBuf(VENDOR + 'piper_phonemize.wasm'), fetchBuf(VENDOR + 'piper_phonemize.data')]);
        return { create: mod.createPiperPhonemize, wasm: bufs[0], data: bufs[1] };
      })();
      phonPromise.catch(function () { phonPromise = null; });
    }
    return phonPromise;
  }

  // text -> phoneme ids, via espeak-ng (fresh emscripten instance per call, as upstream does; binaries are cached in memory)
  async function phonemize(text, espeakVoice) {
    var P = await getPhonemizer();
    return await new Promise(function (resolve, reject) {
      var done = false;
      P.create({
        wasmBinary: P.wasm.slice(0),
        getPreloadedPackage: function () { return P.data.slice(0); },
        locateFile: function (u) { return VENDOR + u.split('/').pop(); },
        print: function (line) {
          if (done) return;
          try { var j = JSON.parse(line); done = true; resolve(j.phoneme_ids); } catch (e) { /* not json */ }
        },
        printErr: function (m) { console.warn('[piper_phonemize]', m); }
      }).then(function (m) {
        m.callMain(['-l', espeakVoice, '--input', JSON.stringify([{ text: text }]), '--espeak_data', '/espeak-ng-data']);
        setTimeout(function () { if (!done) reject(new Error('phonemize produced no output')); }, 4000);
      }, reject);
    });
  }

  function load(voiceKey, onProgress) {
    voiceKey = voiceKey || VOICES[0].key;
    if (sessions[voiceKey]) return Promise.resolve(sessions[voiceKey]);
    if (!loading[voiceKey]) {
      loading[voiceKey] = (async function () {
        var ort = await getOrt();
        await getPhonemizer();
        var cfgBuf = await fetchBuf(VOICE_DIR + voiceKey + '.onnx.json');
        var config = JSON.parse(new TextDecoder().decode(cfgBuf));
        var model = await fetchBuf(VOICE_DIR + voiceKey + '.onnx', onProgress);
        var session = await ort.InferenceSession.create(model, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
        sessions[voiceKey] = { session: session, config: config, key: voiceKey };
        return sessions[voiceKey];
      })();
      loading[voiceKey].catch(function () { delete loading[voiceKey]; });
    }
    return loading[voiceKey];
  }

  // --- IndexedDB persistent cache of generated PCM -------------------------
  var dbP = null;
  function db() {
    if (!dbP) dbP = new Promise(function (res) {
      try {
        var rq = indexedDB.open('toddler-words-tts', 1);
        rq.onupgradeneeded = function () { rq.result.createObjectStore('pcm'); };
        rq.onsuccess = function () { res(rq.result); };
        rq.onerror = function () { res(null); };
      } catch (e) { res(null); }
    });
    return dbP;
  }
  async function idbGet(k) {
    var d = await db(); if (!d) return null;
    return new Promise(function (res) {
      try { var rq = d.transaction('pcm').objectStore('pcm').get(k); rq.onsuccess = function () { res(rq.result || null); }; rq.onerror = function () { res(null); }; }
      catch (e) { res(null); }
    });
  }
  async function idbPut(k, v) {
    var d = await db(); if (!d) return;
    try { d.transaction('pcm', 'readwrite').objectStore('pcm').put(v, k); } catch (e) { }
  }

  async function synth(text, opts) {
    opts = opts || {};
    var voiceKey = opts.voiceKey || VOICES[0].key;
    var v = await load(voiceKey);
    var inf = v.config.inference || {};
    var lengthScale = (inf.length_scale || 1) * (opts.lengthScale || 1);
    var ck = voiceKey + '|' + lengthScale.toFixed(3) + '|' + text;
    if (memCache.has(ck)) return memCache.get(ck);
    var stored = await idbGet(ck);
    if (stored && stored.pcm) { memCache.set(ck, stored); return stored; }
    var job = queue.then(async function () {
      var ids = await phonemize(text, v.config.espeak.voice);
      var ort = window.ort;
      var feeds = {
        input: new ort.Tensor('int64', BigInt64Array.from(ids.map(BigInt)), [1, ids.length]),
        input_lengths: new ort.Tensor('int64', BigInt64Array.from([BigInt(ids.length)]), [1]),
        scales: new ort.Tensor('float32', Float32Array.from([inf.noise_scale || 0.667, lengthScale, inf.noise_w || 0.8]), [3])
      };
      if (v.config.num_speakers > 1) feeds.sid = new ort.Tensor('int64', BigInt64Array.from([BigInt(opts.speaker || 0)]), [1]);
      var out = await v.session.run(feeds);
      var pcm = new Float32Array(out.output.data);
      return { pcm: pcm, sampleRate: v.config.audio.sample_rate, phonemeIds: ids.length };
    });
    queue = job.catch(function () { });
    var res = await job;
    var entry = { pcm: res.pcm, sampleRate: res.sampleRate };
    memCache.set(ck, entry); idbPut(ck, entry);
    return entry;
  }

  var current = null;
  function stop() { if (current) { try { current.stop(); } catch (e) { } current = null; } }
  async function play(text, opts) {
    opts = opts || {};
    var r = await synth(text, opts);
    var ctx = opts.audioCtx || (window.__ttsCtx = window.__ttsCtx || new (window.AudioContext || window.webkitAudioContext)());
    if (ctx.state === 'suspended') { try { await ctx.resume(); } catch (e) { } }
    var buf = ctx.createBuffer(1, r.pcm.length, r.sampleRate);
    buf.getChannelData(0).set(r.pcm);
    stop();
    return new Promise(function (resolve) {
      var src = ctx.createBufferSource();
      src.buffer = buf;
      var g = ctx.createGain(); g.gain.value = opts.volume || 1;
      src.connect(g); g.connect(ctx.destination);
      src.onended = function () { if (current === src) current = null; resolve(); };
      current = src;
      src.start();
    });
  }

  function toWav(pcm, sr) {
    var v = new DataView(new ArrayBuffer(44 + pcm.length * 2));
    function s(o, str) { for (var i = 0; i < str.length; i++) v.setUint8(o + i, str.charCodeAt(i)); }
    s(0, 'RIFF'); v.setUint32(4, 36 + pcm.length * 2, true); s(8, 'WAVE'); s(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    s(36, 'data'); v.setUint32(40, pcm.length * 2, true);
    for (var i = 0, p = 44; i < pcm.length; i++, p += 2) { var x = Math.max(-1, Math.min(1, pcm[i])); v.setInt16(p, x < 0 ? x * 32768 : x * 32767, true); }
    return new Blob([v.buffer], { type: 'audio/wav' });
  }
  async function wav(text, opts) { var r = await synth(text, opts); return toWav(r.pcm, r.sampleRate); }

  window.NeuralTTS = {
    VOICES: VOICES, load: load, synth: synth, play: play, stop: stop, wav: wav, phonemize: phonemize,
    isReady: function (k) { return !!sessions[k || VOICES[0].key]; },
    supported: function () { return location.protocol !== 'file:' && typeof WebAssembly === 'object' && typeof BigInt64Array === 'function'; }
  };
})();
