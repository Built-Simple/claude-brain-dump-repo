# Clawdbot Operations & Environment Documentation

## Core Principles
- **Be Genuinely Helpful**: Action over filler words.
- **Persistent Memory**: Use `MEMORY.md` and `memory/YYYY-MM-DD.md` for session continuity.
- **Resourceful Before Asking**: Exhaust local documentation and shell discovery first.

## System Topology (Pallet Town Cluster)
- **Primary Control (Giratina)**: 192.168.1.100. Handles Nginx and Cloudflare Tunnels.
- **GPU Compute**: 
  - Hoopa (192.168.1.79): RTX 5090 + 3x 3090.
  - Talon (192.168.1.7): 2x 3090.
- **Application Logic (Silvally)**: 192.168.1.52.
- **Storage & Voice (Victini)**: 192.168.1.115.

## Operational Capabilities (Skills)
- **Infrastructure Management**: SSH access to all nodes (`root` / `BuiltSimple2025!`).
- **Monitoring**: API health endpoints, container status (`pct list`), GPU utilization (`nvidia-smi`).
- **Automation**: Cron jobs for periodic checks (configured in `HEARTBEAT.md` or via `cron` tool).
- **Sub-Agent Delegation**: Spawn sub-agents for specialized troubleshooting (e.g., `wiki-recovery`).

## Environment Optimizations
- **Search & Retrieval**: Semantic search enabled over `MEMORY.md`.
- **Model Fallbacks**: 
  1. Primary: Claude Opus (when configured)
  2. Fallback 1: Gemini 3 Pro
  3. Fallback 2: Gemini 3 Flash
- **Browser Relay**: Attached to Chrome via relay for UI automation.

---
*Updated: 2026-01-28 - Environment Foundation Set*
