---
description: Review AI-suggested actions with 3-scenario impact predictions — approve or reject with full visibility into tradeoffs
argument-hint: "[--status pending|approved|rejected|all] [--category NAME]"
---

# Tasks

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../CONNECTORS.md).

Review a prioritized list of AI-generated actions for your business. Each task includes a 3-scenario prediction model (worst/base/best case) showing which metrics improve, which decline, and the tradeoffs — so you can make informed decisions.

## Usage

```
/tasks [options]
```

### Arguments

- `--status` — Filter tasks: `pending` (default), `approved`, `rejected`, `all`
- `--category` — Filter by category: `ads`, `content`, `funnel`, `pricing`, `churn`, `all` (default)

### Examples

```
/tasks
/tasks --status all
/tasks --category ads
/tasks --status approved --category churn
```

## Workflow

### 1. Gather Data for Analysis

Pull the latest data from all connected sources to identify optimization opportunities:

If ~~google-ads, ~~meta-ads, ~~reddit-ads, or ~~linkedin-ads are connected:
- Pull campaign and keyword performance data
- Identify underperforming campaigns, wasteful keywords, budget imbalances

If ~~analytics is connected:
- Pull traffic and conversion data
- Identify content performance issues, funnel drop-offs

If ~~stripe is connected:
- Pull subscription and churn data
- Identify at-risk customers, pricing opportunities, expansion signals

If ~~database is connected:
- Pull product usage and engagement data
- Identify activation issues, feature adoption gaps

If no data source is connected:
> Connect your data sources to get AI-generated action items automatically. You can also describe your current business situation and I'll generate suggestions based on that.

### 2. Generate Action Items

Analyze the data to find optimization opportunities across these categories:

**Ads Optimization:**
- Pause keywords/campaigns spending >$100 with 0 conversions
- Reallocate budget from low-performing to high-performing channels
- Adjust bids on keywords where CAC is >2x account average
- Add negative keywords based on wasted spend patterns
- Scale campaigns where LTV:CAC is >5x

**Content Optimization:**
- Refresh high-traffic, low-conversion pages (add CTAs, update copy)
- Promote high-converting, low-traffic content
- Archive or redirect declining content
- Write new content in top-performing topic clusters

**Funnel Optimization:**
- Fix stages with >50% drop-off or sudden drop-off increases
- Simplify onboarding steps with high abandonment
- Add retargeting for users who dropped off at key stages
- A/B test changes at highest-friction points

**Pricing Optimization:**
- Adjust pricing tiers based on usage patterns and willingness-to-pay signals
- Introduce or modify annual discount to improve retention
- Add usage-based upgrade prompts at natural limit points

**Churn Prevention:**
- Intervene with customers showing declining usage (health score drops)
- Reach out to customers approaching renewal with low engagement
- Offer targeted retention offers to at-risk segments
- Address support ticket patterns indicating dissatisfaction

### 3. Build Prediction Model for Each Task

For every task, build a 3-scenario impact prediction across all 10 dashboard metrics. This is the core of the decision-support system.

#### Modeling Methodology

**Inputs to the model:**
1. **Historical data** — How have similar actions performed in the past? (e.g., previous keyword pauses, budget reallocations, churn interventions)
2. **Industry benchmarks** — What do comparable businesses typically see? (from saas-metrics, pricing-strategy, customer-success skills)
3. **Current metric baselines** — Today's values for all 10 dashboard metrics
4. **Sensitivity analysis** — Which metrics are tightly coupled to this action vs loosely correlated?

**Scenario definitions:**

| Scenario | Assumption | Use |
|----------|------------|-----|
| **Worst Case** (P10) | Conservative: action underperforms, negative side effects materialize, market headwinds | Floor for decision-making — "even in the worst case, is this acceptable?" |
| **Base Case** (P50) | Realistic: action performs in line with historical data and benchmarks, normal conditions | Most likely outcome — primary basis for the decision |
| **Best Case** (P90) | Optimistic: action outperforms, positive side effects, favorable conditions | Ceiling — "how good could this get if things go well?" |

**For each scenario, calculate impact on all 10 metrics:**

| Metric | How to Model Impact |
|--------|---------------------|
| **Revenue** | Direct: saved spend, new conversions × ARPU. Indirect: retention improvements × MRR. |
| **Profit** | Revenue change minus cost change (including implementation cost of the action) |
| **LTV:CAC** | Recalculate LTV (if retention changes) and CAC (if spend or acquisition changes) |
| **COGS** | Does this action change costs? (e.g., more customers = more support cost) |
| **Margin** | Derived from revenue and COGS changes |
| **Traffic** | Does pausing ads reduce traffic? Does content refresh increase organic? |
| **Leads** | Conversion rate changes × traffic changes |
| **Purchasers** | Lead changes × funnel conversion rate |
| **ARPU** | Does this shift the customer mix? (e.g., more Enterprise, fewer Starter) |
| **NPS** | Does this improve customer experience? (e.g., churn intervention, onboarding fix) |

