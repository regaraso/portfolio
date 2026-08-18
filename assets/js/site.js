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

// ---------- Slide-roll hover: wrap nav + CTA link text in .nav-out + .nav-in spans ----------
(function () {
  function wrapSlideRoll(el) {
    var text = el.textContent.trim();
    var out = document.createElement('span');
    out.className = 'nav-out';
    out.textContent = text;
    var inn = document.createElement('span');
    inn.className = 'nav-in';
    inn.textContent = text;
    inn.setAttribute('aria-hidden', 'true');
    el.textContent = '';
    el.appendChild(out);
    el.appendChild(inn);
  }
  document.querySelectorAll('.home-side__nav a').forEach(wrapSlideRoll);
  document.querySelectorAll('.site-header__nav a').forEach(wrapSlideRoll);
  document.querySelectorAll('.case-card__cta').forEach(wrapSlideRoll);
  document.querySelectorAll('.next-case__title').forEach(wrapSlideRoll);
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

// ---------- Mobile sidebar: collapse to header when hero scrolls out ----------
(function () {
  const sidebar = document.getElementById('home-sidebar');
  const hero = document.querySelector('.hero-shell');
  if (!sidebar || !hero) return;
  const io = new IntersectionObserver((entries) => {
    sidebar.classList.toggle('is-header', !entries[0].isIntersecting);
  }, { threshold: 0.9 });
  io.observe(hero);
})();

// ---------- Home sidebar: drop the one-time entrance class once it's done,
// so hover animations don't fight it afterwards ----------
(function () {
  const sidebar = document.getElementById('home-sidebar');
  if (!sidebar || !sidebar.classList.contains('is-entering')) return;
  setTimeout(() => sidebar.classList.remove('is-entering'), 1200);
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



// ---------- Custom scroll indicator ----------
(function () {
  const indicator = document.createElement('div');
  indicator.className = 'scroll-indicator';
  indicator.innerHTML = '<div class="scroll-indicator__track"></div><div class="scroll-indicator__thumb"></div>';
  document.body.appendChild(indicator);
  const thumb = indicator.querySelector('.scroll-indicator__thumb');
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    thumb.style.height = pct + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// ---------- Contacts popup ----------
(function () {
  const popup = document.getElementById('contacts-popup');
  if (!popup) return;

  const open = () => {
    popup.classList.add('is-open');
    document.documentElement.style.overflow = 'hidden';
    if (window.lenis) lenis.stop();
  };
  const close = () => {
    popup.classList.remove('is-open');
    document.documentElement.style.overflow = '';
    if (window.lenis) lenis.start();
  };

  document.querySelectorAll('[data-contacts-open]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); open(); });
  });

  document.querySelectorAll('[data-contacts-close]').forEach(el => {
    el.addEventListener('click', close);
  });

  popup.addEventListener('click', e => {
    if (e.target === popup) close();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popup.classList.contains('is-open')) close();
  });
})();
