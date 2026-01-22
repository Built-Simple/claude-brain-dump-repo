# ArXiv API - Research Paper Search

**Last Updated:** January 19, 2026
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

### IMPORTANT: Duplicate Service (Fixed January 19, 2026)

There was a legacy `arxiv-gpu-search.service` that ran `gpu_search_api.py` on the same port 8082. This service has been **disabled** but NOT deleted. If the API stops working after a reboot, check for duplicate services:

```bash
# Check for duplicate services
pct exec 122 -- systemctl list-units --type=service --all | grep arxiv

# If arxiv-gpu-search is running, disable it
pct exec 122 -- systemctl stop arxiv-gpu-search
pct exec 122 -- systemctl disable arxiv-gpu-search
pct exec 122 -- systemctl restart arxiv-api
```

**Only `arxiv-api.service` (running `main:app`) should be active.**

## Recent Changes (January 19, 2026)

- **SEO implementation** - Added meta description, OG tags, Twitter Cards to homepage template
- **Duplicate service disabled** - `arxiv-gpu-search.service` disabled to prevent port conflict

## Recent Changes (January 10, 2026)

- **Rate limiting migrated to Redis** - Now persists across restarts, uses sliding window with sorted sets
- **GPU check added** - API fails fast at startup if CUDA unavailable
- **Deprecated metadata code removed** - load_metadata() call removed from startup

## PDF Full-Text Pipeline

### PDF Locations

| Location | Host | PDFs | Status |
|----------|------|------|--------|
| `/proxmox-zfs/arxiv_consolidated/papers/` | Giratina (local) | 146,868 | **100% valid** |
| `/mnt/pcbox/thunder/arxiv_pdfs/` | Talon (via SSH) | 2,212,820 | ~8% valid (CAPTCHA issue) |

**Recommended:** Use local Giratina PDFs first (faster, 100% valid)

### Current Status (January 22, 2026)

| Metric | Value |
|--------|-------|
| Papers in database | 2,770,235 |
| Papers with full_text | ~889,000 (32%) |
| Local PDFs (Giratina) | 146,868 (100% valid) |
| Local PDFs needing extraction | 43,104 |
| PDFs on Talon | 2,212,820 |
| Valid Talon PDFs (~8%) | ~177,000 |
| Extraction rate | ~278 papers/hour |

### Scripts

| Script | Purpose |
|--------|---------|
| `03_local_pdf_extraction.py` | **RECOMMENDED** - Extract from local Giratina PDFs |
| `02_pdf_text_extraction_talon.py` | Extract from PDFs via SSH to Talon |
| `arxiv_pdf_downloader.py` | Rate-limited PDF downloader (run on Talon) |
| `identify_invalid_pdfs.sh` | Scan and identify invalid PDFs (run on Talon) |

### Running Local Extraction (Recommended)

```bash
# From Giratina - uses local PDFs, much faster
cd /mnt/raid6/arxiv-full-text-pipeline
source venv/bin/activate

# Test with small batch
python 03_local_pdf_extraction.py --limit 50

# Full extraction of all 43K eligible papers
python 03_local_pdf_extraction.py

# Run in background for long extractions
nohup python 03_local_pdf_extraction.py > local_extraction_run.log 2>&1 &
tail -f local_extraction_run.log

# Check progress
tail /mnt/raid6/arxiv-full-text-pipeline/local_extraction.log
```

### Running Talon Extraction (Legacy)

```bash
# From Giratina - uses SSH to access Talon PDFs
cd /mnt/raid6/arxiv-full-text-pipeline
source venv/bin/activate

# Extract from valid PDFs (uses /root/valid_pdfs.txt on Talon)
python 02_pdf_text_extraction_talon.py --limit 100
```

### Running the Downloader (on Talon)

```bash
# SSH to Talon
ssh root@192.168.1.7

# Download missing PDFs with rate limiting (2 sec between requests)
python3 /root/arxiv_pdf_downloader.py --limit 1000

# Check download progress
tail -f /root/arxiv_download.log
```

### Local PDF Collection Details

The `/proxmox-zfs/arxiv_consolidated/papers/` collection on Giratina:
- **arxiv_complete/**: 101,957 PDFs (years: 2007, 2021-2024)
- **arxiv_archive/pdfs/**: 44,911 PDFs (2024)
- **Total size**: ~409GB
- **All PDFs verified valid** (100% have %PDF- header)

### Identifying Invalid PDFs on Talon

```bash
# Quick sample (1000 files)
ssh root@192.168.1.7 '/root/identify_invalid_pdfs.sh sample'

# Full scan (takes many hours)
ssh root@192.168.1.7 '/root/identify_invalid_pdfs.sh scan'

# Check scan status
ssh root@192.168.1.7 'wc -l /root/valid_pdfs.txt /root/invalid_pdfs.txt'
```

**Issue Found:** ~92% of Talon PDFs are actually ArXiv CAPTCHA error pages (HTML). The original download script hit rate limits.

---
*Local PDF collection discovery + extraction script: January 22, 2026*
*Full-text pipeline documentation: January 21, 2026*
*SEO implementation + duplicate service fix: January 19, 2026*
*Redis rate limiting: January 10, 2026*
*Code documentation added: January 10, 2026*
*ArXiv RAM cache optimization: January 6, 2026*
*Contact form added: January 6, 2026*
