# Happy Server - Claude Code Session Manager

**Last Updated:** April 18, 2026
**Status:** Running
**Version:** 0.13.0

## Overview

| Property | Value |
|----------|-------|
| **Host** | Giratina (192.168.1.100) |
| **Type** | Docker Compose stack |
| **Location** | `/opt/happy-server/` |
| **External URL** | https://happy.built-simple.ai |
| **Status** | Running (4 containers) |

## What is Happy?

Happy is a session management and web UI layer for Claude Code CLI, developed by [Happy Engineering](https://happy.engineering). It provides:

- **Persistent chat sessions** - Chat history preserved across daemon restarts
- **Web-based chat interface** - Access sessions from any browser
- **Multi-machine session access** - Connect from any machine with Happy CLI
- **File storage via MinIO** - S3-compatible object storage for artifacts
- **Session metrics** - Track usage and performance

## Docker Stack Architecture

```
                         ┌─────────────────────────────────────────────────────┐
                         │              Giratina (192.168.1.100)               │
                         ├─────────────────────────────────────────────────────┤
                         │                                                     │
┌───────────────────┐    │  ┌─────────────────────────────────────────────┐   │
│  Cloudflare       │────│──│  happy-server (Port 3005)                   │   │
│  Tunnel           │    │  │  Main API server                            │   │
│                   │    │  │  - Session management                       │   │
│  happy.built-     │    │  │  - WebSocket connections                    │   │
│  simple.ai        │    │  │  - tRPC API endpoints                       │   │
└───────────────────┘    │  │  - Metrics on :9090                         │   │
                         │  └──────────────┬──────────────────────────────┘   │
                         │                 │                                   │
┌───────────────────┐    │  ┌──────────────▼──────────────────────────────┐   │
│  Happy CLI        │────│──│  happy-web-client (Port 3080 → 80)          │   │
│  (local daemon)   │    │  │  Web UI for chat interface                  │   │
│                   │    │  └─────────────────────────────────────────────┘   │
│  Port: dynamic    │    │                                                     │
│  (e.g., 41905)    │    │  ┌─────────────────────────────────────────────┐   │
└───────────────────┘    │  │  happy-postgres (Port 5433 → 5432)          │   │
                         │  │  PostgreSQL 16 - Session database            │   │
                         │  │  Database: handy                             │   │
                         │  │  Healthcheck: pg_isready                     │   │
                         │  └─────────────────────────────────────────────┘   │
                         │                                                     │
                         │  ┌─────────────────────────────────────────────┐   │
                         │  │  happy-redis (Port 6380 → 6379)             │   │
                         │  │  Redis 7 Alpine - Session cache              │   │
                         │  └─────────────────────────────────────────────┘   │
                         │                                                     │
                         │  ┌─────────────────────────────────────────────┐   │
                         │  │  happy-minio (Port 9000-9001)               │   │
                         │  │  MinIO - S3-compatible file storage          │   │
                         │  │  Console: http://192.168.1.100:9001         │   │
                         │  │  Bucket: happy                               │   │
                         │  └─────────────────────────────────────────────┘   │
                         │                                                     │
                         │  Network: happy-network (bridge)                    │
                         └─────────────────────────────────────────────────────┘
```

## Container Details

| Container | Image | Port Mapping | Purpose | Volume |
|-----------|-------|--------------|---------|--------|
| **happy-server** | Custom build | 3005:3005 | Main API server | - |
| **happy-web-client** | Custom build | 3080:80 | Web UI | - |
| **happy-postgres** | postgres:16 | 5433:5432 | Database | happy-pgdata |
| **happy-redis** | redis:7-alpine | 6380:6379 | Session cache | happy-redis-data |
| **happy-minio** | minio/minio | 9000-9001:9000-9001 | File storage | happy-minio-data |

## Configuration

### Docker Compose Environment
```yaml
# happy-server environment
NODE_ENV: production
PORT: 3005
DATABASE_URL: postgresql://postgres:postgres@postgres:5432/handy
REDIS_URL: redis://redis:6379
HANDY_MASTER_SECRET: <redacted>
S3_HOST: minio
S3_PORT: 9000
S3_USE_SSL: false
S3_ACCESS_KEY: minioadmin
S3_SECRET_KEY: minioadmin
S3_BUCKET: happy
S3_PUBLIC_URL: http://192.168.1.100:9000/happy
METRICS_ENABLED: true
METRICS_PORT: 9090
```

### CLI Configuration
The Happy CLI stores configuration in `~/.happy/`:

| File | Purpose |
|------|---------|
| `settings.json` | Machine ID, onboarding status |
| `daemon.state.json` | Running daemon info (PID, port, version) |
| `credentials.json` | Authentication tokens |
| `logs/` | Daemon and CLI logs |

### CLI Environment Variables
```bash
# Server URL (required for remote access)
HAPPY_SERVER_URL=https://happy.built-simple.ai

# Optional debugging
DANGEROUSLY_LOG_TO_SERVER=true  # Send logs to server
DEBUG=true                       # Enable debug output
```

## Quick Commands

### Health & Status
```bash
# Full health check
HAPPY_SERVER_URL="https://happy.built-simple.ai" happy doctor

# Check auth status
HAPPY_SERVER_URL="https://happy.built-simple.ai" happy auth status

# Check Docker containers
docker ps --filter "name=happy"

# Container health
docker compose -f /opt/happy-server/docker-compose.yaml ps
```

### Logs
```bash
# View server logs
docker logs happy-server --tail 100 -f

# View all Happy logs
docker compose -f /opt/happy-server/docker-compose.yaml logs -f

# View specific container logs
docker logs happy-postgres --tail 50
docker logs happy-redis --tail 50
docker logs happy-minio --tail 50

# CLI daemon logs
cat ~/.happy/logs/daemon.log
```

### Management
```bash
# Restart entire stack
cd /opt/happy-server && docker compose restart

# Restart specific container
docker restart happy-server

# Stop stack
cd /opt/happy-server && docker compose down

# Start stack
cd /opt/happy-server && docker compose up -d

# Rebuild and restart
cd /opt/happy-server && docker compose up -d --build
```

### Authentication
```bash
# Login
HAPPY_SERVER_URL="https://happy.built-simple.ai" happy auth login

# Logout
HAPPY_SERVER_URL="https://happy.built-simple.ai" happy auth logout

# Check status
HAPPY_SERVER_URL="https://happy.built-simple.ai" happy auth status
```

### Daemon Management
```bash
# Start daemon
HAPPY_SERVER_URL="https://happy.built-simple.ai" happy daemon start

# Check daemon status (shown in happy doctor)
HAPPY_SERVER_URL="https://happy.built-simple.ai" happy doctor

# Kill daemon manually
pkill -f "happy.*daemon"
```

## Database

### Schema
The `handy` database stores:
- User accounts and sessions
- Chat history and messages
- File references
- Usage metrics

### Backup
```bash
# Backup database
docker exec happy-postgres pg_dump -U postgres handy > /root/happy-backup-$(date +%Y%m%d)/handy.sql

# Restore database
docker exec -i happy-postgres psql -U postgres handy < handy.sql
```

### Direct Access
```bash
# Connect to PostgreSQL
docker exec -it happy-postgres psql -U postgres -d handy

# Example queries
\dt                    # List tables
SELECT * FROM users;   # List users
\q                     # Exit
```

## MinIO Object Storage

### Access Console
- **URL:** http://192.168.1.100:9001
- **Username:** minioadmin
- **Password:** minioadmin

### CLI Access
```bash
# Install mc (MinIO Client)
curl -O https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc

# Configure alias
./mc alias set happy http://192.168.1.100:9000 minioadmin minioadmin

# List buckets
./mc ls happy

# List files in happy bucket
./mc ls happy/happy/
```

## Known Limitations

| Limitation | Description |
|------------|-------------|
| **No session resume** | Old chat sessions cannot be "resumed" after daemon restart |
| **Context loss** | Context is lost when daemon restarts |
| **Read-only history** | Chat history preserved but read-only after session ends |
| **Single user** | Currently designed for single-user/personal use |

## Cloudflare Tunnel

Accessed via Giratina tunnel configuration:

```yaml
- hostname: happy.built-simple.ai
  service: http://localhost:3005
```

The web client is accessed through the same tunnel or directly at `http://192.168.1.100:3080`.

## Monitoring

| Check | Method | Frequency |
|-------|--------|-----------|
| **Container health** | `docker ps` | 5 min |
| **PostgreSQL health** | Docker healthcheck | 5 sec |
| **API health** | `happy doctor` | Manual |
| **Metrics** | Prometheus on :9090 | Continuous |

## Troubleshooting

### Daemon not connecting
```bash
# Check daemon state
cat ~/.happy/daemon.state.json

# Kill and restart daemon
pkill -f "happy.*daemon"
HAPPY_SERVER_URL="https://happy.built-simple.ai" happy daemon start
```

### Container not starting
```bash
# Check logs
docker logs happy-server

# Check dependencies
docker compose -f /opt/happy-server/docker-compose.yaml ps

# Verify network
docker network ls | grep happy
```

### Authentication issues
```bash
# Clear credentials
rm ~/.happy/credentials.json

# Re-login
HAPPY_SERVER_URL="https://happy.built-simple.ai" happy auth login
```

### Database issues
```bash
# Check PostgreSQL container
docker logs happy-postgres

# Verify healthcheck
docker inspect happy-postgres | grep -A 10 Health

# Test connection
docker exec happy-postgres pg_isready -U postgres -d handy
```

## Backup Location

Backups stored at: `/root/happy-backup-YYYYMMDD/`
- `docker-compose.yaml` - Stack configuration
- `handy.sql` - Database dump

## Version History

| Date | Version | Change |
|------|---------|--------|
| Apr 12, 2026 | 0.13.0 | Current running version |
| Apr 11, 2026 | - | Database backup created |

## External Resources

- **Documentation:** https://happy.engineering
- **App Portal:** https://app.happy.engineering
- **Source:** Proprietary (Happy Engineering)

---
*Happy Server - Claude Code session management and web UI*
*Running on Giratina via Docker Compose*
*Updated: April 18, 2026*
