import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
import {CLASS_DEFINITIONS} from './classes';
import type {BossId} from './protocol';
import {FRACTURER_CRAWL_SPEED,FRACTURER_STOP_DISTANCE,creepFracturer} from './fracturerMotion';
import {CHAOS_BASE_BOSSES,CHAOS_IMMOBILE_BOSSES} from './chaos';

const dist=(a:{x:number;z:number},b:{x:number;z:number})=>Math.hypot(a.x-b.x,a.z-b.z);
function game(boss:BossId){
 let n=0;const g=new Game(()=>{},()=>String(++n),true);
 const p=g.add('p0');
 g.message('p0',{type:'join',classId:'warrior',loadout:CLASS_DEFINITIONS.warrior.skills},30);
 g.message('p0',{type:'propose',boss},100);
 g.message('p0',{type:'vote',proposalId:g.vote!.id,accept:true},101);
 assert.equal(g.phase,'fight');
 p.pos={x:0,z:-12};p.hp=p.maxHp=1_000_000;
 g.next=Infinity;
 return {g,p};
}
test('Fracturer moves at a deliberately slow 0.16 units/s, stops near its target, and preserves a safe axis',()=>{
 assert.equal(FRACTURER_CRAWL_SPEED,.16);
 assert.equal(FRACTURER_STOP_DISTANCE,3.15);
 let pos={x:12,z:0};
 for(let i=0;i<240;i++){
  const next=creepFracturer(pos,{x:0,z:-15},.25,5.5,21.5);
  assert.ok(dist(pos,next)<=.16*.25+1e-8);
  assert.ok(!(Math.abs(next.x)>5.5&&Math.abs(next.z)>5.5),'slow boss never enters fractured corner');
  pos=next;
 }
 assert.ok(dist(pos,{x:12,z:0})>3,'slow but visibly moving after a full minute');
 assert.ok(dist(pos,{x:12,z:0})<9.7,'one-minute creep still slower than Truffle');
});
test('Solo Fracturer Golem crawls toward player while continuing targeted normal boss mechanics',()=>{
 const {g,p}=game('fracturer');p.pos={x:9,z:2};
 const origin={...g.boss.pos};
 for(let at=301;at<=11501;at+=250)g.tick(at);
 assert.ok(dist(g.boss.pos,origin)>.2,'Fracturer is not fixed');
 assert.ok(dist(g.boss.pos,origin)<2,'slow enough to stay predictable');
 assert.ok(Number.isFinite(g.boss.heading));
 assert.ok(g.arenaCuts.length>=1,'floor collapse mechanic retained');
 assert.ok(g.fracturerSurge,'cardinal eruption mechanic retained');
});
test('Chaos keeps Warden and Queen fixed while Rune Golem creeps and others still attack',()=>{
 const {g,p}=game('chaosArena');p.pos={x:0,z:-17};
 const pos=Object.fromEntries(CHAOS_BASE_BOSSES.map(x=>[x.id,{...x.pos}]));
 for(let at=301;at<=10701;at+=250)g.tick(at);
 for(const id of CHAOS_IMMOBILE_BOSSES){
  const a=g.adds.find(a=>a.kind==='chaosBoss'&&a.bossId===id)!;
  assert.deepEqual(a.pos,pos[id]);
 }
 const body=g.adds.find(a=>a.kind==='chaosBoss'&&a.bossId==='fracturer')!;
 assert.ok(dist(body.pos,pos.fracturer)>.2);
 assert.ok(dist(body.pos,pos.fracturer)<2.0,'Chaos Golem cannot sprint');
 assert.ok(g.arenaCuts.length>=1&&g.telegraphs.length>=0);
});
test('Duo encounter moves only its Fracturer partner at crawl speed',()=>{
 const {g,p}=game('duoTruffleFracturer');p.pos={x:7,z:-7};
 const golem=g.adds.find(a=>a.kind==='duoBoss'&&a.bossId==='fracturer')!;
 const origin={...golem.pos};
 for(let at=301;at<=10301;at+=250)g.tick(at);
 assert.ok(dist(golem.pos,origin)>.2);
 assert.ok(dist(golem.pos,origin)<2);
});
