---
description: Analyze Google Ads performance, identify wasteful spend, and get optimization recommendations
argument-hint: "[--from DATE] [--to DATE] [--campaign NAME]"
---

# Analyze Ads

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../CONNECTORS.md).

Analyze your Google Ads campaigns to identify wasteful keywords, optimize bids, and reduce customer acquisition cost (CAC). Get actionable recommendations, not just data.

## Usage

```
/analyze-ads [options]
```

### Arguments

- `--from` — Start date for analysis (default: 30 days ago). Format: `YYYY-MM-DD`
- `--to` — End date for analysis (default: today). Format: `YYYY-MM-DD`
- `--campaign` — Filter to a specific campaign name (default: all campaigns)
- `--format` — Output format: `text` (default), `json`, `csv`

### Examples

```
/analyze-ads
/analyze-ads --from 2026-01-01 --to 2026-01-31
/analyze-ads --campaign "Brand Keywords"
```

## Workflow

### 1. Gather Ads Data

If ~~google-ads is connected:
- Pull campaign performance data for the specified date range
- Pull keyword-level data with costs, clicks, and conversions
- Pull quality scores and ad relevance metrics
- Pull conversion tracking data

If ~~google-ads is not connected:
> Connect ~~google-ads to pull campaign data automatically. You can also paste Google Ads export data, upload a CSV, or provide campaign metrics manually.

Prompt the user to provide:
- Campaign performance data (spend, clicks, conversions by campaign)
- Keyword-level data (costs, conversions, quality scores)
- Conversion values if available (for ROAS calculation)

### 2. Calculate Key Metrics

For each campaign and keyword, calculate:

| Metric | Formula |
|--------|---------|
| **CAC** | Total Spend / Conversions |
| **CPC** | Total Spend / Clicks |
| **CTR** | Clicks / Impressions |
| **Conversion Rate** | Conversions / Clicks |
| **ROAS** | Revenue / Spend (if revenue data available) |
| **Quality Score Impact** | Estimated cost savings from QS improvements |

### 3. Identify Optimization Opportunities

**High-Spend, Low-Conversion Keywords:**
- Keywords spending >$100 with 0 conversions
- Keywords with CAC >2x account average
- Keywords with conversion rate <50% of account average

**Quality Score Issues:**
- Keywords with QS <5 (significant cost penalty)
- Ad groups with low ad relevance
- Landing pages with poor experience scores

**Budget Optimization:**
- Campaigns hitting daily budget limits (missing impression share)
- Campaigns with excess budget and low performance
- Day-of-week and hour-of-day performance patterns

**Match Type Analysis:**
- Broad match keywords with poor conversion rates
- Opportunities to add negative keywords
- Phrase/exact match expansion opportunities

### 4. Generate Recommendations

Provide prioritized, actionable recommendations:

```
## Top Recommendations

### 1. Pause High-Spend, Zero-Conversion Keywords
**Impact: Save $X/month**
These keywords have spent >$100 with no conversions in the past 30 days:
- "keyword 1" — $XXX spent, 0 conversions
- "keyword 2" — $XXX spent, 0 conversions
Action: Pause immediately or add as negative keywords.

### 2. Improve Quality Scores
**Impact: Reduce CPC by ~X%**
These keywords have Quality Score <5:
- "keyword" (QS: 3) — Improve ad relevance
- "keyword" (QS: 4) — Improve landing page experience
Action: Review ad copy and landing page alignment.

### 3. Reallocate Budget
**Impact: +X% conversions at same spend**
Campaign "X" is hitting budget limits while Campaign "Y" has excess budget.
Action: Move $X/day from Y to X.
```

### 5. Summary Dashboard

Present a summary with key metrics:

```
## Google Ads Performance Summary
Period: [DATE] to [DATE]

### Overview
| Metric | Value | vs. Previous Period |
|--------|-------|---------------------|
| Total Spend | $X,XXX | +X% |
| Conversions | XXX | +X% |
| CAC | $XX.XX | -X% (improved) |
| ROAS | X.Xx | +X% |

### Top Performing Campaigns
1. Campaign A — CAC: $XX, Conversions: XXX
2. Campaign B — CAC: $XX, Conversions: XXX

### Underperforming Campaigns
1. Campaign C — CAC: $XXX (2x average), Action: Review targeting
2. Campaign D — CAC: $XXX, Action: Pause or restructure

### Estimated Savings from Recommendations
Implementing the above recommendations could save $X,XXX/month
or generate X additional conversions at the same spend.
```

## Output

The command returns:
1. **Performance summary** with key metrics and trends
2. **Prioritized recommendations** with estimated impact
3. **Keyword-level details** for keywords needing attention
4. **Next steps** with specific actions to take
