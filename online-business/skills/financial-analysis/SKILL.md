---
name: financial-analysis
description: Financial analysis and projection expertise for scenario modeling, revenue forecasting, sensitivity analysis, and cash flow planning. Use when building predictions, comparing worst/base/best case scenarios, forecasting metrics, estimating impact of business decisions, or planning budgets.
---

# Financial Analysis & Projections

You are an expert at financial analysis, scenario modeling, and business projections for SaaS and online businesses. You build rigorous forecasts using historical data, cohort behavior, and sensitivity analysis. You present predictions as calibrated ranges (P10/P50/P90), not single-point estimates — because precision creates false confidence. When projections depend on shaky assumptions, you flag the uncertainty explicitly.

## Scenario Modeling

### The P10 / P50 / P90 Framework

Every prediction should include three scenarios:

| Scenario | Meaning | When It Happens |
|----------|---------|-----------------|
| **P10 (Worst Case)** | Only a 10% chance the outcome is this bad or worse | Multiple headwinds materialize: churn spikes, campaigns underperform, market softens |
| **P50 (Base Case)** | Equally likely to over- or under-perform this | Current trends continue, execution is average, no major surprises |
| **P90 (Best Case)** | Only a 10% chance the outcome is this good or better | Multiple tailwinds: strong retention, campaigns over-deliver, organic growth accelerates |

### Building Each Scenario

**P50 (Base Case) — Build this first:**
1. Start with trailing 3-month average for key metrics
2. Apply known upcoming changes (planned campaigns, pricing changes, seasonal effects)
3. Assume current trends continue at their current rate
4. This is your anchor — P10 and P90 adjust from here

**P10 (Worst Case) — Stress test the base:**
1. Take each growth driver and reduce it by 1-2 standard deviations from historical variance
2. Apply the worst month from the last 12 months as the baseline
3. Compound negative effects (e.g., higher churn + lower acquisition = faster decline)
4. Include realistic risk events: key customer churns, campaign fatigue, competitive pressure

**P90 (Best Case) — Stretch the base:**
1. Take each growth driver and increase it by 1-2 standard deviations
2. Apply the best month from the last 12 months as the baseline
3. Include realistic upside events: viral content, partnership launch, seasonal tailwind
4. Do NOT assume everything goes right simultaneously — that's P99, not P90

### Scenario Calibration Rules

- **P10 and P90 should feel uncomfortable** — if they're too close to P50, the range is too narrow
- **Historical variance is your guide** — if MRR growth has ranged from -2% to +8% monthly, your scenarios should reflect that spread
- **Never present P90 as the plan** — humans anchor on best case; always lead with P50
- **Compound effects matter** — a 5% monthly improvement compounds to 80% annually, not 60%
- **Recalibrate monthly** — scenarios should update as new data arrives

## Revenue Forecasting

### Forecasting Methods

| Method | Best For | Data Needed |
|--------|----------|-------------|
| **Cohort-based** | Established products with retention data | 6+ months of cohort data |
| **Growth rate extrapolation** | Steady-state businesses | 3+ months of consistent growth |
| **Bottoms-up** | Sales-led businesses | Pipeline data, conversion rates |
| **Tops-down** | Market sizing, new products | Market size, capture rate estimates |

### Cohort-Based Revenue Forecasting (Preferred)

The most accurate method for SaaS:

```
Month N Revenue = Σ (Cohort K retained customers × Cohort K ARPU)
                  for all cohorts K = 1 to N
```

**Steps:**
1. Build retention curves by signup cohort (monthly)
2. For existing cohorts: apply their observed retention curve forward
3. For future cohorts: use recent cohort averages as the template
4. Apply expansion revenue rates from historical data
5. Sum all cohort contributions for each future month

**Why this works:**
- Accounts for churn naturally (retention curve)
- Captures expansion revenue patterns
- Avoids the simple `MRR / churn rate` trap
- Reveals when older cohorts mature vs when new acquisition must compensate

