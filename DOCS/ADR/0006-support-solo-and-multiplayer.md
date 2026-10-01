# ADR-0006: Support both solo and multiplayer play

- **Status:** Accepted
- **Date:** 2026-10-01
- **Decision owners:** JAC Works team

## Context
All three interviews require or strongly support the game remaining meaningfully playable when a full friend group is unavailable. They differ on whether AI companions should participate and on how strongly the game should center co-op.

## Decision
JAC Works should support both multiplayer and meaningful solo play.

Encounter design may adapt mechanics and scaling to player count rather than relying only on numerical HP scaling. Multiplayer should preserve meaningful cooperation when multiple humans are present.

This ADR does **not** decide:
- whether AI companions exist;
- whether every encounter supports every player count;
- exact reward parity/efficiency between solo and groups;
- the final target/maximum party size.

## Consequences
- Core systems should avoid assumptions that make solo support prohibitively expensive later.
- Encounter mechanics should be designed with player-count adaptation in mind where appropriate.
- AI companion policy remains unresolved.

## Related
- Individual design interview summaries.
