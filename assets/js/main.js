// Регина Тарасова · reginatarasova.com
// content
// language: ?lang=en is the same page with the texts swapped (GitHub Pages has no rewrites; old /en/ links are sent here by 404.html)
const EN = location.pathname.startsWith('/en') || new URLSearchParams(location.search).get('lang') === 'en';
const URL_RU = location.pathname, URL_EN = location.pathname + '?lang=en';
const CASES_RU = [
  ['Айдентика и развитие системы Аспро.Cloud', 'Развивала и систематизировала визуальную айдентику бренда: работала с графическими решениями, стилем коммуникаций и основными визуальными носителями. Совместно с командой выстраивала единый принцип оформления, который помог сделать бренд более последовательным и узнаваемым в цифровой среде.'],
  ['Егор Крид, Звери, Баста и другие — рекламные кампании гастрольных туров', 'Разрабатывала визуальную систему рекламной кампании гастрольных туров Небо Рекордс: создавала серию афиш и адаптировала их под разные города, площадки и форматы. Выстраивала единый визуальный язык, который позволил сохранять целостность кампании при выпуске более ста концертов в год.'],
  ['TINI — визуальный проект альбома Recuerdo', 'Разрабатывала комплексный визуальный проект для альбома TINI «Recuerdo»: дизайн обложки, физических форматов, буклета и пре-сейв страницы. Выстраивала единый визуальный язык, который работал на разных носителях — от виниловой пластинки до digital-форматов.']];
const JOBS_RU = [
  ['2023 — 2026', 'aspro', 'Аспро', 'Готовые сайты, интернет-магазины и облачная CRM-платформа для российского и зарубежного рынка', 'Графический дизайнер', 'Делала digital-креативы для B2B-клиентов из разных отраслей: лендинги, баннеры, обложки для блога. Собрала 30 сложных лендингов для отдела SEO за месяц. Внедрила AI-инструменты в рабочие процессы команды: сократила время создания обложки с 5 часов до 1,5 по данным тайм-трекера. Прошла испытательный срок за 2 месяца вместо стандартных 3.'],
  ['2024 — 2026', 'nebo', 'Небо Рекордс', 'Концертное агентство, гастрольные туры популярных артистов', 'Старший дизайнер', 'Делала афиши концертов и материалы для интернет-рекламы (Егор Крид, Звери, Баста, Artik &amp; Asti, Xolidayboy, Алиса, Евгений Чебатков). Наружная реклама к печати: биллборды 6×3, ситиформаты, пиллары. ТВ-ролики и анимация для диджитал-экранов. Вела 100+ мероприятий в год, разработала собственную систему оперативного обновления макетов.'],
  ['2022 — 2023', 'kassy', 'Kassy.ru', 'Онлайн-сервис по продаже билетов на мероприятия и концертный организатор', 'Графический дизайнер', 'Создавала афиши и рекламные материалы для концертов, театра, стендапа и детских шоу. Готовила макеты наружной рекламы к печати, монтировала ТВ-ролики и анимацию для диджитал-экранов. Закрыла потребность компании во фрилансере по видеомонтажу, взяла его обязанности на себя. Сопровождала артистов в турах по России в роли бэкстейдж-менеджера.'],
  ['2018 — 2021', 'photo', 'Типография', 'Фотопечать, ретушь и сувенирная продукция', 'Графический дизайнер / Оператор печати', 'Обрабатывала заказы на печать, ретушь и восстановление фотографий, создавала коллажи и макеты сувенирной продукции. Обучала новых сотрудников работе в Photoshop. Обрабатывала от 30 до 50 заказов за смену, рекорд — 112 клиентов.']];
// «С чем работаю»: left column first, then the right one (6 + 6); pictures sit unevenly so they don't form a pattern
const SKILLS_RU = [['Бренд-дизайн и айдентика', 'brand-identity'], ['Адаптации на носители'], ['Коммуникационный дизайн', 'communication'], ['Key visual и рекламные кампании', 'key-visual'], ['Digital-креативы и баннеры'], ['Презентации'],
  ['Моушен и видео'], ['Наружная реклама', 'outdoor'], ['Мерч', 'merch'], ['Ретушь'], ['AI', 'ai'], ['Лендинги']];
// bento per case: [desktop file, width, height (of the 1x file; @2x is twice that), phone file, width, height, alt]
const BENTO_RU = [['cases/aspro-bento', 1728, 1751, 'cases/aspro-bento-mobile', 1080, 1454, 'Айдентика Аспро.Cloud'],
  ['cases/nebo-bento', 1728, 835, 'cases/nebo-bento-mobile', 1080, 1351, 'Концертные туры Небо Рекордс'],
  ['cases/tini-bento', 1728, 861, 'cases/tini-bento-mobile', 1080, 1931, 'TINI — Recuerdo']];
