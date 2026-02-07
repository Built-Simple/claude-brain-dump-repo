# Competitive Pricing Analysis: Scientific Literature APIs

*Last Updated: February 2026*

## Executive Summary

Built Simple operates three research/scientific literature APIs:
- **PubMed API** (pubmed.built-simple.ai) - GPU-accelerated semantic search with vector embeddings
- **ArXiv API** (arxiv.built-simple.ai) - FAISS-based semantic search over preprints  
- **Wikipedia API** (wikipedia.built-simple.ai) - 4.8M+ vector embeddings with hybrid search

This document analyzes competitor pricing to inform Built Simple's API pricing strategy.

---

## Competitor Analysis

### 1. NCBI PubMed E-utilities (Official)

| Attribute | Details |
|-----------|---------|
| **URL** | https://www.ncbi.nlm.nih.gov/home/develop/api/ |
| **Pricing** | **Free** (public service) |
| **Rate Limits** | 3 req/sec (unauthenticated), 10 req/sec (with API key), negotiable for higher |
| **Features** | Metadata search, abstracts, full records, citation data |
| **Full Text** | No (abstracts only; PMC has some full text) |
| **Semantic Search** | No (keyword-based only) |
| **Limitations** | Basic keyword matching; no AI/semantic features; rate limits; no commercial support |

**Notes:** The official E-utilities are free but offer no semantic search capabilities. Users needing AI-powered search must build their own infrastructure or use third-party services.

---

### 2. Semantic Scholar API

| Attribute | Details |
|-----------|---------|
| **URL** | https://www.semanticscholar.org/product/api |
| **Pricing** | **Free** (public and authenticated) |
| **Rate Limits** | 100 req/5min (unauthenticated), 1000 req/sec shared pool, 5000 req/5min (authenticated) |
| **Features** | Paper search, author profiles, citations, references, TLDR summaries |
| **Full Text** | No (abstracts, metadata, AI-generated summaries) |
| **Semantic Search** | Yes (AI-powered) |
| **Limitations** | Limited to their corpus (~200M papers); no custom embeddings; shared rate limits |

**Notes:** Strong competitor with AI features. Free model supported by Allen Institute for AI. Good for general use but lacks customization.

---

### 3. arXiv API (Official)

| Attribute | Details |
|-----------|---------|
| **URL** | https://info.arxiv.org/help/api/index.html |
| **Pricing** | **Free** (public service) |
| **Rate Limits** | Recommended: 1 req/3 seconds; max 30,000 results per query |
| **Features** | Atom feed search, metadata, categories, date filtering |
| **Full Text** | No (links to PDFs; metadata only via API) |
| **Semantic Search** | No (keyword/category based) |
| **Limitations** | Slow; no semantic search; XML/Atom only; basic filtering |

**Notes:** Official service is minimal. Many startups build value-added layers on top.

---

### 4. OpenAlex

| Attribute | Details |
|-----------|---------|
| **URL** | https://openalex.org / https://docs.openalex.org |
| **Pricing** | **Free** (CC0 data) |
| **Rate Limits** | 100,000 req/day (no auth required); 10 req/sec polite limit |
| **Features** | Works, authors, institutions, concepts, venues; filtering; faceting |
| **Full Text** | No (metadata only) |
| **Semantic Search** | No (but has concept tagging) |
| **Limitations** | No full-text search; large data but basic API |

**Premium:** Available for institutions needing higher limits (free for academic researchers upon request).

**Notes:** Excellent free resource but lacks semantic search. Good for bibliometrics.

---

### 5. Elsevier (ScienceDirect/Scopus APIs)

| Attribute | Details |
|-----------|---------|
| **URL** | https://dev.elsevier.com |
| **Pricing** | **Free for non-commercial use** (institutional access); Enterprise pricing on request |
| **Rate Limits** | 20,000 req/week (Scopus); throttled by tier (Development/Low/Medium/High) |
| **Features** | Full-text articles, abstracts, citations, author data, affiliations |
| **Full Text** | Yes (for subscribed content) |
| **Semantic Search** | No |
| **Limitations** | Requires institutional subscription; commercial use requires licensing; weekly quotas |

**Notes:** High-value content but restricted access model. Not suitable for most commercial applications without enterprise agreements.

---

### 6. Springer Nature APIs

| Attribute | Details |
|-----------|---------|
| **URL** | https://dev.springernature.com |
| **Pricing** | **Free (Basic)** / **Premium (paid)** |

