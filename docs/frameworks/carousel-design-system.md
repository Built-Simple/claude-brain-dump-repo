# Carousel Design System

**Last Updated:** January 21, 2026
**Reference Implementation:** `/root/udp_carousel_v3/create_carousel.py`
**Example Output:** `/root/sovereign-compute-carousel/output/`

---

## Overview

This document captures the visual design system used for Instagram/LinkedIn carousels that perform well. The aesthetic is "data center technical" - professional, clean, and infrastructure-focused without being cluttered.

## Color Palette

```python
COLORS = {
    'bg_dark': '#0a0f1a',       # Primary background - deep navy/black
    'bg_darker': '#050810',     # Darker variant for gradients
    'accent_blue': '#00d4ff',   # Cyan - primary accent, active systems
    'accent_green': '#00ff88',  # Green - success, healthy, operational
    'accent_purple': '#8b5cf6', # Purple - premium, encryption, compliance
    'text_white': '#ffffff',    # Primary text
    'text_gray': '#94a3b8',     # Secondary text
    'text_dim': '#64748b',      # Tertiary/muted text
    'highlight': '#22d3ee',     # Highlight variant of cyan
    'warning': '#f59e0b',       # Orange/amber - warnings, attention
    'border': '#1e293b',        # Subtle borders
}
```

### Color Usage Rules

| Color | Use For |
|-------|---------|
| `accent_blue` | Primary headlines, active states, CTAs |
| `accent_green` | Success states, "healthy" concepts, confirmation boxes |
| `accent_purple` | Premium features, compliance, security |
| `warning` | Problems, warnings, things to avoid |
| `text_white` | Primary body text, important statements |
| `text_gray` | Secondary body text, descriptions |
| `text_dim` | Tertiary text, labels, slide numbers |

## Typography

### Font Stack

```python
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"
```

### Size Guidelines (1080x1080 canvas)

| Element | Font | Size |
|---------|------|------|
| Main headline | Bold | 64-72px |
| Secondary headline | Bold | 48-56px |
| Subheadline | Bold | 36-42px |
| Body text | Regular | 26-28px |
| Labels | Regular/Mono | 20-24px |
| Slide numbers | Mono | 24px |
| Large stats | Mono | 72-96px |

## Background Treatment

### Diagonal Gradient

```python
def create_gradient_bg(width, height, color1, color2, direction='diagonal'):
    """Create a gradient background"""
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)

    r1, g1, b1 = hex_to_rgb(color1)
    r2, g2, b2 = hex_to_rgb(color2)

    for y in range(height):
        for x in range(width):
            if direction == 'diagonal':
                ratio = (x + y) / (width + height)
            elif direction == 'vertical':
                ratio = y / height
            else:
                ratio = x / width

            r = int(r1 + (r2 - r1) * ratio)
            g = int(g1 + (g2 - g1) * ratio)
            b = int(b1 + (b2 - b1) * ratio)
            draw.point((x, y), fill=(r, g, b))

    return img
```

### Gradient Combinations

| Slide Type | Start Color | End Color |
|------------|-------------|-----------|
| Hook/Intro | `#0a0f1a` | `#1a0a1f` (slight purple) |
| Problem | `#0a0f1a` | `#1f0a0a` (slight red) |
| Solution | `#0a0f1a` | `#0a1f1a` (slight green) |
| Process | `#0a0f1a` | `#0f1a0f` (slight green) |
| CTA | `#0a0f1a` | `#1a0f0a` (slight orange) |

## Box Components

### Filled Header Box

The signature component - a box with a colored filled header and content below.

```python
def draw_filled_header_box(draw, x, y, width, height, header_height,
                           header_text, body_text, color, fonts):
    """
    Draw a box with filled header bar.

    Key: Text must be VERTICALLY CENTERED in the header.
    """
    # Outer box
    draw.rectangle([x, y, x + width, y + height],
                   outline=hex_to_rgb(color), width=3)

    # Filled header
    draw.rectangle([x, y, x + width, y + header_height],
                   fill=hex_to_rgb(color))

    # Center text vertically in header
    bbox = draw.textbbox((0, 0), header_text, font=fonts['header'])
    text_h = bbox[3] - bbox[1]
    text_y = y + (header_height - text_h) // 2

    draw.text((x + 20, text_y), header_text,
              font=fonts['header'], fill=hex_to_rgb(COLORS['bg_dark']))

    # Body text below header
    draw.text((x + 20, y + header_height + 15), body_text,
              font=fonts['body'], fill=hex_to_rgb(COLORS['text_white']))
```

### Header Heights

