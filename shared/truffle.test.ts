import {test} from 'node:test';
import assert from 'node:assert/strict';
import {TrufflePatrol,moveHubPlayer,TRUFFLE_RADIUS,PLAYER_RADIUS} from './truffle';
import {Game} from './game';
const distance=(a:{x:number;z:number},b:{x:number;z:number})=>Math.hypot(a.x-b.x,a.z-b.z);
test('patrol remains on west lawn and is deterministic over many circuits',()=>{
 const a=new TrufflePatrol(),b=new TrufflePatrol();
 for(let i=0;i<10000;i++){a.tick(.05,[]);b.tick(.05,[]);assert.deepEqual(a.state,b.state);assert.ok(a.state.pos.x>=-8&&a.state.pos.x<=-5);assert.ok(a.state.pos.z>=-2&&a.state.pos.z<=0);}
 assert.ok(a.state.stride>300);
});
test('player sweeps cannot tunnel through NPC, including large movement deltas',()=>{
 const npc={x:-6,z:-2},radius=TRUFFLE_RADIUS+PLAYER_RADIUS;
 const p=moveHubPlayer({x:-10,z:-2},{x:20,z:0},npc);assert.ok(p.x<npc.x);assert.ok(distance(p,npc)>=radius);
 const away=moveHubPlayer(p,{x:-1,z:0},npc);assert.ok(away.x<p.x);
});
test('patrol stops for stationary humans and resumes without pushing them',()=>{
 const a=new TrufflePatrol(),human={x:-6,z:-2};
 for(let i=0;i<100;i++){a.tick(.25,[human]);assert.ok(distance(a.state.pos,human)>=TRUFFLE_RADIUS+PLAYER_RADIUS);}
 assert.equal(a.state.walking,false);const x=a.state.pos.x;a.tick(.25,[]);assert.ok(a.state.pos.x>x);assert.equal(a.state.walking,true);
});
test('authoritative lobby movement collides and late snapshots carry current NPC state',()=>{
 const g=new Game(()=>{},()=> 'id');const p=g.add('a');p.pos={x:-10,z:-2};
 for(let i=0;i<120;i++){const now=1000+i*50;g.message('a',{type:'input',seq:i,move:{x:1,z:0}},now);const s=g.tick(now);assert.ok(distance(p.pos,s.hubNpc!.pos)>=TRUFFLE_RADIUS+PLAYER_RADIUS);}
 const before=g.tick(7000).hubNpc!;g.add('late');const after=g.tick(7000).hubNpc!;assert.deepEqual(before,after);assert.notEqual(before.pos,after.pos);
 g.phase='fight';assert.equal(g.tick(7050).hubNpc,undefined);
});
test('return to hub cannot spawn a player inside the patrolling NPC',()=>{
 const g=new Game(()=>{},()=> 'id');g.add('a');g.add('b');g.hubNpc.state.pos={x:-7,z:0};g.phase='fight';g.reset();
 for(const p of g.players.values())assert.ok(distance(p.pos,g.hubNpc.state.pos)>=TRUFFLE_RADIUS+PLAYER_RADIUS);
});
