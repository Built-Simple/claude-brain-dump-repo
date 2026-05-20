# Unified Brand Rebrand Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand 5 public-facing Built Simple sites to match the main marketing site design.

**Architecture:** Create a shared `brand.css` file hosted on CT 400 (admin dashboard container) and update each site to include it, replacing existing styles with unified components.

**Tech Stack:** Vanilla CSS with CSS custom properties, Google Fonts (Fraunces, Inter), static HTML

---

## File Structure

### New Files to Create

| File | Location | Purpose |
|------|----------|---------|
| `brand.css` | CT 400: `/var/www/built-simple.ai/brand/brand.css` | Shared design tokens, components, header, footer |
| `brand.js` | CT 400: `/var/www/built-simple.ai/brand/brand.js` | Dropdown menu, mobile nav toggle |

### Files to Modify

| Site | File | Container | Access Method |
|------|------|-----------|---------------|
| FixIt | `/var/www/talon-api/fixit_frontend.html` | CT 103 | `pct exec 103` |
| PubMed | `/var/www/pubmed-search-api/index.html` | Host (Giratina) | Direct |
| ArXiv | `/var/www/arxiv-api/static/index.html` | Host (Giratina) | Direct |
| ReviewMaster | `/opt/reviewmaster/backend/templates/index.html` | CT 313 (Silvally) | `ssh root@192.168.1.52 "pct exec 313"` |
| Wikipedia | `/opt/wikipedia_api_production.py` (embedded HTML) | CT 213 (Hoopa) | `ssh root@192.168.1.79` |

---

## Task 1: Set Up Brand CSS Hosting on CT 400

**Files:**
- Create: CT 400 `/var/www/built-simple.ai/brand/brand.css`
- Create: CT 400 `/var/www/built-simple.ai/brand/brand.js`
- Modify: CT 400 `/etc/nginx/sites-available/admin.built-simple.ai`

- [ ] **Step 1: Create brand directory on CT 400**

```bash
pct exec 400 -- mkdir -p /var/www/built-simple.ai/brand
```

- [ ] **Step 2: Create brand.css with design tokens and base styles**

Create file `/var/www/built-simple.ai/brand/brand.css` in CT 400:

