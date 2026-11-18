import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game,chargeEnd} from './game';
import {BOSS_CIRCLES,BOSS_PEDESTALS} from './boss-layout';
import {ANT_ARENA_LIMIT} from './antQueen';
import {CLASS_DEFINITIONS} from './classes';
import {RECIPES,GEAR_SLOTS,emptyInventory,readInventory,craft,equip,countInventory,inventoryView,type Gear,type Material} from './inventory';
import {TALENT_NODES,TALENT_TREE,TALENT_POINT_BOSSES,emptyTalents,unlockTalent,readTalents,hasTalent,type TalentId} from './talents';
import type {ClassId} from './classes';

function withGear(item:Gear){const inv=emptyInventory();let n=0;
 for(const [mat,number] of Object.entries(RECIPES[item]))for(let i=0;i<number;i++)inv.rewards['r-'+n++]=mat as Material;
 assert.equal(craft(inv,item),true);assert.equal(equip(inv,GEAR_SLOTS[item],item),true);return inv;
}
function fight(cls:ClassId,picks:TalentId[]=[],gear?:Gear){
 let n=0;const g=new Game(()=>{},()=>String(++n),true);const p=g.add('p');
 g.message('p',{type:'join',classId:cls,inventory:gear?withGear(gear):undefined,loadout:CLASS_DEFINITIONS[cls].skills},100);
 g.message('p',{type:'propose',boss:'warden'},110);
 g.message('p',{type:'vote',proposalId:g.vote!.id,accept:true},111);
 g.next=Infinity;p.pos={x:0,z:3};p.facing={x:0,z:-1};
 p.talents={wins:[...TALENT_POINT_BOSSES],picks:{[cls]:['unyieldingForce',...picks]}};
 return {g,p};
}
const chains:Partial<Record<ClassId,[TalentId[],TalentId[]]>>={
 shaman:[['partingGift','violentFarewell','funeralBloom','ancestralShelter'],['stormConduit','livingCurrent','stormRebound','stormMender']],
 defender:[['guardianNetwork','shelteredHearts','shieldReprieve','aegisCommand'],['ironMarch','retaliatoryShell','thunderShell','bulwarkResonance']],
 rogue:[['shadowAmbush','shadowstep','rippleStab','cloakOfThorns'],['venomSpread','leechingVenom','venomCatalyst','toxicEcho']],
 warrior:[['piercingCharge','impactWave','meteorWake','seismicRenewal'],['cleavingArc','defiantGuard','battleWard','guardianRiposte']],
 priest:[['healingCascade','sacredEcho','aegisMend','secondBenediction'],['widerNova','avengingLight','dawnFlare','radiantAegis']],
 lightningMage:[['forkedArc','arcOverload','arcSurge','arcWard'],['stormWell','stormAftershock','stormShelter','stormRecovery']],
 ranger:[['splitVolley','ricochetArrows','thirdRicochet','returnShot'],['rainSurge','lastDownpour','rainOfMercy','thornfall']],
 fireMage:[['prismBeam','searingBeam','solarFlare','solarAegis'],['volatileMines','emberAfterglow','blazingHorizon','embersOfLife']]
};
test('Nest gate is beside the other three boss circles, not isolated in north field',()=>{
 const nest=BOSS_CIRCLES.find(c=>c.difficulty==='Nest')!,other=BOSS_CIRCLES.filter(c=>c.difficulty!=='Nest'&&c.difficulty!=='Chaos');
 assert.equal(nest.center.z,-6.5);assert.ok(other.every(c=>c.center.z===nest.center.z));
 assert.ok(nest.center.x<Math.min(...other.map(c=>c.center.x)));
 assert.equal(BOSS_PEDESTALS.find(p=>p.id==='antQueen')?.pos.z,nest.center.z);
});
test('Cave movement and target validation expand to a circular 14.5 radius; all older bosses keep 12',()=>{
 let n=0;const g=new Game(()=>{},()=>String(++n),true);const p=g.add('p');
 g.message('p',{type:'join',classId:'fireMage',loadout:CLASS_DEFINITIONS.fireMage.skills},80);
 g.message('p',{type:'propose',boss:'antQueen'},100);g.message('p',{type:'vote',proposalId:g.vote!.id,accept:true},101);
 assert.equal(g.arenaLimit(),ANT_ARENA_LIMIT);
 const moved=g.movePlayer({x:12.1,z:0},{x:1.2,z:0});
 assert.ok(moved.x>12&&moved.x<=14.5);
 const corner=g.movePlayer({x:13,z:4},{x:5,z:2});assert.ok(Math.hypot(corner.x,corner.z)<=14.500001);
 const end=chargeEnd({x:11,z:0},{x:1,z:0},{x:0,z:10.5},[],5,[],g.arenaLimit());
 assert.ok(end.x>12&&end.x<=14.5);
 // Players can place an ability in the new fringe of the Queen's arena.

 p.pos={x:11.5,z:0};g.message('p',{type:'ability',slot:3,target:{x:13.2,z:0}},200);
 assert.ok(g.effects.some(e=>e.skill==='fireMine'&&e.pos.x>12),'farther placement is accepted in Nest');
 g.message('p',{type:'hub'},300);assert.equal(g.arenaLimit(),12);
 const ordinary=g.movePlayer({x:11.9,z:0},{x:2,z:0});assert.equal(ordinary.x,12);
});
test('Royal items now use weapon, armour and offhand and migrate old equipped offhands without destroying ownership',()=>{
 assert.equal(GEAR_SLOTS.broodTotem,'weapon');
 assert.equal(GEAR_SLOTS.carapaceShield,'armour');
 assert.equal(GEAR_SLOTS.broodQuiver,'offhand');
 assert.equal(new Set(['broodTotem','carapaceShield','broodQuiver'].map(k=>GEAR_SLOTS[k as Gear])).size,3);
 for(const [item,slot] of [['broodTotem','weapon'],['carapaceShield','armour']] as const){
  const inv=withGear(item);const legacy={...inv,[slot]:null,offhand:item};
  const loaded=readInventory(JSON.stringify(legacy));
  assert.equal(loaded[slot],item);assert.equal(loaded.offhand,null);
  assert.equal(countInventory(loaded)[item],1);assert.equal(equip(loaded,'offhand',item),false);
 }
 const staff=withGear('broodTotem');assert.equal(readInventory(JSON.stringify(staff)).weapon,'broodTotem');
 const plate=withGear('carapaceShield');assert.equal(readInventory(JSON.stringify(plate)).armour,'carapaceShield');
 assert.equal(countInventory(plate).carapaceShield,1);
 const spare=withGear('broodQuiver');spare.rewards['extra-chitin']='antChitin';
 assert.equal(inventoryView(spare).materials.find(m=>m.id==='antChitin')?.count,1);
});
test('All eight classes have two four-deep prerequisite paths; old talent IDs and points remain valid',()=>{
 assert.equal(Object.keys(TALENT_TREE).length,8);assert.equal(TALENT_POINT_BOSSES.length,11);
 for(const [cls,branches] of Object.entries(chains) as [ClassId,[TalentId[],TalentId[]]][]){
  const tree=TALENT_TREE[cls];assert.equal(tree.nodes.length,13);
  assert.equal(tree.branches.length,3);
  for(const chain of branches){
   assert.equal(chain.length,4);
   const p=emptyTalents();p.wins=[...TALENT_POINT_BOSSES];
   assert.equal(unlockTalent(p,cls,chain[3]),false);
   assert.equal(unlockTalent(p,cls,'unyieldingForce'),true);
   for(let i=0;i<chain.length;i++){
    assert.equal(TALENT_NODES[chain[i]].requires,i===0?'unyieldingForce':chain[i-1]);
    assert.equal(unlockTalent(p,cls,chain[i]),true,chain[i]);
   }
   assert.equal(hasTalent(p,cls,chain[3]),true);
   assert.deepEqual(readTalents(JSON.stringify(p)).picks[cls],['unyieldingForce',...chain]);
  }
 }
});
test('Shaman Ancestral Shelter grants shields as a totem explodes',()=>{
 const {g,p}=fight('shaman',chains.shaman![0]);p.hp=70;
 g.totems.push({id:'totem',kind:'fireTotem',owner:p.id,pos:{x:0,z:3},hp:1,next:Infinity,expires:1000});
 g.burstTotem(g.totems[0],1000);assert.equal(p.hp,80);assert.equal(p.shield,10);assert.equal(p.shieldUntil,5000);
});
test('Shaman Storm Mender heals an injured ally at the third bounce',()=>{
 const {g,p}=fight('shaman',chains.shaman![1]);g.adds.push({id:'second',pos:{x:1,z:0},hp:250,maxHp:250,attackAt:Infinity},{id:'third',pos:{x:2,z:0},hp:250,maxHp:250,attackAt:Infinity});
 const ally=g.add('friend');ally.pos={x:2,z:1};ally.hp=50;
 g.message('p',{type:'ability',slot:1,targetId:'boss'},200);
 assert.equal(ally.hp,72,'Living Current (12) + Storm Mender (10)');
});
test('Defender Aegis Command gives the shielded ally a brief Guard window',()=>{
 const {g,p}=fight('defender',chains.defender![0]);const ally=g.add('friend');ally.pos={x:1,z:3};
 g.message('p',{type:'ability',slot:3,targetId:'friend'},200);
 assert.equal(ally.guardUntil,1400);assert.equal(ally.shield,40);
});
test('Defender Bulwark Resonance produces a 10 shield after retaliation',()=>{
 const {g,p}=fight('defender',chains.defender![1]);p.bulwarkUntil=5000;
 g.hurt(p,1000,20,false);assert.equal(p.shield,10);assert.equal(p.shieldUntil,3500);
});
test('Rogue Cloak of Thorns shields on rear Backstab',()=>{
 const {g,p}=fight('rogue',chains.rogue![0]);p.pos={x:0,z:2.2};
 g.message('p',{type:'ability',slot:2},200);g.message('p',{type:'ability',slot:2},300);
 assert.equal(p.shield,15);assert.equal(p.shieldUntil,2800);
});
test('Rogue Toxic Echo makes each poison tick splash to one different enemy',()=>{
 const {g,p}=fight('rogue',chains.rogue![1]);
 g.adds.push({id:'second',pos:{x:1,z:0},hp:100,maxHp:100,attackAt:Infinity});
 g.effects.push({id:'poison',owner:p.id,skill:'poisonEnchant',pos:{x:0,z:0},targetId:'boss',next:1000,remaining:1,expires:2000});
 g.tick(1000);assert.ok(Math.abs(g.adds[0].hp-(100-3*1.03))<1e-7);
});
test('Warrior Seismic Renewal heals for enemies hit by Charging Stab shockwave',()=>{
 const {g,p}=fight('warrior',chains.warrior![0]);p.pos={x:0,z:7};p.hp=60;
 g.message('p',{type:'ability',slot:2},200);assert.equal(p.hp,65);
});
test('Warrior Guardian Riposte makes Guard damage a nearby enemy',()=>{
 const {g,p}=fight('warrior',chains.warrior![1]);p.pos={x:0,z:2};
 g.message('p',{type:'ability',slot:3},200);assert.ok(Math.abs(g.boss.hp-(1800-12*1.03))<1e-7);
});
test('Priest Second Benediction shields a second wounded ally',()=>{
 const {g,p}=fight('priest',chains.priest![0]);const first=g.add('first'),second=g.add('second');
 first.pos={x:1,z:3};second.pos={x:2,z:3};first.hp=50;second.hp=60;
 g.message('p',{type:'ability',slot:2,targetId:'first'},200);
 assert.equal(first.shield,15);assert.equal(second.shield,10);
});
test('Priest Radiant Aegis shields an ally near Holy Light target',()=>{
 const {g,p}=fight('priest',chains.priest![1]);const ally=g.add('friend');ally.pos={x:0,z:1};
 g.message('p',{type:'ability',slot:3,targetId:'boss'},200);
 assert.equal(ally.shield,12);assert.equal(ally.shieldUntil,3200);
});
test('Lightning Mage Arc Ward shields caster after a third successful chain hop',()=>{
 const {g,p}=fight('lightningMage',chains.lightningMage![0]);
 g.adds.push({id:'second',pos:{x:1,z:0},hp:300,maxHp:300,attackAt:Infinity},{id:'third',pos:{x:2,z:0},hp:300,maxHp:300,attackAt:Infinity});
 g.message('p',{type:'ability',slot:1},200);assert.equal(p.shield,12);
});
test('Lightning Mage Storm Recovery heals after completed channel',()=>{
 const {g,p}=fight('lightningMage',chains.lightningMage![1]);p.hp=70;p.pos={x:0,z:2.9};
 g.message('p',{type:'ability',slot:2,target:{x:0,z:0}},200);
 g.tick(3200);assert.equal(p.hp,78);
});
test('Ranger Return Shot bounces from the third target back to first',()=>{
 function run(returning:boolean){
  const {g,p}=fight('ranger',returning?chains.ranger![0]:chains.ranger![0].slice(0,3));
  g.adds.push({id:'second',pos:{x:1,z:0},hp:300,maxHp:300,attackAt:Infinity},{id:'third',pos:{x:2,z:0},hp:300,maxHp:300,attackAt:Infinity});
  g.message('p',{type:'ability',slot:1,targetId:'boss'},200);
  g.tick(1200);g.tick(1600);return g.boss.hp;
 }
 assert.ok(Math.abs(run(false)-run(true)-8*1.03)<1e-7);
});
test('Ranger Thornfall leaves two bounded poison pulses after final rain wave',()=>{
 const {g,p}=fight('ranger',chains.ranger![1]);p.pos={x:0,z:3};
 g.message('p',{type:'ability',slot:2,target:{x:0,z:0}},200);
 g.tick(2400);assert.equal(g.effects.filter(e=>e.poisonCloud&&e.skill==='arrowRain').length,1);
 const hp=g.boss.hp;g.tick(3400);g.tick(4400);
 assert.ok(Math.abs(hp-g.boss.hp-12*1.03)<1e-7);
 assert.equal(g.effects.filter(e=>e.poisonCloud&&e.skill==='arrowRain').length,0);
});
test('Fire Mage Solar Aegis grants shield after LAZOR connects',()=>{
 const {g,p}=fight('fireMage',chains.fireMage![0]);
 g.message('p',{type:'ability',slot:2},200);assert.equal(p.shield,15);assert.equal(p.shieldUntil,3200);
});
test('Fire Mage Embers of Life heals from only talent-created mine afterglow',()=>{
 const {g,p}=fight('fireMage',chains.fireMage![1],'moltenChitin');p.hp=60;
 g.message('p',{type:'ability',slot:3,target:{x:0,z:0}},200);
 g.tick(350);assert.equal(g.effects.filter(e=>e.afterglow).length,2);
 g.tick(1350);g.tick(2350);g.tick(3350);
 assert.equal(p.hp,72,'three talent embers heal 4 each, not the two item embers');
});

