const EN = location.pathname.startsWith('/en') || new URLSearchParams(location.search).get('lang') === 'en';
const HOME_PAGE = document.body.dataset.page === 'home';
const HOME = EN ? '/?lang=en' : '/';
const ROOT = document.body.dataset.root ?? (HOME_PAGE ? '' : '../');
const A = ROOT + 'assets/img/', ICON = ROOT + 'assets/icon/desktop/';
const go = id => (HOME_PAGE ? '' : HOME) + id;
const $ = id => document.getElementById(id);
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

let VW = innerWidth, VH = innerHeight;
const widthFns = [], onWidth = fn => widthFns.push(fn);
addEventListener('resize', () => { if (innerWidth === VW) return; VW = innerWidth; VH = innerHeight; widthFns.forEach(f => f()); });
const frameFns = [], onFrame = fn => { frameFns.push(fn); fn(); };
let queued = false;
const runFrame = () => { queued = false; frameFns.forEach(f => f()); };
addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(runFrame); } }, { passive: true });
onWidth(runFrame);

const T = {
  portfolio: ['Портфолио', 'Portfolio'], exp: ['Опыт работы', 'Experience'], works: ['С чем работаю', 'What I work with'],
  contact: ['Связаться', 'Contact'], top: ['Наверх', 'Back to top'], home: ['На главную', 'Home'], about: ['Обо мне', 'About me'],
  menu: ['Меню', 'Menu'], close: ['Закрыть', 'Close'], nav: ['Навигация', 'Navigation'],
  first: ['Регина', 'Regina'], last: ['Тарасова', 'Tarasova'],
  meta: ['Графический дизайнер с опытом 7+ лет. Специализируюсь на digital и концертной индустрии.', 'Graphic designer with 7+ years of experience. Specialising in the digital and concert industry.']
};
const t = k => T[k][EN ? 1 : 0];

