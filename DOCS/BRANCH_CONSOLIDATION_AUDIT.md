# Branch consolidation audit

**Subsequent decision (2026-10-15):** The user approved D1-D7 and consolidation/publication after verification. D8 remains undecided: retain existing rights and asset credits. The findings below preserve the pre-integration audit; implementation and validation results belong in `CONSOLIDATION_0_1_0.md`.


Audited 2026-10-15 after `git fetch origin`; `git ls-remote --heads origin` confirmed exactly the 12 branches below. Repository: JonatanNorrby/jacworks. Working branch: `docs/branch-consolidation-audit`, based on hub head `e36adfa5b520`.

**Decision: do not consolidate or push main yet.** There is a real Labs v2 merge conflict, a reproducible v2 build failure, and product choices requiring review. No merge, commit, push, deployment, version bump or tag was made. Existing untracked `DOCS/REGRESSION_B0B6DEE.md`, `diag-boss.mjs`, and `inspect-boss.mjs` were left untouched.

## Branch coverage and ancestry

Counts are `main-only / branch-only` from `git rev-list --left-right --count origin/main...origin/<branch>`; branch-only commits do not necessarily mean missing content (squash merges). All refs below are remote `origin/` refs.

| Branch | Head | Counts | Finding / recommendation |
| --- | --- | --- | --- |
| main | e765c2c40e93 | 0 / 0 | Documentation only; retain as integration root. |
| docs/project-foundation | 75185022a5f2 | 9 / 0 | Ancestor of main, merged PR #1; already included. |
| docs/design-questionnaire | 85ba5dd1cc44 | 7 / 0 | Ancestor, merged PR #2; already included. |
| docs/jonatan-design-interview | 6e92cdb99611 | 5 / 0 | Ancestor, merged PR #3; already included. |
| docs/axel-design-interview | 17906fa33910 | 4 / 2 | Squashed PR #4; interview is byte-identical on main. |
| docs/christoffer-design-interview | b8106e6db43f | 4 / 1 | Merged PR #5; interview byte-identical, patch-equivalent commit. |
| docs/adrs | 13b91b778ad8 | 4 / 4 | Squashed PR #6; template/ADR-0001 identical; index and agent guidance subsequently extended. |
| docs/accepted-design-adrs | a728a98b1a03 | 3 / 9 | Squashed PR #7; all nine changed paths byte-identical on main. |
| prototype/01-babylon-multiplayer-boss | 78c4b500445c | 0 / 10 | Entirely contained in hub and both Labs branches; open PR #8 targets main. |
| prototype/01-chris-hub-pass | e36adfa5b520 | 0 / 55 | Recommended gameplay base; 45 commits beyond base prototype; open PR #9 targets base prototype. |
| prototype/01-game-dev-labs | 6ecb8fe22af8 | 0 / 28 | Three unique Labs commits after shared `46c3fa6`; closed PR #10 explicitly superseded by #11. Do not merge this implementation. |
| prototype/01-game-dev-labs-v2 | db3102a781cb | 0 / 53 | Four unique commits after shared `c7d2b20`; open PR #11 targets hub, but misses hub's latest six Truffle commits. Retain concept subject to decisions below. |

