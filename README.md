# JAC Works

## Prototype 01

Branch: `prototype/01-babylon-multiplayer-boss`

### Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in multiple browser windows. The prototype WebSocket server listens on port `8787`.

For testing from other devices on the LAN, open the Vite host address on those devices and ensure TCP 5173/8787 are reachable.

### Controls

- WASD — move
- 1 — Arc Bolt (ranged damage)
- 2 — Dash
- 3 — Pulse Nova (close-range burst)
- 4 — Guard (brief heavy damage reduction)
- R — ready; after a win/wipe, reset and ready again

### What this proves

The prototype intentionally focuses on the Prototype 01 hypothesis: server-authoritative multiplayer movement/combat, a shared boss, readable telegraphs, learnable mechanics, coordination, failure and fast retry.

There is deliberately no account system, persistence, loot, progression, AI companion, PvP, crafting or world content yet.
