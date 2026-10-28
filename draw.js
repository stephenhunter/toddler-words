/* Toddler Words v7 — Draw: a white canvas with big colour swatches. Requires app.js (window.TW). */
(function(){
'use strict';
var $=function(id){return document.getElementById(id);};
var COLORS=[
  {c:'#e8262d',en:'Red.',ja:'あか'},{c:'#ff8a1f',en:'Orange.',ja:'オレンジ'},{c:'#ffd21f',en:'Yellow.',ja:'きいろ'},
  {c:'#8fd93a',en:'Light green.',ja:'きみどり'},{c:'#1fa64a',en:'Green.',ja:'みどり'},{c:'#4cc3f5',en:'Light blue.',ja:'みずいろ'},
  {c:'#2364e0',en:'Blue.',ja:'あお'},{c:'#8a3fd1',en:'Purple.',ja:'むらさき'},{c:'#ff6fb5',en:'Pink.',ja:'ピンク'},
  {c:'#d4a017',en:'Gold.',ja:'きんいろ'},{c:'#8b5a2b',en:'Brown.',ja:'ちゃいろ'},{c:'#222222',en:'Black.',ja:'くろ'},
  {c:'#ffffff',en:'White.',ja:'しろ',eraser:true}];
var SIZES=[7,16,32];
var IC={
  undo:'<svg viewBox="0 0 24 24"><path d="M9 5L4 10l5 5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.5 10H14a5.5 5.5 0 0 1 0 11h-3" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
  bin:'<svg viewBox="0 0 24 24"><path d="M5 7h14l-1.2 13a1.6 1.6 0 0 1-1.6 1.4H7.8A1.6 1.6 0 0 1 6.2 20z" fill="#ff9aa8" stroke="#3b2b5a" stroke-width="1.6" stroke-linejoin="round"/><path d="M3.5 7h17M9.5 7V4.2h5V7" fill="none" stroke="#3b2b5a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11v6.5M14 11v6.5" stroke="#3b2b5a" stroke-width="1.5" stroke-linecap="round"/></svg>',
  save:'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="15" rx="2.5" fill="#bfe8ff" stroke="#3b2b5a" stroke-width="1.6"/><path d="M3.8 16.5l5-5 4 4 2.5-2.5 4.9 4.9" fill="#7cc96a" stroke="#3b2b5a" stroke-width="1.4" stroke-linejoin="round"/><circle cx="16" cy="8.5" r="1.9" fill="#ffd84d" stroke="#3b2b5a" stroke-width="1.2"/><path d="M12 13v8.5M9 18.5l3 3 3-3" fill="none" stroke="#ff4f8b" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  eraser:'<svg viewBox="0 0 24 24"><path d="M3.5 15.5l8.8-8.8a2 2 0 0 1 2.8 0l3.9 3.9a2 2 0 0 1 0 2.8L13.5 19H7z" fill="#ffc2d1" stroke="#3b2b5a" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.6 10.4l6.7 6.7" stroke="#3b2b5a" stroke-width="1.4"/><path d="M7 19h13" stroke="#3b2b5a" stroke-width="1.5" stroke-linecap="round"/></svg>'};

var S={strokes:[], live:{}, color:COLORS[0].c, size:1, baseW:0, baseH:0, scale:1, ox:0, oy:0, dpr:1, W:0, H:0};
var cv, g;

function build(){
  var v=$('drawView'); cv=$('dCanvas'); g=cv.getContext('2d');
  var sw=$('dSwatches');
  COLORS.forEach(function(k,i){
    var b=document.createElement('button'); b.className='dsw'+(k.eraser?' eraser':''); b.style.setProperty('--c',k.c);
    b.setAttribute('aria-label', k.eraser?'Eraser':k.en.replace('.','')); b.dataset.i=i;
    if(k.eraser) b.innerHTML=IC.eraser;
    b.addEventListener('click', function(){ pick(i, true); });
    sw.appendChild(b);
  });
  var sz=$('dSizes');
  SIZES.forEach(function(s,i){
    var b=document.createElement('button'); b.className='dsz'; b.dataset.i=i; b.setAttribute('aria-label',['Thin','Medium','Fat'][i]+' brush');
    b.innerHTML='<span style="width:'+(8+i*9)+'px;height:'+(8+i*9)+'px"></span>';
    b.addEventListener('click', function(){ S.size=i; syncUI(); pop(); });
    sz.appendChild(b);
  });
  $('dUndo').innerHTML=IC.undo+'<span>Undo</span>';
  $('dClear').innerHTML='<svg class="ring" viewBox="0 0 44 44"><circle cx="22" cy="22" r="19"/></svg>'+IC.bin+'<span>Clear</span>';
  $('dSave').innerHTML=IC.save+'<span>Save</span>';
  $('dUndo').addEventListener('click', undo);
  $('dSave').addEventListener('click', save);
  holdButton($('dClear'), 900, clearAll);

  cv.addEventListener('pointerdown', down);
  cv.addEventListener('pointermove', move);
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up); cv.addEventListener('lostpointercapture', up);
  cv.addEventListener('touchstart', function(e){ e.preventDefault(); }, {passive:false});
  cv.addEventListener('touchmove', function(e){ e.preventDefault(); }, {passive:false});
  cv.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  window.addEventListener('resize', function(){ if(isOpen()) layout(); });
  window.addEventListener('orientationchange', function(){ setTimeout(function(){ if(isOpen()) layout(); }, 250); });
  if(window.ResizeObserver) new ResizeObserver(function(){ if(isOpen()) layout(); }).observe($('dStage'));
  syncUI();
}
function pop(){ try{ window.TW && TW.ctx && TW.ctx(); TW.softPop && TW.softPop(); }catch(e){} }
function lang(){ try{ return TW.drawLang(); }catch(e){ return 'en'; } }
function pick(i, speak){
  var k=COLORS[i]; S.color=k.c; syncUI(); pop();
  if(speak && window.TW && TW.sayText){ try{ TW.hush(); var l=lang(); TW.sayText(l==='ja'?k.ja:k.en, l, {}); }catch(e){} }
}
function syncUI(){
  document.querySelectorAll('#dSwatches .dsw').forEach(function(b){ var on=COLORS[+b.dataset.i].c===S.color; b.classList.toggle('on',on); b.setAttribute('aria-pressed',on?'true':'false'); });
  document.querySelectorAll('#dSizes .dsz').forEach(function(b){ b.classList.toggle('on', +b.dataset.i===S.size); });
  $('dSizes').style.setProperty('--c', S.color==='#ffffff' ? '#c9c2d6' : S.color);
  $('dUndo').disabled=!S.strokes.length;
}
// The drawing lives in "world" coordinates (CSS px of the first layout); later sizes scale it to fit, so nothing is lost.
function layout(){
  var st=$('dStage'), r=st.getBoundingClientRect(), W=Math.max(1,Math.round(r.width)), H=Math.max(1,Math.round(r.height)), dpr=Math.min(window.devicePixelRatio||1, 3);
  if(W===S.W && H===S.H && dpr===S.dpr) return;
  if(!S.baseW){ S.baseW=W; S.baseH=H; }
  S.W=W; S.H=H; S.dpr=dpr;
  cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr); cv.style.width=W+'px'; cv.style.height=H+'px';
  S.scale=Math.min(W/S.baseW, H/S.baseH); S.ox=(W-S.baseW*S.scale)/2; S.oy=(H-S.baseH*S.scale)/2;
  redraw();
}
function setT(){ g.setTransform(S.dpr*S.scale,0,0,S.dpr*S.scale,S.dpr*S.ox,S.dpr*S.oy); }
function redraw(){
  g.setTransform(1,0,0,1,0,0); g.fillStyle='#fff'; g.fillRect(0,0,cv.width,cv.height); setT();
  var from=0; for(var i=S.strokes.length-1;i>=0;i--) if(S.strokes[i].clear){ from=i+1; break; }
  for(var j=from;j<S.strokes.length;j++) drawStroke(S.strokes[j], 0);
  for(var id in S.live) drawStroke(S.live[id], 0);
}
function drawStroke(s, fromIdx){
  var p=s.pts; g.strokeStyle=g.fillStyle=s.color; g.lineWidth=s.w; g.lineCap='round'; g.lineJoin='round';
  if(p.length===1 || (fromIdx===0 && p.length===2 && p[0][0]===p[1][0] && p[0][1]===p[1][1])){ g.beginPath(); g.arc(p[0][0],p[0][1],s.w/2,0,Math.PI*2); g.fill(); if(p.length===1) return; }
  var start=Math.max(1, fromIdx);
  for(var i=start;i<p.length;i++) seg(p, i, s);
}
// segment i: from midpoint(i-2,i-1) [or p0] via control p[i-1] to midpoint(i-1,i)
function seg(p, i){
  var a=i>=2 ? mid(p[i-2],p[i-1]) : p[0], b=mid(p[i-1],p[i]);
  g.beginPath(); g.moveTo(a[0],a[1]); if(i>=2) g.quadraticCurveTo(p[i-1][0],p[i-1][1],b[0],b[1]); else g.lineTo(b[0],b[1]); g.stroke();
}
function mid(a,b){ return [(a[0]+b[0])/2,(a[1]+b[1])/2]; }
function toWorld(e){ var r=cv.getBoundingClientRect(); return [ (e.clientX-r.left-S.ox)/S.scale, (e.clientY-r.top-S.oy)/S.scale ]; }
function down(e){
  if(e.pointerType==='mouse' && e.button!==0) return;
  e.preventDefault(); try{ cv.setPointerCapture(e.pointerId); }catch(_){}
  if(Object.keys(S.live).length>=5) return;
  var s={color:S.color, w:SIZES[S.size]/S.scale*(S.baseW?1:1), pts:[toWorld(e)]};
  s.w=SIZES[S.size]/Math.max(S.scale,0.0001);
  S.live[e.pointerId]=s; setT(); drawStroke(s,0);
}
function move(e){
  var s=S.live[e.pointerId]; if(!s) return; e.preventDefault();
  var evs=(e.getCoalescedEvents && e.getCoalescedEvents()) || []; if(!evs.length) evs=[e];
  setT();
  evs.forEach(function(ev){ var q=toWorld(ev), l=s.pts[s.pts.length-1]; if(Math.abs(q[0]-l[0])+Math.abs(q[1]-l[1]) < 0.8/S.scale) return; s.pts.push(q); g.strokeStyle=s.color; g.lineWidth=s.w; g.lineCap='round'; g.lineJoin='round'; seg(s.pts, s.pts.length-1); });
}
function up(e){
  var s=S.live[e.pointerId]; if(!s) return; delete S.live[e.pointerId];
  if(s.pts.length>1){ var l=s.pts[s.pts.length-1]; setT(); g.strokeStyle=s.color; g.lineWidth=s.w; g.beginPath(); g.moveTo.apply(g, mid(s.pts[s.pts.length-2], l)); g.lineTo(l[0],l[1]); g.stroke(); }
  S.strokes.push(s); syncUI();
}
function hasInk(){ for(var i=S.strokes.length-1;i>=0;i--){ if(S.strokes[i].clear) return false; return true; } return false; }
function undo(){ if(!S.strokes.length) return; S.strokes.pop(); pop(); redraw(); syncUI(); }
function clearAll(){ if(!hasInk()) return; S.strokes.push({clear:true}); redraw(); syncUI(); try{ TW.ctx(); swish(); }catch(e){} }
function swish(){ var c=TW.ctx(); if(!c) return; var o=c.createOscillator(), gg=c.createGain(), t=c.currentTime; o.type='triangle'; o.frequency.setValueAtTime(900,t); o.frequency.exponentialRampToValueAtTime(220,t+0.3); gg.gain.setValueAtTime(0.0001,t); gg.gain.exponentialRampToValueAtTime(0.1,t+0.02); gg.gain.exponentialRampToValueAtTime(0.0001,t+0.32); o.connect(gg); gg.connect(c.destination); o.start(t); o.stop(t+0.34); }
// Clear needs a deliberate hold: a ring fills while held; a quick tap only wiggles the button.
function holdButton(b, ms, fn){
  var t=null, start=0, raf=0;
  function stop(done){ clearTimeout(t); cancelAnimationFrame(raf); t=null; b.classList.remove('holding'); b.style.setProperty('--p',0); if(!done && performance.now()-start<ms){ b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('nudge'); $('dHint').classList.add('show'); clearTimeout(b._h); b._h=setTimeout(function(){ $('dHint').classList.remove('show'); },1600); } }
  function tick(){ var p=Math.min(1,(performance.now()-start)/ms); b.style.setProperty('--p',p); if(p<1) raf=requestAnimationFrame(tick); }
  b.addEventListener('pointerdown', function(e){ e.preventDefault(); if(b.disabled) return; start=performance.now(); b.classList.add('holding'); tick(); t=setTimeout(function(){ t=null; stop(true); fn(); }, ms); });
  ['pointerup','pointerleave','pointercancel'].forEach(function(ev){ b.addEventListener(ev, function(){ if(t) stop(false); }); });
  b.addEventListener('contextmenu', function(e){ e.preventDefault(); });
}
function exportCanvas(){
  var o=document.createElement('canvas'); o.width=cv.width; o.height=cv.height; var x=o.getContext('2d'); x.fillStyle='#fff'; x.fillRect(0,0,o.width,o.height); x.drawImage(cv,0,0); return o;
}
function save(){
  pop(); var o=exportCanvas(), d=new Date(), z=function(n){return (n<10?'0':'')+n;};
  var name='toddler-words-drawing-'+d.getFullYear()+z(d.getMonth()+1)+z(d.getDate())+'-'+z(d.getHours())+z(d.getMinutes())+'.png';
  function go(url, revoke){ var a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove(); if(revoke) setTimeout(function(){ URL.revokeObjectURL(url); }, 4000); }
  if(o.toBlob) o.toBlob(function(b){ if(b) go(URL.createObjectURL(b), true); else go(o.toDataURL('image/png')); }, 'image/png'); else go(o.toDataURL('image/png'));
}
function isOpen(){ return $('drawView').classList.contains('open'); }
function open(){ $('drawView').classList.add('open'); requestAnimationFrame(layout); layout(); }
function close(){ S.live={}; $('drawView').classList.remove('open'); }
build();
window.TWDraw={open:open, close:close, isOpen:isOpen, undo:undo, clear:clearAll, save:save, pick:pick, state:S, exportCanvas:exportCanvas, COLORS:COLORS, layout:layout};
})();
