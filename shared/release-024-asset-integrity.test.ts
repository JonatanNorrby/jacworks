import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {MAGIC_FX_RECIPES} from '../client/src/magicEffects';
import {CLASS_DEFINITIONS} from './classes';
const assets=resolve(dirname(fileURLToPath(import.meta.url)),'../client/public/assets');
function glb(path:string){
 const bytes=readFileSync(resolve(assets,path));
 assert.equal(bytes.toString('ascii',0,4),'glTF');
 assert.equal(bytes.readUInt32LE(4),2);
 assert.equal(bytes.readUInt32LE(8),bytes.length);
 assert.equal(bytes.toString('ascii',16,20),'JSON');
 const content=JSON.parse(bytes.toString('utf8',20,20+bytes.readUInt32LE(12)));
 return {bytes,content};
}
test('DiceFree Mushroom Monster is a genuine lightweight, rigged and fully animated GLB',()=>{
 const {bytes,content}=glb('mushroom-monster/mushroom-monster.glb');
 assert.ok(bytes.length<200_000);
 assert.ok((content.skins??[]).length>=1);
 assert.ok((content.meshes??[]).length>=1);
 for(const action of ['idle','hop','attack01','hit','die'])
  assert.ok(content.animations.some((animation:{name:string})=>animation.name===action),action);
});
test('Converted DiceFree Rune Golem contains textured geometry suitable for web rendering',()=>{
 const {bytes,content}=glb('rune-golem/fracturer.glb');
 assert.ok(bytes.length<3_000_000,'keep this boss model within a practical browser payload');
 assert.ok((content.meshes??[]).length>=1);
 assert.ok((content.textures??[]).length>=1,'Golem should not be an untextured grey mesh');
 assert.ok((content.materials??[]).length>=1);
});
test('Every magical class ability has an explicit Hovl Magic Effects FREE treatment and usable packed sprites',()=>{
 const required=['earthShock','fireTotem','healingTotem','bulwark','heroicShield','vanish','poisonEnchant','targetedHeal','holyLight','lightningStorm','lightningShield','fireball','fireMine','lazor','arcBolt','arcSpear','pulseNova','holyNova','guard'];
 for(const skill of required){
  const fx=MAGIC_FX_RECIPES[skill as keyof typeof MAGIC_FX_RECIPES];
  assert.ok(fx?.prefab,skill+' must name source prefab');
  for(const texture of [fx!.texture,fx!.accent].filter(Boolean) as string[]){
   const path=resolve(assets,'magic-effects-free',texture+'.webp');
   assert.ok(existsSync(path),path);
   const bytes=readFileSync(path);
   assert.equal(bytes.toString('ascii',0,4),'RIFF');
   assert.equal(bytes.toString('ascii',8,12),'WEBP');
   assert.ok(statSync(path).size<=130_000,'optimize texture '+texture);
  }
 }
 for(const cls of Object.values(CLASS_DEFINITIONS))
  assert.equal(cls.skills.length,4,'class skill counts unchanged by visual-only migration');
});
