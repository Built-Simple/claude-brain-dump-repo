# LinkedIn Carousel Creation Workflow

**DEPRECATED:** This document describes the old PIL/Python-based carousel system.

**Use the new system instead:** `neely-brain-dump:carousel-gen` skill

```bash
# New workflow
cd ~/.claude/plugins/marketplaces/neely-brain-dump-marketplace/tools/carousel-gen
# Edit generate.js with your content
npm run generate
# Output: ./output/slide-*.png (1080x1350px - works for both Instagram and LinkedIn)
```

See skill documentation: `Skill(neely-brain-dump:carousel-gen)`

---

## New Workflow Summary

1. **Edit content** in `generate.js` - modify the `CAROUSEL` object
2. **Run** `npm run generate`
3. **Get PNGs** from `./output/`
4. **Upload** to LinkedIn as carousel

### Content Structure

```javascript
const CAROUSEL = {
  theme: {
    background: '#0A0A0F',
    accent: '#7C5CFC',
    textColor: '#F0EFFF',
    brand: 'Your Brand',
    cta: 'Follow for more →',
  },
  slides: [
    { tag: 'Category', headline: 'Main <em>headline</em>', body: 'Supporting text' },
    { tag: 'Stats', stat: '67%', statLabel: 'Description of stat' },
    { tag: 'Features', headline: 'Feature <em>highlight</em>', bullets: ['Point 1', 'Point 2'] },
  ],
};
```

---

## Archive: Old System Reference

<details>
<summary>Click to expand old documentation</summary>

### Old Scripts (No longer maintained)

| Script | Theme |
|--------|-------|
| `/root/create_software_v2.py` | Software Sucks |
| `/root/create_plumbing_carousel.py` | AI is Plumbing |
| `/root/create_connection_filtering_carousel.py` | Connection vs Filtering |

### Old Font Directory
```
/root/.claude/plugins/cache/anthropic-agent-skills/example-skills/.../canvas-fonts/
```

</details>

---

*Deprecated: April 2026*
*Replaced by: carousel-gen (Puppeteer/HTML-based system)*
