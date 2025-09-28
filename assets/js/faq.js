// ../js/faq.js
// Accordion: open-one-at-a-time, smooth height animation, ARIA sync.
// No icon library dependency; the "+" is a plain text node rotated via CSS.

(function () {
  const EASE_OPEN = '320ms cubic-bezier(.22,.61,.36,1)';
  const EASE_CLOSE = '260ms cubic-bezier(.22,.61,.36,1)';

  const prefersReduce = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setHeight(el, willOpen) {
    if (!el) return;

    el.style.transition = 'none';

    if (willOpen) {
      el.style.maxHeight = 'none';
      const target = el.scrollHeight;
      el.style.maxHeight = '0px';
      // force reflow
      // eslint-disable-next-line no-unused-expressions
      el.offsetHeight;

      if (!prefersReduce()) el.style.transition = `max-height ${EASE_OPEN}`;
      el.style.maxHeight = target + 'px';
    } else {
      const current = el.scrollHeight;
      el.style.maxHeight = current + 'px';
      // force reflow
      // eslint-disable-next-line no-unused-expressions
      el.offsetHeight;

      if (!prefersReduce()) el.style.transition = `max-height ${EASE_CLOSE}`;
      el.style.maxHeight = '0px';
    }
  }

  function setAria(item, open) {
    const summary = item.querySelector('.faq-summary');
    if (summary) summary.setAttribute('aria-expanded', open ? 'true' : 'false');

    // Right icon is a "+" string; rotation handled by CSS on [open]
    const rightIcon = item.querySelector('.faq-right');
    if (rightIcon) rightIcon.textContent = '+'; // keep consistent
    item.classList.toggle('is-open', open);
  }

  function closeOthers(items, except) {
    items.forEach((other) => {
      if (other !== except && other.open) {
        const oc = other.querySelector('.faq-content');
        setHeight(oc, false);
        other.open = false;
        setAria(other, false);
      }
    });
  }

  function init() {
    const items = Array.from(document.querySelectorAll('.dcp-faq-item'));
    if (!items.length) return;

    items.forEach((item) => {
      const content = item.querySelector('.faq-content');
      const summary = item.querySelector('.faq-summary');

      if (content) {
        content.style.maxHeight = item.open ? content.scrollHeight + 'px' : '0px';

        // After opening, free the height so content can grow naturally
        content.addEventListener('transitionend', (ev) => {
          if (ev.propertyName !== 'max-height') return;
          if (item.open) {
            content.style.transition = 'none';
            content.style.maxHeight = 'none';
          }
        });
      }

      if (summary) summary.setAttribute('aria-expanded', item.open ? 'true' : 'false');
      setAria(item, !!item.open);

      function toggleFromUI() {
        const willOpen = !item.open;
        closeOthers(items, item);
        setHeight(content, willOpen);
        item.open = willOpen;
        setAria(item, willOpen);
      }

      // Toggle only when the summary row is clicked
      item.addEventListener('click', (e) => {
        if (!summary || !summary.contains(e.target)) return;
        e.preventDefault(); // prevent native instant toggle
        toggleFromUI();
      });

      // Keyboard support on summary
      if (summary) {
        summary.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFromUI();
          }
        });
      }
    });

    // Re-measure open panels on resize
    let rAF = null;
    const remeasure = () => {
      if (rAF) cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        items.forEach((item) => {
          if (!item.open) return;
          const content = item.querySelector('.faq-content');
          if (!content) return;
          content.style.transition = 'none';
          content.style.maxHeight = 'none';
          const h = content.scrollHeight;
          content.style.maxHeight = h + 'px';
          // force reflow
          // eslint-disable-next-line no-unused-expressions
          content.offsetHeight;
          content.style.transition = '';
        });
      });
    };
    window.addEventListener('resize', remeasure);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
