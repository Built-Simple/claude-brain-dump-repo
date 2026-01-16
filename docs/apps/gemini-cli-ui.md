# Gemini CLI Web UI

**Location:** CT 105 (admin-coder-420) on Giratina (192.168.1.100)
**URL:** https://app-gemini.built-simple.ai/
**Local Path:** `/root/Gemini-CLI-UI`
**Port:** Internal (proxied through Cloudflare Tunnel)

---

## Overview

Web-based UI wrapper for Google's Gemini CLI. Provides a chat interface for interacting with Gemini models through a browser instead of terminal.

## Architecture

```
Browser → Cloudflare Tunnel → CT 105 (Node.js Server) → gemini-remote → Giratina (gemini CLI)
```

### Key Files

| File | Purpose |
|------|---------|
| `server/index.js` | Main Express server, WebSocket handling |
| `server/gemini-cli.js` | Spawns Gemini CLI processes, handles I/O |
| `server/gemini-response-handler.js` | Buffers and streams responses to frontend |
| `src/components/ChatInterface.jsx` | React chat UI component |

### gemini-remote Script

The container uses a wrapper script at `/usr/local/bin/gemini-remote`:
```bash
#!/bin/bash
ssh -o StrictHostKeyChecking=no root@192.168.1.100 "gemini $@"
```

This SSHs back to Giratina to run the actual Gemini CLI (which requires Google auth).

---

## Bug Fixes (January 16, 2026)

### 1. Deprecated `--prompt` Flag Error

**Symptom:**
```
Error: Cannot use both a positional prompt and the --prompt (-p) flag together
```

**Root Cause:** Gemini CLI deprecated the `--prompt` flag. Code was using both positional args and `--prompt` when resuming sessions.

**Fix:** Modified `server/gemini-cli.js` to always use positional arguments:
```javascript
// BEFORE (broken):
if (isResuming) {
  args.push('--prompt', finalPromptText);  // Deprecated!
} else {
  args.push(finalPromptText);
}

// AFTER (fixed):
// Always use positional argument for prompts
args.push(finalPromptText);
```

### 2. Truncated/Incomplete Responses

**Symptom:** Only partial responses displayed, or responses cut off mid-sentence.

**Root Cause:** Response handler was sending chunks independently; frontend was adding each chunk as a new message instead of accumulating.

**Fix:** Modified `server/gemini-response-handler.js` to:
- Accumulate full response across all flushes
- Send complete accumulated response each time (not just new chunk)
- Add `isStreaming: true` flag for frontend to detect streaming updates

```javascript
// Key change in flush():
flush() {
  // Send the FULL accumulated response, not just the buffer
  const content = this.fullResponse.trim();

  this.ws.send(JSON.stringify({
    type: 'gemini-response',
    data: {
      type: 'message',
      content: content,  // Full response, not chunk
      isStreaming: true  // Flag for frontend
    }
  }));

  // Clear only buffer, keep fullResponse for accumulation
  this.buffer = '';
}
```

### 3. Duplicate Message Bubbles

**Symptom:** Same response appeared 2-3 times in the chat.

**Root Cause:** Frontend was creating new message for each streaming update instead of replacing.

**Fix:** Modified `src/components/ChatInterface.jsx` to replace last assistant message during streaming:

```javascript
// When isStreaming flag is set, replace last assistant message
if (isStreaming && prev.length > 0) {
  const lastIdx = prev.length - 1;
  if (prev[lastIdx].type === 'assistant' && !prev[lastIdx].isToolUse) {
    const updated = [...prev];
    updated[lastIdx] = {
      type: 'assistant',
      content: messageData.content,
      timestamp: new Date(),
      isStreaming: true
    };
    return updated;
  }
}
```

---

## Maintenance

### Restart Server
```bash
pct exec 105 -- pkill -f "node server/index.js"
pct exec 105 -- bash -c 'cd /root/Gemini-CLI-UI && nohup node server/index.js > server.log 2>&1 &'
```

### Rebuild Frontend
```bash
pct exec 105 -- bash -c 'cd /root/Gemini-CLI-UI && npm run build'
```

### Check Logs
```bash
pct exec 105 -- tail -50 /root/Gemini-CLI-UI/server.log
```

### Test Gemini CLI Directly
```bash
pct exec 105 -- /usr/local/bin/gemini-remote --model gemini-2.5-flash --yolo "Hello"
```

---

## Backup Files

Created during fixes:
- `server/gemini-cli.js.bak`
- `server/gemini-response-handler.js.bak`
- `src/components/ChatInterface.jsx.bak`

---

## Known Limitations

1. **SSH Dependency:** Requires SSH access from CT 105 to Giratina for gemini CLI
2. **Auth:** Gemini CLI auth tokens stored on Giratina, not in container
3. **Latency:** Extra hop through SSH adds slight latency

---

*Last Updated: January 16, 2026*
*Fixes Applied By: Claude Code via Happy*
