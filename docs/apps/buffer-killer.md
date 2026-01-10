# Buffer Killer - Social Media Scheduler

**Last Updated:** January 9, 2026
**Status:** Development Mode (not production-ready)

## Overview

| Property | Value |
|----------|-------|
| **Container** | CT 311 on Silvally (192.168.1.52) |
| **IP Address** | 192.168.1.149 |
| **OAuth Port** | 3000 |
| **Web UI Port** | 3080 |
| **Process Manager** | PM2 6.0.13 |
| **Runtime** | Node.js 20.18.1 |

## External URLs

- **OAuth Server:** https://buffer-killer.built-simple.ai
- **Web UI:** https://buffer-killer-admin.built-simple.ai

## What is Buffer Killer?

Self-hosted social media scheduling application - an open-source alternative to Buffer. Schedule posts across multiple platforms:

- Twitter/X (OAuth 2.0 with PKCE)
- LinkedIn (OAuth 2.0)
- Mastodon (dynamic instance registration)
- GitHub (OAuth Apps)
- Facebook (Graph API)
- YouTube (Google APIs)

## Architecture: Two-Port Design

### Port 3000 - OAuth Server (Backend)
- Handles OAuth authentication callbacks
- Token exchange and secure storage
- Platform-specific auth flows
- Security-isolated authentication layer

### Port 3080 - Web UI (Frontend)
- Post composition and scheduling interface
- Account connection management
- Dashboard with statistics and analytics
- Media uploads (images/videos via FFmpeg)
- Queue management and post history

## Technology Stack

- **Backend:** Express.js 5.1.0
- **Database:** SQLite 5.1.7 (160KB production DB)
- **Media:** FFmpeg, Sharp, HEIC conversion
- **Scheduler:** node-schedule 2.1.1
- **Notifications:** Twilio SMS alerts
- **Security:** crypto-js for credential encryption

## Security Status

**Implemented:**
- Credential encryption (crypto-js AES-256)
- Secure file permissions (600 on .env and database)
- OAuth PKCE flow for Twitter/X
- Encrypted database credentials

**Pending:**
- Web UI authentication (currently open access)
- Rate limiting on endpoints
- Input validation/sanitization
- Automated encrypted backups
- Audit logging

## Quick Commands

```bash
# Access container
ssh root@192.168.1.52 "pct enter 311"

# Check service status
ssh root@192.168.1.52 "pct exec 311 -- ps aux | grep node"

# View logs
ssh root@192.168.1.52 "pct exec 311 -- pm2 logs buffer-killer --lines 50"

# Restart service
ssh root@192.168.1.52 "pct exec 311 -- pm2 restart buffer-killer"

# Database backup
ssh root@192.168.1.52 "pct exec 311 -- sqlite3 /root/buffer-killer-deployment/database.db '.backup /root/db-backup-\$(date +%Y%m%d).db'"

# Test internal access
curl -I http://192.168.1.149:3080  # Web UI
curl http://192.168.1.149:3000     # OAuth status
```

## Monitoring

- Health checks every 5 minutes
- OAuth Server monitored on port 3000
- Web UI monitored on port 3080
- Email alerts configured for failures

## Migration History

Migrated from Victini to Silvally: December 13, 2025
- CT 111 → CT 311

## Related Documentation

- BUFFER_KILLER_DOCUMENTATION.md (in /root/)
- BUFFER_KILLER_SECURITY_HARDENING.md
- BUFFER_KILLER_DNS_SETUP.md

---
*Buffer Killer migrated to Silvally: December 13, 2025*
