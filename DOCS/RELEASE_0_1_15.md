# JAC Works v0.1.15: player-profile guard, visible summons, Rune Golem posing, crystals

**Date:** 2026-11-19
**Scope:** Compatible visual and profile bug-fix patch on top of v0.1.14
**Gameplay authority:** Server hitboxes, damage, rewards, movement speeds, encounter logic and class/talent rules are unchanged
**Design decision:** ADR-0021 (crystalline replacement for Fracturer's visually collapsed corners)

## Why this patch was needed

A live screenshot showed actual imported Mushroom Monster visuals far outside the arena, while their logical adds were inside and invisible. The converted Rune Golem Fracturer stood in a static T-pose. A player also reported being stuck as Lightning Mage and losing previously earned talent points. The user requested crystals over the visually destroyed arena floor instead of black voids.

## Player profile / save reliability

The server creates a temporary default Lightning Mage with zero wins immediately on WebSocket connection. The player is initialized with their saved class and browser-local talents only after the first `join` message. The old client incorrectly treated the intervening default snapshot as authoritative, writing zero talent wins into `jacworks-talent-progress-v1`. A delayed-join Chromium reproduction verified this exact overwrite.

- Server snapshots now expose `profileLoaded` on each player after their first accepted join. The client persists server talent state only after that acknowledgement, preventing the empty pre-join snapshot from erasing local progress.
- All lobby class/loadout updates are accepted even with an encounter vote pending or already accepted; established mid-fight class switching stays locked.
- The client re-sends a mismatched lobby class/profile at most once a second and warns if not acknowledged after a short delay.
- Existing first-clear wins, free respec, class gear presets, inventory receipts and eight class definitions are unchanged. Saves remain browser-local, **not an account database**. Already-overwritten zero-point saves cannot be reconstructed from server state.

## Imported Mushroom Monster positioning

The upstream GLB contains a translated `obs_enemy2` node (-10 X), nested armature and animation rig. Measuring its original hierarchy bounds before scaling produced a major displacement between each logical add's location and rendered model: a Chromium preview at X=1.5 rendered its body near X=-37.6. Model anchoring now uses the actual scaled world-space render bounds, corrected in X/Y/Z after instantiation. Chromium verification puts the GLB body within a fraction of a unit of its actor anchor at the expected height.

This works for standalone Truffle, Double and Chaos minion visuals and the Character Lab. Client-side animation remains driven by authoritative add snapshots; no spawn positions, damage or hitboxes have been moved.

## Rune Golem posture and slow walking

The source Rune Golem GLB is a **single mesh with zero skin rigs and zero animation tracks**. The earlier release could not start an idle animation. A simple deterministic mesh-local pose now bends both horizontal arms down from the shoulders and adds restrained alternating leg steps while the Golem moves. Each clone uses independent geometry; the server remains the authority for the **0.16 units/s** crawl, orientation and collision. Solo, Double and Chaos Fracturer visuals share the fix. A nonmoving idle subtly breathes instead of reentering a T-pose.

## Crystal-covered collapsed corners

On collapse, the four formerly near-black corner tiles now form visibly colored low-poly amethyst, sapphire and icy crystal clusters (33 per quadrant), with a contrasting crystal bed. During warning time the prior warm warning color remains, and the crystals appear only after impact. Chaos uses its existing enlarged corner geometry. **This changes presentation only:** the same server-defined dangerous floor, collision boundaries, collapse timestamps and cardinal safe-sector rules apply; crystals are not interactable or solid obstacles.

## Verification / release gates

- `npm test`: 269 unit tests passed, including new class/talent and golem pose regressions.
- `npm run build`: TypeScript and Vite production build passed after local fixes.
- New Chromium tests check a deliberately delayed first join and preservation of local wins, class switching through Shaman and page reload, model alignment/height, lowered-arm Golem pose and existence of all 132 crystal meshes.
- Run `npm run smoke` and the complete targeted GitHub Actions Chromium suite before merging; record results and any remaining limitations in the PR.
- Main push may trigger Cloudflare Workers Builds separately. Do not equate a merged source commit with a verified production deployment.
