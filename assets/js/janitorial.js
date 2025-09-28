// assets/js/janitorial.js
// Lightweight Janitorial-only JS (no VA imports)

document.addEventListener('DOMContentLoaded', () => {
  // Any page-specific tweaks can go here.
  // Example: soft reveal on hero
  const hero = document.querySelector('.jan-hero');
  if (hero) hero.classList.add('in');

  // Example: focus hash scroll offset (optional)
  if (location.hash) {
    const el = document.querySelector(location.hash);
    if (el) {
      const headerH = (document.querySelector('.dcp-header')?.offsetHeight || 0) + 6;
      const y = Math.max(0, (window.pageYOffset || 0) + el.getBoundingClientRect().top - headerH);
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
});
