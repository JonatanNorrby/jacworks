import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
import {countInventory,emptyInventory,grantReward,readInventory,craft,inventoryView} from './inventory';
import type {BossId} from './protocol';
function fight(boss:BossId){let n=0;const g=new Game(()=>{},()=>`ball-${++n}`);g.add('p');g.message('p',{type:'join',boss,classId:'fireMage'});g.message('p',{type:'propose',boss},100);g.message('p',{type:'vote',proposalId:g.vote!.id,accept:true},100);return g;}
for(const boss of ['yellowBall','hardYellowBall'] as const)test(`${boss}: exact threshold, overkill protection, all generations and all-ball victory`,()=>{
 const g=fight(boss),max=g.boss.maxHp;g.damageTarget('boss',max/2-1);g.tick(150);assert.equal(g.adds.length,0);assert.equal(g.boss.hp,max/2+1);
 g.damageTarget('boss',100000);g.damageTarget('boss',100000);assert.equal(g.boss.hp,max/2);
 g.tick(200);assert.equal(g.boss.hp,0);assert.equal(g.phase,'fight');assert.equal(g.reward,undefined);assert.equal(g.adds.length,2);
 assert.ok(g.adds.every(a=>a.hp===max/4&&a.generation===1&&a.height===0));const ids=g.adds.map(a=>a.id);g.tick(250);assert.deepEqual(g.adds.map(a=>a.id),ids);
 if(boss==='hardYellowBall')for(const gen of [2,3]){const old=g.adds.map(a=>a.id);g.area({x:0,z:0},30,100000);g.area({x:0,z:0},30,100000);assert.ok(g.adds.every(a=>a.hp===a.maxHp/2));g.tick(250+gen*50);assert.equal(g.adds.length,2**gen);assert.ok(g.adds.every(a=>a.generation===gen&&a.hp===max/4**gen&&!old.includes(a.id)));}
 const last=g.adds.at(-1)!;for(const a of g.adds.slice(0,-1))g.damageTarget(a.id,100000);g.tick(500);assert.equal(g.phase,'fight');assert.equal(g.targets().length,1);g.damageTarget(last.id,100000);const s=g.tick(550);assert.equal(s.phase,'won');assert.equal(s.adds.length,0);assert.equal(s.reward!.material,boss==='yellowBall'?'sphericalBall':'largeSphere');
 const v=emptyInventory();assert.ok(grantReward(v,s.reward,'p'));assert.ok(!grantReward(v,g.tick(600).reward,'p'));assert.ok(!grantReward(v,s.reward,'late'));assert.deepEqual(readInventory(JSON.stringify(v)),v);
 g.reset();assert.equal(g.adds.length,0);assert.equal(g.balls.brains.size,0);assert.equal(g.boss.hp,max);
});
test('hard bounce chains three separately telegraphed tracked landings, never collapses after a stalled tick',()=>{
 const g=fight('hardYellowBall'),p=g.players.get('p')!;p.hp=10000;
 g.tick(2300);g.tick(3800);g.tick(4600);g.tick(6400);assert.equal(g.telegraphs[0].kind,'circle');
 for(const at of [7500,9600,11700]){g.tick(at);assert.equal(g.motion?.kind,'bounce');g.tick(at+500);assert.ok(g.boss.height>3);p.pos={x:-8,z:0};g.tick(at+1000);if(at<11700){assert.equal(g.telegraphs.length,1);assert.equal(g.telegraphs[0].resolvesAt,at+2100);assert.deepEqual(g.telegraphs[0].pos,p.pos);}}
 assert.equal(g.motion,undefined);assert.equal(g.telegraphs.length,0);g.tick(14500);assert.equal(g.telegraphs[0].kind,'line');
 g.tick(50000);assert.equal(g.balls.brains.get('boss')?.motion?.kind,'roll');assert.equal(g.boss.height,0);
});
test('split cancels parent motion, telegraphs and stale projectile/poison/burn targets',()=>{
 const g=fight('hardYellowBall');g.tick(2300);g.tick(3800);assert.ok(g.motion);g.damageTarget('boss',100000);g.tick(4000);assert.equal(g.motion,undefined);assert.ok(g.telegraphs.every(t=>t.ownerId!=='boss'));assert.equal(g.boss.height,0);
 const hp=g.adds.map(a=>a.hp);g.damageTarget('boss',100);g.effects.push({id:'old',owner:'p',skill:'aimedShot',pos:{...g.boss.pos},targetId:'boss',next:4100,remaining:1,expires:5000});g.burns.set('old',{target:'boss',next:4100,remaining:4});g.tick(4100);assert.deepEqual(g.adds.map(a=>a.hp),hp);
});
test('targeted, AoE and directional abilities hit children; Large Sphere never substitutes for crafting materials',()=>{
 const g=fight('hardYellowBall'),p=g.players.get('p')!;g.damageTarget('boss',1200);g.tick(150);p.pos={x:0,z:3};p.facing={x:0,z:-1};p.loadout=['lazor','fireball','fireMine','dash'];g.message('p',{type:'ability',slot:1},200);assert.ok(g.adds.every(a=>a.hp===510));
 g.effects.push({id:'splash',owner:'p',skill:'fireball',targetId:g.adds[0].id,pos:{x:0,z:0},next:250,remaining:1,expires:1000});g.tick(250);assert.ok(g.adds.every(a=>a.hp===410));g.area({x:0,z:0},4,200);g.tick(300);assert.equal(g.adds.length,4);
 const v=readInventory(JSON.stringify({rewards:{old:'sphericalBall',new:'largeSphere'},crafted:0}));assert.equal(countInventory(v).largeSphere,1);assert.equal(countInventory(v).sphericalBall,1);assert.ok(inventoryView(v).materials.some(m=>m.id==='largeSphere'&&m.count===1));assert.ok(!craft(v));
});

