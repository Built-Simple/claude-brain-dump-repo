# MyFit Pro - Fitness Tracking Application

**Last Updated:** January 9, 2026
**Status:** Running

## Overview

| Property | Value |
|----------|-------|
| **Container** | CT 312 on Silvally (192.168.1.52) |
| **IP Address** | 192.168.1.112:3000 |
| **Status** | Running |

## External URL

- **App:** https://myfit.built-simple.ai

## What is MyFit Pro?

Personal fitness tracking application for:
- Workout logging
- Progress tracking
- Fitness goal management

## Technology Stack

- Node.js backend
- Web-based frontend
- SQLite database

## Quick Commands

```bash
# Access container
ssh root@192.168.1.52 "pct enter 312"

# Check service status
ssh root@192.168.1.52 "pct exec 312 -- ps aux | grep node"

# Test access
curl http://192.168.1.112:3000
```

## Monitoring

- Health checks every 5 minutes on port 3000
- Email alerts on failure

## Migration History

Migrated from Victini to Silvally: December 13, 2025
- CT 112 → CT 312

---
*MyFit Pro migrated to Silvally: December 13, 2025*
