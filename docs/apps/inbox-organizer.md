# Inbox Organizer - Email Sorting SaaS

**Last Updated:** January 14, 2026
**Status:** Running (Production)

## Overview

| Property | Value |
|----------|-------|
| **Container** | CT 111 on Giratina (192.168.1.100) |
| **IP Address** | 192.168.1.111:8000 |
| **Source Code** | `/root/email-sorter-web` (Giratina host) |
| **Deployed Code** | `/opt/email-sorter/` (CT 111) |
| **Status** | Running - Google OAuth Verification Pending |

## External URL

- **App:** https://inbox.built-simple.ai
- **Privacy Policy:** https://inbox.built-simple.ai/privacy
- **Terms of Service:** https://inbox.built-simple.ai/terms

## What is Inbox Organizer?

A SaaS email organization tool that helps users automatically label and organize their Gmail inbox:

- **Sender Analysis:** Extracts sender domains from all emails
- **Domain Rules:** Users create rules mapping domains to Gmail labels (e.g., `amazon.com` -> `Companies/Amazon`)
- **Batch Labeling:** Applies labels to all matching emails with exponential backoff for rate limits
- **Archive Feature:** Archives read emails that have been labeled
- **Cron Jobs:** Scheduled processing for auto-sort users

## Technology Stack

| Component | Technology |
|-----------|------------|
| **Backend** | FastAPI (Python 3.12) |
| **Database** | SQLite with async (`aiosqlite`) |
| **Auth** | Google OAuth 2.0 |
| **API** | Gmail API v1 |
| **Encryption** | Fernet (tokens at rest) |
| **Web Server** | Uvicorn |
| **Reverse Proxy** | Cloudflare Tunnel |

## Security Features (Implemented Jan 2026)

1. **Token Encryption:** OAuth tokens encrypted with Fernet before database storage
2. **CSRF Protection:** OAuth state parameter validation
3. **Rate Limiting:** 60 requests/minute per IP
4. **Input Validation:** Domain and label sanitization
5. **Secure Sessions:** HttpOnly, Secure, SameSite cookies
6. **GDPR Compliance:** Account deletion and data export endpoints
7. **No Hardcoded Secrets:** All credentials via environment variables

## Configuration

### Environment Variables (in CT 111)

File: `/opt/email-sorter/.env`

```
GOOGLE_CLIENT_ID=<oauth-client-id>
GOOGLE_CLIENT_SECRET=<oauth-client-secret>
SESSION_SECRET=<session-encryption-key>
CRON_SECRET=<cron-auth-token>
```

### Systemd Service

```bash
# In CT 111
systemctl status email-sorter
systemctl restart email-sorter
journalctl -u email-sorter -f
```

## Quick Commands

```bash
# Access container
pct enter 111

# Check service status
pct exec 111 -- systemctl status email-sorter

# View logs
pct exec 111 -- journalctl -u email-sorter -n 50

# Restart service
pct exec 111 -- systemctl restart email-sorter

# Test endpoint
curl -s -o /dev/null -w "%{http_code}" https://inbox.built-simple.ai/

# Push code updates from host
pct push 111 /root/email-sorter-web/main.py /opt/email-sorter/main.py
pct push 111 /root/email-sorter-web/api/gmail.py /opt/email-sorter/api/gmail.py
pct push 111 /root/email-sorter-web/api/database.py /opt/email-sorter/api/database.py
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Landing page |
| `/dashboard` | GET | User dashboard (requires auth) |
| `/auth/login` | GET | Start OAuth flow |
| `/auth/callback` | GET | OAuth callback |
| `/auth/logout` | GET | Logout (clear session) |
| `/auth/logout-full` | POST | Full logout (clear tokens) |
| `/api/extract-senders` | POST | Extract sender domains |
| `/api/rules` | GET/POST | Get/update domain rules |
| `/api/apply-labels` | POST | Apply labels to emails |
| `/api/archive-read-labeled` | POST | Archive read+labeled emails |
| `/api/status` | GET | Processing status |
| `/api/account` | DELETE | Delete account (GDPR) |
| `/api/account/export` | GET | Export user data (GDPR) |
| `/api/cron/process-all` | POST | Cron: label all users |
| `/api/cron/archive-read` | POST | Cron: archive for opted-in users |

## Database Schema

Location: `/opt/email-sorter/data/emailsorter.db`

```sql
-- Users table
users (id, email, name, picture, access_token, refresh_token, status, auto_sort, last_check, created_at)

-- Domain rules
user_rules (user_id, rules JSON, updated_at)

-- Sender cache
senders (id, user_id, domain, count, name)

-- Stats history
labeling_stats (id, user_id, stats JSON, created_at)
```

## Cloudflare Tunnel

Configured in: `/etc/cloudflared/config.yml` (on Giratina)

```yaml
- hostname: inbox.built-simple.ai
  service: http://192.168.1.111:8000
```

## Google OAuth Verification

**Status:** Pending verification (as of Jan 2026)

Required scopes:
- `gmail.readonly` - Read email metadata
- `gmail.labels` - Create/manage labels
- `gmail.modify` - Apply labels, archive
- `userinfo.email` / `userinfo.profile` - User identity

## Monitoring

- Cloudflare analytics for traffic
- Application logs via journalctl
- Rate limit warnings in logs

## Known Issues

1. **Gmail API Rate Limits:** Fixed with exponential backoff retry (Jan 2026)
2. **Large Inboxes:** Full extraction can be slow (>50k emails)

## Development

```bash
# Source code on Giratina host
cd /root/email-sorter-web

# Git repo initialized
git status
git log --oneline

# Deploy changes
# 1. Edit files in /root/email-sorter-web
# 2. Push to CT 111
pct push 111 /root/email-sorter-web/<file> /opt/email-sorter/<file>
# 3. Restart service
pct exec 111 -- systemctl restart email-sorter
```

## Related Documentation

- [Cloudflare Tunnels](../infrastructure/cloudflare-tunnels.md)
- [Giratina Machine Profile](../../machine-profiles/giratina.md)
