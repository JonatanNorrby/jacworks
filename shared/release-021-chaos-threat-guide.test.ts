import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game,partyBossMultiplier,bossBaseHp} from './game';
import {CHAOS_BASE_BOSSES,CHAOS_BASE_HP,CHAOS_ARENA_LIMIT} from './chaos';
import {CLASS_DEFINITIONS} from './classes';
import {GEAR_SLOTS,RECIPES,emptyInventory,readInventory,craft,equipForClass,rememberClassGear,activateClassGear,countInventory,type Material,type Gear} from './inventory';
import {TALENT_TREE,TALENT_NODES,TALENT_POINT_BOSSES,emptyTalents,unlockTalent,readTalents,type TalentId} from './talents';
import {MATERIAL_SOURCES,readCodex,emptyCodex,observeCodex,CODEX_MECHANICS} from './codex';
import type {ClassId} from './classes';
import type {BossId} from './protocol';
function game(boss:BossId='warden',count=1,cls:ClassId='warrior'){
 let serial=0;const g=new Game(()=>{},()=>String(++serial),true);
 for(let i=0;i<count;i++){const id='p'+i;g.add(id);g.message(id,{type:'join',classId:i===0?cls:'priest',loadout:CLASS_DEFINITIONS[i===0?cls:'priest'].skills},75);}
 g.message('p0',{type:'propose',boss},100);
 const vote=g.vote!.id;
 for(let i=0;i<count;i++)g.message('p'+i,{type:'vote',proposalId:vote,accept:true},101+i);
 assert.equal(g.phase,'fight');
 g.next=Infinity;
 return {g,p:g.players.get('p0')!};
}
const rangerItems=['sporefangQuiver','sporestormQuiver','splitthornQuiver','rottingFletching','broodQuiver'] as const;
function craftItems(items:readonly Gear[]){
 const inv=emptyInventory();let id=0;
 for(const gear of items)for(const [material,cost] of Object.entries(RECIPES[gear]))for(let i=0;i<cost;i++)
  inv.rewards['receipt-'+id++]=material as Material;
 for(const gear of items){assert.equal(craft(inv,gear),true,gear);assert.equal(countInventory(inv)[gear],1);}
 return inv;
}
test('All five Ranger skill items occupy different slots and coexist while retaining recipes and migration',()=>{
 const inv=craftItems(rangerItems);
 const slots=rangerItems.map(id=>GEAR_SLOTS[id]);
 assert.equal(new Set(slots).size,5);
 assert.deepEqual(slots,['weapon','armour','head','boots','offhand']);
 for(const id of rangerItems)assert.equal(equipForClass(inv,'ranger',GEAR_SLOTS[id],id),true);
 const loaded=readInventory(JSON.stringify(inv));
 for(const id of rangerItems)assert.equal(loaded[GEAR_SLOTS[id]],id);
 assert.deepEqual(loaded.gearSets.ranger,{weapon:'sporefangQuiver',head:'splitthornQuiver',offhand:'broodQuiver',armour:'sporestormQuiver',boots:'rottingFletching'});
 for(const id of rangerItems)assert.equal(countInventory(loaded)[id],1);
 const old=craftItems(['sporestormQuiver']);old.offhand='sporestormQuiver' as never;
 const migrated=readInventory(JSON.stringify(old));
 assert.equal(migrated.armour,'sporestormQuiver');assert.equal(migrated.offhand,null);
});
test('Ranger -> Fire Mage -> Ranger remembers both classes actual gear, including shared slots',()=>{
 const inv=craftItems([...rangerItems,'emberWand','cinderweaveArmour','pointyOrb']);
 for(const id of rangerItems)assert.equal(equipForClass(inv,'ranger',GEAR_SLOTS[id],id),true);
 rememberClassGear(inv,'ranger');
 activateClassGear(inv,'fireMage');
 assert.equal(inv.weapon,null);
 assert.equal(inv.offhand,null);
 for(const id of ['emberWand','cinderweaveArmour','pointyOrb'] as const)assert.equal(equipForClass(inv,'fireMage',GEAR_SLOTS[id],id),true);
 const saved=readInventory(JSON.stringify(inv));
 activateClassGear(saved,'ranger');
 for(const id of rangerItems)assert.equal(saved[GEAR_SLOTS[id]],id);
 activateClassGear(saved,'fireMage');
 assert.equal(saved.weapon,'emberWand');assert.equal(saved.armour,'cinderweaveArmour');assert.equal(saved.offhand,'pointyOrb');
 assert.equal(equipForClass(saved,'fireMage','offhand','broodQuiver'),false,'cannot spoof class-restricted item');
});
test('Boss HP scales exactly +50 percent per additional player and stays locked on late join',()=>{
 for(let n=1;n<=4;n++){
  const {g}=game('hardWarden',n);
  assert.equal(partyBossMultiplier(n),1+.5*(n-1));
  assert.equal(g.boss.maxHp,bossBaseHp('hardWarden')*partyBossMultiplier(n));
  const old=g.boss.maxHp;g.add('late');assert.equal(g.boss.maxHp,old);
 }
});
test('Threat tracks damage and effective healing; Guard and Bulwark force boss attention',()=>{
 const {g,p}=game('warden',2,'warrior'),priest=g.players.get('p1')!;
 p.pos={x:5,z:0};priest.pos={x:2,z:0};
 g.damageTarget('boss',300,priest.id);
 assert.equal(g.selectTarget(200,g.boss.pos)?.id,'p1');
 g.message('p0',{type:'ability',slot:3},300);
 assert.equal(g.selectTarget(400,g.boss.pos)?.id,'p0');
 g.damageTarget('boss',200,priest.id);
 assert.equal(g.selectTarget(2500,g.boss.pos)?.id,'p1','taunt expires and substantially higher threat takes over');
 priest.hp=50;g.heal(priest,20,'p1');assert.ok((g.threat.get('p1')??0)>300);
 const defender=game('warden',2,'defender');
 defender.g.damageTarget('boss',200,'p1');
 defender.g.message('p0',{type:'ability',slot:2},400);
 assert.equal(defender.g.selectTarget(500,defender.g.boss.pos)?.id,'p0');
});
test('Three four-node branches per class are true prerequisites with shared first-clear point cap',()=>{
 assert.equal(TALENT_POINT_BOSSES.length,11);
 for(const [cls,tree] of Object.entries(TALENT_TREE) as [ClassId,typeof TALENT_TREE[ClassId]][]){
  assert.equal(tree.nodes.length,13);assert.equal(tree.branches.length,3);
  for(const chain of tree.branches){
   assert.equal(chain.length,4);
   const p=emptyTalents();p.wins=[...TALENT_POINT_BOSSES];
   assert.equal(unlockTalent(p,cls,chain[3]),false);
   assert.equal(unlockTalent(p,cls,'unyieldingForce'),true);
   for(let i=0;i<4;i++){
    assert.equal(TALENT_NODES[chain[i]].requires,i===0?'unyieldingForce':chain[i-1]);
    assert.equal(unlockTalent(p,cls,chain[i]),true);
   }
   assert.deepEqual(readTalents(p).picks[cls],['unyieldingForce',...chain]);
  }
 }
});
test('Fireball becomes stronger but triple-projectile armour is a tradeoff, not triple damage',()=>{
 function hit(wand=false,armour=false){
  const {g,p}=game('warden',1,'fireMage');p.pos={x:0,z:4};p.facing={x:0,z:-1};
  if(wand)p.weapon='emberWand';if(armour)p.armour='cinderweaveArmour';
  g.message('p0',{type:'ability',slot:1,targetId:'boss'},200);
  assert.equal(p.cast?.endsAt,wand?1200:2200);
  g.tick(wand?1200:2200);g.tick(wand?1550:2550);
  return 1800-g.boss.hp;
 }
 assert.equal(hit(),140);
 assert.equal(hit(true),70);
 assert.equal(hit(false,true),144);
 assert.equal(hit(true,true),72);
});
test('Chaos room starts 5 individual bosses in 50x50 floor with independent health and difficulty scaling',()=>{
 for(const n of [1,4]){
  const {g,p}=game('chaosArena',n);
  assert.equal(g.arenaLimit(),CHAOS_ARENA_LIMIT);
  assert.equal(g.boss.maxHp,CHAOS_BASE_HP*partyBossMultiplier(n));
  assert.equal(g.adds.filter(a=>a.kind==='chaosBoss').length,5);
  for(const entry of CHAOS_BASE_BOSSES){
   const body=g.adds.find(a=>a.kind==='chaosBoss'&&a.bossId===entry.id)!;
   assert.ok(body);assert.equal(body.maxHp,entry.hp*partyBossMultiplier(n));
  }
  assert.equal(p.pos.z,-17);
  g.damageTarget('boss',1e7,'p0');assert.equal(g.boss.hp,CHAOS_BASE_HP*partyBossMultiplier(n));
  const queen=g.adds.find(a=>a.bossId==='antQueen')!;
  g.damageTarget(queen.id,1e7,'p0');assert.equal(queen.hp,1200*partyBossMultiplier(n));
  g.tick(1800);
  assert.ok(g.adds.some(a=>a.kind==='royalGuard'));
  assert.ok(g.adds.some(a=>a.kind==='antWorker'));
  g.tick(6800);assert.ok(g.telegraphs.some(t=>t.style==='rockfall'));
  if(n===1)assert.ok(g.telegraphs.some(t=>t.style==='rockfall'&&t.pos.z<-14.5),'Rockfall targets the expanded Chaos arena, not the old Nest bounds');
  g.tick(11500);assert.ok(g.fracturerSurge,'Fracturer cardinal still present');
 }
});
test('Chaos Queen needs 4 Royal deaths while Yellow Ball can split, boss victory earns exclusive reward',()=>{
 const {g}=game('chaosArena',1);
 g.nextAntRockfallAt=Infinity;
 for(let i=0;i<4;i++){
  const at=1800+i*9500;
  g.tick(at);const guard=g.adds.find(a=>a.kind==='royalGuard')!;
  assert.ok(guard);
  g.damageTarget(guard.id,1e7,'p0');
  const queen=g.adds.find(a=>a.kind==='chaosBoss'&&a.bossId==='antQueen');
  assert.equal(queen?.hp??0,Math.max(0,1200-300*(i+1)));
 }
 const yellow=g.adds.find(a=>a.kind==='chaosBoss'&&a.bossId==='yellowBall')!;
 g.damageTarget(yellow.id,1e7,'p0');g.tick(31000);
 assert.equal(g.adds.some(a=>a.kind==='chaosBoss'&&a.bossId==='yellowBall'),false);
 assert.ok(g.adds.filter(a=>a.kind==='ball').length>=2,'Yellow Ball splits in Chaos');
 for(const boss of g.adds.filter(a=>a.kind==='chaosBoss'))g.damageTarget(boss.id,1e7,'p0');
 // All split children can be defeated and removed by ordinary Ball mechanics.
 for(let step=0;step<8;step++){
  for(const b of g.adds.filter(a=>a.kind==='ball'))g.damageTarget(b.id,1e7,'p0');
  g.tick(32000+step*100);
 }
 assert.equal(g.phase,'won');assert.equal(g.reward?.material,'chaosSigil');
 assert.equal(g.talentAward?.boss,'chaosArena');assert.equal(g.talentAward?.players.includes('p0'),true);
});
test('Guide source table shows material origins, and codex only reveals actually encountered mechanics and rewards',()=>{
 assert.equal(MATERIAL_SOURCES.antChitin.source.includes('Ant Queen'),true);
 assert.equal(MATERIAL_SOURCES.chaosSigil.source.includes('Chaos Arena'),true);
 const blank=emptyCodex();assert.equal(blank.seen.length,0);
 const {g}=game('warden');
 const shot=g.tick(250);
 assert.equal(observeCodex(blank,shot,'p0'),true);
 assert.deepEqual(blank.seen,['warden']);assert.equal(blank.mechanics.warden?.length??0,0);
 g.schedule(1000);g.schedule(1200);const next=g.tick(1300);
 observeCodex(blank,next,'p0');
 assert.ok((blank.mechanics.warden??[]).length>0,'observes real telegraph before revealing');
 assert.equal(blank.loot.length,0,'no inferred drops just by meeting boss');
 g.boss.hp=0;observeCodex(blank,g.tick(2000),'p0');
 assert.ok(blank.loot.includes('cylinderTube'));
 const restored=readCodex(JSON.stringify(blank));
 assert.deepEqual(restored,blank);
 assert.equal(CODEX_MECHANICS.lineSweep.name,'Line Sweep');
 const sanitized=readCodex({seen:['unknown','warden'],mechanics:{warden:['invalid','lineSweep']},loot:['garbage','cylinderTube']});
 assert.deepEqual(sanitized.seen,['warden']);assert.deepEqual(sanitized.mechanics.warden,['lineSweep']);
});
