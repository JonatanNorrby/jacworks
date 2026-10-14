import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import WebSocket from 'ws';
const port=18787;
const server=spawn(process.execPath,['--import','tsx','server/index.ts'],{env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe']});
const clients=[];
async function waitFor(test,label){for(let i=0;i<100;i++){if(test())return;await delay(50)}throw Error('Timeout: '+label)}
async function begin(group){
 group[0].ws.send(JSON.stringify({type:'propose',boss:group[0].snapshot.boss.id}));
 await waitFor(()=>group.every(c=>c.snapshot?.vote),'proposal broadcast');
 const id=group[0].snapshot.vote.id;
 for(const c of group)c.ws.send(JSON.stringify({type:'vote',proposalId:id,accept:true}));
}
try{
 await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(Error('Server exit '+code)))});
 for(let i=0;i<2;i++){
  const c={ws:new WebSocket(`ws://localhost:${port}`),packets:[],id:null,snapshot:null};clients.push(c);
  c.ws.on('message',raw=>{const m=JSON.parse(String(raw));c.packets.push(m);if(m.type==='welcome')c.id=m.id;if(m.type==='snapshot')c.snapshot=m});
  await waitFor(()=>c.id,'welcome');c.ws.send(JSON.stringify({type:'join',name:'Smoke-'+i,boss:'greenCone',classId:'warrior',loadout:['swordSwing','chargingStab','guard','dash']}));
 }
 await waitFor(()=>clients.every(c=>c.snapshot?.players.length===2),'shared room');
 await begin(clients);
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
  await begin(pairClients);
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

 const duo=[];
 for(const classId of ['defender','rogue']){
  const c={ws:new WebSocket(`ws://localhost:${port}`),packets:[],id:null,snapshot:null};clients.push(c);duo.push(c);
  c.ws.on('message',raw=>{const m=JSON.parse(String(raw));c.packets.push(m);if(m.type==='welcome')c.id=m.id;if(m.type==='snapshot')c.snapshot=m});
  await waitFor(()=>c.id,'new kit welcome');
  c.ws.send(JSON.stringify({type:'join',classId,boss:'hardWarden',loadout:classId==='defender'?['stab','bulwark','heroicShield','dash']:['quickStab','vanish','poisonEnchant','dash'],inventory:{rewards:{a:'largeCylinder',b:'largeCylinder',c:'largeCylinder'},armours:1,armour:'redtubeArmour'}}));
 }
 await waitFor(()=>duo.every(c=>c.snapshot?.players.length===2&&c.snapshot.boss.id==='hardWarden'),'hard room');
 await begin(duo);
 await waitFor(()=>duo.every(c=>c.snapshot?.phase==='fight'),'hard fight');
 const [defender,rogue]=duo;
 for(let seq=0;seq<28;seq++){for(const c of duo)c.ws.send(JSON.stringify({type:'input',seq,move:{x:0,z:-1}}));await delay(50)}
 for(const c of duo)c.ws.send(JSON.stringify({type:'input',seq:28,move:{x:0,z:0}}));
 defender.ws.send(JSON.stringify({type:'ability',slot:3,targetId:rogue.id}));
 defender.ws.send(JSON.stringify({type:'ability',slot:2}));
 rogue.ws.send(JSON.stringify({type:'ability',slot:3}));
 rogue.ws.send(JSON.stringify({type:'ability',slot:2,invisibleUntil:9999999999999}));
 await waitFor(()=>duo.every(c=>{const d=c.snapshot.players.find(p=>p.id===defender.id),r=c.snapshot.players.find(p=>p.id===rogue.id);return d.shield===80&&r.shield===40&&d.bulwarkUntil>c.snapshot.now&&r.loadout[1]==='backstab'&&r.invisibleUntil-c.snapshot.now<=4000&&r.armour==='redtubeArmour'}),'shared shields, buffs, armour and skill swap');
 for(const c of duo)c.ws.send(JSON.stringify({type:'ability',slot:1,damage:999999}));
 rogue.ws.send(JSON.stringify({type:'ability',slot:2}));
 await waitFor(()=>duo.every(c=>c.snapshot.boss.hp<3000&&c.snapshot.boss.hp>2500&&c.snapshot.players.find(p=>p.id===rogue.id).loadout[1]==='vanish'),'authoritative stabs and restoration');
 for(const c of duo)c.ws.send(JSON.stringify({type:'ability',slot:4}));
 for(const [sender,skills] of [[defender,['stab','bulwark','heroicShield','dash']],[rogue,['quickStab','vanish','poisonEnchant','backstab','dash']]])for(const skill of skills){
  await waitFor(()=>duo.every(c=>c.packets.some(m=>m.type==='abilityFx'&&m.playerId===sender.id&&m.skill===skill)),skill+' broadcast');
  assert.deepEqual(duo[0].packets.filter(m=>m.type==='abilityFx'&&m.playerId===sender.id&&m.skill===skill),duo[1].packets.filter(m=>m.type==='abilityFx'&&m.playerId===sender.id&&m.skill===skill));
 }
 console.log('HARD_DUO_SMOKE_OK: Defender + Rogue, Hard Warden, shields, buffs, invisibility, skill swap, armour, damage and synchronized FX');

}finally{for(const c of clients)c.ws.close();server.kill()}
