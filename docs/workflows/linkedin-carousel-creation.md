# LinkedIn Carousel Creation Workflow

**Created:** 2026-01-10
**Status:** ACTIVE
**Criticality:** HIGH - Revenue-generating marketing content

---

## Purpose

Create professional LinkedIn carousel slides (1080x1350px) with dark gradient backgrounds, accent sparkles, and clean typography. Slides are generated as numbered PNGs for easy sequential upload to LinkedIn.

---

## Quick Start

```bash
# 1. Copy a template script
cp /root/create_plumbing_carousel.py /root/create_new_carousel.py

# 2. Edit the content (see Content Structure below)
nano /root/create_new_carousel.py

# 3. Run the script
python3 /root/create_new_carousel.py

# 4. Email to yourself
# (see Email Section below)
```

---

## Technical Specifications

### Canvas Size
- **Width:** 1080px
- **Height:** 1350px
- **Format:** PNG
- **Naming:** `slide_01.png` through `slide_10.png` (for easy LinkedIn ordering)

### Font Directory
```
/root/.claude/plugins/cache/anthropic-agent-skills/example-skills/69c0b1a06741/skills/canvas-design/canvas-fonts/
```

**Available Fonts:**
- `InstrumentSans-Regular.ttf` - Body text
- `InstrumentSans-Bold.ttf` - Titles, emphasis
- `InstrumentSans-Italic.ttf` - Quotes, subtle emphasis

### Typical Font Sizes
| Purpose | Size |
|---------|------|
| Main title | 64-72px Bold |
| Accent/emphasis | 52-56px Bold |
| Body large | 48-52px Regular |
| Body | 44px Regular |
| Small/subtitle | 38px Regular |

---

## Color Schemes Used

### 1. Dark Slate + Electric Blue (Software/Tech)
```python
GRADIENT_TOP = (25, 30, 38)
GRADIENT_BOTTOM = (12, 14, 20)
ACCENT_COLOR = (80, 160, 255)
```

### 2. Deep Blue + Copper (Plumbing/Infrastructure)
```python
GRADIENT_TOP = (18, 32, 48)
GRADIENT_BOTTOM = (8, 16, 28)
ACCENT_COLOR = (205, 127, 50)
```

### 3. Charcoal + Dual Accent (Framework/Comparison)
```python
GRADIENT_TOP = (28, 32, 38)
GRADIENT_BOTTOM = (12, 14, 18)
ACCENT_TEAL = (64, 180, 180)    # Connection
ACCENT_AMBER = (220, 160, 60)   # Filtering
```

### 4. Dark Navy + Gold (Professional/Reviews)
```python
GRADIENT_TOP = (20, 25, 40)
GRADIENT_BOTTOM = (10, 12, 25)
ACCENT_COLOR = (255, 200, 80)
```

### 5. Purple/Indigo + Teal (SEO/Digital)
```python
GRADIENT_TOP = (35, 25, 55)
GRADIENT_BOTTOM = (15, 12, 30)
ACCENT_COLOR = (80, 200, 180)
```

### 6. Forest Green + Amber (Home Services)
```python
GRADIENT_TOP = (20, 35, 28)
GRADIENT_BOTTOM = (10, 18, 14)
ACCENT_COLOR = (220, 160, 60)
```

---

## Core Functions

### 1. Create Gradient Background
```python
def create_gradient(width, height, top_color, bottom_color):
    """Create a vertical gradient background."""
    img = Image.new('RGB', (width, height))
    for y in range(height):
        ratio = y / height
        r = int(top_color[0] + (bottom_color[0] - top_color[0]) * ratio)
        g = int(top_color[1] + (bottom_color[1] - top_color[1]) * ratio)
        b = int(top_color[2] + (bottom_color[2] - top_color[2]) * ratio)
        for x in range(width):
            img.putpixel((x, y), (r, g, b))
    return img
```

