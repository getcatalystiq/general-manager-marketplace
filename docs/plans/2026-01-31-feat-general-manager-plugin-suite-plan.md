---
title: General Manager Plugin Suite - Online Business Growth Management for Claude Cowork
type: feat
date: 2026-01-31
status: in-progress
---

# General Manager Plugin Suite - Implementation Plan

## Overview

A **Claude Cowork plugin suite** for managing businesses with AI-powered insights. Starting with the **Online Business - Ads and Content** vertical focused on growth metrics, ad optimization, content strategy, and funnel analysis.

## Repository Structure

Following the [Anthropic knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) pattern:

```
general-manager/
├── .claude-plugin/
│   └── marketplace.json      # Lists all vertical plugins
├── online-business/          # Online Business - Ads and Content plugin (MVP)
│   ├── .claude-plugin/
│   │   └── plugin.json       # Plugin metadata
│   ├── commands/             # User-invocable slash commands
│   │   ├── analyze-ads.md
│   │   ├── analyze-content.md
│   │   ├── analyze-funnel.md
│   │   └── track-growth.md
│   ├── skills/               # Auto-invoked background skills
│   ├── .mcp.json             # MCP connector configuration
│   ├── CONNECTORS.md         # Connector documentation
│   └── README.md
├── restaurant/               # Future vertical
├── retail/                   # Future vertical
└── docs/
    ├── brainstorms/
    └── plans/
```

## Online Business Plugin Commands

| Command | Description | Connectors |
|---------|-------------|------------|
| `/analyze-ads` | Google Ads performance, CAC by keyword, optimization recommendations | ~~google-ads |
| `/analyze-content` | Content performance, signup attribution, SEO opportunities | ~~analytics |
| `/analyze-funnel` | Conversion funnels, drop-off analysis, A/B test results | ~~analytics, ~~database |
| `/track-growth` | MRR, churn, LTV, CAC, cohort analysis with proper calculations | ~~stripe, ~~google-ads |

## MCP Connectors

**Phase 1 (MVP):**
- `google-ads` — Campaign performance, keyword data, conversion tracking
- `analytics` — GA4 traffic sources, conversion funnels, page performance
- `stripe` — Subscription data, MRR, churn, customer lifecycle
- `database` — Postgres/MySQL for product analytics, custom metrics

**Phase 2:**
- CMS platforms (WordPress, Webflow, Ghost)
- Product analytics (Mixpanel, Amplitude)
- Additional ad platforms (Facebook, LinkedIn)

## Implementation Status

### Completed
- [x] Repository structure following Cowork plugin standard
- [x] Root marketplace.json with plugin listing
- [x] Online Business plugin structure (.claude-plugin, commands, skills)
- [x] `/analyze-ads` command implementation
- [x] `/analyze-content` command implementation
- [x] `/analyze-funnel` command implementation
- [x] `/track-growth` command implementation
- [x] CONNECTORS.md documentation
- [x] .mcp.json connector configuration
- [x] Plugin and repository README files
- [x] Add background skills (SaaS metrics, pricing strategy, customer success)
- [x] Convert MCPs to HTTP-based endpoints

### Next Steps
- [ ] Test plugin installation in Claude Cowork
- [ ] Create connector setup guides with screenshots
- [ ] Beta testing with real online business operators
- [ ] Iterate on commands based on feedback

## Key Design Decisions

### 1. Commands vs Skills
- **Commands** (`commands/*.md`): User-invocable slash commands (e.g., `/analyze-ads`)
- **Skills** (`skills/*/SKILL.md`): Background knowledge Claude auto-invokes when relevant

### 2. Connector Placeholders
Commands use `~~connector-name` syntax to reference connectors:
- If connected: Data pulled automatically
- If not connected: User prompted to provide data manually

### 3. Graceful Degradation
All commands work without full connector setup—users can paste data, upload files, or describe metrics manually.

### 4. Business-Native Calculations
- MRR with expansion/contraction/churn breakdown (not just subscription sum)
- LTV using retention curves (not simple ARPU/churn)
- Cohort analysis with proper time-based tracking
- Multi-touch attribution for CAC

## Future Verticals

Once Online Business vertical is validated:
- **restaurant** — POS integration, menu engineering, staff scheduling
- **retail** — E-commerce analytics, inventory optimization, customer segments
- **professional-services** — Project management, time tracking, client relationships

Each vertical will follow the same structure with its own commands, skills, and connectors.

## References

- [Anthropic knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) — Reference implementation
- [Claude Cowork Plugin Docs](https://claude.com/blog/cowork-plugins) — Official documentation
- [MCP Specification](https://modelcontextprotocol.io/) — Connector protocol
