# Buffer Killer - Social Media Scheduler

**Last Updated:** January 30, 2026
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

## Programmatic API

**Base URL:** `http://192.168.1.149:3080` (internal) or via SSH tunnel

The app exposes a simple REST API for programmatic posting. No authentication required (API is internal-only).

---

### POST /api/v1/post

Post to one or more connected social media platforms.

**Request Body:**
```json
{
  "text": "Your post content here",      // Required: string
  "platforms": ["twitter", "linkedin"],  // Required: array of platform names
  "imageBase64": "data:image/png;base64,...",  // Optional: base64 image with data URI
  "imageUrl": "https://example.com/img.jpg"    // Optional: URL to image (alternative to base64)
}
```

**Supported Platforms:** `twitter`, `linkedin`, `zapier_facebook`, `zapier_instagram`, `zapier_twitter`

**Examples:**

```bash
# Simple text post to both platforms
curl -X POST http://192.168.1.149:3080/api/v1/post \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello from the API!","platforms":["twitter","linkedin"]}'

# Post to Twitter only
curl -X POST http://192.168.1.149:3080/api/v1/post \
  -H "Content-Type: application/json" \
  -d '{"text":"Twitter only post","platforms":["twitter"]}'

# Post with image from URL
curl -X POST http://192.168.1.149:3080/api/v1/post \
  -H "Content-Type: application/json" \
  -d '{"text":"Check out this image!","platforms":["twitter"],"imageUrl":"https://example.com/photo.jpg"}'

# Post with base64 image
curl -X POST http://192.168.1.149:3080/api/v1/post \
  -H "Content-Type: application/json" \
  -d '{"text":"Image post","platforms":["twitter"],"imageBase64":"data:image/png;base64,iVBORw0KGgo..."}'
```

**Success Response:**
```json
{
  "success": true,
  "results": {
    "twitter": {
      "success": true,
      "result": {
        "id": "2017333150024929768",
        "text": "Hello from the API!"
      }
    },
    "linkedin": {
      "success": true,
      "result": {
        "id": "urn:li:share:7423098842113310720",
        "url": "https://www.linkedin.com/feed/update/urn:li:share:7423098842113310720"
      }
    }
  }
}
```

**Partial Failure Response:**
```json
{
  "success": false,
  "results": {
    "twitter": {"success": true, "result": {"id": "123..."}},
    "linkedin": {"success": false, "error": "Account not connected"}
  }
}
```

**Error Response (400):**
```json
{"error": "Required: text (string), platforms (array)"}
```

---

## Zapier Integration (for Facebook/Instagram)

For platforms requiring developer accounts (Facebook, Instagram), posts are queued and Zapier polls to fetch and publish them.

### How It Works

1. Post to `zapier_facebook` or `zapier_instagram` platform
2. Buffer Killer queues the post
3. Zapier polls every X minutes via Schedule trigger
4. Zapier fetches pending posts and publishes via Facebook Pages action

### Zapier Queue Endpoints

#### GET /api/v1/zapier/next

Fetch next pending post (Zapier polls this).

```bash
# Get next post for any platform
curl http://192.168.1.149:3080/api/v1/zapier/next

# Get next post for specific platform
curl http://192.168.1.149:3080/api/v1/zapier/next?platform=facebook
```

**Response (has post):**
```json
{
  "hasPost": true,
  "id": 1,
  "text": "Hello Facebook!",
  "platform": "facebook",
  "image_url": "https://example.com/image.jpg",
  "image_base64": null,
  "created_at": "2026-01-30T20:32:18.650Z"
}
```

**Response (no posts):**
```json
{"hasPost": false}
```

#### POST /api/v1/zapier/complete/:id

Mark a post as completed after Zapier publishes it.

```bash
curl -X POST http://192.168.1.149:3080/api/v1/zapier/complete/1 \
  -H "Content-Type: application/json" \
  -d '{"success": true}'
```

#### GET /api/v1/zapier/status

Check queue status.

```bash
curl http://192.168.1.149:3080/api/v1/zapier/status
```

**Response:**
```json
{
  "total": 5,
  "pending": 2,
  "processing": 0,
  "completed": 3,
  "failed": 0,
  "recent": [...]
}
```

### Zapier Setup

**Step 1:** Create Zap with Schedule trigger (every 5 min)

**Step 2:** Code by Zapier - Fetch Post:
```javascript
const response = await fetch('http://192.168.1.149:3080/api/v1/zapier/next?platform=facebook');
const data = await response.json();
if (!data.hasPost) return { skip: true };
return { id: data.id, text: data.text, image_url: data.image_url };
```

**Step 3:** Filter - Only continue if `skip` does not exist

**Step 4:** Facebook Pages - Create Page Post (use `text` from step 2)

**Step 5:** Code by Zapier - Mark Complete:
```javascript
await fetch('http://192.168.1.149:3080/api/v1/zapier/complete/' + inputData.id, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ success: true })
});
return { done: true };
```

### Example: Post to Facebook via Zapier

```bash
curl -X POST http://192.168.1.149:3080/api/v1/post \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello Facebook!","platforms":["zapier_facebook"]}'
```

---

### GET /api/v1/accounts

List all connected social media accounts.

```bash
curl http://192.168.1.149:3080/api/v1/accounts
```

**Response:**
```json
[
  {
    "id": 3,
    "platform": "twitter",
    "username": "Talon_Neely",
    "is_active": 1
  },
  {
    "id": 4,
    "platform": "linkedin",
    "username": "Talon Neely",
    "is_active": 1
  }
]
```

---

### Token Auto-Refresh

Twitter OAuth 2.0 tokens expire every 2 hours. The API automatically:
1. Detects 401 Unauthorized errors
2. Uses the refresh token to get a new access token
3. Saves the new tokens to the database
4. Retries the failed request with the new token

This is transparent to API callers - posts will succeed even with expired tokens.

## Connected Accounts (as of Jan 30, 2026)

| Platform | Username | Status |
|----------|----------|--------|
| Twitter/X | @Talon_Neely | ✅ Connected |
| LinkedIn | Talon Neely | ✅ Connected |

## Quick Commands

```bash
# Access container
ssh root@192.168.1.52 "pct enter 311"

# Check service status
ssh root@192.168.1.52 "pct exec 311 -- ps aux | grep node"

# View logs (note: pm2 path required)
ssh root@192.168.1.52 "pct exec 311 -- /usr/local/lib/node_modules/pm2/bin/pm2 logs buffer-killer --lines 50"

# Restart service
ssh root@192.168.1.52 "pct exec 311 -- /usr/local/lib/node_modules/pm2/bin/pm2 restart buffer-killer"

# Database backup
ssh root@192.168.1.52 "pct exec 311 -- sqlite3 /root/buffer-killer-deployment/database.db '.backup /root/db-backup-\$(date +%Y%m%d).db'"

# Test internal access
curl -I http://192.168.1.149:3080  # Web UI
curl http://192.168.1.149:3000     # OAuth status

# Test API posting
curl -X POST http://192.168.1.149:3080/api/v1/post \
  -H "Content-Type: application/json" \
  -d '{"text":"Test post","platforms":["twitter","linkedin"]}'
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
*Programmatic API added: January 30, 2026*
*Twitter auto-refresh tokens implemented: January 30, 2026*
*Zapier queue integration added: January 30, 2026*
