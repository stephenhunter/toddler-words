/* Toddler Words v2 — app logic. Requires art.js (ART, ICONS) and neural-tts.js (NeuralTTS). */
(function(){
'use strict';
document.querySelectorAll('[data-icon]').forEach(function(n){ n.innerHTML = ICONS[n.dataset.icon] || ''; });
function icon(k){ return '<span class="i">'+(ICONS[k]||'')+'</span>'; }

/* ======================= DATA ======================= */
// English ABC: [letter, word, artKey, extra accepted variants]
var EN = [
 ['A','Apple','apple'],['B','Ball','ball',['bal','bowl']],['C','Cat','cat',['kat']],['D','Dog','dog'],['E','Elephant','elephant'],
 ['F','Fish','fish'],['G','Grapes','grapes',['grape']],['H','Hat','hat'],['I','Ice cream','icecream',['icecream','ice-cream']],
 ['J','Juice','juice'],['K','Kite','kite'],['L','Lion','lion'],['M','Moon','moon'],['N','Nose','nose'],['O','Orange','orange'],
 ['P','Pig','pig'],['Q','Queen','queen'],['R','Rabbit','rabbit',['bunny']],['S','Sun','sun'],['T','Tree','tree'],
 ['U','Umbrella','umbrella'],['V','Van','van'],['W','Whale','whale'],['X','Xylophone','xylophone',['zylophone']],
 ['Y','Yo-yo','yoyo',['yoyo','yo yo']],['Z','Zebra','zebra']
].map(function(r){return {lang:'en',letter:r[0],word:r[1],art:r[2],alts:r[3]||[],sub:''};});

// Japanese gojūon: [kana, word(hiragana), artKey, romaji, english, accepted variants, spoken text(optional)]
var JA = [
 ['あ','あり','ant','ari','ant',['アリ','蟻']],
 ['い','いぬ','dog','inu','dog',['イヌ','犬']],
 ['う','うさぎ','rabbit','usagi','rabbit',['ウサギ','兎']],
 ['え','えんぴつ','pencil','enpitsu','pencil',['エンピツ','鉛筆']],
 ['お','おにぎり','onigiri','onigiri','rice ball',['オニギリ','お握り','御握り']],
 ['か','かさ','umbrella','kasa','umbrella',['カサ','傘']],
 ['き','きりん','giraffe','kirin','giraffe',['キリン','麒麟']],
 ['く','くるま','car','kuruma','car',['クルマ','車']],
 ['け','けーき','cake','kēki','cake',['ケーキ']],
 ['こ','こあら','koala','koara','koala',['コアラ']],
 ['さ','さかな','fish','sakana','fish',['サカナ','魚']],
 ['し','しか','deer','shika','deer',['シカ','鹿']],
 ['す','すいか','watermelon','suika','watermelon',['スイカ','西瓜']],
 ['せ','せっけん','soap','sekken','soap',['セッケン','石鹸','石けん']],
 ['そ','そら','sky','sora','sky',['ソラ','空']],
 ['た','たまご','egg','tamago','egg',['タマゴ','卵','玉子']],
 ['ち','ちょうちょ','butterfly','chōcho','butterfly',['チョウチョ','ちょうちょう','ちょう','チョウ','蝶','蝶々']],
 ['つ','つき','moon','tsuki','moon',['ツキ','月']],
 ['て','て','hand','te','hand',['テ','手']],
 ['と','とり','bird','tori','bird',['トリ','鳥']],
 ['な','なす','eggplant','nasu','eggplant',['ナス','茄子']],
 ['に','にんじん','carrot','ninjin','carrot',['ニンジン','人参']],
 ['ぬ','ぬいぐるみ','teddy','nuigurumi','stuffed toy',['ヌイグルミ','縫いぐるみ']],
 ['ね','ねこ','cat','neko','cat',['ネコ','猫']],
 ['の','のりもの','bus','norimono','vehicle',['ノリモノ','乗り物']],
 ['は','はな','flower','hana','flower',['ハナ','花','鼻']],
 ['ひ','ひこうき','airplane','hikōki','airplane',['ヒコウキ','飛行機']],
 ['ふ','ふね','ship','fune','ship',['フネ','船','舟']],
 ['へ','へび','snake','hebi','snake',['ヘビ','蛇']],
 ['ほ','ほし','star','hoshi','star',['ホシ','星']],
 ['ま','まめ','peapod','mame','beans',['マメ','豆']],
 ['み','みかん','orange','mikan','mandarin orange',['ミカン','蜜柑']],
 ['む','むし','caterpillar','mushi','bug',['ムシ','虫']],
 ['め','めがね','glasses','megane','glasses',['メガネ','眼鏡']],
 ['も','もも','peach','momo','peach',['モモ','桃']],
 ['や','やま','mountain','yama','mountain',['ヤマ','山']],
 ['ゆ','ゆき','snowflake','yuki','snow',['ユキ','雪']],
 ['よ','よっと','sailboat','yotto','sailboat',['ヨット']],
 ['ら','らいおん','lion','raion','lion',['ライオン']],
 ['り','りんご','apple','ringo','apple',['リンゴ','林檎']],
 ['る','るびー','gem','rubī','ruby',['ルビー']],
 ['れ','れもん','lemon','remon','lemon',['レモン','檸檬']],
 ['ろ','ろけっと','rocket','roketto','rocket',['ロケット']],
 ['わ','わに','crocodile','wani','crocodile',['ワニ','鰐']],
 ['を','ほんを よむ','book','hon o yomu','read a book (を is the object particle “o”)',['ほんをよむ','本を読む','本をよむ','ほん','本','を','お'],'を。 ほんを、よむ'],
 ['ん','ぱん','bread','pan','bread (ん comes at the end of words)',['パン','ん'],'ん。 ぱん']
].map(function(r){return {lang:'ja',letter:r[0],word:r[1],art:r[2],sub:r[3]+' · '+r[4],alts:r[5]||[],speak:r[6]||null};});

// Numbers 1–10 (one counting object per number)
var COUNT_ART = ['sun','ball','apple','fish','star','flower','egg','orange','bird','lemon'];
var NUM_EN = [
 ['one',['1','won','wan']],['two',['2','to','too','tu']],['three',['3','tree','free']],['four',['4','for','fore']],['five',['5','fife']],
 ['six',['6','sicks']],['seven',['7']],['eight',['8','ate']],['nine',['9','nein']],['ten',['10','tin']]
].map(function(r,i){ var n=i+1; return {lang:'en',letter:String(n),word:r[0],count:n,art:COUNT_ART[i],alts:r[1],sub:'',speak:r[0].charAt(0).toUpperCase()+r[0].slice(1)+'.'}; });
var NUM_JA = [
 ['いち','ichi',['一','1','イチ']],['に','ni',['二','2','ニ']],['さん','san',['三','3','サン']],['よん','yon',['四','4','ヨン','し','シ']],
 ['ご','go',['五','5','ゴ']],['ろく','roku',['六','6','ロク']],['なな','nana',['七','7','ナナ','しち','シチ']],['はち','hachi',['八','8','ハチ']],
 ['きゅう','kyū',['九','9','キュウ','く','ク']],['じゅう','jū',['十','10','ジュウ','とお']]
].map(function(r,i){ var n=i+1, kanji='一二三四五六七八九十'.charAt(i); return {lang:'ja',letter:String(n),word:r[0],count:n,art:COUNT_ART[i],alts:r[2],sub:r[1]+' · '+kanji+' · '+n,speak:r[0]+'。'}; });

/* ======================= STORAGE ======================= */
var LS = {
  get:function(k,d){try{var v=localStorage.getItem('tw.'+k);return v==null?d:JSON.parse(v);}catch(e){return d;}},
  set:function(k,v){try{localStorage.setItem('tw.'+k,JSON.stringify(v));return true;}catch(e){alert('Could not save (storage full?). Try a smaller photo.');return false;}}
};
var settings = Object.assign({voiceMode:'neural', neuralVoice:NeuralTTS.VOICES[0].key, listen:true, sayLetter:true, pairs:3, matchMode:'pic'}, LS.get('settings',{}));
if(!NeuralTTS.VOICES.some(function(v){return v.key===settings.neuralVoice;})) settings.neuralVoice=NeuralTTS.VOICES[0].key;
function saveSettings(){LS.set('settings',settings);}
var neural = {state:'idle', err:null, pct:0};
var custom = LS.get('custom',[]);
var deckId = LS.get('deck','en'); if(['en','ja','num','my'].indexOf(deckId)<0) deckId='en';
var numLang = LS.get('numLang','en'); if(numLang!=='ja') numLang='en';
var pos = Object.assign({en:0,ja:0,numen:0,numja:0,my:0}, LS.get('pos',{}));

function firstChar(w){ var a=Array.from((w||'').trim()); return a.length? (/[a-z]/i.test(a[0])?a[0].toUpperCase():a[0]) : '?'; }
function myDeck(){ return custom.map(function(c){return {lang:c.lang,letter:c.letter||firstChar(c.word),word:c.word,emoji:c.emoji,img:c.img,art:c.art||null,alts:c.alts||[],sub:'',id:c.id};}); }
function deckById(id){ if(id==='en')return EN; if(id==='ja')return JA; if(id==='numen')return NUM_EN; if(id==='numja')return NUM_JA; return myDeck(); }
function curKey(){ return deckId==='num' ? 'num'+numLang : deckId; }
function deck(){ return deckById(curKey()); }
function isJa(){ var k=curKey(); return k==='ja'||k==='numja'; }

/* ======================= PICTURES ======================= */
var COUNT_ROWS = {1:[1],2:[2],3:[3],4:[2,2],5:[3,2],6:[3,3],7:[4,3],8:[4,4],9:[3,3,3],10:[5,5]};
var COUNT_ROWS_SQ = {1:[1],2:[2],3:[2,1],4:[2,2],5:[3,2],6:[3,3],7:[2,3,2],8:[3,2,3],9:[3,3,3],10:[3,4,3]};   // squarer, for small cards
function countSVG(n, key, square){
  var rows=(square?COUNT_ROWS_SQ:COUNT_ROWS)[n]||[n], maxr=Math.max.apply(null,rows), cell=100, W=maxr*cell, H=rows.length*cell, out='';
  var art=(ART[key]||ART.star);
  rows.forEach(function(cnt,ri){
    var x0=(W-cnt*cell)/2;
    for(var k=0;k<cnt;k++) out+=art.replace('<svg ','<svg x="'+(x0+k*cell+4)+'" y="'+(ri*cell+4)+'" width="'+(cell-8)+'" height="'+(cell-8)+'" ');
  });
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" role="img">'+out+'</svg>';
}
function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
function pictureHTML(it, square){
  if(it.img) return '<img alt="" src="'+esc(it.img)+'">';
  if(it.count) return countSVG(it.count, it.art, square);
  if(it.art && ART[it.art]) return ART[it.art];
  if(it.emoji) return '<span class="emo">'+esc(it.emoji)+'</span>';   // parent-supplied (custom words only)
  return ART.star;
}

/* ======================= DOM ======================= */
var $=function(id){return document.getElementById(id);};
var el={card:$('card'),pic:$('pic'),letter:$('letter'),word:$('word'),sub:$('sub'),status:$('status'),statusText:$('statusText'),
  play:$('play'),note:$('note'),progBar:$('progBar'),count:$('count'),bigstar:$('bigstar'),celebrate:$('celebrate')};
el.bigstar.innerHTML=ART.star; $('wStar').innerHTML=ART.star;

/* ======================= SOUNDS ======================= */
var actx=null;
function ctx(){ if(!actx){ var Cx=window.AudioContext||window.webkitAudioContext; if(Cx) actx=new Cx(); } if(actx&&actx.state==='suspended') actx.resume(); return actx; }
function chime(small){
  var c=ctx(); if(!c) return;
  var t=c.currentTime+0.02, notes=small?[659.25,783.99,1046.5]:[523.25,659.25,783.99,1046.5,1318.5];
  notes.forEach(function(f,i){
    ['triangle','sine'].forEach(function(type,j){
      var o=c.createOscillator(), g=c.createGain();
      o.type=type; o.frequency.value=f*(j?2:1);
      var st=t+i*0.09, vol=j?0.05:0.22;
      g.gain.setValueAtTime(0.0001,st); g.gain.exponentialRampToValueAtTime(vol,st+0.02); g.gain.exponentialRampToValueAtTime(0.0001,st+0.6);
      o.connect(g); g.connect(c.destination); o.start(st); o.stop(st+0.65);
    });
  });
}
function softPop(){
  var c=ctx(); if(!c) return; var o=c.createOscillator(), g=c.createGain(), t=c.currentTime;
  o.type='sine'; o.frequency.setValueAtTime(520,t); o.frequency.exponentialRampToValueAtTime(880,t+0.08);
  g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.12,t+0.01); g.gain.exponentialRampToValueAtTime(0.0001,t+0.15);
  o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+0.16);
}