const CASES_EN = [
  ['Identity and Development of the Aspro.Cloud System', 'Developed and systematised the brand\'s visual identity: worked on graphic solutions, communication style and key visual assets. Together with the team, built a unified design language that made the brand more consistent and recognisable in the digital space.'],
  ['Egor Kreed, Zveri, Basta and Others — Concert Tour Ad Campaigns', 'Developed the visual system for Nebo Records\' concert tour advertising campaigns: created a series of posters and adapted them for different cities, venues and formats. Built a unified visual language that maintained campaign cohesion across more than a hundred concerts per year.'],
  ['TINI — Visual Project for the Album Recuerdo', 'Developed a comprehensive visual project for TINI\'s album «Recuerdo»: cover design, physical formats, booklet and pre-save page. Built a unified visual language that worked across different media — from vinyl record to digital formats.']];
const JOBS_EN = [
  ['2023 — 2026', 'aspro', 'Aspro', 'Ready-made websites, online stores and cloud CRM platform for domestic and international markets', 'Graphic Designer', 'Created digital creatives for B2B clients across various industries: landing pages, banners, blog covers. Built 30 complex landing pages for the SEO team in one month. Introduced AI tools into team workflows: cut cover creation time from 5 hours to 1.5 according to time tracker data. Passed probation in 2 months instead of the standard 3.'],
  ['2024 — 2026', 'nebo', 'Nebo Records', 'Concert agency, nationwide tours of popular artists', 'Senior Designer', 'Created concert posters and digital advertising materials (Egor Kreed, Zveri, Basta, Artik &amp; Asti, Xolidayboy, Alisa, Evgeny Chebatkov). Print-ready outdoor advertising: 6×3 billboards, city formats, pillars. TV commercials and animations for digital screens. Managed 100+ events per year, developed a personal system for rapid layout updates.'],
  ['2022 — 2023', 'kassy', 'Kassy.ru', 'Online ticketing service for events and concert organiser', 'Graphic Designer', 'Created posters and advertising materials for concerts, theatre, stand-up and children\'s shows. Prepared print-ready outdoor advertising layouts, edited TV commercials and animations for digital screens. Took over video editing responsibilities, eliminating the need for a freelancer. Accompanied artists on tours across Russia as a backstage manager.'],
  ['2018 — 2021', 'photo', 'Print Shop', 'Photo printing, retouching and souvenir products', 'Graphic Designer / Print Operator', 'Processed orders for printing, photo retouching and restoration, created collages and souvenir product layouts. Trained new employees in Photoshop. Handled 30 to 50 orders per shift, personal record — 112 clients.']];
const SKILLS_EN = [['Brand design and identity', 'brand-identity'], ['Adaptations across media'], ['Communication design', 'communication'], ['Key visual and ad campaigns', 'key-visual'], ['Digital creatives and banners'], ['Presentations'],
  ['Motion and video'], ['Outdoor advertising', 'outdoor'], ['Merch', 'merch'], ['Retouching'], ['AI', 'ai'], ['Landing pages']];
