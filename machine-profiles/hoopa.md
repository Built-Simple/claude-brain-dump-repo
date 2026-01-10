# Machine Profile: Hoopa

**Last Updated:** January 9, 2026
**Role:** GPU Node (4x RTX 3090)

## System Overview

| Property | Value |
|----------|-------|
| **Hostname** | hoopa |
| **IP Address** | 192.168.1.79 |
| **OS** | Proxmox VE 8.x |
| **Cluster** | pallet-town |

## Hardware Specifications

### GPUs
- **GPU 0:** NVIDIA RTX 3090 (24GB VRAM)
- **GPU 1:** NVIDIA RTX 3090 (24GB VRAM)
- **GPU 2:** NVIDIA RTX 3090 (24GB VRAM)
- **GPU 3:** NVIDIA RTX 3090 (24GB VRAM)
- **Total GPU Memory:** 96GB

## Network Configuration

- **Primary IP:** 192.168.1.79
- **Gateway:** 192.168.1.1
- **Internet:** Starlink (direct, no proxy)

## LXC Containers

### Wikipedia Hybrid Search (Production)
| VMID | Name | IP | Purpose | Status |
|------|------|-----|---------|--------|
| 213 | wiki-hybrid-api | 192.168.1.213 | Hybrid API (Vector + RRF) | Running |
| 214 | wiki-fts5 | 192.168.1.214 | SQLite FTS5 API | Running |
| 215 | wiki-elasticsearch | 192.168.1.215 | Elasticsearch BM25 | Running |

### Legal Search (In Development)
| VMID | Name | Purpose | Status |
|------|------|---------|--------|
| 210 | LegalDocs-Production | Main API (16 cores, 48GB RAM) | Running |
| 211 | LegalSearch-DB | Database backend | Running |
| 212 | LegalSearch-ES | Elasticsearch | Stopped |

### GPU Services (Host)
- **FixIt Embedding Server:** Port 8090 (GPU 3)
  - Location: /mnt/network_transfer/fixit-vectors/
  - Index: fixit_ivfpq.index (1.12GB IVF-PQ)

## SSH Access

```bash
# Local
ssh root@192.168.1.79

# External (via Cloudflare)
cloudflared access tcp --hostname hoopa.built-simple.ai --url localhost:2024 &
ssh root@localhost -p 2024
```

## Quick Commands

```bash
# Check GPU status
nvidia-smi

# Check containers
pct list

# Check embedding server
ps aux | grep embedding

# Start embedding server (GPU 3)
cd /mnt/network_transfer/fixit-vectors && CUDA_VISIBLE_DEVICES=3 nohup python3 -u embedding_server_gpu.py > embedding_server_gpu.log 2>&1 &

# Test embedding server
curl -X POST http://192.168.1.79:8090/search \
  -H "Content-Type: application/json" \
  -d '{"query":"python async await","limit":5}'
```

## External URLs

- https://wikipedia.built-simple.ai - Wikipedia Hybrid Search API

## Key Directories

```
/mnt/network_transfer/
├── fixit-vectors/           # FixIt vector search
│   ├── fixit_ivfpq.index    # 1.12GB compressed index
│   └── embedding_server_gpu.py
└── legal-indexes/           # Legal search indexes
```

## Notes

- Primary GPU compute node for vector search
- Wikipedia API runs entirely on Hoopa (3 containers)
- Legal API in development
- FixIt uses GPU 3 for embedding server

---
*Profile for Hoopa - GPU node (4x RTX 3090) in pallet-town cluster*
