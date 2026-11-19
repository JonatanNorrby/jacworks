# JAC Works

Draft design inspiration: [unified skill & evolution idea library](DOCS/ABILITY_IDEAS/JAC_Works_Ability_Idea_Library.md) — Project Energy and earlier JAC ideas, with provenance and proposal status. [Browse guide / Excel companion](DOCS/ABILITY_IDEAS/README.md).

## Prototype 01

**Current release: 0.1.15.** Class switching and talent save synchronization now wait for the initialized server profile; mushroom summons are correctly centered on their actual positions; the Rune Golem gets a lowered-arm idle and slow locomotion pose; Fracturer's destroyed corners fill with visible amethyst/sapphire/ice crystals without changing hazard rules. See [v0.1.15 release notes](DOCS/RELEASE_0_1_15.md) and [ADR-0021](DOCS/ADR/0021-crystalline-fracturer-collapse.md).

**Prior release: 0.1.14.** DiceFree's animated Mushroom Monster now replaces Truffle Man's summoned mushrooms, and the converted, textured Rune Golem replaces Fracturer in Solo, Double and Chaos fights. Fracturer now **creeps at just 0.16 world units per second** instead of remaining stationary, while Warden/Queen remain anchored and all existing Fracturer mechanics are retained. JAC Works' player spell VFX now use 25 optimized actual sprite textures from DiceFree's **Magic Effects FREE** library, adapted into Babylon.js projectiles, magic circles, shields, hit effects and persistent fields. The existing Game Dev Labs previews the imported assets. See [v0.1.14 release notes](DOCS/RELEASE_0_1_14.md) and [ADR-0020](DOCS/ADR/0020-magic-effects-animated-mushrooms-crawling-fracturer.md).

**Prior release: 0.1.13.** Chaos Arena now runs the full normal attack patterns of all five bosses simultaneously: fixed Warden, Fracturer and Ant Queen; genuinely moving Yellow Ball and Truffle Man; normal Warden blast/sweep/scatter, Truffle smash/poison/mushrooms, Yellow Ball rolling/bouncing/splitting, Fracturer targeted hits/cardinal safe sectors/collapsing corners, and Queen's workers/Royal-death objective/rockfall. Anchored bosses sit on traversable safe central corridors. Warrior's 30-second ideal DPS rises from 53.5 to **72.2** after Sword Slash **38 → 50** and Charging Stab **60 → 85**, retaining Guard and taunt. See [v0.1.13 notes](DOCS/RELEASE_0_1_13.md) and [ADR-0019](DOCS/ADR/0019-chaos-boss-mechanic-parity-and-warrior.md).

**Prior release: 0.1.12.** Rogue now deals **32 Quick Stab**, **42 normal / 110 rear Backstab**, and **four 8-damage Poison Enchant ticks** at an improved 3.2-unit melee reach. Venom Fang deals two 18-damage ticks. Missed Backstabs no longer waste the remaining Vanish window, and temporary Backstab always reverts to Vanish when invisibility expires without resetting the 8-second cooldown. An ungeared 30-second stationary-boss test rose from 77.7 to 104.0 ideal DPS, balancing its close-range exposure. See [v0.1.12 balance and regression notes](DOCS/RELEASE_0_1_12.md).

**Prior release: 0.1.11.** Ranger's five special pieces now occupy distinct weapon, head, offhand, armour and boots slots, and each class remembers its own complete outfit. Defenders and Warriors can control threat, boss HP grows by +50% of base per additional player, and Fireball has improved single-projectile damage without the old triple-projectile one-shot. Every class now has **three 4-deep talent branches** (104 nodes total). **Chaos Arena** offers all five base bosses simultaneously in a huge ring, with a unique Chaos Sigil and 11th possible first-clear talent point. A new Guide beside Options records actually encountered bosses/mechanics, and the Crafter shows material sources. See [v0.1.11 notes](DOCS/RELEASE_0_1_11.md) and [ADR-0018](DOCS/ADR/0018-chaos-threat-class-loadouts-codex.md).

**Prior release: 0.1.10.** A southern-row Nest circle now joins the other boss gates; the Queen cave expands to 32x32 world units (server collision bound 14.5 radius). Shaman Royal gear is a Totemstaff weapon, Defender Royal gear is Carapace Plate armour, and Ranger keeps an offhand quiver. Two fourth-tier talents per class bring the total to 72, with unchanged 10 first-clear points and free respec. See [v0.1.10 notes](DOCS/RELEASE_0_1_10.md) and [ADR-0017](DOCS/ADR/0017-nest-layout-gear-slots-and-fourth-talents.md).

