# ArXiv API - Research Paper Search

**Last Updated:** January 9, 2026
**Status:** Production Ready

## Overview

| Property | Value |
|----------|-------|
| **Container** | CT 122 (arxiv-gpu-pytorch) on Giratina |
| **IP Address** | 192.168.1.120 |
| **API Port** | 8082 |
| **PostgreSQL** | CT 123 (2.77M papers) |
| **FAISS Index** | GPU-accelerated IVF (768 dimensions) |
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

### Contact Form
```bash
curl -X POST https://arxiv.built-simple.ai/api/contact \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","question":"How do I use the API?"}'
```

## Features

- 2.77M+ research papers from ArXiv
- RAM Cache: All metadata in memory (~4 min startup)
- GPU-accelerated FAISS vector search (67-127ms)
- PostgreSQL full-text search with GIN indexes
- Hybrid search combining vector + text (72-86ms)
- OAuth 2.0 (Google) + email/password authentication
- Rate limiting (Free: 100/day, Pro: 10,000/day)
- Stripe integration for Pro tier ($29/month)
- Contact form (emails to info@built-simple.ai)

## Performance

| Operation | Time |
|-----------|------|
| Vector search | 67-127ms |
| Hybrid search | 72-86ms |
| Cache load (startup) | ~4 minutes |
| Memory for cache | ~2GB |

### RAM Cache Optimization (January 2026)
**Problem:** PostgreSQL network queries caused 500-700ms latency
**Solution:** Load all 2.77M paper metadata into RAM at startup

## Architecture

```
/opt/arxiv/
├── main.py                      # FastAPI app with all routes
├── modules/
│   ├── config.py                # Configuration constants
│   ├── database.py              # PostgreSQL connection pooling
│   ├── models.py                # FAISS index + embedding model
│   ├── search.py                # Vector, text, hybrid search
│   ├── metadata_cache.py        # RAM cache for paper metadata
│   ├── security.py              # API key validation, rate limiting
│   └── templates.py             # Homepage HTML template
├── oauth_endpoints.py           # Google OAuth + email auth
└── bsauth/                      # IP detection utilities
```

## Quick Commands

```bash
# Check API health
curl -s http://192.168.1.120:8082/health | jq

# Check service status
pct exec 122 -- systemctl status arxiv-api

# View logs
pct exec 122 -- journalctl -u arxiv-api -n 50 --no-pager

# Restart service (takes ~4 min for RAM cache)
pct exec 122 -- systemctl restart arxiv-api

# Test search performance
curl -s "http://192.168.1.120:8082/api/search?q=deep+learning&type=hybrid&limit=5" | jq '.search_time_ms'
```

## Monitoring

- Health checks every 5 minutes via /root/arxiv_api_monitor.sh
- Email alerts on failure (port 8082)
- Container health monitoring active

---
*ArXiv RAM cache optimization: January 6, 2026*
*Contact form added: January 6, 2026*
