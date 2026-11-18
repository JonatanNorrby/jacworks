import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game,fractureQuadrant} from './game';
import {CLASS_DEFINITIONS,gearEligible} from './classes';
import {emptyInventory,craft,countInventory,equip,readInventory,SPOREFANG_BONUS} from './inventory';
import {HARD_TRUFFLE_POISON} from './trufflePoison';
function start(boss:'hardGreenCone'|'fracturer'|'warden'='warden'){
 let id=0;const g=new Game(()=>{},()=>String(++id));const p=g.add('p');
 g.message('p',{type:'propose',boss},100);g.message('p',{type:'vote',proposalId:g.vote!.id,accept:true},100);
 return {g,p};
}
test('Ranger Sporefang Quiver requires both Hard Truffle and large cylinder receipts',()=>{
 const inv=emptyInventory();inv.rewards={a:'largeCylinder',b:'hardTruffleSpore'};
 assert.equal(craft(inv,'sporefangQuiver'),true);
 assert.equal(craft(inv,'sporefangQuiver'),false);
 assert.equal(countInventory(inv).largeCylinder,0);
 assert.equal(countInventory(inv).hardTruffleSpore,0);
 assert.equal(equip(inv,'weapon','sporefangQuiver'),true);
 const loaded=readInventory(JSON.stringify(inv));
 assert.equal(loaded.weapon,'sporefangQuiver');
 assert.equal(loaded.sporeQuivers,1);
 assert.equal(gearEligible('ranger','sporefangQuiver'),true);
 assert.equal(gearEligible('shaman','sporefangQuiver'),false);
 assert.deepEqual(SPOREFANG_BONUS,{aimedShotDamage:100,aimedShotCastMs:2000,arrowRainDamage:35,arrowRainRadius:1.75,splitShotDamage:16,splitShotArrows:5});
 for(const cls of ['ranger','shaman'] as const){
  const g=new Game(()=>{},()=> 'id');const p=g.add('p');
  g.message('p',{type:'join',classId:cls,loadout:CLASS_DEFINITIONS[cls].skills,inventory:inv},100);
  assert.equal(p.weapon,cls==='ranger'?'sporefangQuiver':null);
 }
});
test('Boot slots are independent from other gear and persist after reload',()=>{
 const inv=emptyInventory();
 inv.rewards={a:'largeSphere',b:'sphericalBall',c:'conicalTaper',d:'conicalTaper',e:'hardTruffleSpore'};
 assert.equal(craft(inv,'fleetfootBoots'),true);
 assert.equal(craft(inv,'mirewalkerBoots'),true);
 assert.equal(countInventory(inv).fleetfootBoots,1);
 assert.equal(countInventory(inv).mirewalkerBoots,1);
 assert.equal(equip(inv,'boots','mirewalkerBoots'),true);
 assert.equal(readInventory(JSON.stringify(inv)).boots,'mirewalkerBoots');
 assert.equal(gearEligible('shaman','mirewalkerBoots'),true);
});
test('Hard Truffle simultaneously marks all living players and produces overlapping clouds',()=>{
 const {g,p}=start('hardGreenCone');const q=g.add('q');
 p.pos={x:9,z:9};q.pos={x:-9,z:-9};
 g.next=Infinity;
 const first=g.tick(4100);
 assert.deepEqual(first.poisonMarks?.map(m=>m.playerId).sort(),['p','q']);
 const detonate=first.poisonMarks![0].detonatesAt;
 const second=g.tick(detonate);
 assert.equal(second.poisonClouds?.length,2);
 assert.equal(second.poisonClouds?.every(c=>c.radius===HARD_TRUFFLE_POISON.radius),true);
});
test('Fracturer warns then removes a real corner and resets safely',()=>{
 const {g,p}=start('fracturer');g.next=Infinity;
 assert.equal(g.boss.maxHp,2500);
 p.pos={x:8,z:8};
 let state=g.tick(7099);
 assert.equal(state.arenaCuts?.length,0);
 state=g.tick(7100);
 assert.equal(state.arenaCuts?.length,1);
 assert.equal(state.arenaCuts![0].quadrant,0);
 assert.equal(fractureQuadrant(p.pos),0);
 state=g.tick(9300);
 assert.ok(p.pos.x<=3&&p.pos.z<=3);
 assert.ok(p.hp<100);
 g.reset();assert.equal(g.arenaCuts.length,0);
});
test('Training dummies are authoritative, limited range, and respawn',()=>{
 const g=new Game(()=>{},()=> 'id');const p=g.add('p');
 g.message('p',{type:'join',classId:'ranger',loadout:CLASS_DEFINITIONS.ranger.skills},100);
 assert.equal(g.tick(100).trainingDummies?.length,3);
 const d=g.trainingDummies[0];
 p.pos={x:d.pos.x+2,z:d.pos.z};
 g.message('p',{type:'practice',slot:1,dummyId:d.id},200);
 assert.equal(d.hp,442);
 g.message('p',{type:'practice',slot:1,dummyId:d.id},201);
 assert.equal(d.hp,442);
 p.pos={x:10,z:10};g.message('p',{type:'practice',slot:2,dummyId:d.id},2500);
 assert.equal(d.hp,442);
 d.hp=0;d.respawnAt=5000;
 g.tick(4999);assert.equal(d.hp,0);
 g.tick(5000);assert.equal(d.hp,500);
});
