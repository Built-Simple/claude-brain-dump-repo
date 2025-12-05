---
name: mcp-setup
description: MCP server installation and configuration. Use when asked to install, configure, or troubleshoot MCP servers for Claude Code or Claude Desktop.
---

# MCP Setup

MCP server installation, configuration, and troubleshooting.

## Currently Installed

| Server | Package | Purpose |
|--------|---------|---------|
| filesystem | mcp-server-filesystem | File ops in Projects dir |
| postgres | mcp-server-postgres | PostgreSQL queries |
| ssh | ssh-mcp | SSH command execution |
| crawl4ai | crawl4ai-mcp (pip) | Web scraping (free) |
| playwright | @playwright/mcp | Browser automation |

## Config Locations

| Client | File |
|--------|------|
| Claude Code | `~/.claude.json` |
| Claude Desktop | `%APPDATA%\Claude\config.json` |

## Install Commands

```bash
# npm global installs
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-postgres
npm install -g ssh-mcp
npm install -g @playwright/mcp

# Python
pip install crawl4ai-mcp
```

## Claude Code Config (~/.claude.json)

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": ["C:\\Users\\neely\\Projects"]
    },
    "postgres": {
      "command": "mcp-server-postgres",
      "args": ["postgresql://postgres:Password@localhost:5432/postgres"]
    },
    "ssh": {
      "command": "ssh-mcp",
      "args": []
    },
    "crawl4ai": {
      "command": "python",
      "args": ["-m", "crawl4ai_mcp"]
    }
  }
}
```

## Recommended Additional Servers

### High Priority
- **ssh-manager** (@bvisible/mcp-ssh-manager) - 37 tools for SSH management
- **n8n** (@czlonkowski/n8n-mcp) - n8n workflow automation (needs API key)
- **postgres-pro** (@crystaldba/postgres-mcp) - Advanced PostgreSQL features

### Medium Priority
- **git** (@modelcontextprotocol/server-git) - Git operations
- **github** (@modelcontextprotocol/server-github) - GitHub API (needs token)

### Lower Priority
- **fetch** - Web content fetching
- **puppeteer** - Headless browser automation

## Troubleshooting

1. Restart Claude Code after config changes
2. Check `claude --debug` for MCP loading errors
3. Verify package installed: `npm list -g <package>`
4. Test command manually: `mcp-server-filesystem --help`
