# Network Connectivity

**Last Updated:** January 9, 2026

## Internet Service

**ISP:** Starlink Satellite Internet
**Status:** Full unrestricted access on all machines
**Migrated:** December 8, 2025 (from Cox Communications)

### Key Points

- All `curl`, `wget`, `apt`, `npm`, `pip` commands work directly
- NO tunnels, proxies, or `proxychains4` needed anywhere
- HTTPS works natively to all destinations
- No ISP blocking or restrictions

### Verification Tests

```bash
# These work directly on ALL cluster machines:
curl https://www.google.com        # 200 OK (~0.2s)
curl https://github.com            # 200 OK (~0.4s)
curl https://api.anthropic.com     # 404 OK (~0.2s)
apt update
npm install
git clone https://github.com/...
```

## Network Topology

```
Internet (Starlink)
    │
    └── Router (192.168.1.1)
            │
            ├── Giratina (192.168.1.100) ─── PRIMARY
            │   └── Cloudflare Tunnel: giratina
            │
            ├── Talon (192.168.1.7)
            │
            ├── Silvally (192.168.1.52)
            │   └── Cloudflare Tunnel: silvally
            │
            ├── Hoopa (192.168.1.79)
            │
            └── Victini (192.168.1.115)
                └── Cloudflare Tunnel: victini
```

## Subnet Configuration

- **Primary Subnet:** 192.168.1.0/24
- **Gateway:** 192.168.1.1
- **DNS:** Cloudflare (1.1.1.1, 1.0.0.1)

## Machine IP Addresses

| Machine | IP | Role |
|---------|-----|------|
| Giratina | 192.168.1.100 | Primary Proxmox, GPU server |
| Talon | 192.168.1.7 | Secondary Proxmox |
| Silvally | 192.168.1.52 | Application server |
| Hoopa | 192.168.1.79 | GPU node (4x RTX 3090) |
| Victini | 192.168.1.115 | File server, voice assistants |

## Local SSH Access

```bash
# From any machine on 192.168.1.x network
ssh root@192.168.1.100    # Giratina
ssh root@192.168.1.7      # Talon
ssh root@192.168.1.52     # Silvally
ssh root@192.168.1.79     # Hoopa
ssh root@192.168.1.115    # Victini

# Password for all: BuiltSimple2025!
```

## Firewall Notes

- **ICMP:** Ping may fail between machines (firewall rules)
- **SSH:** Always works on local network
- **Cluster:** Corosync traffic allowed on all interfaces

## Troubleshooting

```bash
# Test internet connectivity
curl -I https://www.google.com

# Check network interface
ip addr show

# Check routes
ip route show

# Check DNS resolution
host google.com

# Test SSH connectivity
ssh -v root@192.168.1.100
```

---
*Network migrated to Starlink: December 8, 2025*
