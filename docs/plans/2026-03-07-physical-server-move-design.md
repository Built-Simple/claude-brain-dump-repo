# Physical Server Move Plan - Pallet Town Cluster

**Created:** March 7, 2026
**Status:** Approved
**Estimated Total Downtime:** Zero for production APIs

---

## Overview

Physical relocation of all 5 Proxmox cluster nodes from current house to new house. The plan ensures zero downtime for production APIs by using staging servers and network-based container migrations.

## Production Services (Must Stay Live)

| Service | Current Location | Strategy |
|---------|------------------|----------|
| **ReviewMaster** | CT 313 on Silvally | Migrate to Victini before Silvally moves |
| **FixIt API** | CT 103 on Giratina | Stage on Talon during Giratina transit |
| **PubMed API** | CT 108 on Giratina + CT 503 (ES) | Stage on Talon during Giratina transit |
| **ArXiv API** | CT 122+123 on Giratina | Stage on Talon during Giratina transit |
| **Wikipedia API** | CT 213-215 on Hoopa | Already down (broken mounts) - fix after move |

## Non-Production (Acceptable Downtime)

- Buffer Killer, MyFit Pro, TastyIgniter, N8N (Silvally)
- PCBox, Receptionists, SolidInvoice (Victini)
- Happy Server, Inbox Organizer (Giratina)
- Legal API (Hoopa - in development)

---

## Phase 1: Move Victini (First, Smallest)

### Pre-Move
1. Remove Victini from cluster:
   ```bash
   # On Giratina
   pvecm delnode victini
   ```

### Transport
2. Power down Victini, transport to new house (~4 hours)

### Post-Move Setup
3. Power on at new house, connect to network
4. Note new IP address (will get new DHCP or configure static)
5. Set up NEW Cloudflare tunnel on Victini:
   ```bash
   # On Victini at new house
   cloudflared tunnel create victini-newhouse
   cloudflared tunnel route dns victini-newhouse reviewmaster.built-simple.ai
   ```
6. Configure tunnel ingress for ReviewMaster:
   ```yaml
   # /etc/cloudflared/config.yml
   tunnel: <new-tunnel-id>
   credentials-file: /root/.cloudflared/<new-tunnel-id>.json
   ingress:
     - hostname: reviewmaster.built-simple.ai
       service: http://localhost:8001
     - service: http_status:404
   ```
7. Start tunnel: `systemctl enable --now cloudflared`

**End of Phase 1:** Victini at new house with working Cloudflare tunnel, ready to receive ReviewMaster.

---

## Phase 2: Migrate ReviewMaster to Victini

### On Silvally (old house)
1. Stop ReviewMaster container:
   ```bash
   pct stop 313
   ```

2. Backup container:
   ```bash
   vzdump 313 --mode stop --compress zstd --storage local
   ```

3. Transfer backup to Victini (over internet via tunnel or direct if both still on same network):
   ```bash
   scp /var/lib/vz/dump/vzdump-lxc-313-*.tar.zst root@<victini-new-ip>:/var/lib/vz/dump/
   ```

### On Victini (new house)
4. Restore container:
   ```bash
   pct restore 313 /var/lib/vz/dump/vzdump-lxc-313-*.tar.zst --storage local-lvm
   ```

5. Update container network config:
   ```bash
   pct set 313 --net0 name=eth0,bridge=vmbr0,ip=dhcp,type=veth
   # Or use static IP matching new network
   ```

6. Start ReviewMaster:
   ```bash
   pct start 313
   ```

7. Update Cloudflare tunnel to point to container IP:
   ```yaml
   # Update /etc/cloudflared/config.yml
   - hostname: reviewmaster.built-simple.ai
     service: http://<ct-313-ip>:8001
   ```

8. Verify: `curl https://reviewmaster.built-simple.ai/health`

**End of Phase 2:** ReviewMaster live on Victini at new house. Silvally can now be moved without impacting ReviewMaster.

---

## Phase 3: Move Silvally

### Pre-Move
1. Remove from cluster:
   ```bash
   # On Giratina
   pvecm delnode silvally
   ```

2. Stop remaining containers (non-production):
   ```bash
   pct stop 311 312 314 315 316  # Buffer Killer, MyFit, etc.
   ```

### Transport
3. Power down Silvally, transport to new house (~4 hours)

### Post-Move
4. Power on at new house, configure network
5. Start containers as needed
6. Update Silvally's Cloudflare tunnel config with new IPs (for non-production services)

**End of Phase 3:** Silvally at new house. ReviewMaster still live on Victini.

---

## Phase 4: Move Talon

### Pre-Move
1. Remove from cluster:
   ```bash
   # On Giratina
   pvecm delnode talon
   ```