const BENTO_EN = BENTO_RU.map((b, i) => [...b.slice(0, 6), ['Aspro.Cloud identity', 'Nebo Records concert tours', 'TINI — Recuerdo'][i]]);
// interface texts: [Russian, English]
const T = {
  works: ['С чем работаю', 'What I work with'], exp: ['Опыт работы', 'Experience'], portfolio: ['Портфолио', 'Portfolio'],
  contact: ['Связаться', 'Contact'], menu: ['Меню', 'Menu'], close: ['Закрыть', 'Close'], top: ['Наверх', 'Top'], about: ['Обо мне', 'About me'], nav: ['Навигация', 'Navigation'],
  name: ['Регина<br>Тарасова', 'Regina<br>Tarasova'],
  desc: ['Графический дизайнер<br class="m-br"> с опытом 7+ лет <br>Digital и концертная индустрия<br class="m-br"> (и не только)', 'Graphic designer<br class="m-br"> with 7+ years of experience <br>Digital and concert industry<br class="m-br"> (and beyond)'],
  joke: ['Если вы долистали до этого футера и решили закрыть страницу, то у вас не будет работать дизайнер, который работал с Егором Кридом. Думайте.', 'If you scrolled all the way down to this footer and decided to close the page, you won\'t have a designer who worked with Egor Kreed. Think about it.'],
  meta: ['Графический дизайнер с опытом 7+ лет. Специализируюсь на digital и концертной индустрии.', 'Graphic designer with 7+ years of experience. Specialising in the digital and concert industry.']
};
const t = k => T[k][EN ? 1 : 0];
const [CASES, JOBS, SKILLS, BENTO] = EN ? [CASES_EN, JOBS_EN, SKILLS_EN, BENTO_EN] : [CASES_RU, JOBS_RU, SKILLS_RU, BENTO_RU];
const A = 'assets/img/';
// bento with no @2x file: the Aspro one exists only at 1728 px (from the original), so every screen gets that one
const NO2X = ['cases/aspro-bento'];
// Regina's own arrow icon (assets/icon/desktop/arrow_up.svg), inline so it takes the text colour
const ARROW = '<svg class="arr" viewBox="0 0 14 14" aria-hidden="true"><path fill="currentColor" d="M13 0C13.5523 2.41412e-08 14 0.448692 14 1.00098V13.001C13.9997 13.553 13.5521 14.001 13 14.001C12.4477 14.001 12 13.5523 12 13V3.41406L1.70703 13.708C1.31652 14.0981 0.683369 14.0973 0.292969 13.707C-0.0973982 13.3166 -0.0973106 12.6835 0.292969 12.293L10.5859 2H1C0.447716 2 -2.41411e-08 1.55228 0 1C0.000255835 0.447933 0.447873 -5.17162e-10 1 0H13Z"/></svg>';

// static markup in index.html is Russian; switch it here
if (EN) {
  document.documentElement.lang = 'en';
  document.querySelector('meta[name="description"]').content = t('meta');
  document.querySelector('.title h1').innerHTML = t('name');
  document.getElementById('desc').innerHTML = t('desc');
  document.getElementById('top').setAttribute('aria-label', t('about'));
  document.querySelector('.h2-logo').setAttribute('aria-label', t('top'));
  document.querySelector('.h2-nav').setAttribute('aria-label', t('nav'));
  const [p, e] = document.querySelectorAll('.h2-nav .m-hide'); p.textContent = t('portfolio'); e.textContent = t('exp');
  document.getElementById('cta').textContent = t('contact');
}
{ const l = document.querySelector('.h2-nav .lang'); l.textContent = EN ? 'RU' : 'EN'; l.lang = l.hreflang = EN ? 'ru' : 'en'; l.href = EN ? URL_RU : URL_EN; }
document.getElementById('sheet').innerHTML = `
  <section class="sec" id="portfolio"><div class="cases">
    ${CASES.map(([t, d], i) => { const [dk, dw, dh, mb, mw, mh, alt] = BENTO[i];
      // the browser picks the 1x file on regular screens and the @2x one on retina
      return `<article class="case bento"><div class="case-inner"><div class="case-head"><h2>${t}</h2><div><p>${d}</p></div></div>
        <picture><source media="(max-width: 768px)" srcset="${A + mb}.webp 540w, ${A + mb}@1.5x.webp 810w, ${A + mb}@2x.webp 1080w" sizes="100vw" width="${mw}" height="${mh}"><img loading="lazy" decoding="async" src="${A + dk}.webp" srcset="${A + dk}.webp ${dw}w${NO2X.includes(dk) ? '' : `, ${A + dk}@2x.webp ${dw * 2}w`}" sizes="(min-width: 1920px) calc(100vw - 192px), 90vw" alt="${alt}" width="${dw}" height="${dh}"></picture></div></article>`; }).join('')}
  </div></section>
  <section class="sec"><h2 class="h2">${t('works')}</h2><ul class="formats skills">
    ${SKILLS.map(([n, img]) => `<li>${n}${img ? `<img src="${A}skills/${img}.webp" alt="" loading="lazy">` : ''}</li>`).join('')}
  </ul></section>
  <section class="sec" id="experience"><h2 class="h2">${t('exp')}</h2><div class="exps">
    ${JOBS.map(([y, ic, n, a, r, t]) => `<div class="exp"><div><span class="yrs">${y}</span><div class="co"><img src="assets/icon/desktop/${ic}.svg" alt=""><b>${n}</b></div><p class="about">${a}</p></div><div><p class="role">${r}</p><p class="notes">${t}</p></div></div>`).join('')}
  </div></section>`;
