# Retell Web Voice Demo - Built Simple Website

**Last Updated:** May 20, 2026
**Status:** Live on https://built-simple.ai

## Overview

Web-based voice demo embedded on the Built Simple marketing website. Users can talk to an AI receptionist directly from the homepage by clicking "Try the Receptionist" button.

---

## Architecture

```
User Browser
    │
    ├── Click "Try the Receptionist" button
    │
    ▼
CT 400 (built-simple-web) on Giratina
    ├── nginx serves static site + proxies /api/retell/*
    ├── /opt/retell-api/ (Node.js Express on port 3100)
    │   └── POST /create-call → creates Retell web call token
    │
    ▼
Retell AI (api.retellai.com)
    └── WebRTC voice call via LiveKit
```

---

## Components

### 1. Retell API Server

| Property | Value |
|----------|-------|
| **Location** | CT 400 `/opt/retell-api/` |
| **Port** | 3100 (localhost only) |
| **Endpoint** | `https://built-simple.ai/api/retell/create-call` |
| **PM2 Name** | `retell-api` |

**Environment Variables** (`/opt/retell-api/.env`):
```
RETELL_API_KEY=key_d4e6d7e6bd656e6f83e0b351f264
RETELL_AGENT_ID=agent_ffdd1c1524c6e845e659b1dd57
PORT=3100
```

### 2. Frontend

| Property | Value |
|----------|-------|
| **SDK Bundle** | `/var/www/built-simple.ai/js/retell-bundle.js` (494KB) |
| **Button Location** | Homepage → AI Receptionist card |
| **Integration** | Inline script in index.html |

### 3. Retell Agent

| Property | Value |
|----------|-------|
| **Agent ID** | `agent_ffdd1c1524c6e845e659b1dd57` |
| **LLM** | GPT-4.1 |
| **Voice Provider** | Cartesia |
| **Dashboard** | https://dashboard.retellai.com |

---

## Rate Limiting

- 10 calls per IP per hour
- In-memory store (resets on server restart)
- Returns HTTP 429 when exceeded

---

## User Flow

1. User clicks "Try the Receptionist" button
2. Button shows loading stages:
   - "Initializing..."
   - "Getting token..."
   - "Requesting mic..." (browser may prompt for permission)
   - "Connecting..."
   - "Starting call..."
3. Button turns red with "End Call" when connected
4. User talks with AI receptionist
5. Click "End Call" or wait for agent to hang up
6. Button resets to original state

---

## Troubleshooting

### Check API Health
```bash
curl https://built-simple.ai/api/retell/health
```

### Check PM2 Status
```bash
pct exec 400 -- /usr/local/lib/node_modules/pm2/bin/pm2 list
```

### View API Logs
```bash
pct exec 400 -- /usr/local/lib/node_modules/pm2/bin/pm2 logs retell-api
```

### Restart API
```bash
pct exec 400 -- /usr/local/lib/node_modules/pm2/bin/pm2 restart retell-api
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "RetellWebClient not defined" | SDK not loaded | Check `/js/retell-bundle.js` exists |
| Long connection delay (~10s) | Normal for GPT-4 cold start | Consider Groq for faster startup |
| "Rate limit exceeded" | Too many calls from same IP | Wait 1 hour or restart API |
| No audio | Mic permission denied | User must allow microphone |

---

## Files

| File | Location | Purpose |
|------|----------|---------|
| `server.js` | CT 400 `/opt/retell-api/` | Express API server |
| `.env` | CT 400 `/opt/retell-api/` | Retell credentials |
| `retell-bundle.js` | CT 400 `/var/www/built-simple.ai/js/` | Bundled Retell SDK |
| `index.html` | CT 400 `/var/www/built-simple.ai/` | Homepage with button + script |

---

## Related

- [Retell AI Documentation](https://docs.retellai.com)
- [Built Simple Website](https://built-simple.ai)
- [CT 400 (built-simple-web)](../infrastructure/containers.md)

---

*Created: May 20, 2026*
