# N8N Workflow Automation

**Status:** Running
**Location:** CT 316 on Silvally (192.168.1.52)
**Container IP:** 192.168.1.61
**Port:** 5678
**Version:** 2.4.8

## URLs

| Environment | URL |
|-------------|-----|
| **Production** | https://n8n.built-simple.ai |
| **Internal** | http://192.168.1.61:5678 |

## Infrastructure

### Container Details
- **VMID:** 316
- **Hostname:** n8n
- **OS:** Debian (unprivileged)
- **Resources:** 2 cores, 2GB RAM, 8GB disk
- **Network:** vmbr0, static IP 192.168.1.61/24

### Cloudflare Tunnel
- **Tunnel ID:** 080e5208-a495-4cfc-98a9-ea90076c0363
- **Config:** `/etc/cloudflared/config.yml` on Silvally
- **Ingress:** `n8n.built-simple.ai` → `http://192.168.1.61:5678`

## MCP Integration

The N8N MCP server allows Claude Code to manage workflows programmatically.

### Configuration
- **MCP Server Location:** `/opt/n8n-mcp-server/`
- **Config File:** `~/.claude/plugins/marketplaces/neely-brain-dump-marketplace/plugins/neely-brain-dump/.mcp.json`
- **Auto-initialization:** Enabled via `N8N_HOST` and `N8N_API_KEY` env vars (added Jan 30, 2026)

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `mcp__n8n__list-workflows` | List all workflows |
| `mcp__n8n__create-workflow` | Create a new workflow |
| `mcp__n8n__get-workflow` | Get workflow details by ID |
| `mcp__n8n__update-workflow` | Update an existing workflow |
| `mcp__n8n__delete-workflow` | Delete a workflow |
| `mcp__n8n__activate-workflow` | Activate a workflow |
| `mcp__n8n__deactivate-workflow` | Deactivate a workflow |
| `mcp__n8n__list-executions` | List workflow executions |
| `mcp__n8n__get-execution` | Get execution details |
| `mcp__n8n__create-credential` | Create credentials (API keys only) |
| `mcp__n8n__get-credential-schema` | Get schema for credential type |
| `mcp__n8n__list-tags` | List all tags |
| `mcp__n8n__create-tag` | Create a tag |
| `mcp__n8n__generate-audit` | Generate security audit |

### Usage Notes

1. **Auto-initialization:** MCP server auto-initializes from env vars - no manual `init-n8n` needed
2. **clientId parameter:** Optional on all tools - falls back to default client
3. **OAuth credentials:** Must be created via N8N web UI (OAuth flow requires browser)

### API Key
The API key is stored in `.mcp.json` as a JWT token. To regenerate:
1. Go to https://n8n.built-simple.ai
2. Settings > API > Create new API key
3. Update `N8N_API_KEY` in `.mcp.json`

## Buffer Integration

Buffer uses OAuth2 for authentication, which requires browser interaction.

### Setup Steps
1. Go to https://n8n.built-simple.ai
2. Click **Credentials** in the left sidebar
3. Click **Add Credential**
4. Search for "Buffer" and select **Buffer OAuth2 API**
5. Click **Sign in with Buffer** to authorize
6. Complete OAuth flow in browser
7. Save the credential

### Creating a Buffer Workflow
Once credentials are set up, you can create workflows via MCP:

```
# Example: Create a Buffer posting workflow
mcp__n8n__create-workflow with:
- name: "Buffer Social Post"
- nodes: Schedule Trigger → Buffer (Post)
- connections: link trigger to Buffer node
```

### Buffer Credential Type
- **Type name:** `bufferOAuth2Api`
- **Scopes:** publish (post to social accounts)
- **Required:** OAuth2 browser authorization

## Workflows

### Test Workflow - Created via MCP
- **ID:** `8La5vZFV5Kg2FsrV`
- **Status:** Inactive
- **Created:** January 30, 2026
- **Nodes:** Manual Trigger → Set Test Data

## Quick Commands

```bash
# Check N8N status
ssh root@192.168.1.52 "pct exec 316 -- systemctl status n8n"

# View N8N logs
ssh root@192.168.1.52 "pct exec 316 -- journalctl -u n8n -f"

# Restart N8N
ssh root@192.168.1.52 "pct exec 316 -- systemctl restart n8n"

# Access container shell
ssh root@192.168.1.52 "pct enter 316"

# Test MCP server manually
cd /opt/n8n-mcp-server && N8N_HOST="https://n8n.built-simple.ai" N8N_API_KEY="<key>" node build/index.js

# Rebuild MCP server after changes
cd /opt/n8n-mcp-server && npm run build
```

## Notes

- N8N is a workflow automation tool similar to Zapier
- Installed: January 29, 2026
- MCP integration added: January 30, 2026
- Auto-init feature added: January 30, 2026 (no manual init-n8n required)
- Accessible via Cloudflare tunnel for external access
- Internal access only from Silvally host (container networking)

---
*Created: January 29, 2026*
*Updated: January 30, 2026 - Added MCP integration, auto-init, Buffer setup instructions*
