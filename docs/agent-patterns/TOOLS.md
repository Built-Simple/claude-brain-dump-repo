# TOOLS.md - Local Specifics

## Cluster Nodes (SSH key auth - no passwords)
- **Giratina**: 192.168.1.100 (Primary, Nginx, Tunnels)
- **Hoopa**: 192.168.1.79 (GPU Heavy, RTX 5090)
- **Talon**: 192.168.1.7 (GPU, 2x 3090)
- **Silvally**: 192.168.1.52 (Apps: ReviewMaster, BufferKiller)
- **Victini**: 192.168.1.115 (Storage, Voice Receptionists)

SSH: `ssh root@<ip>` (key-based, no password needed)

## External Nodes (DigitalOcean)
- **Mew**: 137.184.235.100 (Receptionists, POS, KDS)
  - Phone: +1 (725) 726-3727 (Built Simple receptionist)
  - Status: ✅ SSH access configured

### Outbound Calling
```bash
# Call someone via AI receptionist
curl -X POST http://137.184.235.100:3000/make-call \
  -H "Content-Type: application/json" \
  -d '{"to": "+1XXXXXXXXXX"}'
```

## Health Endpoints
- FixIt: `https://fixitapi.built-simple.ai/health`
- PubMed: `https://pubmed.built-simple.ai/health`
- ArXiv: `https://arxiv.built-simple.ai/health`
- Wiki: `https://wikipedia.built-simple.ai/health`

## Container Mapping (LXC)
- **Giratina**: 103 (FixIt), 108 (PubMed), 122 (ArXiv)
- **Hoopa**: 213 (Wiki API), 215 (Wiki ES)
- **Silvally**: 311 (BufferKiller), 313 (ReviewMaster)
- **Victini**: 114 (Sarcastic Receptionist), 116 (Thai Receptionist)

## Automation
- Cron schedules managed via `cron` tool or `HEARTBEAT.md` polling.
- Persistent iptables fix for Hoopa: `iptables -I FORWARD -m physdev --physdev-is-bridged -j ACCEPT`
