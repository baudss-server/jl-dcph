// assets/js/testimonial.js
// Testimonials: auto-loop (mobile + desktop), native swipe on touch, drag-to-scroll on mouse/pen.
// No nav/hamburger logic here (that lives in nav.js).

(function () {
  function init() {
    const track = document.querySelector('.dcp-testimonial-cards');
    if (!track) return;

    // -------- Auto-loop --------
    let autoTimer = null;
    const SPEED = 0.8;   // px per tick
    const TICK  = 16;    // ms
    let pausedByHover  = false;
    let pausedByDrag   = false;
    let pausedByTouch  = false;
    let pausedByHidden = false;

    const atMax = () => {
      const max = Math.max(0, track.scrollWidth - track.clientWidth);
      const nearEnd = track.scrollLeft >= (max > 0 ? max - 1 : 0);
      return { max, nearEnd, isMax: max <= 0 };
    };

    const startAuto = () => {
      if (autoTimer || pausedByHover || pausedByDrag || pausedByTouch || pausedByHidden) return;
      autoTimer = setInterval(() => {
        const { isMax, nearEnd } = atMax();
        if (isMax) return;                // nothing to scroll
        track.scrollLeft = nearEnd ? 0 : (track.scrollLeft + SPEED);
      }, TICK);
    };

    const stopAuto = () => {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = null;
    };

    // Hover pause (desktop)
    track.addEventListener('mouseenter', () => { pausedByHover = true;  stopAuto(); });
    track.addEventListener('mouseleave', () => { pausedByHover = false; startAuto(); });

    // Page visibility (save battery)
    document.addEventListener('visibilitychange', () => {
      pausedByHidden = document.visibilityState !== 'visible';
      if (pausedByHidden) stopAuto(); else startAuto();
    });

    // -------- Drag-to-scroll (desktop/pen) --------
    let dragging = false;
    let dragMoved = false;
    let startX = 0;
    let startLeft = 0;

    const onPointerDown = (e) => {
      if (e.pointerType === 'touch') return;        // let touch be native
      if (e.button !== undefined && e.button !== 0) return; // left button only
      dragging = true; dragMoved = false;
      pausedByDrag = true; stopAuto();
      track.classList.add('dragging');
      startX = e.clientX;
      startLeft = track.scrollLeft;
      if (track.setPointerCapture) {
        try { track.setPointerCapture(e.pointerId); } catch {}
      }
    };

    const onPointerMove = (e) => {
      if (!dragging || e.pointerType === 'touch') return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 2) dragMoved = true;
      track.scrollLeft = startLeft - dx;            // map drag to scroll
      // prevent text selection while dragging
      if (typeof e.preventDefault === 'function') e.preventDefault();
    };

    const endPointer = (e) => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('dragging');
      if (track.releasePointerCapture && e && e.pointerId !== undefined) {
        try { track.releasePointerCapture(e.pointerId); } catch {}
      }
      // If user dragged, block the immediate click so cards/links won’t be triggered
      if (dragMoved) {
        const blocker = (ev) => { ev.stopPropagation(); ev.preventDefault(); track.removeEventListener('click', blocker, true); };
        track.addEventListener('click', blocker, true);
      }
      pausedByDrag = false; startAuto();
    };

    // Use Pointer Events when available
    const hasPointer = 'PointerEvent' in window;
    if (hasPointer) {
      track.addEventListener('pointerdown', onPointerDown);
      track.addEventListener('pointermove', onPointerMove, { passive: false });
      track.addEventListener('pointerup',     endPointer);
      track.addEventListener('pointercancel', endPointer);
      track.addEventListener('pointerleave',  endPointer);
    } else {
      // Fallback for very old browsers (mouse only)
      const onMouseDown = (e) => {
        if (e.button !== 0) return;
        dragging = true; dragMoved = false;
        pausedByDrag = true; stopAuto();
        track.classList.add('dragging');
        startX = e.clientX;
        startLeft = track.scrollLeft;
        e.preventDefault();
      };
      const onMouseMove = (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 2) dragMoved = true;
        track.scrollLeft = startLeft - dx;
        e.preventDefault();
      };
      const onMouseUpLeave = () => {
        if (!dragging) return;
        dragging = false;
        track.classList.remove('dragging');
        if (dragMoved) {
          const blocker = (ev) => { ev.stopPropagation(); ev.preventDefault(); track.removeEventListener('click', blocker, true); };
          track.addEventListener('click', blocker, true);
        }
        pausedByDrag = false; startAuto();
      };
      track.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUpLeave);
      track.addEventListener('mouseleave', onMouseUpLeave);
    }

    // -------- Mobile touch: native swipe, just pause/resume auto --------
    track.addEventListener('touchstart', () => { pausedByTouch = true;  stopAuto(); }, { passive: true });
    track.addEventListener('touchend',   () => { pausedByTouch = false; startAuto(); }, { passive: true });

    // -------- Start --------
    startAuto();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
