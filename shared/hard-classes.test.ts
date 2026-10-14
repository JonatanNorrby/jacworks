import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game,HARD_PILLARS,pillarOccludes,moveSolid,chargeEnd,distance} from './game';
import {CLASS_DEFINITIONS,gearEligible} from './classes';
import type {ClassId} from './classes';
import {emptyInventory,craft,equip,readInventory,countInventory,grantReward} from './inventory';
function room(classId:ClassId='defender',hard=false){let n=0;const events:any[]=[];const g=new Game(e=>events.push(e),()=>String(++n));const p=g.add('p');g.message('p',{type:'join',classId,loadout:CLASS_DEFINITIONS[classId].skills,boss:hard?'hardWarden':'warden'});g.message('p',{type:'ready'},100);g.next=1e9;p.pos={x:0,z:2};p.facing={x:0,z:-1};const use=(skill:string,now=200,extra:object={})=>g.message('p',{type:'ability',slot:p.loadout.indexOf(skill as never)+1,...extra},now);return {g,p,use,events};}
test('Bulwark halves movement and damage, expires, cannot be refreshed on cooldown',()=>{
 const {g,p,use}=room();use('bulwark');use('bulwark',300);assert.equal(p.bulwarkUntil,6200);g.hurt(p,300);assert.equal(p.hp,76);
 p.pos={x:0,z:8};g.message('p',{type:'input',seq:1,move:{x:1,z:0}},400);g.tick(400);assert.equal(p.pos.x,.11);
 g.message('p',{type:'input',seq:2,move:{x:1,z:0}},6200);g.tick(6200);assert.ok(Math.abs(p.pos.x-.33)<1e-9);g.hurt(p,6200);assert.equal(p.hp,28);
});
test('Heroic Shield validates allies before cooldown, self remains still, absorbs after mitigation',()=>{
 const {g,p,use}=room();const a=g.add('a');a.pos={x:12,z:12};for(const targetId of ['missing','boss','a'])use('heroicShield',200,{targetId});assert.equal(p.cooldowns[2],0);
 a.pos={x:2,z:2};a.alive=false;use('heroicShield',200,{targetId:'a'});assert.equal(p.shield,0);a.alive=true;
 const before={...p.pos};use('heroicShield');assert.deepEqual(p.pos,before);assert.equal(p.shield,80);
 use('bulwark');g.hurt(p,300);assert.equal(p.hp,100);assert.equal(p.shield,56);g.hurt(p,6200);assert.equal(p.shield,0);assert.equal(p.hp,52);
 p.cooldowns[2]=0;use('heroicShield',7000,{targetId:'a'});assert.ok(distance(p.pos,a.pos)<1e-8);assert.equal(p.shield,80);assert.equal(a.shield,40);g.hurt(a,7100);assert.equal(a.hp,92);assert.equal(a.shield,0);
});
test('Heroic Shield movement and Dash never tunnel through hard pillars',()=>{
 const {g,p,use}=room('defender',true);const a=g.add('a');a.pos={x:7,z:0};p.pos={x:2,z:0};use('heroicShield',200,{targetId:'a'});assert.ok(p.pos.x<2.53);assert.equal(a.shield,40);
 p.facing={x:1,z:0};use('dash',300);assert.ok(p.pos.x<2.53);
});
test('Vanish lasts exactly four seconds, swaps its actual slot, excludes enemy targeting and restores',()=>{
 const {g,p,use}=room('rogue');p.pos={x:7,z:0};use('vanish');assert.equal(p.invisibleUntil,4200);assert.equal(p.loadout[1],'backstab');assert.equal(p.cooldowns[1],8200);
 g.schedule(300);assert.equal(g.telegraphs.length,0);const a=g.add('a');a.pos={x:-7,z:0};g.schedule(400);assert.deepEqual(g.telegraphs[0].pos,a.pos);
 g.tick(4199);assert.equal(p.loadout[1],'backstab');g.tick(4200);assert.equal(p.loadout[1],'vanish');use('vanish',4300);assert.equal(p.invisibleUntil,4200);
});
test('invisible rogue is ignored by pursuing cone and adds but still takes area damage',()=>{
 const {g,p,use}=room('rogue');g.boss.id='greenCone';use('vanish');g.adds=[{id:'add',pos:{...p.pos},hp:54,maxHp:54,attackAt:0}];g.tick(300);assert.equal(p.hp,100);assert.deepEqual(g.boss.pos,{x:0,z:0});g.hurt(p,400);assert.equal(p.hp,52);
});
test('Backstab rear bonus, front fallback, restored Vanish and retained cooldown',()=>{
 const {g,p,use}=room('rogue');const a=g.add('a');a.pos={x:0,z:-2};use('vanish');use('backstab',300);assert.equal(g.boss.hp,1720);assert.equal(p.invisibleUntil,0);assert.equal(p.loadout[1],'vanish');assert.equal(p.cooldowns[1],8200);
 p.cooldowns[1]=0;a.pos={x:0,z:1.8};use('vanish',400);use('backstab',500);assert.equal(g.boss.hp,1696);
});
test('Poison Enchant affects successful stabs only and ticks four times authoritatively',()=>{
 const {g,p,use}=room('rogue');use('poisonEnchant');p.facing={x:0,z:1};use('quickStab');assert.equal(g.effects.length,0);p.facing={x:0,z:-1};use('quickStab',800);assert.equal(g.boss.hp,1776);g.tick(1799);assert.equal(g.boss.hp,1776);g.tick(4800);assert.equal(g.boss.hp,1752);assert.equal(g.effects.length,0);
 p.cooldowns[0]=0;use('quickStab',6200);assert.equal(g.effects.length,0);
});
test('buffs, shields and skill swap clean up on death, retry, victory and disconnect',()=>{
 for(const ending of ['death','reset','victory','disconnect']){const {g,p,use}=room('rogue');use('vanish');use('poisonEnchant');p.shield=5;p.shieldUntil=99999;
 if(ending==='death')g.hurt(p,300,999);if(ending==='reset')g.reset();if(ending==='victory'){g.boss.hp=0;g.tick(300)}if(ending==='disconnect'){g.remove('p');assert.equal(g.players.size,0);continue}
 assert.equal(p.invisibleUntil,0);assert.equal(p.poisonUntil,0);assert.equal(p.shield,0);assert.equal(p.loadout[1],'vanish');}
});
test('pillar occlusion uses segment, both sides, tangent and exposed flanks',()=>{
 for(const sign of [-1,1]){assert.ok(pillarOccludes({x:0,z:0},{x:sign*7,z:0}));assert.equal(pillarOccludes({x:0,z:0},{x:sign*2,z:0}),false);assert.equal(pillarOccludes({x:0,z:0},{x:sign*7,z:4}),false);}
 assert.ok(pillarOccludes({x:0,z:1},{x:7,z:1}));assert.equal(pillarOccludes({x:0,z:1.01},{x:7,z:1.01}),false);assert.equal(pillarOccludes({x:0,z:0},{x:0,z:0}),false);
});
test('swept movement and charge block pillars, allow tangential movement and clamp walls',()=>{
 const start={x:2,z:0};const dash=moveSolid(start,{x:8,z:0},{x:0,z:0},HARD_PILLARS);assert.ok(dash.x<=2.52);assert.ok(distance(dash,HARD_PILLARS[1])>=1.48-1e-8);
 const end=chargeEnd(start,{x:1,z:0},{x:0,z:0},[],8,HARD_PILLARS);assert.ok(end.x<=2.52);
 const slide=moveSolid({x:2.52,z:0},{x:0,z:2},{x:0,z:0},HARD_PILLARS);assert.ok(slide.z>1.9);
 const wall=moveSolid({x:11,z:8},{x:10,z:0},{x:0,z:0},HARD_PILLARS);assert.equal(wall.x,12);
});
test('Hard Warden sweep hits full arena except pillar cover; normal Warden retains line sweep',()=>{
 const {g,p}=room('defender',true);p.pos={x:7,z:0};const a=g.add('a');a.pos={x:0,z:7};g.mechanic=1;g.schedule(200);assert.equal(g.telegraphs[0].sweep,true);g.tick(1700);assert.equal(p.hp,100);assert.equal(a.hp,36);
 const normal=room();normal.g.mechanic=1;normal.g.schedule(200);assert.equal(normal.g.telegraphs[0].kind,'line');assert.equal(normal.g.telegraphs[0].sweep,undefined);
});
test('Hard Warden large blast and fixed-position triple scatter spaced 500ms',()=>{
 const {g,p}=room('defender',true);assert.equal(g.boss.hp,3000);g.schedule(200);assert.equal(g.telegraphs[0].radius,4.2);g.telegraphs=[];g.mechanic=2;g.schedule(300);assert.deepEqual(g.telegraphs.map(t=>t.resolvesAt).sort(),[1800,2300,2800]);for(const t of g.telegraphs)assert.deepEqual(t.pos,p.pos);
 p.pos={x:8,z:8};g.tick(2800);assert.equal(p.hp,100);
});
test('hard selection locks, victory grants distinct loot once, reset retains hard HP',()=>{
 const {g,p}=room('defender',true);const a=g.add('a');g.message('a',{type:'join',boss:'warden'});assert.equal(g.boss.id,'hardWarden');g.boss.hp=0;const snap=g.tick(200);assert.equal(snap.reward?.material,'largeCylinder');const inv=emptyInventory();assert.ok(grantReward(inv,snap.reward,p.id));assert.equal(grantReward(inv,snap.reward,p.id),false);assert.equal(countInventory(inv).cylinderTube,0);g.reset();assert.equal(g.boss.hp,3000);g.remove('a');g.remove('p');assert.equal(g.boss.hp,1800);
});
test('Redtube recipe consumes three large cylinders; ownership and equipment persist without changing legacy gear',()=>{
 const inv=emptyInventory();inv.rewards={a:'largeCylinder',b:'largeCylinder'};assert.equal(craft(inv,'redtubeArmour'),false);inv.rewards.c='largeCylinder';assert.ok(craft(inv,'redtubeArmour'));assert.equal(craft(inv,'redtubeArmour'),false);assert.ok(equip(inv,'armour','redtubeArmour'));assert.deepEqual(readInventory(JSON.stringify(inv)),inv);assert.equal(countInventory(inv).largeCylinder,0);assert.equal(readInventory(JSON.stringify({...inv,armours:99})).armours,1);
 for(const id of Object.keys(CLASS_DEFINITIONS) as ClassId[]){const g=new Game(()=>{},()=> 'id'),p=g.add('p');g.message('p',{type:'join',classId:id,inventory:inv});assert.equal(!!p.armour,gearEligible(id,'redtubeArmour'));}assert.equal(inv.armour,'redtubeArmour');
});
test('armour reduces boss damage 5%, excludes add damage, expands Sword Swing reach and angle',()=>{
 const {g,p,use}=room('warrior');p.armour='redtubeArmour';g.hurt(p,200);assert.equal(p.hp,54.400000000000006);g.hurt(p,300,12,false);assert.equal(p.hp,42.400000000000006);
 p.pos={x:0,z:4};use('swordSwing');assert.equal(g.boss.hp,1762);p.pos={x:3.5,z:0};p.facing={x:0,z:-1};p.cooldowns[0]=0;use('swordSwing',300);assert.equal(g.boss.hp,1724);p.armour=null;p.cooldowns[0]=0;use('swordSwing',400);assert.equal(g.boss.hp,1724);
});

