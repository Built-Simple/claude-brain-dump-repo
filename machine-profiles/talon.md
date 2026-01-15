# Machine Profile: Talon

**Last Updated:** January 15, 2026
**Role:** Secondary Proxmox Node / GPU Server

## System Overview

| Property | Value |
|----------|-------|
| **Hostname** | talon |
| **IP Address** | 192.168.1.7 |
| **OS** | Proxmox VE 8.x |
| **Cluster** | pallet-town (secondary node) |

## Hardware Specifications

### Processor
- **CPU:** AMD Ryzen 9 7900 12-Core Processor
- **Cores:** 12 (24 threads)
- **Architecture:** x86_64

### Memory
- **Total RAM:** 125GB

### GPUs
- **GPU 0:** NVIDIA RTX 3090 (24GB VRAM)
- **GPU 1:** NVIDIA RTX 3090 (24GB VRAM)
- **Total GPU Memory:** 48GB

## Network Configuration

- **Primary IP:** 192.168.1.7
- **Gateway:** 192.168.1.1
- **Internet:** Starlink (direct, no proxy)

## LXC Containers

| VMID | Name | Purpose | Status |
|------|------|---------|--------|
| 109 | PMCMedical-Lightning | PMC document processing (legacy) | Stopped |

## SSH Access

```bash
# Local
ssh root@192.168.1.7

# External (via Cloudflare)
cloudflared access tcp --hostname talon.built-simple.ai --url localhost:2022 &
ssh root@localhost -p 2022
```

## Quick Commands

```bash
# Check containers
pct list

# Check cluster status
pvecm status

# Check GPU status
nvidia-smi
```

## Notes

- Secondary GPU node with 48GB VRAM capacity
- Available for burst AI workloads and failover
- CT 109 is archived/legacy

---
*Profile for Talon - Secondary Proxmox node in pallet-town cluster*
