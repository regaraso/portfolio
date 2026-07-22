// ---------- Lazy video: load src only when entering viewport ----------
(function () {
  const videos = document.querySelectorAll('video[data-lazy-src]');
  if (!videos.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        const v = e.target;
        v.src = v.dataset.lazySrc;
        v.load();
        v.play().catch(() => {});
        io.unobserve(v);
      }
    }
  }, { rootMargin: '200px' });
  videos.forEach(v => io.observe(v));
})();

// ---------- Header behavior ----------
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let scrolled = false;
  const onScroll = () => {
    const should = window.scrollY > 24;
    if (should !== scrolled) {
      scrolled = should;
      header.classList.toggle('is-scrolled', should);
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const darkSections = Array.from(document.querySelectorAll('.dark'));
  if (darkSections.length) {
    const check = () => {
      const probeY = header.getBoundingClientRect().bottom - 1;
      let onDark = false;
      for (const s of darkSections) {
        const r = s.getBoundingClientRect();
        if (r.top <= probeY && r.bottom >= 0) { onDark = true; break; }
      }
      header.classList.toggle('is-on-dark', onDark);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
  }
})();

// ---------- Reveal on scroll ----------
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(el => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  els.forEach(el => io.observe(el));
})();

// ---------- Year stamp ----------
(function () {
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();

// ---------- Global custom cursor ----------
(function () {
  const cursor = document.querySelector('[data-cursor]');
  if (!cursor) return;

  const onMove = (e) => {
    cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    cursor.classList.add('is-on');
  };
  const onLeave = () => cursor.classList.remove('is-on');

  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('mouseleave', onLeave);

  const grow = (e) => {
    cursor.classList.toggle('is-grow', !!e.target.closest('a, button, .case-card'));
  };
  window.addEventListener('pointermove', grow, { passive: true });
})();

// ---------- 404 lens: black veil with a cursor-following hole that swells at centre ----------
(function () {
  const veil = document.querySelector('[data-lens]');
  if (!veil) return;
  // Touch / no-hover devices use the static centred hole from CSS.
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

  const base = 96;    // hole radius over the black field
  const boost = 185;  // extra radius right at the centre (reveals the full message)
  const reach = 400;  // distance (px) over which the boost fades out

  let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
  let cx = tx, cy = ty;
  let raf = null;

  const draw = () => {
    raf = null;
    cx += (tx - cx) * 0.18;
    cy += (ty - cy) * 0.18;
    const dx = cx - window.innerWidth / 2;
    const dy = cy - window.innerHeight / 2;
    const t = Math.max(0, 1 - Math.hypot(dx, dy) / reach);
    const r = base + boost * t * t;
    veil.style.setProperty('--x', cx.toFixed(1) + 'px');
    veil.style.setProperty('--y', cy.toFixed(1) + 'px');
    veil.style.setProperty('--r', r.toFixed(1) + 'px');
    if (Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3) raf = requestAnimationFrame(draw);
  };

  window.addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!raf) raf = requestAnimationFrame(draw);
  }, { passive: true });

  draw(); // start at centre so the message is hinted on load
})();

// ---------- Draggable collage layers ----------
(function () {
  const layers = document.querySelectorAll('[data-drag]');
  if (!layers.length) return;

  layers.forEach((el) => {
    let dragging = false;
    let startX = 0, startY = 0, baseX = 0, baseY = 0;

    const onDown = (e) => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startY = e.clientY;
      const m = /translate3d\(([-.\d]+)px,\s*([-.\d]+)px/.exec(el.style.transform || '');
      baseX = m ? parseFloat(m[1]) : 0;
      baseY = m ? parseFloat(m[2]) : 0;
      el.classList.add('is-dragging');
      el.style.zIndex = 50;
    };
    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      el.style.transform = `translate3d(${baseX + dx}px, ${baseY + dy}px, 0)`;
    };
    const onUp = (e) => {
      if (!dragging) return;
      dragging = false;
      el.releasePointerCapture(e.pointerId);
      el.classList.remove('is-dragging');
      el.style.zIndex = el.dataset.z || '';
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
  });
})();

