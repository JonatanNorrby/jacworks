# JAC Works v0.1.11: Class Builds, Threat, Chaos Arena and the Field Guide

**Scope:** Prototype release; numerical balance provisional
**Accepted implementation decision:** [ADR-0018](ADR/0018-chaos-threat-class-loadouts-codex.md)
**Previous baseline:** v0.1.10 (Ranger offhands only, 2 talent branches, 10 unique clears)

## Ranger gear in five different slots

The Ranger now has a truly combinable five-piece build, not a wardrobe full of mutually exclusive offhands. Existing recipes and internal item IDs are preserved.

| Slot | Equipment | Actual mutation |
| --- | --- | --- |
| Weapon | Sporefang Longbow (`sporefangQuiver`) | Aimed Shot deals 100 instead of 58 but charges for 2s |
| Head | Splitthorn Hood (`splitthornQuiver`) | Split Shot fires five 16-damage arrows instead of three 22-damage arrows |
| Offhand | Brood Quiver (`broodQuiver`) | Split Shot applies two 5-damage venom ticks per enemy struck |
| Armour | Sporestorm Cloak (`sporestormQuiver`) | Arrow Rain waves deal 35 instead of 28 damage with a smaller radius |
| Boots | Rotting Trail Boots (`rottingFletching`) | Arrow Rain creates a three-pulse poison field |

Other Ranger equipment combinations remain legal, including class-independent boots and hats. Old owned offhand items are migrated conservatively to their new slot without deleting crafts or overriding a different equipped piece.

**Class equipment presets:** Switching from Ranger to Fire Mage (or any of the eight classes) stores the old class's active equipment and restores the destination class's most recent weapon, head, offhand, armour and boots. A first-time class starts empty except compatible saved universal items. `gearSets` lives inside the same browser-local inventory save. Every recalled item is rechecked against owned recipes and allowed slots. Class presets refer to the same item pool, not duplicated equipment.

## Threat and the tank role

A new authoritative threat ledger makes boss targeting intentional.

| Action | Threat contribution |
| --- | --- |
| Successful damage | Actual HP removed, not overkill, multiplied by class |
| Effective healing | 0.35 per restored HP |
| Defender | 1.5× normal threat coefficient |
| Warrior | 1.25× normal threat coefficient |
| Warrior Guard | Forces attention for 2s |
| Defender Heroic Shield | Forces attention for 2.5s |
| Defender Bulwark | Forces attention for 2.6s |

Targeting uses threat with a small distance preference and a 15% switching threshold, so a boss does not flicker between two nearly equal tanks. Taunt temporarily overrides normal target selection and adds threat. If nobody has threat, the original targeting rules apply. Area mechanics and player-specific marks **still hit everyone who fails the mechanic**; threat controls aggro, not encounter exemptions.

## Party-size boss HP

The encounter fixes health scaling when the vote succeeds, with the multiplier **1 + 0.5 × (party size - 1)**:

| Players at pull | Boss HP | Example: normal Warden |
| --- | --- | --- |
| 1 | 100% | 1,800 |
| 2 | 150% | 2,700 |
| 3 | 200% | 3,600 |
| 4 | 250% | 4,500 |

Duo partners, Ant Queen HP and Royal Guard HP scale as part of the same encounter. Four guard deaths still win the Ant Queen objective; each Royal death reduces queen health by 25% of her scaled total. Later joins do not instantly change boss HP. This avoids instant health spikes, but live balance will need testing with mixed parties.

## Fire Mage Fireball redesign

| Setup | Cast | Per-hit behavior |
| --- | --- | --- |
| Standard Fireball | 2s | 140-damage explosion, improved from 100 |
| Ember Wand | 1s | 70-damage explosion |
| Cinderweave Armour | 2s | Three smaller explosions, 48 each (144 total on full overlap) |
| Ember Wand + Cinderweave | 1s | Three 24-damage explosions (72 total on full overlap) |

The point of triple projectiles is spread and multiple targets, not a free 3× boss damage multiplier. New Fireball talents can add delayed embers and mine interactions, subject to prerequisite points and server damage checks.

## Third talent branch for every class

Each of the eight classes now has **three four-node chains and one common purchased root**. The total is **104 nodes** (13/class). Previously purchased talent nodes remain valid; the added Chaos Arena can award an **11th unique first-clear point**. Repeating encounters still does not farm points, and respec is free. Each new node genuinely modifies a skill or defensive interaction.

