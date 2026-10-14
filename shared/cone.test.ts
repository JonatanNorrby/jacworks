import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game,distance} from './game';
import {craft,countInventory,emptyInventory,equip,readInventory,grantReward} from './inventory';
import {SKILLS} from './protocol';
const room=()=>{let id=0;return new Game(()=>{},()=>String(++id))};
const owned=()=>{const v=emptyInventory();v.rewards={w:'cylinderTube',b:'sphericalBall',c:'sphericalBall',t1:'conicalTaper',t2:'conicalTaper',t3:'conicalTaper',t4:'conicalTaper'};return v};
test('all recipes consume exact materials, equipment persists and legacy saves migrate',()=>{
 const v=owned();assert.ok(craft(v));assert.ok(craft(v,'pointyHat'));assert.ok(craft(v,'pointyOrb'));assert.equal(craft(v,'pointyOrb'),false);
 for(const [slot,item] of [['weapon','primitiveWand'],['head','pointyHat'],['offhand','pointyOrb']] as const)assert.ok(equip(v,slot,item));
 assert.deepEqual(readInventory(JSON.stringify(v)),v);assert.deepEqual(countInventory(v),{largeCylinder:0,redtubeArmour:0,cylinderTube:0,sphericalBall:0,conicalTaper:0,primitiveWand:1,pointyHat:1,pointyOrb:1});
 for(const slot of ['weapon','head','offhand'] as const)assert.ok(equip(v,slot,null));assert.equal(countInventory(v).pointyHat,1);
 assert.equal(readInventory(JSON.stringify({rewards:{a:'cylinderTube',b:'sphericalBall'},crafted:1,weapon:'primitiveWand'})).weapon,'primitiveWand');
 assert.equal(readInventory(JSON.stringify({rewards:{},crafted:1,hats:3,orbs:2,head:'pointyHat',offhand:'pointyOrb'})).head,null);
 assert.equal(equip(emptyInventory(),'offhand','pointyOrb'),false);assert.equal(equip(v,'head','pointyOrb'),false);assert.equal(craft(v,'__proto__' as never),false);
});
test('cone selection, slow pursuit, stationary telegraphed slam and summoned adds synchronize',()=>{
 const g=room(),p=g.add('p');g.message('p',{type:'join',boss:'greenCone'});g.message('p',{type:'ready'},100);
 const before=distance(p.pos,g.boss.pos);const s=g.tick(150);assert.equal(s.boss.id,'greenCone');assert.ok(distance(p.pos,g.boss.pos)<before);assert.ok(g.boss.pos.z<=.05);
 g.schedule(200);assert.equal(g.telegraphs[0].radius,3);const origin={...g.boss.pos};p.pos={x:0,z:2};g.tick(250);assert.deepEqual(g.boss.pos,origin);assert.equal(p.hp,100);g.tick(1700);assert.equal(p.hp,52);
 g.schedule(1800);g.schedule(1900);assert.equal(g.adds.length,2);assert.equal(g.tick(1950).adds.length,2);
 const a=g.adds[0],old={...a.pos};g.tick(2000);assert.ok(distance(a.pos,p.pos)<distance(old,p.pos));a.pos={...p.pos};a.attackAt=2000;g.tick(2050);assert.equal(p.hp,40);g.tick(2100);assert.equal(p.hp,40);
 p.loadout=['arcSpear','dash','pulseNova','guard'];g.message('p',{type:'ability',slot:1},2150);assert.equal(a.hp,0);assert.equal(g.tick(2200).adds.length,1);
});
test('cone victory drops only Conical Taper once, clears adds and resets',()=>{
 const g=room();g.add('p');g.message('p',{type:'join',boss:'greenCone'});g.message('p',{type:'ready'},100);g.adds.push({id:'a',pos:{x:8,z:8},hp:54,maxHp:54,attackAt:9999});g.boss.hp=0;
 const s=g.tick(150),v=emptyInventory();assert.equal(s.reward?.material,'conicalTaper');assert.equal(s.adds.length,0);assert.ok(grantReward(v,s.reward,'p'));assert.equal(grantReward(v,s.reward,'p'),false);assert.equal(grantReward(v,s.reward,'late'),false);assert.equal(countInventory(v).conicalTaper,1);
 g.message('p',{type:'ready'},200);assert.equal(g.boss.hp,1800);assert.equal(g.adds.length,0);
});
test('hat charges spend independently and recharge one at a time without restarting timer',()=>{
 const g=room(),p=g.add('p'),v=owned();craft(v,'pointyHat');equip(v,'head','pointyHat');g.message('p',{type:'join',inventory:v});g.message('p',{type:'ready'},100);
 for(const now of [200,300,400])g.message('p',{type:'ability',slot:2,charges:99},now);
 assert.equal(p.dashCharges,0);assert.equal(p.dashRechargeAt,2800);g.message('p',{type:'ability',slot:2},500);assert.equal(p.dashCharges,0);
 g.tick(2800);assert.equal(p.dashCharges,1);assert.equal(p.dashRechargeAt,5400);g.message('p',{type:'ability',slot:2},2801);assert.equal(p.dashCharges,0);assert.equal(p.dashRechargeAt,5400);
 g.tick(5400);assert.equal(p.dashCharges,1);g.tick(8000);assert.equal(p.dashCharges,2);g.tick(10600);assert.equal(p.dashCharges,3);assert.equal(p.dashRechargeAt,0);
 g.reset();assert.equal(p.dashCharges,3);assert.equal(p.dashRechargeAt,0);
});
test('orb adds exactly two seconds and server burn ticks on beam hits including adds',()=>{
 const g=room(),p=g.add('p'),v=owned();craft(v,'pointyOrb');equip(v,'offhand','pointyOrb');g.message('p',{type:'join',inventory:v,classId:'fireMage',loadout:['lazor','dash','fireball','fireMine']});const other=g.add('other');g.message('p',{type:'ready'},100);g.message('other',{type:'ready'},100);p.pos={x:0,z:4};p.facing={x:0,z:-1};
 g.adds.push({id:'a',pos:{x:0,z:2},hp:200,maxHp:200,attackAt:99999});g.message('p',{type:'ability',slot:1,burn:99999},200);assert.equal(p.cooldowns[0],200+SKILLS.lazor.cooldown+2000);assert.equal(other.offhand,null);assert.equal(g.boss.hp,1710);assert.equal(g.adds[0].hp,110);
 g.tick(1199);assert.equal(g.boss.hp,1710);g.tick(1200);assert.equal(g.boss.hp,1702);assert.equal(g.adds[0].hp,102);g.tick(4200);assert.equal(g.boss.hp,1678);assert.equal(g.adds[0].hp,78);
 g.message('p',{type:'ability',slot:1},4599);assert.equal(g.boss.hp,1678);p.facing={x:1,z:0};g.message('p',{type:'ability',slot:1},4600);g.tick(5600);assert.equal(g.boss.hp,1678);
});
test('forged gear, charge fields, invalid abilities and active re-equipping are ignored',()=>{
 const g=room(),p=g.add('p');g.message('p',{type:'join',inventory:{rewards:{x:'greenTriangle'},crafted:0,hats:1,orbs:1,head:'pointyHat',offhand:'pointyOrb'},dashCharges:99});assert.equal(p.head,null);assert.equal(p.offhand,null);assert.equal(p.dashCharges,1);
 g.message('p',{type:'ready'},100);for(const slot of [0,5,1.2,'2',NaN])g.message('p',{type:'ability',slot},200);assert.equal(g.boss.hp,1800);
 const v=owned();craft(v,'pointyHat');equip(v,'head','pointyHat');g.message('p',{type:'join',inventory:v},300);assert.equal(p.head,null);
});