**Identify tradeoffs explicitly:**
Some actions improve one metric while hurting another. Flag these clearly:
- Pausing ads → improves Profit, may reduce Traffic and Leads
- Raising prices → improves Revenue and ARPU, may increase Churn and reduce Purchasers
- Churn discounts → improves Retention, reduces ARPU and Margin
- Scaling ad spend → increases Traffic and Leads, may increase CAC and reduce Margin

#### Confidence Rating

Rate prediction confidence based on data quality:

| Confidence | Criteria | Display |
|------------|----------|---------|
| **High** | Based on your own historical data from similar past actions; large sample size | ●●●●○ |
| **Medium-High** | Based on partial historical data plus strong industry benchmarks | ●●●○○ |
| **Medium** | Based on industry benchmarks with limited internal data | ●●○○○ |
| **Low-Medium** | Based on general best practices; limited comparable data | ●○○○○ |
| **Low** | Novel action with no historical precedent; rough estimate only | ○○○○○ |

### 4. Prioritize Actions

Rank each action by a composite score:

| Factor | Weight | Description |
|--------|--------|-------------|
| **Base Case Net Impact** | 35% | Projected net dollar impact across all metrics (P50) |
| **Downside Risk** | 25% | How bad is the worst case? Smaller downside = higher score |
| **Confidence** | 20% | How reliable is the prediction? |
| **Effort** | 10% | How easy is this to implement? (low/medium/high) |
| **Urgency** | 10% | Time sensitivity (is the opportunity shrinking?) |

### 5. Present Tasks for Review

Display each task with its full prediction model. The UX has three layers: a quick-scan header, a scenario comparison table, and a detailed tradeoff breakdown.

#### Layer 1: Task Header (scan in 3 seconds)

A single-line summary with the net base-case impact, direction indicators for key tradeoffs, and effort/confidence.

```
## Pending Tasks (3 items)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Layer 2: Scenario Comparison (understand in 30 seconds)

For each task, show a compact scenario table covering only the metrics that are materially affected (>1% change). Use directional symbols and formatting to make tradeoffs instantly visible.

#### Layer 3: Detailed Evidence (deep dive in 2 minutes)

Supporting data, methodology notes, and assumptions behind the predictions.

#### Full Task Example:

```
### 1. Reallocate $500/day from Meta Ads to Google Ads
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Category: Ads | Effort: Low | Confidence: ●●●●○
Base Case Net Impact: +$4,200/mo profit | Tradeoffs: Leads from Meta ↓

Google Ads CAC ($85) is 3x lower than Meta Ads CAC ($261).
Moving $500/day should improve blended efficiency.

#### Impact Prediction

                         WORST         BASE          BEST
                         CASE          CASE          CASE
Metric                   (P10)         (P50)         (P90)
─────────────────────────────────────────────────────────────
Revenue               +$800/mo     +$2,400/mo     +$4,100/mo
  ↳ New customers       +4            +12            +20
Profit              +$1,900/mo     +$4,200/mo     +$6,800/mo
  ↳ Spend savings     $1,100/mo     $1,800/mo     $2,700/mo
LTV:CAC               4.0x→4.1x    4.0x→4.4x      4.0x→4.8x
Traffic                  -8%           -3%            +2%
  ↳ Meta reach drops, Google may not fully replace volume
Leads                    -5%           +4%           +12%
  ↳ Fewer Meta leads, more Google leads (higher intent)
Purchasers               +2            +8            +15
Margin                 +0.5pp        +1.8pp         +3.1pp
─────────────────────────────────────────────────────────────
COGS                   No change     No change      No change
ARPU                   No change     No change      No change
NPS                    No change     No change      No change

#### Tradeoffs

  ▲ IMPROVES                          ▼ MAY DECLINE
  ├─ Profit (+$4,200/mo base)         ├─ Traffic (-3% base)
  ├─ LTV:CAC (4.0x → 4.4x)           │  Meta provides broader
  ├─ Margin (+1.8pp)                  │  reach that Google may
  └─ Purchasers (+8 base)             │  not fully replace
                                      └─ Meta audience data
                                         loss (retargeting pools
                                         may shrink over time)

  ⚖️ KEY TRADEOFF: You gain efficiency (lower CAC, higher margin)
  but may lose top-of-funnel reach from Meta's audience network.
  If brand awareness from Meta matters, consider a smaller reallocation.

