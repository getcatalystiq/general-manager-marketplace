# General Manager — SaaS

Manage your SaaS business growth with AI-powered analysis of Google Ads, content performance, conversion funnels, and growth metrics. Stop juggling dashboards—get actionable insights in seconds.

## Commands

| Command | Description |
|---------|-------------|
| `/analyze-ads` | Analyze Google Ads performance, identify wasteful spend, get optimization recommendations |
| `/analyze-content` | Analyze content performance, identify what drives signups, plan content strategy |
| `/analyze-funnel` | Analyze conversion funnels, identify drop-off points, optimize signup flow |
| `/track-growth` | Track MRR, churn, LTV, CAC, cohort analysis with proper SaaS calculations |

## Quick Start

1. Install the plugin in Claude Cowork
2. Connect your data sources (see [CONNECTORS.md](CONNECTORS.md))
3. Run your first command:

```
/track-growth
```

## Connectors

This plugin integrates with your SaaS growth stack:

- **Google Ads** — Campaign performance, keyword data, CAC by campaign
- **Google Analytics 4** — Traffic sources, conversion funnels, content performance
- **Stripe** — Subscription data, MRR, churn, customer lifecycle
- **Database (Postgres/MySQL)** — Product analytics, user events, custom metrics

See [CONNECTORS.md](CONNECTORS.md) for setup instructions.

## Example Workflows

### Morning Growth Check (5 minutes)
```
/track-growth --metric mrr
/analyze-ads --from yesterday
```

### Weekly Content Review
```
/analyze-content --from 7-days-ago
/analyze-funnel --funnel signup
```

### Monthly Growth Report
```
/track-growth --compare previous
/analyze-ads --from 30-days-ago
/analyze-content --type blog
```

## What Makes This Different

- **SaaS-native metrics**: Proper MRR calculation with expansion/contraction, LTV using retention curves (not ARPU/churn), cohort analysis
- **Actionable recommendations**: Not just data dumps—specific actions with projected impact
- **Connected insights**: See how ads → content → funnel → revenue connect
- **Works without full setup**: Commands degrade gracefully when connectors aren't configured
