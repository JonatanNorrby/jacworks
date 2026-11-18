import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
import {CLASS_DEFINITIONS,gearEligible,type ClassId} from './classes';
import {TALENT_TREE,TALENT_NODES,TALENT_POINT_BOSSES,emptyTalents,readTalents,unlockTalent,respecTalents,talentAvailable,type TalentId} from './talents';
import {emptyInventory,RECIPES,GEAR_SLOTS,GEAR_CLASS,craft,equip,readInventory,countInventory,type Gear,type Material} from './inventory';

const fresh=()=>{let seq=0;return new Game(()=>{},()=>String(++seq),true)};
function withItem(item:Gear){
 const inventory=emptyInventory();let i=0;
 for(const [material,amount] of Object.entries(RECIPES[item]))for(let j=0;j<amount;j++)inventory.rewards[item+'-'+i++]=material as Material;
 assert.equal(craft(inventory,item),true);assert.equal(equip(inventory,GEAR_SLOTS[item],item),true);
 return inventory;
}
function fight(cls:ClassId,item?:Gear,nodes:TalentId[]=[]){
 const game=fresh(),player=game.add('p');
 game.message('p',{type:'join',classId:cls,inventory:item?withItem(item):undefined,loadout:CLASS_DEFINITIONS[cls].skills},100);
 game.message('p',{type:'propose',boss:'warden'},110);
 game.message('p',{type:'vote',proposalId:game.vote!.id,accept:true},110);
 game.next=Infinity;player.pos={x:0,z:3};player.facing={x:0,z:-1};
 player.talents={wins:[...TALENT_POINT_BOSSES],picks:{[cls]:['unyieldingForce',...nodes]}};
 return {game,player};
}
test('all eight class talent trees have a root, two visual branches and true dependency chains',()=>{
 assert.equal(Object.keys(TALENT_TREE).length,8);
 for(const [cls,tree] of Object.entries(TALENT_TREE)){
  assert.equal(tree.nodes.length,5,cls);assert.equal(tree.nodes[0].id,'unyieldingForce');
  assert.equal(tree.branches.length,2);
  const visited=new Set(['unyieldingForce']);
  for(const chain of tree.branches){assert.equal(chain.length,2);
   for(const id of chain){assert.ok(visited.has(TALENT_NODES[id].requires!),id+' needs parent');visited.add(id);}
  }
  assert.equal(visited.size,5);
 }
});
test('talent points cannot be fabricated, branch prerequisites apply, class respec preserves first clears',()=>{
 const p=emptyTalents();p.wins=['warden','greenCone','yellowBall'];
 assert.equal(unlockTalent(p,'rogue','leechingVenom'),false);
 assert.equal(unlockTalent(p,'rogue','unyieldingForce'),true);
 assert.equal(unlockTalent(p,'rogue','venomSpread'),true);
 assert.equal(unlockTalent(p,'rogue','leechingVenom'),true);
 assert.equal(unlockTalent(p,'priest','unyieldingForce'),false);
 assert.equal(talentAvailable(p),0);
 respecTalents(p,'rogue');assert.equal(talentAvailable(p),3);
 assert.deepEqual(p.wins,['warden','greenCone','yellowBall']);
 const restored=readTalents({wins:['warden','greenCone','yellowBall'],picks:{rogue:['leechingVenom','venomSpread','unyieldingForce']}});
 assert.deepEqual(restored.picks.rogue,['unyieldingForce','venomSpread','leechingVenom']);
 assert.deepEqual(readTalents({wins:[],picks:{rogue:['unyieldingForce','venomSpread']}}).picks,{});
});
const NEW_ITEMS:Record<ClassId,Gear>={
 shaman:'twinTotemCapacitor',defender:'fractureAegis',rogue:'sporeglassBlade',warrior:'twinrushBoots',
 priest:'haloOfRenewal',lightningMage:'splitConductor',ranger:'rottingFletching',fireMage:'prismLens'
};
test('eight distinct dual-encounter craftables use real duo drops, persist, and reject wrong-class equip',()=>{
 assert.equal(new Set(Object.values(NEW_ITEMS)).size,8);
 for(const [cls,item] of Object.entries(NEW_ITEMS) as [ClassId,Gear][]){
  const recipe=RECIPES[item];assert.ok('duoCore' in recipe||'duoSpore' in recipe);
  assert.equal(GEAR_CLASS[item],cls);assert.equal(gearEligible(cls,item),true);
  const inv=withItem(item);
  const saved=readInventory(JSON.stringify(inv));
  assert.equal(saved[GEAR_SLOTS[item]],item);assert.equal(countInventory(saved)[item],1);
  for(const wrong of Object.keys(CLASS_DEFINITIONS) as ClassId[])if(wrong!==cls)assert.equal(gearEligible(wrong,item),false);
 }
});
test('Shaman Earth Shock chains and sends an extra fire-totem shot with twin capacitor',()=>{
 const {game:g,player:p}=fight('shaman','twinTotemCapacitor',['stormConduit','livingCurrent']);
 g.adds.push({id:'second',pos:{x:1,z:0},hp:150,maxHp:150,attackAt:99999});
 p.hp=70;
 g.message('p',{type:'ability',slot:2,target:{x:0,z:1}},200);
 g.message('p',{type:'ability',slot:1,targetId:'boss'},300);
 assert.ok(g.boss.hp<1800-36-20);
 assert.ok(g.adds[0].hp<150);
 assert.equal(p.hp,82);
});
test('Defender shares protective shields, heals primary target, and moves faster in Bulwark',()=>{
 const {game:g,player:p}=fight('defender','fractureAegis',['guardianNetwork','shelteredHearts','ironMarch','retaliatoryShell']);
 const q=g.add('q'),r=g.add('r');q.pos={x:0,z:2};r.pos={x:1,z:3};q.hp=40;
 g.message('p',{type:'ability',slot:3,targetId:'q'},200);
 assert.equal(q.hp,52);assert.equal(r.shield,40);
 g.message('p',{type:'ability',slot:2},300);
 assert.equal(p.bulwarkUntil,6300);
 p.pos={x:0,z:2};g.hurt(p,1300,30);assert.ok(g.boss.hp<1800,'Bulwark retaliation hits nearby enemies');
});
test('Rogue rear Backstab plants delayed spore blast; contagion makes poison contagious and leeching heals',()=>{
 const {game:g,player:p}=fight('rogue','sporeglassBlade',['shadowAmbush','shadowstep','venomSpread','leechingVenom']);
 g.adds.push({id:'second',pos:{x:1,z:0},hp:200,maxHp:200,attackAt:99999});
 p.hp=60;p.pos={x:0,z:2};
 g.message('p',{type:'ability',slot:3},150);
 g.message('p',{type:'ability',slot:2},200);
 g.message('p',{type:'ability',slot:2},250);
 assert.ok(g.effects.some(e=>e.sporeBlast));
 assert.ok(g.effects.some(e=>e.skill==='poisonEnchant'&&e.targetId==='second'));
 const before=g.boss.hp;g.tick(1300);
 assert.ok(g.boss.hp<before);
 assert.ok(p.hp>60);
});
test('Warrior extended charge, sweeping damage and defensive heal are applied by the server',()=>{
 const {game:g,player:p}=fight('warrior','twinrushBoots',['piercingCharge','impactWave','cleavingArc','defiantGuard']);
 p.pos={x:0,z:9};p.facing={x:0,z:-1};
 g.message('p',{type:'ability',slot:2},200);
 assert.ok(p.pos.z<3,'Twinrush moves farther than the original five-unit charge');
 assert.ok(g.boss.hp<1800-60,'Piercing and impact talents add damage');
 p.hp=50;g.message('p',{type:'ability',slot:3},210);
 assert.equal(p.hp,60);
});
test('Priest Nova leaves a healing field; targeted heal propagates and echoes',()=>{
 const {game:g,player:p}=fight('priest','haloOfRenewal',['healingCascade','sacredEcho','widerNova','avengingLight']);
 const q=g.add('q'),r=g.add('r');q.pos={x:0,z:3};r.pos={x:1,z:2};q.hp=20;r.hp=20;p.hp=50;
 g.message('p',{type:'ability',slot:1},200);
 assert.ok(g.effects.some(e=>e.healingField));g.tick(1200);
 assert.ok(q.hp>42&&r.hp>42,'Wider Nova and renewal field both heal');
 const oldP=p.hp,oldR=r.hp;
 g.message('p',{type:'ability',slot:2,targetId:'q'},1300);
 assert.ok(p.hp>=oldP+8);assert.ok(r.hp>=oldR+12);
});
test('Lightning Mage gains real forks from talent and conductor without double-targeting first enemy',()=>{
 const {game:g}=fight('lightningMage','splitConductor',['forkedArc','arcOverload']);
 g.adds.push({id:'b',pos:{x:1,z:0},hp:300,maxHp:300,attackAt:99999});
 g.adds.push({id:'c',pos:{x:2,z:0},hp:300,maxHp:300,attackAt:99999});
 g.message('p',{type:'ability',slot:1,target:{x:0,z:0}},200);
 assert.ok(g.adds[0].hp<300-25);assert.ok(g.adds[1].hp<300);
});
test('Ranger upgraded rain is four waves and fletching leaves a separate poisoned area',()=>{
 const {game:g}=fight('ranger','rottingFletching',['rainSurge','lastDownpour']);
 g.message('p',{type:'ability',slot:2,target:{x:0,z:0}},200);
 const rain=g.effects.find(e=>e.skill==='arrowRain'&&!e.poisonCloud)!;
 assert.equal(rain.remaining,4);
 assert.ok(g.effects.some(e=>e.skill==='arrowRain'&&e.poisonCloud));
 const before=g.boss.hp;g.tick(2800);assert.ok(g.boss.hp<before);
});
test('Fire Mage Prism Lens replaces main beam with two rays, and mine talents leave burning ground',()=>{
 const {game:g,player:p}=fight('fireMage','prismLens',['prismBeam','searingBeam','volatileMines','emberAfterglow']);
 g.message('p',{type:'ability',slot:2},200);
 assert.ok(g.boss.hp<1800-120,'two lens rays plus flanking talent rays hit boss');
 assert.ok(g.burns.size>0);
 g.message('p',{type:'ability',slot:3,target:{x:0,z:0}},300);
 g.tick(350);assert.ok(g.effects.some(e=>e.skill==='fireMine'&&e.poisonCloud));
 const before=g.boss.hp;g.tick(1400);assert.ok(g.boss.hp<before);
});

