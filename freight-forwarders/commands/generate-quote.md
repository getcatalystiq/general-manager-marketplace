---
description: Generate freight quotes with rate comparisons across carriers and routes
argument-hint: "[origin] to [destination]"
---

# /generate-quote

Generate comprehensive freight quotes with rate comparisons across carriers, transit times, and service levels.

## Usage

```
/generate-quote Shanghai to Los Angeles
/generate-quote --origin CNSHA --dest USLAX --cargo "2x40HC electronics"
/generate-quote --customer "Acme Corp" --incoterm FOB --weight 18000kg
```

## Workflow

### 1. Gather Shipment Requirements

**Required Information:**
- Origin (port/city/address)
- Destination (port/city/address)
- Cargo details (type, weight, dimensions, value)
- Container requirements or LCL volume
- Ready date and required delivery date

**Optional Information:**
- Incoterms (FOB, CIF, DDP, etc.)
- Special requirements (hazmat, reefer, oversize)
- Customer preferences (carrier, transit time)
- Insurance requirements

If ~~tms is connected:
- Pull customer profile and preferences
- Check historical shipment patterns
- Apply negotiated rates and contracts

### 2. Calculate Cargo Requirements

**Container Planning:**
| Container Type | Internal Dimensions | Max Payload | Best For |
|---------------|---------------------|-------------|----------|
| 20' Standard | 5.9m x 2.35m x 2.39m | 28,200 kg | Heavy cargo |
| 40' Standard | 12.0m x 2.35m x 2.39m | 26,700 kg | General cargo |
| 40' High Cube | 12.0m x 2.35m x 2.69m | 26,460 kg | Voluminous cargo |
| 20' Reefer | 5.44m x 2.29m x 2.27m | 27,400 kg | Temperature controlled |
| 40' Reefer | 11.6m x 2.29m x 2.25m | 26,280 kg | Temperature controlled |

**LCL Calculation:**
```
Chargeable Weight = MAX(Actual Weight, Volumetric Weight)
Volumetric Weight (ocean) = L × W × H (cm) / 1,000,000 × 1,000 kg/CBM
```

### 3. Retrieve Rates

If ~~rates-db is connected:
- Pull contract rates by carrier and route
- Get current spot market rates
- Apply customer-specific discounts
- Include fuel surcharges (BAF/CAF)

If ~~carrier-api is connected:
- Get real-time carrier quotes
- Check space availability
- Retrieve current surcharges

If connectors not available:
> Provide rate information manually or I can estimate based on:
> - Trade lane averages
> - Recent market trends
> - Standard surcharge structures

### 4. Build Cost Breakdown

**Ocean Freight Components:**
| Component | Description |
|-----------|-------------|
| Base Ocean Freight | Carrier rate per container/CBM |
| BAF/Fuel Surcharge | Bunker adjustment factor |
| CAF/Currency Adjustment | Currency fluctuation factor |
| Peak Season Surcharge | High-demand period premium |
| Terminal Handling (Origin) | THC at loading port |
| Terminal Handling (Dest) | THC at discharge port |
| Documentation Fee | Bill of lading, manifests |
| AMS/ENS Filing | Security filings |

**Additional Services:**
| Service | Description |
|---------|-------------|
| Origin Pickup | Trucking to port |
| Export Customs | Customs brokerage at origin |
| Cargo Insurance | All-risk marine coverage |
| Import Customs | Customs brokerage at destination |
| Destination Delivery | Final mile trucking |
| Warehousing | Storage if required |

### 5. Compare Options

**Evaluation Criteria:**
1. Total cost (door-to-door)
2. Transit time
3. Carrier reliability score
4. Schedule frequency
5. Transshipment risk
6. Space availability

### 6. Generate Quote Document

## Output Format

```
FREIGHT QUOTATION
=================

Quote #: Q-2024-XXXX
Valid Until: [Date + 7 days]
Prepared For: [Customer Name]

SHIPMENT DETAILS
----------------
Origin: [Full address/port]
Destination: [Full address/port]
Cargo: [Description]
Weight: [Gross weight]
Volume: [CBM]
Equipment: [Container type and quantity]
Ready Date: [Date]
Incoterms: [Term]

OPTION 1: [Carrier] - RECOMMENDED
---------------------------------
Transit Time: [X] days
Route: [Origin] → [Transshipment if any] → [Destination]

Cost Breakdown:
| Item | Rate | Amount |
|------|------|--------|
| Ocean Freight | $X,XXX/40HC | $X,XXX |
| BAF | $XXX/40HC | $XXX |
| THC Origin | $XXX/40HC | $XXX |
| THC Destination | $XXX/40HC | $XXX |
| Documentation | Flat | $XX |
| AMS Filing | Flat | $XX |
|------|------|--------|
| SUBTOTAL OCEAN | | $X,XXX |

Additional Services:
| Service | Amount |
|---------|--------|
| Origin Trucking | $XXX |
| Export Customs | $XXX |
| Import Customs | $XXX |
| Destination Trucking | $XXX |
|---------|--------|
| SUBTOTAL ADDITIONAL | $X,XXX |

| TOTAL | $XX,XXX |

OPTION 2: [Carrier]
-------------------
[Similar breakdown]

OPTION 3: [Carrier]
-------------------
[Similar breakdown]

COMPARISON SUMMARY
------------------
| Option | Carrier | Transit | Total Cost | Reliability |
|--------|---------|---------|------------|-------------|
| 1 ★ | MSC | 18 days | $X,XXX | 94% |
| 2 | Maersk | 16 days | $X,XXX | 96% |
| 3 | ONE | 21 days | $X,XXX | 91% |

TERMS & CONDITIONS
------------------
- Rates valid for [7] days
- Subject to space and equipment availability
- Excludes duties, taxes, and inspection fees
- Insurance available at X.XX% of cargo value

NEXT STEPS
----------
1. Confirm booking by [Date]
2. Provide commercial invoice and packing list
3. Cargo ready date: [Date]
```

## Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `--origin` | Origin port/city (UN/LOCODE) | `--origin CNSHA` |
| `--dest` | Destination port/city | `--dest USLAX` |
| `--cargo` | Cargo description | `--cargo "electronics, 2x40HC"` |
| `--weight` | Total gross weight | `--weight 18000kg` |
| `--volume` | Total volume | `--volume 65cbm` |
| `--incoterm` | Incoterms | `--incoterm FOB` |
| `--ready` | Cargo ready date | `--ready 2024-02-15` |
| `--customer` | Customer name/ID | `--customer "Acme Corp"` |
| `--hazmat` | Hazardous cargo class | `--hazmat class-3` |
| `--reefer` | Temperature requirement | `--reefer -18C` |

## Related Commands

- `/track-shipment` — Track active shipments
- `/manage-customs` — Handle customs documentation
- `/analyze-rates` — Historical rate analysis
