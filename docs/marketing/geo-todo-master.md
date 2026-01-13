# GEO Master TODO List - Built Simple Ecosystem

**Last Updated:** January 13, 2026 (23:25 UTC)
**Owner:** To be assigned
**Review Cadence:** Weekly

---

## Quick Reference: Priority Levels
- 🔴 **P0 - Critical:** Blocking other work, do immediately
- 🟠 **P1 - High:** Do this week
- 🟡 **P2 - Medium:** Do this month
- 🟢 **P3 - Low:** Backlog, do when time permits

---

## PHASE 1: TECHNICAL FOUNDATION (Weeks 1-4)

### 1.1 llms.txt & Crawlability ✅ COMPLETE
- [x] 🔴 P0: Create llms.txt for FixIt API
- [x] 🔴 P0: Create llms.txt for ArXiv API
- [x] 🔴 P0: Create llms.txt for PubMed API
- [x] 🔴 P0: Create llms.txt for Wikipedia API
- [x] 🔴 P0: Create llms.txt for ReviewMaster Pro
- [x] 🔴 P0: Create llms.txt for built-simple.ai hub
- [x] 🟠 P1: Update robots.txt with llms.txt references
- [x] 🟠 P1: Update sitemap.xml with llms.txt URLs

### 1.2 Search Engine Indexing Verification
- [ ] 🔴 P0: Verify all properties indexed in Google Search Console
- [ ] 🔴 P0: Submit all properties to Bing Webmaster Tools (ChatGPT uses Bing!)
- [ ] 🔴 P0: Verify Brave Search indexing (Claude uses Brave!)
  - Test: `site:fixitapi.built-simple.ai` on search.brave.com
  - Test: `site:arxiv.built-simple.ai` on search.brave.com
  - Test: `site:pubmed.built-simple.ai` on search.brave.com
  - Test: `site:wikipedia.built-simple.ai` on search.brave.com
  - Test: `site:reviewmaster.built-simple.ai` on search.brave.com
  - Test: `site:built-simple.ai` on search.brave.com
- [ ] 🟠 P1: Implement IndexNow protocol for real-time Bing indexing
  - Create IndexNow key file at /{key}.txt
  - Add IndexNow submission on content updates
- [ ] 🟠 P1: Submit to Yandex Webmaster (growing AI market)

### 1.3 Static HTML Verification (AI Crawlers Don't Execute JS)
- [ ] 🔴 P0: Test FixIt frontend renders without JavaScript
  - `curl -A "GPTBot" https://fixit.built-simple.ai/ | head -100`
- [ ] 🔴 P0: Test ReviewMaster renders without JavaScript
- [ ] 🔴 P0: Test built-simple.ai renders without JavaScript
- [ ] 🟠 P1: Implement SSR/SSG if any pages require JS to render content
- [ ] 🟠 P1: Add `<noscript>` fallbacks for critical content

### 1.4 Schema Markup Implementation ✅ COMPLETE (Jan 13, 2026)
- [x] 🔴 P0: **FixIt API** - WebApplication + SoftwareApplication schema (deployed)
- [x] 🔴 P0: **ArXiv API** - WebApplication + SoftwareApplication schema (deployed)
- [x] 🔴 P0: **PubMed API** - WebApplication + SoftwareApplication schema (deployed)
- [x] 🔴 P0: **Wikipedia API** - WebApplication + SoftwareApplication schema (deployed)
- [x] 🔴 P0: **ReviewMaster Pro** - WebApplication + Service schema (deployed)
- [x] 🔴 P0: **Built-Simple.ai Hub** - Organization + ItemList schema (deployed)
- [ ] 🟠 P1: Validate all schema with Google Rich Results Test
- [ ] 🟠 P1: Validate all schema with Schema.org validator

---

## PHASE 2: CONTENT OPTIMIZATION (Weeks 5-8)

### 2.1 Content Structure Refactoring
- [ ] 🟠 P1: Audit all pages for 40-60 word opening answers
  - Each page must start with direct answer to implied question
