---
name: plugin-guide
description: Guide to all installed Claude Code plugins and skills. Use when asking about available skills, what plugins do, or how to invoke them.
---

# Claude Code Plugins & Skills Guide

Comprehensive guide to installed plugins and skills on the cluster.

**Last Updated:** December 5, 2025

---

## Overview

**4 plugin marketplaces** with dozens of skills:

| Marketplace | Focus | Key Plugins |
|-------------|-------|-------------|
| **neely-brain-dump-marketplace** | Infrastructure & context | Database queries, SSH, machine profiles |
| **anthropic-agent-skills** | Document processing | PDF, XLSX, DOCX, PPTX, frontend design |
| **superpowers-marketplace** | Development discipline | TDD, debugging, brainstorming, planning |
| **claude-code-plugins-plus** | Full-stack development | 254 plugins, generators, overnight dev |

---

## Tier 1: Best-in-Class (Highly Recommended)

### neely-brain-dump Skills

**Your infrastructure context - always accurate.**

| Skill | Use When |
|-------|----------|
| `neely-brain-dump:machine-context` | Need hardware/software specs for any cluster node |
| `neely-brain-dump:ssh-management` | Need SSH access, container IPs, tunnel info |
| `neely-brain-dump:databases` | Query PubMed (4.5M), Legal (9.2M), StackOverflow (18.5M), ArXiv (2.8M) |
| `neely-brain-dump:file-search` | Search files across cluster via Elasticsearch |
| `neely-brain-dump:plugin-guide` | This guide - what skills exist and when to use them |

### superpowers Skills

**Enforce disciplined development workflows. Opinionated but effective.**

| Skill | Use When |
|-------|----------|
| `superpowers:brainstorming` | Planning a new feature - forces one question at a time |
| `superpowers:test-driven-development` | Writing any new code - enforces RED-GREEN-REFACTOR |
| `superpowers:systematic-debugging` | Any bug - 4-phase process prevents random fixes |
| `superpowers:writing-plans` | Need implementation roadmap |
| `superpowers:verification-before-completion` | Before marking anything done |

**Key insight:** These are "opinionated by design" - they force discipline. The TDD skill literally says "delete code written before tests."

### example-skills (Anthropic Official)

**Professional document creation and processing.**

| Skill | Use When |
|-------|----------|
| `example-skills:pdf` | Read, create, merge, split, OCR PDFs |
| `example-skills:xlsx` | Excel/spreadsheet work with formulas |
| `example-skills:docx` | Word documents with formatting |
| `example-skills:pptx` | PowerPoint presentations |
| `example-skills:frontend-design` | Building UIs - anti "AI slop" aesthetics |

---

## Tier 2: Useful Specialists

### fullstack-starter-pack

**Generate boilerplate for full-stack apps. 15 plugins.**

| Command | Use When |
|---------|----------|
| `/project-scaffold` | Start a new full-stack project |
| `/express-api-scaffold` | Generate Express.js API |
| `/fastapi-scaffold` | Generate FastAPI backend |
| `/prisma-schema-gen` | Create database schemas |
| `/component-generator` | Generate React components |
| `/auth-setup` | Add JWT/OAuth authentication |

### overnight-dev

**Git hooks that block commits until tests pass - Claude works autonomously overnight.**

Use when: Well-defined, testable task and want Claude to iterate until green.

### Other Useful Skills

| Skill | Use When |
|-------|----------|
| `example-skills:mcp-builder` | Creating new MCP servers |
| `example-skills:skill-creator` | Creating new skills |
| `example-skills:webapp-testing` | Testing web apps with Playwright |
| `example-skills:canvas-design` | Creating visual art/posters |
| `example-skills:algorithmic-art` | Generative art with p5.js |

---

## Tier 3: Specialized / Situational

### Document Skills

| Skill | Notes |
|-------|-------|
| `example-skills:doc-coauthoring` | Structured workflow for writing docs |
| `example-skills:internal-comms` | Templates for status reports, updates |
| `example-skills:brand-guidelines` | Anthropic brand colors/fonts |
| `example-skills:theme-factory` | 10 pre-set themes for artifacts |

### claude-code-plugins-plus Categories

254 plugins across:
- **productivity/** - Taskwarrior, YAML tools, content validators
- **devops/** - CI/CD, Docker, deployment
- **security/** - Security scanning, auditing
- **database/** - Schema tools, query builders
- **ai-ml/** - ML experiment logging, model tools

---

## Known Issues

### Broken Plugins (Don't Use)

| Plugin | Issue |
|--------|-------|
| `formatter@claude-code-plugins-plus` | Duplicate hooks file error |
| `security-agent@claude-code-plugins-plus` | Invalid manifest |
| `design-to-code@claude-code-plugins-plus` | Invalid manifest |

---

## Recommendations by Task

### Infrastructure Work
```
neely-brain-dump:machine-context  (hardware/software context)
neely-brain-dump:ssh-management   (access and IPs)
neely-brain-dump:file-search      (find files across cluster)
neely-brain-dump:databases        (query 377GB of data)
```

### Development Work
```
superpowers:brainstorming         (design before code)
superpowers:test-driven-development (write tests first)
superpowers:systematic-debugging  (debug methodically)
```

### Document Work
```
example-skills:pdf                (PDF manipulation)
example-skills:xlsx               (spreadsheets with formulas)
example-skills:docx               (Word documents)
```

### Building Apps
```
fullstack-starter-pack commands   (scaffolding)
example-skills:frontend-design    (creative UIs)
overnight-dev                     (autonomous TDD)
```

---

## Quick Reference: Invoking Skills

```bash
# Invoke a skill (loads the full documentation)
Skill("neely-brain-dump:databases")
Skill("superpowers:brainstorming")
Skill("example-skills:pdf")

# Run slash commands
/superpowers:brainstorm      # Interactive design session
/superpowers:write-plan      # Create implementation plan
/overnight-setup             # Set up overnight dev hooks
/project-scaffold            # Generate full-stack project
```

---

## Skill Philosophy Summary

| Marketplace | Philosophy |
|-------------|------------|
| **neely-brain-dump** | "Know your infrastructure" - rich context about YOUR setup |
| **superpowers** | "Discipline beats talent" - rigid workflows that prevent mistakes |
| **example-skills** | "Do it right" - professional-grade document/code handling |
| **plugins-plus** | "Don't reinvent" - generators and boilerplate for common tasks |

---

## Maintenance Notes

- Skills load from markdown files - can be updated without reinstalling
- neely-brain-dump skills reference YOUR actual infrastructure - keep current
- superpowers skills evolve - always run current version
- Some plugins in claude-code-plugins-plus have manifest errors
