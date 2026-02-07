# LlamaHub PR Submission Guide - Built-Simple Readers

## Overview

This guide covers submitting the Built-Simple research API readers (PubMed, ArXiv, Wikipedia) to the official LlamaIndex repository so they appear on [LlamaHub](https://llamahub.ai/).

**Important:** Since LlamaIndex v0.10, all integrations go directly into the `run-llama/llama_index` repo, NOT the old `llama-hub` repo.

---

## Quick Links

- **LlamaIndex Repo:** https://github.com/run-llama/llama_index
- **Contributing Guide:** https://github.com/run-llama/llama_index/blob/main/CONTRIBUTING.md
- **Readers Directory:** https://github.com/run-llama/llama_index/tree/main/llama-index-integrations/readers
- **Discord:** https://discord.gg/dGcwcsnxhU

---

## Step-by-Step Submission Process

### 1. Fork and Clone the Repository

```bash
# Fork on GitHub first, then:
git clone https://github.com/YOUR-USERNAME/llama_index.git
cd llama_index
```

### 2. Set Up Development Environment

LlamaIndex uses `uv` for package management:

```bash
# Install uv if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh

# At repo root, set up the environment
uv sync

# Install pre-commit hooks
uv run pre-commit install
```

### 3. Create a Feature Branch

```bash
git checkout -b feature/builtsimple-readers
```

### 4. Create the Package Directory

Your reader package should go in:
```
llama-index-integrations/readers/llama-index-readers-builtsimple/
```

### 5. Required Package Structure

```
llama-index-readers-builtsimple/
├── .gitignore
├── CHANGELOG.md
├── LICENSE                    # MIT license
├── Makefile
├── README.md                  # Usage docs (important!)
├── pyproject.toml             # Package config
├── tests/
│   ├── __init__.py
│   └── test_readers_builtsimple.py
└── llama_index/
    └── readers/
        └── builtsimple/
            ├── __init__.py
            ├── base.py        # Base class, errors
            ├── arxiv.py       # ArXiv reader
            ├── pubmed.py      # PubMed reader
            └── wikipedia.py   # Wikipedia reader
```

### 6. Key Files to Create/Adapt

#### `pyproject.toml`

**IMPORTANT:** LlamaIndex uses `hatchling`, not `poetry`. Convert your existing pyproject.toml:

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[dependency-groups]
dev = [
    "pytest==7.2.1",
    "pytest-mock==3.11.1",
    "ruff==0.11.11",
    "mypy==0.991",
    # ... standard dev deps
]

[project]
name = "llama-index-readers-builtsimple"
version = "0.1.0"
description = "LlamaIndex readers for Built-Simple research APIs (PubMed, ArXiv, Wikipedia)"
authors = [{name = "Built-Simple", email = "contact@built-simple.ai"}]
requires-python = ">=3.9,<4.0"
readme = "README.md"
license = "MIT"
maintainers = [{name = "Built-Simple"}]
keywords = [
    "llama-index",
    "research",
    "pubmed",
    "arxiv", 
    "wikipedia",
    "academic",
    "papers",
    "semantic search",
]
dependencies = [
    "llama-index-core>=0.13.0,<0.15",
    "requests>=2.28.0",
]

[tool.hatch.build.targets.sdist]
include = ["llama_index/"]
exclude = ["**/BUILD"]

[tool.hatch.build.targets.wheel]
include = ["llama_index/"]
exclude = ["**/BUILD"]

[tool.llamahub]
contains_example = false
import_path = "llama_index.readers.builtsimple"

[tool.llamahub.class_authors]
BuiltSimplePubMedReader = "Built-Simple"
BuiltSimpleArxivReader = "Built-Simple"
BuiltSimpleWikipediaReader = "Built-Simple"

[tool.mypy]
disallow_untyped_defs = true
exclude = ["_static", "build", "examples", "notebooks", "venv"]
ignore_missing_imports = true
python_version = "3.8"
```

#### `README.md`

```markdown
# LlamaIndex Readers Integration: Built-Simple Research APIs

## Overview

Built-Simple provides free, high-performance research APIs for semantic search across:
- **PubMed** - 38M+ biomedical articles
- **ArXiv** - 2.5M+ scientific preprints  
- **Wikipedia** - Full Wikipedia with semantic search

### Installation

```bash
pip install llama-index-readers-builtsimple
```

### Usage

```python
from llama_index.readers.builtsimple import (
    BuiltSimplePubMedReader,
    BuiltSimpleArxivReader,
    BuiltSimpleWikipediaReader,
)

# PubMed search
pubmed = BuiltSimplePubMedReader()
docs = pubmed.load_data("cancer immunotherapy", limit=10)

# ArXiv search  
arxiv = BuiltSimpleArxivReader()
docs = arxiv.load_data("transformer architecture", limit=10)

# Wikipedia search
wiki = BuiltSimpleWikipediaReader()
docs = wiki.load_data("machine learning history", limit=5)
```

### Features

- **Semantic/Hybrid Search**: Find conceptually relevant results, not just keyword matches
- **No API Key Required**: Free to use
- **Rich Metadata**: Authors, dates, citations, abstracts, URLs
- **Fast**: Optimized for speed with pre-built indices

### API Endpoints

- PubMed: https://pubmed.built-simple.ai
- ArXiv: https://arxiv.built-simple.ai
- Wikipedia: https://wikipedia.built-simple.ai

For more information, visit: https://built-simple.ai
```

#### `tests/test_readers_builtsimple.py`

```python
from llama_index.core.readers.base import BaseReader
from llama_index.readers.builtsimple import (
    BuiltSimplePubMedReader,
    BuiltSimpleArxivReader,
    BuiltSimpleWikipediaReader,
)


def test_pubmed_class():
    names_of_base_classes = [b.__name__ for b in BuiltSimplePubMedReader.__mro__]
    assert BaseReader.__name__ in names_of_base_classes


def test_arxiv_class():
    names_of_base_classes = [b.__name__ for b in BuiltSimpleArxivReader.__mro__]
    assert BaseReader.__name__ in names_of_base_classes


def test_wikipedia_class():
    names_of_base_classes = [b.__name__ for b in BuiltSimpleWikipediaReader.__mro__]
    assert BaseReader.__name__ in names_of_base_classes
```

#### `llama_index/readers/__init__.py`

```python
# Empty file - namespace package
```

#### `llama_index/readers/builtsimple/__init__.py`

```python
from llama_index.readers.builtsimple.pubmed import BuiltSimplePubMedReader
from llama_index.readers.builtsimple.arxiv import BuiltSimpleArxivReader
from llama_index.readers.builtsimple.wikipedia import BuiltSimpleWikipediaReader
from llama_index.readers.builtsimple.base import BuiltSimpleAPIError

__all__ = [
    "BuiltSimplePubMedReader",
    "BuiltSimpleArxivReader", 
    "BuiltSimpleWikipediaReader",
    "BuiltSimpleAPIError",
]
```

### 7. Run Tests and Linting

```bash
# Navigate to your package
cd llama-index-integrations/readers/llama-index-readers-builtsimple

# Run tests
uv run -- pytest

# Run linting (from repo root)
cd ../../..
uv run make lint
```

**Note:** CI requires >50% test coverage. Add more tests with mocked API responses if needed.

### 8. Commit and Push

```bash
git add .
git commit -m "feat(readers): Add Built-Simple research API readers

- BuiltSimplePubMedReader for PubMed biomedical search
- BuiltSimpleArxivReader for arXiv paper search  
- BuiltSimpleWikipediaReader for Wikipedia semantic search

All readers support semantic/hybrid search via Built-Simple's free APIs."

git push origin feature/builtsimple-readers
```

### 9. Open Pull Request

Go to https://github.com/run-llama/llama_index/pulls and create a new PR.

---

## PR Checklist

Before submitting, verify:

- [ ] Package follows naming convention: `llama-index-readers-builtsimple`
- [ ] Uses `hatchling` build system (not poetry)
- [ ] `pyproject.toml` has `[tool.llamahub]` section
- [ ] `README.md` has clear usage examples
- [ ] All readers inherit from `BaseReader`
- [ ] Tests verify class inheritance
- [ ] Tests pass locally: `uv run -- pytest`
- [ ] Linting passes: `uv run make lint`
- [ ] No secrets or API keys in code

---

## Tips for Faster Review

1. **Keep PR focused** - Just the reader, no unrelated changes
2. **Mock external APIs in tests** - Don't make real API calls in CI
3. **Good documentation** - Clear README with working examples
4. **Follow existing patterns** - Look at similar readers for reference
5. **Respond quickly** - Address reviewer feedback promptly
6. **Join Discord** - Can ask questions in #contributors channel

---

## After Merge

Once merged:
1. Package will auto-publish to PyPI as `llama-index-readers-builtsimple`
2. Will appear on https://llamahub.ai under Readers
3. Users can install via `pip install llama-index-readers-builtsimple`
4. Import as `from llama_index.readers.builtsimple import ...`

---

## Troubleshooting

### "Import error" in tests
Make sure `llama_index/readers/__init__.py` exists (can be empty).

### Pre-commit fails
Run `uv run pre-commit run --all-files` to fix formatting issues.

### CI coverage too low
Add more tests with mocked responses using `pytest-mock` or `responses` library.

### Build system error
Double-check you're using `hatchling`, not `poetry`.
