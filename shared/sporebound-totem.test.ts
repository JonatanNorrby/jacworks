import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
import {CLASS_DEFINITIONS,gearEligible} from './classes';
import {SPOREBOUND_BONUS,emptyInventory,countInventory,grantReward,craft,equip,readInventory} from './inventory';
test('three Hard Truffle Man victories grant enough exclusive spores for one Shaman item',()=>{
 const inv=emptyInventory();
 assert.equal(craft(inv,'sporeboundTotem'),false);
 for(let i=0;i<2;i++)assert.equal(grantReward(inv,{id:'hard-'+i,material:'hardTruffleSpore',players:['shaman']},'shaman'),true);
 assert.equal(countInventory(inv).hardTruffleSpore,2);
 assert.equal(craft(inv,'sporeboundTotem'),false);
 assert.equal(grantReward(inv,{id:'hard-2',material:'hardTruffleSpore',players:['shaman']},'shaman'),true);
 assert.equal(craft(inv,'sporeboundTotem'),true);
 assert.equal(countInventory(inv).hardTruffleSpore,0);
 assert.equal(countInventory(inv).sporeboundTotem,1);
 assert.equal(craft(inv,'sporeboundTotem'),false);
 assert.equal(equip(inv,'offhand','sporeboundTotem'),true);
 const loaded=readInventory(JSON.stringify(inv));
 assert.equal(loaded.offhand,'sporeboundTotem');
 assert.equal(loaded.sporeTotems,1);
 assert.equal(grantReward(loaded,{id:'hard-0',material:'hardTruffleSpore',players:['shaman']},'shaman'),false);
});
test('only Shaman can equip Sporebound Totem, including server validation',()=>{
 const inv=emptyInventory();
 inv.rewards={a:'hardTruffleSpore',b:'hardTruffleSpore',c:'hardTruffleSpore'};
 craft(inv,'sporeboundTotem');equip(inv,'offhand','sporeboundTotem');
 assert.equal(gearEligible('shaman','sporeboundTotem'),true);
 assert.equal(gearEligible('fireMage','sporeboundTotem'),false);
 for(const id of ['shaman','fireMage'] as const){
  const g=new Game(()=>{},()=> 'id');const p=g.add('p');
  g.message('p',{type:'join',classId:id,inventory:inv,loadout:CLASS_DEFINITIONS[id].skills},100);
  assert.equal(p.offhand,id==='shaman'?'sporeboundTotem':null);
 }
});
test('Hard Truffle victory awards spores; normal Truffle still awards Conical Taper',()=>{
 for(const [boss,expected] of [['hardGreenCone','hardTruffleSpore'],['greenCone','conicalTaper']] as const){
  let i=0;const g=new Game(()=>{},()=>String(++i));g.add('p');
  g.message('p',{type:'propose',boss},100);
  g.message('p',{type:'vote',proposalId:g.vote!.id,accept:true},100);
  g.boss.hp=0;
  const result=g.tick(200);
  assert.equal(result.reward?.material,expected);
 }
});
test('Sporebound Totem has specified Fire and Healing Totem values',()=>{
 assert.equal(SPOREBOUND_BONUS.fireDamage,30);
 assert.equal(SPOREBOUND_BONUS.healPerTick,10);
});

test('legacy Shaman item boosts fire only while healing remains baseline',()=>{
 let n=0;const g=new Game(()=>{},()=>String(++n));const p=g.add('shaman');
 const inv=emptyInventory();inv.rewards={a:'hardTruffleSpore',b:'hardTruffleSpore',c:'hardTruffleSpore'};
 assert.equal(craft(inv,'sporeboundTotem'),true);assert.equal(equip(inv,'offhand','sporeboundTotem'),true);
 g.message('shaman',{type:'join',classId:'shaman',inventory:inv,loadout:CLASS_DEFINITIONS.shaman.skills},100);
 g.message('shaman',{type:'propose',boss:'warden'},110);
 g.message('shaman',{type:'vote',proposalId:g.vote!.id,accept:true},110);
 g.next=Infinity;p.pos={x:0,z:2};
 g.message('shaman',{type:'ability',slot:2,target:{x:0,z:1}},200);
 g.tick(1200);g.tick(1550);
 assert.equal(g.boss.hp,1770);
 p.hp=50;
 g.message('shaman',{type:'ability',slot:3,target:{x:0,z:1}},1700);
 g.tick(2700);
 assert.equal(p.hp,58);
});