```css
/*
 * Built Simple Brand CSS
 * Version: 1.0.0
 * Include via: <link rel="stylesheet" href="https://admin.built-simple.ai/brand/brand.css">
 */

/* ===== DESIGN TOKENS ===== */
:root {
  /* Backgrounds */
  --bs-bg-primary: #0F0D0B;
  --bs-bg-secondary: #161411;
  --bs-bg-card: #1C1916;
  --bs-bg-card-hover: #221F1B;

  /* Text */
  --bs-text-primary: #FAF6F1;
  --bs-text-secondary: #B5AEA4;
  --bs-text-tertiary: #6B645B;

  /* Accent */
  --bs-accent: #C41E3A;
  --bs-accent-hover: #DC143C;
  --bs-accent-glow: rgba(196, 30, 58, 0.25);

  /* Secondary Palette */
  --bs-teal: #7AB8A8;
  --bs-amber: #D4A574;
  --bs-purple: #9B8AA6;

  /* Borders */
  --bs-border: rgba(250, 246, 241, 0.08);
  --bs-border-hover: rgba(250, 246, 241, 0.15);

  /* Shadows */
  --bs-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --bs-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --bs-shadow-lg: 0 12px 24px -10px rgba(0, 0, 0, 0.6);
  --bs-shadow-glow: 0 0 20px var(--bs-accent-glow);

  /* Typography */
  --bs-font-heading: 'Fraunces', Georgia, serif;
  --bs-font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --bs-font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Spacing */
  --bs-radius-sm: 8px;
  --bs-radius-md: 12px;
  --bs-radius-lg: 16px;
  --bs-radius-xl: 20px;

  --bs-space-xs: 4px;
  --bs-space-sm: 8px;
  --bs-space-md: 16px;
  --bs-space-lg: 24px;
  --bs-space-xl: 32px;
  --bs-space-2xl: 48px;
}

/* ===== BASE RESET ===== */
.bs-reset * {
  box-sizing: border-box;
}

.bs-body {
  background-color: var(--bs-bg-primary);
  color: var(--bs-text-primary);
  font-family: var(--bs-font-body);
  line-height: 1.6;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

/* ===== TYPOGRAPHY ===== */
.bs-h1, .bs-h2, .bs-h3, .bs-h4 {
  font-family: var(--bs-font-heading);
  font-weight: 600;
  color: var(--bs-text-primary);
  margin: 0 0 var(--bs-space-md) 0;
}

.bs-h1 { font-size: 2.5rem; }
.bs-h2 { font-size: 2rem; }
.bs-h3 { font-size: 1.5rem; }
.bs-h4 { font-size: 1.25rem; }

.bs-text-secondary { color: var(--bs-text-secondary); }
.bs-text-tertiary { color: var(--bs-text-tertiary); }
.bs-text-accent { color: var(--bs-accent); }

/* ===== HEADER ===== */
.bs-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(15, 13, 11, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--bs-border);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bs-header-inner {
  max-width: 1200px;
  width: 100%;
  padding: 0 var(--bs-space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bs-logo {
  display: flex;
  align-items: center;
  gap: var(--bs-space-sm);
  text-decoration: none;
}

.bs-logo-mark {
  width: 28px;
  height: 28px;
  background: var(--bs-accent);
  border-radius: 4px;
}

.bs-logo-text {
  font-family: var(--bs-font-heading);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--bs-text-primary);
}

.bs-nav {
  display: flex;
  align-items: center;
  gap: var(--bs-space-xl);
}

.bs-nav-link {
  font-family: var(--bs-font-body);
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--bs-text-primary);
  text-decoration: none;
  padding: var(--bs-space-sm) 0;
  position: relative;
  transition: color 0.2s ease;
}

.bs-nav-link:hover {
  color: var(--bs-accent);
}

.bs-nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--bs-accent);
  transition: width 0.2s ease;
}

.bs-nav-link:hover::after,
.bs-nav-link.active::after {
  width: 100%;
}

.bs-nav-link.active {
  color: var(--bs-accent);
}

/* Dropdown */
.bs-dropdown {
  position: relative;
}

.bs-dropdown-trigger {
  display: flex;
  align-items: center;
  gap: var(--bs-space-xs);
  cursor: pointer;
}

.bs-dropdown-trigger svg {
  width: 12px;
  height: 12px;
  transition: transform 0.2s ease;
}

.bs-dropdown.open .bs-dropdown-trigger svg {
  transform: rotate(180deg);
}

.bs-dropdown-menu {
  position: absolute;
  top: calc(100% + var(--bs-space-sm));
  right: 0;
  min-width: 180px;
  background: var(--bs-bg-card);
  border: 1px solid var(--bs-border);
  border-radius: var(--bs-radius-md);
  box-shadow: var(--bs-shadow-lg);
  padding: var(--bs-space-sm) 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: all 0.2s ease;
}

.bs-dropdown.open .bs-dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.bs-dropdown-item {
  display: block;
  padding: var(--bs-space-sm) var(--bs-space-md);
  color: var(--bs-text-primary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.15s ease;
}

.bs-dropdown-item:hover {
  background: var(--bs-bg-card-hover);
}

/* Mobile menu */
.bs-menu-toggle {
  display: none;
  background: none;
  border: none;
  padding: var(--bs-space-sm);
  cursor: pointer;
}

.bs-menu-toggle svg {
  width: 24px;
  height: 24px;
  stroke: var(--bs-text-primary);
}

@media (max-width: 768px) {
  .bs-nav {
    display: none;
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bs-bg-primary);
    flex-direction: column;
    align-items: stretch;
    padding: var(--bs-space-lg);
    gap: 0;
  }

  .bs-nav.open {
    display: flex;
  }

  .bs-nav-link {
    padding: var(--bs-space-md) 0;
    border-bottom: 1px solid var(--bs-border);
    font-size: 1.1rem;
  }

  .bs-dropdown-menu {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    border: none;
    background: transparent;
    padding-left: var(--bs-space-lg);
  }

  .bs-menu-toggle {
    display: block;
  }
}

/* ===== BUTTONS ===== */
.bs-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--bs-space-sm);
  font-family: var(--bs-font-body);
  font-size: 0.95rem;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: var(--bs-radius-md);
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
}

.bs-btn-primary {
  background: var(--bs-accent);
  color: var(--bs-text-primary);
}

.bs-btn-primary:hover {
  background: var(--bs-accent-hover);
  transform: translateY(-2px);
  box-shadow: var(--bs-shadow-glow);
}

.bs-btn-secondary {
  background: transparent;
  color: var(--bs-text-primary);
  border: 1px solid var(--bs-border-hover);
}

.bs-btn-secondary:hover {
  background: var(--bs-bg-card);
  border-color: var(--bs-accent);
}

.bs-btn-ghost {
  background: transparent;
  color: var(--bs-text-primary);
  padding: 8px 16px;
}

.bs-btn-ghost:hover {
  color: var(--bs-accent);
}

/* ===== CARDS ===== */
.bs-card {
  background: var(--bs-bg-card);
  border: 1px solid var(--bs-border);
  border-radius: var(--bs-radius-lg);
  padding: var(--bs-space-lg);
  transition: all 0.2s ease;
}

.bs-card:hover {
  border-color: var(--bs-accent);
  transform: translateY(-2px);
  box-shadow: var(--bs-shadow-md);
}

.bs-card-static {
  background: var(--bs-bg-card);
  border: 1px solid var(--bs-border);
  border-radius: var(--bs-radius-lg);
  padding: var(--bs-space-lg);
}

/* ===== FORM INPUTS ===== */
.bs-input {
  width: 100%;
  background: var(--bs-bg-secondary);
  color: var(--bs-text-primary);
  border: 1px solid var(--bs-border);
  border-radius: var(--bs-radius-sm);
  padding: 12px 16px;
  font-family: var(--bs-font-body);
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.bs-input:focus {
  outline: none;
  border-color: var(--bs-accent);
  box-shadow: 0 0 0 3px var(--bs-accent-glow);
}

.bs-input::placeholder {
  color: var(--bs-text-tertiary);
}

.bs-select {
  width: 100%;
  background: var(--bs-bg-secondary);
  color: var(--bs-text-primary);
  border: 1px solid var(--bs-border);
  border-radius: var(--bs-radius-sm);
  padding: 12px 16px;
  font-family: var(--bs-font-body);
  font-size: 1rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23B5AEA4' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}

.bs-select:focus {
  outline: none;
  border-color: var(--bs-accent);
  box-shadow: 0 0 0 3px var(--bs-accent-glow);
}

/* ===== FOOTER ===== */
.bs-footer {
  background: var(--bs-bg-primary);
  border-top: 1px solid var(--bs-border);
  padding: var(--bs-space-2xl) var(--bs-space-lg) var(--bs-space-lg);
}

.bs-footer-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.bs-footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: var(--bs-space-xl);
  margin-bottom: var(--bs-space-2xl);
}

@media (max-width: 768px) {
  .bs-footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .bs-footer-grid {
    grid-template-columns: 1fr;
  }
}

.bs-footer-brand {
  display: flex;
  flex-direction: column;
  gap: var(--bs-space-md);
}

.bs-footer-tagline {
  color: var(--bs-text-secondary);
  font-size: 0.9rem;
  max-width: 250px;
}

.bs-footer-col h4 {
  font-family: var(--bs-font-body);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--bs-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--bs-space-md);
}

.bs-footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--bs-space-sm);
}

.bs-footer-links a {
  color: var(--bs-text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.15s ease;
}

.bs-footer-links a:hover {
  color: var(--bs-accent);
}

.bs-footer-bottom {
  border-top: 1px solid var(--bs-border);
  padding-top: var(--bs-space-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--bs-space-md);
}

.bs-footer-copy {
  color: var(--bs-text-tertiary);
  font-size: 0.85rem;
}

.bs-footer-legal {
  display: flex;
  gap: var(--bs-space-lg);
}

.bs-footer-legal a {
  color: var(--bs-text-tertiary);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.15s ease;
}

.bs-footer-legal a:hover {
  color: var(--bs-text-secondary);
}

/* ===== UTILITIES ===== */
.bs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--bs-space-lg);
}

.bs-main {
  padding-top: 64px; /* Header height */
}

.bs-text-center { text-align: center; }
.bs-mt-lg { margin-top: var(--bs-space-lg); }
.bs-mt-xl { margin-top: var(--bs-space-xl); }
.bs-mb-lg { margin-bottom: var(--bs-space-lg); }
.bs-mb-xl { margin-bottom: var(--bs-space-xl); }

/* Result/list item with accent border */
.bs-result {
  padding: var(--bs-space-lg);
  background: var(--bs-bg-secondary);
  border-radius: var(--bs-radius-sm);
  border-left: 3px solid var(--bs-accent);
  margin-bottom: var(--bs-space-md);
}

/* Success/error states */
.bs-success {
  color: var(--bs-teal);
  background: rgba(122, 184, 168, 0.1);
  padding: var(--bs-space-sm) var(--bs-space-md);
  border-radius: var(--bs-radius-sm);
}

.bs-error {
  color: #FF6B6B;
  background: rgba(255, 107, 107, 0.1);
  padding: var(--bs-space-sm) var(--bs-space-md);
  border-radius: var(--bs-radius-sm);
}

/* Code blocks */
.bs-code {
  background: var(--bs-bg-card);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: var(--bs-font-mono);
  font-size: 0.9em;
}

.bs-pre {
  background: var(--bs-bg-secondary);
  padding: var(--bs-space-lg);
  border-radius: var(--bs-radius-sm);
  overflow-x: auto;
  font-family: var(--bs-font-mono);
  font-size: 0.9rem;
  line-height: 1.5;
}
```

