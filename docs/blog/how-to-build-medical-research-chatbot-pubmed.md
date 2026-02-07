# How to Build a Medical Research Chatbot with PubMed Full-Text Search

*Build an AI-powered medical research assistant that searches 4.5 million full-text PubMed articles in minutes*

---

Medical professionals, researchers, and healthcare organizations need fast access to the latest scientific literature. But building a chatbot that can accurately answer medical questions requires more than just an LLM—it needs access to authoritative, peer-reviewed sources.

In this tutorial, you'll learn how to build a medical research chatbot that leverages **full-text PubMed search** to provide evidence-based answers with proper citations.

## Table of Contents

- [Why Full-Text Search Matters for Medical AI](#why-full-text-search-matters-for-medical-ai)
- [Prerequisites](#prerequisites)
- [Setting Up Your Environment](#setting-up-your-environment)
- [Building the Basic Chatbot](#building-the-basic-chatbot)
- [Adding Citation Support](#adding-citation-support)
- [Implementing Conversational Memory](#implementing-conversational-memory)
- [Production Considerations](#production-considerations)
- [Complete Code Example](#complete-code-example)

## Why Full-Text Search Matters for Medical AI

Most PubMed APIs only search abstracts—the 200-300 word summaries that precede each paper. This is a critical limitation for medical AI applications:

- **Methodology details** live in the Methods section
- **Dosage information** appears in the Results
- **Contraindications** are often buried in the Discussion
- **Clinical recommendations** may only appear in Conclusions

The [Built Simple PubMed API](https://pubmed.built-simple.ai) provides access to **4.5 million full-text articles**, enabling your chatbot to find information that abstract-only search would miss entirely.

## Prerequisites

Before we begin, ensure you have:

- Python 3.9 or higher
- An OpenAI API key (or another LLM provider)
- Basic familiarity with LangChain

## Setting Up Your Environment

First, install the required packages:

```bash
pip install langchain-builtsimple langchain-openai langchain
```

Set your environment variables:

```bash
export OPENAI_API_KEY="your-openai-key"
```

## Building the Basic Chatbot

Let's start with a simple chatbot that can search PubMed and answer medical questions.

### Step 1: Initialize the Retriever

```python
from langchain_builtsimple import BuiltSimpleRetriever

# Initialize the PubMed retriever
retriever = BuiltSimpleRetriever(
    api_url="https://pubmed.built-simple.ai",
    k=5,  # Number of documents to retrieve
    score_threshold=0.3  # Minimum relevance score
)
```

The `BuiltSimpleRetriever` connects to the PubMed full-text search API. The `k` parameter controls how many documents to retrieve, and `score_threshold` filters out low-relevance results.

### Step 2: Create the RAG Chain

```python
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser

# Initialize the LLM
llm = ChatOpenAI(model="gpt-4o", temperature=0)

# Create a medical-focused prompt
template = """You are a medical research assistant. Answer the question based only on the provided context from PubMed articles.

If the context doesn't contain enough information to answer the question, say so clearly. Always cite your sources using the article titles and PMIDs.

Context:
{context}

Question: {question}

Provide a detailed, evidence-based answer:"""

prompt = ChatPromptTemplate.from_template(template)

# Helper function to format documents
def format_docs(docs):
    formatted = []
    for doc in docs:
        pmid = doc.metadata.get('pmid', 'Unknown')
        title = doc.metadata.get('title', 'Untitled')
        formatted.append(f"[PMID: {pmid}] {title}\n{doc.page_content}")
    return "\n\n---\n\n".join(formatted)

# Build the RAG chain
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)
```

### Step 3: Test the Chatbot

```python
# Ask a medical question
response = rag_chain.invoke(
    "What are the latest treatments for treatment-resistant depression?"
)
print(response)
```

This simple chain retrieves relevant full-text articles and uses them to generate an evidence-based response.

## Adding Citation Support

Medical applications require proper citations. Let's enhance our chatbot to return structured responses with sources.

```python
from typing import List
from pydantic import BaseModel, Field

class Citation(BaseModel):
    pmid: str = Field(description="PubMed ID")
    title: str = Field(description="Article title")
    authors: str = Field(description="First author et al.")
    year: str = Field(description="Publication year")

class MedicalResponse(BaseModel):
    answer: str = Field(description="The evidence-based answer")
    citations: List[Citation] = Field(description="Sources used")
    confidence: str = Field(description="low, medium, or high")

# Create a structured output chain
structured_llm = llm.with_structured_output(MedicalResponse)

def create_response_with_citations(question: str):
    # Get documents
    docs = retriever.invoke(question)
    
    # Build context with metadata
    context_parts = []
    available_citations = []
    
    for doc in docs:
        metadata = doc.metadata
        pmid = metadata.get('pmid', 'Unknown')
        title = metadata.get('title', 'Untitled')
        authors = metadata.get('authors', 'Unknown authors')
        year = metadata.get('year', 'Unknown year')
        
        context_parts.append(f"[{pmid}] {doc.page_content}")
        available_citations.append({
            "pmid": pmid,
            "title": title,
            "authors": authors,
            "year": year
        })
    
    context = "\n\n".join(context_parts)
    
    # Generate structured response
    citation_prompt = f"""Based on the following PubMed articles, answer the medical question.

Context:
{context}

Available citations: {available_citations}

Question: {question}

Provide an evidence-based answer with proper citations."""

    return structured_llm.invoke(citation_prompt)

# Example usage
result = create_response_with_citations(
    "What is the efficacy of ketamine for depression?"
)
print(f"Answer: {result.answer}")
print(f"Confidence: {result.confidence}")
print("\nCitations:")
for cite in result.citations:
    print(f"  - {cite.authors} ({cite.year}). {cite.title}. PMID: {cite.pmid}")
```

## Implementing Conversational Memory

For a true chatbot experience, we need to maintain conversation history:

```python
from langchain.memory import ConversationBufferWindowMemory
from langchain.chains import ConversationalRetrievalChain

# Create memory that keeps last 5 exchanges
memory = ConversationBufferWindowMemory(
    memory_key="chat_history",
    return_messages=True,
    k=5
)

# Build conversational chain
conversational_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    memory=memory,
    return_source_documents=True,
    verbose=True
)

# Chat loop
def chat(user_input: str):
    result = conversational_chain.invoke({"question": user_input})
    return result["answer"], result["source_documents"]

# Example conversation
answer1, sources1 = chat("What causes Parkinson's disease?")
print(answer1)

answer2, sources2 = chat("What are the early symptoms?")  # Follows up on Parkinson's
print(answer2)

answer3, sources3 = chat("Are there any new treatments being researched?")
print(answer3)
```

## Production Considerations

### Rate Limiting and Caching

For production deployments, implement caching to reduce API calls:

```python
from langchain.cache import SQLiteCache
from langchain.globals import set_llm_cache

# Cache LLM responses
set_llm_cache(SQLiteCache(database_path=".langchain.db"))
```

### Error Handling

Always handle API errors gracefully:

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def safe_retrieve(question: str):
    try:
        return retriever.invoke(question)
    except Exception as e:
        print(f"Retrieval error: {e}")
        return []
```

### Medical Disclaimer

Always include appropriate disclaimers:

```python
DISCLAIMER = """
⚠️ MEDICAL DISCLAIMER: This information is for educational purposes only 
and should not replace professional medical advice. Always consult with 
a qualified healthcare provider for medical decisions.
"""

def get_response_with_disclaimer(question: str):
    response = rag_chain.invoke(question)
    return f"{response}\n\n{DISCLAIMER}"
```

## Complete Code Example

Here's the full implementation you can copy and run:

```python
"""
Medical Research Chatbot with PubMed Full-Text Search
"""

from langchain_builtsimple import BuiltSimpleRetriever
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser

# Initialize components
retriever = BuiltSimpleRetriever(
    api_url="https://pubmed.built-simple.ai",
    k=5,
    score_threshold=0.3
)

llm = ChatOpenAI(model="gpt-4o", temperature=0)

template = """You are a medical research assistant with access to peer-reviewed PubMed articles.

Instructions:
1. Answer based ONLY on the provided context
2. Cite sources using PMID numbers
3. If uncertain, acknowledge limitations
4. Include relevant statistics when available

Context from PubMed:
{context}

Question: {question}

Evidence-based answer:"""

prompt = ChatPromptTemplate.from_template(template)

def format_docs(docs):
    return "\n\n---\n\n".join([
        f"[PMID: {d.metadata.get('pmid', 'N/A')}] {d.metadata.get('title', 'Untitled')}\n{d.page_content}"
        for d in docs
    ])

chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# Interactive chat
if __name__ == "__main__":
    print("Medical Research Chatbot (type 'quit' to exit)")
    print("-" * 50)
    
    while True:
        question = input("\nYour question: ").strip()
        if question.lower() == 'quit':
            break
        
        print("\nSearching PubMed full-text articles...")
        response = chain.invoke(question)
        print(f"\n{response}")
        print("\n⚠️ Consult a healthcare provider for medical advice.")
```

## Conclusion

You've built a medical research chatbot that leverages full-text PubMed search to provide evidence-based answers. Unlike abstract-only solutions, this approach can find specific details buried deep within research papers.

**Key takeaways:**

- Full-text search finds information abstracts miss
- Structured outputs enable proper citation tracking
- Conversation memory creates natural chat experiences
- Production apps need caching, error handling, and disclaimers

Ready to explore more? Check out our tutorial on [combining PubMed with ArXiv for comprehensive scientific RAG](/blog/rag-scientific-literature-pubmed-arxiv-langchain).

---

*Built Simple provides semantic search APIs for scientific literature. Learn more at [built-simple.ai](https://built-simple.ai).*
