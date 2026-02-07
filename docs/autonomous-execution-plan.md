# Autonomous Execution Plan

## Goal
Continuously work on monetizing Built-Simple.ai products with minimal human intervention.

## Resources Available

### Models
- **Primary**: Claude Opus 4.5 (current)
- **Fallback**: Claude Sonnet 4.5, Haiku
- **Gemini**: google-gemini-cli-auth plugin enabled (no rate limits)
- **Local Coding**: qwen2.5-coder:14b on Hoopa (GPU, needs testing)

### Infrastructure
- 5-node Proxmox cluster (Giratina, Hoopa, Talon, Silvally, Victini)
- Voice AI capabilities (Twilio + Deepgram)
- Web search (Brave API)
- Sub-agent spawning (up to 8 concurrent)

### Products to Monetize
1. **Research APIs** (already built)
   - PubMed semantic search
   - ArXiv semantic search  
   - Wikipedia semantic search
   - FixIt (repair data, 18M+ records, $29/mo tier)

2. **SDK/Plugins** (PyPI packages published)
   - dspy-builtsimple
   - instructor-builtsimple
   - semantickernel-builtsimple
   - vercel-ai-builtsimple

## Plugin Opportunities (Priority Order)

### Tier 1 - High Impact
1. **Obsidian Plugin** - 1M+ users, researchers love it
   - Search notes with PubMed/ArXiv context
   - Auto-cite from research
   - Sidebar research assistant
   
2. **VSCode Extension** - Developers need research
   - Inline documentation from Wikipedia
   - ArXiv paper lookup for ML code
   - FixIt lookup for debugging

3. **Raycast Extension** - Mac power users
   - Quick research lookup
   - Citation generation

### Tier 2 - Niche but Valuable  
4. **Zotero Plugin** - Academic users
5. **Logseq Plugin** - Open source PKM
6. **Chrome Extension** - Highlight-to-research

## Execution Strategy

### Phase 1: Obsidian Plugin (This Week)
1. Research Obsidian plugin architecture
2. Build MVP with PubMed search
3. Add ArXiv integration
4. Publish to community plugins

### Phase 2: VSCode Extension (Next Week)
1. Research VSCode extension API
2. Build inline research features
3. Publish to marketplace

### Phase 3: Raycast + Browser (Following Week)
1. Raycast extension
2. Chrome extension for highlight-to-research

## Autonomous Workflow

### Daily Cron Tasks
- [ ] Check GitHub issues on published packages
- [ ] Monitor API health
- [ ] Check Moltbook for engagement

### Heartbeat Tasks
- Build plugin features incrementally
- Test and iterate
- Push updates to repos

### Sub-Agent Pattern
1. **Research Agent**: Gather plugin requirements/docs
2. **Coding Agent**: Write plugin code (use local model when possible)
3. **Review Agent**: Test and validate
4. **Deploy Agent**: Publish updates

## What I Need

1. **Gemini model access** for sub-agents (cost-efficient bulk work)
2. **Local coding model working** (qwen2.5-coder on Hoopa)
3. **GitHub repos** for plugins
4. **Obsidian test vault** for development

## Next Actions
1. Fix local coding model on Hoopa
2. Configure Gemini for sub-agent spawning
3. Create obsidian-builtsimple repo
4. Research Obsidian plugin API
5. Build MVP