**Tiers:**
| Plan | Daily Hits | Throttle | Keys | Features |
|------|-----------|----------|------|----------|
| Basic (Free) | 500/day | 100/min | 1 | Standard queries |
| Premium | 10,000/day | 300/min | Multiple | Advanced queries |

| Features | Details |
|----------|---------|
| **Full Text** | Yes (Open Access content) |
| **Semantic Search** | No |
| **Limitations** | OA content only on free tier; institutional pricing for TDM |

**Notes:** Reasonable free tier for testing. Premium pricing is contact-based for institutions.

---

### 7. CORE (core.ac.uk)

| Attribute | Details |
|-----------|---------|
| **URL** | https://core.ac.uk/services/api |
| **Pricing** | **Free** (with rate limits); Paid for faster access |
| **Rate Limits** | 1 batch/10sec, 5 single/10sec (free); higher for members |
| **Features** | 210M+ OA articles, full-text access, metadata |
| **Full Text** | Yes (40M+ documents) |
| **Semantic Search** | No |
| **Limitations** | Slow on free tier; requires membership for production use |

**Membership:** Supporting/Sustaining members get faster rates included.

---

### 8. Europe PMC

| Attribute | Details |
|-----------|---------|
| **URL** | https://europepmc.org/RestfulWebService |
| **Pricing** | **Free** |
| **Rate Limits** | ~10 req/sec |
| **Features** | 33M+ publications, annotations, citations, data links |
| **Full Text** | Partial (OA subset) |
| **Semantic Search** | No |
| **Limitations** | Europe-focused; no semantic search |

---

### 9. Crossref

| Attribute | Details |
|-----------|---------|
| **URL** | https://www.crossref.org/documentation/retrieve-metadata/rest-api/ |
| **Pricing** | **Free** (Metadata Plus for enterprise) |

**Rate Limits (Dec 2025 changes):**
| Pool | Single Record | List Queries | Concurrency |
|------|---------------|--------------|-------------|
| Public | 5/sec | 1/sec | 1 |
| Polite (with email) | 10/sec | 3/sec | 3 |

| Features | Details |
|----------|---------|
| **Content** | 180M+ DOI records, metadata, references |
| **Full Text** | No |
| **Semantic Search** | No |

---

### 10. The Lens (lens.org)

| Attribute | Details |
|-----------|---------|
| **URL** | https://docs.api.lens.org |
| **Pricing** | **Free (trial)** / **Paid (institutional)** |
| **Rate Limits** | Limited for trial; up to 100K records for institutions |
| **Features** | Patents + scholarly works, citations, analytics |
| **Full Text** | No |
| **Semantic Search** | No |
| **Limitations** | Best features require institutional subscription |

---

### 11. Unpaywall

| Attribute | Details |
|-----------|---------|
| **URL** | https://unpaywall.org/products/api |
| **Pricing** | **Free** |
| **Rate Limits** | 100,000 req/day (suggested) |
| **Features** | Open access availability lookup by DOI |
| **Full Text** | Links to OA versions |
| **Semantic Search** | No |
| **Limitations** | Lookup only; not a search API |

---

### 12. Web of Science (Clarivate)

| Attribute | Details |
|-----------|---------|
| **URL** | https://developer.clarivate.com |
| **Pricing** | **Paid license required** (institutional subscription) |
| **Rate Limits** | Varies by plan |
| **Features** | Premium citation data, impact metrics, curated content |
| **Full Text** | No |
| **Semantic Search** | No |
| **Limitations** | Expensive; requires institutional WoS subscription |

---

### 13. SerpAPI (Google Scholar)

| Attribute | Details |
|-----------|---------|
| **URL** | https://serpapi.com/google-scholar-api |
| **Pricing** | **Paid** (with free trial) |

**Pricing Tiers:**
| Plan | Searches/Month | Price |
|------|----------------|-------|
| Free | 100 | $0 |
| Developer | 5,000 | $75/mo |
| Production | 15,000 | $150/mo |
| Business | 30,000+ | $250+/mo |

| Features | Details |
|----------|---------|
| **Content** | Google Scholar scraping |
| **Semantic Search** | Via Google |
| **Limitations** | Scraping-based; ToS gray area; no direct database access |

**Notes:** Useful comparison for per-search pricing: ~$0.005-0.015/search at scale.

---

## Market Positioning Summary

