import { WebSocketServer, WebSocket } from 'ws';
import { randomUUID } from 'node:crypto';
import { Game } from '../shared/game';
import { roomFromUrl } from '../shared/room';

const rooms = new Map<string, {game:Game;sockets:Map<WebSocket,string>}>();
const port = Number(process.env.PORT ?? 8787);
const wss = new WebSocketServer({ port, maxPayload: 4096 });
wss.on('connection', (socket, request) => {
  const key=roomFromUrl('http://localhost'+request.url);
  if(!key){socket.close(1008,'Invalid room code');return;}
  let room=rooms.get(key);
  if(!room){
    const sockets=new Map<WebSocket,string>();
    const game=new Game(message=>{const payload=JSON.stringify(message);for(const s of sockets.keys())if(s.readyState===WebSocket.OPEN)s.send(payload)},randomUUID);
    room={game,sockets};rooms.set(key,room);
  }
  const {game,sockets}=room;
  const id=randomUUID();sockets.set(socket,id);game.add(id);
  socket.send(JSON.stringify({type:'welcome',id}));
  socket.on('message',raw=>{try{game.message(id,JSON.parse(raw.toString()))}catch{/* Ignore malformed messages. */}});
  socket.on('close',()=>{sockets.delete(socket);game.remove(id);if(!sockets.size)rooms.delete(key)});
});
setInterval(()=>{for(const {game,sockets} of rooms.values()){const payload=JSON.stringify(game.tick());for(const s of sockets.keys())if(s.readyState===WebSocket.OPEN)s.send(payload)}},50);
console.log('JAC Works local rooms on port',port);
