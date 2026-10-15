import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import WebSocket from 'ws';
const endpoint=process.env.SMOKE_WS_URL??'ws://localhost:18790/ws';
const server=process.env.SMOKE_WS_URL?null:spawn(process.execPath,['--import','tsx','server/index.ts'],{env:{...process.env,PORT:'18790'},stdio:['ignore','pipe','pipe']});
const clients=[],room='truffle-'+crypto.randomUUID();let seq=0,minDistance=Infinity,matches=0;
const snapshots=new Map();
async function connect(){
 const url=new URL(endpoint);url.searchParams.set('room',room);
 const c={ws:new WebSocket(url),id:null,state:null};clients.push(c);
 c.ws.on('message',raw=>{const m=JSON.parse(String(raw));if(m.type==='welcome')c.id=m.id;if(m.type==='snapshot'){c.state=m;const previous=snapshots.get(m.now);if(previous){assert.deepEqual(m.hubNpc,previous);matches++}else snapshots.set(m.now,m.hubNpc);}});
 for(let i=0;i<200;i++){if(c.id&&c.state?.hubNpc)return c;await delay(50)}throw Error('No hub snapshot');
}
try{
 if(server)await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject)});
 const a=await connect();await delay(500);await connect();
 for(let i=0;i<140;i++){
  const s=a.state,npc=s.hubNpc,p=s.players.find(p=>p.id===a.id),dx=npc.pos.x-p.pos.x,dz=npc.pos.z-p.pos.z,d=Math.hypot(dx,dz);
  assert.ok(d>=1.33-1e-6,`Player penetrated NPC: ${d}`);minDistance=Math.min(minDistance,d);
  a.ws.send(JSON.stringify({type:'input',seq:seq++,move:{x:dx/d,z:dz/d}}));await delay(50);
 }
 a.ws.send(JSON.stringify({type:'input',seq:seq++,move:{x:0,z:0}}));
 assert.ok(minDistance<1.45,`Did not reach NPC: ${minDistance}`);assert.ok(matches>40,`Too few matching shared snapshots: ${matches}`);
 console.log(`TRUFFLE_MULTIPLAYER_COLLISION_OK: ${matches} matching NPC snapshots; closest contact ${minDistance.toFixed(4)} (minimum 1.33); ${endpoint}`);
}finally{for(const c of clients)c.ws.close();server?.kill()}