test('Royal weapon and armour really coexist with old class offhand pieces in saved multiplayer builds',()=>{
 const loadItems=(items:Gear[])=>{
  const inv=emptyInventory();let n=0;
  for(const item of items)for(const [mat,count] of Object.entries(RECIPES[item]))
   for(let i=0;i<count;i++)inv.rewards['receipt-'+n++]=mat as Material;
  for(const item of items){assert.equal(craft(inv,item),true);assert.equal(equip(inv,GEAR_SLOTS[item],item),true);}
  return readInventory(JSON.stringify(inv));
 };
 const shaman=loadItems(['broodTotem','twinTotemCapacitor']);
 assert.equal(shaman.weapon,'broodTotem');assert.equal(shaman.offhand,'twinTotemCapacitor');
 const defender=loadItems(['carapaceShield','fractureAegis']);
 assert.equal(defender.armour,'carapaceShield');assert.equal(defender.offhand,'fractureAegis');
 let n=0;const game=new Game(()=>{},()=>String(++n),true),p=game.add('p');
 game.message('p',{type:'join',classId:'defender',inventory:defender,loadout:CLASS_DEFINITIONS.defender.skills},100);
 const ally=game.add('ally');ally.pos={x:1,z:3};const third=game.add('third');third.pos={x:2,z:3};
 game.message('p',{type:'propose',boss:'warden'},110);
 for(const name of ['p','ally','third'])game.message(name,{type:'vote',proposalId:game.vote!.id,accept:true},111);
 p.pos={x:0,z:3};game.next=Infinity;
 game.message('p',{type:'ability',slot:3,targetId:'ally'},200);
 assert.equal(p.armour,'carapaceShield');assert.equal(p.offhand,'fractureAegis');
 assert.equal(p.shield,100);assert.equal(ally.shield,50);assert.equal(third.shield,20);
});
