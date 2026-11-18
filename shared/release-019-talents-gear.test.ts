import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
import {CLASS_DEFINITIONS,gearEligible,type ClassId} from './classes';
import {GEAR_CLASS,GEAR_SLOTS,RECIPES,emptyInventory,readInventory,craft,equip,type Gear,type Material} from './inventory';
import {TALENT_TREE,TALENT_NODES,TALENT_POINT_BOSSES,emptyTalents,readTalents,unlockTalent,hasTalent,type TalentId} from './talents';

function gearInventory(item:Gear){
 const inv=emptyInventory();let n=0;
 for(const [mat,count] of Object.entries(RECIPES[item]))for(let i=0;i<count;i++)inv.rewards['receipt-'+n++]=mat as Material;
 assert.equal(craft(inv,item),true);assert.equal(equip(inv,GEAR_SLOTS[item],item),true);
 return inv;
}
function fight(cls:ClassId,item?:Gear,picks:TalentId[]=[]){
 let serial=0;
 const g=new Game(()=>{},()=>String(++serial),true),p=g.add('p');
 g.message('p',{type:'join',classId:cls,loadout:CLASS_DEFINITIONS[cls].skills,inventory:item?gearInventory(item):undefined},100);
 g.message('p',{type:'propose',boss:'warden'},110);
 g.message('p',{type:'vote',proposalId:g.vote!.id,accept:true},111);
 g.next=Infinity;p.pos={x:0,z:3};p.facing={x:0,z:-1};
 p.talents={wins:[...TALENT_POINT_BOSSES],picks:{[cls]:['unyieldingForce',...picks]}};
 return {g,p};
}
const NEW:Record<ClassId,Gear>={
 shaman:'broodTotem',defender:'carapaceShield',rogue:'mandibleDagger',warrior:'antLegGreaves',
 priest:'pheromoneChalice',lightningMage:'antennaSpindle',ranger:'broodQuiver',fireMage:'moltenChitin'
};
test('Eight Ant Queen items use chitin, class restrictions, owned slots and persistent receipts',()=>{
 for(const [cls,item] of Object.entries(NEW) as [ClassId,Gear][]){
  assert.equal(GEAR_CLASS[item],cls);
  assert.equal('antChitin' in RECIPES[item] ? RECIPES[item].antChitin : undefined,1);
  const inv=gearInventory(item),restored=readInventory(JSON.stringify(inv));
  assert.equal(restored[GEAR_SLOTS[item]],item);
  for(const other of Object.keys(CLASS_DEFINITIONS) as ClassId[])assert.equal(gearEligible(other,item),other===cls);
 }
});
test('16 additional talents extend both paths to 3 each, use one point per unique clear with valid ancestry',()=>{
 assert.equal(TALENT_POINT_BOSSES.length,10);
 for(const cls of Object.keys(CLASS_DEFINITIONS) as ClassId[]){
  const tree=TALENT_TREE[cls];assert.equal(tree.nodes.length,7);assert.equal(tree.branches.length,2);
  for(const branch of tree.branches){
   assert.equal(branch.length,3);
   assert.equal(TALENT_NODES[branch[0]].requires,'unyieldingForce');
   assert.equal(TALENT_NODES[branch[1]].requires,branch[0]);
   assert.equal(TALENT_NODES[branch[2]].requires,branch[1]);
   const p=emptyTalents();p.wins=[...TALENT_POINT_BOSSES];
   assert.equal(unlockTalent(p,cls,branch[2]),false,'grandchild without prerequisites');
   assert.equal(unlockTalent(p,cls,'unyieldingForce'),true);
   for(const id of branch)assert.equal(unlockTalent(p,cls,id),true,id);
   assert.equal(hasTalent(p,cls,branch[2]),true);
   const loaded=readTalents(JSON.stringify(p));assert.deepEqual(loaded.picks[cls],['unyieldingForce',...branch]);
  }
 }
});
test('Brood Totem contributes an additional 10 damage to a second target per firing cycle',()=>{
 const {g,p}=fight('shaman','broodTotem');g.adds.push({id:'second',pos:{x:1,z:0},hp:100,maxHp:100,attackAt:Infinity});
 g.message('p',{type:'ability',slot:2,target:{x:0,z:1}},200);
 g.tick(1300);
 assert.equal(g.adds[0].hp,100-10*1.03);
 assert.ok(g.effects.some(e=>e.skill==='fireTotem'));
});
test('Carapace Shield changes both shields and Shield Reprieve heals the Defender',()=>{
 const {g,p}=fight('defender','carapaceShield',['guardianNetwork','shelteredHearts','shieldReprieve']);
 const ally=g.add('ally');ally.pos={x:1,z:3};ally.hp=40;p.hp=70;
 g.message('p',{type:'ability',slot:3,targetId:'ally'},200);
 assert.equal(p.shield,100);assert.equal(ally.shield,50);
 assert.equal(p.hp,80);assert.equal(ally.hp,52);
});
test('Mandible Dagger leaves precisely two 8-damage Backstab wound ticks',()=>{
 const {g,p}=fight('rogue','mandibleDagger');p.pos={x:0,z:2.2};
 g.message('p',{type:'ability',slot:2},200);
 g.message('p',{type:'ability',slot:2},300);
 assert.ok(g.effects.some(e=>e.mandibleBleed));
 const start=g.boss.hp;g.tick(1300);g.tick(2300);
 assert.ok(Math.abs(start-g.boss.hp-16*1.03)<.0001);
 assert.equal(g.effects.some(e=>e.mandibleBleed),false);
});
test('Ant-leg Greaves add a real impact blast to Charging Stab',()=>{
 const base=fight('warrior'),gear=fight('warrior','antLegGreaves');
 for(const x of [base,gear]){x.p.pos={x:0,z:7};x.p.facing={x:0,z:-1};x.g.message('p',{type:'ability',slot:2},200);}
 assert.ok(gear.g.boss.hp<base.g.boss.hp);
 assert.ok(Math.abs((base.g.boss.hp-gear.g.boss.hp)-20*1.03)<.001);
});
test('Pheromone Chalice heals a wounded ally while Holy Light hits target',()=>{
 const {g,p}=fight('priest','pheromoneChalice');p.hp=50;
 g.message('p',{type:'ability',slot:3,targetId:'boss'},200);
 assert.equal(p.hp,60);assert.ok(g.boss.hp<1800);
});
test('Antenna Spindle gives additional targeted lightning arc to second foe',()=>{
 const {g}=fight('lightningMage','antennaSpindle');
 g.adds.push({id:'second',pos:{x:1,z:0},hp:100,maxHp:100,attackAt:Infinity});
 g.message('p',{type:'ability',slot:1},200);
 assert.equal(g.adds[0].hp,100-16*1.03);
});
test('Brood Quiver poison occurs once per enemy per Split Shot volley, not once per arrow',()=>{
 const {g,p}=fight('ranger','broodQuiver');p.pos={x:0,z:2};
 g.message('p',{type:'ability',slot:3},200);
 assert.equal(g.effects.filter(e=>e.broodVenom).length,1);
 const hp=g.boss.hp;g.tick(1200);g.tick(2200);
 assert.ok(Math.abs(hp-g.boss.hp-10*1.03)<.0001);
});
test('Molten Chitin mine gives exactly two 6-damage embers; never rearms',()=>{
 const {g,p}=fight('fireMage','moltenChitin');p.pos={x:0,z:3};
 g.message('p',{type:'ability',slot:3,target:{x:0,z:0}},200);
 g.tick(350);
 assert.equal(g.effects.filter(e=>e.afterglow).length,1);
 assert.equal(g.effects.filter(e=>e.afterglow)[0].damage,6);
 const after=g.boss.hp;
 g.tick(1350);g.tick(2350);
 assert.ok(Math.abs(after-g.boss.hp-12*1.03)<.0001);
 const hp=g.boss.hp;g.tick(10000);assert.equal(g.boss.hp,hp);
});
test('Grandchild talents change authoritative chain damage and protection',()=>{
 const p1=fight('lightningMage',undefined,['forkedArc','arcOverload','arcSurge']);
 p1.g.adds.push({id:'second',pos:{x:1,z:0},hp:250,maxHp:250,attackAt:Infinity},
 {id:'third',pos:{x:2,z:0},hp:250,maxHp:250,attackAt:Infinity});
 p1.g.message('p',{type:'ability',slot:1},200);
 assert.ok(p1.g.adds[1].hp<232,'Arc Surge adds 15 to the third bounce');
 const p2=fight('warrior',undefined,['cleavingArc','defiantGuard','battleWard']);
 const ally=p2.g.add('ally');ally.pos={x:1,z:3};
 p2.g.message('p',{type:'ability',slot:3},200);
 assert.equal(ally.shield,20);
});
