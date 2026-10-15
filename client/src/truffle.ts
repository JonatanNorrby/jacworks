import {createMushroom} from './mushroom';
import {TransformNode,LoadAssetContainerAsync,Vector3,type AssetContainer,type Scene} from '@babylonjs/core';
import {createTruffleWalk} from './truffle-walk';
import type {HubNpc} from '../../shared/truffle';
export function createTruffle(scene:Scene,options:{boss?:boolean}={}){
 let loaded:AssetContainer|undefined;
 let walk:ReturnType<typeof createTruffleWalk>,lastTime=performance.now(),displayStride:number|undefined;
 const root=new TransformNode('truffle-man',scene),visual=new TransformNode('truffle-visual',scene);visual.parent=root;
 const placeholder=createMushroom(scene,'truffle-placeholder',options.boss?3.82:1.91);placeholder.parent=visual;
 const label=document.createElement('p');label.id=options.boss?'truffle-boss-status':'truffle-status';label.textContent='Truffle Man - procedural placeholder';label.style.display='none';document.body.append(label);
 // Ship the self-contained licensed asset in both development and production.
 {
  label.textContent='Truffle Man - loading model';
  import('@babylonjs/loaders/glTF').then(()=>fetch('/assets/truffle-man/truffle.glb',{signal:AbortSignal.timeout(10000)})).then(async response=>{
   if(!response.ok)throw Error('Model unavailable');
   const bytes=await response.arrayBuffer(),header=new DataView(bytes);
   if(bytes.byteLength<12||header.getUint32(0,true)!==0x46546c67||header.getUint32(4,true)!==2||header.getUint32(8,true)!==bytes.byteLength)throw Error('Invalid GLB');
   return LoadAssetContainerAsync(new Uint8Array(bytes),scene,{pluginExtension:'.glb'});
  }).then(result=>{
   loaded=result;result.addAllToScene();
   const container=new TransformNode('truffle-model',scene);container.parent=visual;
   for(const m of result.meshes)if(!m.parent)m.parent=container;
   for(const a of result.animationGroups)a.stop();
   const clip=[...result.animationGroups].sort((a,b)=>(b.to-b.from)-(a.to-a.from))[0];
   if(clip){clip.start(true);clip.pause();}
   if(clip){clip.goToFrame(clip.from);clip.stop();}
   for(const skeleton of result.skeletons)skeleton.prepare(true);
   for(const mesh of result.meshes)mesh.refreshBoundingInfo(true,true);
   const previousPosition=root.position.clone(),previousRotation=root.rotation.clone();
   root.position.setAll(0);root.rotation.setAll(0);
   root.computeWorldMatrix(true);visual.computeWorldMatrix(true);container.computeWorldMatrix(true);
   for(const mesh of result.meshes)mesh.computeWorldMatrix(true);
   const bounds=container.getHierarchyBoundingVectors(true),size=bounds.max.subtract(bounds.min),scale=Math.min((options.boss?6.8:2)/size.y,(options.boss?5:1.7)/Math.hypot(size.x,size.z));
   if(!Number.isFinite(scale)||scale<=0){for(const m of result.meshes)m.dispose();container.dispose();throw Error('Invalid model bounds');}
   container.scaling.setAll(scale);container.position=new Vector3(-(bounds.min.x+bounds.max.x)*scale/2,-bounds.min.y*scale,-(bounds.min.z+bounds.max.z)*scale/2);
   container.computeWorldMatrix(true);
   for(const node of result.transformNodes)node.computeWorldMatrix(true);
   walk=createTruffleWalk(root,result.transformNodes);
   label.dataset.rig=walk?'skeletal':'unsupported';
   root.position.copyFrom(previousPosition);root.rotation.copyFrom(previousRotation);
   placeholder.setEnabled(false);
   label.textContent='Truffle Man - '+(walk?'procedural skeletal walk':'rig unsupported - static idle');root.metadata={asset:'public-model'};
   const credit=document.createElement('a');credit.href='https://sketchfab.com/3d-models/truffle-man-e41c6781e4854a1fbe5cdf24a0029aab';credit.textContent=' - dotflare / CC BY 4.0 (Sketchfab)';label.append(credit);
  }).catch(()=>{loaded?.dispose();walk=undefined;placeholder.setEnabled(true);label.textContent='Truffle Man - model unavailable - procedural placeholder';root.metadata={asset:'fallback'};});
 }
 return {update(state:HubNpc|undefined,visible:boolean,smash?:import('../../shared/protocol').Snapshot['boss']['smash'],attackNow=0){
  const now=performance.now(),dt=Math.min(.1,(now-lastTime)/1000);lastTime=now;
  root.setEnabled(visible);label.hidden=!visible;if(!state)return;
  // Interpolate position and travelled distance together, keeping stance feet
  // stationary between server snapshots. Snap when stopped or newly visible.
  const alpha=1-Math.exp(-dt*25);
  if(displayStride===undefined||!state.walking||!visible){root.position.set(state.pos.x,0,state.pos.z);displayStride=state.stride;}
  else {root.position.x+=(state.pos.x-root.position.x)*alpha;root.position.z+=(state.pos.z-root.position.z)*alpha;displayStride+=(state.stride-displayStride)*alpha;}
  root.rotation.y=state.heading;root.computeWorldMatrix(true);
  walk?.apply(displayStride,state.walking,options.boss?smash:undefined,attackNow);
  if(walk)label.dataset.leftFootY=String(walk.leftFootY());
  visual.position.y=!walk&&state.walking?Math.abs(Math.sin(displayStride*9))*.09:0;
  visual.rotation.z=!walk&&state.walking?Math.sin(displayStride*9)*.055:0;
  label.dataset.x=String(state.pos.x);label.dataset.z=String(state.pos.z);label.dataset.walking=String(state.walking);
 }};
}
