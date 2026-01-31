# Connectors

This plugin integrates with your freight forwarding systems through HTTP-based MCP (Model Context Protocol) connectors. Commands will automatically use connected services when available, or prompt you to provide data manually.

## Configuration

All connectors use HTTP endpoints. Configure each connector by setting the required environment variables:

```bash
# Transportation Management System (TMS)
export TMS_MCP_URL="https://your-mcp-endpoint.com/tms/v1"
export TMS_ACCESS_TOKEN="your-access-token"
export TMS_TENANT_ID="your-tenant-id"

# Carrier Integrations
export CARRIER_MCP_URL="https://your-mcp-endpoint.com/carrier/v1"
export CARRIER_ACCESS_TOKEN="your-access-token"

# Customs Broker Portal
export CUSTOMS_MCP_URL="https://your-mcp-endpoint.com/customs/v1"
export CUSTOMS_ACCESS_TOKEN="your-access-token"
export CUSTOMS_BROKER_ID="your-broker-id"

# Rates Database
export RATES_MCP_URL="https://your-mcp-endpoint.com/rates/v1"
export RATES_ACCESS_TOKEN="your-access-token"

# Shipment Tracking
export TRACKING_MCP_URL="https://your-mcp-endpoint.com/tracking/v1"
export TRACKING_ACCESS_TOKEN="your-access-token"
```

## Available Connectors

### ~~tms
**Transportation Management System** — Shipment data, bookings, customer information

Connect to access:
- Shipment and booking records
- Customer profiles and preferences
- Historical shipment data
- Document management
- Invoicing and billing data

**HTTP Endpoint:** `${TMS_MCP_URL}`

Compatible with: CargoWise, Descartes, MercuryGate, BluJay, Magaya, and other TMS platforms with API access.

### ~~carrier-api
**Carrier Integrations** — Direct connections to shipping lines

Connect to access:
- Real-time booking confirmations
- Schedule and vessel data
- Rate sheets and surcharges
- Container availability
- Carrier-specific tracking

**HTTP Endpoint:** `${CARRIER_MCP_URL}`

Supports integrations with: Maersk, MSC, CMA CGM, Hapag-Lloyd, ONE, Evergreen, COSCO, and other major carriers.

### ~~customs
**Customs Broker Portal** — Clearance and compliance data

Connect to access:
- Entry filing status
- Duty calculations
- HS classification database
- Restricted party screening
- Document repository

**HTTP Endpoint:** `${CUSTOMS_MCP_URL}`

Compatible with: Descartes CustomsInfo, Integration Point, OCR Services, and customs broker systems.

### ~~rates-db
**Rates Database** — Contract and spot rate management

Connect to access:
- Contract rates by trade lane
- Spot market rates
- Surcharge schedules
- Rate validity periods
- Historical rate trends

**HTTP Endpoint:** `${RATES_MCP_URL}`

Compatible with: Internal rate databases, Xeneta, Freightos, and rate management platforms.

### ~~tracking
**Shipment Tracking** — Multi-carrier tracking aggregation

Connect to access:
- Container tracking across carriers
- Vessel AIS data
- Milestone events
- ETA predictions
- Exception alerts

**HTTP Endpoint:** `${TRACKING_MCP_URL}`

Compatible with: project44, FourKites, Portcast, MarineTraffic, and tracking platforms.

## Connector Status

Commands will indicate connector status:
- **Connected**: Data pulled automatically from the service
- **Not connected**: You'll be prompted to provide data manually (paste, upload, or describe)

## Manual Data Input

If a connector is not available, you can still use commands by:
1. Pasting data directly (CSV, JSON, or plain text)
2. Uploading spreadsheets or carrier PDFs
3. Describing the shipment details manually

Example:
```
/track-shipment

> ~~tracking is not connected. Provide shipment details:

Container: MSCU1234567
Carrier: MSC
Vessel: MSC Diana
Origin: Shanghai (CNSHA)
Destination: Los Angeles (USLAX)
ETD: 2024-01-28
ETA: 2024-02-14
```

## Integration Notes

### TMS Integration
Most TMS platforms provide API access for:
- Shipment CRUD operations
- Customer and vendor management
- Document retrieval
- Financial data

Ensure your TMS API credentials have read access to shipments, customers, and documents.

### Carrier API Integration
Carrier APIs typically require:
- Partner/customer account
- API credentials (OAuth or API key)
- Agreement to terms of use

Contact your carrier representatives for API access.

### Customs Integration
Customs broker integrations usually provide:
- Entry status tracking
- Document submission
- Duty payment information
- Compliance screening

Work with your customs broker to enable API access to their portal.
