# Legal API - Legal Document Search

**Last Updated:** February 16, 2026
**Status:** Operational (FAISS v5.9 - 2M+ vectors, consolidated on RTX 3090 #2)

## Overview

| Property | Value |
|----------|-------|
| **Host** | Hoopa (192.168.1.79) - bare metal, not container |
| **Database** | PostgreSQL on Giratina (192.168.1.100:5432) |
| **External URL** | https://legal.built-simple.ai (needs dashboard config) |
| **Internal URL** | http://192.168.1.79:5002 |
| **API Version** | 6.0.0-consolidated |
| **GPU** | RTX 3090 #2 (GPU index 2) |

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
│  │    └─ legal_id_map_v5.9.json (metadata mapping)               │    │
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

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Service health + index info |
| `/search` | POST | Vector similarity search |
| `/stats` | GET | GPU and query statistics |

### Search Request
```json
POST /search
{
  "query": "first amendment free speech",
  "limit": 10
}
```

### Search Response
```json
{
  "query": "first amendment free speech",
  "results": [
    {"rank": 1, "score": 0.64, "opinion_id": "4127189", "cluster_id": "4349929"},
    ...
  ],
  "search_time_ms": 15.43,
  "embed_time_ms": 737.94,
  "total_time_ms": 753.51,
  "index_type": "IndexFlatIP (100% recall)",
  "vectors_searched": 2034973
}
```

## Configuration Files

| File | Location | Purpose |
|------|----------|---------|
| API Code | Hoopa: `/opt/legal-search-api/legal_search_consolidated.py` | Main API v6.0 |
| Service Unit | Hoopa: `/etc/systemd/system/legal-search-consolidated.service` | Systemd service |
| Logs | Hoopa: `/tmp/legal_api_consolidated.log` | Runtime logs |

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

**STATUS: Needs Dashboard Configuration**

The Giratina tunnel uses remote configuration from Cloudflare Zero Trust dashboard. To enable public access:

1. Go to Cloudflare Zero Trust Dashboard
2. Navigate to: Access → Tunnels → giratina → Configure → Public Hostname
3. Add new public hostname:
   - **Subdomain**: legal
   - **Domain**: built-simple.ai
   - **Service**: http://192.168.1.79:5002
   - **Origin Settings**:
     - Connect Timeout: 60s
     - Keep Alive Connections: 50

**Note**: The local config file at `/etc/cloudflared/config.yml` has the entry, but remote config from dashboard takes precedence.

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

- **Feb 16, 2026**: Consolidated to single RTX 3090 #2, freed 5090+3090#1 for video generation
- **Feb 13, 2026**: Running v5.9 with 2M+ vectors
- **Jan 30, 2026**: FAISS v5.8 index operational
- **Jan 10, 2026**: Initial v4 build in progress

---
*Documentation updated: February 16, 2026*
*GPU consolidation completed - 5090 and 3090 #1 now free*
