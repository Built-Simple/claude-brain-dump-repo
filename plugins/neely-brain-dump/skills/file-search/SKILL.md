---
name: file-search
description: Elasticsearch-based distributed file search across all cluster nodes. Use when searching for files, finding duplicates, or querying storage metadata.
allowed-tools: Bash
---

# Distributed File Search System

Elasticsearch + FSCrawler deployment for searching files across the entire Proxmox cluster.

## Architecture

```
                    ┌──────────────────────┐
                    │    Elasticsearch     │
                    │  192.168.1.122:9200  │
                    │   (CT501 Giratina)   │
                    └──────────┬───────────┘
           ┌───────────────────┼───────────────────┐
           │                   │                   │
    ┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐
    │  Giratina   │     │    Talon    │     │   Victini   │
    │  1 Crawler  │     │  3 Crawlers │     │  3 Crawlers │
    │   RAID6     │     │   5.5TB     │     │    29TB     │
    └─────────────┘     └─────────────┘     └─────────────┘
           │                   │                   │
    ┌──────▼──────┐     ┌──────▼──────┐
    │    Hoopa    │     │  Silvally   │
    │  1 Crawler  │     │  1 Crawler  │
    └─────────────┘     └─────────────┘
```

## Quick Reference

**Elasticsearch:** http://192.168.1.122:9200
**Total Storage Indexed:** ~18.5TB
**Total Documents:** 3.4M+ files
**Active Crawlers:** 9

---

## Search API Examples

### Basic File Search
```bash
curl -s "http://192.168.1.122:9200/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {"match": {"file.filename": "document.pdf"}},
  "size": 20
}'
```

### Search by Path
```bash
curl -s "http://192.168.1.122:9200/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {"wildcard": {"path.real": "*Legal*"}}
}'
```

### Search by Extension
```bash
curl -s "http://192.168.1.122:9200/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {"wildcard": {"file.filename": "*.pdf"}}
}'
```

### Find Large Files (>1GB)
```bash
curl -s "http://192.168.1.122:9200/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {"range": {"file.filesize": {"gte": 1073741824}}},
  "sort": [{"file.filesize": {"order": "desc"}}]
}'
```

### Recently Modified (Last 7 Days)
```bash
curl -s "http://192.168.1.122:9200/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {"range": {"file.last_modified": {"gte": "now-7d"}}},
  "sort": [{"file.last_modified": {"order": "desc"}}]
}'
```

### Find Duplicate Files by Size
```bash
curl -s "http://192.168.1.122:9200/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "size": 0,
  "aggs": {
    "duplicate_sizes": {
      "terms": {"field": "file.filesize", "min_doc_count": 2, "size": 100}
    }
  }
}'
```

### Search Across All Nodes
```bash
curl -s "http://192.168.1.122:9200/*-storage/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {"match": {"file.filename": "your-search-term"}}
}'
```

---

## Crawler Inventory

### Giratina (192.168.1.100) - Central Node
| Crawler | Path | Index | Documents |
|---------|------|-------|-----------|
| raid6-storage | /mnt/raid6 | raid6-storage | ~265 files |

### Talon (192.168.1.7) - Multi-Drive
| Crawler | Path | Capacity | Documents |
|---------|------|----------|-----------|
| talon-nvme-storage | /mnt/nvme-storage | 931GB (88%) | 218K+ |
| talon-pmc-data | /mnt/pmc_data | 1.9TB (86%) | 576K+ |
| talon-t9 | /mnt/t9 | 3.7TB (100%) | 2.3M+ |

### Victini (192.168.1.115) - Large Storage
| Crawler | Path | Capacity | Documents |
|---------|------|----------|-----------|
| victini-storage | /mnt/storage | 22TB (8.2TB used) | 253K+ |
| victini-ext4-drive | /mnt/storage/ext4_drive | 3.6TB (2.3TB) | Growing |
| victini-new-volume | /mnt/storage/new_volume | 3.7TB (2.4TB) | Growing |

