# Carousel Generation System

**Location:** `/root/carousel-gen/` on Giratina (192.168.1.100)
**Purpose:** Generate Instagram/LinkedIn carousel slides as PNG images
**Last Updated:** April 26, 2026

---

## Overview

The carousel generation system creates professional social media carousel slides for Built Simple AI marketing content. It produces:

- **ReviewMaster (RM)** carousels - promoting the AI review response product
- **AI Receptionist (AR)** carousels - promoting the AI phone answering product

Each carousel is 5-8 slides at **1080×1350px** (Instagram portrait ratio), rendered at **2× resolution** (2160×2700px) for retina displays.

---

## Directory Structure

```
/root/carousel-gen/
├── carousels.js          # All carousel content definitions (slides, text, variants)
├── generate.js           # Single carousel generator (edit CAROUSEL object in file)
├── generate-all.js       # Batch generator - generates all carousels in carousels.js
├── fonts.json            # Base64-encoded Syne + DM Sans fonts
├── templates/            # (unused) HTML templates directory
├── output/               # Single carousel output (from generate.js)
├── output-all/           # All generated carousels (from generate-all.js)
│   ├── AR-1-v2-marketing-problem/
│   │   ├── slide-01.png
│   │   ├── slide-02.png
│   │   └── ...
│   └── ...
├── scheduler-ui/         # Web UI for scheduling posts
│   ├── index.html        # Scheduler web interface
│   └── server.cjs        # Node.js server (port 3088)
├── schedule-weeks2-10.js # Scheduling script for 10-week campaign
├── captions.md           # All captions for posts (LinkedIn + Threads)
├── ALL_POSTS.md          # Complete post schedule
└── deploy-variants.sh    # Deploy script to Buffer Killer
```

---

## Quick Start

### Generate All Carousels

```bash
cd /root/carousel-gen
node generate-all.js
```

Output appears in `output-all/` with one directory per carousel.

### Deploy to Buffer Killer

```bash
./deploy-variants.sh
```

Deploys all variants to Buffer Killer CT 311 at:
`https://buffer-killer-admin.built-simple.ai/carousels/<variant>/slide-XX.png`

### Start Scheduler UI

```bash
cd /root/carousel-gen/scheduler-ui
node server.cjs
```

Access at: http://192.168.1.100:3088

---

## Carousel Content Structure

### carousels.js

The main content file exports:

```javascript
export const THEME = {
  background: '#0A0A0F',   // Dark navy/black
  accent: '#7C5CFC',       // Purple (brand color)
  textColor: '#F0EFFF',    // Off-white
  brand: 'Built Simple AI',
  cta: 'built-simple.ai',
};

export const ALL_CAROUSELS = {
  'RM-1-generic-responses': {
    name: 'RM-1: Generic Review Responses Are Killing Your Reputation',
    theme: THEME,
    slides: [
      {
        tag: 'The Problem',           // Optional pill label
        headline: 'Main <em>text</em>', // Use <em> for purple emphasis
        body: 'Supporting text',       // Smaller text below headline
        headlineSize: 72,              // Font size (default 88)
      },
      // ... more slides
    ],
  },
  // ... more carousels
};
```

### Naming Convention

| Prefix | Product | Example |
|--------|---------|---------|
| `RM-{N}` | ReviewMaster | `RM-1-generic-responses` |
| `AR-{N}` | AI Receptionist | `AR-1-missed-calls` |
| `-v{N}` | Variant (unique slide 1) | `AR-1-v2-marketing-problem` |

### Slide Types

| Type | Properties | Description |
|------|------------|-------------|
| **Headline + Body** | `headline`, `body` | Standard text slide |
| **Stat** | `stat`, `statLabel` | Large centered number |
| **Bullets** | `headline`, `bullets[]` | Bulleted list |

### Headline Size Guide

| Size | Use Case |
|------|----------|
| 88 | Short (1-2 lines) - default |
| 72-76 | Medium (2-3 lines) |
| 64-68 | Long (3-4 lines) |
| 60 | Very long with body text |

---

## Generation Process

### How It Works

1. **Load fonts** - Syne (headlines) + DM Sans (body) as base64 from `fonts.json`
2. **Build HTML template** - Handlebars template with embedded CSS
3. **Launch Puppeteer** - Headless Chrome with `--no-sandbox` (required for root)
4. **Set viewport** - 1080×1350 at 2× scale factor
5. **Render each slide** - Inject data, wait for fonts, screenshot
6. **Output PNGs** - `slide-01.png`, `slide-02.png`, etc.

### Visual Design