### Growth Rate Extrapolation

For simpler forecasting when cohort data isn't available:

```
Future MRR = Current MRR × (1 + monthly_growth_rate) ^ months
```

**Important corrections:**
- Use the trailing 3-month average growth rate, not last month (too noisy)
- Apply growth rate decay: most SaaS companies' growth rate declines ~1-2% per quarter as they scale
- Cap maximum growth rate at historical peak unless there's a clear catalyst

### Revenue Forecast Template

For each month, project:

| Component | How to Project |
|-----------|---------------|
| **Starting MRR** | Previous month's ending MRR |
| **+ New MRR** | Projected new customers × projected ARPU |
| **+ Expansion MRR** | Expansion rate × eligible base |
| **+ Reactivation MRR** | Historical reactivation rate × churned base |
| **- Contraction MRR** | Contraction rate × current base |
| **- Churned MRR** | Churn rate × current base |
| **= Ending MRR** | Sum of above |

## Sensitivity Analysis

### Identifying Key Variables

Not all inputs matter equally. Rank by impact:

| Variable | Typical Sensitivity | Why It Matters |
|----------|-------------------|----------------|
| **Churn rate** | High — compounds monthly | 1% monthly churn vs 3% = massive LTV difference |
| **New customer acquisition rate** | High — drives top-line | Directly controls growth trajectory |
| **ARPU** | Medium-High — multiplier effect | Affects LTV, revenue, margins |
| **CAC** | Medium — affects efficiency | Changes payback period, cash needs |
| **Expansion rate** | Medium — compounds over time | Difference between NRR >100% and <100% |
| **Gross margin** | Medium — profitability | Determines how much of revenue is real |
| **Growth rate of new acquisition** | High at scale | Growth rate of growth matters most at scale |

### One-Variable Sensitivity Table

For each key variable, show impact across a range:

```
Variable: Monthly Churn Rate
┌─────────────────────────────────────────────┐
│ Churn   │  12-mo MRR  │  12-mo LTV  │ NRR  │
├─────────┼─────────────┼─────────────┼──────┤
│ 1.0%    │  $520K      │  $8,500     │ 112% │
│ 2.0%    │  $480K      │  $5,200     │ 104% │
│ 3.0%    │  $440K      │  $3,800     │  96% │  ← base case
│ 4.0%    │  $395K      │  $3,000     │  88% │
│ 5.0%    │  $350K      │  $2,500     │  80% │
└─────────┴─────────────┴─────────────┴──────┘
```

### Multi-Variable Scenario Matrix

For the two most impactful variables, build a 2D matrix:

```
              New Customers / Month
              │  40    │  60    │  80    │  100   │
Churn ────────┼────────┼────────┼────────┼────────┤
  2%          │ $420K  │ $480K  │ $540K  │ $600K  │
  3%          │ $380K  │ $440K  │ $500K  │ $560K  │
  4%          │ $340K  │ $395K  │ $450K  │ $510K  │
  5%          │ $300K  │ $350K  │ $400K  │ $460K  │
```

Highlight the cell that represents the current base case.

### Break-Even Sensitivity

For major decisions (pricing change, new channel, headcount), show what has to be true for it to break even:

```
Decision: Increase ad spend by $20K/month
Break-even requires: 40 new customers/month at current ARPU
Current acquisition: 55 customers/month from this channel
Margin of safety: 27% (can underperform by 27% and still break even)
```

## Cash Flow Forecasting

### SaaS Cash Flow Peculiarities

- **Monthly billing** = cash matches revenue
- **Annual billing** = cash collected upfront, recognized over 12 months
- **Revenue ≠ cash** — deferred revenue is a liability, not spendable profit
- **Growth consumes cash** — higher CAC upfront, LTV comes later

### Cash Runway Calculation

```
Runway (months) = Cash Balance / Monthly Net Burn Rate
```

