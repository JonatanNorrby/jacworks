# Truffle Man local asset PoC

Temporary integration test on `prototype/01-chris-hub-pass`, authorized as an exception to Prototype 01's limited hub scope. Babylon.js remains the client engine (Accepted ADR-0007). No permanent art or NPC-system decision is implied.

## License / provenance blocker

Supplied archive: `T:\TEMP\ART_ASSETS\truffle-man.zip`.
SHA-256: `FACC30BD122596A498BA531BD3FB84C211CB47765ED498CAEABA6071FD1552C3`.
Archive contains only `source/Shroom.fbx` and eight texture PNGs. No license, author credit, source URL or redistribution grant accompanies it. FBX metadata identifies Blender 3.0.1 / stable FBX IO and Blender Foundation as exporter author; this is tool metadata, not character authorship or a redistribution license. Imported object custom properties are empty. No license/copyright grant was found in readable FBX metadata. **Redistribution rights remain unverified. Do not commit/upload/deploy the FBX, textures, derived GLB or screenshots of this model until its provenance and terms are supplied and reviewed.** Preserve the original ZIP unchanged. No third-party license is asserted here.

The repo contains only integration code and an original primitive mushroom fallback. The supplied model and inspection JSON remain outside the checkout at `T:\TEMP\ART_ASSETS\truffle-man-local`. Production builds never request or bundle this local asset. There is no new hosted real-model preview.

## Inspection and conversion

Blender 4.5.3 imported FBX 7400: 10 mesh objects, 33,201 vertices, 65,040 triangles, two materials (`MatMushroom`, `MatMushroomBody`), one armature with 89 bones. Two generically named actions: `Armature.001|Armature.001|Armature.001Action` (frames 1–121), and `Armature.001|Armature.001|Shader NodetreeAction.003` (frames 1–2). Export contains skeletal translation/rotation/scale channels. The longest included clip is sampled by patrol distance and freezes when stopped. Its generic name does not prove it is an authored walk cycle. The fallback instead uses explicitly procedural bob/rock animation.

Eight 2048-square source textures are resized to 1024-square; base color, normal, roughness and metallic maps are reconstructed into PBR materials. GLB embeds textures (JPEG quality 85 where exporter supports it), mesh and rig; result 4,127,216 bytes. Mesh topology is retained for this single-NPC PoC. Exporter reduces vertices with more than four joint influences to the four largest normalized weights. Check deformation before promoting this to production. Full local inspection is in `inspection.json`; no source metadata is intentionally stripped from the original archive.

Reproduce after extracting ZIP outside the repo:

```powershell
& '<blender.exe>' --background --python scripts/convert-truffle.py -- 'T:\TEMP\ART_ASSETS\truffle-man-local'
```

Create an ignored `.env.local` at repo root:

```dotenv
VITE_TRUFFLE_LOCAL=true
TRUFFLE_LOCAL_GLB=T:/TEMP/ART_ASSETS/truffle-man-local/truffle.glb
```

Run `npm run dev`, open `http://localhost:5173/?room=truffle-local`, and share that same room URL with a second local client. The west lawn contains Truffle Man. A development-only Vite middleware streams the external GLB without copying it to `public` or `dist`. Only enable this on a trusted local development machine; Vite's configured development server binds all interfaces. Remove the two environment settings to test the default placeholder. Failed model loads retain the placeholder and show status in the hub card.

## Multiplayer / collision

Shared `TrufflePatrol` runs only in the authoritative lobby tick, used by both Node and Durable Object servers through `Game`. A fixed rectangular west-lawn patrol stays clear of spawn, ruins, gates, trainer, crafter and wardrobe. The NPC moves at 0.8 units/sec; a blocked NPC waits and resumes. Position, heading, walking state and accumulated travel are broadcast in snapshots, including late joins. Clients never choose NPC positions. Encounters hide the model and pause the patrol.

NPC radius 0.85 plus player radius 0.48 defines solid contact. Player and NPC movement substeps prevent tunnelling; the NPC never pushes a stationary player. Player contact stops movement (no wall-slide convenience). Model rest bounds are fitted inside the collision diameter and grounded; animation limb excursions are visual, not per-bone collision. NPC remains noninteractive and has no combat AI.

## Validation

`npm test` includes patrol bounds/determinism, bidirectional blocking/resume, large-delta tunnelling prevention, authoritative lobby collision and late-join snapshot state. `tests/truffle.spec.ts` covers two browsers sharing current patrol state, late model loading and network-failure fallback, and saves a local-only screenshot under ignored `test-results`. Existing hub browser checks cover room isolation and voting. Run `npm run build` to check TypeScript and production bundling. Existing bundle size warnings are still relevant; this PoC has not established a production performance budget.


Recorded checks (2026-10-15): 108/108 unit tests pass; production build passes (large bundle warning remains); all `npm run smoke` WebSocket checks pass. Focused real-model browser test passes, including skeletal-clip loading, two-client patrol agreement, late joining, failed-load fallback and screenshot inspection. Both existing hub browser tests pass with `VITE_TRUFFLE_LOCAL=false` (the production fallback path); both also pass on untouched baseline c7d2b20. An earlier four-client real-model run failed the existing disconnect/vote cancellation assertion. This remains a local software-rendered stress-test limitation; do not claim the full real-model multiplayer browser suite is green. Animation sampling was subsequently reduced to once per changed patrol stride instead of every render frame.
