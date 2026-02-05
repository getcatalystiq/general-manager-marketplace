---
name: saas-metrics
description: SaaS metrics expertise for accurate MRR, churn, LTV, and CAC calculations. Use when discussing revenue metrics, unit economics, cohort analysis, or growth health indicators like Rule of 40, Magic Number, and Quick Ratio.
---

# SaaS Metrics Expertise

You are an expert at SaaS metrics, unit economics, and growth health analysis. You calculate MRR, churn, LTV, CAC, and cohort metrics accurately — and you know what the numbers mean for the business. When you spot a metric outside healthy ranges, you flag it immediately and recommend specific action.

## Monthly Recurring Revenue (MRR)

MRR is the normalized monthly revenue from all active subscriptions.

### MRR Components

| Component | Definition | Calculation |
|-----------|------------|-------------|
| **New MRR** | Revenue from new customers | Sum of first subscription payments |
| **Expansion MRR** | Revenue increase from existing customers | Upgrades + add-ons + seat additions |
| **Contraction MRR** | Revenue decrease from existing customers | Downgrades + removed add-ons + seat removals |
| **Churned MRR** | Revenue lost from cancellations | Sum of cancelled subscription values |
| **Reactivation MRR** | Revenue from returning customers | Re-subscribed customers' MRR |

### Net New MRR Formula

```
Net New MRR = New MRR + Expansion MRR + Reactivation MRR - Contraction MRR - Churned MRR
```

### ARR Calculation

```
ARR = MRR × 12
```

Note: Only use ARR for businesses with primarily annual contracts. For monthly-heavy businesses, MRR is more meaningful.

## Churn Metrics

### Types of Churn

| Metric | Formula | Use Case |
|--------|---------|----------|
| **Logo Churn** | Churned Customers / Start Customers | Customer count health |
| **Gross Revenue Churn** | Churned MRR / Start MRR | Revenue loss rate |
| **Net Revenue Churn** | (Churned MRR - Expansion MRR) / Start MRR | True revenue health |
| **Net Revenue Retention (NRR)** | (Start MRR - Churn + Expansion) / Start MRR | Growth from existing base |

### Churn Rate Benchmarks

| Segment | Good Monthly Churn | Excellent Monthly Churn |
|---------|-------------------|------------------------|
| SMB | < 5% | < 3% |
| Mid-Market | < 2% | < 1% |
| Enterprise | < 1% | < 0.5% |

### Net Revenue Retention Benchmarks

| Quality | NRR Range |
|---------|-----------|
| Poor | < 90% |
| Acceptable | 90-100% |
| Good | 100-110% |
| Excellent | 110-130% |
| World-class | > 130% |

## Lifetime Value (LTV)

### Correct LTV Calculation

**Do NOT use:** `LTV = ARPU / Churn Rate`

This simple formula is inaccurate because:
- Churn is not constant over time
- It assumes linear revenue (no expansion)
- It ignores cohort behavior differences

**DO use:** Retention-curve based LTV

```
LTV = Σ (Revenue in Month n × Probability of Retention to Month n)
```

### LTV Calculation Steps

1. Build retention curves by cohort
2. Calculate average revenue per retained customer per month
3. Sum expected revenue across customer lifetime
4. Apply discount rate for present value (optional for long time horizons)

### LTV by Segment

Always calculate LTV separately for:
- Pricing tiers (Starter, Pro, Enterprise)
- Acquisition channels
- Customer segments (industry, company size)
- Cohort periods

## Customer Acquisition Cost (CAC)

### CAC Formula

```
CAC = (Sales Costs + Marketing Costs) / New Customers Acquired
```

### What to Include in CAC

**Include:**
- Paid advertising spend
- Sales team salaries + commissions
- Marketing team salaries
- Marketing tools and software
- Content production costs
- Event and conference costs

**Exclude:**
- Customer success costs (post-acquisition)
- Product development
- General overhead

### CAC by Channel

Calculate CAC separately for each acquisition channel:
- Paid Search (Google, Bing)
- Paid Social (Facebook, LinkedIn, Twitter)
- Content/SEO (organic)
- Referral programs
- Outbound sales
- Partnerships

### Blended vs Channel CAC

- **Blended CAC**: Total costs / Total customers (useful for overall health)
- **Channel CAC**: Channel costs / Channel customers (useful for optimization)

## Unit Economics

### LTV:CAC Ratio

```
LTV:CAC = Lifetime Value / Customer Acquisition Cost
```

| Ratio | Interpretation |
|-------|----------------|
| < 1x | Losing money on each customer |
| 1-3x | Unprofitable or marginally profitable |
| 3-5x | Healthy and sustainable |
| > 5x | Under-investing in growth (usually) |

### CAC Payback Period

```
Payback Period = CAC / (ARPU × Gross Margin)
```

| Payback | Quality |
|---------|---------|
| < 6 months | Excellent |
| 6-12 months | Good |
| 12-18 months | Acceptable |
| > 18 months | Concerning |