- [ ] **Step 3: Write brand.css to CT 400**

```bash
# Copy the CSS content to CT 400
pct push 400 /tmp/brand.css /var/www/built-simple.ai/brand/brand.css
pct exec 400 -- chown www-data:www-data /var/www/built-simple.ai/brand/brand.css
```

- [ ] **Step 4: Create brand.js for interactivity**

Create file `/var/www/built-simple.ai/brand/brand.js` in CT 400:

```javascript
/*
 * Built Simple Brand JS
 * Version: 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.bs-menu-toggle');
  const nav = document.querySelector('.bs-nav');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('open');
      const isOpen = nav.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Dropdown menus
  const dropdowns = document.querySelectorAll('.bs-dropdown');

  dropdowns.forEach(function(dropdown) {
    const trigger = dropdown.querySelector('.bs-dropdown-trigger');

    if (trigger) {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();

        // Close other dropdowns
        dropdowns.forEach(function(other) {
          if (other !== dropdown) {
            other.classList.remove('open');
          }
        });

        dropdown.classList.toggle('open');
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.bs-dropdown')) {
      dropdowns.forEach(function(dropdown) {
        dropdown.classList.remove('open');
      });
    }
  });

  // Close mobile menu when clicking a link
  const navLinks = document.querySelectorAll('.bs-nav-link');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      if (nav) {
        nav.classList.remove('open');
      }
    });
  });
});
```