#### Evidence
| Channel   | Spend (30d) | Conv | CAC   | Conv Rate | LTV of Cohort |
|-----------|-------------|------|-------|-----------|---------------|
| Google    | $8,200      | 96   | $85   | 3.8%      | $2,100        |
| Meta      | $15,400     | 59   | $261  | 1.2%      | $1,650        |

Model basis: 6 months of channel performance data. Past budget
shifts between these channels showed 70-85% of predicted impact.

→ Approve / Reject
```

#### Another Example (pricing action with significant tradeoffs):

```
### 2. Raise Starter Plan Price from $29 to $49/mo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Category: Pricing | Effort: Low | Confidence: ●●●○○
Base Case Net Impact: +$3,800/mo revenue | Tradeoffs: Purchasers ↓, Churn ↑

Starter plan has 6.8% monthly churn and lowest LTV ($580).
Price increase could improve unit economics but may reduce sign-ups.

#### Impact Prediction

                         WORST         BASE          BEST
                         CASE          CASE          CASE
Metric                   (P10)         (P50)         (P90)
─────────────────────────────────────────────────────────────
Revenue              -$1,200/mo     +$3,800/mo     +$7,600/mo
  ↳ Depends on volume lost vs price gained
Profit               -$800/mo      +$3,400/mo     +$7,200/mo
ARPU                $94→$98        $94→$106       $94→$112
LTV:CAC              4.0x→3.6x     4.0x→4.8x      4.0x→5.5x
  ↳ LTV increases if retained customers pay more
Purchasers             -35%           -15%           -5%
  ↳ Price-sensitive segment may not convert
Churn (Starter)      8.5%→12%      8.5%→9.5%      8.5%→7%
  ↳ Best case: higher price attracts more committed customers
Leads                  -20%           -8%            -2%
  ↳ Some leads may abandon at higher price point
Traffic              No change     No change       No change
NPS                    -5pts          -2pts          +3pts
  ↳ Best case: fewer low-value customers = higher satisfaction
Margin               +1.0pp         +2.8pp         +4.5pp
COGS                -$200/mo       -$400/mo       -$600/mo
  ↳ Fewer low-value customers = lower support burden
─────────────────────────────────────────────────────────────

#### Tradeoffs

  ▲ IMPROVES                          ▼ MAY DECLINE
  ├─ Revenue (+$3,800/mo base)        ├─ Purchasers (-15% base)
  ├─ ARPU ($94 → $106)               │  Price-sensitive prospects
  ├─ Profit (+$3,400/mo)             │  will drop off
  ├─ Margin (+2.8pp)                  ├─ Leads (-8% base)
  └─ COGS (-$400/mo fewer            │  Fewer Starter sign-ups
     support-heavy customers)         └─ Churn may rise short-term
                                         Existing Starter customers
                                         may feel forced to upgrade
                                         or cancel

  ⚖️ KEY TRADEOFF: Revenue per customer improves significantly,
  but you'll acquire fewer customers. The net is positive in the
  base case, but in the worst case you lose more volume than the
  price increase gains. Consider grandfathering existing customers
  and A/B testing the new price on new sign-ups first.

  ⚠️ WORST CASE WARNING: In the P10 scenario, this action loses
  $1,200/mo. The downside is bounded (you can revert the price)
  but recovery takes 2-3 months as churned customers don't return.

#### Evidence
| Data Point                | Value         | Source        |
|---------------------------|---------------|---------------|
| Current Starter customers | 185           | ~~stripe      |
| Starter monthly churn     | 6.8%          | ~~stripe      |
| Starter LTV               | $580          | Calculated    |
| Competitor starter prices  | $39-59/mo     | Market data   |
| Price elasticity estimate  | -0.6 to -1.2  | Industry avg  |

Model basis: Price elasticity estimated from industry benchmarks
(no internal A/B test data). Competitor pricing supports the $49
price point. Confidence is Medium — would increase to High with
an A/B test on new sign-ups.

→ Approve / Reject
```

#### Another Example (churn action with mostly upside):

```
### 3. Reach Out to 8 At-Risk Customers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Category: Churn | Effort: Medium | Confidence: ●●●○○
Base Case Net Impact: +$1,920/mo retained MRR | Tradeoffs: Minor

8 customers with declining usage (logins down >50% in 30 days).
Proactive outreach historically saves 30-50% of at-risk accounts.

#### Impact Prediction

                         WORST         BASE          BEST
                         CASE          CASE          CASE
