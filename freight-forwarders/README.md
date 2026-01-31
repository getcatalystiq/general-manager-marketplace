# General Manager — Freight Forwarders

Manage freight forwarding operations with AI-powered shipment tracking, rate analysis, customs documentation, and carrier management. Streamline logistics workflows and optimize your supply chain.

## Commands

| Command | Description |
|---------|-------------|
| `/track-shipment` | Track shipments across carriers with status updates and ETA analysis |
| `/generate-quote` | Generate freight quotes with rate comparisons across carriers and routes |
| `/manage-customs` | Manage customs documentation, compliance, and clearance workflows |
| `/analyze-rates` | Analyze freight rates, carrier performance, and market trends |

## Quick Start

1. Install the plugin in Claude Cowork
2. Connect your data sources (see [CONNECTORS.md](CONNECTORS.md))
3. Run your first command:

```
/track-shipment MSCU1234567
```

## Connectors

This plugin integrates with your freight forwarding stack:

- **TMS** — Transportation Management System for shipment and booking data
- **Carrier API** — Direct carrier integrations for bookings and tracking
- **Customs** — Customs broker portal for clearance and compliance
- **Rates DB** — Contract and spot rate database
- **Tracking** — Multi-carrier tracking aggregation

See [CONNECTORS.md](CONNECTORS.md) for setup instructions.

## Example Workflows

### Daily Operations Check
```
/track-shipment --status in-transit --alerts-only
/manage-customs --status pending
```

### New Shipment Quote
```
/generate-quote Shanghai to Los Angeles --cargo "2x40HC electronics" --ready 2024-02-15
```

### Customs Clearance
```
/manage-customs FWD-2024-0892 --prepare-docs
/manage-customs --check-hs "wireless headphones"
/manage-customs --duty-estimate --origin CN --dest US --value 50000
```

### Rate Analysis
```
/analyze-rates --trade-lane CNSHA-USLAX --period 6months
/analyze-rates --compare-carriers --route Asia-USWC
```

## Background Skills

This plugin includes background knowledge that Claude automatically applies when relevant:

| Skill | Description |
|-------|-------------|
| **Freight Operations** | Shipping modes, container types, documentation, port operations |
| **Customs Compliance** | HS classification, duty calculation, trade agreements, regulations |
| **Carrier Management** | Rate negotiations, performance tracking, contract management |

Skills activate automatically when discussing related topics—no commands needed.

## What Makes This Different

- **Multi-carrier visibility**: Track shipments across all carriers in one view
- **Intelligent customs**: HS classification assistance and duty estimation
- **Rate optimization**: Compare carriers and identify cost savings
- **Operational intelligence**: Proactive alerts for delays and exceptions
- **Works without full setup**: Commands degrade gracefully when connectors aren't configured
- **HTTP-based MCPs**: All connectors use HTTP endpoints for easy integration

## Industry Coverage

This plugin is designed for:
- Freight forwarders (NVOCC, 3PL)
- Customs brokers
- Import/export companies
- Logistics providers
- Supply chain managers

## Trade Lane Support

Commands support all major trade lanes including:
- Transpacific (Asia ↔ Americas)
- Transatlantic (Europe ↔ Americas)
- Asia-Europe
- Intra-Asia
- Intra-Europe
- Latin America routes