document.getElementById('foot').innerHTML = `
  <div class="contacts"><a href="https://t.me/redgini" target="_blank" rel="noopener">Telegram <span>@redgini${ARROW}</span></a><a href="mailto:reedgini@gmail.com">Email <span>reedgini@gmail.com${ARROW}</span></a><a href="https://linkedin.com/in/reginatarasova" target="_blank" rel="noopener">LinkedIn <span>reginatarasova${ARROW}</span></a></div>
  <p class="joke">${t('joke')}</p>
  <div class="foot-nav"><div><a href="#portfolio">${t('portfolio')}</a><a href="#experience">${t('exp')}</a><a href="#top">${t('top')}${ARROW}</a></div><span>© 2026</span>
    <span class="lang-m">${EN ? `<a href="${URL_RU}" lang="ru" hreflang="ru">RU</a><span>/</span><b>EN</b>` : `<b>RU</b><span>/</span><a href="${URL_EN}" lang="en" hreflang="en">EN</a>`}</span></div>`;   // RU / EN shows in the footer on phones only

// smooth scroll + anchors
gsap.registerPlugin(ScrollTrigger);
// iOS Safari resizes the window when its toolbar slides in and out; that must not re-measure the page mid-scroll
ScrollTrigger.config({ ignoreMobileResize: true });
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
// phones and tablets: no hover, no works in the hero, and the hero is held by CSS sticky instead of a GSAP pin (smoother on touch)
const HOVER = matchMedia('(hover: hover)').matches;
document.documentElement.classList.toggle('touch', !HOVER);
// run only when the width really changes (the toolbar of a phone browser changes just the height)
const onWidth = (fn, wait = 200) => { let w = innerWidth, tm; addEventListener('resize', () => { if (innerWidth === w) return; w = innerWidth; clearTimeout(tm); tm = setTimeout(fn, wait); }); };
const lenis = new Lenis({ lerp: .1 });
window.lenis = lenis;
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
document.addEventListener('click', e => { const a = e.target.closest('a[href^="#"]'); if (!a) return; const id = a.getAttribute('href'); if (id === '#') return; const el = id === '#top' ? 0 : document.querySelector(id); if (el === null) return; e.preventDefault(); document.dispatchEvent(new CustomEvent('nav')); lenis.scrollTo(el, { duration: 1.4 }); });

// phone menu, as on the previous site: a green screen with the logo, a close button, the three links and the language
// burger and cross share one size and one line weight
const CLOSE = '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.5"/></svg>';
const menu = document.createElement('div'), burger = document.getElementById('burger');
menu.className = 'menu'; menu.setAttribute('aria-hidden', 'true'); menu.inert = true;
menu.innerHTML = `<div class="menu-top"><a href="#top" aria-label="${t('top')}">${document.querySelector('.h2-logo svg').outerHTML}</a><button class="menu-close" type="button" aria-label="${t('close')}">${CLOSE}</button></div>
  <nav><a href="#portfolio">${t('portfolio')}</a><a href="#end">${t('contact')}</a><a href="#experience">${t('exp')}</a></nav>
  <div class="menu-lang">${EN ? `<a href="${URL_RU}" lang="ru" hreflang="ru">RU</a><span>/</span><b>EN</b>` : `<b>RU</b><span>/</span><a href="${URL_EN}" lang="en" hreflang="en">EN</a>`}</div>`;
document.body.appendChild(menu);
burger.setAttribute('aria-label', t('menu'));
const setMenu = open => { menu.classList.toggle('open', open); menu.setAttribute('aria-hidden', String(!open)); menu.inert = !open; burger.setAttribute('aria-expanded', String(open)); open ? lenis.stop() : lenis.start(); };
burger.addEventListener('click', () => setMenu(true));
menu.querySelector('.menu-close').addEventListener('click', () => setMenu(false));
// a link closes the menu first (scrolling back on), then the page-wide anchor handler scrolls to its section
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });

