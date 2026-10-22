// smooth wheel scrolling (Lenis) on top of the native scroll the site already listens to; touch scrolling stays native
(() => {
  if (!window.Lenis || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const html = document.documentElement;
  html.style.scrollBehavior = 'auto';   // CSS smooth scrolling would fight Lenis
  const lenis = new Lenis({ lerp: .1, anchors: true, autoRaf: true,
    // the footer scrolls on its own when it is taller than the screen
    prevent: n => { const f = n.closest?.('footer'); return !!f && f.scrollHeight > f.clientHeight; } });
  window.lenis = lenis;
  // paused during the intro and while the menu is open, like the page itself
  const sync = () => (html.classList.contains('intro') || html.classList.contains('menu-open')) ? lenis.stop() : lenis.start();
  new MutationObserver(sync).observe(html, { attributes: true, attributeFilter: ['class'] }); sync();
})();
