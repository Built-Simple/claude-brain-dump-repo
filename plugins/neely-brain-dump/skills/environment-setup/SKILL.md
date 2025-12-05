---
name: environment-setup
description: Full environment setup for new machines. Use when asked to set up environment, install plugins, configure Claude Code, or bootstrap a new machine.
allowed-tools: Bash
---

# Environment Setup

Complete setup instructions for new machines. **Follow this order exactly.**

## Step 1: Install System Dependencies (FIRST)

These must be installed before plugins/MCP servers will work.

### Windows (PowerShell as Admin):
```powershell
# Node.js (required for npx and MCP servers)
winget install OpenJS.NodeJS.LTS

# Python (required for crawl4ai)
winget install Python.Python.3.13

# Git (required for plugin installation)
winget install Git.Git

# uv (required for uvx - Python MCP runner)
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Linux/macOS:
```bash
# Node.js, Python, Git - use your package manager (apt, brew, etc.)

# uv (required for uvx)
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Step 2: Add Marketplaces

```
/plugin marketplace add anthropics/skills
/plugin marketplace add obra/superpowers-marketplace
/plugin marketplace add jeremylongshore/claude-code-plugins
```

## Step 3: Install Plugins

### From anthropic-agent-skills:
```
/plugin install example-skills@anthropic-agent-skills
```

### From superpowers-marketplace:
```
/plugin install superpowers@superpowers-marketplace
/plugin install superpowers-developing-for-claude-code@superpowers-marketplace
```

### From claude-code-plugins-plus:
```
/plugin install conversational-api-debugger@claude-code-plugins-plus
/plugin install project-health-auditor@claude-code-plugins-plus
/plugin install hello-world@claude-code-plugins-plus
/plugin install formatter@claude-code-plugins-plus
/plugin install security-agent@claude-code-plugins-plus
/plugin install overnight-dev@claude-code-plugins-plus
/plugin install git-commit-smart@claude-code-plugins-plus
/plugin install ai-ml-engineering-pack@claude-code-plugins-plus
/plugin install fullstack-starter-pack@claude-code-plugins-plus
/plugin install security-pro-pack@claude-code-plugins-plus
/plugin install devops-automation-pack@claude-code-plugins-plus
/plugin install domain-memory-agent@claude-code-plugins-plus
/plugin install design-to-code@claude-code-plugins-plus
/plugin install workflow-orchestrator@claude-code-plugins-plus
```

## Step 4: Restart Claude Code

Restart Claude Code for plugins and MCP servers to take effect.

## Step 5: Verify

```
/plugin list
/mcp
```

All MCP servers should show as connected.

## Plugin Summary

| Plugin | Purpose |
|--------|---------|
| example-skills | Anthropic's example skills (canvas, artifacts, etc.) |
| superpowers | Debugging, TDD, code review workflows |
| superpowers-developing-for-claude-code | Claude Code plugin development |
| git-commit-smart | AI-powered commit messages |
| security-agent | Security scanning |
| security-pro-pack | Advanced security tools |
| ai-ml-engineering-pack | ML/AI development tools |
| fullstack-starter-pack | Web dev scaffolding |
| devops-automation-pack | CI/CD and infrastructure |
| project-health-auditor | Code health metrics |
| formatter | Code formatting |
| overnight-dev | Long-running task management |
| domain-memory-agent | Domain context persistence |
| design-to-code | Design file to code conversion |
| workflow-orchestrator | Multi-step workflow automation |
