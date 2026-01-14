# PubMed API - Medical Research Search

**Last Updated:** January 13, 2026
**Status:** Production Ready

## Overview

| Property | Value |
|----------|-------|
| **Container** | CT 108 (PubMedSearch) on Giratina |
| **IP Address** | 192.168.1.135 |
| **API Port** | 5001 |
| **PostgreSQL** | 4.48M articles (on Giratina host) |
| **Elasticsearch** | 4.48M articles (CT 503) |
| **API File** | /opt/pubmed-web/main.py |

## External URL

- **API:** https://pubmed.built-simple.ai

## API Endpoints

### Health Check
```bash
curl https://pubmed.built-simple.ai/health
```

### Search Articles
```bash
curl -X POST https://pubmed.built-simple.ai/search \
  -H "Content-Type: application/json" \
  -d '{"query":"COVID-19 vaccine","limit":10}'
```

### Get Metadata for Multiple PMIDs
```bash
curl -X POST https://pubmed.built-simple.ai/metadata \
  -H "Content-Type: application/json" \
  -d '{"pmids":["32866149","32723344"]}'
```

### Get Full Text Content
```bash
curl -X POST https://pubmed.built-simple.ai/full_text \
  -H "Content-Type: application/json" \
  -d '{"pmid":"32866149"}'
```

### Contact Form
```bash
curl -X POST https://pubmed.built-simple.ai/contact \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","message":"Your message here"}'
```

## Features

- 4.48M+ medical research articles
- Full-text search with Elasticsearch
- PostgreSQL primary database with complete metadata
- Batch metadata lookup for multiple PMIDs
- OAuth 2.0 and JWT authentication
- Rate limiting and usage tracking
- Stripe integration for Pro tier ($29/month)
- Contact form (emails to info@built-simple.ai)
- Search Tips help panel

## Data Sources

| Source | Location | Size |
|--------|----------|------|
| **PostgreSQL** | Giratina host (192.168.1.100:5432) | 992GB total |
| **Elasticsearch** | CT 503 (192.168.1.139:9200) | 125GB index |

### PostgreSQL Tables (pmc_fulltext database)
- `articles`: 79GB, 4,483,066 rows
- `citations`: 103GB
- `author_citation_proper`: 551GB
- ORCID data: 6GB

### Database Connection
```python
PG_HOST=192.168.1.100
PG_PORT=5432
PG_DATABASE=pmc_fulltext
PG_USER=readonly
PG_PASSWORD=pubmed_readonly_2025
```

## Performance

| Operation | Time |
|-----------|------|
| GPU Vector Search | ~75-100ms |
| Elasticsearch Cold | 2-3.5s |
| Elasticsearch Warm | 80-90ms |

### Optimizations (January 2026)
- ES query changed from `multi_match` to `bool/should` (7-13x faster)
- PostgreSQL `shared_buffers` increased to 4GB
- ES JVM heap increased to 10GB
- Query prewarming enabled (every 2 hours)

## Architecture

```
CT 108 (/opt/pubmed-web/):
├── main.py                    # FastAPI app
├── searchers/
│   └── hybrid_searcher.py     # Optimized ES queries
└── es_prewarm.py              # Query prewarming script

Giratina Host:
└── PostgreSQL (pmc_fulltext)  # Primary data source

CT 503:
└── Elasticsearch              # Search index
```

## Quick Commands

```bash
# Check ES document count
pct exec 503 -- curl -s "http://localhost:9200/pubmed-articles/_count" | jq

# Check PostgreSQL count
psql -h 192.168.1.100 -U readonly -d pmc_fulltext \
  -c "SELECT COUNT(*) FROM articles WHERE pmid IS NOT NULL;"

# Test API
curl -s "https://pubmed.built-simple.ai/health" | jq

# Restart API
pct exec 108 -- systemctl restart pubmed-api

# View logs
pct exec 108 -- journalctl -u pubmed-api -n 50 --no-pager
```

## Monitoring

- Health checks every 5 minutes
- Email alerts on failure
- ES prewarming via systemd timer (every 2 hours)

## Known Issues

- CT 502 (pubmed-postgres) is empty - NOT USED
- All data is on Giratina host PostgreSQL

### OpenAPI Servers Array Not Set (January 2026)

**Status:** Unresolved - Service works, but `/openapi.json` has no `servers` array

**Root Cause:** Python 3.13 + FastAPI 0.123.9 incompatibility

PubMed runs Python 3.13 which has stricter annotation evaluation (PEP 649). FastAPI's `inspect.signature(call, eval_str=True)` forces evaluation of type hints even with `from __future__ import annotations`.

**Error encountered:**
```
NameError: name 'CompleteGPUSearcher' is not defined
```

This occurs when adding `servers=` kwarg to FastAPI() init because it triggers re-evaluation of all route signatures.

**Fixes attempted:**
1. `servers=` kwarg in FastAPI() - FAILED (caused startup error)
2. `app.openapi = custom_openapi` override - Not called by FastAPI 0.123.9
3. Custom `/openapi.json` route - FastAPI's built-in takes precedence
4. Removed type hints from Depends() params - Fixed startup but not OpenAPI issue

**Files modified during troubleshooting:**
- `/opt/pubmed-web/main.py` - Removed type hints from health_check
- `/opt/pubmed-web/routes/search_routes.py` - Removed CompleteGPUSearcher type hints
- `/opt/pubmed-web/dependencies.py` - Added `from __future__ import annotations`
- `/opt/pubmed-web/searchers/hybrid_searcher.py` - Added `from __future__ import annotations`

**Potential fixes:**
1. Upgrade FastAPI to 0.115+ (may have better OpenAPI override support)
2. Downgrade Python from 3.13 to 3.11
3. Patch FastAPI internals directly
4. Use a middleware to intercept `/openapi.json` responses

**Impact:** Low - API works correctly, only affects GEO optimization (LLMs use servers array to determine production URL)

---
*PubMed ES full sync completed: December 10, 2025*
*Performance optimizations: January 7, 2026*
