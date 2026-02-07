# Gemini Explorer Agent

Use Gemini CLI to explore codebases and gather information, saving Claude tokens.

## When to Use This

**USE Gemini for exploration when:**
- Exploring unfamiliar codebases ("what does this project do?")
- Finding files matching criteria ("find all API endpoints")
- Summarizing directory structures
- Reading and summarizing multiple files
- Answering "where is X?" questions
- Initial reconnaissance before detailed work

**DON'T use Gemini when:**
- You need to edit files (Gemini is read-only in plan mode)
- Task requires Claude's specific capabilities
- You already know exactly where to look
- Single file read (just use Read tool directly)

## How to Invoke

```bash
# Basic exploration (YOLO mode auto-approves file reads)
cd /path/to/project && gemini -y -m gemini-2.5-flash -p "YOUR PROMPT"

# For longer explorations, use timeout
cd /path/to/project && timeout 120 gemini -y -m gemini-2.5-flash -p "YOUR PROMPT"
```

## Model Selection

| Model | Use Case | Notes |
|-------|----------|-------|
| `gemini-2.5-flash` | **Default choice** | Smarter than 2.0, reliable capacity |
| `gemini-2.0-flash` | Fallback | Use if 2.5 has issues |
| `gemini-2.5-pro` | DON'T USE | Burns through quota fast |
| `gemini-3-flash-preview` | DON'T USE | Frequently hits capacity limits |

## Rate Limits

The free tier (OAuth personal) has rate limits. If you see:
- "No capacity available" - Model overloaded, will auto-retry
- "You have exhausted your capacity" - Wait a few seconds, it auto-retries

Gemini CLI handles retries automatically with backoff.

## Example Prompts

### Codebase Overview
```bash
gemini -y -m gemini-2.5-flash -p "Give me a high-level overview of this project. What does it do? What's the tech stack?"
```

### Find Specific Code
```bash
gemini -y -m gemini-2.5-flash -p "Find where user authentication is handled in this codebase"
```

### Summarize Structure
```bash
gemini -y -m gemini-2.5-flash -p "List all the API endpoints defined in this project with their HTTP methods"
```

### Understand Dependencies
```bash
gemini -y -m gemini-2.5-flash -p "What external dependencies does this project use? Check package.json or requirements.txt"
```

## Token Economics

Using Gemini for exploration saves Claude tokens because:
1. Gemini reads files and processes them locally
2. Only the summary comes back to Claude
3. A 10-file exploration that would cost 5000+ Claude tokens costs ~100 tokens (just the summary)

**Rule of thumb:** If exploration involves reading >3 files or >500 lines, use Gemini.

## Limitations

- Read-only (use `-y` for YOLO mode, but it still won't write without explicit approval mode)
- Free tier has rate limits (usually ~10-60 requests/minute depending on load)
- Can't access remote URLs or APIs (only local files)
- Context is per-invocation (doesn't remember previous calls)

## Configuration

Gemini is configured at `~/.gemini/settings.json`:
```json
{
  "security": { "auth": { "selectedType": "oauth-personal" } },
  "general": { "previewFeatures": true }
}
```

OAuth credentials cached at `~/.gemini/oauth_creds.json` (auto-refreshes).