- [ ] **Step 5: Write brand.js to CT 400**

```bash
pct push 400 /tmp/brand.js /var/www/built-simple.ai/brand/brand.js
pct exec 400 -- chown www-data:www-data /var/www/built-simple.ai/brand/brand.js
```

- [ ] **Step 6: Update nginx config to serve brand files**

Add to `/etc/nginx/sites-available/admin.built-simple.ai` in CT 400:

```nginx
location /brand/ {
    alias /var/www/built-simple.ai/brand/;
    expires 1d;
    add_header Cache-Control "public, immutable";
    add_header Access-Control-Allow-Origin "*";
}
```

```bash
pct exec 400 -- nginx -t && pct exec 400 -- systemctl reload nginx
```

- [ ] **Step 7: Test brand.css is accessible**

```bash
curl -I https://admin.built-simple.ai/brand/brand.css
```

Expected: HTTP 200 with CSS content-type

- [ ] **Step 8: Commit**

```bash
# Note: CT 400 files are not in git, but document the deployment
echo "Brand CSS deployed to CT 400 at /var/www/built-simple.ai/brand/" >> /root/DEPLOYMENT_LOG.md
```

---

## Task 2: Create Shared Header/Footer HTML Snippets

**Files:**
- Create: `/root/brand-snippets/header.html`
- Create: `/root/brand-snippets/footer.html`
- Create: `/root/brand-snippets/head-includes.html`

- [ ] **Step 1: Create snippets directory**

```bash
mkdir -p /root/brand-snippets
```

- [ ] **Step 2: Create head-includes.html**

```html
<!-- Built Simple Brand Includes -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://admin.built-simple.ai/brand/brand.css">
```

- [ ] **Step 3: Create header.html**

