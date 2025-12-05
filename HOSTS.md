# NETWORK HOSTS INVENTORY

## LOCAL MACHINE (THIS COMPUTER)
- **Hostname**: LAPTOP-FVRA1DSD
- **User**: neely
- **Local IP**: 192.168.0.113
- **OS**: Windows 11 Home Build 26100
- **CPU**: Intel i3-1115G4 (2c/4t)
- **RAM**: 24GB
- **Storage**: 1TB NVMe
- **SSH Key**: `~/.ssh/id_ed25519` (ed25519)

## CLOUD SERVERS

### 161.35.229.93
- **Hostname alias**: n8n.built-simple.ai
- **Type**: DigitalOcean droplet (likely)
- **Purpose**: n8n workflow automation
- **SSH**: ed25519, rsa, ecdsa keys configured

### 64.227.110.115
- **Type**: Cloud VPS
- **SSH**: ed25519, rsa, ecdsa keys configured

### 165.232.134.47
- **Type**: Cloud VPS
- **SSH**: ed25519, rsa, ecdsa keys configured

## LOCAL NETWORK - 192.168.0.x SUBNET

### 192.168.0.115
- **Primary target server**
- **User**: root
- **Password**: BuiltSimple2025!
- **Has**: warp-cli (Cloudflare WARP)
- **SSH**: ed25519, rsa, ecdsa
- **Also responds on**: 192.168.1.115

### 192.168.0.62
- **SSH**: ed25519, rsa, ecdsa

### 192.168.0.61
- **SSH**: ed25519, rsa, ecdsa

### 192.168.0.79
- **SSH**: ed25519, rsa, ecdsa
- **Also responds on**: 192.168.1.79

### 192.168.0.52
- **SSH**: ed25519, rsa, ecdsa
- **Also responds on**: 192.168.1.52

### 192.168.0.100
- **SSH**: ed25519, rsa, ecdsa
- **Also responds on**: 192.168.1.100

## LOCAL NETWORK - 192.168.1.x SUBNET

### 192.168.1.7
- **SSH**: ed25519, rsa, ecdsa

### 192.168.1.181
- **SSH**: ed25519 only

## WINDOWS DESKTOPS

### desktop-h2vm5k2
- **SSH**: ed25519

### desktop-urrp86l
- **SSH**: ed25519, rsa, ecdsa

## SSH CONNECTION DETAILS

### Default SSH Command
```bash
ssh root@192.168.1.115
# Password: BuiltSimple2025!
```

### Connection Scripts
- `C:\Users\neely\Scripts\ssh_connect.py` - Python SSH with paramiko
- `C:\Users\neely\Scripts\ssh_session.py` - Interactive session
- `C:\Users\neely\Scripts\ssh_auto.exp` - Expect script automation

### SSH Key Location
```
Private: C:\Users\neely\.ssh\id_ed25519
Public:  C:\Users\neely\.ssh\id_ed25519.pub
Known:   C:\Users\neely\.ssh\known_hosts
```

### Public Key
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJYjYlZYRT+YjpnHz0mfS4RMkDTUCxNoDMURsSIXUVDi neely@LAPTOP-FVRA1DSD
```

## NETWORK TOPOLOGY

```
Internet
    │
    ├── 161.35.229.93 (n8n.built-simple.ai)
    ├── 64.227.110.115
    └── 165.232.134.47

Router (192.168.0.1 / 192.168.1.1)
    │
    ├── LAPTOP-FVRA1DSD (192.168.0.113) - THIS MACHINE
    │
    ├── 192.168.0.x / 192.168.1.x subnet devices:
    │   ├── .52  (Linux)
    │   ├── .61  (Linux)
    │   ├── .62  (Linux)
    │   ├── .79  (Linux)
    │   ├── .100 (Linux)
    │   ├── .115 (Linux - PRIMARY SERVER)
    │   └── .181 (Linux)
    │
    └── Windows machines:
        ├── desktop-h2vm5k2
        └── desktop-urrp86l
```

## ORGANIZATION

**Built-Simple** / **Built-Simple.ai**
- Domain: built-simple.ai
- n8n instance: n8n.built-simple.ai
- Data collection/web scraping operations
