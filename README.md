# JAC Works

## Prototype 01

Version **0.1.1** improves Truffle Man's skeletal slam and adds his marked poison cloud. See [0.1.1 release notes](DOCS/RELEASE_0_1_1.md) for rules, tuning and validation. Version **0.1.0** consolidated the prototype branches. Gameplay baseline: hub `e36adfa`; Labs v2 is integrated with the retained v1 controls.

The prototype includes a deliberately small **Sanctum Hub** shell before the encounter so the team can evaluate the intended loop without turning Prototype 01 into a world-building project:

`Hub → Expedition Gate → boss encounter → retry / return to hub`

### Run locally

Node 24 or newer / Vite development:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`, then use **Copy room link** and open that full URL on all three devices/windows. A visit without a room code creates a new private room; independently opening the bare URL creates separate rooms. The local prototype WebSocket server listens on port `8787`.

Cloudflare Worker development:

```bash
npm install
npm run dev:cloudflare
```

The deployed build serves the Vite client as Worker static assets and routes `/ws?room=<code>` to the Durable Object named by that room code. The local server uses the same room routing. Room links are bearer invitations, not accounts or matchmaking. Keep the complete host and query string: production, branch previews and immutable preview hosts are different deployment surfaces.

For testing from other devices on the LAN, open the Vite host address on those devices and ensure TCP 5173/8787 are reachable.

### Controls

Hub:
- WASD — move
- E — open the named boss pedestal in the blue Normal (west) or red Hard (east) circle, then propose its encounter
- E at the gold Skill Trainer — choose a class and rearrange its four skills
- E at the purple Crafter — craft Primitive Wand from boss materials

Encounter:
- WASD — move
- 1–4 — selected class skills (slots can be rearranged at the Trainer)
- Aim the pointer at ground for area skills; at enemies for single-target spells/arrows
- Aim at an ally for Targeted Heal / Lightning Shield; Shift forces self, empty ground defaults to self
- WASD or Dash interrupts Aimed Shot, Fireball and Lightning Storm; interruption spends the started cooldown
- R — propose a retry; everyone in the room must accept a new vote
- H — return to the hub

### What this proves

The prototype intentionally focuses on the Prototype 01 hypothesis: server-authoritative multiplayer movement/combat, a shared boss, readable telegraphs, learnable mechanics, coordination, failure and fast retry.

The west Normal circle contains Warden, Yellow Ball and Truffle Man (`greenCone`); the separate east Hard circle contains Hard Warden and Hard Yellow Ball. All five low pedestals are walkable and individually labeled. Follow the central aisle from spawn to reach either circle, clear of the NPC patrol and service stations. E opens only that pedestal's encounter for confirmation. The Propose boss button also offers the complete catalog grouped by difficulty. Selecting a boss proposes an encounter to every connected player in the existing room. The proposer and all other players must explicitly accept before the server starts it. Yellow Ball alternates a telegraphed rolling charge and a bouncing slam. Movement, boss separation, dash, damage, cooldowns and beam intersection are calculated by one shared server simulation used by the local WebSocket server and Cloudflare Durable Object.

LAZOR fires a 14-unit forward beam, dealing 90 damage on intersection with the boss, with a 2.4-second cooldown. Player noses show actual movement direction and keep their facing when stopped. It belongs to Fire Mage; choose that class at the Skill Trainer before entering.

Victory automatically grants Cylinder Tube from Warden or Spherical Ball from Yellow Ball. A miniature material mesh marks the drop. Inventory and victory receipt IDs persist in browser localStorage, preventing repeated snapshots from granting the same reward twice. At the Crafter, spend one of each to produce Primitive Wand, displayed in inventory. This is browser-local prototype persistence, not an account inventory or tamper-proof economy; clients cannot award loot or damage to the server. Clearing browser storage clears these items. Rewards require being connected when the victory snapshot arrives.

Validation: `npm test` runs collision, facing, input validation, directional attack, boss selection/motion, reward and crafting regressions. `npm run build` checks TypeScript and builds the client. The native Vite configuration loader and Node test runner require Node 24+. Truffle Man by dotflare is included under CC BY 4.0; see Options > Credits and `client/public/assets/truffle-man/ATTRIBUTION.txt`.


### Cloudflare deployment

The repository includes `wrangler.jsonc` and a Cloudflare Worker entry point in `worker/index.ts`. The multiplayer room is hosted in a Durable Object so connected players share the same boss state instead of relying on the old local Node process.

External Workers Builds may deploy on main pushes. The following is an explicit manual deployment command, not part of consolidation verification:

```bash
npm run deploy
```


> Cloudflare preview configuration: Preview URLs enabled; Build command `npm run build`; Preview command `npm run build && npx wrangler preview`.

Primitive Wand is reusable Weapon equipment. Old crafted contraptions migrate one-for-one to owned wands, initially unequipped. Arc Spear is unavailable at the trainer; equipping a wand transforms Lightning Mage Arc Blast (`arcBolt`) in any slot for the encounter. Unequipping restores the base skill. The shared server validates saved material receipts and crafting counts before accepting an equipped wand and derives the encounter loadout and damage itself. As before, browser-local saves are not authenticated account ownership; forged local reward ledgers are outside this prototype economy boundary.


Truffle Man is the third gate selection. It slowly pursues the nearest living player, stops to telegraph a 3-unit slam for 1.5 seconds, and summons two mushrooms every third slam (up to six alive). Adds pursue and attack for 12 damage every 1.2 seconds, have 54 HP, and can be hit by Arc Blast / Arc Spear (nearest target), LAZOR, and Holy Nova. Victory grants **Conical Taper**; no separate triangle material exists.

The Crafter also offers **3 Conical Tapers -> Pointy Hat** (Head) and **1 Conical Taper + 1 Spherical Ball -> Pointy Orb** (Offhand). The Wardrobe paperdoll equips and unequips all three reusable items. Gear appears on the hub avatar and on every encounter player from server snapshots. The existing browser save key is preserved; legacy wand ownership and equipment migrate without refunding spent materials.

Pointy Hat gives Dash three independently usable charges. One charge returns every 2.6 seconds; spending another charge does not restart the running recharge. Pointy Orb extends LAZOR's cooldown from 2.4 to exactly 4.4 seconds and applies four 8-damage burn ticks, one per second, on beam hits. A caster refreshes their own burn; separate players' burns coexist. The shared server controls all charges, cooldowns, burn damage, cone AI and add HP. Browser-local receipts remain the prototype's unauthenticated inventory boundary.


Options opens from the top-right button in either scene. Follow Player gently tracks at 20% of player displacement, capped at two units from arena center; zoom ranges from 29 to 40 (default 31). Preferences use a separate browser-local save and do not change inventory receipts. Material counts live at the Crafter. Wardrobe slots show their equipped item or Empty; the owned-gear grid supports equip/unequip while preserving ownership.

Warrior offers Sword Slash (38 damage, 3-unit 120-degree frontal cleave, 1.1s cooldown) and Charging Stab (5-unit directional charge, 60 damage in a narrow 2.2-unit endpoint stab, 3.6s cooldown). Charge stops at arena walls, the boss, or living mushroom summons. Both attacks and their effects are broadcast by the shared authoritative simulation. The charge is an immediate server-resolved dash with a short visual trail.

### Eight selectable classes

Choose class from the hub button or gold Trainer, then Save loadout. Class choice persists in `jacworks-class-v1`; the existing loadout and inventory keys remain. Missing/invalid/old `prototype` IDs migrate to Lightning Mage. A class has exactly its own three skills plus Dash (Vanish temporarily becomes Backstab); rearranging slots is allowed, cross-class mixing is rejected by the server. No mandatory tank/healer party composition exists: every class has repeatable damage, mobility and solo-capable boss targeting.

| Class | Skill 1 | Skill 2 | Skill 3 | Skill 4 |
| --- | --- | --- | --- | --- |
| Shaman | Earth Shock | Fire Totem | Healing Totem | Dash |
| Defender | Stab | Bulwark | Heroic Shield | Dash |
| Rogue | Quick Stab | Vanish / Backstab | Poison Enchant | Dash |
| Warrior | Sword Slash (`swordSwing`) | Charging Stab | Guard | Dash |
| Priest | Holy Nova (`pulseNova`) | Targeted Heal | Holy Light | Dash |
| Lightning Mage | Arc Blast (`arcBolt`) | Lightning Storm | Lightning Shield | Dash |
| Ranger | Aimed Shot | Arrow Rain | Split Shot | Dash |
| Fire Mage | Fireball | LAZOR | Fire Mine | Dash |

These are default orders when choosing a new class. Existing compatible slot preferences are preserved on migration. Holy Nova retains the existing 45 close-range damage and also heals living allies/self for 18. Targeted Heal heals 40; Holy Light deals 32 single-target damage. Friendly targeting requires a living player within 11 units. Guard retains 75% mitigation for 1.6s.

Lightning Storm channels at a chosen point (11-unit placement range, 3-unit radius), delivering six 22-damage pulses over 3s. Lightning Shield follows a living ally/self, pulsing 14 damage within 3 units six times at 1s intervals. Aimed Shot casts for 1s and releases a 58-damage arrow; Fireball casts for 2s and releases a 100-damage projectile with 2-unit splash. Both use 350ms server-controlled travel, require a living enemy within 11 units at release, and can miss if the enemy moves away from impact. Arrow Rain delivers three 28-damage waves within 3.5 units of a selected point. Split Shot fires three 22-damage directional arrows over 10 units; overlapping arrows can hit the same enemy. Fire Mine lasts 12s, triggers once within 2 units of an enemy and explodes for 95 damage within 3 units. Placement and damage are validated by the server; clients send intent only.

Movement or Dash cancels casts/channels; death, disconnect, retry, victory and wipe clean up pending class effects. The server snapshots casts, channels, traps and persistent effect areas, and broadcasts resolved visuals to all players. Player HP shows cast/channel progress. Single-target attacks select the enemy nearest the pointer; directional melee, LAZOR and Split Shot use the avatar's facing. Without a pointer target, area attacks default to the nearest enemy.

Primitive Wand is eligible for Priest and both Mages. Only Lightning Mage receives its Arc Blast → Arc Spear mutation. Pointy Hat remains universal. Pointy Orb is eligible for Lightning Mage and Fire Mage (its existing LAZOR mutation currently benefits Fire Mage). Wardrobe disables ineligible equips; server joins independently filter equipment. Switching class never deletes, sells, refunds or rewrites owned gear, crafting counts or victory receipts; previously equipped items remain saved and become effective again when returning to an eligible class.

Class definitions, eligibility, persistence and gear mutation resolution live in `shared/classes.ts`. New class skill execution/timing lives in `shared/classCombat.ts`, separate from shared boss simulation. This leaves room for optional class-specific skills and gear mutations without permitting cross-class skill mixing. See [ADR-0008](DOCS/ADR/0008-five-prototype-classes.md) for the approved prototype boundary.

Validation: `npm test` covers all eight loadouts, isolated solo damage, targeting, casts/channels and interrupts, effects, cooldowns, gear/inventory migration and existing boss mechanics. `node scripts/smoke-combat.mjs` starts a disposable local server and verifies two real WebSocket clients with Warrior, Priest + Lightning Mage, and Ranger + Fire Mage, including shared snapshots and matching FX. These checks do not establish final encounter balance or replace human playtesting. `npm run build` validates TypeScript and produces the Vite client.


### Defender, Rogue and Hard Warden

Defender Stab deals 32 frontal damage at 2.8-unit reach (0.9s cooldown). Bulwark lasts 6s, halves walking speed and incoming damage (10s cooldown). Heroic Shield targets a living ally within 11 units, jumping along a collision-tested path; self targeting stays still. It absorbs 80 damage on the caster and 40 on a separate ally for 6s (9s cooldown). Shields refresh to the larger amount, never stack; mitigation applies before absorption. Aim at an ally or hold Shift for self.

Rogue Quick Stab deals 24 frontal damage at 2.8-unit reach (0.6s cooldown). Vanish makes the Rogue invisible to enemy target selection and pursuit for exactly 4s (8s cooldown), replacing its own slot with Backstab. Allies still see a translucent avatar; existing area attacks still hit. Backstab ends Vanish and restores its skill without resetting cooldown: 80 damage from behind, otherwise 24. Rear position is evaluated against the nearest visible living player's direction from the enemy; a solo invisible Rogue receives the rear bonus. Poison Enchant lasts 6s (9s cooldown); successful stabs apply four server-resolved 6-damage ticks, one per second. Separate stab applications coexist. Death, retry and encounter end clear temporary buffs and restore Vanish.

The red **Hard Warden** circle is right of the normal Warden circle in the hub; press E there to propose it. The original gate selection still offers all bosses. Every boss selection now requires a unanimous room vote. Hard Warden has 3000 HP and 64 damage per hit, compared with normal Warden's 1800 HP and 48 damage. Its targeted blast has 4.2-unit radius. Triple scatter deploys marker 1 immediately, marker 2 after 0.5s and marker 3 after 1.0s. Each reads the tracked target's current position at its own deployment, then fixes that location for its independent 1.5s telegraph and explosion. The markers trail old positions rather than appearing together. Its 360-degree sweep covers the arena; hide behind either of the two cylindrical pillars at (-4, 0) and (4, 0). The server tests pillar occlusion at impact. Both pillars block walking, Dash, Charging Stab and Heroic Shield movement; their visible radius matches cover geometry.

Hard victory grants **Large Cylinder**, separately from normal Warden's **Cylinder Tube**. The Crafter exchanges **3 Large Cylinders → Redtube Armour**, reusable chest gear for Warrior, Defender and Rogue. Armour reduces boss damage by 5% (does not reduce add damage), and expands Warrior Sword Swing from 3 units / 120 degrees to 4 units / 180 degrees. Owned armour, equipped slot and spent materials persist under the existing inventory save key. Switching to an ineligible class makes saved armour inactive without deleting it. Shields, invisibility, poison, class swaps, movement, damage and gear eligibility are server authoritative; the existing unauthenticated browser-local receipt boundary remains unchanged.

Validation includes shield mitigation/expiry, Vanish targeting and slot restoration, poison timing, pillar collision/occlusion, hard attacks/loot, recipe persistence, armour restrictions and cleave. The WebSocket smoke also exercises Defender + Rogue in Hard Warden with matching FX and shared buff/shield/equipment snapshots. These automated checks do not replace human visual QA or multiplayer balance playtesting. See [ADR-0009](DOCS/ADR/0009-defender-rogue-hard-warden.md).

### Room votes, attack cover and Shaman

Hub tabs stay connected to the existing room; this does not add matchmaking or a global hub. **Propose boss** or the gate opens selection. The vote panel names the proposed boss and shows each connected player's acceptance. Nobody, including the proposer, is implicitly accepted. Decline, joining/leaving connections, returning to the hub or 30 seconds without unanimity cancels. Retry also requires a new vote. Proposal IDs, strict boolean votes and socket-bound player identity reject stale, duplicate and spoofed acceptance. A legacy `ready` message can propose but cannot accept. Returning to the hub resets the shared encounter for this thin room prototype; late arrivals during a fight join the current encounter. Disconnected or stalled connections show their status and automatically reconnect to the same room, obtaining a new socket identity; a membership change cancels any pending vote. Saved names and loadouts are resent after welcome. Hub avatars and movement now use shared server snapshots, and the room panel shows names and connected player count. All connected hub tabs count toward unanimity.

Hard pillars block melee hits, direct targeted attacks, projectiles, Split Shot and LAZOR (including burn application). Shared first-intersection geometry clips rendered beams/arrows/projectiles. A projectile whose path hits cover produces no damage or Fireball splash through it. Ground-area placement requires caster line of sight; AoE damage/healing requires line of sight from its epicentre to the recipient. Existing poison/burn already applied to a target continues ticking. Boss marked circles remain dangerous around cover; the Hard Warden sweep is the boss attack explicitly blocked by pillars.

Shaman adds **Earth Shock** (36 instant targeted damage, 11-unit range, 1s cooldown), **Fire Totem** and **Healing Totem** (11-unit placement range, 5s cooldown each), plus Dash. Totems have **1 HP**, last 15s and allow one of each kind per Shaman; replacing one leaves the other and other players' totems intact. Fire Totem fires a 24-damage fireball at the nearest visible enemy within 11 units every second, with 350ms travel and a fixed release position. Healing Totem restores 8 HP each second to living allies/self within 4 units, capped at max HP; it never revives. Boss targeting (except player-tracking Hard scatter), boss areas/motion and pursuing add attacks can select or destroy totems. Death/disconnect of the owner, reset, victory and wipe remove them. Both totems use cover checks. Gear eligibility and all existing class/inventory save keys remain unchanged; Shaman can use the universal Pointy Hat.

Vanish and Backstab descriptions show the server's shared 24 normal / 80 rear damage values, the rear/solo condition, ending Vanish and the optional four 6-damage Poison Enchant ticks (24 additional damage over time). Descriptions are also available as ability tooltips.

Validation: `npm test`, `npm run build`, `node scripts/smoke-combat.mjs`, and `node scripts/smoke-vote-totems.mjs`. The latter runs two actual WebSocket clients through decline, unanimous acceptance, stale/duplicate/spoofed votes, disconnect, two Shamans' owned totems, damage, healing and FX, then verifies three Hard Warden marker deployments and their independently tracked positions. Set `SMOKE_WS_URL` to a quiet preview WebSocket endpoint to run the same checks on Cloudflare. Timings are resolved on the 50ms simulation tick; server stalls delay deployment while preserving 0.5s separation and a full telegraph rather than retroactively guessing player positions. Tests and browser QA establish functionality, not final balance or four-person human playtesting.


### Three-player hub regression checks

`npm run smoke` also runs `scripts/smoke-rooms.mjs`: three real WebSocket clients, a fourth isolated room, named membership, synchronized hub movement, shared proposal ID, two votes waiting for the third, decline, disconnect/rejoin, stale votes, join cancellation and shared return. `SMOKE_WS_URL=ws://localhost:8787/ws` (or a `wss://` preview endpoint) targets another server; it generates disposable room codes and never uses an active human room.

