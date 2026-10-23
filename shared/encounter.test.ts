import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
import {SKILLS,BACKSTAB} from './protocol';
import {CLASS_DEFINITIONS} from './classes';
import type {ClassId} from './classes';
function room(classId:ClassId='shaman',hard=false){let n=0;const fx:any[]=[];const g=new Game(m=>fx.push(m),()=>String(++n));const p=g.add('p');g.message('p',{type:'join',classId,loadout:CLASS_DEFINITIONS[classId].skills,boss:hard?'hardWarden':'warden'});g.message('p',{type:'propose',boss:hard?'hardWarden':'warden'},100);g.message('p',{type:'vote',proposalId:g.vote!.id,accept:true},100);g.next=1e9;return {g,p,fx,use:(skill:string,now=200,extra:object={})=>g.message('p',{type:'ability',slot:p.loadout.indexOf(skill as never)+1,...extra},now)}}
test('room vote requires every connection including proposer; cannot forge, repeat, replace or replay acceptance',()=>{
 let n=0;const g=new Game(()=>{},()=>String(++n));for(const id of ['a','b'])g.add(id);
 g.message('a',{type:'propose',boss:'hardWarden'},100);const id=g.vote!.id;assert.deepEqual(g.vote!.accepted,[]);
 g.message('a',{type:'ready'},101);g.message('b',{type:'ready'},101);assert.equal(g.phase,'lobby');
 g.message('a',{type:'vote',proposalId:'old',accept:true},102);g.message('a',{type:'vote',proposalId:id,accept:'true'},102);g.message('outsider',{type:'vote',proposalId:id,accept:true},102);assert.deepEqual(g.vote!.accepted,[]);
 g.message('a',{type:'propose',boss:'warden'},102);assert.equal(g.vote!.boss,'hardWarden');
 g.message('a',{type:'vote',proposalId:id,accept:true,playerId:'b'},103);g.message('a',{type:'vote',proposalId:id,accept:true},104);assert.deepEqual(g.vote!.accepted,['a']);assert.equal(g.phase,'lobby');
 g.message('b',{type:'vote',proposalId:id,accept:true},105);assert.equal(g.phase,'fight');assert.equal(g.boss.id,'hardWarden');assert.equal(g.boss.hp,3000);assert.equal(g.vote,undefined);
 g.message('a',{type:'propose',boss:'warden'},106);assert.equal(g.vote,undefined);g.message('a',{type:'hub'},107);g.message('a',{type:'propose',boss:'warden'},108);assert.notEqual(g.vote!.id,id);g.message('b',{type:'vote',proposalId:id,accept:true},109);assert.deepEqual(g.vote!.accepted,[]);
});
test('decline, timeout, disconnect and new connections cancel without starting; retry needs fresh unanimous vote',()=>{
 const {g}=room();g.message('p',{type:'hub'},200);g.add('b');
 for(const reason of ['decline','timeout','remove','add']){
  if(!g.players.has('b'))g.add('b');
  g.message('p',{type:'propose',boss:'greenCone'},300);const id=g.vote!.id;g.message('p',{type:'vote',proposalId:id,accept:true},301);
  if(reason==='decline')g.message('b',{type:'vote',proposalId:id,accept:false},302);
  if(reason==='timeout')g.tick(30300);
  if(reason==='remove')g.remove('b');
  if(reason==='add')g.add('c');
  assert.equal(g.vote,undefined);assert.equal(g.phase,'lobby');
 }
 g.remove('b');g.phase='wiped';g.message('p',{type:'propose',boss:'yellowBall'},40000);const id=g.vote!.id;g.message('p',{type:'vote',proposalId:id,accept:true},40001);assert.equal(g.phase,'wiped');g.message('c',{type:'vote',proposalId:id,accept:true},40002);assert.equal(g.phase,'fight');assert.equal(g.boss.id,'yellowBall');
});
for(const classId of ['fireMage','lightningMage','ranger','priest','shaman'] as const)test(classId+' attacks and placement cannot cross Hard Warden pillars',()=>{
 const {g,p,use,fx}=room(classId,true);p.pos={x:8,z:0};p.facing={x:-1,z:0};
 for(const skill of CLASS_DEFINITIONS[classId].skills)if(skill!=='dash')use(skill,200,{target:{x:0,z:0},targetId:'boss'});
 g.tick(2200);g.tick(2550);assert.equal(g.boss.hp,3000);assert.equal(g.effects.length,0);assert.equal(g.totems.length,0);
 for(const e of fx.filter(e=>e.type==='abilityFx'))if(e.skill==='lazor'||e.skill==='arcBolt'||e.skill==='splitShot')assert.ok(e.to.x>=4.99);
});
test('LAZOR visual ends at first pillar, no burns through cover; exposed lane and normal Warden remain hittable',()=>{
 const {g,p,use,fx}=room('fireMage',true);p.offhand='pointyOrb';p.pos={x:8,z:0};p.facing={x:-1,z:0};use('lazor');assert.equal(g.boss.hp,3000);assert.equal(g.burns.size,0);assert.deepEqual(fx.at(-1).to,{x:5,z:0});
 p.pos={x:0,z:8};p.facing={x:0,z:-1};use('lazor',5000);assert.equal(g.boss.hp,2910);assert.equal(g.burns.size,1);
 const n=room('fireMage');n.p.pos={x:8,z:0};n.p.facing={x:-1,z:0};n.use('lazor');assert.equal(n.g.boss.hp,1710);
});
test('AoE uses line of sight from epicentre; ground placement cannot bypass cover; melee obeys cover',()=>{
 const {g,p,use}=room('fireMage',true);p.pos={x:8,z:0};use('fireMine',200,{target:{x:2,z:0}});assert.equal(g.effects.length,0);
 g.adds=[{id:'covered',pos:{x:3,z:0},hp:100,maxHp:100,attackAt:1e9},{id:'exposed',pos:{x:5,z:1.6},hp:100,maxHp:100,attackAt:1e9}];g.area({x:5.2,z:0},3,50);assert.deepEqual(g.adds.map(a=>a.hp),[100,50]);
 const m=room('warrior',true);m.p.pos={x:5.5,z:0};m.p.facing={x:-1,z:0};m.g.adds=[{id:'a',pos:{x:2.8,z:0},hp:100,maxHp:100,attackAt:1e9}];m.use('swordSwing');assert.equal(m.g.adds[0].hp,100);
});
for(const [classId,skill,duration] of [['ranger','aimedShot',1000],['fireMage','fireball',2000]] as const)test(skill+' clips projectile when target moves behind cover during cast',()=>{
 const {g,p,use,fx}=room(classId,true);p.pos={x:8,z:0};g.boss.pos={x:8,z:5};use(skill,200,{targetId:'boss'});g.boss.pos={x:0,z:0};g.tick(200+duration);assert.deepEqual(fx.at(-1).to,{x:5,z:0});g.tick(550+duration);assert.equal(g.boss.hp,3000);
});
test('Shaman instant damage, placement validation, one of each per owner, fireball travel, ally regeneration and expiry',()=>{
 const {g,p,use}=room();p.pos={x:0,z:5};const a=g.add('a');a.pos={x:0,z:6};a.hp=30;p.hp=50;
 use('earthShock',200,{targetId:'boss',damage:99999});assert.equal(g.boss.hp,1764);use('earthShock',201,{targetId:'boss'});assert.equal(g.boss.hp,1764);
 for(const target of [null,{x:99,z:0},{x:NaN,z:0},{x:12,z:12}])use('fireTotem',200,{target});assert.equal(g.totems.length,0);assert.equal(p.cooldowns[1],0);
 use('fireTotem',200,{target:{x:0,z:4}});use('healingTotem',200,{target:{x:0,z:5}});assert.equal(g.totems.length,2);assert.ok(g.totems.every(t=>t.hp===1));g.tick(1199);assert.equal(a.hp,30);g.tick(1200);assert.equal(a.hp,38);assert.equal(p.hp,58);assert.equal(g.boss.hp,1764);g.tick(1550);assert.equal(g.boss.hp,1740);
 const first=g.totems.find(t=>t.kind==='fireTotem')!.id;use('fireTotem',5200,{target:{x:1,z:4}});assert.equal(g.totems.length,2);assert.notEqual(g.totems.find(t=>t.kind==='fireTotem')!.id,first);
 a.alive=false;a.hp=0;g.tick(6200);assert.equal(a.hp,0);p.hp=99;g.tick(7200);assert.equal(p.hp,100);g.tick(20201);assert.equal(g.totems.length,0);
});
test('totems belong to each Shaman independently and clean up on death, disconnect, reset and encounter end',()=>{
 const {g,p,use}=room();const a=g.add('a');g.message('a',{type:'join',classId:'shaman'});use('fireTotem',200,{target:p.pos});g.ability(a,a.loadout.indexOf('fireTotem')+1,200,a.pos);assert.equal(g.totems.length,2);g.remove('a');assert.equal(g.totems.length,1);p.alive=false;g.tick(300);assert.equal(g.totems.length,0);g.reset();assert.equal(g.totems.length,0);
 const win=room();win.use('healingTotem',200,{target:win.p.pos});win.g.boss.hp=0;win.g.tick(300);assert.equal(win.g.totems.length,0);
});
test('boss marks and areas destroy totems, adds can select and destroy nearby totems, cover protects from sweep',()=>{
 const {g,p,use}=room('shaman',true);p.pos={x:0,z:8};use('fireTotem',200,{target:{x:0,z:3}});const fire=g.totems[0];
 g.mechanic=3;g.schedule(300);use('healingTotem',400,{target:{x:7,z:0}});const heal=g.totems[1];assert.deepEqual(g.telegraphs[0].pos,fire.pos);g.tick(1800);assert.equal(fire.hp,0);assert.equal(heal.hp,1);
 g.telegraphs=[{id:'sweep',kind:'circle',pos:{x:0,z:0},radius:35,sweep:true,resolvesAt:1900}];g.tick(1900);assert.equal(heal.hp,1);
 g.adds=[{id:'add',pos:{x:7,z:.8},hp:54,maxHp:54,attackAt:1900}];g.tick(1950);assert.equal(heal.hp,0);
});
test('Backstab descriptions disclose exact damage, rear rule and poison bonus used by server',()=>{
 for(const skill of ['vanish','backstab'] as const){assert.ok(SKILLS[skill].description.includes(String(BACKSTAB.normal)));assert.ok(SKILLS[skill].description.includes(String(BACKSTAB.rear)));assert.match(SKILLS[skill].description,/solo invisible/);assert.match(SKILLS[skill].description,/four 6-damage/);}
});

