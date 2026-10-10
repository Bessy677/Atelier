/**
 * ============================================
 * GESTION.JS — Atelier Admin
 * Logic for the Inventory Dashboard: read products from localStorage,
 * allow inline editing of prices and stock, save changes.
 * ============================================
 */

(function () {
  'use strict';

  const inventory = {
    init() {
      this.adminContent = document.getElementById('adminContent');
      this.accessDenied = document.getElementById('accessDenied');
      
      // Enforce auth
      if (!auth.isLoggedIn()) {
        if (this.adminContent) this.adminContent.style.display = 'none';
        if (this.accessDenied) this.accessDenied.style.display = 'block';
        return;
      } else {
        if (this.adminContent) this.adminContent.style.display = 'block';
        if (this.accessDenied) this.accessDenied.style.display = 'none';
      }

      this.tbody = document.getElementById('inventoryTableBody');
      this.saveBtn = document.getElementById('saveBtn');
      
      this.loadData();
      this.render();
      
      if (this.saveBtn) {
        this.saveBtn.addEventListener('click', () => this.saveChanges());
      }

      // Add Product logic
      this.addBtn = document.getElementById('addProductBtn');
      this.addModal = document.getElementById('addProductModal');
      this.addForm = document.getElementById('addProductForm');
      this.cancelAddBtn = document.getElementById('cancelAddProduct');

      if (this.addBtn && this.addModal) {
        this.addBtn.addEventListener('click', () => this.addModal.classList.add('modal-backdrop--open'));
        this.cancelAddBtn.addEventListener('click', () => this.addModal.classList.remove('modal-backdrop--open'));
        this.addForm.addEventListener('submit', (e) => this.handleAddProduct(e));
      }
    },

    loadData() {
      try {
        this.products = JSON.parse(localStorage.getItem('atelier_products'));
        if (!this.products) {
          this.products = [];
        }
      } catch {
        this.products = [];
      }
    },

    handleAddProduct(e) {
      e.preventDefault();
      
      const name = document.getElementById('newProdName').value.trim();
      const category = document.getElementById('newProdCategory').value;
      const price = parseFloat(document.getElementById('newProdPrice').value);
      const stock = parseInt(document.getElementById('newProdStock').value, 10);
      const imageFile = document.getElementById('newProdImage').files[0];

      const newId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
      
      const newProduct = {
        id: newId,
        name: name,
        category: category,
        description: 'Nueva tela agregada desde el panel de administración.',
        pricePerYard: price,
        material: 'Especificar',
        width: '54 pulgadas',
        weight: 'Medio',
        stock: stock,
        badge: 'Nuevo',
        gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' // fallback
      };

      if (imageFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          newProduct.image = event.target.result; // Base64 string
          this.products.push(newProduct);
          this.finishAddProduct();
        };
        reader.readAsDataURL(imageFile);
      } else {
        this.products.push(newProduct);
        this.finishAddProduct();
      }
    },

    finishAddProduct() {
      localStorage.setItem('atelier_products', JSON.stringify(this.products));
      this.addForm.reset();
      this.addModal.classList.remove('modal-backdrop--open');
      this.render();
      alert('Producto agregado exitosamente.');
    },

    render() {
      if (!this.tbody) return;

      if (this.products.length === 0) {
        this.tbody.innerHTML = `
          <tr>
            <td colspan="6">
              <div class="admin-table-empty">
                No hay productos en la base de datos. Por favor visita el catálogo público al menos una vez para inicializar el inventario.
              </div>
            </td>
          </tr>
        `;
        return;
      }

      this.tbody.innerHTML = this.products.map(product => {
        const stockStatus = product.stock > 20 
          ? '<span class="admin-badge admin-badge--completed">En Stock</span>'
          : (product.stock > 0 
              ? '<span class="admin-badge admin-badge--pending">Bajo</span>'
              : '<span class="admin-badge" style="background:#f8d7da;color:#721c24;">Agotado</span>');

        return `
          <tr data-id="${product.id}">
            <td><span class="admin-table__id">PROD-${product.id.toString().padStart(3, '0')}</span></td>
            <td style="font-weight:500;">${product.name}</td>
            <td style="text-transform: capitalize;">${product.category}</td>
            <td>
              $<input type="number" class="admin-table-input price-input" value="${product.pricePerYard.toFixed(2)}" min="1" step="0.5">
            </td>
            <td>
              <input type="number" class="admin-table-input stock-input" value="${product.stock}" min="0" step="1">
            </td>
            <td>${stockStatus}</td>
          </tr>
        `;
      }).join('');
    },

    saveChanges() {
      if (!this.tbody) return;
      const rows = this.tbody.querySelectorAll('tr[data-id]');
      
      rows.forEach(row => {
        const id = parseInt(row.dataset.id, 10);
        const priceInput = row.querySelector('.price-input');
        const stockInput = row.querySelector('.stock-input');
        
        const product = this.products.find(p => p.id === id);
        if (product && priceInput && stockInput) {
          product.pricePerYard = parseFloat(priceInput.value) || product.pricePerYard;
          product.stock = parseInt(stockInput.value, 10) || 0;
        }
      });

      // Save back to localStorage
      localStorage.setItem('atelier_products', JSON.stringify(this.products));
      
      // Visual feedback
      const originalText = this.saveBtn.textContent;
      this.saveBtn.textContent = '¡Guardado!';
      this.saveBtn.style.background = 'var(--color-success)';
      this.saveBtn.style.color = 'white';
      
      setTimeout(() => {
        this.saveBtn.textContent = originalText;
        this.saveBtn.style.background = '';
        this.saveBtn.style.color = '';
        this.render(); // Re-render to update badges based on new stock
      }, 1500);
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

      // Special check for admin pages
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
        
        // Reload dashboard logic
        inventory.init();
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
      
      if (document.getElementById('adminContent')) {
        inventory.init();
      }
    }
  };

  // ============================================
  // CART BADGE & MOBILE MENU
  // ============================================
  const globals = {
    init() {
      this.updateBadge();
      this.initMobileMenu();
    },
    updateBadge() {
      const badge = document.getElementById('cartBadge');
      if (!badge) return;
      try {
        const items = JSON.parse(localStorage.getItem('atelier_cart')) || [];
        const count = items.length;
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
      } catch (e) {}
    },
    initMobileMenu() {
      const hamburger = document.getElementById('hamburger');
      const menu = document.getElementById('navMenu');
      if (hamburger && menu) {
        hamburger.addEventListener('click', () => {
          menu.classList.toggle('navbar__menu--open');
        });
        menu.querySelectorAll('.navbar__link, .navbar__cart, .navbar__login-btn').forEach((link) => {
          link.addEventListener('click', () => {
            menu.classList.remove('navbar__menu--open');
          });
        });
      }
    }
  };

  // ============================================
  // INIT
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    auth.init();
    inventory.init(); // MUST run after auth.init
    globals.init();
  });

})();
