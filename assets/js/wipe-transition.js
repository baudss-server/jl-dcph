// assets/js/wipe-transition.js
document.addEventListener('DOMContentLoaded', () => {
  const pageWipe = document.querySelector('.page-wipe');
  if (!pageWipe) return;

  const isHashLink = (href) => href && href.trim().startsWith('#');

  function handleWipeClick(e) {
    const a = e.currentTarget;
    const href = a.getAttribute('href') || '';
    if (isHashLink(href)) return; // in-page anchors: walang swipe

    e.preventDefault();

    // Single swipe lang: EXIT swipe (cover) then navigate
    pageWipe.style.pointerEvents = 'auto';
    pageWipe.classList.remove('wipe-reveal-right'); // just in case
    pageWipe.classList.add('wipe-cover-left');

    pageWipe.addEventListener('animationend', () => {
      window.location.href = href;
    }, { once: true });
  }

  // Targetin lahat ng external links na may data-wipe
  document.querySelectorAll('a[data-wipe]').forEach(a => {
    a.addEventListener('click', handleWipeClick);
  });
});