// ── hero: works appear under the cursor, then the description comes up on scroll
// layout: [first column 1–24, span, top offset, align] — slides repeat in order
// new hero images: natural proportions, scaled so that 1080px of the file = full screen height
const WK = 'assets/img/works/';
// works in the order of the strips, left to right (krid-portrait sits in the middle); [file, width, height, share of screen height for videos]
const ART = [
  ['aspro-molecule.webp', 1083, 838], ['aspro-new-year.webp', 960, 540], ['aspro-case.webp', 820, 737], ['basta-poster.webp', 693, 959],
  ['aspro-banners.webp', 1184, 680], ['aspro-sync-icon.webp', 453, 427], ['krid-poster.webp', 650, 650], ['poster-high-infidelity.webp', 413, 600],
  ['tini-cd.webp', 854, 914], ['regina-script.webp', 1203, 602], ['krid-portrait.webp', 1920, 1080], ['krid-badge.webp', 446, 1080],
  ['aspro-shop.webp', 600, 360], ['aspro-brandbook.webp', 1498, 570], ['aspro-search.webp', 858, 666], ['aspro-bear.webp', 760, 440],
  ['tini-lines.webp', 445, 471], ['aspro-chat.webp', 642, 440], ['tini-cupido-poster.webp', 413, 600], ['aspro-cases-collage.webp', 1170, 828],
  ['aspro-dashboard.webp', 963, 636]
].map(([f, w, h, fit]) => ({ src: WK + f, w, h, ...(fit ? { fit } : {}) }));
// where each one sits: [x, y] as a share of the free space left of / above it (0 = left/top edge, 1 = right/bottom edge)
const SPOTS = [[.04,.9],[.12,.15],[.2,.6],[.28,0],[.35,.85],[.42,.3],[.5,.7],[.56,.1],[.62,.95],[.68,.4],[.74,.75],[.8,.05],[.86,.55],[.92,.2],[.97,.8],[.3,.45],[.7,.6],[.16,.35],[.45,0],[.85,0],
  [.08,.4],[.24,.95],[.38,.15],[.52,.5],[.6,.35],[.66,1],[.78,.3],[.9,.95],[.95,.45],[.02,.1],[.48,.9],[.72,.15],[.33,.7]];
// keep the hero pinned behind the whole case stack, the next sections slide over it
// (phones skip both: the cards simply slide over the sticky hero, nothing is redrawn while the finger scrolls)
if (!reduce && HOVER) {
  ScrollTrigger.create({ trigger: '.hero', start: 'top top', endTrigger: '#portfolio', end: 'bottom top', pin: true, pinSpacing: false });
  // the hero shrinks a little as the first card comes in; the description leaves before the cards start fading over it
  gsap.timeline({ scrollTrigger: { trigger: '.sheet', start: 'top bottom', end: 'top top', scrub: true } })
    .to('.hero-in', { scale: .9, ease: 'none', duration: 1 }, 0)
    .to('.title', { opacity: 0, ease: 'none', duration: .25 }, .75);
}
// dark header over the green hero and the light case cards, light header over the dark sections after them
ScrollTrigger.create({ trigger: '#portfolio', start: 'bottom top+=64', end: 'max', onToggle: s => document.body.classList.toggle('on-green', !s.isActive) });
const flash = document.getElementById('flash'), zones = document.getElementById('zones');
// strips run left to right; most images sit near their strip, every third one is thrown elsewhere
const order = SPOTS.slice().sort((p, q) => p[0] - q[0]);
for (let i = 2; i < order.length; i += 3) { const j = (i + Math.floor(order.length / 2)) % order.length; [order[i], order[j]] = [order[j], order[i]]; }
// first work sits at the far left, last one at the far right
order[0] = [0, order[0][1]]; order[ART.length - 1] = [1, order[ART.length - 1][1]];
// phones and tablets get no works at all: the hero is just the name and the description there
const imgs = (HOVER ? ART : []).map((art, i) => {
  const video = art.src.endsWith('.mp4'), im = document.createElement(video ? 'video' : 'img');
  if (video) Object.assign(im, { muted: true, loop: true, playsInline: true, preload: 'auto' }); else im.alt = '';
  im.src = art.src; im._art = art; im._spot = order[i];
  window.ldTrack?.(im);   // the loader counts each work
  if (!video) im.decode?.().catch(() => {});   // decode up front so the first hover doesn't blink
  flash.appendChild(im); return im;
});
// hand tweaks per file: x / y = position (0 left/top … 1 right/bottom), size = extra scale, edge = pinned to the very top
const TUNE = { 'aspro-search': { y: .55, size: .8 }, 'aspro-chat': { y: .7 }, 'aspro-shop': { y: .5 }, 'chebatkov-video': { y: 1 }, 'tini-vinyl': { size: .7 }, 'poster-high-infidelity': { edge: true }, 'krid-portrait': { x: .5 } };
const place = () => {
  const W = innerWidth, H = innerHeight, k = H / 1080;
  imgs.forEach(im => { const { w, h, fit } = im._art, t = TUNE[im._art.src.split('/').pop().split('.')[0]] || {}; let iw = w * k * (t.size || 1), ih = h * k * (t.size || 1), x, y;
    if (fit) { ih = H * fit; iw = w * ih / h; }
    if (h >= 1080 && !fit) { ih = H; iw = w * ih / h; y = 0; const side = iw < W - 96 ? Math.min(48, W * .04) : 0; x = side + (W - iw - 2 * side) * (t.x ?? im._spot[0]); }   // full screen height
    else { const f = Math.min(1, W * .9 / iw); iw *= f; ih *= f; // the vertical range starts 14% down, so nothing sticks to the top edge (full-height ones excepted)
      const top = Math.min(H * .14, H - ih); const side = Math.min(48, W * .04); x = side + (W - iw - 2 * side) * (t.x ?? im._spot[0]); y = t.edge ? 0 : top + (H - ih - top) * (t.y ?? im._spot[1]); }   // 48px clear of the side edges
    Object.assign(im.style, { width: iw + 'px', height: ih + 'px', left: x + 'px', top: y + 'px' }); });
};
place(); addEventListener('resize', place);

