# Machine Profile: Hoopa

**Last Updated:** April 25, 2026
**Role:** GPU Node (3x RTX 3090 + 1x RTX 5090)

## Current Status

### ⚠️ OFFLINE - Requires Physical Access (April 25, 2026)

**Status:** Unreachable from network
**Discovery:** April 25, 2026 during cluster audit
**Severity:** HIGH - Wikipedia API (wikipedia.built-simple.ai) is DOWN

**Symptoms:**
- No ping response to 192.168.1.79
- ARP shows "incomplete" for the IP address
- `ssh root@192.168.1.79` returns "No route to host"
- Not visible in `pvecm status` cluster membership

**Probable Causes:**
1. Machine powered off
2. Network cable disconnected
3. Network interface down
4. Kernel panic / frozen

**Required Actions:**
- Physical access needed to diagnose
- Check power LED, network link lights
- Console access via iLO/IPMI or local keyboard/monitor
- If frozen, may need hardware reset

**Services Affected:**
- Wikipedia Hybrid Search API (CT 213, 214, 215)
- Legal API development (CT 210, 211)
- Ollama LLM API (port 11434)
- FixIt embedding server (port 8090)

---

## Known Issues

### GPU0 Intermittent PCIe Issues - RESOLVED via FLR

**Discovered:** February 22, 2026
**Status:** Recovered - GPU0 functional at 8.0 GT/s x8
**Severity:** Low (monitoring)

**Background:**
- GPU0 occasionally falls off the PCIe bus after reboot or driver issues
- x8 width is expected (motherboard has 3x x16 + 3x x8 slots, GPU0 is in x8 slot)
- 8.0 GT/s x8 = ~8 GB/s bandwidth - normal for this slot

**Recovery Command (if GPU0 disappears from nvidia-smi):**
```bash
# FLR (Function Level Reset) - recovers GPU0 without reboot
echo 1 > /sys/bus/pci/devices/0000:01:00.0/reset
```

**Symptoms that indicate GPU0 needs reset:**
- Only 3 GPUs visible in `nvidia-smi` (GPU0 missing)
- dmesg shows: `NVRM: GPU 0000:01:00.0: RmInitAdapter failed!`
- dmesg shows: `Cannot attach gpu` or `bad register read`

**History:**
- Feb 22: GPU0 fell off bus, showed PCIe errors, driver couldn't initialize
- Feb 23: FLR reset restored GPU0 to full functionality

### PCIe ASPM Performance Issue - FIXED Permanently

**Discovered:** February 23, 2026
**Status:** Fixed - takes effect on next reboot
**Root Cause:** `pcie_aspm=force` kernel parameter was limiting all GPUs to Gen 1 (2.5 GT/s)

**Fix Applied:**
1. Changed `/etc/default/grub`: `GRUB_CMDLINE_LINUX_DEFAULT="quiet pcie_aspm=off"`
2. Updated `/boot/grub/grub.cfg` with `pcie_aspm=off`

**Impact:**
- Without fix: All GPUs forced to PCIe Gen 1 (2.5 GT/s) = ~0.5 GB/s bandwidth
- With fix: GPUs run at Gen 3 (8.0 GT/s) = ~12 GB/s bandwidth

**Verification after reboot:**
```bash
nvidia-smi --query-gpu=index,name,pcie.link.gen.current --format=csv
# Should show Gen 3 for all GPUs
```

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
- **GPU 0:** NVIDIA RTX 3090 (24GB VRAM) - x8 slot (normal)
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

# Reset GPU0 if it falls off the bus (FLR recovery)
echo 1 > /sys/bus/pci/devices/0000:01:00.0/reset

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
