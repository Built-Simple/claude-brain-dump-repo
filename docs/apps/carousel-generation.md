# Carousel Generation Guide

**Last Updated:** April 13, 2026
**Location:** `/root/carousel-gen/` on Giratina

## Overview

Generate Instagram/LinkedIn carousel slides (1080x1350px) using Puppeteer and Handlebars templates. Dark theme with purple accent, Syne + DM Sans fonts.

## Quick Start

```bash
cd /root/carousel-gen

# Generate all carousels
node generate-all.js

# Output appears in /root/carousel-gen/output-all/<carousel-name>/
```

## Directory Structure

```
/root/carousel-gen/
├── carousels.js           # All carousel definitions (THEME + ALL_CAROUSELS)
├── generate-all.js        # Batch generator script
├── generate.js            # Single carousel generator (edit CAROUSEL const)
├── fonts.json             # Base64-encoded Syne + DM Sans fonts
├── output-all/            # Generated PNG files by carousel
│   ├── AR-1-missed-calls/
│   │   ├── slide-01.png
│   │   ├── slide-02.png
│   │   └── ...
│   ├── RM-1-generic-responses/
│   └── ...
├── captions-threads.cjs   # Short captions for Threads (<500 chars)
├── schedule-simple.cjs    # Main scheduling script
└── schedule-remaining-simple.cjs  # For scheduling after rate limits
```

## Adding New Carousels

### 1. Edit carousels.js

Add to the `ALL_CAROUSELS` object:

```javascript
'AR-10-38-percent-answered': {
  name: 'AR-10: Only 38% of Calls Get Answered',
  theme: THEME,  // Uses shared theme
  slides: [
    {
      tag: 'Study Name',           // Optional - appears in pill above headline
      headline: 'Main text with <em>emphasis</em>.',
      body: 'Supporting text below headline.',
      headlineSize: 72,            // Default is 88, reduce for longer text
    },
    {
      stat: '78%',                 // Large stat display
      statLabel: 'of customers buy from whoever responds first',
    },
    {
      headline: 'List slide',
      bullets: [
        'First point',
        'Second point',
        'Third point',
      ],
      headlineSize: 68,
    },
  ],
},
```

### 2. Generate

```bash
node generate-all.js
```

### 3. Copy to Buffer Killer (for hosting)

```bash
# Single carousel
scp -r /root/carousel-gen/output-all/AR-10-38-percent-answered root@192.168.1.52:/tmp/
ssh root@192.168.1.52 "pct push 311 /tmp/AR-10-38-percent-answered /root/buffer-killer-deployment/public/carousels/AR-10-38-percent-answered"

# Multiple carousels
for c in AR-10-38-percent-answered AR-11-78-percent-first; do
  scp -r /root/carousel-gen/output-all/$c root@192.168.1.52:/tmp/
  ssh root@192.168.1.52 "pct push 311 /tmp/$c /root/buffer-killer-deployment/public/carousels/$c"
done
```

Images become accessible at:
`https://buffer-killer-admin.built-simple.ai/carousels/<carousel-name>/slide-01.png`

## Slide Types

### 1. Headline + Body
```javascript
{
  tag: 'Optional Tag',
  headline: 'Main text with <em>emphasis</em>.',
  body: 'Supporting text.',
  headlineSize: 72,  // Reduce for longer headlines
}
```

### 2. Large Stat
```javascript
{
  tag: 'Source',
  stat: '78%',
  statLabel: 'description of what the stat means',
}
```

### 3. Bullet List
```javascript
{
  headline: 'List header',
  bullets: ['Point 1', 'Point 2', 'Point 3'],
  headlineSize: 68,
}
```

### 4. CTA Slide (last slide)
Last slide automatically gets "built-simple.ai" CTA in footer.

## Theme

Defined in `carousels.js`:

```javascript
export const THEME = {
  background: '#0A0A0F',   // Dark navy/black
  accent: '#7C5CFC',       // Purple
  textColor: '#F0EFFF',    // Off-white
  brand: 'Built Simple AI',
  cta: 'built-simple.ai',
};
```

## Headline Size Guide

| Content Length | headlineSize |
|---------------|--------------|
| Short (1-2 lines) | 88 (default) |
| Medium (2-3 lines) | 72-76 |
| Long (3-4 lines) | 64-68 |
| Very long with body | 60 |

## Current Carousels (30 total)

