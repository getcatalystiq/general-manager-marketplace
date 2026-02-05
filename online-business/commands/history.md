---
description: View a log of past actions, metric changes, and business events
argument-hint: "[--from DATE] [--to DATE] [--type actions|metrics|events|all]"
---

# History

> If you see unfamiliar placeholders or need to check which tools are connected, see [CONNECTORS.md](../CONNECTORS.md).

View a chronological log of approved/rejected actions from `/tasks`, significant metric changes, and notable business events. Use this to track what you've done, what changed, and whether actions had the expected impact.

## Usage

```
/history [options]
```

### Arguments

- `--from` — Start date for history view (default: 30 days ago). Format: `YYYY-MM-DD`
- `--to` — End date for history view (default: today). Format: `YYYY-MM-DD`
- `--type` — Filter entries: `actions` (approved/rejected tasks), `metrics` (significant metric changes), `events` (notable business events), `all` (default)

### Examples

```
/history
/history --type actions
/history --from 2026-01-01 --to 2026-01-31 --type metrics
/history --type events
```

## Workflow

### 1. Gather History Data

**Action History:**
- Pull the log of all approved and rejected tasks from `/tasks`
- Include: action description, category, date, estimated impact, actual outcome (if measurable)

**Metric History:**
- Compare current metrics to previous snapshots
- Flag significant changes (>10% movement in any key metric)
- Note when metrics crossed important thresholds (e.g., churn dropped below 3%, LTV:CAC exceeded 5x)

**Event History:**
If ~~stripe is connected:
- New plan launches or pricing changes
- Large customer additions or churns
- Payment failures or billing issues

If ~~database is connected:
- Product launches or feature releases
- Customer milestones

If ad connectors are connected:
- Campaign launches, pauses, or budget changes
- Significant spend or performance changes

### 2. Build the Timeline

Compile all entries into a chronological timeline, most recent first.

Each entry includes:

| Field | Description |
|-------|-------------|
| **Date** | When it happened |
| **Type** | Action / Metric / Event |
| **Description** | What happened |
| **Impact** | Measured outcome (if available) or estimated impact |
| **Status** | For actions: approved/rejected. For metrics: improved/declined. For events: informational |

### 3. Present the History Log

```
## History — [START] to [END]

### Week of Jan 27, 2026

**Jan 31** — Action (Approved)
Paused 5 zero-conversion Google Ads keywords
- Estimated savings: $2,340/month
- Actual savings so far: $780 (10 days since approval)
- Status: On track

**Jan 30** — Metric Change
Revenue crossed $50,000 MRR milestone
- Previous: $49,700 → Current: $50,200
- First time above $50K

**Jan 28** — Action (Approved)
Reallocated $500/day from Meta Ads to Google Ads
- Estimated impact: +12 conversions/month
- Actual: +8 conversions in first 10 days (on track)

**Jan 27** — Action (Rejected)
Suggested: Reduce Starter plan price to $19/mo
- Reason: "Want to test adding features instead of cutting price"

---

### Week of Jan 20, 2026

**Jan 22** — Event
Large customer churn: Acme Corp ($499/mo Pro plan)
- Reason: Company downsizing
- Impact: -$499 MRR

**Jan 20** — Metric Change
NPS improved from 38 to 42
- Likely cause: Support response time improvements shipped Jan 15
```

### 4. Impact Tracking

For approved actions, track whether the estimated impact materialized:

```
## Action Impact Tracker

| Action | Date | Est. Impact | Actual Impact | Status |
|--------|------|-------------|---------------|--------|
| Paused 5 Gads keywords | Jan 31 | -$2,340/mo spend | -$780 (10d) | On track |
| Budget reallocation | Jan 28 | +12 conv/mo | +8 (10d) | On track |
| Onboarding email sequence | Jan 15 | -2pp churn | -0.8pp (15d) | Too early |
| Content refresh (3 posts) | Jan 10 | +200 sessions/mo | +340 sessions | Exceeded |
```

### 5. Summary

```
## History Summary — [PERIOD]

Total actions: X approved, X rejected
- Actions on track: X
- Actions exceeded expectations: X
- Actions underperforming: X

Notable metric changes:
- Revenue: $XX,XXX → $XX,XXX (+X%)
- Best improvement: [METRIC] (+X%)
- Needs attention: [METRIC] (-X%)

Key events: X logged
```

## Output

The command returns:
1. **Chronological timeline** of actions, metric changes, and events
2. **Impact tracking** showing estimated vs actual outcomes for approved actions
3. **Summary** of activity and metric movements over the period
