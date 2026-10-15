# Consolidation 0.1.0 verification

Date: 2026-10-15. User approved audit D1–D7 and conditional publication; D8 remains undecided. The historical audit is preserved separately.

## Integration

Started `consolidation/0.1.0` at fetched main `e765c2c`. Merge `c37972c` adopts the complete hub baseline `e36adfa`; merge `70582e0` integrates Labs v2 `db3102a` with deliberate render-loop reconciliation. Commit `7cc5059` independently bumps package and both lockfile root versions to 0.1.0. Commit `5ed380a` adds isolated browser backend configuration and refreshes remaining README instructions.

The shared simulation, Node/Worker transport source, save/protocol IDs and public assets are byte-identical to the hub baseline. Truffle Man retains `greenCone`, the real skeletal model, authoritative smash timing and mushroom summons. Labs uses that same model lazily, with illustrative boss studies, VFX speed/scale and character health-bar visibility. Source rights are unchanged; no LICENSE is introduced. The GLB SHA-256 remains `9bbf2e49d792c9cbd6203254f0b79bc63386d5b3941a05157e4d363a02419014`; attribution and Credits remain intact.

## Transition safeguards

Labs keeps the live socket and roster, receives snapshots/rewards/votes, sends zero movement and blocks combat/room-reset hotkeys. Its warning explicitly says combat continues and the player remains vulnerable and counts for votes. Room/connection UI and voting remain accessible. Opening clears held keys and transient FX. Current server phase determines exit scene, including fight start or shared reset during inspection. The authoritative boss clock keeps tracking snapshots while world actors are hidden.

World mesh suppression lasts only for one render: save each mesh's local enabled flag immediately before rendering and restore it in `finally`. This accommodates newly loaded assets and snapshots without restoring an entry-time world. Disposed meshes are skipped; lab mesh registrations are pruned. Imported Labs assets are distinguished through their ancestry. Leaving hides the Labs rig and rebuilds the current hub/encounter from the latest snapshot.

## Validation

- `npm test`: 110/110 pass.
- `npm run build`: TypeScript and Vite pass, including the prior AbstractMesh/Mesh TS2345 failures. Existing approximately 6.08 MB main chunk warning remains.
- `npm run smoke` and `node scripts/smoke-truffle.mjs`: all disposable Node room/combat/class/FX/vote/totem/three-client/isolation/collision checks pass.
- Local Wrangler: shared combat, vote/totem, three-client room and Truffle collision socket smokes pass against `ws://localhost:18790/ws`.
- Built Worker browser checks: 3/3 pass (`tests/hub.spec.ts` and `tests/labs-room.spec.ts`) against a restarted `http://localhost:18790`, covering real Durable Object rooms, votes, offline/reconnect recovery, private-room creation, Labs real model loading and return after another player resets the encounter.
- Fresh-Node complete browser run: 12/13 pass; the sole failure was a pre-existing real-rig fixture race. After correcting only the fixture to update/render synchronously at its controlled clock (instead of hoping a frame runs during a 100ms sleep), the targeted real-rig rerun passes 1/1 with all original pose assertions retained. All 13 distinct browser scenarios have passed. The final Labs check also verifies that a normally 700ms Guard effect survives 900ms at quarter speed, then expires when accelerated.

Initial browser attempts exposed validation-environment ambiguity: port 8787 already belonged to a process predating this session. It was preserved. The four-context hub scenario also exceeded the baseline 60-second software-renderer budget, previously documented in the Truffle handoff. It now has a scoped 180-second allowance. Fresh test-owned backend runs use `TEST_WS_PORT=18791`, passing `VITE_WS_PORT` only to local Vite; deployed `/ws` routing is unchanged. After rebuilding static assets, restart local Wrangler so its asset manifest matches dist. No production deploy command was run. A read-only production probe still returned HTTP 200 `Hello World` (11 bytes), matching the audit; main publication can replace that placeholder through the existing external build integration.

The targeted fresh-backend hub/Labs rerun passed 4/4, covering movement blocking, unchanged socket identity/membership, unanimous votes and decline, fight start while Labs stays open, another player's reset, return to current encounter/hub, late model load, new enabled/disabled meshes, disposal, health-bar visibility and VFX scale. Actual model, skeletal walk/smash, late join, mushroom geometry and failed/malformed asset fallbacks were exercised by the browser suite. Rendered Labs and actual encounter screenshots were inspected.

## Boundaries and preserved files

These are automated browser contexts and real sockets, not a four-human playtest or final balance study. Browser-local economy remains unauthenticated. Durable Object active state remains in memory; deployment/restart continuity is not established. Skill-mutation crafting remains Proposed. No project source license was chosen. Existing external Workers Builds may deploy on main pushes; no wrangler deploy is authorized implicitly.

The following original local evidence remains untracked and untouched:

- `DOCS/REGRESSION_B0B6DEE.md` — SHA-256 `65fddb931be96ec43f98203511a4d03c6fd46995b998573835606504066d934f`.
- `diag-boss.mjs` — SHA-256 `b27044f03b1584283df23b8fe5cc119656e07fccb2e995e650cf8ad785ba9784`.
- `inspect-boss.mjs` — SHA-256 `a6d0b58d0232415f2268e821ee0958dcb4a0c4a9bedf95b7de5684c1dc2c0f17`.

## Publication gate

No new conflicting product decision was found. Publication is authorized by the user after these checks. Fetch and verify remote main before a normal fast-forward push; never force-push. Preserve existing prototype branches/draft PRs without retargeting or deleting them. Remote ref/build results are reported in the handoff after publication; this document records the local verification gate.
