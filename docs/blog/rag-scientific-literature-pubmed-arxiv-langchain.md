# RAG for Scientific Literature: PubMed + ArXiv + LangChain Tutorial

*Build a comprehensive research assistant that searches 7+ million scientific papers across biomedical and technical domains*

---

Scientific research doesn't happen in silos. A machine learning researcher working on medical imaging needs access to both ArXiv (for the latest ML architectures) and PubMed (for clinical validation studies). A computational biologist needs ArXiv papers on algorithms alongside PubMed articles on molecular biology.

In this tutorial, you'll learn how to build a **multi-source RAG system** that combines PubMed's 4.5 million full-text biomedical articles with ArXiv's 2.7 million technical papers—all through a unified LangChain interface.

## Table of Contents

- [Why Multi-Source Scientific RAG?](#why-multi-source-scientific-rag)
- [Architecture Overview](#architecture-overview)
- [Setting Up Multiple Retrievers](#setting-up-multiple-retrievers)
- [Building a Unified Search Interface](#building-a-unified-search-interface)
- [Intelligent Source Routing](#intelligent-source-routing)
- [Cross-Domain Research Synthesis](#cross-domain-research-synthesis)
- [Advanced: Parallel Retrieval with Async](#advanced-parallel-retrieval-with-async)
- [Complete Implementation](#complete-implementation)

## Why Multi-Source Scientific RAG?

Traditional scientific search tools force researchers to query multiple databases separately, then manually synthesize results. This is time-consuming and error-prone.

A multi-source RAG system offers significant advantages:

| Single-Source RAG | Multi-Source RAG |
|-------------------|------------------|
| Limited to one domain | Cross-domain insights |
| Misses related work in other fields | Comprehensive coverage |
| Requires manual source selection | Intelligent routing |
| Separate queries per database | Unified interface |

**Real-world use cases:**

- **Drug discovery**: Combine pharmacology papers (PubMed) with computational chemistry (ArXiv)
- **Medical AI**: Link clinical studies (PubMed) with ML methods (ArXiv)
- **Bioinformatics**: Merge genomics research (PubMed) with algorithms (ArXiv)

## Architecture Overview

Our system uses a three-layer architecture:

```
┌─────────────────────────────────────────────────────┐
│                   User Query                         │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              Query Router / Classifier               │
│         (Determines which sources to search)         │
└─────────────────────────────────────────────────────┘
                    │         │
          ┌─────────┘         └─────────┐
          ▼                             ▼
┌─────────────────────┐     ┌─────────────────────┐
│   PubMed Retriever  │     │   ArXiv Retriever   │
│   (4.5M articles)   │     │   (2.7M papers)     │
└─────────────────────┘     └─────────────────────┘
          │                             │
          └─────────────┬───────────────┘
                        ▼
┌─────────────────────────────────────────────────────┐
│              Result Merger & Ranker                  │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                  LLM Synthesis                       │
└─────────────────────────────────────────────────────┘
```

## Setting Up Multiple Retrievers

First, install the required packages:

```bash
pip install langchain-builtsimple langchain-openai langchain
```

Now initialize both retrievers:

```python
from langchain_builtsimple import BuiltSimpleRetriever

# PubMed: Biomedical and life sciences
pubmed_retriever = BuiltSimpleRetriever(
    api_url="https://pubmed.built-simple.ai",
    k=5,
    score_threshold=0.25
)

# ArXiv: Physics, Math, CS, Biology, Finance, etc.
arxiv_retriever = BuiltSimpleRetriever(
    api_url="https://arxiv.built-simple.ai",
    k=5,
    score_threshold=0.25
)
```

Both retrievers share the same interface, making them easy to combine.

## Building a Unified Search Interface

Let's create an `EnsembleRetriever` that searches both sources:

```python
from langchain.retrievers import EnsembleRetriever

# Create ensemble with equal weights
ensemble_retriever = EnsembleRetriever(
    retrievers=[pubmed_retriever, arxiv_retriever],
    weights=[0.5, 0.5]  # Equal importance
)

# Search both sources at once
docs = ensemble_retriever.invoke("transformer models for protein structure prediction")

for doc in docs:
    source = doc.metadata.get('source', 'Unknown')
    title = doc.metadata.get('title', 'Untitled')
    print(f"[{source}] {title}")
```

You can adjust weights based on your use case:

```python
# Biomedical focus (70% PubMed, 30% ArXiv)
biomedical_ensemble = EnsembleRetriever(
    retrievers=[pubmed_retriever, arxiv_retriever],
    weights=[0.7, 0.3]
)

# Technical focus (30% PubMed, 70% ArXiv)
technical_ensemble = EnsembleRetriever(
    retrievers=[pubmed_retriever, arxiv_retriever],
    weights=[0.3, 0.7]
)
```

## Intelligent Source Routing

For better efficiency, we can route queries to the most relevant source(s) using an LLM classifier:

```python
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import List
from enum import Enum

class Source(str, Enum):
    PUBMED = "pubmed"
    ARXIV = "arxiv"
    BOTH = "both"

class QueryClassification(BaseModel):
    sources: List[Source] = Field(
        description="Which sources to search based on the query"
    )
    reasoning: str = Field(
        description="Brief explanation of source selection"
    )

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
classifier = llm.with_structured_output(QueryClassification)

def classify_query(query: str) -> QueryClassification:
    prompt = f"""Classify which scientific database(s) would best answer this query:

- PubMed: Biomedical, clinical medicine, pharmacology, life sciences, healthcare
- ArXiv: Physics, mathematics, computer science, ML/AI, quantitative biology, statistics

Query: {query}

Choose: pubmed, arxiv, or both"""

    return classifier.invoke(prompt)

# Example classifications
queries = [
    "What are the side effects of metformin?",
    "How does attention mechanism work in transformers?",
    "Machine learning models for cancer diagnosis",
    "Quantum computing algorithms",
]

for q in queries:
    result = classify_query(q)
    print(f"Query: {q}")
    print(f"Sources: {[s.value for s in result.sources]}")
    print(f"Reason: {result.reasoning}\n")
```

Now let's build a smart retriever that uses this classification:

```python
class SmartScientificRetriever:
    def __init__(self):
        self.pubmed = BuiltSimpleRetriever(
            api_url="https://pubmed.built-simple.ai",
            k=5
        )
        self.arxiv = BuiltSimpleRetriever(
            api_url="https://arxiv.built-simple.ai", 
            k=5
        )
        self.classifier = ChatOpenAI(model="gpt-4o-mini").with_structured_output(
            QueryClassification
        )
    
    def invoke(self, query: str):
        # Classify the query
        classification = self._classify(query)
        sources = [s.value for s in classification.sources]
        
        # Retrieve from appropriate sources
        all_docs = []
        
        if "pubmed" in sources or "both" in sources:
            pubmed_docs = self.pubmed.invoke(query)
            for doc in pubmed_docs:
                doc.metadata['source'] = 'PubMed'
            all_docs.extend(pubmed_docs)
        
        if "arxiv" in sources or "both" in sources:
            arxiv_docs = self.arxiv.invoke(query)
            for doc in arxiv_docs:
                doc.metadata['source'] = 'ArXiv'
            all_docs.extend(arxiv_docs)
        
        return all_docs
    
    def _classify(self, query: str):
        prompt = f"""Classify: pubmed (biomedical), arxiv (technical), or both.
Query: {query}"""
        return self.classifier.invoke(prompt)

# Usage
smart_retriever = SmartScientificRetriever()
docs = smart_retriever.invoke("CRISPR delivery mechanisms using nanoparticles")
```

## Cross-Domain Research Synthesis

The real power comes from synthesizing information across domains. Here's a complete RAG chain:

```python
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser

llm = ChatOpenAI(model="gpt-4o", temperature=0)

synthesis_template = """You are a scientific research assistant with access to both biomedical literature (PubMed) and technical papers (ArXiv).

Your task is to synthesize information from multiple sources to provide a comprehensive answer. When relevant, highlight connections between clinical/biological findings and computational/technical methods.

Sources:
{context}

Research Question: {question}

Provide a comprehensive synthesis that:
1. Summarizes key findings from each source type
2. Identifies connections between domains
3. Notes any gaps or contradictions
4. Cites sources with identifiers (PMID for PubMed, ArXiv ID for ArXiv)

Synthesis:"""

prompt = ChatPromptTemplate.from_template(synthesis_template)

def format_multi_source_docs(docs):
    formatted = []
    for doc in docs:
        source = doc.metadata.get('source', 'Unknown')
        if source == 'PubMed':
            id_field = f"PMID: {doc.metadata.get('pmid', 'N/A')}"
        else:
            id_field = f"ArXiv: {doc.metadata.get('arxiv_id', 'N/A')}"
        
        title = doc.metadata.get('title', 'Untitled')
        formatted.append(f"[{source}] [{id_field}] {title}\n{doc.page_content}")
    
    return "\n\n---\n\n".join(formatted)

# Build the synthesis chain
synthesis_chain = (
    {"context": smart_retriever.invoke | format_multi_source_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# Example: Cross-domain question
response = synthesis_chain.invoke(
    "How are graph neural networks being applied to drug discovery?"
)
print(response)
```

## Advanced: Parallel Retrieval with Async

For production applications, parallel retrieval significantly improves latency:

```python
import asyncio
from typing import List
from langchain.schema import Document

class AsyncScientificRetriever:
    def __init__(self):
        self.pubmed = BuiltSimpleRetriever(
            api_url="https://pubmed.built-simple.ai",
            k=5
        )
        self.arxiv = BuiltSimpleRetriever(
            api_url="https://arxiv.built-simple.ai",
            k=5
        )
    
    async def aretrieve(self, query: str) -> List[Document]:
        # Run both retrievers in parallel
        pubmed_task = asyncio.to_thread(self.pubmed.invoke, query)
        arxiv_task = asyncio.to_thread(self.arxiv.invoke, query)
        
        pubmed_docs, arxiv_docs = await asyncio.gather(pubmed_task, arxiv_task)
        
        # Tag sources
        for doc in pubmed_docs:
            doc.metadata['source'] = 'PubMed'
        for doc in arxiv_docs:
            doc.metadata['source'] = 'ArXiv'
        
        # Merge and sort by score
        all_docs = pubmed_docs + arxiv_docs
        all_docs.sort(key=lambda x: x.metadata.get('score', 0), reverse=True)
        
        return all_docs[:10]  # Top 10 across both sources

# Usage
async def search_literature(query: str):
    retriever = AsyncScientificRetriever()
    docs = await retriever.aretrieve(query)
    return docs

# Run async search
docs = asyncio.run(search_literature("federated learning in healthcare"))
```

## Complete Implementation

Here's a production-ready implementation you can use as a starting point:

```python
"""
Multi-Source Scientific RAG System
Combines PubMed (biomedical) and ArXiv (technical) literature
"""

from langchain_builtsimple import BuiltSimpleRetriever
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.retrievers import EnsembleRetriever
from langchain.schema.output_parser import StrOutputParser
from typing import Optional

class ScientificRAG:
    def __init__(
        self,
        model: str = "gpt-4o",
        pubmed_weight: float = 0.5,
        arxiv_weight: float = 0.5,
        docs_per_source: int = 5
    ):
        # Initialize retrievers
        self.pubmed = BuiltSimpleRetriever(
            api_url="https://pubmed.built-simple.ai",
            k=docs_per_source,
            score_threshold=0.2
        )
        self.arxiv = BuiltSimpleRetriever(
            api_url="https://arxiv.built-simple.ai",
            k=docs_per_source,
            score_threshold=0.2
        )
        
        # Create ensemble
        self.retriever = EnsembleRetriever(
            retrievers=[self.pubmed, self.arxiv],
            weights=[pubmed_weight, arxiv_weight]
        )
        
        # Initialize LLM
        self.llm = ChatOpenAI(model=model, temperature=0)
        
        # Build prompt
        self.prompt = ChatPromptTemplate.from_template(
            """You are a research assistant analyzing scientific literature from PubMed and ArXiv.

Literature Context:
{context}

Research Question: {question}

Provide a comprehensive, well-cited answer:"""
        )
    
    def search(self, query: str, source: Optional[str] = None):
        """Search one or both sources."""
        if source == "pubmed":
            return self.pubmed.invoke(query)
        elif source == "arxiv":
            return self.arxiv.invoke(query)
        else:
            return self.retriever.invoke(query)
    
    def query(self, question: str) -> str:
        """Full RAG pipeline: retrieve and synthesize."""
        docs = self.retriever.invoke(question)
        
        context = "\n\n".join([
            f"[{doc.metadata.get('source', 'Unknown')}] "
            f"{doc.metadata.get('title', 'Untitled')}\n"
            f"{doc.page_content[:1000]}"
            for doc in docs
        ])
        
        chain = self.prompt | self.llm | StrOutputParser()
        return chain.invoke({"context": context, "question": question})

# Interactive CLI
if __name__ == "__main__":
    print("Scientific Literature RAG (PubMed + ArXiv)")
    print("=" * 50)
    
    rag = ScientificRAG()
    
    while True:
        question = input("\nResearch question (or 'quit'): ").strip()
        if question.lower() == 'quit':
            break
        
        print("\nSearching 7M+ scientific papers...")
        response = rag.query(question)
        print(f"\n{response}")
```

## Conclusion

You've built a powerful multi-source RAG system that combines the strengths of PubMed and ArXiv. This architecture enables:

- **Comprehensive research coverage** across biomedical and technical domains
- **Intelligent source routing** to optimize relevance and efficiency
- **Cross-domain synthesis** that reveals connections traditional search misses
- **Production-ready patterns** including async retrieval and caching

**Next steps to explore:**

- Add more sources (Wikipedia, patents, clinical trials)
- Implement re-ranking with a cross-encoder
- Build a web interface with Streamlit or Gradio
- Add user feedback loops to improve retrieval

For a deep dive into why full-text search matters, check out [Full-Text PubMed Search vs Abstract-Only: Why It Matters for AI](/blog/full-text-pubmed-search-vs-abstract-only-ai).

---

*Built Simple provides semantic search APIs for scientific literature. Explore our [PubMed API](https://pubmed.built-simple.ai) and [ArXiv API](https://arxiv.built-simple.ai).*
