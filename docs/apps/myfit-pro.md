# MyFit Pro - Fitness Tracking Application

**Last Updated:** April 18, 2026
**Status:** Running
**Version:** 0.0.0-semantically-released (SvelteKit 5)

## Overview

| Property | Value |
|----------|-------|
| **Container** | CT 312 on Silvally (192.168.1.52) |
| **Internal IP** | 192.168.1.112:3000 |
| **External URL** | https://myfit.built-simple.ai |
| **Status** | Running |
| **Database** | PostgreSQL 16 (local) |

## What is MyFit Pro?

Personal fitness tracking application for:
- **Workout logging** - Track sets, reps, and weights
- **Exercise split templates** - Create reusable workout programs (Push/Pull/Legs, Upper/Lower, etc.)
- **Mesocycle planning** - Program multi-week training blocks with progressive overload
- **Progress tracking** - View workout history and performance trends
- **Advanced set types** - Support for drop sets, myo-reps, down sets, and more

## Technology Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| **Framework** | SvelteKit 5 (Svelte 5.15) | Full-stack meta-framework |
| **Runtime** | Node.js 20 | Alpine-based Docker |
| **Database** | PostgreSQL 16 | Local instance in container |
| **ORM** | Prisma 6.0 | Type-safe database access |
| **Validation** | Zod + zod-prisma-types | Auto-generated from schema |
| **API Layer** | tRPC | Type-safe client-server calls |
| **Auth** | Auth.js (SvelteKit adapter) | Google OAuth enabled |
| **Styling** | Tailwind CSS 3.4 | With bits-ui components |
| **Charts** | Chart.js 4 | Progress visualization |
| **Build** | Vite 6 | Fast dev/production builds |
| **Testing** | Playwright | E2E testing |
| **PWA** | @vite-pwa/sveltekit | Installable app support |

## Database Schema

Multi-file Prisma schema with the following core models:

### User & Auth Models
```prisma
User              # Core user entity (OAuth via Auth.js)
Account           # OAuth provider connections (Google, GitHub)
Session           # Active login sessions
VerificationToken # Email verification (reserved for future)
UserSettings      # User preferences (motivational quotes, etc.)
```

### Fitness Models
```prisma
ExerciseSplit     # Reusable workout program template
ExerciseSplitDay  # Individual day within a split
ExerciseTemplate  # Exercise configuration within a day
Mesocycle         # Multi-week training block
Workout           # Actual workout history
```

### Key Enums
| Enum | Values |
|------|--------|
| **MuscleGroup** | Chest, FrontDelts, SideDelts, RearDelts, Lats, Traps, Triceps, Biceps, Forearms, Quads, Hamstrings, Glutes, Calves, Abs, Neck, Adductors, Abductors, Custom |
| **SetType** | Straight, Drop, Down, Myorep, MyorepMatch, MyorepMatchDown, V2 |
| **ChangeType** | Percentage, AbsoluteLoad |
| **WorkoutStatus** | Skipped, RestDay |

## Architecture

```
                    ┌─────────────────────────────────────────┐
                    │         CT 312 (myfit-pro)              │
                    │         192.168.1.112                   │
                    ├─────────────────────────────────────────┤
┌───────────────┐   │  ┌─────────────────────────────────┐   │
│   Cloudflare  │───│──│  SvelteKit App (Node.js 20)    │   │
│    Tunnel     │   │  │  Port 3000                      │   │
│               │   │  │                                 │   │
│ myfit.built-  │   │  │  ├── +page.svelte (routes)     │   │
│ simple.ai     │   │  │  ├── tRPC API (/api/trpc)      │   │
└───────────────┘   │  │  ├── Auth.js (/api/auth)       │   │
                    │  │  └── Prisma Client             │   │
                    │  └──────────────┬──────────────────┘   │
                    │                 │                       │
                    │  ┌──────────────▼──────────────────┐   │
                    │  │  PostgreSQL 16                  │   │
                    │  │  localhost:5432                 │   │
                    │  │  Database: myfit                │   │
                    │  └─────────────────────────────────┘   │
                    └─────────────────────────────────────────┘
```

## Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://myfit:MyFitPro2025@localhost:5432/myfit?schema=public

# Auth.js
AUTH_URL=https://myfit.built-simple.ai
AUTH_GOOGLE_ID=469852670985-pkhvhocvu2fbus5ljf4ht8ssaeu0qv6c.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=<redacted>

# App
PORT=3000
ORIGIN=https://myfit.built-simple.ai

# Error Monitoring
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=Info@Built-Simple.AI
```

### OAuth Setup
Google OAuth is configured via Google Cloud Console:
- **Project:** MyFit Pro
- **Authorized redirect URI:** `https://myfit.built-simple.ai/api/auth/callback/google`
- **Scopes:** `openid`, `email`, `profile`