**v0.1.9 introduced the Ant Queen:** kill four Royal Guards to damage the otherwise invulnerable queen, while worker waves and rockfall increase pressure. Hard Warden gains a close-range safe-circle attack, player HP bars always face south, all eight talent trees gain two more nodes, and Royal Ant Chitin crafts eight class-specific skill-mutating items. See [v0.1.9 design and balance notes](DOCS/RELEASE_0_1_9.md) and [ADR-0016](DOCS/ADR/0016-ant-queen-objective-and-extended-builds.md). Fire Mine afterglow damage, per-arrow Split Shot, Warden facing, slot-filtered Wardrobe, and the Fracturer's cardinal-safe-sector attack are implemented. See [v0.1.8 release notes](DOCS/RELEASE_0_1_8.md) and [ADR-0015](DOCS/ADR/0015-fracturer-cardinal-eruption.md). Options now includes twelve configurable keyboard shortcuts with conflict warnings and restore defaults. See [release 0.1.7](DOCS/RELEASE_0_1_7.md) and [ADR-0014](DOCS/ADR/0014-browser-local-rebindable-controls.md). Eight class talent trees now have real prerequisite arrows and two branches each; eight class-specific recipes use Twin Core and Fractured Spore to change existing abilities. See [0.1.6 release notes](DOCS/RELEASE_0_1_6.md) and [ADR-0013](DOCS/ADR/0013-branching-talents-and-duo-gear.md). Progression and inventory remain browser-local in this prototype.


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

The Sanctum Hub also has a direct **Wardrobe** button. In the Wardrobe, filter owned gear by slot (All / Weapons / Head / Offhand / Armour / Boots) or use the in-world wardrobe.

All listed keys are defaults. Open **Options → Keybindings** to rebind movement, interaction, abilities, boss retry, return to hub and room chat. Changes are saved to this browser and reflected in the HUD immediately; Escape cancels a change and Restore Defaults resets all bindings.

Hub:
- WASD — move
- Find the Nest circle west of Normal on the southern boss-circle row; defeat four Royal Guards to damage the invulnerable Ant Queen
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

Warrior offers Sword Slash (50 damage, 3-unit 120-degree frontal cleave, 1.1s cooldown) and Charging Stab (5-unit directional charge, 85 damage in a narrow 2.2-unit endpoint stab, 3.6s cooldown). Charge stops at arena walls, the boss, or living mushroom summons. Both attacks and their effects are broadcast by the shared authoritative simulation. The charge is an immediate server-resolved dash with a short visual trail.

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

Rogue Quick Stab deals **32 frontal damage at 3.2-unit melee reach** (0.6s cooldown). Vanish makes the Rogue invisible to enemy target selection and pursuit for exactly 4s (8s cooldown), replacing its own slot with Backstab. Allies still see a translucent avatar; existing area attacks still hit. **A successful** Backstab ends Vanish and restores its skill without resetting cooldown: **110 damage from behind, otherwise 42**. A whiffed Backstab can be retried while invisible, and the Backstab slot returns to Vanish automatically at invisibility expiry, retaining the full 8s cooldown. Rear position is evaluated against the nearest visible living player's direction from the enemy; a solo invisible Rogue receives the rear bonus. Poison Enchant lasts 6s (9s cooldown); successful stabs apply four server-resolved **8-damage** ticks, one per second. Separate stab applications coexist. Venom Fang trades four base ticks for two faster **18-damage** ticks; Nightshade Hood doubles tick count. Death, retry and encounter end clear temporary buffs and restore Vanish.

The red **Hard Warden** circle is right of the normal Warden circle in the hub; press E there to propose it. The original gate selection still offers all bosses. Every boss selection now requires a unanimous room vote. Hard Warden has 3000 HP and 64 damage per hit, compared with normal Warden's 1800 HP and 48 damage. Its targeted blast has 4.2-unit radius. Triple scatter deploys marker 1 immediately, marker 2 after 0.5s and marker 3 after 1.0s. Each reads the tracked target's current position at its own deployment, then fixes that location for its independent 1.5s telegraph and explosion. The markers trail old positions rather than appearing together. Its 360-degree sweep covers the arena; hide behind either of the two cylindrical pillars at (-4, 0) and (4, 0). The server tests pillar occlusion at impact. Both pillars block walking, Dash, Charging Stab and Heroic Shield movement; their visible radius matches cover geometry.

