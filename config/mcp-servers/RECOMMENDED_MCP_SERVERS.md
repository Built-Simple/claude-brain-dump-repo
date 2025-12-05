# RECOMMENDED MCP SERVERS

Based on your workflow: web scraping, SSH to multiple servers, PostgreSQL, n8n automation, browser automation.

## HIGH PRIORITY

### 1. SSH Manager MCP
**Why**: You SSH into 20+ machines. This lets Claude manage connections directly.

**Repo**: [bvisible/mcp-ssh-manager](https://github.com/bvisible/mcp-ssh-manager)
- 37 tools for remote SSH management
- Session management, file transfer, database ops
- DevOps automation, backups, health monitoring

**Config**:
```json
{
  "mcpServers": {
    "ssh-manager": {
      "command": "npx",
      "args": ["-y", "@bvisible/mcp-ssh-manager"]
    }
  }
}
```

**Alternative**: [tufantunc/ssh-mcp](https://github.com/tufantunc/ssh-mcp) - simpler, just command execution

---

### 2. n8n MCP
**Why**: You run n8n.built-simple.ai. Build/manage workflows via Claude.

**Repo**: [czlonkowski/n8n-mcp](https://github.com/czlonkowski/n8n-mcp)
- 525+ n8n nodes with 99% property coverage
- Smart node search, config validation
- AI workflow validation

**Config**:
```json
{
  "mcpServers": {
    "n8n": {
      "command": "npx",
      "args": ["-y", "@czlonkowski/n8n-mcp"],
      "env": {
        "N8N_API_URL": "https://n8n.built-simple.ai/api/v1",
        "N8N_API_KEY": "your-api-key"
      }
    }
  }
}
```

---

### 3. PostgreSQL MCP
**Why**: You have PostgreSQL 17 locally + likely on servers. Query via Claude.

**Repo**: [crystaldba/postgres-mcp](https://github.com/crystaldba/postgres-mcp) (Postgres MCP Pro)
- Read/write access (configurable)
- Performance analysis, execution plans
- Schema exploration

**Config**:
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@crystaldba/postgres-mcp"],
      "env": {
        "DATABASE_URL": "postgresql://postgres:Password@localhost:5432/fitness_app"
      }
    }
  }
}
```

---

### 4. Firecrawl MCP (Web Scraping)
**Why**: You do web scraping. This adds AI-powered scraping to Claude.

**Repo**: [firecrawl/firecrawl-mcp-server](https://github.com/firecrawl/firecrawl-mcp-server)
- Web scraping and search
- Works with Cursor, Claude, any LLM client
- Handles JavaScript-heavy sites

**Config**:
```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "your-api-key"
      }
    }
  }
}
```

**Alternative (no API key)**: [MaitreyaM/WEB-SCRAPING-MCP](https://github.com/MaitreyaM/WEB-SCRAPING-MCP) - uses crawl4ai, self-hosted

---

## MEDIUM PRIORITY

### 5. Filesystem MCP (Enhanced)
**Why**: Better file ops than built-in, with security controls.

**Repo**: [modelcontextprotocol/servers/filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)
- Read/write/search files
- Directory traversal protection
- Reference projects (read-only access to other codebases)

**Config**:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\neely\\Projects"]
    }
  }
}
```

---

### 6. Git MCP
**Why**: Git operations via Claude without CLI.

**Repo**: [modelcontextprotocol/servers/git](https://github.com/modelcontextprotocol/servers)
- Read, search, manipulate Git repos
- Commit history, diffs, branches

**Config**:
```json
{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"]
    }
  }
}
```

---

### 7. GitHub MCP
**Why**: Manage repos, PRs, issues directly.

**Repo**: Official GitHub MCP
- Create/manage repos
- PRs, issues, code review
- Actions/workflows

**Config**:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "your-token"
      }
    }
  }
}
```

---

## LOWER PRIORITY (Nice to Have)

### 8. Fetch MCP
**Why**: Clean web content fetching for research.

**Repo**: [modelcontextprotocol/servers/fetch](https://github.com/modelcontextprotocol/servers)
- Fetches web content
- Converts to LLM-friendly format

---

### 9. Browser Use MCP
**Why**: Full browser control via natural language.

**Repo**: [browser-use/browser-use](https://github.com/browser-use/browser-use)
- Natural language browser control
- Form filling, navigation, extraction

---

### 10. Puppeteer MCP
**Why**: Headless browser automation.

**Repo**: [modelcontextprotocol/server-puppeteer](https://github.com/modelcontextprotocol/servers)
- Screenshots, PDF generation
- Form automation
- Dynamic content scraping

---

## FULL CONFIG EXAMPLES

### Claude Code (`~/.claude.json`):

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

### Claude Desktop (`%APPDATA%\Claude\config.json`):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": ["C:\\Users\\neely\\AppData\\Roaming\\npm\\node_modules\\@playwright\\mcp\\dist\\index.js"]
    },
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

## INSTALL COMMANDS

```bash
# Install globally (optional, npx works without)
npm install -g @bvisible/mcp-ssh-manager
npm install -g @czlonkowski/n8n-mcp
npm install -g @crystaldba/postgres-mcp
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-git
npm install -g firecrawl-mcp
```

## SOURCES

- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
- [Official MCP Servers](https://github.com/modelcontextprotocol/servers)
- [MCP Servers Directory](https://mcpservers.org)
- [Top MCP Servers 2025](https://www.pomerium.com/blog/best-model-context-protocol-mcp-servers-in-2025)
