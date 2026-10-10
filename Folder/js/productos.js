/**
 * ============================================
 * PRODUCTOS.JS — Atelier E-Commerce
 * Product catalog, filters, search, yard calculator, cart
 * ============================================
 */

(function () {
  'use strict';

  // ============================================
  // PRODUCT DATA
  // ============================================
  let PRODUCTS = JSON.parse(localStorage.getItem('atelier_products'));
  if (!PRODUCTS) {
    PRODUCTS = [
    {
      id: 1,
      name: 'Seda Imperial',
      category: 'seda',
      description: 'Seda natural de alta calidad con brillo sutil y caída elegante. Ideal para vestidos de noche y blusas de gala.',
      pricePerYard: 45.00,
      material: '100% Seda Natural',
      width: '45 pulgadas',
      weight: 'Ligero (19 momme)',
      stock: 120,
      badge: 'Premium',
      gradient: 'linear-gradient(135deg, #d4c5a9 0%, #e8dece 40%, #c9b99a 70%, #a89279 100%)'
    },
    {
      id: 2,
      name: 'Algodón Egipcio Pima',
      category: 'algodón',
      description: 'Algodón de fibra extra larga, suave al tacto con una transpirabilidad excepcional. Perfecto para camisas y ropa casual.',
      pricePerYard: 22.50,
      material: '100% Algodón Egipcio',
      width: '60 pulgadas',
      weight: 'Medio (150 GSM)',
      stock: 200,
      badge: null,
      gradient: 'linear-gradient(140deg, #f0ece8 0%, #e0d8cc 40%, #c9b99a 100%)'
    },
    {
      id: 3,
      name: 'Lino Belga Natural',
      category: 'lino',
      description: 'Lino europeo de textura refinada con su característico aspecto ligeramente rústico. Excelente para trajes de verano.',
      pricePerYard: 35.00,
      material: '100% Lino Europeo',
      width: '54 pulgadas',
      weight: 'Medio (180 GSM)',
      stock: 85,
      badge: null,
      gradient: 'linear-gradient(130deg, #c9b99a 0%, #b8a888 40%, #a89279 70%, #8b7355 100%)'
    },
    {
      id: 4,
      name: 'Satén Duquesa',
      category: 'satén',
      description: 'Satén de alto gramaje con brillo intenso y cuerpo firme. La elección perfecta para vestidos de novia y alta costura.',
      pricePerYard: 55.00,
      material: 'Satén de Seda/Poliéster',
      width: '50 pulgadas',
      weight: 'Pesado (300 GSM)',
      stock: 60,
      badge: 'Best Seller',
      gradient: 'linear-gradient(145deg, #f7f4f0 0%, #e8dece 30%, #d4b876 60%, #b8963e 100%)'
    },
    {
      id: 5,
      name: 'Encaje Chantilly',
      category: 'encaje',
      description: 'Encaje francés delicado con patrones florales intrincados. Ideal para detalles de alta costura y vestidos de novia.',
      pricePerYard: 72.00,
      material: 'Nylon/Seda',
      width: '52 pulgadas',
      weight: 'Ultra Ligero',
      stock: 40,
      badge: 'Exclusivo',
      gradient: 'linear-gradient(150deg, #f0ece8 0%, #e8dece 50%, #d4c5a9 100%)'
    },
    {
      id: 6,
      name: 'Terciopelo Venecia',
      category: 'terciopelo',
      description: 'Terciopelo de seda con pelo corto y denso que captura la luz de forma espectacular. Para abrigos y piezas de lujo.',
      pricePerYard: 65.00,
      material: 'Seda/Viscosa',
      width: '48 pulgadas',
      weight: 'Pesado (350 GSM)',
      stock: 45,
      badge: 'Nuevo',
      gradient: 'linear-gradient(135deg, #2d2d2d 0%, #4a3f33 40%, #6b5b4e 70%, #8b7355 100%)'
    },
    {
      id: 7,
      name: 'Seda Charmeuse',
      category: 'seda',
      description: 'Seda con acabado satinado por un lado y mate por el otro. Versatilidad y lujo en cada yarda.',
      pricePerYard: 48.00,
      material: '100% Seda Charmeuse',
      width: '45 pulgadas',
      weight: 'Ligero (22 momme)',
      stock: 95,
      badge: null,
      gradient: 'linear-gradient(160deg, #e8dece 0%, #d4c5a9 40%, #c9b99a 70%, #b8963e 100%)'
    },
    {
      id: 8,
      name: 'Algodón Orgánico Japonés',
      category: 'algodón',
      description: 'Algodón cultivado sin pesticidas con una textura suave y natural. Teñido con tintes vegetales ecológicos.',
      pricePerYard: 28.00,
      material: '100% Algodón Orgánico',
      width: '58 pulgadas',
      weight: 'Medio (140 GSM)',
      stock: 150,
      badge: 'Eco',
      gradient: 'linear-gradient(140deg, #f7f4f0 0%, #e0d8cc 50%, #c9b99a 80%, #a89279 100%)'
    },
    {
      id: 9,
      name: 'Lino Irlandés Premium',
      category: 'lino',
      description: 'Lino de la más alta calidad con un tacto fresco y aspecto impecable. Tradición artesanal de siglos.',
      pricePerYard: 42.00,
      material: '100% Lino Irlandés',
      width: '56 pulgadas',
      weight: 'Medio-Pesado (200 GSM)',
      stock: 70,
      badge: 'Premium',
      gradient: 'linear-gradient(130deg, #b5b5b5 0%, #c9b99a 40%, #a89279 70%, #7a6a55 100%)'
    },
    {
      id: 10,
      name: 'Satén Crêpe',
      category: 'satén',
      description: 'Combinación perfecta de brillo satinado y textura crêpe. Fluido y versátil para cualquier diseño elegante.',
      pricePerYard: 38.00,
      material: 'Poliéster Premium',
      width: '58 pulgadas',
      weight: 'Medio (160 GSM)',
      stock: 110,
      badge: null,
      gradient: 'linear-gradient(145deg, #f0ece8 0%, #d4c5a9 40%, #c9b99a 70%, #b8a888 100%)'
    },
    {
      id: 11,
      name: 'Encaje Guipure',
      category: 'encaje',
      description: 'Encaje grueso con diseños geométricos y florales en relieve. Sin malla de fondo, perfecto para overlays.',
      pricePerYard: 58.00,
      material: 'Poliéster/Algodón',
      width: '48 pulgadas',
      weight: 'Medio',
      stock: 55,
      badge: null,
      gradient: 'linear-gradient(135deg, #f7f4f0 0%, #f0ece8 40%, #e8dece 70%, #d4c5a9 100%)'
    },
    {
      id: 12,
      name: 'Terciopelo Stretch',
      category: 'terciopelo',
      description: 'Terciopelo moderno con 5% elastano para máxima comodidad. Ideal para prendas ajustadas con acabado lujoso.',
      pricePerYard: 42.00,
      material: 'Poliéster/Elastano',
      width: '58 pulgadas',
      weight: 'Medio (250 GSM)',
      stock: 80,
      badge: null,
      gradient: 'linear-gradient(150deg, #1a1a1a 0%, #3a2e22 40%, #5c4f3d 70%, #7a6a55 100%)'
    }
  ];
    localStorage.setItem('atelier_products', JSON.stringify(PRODUCTS));
  }

  // ============================================
  // CATALOG RENDERER
  // ============================================
  const catalog = {
    activeFilter: 'all',
    searchQuery: '',

    init() {
      this.grid = document.getElementById('catalogGrid');
      this.resultsEl = document.getElementById('catalogResults');
      this.searchInput = document.getElementById('catalogSearch');
      this.filtersContainer = document.getElementById('catalogFilters');

      if (!this.grid) return;

      // Render initial products
      this.render();

      // Filter buttons
      this.filtersContainer?.addEventListener('click', (e) => {
        const btn = e.target.closest('.catalog__filter-btn');
        if (!btn) return;

        this.filtersContainer.querySelectorAll('.catalog__filter-btn').forEach((b) =>
          b.classList.remove('catalog__filter-btn--active')
        );
        btn.classList.add('catalog__filter-btn--active');

        this.activeFilter = btn.dataset.category;
        this.render();
      });

      // Search
      this.searchInput?.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        this.render();
      });
    },

    getFilteredProducts() {
      return PRODUCTS.filter((product) => {
        const matchesCategory = this.activeFilter === 'all' || product.category === this.activeFilter;
        const matchesSearch = !this.searchQuery ||
          product.name.toLowerCase().includes(this.searchQuery) ||
          product.category.toLowerCase().includes(this.searchQuery) ||
          product.description.toLowerCase().includes(this.searchQuery) ||
          product.material.toLowerCase().includes(this.searchQuery);
        return matchesCategory && matchesSearch;
      });
    },

    render() {
      const filtered = this.getFilteredProducts();

      // Update results count
      if (this.resultsEl) {
        this.resultsEl.innerHTML = `Mostrando <strong>${filtered.length}</strong> de <strong>${PRODUCTS.length}</strong> telas`;
      }

      // Empty state
      if (filtered.length === 0) {
        this.grid.innerHTML = `
          <div class="catalog__empty">
            <div class="catalog__empty-icon">🔍</div>
            <p class="catalog__empty-text">No se encontraron telas con ese criterio. Prueba con otro filtro o búsqueda.</p>
          </div>
        `;
        return;
      }

      // Render cards
      this.grid.innerHTML = filtered.map((product) => this.renderCard(product)).join('');

      // Attach click events to cards
      this.grid.querySelectorAll('.product-card').forEach((card) => {
        card.addEventListener('click', (e) => {
          // Don't open modal if clicking the quick-add button
          if (e.target.closest('.product-card__add-btn')) return;

          const productId = parseInt(card.dataset.productId, 10);
          const product = PRODUCTS.find((p) => p.id === productId);
          if (product) productDetail.open(product);
        });
      });

      // Quick add buttons
      this.grid.querySelectorAll('.product-card__add-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const productId = parseInt(btn.dataset.productId, 10);
          const product = PRODUCTS.find((p) => p.id === productId);
          if (product) {
            cart.addItem(product, 1);
            toast.show(`${product.name} — 1 yarda agregada`);
          }
        });
      });
    },

    renderCard(product) {
      const badgeHTML = product.badge
        ? `<span class="product-card__badge">${product.badge}</span>`
        : '';

      return `
        <article class="product-card" data-product-id="${product.id}">
          <div class="product-card__image">
            ${badgeHTML}
            ${product.image 
              ? `<img src="${product.image}" alt="${product.name}" class="product-card__image-placeholder" style="object-fit: cover;">` 
              : `<div class="product-card__image-placeholder" style="background: ${product.gradient}"></div>`}
            <span class="product-card__quick-view">Ver Detalle</span>
          </div>
          <div class="product-card__info">
            <span class="product-card__category">${product.category}</span>
            <h3 class="product-card__name">${product.name}</h3>
            <p class="product-card__desc">${product.description}</p>
            <div class="product-card__footer">
              <div>
                <span class="product-card__price">$${product.pricePerYard.toFixed(2)}</span>
                <span class="product-card__price-unit"> / yarda</span>
              </div>
              <button class="product-card__add-btn" data-product-id="${product.id}" aria-label="Agregar ${product.name} al carrito">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </article>
      `;
    }
  };

  // ============================================
  // PRODUCT DETAIL MODAL + YARD CALCULATOR
  // ============================================
  const productDetail = {
    currentProduct: null,

    init() {
      this.modal = document.getElementById('productModal');
      this.closeBtn = document.getElementById('productModalClose');
      this.yardInput = document.getElementById('yardInput');
      this.yardMinus = document.getElementById('yardMinus');
      this.yardPlus = document.getElementById('yardPlus');
      this.yardTotal = document.getElementById('yardTotal');
      this.addToCartBtn = document.getElementById('addToCartBtn');

      if (!this.modal) return;

      // Close modal
      this.closeBtn?.addEventListener('click', () => this.close());
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.modal.classList.contains('product-modal--open')) {
          this.close();
        }
      });

      // Stepper buttons
      this.yardMinus?.addEventListener('click', () => {
        let val = parseFloat(this.yardInput.value) || 1;
        val = Math.max(0.5, val - 0.5);
        this.yardInput.value = val;
        this.updateTotal();
      });

      this.yardPlus?.addEventListener('click', () => {
        let val = parseFloat(this.yardInput.value) || 1;
        val = Math.min(100, val + 0.5);
        this.yardInput.value = val;
        this.updateTotal();
      });

      // Direct input
      this.yardInput?.addEventListener('input', () => this.updateTotal());
      this.yardInput?.addEventListener('change', () => {
        let val = parseFloat(this.yardInput.value);
        if (isNaN(val) || val < 0.5) val = 0.5;
        if (val > 100) val = 100;
        // Round to nearest 0.5
        val = Math.round(val * 2) / 2;
        this.yardInput.value = val;
        this.updateTotal();
      });

      // Add to cart
      this.addToCartBtn?.addEventListener('click', () => {
        if (!this.currentProduct) return;
        const yards = parseFloat(this.yardInput.value) || 1;
        cart.addItem(this.currentProduct, yards);
        toast.show(`${this.currentProduct.name} — ${yards} yarda${yards !== 1 ? 's' : ''} agregada${yards !== 1 ? 's' : ''}`);
        this.close();
      });
    },

    open(product) {
      this.currentProduct = product;

      // Populate modal
      const modalImageContainer = document.getElementById('modalImage');
      if (product.image) {
        modalImageContainer.style.background = 'none';
        modalImageContainer.innerHTML = `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
      } else {
        modalImageContainer.innerHTML = '';
        modalImageContainer.style.background = product.gradient;
      }
      document.getElementById('modalCategory').textContent = product.category;
      document.getElementById('modalName').textContent = product.name;
      document.getElementById('modalDesc').textContent = product.description;
      document.getElementById('modalMaterial').textContent = product.material;
      document.getElementById('modalWidth').textContent = product.width;
      document.getElementById('modalWeight').textContent = product.weight;
      document.getElementById('modalStock').textContent = `${product.stock} yardas`;
      document.getElementById('modalPrice').textContent = `$${product.pricePerYard.toFixed(2)}`;

      // Reset calculator
      this.yardInput.value = 1;
      this.updateTotal();

      // Show modal
      this.modal.classList.add('product-modal--open');
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.modal.classList.remove('product-modal--open');
      document.body.style.overflow = '';
      this.currentProduct = null;
    },

    updateTotal() {
      if (!this.currentProduct) return;
      const yards = parseFloat(this.yardInput.value) || 0;
      const total = this.currentProduct.pricePerYard * yards;
      this.yardTotal.textContent = `$${total.toFixed(2)}`;
    }
  };

  // ============================================
  // CART (localStorage)
  // ============================================
  const cart = {
    STORAGE_KEY: 'atelier_cart',

    init() {
      this.badge = document.getElementById('cartBadge');
      this.updateBadge();
    },

    getItems() {
      try {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
      } catch {
        return [];
      }
    },

    saveItems(items) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    },

    addItem(product, yards) {
      const items = this.getItems();

      // Check if same product already in cart
      const existing = items.find((item) => item.productId === product.id);
      if (existing) {
        existing.yards += yards;
        existing.totalPrice = existing.yards * product.pricePerYard;
      } else {
        items.push({
          productId: product.id,
          name: product.name,
          category: product.category,
          pricePerYard: product.pricePerYard,
          yards: yards,
          totalPrice: product.pricePerYard * yards,
          gradient: product.gradient,
          addedAt: Date.now()
        });
      }

      this.saveItems(items);
      this.updateBadge();
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
  // TOAST NOTIFICATION
  // ============================================
  const toast = {
    timeout: null,

    init() {
      this.el = document.getElementById('toast');
      this.messageEl = document.getElementById('toastMessage');
    },

    show(message, duration = 3000) {
      if (!this.el) return;
      if (this.timeout) clearTimeout(this.timeout);

      this.messageEl.textContent = message;
      this.el.classList.add('toast--visible');

      this.timeout = setTimeout(() => {
        this.el.classList.remove('toast--visible');
      }, duration);
    }
  };

  // ============================================
  // AUTH (shared logic from main.js)
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
    catalog.init();
    productDetail.init();
    cart.init();
    toast.init();
    auth.init();
    mobileMenu.init();
  });

})();