// ---------- Timeline step activation (Nebo) ----------
(function () {
  const steps = document.querySelectorAll('[data-timeline]');
  if (!steps.length || !('IntersectionObserver' in window)) {
    steps.forEach(s => s.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.25 });
  steps.forEach(s => io.observe(s));
})();

// ---------- Poster tilt on hover (Nebo case) ----------
(function () {
  const posters = document.querySelectorAll('[data-tilt]');
  if (!posters.length) return;

  posters.forEach((poster) => {
    const img = poster.querySelector('img');
    if (!img) return;

    let rafId = null;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
    let hovering = false;
    let targetScale = 1, currentScale = 1;

    const apply = () => {
      rafId = null;
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      currentScale += (targetScale - currentScale) * 0.18;
      img.style.transform = `rotateX(${currentY.toFixed(2)}deg) rotateY(${currentX.toFixed(2)}deg) scale(${currentScale.toFixed(4)})`;
      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05 || Math.abs(targetScale - currentScale) > 0.001) {
        rafId = requestAnimationFrame(apply);
      } else if (!hovering) {
        img.style.transform = '';
      }
    };

    poster.addEventListener('pointermove', (e) => {
      const r = poster.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      targetX = px * 10;
      targetY = -py * 10;
      if (!hovering) { hovering = true; targetScale = 1.04; }
      if (!rafId) rafId = requestAnimationFrame(apply);
    });
    poster.addEventListener('pointerleave', () => {
      hovering = false;
      targetX = 0; targetY = 0; targetScale = 1;
      if (!rafId) rafId = requestAnimationFrame(apply);
    });
  });
})();

// ---------- Lightbox — popup at container width, ←/→ cycle within group ----------
(function () {
  const groups = document.querySelectorAll('[data-lightbox-group]');
  if (!groups.length) return;

  // Build modal once
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML =
    '<button class="lightbox__nav lightbox__nav--prev" aria-label="Предыдущая">&#8592;</button>' +
    '<div class="lightbox__frame"><img alt=""></div>' +
    '<button class="lightbox__nav lightbox__nav--next" aria-label="Следующая">&#8594;</button>';
  document.body.appendChild(overlay);
  const frameImg = overlay.querySelector('img');
  const btnPrev = overlay.querySelector('.lightbox__nav--prev');
  const btnNext = overlay.querySelector('.lightbox__nav--next');

  let items = [];
  let index = 0;
  let touchStartX = 0;

  const show = (n) => {
    if (!items.length) return;
    index = (n + items.length) % items.length;
    const it = items[index];
    frameImg.src = it.getAttribute('href') || it.querySelector('img')?.src;
    btnPrev.style.display = items.length > 1 ? '' : 'none';
    btnNext.style.display = items.length > 1 ? '' : 'none';
  };

  const open = (group, i) => {
    items = Array.from(group.querySelectorAll('a[href]'));
    if (!items.length) return;
    show(i);
    overlay.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
  };

  const close = () => {
    overlay.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    items = [];
  };

  groups.forEach((group) => {
    group.querySelectorAll('a[href]').forEach((link, idx) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        open(group, idx);
      });
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === frameImg) close();
  });

  btnPrev.addEventListener('click', (e) => { e.stopPropagation(); show(index - 1); });
  btnNext.addEventListener('click', (e) => { e.stopPropagation(); show(index + 1); });

  overlay.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  overlay.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? show(index + 1) : show(index - 1);
  });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') show(index + 1);
    else if (e.key === 'ArrowLeft') show(index - 1);
  });
})();

// ---------- Home cover slideshow — auto-cycling background images ----------
(function () {
  const cover = document.querySelector('[data-slideshow]');
  if (!cover) return;

  const slides = cover.querySelectorAll('.home-cover__slide');
  if (slides.length < 2) return;

  let current = 0;
  const intervalMs = 3000;
  let timer = null;

  const applyTheme = () => {
    const theme = slides[current].dataset.theme || 'dark';
    document.querySelectorAll('[data-cover-theme]').forEach((el) => {
      el.classList.toggle('is-on-light', theme === 'light');
    });
  };

  const goTo = (n) => {
    slides[current].classList.remove('is-active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    applyTheme();
  };

  const start = () => {
    timer = setInterval(() => goTo(current + 1), intervalMs);
  };
  const restart = () => {
    clearInterval(timer);
    start();
  };

  applyTheme();
  start();

  const prevBtn = document.querySelector('[data-slide-prev]');
  const nextBtn = document.querySelector('[data-slide-next]');
  prevBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    goTo(current - 1);
    restart();
  });
  nextBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    goTo(current + 1);
    restart();
  });

})();

