document.querySelector('.hero').setAttribute('aria-label', t('about'));
document.querySelector('.hero h1').textContent = `${t('first')} ${t('last')}`;
{ const s = document.querySelectorAll('.line > span'); s[0].textContent = t('first'); s[4].textContent = t('last'); }
document.querySelector('.cases').setAttribute('aria-label', t('portfolio'));
$('skh').textContent = t('works'); document.querySelector('.ex-h').textContent = t('exp');
$('abh').textContent = t('about');
$('abt').replaceChildren(...C.about.map(text => { const p = document.createElement('p'); p.textContent = text; return p; }));

const aboutDialog = $('about'), aboutClose = $('about-close');
aboutClose.innerHTML = `<span>${t('close')}</span>${CLOSE}`;
let aboutOpener = null;
const openAbout = opener => {
  if (aboutDialog.open) return;
  aboutOpener = opener?.closest('.menu') ? $('burger') : opener;
  aboutDialog.showModal();
  document.documentElement.classList.add('about-open');
  window.lenis?.stop();
  aboutClose.focus({ preventScroll: true });
};
const closeAbout = () => aboutDialog.close();
aboutClose.addEventListener('click', closeAbout);
aboutDialog.addEventListener('click', e => {
  if (e.target !== aboutDialog) return;
  const r = aboutDialog.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeAbout();
});
aboutDialog.addEventListener('close', () => {
  document.documentElement.classList.remove('about-open');
  if (!document.documentElement.classList.contains('menu-open')) window.lenis?.start();
  aboutOpener?.focus({ preventScroll: true });
  if (location.hash === '#about') history.replaceState(null, '', location.pathname + location.search);
});
document.addEventListener('click', e => {
  const link = e.target.closest('a[href="#about"]');
  if (!link) return;
  e.preventDefault(); openAbout(link);
});
addEventListener('hashchange', () => { if (location.hash === '#about') openAbout(); });
if (location.hash === '#about') openAbout();

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
// a click anywhere on the first screen except the description window glides the page down to the carousel (the header sits outside the hero)
document.querySelector('.hero').addEventListener('click', e => {
  if (e.target.closest('#win') || document.documentElement.classList.contains('intro')) return;
  const strip = document.querySelector('.strip-pin');
  if (window.lenis) lenis.scrollTo(strip, { duration: 1.6, easing: x => x < .5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2 });
  else strip.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth' });
});
Promise.race([Promise.all([document.fonts.ready, wait(1900)]), wait(4500)]).then(() => {
  if (INTRO) scrollTo(0, 0); win.classList.add('open'); setTimeout(typeIn, 150);
  setTimeout(() => { const h = document.documentElement; h.classList.remove('intro'); h.classList.add('enter'); setTimeout(() => h.classList.remove('enter'), 1400); }, 900);
});

// Two-row carousel: a short scroll passage, no pinned screen.
const track = $('track'), pin = document.querySelector('.strip-pin');
const slide = i => `<img src="${A}carousel/slide_${String(i).padStart(2, '0')}.webp" alt="" width="760" height="440" loading="lazy" decoding="async">`;
track.innerHTML = Array.from({length: 10}, (_, i) => slide(i + 1)).join('');
const secondTrack = track.cloneNode(false); secondTrack.id = 'track-reverse';
secondTrack.innerHTML = Array.from({length: 10}, (_, i) => slide((i + 5) % 10 + 1)).join('');
track.after(secondTrack);
const moveStrip = () => {
  const r = pin.getBoundingClientRect(), p = Math.min(1, Math.max(0, (VH - r.top) / (VH + r.height)));
  const distance = REDUCE ? 0 : Math.min(VW * .55, 640);
  track.style.transform = `translateX(${-Math.round(p * distance)}px)`;
  secondTrack.style.transform = `translateX(${-Math.round((1 - p) * distance)}px)`;
};
onFrame(moveStrip);
document.querySelector('.cases').innerHTML = `<h2 class="lbl">${t('portfolio')}</h2>` + C.cases.map((c, i) => `<article class="case"${i === 0 ? ' id="portfolio"' : ''}><div class="txt" data-in><h3>${c.t}</h3><div class="d">${[].concat(c.d).map(p => `<p>${p}</p>`).join('')}</div>${i >= 0 ? `<div class="case-actions"><a class="case-details" href="/work/${i === 0 ? 'aspro' : i === 1 ? 'nebo' : 'recuerdo'}/${EN ? '?lang=en' : ''}">${EN ? 'View project' : 'Подробнее'}</a></div>` : ''}</div><div class="frame" data-in>${c.imgs.map(m => img(c, m)).join('')}</div></article>`).join('');

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
if (location.hash && location.hash !== '#about') { const target = document.querySelector(location.hash); if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: 'instant' })); }
