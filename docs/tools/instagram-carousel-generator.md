# Instagram Carousel Generator

**DEPRECATED:** This document describes the old PIL/Python-based carousel system.

**Use the new system instead:** `neely-brain-dump:carousel-gen` skill

```bash
# New workflow
cd ~/.claude/plugins/marketplaces/neely-brain-dump-marketplace/tools/carousel-gen
# Edit generate.js with your content
npm run generate
# Output: ./output/slide-*.png (1080x1350px)
```

See skill documentation: `Skill(neely-brain-dump:carousel-gen)`

---

## Archive: Old System Reference

The information below is kept for historical reference only.

<details>
<summary>Click to expand old documentation</summary>

### Location (OLD)
`/root/carousel_generator.py`

### Technical Specifications (OLD)

- Width: 1080px
- Height: 1350px (4:5 aspect ratio)
- Used PIL/Pillow for rendering
- Color markup syntax: `{color:text}`

### Carousels Created (January 2026)

1. Restaurant Owners - `/root/carousels/restaurant_owners_v2/`
2. SEO-Focused - `/root/carousels/seo_focused/`
3. Hair Salons - `/root/carousels/hair_salons/`
4. Auto Repair - `/root/carousels/auto_repair/`
5. Dental Practices - `/root/carousels/dental_practices/`
6. Home Services - `/root/carousels/home_services/`
7. Hotels & Airbnb - `/root/carousels/hotels_airbnb/`

</details>

---

*Deprecated: April 2026*
*Replaced by: carousel-gen (Puppeteer/HTML-based system)*
