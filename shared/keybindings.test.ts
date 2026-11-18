import {test} from 'node:test';
import assert from 'node:assert/strict';
import {BINDING_ACTIONS,DEFAULT_BINDINGS,BINDING_LABELS,parseBindings,rebind,normalizeBinding,pressedBindingKey,allowedKey,displayKey} from './keybindings';

test('all 12 actions have unique defaults, readable labels and safe fallback',()=>{
 assert.equal(BINDING_ACTIONS.length,12);
 assert.equal(new Set(Object.values(DEFAULT_BINDINGS)).size,12);
 assert.ok(BINDING_ACTIONS.every(action=>BINDING_LABELS[action].length>2));
 for(const raw of [null,'','{','[]','null','42','true','{"forward":"escape"}','{"chat":"w"}','{"forward":123}'])
  assert.deepEqual(parseBindings(raw),DEFAULT_BINDINGS);
});
test('valid custom and swapped layouts round-trip with no duplicates',()=>{
 const custom={...DEFAULT_BINDINGS,forward:'arrowup',back:'arrowdown',left:'arrowleft',right:'arrowright',chat:'t',ability1:'5',interact:'space'};
 assert.deepEqual(parseBindings(JSON.stringify(custom)),custom);
 const swapped={...DEFAULT_BINDINGS,forward:'s',back:'w'};
 assert.deepEqual(parseBindings(JSON.stringify(swapped)),swapped);
 assert.equal(parseBindings('{"forward":"ArrowUp"}').forward,'arrowup');
});
test('rebind refuses duplicates and unsupported browser keys',()=>{
 assert.equal(rebind({...DEFAULT_BINDINGS},'forward','s').conflict,'back');
 for(const key of ['Escape','Tab','Shift','Control','Alt','Meta','Backspace','F5','F12','Unidentified','']){
  assert.equal(allowedKey(normalizeBinding(key)),false);
  assert.ok(rebind({...DEFAULT_BINDINGS},'forward',key).error);
 }
 const old={...DEFAULT_BINDINGS};
 const failed=rebind(old,'forward','e');assert.deepEqual(failed.bindings,old);assert.equal(failed.conflict,'interact');
});
test('space, arrows, letters and punctuation are supported and labeled clearly',()=>{
 assert.equal(normalizeBinding(' '),'space');assert.equal(normalizeBinding('Spacebar'),'space');
 assert.equal(normalizeBinding('ArrowUp'),'arrowup');assert.equal(normalizeBinding('T'),'t');
 for(const key of ['arrowup','arrowdown','arrowleft','arrowright','space','enter','t','5',',',';'])assert.equal(allowedKey(key),true,key);
 assert.equal(displayKey('space'),'Space');assert.equal(displayKey('arrowup'),'↑');
 assert.equal(displayKey('enter'),'Enter');assert.equal(displayKey('t'),'T');
 const changed=rebind({...DEFAULT_BINDINGS},'ability1','5');
 assert.equal(changed.bindings.ability1,'5');assert.equal(changed.conflict,null);assert.equal(changed.error,null);
});

test('Shift self-target modifier preserves digit abilities',()=>{
 assert.equal(pressedBindingKey({key:'!',code:'Digit1',shiftKey:true}),'1');
 assert.equal(pressedBindingKey({key:'T',code:'KeyT',shiftKey:true}),'t');
 assert.equal(pressedBindingKey({key:'5',code:'Digit5',shiftKey:false}),'5');
});