test('Shadowstep refills one Dash charge while preserving Pointy Hat sequential recharge',()=>{
 const g=fresh(),p=g.add('p'),inv=withItem('pointyHat');
 g.message('p',{type:'join',classId:'rogue',inventory:inv,loadout:CLASS_DEFINITIONS.rogue.skills},100);
 g.message('p',{type:'propose',boss:'warden'},110);
 g.message('p',{type:'vote',proposalId:g.vote!.id,accept:true},110);
 g.next=Infinity;p.pos={x:0,z:7};p.facing={x:0,z:-1};
 p.talents={wins:['warden','greenCone','yellowBall'],picks:{rogue:['unyieldingForce','shadowAmbush','shadowstep']}};
 for(const time of [200,300,400])g.message('p',{type:'ability',slot:4},time);
 assert.equal(p.dashCharges,0);assert.equal(p.dashRechargeAt,2800);
 g.message('p',{type:'ability',slot:2},500);
 assert.equal(p.dashCharges,1);assert.equal(p.dashRechargeAt,2800,'the first queued recharge is preserved');
 g.tick(2800);assert.equal(p.dashCharges,2);assert.equal(p.dashRechargeAt,5400);
});
test('New talent effects do not activate without purchased prerequisite chains',()=>{
 const g=fresh(),p=g.add('p');p.classId='fireMage';p.loadout=[...CLASS_DEFINITIONS.fireMage.skills] as import('./protocol').Loadout;
 g.message('p',{type:'propose',boss:'warden'},100);
 g.message('p',{type:'vote',proposalId:g.vote!.id,accept:true},100);g.next=Infinity;
 p.pos={x:0,z:3};p.facing={x:0,z:-1};
 p.talents=readTalents({wins:['warden'],picks:{fireMage:['searingBeam']}});
 g.message('p',{type:'ability',slot:2},200);
 assert.equal(g.boss.hp,1710,'base beam without valid talents is 90');
 assert.equal(g.burns.size,0);
});
