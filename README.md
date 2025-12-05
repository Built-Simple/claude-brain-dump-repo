# CLAUDE BRAIN DUMP SYSTEM

Cross-machine portable configuration for Claude Code. Contains environment docs, plugin configs, MCP servers, and host inventory.

## QUICK DEPLOY

### Windows
```powershell
git clone [repo-url]
powershell -ExecutionPolicy Bypass -File scripts/setup-windows.ps1
```

### Unix/Mac
```bash
git clone [repo-url]
bash scripts/setup-unix.sh
```

## STRUCTURE

```
├── HOSTS.md                 # Network hosts, IPs, SSH creds
├── config/
│   ├── mcp-servers/         # MCP server configs
│   └── plugins/             # Plugin settings, marketplaces
├── docs/
│   ├── frameworks/          # AI code documentation system
│   └── guides/              # Brain dump methodology
├── machine-profiles/        # Per-machine environment docs
├── scripts/                 # Setup automation
└── templates/               # CLAUDE.md, solution templates
```

## KEY FILES

| File | Purpose |
|------|---------|
| `HOSTS.md` | All network hosts, IPs, SSH credentials |
| `config/plugins/settings.json.example` | Plugin enable/disable |
| `config/plugins/known_marketplaces.json.example` | Marketplace sources |
| `config/mcp-servers/claude_desktop_config.json.example` | MCP config |
| `templates/CLAUDE.md.template` | Brain dump init template |

## PLUGINS (17 enabled)

### Marketplaces
- `anthropics/skills`
- `anthropics/claude-code`
- `jeremylongshore/claude-code-plugins`
- `obra/superpowers-marketplace`

### Active Plugins
- superpowers, superpowers-developing-for-claude-code
- git-commit-smart, project-health-auditor
- ai-ml-engineering-pack, security-pro-pack
- devops-automation-pack, fullstack-starter-pack
- domain-memory-agent, workflow-orchestrator
- design-to-code, conversational-api-debugger
- formatter, security-agent, overnight-dev, hello-world

## MCP SERVERS

### Playwright
```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["[npm-global]/node_modules/@playwright/mcp/dist/index.js"]
    }
  }
}
```

## PRIMARY SSH TARGET

```
Host: 192.168.1.115
User: root
Pass: BuiltSimple2025!
```

## CONFIG LOCATIONS

| Platform | Claude Code Config | Claude Desktop Config |
|----------|-------------------|----------------------|
| Windows | `%USERPROFILE%\.claude\` | `%APPDATA%\Claude\config.json` |
| Mac | `~/.claude/` | `~/Library/Application Support/Claude/config.json` |
| Linux | `~/.claude/` | `~/.config/Claude/config.json` |