### Transport
2. Power down Talon, transport to new house (~4 hours)

### Post-Move - Set Up as Staging Server
3. Power on at new house, configure network
4. Install PostgreSQL 17:
   ```bash
   apt install postgresql-17
   ```

5. Create staging database:
   ```bash
   sudo -u postgres createdb pmc_fulltext
   ```

**End of Phase 4:** Talon at new house, ready to receive data from Giratina.

---

## Phase 5: Stage Giratina Services on Talon

### 5.1: Replicate PostgreSQL `articles` Table (~80GB)

From Giratina (old house) to Talon (new house):
```bash
# On Giratina - dump articles table only
pg_dump -h localhost -U postgres -d pmc_fulltext -t articles -Fc -f /tmp/articles.dump

# Transfer to Talon (via internet)
scp /tmp/articles.dump root@<talon-new-ip>:/tmp/

# On Talon - restore
pg_restore -h localhost -U postgres -d pmc_fulltext -Fc /tmp/articles.dump
```

**Estimated time:** 2-4 hours depending on bandwidth

### 5.2: Backup and Transfer Containers

On Giratina:
```bash
# Backup production containers
vzdump 103 --mode snapshot --compress zstd --storage local  # FixIt
vzdump 108 --mode snapshot --compress zstd --storage local  # PubMed
vzdump 122 --mode snapshot --compress zstd --storage local  # ArXiv API
vzdump 123 --mode snapshot --compress zstd --storage local  # ArXiv DB
vzdump 503 --mode snapshot --compress zstd --storage local  # Elasticsearch

# Transfer to Talon
scp /var/lib/vz/dump/vzdump-lxc-{103,108,122,123,503}-*.tar.zst root@<talon-new-ip>:/var/lib/vz/dump/
```

### 5.3: Restore Containers on Talon

On Talon:
```bash
# Restore all containers
pct restore 103 /var/lib/vz/dump/vzdump-lxc-103-*.tar.zst --storage local-lvm
pct restore 108 /var/lib/vz/dump/vzdump-lxc-108-*.tar.zst --storage local-lvm
pct restore 122 /var/lib/vz/dump/vzdump-lxc-122-*.tar.zst --storage local-lvm
pct restore 123 /var/lib/vz/dump/vzdump-lxc-123-*.tar.zst --storage local-lvm
pct restore 503 /var/lib/vz/dump/vzdump-lxc-503-*.tar.zst --storage local-lvm
```

### 5.4: Update Container Configs

Update network and database connections for new environment:

**CT 108 (PubMed)** - Point to Talon's PostgreSQL:
```bash
pct exec 108 -- sed -i 's/POSTGRES_HOST=192.168.1.100/POSTGRES_HOST=<talon-ip>/' /opt/.env
```

**CT 122 (ArXiv)** - Point to CT 123 on Talon:
```bash
# Update modules/database.py if needed
pct exec 122 -- sed -i 's/192.168.1.206/<ct-123-new-ip>/' /opt/arxiv/modules/database.py
```

### 5.5: Start and Test Containers

```bash
pct start 503  # Elasticsearch first
pct start 123  # ArXiv DB
pct start 103  # FixIt
pct start 108  # PubMed
pct start 122  # ArXiv API

# Test locally
curl http://<ct-103-ip>:5001/health
curl http://<ct-108-ip>:5001/health
curl http://<ct-122-ip>:8082/health
```

### 5.6: Set Up Cloudflare Tunnel on Talon

```bash
cloudflared tunnel create talon-staging
```

Configure `/etc/cloudflared/config.yml`:
```yaml
tunnel: <talon-tunnel-id>
credentials-file: /root/.cloudflared/<talon-tunnel-id>.json
ingress:
  - hostname: fixitapi.built-simple.ai
    service: http://<ct-103-ip>:5001
  - hostname: fixit.built-simple.ai
    service: http://<ct-103-ip>:80
  - hostname: pubmed.built-simple.ai
    service: http://<ct-108-ip>:5001
  - hostname: arxiv.built-simple.ai
    service: http://<ct-122-ip>:8082
  - service: http_status:404
```

**DO NOT START TUNNEL YET** - Giratina is still serving production.

**End of Phase 5:** Talon ready to take over. All services tested locally but not yet serving production traffic.

---

## Phase 6: Move Giratina

### 6.1: Final Data Sync (Move Day)

Capture any changes since initial replication:
```bash
# On Giratina - incremental dump of recent changes
pg_dump -h localhost -U postgres -d pmc_fulltext -t articles -Fc -f /tmp/articles_final.dump

# Transfer and restore on Talon
scp /tmp/articles_final.dump root@<talon-ip>:/tmp/
# On Talon:
pg_restore -h localhost -U postgres -d pmc_fulltext -Fc --clean /tmp/articles_final.dump
```