Run `npx playwright install chromium`, then `npm run test:browser` for three independent browser contexts plus an isolated fourth. The same UI suite can target a built Worker using `BROWSER_URL=http://localhost:18790` or the branch preview HTTPS URL. For the actual Durable Object runtime: run `npm run dev:cloudflare -- --port 18790` (or `npx wrangler dev --port 18790`), then set `SMOKE_WS_URL=ws://localhost:18790/ws` and run `node scripts/smoke-rooms.mjs`.

Live investigation on 2026-10-14: the branch preview served the vote-enabled game; `https://jacworks.jacworks2026.workers.dev` served only `Hello world`. The old Worker routed every socket on a deployment to `prototype-01`, so unrelated visitors could block unanimity. Hub rendering discarded lobby snapshots and moved only a local avatar, giving connected humans the appearance of different hubs. Hub disconnections were invisible and never reconnected. No three-voter arithmetic defect was found in the authoritative vote state; fixed membership, explicit proposer acceptance, strict booleans and proposal IDs remain enforced. The reported session's exact URLs/connections were not recorded, so its precise sequence cannot be reconstructed.

The historical hub preview is **https://prototype-01-chris-hub-pass-jacworks.jacworks2026.workers.dev**. For the current deployment, create a room once on its host and share the full room link. The legacy no-code WebSocket route remains solely for existing protocol clients; current browser visits always generate or retain an explicit room code.