- [ ] 🟠 P1: Add statistics every 150-200 words
  - Source required for each statistic
  - Cite authoritative sources (.edu, .gov, peer-reviewed)
- [ ] 🟠 P1: Break paragraphs to 40-60 word maximum
- [ ] 🟠 P1: Convert headers to question format:
  - "Authentication" → "How do I authenticate with the API?"
  - "Rate Limits" → "What are the rate limits?"
  - "Pricing" → "How much does the API cost?"

### 2.2 FAQ Page Expansion (FAQPage schema = 2x citation rate)
- [ ] 🟠 P1: **FixIt API FAQ** - Create 15+ questions
  - What is vector search?
  - How does hybrid search work?
  - What programming languages are supported?
  - How do I handle rate limits?
  - Can I use FixIt for commercial projects?
  - How fresh is the Stack Overflow data?
  - What's the difference between FTS5 and vector search?
  - How do I get started with the API?
  - What authentication methods are available?
  - How do I upgrade to Pro?
  - What happens if I exceed my quota?
  - Is there an SLA guarantee?
  - Can I access the raw database?
  - How do I report bugs or issues?
  - What's on the roadmap?

- [ ] 🟠 P1: **ArXiv API FAQ** - Create 15+ questions
- [ ] 🟠 P1: **PubMed API FAQ** - Create 15+ questions
- [ ] 🟠 P1: **Wikipedia API FAQ** - Create 15+ questions
- [ ] 🟠 P1: **ReviewMaster Pro FAQ** - Create 20+ questions
  - Focus on comparison questions ("vs" queries)
  - Include pricing/ROI questions
  - Include integration questions

### 2.3 Comparison Content (High citation potential)
- [ ] 🟠 P1: "FixIt API vs Algolia" comparison page
- [ ] 🟠 P1: "FixIt API vs Elasticsearch" comparison page
- [ ] 🟠 P1: "FixIt API vs Stack Overflow API" comparison page
- [ ] 🟠 P1: "ReviewMaster Pro vs Birdeye" comparison
- [ ] 🟠 P1: "ReviewMaster Pro vs Podium" comparison
- [ ] 🟠 P1: "ReviewMaster Pro vs Traditional Answering Services" comparison
- [ ] 🟡 P2: Create comparison matrix/table format (LLMs love tables)

### 2.4 30-Day Content Refresh Cycle
- [ ] 🟠 P1: Set up content calendar with 30-day refresh reminders
- [ ] 🟠 P1: Add "Last Updated" timestamps to all pages
- [ ] 🟠 P1: Create refresh checklist:
  - Update statistics with current data
  - Check all links are working
  - Add any new features/endpoints
  - Update pricing if changed
  - Add recent customer success stories
- [ ] 🟡 P2: Automate "dateModified" schema updates on content changes

### 2.5 OpenAPI Specification Optimization ✅ COMPLETE (Jan 13, 2026)
- [x] 🔴 P0: Audit OpenAPI spec for completeness (77% of well-formed specs work first time)
  - ✅ FixIt API: All endpoints have descriptions (2 issues fixed)
  - ✅ ArXiv API: All endpoints have descriptions (1 issue fixed)
  - ✅ PubMed API: All endpoints have descriptions (8 issues fixed)
  - ✅ Wikipedia API: All endpoints have descriptions (13 issues fixed)
  - ✅ All APIs: Added `servers` array with production URLs
  - ✅ Wikipedia API: Added Field examples to Pydantic models
- [x] 🟠 P1: Add detailed `description` for every endpoint
- [ ] 🟠 P1: Add rich `operationId` fields (natural language)
- [ ] 🟠 P1: Create separate spec files per API for clean chunking

---

## PHASE 3: PLATFORM-SPECIFIC OPTIMIZATION (Weeks 9-12)

