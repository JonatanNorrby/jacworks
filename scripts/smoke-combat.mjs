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
  await waitFor(()=>c.id,'welcome');c.ws.send(JSON.stringify({type:'join',name:'Smoke-'+i,boss:'greenCone',classId:'warrior',loadout:['swordSwing','chargingStab','guard','dash']}));
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
 for(const c of clients){assert.equal(c.snapshot.players.find(p=>p.id===clients[0].id).classId,'warrior');assert.ok(c.snapshot.players.find(p=>p.id===clients[0].id).cooldowns[1]>0)}
 for(const skill of ['chargingStab','swordSwing'])assert.deepEqual(clients[0].packets.find(m=>m.type==='abilityFx'&&m.skill===skill),clients[1].packets.find(m=>m.type==='abilityFx'&&m.skill===skill));
 console.log('TWO_CLIENT_SMOKE_OK: shared room, loadouts, class ID, charge/cleave FX, damage and cooldowns');
 for(const c of clients)c.ws.close();
 await delay(200);
 const definitions={priest:['pulseNova','targetedHeal','holyLight','dash'],lightningMage:['arcBolt','lightningStorm','lightningShield','dash'],ranger:['aimedShot','arrowRain','splitShot','dash'],fireMage:['fireball','lazor','fireMine','dash']};
 for(const pair of [['priest','lightningMage'],['ranger','fireMage']]){
  const pairClients=[];
  for(const classId of pair){
   const c={ws:new WebSocket(`ws://localhost:${port}`),packets:[],id:null,snapshot:null};clients.push(c);pairClients.push(c);
   c.ws.on('message',raw=>{const m=JSON.parse(String(raw));c.packets.push(m);if(m.type==='welcome')c.id=m.id;if(m.type==='snapshot')c.snapshot=m});
   await waitFor(()=>c.id,'class welcome');c.ws.send(JSON.stringify({type:'join',name:classId,classId,loadout:definitions[classId],boss:'warden'}));
  }
  await waitFor(()=>pairClients.every(c=>c.snapshot?.players.length===2&&c.snapshot.players.every(p=>pair.includes(p.classId))),'class snapshots');
  for(const c of pairClients)c.ws.send(JSON.stringify({type:'ready'}));
  await waitFor(()=>pairClients.every(c=>c.snapshot?.phase==='fight'),'class fight');
  // Exercise every skill without interrupting the timed casts/channels.
  for(let slot=1;slot<=4;slot++){
   for(let i=0;i<2;i++){
    const c=pairClients[i],skill=definitions[pair[i]][slot-1];
    c.ws.send(JSON.stringify({type:'ability',slot,target:['lightningStorm','arrowRain','fireMine'].includes(skill)?{x:0,z:0}:undefined,targetId:['targetedHeal','lightningShield'].includes(skill)?pairClients[1-i].id:undefined,damage:999999}));
   }
   await delay(slot===1?2500:slot===2?3100:300);
  }
  for(let i=0;i<2;i++){
   const sender=pairClients[i];
   for(const skill of definitions[pair[i]]){
    await waitFor(()=>pairClients.every(c=>c.packets.some(m=>m.type==='abilityFx'&&m.playerId===sender.id&&m.skill===skill)),`${pair[i]} ${skill} shared FX`);
    const events=pairClients.map(c=>c.packets.filter(m=>m.type==='abilityFx'&&m.playerId===sender.id&&m.skill===skill));assert.deepEqual(events[0],events[1]);
   }
   for(const c of pairClients){const p=c.snapshot.players.find(p=>p.id===sender.id);assert.equal(p.classId,pair[i]);assert.deepEqual(p.loadout,definitions[pair[i]]);assert.ok(p.cooldowns.some(n=>n>0));assert.ok(c.snapshot.boss.hp<1800&&c.snapshot.boss.hp>0);}
  }
  console.log('MIXED_CLASS_SMOKE_OK: '+pair.join(' + ')+' skills, casts, friendly targeting, snapshots, FX and damage');
  for(const c of pairClients)c.ws.close();await delay(200);
 }

}finally{for(const c of clients)c.ws.close();server.kill()}
