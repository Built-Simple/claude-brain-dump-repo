# SolidInvoice Configuration Reference

**Last Updated:** January 17, 2026
**Location:** CT 117 on Victini (192.168.1.117)

---

## Environment Configuration

### .env File
```bash
# Location: /var/www/solidinvoice/.env

# CRITICAL: Application environment
# BREAKING: 'dev' loads DoctrineFixturesBundle which doesn't exist in prod
SOLIDINVOICE_ENV=prod

# Debug mode (0 = production, 1 = development)
# SIDE EFFECT: 1 exposes stack traces to users
SOLIDINVOICE_DEBUG=0

# Additional environment variables (set during install):
# DATABASE_URL=sqlite:///%kernel.project_dir%/var/data.db
# MAILER_DSN=smtp://user:pass@smtp.example.com:587
# APP_SECRET=<random-32-char-string>
```

### Environment Variable Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `SOLIDINVOICE_ENV` | Symfony environment | `prod`, `dev`, `test` |
| `SOLIDINVOICE_DEBUG` | Enable debug mode | `0`, `1` |
| `DATABASE_URL` | Database connection | `sqlite:///...` or `mysql://...` |
| `MAILER_DSN` | Email transport | `smtp://user:pass@host:port` |
| `APP_SECRET` | Encryption key | 32+ character random string |
| `SOLIDINVOICE_PLATFORM` | Multi-tenant mode | `saas` (optional) |

---

## Nginx Configuration

```nginx
# Location: /etc/nginx/sites-available/solidinvoice

server {
    listen 80;
    server_name _;

    # CRITICAL: Document root is /public, not app root
    root /var/www/solidinvoice/public;

    # DEPENDENCY: All requests go through index.php (Symfony front controller)
    location / {
        try_files $uri /index.php$is_args$args;
    }

    # CRITICAL: PHP-FPM socket path must match php-fpm pool config
    location ~ ^/index\.php(/|$) {
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;

        # DEPENDENCY: These params required for Symfony routing
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;

        # SECURITY: Only index.php should be directly accessible
        internal;
    }

    # SECURITY: Block direct access to any other .php files
    location ~ \.php$ {
        return 404;
    }

    error_log /var/log/nginx/solidinvoice_error.log;
    access_log /var/log/nginx/solidinvoice_access.log;
}
```

### Nginx Configuration Gotchas

```
# GOTCHA: If you see 502 Bad Gateway:
# - Check PHP-FPM is running: systemctl status php8.4-fpm
# - Check socket exists: ls -la /run/php/php8.4-fpm.sock
# - Check socket permissions: socket should be owned by www-data

# GOTCHA: If assets return 404:
# - Run: php bin/console assets:install public --symlink
# - Check public/bundles/ directory exists

# GOTCHA: If all routes return 404:
# - Check root points to /public not /var/www/solidinvoice
# - Check try_files directive is correct
```

---

## PHP-FPM Configuration

```ini
# Location: /etc/php/8.4/fpm/pool.d/www.conf

[www]
; CRITICAL: User must match nginx user
user = www-data
group = www-data

; CRITICAL: Socket path must match nginx config
listen = /run/php/php8.4-fpm.sock
listen.owner = www-data
listen.group = www-data

; Performance tuning
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3

; DEPENDENCY: These extensions must be enabled
; php8.4-sqlite3, php8.4-mbstring, php8.4-xml, php8.4-curl
; php8.4-zip, php8.4-gd, php8.4-intl, php8.4-bcmath, php8.4-soap
```

### PHP Configuration Overrides

```ini
# Location: /etc/php/8.4/fpm/conf.d/99-solidinvoice.ini (create if needed)

; Memory limit for large invoices/PDFs
memory_limit = 256M

; Upload limit for logos/attachments
upload_max_filesize = 10M
post_max_size = 10M

; Execution time for PDF generation
max_execution_time = 60

; Session handling
session.cookie_secure = On
session.cookie_httponly = On
session.cookie_samesite = Lax
```

---

## Symfony Bundle Configuration

### Doctrine (Database)

```php
# Location: config/packages/doctrine.php

// CRITICAL: Database connection
// DEPENDENCY: Set in .env as DATABASE_URL

// For SQLite (current):
// DATABASE_URL=sqlite:///%kernel.project_dir%/var/data.db

// For MySQL (if upgrading):
// DATABASE_URL=mysql://user:password@127.0.0.1:3306/solidinvoice?serverVersion=8.0

// GOTCHA: Changing database requires migration
// Run: php bin/console doctrine:migrations:migrate
```

### Security (Authentication)

```php
# Location: config/packages/security.php

// CRITICAL: Password hashing
// DEPENDENCY: Uses native bcrypt

// CRITICAL: Firewalls
// - 'main': Web interface (form login)
// - 'api': REST API (token auth)

// API Authentication Header:
// Authorization: Bearer {api_token}
```

### Workflow (State Machines)

```php
# Location: config/packages/workflow.php

// CRITICAL: Invoice workflow
// States: new, draft, pending, paid, overdue, cancelled, archived
// See CRITICAL_PATHS.md for transition diagrams

// CRITICAL: Quote workflow
// States: new, draft, pending, accepted, declined, cancelled, archived

// CRITICAL: Recurring invoice workflow
// States: new, draft, active, paused, complete, cancelled, archived
```

