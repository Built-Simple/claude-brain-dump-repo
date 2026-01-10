# Happy Server - Claude Code Session Manager

**Last Updated:** January 9, 2026
**Status:** Running

## Overview

| Property | Value |
|----------|-------|
| **Host** | Giratina (192.168.1.100) |
| **Type** | Docker Compose stack |
| **Status** | Running |

## External URL

- **Web UI:** https://happy.built-simple.ai

## What is Happy?

Happy is a session management and web UI layer for Claude Code CLI. It provides:

- Persistent chat sessions across daemon restarts (history only)
- Web-based chat interface
- Multi-machine session access
- File storage via MinIO

## Docker Stack

| Container | Port | Purpose | Status |
|-----------|------|---------|--------|
| happy-server | 3005 | Main API server | Running |
| happy-web-client | 3080→80 | Web UI | Running |
| happy-postgres | 5433→5432 | Database | Healthy |
| happy-redis | 6380→6379 | Session cache | Running |
| happy-minio | 9000-9001 | File storage | Running |

## Architecture

```
External → Cloudflare Tunnel → happy-server:3005
                            → happy-web-client:3080

Claude CLI → happy daemon → happy-server:3005
```

## Quick Commands

```bash
# Check Happy health
HAPPY_SERVER_URL="https://happy.built-simple.ai" happy doctor

# Check Docker containers
docker ps --filter "name=happy"

# View server logs
docker logs happy-server --tail 100

# View all Happy logs
docker compose logs -f

# Restart Happy stack
cd /path/to/happy && docker compose restart

# Check auth status
HAPPY_SERVER_URL="https://happy.built-simple.ai" happy auth status
```

## Known Limitations

- Old chat sessions cannot be "resumed" after daemon restart
- Context is lost when daemon restarts
- Chat history is preserved but read-only after session ends

## Cloudflare Tunnel

Accessed via Giratina tunnel:
- Domain: happy.built-simple.ai
- Target: localhost:3005

---
*Happy Server running on Giratina via Docker*
