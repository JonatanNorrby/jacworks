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
- E at the gold Skill Trainer — equip four skills, including LAZOR
- E at the purple Crafter — craft Odd Contraption from boss materials

Encounter:
- WASD — move
- 1 — Arc Bolt (ranged damage)
- 2 — Dash
- 3 — Pulse Nova (close-range burst)
- 4 — Guard (brief heavy damage reduction)
- R — ready; after a win/wipe, reset and ready again
- H — return to the hub

### What this proves

The prototype intentionally focuses on the Prototype 01 hypothesis: server-authoritative multiplayer movement/combat, a shared boss, readable telegraphs, learnable mechanics, coordination, failure and fast retry.

The gate opens boss selection: Warden (red cylinder) or Yellow Ball (yellow sphere). The first entrant selects the room's boss; later entrants see and fight that same boss until everyone leaves. Yellow Ball alternates a telegraphed rolling charge and a bouncing slam. Movement, boss separation, dash, damage, cooldowns and beam intersection are calculated by one shared server simulation used by the local WebSocket server and Cloudflare Durable Object.

LAZOR fires a 14-unit forward beam, dealing 90 damage on intersection with the boss, with a 2.4-second cooldown. Player noses show actual movement direction and keep their facing when stopped. Equip it at the existing Skill Trainer before entering.

Victory automatically grants Cylinder Tube from Warden or Spherical Ball from Yellow Ball. A miniature material mesh marks the drop. Inventory and victory receipt IDs persist in browser localStorage, preventing repeated snapshots from granting the same reward twice. At the Crafter, spend one of each to produce Odd Contraption, displayed in inventory. This is browser-local prototype persistence, not an account inventory or tamper-proof economy; clients cannot award loot or damage to the server. Clearing browser storage clears these items. Rewards require being connected when the victory snapshot arrives.

Validation: `npm test` runs collision, facing, input validation, directional attack, boss selection/motion, reward and crafting regressions. `npm run build` checks TypeScript and builds the client. The native Vite configuration loader and Node test runner require Node 24+. No external art assets are used.


### Cloudflare deployment

The branch now includes `wrangler.jsonc` and a Cloudflare Worker entry point in `worker/index.ts`. The multiplayer room is hosted in a Durable Object so connected players share the same boss state instead of relying on the old local Node process.

```bash
npm run deploy
```


> Cloudflare preview configuration: Preview URLs enabled; Build command `npm run build`; Preview command `npm run build && npx wrangler preview`.
