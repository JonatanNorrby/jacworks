import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
import {CLASS_DEFINITIONS,resolveClassLoadout,readClass,gearEligible,loadClass,saveClass} from './classes';
import type {ClassId} from './classes';
import type {SkillId} from './protocol';
import {emptyInventory,craft,equip,countInventory,readInventory} from './inventory';
function setup(classId:ClassId){let n=0;const events:any[]=[];const g=new Game(e=>events.push(e),()=>String(++n));const p=g.add('p');g.message('p',{type:'join',classId,loadout:CLASS_DEFINITIONS[classId].skills});g.message('p',{type:'ready'},100);g.next=1e9;p.pos={x:0,z:2};p.facing={x:0,z:-1};return {g,p,events,use:(skill:SkillId,now=200,extra:object={})=>g.message('p',{type:'ability',slot:p.loadout.indexOf(skill)+1,...extra},now)}}
for(const classId of Object.keys(CLASS_DEFINITIONS) as ClassId[]){
 test(`${classId}: authoritative skills reject mixing, midfight switches and spoofed damage`,()=>{
  const {g,p}=setup(classId);assert.equal(p.classId,classId);assert.deepEqual(p.loadout,CLASS_DEFINITIONS[classId].skills);
  g.message('p',{type:'join',classId:'warrior',loadout:['arcSpear','lazor','holyNova','guard']},300);assert.equal(p.classId,classId);
  const h=new Game(()=>{},()=> 'id'),q=h.add('q');h.message('q',{type:'join',classId,loadout:['arcSpear','lazor','holyNova','guard']});
  assert.ok(q.loadout.every(s=>CLASS_DEFINITIONS[classId].skills.includes(s as never)));assert.equal(new Set(q.loadout).size,4);
 });
 test(`${classId}: can defeat a full health target solo with its own damage skills`,()=>{
  const {g,p,use}=setup(classId);
  // Isolated DPS/sustain test. Boss mechanics and avoidance are covered separately.
  for(let now=200;now<180000&&g.phase==='fight';now+=100){
   p.pos={x:0,z:2};p.facing={x:0,z:-1};
   for(const skill of p.loadout)if(skill!=='dash')use(skill,now,{target:{...g.boss.pos}});
   g.tick(now);
  }
  assert.equal(g.phase,'won');assert.equal(p.alive,true);assert.equal(g.players.size,1);
 });
}
test('Warrior Guard mitigates boss damage and Priest nova damages while healing self/allies',()=>{
 const w=setup('warrior');w.use('guard');w.g.hurt(w.p,300);assert.equal(w.p.hp,88);w.g.hurt(w.p,2000);assert.equal(w.p.hp,40);
 const {g,p,use}=setup('priest');const ally=g.add('ally');ally.pos={x:1,z:2};ally.hp=30;p.hp=20;use('pulseNova');assert.equal(g.boss.hp,1755);assert.equal(p.hp,38);assert.equal(ally.hp,48);
 use('targetedHeal',300,{targetId:'ally'});assert.equal(ally.hp,88);use('holyLight',400,{targetId:'boss',damage:9000});assert.equal(g.boss.hp,1723);
});
test('friendly targets reject dead/missing/out of range, default self heal and clamp HP',()=>{
 const {g,p,use}=setup('priest');const a=g.add('a');a.pos={x:12,z:12};
 for(const targetId of ['missing','boss','a'])use('targetedHeal',200,{targetId});assert.equal(p.cooldowns[1],0);
 a.pos={...p.pos};a.alive=false;use('targetedHeal',200,{targetId:'a'});assert.equal(p.cooldowns[1],0);
 p.hp=90;use('targetedHeal');assert.equal(p.hp,100);use('targetedHeal',201);assert.equal(p.cooldowns[1],4700);
});
test('Lightning Storm channels six area ticks and moving interrupts remaining pulses',()=>{
 const {g,p,use}=setup('lightningMage');use('lightningStorm',200,{target:{x:0,z:0}});assert.equal(g.boss.hp,1800);g.tick(700);assert.equal(g.boss.hp,1778);
 g.message('p',{type:'input',seq:0,move:{x:1,z:0}},800);g.tick(800);assert.equal(p.cast,undefined);g.tick(3200);assert.equal(g.boss.hp,1778);
 p.cooldowns[1]=0;use('lightningStorm',4000,{target:{x:0,z:0}});g.tick(7000);assert.equal(g.boss.hp,1646);assert.equal(p.cast,undefined);
});
test('Lightning Shield follows ally and periodically damages only nearby enemies',()=>{
 const {g,p,use}=setup('lightningMage');const a=g.add('a');a.pos={x:0,z:2};use('lightningShield',200,{targetId:'a'});g.tick(1200);assert.equal(g.boss.hp,1786);a.pos={x:8,z:8};g.tick(2200);assert.equal(g.boss.hp,1786);a.alive=false;g.tick(3200);assert.equal(g.effects.length,0);assert.equal(p.hp,100);
});
for(const [classId,skill,duration,damage] of [['ranger','aimedShot',1000,58],['fireMage','fireball',2000,100]] as const){
 test(`${skill}: timed cast, projectile travel, cooldown and movement/Dash/death interrupts`,()=>{
  const {g,p,use}=setup(classId);use(skill);g.tick(200+duration-1);assert.equal(g.boss.hp,1800);assert.ok(p.cast);g.tick(200+duration);assert.equal(p.cast,undefined);assert.equal(g.boss.hp,1800);g.tick(550+duration);assert.equal(g.boss.hp,1800-damage);
  for(const action of ['movement','dash','death']){
   const s=setup(classId);s.use(skill);if(action==='movement')s.g.message('p',{type:'input',seq:1,move:{x:1,z:0}},250);if(action==='dash')s.use('dash',250);if(action==='death'){s.p.hp=1;s.g.hurt(s.p,250)}s.g.tick(300);s.g.tick(4000);assert.equal(s.g.boss.hp,1800);assert.equal(s.p.cast,undefined);
  }
 });
}
test('target areas reject invalid coordinates, Arrow Rain has three waves, Split Shot is directional',()=>{
 const {g,p,use}=setup('ranger');for(const target of [null,{x:NaN,z:0},{x:0,z:Infinity},{x:99,z:0},{x:12,z:12}])use('arrowRain',200,{target});assert.equal(g.effects.length,0);assert.equal(p.cooldowns[1],0);
 use('arrowRain',200,{target:{x:0,z:0}});g.tick(599);assert.equal(g.boss.hp,1800);g.tick(600);assert.equal(g.boss.hp,1772);g.tick(1800);assert.equal(g.boss.hp,1716);assert.equal(g.effects.length,0);
 use('splitShot',2000);assert.ok(g.boss.hp<1716);const hp=g.boss.hp;p.facing={x:0,z:1};use('splitShot',5000);assert.equal(g.boss.hp,hp);
});
test('Fire Mine persists, triggers once, expires; Fireball has small area splash',()=>{
 const {g,p,use}=setup('fireMage');use('fireMine',200,{target:{x:5,z:0}});g.tick(300);assert.equal(g.boss.hp,1800);g.boss.pos={x:5,z:0};g.tick(400);assert.equal(g.boss.hp,1705);g.tick(500);assert.equal(g.boss.hp,1705);
 p.pos={x:5,z:2};g.adds=[{id:'a',pos:{x:6,z:0},hp:150,maxHp:150,attackAt:99999}];use('fireball',700,{targetId:'boss'});g.tick(2700);g.tick(3050);assert.equal(g.boss.hp,1605);assert.equal(g.adds[0].hp,50);
 p.cooldowns[2]=0;use('fireMine',4000,{target:{x:0,z:0}});g.tick(16001);assert.equal(g.effects.length,0);
});
test('class gear eligibility preserves all inventory receipts, ownership and saved equipment',()=>{
 const inv=emptyInventory();inv.rewards={a:'cylinderTube',b:'sphericalBall',c:'sphericalBall',d:'conicalTaper',e:'conicalTaper',f:'conicalTaper',g:'conicalTaper'};for(const item of ['primitiveWand','pointyHat','pointyOrb'] as const)craft(inv,item);equip(inv,'weapon','primitiveWand');equip(inv,'head','pointyHat');equip(inv,'offhand','pointyOrb');const raw=JSON.stringify(inv),counts=countInventory(inv);
 for(const id of Object.keys(CLASS_DEFINITIONS) as ClassId[]){const g=new Game(()=>{},()=> 'id'),p=g.add('p');g.message('p',{type:'join',classId:id,inventory:inv,loadout:CLASS_DEFINITIONS[id].skills});assert.equal(!!p.weapon,gearEligible(id,'primitiveWand'));assert.equal(!!p.offhand,gearEligible(id,'pointyOrb'));assert.equal(p.head,'pointyHat');assert.equal(p.loadout.includes('arcSpear'),id==='lightningMage');assert.deepEqual(countInventory(readInventory(raw)),counts);assert.equal(JSON.stringify(inv),raw);}
 assert.equal(readClass('__proto__'),'lightningMage');assert.equal(readClass('prototype'),'lightningMage');
});
test('reset, victory and disconnect clean up casts and persistent effects',()=>{
 const {g,p,use}=setup('lightningMage');use('lightningShield');use('lightningStorm',300);g.reset();assert.equal(g.effects.length,0);assert.equal(p.cast,undefined);assert.deepEqual(p.cooldowns,[0,0,0,0]);g.message('p',{type:'ready'},500);use('lightningShield',600);use('lightningStorm',700);g.boss.hp=0;g.tick(800);assert.equal(g.effects.length,0);assert.equal(p.cast,undefined);g.remove('p');assert.equal(g.players.size,0);
});

test('class choice persists independently of old inventory and invalid values migrate safely',()=>{
 let value:string|null=null;const storage={getItem:()=>value,setItem:(_key:string,v:string)=>{value=v}};
 for(const id of Object.keys(CLASS_DEFINITIONS) as ClassId[]){saveClass(storage,id);assert.equal(loadClass(storage),id)}
 value='prototype';assert.equal(loadClass(storage),'lightningMage');value='__proto__';assert.equal(loadClass(storage),'lightningMage');assert.equal(loadClass({getItem:()=>{throw Error()}}),'lightningMage');
});

test('ready without join cannot bypass the active class lock',()=>{
 const g=new Game(()=>{},()=> 'id'),p=g.add('p');g.message('p',{type:'ready'},100);g.message('p',{type:'join',classId:'warrior'},200);assert.equal(p.classId,'lightningMage');assert.equal(p.loadout.includes('swordSwing'),false);
});
