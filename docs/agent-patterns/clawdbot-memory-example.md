# MEMORY.md - Long-Term Memory

## About Talon (My Human)

- **Name:** Talon Neely
- **Company:** Built-Simple / Built-Simple.ai
- **Role:** Developer/operator of a homelab Proxmox cluster called "Pallet Town"
- **Timezone:** America/Los_Angeles (PST)
- **Primary Laptop:** LAPTOP-FVRA1DSD (Windows 11), IP 192.168.1.34 when local

---

## Pallet Town Cluster Overview

5-node Proxmox cluster on Starlink internet (192.168.1.x subnet). Pokémon naming theme.

| Node | IP | Role | GPUs |
|------|-----|------|------|
| Giratina | 192.168.1.100 | Primary, Dell R740xd | 2x Tesla T4 (30GB) |
| Talon | 192.168.1.7 | Secondary GPU node | 2x RTX 3090 (48GB) |
| Hoopa | 192.168.1.79 | GPU compute | 3x RTX 3090 + 1x RTX 5090 (104GB) |
| Silvally | 192.168.1.52 | App server | - |
| Victini | 192.168.1.115 | File server, voice | - |

**All SSH:** root / BuiltSimple2025!

---

## Product Ecosystem

### Research APIs (all $29/mo Pro tier)

1. **FixIt API** (fixitapi.built-simple.ai)
   - 18.5M Stack Overflow solutions
   - FTS5 + GPU vector search on Hoopa
   - CT 103 on Giratina

2. **PubMed API** (pubmed.built-simple.ai)
   - 4.48M medical research articles
   - PostgreSQL on Giratina (992GB), Elasticsearch CT 503
   - CT 108 on Giratina

3. **ArXiv API** (arxiv.built-simple.ai)
   - 2.77M research papers
   - GPU FAISS + PostgreSQL
   - CT 122 on Giratina

4. **Wikipedia API** (wikipedia.built-simple.ai)
   - 4.85M Wikipedia articles
   - Hybrid search (vector + BM25)
   - CT 213/214/215 on Hoopa

### SaaS Apps

5. **ReviewMaster Pro** (reviewmaster.built-simple.ai)
   - AI review response generator
   - Production ready, Stripe live
   - CT 313 on Silvally

6. **Buffer Killer** (buffer-killer.built-simple.ai)
   - Social media scheduler (Buffer alternative)
   - Development mode
   - CT 311 on Silvally

7. **MyFit Pro** (myfit.built-simple.ai)
   - Fitness tracking app
   - CT 312 on Silvally

### Voice/AI

8. **AI Receptionists** (Victini)
   - Sarcastic Receptionist (CT 114)
   - Thai Receptionist (CT 116)
   - Twilio + OpenAI + Deepgram + PlayHT

---

## Active Projects/Concerns

- GEO (Generative Engine Optimization) strategy in progress
- llms.txt deployed across all properties
- ArXiv PDF full-text extraction pipeline (32% complete)
- Some health checks failing on CT 108 (PubMed), CT 122 (ArXiv)
- local-lvm storage at 97% on Giratina

---

## First Session: January 28, 2026

- Talon connected via Google Chat
- Just exploring what I can do
- Gave me access to brain-dump documentation