### 3.1 Reddit Presence (46.7% of Perplexity citations)
- [ ] 🟠 P1: Identify target subreddits:
  - r/webdev
  - r/programming
  - r/learnprogramming
  - r/smallbusiness
  - r/restaurantowners
  - r/Entrepreneur
  - r/SaaS
  - Local city subreddits for service areas
- [ ] 🟠 P1: Create authentic participation strategy (NOT promotional accounts)
- [ ] 🟠 P1: Answer relevant questions with helpful, detailed responses
- [ ] 🟠 P1: Share knowledge without explicit promotion
- [ ] 🟡 P2: Monitor relevant threads with keyword alerts
- [ ] 🟢 P3: Build personal brand accounts for team members

### 3.2 YouTube Content (200x more cited than TikTok)
- [ ] 🟠 P1: Create "How to use FixIt API" tutorial video
- [ ] 🟠 P1: Create "Vector Search Explained" educational content
- [ ] 🟠 P1: Create "AI Receptionist Demo" for ReviewMaster
- [ ] 🔴 P0: Upload detailed transcripts (NOT auto-captions!)
- [ ] 🟠 P1: Add chapter markers with descriptive titles
- [ ] 🟠 P1: Implement VideoObject schema on pages embedding videos
- [ ] 🟡 P2: Create YouTube Shorts for quick tips
- [ ] 🟡 P2: Optimize video titles for intent queries

### 3.3 LinkedIn Thought Leadership (Bing Copilot favors LinkedIn)
- [ ] 🟠 P1: Create company page with complete information
- [ ] 🟠 P1: Publish weekly technical articles on LinkedIn
- [ ] 🟠 P1: Share API updates and new features
- [ ] 🟡 P2: Engage with developer community posts
- [ ] 🟡 P2: Connect team profiles to company page

### 3.4 Stack Overflow Participation (Developer authority)
- [ ] 🟠 P1: Monitor questions about vector search APIs
- [ ] 🟠 P1: Answer questions about Stack Overflow data access
- [ ] 🟠 P1: Create canonical answers linking to documentation
- [ ] 🟡 P2: Build reputation through helpful answers
- [ ] 🟢 P3: Consider Stack Overflow Teams for documentation

### 3.5 Google Business Profile (58% of local AI citations)
- [ ] 🔴 P0: Claim and verify GBP for all service locations
- [ ] 🔴 P0: Complete every field:
  - Business name (exact match across web)
  - Address (NAP consistency critical)
  - Phone number
  - Website URL
  - Hours of operation
  - Service area
  - Business category
  - Attributes (appointment required, etc.)
- [ ] 🟠 P1: Upload 20+ high-quality photos
- [ ] 🟠 P1: Create 15+ FAQ Q&A pairs in GBP
- [ ] 🟠 P1: Post weekly updates/offers
- [ ] 🟠 P1: Respond to all reviews within 24 hours
- [ ] 🟡 P2: Add products/services with pricing
- [ ] 🟡 P2: Enable messaging and booking features

### 3.6 NAP Consistency Audit (70%+ of local ranking signals)
- [ ] 🔴 P0: Standardize business information format
- [ ] 🔴 P0: Audit and fix citations on:
  - Google Business Profile
  - Bing Places
  - Apple Maps
  - Yelp
  - Yellow Pages
  - BBB
  - Facebook Business
  - LinkedIn Company
  - Industry directories
  - Local chamber of commerce
  - Local business associations
- [ ] 🟠 P1: Use citation management tool (Yext, BrightLocal, or Moz Local)
- [ ] 🟠 P1: Remove duplicate listings
- [ ] 🟡 P2: Monitor for new inconsistent citations monthly

---

## PHASE 4: MEASUREMENT & TRACKING (Ongoing)

### 4.1 GA4 AI Traffic Channel Setup
- [ ] 🔴 P0: Create Custom Channel Group in GA4
  1. Admin > Data Display > Channel Groups
  2. Create new channel group "Default + AI"
  3. Add channel "AI Traffic" with regex:
     ```
     .*chatgpt\.com.*|.*perplexity.*|.*claude\.ai.*|.*copilot\.microsoft\.com.*|.*gemini\.google\.com.*|.*openai\.com.*
     ```
  4. Drag AI Traffic ABOVE Referral channel
