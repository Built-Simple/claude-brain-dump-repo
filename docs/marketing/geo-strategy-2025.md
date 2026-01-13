# Generative Engine Optimization (GEO) Strategy - 2025 Playbook

**Last Updated:** January 13, 2026
**Status:** In Progress - llms.txt Deployed

## Executive Summary

AI-referred traffic grew **527% between January and May 2025**, and these visitors convert at **4.4x the rate** of traditional organic search. This document provides our comprehensive GEO strategy for Built Simple's product ecosystem.

**Current Status:**
- ✅ llms.txt deployed across all 6 properties
- ⏳ Schema markup implementation pending
- ⏳ Platform-specific optimizations pending
- ⏳ Tracking infrastructure pending

---

## Key Insights

### Brand Mentions > Backlinks
- Brand web mentions have **0.664 correlation** with AI visibility (stronger than backlinks)
- **82.5% of AI citations** go to deeply nested, topic-specific pages
- **76.4% of ChatGPT's most-cited pages** updated within last 30 days

### Platform Source Preferences
| Platform | Primary Sources | Key Insight |
|----------|-----------------|-------------|
| ChatGPT | Bing index, Wikipedia (47.9%) | Encyclopedic, neutral tone |
| Perplexity | Reddit (46.7%), fresh content | 90-day recency window |
| Google AI | Top 10 rankers (52%) | Traditional SEO correlation |
| Claude | Brave Search | Must verify Brave indexing |
| Bing Copilot | Bing + LinkedIn | IndexNow for real-time |

### Content Structure for LLM Citation
| Element | Specification |
|---------|--------------|
| Opening answer | 40-60 words directly answering query |
| Fact density | 1 statistic per 150-200 words |
| Paragraph length | 40-60 words max |
| Headers | Question format matching queries |

---

## Properties & Priorities

### Search APIs (FixIt, ArXiv, PubMed, Wikipedia)
- **Primary Goal:** Developer adoption, API integration
- **GEO Focus:** Technical documentation, OpenAPI specs, code examples
- **Key Platforms:** ChatGPT (developers), GitHub, Stack Overflow

### ReviewMaster Pro (SaaS)
- **Primary Goal:** SMB customer acquisition
- **GEO Focus:** Comparison content, use case documentation
- **Key Platforms:** Google AI Overviews, Perplexity

### AI Receptionist Service (Local)
- **Primary Goal:** Local business leads
- **GEO Focus:** GBP optimization, local citations, Reddit presence
- **Key Platforms:** Google AI, Perplexity, local directories

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-4) ✅ PARTIAL
- [x] llms.txt deployment
- [x] robots.txt updates
- [x] sitemap.xml updates
- [ ] Schema markup implementation
- [ ] Static HTML verification
- [ ] Brave Search indexing verification

### Phase 2: Content Optimization (Weeks 5-8)
- [ ] Question-based header restructuring
- [ ] Fact density improvements
- [ ] 30-day refresh cycle implementation
- [ ] Comparison content creation
- [ ] FAQ page expansion

### Phase 3: Platform-Specific (Weeks 9-12)
- [ ] Reddit presence building
- [ ] YouTube content with transcripts
- [ ] LinkedIn thought leadership
- [ ] Stack Overflow participation
- [ ] GBP complete optimization

### Phase 4: Measurement (Ongoing)
- [ ] GA4 AI Traffic channel setup
- [ ] Server log AI bot tracking
- [ ] GEO monitoring tools evaluation
- [ ] Monthly reporting dashboard

---

## Technical Specifications

### Schema Priority
1. **APIs:** TechArticle, SoftwareApplication, APIReference
2. **SaaS:** Service, FAQPage, HowTo
3. **Local:** LocalBusiness, Service, FAQPage

### AI Bot User Agents to Track
```
ChatGPT-User     # Real-time RAG (HIGH VALUE)
PerplexityBot    # Index building
Perplexity-User  # Human-triggered (HIGH VALUE)
GPTBot           # Model training
ClaudeBot        # Anthropic crawling
OAI-SearchBot    # SearchGPT indexing
```

### GA4 AI Traffic Regex
```regex
.*chatgpt\.com.*|.*perplexity.*|.*claude\.ai.*|.*copilot\.microsoft\.com.*|.*gemini\.google\.com.*|.*openai\.com.*
```

---

## Metrics & KPIs

| Metric | Target | Current |
|--------|--------|---------|
| AI Referral Traffic | +100% in 6mo | Baseline TBD |
| Brand Visibility Score | Top 3 for key queries | TBD |
| Citation Rate | 20+ monthly | TBD |
| AI Bot Crawl Volume | Growing trend | TBD |

---

## Related Documentation
- [llms.txt Infrastructure](../infrastructure/llms-txt.md)
- [API Documentation Guidelines](../apis/)
- [Cloudflare Tunnels](../infrastructure/cloudflare-tunnels.md)

---

*Strategy document created: January 13, 2026*
*llms.txt deployed: January 13, 2026*
