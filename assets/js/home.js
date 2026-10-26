document.querySelector('.hero').setAttribute('aria-label', t('about'));
document.querySelector('.hero h1').textContent = `${t('first')} ${t('last')}`;
{ const s = document.querySelectorAll('.line > span'); s[0].textContent = t('first'); s[4].textContent = t('last'); }
document.querySelector('.cases').setAttribute('aria-label', t('portfolio'));
$('skh').textContent = t('works'); document.querySelector('.ex-h').textContent = t('exp');
$('abh').textContent = t('about'); // [[words|NN]] in the text are underlined; hovering them (a tap on phones) pops up about-NN above the words, the way the pictures come up in «С чем работаю»
$('abt').innerHTML = C.about.map(p => `<p>${p.replace(/\[\[(.+?)\|(\d+)\]\]/g, (_, w, n) => `<span class="ab-w" tabindex="0" data-ph="${n}">${w}</span>`)}</p>`).join('');
const ab = $('about'), abWords = [...ab.querySelectorAll('.ab-w')];
const abPops = abWords.map(w => { const im = document.createElement('img'); im.className = 'ab-pop'; im.src = `${A}about/about-${w.dataset.ph}.webp`; im.alt = ''; im.loading = 'lazy'; ab.append(im); return im; });
const abShow = (k, on) => { const w = abWords[k], im = abPops[k];
  if (on) { const a = ab.getBoundingClientRect(), r = [...w.getClientRects()][0], pw = im.offsetWidth, pad = parseFloat(getComputedStyle(ab).paddingLeft);
    im.style.left = Math.round(Math.min(Math.max(r.left + r.width / 2 - pw / 2 - a.left, pad), a.width - pad - pw)) + 'px';
    im.style.top = Math.round(r.top - a.top - im.offsetHeight - 6) + 'px'; }
  w.classList.toggle('on', on); im.classList.toggle('on', on); };
abWords.forEach((w, k) => {
  w.addEventListener('mouseenter', () => abShow(k, true)); w.addEventListener('mouseleave', () => abShow(k, false));
  w.addEventListener('focus', () => abShow(k, true)); w.addEventListener('blur', () => abShow(k, false));
  w.addEventListener('click', () => { if (matchMedia('(hover: none)').matches) abWords.forEach((_, j) => abShow(j, j === k && !w.classList.contains('on'))); }); });
document.addEventListener('click', e => { if (!e.target.closest('.ab-w')) abWords.forEach((_, j) => abWords[j].classList.contains('on') && abShow(j, false)); });

