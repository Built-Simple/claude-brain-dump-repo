# Claude Code Build-Time Documentation System

## Real-Time Development + Documentation Workflow
Use this with Claude Code as you build new features or modify existing code

---

## INITIAL SETUP PROMPT

```
I'm building/modifying [feature/component name]. As I write code, I need you to:

1. Track every dependency I create in real-time
2. Alert me to potential issues (circular deps, too many dependencies, etc.)
3. Maintain a running dependency map for each file
4. Update the documentation block after each significant change
5. Suggest refactoring when dependency chains get complex

Let's start with [what you're building].
```

---

## AS YOU START A NEW FILE

### Prompt:
```
I'm creating a new file: [filename]

This file will:
- [primary purpose]
- [what it's responsible for]
- [what feature it's part of]

Before I write any code, create the initial dependency map structure for this file and help me think through:
1. What will this likely depend on?
2. What might depend on this?
3. What side effects should I track?
4. What could go wrong?
```

### Claude Code Should Respond With:
```javascript
// [filename]

// [actual code will go here]

/* ============================================================================
 * DEPENDENCY MAP FOR: [filename]
 * ============================================================================
 *
 * @module [module-name]
 * @criticality [TBD - will assess as we build]
 * @owner [your-name/team]
 * @created [today's date]
 * @status UNDER_DEVELOPMENT
 *
 * PURPOSE:
 * --------
 * [Initial purpose statement - will expand]
 *
 * PLANNED DEPENDENCIES:
 * --------------------
 * - Will need: [predicted dependencies]
 * - Might need: [possible dependencies]
 *
 * EXPECTED DEPENDENTS:
 * -------------------
 * - Will be used by: [predicted dependents]
 *
 * DESIGN DECISIONS:
 * -----------------
 * - [Track key decisions as you make them]
 *
 * ============================================================================ */
```

---

## AS YOU ADD EACH FUNCTION

### Prompt:
```
Adding new function: [function_name]
- Purpose: [what it does]
- Takes: [inputs]
- Returns: [output]
- Needs to: [requirements]
```

### Claude Code Should:

1. **Immediately document the function:**
```javascript
/**
 * @function [function_name]
 * @purpose [clear description]
 * @deps [track as we add them]
 * @affects [track as we identify them]
 * @status IMPLEMENTING
 */
function functionName(params) {
  // Implementation
}
```

2. **Update the file's dependency map with:**
- New dependencies this function introduces
- Side effects it creates
- Error cases to handle
- Performance implications

---

## AS YOU ADD DEPENDENCIES

### Prompt Templates:

**When importing something:**
```
I'm importing [module/function] from [source] because [reason]
```

**When making a database call:**
```
This function needs to [read/write] the [table_name] table to [purpose]
```

**When calling an API:**
```
This needs to call [service]'s [endpoint] to [purpose]
```

**When adding side effects:**
```
This will also [side effect] when [condition]
```

### Claude Code Should:

1. **Add inline comment at the point of use:**
```javascript
// DEPENDENCY: [module].[function] - [why needed]
const result = await dependency.function();

// SIDE EFFECT: Writes to [target]
await logger.log(result);

// DB OPERATION: Reads [table].[columns]
const user = await db.query('SELECT * FROM users WHERE id = ?');
```

2. **Update the dependency map section:**
```javascript
/*
 * DEPENDENCIES:
 * - [NEW] module.function - [purpose] - Added [date]
 */
```

---

## WHEN YOU HIT COMPLEXITY

### Prompt:
```
This function/module is getting complex. Should I refactor?
Current dependencies: [list them]
Current responsibilities: [list them]
```

### Claude Code Will Analyze:
- Coupling level (too many dependencies?)
- Cohesion (doing too many things?)
- Circular dependency risks
- Testability concerns
- Performance implications

### Refactoring Suggestions:
```javascript
// REFACTOR CANDIDATE: High coupling detected
// This module depends on 12+ other modules
// Consider:
// 1. Extract [specific functionality] to separate service
// 2. Use dependency injection for [these 3 dependencies]
// 3. Create facade pattern for [external service calls]
```

---

## WHEN YOU HIT ERRORS

### Prompt:
```
Error occurred: [error message]
Context: [what you were doing]
This might affect: [what you think breaks]
```

### Claude Code Should:
1. Document the error scenario
2. Add error handling
3. Update affected dependencies
4. Add to FAILURE MODES section

```javascript
// ERROR SCENARIO DISCOVERED: [description]
// Occurs when: [conditions]
// Fix: [how we handle it]
// Prevents: [what bad thing we avoid]
try {
    // risky operation
} catch (error) {
    // FAILURE RECOVERY: [what we do]
    // Fallback to: [alternative approach]
}
```

---

## AS YOU REFACTOR

### Prompt:
```
Refactoring [component] because [reason]
Current structure: [brief description]
New structure: [what you're changing to]
```

### Claude Code Should:
1. Update all dependency maps
2. Mark deprecated patterns
3. Document migration path
4. Identify breaking changes

```javascript
// REFACTOR: [date] - [reason]
// OLD: [previous approach]
// NEW: [current approach]
// BREAKING: [what this breaks]
// MIGRATION: [how to update dependents]
```

---

## WHEN YOU COMPLETE A FEATURE

### Prompt:
```
Feature complete: [feature name]
Let's finalize the documentation.
```

### Claude Code Should:
1. Review all dependency maps
2. Ensure all functions documented
3. Verify error handling documented
4. Check for undocumented side effects
5. Create summary of critical paths

