// assets/js/janitorial-gallery.js
// Janitorial-only gallery; reuses modal.js for the popup.

(function () {
  // Your images live at: assets/images/iStock-1.png ... iStock-10.png
  // From assets/views/janitorial.html, the correct relative path is:
  const base = '../images/';

  const IMAGES = [
    { src: base + 'iStock-1.png',  title: 'Team In Action',        desc: 'Coordinated office cleaning workflow.' },
    { src: base + 'iStock-2.png',  title: 'Keyboard Sanitizing',   desc: 'Electronics safe-cleaning protocol.' },
    { src: base + 'iStock-3.png',  title: 'Window Cleaning',       desc: 'Streak-free glass and frames.' },
    { src: base + 'iStock-4.png',  title: 'Carpet Care',           desc: 'Vacuum and deep extraction.' },
    { src: base + 'iStock-5.png',  title: 'Restaurant/Dining',     desc: 'After-hours floor mopping.' },
    { src: base + 'iStock-6.png',  title: 'Glass & Bubbles',       desc: 'Detailing for high-visibility panes.' },
    { src: base + 'iStock-7.png',  title: 'Restroom Fixtures',     desc: 'Disinfection of taps and counters.' },
    { src: base + 'iStock-8.png',  title: 'Janitorial Cart',       desc: 'Tools ready for rapid deployment.' },
    { src: base + 'iStock-9.png',  title: 'Wet Floor Caution',     desc: 'Safety-first signage during mopping.' },
    { src: base + 'iStock-10.png', title: 'Waste Collection',      desc: 'Efficient, tidy trash handling.' }
  ];

  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  // Render thumbnails
  grid.innerHTML = IMAGES.map((it, idx) => `
    <figure class="dcp-gallery-card glass" data-idx="${idx}" tabindex="0" role="button" aria-label="${it.title}">
      <img src="${it.src}" alt="${it.title}" loading="lazy" />
      <figcaption>${it.title}</figcaption>
    </figure>
  `).join('');

  // Hook to modal.js
  const openModal = (idx) => {
    const item = IMAGES[idx];
    if (!item) return;

    const modal  = document.getElementById('service-modal') || document.querySelector('.dcp-modal');
    const mTitle = document.getElementById('modal-title');
    const mDesc  = document.getElementById('modal-description');

    if (mTitle) mTitle.textContent = item.title;
    if (mDesc)  mDesc.textContent  = item.desc;

    // ensure an image exists inside modal
    let img = modal?.querySelector('.modal-image');
    if (!img) {
      img = document.createElement('img');
      img.className = 'modal-image';
      img.style.width = '100%';
      img.style.borderRadius = '12px';
      modal?.querySelector('.dcp-modal-content')?.insertBefore(img, mDesc?.nextSibling || null);
    }
    img.src = item.src;
    img.alt = item.title;

    if (modal) {
      modal.setAttribute('aria-hidden', 'false');
      modal.classList.add('show');
    }
  };

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.dcp-gallery-card');
    if (!card) return;
    const idx = Number(card.dataset.idx || -1);
    if (idx >= 0) openModal(idx);
  });

  grid.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.dcp-gallery-card');
    if (!card) return;
    e.preventDefault();
    const idx = Number(card.dataset.idx || -1);
    if (idx >= 0) openModal(idx);
  });
})();