## Cohort Analysis

### Building Cohort Tables

1. Group customers by signup month
2. Track retention rate at each month interval
3. Calculate revenue retention (not just logo retention)
4. Identify patterns and anomalies

### What to Look For

- **Improving cohorts**: Recent cohorts retain better (product/onboarding improvements working)
- **Degrading cohorts**: Recent cohorts retain worse (market saturation, quality issues)
- **Cohort-specific drops**: Spikes in churn at specific months (identify triggers)
- **Seasonality**: Some months consistently better/worse

## SaaS Health Metrics

### Rule of 40

```
Rule of 40 Score = Revenue Growth Rate % + Profit Margin %
```

| Score | Quality |
|-------|---------|
| < 20 | Struggling |
| 20-40 | Acceptable |
| 40-60 | Good |
| > 60 | Excellent |

### Magic Number

```
Magic Number = (Current Quarter ARR - Previous Quarter ARR) / Previous Quarter S&M Spend
```

| Score | Interpretation |
|-------|----------------|
| < 0.5 | Inefficient — reduce spend or improve product |
| 0.5-0.75 | Acceptable — optimize before scaling |
| 0.75-1.0 | Good — maintain current efficiency |
| > 1.0 | Excellent — can increase spend |

### Quick Ratio

```
Quick Ratio = (New MRR + Expansion MRR) / (Churned MRR + Contraction MRR)
```

| Ratio | Quality |
|-------|---------|
| < 1 | Shrinking |
| 1-2 | Slow growth |
| 2-4 | Healthy growth |
| > 4 | Excellent growth |

## Red Flags — Flag These Immediately

When you see any of these, surface them as urgent in `/tasks` or `/dashboard`:

| Red Flag | Threshold | Recommended Action |
|----------|-----------|-------------------|
| **Negative net new MRR** | Net New MRR < $0 for any month | Diagnose: is it churn spike or growth stall? Separate the signals. |
| **Net revenue churn is positive** | Net Revenue Churn > 0% | Expansion isn't covering losses. Prioritize retention over acquisition. |
| **NRR below 90%** | NRR < 90% | The customer base is shrinking. This is existential — escalate immediately. |
| **LTV:CAC below 1x** | LTV:CAC < 1.0 | Losing money on every customer. Pause paid acquisition and fix unit economics. |
| **LTV:CAC above 5x** | LTV:CAC > 5.0 | Likely under-investing in growth. Recommend increasing acquisition spend. |
| **CAC payback > 18 months** | Payback > 18 mo | Cash flow risk. Recommend raising prices, improving conversion, or reducing CAC. |
| **Quick Ratio below 1** | Quick Ratio < 1.0 | Business is shrinking. Revenue lost exceeds revenue gained. |
| **Rule of 40 below 20** | Score < 20 | Neither growing fast nor profitable. Strategic pivot may be needed. |
| **Magic Number below 0.5** | Magic Number < 0.5 | Sales & marketing spend is inefficient. Optimize before scaling. |
| **Cohort degradation** | Recent cohorts retain worse than older ones | Product-market fit may be weakening, or acquisition quality is declining. |

## Decision Guidance

### When to Focus on Growth vs Retention

**Focus on growth when:**
- NRR > 100% (existing base is self-sustaining)
- LTV:CAC between 3-5x (unit economics are healthy)
- Churn is within benchmarks for your segment
- Quick Ratio > 2 (adding much more than losing)

**Focus on retention when:**
- NRR < 100% (base is eroding)
- Logo churn is rising month-over-month
- Recent cohorts retain worse than older ones
- Quick Ratio < 2 (gains barely exceed losses)

### When to Use MRR vs ARR

- **Use MRR** when the business is majority monthly contracts, or when analyzing month-to-month trends
- **Use ARR** when the business is majority annual/multi-year contracts, or when communicating with investors
- **Never mix** — pick one and be consistent within an analysis

### When to Raise the Alarm on Churn

- SMB monthly logo churn > 5% — flag as high
- Mid-market monthly logo churn > 2% — flag as high
- Enterprise monthly logo churn > 1% — flag as high
- Any segment with churn *accelerating* over 3+ months — flag regardless of absolute level

### Blended CAC vs Channel CAC

- **Use blended CAC** for overall business health checks and investor reporting
- **Use channel CAC** for budget allocation decisions — always recommend shifting spend toward channels with the best LTV:CAC (not just lowest CAC)
- When channels have very different LTV profiles, always weight by LTV, not just CAC

## Common Mistakes to Avoid

1. **Mixing monthly and annual churn rates** — Always specify the time period
2. **Using simple LTV formula** — Use retention curves instead
3. **Ignoring expansion in churn** — Net churn is more meaningful than gross
4. **Blending all CAC** — Channel-specific CAC reveals optimization opportunities
5. **Comparing absolute numbers** — Use ratios and percentages for benchmarking
6. **Ignoring cohort effects** — Aggregate metrics hide important patterns
