/* ========================================
   AN NOOR PACKAGING INDUSTRIES
   Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar Scroll ---- */
  const nav = document.getElementById('mainNav');
  const handleScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) scrollBtn.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ---- Mobile Menu ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose = document.getElementById('menuClose');
  const menuBackdrop = document.getElementById('menuBackdrop');

  const openMenu = () => {
    if (mobileMenu && menuBackdrop && hamburger) {
      mobileMenu.classList.add('open');
      menuBackdrop.classList.add('active');
      hamburger.classList.add('active');
      document.body.classList.add('menu-open');
    }
  };

  const closeMenu = () => {
    if (mobileMenu && menuBackdrop && hamburger) {
      mobileMenu.classList.remove('open');
      menuBackdrop.classList.remove('active');
      hamburger.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  };

  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
  }

  if (menuBackdrop) {
    menuBackdrop.addEventListener('click', closeMenu);
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(a => {
      // Skip the dropdown toggle
      if (!a.classList.contains('mobile-dropdown-toggle')) {
        a.addEventListener('click', () => {
          closeMenu();
        });
      }
    });
  }

  /* ---- Mobile Dropdown ---- */
  const mobileDropdowns = document.querySelectorAll('.mobile-dropdown');
  mobileDropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.mobile-dropdown-toggle');
    if (toggle) {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.toggle('active');
      });
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  /* ---- Hero Slider ---- */
  const slidesContainer = document.querySelector('.hero-slides');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  let current = 0;
  let autoInterval;
  const total = dots.length;

  const goToSlide = (n) => {
    if (!slidesContainer || total === 0) return;
    current = (n + total) % total;
    slidesContainer.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  };

  const startAuto = () => {
    clearInterval(autoInterval);
    autoInterval = setInterval(() => goToSlide(current + 1), 5500);
  };

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goToSlide(i); startAuto(); });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(current + 1); startAuto(); });

  goToSlide(0);
  if (total > 0) startAuto();

  /* ---- Stats Counter Animation ---- */
  const counters = document.querySelectorAll('[data-count]');
  let countStarted = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = parseFloat(counter.dataset.count);
      const suffix = counter.dataset.suffix || '';
      const prefix = counter.dataset.prefix || '';
      const isFloat = counter.dataset.float === 'true';
      const duration = 2000;
      const startTime = performance.now();

      const step = (timestamp) => {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = target * ease;
        counter.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else counter.textContent = prefix + (isFloat ? target.toFixed(1) : target) + suffix;
      };

      requestAnimationFrame(step);
    });
  };

  /* ---- Scroll Animations ---- */
  const animatedEls = document.querySelectorAll('[data-anim]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  animatedEls.forEach(el => observer.observe(el));

  /* Stats section observer */
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const statsObs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !countStarted) {
        countStarted = true;
        animateCounters();
        statsObs.disconnect();
      }
    }, { threshold: 0.3 });
    statsObs.observe(statsSection);
  }

  /* ---- Scroll to Top ---- */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Smooth Scroll for Anchors ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-links a[href^="#"]');

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObs.observe(s));

  /* ---- Stagger children animations ---- */
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = parent.children;
    Array.from(children).forEach((child, i) => {
      child.setAttribute('data-anim', 'up');
      child.setAttribute('data-delay', Math.min(i + 1, 4));
      observer.observe(child);
    });
  });

});

  /* ==========================================
     INFRASTRUCTURE TABS FILTER
     ========================================== */
  const infraTabs = document.querySelectorAll('.infra-tab');
  const machineOrigins = document.querySelectorAll('.machine-origin');
  const infraCards = document.querySelectorAll('.infra-card');
  
  if (infraTabs.length > 0) {
    infraTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs
        infraTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        this.classList.add('active');
        
        const country = this.getAttribute('data-country');
        
        // Filter machines based on country
        machineOrigins.forEach(origin => {
          const machineItem = origin.closest('.infra-machine-item');
          const originCountry = origin.getAttribute('data-country');
          
          if (country === 'all') {
            // Show all machines
            if (machineItem) {
              machineItem.style.display = 'flex';
              setTimeout(() => {
                machineItem.style.opacity = '1';
              }, 10);
            }
          } else {
            // Check if origin contains the selected country
            if (originCountry && originCountry.toLowerCase().includes(country.toLowerCase())) {
              if (machineItem) {
                machineItem.style.display = 'flex';
                setTimeout(() => {
                  machineItem.style.opacity = '1';
                }, 10);
              }
            } else {
              if (machineItem) {
                machineItem.style.opacity = '0';
                setTimeout(() => {
                  machineItem.style.display = 'none';
                }, 300);
              }
            }
          }
        });
        
        // After filtering machines, hide/show entire cards based on visible machines
        setTimeout(() => {
          infraCards.forEach(card => {
            // Skip the raw-materials card - it should always be visible
            if (card.classList.contains('raw-materials')) {
              card.style.display = '';
              card.style.opacity = '1';
              return;
            }
            
            // Count visible machines in this card
            const machinesInCard = card.querySelectorAll('.infra-machine-item');
            let visibleCount = 0;
            
            machinesInCard.forEach(machine => {
              const computedStyle = window.getComputedStyle(machine);
              if (computedStyle.display !== 'none') {
                visibleCount++;
              }
            });
            
            // Hide card if no machines are visible
            const cardParent = card.closest('.col-lg-6');
            if (visibleCount === 0) {
              if (cardParent) {
                cardParent.style.opacity = '0';
                setTimeout(() => {
                  cardParent.style.display = 'none';
                }, 300);
              }
            } else {
              // Show card if it has visible machines
              if (cardParent) {
                cardParent.style.display = '';
                setTimeout(() => {
                  cardParent.style.opacity = '1';
                }, 10);
              }
            }
          });
        }, 350); // Wait for machine animations to complete
      });
    });
  }

