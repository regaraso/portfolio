/* ===== I18N ===== */
(function applyLang() {
  const lang = new URLSearchParams(window.location.search).get('lang');
  if (lang !== 'en') return;

  document.documentElement.lang = 'en';

  const t = {
    'nav-portfolio':       'PORTFOLIO',
    'nav-portfolio-plain': 'PORTFOLIO',
    'nav-contact':         'CONTACT',
    'nav-contact-plain':   'CONTACT',
    'nav-experience':      'EXPERIENCE',
    'nav-experience-plain':'EXPERIENCE',
    'hero-intro': 'MY NAME IS',
    'hero-p1':    'I\'M A GRAPHIC <br class="br-m">DESIGNER <br class="br-d">WITH <span class="accent">7+ YEARS</span>',
    'hero-p2':    'I WORK IN DIGITAL <br class="br-m">AND CONCERT <br class="br-d">INDUSTRY <br class="br-m">(AND BEYOND)',
    'portfolio-label': 'PORTFOLIO',
    'case1-title': 'Identity and Development of the Aspro.Cloud System',
    'case1-desc':  'Developed and systematised the brand\'s visual identity: worked on graphic solutions, communication style and key visual assets. Together with the team, built a unified design language that made the brand more consistent and recognisable in the digital space.',
    'case2-title': 'Egor Kreed, Zveri, Basta<br class="br-d"> and Others — Concert Tour Ad Campaigns',
    'case2-desc':  'Developed the visual system for Nebo Records\' concert tour advertising campaigns: created a series of posters and adapted them for different cities, venues and formats. Built a unified visual language that maintained campaign cohesion across more than a hundred concerts per year.',
    'case3-title': 'TINI — Visual Project<br class="br-d"> for the Album Recuerdo',
    'case3-desc':  'Developed a comprehensive visual project for TINI\'s album «Recuerdo»: cover design, physical formats, booklet and pre-save page. Built a unified visual language that worked across different media — from vinyl record to digital formats.',
    'exp-label':   'WORK EXPERIENCE',
    'exp1-name':   'Nebo Records',
    'exp1-about':  'Concert agency, nationwide tours of popular artists',
    'exp1-role':   'Senior Designer',
    'exp1-notes':  'Created concert posters and digital advertising materials (Egor Kreed, Zveri, Basta, Artik & Asti, Xolidayboy, Alisa, Evgeny Chebatkov). Print-ready outdoor advertising: 6×3 billboards, city formats, pillars. TV commercials and animations for digital screens. Managed 100+ events per year, developed a personal system for rapid layout updates.',
    'exp2-name':   'Aspro',
    'exp2-about':  'Ready-made websites, online stores and cloud CRM platform for domestic and international markets',
    'exp2-role':   'Graphic Designer',
    'exp2-notes':  'Created digital creatives for B2B clients across various industries: landing pages, banners, blog covers. Built 30 complex landing pages for the SEO team in one month. Introduced AI tools into team workflows: cut cover creation time from 5 hours to 1.5 according to time tracker data. Passed probation in 2 months instead of the standard 3.',
    'exp3-about':  'Online ticketing service for events and concert organiser',
    'exp3-role':   'Graphic Designer',
    'exp3-notes':  'Created posters and advertising materials for concerts, theatre, stand-up and children\'s shows. Prepared print-ready outdoor advertising layouts, edited TV commercials and animations for digital screens. Took over video editing responsibilities, eliminating the need for a freelancer. Accompanied artists on tours across Russia as a backstage manager.',
    'exp4-name':   'Print Shop',
    'exp4-about':  'Photo printing, retouching and souvenir products',
    'exp4-role':   'Graphic Designer / Print Operator',
    'exp4-notes':  'Processed orders for printing, photo retouching and restoration, created collages and souvenir product layouts. Trained new employees in Photoshop. Handled 30 to 50 orders per shift, personal record — 112 clients.',
    'footer-portfolio':  'PORTFOLIO',
    'footer-experience': 'EXPERIENCE',
    'footer-contact':    'CONTACT',
    'footer-top':        'TOP',
  };

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = t[el.dataset.i18n];
    if (!val) return;
    const navOut = el.querySelector('.nav-out');
    const navIn  = el.querySelector('.nav-in');
    if (navOut && navIn) {
      navOut.innerHTML = val;
      navIn.innerHTML  = val;
    } else {
      el.innerHTML = val;
    }
  });

  document.querySelectorAll('[data-hide-en]').forEach(el => {
    el.style.display = 'none';
  });

  const langSwitch = document.getElementById('lang-switch');
  if (langSwitch) { langSwitch.textContent = 'RU'; langSwitch.href = '/'; }

  const burgerLang = document.getElementById('burger-lang-switch');
  if (burgerLang) { burgerLang.textContent = 'RU'; burgerLang.href = '/'; }
})();

/* ===== LENIS SMOOTH SCROLL ===== */
const lenis = new Lenis({ lerp: 0.08, smooth: true });
lenis.on('scroll', onLenisScroll);
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

/* ===== HEADER SCROLL STATE ===== */
const header = document.getElementById('header');
let scrolled = false;

