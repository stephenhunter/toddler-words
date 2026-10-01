/*
 * art.js — original hand-authored SVG illustrations for Toddler Words.
 * Written from scratch in code (no traced icons, clip art, emoji designs, or generated images).
 * Style: 200x200 viewBox, flat bright fills, 6px rounded ink outline (#3b2b5a), friendly faces on animals.
 * window.ART[key]   -> SVG string for a picture (one per object, shared by EN/JA decks)
 * window.ART_LABELS -> human labels for the contact sheet
 * window.ICONS[key] -> small UI icons (play, mic, ear, star, gear, prev, next, check, speaker, again, cards, flag, back)
 * To replace a picture later, just swap the string for that key.
 */
(function () {
  'use strict';
  var K = '#3b2b5a';                       // ink
  var C = {
    red: '#ff5a5f', red2: '#e8434b', orange: '#ff9f43', yellow: '#ffd84d', gold: '#ffc233',
    green: '#5cc96b', green2: '#2f9e55', lime: '#b7e36b', blue: '#4fb3ff', blue2: '#2f7fd6', sky: '#bfe6ff',
    navy: '#35508f', purple: '#a970ff', purple2: '#7b4fd6', pink: '#ff8fb1', pink2: '#ffc2d6',
    brown: '#b9784a', brown2: '#8b5a3c', tan: '#f3c98b', cream: '#fff6e0', gray: '#b8c2cf', gray2: '#8e99a8',
    white: '#ffffff', skin: '#ffd6b0', dark: '#4a4458', teal: '#3cc8b4'
  };
  var NS = ' stroke="none"';
  function n(v) { return Math.round(v * 10) / 10; }
  function wrap(body, vb) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (vb || '0 0 200 200') + '"><g stroke="' + K +
      '" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">' + body + '</g></svg>';
  }
  function c(cx, cy, r, f, x) { return '<circle cx="' + n(cx) + '" cy="' + n(cy) + '" r="' + n(r) + '" fill="' + (f || 'none') + '"' + (x || '') + '/>'; }
  function e(cx, cy, rx, ry, f, x) { return '<ellipse cx="' + n(cx) + '" cy="' + n(cy) + '" rx="' + n(rx) + '" ry="' + n(ry) + '" fill="' + (f || 'none') + '"' + (x || '') + '/>'; }
  function p(d, f, x) { return '<path d="' + d + '" fill="' + (f || 'none') + '"' + (x || '') + '/>'; }
  function r(x, y, w, h, rx, f, xx) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 0) + '" fill="' + (f || 'none') + '"' + (xx || '') + '/>'; }
  function l(x1, y1, x2, y2, x) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"' + (x || '') + '/>'; }
  function rot(a, cx, cy) { return ' transform="rotate(' + a + ' ' + cx + ' ' + cy + ')"'; }
  function g(body, x) { return '<g' + (x || '') + '>' + body + '</g>'; }
  // thick stroked shape with an ink outline (outline layer + colour layer)
  function ostroke(d, w, col) { return p(d, 'none', ' stroke-width="' + (w + 7) + '"') + p(d, 'none', ' stroke="' + col + '" stroke-width="' + w + '"'); }
  // blob of overlapping circles with a single outer outline: [[cx,cy,r],...]
  function blob(list, col) {
    var a = list.map(function (q) { return c(q[0], q[1], q[2], K, ' stroke-width="12"'); }).join('');
    var b = list.map(function (q) { return c(q[0], q[1], q[2], col, NS); }).join('');
    return a + b;
  }
  function eyes(x1, x2, y, s) {
    s = s || 1;
    return c(x1, y, 6.5 * s, K, NS) + c(x2, y, 6.5 * s, K, NS) + c(x1 + 2.2 * s, y - 2.2 * s, 2.2 * s, '#fff', NS) + c(x2 + 2.2 * s, y - 2.2 * s, 2.2 * s, '#fff', NS);
  }
  function smile(cx, cy, w, sw) { return p('M' + n(cx - w) + ' ' + n(cy) + ' Q' + n(cx) + ' ' + n(cy + w * 0.95) + ' ' + n(cx + w) + ' ' + n(cy), 'none', sw ? ' stroke-width="' + sw + '"' : ''); }
  function cheeks(x1, x2, y, rr) { rr = rr || 8; return e(x1, y, rr, rr * 0.62, C.pink, NS + ' opacity=".75"') + e(x2, y, rr, rr * 0.62, C.pink, NS + ' opacity=".75"'); }
  function face(cx, cy, s) { s = s || 1; return eyes(cx - 17 * s, cx + 17 * s, cy, s) + cheeks(cx - 29 * s, cx + 29 * s, cy + 11 * s, 7 * s) + smile(cx, cy + 12 * s, 8 * s, 5 * s); }
  function shine(cx, cy, rx, ry, a) { return e(cx, cy, rx, ry, '#fff', NS + ' opacity=".55"' + (a ? rot(a, cx, cy) : '')); }
  function starPath(cx, cy, R, rr, k, a0) {
    k = k || 5; a0 = (a0 == null ? -90 : a0) * Math.PI / 180; var s = '';
    for (var i = 0; i < k * 2; i++) {
      var rad = i % 2 ? rr : R, a = a0 + i * Math.PI / k;
      s += (i ? 'L' : 'M') + n(cx + rad * Math.cos(a)) + ' ' + n(cy + rad * Math.sin(a));
    }
    return s + 'Z';
  }
  function sparkle(x, y, s, col) { return p(starPath(x, y, 10 * s, 3.5 * s, 4, -90), col || C.yellow, ' stroke-width="3"'); }

  var A = {}, L = {};
  function def(key, label, body) { A[key] = wrap(body); L[key] = label; }

  /* ---------------- FRUIT & FOOD ---------------- */
  def('apple', 'apple / りんご',
    ostroke('M100 64 Q97 42 110 26', 8, C.brown2) +
    p('M100 64 C72 44 30 54 32 102 C34 150 70 180 100 166 C130 180 166 150 168 102 C170 54 128 44 100 64 Z', C.red) +
    p('M106 50 Q130 22 158 34 Q136 66 106 50 Z', C.green) + p('M110 49 Q132 42 150 37', 'none', ' stroke-width="4"') +
    shine(64, 96, 10, 21, 20));

  def('orange', 'orange / みかん',
    c(100, 110, 66, C.orange) +
    ostroke('M100 46 L102 36', 7, C.brown2) +
    p('M102 42 Q122 18 146 28 Q128 54 102 42 Z', C.green) +
    c(80, 118, 2.5, '#e07f22', NS) + c(118, 132, 2.5, '#e07f22', NS) + c(124, 96, 2.5, '#e07f22', NS) + c(96, 146, 2.5, '#e07f22', NS) +
    shine(70, 88, 11, 18, 30));

  def('grapes', 'grapes',
    ostroke('M100 52 Q102 34 92 22', 7, C.brown2) +
    p('M104 40 Q128 14 156 26 Q138 56 104 40 Z', C.green) +
    [[55, 66], [85, 66], [115, 66], [145, 66], [70, 94], [100, 94], [130, 94], [85, 122], [115, 122], [100, 150]].map(function (q) {
      return c(q[0], q[1] + 8, 17, C.purple) + c(q[0] - 5, q[1] + 3, 4, '#fff', NS + ' opacity=".6"');
    }).join(''));

  def('lemon', 'lemon / れもん',
    p('M30 104 Q30 95 41 91 C60 52 140 52 159 91 Q170 95 170 104 Q170 113 159 117 C140 156 60 156 41 117 Q30 113 30 104 Z', C.yellow) +
    p('M108 66 Q128 36 156 44 Q140 74 108 66 Z', C.green) +
    shine(70, 88, 9, 18, 60));

  def('peach', 'peach / もも',
    p('M100 46 C66 44 30 74 36 118 C42 160 78 182 102 178 C134 178 166 152 164 112 C162 72 130 46 100 46 Z', '#ffb09a') +
    e(130, 120, 24, 30, '#ff8a80', NS + ' opacity=".55"') +
    p('M100 48 Q84 110 100 176', 'none', ' stroke="#e2735f" stroke-width="5"') +
    p('M100 50 Q86 24 58 26 Q64 52 100 50 Z', C.green) + p('M102 50 Q120 22 146 28 Q136 54 102 50 Z', C.green2) +
    shine(66, 100, 9, 18, 15));

  def('watermelon', 'watermelon / すいか',
    g(p('M22 78 A78 78 0 0 0 178 78 Z', C.green2) +
      p('M34 78 A66 66 0 0 0 166 78 Z', '#d8f5b0', NS) +
      p('M42 78 A58 58 0 0 0 158 78 Z', C.red, NS) +
      p('M42 78 L158 78', 'none') +
      [[70, 96], [100, 104], [130, 96], [85, 122], [115, 122], [100, 140]].map(function (q) { return e(q[0], q[1], 4, 7, K, NS); }).join(''),
      rot(-10, 100, 100)));

  def('eggplant', 'eggplant / なす',
    g(p('M86 62 C52 70 36 120 52 156 C66 186 112 190 140 168 C166 146 160 104 132 84 C118 74 110 62 104 58 Z', C.purple2) +
      shine(70, 130, 8, 22, 25) +
      p('M78 66 Q96 52 116 62 L126 80 L108 74 L98 86 L90 72 L74 82 Z', C.green) +
      ostroke('M98 60 Q96 40 108 26', 8, C.green2), rot(0, 100, 100)));

  def('carrot', 'carrot / にんじん',
    g(p('M80 30 Q66 6 74 2 Q88 8 94 30 Z', C.green) + p('M96 30 Q96 0 104 -2 Q114 6 106 30 Z', C.green2) + p('M108 32 Q122 10 132 14 Q132 26 114 36 Z', C.green) +
      p('M70 40 Q100 26 130 40 L104 186 Q100 194 96 186 Z', C.orange) +
      p('M84 70 L96 72 M110 98 L120 100 M88 120 L100 122 M106 150 L112 151', 'none', ' stroke-width="4"'),
      ' transform="translate(18 22) rotate(25 100 100) scale(.88)"'));

  def('peapod', 'beans (pea pod) / まめ',
    g(p('M20 110 C40 70 150 60 182 84 C176 120 70 150 20 110 Z', C.green2) +
      p('M32 106 C56 82 146 74 170 88 C160 112 72 132 32 106 Z', C.lime) +
      c(58, 104, 15, C.green) + c(90, 98, 16, C.green) + c(122, 94, 15, C.green) + c(150, 90, 12, C.green) +
      c(53, 99, 4, '#fff', NS + ' opacity=".6"') + c(85, 93, 4, '#fff', NS + ' opacity=".6"') + c(117, 89, 4, '#fff', NS + ' opacity=".6"') +
      ostroke('M182 84 Q192 70 186 58', 6, C.green2) + eyes(82, 98, 98, 0.45) + eyes(114, 130, 94, 0.45), rot(-12, 100, 100)));

  def('onigiri', 'rice ball / おにぎり',
    p('M100 34 Q116 34 126 51 L172 132 Q184 164 150 166 L50 166 Q16 164 28 132 L74 51 Q84 34 100 34 Z', C.white) +
    r(72, 118, 56, 50, 6, '#2e4a3a') +
    eyes(84, 116, 94, 0.9) + cheeks(72, 128, 106, 7) + smile(100, 104, 7, 5));

  def('cake', 'cake / けーき',
    e(100, 168, 76, 14, '#e6eef7') +
    r(38, 96, 124, 70, 14, '#f7d9a8') +
    p('M38 112 Q38 92 58 92 L142 92 Q162 92 162 112 Q156 128 148 112 Q140 130 130 112 Q120 130 110 112 Q100 130 90 112 Q80 130 70 112 Q60 130 52 112 Q46 126 38 112 Z', C.pink2) +
    l(40, 140, 160, 140, ' stroke="#e9b97a" stroke-width="6"') +
    r(94, 50, 12, 42, 4, C.blue) + p('M100 22 Q112 36 100 46 Q88 36 100 22 Z', C.orange) +
    c(62, 90, 11, C.red) + c(138, 90, 11, C.red) + c(59, 87, 2.5, '#fff', NS) + c(135, 87, 2.5, '#fff', NS));

  def('icecream', 'ice cream',
    p('M64 104 L100 186 L136 104 Z', C.tan) +
    p('M76 118 L118 160 M92 108 L128 140 M124 118 L86 158 M108 108 L72 140', 'none', ' stroke="#d39a55" stroke-width="5"') +
    p('M64 104 L100 186 L136 104 Z', 'none') +
    c(100, 92, 38, C.pink) + p('M66 104 Q76 118 84 106 Q92 120 100 108 Q110 122 118 106 Q126 118 134 104', 'none') +
    c(100, 56, 30, '#9fe6c4') +
    ostroke('M100 26 Q104 14 116 10', 4, C.green2) + c(100, 28, 10, C.red) + shine(84, 82, 7, 12, 30));

  def('juice', 'juice box',
    ostroke('M122 64 L126 22 L148 14', 9, C.white) +
    p('M56 66 L70 52 L138 52 L144 66 Z', '#ffd08a') +
    r(56, 66, 88, 112, 10, C.orange) +
    c(100, 122, 28, C.yellow) + c(100, 122, 20, '#ffe98a', NS) +
    p('M100 102 L100 142 M80 122 L120 122 M86 108 L114 136 M114 108 L86 136', 'none', ' stroke="' + C.orange + '" stroke-width="4"') +
    c(100, 122, 28, 'none') + p('M100 94 Q112 80 128 86 Q118 100 100 94 Z', C.green));

  def('egg', 'egg / たまご',
    p('M100 30 C140 30 166 98 160 132 C154 166 128 180 100 180 C72 180 46 166 40 132 C34 98 60 30 100 30 Z', C.cream) +
    shine(74, 92, 10, 22, 15));

  def('bread', 'bread / ぱん',
    p('M50 88 C26 86 24 46 62 42 C82 26 118 26 138 42 C176 46 174 86 150 88 L150 166 Q150 174 142 174 L58 174 Q50 174 50 166 Z', '#d99a55') +
    p('M62 94 C44 92 42 58 70 54 C86 42 114 42 130 54 C158 58 156 92 138 94 L138 160 Q138 164 134 164 L66 164 Q62 164 62 160 Z', '#ffe7b8', NS) +
    eyes(86, 114, 104, 0.9) + cheeks(74, 126, 116, 7) + smile(100, 114, 7, 5));

  /* ---------------- ANIMALS ---------------- */
  def('cat', 'cat / ねこ',
    p('M52 98 L50 38 L96 66 Z', C.orange) + p('M148 98 L150 38 L104 66 Z', C.orange) +
    p('M60 78 L59 52 L80 66 Z', C.pink, NS) + p('M140 78 L141 52 L120 66 Z', C.pink, NS) +
    e(100, 116, 66, 56, C.orange) +
    p('M100 62 L100 78 M84 64 L87 78 M116 64 L113 78', 'none', ' stroke="#e07f22" stroke-width="5"') +
    e(100, 134, 24, 15, '#ffe2c2', NS) +
    eyes(76, 124, 108) + cheeks(58, 142, 126, 9) +
    p('M94 124 L106 124 L100 131 Z', C.pink, ' stroke-width="4"') +
    p('M88 137 Q94 143 100 135 Q106 143 112 137', 'none', ' stroke-width="4"') +
    p('M34 116 L64 122 M34 132 L64 130 M166 116 L136 122 M166 132 L136 130', 'none', ' stroke-width="4"'));

  def('dog', 'dog / いぬ',
    e(100, 108, 56, 54, '#e3b07a') +
    e(48, 104, 20, 42, C.brown2, rot(18, 48, 104)) + e(152, 104, 20, 42, C.brown2, rot(-18, 152, 104)) +
    e(122, 88, 18, 16, '#c98d55', NS) +
    e(100, 132, 32, 23, '#fbe3c6') +
    eyes(80, 120, 96) + e(100, 120, 11, 8, K, NS) + c(97, 117, 3, '#fff', NS) +
    p('M100 128 L100 134 M86 136 Q100 146 114 136', 'none', ' stroke-width="5"') +
    p('M94 141 Q100 158 106 141 Z', C.pink, ' stroke-width="4"') + cheeks(66, 134, 116, 8));

  def('rabbit', 'rabbit / うさぎ',
    e(78, 58, 15, 42, '#f6f2fb', rot(-10, 78, 58)) + e(122, 58, 15, 42, '#f6f2fb', rot(10, 122, 58)) +
    e(78, 62, 7, 28, C.pink2, NS + rot(-10, 78, 62)) + e(122, 62, 7, 28, C.pink2, NS + rot(10, 122, 62)) +
    e(100, 128, 58, 50, '#f6f2fb') +
    eyes(80, 120, 118) + cheeks(64, 136, 136, 9) +
    e(100, 134, 7, 5, C.pink, ' stroke-width="4"') +
    p('M100 139 L100 146 M90 148 Q100 154 110 148', 'none', ' stroke-width="4"') +
    r(94, 148, 12, 12, 3, '#fff', ' stroke-width="4"'));

  def('elephant', 'elephant',
    e(46, 98, 38, 48, '#9bb7d4') + e(154, 98, 38, 48, '#9bb7d4') +
    e(46, 100, 22, 30, C.pink2, NS) + e(154, 100, 22, 30, C.pink2, NS) +
    c(100, 92, 50, '#b5cbe0') +
    p('M86 116 Q82 160 108 174 Q130 182 132 166 Q130 156 118 160 Q104 154 112 116 Z', '#b5cbe0') +
    eyes(80, 120, 86) + cheeks(66, 134, 104, 8));

  def('fish', 'fish / さかな',
    p('M140 102 L182 68 Q170 102 182 136 Z', C.blue2) +
    p('M74 66 Q98 40 118 64 Z', C.blue2) +
    e(92, 102, 60, 42, C.blue) +
    p('M108 66 Q122 102 108 138', 'none', ' stroke="' + C.blue2 + '" stroke-width="5"') +
    p('M126 80 Q136 102 126 124', 'none', ' stroke="' + C.blue2 + '" stroke-width="5"') +
    eyes(66, 66, 94) + smile(58, 114, 8, 5) + e(80, 122, 8, 5, C.pink, NS + ' opacity=".7"') +
    c(30, 50, 7, '#e7f6ff') + c(44, 32, 5, '#e7f6ff'));

  def('lion', 'lion / らいおん',
    blob([[100, 100, 64], [100, 38, 20], [140, 50, 20], [160, 82, 20], [160, 120, 20], [140, 152, 20], [100, 164, 20], [60, 152, 20], [40, 120, 20], [40, 82, 20], [60, 50, 20]], '#e8862a') +
    c(64, 64, 14, C.gold) + c(136, 64, 14, C.gold) + c(64, 64, 6, '#e8862a', NS) + c(136, 64, 6, '#e8862a', NS) +
    c(100, 104, 48, C.gold) +
    e(100, 124, 22, 16, '#ffe7a8', NS) +
    eyes(82, 118, 96) + cheeks(68, 132, 114, 8) +
    p('M92 112 L108 112 L100 121 Z', C.brown2, ' stroke-width="4"') +
    p('M88 128 Q94 134 100 126 Q106 134 112 128', 'none', ' stroke-width="4"'));

  def('pig', 'pig',
    p('M50 80 L56 40 L88 64 Z', '#ff9fbd') + p('M150 80 L144 40 L112 64 Z', '#ff9fbd') +
    e(100, 110, 66, 58, '#ffbfd2') +
    e(100, 124, 27, 19, '#ff8fb1') + e(91, 124, 4.5, 7, K, NS) + e(109, 124, 4.5, 7, K, NS) +
    eyes(76, 124, 96) + cheeks(58, 142, 116, 9) + smile(100, 150, 9, 5));

  def('whale', 'whale',
    p('M90 46 Q82 26 68 22 M96 44 Q96 24 104 14 M102 46 Q112 30 128 28', 'none', ' stroke="' + C.blue + '" stroke-width="7"') +
    p('M22 116 Q22 62 92 60 Q146 60 154 104 Q166 98 178 78 Q192 106 180 122 Q194 138 184 156 Q164 140 152 132 Q132 158 88 158 Q22 158 22 116 Z', C.blue2) +
    p('M30 128 Q60 156 120 148 Q136 144 146 134 Q120 140 30 128 Z', '#bfe6ff', NS) +
    eyes(64, 64, 104) + smile(52, 122, 9, 5) + e(76, 118, 8, 5, C.pink, NS + ' opacity=".7"'));

  def('zebra', 'zebra',
    p('M70 62 L60 22 L90 48 Z', C.white) + p('M130 62 L140 22 L110 48 Z', C.white) +
    p('M68 30 L66 42 Z', K, NS) +
    p('M80 52 L84 30 L92 44 L100 24 L108 44 L116 30 L120 52 Z', K) +
    e(100, 100, 46, 58, C.white) +
    p('M74 56 Q100 70 126 56 Q122 64 100 74 Q78 64 74 56 Z', K, NS) + p('M80 74 Q100 84 120 74 Q116 82 100 88 Q84 82 80 74 Z', K, NS) +
    p('M55 78 Q66 80 72 88 Q62 89 55 88 Z', K, NS) + p('M145 78 Q134 80 128 88 Q138 89 145 88 Z', K, NS) +
    p('M55 104 Q64 106 70 114 Q62 115 57 114 Z', K, NS) + p('M145 104 Q136 106 130 114 Q138 115 143 114 Z', K, NS) +
    e(100, 140, 36, 26, '#c9c3d6') + e(89, 138, 4.5, 6.5, K, NS) + e(111, 138, 4.5, 6.5, K, NS) +
    eyes(84, 116, 98) + cheeks(70, 130, 118, 6) + smile(100, 150, 9, 4));

  def('ant', 'ant / あり',
    p('M100 112 L78 150 L70 168 M110 114 L110 156 L116 172 M118 110 L140 146 L152 160', 'none', ' stroke-width="6"') +
    e(58, 112, 34, 28, '#b04a3a') + c(108, 106, 18, '#b04a3a') + c(148, 88, 26, '#c95a46') +
    p('M140 66 Q132 40 120 36 M158 64 Q166 38 180 34', 'none') + c(120, 36, 5, K, NS) + c(180, 34, 5, K, NS) +
    eyes(140, 160, 86, 0.7) + smile(150, 98, 6, 4) + cheeks(134, 168, 96, 5) + shine(48, 102, 8, 12, 30));

  def('giraffe', 'giraffe / きりん',
    p('M64 196 L84 96 L118 96 L108 196 Z', C.gold) +
    p('M84 100 Q76 140 70 196', 'none', ' stroke="' + C.brown + '" stroke-width="9"') +
    p('M88 120 L102 116 L104 130 L92 134 Z M94 156 L106 150 L108 166 L96 170 Z M80 178 L90 174 L92 188 L80 190 Z', C.brown, ' stroke-width="3"') +
    ostroke('M96 52 L92 26', 6, C.brown2) + ostroke('M124 52 L130 26', 6, C.brown2) + c(92, 24, 7, C.brown2) + c(130, 24, 7, C.brown2) +
    e(76, 60, 14, 8, C.gold, rot(-25, 76, 60)) +
    e(112, 74, 38, 30, C.gold) + e(130, 86, 26, 18, '#ffe7a8') +
    c(102, 64, 6, C.brown, NS) + c(124, 58, 5, C.brown, NS) +
    eyes(100, 124, 70, 0.8) + e(124, 86, 3, 2.5, K, NS) + e(138, 86, 3, 2.5, K, NS) + smile(132, 94, 7, 4));

  def('koala', 'koala / こあら',
    c(46, 74, 32, '#9aa4b4') + c(154, 74, 32, '#9aa4b4') + c(46, 76, 18, '#f2eef6', NS) + c(154, 76, 18, '#f2eef6', NS) +
    e(100, 116, 60, 54, '#aab3c2') +
    eyes(74, 126, 104) + cheeks(60, 140, 128, 8) +
    e(100, 122, 15, 20, '#4a4458') + c(96, 114, 3.5, '#fff', NS + ' opacity=".7"') +
    smile(100, 148, 9, 5));

  def('deer', 'deer / しか',
    p('M76 50 L68 18 M70 34 L54 26 M124 50 L132 18 M130 34 L146 26', 'none', ' stroke="' + C.brown2 + '" stroke-width="9"') +
    e(54, 84, 26, 12, C.brown, rot(-25, 54, 84)) + e(146, 84, 26, 12, C.brown, rot(25, 146, 84)) +
    e(54, 84, 14, 5, C.pink2, NS + rot(-25, 54, 84)) + e(146, 84, 14, 5, C.pink2, NS + rot(25, 146, 84)) +
    p('M100 52 C140 52 146 100 136 130 C128 160 112 176 100 176 C88 176 72 160 64 130 C54 100 60 52 100 52 Z', C.brown) +
    e(100, 150, 26, 24, '#f7dcbc', NS) + c(88, 66, 4, '#fff', NS) + c(106, 62, 3.5, '#fff', NS) + c(116, 72, 3, '#fff', NS) +
    eyes(82, 118, 104) + e(100, 140, 9, 7, K, NS) + smile(100, 152, 8, 4) + cheeks(70, 130, 122, 7));

  def('bird', 'bird / とり',
    p('M50 100 L18 82 L26 108 L16 124 Z', C.blue2) +
    p('M84 150 L80 176 M74 176 L90 176 M110 150 L112 176 M104 176 L120 176', 'none', ' stroke="' + C.orange + '" stroke-width="6"') +
    p('M96 56 Q90 38 102 32 Q104 46 112 50', 'none', ' stroke-width="5"') +
    c(98, 104, 52, C.blue) + e(104, 124, 30, 26, '#d7f0ff', NS) +
    p('M66 104 Q80 84 104 104 Q86 130 66 104 Z', C.blue2) +
    p('M146 92 L172 102 L146 112 Z', C.orange) +
    eyes(124, 124, 88) + e(132, 104, 7, 4.5, C.pink, NS + ' opacity=".7"'));

  def('teddy', 'teddy bear / ぬいぐるみ',
    c(62, 46, 18, C.brown) + c(138, 46, 18, C.brown) + c(62, 46, 8, '#f3c9a0', NS) + c(138, 46, 8, '#f3c9a0', NS) +
    c(48, 140, 16, C.brown) + c(152, 140, 16, C.brown) +
    e(100, 148, 46, 40, C.brown) + e(100, 152, 26, 24, '#f3c9a0', NS) +
    c(70, 182, 16, C.brown) + c(130, 182, 16, C.brown) +
    c(100, 78, 42, C.brown) + e(100, 92, 18, 13, '#f3c9a0') +
    e(100, 86, 6, 4.5, K, NS) + p('M100 90 L100 96 M92 98 Q100 102 108 98', 'none', ' stroke-width="4"') +
    eyes(84, 116, 70, 0.8) +
    p('M82 116 L100 124 L82 132 Z M118 116 L100 124 L118 132 Z', C.red, ' stroke-width="4"') + c(100, 124, 5, C.red, ' stroke-width="4"'));

  def('snake', 'snake / へび',
    ostroke('M34 168 C20 130 150 150 150 112 C150 80 54 100 60 66 C64 46 92 44 112 50', 26, C.green) +
    [[56, 152], [96, 146], [134, 128], [118, 92], [80, 90], [70, 62]].map(function (q) { return c(q[0], q[1], 4, C.green2, NS); }).join('') +
    p('M134 54 L150 56 M150 56 L158 50 M150 56 L158 62', 'none', ' stroke="' + C.red + '" stroke-width="4"') +
    e(120, 52, 22, 18, C.green) + eyes(114, 128, 46, 0.6) + cheeks(108, 134, 56, 4));

  def('caterpillar', 'caterpillar (bug) / むし',
    p('M38 128 L38 144 M72 132 L72 150 M106 132 L106 150', 'none', ' stroke="' + C.green2 + '" stroke-width="6"') +
    c(36, 116, 22, C.lime) + c(70, 118, 24, C.green) + c(106, 116, 26, C.lime) +
    p('M136 72 Q130 50 120 44 M152 72 Q160 50 172 46', 'none') + c(120, 44, 5, K, NS) + c(172, 46, 5, K, NS) +
    c(144, 100, 32, C.green) + eyes(132, 158, 96, 0.8) + cheeks(124, 166, 108, 6) + smile(146, 110, 7, 4));

  def('butterfly', 'butterfly / ちょうちょ',
    p('M100 96 C78 38 24 36 30 82 C34 110 70 112 100 104 Z', C.orange) + p('M100 96 C122 38 176 36 170 82 C166 110 130 112 100 104 Z', C.orange) +
    p('M100 108 C72 110 44 130 56 158 C68 182 96 156 100 118 Z', C.pink) + p('M100 108 C128 110 156 130 144 158 C132 182 104 156 100 118 Z', C.pink) +
    c(62, 76, 10, C.yellow) + c(138, 76, 10, C.yellow) + c(72, 142, 8, '#fff') + c(128, 142, 8, '#fff') +
    e(100, 118, 9, 40, C.purple2) +
    p('M96 74 Q86 52 76 48 M104 74 Q114 52 124 48', 'none') + c(76, 48, 4, K, NS) + c(124, 48, 4, K, NS) +
    c(100, 78, 13, C.purple2) + eyes(95, 105, 77, 0.35));

  def('crocodile', 'crocodile / わに',
    p('M46 128 L40 150 L56 150 M110 130 L106 150 L122 150', 'none', ' stroke-width="6"') +
    p('M10 118 Q40 98 80 98 L112 92 Q120 66 142 74 Q150 80 152 94 L186 102 Q196 114 186 124 L124 128 Q100 142 70 138 Q36 136 10 118 Z', C.green) +
    p('M58 98 Q64 86 72 98 M80 98 Q86 86 94 96', 'none', ' stroke-width="5"') +
    p('M124 116 L184 113', 'none', ' stroke-width="4"') +
    p('M132 117 L136 124 L140 117 M148 116 L152 123 L156 116 M164 115 L168 122 L172 115', '#fff', ' stroke-width="3"') +
    c(136, 84, 12, '#fff') + c(138, 84, 6, K, NS) + c(140, 82, 2, '#fff', NS) +
    c(180, 104, 2.5, K, NS) + e(30, 122, 10, 6, C.green2, NS + ' opacity=".4"'));


  /* ---------------- THINGS ---------------- */
  def('ball', 'ball',
    c(100, 104, 72, C.white) +
    p('M100 32 A72 72 0 0 0 100 176 C42 160 42 48 100 32 Z', C.yellow, NS) +
    p('M100 32 C42 48 42 160 100 176 C76 140 76 68 100 32 Z', C.red, NS) +
    p('M100 32 C158 48 158 160 100 176 C124 140 124 68 100 32 Z', C.blue, NS) +
    p('M100 32 A72 72 0 0 1 100 176 C158 160 158 48 100 32 Z', C.green, NS) +
    p('M100 32 C42 48 42 160 100 176 M100 32 C76 68 76 140 100 176 M100 32 C124 68 124 140 100 176 M100 32 C158 48 158 160 100 176', 'none', ' stroke-width="4"') +
    c(100, 104, 72, 'none') + shine(66, 72, 9, 16, 40));

  def('hat', 'hat',
    e(100, 156, 82, 20, '#6b5aa0') +
    p('M56 156 L62 54 Q62 42 74 42 L126 42 Q138 42 138 54 L144 156 Z', '#6b5aa0') +
    p('M58 122 L142 122 L143.8 148 L56.6 148 Z', C.red) +
    p('M56 156 Q100 170 144 156', 'none') + shine(80, 80, 6, 22, 0));

  def('kite', 'kite',
    p('M110 150 Q90 166 104 178 Q118 190 96 198', 'none', ' stroke-width="4"') +
    p('M100 168 L88 160 L90 176 Z M100 168 L112 162 L110 176 Z', C.red, ' stroke-width="3"') +
    p('M110 22 L166 78 L110 70 Z', C.red) + p('M110 22 L54 78 L110 70 Z', C.yellow) +
    p('M54 78 L110 150 L110 70 Z', C.blue) + p('M166 78 L110 150 L110 70 Z', C.green) +
    p('M110 22 L110 150 M54 78 L166 78', 'none', ' stroke-width="4"'));

  def('moon', 'moon / つき',
    p('M98.4 30 A70 70 0 1 0 165.7 124.3 A58 58 0 0 1 98.4 30 Z', C.yellow) +
    p('M60 94 Q66 100 72 94', 'none', ' stroke-width="5"') + smile(70, 122, 9, 5) + e(52, 110, 7, 4.5, C.pink, NS + ' opacity=".8"') +
    sparkle(150, 46, 1.2) + sparkle(172, 82, 0.8));

  def('nose', 'nose (face)',
    c(100, 108, 66, C.skin) +
    p('M36 104 Q34 38 100 36 Q166 38 164 104 Q152 84 138 92 Q124 74 108 86 Q94 72 80 86 Q64 76 52 92 Q44 92 36 104 Z', C.brown2) +
    eyes(72, 128, 104, 0.9) + cheeks(56, 144, 132, 9) + smile(100, 148, 12, 5) +
    p('M100 100 C88 118 84 128 92 132 Q100 136 108 132 C116 128 112 118 100 100 Z', '#ffb48f') +
    c(95, 124, 3.5, '#fff', NS + ' opacity=".7"') +
    p('M74 120 L62 118 M126 120 L138 118', 'none', ' stroke="' + C.orange + '" stroke-width="5"'));

  def('queen', 'queen (crown)',
    p('M44 124 Q38 70 100 70 Q162 70 156 124 Q160 170 136 176 L64 176 Q40 170 44 124 Z', C.brown) +
    c(100, 120, 46, C.skin) +
    p('M56 110 Q64 74 100 74 Q136 74 144 110 Q120 92 100 92 Q80 92 56 110 Z', C.brown) +
    p('M60 80 L62 34 L82 56 L100 24 L118 56 L138 34 L140 80 Z', C.gold) +
    c(100, 62, 7, C.red, ' stroke-width="4"') + c(76, 70, 5, C.blue, ' stroke-width="4"') + c(124, 70, 5, C.blue, ' stroke-width="4"') +
    eyes(82, 118, 118, 0.85) + cheeks(70, 130, 134, 7) + smile(100, 136, 9, 5));

  def('sun', 'sun',
    (function () { var s = ''; for (var i = 0; i < 12; i++) { var a = i * Math.PI / 6, x1 = 100 + 62 * Math.cos(a), y1 = 100 + 62 * Math.sin(a), x2 = 100 + 86 * Math.cos(a), y2 = 100 + 86 * Math.sin(a); s += ostroke('M' + n(x1) + ' ' + n(y1) + ' L' + n(x2) + ' ' + n(y2), 10, C.orange); } return s; })() +
    c(100, 100, 52, C.yellow) + face(100, 96, 1.15));

  def('tree', 'tree',
    p('M86 186 L90 116 L110 116 L114 186 Z', C.brown) + p('M90 150 L100 140 M110 130 L104 136', 'none', ' stroke-width="4"') +
    blob([[100, 62, 42], [62, 96, 34], [138, 96, 34], [100, 112, 38], [76, 70, 26], [124, 70, 26]], C.green) +
    c(80, 80, 6, '#8ee08f', NS) + c(124, 98, 7, '#8ee08f', NS) + c(104, 52, 5, '#8ee08f', NS));

  def('umbrella', 'umbrella / かさ',
    ostroke('M100 100 L100 166 Q100 182 86 182 Q74 182 74 170', 7, C.purple2) +
    p('M100 30 A70 70 0 0 0 30 100 Q47.5 85 65 100 Q74 56 100 30 Z', C.red) +
    p('M100 30 Q74 56 65 100 Q82.5 85 100 100 Z', C.yellow) +
    p('M100 30 L100 100 Q117.5 85 135 100 Q126 56 100 30 Z', C.red) +
    p('M100 30 Q126 56 135 100 Q152.5 85 170 100 A70 70 0 0 0 100 30 Z', C.yellow) +
    c(100, 26, 6, C.purple2, ' stroke-width="4"'));

  def('van', 'van',
    p('M24 140 L24 86 Q24 62 50 62 L136 62 Q152 62 160 76 L176 104 Q180 110 180 120 L180 140 Q180 150 170 150 L34 150 Q24 150 24 140 Z', C.teal) +
    r(36, 74, 32, 28, 6, C.sky) + r(76, 74, 32, 28, 6, C.sky) + p('M118 74 L144 74 Q150 74 153 80 L164 104 L118 104 Z', C.sky) +
    p('M24 120 L180 120', 'none', ' stroke="#fff" stroke-width="7"') + p('M114 74 L114 148', 'none', ' stroke-width="4"') +
    c(172, 112, 6, C.yellow, ' stroke-width="4"') +
    c(62, 150, 19, C.dark) + c(62, 150, 7, C.gray, NS) + c(142, 150, 19, C.dark) + c(142, 150, 7, C.gray, NS));

  def('car', 'car / くるま',
    p('M22 132 L22 108 Q22 96 36 94 L60 92 L82 62 Q87 56 96 56 L134 56 Q143 56 148 63 L166 92 Q180 94 180 108 L180 132 Q180 140 172 140 L30 140 Q22 140 22 132 Z', C.red) +
    p('M70 92 L88 66 L112 66 L112 92 Z', C.sky) + p('M122 66 L138 66 L154 92 L122 92 Z', C.sky) +
    c(172, 106, 6, C.yellow, ' stroke-width="4"') + r(22, 116, 14, 8, 3, '#ffe2a8', ' stroke-width="3"') +
    c(60, 142, 19, C.dark) + c(60, 142, 7, C.gray, NS) + c(146, 142, 19, C.dark) + c(146, 142, 7, C.gray, NS) +
    shine(56, 104, 4, 10, 70));

  def('bus', 'bus / のりもの',
    r(16, 54, 168, 96, 18, C.yellow) +
    r(30, 68, 26, 30, 5, C.sky) + r(64, 68, 26, 30, 5, C.sky) + r(98, 68, 26, 30, 5, C.sky) +
    r(134, 68, 32, 64, 6, C.sky) + l(150, 68, 150, 132, ' stroke-width="4"') +
    p('M16 112 L132 112', 'none', ' stroke="' + C.orange + '" stroke-width="8"') +
    c(176, 128, 5, '#fff', ' stroke-width="4"') +
    c(52, 152, 19, C.dark) + c(52, 152, 7, C.gray, NS) + c(150, 152, 19, C.dark) + c(150, 152, 7, C.gray, NS));

  def('airplane', 'airplane / ひこうき',
    p('M36 92 L22 50 L50 50 L72 92 Z', C.red) +
    p('M28 108 Q28 88 54 88 L150 88 Q182 92 182 108 Q182 124 150 126 L54 126 Q28 126 28 108 Z', '#f4f8ff') +
    p('M162 92 Q176 96 178 106 L156 106 Z', C.sky, ' stroke-width="4"') +
    c(70, 104, 6, C.sky, ' stroke-width="4"') + c(92, 104, 6, C.sky, ' stroke-width="4"') + c(114, 104, 6, C.sky, ' stroke-width="4"') + c(136, 104, 6, C.sky, ' stroke-width="4"') +
    p('M80 116 L120 116 L94 168 L72 168 Z', C.blue) +
    p('M44 120 L64 120 L52 138 L40 138 Z', C.blue, ' stroke-width="5"'));

  def('ship', 'ship / ふね',
    r(86, 42, 26, 40, 4, C.red) + r(86, 42, 26, 10, 3, C.dark) +
    c(120, 28, 9, '#e9eef5', ' stroke-width="4"') + c(136, 18, 6, '#e9eef5', ' stroke-width="4"') +
    r(52, 80, 96, 38, 8, C.white) +
    c(72, 99, 6, C.sky, ' stroke-width="4"') + c(92, 99, 6, C.sky, ' stroke-width="4"') + c(112, 99, 6, C.sky, ' stroke-width="4"') + c(132, 99, 6, C.sky, ' stroke-width="4"') +
    p('M18 118 L182 118 L160 160 L40 160 Z', C.navy) + p('M28 140 L172 140', 'none', ' stroke="' + C.red + '" stroke-width="8"') +
    p('M10 172 Q30 160 50 172 Q70 184 90 172 Q110 160 130 172 Q150 184 170 172 Q186 162 194 168', 'none', ' stroke="' + C.blue + '" stroke-width="7"'));

  def('sailboat', 'sailboat / よっと',
    p('M100 20 L100 132', 'none', ' stroke-width="7"') +
    p('M106 28 L106 122 L170 122 Z', C.white) + p('M94 50 L94 122 L44 122 Z', C.yellow) +
    p('M100 20 L124 28 L100 36 Z', C.red, ' stroke-width="4"') +
    p('M28 132 L172 132 L150 164 L50 164 Z', C.red2) +
    p('M10 176 Q30 164 50 176 Q70 188 90 176 Q110 164 130 176 Q150 188 170 176 Q186 166 194 172', 'none', ' stroke="' + C.blue + '" stroke-width="7"'));

  def('rocket', 'rocket / ろけっと',
    g(p('M86 150 Q100 200 114 150 Z', C.orange) + p('M93 150 Q100 180 107 150 Z', C.yellow, NS) +
      p('M74 116 L46 150 L46 166 L76 146 Z', C.red) + p('M126 116 L154 150 L154 166 L124 146 Z', C.red) +
      p('M100 20 C138 46 142 104 130 150 L70 150 C58 104 62 46 100 20 Z', '#f4f8ff') +
      p('M100 20 C120 34 130 52 133 70 L67 70 C70 52 80 34 100 20 Z', C.red) +
      c(100, 102, 17, C.sky, ' stroke-width="7"') + shine(94, 96, 4, 7, 30) +
      r(84, 146, 32, 10, 3, C.gray), rot(25, 100, 100)));

  def('star', 'star / ほし',
    p(starPath(100, 106, 84, 40, 5, -90), C.yellow, ' stroke-width="7"') + face(100, 108, 0.95));

  def('flower', 'flower / はな',
    ostroke('M100 110 Q96 150 100 190', 8, C.green2) +
    p('M98 160 Q70 136 52 150 Q70 172 98 160 Z', C.green) + p('M102 150 Q132 128 150 142 Q130 164 102 150 Z', C.green) +
    (function () { var s = ''; for (var i = 0; i < 6; i++) { var a = i * Math.PI / 3 - Math.PI / 2; s += c(100 + 34 * Math.cos(a), 78 + 34 * Math.sin(a), 24, C.pink); } return s; })() +
    c(100, 78, 24, C.yellow) + eyes(92, 108, 74, 0.55) + smile(100, 84, 6, 4));

  def('mountain', 'mountain / やま',
    p('M96 176 L140 78 L192 176 Z', '#8fa6d8') + p('M124 114 L140 78 L156 114 L148 108 L140 116 L132 108 Z', C.white, ' stroke-width="4"') +
    p('M8 176 L72 50 L136 176 Z', '#7b8fd1') + p('M52 90 L72 50 L92 90 L82 84 L72 94 L62 84 Z', C.white) +
    p('M4 176 L196 176', 'none') + sparkle(160, 36, 1));

  def('snowflake', 'snowflake / ゆき',
    (function () {
      var arm = 'M100 100 L100 26 M100 56 L82 40 M100 56 L118 40 M100 78 L88 68 M100 78 L112 68', s = '';
      for (var i = 0; i < 6; i++) s += p(arm, 'none', ' stroke-width="18"' + rot(i * 60, 100, 100));
      for (var j = 0; j < 6; j++) s += p(arm, 'none', ' stroke="#9ad6ff" stroke-width="10"' + rot(j * 60, 100, 100));
      return s + c(100, 100, 13, '#9ad6ff', ' stroke-width="5"');
    })());

  def('sky', 'sky / そら',
    r(14, 14, 172, 172, 36, C.sky) +
    (function () { var s = ''; for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; s += ostroke('M' + n(130 + 34 * Math.cos(a)) + ' ' + n(66 + 34 * Math.sin(a)) + ' L' + n(130 + 46 * Math.cos(a)) + ' ' + n(66 + 46 * Math.sin(a)), 7, C.orange); } return s; })() +
    c(130, 66, 26, C.yellow) +
    blob([[60, 128, 24], [90, 116, 30], [120, 130, 24], [84, 140, 22], [140, 142, 16], [40, 144, 16]], C.white));

  def('pencil', 'pencil / えんぴつ',
    g(r(26, 84, 22, 32, 8, C.pink) + r(44, 82, 14, 36, 2, C.gray) +
      r(56, 84, 96, 32, 0, C.yellow) + p('M56 100 L152 100', 'none', ' stroke="#f0b400" stroke-width="5"') +
      p('M152 84 L186 100 L152 116 Z', C.tan) + p('M174 94.5 L186 100 L174 105.5 Z', K, ' stroke-width="4"'),
      rot(-35, 100, 100)));

  def('soap', 'soap / せっけん',
    c(64, 54, 18, '#e7f6ff') + c(100, 38, 12, '#e7f6ff') + c(132, 58, 15, '#e7f6ff') + c(150, 32, 8, '#e7f6ff') +
    c(58, 48, 4, '#fff', NS) + c(127, 52, 3.5, '#fff', NS) +
    r(34, 98, 132, 70, 26, C.pink) + r(48, 108, 104, 26, 13, '#ffc2d6', NS) +
    eyes(84, 116, 140, 0.8) + cheeks(72, 128, 150, 6) + smile(100, 148, 6, 4) +
    c(160, 92, 12, '#e7f6ff'));

  def('hand', 'hand / て',
    (function () {
      var f = [[82, 92, 78, 36], [103, 88, 103, 28], [124, 92, 128, 38], [142, 104, 154, 62], [62, 128, 34, 98]];
      var s = f.map(function (q) { return l(q[0], q[1], q[2], q[3], ' stroke-width="32"'); }).join('') + e(106, 134, 48, 50, K, ' stroke-width="6"');
      s += f.map(function (q) { return l(q[0], q[1], q[2], q[3], ' stroke="' + C.skin + '" stroke-width="22"'); }).join('') + e(106, 134, 45, 47, C.skin, NS);
      s += p('M86 140 Q104 152 124 140', 'none', ' stroke="#e6a77c" stroke-width="5"') + p('M86 124 Q100 130 114 120', 'none', ' stroke="#e6a77c" stroke-width="4"');
      return s;
    })());

  def('glasses', 'glasses / めがね',
    p('M28 92 L10 72 M172 92 L190 72', 'none', ' stroke="' + C.purple2 + '" stroke-width="9"') +
    c(60, 108, 34, '#d8efff', ' stroke="' + C.purple2 + '" stroke-width="11"') + c(140, 108, 34, '#d8efff', ' stroke="' + C.purple2 + '" stroke-width="11"') +
    p('M86 100 Q100 88 114 100', 'none', ' stroke="' + C.purple2 + '" stroke-width="9"') +
    p('M44 100 L58 88 M124 100 L138 88', 'none', ' stroke="#fff" stroke-width="6"'));

  def('gem', 'ruby / るびー',
    p('M56 66 L144 66 L172 98 L100 176 L28 98 Z', C.red) +
    p('M56 66 L76 98 L100 66 L124 98 L144 66 M28 98 L172 98 M76 98 L100 176 L124 98', 'none', ' stroke-width="4"') +
    p('M60 70 L74 94 L36 94 Z', '#ff9a9e', NS) + p('M104 70 L120 94 L80 94 Z', '#ff8589', NS + ' opacity=".7"') +
    sparkle(158, 46, 1.1, '#fff') + sparkle(40, 50, 0.8, '#fff'));

  def('book', 'book / ほん',
    p('M100 58 Q66 40 22 52 L22 164 Q66 152 100 170 Q134 152 178 164 L178 52 Q134 40 100 58 Z', C.blue2) +
    p('M100 62 Q68 46 32 56 L32 154 Q68 144 100 160 Z', C.white) + p('M100 62 Q132 46 168 56 L168 154 Q132 144 100 160 Z', C.white) +
    p('M46 80 Q66 74 86 82 M46 100 Q66 94 86 102 M46 120 Q66 114 86 122 M114 82 Q134 74 154 80 M114 102 Q134 94 154 100 M114 122 Q134 114 154 120', 'none', ' stroke="#b9c3d9" stroke-width="5"') +
    p('M100 62 L100 160', 'none', ' stroke-width="4"'));

  def('xylophone', 'xylophone',
    p('M30 70 L170 90 M30 150 L170 128', 'none', ' stroke="' + C.brown2 + '" stroke-width="10"') +
    [[38, 56, 106, C.red], [62, 62, 96, C.orange], [86, 66, 88, C.yellow], [110, 70, 80, C.green], [134, 74, 72, C.blue], [158, 78, 64, C.purple]].map(function (q) {
      return r(q[0] - 9, q[1], 18, q[2], 7, q[3]) + c(q[0], q[1] + 12, 2.5, K, NS) + c(q[0], q[1] + q[2] - 12, 2.5, K, NS);
    }).join('') +
    ostroke('M120 182 L168 150', 6, C.tan) + c(170, 148, 11, C.red) +
    ostroke('M60 186 L100 160', 6, C.tan) + c(102, 158, 11, C.blue));

  def('yoyo', 'yo-yo',
    p('M100 118 L100 22', 'none', ' stroke-width="4"') + c(100, 16, 8, 'none', ' stroke-width="5"') +
    r(90, 112, 20, 26, 4, C.gray) +
    e(74, 125, 26, 56, C.red) + e(126, 125, 26, 56, C.red) +
    e(74, 125, 12, 30, '#ff8a8e', NS) + e(126, 125, 12, 30, '#ff8a8e', NS) +
    shine(66, 100, 5, 14, 0) + shine(118, 100, 5, 14, 0) +
    p('M30 160 Q22 126 30 92 M170 160 Q178 126 170 92', 'none', ' stroke="#c9c3d6" stroke-width="5"'));

  /* ---------------- CARD BACK ---------------- */
  var back = wrap(
    r(6, 6, 148, 188, 26, C.purple2) + r(16, 16, 128, 168, 20, C.purple, NS) +
    (function () { var o = ''; [[42, 44], [118, 44], [42, 156], [118, 156]].forEach(function (q) { o += p(starPath(q[0], q[1], 14, 6, 5, -90), '#ffe98a', ' stroke-width="3"'); }); return o; })() +
    c(80, 100, 38, '#fff', NS + ' opacity=".25"') + p(starPath(80, 102, 34, 16, 5, -90), C.yellow, ' stroke-width="5"') +
    c(80, 30, 4, '#fff', NS + ' opacity=".6"') + c(80, 170, 4, '#fff', NS + ' opacity=".6"') + c(28, 100, 4, '#fff', NS + ' opacity=".6"') + c(132, 100, 4, '#fff', NS + ' opacity=".6"'),
    '0 0 160 200');

  /* ---------------- UI ICONS (single colour = currentColor unless noted) ---------------- */
  function ic(body, vb) { return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (vb || '0 0 24 24') + '" aria-hidden="true">' + body + '</svg>'; }
  var I = {
    play: ic('<path d="M7 4.2c0-1 1.1-1.6 1.9-1.1l11.3 7.4c.8.5.8 1.7 0 2.2L8.9 20.1C8.1 20.6 7 20 7 19z" fill="currentColor"/>'),
    mic: ic('<rect x="8.5" y="2.5" width="7" height="12" rx="3.5" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'),
    ear: ic('<path d="M7 9.5a5 5 0 0 1 10 0c0 3-2.5 3.6-3 5.6-.5 2.2-1.6 4.4-4 4.4-1.6 0-2.6-1-3-2" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M10 10a2 2 0 0 1 4 0c0 1.4-1.6 1.6-1.6 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
    star: ic('<path d="' + starPath(12, 12.6, 10.5, 4.8, 5, -90) + '" fill="#ffd84d" stroke="#3b2b5a" stroke-width="1.6" stroke-linejoin="round"/>'),
    gear: ic('<path d="M12 2.8l1.6.3.5 2.3 1.6.7 2-1.3 1.2 1.1 1.2 1.2-1.3 2 .7 1.6 2.3.5.3 1.6-.3 1.6-2.3.5-.7 1.6 1.3 2-1.2 1.2-1.2 1.2-2-1.3-1.6.7-.5 2.3-1.6.3-1.6-.3-.5-2.3-1.6-.7-2 1.3-1.2-1.2-1.2-1.2 1.3-2-.7-1.6-2.3-.5L2.8 12l.3-1.6 2.3-.5.7-1.6-1.3-2 1.2-1.2 1.2-1.1 2 1.3 1.6-.7.5-2.3z" fill="#b8c2cf" stroke="#3b2b5a" stroke-width="1.4" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.4" fill="#fff" stroke="#3b2b5a" stroke-width="1.4"/>'),
    prev: ic('<path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'),
    next: ic('<path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'),
    check: ic('<path d="M4.5 12.5l5 5 10-11" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>'),
    speaker: ic('<path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'),
    again: ic('<path d="M19 12a7 7 0 1 1-2.1-5" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M17.5 2.8v4.6h-4.6" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>'),
    cards: ic('<rect x="2.5" y="5" width="11" height="15" rx="2.5" fill="#a970ff" stroke="#3b2b5a" stroke-width="1.4" transform="rotate(-10 8 12.5)"/><rect x="10.5" y="4" width="11" height="15" rx="2.5" fill="#fff" stroke="#3b2b5a" stroke-width="1.4" transform="rotate(8 16 11.5)"/><path d="' + starPath(16, 11.6, 3.6, 1.6, 5, -90) + '" fill="#ffd84d" stroke="#3b2b5a" stroke-width="1" stroke-linejoin="round" transform="rotate(8 16 11.5)"/>'),
    flagjp: ic('<rect x="1.5" y="5" width="21" height="14" rx="2.5" fill="#fff" stroke="#3b2b5a" stroke-width="1.3"/><circle cx="12" cy="12" r="4" fill="#e8434b"/>'),
    abc: ic('<rect x="2" y="3" width="20" height="18" rx="5" fill="#4fb3ff" stroke="#3b2b5a" stroke-width="1.3"/><path d="M6 16l3-8 3 8M7 13.5h4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="13.6" r="2.4" fill="none" stroke="#fff" stroke-width="2"/><path d="M18.4 11v5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>'),
    num: ic('<rect x="2" y="3" width="20" height="18" rx="5" fill="#2ec27e" stroke="#3b2b5a" stroke-width="1.3"/><circle cx="7" cy="12" r="2.2" fill="#ffd84d"/><circle cx="12" cy="12" r="2.2" fill="#fff"/><circle cx="17" cy="12" r="2.2" fill="#ff8fb1"/>'),
    home: ic('<path d="M4 11l8-7 8 7v8.5a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H5.5A1.5 1.5 0 0 1 4 19.5z" fill="currentColor"/>'),
    plus: ic('<path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'),
    close: ic('<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>')
  };

  window.ART = A;
  window.ART_LABELS = L;
  window.ART_BACK = back;
  window.ICONS = I;
})();