**Net burn rate components:**
- Revenue (cash collected, not recognized)
- Cost of goods sold
- Operating expenses (salaries, tools, rent)
- Customer acquisition costs
- One-time expenses

### Runway Scenarios

Always present runway in three scenarios:

| Scenario | Assumption | Runway |
|----------|------------|--------|
| **P10** | Revenue grows 0%, costs grow 5%/month | X months |
| **P50** | Revenue grows at current rate, costs as budgeted | Y months |
| **P90** | Revenue accelerates 20%, costs flat | Z months |

## Confidence Calibration

### Confidence Rating Scale

Assign a confidence level to every projection:

| Rating | Symbol | Meaning | Typical Context |
|--------|--------|---------|-----------------|
| **Very High** | ●●●●● | Narrow range, well-understood dynamics | Existing product, stable metrics, short horizon |
| **High** | ●●●●○ | Reasonably predictable, some variance | Established channel, 3-6 month horizon |
| **Medium** | ●●●○○ | Meaningful uncertainty, range is wide | New campaign, pricing change, 6-12 month horizon |
| **Low** | ●●○○○ | More unknown than known | New channel, new market, major pivot |
| **Very Low** | ●○○○○ | Educated guess at best | Unvalidated assumptions, 12+ month horizon |

### When to Widen Uncertainty Bands

Widen P10-P90 range when:
- The business has <6 months of data
- A major change is being introduced (new pricing, new channel, new market)
- External factors are volatile (economy, regulation, competitive moves)
- Historical variance has been high (metric swings month-to-month)
- The projection horizon is >6 months

### When to Narrow Uncertainty Bands

Narrow P10-P90 range when:
- 12+ months of stable, consistent data
- No major changes planned
- Metrics have low month-to-month variance
- Short projection horizon (1-3 months)
- Multiple independent data sources agree

## Impact Estimation for Business Decisions

### Estimating the Impact of a Change

For every proposed action (in `/tasks`), estimate impact using:

1. **Historical analogues** — What happened last time we (or similar companies) did this?
2. **First-principles calculation** — If we change X by Y%, what's the mathematical effect on Z?
3. **Benchmark data** — What do industry benchmarks say about typical results?
4. **Regression to mean** — Extreme results tend to moderate over time

### Impact Decay

Most interventions have diminishing impact over time:

| Intervention Type | Peak Impact | Decay Pattern |
|-------------------|-------------|---------------|
| **Ad creative refresh** | Week 1-2 | Drops 30-50% by week 4 (creative fatigue) |
| **Price increase** | Month 1 | Stabilizes by month 3 (churn from objectors subsides) |
| **Onboarding improvement** | Month 1-2 | Sustains if structural; fades if novelty-driven |
| **Churn intervention (individual)** | Immediate | One-time save, doesn't compound |
| **Budget reallocation** | Week 2-4 | Stabilizes as new allocation optimizes |
| **New channel launch** | Month 2-3 | Often dips first (learning phase), then climbs |

### Compounding vs One-Time Effects

Always distinguish:

- **One-time effects**: A single customer saved, a one-time cost reduction, a bug fix. Impact is additive, not compounding.
- **Rate changes**: Improving monthly churn from 4% to 3%, improving conversion rate. Impact compounds every period — these are much more valuable than they appear in month 1.

When presenting impact in `/tasks`, always note: "This is a **rate change** (compounds monthly)" or "This is a **one-time effect**."

## Red Flags — Flag These Immediately

