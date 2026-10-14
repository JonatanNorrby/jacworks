import {test} from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {WebSocket,WebSocketServer} from 'ws';
import {Game} from './game';
import {emptyInventory,grantReward,countInventory} from './inventory';
import type {Snapshot} from './protocol';
// Controlled authoritative fixture with actual socket serialization, not client-side damage controls.
for(const boss of ['yellowBall','hardYellowBall'] as const)test(`${boss}: two WebSocket clients receive identical split IDs, HP, motion and one reward`,async()=>{
 const server=new WebSocketServer({port:0});await once(server,'listening');const sockets:WebSocket[]=[],clients:WebSocket[]=[];
 server.on('connection',s=>sockets.push(s));let serial=0;const g=new Game(()=>{},()=>`net-${++serial}`);g.add('a');g.add('b');
 try{
  for(let i=0;i<2;i++){const ws=new WebSocket(`ws://localhost:${(server.address() as {port:number}).port}`);clients.push(ws);await once(ws,'open');}
  g.message('a',{type:'propose',boss},100);for(const id of ['a','b'])g.message(id,{type:'vote',proposalId:g.vote!.id,accept:true},100);
  for(const p of g.players.values())p.hp=10000;
  async function tick(now:number){const pending=clients.map(c=>once(c,'message'));const packet=g.tick(now);for(const s of sockets)s.send(JSON.stringify(packet));const values=(await Promise.all(pending)).map(([raw])=>JSON.parse(String(raw)) as Snapshot);assert.deepEqual(values[0],values[1]);return values;}
  g.damageTarget('boss',1e6);let packets=await tick(150);assert.equal(packets[0].adds.length,2);
  const start=packets[0].adds.map(a=>({...a.pos}));await tick(2450);await tick(3950);packets=await tick(4250);assert.ok(packets[0].adds.some((a,i)=>a.pos.x!==start[i].x||a.pos.z!==start[i].z));
  if(boss==='hardYellowBall')for(const now of [4300,4350]){g.area({x:0,z:0},40,1e6);packets=await tick(now);}
  assert.equal(packets[0].adds.length,boss==='hardYellowBall'?8:2);g.area({x:0,z:0},40,1e6);packets=await tick(4400);assert.equal(packets[0].phase,'won');const saves=clients.map(()=>emptyInventory());for(let i=0;i<2;i++)assert.ok(grantReward(saves[i],packets[i].reward,i?'b':'a'));
  packets=await tick(4450);for(let i=0;i<2;i++){assert.ok(!grantReward(saves[i],packets[i].reward,i?'b':'a'));assert.equal(countInventory(saves[i])[boss==='hardYellowBall'?'largeSphere':'sphericalBall'],1);}
 }finally{for(const c of clients)c.terminate();for(const s of sockets)s.terminate();await new Promise<void>(resolve=>server.close(()=>resolve()));}
});
