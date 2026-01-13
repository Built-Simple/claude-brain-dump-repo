# LLMs.txt Configuration

**Last Updated:** January 13, 2026
**Status:** Deployed

## Overview

llms.txt files are AI-optimized documentation files that help AI crawlers and agents understand and use our APIs. They follow the emerging llms.txt standard for exposing API documentation to AI systems.

## Deployed URLs

| Service | llms.txt URL |
|---------|--------------|
| **FixIt API** | https://fixitapi.built-simple.ai/llms.txt |
| **ArXiv API** | https://arxiv.built-simple.ai/llms.txt |
| **PubMed API** | https://pubmed.built-simple.ai/llms.txt |
| **Wikipedia API** | https://wikipedia.built-simple.ai/llms.txt |
| **ReviewMaster Pro** | https://reviewmaster.built-simple.ai/llms.txt |
| **Main Hub** | https://built-simple.ai/llms.txt |

## File Locations

| Service | File Location |
|---------|---------------|
| FixIt API | `/var/www/talon-api/llms.txt` (CT 103) |
| ArXiv API | `/opt/arxiv/llms.txt` (CT 122) |
| PubMed API | `/opt/pubmed-web/llms.txt` (CT 108) |
| Wikipedia API | `/opt/wikipedia-hybrid/llms.txt` (CT 213 on Hoopa) |
| ReviewMaster | `/opt/reviewmaster/llms.txt` (CT 313 on Silvally) |
| Main Hub | `/var/www/built-simple.ai/llms.txt` (CT 400) |

## Content Structure

### API llms.txt Template
- API name and description
- Base URL and auth method
- Core endpoints with request/response schemas
- Pricing and rate limits
- Attribution requirements

### SaaS llms.txt Template
- Product name and capabilities
- Key integrations
- Feature list for AI agents
- Pricing tiers

### Hub llms.txt Template
- Product directory with links to subdomain llms.txt files
- Quick reference for AI agents to route queries

## Integration

### robots.txt
Each site's robots.txt includes:
```
# AI Crawlers: See /llms.txt for AI-optimized documentation
Sitemap: https://[domain]/llms.txt
```

### sitemap.xml
Each site's sitemap includes the llms.txt URL:
```xml
<url>
    <loc>https://[domain]/llms.txt</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
</url>
```

## Route Implementation

All API services serve llms.txt via FastAPI route:
```python
@app.get("/llms.txt", response_class=Response)
async def llms_txt():
    from pathlib import Path
    llms_path = Path("/path/to/llms.txt")
    if llms_path.exists():
        return Response(content=llms_path.read_text(), 
                       media_type="text/plain; charset=utf-8")
    return Response(content="# llms.txt not found", 
                   media_type="text/plain", status_code=404)
```

## Maintenance

To update an llms.txt file:
1. Edit the file directly in the container
2. The FastAPI route will serve the updated content immediately

To update the route code:
1. Edit main.py in the appropriate container
2. Restart the service: `systemctl restart <service-name>`

---
*llms.txt deployed: January 13, 2026*
