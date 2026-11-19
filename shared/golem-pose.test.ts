import test from 'node:test';
import assert from 'node:assert/strict';
import {poseGolemVertices} from '../client/src/golemPose';

test('static Rune Golem arms are lowered without shifting the torso',()=>{
 const source=new Float32Array([50,0,-58,-50,0,-58,0,0,-58,15,0,-55]);
 const out=source.slice();
 poseGolemVertices(source,out,0,false);
 assert.ok(out[0]<44&&out[2]>-40,'right arm swings down toward the body');
 assert.ok(out[3]>-44&&out[5]>-40,'left arm swings down toward the body');
 assert.equal(out[6],source[6]);
 assert.equal(out[8],source[8]);
});

test('creeping Rune Golem legs alternate only while moving',()=>{
 const source=new Float32Array([14,0,-12,-14,0,-12]);
 const idle=source.slice(),moving=source.slice();
 poseGolemVertices(source,idle,850,false);
 poseGolemVertices(source,moving,850,true);
 assert.equal(idle[1],source[1]);
 assert.equal(idle[4],source[4]);
 assert.notEqual(moving[1],moving[4]);
});
