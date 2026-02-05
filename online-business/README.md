# General Manager — Online Business

Your AI General Manager for online businesses. Get a real-time scorecard of the metrics that matter, review AI-suggested actions, and track what's working — all from one plugin.

## Commands

### Dashboard & Overview

| Command | Description |
|---------|-------------|
| `/dashboard` | Your business scorecard — 10 key metrics with trends, filtered by time period and channel |
| `/tasks` | Review AI-suggested actions (pause ads, reallocate budget, intervene on churn) — approve or reject |
| `/suggestions` | Strategic improvement ideas with projected impact and effort |
| `/history` | Log of past actions, metric changes, and business events |

### Deep-Dive Analysis

| Command | Description |
|---------|-------------|
| `/analyze-ads` | Deep dive into Google Ads performance, wasteful spend, optimization recommendations |
| `/analyze-funnel` | Conversion funnel analysis, drop-off points, signup flow optimization |
| `/track-growth` | Full SaaS growth metrics — MRR breakdown, churn, LTV, CAC, cohort analysis |

## Quick Start

1. Install the plugin in Claude Cowork
2. Connect your data sources (see [CONNECTORS.md](CONNECTORS.md))
3. Run your dashboard:

```
/dashboard
```

## Connectors

This plugin integrates with your online business growth stack:

- **Google Ads** — Campaign performance, keyword data, CAC by campaign
- **Meta Ads** — Facebook/Instagram campaigns, audience performance, conversions
- **Reddit Ads** — Reddit campaign performance and conversions
- **LinkedIn Ads** — LinkedIn campaigns, lead gen, professional audience targeting
- **Google Analytics 4** — Traffic sources, conversion funnels, content performance
- **Stripe** — Subscription data, MRR, churn, customer lifecycle
- **Database (Postgres/MySQL)** — Product analytics, user events, COGS, NPS, custom metrics

See [CONNECTORS.md](CONNECTORS.md) for setup instructions.

## Example Workflows

### Morning Snapshot (2 minutes)
```
/dashboard --period 7d
```

### Weekly Review (10 minutes)
```
/dashboard --period 7d
/tasks
/suggestions --period 30d
```

### Monthly Deep Dive (30 minutes)
```
/dashboard --period 30d --expand all
/tasks --status all
/analyze-ads --from 30-days-ago
/analyze-funnel --funnel signup
/track-growth --compare previous
```

### Channel Performance Check
```
/dashboard --period 30d --channel google-ads
/dashboard --period 30d --channel meta-ads
/dashboard --period 30d --channel linkedin-ads
```

### Quarterly Strategy Session
```
/dashboard --period 90d --expand all
/suggestions --period 90d --category all
/history --type actions
```

## Background Skills

This plugin includes background knowledge that Claude automatically applies when relevant:

| Skill | Description |
|-------|-------------|
| **SaaS Metrics** | Accurate MRR, churn, LTV, CAC calculations and benchmarks |
| **Pricing Strategy** | Subscription pricing models, packaging, and optimization |
| **Customer Success** | Retention, onboarding, expansion, and churn prevention |
| **Ad Optimization** | Multi-channel bidding, keyword management, budget allocation, attribution |
| **Funnel Optimization** | Drop-off analysis, A/B testing, landing pages, onboarding flows |
| **Financial Analysis** | Scenario modeling (P10/P50/P90), revenue forecasting, sensitivity analysis, cash flow planning |

Skills activate automatically when discussing related topics — no commands needed.

## What Makes This Different

- **Single scorecard**: 10 key metrics at a glance instead of jumping between dashboards
- **AI-suggested actions**: Not just data — specific actions with estimated impact, ready to approve
- **Multi-channel view**: See all your growth channels (Google, Meta, Reddit, LinkedIn, organic) in one place
- **Deep dives available**: Start with the dashboard, drill into specifics with deep-dive commands
- **Works without full setup**: Commands degrade gracefully when connectors aren't configured
