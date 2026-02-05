---
description: View your business scorecard — key metrics, trends, and performance across channels at a glance
argument-hint: "[--period 7d|30d|90d|12m] [--channel NAME] [--expand METRIC|all]"
---

# Dashboard

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../CONNECTORS.md).

Your General Manager scorecard. See the 10 metrics that matter most, filtered by time period and growth channel. Each metric includes a trend sparkline; expand any metric for the full time-series breakdown.

## Usage

```
/dashboard [options]
```

### Arguments

- `--period` — Time window: `7d` (last 7 days), `30d` (last 30 days, default), `90d` (last 90 days), `12m` (last 12 months)
- `--from` — Custom start date. Format: `YYYY-MM-DD` (overrides `--period`)
- `--to` — Custom end date. Format: `YYYY-MM-DD` (default: today)
- `--channel` — Filter by growth channel: `google-ads`, `meta-ads`, `reddit-ads`, `linkedin-ads`, `organic`, or a custom channel name. Default: `all` (combined)
- `--expand` — Show full time-series table for a metric: `revenue`, `profit`, `ltv-cac`, `cogs`, `margin`, `traffic`, `leads`, `purchasers`, `arpu`, `nps`, or `all`

### Examples

```
/dashboard
/dashboard --period 7d
/dashboard --period 90d --channel google-ads
/dashboard --from 2026-01-01 --to 2026-01-31
/dashboard --expand revenue
/dashboard --period 12m --expand all
```

## Workflow

### 1. Gather Data from All Connected Sources

**Revenue, Profit, Purchasers, ARPU** — from ~~stripe:
- Pull subscription revenue (MRR) for the selected period
- Pull new customer count and revenue per customer
- Pull refunds and failed payments

**COGS and Margin** — from ~~database:
- Pull cost of goods sold data (hosting, infrastructure, third-party services, support costs)
- If COGS data is unavailable, prompt the user to provide it or estimate from known costs

**Traffic and Leads** — from ~~analytics:
- Pull session/user counts for the selected period
- Pull goal completions or lead events (form submissions, signups, trial starts)
- If `--channel` is specified, filter by traffic source/medium

**LTV:CAC** — from ~~stripe + ad platform connectors:
- Pull LTV from retention-curve calculation (see saas-metrics skill)
- Pull CAC from total ad spend across connected platforms / new customers acquired

**Ad Spend by Channel:**

If ~~google-ads is connected:
- Pull campaign spend for the period

If ~~meta-ads is connected:
- Pull campaign spend for the period

If ~~reddit-ads is connected:
- Pull campaign spend for the period

If ~~linkedin-ads is connected:
- Pull campaign spend for the period

**NPS** — from ~~database:
- Pull latest NPS survey results
- Calculate NPS score (% Promoters - % Detractors)

**If connectors are not available:**
> Connect your data sources to pull metrics automatically. You can also provide data manually — paste numbers, upload a CSV, or describe your metrics and I'll structure them.

Prompt the user to provide any missing metrics directly.

### 2. Calculate Metrics

For the selected period and the comparison period (previous period of equal length), calculate:

| # | Metric | Formula | Source |
|---|--------|---------|--------|
| 1 | **Revenue** | Sum of MRR for the period | ~~stripe |
| 2 | **Profit** | Revenue - COGS - Ad Spend - Operating Costs | ~~stripe + ~~database |
| 3 | **LTV:CAC** | Retention-curve LTV / (Total Acquisition Spend / New Customers) | ~~stripe + ad connectors |
| 4 | **COGS** | Sum of cost of goods sold | ~~database |
| 5 | **Margin** | (Revenue - COGS) / Revenue × 100 | Calculated |
| 6 | **Traffic** | Total sessions or unique users | ~~analytics |
| 7 | **Leads** | Goal completions, signups, trial starts | ~~analytics + ~~database |
| 8 | **Purchasers** | New paying customers in the period | ~~stripe |
| 9 | **ARPU** | Revenue / Active Customers | ~~stripe |
| 10 | **NPS** | % Promoters - % Detractors | ~~database |