### Hoopa (192.168.1.79)
| Crawler | Path | Capacity | Documents |
|---------|------|----------|-----------|
| hoopa-storage | /mnt/network_transfer | 393GB (90GB) | 750+ |

### Silvally (192.168.1.52)
| Crawler | Path | Capacity | Documents |
|---------|------|----------|-----------|
| silvally-storage | /mnt/raid6 | 832GB | 3 folders |

---

## Index Management

### List All Indices
```bash
curl "http://192.168.1.122:9200/_cat/indices?v"
```

### Get Storage Indices
```bash
curl "http://192.168.1.122:9200/_cat/indices/*-storage*?v&h=index,docs.count,store.size&s=index"
```

### Check Cluster Health
```bash
curl "http://192.168.1.122:9200/_cluster/health?pretty"
```

### Document Count for Index
```bash
curl "http://192.168.1.122:9200/talon-t9/_count?pretty"
```

---

## Service Management

### Check Crawler Status
```bash
ssh root@192.168.1.X "systemctl status fscrawler*"
```

### Restart a Crawler
```bash
ssh root@192.168.1.X "systemctl restart fscrawler-NAME"
```

### View Logs
```bash
ssh root@192.168.1.X "journalctl -u fscrawler-NAME -f"
```

---

## Document Schema

Each indexed file has this metadata:

```json
{
  "file": {
    "filename": "example.pdf",
    "extension": "pdf",
    "filesize": 1048576,
    "indexing_date": "2025-12-05T08:00:00.000Z",
    "last_modified": "2025-12-01T10:30:00.000Z"
  },
  "path": {
    "real": "/mnt/storage/expansion/Legal/example.pdf",
    "root": "/mnt/storage",
    "virtual": "/expansion/Legal/example.pdf"
  },
  "meta": {
    "title": "Example Document",
    "author": "John Doe"
  }
}
```

---

## Adding a New Crawler

### 1. Create Configuration
```bash
mkdir -p /root/.fscrawler/new-crawler-name
cat > /root/.fscrawler/new-crawler-name/_settings.yaml << 'EOF'
---
name: "new-crawler-name"
fs:
  url: "/path/to/storage"
  update_rate: "30m"
  indexed_chars: "0"
  add_filesize: true
  continue_on_error: true
  remove_deleted: true
  excludes:
    - "*/node_modules/*"
    - "*/.git/*"
    - "*/.cache/*"
    - "*.tmp"
    - "*.log"
  ocr:
    enabled: false
elasticsearch:
  nodes:
    - url: "http://192.168.1.122:9200"
  index: "node-name-storage"
  bulk_size: 500
EOF
```

### 2. Create Systemd Service
```bash
cat > /etc/systemd/system/fscrawler-new-name.service << 'EOF'
[Unit]
Description=FSCrawler - New Storage Indexer
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/fscrawler
ExecStart=/opt/fscrawler/bin/fscrawler new-crawler-name --loop 999
Restart=on-failure
RestartSec=30
Environment="FS_JAVA_OPTS=-Xms512m -Xmx1g"

[Install]
WantedBy=multi-user.target
EOF
```

### 3. Enable and Start
```bash
systemctl daemon-reload
systemctl enable --now fscrawler-new-name
```

---

## Troubleshooting

### Yellow Cluster Status
Normal for single-node. Fix with:
```bash
curl -X PUT "http://192.168.1.122:9200/_all/_settings" -H 'Content-Type: application/json' -d'
{"index": {"number_of_replicas": 0}}'
```

### Reindex from Scratch
```bash
systemctl stop fscrawler-NAME
curl -X DELETE "http://192.168.1.122:9200/index-name"
rm -rf /root/.fscrawler/crawler-name/.fscrawler
systemctl start fscrawler-NAME
```

---

## System Info

- **Elasticsearch Version:** 7.17.29
- **FSCrawler Version:** 2.9
- **Cluster Name:** filesearch-cluster
- **JVM Heap:** 8GB
- **Security:** None (internal network only)

**Last Updated:** December 5, 2025
