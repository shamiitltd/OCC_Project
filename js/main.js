/* ============================================================
   OFFCAMPUSCAREER — Main.js v2.0 (Shared UI Logic)
   Navbar, theme, scroll-reveal, toasts, modals, counters, search
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  OC2.init();
});

const OC2 = {
  init() {
    this.Theme.init();
    this.Navbar.init();
    this.ScrollReveal.init();
    this.Toast.init();
    this.ActivePage.init();
    this.Counter.initAll();
    this.Notifications.init();
  },


  /* ── Theme Toggle ── */
  Theme: {
    STORAGE_KEY: 'oc2_theme',
    init() {
      const saved = localStorage.getItem(this.STORAGE_KEY) || 'dark';
      this.apply(saved);
      document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
          const current = document.documentElement.getAttribute('data-theme');
          this.apply(current === 'dark' ? 'light' : 'dark');
        });
      });
    },
    apply(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.STORAGE_KEY, theme);
      document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
        btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      });
    }
  },

  /* ── Navbar ── */
  Navbar: {
    init() {
      const burger = document.getElementById('burger');
      const mobileNav = document.getElementById('mobile-nav');
      const mobileOverlay = document.getElementById('mobile-nav-overlay');
      const navbar = document.querySelector('.navbar');

      // Mobile menu open/close
      if (burger && mobileNav) {
        burger.addEventListener('click', () => this.toggleMobileMenu());

        if (mobileOverlay) {
          mobileOverlay.addEventListener('click', () => this.closeMobileMenu());
        }

        // Close on link click
        mobileNav.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => this.closeMobileMenu());
        });

        // ESC to close
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') this.closeMobileMenu();
        });
      }

      // Scroll shadow
      if (navbar) {
        window.addEventListener('scroll', () => {
          navbar.classList.toggle('scrolled', window.scrollY > 20);
        }, { passive: true });
      }

      // Notification panel
      const notifBtn = document.getElementById('notif-btn');
      if (notifBtn) {
        notifBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const panel = document.getElementById('notif-panel');
          if (panel) panel.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
          const panel = document.getElementById('notif-panel');
          if (panel && !notifBtn.contains(e.target) && !panel.contains(e.target)) {
            panel.classList.remove('open');
          }
        });
      }
    },

    toggleMobileMenu() {
      const burger = document.getElementById('burger');
      const mobileNav = document.getElementById('mobile-nav');
      const overlay = document.getElementById('mobile-nav-overlay');
      if (burger) burger.classList.toggle('open');
      if (mobileNav) mobileNav.classList.toggle('open');
      if (overlay) overlay.classList.toggle('active');
      document.body.style.overflow = mobileNav?.classList.contains('open') ? 'hidden' : '';
    },

    closeMobileMenu() {
      const burger = document.getElementById('burger');
      const mobileNav = document.getElementById('mobile-nav');
      const overlay = document.getElementById('mobile-nav-overlay');
      if (burger) burger.classList.remove('open');
      if (mobileNav) mobileNav.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  /* ── Active Page Highlighting ── */
  ActivePage: {
    init() {
      const currentPage = window.location.pathname.split('/').pop() || 'index.html';
      document.querySelectorAll('.nav-links a, #mobile-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  },

  /* ── Scroll Reveal ── */
  ScrollReveal: {
    init() {
      const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      if (!elements.length) return;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      elements.forEach(el => observer.observe(el));
    }
  },

  /* ── Toast Notification System ── */
  Toast: {
    container: null,
    init() {
      this.container = document.querySelector('.toast-container');
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
      }
    },
    show(message, type = 'info', duration = 4000) {
      if (!this.container) this.init();
      const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <span class="toast-icon" role="img" aria-label="${type}">${icons[type]}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Close">✕</button>
      `;
      toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
      });
      this.container.appendChild(toast);
      requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));
      if (duration > 0) {
        setTimeout(() => {
          toast.classList.remove('show');
          setTimeout(() => toast.remove(), 400);
        }, duration);
      }
    },
    success(msg) { this.show(msg, 'success'); },
    error(msg) { this.show(msg, 'error', 6000); },
    info(msg) { this.show(msg, 'info'); },
    warning(msg) { this.show(msg, 'warning', 5000); }
  },

  /* ── Modal Management ── */
  Modal: {
    open(id) {
      const overlay = document.getElementById(id);
      if (overlay) {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('visible')));
      }
    },
    close(id) {
      const overlay = document.getElementById(id);
      if (overlay) {
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
        setTimeout(() => { overlay.style.display = 'none'; }, 300);
      }
    },
    init(id) {
      const overlay = document.getElementById(id);
      if (!overlay) return;
      overlay.addEventListener('click', (e) => { if (e.target === overlay) this.close(id); });
      overlay.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => this.close(id));
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('visible')) this.close(id);
      });
    }
  },

  /* ── Animated Counter ── */
  Counter: {
    animate(element, target, duration = 2000) {
      const startTime = performance.now();
      const suffix = element.dataset.suffix || '';
      const prefix = element.dataset.prefix || '';
      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        element.textContent = prefix + current.toLocaleString('en-IN') + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else element.textContent = prefix + target.toLocaleString('en-IN') + suffix;
      };
      requestAnimationFrame(update);
    },
    initAll() {
      const counters = document.querySelectorAll('[data-count]');
      if (!counters.length) return;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count);
            this.animate(entry.target, target, 2200);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(el => observer.observe(el));
    }
  },

  /* ── Tab Switching ── */
  Tabs: {
    init(containerSelector) {
      const container = document.querySelector(containerSelector);
      if (!container) return;
      const buttons = container.querySelectorAll('.tab-btn');
      const contents = container.querySelectorAll('.tab-content');
      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.tab;
          buttons.forEach(b => b.classList.remove('active'));
          contents.forEach(c => c.classList.remove('active'));
          btn.classList.add('active');
          const targetEl = document.getElementById(target) || container.querySelector(`#${target}`);
          if (targetEl) targetEl.classList.add('active');
        });
      });
    }
  },

  /* ── Accordion ── */
  Accordion: {
    init(containerSelector) {
      const container = document.querySelector(containerSelector);
      if (!container) return;
      container.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
          const item = header.parentElement;
          const body = item.querySelector('.accordion-body');
          const isOpen = item.classList.contains('open');
          container.querySelectorAll('.accordion-item').forEach(i => {
            i.classList.remove('open');
            i.querySelector('.accordion-body').style.maxHeight = null;
          });
          if (!isOpen) {
            item.classList.add('open');
            body.style.maxHeight = body.scrollHeight + 'px';
          }
        });
      });
    }
  },

  /* ── Sidebar for Portal Pages ── */
  Sidebar: {
    init() {
      const toggle = document.getElementById('sidebar-toggle');
      const sidebar = document.getElementById('sidebar');
      if (!toggle || !sidebar) return;
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
      document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      });
    }
  },

  /* ── Portal View Switching ── */
  Portal: {
    init() {
      document.querySelectorAll('.sidebar-link[data-view]').forEach(link => {
        link.addEventListener('click', () => {
          const viewId = link.dataset.view;
          document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          document.querySelectorAll('.portal-view').forEach(v => v.classList.remove('active'));
          const view = document.getElementById(`view-${viewId}`);
          if (view) view.classList.add('active');
          // Close sidebar on mobile
          if (window.innerWidth < 768) {
            document.getElementById('sidebar')?.classList.remove('open');
          }
        });
      });
    }
  },

  /* ── Form Validation ── */
  Validate: {
    email(val) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val); },
    phone(val) { return /^[6-9]\d{9}$/.test(val.replace(/\D/g, '')); },
    required(val) { return val && val.trim().length > 0; },
    minLength(val, min) { return val && val.trim().length >= min; },
    form(formEl) {
      let valid = true;
      const data = {};
      formEl.querySelectorAll('[data-validate]').forEach(input => {
        const rules = input.dataset.validate.split(',');
        const val = input.value;
        let fieldValid = true;
        rules.forEach(rule => {
          if (rule === 'required' && !this.required(val)) fieldValid = false;
          if (rule === 'email' && !this.email(val)) fieldValid = false;
          if (rule === 'phone' && !this.phone(val)) fieldValid = false;
        });
        input.style.borderColor = fieldValid ? '' : 'var(--accent-rose)';
        if (!fieldValid) valid = false;
        data[input.name || input.id] = val;
      });
      return { valid, data };
    }
  },

  /* ── Confetti Effect ── */
  Confetti: {
    burst(duration = 3500) {
      const container = document.createElement('div');
      container.className = 'confetti-container';
      document.body.appendChild(container);
      const colors = ['#9B5FD0', '#4F46E5', '#22D3EE', '#34D399', '#FBBF24', '#FB7185', '#818CF8', '#FFF'];
      for (let i = 0; i < 100; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.cssText = `left:${Math.random()*100}%; background:${colors[Math.floor(Math.random()*colors.length)]}; animation-delay:${Math.random()*1.2}s; animation-duration:${(Math.random()*2.5+2)}s; width:${(Math.random()*8+4)}px; height:${(Math.random()*8+4)}px; border-radius:${Math.random()>0.5?'50%':'2px'};`;
        container.appendChild(piece);
      }
      setTimeout(() => container.remove(), duration + 500);
    }
  },

  /* ── Utilities ── */
  Utils: {
    formatCurrency(amount) { return '₹' + amount.toLocaleString('en-IN'); },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
    },
    formatRelativeTime(dateStr) {
      if (!dateStr) return '';
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff/60000);
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins/60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours/24);
      if (days < 7) return `${days}d ago`;
      return this.formatDate(dateStr);
    },
    truncate(str, len = 100) { return str && str.length > len ? str.substring(0, len) + '...' : (str || ''); },
    getUrlParam(key) { return new URLSearchParams(window.location.search).get(key); },
    debounce(fn, delay = 300) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; },
    generateStars(rating) {
      const full = Math.floor(rating);
      const half = rating % 1 >= 0.5;
      const empty = 5 - full - (half ? 1 : 0);
      return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(empty);
    },
    slugify(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); },
    capitalize(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; },
    numberShort(num) {
      if (num >= 1000000) return (num/1000000).toFixed(1) + 'M';
      if (num >= 1000) return (num/1000).toFixed(1) + 'K';
      return num.toString();
    }
  },

  /* ── Notification Panel ── */
  Notifications: {
    init() {
      const btn = document.getElementById('notif-btn');
      const panel = document.getElementById('notif-panel');
      if (!btn || !panel) return;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('open');
      });
      document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !btn.contains(e.target)) {
          panel.classList.remove('open');
        }
      });
    }
  }
};

