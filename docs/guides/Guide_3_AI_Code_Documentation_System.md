# AI CODE DOCUMENTATION SYSTEM

## CORE PRINCIPLE
> External docs rot. Document IN the code.

## DEPENDENCY MAP TEMPLATE

Place at END of every file:

```javascript
/* ============================================================================
 * DEPENDENCY MAP FOR: filename.js
 * ============================================================================
 * @module module-name
 * @criticality CRITICAL|HIGH|MEDIUM|LOW
 * @created YYYY-MM-DD
 * @status ACTIVE|DEPRECATED|MAINTENANCE
 *
 * PURPOSE: What this does, why it exists
 *
 * DEPENDENCIES:
 * - module@version - why needed - fallback behavior
 *
 * DATABASE:
 * - READS: table.columns - purpose
 * - WRITES: table - what/when
 *
 * EXTERNAL SERVICES:
 * - service.endpoint - auth method - rate limits - timeout
 *
 * SIDE EFFECTS:
 * - File writes, cache updates, events emitted, jobs triggered
 *
 * DEPENDED ON BY:
 * - module - how used - breaks if changed
 *
 * FAILURE MODES:
 * - scenario: recovery strategy
 *
 * BREAKING CHANGES:
 * - what breaks if modified
 *
 * ============================================================================ */
```

## INLINE TAGS

```javascript
// DEPENDENCY: module@version - why - fallback
// SIDE EFFECT: what - when - where
// DB OPERATION: table.op - purpose
// EXTERNAL API: service.endpoint - rate limit
// BUSINESS RULE: rule - source - critical?
// TECHNICAL DEBT: issue - fix by when
// GOTCHA: unexpected behavior - workaround
// DECISION: choice - rationale - revisit when
// BREAKING: what breaks if changed
```

## FUNCTION DOCS

```javascript
/**
 * @function name
 * @purpose one-line description
 * @param {Type} name - description
 * @returns {Type} description
 * @throws {Error} when
 * @depends module.fn - why
 * @affects what - how
 */
```

## DOCUMENT IMMEDIATELY WHEN

1. **Architecture decisions** - why X over Y
2. **Workarounds** - bug #, remove when
3. **Business logic** - rule, source, critical?
4. **Performance tricks** - what, measured improvement
5. **Edge cases** - condition, why special handling

## CHECKLIST

Before commit:
- [ ] Why does this exist?
- [ ] What does it depend on?
- [ ] What depends on it?
- [ ] How can it fail?
- [ ] Side effects?
- [ ] Security concerns?

## FULL FRAMEWORK

See `docs/frameworks/AI_Code_Documentation_Complete_Framework.md` for complete reference.
