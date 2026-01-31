---
description: Track SaaS growth metrics including MRR, churn, LTV, CAC, and cohort analysis
argument-hint: "[--from DATE] [--to DATE] [--metric mrr|churn|ltv|all]"
---

# Track Growth

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../CONNECTORS.md).

Track your SaaS growth metrics with proper calculations—MRR with expansion and churn breakdown, LTV using retention curves, CAC by channel, and cohort analysis. Get the numbers that matter, calculated correctly.

## Usage

```
/track-growth [options]
```

### Arguments

- `--from` — Start date for analysis (default: 12 months ago). Format: `YYYY-MM-DD`
- `--to` — End date for analysis (default: today). Format: `YYYY-MM-DD`
- `--metric` — Specific metric to focus on: `mrr`, `churn`, `ltv`, `cac`, `cohorts`, `all` (default)
- `--compare` — Comparison period: `previous`, `year-ago`
- `--format` — Output format: `text` (default), `json`, `csv`

### Examples

```
/track-growth
/track-growth --metric mrr --from 2025-01-01
/track-growth --metric cohorts --compare year-ago
```

## Workflow

### 1. Gather Revenue Data

If ~~stripe is connected:
- Pull subscription data (start dates, amounts, plan changes)
- Pull invoice and payment data
- Pull customer lifecycle events (trial, active, churned)
- Pull plan and pricing tier information

If ~~database is connected:
- Pull user signup and activation data
- Pull feature usage metrics
- Pull custom revenue events

If ~~google-ads and ~~analytics are connected:
- Pull acquisition cost data by channel
- Pull conversion attribution data

If no data source is connected:
> Connect ~~stripe to pull revenue data automatically. You can also provide MRR numbers, customer counts, and churn data manually.

### 2. Calculate MRR Components

**Monthly Recurring Revenue Breakdown:**

| Component | Definition |
|-----------|------------|
| **New MRR** | Revenue from customers who signed up this month |
| **Expansion MRR** | Revenue increase from existing customers (upgrades) |
| **Contraction MRR** | Revenue decrease from existing customers (downgrades) |
| **Churned MRR** | Revenue lost from customers who cancelled |
| **Reactivation MRR** | Revenue from customers who returned |
| **Net New MRR** | New + Expansion + Reactivation - Contraction - Churn |

```
## MRR Summary — January 2026

Starting MRR:      $45,000
+ New MRR:         + $5,200  (52 new customers @ $100 avg)
+ Expansion MRR:   + $1,800  (18 upgrades)
+ Reactivation:    +   $400  (4 returns)
- Contraction MRR: -   $600  (6 downgrades)
- Churned MRR:     - $2,100  (21 churned customers)
─────────────────────────────
Net New MRR:       + $4,700
Ending MRR:        $49,700   (+10.4% MoM)
```

### 3. Calculate Churn Metrics

**Churn Rate Calculations:**

| Metric | Formula | Note |
|--------|---------|------|
| **Logo Churn** | Churned Customers / Start Customers | Customer count |
| **Revenue Churn** | Churned MRR / Start MRR | Dollar-weighted |
| **Net Revenue Churn** | (Churned - Expansion) / Start MRR | Can be negative (good!) |
| **Gross Churn** | Churned MRR / Start MRR | Ignores expansion |

```
## Churn Analysis — January 2026

Logo Churn:        4.2% (21 of 500 customers)
Gross Revenue Churn: 4.7% ($2,100 of $45,000)
Net Revenue Churn:  0.7% (Expansion offsets most churn)

Churn by Cohort:
- 0-3 months:  8.5% (highest — improve onboarding)
- 3-6 months:  4.2%
- 6-12 months: 2.8%
- 12+ months:  1.2% (stickiest customers)

Churn by Plan:
- Starter ($29):  6.8% (price-sensitive segment)
- Pro ($99):      3.1%
- Enterprise:     0.5% (very sticky)
```

### 4. Calculate LTV

**Lifetime Value Calculation (Retention-Based):**

Don't use simple LTV = ARPU / Churn. Use retention curves:

```
## LTV Calculation

Method: Retention-curve based (more accurate than ARPU/Churn)

Average Revenue per Customer: $85/month
12-Month Retention Rate: 65%
24-Month Retention Rate: 48%
36-Month Retention Rate: 38%

Calculated LTV: $1,870
LTV by Plan:
- Starter:    $580   (high churn, low ARPU)
- Pro:        $2,340 (moderate churn, good ARPU)
- Enterprise: $8,500 (low churn, high ARPU)
```

### 5. Calculate CAC & Unit Economics

**Customer Acquisition Cost:**

```
## CAC Analysis — January 2026

Total Marketing Spend: $15,600
Total Sales Spend:     $8,400
Total Customers Acquired: 52
─────────────────────────────
Blended CAC: $462

CAC by Channel:
| Channel | Spend | Customers | CAC | LTV:CAC |
|---------|-------|-----------|-----|---------|
| Google Ads | $8,200 | 24 | $342 | 5.5x |
| Content/SEO | $2,400 | 18 | $133 | 14.0x |
| Referral | $1,200 | 6 | $200 | 9.4x |
| Sales | $12,200 | 4 | $3,050 | 2.8x |

## Unit Economics Summary
| Metric | Value | Benchmark | Status |
|--------|-------|-----------|--------|
| LTV | $1,870 | — | — |
| CAC | $462 | — | — |
| LTV:CAC | 4.0x | >3x | ✓ Good |
| Payback Period | 5.4 months | <12 mo | ✓ Good |
| Gross Margin | 82% | >70% | ✓ Good |
```

### 6. Cohort Analysis

```
## Revenue Retention by Cohort

Monthly cohorts, showing % of Month 0 revenue retained:

| Cohort | M0 | M1 | M2 | M3 | M6 | M12 |
|--------|-----|-----|-----|-----|-----|------|
| Jan 25 | 100% | 92% | 88% | 85% | 78% | 68% |
| Apr 25 | 100% | 94% | 91% | 89% | 82% | — |
| Jul 25 | 100% | 95% | 93% | 90% | — | — |
| Oct 25 | 100% | 96% | 94% | — | — | — |
| Jan 26 | 100% | 97% | — | — | — | — |

Trend: Retention improving (newer cohorts retain better)
Likely cause: Onboarding improvements shipped in Q3 2025
```

### 7. Growth Summary Dashboard

```
## SaaS Growth Dashboard
Period: January 2026

### Key Metrics
| Metric | Value | MoM | YoY |
|--------|-------|-----|-----|
| MRR | $49,700 | +10.4% | +142% |
| ARR | $596,400 | +10.4% | +142% |
| Customers | 531 | +5.8% | +98% |
| ARPU | $94 | +4.4% | +22% |
| Logo Churn | 4.2% | -0.3% | -1.8% |
| Net Revenue Churn | 0.7% | -0.5% | -2.1% |
| LTV | $1,870 | +$120 | +$450 |
| CAC | $462 | +$18 | -$85 |
| LTV:CAC | 4.0x | — | +0.8x |

### Growth Health
- **Rule of 40:** 52% (Growth + Margin) ✓ Excellent
- **Magic Number:** 0.85 ✓ Good efficiency
- **Quick Ratio:** 3.2 (New+Expansion / Churn) ✓ Healthy

### Trends to Watch
⚠️ Starter plan churn increasing (6.8% vs 5.2% last month)
✓ Enterprise expansion strong (+$800 MRR from upgrades)
✓ Content/SEO CAC declining (best channel efficiency)

### Recommendations
1. Investigate Starter churn — consider onboarding improvements or pricing change
2. Double down on content marketing — best LTV:CAC ratio
3. Consider reducing paid acquisition — CAC increasing while efficiency dropping
```

## Output

The command returns:
1. **MRR breakdown** with all components (new, expansion, churn, etc.)
2. **Churn analysis** with segmentation by cohort and plan
3. **LTV calculation** using retention curves (not simple formula)
4. **CAC by channel** with LTV:CAC ratios
5. **Cohort analysis** showing retention trends
6. **Health metrics** (Rule of 40, Magic Number, Quick Ratio)
7. **Recommendations** based on the data
