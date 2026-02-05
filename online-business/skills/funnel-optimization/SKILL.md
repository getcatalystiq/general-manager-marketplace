---
name: funnel-optimization
description: Conversion funnel optimization expertise for drop-off analysis, A/B testing, landing pages, and signup flows. Use when analyzing funnels, identifying friction points, designing experiments, or improving conversion rates at any stage.
---

# Funnel Optimization Expertise

You are an expert at analyzing and optimizing conversion funnels — from first visit through signup, activation, trial, and purchase. You identify friction, design experiments, and prioritize changes by expected impact.

## Funnel Fundamentals

### Standard SaaS Funnels

**Acquisition Funnel:**
```
Visit → Lead → Signup → Activated → Trial → Paid
```

**Expansion Funnel:**
```
Paid → Engaged → Expansion Signal → Upgrade Offer → Upgraded
```

**Retention Funnel:**
```
Active → At-Risk → Intervention → Retained / Churned
```

### Conversion Rate Benchmarks

| Stage | Benchmark (Median) | Good | Excellent |
|-------|-------------------|------|-----------|
| **Visit → Lead** | 2-3% | 5% | 8%+ |
| **Lead → Signup** | 10-15% | 20% | 30%+ |
| **Signup → Activated** | 20-30% | 40% | 60%+ |
| **Trial → Paid** (opt-in, no card) | 15-25% | 30% | 40%+ |
| **Trial → Paid** (opt-out, card required) | 40-60% | 65% | 75%+ |
| **Free → Paid** (freemium) | 2-5% | 7% | 10%+ |

### The 80/20 Rule for Funnels

The biggest drop-off is usually the highest-impact fix. A 10% improvement at the largest drop-off typically outperforms a 50% improvement at a small drop-off.

**Always fix the leakiest stage first.**

## Drop-Off Analysis

### Identifying Friction

For each funnel stage, investigate:

| Signal | What It Indicates | Data Source |
|--------|------------------|-------------|
| **High bounce rate** | Wrong audience or poor first impression | ~~analytics |
| **Time on page too short** | Content not engaging or confusing | ~~analytics |
| **Time on page too long** | User struggling to complete the step | ~~analytics |
| **Form abandonment** | Too many fields or intimidating ask | ~~analytics, ~~database |
| **Error rates** | Technical issues blocking progress | ~~database |
| **Rage clicks / repeated actions** | UX confusion | Session recordings |
| **Drop-off after specific step** | That step introduces friction or doubt | ~~analytics, ~~database |

### Drop-Off Severity Framework

| Drop-off Rate | Severity | Action |
|---------------|----------|--------|
| **>70%** | Critical | Immediate redesign needed |
| **50-70%** | High | Prioritize optimization |
| **30-50%** | Moderate | Schedule A/B tests |
| **<30%** | Acceptable | Monitor, optimize incrementally |

### Common Friction Points by Stage

**Landing Page → Signup:**
- Value proposition unclear in first 5 seconds
- No social proof visible above the fold
- CTA buried or ambiguous
- Too much text, not enough scannability
- Asking for too much information upfront
- Slow page load (>3 seconds)

**Signup → Activation:**
- Email verification adds friction (consider magic links)
- Onboarding has too many steps (>4-5)
- No clear "first win" to guide toward
- User dumped into empty state with no guidance
- Required integrations or setup before seeing value

**Trial → Paid:**
- User never reached "aha moment" during trial
- No usage-based upgrade prompts
- Trial length too short (or too long — no urgency)
- Pricing page confusing or intimidating
- No intervention when trial engagement drops

## A/B Testing

### When to A/B Test vs Just Ship

**A/B test when:**
- The change is risky (could hurt conversion)
- There are multiple viable approaches and you want data
- The page has enough traffic for statistical significance
- You're optimizing an already-working funnel

**Just ship when:**
- The current experience is clearly broken
- Traffic is too low for a test (<1,000 visitors/week to the page)
- The change is a bug fix or obvious UX improvement
- You're building something new with no baseline

### Sample Size and Duration

**Minimum sample size per variant:**

| Baseline Rate | Detectable Improvement | Sample Needed (per variant) |
|---------------|----------------------|---------------------------|
| 2% | 20% relative (2% → 2.4%) | ~16,000 |
| 5% | 20% relative (5% → 6%) | ~6,000 |
| 10% | 15% relative (10% → 11.5%) | ~5,500 |
| 20% | 10% relative (20% → 22%) | ~4,000 |

**Duration rules:**
- Run for at least 1 full business cycle (typically 1-2 weeks minimum)
- Never call a test early based on early results
- Account for day-of-week effects (weekday vs weekend traffic differs)
- Minimum 95% statistical confidence before declaring a winner

### What to Test (Priority Order)

| Priority | Element | Typical Impact |
|----------|---------|---------------|
| 1 | **Headline/Value proposition** | 10-30% conversion lift |
| 2 | **CTA (copy, color, placement)** | 5-20% lift |
| 3 | **Social proof (type, placement)** | 5-15% lift |
| 4 | **Form fields (reduce count)** | 10-25% lift per field removed |
| 5 | **Page layout / visual hierarchy** | 5-15% lift |
| 6 | **Pricing presentation** | 5-20% lift |
| 7 | **Copy length and tone** | 3-10% lift |
| 8 | **Images and media** | 2-10% lift |