test('Vanish swaps a rearranged slot and forged client buff fields are ignored',()=>{
 const {g,p}=room('rogue');g.reset();g.message('p',{type:'join',classId:'rogue',loadout:['dash','poisonEnchant','quickStab','vanish'],shield:999,invisibleUntil:999999});assert.equal(p.shield,0);assert.equal(p.invisibleUntil,0);g.message('p',{type:'ready'},100);g.next=1e9;
 g.message('p',{type:'ability',slot:4},200);assert.equal(p.loadout[3],'backstab');assert.equal(p.loadout[1],'poisonEnchant');g.tick(4200);assert.equal(p.loadout[3],'vanish');assert.equal(p.cooldowns[3],8200);
});
test('Guard, Bulwark and armour mitigate before absorption; shields do not stack',()=>{
 const {g,p,use}=room('defender',true);p.armour='redtubeArmour';p.guardUntil=2000;use('bulwark');use('heroicShield');g.hurt(p,300);assert.ok(Math.abs(p.shield-72.4)<1e-9);assert.equal(p.hp,100);
 p.cooldowns[2]=0;use('heroicShield',400);assert.equal(p.shield,80);
});
test('triple scatter actually resolves separate hits 500ms apart',()=>{
 const {g,p}=room('defender',true);p.hp=p.maxHp=300;g.mechanic=2;g.schedule(200);g.tick(1699);assert.equal(p.hp,300);g.tick(1700);assert.equal(p.hp,236);g.tick(2199);assert.equal(p.hp,236);g.tick(2200);assert.equal(p.hp,172);g.tick(2700);assert.equal(p.hp,108);
});
