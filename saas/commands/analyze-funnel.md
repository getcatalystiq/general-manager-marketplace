---
description: Analyze conversion funnels, identify drop-off points, and get optimization recommendations
argument-hint: "[--funnel NAME] [--from DATE] [--to DATE]"
---

# Analyze Funnel

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../CONNECTORS.md).

Analyze your conversion funnels to identify where users drop off, which landing pages convert best, and how to optimize your signup-to-paid flow.

## Usage

```
/analyze-funnel [options]
```

### Arguments

- `--funnel` — Specific funnel to analyze: `signup`, `trial`, `upgrade`, or custom name (default: all)
- `--from` — Start date for analysis (default: 30 days ago). Format: `YYYY-MM-DD`
- `--to` — End date for analysis (default: today). Format: `YYYY-MM-DD`
- `--segment` — Segment by: `source`, `campaign`, `plan`, `cohort`
- `--format` — Output format: `text` (default), `json`, `csv`

### Examples

```
/analyze-funnel
/analyze-funnel --funnel signup --segment source
/analyze-funnel --funnel trial --from 2026-01-01
```

## Workflow

### 1. Gather Funnel Data

If ~~analytics is connected:
- Pull event data for funnel steps (page views, clicks, form submissions)
- Pull goal completions and conversion events
- Pull user journey paths

If ~~database is connected:
- Pull user signup and activation events
- Pull trial-to-paid conversion data
- Pull feature usage and engagement data

If ~~stripe is connected:
- Pull trial start and conversion events
- Pull subscription upgrade/downgrade data
- Pull payment success/failure rates

If no data source is connected:
> Connect ~~analytics, ~~database, or ~~stripe to pull funnel data automatically. You can also describe your funnel steps and provide conversion numbers.

### 2. Define Funnel Stages

**Typical SaaS Signup Funnel:**
```
Landing Page → Signup Page → Email Verification → Onboarding → Activation
     ↓              ↓              ↓                 ↓            ↓
   100%           40%            35%              25%          15%
```

**Typical Trial-to-Paid Funnel:**
```
Trial Start → Key Feature Used → Aha Moment → Upgrade Prompt → Paid
     ↓              ↓                ↓              ↓           ↓
   100%           60%              40%            20%         12%
```

### 3. Calculate Funnel Metrics

For each funnel stage:

| Metric | Formula |
|--------|---------|
| **Stage Conversion** | Users at Stage N+1 / Users at Stage N |
| **Overall Conversion** | Final Stage Users / First Stage Users |
| **Drop-off Rate** | 1 - Stage Conversion |
| **Time to Convert** | Avg time between stages |
| **Friction Score** | Weighted drop-off × stage importance |

### 4. Identify Drop-off Points

**Critical Drop-offs:**
- Stages with >50% drop-off rate
- Stages with sudden drop-off increase (vs. previous period)
- Stages with high-value user drop-off

**Segment Analysis:**
- Drop-off by traffic source (paid vs. organic)
- Drop-off by device (mobile vs. desktop)
- Drop-off by plan tier
- Drop-off by cohort (new vs. returning)

### 5. A/B Test Analysis

If experiment data is available:
```
## Active Experiments

### Signup Page Headline Test
| Variant | Users | Conversions | Rate | Confidence |
|---------|-------|-------------|------|------------|
| Control | 5,000 | 200 | 4.0% | — |
| Variant A | 4,800 | 240 | 5.0% | 95% |
| Variant B | 4,900 | 196 | 4.0% | N/A |

**Recommendation:** Variant A is the winner. Implement headline change.
Projected impact: +25% more signups at same traffic.
```

### 6. Generate Recommendations

```
## Funnel Optimization Recommendations

### 1. Fix Signup → Verification Drop-off (35% → Target: 50%)
**Current issue:** 15% of users never verify email
**Recommendations:**
- Add email verification reminder after 1 hour
- Simplify verification (magic link instead of code)
- Show "check spam folder" message prominently

### 2. Fix Onboarding → Activation Drop-off (60% → Target: 75%)
**Current issue:** Users complete onboarding but don't reach "aha moment"
**Recommendations:**
- Shorten onboarding to 3 steps (currently 7)
- Add interactive product tour
- Send activation email with specific next action

### 3. Improve Trial → Paid Conversion (12% → Target: 18%)
**Current issue:** Users not experiencing core value during trial
**Recommendations:**
- Identify "aha moment" and guide users there faster
- Add usage-based upgrade prompts (when user hits limits)
- Offer annual discount at trial end
```

### 7. Summary Dashboard

```
## Funnel Performance Summary
Period: [DATE] to [DATE]

### Signup Funnel
| Stage | Users | Conversion | Drop-off | Trend |
|-------|-------|------------|----------|-------|
| Landing Page | 10,000 | — | — | +5% |
| Signup Page | 4,000 | 40% | 60% | +2% |
| Email Verified | 3,500 | 87.5% | 12.5% | -3% |
| Onboarding Done | 2,500 | 71.4% | 28.6% | +1% |
| Activated | 1,500 | 60% | 40% | +8% |

**Overall: 15% landing-to-activated** (+1.2% vs previous period)

### Biggest Opportunities
1. **Landing → Signup**: 60% drop-off (industry avg: 50%)
   - Potential: +400 signups/month with 10% improvement
2. **Onboarding → Activated**: 40% drop-off
   - Potential: +250 activations/month with 15% improvement

### Revenue Impact
Improving activation by 10% = +$X,XXX MRR (at current trial→paid rate)
```

## Output

The command returns:
1. **Funnel visualization** with conversion rates at each stage
2. **Drop-off analysis** identifying critical friction points
3. **Segment comparison** showing which sources/segments convert best
4. **Prioritized recommendations** with projected impact
5. **A/B test results** if experiments are running