### A/B Test Documentation

For every test, record:

```
## Test: [Name]
**Hypothesis:** Changing [X] will improve [metric] because [reason]
**Stage:** [Which funnel stage]
**Metric:** [Primary metric to measure]
**Variants:**
- Control: [Current experience]
- Variant A: [Changed experience]
**Duration:** [Start] to [End]
**Sample size:** [Per variant]
**Result:** [Winner] — [X]% improvement, [confidence]% confidence
**Learnings:** [What this taught us]
**Next step:** [Ship / iterate / new test]
```

## Landing Page Optimization

### Above-the-Fold Checklist

Every landing page must answer these in the first viewport:

1. **What is this?** — Clear headline describing the product/offer
2. **Why should I care?** — Value proposition (benefit, not feature)
3. **What do I do next?** — Visible, clear CTA
4. **Can I trust this?** — Social proof (logos, testimonial, numbers)

### Landing Page Anatomy

```
┌─────────────────────────────────┐
│  Logo          Nav (minimal)    │
├─────────────────────────────────┤
│                                 │
│  Headline (benefit-focused)     │
│  Subheadline (clarify)          │
│  [Primary CTA Button]           │
│  Social proof (logos/numbers)    │
│                                 │
├─────────────────────────────────┤
│  3 Key Benefits (with icons)    │
├─────────────────────────────────┤
│  How It Works (3 steps)         │
├─────────────────────────────────┤
│  Social Proof (testimonials)    │
├─────────────────────────────────┤
│  Feature Details                │
├─────────────────────────────────┤
│  Pricing (if applicable)        │
├─────────────────────────────────┤
│  FAQ                            │
├─────────────────────────────────┤
│  Final CTA (repeat)             │
└─────────────────────────────────┘
```

### Page Speed Impact

| Load Time | Conversion Impact |
|-----------|------------------|
| <1 second | Baseline (optimal) |
| 1-3 seconds | -10 to -20% |
| 3-5 seconds | -25 to -40% |
| 5+ seconds | -50%+ (most visitors leave) |

## Onboarding Optimization

### Defining the "Aha Moment"

The aha moment is when the user first experiences the core value. Examples:

| Product Type | Aha Moment |
|-------------|------------|
| Project management | First task completed with a teammate |
| Analytics | First insight discovered in their own data |
| Communication | First message sent and replied to |
| Automation | First workflow running successfully |
| CRM | First deal moved through pipeline |

### Onboarding Design Principles

1. **Get to aha moment in <5 minutes** — Every step before value is friction
2. **Progressive disclosure** — Don't show everything at once
3. **Pre-populate with sample data** — Empty states kill momentum
4. **Checklist pattern** — Show progress, create completion motivation
5. **Celebrate wins** — Acknowledge when user completes key steps
6. **Single focus per step** — One action, one screen

### Onboarding Metrics

| Metric | What to Track | Target |
|--------|--------------|--------|
| **Completion rate** | % finishing onboarding | >60% |
| **Time to complete** | Minutes from signup to done | <10 min |
| **Drop-off by step** | Where users abandon | Identify worst step |
| **Activation rate** | % reaching aha moment | >40% |
| **Day 1 retention** | % returning next day | >60% |
| **Day 7 retention** | % returning within a week | >40% |

## Retention and Engagement Loops

### Building Habit Loops

```
Trigger → Action → Reward → Investment
```

| Component | Description | Example |
|-----------|-------------|---------|
| **Trigger** | What prompts the user to return | Email notification, daily digest |
| **Action** | What the user does | Check dashboard, respond to message |
| **Reward** | Value they get | New insight, completed task, social validation |
| **Investment** | Something that makes product more valuable | Added data, customization, connections |

### Re-engagement Strategies

| Trigger | Timing | Message |
|---------|--------|---------|
| **No login 3 days** | Day 3 | "Here's what you missed" + value preview |
| **No login 7 days** | Day 7 | "Your [data/report] is ready" + specific value |
| **No login 14 days** | Day 14 | "Need help?" + offer assistance |
| **No login 30 days** | Day 30 | "We miss you" + what's new + incentive |
| **Pre-renewal (at-risk)** | 30 days before | Personal outreach, success review |

## Funnel Optimization Mistakes

1. **Optimizing the wrong stage** — Fix the leakiest stage first, not the easiest
2. **Testing too small** — Underpowered tests lead to false conclusions
3. **Ignoring mobile** — If 40%+ of traffic is mobile and you only optimize desktop, you're missing half the funnel
4. **Friction blindness** — You've seen your funnel 1000 times; watch a new user try it
5. **Adding steps "just in case"** — Every additional step loses 10-30% of users
6. **Optimizing for signups, not activation** — A signup that never activates has zero value
7. **Not segmenting** — Different traffic sources convert differently; optimize for each
8. **Changing too much at once** — Can't learn what worked when everything changed
