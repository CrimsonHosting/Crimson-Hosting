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
  const onScroll = () => {
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

 const logo = document.getElementById('logo');
  const onScroll2 = () => {
    if (window.scrollY > 67) logo.classList.add('scrolled');
    else logo.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll2, { passive: true });
  onScroll2();


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

      // Placeholder success — wire this up to your backend / email service
      successMsg.classList.add('show');
      form.reset();
    });

    // Clear errors as user types
    ['name', 'email', 'message'].forEach(f => {
      const input = form.querySelector(`[name="${f}"]`);
      if (input) input.addEventListener('input', () => clearError(f));
    });
  }
})();
