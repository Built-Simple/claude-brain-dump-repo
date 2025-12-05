---
name: ssh-management
description: SSH hosts, credentials, network topology, connection scripts. Use when asked to SSH, connect to servers, manage remote machines, or query network inventory.
allowed-tools: Bash, Read
---

# SSH Management

Network inventory and SSH connection details for all managed hosts.

## Quick Connect (Direct SSH - No Tunnels Needed!)

```bash
ssh root@192.168.1.100  # Giratina (PRIMARY)
ssh root@192.168.1.7    # Talon
ssh root@192.168.1.52   # Silvally
ssh root@192.168.1.79   # Hoopa
ssh root@192.168.1.115  # Victini
# Password: BuiltSimple2025!
```

**Note:** HTTPS works directly now. No Cox ISP blocking, no Xray tunnels needed.

---

## Proxmox Cluster: pallet-town (5 nodes, QUORATE)

| Node             | IP            | SSH Port | Status     |
|------------------|---------------|----------|------------|
| Giratina (local) | 192.168.1.100 | 22       | ✅ Primary |
| Talon            | 192.168.1.7   | 22       | ✅ Open    |
| Silvally         | 192.168.1.52  | 22       | ✅ Open    |
| Hoopa            | 192.168.1.79  | 22       | ✅ Open    |
| Victini          | 192.168.1.115 | 22       | ✅ Open    |

**Note:** ICMP/Ping blocked on Talon, Hoopa, Victini (but SSH works fine)

---

## Container Inventory (Giratina)

### Running Containers
| VMID | Name              | IP            | Service         |
|------|-------------------|---------------|-----------------|
| 102  | CT102             | 192.168.1.181 | Wikipedia API ✅ |
| 103  | FixItAPI          | 192.168.1.42  | FixIt API       |
| 105  | admin-coder-420   | -             | Admin tools     |
| 108  | PubMedSearch      | 192.168.1.135 | PubMed GPU ⚠️   |
| 122  | arxiv-gpu-pytorch | 192.168.1.76  | ArXiv API ⚠️    |
| 300  | smb-server        | 192.168.1.243 | SMB file sharing|
| 400  | built-simple-web  | 192.168.1.50  | Website         |
| 501  | filesearch        | 192.168.1.122 | Elasticsearch   |

### Stopped Containers
| VMID | Name       |
|------|------------|
| 200  | Playground |
| 201  | CT201      |
| 9999 | Template   |

### VMs
| VMID | Name   | Status  |
|------|--------|---------|
| 100  | Ubuntu | Stopped |

---

## Cloud Servers

| IP | Hostname | Purpose |
|----|----------|---------|
| 161.35.229.93 | n8n.built-simple.ai | n8n workflow automation |
| 64.227.110.115 | - | Cloud VPS |
| 165.232.134.47 | - | Cloud VPS |

---

## Cloudflare Tunnel: giratina

Tunnel ID: `0f2c7edc-1d40-4930-916c-2e7d0bbcdbc5`

| Hostname                   | Service                     |
|----------------------------|-----------------------------|
| pallettown.built-simple.ai | Proxmox UI (127.0.0.1:8006) |
| pubmed.built-simple.ai     | 192.168.1.9:5001 ⚠️ stale   |
| chatstash.built-simple.ai  | 192.168.1.88:5000 ⚠️ stale  |
| wiki.built-simple.ai       | 192.168.1.181:80            |
| fixitapi.built-simple.ai   | 192.168.1.13:5001 ⚠️ stale  |
| fixit.built-simple.ai      | 192.168.1.13:80 ⚠️ stale    |
| arxiv.built-simple.ai      | 192.168.1.76:8081           |

**Note:** Some cloudflared IPs are stale and need updating

---

## SSH Keys (Windows Laptop)

```
Private: C:\Users\neely\.ssh\id_ed25519
Public:  C:\Users\neely\.ssh\id_ed25519.pub
Known:   C:\Users\neely\.ssh\known_hosts
```

Public key:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJYjYlZYRT+YjpnHz0mfS4RMkDTUCxNoDMURsSIXUVDi neely@LAPTOP-FVRA1DSD
```

## SSH Keys (Giratina)
```
/root/.ssh/id_ed25519
/root/.ssh/id_rsa
/root/.ssh/authorized_keys -> /etc/pve/priv/authorized_keys
```

---

## Monitoring Cron Jobs (Giratina)

| Schedule    | Script                           |
|-------------|----------------------------------|
| */5 * * * * | api_health_monitor.sh            |
| */5 * * * * | arxiv_api_monitor.sh             |
| */5 * * * * | container_health_monitor.sh      |
| */5 * * * * | application_health_monitor_v3.sh |
| 0 */2 * * * | backup_sync_offsite.sh           |
| 0 6 * * *   | backup_sync_large_files.sh       |

---

## Connection Scripts (Windows)
- `C:\Users\neely\Scripts\ssh_connect.py` - Python SSH with paramiko
- `C:\Users\neely\Scripts\ssh_session.py` - Interactive session
- `C:\Users\neely\Scripts\ssh_auto.exp` - Expect script automation

---

## Organization
- Built-Simple / Built-Simple.ai
- Domain: built-simple.ai
- n8n: n8n.built-simple.ai

---

## Known Issues
1. CT122 ArXiv API - Health check failed
2. CT108 PubMed API - Health check failed
3. local-lvm storage at 97% - needs attention
4. Cloudflared config has stale container IPs
