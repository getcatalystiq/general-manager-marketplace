---
description: Analyze content performance, identify what drives signups, and get content strategy recommendations
argument-hint: "[--from DATE] [--to DATE] [--type blog|landing|all]"
---

# Analyze Content

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../CONNECTORS.md).

Analyze your content performance to understand which blog posts and pages drive signups, identify SEO opportunities, and plan your content strategy. Stop guessing what to write next.

## Usage

```
/analyze-content [options]
```

### Arguments

- `--from` — Start date for analysis (default: 90 days ago). Format: `YYYY-MM-DD`
- `--to` — End date for analysis (default: today). Format: `YYYY-MM-DD`
- `--type` — Content type to analyze: `blog`, `landing`, `all` (default)
- `--format` — Output format: `text` (default), `json`, `csv`

### Examples

```
/analyze-content
/analyze-content --type blog --from 2025-10-01
/analyze-content --type landing
```

## Workflow

### 1. Gather Content Data

If ~~analytics is connected:
- Pull page-level traffic data (sessions, users, time on page)
- Pull traffic sources by page (organic, paid, social, direct)
- Pull conversion events by page (signups, trials, purchases)
- Pull engagement metrics (scroll depth, bounce rate)

If ~~database is connected:
- Pull signup attribution data (which page led to signup)
- Pull user journey data (pages visited before conversion)
- Pull content metadata (publish date, category, author)

If neither is connected:
> Connect ~~analytics or ~~database to pull content performance automatically. You can also paste Google Analytics export data, upload a CSV, or provide page metrics manually.

Prompt the user to provide:
- Page traffic data (URL, sessions, users)
- Conversion data (signups, trials by page)
- Traffic source breakdown if available

### 2. Calculate Content Metrics

For each piece of content, calculate:

| Metric | Formula |
|--------|---------|
| **Signup Rate** | Signups from Page / Sessions |
| **Content ROI** | (Signups × LTV) / Content Cost |
| **Organic Share** | Organic Sessions / Total Sessions |
| **Engagement Score** | Weighted avg of time on page, scroll depth, bounce |
| **Velocity** | Traffic trend (growing, stable, declining) |

### 3. Segment Content Performance

**By Content Type:**
- Blog posts vs. landing pages vs. documentation
- Long-form (>2000 words) vs. short-form
- Tutorial vs. thought leadership vs. comparison

**By Traffic Source:**
- Organic search performers (SEO winners)
- Paid traffic converters (good landing pages)
- Social/referral drivers (shareable content)

**By Conversion Stage:**
- Top-of-funnel (awareness, traffic drivers)
- Middle-of-funnel (consideration, signup drivers)
- Bottom-of-funnel (decision, trial-to-paid converters)

### 4. Identify Opportunities

**High-Traffic, Low-Conversion Pages:**
- Pages with >1000 sessions but <0.5% signup rate
- Opportunity: Add CTAs, improve copy, create lead magnets

**High-Converting, Low-Traffic Pages:**
- Pages with >3% signup rate but <500 sessions
- Opportunity: Promote more, improve SEO, create similar content

**SEO Opportunities:**
- Pages ranking #4-20 for valuable keywords (within striking distance)
- Pages with declining organic traffic (need refresh)
- Topic gaps (competitors ranking, you're not)

**Content Refresh Candidates:**
- Posts >12 months old with declining traffic
- Posts with outdated information or screenshots
- Posts with high potential but poor engagement

### 5. Content Recommendations

**Topic Recommendations:**
Based on your best-performing content, recommend similar topics:

```
## Recommended Topics to Write

### Based on Your Top Performers
Your highest-converting content is about [TOPIC CLUSTER].
Consider writing more about:

1. **"[Specific Title Idea]"**
   - Related to your post "[Existing Post]" (X% signup rate)
   - Keyword opportunity: "keyword" (X searches/mo, difficulty: X)

2. **"[Specific Title Idea]"**
   - Expands on "[Existing Post]" which drives X signups/month
   - Keyword opportunity: "keyword" (X searches/mo, difficulty: X)

### Based on Competitor Gaps
Competitors rank for these topics where you have no content:
1. "keyword" — Competitor X ranks #3, X searches/mo
2. "keyword" — Competitor Y ranks #5, X searches/mo
```

### 6. Summary Dashboard

```
## Content Performance Summary
Period: [DATE] to [DATE]

### Overview
| Metric | Value | vs. Previous Period |
|--------|-------|---------------------|
| Total Sessions | XX,XXX | +X% |
| Signups from Content | XXX | +X% |
| Avg Signup Rate | X.X% | +X% |
| Top Traffic Source | Organic (X%) | — |

### Top Converting Content
| Page | Sessions | Signups | Rate |
|------|----------|---------|------|
| /blog/post-1 | X,XXX | XX | X.X% |
| /blog/post-2 | X,XXX | XX | X.X% |
| /features/feature-1 | X,XXX | XX | X.X% |

### Underperforming Content (High Traffic, Low Conversion)
| Page | Sessions | Signups | Rate | Recommendation |
|------|----------|---------|------|----------------|
| /blog/post-x | X,XXX | X | 0.X% | Add CTA |
| /blog/post-y | X,XXX | X | 0.X% | Create lead magnet |

### Content Health
- **Growing**: X posts with increasing traffic
- **Stable**: X posts with consistent traffic
- **Declining**: X posts needing refresh

### Next Actions
1. Refresh "[Post Title]" — declining 30% MoM, high potential
2. Add CTAs to "[Post Title]" — 5,000 sessions, 0 signups
3. Write "[New Topic]" — related to top performer
```

## Output

The command returns:
1. **Performance summary** with traffic and conversion metrics
2. **Top and underperforming content** with specific recommendations
3. **Topic recommendations** based on data patterns
4. **Content calendar suggestions** for the next 30 days
