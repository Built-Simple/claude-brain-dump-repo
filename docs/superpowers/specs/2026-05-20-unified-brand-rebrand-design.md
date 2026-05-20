# Unified Brand Rebrand Design Spec

**Date:** 2026-05-20
**Status:** COMPLETED
**Completed:** 2026-05-20
**Author:** Claude Code via Happy

---

## Overview

Rebrand 5 public-facing Built Simple sites to match the main marketing site (built-simple.ai) design language. This creates visual consistency across the product suite.

### Sites In Scope

| Site | URL | Current State |
|------|-----|---------------|
| FixIt | fixit.built-simple.ai | Blue accent, system fonts |
| ReviewMaster Pro | reviewmaster.built-simple.ai | Gray/amber, minimal |
| PubMed API | pubmed.built-simple.ai | Indigo/purple, Inter |
| ArXiv API | arxiv.built-simple.ai | Neon green, monospace |
| Wikipedia API | wikipedia.built-simple.ai | Gold luxury theme |

### Goals

1. Unified visual identity matching built-simple.ai
2. Shared CSS file for maintainability
3. Consistent header/footer with cross-product navigation
4. Medium-depth redesign: colors, fonts, components (keep existing layouts)

---

## Design Tokens

### Colors

```css
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
}
```

### Typography

