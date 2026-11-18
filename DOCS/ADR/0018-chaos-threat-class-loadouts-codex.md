# ADR-0018: Class equipment profiles, three-role talent trees, threat, Chaos Arena and field guide

**Status:** Accepted for Prototype 01 implementation; balance and discoverability subject to playtesting
**Date:** 2026-11-18
**Supersedes in part:** ADR-0013 (two-branch scope), ADR-0017 (Ranger slot layout only)
**Continues:** ADR-0016 (Ant Queen objective), ADR-0014 (controls), existing save/authority model

## Sources and decisions

This ADR records an explicit user-requested implementation round. The design interviews in `DOCS/DESIGN_INTERVIEW_AXEL.md`, `DOCS/GAME_DESIGN_INTERVIEW_JONATAN.md` and `DOCS/GAME_DESIGN_INTERVIEW_CHRISTOFFER.md` are individual perspectives, not group-approved decisions by themselves. For the Guide, the previously expressed preference for discoveries recorded by playing is adopted as the **explicit new user requirement**. The 182-entry JAC Works Ability Idea Library is draft inspiration, not a binding feature backlog.

## 1. Ranger combinations and class-local outfits

**All five** Ranger-specific skill-changing items now occupy distinct slots, with IDs, crafting materials and ownership receipts preserved:

| Item ID | Visible name | Slot | Ability change |
| --- | --- | --- | --- |
| `sporefangQuiver` | Sporefang Longbow | **Weapon** | Aimed Shot 100 damage but 2 s cast |
| `splitthornQuiver` | Splitthorn Hood | **Head** | Split Shot 5 weaker arrows |
| `broodQuiver` | Brood Quiver | **Offhand** | Two venom ticks per enemy struck by Split Shot |
| `sporestormQuiver` | Sporestorm Cloak | **Armour** | Narrower but higher-damage Arrow Rain |
| `rottingFletching` | Rotting Trail Boots | **Boots** | Arrow Rain also leaves a poison field |

Retain the historical IDs, even though several contain `Quiver` and now describe other gear, so saved purchases remain compatible. Read old offhand placement into the new slot if free; an occupied legitimate slot wins, and the rehomed item remains owned and unequipped.

Each class now owns a **browser-local validated five-slot gear preset** in the existing inventory save. Equip or unequip changes that class's preset. Changing class stores the departing choice, equips the incoming class's last preset (or initializes an empty/compatible starter preset), and revalidates items against crafting receipts, ownership, class and slot. Universal items may appear in multiple class presets as the same owned item, not duplicated inventory. Existing account/cloud persistence is not implied.

## 2. Three meaningful talent branches

Eight classes each have one purchasable **Unyielding Force** root and **three prerequisite chains, each four nodes deep** (13 nodes per class, 104 across eight classes). Existing nodes retain IDs, descriptions and unlocks; a third chain adds 32 new ability mutations. The three paths are differentiated by roles:

| Class | Branch A | Branch B | New Branch C |
| --- | --- | --- | --- |
| Shaman | Totem destruction/detonation | Earth Shock chain attacks | Restorative totems and spirit synergy |
| Defender | Ally shielding | Bulwark offense | Threat control and frontline mitigation |
| Rogue | Ambush and Backstab | Venom spread/sustain | Vanish, stealth and repositioning |
| Warrior | Charging Stab and momentum | Guard counterplay | Threat and frontline leadership |
| Priest | Direct healing & shields | Holy magic support | Sanctuary, healing cadence and allies |
| Lightning Mage | Forked Arc attacks | Lightning Storm | Lightning Shield support |
| Ranger | Split Shot and Aimed Shot bounces | Arrow Rain | Evasion, movement and skirmishing |
| Fire Mage | LAZOR | Fire Mine | Fireball/ember ignition |

Branches are optional investments, not mandatory linear upgrades. Each purchase requires its immediate predecessor and the class-specific root; server validation remains authoritative. **11 total unique first-clear talent points** after the Chaos Arena addition. Free respec remains. This prevents completing every node of one class until additional unique encounters exist later; it does not introduce repeatable talent grinding.

## 3. Threat & tank agency

