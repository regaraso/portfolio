// Регина Тарасова · reginatarasova.com — case pages (La Triple T): header, phone menu, footer, language
// language: /en/... is the same page (vercel.json rewrite) with the texts swapped; ?lang=en does the same locally
const EN = location.pathname.startsWith('/en') || new URLSearchParams(location.search).get('lang') === 'en';
const LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
const HOME = EN ? (LOCAL ? '/?lang=en' : '/en/') : '/';
const here = location.pathname.replace(/^\/en/, '');
const URL_RU = LOCAL ? here : here, URL_EN = LOCAL ? here + '?lang=en' : '/en' + here;
const T = {
  portfolio: ['Портфолио', 'Portfolio'], exp: ['Опыт работы', 'Experience'], contact: ['Связаться', 'Contact'], top: ['Наверх', 'Top'],
  home: ['На главную', 'Home'], menu: ['Меню', 'Menu'], close: ['Закрыть', 'Close'], nav: ['Навигация', 'Navigation'],
  joke: ['Если вы долистали до этого футера и решили закрыть страницу, то у вас не будет работать дизайнер, который работал с Егором Кридом. Думайте.', 'If you scrolled all the way down to this footer and decided to close the page, you won\'t have a designer who worked with Egor Kreed. Think about it.']
};
const t = k => T[k][EN ? 1 : 0];
const ARROW = '<svg class="arr" viewBox="0 0 14 14" aria-hidden="true"><path fill="currentColor" d="M13 0C13.5523 2.41412e-08 14 0.448692 14 1.00098V13.001C13.9997 13.553 13.5521 14.001 13 14.001C12.4477 14.001 12 13.5523 12 13V3.41406L1.70703 13.708C1.31652 14.0981 0.683369 14.0973 0.292969 13.707C-0.0973982 13.3166 -0.0973106 12.6835 0.292969 12.293L10.5859 2H1C0.447716 2 -2.41411e-08 1.55228 0 1C0.000255835 0.447933 0.447873 -5.17162e-10 1 0H13Z"/></svg>';
const CLOSE = '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.5"/></svg>';
const LOGO = document.querySelector('.h2-logo svg').outerHTML;
const langSwitch = EN ? `<a href="${URL_RU}" lang="ru" hreflang="ru">RU</a><span>/</span><b>EN</b>` : `<b>RU</b><span>/</span><a href="${URL_EN}" lang="en" hreflang="en">EN</a>`;

// header: links lead back to the main page sections
if (EN) document.documentElement.lang = 'en';
document.querySelector('.h2-logo').href = HOME;
document.querySelector('.h2-logo').setAttribute('aria-label', t('home'));
document.querySelector('.h2-nav').setAttribute('aria-label', t('nav'));
{ const [p, e] = document.querySelectorAll('.h2-nav .m-hide'); p.textContent = t('portfolio'); p.href = HOME + '#portfolio'; e.textContent = t('exp'); e.href = HOME + '#experience'; }
{ const l = document.querySelector('.h2-nav .lang'); l.textContent = EN ? 'RU' : 'EN'; l.lang = l.hreflang = EN ? 'ru' : 'en'; l.href = EN ? URL_RU : URL_EN; }
document.getElementById('cta').textContent = t('contact');

// footer: the same contacts, joke and links as on the main page, here at the end of the page
document.getElementById('foot').innerHTML = `
  <div class="contacts"><a href="https://t.me/redgini" target="_blank" rel="noopener">Telegram <span>@redgini${ARROW}</span></a><a href="mailto:reedgini@gmail.com">Email <span>reedgini@gmail.com${ARROW}</span></a><a href="https://linkedin.com/in/reginatarasova" target="_blank" rel="noopener">LinkedIn <span>reginatarasova${ARROW}</span></a></div>
  <p class="joke">${t('joke')}</p>
  <div class="foot-nav"><div><a href="${HOME}#portfolio">${t('portfolio')}</a><a href="${HOME}#experience">${t('exp')}</a><a href="#top">${t('top')}${ARROW}</a></div><span>© 2026</span>
    <span class="lang-m">${langSwitch}</span></div>`;

// smooth scroll + anchors on this page
const lenis = new Lenis({ lerp: .1 });
const raf = time => { lenis.raf(time); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
document.addEventListener('click', e => { const a = e.target.closest('a[href^="#"]'); if (!a) return; const id = a.getAttribute('href'); if (id === '#') return; const el = id === '#top' ? 0 : document.querySelector(id); if (el === null) return; e.preventDefault(); lenis.scrollTo(el, { duration: 1.4 }); });

// phone menu: a green screen with the logo, a close button, the three links and the language
const menu = document.createElement('div'), burger = document.getElementById('burger');
menu.className = 'menu'; menu.setAttribute('aria-hidden', 'true'); menu.inert = true;
menu.innerHTML = `<div class="menu-top"><a href="${HOME}" aria-label="${t('home')}">${LOGO}</a><button class="menu-close" type="button" aria-label="${t('close')}">${CLOSE}</button></div>
  <nav><a href="${HOME}#portfolio">${t('portfolio')}</a><a href="#end">${t('contact')}</a><a href="${HOME}#experience">${t('exp')}</a></nav>
  <div class="menu-lang">${langSwitch}</div>`;
document.body.appendChild(menu);
burger.setAttribute('aria-label', t('menu'));
const setMenu = open => { menu.classList.toggle('open', open); menu.setAttribute('aria-hidden', String(!open)); menu.inert = !open; burger.setAttribute('aria-expanded', String(open)); open ? lenis.stop() : lenis.start(); };
burger.addEventListener('click', () => setMenu(true));
menu.querySelector('.menu-close').addEventListener('click', () => setMenu(false));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) setMenu(false); });

// header: hides on the way down, comes back on the way up; turns dark over the green footer
const bars = document.querySelectorAll('.hd'), foot = document.querySelector('footer');
lenis.on('scroll', ({ direction, scroll }) => {
  const onFoot = foot.getBoundingClientRect().top < 64;
  document.body.classList.toggle('on-green', onFoot);
  if (!direction) return;
  const h = !onFoot && direction === 1 && scroll > innerHeight * .5; bars.forEach(b => b.classList.toggle('hide', h));
});

// rolling hover on header and footer links
document.querySelectorAll('.hd a:not([aria-label]), .foot-nav a').forEach(a => {
  const html = a.innerHTML.trim(); a.innerHTML = `<span class="roll"><span>${html}</span><span aria-hidden="true">${html}</span></span>`; });
