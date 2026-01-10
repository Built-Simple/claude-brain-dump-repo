# Machine Profile: Giratina

**Last Updated:** January 9, 2026
**Role:** Primary Proxmox Node / GPU Server

## System Overview

| Property | Value |
|----------|-------|
| **Hostname** | giratina |
| **IP Address** | 192.168.1.100 |
| **OS** | Proxmox VE 8.4.0 (Debian-based) |
| **Kernel** | Linux 6.8.12-9-pve |
| **Cluster** | pallet-town (primary node) |

## Hardware Specifications

### Server
- **Model:** Dell PowerEdge R740xd
- **Form Factor:** 2U Rack Server

### Processors
- **CPU:** Intel Xeon (dual socket)
- **Architecture:** x86_64

### Memory
- **Total RAM:** 314GB
- **Type:** DDR4 ECC

### GPUs
- **GPU 0:** NVIDIA Tesla T4 (15GB VRAM)
- **GPU 1:** NVIDIA Tesla T4 (15GB VRAM)
- **Total GPU Memory:** 30GB
- **Note:** Running at PCIe Gen 1 (should be Gen 3) - CHECK CABLES/SLOTS

### Storage
- **RAID6 Array:** 13TB (ZFS)
- **Mount:** /mnt/raid6
- **Network Shares:** Connected

## Network Configuration

- **Primary IP:** 192.168.1.100
- **Gateway:** 192.168.1.1
- **DNS:** Cloudflare (1.1.1.1)
- **Internet:** Starlink (direct, no proxy)

### Cloudflare Tunnel
- **Tunnel Name:** giratina
- **Tunnel ID:** 0f2c7edc-1d40-4930-916c-2e7d0bbcdbc5
- **Config:** /etc/cloudflared/config.yml

## LXC Containers

| VMID | Name | IP | Purpose | Status |
|------|------|-----|---------|--------|
| 103 | FixItAPI | 192.168.1.42 | Stack Overflow Search API | Running |
| 105 | admin-coder-420 | DHCP | Admin tools | Running |
| 108 | PubMedSearch | 192.168.1.135 | Medical Research API | Running |
| 122 | arxiv-gpu-pytorch | 192.168.1.120 | ArXiv Research API | Running |
| 123 | arxiv-postgres | 192.168.1.121 | ArXiv Database | Running |
| 300 | smb-server | DHCP | SMB file shares | Running |
| 400 | built-simple-web | DHCP | Marketing website | Running |
| 502 | pubmed-postgres | DHCP | (Empty - unused) | Running |
| 503 | pubmed-elastic | 192.168.1.139 | Elasticsearch | Running |
| 504 | filesearch | DHCP | File search service | Running |

## Services Running on Host

### Docker Stack: Happy Server
- **happy-server:** Port 3005 (API)
- **happy-web-client:** Port 3080 (Web UI)
- **happy-postgres:** Port 5433 (Database)
- **happy-redis:** Port 6380 (Cache)
- **happy-minio:** Ports 9000-9001 (Storage)

### PostgreSQL (Host)
- **Port:** 5432
- **Database:** pmc_fulltext (992GB)
- **Tables:** articles, citations, author_citation_proper, ORCID

### Monitoring Scripts
- `/root/container_health_monitor.sh` - Every 5 min
- `/root/application_health_monitor_v2.sh` - Every 5 min
- `/root/api_health_monitor.sh` - Every 5 min
- `/root/arxiv_api_monitor.sh` - Every 5 min
- `/root/backup_sync_offsite.sh` - Every 2 hrs

## Key Directories

```
/root/
├── CLAUDE.md                    # Main documentation
├── *.md                         # 50+ documentation files
├── documentation/               # Organized docs
├── archived_docs/               # Historical docs
├── fixit-api-repo/              # FixIt git repo
├── arxiv-pipeline/              # ArXiv git repo
└── sarcastic-receptionist-repo/ # Receptionist git repo

/mnt/raid6/
├── shares/                      # Network shares
│   └── wikipedia/               # Wikipedia data
└── backups/                     # System backups

/etc/stripe/
├── keys.env                     # Stripe API keys
└── sync-to-container.sh         # Key sync script
```

## Quick Commands

```bash
# Check cluster status
pvecm status

# Check GPU status
nvidia-smi

# Check containers
pct list

# Check Docker
docker ps --filter "name=happy"

# Check Happy health
HAPPY_SERVER_URL="https://happy.built-simple.ai" happy doctor

# Run monitoring
/root/container_health_monitor.sh status
/root/application_health_monitor_v2.sh status
```

## SSH Access

```bash
# Local
ssh root@192.168.1.100

# External (via Cloudflare)
cloudflared access tcp --hostname pallettown.built-simple.ai --url localhost:2026 &
ssh root@localhost -p 2026
```

## External URLs

- **Proxmox UI:** https://pallettown.built-simple.ai
- **Happy Server:** https://happy.built-simple.ai

---
*Profile for Giratina - Primary Proxmox node in pallet-town cluster*