Hard victory grants **Large Cylinder**, separately from normal Warden's **Cylinder Tube**. The Crafter exchanges **3 Large Cylinders → Redtube Armour**, reusable chest gear for Warrior, Defender and Rogue. Armour reduces boss damage by 5% (does not reduce add damage), and expands Warrior Sword Swing from 3 units / 120 degrees to 4 units / 180 degrees. Owned armour, equipped slot and spent materials persist under the existing inventory save key. Switching to an ineligible class makes saved armour inactive without deleting it. Shields, invisibility, poison, class swaps, movement, damage and gear eligibility are server authoritative; the existing unauthenticated browser-local receipt boundary remains unchanged.

Validation includes shield mitigation/expiry, Vanish targeting and slot restoration, poison timing, pillar collision/occlusion, hard attacks/loot, recipe persistence, armour restrictions and cleave. The WebSocket smoke also exercises Defender + Rogue in Hard Warden with matching FX and shared buff/shield/equipment snapshots. These automated checks do not replace human visual QA or multiplayer balance playtesting. See [ADR-0009](DOCS/ADR/0009-defender-rogue-hard-warden.md).

### Room votes, attack cover and Shaman

Hub tabs stay connected to the existing room; this does not add matchmaking or a global hub. **Propose boss** or the gate opens selection. The vote panel names the proposed boss and shows each connected player's acceptance. Nobody, including the proposer, is implicitly accepted. Decline, joining/leaving connections, returning to the hub or 30 seconds without unanimity cancels. Retry also requires a new vote. Proposal IDs, strict boolean votes and socket-bound player identity reject stale, duplicate and spoofed acceptance. A legacy `ready` message can propose but cannot accept. Returning to the hub resets the shared encounter for this thin room prototype; late arrivals during a fight join the current encounter. Disconnected or stalled connections show their status and automatically reconnect to the same room, obtaining a new socket identity; a membership change cancels any pending vote. Saved names and loadouts are resent after welcome. Hub avatars and movement now use shared server snapshots, and the room panel shows names and connected player count. All connected hub tabs count toward unanimity.

Hard pillars block melee hits, direct targeted attacks, projectiles, Split Shot and LAZOR (including burn application). Shared first-intersection geometry clips rendered beams/arrows/projectiles. A projectile whose path hits cover produces no damage or Fireball splash through it. Ground-area placement requires caster line of sight; AoE damage/healing requires line of sight from its epicentre to the recipient. Existing poison/burn already applied to a target continues ticking. Boss marked circles remain dangerous around cover; the Hard Warden sweep is the boss attack explicitly blocked by pillars.

Shaman adds **Earth Shock** (36 instant targeted damage, 11-unit range, 1s cooldown), **Fire Totem** and **Healing Totem** (11-unit placement range, 5s cooldown each), plus Dash. Totems have **1 HP**, last 15s and allow one of each kind per Shaman; replacing one leaves the other and other players' totems intact. Fire Totem fires a 24-damage fireball at the nearest visible enemy within 11 units every second, with 350ms travel and a fixed release position. Healing Totem restores 8 HP each second to living allies/self within 4 units, capped at max HP; it never revives. Boss targeting (except player-tracking Hard scatter), boss areas/motion and pursuing add attacks can select or destroy totems. Death/disconnect of the owner, reset, victory and wipe remove them. Both totems use cover checks. Gear eligibility and all existing class/inventory save keys remain unchanged; Shaman can use the universal Pointy Hat.

Vanish and Backstab descriptions show the server's shared 42 normal / 110 rear damage values, the rear/solo condition, successful Backstab ending Vanish and the optional four 8-damage Poison Enchant ticks (32 additional damage over time). Descriptions are also available as ability tooltips.

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

### Room chat

Press Enter to open the compact bottom-left chat, Enter to send, or Esc to cancel. Typing stops movement and captures gameplay keys. Recent messages fade after ten seconds; opening input reveals up to 60 messages retained in this tab. Chat stays with the current room through hub, fights and reconnects; offline sends are not queued and new connections do not receive past history. System messages announce named joins/leaves, votes, encounter starts, wipes, victories and return to hub.

Both Node and Durable Object transports broadcast through the same room Game authority. Sender identity comes from the socket, text is trimmed, control and bidirectional formatting characters are removed, messages are capped at 240 UTF-16 code units, and each connection can send once per second. Empty/invalid/rate-limited messages are silently ignored. Names receive the same sanitizing with a 24-character limit. Messages render as DOM text. No global chat, direct messages or accounts are added.


### Hard Truffle Man, party status and damage meter (November 2026)