### Final Documentation Update:
```javascript
/*
 * @status COMPLETE
 * @tested YES
 * @reviewed [date]
 *
 * FINAL NOTES:
 * - [Key things to remember]
 * - [Gotchas discovered during development]
 * - [Future improvements identified]
 */
```

---

## PERIODIC REVIEW PROMPTS

### Weekly:
```
Review this module's documentation:
- Are all dependencies still accurate?
- Any new failure modes discovered?
- Any performance issues found?
- Any security concerns identified?
```

### Before Major Changes:
```
I'm about to modify [component].
Analyze impact on all dependents.
What documentation needs updating?
```

### Before Deployment:
```
Pre-deployment check:
- Verify all critical paths documented
- Ensure error handling complete
- Confirm breaking changes noted
- Check security notes updated
```

---

## QUICK REFERENCE COMMANDS

### Copy-Paste Ready Prompts:

**Starting New Feature:**
```
Starting new feature: [name]. Use build-time documentation. Track all dependencies.
```

**Adding Complex Logic:**
```
Adding business logic for [feature]. Document the rules and why they exist.
```

**Integrating External Service:**
```
Integrating [service name]. Document endpoints, auth, rate limits, and failure modes.
```

**Performance Optimization:**
```
Optimizing [component]. Document current bottleneck, improvement, and measurements.
```

**Bug Fix:**
```
Fixing bug: [description]. Document root cause and prevention for future.
```

**Security Update:**
```
Security fix for [issue]. Document vulnerability, fix, and validation.
```

---

## DOCUMENTATION QUALITY CHECKLIST

Every code change should answer:

- [ ] Why does this exist?
- [ ] What does it depend on?
- [ ] What depends on it?
- [ ] What can go wrong?
- [ ] How do we recover from failures?
- [ ] What are the performance implications?
- [ ] What security concerns exist?
- [ ] What tests cover this?
- [ ] What monitoring watches this?
- [ ] What would break if changed?

---

## CRITICAL MOMENTS TO DOCUMENT

### Always Document When:

**Making trade-offs**
```
Choosing X over Y because [reason]. Revisit when [condition].
```

**Working around issues**
```
Temporary fix for [issue]. Remove after [condition].
```

**Implementing business rules**
```
Business requirement: [rule]. Source: [who decided]. Critical: [yes/no].
```

**Adding technical debt**
```
Quick solution due to [constraint]. Proper fix: [description]. Priority: [level].
```

**Discovering gotchas**
```
Unexpected behavior: [what]. Occurs when: [condition]. Workaround: [solution].
```

---

## CONVERSATION FLOW EXAMPLE

```
You: "Creating payment processing service"
Claude: *Creates file with initial dependency structure*

You: "Need to import stripe library"
Claude: *Documents Stripe dependency with version*

You: "This will charge the card and update the orders table"
Claude: *Documents side effects and DB writes*

You: "Actually, need to also send email confirmation"
Claude: *Adds email service dependency, warns about growing complexity*

You: "Should I split this up?"
Claude: *Analyzes dependencies, suggests service boundaries*

You: "Error: Stripe timeout after 30 seconds"
Claude: *Documents failure mode, adds retry logic with backoff*

You: "Feature complete, finalize docs"
Claude: *Reviews all documentation, ensures completeness*
```

---

## CUSTOMIZATION

### For Your Tech Stack:

**Python/Django:**
```python
"""
DEPENDENCY MAP FOR: module_name.py
...
"""
```

**Node/TypeScript:**
```typescript
/**
 * DEPENDENCY MAP FOR: module.ts
 * @module module-name
 * ...
 */
```

**React Components:**
```jsx
/**
 * COMPONENT MAP FOR: ComponentName.jsx
 * @renders [what it displays]
 * @props [what it accepts]
 * @state [what it manages]
 * @hooks [what it uses]
 * ...
 */
```

---

## THE PAYOFF

Using this system, your documentation:

- Grows with your code naturally
- Stays accurate because it's updated in real-time
- Captures context while it's fresh in your mind
- Prevents issues by catching complexity early
- Speeds debugging with complete failure documentation
- Enables refactoring with confidence
- Onboards developers without hand-holding
- Satisfies AI with comprehensive context

---

## BONUS: AUTOMATION SETUP

### Git Hook for Documentation Enforcement:
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check for dependency map in changed files
for file in $(git diff --cached --name-only); do
    if [[ $file == *.js ]] || [[ $file == *.py ]] || [[ $file == *.ts ]]; then
        if ! grep -q "DEPENDENCY MAP" "$file"; then
            echo "Warning: Missing dependency map in $file"
            echo "Run: claude-code 'Add dependency documentation to $file'"
            exit 1
        fi
    fi
done
```

### VSCode Snippet for Quick Documentation:
```json
{
  "Dependency Map": {
    "prefix": "depmap",
    "body": [
      "/* ============================================================================",
      " * DEPENDENCY MAP FOR: ${TM_FILENAME}",
      " * ============================================================================",
      " * @module ${1:module-name}",
      " * @created ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE}",
      " * @status UNDER_DEVELOPMENT",
      " *",
      " * PURPOSE:",
      " * --------",
      " * ${2:Purpose description}",
      " *",
      " * ============================================================================ */"
    ]
  }
}
```

---

## Remember: The best documentation is the one that actually exists and stays updated. This system ensures both.
