import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game} from './game';
import {baseLoadout,DEFAULT_LOADOUT,SKILLS} from './protocol';
import {craft,countInventory,emptyInventory,equipWeapon,readInventory} from './inventory';
const owned=()=>readInventory(JSON.stringify({rewards:{w:'cylinderTube',y:'sphericalBall'},crafted:1}));
const room=()=>new Game(()=>{},()=> 'fight');
test('legacy contraptions migrate to unequipped wands without refunding materials',()=>{
 const inv=owned();assert.deepEqual(countInventory(inv),{cylinderTube:0,sphericalBall:0,primitiveWand:1});assert.equal(inv.weapon,null);
 assert.ok(equipWeapon(inv,'primitiveWand'));assert.equal(readInventory(JSON.stringify(inv)).weapon,'primitiveWand');
 assert.ok(equipWeapon(inv,null));assert.equal(readInventory(JSON.stringify(inv)).weapon,null);assert.equal(inv.crafted,1);
});
test('crafting multiple wands consumes each pair once and equipment requires ownership',()=>{
 const inv=emptyInventory();assert.equal(equipWeapon(inv,'primitiveWand'),false);
 inv.rewards={a:'cylinderTube',b:'cylinderTube',c:'sphericalBall',d:'sphericalBall'};
 assert.ok(craft(inv));assert.ok(craft(inv));assert.equal(craft(inv),false);assert.equal(countInventory(inv).primitiveWand,2);
 assert.ok(equipWeapon(inv,'primitiveWand'));assert.equal(countInventory(inv).primitiveWand,2);
});
test('server rejects nonexistent weapons and crafted counts unsupported by materials',()=>{
 for(const inventory of [{weapon:'primitiveWand',crafted:1,rewards:{}},{weapon:'primitiveWand',crafted:500,rewards:{w:'cylinderTube'}},{...owned(),weapon:'arcSpear'}]){
 const g=room(),p=g.add('p');g.message('p',{type:'join',inventory});assert.equal(p.weapon,null);assert.equal(p.loadout[0],'arcBolt');
 }
});
test('wand transforms Arc Blast in every slot and unequipping restores base skill',()=>{
 for(let slot=0;slot<4;slot++){
 const g=room(),p=g.add('p'),loadout=[...DEFAULT_LOADOUT];[loadout[0],loadout[slot]]=[loadout[slot],loadout[0]];
 const inv=owned();equipWeapon(inv,'primitiveWand');g.message('p',{type:'join',loadout,inventory:inv});assert.equal(p.loadout[slot],'arcSpear');
 equipWeapon(inv,null);g.message('p',{type:'join',loadout,inventory:inv});assert.equal(p.loadout[slot],'arcBolt');
 }
});
test('direct spear selection and client damage cannot bypass server equipment rules',()=>{
 const g=room(),p=g.add('p');g.message('p',{type:'join',loadout:['arcSpear','dash','pulseNova','guard'],weapon:'primitiveWand'});
 assert.equal(p.loadout[0],'arcBolt');g.message('p',{type:'ready'},100);g.message('p',{type:'ability',slot:1,skill:'arcSpear',damage:9999},200);assert.equal(g.boss.hp,1782);
 g.message('p',{type:'join',inventory:{...owned(),weapon:'primitiveWand'}},300);assert.equal(p.weapon,null);
});
test('equipped damage and cooldown are server derived; late entrant equipment is isolated',()=>{
 const g=room(),a=g.add('a');g.message('a',{type:'ready'},100);const b=g.add('b');
 g.message('b',{type:'join',inventory:{...owned(),weapon:'primitiveWand'},boss:'yellowBall'});
 assert.equal(g.boss.id,'warden');assert.equal(a.weapon,null);assert.equal(b.loadout[0],'arcSpear');
 g.message('b',{type:'ability',slot:1,damage:1},200);assert.equal(g.boss.hp,1728);assert.equal(b.cooldowns[0],200+SKILLS.arcSpear.cooldown);
 g.message('b',{type:'ability',slot:1},201);assert.equal(g.boss.hp,1728);
});
test('legacy trainer loadouts normalize spear and duplicate arc skills',()=>{
 assert.deepEqual(baseLoadout(['arcSpear','dash','pulseNova','guard']),DEFAULT_LOADOUT);
 const loadout=baseLoadout(['arcSpear','arcBolt','dash','guard']);assert.equal(loadout.includes('arcSpear'),false);assert.equal(new Set(loadout).size,4);
});
