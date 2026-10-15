import {MeshBuilder,TransformNode,StandardMaterial,Color3,ImportMeshAsync,Vector3,type AnimationGroup,type Scene} from '@babylonjs/core';
import type {HubNpc} from '../../shared/truffle';
export function createTruffle(scene:Scene){
 let clip:AnimationGroup|undefined,lastStride=-1;
 const root=new TransformNode('truffle-man',scene),visual=new TransformNode('truffle-visual',scene);visual.parent=root;
 const stem=MeshBuilder.CreateCapsule('truffle-placeholder-stem',{height:1.35,radius:.35},scene);stem.parent=visual;stem.position.y=.7;
 const cap=MeshBuilder.CreateSphere('truffle-placeholder-cap',{diameter:1.6,segments:16},scene);cap.parent=visual;cap.position.y=1.55;cap.scaling.y=.45;
 const brown=new StandardMaterial('truffle-placeholder-brown',scene);brown.diffuseColor=new Color3(.48,.22,.08);cap.material=brown;
 const cream=new StandardMaterial('truffle-placeholder-cream',scene);cream.diffuseColor=new Color3(.85,.72,.44);stem.material=cream;
 const label=document.createElement('p');label.id='truffle-status';label.textContent='Truffle Man - procedural placeholder';document.querySelector('#hub-card')!.append(label);
 // Restricted model is only served by the local development middleware. Never request it in a production build.
 if(import.meta.env.DEV&&import.meta.env.VITE_TRUFFLE_LOCAL==='true'){
  label.textContent='Truffle Man - loading local model';
  import('@babylonjs/loaders/glTF').then(()=>fetch('/__local-assets/truffle.glb',{signal:AbortSignal.timeout(10000)})).then(async response=>{
   if(!response.ok)throw Error('Local model unavailable');
   return ImportMeshAsync(new Uint8Array(await response.arrayBuffer()),scene,{pluginExtension:'.glb'});
  }).then(result=>{
   const container=new TransformNode('truffle-model',scene);container.parent=visual;
   for(const m of result.meshes)if(!m.parent)m.parent=container;
   for(const a of result.animationGroups)a.stop();
   clip=[...result.animationGroups].sort((a,b)=>(b.to-b.from)-(a.to-a.from))[0];
   if(clip){clip.start(true);clip.pause();}
   if(clip)clip.goToFrame(clip.from);
   for(const skeleton of result.skeletons)skeleton.prepare(true);
   for(const mesh of result.meshes)mesh.refreshBoundingInfo(true,true);
   root.position.setAll(0);root.rotation.setAll(0);
   root.computeWorldMatrix(true);visual.computeWorldMatrix(true);container.computeWorldMatrix(true);
   for(const mesh of result.meshes)mesh.computeWorldMatrix(true);
   const bounds=container.getHierarchyBoundingVectors(true),size=bounds.max.subtract(bounds.min),scale=Math.min(2/size.y,1.7/Math.hypot(size.x,size.z));
   if(!Number.isFinite(scale)||scale<=0){for(const m of result.meshes)m.dispose();container.dispose();throw Error('Invalid model bounds');}
   container.scaling.setAll(scale);container.position=new Vector3(-(bounds.min.x+bounds.max.x)*scale/2,-bounds.min.y*scale,-(bounds.min.z+bounds.max.z)*scale/2);
   stem.setEnabled(false);cap.setEnabled(false);
   label.textContent='Truffle Man - local model - '+(clip?'included skeletal clip':'procedural walk');root.metadata={asset:'local-model'};
  }).catch(()=>{label.textContent='Truffle Man - model unavailable - procedural placeholder';root.metadata={asset:'fallback'};});
 }
 return {update(state:HubNpc|undefined,visible:boolean){root.setEnabled(visible);label.hidden=!visible;if(!state)return;root.position.set(state.pos.x,0,state.pos.z);root.rotation.y=state.heading;if(clip&&state.stride!==lastStride){clip.goToFrame(clip.from+(state.stride%3)/3*(clip.to-clip.from));lastStride=state.stride;}visual.position.y=!clip&&state.walking?Math.abs(Math.sin(state.stride*9))*.09:0;visual.rotation.z=!clip&&state.walking?Math.sin(state.stride*9)*.055:0;label.dataset.x=String(state.pos.x);label.dataset.z=String(state.pos.z);label.dataset.walking=String(state.walking);}};
}