// same timings as the source: in .15s with a scaleX 1.2→1 snap, out .15s once it is no longer hovered
const ez = 'cubic-bezier(.33,1,.68,1)', state = imgs.map(() => ({ on: false, shown: false }));
let z = 1, cur = -1;
// videos play only while shown, as in the source
const out = i => gsap.to(imgs[i], { opacity: 0, duration: .15, ease: ez, overwrite: 'auto', onComplete: () => imgs[i].pause?.() });
const show = i => {
  if (cur === i) return;
  if (cur > -1) { state[cur].on = false; if (state[cur].shown) out(cur); }
  cur = i; const st = state[i]; st.on = true; st.shown = false;
  imgs[i].style.zIndex = ++z;
  gsap.fromTo(imgs[i], { scaleX: 1.2 }, { scaleX: 1, duration: .15, ease: ez });
  imgs[i].play?.().catch(() => {});
  gsap.to(imgs[i], { opacity: 1, duration: .15, ease: ez, overwrite: 'auto', onComplete: () => { st.shown = true; if (!st.on) out(i); } });
};
const hideAll = () => { if (cur > -1) { state[cur].on = false; if (state[cur].shown) out(cur); } cur = -1; };

// first scroll: works and the name fade out; then the description comes up line by line out of masks (GSAP «AutoSplit with ScrollTrigger»)
const desc = document.getElementById('desc'), heroName = document.querySelector('.title h1');
// SplitText breaks at every <br>, even hidden ones, so the phone-only breaks are dropped from the text on wider screens
const descSrc = desc.innerHTML, descHTML = () => matchMedia('(max-width: 820px)').matches ? descSrc : descSrc.replace(/<br class="m-br">/g, '');
gsap.registerPlugin(SplitText);
// aria: 'none' — SplitText would put aria-label on the split element, which is not allowed on <p>; the lines keep the real text anyway
if (reduce) { gsap.set(heroName, { display: 'none' }); gsap.set(desc, { visibility: 'visible' }); }
else if (!HOVER) {
  // phones: no scrubbing — once the page is scrolled a little, the name fades and the description lines rise in one short go (and back)
  let split, tl, st;
  const buildTouch = () => {
    st?.kill(); tl?.kill(); split?.revert(); desc.innerHTML = descHTML(); gsap.set(heroName, { clearProps: 'opacity,transform' });
    split = SplitText.create(desc, { type: 'lines', mask: 'lines', aria: 'none', linesClass: 'line' });
    gsap.set(split.lines, { yPercent: 120 }); desc.style.visibility = 'visible';
    tl = gsap.timeline({ paused: true })
      .to(heroName, { opacity: 0, yPercent: -20, duration: .4, ease: 'power2.out' }, 0)
      .to(split.lines, { yPercent: 0, duration: .7, stagger: .08, ease: 'power3.out' }, .2);
    st = ScrollTrigger.create({ start: () => innerHeight * .2, end: 'max', onEnter: () => tl.play(), onLeaveBack: () => tl.reverse() });
  };
  document.fonts.ready.then(buildTouch);
  onWidth(buildTouch);
}
else {
  gsap.timeline({ scrollTrigger: { start: 0, end: () => innerHeight * .4, scrub: true, invalidateOnRefresh: true,
      onUpdate: s => { const off = s.progress > .3; document.getElementById('zones').style.pointerEvents = off ? 'none' : ''; if (off) hideAll(); } } })
    .to('#flash', { opacity: 0, ease: 'none' }, 0)
    .to(heroName, { opacity: 0, yPercent: -20, ease: 'none' }, 0);
  // split once the font is in; re-split by hand after a resize (autoSplit re-split the lines behind the animation's back)
  let split, lineAnim;
  const buildDesc = () => {
    lineAnim?.scrollTrigger?.kill(); lineAnim?.kill(); split?.revert(); desc.innerHTML = descHTML();
    split = SplitText.create(desc, { type: 'lines', mask: 'lines', aria: 'none', linesClass: 'line' });
    gsap.set(split.lines, { yPercent: 120 });   // every line starts under its mask, including the ones still waiting for their stagger turn
    lineAnim = gsap.fromTo(split.lines, { yPercent: 120 }, { yPercent: 0, stagger: .1, ease: 'none',
      scrollTrigger: { start: () => innerHeight * .3, end: () => innerHeight * .9, scrub: true, invalidateOnRefresh: true,
        // the text stays hidden until its lines actually start rising, so nothing flashes on load
        onUpdate: st => { desc.style.visibility = st.progress > 0 ? 'visible' : 'hidden'; },
        onRefresh: st => { desc.style.visibility = st.progress > 0 ? 'visible' : 'hidden'; } } });
  };
  document.fonts.ready.then(buildDesc);
  onWidth(buildDesc);
}
if (HOVER) {
  zones.innerHTML = imgs.map(() => '<div></div>').join('');
  [...zones.children].forEach((zn, i) => zn.addEventListener('mouseenter', () => show(i)));
  zones.addEventListener('mouseleave', hideAll);
  // tilt as in the source: rotateY from horizontal cursor speed, rotateX from vertical speed, each clamped to ±10deg,
  // speeds lerped by .075 per frame, perspective 1200px from the centre of the screen
  const m = { x: .5, px: .5, y: .5, py: .5, sx: 0, sy: 0 }, cl = v => Math.max(-10, Math.min(10, v));
  addEventListener('mousemove', e => { m.px = m.x; m.x = e.clientX / innerWidth; m.py = m.y; m.y = e.clientY / innerHeight; });
  gsap.ticker.add(() => { m.sx += ((m.x - m.px) - m.sx) * .075; m.sy += ((m.y - m.py) - m.sy) * .075;
    const v = imgs[cur]; if (v) gsap.set(imgs, { rotationY: cl(-200 * m.sx), rotationX: cl(-200 * m.sy) }); });
}