// case pictures, in order: [folder/prefix, [[width, height] of each desktop file]]; files are prefix-01.webp … and prefix-01@2x.webp …
const CASE_IMG = [['cases/aspro', [[1210, 1123], [1208, 584], [1208, 760], [1208, 342], [1208, 677], [1208, 725]]], ['cases/nebo', [[1208, 789], [1208, 787], [1208, 1071]]], ['cases/tini', [[1208, 911], [1208, 603], [1206, 761], [1208, 1090]]]];
const C = EN ? {
  desc: ['Graphic designer with\u00a07+\u00a0years\u00a0of\u00a0experience.', 'Digital and concert industry\u00a0(and\u00a0beyond)'],
  about: ['I first opened Photoshop when I was 11. We\'ve been inseparable ever since.', 'I [[toured Russia|05]] with a rock band. With them I also worked a concert for [[30,000 people|02]] at Gazprom Arena.', 'Solo trips around Europe on a visa I got myself don\'t impress many people these days, so here\'s my ace: I flew to [[Argentina|01]].', 'For three years I led the [[office|04]] Halloween costume contest. Once I also brought the whole office to a halt for 15 minutes with a hunt for [[rubber ducks|03]]. One still hasn\'t been found to this day.', 'Nobody reads this text, so I can share that I once sliced cucumbers for Basta.', 'At 13, my design made it into a book published in ~10 languages (and Russian isn\'t even one of them).'],
  cases: [
    ['Identity and Development of the Aspro.Cloud System', 'Developed and systematised the brand\'s visual identity: worked on graphic solutions, communication style and key visual assets. Together with the team, built a unified design language that made the brand more consistent and recognisable in the digital space.', 'Aspro.Cloud identity'],
    ['Egor Kreed, Zveri, Basta and Others — Concert Tour Ad Campaigns', ['Developed the visual system for Nebo Records\' concert tour advertising campaigns: created a series of posters and adapted them for different cities, venues and formats. Built a unified visual language that maintained campaign cohesion across more than a hundred concerts per year.', 'Beyond print and online advertising, also created TV commercials and animations for digital screens.'], 'Nebo Records concert tours'],
    ['TINI — Visual Project for the Album Recuerdo', 'Developed a comprehensive visual project for TINI\'s album «Recuerdo»: cover design, physical formats, booklet and pre-save page. Built a unified visual language that worked across different media — from vinyl record to digital formats.', 'TINI — Recuerdo']],
  jobs: [
    ['2023 — 2026', 'aspro', 'Aspro', 'Ready-made websites, online stores and cloud CRM platform for domestic and international markets', 'Graphic Designer', 'Created digital creatives for B2B clients across various industries: landing pages, banners, blog covers. Built 30 complex landing pages for the SEO team in one month. Introduced AI tools into team workflows: cut cover creation time from 5 hours to 1.5 according to time tracker data. Passed probation in 2 months instead of the standard 3.'],
    ['2024 — 2026', 'nebo', 'Nebo Records', 'Concert agency, nationwide tours of popular artists', 'Senior Designer', 'Created concert posters and digital advertising materials (Egor Kreed, Zveri, Basta, Artik &amp; Asti, Xolidayboy, Alisa, Evgeny Chebatkov). Print-ready outdoor advertising: 6×3 billboards, city formats, pillars. TV commercials and animations for digital screens. Managed 100+ events per year, developed a personal system for rapid layout updates.'],
    ['2022 — 2023', 'kassy', 'Kassy.ru', 'Online ticketing service for events and concert organiser', 'Graphic Designer', 'Created posters and advertising materials for concerts, theatre, stand-up and children\'s shows. Prepared print-ready outdoor advertising layouts, edited TV commercials and animations for digital screens. Took over video editing responsibilities, eliminating the need for a freelancer. Accompanied artists on tours across Russia as a backstage manager.'],
    ['2018 — 2021', 'photo', 'Print Shop', 'Photo printing, retouching and souvenir products', 'Graphic Designer / Print Operator', 'Processed orders for printing, photo retouching and restoration, created collages and souvenir product layouts. Trained new employees in Photoshop.']],
  skills: ['Brand design and identity', 'Adaptations across media', 'Communication design', 'Key visual', 'Digital creatives and banners', 'Presentations', 'Motion and video', 'Outdoor advertising', 'Merch', 'Retouching', 'AI', 'Landing pages'],
  joke: 'If you scrolled all the way down to this footer and decided to close the page, you won\'t have a designer who worked with Egor Kreed. Think about it.'
} : {
  desc: ['Графический дизайнер с опытом\u00a07+\u00a0лет.', 'Digital и концертная индустрия\u00a0(и не только)'],
  about: ['Фотошоп я в первый раз в жизни открыла, когда мне было 11 лет. До сих пор не расстаюсь с ним.', 'Ездила с рок-группой [[в туре|05]] по России. С ними же отработала концерт для [[30 000 зрителей|02]] на «Газпром Арене».', 'Соло-трипами по Европе с самостоятельно полученной визой сейчас мало кого удивишь, поэтому достану туз: я летала в [[Аргентину|01]].', 'Три года лидировала в конкурсе хеллоуинских костюмов [[в офисе|04]]. Еще как-то раз остановила работу всего офиса на 15 минут поиском [[резиновых уток|03]]. Одну так и не нашли.', 'Этот текст никто не читает, поэтому могу поделиться, что как-то раз я нарезала огурцы для Басты.', 'В 13 лет попала со своим дизайном в книгу, изданную на ~10 языках (и русского среди них даже нет).'],
  cases: [
    ['Айдентика и развитие системы Аспро.Cloud', 'Развивала и систематизировала визуальную айдентику бренда: работала с графическими решениями, стилем коммуникаций и основными визуальными носителями. Совместно с командой выстраивала единый принцип оформления, который помог сделать бренд более последовательным и узнаваемым в цифровой среде.', 'Айдентика Аспро.Cloud'],
    ['Егор Крид, Звери, Баста и другие — рекламные кампании гастрольных туров', ['Разрабатывала визуальную систему рекламной кампании гастрольных туров Небо Рекордс: создавала серию афиш и адаптировала их под разные города, площадки и форматы. Выстраивала единый визуальный язык, который позволил сохранять целостность кампании при выпуске более ста концертов в год.', 'Кроме печати и интернет-рекламы делала ТВ-ролики и анимацию для диджитал-экранов.'], 'Концертные туры Небо Рекордс'],
    ['TINI — визуальный проект альбома Recuerdo', 'Разрабатывала комплексный визуальный проект для альбома TINI «Recuerdo»: дизайн обложки, физических форматов, буклета и пре-сейв страницы. Выстраивала единый визуальный язык, который работал на разных носителях — от виниловой пластинки до digital-форматов.', 'TINI — Recuerdo']],
  jobs: [
    ['2023 — 2026', 'aspro', 'Аспро', 'Готовые сайты, интернет-магазины и облачная CRM-платформа для российского и зарубежного рынка', 'Графический дизайнер', 'Делала digital-креативы для B2B-клиентов из разных отраслей: лендинги, баннеры, обложки для блога. Собрала 30 сложных лендингов для отдела SEO за месяц. Внедрила AI-инструменты в рабочие процессы команды: сократила время создания обложки с 5 часов до 1,5 по данным тайм-трекера. Прошла испытательный срок за 2 месяца вместо стандартных 3.'],
    ['2024 — 2026', 'nebo', 'Небо Рекордс', 'Концертное агентство, гастрольные туры популярных артистов', 'Старший дизайнер', 'Делала афиши концертов и материалы для интернет-рекламы (Егор Крид, Звери, Баста, Artik &amp; Asti, Xolidayboy, Алиса, Евгений Чебатков). Наружная реклама к печати: биллборды 6×3, ситиформаты, пиллары. ТВ-ролики и анимация для диджитал-экранов. Вела 100+ мероприятий в год, разработала собственную систему оперативного обновления макетов.'],
    ['2022 — 2023', 'kassy', 'Kassy.ru', 'Онлайн-сервис по продаже билетов на мероприятия и концертный организатор', 'Графический дизайнер', 'Создавала афиши и рекламные материалы для концертов, театра, стендапа и детских шоу. Готовила макеты наружной рекламы к печати, монтировала ТВ-ролики и анимацию для диджитал-экранов. Закрыла потребность компании во фрилансере по видеомонтажу, взяла его обязанности на себя. Сопровождала артистов в турах по России в роли бэкстейдж-менеджера.'],
    ['2018 — 2021', 'photo', 'Типография', 'Фотопечать, ретушь и сувенирная продукция', 'Графический дизайнер / Оператор печати', 'Обрабатывала заказы на печать, ретушь и восстановление фотографий, создавала коллажи и макеты сувенирной продукции. Обучала новых сотрудников работе в Photoshop.']],
  skills: ['Бренд-дизайн и айдентика', 'Адаптации на носители', 'Коммуникационный дизайн', 'Key visual', 'Digital-креативы и баннеры', 'Презентации', 'Моушен и видео', 'Наружная реклама', 'Мерч', 'Ретушь', 'AI', 'Лендинги'],
  joke: 'Если вы долистали до этого футера и решили закрыть страницу, то у вас не будет работать дизайнер, который работал с Егором Кридом. Думайте.'
};
C.cases = C.cases.map(([t, d, alt], i) => ({ t, d, alt, imgs: CASE_IMG[i][1].map(([w, h], k) => ({ src: A + CASE_IMG[i][0] + '-' + String(k + 1).padStart(2, '0'), w, h })) }));
C.jobs = C.jobs.map(([y, ic, n, a, r, t]) => ({ y, ic, n, a, r, t }));
C.contacts = [{ k: 'Telegram', v: '@redgini', href: 'https://t.me/redgini' }, { k: 'Email', v: 'reedgini@gmail.com', href: 'mailto:reedgini@gmail.com' }, { k: 'LinkedIn', v: 'reginatarasova', href: 'https://linkedin.com/in/reginatarasova' }];

