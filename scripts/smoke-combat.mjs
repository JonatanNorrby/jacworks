import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import WebSocket from 'ws';
const port=18787;
const server=spawn(process.execPath,['--import','tsx','server/index.ts'],{env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
const clients=[];
async function waitFor(test,label){for(let i=0;i<100;i++){if(test())return;await delay(50)}throw Error('Timeout: '+label)}
try{
 await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(Error('Server exit '+code)))});
 for(let i=0;i<2;i++){
  const c={ws:new WebSocket(`ws://localhost:${port}`),packets:[],id:null,snapshot:null};clients.push(c);
  c.ws.on('message',raw=>{const m=JSON.parse(String(raw));c.packets.push(m);if(m.type==='welcome')c.id=m.id;if(m.type==='snapshot')c.snapshot=m});
  await waitFor(()=>c.id,'welcome');c.ws.send(JSON.stringify({type:'join',name:'Smoke-'+i,boss:'greenCone',loadout:['swordSwing','chargingStab','guard','dash']}));
 }
 await waitFor(()=>clients.every(c=>c.snapshot?.players.length===2),'shared room');
 for(const c of clients)c.ws.send(JSON.stringify({type:'ready'}));
 await waitFor(()=>clients.every(c=>c.snapshot?.phase==='fight'),'fight');
 const c=clients[0];
 for(let seq=0;seq<10;seq++){c.ws.send(JSON.stringify({type:'input',seq,move:{x:0,z:-1}}));await delay(50)}
 c.ws.send(JSON.stringify({type:'input',seq:10,move:{x:0,z:0}}));c.ws.send(JSON.stringify({type:'ability',slot:2}));
 await waitFor(()=>clients.every(c=>c.packets.some(m=>m.type==='abilityFx'&&m.skill==='chargingStab')),'charge broadcast');
 c.ws.send(JSON.stringify({type:'ability',slot:1}));
 await waitFor(()=>clients.every(c=>c.packets.some(m=>m.type==='abilityFx'&&m.skill==='swordSwing')),'cleave broadcast');
 await waitFor(()=>clients.every(c=>c.snapshot.boss.hp<1800),'shared damage');
 for(const c of clients){assert.equal(c.snapshot.players.find(p=>p.id===clients[0].id).classId,'prototype');assert.ok(c.snapshot.players.find(p=>p.id===clients[0].id).cooldowns[1]>0)}
 for(const skill of ['chargingStab','swordSwing'])assert.deepEqual(clients[0].packets.find(m=>m.type==='abilityFx'&&m.skill===skill),clients[1].packets.find(m=>m.type==='abilityFx'&&m.skill===skill));
 console.log('TWO_CLIENT_SMOKE_OK: shared room, loadouts, class ID, charge/cleave FX, damage and cooldowns');
}finally{for(const c of clients)c.ws.close();server.kill()}