### 2. Draw Sparkle Accent
```python
def draw_sparkle(draw, cx, cy, size, color):
    """Draw a sparkle/star accent in bottom-right corner."""
    # Main cross
    draw.line([(cx - size, cy), (cx + size, cy)], fill=color, width=3)
    draw.line([(cx, cy - size), (cx, cy + size)], fill=color, width=3)
    # Diagonal lines
    small = int(size * 0.6)
    draw.line([(cx - small, cy - small), (cx + small, cy + small)], fill=color, width=2)
    draw.line([(cx - small, cy + small), (cx + small, cy - small)], fill=color, width=2)
    # Center glow
    for r in range(6, 0, -1):
        alpha_color = tuple(min(255, c + (6-r)*20) for c in color)
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=alpha_color)
```

**Standard placement:** `draw_sparkle(draw, WIDTH - 120, HEIGHT - 150, 35, ACCENT_COLOR)`

### 3. Draw Centered Text
```python
def draw_centered_text(draw, text, y, font, color=TEXT_COLOR):
    """Draw horizontally centered text."""
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    x = (WIDTH - text_width) // 2
    draw.text((x, y), text, font=font, fill=color)
    return bbox[3] - bbox[1]
```

### 4. Draw Left-Aligned Text
```python
def draw_left_text(draw, text, x, y, font, color=TEXT_COLOR):
    """Draw left-aligned text for lists/arrows."""
    draw.text((x, y), text, font=font, fill=color)
    bbox = draw.textbbox((0, 0), text, font=font)
    return bbox[3] - bbox[1]
```

---

## Content Structure Patterns

### Hook Slide (Slide 1)
```python
y = 350  # Start position (vertical center-ish)
lines = [
    ("Main hook line 1", font_body_large, TEXT_COLOR),
    ("Main hook line 2", font_body_large, TEXT_COLOR),
    ("", None, None),  # Empty line = spacing
    ("Punch line", font_accent, ACCENT_COLOR),
]
```

### Title + Content Slide
```python
draw_centered_text(draw, "Slide Title", 180, font_title, ACCENT_COLOR)

y = 340  # Content starts below title
lines = ["Line 1", "Line 2", "", "Emphasis line"]
for line in lines:
    if line == "":
        y += 50  # Paragraph spacing
    elif "keyword" in line:
        draw_centered_text(draw, line, y, font_accent, ACCENT_COLOR)
        y += 80
    else:
        draw_centered_text(draw, line, y, font_body_large)
        y += 70
```

### Arrow List Slide
```python
items = [
    "First item description",
    "Second item description",
    "Third item description"
]

y = 300
for item in items:
    draw_left_text(draw, f"→ {item}", 120, y, font_body)
    y += 75
```

### Comparison Slide (Good vs Bad)
```python
y = 300
draw_centered_text(draw, "Good:", y, font_accent, (100, 200, 100))  # Green
y += 80
for item in good_items:
    draw_left_text(draw, f"→ {item}", 200, y, font_body)
    y += 65

y += 60
draw_centered_text(draw, "Bad:", y, font_accent, (255, 100, 100))  # Red
y += 80
for item in bad_items:
    draw_left_text(draw, f"→ {item}", 200, y, font_body)
    y += 65
```

---

## Email Delivery

### Python Email Script
```python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
import os

msg = MIMEMultipart()
msg['From'] = 'root@giratina'
msg['To'] = 'info@built-simple.ai'
msg['Subject'] = 'Carousel Name - LinkedIn Carousel'

body = """Carousel description here.

Slides:
1. Slide 1 description
2. Slide 2 description
...
"""

msg.attach(MIMEText(body, 'plain'))

slide_dir = '/root/carousel_directory'
for i in range(1, 11):
    filepath = os.path.join(slide_dir, f'slide_{i:02d}.png')
    with open(filepath, 'rb') as f:
        part = MIMEBase('image', 'png')
        part.set_payload(f.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f'attachment; filename="slide_{i:02d}.png"')
        msg.attach(part)

from subprocess import Popen, PIPE
p = Popen(['/usr/sbin/sendmail', '-t', '-oi'], stdin=PIPE)
p.communicate(msg.as_bytes())
print("Email sent!")
```