/* ======================= VOICES (Web Speech, male-preferred) ======================= */
var synth = window.speechSynthesis || null;
var MALE = {
  en: [/daniel/i,/arthur/i,/google uk english male/i,/\bryan\b/i,/\bgeorge\b/i,/\bthomas\b/i,/\boliver\b/i,/\balfie\b/i,/\belliot\b/i,/\bethan\b/i,/\bnoah\b/i,/\bmalcolm\b/i,/\bguy\b/i,/\bdavid\b/i,/\bmark\b/i,/\bandrew\b/i,/\bbrian\b/i,/\bchristopher\b/i,/\beric\b/i,/\broger\b/i,/\bsteffan\b/i,/\balex\b/i,/\baaron\b/i,/\bfred\b/i,/\btom\b/i,/\bjames\b/i,/\brishi\b/i,/\bgordon\b/i,/\blee\b/i,/\bmale\b/i],
  ja: [/keita/i,/daichi/i,/naoki/i,/otoya/i,/hattori/i,/ichiro/i,/kenji/i,/takumi/i,/\bmale\b/i,/男性/]
};
var FEMALE = /female|serena|kate|libby|sonia|hazel|susan|fiona|moira|tessa|karen|samantha|victoria|zira|aria|jenny|emma|ava|allison|kyoko|nanami|ayumi|haruka|sayaka|o-ren|mizuki|mayu|shiori|aoi|nanako|martha|catherine|stephanie|amy|joanna|salli|kimberly|ivy|kendra|女性|google 日本語|google us english$/i;
function voiceList(){ return synth? synth.getVoices():[]; }
function pickVoice(lang, list){
  var vs=list||voiceList(); if(!vs.length) return null;
  var pref = lang==='ja' ? ['ja-JP','ja'] : ['en-GB','en-IE','en-AU','en-US','en'];
  function langRank(v){ var l=(v.lang||'').replace('_','-'); for(var i=0;i<pref.length;i++){ if(l.toLowerCase().indexOf(pref[i].toLowerCase())===0) return i; } return 99; }
  function maleRank(v){ var list=MALE[lang==='ja'?'ja':'en']; for(var i=0;i<list.length;i++) if(list[i].test(v.name)) return i; return -1; }
  var cands=vs.filter(function(v){return langRank(v)<99;});
  if(!cands.length) return null;
  cands.sort(function(a,b){
    function g(v){ return maleRank(v)>=0 ? 0 : (FEMALE.test(v.name)?2:1); }
    var d=g(a)-g(b); if(d) return d;
    d=langRank(a)-langRank(b); if(d) return d;
    var ma=maleRank(a), mb=maleRank(b); if(ma!==mb) return (ma<0?99:ma)-(mb<0?99:mb);
    var na=/natural|neural|premium|enhanced/i.test(a.name)?0:1, nb=/natural|neural|premium|enhanced/i.test(b.name)?0:1; return na-nb;
  });
  var v=cands[0];
  v._gender = maleRank(v)>=0?'male':(FEMALE.test(v.name)?'female':'unknown');
  return v;
}
var chosen={en:null,ja:null};
function refreshVoices(){ chosen.en=pickVoice('en'); chosen.ja=pickVoice('ja'); renderVoiceStatus(); }
var keepUtt=null;
function speakDevice(text, lang){
  return new Promise(function(resolve){
    if(!synth){ resolve(false); return; }
    try{ synth.cancel(); }catch(e){}
    var u=new SpeechSynthesisUtterance(text); keepUtt=u;
    var v=chosen[lang]||pickVoice(lang);
    u.lang = v ? v.lang : (lang==='ja'?'ja-JP':'en-GB');
    if(v) u.voice=v;
    u.rate = 0.8; u.pitch = lang==='ja' ? 1.1 : 1.0;
    var done=false; function fin(ok){ if(!done){done=true; clearTimeout(t); resolve(ok);} }
    u.onend=function(){fin(true);}; u.onerror=function(){fin(false);};
    var t=setTimeout(function(){fin(true);}, 1500+text.length*260);
    synth.speak(u);
  });
}

