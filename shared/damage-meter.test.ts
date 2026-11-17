import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
test('server damage meter counts actual damage and never counts overkill',()=>{
 let n=0;const g=new Game(()=>{},()=>String(++n));g.add('alice');g.add('bob');
 g.message('alice',{type:'propose',boss:'warden'},100);
 const proposal=g.vote!.id;
 g.message('alice',{type:'vote',proposalId:proposal,accept:true},100);
 g.message('bob',{type:'vote',proposalId:proposal,accept:true},100);
 assert.equal(g.phase,'fight');
 g.damageTarget('boss',70,'alice');g.damageTarget('boss',30,'bob');
 g.damageTarget('boss',10000,'alice');
 const snapshot=g.tick(2100);
 const alice=snapshot.damageMeter!.entries.find(e=>e.playerId==='alice')!;
 const bob=snapshot.damageMeter!.entries.find(e=>e.playerId==='bob')!;
 assert.equal(alice.damage,1770);
 assert.equal(bob.damage,30);
 assert.equal(snapshot.damageMeter!.elapsedMs,2000);
});
test('unattributed damage does not enter the player meter',()=>{
 let n=0;const g=new Game(()=>{},()=>String(++n));g.add('alice');
 g.message('alice',{type:'propose',boss:'warden'},100);
 g.message('alice',{type:'vote',proposalId:g.vote!.id,accept:true},100);
 g.damageTarget('boss',20);
 assert.deepEqual(g.tick(200).damageMeter!.entries,[]);
 g.reset();assert.deepEqual(g.damageTotals.size,0);
});