| Competitor | Pricing Model | Semantic Search | Full Text | Best For |
|------------|---------------|-----------------|-----------|----------|
| NCBI E-utils | Free | ❌ | ❌ | Basic PubMed access |
| Semantic Scholar | Free | ✅ | ❌ | Academic research |
| arXiv (official) | Free | ❌ | ❌ | Preprint metadata |
| OpenAlex | Free | ❌ | ❌ | Bibliometrics |
| Springer Nature | Freemium | ❌ | ✅ (OA) | Publisher content |
| CORE | Free/Paid | ❌ | ✅ | OA aggregation |
| SerpAPI | $75-250+/mo | ✅ (Google) | ❌ | Scholar scraping |
| **Built Simple** | **TBD** | **✅** | **❌** | **AI-powered semantic search** |

---

## Built Simple Competitive Advantages

1. **GPU-Accelerated Semantic Search** - FAISS + vector embeddings for true meaning-based search
2. **Hybrid Search** (Wikipedia) - Combines vector + keyword for best results
3. **Modern API Design** - FastAPI, JSON responses, clean endpoints
4. **Low Latency** - GPU acceleration provides fast responses
5. **Specialized Indices** - Purpose-built for each domain

### Key Differentiator
Built Simple offers what most free APIs lack: **semantic/AI-powered search** on scientific literature. This fills the gap between:
- Free APIs (no semantic search)
- Enterprise services (expensive, complex licensing)

---

## Recommended Pricing Strategy

### Pricing Philosophy
Position Built Simple as the **affordable semantic search layer** for developers who need AI capabilities without enterprise budgets.

### Proposed Tiers

#### 1. Free Tier (Developer/Testing)
| Feature | Limit |
|---------|-------|
| Requests | 1,000/month |
| Rate | 10/minute |
| Support | Community |
| Purpose | Testing, prototyping |

#### 2. Starter ($29/month)
| Feature | Limit |
|---------|-------|
| Requests | 25,000/month |
| Rate | 60/minute |
| APIs | All 3 (PubMed, ArXiv, Wikipedia) |
| Support | Email |
| Purpose | Small projects, indie developers |

#### 3. Professional ($99/month)
| Feature | Limit |
|---------|-------|
| Requests | 100,000/month |
| Rate | 120/minute |
| APIs | All 3 |
| Support | Priority email |
| Purpose | Startups, research tools |

#### 4. Business ($299/month)
| Feature | Limit |
|---------|-------|
| Requests | 500,000/month |
| Rate | 300/minute |
| APIs | All 3 |
| Support | Slack/dedicated |
| Purpose | Production applications |

#### 5. Enterprise (Custom)
| Feature | Details |
|---------|---------|
| Requests | Unlimited |
| Rate | Custom |
| Features | SLA, dedicated support, custom endpoints |
| Purpose | Large organizations |

### Per-Request Pricing (Overage)
- **$0.001/request** (after tier limit)
- Competitive with SerpAPI ($0.005-0.015) but lower due to direct database access

### Annual Discount
- 2 months free (17% discount) for annual billing

---

## Pricing Justification

| Factor | Rationale |
|--------|-----------|
| **Free tier** | Matches Semantic Scholar, OpenAlex; drives adoption |
| **$29 starter** | Below SerpAPI ($75), accessible to students/indie devs |
| **$99 professional** | Competitive with Springer Premium concept |
| **$299 business** | Standard B2B SaaS pricing; below enterprise minimums |
| **$0.001 overage** | 5-15x cheaper than scraping services |

---

## Competitive Response Matrix

| If competitor... | Then we... |
|------------------|------------|
| Semantic Scholar adds rate limits | Emphasize reliable, paid SLA |
| arXiv adds semantic search | Highlight multi-source + Wikipedia |
| New AI research APIs emerge | Focus on pricing + performance |
| Enterprise discounts | Match for academic institutions |

---

## Recommendations

1. **Launch with Free + Starter tiers** to drive adoption
2. **Emphasize semantic search** as key differentiator from free APIs
3. **Target AI developers** building RAG/LLM applications
4. **Offer academic discounts** (50% off) to build community
5. **Consider usage-based billing** as alternative to tiers

---

## Next Steps

1. [ ] Set up Stripe billing integration
2. [ ] Implement API key management
3. [ ] Add rate limiting by tier
4. [ ] Create pricing page on built-simple.ai
5. [ ] Develop API documentation site
6. [ ] Build usage dashboard for customers

---

*Document prepared for Built Simple API pricing strategy*