| Content Type | Header Height |
|--------------|---------------|
| Small labels (1 line) | 45-50px |
| Medium text | 55-60px |
| Large tier names | 80px |

## Text Shadow

Adds depth to headlines:

```python
def draw_text_with_shadow(draw, pos, text, font, fill,
                          shadow_color=(0, 0, 0), shadow_offset=2):
    """Draw text with shadow for depth"""
    x, y = pos
    # Shadow first
    draw.text((x + shadow_offset, y + shadow_offset), text,
              font=font, fill=shadow_color)
    # Main text on top
    draw.text((x, y), text, font=font, fill=fill)
```

## Layout Principles

### Margins & Spacing

- **Left margin:** 80px
- **Right margin:** 80px (slide number at 980px)
- **Top margin:** 60-120px depending on content
- **Bottom margin:** 50-80px
- **Between elements:** 40-50px vertical spacing

### Slide Number Position

Always bottom-right: `(980, 1020)` with format `"N/7"`

### Divider Lines

Horizontal accent lines after headlines:

```python
# Standard divider
draw.rectangle([80, y, 500, y + 4], fill=hex_to_rgb(COLORS['accent_blue']))
```

## Visual Elements

### Server Icons

Simple server rack representation:

```python
def draw_server_icons(draw, x, y, count=5):
    """Draw a row of server rack icons"""
    for i in range(count):
        sx = x + i * 70
        # Server body
        draw.rectangle([sx, y, sx + 50, y + 40],
                       outline=hex_to_rgb(COLORS['accent_green']), width=2)
        draw.rectangle([sx + 5, y + 5, sx + 45, y + 25],
                       fill=hex_to_rgb(COLORS['accent_green'] + '40'))
        # Status light
        draw.ellipse([sx + 40, y + 30, sx + 46, y + 36],
                     fill=hex_to_rgb(COLORS['accent_green']))
```

### Status Indicators

Simple dots (no glow) for status representation:

```python
# Status indicator row
colors = [COLORS['warning'], COLORS['warning'], COLORS['text_dim'],
          COLORS['text_dim'], COLORS['text_dim']]
for i, color in enumerate(colors):
    ix = 200 + i * 150
    c = hex_to_rgb(color)
    draw.ellipse([ix-8, indicator_y-8, ix+8, indicator_y+8], fill=c)
```

### Bullet Points

Simple colored dots:

```python
# Bullet point
c = hex_to_rgb(COLORS['accent_blue'])
draw.ellipse([bx-5, y+9, bx+5, y+19], fill=c)
draw.text((bx + 30, y), text, font=body_font, fill=hex_to_rgb(COLORS['text_white']))
```

## What NOT to Do

Based on iteration feedback:

1. **No tech grid overlay** - Looks cluttered
2. **No glow dots scattered across background** - Distracting
3. **No thin/light fonts for headlines** - Lacks impact
4. **No corner brackets** - Too busy
5. **No concentric circles/orbital graphics** - Over-designed
6. **Text must be vertically centered in headers** - Critical for professional look

## Slide Structure Templates

### Hook Slide (Slide 1)
- Large stacked headline (3 lines, different colors)
- Divider line
- 2-3 lines supporting text
- Server icons at bottom
- Slide number

### Problem Slide (Slide 2)
- Two-line headline (second line in warning color)
- Divider
- 3-4 body text lines
- Filled header box with key insight
- Status indicators at bottom

### Solution Slide (Slide 3)
- Product name (two-line headline)
- Divider
- Tagline (2 lines)
- 2x2 grid of capability boxes with filled headers
- Bottom tagline

### Process Slide (Slide 4)
- Headline
- Divider
- Vertical timeline with numbered circles
- 4 steps with title + description

### Comparison Slide (Slide 5)
- Headline
- Subtitle
- Two side-by-side boxes with:
  - Filled header (tier name)
  - Hardware name
  - Nested stat box (with filled header)
  - Capacity info
  - Audience line

### Audience Slide (Slide 6)
- Two-line headline
- Divider
- Bulleted list (6 items)
- Compliance box with filled header

### CTA Slide (Slide 7)
- Two-line headline
- Divider
- Body text
- Contact box with filled header
- Server icons
- Closing tagline

## File Locations

| Resource | Path |
|----------|------|
| UDP Carousel Script | `/root/udp_carousel_v3/create_carousel.py` |
| UDP Slides | `/root/udp_carousel_v3/slide_*.png` |
| Sovereign Compute Script | `/root/sovereign-compute-carousel/create_carousel.py` |
| Sovereign Compute Slides | `/root/sovereign-compute-carousel/output/` |

---

*Created: January 21, 2026*
*Based on UDP carousel v4 and sovereign-compute carousel*