```html
<header class="bs-header">
  <div class="bs-header-inner">
    <a href="https://built-simple.ai" class="bs-logo">
      <div class="bs-logo-mark"></div>
      <span class="bs-logo-text">Built Simple</span>
    </a>

    <button class="bs-menu-toggle" aria-label="Toggle menu" aria-expanded="false">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12h18M3 6h18M3 18h18"/>
      </svg>
    </button>

    <nav class="bs-nav">
      <a href="https://reviewmaster.built-simple.ai" class="bs-nav-link">ReviewMaster</a>
      <a href="#" class="bs-nav-link">Receptionist</a>

      <div class="bs-dropdown">
        <span class="bs-nav-link bs-dropdown-trigger">
          APIs
          <svg viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 8L1 3h10z"/>
          </svg>
        </span>
        <div class="bs-dropdown-menu">
          <a href="https://fixit.built-simple.ai" class="bs-dropdown-item">FixIt (Stack Overflow)</a>
          <a href="https://pubmed.built-simple.ai" class="bs-dropdown-item">PubMed (Medical)</a>
          <a href="https://arxiv.built-simple.ai" class="bs-dropdown-item">ArXiv (Research)</a>
          <a href="https://wikipedia.built-simple.ai" class="bs-dropdown-item">Wikipedia</a>
        </div>
      </div>

      <a href="mailto:info@built-simple.ai" class="bs-nav-link">Contact</a>
    </nav>
  </div>
</header>
<script src="https://admin.built-simple.ai/brand/brand.js"></script>
```

- [ ] **Step 4: Create footer.html**

```html
<footer class="bs-footer">
  <div class="bs-footer-inner">
    <div class="bs-footer-grid">
      <div class="bs-footer-brand">
        <a href="https://built-simple.ai" class="bs-logo">
          <div class="bs-logo-mark"></div>
          <span class="bs-logo-text">Built Simple</span>
        </a>
        <p class="bs-footer-tagline">AI-powered APIs and tools for developers and businesses.</p>
      </div>

      <div class="bs-footer-col">
        <h4>Products</h4>
        <ul class="bs-footer-links">
          <li><a href="https://reviewmaster.built-simple.ai">ReviewMaster</a></li>
          <li><a href="#">Receptionist</a></li>
          <li><a href="https://fixit.built-simple.ai">FixIt API</a></li>
          <li><a href="https://pubmed.built-simple.ai">PubMed API</a></li>
          <li><a href="https://arxiv.built-simple.ai">ArXiv API</a></li>
          <li><a href="https://wikipedia.built-simple.ai">Wikipedia API</a></li>
        </ul>
      </div>

      <div class="bs-footer-col">
        <h4>Company</h4>
        <ul class="bs-footer-links">
          <li><a href="https://built-simple.ai">About</a></li>
          <li><a href="mailto:info@built-simple.ai">Contact</a></li>
        </ul>
      </div>

      <div class="bs-footer-col">
        <h4>Legal</h4>
        <ul class="bs-footer-links">
          <li><a href="/privacy">Privacy Policy</a></li>
          <li><a href="/terms">Terms of Service</a></li>
        </ul>
      </div>
    </div>

    <div class="bs-footer-bottom">
      <p class="bs-footer-copy">&copy; 2026 Built Simple. All rights reserved.</p>
      <div class="bs-footer-legal">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
      </div>
    </div>
  </div>
</footer>
```

- [ ] **Step 5: Write snippet files**

```bash
# Write each file to /root/brand-snippets/
cat > /root/brand-snippets/head-includes.html << 'SNIPPET'
<!-- paste head-includes.html content -->
SNIPPET

cat > /root/brand-snippets/header.html << 'SNIPPET'
<!-- paste header.html content -->
SNIPPET

cat > /root/brand-snippets/footer.html << 'SNIPPET'
<!-- paste footer.html content -->
SNIPPET
```

- [ ] **Step 6: Verify snippets created**

```bash
ls -la /root/brand-snippets/
```

Expected: 3 HTML files

---

## Task 3: Rebrand FixIt (CT 103)

**Files:**
- Modify: CT 103 `/var/www/talon-api/fixit_frontend.html`

- [ ] **Step 1: Backup existing FixIt frontend**

```bash
pct exec 103 -- cp /var/www/talon-api/fixit_frontend.html /var/www/talon-api/fixit_frontend.html.backup-$(date +%Y%m%d)
```

- [ ] **Step 2: Pull current FixIt frontend to host for editing**

```bash
pct pull 103 /var/www/talon-api/fixit_frontend.html /tmp/fixit_frontend.html
```

- [ ] **Step 3: Edit FixIt frontend**

In `/tmp/fixit_frontend.html`:

1. In `<head>`, add after existing meta tags:
```html
<!-- Built Simple Brand -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://admin.built-simple.ai/brand/brand.css">
```

2. Replace CSS variables section with:
```css
:root {
  /* Use Built Simple brand tokens */
  --bg: var(--bs-bg-primary);
  --surface: var(--bs-bg-card);
  --surface-hover: var(--bs-bg-card-hover);
  --text: var(--bs-text-primary);
  --text-secondary: var(--bs-text-secondary);
  --accent: var(--bs-accent);
  --accent-hover: var(--bs-accent-hover);
}
```

