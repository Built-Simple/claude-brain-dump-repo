---
name: ssh-management
description: SSH hosts, credentials, network topology, connection scripts. Use when asked to SSH, connect to servers, manage remote machines, or query network inventory.
allowed-tools: Bash, Read
---

# SSH Management

Network inventory and SSH connection details for all managed hosts.

## Primary Target
```bash
ssh root@192.168.1.115
# Password: BuiltSimple2025!
```

## Cloud Servers

| IP | Hostname | Purpose |
|----|----------|---------|
| 161.35.229.93 | n8n.built-simple.ai | n8n workflow automation |
| 64.227.110.115 | - | Cloud VPS |
| 165.232.134.47 | - | Cloud VPS |

## Local Network - 192.168.0.x / 192.168.1.x

| IP | Notes |
|----|-------|
| 192.168.0.115 / 192.168.1.115 | PRIMARY SERVER (root/BuiltSimple2025!) |
| 192.168.0.52 / 192.168.1.52 | Linux |
| 192.168.0.61 | Linux |
| 192.168.0.62 | Linux |
| 192.168.0.79 / 192.168.1.79 | Linux |
| 192.168.0.100 / 192.168.1.100 | Linux |
| 192.168.1.7 | Linux |
| 192.168.1.181 | Linux (ed25519 only) |

## Windows Desktops
- desktop-h2vm5k2
- desktop-urrp86l

## SSH Key
```
Private: C:\Users\neely\.ssh\id_ed25519
Public:  C:\Users\neely\.ssh\id_ed25519.pub
Known:   C:\Users\neely\.ssh\known_hosts
```

Public key:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJYjYlZYRT+YjpnHz0mfS4RMkDTUCxNoDMURsSIXUVDi neely@LAPTOP-FVRA1DSD
```

## Connection Scripts
- `C:\Users\neely\Scripts\ssh_connect.py` - Python SSH with paramiko
- `C:\Users\neely\Scripts\ssh_session.py` - Interactive session
- `C:\Users\neely\Scripts\ssh_auto.exp` - Expect script automation

## Network Topology
```
Internet
    ├── 161.35.229.93 (n8n.built-simple.ai)
    ├── 64.227.110.115
    └── 165.232.134.47

Router (192.168.0.1 / 192.168.1.1)
    ├── LAPTOP-FVRA1DSD (192.168.0.113) - THIS MACHINE
    ├── Linux servers: .52, .61, .62, .79, .100, .115, .181
    └── Windows: desktop-h2vm5k2, desktop-urrp86l
```

## Organization
- Built-Simple / Built-Simple.ai
- Domain: built-simple.ai
- n8n: n8n.built-simple.ai
