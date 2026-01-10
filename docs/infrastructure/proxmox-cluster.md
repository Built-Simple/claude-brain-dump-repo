# Proxmox Cluster: pallet-town

**Last Updated:** January 9, 2026

## Cluster Overview

| Property | Value |
|----------|-------|
| **Cluster Name** | pallet-town |
| **Total Nodes** | 5 |
| **Quorum** | 5 votes (need 3) |
| **Status** | Fully functional |

## Nodes

| Node | IP | Role | Status |
|------|-----|------|--------|
| Giratina | 192.168.1.100 | Primary | Online |
| Talon | 192.168.1.7 | Secondary | Online |
| Silvally | 192.168.1.52 | Apps | Online |
| Hoopa | 192.168.1.79 | GPU | Online |
| Victini | 192.168.1.115 | Files | Online |

## Quick Commands

```bash
# Check cluster status
pvecm status

# List all nodes
pvecm nodes

# Check quorum
pvecm expected 1  # View expected votes

# Check corosync
systemctl status corosync
```

## Web Interface Access

| Node | URL |
|------|-----|
| Giratina | https://192.168.1.100:8006 |
| Talon | https://192.168.1.7:8006 |
| Silvally | https://192.168.1.52:8006 |
| Hoopa | https://192.168.1.79:8006 |
| Victini | https://192.168.1.115:8006 |

External: https://pallettown.built-simple.ai (Giratina only)

## Container Distribution

### Giratina (10 containers)
CT 103, 105, 108, 122, 123, 300, 400, 502, 503, 504

### Talon (1 container)
CT 109 (stopped)

### Silvally (3 containers)
CT 311, 312, 313

### Hoopa (6 containers)
CT 210, 211, 212, 213, 214, 215

### Victini (3 containers)
CT 110, 114, 116

## Storage Configuration

### Giratina
- **local:** System storage
- **local-lvm:** LVM thin pool
- **raid6:** 13TB ZFS array (/mnt/raid6)

### Shared Storage
Network mounts configured on each node as needed.

## Network Configuration

All nodes on 192.168.1.0/24 subnet.

### Corosync Configuration
- **Ring 0:** 192.168.1.x (primary)
- **Transport:** UDP
- **Multicast:** Disabled (unicast mode)

## Cluster Recovery

### If Node Lost from Cluster
```bash
# On affected node
systemctl restart corosync
systemctl restart pve-cluster

# Check status
pvecm status
```

### If Quorum Lost
```bash
# Emergency single-node mode
pvecm expected 1

# Re-add nodes
pvecm add <node-ip>
```

### Full Recovery Guide
See: /root/documentation/network/PROXMOX_CLUSTER_NETWORK_RECOVERY_GUIDE.md

## Backup Strategy

- Automated backups via PBS or vzdump
- Offsite sync every 2 hours
- Critical containers prioritized

## Monitoring

- Health checks every 5 minutes
- Email alerts on node/container issues
- See: monitoring-alerting.md

---
*Cluster: 5/5 nodes operational*
