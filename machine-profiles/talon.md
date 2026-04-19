# Machine Profile: Talon

**Last Updated:** April 18, 2026
**Role:** Secondary Proxmox Node / GPU Burst Server
**Cluster:** pallet-town

## System Overview

| Property | Value |
|----------|-------|
| **Hostname** | talon |
| **IP Address** | 192.168.1.7 |
| **OS** | Proxmox VE 8.x |
| **Kernel** | Linux 6.8.x-pve |
| **Role** | Secondary node, GPU burst capacity |

## Hardware Specifications

### Processor
| Property | Value |
|----------|-------|
| **CPU** | AMD Ryzen 9 7900 |
| **Architecture** | Zen 4 (x86_64) |
| **Cores** | 12 physical |
| **Threads** | 24 (SMT enabled) |
| **Base Clock** | 3.7 GHz |
| **TDP** | 65W |

### Memory
| Property | Value |
|----------|-------|
| **Total RAM** | 125 GB (124Gi) |
| **Type** | DDR5 |
| **Available** | ~117 GB typical |
| **Swap** | 8 GB |

### GPUs
| GPU | Model | VRAM | Bus ID | Power Cap | Notes |
|-----|-------|------|--------|-----------|-------|
| **GPU 0** | NVIDIA RTX 3090 | 24 GB | 01:00.0 | 375W | Primary |
| **GPU 1** | NVIDIA RTX 3090 | 24 GB | 12:00.0 | 350W | Secondary |

**Total GPU Memory:** 48 GB VRAM

### Storage
| Device | Size | Type | Mount Point |
|--------|------|------|-------------|
| **sda** | 931.5 GB | HDD/SSD | - |
| ├─ sda2 | 1 GB | EFI | /boot/efi |
| └─ sda3 | 930.5 GB | LVM | - |
| &nbsp;&nbsp;&nbsp;├─ pve-swap | 8 GB | Swap | [SWAP] |
| &nbsp;&nbsp;&nbsp;└─ pve-root | 922.5 GB | Ext4 | / |
| **nvme0n1** | 931.5 GB | NVMe | - |
| └─ nvme0n1p3 | 930.8 GB | NTFS? | /mnt/nvme-storage |

### GPU Driver
| Property | Value |
|----------|-------|
| **Driver Version** | 535.261.03 |
| **CUDA Version** | 12.2 |
| **Persistence Mode** | On |

## Network Configuration

| Property | Value |
|----------|-------|
| **Primary IP** | 192.168.1.7 |
| **Gateway** | 192.168.1.1 |
| **DNS** | 192.168.1.1 |
| **Internet** | Starlink (direct, no proxy) |

## Cluster Membership

```
Cluster: pallet-town (5 nodes)
Role: Secondary node

Nodes:
├── Giratina (192.168.1.100) - Primary
├── Talon (192.168.1.7) - This machine
├── Silvally (192.168.1.52) - App server
├── Hoopa (192.168.1.79) - GPU primary
└── Victini (192.168.1.115) - File server
```

## Current Workload

### LXC Containers
Currently no running containers. CT 109 (PMCMedical-Lightning) is stopped/archived.

| VMID | Name | Purpose | Status |
|------|------|---------|--------|
| 109 | PMCMedical-Lightning | PMC document processing (legacy) | Stopped |

### GPU Usage
```
GPU 0: Idle (1MiB / 24576MiB, 0% utilization)
GPU 1: Idle (1MiB / 24576MiB, 0% utilization)
```

## Use Cases

### Primary Purpose
Talon serves as **burst GPU capacity** for AI workloads when Hoopa is at capacity:

1. **Overflow processing** - When Hoopa's 4 GPUs are busy
2. **Failover** - Backup for GPU-dependent services
3. **Development/testing** - Isolated GPU environment for testing
4. **Parallel training** - Distributed training across nodes

### Available Capacity
| Resource | Available |
|----------|-----------|
| **GPU** | 48 GB VRAM (2x RTX 3090) |
| **RAM** | ~117 GB |
| **CPU** | 24 threads |
| **Storage** | ~900 GB NVMe |

## Services Running

