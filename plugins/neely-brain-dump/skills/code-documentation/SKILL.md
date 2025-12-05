---
name: code-documentation
description: AI-optimized code documentation framework. Use when writing code, documenting files, creating dependency maps, or asked about documentation best practices.
allowed-tools: Read, Write, Edit, Grep, Glob
---

# Code Documentation Framework

Documentation must live IN the code. External documentation always rots.

## Core Principles

1. Document AS you build, not after
2. In-code beats external
3. Make it machine-parseable
4. Track decisions, not just implementations
5. When you write "depends on 47 things," refactor immediately

## File-Level Dependency Map

Place at END of EVERY file:

```javascript
/* ============================================================================
 * DEPENDENCY MAP FOR: [filename.js]
 * ============================================================================
 *
 * @module [module-name]
 * @criticality [CRITICAL|HIGH|MEDIUM|LOW]
 * @created [YYYY-MM-DD]
 * @status [ACTIVE|DEPRECATED|MAINTENANCE|EXPERIMENTAL]
 *
 * PURPOSE:
 * [What this module does and why it exists]
 *
 * DIRECT DEPENDENCIES:
 * [REQUIRED] [module/path] - [why needed]
 * [OPTIONAL] [module/path] - [graceful degradation behavior]
 *
 * DATABASE OPERATIONS:
 * READS: [table.columns] - [purpose]
 * WRITES: [table] - [what triggers writes]
 *
 * EXTERNAL SERVICES:
 * [SERVICE] - Endpoint: [URL], Rate limit: [X/min], Timeout: [Xms]
 *
 * SIDE EFFECTS:
 * - File System: [paths]
 * - Cache: [what, TTL]
 * - Events: [emitted events]
 * - Background Jobs: [triggered jobs]
 *
 * DEPENDED ON BY:
 * [CRITICAL PATH] [module] - [how used]
 *
 * ERROR HANDLING:
 * - [Failure scenario]: [How handled]
 *
 * BREAKING CHANGES:
 * WILL BREAK IF: [specific changes that break this]
 *
 * PERFORMANCE:
 * TIME COMPLEXITY: O([complexity])
 * BOTTLENECKS: [operation] - [typical duration]
 *
 * ============================================================================ */
```

## Function-Level Documentation

```javascript
/**
 * @function functionName
 * @purpose [One-line description]
 * @context [When/why called]
 *
 * @param {Type} paramName - [description, constraints]
 * @returns {Type} - [what it returns]
 * @throws {ErrorType} - [when thrown]
 *
 * @depends [module.function] - [why]
 * @affects [what modified] - [side effects]
 *
 * @performance O([complexity])
 * @breaking [what changes break this]
 */
```

## Inline Documentation Markers

```javascript
// DEPENDENCY: stripe@^9.0.0 - Payment processing (CRITICAL)
// EXTERNAL: https://api.service.com - Rate limited 100/min
// DB WRITE: users.last_login - Updates activity tracking
// SIDE EFFECT: Triggers email notification job
// CACHE: user:${id} - TTL 5 minutes
// DECISION: Using Redis because [reason]. Revisit if [condition]
// TECHNICAL DEBT: Should use batch processing. Target: Q2 2025
// WORKAROUND: Library bug #1234 - Remove after v2.0
// BUSINESS RULE: [rule] - Legal requirement, DO NOT CHANGE
// GOTCHA: Looks async but requires sequential processing
// CHECKPOINT: [expected state here]
// FAILURE POINT: [what could go wrong]
// CRITICAL: [important business logic]
```

## Document Immediately When

1. Making architectural decisions
2. Working around limitations
3. Implementing business logic
4. Adding performance optimizations
5. Handling edge cases

## Every Code Change Checklist

- Why does this dependency exist?
- What breaks if I change this?
- What side effects occur?
- Who else uses this?
- What can fail?
- What are the performance implications?

## Cross-File Documentation

Create these summary files:

**CRITICAL_PATHS.md** - User journeys through the system
**BREAKING_CHANGES.md** - Impact analysis for modifications
**TECH_DEBT.md** - Prioritized improvements

## Success Metrics

- New developer understands module in <5 minutes
- Can predict impact of changes before making them
- Can debug issues without original author
- Can trace data flow end-to-end
