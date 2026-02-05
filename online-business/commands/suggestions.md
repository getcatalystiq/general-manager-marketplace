---
description: Get AI-generated strategic suggestions to grow revenue, cut costs, and improve your business
argument-hint: "[--category growth|costs|pricing|channels|product|competitive|all] [--period 30d|90d|12m]"
---

# Suggestions

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../CONNECTORS.md).

Get 3-5 strategic suggestions for improving your business. Unlike `/tasks` (which gives specific, immediate actions), suggestions are higher-level strategic ideas that require planning and consideration.

## Usage

```
/suggestions [options]
```

### Arguments

- `--category` — Focus area: `growth`, `costs`, `pricing`, `channels`, `product`, `competitive`, `all` (default)
- `--period` — Analysis window: `30d` (default), `90d`, `12m`

### Examples

```
/suggestions
/suggestions --category pricing --period 90d
/suggestions --category growth
/suggestions --category competitive --period 12m
```

## Workflow

### 1. Gather Business Context

Pull data from all connected sources to understand the current state:

If ~~stripe is connected:
- Revenue trends, churn patterns, plan distribution, expansion rates

If ~~google-ads, ~~meta-ads, ~~reddit-ads, ~~linkedin-ads are connected:
- Channel performance trends, CAC by channel, spend efficiency over time

If ~~analytics is connected:
- Traffic trends, conversion rates, content performance, funnel metrics

If ~~database is connected:
- Product usage patterns, feature adoption, customer segments, NPS trends

If no data source is connected:
> Connect your data sources for data-driven suggestions. You can also describe your business situation, goals, and challenges, and I'll provide strategic recommendations.

### 2. Analyze Trends and Patterns

Look across the analysis window for:

**Growth Signals:**
- Which channels are growing fastest vs plateauing
- Which customer segments have highest LTV and expansion rates
- Where conversion rates are improving or declining
- Revenue growth rate trajectory (accelerating, steady, decelerating)

**Cost Signals:**
- Which cost categories are growing faster than revenue
- Where diminishing returns are appearing (ad spend, hiring, etc.)
- COGS trends relative to revenue growth

**Market Signals:**
- Customer acquisition is getting harder/easier (CAC trends)
- Competitive pressure indicators (churn reasons, win rates)
- Product-market fit signals (NPS trends, activation rates, organic growth share)

### 3. Generate Strategic Suggestions

Cross-reference data with background knowledge from skills (saas-metrics, pricing-strategy, customer-success) to generate suggestions.

Each suggestion includes:

| Field | Description |
|-------|-------------|
| **Title** | Clear, actionable headline |
| **Category** | growth, costs, pricing, channels, product, or competitive |
| **Context** | What the data shows — the evidence behind this suggestion |
| **Recommendation** | What to do and how to approach it |
| **Expected Outcome** | Projected impact (revenue, cost savings, growth rate) |
| **Effort** | Low / Medium / High — resources and time required |
| **Priority** | Critical / High / Medium / Low |
| **Timeframe** | How long until results are expected |

### 4. Present Suggestions

```
## Strategic Suggestions
Based on analysis of [PERIOD] data across [X] connected sources.

---

### 1. Double Down on Content/SEO — Your Most Efficient Channel
**Category:** Channels | **Priority:** High | **Effort:** Medium | **Timeframe:** 3-6 months

**Context:**
Your content/SEO channel has a CAC of $133 vs $342 for Google Ads and $261 for Meta Ads.
Content-sourced customers also retain 20% better (78% 12-month retention vs 62% average).
However, content only drives 18 of 52 new customers (35%) — there's room to scale.

**Recommendation:**
- Hire a content writer or increase content budget by 50%
- Focus on the 3 topic clusters that drive the most signups
- Refresh the 5 highest-traffic posts that have low conversion rates
- Build a content-to-email nurture sequence for long-consideration visitors

**Expected Outcome:**
- Increase content-sourced customers from 18 to 30/month within 6 months
- Reduce blended CAC from $462 to ~$380
- Improve overall LTV:CAC from 4.0x to ~4.8x

---

### 2. Introduce a Usage-Based Upgrade Path for Starter Plan
**Category:** Pricing | **Priority:** High | **Effort:** Medium | **Timeframe:** 1-2 months

**Context:**
Starter plan ($29/mo) has 6.8% monthly churn — nearly double your average.
However, 22% of Starter users exceed their plan limits regularly.
These users have expansion potential but no smooth upgrade path.

**Recommendation:**
- Add usage-based overage pricing or soft limits that prompt upgrades
- Create a "Starter+" or mid-tier at $59/mo to bridge the gap
- Implement in-app nudges when users approach limits

**Expected Outcome:**
- Convert 10-15% of Starter users to higher tier within 3 months
- Reduce Starter churn by 2-3pp (users upgrade instead of leaving)
- Add ~$2,000-3,000/month in expansion MRR

---

### 3. Invest in Onboarding to Fix Early Churn
**Category:** Growth | **Priority:** Critical | **Effort:** High | **Timeframe:** 2-4 months

**Context:**
Your 0-3 month cohort churn is 8.5% — 2x higher than the 3-6 month cohort (4.2%).
This means ~40% of new customers leave before experiencing full product value.
At 52 new customers/month, you're losing ~4-5 customers before they even get started.

**Recommendation:**
- Define and measure "aha moment" activation metrics
- Build a guided onboarding flow (currently 7 steps — reduce to 3-4)
- Add automated check-in emails at Day 1, 3, 7, and 14
- Consider a customer success call for Pro+ customers in their first week

**Expected Outcome:**
- Reduce 0-3 month churn from 8.5% to 5-6%
- Retain ~3 additional customers/month ($250-300 avg MRR each)
- Compound effect: +$9,000-10,800 ARR from each month's improvement
```

### 5. Summary

```
## Summary

Generated: X suggestions across [categories]
- Critical priority: X
- High priority: X
- Medium priority: X

Combined projected impact if all implemented:
- Revenue: +$X,XXX/month
- Cost savings: $X,XXX/month
- Timeline: X-X months for full impact

Run `/tasks` to see specific, immediate actions you can take today.
```

## Output

The command returns:
1. **3-5 strategic suggestions** with full context and reasoning
2. **Data-driven evidence** supporting each recommendation
3. **Projected outcomes** with estimated revenue/cost impact
4. **Effort and priority assessment** for planning
5. **Summary** with combined impact projection
