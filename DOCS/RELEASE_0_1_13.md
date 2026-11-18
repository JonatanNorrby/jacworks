# JAC Works v0.1.13: Full Chaos mechanics and Warrior DPS balance

**Date:** 2026-11-18
**Status:** Prototype release
**Design decision:** [ADR-0019](ADR/0019-chaos-boss-mechanic-parity-and-warrior.md)
**Previous baseline:** v0.1.12 on main

## Chaos Arena: five complete boss encounters at once

The first Chaos Arena build mistakenly moved three stationary bosses through generic minion chase AI and shortened some of the original boss kits. This release makes each Chaos champion behave like its normal encounter in the shared five-boss room.

| Boss | What it does | Movement |
| --- | --- | --- |
| Warden | Normal marked blast, line sweep and all-player scatter. Live facing/nose direction. | **Immobile** at (-12, 0) |
| Yellow Ball | Normal roll, bounce and half-HP split, including independent dangerous children | Mobile via existing ball physics |
| Truffle Man | Chase, telegraphed slam, normal delayed poison clouds and mushroom summons every third smash | Mobile, dedicated chase and smash motion |
| Fracturer | Marked blast, line attacks, party scatter, four sequential collapsing corners and the one-safe-direction cardinal eruption | **Immobile** at (12, 0) |
| Ant Queen | Workers in waves, Royal Guards, four guard-death objective hits and rockfall | **Immobile** at (0, 15) |

All five attack simultaneously, not in sequence. The encounter remains the set of **normal** base bosses, not their Hard variants. Ant Queen stays immune to normal attacks. All Yellow Ball fragments must be killed. The shared reward remains one Chaos Sigil and one unique first-clear point.

### Floor access and hazard readability

Fracturer now has its collapsing corners restored inside Chaos. The warning/void tiles scale with the large floor, leaving a **5.5-unit central axial corridor**. Warden, Fracturer and Queen sit on those open corridors so melee characters can keep reaching them when corners disappear. The arena floor contrast is improved to make danger tiles readable.

Champion bodies are solid. Only actual minions chase through the generic minion AI; Yellow Ball uses rolling/bouncing physics and Truffle Man uses its intended chase behavior. A dying champion cancels its queued mechanics. Defeating Fracturer reopens the floor and clears cardinal warnings. Defeating Truffle stops poison marks/clouds and subsequent slams.

## Warrior damage audit

The repeatable **30-second, no-gear, stationary target, perfect-uptime** benchmark measured:

| Class | Previous ideal DPS | New ideal DPS |
| --- | ---: | ---: |
| Warrior | 53.5 | **72.2** |
| Rogue | 104.0 | 104.0 |
| Fire Mage | 92.3 | 92.3 |
| Ranger | 74.1 | 74.1 |
| Defender | 36.3 | 36.3 |

Warrior's damage rises approximately **35%**. Sword Slash increases **38 to 50**, and Charging Stab increases **60 to 85**. Cooldowns remain 1.1 and 3.6 seconds. Guard still grants 75% mitigation and two-second forced taunt, and existing equipment/talent modifiers are unchanged. The benchmark's nine-point Warrior talent build produces **81.1 DPS**.

The intent is a worthwhile frontliner who still falls below melee DPS specialist Rogue. Real DPS while avoiding boss mechanics will be lower and should be reviewed in multiplayer playtests.

## Validation and compatibility

- Added server tests for every Chaos boss's actual attack types, movement or immobility, Fracturer's four corners and cardinal eruption, Yellow Ball's physics and split, Queen immunity/guards/rockfall, Truffle poison/mushrooms and canceled attacks.
- Added an actual Chromium multiplayer-browser test to verify the five champion positions, Warden and Fracturer warnings arriving over WebSockets and rendered health UI.
- Updated shared numeric values, tooltips, and existing Warrior hit-damage unit assertions. No item save or progression schema changes.
- Existing combat, gear, talent, client, multiplayer and smoke regression tests remain mandatory.
- All damage values and the simultaneous encounter's difficulty remain subject to actual cooperative playtesting.
