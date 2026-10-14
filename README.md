# JAC Works

## Prototype 01

Base prototype branch: `prototype/01-babylon-multiplayer-boss`

This stacked prototype pass adds a deliberately small **Sanctum Hub** shell before the encounter so the team can evaluate the intended loop without turning Prototype 01 into a world-building project:

`Hub → Expedition Gate → boss encounter → retry / return to hub`

### Run locally

Node 24 or newer / Vite development:

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in multiple browser windows. The local prototype WebSocket server listens on port `8787`.

Cloudflare Worker development:

```bash
npm install
npm run dev:cloudflare
```

The deployed build serves the Vite client as Worker static assets and routes `/ws` to the shared Prototype 01 game room.

For testing from other devices on the LAN, open the Vite host address on those devices and ensure TCP 5173/8787 are reachable.

### Controls

Hub:
- WASD — move
- E — enter the encounter when standing near the Expedition Gate
- E at the gold Skill Trainer — choose a class and rearrange its four skills
- E at the purple Crafter — craft Primitive Wand from boss materials

Encounter:
- WASD — move
- 1–4 — selected class skills (slots can be rearranged at the Trainer)
- Aim the pointer at ground for area skills; at enemies for single-target spells/arrows
- Aim at an ally for Targeted Heal / Lightning Shield; Shift forces self, empty ground defaults to self
- WASD or Dash interrupts Aimed Shot, Fireball and Lightning Storm; interruption spends the started cooldown
- R — ready; after a win/wipe, reset and ready again
- H — return to the hub

### What this proves

The prototype intentionally focuses on the Prototype 01 hypothesis: server-authoritative multiplayer movement/combat, a shared boss, readable telegraphs, learnable mechanics, coordination, failure and fast retry.

The gate opens boss selection: Warden (red cylinder) or Yellow Ball (yellow sphere). The first entrant selects the room's boss; later entrants see and fight that same boss until everyone leaves. Yellow Ball alternates a telegraphed rolling charge and a bouncing slam. Movement, boss separation, dash, damage, cooldowns and beam intersection are calculated by one shared server simulation used by the local WebSocket server and Cloudflare Durable Object.

LAZOR fires a 14-unit forward beam, dealing 90 damage on intersection with the boss, with a 2.4-second cooldown. Player noses show actual movement direction and keep their facing when stopped. It belongs to Fire Mage; choose that class at the Skill Trainer before entering.

Victory automatically grants Cylinder Tube from Warden or Spherical Ball from Yellow Ball. A miniature material mesh marks the drop. Inventory and victory receipt IDs persist in browser localStorage, preventing repeated snapshots from granting the same reward twice. At the Crafter, spend one of each to produce Primitive Wand, displayed in inventory. This is browser-local prototype persistence, not an account inventory or tamper-proof economy; clients cannot award loot or damage to the server. Clearing browser storage clears these items. Rewards require being connected when the victory snapshot arrives.

Validation: `npm test` runs collision, facing, input validation, directional attack, boss selection/motion, reward and crafting regressions. `npm run build` checks TypeScript and builds the client. The native Vite configuration loader and Node test runner require Node 24+. No external art assets are used.


### Cloudflare deployment

The branch now includes `wrangler.jsonc` and a Cloudflare Worker entry point in `worker/index.ts`. The multiplayer room is hosted in a Durable Object so connected players share the same boss state instead of relying on the old local Node process.

```bash
npm run deploy
```


> Cloudflare preview configuration: Preview URLs enabled; Build command `npm run build`; Preview command `npm run build && npx wrangler preview`.

Primitive Wand is reusable Weapon equipment. Old crafted contraptions migrate one-for-one to owned wands, initially unequipped. Arc Spear is unavailable at the trainer; equipping a wand transforms Lightning Mage Arc Blast (`arcBolt`) in any slot for the encounter. Unequipping restores the base skill. The shared server validates saved material receipts and crafting counts before accepting an equipped wand and derives the encounter loadout and damage itself. As before, browser-local saves are not authenticated account ownership; forged local reward ledgers are outside this prototype economy boundary.


Green Cone is the third gate selection. It slowly pursues the nearest living player, stops to telegraph a 3-unit slam for 1.5 seconds, and summons two smaller cones every third slam (up to six alive). Adds pursue and attack for 12 damage every 1.2 seconds, have 54 HP, and can be hit by Arc Blast / Arc Spear (nearest target), LAZOR, and Holy Nova. Victory grants **Conical Taper**; no separate triangle material exists.

The Crafter also offers **3 Conical Tapers -> Pointy Hat** (Head) and **1 Conical Taper + 1 Spherical Ball -> Pointy Orb** (Offhand). The Wardrobe paperdoll equips and unequips all three reusable items. Gear appears on the hub avatar and on every encounter player from server snapshots. The existing browser save key is preserved; legacy wand ownership and equipment migrate without refunding spent materials.

Pointy Hat gives Dash three independently usable charges. One charge returns every 2.6 seconds; spending another charge does not restart the running recharge. Pointy Orb extends LAZOR's cooldown from 2.4 to exactly 4.4 seconds and applies four 8-damage burn ticks, one per second, on beam hits. A caster refreshes their own burn; separate players' burns coexist. The shared server controls all charges, cooldowns, burn damage, cone AI and add HP. Browser-local receipts remain the prototype's unauthenticated inventory boundary.


