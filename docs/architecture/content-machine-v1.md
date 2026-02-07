# Content Machine v1 - Pipeline Architecture

> **Purpose:** Automated content generation at scale through research, knowledge synthesis, and AI-driven writing.
> **Status:** Draft v1
> **Date:** 2025-01-27

---

## 🎯 Overview

The Content Machine is a multi-stage pipeline that transforms raw web data into monetizable content assets. It operates in three phases:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   PHASE 1       │     │   PHASE 2       │     │   PHASE 3       │
│   RESEARCH      │────▶│   KNOWLEDGE     │────▶│   GENERATION    │
│   & SCRAPING    │     │   BASE (RAG)    │     │   & PUBLISH     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
     Crawler              Embeddings              Content Agent
     Data Automation      Vector Store            Multi-format Output
     Source APIs          Retrieval               Distribution
```

---

## 📊 Phase 1: Research & Scraping

### Components

| Component | Function | Implementation |
|-----------|----------|----------------|
| **Web Crawler** | Deep crawl target domains | `run_crawl(url, depth=2, max_pages=100)` |
| **Data Automation** | Structure extraction | `get_bedrock_data_automation_client()` |
| **Source APIs** | Authoritative data | PubMed, ArXiv, Wikipedia APIs |
| **News Feeds** | Trending topics | RSS aggregation + Brave Search |

### Crawler Strategy

```python
# Crawl configuration per content vertical
CRAWL_CONFIGS = {
    "tech_news": {
        "seeds": ["techcrunch.com", "theverge.com", "arstechnica.com"],
        "depth": 2,
        "max_pages": 500,
        "refresh_hours": 6
    },
    "health_wellness": {
        "seeds": ["healthline.com", "webmd.com", "mayoclinic.org"],
        "depth": 3,
        "max_pages": 1000,
        "refresh_hours": 24
    },
    "finance": {
        "seeds": ["investopedia.com", "bloomberg.com"],
        "depth": 2,
        "max_pages": 300,
        "refresh_hours": 4
    }
}
```

### Data Pipeline Flow

```
Raw HTML → Data Automation (extraction) → Cleaned JSON → Chunk Splitter → Embedding Queue
```

**Chunking Strategy:**
- **Semantic chunking** (preferred): Split on topic boundaries
- **Size-based fallback**: 512 tokens with 50-token overlap
- **Metadata preserved**: source URL, timestamp, author, category

---

## 🧠 Phase 2: RAG Knowledge Base

### Vector Store Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    VECTOR DATABASE                        │
│                    (PostgreSQL + pgvector)                │
├──────────────────────────────────────────────────────────┤
│  Collection: tech_news                                   │
│  Collection: health_wellness                             │
│  Collection: finance                                     │
│  Collection: general_knowledge                           │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │   Embedding Service     │
              │   Titan Embed v2        │
              │   1024 dimensions       │
              └─────────────────────────┘
```

### Embedding Pipeline

```python
def ingest_content(content: str, metadata: dict) -> str:
    """Ingest content into the knowledge base."""
    
    # 1. Generate embedding
    embedding = create_bedrock_embeddings(
        input_text=content,
        model_id='amazon.titan-embed-text-v2:0'
    )
    
    # 2. Store with metadata
    doc_id = vector_store.upsert(
        embedding=embedding,
        content=content,
        metadata={
            **metadata,
            "ingested_at": datetime.utcnow().isoformat(),
            "content_hash": hashlib.md5(content.encode()).hexdigest()
        }
    )
    
    return doc_id
```

### Retrieval Strategy

| Query Type | Top-K | Reranking | Use Case |
|------------|-------|-----------|----------|
| Factual | 5 | Cross-encoder | Accuracy-critical content |
| Creative | 15 | Diversity filter | Inspiration/variety |
| News | 10 | Recency boost | Time-sensitive topics |

---

## ✍️ Phase 3: Content Generation

### Multi-Agent Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CONTENT ORCHESTRATOR                         │
├─────────────────────────────────────────────────────────────────┤
│                              │                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   RESEARCH   │  │   WRITER     │  │   EDITOR     │          │
│  │   AGENT      │  │   AGENT      │  │   AGENT      │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         ▼                 ▼                 ▼                   │
│    Query RAG         Generate          Polish &                │
│    Find sources      Draft content     Fact-check              │
│    Outline           Multiple formats  SEO optimize            │
└─────────────────────────────────────────────────────────────────┘
```

### Content Writer Agent System Prompt

```markdown
# CONTENT CREATOR AGENT - System Prompt

