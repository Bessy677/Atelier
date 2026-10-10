/**
 * ============================================
 * VENTAS.JS — Atelier Admin
 * Logic for the Sales Dashboard: read orders from localStorage,
 * calculate stats, render table, and enforce authentication.
 * ============================================
 */

(function () {
  'use strict';

  const dashboard = {
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

      this.tbody = document.getElementById('salesTableBody');
      this.loadData();
      this.render();
      
      // Listen for toggle status clicks
      if (this.tbody) {
        this.tbody.addEventListener('click', (e) => {
          if (e.target.classList.contains('toggle-status-btn')) {
            this.toggleOrderStatus(e.target.dataset.id);
          }
        });
      }
    },

    loadData() {
      try {
        this.orders = JSON.parse(localStorage.getItem('atelier_orders')) || [];
        // Sort newest first
        this.orders.sort((a, b) => new Date(b.date) - new Date(a.date));
      } catch {
        this.orders = [];
      }
    },

    saveData() {
      localStorage.setItem('atelier_orders', JSON.stringify(this.orders));
    },

    calculateStats() {
      let totalRevenue = 0;
      let totalYards = 0;

      this.orders.forEach(order => {
        totalRevenue += order.total;
        
        // Sum up yards in each order
        order.items.forEach(item => {
          totalYards += item.yards;
        });
      });

      const totalOrders = this.orders.length;
      const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return { totalRevenue, totalOrders, totalYards, avgTicket };
    },

    formatDate(isoString) {
      const date = new Date(isoString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    toggleOrderStatus(orderId) {
      const order = this.orders.find(o => o.id === orderId);
      if (order) {
        order.status = order.status === 'Pendiente' ? 'Completado' : 'Pendiente';
        this.saveData();
        this.render(); // re-render table
      }
    },

    render() {
      if (!this.tbody) return;

      // 1. Update Stats
      const stats = this.calculateStats();
      document.getElementById('statTotalVentas').textContent = `$${stats.totalRevenue.toFixed(2)}`;
      document.getElementById('statOrders').textContent = stats.totalOrders;
      document.getElementById('statYards').textContent = stats.totalYards;
      document.getElementById('statAvg').textContent = `$${stats.avgTicket.toFixed(2)}`;

      // 2. Render Table
      if (this.orders.length === 0) {
        this.tbody.innerHTML = `
          <tr>
            <td colspan="7">
              <div class="admin-table-empty">
                No hay ventas registradas aún. Las órdenes aparecerán aquí cuando los clientes completen el checkout.
              </div>
            </td>
          </tr>
        `;
        return;
      }

      this.tbody.innerHTML = this.orders.map(order => {
        const isCompleted = order.status === 'Completado';
        const badgeClass = isCompleted ? 'admin-badge--completed' : 'admin-badge--pending';
        
        // Summarize items e.g., "Seda Natural (2.5y), Lino (1y)"
        const itemSummary = order.items.map(i => `${i.name} (${i.yards}y)`).join(', ');

        return `
          <tr>
            <td><span class="admin-table__id">${order.id}</span></td>
            <td>${this.formatDate(order.date)}</td>
            <td>${order.customer}</td>
            <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${itemSummary}">
              ${itemSummary}
            </td>
            <td style="font-weight: 600;">$${order.total.toFixed(2)}</td>
            <td><span class="admin-badge ${badgeClass}">${order.status}</span></td>
            <td>
              <button class="admin-btn admin-btn--outline toggle-status-btn" data-id="${order.id}" style="padding: 4px 10px; font-size: 0.7rem;">
                ${isCompleted ? 'Marcar Pendiente' : 'Marcar Completado'}
              </button>
            </td>
          </tr>
        `;
      }).join('');
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
        
        // If we just logged in on the admin page, reload the dashboard logic
        dashboard.init();
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
      
      // If we logout while on an admin page, reload dashboard logic to hide it
      if (document.getElementById('adminContent')) {
        dashboard.init();
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
    dashboard.init(); // MUST run after auth.init
    globals.init();
  });

})();
