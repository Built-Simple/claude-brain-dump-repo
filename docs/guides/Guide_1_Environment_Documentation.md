# ENVIRONMENT DOCUMENTATION

## PURPOSE
Document computer specs/software so AI has context without re-asking.

## WHAT TO CAPTURE

### System
- Hostname, username, OS version
- CPU model/cores, RAM, storage
- Network config (IP, DHCP, adapters)

### Development Tools
- Python version + path + packages
- Node.js version + path + npm version
- Git version + path
- Other languages/runtimes

### Software Inventory
- Dev tools, IDEs
- Browsers
- Productivity apps
- CLI tools

### File Organization
- User directory structure
- Project locations
- Script locations
- Config file locations

## HOW TO GENERATE

Ask Claude:
```
Document my computer environment - specs, installed software, dev tools, file structure
```

Save output to: `~/.claude/MACHINE_PROFILE.md`

## UPDATE TRIGGERS
- New software installed
- Major OS update
- New dev environment setup
- Hardware changes