/* ======================= NEURAL (Piper) ======================= */
function neuralWanted(){ return settings.voiceMode==='neural' && NeuralTTS.supported(); }
function loadNeural(){
  if(!neuralWanted() || neural.state==='loading' || (neural.state==='ready' && NeuralTTS.isReady(settings.neuralVoice))) return;
  neural.state='loading'; neural.pct=0; renderVoiceStatus();
  NeuralTTS.load(settings.neuralVoice, function(p){ if(p.total){ neural.pct=Math.round(p.loaded*100/p.total); renderVoiceStatusThrottled(); } })
    .then(function(){ neural.state='ready'; neural.err=null; renderVoiceStatus(); prefetch(); })
    .catch(function(e){ neural.state='failed'; neural.err=String(e&&e.message||e); console.warn('Neural TTS failed, using device voice', e); renderVoiceStatus(); });
}
function englishText(item, wordOnly){
  if(item.speak) return item.speak;
  return !wordOnly && settings.sayLetter && item.letter && item.letter!==item.word ? item.letter+'. '+item.word+'.' : item.word+'.';
}
function japaneseText(item, wordOnly){
  if(item.count) return item.speak;
  if(wordOnly) return item.word;
  if(item.speak) return settings.sayLetter?item.speak:item.word;
  return settings.sayLetter && item.letter && item.letter!==item.word ? item.letter+'。 '+item.word : item.word;
}
var LS_SCALE=1.12;
function warm(items, wordOnly){
  if(neural.state!=='ready') return;
  items.forEach(function(it){ if(it && it.lang==='en') NeuralTTS.synth(englishText(it,wordOnly),{voiceKey:settings.neuralVoice, lengthScale:LS_SCALE}).catch(function(){}); });
}
function prefetch(){ var d=deck(), i=pos[curKey()]||0; if(d.length) warm([d[i], d[(i+1)%d.length]]); }
function sayText(text, lang){
  if(lang==='en' && neuralWanted() && neural.state==='ready'){
    return NeuralTTS.play(text,{voiceKey:settings.neuralVoice, lengthScale:LS_SCALE, audioCtx:ctx()})
      .then(function(){return true;}).catch(function(e){ console.warn('neural play failed', e); return speakDevice(text,'en'); });
  }
  return speakDevice(text, lang);
}
function say(item, wordOnly){ return item.lang==='en' ? sayText(englishText(item,wordOnly),'en') : sayText(japaneseText(item,wordOnly),'ja'); }
function hush(){ try{synth&&synth.cancel();}catch(e){} NeuralTTS.stop(); }