test('wide beam cannot hit around a pillar after its visual centre ray stops',()=>{
 const {g}=room('fireMage',true);assert.equal(g.beamHits({x:8,z:0},{x:-1,z:0},{x:3.8,z:1.5},14,1.6),false);
 const {g:normal}=room('fireMage');assert.equal(normal.beamHits({x:8,z:0},{x:-1,z:0},{x:3.8,z:1.5},14,1.6),true);
});

test('scatter always tracks a player, never a totem, and stalled ticks never co-deploy later markers',()=>{
 const {g,p,use}=room('shaman',true);p.pos={x:0,z:7};use('fireTotem',200,{target:{x:0,z:3}});g.mechanic=2;g.schedule(300);assert.deepEqual(g.telegraphs[0].pos,p.pos);
 p.pos={x:0,z:9};g.tick(1400);assert.equal(g.telegraphs.length,2);assert.deepEqual(g.telegraphs[1].pos,p.pos);assert.equal(g.scatter.length,1);g.tick(1899);assert.equal(g.telegraphs.length,1);p.pos={x:7,z:9};g.tick(1900);assert.equal(g.telegraphs.length,2);assert.deepEqual(g.telegraphs.at(-1)!.pos,p.pos);assert.equal(g.telegraphs.at(-1)!.resolvesAt,3400);
});
