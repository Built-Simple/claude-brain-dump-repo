# ArXiv API - Research Paper Search

**Last Updated:** January 10, 2026
**Status:** Production Ready

## Overview

| Property | Value |
|----------|-------|
| **Container** | CT 122 (arxiv-gpu-pytorch) on Giratina |
| **IP Address** | 192.168.1.120 |
| **API Port** | 8082 |
| **PostgreSQL** | CT 123 (192.168.1.206:5432) - 2.77M papers |
| **FAISS Index** | GPU-accelerated IVF (768 dimensions, 8.5GB) |
| **Embedding Model** | all-mpnet-base-v2 |
| **GPU** | Tesla T4 (CUDA) |

## External URL

- **API:** https://arxiv.built-simple.ai

## API Endpoints

### Health Check
```bash
curl https://arxiv.built-simple.ai/health
```

### Hybrid Search (vector + text)
```bash
curl "https://arxiv.built-simple.ai/api/search?q=machine+learning&type=hybrid&limit=10"
```

### Vector-Only Search (semantic)
```bash
curl "https://arxiv.built-simple.ai/api/search?q=neural+networks&type=vector&limit=10"
```

### Text-Only Search (PostgreSQL FTS)
```bash
curl "https://arxiv.built-simple.ai/api/search?q=quantum+computing&type=text&limit=10"
```

### Streaming Search (SSE)
```bash
curl "https://arxiv.built-simple.ai/api/search/stream?q=transformers&type=hybrid&limit=10"
```

### Contact Form
```bash
curl -X POST https://arxiv.built-simple.ai/api/contact \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","question":"How do I use the API?"}'
```

## Features

- 2.77M+ research papers from ArXiv
- RAM Cache: All metadata in memory (~4 min startup)
- GPU-accelerated FAISS vector search (30-80ms)
- PostgreSQL full-text search with GIN indexes
- Hybrid search combining vector + text (72-86ms)
- OAuth 2.0 (Google) + email/password authentication
- Rate limiting (Free: 100/month, Pro: 10,000/month)
- Stripe integration for Pro tier ($29/month)
- Contact form (emails to info@built-simple.ai)

## Performance

| Operation | Time |
|-----------|------|
| Vector search | 30-80ms |
| Text search (cached) | <1ms |
| Text search (uncached) | ~500ms |
| Hybrid search | 72-86ms |
| Cache load (startup) | ~4 minutes |
| Memory for cache | ~4GB |

### RAM Cache Optimization (January 2026)
**Problem:** PostgreSQL network queries caused 500-700ms latency
**Solution:** Load all 2.77M paper metadata into RAM at startup

## Architecture

```
/opt/arxiv/
├── main.py                      # FastAPI entry point (CRITICAL)
├── auth.py                      # Core auth: OAuth, Stripe, API keys
├── oauth_endpoints.py           # Auth endpoints + Stripe webhooks
├── modules/
│   ├── config.py                # Configuration constants
│   ├── database.py              # PostgreSQL/SQLite connection pooling
│   ├── models.py                # GPU model + FAISS index loading
│   ├── search.py                # Vector, text, hybrid search
│   ├── metadata_cache.py        # RAM cache for paper metadata
│   ├── security.py              # API key validation, rate limiting
│   └── templates.py             # Homepage HTML template
├── databases/
│   └── api_keys.db              # SQLite: users, keys, subscriptions
└── static/                      # Static assets
```

## Code Documentation

**All source files now include AI-optimized documentation** (added January 10, 2026):

- **Dependency maps** at end of each file listing all dependencies, database operations, and side effects
- **Function-level docs** with @param, @returns, @depends, @affects markers
- **Inline markers** for CRITICAL, BUSINESS_RULE, GOTCHA, DECISION, TECHNICAL_DEBT
- **Performance annotations** with timing and complexity information

### Key Modules

| Module | Purpose | Criticality |
|--------|---------|-------------|
| `main.py` | FastAPI app, routes, startup/shutdown | CRITICAL |
| `models.py` | GPU model, FAISS index, keepalive thread | CRITICAL |
| `search.py` | Vector/text/hybrid search implementations | CRITICAL |
| `database.py` | PostgreSQL pool + SQLite connections | CRITICAL |
| `security.py` | Rate limiting, API key validation | CRITICAL |
| `metadata_cache.py` | RAM cache for 2.77M papers | HIGH |
| `config.py` | All configuration constants | HIGH |
| `oauth_endpoints.py` | Auth endpoints + Stripe webhooks | HIGH |
| `auth.py` | Core OAuth + Stripe logic | HIGH |

## External Dependencies

| Service | Host | Purpose |
|---------|------|---------|
| PostgreSQL | 192.168.1.206:5432 | Paper metadata + full-text search |
| Redis | localhost:6379 | Search result caching + **rate limiting** |
| Google OAuth | accounts.google.com | User authentication |
| Stripe | api.stripe.com | Payment processing |
| Gmail SMTP | smtp.gmail.com:587 | Contact form emails |

## Quick Commands

```bash
# Check API health
curl -s https://arxiv.built-simple.ai/health | jq

# Check service status
pct exec 122 -- systemctl status arxiv-api

# View logs
pct exec 122 -- journalctl -u arxiv-api -n 50 --no-pager

# Restart service (takes ~5 min for startup)
pct exec 122 -- systemctl restart arxiv-api

# Test search performance
curl -s "https://arxiv.built-simple.ai/api/search?q=deep+learning&type=hybrid&limit=5" | jq '.search_time'

# Check syntax of all Python files
pct exec 122 -- python3 -c "import ast; ast.parse(open('/opt/arxiv/main.py').read())"
```

## Monitoring

- Health checks every 5 minutes via /root/arxiv_api_monitor.sh
- Email alerts on failure (port 8082)
- Container health monitoring active

## Known Issues

- **Startup time**: ~5 minutes due to FAISS index (8.5GB) + RAM cache load
- **Memory usage**: ~12GB RAM required (model + index + cache)
- **GPU keepalive**: Background thread prevents cold start latency
- **GPU required**: API will fail to start if CUDA/GPU is unavailable

## Recent Changes (January 10, 2026)

- **Rate limiting migrated to Redis** - Now persists across restarts, uses sliding window with sorted sets
- **GPU check added** - API fails fast at startup if CUDA unavailable
- **Deprecated metadata code removed** - load_metadata() call removed from startup

---
*Redis rate limiting: January 10, 2026*
*Code documentation added: January 10, 2026*
*ArXiv RAM cache optimization: January 6, 2026*
*Contact form added: January 6, 2026*
