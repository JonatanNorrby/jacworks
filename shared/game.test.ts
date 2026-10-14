import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game,beamHits,moveSolid,distance} from './game';
import {craft,countInventory,emptyInventory,grantReward,readInventory} from '../client/src/inventory';
const room=()=>{let n=0;return new Game(()=>{},()=>`test-${++n}`)};
test('swept movement blocks dash and permits tangent sliding and moving-boss separation',()=>{
  const b={x:0,z:0};const p=moveSolid({x:0,z:3},{x:0,z:-7},b);assert.ok(p.z>=1.729);
  const slide=moveSolid({x:0,z:1.73},{x:1,z:-.3},b);assert.ok(slide.x>.5);assert.ok(distance(slide,b)>=1.729);
  const pushed=moveSolid({x:0,z:0},{x:0,z:0},{x:.5,z:0});assert.ok(distance(pushed,{x:.5,z:0})>=1.729);
});
test('beam hits only its forward segment including edge intersections',()=>{
  assert.ok(beamHits({x:0,z:0},{x:0,z:1},{x:0,z:8}));
  assert.ok(!beamHits({x:0,z:0},{x:0,z:1},{x:4,z:8}));
  assert.ok(!beamHits({x:0,z:0},{x:0,z:1},{x:0,z:-4}));
  assert.ok(!beamHits({x:0,z:0},{x:0,z:1},{x:0,z:18}));
});
test('inputs reject invalid shape, nonfinite values, excessive magnitude and stale sequence',()=>{
  const g=room(),p=g.add('p');for(const m of [null,[],{type:'input',seq:0,move:null},{type:'input',seq:1,move:{x:Infinity,z:0}},{type:'input',seq:1,move:{x:20,z:0}}])g.message('p',m,100);
  assert.equal(g.moves.size,0);g.message('p',{type:'input',seq:4,move:{x:1,z:0}},100);g.message('p',{type:'input',seq:3,move:{x:-1,z:0}},100);assert.equal(g.moves.get('p')!.v.x,1);
  g.message('p',{type:'ready'},100);g.tick(150);assert.deepEqual(p.facing,{x:1,z:0});g.tick(500);assert.deepEqual(p.facing,{x:1,z:0});
});
test('boss choice locks across players and joins cannot replace active loadout',()=>{
  const g=room();g.add('a');g.message('a',{type:'join',boss:'yellowBall'});g.add('b');g.message('b',{type:'join',boss:'warden'});assert.equal(g.boss.id,'yellowBall');g.message('a',{type:'ready'},100);g.message('b',{type:'ready'},100);g.message('a',{type:'join',loadout:['lazor','dash','guard','holyNova']});assert.equal(g.players.get('a')!.loadout[0],'arcBolt');
});
test('LAZOR damage, cooldown, missed beam and dash use server state',()=>{
  const g=room(),p=g.add('p');g.message('p',{type:'join',loadout:['lazor','dash','guard','holyNova']});g.message('p',{type:'ready'},100);
  p.pos={x:0,z:4};p.facing={x:0,z:-1};g.message('p',{type:'ability',slot:1,damage:999999},200);assert.equal(g.boss.hp,1710);
  g.message('p',{type:'ability',slot:1},201);assert.equal(g.boss.hp,1710);p.facing={x:1,z:0};g.message('p',{type:'ability',slot:1},3000);assert.equal(g.boss.hp,1710);
  p.facing={x:0,z:-1};g.message('p',{type:'ability',slot:2},3001);assert.ok(p.pos.z>=1.729);
});
test('Yellow Ball has telegraphed rolling and bouncing server motion',()=>{
  const g=room();g.add('p');g.message('p',{type:'join',boss:'yellowBall'});g.message('p',{type:'ready'},100);
  g.tick(2300);assert.equal(g.telegraphs[0].kind,'line');g.tick(3800);assert.equal(g.motion?.kind,'roll');g.tick(4200);assert.ok(g.boss.pos.z>0);
  g.tick(4600);g.tick(5900);assert.equal(g.telegraphs[0].kind,'circle');g.tick(7400);assert.equal(g.motion?.kind,'bounce');g.tick(7900);assert.ok(g.boss.height>3);g.tick(8400);assert.equal(g.boss.height,0);
});
test('server grants a unique victory receipt; snapshot replay and late join never award twice',()=>{
  const g=room();g.add('p');g.message('p',{type:'ready'},100);g.boss.hp=0;const s=g.tick(150),inv=emptyInventory();assert.ok(grantReward(inv,s.reward,'p'));assert.ok(!grantReward(inv,g.tick(200).reward,'p'));assert.ok(!grantReward(inv,s.reward,'late'));assert.equal(countInventory(inv).cylinderTube,1);
  g.message('p',{type:'ready'},300);g.boss.hp=0;assert.ok(grantReward(inv,g.tick(350).reward,'p'));assert.equal(countInventory(inv).cylinderTube,2);
});
test('craft requires and consumes one of each, persists result and deduplication',()=>{
  const inv=emptyInventory();assert.ok(!craft(inv));grantReward(inv,{id:'w',material:'cylinderTube',players:['p']},'p');grantReward(inv,{id:'y',material:'sphericalBall',players:['p']},'p');assert.ok(craft(inv));assert.deepEqual(countInventory(inv),{cylinderTube:0,sphericalBall:0,primitiveWand:1});assert.ok(!craft(inv));const saved=readInventory(JSON.stringify(inv));assert.equal(countInventory(saved).primitiveWand,1);assert.ok(!grantReward(saved,{id:'w',material:'cylinderTube',players:['p']},'p'));
});
