// assets/js/janitorial-gallery.js
// Janitorial thumbnails -> open same modal with Title + Image + Description (10 images only).

(function () {
  const base = '../images/';
  const IMAGES = [
    { src: base + 'iStock-1.png',  title: 'Team In Action',        desc: 'Coordinated office cleaning workflow.' },
    { src: base + 'iStock-2.png',  title: 'Keyboard Sanitizing',   desc: 'Electronics-safe cleaning protocol.' },
    { src: base + 'iStock-3.png',  title: 'Window Cleaning',       desc: 'Streak-free glass and frames.' },
    { src: base + 'iStock-4.png',  title: 'Carpet Care',           desc: 'Vacuum and deep extraction.' },
    { src: base + 'iStock-5.png',  title: 'Restaurant / Dining',   desc: 'After-hours floor mopping.' },
    { src: base + 'iStock-6.png',  title: 'Glass & Bubbles',       desc: 'Detailing for high-visibility panes.' },
    { src: base + 'iStock-7.png',  title: 'Restroom Fixtures',     desc: 'Disinfection of taps and counters.' },
    { src: base + 'iStock-8.png',  title: 'Janitorial Cart',       desc: 'Tools ready for rapid deployment.' },
    { src: base + 'iStock-9.png',  title: 'Wet Floor Caution',     desc: 'Safety-first signage during mopping.' },
    { src: base + 'iStock-10.png', title: 'Waste Collection',      desc: 'Efficient, tidy trash handling.' }
  ];

  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  // Render thumbnails (title only; full description in modal)
  grid.innerHTML = IMAGES.map((it, idx) => `
    <figure class="dcp-gallery-card glass" data-idx="${idx}" tabindex="0" role="button" aria-label="${it.title}">
      <img src="${it.src}" alt="${it.title}" loading="lazy" />
      <figcaption>${it.title}</figcaption>
    </figure>
  `).join('');

  const openItem = (idx) => {
    const it = IMAGES[idx];
    if (!it) return;
    window.DCPModal?.open({
      title: it.title,
      description: it.desc,
      image: it.src
    });
  };

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.dcp-gallery-card');
    if (!card) return;
    openItem(Number(card.dataset.idx));
  });

  grid.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.dcp-gallery-card');
    if (!card) return;
    e.preventDefault();
    openItem(Number(card.dataset.idx));
  });
})();
