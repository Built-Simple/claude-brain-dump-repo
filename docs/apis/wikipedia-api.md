# Wikipedia Hybrid Search API

**Last Updated:** February 18, 2026
**Status:** Production Ready

## Overview

| Property | Value |
|----------|-------|
| **Container** | CT 213 on Hoopa (192.168.1.79) |
| **IP Address** | 192.168.1.213:8080 |
| **Articles** | 4,854,193 Wikipedia articles |
| **Vector Index** | FAISS GPU Flat (384 dimensions, brute-force search) |
| **Metadata Cache** | In-memory (~9GB RAM, loaded at startup) |
| **Keyword Search** | Elasticsearch 8.19.8 |
| **Embedding Model** | all-MiniLM-L6-v2 |

## External URL

- **API:** https://wikipedia.built-simple.ai

## Architecture (3 Containers on Hoopa)

| Container | Purpose | IP |
|-----------|---------|-----|
| CT 213 | Hybrid API (Vector + RRF) | 192.168.1.213:8080 |
| CT 214 | SQLite FTS5 API | 192.168.1.214:8080 |
| CT 215 | Elasticsearch BM25 | 192.168.1.215:8081 |

## API Endpoints

### Health Check
```bash
curl https://wikipedia.built-simple.ai/health
```

### Register for API Key
```bash
curl -X POST https://wikipedia.built-simple.ai/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### Hybrid Search (vector + BM25 with RRF)
```bash
curl -X POST https://wikipedia.built-simple.ai/api/hybrid \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{"query":"quantum physics","limit":10,"mode":"hybrid"}'
```

### Vector-Only Search
```bash
curl -X POST https://wikipedia.built-simple.ai/api/hybrid \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{"query":"machine learning","limit":10,"mode":"vector"}'
```

### BM25-Only Search (keyword)
```bash
curl -X POST https://wikipedia.built-simple.ai/api/hybrid \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{"query":"Einstein relativity","limit":10,"mode":"bm25"}'
```

### Get Full Article
```bash
curl https://wikipedia.built-simple.ai/api/article/12345 \
  -H "X-API-Key: your_api_key"
```

### Get Multiple Articles (batch)
```bash
curl -X POST https://wikipedia.built-simple.ai/api/articles \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{"ids":[12345,67890,11111]}'
```

### Contact Form
```bash
curl -X POST https://wikipedia.built-simple.ai/api/contact \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","subject":"Question","message":"Your message"}'
```

## Search Modes

| Mode | Description |
|------|-------------|
| hybrid | Vector + BM25 with RRF algorithm |
| vector | GPU FAISS semantic search only |
| bm25 | Elasticsearch keyword search with highlights |

## Features

- 4,854,193 Wikipedia articles indexed
- GPU-accelerated FAISS vector search
- Elasticsearch BM25 keyword search with highlights
- Reciprocal Rank Fusion (RRF) for result merging
- API key authentication (email + Google OAuth)
- Rate limiting (100/month free, 10,000/month pro)
- Stripe integration ready ($29/month)
- Lazy-loaded article content with prefetch
- Contact form (server-side email)

## Performance (After In-Memory Metadata Cache)

| Operation | Time |
|-----------|------|
| Vector search (with RAM cache) | ~175-250ms warm |
| Elasticsearch BM25 | ~500-2500ms (varies by query) |
| Full hybrid | ~765ms - 2.5s warm |
| Startup time | ~42 minutes (loading 4.85M articles from HDD) |

**Note:** The in-memory metadata cache eliminates SQLite disk I/O during searches. Previously, metadata lookups from the HDD-backed SQLite database took ~30 seconds. Now metadata lookup is instant from RAM (~9GB cache).

### Performance History

| Date | Improvement | Result |
|------|-------------|--------|
| Feb 6, 2026 | Flat index upgrade | 100% vector coverage (vs 3% with IVF) |
| Feb 18, 2026 | In-memory metadata cache | Vector search: 30s → 200ms (150x faster) |

## Security

- API key authentication on all data endpoints
- Rate limiting (per-minute and monthly)
- Input validation via Pydantic
- SQL injection prevention (parameterized queries)
- CORS configured as `*` (appropriate for public API)
- HTTPS via Cloudflare tunnel

## Quick Commands

```bash
# Test health
curl https://wikipedia.built-simple.ai/health

