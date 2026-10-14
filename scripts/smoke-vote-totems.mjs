import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import WebSocket from 'ws';
// An explicit endpoint also exercises the deployed Cloudflare room. Use a quiet preview room.
const endpoint=process.env.SMOKE_WS_URL??'ws://localhost:18788';
const server=process.env.SMOKE_WS_URL?null:spawn(process.execPath,['--import','tsx','server/index.ts'],{env:{...process.env,PORT:'18788'},stdio:['ignore','pipe','pipe']});
const clients=[];
async function waitFor(test,label,ms=6000){for(let i=0;i<ms/50;i++){if(test())return;await delay(50)}throw Error('Timeout: '+label)}
async function connect(){const c={ws:new WebSocket(endpoint),id:null,snapshot:null,packets:[]};clients.push(c);c.ws.on('message',raw=>{const m=JSON.parse(String(raw));c.packets.push(m);if(m.type==='welcome')c.id=m.id;if(m.type==='snapshot')c.snapshot=m});await waitFor(()=>c.id,'welcome');send(c,{type:'join',classId:'shaman',name:'Shaman-'+clients.length,loadout:['earthShock','fireTotem','healingTotem','dash']});return c;}
function send(c,m){c.ws.send(JSON.stringify(m))}
async function propose(a,group,boss='warden'){send(a,{type:'propose',boss});await waitFor(()=>group.every(c=>c.snapshot?.vote?.boss===boss),'shared proposal');return a.snapshot.vote.id;}
try{
 if(server)await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(Error('Server exit '+code)))});
 const a=await connect();let b=await connect();let group=[a,b];await waitFor(()=>group.every(c=>c.snapshot?.players.length===2),'two clients');assert.equal(a.snapshot.phase,'lobby');
 let id=await propose(a,group,'hardWarden');send(a,{type:'vote',proposalId:id,accept:true});await waitFor(()=>b.snapshot.vote?.accepted.length===1,'first vote');assert.equal(b.snapshot.phase,'lobby');send(b,{type:'vote',proposalId:id,accept:false});await waitFor(()=>group.every(c=>!c.snapshot.vote),'decline cancellation');
 const stale=id;id=await propose(a,group);send(b,{type:'vote',proposalId:stale,accept:true});await delay(150);assert.equal(a.snapshot.vote.accepted.length,0);
 b.ws.close();await waitFor(()=>!a.snapshot.vote&&a.snapshot.players.length===1,'disconnect cancels');b=await connect();group=[a,b];await waitFor(()=>group.every(c=>c.snapshot?.players.length===2),'rejoined');
 id=await propose(a,group);send(a,{type:'vote',proposalId:id,accept:true,playerId:b.id});send(a,{type:'vote',proposalId:id,accept:true});await waitFor(()=>b.snapshot.vote?.accepted.length===1,'deduplicated identity');assert.equal(b.snapshot.phase,'lobby');send(b,{type:'vote',proposalId:id,accept:true});await waitFor(()=>group.every(c=>c.snapshot.phase==='fight'),'unanimous start');
 send(a,{type:'ability',slot:1,targetId:'boss',damage:99999});await waitFor(()=>group.every(c=>c.snapshot.boss.hp===1764),'Earth Shock authority');
 // Let the first normal Warden mark hit both colocated players; regen is tested against real damage.
 await waitFor(()=>group.every(c=>c.snapshot.players.every(p=>p.hp<100)),'boss damage',6000);
 for(const [i,c] of group.entries()){send(c,{type:'ability',slot:2,target:{x:5+i,z:5},hp:99999});send(c,{type:'ability',slot:3,target:{x:i? -2:2,z:8}});}
 await waitFor(()=>group.every(c=>c.snapshot.totems.length===4),'four synchronized totems');
 for(const c of group){assert.ok(c.snapshot.totems.every(t=>t.hp===1));for(const owner of group)assert.equal(c.snapshot.totems.filter(t=>t.owner===owner.id).length,2)}
 await waitFor(()=>group.every(c=>c.snapshot.players.every(p=>p.hp>=60)),'periodic ally regen');
 await waitFor(()=>group.every(c=>c.snapshot.boss.hp<1764),'totem fireball damage');
 for(const sender of group)for(const skill of ['earthShock','fireTotem','healingTotem']){
  if(skill==='earthShock'&&sender!==a)continue;
  await waitFor(()=>group.every(c=>c.packets.some(m=>m.type==='abilityFx'&&m.skill===skill&&m.playerId===sender.id)),'shared '+skill);
  // Compare an identical authoritative event, rather than snapshots from different ticks.
  assert.deepEqual(group[0].packets.find(m=>m.type==='abilityFx'&&m.skill===skill&&m.playerId===sender.id),group[1].packets.find(m=>m.type==='abilityFx'&&m.skill===skill&&m.playerId===sender.id));
 }
 b.ws.close();await waitFor(()=>a.snapshot.players.length===1&&a.snapshot.totems.every(t=>t.owner===a.id),'disconnect totem cleanup');
 send(a,{type:'hub'});await waitFor(()=>a.snapshot.phase==='lobby'&&a.snapshot.totems.length===0,'hub reset cleanup');
 // Verify actual marker deployments on both clients, not just staggered impact times.
 b=await connect();group=[a,b];await waitFor(()=>group.every(c=>c.snapshot?.players.length===2),'scatter duo');
 send(a,{type:'hub'});await delay(100);id=await propose(a,group,'hardWarden');for(const c of group)send(c,{type:'vote',proposalId:id,accept:true});
 await waitFor(()=>group.every(c=>c.snapshot.phase==='fight'&&c.snapshot.boss.id==='hardWarden'),'hard vote start');
 // Reset spawns at +/-7,0: large blast leaves 36 HP, and pillars protect the sweep.
 const observations=new Map();
 const collect=()=>{for(const m of a.packets.filter(m=>m.type==='snapshot'&&m.boss.id==='hardWarden'))for(const t of m.telegraphs.filter(t=>t.radius===2.6))if(!observations.has(t.id))observations.set(t.id,{now:m.now,t:structuredClone(t)});};
 await waitFor(()=>{collect();return observations.size===1},'first scatter deployment',11000);
 for(let seq=0;seq<25;seq++){send(a,{type:'input',seq,move:{x:0,z:1}});await delay(50);collect();}
 send(a,{type:'input',seq:25,move:{x:0,z:0}});assert.equal(observations.size,3);
 const marks=[...observations.values()];for(let i=1;i<3;i++){assert.ok(Math.abs(marks[i].now-marks[i-1].now-500)<=100);assert.ok(marks[i].t.pos.z>marks[i-1].t.pos.z+1);}
 for(const {t} of marks){const twin=b.packets.filter(m=>m.type==='snapshot').flatMap(m=>m.telegraphs).find(x=>x.id===t.id);assert.deepEqual(twin,t);}
 send(a,{type:'hub'});await waitFor(()=>group.every(c=>c.snapshot.phase==='lobby'),'scatter cleanup');
 console.log('SCATTER_WIRE_SMOKE_OK: three distinct deployments 500ms apart, new tracked positions, identical telegraphs on both clients');
 console.log('VOTE_TOTEM_SMOKE_OK: two WebSockets; proposal, unanimous vote, decline, stale/duplicate/spoofed votes, disconnect; two Shamans, instant damage, 1 HP owned totems, fireballs, ally regen, matching FX, cleanup');
}finally{for(const c of clients)c.ws.close();server?.kill()}
