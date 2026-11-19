# ADR-0020: Babylon-native Magic Effects, animated mushroom summons, crawling Rune Golem

**Status:** Accepted for prototype
**Date:** 2026-11-19
**Partially supersedes:** ADR-0019 (Fracturer immobility only)
**Preserves:** Fracturer's normal attack mechanics, boss damage rules and server-authoritative physics

## Approved user request and source provenance

The user specifically requested a JAC Works reuse of DiceFree's Magic Effects FREE, the Mushroom Monster as Truffle Man's summoned minion, the Rune Golem as Fracturer, and very slow Fracturer movement. This supersedes only the previous decision for Fracturer to remain stationary. Warden and Ant Queen still stand still in Chaos. The library of ability ideas remains draft inspiration, not a separate approved design change.

The actual source assets on the authorized workstation are:

- C:\Users\Axel\AppData\Roaming\Unity\Asset Store-5.x\Hovl Studio\Particle SystemsMagic\Magic Effects FREE.unitypackage. Contains 76 Unity particle prefabs, including Explosion, Healing circle, Electro hit, Holy hit, Laser AOE, Lightning aura, Magic shield blue, Smoke puff and Green hit.
- T:\TEMP\ART_ASSETS\mushroom-monster.zip. Its 105,232-byte, rigged source GLB has one skin and five animations: idle, hop, attack01, hit, die.
- T:\TEMP\ART_ASSETS\rune-golem-free.zip. Contains LP.fbx (4,556 vertices, 9,108 triangles), source color/normal/roughness/emissive maps.

## Native Babylon effects, not Unity runtime

Unity ParticleSystem components cannot execute in Babylon.js. Instead 25 genuine particle-sprite textures were extracted from the Magic Effects FREE package and optimized to WebP, totaling approximately 334 KB. The JAC Works Magic Effects renderer maps the original source-prefab concepts to colored Babylon-native projectiles, glyphs, AoE decals, lightning, healing, shields, smoke and flames.

All magical player skills are mapped in client/src/magicEffects.ts. Real combat and the Game Dev VFX Lab call the same renderer. Fire Mage, Lightning Mage, Priest, Shaman, Rogue spells, Defender protective skills, Warrior Guard, and Ranger AoE flourishes use the extracted images. Persistent Fire Mine, Ember and Shaman Poison circles use sprite decals rather than plain torus rings.

Physical weapons and Dash retain geometric direction indicators where those are clearer. Crucial enemy warning telegraphs remain distinct and high contrast. **This is a texture/art migration, not a damage or hitbox revision.** The result adapts real Hovl textures; it is not a one-to-one execution of the Unity particle behaviors.

## Truffle Man summons

All actual basic mushroom adds in Normal, Hard, Double and Chaos encounters use the 103 KB animated Mushroom Monster GLB when loaded. Load a template only when needed, instantiate separate rigged copies for each living minion, select idle/hop/attack/hit animations from authoritative snapshots, and preserve the procedural mushroom placeholder when downloading fails.

This affects appearance only; existing add HP, speed, aggro, contact damage, spawn and reward rules are unchanged. The Game Dev Lab's Character viewer and Truffle summon preview share the new model.

## Fracturer is a Rune Golem that creeps

The source FBX was converted to a browser-ready GLB using Blender 5.2.2, normalized to roughly three units tall, with a reduced 1024px embedded base-color texture. The resulting textured model is roughly 1.9 MB. It replaces Fracturer in solo, duo and Chaos encounters and is previewable in the Character Lab. A primitive cylinder is retained as the load/error fallback.

Fracturer movement is server-authoritative and intentionally slow:

- Crawl speed **0.16 world units/second** (Truffle Man is 0.9).
- Stop within **3.15 world units** of the threat target.
- Never exceed the speed allowance, including when adjusted around dangerous corners.
- Stay on the middle cross-corridors when corners collapse (3.0 small arena, 5.5 Chaos).
- Face the selected target but retain the complete targeted blast/line/scatter, four-corner collapse, and one-safe-cardinal-quarter attacks.
- Warden and Queen remain immobile in Chaos; Truffle Man and Yellow Ball remain normally mobile.

The authoritative world position is synchronized for every client. No server hitboxes or targeting decisions rely on a client-side visual model.

## Performance, tests and follow-up

Asset loading is lazy and cached per Babylon scene; additional mushroom summons clone the cached animated template. Original procedural fallbacks remain and are immediately playable. Effects reuse textures/materials.

Tests must verify valid source GLBs (including animation and texture data), rendered models in a real Chromium Game Dev Lab, actual Hovl materials for Fireball/Nova, older lab regressions, strict server crawl speed in Normal/Double/Chaos, and existing boss attacks.

The simultaneous Chaos visual load and spell transparency should be playtested with four real players. Replacing enemy warning graphics or altering gameplay to match different VFX would require a separate design round.
