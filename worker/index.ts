import { DurableObject } from "cloudflare:workers";
import { DEFAULT_LOADOUT, SKILLS, validLoadout } from "../shared/protocol";
import type { ClientMessage, PlayerState, ServerMessage, Snapshot, Telegraph, Vec2 } from "../shared/protocol";

interface Env {
  GAME_ROOM: DurableObjectNamespace<GameRoom>;
  ASSETS: Fetcher;
}

const TICK_MS = 50;
const ARENA = 12;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const dist = (a: Vec2, b: Vec2) => Math.hypot(a.x - b.x, a.z - b.z);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/ws") {
      if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
        return new Response("Expected WebSocket upgrade", { status: 426 });
      }

      const room = env.GAME_ROOM.getByName("prototype-01");
      return room.fetch(request);
    }

    return env.ASSETS.fetch(request);
  },
};

export class GameRoom extends DurableObject<Env> {
  private players = new Map<WebSocket, PlayerState>();
  private moves = new Map<string, Vec2>();
  private ready = new Set<string>();
  private phase: Snapshot["phase"] = "lobby";
  private telegraphs: Telegraph[] = [];
  private nextMechanicAt = Date.now() + 2500;
  private mechanic = 0;
  private tickTimer: ReturnType<typeof setInterval> | undefined;

