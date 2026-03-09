---
name: industry-research
description: Compresses a month of market research into one session. Gathers real documents (competitor pages, earnings transcripts, customer reviews, Reddit complaints, industry reports), then runs 5 sequential analyst-grade prompts to extract unspoken insights, crack core assumptions, stress-test with investor questions, identify the gap nobody is naming, and build a concrete GTM strategy. Triggers on "research this industry", "compress market research", "analyze this market", "go-to-market for [industry]", "understand [industry] fast", or any request to quickly get up to speed on a new market.
---

# Market Research Compressor

Turns a new industry into a actionable strategy in one session. No surface-level summaries. No generic frameworks. Real documents → real insights → real GTM.

## Philosophy

The difference between 3 hours and 3 months of research isn't the amount of information — it's knowing which questions actually matter. This skill feeds real raw material into five escalating questions that surface what experienced operators know but never publish.

**Never skip the document gathering phase.** The quality of every downstream step depends entirely on the quality of inputs. Generic information produces generic outputs.

---

## Phase 1: Document Gathering

Before running any analysis, collect the following 5 document types using `web_search` and `web_fetch`. Aim for 8-12 total sources.

Tell the user: *"Gathering documents first. The quality of the analysis depends on the quality of inputs."*

### 1A — Competitor Landing Pages (3-5 companies)

Search for the top players and fetch their homepage/positioning pages. Look for:
- How they describe the problem they solve
- Who they say their customer is
- What they emphasize (price, speed, reliability, tech, relationships)
- What they conspicuously do NOT mention

```
Search: "[industry] top companies 2024 2025"
Search: "[company name] freight forwarding OR logistics OR [industry] platform"
Fetch: Homepage, pricing page, "who we serve" or "solutions" page
```

Extract and save: positioning language, customer segments named, key claims, anything suspiciously absent.

### 1B — Earnings Call Transcripts or Investor Reports (2-3 sources)

For public companies: search for recent earnings transcripts or investor day presentations.
For private markets: search for VC-backed company deep dives, Sacra reports, Contrary Research breakdowns, or CB Insights analyses.

```
Search: "[company] earnings call transcript 2024"
Search: "[company] investor day 2024 strategy"
Search: "[industry] market analysis Sacra OR Contrary Research OR CB Insights 2024"
Fetch: Full transcript or report pages
```

Extract and save: revenue trends, margin structure, what management emphasizes to investors (often different from what they say to customers), competitive dynamics named explicitly.

### 1C — Customer Reviews and Complaints (2-3 sources)

Find where real customers vent. Capterra, G2, Trustpilot, Google reviews, Reddit threads.

```
Search: "[company] reviews Capterra OR G2 OR Trustpilot 2024"
Search: "site:reddit.com [industry] complaints OR problems OR frustrated OR switching"
Search: "[industry] customer complaints hidden fees OR slow OR unreliable"
```

Extract and save: exact quotes (positive AND negative), recurring complaint patterns, what customers say when they switch providers, what they wish existed.

### 1D — Industry Pain Point Articles (1-2 sources)

Find trade press or industry blog coverage of challenges facing operators and customers.

```
Search: "biggest challenges [industry] 2024 2025"
Search: "[industry] problems operators face shippers importers buyers"
```

Extract and save: named pain points with any supporting statistics, expert quotes.

### 1E — Market Dynamics / Recent News (1-2 sources)

Find what has changed recently — disruptions, consolidation, regulation, technology shifts.

```
Search: "[industry] market trends 2024 2025 disruption"
Search: "[industry] M&A consolidation OR new entrants OR regulation 2024"
```

Extract and save: structural changes, who is winning/losing and why, macro forces.

### Document Corpus Assembly

After gathering, compile everything into a structured corpus before running analysis:

```
=== DOCUMENT 1: COMPETITOR POSITIONING ===
[Company A]: [Key positioning, customer claims, what's absent]
[Company B]: ...

=== DOCUMENT 2: FINANCIAL / INVESTOR SIGNALS ===
[Revenue trends, margin structure, what management emphasizes]

=== DOCUMENT 3: CUSTOMER VOICE ===
[Direct quotes — positive and negative, switching reasons, wish lists]

=== DOCUMENT 4: INDUSTRY PAIN POINTS ===
[Named challenges, statistics, expert quotes]

=== DOCUMENT 5: MARKET DYNAMICS ===
[Recent shifts, who's winning/losing, structural changes]
```

Tell the user: *"Documents gathered. Running 5-step analysis now."*

---

## Phase 2: The Five Prompts

Run each step sequentially. Output the full result to the user before moving to the next step. Do NOT skip steps or compress them together.

---

### Step 1: The Unspoken Insight 🧠

**What operators know but never publish.**

```
Based ONLY on the documents gathered — competitor positioning, financial data, 
customer reviews, industry analysis, and market dynamics — answer:

What does every successful player in this market understand that their customers 
never say out loud?

Give 4-5 unspoken beliefs — the hidden operating assumptions that drive how this 
industry actually works at a structural level. The thing experienced operators 
know but never publish. Be specific, provocative, and ground each insight in 
direct evidence from the documents. Use a bold header for each insight.

Do NOT summarize the documents. Do NOT list obvious pain points. 
I want the structural truth underneath the stated complaints.
```

Output format:
- Bold header per insight
- 2-3 sentence explanation
- Specific evidence from documents (quote, stat, or observation)

---

### Step 2: The Core Assumptions 🏗️

