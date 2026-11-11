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