test('walking and Dash collide with child radii and retired primary leaves no phantom body',()=>{
 const g=fight('yellowBall');g.damageTarget('boss',900);g.tick(150);g.adds[0].pos={x:0,z:0};g.adds[1].pos={x:8,z:8};
 const p=g.players.get('p')!;p.pos={x:0,z:3};p.facing={x:0,z:-1};g.message('p',{type:'ability',slot:4},200);assert.ok(p.pos.z>=g.adds[0].radius!+.48-1e-8);
 g.adds[0].pos={x:-8,z:-8};assert.deepEqual(g.movePlayer({x:0,z:0},{x:0,z:0}),{x:0,z:0});
});
test('single-target pointer ID selects child and moving projectile can miss it',()=>{
 const g=fight('hardYellowBall'),p=g.players.get('p')!;g.damageTarget('boss',1200);g.tick(150);p.pos={x:0,z:4};p.loadout=['holyLight','aimedShot','fireball','dash'];
 const a=g.adds[1];g.message('p',{type:'ability',slot:1,targetId:a.id},200);assert.equal(a.hp,568);assert.equal(g.adds[0].hp,600);
 g.message('p',{type:'ability',slot:2,targetId:a.id},300);g.tick(1300);a.pos={x:9,z:9};g.tick(1650);assert.equal(a.hp,568);
});

test('children split independently at their own threshold; normal final children never split again',()=>{
 const g=fight('hardYellowBall');g.damageTarget('boss',1200);g.tick(150);const [a,b]=g.adds;
 g.damageTarget(a.id,299);g.tick(200);assert.equal(g.adds.length,2);g.damageTarget(a.id,1);g.tick(250);assert.equal(g.adds.length,3);assert.equal(g.adds.find(x=>x.id===b.id)!.hp,600);assert.equal(g.adds.filter(x=>x.generation===2).length,2);g.tick(300);assert.equal(g.adds.length,3);
 const normal=fight('yellowBall');normal.damageTarget('boss',900);normal.tick(150);normal.damageTarget(normal.adds[0].id,225);normal.tick(200);assert.equal(normal.adds.length,2);assert.equal(normal.adds[0].hp,225);
});
test('hard child uses its own staggered three-bounce chain and generation-specific height',()=>{
 const g=fight('hardYellowBall');g.players.get('p')!.hp=10000;g.damageTarget('boss',1200);g.tick(150);const child=g.adds[0];
 g.tick(1950);assert.equal(g.telegraphs.find(t=>t.ownerId===child.id)!.kind,'line');assert.ok(!g.telegraphs.some(t=>t.ownerId===g.adds[1].id));g.tick(3450);g.tick(4150);g.tick(6400);
 for(const at of [7500,9500,11500]){g.tick(at);assert.equal(g.balls.brains.get(child.id)!.motion!.kind,'bounce');g.tick(at+450);assert.ok(child.height!>3);g.tick(at+900);}
 assert.equal(g.balls.brains.get(child.id)!.motion,undefined);assert.equal(g.balls.brains.get(child.id)!.chain,0);assert.ok(!g.telegraphs.some(t=>t.ownerId===child.id));
});