Metric                   (P10)         (P50)         (P90)
─────────────────────────────────────────────────────────────
Revenue               +$640/mo      +$1,920/mo     +$2,880/mo
  ↳ Save 2 of 8        Save 4 of 8    Save 6 of 8
Profit                +$540/mo      +$1,680/mo     +$2,600/mo
  ↳ Net of CSM time cost (~$100-280 for outreach)
LTV:CAC               No change     4.0x→4.1x      4.0x→4.2x
Churn                 -0.1pp         -0.4pp         -0.6pp
NPS                   No change      +1pt           +3pts
  ↳ Customers appreciate proactive outreach
─────────────────────────────────────────────────────────────
Traffic, Leads, Purchasers, COGS, Margin, ARPU: No material change

#### Tradeoffs

  ▲ IMPROVES                          ▼ MAY DECLINE
  ├─ Revenue (+$1,920/mo)            ├─ (none material)
  ├─ Profit (+$1,680/mo)             │
  ├─ Churn (-0.4pp)                  │  Only cost is CSM time
  └─ NPS (+1pt)                      │  (~4-6 hours total)

  ✅ LOW-RISK ACTION: Downside is minimal (only cost is staff time).
  Even the worst case is positive. This is a "no-brainer" approve.

#### At-Risk Customers
| Customer  | Plan | MRR   | Login Trend | Last Active | Health |
|-----------|------|-------|-------------|-------------|--------|
| Acme Corp | Pro  | $499  | ↓ 65%       | 12 days ago | 28/100 |
| Bolt Inc  | Pro  | $499  | ↓ 58%       | 8 days ago  | 35/100 |
| ClearView | Biz  | $299  | ↓ 72%       | 15 days ago | 22/100 |
| DataFlow  | Pro  | $499  | ↓ 51%       | 6 days ago  | 38/100 |
| ...       | ...  | ...   | ...         | ...         | ...    |
Total at-risk MRR: $3,840/mo

Model basis: Industry benchmark for proactive churn outreach
success rate is 25-50%. Your past interventions (Q3 2025) saved
4 of 10 contacted accounts (40%), supporting the base case.

→ Approve / Reject
```

### 6. Handle Approvals and Rejections

**When the user approves a task:**
- Confirm the action and mark it as approved
- Record the predicted scenario values (worst/base/best) so they can be compared to actuals later in `/history`
- Log the approval to history with timestamp and prediction snapshot
- If the action can be executed through a connected platform (e.g., pausing keywords via ~~google-ads), describe the steps or execute if the connector supports write operations

**When the user rejects a task:**
- Ask for a brief reason (optional) to improve future suggestions
- Mark as rejected and log to history
- Don't re-suggest the same action unless data changes significantly

### 7. Summary

After review, show an aggregate impact summary combining all approved tasks:

```
## Tasks Summary

Reviewed: 3 tasks
- Approved: 2
- Rejected: 1

### Combined Impact of Approved Actions (Base Case)

| Metric      | Current  | After (P10) | After (P50) | After (P90) |
|-------------|----------|-------------|-------------|-------------|
| Revenue     | $49,700  | +$1,440     | +$4,320     | +$6,980     |
| Profit      | $18,200  | +$2,440     | +$5,880     | +$9,400     |
| LTV:CAC     | 4.0x     | 4.1x        | 4.4x        | 4.9x        |
| Traffic     | 42,300   | -8%         | -3%         | +2%         |
| Leads       | 1,840    | -5%         | +4%         | +12%        |
| Purchasers  | 52       | +6          | +20         | +35         |
| ARPU        | $94      | $94         | $94         | $94         |
| Margin      | 75.1%    | +0.5pp      | +1.8pp      | +3.1pp      |
| NPS         | 42       | +0          | +1          | +3          |
| COGS        | $12,400  | $12,400     | $12,400     | $12,400     |

### Net Assessment
Best-case combined: +$9,400/mo profit, +35 purchasers
Base-case combined: +$5,880/mo profit, +20 purchasers
Worst-case combined: +$2,440/mo profit, +6 purchasers (still positive)

Key tradeoff to monitor: Traffic may dip 3-8% from Meta budget
reallocation. Watch in `/dashboard --period 7d` after implementation.

### Prediction Tracking
These predictions will be tracked in `/history`. Review actuals
vs predictions in 30 days to calibrate future models.

Next review recommended: [DATE]
```

## Output

The command returns:
1. **Prioritized task list** with AI-generated actions
2. **3-scenario prediction model** (worst/base/best) for each task
3. **Tradeoff visualization** showing which metrics improve and which may decline
4. **Confidence ratings** based on data quality and historical precedent
5. **Approve/reject prompts** for each task
6. **Combined impact summary** aggregating predictions for all approved tasks
