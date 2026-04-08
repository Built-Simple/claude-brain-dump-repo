---
name: carousel-gen
description: Generate Instagram/LinkedIn carousel slides (1080x1350px) using Puppeteer and HTML templates. Use when asked to create carousels, social media slides, or promotional graphics.
allowed-tools: Read, Write, Edit, Bash, Glob
---

# Carousel Generator

Generate professional carousel slides using the Puppeteer-based carousel-gen system.

## Location

```
~/.claude/plugins/marketplaces/neely-brain-dump-marketplace/tools/carousel-gen/
```

## Quick Start

```bash
cd ~/.claude/plugins/marketplaces/neely-brain-dump-marketplace/tools/carousel-gen

# Edit generate.js to set your content (see Content Structure below)
# Then run:
npm run generate

# Output: ./output/slide-01.png through slide-XX.png
```

## Output Specs

- **Dimensions:** 1080x1350px (Instagram/LinkedIn carousel optimal)
- **Resolution:** 2x device scale (retina quality)
- **Format:** PNG

## Content Structure

Edit the `CAROUSEL` object in `generate.js`:

```javascript
const CAROUSEL = {
  theme: {
    background: '#0A0A0F',      // Dark background
    accent: '#7C5CFC',          // Purple accent (or any hex)
    textColor: '#F0EFFF',       // Light text
    brand: 'Built Simple AI',   // Bottom-left brand name
    cta: 'Follow for more →',   // Last slide CTA (bottom-right)
  },
  slides: [
    // Slide types - mix and match:

    // 1. Headline + body
    {
      tag: 'AI Automation',
      headline: 'Your restaurant is <em>losing money</em> every time the phone rings.',
      body: "Missed calls = missed reservations. Here's what changes.",
      headlineSize: 88,  // Optional, defaults to 88
    },

    // 2. Big stat
    {
      tag: 'The Problem',
      stat: '67%',
      statLabel: "of callers hang up if put on hold — and they don't call back.",
    },

    // 3. Headline + bullets
    {
      tag: 'What Changes',
      headline: 'An AI receptionist <em>never</em> puts anyone on hold.',
      bullets: [
        'Answers every call instantly, 24/7',
        'Takes reservations directly into your POS',
        'Handles FAQs so your staff stays focused',
        'Escalates to a human only when needed',
      ],
      headlineSize: 72,
    },
  ],
};
```

## Slide Components

| Property | Type | Description |
|----------|------|-------------|
| `tag` | string | Top tag/category label (uppercase) |
| `headline` | string | Main headline. Use `<em>text</em>` for accent color |
| `headlineSize` | number | Headline font size in px (default: 88) |
| `body` | string | Body text below headline |
| `bullets` | array | Bullet point list |
| `stat` | string | Big statistic number (e.g., "67%") |
| `statLabel` | string | Label below the stat |

## Theme Colors

Pre-built color schemes:

### Dark Purple (Default)
```javascript
theme: {
  background: '#0A0A0F',
  accent: '#7C5CFC',
  textColor: '#F0EFFF',
}
```

### Dark Blue/Cyan
```javascript
theme: {
  background: '#0a0f1a',
  accent: '#00d4ff',
  textColor: '#ffffff',
}
```

### Dark Green
```javascript
theme: {
  background: '#0a0f1a',
  accent: '#00ff88',
  textColor: '#ffffff',
}
```

### Dark Gold
```javascript
theme: {
  background: '#0a0f14',
  accent: '#ffc800',
  textColor: '#ffffff',
}
```

### Coral/Warning
```javascript
theme: {
  background: '#0f0a0a',
  accent: '#ff6b4a',
  textColor: '#ffffff',
}
```

## Typography

The system uses embedded fonts:
- **Syne** (700, 800) - Headlines, brand, slide numbers
- **DM Sans** (300, 400, 500) - Body text, tags, bullets

Fonts are base64-encoded in `fonts.json` - no external font dependencies.

## Visual Elements

Each slide includes:
- **Accent bar** - Vertical purple bar top-left
- **Dot grid** - Subtle grid pattern bottom-right
- **Slide counter** - "01 / 05" format top-right
- **Brand name** - Bottom-left
- **CTA** - Bottom-right on last slide only

## Dependencies

```bash
# First time setup:
cd ~/.claude/plugins/marketplaces/neely-brain-dump-marketplace/tools/carousel-gen
npm install
```

Requires:
- Node.js 18+
- Puppeteer (uses system Chrome/Chromium)

## Workflow

1. **Edit content** in `generate.js` → `CAROUSEL` object
2. **Run** `npm run generate`
3. **Check** `./output/` for PNG files
4. **Upload** to LinkedIn/Instagram as carousel

## Copying Output

```bash
# SCP to local machine
scp root@192.168.1.100:~/.claude/plugins/marketplaces/neely-brain-dump-marketplace/tools/carousel-gen/output/*.png .

# Or zip for transfer
cd ~/.claude/plugins/marketplaces/neely-brain-dump-marketplace/tools/carousel-gen
zip -r carousel.zip output/
```

## Troubleshooting

### Puppeteer fails to launch
```bash
# Install Chromium (Debian/Ubuntu)
apt-get install -y chromium

# The script auto-detects /usr/bin/chromium
# Or override with env var:
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

### Fonts not rendering
The fonts are embedded as base64 in `fonts.json`. If missing:
```bash
# Regenerate fonts.json from fontsource packages
# (this is rarely needed - fonts.json should be included)
```

## Replacing Old Systems

This replaces:
- `/root/carousel_generator.py` (PIL-based)
- `/root/create_slide.py` family
- `/root/create_*_carousel.py` scripts

The new system is simpler: edit JS object → run → done.