- [ ] 🟠 P1: Set up conversion tracking for AI traffic
- [ ] 🟠 P1: Create AI Traffic dashboard/report
- [ ] 🟡 P2: Compare AI traffic conversion rates to other channels

### 4.2 Server Log AI Bot Tracking
- [ ] 🔴 P0: Enable nginx access log parsing
- [ ] 🔴 P0: Create script to track AI bot user agents:
  - ChatGPT-User (HIGH VALUE - real-time RAG)
  - Perplexity-User (HIGH VALUE - human-triggered)
  - PerplexityBot
  - GPTBot
  - ClaudeBot
  - OAI-SearchBot
  - Anthropic-AI
  - Google-Extended
  - Amazonbot
- [ ] 🟠 P1: Set up daily/weekly bot traffic reports
- [ ] 🟠 P1: Track which pages AI bots crawl most
- [ ] 🟡 P2: Correlate bot crawls with content updates
- [ ] 🟡 P2: Monitor for unusual crawl patterns

### 4.3 GEO Monitoring Tools Evaluation
- [ ] 🟠 P1: Evaluate free options:
  - Advanced Web Ranking AI Overview Tool
  - Manual prompt testing across platforms
- [ ] 🟡 P2: Evaluate paid options if budget allows:
  - Otterly.AI ($39-79/month) - Entry level
  - Semrush AI Toolkit ($99+/month) - Integrated
  - Profound ($499+/month) - Enterprise
- [ ] 🟡 P2: Set up weekly manual brand mention checks:
  - ChatGPT: "What is the best API for searching Stack Overflow?"
  - Perplexity: "vector search API for developers"
  - Claude: "API for medical research paper search"
  - Google AI: "AI review response generator"

### 4.4 Competitor Monitoring
- [ ] 🟡 P2: Identify top 5 competitors per product
- [ ] 🟡 P2: Track competitor AI citations monthly
- [ ] 🟡 P2: Analyze competitor llms.txt and schema
- [ ] 🟢 P3: Create competitive intelligence dashboard

---

## PHASE 5: AUTHORITY BUILDING (Months 3-6)

### 5.1 E-E-A-T Signals Enhancement
- [ ] 🟠 P1: Add author attribution to all technical content
  - Full name
  - Job title
  - LinkedIn profile link
  - GitHub profile link
  - Brief bio with credentials
- [ ] 🟠 P1: Create "About" pages for key team members
- [ ] 🟠 P1: Add "First-hand experience" markers:
  - "In our 3 years building vector search APIs..."
  - "Based on processing 18M+ Stack Overflow posts..."
- [ ] 🟡 P2: Obtain and display relevant certifications
- [ ] 🟡 P2: Join and display industry association memberships

### 5.2 Expert Quotations (40% higher citation rate)
- [ ] 🟠 P1: Create quotable content from team experts
- [ ] 🟠 P1: Include direct quotes with credentials in content
- [ ] 🟡 P2: Reach out for quotes from industry experts
- [ ] 🟡 P2: Offer quotes for other publications (link building)

### 5.3 Original Research (Others will reference)
- [ ] 🟡 P2: "State of Developer Search" annual report
- [ ] 🟡 P2: "Stack Overflow API Usage Trends" analysis
- [ ] 🟡 P2: "AI Adoption in Small Business" survey
- [ ] 🟢 P3: Publish data visualizations and infographics

### 5.4 Case Studies (AI-Extractable Format)
- [ ] 🟡 P2: Create 3-5 customer case studies per product
- [ ] 🟡 P2: Format each with:
  - TL;DR (3-5 sentences with headline metrics)
  - Customer snapshot (industry, size, product)
  - Business context and challenges
  - Solution implementation
  - Quantified results with timeframes