The red Hard boss circle now has **Hard Truffle Man**, with 3,000 HP, larger/faster smash attacks, more resilient mushroom summons and enhanced poison clouds. Each victory grants each participating player **one Corrupted Truffle Spore** (the normal Truffle Man still grants a Conical Taper).

At the Crafter, **3 Corrupted Truffle Spores → 1 Sporebound Totem**. Equip it in the offhand slot as **Shaman**. Its bonuses are server-authoritative: Fire Totem projectiles deal **30** damage instead of 24, and Healing Totem pulses restore **10** HP instead of 8. The recipe and item remain saved in the existing browser inventory; the server checks class eligibility on join.

Connected players have individually identifiable colors and visible HP bars in the world and roster. The **DPS meter** tracks actual boss/add damage per player in the shared simulation (including DoTs and summons), showing total damage and encounter DPS. Its visibility can be toggled in-game.

The feature integration includes tests for crafting, materials, class restrictions, encounter reward, totem behavior and meter accounting. The GitHub workflow `Verify game` runs tests, the production build and multiplayer smoke checks where GitHub Actions is enabled.


### Version 0.1.3: class gear, combat meters and double encounters

**Single-effect class gear:** Every offhand below improves one ability only. The old Sporebound Totem remains in existing saves but now improves **Fire Totem only** (30 damage versus 24); the separate **Verdant Mender Totem** (2 Corrupted Truffle Spores) improves **Healing Totem only** (10 HP/tick versus 8). The old Sporefang Quiver remains owned but now improves **Aimed Shot only** (70 versus 58). The new **Sporestorm Quiver** improves **Arrow Rain only** (34 versus 28 damage per wave) and **Splitthorn Quiver** improves **Split Shot only** (26 versus 22 per arrow); all three Ranger quivers individually cost 1 Large Cylinder + 1 Corrupted Truffle Spore.

**Other class items:** The Priest's **Sunlit Reliquary** costs 1 Large Sphere + 1 Conical Taper and improves Targeted Heal from 40 to 55. The Rogue's **Venom Fang** costs 1 Conical Taper + 1 Cylinder Tube and increases Poison Enchant ticks from 6 to 9. The Defender's **Bulwark Crest** costs 1 Large Cylinder + 1 Spherical Ball and increases Bulwark's duration from 6s to 8s. All occupy the offhand slot, are class-restricted on the server, and require actual boss material receipts.

The Crafter now has **Shared** plus one menu for every class. The Wardrobe shows each owned item's single effect and class eligibility. Legacy inventory and item counters are kept to preserve saved ownership, with the old hybrid items deliberately retaining just their first effect after the split.

The in-fight combat meter has **Damage** and **Healing** tabs. Healing records only actual HP restored (never overhealing) per contributing player; the meter reports HPS as well as cumulative healing and continues to show the result after victory.

**Lobby practice:** The training dummies have moved slightly east and regenerate after being defeated. Ability hotkeys 1–4 are available throughout the hub, including self buffs, heals, Dash, visual effects and offensive practice on nearby training dummies. Practice does not affect the encounter damage or healing meter.

**Double encounters (from the Expedition Gate):** **Yellow Ball + Warden** and **Truffle Man + Fracturer** put two independent, attackable enemies with separate HP in the same arena. Both enemies contribute telegraphed attacks; Fracturer still collapses marked corners and Truffle Man still summons mushrooms and deploys poison. Both must die to win, and each encounter awards one material receipt per boss. Because the two fights are simultaneous, the secondary boss uses its own telegraphed attacks rather than the complete solo Yellow Ball split sequence; this is the first playable dual-boss implementation.

Options displays Client build version/commit and Server protocol version, both 0.1.3 when the deployment is current.


### Version 0.1.4: class identity, item tradeoffs, and the first talent tree

**Class-restricted existing equipment:** Primitive Wand is now Lightning Mage only, Pointy Orb Fire Mage only, and Redtube Armour Warrior only. A mismatched saved item remains in inventory but cannot be equipped by an ineligible class. The class Crafter lists the target gear slot on every recipe.

**Shaman:** The **Sporebound Fire Totem** transforms Fire Totem into a green poison-cloud totem: it targets enemies within 7 units rather than 11 and places radius-1.5 clouds dealing 8 poison damage per tick for three ticks. The cloud is displayed on the ground. The **Verdant Mender Totem** now heals **16 HP per pulse** within **2 units**, rather than 10 HP within 4. These are mutually exclusive offhands.

**Defender:** **Bulwark Crest** keeps its 8-second duration and increases Bulwark damage reduction from 50% to **65%** while active.

