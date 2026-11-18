import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
import {CLASS_DEFINITIONS,gearEligible} from './classes';
import {emptyInventory,craft,equip,readInventory,RECIPES,CLASS_ITEM_BONUS,SPOREBOUND_BONUS,SPOREFANG_BONUS} from './inventory';
import {TALENT_TREE,talentDamage,talentMitigation} from './talents';
function started(cls:keyof typeof CLASS_DEFINITIONS,inventory=emptyInventory()){
 let n=0;const g=new Game(()=>{},()=>String(++n)),p=g.add('p');
 g.message('p',{type:'join',classId:cls,inventory,loadout:CLASS_DEFINITIONS[cls].skills},100);
 g.message('p',{type:'propose',boss:'warden'},110);
 g.message('p',{type:'vote',proposalId:g.vote!.id,accept:true},110);
 g.next=Infinity;p.pos={x:0,z:3};p.facing={x:0,z:-1};
 return {g,p};
}
function equipped(gear:keyof typeof RECIPES,slot:'head'|'offhand'|'armour'|'weapon'){
 const inv=emptyInventory();
 let counter=0;
 for(const [material,n] of Object.entries(RECIPES[gear]))for(let i=0;i<n;i++)inv.rewards[gear+'-receipt-'+counter++]=material as import('./inventory').Material;
 assert.equal(craft(inv,gear),true);
 assert.equal(equip(inv,slot,gear),true);
 return inv;
}
test('gear is class restricted as requested',()=>{
 for(const [item,allowed] of [['primitiveWand','lightningMage'],['pointyOrb','fireMage'],['redtubeArmour','warrior'],['nightshadeHood','rogue'],['shadowHat','priest'],['emberWand','fireMage'],['cinderweaveArmour','fireMage']] as const){
  assert.equal(gearEligible(allowed,item),true);
  for(const cls of Object.keys(CLASS_DEFINITIONS) as (keyof typeof CLASS_DEFINITIONS)[])if(cls!==allowed)assert.equal(gearEligible(cls,item),false);
 }
});
test('new gear persists in its correct equipment slot',()=>{
 for(const [id,slot] of [['nightshadeHood','head'],['shadowHat','head'],['emberWand','weapon'],['cinderweaveArmour','armour']] as const){
  const inv=equipped(id,slot);const restored=readInventory(JSON.stringify(inv));
  assert.equal(restored[slot],id);
 }
});
test('all eight classes have a starter rank 1/1 talent and live server applies both buffs',()=>{
 for(const tree of Object.values(TALENT_TREE)){
  assert.equal(tree.nodes.length,1);assert.equal(tree.nodes[0].ranks,1);
 }
 assert.equal(talentDamage(100),103);assert.equal(talentMitigation(100),97);
 const g=new Game(()=>{},()=> 'id',true);const p=g.add('p');
 g.message('p',{type:'propose',boss:'warden'},100);g.message('p',{type:'vote',proposalId:g.vote!.id,accept:true},100);
 g.damageTarget('boss',100,'p');assert.equal(g.boss.hp,1697);
 g.hurt(p,200,50);assert.equal(p.hp,51.5);
});
test('Shaman fire replacement uses a green poison cloud instead of fire projectiles',()=>{
 const {g,p}=started('shaman',equipped('sporeboundTotem','offhand'));
 p.pos={x:0,z:2};
 g.message('p',{type:'ability',slot:2,target:{x:0,z:1}},200);
 g.tick(1200);
 const cloud=g.effects.find(e=>e.poisonCloud);
 assert.ok(cloud);assert.equal(cloud!.radius,1.5);assert.equal(cloud!.damage,8);
 assert.equal(g.effects.some(e=>e.skill==='fireTotem'&&!e.poisonCloud),false);
 const before=g.boss.hp;g.tick(1600);assert.equal(g.boss.hp,before-8);
});
test('Verdant healer doubles the heal but reduces the radius by half',()=>{
 const {g,p}=started('shaman',equipped('verdantMenderTotem','offhand'));const q=g.add('q');
 p.pos={x:0,z:2};p.hp=20;q.pos={x:0,z:4.2};q.hp=20;
 g.message('p',{type:'ability',slot:3,target:{x:0,z:2}},200);g.tick(1200);
 assert.equal(p.hp,36);assert.equal(q.hp,20);assert.equal(SPOREBOUND_BONUS.healRange,2);
});
test('Venom Fang reduces poison to two heavy ticks; Rogue head doubles it back to four',()=>{
 for(const withHood of [false,true]){
  const inv=equipped('venomFang','offhand');
  if(withHood){const hood=equipped('nightshadeHood','head');Object.assign(inv.rewards,{...hood.rewards});inv.nightshadeHoods=1;inv.head='nightshadeHood';}
  const {g,p}=started('rogue',inv);p.pos={x:0,z:2};
  g.message('p',{type:'ability',slot:3},200);g.message('p',{type:'ability',slot:1},300);
  const poison=g.effects.find(e=>e.skill==='poisonEnchant');
  assert.ok(poison);assert.equal(poison!.remaining,withHood?4:2);assert.equal(CLASS_ITEM_BONUS.roguePoisonTick,15);
 }
});
test('Defender crest gives 65% reduction and eight seconds',()=>{
 const {g,p}=started('defender',equipped('bulwarkCrest','offhand'));
 g.message('p',{type:'ability',slot:2},200);
 assert.equal(p.bulwarkUntil,8200);
 g.hurt(p,300,100);
 assert.equal(p.hp,65);
});
test('Shadow Hat converts Targeted Heal into boss damage',()=>{
 const {g,p}=started('priest',equipped('shadowHat','head'));
 p.pos={x:0,z:2};p.hp=25;
 g.message('p',{type:'ability',slot:2},200);
 assert.equal(g.boss.hp,1760);assert.equal(p.hp,25);
});
test('Ranger tradeoffs have slower aim, smaller rain, and five weaker arrows',()=>{
 assert.equal(SPOREFANG_BONUS.aimedShotDamage,100);
 assert.equal(SPOREFANG_BONUS.aimedShotCastMs,2000);
 assert.equal(SPOREFANG_BONUS.arrowRainDamage,35);
 assert.equal(SPOREFANG_BONUS.arrowRainRadius,1.75);
 assert.equal(SPOREFANG_BONUS.splitShotArrows,5);
 assert.equal(SPOREFANG_BONUS.splitShotDamage,16);
 const {g,p}=started('ranger',equipped('sporefangQuiver','offhand'));p.pos={x:0,z:2};
 g.message('p',{type:'ability',slot:1,target:{x:0,z:0}},200);
 assert.equal(p.cast?.endsAt,2200);
});
test('Fire Mage wand and armour can stack to give three 50-damage fireballs at half cast time',()=>{
 const inv=equipped('emberWand','weapon');
 const armour=equipped('cinderweaveArmour','armour');
 Object.assign(inv.rewards,{...armour.rewards});inv.cinderweaveArmours=1;inv.armour='cinderweaveArmour';
 const {g,p}=started('fireMage',inv);p.pos={x:0,z:3};
 g.message('p',{type:'ability',slot:1,target:{x:0,z:0}},200);
 assert.equal(p.cast?.endsAt,1200);
 g.tick(1200);const fx=g.effects.filter(e=>e.skill==='fireball');
 assert.equal(fx.length,3);
 g.tick(1550);assert.equal(g.boss.hp,1650);
});
test('dummies are now far to the west of the hub',()=>{
 const g=new Game(()=>{},()=> 'id');
 assert.deepEqual(g.trainingDummies.map(d=>d.pos.x),[-11,-11,-11]);
});