// ── footer: a green circle grows out of «Связаться» into the contacts; the header hides on the way down
const foot = document.querySelector('footer.reveal-foot'), cta = document.getElementById('cta'), parts = [...foot.children].flatMap(c => c.id === 'foot' ? [...c.children] : [c]);
// circle grows from the centre of Связаться; offsets ignore the hide transform, so the origin is right even while the header is tucked away
const origin = () => { let x = cta.offsetWidth / 2, y = cta.offsetHeight / 2; for (let e = cta; e; e = e.offsetParent) { x += e.offsetLeft; y += e.offsetTop; } foot.style.setProperty('--cx', x + 'px'); foot.style.setProperty('--cy', y + 'px'); return { x, y }; };
const maxR = () => { const o = origin(); return Math.hypot(Math.max(o.x, innerWidth - o.x), Math.max(o.y, innerHeight - o.y)) + 20; };
const ease = gsap.parseEase('power2.inOut');
const render = p => {
  const e = ease(p); foot.style.clipPath = `circle(${(e * maxR()).toFixed(1)}px at var(--cx) var(--cy))`;
  parts.forEach((el, i) => { const q = Math.min(1, Math.max(0, (p - .6 - i * .06) / .3)); el.style.opacity = q; el.style.transform = `translateY(${(1 - q) * 24}px)`; });
  document.body.classList.toggle('revealed', p > .85);
  document.body.classList.toggle('foot-open', p > .2);
};
ScrollTrigger.create({ trigger: '.reveal-space', start: 'top bottom', endTrigger: '#end', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true, onUpdate: s => render(s.progress), onRefresh: s => render(s.progress) });
addEventListener('resize', origin); origin();
let revealing = false;
const bars = [...document.querySelectorAll('.hd')];
// the header starts hiding only after the description screen, when the first case comes up
lenis.on('scroll', ({ direction, scroll }) => { if (!direction) return; const h = !revealing && direction === 1 && scroll > innerHeight * 1.8; bars.forEach(b => b.classList.toggle('hide', h)); });
ScrollTrigger.create({ trigger: '.reveal-space', start: 'top bottom', end: 'max', onToggle: s => { revealing = s.isActive; if (s.isActive) bars.forEach(b => b.classList.remove('hide')); } });

