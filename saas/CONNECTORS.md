# Connectors

This plugin integrates with your SaaS growth stack through MCP (Model Context Protocol) connectors. Commands will automatically use connected services when available, or prompt you to provide data manually.

## Available Connectors

### ~~google-ads
**Google Ads API** — Campaign performance, keyword data, conversion tracking

Connect to analyze:
- Campaign and ad group performance
- Keyword costs and conversion rates
- Quality scores and optimization opportunities
- Customer acquisition cost (CAC) by campaign

Setup: Requires Google Ads API access with read permissions. See [Google Ads API documentation](https://developers.google.com/google-ads/api/docs/start).

### ~~analytics
**Google Analytics 4** — Traffic sources, conversion funnels, page performance

Connect to analyze:
- Traffic sources and user acquisition channels
- Conversion funnels and drop-off points
- Landing page performance
- Content engagement metrics

Setup: Requires GA4 property access. See [GA4 API documentation](https://developers.google.com/analytics/devguides/reporting/data/v1).

### ~~stripe
**Stripe API** — Subscription data, MRR, churn, customer lifecycle

Connect to analyze:
- Monthly Recurring Revenue (MRR) and trends
- Churn rate and retention curves
- Customer Lifetime Value (LTV)
- Subscription plan performance

Setup: Requires Stripe API key with read permissions. See [Stripe API documentation](https://stripe.com/docs/api).

### ~~database
**Database (Postgres/MySQL)** — Product analytics, user events, custom metrics

Connect to analyze:
- User activation and engagement events
- Custom product metrics
- Cohort analysis data
- Feature usage analytics

Setup: Requires database connection string with read permissions.

## Connector Status

Commands will indicate connector status:
- **Connected**: Data pulled automatically from the service
- **Not connected**: You'll be prompted to provide data manually (paste, upload, or describe)

## Manual Data Input

If a connector is not available, you can still use commands by:
1. Pasting data directly (CSV, JSON, or plain text)
2. Uploading a spreadsheet or export file
3. Describing the data and letting Claude help structure it

Example:
```
/track-growth

> ~~stripe is not connected. Paste your MRR data or provide subscription metrics:

Current MRR: $45,000
Last month MRR: $42,000
New MRR: $5,000
Churned MRR: $2,000
...
```
