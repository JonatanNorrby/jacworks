import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game,fractureQuadrant,fractureCardinal} from './game';
import {CHAOS_BASE_BOSSES,CHAOS_ARENA_LIMIT,CHAOS_FRACTURE_CORRIDOR,CHAOS_IMMOBILE_BOSSES} from './chaos';
import {CLASS_DEFINITIONS,type ClassId} from './classes';
import {WARRIOR_DAMAGE,type SkillId} from './protocol';
import {TALENT_POINT_BOSSES,TALENT_TREE} from './talents';
import type {BossId,Telegraph} from './protocol';

function start(boss:BossId='chaosArena',party=1,cls:ClassId='warrior'){
 let count=0;const events:string[]=[];const g=new Game(event=>{
  if(event.type==='chat'||event.type==='event')events.push(event.type==='chat'?event.text:event.text);
 },()=>String(++count),true);
 for(let i=0;i<party;i++){
  const id='p'+i;g.add(id);
  g.message(id,{type:'join',classId:cls,loadout:CLASS_DEFINITIONS[cls].skills},30);
 }
 g.message('p0',{type:'propose',boss},100);const vote=g.vote!.id;
 for(let i=0;i<party;i++)g.message('p'+i,{type:'vote',proposalId:vote,accept:true},101+i);
 assert.equal(g.phase,'fight');
 if(boss==='chaosArena')for(const p of g.players.values()){p.hp=p.maxHp=1_000_000;}
 return {g,events,p:g.players.get('p0')!};
}
const champ=(g:Game,id:BossId)=>g.adds.find(a=>a.kind==='chaosBoss'&&a.bossId===id&&a.hp>0)!;
const marked=(g:Game,id:BossId)=>(g.telegraphs as Telegraph[]).filter(t=>t.sourceBossId===id);

test('Chaos Warden and Queen remain exactly anchored, Fracturer creeps, and Yellow Ball and Truffle roam',()=>{
 const {g}=start();const fixed=Object.fromEntries(CHAOS_IMMOBILE_BOSSES.map(id=>[id,{...champ(g,id).pos}]));
 const yellow={...champ(g,'yellowBall').pos},truffle={...champ(g,'greenCone').pos};
 for(let now=301;now<=13001;now+=400)g.tick(now);
 for(const id of CHAOS_IMMOBILE_BOSSES)assert.deepEqual(champ(g,id).pos,fixed[id],id+' moved');
 assert.notDeepEqual(champ(g,'greenCone').pos,truffle,'Truffle Man chases players');
 const yellowNow=champ(g,'yellowBall');
 assert.ok(yellowNow.hp>0);
 assert.notDeepEqual(yellowNow.pos,yellow,'Yellow Ball rolls and bounces on its real physics clock');
 assert.equal(g.boss.pos.x,0);assert.equal(g.boss.pos.z,0);
 assert.equal(g.arenaLimit(),CHAOS_ARENA_LIMIT);
 assert.equal(g.chaosState?.wardenPattern,3);
 assert.equal(g.chaosState?.fracturerPattern,3);
 assert.equal(g.chaosState?.truffleSmashes,3);
});

test('Chaos Warden uses its normal marked blast, line sweep, and all-player scatter at its fixed origin',()=>{
 const {g}=start('chaosArena',2);
 const warden=champ(g,'warden'),origin={...warden.pos};
 g.tick(3201);
 const first=marked(g,'warden');
 assert.equal(first.length,1);assert.equal(first[0].kind,'circle');assert.equal(first[0].radius,3.1);
 assert.ok(Number.isFinite(warden.heading),'Warden nose tracks a real player');
 g.tick(6801);
 const second=marked(g,'warden');
 assert.equal(second.length,1);assert.equal(second[0].kind,'line');
 assert.equal(second[0].width,3);assert.equal(second[0].length,13);
 assert.deepEqual(second[0].pos,origin);
 g.tick(10401);
 const third=marked(g,'warden');
 assert.equal(third.length,2,'scatter marks every member of a two-player party');
 assert.ok(third.every(t=>t.kind==='circle'&&t.radius===2.2));
 assert.deepEqual(warden.pos,origin);
});