// ── cases: sticky stack that darkens, light text entrances
// each card sticks by its bottom edge (CSS sticky, so it always keeps its real size) while the next one rides over it;
// as the next card comes up the one underneath darkens and drifts up a little
const setupCases = () => {
  ScrollTrigger.getAll().filter(t => t.vars.id === 'case' || (t.trigger && t.trigger.classList && t.trigger.classList.contains('case'))).forEach(t => { t.animation?.kill(); t.kill(true); });
  const panels = [...document.querySelectorAll('.case.bento')];
  panels.forEach(p => { if (!p.querySelector('.case-shade')) p.insertAdjacentHTML('beforeend', '<div class="case-shade"></div>');
    gsap.set([p.querySelector('.case-inner'), p.querySelector('.case-shade')], { clearProps: 'all' });
    p.style.top = Math.min(0, innerHeight - p.offsetHeight) + 'px'; });
  if (reduce) return ScrollTrigger.refresh();
  panels.slice(0, -1).forEach((panel, i) => {
    gsap.timeline({ scrollTrigger: { id: 'case', trigger: panels[i + 1], start: 'top bottom', end: 'top top', scrub: true, invalidateOnRefresh: true } })
      .to(panel.querySelector('.case-shade'), { opacity: .75, ease: 'none' }, 0).to(panel.querySelector('.case-inner'), { yPercent: -6, ease: 'none' }, 0);
  });
  ScrollTrigger.refresh();
};
// light text entrance on each case: title lines rise out of masks one after another, the description follows softly
let caseSplits = [];
const caseText = () => {
  caseSplits.forEach(({ split, tw }) => { tw.forEach(t => t.revert()); split.revert(); });   // revert (not kill) so nothing is left half-hidden before re-creating
  caseSplits = [];
  if (reduce) return;
  document.querySelectorAll('.case.bento .case-head').forEach(head => {
    const h2 = head.querySelector('h2'), p = head.querySelector('p');
    const split = SplitText.create(h2, { type: 'lines', mask: 'lines', aria: 'none' });
    const st = { trigger: head, start: 'top 85%', toggleActions: 'play none none reverse' };
    const tw = [gsap.from(split.lines, { yPercent: 105, duration: .8, ease: 'power3.out', stagger: .08, scrollTrigger: st }),
      gsap.from(p, { y: 24, opacity: 0, duration: .8, ease: 'power3.out', delay: .15, scrollTrigger: { ...st } })];
    caseSplits.push({ split, tw });
  });
};
// the same light entrance for the rest of the page: section headings by lines, skills rows and experience columns one after another
const restText = () => {
  if (reduce) return;
  document.querySelectorAll('#sheet .sec > .h2').forEach(h => {
    const split = SplitText.create(h, { type: 'lines', mask: 'lines', aria: 'none' });
    caseSplits.push({ split, tw: [gsap.from(split.lines, { yPercent: 105, duration: .8, ease: 'power3.out', stagger: .08, scrollTrigger: { trigger: h, start: 'top 85%', toggleActions: 'play none none reverse' } })] });
  });
  const rows = (items, trigger) => caseSplits.push({ split: { revert() {} }, tw: [gsap.from(items, { y: 24, opacity: 0, duration: .7, ease: 'power3.out', stagger: .06,
    scrollTrigger: { trigger, start: 'top 85%', toggleActions: 'play none none reverse' } })] });
  rows(document.querySelectorAll('.formats.skills li'), '.formats.skills');
  rows(document.querySelectorAll('#experience .exp'), '#experience .exps');
};
// these entrance animations are all below the fold, so they are set up when the browser is idle, not during the first load
const idle = window.requestIdleCallback || (fn => setTimeout(fn, 200));
document.fonts.ready.then(() => idle(() => { caseText(); restText(); }));
onWidth(() => { caseText(); restText(); }, 250);

// measure once the bento images are in; rebuild after a resize
// the bento images load lazily; their width/height attributes already hold the right proportions, so the cards can be measured right away
setupCases();
let caseT; const resetCases = () => { clearTimeout(caseT); caseT = setTimeout(setupCases, 200); };
onWidth(resetCases, 0);
// a narrower window swaps the bento for its mobile file, which has a different height; the pin keeps the card at its old height,
// so watch the content itself and re-measure whenever it changes
const caseH = new WeakMap();
const caseRO = new ResizeObserver(entries => { if (entries.some(e => { const h = Math.round(e.contentRect.height); const was = caseH.get(e.target); caseH.set(e.target, h); return was !== undefined && was !== h; })) resetCases(); });
document.querySelectorAll('.case-inner').forEach(el => caseRO.observe(el));

// ── rolling hover on header and footer links
// wrap link labels for the rolling hover (header and footer links)
document.querySelectorAll('.hd a:not([aria-label]), .foot-nav a').forEach(a => {
  const html = a.innerHTML.trim(); a.innerHTML = `<span class="roll"><span>${html}</span><span aria-hidden="true">${html}</span></span>`; });
