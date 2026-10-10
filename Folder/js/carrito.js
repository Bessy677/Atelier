/**
 * ============================================
 * CARRITO.JS — Atelier E-Commerce
 * Logic for the shopping cart page: render items, update quantities,
 * calculate totals, remove items, and mock checkout.
 * ============================================
 */

(function () {
  'use strict';

  const cartPage = {
    STORAGE_KEY: 'atelier_cart',
    items: [],

    init() {
      this.container = document.getElementById('cartContainer');
      this.badge = document.getElementById('cartBadge');
      
      if (!this.container) return;

      this.loadItems();
      this.render();

      // Delegate events for cart actions
      this.container.addEventListener('click', (e) => this.handleActions(e));
      this.container.addEventListener('input', (e) => this.handleInput(e));
      this.container.addEventListener('change', (e) => this.handleChange(e));
    },

    loadItems() {
      try {
        this.items = JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
      } catch {
        this.items = [];
      }
      this.updateBadge();
    },

    saveItems() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
      this.updateBadge();
      this.renderSummary(); // Re-render summary on save
    },

    updateBadge() {
      if (!this.badge) return;
      const count = this.items.length;
      this.badge.textContent = count;
      this.badge.style.display = count > 0 ? 'flex' : 'none';
    },

    // --- Action Handlers ---
    handleActions(e) {
      const target = e.target;
      
      // Decrease quantity
      const minusBtn = target.closest('.cart-item__stepper-btn[data-action="minus"]');
      if (minusBtn) {
        const id = parseInt(minusBtn.dataset.id, 10);
        this.updateQuantity(id, -0.5);
        return;
      }

      // Increase quantity
      const plusBtn = target.closest('.cart-item__stepper-btn[data-action="plus"]');
      if (plusBtn) {
        const id = parseInt(plusBtn.dataset.id, 10);
        this.updateQuantity(id, 0.5);
        return;
      }

      // Remove item
      const removeBtn = target.closest('.cart-item__remove');
      if (removeBtn) {
        const id = parseInt(removeBtn.dataset.id, 10);
        this.removeItem(id, removeBtn.closest('.cart-item'));
        return;
      }

      // Clear all items
      const clearBtn = target.closest('.cart-items__clear-btn');
      if (clearBtn) {
        if(confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
          this.items = [];
          this.saveItems();
          this.render();
        }
        return;
      }

      // Checkout
      const checkoutBtn = target.closest('#checkoutBtn');
      if (checkoutBtn) {
        this.processCheckout();
      }
    },

    handleInput(e) {
      if (e.target.classList.contains('cart-item__qty-input')) {
        // Just allow typing, handle validation on change
      }
    },

    handleChange(e) {
      if (e.target.classList.contains('cart-item__qty-input')) {
        const id = parseInt(e.target.dataset.id, 10);
        let val = parseFloat(e.target.value);
        if (isNaN(val) || val < 0.5) val = 0.5;
        if (val > 100) val = 100;
        val = Math.round(val * 2) / 2; // Round to 0.5
        
        this.setQuantity(id, val);
      }
    },

    // --- State Updates ---
    updateQuantity(id, delta) {
      const item = this.items.find(i => i.productId === id);
      if (!item) return;

      let newYards = item.yards + delta;
      if (newYards < 0.5) newYards = 0.5;
      if (newYards > 100) newYards = 100;
      
      this.setQuantity(id, newYards);
    },

    setQuantity(id, yards) {
      const item = this.items.find(i => i.productId === id);
      if (!item) return;

      item.yards = yards;
      item.totalPrice = item.pricePerYard * yards;
      this.saveItems();
      
      // Update DOM for this specific item without re-rendering everything
      const input = this.container.querySelector(`.cart-item__qty-input[data-id="${id}"]`);
      const priceTotal = this.container.querySelector(`.cart-item__total[data-id="${id}"]`);
      
      if (input) input.value = yards;
      if (priceTotal) priceTotal.textContent = `$${item.totalPrice.toFixed(2)}`;
    },

    removeItem(id, element) {
      // Animation out
      element.classList.add('cart-item--removing');
      
      setTimeout(() => {
        this.items = this.items.filter(i => i.productId !== id);
        this.saveItems();
        if (this.items.length === 0) {
          this.render(); // Show empty state
        } else {
          element.remove();
          this.updateItemsHeader(); // Update count text
        }
      }, 400); // Matches CSS transition duration
    },

    // --- Rendering ---
    render() {
      if (this.items.length === 0) {
        this.renderEmpty();
        return;
      }

      this.container.innerHTML = `
        <div class="cart-items" id="cartItemsList">
          ${this.renderItemsHeader()}
          ${this.items.map(item => this.renderItemCard(item)).join('')}
        </div>
        <div class="cart-summary" id="cartSummary">
          <!-- Handled by renderSummary -->
        </div>
      `;
      this.renderSummary();
    },

    renderEmpty() {
      this.container.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2 class="cart-empty__title">Tu carrito está vacío</h2>
          <p class="cart-empty__text">Aún no has seleccionado ninguna tela. Explora nuestro catálogo y encuentra las telas perfectas para tu próximo diseño a medida.</p>
          <a href="productos.html" class="cart-empty__cta">Ver Catálogo</a>
        </div>
      `;
    },

    renderItemsHeader() {
      return `
        <div class="cart-items__header">
          <div>
            <h2 class="cart-items__title">Tus Telas</h2>
            <span class="cart-items__count" id="cartItemsCount">${this.items.length} artículo(s)</span>
          </div>
          <button class="cart-items__clear-btn" type="button">Vaciar Carrito</button>
        </div>
      `;
    },

    updateItemsHeader() {
      const countEl = document.getElementById('cartItemsCount');
      if (countEl) countEl.textContent = `${this.items.length} artículo(s)`;
    },

    renderItemCard(item) {
      return `
        <article class="cart-item">
          <div class="cart-item__image">
            ${item.image 
              ? `<img src="${item.image}" alt="${item.name}" class="cart-item__image-placeholder" style="object-fit: cover;">`
              : `<div class="cart-item__image-placeholder" style="background: ${item.gradient}"></div>`}
          </div>
          <div class="cart-item__details">
            <div class="cart-item__category">${item.category}</div>
            <h3 class="cart-item__name">${item.name}</h3>
            <div class="cart-item__unit-price">$${item.pricePerYard.toFixed(2)} / yarda</div>
          </div>
          <div class="cart-item__actions">
            <div class="cart-item__total" data-id="${item.productId}">$${item.totalPrice.toFixed(2)}</div>
            <div class="cart-item__stepper">
              <button class="cart-item__stepper-btn" data-action="minus" data-id="${item.productId}" aria-label="Disminuir">−</button>
              <input type="number" class="cart-item__qty-input" data-id="${item.productId}" value="${item.yards}" min="0.5" max="100" step="0.5" aria-label="Cantidad">
              <button class="cart-item__stepper-btn" data-action="plus" data-id="${item.productId}" aria-label="Aumentar">+</button>
            </div>
            <button class="cart-item__remove" data-id="${item.productId}">Eliminar</button>
          </div>
        </article>
      `;
    },

    renderSummary() {
      const summaryContainer = document.getElementById('cartSummary');
      if (!summaryContainer) return;

      const subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
      // Flat shipping rate for demo purposes
      const shipping = subtotal > 150 ? 0 : 15.00;
      const total = subtotal + shipping;

      summaryContainer.innerHTML = `
        <h3 class="cart-summary__title">Resumen del Pedido</h3>
        
        <div class="cart-summary__row">
          <span class="cart-summary__label">Subtotal</span>
          <span class="cart-summary__value">$${subtotal.toFixed(2)}</span>
        </div>
        
        <div class="cart-summary__row">
          <span class="cart-summary__label">Envío ${shipping === 0 ? '(Gratis > $150)' : ''}</span>
          <span class="cart-summary__value">${shipping === 0 ? 'Gratis' : '$' + shipping.toFixed(2)}</span>
        </div>
        
        <div class="cart-summary__divider"></div>
        
        <div class="cart-summary__total-row">
          <span class="cart-summary__total-label">Total</span>
          <span class="cart-summary__total-value">$${total.toFixed(2)}</span>
        </div>
        
        <button class="cart-summary__checkout" id="checkoutBtn" ${this.items.length === 0 ? 'disabled' : ''}>
          Proceder al Pago
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0110 0v4"></path>
          </svg>
        </button>
        <a href="productos.html" class="cart-summary__continue">o continuar comprando</a>
        
        <div class="cart-summary__secure">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          Pago seguro encriptado
        </div>
      `;
    },

    // --- Mock Checkout ---
    processCheckout() {
      const btn = document.getElementById('checkoutBtn');
      if (btn) {
        btn.innerHTML = 'Procesando...';
        btn.disabled = true;
      }

      // Simulate API call
      setTimeout(() => {
        // Success
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        
        // Before clearing the cart, we might want to save the order for the Admin view.
        // Let's create an orders array in localStorage.
        this.saveOrder(orderId);

        // Clear cart
        this.items = [];
        localStorage.removeItem(this.STORAGE_KEY);
        this.updateBadge();
        
        // Show success overlay
        const overlay = document.getElementById('checkoutSuccess');
        const idDisplay = document.getElementById('orderIdDisplay');
        if (idDisplay) idDisplay.textContent = `Orden #${orderId}`;
        if (overlay) overlay.classList.add('checkout-success--open');
        
      }, 1500);
    },

    saveOrder(orderId) {
      const subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
      const shipping = subtotal > 150 ? 0 : 15.00;
      
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        customer: 'Cliente Web',
        items: [...this.items],
        total: subtotal + shipping,
        status: 'Pendiente'
      };

      try {
        const orders = JSON.parse(localStorage.getItem('atelier_orders')) || [];
        orders.push(newOrder);
        localStorage.setItem('atelier_orders', JSON.stringify(orders));
      } catch (e) {
        console.error("Error saving order:", e);
      }
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
    cartPage.init();
    auth.init();
    mobileMenu.init();
  });

})();
