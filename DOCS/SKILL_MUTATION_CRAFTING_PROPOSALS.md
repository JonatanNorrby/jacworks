# Skill Mutation & Crafting Proposals (DRAFT — NOT APPROVED)

**Status:** Design suggestions for Axel, Jonatan, Chris, and coding agents. **Do not implement automatically.** Obtain design approval before changing game rules, class kits, slots, recipes, or progression. This is a proposal document, not an accepted ADR.

## Fundamental direction

JAC Works is a cooperative boss-rush RPG with a compact action bar. Crafted equipment should primarily **change what an ability does**, not give generic +X% damage. The design question for each item: *What can I do now that I could not do before?* Examples: redirect a spell, alter targeting, swap an ability, change cast mode, summon extra deployables, or add party utility.

**Bosses are currently placeholder shapes.** Cylinder, sphere, cone, and any hypothetical fourth shape have **no bearing on future art, lore, skill effects, equipment naming, or thematic identity**. Keep existing code IDs/material labels until a deliberate migration is designed. Do not theme items around geometry merely because the prototype boss is geometric.

Assume **four base bosses, each with a hard mode** (eight drops) when planning the crafting economy. The fourth boss and hard versions not already implemented are hypothetical, not feature commitments.

## Material shorthand (for proposal recipes only)

| Code | Prototype drop / source | Status |
|---|---|---|
| W | Cylinder Tube — Warden | Existing |
| HW | Large Cylinder — Hard Warden | Existing |
| Y | Spherical Ball — Yellow Ball | Existing |
| HY | Large Sphere — Hard Yellow Ball | Existing/planned in current branch |
| G | Conical Taper — Green Cone | Existing |
| HG | Hard Green Cone material | Hypothetical |
| F | Fourth base boss material | Hypothetical |
| HF | Hard fourth boss material | Hypothetical |

**Crafting principle:** Most recipes use **exactly three total materials**, allowing 3 of one, 2+1, or 1+1+1. A few rare capstones may use more. The recipes below are suggestions and **must not silently replace existing recipes** (Primitive Wand, Pointy Hat, Pointy Orb, Redtube Armour). Class/skill availability and slot compatibility need validation against current source before implementation.

## Skill mutation brainstorm by class

### Warrior
- **Serrated Cleave:** Wide Cleave applies Bleed to all enemies hit.
- **Blood Harvest:** Wide Cleave consumes Bleed stacks for self-healing.
- **Whirlwind:** Wide Cleave becomes a 360-degree spin with shorter reach.
- **Executioner's Arc:** Narrower Cleave, stronger execute against low-HP targets.
- **Unstoppable Charge:** Gap-closer charges through ordinary slows and knocks aside enemies.
- **Rallying Cry:** Defensive ability becomes a short-range party damage-reduction cry.

### Priest
- **Shared Mend:** Mend heals the target and a nearby injured ally at reduced potency.
- **Prayer of Renewal:** Mend becomes healing over time instead of immediate healing.
- **Divine Intervention:** Delayed large heal after marking an ally.
- **Purifying Light:** Holy skill can remove a debuff from allies or buff from enemies.
- **Sanctuary:** Protective skill becomes a stationary group damage-reduction zone.
- **Martyr's Bond:** Healing an ally damages a nearby enemy at a small personal HP cost.

### Lightning Mage
- **Blizzard:** Lightning Storm is replaced by Blizzard, dealing cold damage and slowing.
- **Thunder Prison:** Lightning Storm becomes a smaller field that briefly stuns enemies trying to leave.
- **Storm Chaser:** Lightning Storm follows its target.
- **Chain Reaction:** Chain Lightning reaches additional targets with falloff.
- **Overload:** Chain Lightning stops chaining and instead strikes one target repeatedly.
- **Ice Block:** Replace Dash with a stationary, action-locking temporary invulnerability.
- **Static Discharge:** Mobility skill emits lightning around the landing position.

### Ranger
- **Endless Volley:** Aimed Shot charges indefinitely while held and fires an arrow every **0.8 seconds**; moving cancels the channel. Explicitly define resource cost, hold/release input, retargeting and damage balance.
- **Sniper's Patience:** Longer Aimed Shot charge for range and power; movement interrupts.
- **Splinter Shot:** Aimed Shot fires three arrows in a spread.
- **Pinning Arrow:** Fully charged Aimed Shot briefly roots.
- **Ricochet Arrow:** Aimed Shot seeks a second target after impact.
- **Explosive Tip:** Aimed Shot explodes in an area.
- **Rolling Escape:** Dash becomes a shorter dodge roll with brief invulnerability.

### Fire Mage
- **Lobbed Fireball:** Fireball becomes an **arcing ground-targeted projectile** that can pass **over pillars/cover**, then explodes at the target location. It should not arbitrarily ignore all obstacles or arena boundaries.
- **Living Flame:** Fireball leaves a burning patch.
- **Cluster Fireball:** Fireball breaks into three smaller impact explosions.
- **Flamethrower:** Replace Fireball with a channeled frontal cone.
- **Meteor:** Replace Fireball with a delayed large AoE impact.
- **Phoenix Dash:** Dash leaves a burning trail.
- **Cauterize:** Fire damage-over-time can instead target allies as healing-over-time (requires careful target-mode rules).

### Defender
- **Refracting LAZOR:** LAZOR splits/refracts into weaker beams after striking enemies or cover; cap beam count and ensure pillars remain meaningful.
- **Sweeping LAZOR:** LAZOR becomes a steerable channeled beam.
- **Piercing LAZOR:** Narrower LAZOR passes through enemies.
- **Guardian Bulwark:** Bulwark also protects nearby allies.
- **Reflective Bulwark:** Bulwark reflects some incoming damage.
- **Fortress Mode:** Bulwark roots the Defender in exchange for stronger mitigation/knockback immunity.
- **Sacrificial Guard:** Bulwark redirects part of a selected ally's incoming damage to the Defender.

