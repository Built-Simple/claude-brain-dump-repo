# ReviewMaster Pro - AI Review Response Generator

**Last Updated:** January 9, 2026
**Status:** Production Ready (95%)

## Overview

| Property | Value |
|----------|-------|
| **Container** | CT 313 on Silvally (192.168.1.52) |
| **IP Address** | 192.168.1.200:8001 |
| **Status** | Production Ready |

## External URL

- **App:** https://reviewmaster.built-simple.ai

## What is ReviewMaster Pro?

AI-powered review response generator that helps businesses respond to customer reviews across multiple platforms with brand-appropriate, contextually relevant responses.

## Supported Platforms

- Google Reviews
- Yelp
- Facebook

## Features

- **Multi-Platform Support:** Google, Yelp, Facebook reviews
- **Customizable:** 5 configuration endpoints
  - Prompts
  - Templates
  - Profiles
  - Platform tuning
  - Analytics
- **User Tiers:**
  - Free: 3/day
  - Registered: 10/day
  - Pro: Unlimited @ $29/month
- **Full Auth:** bcrypt (12 rounds), access + refresh tokens, PostgreSQL
- **Stripe Integration:** LIVE keys configured (Dec 9, 2025)

## Technology Stack

- FastAPI (Python) with OpenAI GPT
- PostgreSQL database
- Comprehensive documentation (14 markdown files)

## Production Status

- External access working
- Authentication and payments functional
- All features operational
- Stripe LIVE keys configured
- Webhook signature verification enabled
- All Pro endpoints tested and working

## Quick Commands

```bash
# Access container
ssh root@192.168.1.52 "pct enter 313"

# Check service status
ssh root@192.168.1.52 "pct exec 313 -- systemctl status reviewmaster"

# View logs
ssh root@192.168.1.52 "pct exec 313 -- journalctl -u reviewmaster -n 50"

# Restart service
ssh root@192.168.1.52 "pct exec 313 -- systemctl restart reviewmaster"

# Test access
curl https://reviewmaster.built-simple.ai/health
```

## Revenue Model

- $29/month for unlimited reviews
- Target: Restaurants, small businesses, agencies

## Monitoring

- Health checks every 5 minutes on port 8001
- Email alerts on failure

## Migration History

Migrated from Victini to Silvally: December 13, 2025
- CT 113 → CT 313

CT 115 (obsolete "configurable" version) deleted: December 13, 2025

## Related Documentation

- REVIEWMASTER_PRODUCTION_STATUS.md (in /root/)

---
*ReviewMaster Pro: Live Stripe keys configured: December 9, 2025*
*Migrated to Silvally: December 13, 2025*
