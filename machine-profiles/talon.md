# Machine Profile: Talon

**Last Updated:** January 9, 2026
**Role:** Secondary Proxmox Node

## System Overview

| Property | Value |
|----------|-------|
| **Hostname** | talon |
| **IP Address** | 192.168.1.7 |
| **OS** | Proxmox VE 8.x |
| **Cluster** | pallet-town (secondary node) |

## Hardware Specifications

- **Type:** Desktop/Server
- **Purpose:** Secondary cluster node, backup capacity

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
```

## Notes

- Minimal workload currently
- Available for additional containers if needed
- CT 109 is archived/legacy

---
*Profile for Talon - Secondary Proxmox node in pallet-town cluster*
