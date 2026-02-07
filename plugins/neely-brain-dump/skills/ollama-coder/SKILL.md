---
name: ollama-coder
description: Use local Ollama models on Hoopa for coding tasks. Only use when the expected output is LONGER than your prompt - writing the prompt costs tokens too.
---

# Ollama Coder - When to Use It

**The rule is simple:** Only use Ollama when the OUTPUT will be significantly longer than your prompt.

Writing a prompt to Ollama costs Claude tokens. If you can just write the code yourself in fewer tokens than the prompt would take, do it yourself.

## Token Economics

| Task | Prompt Length | Output Length | Use Ollama? |
|------|---------------|---------------|-------------|
| "Write isPrime function" | ~5 tokens | ~50 tokens | ✅ Yes |
| "Write a Dockerfile with multi-stage build" | ~10 tokens | ~200 tokens | ✅ Yes |
| "Write rate limiter class with semaphore" | ~15 tokens | ~300 tokens | ✅ Yes |
| "Reverse a string" | ~5 tokens | ~10 tokens | ❌ No, just write `s[::-1]` |
| "Add 1 to x" | ~5 tokens | ~5 tokens | ❌ No, just write `x + 1` |
| "Fix this typo in line 5" | ~20 tokens | ~10 tokens | ❌ No, just fix it |

## Use Ollama For

**Boilerplate-heavy tasks (high output:input ratio):**
- Dockerfiles, CI configs, package.json
- TypeScript interfaces/types from descriptions
- SQL queries from natural language
- Test file scaffolding
- API endpoint handlers
- Class implementations from specs

**Tasks where model knows patterns you'd have to look up:**
- Regex patterns
- Bash find/xargs/awk combinations
- Framework-specific boilerplate
- Algorithm implementations

## Do NOT Use Ollama For

**Quick fixes (low output:input ratio):**
- One-line changes
- Variable renames
- Import additions
- Simple math/logic

**Context-dependent tasks:**
- Anything requiring knowledge of your codebase
- Multi-file refactors
- Bug fixes that need to understand surrounding code

**High-stakes code:**
- Security-sensitive logic
- Complex async/concurrency
- Anything you can't quickly verify

## Quick Reference

```
http://192.168.1.79:11434/api/generate
```

```bash
curl -s http://192.168.1.79:11434/api/generate \
  -d '{"model": "qwen2.5-coder:14b", "prompt": "YOUR_PROMPT. Code only.", "stream": false}' \
  | jq -r '.response'
```

**Tip:** Add "Code only." to prompts to reduce verbose explanations.

## What It's Good At (tested)

| Task Type | Quality |
|-----------|---------|
| Single functions | ✅ Excellent |
| Algorithms | ✅ Excellent |
| Regex | ✅ Excellent |
| SQL queries | ✅ Excellent |
| TypeScript types | ✅ Excellent |
| Dockerfiles | ✅ Good |
| Bash one-liners | ✅ Good |
| Code explanation | ✅ Good |
| API design | ✅ Good |
| Bug fixes (simple) | ✅ Good |
| Complex async | ⚠️ Can have bugs |
| Multi-step reasoning | ⚠️ Inconsistent |
