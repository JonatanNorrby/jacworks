import { DurableObject } from 'cloudflare:workers';
import { Game } from '../shared/game';
import { roomFromUrl } from '../shared/room';

interface Env {
  GAME_ROOM: DurableObjectNamespace<GameRoom>;
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (new URL(request.url).pathname === '/ws') {
      if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
        return new Response('Expected WebSocket upgrade', { status: 426 });
      }
      const room = roomFromUrl(request.url);
      if (!room) return new Response('Invalid room code', { status: 400 });
      return env.GAME_ROOM.getByName(room).fetch(request);
    }
    return env.ASSETS.fetch(request);
  },
};

export class GameRoom extends DurableObject<Env> {
  private sockets = new Map<WebSocket, string>();
  private timer: ReturnType<typeof setInterval> | undefined;
  private game = new Game(message => this.broadcast(message), () => crypto.randomUUID());

  private broadcast(message: unknown) {
    const payload = JSON.stringify(message);
    for (const socket of this.sockets.keys()) {
      if (socket.readyState === WebSocket.OPEN) socket.send(payload);
    }
  }

  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade')?.toLowerCase() !== 'websocket') {
      return new Response('Expected WebSocket upgrade', { status: 426 });
    }
    const [client, server] = Object.values(new WebSocketPair());
    server.accept();
    const id = crypto.randomUUID();
    this.sockets.set(server, id);
    this.game.add(id);
    server.send(JSON.stringify({ type: 'welcome', id }));
    server.addEventListener('message', event => {
      try {
        if (typeof event.data === 'string' && event.data.length <= 4096) {
          this.game.message(id, JSON.parse(event.data));
        }
      } catch { /* Ignore malformed messages. */ }
    });
    const close = () => {
      if (!this.sockets.delete(server)) return;
      this.game.remove(id);
      if (!this.sockets.size) {
        clearInterval(this.timer);
        this.timer = undefined;
      }
    };
    server.addEventListener('close', close);
    server.addEventListener('error', close);
    this.timer ??= setInterval(() => this.broadcast(this.game.tick()), 50);
    return new Response(null, { status: 101, webSocket: client } as ResponseInit);
  }
}
