# Admin Dashboard

**Last Updated:** April 27, 2026
**Status:** Running
**Location:** CT 400 on Giratina (192.168.1.50)

## Overview

Central admin dashboard for Built Simple infrastructure. Shows real-time health status of all APIs, applications, and infrastructure with live ping checks. Also provides signup counts aggregated from all API databases.

## Access

| Type | URL |
|------|-----|
| **External** | https://admin.built-simple.ai |
| **Internal** | http://192.168.1.50 (with Host: admin.built-simple.ai) |

## Authentication

- **Username:** admin
- **Password:** BuiltSimple2025
- **Method:** nginx basic auth

## Features

- **Live health checks** - Pings each service's health endpoint every 60 seconds
- **Status indicators** - Green (up), Red (down), Orange (checking)
- **Response times** - Shows latency for each service
- **Summary stats** - Total online/offline count at a glance
- **Manual refresh** - Click to re-check all services immediately
- **Signup aggregation** - Counts users from all 5 API databases (updated every 5 min)

## Services Monitored

### APIs
| Service | Health Endpoint |
|---------|-----------------|
| FixIt API | /health |
| PubMed API | /health |
| ArXiv API | /health |
| Wikipedia API | /health |

### Applications
| Service | Health Check |
|---------|--------------|
| ReviewMaster Pro | HTTP 200 |
| Inbox Organizer | HTTP 200 |
| Buffer Killer | HTTP 200 |
| MyFit Pro | HTTP 200 |
| SolidInvoice | HTTP 200 |
| Professional Receptionist | /health |
| Happy Server | /health |

### Infrastructure
| Service | Health Check |
|---------|--------------|
| Proxmox UI | HTTP 200 |
| Marketing Site | HTTP 200 |

## Technical Stack

| Component | Details |
|-----------|---------|
| **Hosting** | CT 400 (built-simple-web) |
| **Web Server** | nginx with basic auth |
| **Frontend** | Static HTML + vanilla JavaScript |
| **Health Checks** | Node.js backend proxy (PM2 managed) |

## File Locations

| Path | Description |
|------|-------------|
| `/var/www/built-simple.ai/admin/index.html` | Dashboard HTML |
| `/var/www/health-proxy/server.js` | Health check proxy server |
| `/etc/nginx/sites-available/admin.built-simple.ai` | nginx config |
| `/etc/nginx/.htpasswd` | Password file |
| `/root/signup_aggregator.py` (Giratina host) | Signup count aggregator script |
| `/tmp/signup_counts.json` | Cached signup data (both host and CT 400) |

## nginx Configuration

```nginx
server {
    listen 80;
    server_name admin.built-simple.ai;

    root /var/www/built-simple.ai/admin;
    index index.html;

    auth_basic "Built Simple Admin";
    auth_basic_user_file /etc/nginx/.htpasswd;

    # Proxy API requests to Node.js health checker
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_connect_timeout 30s;
        proxy_read_timeout 60s;
    }

    location / {
        try_files $uri $uri/ =404;
    }
}
```

## Cloudflare Tunnel

Routed through giratina tunnel:
- **Hostname:** admin.built-simple.ai
- **Service:** http://192.168.1.50:80
- **HTTP Host Header:** admin.built-simple.ai

## Maintenance

### Update Password
```bash
pct exec 400 -- htpasswd -b /etc/nginx/.htpasswd admin NEWPASSWORD
```

### Update Dashboard
```bash
# Edit locally then push
pct push 400 /path/to/admin.html /var/www/built-simple.ai/admin/index.html
pct exec 400 -- chown www-data:www-data /var/www/built-simple.ai/admin/index.html
```

### Add New Service
Edit `/var/www/built-simple.ai/admin/index.html` and add to the appropriate array in the `services` object.

## Health Proxy Management

```bash
# SSH to Giratina then exec into container
pct exec 400 -- bash

# Check proxy status
/usr/local/lib/node_modules/pm2/bin/pm2 status

# View proxy logs
/usr/local/lib/node_modules/pm2/bin/pm2 logs health-proxy

# Restart proxy
/usr/local/lib/node_modules/pm2/bin/pm2 restart health-proxy

# Add a new service to monitor
# Edit /var/www/health-proxy/server.js and add to the services array
```

## Troubleshooting

### 401 Unauthorized
Check htpasswd file exists and has correct permissions:
```bash
pct exec 400 -- ls -la /etc/nginx/.htpasswd
```

### Health Check API Returns 502
Check if the Node.js proxy is running:
```bash
pct exec 400 -- /usr/local/lib/node_modules/pm2/bin/pm2 status
pct exec 400 -- /usr/local/lib/node_modules/pm2/bin/pm2 restart health-proxy
```

### Service Shows Down But Is Actually Up
Check the health proxy logs for connection errors:
```bash
pct exec 400 -- /usr/local/lib/node_modules/pm2/bin/pm2 logs health-proxy --lines 50
```

## Signup Aggregator

The signup aggregator runs on the Giratina host every 5 minutes via cron and queries user counts from all 5 API databases:

| Service | Container | Database | Table |
|---------|-----------|----------|-------|
| FixIt | CT 103 | `/var/lib/fixit-api/auth.db` | `api_keys` |
| PubMed | CT 108 | `/opt/pubmed-web/pubmed_users.db` | `users` |
| ArXiv | CT 122 | `/opt/arxiv/databases/api_keys.db` | `users` |
| Wikipedia | CT 213 (Hoopa) | `/var/lib/wikipedia-api/auth.db` | `api_keys` |
| ReviewMaster | CT 313 (Silvally) | PostgreSQL `reviewmaster` | `users` |

### API Endpoint

```bash
# Returns aggregated signup counts (requires auth)
curl -s -u admin:BuiltSimple2025 http://192.168.1.50/api/signups
# Response: {"fixit": 7, "pubmed": 1, "arxiv": 5, "wikipedia": 29, "reviewmaster": 16, "timestamp": "..."}
```

### Cron Job (Giratina host)

```bash
*/5 * * * * /usr/bin/python3 /root/signup_aggregator.py >> /var/log/signup_aggregator.log 2>&1
```

### Manual Run

```bash
python3 /root/signup_aggregator.py
```

---
*Created: January 17, 2026*
*Updated: January 17, 2026 - Added backend health check proxy*
*Updated: April 27, 2026 - Added signup aggregator endpoint*