/* ======================= SPEECH RECOGNITION ======================= */
var SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
var micBlocked=false;
function listen(lang, ms){
  return new Promise(function(resolve){
    if(!SR || micBlocked){ resolve({supported:false,heard:[]}); return; }
    var r, heard=[], finished=false, gotSpeech=false;
    try{ r=new SR(); }catch(e){ resolve({supported:false,heard:[]}); return; }
    r.lang = lang==='ja'?'ja-JP':'en-US';
    r.interimResults=true; r.maxAlternatives=5; r.continuous=false;
    function fin(extra){ if(finished) return; finished=true; clearTimeout(t); try{r.abort();}catch(e){} resolve(Object.assign({supported:true,heard:heard,speech:gotSpeech||heard.length>0},extra||{})); }
    r.onresult=function(ev){
      for(var i=0;i<ev.results.length;i++){ for(var j=0;j<ev.results[i].length;j++){ var tr=ev.results[i][j].transcript; if(tr&&heard.indexOf(tr)<0) heard.push(tr); } }
      if(currentMatch(heard)) fin({matched:true});
    };
    r.onspeechstart=function(){ gotSpeech=true; };
    r.onerror=function(ev){ if(ev.error==='not-allowed'||ev.error==='service-not-allowed'){ micBlocked=true; fin({blocked:true}); } else fin({error:ev.error}); };
    r.onend=function(){ fin(); };
    var t=setTimeout(function(){ try{r.stop();}catch(e){} setTimeout(function(){fin();},700); }, ms||6000);
    try{ r.start(); }catch(e){ fin({error:'start-failed'}); }
  });
}

/* ---------- lenient matching ---------- */
function kataToHira(s){ return s.replace(/[\u30a1-\u30f6]/g,function(c){return String.fromCharCode(c.charCodeAt(0)-0x60);}); }
function norm(s, lang){
  s=(s||'').normalize('NFKC').toLowerCase().trim();
  if(lang==='ja'){ s=kataToHira(s); return s.replace(/[\s、。・ー,.!?！？「」]/g,''); }
  return s.replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
}
function lev(a,b){ a=Array.from(a); b=Array.from(b); var m=a.length,n=b.length; if(!m) return n; if(!n) return m;
  var p=new Array(n+1),q=new Array(n+1),i,j; for(j=0;j<=n;j++)p[j]=j;
  for(i=1;i<=m;i++){ q[0]=i; for(j=1;j<=n;j++){ q[j]=Math.min(p[j]+1,q[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1)); } var x=p;p=q;q=x; } return p[n]; }
function matches(heard, item){
  var targets=[item.word].concat(item.alts||[]).map(function(t){return norm(t,item.lang);}).filter(Boolean);
  if(item.lang==='en' && item.letter && /^[a-z]$/i.test(item.letter)) targets.push(item.letter.toLowerCase());
  for(var h=0;h<heard.length;h++){
    var s=norm(heard[h],item.lang); if(!s) continue;
    var sNoSp=s.replace(/\s/g,'');
    for(var k=0;k<targets.length;k++){
      var t=targets[k], tNoSp=t.replace(/\s/g,'');
      if(s===t || sNoSp===tNoSp) return true;
      if(item.lang==='en'){
        if(tNoSp.length>=2 && (' '+s+' ').indexOf(' '+t+' ')>=0) return true;
        if(tNoSp.length>=3 && sNoSp.indexOf(tNoSp)>=0) return true;
        var words=s.split(' ').concat([sNoSp]);
        for(var w=0;w<words.length;w++){ var lim=Math.max(1,Math.round(tNoSp.length*0.4)); if(tNoSp.length>=3 && lev(words[w],tNoSp)<=lim) return true; }
      } else {
        var L=Array.from(tNoSp).length;
        if(L>=2 && sNoSp.indexOf(tNoSp)>=0) return true;
        if(L>=3 && lev(sNoSp,tNoSp)<=Math.max(1,Math.round(L*0.34))) return true;
        if(L===1 && Array.from(sNoSp).length<=3 && sNoSp.indexOf(tNoSp)>=0) return true;
      }
    }
  }
  return false;
}
function currentMatch(heard){ var it=deck()[pos[curKey()]||0]; return it?matches(heard,it):false; }

