# JAC Works v0.1.8: Combat fixes, Wardrobe tabs and Fracturer Cardinal Eruption

**Status:** Prototype implementation with regression tests. Details of the Fracturer mechanic are in [ADR-0015](ADR/0015-fracturer-cardinal-eruption.md).

## Five requested changes

### Fire Mage: Ember Afterglow damage fix

Previously a lingering Ember Afterglow effect reused the Fire Mine skill type and was processed by the full 95-damage mine trigger branch. A single mine could recursively trigger full explosions on subsequent effect ticks.

Now the initial mine explodes **exactly once for 95 damage**, then produces **three independent 8-damage pulses** over three seconds in a 3-unit area. Expected base damage to a continuously present single boss: **119** (before purchased 3% root talent). The afterglow effect has its own `afterglow` discriminator; mine trigger logic explicitly ignores it. Persistent field visuals also distinguish active mines from their fading fire zones.

### Ranger: Split Shot hits per arrow

Each projectile resolves its own hit against a physical target radius, rather than relying on an overly narrow ray through the target center. Each of the normal three arrows deals **22 damage**, for **66** if all three hit at close range. Splitthorn Quiver fires five arrows at **16 each**, for **80** if all five hit. Split Volley still adds two optional outer projectiles, at 16 each, subject to their own collision.

A wider cone still misses outer arrows at longer ranges if those trajectories do not intersect the enemy. Cover and server validation remain in place. Server emits each visible arrow separately.

### Warden: clear facing for Rogue Backstab

Normal Warden, Hard Warden and the Warden in the Yellow Ball duo now show a pale, protruding nose on the front of the boss model. The model rotates according to the boss's authoritative nearest visible living target, matching the rear Backstab rule instead of inventing a new heading or backstab bonus. If no visible target remains, it keeps its last facing.

### Wardrobe: six equipment slot tabs

The wardrobe paper doll is preserved. Owned items are filtered by **All / Weapons / Head / Offhand / Armour / Boots**. Each tab includes a count, has accessible selected state, and shows an empty-state message when nothing is owned in that slot. Equipping/unequipping keeps the selected slot tab. Class restrictions, crafting materials, item persistence and equipment-slot validation are unchanged.

A direct **Wardrobe** button is also present in the hub controls, alongside the existing interactable Wardrobe in the scene.

### The Fracturer: Cardinal Eruption

Solo Fracturer and the live Fracturer partner in the double encounter periodically warn that **three quarters of the arena are dangerous**. One North/East/South/West 90-degree sector is green and safe; the others turn red for a **3.2-second warning**. The server applies **55 damage once** to players outside the safe sector, respecting normal mitigation/shields. First cast begins around 11 seconds in, followed by a 16-second cycle, rotating compass directions.

Each safe sector includes a walkable central axial corridor even after all four existing corner-collapse mechanics have fired. The attack cancels if the Fracturer dies or the encounter ends.

## Compatibility and validation

- Existing equipment receipts, player progression, skills, and boss IDs remain unchanged.
- New optional `Snapshot.fracturerSurge` and `CombatEffect.afterglow` distinguish the two new authoritative behaviors. Client and server protocol version is **0.1.8**.
- Tests: Ember Afterglow exact pulse damage and expiry, 3/5-arrow Split Shot damage, Warden facing snapshots, cardinal safe corridors, one-shot 55-damage pulse and rotation, duo partner cancellation and reset.
- Browser test: Wardrobe tabs and filtered inventory, equip persistence, a hub shortcut, and successful normal Warden encounter entry.
- Required release verification: `npm run build`, `npm test`, `npm run smoke`, GitHub's entire Playwright suite.

**Release guardrail:** feature PR first. No direct deployment; merge only with green GitHub Actions. Confirm production deployment independently.
