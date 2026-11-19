import {
  LoadAssetContainerAsync,Mesh,MeshBuilder,StandardMaterial,Color3,
  TransformNode,Vector3,VertexBuffer,type Scene,type AssetContainer,type AnimationGroup,
} from '@babylonjs/core';
import {poseGolemVertices} from './golemPose';
import {createMushroom} from './mushroom';
import type {AddState} from '../../shared/protocol';

type RiggedActor=Pick<AddState,'pos'|'hp'> & Partial<AddState>;
type RiggedVisual={mesh:Mesh;update:(add:RiggedActor,time:number)=>void;dispose:()=>void};
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
 let poseGolem:((time:number,moving:boolean)=>void)|undefined,lastPoseAt=-Infinity;
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
   if(kind==='fracturer'){
     // This asset is a single static mesh, with no rig or animation tracks.
     // Pose its arms down and animate the mesh's vertices while it creeps.
     const golem=instance.rootNodes.flatMap(root=>root instanceof TransformNode?root.getChildMeshes(false):[])
       .find((candidate):candidate is Mesh=>candidate instanceof Mesh&&candidate.getTotalVertices()>0);
     const data=golem?.getVerticesData(VertexBuffer.PositionKind);
     if(golem&&data){
       // Each active Golem needs independent geometry; otherwise modifying the
       // shared GLB template's positions could animate every clone together.
       golem.makeGeometryUnique();
       const base=Float32Array.from(data),posed=base.slice();
       golem.setVerticesData(VertexBuffer.PositionKind,posed,true);
       poseGolem=(time,moving)=>{
         poseGolemVertices(base,posed,time,moving);
         golem.updateVerticesData(VertexBuffer.PositionKind,posed,true);
       };
       poseGolem(0,false);
     }
   }
   visual.computeWorldMatrix(true);
   for(const root of instance.rootNodes)root.computeWorldMatrix(true);
   const bounds=visual.getHierarchyBoundingVectors(true);
   const size=bounds.max.subtract(bounds.min),scale=height/Math.max(.001,size.y);
   if(!Number.isFinite(scale)||scale>100||scale<.001){instance.dispose();visual.dispose();throw Error('Model scaling out of range');}
   visual.scaling.setAll(scale);
   // Imported scenes may contain translated armatures (the source Mushroom Monster
   // has a -10 X stage offset). Measure the *scaled world-space* render bounds,
   // not the unscaled armature hierarchy: the latter leaves skinned meshes far
   // away from the actual add and silently hides them inside the arena.
   visual.computeWorldMatrix(true);
   for(const root of instance.rootNodes)root.computeWorldMatrix(true);
   const world=visual.getHierarchyBoundingVectors(true);
   const anchor=mesh.getAbsolutePosition();
   visual.position.set(
     visual.position.x+anchor.x-(world.min.x+world.max.x)/2,
     visual.position.y+anchor.y-world.min.y,
     visual.position.z+anchor.z-(world.min.z+world.max.z)/2,
   );
   groups=instance.animationGroups;holder=visual;restingY=visual.position.y;
   fallback.setEnabled(false);
   if(kind==='mushroom')play('idle');
   mesh.metadata={...mesh.metadata,modelSource:url,modelReady:true};
 }).catch(error=>{
   // In case a model cannot load, keep the original playable procedural fallback.
   mesh.metadata={...mesh.metadata,modelSource:url,modelReady:false,modelError:String(error)};
 });
 const update=(add:RiggedActor,time:number)=>{
   if(kind==='fracturer'){
     const moving=!!lastPosition&&Math.hypot(add.pos.x-lastPosition.x,add.pos.z-lastPosition.z)>.0008;
     lastPosition={...add.pos};
     if(holder)holder.position.y=restingY+Math.sin(time*.0013)*.018;
     if(poseGolem&&time-lastPoseAt>=75){poseGolem(time,moving);lastPoseAt=time;}
     return;
   }
   if(!groups.length)return;
   const moved=!!lastPosition&&Math.hypot(add.pos.x-lastPosition.x,add.pos.z-lastPosition.z)>.03;
   const attackAt=add.attackAt??0;
   const attacked=lastAttackAt>0&&attackAt!==lastAttackAt&&attackAt>time;
   const hit=Number.isFinite(lastHp)&&add.hp<lastHp;
   lastPosition={...add.pos};lastAttackAt=attackAt;lastHp=add.hp;
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