/* ======================= CARD LOOP ======================= */
var busy=false, attempts=0, advanceTimer=null, runId=0;
function setStatus(kind,html){ el.status.className='status '+(kind||''); el.statusText.innerHTML=html||'&nbsp;'; }
function note(t){ el.note.textContent=t||''; }
function T(en,ja){ return isJa()?ja:en; }

function render(anim){
  var d=deck(), key=curKey();
  document.body.className='deck-'+deckId;
  document.querySelectorAll('.tab').forEach(function(b){b.classList.toggle('on',b.dataset.deck===deckId);});
  $('numToggle').classList.toggle('hidden', deckId!=='num');
  document.querySelectorAll('#numToggle button').forEach(function(b){ b.classList.toggle('on', b.dataset.nl===numLang); });
  document.documentElement.lang = isJa()?'ja':'en';
  attempts=0; clearTimeout(advanceTimer);
  if(!d.length){
    el.pic.innerHTML=ART.book; el.letter.textContent=''; el.letter.style.display='none'; el.word.textContent='Ask a grown-up to add words!';
    el.word.style.fontSize='clamp(22px,5vmin,34px)'; el.sub.textContent='Press & hold the gear for 3 seconds → My Words';
    el.play.disabled=true; el.progBar.style.width='0'; el.count.textContent='0 / 0'; setStatus('',''); return;
  }
  el.play.disabled=false; el.word.style.fontSize='';
  var i=pos[key]=Math.min(Math.max(0,pos[key]||0),d.length-1);
  var it=d[i];
  el.pic.innerHTML=pictureHTML(it);
  el.letter.textContent=it.letter||'';
  el.letter.style.display = (it.letter && it.letter!==it.word) ? '' : 'none';
  el.word.textContent=it.word;
  el.word.lang = it.lang; el.letter.lang = it.lang;
  el.sub.textContent=it.sub||'';
  el.progBar.style.width=((i+1)/d.length*100)+'%';
  el.count.textContent=(i+1)+' / '+d.length;
  setStatus('', T('Tap ','おして ')+icon('play'));
  if(anim){ el.card.classList.remove('pop'); void el.card.offsetWidth; el.card.classList.add('pop'); }
  LS.set('pos',pos); LS.set('deck',deckId); LS.set('numLang',numLang);
  prefetch();
}
function go(delta){
  var d=deck(); if(!d.length) return;
  runId++; stopAll();
  var key=curKey(); pos[key]=((pos[key]||0)+delta+d.length)%d.length;
  render(true);
}
function stopAll(){ busy=false; el.play.classList.remove('busy'); hush(); clearTimeout(advanceTimer); }
function confetti(n){
  var colors=['#ff4f8b','#ffd84d','#4fb3ff','#2ec27e','#ff7a59','#a970ff'];
  for(var k=0;k<n;k++){
    var c=document.createElement('div'); c.className='confetti';
    c.style.left=(Math.random()*100)+'vw'; c.style.background=colors[k%colors.length];
    c.style.animationDuration=(1.2+Math.random()*1.3)+'s'; c.style.animationDelay=(Math.random()*0.3)+'s';
    if(k%3===0){ c.style.borderRadius='50%'; c.style.width=c.style.height='12px'; }
    el.celebrate.appendChild(c);
    setTimeout(function(nd){return function(){nd.remove();};}(c), 3000);
  }
}
function celebrate(){
  var my=++runId; stopAll();
  chime();
  setStatus('ok', T('Yay! ','やったね！ ')+icon('star'));
  el.card.classList.remove('win'); void el.card.offsetWidth; el.card.classList.add('win');
  el.bigstar.classList.remove('go'); void el.bigstar.offsetWidth; el.bigstar.classList.add('go');
  confetti(46);
  advanceTimer=setTimeout(function(){ if(my===runId) go(1); }, 1600);
}
async function playRound(){
  if(busy) return;
  var d=deck(); if(!d.length) return;
  ctx();
  var my=++runId; busy=true; el.play.classList.add('busy');
  var it=d[pos[curKey()]];
  setStatus('speaking', T('Listen ','きいてね ')+icon('ear'));
  await say(it);
  if(my!==runId) return;
  if(!settings.listen){ busy=false; el.play.classList.remove('busy'); setStatus('', T('Now you say it!','いってみよう！')); return; }
  if(!SR || micBlocked){
    busy=false; el.play.classList.remove('busy');
    setStatus('', T('Your turn!','いってみよう！'));
    note(!SR ? 'Speech recognition isn’t available in this browser — say it together, then tap “Good job” or “Next”. (Chrome/Edge support listening.)'
             : 'Microphone is blocked — allow mic access for this site, or use “Good job” / “Next”.');
    return;
  }
  await new Promise(function(r){setTimeout(r,250);});
  if(my!==runId) return;
  setStatus('listening', T('Your turn','いってみて'));
  var res=await listen(it.lang, 6000);
  if(my!==runId) return;
  busy=false; el.play.classList.remove('busy');
  if(res.blocked || !res.supported){ setStatus('', T('Your turn!','いってみよう！')); note('Microphone is blocked or unavailable — allow mic access, or use “Good job” / “Next”.'); return; }
  attempts++;
  var ok = res.matched || matches(res.heard||[], it);
  if(!ok && attempts>=2 && (res.speech || (res.heard&&res.heard.length))) ok=true;   // generous with toddlers
  if(window.TW_DEBUG) console.log('heard', res.heard, 'attempt', attempts, 'ok', ok);
  if(ok){ celebrate(); return; }
  setStatus('', T('Again! ','もういっかい！ ')+icon('again'));
}

