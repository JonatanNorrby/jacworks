# ADR-0021: Crystalline Fracturer collapse visuals retain existing hazard rules

**Status:** Accepted for prototype
**Date:** 2026-11-19
**Scope:** Fracturer, Truffle + Fracturer and Chaos Arena visual rendering
**Related:** ADR-0015 (cardinal safe quarter), ADR-0019 (Chaos attack parity), ADR-0020 (Rune Golem Fracturer movement)

## Context and decision

The player explicitly asked for Fracturer's visually "destroyed" regions to fill with crystals instead of appearing as empty black voids. In v0.1.14, the underlying collision and hazard timing were already authoritative on the server.

Each warned quadrant retains its obvious pre-impact telegraph. Once collapse resolves, the client renders dense, jagged amethyst/sapphire/ice crystals atop a contrasting crystalline floor. Larger Chaos tiles use the same visual treatment. Crystal shards are scenery only, never collision obstacles or pickable items. They may overlap the unsafe quadrant, intentionally making destruction obvious without hiding the central safe corridors.

**The server's dangerous-area mechanics, cardinal eruption, hitboxes, boss movement, damage, retreat/safe pathways and floor restoration are unchanged.** In particular, the user did not authorize converting the destroyed floor into new traversable rock or additional damaging crystal attacks.

## Rationale and follow-up

Crystals communicate a lasting unsafe region while giving the Rune Golem a coherent visual language. Retain high-contrast telegraphs and check readability in an actual four-player Chaos Arena playtest. This ADR concerns visual art direction, not a new mechanic. Any future crystal collision, mine damage, pickups or rebuilding systems require a separate design decision.
