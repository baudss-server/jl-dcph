// ../js/modal.js
// Modal for Services (VA & Janitorial). Robust + accessible.

document.addEventListener('DOMContentLoaded', () => {
  // ----- Ensure modal exists (auto-create if missing) -----
  let modal = document.getElementById('service-modal');
  if (!modal) {
    const tpl = document.createElement('div');
    tpl.id = 'service-modal';
    tpl.className = 'dcp-modal';
    tpl.setAttribute('role', 'dialog');
    tpl.setAttribute('aria-modal', 'true');
    tpl.setAttribute('aria-labelledby', 'modal-title');
    tpl.hidden = true;
    tpl.innerHTML = `
      <div class="dcp-modal-content glass">
        <button class="dcp-modal-close-btn" aria-label="Close modal">×</button>
        <h3 id="modal-title" class="text-gradient"></h3>
        <img id="modal-image" class="modal-image" alt="" />
        <p id="modal-description"></p>
      </div>`;
    document.body.appendChild(tpl);
    modal = tpl;
  }
  modal.hidden = true; // start hidden

  // Elements
  const modalTitle = modal.querySelector('#modal-title');
  const modalDesc  = modal.querySelector('#modal-description');
  const modalImg   = modal.querySelector('#modal-image');
  const closeBtn   = modal.querySelector('.dcp-modal-close-btn');

  // Determine page type
  const isJanitorial = document.title.toLowerCase().includes('janitorial');

  // ----- DATA MAPS -----
  const VA = {
    'email-calendar-management': {
      title: 'Email & Calendar Management',
      description: 'We manage your inbox priorities and keep your calendar organized so you never miss a beat.',
      image: null
    },
    'customer-support': {
      title: 'Customer Support',
      description: 'Friendly, on-brand help through chat/email/phone to keep customers happy and loyal.',
      image: null
    },
    'data-entry': {
      title: 'Data Entry & Record Keeping',
      description: 'Accurate, consistent records so your info is always current and searchable.',
      image: null
    },
    'scheduling': {
      title: 'Scheduling & Appointment Setting',
      description: 'We handle bookings, reschedules, and reminders—smooth calendars, zero hassle.',
      image: null
    },
    'document-preparation': {
      title: 'Document Preparation',
      description: 'Polished reports, decks, SOPs, and forms—drafting, formatting, and proofreading.',
      image: null
    },
    'social-media-assistance': {
      title: 'Social Media Assistance',
      description: 'Light scheduling and engagement to keep your brand active and consistent.',
      image: null
    },
    'customized-admin-tasks': {
      title: 'Customized Admin Tasks',
      description: 'Research, coordination, and bespoke workflows tailored to your tools and SOPs.',
      image: null
    }
  };

  const base = '../images/';
  const JAN = {
    'restroom-cleaning': {
      title:'Restroom Maintenance Services',
      description:'Spotless, hygienic restrooms maintained on schedule.',
      image: base + 'restroomcleaning.png'
    },
    'workstation-cleaning': {
      title:'Workstation Cleaning Services',
      description:'Dust-free desks, sanitized peripherals, tidy stations.',
      image: base + 'workstationcleaning.png'
    },
    'staff-room-cleaning': {
      title:'Staff Room Cleaning Services',
      description:'Clean, comfortable break areas your team will appreciate.',
      image: base + 'windowcleaning.png'
    },
    'kitchen-cleaning': {
      title:'Kitchen Area Cleaning Services',
      description:'Degreased surfaces, clean sinks, safe food-prep zones.',
      image: base + 'kitchenarea.png'
    },
    'trash-disposal': {
      title:'Trash Disposal Services',
      description:'Regular, efficient waste removal for a clutter-free space.',
      image: base + 'trashdisposal.png'
    },
    'dusting-disinfection': {
      title:'Dusting & Disinfection Services',
      description:'From particles to touchpoints—fresh, safer environments.',
      image: base + 'dustingdisinfection.png'
    },
    'floor-care': {
      title:'Floor Cleaning – Vacuuming, Sweeping & Mopping',
      description:'Clean floors = better air and a more professional feel.',
      image: base + 'wetfloorcaution.png'
    },
    'carpet-cleaning': {
      title:'Carpet Cleaning',
      description:'Vacuum + deep extraction for stains and odors.',
      image: base + 'carpetcleaning.png'
    },
    'interior-exterior-cleaning': {
      title:'Interior & Exterior Cleaning',
      description:'Comprehensive care: lobbies, entries, façades, more.',
      image: base + 'interior-exteriorcleaning.png'
    }
  };

  const MAP = isJanitorial ? JAN : VA;

  // ----- State & a11y helpers -----
  let isOpen = false;
  let prevFocus = null;

  function trapFocus(e){
    if(e.key !== 'Tab') return;
    const nodes = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if(!nodes.length) return;
    const first = nodes[0], last = nodes[nodes.length - 1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }

  function openServiceModal(){
    if (isOpen) return;
    isOpen = true;
    prevFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', trapFocus);
    (closeBtn || modal).focus();
  }

  function closeServiceModal(){
    if (!isOpen) return;
    isOpen = false;
    document.removeEventListener('keydown', trapFocus);
    document.body.style.overflow = '';
    modal.hidden = true;
    if(prevFocus && prevFocus.focus) prevFocus.focus();
  }

  function openWithData(data){
    const title = data?.title || '';
    const desc  = data?.description || '';
    const img   = data?.image || '';

    modalTitle.textContent = title;
    modalDesc.textContent  = desc;

    if (img) {
      modalImg.removeAttribute('src');
      modalImg.alt = title || 'Service image';
      const loader = new Image();
      loader.onload = () => { modalImg.src = loader.src; openServiceModal(); };
      loader.onerror = () => openServiceModal();
      loader.src = img;
    } else {
      modalImg.removeAttribute('src');
      modalImg.alt = '';
      openServiceModal();
    }
  }

  // ----- Attach triggers (supports clicks on inner elements) -----
  // Use event delegation on the UL to be extra safe
  document.querySelectorAll('.dcp-services-list, .va-services-list').forEach(list => {
    list.addEventListener('click', (e) => {
      const li = e.target.closest('[data-service-id]');
      if (!li) return;
      const id = li.getAttribute('data-service-id');
      const data = MAP[id];
      if (data) openWithData(data);
    });

    // Keyboard support for list items
    list.querySelectorAll('[data-service-id]').forEach(li => {
      if (li.tabIndex < 0) li.tabIndex = 0;
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const id = li.getAttribute('data-service-id');
          const data = MAP[id];
          if (data) openWithData(data);
        }
      });
    });
  });

  // ----- Close handlers -----
  if (closeBtn) closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeServiceModal();
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeServiceModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeServiceModal();
  });

  // Public API (optional)
  window.DCPModal = { open: openWithData, close: closeServiceModal };
});
