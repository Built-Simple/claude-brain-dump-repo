# FixIt API - Stack Overflow Search

**Last Updated:** January 9, 2026
**Status:** Production Ready

## Overview

| Property | Value |
|----------|-------|
| **Container** | CT 103 (FixItAPI) on Giratina |
| **IP Address** | 192.168.1.42 |
| **API Port** | 5001 |
| **Frontend Port** | 80 |
| **Database** | 82.9GB SQLite with FTS5 (18,563,455 records) |
| **Database Path** | /mnt/databases/SELF_HEALING_AGI.db |
| **Repository** | https://github.com/Built-Simple/fixit-api |

## External URLs

- **Frontend:** https://fixit.built-simple.ai
- **API:** https://fixitapi.built-simple.ai

## API Endpoints

### Health Check
```bash
curl https://fixitapi.built-simple.ai/health
```

### Search Stack Overflow Solutions
```bash
curl -X POST https://fixitapi.built-simple.ai/search \
  -H "Content-Type: application/json" \
  -d '{"query":"python error handling","limit":10}'
```

### Hybrid Search (FTS5 + Vector with RRF)
```bash
curl -X POST https://fixitapi.built-simple.ai/hybrid-search \
  -H "Content-Type: application/json" \
  -d '{"query":"react hooks useEffect","limit":10}'
```

### Vector Health Check
```bash
curl https://fixitapi.built-simple.ai/vector-health
```

### User Registration
```bash
curl -X POST https://fixitapi.built-simple.ai/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secure123","name":"John Doe"}'
```

### User Login
```bash
curl -X POST https://fixitapi.built-simple.ai/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secure123"}'
```

## Features

- 18.5M+ Stack Overflow solutions with full-text search
- FTS5 optimized for <100ms query times
- Hybrid Search: Vector similarity + FTS5 with RRF merging
- Rate limiting (Free: 100/month, Pro: 10k/month @ $29/month)
- Dual authentication (Google OAuth + email/password with bcrypt)
- Stripe payment integration (live keys configured)
- Modern dark-themed frontend interface
- Contact Us form (bottom-right, emails to info@built-simple.ai)
- Real-time database statistics
- Modular FastAPI architecture (8 clean modules)

## Vector Search Infrastructure

**GPU Embedding Server:** Running on Hoopa (192.168.1.79:8090)

| Component | Details |
|-----------|---------|
| **Index Type** | IVF-PQ compressed FAISS |
| **Index Size** | 1.12GB (48x compression from 54GB) |
| **Total Vectors** | 18,563,455 |
| **GPU** | RTX 3090 (GPU 3, CUDA_VISIBLE_DEVICES=3) |
| **Embedding Model** | all-MiniLM-L6-v2 (384 dimensions) |

### Performance (with vmtouch cache warming)
- FTS5 search: ~12-26ms (warm cache)
- Vector search: ~60-96ms per query
- Hybrid search: ~76-150ms total

## Architecture

**Modular Design (Refactored Dec 9, 2025):**
```
/var/www/talon-api/
├── main.py                 # FastAPI app with routes (CRITICAL)
├── config.py               # Configuration and env vars (CRITICAL)
├── models.py               # Pydantic request/response models (MEDIUM)
├── database.py             # Database connection pooling (CRITICAL)
├── auth.py                 # Email/password auth (bcrypt) (CRITICAL)
├── rate_limit.py           # Monthly rate limiting (CRITICAL)
├── stripe_integration.py   # Stripe checkout/webhooks (CRITICAL)
├── search.py               # FTS5 search functionality (CRITICAL)
├── hybrid_search.py        # Hybrid search module (HIGH)
├── oauth_module.py         # Google OAuth integration (HIGH)
├── CRITICAL_PATHS.md       # User journey documentation
└── fixit_frontend.html     # Frontend with Contact Us modal
```

**Code Documentation (Added January 9, 2026):**
All Python modules now include comprehensive dependency maps with:
- Module metadata (@module, @criticality, @status)
- Direct dependencies with [REQUIRED]/[OPTIONAL] markers
- Database operations (reads/writes)
- External services with endpoints, timeouts, rate limits
- Side effects, error handling, and breaking changes documentation

See `CRITICAL_PATHS.md` for 8 documented user journeys.

## Services

```
CT 103 Systemd Services:
├── fixit-api.service         # Main API
└── vmtouch-fixit.service     # Database cache locking

CT 103 Cron:
└── /usr/local/bin/fixit-cache-warm.sh  # Every 2 hours
```

## Security Status

**Completed Hardening (Dec 9, 2025):**
- CORS restricted to fixit.built-simple.ai and fixitapi.built-simple.ai
- Persistent database storage (/var/lib/fixit-api/)
- bcrypt password hashing for email/password auth
- Session cookies (HttpOnly, Secure, SameSite=lax)
- Dual authentication (OAuth + email/password)
- Stripe webhook signature verification
- Security headers (X-Frame-Options, Referrer-Policy)
- HTTPS via Cloudflare tunnels
- Rate limiting (IP-based for free tier, API key for pro tier)

## Quick Commands

```bash
# Check API health
curl -s http://192.168.1.42:5001/health | jq

# Check embedding server on Hoopa
ssh root@192.168.1.79 "ps aux | grep embedding"

# Restart embedding server (GPU 3)
ssh root@192.168.1.79 "cd /mnt/network_transfer/fixit-vectors && CUDA_VISIBLE_DEVICES=3 nohup python3 -u embedding_server_gpu.py > embedding_server_gpu.log 2>&1 &"

# Test embedding server directly
curl -X POST http://192.168.1.79:8090/search \
  -H "Content-Type: application/json" \
  -d '{"query":"python async await","limit":5}'

# Restart FixIt API
pct exec 103 -- systemctl restart fixit-api

# View logs
pct exec 103 -- journalctl -u fixit-api -n 50 --no-pager
```

## Nginx Configuration

Location: `/etc/nginx/sites-available/fixit` (in CT 103)

- Root: Serves fixit_frontend.html with cache-busting headers
- /search → Proxied to localhost:5001
- /health → Proxied to localhost:5001
- /auth/* → Proxied to localhost:5001
- /checkout → Proxied to localhost:5001
- /webhook/ → Proxied to localhost:5001

## Monitoring

- Health checks every 5 minutes
- Email alerts on failure
- Monitored by /root/application_health_monitor_v2.sh

---
*FixIt Vector Search deployed: January 2, 2026*
*Rate limiting changed to monthly: January 7, 2026*
