/**
 * ============================================
 * MAIN.JS — Atelier E-Commerce
 * Home page logic: Carousel, Navbar, Login, Scroll Animations
 * ============================================
 */

(function () {
  'use strict';

  // ============================================
  // CAROUSEL
  // ============================================
  const carousel = {
    currentSlide: 0,
    totalSlides: 0,
    autoplayInterval: null,
    autoplayDelay: 6000,
    isTransitioning: false,

    init() {
      this.slides = document.querySelectorAll('.hero__slide');
      this.dots = document.querySelectorAll('.hero__dot');
      this.counter = document.getElementById('heroCounter');
      this.prevBtn = document.getElementById('heroPrev');
      this.nextBtn = document.getElementById('heroNext');
      this.totalSlides = this.slides.length;

      if (!this.totalSlides) return;

      // Arrow buttons
      this.prevBtn?.addEventListener('click', () => this.prev());
      this.nextBtn?.addEventListener('click', () => this.next());

      // Dot buttons
      this.dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          const index = parseInt(dot.dataset.dot, 10);
          this.goTo(index);
        });
      });

      // Pause on hover
      const hero = document.getElementById('hero');
      hero?.addEventListener('mouseenter', () => this.stopAutoplay());
      hero?.addEventListener('mouseleave', () => this.startAutoplay());

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });

      // Touch support
      this.initTouch(hero);

      this.startAutoplay();
    },

    initTouch(element) {
      let startX = 0;
      let endX = 0;

      element?.addEventListener('touchstart', (e) => {
        startX = e.changedTouches[0].screenX;
      }, { passive: true });

      element?.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].screenX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
          diff > 0 ? this.next() : this.prev();
        }
      }, { passive: true });
    },

    goTo(index) {
      if (this.isTransitioning || index === this.currentSlide) return;
      this.isTransitioning = true;

      // Remove active from current
      this.slides[this.currentSlide].classList.remove('hero__slide--active');
      this.dots[this.currentSlide]?.classList.remove('hero__dot--active');

      // Set new current
      this.currentSlide = index;

      // Add active to new
      this.slides[this.currentSlide].classList.add('hero__slide--active');
      this.dots[this.currentSlide]?.classList.add('hero__dot--active');

      // Re-trigger text animations
      this.reanimateContent(this.slides[this.currentSlide]);

      // Update counter
      this.updateCounter();

      // Reset autoplay
      this.stopAutoplay();
      this.startAutoplay();

      setTimeout(() => {
        this.isTransitioning = false;
      }, 650);
    },

    next() {
      const nextIndex = (this.currentSlide + 1) % this.totalSlides;
      this.goTo(nextIndex);
    },

    prev() {
      const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
      this.goTo(prevIndex);
    },

    reanimateContent(slide) {
      const elements = slide.querySelectorAll('.hero__tag, .hero__title, .hero__subtitle, .hero__cta');
      elements.forEach((el) => {
        el.style.animation = 'none';
        // Force reflow
        void el.offsetHeight;
        el.style.animation = '';
      });
    },

    updateCounter() {
      if (!this.counter) return;
      const current = String(this.currentSlide + 1).padStart(2, '0');
      const total = String(this.totalSlides).padStart(2, '0');
      this.counter.innerHTML = `<span class="hero__counter-current">${current}</span> / ${total}`;
    },

    startAutoplay() {
      this.stopAutoplay();
      this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
    },

    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    }
  };

  // ============================================
  // NAVBAR — Scroll behavior
  // ============================================
  const navbar = {
    el: null,

    init() {
      this.el = document.getElementById('navbar');
      if (!this.el) return;

      window.addEventListener('scroll', () => this.onScroll(), { passive: true });
      this.onScroll(); // Initial check
    },

    onScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 80) {
        this.el.classList.remove('navbar--transparent');
        this.el.classList.add('navbar--solid');
      } else {
        this.el.classList.remove('navbar--solid');
        this.el.classList.add('navbar--transparent');
      }
    }
  };

  // ============================================
  // MOBILE MENU
  // ============================================
  const mobileMenu = {
    init() {
      const hamburger = document.getElementById('hamburger');
      const menu = document.getElementById('navMenu');

      if (!hamburger || !menu) return;

      hamburger.addEventListener('click', () => {
        menu.classList.toggle('navbar__menu--open');
        hamburger.classList.toggle('active');
      });

      // Close menu when clicking a link
      menu.querySelectorAll('.navbar__link, .navbar__cart, .navbar__login-btn').forEach((link) => {
        link.addEventListener('click', () => {
          menu.classList.remove('navbar__menu--open');
          hamburger.classList.remove('active');
        });
      });
    }
  };

  // ============================================
  // LOGIN SYSTEM (localStorage simulated)
  // ============================================
  const auth = {
    // Simulated credentials — will be replaced by backend
    ADMIN_USER: 'admin',
    ADMIN_PASS: 'atelier2026',

    init() {
      this.modal = document.getElementById('loginModal');
      this.form = document.getElementById('loginForm');
      this.loginBtn = document.getElementById('loginBtn');
      this.errorMsg = document.getElementById('loginError');

      if (!this.modal || !this.form || !this.loginBtn) return;

      // Open modal
      this.loginBtn.addEventListener('click', () => this.openModal());

      // Close modal on backdrop click
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });

      // Close modal on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.closeModal();
      });

      // Form submission
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });

      // Check if already logged in
      this.checkSession();
    },

    openModal() {
      if (this.isLoggedIn()) {
        // Already logged in → logout
        this.logout();
        return;
      }
      this.modal.classList.add('modal-backdrop--open');
      document.getElementById('loginUser')?.focus();
    },

    closeModal() {
      this.modal.classList.remove('modal-backdrop--open');
      this.form.reset();
      this.hideError();
    },

    handleLogin() {
      const user = document.getElementById('loginUser').value.trim();
      const pass = document.getElementById('loginPass').value;

      if (user === this.ADMIN_USER && pass === this.ADMIN_PASS) {
        // Save session
        localStorage.setItem('atelier_session', JSON.stringify({
          user: user,
          role: 'admin',
          loginTime: Date.now()
        }));

        this.closeModal();
        this.applyAdminView();
      } else {
        this.showError();
      }
    },

    showError() {
      this.errorMsg?.classList.add('modal__error--visible');
      // Shake animation
      this.form.style.animation = 'none';
      void this.form.offsetHeight;
      this.form.style.animation = 'shake 0.4s ease';
    },

    hideError() {
      this.errorMsg?.classList.remove('modal__error--visible');
    },

    isLoggedIn() {
      const session = localStorage.getItem('atelier_session');
      if (!session) return false;
      try {
        const data = JSON.parse(session);
        return data.role === 'admin';
      } catch {
        return false;
      }
    },

    checkSession() {
      if (this.isLoggedIn()) {
        this.applyAdminView();
      }
    },

    applyAdminView() {
      document.body.classList.add('is-admin');
      this.loginBtn.textContent = 'Salir';
    },

    logout() {
      localStorage.removeItem('atelier_session');
      document.body.classList.remove('is-admin');
      this.loginBtn.textContent = 'Acceder';
    }
  };

  // ============================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================
  const scrollReveal = {
    init() {
      const reveals = document.querySelectorAll('.reveal');
      if (!reveals.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal--visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: '0px 0px -60px 0px'
        }
      );

      reveals.forEach((el) => observer.observe(el));
    }
  };

  // ============================================
  // CART BADGE (localStorage)
  // ============================================
  const cart = {
    init() {
      this.badge = document.getElementById('cartBadge');
      this.updateBadge();
    },

    getItems() {
      try {
        return JSON.parse(localStorage.getItem('atelier_cart')) || [];
      } catch {
        return [];
      }
    },

    updateBadge() {
      if (!this.badge) return;
      const items = this.getItems();
      const count = items.length;
      this.badge.textContent = count;
      this.badge.style.display = count > 0 ? 'flex' : 'none';
    }
  };

  // ============================================
  // INITIALIZE EVERYTHING
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    carousel.init();
    navbar.init();
    mobileMenu.init();
    auth.init();
    scrollReveal.init();
    cart.init();
  });

})();