### Mailer (Email)

```php
# Location: config/packages/mailer.php

// DEPENDENCY: MAILER_DSN in .env
// Examples:
// MAILER_DSN=smtp://user:pass@smtp.gmail.com:587
// MAILER_DSN=smtp://user:pass@smtp.sendgrid.net:587
// MAILER_DSN=null://null (disable email)

// GOTCHA: Gmail requires "App Password" not account password
// GOTCHA: Some hosts block port 25, use 587 instead
```

### Payment (Payum)

```php
# Location: config/packages/payum.php

// Configured gateways:
// - credit: Use client credit balance
// - cash: Manual cash payment
// - bank_transfer: Manual bank transfer
// - custom: Other offline method
// - stripe_checkout: Stripe hosted checkout
// - stripe_js: Stripe Elements
// - paypal_express_checkout: PayPal
// - paypal_pro_checkout: PayPal Pro
// - klarna_invoice: Klarna
// - authorize_net_aim: Authorize.net
// - payex: PayEx

// CRITICAL: Gateway config stored in payment_methods table
// GOTCHA: API keys stored in config column (encrypted)
```

---

## Application Settings (Database)

Settings stored in `app_config` table, accessible at Settings menu.

### Company Settings
| Key | Purpose |
|-----|---------|
| `system/company/company_name` | Company name on invoices |
| `system/company/logo` | Logo file path |
| `system/company/vat_number` | VAT/Tax ID |
| `system/company/address` | Company address |

### Invoice Settings
| Key | Purpose |
|-----|---------|
| `invoice/id/format` | Invoice number format (e.g., `INV-{counter}`) |
| `invoice/email/subject` | Email subject template |
| `invoice/email/body` | Email body template |

### Quote Settings
| Key | Purpose |
|-----|---------|
| `quote/id/format` | Quote number format |
| `quote/email/subject` | Email subject template |
| `quote/email/body` | Email body template |

### Email Settings
| Key | Purpose |
|-----|---------|
| `email/from_address` | Sender email address |
| `email/from_name` | Sender display name |
| `email/bcc` | BCC all emails to this address |

---

## Cron Configuration

```bash
# Location: /etc/cron.d/solidinvoice

# CRITICAL: Run every minute
* * * * * www-data php /var/www/solidinvoice/bin/console cron:run -e prod -n >> /var/log/solidinvoice-cron.log 2>&1

# What cron handles:
# - Generate recurring invoices
# - Send payment reminders
# - Mark invoices as overdue
# - Process notification queue
```

### Cron Troubleshooting

```bash
# Check if cron service is running
systemctl status cron

# Check cron log
tail -f /var/log/solidinvoice-cron.log

# Run manually with debug output
cd /var/www/solidinvoice
sudo -u www-data php bin/console cron:run -e prod -vvv

# List scheduled tasks
php bin/console schedule:list
```

---

## Cloudflare Tunnel

```yaml
# Location: /etc/cloudflared/config.yml (on Victini host)

# SolidInvoice entry:
- hostname: invoice.built-simple.ai
  service: http://192.168.1.117:80
```

---

## SSL/TLS

SSL is handled by Cloudflare Tunnel - no local cert configuration needed.

For direct HTTPS (if not using Cloudflare):
```bash
# Install certbot
apt install certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d invoice.example.com
```

---

## Backup Configuration

```bash
# Recommended backup script: /root/backup-solidinvoice.sh

#!/bin/bash
BACKUP_DIR="/mnt/storage/backups/solidinvoice"
DATE=$(date +%Y%m%d-%H%M%S)

# Database
pct exec 117 -- cp /var/www/solidinvoice/var/data.db /tmp/
pct pull 117 /tmp/data.db $BACKUP_DIR/data-$DATE.db

# Config
pct exec 117 -- tar -czf /tmp/config.tar.gz /var/www/solidinvoice/.env
pct pull 117 /tmp/config.tar.gz $BACKUP_DIR/config-$DATE.tar.gz

# Uploads (if any)
pct exec 117 -- tar -czf /tmp/uploads.tar.gz /var/www/solidinvoice/public/uploads 2>/dev/null
pct pull 117 /tmp/uploads.tar.gz $BACKUP_DIR/uploads-$DATE.tar.gz 2>/dev/null

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -type f -mtime +30 -delete
```

---

## Restore Procedure

```bash
# 1. Stop services
pct exec 117 -- systemctl stop nginx php8.4-fpm

# 2. Restore database
pct push 117 /backup/data-YYYYMMDD.db /var/www/solidinvoice/var/data.db
pct exec 117 -- chown www-data:www-data /var/www/solidinvoice/var/data.db

# 3. Restore config
pct push 117 /backup/config-YYYYMMDD.tar.gz /tmp/
pct exec 117 -- tar -xzf /tmp/config.tar.gz -C /

# 4. Clear cache
pct exec 117 -- rm -rf /var/www/solidinvoice/var/cache/*
pct exec 117 -- sudo -u www-data php /var/www/solidinvoice/bin/console cache:warmup -e prod

# 5. Restart services
pct exec 117 -- systemctl start php8.4-fpm nginx
```

---

*Configuration reference generated: January 17, 2026*
