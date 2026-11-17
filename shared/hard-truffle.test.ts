import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
import {BOSS_PEDESTALS} from './boss-layout';
import {HARD_TRUFFLE_POISON} from './trufflePoison';

test('Hard Truffle Man is selectable at a Hard pedestal',()=>{
 const pedestal=BOSS_PEDESTALS.find(b=>b.id==='hardGreenCone');
 assert.equal(pedestal?.difficulty,'Hard');
 let seq=0;const g=new Game(()=>{},()=>String(++seq));g.add('player');
 g.message('player',{type:'propose',boss:'hardGreenCone'},100);
 assert.equal(g.vote?.boss,'hardGreenCone');
 g.message('player',{type:'vote',proposalId:g.vote!.id,accept:true},100);
 assert.equal(g.boss.id,'hardGreenCone');
 assert.equal(g.boss.maxHp,3000);
 assert.equal(g.phase,'fight');
 assert.equal(g.poison.nextMarkAt,100+HARD_TRUFFLE_POISON.firstMark);
});
test('Hard Truffle Man poison differs from normal without changing normal tuning',()=>{
 let seq=0;const g=new Game(()=>{},()=>String(++seq));const p=g.add('player');
 g.message('player',{type:'propose',boss:'hardGreenCone'},100);
 g.message('player',{type:'vote',proposalId:g.vote!.id,accept:true},100);
 g.next=Infinity;p.pos={x:10,z:10};
 const mark=g.tick(4100).poisonMark!;
 assert.equal(mark.detonatesAt,4100+HARD_TRUFFLE_POISON.markDelay);
 const cloud=g.tick(mark.detonatesAt).poisonClouds![0];
 assert.equal(cloud.radius,HARD_TRUFFLE_POISON.radius);
 assert.equal(cloud.activeAt,mark.detonatesAt+HARD_TRUFFLE_POISON.grace);
});
