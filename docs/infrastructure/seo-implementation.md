# SEO Implementation - Built Simple Services

**Last Updated:** January 19, 2026
**Status:** Implemented across all production sites

## Overview

Comprehensive SEO implementation across all Built Simple services. All sites now have consistent meta tags, Open Graph tags, Twitter Cards, and structured data where applicable.

---

## Sites with SEO Implementation

| Site | URL | Status |
|------|-----|--------|
| Built Simple (Marketing) | https://built-simple.ai | ✅ Complete |
| FixIt API | https://fixit.built-simple.ai | ✅ Complete |
| PubMed API | https://pubmed.built-simple.ai | ✅ Complete |
| ArXiv API | https://arxiv.built-simple.ai | ✅ Complete |
| Wikipedia API | https://wikipedia.built-simple.ai | ✅ Complete |
| Inbox Organizer | https://inbox.built-simple.ai | ✅ Complete |
| ReviewMaster Pro | https://reviewmaster.built-simple.ai | ✅ Complete |
| AI Receptionist | https://receptionist.built-simple.ai | ✅ Complete |

### Sites NOT Modified (Skipped)

| Site | Reason |
|------|--------|
| MyFit Pro | SvelteKit CSR - requires build process changes |
| Buffer Killer | Development mode - not production ready |

---

## SEO Elements Implemented

### Standard Meta Tags
- `<title>` - Optimized to ~60 characters
- `<meta name="description">` - 150-160 characters
- `<meta name="keywords">` - Relevant search terms
- `<meta name="robots" content="index, follow">`
- `<link rel="canonical">` - Canonical URL

### Open Graph Tags
- `og:type` - website
- `og:url` - Canonical URL
- `og:title` - Page title
- `og:description` - Page description
- `og:site_name` - "Built Simple"

### Twitter Cards
- `twitter:card` - summary_large_image
- `twitter:url` - Canonical URL
- `twitter:title` - Page title
- `twitter:description` - Page description

### Structured Data (JSON-LD)
Applied to Inbox Organizer and Receptionist:
- `SoftwareApplication` schema
- `Organization` schema
- `FAQPage` schema

---

## Files Modified

### API Sites (Giratina Containers)

| File | Container | Changes |
|------|-----------|---------|
| `/opt/pubmed-web/templates/index.html` | CT 108 | Added Twitter Cards |
| `/opt/arxiv/modules/templates.py` | CT 122 | Full SEO head section |
| `/var/www/talon-api/fixit_frontend.html` | CT 103 | Added Twitter Cards |

### API Sites (Hoopa)

| File | Container | Changes |
|------|-----------|---------|
| `/opt/wikipedia_api_production.py` | CT 213 | Added Twitter Cards |

### Applications

| File | Container/Server | Changes |
|------|------------------|---------|
| `/opt/email-sorter/templates/index.html` | CT 111 (Giratina) | Full SEO overhaul + JSON-LD |
| `/opt/reviewmaster/backend/templates/index.html` | CT 313 (Silvally) | Meta desc, OG, Twitter |
| `/opt/professional-receptionist/public/index.html` | Mew (DigitalOcean) | Full SEO overhaul + JSON-LD |

### Marketing Site

| File | Container | Changes |
|------|-----------|---------|
| `/var/www/built-simple.ai/index.html` | CT 400 (Giratina) | Fixed title length, OG URLs |

---

## Issues Discovered & Fixed

### ArXiv Duplicate Service (CRITICAL)

**Problem:** ArXiv had two systemd services running on port 8082:
- `arxiv-gpu-search.service` - OLD service running `gpu_search_api.py`
- `arxiv-api.service` - CORRECT service running `main:app`

The old service was grabbing port 8082 first, causing the new template changes to not appear.

**Solution:**
```bash
pct exec 122 -- systemctl stop arxiv-gpu-search
pct exec 122 -- systemctl disable arxiv-gpu-search
pct exec 122 -- systemctl restart arxiv-api
```

### Inbox Organizer Permissions

**Problem:** After editing the template via host filesystem, file permissions changed to `root:root 600`, causing Flask to fail with `PermissionError`.

**Solution:**
```bash
chown 100000:100000 /proxmox-zfs/subvol-111-disk-0/opt/email-sorter/templates/index.html
chmod 644 /proxmox-zfs/subvol-111-disk-0/opt/email-sorter/templates/index.html
```

---

## Verification Commands

```bash
# Check all sites for Twitter Cards
for site in arxiv pubmed fixit wikipedia inbox reviewmaster receptionist; do
  echo "=== $site ==="
  curl -s "https://$site.built-simple.ai/" | grep -E "twitter:card|og:site_name" | head -2
done

# Check marketing site
curl -s "https://built-simple.ai/" | grep -E "twitter:card|og:site_name" | head -2
```

---

## Google Analytics

All sites use the same GA4 property:
- **Measurement ID:** G-0MWDDN867X

---

## Future Considerations

1. **MyFit Pro** - Requires SvelteKit build process modification to add SEO
2. **Buffer Killer** - Add SEO when ready for production
3. **Image SEO** - Consider adding `og:image` with branded screenshots
4. **Sitemap.xml** - Most API sites serve via FastAPI routes; verify all are accessible

---

*SEO Implementation: January 19, 2026*
*ArXiv duplicate service fix: January 19, 2026*