  private boss = {
    hp: 1800,
    maxHp: 1800,
    pos: { x: 0, z: 0 },
  };

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
      return new Response("Expected WebSocket upgrade", { status: 426 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    server.accept();

    const id = crypto.randomUUID().slice(0, 8);
    const player: PlayerState = {
      id,
      name: `Player ${this.players.size + 1}`,
      pos: { x: 0, z: 8 },
      hp: 100,
      maxHp: 100,
      alive: true,
      guardUntil: 0,
      cooldowns: [0, 0, 0, 0],
      loadout: [...DEFAULT_LOADOUT],
    };

    this.players.set(server, player);
    this.moves.set(id, { x: 0, z: 0 });

    server.send(JSON.stringify({ type: "welcome", id } satisfies ServerMessage));

    server.addEventListener("message", (event) => this.onMessage(server, player, event.data));
    server.addEventListener("close", () => this.onClose(server, id));
    server.addEventListener("error", () => this.onClose(server, id));

    this.ensureTicking();

    return new Response(null, { status: 101, webSocket: client } as ResponseInit);
  }

  private onMessage(socket: WebSocket, player: PlayerState, raw: string | ArrayBuffer) {
    let message: ClientMessage;

    try {
      const text = typeof raw === "string" ? raw : new TextDecoder().decode(raw);
      message = JSON.parse(text) as ClientMessage;
    } catch {
      return;
    }

    if (message.type === "join") {
      if (typeof message.name === "string") player.name = message.name.slice(0, 24) || player.name;
      if (validLoadout(message.loadout)) player.loadout = [...message.loadout];
      return;
    }

    if (message.type === "input") {
      this.moves.set(player.id, message.move);
      return;
    }

    if (message.type === "ready") {
      if (this.phase === "won" || this.phase === "wiped") this.resetFight();

      this.ready.add(player.id);
      if (this.ready.size === this.players.size && this.players.size > 0) this.startFight();
      return;
    }

    if (message.type === "ability" && this.phase === "fight" && player.alive) {
      this.useAbility(player, message.slot);
    }

    if (socket.readyState !== WebSocket.OPEN) this.onClose(socket, player.id);
  }

  private onClose(socket: WebSocket, id: string) {
    if (!this.players.has(socket)) return;

    this.players.delete(socket);
    this.moves.delete(id);
    this.ready.delete(id);

    if (this.players.size === 0) {
      this.resetFight();
      if (this.tickTimer) clearInterval(this.tickTimer);
      this.tickTimer = undefined;
    }
  }

  private ensureTicking() {
    if (this.tickTimer) return;
    this.tickTimer = setInterval(() => this.tick(), TICK_MS);
  }

  private tick() {
    const now = Date.now();

    if (this.phase === "fight") {
      for (const player of this.players.values()) {
        if (!player.alive) continue;

        const move = this.moves.get(player.id) ?? { x: 0, z: 0 };
        const length = Math.hypot(move.x, move.z);

        if (length) {
          player.pos.x = clamp(player.pos.x + (move.x / length) * 0.22, -ARENA, ARENA);
          player.pos.z = clamp(player.pos.z + (move.z / length) * 0.22, -ARENA, ARENA);
        }
      }

      if (now >= this.nextMechanicAt) this.scheduleMechanic(now);

      const due = this.telegraphs.filter((telegraph) => telegraph.resolvesAt <= now);
      this.telegraphs = this.telegraphs.filter((telegraph) => telegraph.resolvesAt > now);
      due.forEach((telegraph) => this.resolveTelegraph(telegraph));

      if (this.boss.hp <= 0) {
        this.phase = "won";
        this.announce("Boss defeated! Press R to reset.");
      } else if ([...this.players.values()].length > 0 && [...this.players.values()].every((player) => !player.alive)) {
        this.phase = "wiped";
        this.announce("Wipe. Press R to reset.");
      }
    }

    this.broadcast(this.snapshot(now));
  }

  private snapshot(now: number): Snapshot {
    return {
      type: "snapshot",
      now,
      phase: this.phase,
      players: [...this.players.values()],
      boss: this.boss,
      telegraphs: this.telegraphs,
      readyCount: this.ready.size,
    };
  }

  private broadcast(message: ServerMessage) {
    const payload = JSON.stringify(message);

    for (const socket of this.players.keys()) {
      if (socket.readyState === WebSocket.OPEN) socket.send(payload);
    }
  }

  private announce(text: string) {
    this.broadcast({ type: "event", text });
  }

  private resetFight() {
    this.boss.hp = this.boss.maxHp;
    this.telegraphs = [];
    this.ready.clear();
    this.phase = "lobby";

    let index = 0;
    const count = Math.max(1, this.players.size);

    for (const player of this.players.values()) {
      const angle = (index++ / count) * Math.PI * 2;
      player.pos = { x: Math.cos(angle) * 7, z: Math.sin(angle) * 7 };
      player.hp = player.maxHp;
      player.alive = true;
      player.guardUntil = 0;
      player.cooldowns = [0, 0, 0, 0];
    }
  }

  private startFight() {
    if (!this.players.size) return;

    this.phase = "fight";
    this.boss.hp = this.boss.maxHp;
    this.nextMechanicAt = Date.now() + 2200;
    this.mechanic = 0;
    this.ready.clear();
    for (const player of this.players.values()) player.cooldowns = [0, 0, 0, 0];
    this.announce("Fight!");
  }

  private hurt(player: PlayerState, amount: number) {
    if (!player.alive) return;
    if (player.guardUntil > Date.now()) amount *= 0.25;

    player.hp = Math.max(0, player.hp - amount);
    if (player.hp === 0) player.alive = false;
  }

  private scheduleMechanic(now: number) {
    this.mechanic += 1;
    const alive = [...this.players.values()].filter((player) => player.alive);

    if (!alive.length) return;

    if (this.mechanic % 3 === 1) {
      const target = alive[Math.floor(Math.random() * alive.length)];
      this.telegraphs.push({
        id: crypto.randomUUID(),
        kind: "circle",
        pos: { ...target.pos },
        radius: 3.1,
        resolvesAt: now + 1400,
      });
      this.announce("Marked blast — move!");
    } else if (this.mechanic % 3 === 2) {
      const angle = Math.random() * Math.PI * 2;
      this.telegraphs.push({
        id: crypto.randomUUID(),
        kind: "line",
        pos: { ...this.boss.pos },
        direction: { x: Math.cos(angle), z: Math.sin(angle) },
        width: 3,
        length: 13,
        resolvesAt: now + 1500,
      });
      this.announce("Warden sweep!");
    } else {
      for (const player of alive) {
        this.telegraphs.push({
          id: crypto.randomUUID(),
          kind: "circle",
          pos: { ...player.pos },
          radius: 2.2,
          resolvesAt: now + 1700,
        });
      }
      this.announce("Spread!");
    }

    this.nextMechanicAt = now + 3600;
  }

  private resolveTelegraph(telegraph: Telegraph) {
    for (const player of this.players.values()) {
      if (!player.alive) continue;

      let hit = false;

      if (telegraph.kind === "circle") {
        hit = dist(player.pos, telegraph.pos) <= (telegraph.radius ?? 0);
      } else if (telegraph.direction) {
        const dx = player.pos.x - telegraph.pos.x;
        const dz = player.pos.z - telegraph.pos.z;
        const along = dx * telegraph.direction.x + dz * telegraph.direction.z;
        const side = Math.abs(dx * -telegraph.direction.z + dz * telegraph.direction.x);

        hit = along >= 0 &&
          along <= (telegraph.length ?? 0) &&
          side <= (telegraph.width ?? 0) / 2;
      }

      if (hit) this.hurt(player, 48);
    }
  }

  private useAbility(player:PlayerState,slot:1|2|3|4){
    if(!Number.isInteger(slot)||slot<1||slot>4)return;
    const skill=player.loadout[slot-1];
    if(!skill||!Object.prototype.hasOwnProperty.call(SKILLS,skill))return;
    const now=Date.now();
    if(now<player.cooldowns[slot-1])return;
    const from={...player.pos},distance=dist(player.pos,this.boss.pos);
    if((skill==="arcBolt"||skill==="arcSpear")&&distance>11)return;
    if(skill==="pulseNova"&&distance>4.2)return;
    player.cooldowns[slot-1]=now+SKILLS[skill].cooldown;
    if(skill==="arcBolt"||skill==="arcSpear")this.boss.hp=Math.max(0,this.boss.hp-(skill==="arcSpear"?72:18));
    else if(skill==="dash"){const move=this.moves.get(player.id)??{x:0,z:0},len=Math.hypot(move.x,move.z);if(len){player.pos.x=clamp(player.pos.x+move.x/len*3.5,-ARENA,ARENA);player.pos.z=clamp(player.pos.z+move.z/len*3.5,-ARENA,ARENA)}}
    else if(skill==="pulseNova")this.boss.hp=Math.max(0,this.boss.hp-45);
    else if(skill==="guard")player.guardUntil=now+1600;
    else if(skill==="holyNova"){for(const ally of this.players.values())if(ally.alive&&dist(ally.pos,player.pos)<=4.5)ally.hp=Math.min(ally.maxHp,ally.hp+25)}
    this.broadcast({type:"abilityFx",skill,playerId:player.id,from,to:{...player.pos}});
  }
}
