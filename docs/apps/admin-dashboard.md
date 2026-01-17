# Admin Dashboard

**Last Updated:** January 17, 2026
**Status:** Running
**Location:** CT 400 on Giratina (192.168.1.50)

## Overview

Central admin dashboard for Built Simple infrastructure. Shows real-time health status of all APIs, applications, and infrastructure with live ping checks.

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
| **Health Checks** | Client-side fetch() with CORS |

## File Locations

| Path | Description |
|------|-------------|
| `/var/www/built-simple.ai/admin/index.html` | Dashboard HTML |
| `/etc/nginx/sites-available/admin.built-simple.ai` | nginx config |
| `/etc/nginx/.htpasswd` | Password file |

## nginx Configuration

```nginx
server {
    listen 80;
    server_name admin.built-simple.ai;

    root /var/www/built-simple.ai/admin;
    index index.html;

    auth_basic "Built Simple Admin";
    auth_basic_user_file /etc/nginx/.htpasswd;

    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept" always;

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

## Troubleshooting

### 401 Unauthorized
Check htpasswd file exists and has correct permissions:
```bash
pct exec 400 -- ls -la /etc/nginx/.htpasswd
```

### CORS Errors
Some services may not allow cross-origin requests. The dashboard handles this gracefully - if a CORS error occurs but the request completed, it's marked as "up".

---
*Created: January 17, 2026*