### Yellow Ball splits and Hard Yellow Ball

Normal Yellow Ball splits once at **50% HP** into two balls. **Hard Yellow Ball** is a separate gate selection using the existing unanimous room vote. It splits at 50%, each child splits at its own 50%, and each grandchild splits at its own 50%, producing up to eight final balls. Defeat every living ball to win. The primary body retires when it splits; children have unique server IDs and health bars, and the boss bar displays summed living HP as a fraction of the original pool (continuous across splits). The label shows the active ball count.

| Tier | Primary HP | Child HP | Grandchild HP | Final HP | Damage per generation |
| --- | --- | --- | --- | --- | --- |
| Normal | 1800 | 450 (two final balls) | — | — | 48 / 24 |
| Hard | 2400 | 600 | 150 | 37.5 | 36 / 28 / 20 / 12 |

A child starts at full health with one quarter of its parent's maximum HP: the two children preserve the parent's remaining half-health pool. Damage stops at a pending split threshold; excess damage and subsequent hits before that simulation tick cannot skip generations. Children appear on the next tick, with an initial 1.8s grace period; siblings' attacks start 0.5s apart. Split cancellation removes the parent's motion and warnings. Existing targeted projectiles and damage-over-time do not transfer onto children; ground splash can still hit living balls at impact.