test('Chaos Fracturer runs marked circles, line attacks, four expanding corner collapses and cardinal eruption',()=>{
 const {g,p}=start();
 const fracturer=champ(g,'fracturer'),origin={...fracturer.pos};
 g.tick(3901);
 assert.ok(marked(g,'fracturer').some(t=>t.kind==='circle'&&t.radius===3.1));
 g.tick(7501);
 assert.ok(marked(g,'fracturer').some(t=>t.kind==='line'&&t.length===13));
 assert.equal(g.arenaCuts.length,1);
 assert.equal(g.arenaCuts[0].quadrant,0);
 assert.equal(fractureQuadrant({x:10,z:10},CHAOS_FRACTURE_CORRIDOR),0);
 p.pos={x:10,z:10};g.tick(9701);
 assert.ok(Math.abs(p.pos.x)<CHAOS_FRACTURE_CORRIDOR&&Math.abs(p.pos.z)<CHAOS_FRACTURE_CORRIDOR,'corner collapse pushes to living center paths');
 g.tick(11301);
 assert.ok(g.fracturerSurge,'cardinal 3-of-4 eruption really schedules');
 assert.equal(fractureCardinal({x:10,z:0}),'east');
 g.tick(15901);g.tick(24001);g.tick(32001);
 assert.deepEqual(g.arenaCuts.map(c=>c.quadrant),[0,1,2,3]);
 assert.ok(Math.hypot(fracturer.pos.x-origin.x,fracturer.pos.z-origin.z)>0,'Fracturer now moves slowly');
 assert.ok(Math.hypot(fracturer.pos.x-origin.x,fracturer.pos.z-origin.z)<3,'Fracturer does not sprint around its arena');
 // The floor must reopen and old warnings must disappear when the slow Golem dies.
 g.damageTarget(fracturer.id,1e7,'p0');g.tick(32101);
 assert.equal(g.arenaCuts.length,0);
 assert.equal(g.fracturerSurge,undefined);
 assert.equal(marked(g,'fracturer').length,0);
});

test('Chaos Truffle Man chases, slams with real damage telegraphs, summons mushrooms and marks poison clouds',()=>{
 const {g}=start();
 const truffle=champ(g,'greenCone'),initial={...truffle.pos};
 for(let now=301;now<=13701;now+=400)g.tick(now);
 assert.notDeepEqual(truffle.pos,initial);
 assert.equal(g.chaosState?.truffleSmashes,3);
 assert.ok(g.adds.some(a=>a.id.startsWith('chaos-truffle-add-')&&a.hp>0),'third smash summons living mushroom adds');
 assert.ok(g.poison.clouds.length>0,'Truffle poison mark detonated and spawned a cloud');
 // It is not a generic enemy chasing and delivering unannounced contact attacks.
 assert.ok(truffle.smash===undefined||truffle.smash.recoverAt>=truffle.smash.impactAt);
});

test('Chaos Queen keeps waves, Royal objective, and cave rockfall while remaining immune to attack',()=>{
 const {g}=start();
 const queen=champ(g,'antQueen'),at={...queen.pos},hp=queen.hp;
 g.damageTarget(queen.id,1e7,'p0');
 assert.equal(queen.hp,hp);
 g.tick(1801);
 assert.ok(g.adds.some(a=>a.kind==='antWorker'));
 assert.ok(g.adds.some(a=>a.kind==='royalGuard'));
 g.tick(6801);
 assert.ok(g.telegraphs.some(t=>t.style==='rockfall'&&t.sourceBossId==='antQueen'));
 for(let i=0;i<4;i++){
  g.tick(1801+i*9500);
  const guard=g.adds.find(a=>a.kind==='royalGuard'&&a.hp>0);
  assert.ok(guard,'wave '+i+' spawns a Royal Guard');
  g.damageTarget(guard.id,1e7,'p0');
  assert.equal(queen.hp,Math.max(0,hp-(i+1)*300));
 }
 assert.deepEqual(queen.pos,at);
});

test('Chaos Yellow Ball still rolls, bounces and splits; all fragments must die',()=>{
 const {g}=start();
 const yellow=champ(g,'yellowBall'),at={...yellow.pos};
 g.tick(2401);
 assert.ok(g.telegraphs.some(t=>t.ownerId===yellow.id&&t.kind==='line'),'Yellow Ball telegraphs a rolling attack');
 g.tick(4001);g.tick(4901);
 assert.notDeepEqual(yellow.pos,at,'the rolling ball actually changed position');
 g.tick(6401);
 assert.ok(g.telegraphs.some(t=>t.ownerId===yellow.id&&t.kind==='circle'),'Yellow Ball bounces after a roll');
 g.damageTarget(yellow.id,1e7,'p0');g.tick(8001);
 assert.ok(g.adds.some(a=>a.kind==='ball'),'Yellow Ball splits instead of instantly dying');
 assert.equal(g.phase,'fight');
});

