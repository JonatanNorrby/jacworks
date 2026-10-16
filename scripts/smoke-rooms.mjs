import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {setTimeout as delay} from 'node:timers/promises';
import WebSocket from 'ws';
const endpoint=process.env.SMOKE_WS_URL??'ws://localhost:18789/ws';
const server=process.env.SMOKE_WS_URL?null:spawn(process.execPath,['--import','tsx','server/index.ts'],{env:{...process.env,PORT:'18789'},stdio:['ignore','pipe','pipe']});
const clients=[];
const code=crypto.randomUUID();
async function wait(test,label){for(let i=0;i<200;i++){if(test())return;await delay(50)}throw Error('Timeout: '+label)}
function send(c,m){c.ws.send(JSON.stringify(m))}
async function connect(room,name){
 const url=new URL(endpoint);url.searchParams.set('room',room);
 const c={ws:new WebSocket(url),id:null,state:null,chat:[]};clients.push(c);
 c.ws.on('message',raw=>{const m=JSON.parse(String(raw));if(m.type==='chat')c.chat.push(m);if(m.type==='welcome'){c.id=m.id;send(c,{type:'join',name})}if(m.type==='snapshot')c.state=m});
 await wait(()=>c.state?.players.some(p=>p.id===c.id&&p.name===name),'named join');return c;
}
try{
 if(server)await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',n=>reject(Error('Server exit '+n)))});
 const a=await connect(code,'Alice'),b=await connect(code,'Bob');let c=await connect(code,'Chris');let group=[a,b,c];
 const outsider=await connect(code+'-other','Other');
 await wait(()=>group.every(c=>c.state.players.length===3),'three members');
 assert.equal(outsider.state.players.length,1);
 send(a,{type:'chat',text:'  <img src=x>\nhello  ',senderId:outsider.id,name:'forged'});
 await wait(()=>group.every(c=>c.chat.some(m=>m.text==='<img src=x>hello'&&m.name==='Alice'&&m.senderId===a.id)),'safe room chat');
 assert.equal(outsider.chat.some(m=>m.text==='<img src=x>hello'),false);
 send(a,{type:'chat',text:'rate-blocked'});send(b,{type:'chat',text:{bad:true}});await delay(100);
 assert.equal(a.chat.some(m=>m.text==='rate-blocked'),false);
 await delay(1000);send(a,{type:'chat',text:'x'.repeat(400)});await wait(()=>b.chat.some(m=>m.text==='x'.repeat(240)),'bounded chat');
 const before=a.state.players.find(p=>p.id===b.id).pos.x;
 send(b,{type:'input',seq:0,move:{x:1,z:0}});await delay(150);send(b,{type:'input',seq:1,move:{x:0,z:0}});
 await wait(()=>group.every(c=>c.state.players.find(p=>p.id===b.id).pos.x>before),'shared hub movement');
 async function propose(){send(a,{type:'propose',boss:'hardWarden'});await wait(()=>group.every(c=>c.state.vote?.boss==='hardWarden'),'visible proposal');const id=a.state.vote.id;assert.ok(group.every(c=>c.state.vote.id===id));assert.equal(outsider.state.vote,undefined);return id}
 let id=await propose();for(const p of [a,b])send(p,{type:'vote',proposalId:id,accept:true});
 await wait(()=>group.every(c=>c.state.vote?.accepted.length===2),'two votes');assert.ok(group.every(c=>c.state.phase==='lobby'));
 send(c,{type:'vote',proposalId:id,accept:false});await wait(()=>group.every(c=>!c.state.vote),'decline');
 id=await propose();c.ws.close();await wait(()=>a.state.players.length===2&&!a.state.vote,'disconnect cancels');
 c=await connect(code,'Chris');group=[a,b,c];await wait(()=>group.every(c=>c.state.players.length===3),'rejoin');
 send(c,{type:'vote',proposalId:id,accept:true});await delay(100);assert.equal(a.state.vote,undefined);
 id=await propose();for(const p of group)send(p,{type:'vote',proposalId:id,accept:true});
 await wait(()=>group.every(c=>c.state.phase==='fight'&&c.state.boss.id==='hardWarden'),'three unanimous start');
 await delay(1000);send(a,{type:'chat',text:'fight chat'});await wait(()=>b.chat.some(m=>m.text==='fight chat'),'encounter chat');
 assert.equal(outsider.state.phase,'lobby');send(b,{type:'hub'});await wait(()=>group.every(c=>c.state.phase==='lobby'),'shared return');
 id=await propose();const d=await connect(code,'New arrival');await wait(()=>group.every(c=>c.state.players.length===4&&!c.state.vote),'join cancels');d.ws.close();
 console.log('THREE_CLIENT_ROOM_SMOKE_OK: names, hub movement, proposal identity, unanimity, decline, stale vote, reconnect, join cancellation, return, distinct-room isolation: '+endpoint);
}finally{for(const c of clients)c.ws.close();server?.kill()}