| Class | New third branch and four new nodes |
| --- | --- |
| Shaman: Restoration and spirit totems | **Restorative Rhythm** (Healing Totem +3/pulse), **Stone-Skin Ward** (6 shield to injured nearby ally), **Spirit Echo** (Earth Shock triggers 10 HP totem-linked heal), **Sacred Grove** (+4 heal/+8 Fire Totem damage while both totems active) |
| Defender: Threat & protection | **Menacing Stab** (+80 threat), **Shield Signal** (Heroic Shield +1s taunt), **Fortress Aura** (15% ally damage reduction within 4 while Bulwark is active), **Unbroken Line** (Heroic Shield reduces Bulwark's remaining cooldown by 1.5s) |
| Rogue: Stealth | **Fading Step** (Vanish halves threat), **Shadow Guard** (8 shield when vanishing), **Opening Strike** (+16 damage on invisible Quick Stab), **Smoke Return** (Opening Strike refunds 1.2s of Dash recharge) |
| Warrior: Frontline support | **Battle Cry** (Guard +80 threat), **Hold Ground** (+0.4s Guard), **Rallying Advance** (Charging Stab shields nearby ally for 12), **Frontline Leader** (Sword Slash during Guard heals nearby injured ally 8) |
| Priest: Sanctuary | **Serene Nova** (8 shield on Holy Nova), **Blessing of Speed** (Targeted Heal reduces ally cooldowns 0.25s), **Prayer Echo** (Holy Light self-heals 6), **Sanctuary Pulse** (a delayed 8 healing pulse after Holy Nova) |
| Lightning Mage: Shielding storms | **Charged Aegis** (Lightning Shield grants 10 absorb), **Overcharged Pulse** (pulses +4 damage), **Conduit Mender** (each pulse heals protected ally 3), **Thunderhead** (+1 pulse radius) |
| Ranger: Skirmishing | **Evasive Volley** (Split Shot contact shields caster 8), **Quick Recovery** (two distinct targets refund 0.5s cooldown), **Wind Step** (Dash shields caster 12), **Skirmish Rhythm** (Dash empowers next Split Shot within 3s with one extra 12-damage arrow) |
| Fire Mage: Fireball mastery | **Rolling Embers** (Fireball hits apply two 8-damage burns), **Flash Ignition** (Fireball detonates one nearby owned mine), **Ash Shield** (successful Fireball grants 10 shield), **Wildfire** (+0.5 Fireball radius and one delayed 8-damage ember pulse) |

Talents preserve their existing arrows and dependencies. Class themes are genuinely different, not eight identical percentage ladders.

## Chaos Arena: five-boss challenge

A new distinct Chaos ring in the hub opens a larger **50 × 50** arena with five bosses alive together, each with a separate model, health bar and combat effects. Normal versions of Warden, Yellow Ball, Truffle Man, Fracturer and Ant Queen are all active at once, rather than sequential waves.

| Boss | Base HP | Retained pressure |
| --- | --- | --- |
| Warden | 1,800 | Line sweep / target pressure |
| Yellow Ball | 1,800 | Movement and splitting into smaller balls |
| Truffle Man | 1,800 | Chase, telegraphed slam and poison |
| Fracturer | 2,500 | Cardinal-sector eruptions |
| Ant Queen | 1,200 | Workers, Royal Guards, falling rocks, immunity until four Guard kills |

The **9,100 combined base HP** is multiplied by party size. Winning requires defeating each champion and every surviving Yellow Ball fragment. Defeating a Royal Guard is the only path to damaging the otherwise immune Ant Queen. The reward is **one exclusive Chaos Sigil** per victory, not a pile of old boss loot, plus one unique-encounter first-clear talent point. No class needs to equip or use Chaos Sigil yet.

## Guide: first installment of the Field Guide and Boss Codex

A **Guide** button appears next to **Options**, usable in hub and fights. It contains five chapters: Overview, Boss Codex, Materials, Classes and Combat.

The Boss Codex starts empty. It only records a boss once the player actually enters an encounter, and only reveals mechanics after the corresponding server-synchronized warning or action is observed. It records a material as discovered loot only after the player receives a valid reward receipt. Data lives in browser local storage under `jacworks-guide-codex-v1`; no account backend is implied.

**Recipe sourcing is intentionally public**, not hidden by the boss codex: the Crafter's materials section and individual recipe cards now state exactly where each ingredient is earned. The material lookup is shared with the Guide's Materials chapter.

## Verification and follow-ups

- Server tests cover old save migrations, simultaneous five-piece Ranger builds, per-class gear restore, threats and taunts, 1–4-player scaling, Fireball damage and split-cast balance, the new branches, Chaos Arena shared HP and split/Guard win conditions, and codex unlock filtering.
- Browser tests cover actual class-switching via the Trainer, the five-slot Wardrobe, Guide chapter UI, a live five-boss Chaos room, discovered boss names/mechanics, and persistence.
- Smoke tests preserve prior Warden, Truffle Poison, encounter voting and multi-client state synchronization.

**Known prototype limits:** Chaos is a high-pressure encounter requiring real two-to-four-player balance testing; target switches should be inspected from player viewpoints. The guide is a first installment, not the final encyclopedia. Numeric ability values are provisional.
