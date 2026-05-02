# Machine Profile: Hoopa

**Last Updated:** May 2, 2026
**Role:** GPU Node (3x RTX 3090 + 1x RTX 5090)

## Current Status

### ✅ ONLINE - All Systems Operational (May 2, 2026)

**Status:** Healthy
- 4 GPUs working (5090 + 3x 3090)
- RTX 5090 power limited to 475W (persists via rc.local)
- Wikipedia API healthy (4.85M vectors, GPU enabled)
- FixIt Embedding Server running
- CPU temps healthy (42-68°C with box fan cooling)

---

## Known Issues

### PCIe Riser Cable Issues - ONGOING

**Discovered:** April-May 2026
**Status:** Riser cable is flaky - requires firm seating
**Severity:** Medium

**Background:**
- PCIe riser cables connecting GPUs can cause boot failures if not firmly seated
- Symptoms: System freezes at BIOS POST, nvidia driver hangs, "GPU fallen off bus" errors
- The riser must be squeezed firmly onto the GPU connector

**Troubleshooting:**
1. If system freezes at POST or driver hangs on `kgspExtractVbiosFromRom`:
   - Reseat the riser cable firmly on the GPU
   - Ensure power cables are connected
2. If a GPU shows "Unclassified device" in lspci instead of "VGA compatible controller":
   - The card isn't initializing properly - reseat it
3. To blacklist a problematic GPU temporarily:
   ```bash
   echo 'options nvidia NVreg_ExcludedGpus=0000:XX:00.0' > /etc/modprobe.d/nvidia-blacklist.conf
   update-initramfs -u && reboot
   ```

### CPU Cooling - REQUIRES BOX FAN

**Discovered:** April 2026
**Status:** Active workaround in place

**Background:**
- Server CPUs have no active cooling fans
- Without external cooling, CPUs reach 85°C (critical)
- Box fan pointed at motherboard keeps temps at 42-68°C

**Important:** Always ensure box fan is running when system is powered on.

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
| Index | GPU | VRAM | PCIe Bus | Notes |
|-------|-----|------|----------|-------|
| 0 | RTX 3090 | 24GB | 02:00.0 | Slot 2 |
| 1 | RTX 5090 | 32GB | 03:00.0 | Slot 4 (with adapter), **475W power limit** |
| 2 | RTX 3090 | 24GB | 81:00.0 | Slot 3 |
| 3 | RTX 3090 | 24GB | 82:00.0 | Slot 6 (closest to CPU) |

- **Total GPU Memory:** 104GB
- **5090 Power Limit:** 475W (set via `/etc/rc.local` on boot)

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
- **FixIt Embedding Server:** Port 8090 (GPU 1 - RTX 3090)
  - Systemd service: `fixit-embedding.service`
  - Vectors: 18.5M
  - Note: Cannot run on RTX 5090 due to FAISS CUDA compatibility (Blackwell architecture)

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
nvidia-smi --query-gpu=index,name,pci.bus_id,power.limit --format=csv

# Set 5090 power limit manually (GPU index 1)
nvidia-smi -i 1 -pl 475

# Check containers
pct list

# Check/restart embedding server
systemctl status fixit-embedding
systemctl restart fixit-embedding

# Check Wikipedia API health
curl http://192.168.1.213:8080/health

# Check CPU temps
for hwmon in /sys/class/hwmon/hwmon*/temp1_input; do
  echo -n "$hwmon: "; cat "$hwmon" | awk '{printf "%.0f°C\n", $1/1000}'
done
```

## IPMI/BMC Access

- **IPMI IP:** 192.168.1.80
- **Access:** https://192.168.1.80 (Supermicro web interface)
- **Use for:** Remote console, hard power cycle, hardware monitoring
- **Credentials:** Need to be reset (defaults didn't work)

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
