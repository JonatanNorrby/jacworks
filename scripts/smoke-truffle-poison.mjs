import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import WebSocket from 'ws';
const endpoint=process.env.SMOKE_WS_URL??'ws://localhost:18792/ws';
const server=process.env.SMOKE_WS_URL?null:spawn(process.execPath,['--import','tsx','server/index.ts'],{env:{...process.env,PORT:'18792'},stdio:['ignore','pipe','pipe']});
const room='poison-'+crypto.randomUUID(),clients=[],seen=new Map();let matched=0,seq=0;
async function waitFor(predicate,label,timeout=12000){const end=Date.now()+timeout;while(Date.now()<end){if(predicate())return;await delay(20);}throw Error('Timeout: '+label);}
async function connect(){const url=new URL(endpoint);url.searchParams.set('room',room);const c={ws:new WebSocket(url),state:null,id:null};clients.push(c);c.ws.on('message',raw=>{const p=JSON.parse(String(raw));if(p.type==='welcome')c.id=p.id;if(p.type==='snapshot'){c.state=p;const poison={mark:p.poisonMark,clouds:p.poisonClouds};if(seen.has(p.now)){assert.deepEqual(poison,seen.get(p.now));matched++;}else seen.set(p.now,poison);}});await waitFor(()=>c.id&&c.state,'welcome');return c;}
const send=(c,m)=>c.ws.send(JSON.stringify(m));
try{
 if(server)await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(Error('Server exit '+code)));});
 const a=await connect(),b=await connect();send(a,{type:'propose',boss:'greenCone'});await waitFor(()=>a.state.vote&&b.state.vote,'vote');for(const c of [a,b])send(c,{type:'vote',proposalId:a.state.vote.id,accept:true});
 await waitFor(()=>a.state.poisonMark,'mark');const mark=a.state.poisonMark;assert.equal(mark.playerId,a.id);assert.equal(mark.detonatesAt-mark.markedAt,5000);
 const initial={...a.state.players.find(p=>p.id===a.id).pos};
 for(let i=0;i<25;i++){send(a,{type:'input',seq:seq++,move:{x:1,z:0}});await delay(50);}send(a,{type:'input',seq:seq++,move:{x:0,z:0}});
 const late=await connect();assert.deepEqual(late.state.poisonMark,mark);
 await waitFor(()=>a.state.poisonClouds?.length,'cloud');const cloud=a.state.poisonClouds[0],player=a.state.players.find(p=>p.id===a.id);assert.deepEqual(cloud.pos,player.pos);assert.ok(cloud.pos.x>initial.x+3);assert.equal(cloud.activeAt-cloud.spawnedAt,1500);assert.equal(cloud.expiresAt-cloud.spawnedAt,10000);assert.ok(cloud.spawnedAt>=mark.detonatesAt&&cloud.spawnedAt-mark.detonatesAt<250);
 const hp=player.hp;await waitFor(()=>a.state.now>=cloud.activeAt&&a.state.players.find(p=>p.id===a.id).hp<hp,'first damage');assert.equal(a.state.players.find(p=>p.id===a.id).hp,hp-8);
 for(let i=0;i<16;i++){send(a,{type:'input',seq:seq++,move:{x:0,z:-1}});await delay(50);}send(a,{type:'input',seq:seq++,move:{x:0,z:0}});
 await waitFor(()=>a.state.now>=cloud.expiresAt,'expiry');assert.equal(a.state.poisonClouds.length,0);assert.ok(matched>100);
 send(a,{type:'hub'});await waitFor(()=>clients.every(c=>c.state.phase==='lobby'&&!c.state.poisonMark&&!c.state.poisonClouds.length),'hub cleanup');
 console.log(`TRUFFLE_POISON_WIRE_OK: ${matched} matching snapshots, moving target, five-second deadline, late join, grace, 8 damage pulse, expiry, hub cleanup; ${endpoint}`);
}finally{for(const c of clients)c.ws.close();server?.kill();}
