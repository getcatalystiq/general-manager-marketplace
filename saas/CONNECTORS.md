# Connectors

This plugin integrates with your SaaS growth stack through HTTP-based MCP (Model Context Protocol) connectors. Commands will automatically use connected services when available, or prompt you to provide data manually.

## Configuration

All connectors use HTTP endpoints. Configure each connector by setting the required environment variables:

```bash
# Google Ads
export GOOGLE_ADS_MCP_URL="https://your-mcp-endpoint.com/google-ads/v1"
export GOOGLE_ADS_ACCESS_TOKEN="your-oauth-token"
export GOOGLE_ADS_DEVELOPER_TOKEN="your-developer-token"
export GOOGLE_ADS_CUSTOMER_ID="123-456-7890"

# Google Analytics
export GA4_MCP_URL="https://your-mcp-endpoint.com/analytics/v1"
export GOOGLE_ACCESS_TOKEN="your-oauth-token"
export GA4_PROPERTY_ID="properties/123456789"

# Stripe
export STRIPE_MCP_URL="https://your-mcp-endpoint.com/stripe/v1"
export STRIPE_API_KEY="sk_live_..."

# Database
export DATABASE_MCP_URL="https://your-mcp-endpoint.com/database/v1"
export DATABASE_ACCESS_TOKEN="your-access-token"
export DATABASE_URL="postgresql://user:pass@host:5432/db"
```

## Available Connectors

### ~~google-ads
**Google Ads API** — Campaign performance, keyword data, conversion tracking

Connect to analyze:
- Campaign and ad group performance
- Keyword costs and conversion rates
- Quality scores and optimization opportunities
- Customer acquisition cost (CAC) by campaign

**HTTP Endpoint:** `${GOOGLE_ADS_MCP_URL}`

Setup: Requires Google Ads API access with read permissions. See [Google Ads API documentation](https://developers.google.com/google-ads/api/docs/start).

### ~~analytics
**Google Analytics 4** — Traffic sources, conversion funnels, page performance

Connect to analyze:
- Traffic sources and user acquisition channels
- Conversion funnels and drop-off points
- Landing page performance
- Content engagement metrics

**HTTP Endpoint:** `${GA4_MCP_URL}`

Setup: Requires GA4 property access. See [GA4 API documentation](https://developers.google.com/analytics/devguides/reporting/data/v1).

### ~~stripe
**Stripe API** — Subscription data, MRR, churn, customer lifecycle

Connect to analyze:
- Monthly Recurring Revenue (MRR) and trends
- Churn rate and retention curves
- Customer Lifetime Value (LTV)
- Subscription plan performance

**HTTP Endpoint:** `${STRIPE_MCP_URL}`

Setup: Requires Stripe API key with read permissions. See [Stripe API documentation](https://stripe.com/docs/api).

### ~~database
**Database (Postgres/MySQL)** — Product analytics, user events, custom metrics

Connect to analyze:
- User activation and engagement events
- Custom product metrics
- Cohort analysis data
- Feature usage analytics

**HTTP Endpoint:** `${DATABASE_MCP_URL}`

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
