---
name: ad-optimization
description: Multi-channel ad optimization expertise for bidding strategy, keyword management, budget allocation, quality scores, and attribution. Use when analyzing ad performance, optimizing campaigns, reallocating spend across channels, or evaluating CAC by channel.
---

# Ad Optimization Expertise

You are an expert at optimizing paid advertising across Google Ads, Meta Ads, Reddit Ads, LinkedIn Ads, and other channels. You understand bidding strategies, keyword management, audience targeting, budget allocation, and multi-channel attribution.

## Multi-Channel Strategy

### Channel Selection Framework

Choose channels based on your audience and goals:

| Channel | Best For | Typical CAC Range | Intent Level |
|---------|----------|-------------------|--------------|
| **Google Search** | High-intent buyers actively searching | $50-300 | High (searching for solution) |
| **Google Display** | Brand awareness, retargeting | $20-150 | Low (browsing) |
| **Meta (FB/IG)** | B2C, visual products, lookalike audiences | $30-250 | Low-Medium (discovery) |
| **LinkedIn** | B2B, professional audiences, ABM | $100-500+ | Medium (professional context) |
| **Reddit** | Niche communities, technical audiences | $30-200 | Medium (engaged in topic) |

### Channel Mix Guidelines

| Business Stage | Recommended Mix |
|----------------|----------------|
| **Early (finding PMF)** | 70% Google Search, 30% retargeting. Focus on high-intent. |
| **Growth (scaling)** | 40% Search, 30% Social, 20% retargeting, 10% experimental |
| **Mature (optimizing)** | Allocate by LTV:CAC ratio per channel. Cut losers aggressively. |

### Budget Allocation Rules

- **Never allocate more than 50%** of total budget to a single channel (diversification)
- **Minimum viable budget**: Each channel needs enough spend to generate statistically significant data (~100 conversions/month minimum for optimization)
- **Rebalance monthly**: Shift budget toward channels with best LTV:CAC (not just lowest CAC — account for customer quality)
- **Reserve 10-15%** for testing new channels, audiences, or creatives

## Google Ads Optimization

### Keyword Strategy

**Match Types:**

| Match Type | Behavior | Use Case |
|------------|----------|----------|
| **Exact** | Only the exact query (or close variants) | High-value, proven keywords |
| **Phrase** | Contains the phrase in order | Mid-funnel, moderate control |
| **Broad** | Related queries, AI-expanded | Discovery, with Smart Bidding |

**Keyword Management Rules:**
- Start with exact and phrase match for control
- Only use broad match with Smart Bidding strategies
- Review search terms report weekly for the first month, then biweekly
- Add negative keywords aggressively (aim for 1 negative per 3-5 positives)

### Quality Score

Quality Score (1-10) directly impacts your CPC and ad position:

| Component | Weight | How to Improve |
|-----------|--------|----------------|
| **Expected CTR** | ~40% | Write compelling ad copy, use ad extensions, test headlines |
| **Ad Relevance** | ~25% | Match ad copy to keyword intent, use keyword in headline |
| **Landing Page Experience** | ~35% | Fast load, mobile-friendly, relevant content, clear CTA |

**QS Impact on CPC:**

| Quality Score | Estimated CPC Modifier |
|---------------|----------------------|
| 10 | -50% (half price) |
| 7 | Baseline |
| 5 | +25% |
| 3 | +67% |
| 1 | +400% |

### Bidding Strategies

| Strategy | When to Use | Minimum Data |
|----------|-------------|-------------|
| **Manual CPC** | New campaigns, learning phase | None |
| **Maximize Clicks** | Traffic campaigns, early data collection | None |
| **Maximize Conversions** | Established campaigns with conversion tracking | 15+ conversions/month |
| **Target CPA** | Mature campaigns, cost control | 30+ conversions/month |
| **Target ROAS** | Revenue-optimizing, e-commerce | 50+ conversions/month |

### Negative Keywords

**Essential negative keyword categories:**
- Free, cheap, discount (if premium product)
- Jobs, careers, salary (unless recruiting)
- Tutorial, how to, what is (unless content marketing)
- Competitor names (unless running competitor campaigns intentionally)
- DIY, template, free tool (unless freemium)

## Meta Ads Optimization

### Audience Strategy

**Audience Types by Effectiveness:**

| Audience | Typical Performance | Use Case |
|----------|-------------------|----------|
| **Lookalike (1%)** | Best conversion rate | Scale proven customer base |
| **Lookalike (1-3%)** | Good reach/performance balance | Broader scaling |
| **Custom Audience (retargeting)** | Highest ROAS | Re-engage website visitors, email lists |
| **Interest-based** | Variable, needs testing | Cold prospecting, discovery |
| **Broad (no targeting)** | Works with large budgets + good creative | Meta's AI optimization |

### Creative Best Practices

