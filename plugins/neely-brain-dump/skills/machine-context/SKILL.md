---
name: machine-context
description: Machine profiles, dev tools, directory layouts, hardware specs. Use when asked about current machine, environment, installed software, paths, or system capabilities.
---

# Machine Context

This skill provides context about the user's machines and development environment.

---

## Giratina Server (PRIMARY)

### System
- Hostname: giratina
- IP: 192.168.1.100
- OS: Debian 12 (bookworm)
- Kernel: 6.8.12-9-pve (Proxmox VE)
- Role: Primary development/compute server

### Hardware
- Model: Dell PowerEdge R740xd
- CPU: 2x Intel Xeon Silver 4216 @ 2.10GHz (64 threads total)
- RAM: 314GB
- GPU: 2x NVIDIA Tesla T4 (15GB each, 30GB total)
- GPU PCIe: GPU0: Gen 3 x16 ✅, GPU1: Gen 3 x8

### Storage

**ZFS Pool: proxmox-zfs**
- Size: 5.98TB
- Used: 4.66TB (77%)
- Health: ONLINE ✅

**RAID6 Array**
- Mount: /mnt/raid6
- Size: 13TB
- Used: 7.5TB (61%)

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

### SSH Keys
```
/root/.ssh/id_ed25519
/root/.ssh/id_rsa
/root/.ssh/authorized_keys -> /etc/pve/priv/authorized_keys
```

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
| Tool | Version | Path |
|------|---------|------|
| Python | 3.13.3 | C:\Python313\python.exe |
| Node.js | v22.16.0 | C:\Program Files\nodejs\node.exe |
| npm | 10.9.2 | - |
| Git | 2.50.1 | C:\Program Files\Git\cmd\git.exe |
| PostgreSQL | 17 | C:\Program Files\PostgreSQL\17 |

### Python Packages
pandas, numpy, beautifulsoup4, playwright, cloudscraper, paramiko

### PostgreSQL
- Port: 5432
- User: postgres
- Password: Password

### Directory Layout
```
C:\Users\neely\
├── .claude\           # Claude config/memory
├── .ssh\              # SSH keys, known_hosts
├── Projects\          # Dev projects
├── Docs\              # Documentation
├── Documentation\     # AI code doc framework
├── Scripts\           # Utility scripts
├── Downloads\
├── Documents\
└── PracticalKnowledge\
```

### Limitations
- Entry-level CPU (2 core i3)
- Windows Home (no Hyper-V)
- Shared personal/dev use
