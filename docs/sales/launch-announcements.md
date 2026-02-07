# Launch Announcements - Built-Simple Research APIs

## Ready-to-Post Announcements

---

### 1. Hacker News (Show HN)

**Title:** Show HN: Free PubMed & ArXiv APIs with full-text search for RAG applications

**Post:**
```
I built semantic search APIs for PubMed (4.5M medical articles) and ArXiv (2.7M papers) specifically for RAG/LLM applications.

What makes this different:
- FULL TEXT available (not just abstracts) for PubMed articles
- Hybrid search (semantic + keyword) 
- Pre-indexed vectors - no embedding costs
- LlamaIndex and LangChain integrations published today

pip install langchain-builtsimple
pip install llama-index-readers-builtsimple

Free tier available. I built this because scraping PubMed/ArXiv for RAG is painful - rate limits, parsing XML, no semantic search.

Live APIs:
- https://pubmed.built-simple.ai
- https://arxiv.built-simple.ai

GitHub:
- https://github.com/Built-Simple/langchain-builtsimple
- https://github.com/Built-Simple/llama-index-readers-builtsimple

Happy to answer questions about the architecture or use cases.
```

**Best time:** Tuesday-Thursday, 9-11am EST

---

### 2. Reddit r/Rag

**Title:** I built PubMed & ArXiv APIs with full-text for RAG - LangChain/LlamaIndex integrations now on PyPI

**Post:**
```
Hey r/Rag!

Just published LangChain and LlamaIndex integrations for my research APIs:

**What it does:**
- Search 4.5M PubMed articles with semantic + keyword hybrid search
- Search 2.7M ArXiv papers
- **Full article text** available (not just abstracts!)
- Returns LangChain Documents / LlamaIndex Documents with rich metadata

**Install:**
```bash
pip install langchain-builtsimple
pip install llama-index-readers-builtsimple
```

**Quick example (LangChain):**
```python
from langchain_builtsimple import BuiltSimplePubMedRetriever

retriever = BuiltSimplePubMedRetriever(limit=5, include_full_text=True)
docs = retriever.invoke("CRISPR gene therapy")
# Returns full article text, not just abstracts!
```

I built this because I got tired of fighting PubMed's rate limits and parsing ArXiv XML. The APIs have pre-indexed vectors so you don't pay embedding costs.

Free tier available. Would love feedback from folks building medical/research RAG systems.

Links:
- PubMed API: https://pubmed.built-simple.ai
- ArXiv API: https://arxiv.built-simple.ai  
- GitHub: https://github.com/Built-Simple
```

---

### 3. Reddit r/LangChain

**Title:** New retriever: Search PubMed & ArXiv with full-text support

**Post:**
```
Published a LangChain integration for searching scientific literature:

```bash
pip install langchain-builtsimple
```

```python
from langchain_builtsimple import BuiltSimplePubMedRetriever, BuiltSimpleArxivRetriever

# Search medical literature
pubmed = BuiltSimplePubMedRetriever(limit=5, include_full_text=True)
docs = pubmed.invoke("immunotherapy cancer treatment")

# Search ML/physics papers
arxiv = BuiltSimpleArxivRetriever(limit=5)
docs = arxiv.invoke("transformer attention mechanism")
```

**Features:**
- Hybrid semantic + keyword search
- Full article text for PubMed (not just abstracts)
- Rich metadata (DOI, journal, authors, year)
- Free tier available

GitHub: https://github.com/Built-Simple/langchain-builtsimple
PyPI: https://pypi.org/project/langchain-builtsimple/

Built for medical/research RAG applications. Feedback welcome!
```

---

### 4. Reddit r/LocalLLaMA

**Title:** Free research APIs for local RAG: PubMed (4.5M articles) & ArXiv (2.7M papers) with full-text

**Post:**
```
For those building local RAG systems with medical/research data:

I published APIs + Python packages for searching:
- **PubMed**: 4.5M medical articles with FULL TEXT
- **ArXiv**: 2.7M papers in physics, math, CS, ML

Works great with local LLMs - just pull the docs and feed to your model.

```python
from langchain_builtsimple import BuiltSimplePubMedRetriever

retriever = BuiltSimplePubMedRetriever(include_full_text=True)
docs = retriever.invoke("diabetes treatment")

# Feed to your local LLM
context = "\n\n".join([d.page_content for d in docs])
```

Free tier, no API key needed for basic usage.

- pip install langchain-builtsimple
- pip install llama-index-readers-builtsimple

APIs: https://pubmed.built-simple.ai / https://arxiv.built-simple.ai
```

---

### 5. Twitter/X Thread

**Tweet 1:**
```
Just shipped: LangChain & LlamaIndex integrations for searching scientific literature 🔬

pip install langchain-builtsimple
pip install llama-index-readers-builtsimple

- 4.5M PubMed articles (with FULL TEXT!)
- 2.7M ArXiv papers
- Hybrid semantic + keyword search

🧵 Here's what makes it different...
```

**Tweet 2:**
```
Most research APIs only give you abstracts.

We indexed full article text for millions of PubMed papers. Your RAG system gets the complete paper, not a 300-word summary.

One line to enable:
retriever = BuiltSimplePubMedRetriever(include_full_text=True)
```

**Tweet 3:**
```
Works with both major RAG frameworks:

LangChain: Retrievers + Agent Tools
LlamaIndex: Readers for any pipeline

Free tier available. Built for medical AI, research assistants, and anyone tired of scraping PubMed XML.

https://github.com/Built-Simple
```

---

### 6. Dev.to Article (Draft Outline)

**Title:** How to Build a Medical RAG System with Full-Text PubMed Search

**Outline:**
1. The problem: Why PubMed is hard to use for RAG
2. Solution: Built-Simple's hybrid search API
3. Getting started with LangChain
4. Getting started with LlamaIndex
5. Enabling full-text retrieval
6. Building a complete RAG chain
7. Use cases: Medical chatbots, research assistants

---

## Posting Schedule

| Day | Platform | Status |
|-----|----------|--------|
| Today | r/Rag | □ |
| Today | r/LangChain | □ |
| Tomorrow AM | Hacker News | □ |
| Tomorrow | r/LocalLLaMA | □ |
| This week | Twitter thread | □ |
| This week | Dev.to article | □ |

## Communities to Join First

Before posting, join these to avoid looking like spam:

- [ ] r/Rag Discord server
- [ ] LangChain Slack (langchain.com/join-community)
- [ ] Answer a few questions helpfully first