Options opens from the top-right button in either scene. Follow Player gently tracks at 20% of player displacement, capped at two units from arena center; zoom ranges from 29 to 40 (default 31). Preferences use a separate browser-local save and do not change inventory receipts. Material counts live at the Crafter. Wardrobe slots show their equipped item or Empty; the owned-gear grid supports equip/unequip while preserving ownership.

Warrior offers Sword Slash (38 damage, 3-unit 120-degree frontal cleave, 1.1s cooldown) and Charging Stab (5-unit directional charge, 60 damage in a narrow 2.2-unit endpoint stab, 3.6s cooldown). Charge stops at arena walls, the boss, or living cone adds. Both attacks and their effects are broadcast by the shared authoritative simulation. The charge is an immediate server-resolved dash with a short visual trail.

### Seven selectable classes

Choose class from the hub button or gold Trainer, then Save loadout. Class choice persists in `jacworks-class-v1`; the existing loadout and inventory keys remain. Missing/invalid/old `prototype` IDs migrate to Lightning Mage. A class has exactly its own three skills plus Dash (Vanish temporarily becomes Backstab); rearranging slots is allowed, cross-class mixing is rejected by the server. No mandatory tank/healer party composition exists: every class has repeatable damage, mobility and solo-capable boss targeting.

| Class | Skill 1 | Skill 2 | Skill 3 | Skill 4 |
| --- | --- | --- | --- | --- |
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

Validation: `npm test` covers all seven loadouts, isolated solo damage, targeting, casts/channels and interrupts, effects, cooldowns, gear/inventory migration and existing boss mechanics. `node scripts/smoke-combat.mjs` starts a disposable local server and verifies two real WebSocket clients with Warrior, Priest + Lightning Mage, and Ranger + Fire Mage, including shared snapshots and matching FX. These checks do not establish final encounter balance or replace human playtesting. `npm run build` validates TypeScript and produces the Vite client.


### Defender, Rogue and Hard Warden

Defender Stab deals 32 frontal damage at 2.8-unit reach (0.9s cooldown). Bulwark lasts 6s, halves walking speed and incoming damage (10s cooldown). Heroic Shield targets a living ally within 11 units, jumping along a collision-tested path; self targeting stays still. It absorbs 80 damage on the caster and 40 on a separate ally for 6s (9s cooldown). Shields refresh to the larger amount, never stack; mitigation applies before absorption. Aim at an ally or hold Shift for self.

Rogue Quick Stab deals 24 frontal damage at 2.8-unit reach (0.6s cooldown). Vanish makes the Rogue invisible to enemy target selection and pursuit for exactly 4s (8s cooldown), replacing its own slot with Backstab. Allies still see a translucent avatar; existing area attacks still hit. Backstab ends Vanish and restores its skill without resetting cooldown: 80 damage from behind, otherwise 24. Rear position is evaluated against the nearest visible living player's direction from the enemy; a solo invisible Rogue receives the rear bonus. Poison Enchant lasts 6s (9s cooldown); successful stabs apply four server-resolved 6-damage ticks, one per second. Separate stab applications coexist. Death, retry and encounter end clear temporary buffs and restore Vanish.

The red **Hard Warden** circle is right of the normal Warden circle in the hub; press E there to enter directly. The original gate selection still offers all bosses. As before, an occupied shared room retains its first entrant's selection. Hard Warden has 3000 HP and 64 damage per hit, compared with normal Warden's 1800 HP and 48 damage. Its targeted blast has 4.2-unit radius. Triple scatter marks one fixed target position and hits three times at 0.5s intervals. Its 360-degree sweep covers the arena; hide behind either of the two cylindrical pillars at (-4, 0) and (4, 0). The server tests pillar occlusion at impact. Both pillars block walking, Dash, Charging Stab and Heroic Shield movement; their visible radius matches cover geometry.

Hard victory grants **Large Cylinder**, separately from normal Warden's **Cylinder Tube**. The Crafter exchanges **3 Large Cylinders → Redtube Armour**, reusable chest gear for Warrior, Defender and Rogue. Armour reduces boss damage by 5% (does not reduce add damage), and expands Warrior Sword Swing from 3 units / 120 degrees to 4 units / 180 degrees. Owned armour, equipped slot and spent materials persist under the existing inventory save key. Switching to an ineligible class makes saved armour inactive without deleting it. Shields, invisibility, poison, class swaps, movement, damage and gear eligibility are server authoritative; the existing unauthenticated browser-local receipt boundary remains unchanged.

Validation includes shield mitigation/expiry, Vanish targeting and slot restoration, poison timing, pillar collision/occlusion, hard attacks/loot, recipe persistence, armour restrictions and cleave. The WebSocket smoke also exercises Defender + Rogue in Hard Warden with matching FX and shared buff/shield/equipment snapshots. These automated checks do not replace human visual QA or multiplayer balance playtesting. See [ADR-0009](DOCS/ADR/0009-defender-rogue-hard-warden.md).
