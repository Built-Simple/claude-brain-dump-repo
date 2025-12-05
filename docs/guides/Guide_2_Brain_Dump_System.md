# BRAIN DUMP SYSTEM

## PURPOSE
Persistent memory across Claude sessions. Store solutions, patterns, preferences.

## STRUCTURE

```
~/.claude/
├── CLAUDE.md or MACHINE_PROFILE.md  # Auto-loaded context
├── solutions/                        # Problem/solution docs
├── patterns/                         # Reusable approaches
├── projects/                         # Project-specific notes
└── snippets/                         # Code snippets
```

User home also reads:
- `~/CLAUDE.md`
- Project-level `CLAUDE.md`

## WHAT TO STORE

### Solutions
- Problem description
- Solution steps
- Code snippets
- Why it works
- Keywords for search

### Patterns
- Reusable code patterns
- Error handling approaches
- Project structure templates

### Preferences
- Coding style preferences
- Tool preferences
- Documentation style

### Environment
- Machine profile
- Installed tools
- Project locations

## PROMPTS

**Save solution:**
```
Save this solution to the brain dump
```

**Document pattern:**
```
Add this pattern to the brain dump
```

**Update context:**
```
Update CLAUDE.md with [new info]
```

## TEMPLATE

See `templates/SOLUTION_TEMPLATE.md` for solution documentation format.
