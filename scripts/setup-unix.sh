#!/bin/bash
# Claude Brain Dump System - Unix/Mac Setup Script
# Run with: bash setup-unix.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}Claude Brain Dump System - Unix/Mac Setup${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# Define paths
CLAUDE_DIR="$HOME/.claude"
CLAUDE_DESKTOP_CONFIG="$HOME/Library/Application Support/Claude/config.json"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}ERROR: Node.js is not installed. Please install Node.js first.${NC}"
    echo -e "${YELLOW}Install with: brew install node (Mac) or apt install nodejs (Linux)${NC}"
    exit 1
fi
echo -e "  ${GREEN}[OK] Node.js: $(node --version)${NC}"

if ! command_exists npm; then
    echo -e "${RED}ERROR: npm is not installed.${NC}"
    exit 1
fi
echo -e "  ${GREEN}[OK] npm: $(npm --version)${NC}"

if ! command_exists git; then
    echo -e "${YELLOW}WARNING: Git is not installed. Some features may not work.${NC}"
else
    echo -e "  ${GREEN}[OK] Git: $(git --version)${NC}"
fi

# Check for Claude Code
if ! command_exists claude; then
    echo -e "${YELLOW}WARNING: Claude Code CLI not found. Installing...${NC}"
    npm install -g @anthropic-ai/claude-code
fi

echo ""
echo -e "${YELLOW}Setting up directory structure...${NC}"

# Create .claude directory structure
directories=(
    "$CLAUDE_DIR"
    "$CLAUDE_DIR/solutions"
    "$CLAUDE_DIR/patterns"
    "$CLAUDE_DIR/projects"
    "$CLAUDE_DIR/snippets"
    "$CLAUDE_DIR/plugins"
)

for dir in "${directories[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        echo -e "  ${GREEN}Created: $dir${NC}"
    else
        echo -e "  Exists: $dir"
    fi
done

# Copy templates
echo ""
echo -e "${YELLOW}Copying templates...${NC}"

if [ -f "$REPO_ROOT/templates/SOLUTION_TEMPLATE.md" ]; then
    cp "$REPO_ROOT/templates/SOLUTION_TEMPLATE.md" "$CLAUDE_DIR/SOLUTION_TEMPLATE.md"
    echo -e "  ${GREEN}Copied: SOLUTION_TEMPLATE.md${NC}"
fi

if [ -f "$REPO_ROOT/templates/MACHINE_PROFILE_TEMPLATE.md" ]; then
    cp "$REPO_ROOT/templates/MACHINE_PROFILE_TEMPLATE.md" "$CLAUDE_DIR/MACHINE_PROFILE_TEMPLATE.md"
    echo -e "  ${GREEN}Copied: MACHINE_PROFILE_TEMPLATE.md${NC}"
fi

# Setup plugins
echo ""
echo -e "${YELLOW}Setting up plugins...${NC}"

# Copy settings.json if it doesn't exist
SETTINGS_EXAMPLE="$REPO_ROOT/config/plugins/settings.json.example"
SETTINGS_DEST="$CLAUDE_DIR/settings.json"

if [ ! -f "$SETTINGS_DEST" ] && [ -f "$SETTINGS_EXAMPLE" ]; then
    cp "$SETTINGS_EXAMPLE" "$SETTINGS_DEST"
    echo -e "  ${GREEN}Created settings.json${NC}"
fi

# Add marketplaces (these would be actual claude commands)
echo -e "  ${YELLOW}Adding plugin marketplaces...${NC}"
MARKETPLACES=(
    "anthropics/skills"
    "anthropics/claude-code"
    "jeremylongshore/claude-code-plugins"
    "obra/superpowers-marketplace"
)

for marketplace in "${MARKETPLACES[@]}"; do
    echo -e "    Adding: $marketplace"
    # Uncomment when claude CLI is available:
    # claude plugins marketplace add "$marketplace" 2>/dev/null || true
done

# Setup MCP servers
echo ""
echo -e "${YELLOW}Setting up MCP servers...${NC}"

# Install Playwright MCP
echo -e "  Installing Playwright MCP server..."
npm install -g @playwright/mcp 2>/dev/null || echo -e "  ${YELLOW}Warning: Could not install @playwright/mcp${NC}"

# Create initial CLAUDE.md if it doesn't exist
CLAUDE_MD="$HOME/CLAUDE.md"
if [ ! -f "$CLAUDE_MD" ]; then
    echo ""
    echo -e "${YELLOW}Creating initial CLAUDE.md...${NC}"
    if [ -f "$REPO_ROOT/templates/CLAUDE.md.template" ]; then
        # Determine OS
        if [[ "$OSTYPE" == "darwin"* ]]; then
            OS_TYPE="Mac"
        else
            OS_TYPE="Linux"
        fi

        TODAY=$(date +%Y-%m-%d)

        sed -e "s|\[PATH\]|$HOME|g" \
            -e "s|\[Windows/Mac/Linux\]|$OS_TYPE|g" \
            -e "s|\[YYYY-MM-DD\]|$TODAY|g" \
            "$REPO_ROOT/templates/CLAUDE.md.template" > "$CLAUDE_MD"

        echo -e "  ${GREEN}Created: $CLAUDE_MD${NC}"
    fi
fi

echo ""
echo -e "${CYAN}============================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Run 'claude' to start Claude Code"
echo "2. Ask Claude to 'document my computer environment'"
echo "3. Start building your brain dump system!"
echo ""
echo "Documentation location: $CLAUDE_DIR"
