---
description: Track shipments across carriers and provide status updates with ETAs
argument-hint: "[shipment-id or container number]"
---

# /track-shipment

Track shipments across multiple carriers, consolidate tracking data, and provide comprehensive status updates with accurate ETAs.

## Usage

```
/track-shipment [shipment-id]
/track-shipment --container MSCU1234567
/track-shipment --bl MAEU123456789
/track-shipment --customer "Acme Corp" --status in-transit
```

## Workflow

### 1. Identify Shipment

If ~~tms is connected:
- Look up shipment by ID, container number, or bill of lading
- Retrieve associated booking and customer details
- Get all related tracking references

If ~~tms is not connected:
> Connect ~~tms to automatically look up shipments.
> You can also provide shipment details manually:
> - Container number(s)
> - Bill of lading number
> - Carrier and vessel name
> - Origin and destination ports

### 2. Gather Tracking Data

If ~~tracking is connected:
- Pull real-time container tracking from carriers
- Get vessel AIS data for ocean shipments
- Retrieve milestone events and timestamps

If ~~carrier-api is connected:
- Get carrier-specific tracking updates
- Pull booking confirmations and amendments
- Retrieve carrier ETAs and schedule changes

If connectors not available:
> Paste tracking data from carrier websites or provide:
> - Current location/status
> - Last milestone event
> - Scheduled arrival date

### 3. Analyze Transit Status

**Milestone Tracking:**
| Milestone | Description |
|-----------|-------------|
| Booking Confirmed | Carrier accepted booking |
| Empty Container Released | Container picked up for stuffing |
| Gate In | Container entered origin terminal |
| Loaded on Vessel | Container loaded, vessel departed |
| Transshipment | Container moved between vessels |
| Arrived at POD | Vessel arrived at destination port |
| Customs Cleared | Import customs released |
| Gate Out | Container left destination terminal |
| Delivered | Final delivery completed |

**Exception Detection:**
- Vessel delays vs schedule
- Missed connections at transshipment ports
- Customs holds or inspections
- Demurrage/detention risk
- Weather or port congestion impacts

### 4. Calculate ETA

**ETA Components:**
1. Current vessel schedule (carrier data)
2. Port congestion factors
3. Customs clearance time estimates
4. Inland transit time
5. Buffer for delays

**Confidence Levels:**
| Level | Meaning |
|-------|---------|
| High | On schedule, no known issues |
| Medium | Minor delays possible |
| Low | Significant delays or unknowns |

### 5. Generate Status Report

## Output Format

```
SHIPMENT STATUS REPORT
======================

Shipment: [ID]
Customer: [Name]
Reference: [Customer PO/Reference]

CURRENT STATUS
--------------
Location: [Port/Vessel/Terminal]
Status: [In Transit / At Port / Customs / Delivered]
Last Event: [Milestone] at [Location] on [Date/Time]

ROUTE
-----
Origin: [Port, Country]
Destination: [Port, Country]
Via: [Transshipment ports if any]

CONTAINERS
----------
| Container | Type | Status | Location |
|-----------|------|--------|----------|
| MSCU1234567 | 40HC | On vessel | Pacific Ocean |

ETA ANALYSIS
------------
Original ETA: [Date]
Current ETA: [Date]
Confidence: [High/Medium/Low]
Variance: [+/- days]

MILESTONES
----------
✓ [Completed milestone] - [Date]
✓ [Completed milestone] - [Date]
→ [Current/Next milestone] - [Expected date]
○ [Pending milestone] - [Expected date]

ALERTS
------
⚠ [Any exceptions or risks]

NEXT ACTIONS
------------
1. [Recommended action]
2. [Recommended action]
```

## Example Output

```
SHIPMENT STATUS REPORT
======================

Shipment: FWD-2024-0892
Customer: Pacific Electronics Inc
Reference: PO-44821

CURRENT STATUS
--------------
Location: MV Ever Given, South China Sea
Status: In Transit (Ocean)
Last Event: Loaded on Vessel at Shanghai (CNSHA) on Jan 28, 2024

ROUTE
-----
Origin: Shanghai, China (CNSHA)
Destination: Los Angeles, USA (USLAX)
Via: Direct service

CONTAINERS
----------
| Container | Type | Status | Location |
|-----------|------|--------|----------|
| MSCU1234567 | 40HC | On vessel | 28°N 135°E |
| MSCU7654321 | 40HC | On vessel | 28°N 135°E |

ETA ANALYSIS
------------
Original ETA: Feb 12, 2024
Current ETA: Feb 14, 2024
Confidence: Medium
Variance: +2 days (weather delays)

MILESTONES
----------
✓ Booking Confirmed - Jan 20
✓ Container Gate In - Jan 26
✓ Loaded on Vessel - Jan 28
→ Arrive Los Angeles - Feb 14 (expected)
○ Customs Cleared - Feb 15 (expected)
○ Available for Pickup - Feb 16 (expected)

ALERTS
------
⚠ Vessel 2 days behind schedule due to rough weather
⚠ LA port congestion may add 1-2 days to berthing

NEXT ACTIONS
------------
1. Notify customer of revised ETA
2. Pre-file ISF if not already submitted
3. Schedule drayage for Feb 16
```

## Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `--container` | Track by container number | `--container MSCU1234567` |
| `--bl` | Track by bill of lading | `--bl MAEU123456789` |
| `--booking` | Track by booking number | `--booking 123456789` |
| `--customer` | Filter by customer | `--customer "Acme Corp"` |
| `--status` | Filter by status | `--status in-transit` |
| `--alerts-only` | Show only shipments with alerts | `--alerts-only` |

## Related Commands

- `/generate-quote` — Get rates for new shipments
- `/manage-customs` — Handle customs documentation
- `/analyze-rates` — Compare carrier rates and performance
