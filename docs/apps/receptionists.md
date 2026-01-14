# AI Receptionist Applications

**Last Updated:** January 14, 2026
**Status:** Professional Receptionist running on Mew

## Overview

AI-powered phone receptionists for Built Simple AI. The main production receptionist runs on Mew (DigitalOcean).

---

## Professional Receptionist (Built Simple AI - PRODUCTION)

| Property | Value |
|----------|-------|
| **Server** | Mew (137.184.235.100) - DigitalOcean droplet |
| **Port** | 3000 |
| **Phone** | +1 (702) 704-5706 (Twilio) |
| **External URL** | https://pro.137.184.235.100.nip.io |
| **Status** | ✅ Production Ready |
| **Code Location** | /opt/professional-receptionist/ |

### Features
- **Deepgram Flux STT** - Semantic end-of-turn detection (won't cut off mid-sentence)
- Real-time voice conversations via WebSocket
- LLM pre-warming for faster responses (~500-800ms with pre-warming)
- Product knowledge for all Built Simple APIs
- Calendar integration (Google Calendar)
- Appointment booking capabilities
- Dynamic TTS timeout based on response length

### Technology Stack
- **Framework:** Express.js with WebSockets (ws library)
- **STT:** Deepgram Flux (v2 API, raw WebSocket)
- **LLM:** OpenAI GPT-4 (via streaming API)
- **TTS:** Deepgram Aura (streaming)
- **Telephony:** Twilio Voice
- **Process Manager:** PM2

### Deepgram Flux Configuration

```javascript
// Flux v2 endpoint with semantic turn detection
wss://api.deepgram.com/v2/listen?model=flux-general-en&encoding=mulaw&sample_rate=8000&eot_threshold=0.85&eager_eot_threshold=0.6&eot_timeout_ms=6000
```

| Parameter | Value | Description |
|-----------|-------|-------------|
| `model` | flux-general-en | Flux conversational model |
| `eot_threshold` | 0.85 | Conservative end-of-turn (0.5-0.9, higher = wait longer) |
| `eager_eot_threshold` | 0.6 | Early signal for LLM pre-warming |
| `eot_timeout_ms` | 6000 | Max 6s wait after speech stops |

### Flux Message Types

| Event | Purpose |
|-------|---------|
| `Update` | Transcript update - accumulate and pre-warm LLM |
| `EndOfTurn` | User finished speaking - respond if confident |
| `EagerEndOfTurn` | Early signal - aggressively pre-warm LLM |
| `TurnResumed` | User continued speaking - cancel pending response |
| `StartOfTurn` | User started speaking |

### Response Logic

```javascript
// Respond if high confidence AND looks complete, OR very high confidence
const looksComplete = /[.!?]$/.test(transcript.trim()) || transcript.trim().split(' ').length <= 3;
if ((confidence >= 0.70 && looksComplete) || confidence >= 0.85) {
  await processAndRespond();
}
// Fallback: 2.5s silence timer if Flux doesn't trigger EndOfTurn
```

### Product Knowledge

The AI knows about all Built Simple products:
- **FixIt API** - 18.5M Stack Overflow solutions, hybrid search, RTX 3090 GPU
- **WikiSearch API** - 4.8M Wikipedia articles, GPU vector + Elasticsearch
- **PubMed Search** - 4.5M medical papers, GPU vector search
- **ArXiv API** - 2.77M research papers, Tesla T4 GPU
- **ReviewMaster AI** - Google Business Profile integration, GPT-4 responses

### Quick Commands

```bash
# SSH to Mew
ssh root@137.184.235.100

# View logs
pm2 logs professional-receptionist

# Restart service
pm2 restart professional-receptionist

# Make test call
curl -X POST https://pro.137.184.235.100.nip.io/make-call \
  -H "Content-Type: application/json" \
  -d '{"to": "+1XXXXXXXXXX"}'

# Check health
curl https://pro.137.184.235.100.nip.io/health
```

### Architecture

```
/opt/professional-receptionist/
├── server.js                    # Main server (Flux WebSocket, Twilio, TTS)
├── src/
│   └── services/
│       ├── ai.service.js        # OpenAI integration, product knowledge
│       ├── conversation.service.js  # Conversation state management
│       └── calendar.service.js  # Google Calendar integration
├── package.json
└── .env                         # API keys (Twilio, Deepgram, OpenAI)
```

### Performance

| Operation | Time |
|-----------|------|
| Deepgram Flux STT | Real-time streaming |
| OpenAI response (with pre-warming) | ~500-800ms |
| OpenAI response (cold) | ~1500-2200ms |
| Deepgram TTS streaming | ~200-400ms |

### Recent Changes (January 14, 2026)

- **Deepgram Flux migration** - Replaced SDK with raw WebSocket for v2 API
- **Semantic turn detection** - No more cutting off users mid-sentence
- **LLM pre-warming** - Uses EagerEndOfTurn events to start generating early
- **Product info update** - All API products now accurately documented
- **ArXiv API added** - New product in AI knowledge base

---

## CT 116: Thai Receptionist (Peinto Thai Kitchen) - INACTIVE

| Property | Value |
|----------|-------|
| **Container** | CT 116 on Victini (192.168.1.115) |
| **Port** | 3000 |
| **Phone** | +1 (725) 726-3727 (Twilio) |
| **Status** | ⚠️ Inactive - DNS not configured |

### Features
- Daily mood variations (7 moods, one per day)
- Restaurant-specific knowledge base
- Sound effects (sighs, typing, coffee slurping)

### External URL
- Planned: https://peintothai.built-simple.ai
- **Issue:** DNS CNAME record missing

---

## CT 114: Sarcastic Receptionist (Generic) - INACTIVE

| Property | Value |
|----------|-------|
| **Container** | CT 114 on Victini (192.168.1.115) |
| **Port** | 3000 |
| **Status** | ⚠️ Inactive - 404 routing issue |
| **Voice** | Deadpool personality |

### External URL
- https://receptionist.built-simple.ai
- **Issue:** DNS resolves but returns 404

---

## Operational Costs (Professional Receptionist)

| Service | Monthly Cost |
|---------|--------------|
| Twilio | ~$5-20 |
| OpenAI | ~$10-50 |
| Deepgram | ~$5-15 |
| DigitalOcean (Mew) | ~$24 |
| **Total** | ~$44-109/month |

---

## Related Files

- `/opt/professional-receptionist/` on Mew (137.184.235.100)
- GitHub: Built-Simple/professional-receptionist

---
*Professional Receptionist Flux migration: January 14, 2026*
*Documentation updated: January 14, 2026*