Threat accrues server-side per living player during combat. Damage adds threat equal to effective damage (no overkill); effective healing creates 0.35 threat per HP actually restored. Defender damage/heal threat is multiplied by 1.5, Warrior by 1.25; other classes baseline 1. The boss prioritizes highest weighted threat with a modest distance bias and **15% switching hysteresis**; it falls back to old behavior until threat exists.

Warrior Guard triggers a 2-second taunt, Defender Heroic Shield 2.5 seconds and Bulwark 2.6 seconds. A taunt puts the caster ahead of the current threat leader and temporarily **forces** eligible boss targeting toward them. Boss ground hazards, individual player marks and raid-wide mechanics still require every player to react. Death/phase reset removes stale targeting. New Defender/Warrior talents enhance this identity. Do not allow clients to send or edit their own threat.

## 4. Group boss health scaling

At unanimous vote approval, calculate **HP multiplier = 1 + 0.5 × (party size − 1)** for 1–4 players. Example: 1 player = 100%, 2 = 150%, 3 = 200%, 4 = 250%. Lock it at encounter start to prevent mid-fight joins/disconnects from causing threshold spikes. Scale base boss and duo partner health, Ant Queen HP, Guard health and royal-death objective damage consistently, preserving the four-Royal Guard win condition. Player damage and attack cooldown values stay unchanged. Existing difficulty-level base HP stays.

## 5. Fireball fairness

Fireball's 2-second cast now deals **140** instead of 100 on impact. Ember Wand trades power for speed (1 s, 70). The three-projectile Cinderweave Armour changes the attack footprint instead of multiplying full Fireball damage: **three 48-damage bursts (144 total on complete overlap)**. With Ember Wand and Cinderweave Armour, it becomes three 24-damage bursts at 1 s (72 total). These numbers are provisional; test both single-target boss DPS and multi-target pack damage.

## 6. Chaos Arena

A new distinct hub encounter in the larger, approximately **50 × 50-unit** arena contains all five base bosses simultaneously: Warden, Yellow Ball, Truffle Man, Fracturer and Ant Queen. It is not a sequence of one-boss rooms. Each champion has its own health and visible model/health row, with a shared aggregate boss bar. Base champion HP: 1800, 1800, 1800, 2500 and 1200 respectively, with party scaling.

The main mechanics retained include Warden sweep, Yellow Ball rolling and splitting, Truffle Man chase/slam and poison, Fracturer cardinal safe sector, and Ant Queen worker waves, Royal Guards and Rockfall. The Queen remains completely immune to attacks and only takes exactly four Royal-death objective hits (scaled with encounter HP). This is a **normal-base five-boss challenge**, not all available Hard and Double variants. The room wins when all five champions and Yellow Ball fragments are defeated; it awards **one Chaos Sigil** and one unique-first-clear talent point. Wipe/retry uses ordinary party-wide rules; no fivefold ordinary materials are awarded.

## 7. Materials and discovery-led Guide

Each crafting material displays its correct source in the Crafter inventory, and each recipe shows where its ingredients drop. This public recipe acquisition information is **not hidden behind the codex**.

A **Guide** button alongside **Options** opens a persistent in-game field guide with: Getting Started, Boss Codex, Materials, Classes and Combat. Boss Codex entries begin unknown and unlock only from actual server-authoritative **fight snapshots**. Individual mechanics are disclosed only after their warning/attack/wave is seen; actual loot is recorded only when a victory receipt includes the player. Local guide progress uses a separate browser-local key and is validated on restore. Encounter secrets must not be globally unlocked merely because the client downloaded the list of all bosses.

## Compatibility and follow-up

- Preserve historical item IDs, boss IDs, class IDs, old talent IDs, crafting counts, browser-local save keys and existing boss fight mechanics.
- New material `chaosSigil` and boss `chaosArena` are appended without altering prior rewards; each first clear remains unique.
- Existing Ranger offhand saves migrate conservatively, not by dropping items or silently crafting new ones.
- Test 1–4 players, all five Ranger slot effects together, class-switch restoration, target threat after taunt expiration, 2-second Fireball vs Cinderweave, split-ball victory, Rockfall/Fracturer safety and codex discovery.
- Revisit Chaos Arena boss density, warning readability, camera zoom, heavy multi-boss CPU load, and reward pacing in multiplayer playtests. Major design changes should receive a new ADR.
