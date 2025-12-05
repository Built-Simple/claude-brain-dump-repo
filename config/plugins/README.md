# Claude Code Plugins Configuration

## Overview
Claude Code plugins extend functionality through skills, commands, and integrations. This document covers the plugins currently installed and how to set them up on new machines.

## Plugin Marketplaces

### Installed Marketplaces

| Marketplace | Source | Description |
|-------------|--------|-------------|
| anthropic-agent-skills | `anthropics/skills` | Official Anthropic skills |
| claude-code-plugins | `anthropics/claude-code` | Official Claude Code plugins |
| claude-code-plugins-plus | `jeremylongshore/claude-code-plugins` | Community plugins by Jeremy Longshore |
| superpowers-marketplace | `obra/superpowers-marketplace` | Superpowers skills collection |

### Adding Marketplaces

```bash
# Via Claude Code CLI
claude plugins marketplace add <github-repo>

# Example
claude plugins marketplace add anthropics/skills
claude plugins marketplace add obra/superpowers-marketplace
```

## Currently Enabled Plugins

### From anthropic-agent-skills
- **example-skills** - Example skills demonstrating plugin capabilities

### From superpowers-marketplace
- **superpowers** (v3.4.1) - Core superpowers skills
- **superpowers-developing-for-claude-code** (v0.2.0) - Development helpers

### From claude-code-plugins-plus

#### MCP Plugins
- **conversational-api-debugger** - Debug APIs conversationally
- **project-health-auditor** - Audit project health metrics
- **domain-memory-agent** - Domain-specific memory management
- **design-to-code** - Convert designs to code
- **workflow-orchestrator** - Orchestrate complex workflows

#### Example Plugins
- **hello-world** - Basic example plugin
- **formatter** - Code formatting utilities
- **security-agent** - Security analysis tools

#### Productivity Plugins
- **overnight-dev** - Extended development sessions

#### DevOps Plugins
- **git-commit-smart** - Smart git commit messages

#### Package Plugins
- **ai-ml-engineering-pack** - AI/ML development tools
- **fullstack-starter-pack** - Fullstack development essentials
- **security-pro-pack** - Advanced security tools
- **devops-automation-pack** - DevOps automation tools

## Configuration Files

### settings.json
Location: `~/.claude/settings.json`

```json
{
  "enabledPlugins": {
    "example-skills@anthropic-agent-skills": true,
    "superpowers@superpowers-marketplace": true,
    "git-commit-smart@claude-code-plugins-plus": true
    // ... more plugins
  }
}
```

### settings.local.json
Location: `~/.claude/settings.local.json`

Used for machine-specific settings like permissions:

```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "WebFetch(domain:docs.anthropic.com)"
    ],
    "deny": []
  }
}
```

## Installation on New Machine

### Step 1: Install Claude Code
```bash
npm install -g @anthropic-ai/claude-code
```

### Step 2: Add Marketplaces
```bash
# Add official Anthropic skills
claude plugins marketplace add anthropics/skills

# Add official Claude Code plugins
claude plugins marketplace add anthropics/claude-code

# Add community plugins
claude plugins marketplace add jeremylongshore/claude-code-plugins
claude plugins marketplace add obra/superpowers-marketplace
```

### Step 3: Install Plugins
```bash
# Install specific plugins
claude plugins install example-skills@anthropic-agent-skills
claude plugins install superpowers@superpowers-marketplace
claude plugins install git-commit-smart@claude-code-plugins-plus
# ... repeat for other plugins
```

### Step 4: Enable Plugins
```bash
# Enable installed plugins
claude plugins enable <plugin-name>@<marketplace>
```

### Alternative: Copy Configuration
Copy `settings.json` from this repo to `~/.claude/settings.json` on the new machine, then run:
```bash
claude plugins sync
```

## Plugin Descriptions & Usage

### Superpowers
Advanced skills for coding workflows including:
- Brainstorming assistance
- Test-driven development
- Code review workflows
- Debugging strategies
- Plan execution

**Usage**: Skills are automatically available. Use `/superpowers:brainstorm` for interactive design, etc.

### Git Commit Smart
Generates intelligent, conventional commit messages based on staged changes.

**Usage**: Use `/git-commit-smart:commit-smart` or invoke the skill.

### Project Health Auditor
Analyzes repository health and suggests improvements.

**Usage**: Use `/project-health-auditor:analyze` to run full analysis.

### Security Pro Pack
Advanced security scanning and analysis tools.

**Usage**: Available as skill `security-pro-pack:security-pro-pack`

### AI/ML Engineering Pack
Tools for AI/ML development workflows.

**Usage**: Available as skill `ai-ml-engineering-pack:ai-ml-engineering-pack`

## Troubleshooting

### Plugin Not Loading
1. Check it's enabled in settings.json
2. Verify marketplace is added: `claude plugins marketplace list`
3. Try reinstalling: `claude plugins uninstall <plugin> && claude plugins install <plugin>`

### Permission Errors
Add required permissions to settings.local.json:
```json
{
  "permissions": {
    "allow": ["<permission-pattern>"]
  }
}
```

### Marketplace Not Found
```bash
# Re-add the marketplace
claude plugins marketplace add <repo>

# Update marketplaces
claude plugins marketplace update
```

## Creating Custom Plugins

See the [Claude Code Plugins documentation](https://docs.anthropic.com/claude-code/plugins) for creating custom plugins.

Basic structure:
```
my-plugin/
├── manifest.json
├── skills/
│   └── my-skill.md
└── commands/
    └── my-command.md
```