```css
:root {
  --bs-font-heading: 'Fraunces', Georgia, serif;
  --bs-font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --bs-font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

**Font Loading:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Spacing & Radius

```css
:root {
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
```

---

## Components

### Header

**Structure:**
```
[Logo Mark] Built Simple    [ReviewMaster] [Receptionist] [APIs ▼] [Contact Us]
```

**Specifications:**
- Position: fixed, top: 0
- Background: var(--bs-bg-primary) with backdrop-filter: blur(12px)
- Height: 64px
- Max-width: 1200px centered
- Z-index: 1000

**Logo:**
- Mark: 28x28px burgundy square
- Text: "Built Simple" in Fraunces 600, cream

**Nav Links:**
- Font: Inter 500, 14px
- Color: var(--bs-text-primary)
- Hover: burgundy underline (2px, offset 4px)
- Active page: burgundy text

**APIs Dropdown:**
- Trigger: "APIs" with chevron-down icon
- Panel: var(--bs-bg-card), border-radius 12px, shadow-lg
- Items: FixIt, PubMed, ArXiv, Wikipedia
- Item hover: var(--bs-bg-card-hover)

**Mobile (< 768px):**
- Hamburger menu icon
- Full-screen overlay menu
- Stack nav items vertically

### Buttons

**Primary Button:**
```css
.bs-btn-primary {
  background: var(--bs-accent);
  color: var(--bs-text-primary);
  font-family: var(--bs-font-body);
  font-weight: 600;
  padding: 12px 24px;
  border-radius: var(--bs-radius-md);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.bs-btn-primary:hover {
  background: var(--bs-accent-hover);
  transform: translateY(-2px);
  box-shadow: var(--bs-shadow-glow);
}
```

**Secondary Button:**
```css
.bs-btn-secondary {
  background: transparent;
  color: var(--bs-text-primary);
  border: 1px solid var(--bs-border-hover);
  /* Same padding/radius as primary */
}

.bs-btn-secondary:hover {
  background: var(--bs-bg-card);
  border-color: var(--bs-accent);
}
```

**Ghost Button:**
```css
.bs-btn-ghost {
  background: transparent;
  color: var(--bs-text-primary);
  border: none;
  text-decoration: underline;
  text-underline-offset: 4px;
}
```

### Cards

```css
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
```

### Form Inputs

```css
.bs-input {
  background: var(--bs-bg-secondary);
  color: var(--bs-text-primary);
  border: 1px solid var(--bs-border);
  border-radius: var(--bs-radius-sm);
  padding: 12px 16px;
  font-family: var(--bs-font-body);
  font-size: 16px;
  width: 100%;
  transition: border-color 0.2s ease;
}

.bs-input:focus {
  outline: none;
  border-color: var(--bs-accent);
  box-shadow: 0 0 0 3px var(--bs-accent-glow);
}

.bs-input::placeholder {
  color: var(--bs-text-tertiary);
}
```

### Footer

**Structure:**
```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] Built Simple       Products       Company      Legal    │
│  AI-powered APIs for       ReviewMaster   About        Privacy  │
│  developers                Receptionist   Contact      Terms    │
│                            FixIt API                            │
│                            PubMed API                           │
│                            ArXiv API                            │
│                            Wikipedia API                        │
│─────────────────────────────────────────────────────────────────│
│  © 2026 Built Simple. All rights reserved.                      │
└─────────────────────────────────────────────────────────────────┘
```

**Specifications:**
- Background: var(--bs-bg-primary)
- Border-top: 1px solid var(--bs-border)
- Padding: 48px 24px (top section), 24px (bottom row)
- Max-width: 1200px centered
- Grid: 4 columns on desktop, 2 on tablet, 1 on mobile

---

## Implementation Approach

### Shared CSS Hosting

Host `brand.css` at a stable URL. Options:

1. **Cloudflare Pages** (recommended): Deploy to `cdn.built-simple.ai/brand.css`
2. **Static file on Giratina**: Serve from CT 400 or marketing site container
3. **GitHub raw file**: Less control over caching

**Recommended:** Cloudflare Pages with cache headers for performance.

### Per-Site Integration

Each site adds:

```html
<head>
  <!-- Built Simple Brand CSS -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.built-simple.ai/brand.css">
</head>

<body>
  <!-- Shared Header (injected or copied) -->
  <header class="bs-header">...</header>

  <!-- Existing page content with updated classes -->
  <main>...</main>

  <!-- Shared Footer -->
  <footer class="bs-footer">...</footer>
</body>
```

### Migration Steps Per Site

1. Add font preconnects and brand.css link
2. Replace existing header with shared header HTML
3. Replace existing footer with shared footer HTML
4. Update body/html background to use `--bs-bg-primary`
5. Replace button classes with `bs-btn-*` classes
6. Replace card styles with `bs-card` class
7. Replace input styles with `bs-input` class
8. Update any hardcoded colors to CSS variables
9. Test responsive behavior
10. Remove old CSS that conflicts

---

## Files to Create

| File | Purpose |
|------|---------|
| `brand.css` | Shared design tokens, components, header, footer |
| `brand.js` | Optional: dropdown menu behavior, mobile nav toggle |

## Files to Modify

| Site | Files |
|------|-------|
| FixIt | `fixit_frontend.html` in CT 103 |
| ReviewMaster | Templates in CT 313 |
| PubMed | Frontend templates in CT 108 |
| ArXiv | Frontend in CT 122 |
| Wikipedia | Frontend in CT 213 (Hoopa) |

---

## Success Criteria

1. All 5 sites use identical header/footer
2. All 5 sites use burgundy (#C41E3A) as primary accent
3. All 5 sites use Fraunces/Inter typography
4. All 5 sites use warm dark backgrounds (#0F0D0B)
5. Updating `brand.css` changes all sites simultaneously
6. Mobile-responsive header/footer on all sites
7. No visual regressions in existing functionality

---

## Out of Scope

- Receptionist sites (placeholder link only)
- Inbox Organizer, Buffer Killer, MyFit Pro
- Admin Dashboard (internal tool)
- Layout redesigns (keeping existing page structures)
- New features or functionality

---

## Open Questions

None - all clarified during brainstorming.

---

## Implementation Summary

**Completed 2026-05-20**

### Brand Assets Location
- CSS: `https://built-simple.ai/brand/brand.css` (served from CT 400)
- JS: `https://built-simple.ai/brand/brand.js` (served from CT 400)

### Files Modified

| Site | Container | File |
|------|-----------|------|
| FixIt | CT 103 | `/var/www/talon-api/fixit_frontend.html` |
| PubMed | CT 108 | `/opt/pubmed-web/templates/index.html` |
| ArXiv | CT 122 | `/opt/arxiv/modules/templates.py` |
| Wikipedia | CT 213 (Hoopa) | `/opt/wikipedia_api_production.py` |
| ReviewMaster | CT 313 (Silvally) | `/opt/reviewmaster/backend/templates/index.html` |

### Services Restarted
- `arxiv-api.service` (CT 122)
- `pubmed-api.service` (CT 108)
- `wikipedia-api.service` (CT 213)
- `reviewmaster.service` (CT 313)

### Backup Files Created
All original files backed up with `.bak` extension.

---

*Spec created: 2026-05-20*
*Implementation completed: 2026-05-20*
