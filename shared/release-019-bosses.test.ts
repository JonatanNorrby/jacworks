import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
import {ANT_QUEEN_HP,ROYAL_DEATH_DAMAGE,ROYAL_GUARD_HP} from './antQueen';
import {BOSS_PEDESTALS} from './boss-layout';
import {southFacingBarYaw} from './healthBars';
import {TALENT_POINT_BOSSES} from './talents';

function encounter(boss:'antQueen'|'hardWarden',players=1){
 let n=0;const events:unknown[]=[];
 const g=new Game(m=>events.push(m),()=>String(++n),true);
 for(let i=0;i<players;i++)g.add('p'+i);
 g.message('p0',{type:'propose',boss},100);
 for(let i=0;i<players;i++)g.message('p'+i,{type:'vote',proposalId:g.vote!.id,accept:true},101+i);
 assert.equal(g.phase,'fight');assert.equal(g.boss.id,boss);g.next=Infinity;
 return {g,events,players:[...g.players.values()]};
}
test('Ant Queen is in its own northern Nest boss circle and awards a first-clear talent point',()=>{
 const pedestal=BOSS_PEDESTALS.find(p=>p.id==='antQueen');
 assert.equal(pedestal?.difficulty,'Nest');
 assert.equal(pedestal!.pos.z,-6.5,'Nest joins the southern boss-circle row');
 assert.ok(TALENT_POINT_BOSSES.includes('antQueen'));
 const {g,players}=encounter('antQueen');
 assert.equal(g.boss.hp,ANT_QUEEN_HP);
 assert.deepEqual(g.boss.pos,{x:0,z:10.5});
 assert.equal(players[0].pos.z,-10.5,'players start south of queen, outside collision');
 assert.ok(g.tick(250).supportedBosses?.includes('antQueen'));
});
test('Ant Queen ignores ALL direct/area attack damage and only loses HP from killed Royal Guards',()=>{
 const {g,players}=encounter('antQueen');
 g.nextAntRockfallAt=Infinity;
 g.damageTarget('boss',1e9,'p0');
 g.area(g.boss.pos,10,1e9,'p0');
 assert.equal(g.boss.hp,1200);
 for(let wave=1;wave<=4;wave++){
  const at=1250+wave*9500;
  const snapshot=g.tick(at);
  const guard=g.adds.find(a=>a.kind==='royalGuard'&&a.hp>0)!;
  assert.ok(guard,'royal guard exists in wave '+wave);
  assert.equal(guard.maxHp,ROYAL_GUARD_HP);
  assert.ok(snapshot.adds.filter(a=>a.kind==='antWorker').length>=6,'wave contains many workers');
  g.damageTarget('boss',9999,'p0');
  assert.equal(g.boss.hp,ANT_QUEEN_HP-(wave-1)*ROYAL_DEATH_DAMAGE);
  g.damageTarget(guard.id,guard.hp,'p0');
  g.damageTarget(guard.id,99999,'p0'); // dead guard cannot trigger again
  assert.equal(g.royalsDefeated,wave);
  assert.equal(g.boss.hp,ANT_QUEEN_HP-wave*ROYAL_DEATH_DAMAGE);
 }
 const result=g.tick(50000);
 assert.equal(result.phase,'won');
 assert.equal(result.reward?.material,'antChitin');
 assert.deepEqual(result.talentAward?.players,['p0']);
 assert.ok(players[0].talents?.wins.includes('antQueen'));
 assert.equal(result.boss.hp,0);
 assert.equal(result.adds.length,0,'victory cleans up all surviving workers');
});
test('Ant cave worker waves are bounded and only one Royal Guard can be alive at once',()=>{
 const {g}=encounter('antQueen');g.nextAntRockfallAt=Infinity;
 for(let i=0;i<8;i++)g.tick(1600+i*9500);
 assert.equal(g.queenWave,8);
 assert.ok(g.adds.filter(a=>a.kind==='antWorker').length<=24);
 assert.equal(g.adds.filter(a=>a.kind==='royalGuard'&&a.hp>0).length,1);
});
test('Rockfall produces distinct 26-damage server telegraphs, resolves once, and cleans up',()=>{
 const {g,players}=encounter('antQueen');const p=players[0];
 g.nextAntRockfallAt=6600;g.tick(6600);
 const rocks=g.telegraphs.filter(t=>t.style==='rockfall');
 assert.equal(rocks.length,2);assert.ok(rocks.every(t=>t.damage===26&&t.resolvesAt===8350&&t.radius===2));
 assert.equal(p.hp,100);
 g.tick(8350);assert.ok(p.hp<100,'rockfall damages a player standing in marked area');
 const hp=p.hp;
 g.tick(8500);assert.equal(p.hp,hp,'rockfall never repeats');
 assert.equal(g.telegraphs.filter(t=>t.style==='rockfall').length,0);
});
test('Hard Warden Collapse In damages far players while leaving the near ring safe',()=>{
 const {g,players,events}=encounter('hardWarden',2);
 const [near,far]=players;near.pos={x:0,z:2.8};far.pos={x:0,z:8};
 const snapshot=g.tick(14300);assert.equal(snapshot.hardWardenCall?.safeRadius,4.3);
 assert.equal(snapshot.hardWardenCall?.resolved,false);
 assert.ok(events.some(e=>typeof e==='object'&&e!==null&&'text' in e&&String((e as {text:string}).text).includes('COLLAPSE IN')));
 g.tick(16999);assert.equal(near.hp,100);assert.equal(far.hp,100);
 const result=g.tick(17000);assert.equal(result.hardWardenCall?.resolved,true);
 assert.equal(near.hp,100);assert.equal(far.hp,54);
 g.tick(17200);assert.equal(far.hp,54,'no second hit');
 g.tick(17900);assert.equal(g.hardWardenCall,undefined);
 assert.equal(g.nextHardWardenCallAt,30300);
 g.message('p0',{type:'hub'},18000);assert.equal(g.hardWardenCall,undefined);
});
test('Every facing keeps a bar fixed south by counteracting the character yaw',()=>{
 for(const facing of [{x:0,z:1},{x:1,z:0},{x:0,z:-1},{x:-1,z:0},{x:.7,z:.7}]){
  const angle=Math.atan2(facing.x,facing.z);
  assert.ok(Math.abs(angle+southFacingBarYaw(facing))<1e-8);
 }
});

test('Ant Queen late joiners spawn south of the arena instead of inside the boss',()=>{
 const {g}=encounter('antQueen');
 const late=g.add('late');
 assert.equal(late.pos.z,-10.5);assert.equal(late.facing.z,1);
 assert.ok(Math.hypot(late.pos.x-g.boss.pos.x,late.pos.z-g.boss.pos.z)>15);
});