const DESC = C.desc.map(l => l.replace(/(?<=^|[\s(])([а-яё]{1,2}|\d+[+%]?) /gi, '$1\u00a0'));
$('desc').textContent = DESC.join(' ');
$('wtxt').innerHTML = DESC.map(l => [...l].map(ch => `<i>${ch}</i>`).join('')).join('<br>') + '<span class="caret"></span>';
const typeIn = () => { const chars = [...$('wtxt').querySelectorAll('i')], caret = $('wtxt').querySelector('.caret'); let n = 0;
  const step = () => { if (n < chars.length) { chars[n].classList.add('t'); chars[n].after(caret); n++; setTimeout(step, chars[n - 1].textContent === ' ' ? 24 : 12); } };
  if (REDUCE) { chars.forEach(c => c.classList.add('t')); chars.at(-1).after(caret); return; }
  chars[0].before(caret); step(); };
const win = $('win');
const wait = ms => new Promise(r => setTimeout(r, ms));
const INTRO = document.documentElement.classList.contains('intro');
Promise.race([Promise.all([document.fonts.ready, wait(1900)]), wait(4500)]).then(() => {
  if (INTRO) scrollTo(0, 0); win.classList.add('open'); setTimeout(typeIn, 150);
  setTimeout(() => { const h = document.documentElement; h.classList.remove('intro'); h.classList.add('enter'); setTimeout(() => h.classList.remove('enter'), 1400); }, 900);
});

const SLIDES = Array.from({ length: 10 }, (_, i) => `<img src="${A}carousel/slide_${String(i + 1).padStart(2, '0')}.webp" alt="" width="760" height="440" loading="lazy" decoding="async">`).join('');
$('track').innerHTML = SLIDES.repeat(3);
const track = $('track'), pin = document.querySelector('.strip-pin'), stripEl = document.querySelector('.strip');
// phones: the strip is not held in place, it scrolls with the page and the track only drifts sideways while it passes the screen
const PHONE = () => VW <= 760;
const sizeStrip = () => { if (PHONE()) { pin.style.height = ''; return; }
  const enter = (VH + stripEl.offsetHeight) / 2, release = track.children[11].offsetLeft - VW;
  pin.style.height = VH + Math.max(0, Math.round(release - enter)) + 'px'; };
const moveStrip = () => { let x;
  if (PHONE()) { const r = pin.getBoundingClientRect(), p = Math.min(1, Math.max(0, (VH - r.top) / (VH + r.height))); x = p * Math.min(track.scrollWidth - VW, VW * 2); }
  else { const enter = (VH + stripEl.offsetHeight) / 2; x = Math.min(Math.max(0, enter - pin.getBoundingClientRect().top), track.scrollWidth - VW); }
  track.style.transform = `translateX(${-Math.round(x)}px)`; };
sizeStrip(); onWidth(sizeStrip); onFrame(moveStrip);
document.querySelector('.cases').innerHTML = `<h2 class="lbl">${t('portfolio')}</h2>` + C.cases.map(c => `<article class="case"><div class="txt" data-in><h3>${c.t}</h3><div class="d">${[].concat(c.d).map(p => `<p>${p}</p>`).join('')}</div></div><div class="frame" data-in>${c.imgs.map(m => img(c, m)).join('')}</div></article>`).join('');

const SKW = [['aspro-brandbook', 'regina-script'], ['tini-cd', 'aspro-cases-collage'], ['aspro-chat', 'aspro-case'], ['aspro-bear', 'krid-poster', 'aspro-new-year'],
  ['aspro-banners'], ['aspro-dashboard'], ['aspro-sync-icon', 'tini-lines'], ['basta-poster', 'poster-high-infidelity'], [],
  ['tini-cupido-poster'], ['aspro-molecule'], ['aspro-shop', 'aspro-search']];
const SK_ORDER = [0, 3, 2, 9, 4, 5, 1, 8, 7, 10, 6, 11];
const SK = SK_ORDER.map(i => C.skills[i]), SKG = SK_ORDER.map(i => SKW[i]);
$('skl').innerHTML = SK.map(s => `<li>${s}</li>`).join('');
const CORNERS = [[80, 26], [20, 74], [20, 26], [80, 74]], OPP = [1, 0, 3, 2];
let ci = 0;
$('skp').innerHTML = SKG.map(g => { const html = `<div class="grp">${g.map((f, k) => { let pos = '';
    if (k) { const c = k === 1 ? ci % 4 : OPP[ci % 4]; pos = ` style="left:${CORNERS[c][0]}%;top:${CORNERS[c][1]}%"`; }
    return `<img src="${A}works/${f}.webp" alt="" loading="lazy"${pos}>`; }).join('')}</div>`;
  if (g.length > 1) ci++; return html; }).join('');
const lis = [...$('skl').children], pics = [...$('skp').children], sk = document.querySelector('.sk');
// the inactive items sit behind the pictures: a copy of the list under them shows the blurred ones, the list on top keeps only the active one
const back = document.querySelector('.sk-list').cloneNode(true), backUl = back.querySelector('ul'), backLis = [...backUl.children];
back.classList.add('sk-back'); back.setAttribute('aria-hidden', 'true'); backUl.removeAttribute('id'); document.querySelector('.sk-pic').before(back);
const onSk = () => { const r = sk.getBoundingClientRect(), p = Math.min(1, Math.max(0, -r.top / (r.height - VH))), f = p * (lis.length - 1), i = Math.round(f), h = lis[0].offsetHeight;
  $('skl').style.transform = backUl.style.transform = `translateY(${Math.round(-(f + .5) * h)}px)`;
  lis.forEach((l, j) => { const d = Math.abs(j - f), on = j === i; l.classList.toggle('on', on); l.style.opacity = on ? '' : '0';
    const b = backLis[j]; b.style.opacity = on ? '0' : Math.max(.12, 1 - d * .28).toFixed(2); b.style.filter = on ? '' : `blur(${Math.min(d * 2.5, 9).toFixed(1)}px)`; });
  pics.forEach((g, j) => g.classList.toggle('on', j === i)); };
onFrame(onSk);
// the pinned panel ends with empty space under its last pictures: «Опыт работы» moves up into it, so the gap above the label is the same 200px (120px on phones) as before «Обо мне»
const ex = document.querySelector('.ex');
const exGap = () => { const H = sk.firstElementChild.offsetHeight, low = Math.max(H / 2 + lis[0].offsetHeight / 2, ...[...pics[pics.length - 1].children].map(im => im.offsetTop + im.offsetHeight / 2));
  ex.style.marginTop = -Math.max(0, Math.floor(H - low)) + 'px'; };
exGap(); onWidth(exGap);

$('jobs').innerHTML = C.jobs.map(j => `<div class="job" data-in><div class="y">${j.y}</div><div><div class="co"><img src="${ICON + j.ic}.svg" alt="">${j.n}</div><p class="a">${j.a}</p></div><div><p class="r">${j.r}</p><p class="t">${j.t}</p></div></div>`).join('');
const roundPics = () => document.querySelectorAll('.frame img').forEach(im => { const w = im.naturalWidth || +im.getAttribute('width'), h = im.naturalHeight || +im.getAttribute('height');
  im.style.height = ''; im.style.height = Math.round(im.getBoundingClientRect().width * h / w) + 'px'; im.style.objectFit = 'cover'; });
roundPics(); onWidth(roundPics);
// retina desktops: once a case picture has loaded, its @2x file is fetched in the background and swapped in only when fully ready
const HI = () => devicePixelRatio > 1 && !matchMedia('(max-width: 760px)').matches;
const upgrade = im => { if (!HI() || im.dataset.up || !im.dataset.hi) return; im.dataset.up = 1;
  const hi = new Image(); hi.src = im.dataset.hi; hi.decode().then(() => { im.src = hi.src; }).catch(() => { delete im.dataset.up; }); };
const upgradeAll = () => document.querySelectorAll('.frame img[data-hi]').forEach(im => { if (im.complete && im.naturalWidth) upgrade(im); else im.addEventListener('load', () => upgrade(im), { once: true }); });
addEventListener('load', upgradeAll); onWidth(upgradeAll);
document.querySelectorAll('.frame img').forEach(im => im.addEventListener('load', roundPics));
watch();
noHang();
if (location.hash) { const target = document.querySelector(location.hash); if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant' })); }

// easter egg: a click on the description types one more paragraph, and that line really can be edited.
// It lives only on this page: nothing is sent or saved, a reload brings the description back
const EGG = EN ? 'Yes, you can write anything here' : 'Да, тут можно написать что угодно', EGG_MAX = 42;   // 42 characters still fit the window on desktop
let egg = null;
// on phones the window is its own row between the two names: it grows with the extra lines, so the names move apart instead of overlapping
const fitWin = () => { win.style.minHeight = egg && innerWidth <= 760 ? $('wtxt').offsetHeight + 16 + 'px' : ''; };
onWidth(fitWin);
const caretToEnd = el => { el.focus(); const r = document.createRange(); r.selectNodeContents(el); r.collapse(false); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
$('wtxt').addEventListener('click', () => {
  const p = $('wtxt'), caret = p.querySelector('.caret');
  if (egg) { if (egg.isContentEditable && document.activeElement !== egg) caretToEnd(egg); return; }
  if (p.querySelector('i:not(.t)')) return;   // the description is still being typed
  p.insertAdjacentHTML('beforeend', '<br><br>');
  egg = document.createElement('span'); egg.className = 'egg'; p.append(egg, caret); fitWin();
  const done = () => {
    egg.textContent = EGG; egg.spellcheck = false;
    egg.contentEditable = 'plaintext-only'; if (egg.contentEditable !== 'plaintext-only') egg.contentEditable = 'true';
    caretToEnd(egg);
  };
  if (REDUCE) return done();
  const chars = [...EGG]; let n = 0;
  const step = () => { if (n < chars.length) { egg.textContent += chars[n++]; fitWin(); setTimeout(step, chars[n - 1] === ' ' ? 24 : 12); } else done(); };
  step();
});
// one line, a length that fits, plain text only; Enter just finishes
$('wtxt').addEventListener('input', e => { if (e.target === egg) fitWin(); });
$('wtxt').addEventListener('keydown', e => { if (e.target === egg && e.key === 'Enter') { e.preventDefault(); egg.blur(); } });
$('wtxt').addEventListener('beforeinput', e => {
  if (e.target !== egg || !e.inputType.startsWith('insert')) return;
  if (e.inputType === 'insertParagraph' || e.inputType === 'insertLineBreak') return e.preventDefault();
  const sel = getSelection(), picked = sel.rangeCount ? sel.getRangeAt(0).toString().length : 0, data = e.data ?? e.dataTransfer?.getData('text/plain') ?? '';
  const room = EGG_MAX - egg.textContent.length + picked;
  if (data.length <= room) return;
  // too long (a pasted or auto-completed chunk): keep only what still fits
  e.preventDefault();
  if (room > 0) document.execCommand('insertText', false, data.replace(/\s+/g, ' ').slice(0, room));
});
$('wtxt').addEventListener('paste', e => {
  if (e.target !== egg) return; e.preventDefault();
  const sel = getSelection(), picked = sel.rangeCount ? sel.getRangeAt(0).toString().length : 0;
  const text = (e.clipboardData?.getData('text/plain') || '').replace(/\s+/g, ' ').slice(0, Math.max(0, EGG_MAX - egg.textContent.length + picked));
  if (text) document.execCommand('insertText', false, text);
});