3. Update body font-family:
```css
body { font-family: var(--bs-font-body); }
```

4. Update h1/h2 elements:
```css
h1, h2, h3 { font-family: var(--bs-font-heading); }
```

5. Add immediately after `<body>`:
```html
<!-- Built Simple Header -->
<header class="bs-header">
  <div class="bs-header-inner">
    <a href="https://built-simple.ai" class="bs-logo">
      <div class="bs-logo-mark"></div>
      <span class="bs-logo-text">Built Simple</span>
    </a>
    <button class="bs-menu-toggle" aria-label="Toggle menu" aria-expanded="false">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12h18M3 6h18M3 18h18"/>
      </svg>
    </button>
    <nav class="bs-nav">
      <a href="https://reviewmaster.built-simple.ai" class="bs-nav-link">ReviewMaster</a>
      <a href="#" class="bs-nav-link">Receptionist</a>
      <div class="bs-dropdown">
        <span class="bs-nav-link bs-dropdown-trigger">
          APIs
          <svg viewBox="0 0 12 12" fill="currentColor"><path d="M6 8L1 3h10z"/></svg>
        </span>
        <div class="bs-dropdown-menu">
          <a href="https://fixit.built-simple.ai" class="bs-dropdown-item bs-nav-link active">FixIt (Stack Overflow)</a>
          <a href="https://pubmed.built-simple.ai" class="bs-dropdown-item">PubMed (Medical)</a>
          <a href="https://arxiv.built-simple.ai" class="bs-dropdown-item">ArXiv (Research)</a>
          <a href="https://wikipedia.built-simple.ai" class="bs-dropdown-item">Wikipedia</a>
        </div>
      </div>
      <a href="mailto:info@built-simple.ai" class="bs-nav-link">Contact</a>
    </nav>
  </div>
</header>
<script src="https://admin.built-simple.ai/brand/brand.js"></script>
<main class="bs-main">
```

6. Before `</body>`, add footer and close main:
```html
</main>
<!-- Built Simple Footer -->
<footer class="bs-footer">
  <div class="bs-footer-inner">
    <div class="bs-footer-grid">
      <div class="bs-footer-brand">
        <a href="https://built-simple.ai" class="bs-logo">
          <div class="bs-logo-mark"></div>
          <span class="bs-logo-text">Built Simple</span>
        </a>
        <p class="bs-footer-tagline">AI-powered APIs and tools for developers and businesses.</p>
      </div>
      <div class="bs-footer-col">
        <h4>Products</h4>
        <ul class="bs-footer-links">
          <li><a href="https://reviewmaster.built-simple.ai">ReviewMaster</a></li>
          <li><a href="#">Receptionist</a></li>
          <li><a href="https://fixit.built-simple.ai">FixIt API</a></li>
          <li><a href="https://pubmed.built-simple.ai">PubMed API</a></li>
          <li><a href="https://arxiv.built-simple.ai">ArXiv API</a></li>
          <li><a href="https://wikipedia.built-simple.ai">Wikipedia API</a></li>
        </ul>
      </div>
      <div class="bs-footer-col">
        <h4>Company</h4>
        <ul class="bs-footer-links">
          <li><a href="https://built-simple.ai">About</a></li>
          <li><a href="mailto:info@built-simple.ai">Contact</a></li>
        </ul>
      </div>
      <div class="bs-footer-col">
        <h4>Legal</h4>
        <ul class="bs-footer-links">
          <li><a href="/legal/privacy.html">Privacy Policy</a></li>
          <li><a href="/legal/terms.html">Terms of Service</a></li>
        </ul>
      </div>
    </div>
    <div class="bs-footer-bottom">
      <p class="bs-footer-copy">&copy; 2026 Built Simple. All rights reserved.</p>
    </div>
  </div>
</footer>
```

