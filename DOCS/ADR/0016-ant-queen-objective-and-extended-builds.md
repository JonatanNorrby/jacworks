# ADR-0016: Ant Queen objective encounter, readable health bars and extended builds

**Status:** Accepted for Prototype 01 experimentation. Balance values remain provisional.
**Date:** 2026-11-18
**Related:** ADR-0002 through ADR-0006, ADR-0013, ADR-0015, Prototype 01 and release 0.1.9.

## Decision

**Ant Queen objective encounter.** A separate Nest ring and boss pedestal sit in the northern hub. The queen appears at the northern end of her own ant cave, modeled procedurally with earthy ground, rock walls, stalagmites, tunnel mouths, nests, worker ants, Royal Guards and a crowned queen. There are no new third-party assets.

The queen has **1,200 HP and is completely immune to direct or periodic damage from abilities, items, area effects, turrets and client attacks**. Only an actual Royal Guard death reduces her HP, by exactly **300**, and no Royal Guard can trigger twice. Four defeats win the encounter. Each Guard has 240 HP and 20-damage contact attacks. Waves contain up to eight 42-HP workers dealing seven contact damage, with a maximum population of 24 living workers. The first wave occurs 1.25 seconds after the pull and new waves arrive 9.5 seconds apart. One living Guard can exist at a time. Normal auto-target selection ignores the invulnerable queen so players can focus the ants.

**Rockfall.** The queen periodically triggers two to four 2-unit-radius warnings, beginning at 6.5 seconds and repeating every 12.5 seconds. Rocks land 1.75 seconds after the mark for 26 damage in each circle through the normal mitigation/shield path.

**Hard Warden Collapse In.** After an initial 14-second delay and then every 16 seconds, the Warden announces an inverse-range mechanic with a 2.7-second warning. A green 4.3-unit-radius zone around the Warden is safe; players farther away take one 46-damage hit. Existing pillar cover, scatter and boss attack rules stay.

**South-facing health bars.** The HP bar is parented to an independent transform that counter-rotates its character mesh. The bar remains front-facing south despite character movement yaw; player models, gear, noses and attack directions continue rotating normally.

**Progression.** The Ant Queen adds one additional unique first-clear talent opportunity (ten total), and each full victory awards one new Royal Ant Chitin receipt. Respec is still free; persistence remains browser-local. Each existing class tree now has two length-three prerequisite branches and its original purchasable root: seven talents per class, 56 total. Old talent IDs, earned wins, equipment and crafting receipts remain valid. Eight class-specific, skill-changing items consume one Royal Ant Chitin plus one existing material. No new gear slots are introduced.

## Why

The Ant Queen rewards target priority and coordinated party movement rather than boss-DPS tunneling. The invariant that only Royal Guard deaths damage the queen is enforced in the authoritative shared server simulation, including against forged damage and delayed effects. The existing arena mechanic library remains usable. The Hard Warden's get-close mechanic adds the positional inverse of his existing pillar-cover sweep. Bar readability improves without changing player-facing or combat physics.

## Boundaries and safeguards

- One guard death equals one fixed queen damage event; direct target, DoT, beam, chain, area, retaliation, and turret damage must never bypass immunity.
- Worker kills do not affect queen health, and worker count is capped to protect active rooms.
- Boss state and warnings are carried in snapshots for shared gameplay and late joins; rendering only visualizes authoritative state.
- No account or D1 migration, forced grinding beyond one point per first clear, new matchmaking, or permanent late-game class power decisions.
- The canonical 182-entry Ability Idea Library remains DRAFT source material. Specific inspirations and adaptations are recorded in release 0.1.9; this decision does not accept unused ideas.
- The numerical values, visual direction, and class mutations are prototype choices requiring 1–4 player playtests. They are not final balance commitments.

## Follow-up

Verify a full four-Guard kill and win from one to four players; balance initial worker pressure, Royal Guard uptime, support throughput and rockfall cadence. Check that the queen and her children are visible and targetable without lag. Retain revision history through new ADRs if the encounter's fundamental objective changes.