- [ ] 🟢 P3: Add Case Study schema markup

### 5.5 Guest Content & PR
- [ ] 🟡 P2: Identify target publications:
  - Dev.to
  - Hacker Noon
  - Medium (technology publications)
  - Industry blogs
  - Local business publications
- [ ] 🟡 P2: Pitch 1-2 guest posts per month
- [ ] 🟢 P3: Develop press kit for media outreach
- [ ] 🟢 P3: Create newsworthy announcements calendar

---

## PHASE 6: ADVANCED OPTIMIZATIONS (Months 6-12)

### 6.1 Wikipedia-Style Content (ChatGPT loves this)
- [ ] 🟢 P3: Create encyclopedic "What is Vector Search?" guide
- [ ] 🟢 P3: Create "History of Code Search" content
- [ ] 🟢 P3: Structure content with definition → context → applications
- [ ] 🟢 P3: Average ~2,800 words for pillar content
- [ ] 🟢 P3: Maintain neutral, factual tone (no marketing speak)

### 6.2 Multi-Language Support
- [ ] 🟢 P3: Evaluate demand for non-English documentation
- [ ] 🟢 P3: Implement hreflang tags if multi-language
- [ ] 🟢 P3: Create language-specific llms.txt files

### 6.3 API Integration Examples
- [ ] 🟡 P2: Create runnable code examples in:
  - Python
  - JavaScript/Node.js
  - Java
  - Go
  - Ruby
  - PHP
  - C#
- [ ] 🟡 P2: Add to CodePen/JSFiddle/Replit for interactive demos
- [ ] 🟢 P3: Create GitHub repository with examples
- [ ] 🟢 P3: Publish to package managers (npm, PyPI)

### 6.4 Community Building
- [ ] 🟢 P3: Create Discord server for developers
- [ ] 🟢 P3: Set up GitHub Discussions
- [ ] 🟢 P3: Host office hours / webinars
- [ ] 🟢 P3: Build changelog/roadmap page

---

## MAINTENANCE TASKS (Recurring)

### Weekly
- [ ] Review AI traffic in GA4
- [ ] Check for new reviews to respond to
- [ ] Post to LinkedIn
- [ ] Monitor Reddit threads

### Monthly
- [ ] Refresh high-traffic content
- [ ] Update statistics with current data
- [ ] Check all schema validation
- [ ] Review AI bot crawl logs
- [ ] Manual AI platform brand checks
- [ ] NAP consistency audit

### Quarterly
- [ ] Full content audit
- [ ] Competitor analysis update
- [ ] GEO tools evaluation
- [ ] Strategy review and adjustment
- [ ] Case study collection

---

## SUCCESS METRICS

### Short-term (30-60 days)
- [ ] All schema validated and live
- [ ] Indexed in Bing and Brave
- [ ] GA4 AI channel tracking active
- [ ] FAQ pages live for all products

### Medium-term (3-6 months)
- [ ] AI referral traffic baseline established
- [ ] Reddit presence built
- [ ] YouTube content live
- [ ] 10+ FAQ questions per product

### Long-term (6-12 months)
- [ ] AI referral traffic +100% from baseline
- [ ] Top 3 brand visibility for key queries
- [ ] 20+ AI citations per month
- [ ] Case studies published
- [ ] Original research released

---

## RESOURCES & REFERENCES

### Tools
- Google Search Console: https://search.google.com/search-console
- Bing Webmaster Tools: https://www.bing.com/webmasters
- Brave Search: https://search.brave.com
- Schema.org Validator: https://validator.schema.org
- Google Rich Results Test: https://search.google.com/test/rich-results

### Documentation
- llms.txt spec: https://llmstxt.org
- Schema.org: https://schema.org
- IndexNow: https://www.indexnow.org
- OpenAPI Specification: https://swagger.io/specification/

### Research
- Princeton GEO Study
- Yext AI Citation Research
- Semrush AI Visibility Report

---

*Created: January 13, 2026*
*Next Review: January 20, 2026*
