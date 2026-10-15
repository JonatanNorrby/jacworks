# Public preview update (2026-10-15)

The user explicitly approved public distribution and confirmed CC BY 4.0 via
screenshot. The current build ships `client/public/assets/truffle-man/truffle.glb`
and adjacent `ATTRIBUTION.txt`. Persistent Options > Credits identifies dotflare,
source, license, BABAGANOOSH99 concept credit and modifications. Production and
development use the same loader and real procedural skeletal walk. A failed
request retains the procedural placeholder. Multiplayer authority is unchanged.

Inspection: ZIP contains one FBX and eight mushroom textures only. GLB v2 has ten
character meshes, two mushroom materials, six embedded images and one embedded
buffer; no external URIs, cameras or extensions. No separately sourced props,
audio or backgrounds were found. This inventory does not independently establish
ownership; distribution relies on the confirmed license and user authorization.
GLB SHA-256: `9bbf2e49d792c9cbd6203254f0b79bc63386d5b3941a05157e4d363a02419014`.

The existing Cloudflare Workers Builds integration deploys this branch on push
using the configured preview command (`npm run build && npx wrangler preview`).
Its alias is https://prototype-01-chris-hub-pass-jacworks.jacworks2026.workers.dev.
A local `npx wrangler preview` also requires Cloudflare authentication;
do not use `wrangler deploy` for this preview-only work. The historical local-only instructions below are
superseded by this public packaging update. Browser tests use the public GLB;
no local model environment settings are needed.

Validation (2026-10-15): `npm test` passes 108 tests; `npm run build` passes
with the existing large-chunk warning. The real-rig browser test verifies
alternating lift, planted stance, deforming endpoints and idle. Built-Worker
browser checks pass Credits, small viewport, multiplayer votes/reconnects/room
isolation, HTTP 200 GLB parsing, changing real-foot positions, shared patrol,
failed fetch fallback and malformed HTTP 200 fallback. The four-browser hub
scenario exceeded the default 60-second test limit and passed with
`--timeout 180000`. `scripts/smoke-truffle.mjs` accepts `SMOKE_WS_URL` for
local or preview checks: two sockets verify matching NPC snapshots and drive a
player into collision contact without penetrating its 1.33-unit boundary.

---

# Truffle Man local asset PoC

Temporary integration test on `prototype/01-chris-hub-pass`, authorized as an exception to Prototype 01's limited hub scope. Babylon.js remains the client engine (Accepted ADR-0007). No permanent art or NPC-system decision is implied.

## License / provenance

Source: [Truffle Man by dotflare on Sketchfab](https://sketchfab.com/3d-models/truffle-man-e41c6781e4854a1fbe5cdf24a0029aab). The listing retrieved on 2026-10-15 identifies **CC Attribution**, credits dotflare for models/textures/sculpt and BABAGANOOSH99 for the concept. Direct page retrieval returned 403; the search-indexed source page supplied those details. Its exact license version/link was not verified. [Sketchfab attribution guidance](https://sketchfab.com/developers/download-api/guidelines) requires creator, source and license credit to accompany use. Do not substitute the paid Sketchfab Standard License for this Creative Commons listing.

Supplied archive: `T:\TEMP\ART_ASSETS\truffle-man.zip`, SHA-256 `FACC30BD122596A498BA531BD3FB84C211CB47765ED498CAEABA6071FD1552C3`. Its mesh counts/material names match the listing, but the archive contains no attribution or license. Preserve the ZIP unchanged. Before public asset distribution, verify the exact license link/version and carry attribution and modification notices with it.

Only code, tooling, tests and documentation are committed. FBX, textures, converted GLB and model screenshots stay outside tracked files. Production builds never request or bundle the local asset. Local screenshots are ignored under `test-results/`; no public model preview is created by this fix.

## Inspection and conversion

Blender 4.5.3 imported FBX 7400: 10 mesh objects, 33,201 vertices, 65,040 triangles, two materials (`MatMushroom`, `MatMushroomBody`), one armature with 89 bones. Two generically named actions: `Armature.001|Armature.001|Armature.001Action` (frames 1Ã¢â‚¬â€œ121), and `Armature.001|Armature.001|Shader NodetreeAction.003` (frames 1Ã¢â‚¬â€œ2). Export contains skeletal translation/rotation/scale channels. The original clip is idle-like, not a travelling walk; see the diagnosis and replacement below.

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

## Walking correction (2026-10-15)

Read-only Blender inspection with `scripts/inspect-truffle.py` confirms both foot controls (`IKLeg.L/R`) and foot bones (`Foot.L/R`) have **zero translation range in both original FBX actions**. The longer action moves the spine about 0.028 source units vertically and bends the legs slightly. The GLB preserves this idle-like motion: 2.0167 seconds, 270 TRS channels, stationary foot channels. The previous client sampled valid skeletal targets but misclassified this clip as walking, stretching a loop over three metres (3.75 seconds at the patrol's unchanged 0.8 units/sec).

`client/src/truffle-walk.ts` retains the first source pose and drives the actual linked glTF bones with procedural two-segment IK: `Leg1.L/R -> Leg2.L/R -> Leg2.L/R_end`. The separate `IKLeg.L/R` chains parent the weighted foot bones. Moving only these controls would not bend the exported deforming legs: Blender IK constraints do not run in glTF, so both chains are driven explicitly. No regenerated or replacement model is needed.

One complete left/right gait covers 0.64 world units (0.8 seconds). Each stance foot retreats 0.32 units relative to the root over half a cycle, cancelling forward travel; the opposite foot swings forward with 0.12-unit lift. The spine lowers 0.07 units to keep the short legs within reach, with 0.036-unit bob and small alternating tilt. Only the seven modified transforms reset before each solve, preventing accumulated rotation error. Imported animation groups stop after the initial pose is sampled. Client root position and travelled distance are smoothed together between snapshots. Heading follows the authoritative travel direction. Patrol, collision, protocol and server code are unchanged.

When stopped, the original static idle pose is restored, without phase advancement. This is **procedural skeletal animation**, not a new authored keyframe clip. Remaining limitations: square-route corners turn immediately and pivot feet; stop/resume changes directly between idle and gait without blending; no terrain adaptation or authored arm swing. The primitive placeholder retains bob/rock. An unexpected rig reports unsupported rather than claiming an included walk.

### Validation

The actual external GLB is loaded in a close-up Babylon scene by `tests/truffle-walk.spec.ts`, using a Playwright-only route. Across a full cycle it checks alternating lift, planted stance, deforming shin endpoints within 0.006 world units of foot targets, and stable idle. Four ignored local phase screenshots were visually inspected and show alternating legs. This test requires the local model settings above and intentionally fails when the model cannot load. `tests/truffle.spec.ts` checks real-model loading, two-client shared patrol, late join and failed-load fallback.

Read-only source diagnosis:

```powershell
& '<blender.exe>' --background --python scripts/inspect-truffle.py -- 'T:\TEMP\ART_ASSETS\truffle-man-local\source\Shroom.fbx'
```

Checks: 108/108 unit tests pass; all WebSocket smoke checks pass; the focused actual-model gait and shared-hub browser tests pass (2/2). Production build passes with the existing large-bundle warning. The historical four-client software-rendering limitation above has not been revalidated by this fix.
