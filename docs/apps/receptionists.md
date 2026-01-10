# AI Receptionist Applications

**Last Updated:** January 9, 2026
**Status:** Running (External access issues)

## Overview

Two AI-powered phone receptionists with sarcastic-but-helpful personalities.

## CT 116: Thai Receptionist (Peinto Thai Kitchen)

| Property | Value |
|----------|-------|
| **Container** | CT 116 on Victini (192.168.1.115) |
| **Port** | 3000 |
| **Phone** | +1 (725) 726-3727 (Twilio) |
| **Status** | Running - DNS not configured |

### Features
- Daily mood variations (7 moods, one per day)
- Real-time voice conversations
- Restaurant-specific knowledge base
- Sound effects (sighs, typing, coffee slurping)
- Web interface for testing calls

### External URL
- Planned: https://peintothai.built-simple.ai
- **Issue:** DNS CNAME record missing

## CT 114: Sarcastic Receptionist (Generic)

| Property | Value |
|----------|-------|
| **Container** | CT 114 on Victini (192.168.1.115) |
| **Port** | 3000 |
| **Phone** | +1 (725) 726-3727 (same as CT 116!) |
| **Status** | Running - 404 routing issue |
| **Voice** | Deadpool personality |

### External URL
- https://receptionist.built-simple.ai
- **Issue:** DNS resolves but returns 404

## Technology Stack (Both)

- Express.js 5.1.0 with WebSockets
- OpenAI GPT (conversation intelligence)
- Deepgram (speech-to-text, real-time)
- PlayHT (text-to-speech with SSML)
- Twilio (voice calls)
- PM2 process manager

## Known Issues

1. **Thai Receptionist:** DNS CNAME record missing (15 min fix)
2. **Sarcastic Receptionist:** Returns 404 (routing issue, 30 min fix)
3. **Shared Phone Number:** Both use same Twilio number - conflict risk

## Operational Costs

| Service | Monthly Cost |
|---------|--------------|
| Twilio | ~$5-20 |
| OpenAI | ~$10-50 |
| Deepgram | ~$5-15 |
| PlayHT | ~$10-30 |
| **Total** | $30-115/customer |

**Break-even:** 1-2 customers at $99-299/month

## Revenue Model

- $99-299/month per restaurant
- Target: Restaurants, service businesses

## Quick Commands

```bash
# Access Thai Receptionist
ssh root@192.168.1.115 "pct enter 116"

# Access Sarcastic Receptionist
ssh root@192.168.1.115 "pct enter 114"

# View logs
ssh root@192.168.1.115 "pct exec 116 -- pm2 logs"
ssh root@192.168.1.115 "pct exec 114 -- pm2 logs"

# Restart
ssh root@192.168.1.115 "pct exec 116 -- pm2 restart all"
```

## Related Documentation

- RECEPTIONIST_APPLICATIONS_STATUS.md (in /root/)

---
*AI Receptionist applications documented: December 9, 2025*