Balls alternate rolls and slams, selecting the nearest living visible player or totem and fixing the warned destination. Radius shrinks from 1.25 by a factor of 0.72 per generation. A roll travels up to ten units in 0.8 / 0.7 / 0.6 / 0.5s, after a 1.5s line warning. Slams fly for 1.0 / 0.9 / 0.8 / 0.7s; their landing radius is 2.8 / 2.35 / 1.9 / 1.45. Normal slams have a 1.5s warning. Hard slams chain **three consecutive bounces**, each with a fresh 1.1s warning and newly sampled target position after the preceding landing. Stalled ticks preserve the full next warning. Normal recovery is 1.3s; hard recovery is 1.8s plus 0.45s per generation. Smaller balls move faster but deal less damage, have smaller landing zones and longer recovery. Walking, Dash and charges respect their size; boss armour mitigation applies to every ball's attack.

Normal victory still grants Spherical Ball. Hard victory grants **Large Sphere**, represented by a larger sphere drop and shown separately at the Crafter. It has no recipe yet and cannot substitute for Spherical Ball. The existing inventory key, old receipts, equipment and recipes remain compatible. Receipt replay never grants a second material.

Validation adds threshold/overkill, generation, projectile/AoE, targeting, collision, bounce-chain and reward tests. Two real WebSocket clients receive identical serialized split IDs, positions, heights, HP and rewards from a controlled authoritative fixture. The browser suite exercises real hard-boss selection/voting, then uses received-snapshot fixtures for eight-ball presentation and receipt persistence; it is not a human-played eight-ball victory. Existing real-server combat, votes/totems and room smokes remain required. Tuning is a playable prototype proposal, not a completed solo/four-player balance study.


