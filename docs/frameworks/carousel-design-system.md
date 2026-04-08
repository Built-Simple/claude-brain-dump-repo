# Carousel Design System

**DEPRECATED:** This document describes the old PIL/Python-based carousel system.

**Use the new system instead:** `neely-brain-dump:carousel-gen` skill

```bash
# New workflow
cd ~/.claude/plugins/marketplaces/neely-brain-dump-marketplace/tools/carousel-gen
# Edit generate.js with your content
npm run generate
# Output: ./output/slide-*.png
```

See skill documentation: `Skill(neely-brain-dump:carousel-gen)`

---

## Archive: Old System Reference

The information below is kept for historical reference only.

<details>
<summary>Click to expand old documentation</summary>

### Overview (OLD)

This document captures the visual design system used for Instagram/LinkedIn carousels that perform well. The aesthetic is "data center technical" - professional, clean, and infrastructure-focused without being cluttered.

### Color Palette (OLD)

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
}
```

### File Locations (OLD - No longer maintained)

| Resource | Path |
|----------|------|
| UDP Carousel Script | `/root/udp_carousel_v3/create_carousel.py` |
| Sovereign Compute Script | `/root/sovereign-compute-carousel/create_carousel.py` |

</details>

---

*Deprecated: April 2026*
*Replaced by: carousel-gen (Puppeteer/HTML-based system)*
