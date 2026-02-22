# Machine Profile: Hoopa

**Last Updated:** February 22, 2026
**Role:** GPU Node (3x RTX 3090 + 1x RTX 5090)

## Known Issues

### GPU0 PCIe Failure - MAINTENANCE REQUIRED

**Discovered:** February 22, 2026
**Status:** Scheduled for physical maintenance
**Severity:** Medium (GPU functional but degraded)

**Symptoms:**
- PCIe link running at 2.5 GT/s x8 instead of 8 GT/s x16 (6% of normal bandwidth)
- Lane 5 physical error detected
- Correctable errors: RxErr, BadTLP, Rollover, Timeout
- GPU occasionally falls off bus entirely (recovers after ~1 hour)
- 30,000+ PCIe replay errors since boot

**Impact:**
- GPU0 (RTX 3090 in slot 1) has ~2 GB/s bandwidth instead of ~16 GB/s
- Model loading 6-8x slower than normal
- Currently idle/unusable for production workloads

**Maintenance Checklist:**
- [ ] Power off Hoopa completely
- [ ] Reseat GPU0 in PCIe slot 1
- [ ] Clean PCIe contacts with isopropyl alcohol
- [ ] Check 8-pin PCIe power cables fully seated
- [ ] Inspect slot for physical damage
- [ ] If issue persists, try GPU0 in different slot
- [ ] If still failing, RMA GPU0 (Serial: 1653921001226)

**Workaround:** Use GPU1-3 for workloads until fixed. GPU0 is currently idle.

## System Overview

| Property | Value |
|----------|-------|
| **Hostname** | hoopa |
| **IP Address** | 192.168.1.79 |
| **OS** | Proxmox VE 8.x |
| **Cluster** | pallet-town |

## Hardware Specifications

### Processor
- **CPU:** Intel Xeon E5-2620 v3 @ 2.40GHz
- **Sockets:** 2 (Dual CPU)
- **Cores:** 12 total (24 threads)

### Memory
- **Total RAM:** 126GB

### GPUs
- **GPU 0:** NVIDIA RTX 3090 (24GB VRAM) - ⚠️ PCIe DEGRADED - see Known Issues
- **GPU 1:** NVIDIA RTX 5090 (32GB VRAM)
- **GPU 2:** NVIDIA RTX 3090 (24GB VRAM)
- **GPU 3:** NVIDIA RTX 3090 (24GB VRAM)
- **Total GPU Memory:** 104GB

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
- Flagship RTX 5090 for maximum inference performance
- Wikipedia API runs entirely on Hoopa (3 containers)
- Legal API in development
- FixIt uses GPU 3 for embedding server

---
*Profile for Hoopa - GPU node (3x RTX 3090 + 1x RTX 5090) in pallet-town cluster*

## Ollama API (LAN Accessible)

**Endpoint:** `http://192.168.1.79:11434`

### Available Models
| Model | Size | Use Case |
|-------|------|----------|
| `qwen2.5-coder:14b` | 9GB | Code generation, debugging |
| `llama3.2:1b` | 1.3GB | Fast simple tasks |
| `medllama2:7b` | 3.8GB | Medical/health queries |

### Quick Usage
```bash
# List models
curl http://192.168.1.79:11434/api/tags | jq '.models[].name'

# Generate (non-streaming)
curl -s http://192.168.1.79:11434/api/generate \
  -d '{"model": "qwen2.5-coder:14b", "prompt": "Write a hello world", "stream": false}' \
  | jq -r '.response'

# Helper script on Giratina
/root/ollama-query.sh "your prompt" [model]
```

### Performance
- First call: ~5-10s (model load to GPU)
- Subsequent calls: <1s generation
- Running on RTX 5090 (32GB) + 3x RTX 3090 (24GB each)

### Firewall
Port 11434 opened via iptables (persisted to `/etc/iptables/rules.v4`)
