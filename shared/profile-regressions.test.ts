import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';

test('profile is not authoritative until the first browser join is applied',()=>{
 const g=new Game(()=>{},()=> 'id',true),player=g.add('a');
 const before=g.tick(100).players.find(p=>p.id==='a')!;
 assert.equal(before.profileLoaded,false);
 assert.equal(before.classId,'lightningMage');
 assert.deepEqual(before.talents?.wins,[]);
 const save={wins:['warden','yellowBall'],picks:{ranger:['unyieldingForce']}};
 g.message('a',{type:'join',classId:'ranger',talents:save},110);
 const after=g.tick(150).players.find(p=>p.id==='a')!;
 assert.equal(after.profileLoaded,true);
 assert.equal(after.classId,'ranger');
 assert.deepEqual(after.talents?.wins,save.wins);
 g.message('a',{type:'join',classId:'shaman',talents:{wins:[],picks:{}}},200);
 assert.equal(player.classId,'shaman');
 assert.deepEqual(player.talents?.wins,save.wins,'loadout/class sync never resets first-clear points');
});

test('class switching works in the lobby even after accepting a pending encounter vote',()=>{
 const g=new Game(()=>{},()=> 'id',true);
 const a=g.add('a');g.add('b');
 g.message('a',{type:'join',classId:'lightningMage'},100);
 g.message('b',{type:'join',classId:'ranger'},100);
 g.message('a',{type:'propose',boss:'warden'},200);
 assert.ok(g.vote);
 g.message('a',{type:'vote',proposalId:g.vote.id,accept:true},220);
 assert.equal(g.phase,'lobby');
 g.message('a',{type:'join',classId:'rogue'},230);
 assert.equal(a.classId,'rogue');
 assert.equal(g.tick(250).players.find(p=>p.id==='a')?.profileLoaded,true);
});
