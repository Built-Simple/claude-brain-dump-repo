---
name: machine-context
description: Machine profiles, dev tools, directory layouts, hardware specs. Use when asked about current machine, environment, installed software, paths, or system capabilities.
---

# Machine Context

This skill provides context about the user's machines and development environment.

---

## Proxmox Cluster: pallet-town (5 nodes)

| Node     | IP            | CPU                          | Cores/Threads | RAM    | GPU                              |
|----------|---------------|------------------------------|---------------|--------|----------------------------------|
| Giratina | 192.168.1.100 | 2x Xeon Silver 4216 @ 2.1GHz | 32C/64T       | 314GB  | 2x Tesla T4 (30GB)               |
| Hoopa    | 192.168.1.79  | 2x Xeon E5-2620 v3 @ 2.4GHz  | 12C/24T       | 126GB  | RTX 5090 + 2x RTX 3090 (81GB)    |
| Talon    | 192.168.1.7   | AMD Ryzen 9 7900 @ 3.7GHz    | 12C/24T       | 125GB  | 2x RTX 3090 (49GB)               |
| Victini  | 192.168.1.115 | Intel i5-14400T @ 3.5GHz     | 10C/16T       | 31GB   | None                             |
| Silvally | 192.168.1.52  | 2x Xeon E5-2630 v3 @ 2.4GHz  | 16C/32T       | 32GB   | None                             |

**Total Cluster Resources:** 82 cores / 160 threads, ~628GB RAM, ~160GB VRAM

---

## Giratina (192.168.1.100) - PRIMARY

### System
- Hostname: giratina
- OS: Debian 12 (bookworm)
- Kernel: 6.8.12-9-pve (Proxmox VE)
- Role: Primary compute server

### Hardware
- Model: Dell PowerEdge R740xd
- CPU: 2x Intel Xeon Silver 4216 @ 2.10GHz (64 threads total)
- RAM: 314GB
- GPU: 2x NVIDIA Tesla T4 (15GB each, 30GB total)
- GPU PCIe: GPU0: Gen 3 x16, GPU1: Gen 3 x8

### Storage

**ZFS Pool: proxmox-zfs**
- Size: 5.98TB | Used: 4.66TB (77%) | Health: ONLINE

**RAID6 Array**
- Mount: /mnt/raid6 | Size: 13TB | Used: 7.5TB (61%)

**Proxmox Storage**
| Name          | Type    | Used%  |
|---------------|---------|--------|
| local         | dir     | 89%    |
| local-lvm     | lvmthin | 97% ⚠️ |
| raid6-backups | dir     | 57%    |
| zfs-storage   | zfspool | 79%    |

### Dev Tools
| Tool    | Version | Path             |
|---------|---------|------------------|
| Python  | 3.11.2  | /usr/bin/python3 |
| Node.js | 20.19.5 | /usr/bin/node    |
| Git     | 2.39.5  | /usr/bin/git     |

---

## Hoopa (192.168.1.79) - GPU POWERHOUSE

### System
- Hostname: hoopa
- OS: Debian 12 (bookworm)
- Kernel: 6.8.12-14-pve (Proxmox VE)

### Hardware
- CPU: 2x Intel Xeon E5-2620 v3 @ 2.40GHz (24 threads)
- RAM: 126GB
- GPU: **NVIDIA GeForce RTX 5090 (32GB) + 2x RTX 3090 (24GB each) = 81GB VRAM**

### Storage
- Root: 94GB (55GB used, 61%)

### Network
- Primary: 192.168.1.79/24 (vmbr0)
- VPN: 10.5.0.2/16 (NordLynx)

### Dev Tools
| Tool    | Version | Path             |
|---------|---------|------------------|
| Python  | 3.11.2  | /usr/bin/python3 |
| Node.js | 20.19.5 | /usr/bin/node    |
| Git     | yes     | /usr/bin/git     |

---

## Talon (192.168.1.7) - AMD WORKSTATION