### Rogue
- **Contagious Poison:** **Poison Enchant can target allies**, enchanting their attacks.
- **Fleet Venom:** Poison Enchant also **increases the enchanted player's movement speed**.
- **Paralytic Venom:** Replace poison damage with a stacking slow.
- **Explosive Venom:** Poisoned enemies explode on death, spreading poison.
- **Shadowstep:** Dash becomes a short teleport that passes through pillars.
- **Smoke Bomb:** Replace Dash with a smoke field that conceals allies inside.
- **Ambush:** Backstab is stronger from stealth and weaker outside stealth.

### Shaman
- **Totemic Legion:** Permit **multiple simultaneous Healing Totems** (suggest up to three) with reduced healing per totem; avoid uncapped stacking.
- **Ancestral Totem:** Healing Totem becomes a larger persistent healing field with a longer cooldown.
- **Spirit Link:** Healing Totem redistributes some damage among allies in range.
- **Volatile Totem:** **Fire Totem explodes when it dies** or expires.
- **Flamecaller:** Fire Totem attacks faster but is more fragile.
- **Walking Totem:** Fire Totem follows its caster.
- **Earthbind:** Earth Shock becomes an AoE slow rather than single-target burst.

## Proposed three-material recipes — normal tier

| Proposed item | Cost | Mutation |
|---|---|---|
| Serrated Greatsword | W + G + G | Wide Cleave applies Bleed |
| Whirlwind Axe | Y + Y + W | Wide Cleave becomes a spinning attack |
| Prayer Beads | W + F + F | Mend becomes heal-over-time |
| Stormglass Staff | Y + F + G | Lightning Storm becomes Blizzard |
| Longbow of the Watcher | G + G + Y | Aimed Shot fires repeatedly every 0.8s while held |
| Siegecaster's Staff | W + F + Y | Fireball becomes a lobbed arc over cover |
| Guardian's Crest | W + W + F | Bulwark protects nearby allies |
| Viper's Gloves | G + G + F | Poison Enchant can target allies |
| Fleetfoot Charm | Y + Y + G | Poison Enchant grants movement speed |
| Totemkeeper's Mask | F + W + Y | Multiple Healing Totems simultaneously |
| Volatile Fetish | F + F + G | Fire Totem explodes on death/expiry |
| Frostbound Boots | F + F + Y | Dash replaced with Ice Block |

## Proposed three-material recipes — hard tier

| Proposed item | Cost | Mutation |
|---|---|---|
| Bloodreaver | HG + G + HW | Wide Cleave consumes Bleed for healing |
| Oath of Sacrifice | HW + HW + F | Bulwark redirects damage from an ally |
| Tempest Crown | HY + HF + Y | Lightning Storm follows its target |
| Thunderheart | HY + HY + G | Chain Lightning becomes repeated single-target strikes |
| Sniper's Covenant | HG + HG + Y | Aimed Shot becomes a large charged sniper attack |
| Meteorcaller | HF + HF + W | Fireball becomes Meteor |
| Prism of Judgment | HW + HY + HF | LAZOR refracts |
| Fortress Heart | HW + HW + HG | Bulwark becomes Fortress Mode |
| Plaguebearer's Fang | HG + HG + F | Poison spreads on death |
| Shadowwalkers | HY + HG + Y | Dash becomes a teleport through cover |
| Ancestral Idol | HW + HF + F | Healing Totem redistributes party damage |
| Infernal Effigy | HY + HF + HG | Fire Totem becomes mobile |

These are **not** a final economy, and many proposed crafts currently depend on hypothetical fourth-boss drops. Before shipping, check how players acquire each material and whether every class has accessible early choices.

## Combining mutations: suggested rules

- **Augments** can stack when compatible: e.g. Lobbed Fireball + Living Flame (arc over pillars, then leave a burning patch); ally-targetable Poison Enchant + Fleet Venom (buff the ally's movement); extra Healing Totems + Ancestral Totem (with reduced per-totem power).
- **Replacements** are mutually exclusive for the same skill: Fireball cannot be both Flamethrower and Meteor; Dash cannot simultaneously become Ice Block and Shadowstep.
- Explicitly document priorities for target selection, friendly targeting, projectile collision/cover, damage attribution, cooldowns, resources, death/expiration triggers, multiplayer synchronization, and visual telegraphs.
- Cap chained effects, extra beams/projectiles, overlapping fields, summons, and proc recursion. Keep boss telegraphs legible for four players.
- Do not assume these mutation names exactly match current skill identifiers. Verify current kits before implementation.
- Prefer 80% memorable skill-changing gear and 20% simpler equipment as a **directional goal**, not a fixed quota.
- Balance changes around coordinated four-player boss mechanics, not just solo DPS. Party protection/healing mutations should be as compelling as damage mutations.

## Agent guidance / next decisions

1. Review the current class kits and item slots; map every proposal to real skill IDs and supported targeting/collision rules.
2. Choose the fourth boss's actual gameplay identity independently of its placeholder geometry.
3. Approve a small first batch of mutation recipes and decide whether class-specific items can occupy universal slots.
4. Define conflict groups and stacking semantics in data, rather than scattered hard-coded conditionals.
5. Add server-authoritative tests for modified abilities, multiplayer spectators/players, save compatibility, and cross-client visuals.
6. Write an ADR for accepted architectural changes; **this draft does not supersede existing ADRs**.

**Design north star:** crafted gear should make players say, *“My Fireball can go over that pillar now,”* rather than *“My Fireball does 8% more damage.”*
