import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game,fractureCardinal,fractureQuadrant,CARDINAL_DIRECTIONS} from './game';
import {CLASS_DEFINITIONS,type ClassId} from './classes';
import type {BossId,PlayerState} from './protocol';
import {SKILLS} from './protocol';
import {emptyTalents} from './talents';

function fight(cls:ClassId,boss:BossId='warden'){
 let n=0;const messages:unknown[]=[];
 const g=new Game(m=>messages.push(m),()=>String(++n),true),p=g.add('p');
 g.message('p',{type:'join',classId:cls,loadout:CLASS_DEFINITIONS[cls].skills},100);
 g.message('p',{type:'propose',boss},100);
 g.message('p',{type:'vote',proposalId:g.vote!.id,accept:true},100);
 assert.equal(g.phase,'fight');g.next=Infinity;p.pos={x:0,z:2.2};p.facing={x:0,z:-1};
 return {g,p,messages};
}

test('Ember Afterglow never re-triggers Fire Mine: one 95 explosion + three 8-damage pulses',()=>{
 const {g,p}=fight('fireMage');p.pos={x:0,z:3};
 p.talents={wins:['warden','yellowBall','greenCone'],picks:{fireMage:['unyieldingForce','volatileMines','emberAfterglow']}};
 g.message('p',{type:'ability',slot:3,target:{x:0,z:0}},200);
 assert.equal(g.effects.filter(e=>e.skill==='fireMine'&&!e.afterglow).length,1);
 g.tick(300);
 assert.equal(g.boss.hp,1800-95*1.03);
 assert.equal(g.effects.filter(e=>e.afterglow).length,1);
 assert.equal(g.effects.filter(e=>e.skill==='fireMine'&&!e.afterglow).length,0);
 const after=g.effects.find(e=>e.afterglow)!;
 assert.equal(after.damage,8);assert.equal(after.remaining,3);assert.equal(after.poisonCloud,undefined);
 g.tick(1300);assert.ok(Math.abs(g.boss.hp-(1800-(95+8)*1.03))<1e-8);
 g.tick(2300);g.tick(3300);
 assert.ok(Math.abs(g.boss.hp-(1800-(95+24)*1.03))<1e-8);
 assert.equal(g.effects.some(e=>e.afterglow),false);
 const hp=g.boss.hp;g.tick(8000);assert.equal(g.boss.hp,hp,'no repeating mine or runaway afterglow');
 assert.equal(g.phase,'fight','single mine cannot instant-kill boss');
});

test('Split Shot independently damages once per projectile contact: 3 × 22 and 5 × 16',()=>{
 const normal=fight('ranger');normal.g.message('p',{type:'ability',slot:3},200);
 assert.equal(normal.g.boss.hp,1800-66,'all three close-range rays strike boss');
 const quiver=fight('ranger');quiver.p.offhand='splitthornQuiver';
 quiver.g.message('p',{type:'ability',slot:3},200);
 assert.equal(quiver.g.boss.hp,1800-80,'all five close-range rays strike boss');
 const talented=fight('ranger');talented.p.pos={x:0,z:1.85};talented.p.offhand='splitthornQuiver';
 talented.p.talents={wins:['warden','yellowBall'],picks:{ranger:['unyieldingForce','splitVolley']}};
 talented.g.message('p',{type:'ability',slot:3},200);
 assert.ok(talented.g.boss.hp<1800-80*1.03,'Split Volley adds independently colliding outer arrows');
});

test('Warden facing stays synchronized with nearest visible living target, including Hard Warden',()=>{
 for(const boss of ['warden','hardWarden','duoYellowWarden'] as const){
  const {g,p}=fight('rogue',boss);p.pos={x:g.boss.pos.x,z:g.boss.pos.z+6};
  let state=g.tick(1000);assert.equal(state.boss.heading,0,boss+' faces north');
  p.pos={x:g.boss.pos.x+6,z:g.boss.pos.z};state=g.tick(1100);
  assert.ok(Math.abs((state.boss.heading??0)-Math.PI/2)<.0001,boss+' faces east');
  assert.ok(Number.isFinite(state.boss.heading));
 }
});

test('Fracturer compass sectors always leave an intact central corridor for all four possible safe directions',()=>{
 assert.deepEqual(CARDINAL_DIRECTIONS,['north','east','south','west']);
 const paths={north:{x:0,z:7},east:{x:7,z:0},south:{x:0,z:-7},west:{x:-7,z:0}};
 for(const [direction,pos] of Object.entries(paths)){
  assert.equal(fractureCardinal(pos),direction);
  assert.equal(fractureQuadrant(pos),-1,'the selected safe direction must not be cut away');
 }
});

test('Fracturer marks three unsafe quarters, hits only unsafe players once, then rotates safe direction',()=>{
 const {g,p,messages}=fight('lightningMage','fracturer');
 const east=g.add('east'),south=g.add('south');
 p.pos={x:0,z:6};east.pos={x:6,z:0};south.pos={x:0,z:-6};g.next=Infinity;
 let snap=g.tick(11100);
 assert.equal(snap.fracturerSurge?.safeDirection,'north');
 assert.equal(snap.fracturerSurge?.warnAt,11100);
 assert.equal(snap.fracturerSurge?.resolvesAt,14300);
 assert.equal(snap.fracturerSurge?.resolved,false);
 assert.ok(messages.some(m=>typeof m==='object'&&m!==null&&'text' in m&&String((m as {text:string}).text).includes('SAFE NORTH')));
 g.tick(14299);assert.equal(p.hp,100);assert.equal(east.hp,100);assert.equal(south.hp,100);
 snap=g.tick(14300);
 assert.equal(snap.fracturerSurge?.resolved,true);
 assert.equal(p.hp,100);assert.equal(east.hp,45);assert.equal(south.hp,45);
 g.tick(14400);assert.equal(east.hp,45,'resolution damages only once');
 g.tick(15060);assert.equal(g.fracturerSurge,undefined);
 snap=g.tick(27100);assert.equal(snap.fracturerSurge?.safeDirection,'east','rotates safe cardinal direction');
 g.tick(30300);assert.equal(east.hp,45,'east safe on second cycle');
 assert.equal(p.hp,45,'north unsafe on second cycle');
});

test('Fracturer attack also belongs to living duo Fracturer and cancels when the partner dies',()=>{
 const {g}=fight('lightningMage','duoTruffleFracturer');
 g.next=Infinity;g.nextDuoAt=Infinity;g.poison.clear();
 const partner=g.adds.find(a=>a.kind==='duoBoss'&&a.bossId==='fracturer')!;
 assert.ok(partner);
 let snap=g.tick(11100);assert.equal(snap.fracturerSurge?.safeDirection,'north');
 partner.hp=0;
 snap=g.tick(11200);assert.equal(snap.fracturerSurge,undefined,'do not leave a lethal ability from a dead partner');
 g.reset();assert.equal(g.fracturerSurge,undefined);assert.equal(g.nextFracturerSurgeAt,0);
});
