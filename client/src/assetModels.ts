import {
  LoadAssetContainerAsync,Mesh,MeshBuilder,StandardMaterial,Color3,
  TransformNode,Vector3,type Scene,type AssetContainer,type AnimationGroup,
} from '@babylonjs/core';
import {createMushroom} from './mushroom';
import type {AddState} from '../../shared/protocol';

type RiggedVisual={mesh:Mesh;update:(add:AddState,time:number)=>void;dispose:()=>void};
type Clip='idle'|'hop'|'attack01'|'hit'|'die';
const templates=new WeakMap<Scene,Map<string,Promise<AssetContainer>>>();

function template(scene:Scene,url:string):Promise<AssetContainer>{
  let map=templates.get(scene);
  if(!map){map=new Map();templates.set(scene,map);}
  let promise=map.get(url);
  if(!promise){
    promise=(async()=>{
      await import('@babylonjs/loaders/glTF');
      const response=await fetch(url,{signal:AbortSignal.timeout(10000)});
      if(!response.ok)throw Error('Model '+url+' HTTP '+response.status);
      const bytes=new Uint8Array(await response.arrayBuffer());
      if(bytes.byteLength<20||new DataView(bytes.buffer).getUint32(0,true)!==0x46546c67)
        throw Error('Invalid GLB '+url);
      const container=await LoadAssetContainerAsync(bytes,scene,{pluginExtension:'.glb'});
      container.addAllToScene();
      for(const node of container.rootNodes)node.setEnabled(false);
      for(const animation of container.animationGroups)animation.stop();
      return container;
    })();
    map.set(url,promise);
    void promise.catch(()=>map?.delete(url));
  }
  return promise;
}

/** Separate visual and deterministic server authority: clients never choose hitboxes or AI. */
function createRiggedVisual(scene:Scene,name:string,url:string,height:number,kind:'mushroom'|'fracturer'):RiggedVisual{
 const mesh=new Mesh(name,scene);
 const fallback=kind==='mushroom'
   ?createMushroom(scene,name+'-placeholder',height)
   :MeshBuilder.CreateCylinder(name+'-placeholder',{diameter:2.65,height:height,tessellation:8},scene);
 fallback.parent=mesh;
 if(kind==='fracturer'){
   fallback.position.y=height/2;
   const mat=new StandardMaterial(name+'-fallback-stone',scene);
   mat.diffuseColor=new Color3(.42,.24,.58);mat.emissiveColor=new Color3(.12,.04,.2);
   fallback.material=mat;
 }
 let disposed=false,lastPosition:{x:number;z:number}|undefined,lastAttackAt=0,lastHp=Infinity;
 let groups:AnimationGroup[]=[];
 let active:Clip|undefined;
 let holder:TransformNode|undefined,restingY=0;
 const play=(clip:Clip)=>{
   const group=groups.find(a=>a.name.toLowerCase()===clip.toLowerCase());
   if(!group||active===clip)return;
   for(const entry of groups)entry.stop();
   group.start(clip==='idle'||clip==='hop');
   active=clip;
 };
 void template(scene,url).then(container=>{
   if(disposed||mesh.isDisposed())return;
   const instance=container.instantiateModelsToScene(nodeName=>name+'-'+nodeName,false,{doNotInstantiate:true});
   if(disposed){instance.dispose();return;}
   const visual=new TransformNode(name+'-model',scene);
   visual.parent=mesh;
   for(const root of instance.rootNodes){root.parent=visual;root.setEnabled(true);}
   visual.computeWorldMatrix(true);
   for(const root of instance.rootNodes)root.computeWorldMatrix(true);
   const bounds=visual.getHierarchyBoundingVectors(true);
   const size=bounds.max.subtract(bounds.min),scale=height/Math.max(.001,size.y);
   if(!Number.isFinite(scale)||scale>100||scale<.001){instance.dispose();visual.dispose();throw Error('Model scaling out of range');}
   visual.scaling.setAll(scale);
   // Bounds are measured before scaling; put the lowest model vertex on the floor.
   visual.position.set(-(bounds.min.x+bounds.max.x)*scale/2,-bounds.min.y*scale,-(bounds.min.z+bounds.max.z)*scale/2);
   groups=instance.animationGroups;holder=visual;restingY=visual.position.y;
   fallback.setEnabled(false);
   if(kind==='mushroom')play('idle');
   mesh.metadata={...mesh.metadata,modelSource:url,modelReady:true};
 }).catch(error=>{
   // In case a model cannot load, keep the original playable procedural fallback.
   mesh.metadata={...mesh.metadata,modelSource:url,modelReady:false,modelError:String(error)};
 });
 const update=(add:AddState,time:number)=>{
   if(kind==='fracturer'){
     if(holder)holder.position.y=restingY+Math.sin(time*.0013)*.018;
     return;
   }
   if(!groups.length)return;
   const moved=!!lastPosition&&Math.hypot(add.pos.x-lastPosition.x,add.pos.z-lastPosition.z)>.03;
   const attacked=lastAttackAt>0&&add.attackAt!==lastAttackAt&&add.attackAt>time;
   const hit=add.hp<lastHp;
   lastPosition={...add.pos};lastAttackAt=add.attackAt;lastHp=add.hp;
   const next:Clip=hit?'hit':attacked?'attack01':moved?'hop':'idle';
   // Short one-shot reactions naturally return to locomotion/idle afterwards.
   if(next==='hit'||next==='attack01'){
     play(next);
     const action=groups.find(group=>group.name.toLowerCase()===next);
     action?.onAnimationGroupEndObservable.addOnce(()=>{active=undefined;play(moved?'hop':'idle');});
   }else if(active!=='hit'&&active!=='attack01')play(next);
 };
 return {mesh,update,dispose:()=>{disposed=true;for(const group of groups)group.stop();mesh.dispose(false,false);}};
}
export function createTruffleSummon(scene:Scene,name:string){
 return createRiggedVisual(scene,name,'/assets/mushroom-monster/mushroom-monster.glb',1.28,'mushroom');
}
export function createFracturerVisual(scene:Scene,name:string){
 return createRiggedVisual(scene,name,'/assets/rune-golem/fracturer.glb',3,'fracturer');
}
