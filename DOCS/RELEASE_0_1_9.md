# JAC Works 0.1.9: Ant Queen, close-range Warden, deeper talents and Royal Chitin gear

**Status:** Prototype release candidate (merge only after passing GitHub CI).
**Related decision:** [ADR-0016](ADR/0016-ant-queen-objective-and-extended-builds.md).

## Ant Queen: new northern Nest arena

The new **Nest** encounter circle and pedestal are on the northern side of the Sanctum Hub. When the unanimous room vote succeeds, players enter an earthy ant cave. The procedurally generated scene includes a large crowned queen at the north, ant mounds, stalagmites, cave-wall boulders and dark tunnel openings, with smaller worker ants and noticeably larger Royal Guards.

| Mechanic | Prototype rule |
| --- | --- |
| Queen | 1,200 HP, cannot be damaged by players or their abilities directly |
| Royal Guard | 240 HP, 20 contact damage, only one active |
| Royal death | Damages queen for 300 once, four Royal deaths win |
| Worker wave | Up to eight 42-HP ants (7 contact damage); first wave 1.25 s; repeats every 9.5 s |
| Swarm cap | 24 living workers; queen can continue sending waves until the objective is complete |
| Rockfall | Begins after 6.5 s, repeats every 12.5 s; 2–4 impact circles |
| Rockfall warning | 1.75 s, radius 2 per rock; impact deals 26 through normal mitigation |
| Reward | 1 Royal Ant Chitin per victory, one shared talent point on first unique Ant Queen clear |

The queen is excluded from normal automatic target selection, but remains a visible boss with an HP indicator. All attacks, direct damage and indirect damage obey the server immunity check; killing only small workers cannot win the fight. The shared protocol communicates Royal Guard deaths, worker waves and rockfall telegraphs to every connected client.

## Hard Warden: Collapse In

Hard Warden now periodically demands closeness rather than cover. At roughly 14 seconds, then every 16 seconds, a **2.7-second** warning shows a red region outside a **4.3-unit** green safe circle centered on the Warden. Players outside the safe zone at impact take **46 damage**, once per cast, through their existing defense and shield mechanics. A **GET CLOSE!** countdown appears beside the boss title. Normal Hard Warden sweep/scatter are retained.

## HP bars

Player HP bar backgrounds and fills are anchored to a dedicated south-facing transform. They retain full horizontal width even when player avatars turn east or west. Other character visuals and movement direction are unchanged.

## Class talent trees: 40 → 56 visible nodes

Every class keeps the original **Unyielding Force** root and now has two real prerequisite branches of **three** nodes each, not two. These **16 new rank-3 leaf talents** are added at the ends of existing paths:

| Class | Branch A leaf | Branch B leaf |
| --- | --- | --- |
| Shaman | **Funeral Bloom:** Totem expiry/death explosion heals allies within 3 for 10 | **Storm Rebound:** Earth Shock reaches a third distinct enemy for 10 |
| Defender | **Shield Reprieve:** Heroic Shield cast on someone else heals caster for 10 | **Thunder Shell:** Bulwark retaliation rises to 20 damage and radius 4 |
| Rogue | **Ripple Stab:** a rear Backstab also hits a second close enemy for 18 | **Venom Catalyst:** Poison Enchant ticks gain 4 damage |
| Warrior | **Meteor Wake:** Charging Stab impact wave deals 22 damage over radius 3 | **Battle Ward:** Guard shields one nearby ally for 20 over 2 s |
| Priest | **Aegis Mend:** Targeted Heal grants the target 15 shielding for 5 s | **Dawn Flare:** Holy Light also deals 15 damage around the enemy in radius 2 |
| Lightning Mage | **Arc Surge:** third lightning-chain jump gains 15 damage | **Storm Shelter:** completed Lightning Storm shields nearby allies for 15 over 4 s |
| Ranger | **Third Ricochet:** Aimed Shot ricochets to a third target for 12 | **Rain of Mercy:** Arrow Rain waves each heal allies inside for 5 |
| Fire Mage | **Solar Flare:** LAZOR deals an extra 18-damage radius-2 blast at first target | **Blazing Horizon:** Ember Afterglow grows from radius 3 to 4 without extra damage |

Every rank needs the immediately preceding prerequisite, validated in shared authoritative code; the user cannot fabricate points, change to another class's talents, or unlock a distant leaf without its path. Free respec and old save compatibility remain. There are now ten possible first-clear points after the Ant Queen's addition.

## Eight Royal Ant Chitin crafting items

