# PubMed Citation Graph Database

**Last Updated:** April 29, 2026
**Status:** Production Ready - Validated
**Location:** PostgreSQL on Giratina (192.168.1.100:5432)
**Database:** pmc_fulltext

---

## Overview

A massive author-to-author citation network built from PubMed/OpenAlex data, enabling citation analysis, influence mapping, and academic network research.

| Metric | Value |
|--------|-------|
| **Total Edges** | 11.1 billion |
| **Table Size** | 1.09 TB |
| **Source** | OpenAlex + PubMed citations |
| **Build Status** | Complete |

---

## Tables

### Primary Citation Graph

#### `author_citation_openalex` (1.09 TB, ~11B rows)

The main citation network. Each row represents one author on a citing paper linking to one author on a cited paper.

```sql
CREATE TABLE author_citation_openalex (
    id                 BIGSERIAL PRIMARY KEY,
    citation_id        INTEGER NOT NULL,        -- FK to citations.id
    citing_author_id   VARCHAR(20) NOT NULL,    -- OpenAlex author ID (e.g., A5056980740)
    citing_author_name TEXT,                    -- Display name
    cited_author_id    VARCHAR(20),             -- OpenAlex author ID (NULL if not in OpenAlex)
    cited_author_name  TEXT,                    -- Display name
    citing_pmid        INTEGER,                 -- PubMed ID of citing paper
    cited_pmid         INTEGER                  -- PubMed ID of cited paper
);
```

**Indexes:**
- `idx_aco_citing_author` - Find who an author cites
- `idx_aco_cited_author` - Find who cites an author
- `idx_aco_citing_pmid` - Lookup by citing paper
- `idx_aco_cited_pmid` - Lookup by cited paper
- `idx_aco_citation_id` - Join to citations table

### Summary Tables

#### `author_citation_summary` (485 MB, 6M rows)

Pre-aggregated outgoing citation stats per author.

```sql
SELECT * FROM author_citation_summary LIMIT 3;

  author_id  |    author_name     | total_citations | unique_cited_authors | papers_authored
-------------+--------------------+-----------------+----------------------+-----------------
 A5000000004 | Şaziye Melike IŞIK |             204 |                  174 |               1
 A5000000013 | Christina Masson   |            1236 |                 1030 |               1
 A5000000019 | Rémi Yin           |             149 |                  119 |               1
```

#### `author_cited_by_summary` (1 GB, 13M rows)

Pre-aggregated incoming citation stats per author.

```sql
SELECT * FROM author_cited_by_summary LIMIT 3;

  author_id  |    author_name     | times_cited | unique_authors_citing | papers_cited
-------------+--------------------+-------------+-----------------------+--------------
 A5000000004 | Şaziye Melike IŞIK |           5 |                     5 |            1
 A5000000013 | Christina Masson   |         743 |                   559 |            2
 A5000000020 | Eva Steinhuber     |          59 |                    58 |            2
```

### Supporting Tables

| Table | Size | Rows | Purpose |
|-------|------|------|---------|
| `citations` | 102 GB | 255M+ | Raw citation records |
| `openalex_work_authors` | 17 GB | 178M | Author-to-work mapping |
| `articles` | 6.7 GB | 4.5M | Article metadata |

---

## Data Quality

### Validation Report (April 29, 2026)

#### Edge Correctness: PASS

Spot-checked 5 edges across the dataset (IDs 1K, 1M, 100M, 1B, 5B):
- All citing authors verified on citing papers
- All cited authors verified on cited papers
- Citation links confirmed in citations table

#### Foreign Key Integrity: PASS

| Relationship | Sample | Match Rate |
|--------------|--------|------------|
| `citing_pmid` → `articles.pmid` | 452 | 100% |
| `citation_id` → `citations.id` | 500 | 100% |

#### NULL Values: Expected

| Column | NULL Rate | Est. NULL Rows | Explanation |
|--------|-----------|----------------|-------------|
| `cited_author_id` | 9.9% | ~1.1B | Cited work not in OpenAlex |
| `cited_pmid` | 8.8% | ~981M | Cited work lacks PMID |
| `citing_author_id` | 0% | 0 | All resolved |
| `citing_pmid` | 0% | 0 | All resolved |

**Why NULLs exist:** Some cited papers aren't indexed in OpenAlex (books, old papers, non-PubMed sources). Example:
```
citing: Rupert J. Russell (PMID 21821881)
cited: "Aramini, J" (no PMID, no OpenAlex ID)
```

