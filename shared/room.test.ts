import {test} from 'node:test';
import assert from 'node:assert/strict';
import {roomFromUrl} from './room';
test('room routing validates codes and preserves explicit identity',()=>{
 assert.equal(roomFromUrl('https://preview.test/ws?room=abcDEF-123'),'abcDEF-123');
 assert.equal(roomFromUrl('https://production.test/ws?room=abcDEF-123'),'abcDEF-123');
 for(const code of ['','short','../room','x'.repeat(65)])assert.equal(roomFromUrl('https://test/ws?room='+encodeURIComponent(code)),null);
 assert.equal(roomFromUrl('https://test/ws'),'prototype-01');
});
