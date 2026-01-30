# Legal API - Legal Document Search

**Last Updated:** January 30, 2026
**Status:** Operational (FAISS v5.8 - 2M+ vectors)

## Overview

| Property | Value |
|----------|-------|
| **API Container** | CT 210 on Hoopa |
| **Database** | PostgreSQL on Giratina (192.168.1.100:5432) |
| **Host** | Hoopa (192.168.1.79) |
| **External URL** | Not yet configured |
| **Internal URL** | http://192.168.1.79:5002 (via CT 210) |
| **API Version** | 3.0.0 |

## Architecture

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                    Legal Search System                   │
                    └─────────────────────────────────────────────────────────┘

     ┌──────────────────────────────────────────────────────────────────────────┐
     │                          HOOPA (192.168.1.79)                            │
     │                                                                          │
     │  ┌─────────────────────────────────────────────────────────────────┐    │
     │  │ CT 210 - LegalDocs-Production                                    │    │
     │  │ 16 cores, 48GB RAM, RTX 3090 GPU passthrough                    │    │
     │  │                                                                  │    │
     │  │  FastAPI (port 5002)                                            │    │
     │  │    ├─ ModernBERT embedding model (GPU)                          │    │
     │  │    ├─ FAISS Flat index (2M+ vectors)                            │    │
     │  │    └─ Query encoding + similarity search                        │    │
     │  │                                                                  │    │
     │  │  /mnt/indexes (bind mount from /mnt/network_transfer/...)      │    │
     │  │    ├─ legal_faiss_v5.8.index (127 MB, 2,034,944 vectors)       │    │
     │  │    ├─ legal_id_map_v5.8.json (39 MB, opinion ID mapping)       │    │
     │  │    └─ courtlistener_combined.index (fallback, 2,453 vectors)   │    │
     │  └─────────────────────────────────────────────────────────────────┘    │
     │                                                                          │
     │  ┌─────────────────────────────────────────────────────────────────┐    │
     │  │ CT 211 - LegalSearch-DB                                          │    │
     │  │ 8 cores, 16GB RAM                                                │    │
     │  │ STATUS: Empty container (PostgreSQL NOT installed)               │    │
     │  │ INTENDED: Future PostgreSQL replica for Hoopa-local queries     │    │
     │  └─────────────────────────────────────────────────────────────────┘    │
     │                                                                          │
     │  ┌─────────────────────────────────────────────────────────────────┐    │
     │  │ CT 212 - LegalSearch-ES                                          │    │
     │  │ 8 cores, 16GB RAM                                                │    │
     │  │ STATUS: Empty container (Elasticsearch NOT installed)            │    │
     │  │ INTENDED: Full-text search complement to vector search          │    │
     │  └─────────────────────────────────────────────────────────────────┘    │
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
     │         ├─ migration_status                                              │
     │         └─ search_cache                                                  │
     │                                                                          │
     │  /mnt/raid6/courtlistener-data/                                          │
     │    ├─ opinions-2025-12-02.csv (321 GB, 57M+ rows)                       │
     │    └─ opinion-clusters-2025-12-02.csv (12 GB, 10M rows)                 │
     │                                                                          │
     │  /mnt/raid6/legal-indexes/                                               │
     │    ├─ build_legal_index_v4.py (production builder)                       │
     │    └─ CRITICAL_PATHS.md (documentation)                                  │
     └──────────────────────────────────────────────────────────────────────────┘
```

## Container Inventory

| VMID | Name | Purpose | Status | Resources |
|------|------|---------|--------|-----------|
| CT 210 | LegalDocs-Production | Main API + GPU inference | **Running** | 16 cores, 48GB RAM, 100GB disk |
| CT 211 | LegalSearch-DB | Planned PostgreSQL replica | Empty | 8 cores, 16GB RAM, 50GB disk |
| CT 212 | LegalSearch-ES | Planned Elasticsearch | Stopped/Empty | 8 cores, 16GB RAM, 50GB disk |

## Data Sources

### PostgreSQL (Giratina - legal_db)
- **Size**: 81 GB
- **Documents**: 9,206,663 total
- **User**: `readonly` / `LegalReadOnly2025`
- **Tables**:
  - `documents` - Full document content with search vectors
  - `search_cache` - Query result caching
  - `migration_status` - Data import tracking

### CourtListener CSV Data (Giratina)
- **opinions-2025-12-02.csv**: 321 GB, 57M+ opinion records
- **opinion-clusters-2025-12-02.csv**: 12 GB, 10M cluster records
- **Published opinions**: ~8.3M (filtered from clusters)
- **Source**: CourtListener bulk data export

### FAISS Index v5.8 (Production)
- **Type**: IndexFlatL2 (exact search, highest accuracy)
- **Model**: freelawproject/modernbert-embed-base_finetune_512
- **Dimensions**: 768
- **Total vectors**: 2,034,944 (published US opinions)
- **Index size**: 127 MB
- **ID map size**: 39 MB
- **Search time**: ~0.8s (after GPU warmup)

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/health` | GET | None | Service health + index info |
| `/status` | GET | None | Detailed system status |
| `/search` | POST | Optional | Vector similarity search |
| `/document/{id}` | GET | Optional | Fetch full document from DB |
| `/api/register` | POST | None | Get free API key |
| `/api/checkout` | POST | API Key | Stripe Pro upgrade |
| `/webhook/stripe` | POST | Signature | Payment webhooks |

