# LlamaHub PR Description - Ready to Paste

## PR Title

```
feat(readers): Add Built-Simple research API readers for PubMed, ArXiv, and Wikipedia
```

---

## PR Description (copy below the line)

---

## Description

This PR adds a new reader integration for **Built-Simple's research APIs**, providing semantic search capabilities across three major research databases:

- **BuiltSimplePubMedReader** - Search 38M+ biomedical articles from PubMed
- **BuiltSimpleArxivReader** - Search 2.5M+ scientific preprints from arXiv
- **BuiltSimpleWikipediaReader** - Search Wikipedia with semantic understanding

### Why This Integration?

Built-Simple provides **free, high-performance research APIs** optimized for LLM/RAG applications:

1. **Semantic/Hybrid Search** - Finds conceptually relevant results, not just keyword matches
2. **No API Key Required** - Free to use with no rate limits for reasonable usage
3. **Pre-built Indices** - Fast response times with optimized search infrastructure
4. **Rich Metadata** - Returns authors, dates, citations, abstracts, and source URLs

### Use Cases

- Research assistants that need to find relevant scientific papers
- Medical/biomedical RAG applications
- Academic literature review tools
- General knowledge retrieval from Wikipedia

## Type of Change

- [x] New feature (non-breaking change which adds functionality)
- [x] This change adds a new integration to LlamaIndex

## New Package

- **Package name:** `llama-index-readers-builtsimple`
- **Import path:** `llama_index.readers.builtsimple`

## How Has This Been Tested?

- [x] Unit tests verifying class inheritance from `BaseReader`
- [x] Integration tests with mocked API responses
- [x] Manual testing against live APIs
- [x] All tests pass with `uv run -- pytest`
- [x] Linting passes with `uv run make lint`

## Usage Example

```python
from llama_index.readers.builtsimple import (
    BuiltSimplePubMedReader,
    BuiltSimpleArxivReader,
    BuiltSimpleWikipediaReader,
)

# Search PubMed for biomedical literature
pubmed = BuiltSimplePubMedReader()
docs = pubmed.load_data("cancer immunotherapy mechanisms", limit=10)

# Search arXiv for ML papers
arxiv = BuiltSimpleArxivReader()
docs = arxiv.load_data("transformer architecture attention", limit=10)

# Search Wikipedia
wiki = BuiltSimpleWikipediaReader()
docs = wiki.load_data("machine learning history", limit=5)

# Use with LlamaIndex
from llama_index.core import VectorStoreIndex
index = VectorStoreIndex.from_documents(docs)
query_engine = index.as_query_engine()
response = query_engine.query("What are the latest advances in immunotherapy?")
```

## API Endpoints

| Reader | Endpoint | Health Check |
|--------|----------|--------------|
| PubMed | https://pubmed.built-simple.ai | https://pubmed.built-simple.ai/health |
| ArXiv | https://arxiv.built-simple.ai | https://arxiv.built-simple.ai/health |
| Wikipedia | https://wikipedia.built-simple.ai | https://wikipedia.built-simple.ai/health |

## Checklist

- [x] I have read the [Contributing Guide](https://github.com/run-llama/llama_index/blob/main/CONTRIBUTING.md)
- [x] I have performed a self-review of my own code
- [x] I have commented my code, particularly in hard-to-understand areas
- [x] I have made corresponding changes to the documentation (README.md)
- [x] My changes generate no new warnings
- [x] I have added tests that prove my fix is effective or that my feature works
- [x] New and existing unit tests pass locally with my changes
- [x] The package follows LlamaIndex naming conventions (`llama-index-readers-*`)
- [x] The `pyproject.toml` includes proper `[tool.llamahub]` configuration

## Additional Context

Built-Simple is committed to maintaining this integration. We plan to:
- Monitor for breaking changes in llama-index-core
- Add new features based on community feedback  
- Keep documentation up to date

For questions or issues: contact@built-simple.ai

---

## Alternative Shorter PR Description

If the above is too long, use this condensed version:

---

## Description

Adds `llama-index-readers-builtsimple` with three readers for Built-Simple's free research APIs:

- **BuiltSimplePubMedReader** - 38M+ biomedical articles
- **BuiltSimpleArxivReader** - 2.5M+ scientific preprints  
- **BuiltSimpleWikipediaReader** - Wikipedia with semantic search

**Features:** Semantic/hybrid search, no API key required, rich metadata, fast responses.

## Usage

```python
from llama_index.readers.builtsimple import BuiltSimplePubMedReader

reader = BuiltSimplePubMedReader()
docs = reader.load_data("cancer immunotherapy", limit=10)
```

## Checklist

- [x] Tests pass (`uv run -- pytest`)
- [x] Linting passes (`uv run make lint`)
- [x] Documentation included (README.md)
- [x] Follows naming conventions

---

## Labels to Request

When creating the PR, request these labels if possible:
- `integration`
- `readers`
- `new-feature`
