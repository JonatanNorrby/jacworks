# Architecture Decision Records

This directory contains JAC Works Architecture Decision Records (ADRs).

ADRs capture **significant durable decisions and why they were made**. They are not a dumping ground for every implementation choice or brainstorm.

## Index

| ADR | Status | Decision |
| --- | --- | --- |
| [0001](0001-use-architecture-decision-records.md) | Accepted | Use Architecture Decision Records |

## Workflow

1. Check this index and relevant Accepted ADRs before making architectural or durable game-system changes.
2. Copy `0000-template.md` and assign the next unused four-digit number.
3. Use **Proposed** while a decision is still being discussed.
4. Change it to **Accepted** only when the project team has actually made the decision.
5. Once Accepted, preserve it as historical record. If direction changes, create a new ADR and mark the old one **Superseded**.
6. Update this index whenever an ADR is added or its lifecycle status changes.

## What deserves an ADR?

Good candidates include:
- client/server authority and networking architecture;
- persistence/data ownership boundaries;
- authentication/security architecture;
- major repository/package conventions;
- core game-system rules that constrain many future features;
- decisions resolving meaningful team disagreement;
- technology choices that are costly to reverse.

Usually not ADR-worthy:
- routine bug fixes;
- local refactors;
- individual tuning values;
- temporary experiments;
- brainstorming that has not become a decision;
- small, easily reversible implementation details.

The design questionnaires and interview summaries are **decision inputs**, not decisions themselves.