const ARROW = '<svg class="arr" viewBox="0 0 14 14" aria-hidden="true"><path fill="currentColor" d="M13 0C13.5523 2.41412e-08 14 0.448692 14 1.00098V13.001C13.9997 13.553 13.5521 14.001 13 14.001C12.4477 14.001 12 13.5523 12 13V3.41406L1.70703 13.708C1.31652 14.0981 0.683369 14.0973 0.292969 13.707C-0.0973982 13.3166 -0.0973106 12.6835 0.292969 12.293L10.5859 2H1C0.447716 2 -2.41411e-08 1.55228 0 1C0.000255835 0.447933 0.447873 -5.17162e-10 1 0H13Z"/></svg>';
const LOGO = '<svg viewBox="3 3 10 10" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M10 3C11.6569 3 13 4.34315 13 6C13 7.65685 11.6569 9 10 9H9.93359L11 11H13V13H9.7998L7.66602 9H5V11H7V13H3V3H10ZM5 7H10C10.5523 7 11 6.55228 11 6C11 5.44772 10.5523 5 10 5H5V7Z"/></svg>';
const BURGER = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M0 1.5h12M0 6h12M0 10.5h12" stroke="currentColor" stroke-width="1.5"/></svg>';
const CLOSE = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.5"/></svg>';
// one case picture: the same 1208 px file on every screen (scaled-down copies got fringes at the transparent edges);
// the @2x file is swapped in later on retina desktops (home.js)
const IV = '?v=3';   // bump when case pictures are replaced under the same names
const img = (c, m) => `<picture><img src="${m.src}.webp${IV}" data-hi="${m.src}@2x.webp${IV}" width="${m.w}" height="${m.h}" alt="${c.alt}" loading="lazy" decoding="async"></picture>`;
const watch = (sel = '[data-in]') => { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' }); document.querySelectorAll(sel).forEach(el => io.observe(el)); };

if (EN) { document.documentElement.lang = 'en'; document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta')); }

const LANG = EN ? `<a href="${location.pathname}" lang="ru" hreflang="ru">RU</a><i>/</i><b>EN</b>` : `<b>RU</b><i>/</i><a href="${location.pathname}?lang=en" lang="en" hreflang="en">EN</a>`;
const LOGO_LINK = (id = '') => `<a href="${HOME_PAGE ? '#top' : HOME}" aria-label="${t(HOME_PAGE ? 'top' : 'home')}"${id ? ` id="${id}"` : ''}>${LOGO}</a>`;
document.body.insertAdjacentHTML('afterbegin', `
<div class="corner tl">${LOGO_LINK('logo')}</div>
<nav class="corner tr" aria-label="${t('nav')}"><a href="${go('#portfolio')}">${t('portfolio')}</a><a href="${go('#experience')}">${t('exp')}</a><a href="${go('#about')}">${t('about')}</a><span class="lng">${LANG}</span><a class="cta" id="cta" href="#end">${t('contact')}</a><button class="burger" id="burger" type="button" aria-label="${t('menu')}" aria-expanded="false" aria-controls="menu">${BURGER}</button></nav>
<div class="menu" id="menu" aria-hidden="true" inert><div class="menu-top">${LOGO_LINK()}<button class="menu-close" id="mclose" type="button" aria-label="${t('close')}">${CLOSE}</button></div><nav aria-label="${t('menu')}"><a href="${go('#portfolio')}">${t('portfolio')}</a><a href="#end">${t('contact')}</a><a href="${go('#experience')}">${t('exp')}</a><a href="${go('#about')}">${t('about')}</a></nav><div class="menu-lang">${LANG}</div></div>`);
document.body.insertAdjacentHTML('beforeend', `
<div class="reveal-space" aria-hidden="true"></div><div id="end"></div>
<footer id="contacts">
  <div class="f-side"><h2 class="lbl">${t('contact')}</h2><p>${C.joke}</p></div>
  <ul class="f-ct">${C.contacts.map(c => `<li><a href="${c.href}" ${c.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}><small>${c.v}</small><b>${c.k}</b>${ARROW}</a></li>`).join('')}</ul>
  <div class="fn"><div><a href="${go('#portfolio')}">${t('portfolio')}</a><a href="${go('#experience')}">${t('exp')}</a><a href="#top">${t('top')}${ARROW}</a></div><span>© 2026</span></div>
</footer>`);

const menu = $('menu'), burger = $('burger');
const setMenu = open => { menu.classList.toggle('open', open); menu.setAttribute('aria-hidden', String(!open)); menu.inert = !open;
  burger.setAttribute('aria-expanded', String(open)); document.documentElement.classList.toggle('menu-open', open); if (open) $('mclose').focus(); };
burger.addEventListener('click', () => setMenu(true));
$('mclose').addEventListener('click', () => { setMenu(false); burger.focus(); });
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); burger.focus(); } });

