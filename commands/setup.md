---
description: Set up full environment on a new machine (dependencies, marketplaces, plugins)
---

# Setup Command

Set up this machine with all standard tools and plugins. Follow this exact order:

## Step 1: System Dependencies (FIRST)

Check if these are installed, install if missing:

1. **Node.js** - Required for npx and MCP servers
2. **Python** - Required for crawl4ai
3. **Git** - Required for plugin installation
4. **uv** - Required for uvx (Python MCP runner)

On Windows use winget. On Linux/macOS use appropriate package manager.
For uv: `irm https://astral.sh/uv/install.ps1 | iex` (Windows) or `curl -LsSf https://astral.sh/uv/install.sh | sh` (Unix)

Ask before running system installs.

## Step 2: Add Marketplaces

```
/plugin marketplace add anthropics/skills
/plugin marketplace add obra/superpowers-marketplace
/plugin marketplace add jeremylongshore/claude-code-plugins
```

## Step 3: Install Plugins

Install all plugins from the environment-setup skill list.

## Step 4: Restart and Verify

Tell user to restart Claude Code, then verify with:
```
/plugin list
/mcp
```

Use the environment-setup skill for the full plugin list and details.
