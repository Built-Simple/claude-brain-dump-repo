# GitHub Awesome List PRs for Built Simple

## Status: ⏳ Pending GitHub Authentication

To submit these PRs, I need a GitHub Personal Access Token with `repo` scope.
Run: `gh auth login` or set `GITHUB_TOKEN` environment variable.

---

## 1. awesome-langchain (kyrolabs/awesome-langchain)

**Target Section:** Tools > Services  
**Format:** Markdown list item with GitHub stars badge  

### Entry to Add:
```markdown
- [langchain-builtsimple](https://github.com/Built-Simple/langchain-builtsimple): LangChain retrievers and tools for Built-Simple research APIs (PubMed 4.5M+ articles, ArXiv 2.7M+ papers) with FULL TEXT support. No API key required. ![GitHub Repo stars](https://img.shields.io/github/stars/Built-Simple/langchain-builtsimple?style=social)
```

### PR Title:
`Add langchain-builtsimple - Research API integration with full text`

### PR Description:
```markdown
## Description
Adds langchain-builtsimple to the Services section - a LangChain integration for scientific literature search.

## Features
- **PubMed Retriever & Tool** - Search 4.5M+ peer-reviewed biomedical articles
- **ArXiv Retriever & Tool** - Search 2.7M+ preprints in physics, math, CS, and ML
- **Full Text Support** - Unlike most research APIs, includes complete article text (15K-70K chars)
- **No API Key Required** - Free tier available
- **RAG-Ready** - Documents include full metadata for citations

## Links
- PyPI: https://pypi.org/project/langchain-builtsimple/
- GitHub: https://github.com/Built-Simple/langchain-builtsimple
- Demo: https://pubmed.built-simple.ai

## Install
```bash
pip install langchain-builtsimple
```
```

---

## 2. awesome-rag (frutik/awesome-rag)

**Target Section:** Tools  
**Format:** Markdown list item  

### Entry to Add:
```markdown
- [Built-Simple Research APIs](https://built-simple.ai) - Free semantic search APIs for scientific literature (PubMed 4.5M+ articles, ArXiv 2.7M+ papers, Wikipedia 4.8M articles). Pre-indexed vectors, hybrid BM25+semantic search, full text available. Integrations: [LangChain](https://github.com/Built-Simple/langchain-builtsimple), [LlamaIndex](https://github.com/Built-Simple/llama-index-readers-builtsimple).
```

### PR Title:
`Add Built-Simple Research APIs - Free semantic search for PubMed/ArXiv/Wikipedia`

### PR Description:
```markdown
## Description
Adds Built-Simple research APIs to the Tools section - free semantic search APIs perfect for RAG pipelines.

## What It Provides
- **PubMed API** - 4.5M+ biomedical articles with hybrid semantic/keyword search
- **ArXiv API** - 2.7M+ ML/physics/math preprints
- **Wikipedia API** - 4.8M articles with millisecond response times
- **Full Text Support** - Complete article text, not just abstracts

## Why It's Great for RAG
- Pre-indexed vectors (no embedding costs)
- Hybrid BM25 + semantic search
- No rate limit hell from upstream providers
- Clean JSON responses with full metadata
- Free tier: 10 req/min, no API key needed

## Framework Integrations
- LangChain: `pip install langchain-builtsimple`
- LlamaIndex: `pip install llama-index-readers-builtsimple`

## Links
- PubMed API: https://pubmed.built-simple.ai/docs
- ArXiv API: https://arxiv.built-simple.ai/docs
- Wikipedia API: https://wikipedia.built-simple.ai/docs
```

---

## 3. awesome-ai-tools (mahseema/awesome-ai-tools)

**Target Section:** Text > Search engines  
**Format:** Markdown list item with reviews link  

### Entry to Add:
```markdown
- [Built-Simple](https://built-simple.ai) - Free semantic search APIs for scientific research. PubMed (4.5M+ articles), ArXiv (2.7M+ papers), Wikipedia (4.8M articles). Pre-indexed vectors, instant search, LangChain/LlamaIndex integrations.
```

### PR Title:
`Add Built-Simple - Free scientific research search APIs`

### PR Description:
```markdown
## Description
Adds Built-Simple to the Search Engines section - free AI-powered semantic search for scientific literature.

## What It Is
Built-Simple provides free, high-performance semantic search APIs for:
- **PubMed** - 4.5M+ peer-reviewed biomedical articles
- **ArXiv** - 2.7M+ preprints in physics, math, CS, ML
- **Wikipedia** - 4.8M articles

## Key Features
- Pre-indexed vector embeddings (no embedding costs)
- Hybrid BM25 + semantic search
- Full article text available (not just abstracts)
- Millisecond response times
- No API key required for free tier (10 req/min)

## Developer Integrations
- `pip install langchain-builtsimple`
- `pip install llama-index-readers-builtsimple`

## Links
- Website: https://built-simple.ai
- GitHub: https://github.com/Built-Simple
```

---

## 4. Additional Target Lists

### awesome-llama-index (run-llama/llama-hub or llama-index ecosystem)
- Add llama-index-readers-builtsimple to LlamaHub
- Note: Already integrated into official llama-index ecosystem

### awesome-python (vinta/awesome-python)
- Section: Science > Research
- Lower priority - very strict acceptance criteria

### awesome-scientific-computing
- Could add research APIs

---

## Next Steps

1. **Get GitHub token**: Run `gh auth login` or provide `GITHUB_TOKEN`
2. **Fork each repo**
3. **Create branch and add entry**
4. **Submit PR with prepared descriptions**
5. **Update this file with PR URLs**

---

## Submitted PRs

| Repository | PR URL | Status | Date |
|------------|--------|--------|------|
| kyrolabs/awesome-langchain | _pending_ | ⏳ | - |
| frutik/awesome-rag | _pending_ | ⏳ | - |
| mahseema/awesome-ai-tools | _pending_ | ⏳ | - |

---

## Packages Being Promoted

| Package | PyPI | GitHub |
|---------|------|--------|
| langchain-builtsimple | [pypi.org/project/langchain-builtsimple](https://pypi.org/project/langchain-builtsimple/) | [Built-Simple/langchain-builtsimple](https://github.com/Built-Simple/langchain-builtsimple) |
| llama-index-readers-builtsimple | [pypi.org/project/llama-index-readers-builtsimple](https://pypi.org/project/llama-index-readers-builtsimple/) | [Built-Simple/llama-index-readers-builtsimple](https://github.com/Built-Simple/llama-index-readers-builtsimple) |

## APIs
- PubMed: https://pubmed.built-simple.ai
- ArXiv: https://arxiv.built-simple.ai  
- Wikipedia: https://wikipedia.built-simple.ai
