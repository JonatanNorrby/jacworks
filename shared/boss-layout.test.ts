import {test} from 'node:test';
import assert from 'node:assert/strict';
import {BOSS_CIRCLES,BOSS_PEDESTALS,BOSS_INTERACTION_RADIUS,nearbyBoss} from './boss-layout';
import {moveHubPlayer,TrufflePatrol,PLAYER_RADIUS,TRUFFLE_RADIUS} from './truffle';
import {Game,distance} from './game';
import type {BossId} from './protocol';
const expected:Record<BossId,string>={warden:'Normal',yellowBall:'Normal',greenCone:'Normal',hardWarden:'Hard',hardYellowBall:'Hard'};
test('every existing boss occurs once, in its difficulty circle with nonoverlapping interactions',()=>{
 assert.equal(BOSS_PEDESTALS.length,Object.keys(expected).length);
 assert.deepEqual([...new Set(BOSS_PEDESTALS.map(p=>p.id))].sort(),Object.keys(expected).sort());
 for(const p of BOSS_PEDESTALS){assert.equal(p.difficulty,expected[p.id]);const circle=BOSS_CIRCLES.find(c=>c.difficulty===p.difficulty)!;assert.ok(Math.abs(distance(p.pos,circle.center)-circle.radius)<1e-9);assert.equal(nearbyBoss(p.pos)?.id,p.id);
  assert.ok(Math.abs(p.pos.x)+BOSS_INTERACTION_RADIUS<11.5&&Math.abs(p.pos.z)+BOSS_INTERACTION_RADIUS<9.5);
  for(const q of BOSS_PEDESTALS)if(p!==q)assert.ok(distance(p.pos,q.pos)>2*BOSS_INTERACTION_RADIUS);
  for(const station of [{x:-4.3,z:3.5},{x:4.3,z:3.5},{x:5.5,z:-2.5}])assert.ok(distance(p.pos,station)>2.6+BOSS_INTERACTION_RADIUS);
 }
 assert.equal(nearbyBoss({x:0,z:-6.4}),undefined);
});
test('all pedestals accessible from spawn via central aisle and north lawn, clear of the whole NPC patrol',()=>{
 const patrol=new TrufflePatrol();for(let i=0;i<1500;i++){patrol.tick(.05,[]);for(const p of BOSS_PEDESTALS)assert.ok(distance(p.pos,patrol.state.pos)>TRUFFLE_RADIUS+PLAYER_RADIUS+BOSS_INTERACTION_RADIUS);}
 for(const pedestal of BOSS_PEDESTALS){let pos={x:0,z:8};for(const target of [{x:0,z:-6.5},pedestal.pos]){pos=moveHubPlayer(pos,{x:target.x-pos.x,z:target.z-pos.z},{x:-5,z:-2});assert.ok(distance(pos,target)<1e-8);}assert.equal(nearbyBoss(pos)?.id,pedestal.id);}
});
test('every pedestal boss preserves unanimous multiplayer selection, decline and retry IDs',()=>{
 for(const pedestal of BOSS_PEDESTALS){const g=new Game(()=>{},()=> 'proposal');g.add('a');g.add('b');g.message('a',{type:'propose',boss:pedestal.id},100);assert.equal(g.vote?.boss,pedestal.id);g.message('a',{type:'vote',proposalId:g.vote!.id,accept:true},101);assert.equal(g.phase,'lobby');g.message('b',{type:'vote',proposalId:g.vote!.id,accept:false},102);assert.equal(g.vote,undefined);
 g.message('b',{type:'propose',boss:pedestal.id},103);const id=g.tick(103).vote!.id;g.message('a',{type:'vote',proposalId:id,accept:true},104);g.message('b',{type:'vote',proposalId:id,accept:true},105);assert.equal(g.phase,'fight');assert.equal(g.boss.id,pedestal.id);g.message('a',{type:'hub'},106);assert.equal(g.phase,'lobby');}
});