If `--channel` is specified, filter Revenue, Leads, Purchasers, COGS, and ad spend to only include data attributed to that channel. Traffic filters to that source. LTV:CAC and ARPU are calculated for that channel's cohort. NPS and Margin recalculate accordingly.

### 3. Render the Scorecard

Present the scorecard as a table. Each row shows:
- Metric name
- Current value (formatted with appropriate units: $, %, x, #)
- Change vs previous period (absolute delta and percentage, with direction arrow)
- Sparkline showing the trend across the period (using block characters: ▁▂▃▄▅▆▇█)

```
## General Manager Dashboard
Period: [START] to [END] | Channel: [CHANNEL or All]

| Metric | Value | vs Prev Period | Trend |
|--------|-------|----------------|-------|
| Revenue | $49,700 | +$4,700 (+10.4%) ↑ | ▃▃▄▄▅▅▆▇ |
| Profit | $18,200 | +$2,100 (+13.0%) ↑ | ▃▄▄▅▅▅▆▇ |
| LTV:CAC | 4.0x | +0.3x (+8.1%) ↑ | ▅▅▅▅▆▆▆▇ |
| COGS | $12,400 | +$800 (+6.9%) ↑ | ▄▄▄▅▅▅▅▆ |
| Margin | 75.1% | +1.2pp ↑ | ▅▅▅▆▆▆▆▇ |
| Traffic | 42,300 | +3,200 (+8.2%) ↑ | ▃▃▄▅▅▆▆▇ |
| Leads | 1,840 | +220 (+13.6%) ↑ | ▂▃▃▄▅▅▆▇ |
| Purchasers | 52 | +6 (+13.0%) ↑ | ▃▃▄▄▅▆▆▇ |
| ARPU | $94 | +$4 (+4.4%) ↑ | ▅▅▆▆▆▆▇▇ |
| NPS | 42 | +3 (+7.7%) ↑ | ▅▅▅▆▆▆▆▇ |
```

**Color/status indicators in the delta column:**
- ↑ for positive changes (improvement)
- ↓ for negative changes (decline)
- → for flat/minimal change (<1%)
- For COGS: ↑ is negative (costs rising), ↓ is positive (costs falling)

### 4. Expand Metrics (if `--expand` is used)

When `--expand METRIC` or `--expand all` is specified, show a full time-series table below the scorecard for each expanded metric.

**For `--period 7d`:** Show daily values with actual dates.
**For `--period 30d`:** Show daily values with actual dates.
**For `--period 90d`:** Show weekly values with week start dates.
**For `--period 12m`:** Show monthly values with month names.

```
### Revenue — Expanded View
| Date | Revenue | Daily Change | Cumulative |
|------|---------|--------------|------------|
| 2026-01-01 | $1,580 | — | $1,580 |
| 2026-01-02 | $1,620 | +$40 (+2.5%) | $3,200 |
| 2026-01-03 | $1,590 | -$30 (-1.9%) | $4,790 |
| ... | ... | ... | ... |
| 2026-01-31 | $1,710 | +$45 (+2.7%) | $49,700 |
```

Include a note about notable peaks, dips, or patterns (e.g., "Revenue dipped on Jan 15 — coincides with a holiday weekend").

### 5. Quick Navigation

At the bottom of the dashboard, show links to deeper analysis:

```
## Dive Deeper
- `/analyze-ads` — Deep dive into ad campaign performance
- `/analyze-funnel` — Conversion funnel analysis
- `/track-growth` — Full SaaS growth metrics (MRR breakdown, cohorts, unit economics)
- `/tasks` — Review AI-suggested actions for your business
- `/suggestions` — Strategic improvement ideas
```

## Output

The command returns:
1. **Scorecard table** with 10 key metrics, comparisons, and sparkline trends
2. **Expanded time-series** for any metrics specified with `--expand`
3. **Quick navigation** links to deeper analysis commands