const foot = document.querySelector('footer'), space = document.querySelector('.reveal-space'), cta = $('cta'), parts = [...foot.querySelectorAll('.f-side > *, .f-ct, .fn')];
const inOut = x => x < .5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
const order = () => [...parts].sort((m, n) => m.offsetTop - n.offsetTop || m.offsetLeft - n.offsetLeft);
let seq = order(); onWidth(() => { seq = order(); });
const reveal = () => {
  const b = (cta.offsetWidth ? cta : burger).getBoundingClientRect(), x = b.left + b.width / 2, y = b.top + b.height / 2;
  const R = Math.hypot(Math.max(x, VW - x), Math.max(y, VH - y)) + 20;
  // the first quarter screen of the space only lets the last text scroll up; the footer starts opening after it
  const lead = VH / 4, p = Math.min(1, Math.max(0, (VH - space.getBoundingClientRect().top - lead) / (space.offsetHeight - lead)));
  foot.style.visibility = p > 0 ? '' : 'hidden';
  foot.inert = p <= .85;
  const F = 360, r = inOut(p) * (R + F) - F, m = `radial-gradient(circle at ${x}px ${y}px, #000 ${r.toFixed(1)}px, transparent ${(r + F).toFixed(1)}px)`;
  foot.style.webkitMaskImage = foot.style.maskImage = m;
  seq.forEach((el, i) => { const q = Math.min(1, Math.max(0, (p - .5 - i * .06) / .3)); el.style.opacity = q;
    el.style.transform = REDUCE ? '' : `translateY(${Math.round((1 - q) * 24)}px)`; el.style.filter = q < 1 && !REDUCE ? `blur(${((1 - q) * 10).toFixed(1)}px)` : ''; });
  document.body.classList.toggle('revealed', p > .85);
  document.body.classList.toggle('on-foot', p > .2);
};
onFrame(reveal); addEventListener('scrollend', reveal);
addEventListener('load', () => { seq = order(); reveal(); });

const noHang = () => {
  const SHORT = /(?<=^|[\s(«"])([а-яё]{1,2}|для|без|при|под|над|про|что|как|\d+[+%]?) /gi;
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement.closest('script, style, .win') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
  for (let n; (n = tw.nextNode());) { const s = n.nodeValue.replace(SHORT, '$1 ').replace(/ —/g, ' —'); if (s !== n.nodeValue) n.nodeValue = s; }
  reveal();
};
