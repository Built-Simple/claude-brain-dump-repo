# Instagram Carousel Generator

**Location:** `/root/carousel_generator.py`
**Last Updated:** January 2026

---

## Overview

Python script using PIL/Pillow to generate Instagram carousel slides (1080x1350px) with dark gradient backgrounds, colored text highlights, and sparkle accents.

---

## Technical Specifications

### Dimensions
- **Width:** 1080px
- **Height:** 1350px (4:5 aspect ratio - Instagram carousel optimal)
- **Text padding:** 100px on each side (200px total)

### Color Palette
```python
DARK_NAVY = (18, 22, 38)      # Gradient top
SLATE = (45, 50, 65)           # Gradient bottom
WHITE = (255, 255, 255)        # Default text
ROSE_GOLD = (183, 110, 121)    # Salon/beauty accent

# Text highlight colors
'gold': (255, 215, 100)        # Stats, numbers, emphasis
'coral': (255, 127, 100)       # Warnings, negatives, pain points
'cyan': (100, 220, 255)        # Positive tech, solutions
'mint': (130, 255, 180)        # Checkmarks, CTAs, benefits
'rose': (255, 150, 170)        # Beauty/salon branding
'lavender': (200, 170, 255)    # Optional accent
```

### Font Sizing (Auto-scales by text length)
| Character Count | Font Size |
|-----------------|-----------|
| < 40 chars      | 60px      |
| 40-79 chars     | 52px      |
| 80-119 chars    | 46px      |
| 120-179 chars   | 40px      |
| 180+ chars      | 36px      |
| Title slides    | 68px      |

---

## Color Markup Syntax

Use `{color:text}` to highlight specific words:

```python
"{gold:88%} of customers trust online reviews"
"Reviews pile up → {coral:Rating drops}"
"{mint:✓} Google & Yelp support"
```

**Important constraints:**
- Color markers cannot span line breaks
- Keep colored phrases on single lines
- If a long colored phrase clips, split it:
  ```python
  # BAD - will clip
  "{cyan:Before they ever call your office.}"

  # GOOD - split across lines
  "Before they ever\n{cyan:call your office.}"
  ```

---

## Key Lessons Learned

### 1. Line Breaking Strategy
- Explicit `\n` breaks are respected
- Empty lines (`\n\n`) create visual spacing
- Long colored phrases don't auto-wrap - they clip
- Always test slides 1, 5, and 10 for edge cases

### 2. Text Clipping Prevention
- Max text width = WIDTH - 200px (100px padding each side)
- Colored text is treated as a single token for wrapping
- Keep colored phrases under ~25 characters
- When in doubt, add explicit line breaks

### 3. Visual Hierarchy
- **Slide 1:** Hook - short, punchy, colored keyword
- **Slides 2-8:** Story/stats - mix of white and colored
- **Slide 9:** Features - checkmarks in mint, key benefit in gold
- **Slide 10:** CTA - URL in cyan, offer in gold, tagline in mint

### 4. Color Psychology for Business Content
| Color | Use For |
|-------|---------|
| Gold | Statistics, money, time savings |
| Coral | Pain points, warnings, negatives |
| Cyan | Solutions, tech, URLs, positives |
| Mint | Checkmarks, benefits, CTAs |
| Rose | Beauty/salon specific branding |

### 5. Font Availability
Script checks these paths in order:
```
/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf
/usr/share/fonts/truetype/freefont/FreeSansBold.ttf
```
Falls back to PIL default if none found.

---

## Usage Examples

### Basic Carousel
```python
from carousel_generator import generate_carousel

slides = [
    "Hook slide with {coral:problem}",
    "Second slide explaining the {gold:stats}",
    # ... 8 more slides
    "{cyan:yoursite.com}\n\n{gold:Free trial}\n\n{mint:Start today.}",
]

generate_carousel(slides, "my_carousel", use_rose_gold=False)
```

### Salon/Beauty Carousel (Rose Gold)
```python
generate_carousel(slides, "salon_promo", use_rose_gold=True)
```

### Email Integration
```python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

# See /root/carousel_generator.py for full email code
```

---

## Output Location

All carousels saved to: `/root/carousels/{carousel_name}/`

Files: `slide_01.png` through `slide_10.png`

---

## Carousels Created (January 2026)

### ReviewMaster Pro (reviewmaster.built-simple.ai)
1. Restaurant Owners - `/root/carousels/restaurant_owners_v2/`
2. SEO-Focused - `/root/carousels/seo_focused/`
3. Hair Salons (rose gold) - `/root/carousels/hair_salons/`
4. Auto Repair - `/root/carousels/auto_repair/`
5. Dental Practices - `/root/carousels/dental_practices/`
6. Home Services - `/root/carousels/home_services/`
7. Hotels & Airbnb - `/root/carousels/hotels_airbnb/`

### Educational/Thought Leadership
8. Why Small Business Software Sucks - `/root/carousels/software_sucks/`
9. The Setup Trap - `/root/carousels/setup_trap/`
10. AI Isn't Magic, It's Plumbing - `/root/carousels/ai_plumbing/`
11. Connection vs Filtering Problems - `/root/carousels/connection_filtering/`

---

## Future Improvements

- [ ] Add logo/watermark support
- [ ] Multiple gradient presets
- [ ] Auto-detect optimal font size per slide
- [ ] LinkedIn format support (1200x1200)
- [ ] Batch regeneration with different color schemes
