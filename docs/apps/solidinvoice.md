# SolidInvoice

**Last Updated:** January 17, 2026
**Status:** Running - Needs Initial Setup
**Location:** CT 117 on Victini (192.168.1.117)

## Overview

SolidInvoice is an open-source invoicing application for small businesses and freelancers. It provides client management, quote/invoice generation, online payments, and reporting.

## Access

| Type | URL |
|------|-----|
| **External** | https://invoice.built-simple.ai |
| **Internal** | http://192.168.1.117 |

## Technical Stack

| Component | Version/Details |
|-----------|-----------------|
| **OS** | Ubuntu 24.04 LTS |
| **PHP** | 8.4 (from ppa:ondrej/php) |
| **Framework** | Symfony |
| **Web Server** | nginx |
| **Database** | SQLite (embedded) |
| **Version** | 2.3.14 |

## Container Details

- **VMID:** 117
- **Hostname:** solidinvoice
- **IP:** 192.168.1.117 (static)
- **Storage:** local-lvm (8GB)
- **RAM:** 1GB
- **CPU:** 2 cores

## File Locations

| Path | Description |
|------|-------------|
| `/var/www/solidinvoice` | Application root |
| `/var/www/solidinvoice/public` | Web root (nginx document root) |
| `/var/www/solidinvoice/var` | Cache, logs, SQLite database |
| `/var/www/solidinvoice/.env` | Environment configuration |
| `/etc/nginx/sites-available/solidinvoice` | nginx config |

## Configuration

### Environment (.env)
```
SOLIDINVOICE_ENV=prod
SOLIDINVOICE_DEBUG=0
```

### nginx Config
```nginx
server {
    listen 80;
    server_name _;
    root /var/www/solidinvoice/public;

    location / {
        try_files $uri /index.php$is_args$args;
    }

    location ~ ^/index\.php(/|$) {
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        internal;
    }

    location ~ \.php$ {
        return 404;
    }
}
```

## Initial Setup

1. Navigate to https://invoice.built-simple.ai/install
2. Complete the installation wizard:
   - Database: Select SQLite (default)
   - Create admin account
   - Configure company details
   - Set up email (optional)

## Maintenance Commands

```bash
# SSH to Victini then exec into container
ssh root@192.168.1.115
pct exec 117 -- bash

# Clear cache
cd /var/www/solidinvoice
php bin/console cache:clear

# Update assets
php bin/console assets:install public --symlink

# Check logs
tail -f /var/log/nginx/solidinvoice_error.log
tail -f var/log/prod.log
```

## Backup

SQLite database is in `/var/www/solidinvoice/var/`. To backup:

```bash
# From Victini
pct exec 117 -- tar -czf /tmp/solidinvoice-backup.tar.gz -C /var/www/solidinvoice var/
pct pull 117 /tmp/solidinvoice-backup.tar.gz /mnt/storage/backups/solidinvoice-$(date +%Y%m%d).tar.gz
```

## Cloudflare Tunnel

Configured in Victini's `/etc/cloudflared/config.yml`:
```yaml
- hostname: invoice.built-simple.ai
  service: http://192.168.1.117:80
```

## Troubleshooting

### 500 Error
```bash
# Check PHP-FPM
systemctl status php8.4-fpm

# Check nginx error log
tail -50 /var/log/nginx/solidinvoice_error.log

# Check permissions
chown -R www-data:www-data /var/www/solidinvoice
chmod -R 755 /var/www/solidinvoice
chmod -R 777 /var/www/solidinvoice/var
```

### Clear and Rebuild Cache
```bash
cd /var/www/solidinvoice
rm -rf var/cache/*
php bin/console cache:clear
php bin/console cache:warmup
```

---
*Deployed: January 17, 2026*
*GitHub: https://github.com/SolidInvoice/SolidInvoice*