- **Background:** Dark navy (#0A0A0F)
- **Accent:** Purple (#7C5CFC)
- **Decorative elements:**
  - Purple accent bar (top-left)
  - Dot grid pattern (bottom-right)
  - Slide counter (top-right): "01 / 07"
- **Footer:** Brand name + CTA on last slide

### Dependencies

```json
{
  "puppeteer": "Headless Chrome for rendering",
  "handlebars": "Template engine"
}
```

Install: `npm install`

---

## Scheduling Posts

### Scheduler Web UI

The scheduler UI at http://192.168.1.100:3088 provides:

- **JSON input** - Paste schedule data as JSON array
- **Pipe-delimited input** - Simple format: `date|carousel|slides|linkedInCaption|threadsCaption`
- **Preview** - See all posts before scheduling
- **Progress tracking** - Real-time status updates
- **Activity log** - API responses and errors

### Input Formats

**JSON Format:**
```json
[
  {
    "date": "2026-07-17",
    "carousel": "RM-11-v3-beat-75-percent",
    "slides": 7,
    "linkedInCaption": "Full LinkedIn caption...",
    "threadsCaption": "Short threads caption..."
  }
]
```

**Pipe-Delimited Format:**
```
2026-07-17|RM-11-v3-beat-75-percent|7|LinkedIn caption...|Threads caption...
```

### Buffer Killer API

The scheduler proxies to Buffer Killer API at `http://192.168.1.149:3080/api/v1/post`

**Request body:**
```json
{
  "text": "Caption text",
  "platforms": ["linkedin"],
  "imageUrls": [
    "https://buffer-killer-admin.built-simple.ai/carousels/RM-11-v3-beat-75-percent/slide-01.png",
    "https://buffer-killer-admin.built-simple.ai/carousels/RM-11-v3-beat-75-percent/slide-02.png"
  ],
  "scheduledTime": "2026-07-17T10:00:00-04:00"
}
```

**Platforms:**
- `linkedin` - LinkedIn
- `instagram` - Instagram
- `late_threads` - Threads (delayed posting)

### Platform-Specific Captions

| Platform | Limit | Notes |
|----------|-------|-------|
| LinkedIn | 3,000 chars | Full captions with hashtags |
| Threads | 500 chars | Condensed version |
| Instagram | 2,200 chars | Uses Threads caption |

---

## Deployment

### Deploy to Buffer Killer

The `deploy-variants.sh` script:

1. Creates directories in CT 311 on Silvally (192.168.1.52)
2. Copies PNG files via `pct push`
3. Files accessible at `https://buffer-killer-admin.built-simple.ai/carousels/`

```bash
./deploy-variants.sh
```

### Manual Deployment

```bash
# Create directory
ssh root@192.168.1.52 "pct exec 311 -- mkdir -p /root/buffer-killer-deployment/public/carousels/CAROUSEL-NAME"

# Copy file
scp slide-01.png root@192.168.1.52:/tmp/
ssh root@192.168.1.52 "pct push 311 /tmp/slide-01.png /root/buffer-killer-deployment/public/carousels/CAROUSEL-NAME/slide-01.png"
```

---

## 10-Week Campaign Schedule

The system was used to schedule a 10-week content campaign (May 18 - July 24, 2026):

- **96 total posts** (48 unique carousels × 2 platform sets)
- **Posting schedule:** Monday-Friday at 10:00 AM EDT
- **Holidays skipped:** Memorial Day, Juneteenth, July 4th

### Post Distribution

| Platform | Posts Per Day | Caption Type |
|----------|---------------|--------------|
| LinkedIn | 1 | Full (3,000 char) |
| Instagram + Threads | 1 | Short (500 char) |

### Scheduling Scripts

| Script | Purpose |
|--------|---------|
| `schedule-week1.js` | Week 1 posts |
| `schedule-weeks2-10.js` | Weeks 2-10 (43 days) |
| `schedule-retry-failed.js` | Retry rate-limited posts |
| `schedule-final-retry.js` | Final 3 retries |

---

## Content Inventory

### ReviewMaster Carousels (14 total)

| ID | Topic | Slides |
|----|-------|--------|
| RM-1 | Generic responses killing reputation | 7 |
| RM-2 | Cost of ignoring reviews | 7 |
| RM-3 | Autopilot mode | 7 |
| RM-4 | 5 review mistakes | 7 |
| RM-5 | Fake 1-star reviews | 7 |
| RM-6 | DIY vs ReviewMaster ROI | 7 |
| RM-7 | Stop overcomplicating strategy | 7 |
| RM-8 | What $300/mo platforms do | 7 |
| RM-9 | 75% never respond | 7 |
| RM-10 | 97% read your responses | 7 |
| RM-11 | 0.1 stars = 25% more conversions | 7 |
| RM-12 | Responding to negatives works | 7 |
| RM-13 | Google tells you to respond | 7 |
| RM-14 | The 25% rule | 7 |

### AI Receptionist Carousels (9 total)

| ID | Topic | Slides |
|----|-------|--------|
| AR-1 | Most calls go unanswered | 6-7 |
| AR-2 | 9 PM phone call scenario | 6 |
| AR-3 | Real cost of receptionist | 7 |
| AR-4 | Stop choosing between customers | 7 |
| AR-5 | The missed call you never knew | 7-8 |
| AR-6 | 5 signs you need AI receptionist | 8 |
| AR-7 | Why every AI ad sounds the same | 7 |
| AR-8 | Phone system doesn't need to be complicated | 7 |
| AR-9 | How we set up your AI | 7 |

---

## Troubleshooting

### Font Issues

If text doesn't render correctly:
1. Check `fonts.json` exists and contains valid base64 data
2. Verify fonts load with `await page.evaluate(() => document.fonts.ready)`

### Puppeteer Errors

```bash
# Common fix for sandbox issues (running as root)
puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
```

### Rate Limiting

The Buffer Killer API may rate limit rapid requests. Add delays:

```javascript
await new Promise(r => setTimeout(r, 5000)); // 5 second delay
```

### Module Type Issues

If you see "require is not defined in ES module scope":
- Rename `.js` to `.cjs` for CommonJS files
- Or use `import` instead of `require`

---

## Related Documentation

- [Buffer Killer](buffer-killer.md) - Social media scheduling app
- [GRAPHICS_HOWTO.md](/root/carousel-gen/GRAPHICS_HOWTO.md) - Original carousel guide
- [captions.md](/root/carousel-gen/captions.md) - All post captions
