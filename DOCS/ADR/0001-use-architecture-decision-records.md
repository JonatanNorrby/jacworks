# ADR-0001: Use Architecture Decision Records

- **Status:** Accepted
- **Date:** 2026-10-01
- **Decision owners:** JAC Works team

## Context

JAC Works is developed by three humans with multiple AI agents potentially working concurrently. Important architectural and game-design decisions can otherwise become buried in chats, pull requests, or individual memory, making it easy to accidentally reverse an intentional choice later.

The project needs a lightweight, durable record of significant decisions and, especially, the reasoning behind them.

## Decision

JAC Works will use Architecture Decision Records (ADRs) for significant technical, architectural, workflow, and durable game-system decisions.

ADRs live in `DOCS/ADR/` and use monotonically increasing four-digit numbers.

An ADR should record:
- the problem/context;
- the decision;
- meaningful alternatives considered;
- why the chosen option was selected;
- important consequences/trade-offs;
- links to related ADRs, issues, PRs, or design documents when useful.

ADRs are required when a decision is expensive or risky to reverse, affects multiple systems or developers, establishes a project-wide convention, materially constrains future implementation, or resolves an important design disagreement/ambiguity.

Routine implementation details, easily reversible local choices, bug fixes, and brainstorming do not need ADRs.

### Lifecycle

Use these statuses:
- **Proposed** — candidate decision under discussion.
- **Accepted** — current project decision.
- **Rejected** — considered but explicitly not adopted.
- **Deprecated** — no longer recommended/current, without a single replacement ADR.
- **Superseded** — replaced by a newer ADR; link both directions.

Accepted ADRs are immutable historical records except for typo/link/metadata corrections. If the decision changes, create a new ADR that supersedes the old one rather than rewriting history.

### Decision authority

Questionnaires, brainstorming documents, chat discussions, issues, and individual developer preferences are inputs to decisions; they do **not** become accepted ADRs automatically.

Where the team has not actually agreed on a durable decision, record it as Proposed or leave it unresolved rather than manufacturing consensus.

### Agent behaviour

Before making a change that touches architecture or a durable game-system decision, agents must inspect the ADR index and relevant Accepted ADRs.

If requested work conflicts with an Accepted ADR, the agent must surface the conflict. If the team intentionally changes direction, create a superseding ADR as part of that work.

AI agents should help humans preserve the reasoning behind decisions, not silently make project-level policy on their behalf.

## Alternatives considered

### Keep decisions only in normal documentation
Simpler initially, but makes it difficult to distinguish current decisions from proposals and loses the history of why choices changed.

### Use issues/PRs as the decision log
Useful supporting context, but decisions become fragmented and difficult for humans and agents to discover reliably.

### Maintain one large architecture document
Easy to browse at first, but encourages rewriting history and mixes current state with decision rationale.

## Consequences

### Positive
- Humans and agents can quickly discover why important choices exist.
- Concurrent work is less likely to accidentally contradict established architecture.
- Changed decisions retain historical rationale.
- Proposed ideas remain distinguishable from accepted decisions.

### Costs
- Significant decisions require a small documentation step.
- The ADR index must be kept current.
- Agents and developers need to check relevant ADRs before architectural work.

## Related
- `DOCS/ADR/README.md`
- `DOCS/ADR/0000-template.md`
- `DOCS/AGENTS.md`
