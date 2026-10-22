document.querySelector('.hero').setAttribute('aria-label', t('about'));
document.querySelector('.hero h1').textContent = `${t('first')} ${t('last')}`;
{ const s = document.querySelectorAll('.line > span'); s[0].textContent = t('first'); s[4].textContent = t('last'); }
document.querySelector('.cases').setAttribute('aria-label', t('portfolio'));
$('skh').textContent = t('works'); document.querySelector('.ex-h').textContent = t('exp');

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
const sizeStrip = () => { const enter = (VH + stripEl.offsetHeight) / 2, release = track.children[11].offsetLeft - VW;
  pin.style.height = VH + Math.max(0, Math.round(release - enter)) + 'px'; };
const moveStrip = () => { const enter = (VH + stripEl.offsetHeight) / 2;
  const x = Math.min(Math.max(0, enter - pin.getBoundingClientRect().top), track.scrollWidth - VW);
  track.style.transform = `translateX(${-Math.round(x)}px)`; };
sizeStrip(); onWidth(sizeStrip); onFrame(moveStrip);
document.querySelector('.cases').innerHTML = `<h2 class="lbl">${t('portfolio')}</h2>` + C.cases.map(c => `<article class="case"><div class="txt" data-in><h3>${c.t}</h3><p>${c.d}</p></div><div class="frame" data-in><picture><source media="(max-width: 760px)" srcset="${c.img}-mobile.webp 540w, ${c.img}-mobile@1.5x.webp 810w, ${c.img}-mobile@2x.webp 1080w" sizes="100vw">${img(c)}</picture></div></article>`).join('');

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
const onSk = () => { const r = sk.getBoundingClientRect(), p = Math.min(1, Math.max(0, -r.top / (r.height - VH))), f = p * (lis.length - 1), i = Math.round(f), h = lis[0].offsetHeight;
  $('skl').style.transform = `translateY(${Math.round(-(f + .5) * h)}px)`;
  lis.forEach((l, j) => { const d = Math.abs(j - f); l.classList.toggle('on', j === i);
    l.style.filter = j === i ? '' : `blur(${Math.min(d * 2.5, 9).toFixed(1)}px)`; l.style.opacity = j === i ? '' : Math.max(.12, 1 - d * .28).toFixed(2); });
  pics.forEach((g, j) => g.classList.toggle('on', j === i)); };
onFrame(onSk);

$('jobs').innerHTML = C.jobs.map(j => `<div class="job" data-in><div class="y">${j.y}</div><div><div class="co"><img src="${ICON + j.ic}.svg" alt="">${j.n}</div><p class="a">${j.a}</p></div><div><p class="r">${j.r}</p><p class="t">${j.t}</p></div></div>`).join('');
const roundPics = () => document.querySelectorAll('.frame img').forEach(im => { const w = im.naturalWidth || +im.getAttribute('width'), h = im.naturalHeight || +im.getAttribute('height');
  im.style.height = ''; im.style.height = Math.round(im.getBoundingClientRect().width * h / w) + 'px'; im.style.objectFit = 'cover'; });
roundPics(); onWidth(roundPics);
document.querySelectorAll('.frame img').forEach(im => im.addEventListener('load', roundPics));
watch();
noHang();
if (location.hash) { const target = document.querySelector(location.hash); if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant' })); }
