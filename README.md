# JAC Works

## Prototype 01

Base prototype branch: `prototype/01-babylon-multiplayer-boss`

This stacked prototype pass adds a deliberately small **Sanctum Hub** shell before the encounter so the team can evaluate the intended loop without turning Prototype 01 into a world-building project:

`Hub → Expedition Gate → boss encounter → retry / return to hub`

### Run locally

Node/Vite development:

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

The hub is intentionally thin. It exists to establish the intended game flow, not to prototype vendors, crafting, quests, persistence or a large world.

There is deliberately no account system, persistence, loot, progression, AI companion, PvP, crafting or world content yet.


### Cloudflare deployment

The branch now includes `wrangler.jsonc` and a Cloudflare Worker entry point in `worker/index.ts`. The multiplayer room is hosted in a Durable Object so connected players share the same boss state instead of relying on the old local Node process.

```bash
npm run deploy
```
