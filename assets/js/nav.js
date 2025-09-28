// Global mobile drawer: right-side, scroll lock, smooth in-page scroll.
// Works across pages that include .dcp-header / .dcp-nav / .dcp-burger.

document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.dcp-burger');
  const header = document.querySelector('.dcp-header');
  let nav = document.querySelector('.dcp-nav');

  if (!burger || !header || !nav) return;

  // Overlay (create once, global)
  let overlay = document.querySelector('.menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
  }
  // Make sure overlay starts hidden and won't block taps
  overlay.removeAttribute('hidden');
  overlay.setAttribute('aria-hidden', 'true');

  // Anchor where nav returns on desktop
  let navAnchor = document.getElementById('nav-anchor');
  if (!navAnchor) {
    navAnchor = document.createElement('div');
    navAnchor.id = 'nav-anchor';
    header.querySelector('.dcp-header-container')?.appendChild(navAnchor);
  }

  // Placement logic (portal nav to body on mobile so it overlays content)
  const BREAKPOINT = 991;
  const placeNavMobile = () => { if (nav && nav.parentElement !== document.body) document.body.appendChild(nav); };
  const placeNavDesktop = () => { if (nav && nav.parentElement === document.body) navAnchor.parentElement.insertBefore(nav, navAnchor); };
  const ensurePlacement = () => { (window.innerWidth <= BREAKPOINT) ? placeNavMobile() : placeNavDesktop(); };

  // Scroll lock
  let preventTouch = null, preventWheel = null;
  const enableEventBlockers = () => {
    preventTouch = (e) => { e.preventDefault(); };
    preventWheel = (e) => { e.preventDefault(); };
    document.addEventListener('touchmove', preventTouch, { passive: false });
    document.addEventListener('wheel', preventWheel, { passive: false });
    document.body.classList.add('menu-open');
  };
  const disableEventBlockers = () => {
    if (preventTouch) document.removeEventListener('touchmove', preventTouch);
    if (preventWheel) document.removeEventListener('wheel', preventWheel);
    preventTouch = null; preventWheel = null;
    document.body.classList.remove('menu-open');
  };

  // Open/close
  const openMenu = () => {
    ensurePlacement();
    nav.classList.add('is-active');
    burger.classList.add('is-active');
    burger.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');
    enableEventBlockers();
  };
  const closeMenu = () => {
    nav.classList.remove('is-active');
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    disableEventBlockers();
  };
  const toggleMenu = () => (nav.classList.contains('is-active') ? closeMenu() : openMenu());

  // Smooth in-page scroll for same-page hashes
  const isSamePageHash = (href) => {
    if (!href) return false;
    if (href.startsWith('#')) return true;
    try {
      const u = new URL(href, window.location.href);
      return u.origin === location.origin && u.pathname === location.pathname && !!u.hash;
    } catch { return false; }
  };
  const getHashId = (href) => {
    if (!href) return null;
    if (href.startsWith('#')) return href.slice(1);
    try { const u = new URL(href, window.location.href); return u.hash ? u.hash.slice(1) : null; } catch { return null; }
  };
  const computeTargetY = (el) => {
    const headerH = (document.querySelector('.dcp-header')?.offsetHeight || 0) + 4;
    const rect = el.getBoundingClientRect();
    return Math.max(0, (window.pageYOffset || 0) + rect.top - headerH);
  };
  const smoothScrollToY = (y) => window.scrollTo({ top: y, behavior: 'smooth' });

  // Wire events
  burger.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
  overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  // Delegate clicks on nav links
  if (!nav.dataset.bound) {
    nav.dataset.bound = '1';
    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href') || '';

        // 1) Same-page hash → intercept + smooth scroll
        if (isSamePageHash(href)) {
          e.preventDefault();
          const id = getHashId(href);
          const el = id ? (document.getElementById(id) || document.querySelector(`[name="${CSS.escape(id)}"]`)) : null;
          closeMenu();
          if (el) {
            const targetY = computeTargetY(el);
            setTimeout(() => {
              smoothScrollToY(targetY);
              try { history.pushState(null, '', `#${id}`); } catch {}
            }, 60);
          }
          return;
        }

        // 2) External/other links → let wipe-transition handle if .js-wipe
        closeMenu();
      }, { passive:false });
    });
  }

  // Responsive safety
  const normalize = () => {
    if (window.innerWidth > BREAKPOINT) {
      placeNavDesktop();
      closeMenu();
    } else {
      placeNavMobile();
      if (!nav.classList.contains('is-active')) disableEventBlockers();
    }
  };
  window.addEventListener('resize', normalize, { passive:true });
  window.addEventListener('orientationchange', normalize);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') normalize(); });

  ensurePlacement();
  normalize();
});
