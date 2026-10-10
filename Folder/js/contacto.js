/**
 * ============================================
 * CONTACTO.JS — Atelier E-Commerce
 * Logic for the Contact page: form submission, success overlay.
 * ============================================
 */

(function () {
  'use strict';

  // ============================================
  // CONTACT FORM LOGIC
  // ============================================
  const contactForm = {
    init() {
      this.form = document.getElementById('contactForm');
      this.wrapper = document.getElementById('contactWrapper');
      this.submitBtn = document.getElementById('contactSubmit');
      this.resetBtn = document.getElementById('contactReset');

      if (!this.form || !this.wrapper) return;

      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });

      this.resetBtn?.addEventListener('click', () => {
        this.resetForm();
      });
    },

    handleSubmit() {
      // Set loading state
      const originalText = this.submitBtn.innerHTML;
      this.submitBtn.innerHTML = 'Enviando...';
      this.submitBtn.disabled = true;

      // Mock API call
      setTimeout(() => {
        // Show success state
        this.wrapper.classList.add('contact-form-wrapper--success');
        
        // Reset button state
        this.submitBtn.innerHTML = originalText;
        this.submitBtn.disabled = false;
      }, 1200);
    },

    resetForm() {
      this.form.reset();
      this.wrapper.classList.remove('contact-form-wrapper--success');
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
  // AUTH (shared logic)
  // ============================================
  const auth = {
    ADMIN_USER: 'admin',
    ADMIN_PASS: 'atelier2026',

    init() {
      this.modal = document.getElementById('loginModal');
      this.form = document.getElementById('loginForm');
      this.loginBtn = document.getElementById('loginBtn');
      this.errorMsg = document.getElementById('loginError');

      if (!this.modal || !this.form || !this.loginBtn) return;

      this.loginBtn.addEventListener('click', () => this.openModal());
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('modal-backdrop--open')) {
          this.closeModal();
        }
      });
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });

      this.checkSession();
    },

    openModal() {
      if (this.isLoggedIn()) {
        this.logout();
        return;
      }
      this.modal.classList.add('modal-backdrop--open');
      document.getElementById('loginUser')?.focus();
    },

    closeModal() {
      this.modal.classList.remove('modal-backdrop--open');
      this.form.reset();
      this.errorMsg?.classList.remove('modal__error--visible');
    },

    handleLogin() {
      const user = document.getElementById('loginUser').value.trim();
      const pass = document.getElementById('loginPass').value;

      if (user === this.ADMIN_USER && pass === this.ADMIN_PASS) {
        localStorage.setItem('atelier_session', JSON.stringify({
          user: user,
          role: 'admin',
          loginTime: Date.now()
        }));
        this.closeModal();
        this.applyAdminView();
      } else {
        this.errorMsg?.classList.add('modal__error--visible');
      }
    },

    isLoggedIn() {
      const session = localStorage.getItem('atelier_session');
      if (!session) return false;
      try {
        return JSON.parse(session).role === 'admin';
      } catch {
        return false;
      }
    },

    checkSession() {
      if (this.isLoggedIn()) this.applyAdminView();
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
  // MOBILE MENU
  // ============================================
  const mobileMenu = {
    init() {
      const hamburger = document.getElementById('hamburger');
      const menu = document.getElementById('navMenu');

      if (!hamburger || !menu) return;

      hamburger.addEventListener('click', () => {
        menu.classList.toggle('navbar__menu--open');
      });

      menu.querySelectorAll('.navbar__link, .navbar__cart, .navbar__login-btn').forEach((link) => {
        link.addEventListener('click', () => {
          menu.classList.remove('navbar__menu--open');
        });
      });
    }
  };

  // ============================================
  // INIT
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    contactForm.init();
    cart.init();
    auth.init();
    mobileMenu.init();
  });

})();