**Three beliefs holding the industry together — and where they crack.**

```
Based on these documents, identify the 3 foundational assumptions the entire 
[industry] market is built on. These are the beliefs that incumbents, investors, 
and customers all accept as true — rarely questioned, deeply embedded.

For each assumption:
1. State it clearly and boldly (one sentence)
2. Show evidence from the documents that this IS currently accepted as true
3. What would have to be true for this assumption to be completely wrong
4. Point to any evidence — even indirect — that it might already be cracking

Be specific. Use numbers, quotes, and observations from the documents.
```

Output format:
- **Assumption [N]: [Bold statement]**
- Evidence it's accepted
- What would break it
- Cracks already showing

---

### Step 3: The Investor Stress Test ⚔️

**5 questions a world-class investor would ask to destroy a new entrant.**

```
You have personally witnessed the failures and near-failures in this industry 
from the documents provided. Write 5 questions a world-class investor in this 
space would ask a founder to completely stress-test a new business idea here.

These should be the questions that expose core vulnerabilities — not surface 
concerns, but the questions that reveal fatal assumptions.

After each question, answer it using ONLY evidence from the documents provided.

Rate each answer: STRONG / WEAK / CONTRADICTED BY DATA

For every answer rated WEAK or CONTRADICTED, add:
"Strongest version of this argument — and where it still breaks:"
```

Output format:
- **Q[N]: [Question]**
- Answer grounded in documents
- Rating: STRONG / WEAK / CONTRADICTED
- (If weak/contradicted) Strongest version + where it breaks

---

### Step 4: The Gap Analysis 🎯

**The opening nobody is naming.**

```
Based on the evidence in these documents, map the gap between:

— What customers SAY they want (from reviews, complaints, stated needs)
— What companies SAY they provide (landing page messaging, earnings language)
— What the financial/behavioral data shows ACTUALLY drives revenue and retention

Where is the biggest distance between these three layers? Where is everyone in 
the industry saying one thing while experiencing another?

Then write one tight paragraph — maximum 150 words — pitching the opportunity 
created by this gap. Address it to a seed investor who has spent 10 years in 
this space. Specific. Grounded entirely in these documents. No fluff.
```

Output format:
- Three-layer map (what customers say / what companies say / what data shows)
- The gap identified
- 150-word investor pitch paragraph

---

### Step 5: The GTM Strategy 🚀

**A concrete go-to-market from the ground up.**

```
Based on all the documents gathered, build a concrete go-to-market strategy for 
a new entrant in [industry]. Structure it exactly as:

1. BEACHHEAD SEGMENT
   The specific customer type to target first. Not a broad category — a specific 
   slice. Cite evidence for why this segment is the right starting point.

2. WEDGE
   The single most important pain point to solve first that creates a foothold. 
   Why this one and not another?

3. POSITIONING
   One sentence that differentiates from every named competitor in the documents. 
   It should be impossible to say about any incumbent.

4. FIRST 100 CUSTOMERS
   Where exactly are frustrated customers expressing pain right now? 
   How to find and close the first 100 based on evidence in the documents.

5. DEFENSIBILITY
   What moat is achievable in 24 months that incumbents would struggle to 
   replicate? Ground this in the specific dynamics shown in the documents.

6. WHAT NOT TO DO
   Based on failures and near-failures visible in the documents, what traps 
   must a new entrant explicitly avoid?

Ground every single point in specific evidence from the documents.
```

Output format:
- Each numbered section as a header
- 3-5 sentences per section
- Every claim tied to a specific document observation

---

## Phase 3: Summary Synthesis

After all 5 steps, deliver a one-page synthesis:

```
## [Industry] Market Intelligence Summary

**The One Insight That Changes Everything:**
[Single most important unspoken truth from Step 1]

**The Assumption Worth Betting Against:**
[The most cracked assumption from Step 2]

**The Question That Needs the Best Answer:**
[The investor question with the weakest current answer from Step 3]

**The Gap:**
[The 150-word pitch from Step 4]

**The Play:**
[Beachhead + Wedge + Positioning from Step 5, compressed to 3 sentences]
```

---

## Output Standards

- **Specificity over generality.** "Shippers will pay a premium for reliability over price" beats "customers want better service."
- **Evidence over assertion.** Every claim must trace to a specific document, quote, stat, or observable pattern.
- **Contradiction is gold.** When documents contradict each other, surface it — that's where the opportunity lives.
- **No hedging.** Do not write "this might suggest" or "it could be argued." State conclusions directly.
- **No consulting-speak.** No "synergies," "value proposition," "go-to-market motion," "north star metric." Plain language only.

---

## Trigger Examples

This skill activates on:
- "Research the [industry] market for me"
- "I want to understand [industry] fast"
- "Help me build a GTM for [industry]"
- "What's the attack surface in [industry]?"
- "Compress [industry] market research"
- "I'm entering [industry] — what do I need to know?"
- Any request to analyze a market the user has not worked in before

## Notes

- **This skill is industry-agnostic.** The document types and five prompts work for SaaS, logistics, healthcare, fintech, B2B services, consumer, or any market.
- **Time estimate:** 45-90 minutes depending on document availability and industry complexity.
- **If documents are sparse:** Surface the gaps explicitly. Thin evidence = a finding in itself (the industry is opaque, which is either a moat or a red flag).
- **If the user provides documents upfront:** Skip Phase 1 and go straight to Phase 2 using what they've provided.