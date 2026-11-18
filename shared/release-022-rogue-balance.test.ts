import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
import {CLASS_DEFINITIONS,type ClassId} from './classes';
import {SKILLS,BACKSTAB,type SkillId} from './protocol';
import {CLASS_ITEM_BONUS} from './inventory';

function start(cls:ClassId='rogue') {
 let n=0;const g=new Game(()=>{},()=>String(++n),true);
 const p=g.add('p');
 g.message('p',{type:'join',classId:cls,loadout:CLASS_DEFINITIONS[cls].skills},0);
 g.message('p',{type:'ready'},100);
 g.message('p',{type:'vote',proposalId:g.vote!.id,accept:true},101);
 g.next=Infinity;p.pos={x:0,z:2};p.facing={x:0,z:-1};
 const use=(skill:SkillId,now:number,extra:object={})=>{
  const index=p.loadout.indexOf(skill);
  assert.ok(index>=0,'skill '+skill+' present in active loadout');
  g.message('p',{type:'ability',slot:index+1,...extra},now);
 };
 return {g,p,use};
}

test('Rogue Quick Stab is genuinely stronger but still melee and cooldown-limited',()=>{
 const {g,p,use}=start();
 assert.equal(SKILLS.quickStab.cooldown,600);
 assert.equal(SKILLS.quickStab.description.includes('32 damage'),true);
 p.pos={x:0,z:3.1};use('quickStab',200);
 assert.equal(g.boss.hp,1768);
 use('quickStab',201);assert.equal(g.boss.hp,1768);
 p.pos={x:0,z:3.3};use('quickStab',800);
 assert.equal(g.boss.hp,1768,'outside 3.2 units even when facing');
 p.pos={x:0,z:3.1};use('quickStab',1400);
 assert.equal(g.boss.hp,1736);
});

test('Backstab whiff keeps Vanish usable, then rear contact pays off and restores slot',()=>{
 const {g,p,use}=start();
 const tank=g.add('tank');tank.pos={x:0,z:-2};
 p.pos={x:0,z:5};
 use('vanish',200);assert.equal(p.cooldowns[1],8200);
 use('backstab',300);
 assert.equal(g.boss.hp,1800);
 assert.equal(p.invisibleUntil,4200,'a miss does not waste invisibility');
 assert.equal(p.loadout[1],'backstab','a miss can be retried');
 p.pos={x:0,z:2};
 use('backstab',400);
 assert.equal(g.boss.hp,1800-BACKSTAB.rear);
 assert.equal(BACKSTAB.rear,110);
 assert.equal(p.invisibleUntil,0);
 assert.equal(p.loadout[1],'vanish');
 assert.equal(p.cooldowns[1],8200,'whiffing and landing do not shorten Vanish cooldown');
 p.cooldowns[1]=0;tank.pos={x:0,z:1.8};
 use('vanish',500);use('backstab',600);
 assert.equal(g.boss.hp,1800-BACKSTAB.rear-BACKSTAB.normal,'same-side tank results in front-facing fallback');
 assert.equal(BACKSTAB.normal,42);
});

test('Unspent Backstab automatically reverts when invisibility expires and original cooldown remains',()=>{
 const {g,p,use}=start();
 use('vanish',200);
 assert.equal(p.loadout[1],'backstab');
 g.tick(4199);
 assert.equal(p.loadout[1],'backstab');
 g.tick(4200);
 assert.equal(p.invisibleUntil,0);
 assert.equal(p.loadout[1],'vanish','no permanently stuck Backstab button');
 use('vanish',4300);assert.equal(p.invisibleUntil,0,'cannot bypass the original 8-second cooldown');
 use('vanish',8200);assert.equal(p.invisibleUntil,12200);
 assert.equal(p.loadout[1],'backstab');
});

test('Rogue poison now deals 8x4; Venom Fang maintains valuable 18x2 burst; Nightshade Hood doubles ticks',()=>{
 function amount(offhand:'venomFang'|null,head:'nightshadeHood'|null){
  const {g,p,use}=start();p.offhand=offhand;p.head=head;
  use('poisonEnchant',200);use('quickStab',300);
  assert.equal(g.boss.hp,1800-32);
  g.tick(4500);
  return 1800-g.boss.hp-32;
 }
 assert.equal(BACKSTAB.poisonTick,8);
 assert.equal(CLASS_ITEM_BONUS.roguePoisonTick,18);
 assert.equal(amount(null,null),32);
 assert.equal(amount('venomFang',null),36);
 assert.equal(amount('venomFang','nightshadeHood'),72);
});

function idealDps(cls:ClassId){
 const {g,p}=start(cls);
 g.boss.hp=g.boss.maxHp=100000;
 const preference:SkillId[]=cls==='rogue'?['poisonEnchant','vanish','backstab','quickStab']:
   cls==='fireMage'?['fireMine','lazor','fireball']:['arrowRain','splitShot','aimedShot'];
 for(let now=200;now<=30200;now+=100){
  p.pos={x:0,z:2};p.facing={x:0,z:-1};
  for(const skill of preference){
   const slot=p.loadout.indexOf(skill);
   if(slot>=0)g.message('p',{type:'ability',slot:slot+1,
    target:{x:0,z:0},
    targetId:['fireball','aimedShot'].includes(skill)?'boss':undefined
   },now);
  }
  g.tick(now);
 }
 return Math.round((g.damageTotals.get('p')??0)/30*10)/10;
}

test('Rogue earns a modest close-range damage lead over ranged classes on identical stationary-boss conditions',()=>{
 const rogue=idealDps('rogue'),fire=idealDps('fireMage'),ranger=idealDps('ranger');
 assert.ok(rogue>=100,'Rogue ideal DPS unexpectedly low: '+rogue);
 assert.ok(rogue>fire&&rogue>ranger,'Rogue '+rogue+', Fire '+fire+', Ranger '+ranger);
 assert.ok(rogue<fire*1.3,'Rogue '+rogue+' should not wildly outperform Fire Mage '+fire);
});