### 6.2: Cutover to Talon

1. **Stop Giratina's Cloudflare tunnel:**
   ```bash
   # On Giratina
   systemctl stop cloudflared
   ```

2. **Start Talon's Cloudflare tunnel:**
   ```bash
   # On Talon
   systemctl enable --now cloudflared
   ```

3. **Verify cutover:**
   ```bash
   curl https://fixitapi.built-simple.ai/health
   curl https://pubmed.built-simple.ai/health
   curl https://arxiv.built-simple.ai/health
   ```

**APIs now served from Talon at new house.**

### 6.3: Transport Giratina

4. Power down Giratina
5. Transport to new house (~4 hours)
6. **APIs remain live on Talon during transit**

### 6.4: Bring Giratina Online at New House

7. Power on Giratina at new house
8. Configure network (new IP)
9. Start production containers:
   ```bash
   pct start 103 108 122 123 503
   ```
10. Verify containers healthy

### 6.5: Cutover Back to Giratina

11. Update Giratina's Cloudflare tunnel config with new IPs
12. Stop Talon tunnel, start Giratina tunnel:
    ```bash
    # On Talon
    systemctl stop cloudflared

    # On Giratina
    systemctl start cloudflared
    ```
13. Verify:
    ```bash
    curl https://fixitapi.built-simple.ai/health
    curl https://pubmed.built-simple.ai/health
    curl https://arxiv.built-simple.ai/health
    ```

**End of Phase 6:** Giratina at new house, serving production. Talon available as backup.

---

## Phase 7: Move Hoopa

### Pre-Move
1. Note: All containers already stopped (Wikipedia broken, Legal in dev)
2. No cluster removal needed (cluster already disbanded)

### Transport
3. Power down Hoopa, transport to new house (~4 hours)

### Post-Move
4. Power on at new house, configure network
5. **Fix Wikipedia mounts** (post-move task):
   - Mount network storage properly
   - Update CT 213-215 mount points
   - Start Wikipedia containers
   - Test API

**End of Phase 7:** All machines at new house.

---

## Phase 8: Rebuild Cluster

### 8.1: Create New Cluster on Giratina
```bash
# On Giratina
pvecm create pallet-town
```

### 8.2: Join Other Nodes
```bash
# On each node (Talon, Silvally, Victini, Hoopa):
pvecm add <giratina-new-ip>
```

### 8.3: Verify Cluster
```bash
pvecm status
# Should show 5/5 nodes, quorum established
```

### 8.4: Post-Move Cleanup
- [ ] Remove temporary PostgreSQL on Talon (or keep as backup)
- [ ] Delete container backups from Talon
- [ ] Migrate ReviewMaster back to Silvally (optional)
- [ ] Update all documentation with new IPs
- [ ] Fix Wikipedia API mounts on Hoopa
- [ ] Update HOSTS.md with new IP addresses

---

## Summary

| Phase | Action | Downtime |
|-------|--------|----------|
| 1 | Move Victini, set up tunnel | None |
| 2 | Migrate ReviewMaster to Victini | None (live migration) |
| 3 | Move Silvally | Non-production only |
| 4 | Move Talon, set up staging | None |
| 5 | Stage Giratina services on Talon | None (parallel prep) |
| 6 | Move Giratina (Talon serves) | None |
| 7 | Move Hoopa | Wikipedia already down |
| 8 | Rebuild cluster | None |

**Total production downtime: Zero**

---

## Appendix: Container Sizes

| Container | Size | Location |
|-----------|------|----------|
| CT 103 (FixIt) | ~10GB | Giratina |
| CT 108 (PubMed) | ~50GB | Giratina |
| CT 122 (ArXiv API) | ~15GB | Giratina |
| CT 123 (ArXiv DB) | ~50GB | Giratina |
| CT 503 (Elasticsearch) | ~126GB | Giratina |
| CT 313 (ReviewMaster) | ~8GB | Silvally |
| PostgreSQL `articles` | ~80GB | Giratina host |

**Total staging data: ~340GB** (fits on Talon's /mnt/t9 with 3TB free)

---

## Appendix: Known Issues to Fix After Move

1. **Wikipedia API** - Mounts broken since Feb 22-23
   - `/mnt/victini_expansion/hoopa-data/wikipedia-ssd` empty
   - `/mnt/network_transfer/wikipedia_production.db` missing
   - Fix: Remount storage, restore database file

2. **FixIt Embedding Server** - Not running on Hoopa
   - GPU vector search currently unavailable
   - Fix: Restart embedding server after Hoopa move

---

*Plan created: March 7, 2026*
*Approved by: User*
