# JAC Works v0.1.14: Magic Effects FREE, animated mushrooms and Rune Golem Fracturer

**Date:** 2026-11-19
**Scope:** Prototype visual asset migration plus very slow Fracturer locomotion
**Approved decision:** ADR-0020
**Baseline:** v0.1.13 on main

## Magic Effects FREE spells

25 optimized source particle sprites were extracted from DiceFree's local Hovl Studio Magic Effects FREE archive, totaling about 334 KB. Every magical player ability in the current roster now uses colored Babylon.js sprites and glyphs rather than exclusively geometric placeholder spheres, boxes and torus rings.

The VFX Lab and live game use the same effect factory. The source Unity prefab names remain recorded alongside Fireball, Fire Mine, LAZOR, Arc Bolt, Arc Spear, Lightning Storm/Shield, healing, holy, Earth Shock, Fire/Healing Totem, Vanish, Poison Enchant, Bulwark, Heroic Shield and Guard. Ranger AoE receives complementary sprites.

The Unity ParticleSystem runtime was **not** ported as-is. Its source sprite art was adapted into Babylon-native effect timing, projectiles, beams and decals. Physical sword/charge/dash indicators and high-contrast enemy telegraphs remain separate. Server-authoritative damage, ranges and cooldowns are unchanged.

## Animated mushroom minions

The original mushroom-monster animation GLB from the DiceFree asset library is only 105 KB and has idle, hop, attack01, hit and die animation tracks. Truffle Man's summoned mushrooms now use cloned animated GLB models, shared from a lazy scene template, while keeping the procedural mushroom fallback until the download completes. All Normal/Hard/Double/Chaos minion spawning and stats remain unchanged.

## Rune Golem Fracturer

The Rune Golem FBX from DiceFree was converted in Blender to a textured approximately 1.9 MB GLB. The Golem is used in the standalone Fracturer, Double Truffle + Fracturer and Chaos Arena, plus Game Dev Labs.

Fracturer now walks extremely slowly, **0.16 world units per second**, approximately 18% of Truffle Man's speed. It stops at 3.15 units, faces the targeted player and remains in the accessible axial corridors, even while its corners collapse. Server-authoritative position synchronization keeps all clients consistent.

The complete normal Warden, Fracturer and Ant Queen attack mechanics remain in Chaos. Warden and Ant Queen are stationary; Fracturer now crawls. Yellow Ball and Truffle Man retain their usual faster motion.

## Verification and remaining playtest

- Source model tests: valid GLB data, full mushroom animation set, textured Rune Golem, optimized sprite files and complete magical-skill mapping.
- Movement tests: solo, double and Chaos; maximum step distance, collision limits and continued Fracturer mechanic scheduling.
- Browser tests: real Rune Golem and Mushroom Monster mesh loading, Hovl Fireball and Holy Nova textures, and compatibility with existing connected Game Dev Labs.
- Smoke, unit, production build and browser regressions are mandatory before merging.

This is a visual modernization, not a promise that every Unity prefab's original particle dynamics have identical behavior in Babylon. A 1–4-player visual playtest is recommended before changing enemy warning shapes or gameplay numbers.
