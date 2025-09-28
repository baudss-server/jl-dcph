// assets/js/wipe-transition.js
// ONE-WAY WIPE: plays only on click of <a class="js-wipe">. No reveal on load.
// Skips hash links, new tabs, modifier/middle clicks, mailto/tel/javascript,
// downloads, cross-origin, same-document URLs. Respects prefers-reduced-motion.

(function () {
  let isNavigating = false;

  // ---------- helpers ----------
  function ensureOverlay() {
    let el = document.querySelector('.page-wipe');
    if (!el) {
      el = document.createElement('div');
      el.className = 'page-wipe';
      document.body.appendChild(el);
    }
    // Idle: allow normal clicks through
    el.style.pointerEvents = 'none';
    return el;
  }

  function hasModifier(e) {
    return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1;
  }

  function isHashLink(href) {
    return href && href.trim().startsWith('#');
  }

  function isNewTab(a) {
    const target = (a.getAttribute('target') || '').toLowerCase();
    return target === '_blank';
  }

  function isDownload(a) {
    return a.hasAttribute('download');
  }

  function isSpecialProtocol(href) {
    const h = (href || '').trim().toLowerCase();
    return h.startsWith('mailto:') || h.startsWith('tel:') || h.startsWith('javascript:');
  }

  function isSameOrigin(href) {
    try {
      const u = new URL(href, window.location.href);
      return u.origin === window.location.origin;
    } catch {
      return false;
    }
  }

  function isSameDocument(href) {
    try {
      const target = new URL(href, window.location.href);
      const here = new URL(window.location.href);
      return (
        target.pathname === here.pathname &&
        target.search === here.search &&
        target.hash === here.hash
      );
    } catch {
      return false;
    }
  }

  function prefersReducedMotion() {
    return (
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function coverThenNavigate(overlay, href) {
    if (isNavigating) return;
    isNavigating = true;

    overlay.style.pointerEvents = 'auto';
    overlay.classList.remove('wipe-reveal-right'); // safety if present
    // Force reflow to restart animation reliably
    // eslint-disable-next-line no-unused-expressions
    overlay.offsetWidth;
    overlay.classList.add('wipe-cover-left');

    const go = () => { window.location.href = href; };
    overlay.addEventListener('animationend', go, { once: true });
    // Fallback in case animationend is missed
    setTimeout(go, 1200);
  }

  // ---------- handler ----------
  function onClick(e) {
    const a = e.currentTarget;
    const href = a.getAttribute('href') || '';

    // Natural behaviors we don't intercept
    if (!href) return;
    if (isHashLink(href)) return;
    if (isNewTab(a)) return;
    if (hasModifier(e)) return;
    if (isDownload(a)) return;

    const hrefLower = href.trim().toLowerCase();
    if (isSpecialProtocol(hrefLower)) return;

    // Only wipe for same-origin navigations
    if (!isSameOrigin(href)) return;

    // Skip if user prefers reduced motion
    if (prefersReducedMotion()) return;

    // Skip if link points to the exact same URL
    if (isSameDocument(href)) return;

    // Per-link opt-out
    if (a.classList.contains('no-wipe')) return;

    e.preventDefault();
    const overlay = ensureOverlay();
    coverThenNavigate(overlay, href);
  }

  function bindLinks() {
    document.querySelectorAll('a.js-wipe').forEach((a) => {
      a.removeEventListener('click', onClick);
      a.addEventListener('click', onClick, { passive: false });
    });
  }

  function init() {
    bindLinks();
    // No reveal on load — single wipe per click only.
  }

  // Reset guard when returning via bfcache; still no reveal.
  window.addEventListener('pageshow', () => { isNavigating = false; });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