---

## Complete Template Script

```python
#!/usr/bin/env python3
"""
[CAROUSEL NAME] - LinkedIn Carousel
[Color scheme description]
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Canvas dimensions
WIDTH = 1080
HEIGHT = 1350

# Color scheme
GRADIENT_TOP = (25, 30, 38)
GRADIENT_BOTTOM = (12, 14, 20)
ACCENT_COLOR = (80, 160, 255)
TEXT_COLOR = (255, 255, 255)
SUBTITLE_COLOR = (170, 180, 190)

# Font paths
FONT_DIR = "/root/.claude/plugins/cache/anthropic-agent-skills/example-skills/69c0b1a06741/skills/canvas-design/canvas-fonts"
FONT_REGULAR = os.path.join(FONT_DIR, "InstrumentSans-Regular.ttf")
FONT_BOLD = os.path.join(FONT_DIR, "InstrumentSans-Bold.ttf")
FONT_ITALIC = os.path.join(FONT_DIR, "InstrumentSans-Italic.ttf")

# Output directory
OUTPUT_DIR = "/root/new_carousel"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# [Paste the 4 core functions here: create_gradient, draw_sparkle, draw_centered_text, draw_left_text, save_slide]

# Load fonts
font_title = ImageFont.truetype(FONT_BOLD, 68)
font_body_large = ImageFont.truetype(FONT_REGULAR, 50)
font_body = ImageFont.truetype(FONT_REGULAR, 44)
font_accent = ImageFont.truetype(FONT_BOLD, 52)

# ============ SLIDE 1 ============
img = create_gradient(WIDTH, HEIGHT, GRADIENT_TOP, GRADIENT_BOTTOM)
draw = ImageDraw.Draw(img)
draw_sparkle(draw, WIDTH - 120, HEIGHT - 150, 35, ACCENT_COLOR)

# [Add slide content here]

save_slide(img, 1)

# ============ SLIDE 2-10 ============
# [Repeat pattern for each slide]

print(f"All slides saved to {OUTPUT_DIR}")
```

---

## Existing Carousel Scripts

| Script | Theme | Color Scheme |
|--------|-------|--------------|
| `/root/create_software_v2.py` | Software Sucks | Dark slate + Electric blue |
| `/root/create_plumbing_carousel.py` | AI is Plumbing | Deep blue + Copper |
| `/root/create_connection_filtering_carousel.py` | Connection vs Filtering | Charcoal + Teal/Amber |
| `/root/create_all_slides.py` | Restaurant Reviews | Dark navy + Gold |
| `/root/create_seo_slides.py` | SEO Focus | Purple + Teal |
| `/root/create_salon_slides.py` | Hair Salon | Charcoal + Rose gold |
| `/root/create_industry_carousels.py` | 4 Industries | Various |

---

## Troubleshooting

### Text Running Off Edges
- Reduce font size
- Split long lines manually
- Use `draw_left_text` with smaller x offset (e.g., 100 instead of 120)

### Unicode Characters Not Rendering
- Avoid special Unicode (checkmarks, emojis)
- Use ASCII alternatives: `→` works, but draw custom symbols if needed

### Slides Look Too Crowded
- Increase line spacing (y += 75 instead of 65)
- Add more empty line breaks
- Start content lower (y = 350 instead of 300)

---

## Adapting for Instagram

**Instagram Carousel Specs:**
- Square: 1080x1080px
- Portrait: 1080x1350px (same as LinkedIn!)
- Stories: 1080x1920px

For Instagram, modify:
1. `HEIGHT = 1080` for square format
2. Adjust y-positions to fit shorter canvas
3. Consider larger fonts (Instagram viewed on mobile)

---

*Last Updated: 2026-01-10*
*Carousels Created: Software Sucks v2, AI Plumbing, Connection vs Filtering*