#### Summary Table Accuracy: PASS

Tested Licia Manzon (A5086109119):
- Summary says 541 total citations → Actual: 541 ✓
- Summary says 332 unique cited → Actual: 332 ✓
- Summary says 523 times cited → Actual: 523 ✓
- Summary says 431 unique citing → Actual: 431 ✓

#### Data Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| Self-citations | 0.57% | Authors citing own work (normal) |
| Duplicate edges | 0.17% | Same edge on same citation (minor) |
| ID range | 1 → 11,098,462,390 | Full sequential |

---

## Example Queries

### Find Most-Cited Authors

```sql
SELECT author_name, times_cited, unique_authors_citing
FROM author_cited_by_summary
ORDER BY times_cited DESC
LIMIT 10;
```

### Find Who an Author Cites Most

```sql
SELECT cited_author_name, count(*) as citation_count
FROM author_citation_openalex
WHERE citing_author_id = 'A5056980740'
GROUP BY cited_author_name
ORDER BY citation_count DESC
LIMIT 10;
```

### Find Who Cites an Author

```sql
SELECT citing_author_name, count(*) as times
FROM author_citation_openalex
WHERE cited_author_id = 'A5039674482'
GROUP BY citing_author_name
ORDER BY times DESC
LIMIT 10;
```

### Check Citation Path Between Two Authors

```sql
SELECT citing_pmid, cited_pmid, citing_author_name, cited_author_name
FROM author_citation_openalex
WHERE citing_author_id = 'A5056980740'
  AND cited_author_id = 'A5039674482';
```

### Get Author's Citation Network (1-hop)

```sql
-- Who does author X cite?
SELECT DISTINCT cited_author_id, cited_author_name
FROM author_citation_openalex
WHERE citing_author_id = 'A5056980740'
  AND cited_author_id IS NOT NULL;

-- Who cites author X?
SELECT DISTINCT citing_author_id, citing_author_name
FROM author_citation_openalex
WHERE cited_author_id = 'A5056980740';
```

### Find Co-Citation Patterns

```sql
-- Authors frequently cited together by the same papers
SELECT a.cited_author_id, b.cited_author_id, count(*) as co_cited_count
FROM author_citation_openalex a
JOIN author_citation_openalex b
  ON a.citing_pmid = b.citing_pmid
  AND a.cited_author_id < b.cited_author_id
WHERE a.citing_pmid = 12345678
GROUP BY a.cited_author_id, b.cited_author_id
ORDER BY co_cited_count DESC
LIMIT 20;
```

---

## Connection Details

```python
# Read-only access
PG_HOST = "192.168.1.100"
PG_PORT = 5432
PG_DATABASE = "pmc_fulltext"
PG_USER = "readonly"
PG_PASSWORD = "ReadOnly2025"
```

```bash
# CLI access
sudo -u postgres psql -d pmc_fulltext

# Or with read-only user
psql -h 192.168.1.100 -U readonly -d pmc_fulltext
```

---

## Build Process

### Builder Scripts

Located at `/root/` on Giratina:

1. **`author_citation_proper_builder.py`** - Primary builder
   - Batch size: 2000 citations
   - Insert batch: 50000 edges
   - Checkpoint: `/root/proper_citation_checkpoint.json`

2. **`author_citation_builder.py`** - Alternative builder

### How It Works

1. Iterate through `citations` table
2. For each citation, get citing paper's authors from `openalex_work_authors`
3. Get cited paper's authors from `openalex_work_authors`
4. Create edges: every citing author → every cited author
5. Insert in batches with checkpointing

### Run Command (if rebuild needed)

```bash
nohup nice -n 19 ionice -c3 python3 /root/author_citation_proper_builder.py > /root/proper_citation_build.log 2>&1 &
```

---

## Performance Notes

- Queries on indexed columns return in milliseconds
- Full table scans not recommended (use TABLESAMPLE for estimates)
- Summary tables preferred for aggregate queries
- Consider LIMIT clauses on large result sets

---

## Related Documentation

- [PubMed API](../apis/pubmed-api.md) - Search API that uses this data
- [Giratina Machine Profile](../../machine-profiles/giratina.md) - Host machine details

---

*Initial build completed: 2025*
*Validation report: April 29, 2026*
