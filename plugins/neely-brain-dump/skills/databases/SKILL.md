---
name: databases
description: PostgreSQL databases on Giratina - PubMed, Legal, StackOverflow, ArXiv. Use when querying research data, legal documents, programming solutions, or scientific papers.
allowed-tools: Bash, mcp__postgres__query
---

# PostgreSQL Databases (Giratina)

**Server:** 192.168.1.100
**PostgreSQL Version:** 17.6
**Location:** /mnt/raid6/databases/postgresql/17/main
**Storage:** 13TB RAID6 array (4.9TB available)

## Database Summary

| Database | Size | Records | Primary Use |
|----------|------|---------|-------------|
| pmc_fulltext | 227 GB | 4.5M articles, 255M citations | Medical/scientific research |
| legal_db | 81 GB | 9.2M documents | Legal document search |
| stackoverflow_complete | 53 GB | 18.5M solutions | Programming Q&A |
| arxiv_papers | 16 GB | 2.8M papers | Scientific preprints |
| **TOTAL** | **377 GB** | **~340M records** | |

---

## pmc_fulltext (227 GB) - PubMed Central Research

Medical and scientific research articles with full citation network.

### Stats
- **4,483,066 articles** with full-text (68 GB raw text)
- **255,138,874 citations** - massive citation network
- **88,560,660 author records**
- **35 tables** including network analysis, co-citation graphs
- **Query performance:** 23ms for indexed queries

### Key Tables
```sql
-- Articles with full text
SELECT id, title, abstract, full_text FROM articles LIMIT 10;

-- Citation network
SELECT * FROM citations WHERE source_pmid = '12345678';

-- Author search
SELECT * FROM authors WHERE name ILIKE '%Smith%';
```

### Example Queries
```sql
-- Find articles by keyword in title
SELECT id, title, pub_date FROM articles
WHERE title ILIKE '%cancer%' AND pub_date > '2020-01-01'
LIMIT 100;

-- Get citation count for an article
SELECT COUNT(*) FROM citations WHERE target_pmid = '12345678';

-- Find co-authors
SELECT DISTINCT a2.name FROM authors a1
JOIN article_authors aa1 ON a1.id = aa1.author_id
JOIN article_authors aa2 ON aa1.article_id = aa2.article_id
JOIN authors a2 ON aa2.author_id = a2.id
WHERE a1.name = 'John Smith' AND a2.name != 'John Smith';
```

---

## legal_db (81 GB) - Legal Documents

Legal documents from the "Pile of Law" dataset with excellent full-text search.

### Stats
- **9,206,663 documents** (124 GB raw → 11 GB stored, 91% compression)
- **70 GB of indexes** (full-text search, trigrams, hash indexes)
- **Query performance:** 1ms for simple lookups

### Document Categories
| Category | Count |
|----------|-------|
| Caselaw | 5.9M |
| Miscellaneous | 2.2M |
| Patents | 543K |
| Contracts | 353K |

### Key Tables
```sql
-- Main documents table
SELECT id, title, category, text FROM documents LIMIT 10;

-- Full-text search
SELECT id, title FROM documents
WHERE to_tsvector('english', text) @@ to_tsquery('contract & breach');
```

### Example Queries
```sql
-- Search by category
SELECT id, title, LEFT(text, 500) FROM documents
WHERE category = 'caselaw'
LIMIT 100;

-- Full-text search with ranking
SELECT id, title, ts_rank(to_tsvector('english', text), query) AS rank
FROM documents, to_tsquery('intellectual & property') query
WHERE to_tsvector('english', text) @@ query
ORDER BY rank DESC
LIMIT 20;

-- Find patents
SELECT id, title FROM documents
WHERE category = 'patents' AND title ILIKE '%machine learning%';
```

---

## stackoverflow_complete (53 GB) - Programming Solutions

Programming Q&A from Stack Overflow.

### Stats
- **18,563,455 solutions**
- **12,718,160 unique questions**
- **12 programming languages tracked**
- **Full-text search** enabled on answers
- **Query performance:** ~26 seconds for complex queries (needs optimization)

### Top Languages
| Language | Solutions |
|----------|-----------|
| JavaScript | 3.4M |
| Java | 2.6M |
| Python | 1.9M |
| C# | 1.5M |
| PHP | 1.2M |

### Key Tables
```sql
-- Questions
SELECT id, title, tags, score FROM questions LIMIT 10;

-- Answers/Solutions
SELECT id, question_id, body, score FROM answers LIMIT 10;
```

### Example Queries
```sql
-- Find Python questions by keyword
SELECT id, title, score FROM questions
WHERE tags LIKE '%python%' AND title ILIKE '%pandas%'
ORDER BY score DESC
LIMIT 20;

-- Get top answers for a question
SELECT body, score FROM answers
WHERE question_id = 12345
ORDER BY score DESC;

-- Find high-scoring solutions
SELECT q.title, a.body, a.score
FROM answers a
JOIN questions q ON a.question_id = q.id
WHERE q.tags LIKE '%python%' AND a.score > 100
ORDER BY a.score DESC
LIMIT 10;
```

---

## arxiv_papers (16 GB) - Research Papers

Scientific preprints from ArXiv.

### Stats
- **2,770,235 papers**
- **2.2 GB of abstracts** with full-text search
- **Multiple full-text search indexes**
- **Query performance:** 23ms for category searches

### Key Tables
```sql
-- Papers
SELECT id, title, abstract, categories, authors FROM papers LIMIT 10;
```

### Example Queries
```sql
-- Search by category (cs.AI, physics, math, etc.)
SELECT id, title, authors FROM papers
WHERE categories LIKE '%cs.AI%'
ORDER BY id DESC
LIMIT 100;

-- Full-text search in abstracts
SELECT id, title FROM papers
WHERE to_tsvector('english', abstract) @@ to_tsquery('transformer & attention')
LIMIT 50;

-- Find papers by author
SELECT id, title, categories FROM papers
WHERE authors ILIKE '%Hinton%';

-- Recent ML papers
SELECT id, title, abstract FROM papers
WHERE categories LIKE '%cs.LG%'
ORDER BY id DESC
LIMIT 20;
```

---

## Connection Details

### From Giratina (localhost)
```bash
psql -U postgres -d pmc_fulltext
psql -U postgres -d legal_db
psql -U postgres -d stackoverflow_complete
psql -U postgres -d arxiv_papers
```

### From Other Nodes
```bash
psql -h 192.168.1.100 -U postgres -d DATABASE_NAME
# Password: (set in environment)
```

### Connection String
```
postgresql://postgres:${POSTGRES_PASSWORD}@192.168.1.100:5432/DATABASE_NAME
```

---

## Backup Files (on RAID6)

| File | Size |
|------|------|
| legal_db.sql.gz | 40 GB |
| legal_documents_20250828_095834.parquet.7z | 78 GB |
| legal_master_duckdb.db.7z | 39 GB |
