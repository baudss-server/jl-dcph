document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.dcp-burger');
  const header = document.querySelector('.dcp-header');
  let nav = document.querySelector('.dcp-nav');

  // === Overlay (create once if missing)
  let overlay = document.querySelector('.menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
  }

  // === Anchor to reinsert nav on desktop (when we portal it on mobile)
  let navAnchor = document.getElementById('nav-anchor');
  if (!navAnchor) {
    navAnchor = document.createElement('div');
    navAnchor.id = 'nav-anchor';
    header?.querySelector('.dcp-header-container')?.appendChild(navAnchor);
  }

  // ===== Responsive placement (same as before)
  const BREAKPOINT = 991;
  const placeNavMobile = () => { if (nav && nav.parentElement !== document.body) document.body.appendChild(nav); };
  const placeNavDesktop = () => { if (nav && nav.parentElement === document.body) navAnchor.parentElement.insertBefore(nav, navAnchor); };
  const ensurePlacement = () => { if (window.innerWidth <= BREAKPOINT) placeNavMobile(); else placeNavDesktop(); };

  // ===== MOBILE drawer scroll-lock WITHOUT position:fixed (prevents jump-to-top)
  let preventTouch = null;
  let preventWheel = null;

  const enableEventBlockers = () => {
    // Block touchmove/wheel while drawer open (no background scroll) — mobile safe
    preventTouch = (e) => { e.preventDefault(); };
    preventWheel = (e) => { e.preventDefault(); };
    document.addEventListener('touchmove', preventTouch, { passive: false });
    document.addEventListener('wheel', preventWheel, { passive: false });
    document.body.classList.add('menu-open'); // your CSS already sets overflow-y:hidden
  };

  const disableEventBlockers = () => {
    if (preventTouch) document.removeEventListener('touchmove', preventTouch);
    if (preventWheel) document.removeEventListener('wheel', preventWheel);
    preventTouch = null;
    preventWheel = null;
    document.body.classList.remove('menu-open');
  };

  // ===== Menu open/close (no position:fixed anymore)
  const openMenu = () => {
    ensurePlacement();
    nav?.classList.add('is-active');
    burger?.classList.add('is-active');
    enableEventBlockers();
  };
  const closeMenu = () => {
    nav?.classList.remove('is-active');
    burger?.classList.remove('is-active');
    disableEventBlockers();
  };
  const toggleMenu = () => (nav?.classList.contains('is-active') ? closeMenu() : openMenu());

  // ===== Link helpers
  const isSamePageHash = (href) => {
    if (!href) return false;
    if (href.startsWith('#')) return true;
    try {
      const u = new URL(href, window.location.href);
      return u.origin === window.location.origin && u.pathname === window.location.pathname && !!u.hash;
    } catch { return false; }
  };
  const getHashId = (href) => {
    if (!href) return null;
    if (href.startsWith('#')) return href.slice(1);
    try { const u = new URL(href, window.location.href); return u.hash ? u.hash.slice(1) : null; }
    catch { return null; }
  };

  // Compute absolute Y BEFORE closing the drawer (prevents any jump)
  const computeTargetY = (el) => {
    const headerH = (document.querySelector('.dcp-header')?.offsetHeight || 0) + 4; // buffer
    const rect = el.getBoundingClientRect();
    return Math.max(0, (window.pageYOffset || 0) + rect.top - headerH);
  };

  const smoothScrollToY = (y) => {
    // No need for flags now; we never used position:fixed, so no restore jump
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // ===== Wire events
  if (burger && nav) {
    burger.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
    overlay.addEventListener('click', closeMenu);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

    // Guard to avoid duplicate bindings when HTML is reloaded/rehydrated
    if (!nav.dataset.bound) {
      nav.dataset.bound = '1';

      nav.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', (e) => {
          const href = a.getAttribute('href') || '';
          e.preventDefault(); // deterministic control

          // Same-page anchor: PRECOMPUTE target Y now (while drawer is still open)
          let targetY = null;
          let newHash = null;

          if (isSamePageHash(href)) {
            const id = getHashId(href);
            const el = id ? (document.getElementById(id) || document.querySelector(`[name="${CSS.escape(id)}"]`)) : null;
            if (el) {
              targetY = computeTargetY(el);
              newHash = `#${id}`;
            }
          }

          // Close drawer first (no position:fixed → no jump)
          closeMenu();

          // Navigate/scroll shortly after close
          setTimeout(() => {
            if (targetY !== null) {
              smoothScrollToY(targetY);          // exact Y, smooth
              if (newHash) { try { history.pushState(null, '', newHash); } catch {} }
            } else {
              // External / other page
              try {
                const abs = new URL(href, window.location.href).toString();
                window.location.assign(abs);
              } catch {
                if (href && href !== '#') window.location.href = href;
              }
            }
          }, 50);
        }, { passive:false });
      });
    }
  }

  // ===== Responsive safety (keep the portal, but no scroll restore needed)
  const normalize = () => {
    if (window.innerWidth > BREAKPOINT) {
      placeNavDesktop();
      closeMenu();
    } else {
      placeNavMobile();
      if (!nav?.classList.contains('is-active')) disableEventBlockers();
    }
  };
  window.addEventListener('resize', normalize, { passive:true });
  window.addEventListener('orientationchange', normalize);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') normalize(); });

  ensurePlacement();
  normalize();

  // ===== Testimonials auto-loop (kept same)
  const track = document.querySelector('.dcp-testimonial-cards');
  if (track) {
    let auto = null;
    const SPEED = 0.8, TICK = 16;
    const start = () => { stop(); auto = setInterval(() => {
      const max = track.scrollWidth - track.clientWidth;
      if (max <= 0) return;
      track.scrollLeft = (track.scrollLeft >= max - 1) ? 0 : (track.scrollLeft + SPEED);
    }, TICK); };
    const stop = () => { if (auto) clearInterval(auto); auto = null; };
    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', start);
    track.addEventListener('touchstart', (e) => e.preventDefault(), { passive:false });
    track.addEventListener('mousedown',  (e) => e.preventDefault());
    start();
  }
});
