# Clawdbot Security Hardening & Prompt Injection Defense

## 1. Input Sanitization & Redaction
- **Sensitive Redaction**: Enabled `redactSensitive: "tools"` in `clawdbot.json` to prevent API keys and credentials from leaking into logs or session histories.
- **Pattern Matching**: Implement `redactPatterns` for PII (emails, phone numbers) using the `gateway.config.patch` tool.

## 2. Execution Sandboxing
- **Sub-Agent Isolation**: Always spawn sub-agents for processing untrusted external data (e.g., web scraped content, user-submitted prompts). Sub-agents run in isolated sessions, limiting the "blast radius" of a successful injection.
- **Tool Access Control**: Use the `tools.deny` list for sub-agents processing external data to prevent them from calling sensitive tools like `edit`, `exec` (host), or `gateway`.

## 3. Defense-in-Depth for Prompt Injection
- **Delimiter Shielding**: Use clear XML or Markdown delimiters (e.g., `<external_data>...</external_data>`) when feeding untrusted content to models.
- **System Prompt Reinforcement**: Regularly update `SOUL.md` and agent system prompts to explicitly ignore instructions within external data blocks.
- **Verification Loop**: Use a "Verifier" agent to check the output of a "Worker" agent for signs of prompt leakage or hijacked instructions before presenting it to the human.

## 4. Operational Security
- **Approval Gates**: Keep `tools.elevated` on `ask` or `on-miss` mode for destructive commands.
- **Session Continuity**: Review `memory/*.md` daily to identify any anomalous behavior patterns.

---
*Status: Initial Hardening Plan Implemented - 2026-01-28*
