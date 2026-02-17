# Legal API - Legal Document Search

**Last Updated:** February 17, 2026
**Status:** Operational (FAISS v5.9 - 2M+ vectors, consolidated on RTX 3090 #2)

## Overview

| Property | Value |
|----------|-------|
| **Host** | Hoopa (192.168.1.79) - bare metal, not container |
| **Database** | PostgreSQL on Giratina (192.168.1.100:5432) |
| **External URL** | https://legal.built-simple.ai |
| **Internal URL** | http://192.168.1.79:5002 |
| **API Version** | 6.4.0 |
| **GPU** | RTX 3090 #2 (GPU index 2) |
| **Auth Database** | SQLite: `/var/lib/legal-api/auth.db` |

## Rate Limiting (Added v6.2)

| Tier | Monthly Limit | Rate Limit | Price |
|------|---------------|------------|-------|
| **Free (IP-based)** | 100 searches/month | 10 req/min | $0 |
| **Pro (API key)** | 10,000 searches/month | 60 req/min | $29/month |

### Implementation Status

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Complete | IP-based rate limiting (100/month) |
| Phase 2 | ✅ Complete | API key registration (`/api/register`) |
| Phase 3 | ✅ Complete | Stripe integration for Pro upgrades |
| Phase 4 | 🔄 Pending | Google OAuth login |

### Rate Limit Headers

All responses include rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 98
X-RateLimit-Reset: monthly
```

### Usage Endpoint
```bash
# Without API key (IP-based)
curl https://legal.built-simple.ai/usage
# Returns: {"tier":"free","monthly_requests":2,"monthly_limit":100,"remaining":98}

# With API key
curl https://legal.built-simple.ai/usage -H "X-API-Key: legal_your_key_here"
# Returns: {"tier":"free","monthly_requests":1,"monthly_limit":100,"remaining":99,"email":"user@example.com","key_prefix":"legal_abc123..."}
```

### API Key Registration (v6.3)
```bash
# Register for an API key (one key per email per month)
curl -X POST https://legal.built-simple.ai/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Response:
{
  "success": true,
  "api_key": "legal_abc123...(full key)",
  "key_prefix": "legal_abc123...",
  "message": "API key created successfully! Store it securely - you won't be able to see it again.",
  "tier": "free",
  "monthly_limit": 100
}
```

**Note:** The full API key is only shown once at creation. Store it securely!

### Upgrade to Pro (v6.4 - Stripe)
```bash
# Create checkout session to upgrade API key to Pro tier
curl -X POST https://legal.built-simple.ai/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"api_key":"legal_your_key_here","email":"user@example.com"}'

# Response:
{
  "success": true,
  "checkout_url": "https://checkout.stripe.com/c/pay/...",
  "message": "Redirect to checkout URL"
}

# Check subscription status
curl https://legal.built-simple.ai/api/subscription \
  -H "X-API-Key: legal_your_key_here"

# Response:
{
  "tier": "free",
  "subscription_status": null,
  "has_subscription": false,
  "monthly_usage": 5,
  "monthly_limit": 100,
  "remaining": 95,
  "upgrade_url": "https://legal.built-simple.ai/api/checkout"
}
```

**Stripe Webhook:** `POST /webhook/stripe` receives subscription lifecycle events

## Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          HOOPA (192.168.1.79)                            │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Bare Metal - Legal Search API v6.0                               │    │
│  │                                                                  │    │
│  │  FastAPI (port 5002)                                            │    │
│  │    ├─ ModernBERT embedding model (GPU)                          │    │
│  │    ├─ FAISS Flat index (2M+ vectors, 100% recall)              │    │
│  │    └─ Query encoding + similarity search                        │    │
│  │                                                                  │    │
│  │  GPU: RTX 3090 #2 (CUDA_VISIBLE_DEVICES=2)                     │    │
│  │  VRAM: ~13GB used (8.4GB index + 4.5GB model)                  │    │
│  │                                                                  │    │
│  │  /mnt/network_transfer/legal-indexes/                          │    │
│  │    ├─ legal_flat_v5.9.index (2,034,973 vectors)               │    │
│  │    └─ legal_id_map_enriched.json (enriched metadata w/ slugs) │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  Also on Hoopa (sharing 3090 #2):                                       │
│    └─ Wikipedia API (4.5GB VRAM)                                        │
│                                                                          │
│  FREE for video generation:                                              │
│    ├─ RTX 5090 (32GB) - GPU 0                                          │
│    └─ RTX 3090 #1 (24GB) - GPU 1                                       │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                        GIRATINA (192.168.1.100)                          │
│                                                                          │
│  PostgreSQL (port 5432)                                                  │
│    └─ legal_db (81 GB)                                                   │
│         ├─ documents table (9.2M rows)                                   │
│         │    ├─ caselaw: 5,947,629                                       │
│         │    ├─ misc: 2,249,613                                          │
│         │    ├─ patents: 543,336                                         │
│         │    ├─ contracts: 353,187                                       │
│         │    ├─ legislative: 112,716                                     │
│         │    └─ regulations: 182                                         │
│         └─ search_cache                                                  │
│                                                                          │
│  /mnt/raid6/courtlistener-data/                                          │
│    ├─ opinions-2025-12-02.csv (321 GB, 57M+ rows)                       │
│    └─ opinion-clusters-2025-12-02.csv (12 GB, 10M rows)                 │
└──────────────────────────────────────────────────────────────────────────┘
```

## GPU Consolidation (Feb 16, 2026)

Previously, the Legal API used multiple GPUs:
- RTX 5090 (GPU 0): legal_api_fastapi_v5.py (1.5GB)
- RTX 3090 #1 (GPU 1): legal_search_flat_v5.9.py (8.4GB)

**Now consolidated** onto RTX 3090 #2 to free the 5090 and 3090 #1 for video generation.

| GPU | Before | After |
|-----|--------|-------|
| RTX 5090 | 1.5GB (Legal v5) | **FREE** |
| RTX 3090 #1 | 8.4GB (Legal v5.9) | **FREE** |
| RTX 3090 #2 | 4.5GB (Wikipedia) | 13GB (Legal + Wiki) |

## Data Sources

### FAISS Index v5.9 (Production)
- **Type**: IndexFlatIP (inner product, 100% recall)
- **Model**: freelawproject/modernbert-embed-base_finetune_512
- **Dimensions**: 768
- **Total vectors**: 2,034,973 (published US opinions)
- **Search time**: ~15ms (GPU)
- **Embedding time**: ~740ms per query

### PostgreSQL (Giratina - legal_db)
- **Size**: 81 GB
- **Documents**: 9,206,663 total
- **User**: `readonly` / `LegalReadOnly2025`

## Landing Page

A branded landing page is served at the root URL (`/`), matching the built-simple.ai design aesthetic:
- Dark theme with neon accents (red, cyan, yellow)
- Live search demo
- API documentation and examples
- Real-time stats display

**Location**: Hoopa: `/opt/legal-search-api/static/index.html`

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/` | GET | No | Landing page (HTML) |
| `/health` | GET | No | Service health + index info |
| `/usage` | GET | Optional API Key | Get your current usage and limits |
| `/api/register` | POST | No | Register for an API key (email required) |
| `/search` | POST | Rate Limited | Vector similarity search (IP or API key) |
| `/stats` | GET | No | GPU and query statistics |
| `/api/checkout` | POST | API Key | Create Stripe checkout for Pro upgrade |
| `/api/subscription` | GET | API Key | Check subscription status |
| `/webhook/stripe` | POST | Stripe Sig | Stripe webhook for subscription events |

### Authentication

Searches can be made two ways:
1. **Without API key**: Uses IP-based tracking (100/month limit)
2. **With API key**: Pass `X-API-Key: legal_xxx` header (100/month free, 10k/month pro)

### Search Request
```json
POST /search
{
  "query": "first amendment free speech",
  "limit": 10
}
```

### Search Response (v6.1 - Enriched)
```json
{
  "query": "first amendment free speech",
  "results": [
    {
      "rank": 1,
      "score": 0.64,
      "opinion_id": "4127189",
      "cluster_id": "4349929",
      "case_name": "Dr. Bernd Wollschlaeger v. Governor of the State of Florida",
      "case_name_short": "Wollschlaeger",
      "slug": "dr-bernd-wollschlaeger-v-governor-of-the-state-of-florida",
      "date_filed": "2017-02-16",
      "summary": "",
      "judges": "Reed",
      "citation_count": "0",
      "precedential_status": "Published"
    },
    ...
  ],
  "search_time_ms": 15.43,
  "embed_time_ms": 737.94,
  "total_time_ms": 753.51,
  "index_type": "IndexFlatIP (100% recall)",
  "vectors_searched": 2034973
}
```

**New fields in v6.1:**
- `case_name`: Full case name (e.g., "Smith v. Jones")
- `case_name_short`: Short case name (e.g., "Smith")
- `slug`: URL slug for CourtListener links (e.g., "smith-v-jones")
- `date_filed`: Filing date (YYYY-MM-DD)
- `summary`: Case summary (HTML, may be empty)
- `judges`: Presiding judge(s)
- `citation_count`: Number of citations
- `precedential_status`: "Published", "Unpublished", etc.

**CourtListener URL format:** `https://www.courtlistener.com/opinion/{cluster_id}/{slug}/`

## Configuration Files

| File | Location | Purpose |
|------|----------|---------|
| API Code | Hoopa: `/opt/legal-search-api/legal_search_consolidated.py` | Main API v6.4 |
| Environment | Hoopa: `/opt/legal-search-api/.env` | Stripe keys, URLs |
| Landing Page | Hoopa: `/opt/legal-search-api/static/index.html` | Branded landing page |
| Auth Database | Hoopa: `/var/lib/legal-api/auth.db` | SQLite for rate limiting |
| Service Unit | Hoopa: `/etc/systemd/system/legal-search-consolidated.service` | Systemd service |
| Logs | `journalctl -u legal-search-consolidated` | Systemd journal |

## Quick Commands

```bash
# Check API health (internal)
curl -s http://192.168.1.79:5002/health | python3 -m json.tool

# Test search
curl -s -X POST http://192.168.1.79:5002/search \
  -H "Content-Type: application/json" \
  -d '{"query": "patent infringement damages", "limit": 5}'

# Check GPU usage on Hoopa
ssh root@192.168.1.79 "nvidia-smi"

# View API logs
ssh root@192.168.1.79 "tail -50 /tmp/legal_api_consolidated.log"

# Restart API
ssh root@192.168.1.79 "systemctl restart legal-search-consolidated"

# Check service status
ssh root@192.168.1.79 "systemctl status legal-search-consolidated"
```

## Cloudflare Tunnel Setup

**STATUS: ✅ Operational**

Public hostname configured via Cloudflare Zero Trust dashboard (giratina tunnel):
- **Hostname**: legal.built-simple.ai
- **Service**: http://192.168.1.79:5002

**Note**: The giratina tunnel uses remote configuration from Zero Trust dashboard, not local config.yml.

**Firewall**: Port 5002 is open on Hoopa (iptables rule added).

## Service Management

```bash
# Enable on boot
ssh root@192.168.1.79 "systemctl enable legal-search-consolidated"

# Start/stop/restart
ssh root@192.168.1.79 "systemctl start legal-search-consolidated"
ssh root@192.168.1.79 "systemctl stop legal-search-consolidated"
ssh root@192.168.1.79 "systemctl restart legal-search-consolidated"
```

## Performance

| Metric | Value |
|--------|-------|
| Index load time | ~180s (cold start) |
| Warmup time | ~60s |
| Query embedding | ~740ms |
| Vector search | ~15ms |
| Total latency | ~755ms |
| Memory (GPU) | ~8.4GB |
| Memory (System) | ~7GB |

## Changelog

- **Feb 17, 2026**: **v6.4.0 - Stripe Integration (Phase 3)** - Added `/api/checkout` for Pro upgrades ($29/month, 10k searches). `/api/subscription` to check status. `/webhook/stripe` for subscription lifecycle events. Uses SDK StripeWebhookHandler for secure signature verification.
- **Feb 17, 2026**: **v6.3.0 - API Key Auth (Phase 2)** - Added `/api/register` endpoint for email-based API key registration. Keys use format `legal_{random}` with SHA-256 hashing. One active key per email per month (free tier). Search responses include `rate_limit` object with usage stats. `/usage` endpoint shows key-specific stats when API key provided.
- **Feb 17, 2026**: **v6.2.0 - Rate Limiting (Phase 1)** - Added IP-based rate limiting (100 searches/month free tier). SQLite auth database at `/var/lib/legal-api/auth.db`. Rate limit headers on all responses. `/usage` endpoint for checking limits. Landing page updated to show "100 searches/month" (was incorrectly "100/day").
- **Feb 16, 2026**: **v6.1.1 - Fixed CourtListener URLs** - Added `slug` field to search results. API code was missing `slug` extraction from metadata. CourtListener URLs now use correct format: `/opinion/{cluster_id}/{slug}/`
- **Feb 16, 2026**: **v6.1 - Enriched Results** - Search results now include case_name, date_filed, summary, judges, citation_count, precedential_status, slug. Enriched metadata from CourtListener opinion-clusters CSV (99.99% match rate).
- **Feb 16, 2026**: Added branded landing page matching built-simple.ai style
- **Feb 16, 2026**: Fixed Cloudflare tunnel DNS (was pointing to wrong tunnel ID)
- **Feb 16, 2026**: Consolidated to single RTX 3090 #2, freed 5090+3090#1 for video generation
- **Feb 13, 2026**: Running v5.9 with 2M+ vectors
- **Jan 30, 2026**: FAISS v5.8 index operational
- **Jan 10, 2026**: Initial v4 build in progress

---
*Documentation updated: February 17, 2026*
*Stripe integration deployed - Phase 3 complete*
