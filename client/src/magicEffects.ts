import {
 Color3,Engine,Mesh,MeshBuilder,StandardMaterial,Texture,Vector3,type Scene,
} from '@babylonjs/core';
import type {SkillId} from '../../shared/protocol';

export type MagicFxMode='projectile'|'aura'|'ground'|'burst'|'beam';
export type MagicFxRecipe={
 prefab:string;texture:string;accent?:string;
 tint:string;mode:MagicFxMode;size:number;duration:number;
};
/** Hovl Studio Magic Effects FREE prefab inspiration, recreated with the actual
 * pack's particle sprites in Babylon.js. Unity prefab/particle scripts cannot run on the web.
 * Each entry has a different color/shape/timing and a source prefab for review.
 */
export const MAGIC_FX_RECIPES:Partial<Record<SkillId,MagicFxRecipe>>={
 earthShock:{prefab:'Electro hit',texture:'Electro',accent:'FlashFree2',tint:'#64CAFF',mode:'burst',size:1.3,duration:350},
 fireTotem:{prefab:'Explosion',texture:'ProjectileFree1',accent:'GlowFree1',tint:'#FF7B28',mode:'projectile',size:.95,duration:480},
 healingTotem:{prefab:'Healing circle',texture:'MagicCircle2',accent:'GlowFree1',tint:'#5AFB9B',mode:'ground',size:7.8,duration:680},
 bulwark:{prefab:'Magic shield blue',texture:'MagicCircle2',accent:'GlowFree1',tint:'#68CFFF',mode:'aura',size:2.4,duration:650},
 heroicShield:{prefab:'Magic shield blue',texture:'MagicCircle2',accent:'Flare',tint:'#87DDFF',mode:'aura',size:2.6,duration:580},
 vanish:{prefab:'Smoke puff',texture:'SmokeFree1',accent:'GlowFree1',tint:'#8E76D9',mode:'aura',size:2,duration:470},
 poisonEnchant:{prefab:'Green hit',texture:'SmokeFree1',accent:'TechCircle',tint:'#66DF58',mode:'aura',size:2,duration:600},
 targetedHeal:{prefab:'Healing',texture:'Flare',accent:'MagicCircle2',tint:'#76FFBE',mode:'projectile',size:1.4,duration:520},
 holyLight:{prefab:'Holy hit',texture:'Flare',accent:'GlowFree1',tint:'#FFEB92',mode:'projectile',size:1.2,duration:440},
 lightningStorm:{prefab:'Lightning aura',texture:'Electro',accent:'TechCircle',tint:'#63D6FF',mode:'ground',size:6,duration:750},
 lightningShield:{prefab:'Magic shield blue',texture:'Electro',accent:'MagicCircle2',tint:'#76DBFF',mode:'aura',size:3.6,duration:650},
 fireball:{prefab:'Explosion',texture:'ProjectileFree1',accent:'GlowFree1',tint:'#FF6628',mode:'projectile',size:1.8,duration:650},
 fireMine:{prefab:'Ground AOE explosion',texture:'Crack',accent:'GlowFree1',tint:'#FF5D39',mode:'ground',size:3,duration:580},
 lazor:{prefab:'Laser AOE',texture:'FlashFree2',accent:'Electro',tint:'#FF8A43',mode:'beam',size:1,duration:490},
 arcBolt:{prefab:'Electro hit',texture:'Electro',accent:'Flare',tint:'#65CDFF',mode:'projectile',size:.95,duration:400},
 arcSpear:{prefab:'Electro slash',texture:'Electro',accent:'ProjectileFree1',tint:'#93ECFF',mode:'projectile',size:1.5,duration:440},
 pulseNova:{prefab:'Holy hit',texture:'MagicCircle2',accent:'GlowFree1',tint:'#EBBEFF',mode:'burst',size:5.2,duration:590},
 holyNova:{prefab:'Healing circle',texture:'MagicCircle2',accent:'Flare',tint:'#FFE79A',mode:'burst',size:8.5,duration:620},
 guard:{prefab:'Buff',texture:'MagicCircle2',accent:'GlowFree1',tint:'#A6F2FF',mode:'aura',size:2.1,duration:600},
 arrowRain:{prefab:'AoE slash blue',texture:'Slash',accent:'TechCircle',tint:'#B6FFD4',mode:'ground',size:5.5,duration:570},
 splitShot:{prefab:'AoE slash blue',texture:'Slash',accent:'Flare',tint:'#D2FFDC',mode:'burst',size:3.0,duration:360},
};
const materialCache=new WeakMap<Scene,Map<string,StandardMaterial>>();
function spriteMaterial(scene:Scene,asset:string,tint:string){
 let map=materialCache.get(scene);
 if(!map){map=new Map();materialCache.set(scene,map);}
 const key=asset+':'+tint;let mat=map.get(key);
 if(!mat){
  const tex=new Texture('/assets/magic-effects-free/'+asset+'.webp',scene,false,true,Texture.TRILINEAR_SAMPLINGMODE);
  tex.hasAlpha=true;
  mat=new StandardMaterial('hovl-'+key,scene);
  mat.diffuseTexture=tex;
  mat.emissiveTexture=tex;
  mat.diffuseColor=Color3.FromHexString(tint);
  mat.emissiveColor=Color3.FromHexString(tint);
  mat.useAlphaFromDiffuseTexture=true;
  mat.alphaMode=Engine.ALPHA_ADD;
  mat.alpha=.85;
  mat.disableLighting=true;
  mat.disableDepthWrite=true;
  mat.backFaceCulling=false;
  map.set(key,mat);
 }
 return mat;
}
function plane(scene:Scene,parent:Mesh,name:string,asset:string,tint:string,size:number,ground:boolean){
 const p=MeshBuilder.CreatePlane(name,{size},scene);
 p.parent=parent;p.material=spriteMaterial(scene,asset,tint);
 if(ground){p.rotation.x=Math.PI/2;p.position.y=-.92;}
 else {p.billboardMode=Mesh.BILLBOARDMODE_ALL;p.position.y=0;}
 p.isPickable=false;return p;
}
export function magicEffect(scene:Scene,skill:SkillId,from:Vector3,to:Vector3):
 {mesh:Mesh;duration:number;kind:number;start:Vector3;end:Vector3}|undefined{
 const recipe=MAGIC_FX_RECIPES[skill];if(!recipe)return;
 const root=new Mesh('hovl-magic-'+skill,scene);
 root.metadata={source:'Magic Effects FREE',prefab:recipe.prefab,skill};
 root.isPickable=false;
 const start=from.clone(),end=to.clone();
 const ground=recipe.mode==='ground'||recipe.mode==='burst';
 const primary=plane(scene,root,'hovl-'+skill+'-sprite',recipe.texture,recipe.tint,recipe.size,ground);
 if(recipe.accent) {
  const secondary=plane(scene,root,'hovl-'+skill+'-accent',recipe.accent,recipe.tint,
   recipe.size*(ground?.58:.75),ground);
  if(ground)secondary.position.y=-.9;
  else secondary.position.y=.04;
 }
 let kind=4;
 if(recipe.mode==='projectile')kind=1;
 else if(recipe.mode==='burst')kind=3;
 else if(recipe.mode==='aura')kind=2;
 if(recipe.mode==='beam'){
  // Preserve a readable directional beam while replacing its old solid box
  // with transparent particles from the actual VFX pack.
  const distance=Vector3.Distance(from,to);
  root.position.copyFrom(Vector3.Center(from,to));
  const beam=MeshBuilder.CreatePlane('hovl-laser-streak',{width:.75,height:Math.max(.25,distance)},scene);
  beam.parent=root;beam.rotation.x=Math.PI/2;
  beam.rotation.y=Math.atan2(to.x-from.x,to.z-from.z);
  beam.material=spriteMaterial(scene,'FlashFree2',recipe.tint);
  beam.isPickable=false;
  primary.isVisible=false;
  for(const child of root.getChildMeshes())if(child.name.endsWith('-accent'))child.scaling.setAll(.45);
 }else {
  root.position.copyFrom(recipe.mode==='projectile'?start:recipe.mode==='aura'&&skill!=='lightningShield'&&skill!=='heroicShield'?start:end);
 }
 return {mesh:root,duration:recipe.duration,kind,start:kind===1?start:(recipe.mode==='aura'?start:end),end:kind===1?end:start};
}
export function magicDecal(scene:Scene,name:string,asset:string,tint:string,radius:number){
 const mesh=MeshBuilder.CreatePlane(name,{size:radius*2},scene);
 mesh.material=spriteMaterial(scene,asset,tint);
 mesh.rotation.x=Math.PI/2;
 mesh.isPickable=false;return mesh;
}
