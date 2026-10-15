# ADR-0012: Connected development Labs and consolidated prototype

Status: Accepted
Date: 2026-10-15

## Context
The hub branch and Labs v2 diverged, dropping three v1 controls and retaining obsolete boss presentation. The human approved audit decisions D1–D7; project licensing (D8) remains undecided.

## Decision
Adopt hub e36adfa as gameplay baseline and selectively integrate Labs v2 as a separate in-game testing area. Preserve v1 VFX speed/scale and character health-bar visibility. Labs stays connected to the live multiplayer room, preserving membership and voting. Clearly warn that combat continues; block movement/abilities during inspection and restore current scene/rig state on exit. Use current Truffle Man/mushroom presentation with stable greenCone ID. Keep shared authoritative simulation, room routing, saves, accepted scope extensions, docs and credits. Browser-local economy remains prototype-only. Introduce 0.1.0 and the release rules; do not assign a project source license.

## Consequences
Labs is a presentation tool, not a safe pause or isolated multiplayer session. Tests must exercise transitions, async assets, live votes and restoration. Future authenticated persistence and crafting proposals require their own decisions.
