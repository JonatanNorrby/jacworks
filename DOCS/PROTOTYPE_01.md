# Prototype 01 — Multiplayer Boss Combat

**Status:** Accepted prototype scope
**Date:** 2026-10-01

## Purpose
The first prototype exists to answer:

> **Is the core JAC Works combat loop fun when real players control intentional-feeling characters against a learnable mechanical boss, fail, learn, coordinate, and improve?**

It is not intended to prove the full progression, loot, world, AI, PvP, crafting, or content model.

## Required
- **Babylon.js browser client.**
- **Real-time combat.**
- **WASD/free responsive movement.**
- **Four simultaneous human players** in the same encounter, as the strongest multiplayer proof requested in the interviews. This does not establish four as the final universal party-size rule.
- **At least one playable class/kit** that feels intentional rather than placeholder-only.
- A small set of meaningful abilities sufficient to test movement, timing, cooldown/resource decisions, and combat feedback. The final ability count remains undecided.
- **One boss encounter** with multiple mechanics.
- At least one mechanic requiring reaction/positioning.
- At least one mechanic creating meaningful multiplayer coordination or interaction.
- Difficulty high enough that a fresh group is expected to fail, learn, and improve rather than trivially win first try.
- **Readable telegraphs/feedback** so players can understand what happened.
- **Fast retry** after failure.
- Enough audiovisual feedback to evaluate movement, abilities, hits, danger, and success/failure.

## Success criteria
1. Four real players can connect and play the encounter together reliably.
2. Movement and abilities feel responsive enough for skill-based combat.
3. Players can read the boss and understand failures from information available in-game.
4. Repeated attempts produce observable learning/improvement.
5. Coordination materially affects the fight.
6. The class/ability kit creates meaningful decisions rather than only button spam.
7. After failure, players want to retry because the combat/learning loop itself is enjoyable.

Final balance and final-quality art are not required.

## Explicitly out of scope
Do not delay Prototype 01 for loot, crafting, long-term progression, talent/build progression, Codex, story/lore, housing/base, a large hub/world, matchmaking, AI companions, PvP, multiple classes, multiple bosses, cosmetics/transmog, final account systems, or broad content production.

Minimal infrastructure needed to run the multiplayer test is in scope.

## Questions intentionally left unresolved
Prototype 01 must not accidentally turn these into permanent decisions:
- exact vertical power progression;
- free respec versus long-term build commitment;
- AI companion policy;
- PvP scope;
- final role structure;
- final class count;
- final party-size rules;
- exact wipe/recovery philosophy;
- final 2D/2.5D/3D art direction.

If implementation forces one temporarily, treat it as a prototype assumption unless separately accepted through an ADR.

## Related
- ADR-0002 — Player skill over raw power
- ADR-0003 — Builds and gear change gameplay
- ADR-0004 — Learnable encounters and mechanical difficulty
- ADR-0006 — Support solo and multiplayer
- ADR-0007 — Use Babylon.js for the game client
- Developer interview summaries
