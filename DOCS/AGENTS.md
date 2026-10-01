# JAC Works — Shared Agent Context

This file is shared project context for AI coding agents working on JAC Works. Read it before making changes.

## Collaboration rules

JAC Works is developed concurrently by three human developers and may also have multiple AI agents working at the same time.

- Treat `main` as protected. Do not make feature changes directly on `main`.
- Before starting work, inspect current `main`, active branches, open pull requests, and the relevant issues.
- Prefer one issue / concern per branch and one focused pull request.
- Use descriptive branch names such as `feat/...`, `fix/...`, `infra/...`, and `docs/...`.
- Do not overwrite or casually refactor another developer's active work.
- Keep changes small enough to review and merge safely.
- Expect concurrent branches and merge conflicts; minimize unnecessary edits to shared files.
- Rebase/update from current `main` before final integration when appropriate.
- Do not merge unrelated work merely because it is convenient.
- Document significant architectural and durable game-design decisions as ADRs in `DOCS/ADR/`, not only in chats, issues, or PRs.
- Never commit credentials, passwords, API tokens, secrets, or private keys.

## Architecture Decision Records (ADRs)

JAC Works uses ADRs as the durable decision log for significant architecture, workflow, and core game-system decisions. Read `DOCS/ADR/README.md` and relevant Accepted ADRs before making changes that may affect them.

- Treat Accepted ADRs as current project decisions unless a newer ADR supersedes them.
- Do not silently violate or rewrite an Accepted ADR. If direction changes, create a new ADR that supersedes the old one and preserve the historical reasoning.
- Use **Proposed** for decisions still under discussion; only mark an ADR **Accepted** when the humans have actually made the decision.
- Developer questionnaires, interview summaries, brainstorms, chats, issues, and PR comments are decision inputs, not accepted decisions by themselves.
- Do not create ADRs for routine bug fixes, small local implementation choices, tuning values, or cheap/reversible experiments.
- When a significant new decision emerges during implementation, propose/document it instead of letting the decision exist only in code or conversation.
- Keep `DOCS/ADR/README.md` updated when ADRs are added, superseded, deprecated, rejected, or otherwise change lifecycle state.

### Human onboarding responsibility

Every AI agent working with a JAC Works developer must make sure its human understands that the project uses ADRs and what that means in practice. In particular, the agents working with **Jonatan** and **Christoffer (Chris)** should explicitly explain this workflow to them the next time they work on JAC Works if they have not already done so:

1. important durable decisions are recorded in `DOCS/ADR/`;
2. Proposed ADRs are discussion candidates, not settled decisions;
3. Accepted ADRs are the current source of truth for that decision;
4. changing an Accepted decision means creating a superseding ADR rather than erasing history;
5. agents should surface relevant ADRs when work touches an existing decision.

The goal is not bureaucracy. The goal is that all three humans and all agents can understand **what was decided, why, and whether it is still current** without relying on one person's chat history.

## Current project status

The project is in early concept/design and infrastructure planning. Do not treat brainstormed ideas as final design unless they are explicitly recorded as an accepted decision.

Current game direction being explored:
- Browser-first multiplayer game.
- Strong inspiration from the parts of World of Warcraft / Final Fantasy XIV the team enjoys: distinct class identities, satisfying abilities, build choices, gear progression, and mechanically rich PvE encounters.
- A current concept candidate is a 1–4 player boss-focused PvE game with compact arenas and learnable raid/dungeon-style mechanics.
- Progression ideas under discussion include boss tiers, gameplay-changing talents, Diablo-like loot/salvage, boss materials, and targeted crafting.
- Solo play with scaling/altered mechanics is being considered.
- Earlier concepts such as PvPvE, tower defence / Dungeon Defenders-like gameplay, and strategic/board-game layers have been discussed and are not automatically discarded.

## Proposed infrastructure

The team has discussed the following architecture, but implementation should follow recorded architecture decisions:
- GitHub for source control, issues and pull requests.
- Browser client.
- Cloudflare Workers for backend/API.
- Cloudflare Durable Objects for authoritative active multiplayer sessions.
- Cloudflare D1 for persistent player/progression data.
- Server-authoritative handling of important gameplay state, damage, boss HP, rewards and progression.
- Shared protocol/types and carefully scoped shared gameplay/data packages.

Authentication must never store plaintext passwords. Even prototype passwords must be securely salted and hashed, or an appropriate authentication solution should be used.

## Source of truth

When information conflicts, prefer in this order:
1. Accepted/current documentation and ADRs in `DOCS/`.
2. Merged code and configuration on `main`.
3. Current GitHub issues/PRs and their comments.
4. This file's project summary.
5. Old chat context or assumptions.

If a decision is unclear, surface the ambiguity rather than silently inventing a permanent project decision.

## Maintaining this file

Keep this file concise and durable. Update it when shared workflow rules, major architecture, project direction, or agent expectations materially change. Detailed designs belong in separate documents under `DOCS/`.
