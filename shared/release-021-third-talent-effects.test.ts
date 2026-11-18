import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
import {TALENT_TREE,TALENT_POINT_BOSSES} from './talents';
import {CLASS_DEFINITIONS,type ClassId} from './classes';

function fight(cls:ClassId){
 let i=0;const g=new Game(()=>{},()=>String(++i),true),p=g.add('p0');
 g.message('p0',{type:'join',classId:cls,loadout:CLASS_DEFINITIONS[cls].skills},75);
 g.message('p0',{type:'propose',boss:'warden'},100);
 g.message('p0',{type:'vote',proposalId:g.vote!.id,accept:true},101);
 g.next=Infinity;p.pos={x:0,z:3};p.facing={x:0,z:-1};
 const talents=TALENT_TREE[cls].branches[0];
 p.talents={wins:[...TALENT_POINT_BOSSES],picks:{[cls]:['unyieldingForce',...talents]}};
 return {g,p};
}
function ally(g:Game){
 const p=g.add('p1');p.pos={x:1,z:3};p.hp=50;return p;
}
test('Shaman restoration branch increases real healing pulses, shields and Earth Shock spirit echoes',()=>{
 const {g,p}=fight('shaman');p.hp=50;
 g.message('p0',{type:'ability',slot:2,target:{x:0,z:3}},200);
 g.message('p0',{type:'ability',slot:3,target:{x:0,z:3}},210);
 g.tick(1210);
 assert.equal(p.hp,65,'8 baseline plus 3 restoration plus 4 both totems active');
 assert.equal(p.shield,6);
 p.hp=50;g.message('p0',{type:'ability',slot:1,targetId:'boss'},1300);
 assert.equal(p.hp,60,'Spirit Echo heals 10');
});
test('Defender third branch produces extra threat and the defensive Bulwark aura',()=>{
 const {g,p}=fight('defender');const friend=ally(g);p.pos={x:0,z:2};
 g.message('p0',{type:'ability',slot:1},200);
 assert.ok((g.threat.get('p0')??0)>100);
 g.message('p0',{type:'ability',slot:2},1200);
 g.hurt(friend,1300,40,false);
 assert.equal(friend.hp,16,'40 damage reduced by 15% party aura => 34');
});
test('Rogue stealth branch halves threat, shields Vanish and upgrades Quick Stab as opening move',()=>{
 const {g,p}=fight('rogue');p.pos={x:0,z:2};g.damageTarget('boss',100,'p0');
 const before=g.threat.get('p0')!;
 g.message('p0',{type:'ability',slot:2},200);
 assert.equal(g.threat.get('p0'),before/2);
 assert.equal(p.shield,8);
 g.message('p0',{type:'ability',slot:1},300);
 assert.equal(p.invisibleUntil,0);
 assert.ok(Math.abs(g.boss.hp-(1800-(100+48)*1.03))<1e-6);
});
test('Warrior third branch gives Guard duration and allies defensive charge support',()=>{
 const {g,p}=fight('warrior');const friend=ally(g);
 p.pos={x:0,z:6};friend.pos={x:0,z:3};
 g.message('p0',{type:'ability',slot:2},200);
 assert.equal(friend.shield,12,'Charging Stab shielding ally');
 g.message('p0',{type:'ability',slot:3},400);
 assert.equal(p.guardUntil,2400);
 friend.hp=40;
 g.message('p0',{type:'ability',slot:1},500);
 assert.ok(friend.hp>=48,'Sword Slash while Guard heals injured nearby ally');
});
test('Priest sanctuary branch works on the actual Pulse Nova kit, not a dead unused skill',()=>{
 const {g,p}=fight('priest');const friend=ally(g);
 friend.pos={x:1,z:3};p.hp=70;
 g.message('p0',{type:'ability',slot:1},200);
 assert.equal(friend.hp,68);assert.equal(friend.shield,8);
 g.tick(1200);assert.equal(friend.hp,76,'Sanctuary Pulse heals 8 after Nova');
});
test('Lightning Mage third branch adds Lightning Shield absorb, radius and healing pulses',()=>{
 const {g,p}=fight('lightningMage'),friend=ally(g);
 friend.pos={x:0,z:3.4};friend.hp=50;
 g.message('p0',{type:'ability',slot:3,targetId:'p1'},200);
 assert.equal(friend.shield,10);
 g.tick(1200);
 assert.ok(g.boss.hp<1800,'Thunderhead radius of 4 reaches enemy at z=0 from z=3.4');
 assert.equal(friend.hp,53,'Conduit Mender heals primary ally by 3');
});
test('Ranger skirmishing branch rewards volley contact, two distinct targets and Dash chaining',()=>{
 const {g,p}=fight('ranger');g.adds.push({id:'second',pos:{x:1,z:1},hp:100,maxHp:100,attackAt:Infinity});
 g.message('p0',{type:'ability',slot:3},200);
 assert.equal(p.shield,8,'split arrow hit shields caster');
 assert.equal(p.cooldowns[2],200+2200-500,'two distinct targets lower Split Shot cooldown');
 g.message('p0',{type:'ability',slot:4},300);
 assert.equal(p.shield,12,'Dash grants improved shield');
 assert.equal(p.skirmishUntil,3300);
 p.cooldowns[2]=0;g.message('p0',{type:'ability',slot:3},400);
 assert.equal(p.skirmishUntil,0,'next Split Shot consumes Dash-linked extra projectile');
});
test('Fire Mage third branch strengthens Fireball, ignites a nearby mine and grants shield',()=>{
 const {g,p}=fight('fireMage');p.pos={x:0,z:3};
 g.message('p0',{type:'ability',slot:3,target:{x:2.6,z:0}},100);
 g.message('p0',{type:'ability',slot:1,targetId:'boss'},200);
 g.tick(2200);
 assert.ok(g.effects.some(e=>e.skill==='fireMine'&&!e.afterglow),'mine stays armed outside its usual 2-unit trigger range');
 g.tick(2550);
 assert.equal(p.shield,10);
 assert.ok(g.boss.hp<1600,'Fireball plus its chosen mine detonation dealt meaningful damage');
 assert.ok(g.effects.some(e=>e.afterglow),'Wildfire leaves a bounded ember pulse');
 assert.ok(g.burns.size>0,'Rolling Embers started delayed burn');
});