- **Test 3-5 creatives per ad set** minimum
- **Video outperforms static** in most cases (especially <15 seconds)
- **Refresh creatives every 2-4 weeks** (creative fatigue sets in)
- **UGC-style content** often outperforms polished brand creative
- **Lead with the problem**, not the product

### Campaign Structure

```
Campaign (Budget level)
├── Ad Set 1: Lookalike 1% (best audience)
│   ├── Creative A (video)
│   ├── Creative B (image)
│   └── Creative C (carousel)
├── Ad Set 2: Retargeting (website visitors 30d)
│   ├── Creative D (testimonial)
│   └── Creative E (offer)
└── Ad Set 3: Interest-based (testing)
    ├── Creative A
    └── Creative B
```

## LinkedIn Ads Optimization

### Targeting Strategy

LinkedIn's strength is professional targeting:

| Targeting | Best For | Typical CPM |
|-----------|----------|-------------|
| **Job Title** | Reaching specific decision-makers | $$$$ (highest) |
| **Job Function + Seniority** | Broader but relevant reach | $$$ |
| **Company Size + Industry** | ABM-style targeting | $$$ |
| **Skills + Groups** | Technical/niche audiences | $$ |
| **Lookalike** | Scaling proven audiences | $$ |

### LinkedIn-Specific Rules

- Minimum audience size: 50,000 (smaller = expensive, unreliable)
- LinkedIn CPC is 3-5x higher than other platforms — only worth it if LTV supports it
- Sponsored Content outperforms Text Ads and Message Ads for most B2B SaaS
- Lead Gen Forms convert better than landing pages on LinkedIn (less friction)

## Reddit Ads Optimization

### Targeting Strategy

Reddit targeting is community-based:

| Targeting | Best For |
|-----------|----------|
| **Subreddit targeting** | Reaching specific interest communities |
| **Interest targeting** | Broader reach across related communities |
| **Custom audiences** | Retargeting, lookalikes |
| **Keyword targeting** | Reaching users discussing specific topics |

### Reddit-Specific Rules

- Reddit users are skeptical of ads — authentic, informative content wins
- Avoid hard-sell copy; education and value-first works better
- Comments are visible on ads — monitor and engage authentically
- Subreddit targeting is the most effective approach (know your communities)
- Test promoted posts before scaling budget

## Attribution Models

### Common Models

| Model | How It Works | Best For |
|-------|-------------|----------|
| **Last click** | 100% credit to last touchpoint | Simple, conservative |
| **First click** | 100% credit to first touchpoint | Understanding discovery |
| **Linear** | Equal credit to all touchpoints | Balanced view |
| **Time decay** | More credit to recent touchpoints | Long sales cycles |
| **Position-based** | 40% first, 40% last, 20% middle | Balanced with emphasis on key moments |
| **Data-driven** | ML-based credit assignment | High volume, sophisticated |

### Attribution Best Practices

- **Never rely on a single model** — compare at least 2
- **Platform attribution is biased** — each platform over-credits itself
- **Use UTM parameters consistently** across all channels
- **Look at blended metrics** when attribution is unclear: total spend / total conversions = blended CAC
- **Incrementality testing** (geo-lift, holdout groups) is the gold standard but requires scale

## Ad Performance Benchmarks

### Key Metrics by Channel

| Metric | Google Search | Meta | LinkedIn | Reddit |
|--------|--------------|------|----------|--------|
| **CTR** | 3-5% (good) | 1-2% (good) | 0.4-0.8% (good) | 0.3-0.8% (good) |
| **CPC** | $1-5 (B2B SaaS) | $0.50-3 | $5-15 | $0.50-3 |
| **Conversion Rate** | 3-5% | 1-3% | 1-3% | 1-2% |
| **CPM** | $10-30 | $5-20 | $30-80 | $3-10 |

### When to Pause vs Optimize

**Pause immediately:**
- $0 conversions after spending 3x your target CPA
- Quality Score below 3 with no clear fix
- CTR below 0.5% after creative testing

**Optimize first:**
- Conversions exist but CAC is 1.5-2x target — adjust bids, refine audience
- Good CTR but low conversion rate — fix landing page, not the ad
- High impression share loss — increase budget or narrow targeting

## Common Optimization Mistakes

1. **Optimizing for clicks instead of conversions** — Cheap clicks from wrong audience waste money
2. **Not enough budget per channel** — Spreading too thin prevents statistical significance
3. **Changing too many variables at once** — Can't learn what worked
4. **Ignoring post-click experience** — The landing page matters as much as the ad
5. **Comparing channels on CAC alone** — Factor in LTV by channel; higher CAC may be worth it
6. **Not using negative keywords** — Biggest waste of Google Ads budget
7. **Creative fatigue blindness** — Performance drops after 2-4 weeks; refresh regularly
8. **Platform loyalty bias** — Don't keep spending on a channel just because you know it; follow the data
