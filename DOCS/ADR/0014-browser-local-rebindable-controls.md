# ADR-0014: Rebindable browser-local controls for Prototype 01

- **Status:** Accepted for Prototype 01
- **Date:** 2026-11-18
- **Decision:** Add configurable keyboard shortcuts in the game Options screen, requested by a JAC Works developer
- **References:** Prototype 01, ADR-0007, PR #15 (historical keybinding implementation), PR #16 (revert), ADR-0013, release 0.1.7

## Context

Prototype controls are currently hardcoded, forcing WASD movement, E interactions, slots 1–4, R to propose, H to return, and Enter to chat. An earlier keybindings branch was merged in PR #15 and reverted in PR #16 following rendering concerns, so it must not be restored wholesale. Players need to remap controls without changing the authoritative shared combat protocol.

## Decision

Expose a **Keybindings** section inside **Options**, with one selectable capture button for each of 12 existing keyboard actions (four movement directions, interact, four skill slots, propose/retry boss, return to hub, room-chat open). Each button listens for a single unmodified key, displays that binding, and saves changes immediately to a versioned browser-local key, `jacworks-keybindings-v1`. A restore-defaults button resets all twelve actions.

- Bindings must be one-to-one; reject a duplicate with an explanation naming the other action. No silent overwrite of other bindings.
- Escape cancels an unfinished capture or closes Options, while Escape remains unavailable as a gameplay key. Browser/system modifiers and common browser/navigation keys remain reserved.
- Support normal printable keys, numeric keys, arrow keys, Space and Enter. The standard Shift self-target behavior remains compatible with digit hotkeys.
- Settings follow the stored preferences across refreshes and tabs. Corrupted, invalid or duplicate saved layouts revert to defaults. No authenticated account data or migration needed.
- Update in-world controls, skill-bar keycaps, hub hints, and chat hint when bindings change. All game inputs should be blocked while typing, capturing a shortcut, using other menus, or chatting.
- Keep the binding editor modular rather than copying the historical reverted implementation. The server continues to receive the same movement and ability actions; no server protocol or material balance changes.

## Consequences

No additional network trust or attack surface is introduced. The client owns only the mapping from physical keyboard events to existing validated commands. This is reversible via Reset Defaults. Full support for gamepads, modifier chords, cloud-synced preferences and rebindable mouse controls remains outside this decision.
