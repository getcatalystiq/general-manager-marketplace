---
description: SaaS metrics expertise for accurate MRR, churn, LTV, and CAC calculations
triggers:
  - MRR
  - monthly recurring revenue
  - ARR
  - annual recurring revenue
  - churn
  - churn rate
  - LTV
  - lifetime value
  - CAC
  - customer acquisition cost
  - unit economics
  - cohort analysis
  - net revenue retention
  - NRR
  - expansion revenue
---

# SaaS Metrics Expertise

This skill provides accurate definitions and calculation methods for core SaaS metrics. Use these standards when analyzing or discussing SaaS business performance.

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

## Common Mistakes to Avoid

1. **Mixing monthly and annual churn rates** — Always specify the time period
2. **Using simple LTV formula** — Use retention curves instead
3. **Ignoring expansion in churn** — Net churn is more meaningful than gross
4. **Blending all CAC** — Channel-specific CAC reveals optimization opportunities
5. **Comparing absolute numbers** — Use ratios and percentages for benchmarking
6. **Ignoring cohort effects** — Aggregate metrics hide important patterns
