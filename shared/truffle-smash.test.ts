import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
test('Truffle smash publishes damage tick, recovery, late join pose and preserves legacy reward',()=>{
 let serial=0;const g=new Game(()=>{},()=>String(++serial));const p=g.add('a');
 g.message('a',{type:'join',boss:'greenCone'});g.message('a',{type:'ready'},100);g.message('a',{type:'vote',proposalId:g.vote!.id,accept:true},100);
 p.pos={x:0,z:2};g.schedule(200);const attack=structuredClone(g.boss.smash!);
 assert.deepEqual(attack,{startedAt:200,impactAt:1700,recoverAt:2350});
 const origin={...g.boss.pos};g.tick(1699);assert.equal(p.hp,100);assert.deepEqual(g.boss.pos,origin);
 // Server stall: contact and recovery shift to the actual damage tick.
 const s=g.tick(1850);assert.equal(p.hp,52);assert.equal(s.boss.smash!.impactAt,1850);assert.equal(s.boss.smash!.impacted,true);
 g.add('late');const late=JSON.parse(JSON.stringify(g.tick(1900)));assert.deepEqual(late.boss.smash,s.boss.smash);
 g.tick(2499);assert.deepEqual(g.boss.pos,origin);g.tick(2550);assert.ok(g.boss.walking);
 g.boss.hp=0;assert.equal(g.tick(2600).reward!.material,'conicalTaper');g.reset();assert.equal(g.boss.smash,undefined);
});

import {once} from 'node:events';
import {WebSocket,WebSocketServer} from 'ws';
test('three real sockets serialize identical windup, impact and recovery including late arrival',async()=>{
 const server=new WebSocketServer({port:0});await once(server,'listening');const sockets:WebSocket[]=[],clients:WebSocket[]=[];
 server.on('connection',s=>sockets.push(s));let id=0;const g=new Game(()=>{},()=>String(++id));g.add('a');g.add('b');
 async function connect(){const c=new WebSocket(`ws://localhost:${(server.address() as {port:number}).port}`);clients.push(c);await once(c,'open');}
 async function tick(now:number){const waiting=clients.map(c=>once(c,'message'));const payload=JSON.stringify(g.tick(now));for(const s of sockets)s.send(payload);const packets=(await Promise.all(waiting)).map(([raw])=>JSON.parse(String(raw)));for(const p of packets)assert.deepEqual(p,packets[0]);return packets[0];}
 try{
  await connect();await connect();g.message('a',{type:'propose',boss:'greenCone'},100);for(const p of ['a','b'])g.message(p,{type:'vote',proposalId:g.vote!.id,accept:true},100);
  g.schedule(200);assert.equal((await tick(800)).boss.smash.startedAt,200);
  await connect();g.add('late');assert.equal((await tick(1200)).boss.smash.impactAt,1700);
  assert.equal((await tick(1700)).boss.smash.impacted,true);assert.equal((await tick(2000)).boss.smash.recoverAt,2350);
 }finally{for(const c of clients)c.terminate();for(const s of sockets)s.terminate();await new Promise<void>(r=>server.close(()=>r()));}
});
