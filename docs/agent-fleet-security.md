# Agent Fleet Security Architecture

## Credential Tiers

### Tier 1: INTERNAL ONLY (High Trust)
**Exposure:** Never faces external input. Only Talon's direct messages.
**Credentials:** Everything

| Credential | Purpose |
|------------|---------|
| SSH root (all nodes) | Cluster management |
| Cloudflare DNS tokens | Infrastructure |
| PyPI token | Package publishing |
| npm token (if added) | Package publishing |
| Database passwords | Data access |
| OAuth secrets | Service auth |

**Agents in this tier:**
- `main` - Primary assistant (me, in direct chat with Talon)
- `cluster-ops` - Infrastructure management
- `deploy` - Build and deployment tasks

**Protection:** These agents ONLY respond to authenticated sessions from Talon. No external channels, no group chats, no public APIs.

---

### Tier 2: SEMI-TRUSTED (Medium Trust)
**Exposure:** May process external content but with human review.
**Credentials:** API keys for specific services, no infrastructure access

| Credential | Purpose |
|------------|---------|
| Research API keys | PubMed, ArXiv, Wikipedia |
| Moltbook API key | Social posting |
| Email API (Resend) | Sending only |
| Analytics tokens (read-only) | Dashboards |

**Agents in this tier:**
- `moltbook-agent` - Social media engagement (external content exposure)
- `research-agent` - Searches external APIs, processes papers
- `email-agent` - Drafts and sends emails (human approval required)
- `content-agent` - Blog posts, documentation

**Protection:** 
- No SSH access
- No Cloudflare/DNS access
- No publishing credentials
- Output review before external actions

---

### Tier 3: PUBLIC-FACING (Low Trust)
**Exposure:** Direct external input (customer chat, public APIs, Discord/Slack bots)
**Credentials:** NONE or single-purpose tokens only

| Credential | Purpose |
|------------|---------|
| Read-only API tokens | Limited query access |
| Webhook URLs | Inbound only |

**Agents in this tier:**
- `support-bot` - Customer-facing chat
- `discord-bot` - Public Discord server
- `demo-agent` - Product demos
- `webhook-handler` - Processes inbound webhooks

**Protection:**
- Zero infrastructure credentials
- Zero publishing credentials  
- Cannot access TOOLS.md or credential files
- Sandboxed execution environment
- All external actions require Tier 2+ approval

---

## Agent Definitions

### Tier 1 Agents

```yaml
# main (already exists - that's me)
agent: main
tier: 1
channels: [googlechat-talon]
credentials:
  - ssh-cluster
  - cloudflare
  - pypi
  - all-internal

# cluster-ops
agent: cluster-ops  
tier: 1
purpose: Infrastructure management, container ops, monitoring
channels: [internal-only]
credentials:
  - ssh-cluster
  - cloudflare
  - proxmox-api
tasks:
  - Health checks
  - Container management
  - DNS updates
  - Certificate renewal

# deploy
agent: deploy
tier: 1
purpose: Build pipelines, package publishing
channels: [internal-only]
credentials:
  - ssh-cluster
  - pypi
  - npm
  - github
tasks:
  - Build packages
  - Run tests
  - Publish to registries
  - Deploy containers
```

### Tier 2 Agents

```yaml
# moltbook-agent
agent: moltbook-agent
tier: 2
purpose: Social engagement on Moltbook
channels: [cron-triggered, internal-only]
credentials:
  - moltbook-api-key
credentials_denied:
  - ssh-*
  - cloudflare
  - pypi
  - npm
tasks:
  - Browse Moltbook feed
  - Post content (from approved drafts)
  - Comment on posts
  - Monitor mentions
risks:
  - Processes external content (other agents' posts)
  - Could be prompt-injected via post content
mitigation:
  - No infrastructure credentials
  - Output reviewed before posting

# research-agent
agent: research-agent
tier: 2
purpose: Scientific literature research
channels: [internal-spawned]
credentials:
  - pubmed-api
  - arxiv-api
  - wikipedia-api
credentials_denied:
  - ssh-*
  - cloudflare
  - pypi
tasks:
  - Search research APIs
  - Summarize papers
  - Build bibliographies
risks:
  - Processes external content (paper abstracts, titles)
  - Could be prompt-injected via malicious paper metadata
mitigation:
  - Read-only API access
  - No write credentials

# email-agent
agent: email-agent
tier: 2
purpose: Draft and send emails
channels: [internal-spawned]
credentials:
  - resend-api-key
credentials_denied:
  - ssh-*
  - cloudflare
  - pypi
tasks:
  - Draft outreach emails
  - Send with human approval
  - Respond to inbound (with review)
risks:
  - Outbound communication (reputation risk)
  - Could leak info in email content
mitigation:
  - Human approval before send
  - No infrastructure credentials
```

### Tier 3 Agents

```yaml
# support-bot
agent: support-bot
tier: 3
purpose: Customer-facing support chat
channels: [public-widget, discord-support]
credentials: []
credentials_denied: [ALL]
tasks:
  - Answer product questions
  - Direct to documentation
  - Escalate to human
risks:
  - Direct prompt injection from public
  - Impersonation attempts
mitigation:
  - ZERO credentials
  - Cannot access internal files
  - Sandboxed environment
  - Rate limited
  - All escalations logged

# demo-agent
agent: demo-agent
tier: 3
purpose: Product demonstrations
channels: [demo-environment]
credentials:
  - demo-api-key (limited, monitored)
credentials_denied: [ALL-PRODUCTION]
tasks:
  - Show API capabilities
  - Interactive demos
risks:
  - Public interaction
  - Abuse for free API access
mitigation:
  - Demo-only credentials (rate limited)
  - No production access
  - Session recording
```

---

## Implementation Checklist

### Phase 1: Credential Isolation
- [ ] Move all credentials out of TOOLS.md
- [ ] Create per-tier credential files
- [ ] Set up SSH key auth (no passwords)
- [ ] Create environment variable configs per tier

### Phase 2: Agent Configs
- [ ] Create Clawdbot agent configs for each tier
- [ ] Set up channel restrictions
- [ ] Implement credential injection per agent
- [ ] Test tier isolation

### Phase 3: Spawn Rules
- [ ] Define which agents can spawn which
- [ ] Tier 3 cannot spawn Tier 1/2
- [ ] Tier 2 can spawn Tier 3 only
- [ ] Tier 1 can spawn any

### Phase 4: Monitoring
- [ ] Log all credential access
- [ ] Alert on Tier 3 attempting credential access
- [ ] Output scanning for credential patterns
- [ ] Regular audit of agent permissions

---

## Quick Reference

| Agent | Tier | SSH | Cloudflare | PyPI | APIs | External Input |
|-------|------|-----|------------|------|------|----------------|
| main | 1 | ✅ | ✅ | ✅ | ✅ | ❌ |
| cluster-ops | 1 | ✅ | ✅ | ❌ | ❌ | ❌ |
| deploy | 1 | ✅ | ❌ | ✅ | ❌ | ❌ |
| moltbook-agent | 2 | ❌ | ❌ | ❌ | ✅ | ⚠️ |
| research-agent | 2 | ❌ | ❌ | ❌ | ✅ | ⚠️ |
| email-agent | 2 | ❌ | ❌ | ❌ | ✅ | ⚠️ |
| support-bot | 3 | ❌ | ❌ | ❌ | ❌ | ✅ |
| demo-agent | 3 | ❌ | ❌ | ❌ | 🔒 | ✅ |

Legend: ✅ = Has access | ❌ = No access | ⚠️ = Limited external exposure | 🔒 = Demo/limited only