### ReviewMaster (14)
- RM-1 through RM-14

### AI Receptionist - Original (9)
- AR-1 through AR-9

### AI Receptionist - Research-Backed (7)
- AR-10-38-percent-answered (411 Locals, Invoca 60M calls)
- AR-11-78-percent-first (MIT/HBR study)
- AR-12-37-percent-reviews (SwingPoint Media, PwC, Vonage)
- AR-13-industry-miss-rates (Invoca industry benchmarks)
- AR-14-after-hours (Ruby 25.3M calls, IBISWorld)
- AR-15-receptionist-cost (BLS May 2024, SHRM)
- AR-16-clio-law-firms (Clio 2024 Legal Trends Report)

## Scheduling Posts

### Via Buffer Killer API

```bash
curl -X POST http://192.168.1.149:3080/api/v1/post \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your caption here",
    "platforms": ["instagram", "late_threads", "linkedin"],
    "imageUrls": [
      "https://buffer-killer-admin.built-simple.ai/carousels/AR-1-missed-calls/slide-01.png",
      "https://buffer-killer-admin.built-simple.ai/carousels/AR-1-missed-calls/slide-02.png"
    ],
    "scheduledTime": "2026-04-14T10:00:00-04:00"
  }'
```

### Using Schedule Scripts

```bash
cd /root/carousel-gen

# Schedule all carousels
node schedule-simple.cjs

# If rate limited, wait and run remaining
node schedule-remaining-simple.cjs
```

## Platform-Specific Notes

### Threads
- **500 character limit** - use short captions from `captions-threads.cjs`
- Instagram + Threads in same API call counts as 1 Late API post

### Instagram
- Requires images (no text-only posts)
- Images must be publicly accessible URLs

### LinkedIn
- Can use longer captions with hashtags
- Native API, no Late quota

### Late/Zernio API
- Free tier: 20 posts/month
- Multiple platforms in one call = 1 post
- API rebranded from getlate.dev to zernio.com
- **API endpoint**: `https://api.zernio.com/v1/posts`
- **Media field**: Use `media` array (not `mediaItems`) for images

## Troubleshooting

### Rate Limiting
Buffer Killer API has rate limits. If you see "Too many requests", wait 60 seconds.

### ES Module Errors
Scripts use `.cjs` extension for CommonJS. If you see "module is not defined", rename `.js` to `.cjs`.

### Images Not Loading
Verify images are accessible:
```bash
curl -I https://buffer-killer-admin.built-simple.ai/carousels/AR-1-missed-calls/slide-01.png
```

### Images Not Posting (Text-Only Posts)
If posts appear as text-only without images:
1. Verify `metadata` in database contains `imageUrls` array
2. Check Buffer Killer logs for "Adding X images to post"
3. Ensure Zernio API uses `media` field (not `mediaItems`) - fixed April 2026

### LinkedIn Carousel Support
LinkedIn carousel posts are now fully supported (up to 9 images):
- Automatically uses Document API for multi-image posts
- Downloads images from public URLs and uploads to LinkedIn
- Single image posts use simpler UGC API with `originalUrl`
- Fixed April 15, 2026

## Research Sources for New Carousels

When adding research-backed carousels, cite sources on slides:

| Source | Sample Size | Year | Topics |
|--------|-------------|------|--------|
| 411 Locals | 85 businesses, 58 industries | 2016 | Answer rates |
| Invoca | 60 million calls, 9 industries | 2025 | Industry benchmarks |
| MIT/HBR (Dr. James Oldroyd) | Lead response study | 2011 | Speed to lead |
| Ruby Receptionists | 25.3 million calls | 2022 | After-hours trends |
| Clio Legal Trends | 500 law firms (secret shopper) | 2024 | Legal intake |
| BLS | Government data | 2024 | Receptionist costs |
| PwC | 15,000 consumers | 2018 | Customer experience |
| Vonage | 7,000 participants | 2024 | Customer engagement |

## Scheduling Workflow

The current scheduling approach schedules posts separately for different caption lengths:

```
Instagram + LinkedIn → Full captions (hashtags, longer text)
Threads → Short captions (<500 chars from captions-threads.cjs)
```

Posts publish at **10:00 AM EDT** (7:00 AM Pacific) on weekdays.

---
*Created: April 13, 2026*
*Updated: April 15, 2026 - Added Zernio API fix, scheduling workflow*
