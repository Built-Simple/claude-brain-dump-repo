# AI Code Documentation Quick Reference

## Core Principle
> "External documentation always rots. Document IN the code."

---

## QUICK COPY-PASTE PROMPTS

### Starting New File:
```
I'm creating [filename] for [purpose]. Set up dependency map structure and help me think through dependencies.
```

### Adding Dependencies:
```
Adding dependency: [module] because [reason]. Update dependency map.
```

### When Things Break:
```
Error: [error message]. Document failure mode and recovery strategy.
```

### Before Refactoring:
```
This has [N] dependencies. Should I refactor? Analyze coupling and suggest improvements.
```

### Completing Feature:
```
Feature complete. Review and finalize all documentation.
```

---

## FILE STRUCTURE TEMPLATE

```javascript
// [Your code here]

/* ============================================================================
 * DEPENDENCY MAP FOR: filename.js
 * ============================================================================
 * @module module-name
 * @criticality HIGH
 * @owner team-name
 * @created 2024-01-20
 *
 * PURPOSE:
 * --------
 * What this does and why it exists
 *
 * DEPENDENCIES:
 * -------------
 * - module@version - why needed - what breaks without
 *
 * SIDE EFFECTS:
 * -------------
 * - Writes to X when Y
 * - Triggers Z event
 *
 * FAILURE MODES:
 * --------------
 * - Error X: How to handle
 * - Timeout Y: Recovery strategy
 *
 * ============================================================================ */
```

---

## INLINE DOCUMENTATION TAGS

```javascript
// DEPENDENCY: module@version - why - fallback
// SIDE EFFECT: what happens - when - where
// DB OPERATION: table.operation - purpose
// EXTERNAL API: service.endpoint - rate limit
// BUSINESS RULE: rule - source - critical
// TECHNICAL DEBT: issue - impact - fix by when
// GOTCHA: unexpected behavior - why - workaround
// PERFORMANCE: metric - bottleneck - optimization
// SECURITY: what's protected - how - threats
// DECISION: choice - rationale - revisit when
// BREAKING: what breaks - if changed how
// TODO: what - why - when
```

---

## EVERY CODE CHANGE CHECKLIST

Before committing, document:

- [ ] **Why** does this code exist?
- [ ] **What** does it depend on?
- [ ] **Who** depends on it?
- [ ] **How** can it fail?
- [ ] **Where** are the side effects?
- [ ] **When** does it break?
- [ ] **What** security concerns exist?

---

## ANALYSIS COMMANDS

```bash
# Find undocumented files
find . -name "*.js" -exec grep -L "DEPENDENCY MAP" {} \;

# Count dependencies
grep -r "DEPENDENCIES:" -A 20 | grep -c "^\s*-"

# Find technical debt
grep -r "TECHNICAL DEBT:" -B 2 -A 5

# Find critical paths
grep -r "@criticality CRITICAL"

# Find side effects
grep -r "SIDE EFFECT:" -A 2
```

---

## FUNCTION DOCUMENTATION

```javascript
/**
 * @function functionName
 * @purpose One-line what and why
 * @param {Type} name - description
 * @returns {Type} description
 * @throws {Error} when
 * @depends module.function - why
 * @affects what - how
 * @example functionName(param)
 */
```

---

## DOCUMENT IMMEDIATELY WHEN:

1. **Making Architecture Decisions**
   ```
   // ARCHITECTURE: Chose X because Y. Alternative Z rejected due to...
   ```

2. **Working Around Issues**
   ```
   // WORKAROUND: Bug #123 in library. Remove after v2.0
   ```

3. **Adding Business Logic**
   ```
   // BUSINESS RULE: Must do X because legal requirement Y
   ```

4. **Performance Optimizations**
   ```
   // OPTIMIZATION: Caching reduces API calls 90%. Measured: 50ms -> 5ms
   ```

5. **Handling Edge Cases**
   ```
   // EDGE CASE: When X > 1000, must paginate or memory explodes
   ```

---

## REFACTORING TRIGGERS

Refactor when you see:
- 10+ dependencies in one module
- 3+ levels of nested callbacks/promises
- 100+ lines in a single function
- Duplicate error handling patterns
- Multiple modules doing similar things

---

## DOCUMENTATION QUALITY SCORE

Good documentation has:
- Clear PURPOSE section
- All DEPENDENCIES listed with reasons
- SIDE EFFECTS documented
- FAILURE MODES with recovery
- PERFORMANCE metrics
- SECURITY considerations
- Recent update date
- Working examples

---

## BEST PRACTICES

1. **Document the WHY, not the WHAT**
   ```javascript
   // BAD: Increment counter
   counter++;

   // GOOD: Track retry attempts for exponential backoff
   counter++;
   ```

2. **Quantify Performance**
   ```javascript
   // BAD: This might be slow
   // GOOD: Takes ~200ms for 1K records, ~2s for 10K
   ```

3. **Specify Failure Recovery**
   ```javascript
   // BAD: Throws error
   // GOOD: Throws NetworkError - retry with backoff 3x then fallback to cache
   ```

---

## TOOL SETUP

### VSCode Snippet:
```json
{
  "depmap": {
    "prefix": "depmap",
    "body": ["/* DEPENDENCY MAP FOR: $TM_FILENAME ... */"]
  }
}
```

### Git Pre-commit Hook:
```bash
#!/bin/bash
grep -L "DEPENDENCY MAP" $(git diff --cached --name-only) && exit 1
```

---

## THE GOAL

Every file should answer:
- What does this do?
- Why does it exist?
- What needs it?
- What does it need?
- How can it break?
- How do we fix it?

**If you can't answer these in 30 seconds by reading the code, the documentation needs work.**

---

## QUICK START

1. Save this reference card
2. Use prompts with Claude Code
3. Follow the checklist
4. Run analysis commands
5. Refactor when triggered

**Remember: Document as you build, not after!**