// ---------- Home cover: mix-blend-mode arrow cursor over prev/next zones ----------
(function () {
  const prevZone = document.querySelector('.home-cover__zone--prev');
  const nextZone = document.querySelector('.home-cover__zone--next');
  if (!prevZone || !nextZone) return;

  const el = document.createElement('div');
  el.className = 'cover-cursor';
  el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);

  let raf = null;

  document.addEventListener('mousemove', (e) => {
    const px = e.clientX, py = e.clientY;
    const target = document.elementFromPoint(px, py);
    const zone = target ? target.closest('.home-cover__zone') : null;

    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      el.style.left = px + 'px';
      el.style.top = py + 'px';

      if (zone) {
        el.textContent = zone.classList.contains('home-cover__zone--prev') ? '←' : '→';
        el.classList.add('is-on');
      } else {
        el.classList.remove('is-on');
      }
    });
  });

  document.addEventListener('mouseleave', () => el.classList.remove('is-on'));
})();

// ---------- Home sidebar: drop the one-time entrance class once it's done,
// so hover animations don't fight it afterwards ----------
(function () {
  const sidebar = document.getElementById('home-sidebar');
  if (!sidebar || !sidebar.classList.contains('is-entering')) return;
  setTimeout(() => sidebar.classList.remove('is-entering'), 1200);
})();

// ---------- Home intro: a fast hard-cut slideshow that plays on every
// plain visit to the home page, then a curtain wipe reveals the page.
// Arriving via an anchor (e.g. the "Портфолио"/"Контакты" nav links from
// other pages, which land on index.html#work or #contact) skips it
// entirely — that's a deliberate jump to a specific spot, not a fresh
// "walk in the door" visit, so the intro would just get in the way. The
// sequence starts AND ends on slide 1, so the last intro frame matches
// the real hero's initial slide underneath — no visual jump at the seam.
// The real hero (with its own slower slideshow + arrows) sits underneath
// the whole time, unaffected — scrolling back up to it after the curtain
// lifts works exactly as it always does. ----------
(function () {
  const intro = document.getElementById('intro');
  const work = document.getElementById('work');
  if (!intro || !work) return;

  if (location.hash) { intro.remove(); return; }

  const slides = intro.querySelectorAll('.intro__slide');
  if (!slides.length) { intro.remove(); return; }

  document.documentElement.style.overflow = 'hidden';

  const FRAME_MS = 300;
  // 0,1,2,...,n-1,0 — starts on slide 1, cycles through the rest, ends back on slide 1.
  const sequence = [...slides.keys(), 0];
  let step = 0;

  const tick = setInterval(() => {
    step += 1;
    if (step >= sequence.length) { finish(); return; }
    slides.forEach((s) => s.classList.remove('is-active'));
    slides[sequence[step]].classList.add('is-active');
  }, FRAME_MS);

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    clearInterval(tick);

    work.scrollIntoView({ behavior: 'auto' });
    document.documentElement.style.overflow = '';

    intro.classList.add('is-closing');
    intro.addEventListener('transitionend', () => intro.remove(), { once: true });
  };

  intro.addEventListener('click', finish);
})();

// ---------- Easter egg: footer brand ----------
(function () {
  const brand = document.querySelector('.site-footer__brand');
  if (!brand) return;

  const scriptEl = document.querySelector('script[src*="assets/js/site.js"]');
  const base = scriptEl ? scriptEl.src.replace(/assets\/js\/site\.js.*$/, '') : '/';

  const overlay = document.createElement('div');
  overlay.className = 'easter-overlay';
  const img = document.createElement('img');
  img.src = base + 'assets/main/congrats.png';
  img.alt = '';
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  brand.addEventListener('click', () => {
    overlay.classList.add('is-visible');
  });

  overlay.addEventListener('click', () => {
    overlay.classList.remove('is-visible');
  });
})();