**Rogue:** **Venom Fang** is an offhand that changes Poison Enchant from four ticks of 6 to **two ticks of 15**. **Nightshade Hood** is a new head-slot craft (2 Conical Tapers + 1 Corrupted Truffle Spore) that doubles Poison Enchant's tick count. The hood and Venom Fang can be equipped together, producing **four ticks of 15**.

**Priest:** **Shadow Hat**, crafted with 1 Large Sphere and 1 Conical Taper, occupies the head slot and makes Targeted Heal a **40-damage hostile cast** against bosses/adds rather than an ally heal. It can be paired with a Priest offhand.

**Ranger:** **Splitthorn Quiver** now fires **five** Split Shot arrows at **16 damage each**, compared with three at 22. **Sporestorm Quiver** makes Arrow Rain waves deal **35** damage each with **half radius (1.75)**. **Sporefang Quiver** makes Aimed Shot deal **100** damage but doubles cast time to **2 seconds**. Each is an exclusive offhand, so only one tradeoff can be active.

**Fire Mage:** **Ember Wand**, crafted from 1 Cylinder Tube and 1 Corrupted Truffle Spore, occupies the weapon slot and changes Fireball to **50 damage with a 1-second cast**. **Cinderweave Armour**, crafted from 2 Large Cylinders and 1 Spherical Ball, occupies the armour slot and launches **three separate Fireball projectiles**. Both can be equipped together for three 50-damage fireballs per cast.

**Talent tree:** A large, interactable tree is in the eastern hub at (9, 3). Walk nearby and press **E**, or use the hub's **Talent Tree** shortcut. There is a tab for each of the eight classes. Each automatically starts with one unlocked 1/1 node, **Unyielding Force**, providing **+3% damage dealt and -3% damage taken**. The bonuses are enforced by the actual multiplayer Node and Cloudflare game rooms. Base-combat regression fixtures can opt out explicitly to retain unmodified per-skill testing; new live-talent tests verify the boosts. No talent points or extra nodes are unlocked yet.

**Training area:** The three target dummies now sit at x=-11, further west while retaining the same 5-second respawn.

**Release status:** Client and Server protocol 0.1.4 will appear in Options after both deployments update.


### v0.1.5: Double-boss arenas, earned talents, and lobby practice repairs

**Double circle:** The hub has a third, purple **Double** encounter ring at (8.9,-6.5) with its own two interactable pedestals: Yellow Ball + Warden, and Truffle Man + Fracturer. The Normal/Hard rings remain separate. Double victories award **one newly introduced material**, not two normal-mode materials: **Twin Core** for Yellow Ball + Warden and **Fractured Spore** for Truffle Man + Fracturer. Each drop is a receipt in the same browser-local inventory system, available for future recipes.

**Real dual-boss mechanics:** Yellow Ball uses its genuine server-authoritative roll/bounce telegraphs and splits at 50% HP while the Warden keeps attacking. All split children must die before the encounter is won. During Truffle Man + Fracturer, the primary Truffle uses the textured Truffle boss model, including walking/smash animation; the Fracturer continues collapsing arena sections. Each boss retains its own health pool.

**Progression:** Every player starts with **zero spent talent ranks and zero points**. The first completed victory against a specific encounter ID grants **one point**; repeating that encounter grants no more. The nine current distinct encounters therefore offer up to nine points. Talent points are a shared pool across the class tabs. **Unyielding Force** costs one point and grants +3% damage dealt/-3% damage taken only when actually unlocked. The Shaman branch adds **Parting Gift** (requires Unyielding Force; Fire and Healing Totems explode for 30 damage in a 3-unit radius on natural expiration) and **Violent Farewell** (requires Parting Gift; the same explosion also triggers if the totem is destroyed early). Replacing or removing a totem due to logout does not explode it. Respeccing any class is completely free, returns that class's spent points to the shared pool, and never resets recorded victories.

Talent progress follows the existing **browser-local save** approach and is included in the join handshake and server-validated allocations during active room sessions. This is not yet cross-device or tamper-resistant account progression; persist an authenticated account identity before making the system suitable for competitive public progression.

**Lobby practice:** The ability bar stays visible in the lobby, displays actual server-tracked cooldowns, and shows ability VFX outside encounters. Fire Totem and Healing Totem now place visible practice totems lasting 15 seconds in the hub. Heal pulses affect nearby party members; Dash is recharged on the actual cooldown instead of only appearing to fire. The target dummies remain on the far-west lawn.

**Version:** Options displays Client/Server 0.1.5 when deployed. The multiplayer game is verified by unit tests, multiplayer smoke, and the Chromium release suite before merging.
