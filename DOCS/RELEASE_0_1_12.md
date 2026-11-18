# JAC Works v0.1.12: Rogue melee damage and Vanish reliability

**Status:** Prototype balance patch, based on an explicit user report that Rogue DPS was too low for a close-range class.
**Date:** 2026-11-18
**Baseline:** v0.1.11 in main, PR #30, server-authoritative Rogue combat
**Design classification:** Reversible numeric balance adjustments and a temporary-skill reliability bug fix; no new ADR required.

## Why

Rogue fights in the boss's immediate threat radius, with only Dash and 4-second Vanish as defensive mobility. In a controlled 30-second solo stationary-boss simulation with no gear and perfect melee uptime, v0.1.11 Rogue produced **77.7 DPS** versus **92.3 Fire Mage DPS** and **74.1 Ranger DPS**. The simulation is a repeatable baseline, not a prediction of real fights. Boss movement, telegraphs, distance, missed angles and retreat reduce real Rogue uptime considerably more than ranged uptime.

We want a competitive **melee damage reward** that does not remove the risk or let Backstab one-shot the encounter.

## Damage changes

| Action | v0.1.11 | v0.1.12 |
| --- | --- | --- |
| Quick Stab | 24 per hit, 600ms cooldown | **32** per hit, same 600ms cooldown |
| Backstab normal/front | 24 | **42** |
| Backstab rear | 80 | **110** |
| Poison Enchant normal tick | 6, four ticks | **8**, four ticks |
| Venom Fang poison tick | 15, two ticks | **18**, two ticks |
| Rogue stab/backstab reach | 2.8 units | **3.2** units |
| Rogue stab/backstab directional threshold | cosine 0.75 | **cosine 0.7** (slightly easier angle) |

The poison duration, Poison Enchant cooldown, Vanish duration/cooldown, Quick Stab cooldown and all other classes are unchanged. Existing Rogue gear and talent modifiers are still applied by the same server rules: rear Shadow Ambush adds 20, Opening Strike adds 16 to a qualifying Quick Stab, Venom Fang accelerates damage into fewer ticks, and Nightshade Hood doubles tick count.

The local repeatable simulation now measures **104.0 DPS for ungeared Rogue** on the same stationary target (+33.8%) versus **92.3 for Fire Mage**. Rogue's advantage is intentional compensation for melee exposure and is expected to shrink in real encounters. Geared, talented and four-player performance needs live balance testing before further amplification.

## Vanish reliability and skill-slot behavior

- Casting Vanish still makes the Rogue unselectable by normal enemy pursuit for **4 seconds**, changes the Vanish button into Backstab, and starts its full **8-second cooldown**.
- A **missed** Backstab (out of range, poor angle or blocked line of sight) now **preserves** the remaining Vanish opportunity. It can be retried while invisibility is active. No extra Vanish charge or cooldown refund is granted.
- A **successful** Backstab still ends Vanish immediately and restores the original button while preserving its cooldown.
- When the four-second Vanish window **expires naturally**, the temporary Backstab button automatically reverts to Vanish. Previously it could remain stuck in the temporary state and block normal recasting. The existing cooldown still applies.
- Temporary-skill expiration and attack resolution remain server authoritative, including during solo and multiplayer fights.

## Compatibility and testing

- All existing item IDs, recipes, gear save profiles, Rogue talent IDs, room protocol structure, and encounter IDs remain unchanged.
- Only the network/release version advances to **0.1.12**; clients must refresh for matching protocol versions.
- Unit coverage checks actual damage, 3.2-unit reach, poison gear combinations, Backstab rear versus front, missed attacks, expiry, retained cooldown and controlled 30-second DPS comparison.
- Browser regression checks Rogue skill description and temporary slot restoration in an actual live room. The complete multiplayer smoke suite and previous browser suite remain in CI.
- Multiplayer playtests should compare Rogue against Fire Mage/Ranger during **movement-heavy** boss fights and monitor burst with Venom Fang + Nightshade Hood, rather than only stationary dummies.
