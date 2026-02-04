---
date: 2026-02-03
topic: general-manager-mcp-app
---

# General Manager MCP App

## What We're Building

A remote MCP server (TypeScript) that serves as an AI-powered "general manager" for small businesses. The system connects to a separate agent orchestrator service to execute tasks, while GM owns the user-facing experience: OAuth authentication, task management, scheduling, autonomy decisions, and a dashboard exposed via MCP Apps.

**Target users:** Solo operators and small teams (2-10 people) who want AI to handle operational tasks—from immediate responses to strategic planning.

**Key insight:** GM is the "brain" that decides what to do and when; the orchestrator is the "hands" that execute. This means GM contains significant business logic including task classification, autonomy policies, and proactive suggestion generation.

## Why This Approach

**Considered approaches:**

1. **Thin MCP Proxy** - GM minimal, orchestrator owns complexity
2. **Rich GM Layer** - GM has business logic, orchestrator is executor ✓ CHOSEN
3. **Event-Driven Microservices** - Full distributed architecture

**Chose Rich GM Layer because:**
- Tight control over user experience and decision-making
- All intelligence in one place for easier debugging
- Orchestrator can be simpler (just executes what GM tells it)
- Faster iteration on autonomy and suggestion features

## Key Decisions

### Architecture
- **Remote MCP server** using TypeScript with MCP 2025 spec
- **OAuth 2.1 with self-discovery** for Claude/OpenAI authorization
- **MCP Apps extension** for interactive dashboard UI
- **Separate orchestrator service** (to be built) handles actual task execution
- **Database**: TBD during planning (likely PostgreSQL or managed equivalent)

### Task Model
- **Three horizons:** short-term (immediate), medium-term (periodic), long-term (strategic)
- **Examples:**
  - Short: Respond to customer inquiry, process order
  - Medium: Monthly reporting, inventory review
  - Long: Market analysis, business evolution ideation
- All task types managed through the same agentic task system

### Autonomy System
- **Combines multiple signals:** action-based rules + confidence levels + user-configured tiers
- **MVP scope:** Basic configuration—users set high/medium/low autonomy per task category
- **Full sophistication** (granular per-action control) deferred to later versions

### Proactive Suggestions
- System identifies what needs doing before user asks
- **Surfaces via:** Dashboard notifications + agent prompts when chatting + email for time-sensitive items
- SMS/webhook notifications deferred to post-MVP

### MVP Dashboard (MCP App)
- **Full management capability:** status, history, create/edit tasks, configure autonomy
- Not just read-only—users can do everything through the dashboard

### Notifications
- **MVP includes email** for time-sensitive suggestions and approval requests
- Additional channels (SMS, webhooks) in future versions

## Core MCP Tools (Proposed)

```
# Task Management
gm_list_tasks        - List tasks with filters (status, horizon, category)
gm_create_task       - Define a new task
gm_update_task       - Modify task definition or schedule
gm_delete_task       - Remove a task

# Execution
gm_run_task          - Manually trigger a task
gm_get_task_result   - Retrieve results from a completed task
gm_list_results      - Browse task execution history

# Approvals
gm_list_pending      - Show items awaiting human approval
gm_approve           - Approve a pending action
gm_reject            - Reject with optional feedback

# Suggestions
gm_list_suggestions  - Show proactive suggestions
gm_accept_suggestion - Convert suggestion to task
gm_dismiss_suggestion - Remove from queue

# Configuration
gm_get_settings      - View autonomy and notification settings
gm_update_settings   - Modify settings
```

## MCP App Resources (Dashboard)

```
# Dashboard Views
gm://dashboard/overview     - Main status view
gm://dashboard/tasks        - Task management
gm://dashboard/approvals    - Pending approvals
gm://dashboard/suggestions  - Proactive suggestions
gm://dashboard/history      - Execution history
gm://dashboard/settings     - Configuration
```

## Open Questions

1. **Orchestrator API contract** - What does GM need from the orchestrator? Define interface before building.
2. **Task definition format** - How are tasks specified? JSON schema? Natural language that GM interprets?
3. **Result summarization** - Does GM summarize results, or does the orchestrator return summaries?
4. **Multi-tenancy** - How is user data isolated? Database per user vs shared with row-level security?
5. **Rate limiting** - How to prevent runaway task execution or API abuse?
6. **Billing model** - If this is a SaaS, how do usage limits work?

## Next Steps

→ `/workflows:plan` for implementation details

**Suggested phases:**
1. Core MCP server with OAuth 2.1
2. Task CRUD and basic scheduling
3. MCP App dashboard
4. Orchestrator integration (mock first, real later)
5. Autonomy engine
6. Proactive suggestions
7. Email notifications