| Red Flag | Signal | Recommended Action |
|----------|--------|-------------------|
| **Hockey stick projection** | Forecast shows flat-then-explosive growth | Challenge the inflection point. What specifically causes the acceleration? If it's "hope," flatten the curve. |
| **Single-point estimates** | Projection has no range or scenarios | Reject and rebuild with P10/P50/P90. Single points create false confidence. |
| **Best case as the plan** | Operating budget assumes P90 | Rebase to P50. Budget for base case, plan for upside, prepare for downside. |
| **Ignoring churn compounding** | Revenue projection doesn't account for cumulative churn | A 3% monthly churn rate means 31% of customers are gone in 12 months, not 36%. Model the compounding. |
| **Revenue = cash assumption** | Treating recognized revenue as spendable cash | Separate cash flow from revenue recognition, especially with annual contracts. |
| **No sensitivity on key variables** | Projection doesn't show what happens if assumptions are wrong | Always include at minimum a one-variable sensitivity on churn and acquisition rate. |
| **Projection horizon > data history** | Forecasting 24 months with 6 months of data | Flag as ●●○○○ confidence or lower. Shorten horizon or widen ranges significantly. |
| **Growth rate doesn't decay** | Projecting 15% monthly growth for 24 months | Almost all SaaS growth rates decay. Apply 1-2% quarterly decay unless there's a clear catalyst. |
| **CAC rising without explanation** | Acquisition costs increasing quarter-over-quarter | Channel saturation, competitor bidding, or audience fatigue. Investigate before it erodes unit economics. |

## Decision Guidance

### When to Trust the Model vs Rely on Judgment

**Trust the model when:**
- 12+ months of stable historical data
- The decision is a small incremental change (budget shift, bid adjustment)
- Multiple data sources agree on the trend
- Short projection horizon (1-3 months)

**Rely more on judgment when:**
- The business is pre-PMF or <6 months old
- The decision is unprecedented (new market, new product line)
- External conditions are changing rapidly
- Historical data shows high variance with no clear pattern

### When to Use Cohort-Based vs Simple Forecasting

**Use cohort-based forecasting when:**
- You have 6+ months of cohort retention data
- Churn rates vary significantly by cohort vintage
- Expansion revenue is meaningful (>10% of MRR)
- Accuracy matters (fundraising, strategic planning)

**Use simple growth-rate extrapolation when:**
- Quick directional estimate needed
- Limited cohort data available
- Short horizon (1-3 months)
- The business has very stable, predictable metrics

### When to Recommend Scenario Planning vs Point Forecasts

**Use full scenario modeling (P10/P50/P90) for:**
- Any decision with >$10K monthly impact
- Strategic decisions (pricing, hiring, channel mix)
- Board/investor presentations
- Decisions that are hard to reverse

**A point estimate with directional confidence is fine for:**
- Small tactical decisions (<$5K impact)
- Internal rough planning
- Quick comparisons between options
- Decisions that are easily reversible

### Short-Horizon vs Long-Horizon Projections

| Horizon | Confidence | Method | Update Frequency |
|---------|------------|--------|-----------------|
| **1-3 months** | High | Extrapolation + known changes | Monthly |
| **3-6 months** | Medium | Cohort-based + scenarios | Monthly |
| **6-12 months** | Low-Medium | Scenarios with wide ranges | Quarterly |
| **12-24 months** | Low | Directional only, wide ranges | Quarterly |
| **24+ months** | Very Low | Strategic planning only, not operational | Annually |

## Common Projection Mistakes

1. **Anchoring on best case** — Humans naturally plan for the optimistic scenario. Always present P50 first.
2. **Ignoring compounding** — Both growth and churn compound. 5% monthly growth = 80% annual, not 60%.
3. **Assuming independence** — Metrics are correlated. A recession hits acquisition AND churn AND expansion simultaneously.
4. **Overfitting to recent data** — One great month doesn't make a trend. Use 3+ months minimum.
5. **Not updating** — A forecast made 3 months ago with 3-month-old data is fiction. Update with actuals monthly.
6. **Confusing precision with accuracy** — "$487,293 projected MRR" implies false precision. "$480-500K" is more honest and equally useful.
7. **Survivorship bias in benchmarks** — Published benchmarks skew toward successful companies. Adjust downward for realism.
8. **Linear thinking about non-linear systems** — Growth rates decay, churn compounds, CAC increases with scale. Model the curves, not the lines.
