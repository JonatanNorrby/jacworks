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
- Document important architectural and game-design decisions in `DOCS/`, not only in chats.
- Never commit credentials, passwords, API tokens, secrets, or private keys.

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
