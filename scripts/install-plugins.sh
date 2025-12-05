#!/bin/bash
# Install all Claude Code plugins
# Run with: bash install-plugins.sh

set -e

echo "Installing Claude Code plugins..."
echo ""

# Add marketplaces
echo "Adding marketplaces..."
claude plugins marketplace add anthropics/skills || true
claude plugins marketplace add anthropics/claude-code || true
claude plugins marketplace add jeremylongshore/claude-code-plugins || true
claude plugins marketplace add obra/superpowers-marketplace || true

echo ""
echo "Installing plugins..."

# From anthropic-agent-skills
claude plugins install example-skills@anthropic-agent-skills || true

# From superpowers-marketplace
claude plugins install superpowers@superpowers-marketplace || true
claude plugins install superpowers-developing-for-claude-code@superpowers-marketplace || true

# From claude-code-plugins-plus
claude plugins install conversational-api-debugger@claude-code-plugins-plus || true
claude plugins install project-health-auditor@claude-code-plugins-plus || true
claude plugins install hello-world@claude-code-plugins-plus || true
claude plugins install formatter@claude-code-plugins-plus || true
claude plugins install security-agent@claude-code-plugins-plus || true
claude plugins install overnight-dev@claude-code-plugins-plus || true
claude plugins install git-commit-smart@claude-code-plugins-plus || true
claude plugins install ai-ml-engineering-pack@claude-code-plugins-plus || true
claude plugins install fullstack-starter-pack@claude-code-plugins-plus || true
claude plugins install security-pro-pack@claude-code-plugins-plus || true
claude plugins install devops-automation-pack@claude-code-plugins-plus || true
claude plugins install domain-memory-agent@claude-code-plugins-plus || true
claude plugins install design-to-code@claude-code-plugins-plus || true
claude plugins install workflow-orchestrator@claude-code-plugins-plus || true

echo ""
echo "Enabling plugins..."

# Enable all installed plugins
claude plugins enable example-skills@anthropic-agent-skills || true
claude plugins enable superpowers@superpowers-marketplace || true
claude plugins enable superpowers-developing-for-claude-code@superpowers-marketplace || true
claude plugins enable conversational-api-debugger@claude-code-plugins-plus || true
claude plugins enable project-health-auditor@claude-code-plugins-plus || true
claude plugins enable hello-world@claude-code-plugins-plus || true
claude plugins enable formatter@claude-code-plugins-plus || true
claude plugins enable security-agent@claude-code-plugins-plus || true
claude plugins enable overnight-dev@claude-code-plugins-plus || true
claude plugins enable git-commit-smart@claude-code-plugins-plus || true
claude plugins enable ai-ml-engineering-pack@claude-code-plugins-plus || true
claude plugins enable fullstack-starter-pack@claude-code-plugins-plus || true
claude plugins enable security-pro-pack@claude-code-plugins-plus || true
claude plugins enable devops-automation-pack@claude-code-plugins-plus || true
claude plugins enable domain-memory-agent@claude-code-plugins-plus || true
claude plugins enable design-to-code@claude-code-plugins-plus || true
claude plugins enable workflow-orchestrator@claude-code-plugins-plus || true

echo ""
echo "Plugin installation complete!"
echo "Run 'claude plugins list' to see installed plugins."