test('different players burn independently and gear remains isolated in snapshots',()=>{
 const g=room(),v=owned();craft(v,'pointyOrb');equip(v,'offhand','pointyOrb');
 for(const id of ['a','b']){const p=g.add(id);g.message(id,{type:'join',inventory:v,classId:'fireMage',loadout:['lazor','dash','fireball','fireMine']});p.pos={x:0,z:4};p.facing={x:0,z:-1};}
 g.message('a',{type:'ready'},100);g.message('b',{type:'ready'},100);
 for(const id of ['a','b'])g.message(id,{type:'ability',slot:1},200);
 assert.equal(g.boss.hp,1620);const s=g.tick(1200);assert.equal(s.boss.hp,1604);assert.equal(s.players[0].offhand,'pointyOrb');assert.equal(s.players[1].offhand,'pointyOrb');assert.equal(g.burns.size,2);
 g.reset();assert.equal(g.burns.size,0);assert.equal(g.adds.length,0);
});
test('cone adds respect Guard and never attack dead players; summon count is bounded',()=>{
 const g=room(),a=g.add('a'),b=g.add('b');g.message('a',{type:'join',boss:'greenCone'});g.message('a',{type:'ready'},100);g.message('b',{type:'ready'},100);
 a.alive=false;a.hp=0;b.pos={x:5,z:5};b.guardUntil=5000;
 g.adds.push({id:'add',pos:{...b.pos},hp:54,maxHp:54,attackAt:100});g.tick(150);assert.equal(a.hp,0);assert.equal(b.hp,97);
 for(let i=0;i<30;i++)g.schedule(200+i);assert.equal(g.adds.length,6);
});
