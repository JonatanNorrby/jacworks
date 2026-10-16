import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
import {CHAT_MAX_LENGTH} from './protocol';
test('chat binds identity, sanitizes, truncates and rate limits independently of gameplay',()=>{
 const messages:any[]=[];const g=new Game(m=>messages.push(m),()=> 'id');g.add('a');g.add('b');
 g.message('a',{type:'join',name:'  Alice\n  '});assert.equal(g.players.get('a')!.name,'Alice');messages.length=0;
 for(const text of [null,{},[],123,' \n\0 '])g.message('a',{type:'chat',text},0);assert.equal(messages.length,0);
 g.message('a',{type:'chat',text:'  <img src=x onerror=alert(1)>\n\0hello  ',name:'Bob',senderId:'b'},0);
 assert.deepEqual(messages[0],{type:'chat',senderId:'a',name:'Alice',text:'<img src=x onerror=alert(1)>hello'});
 g.message('a',{type:'chat',text:'blocked'},999);assert.equal(messages.length,1);
 g.message('b',{type:'chat',text:'independent'},999);assert.equal(messages.length,2);
 g.message('a',{type:'chat',text:'x'.repeat(1000)},1000);assert.equal(messages[2].text.length,CHAT_MAX_LENGTH);
 g.message('missing',{type:'chat',text:'spoof'},2000);assert.equal(messages.length,3);
 g.remove('a');assert.equal(g.chatSent.has('a'),false);
});
test('room authority isolates chat and emits lifecycle once',()=>{
 const a:any[]=[],b:any[]=[];const g=new Game(m=>a.push(m),()=> 'id'),other=new Game(m=>b.push(m),()=> 'id');g.add('a');other.add('b');
 g.message('a',{type:'join',name:'Alice'},0);g.message('a',{type:'join',name:'Alice'},0);assert.equal(a.filter(m=>m.type==='chat').length,1);
 g.message('a',{type:'chat',text:'private'},0);assert.equal(b.length,0);
 g.message('a',{type:'propose',boss:'warden'},0);g.message('a',{type:'vote',proposalId:g.vote!.id,accept:true},0);g.players.get('a')!.alive=false;g.tick(50);
 assert.ok(a.some(m=>m.text?.includes('wiped')));g.remove('a');assert.ok(a.some(m=>m.text==='Alice left the room.'));
});
