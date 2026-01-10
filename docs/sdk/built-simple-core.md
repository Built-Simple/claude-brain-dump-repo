# Built-Simple-Core SDK

**Last Updated:** January 9, 2026
**Location:** /opt/built-simple-core/
**Deployed to:** All API containers (CT 103, 108, 122, 213)

## What is it?

Internal platform SDK providing unified infrastructure for all Built-Simple.ai APIs. Eliminates duplication of auth, billing, rate limiting, caching, and observability code.

## Quick Start for New APIs

```python
# /opt/newapi/main.py
import sys
sys.path.insert(0, '/opt/built-simple-core')

from built_simple import create_app, Config
from built_simple.auth import require_auth, Auth
from built_simple.quota import check_quota
from built_simple.cache import cached

config = Config(
    api_name="newapi",
    cors_origins=["https://newapi.built-simple.ai"],
)

app = create_app(config)  # Gets auth, Stripe, health checks, logging

@app.get("/search")
@cached(ttl=86400)
async def search(q: str, auth: Auth = Depends(check_quota)):
    return {"results": [...]}
```

## Available Modules

| Module | Purpose | Key Classes/Functions |
|--------|---------|----------------------|
| `auth` | API keys, sessions, OAuth | `APIKeyManager`, `require_auth`, `require_pro` |
| `billing` | Stripe webhooks | `StripeWebhookHandler`, `SubscriptionManager` |
| `quota` | Monthly quotas | `QuotaManager`, `check_quota` |
| `ratelimit` | Per-minute limits | `RateLimiter`, `check_rate_limit` |
| `cache` | In-memory/Redis | `@cached`, `InMemoryCache`, `RedisCache` |
| `observability` | Logging, health | `setup_logging`, `HealthCheck` |
| `security` | CORS, validation, IP | `get_client_ip`, `CORSConfig`, `validate_input` |
| `db` | Connection pooling | `SQLitePool`, `PostgresPool` |
| `search` | ES client, streaming | `ElasticsearchClient`, `SSEResponse` |

## Module Details

### auth - Authentication

```python
from built_simple.auth import APIKeyManager, require_auth, require_pro

# Initialize
key_manager = APIKeyManager(db_path="/var/lib/api/auth.db")

# Protect endpoint (any valid key)
@app.get("/data")
async def get_data(auth: Auth = Depends(require_auth)):
    return {"user": auth.user_id}

# Protect endpoint (Pro tier only)
@app.get("/premium")
async def premium(auth: Auth = Depends(require_pro)):
    return {"tier": "pro"}
```

### billing - Stripe Integration

```python
from built_simple.billing import StripeWebhookHandler, SubscriptionManager

# Handle webhooks
@app.post("/webhook")
async def webhook(request: Request):
    handler = StripeWebhookHandler(secret=WEBHOOK_SECRET)
    event = await handler.verify(request)
    return await handler.process(event)
```

### quota - Usage Quotas

```python
from built_simple.quota import QuotaManager, check_quota

# Check quota before operation
@app.get("/search")
async def search(auth: Auth = Depends(check_quota)):
    # Quota automatically checked and decremented
    return results
```

### ratelimit - Rate Limiting

```python
from built_simple.ratelimit import RateLimiter, check_rate_limit

# Per-minute rate limiting
@app.get("/api")
async def api(request: Request):
    await check_rate_limit(request, limit=100, window=60)
    return data
```

### cache - Caching

```python
from built_simple.cache import cached, InMemoryCache

# Decorator-based caching
@cached(ttl=3600)
async def expensive_query(q: str):
    return await db.query(q)
```

### observability - Logging & Health

```python
from built_simple.observability import setup_logging, HealthCheck

# Setup structured logging
logger = setup_logging(api_name="myapi", level="INFO")

# Health check endpoint
@app.get("/health")
async def health():
    return HealthCheck.run(db=db, es=es)
```

### security - Security Utilities

```python
from built_simple.security import get_client_ip, CORSConfig, validate_input

# Get real client IP (handles proxies)
client_ip = get_client_ip(request)

# CORS configuration
cors = CORSConfig(
    origins=["https://api.built-simple.ai"],
    methods=["GET", "POST"],
)
```

### db - Database Pooling

```python
from built_simple.db import SQLitePool, PostgresPool

# Connection pooling
pool = SQLitePool("/path/to/db.sqlite", max_connections=10)
async with pool.acquire() as conn:
    result = await conn.execute(query)
```

## API Key Hashing

All API keys are now hashed (SHA-256) before storage.

### Migration Databases
- FixIt: `/var/lib/fixit-api/auth.db` (7 keys)
- ArXiv: `/var/lib/arxiv-api/auth.db` (23 keys)
- PubMed: `/opt/pubmed-api-data/auth.db` (1 key)

## Migration Example

See `/opt/arxiv-migration-example/main.py` - reduces 800+ lines to ~150 lines.

### Before (800+ lines)
```python
# Manual auth, rate limiting, caching, logging, etc.
# Duplicated across every API
```

### After (~150 lines)
```python
from built_simple import create_app, Config
# Everything handled by SDK
```

## Deployment

1. Copy SDK to container: `/opt/built-simple-core/`
2. Add to Python path in main.py
3. Import and use modules
4. Configure via environment variables

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `API_NAME` | Name for logging/metrics |
| `STRIPE_SECRET_KEY` | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | Webhook verification |
| `CORS_ORIGINS` | Allowed origins (comma-separated) |
| `LOG_LEVEL` | Logging level (DEBUG/INFO/WARNING/ERROR) |

---
*Built-Simple-Core SDK - Unified infrastructure for all APIs*
