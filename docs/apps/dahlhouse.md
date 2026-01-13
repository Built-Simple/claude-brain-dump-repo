# Dahlhouse - Voice Acting Website

**Type:** Client Side Project (Personal Training Client)
**Priority:** Low
**Status:** Live
**Last Updated:** January 12, 2026

---

## Overview

Simple website with admin CMS for voice actor Dahlie. Standalone project, not part of the main infrastructure.

## URLs

- **Main Site:** https://dahlhouse.store
- **Admin Panel:** https://dahlhouse.store/admin.html
- **Ko-fi:** https://ko-fi.com/crybabydahl

## Tech Stack

- **Hosting:** Cloudflare Workers + Static Assets
- **Database:** Cloudflare KV
- **Domain:** dahlhouse.store (Cloudflare DNS)
- **Payments:** Ko-fi (no payment integration needed)

## Project Location

```
/tmp/dahlhouse-site/  (local dev)
GitHub → Cloudflare auto-deploy on push to main
```

## Security Features

- httpOnly cookies for sessions
- Rate limiting: 5 login attempts per 5 minutes per IP
- 24-hour session expiry
- Secure, SameSite=Strict cookies

## Admin Access

- Password stored in Cloudflare Workers secrets as `ADMIN_PASSWORD`
- Login at `/admin.html`

## KV Configuration

- **Binding:** `DAHLHOUSE_KV`
- **ID:** `431e2f5378854187b2a530439210d1a3`

## Notes

- Writing services removed - client no longer offers
- Ko-fi handles all payments (no Stripe integration)
- Auto-deploys via GitHub integration

---
*Side project for personal training client - not core infrastructure*
