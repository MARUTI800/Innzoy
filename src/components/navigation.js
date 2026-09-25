export function initNavigation(lenis) {
  const nav = document.querySelector('#mainNav');
  const drawer = document.querySelector('#conciergeDrawer');
  const closeDrawerBtn = document.querySelector('#closeDrawerBtn');
  const conciergeForm = document.querySelector('#conciergeForm');
  const propertySelect = document.querySelector('#drawerPropertySelect');

  // Scroll visibility handling (Lenis-aware)
  if (nav) {
    let lastScrollY = 0;

    const updateNavOnScroll = (scrollY) => {
      nav.classList.toggle('nav-scrolled', scrollY > 80);

      if (scrollY > 300 && scrollY > lastScrollY && !drawer?.classList.contains('open')) {
        nav.classList.add('nav-hidden');
      } else {
        nav.classList.remove('nav-hidden');
      }

      lastScrollY = scrollY;
    };

    if (lenis) {
      lenis.on('scroll', ({ scroll }) => updateNavOnScroll(scroll));
    } else {
      window.addEventListener('scroll', () => updateNavOnScroll(window.scrollY), { passive: true });
    }
  }

  // Minimum check-in date = today
  const checkinInput = document.querySelector('#drawerCheckinInput');
  if (checkinInput) {
    const today = new Date().toISOString().split('T')[0];
    checkinInput.min = today;
  }

  const mobileBurger = document.querySelector('#mobileBurger');
  const navCluster = document.querySelector('.nav-links-cluster');

  if (mobileBurger && navCluster) {
    mobileBurger.addEventListener('click', () => {
      mobileBurger.classList.toggle('active');
      navCluster.classList.toggle('mobile-open');
    });
  }

  // Smooth anchor navigation using Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      if (anchor.hasAttribute('data-property-trigger')) return;

      if (mobileBurger && navCluster) {
        mobileBurger.classList.remove('active');
        navCluster.classList.remove('mobile-open');
      }
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl && lenis) {
          e.preventDefault();
          lenis.scrollTo(targetEl, { offset: 0, duration: 1.4 });
        }
      }
    });
  });

  // Concierge Drawer Openers
  function openDrawer(propertyName = null) {
    if (drawer) {
      if (propertyName && propertySelect) {
        // Pre-select matching property
        for (let i = 0; i < propertySelect.options.length; i++) {
          if (propertySelect.options[i].text.toLowerCase().includes(propertyName.toLowerCase()) || 
              propertySelect.options[i].value.toLowerCase().includes(propertyName.toLowerCase())) {
            propertySelect.selectedIndex = i;
            break;
          }
        }
      }
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    }
  }

  function closeDrawer() {
    if (drawer) {
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }
  }

  const reserveTriggers = document.querySelectorAll('#navReserveBtn, #footerReserveBtn, #openReserveDrawerLink');
  reserveTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  });

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', closeDrawer);
  }

  if (drawer) {
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) closeDrawer();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer?.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Concierge form WhatsApp dispatch
  if (conciergeForm) {
    conciergeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const prop = propertySelect ? propertySelect.value : 'Innzoy Sanctuaries';
      const checkin = document.querySelector('#drawerCheckinInput')?.value || 'Upcoming Dates';
      const guests = document.querySelector('#drawerGuestsSelect')?.value || '2 Guests';

      const message = `Hello Innzoy Concierge, I would like to reserve a stay at ${prop} for check-in on ${checkin} (${guests}). Please share availability, suite options, and direct booking confirmation.`;
      const waUrl = `https://wa.me/918520963096?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      closeDrawer();
    });
  }

  return { openDrawer, closeDrawer };
}