/* ======================= MATCH GAME ======================= */
var M = {deck:null, cards:[], open:[], lock:false, matched:0, pairs:0, timer:null};
var MATCH_DECKS = [
  {id:'en', label:'ABC', pv:function(){return ART.apple;}},
  {id:'ja', label:'あいう', pv:function(){return ART.ant;}},
  {id:'numen', label:'1 2 3', pv:function(){return countSVG(3,'star');}},
  {id:'numja', label:'いち に さん', pv:function(){return countSVG(3,'flower');}},
  {id:'my', label:'My Words', pv:function(){ var d=myDeck(); return d.length? pictureHTML(d[0]) : ART.star; }, wide:true}
];
function openMatch(){ runId++; stopAll(); $('matchView').classList.add('open'); showPicker(); }
function closeMatch(){ clearTimeout(M.timer); hush(); $('matchView').classList.remove('open'); $('mWin').classList.remove('show'); render(true); }
function showPicker(){
  clearTimeout(M.timer); hush();
  $('mWin').classList.remove('show'); $('mGrid').classList.add('hidden'); $('mPick').classList.remove('hidden');
  $('mTitle').textContent='Match!'; $('mBack').style.visibility='hidden';
  var box=$('mPick'); box.innerHTML='';
  MATCH_DECKS.forEach(function(md){
    var b=document.createElement('button'); if(md.wide) b.className='wide';
    if(deckById(md.id).length<2) b.disabled=true;
    b.innerHTML='<div class="pv">'+md.pv()+'</div><div>'+md.label+'</div>';
    b.addEventListener('click', function(){ ctx(); startMatch(md.id); });
    box.appendChild(b);
  });
}
function shuffle(a){ for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)), t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function picKey(it){ return it.img ? 'img:'+it.id : it.count ? 'n'+it.count : it.art ? 'art:'+it.art : it.emoji ? 'emo:'+it.emoji : 'w:'+it.word; }
function startMatch(id){
  M.deck=id; clearTimeout(M.timer); hush();
  var seen={}, pool=[];
  shuffle(deckById(id).slice()).forEach(function(it){ var k=picKey(it); if(!seen[k]){ seen[k]=1; pool.push(it); } });
  var n=Math.max(1,Math.min(6, Math.max(2,+settings.pairs||3), pool.length));
  var picked=pool.slice(0,n), cards=[];
  picked.forEach(function(it,idx){
    cards.push({pair:idx, item:it, kind:'pic'});
    cards.push({pair:idx, item:it, kind: settings.matchMode==='letter' ? 'label' : 'pic'});
  });
  M.cards=shuffle(cards); M.open=[]; M.lock=false; M.matched=0; M.pairs=n;
  var md=MATCH_DECKS.filter(function(x){return x.id===id;})[0];
  $('mTitle').textContent=md?md.label:'Match!'; $('mBack').style.visibility='visible';
  $('mPick').classList.add('hidden'); $('mWin').classList.remove('show');
  var grid=$('mGrid'); grid.classList.remove('hidden'); grid.innerHTML='';
  M.cards.forEach(function(c,i){
    var b=document.createElement('button'); b.className='mcard'; b.setAttribute('aria-label','card '+(i+1));
    var face;
    if(c.kind==='label'){
      var gl = (id==='my') ? c.item.word : c.item.letter;
      face='<div class="art"><span class="glyph" style="font-size:'+(Array.from(gl).length>2?'1.7em':'3.6em')+'">'+esc(gl)+'</span></div>';
    } else {
      face='<div class="art">'+pictureHTML(c.item, true)+'</div><div class="cap">'+esc(c.item.word)+'</div>';
    }
    b.innerHTML='<div class="inner"><div class="backside">'+ART_BACK+'</div><div class="face">'+face+'</div></div>';
    b.addEventListener('click', function(){ flip(i); });
    c.el=b; grid.appendChild(b);
  });
  layoutGrid();
  warm(picked, true);
}
function layoutGrid(){
  var grid=$('mGrid'), body=$('mBody'); if(grid.classList.contains('hidden') || !M.cards.length) return;
  var n=M.cards.length, W=body.clientWidth-24, H=body.clientHeight-24, gap=12, best=null;
  for(var cols=1; cols<=n; cols++){
    var rows=Math.ceil(n/cols), w=(W-gap*(cols-1))/cols, h=(H-gap*(rows-1))/rows;
    var cw=Math.min(w, h*0.8);
    if(!best || cw>best.cw+0.5) best={cols:cols, cw:cw};
  }
  var cw=Math.floor(Math.max(60, Math.min(best.cw, 230))), ch=Math.floor(cw/0.8);
  grid.style.gridTemplateColumns='repeat('+best.cols+','+cw+'px)';
  M.cards.forEach(function(c){ c.el.style.width=cw+'px'; c.el.style.height=ch+'px'; c.el.style.fontSize=Math.max(12,Math.floor(cw/8))+'px'; });
}
window.addEventListener('resize', layoutGrid);
function sparkleAt(elm){
  var r=elm.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2;
  for(var k=0;k<8;k++){
    var s=document.createElement('div'); s.className='sparkle'; s.innerHTML=ICONS.star;
    var a=k*Math.PI/4, d=70+Math.random()*30;
    s.style.left=(cx-17)+'px'; s.style.top=(cy-17)+'px'; s.style.setProperty('--dx',Math.cos(a)*d+'px'); s.style.setProperty('--dy',Math.sin(a)*d+'px');
    document.body.appendChild(s); setTimeout(function(nd){return function(){nd.remove();};}(s), 1000);
  }
}
function flip(i){
  var c=M.cards[i];
  if(!c || M.lock || c.up || c.done) return;
  ctx(); softPop();
  c.up=true; c.el.classList.add('up'); M.open.push(c);
  say(c.item, true);
  if(M.open.length<2) return;
  var a=M.open[0], z=M.open[1]; M.open=[]; M.lock=true;
  if(a.pair===z.pair){
    M.timer=setTimeout(function(){
      a.done=z.done=true; a.el.classList.add('done','bump'); z.el.classList.add('done','bump');
      chime(true); sparkleAt(a.el); sparkleAt(z.el);
      setTimeout(function(){ say(a.item, true); }, 350);
      M.matched++; M.lock=false;
      if(M.matched===M.pairs) M.timer=setTimeout(win, 1500);
    }, 450);
  } else {
    M.timer=setTimeout(function(){ a.up=z.up=false; a.el.classList.remove('up'); z.el.classList.remove('up'); M.lock=false; }, 1200);
  }
}
function win(){
  var ja = (M.deck==='ja'||M.deck==='numja');
  $('wText').textContent = ja ? 'やったね！' : 'Yay! You did it!';
  $('mWin').classList.add('show'); chime(); confetti(60);
  sayText(ja ? 'やったね！ すごい！' : 'Well done! Brilliant!', ja?'ja':'en');
}
$('matchBtn').addEventListener('click', openMatch);
$('mHome').addEventListener('click', closeMatch);
$('mBack').addEventListener('click', showPicker);
$('wAgain').addEventListener('click', function(){ startMatch(M.deck); });
$('wOther').addEventListener('click', showPicker);

