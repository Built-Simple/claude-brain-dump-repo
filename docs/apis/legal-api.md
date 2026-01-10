# Legal API - Legal Document Search

**Last Updated:** January 9, 2026
**Status:** In Development

## Overview

| Property | Value |
|----------|-------|
| **Containers** | CT 210, 211, 212 on Hoopa |
| **Host** | Hoopa (192.168.1.79) |
| **Status** | In Development |

## Container Inventory

| VMID | Name | Purpose | Status |
|------|------|---------|--------|
| CT 210 | LegalDocs-Production | Main API (16 cores, 48GB RAM) | Running |
| CT 211 | LegalSearch-DB | Database backend | Running |
| CT 212 | LegalSearch-ES | Elasticsearch | Stopped |

## Architecture

- Legal document search using hybrid pattern (like Wikipedia/FixIt)
- Mounts indexes from `/mnt/network_transfer/legal-indexes`
- High resource allocation for large index handling

## Quick Commands

```bash
# Check container status
ssh root@192.168.1.79 "pct list | grep -i legal"

# Access main container
ssh root@192.168.1.79 "pct enter 210"

# Start Elasticsearch if needed
ssh root@192.168.1.79 "pct start 212"
```

## Planned Features

- Legal document full-text search
- Vector similarity search
- Case law citations
- API key authentication
- Rate limiting and Stripe integration

## Notes

- Waiting for index building to complete
- Will follow same pattern as other APIs
- Target: Production ready Q1 2026

---
*Legal API containers created: December 2025*