```bash
# Proxmox VE services
pve-cluster.service          # Cluster filesystem
pve-ha-crm.service          # HA Resource Manager
pve-ha-lrm.service          # Local HA Resource Manager
pvedaemon.service           # PVE API Daemon
pveproxy.service            # PVE API Proxy
pvestatd.service            # PVE Status Daemon

# NVIDIA services
nvidia-persistenced.service  # GPU persistence daemon
```

## SSH Access

### Local Network
```bash
ssh root@192.168.1.7
# Password: [Use SSH keys]
```

### External (via Cloudflare)
```bash
# Start tunnel
cloudflared access tcp --hostname talon.built-simple.ai --url localhost:2022 &

# Connect
ssh root@localhost -p 2022
```

## Quick Commands

### System Status
```bash
# Check cluster status
pvecm status

# Check containers
pct list

# System resources
htop
free -h
df -h
```

### GPU Management
```bash
# GPU status
nvidia-smi

# Detailed GPU info
nvidia-smi -q

# Watch GPU usage
watch -n 1 nvidia-smi

# GPU processes
nvidia-smi --query-compute-apps=pid,name,used_memory --format=csv

# Reset GPU (if hung)
nvidia-smi -r
```

### Container Management
```bash
# Start CT 109 (if needed)
pct start 109

# Enter container
pct enter 109

# Execute command in container
pct exec 109 -- <command>
```

### Storage
```bash
# Check NVMe storage
ls -la /mnt/nvme-storage

# Disk usage
df -h /mnt/nvme-storage
```

## Comparison with Other GPU Nodes

| Property | Talon | Hoopa |
|----------|-------|-------|
| **GPUs** | 2x RTX 3090 | RTX 5090 + 2x RTX 3090 |
| **Total VRAM** | 48 GB | ~80 GB |
| **RAM** | 125 GB | 128 GB |
| **CPU** | Ryzen 9 7900 (12C/24T) | Ryzen 9 7950X (16C/32T) |
| **Role** | Burst/failover | Primary AI workloads |
| **Current load** | Idle | Wikipedia, Legal APIs |

## Container History

| VMID | Name | Status | Notes |
|------|------|--------|-------|
| 109 | PMCMedical-Lightning | Stopped | Legacy PMC processing, archived |

## GPU Passthrough Configuration

Both GPUs are available for passthrough to VMs/containers:

```bash
# PCI devices
01:00.0 VGA controller: NVIDIA RTX 3090
01:00.1 Audio controller: NVIDIA RTX 3090 Audio
12:00.0 VGA controller: NVIDIA RTX 3090
12:00.1 Audio controller: NVIDIA RTX 3090 Audio
```

To pass a GPU to a container, add to container config:
```
lxc.cgroup2.devices.allow: c 195:* rwm
lxc.cgroup2.devices.allow: c 509:* rwm
lxc.mount.entry: /dev/nvidia0 dev/nvidia0 none bind,optional,create=file
lxc.mount.entry: /dev/nvidiactl dev/nvidiactl none bind,optional,create=file
lxc.mount.entry: /dev/nvidia-uvm dev/nvidia-uvm none bind,optional,create=file
```

## Monitoring

| Check | Command | Notes |
|-------|---------|-------|
| **GPU health** | `nvidia-smi` | Temperature, utilization |
| **Cluster status** | `pvecm status` | Node connectivity |
| **Memory** | `free -h` | RAM availability |
| **Storage** | `df -h` | Disk space |

## Maintenance Notes

### GPU Temperature Thresholds
| Temp | Status |
|------|--------|
| < 40°C | Idle |
| 40-70°C | Normal load |
| 70-83°C | Heavy load |
| > 83°C | Throttling |

Current temperatures (idle): GPU 0: 33°C, GPU 1: 37°C

### Power Consumption
| State | Power |
|-------|-------|
| Idle | ~63W total (37W + 26W) |
| Load | Up to 725W (375W + 350W) |

## Future Considerations

1. **Container migration** - Could host containers from overloaded nodes
2. **Distributed training** - Set up PyTorch distributed with Hoopa
3. **Backup GPU node** - Automated failover for GPU services
4. **Development environment** - Isolated testing for new AI models

---
*Talon - Secondary Proxmox node with 48GB GPU burst capacity*
*Part of pallet-town cluster*
*Updated: April 18, 2026*
