# N8N Workflow Automation

**Status:** Running
**Location:** CT 316 on Silvally (192.168.1.52)
**Container IP:** 192.168.1.61
**Port:** 5678
**Version:** 2.4.8

## URLs

| Environment | URL |
|-------------|-----|
| **Production** | https://n8n.built-simple.ai |
| **Internal** | http://192.168.1.61:5678 |

## Infrastructure

### Container Details
- **VMID:** 316
- **Hostname:** n8n
- **OS:** Debian (unprivileged)
- **Resources:** 2 cores, 2GB RAM, 8GB disk
- **Network:** vmbr0, static IP 192.168.1.61/24

### Cloudflare Tunnel
- **Tunnel ID:** 080e5208-a495-4cfc-98a9-ea90076c0363
- **Config:** `/etc/cloudflared/config.yml` on Silvally
- **Ingress:** `n8n.built-simple.ai` → `http://192.168.1.61:5678`

## Quick Commands

```bash
# Check N8N status
ssh root@192.168.1.52 "pct exec 316 -- systemctl status n8n"

# View N8N logs
ssh root@192.168.1.52 "pct exec 316 -- journalctl -u n8n -f"

# Restart N8N
ssh root@192.168.1.52 "pct exec 316 -- systemctl restart n8n"

# Access container shell
ssh root@192.168.1.52 "pct enter 316"
```

## Notes

- N8N is a workflow automation tool similar to Zapier
- Installed: January 29, 2026
- Accessible via Cloudflare tunnel for external access
- Internal access only from Silvally host (container networking)

---
*Created: January 29, 2026*
