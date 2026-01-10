# Wikipedia Hybrid Search API

**Last Updated:** January 9, 2026
**Status:** Production Ready

## Overview

| Property | Value |
|----------|-------|
| **Container** | CT 213 on Hoopa (192.168.1.79) |
| **IP Address** | 192.168.1.213:8080 |
| **Articles** | 4,854,193 Wikipedia articles |
| **Vector Index** | FAISS GPU IVF (384 dimensions) |
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

## Performance (After SSD Optimization)

| Operation | Time |
|-----------|------|
| SQLite queries | ~0.4-0.5ms |
| Elasticsearch | ~17-25ms |
| Vector search | ~40ms warm |
| Full hybrid | 40-100ms warm, ~500ms cold |

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

---
*Wikipedia Hybrid API deployed: December 13, 2025*
*SSD optimization: January 7, 2026*
