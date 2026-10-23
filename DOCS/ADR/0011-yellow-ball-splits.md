# ADR-0011: Yellow Ball split encounters

- **Status:** Accepted (explicit user implementation request)
- **Date:** 2026-10-14

## Context

The requested normal half-health split and separate Hard Yellow Ball with three split generations require multiple authoritative boss bodies and a distinct hard-tier material. ADR-0004 favors mechanical difficulty and ADR-0006 requires meaningful solo support.

## Decision

Retire a ball at its first half-health threshold and replace it with two independently targetable balls. Normal has one split generation; hard has three and three-bounce slam chains. All living balls must die before the encounter issues its single victory receipt. Clamp damage at pending split thresholds and create children only during the authoritative tick, so one overkill attack cannot cascade through generations. Preserve unique child identities in the shared add protocol; a retired primary has zero HP and is excluded from targeting, rendering and collision. The shared simulation owns each body's warnings, motion, damage and split lifecycle.

Hard victory grants Large Sphere under the existing browser-local receipt ledger. No recipe is added. Normal loot, old saves and existing crafting retain their semantics. Protocol extensions remain shared between the local server and Worker.

## Consequences

Single-target projectiles and applied damage-over-time retain their original target identity instead of following splits. Area effects can hit children on subsequent impacts/ticks. Overkill above a split threshold is discarded deliberately. Size, HP, damage, recovery and telegraph tuning are reversible prototype values documented in README; automated fixtures establish mechanics and synchronization, not final human balance. The existing unauthenticated browser-local inventory boundary remains unchanged.
