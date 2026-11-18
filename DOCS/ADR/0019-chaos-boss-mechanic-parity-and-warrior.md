# ADR-0019: Chaos Arena full boss-mechanic parity and stationary champions

**Status:** Accepted for prototype implementation
**Date:** 2026-11-18
**Clarifies:** ADR-0018 (the Chaos Arena's five-boss behavior)
**Continues:** ADR-0004 (learnable encounters), ADR-0015 (Fracturer safe sector), ADR-0016 (Ant Queen Royal objective)
**Source:** Explicit user request that stationary bosses remain stationary and all five Chaos bosses perform all their original mechanics. The user separately requested a Warrior DPS check.

## Context

The initial Chaos Arena spawned five champions but wrongly put stationary bosses into generic minion chase AI, moving them and giving them untelegraphed contact attacks. Warden only used lines; Fracturer had cardinal eruptions but omitted normal corner collapses and target attacks; Truffle Man omitted its mushroom summons.

Existing boss mechanics and Accepted ADRs establish the intended individual kits. The ability idea library remains draft inspiration, not binding decisions. The current user request explicitly requires complete normal-boss mechanic parity.

## Decision: five independent normal boss kits

All five normal bosses exist at the same time in one large Chaos room. Each keeps independent health, attack timers and mechanics. Hard and Double mechanics are not silently substituted.

| Boss | Movement | Normal mechanics retained in Chaos |
| --- | --- | --- |
| Warden | **Fixed** at (-12, 0), nose rotates to targeted player | Three-step marked blast (3.1 radius), directional line sweep (3 width / 13 length), small all-player scatter (2.2 radius). No Hard-only proximity attack. |
| Yellow Ball | **Mobile** under dedicated physics | Telegraph rolling charge, bouncing slam, half-HP split into two smaller balls; all surviving fragments must die. Generic minion AI never moves it. |
| Truffle Man | **Mobile**, chases to melee radius | Telegraphed close slam, its original poison marks and clouds, two 54-HP mushroom adds every third slam up to six live adds. Visible small smash motion cue. |
| Fracturer | **Fixed** at (12, 0) | Marked blasts, line attacks, all-party scatter, sequential four corner collapses, and three dangerous/one safe cardinal quarter eruption. |
| Ant Queen | **Fixed** at (0, 15), fully immune to direct damage | Worker waves, Royal Guards, four Royal-death objective hits to win, and Rockfall telegraphs. |

Generic minion chase/contact attack only applies to actual minions (ants and mushrooms). All five Chaos champions have solid collision bodies.

## Arena layout and overlapping hazards

- The arena is roughly 50 by 50 rendered units, with server-authoritative radial limit 21.5.
- Warden and Fracturer stand on opposite sides of the central horizontal walkway; Ant Queen stays on the north axis. This keeps them melee-accessible even after the corner collapses.
- Chaos Fracturer's warning and void tiles expand to the large floor with a **5.5-unit axial corridor**, rather than using the smaller standalone arena's 3-unit corridor.
- Cardinal danger sectors still use their original exactly-one-safe cardinal rule, separate from collapsed corners. Normal and Double Fracturer encounters keep their existing geometry.
- Every Chaos champion telegraph carries its source boss ID; pending attacks cancel if the source is defeated. Defeating Fracturer reopens collapsed floor and cancels its cardinal warning. Defeating Truffle Man stops its poison marks/clouds.
- Ant Queen's Royal-only damage rule and Yellow Ball's independent split condition remain server-authoritative. The Chaos encounter awards one Chaos Sigil and one unique-first-clear talent point, not five ordinary rewards.

## Separate Warrior damage audit

An ungeared 30-second stationary-boss benchmark showed Warrior at **53.5 perfect-uptime DPS** versus Rogue **104.0**, Fire Mage **92.3** and Ranger **74.1**. Warrior retains strong Guard mitigation, forced taunt and a gap-closing charge, so a pure Rogue damage ceiling is inappropriate, but the earlier damage undervalued sustained melee risk.

Increase Sword Slash from 38 to **50**, and Charging Stab from 60 to **85**. Preserve the 1.1s/3.6s cooldowns, positional conditions, Guard damage reduction and taunt, and all class talent/gear interactions. The controlled benchmark rises to **72.2 ungeared DPS** (approximately +35%) and **81.1 DPS** using its selected nine talent points, below damage specialists. These figures are an idealized comparison, not actual movement-heavy multiplayer DPS.

## Consequences and testing

- Original normal, Hard and Double bosses keep their existing mechanics; the Chaos orchestration is scoped to the Chaos fight.
- No saved equipment/item/class IDs, reward material names, or talent point rules change.
- Server tests cover fixed champion positions, separate normal mechanic schedules, player scatter, Yellow Ball movement/split, Truffle summons/poison, Fracturer collapses/cardinal hazards, Queen waves/guard objective/rocks, death cleanup, and Warrior role/DPS.
- Browser tests verify actual live room snapshots and Warden/Fracturer attack warnings while fixed bosses stay anchored.
- Follow-up human tests should focus on telegraph clutter, four-player survivability, melee access to bosses, and moving-fight Warrior/Rogue uptime.
