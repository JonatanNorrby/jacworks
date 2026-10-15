import {MeshBuilder,TransformNode,StandardMaterial,Color3,ImportMeshAsync,Vector3,type Scene} from '@babylonjs/core';
import {createTruffleWalk} from './truffle-walk';
import type {HubNpc} from '../../shared/truffle';
export function createTruffle(scene:Scene){
 let walk:ReturnType<typeof createTruffleWalk>,lastTime=performance.now(),displayStride:number|undefined;
 const root=new TransformNode('truffle-man',scene),visual=new TransformNode('truffle-visual',scene);visual.parent=root;
 const stem=MeshBuilder.CreateCapsule('truffle-placeholder-stem',{height:1.35,radius:.35},scene);stem.parent=visual;stem.position.y=.7;
 const cap=MeshBuilder.CreateSphere('truffle-placeholder-cap',{diameter:1.6,segments:16},scene);cap.parent=visual;cap.position.y=1.55;cap.scaling.y=.45;
 const brown=new StandardMaterial('truffle-placeholder-brown',scene);brown.diffuseColor=new Color3(.48,.22,.08);cap.material=brown;
 const cream=new StandardMaterial('truffle-placeholder-cream',scene);cream.diffuseColor=new Color3(.85,.72,.44);stem.material=cream;
 const label=document.createElement('p');label.id='truffle-status';label.textContent='Truffle Man - procedural placeholder';document.querySelector('#hub-card')!.append(label);
 // The model is only served by the local development middleware. Never request it in a production build.
 if(import.meta.env.DEV&&import.meta.env.VITE_TRUFFLE_LOCAL==='true'){
  label.textContent='Truffle Man - loading local model';
  import('@babylonjs/loaders/glTF').then(()=>fetch('/__local-assets/truffle.glb',{signal:AbortSignal.timeout(10000)})).then(async response=>{
   if(!response.ok)throw Error('Local model unavailable');
   return ImportMeshAsync(new Uint8Array(await response.arrayBuffer()),scene,{pluginExtension:'.glb'});
  }).then(result=>{
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
   const bounds=container.getHierarchyBoundingVectors(true),size=bounds.max.subtract(bounds.min),scale=Math.min(2/size.y,1.7/Math.hypot(size.x,size.z));
   if(!Number.isFinite(scale)||scale<=0){for(const m of result.meshes)m.dispose();container.dispose();throw Error('Invalid model bounds');}
   container.scaling.setAll(scale);container.position=new Vector3(-(bounds.min.x+bounds.max.x)*scale/2,-bounds.min.y*scale,-(bounds.min.z+bounds.max.z)*scale/2);
   container.computeWorldMatrix(true);
   for(const node of result.transformNodes)node.computeWorldMatrix(true);
   walk=createTruffleWalk(root,result.transformNodes);
   root.position.copyFrom(previousPosition);root.rotation.copyFrom(previousRotation);
   stem.setEnabled(false);cap.setEnabled(false);
   label.textContent='Truffle Man - local model - '+(walk?'procedural skeletal walk':'rig unsupported - static idle');root.metadata={asset:'local-model'};
   const credit=document.createElement('a');credit.href='https://sketchfab.com/3d-models/truffle-man-e41c6781e4854a1fbe5cdf24a0029aab';credit.textContent=' - dotflare / CC Attribution (Sketchfab)';label.append(credit);
  }).catch(()=>{label.textContent='Truffle Man - model unavailable - procedural placeholder';root.metadata={asset:'fallback'};});
 }
 return {update(state:HubNpc|undefined,visible:boolean){
  const now=performance.now(),dt=Math.min(.1,(now-lastTime)/1000);lastTime=now;
  root.setEnabled(visible);label.hidden=!visible;if(!state)return;
  // Interpolate position and travelled distance together, keeping stance feet
  // stationary between server snapshots. Snap when stopped or newly visible.
  const alpha=1-Math.exp(-dt*25);
  if(displayStride===undefined||!state.walking||!visible){root.position.set(state.pos.x,0,state.pos.z);displayStride=state.stride;}
  else {root.position.x+=(state.pos.x-root.position.x)*alpha;root.position.z+=(state.pos.z-root.position.z)*alpha;displayStride+=(state.stride-displayStride)*alpha;}
  root.rotation.y=state.heading;root.computeWorldMatrix(true);
  walk?.apply(displayStride,state.walking);
  visual.position.y=!walk&&state.walking?Math.abs(Math.sin(displayStride*9))*.09:0;
  visual.rotation.z=!walk&&state.walking?Math.sin(displayStride*9)*.055:0;
  label.dataset.x=String(state.pos.x);label.dataset.z=String(state.pos.z);label.dataset.walking=String(state.walking);
 }};
}