## Quick Commands

```bash
# Access container
ssh root@192.168.1.52 "pct enter 312"

# Check process status
ssh root@192.168.1.52 "pct exec 312 -- ps aux | grep node"

# View application logs
ssh root@192.168.1.52 "pct exec 312 -- journalctl -u myfit -f"

# Test health endpoint
curl -s http://192.168.1.112:3000/

# Restart application
ssh root@192.168.1.52 "pct exec 312 -- systemctl restart myfit"

# Database operations
ssh root@192.168.1.52 "pct exec 312 -- bash -c 'cd /opt/myfit-pro && npx prisma studio'"

# Run migrations
ssh root@192.168.1.52 "pct exec 312 -- bash -c 'cd /opt/myfit-pro && npx prisma db push'"

# Reset database (DESTRUCTIVE)
ssh root@192.168.1.52 "pct exec 312 -- bash -c 'cd /opt/myfit-pro && npx prisma db push --force-reset'"
```

## Docker Commands (Alternative Deployment)

The app has Docker support for containerized deployment:

```bash
# Build Docker image
npm run docker:build

# Start with Docker Compose
npm run docker:up

# Stop containers
npm run docker:down

# View logs
npm run docker:logs
```

## Development

```bash
# Install dependencies
npm ci

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev

# Run type checking
npm run check

# Run tests
npm test

# Format code
npm run format

# Lint code
npm run lint

# Build for production
npm run build
```

## Key Features

### Exercise Split Templates
Users can create reusable workout program templates:
- Define training days (Push, Pull, Legs, Upper, Lower, etc.)
- Configure exercises with target muscle groups
- Set rep ranges and progression schemes
- Mark rest days

### Set Types Supported
| Type | Description |
|------|-------------|
| **Straight** | Standard sets (e.g., 3x10) |
| **Drop** | Reduce weight, continue reps without rest |
| **Down** | Lighter backoff sets after heavy work |
| **Myorep** | Rest-pause training for metabolic stress |
| **MyorepMatch** | Match the activation set reps |

### Mesocycle Planning
- Create training blocks spanning multiple weeks
- Auto-calculate progressive overload
- Track volume and intensity across mesocycle

### Motivational Quotes
Optional feature to display quotes:
- Pre-workout motivation
- Post-workout celebration
- Between-set focus

## Monitoring

| Check | Method | Frequency |
|-------|--------|-----------|
| HTTP Health | `curl http://192.168.1.112:3000/` | 5 min |
| Process | `ps aux \| grep node` | 5 min |
| Database | PostgreSQL health check | 5 min |

Health monitoring via `/root/container_health_monitor.sh` on Silvally.

## Cloudflare Tunnel

Exposed via Cloudflare tunnel on Silvally:
```yaml
hostname: myfit.built-simple.ai
service: http://192.168.1.112:3000
```

## Dependencies

### Key Production Dependencies
- `@auth/sveltekit` - Authentication
- `@prisma/client` - Database ORM
- `@trpc/server` + `@trpc/client` - Type-safe API
- `chart.js` - Data visualization
- `posthog-js` - Analytics
- `nodemailer` - Email notifications
- `twilio` - SMS notifications (optional)

### UI Components
- `bits-ui` - Headless components
- `tailwind-variants` - Variant styling
- `svelte-sonner` - Toast notifications
- `vaul-svelte` - Drawer component
- `paneforge` - Resizable panels
- `embla-carousel-svelte` - Carousel

## Migration History

| Date | Change |
|------|--------|
| Dec 13, 2025 | Migrated from Victini (CT 112) to Silvally (CT 312) |
| Jan 17, 2026 | Updated to SvelteKit 5 / Svelte 5.15 |

## Troubleshooting

### App not responding
```bash
# Check if Node process is running
ssh root@192.168.1.52 "pct exec 312 -- ps aux | grep node"

# Check systemd service
ssh root@192.168.1.52 "pct exec 312 -- systemctl status myfit"

# Restart service
ssh root@192.168.1.52 "pct exec 312 -- systemctl restart myfit"
```

### Database connection issues
```bash
# Check PostgreSQL
ssh root@192.168.1.52 "pct exec 312 -- systemctl status postgresql"

# Test connection
ssh root@192.168.1.52 "pct exec 312 -- psql -U myfit -d myfit -c 'SELECT 1'"
```

### OAuth login failures
1. Verify `AUTH_URL` matches the external domain
2. Check Google Cloud Console redirect URIs
3. Ensure `AUTH_GOOGLE_SECRET` is set correctly

---
*MyFit Pro - Personal fitness tracking with mesocycle planning*
*Migrated to Silvally: December 13, 2025*
*Updated: April 18, 2026*
