# MCP Servers Configuration

## Overview
MCP (Model Context Protocol) servers extend Claude's capabilities by allowing it to interact with external tools and services.

## Currently Installed MCP Servers

### Playwright MCP Server
- **Purpose**: Browser automation and web testing
- **Command**: `node`
- **Args**: `C:\Users\neely\AppData\Roaming\npm\node_modules\@playwright\mcp\dist\index.js`

## Configuration Location
- **Claude Desktop**: `%APPDATA%\Claude\config.json`
- **Claude Code**: `.claude/settings.json` or project-level `.mcp.json`

## Installation Instructions

### Prerequisites
- Node.js installed (v18+)
- npm available in PATH

### Installing Playwright MCP Server

```bash
# Install globally via npm
npm install -g @playwright/mcp

# Or install locally in a project
npm install @playwright/mcp
```

### Adding to Claude Desktop Config

Edit `%APPDATA%\Claude\config.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": [
        "C:\\Users\\[username]\\AppData\\Roaming\\npm\\node_modules\\@playwright\\mcp\\dist\\index.js"
      ]
    }
  }
}
```

### Adding to Claude Code Config

Create or edit `.mcp.json` in your project root:

```json
{
  "servers": {
    "playwright": {
      "command": "node",
      "args": ["./node_modules/@playwright/mcp/dist/index.js"]
    }
  }
}
```

## Available MCP Servers to Consider

### Official Anthropic Servers
- `@anthropic/mcp-server-filesystem` - File system operations
- `@anthropic/mcp-server-git` - Git operations
- `@anthropic/mcp-server-sqlite` - SQLite database operations

### Community Servers
- `@playwright/mcp` - Browser automation
- Various community contributions on GitHub

## Creating Custom MCP Servers

See the MCP documentation at https://modelcontextprotocol.io for creating custom servers.

## Troubleshooting

### Server Not Starting
1. Check Node.js is installed: `node --version`
2. Verify the path to the server script exists
3. Check Claude logs for errors

### Permission Issues
- Ensure the user has execute permissions on the server script
- On Windows, check Windows Defender isn't blocking execution

## Cross-Machine Setup

When setting up on a new machine:

1. Install Node.js
2. Install required npm packages globally
3. Copy or recreate the config.json with correct paths
4. Restart Claude Desktop/Code