function onLenisScroll({ scroll }) {
  const shouldBeScrolled = scroll > 40;
  if (shouldBeScrolled !== scrolled) {
    scrolled = shouldBeScrolled;
    header.classList.toggle('is-scrolled', scrolled);
  }
}

/* ===== SMOOTH ANCHOR LINKS ===== */
document.querySelectorAll('.js-scroll-link').forEach(el => {
  el.addEventListener('click', e => {
    const href = el.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) lenis.scrollTo(target, { offset: -70 });
    }
  });
});
document.querySelectorAll('.js-scroll-top').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); lenis.scrollTo(0); });
});

/* ===== CAROUSEL — sine-wave RAF ===== */
(function initCarousel() {
  const track = document.getElementById('carousel-track');
  if (!track) return;

  const SLIDES = [
    'assets/img/hero/slide_01.png',
    'assets/img/hero/slide_02.png',
    'assets/img/hero/slide_03.png',
    'assets/img/hero/slide_04.png',
    'assets/img/hero/slide_05.png',
    'assets/img/hero/slide_06.png',
    'assets/img/hero/slide_07.png',
    'assets/img/hero/slide_08.png',
    'assets/img/hero/slide_09.png',
    'assets/img/hero/slide_10.png',
  ];
  const COUNT = SLIDES.length;
  const isMobile = window.innerWidth <= 768;
  const cardW = isMobile ? 116 : 380;
  const cardH = isMobile ? 68 : 220;
  const gap = isMobile ? 8 : 24;
  const amplitude = isMobile ? 6 : 18;
  const speed    = isMobile ? 50 : 80;
  const bounceHz = 0.25;
  const setWidth  = COUNT * (cardW + gap);

  const allCards = [];

  for (let set = 0; set < 2; set++) {
    for (let i = 0; i < COUNT; i++) {
      const div = document.createElement('div');
      div.className = 'carousel__card';
      div.style.width = cardW + 'px';
      div.style.height = cardH + 'px';
      div.style.flexShrink = '0';
      const img = document.createElement('img');
      img.src = SLIDES[i];
      img.alt = '';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
      div.appendChild(img);
      track.appendChild(div);
      allCards.push(div);
    }
  }

  let scrollX = 0;
  let lastTs  = null;

  function tick(ts) {
    if (lastTs !== null) {
      const dt = Math.min(ts - lastTs, 50);
      scrollX -= speed * (dt / 1000);
      if (scrollX <= 0) scrollX += setWidth;

      track.style.transform = `translateX(${-scrollX}px)`;

      const t = ts * 0.001 * bounceHz * Math.PI * 2;
      for (let i = 0; i < allCards.length; i++) {
        const isEven = (i % COUNT) % 2 === 0;
        const y = Math.sin(t + (isEven ? 0 : Math.PI)) * amplitude + amplitude;
        allCards[i].style.transform = `translateY(${y}px)`;
      }
    }
    lastTs = ts;
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();

/* ===== CONTACTS POPUP ===== */
const popupContacts = document.getElementById('popup-contacts');

function openContacts() {
  popupContacts.classList.add('is-open');
  popupContacts.setAttribute('aria-hidden', 'false');
  lenis.stop();
}
function closeContacts() {
  popupContacts.classList.remove('is-open');
  popupContacts.setAttribute('aria-hidden', 'true');
  lenis.start();
}

document.getElementById('btn-contacts')?.addEventListener('click', openContacts);
document.getElementById('btn-contacts-mobile')?.addEventListener('click', openContacts);
document.getElementById('btn-contacts-cta')?.addEventListener('click', openContacts);
document.getElementById('btn-contacts-footer')?.addEventListener('click', openContacts);
document.getElementById('btn-contacts-close')?.addEventListener('click', closeContacts);

// Close on background click
popupContacts.addEventListener('click', e => {
  if (e.target === popupContacts) closeContacts();
});

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeContacts();
    closeBurger();
  }
});

/* ===== BURGER POPUP (mobile) ===== */
const popupBurger = document.getElementById('popup-burger');

function openBurger() {
  popupBurger.classList.add('is-open');
  popupBurger.setAttribute('aria-hidden', 'false');
  lenis.stop();
}
function closeBurger() {
  popupBurger.classList.remove('is-open');
  popupBurger.setAttribute('aria-hidden', 'true');
  lenis.start();
}

document.getElementById('btn-burger').addEventListener('click', openBurger);
document.getElementById('btn-burger-close').addEventListener('click', closeBurger);

// Burger nav links close the burger
document.querySelectorAll('.js-close-burger').forEach(el => {
  el.addEventListener('click', () => {
    closeBurger();
  });
});

// "СВЯЗАТЬСЯ" inside burger opens contacts — direct swap, no timeout
document.querySelectorAll('.js-open-contacts').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    popupBurger.classList.remove('is-open');
    popupBurger.setAttribute('aria-hidden', 'true');
    openContacts();
  });
});

// Scroll links inside burger
document.querySelectorAll('.popup--burger .js-scroll-link').forEach(el => {
  el.addEventListener('click', e => {
    const href = el.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      closeBurger();
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) lenis.scrollTo(target, { offset: -70 });
      }, 350);
    }
  });
});
