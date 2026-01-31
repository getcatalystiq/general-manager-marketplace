---
description: Manage customs documentation, compliance, and clearance workflows
argument-hint: "[shipment-id or action]"
---

# /manage-customs

Manage customs documentation, ensure compliance, track clearance status, and handle duties and tariffs.

## Usage

```
/manage-customs FWD-2024-0892
/manage-customs --prepare-docs --shipment FWD-2024-0892
/manage-customs --check-hs "wireless headphones"
/manage-customs --duty-estimate --origin CN --dest US --value 50000
```

## Workflow

### 1. Gather Shipment Information

If ~~tms is connected:
- Pull shipment and booking details
- Retrieve commercial documents on file
- Get customer importer/exporter information
- Check historical classification data

If ~~customs is connected:
- Access customs broker portal
- Pull filing status and history
- Get duty payment records

If connectors not available:
> Provide shipment details:
> - Commercial invoice
> - Packing list
> - Bill of lading
> - Product descriptions
> - Country of origin
> - Declared values

### 2. Document Checklist

**Export Documentation:**
| Document | Required | Status |
|----------|----------|--------|
| Commercial Invoice | ✓ | |
| Packing List | ✓ | |
| Bill of Lading / Airway Bill | ✓ | |
| Export License (if applicable) | Conditional | |
| Certificate of Origin | Conditional | |
| Shipper's Letter of Instruction | ✓ | |
| Electronic Export Information (EEI) | >$2,500 | |

**Import Documentation:**
| Document | Required | Status |
|----------|----------|--------|
| Commercial Invoice | ✓ | |
| Packing List | ✓ | |
| Bill of Lading / Arrival Notice | ✓ | |
| ISF (10+2) - US Imports | ✓ | |
| Entry Summary (CBP 7501) | ✓ | |
| Import License (if applicable) | Conditional | |
| FDA Prior Notice (food) | Conditional | |
| FCC Declaration (electronics) | Conditional | |
| TSCA Certification (chemicals) | Conditional | |

### 3. HS Classification

**Classification Process:**
1. Analyze product description and composition
2. Determine primary function/use
3. Apply General Rules of Interpretation (GRI)
4. Check binding rulings database
5. Validate with tariff schedule

**HS Code Structure:**
```
XXXX.XX.XXXX
│││  │  └── Country-specific (statistical suffix)
│││  └───── Subheading (6-digit international)
││└──────── Heading (4-digit)
└└───────── Chapter (2-digit)
```

**Common Categories:**
| Chapter | Description |
|---------|-------------|
| 84 | Machinery, mechanical appliances |
| 85 | Electrical machinery, equipment |
| 61-62 | Apparel and clothing |
| 39 | Plastics and articles |
| 94 | Furniture, bedding, lighting |
| 87 | Vehicles and parts |

### 4. Duty & Tax Calculation

**US Import Duty Calculation:**
```
Customs Value = Transaction Value + Assists + Royalties
Duty Amount = Customs Value × Duty Rate
MPF = Customs Value × 0.3464% (min $29.66, max $575.35)
HMF = Customs Value × 0.125% (ocean only)
Total = Duty + MPF + HMF + (State taxes if applicable)
```

**Trade Program Eligibility:**
| Program | Benefit | Requirements |
|---------|---------|--------------|
| USMCA | Duty-free | North American origin |
| GSP | Reduced/free | Developing country origin |
| FTZ | Deferred duty | Foreign Trade Zone entry |
| Drawback | Duty refund | Re-export of imported goods |

### 5. Compliance Check

**Red Flags:**
- Value significantly below market
- Inconsistent country of origin
- Missing or vague descriptions
- Known transshipment routes
- Restricted party screening hits

**Restricted Party Screening:**
- Denied Persons List (BIS)
- Entity List (BIS)
- SDN List (OFAC)
- Unverified List (BIS)
- Debarred Parties (DDTC)

### 6. Filing & Clearance

**US Import Timeline:**
| Filing | Deadline |
|--------|----------|
| ISF (10+2) | 24 hours before vessel departure |
| Entry/Entry Summary | 15 days after arrival |
| Duty Payment | 10 days after entry |

**Clearance Status:**
| Status | Meaning |
|--------|---------|
| Filed | Documents submitted |
| Under Review | Customs examining |
| Hold | Additional info required |
| Intensive Exam | Physical inspection |
| Released | Cleared for delivery |

## Output Format

```
CUSTOMS MANAGEMENT REPORT
=========================

Shipment: [ID]
Entry Type: [Consumption / Warehouse / FTZ]
Port of Entry: [Port code and name]

DOCUMENT STATUS
---------------
| Document | Status | Notes |
|----------|--------|-------|
| Commercial Invoice | ✓ Complete | |
| Packing List | ✓ Complete | |
| Bill of Lading | ✓ Complete | |
| ISF | ✓ Filed | Confirmation #123456 |
| Certificate of Origin | ⚠ Missing | Required for USMCA |

CLASSIFICATION
--------------
| Product | HS Code | Duty Rate | Origin |
|---------|---------|-----------|--------|
| Wireless headphones | 8518.30.2000 | 0% | China |
| Phone cases | 3926.90.9996 | 5.3% | China |
| USB cables | 8544.42.9090 | 0% | China |

DUTY ESTIMATE
-------------
| Line | Value | Duty Rate | Duty Amount |
|------|-------|-----------|-------------|
| 1 | $30,000 | 0% | $0 |
| 2 | $15,000 | 5.3% | $795 |
| 3 | $5,000 | 0% | $0 |
|------|-------|-----------|-------------|
| Subtotal Duty | | | $795 |
| MPF (0.3464%) | | | $173.20 |
| HMF (0.125%) | | | $62.50 |
|------|-------|-----------|-------------|
| TOTAL ESTIMATED | | | $1,030.70 |

COMPLIANCE ALERTS
-----------------
⚠ Missing Certificate of Origin - cannot claim USMCA benefits
✓ Restricted party screening - CLEAR
✓ Value verification - PASS

CLEARANCE STATUS
----------------
Current Status: Under Review
Filed: [Date/Time]
Estimated Release: [Date]

NEXT ACTIONS
------------
1. Obtain Certificate of Origin for USMCA claim
2. Prepare for possible exam (2% probability)
3. Arrange duty payment by [Date]
```

## Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `--prepare-docs` | Generate document checklist | `--prepare-docs` |
| `--check-hs` | Classify product | `--check-hs "leather handbag"` |
| `--duty-estimate` | Calculate duties | `--duty-estimate --value 50000` |
| `--origin` | Country of origin | `--origin CN` |
| `--dest` | Destination country | `--dest US` |
| `--screen` | Run restricted party check | `--screen "Company Name"` |
| `--status` | Check clearance status | `--status` |

## Related Commands

- `/track-shipment` — Track shipment status
- `/generate-quote` — Include customs costs in quotes
- `/analyze-rates` — Historical duty analysis