### Consolidated prototype 0.1.0

Game Dev opens a separate in-game Labs area with player VFX and character/enemy/boss presentation studies. VFX speed/scale and character health-bar controls are available. Truffle Man uses the same licensed animated model as gameplay, with mushroom summons; the internal `greenCone` ID and existing save keys remain stable. Boss studies are illustrative, not authoritative combat simulations.

**Labs remains connected to the live room.** Combat continues, your character remains vulnerable and your vote is required. Movement and ability input are blocked during inspection. Return to live room restores its current state, including an encounter started while Labs was open. Share the full host plus room link; different preview hosts do not share rooms.

The consolidated scope includes accepted ADR extensions and prototype browser-local economy. Authenticated persistence and skill-mutation crafting proposals are future work. Source rights remain unchanged; no project license is assigned. Preserve the separate Truffle Man attribution and Credits UI.

Version/release policy: [DOCS/RELEASE_RULES.md](DOCS/RELEASE_RULES.md). Deployment uses externally configured Workers Builds; pushing main may deploy production. Never assume a source merge preserves in-memory Durable Object sessions.

For isolated local browser checks when port 8787 is occupied, set `TEST_WS_PORT=18791` before `npm run test:browser`. The runner starts its own Node backend and passes that port to Vite through `VITE_WS_PORT`; deployed `/ws` routing is unchanged. The four-context hub regression allows 180 seconds for software-rendered scenes.
