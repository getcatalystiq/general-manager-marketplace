---
description: Analyze freight rates, carrier performance, and market trends
argument-hint: "[trade lane or carrier]"
---

# /analyze-rates

Analyze freight rates across trade lanes, compare carrier performance, identify trends, and optimize procurement strategy.

## Usage

```
/analyze-rates Shanghai to Los Angeles
/analyze-rates --carrier Maersk --period 6months
/analyze-rates --trade-lane CNSHA-USLAX --trend
/analyze-rates --compare-carriers --route Asia-USWC
```

## Workflow

### 1. Define Analysis Scope

**Parameters:**
- Trade lane (origin-destination pair)
- Time period (default: last 12 months)
- Equipment type (20', 40', 40HC, reefer)
- Service type (FCL, LCL, express)
- Carriers to include/exclude

If ~~rates-db is connected:
- Pull historical rate data
- Access contract vs spot comparisons
- Get surcharge history

If ~~tms is connected:
- Pull actual shipment costs
- Compare quoted vs actual
- Analyze carrier performance

If connectors not available:
> Provide rate data for analysis:
> - Recent quotes received
> - Historical shipment costs
> - Market rate indices (Freightos, Drewry)

### 2. Rate Analysis

**Rate Components Breakdown:**
| Component | % of Total | Trend |
|-----------|------------|-------|
| Base Ocean Freight | 60-70% | Variable |
| BAF/Fuel | 10-15% | Tied to oil |
| THC (Origin + Dest) | 10-15% | Stable |
| Surcharges | 5-10% | Seasonal |
| Documentation | 1-2% | Stable |

**Rate Metrics:**
```
Average Rate = Sum of all rates / Number of shipments
Rate Variance = (Max Rate - Min Rate) / Average Rate
Rate Trend = (Current Period Avg - Prior Period Avg) / Prior Period Avg
```

### 3. Carrier Comparison

**Performance Metrics:**
| Metric | Definition | Good | Excellent |
|--------|------------|------|-----------|
| Schedule Reliability | On-time arrival % | >70% | >85% |
| Transit Time Variance | Std dev from published | <2 days | <1 day |
| Equipment Availability | Booking acceptance % | >90% | >95% |
| Claims Ratio | Claims $ / Revenue $ | <0.5% | <0.2% |
| Rate Competitiveness | vs market average | ±10% | ±5% |

**Carrier Scorecard:**
```
Overall Score = (Reliability × 0.3) + (Transit × 0.2) + (Cost × 0.3) + (Service × 0.2)
```

### 4. Market Trends

**Trend Indicators:**
- Spot rate indices (Freightos FBX, Drewry WCI)
- Carrier capacity deployment
- Port congestion levels
- Fuel price trends
- Seasonal patterns

**Seasonality Patterns:**
| Period | Typical Impact |
|--------|----------------|
| Jan-Feb | Post-CNY dip |
| Mar-Apr | Recovery |
| May-Jun | Steady |
| Jul-Sep | Peak season |
| Oct-Nov | Pre-holiday surge |
| Dec | Decline |

### 5. Cost Optimization

**Strategies:**
1. **Contract vs Spot Mix** — Balance committed volume with flexibility
2. **Carrier Diversification** — Avoid over-reliance on single carrier
3. **Routing Optimization** — Consider alternative ports/routes
4. **Consolidation** — Combine shipments for volume discounts
5. **Timing** — Avoid peak season premiums when possible

### 6. Generate Report

## Output Format

```
RATE ANALYSIS REPORT
====================

Trade Lane: [Origin] → [Destination]
Period: [Start Date] to [End Date]
Equipment: [Container types]

RATE SUMMARY
------------
| Metric | Value | vs Prior Period |
|--------|-------|-----------------|
| Average Rate | $X,XXX | +X% |
| Lowest Rate | $X,XXX | [Carrier] |
| Highest Rate | $X,XXX | [Carrier] |
| Rate Variance | XX% | |
| Your Avg Cost | $X,XXX | vs market: +X% |

RATE TREND (12 MONTHS)
----------------------
$5,000 |                    ╭──╮
       |              ╭────╯  ╰──╮
$4,000 |         ╭────╯          ╰────
       |    ╭────╯
$3,000 |────╯
       └─────────────────────────────
        J F M A M J J A S O N D

CARRIER COMPARISON
------------------
| Carrier | Avg Rate | Reliability | Transit | Score |
|---------|----------|-------------|---------|-------|
| MSC | $3,850 | 82% | 18d | 78 |
| Maersk | $4,200 | 91% | 16d | 85 ★ |
| ONE | $3,650 | 76% | 19d | 72 |
| Evergreen | $3,900 | 84% | 17d | 80 |
| CMA CGM | $4,100 | 88% | 17d | 82 |

RATE COMPONENTS
---------------
[Stacked bar or table showing breakdown]

| Component | Amount | % of Total |
|-----------|--------|------------|
| Ocean Freight | $2,800 | 67% |
| BAF | $550 | 13% |
| THC Origin | $280 | 7% |
| THC Dest | $320 | 8% |
| Other | $210 | 5% |
| TOTAL | $4,160 | 100% |

MARKET OUTLOOK
--------------
Current Trend: [Rising / Stable / Declining]
Capacity: [Tight / Balanced / Loose]
Forecast (30 days): [+X% to +Y%]

Key Factors:
- [Factor 1 and impact]
- [Factor 2 and impact]
- [Factor 3 and impact]

RECOMMENDATIONS
---------------
1. **Contract Strategy**
   - Lock in rates with [Carrier] at $X,XXX for Q2
   - Maintain spot flexibility for 20% of volume

2. **Carrier Mix**
   - Primary: Maersk (reliability critical shipments)
   - Secondary: MSC (cost-sensitive shipments)
   - Spot: ONE/Evergreen (overflow)

3. **Cost Savings Opportunities**
   - Switch [X%] volume to [Carrier]: Save $XXX/month
   - Consolidate [Route]: Save $XXX/shipment
   - Adjust timing to avoid peak: Save $XXX/container

PROJECTED SAVINGS
-----------------
| Initiative | Monthly Savings | Annual Impact |
|------------|-----------------|---------------|
| Carrier optimization | $X,XXX | $XX,XXX |
| Route optimization | $X,XXX | $XX,XXX |
| Timing adjustment | $X,XXX | $XX,XXX |
| TOTAL | $X,XXX | $XX,XXX |
```

## Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `--trade-lane` | Specific route | `--trade-lane CNSHA-USLAX` |
| `--carrier` | Specific carrier | `--carrier Maersk` |
| `--period` | Time period | `--period 6months` |
| `--equipment` | Container type | `--equipment 40HC` |
| `--trend` | Show trend analysis | `--trend` |
| `--compare-carriers` | Carrier comparison mode | `--compare-carriers` |
| `--forecast` | Include rate forecast | `--forecast` |
| `--benchmark` | Compare to market index | `--benchmark` |

## Related Commands

- `/generate-quote` — Get current rates
- `/track-shipment` — Carrier performance tracking
- `/manage-customs` — Duty cost analysis