test('Dead Chaos champions cancel queued attacks instead of damaging after death',()=>{
 const {g}=start();
 g.tick(3201);
 assert.ok(marked(g,'warden').length>0);
 const w=champ(g,'warden');
 g.damageTarget(w.id,1e7,'p0');
 g.tick(3301);
 assert.equal(marked(g,'warden').length,0);
 g.tick(4601);
 assert.ok(marked(g,'greenCone').length>0);
 const truffle=champ(g,'greenCone');
 g.damageTarget(truffle.id,1e7,'p0');g.tick(4701);
 assert.equal(marked(g,'greenCone').length,0,'dead Truffle has no phantom slam');
 assert.equal(g.poison.nextMarkAt,0,'dead Truffle cannot mark new poison targets');
});

function soloDps(cls:ClassId,withTalents=false){
 const {g,p}=start('warden',1,cls);
 g.next=Infinity;g.boss.hp=g.boss.maxHp=100000;
 if(withTalents)p.talents={wins:[...TALENT_POINT_BOSSES],picks:{
  [cls]:['unyieldingForce',...TALENT_TREE[cls].branches[0],...TALENT_TREE[cls].branches[1]]
 }};
 const actions:SkillId[]=cls==='warrior'?['chargingStab','swordSwing','guard']:
 cls==='rogue'?['poisonEnchant','vanish','backstab','quickStab']:
 cls==='fireMage'?['fireMine','lazor','fireball']:['arrowRain','splitShot','aimedShot'];
 for(let now=200;now<=30200;now+=100){
  p.pos={x:0,z:2};p.facing={x:0,z:-1};
  for(const skill of actions){
   const slot=p.loadout.indexOf(skill);
   if(slot>=0)g.message('p0',{type:'ability',slot:slot+1,target:{x:0,z:0},
    targetId:['fireball','aimedShot'].includes(skill)?'boss':undefined},now);
  }
  g.tick(now);
 }
 return Number(((g.damageTotals.get('p0')??0)/30).toFixed(1));
}
test('Warrior damage buff yields a fair tank/melee payoff without reaching pure Rogue DPS',()=>{
 assert.deepEqual(WARRIOR_DAMAGE,{swordSwing:50,chargingStab:85});
 const warrior=soloDps('warrior'),talentedWarrior=soloDps('warrior',true);
 const rogue=soloDps('rogue'),ranger=soloDps('ranger'),fire=soloDps('fireMage');
 assert.equal(warrior,72.2);assert.equal(talentedWarrior,81.1);
 assert.ok(warrior>70&&warrior<80);
 assert.ok(warrior>ranger*.9&&warrior<rogue*.8);
 assert.ok(warrior<fire&&warrior<rogue,'dedicated damage dealers still beat Warrior');
});

test('Chaos Warden visible nose defines rear Backstab even when nearest other player is behind it',()=>{
 const {g}=start('chaosArena',3,'rogue');
 const warden=champ(g,'warden');
 const tank=g.players.get('p0')!,rogue=g.players.get('p1')!,nearby=g.players.get('p2')!;
 tank.pos={x:-12,z:-3};
 rogue.pos={x:-12,z:2.5};rogue.facing={x:0,z:-1};
 nearby.pos={x:-12,z:2.2};
 g.damageTarget(warden.id,100,'p0'); // tank owns the boss threat
 g.tick(301);
 assert.ok(Math.abs(Math.abs(warden.heading??0)-Math.PI)<.01,'nose faces the front tank');
 const before=warden.hp;
 g.message('p1',{type:'ability',slot:2},400); // Vanish
 assert.ok(rogue.invisibleUntil>400);
 g.message('p1',{type:'ability',slot:2},450); // Backstab from behind
 assert.equal(before-warden.hp,110,'backstab matches the visible Warden facing, not nearby spectator');
 assert.equal(rogue.invisibleUntil,0);
});