Every recipe consumes **one Royal Ant Chitin** plus the second material below. Items remain class-restricted and occupy ordinary equipment slots. They change how existing class skills work, not only base damage.

| Class | Item (slot) | Other ingredient | Server-side skill mutation |
| --- | --- | --- | --- |
| Shaman | **Brood Totem** (offhand) | Corrupted Truffle Spore | Each Fire Totem attack strikes a second enemy within 5 of the target for 10 |
| Defender | **Carapace Shield** (offhand) | Large Cylinder | Heroic Shield adds 20 self-absorb and 10 main-ally absorb |
| Rogue | **Mandible Dagger** (weapon) | Conical Taper | Backstab gives its target two delayed 8-damage wound ticks |
| Warrior | **Ant-Leg Greaves** (boots) | Large Sphere | Charging Stab creates a 20-damage, radius-2.5 impact pulse |
| Priest | **Pheromone Chalice** (offhand) | Spherical Ball | Holy Light additionally heals the most damaged living ally nearby for 10 |
| Lightning Mage | **Antenna Spindle** (offhand) | Cylinder Tube | Arc Blast and Arc Spear add 16 damage to a second enemy in range |
| Ranger | **Brood Quiver** (offhand) | Corrupted Truffle Spore | Split Shot applies two 5-damage venom ticks to each struck enemy, **once per volley**, not once per arrow |
| Fire Mage | **Molten Chitin** (offhand) | Large Cylinder | Fire Mine leaves two 6-damage delayed ember pulses, separate from any existing Ember Afterglow talent |

The specific crafting identity of Chitin is new to this update. The material drops after defeating the queen, **not** after killing each individual guard. Existing inventory, craft receipt validation, slot ownership and class restrictions are preserved.

## Source library provenance

The canonical [JAC Works Ability Idea Library](ABILITY_IDEAS/JAC_Works_Ability_Idea_Library.md) contains 182 draft ideas. The following entries were directly reviewed as **motifs**, not automatically accepted implementation requirements:

- **IMP-01-E01, Meteor Charge**: a kinetic blast at charge arrival. Adapted into the modest Ant-Leg Greaves impact and Meteor Wake talent.
- **IMP-02-E02, Overdrive** and **ECL-01-E02, Glacial Echo**: a split or delayed follow-up hit. Used as conceptual inspiration for Mandible Dagger's tightly bounded two wound ticks, not copied skill values.
- **SOL-01-E01, Corona Volley**: forked bolts seeking other nearby targets. Informed Storm Rebound, Brood Totem and Antenna Spindle target count limits.
- **GEN-02-E03, Last Stand** and **GEN-03-E02, Rejuvenating Orbit**: ally support/rescue and healing-over-time motifs. The rank-3 shield/heal designs are original smaller adaptations, **not** a lethal-damage rescue or the original six-second Vital Cascade.
- **SOL-04-E03, Dying Star** and **VOI-03-E02, Rift Echo**: scheduled follow-up effects and small-area secondary hits. Informed limited splash/DoT ideas without summoning Cinder Familiar or copying Phase Slip.

Original designs requested in this round: royal-death-only Ant Queen, cave environment, bounded worker pressure, close-to-Warden damage check, HP-bar orientation, the Royal Ant Chitin gear set as a whole, and every class's specific rank-3 adaptation. The library remains a **draft browsing resource**; untouched entries have not become decisions.

## Compatibility and verification

- Shared network/version **0.1.9**; new boss ID antQueen, the Nest difficulty region, material antChitin, worker and royal add kinds, optional queen wave/progress fields and Hard Warden call snapshot.
- No new login, Cloudflare database or persistent account system. Existing room voting, first clears, rewards and browser-local inventory/progression continue as before.
- New tests validate all 16 new talent prereqs and class trees, all eight new gear recipes/effects, Ant Queen immunity and exactly four Royal deaths, wave limits, rockfall hit behavior, Hard Warden near/far damage, and mathematical south-facing bar transform.
- Browser tests verify the new Nest selector, live multiplayer worker/royal/rockfall snapshots, and that Hard Warden loads with no browser errors; the precise close-range hit is verified by server tests because stationary solo characters may wipe before the cast.
- Release gates: production build, all shared unit tests, multiplayer socket smoke, and full Chromium Playwright suite, followed by reviewed PR. **Green feature CI does not itself guarantee main/production deployment.**

Human playtest to tune: Royal Guards' 240 HP, worker cap24, queen clear pace for solo/4 players, cave sightlines, ranged target accessibility, rockfall dodge space, and the Hard Warden's 4.3 radius.