## Current Status

### Working
- CT 210 API running (v3.0.0) with FAISS v5.8 index
- 2,034,944 published US legal opinions indexed
- ModernBERT embeddings via GPU (RTX 3090)
- Semantic search with ~0.8s response time
- Health/status endpoints

### Not Yet Implemented
- CT 211 PostgreSQL (container empty)
- CT 212 Elasticsearch (container empty)
- Cloudflare tunnel (no external URL)
- Monitoring integration
- Full text lookup (DB connection not configured)

## Tech Debt

| Issue | Severity | Description |
|-------|----------|-------------|
| CT 211 unused | Medium | 16GB RAM allocated, no PostgreSQL installed |
| CT 212 unused | Medium | 16GB RAM allocated, no Elasticsearch installed |
| No Cloudflare tunnel | Medium | API not externally accessible |
| No monitoring | Low | Not in application_health_monitor |
| DB on remote host | Low | Queries go to Giratina instead of local CT 211 |

## Planned Architecture

When fully deployed:

1. **Vector Search** (CT 210): FAISS + ModernBERT for semantic similarity
2. **Full-Text Search** (CT 212): Elasticsearch for keyword/phrase search
3. **Source of Truth** (CT 211): PostgreSQL replica with full document text
4. **Hybrid Results**: Combine vector + full-text scores for best results

## Quick Commands

```bash
# Check API health
ssh root@192.168.1.79 "pct exec 210 -- curl -s localhost:5002/health | python3 -m json.tool"

# Check container status
ssh root@192.168.1.79 "pct list | grep -i legal"

# View API logs
ssh root@192.168.1.79 "pct exec 210 -- journalctl -u legal-search -n 50 --no-pager"

# Check FAISS build progress
ssh root@192.168.1.79 "tail -c 3000 /mnt/network_transfer/legal-indexes/build_v4_hoopa.log | tail -10"

# Check PostgreSQL on Giratina
sudo -u postgres psql -d legal_db -c "SELECT COUNT(*) FROM documents;"

# Restart API
ssh root@192.168.1.79 "pct exec 210 -- systemctl restart legal-search"
```

## Configuration Files

| File | Location | Purpose |
|------|----------|---------|
| API Code | CT 210: `/opt/legal-search-api/legal_api_fastapi_v4.py` | Main API |
| Service Unit | CT 210: `/etc/systemd/system/legal-search.service` | Systemd service |
| Index Builder | Giratina: `/mnt/raid6/legal-indexes/build_legal_index_v4.py` | FAISS builder |
| Critical Paths | Giratina: `/mnt/raid6/legal-indexes/CRITICAL_PATHS.md` | Documentation |

## Index Configuration

The API auto-selects index based on availability:

```python
INDEX_CONFIG = {
    "primary": {
        "index_file": "legal_faiss_v5.8.index",
        "metadata_file": "legal_id_map_v5.8.json",
        "model_name": "freelawproject/modernbert-embed-base_finetune_512",
    },
    "fallback": {
        "index_file": "courtlistener_combined.index",
        "metadata_file": "courtlistener_combined_metadata.json",
        "model_name": "nlpaueb/legal-bert-base-uncased",
    }
}
```

**Note:** v5.8 uses a different metadata format (`{opinion_id: index_position}`) which the API converts at load time.

## Rate Limits

| Tier | Monthly Limit | Rate Limit | Price |
|------|---------------|------------|-------|
| Anonymous | N/A | 5/minute | Free |
| Free | 100/month | 10/minute | Free |
| Pro | 10,000/month | 100/minute | $49/month |

---
*Documentation updated: January 30, 2026*
*Status: Operational with FAISS v5.8 (2M+ vectors)*
*Previous: January 10, 2026 - "Partially Operational (v4 build in progress)"*
