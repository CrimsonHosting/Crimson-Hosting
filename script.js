/* ============================================================
   CRIMSON HOSTING — Script
   Navbar, mobile menu, scroll reveal, before/after compare,
   form validation, smooth scroll, dynamic year
   ============================================================ */

(() => {
  'use strict';

  /* -------- Dynamic year in footer -------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------- Sticky navbar on scroll -------- */
  const navbar = document.getElementById('navbar');
  const headerBrand = document.getElementById('headerBrand');
  const brandSlot = document.getElementById('brandSlot');
  let headerFrame = null;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const mapRange = (value, start, end) => clamp((value - start) / (end - start), 0, 1);
  const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

  const onScroll = () => {
    const scrollY = window.scrollY;

    if (scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    if (headerBrand && brandSlot) {
      // Brand collapses: starts at scrollY=180, fully gone by scrollY=600
      const collapseProgress = easeOutCubic(mapRange(scrollY, 180, 600));
      // Brand fades: starts a little after collapse begins
      const fadeProgress = easeOutCubic(mapRange(scrollY, 220, 580));

      const opacity = 1 - fadeProgress;
      const blur = fadeProgress * 4;
      const brandHeight = 110 - (collapseProgress * 110);
      const brandGap = 18 - (collapseProgress * 18);

      // Keep the navbar pinned to the top at all times — no drift
      navbar.style.transform = 'translateY(0)';

      // Collapse the brand slot height
      brandSlot.style.setProperty('--brand-height', `${Math.max(0, brandHeight).toFixed(2)}px`);
      brandSlot.style.setProperty('--brand-gap', `${Math.max(0, brandGap).toFixed(2)}px`);

      // Fade/blur the brand in place (no positional drift on the logo itself)
      headerBrand.style.setProperty('--brand-offset', '0px');
      headerBrand.style.setProperty('--brand-opacity', opacity.toFixed(3));
      headerBrand.style.setProperty('--brand-blur', `${blur.toFixed(2)}px`);
      headerBrand.style.pointerEvents = opacity < 0.08 ? 'none' : '';
    }

    headerFrame = null;
  };

  const scheduleHeaderUpdate = () => {
    if (headerFrame !== null) return;
    headerFrame = window.requestAnimationFrame(onScroll);
  };

  window.addEventListener('scroll', scheduleHeaderUpdate, { passive: true });
  onScroll();


  /* -------- Mobile menu toggle -------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* -------- Scroll reveal (IntersectionObserver) -------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* -------- Before/After compare sliders -------- */
  document.querySelectorAll('[data-compare]').forEach(initCompare);

  function initCompare(el) {
    const beforeWrap = el.querySelector('.before-wrap');
    const beforeImg = el.querySelector('.before');
    const slider = el.querySelector('.slider');
    let rect = el.getBoundingClientRect();

    const setPos = (pct) => {
      pct = Math.max(0, Math.min(100, pct));
      beforeWrap.style.width = pct + '%';
      slider.style.left = pct + '%';
      // Keep the "before" image aligned with the "after" image
      if (beforeImg) {
        const scale = 100 / Math.max(pct, 0.0001);
        beforeImg.style.width = (scale * 100) + '%';
        beforeImg.style.maxWidth = 'none';
      }
    };

    const updateFromEvent = (clientX) => {
      rect = el.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      setPos(pct);
    };

    // default position
    setPos(50);

    let dragging = false;
    const onDown = (e) => {
      dragging = true;
      el.style.cursor = 'ew-resize';
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      updateFromEvent(x);
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragging) {
        // hover-based preview
        if (!e.touches) {
          const x = e.clientX;
          updateFromEvent(x);
        }
        return;
      }
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      updateFromEvent(x);
    };
    const onUp = () => { dragging = false; };

    el.addEventListener('mousedown', onDown);
    el.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    el.addEventListener('touchstart', onDown, { passive: false });
    el.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      const x = e.touches[0].clientX;
      updateFromEvent(x);
      e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchend', onUp);

    // Reset to 50 when mouse leaves (nicer idle state)
    el.addEventListener('mouseleave', () => {
      if (!dragging) setPos(50);
    });
  }

  /* -------- Contact form validation -------- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  const showError = (field, msg) => {
    const input = form.querySelector(`[name="${field}"]`);
    const err = form.querySelector(`[data-error-for="${field}"]`);
    if (input) input.classList.add('invalid');
    if (err) err.textContent = msg;
  };
  const clearError = (field) => {
    const input = form.querySelector(`[name="${field}"]`);
    const err = form.querySelector(`[data-error-for="${field}"]`);
    if (input) input.classList.remove('invalid');
    if (err) err.textContent = '';
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  document.querySelectorAll('.team-card .socials a[href^="tel:"]').forEach(link => {
    const digits = (link.getAttribute('href') || '').replace(/\D/g, '');
    if (digits.length === 10) {
      link.textContent = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      clearError('name'); clearError('email'); clearError('message');
      successMsg.classList.remove('show');

      if (name.length < 2) {
        showError('name', 'Please enter your name.');
        valid = false;
      }
      if (!emailRegex.test(email)) {
        showError('email', 'Please enter a valid email address.');
        valid = false;
      }
      if (message.length < 10) {
        showError('message', 'Message should be at least 10 characters.');
        valid = false;
      }

      if (!valid) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      fetch('https://formspree.io/f/xrerewol', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      })
      .then(res => {
        if (res.ok) {
          successMsg.classList.add('show');
          form.reset();
        } else {
          alert('Something went wrong. Please try again or email us directly.');
        }
      })
      .catch(() => {
        alert('Network error. Please check your connection and try again.');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      });
    });

    // Clear errors as user types
    ['name', 'email', 'message'].forEach(f => {
      const input = form.querySelector(`[name="${f}"]`);
      if (input) input.addEventListener('input', () => clearError(f));
    });
  }

  /* -------- Collapsible pricing tiers (mobile only) -------- */
  const pricingTiers = document.querySelectorAll('.pricing .tier');

  // Open the popular (Silver) tier by default on mobile
  if (window.innerWidth <= 820) {
    const popular = document.querySelector('.pricing .tier.popular');
    if (popular) popular.classList.add('open');
  }

  pricingTiers.forEach(tier => {
    const summary = tier.querySelector('.tier-summary');
    if (!summary) return;
    summary.addEventListener('click', () => {
      if (window.innerWidth > 820) return;
      const isOpen = tier.classList.contains('open');
      // Close all tiers, then open the clicked one if it was closed
      pricingTiers.forEach(t => t.classList.remove('open'));
      if (!isOpen) tier.classList.add('open');
    });
  });

})();