/* ======================= EVENTS ======================= */
el.play.addEventListener('click', playRound);
$('nextBtn').addEventListener('click', function(){ go(1); });
$('prevBtn').addEventListener('click', function(){ go(-1); });
$('goodBtn').addEventListener('click', function(){ if(deck().length){ ctx(); celebrate(); } });
document.querySelectorAll('.tab').forEach(function(b){ b.addEventListener('click', function(){
  if(deckId===b.dataset.deck) return; runId++; stopAll(); deckId=b.dataset.deck; note(''); render(true);
});});
document.querySelectorAll('#numToggle button').forEach(function(b){ b.addEventListener('click', function(){
  if(numLang===b.dataset.nl) return; runId++; stopAll(); numLang=b.dataset.nl; render(true);
});});
document.addEventListener('dblclick', function(e){ e.preventDefault(); }, {passive:false});
document.addEventListener('gesturestart', function(e){ e.preventDefault(); }, {passive:false});
var lastTouch=0; document.addEventListener('touchend', function(e){ var t=Date.now(); if(t-lastTouch<300 && !e.target.closest('input,select,textarea')) e.preventDefault(); lastTouch=t; }, {passive:false});
document.addEventListener('contextmenu', function(e){ if(!e.target.closest('.modal')) e.preventDefault(); });
document.addEventListener('keydown', function(e){ if($('modal').classList.contains('open')||$('matchView').classList.contains('open')) return;
  if(e.key===' '||e.key==='Enter'){ e.preventDefault(); playRound(); } else if(e.key==='ArrowRight') go(1); else if(e.key==='ArrowLeft') go(-1); });

/* ---------- parent gate: press & hold 3 s ---------- */
var gear=$('gear'), holdT=null;
function holdStart(e){ e.preventDefault(); gear.classList.add('holding'); holdT=setTimeout(function(){ gear.classList.remove('holding'); holdT=null; openParent(); }, 3000); }
function holdEnd(){ if(holdT){ clearTimeout(holdT); holdT=null; } if(gear.classList.contains('holding')){ gear.classList.remove('holding'); var h=$('gateHint'); h.classList.add('show'); setTimeout(function(){h.classList.remove('show');},2000);} }
gear.addEventListener('pointerdown', holdStart);
['pointerup','pointerleave','pointercancel'].forEach(function(ev){ gear.addEventListener(ev, holdEnd); });
gear.addEventListener('click', function(e){ e.preventDefault(); });
function openParent(pane){ runId++; stopAll(); $('modal').classList.add('open'); showPane(pane||'words'); renderList(); renderVoiceStatus(); }
function closeParent(){ $('modal').classList.remove('open'); render(true); }
$('closeModal').addEventListener('click', closeParent);
function showPane(p){ document.querySelectorAll('.stab').forEach(function(b){b.classList.toggle('on',b.dataset.pane===p);}); $('pane-words').classList.toggle('hidden',p!=='words'); $('pane-voice').classList.toggle('hidden',p!=='voice'); }
document.querySelectorAll('.stab').forEach(function(b){ b.addEventListener('click', function(){ showPane(b.dataset.pane); }); });