You are an expert content creator in the Content Machine pipeline. Your role is to 
transform research and retrieved knowledge into high-quality, engaging content.

## Your Identity
- **Role:** Professional content writer with expertise in [VERTICAL]
- **Voice:** Authoritative yet accessible, data-driven but engaging
- **Goal:** Create content that ranks, converts, and provides genuine value

## Input You Receive
1. **Topic Brief:** The subject and angle for the content
2. **Retrieved Context:** Relevant chunks from the RAG knowledge base
3. **Source Metadata:** URLs and timestamps for citations
4. **Content Type:** Blog post, social thread, newsletter, etc.
5. **Target Specs:** Word count, reading level, SEO keywords

## Content Generation Rules

### Quality Standards
- ALWAYS cite sources with inline references
- NEVER fabricate statistics or quotes
- Use retrieved context as your primary information source
- If context is insufficient, explicitly flag gaps
- Write at the specified reading level (default: 8th grade)

### SEO Integration
- Include primary keyword in: title, first 100 words, one H2, conclusion
- Use semantic variations naturally throughout
- Target featured snippet format where applicable
- Include FAQ section when relevant

### Format Templates

**Blog Post (1000-2000 words):**
1. Hook/opening that addresses reader pain point
2. Quick answer/summary (featured snippet bait)
3. Detailed explanation with subheadings
4. Supporting evidence from retrieved sources
5. Practical takeaways/action items
6. Conclusion with CTA

**Social Thread (Twitter/X):**
1. Hook tweet (controversial take or surprising fact)
2. Context/setup (2-3 tweets)
3. Main points (numbered list format)
4. Evidence/examples
5. Conclusion + engagement prompt
6. CTA tweet

**Newsletter:**
1. Personal greeting
2. One big idea/insight
3. 3 supporting points with links
4. Quick wins/tips section
5. CTA and sign-off

## Output Format

Return your content as structured JSON:
```json
{
  "title": "SEO-optimized headline",
  "meta_description": "155 chars max",
  "content": "Full formatted content with markdown",
  "sources": ["url1", "url2"],
  "keywords": ["primary", "secondary", "tertiary"],
  "reading_time_minutes": 5,
  "content_score": {
    "seo": 85,
    "readability": 90,
    "originality": 75
  }
}
```

## Constraints
- Stay within word count ±10%
- Maximum 3 external links per 500 words
- Include at least 1 original insight/angle not in source material
- Never use: "In conclusion", "In this article", "As we all know"
```

---

## 💰 Monetization Strategies

### Revenue Streams

| Channel | Model | Estimated RPM | Scale Factor |
|---------|-------|---------------|--------------|
| **Ad-supported blogs** | Display ads (Mediavine) | $15-40 | High volume |
| **Newsletter sponsorships** | CPM/flat rate | $25-75 | List size |
| **Affiliate content** | CPA/commission | Variable | Conversion |
| **Gated premium content** | Subscription | $5-20/user/mo | Retention |
| **White-label API** | Usage-based | $0.10-0.50/article | B2B |
| **Content licensing** | Per-piece | $50-500/article | Quality |

### Unit Economics

```
Cost per article (fully loaded):
├── Crawling/data: $0.01-0.05
├── Embeddings: $0.002 per 1K tokens
├── LLM generation: $0.05-0.30 (depending on model)
├── Review/QA: $0.10 (automated) or $2-5 (human)
└── Total: $0.17-0.50 per article (automated)
         $2.17-5.50 per article (human QA)

Revenue per article:
├── SEO blog (1yr lifetime): $5-50 (ad revenue)
├── Affiliate piece: $10-200 (commission)
├── Sponsored: $100-1000 (flat fee)
└── Margin: 10x-100x at scale
```

### Scale Architecture

```
                    ┌─────────────────┐
                    │   ORCHESTRATOR  │
                    │   (Queue-based) │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  CONTENT POOL   │ │  CONTENT POOL   │ │  CONTENT POOL   │
│  (Tech Niche)   │ │  (Health Niche) │ │  (Finance Niche)│
│  10 sites       │ │  5 sites        │ │  3 sites        │
│  100 posts/day  │ │  50 posts/day   │ │  30 posts/day   │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

**Daily throughput at scale:**
- 180 articles/day across verticals
- ~5,400 articles/month
- Estimated monthly revenue: $27K-270K (depending on monetization mix)

