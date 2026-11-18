# JAC Works 0.1.6: Branching talents and dual-encounter mutations

**Status:** Feature branch implementation pending complete verification and PR review, 2026-11-18.

## Goals and constraints

- **Eight classes, five talent nodes each:** forty visible nodes total; 32 branch nodes, of which 30 are new and Shaman's two existing nodes are preserved.
- Each tree forks into **two branches** from **Unyielding Force**. In the UI, a central root drops into a visible horizontal fork; downward vertical lines and arrowheads lead to individual children. Horizontal scroll preserves the graph on narrow screens.
- Unyielding Force starts at **0/1** and costs one point in each class. Talent allocation remains server-validated. Nine unique encounters give at most nine points shared across classes. A player's first clear counts once; no extra points from repeating a boss. Free class respec refunds that class's points without undoing wins.
- Eight **new class-specific** gear recipes, each requiring a dual-boss material, and each modifying the behavior of an existing skill. Gear is stored in the existing browser inventory and validated on joins. No new account system.
- Existing Shaman expiry explosions, items and saved IDs are preserved.

## Talent tree specification

Notation: **A → B** means the first talent is a prerequisite of the next. Both rows below begin after the class's purchasable Unyielding Force root.

| Class | Branch A | Branch B |
| --- | --- | --- |
| Shaman | Parting Gift → Violent Farewell | Storm Conduit → Living Current |
| Defender | Guardian Network → Sheltered Hearts | Iron March → Retaliatory Shell |
| Rogue | Shadow Ambush → Shadowstep | Contagion → Devouring Venom |
| Warrior | Piercing Charge → Impact Wave | Cleaving Arc → Defiant Guard |
| Priest | Healing Cascade → Sacred Echo | Expanding Nova → Avenging Light |
| Lightning Mage | Forked Arc → Arc Overload | Storm Well → Storm Aftershock |
| Ranger | Split Volley → Ricochet Arrows | Rain Surge → Last Downpour |
| Fire Mage | Prism Beam → Searing Beam | Volatile Mines → Ember Afterglow |

### Shaman
- **Parting Gift** (existing): Fire and Healing Totems explode for 30 damage in a 3-unit radius on natural expiration.
- **Violent Farewell** (existing): the same explosion also occurs when destroyed early; replacing/removing a totem does not count as destruction.
- **Storm Conduit:** Earth Shock adds an 18-damage jump to the nearest second enemy within 5 units of its target, respecting line of sight.
- **Living Current:** Earth Shock heals the most injured nearby living ally for 12, within 5 units of the struck target.
- **Inspiration:** Chain Tempest (SOL-06), Guardian Network (GEN-02-E01), totem expiry chain already accepted in 0.1.5.

### Defender
- **Guardian Network:** Heroic Shield shares an additional 20-HP absorb with the nearest third ally within 4 units of the primary shielded ally (if present). Self and primary shields are unchanged.
- **Sheltered Hearts:** Heroic Shield restores 12 HP to the main target on cast.
- **Iron March:** Bulwark movement becomes 75% of normal, instead of 50%; existing mitigation and duration are unchanged.
- **Retaliatory Shell:** an incoming hit during Bulwark, including a hit absorbed by a shield, causes 12 area damage to enemies within 3 units; a 1-second internal cooldown prevents uncontrolled feedback.
- **Inspiration:** Guardian Network/Retaliation (GEN-02-E01/E02), Kinetic Rampart (IMP-06).

### Rogue
- **Shadow Ambush:** a genuine rear Backstab deals 20 extra damage (front-angle damage stays unchanged).
- **Shadowstep:** entering Vanish refills one Dash charge if none is available.
- **Contagion:** a Poison Enchant stab inflicts two extra poison ticks on a second target within 3 units of the stabbed enemy (normal initial poison remains).
- **Devouring Venom:** each actual poison tick restores 2 HP to the Rogue, without overhealing.
- **Inspiration:** Shadow Ambush (VOI-03-E01), Contagion/Devouring Pact (VOI-02-E01/E03).

### Warrior
- **Piercing Charge:** Charging Stab deals 22 to enemies in its travel corridor on top of the original endpoint stab. World collision and pillars still stop movement.
- **Impact Wave:** Charging Stab also deals 18 damage in a 2.5-unit area at its end position.
- **Cleaving Arc:** Sword Slash becomes a broader cone reaching 3.7 units; Redtube Armour's existing reach/wide-swing is preserved.
- **Defiant Guard:** Guard restores 10 HP on activation, without overheal.
- **Inspiration:** Piercing Charge and Meteor Charge (IMP-01-E03/E01), Twin Arc (IMP-02-E01).

### Priest
- **Healing Cascade:** Targeted Heal heals other living allies within 4 units of its initial target for 12 each.
- **Sacred Echo:** Targeted Heal on someone other than the caster also heals the caster for 8.
- **Expanding Nova:** Holy Nova radius increases from 4.5 to 5.5 for healing and roughly 4.2 to 5.2 for enemy damage; healing per target rises from 18 to 22.
- **Avenging Light:** Holy Light also heals the most injured ally within 5 units of its target for 12.
- **Interaction:** Shadow Hat turns Targeted Heal into offensive damage, so the heal-only Cascade/Echo passives do not cause unwanted heals during the converted attack.
- **Inspiration:** Double Cascade (GEN-03-E01), Second Heart (GEN-01-E02), Mercy Bloom (GEN-04-E02).