7. Update button colors from blue (#3B82F6) to burgundy:
   - Search: `--accent` → `var(--bs-accent)`
   - Replace any `#3B82F6` with `var(--bs-accent)`

- [ ] **Step 4: Push updated file to CT 103**

```bash
pct push 103 /tmp/fixit_frontend.html /var/www/talon-api/fixit_frontend.html
```

- [ ] **Step 5: Test FixIt site**

```bash
curl -s https://fixit.built-simple.ai | grep -o 'brand.css'
```

Expected: `brand.css` found in HTML

- [ ] **Step 6: Visual verification**

Open https://fixit.built-simple.ai in browser and verify:
- Header appears with burgundy logo mark
- Footer appears with 4 columns
- Buttons are burgundy
- Typography uses Fraunces/Inter

---

## Task 4: Rebrand PubMed API (Giratina Host)

**Files:**
- Modify: `/var/www/pubmed-search-api/index.html`

- [ ] **Step 1: Backup existing PubMed frontend**

```bash
cp /var/www/pubmed-search-api/index.html /var/www/pubmed-search-api/index.html.backup-$(date +%Y%m%d)
```

- [ ] **Step 2: Edit PubMed frontend**

Apply same pattern as FixIt:

1. Add brand includes to `<head>`
2. Map existing CSS variables to brand tokens
3. Add header after `<body>`
4. Add `<main class="bs-main">` wrapper
5. Add footer before `</body>`
6. Replace purple (#6366F1, #8B5CF6) with `var(--bs-accent)`
7. Update font-family references

- [ ] **Step 3: Test PubMed site**

```bash
curl -s https://pubmed.built-simple.ai | grep -o 'brand.css'
```

- [ ] **Step 4: Visual verification**

Open https://pubmed.built-simple.ai and verify branding applied.

---

## Task 5: Rebrand ArXiv API (Giratina Host)

**Files:**
- Modify: `/var/www/arxiv-api/static/index.html`

- [ ] **Step 1: Backup existing ArXiv frontend**

```bash
cp /var/www/arxiv-api/static/index.html /var/www/arxiv-api/static/index.html.backup-$(date +%Y%m%d)
```

- [ ] **Step 2: Edit ArXiv frontend**

This site has a cyberpunk/terminal aesthetic. Changes needed:

1. Add brand includes to `<head>`
2. Replace monospace font with brand fonts (keep monospace only for code blocks)
3. Replace neon green (#00FF41) with `var(--bs-accent)`
4. Add header after `<body>`
5. Add footer before `</body>`
6. Remove terminal-style animations (optional, or keep glow effects)

- [ ] **Step 3: Test ArXiv site**

```bash
curl -s https://arxiv.built-simple.ai | grep -o 'brand.css'
```

- [ ] **Step 4: Visual verification**

Open https://arxiv.built-simple.ai and verify branding applied.

---

## Task 6: Rebrand Wikipedia API (CT 213 on Hoopa)

**Files:**
- Modify: Hoopa `/opt/wikipedia_api_production.py` (embedded HTML in `get_html_template()`)

- [ ] **Step 1: Backup existing Wikipedia API**

```bash
ssh root@192.168.1.79 "cp /opt/wikipedia_api_production.py /opt/wikipedia_api_production.py.backup-$(date +%Y%m%d)"
```

- [ ] **Step 2: Pull file for editing**

```bash
scp root@192.168.1.79:/opt/wikipedia_api_production.py /tmp/wikipedia_api_production.py
```

- [ ] **Step 3: Edit get_html_template() function**

In the Python file, find `def get_html_template():` and update the returned HTML string:

1. Add brand includes to `<head>`
2. Replace gold (#D4AF37) with `var(--bs-accent)` (burgundy)
3. Update font-family to brand fonts
4. Add header HTML after `<body>`
5. Add footer HTML before `</body>`
6. Wrap main content in `<main class="bs-main">`

- [ ] **Step 4: Push updated file to Hoopa**

```bash
scp /tmp/wikipedia_api_production.py root@192.168.1.79:/opt/wikipedia_api_production.py
```

- [ ] **Step 5: Restart Wikipedia API**

```bash
ssh root@192.168.1.79 "systemctl restart wikipedia-api || pkill -f wikipedia_api_production && cd /opt && nohup python3 wikipedia_api_production.py > /var/log/wikipedia-api.log 2>&1 &"
```

- [ ] **Step 6: Test Wikipedia site**

```bash
curl -s https://wikipedia.built-simple.ai | grep -o 'brand.css'
```

- [ ] **Step 7: Visual verification**

Open https://wikipedia.built-simple.ai and verify branding applied.

---

## Task 7: Rebrand ReviewMaster Pro (CT 313 on Silvally)

**Files:**
- Modify: CT 313 `/opt/reviewmaster/backend/templates/index.html`

- [ ] **Step 1: Backup existing ReviewMaster frontend**

```bash
ssh root@192.168.1.52 "pct exec 313 -- cp /opt/reviewmaster/backend/templates/index.html /opt/reviewmaster/backend/templates/index.html.backup-\$(date +%Y%m%d)"
```

- [ ] **Step 2: Pull file for editing**

```bash
ssh root@192.168.1.52 "pct pull 313 /opt/reviewmaster/backend/templates/index.html /tmp/reviewmaster_index.html"
scp root@192.168.1.52:/tmp/reviewmaster_index.html /tmp/reviewmaster_index.html
```

- [ ] **Step 3: Edit ReviewMaster frontend**

This is a larger file (215KB). Apply changes:

1. Add brand includes to `<head>`
2. Map existing CSS variables to brand tokens
3. Add header after `<body>`
4. Add footer before `</body>`
5. Update amber/gold accents to burgundy
6. Update font-family references

- [ ] **Step 4: Push updated file back**

```bash
scp /tmp/reviewmaster_index.html root@192.168.1.52:/tmp/reviewmaster_index.html
ssh root@192.168.1.52 "pct push 313 /tmp/reviewmaster_index.html /opt/reviewmaster/backend/templates/index.html"
```

- [ ] **Step 5: Restart ReviewMaster**

```bash
ssh root@192.168.1.52 "pct exec 313 -- systemctl restart reviewmaster"
```

- [ ] **Step 6: Test ReviewMaster site**

```bash
curl -s https://reviewmaster.built-simple.ai | grep -o 'brand.css'
```

- [ ] **Step 7: Visual verification**

Open https://reviewmaster.built-simple.ai and verify branding applied.

---

## Task 8: Final Verification & Documentation

- [ ] **Step 1: Test all 5 sites load brand.css**

```bash
for site in fixit pubmed arxiv wikipedia reviewmaster; do
  echo "=== $site.built-simple.ai ==="
  curl -s "https://$site.built-simple.ai" | grep -o 'brand.css' || echo "MISSING"
done
```

Expected: All 5 show `brand.css`

- [ ] **Step 2: Test header appears on all sites**

```bash
for site in fixit pubmed arxiv wikipedia reviewmaster; do
  echo "=== $site.built-simple.ai ==="
  curl -s "https://$site.built-simple.ai" | grep -o 'bs-header' || echo "MISSING"
done
```

- [ ] **Step 3: Test mobile responsiveness**

Open each site on mobile viewport (375px) and verify:
- Hamburger menu appears
- Menu opens/closes correctly
- Footer stacks properly

- [ ] **Step 4: Update documentation**

Add to brain dump repo docs:

```bash
cat >> /root/.claude/plugins/marketplaces/neely-brain-dump-marketplace/docs/infrastructure/brand-system.md << 'EOF'
# Built Simple Brand System

**Created:** 2026-05-20

## Shared Brand Assets

| File | URL | Purpose |
|------|-----|---------|
| brand.css | https://admin.built-simple.ai/brand/brand.css | Design tokens, components |
| brand.js | https://admin.built-simple.ai/brand/brand.js | Dropdown, mobile nav |

## Sites Using Brand System

- fixit.built-simple.ai
- pubmed.built-simple.ai
- arxiv.built-simple.ai
- wikipedia.built-simple.ai
- reviewmaster.built-simple.ai

## Updating Brand

1. Edit files on CT 400: `/var/www/built-simple.ai/brand/`
2. Changes apply to all sites immediately (cached 1 day)
3. For urgent updates, add version query param: `brand.css?v=2`

## CSS Classes Reference

See brand.css for full documentation. Key classes:
- `.bs-header` - Fixed header with nav
- `.bs-footer` - Multi-column footer
- `.bs-btn-primary` - Burgundy button
- `.bs-card` - Hover-lift card
- `.bs-input` - Form input
EOF
```

- [ ] **Step 5: Commit documentation**

```bash
cd /root/.claude/plugins/marketplaces/neely-brain-dump-marketplace
git add -A
git commit -m "Add brand system documentation for unified rebrand"
git push
```

---

## Summary

| Task | Site | Container | Status |
|------|------|-----------|--------|
| 1 | Brand CSS hosting | CT 400 | |
| 2 | HTML snippets | Host | |
| 3 | FixIt | CT 103 | |
| 4 | PubMed | Host | |
| 5 | ArXiv | Host | |
| 6 | Wikipedia | CT 213 (Hoopa) | |
| 7 | ReviewMaster | CT 313 (Silvally) | |
| 8 | Verification | All | |

**Total estimated tasks:** 8 major tasks, ~45 individual steps