---

## 🔧 Technical Implementation

### Service Architecture

```yaml
services:
  # Phase 1: Research
  crawler:
    image: content-machine/crawler
    replicas: 3
    environment:
      - MAX_CONCURRENT=10
      - RATE_LIMIT_MS=1000
  
  data-processor:
    image: content-machine/processor
    environment:
      - BEDROCK_REGION=us-east-1
  
  # Phase 2: Knowledge Base
  vector-db:
    image: pgvector/pgvector:pg16
    volumes:
      - vectors:/var/lib/postgresql/data
  
  embedding-service:
    image: content-machine/embedder
    environment:
      - MODEL_ID=amazon.titan-embed-text-v2:0
  
  # Phase 3: Generation
  content-agent:
    image: content-machine/generator
    environment:
      - MODEL=claude-3-5-sonnet
      - MAX_TOKENS=4096
  
  # Publishing
  publisher:
    image: content-machine/publisher
    environment:
      - WORDPRESS_API=true
      - GHOST_API=true
      - SOCIAL_POSTING=true
```

### Deployment

```python
# Deploy to built-simple.ai infrastructure
webapp_deployment_help_tool(
    app_id="content-machine",
    domain="built-simple.ai"
)

# Endpoints:
# - https://content-machine.built-simple.ai/api/generate
# - https://content-machine.built-simple.ai/api/queue
# - https://content-machine.built-simple.ai/dashboard
```

### Database Schema

```sql
-- Content tracking
CREATE TABLE content_jobs (
    id UUID PRIMARY KEY,
    vertical VARCHAR(50),
    topic TEXT,
    status VARCHAR(20), -- queued, researching, writing, reviewing, published
    created_at TIMESTAMP,
    published_at TIMESTAMP,
    publish_url TEXT,
    metrics JSONB
);

-- Knowledge chunks
CREATE TABLE knowledge_chunks (
    id UUID PRIMARY KEY,
    content TEXT,
    embedding vector(1024),
    source_url TEXT,
    vertical VARCHAR(50),
    ingested_at TIMESTAMP,
    metadata JSONB
);

CREATE INDEX ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops);
```

---

## 📈 Metrics & Monitoring

### KPIs to Track

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Articles/day | 180 | <150 |
| Avg generation time | <60s | >120s |
| RAG relevance score | >0.8 | <0.6 |
| Plagiarism score | <5% | >15% |
| SEO score | >80 | <60 |
| Revenue per article | >$5 | <$1 |

### Quality Gates

```python
def quality_gate(article: dict) -> bool:
    """All checks must pass before publishing."""
    return all([
        article['plagiarism_score'] < 0.15,
        article['seo_score'] > 60,
        article['readability_score'] > 70,
        article['factual_grounding'] > 0.8,  # % claims with RAG support
        article['word_count'] >= article['target_words'] * 0.9
    ])
```

---

## 🚀 Roadmap

### Phase 1: MVP (Weeks 1-4)
- [ ] Basic crawler → embedding → generation pipeline
- [ ] Single vertical (tech news)
- [ ] Manual review queue
- [ ] WordPress publishing

### Phase 2: Scale (Weeks 5-8)
- [ ] Multi-vertical support
- [ ] Automated quality gates
- [ ] Social media distribution
- [ ] Newsletter integration

### Phase 3: Monetization (Weeks 9-12)
- [ ] Affiliate link injection
- [ ] Ad optimization
- [ ] Premium content gating
- [ ] B2B API access

### Phase 4: Autonomy (Weeks 13+)
- [ ] Self-optimizing topic selection (based on revenue data)
- [ ] Automatic A/B testing headlines
- [ ] Trend prediction and proactive content creation
- [ ] Full closed-loop with revenue feedback

---

## ⚠️ Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Google penalties for AI content | Human review layer, unique angles, E-E-A-T signals |
| Copyright issues | Source attribution, fair use limits, content transformation |
| Quality drift | Automated scoring, periodic audits, feedback loops |
| API costs at scale | Batch processing, caching, smaller models for drafts |
| Single point of failure | Multi-provider (Anthropic + OpenAI + Bedrock) |

---

## 📝 Notes

- Start with one vertical, prove economics, then expand
- Human-in-the-loop for first 1000 articles to train quality models
- Consider legal review for affiliate/sponsored content disclosure
- Build in kill switch for any content flagged in production

---

*Architecture designed for Built Simple infrastructure. Contact: content-machine@built-simple.ai*