Ancestry: `main -> base prototype -> 46c3fa6 -> ... -> c7d2b20 -> six Truffle commits -> hub`; v1 forks at `46c3fa6`, v2 forks at `c7d2b20`. Neither Labs branch contains the other. V2 supersedes v1 by explicit [PR #10](https://github.com/JonatanNorrby/jacworks/pull/10) / [PR #11](https://github.com/JonatanNorrby/jacworks/pull/11) intent and replacement implementation, not commit ancestry or exact feature parity. Historical repeated commit subjects on hub are incremental commits; do not deduplicate by subject.

Docs are already incorporated: retain current main/hub documentation, rather than merge seven historical docs tips. `DOCS/README.md`, `DOCS/AGENTS.md`, `DOCS/PROTOTYPE_01.md`, interviews, questionnaire and ADR-0001–0007 survive in hub. Hub adds ADR-0008–0011 and proposals; proposals remain proposals. No open issues were returned by `gh issue list --state open`.

## Discrepancies requiring user review

| ID | Exact branches / paths | Finding | Recommended resolution for approval |
| --- | --- | --- | --- |
| D1 | hub vs Labs v2: `client/src/main.ts`, final `engine.runRenderLoop` | `git merge-tree --write-tree` reports one content conflict: hub updates both Truffle actors and authoritative smash timing; v2 gates camera updates and ticks Labs. Whole-file selection loses one implementation. | Retain hub gameplay/Truffle work and integrate v2 camera/Labs guards deliberately. Gate world actor updates while inspecting Labs; preserve authoritative snapshot timing and restore current scene on exit. |
| D2 | Labs v2: `client/src/gameDevLabs.ts:296,304` | Build fails TS2345: `scene.meshes` provides `AbstractMesh`, while `labMeshes` is `Set<Mesh>`. Both `labMeshes.has(mesh)` calls fail. PR #11's Workers Builds check is FAILURE at db3102a. | Fix collections to accept `AbstractMesh` where appropriate, preserving specialized Mesh types for generated primitives; rebuild before any preview. Unit tests alone do not catch this. |
| D3 | hub: `client/src/main.ts`, `client/src/truffle.ts`, `client/src/truffle-walk.ts`, `client/src/mushroom.ts`, `shared/game.ts`; v2: `client/src/gameDevLabs.ts` | Hub replaces Green Cone presentation with Truffle Man and mushroom adds while retaining `greenCone` protocol ID and Conical Taper reward. V2 still offers primitive Green Cone/cone-add previews and no Truffle rig/smash. | Keep Truffle Man in game and update Labs to current presentation, retaining protocol/save IDs. Alternative: explicitly label old primitive previews as legacy. User should choose; do not revert gameplay implicitly. |
| D4 | v1: `client/index.html`, `client/src/main.ts`, `client/src/style.css`; v2: `client/src/gameDevLabs.ts`, `client/src/main.ts`, `client/src/style.css` | V1 embeds additional client modes and standalone VFX; v2 installs a module over the live scene and reuses `spawnAbilityFx`. V2 expands four spell previews to 27 variants and adds 14 boss previews/eight class silhouettes. It drops v1 VFX speed and VFX scale controls and the character health-bar toggle. Entity scale/ring and Idle/Attack/Cast/Hit remain. | Use v2 module; approve dropping the three controls or request focused ports. Never merge both UIs. V1 vs hub conflicts in all three v1-changed paths. |
| D5 | v2: `client/src/gameDevLabs.ts` (`captureWorld`, `suppressWorld`, `restoreWorld`, previews); `client/src/main.ts` (socket/render/input hooks) | Labs keeps the player connected to the live room, sends zero movement, suppresses world meshes and blocks fight-mode switching while open. The server still advances combat and counts this player for votes. Mesh state is captured only on entry; asynchronously created model meshes and new snapshots can race restoration. Boss previews duplicate timings/geometries: e.g. hard-bounce uses 950ms warning spacing/800ms flight versus shared 1100ms warnings/1000ms initial flight. | Prefer an isolated developer scene/room or explicitly approve live-room membership and test it. Label boss previews illustrative until driven by shared data/fixtures. Add focused open/close, fight-start, late asset load, mesh disposal, vote, and rig restoration checks. These are source-review risks, not reproduced browser failures in this audit. |
| D6 | all prototype branches vs `DOCS/PROTOTYPE_01.md`, `DOCS/AGENTS.md`; hub `DOCS/ADR/0008-*.md` through `0011-*.md`, `README.md`, `DOCS/TRUFFLE_MAN_POC.md` | Original scope excludes multiple classes/bosses, crafting/loot/progression and large hub. Later ADRs explicitly record approved roster, votes and encounters; Truffle doc records an authorized PoC exception. Scope/agent summary still reads as the earlier boundary, and README retains Green Cone descriptions. | Retain later accepted decisions and browser-local prototype economy, refresh scope/README to identify approved exceptions and current Truffle presentation. Do not promote future skill-mutation crafting proposals into accepted design. Confirm this expanded scope belongs in the consolidated prototype. |
| D7 | hub/v2 `shared/inventory.ts`, `client/src/inventory.ts`, `shared/classes.ts`, `shared/game.ts`, `server/index.ts`, `worker/index.ts` | Current hub/v2 share authoritative `Game`; Node and Durable Object are transport adapters, not competing combat implementations. Browser-local reward ledgers/equipment are unauthenticated; accounts/D1 are unimplemented proposals. V1 predates shared simulation, private-room routing, votes and classes; using its full files regresses these. | Preserve hub's shared authority/room architecture and save keys. Accept inventory as prototype-only; treat authenticated persistence as later work. Do not select older files to make conflicts disappear. |
| D8 | all branches: no root LICENSE; hub `client/public/assets/truffle-man/{truffle.glb,ATTRIBUTION.txt}`, `client/src/credits.ts`, `package-lock.json` | Project source license is unspecified. Asset has explicit CC BY 4.0 attribution and modification notices. Missing project LICENSE must not be interpreted as permission to relicense third-party material. | Owners choose a project-code license or explicitly retain current rights; keep asset license separate and preserve attribution in public builds. See licensing findings below. |

## Licensing and provenance

- Only hub adds tracked binary art: `client/public/assets/truffle-man/truffle.glb` (4,127,216 bytes). SHA-256 verified `9bbf2e49d792c9cbd6203254f0b79bc63386d5b3941a05157e4d363a02419014`, matching attribution/documentation. Creator dotflare, source [Sketchfab listing](https://sketchfab.com/3d-models/truffle-man-e41c6781e4854a1fbe5cdf24a0029aab), concept BABAGANOOSH99; conversion and procedural walk/smash modifications documented. Credits UI and adjacent attribution must survive consolidation.
- Repository records user-confirmed license screenshot on 2026-10-15; screenshot itself is not tracked. Live listing returned HTTP 403 during audit, so its current license was not independently revalidated. [Official CC BY 4.0 terms](https://creativecommons.org/licenses/by/4.0/) require attribution, license link and change notices; current notices contain these elements. This audit does not independently establish ownership.
- Lockfile runtime entries: Babylon core/loaders/glTF interface Apache-2.0, ws MIT. Other dependency metadata includes MIT/ISC/BSD/CC0 and LGPL-bearing optional **development** Sharp/libvips packages. Preserve applicable third-party notices and review actual shipped artifacts; do not assume all locked packages are browser runtime or that every dependency is permissively licensed. This is a metadata/provenance assessment, not a completed distribution compliance review.
- No root LICENSE found across branch trees/history inspected; GitHub license endpoint returns 404. `private: true` in package.json prevents normal npm publication; it does not establish a source license. `npm audit --json` reports zero known vulnerabilities for current hub lockfile (time-specific; not a license check).

## Tests and deployment implications

| Target | Checks performed now | Outcome |
| --- | --- | --- |
| Hub e36adfa | Node v24.19.0; `npm test`; `npm run build` | 110/110 pass; TypeScript/Vite build passes. Existing ~6.06 MB main JS chunk warning remains. |
| Hub e36adfa | `npm run smoke`; `node scripts/smoke-truffle.mjs` | Combat/mixed classes/Hard duo, votes/totems/scatter, three-client rooms/isolation, and Truffle collision all pass against disposable local servers. |
| Labs v2 db3102a | `npm test`; `npm run build` in separate detached worktree | 103/103 pass; build FAILS with D2's two TS2345 errors. Used existing hub node_modules via junction; common locked versions match, hub adds loaders. Not a clean `npm ci` validation. |
| Historical docs/base/v1 | Content/history inspection; PR/check metadata | No fresh runtime checks. Superseded v1 preview historically succeeded; does not establish current compatibility. |
| Integrated result / browser / Durable Object | Not run: no integration created | No claim of consolidated build, browser visual QA, real four-human session or current Worker runtime validation. |

`tsconfig.json` includes client/server/shared/Vite, but excludes `worker/index.ts` and browser test files. A successful npm build does not type-check the Worker. Current automated shared tests do not exercise Labs. After approval: build, existing unit/socket checks, targeted Labs/browser regressions, and local Wrangler/Durable Object validation before preview or main.

[PR #9](https://github.com/JonatanNorrby/jacworks/pull/9) hub Workers Builds status is SUCCESS at current e36adfa; PR #11 v2 status is FAILURE at db3102a. These are GitHub-reported checks, not fresh live preview probes. PR #11's claim to stack on the latest hub is now stale by six commits.

`wrangler.jsonc` serves `dist`, routes `/ws` to `GAME_ROOM`/`GameRoom`, names Worker `jacworks`, and configures `npm run build` plus preview Durable Object bindings. `package.json` deploy script runs **wrangler deploy**. README/Truffle docs and PR bot comments show externally configured Workers Builds branch previews; no in-repo `.github` deploy workflow was found. Dashboard production-branch settings were not inspected. A future main push may trigger production deployment; even a staging push may trigger a public preview. Do not run deploy scripts, push, or retarget/merge the stacked PRs during this audit. A local package version bump itself does not deploy, but pushing it can.

Branch preview hosts/immutable hosts/production hosts are separate room surfaces: share full host + `?room=` link. Do not promise existing room continuity when retiring branch previews. Current Durable Object game state is in memory; persisted accounts/progression and restart recovery are not established.

## Versioning recommendation and approval sequence

Current hub/v2 package and lockfile root/package entries are `0.0.1`; main has no package manifest. Recommend first consolidated version **0.1.0**, using **MAJOR.MINOR.PATCH**: PATCH fixes, MINOR compatible features, MAJOR breaking supported interfaces; while pre-1.0, explicitly flag breaking changes in release notes and use a MINOR bump for them. Keep save/protocol IDs separately versioned; package version is not a migration mechanism.

After user chooses D1–D8: prepare a consolidation branch from main using hub as the complete gameplay baseline, apply only the approved v2 implementation and any chosen v1 controls, then review the resulting diff. Preserve all docs and asset credits. Make a separate versioning commit updating `package.json` and both root version entries in `package-lock.json` to `0.1.0` (e.g. `npm version 0.1.0 --no-git-tag-version` after reviewing hooks), and document bump/release rules. No automatic tag or release/deploy hook is needed. No versioning change was made in this audit.

Only after integration validation and user review should a later explicit main publication step occur. Do not blindly merge the stacked #8 -> #9 -> #11 PRs: their bases and current deployment effects need review first. Existing local regression note remains untracked historical evidence, not a competing remote branch or proof of fixes in today's head.

## Reproducible evidence inventory

Commands: `git fetch origin`, `git ls-remote --heads origin`, `git log --all --graph`, `git rev-list --left-right --count`, per-path `git diff`, `git cherry`, and `git merge-tree --write-tree` (no index/worktree merge). GitHub PRs #1–#11 and open issues were inspected read-only. Merge-tree reports: hub+v2 conflict only `client/src/main.ts`; hub+v1 conflicts `client/index.html`, `client/src/main.ts`, `client/src/style.css`. Other v2 delta paths auto-merge, which does not resolve D3–D7.

Detached v2 test checkout retained at `C:/Users/Axel/AppData/Local/Temp/jacworks-labs-v2-audit`, with node_modules junction to original checkout. No remote refs were changed. The following expandable inventories give exact commits and changed paths without duplicating shared history.

<details>
<summary>docs/project-foundation — commits and paths relative to origin/main</summary>

```text
(No commits absent from main.)
```

```text
Historical doc tree paths (compare current main before copying):
DOCS/AGENTS.md
DOCS/README.md
README.md
```

</details>

<details>
<summary>docs/design-questionnaire — commits and paths relative to origin/main</summary>

```text
(No commits absent from main.)
```

```text
Historical doc tree paths (compare current main before copying):
DOCS/AGENTS.md
DOCS/GAME_DESIGN_QUESTIONNAIRE.md
DOCS/README.md
README.md
```

</details>

<details>
<summary>docs/jonatan-design-interview — commits and paths relative to origin/main</summary>

```text
(No commits absent from main.)
```

```text
Historical doc tree paths (compare current main before copying):
DOCS/AGENTS.md
DOCS/GAME_DESIGN_INTERVIEW_JONATAN.md
DOCS/GAME_DESIGN_QUESTIONNAIRE.md
DOCS/README.md
README.md
```

</details>

<details>
<summary>docs/axel-design-interview — commits and paths relative to origin/main</summary>

```text
5e9b802 docs: add Axel design interview summary
17906fa docs: clarify Axel AI and PvP preferences
```

```text
Historical doc tree paths (compare current main before copying):
DOCS/AGENTS.md
DOCS/DESIGN_INTERVIEW_AXEL.md
DOCS/GAME_DESIGN_INTERVIEW_JONATAN.md
DOCS/GAME_DESIGN_QUESTIONNAIRE.md
DOCS/README.md
README.md
```

</details>

<details>
<summary>docs/christoffer-design-interview — commits and paths relative to origin/main</summary>

```text
b8106e6 docs: add Christoffer game design interview summary
```

```text
Historical doc tree paths (compare current main before copying):
DOCS/AGENTS.md
DOCS/GAME_DESIGN_INTERVIEW_CHRISTOFFER.md
DOCS/GAME_DESIGN_INTERVIEW_JONATAN.md
DOCS/GAME_DESIGN_QUESTIONNAIRE.md
DOCS/README.md
README.md
```

</details>

<details>
<summary>docs/adrs — commits and paths relative to origin/main</summary>

```text
dc1d1ba docs: add ADR index and workflow
cf04f76 docs: add ADR template
b47e984 docs: adopt architecture decision records
13b91b7 docs: teach agents ADR workflow
```

```text
Historical doc tree paths (compare current main before copying):
DOCS/ADR/0000-template.md
DOCS/ADR/0001-use-architecture-decision-records.md
DOCS/ADR/README.md
DOCS/AGENTS.md
DOCS/GAME_DESIGN_INTERVIEW_JONATAN.md
DOCS/GAME_DESIGN_QUESTIONNAIRE.md
DOCS/README.md
README.md
```

</details>

<details>
<summary>docs/accepted-design-adrs — commits and paths relative to origin/main</summary>

```text
788cdc2 docs: add 0002-player-skill-over-raw-power
2610790 docs: add 0003-builds-change-gameplay
89f867d docs: add 0004-learnable-encounters-and-mechanical-difficulty
649d967 docs: add 0005-avoid-forced-grind-and-infinite-power
750eb7a docs: add 0006-support-solo-and-multiplayer
b98adf6 docs: add 0007-use-babylonjs-for-game-client
3158298 docs: define first prototype requirements
66afc00 docs: index accepted design ADRs
a728a98 docs: surface Babylon.js and prototype scope to agents
```

```text
Historical doc tree paths (compare current main before copying):
DOCS/ADR/0000-template.md
DOCS/ADR/0001-use-architecture-decision-records.md
DOCS/ADR/0002-player-skill-over-raw-power.md
DOCS/ADR/0003-builds-change-gameplay.md
DOCS/ADR/0004-learnable-encounters-and-mechanical-difficulty.md
DOCS/ADR/0005-avoid-forced-grind-and-infinite-power.md
DOCS/ADR/0006-support-solo-and-multiplayer.md
DOCS/ADR/0007-use-babylonjs-for-game-client.md
DOCS/ADR/README.md
DOCS/AGENTS.md
DOCS/GAME_DESIGN_INTERVIEW_JONATAN.md
DOCS/GAME_DESIGN_QUESTIONNAIRE.md
DOCS/PROTOTYPE_01.md
DOCS/README.md
README.md
```

</details>

<details>
<summary>prototype/01-babylon-multiplayer-boss — commits and paths relative to origin/main</summary>

```text
b8f491c prototype: add package.json
aea661f prototype: add tsconfig.json
b56c000 prototype: add vite.config.ts
d94fe5d prototype: add .gitignore
4c4006e prototype: add client/index.html
1edb73a prototype: add client/src/style.css
97972f6 prototype: add shared/protocol.ts
ec84994 prototype: add authoritative multiplayer boss server
73f6d41 prototype: add Babylon arena client
78c4b50 prototype: document local playtest
```

```text
A	.gitignore
M	README.md
A	client/index.html
A	client/src/main.ts
A	client/src/style.css
A	package.json
A	server/index.ts
A	shared/protocol.ts
A	tsconfig.json
A	vite.config.ts
```

</details>

<details>
<summary>prototype/01-chris-hub-pass — commits and paths relative to origin/prototype/01-babylon-multiplayer-boss</summary>

```text
1f6f688 prototype: add thin hub shell
ecb837c prototype: style hub and combat shell
f954a5d prototype: add hub to encounter flow
8277e6f prototype: document hub encounter loop
96aa114 prototype: add Cloudflare multiplayer worker
6abf9e4 prototype: configure Cloudflare deployment
642071e prototype: add Cloudflare build and deploy scripts
5ef1b90 prototype: connect deployed client to Cloudflare websocket
f54667c prototype: document Cloudflare-hosted runtime
8940acc prototype: configure Durable Object previews
c226696 prototype: retrigger Cloudflare preview after build config fix
facf733 prototype: retrigger preview with Cloudflare build command
1e4225b prototype: retrigger preview with Preview URLs enabled
84b5701 prototype: build client from Wrangler before preview
46c3fa6 fix: remove escaped newlines from websocket setup
0f48ac6 fix(prototype): align W/S movement with camera and raise view angle
2182487 feat(prototype): add player HP, ability VFX and server cooldowns
a5c0726 feat(prototype): add player HP, ability VFX and server cooldowns
743f4bc feat(prototype): add player HP, ability VFX and server cooldowns
fdd46dc feat(prototype): add player HP, ability VFX and server cooldowns
f08cc5b feat(prototype): add player HP, ability VFX and server cooldowns
eebe7c8 fix(build): initialize cooldown state on local server players
aa7633b feat(prototype): skill trainer, customizable loadouts, arc spear and holy nova
7f01890 feat(prototype): skill trainer, customizable loadouts, arc spear and holy nova
6232574 feat(prototype): skill trainer, customizable loadouts, arc spear and holy nova
ac593f6 feat(prototype): skill trainer, customizable loadouts, arc spear and holy nova
913b422 feat(prototype): skill trainer, customizable loadouts, arc spear and holy nova
6ee645f feat(prototype): skill trainer, customizable loadouts, arc spear and holy nova
b0b6dee feat: moving boss lazor loot and crafter
4647e20 feat: craft and equip Primitive Wand at hub Wardrobe
8f92eac feat: Green Cone boss and paperdoll equipment effects
7cc3f6d feat: camera options gear inventory and melee prototype skills
a8e0a1f feat: add five selectable server-authoritative class kits
e7a4231 feat: add Defender Rogue and Hard Warden armour tier
700a7ce fix: keep hard scatter event text UTF-8 safe
9927df6  feat: add Shaman room votes and hard boss cover fixes
f93ed8d fix: synchronize private multiplayer hubs and recover room votes
141ea00 feat: add Yellow Ball splits and Hard Yellow Ball encounter
c7d2b20 docs: add skill mutation crafting proposals
627cb70 feat: add authoritative Truffle Man hub asset proof of concept
0a97db1 fix: give Truffle Man a distance-synchronized skeletal walk
0f223f8 feat: add accessible asset credits and licenses panel
8d35d50 feat: publish licensed Truffle Man with skeletal walk in preview
1efeb50 feat: replace Green Cone with synchronized Truffle Man smash boss
e36adfa fix: double Truffle boss visuals and restore mushroom summons
```

```text
M	.gitignore
A	DOCS/ADR/0008-five-prototype-classes.md
A	DOCS/ADR/0009-defender-rogue-hard-warden.md
A	DOCS/ADR/0010-room-votes-and-shaman.md
A	DOCS/ADR/0011-yellow-ball-splits.md
M	DOCS/ADR/README.md
A	DOCS/SKILL_MUTATION_CRAFTING_PROPOSALS.md
A	DOCS/TRUFFLE_MAN_POC.md
M	README.md
M	client/index.html
A	client/public/assets/truffle-man/ATTRIBUTION.txt
A	client/public/assets/truffle-man/truffle.glb
A	client/src/credits.ts
A	client/src/inventory.ts
M	client/src/main.ts
A	client/src/mushroom.ts
M	client/src/style.css
A	client/src/truffle-walk.ts
A	client/src/truffle.ts
A	client/src/vite-env.d.ts
A	package-lock.json
M	package.json
A	playwright.config.ts
A	scripts/convert-truffle.py
A	scripts/inspect-truffle.py
A	scripts/smoke-combat.mjs
A	scripts/smoke-rooms.mjs
A	scripts/smoke-truffle.mjs
A	scripts/smoke-vote-totems.mjs
A	scripts/test-register.mjs
A	scripts/verify-truffle-visuals.mjs
M	server/index.ts
A	shared/balls-network.test.ts
A	shared/balls.test.ts
A	shared/balls.ts
A	shared/camera.ts
A	shared/classCombat.ts
A	shared/classes.test.ts
A	shared/classes.ts
A	shared/cone.test.ts
A	shared/cover.ts
A	shared/encounter.test.ts
A	shared/equipment.test.ts
A	shared/game.test.ts
A	shared/game.ts
A	shared/hard-classes.test.ts
A	shared/hub.test.ts
A	shared/inventory.ts
M	shared/protocol.ts
A	shared/room.test.ts
A	shared/room.ts
A	shared/truffle-smash.test.ts
A	shared/truffle.test.ts
A	shared/truffle.ts
A	tests/balls.spec.ts
A	tests/credits.spec.ts
A	tests/hub.spec.ts
A	tests/truffle-smash.spec.ts
A	tests/truffle-visuals.spec.ts
A	tests/truffle-walk.spec.ts
A	tests/truffle.spec.ts
M	vite.config.ts
A	worker/index.ts
A	wrangler.jsonc
```

</details>

<details>
<summary>prototype/01-game-dev-labs — commits and paths relative to 46c3fa6</summary>

```text
dbe8ca2 prototype: add Game Dev lab menu UI
6dff346 prototype: style Game Dev labs
6ecb8fe prototype: implement Game Dev lab scenes
```

```text
M	client/index.html
M	client/src/main.ts
M	client/src/style.css
```

</details>

<details>
<summary>prototype/01-game-dev-labs-v2 — commits and paths relative to c7d2b20</summary>

```text
fca7325 feat: add complete Game Dev lab module
b796e71 feat: wire complete Game Dev labs into current prototype
ccf4713 style: add Game Dev lab interface
db3102a fix: keep player VFX preview stage clean
```

```text
A	client/src/gameDevLabs.ts
M	client/src/main.ts
M	client/src/style.css
```

</details>
