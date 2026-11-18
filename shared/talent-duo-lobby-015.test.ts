import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
import {CLASS_DEFINITIONS} from './classes';
import {readTalents,emptyTalents,talentAvailable,unlockTalent,respecTalents,hasTalent} from './talents';
import {BOSS_CIRCLES,nearbyBoss} from './boss-layout';
import {emptyInventory,grantReward,countInventory,readInventory} from './inventory';

const make=(id=1,live=true)=>new Game(()=>{},()=>String(id++),live);
function start(g:Game,boss:'warden'|'yellowBall'|'greenCone'|'duoYellowWarden'|'duoTruffleFracturer'='warden',now=100){
 g.message('a',{type:'propose',boss},now);
 assert.ok(g.vote);g.message('a',{type:'vote',proposalId:g.vote!.id,accept:true},now);
 assert.equal(g.phase,'fight');g.next=Infinity;
}
test('Double is its own accessible boss circle with two pedestals',()=>{
 const circle=BOSS_CIRCLES.find(c=>c.difficulty==='Double')!;
 assert.equal(circle.bosses.length,2);
 for(const [id] of circle.bosses){const pos={x:circle.center.x+(id==='duoYellowWarden'?circle.radius:-circle.radius),z:circle.center.z};assert.ok(nearbyBoss(pos));}
});
test('Talent rank starts at zero, earns a point only for first victory per unique encounter, and respec is free',()=>{
 const g=make();const p=g.add('a');
 g.message('a',{type:'join',classId:'shaman',loadout:CLASS_DEFINITIONS.shaman.skills},50);
 assert.equal(talentAvailable(p.talents!),0);assert.equal(hasTalent(p.talents,'shaman','unyieldingForce'),false);
 start(g);g.damageTarget('boss',5000,'a');let result=g.tick(120);
 assert.equal(result.phase,'won');assert.deepEqual(p.talents!.wins,['warden']);assert.equal(talentAvailable(p.talents!),1);
 g.message('a',{type:'hub'},200);g.message('a',{type:'talent',action:'unlock',classId:'shaman',nodeId:'partingGift'},210);
 assert.equal(hasTalent(p.talents,'shaman','partingGift'),false);
 g.message('a',{type:'talent',action:'unlock',classId:'shaman',nodeId:'unyieldingForce'},220);
 assert.equal(hasTalent(p.talents,'shaman','unyieldingForce'),true);assert.equal(talentAvailable(p.talents!),0);
 start(g,'warden',300);g.damageTarget('boss',5000,'a');result=g.tick(320);
 assert.deepEqual(result.talentAward?.players,[]);assert.equal(p.talents!.wins.length,1);
 g.message('a',{type:'hub'},350);
 start(g,'greenCone',400);g.damageTarget('boss',5000,'a');result=g.tick(420);
 assert.deepEqual(p.talents!.wins,['warden','greenCone']);assert.equal(talentAvailable(p.talents!),1);
 g.message('a',{type:'hub'},450);
 g.message('a',{type:'talent',action:'unlock',classId:'shaman',nodeId:'partingGift'},460);
 assert.equal(hasTalent(p.talents,'shaman','partingGift'),true);
 g.message('a',{type:'talent',action:'respec',classId:'shaman'},470);
 assert.equal(talentAvailable(p.talents!),2);assert.deepEqual(p.talents!.wins,['warden','greenCone']);assert.equal(hasTalent(p.talents,'shaman','unyieldingForce'),false);
 const saved=readTalents(JSON.stringify(p.talents));
 assert.equal(talentAvailable(saved),2);
});
test('Server ignores attempts to buy nodes without points or prerequisites; invalid allocations are sanitized',()=>{
 const g=make();const p=g.add('a');
 g.message('a',{type:'talent',action:'unlock',classId:'shaman',nodeId:'unyieldingForce'},10);
 assert.equal(talentAvailable(p.talents!),0);
 assert.deepEqual(readTalents({wins:['warden','warden','bogus'],picks:{shaman:['violentFarewell','unyieldingForce','partingGift']}}),{wins:['warden'],picks:{shaman:['unyieldingForce']}});
 const progress=emptyTalents();progress.wins=['warden','greenCone','yellowBall'];
 assert.equal(unlockTalent(progress,'shaman','violentFarewell'),false);
 assert.equal(unlockTalent(progress,'shaman','unyieldingForce'),true);
 assert.equal(unlockTalent(progress,'shaman','partingGift'),true);
 assert.equal(unlockTalent(progress,'shaman','violentFarewell'),true);
 assert.equal(talentAvailable(progress),0);
 respecTalents(progress,'shaman');assert.equal(talentAvailable(progress),3);
});
test('Live servers apply +3% dealt/-3% received only after starter node unlocked',()=>{
 const g=make();const p=g.add('a');p.classId='shaman';
 start(g);
 g.damageTarget('boss',100,'a');assert.equal(g.boss.hp,1700);
 g.hurt(p,110,50);assert.equal(p.hp,50);
 p.talents={wins:['warden'],picks:{shaman:['unyieldingForce']}};
 g.damageTarget('boss',100,'a');assert.equal(g.boss.hp,1597);
 g.hurt(p,111,50);assert.equal(p.hp,1.5);
});
test('Shaman totems burst for 30 on natural expiry, and require second node for early destruction',()=>{
 for(const [broken,extra,expected] of [[false,false,30],[true,false,0],[true,true,30]] as const){
  const g=make(1,false),p=g.add('a');p.classId='shaman';p.loadout=[...CLASS_DEFINITIONS.shaman.skills];
  p.talents={wins:['warden','greenCone','yellowBall'],picks:{shaman:extra?['unyieldingForce','partingGift','violentFarewell']:['unyieldingForce','partingGift']}};
  start(g);p.pos={x:0,z:2};
  g.message('a',{type:'ability',slot:3,target:{x:0,z:0}},200);
  assert.equal(g.totems.length,1);
  if(broken)g.totems[0].hp=0;
  const now=broken?300:15201;
  g.tick(now);
  assert.equal(g.boss.hp,1800-expected);
  assert.equal(g.totems.length,0);
 }
});
test('Yellow Ball in double mode splits into two independent rolling and bouncing enemies',()=>{
 const g=make();g.add('a');start(g,'duoYellowWarden');
 const parent=g.adds.find(a=>a.kind==='duoBoss')!;
 g.damageTarget(parent.id,999999,'a');g.tick(200);
 const children=g.adds.filter(a=>a.kind==='ball');
 assert.equal(children.length,2);assert.ok(children.every(a=>a.hp>0));
 g.tick(2300);
 assert.ok(g.telegraphs.some(t=>children.some(a=>a.id===t.ownerId)));
 g.tick(4000);g.tick(4500);
 assert.ok(children.some(a=>(a.height??0)>0||Math.abs(a.pos.x-parent.pos.x)>1.5));
 g.damageTarget('boss',999999,'a');assert.equal(g.tick(4550).phase,'fight');
 for(const child of g.adds.filter(a=>a.kind==='ball'))g.damageTarget(child.id,999999,'a');
 const result=g.tick(4600);
 assert.equal(result.phase,'won');assert.equal(result.reward?.material,'duoCore');assert.equal(result.bonusRewards?.length,0);
});
test('Dedicated double loot is persisted and does not grant old material receipts',()=>{
 const g=make();g.add('a');start(g,'duoTruffleFracturer');
 g.damageTarget('boss',99999,'a');g.damageTarget('duo-partner',99999,'a');
 const state=g.tick(200);assert.equal(state.phase,'won');assert.equal(state.reward?.material,'duoSpore');
 const inventory=emptyInventory();assert.equal(grantReward(inventory,state.reward,'a'),true);
 const restored=readInventory(JSON.stringify(inventory));assert.equal(countInventory(restored).duoSpore,1);assert.equal(countInventory(restored).conicalTaper,0);
});
test('Lobby skills create a visible totem and real cooldowns, then recharge',()=>{
 const g=make();const p=g.add('a');g.message('a',{type:'join',classId:'shaman',loadout:CLASS_DEFINITIONS.shaman.skills},50);
 g.message('a',{type:'practice',slot:2,dummyId:''},100);
 assert.equal(g.totems.length,1);assert.equal(g.totems[0].kind,'fireTotem');assert.ok(p.cooldowns[1]>100);
 g.tick(300);assert.equal(g.tick(300).totems.length,1);
 g.message('a',{type:'practice',slot:4,dummyId:''},400);
 assert.equal(p.dashCharges,0);assert.ok(p.dashRechargeAt>400);
 g.tick(3100);assert.equal(p.dashCharges,1);
 g.tick(15300);assert.equal(g.totems.length,0);
});
