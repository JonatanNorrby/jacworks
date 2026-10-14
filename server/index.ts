import { WebSocketServer, WebSocket } from 'ws';
import { randomUUID } from 'node:crypto';
import { Game } from '../shared/game';

const sockets = new Map<WebSocket, string>();
const broadcast = (message: unknown) => {
  const payload = JSON.stringify(message);
  for (const socket of sockets.keys()) {
    if (socket.readyState === WebSocket.OPEN) socket.send(payload);
  }
};
const game = new Game(broadcast, randomUUID);
const port = Number(process.env.PORT ?? 8787);
const wss = new WebSocketServer({ port, maxPayload: 4096 });
wss.on('connection', socket => {
  const id = randomUUID();
  sockets.set(socket, id);
  game.add(id);
  socket.send(JSON.stringify({ type: 'welcome', id }));
  socket.on('message', raw => {
    try { game.message(id, JSON.parse(raw.toString())); }
    catch { /* Ignore malformed messages. */ }
  });
  socket.on('close', () => {
    sockets.delete(socket);
    game.remove(id);
  });
});
setInterval(() => broadcast(game.tick()), 50);
console.log('JAC Works local room on port', port);
