# Built-Simple.ai Marketing Website

**Location:** CT 400 (Giratina)
**Path:** `/proxmox-zfs/subvol-400-disk-0/var/www/built-simple.ai/`
**URL:** https://built-simple.ai
**Last Updated:** April 28, 2026

---

## Overview

Static HTML/CSS/JS marketing website for Built-Simple.ai API services. Served by Nginx within CT 400, exposed via Cloudflare tunnel.

## Design System (April 2026 Redesign)

### Color Palette

```css
:root {
  /* Backgrounds - Warm black with brown undertones */
  --bg-primary: #0F0D0B;      /* Main background */
  --bg-secondary: #161411;    /* Footer, nav mobile menu */
  --bg-card: #1C1916;         /* Card backgrounds */

  /* Borders - Cream-tinted transparency */
  --border-subtle: rgba(255,248,240,0.06);
  --border-hover: rgba(255,248,240,0.12);

  /* Text - Warm cream tones */
  --text-primary: #FAF6F1;    /* Headlines, primary text */
  --text-secondary: #B5AEA4;  /* Body text */
  --text-tertiary: #6B645B;   /* Muted text, dates */

  /* Accent - Deep burgundy red */
  --accent: #C41E3A;          /* Primary buttons, links */
  --accent-hover: #DC143C;    /* Button hover state */
  --accent-glow: rgba(196,30,58,0.15);  /* Focus rings */

  /* Secondary accents */
  --teal: #7AB8A8;            /* Success states */
  --amber: #D4A574;           /* Highlights */
  --purple: #9B8AA6;          /* Tags */
}
```

### Typography

**Fonts:**
- **Headlines:** Fraunces (serif) - optical size variable font
- **Body:** Inter (sans-serif)

**Google Fonts Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

**Hierarchy:**
- H1: Fraunces, 3-3.5rem, weight 600, letter-spacing -0.02em
- H2: Fraunces, 1.5-2rem, weight 600, letter-spacing -0.01em
- H3: Inter, 1.1rem, weight 600
- Body: Inter, 1rem, weight 400, line-height 1.7

### Components

#### Navigation
```css
.nav {
  position: fixed;
  background: rgba(15, 13, 11, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-subtle);
  padding: 16px 40px;
}
```

#### Logo
```html
<a href="/" class="logo">Built<span>.</span>Simple</a>
```
- Fraunces serif, 1.4rem
- Period colored with `--accent`

#### Cards
```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  padding: 28px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.card:hover {
  border-color: var(--border-hover);
  box-shadow: 0 0 30px rgba(196,30,58,0.08);
}
```

#### Buttons
```css
/* Primary */
.btn-primary {
  background: var(--accent);
  color: var(--text-primary);
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 500;
}

.btn-primary:hover {
  background: var(--accent-hover);
}

/* Secondary */
.btn-secondary {
  background: transparent;
  border: 1px solid var(--border-hover);
  color: var(--text-primary);
}
```

#### Form Inputs
```css
input, textarea, select {
  background: var(--bg-secondary);
  border: 1px solid var(--border-subtle);
  border-radius: 10px;
  color: var(--text-primary);
  padding: 1rem;
}

input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
```

### Pages

| Page | File | Description |
|------|------|-------------|
| Homepage | `index.html` | Main landing page with hero, products, pricing |
| Privacy Policy | `privacy.html` | Legal - privacy policy |
| Terms of Service | `terms.html` | Legal - terms |
| Refund Policy | `refund.html` | Legal - refund policy |
| Contact | `contact.html` | Contact form (posts to FixIt API) |

### Responsive Breakpoints

```css
@media (max-width: 768px) {
  .nav { padding: 16px 20px; }
  .nav-links { display: none; }  /* Hamburger menu */
  h1 { font-size: 2.2rem; }
  .content { padding: 100px 20px 40px; }
}
```

---

## Design Philosophy

### What Changed (April 2026)
The site was redesigned to look less "AI-generated" and more distinctive.

**Removed:**
- Pulsing "Coming Soon" badge
- Radial glow in hero section
- Card lift-on-hover animations
- Navy-tinted black (#0B0D11)
- Standard coral red (#E8483F)

**Added:**
- Fraunces serif for editorial feel
- Warm black backgrounds (brown undertone)
- Cream-tinted text for softness
- Deeper burgundy red accent
- Subtle border glow on hover
- Consistent footer navigation

### Design Principles
1. **Warmth over cold tech**: Brown-tinted blacks, cream whites
2. **Restraint over flash**: Subtle hovers, no glows/pulses
3. **Typography distinction**: Serif headlines stand out
4. **Consistency**: Same nav/footer across all pages

---

## Mockups Archive

Design exploration mockups saved at:
`/proxmox-zfs/subvol-400-disk-0/var/www/built-simple.ai/mockups/`

| File | Description |
|------|-------------|
| `index.html` | Mockup comparison page |
| `original.html` | Pre-redesign snapshot |
| `variant-a-serif.html` | Instrument Serif exploration |
| `variant-b-deeper-red.html` | Burgundy + Space Grotesk |
| `variant-c-warm-black.html` | Fraunces + warm tones |
| `variant-d-bold-contrast.html` | Syne brutalist style |
| `variant-final.html` | Final approved design |

Accessible at: https://built-simple.ai/mockups/

---

## Deployment

**Server:** Nginx in CT 400
**Tunnel:** Cloudflare tunnel to built-simple.ai
**Permissions:** Files owned by `100033:100033` (container user), mode 644

```bash
# After editing files from host
chown 100033:100033 /proxmox-zfs/subvol-400-disk-0/var/www/built-simple.ai/*.html
chmod 644 /proxmox-zfs/subvol-400-disk-0/var/www/built-simple.ai/*.html
```

---

## Contact Form

The contact page submits to FixIt API:

```javascript
fetch('https://fixitapi.built-simple.ai/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, message })
});
```

Success/error states use `--teal` and `--accent` colors respectively.

---

## Related Documentation

- [FixIt API](./fixit-api.md) - Contact form backend
- [Cloudflare Tunnels](../infrastructure/cloudflare-tunnels.md) - Tunnel config
