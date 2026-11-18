import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
import {CLASS_DEFINITIONS,gearEligible} from './classes';
import {RECIPES,emptyInventory,readInventory,countInventory,craft,equip,GEAR_CLASS} from './inventory';

function start(boss:'warden'|'duoYellowWarden'|'duoTruffleFracturer'='warden'){
 let id=0;const g=new Game(()=>{},()=>String(++id));const p=g.add('a');
 g.message('a',{type:'propose',boss},100);
 assert.equal(g.vote?.boss,boss);
 g.message('a',{type:'vote',proposalId:g.vote!.id,accept:true},100);
 assert.equal(g.phase,'fight');return {g,p};
}
test('old mixed-effect items remain owned but each now grants one effect',()=>{
 const saved=emptyInventory();
 saved.rewards={a:'hardTruffleSpore',b:'hardTruffleSpore',c:'hardTruffleSpore',d:'largeCylinder',e:'hardTruffleSpore'};
 assert.equal(craft(saved,'sporeboundTotem'),true);
 assert.equal(craft(saved,'sporefangQuiver'),true);
 equip(saved,'offhand','sporeboundTotem');
 const loaded=readInventory(JSON.stringify(saved));
 assert.equal(loaded.sporeTotems,1);
 assert.equal(loaded.sporeQuivers,1);
 assert.equal(loaded.offhand,'sporeboundTotem');
 assert.equal(countInventory(loaded).hardTruffleSpore,0);
 assert.equal(GEAR_CLASS.sporeboundTotem,'shaman');
 assert.equal(GEAR_CLASS.sporefangQuiver,'ranger');
});
test('five class-specific split gear effects have distinct craftable recipes',()=>{
 const ids=['sporeboundTotem','verdantMenderTotem','sporefangQuiver','sporestormQuiver','splitthornQuiver'] as const;
 for(const id of ids){
  assert.ok(Object.entries(RECIPES[id]).length>0);
  assert.equal(gearEligible(id.includes('Quiver')?'ranger':'shaman',id),true);
  assert.equal(gearEligible('defender',id),false);
 }
});
test('Priest, Rogue, and Defender equipment is class restricted',()=>{
 for(const [gear,cls] of [['sunlitReliquary','priest'],['venomFang','rogue'],['bulwarkCrest','defender']] as const){
  assert.equal(GEAR_CLASS[gear],cls);
  assert.equal(gearEligible(cls,gear),true);
  assert.equal(gearEligible('shaman',gear),false);
  assert.ok(Object.entries(RECIPES[gear]).length>0);
 }
});
test('healing meter counts only effective healing, not overheal, and resets',()=>{
 const {g,p}=start();
 p.hp=48;
 assert.equal(g.heal(p,75,'a'),52);
 assert.equal(g.heal(p,75,'a'),0);
 const meter=g.tick(200).healingMeter!;
 assert.equal(meter.entries.find(x=>x.playerId==='a')?.healing,52);
 g.reset();assert.equal(g.healingTotals.size,0);
});
test('double boss fights award a new encounter-specific material, not two old drops',()=>{
 for(const boss of ['duoYellowWarden','duoTruffleFracturer'] as const){
  const {g}=start(boss);
  const partner=g.adds.find(a=>a.kind==='duoBoss')!;
  assert.equal(partner.bossId,boss==='duoYellowWarden'?'yellowBall':'fracturer');
  g.damageTarget('boss',99999,'a');
  assert.equal(g.tick(200).phase,'fight');
  g.damageTarget(partner.id,99999,'a');
  if(boss==='duoYellowWarden'){
    g.tick(250);const children=g.adds.filter(a=>a.kind==='ball');
    assert.equal(children.length,2);
    assert.equal(g.phase,'fight');
    for(const child of children)g.damageTarget(child.id,99999,'a');
  }
  const result=g.tick(300);
  assert.equal(result.phase,'won');
  assert.equal(result.bonusRewards?.length,0);
  assert.equal(result.reward?.material,boss==='duoYellowWarden'?'duoCore':'duoSpore');
  assert.equal(result.reward?.players.includes('a'),true);
  assert.deepEqual(result.talentAward?.players,['a']);
 }
});
test('dual Fracturer starts arena collapse while its second boss is alive',()=>{
 const {g}=start('duoTruffleFracturer');
 g.next=Infinity;
 const state=g.tick(7100);
 assert.equal(state.arenaCuts?.length,1);
});
test('lobby supports dash and friendly skills without a training target',()=>{
 const g=new Game(()=>{},()=> 'id');const p=g.add('a');
 g.message('a',{type:'join',classId:'priest',loadout:CLASS_DEFINITIONS.priest.skills},100);
 p.hp=25;
 g.message('a',{type:'practice',slot:2,dummyId:''},200);
 assert.equal(p.hp,65);
 assert.ok(p.cooldowns[1]>200);
 const before=p.pos.z;
 g.message('a',{type:'practice',slot:4,dummyId:''},210);
 assert.notEqual(p.pos.z,before);
});
test('Priest relic grants extra healing and attributes it to its wearer',()=>{
 const inv=emptyInventory();inv.rewards={s:'largeSphere',c:'conicalTaper'};
 assert.equal(craft(inv,'sunlitReliquary'),true);
 equip(inv,'offhand','sunlitReliquary');
 const g=new Game(()=>{},()=> 'id');const p=g.add('a');
 g.message('a',{type:'join',classId:'priest',loadout:CLASS_DEFINITIONS.priest.skills,inventory:inv},50);
 g.message('a',{type:'propose',boss:'warden'},100);
 g.message('a',{type:'vote',proposalId:g.vote!.id,accept:true},100);
 p.hp=10;
 g.message('a',{type:'ability',slot:2,targetId:'a'},150);
 assert.equal(p.hp,65);
 assert.equal(g.healingTotals.get('a'),55);
});
