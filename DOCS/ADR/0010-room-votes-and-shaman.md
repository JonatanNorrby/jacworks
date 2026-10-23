# ADR-0010: Unanimous room encounter votes and Shaman

- **Status:** Accepted (explicit user implementation request)
- **Date:** 2026-10-14
- **Supersedes:** ADR-0009 first-entrant boss selection and roster size only; all authority, gear and persistence decisions remain current.

## Context

The user explicitly requested consensus before boss starts within the existing room/hub, plus a Shaman kit. This changes the encounter-selection rule and expands the roster without introducing a global hub or changing existing inventory ownership.

## Decision

Keep hub clients connected to the same authoritative room. A boss selection creates an expiring proposal with a unique ID and fixed connected voter roster. The proposer and every other connection explicitly accept; decline or membership changes cancel. The socket identity supplies the voter identity; stale or malformed votes never count. Retry follows the same rule.

Add Shaman with Earth Shock, Fire Totem, Healing Totem and Dash. Shared server state owns totem placement, health, target selection, damage/healing and lifecycle; each Shaman owns at most one totem of each kind. Enemy attacks can select and destroy totems. Preserve all seven previous kits, gear eligibility, browser persistence and the existing prototype inventory trust boundary.

## Consequences

A passive connected hub tab can prevent unanimity until it votes or disconnects. Returning to the hub resets the shared thin-prototype encounter. Late connections during an existing fight join it; they do not retroactively vote on a completed start. This is a room-scoped prototype, not matchmaking, final roster/tuning or authenticated account persistence. Exact timing, damage and cover policies are documented in README and exercised by shared simulation tests and WebSocket smoke.