/* ---------- custom words ---------- */
var pendingImg=null;
Object.keys(ART).sort().forEach(function(k){ var o=document.createElement('option'); o.value=k; o.textContent=ART_LABELS[k]||k; $('fArt').appendChild(o); });
function updatePreview(){
  var pv=$('preview');
  if(pendingImg){ pv.innerHTML=''; var p=new Image(); p.src=pendingImg; pv.appendChild(p); }
  else if($('fArt').value){ pv.innerHTML='<span style="display:inline-block;width:80px;height:80px">'+ART[$('fArt').value]+'</span>'; }
  else pv.textContent=$('fEmoji').value;
}
$('fImg').addEventListener('change', function(){
  var f=this.files&&this.files[0]; pendingImg=null; updatePreview();
  if(!f) return;
  var fr=new FileReader();
  fr.onload=function(){ var im=new Image(); im.onload=function(){
      var max=480, s=Math.min(1,max/Math.max(im.width,im.height)), cv=document.createElement('canvas');
      cv.width=Math.round(im.width*s); cv.height=Math.round(im.height*s);
      cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);
      pendingImg=cv.toDataURL('image/jpeg',0.82); updatePreview();
    }; im.src=fr.result; };
  fr.readAsDataURL(f);
});
$('fEmoji').addEventListener('input', updatePreview);
$('fArt').addEventListener('change', updatePreview);
$('addForm').addEventListener('submit', function(e){
  e.preventDefault();
  var w=$('fWord').value.trim(); if(!w){ $('fWord').focus(); return; }
  var item={ id:Date.now().toString(36)+Math.random().toString(36).slice(2,6), word:w, lang:$('fLang').value,
    emoji:$('fEmoji').value.trim(), img:pendingImg, art:$('fArt').value||null, letter:$('fLetter').value.trim(),
    alts:$('fAlt').value.split(/[,、，]/).map(function(s){return s.trim();}).filter(Boolean) };
  var next=custom.concat([item]);
  if(!LS.set('custom',next)) return;
  custom=next; this.reset(); pendingImg=null; updatePreview(); renderList();
  if(deckId==='my'){ pos.my=custom.length-1; }
});
function renderList(){
  var ul=$('wlist'); ul.innerHTML=''; $('myCount').textContent=custom.length; $('emptyMsg').classList.toggle('hidden',custom.length>0);
  myDeck().forEach(function(c){
    var li=document.createElement('li');
    var p=document.createElement('div'); p.className='wpic'; p.innerHTML=pictureHTML(c);
    var t=document.createElement('div'); t.className='wtxt'; t.textContent=c.word;
    var sm=document.createElement('small'); sm.textContent=(c.lang==='ja'?'日本語':'English')+(c.letter?' · '+c.letter:'')+(c.alts&&c.alts.length?' · also: '+c.alts.join(', '):''); t.appendChild(sm);
    var s=document.createElement('button'); s.className='say'; s.innerHTML=icon('speaker'); s.title='Play';
    s.onclick=function(){ ctx(); say({lang:c.lang,word:c.word,letter:'',alts:[]}); };
    var d=document.createElement('button'); d.className='del'; d.textContent='Delete';
    d.onclick=function(){ if(!confirm('Delete “'+c.word+'”?')) return; custom=custom.filter(function(x){return x.id!==c.id;}); LS.set('custom',custom); renderList(); };
    li.appendChild(p); li.appendChild(t); li.appendChild(s); li.appendChild(d); ul.appendChild(li);
  });
}

/* ---------- settings ---------- */
var sNeural=$('sNeural');
NeuralTTS.VOICES.forEach(function(v){ var o=document.createElement('option'); o.value=v.key; o.textContent=v.label; sNeural.appendChild(o); });
$('sVoiceMode').value=settings.voiceMode; sNeural.value=settings.neuralVoice; $('sListen').checked=settings.listen; $('sSayLetter').checked=settings.sayLetter;
$('sPairs').value=String(settings.pairs); $('sMatchMode').value=settings.matchMode;
$('sVoiceMode').addEventListener('change', function(){ settings.voiceMode=this.value; saveSettings(); loadNeural(); renderVoiceStatus(); });
sNeural.addEventListener('change', function(){ settings.neuralVoice=this.value; saveSettings(); neural.state='idle'; loadNeural(); });
$('sListen').addEventListener('change', function(){ settings.listen=this.checked; saveSettings(); });
$('sSayLetter').addEventListener('change', function(){ settings.sayLetter=this.checked; saveSettings(); });
$('sPairs').addEventListener('change', function(){ settings.pairs=+this.value; saveSettings(); });
$('sMatchMode').addEventListener('change', function(){ settings.matchMode=this.value; saveSettings(); });
$('testEn').addEventListener('click', function(){ ctx(); sayText('Good morning. Shall we learn some letters?','en'); });
$('testJa').addEventListener('click', function(){ ctx(); sayText('おはよう。 いっしょに あいうえおを いおう。','ja'); });
var rvT=0; function renderVoiceStatusThrottled(){ var t=Date.now(); if(t-rvT>250){ rvT=t; renderVoiceStatus(); } }
function renderVoiceStatus(){
  var ns=$('neuralStat'), ds=$('deviceStat'); if(!ns) return;
  var label=(NeuralTTS.VOICES.filter(function(v){return v.key===settings.neuralVoice;})[0]||{}).label||settings.neuralVoice;
  if(settings.voiceMode!=='neural') ns.textContent='Neural voice: off (using device voice for English).';
  else if(!NeuralTTS.supported()) ns.textContent='Neural voice unavailable here (open via http://localhost or https, not file://). Using device voice.';
  else if(neural.state==='loading') ns.textContent='Neural voice: loading '+label+'… '+neural.pct+'%';
  else if(neural.state==='ready') ns.textContent='Neural voice: ready — '+label;
  else if(neural.state==='failed') ns.textContent='Neural voice failed to load ('+neural.err+'). Falling back to device voice.';
  else ns.textContent='Neural voice: not loaded yet.';
  function d(v){ return v ? v.name+' ('+v.lang+', '+v._gender+(v._gender==='female'?' — no male voice installed':'')+')' : 'none found'; }
  ds.innerHTML=''; ds.appendChild(document.createTextNode('Device English fallback: '+d(chosen.en))); ds.appendChild(document.createElement('br'));
  ds.appendChild(document.createTextNode('Device Japanese: '+d(chosen.ja)));
  if(!synth) ds.textContent='This browser has no speechSynthesis.';
}

/* ======================= BOOT ======================= */
if(synth){ refreshVoices(); if('onvoiceschanged' in synth) synth.onvoiceschanged=refreshVoices; setTimeout(refreshVoices,800); }
render(false);
if(!SR) note('Listening needs Chrome or Edge. You can still play words and use “Good job” / “Next”.');
loadNeural();
window.TW = {matches:matches, deck:deck, deckById:deckById, EN:EN, JA:JA, NUM_EN:NUM_EN, NUM_JA:NUM_JA, settings:settings, neural:neural, chosen:chosen,
  openParent:openParent, pickVoice:pickVoice, go:go, celebrate:celebrate, openMatch:openMatch, startMatch:startMatch, showPicker:showPicker, M:M, flip:flip, pictureHTML:pictureHTML};
})();
