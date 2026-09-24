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
    'hero-intro': 'My name is',
    'hero-p1':    'I\'m a graphic <br class="br-m">designer <br class="br-d">with <span class="accent">7+ years</span> of experience',
    'hero-p2':    'I work in digital <br class="br-m">and concert <br class="br-d">industry <br class="br-m">(and beyond)',
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
  if (langSwitch) { langSwitch.textContent = 'RU'; langSwitch.href = window.location.pathname; }

  const burgerLang = document.getElementById('burger-lang-switch');
  if (burgerLang) { burgerLang.textContent = 'RU'; burgerLang.href = window.location.pathname; }
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
    'assets/img/hero/KRE4F0J4c5TJ.webp',
    'assets/img/hero/Dqc47Kh8s3xa.webp',
    'assets/img/hero/HYVSgxoOJKeF.webp',
    'assets/img/hero/x4ant9qAqCql.webp',
    'assets/img/hero/KHoPf2pVmhJW.webp',
    'assets/img/hero/9n15Be4MYfgR.webp',
    'assets/img/hero/AzHy11hHpsi4.webp',
    'assets/img/hero/WH8vCn0t7GOA.webp',
    'assets/img/hero/4CQvTz2qJwW2.webp',
    'assets/img/hero/l5eEpxy3LiMr.webp',
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


/* ===== HERO LENS DISTORTION ===== */
(function initHeroLens() {
  const heroImg = document.querySelector('.hero__bg--desktop');
  if (!heroImg || heroImg.tagName !== 'IMG') return;

  const canvas = document.createElement('canvas');
  canvas.className = heroImg.className;
  canvas.setAttribute('aria-hidden', 'true');

  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false });
  if (!gl) return;

  heroImg.parentNode.replaceChild(canvas, heroImg);

  const W = 3000, H = 1500;
  const dpr = 1;
  canvas.width  = W;
  canvas.height = H;
  canvas.style.maxWidth = 'none';

  const vs = `#version 300 es
    in vec2 a_pos; in vec2 a_uv; out vec2 v_uv;
    void main() { gl_Position = vec4(a_pos,0,1); v_uv = a_uv; }
  `;
  const fs = `#version 300 es
    precision highp float;
    in vec2 v_uv; out vec4 out_color;
    uniform sampler2D u_tex;
    uniform vec2 u_center, u_dims;
    uniform float u_amount, u_aberration;
    vec2 lensDistort(vec2 localPos, float amt) {
      vec2 center = u_center * u_dims;
      float radius = length(u_dims) * 0.5;
      vec2 cp = localPos - center;
      vec2 n = cp / radius;
      float d2 = dot(n,n);
      return cp * (1.0 + amt*(d2 + d2*d2)) + center;
    }
    vec4 sampleAt(vec2 localPos, float amt) {
      vec2 uv = lensDistort(localPos, amt) / u_dims;
      bool ok = uv.x>=0.0&&uv.x<=1.0&&uv.y>=0.0&&uv.y<=1.0;
      return ok ? texture(u_tex, uv) : vec4(0.0);
    }
    void main() {
      vec2 localPos = v_uv * u_dims;
      float chroma = (1.0 + abs(u_amount)) * u_aberration;
      vec4 tapColor = vec4(0.0);
      for (int i = 0; i < 8; i++) {
        float fi = float(i) * 0.142857143 - 0.5;
        float w = 1.0 - abs(fi * 2.0);
        vec4 rs = sampleAt(localPos, u_amount + (fi + 0.5) * chroma);
        vec4 gs = sampleAt(localPos, u_amount + fi * chroma);
        vec4 bs = sampleAt(localPos, u_amount + (fi - 0.5) * chroma);
        float r_s = rs.a > 0.01 ? rs.r / max(0.001, rs.a) : 1.0;
        float g_s = gs.a > 0.01 ? gs.g / max(0.001, gs.a) : 1.0;
        float b_s = bs.a > 0.01 ? bs.b / max(0.001, bs.a) : 1.0;
        float alpha = max(max(rs.a, gs.a), bs.a);
        tapColor += vec4(r_s*alpha, g_s*alpha, b_s*alpha, alpha) * w;
      }
      out_color = tapColor / 3.428571429;
    }
  `;

  function mkShader(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s); return s;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog); gl.useProgram(prog);

  const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
  const vbuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1,-1,0,1,  1,-1,1,1,  -1,1,0,0,
    -1, 1,0,0,  1,-1,1,1,   1,1,1,0,
  ]), gl.STATIC_DRAW);
  const pL = gl.getAttribLocation(prog,'a_pos'), uL = gl.getAttribLocation(prog,'a_uv');
  gl.enableVertexAttribArray(pL); gl.enableVertexAttribArray(uL);
  gl.vertexAttribPointer(pL, 2, gl.FLOAT, false, 16, 0);
  gl.vertexAttribPointer(uL, 2, gl.FLOAT, false, 16, 8);

  const uCenter = gl.getUniformLocation(prog,'u_center');
  gl.uniform2f(gl.getUniformLocation(prog,'u_dims'), W, H);
  gl.uniform1f(gl.getUniformLocation(prog,'u_amount'), 0.13);
  gl.uniform1f(gl.getUniformLocation(prog,'u_aberration'), 0.05);
  gl.uniform1i(gl.getUniformLocation(prog,'u_tex'), 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0,0,0,0]));

  let texReady = false;
  const src = new Image();
  src.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    texReady = true;
  };
  src.src = heroImg.src.replace(/\.png$/, '.webp');

  let mx = 0.5, my = 0.5, cx = 0.5, cy = 0.5;
  let px = 0, py = 0, pcx = 0, pcy = 0;
  const heroSection = document.querySelector('.hero');
  window.addEventListener('mousemove', e => {
    const heroRect = heroSection ? heroSection.getBoundingClientRect() : null;
    const inHero = heroRect && e.clientY >= heroRect.top && e.clientY <= heroRect.bottom;
    const rect = canvas.getBoundingClientRect();
    if (inHero) {
      const rx = (e.clientX - rect.left) / rect.width;
      const ry = (e.clientY - rect.top)  / rect.height;
      mx = 0.5 + (rx - 0.5) * 0.3;
      my = 0.5 + (ry - 0.5) * 0.3;
      px = (e.clientX / window.innerWidth - 0.5) * 90;
      py = (e.clientY / window.innerHeight - 0.5) * 48;
    } else {
      mx = 0.5; my = 0.5;
      px = 0;   py = 0;
    }
  }, { passive: true });

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 0);

  let heroVisible = true;
  const observer = new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(canvas);

  (function frame() {
    const ncx  = cx  + (mx - cx)  * 0.06;
    const ncy  = cy  + (my - cy)  * 0.06;
    const npcx = pcx + (px - pcx) * 0.04;
    const npcy = pcy + (py - pcy) * 0.04;
    const moved = Math.abs(ncx-cx) + Math.abs(ncy-cy) + Math.abs(npcx-pcx) + Math.abs(npcy-pcy) > 0.0001;
    cx = ncx; cy = ncy; pcx = npcx; pcy = npcy;
    if (heroVisible && texReady && moved) {
      canvas.style.transform = 'translateX(calc(-50% + ' + pcx + 'px)) translateY(' + pcy + 'px)';
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uCenter, cx, cy);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    requestAnimationFrame(frame);
  })();
})();
