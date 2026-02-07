---
name: ollama-coder
description: Use local Ollama models on Hoopa for simple coding tasks to save Claude tokens. Invoke for boilerplate code, simple functions, regex, one-liners, or basic debugging. Do NOT use for complex architecture or multi-file changes.
---

# Ollama Coder - Local Model for Simple Tasks

Use the local `qwen2.5-coder:14b` model on Hoopa (192.168.1.79) for simple coding tasks to reduce Claude API costs.

## When to Use This Skill

**GOOD use cases (simple, self-contained):**
- Write a single function
- Generate boilerplate code
- Create a regex pattern
- Write a one-liner
- Simple bash/Python scripts
- Explain what code does
- Fix obvious syntax errors

**DO NOT use for:**
- Multi-file changes
- Complex architecture decisions
- Code that needs full project context
- Security-sensitive code
- Anything requiring reasoning about trade-offs

## API Endpoint

```
http://192.168.1.79:11434/api/generate
```

## Available Models

| Model | Best For |
|-------|----------|
| `qwen2.5-coder:14b` | Code generation (default) |
| `llama3.2:1b` | Very fast, simple tasks |
| `medllama2:7b` | Medical/health content |

## How to Call

```bash
curl -s http://192.168.1.79:11434/api/generate \
  -d '{"model": "qwen2.5-coder:14b", "prompt": "YOUR_PROMPT", "stream": false}' \
  | jq -r '.response'
```

## Example Prompts

For best results, be specific and ask for code only:

```
"Write a Python function to check if a string is a palindrome. Only output code."

"Write a bash one-liner to find files larger than 100MB"

"Create a regex to match email addresses"

"Write a TypeScript interface for a User with id, name, and email fields"
```

## Workflow

1. Identify if the task is simple enough for local model
2. Call the Ollama API with a clear, specific prompt
3. Review the output (local models can make mistakes)
4. Use the code if good, or fall back to Claude for complex cases

## Helper Script

Located at `/root/ollama-query.sh`:

```bash
/root/ollama-query.sh "Write a function to reverse a string"
/root/ollama-query.sh "Explain this regex: ^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"
```

## Performance

- First call: 5-10s (model loads to GPU)
- Subsequent calls: <1s
- Model runs on RTX 5090 + 3x RTX 3090

## Token Savings

Use this for ~30-50% of simple coding tasks to reduce Claude API usage. Reserve Claude for:
- Complex reasoning
- Multi-step tasks
- Full codebase context
- Security reviews
