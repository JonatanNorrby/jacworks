import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
import {TRUFFLE_POISON as cfg} from './trufflePoison';
function encounter(boss='greenCone'){
 let id=0;const g=new Game(()=>{},()=>String(++id));const a=g.add('a');a.name='Alice';
 g.message('a',{type:'propose',boss},100);g.message('a',{type:'vote',proposalId:g.vote!.id,accept:true},100);
 g.next=Infinity;a.pos={x:10,z:10};return {g,a};
}
test('mark lasts exactly five seconds, follows player at detonation, grace, ticks, radius and expiry',()=>{
 const {g,a}=encounter();g.tick(6099);assert.equal(g.poison.mark,undefined);
 const mark=g.tick(6100).poisonMark!;assert.equal(mark.playerId,'a');assert.equal(mark.detonatesAt,11100);
 g.tick(11099);assert.equal(g.poison.clouds.length,0);a.pos={x:-8,z:8};
 const spawn=g.tick(11100).poisonClouds![0];assert.deepEqual(spawn.pos,a.pos);assert.equal(spawn.activeAt,12600);assert.equal(spawn.expiresAt,21100);assert.equal(spawn.radius,cfg.radius);
 a.pos={x:-8,z:8};g.tick(12599);assert.equal(a.hp,100);g.tick(12600);assert.equal(a.hp,92);g.tick(12600);assert.equal(a.hp,92);g.tick(13599);assert.equal(a.hp,92);g.tick(13600);assert.equal(a.hp,84);
 a.pos={x:-5.49,z:8};g.tick(14600);assert.equal(a.hp,84);a.pos={x:-5.5,z:8};g.tick(15600);assert.equal(a.hp,76);
 // No accumulated catch-up pulses and expiry is exclusive, including a stall beyond expiry.
 g.tick(19600);assert.equal(a.hp,68);g.tick(21099);assert.equal(a.hp,60);g.tick(21100);assert.equal(a.hp,60);assert.equal(g.poison.clouds.length,0);
 g.tick(26099);assert.equal(g.poison.mark,undefined);assert.equal(g.tick(26100).poisonMark?.markedAt,26100);
});
test('late joins receive immutable complete poison snapshots and target selection rotates',()=>{
 const {g,a}=encounter();const b=g.add('b');b.pos={x:10,z:-10};
 const first=g.tick(6100);g.add('late');const late=JSON.parse(JSON.stringify(g.tick(7000)));assert.deepEqual(late.poisonMark,first.poisonMark);
 a.pos={x:-8,z:8};const cloud=g.tick(11100);const serialized=JSON.parse(JSON.stringify(cloud));g.tick(12600);assert.equal(cloud.poisonClouds![0].nextTickAt,12600);assert.deepEqual(serialized.poisonClouds,cloud.poisonClouds);
 g.tick(26100);assert.equal(g.poison.mark?.playerId,'b');
});
test('poison uses authoritative mitigation, shield absorption and lethal damage',()=>{
 const {g,a}=encounter();g.tick(6100);g.tick(11100);a.guardUntil=13000;a.shield=1;a.shieldUntil=13000;
 g.tick(12600);assert.equal(a.hp,99);assert.equal(a.shield,0);a.hp=8;g.tick(13600);assert.equal(a.alive,false);assert.equal(a.hp,0);assert.equal(g.phase,'wiped');assert.equal(g.poison.mark,undefined);assert.deepEqual(g.poison.clouds,[]);
});
test('death/disconnect cancels marked player without retargeting; other clouds persist until reset',()=>{
 const {g,a}=encounter();const b=g.add('b');b.pos={x:-10,z:-10};g.tick(6100);a.alive=false;g.tick(7000);assert.equal(g.poison.mark,undefined);g.tick(11100);assert.deepEqual(g.poison.clouds,[]);
 const next=g.tick(26100).poisonMark!;assert.ok(next);g.remove(next.playerId);assert.equal(g.poison.mark,undefined);
 g.reset();assert.deepEqual(g.poison.clouds,[]);assert.equal(g.poison.nextMarkAt,0);
});
test('victory, hub, retry and empty-room leave clear poison; other bosses never schedule it',()=>{
 for(const action of ['victory','hub','retry','leave']){const {g}=encounter();g.tick(6100);g.tick(11100);assert.equal(g.poison.clouds.length,1);
  if(action==='victory'){g.boss.hp=0;g.tick(11200);}else if(action==='leave')g.remove('a');else {g.message('a',{type:'hub'},11200);if(action==='retry'){g.message('a',{type:'propose',boss:'greenCone'},11300);g.message('a',{type:'vote',proposalId:g.vote!.id,accept:true},11300);assert.equal(g.poison.nextMarkAt,17300);}}
  assert.deepEqual(g.poison.clouds,[]);assert.equal(g.poison.mark,undefined);
 }
 for(const boss of ['warden','hardWarden','yellowBall','hardYellowBall']){const {g}=encounter(boss);g.tick(6100);g.tick(11100);assert.equal(g.poison.mark,undefined);assert.deepEqual(g.poison.clouds,[]);}
});
test('server stall preserves full spawn grace, never backfills expired damage, or shortens a new mark',()=>{
 const {g,a}=encounter();g.tick(6100);const cloud=g.tick(22000).poisonClouds![0];assert.equal(a.hp,100);assert.equal(cloud.activeAt,23500);assert.equal(cloud.expiresAt,32000);g.tick(23499);assert.equal(a.hp,100);g.tick(23500);assert.equal(a.hp,92);g.tick(50000);assert.equal(a.hp,92);assert.deepEqual(g.poison.clouds,[]);assert.equal(g.poison.mark?.detonatesAt,55000);
});

test('all players in radius take nine pulses over ten seconds and walking out avoids damage',()=>{
 const {g,a}=encounter();const b=g.add('b');b.pos={...a.pos};g.tick(6100);g.tick(11100);
 for(let at=12600;at<21100;at+=1000)g.tick(at);
 assert.equal(a.hp,28);assert.equal(b.hp,28);g.tick(21100);assert.equal(a.hp,28);
 const escaped=encounter();escaped.g.tick(6100);escaped.g.tick(11100);escaped.a.pos.x-=3;escaped.g.tick(12600);assert.equal(escaped.a.hp,100);
 // A forged client poison payload cannot create hazards or apply damage.
 escaped.g.message('a',{type:'poison',damage:9999,pos:escaped.a.pos},12600);assert.equal(escaped.a.hp,100);assert.equal(escaped.g.poison.clouds.length,1);
});