### System
- Hostname: Talon
- OS: Debian 12 (bookworm)
- Kernel: 6.8.12-9-pve (Proxmox VE)

### Hardware
- CPU: AMD Ryzen 9 7900 12-Core @ 3.7GHz (24 threads)
- RAM: 125GB
- GPU: **2x NVIDIA GeForce RTX 3090 (24GB each) = 49GB VRAM**

### Storage
- Root: 94GB (23GB used, 26%)

### Dev Tools
| Tool    | Version  | Path             |
|---------|----------|------------------|
| Python  | 3.11.2   | /usr/bin/python3 |
| Node.js | 18.20.4  | /usr/bin/node    |
| Git     | yes      | /usr/bin/git     |

---

## Victini (192.168.1.115) - COMPACT NODE

### System
- Hostname: victini
- OS: Debian 12 (bookworm)
- Kernel: 6.8.12-9-pve (Proxmox VE)

### Hardware
- CPU: Intel Core i5-14400T @ 3.5GHz (16 threads, 10 cores)
- RAM: 31GB
- GPU: None

### Storage
- Root: 68GB (62GB used, 96% ⚠️)

### Dev Tools
| Tool    | Version | Path             |
|---------|---------|------------------|
| Python  | 3.11.2  | /usr/bin/python3 |
| Node.js | 20.19.5 | /usr/bin/node    |
| Git     | yes     | /usr/bin/git     |

---

## Silvally (192.168.1.52) - DUAL XEON

### System
- Hostname: silvally
- OS: Debian 12 (bookworm)
- Kernel: 6.8.12-9-pve (Proxmox VE)

### Hardware
- CPU: 2x Intel Xeon E5-2630 v3 @ 2.40GHz (32 threads)
- RAM: 32GB
- GPU: None

### Storage
- Root: 38GB (11GB used, 29%)

### Dev Tools
| Tool    | Version | Path             |
|---------|---------|------------------|
| Python  | 3.11.2  | /usr/bin/python3 |
| Node.js | 23.11.1 | /usr/bin/node    |
| Git     | yes     | /usr/bin/git     |

---

## LAPTOP-FVRA1DSD (Windows)

### System
- Hostname: LAPTOP-FVRA1DSD
- User: neely
- Email: neelytalon@gmail.com
- OS: Windows 11 Home (Build 26100)
- Timezone: Pacific (UTC-08:00)

### Hardware
- Model: LENOVO 82H8
- CPU: Intel i3-1115G4 @ 3.00GHz (2 cores, 4 threads)
- RAM: 24GB
- Storage: 1TB NVMe WD Green SN350
- Network: Intel Wi-Fi 6 AX201 160MHz

### Dev Tools
| Tool       | Version  | Path                              |
|------------|----------|-----------------------------------|
| Python     | 3.13.3   | C:\Python313\python.exe           |
| Node.js    | v22.16.0 | C:\Program Files\nodejs\node.exe  |
| npm        | 10.9.2   | -                                 |
| Git        | 2.50.1   | C:\Program Files\Git\cmd\git.exe  |
| PostgreSQL | 17       | C:\Program Files\PostgreSQL\17    |

### Python Packages
pandas, numpy, beautifulsoup4, playwright, cloudscraper, paramiko

### PostgreSQL
- Port: 5432
- User: postgres
- Password: (set POSTGRES_PASSWORD env var)

### Directory Layout
```
C:\Users\neely\
├── .claude\           # Claude config/memory
├── .ssh\              # SSH keys, known_hosts
├── Projects\          # Dev projects
├── Docs\              # Documentation
├── Documentation\     # AI code doc framework
├── Scripts\           # Utility scripts (ssh_connect.py, ssh_session.py)
├── Downloads\
├── Documents\
└── PracticalKnowledge\
```

### Limitations
- Entry-level CPU (2 core i3)
- Windows Home (no Hyper-V)
- Shared personal/dev use

---

## Known Issues
1. Victini root disk at 96% - needs cleanup
2. Giratina local-lvm at 97% - needs attention
3. .60 machine unreachable (connection timed out)
