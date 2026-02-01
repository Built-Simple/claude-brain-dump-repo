# NETWORK HOSTS INVENTORY

**Last Updated:** January 9, 2026
**ISP:** Starlink (Full unrestricted internet access)

## PALLET TOWN PROXMOX CLUSTER

All machines on 192.168.1.x subnet with direct Starlink internet access.

### Giratina (Primary Node)
- **IP:** 192.168.1.100
- **Role:** Primary Proxmox node, GPU server
- **Hardware:** Dell PowerEdge R740xd, dual Tesla T4 GPUs, 314GB RAM
- **User:** root
- **Password:** [REDACTED - use SSH keys]
- **Web UI:** https://192.168.1.100:8006
- **External:** pallettown.built-simple.ai
- **Containers:** CT 103, 105, 108, 122, 123, 300, 400, 502, 503, 504

### Talon
- **IP:** 192.168.1.7
- **Role:** Secondary Proxmox node
- **User:** root
- **Password:** [REDACTED - use SSH keys]
- **External:** talon.built-simple.ai
- **Containers:** CT 109 (stopped)

### Silvally
- **IP:** 192.168.1.52
- **Role:** Application server
- **User:** root
- **Password:** [REDACTED - use SSH keys]
- **External:** silvally.built-simple.ai
- **Tunnel:** silvally (080e5208-a495-4cfc-98a9-ea90076c0363)
- **Containers:** CT 311 (Buffer Killer), CT 312 (MyFit Pro), CT 313 (ReviewMaster)

### Hoopa
- **IP:** 192.168.1.79
- **Role:** GPU node (4x RTX 3090)
- **User:** root
- **Password:** [REDACTED - use SSH keys]
- **External:** hoopa.built-simple.ai
- **Containers:** CT 210-212 (Legal), CT 213-215 (Wikipedia)

### Victini
- **IP:** 192.168.1.115
- **Role:** File server, voice assistants
- **User:** root
- **Password:** [REDACTED - use SSH keys]
- **External:** victini.built-simple.ai
- **Tunnel:** victini (979d5394-daae-457f-8f56-7b256bb0e9eb)
- **Containers:** CT 110 (PCBox), CT 114, CT 116 (Receptionists)

## QUICK SSH COMMANDS

```bash
# Local network access (from any cluster machine)
ssh root@192.168.1.100    # Giratina
ssh root@192.168.1.7      # Talon
ssh root@192.168.1.52     # Silvally
ssh root@192.168.1.79     # Hoopa
ssh root@192.168.1.115    # Victini

# All use SSH key auth (password redacted)
```

## EXTERNAL ACCESS (Cloudflare Tunnels)

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

## CLOUDFLARE TUNNELS

| Tunnel | ID | Host | Services |
|--------|-----|------|----------|
| giratina | 0f2c7edc-1d40-4930-916c-2e7d0bbcdbc5 | Giratina | APIs, SSH forwards, website |
| silvally | 080e5208-a495-4cfc-98a9-ea90076c0363 | Silvally | Buffer Killer, MyFit, ReviewMaster |
| victini | 979d5394-daae-457f-8f56-7b256bb0e9eb | Victini | PCBox, Receptionists |

## EXTERNAL DOMAINS

### Via Giratina Tunnel
- pallettown.built-simple.ai - Proxmox UI + SSH
- fixit.built-simple.ai - FixIt Frontend
- fixitapi.built-simple.ai - FixIt API
- pubmed.built-simple.ai - PubMed API
- arxiv.built-simple.ai - ArXiv API
- built-simple.ai - Marketing website
- happy.built-simple.ai - Happy Server

### Via Silvally Tunnel
- buffer-killer.built-simple.ai - OAuth Server
- buffer-killer-admin.built-simple.ai - Web UI
- myfit.built-simple.ai - MyFit Pro
- reviewmaster.built-simple.ai - ReviewMaster Pro

### Via Victini Tunnel
- pcbox.built-simple.ai - File access
- receptionist.built-simple.ai - Sarcastic Receptionist
- peintothai.built-simple.ai - Thai Receptionist

### Via Hoopa (through Giratina)
- wikipedia.built-simple.ai - Wikipedia Hybrid API

## NETWORK TOPOLOGY

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

## CLUSTER STATUS

- **Cluster Name:** pallet-town
- **Nodes:** 5/5 operational
- **Quorum:** 5 votes (need 3)
- **Status:** Fully functional

```bash
# Check cluster status
pvecm status
```

## DEVELOPMENT LAPTOP (Cluster Control Machine)

- **Hostname:** LAPTOP-FVRA1DSD
- **IP:** 192.168.1.34 (when connected to local network)
- **User:** neely
- **OS:** Windows 11 Home Build 26100
- **Role:** Primary development laptop - used to operate and manage the entire cluster
- **SSH Key:** `~/.ssh/id_ed25519`
- **Local Paths:**
  - Websites: `~/websites/`
  - Scripts: `~/Scripts/`

### SSH from Cluster to Laptop
```bash
ssh neely@192.168.1.34
```

### Public Key
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJYjYlZYRT+YjpnHz0mfS4RMkDTUCxNoDMURsSIXUVDi neely@LAPTOP-FVRA1DSD
```

## CLOUD SERVERS (External)

### n8n.built-simple.ai (161.35.229.93)
- **Type:** DigitalOcean droplet
- **Purpose:** n8n workflow automation
- **SSH:** Standard key auth

---
*Updated: January 9, 2026 - Migrated from Cox to Starlink, all 192.168.0.x references removed*
