# Incident Log

**Purpose:** Record significant incidents, root causes, and resolutions for future reference.

---

## 2026-02-03: Google Safe Browsing "Deceptive Pages" Warning

### Symptoms
- Google Search impressions dropped to near zero across all built-simple.ai domains
- Google Search Console showed "Security Issues: Deceptive pages" warning
- Safe Browsing Transparency Report flagged built-simple.ai as unsafe
- Warning dated: January 23, 2026

### Root Cause
The file `/var/www/built-simple.ai/chatstash/index.html` (CT 400) contained **HTTrack Website Copier comments**:

```html
<!-- Mirrored from built-simple.ai/chatstash/ by HTTrack Website Copier/3.x [XR&CO'2014], Sun, 19 Oct 2025 00:45:23 GMT -->
<!-- Added by HTTrack -->
```

Google's Safe Browsing algorithm likely flagged this as:
- Potential phishing site (HTTrack is commonly used to clone legitimate sites for phishing)
- Deceptive content mirroring

The page was created on October 19, 2025, but only flagged on January 23, 2026 (possibly due to a Safe Browsing scan update).

### Resolution
1. Deleted `/var/www/built-simple.ai/chatstash/` directory entirely
2. Removed backup files containing HTTrack comments:
   - `contact.html.backup-20260108-165517`
   - `docs/index.html.backup-20260108-171927`
3. Updated `robots.txt` to remove chatstash reference
4. Submitted review request via Google Search Console

### Timeline
- **Jan 23, 2026:** Google flags site
- **Feb 3, 2026:** Issue discovered and diagnosed
- **Feb 3, 2026:** Fix applied and review requested
- **Pending:** Google review (typically 1-3 days)

### Lessons Learned
1. **Never deploy HTTrack-mirrored content** - Even for internal use, HTTrack comments trigger Safe Browsing
2. **Remove HTTrack metadata** if you must use mirrored content: `sed -i '/HTTrack/d; /Mirrored from/d' file.html`
3. **Monitor Google Search Console** regularly for security warnings
4. **Check Safe Browsing status** at: https://transparencyreport.google.com/safe-browsing/search?url=built-simple.ai

### Verification Commands
```bash
# Check for HTTrack comments in any file
pct exec 400 -- grep -r "HTTrack\|Mirrored from" /var/www/built-simple.ai/

# Check Google Safe Browsing status
# Visit: https://transparencyreport.google.com/safe-browsing/search?url=built-simple.ai

# Check current indexing in Google
# Search: site:built-simple.ai
```

---

## Template for Future Incidents

```markdown
## YYYY-MM-DD: [Brief Title]

### Symptoms
- What was observed

### Root Cause
- Why it happened

### Resolution
1. Step taken
2. Step taken

### Timeline
- **Date:** Event

### Lessons Learned
- What to do differently
```
