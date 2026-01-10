# Machine Profile: Silvally

**Last Updated:** January 9, 2026
**Role:** Application Server

## System Overview

| Property | Value |
|----------|-------|
| **Hostname** | silvally |
| **IP Address** | 192.168.1.52 |
| **OS** | Proxmox VE 8.x |
| **Cluster** | pallet-town |

## Network Configuration

- **Primary IP:** 192.168.1.52
- **Gateway:** 192.168.1.1
- **Internet:** Starlink (direct, no proxy)

### Cloudflare Tunnel
- **Tunnel Name:** silvally
- **Tunnel ID:** 080e5208-a495-4cfc-98a9-ea90076c0363
- **Config:** /etc/cloudflared/config.yml
- **Created:** December 13, 2025

## LXC Containers

| VMID | Name | IP | Purpose | Status |
|------|------|-----|---------|--------|
| 311 | buffer-killer | 192.168.1.149 | Social media scheduler | Running |
| 312 | myfit-pro | 192.168.1.112 | Fitness tracking app | Running |
| 313 | reviewmaster | 192.168.1.200 | AI review responses | Running |

### Container Details

#### CT 311: Buffer Killer
- **Ports:** 3000 (OAuth), 3080 (Web UI)
- **Stack:** Node.js, Express, SQLite, PM2
- **External:** buffer-killer.built-simple.ai, buffer-killer-admin.built-simple.ai

#### CT 312: MyFit Pro
- **Port:** 3000
- **Stack:** Node.js
- **External:** myfit.built-simple.ai

#### CT 313: ReviewMaster Pro
- **Port:** 8001
- **Stack:** FastAPI, PostgreSQL, OpenAI
- **External:** reviewmaster.built-simple.ai
- **Revenue:** $29/month Pro tier

## SSH Access

```bash
# Local
ssh root@192.168.1.52

# External (via Cloudflare)
cloudflared access tcp --hostname silvally.built-simple.ai --url localhost:2023 &
ssh root@localhost -p 2023
```

## Quick Commands

```bash
# Check containers
pct list

# Access Buffer Killer
pct exec 311 -- pm2 list

# Access ReviewMaster
pct exec 313 -- systemctl status reviewmaster

# Check tunnel status
systemctl status cloudflared
```

## Migration History

Containers migrated from Victini on December 13, 2025:
- CT 111 → CT 311 (buffer-killer)
- CT 112 → CT 312 (myfit-pro)
- CT 113 → CT 313 (reviewmaster)

## External URLs

- https://buffer-killer.built-simple.ai - OAuth Server
- https://buffer-killer-admin.built-simple.ai - Web UI
- https://myfit.built-simple.ai - MyFit Pro
- https://reviewmaster.built-simple.ai - ReviewMaster Pro

---
*Profile for Silvally - Application server in pallet-town cluster*
