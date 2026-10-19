import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {DEFAULT_BINDINGS,BINDING_ACTIONS,parseBindings,rebind,normalizeBinding,allowedKey,displayKey} from './keybindings';
test('defaults and corrupted browser preferences',()=>{
 assert.deepEqual(parseBindings(null),DEFAULT_BINDINGS);
 assert.deepEqual(parseBindings('{'),DEFAULT_BINDINGS);
 assert.deepEqual(parseBindings('{"forward":"escape"}'),DEFAULT_BINDINGS);
 assert.equal(BINDING_ACTIONS.length,12);
});
test('rebind rejects collisions and reserved keys',()=>{
 const conflict=rebind({...DEFAULT_BINDINGS},'forward','s');
 assert.equal(conflict.conflict,'back');
 assert.equal(conflict.bindings.forward,'w');
 assert.ok(rebind({...DEFAULT_BINDINGS},'forward','Escape').error);
 assert.ok(rebind({...DEFAULT_BINDINGS},'forward','Shift').error);
 assert.ok(!allowedKey('arrowup'));
});
test('new keys and swapped layouts survive browser persistence',()=>{
 const changed=rebind({...DEFAULT_BINDINGS},'forward','t');
 assert.equal(changed.bindings.forward,'t');
 assert.deepEqual(parseBindings(JSON.stringify(changed.bindings)),changed.bindings);
 const swapped={...DEFAULT_BINDINGS,forward:'s',back:'w'};
 assert.deepEqual(parseBindings(JSON.stringify(swapped)),swapped);
});
test('keyboard normalization and labels',()=>{
 assert.equal(normalizeBinding(' '),'space');
 assert.equal(displayKey('space'),'Space');
 assert.equal(displayKey('enter'),'Enter');
 assert.equal(displayKey('q'),'Q');
});