### Lightning Mage
- **Forked Arc:** Arc Blast or Arc Spear arcs from its first target to the nearest second within 5 units for 40% of the initial skill's damage.
- **Arc Overload:** the fork can jump once more to a third distinct target for 20% of initial damage.
- **Storm Well:** Lightning Storm's six ticks reach 4 units instead of 3.
- **Storm Aftershock:** a completed Lightning Storm channel ends with an extra 30-damage pulse over the same radius. Interrupting the channel prevents the final burst.
- **Inspiration:** Chain Tempest (SOL-06), Thunderhead (SOL-01-E02), Fracture Chain (ECL-01-E03).

### Ranger
- **Split Volley:** Split Shot adds two outward angled 16-damage arrows, including when another quiver already changes its central shots.
- **Ricochet Arrows:** a successful Aimed Shot hits one additional enemy within 4 units of the primary target for 20; no bounce occurs on a missed or blocked shot.
- **Rain Surge:** Arrow Rain gains a fourth wave dealing 22 damage.
- **Last Downpour:** Arrow Rain's final wave has 1 additional unit of radius.
- **Inspiration:** Split Lance (SOL-02-E03), Fracture Chain (ECL-01-E03), Glacial Barrage (ECL-04-E01).

### Fire Mage
- **Prism Beam:** LAZOR adds two outward beams, dealing 20 damage each to intersected enemies.
- **Searing Beam:** LAZOR applies two 8-damage burn ticks; when an item grants a longer burn, do not truncate it.
- **Volatile Mines:** Fire Mine trigger range increases from 2 to 2.7, explosion radius from 3 to 4; damage remains 95.
- **Ember Afterglow:** an activated Mine leaves three additional 8-damage pulses in a 3-unit radius, one per second.
- **Inspiration:** Split Lance (SOL-02-E03), Burning Ground/Solar Aftershock (SOL-03-E02/E01).

## New equipment and recipes

These are class-restricted; crafting uses current first-clear material receipts, and items remain reusable.

| Class | Equipment (slot) | Recipe | Skill mutation |
| --- | --- | --- | --- |
| Shaman | Twin Totem Capacitor (offhand) | 1 Twin Core + 1 Cylinder Tube | Earth Shock commands an active Fire Totem to attack the struck enemy for 20 extra damage; requires a live Fire Totem |
| Defender | Fracture Aegis (offhand) | 1 Fractured Spore + 1 Large Cylinder | Heroic Shield shares 20 absorb with a nearby third ally; stacks to 40 with Guardian Network |
| Rogue | Sporeglass Blade (weapon) | 1 Fractured Spore + 1 Conical Taper | Backstab creates a 24-damage spore explosion 1s later within 2 units of the struck enemy's position |
| Warrior | Twinrush Boots (boots) | 1 Twin Core + 1 Large Sphere | Charging Stab moves up to 7 units instead of 5, still colliding with walls and enemies |
| Priest | Halo of Renewal (head) | 1 Fractured Spore + 1 Large Sphere | Holy Nova leaves a 4-unit zone at its origin healing 5 to allies every second for 3s |
| Lightning Mage | Split Conductor (offhand) | 1 Twin Core + 1 Spherical Ball | Arc Blast/Spear adds a 25-damage fork to one second target within 5 units |
| Ranger | Rotting Fletching (offhand) | 1 Fractured Spore + 1 Corrupted Truffle Spore | Arrow Rain leaves a 2.5-unit spore field that pulses 6 area damage every second for 3s after the rain |
| Fire Mage | Prism Lens (offhand) | 1 Twin Core + 1 Conical Taper | LAZOR becomes two angled 60-damage narrow beams instead of one central 90-damage beam |

### Intended interactions and balance tradeoffs

- **Shared slot choices are deliberate:** a Ranger chooses between Sporefang, Sporestorm, Splitthorn and Rotting Fletching. A Shaman chooses among Sporebound, Verdant Mender and Twin Capacitor. A Fire Mage chooses the burn-enhancing Pointy Orb versus Prism Lens.
- **Talents remain independent of gear.** Forked Arc and Split Conductor both trigger, creating separate damage contributions to the same second target. Guardian Network and Fracture Aegis combine their shield contributions; both demand a third ally.
- **No infinite compounding loops.** Chained attacks stop after the prescribed target count; lingering effects have fixed pulses and expiry. Mine afterglow cannot spawn another mine. Poison heals cap at missing HP.
- **Avoid unintentional attack power creep:** consider DPS/HPS meter and solo-versus-party balance when tuning, especially Fire Mage beam overlaps, AoE encounters, and Priest sustain.

## Data, compatibility and validation

- Existing class IDs, Skill IDs, previous gear, receipt IDs, save keys and nine encounter IDs stay unchanged.
- The server validates every talent, its full ancestry, global point budget and class-specific equipment. Saved arrays are normalized even if child talents precede parents in serialization.
- Effects run in the shared simulation used by local multiplayer and Cloudflare Durable Objects. Gear/status remains in the existing room snapshots; no new client-authoritative damage.
- Cover/line-of-sight and channel interruption rules remain in force. Additional ability visuals use the existing authoritative `abilityFx` packets.
- Source inspirations are **adaptations** of indexed draft concepts, not proof that those original library designs have become approved wholesale.

### Verification checklist

1. `npm run build` and all `npm test` shared tests, including new `release-016-talents-items.test.ts`.
2. `npm run smoke` (combat/votes/room/Truffle WebSocket checks).
3. Browser release suites including `release-016-talents-gear.spec.ts` verifying 8 class tabs, 2 branches, 5 nodes, and CSS arrow connectors.
4. Human 1–4-player playtest of new ability paths and crafting; verify deployed Worker and client both display 0.1.6 before calling it live.

**Deferred:** cloud accounts/D1 progression, matchmaking, final class count, complete-game progression and permanent balance commitments.
