# JAC Works v0.1.10: The Bigger Nest and Fourth-Tier Talents

**Status:** Prototype release; balance provisional.
**Decision record:** [ADR-0017](ADR/0017-nest-layout-gear-slots-and-fourth-talents.md).

## Gear slots are no longer all offhand

Previous v0.1.9 Royal Ant items are now distributed across **three different equipment slots**:

| Class | New displayed item name | New slot | Effect | Save compatibility |
| --- | --- | --- | --- | --- |
| Shaman | **Brood Totemstaff** | **Weapon** | Fire Totem attacks strike one additional nearby enemy for 10 damage | Existing `broodTotem` offhand moves to weapon when free |
| Defender | **Royal Carapace Plate** | **Armour** | Heroic Shield gains +20 self absorb and +10 ally absorb | Existing `carapaceShield` offhand moves to armour when free |
| Ranger | **Brood Quiver** | **Offhand** | Split Shot applies two 5-damage poison ticks per target, once per volley | Remains unchanged |

This gives Shamans the choice to wield a Totemstaff plus an independent offhand; Defenders can wear the plate and choose their preferred offhand; Rangers retain their quiver. Internal IDs remain unchanged to preserve crafted receipts, unlocks and historical saves. An already occupied new slot is **never overwritten** on migration; the craftable item remains owned and can be equipped later. Invalid items in the old slot are not accepted. The Royal Ant Chitin material is now also listed visibly in the inventory's Materials category.

## Nest relocation

The Nest gate has moved **west of Normal, alongside the other three boss circles on the southern row of the Sanctum Hub**. It keeps its own ring, Ant Queen pedestal, boss label and multiplayer vote. No need to walk to the northern edge of the lobby.

## Expanded Nest arena

| Property | v0.1.9 | v0.1.10 |
| --- | --- | --- |
| Ground | 26 × 26 | **32 × 32** |
| Player boundary | 12-unit half-square | **14.5-unit-radius playable circle** |
| Ant Queen location | (0, 8) | (0, **10.5**) |
| Party starting Z | -8 | **-10.5** |
| Cave wall ring | radius about 12 | radius about **15** |
| Worker entrances | x about ±9, z 3 to 8 | x about **±10.4 to ±11.4**, z 3 to 7.4 |
| Royal Guard entrances | x ±2.5, z 5.8 | x **±3.5**, z **7.8** |
| Camera | Normal distance | **17% farther** in Nest, still respects user zoom baseline |

The cave's floor, organic boundary stones, stalagmites, tunnel mouths, anthills and ant models now use the enlarged footprint. Rockfalls are clamped to the circular playable arena rather than the old 12-unit square. Moving and charging into the additional area works on the authoritative server, and ground-targeted abilities can be placed there (subject to their existing 11-unit cast range). All older boss arenas retain their previous 26 × 26 dimensions and boundary rules.

The Queen's victory objective, 1,200 HP, immunity, four Royal Guard kills, guard health, worker cap, damage, wave timings, rockfall timing and unique Royal Ant Chitin reward **are unchanged**. This is a spatial expansion, not a hidden difficulty increase.

## 16 more talents: 72 nodes across eight classes

Each class has the existing purchased **Unyielding Force** root, followed by **two independent prerequisite chains of four nodes each**. The following *new fourth-tier leaves* require the three previous talents on their respective branch:

| Class | Branch A: new leaf | Branch B: new leaf |
| --- | --- | --- |
| Shaman | **Ancestral Shelter:** exploding totems also grant allies nearby a 10-HP shield for 4s | **Storm Mender:** successful third Earth Shock bounce heals the most injured nearby ally for 10 |
| Defender | **Aegis Command:** Heroic Shield on an ally also grants 1.2s of Guard mitigation | **Bulwark Resonance:** retaliation grants nearest living ally (or self) a 10-HP shield for 2.5s |
| Rogue | **Cloak of Thorns:** a rear Backstab grants the Rogue a 15-HP shield for 2.5s | **Toxic Echo:** each Poison Enchant tick deals 3 extra splash damage to one different nearby enemy |
| Warrior | **Seismic Renewal:** Charging Stab impact heals Warrior 5 per enemy struck, maximum 20 | **Guardian Riposte:** Guard also immediately hits a nearby enemy for 12 |
| Priest | **Second Benediction:** Targeted Heal shields one more injured ally close to the original target for 10 over 4s | **Radiant Aegis:** Holy Light shields the nearest living ally by the enemy for 12 over 3s |
| Lightning Mage | **Arc Ward:** a third chain jump grants caster a 12-HP shield for 4s | **Storm Recovery:** completed Lightning Storm also heals allies in final radius for 8 |
| Ranger | **Return Shot:** the third Aimed Shot ricochet returns to hit the original enemy again for 8 if it survives | **Thornfall:** the final Arrow Rain wave leaves two delayed 6-damage poison pulses in its area |
| Fire Mage | **Solar Aegis:** a successful LAZOR grants 15-HP shield for 3s | **Embers of Life:** each talent-created Ember Afterglow pulse that contacts an enemy heals its owner for 4 |

These are not generic percentage bonuses: each adds a conditional defense, heal, projectile return, additional target, or residual attack effect. All triggers and timers are server-owned. Delayed AoE effects are explicitly limited to avoid infinite re-triggering and cannot bypass the Ant Queen's objective-only immunity.

**Point economy remains unchanged:** a maximum of 10 points from 10 different first-clear encounters, with free respec. Unlocking both full branches of a single class uses nine points (one root plus eight branch nodes). Existing saved talents preserve prior IDs, ranks and prerequisites. Expanding the tree does not automatically award points.

## Library and provenance

The 182-entry [Ability Idea Library](ABILITY_IDEAS/JAC_Works_Ability_Idea_Library.md) remains a **draft reference**, not an automatically accepted backlog. This round applies the existing JAC team preference for skill-changing builds (ADR-0003 and ADR-0013). The fourth-tier mechanics are new, limited adaptations created for the current eight class kits, **not direct ports** of Project Energy class abilities or lore. Existing combat balance formulas are unchanged outside the specified conditional mutations.

## Validation

- Unit tests check that the Nest gate is colocated with the other boss circles; the larger Nest-only movement/charge/target limits; equipment slots and old-offhand migration; new class talent prerequisites; and the actual server combat behavior of all sixteen newly added talents.
- All existing gear, boss, talent, HP and progression tests remain in the suite, including the Ant Queen's guard-only damage rule and the Hard Warden's Collapse In.
- New browser regression verifies the Nest encounter can start, the boss's live waves continue, the expanded arena renders with no JS errors, and the new talent branches have nine nodes per class.
- Release gate: `npm test`, `npm run build`, `npm run smoke`, and the full 11+ Chromium tests from GitHub Actions before merge.

Playtest feedback wanted on: **how long the Guard takes to reach players**, whether the outer cave walls read as natural boundaries, how often Rockfall forces movement rather than simply missing the party, and whether the new weapon/armour/offhand combinations offer useful decisions.
