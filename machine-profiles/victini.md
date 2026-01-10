# Machine Profile: Victini

**Last Updated:** January 9, 2026
**Role:** File Server / Voice Assistants

## System Overview

| Property | Value |
|----------|-------|
| **Hostname** | victini |
| **IP Address** | 192.168.1.115 |
| **OS** | Proxmox VE 8.x |
| **Cluster** | pallet-town |

## Network Configuration

- **Primary IP:** 192.168.1.115
- **Gateway:** 192.168.1.1
- **Internet:** Starlink (direct, no proxy)

### Cloudflare Tunnel
- **Tunnel Name:** victini
- **Tunnel ID:** 979d5394-daae-457f-8f56-7b256bb0e9eb
- **Config:** /etc/cloudflared/config.yml

## LXC Containers

| VMID | Name | IP | Purpose | Status |
|------|------|-----|---------|--------|
| 110 | PCBox | 192.168.1.148 | File server | Running |
| 114 | sarcastic-receptionist | DHCP | Voice assistant (generic) | Running |
| 116 | thai-receptionist | DHCP | Voice assistant (Peinto Thai) | Running |

### Container Details

#### CT 110: PCBox
- **Port:** 8080
- **Purpose:** File access/sharing
- **External:** pcbox.built-simple.ai

#### CT 114: Sarcastic Receptionist
- **Port:** 3000
- **Stack:** Express.js, OpenAI, Deepgram, PlayHT, Twilio
- **Phone:** +1 (725) 726-3727
- **External:** receptionist.built-simple.ai
- **Status:** Running but 404 routing issue

#### CT 116: Thai Receptionist (Peinto Thai Kitchen)
- **Port:** 3000
- **Stack:** Express.js, OpenAI, Deepgram, PlayHT, Twilio
- **Phone:** +1 (725) 726-3727 (shared!)
- **External:** peintothai.built-simple.ai
- **Status:** Running but DNS not configured

## SSH Access

```bash
# Local
ssh root@192.168.1.115

# External (via Cloudflare)
cloudflared access tcp --hostname victini.built-simple.ai --url localhost:2025 &
ssh root@localhost -p 2025
```

## Quick Commands

```bash
# Check containers
pct list

# Check tunnel status
systemctl status cloudflared

# Access receptionist logs
pct exec 114 -- pm2 logs
pct exec 116 -- pm2 logs
```

## External URLs

- https://pokemoncenter.built-simple.ai - Proxmox UI
- https://pcbox.built-simple.ai - File access
- https://receptionist.built-simple.ai - Sarcastic Receptionist (404 issue)
- https://peintothai.built-simple.ai - Thai Receptionist (DNS needed)

## Known Issues

1. **Receptionist 404:** DNS resolves but Cloudflare returns 404 - routing issue
2. **Thai Receptionist DNS:** CNAME record missing
3. **Shared Phone Number:** Both receptionists use same Twilio number - potential conflict

## Migration History

Containers migrated TO Silvally on December 13, 2025:
- CT 111 → CT 311 on Silvally (buffer-killer)
- CT 112 → CT 312 on Silvally (myfit-pro)
- CT 113 → CT 313 on Silvally (reviewmaster)

CT 115 (configurable-reviewmaster) deleted as obsolete.

---
*Profile for Victini - File server and voice assistants in pallet-town cluster*
