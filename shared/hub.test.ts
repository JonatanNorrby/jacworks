import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game,chargeEnd,meleeHits,distance} from './game';
import {loadCamera,saveCamera,readCamera,cameraTarget,DEFAULT_CAMERA} from './camera';
import {inventoryView,emptyInventory,craft,equip,readInventory} from './inventory';
import {CLASS_DEFINITIONS,skillEligible,resolveClassLoadout,eligibleLoadout} from './classes';
import {SKILLS} from './protocol';
test('camera preferences persist, tolerate invalid storage and bound gentle follow',()=>{
 let raw:string|null=null;const storage={getItem:()=>raw,setItem:(_key:string,value:string)=>{raw=value}};
 saveCamera(storage,{followPlayer:false,zoom:35});assert.deepEqual(loadCamera(storage),{followPlayer:false,zoom:35});assert.deepEqual(readCamera('{'),DEFAULT_CAMERA);assert.equal(readCamera('{"zoom":1}').zoom,29);assert.equal(readCamera('{"zoom":99}').zoom,40);
 assert.deepEqual(loadCamera({getItem:()=>{throw Error()}}),DEFAULT_CAMERA);
 const t=cameraTarget({x:0,z:0},{x:12,z:-12},true,.1);assert.ok(t.x>0&&t.x<2&&t.z<0&&t.z>-2);
 assert.deepEqual(cameraTarget({x:0,z:0},{x:12,z:12},false,1),{x:0,z:0});
 const a=cameraTarget({x:0,z:0},{x:10,z:10},true,.2),b=cameraTarget(cameraTarget({x:0,z:0},{x:10,z:10},true,.1),{x:10,z:10},true,.1);assert.ok(Math.abs(a.x-b.x)<1e-10);
});
test('inventory views separate materials from owned gear and preserve receipts on equip',()=>{
 const v=emptyInventory();v.rewards={a:'cylinderTube',b:'sphericalBall',c:'conicalTaper'};assert.equal(inventoryView(v).gear.length,0);craft(v);equip(v,'weapon','primitiveWand');
 assert.deepEqual(inventoryView(v).materials.map(x=>x.count),[0,0,0,1]);assert.equal(inventoryView(v).gear[0].equipped,true);equip(v,'weapon',null);assert.equal(inventoryView(v).gear[0].equipped,false);assert.deepEqual(readInventory(JSON.stringify(v)).rewards,v.rewards);
});
test('class eligibility restricts base skills before gear transformations',()=>{
 assert.equal(skillEligible(CLASS_DEFINITIONS.warrior,'lazor'),false);
 assert.deepEqual(eligibleLoadout(CLASS_DEFINITIONS.warrior,['lazor','arcBolt','pulseNova','holyNova']),['swordSwing','chargingStab','guard','dash']);
 assert.deepEqual(resolveClassLoadout('lightningMage',['arcBolt','dash','lightningStorm','lightningShield'],'primitiveWand'),['arcSpear','dash','lightningStorm','lightningShield']);
 const g=new Game(()=>{},()=> 'id'),p=g.add('p');g.message('p',{type:'join',classId:'forged',loadout:['swordSwing','chargingStab','guard','dash']});assert.equal(p.classId,'lightningMage');assert.equal(p.loadout.includes('swordSwing'),false);
});

test('sword cleaves multiple front targets including cone adds but excludes rear and range; cooldown enforced',()=>{
 const events:unknown[]=[];const g=new Game(e=>events.push(e),()=> 'id'),p=g.add('p');g.message('p',{type:'join',classId:'warrior',loadout:['swordSwing','chargingStab','guard','dash']});g.message('p',{type:'ready'},100);g.message('p',{type:'vote',proposalId:g.vote?.id,accept:true},100);p.pos={x:0,z:2};p.facing={x:0,z:-1};
 g.adds=[{id:'front',pos:{x:1,z:1},hp:54,maxHp:54,attackAt:9999},{id:'rear',pos:{x:0,z:3},hp:54,maxHp:54,attackAt:9999},{id:'far',pos:{x:0,z:-2},hp:54,maxHp:54,attackAt:9999}];
 g.message('p',{type:'ability',slot:1,damage:9999},200);assert.equal(g.boss.hp,1762);assert.deepEqual(g.adds.map(a=>a.hp),[16,54,54]);g.message('p',{type:'ability',slot:1},201);assert.equal(events.length,1);assert.equal(p.cooldowns[0],1300);
 assert.equal(meleeHits(p.pos,p.facing,{x:3,z:2}),false);
});
test('charge stops at boss, adds and walls, stabs only endpoint frontal targets and synchronizes FX',()=>{
 const events:any[]=[];const g=new Game(e=>events.push(e),()=> 'id'),p=g.add('p');g.message('p',{type:'join',classId:'warrior',loadout:['swordSwing','chargingStab','guard','dash']});g.message('p',{type:'ready'},100);g.message('p',{type:'vote',proposalId:g.vote?.id,accept:true},100);p.pos={x:0,z:6};p.facing={x:0,z:-1};
 g.message('p',{type:'ability',slot:2,to:{x:0,z:-12},damage:999},200);assert.ok(p.pos.z>=1.73&&p.pos.z<1.8);assert.equal(g.boss.hp,1740);assert.equal(p.cooldowns[1],3800);assert.equal(events[0].skill,'chargingStab');assert.deepEqual(events[0].from,{x:0,z:6});
 const before={...p.pos};g.message('p',{type:'ability',slot:2},201);assert.deepEqual(p.pos,before);
 const a={id:'a',pos:{x:0,z:4},hp:54,maxHp:54,attackAt:9999};const end=chargeEnd({x:0,z:6},p.facing,g.boss.pos,[a]);assert.ok(distance(end,a.pos)>=.9);assert.ok(end.z<5);
 assert.ok(chargeEnd({x:11,z:8},{x:1,z:0},g.boss.pos,[]).x<=12);
 p.cooldowns[1]=0;p.pos={x:0,z:6};g.adds=[a];g.message('p',{type:'ability',slot:2},4000);assert.equal(a.hp,0);assert.equal(g.boss.hp,1740);
 p.pos={x:6,z:8};p.facing={x:1,z:0};g.message('p',{type:'ability',slot:2},8000);assert.equal(g.boss.hp,1740);assert.ok(p.pos.x>10.9&&p.pos.x<=11.1);
});