# Register and search
API_KEY=$(curl -s -X POST https://wikipedia.built-simple.ai/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' | jq -r '.api_key')

curl -X POST https://wikipedia.built-simple.ai/api/hybrid \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"query":"artificial intelligence","limit":5,"mode":"hybrid"}'
```

## Known Limitations

- ES timeout on complex multi-word queries under load
- Graceful fallback to vector-only when BM25 times out

## Known Issues & Fixes

### CT 213 Network Connectivity (Fixed January 19, 2026)

**Symptom:** Wikipedia API unreachable from outside Hoopa; CT 213 can't ping gateway or other hosts.

**Root Cause:** Docker was installed on Hoopa at 02:12 on January 19, 2026. Docker sets iptables FORWARD chain to `policy DROP` for container isolation. With `bridge-nf-call-iptables=1`, bridged LXC traffic goes through iptables. CT 213 has `firewall=0` so it uses `veth213i0` directly on `vmbr0` (not through `fwln+` interfaces that PVE firewall rules match on), and there was no ACCEPT rule for this traffic.

**Fix:** Added iptables rule to accept bridged traffic:
```bash
iptables -I FORWARD -m physdev --physdev-is-bridged -j ACCEPT
```

**Persistence:** Added to `/etc/network/interfaces` on Hoopa:
```
post-up iptables -I FORWARD -m physdev --physdev-is-bridged -j ACCEPT || true
```

### Flat Index Upgrade (Fixed February 6, 2026)

**Symptom:** IVF index only searched 2.9% of vectors (nprobe=64, nlist=2203). Search results were incomplete.

**Root Cause:** IVF approximate nearest neighbor search only searches a subset of clusters. For large datasets with diverse content, this misses many relevant results.

**Fix:** Rebuilt index as IndexFlatIP (brute-force) to search 100% of vectors:
1. Created `/opt/rebuild_flat_v2.py` to extract vectors from IVF inverted lists
2. Key fix: Map internal IDs to external article IDs via IndexIDMap2's id_map
3. Built new IndexFlatIP with correct ID mapping
4. Index stored at `/opt/wikipedia-index/wikipedia_flat.index` (7GB)

**Script location:** `/opt/rebuild_flat_v2.py` in CT 213

**Impact:**
- Search quality: Much better (100% vector coverage)
- Latency: ~300ms vs ~40ms (acceptable tradeoff for quality)
- GPU memory: ~7GB on GPU 2 (RTX 3090)

### In-Memory Metadata Cache (Fixed February 18, 2026)

**Symptom:** Search queries taking ~40 seconds due to slow SQLite metadata lookups from HDD-backed LVM thin pool.

**Root Cause:** The 31GB SQLite database was stored on LVM thin pool that spans HDDs. Each search required ~100 metadata lookups, taking 30+ seconds from HDD.

**Fix:** Added in-memory metadata cache that loads all 4,854,193 article metadata (title, category, summary) into RAM at startup:
1. Added `metadata_cache` global dict in `/opt/wikipedia_api_production.py`
2. Added `load_metadata_cache()` function that loads all metadata at startup
3. Modified `get_articles_by_ids()` to use RAM cache with SQLite fallback

**Impact:**
- Vector search: 30,000ms → 175ms (150x faster)
- Hybrid search: 40,000ms → 765ms warm
- RAM usage: +9GB (CT 213 has 48GB allocated)
- Startup time: +38 minutes (loading from HDD)

**Code location:** `/opt/wikipedia_api_production.py` in CT 213

---
*Wikipedia Hybrid API deployed: December 13, 2025*
*SSD optimization: January 7, 2026*
*Network fix: January 19, 2026*
*Flat index upgrade: February 6, 2026*
*In-memory metadata cache: February 18, 2026*
