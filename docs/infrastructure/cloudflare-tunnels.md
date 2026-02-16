# Cloudflare Tunnel Infrastructure

**Last Updated:** January 9, 2026

## Active Tunnels

### Giratina Tunnel (Primary)

| Property | Value |
|----------|-------|
| **Tunnel Name** | giratina |
| **Tunnel ID** | 0f2c7edc-1d40-4930-916c-2e7d0bbcdbc5 |
| **Host** | Giratina (192.168.1.100) |
| **Config** | /etc/cloudflared/config.yml |

**Services:**
- SSH port forwards to all cluster nodes
- FixIt API and Frontend
- PubMed API
- ArXiv API
- Built-Simple marketing website
- Happy Server

### Silvally Tunnel (Applications)

| Property | Value |
|----------|-------|
| **Tunnel Name** | silvally |
| **Tunnel ID** | 080e5208-a495-4cfc-98a9-ea90076c0363 |
| **Host** | Silvally (192.168.1.52) |
| **Config** | /etc/cloudflared/config.yml |
| **Created** | December 13, 2025 |

**Services:**
- Buffer Killer (OAuth + Admin)
- MyFit Pro
- ReviewMaster Pro

### Victini Tunnel (File Server + Receptionists)

| Property | Value |
|----------|-------|
| **Tunnel Name** | victini |
| **Tunnel ID** | 979d5394-daae-457f-8f56-7b256bb0e9eb |
| **Host** | Victini (192.168.1.115) |
| **Config** | /etc/cloudflared/config.yml |

**Services:**
- PCBox file access
- Thai Receptionist
- Sarcastic Receptionist
- Proxmox UI (pokemoncenter)

## External Domains

### Via Giratina Tunnel
| Domain | Target | Purpose |
|--------|--------|---------|
| talon.built-simple.ai | localhost:2222 | Talon SSH |
| silvally.built-simple.ai | localhost:2223 | Silvally SSH |
| hoopa.built-simple.ai | localhost:2224 | Hoopa SSH |
| victini.built-simple.ai | localhost:2225 | Victini SSH |
| pallettown.built-simple.ai | localhost:8006 + SSH | Giratina Proxmox + SSH |
| fixit.built-simple.ai | 192.168.1.42:80 | FixIt Frontend |
| fixitapi.built-simple.ai | 192.168.1.42:5001 | FixIt API |
| pubmed.built-simple.ai | 192.168.1.135:5001 | PubMed API |
| arxiv.built-simple.ai | 192.168.1.120:8082 | ArXiv API |
| built-simple.ai | CT 400:80 | Marketing Website |
| happy.built-simple.ai | localhost:3005 | Happy Server |

### Via Silvally Tunnel
| Domain | Target | Purpose |
|--------|--------|---------|
| buffer-killer.built-simple.ai | 192.168.1.149:3000 | OAuth Server |
| buffer-killer-admin.built-simple.ai | 192.168.1.149:3080 | Web UI |
| myfit.built-simple.ai | 192.168.1.112:3000 | MyFit Pro |
| reviewmaster.built-simple.ai | 192.168.1.200:8001 | ReviewMaster Pro |

### Via Victini Tunnel
| Domain | Target | Purpose |
|--------|--------|---------|
| pokemoncenter.built-simple.ai | localhost:8006 | Victini Proxmox UI |
| pcbox.built-simple.ai | 192.168.1.148:8080 | File access |
| peintothai.built-simple.ai | CT 116:3000 | Thai Receptionist |
| receptionist.built-simple.ai | CT 114:3000 | Sarcastic Receptionist |

### Via Hoopa (through Giratina)
| Domain | Target | Purpose |
|--------|--------|---------|
| wikipedia.built-simple.ai | 192.168.1.213:8080 | Wikipedia Hybrid API |
| legal.built-simple.ai | 192.168.1.79:5002 | Legal Search API (needs dashboard config) |

## SSH Port Forwards (Giratina)

```bash
# Active forwards from Giratina to cluster nodes:
localhost:2222 → 192.168.1.7:22    # Talon
localhost:2223 → 192.168.1.52:22   # Silvally
localhost:2224 → 192.168.1.79:22   # Hoopa
localhost:2225 → 192.168.1.115:22  # Victini
```

## External SSH Access

```bash
# From external machine (laptop, etc.)
cloudflared access tcp --hostname talon.built-simple.ai --url localhost:2022 &
ssh root@localhost -p 2022

cloudflared access tcp --hostname silvally.built-simple.ai --url localhost:2023 &
ssh root@localhost -p 2023

cloudflared access tcp --hostname hoopa.built-simple.ai --url localhost:2024 &
ssh root@localhost -p 2024

cloudflared access tcp --hostname victini.built-simple.ai --url localhost:2025 &
ssh root@localhost -p 2025

cloudflared access tcp --hostname pallettown.built-simple.ai --url localhost:2026 &
ssh root@localhost -p 2026
```

## Management Commands

```bash
# Check tunnel status
systemctl status cloudflared

# View tunnel logs
journalctl -u cloudflared -f

# Restart tunnel
systemctl restart cloudflared

# Validate config
cloudflared tunnel ingress validate

# List tunnels
cloudflared tunnel list
```

## Configuration Files

Each tunnel host has its config at `/etc/cloudflared/config.yml`

Example structure:
```yaml
tunnel: <tunnel-id>
credentials-file: /etc/cloudflared/<tunnel-id>.json

ingress:
  - hostname: example.built-simple.ai
    service: http://192.168.1.x:port
  - service: http_status:404
```

## Troubleshooting

### Tunnel Crashes
- Check logs: `journalctl -u cloudflared -n 50`
- Common cause: Unreachable upstream services
- Verify all service IPs are correct in config

### 404 Errors
- Domain resolves but returns 404
- Check ingress rules in config.yml
- Ensure service is actually running on target port

### DNS Issues
- Add CNAME record in Cloudflare dashboard
- Point to `<tunnel-id>.cfargotunnel.com`

---
*Silvally tunnel created: December 13, 2025*
