import {Color3,MeshBuilder,StandardMaterial,type Mesh,type Scene} from '@babylonjs/core';
import type {Snapshot} from '../../shared/protocol';
export function createTrufflePoisonVisuals(scene:Scene){
 const meshes=new Map<string,Mesh>();
 const mat=(name:string,color:Color3,alpha=1)=>{const m=new StandardMaterial(name,scene);m.diffuseColor=color;m.emissiveColor=color.scale(.55);m.alpha=alpha;return m;};
 const warning=mat('poison-warning',new Color3(.9,.25,1)),active=mat('poison-active',new Color3(.4,.85,.05),.38),safe=mat('poison-grace',new Color3(.8,.4,1),.25);
 const banner=document.createElement('div');banner.id='poison-status';banner.setAttribute('role','status');banner.style.cssText='position:fixed;top:100px;left:50%;transform:translateX(-50%);padding:10px 18px;background:#24102feb;color:#f3caff;border:2px solid #db65ff;border-radius:8px;pointer-events:none;font:bold 18px sans-serif;z-index:15';banner.hidden=true;document.body.append(banner);
 function clear(){for(const mesh of meshes.values())mesh.dispose();meshes.clear();banner.hidden=true;banner.textContent='';}
 return {clear,sync(state:Snapshot|undefined,visible:boolean,myId:string,now:number){
  if(!visible||!state||state.phase!=='fight'||state.boss.id!=='greenCone'){clear();return;}
  const ids=new Set<string>(),mark=state.poisonMark;
  if(mark&&now<mark.detonatesAt){
   const player=state.players.find(p=>p.id===mark.playerId&&p.alive);
   if(player){
    ids.add('mark');let ring=meshes.get('mark');if(!ring){ring=MeshBuilder.CreateTorus('poison-mark',{diameter:1.6,thickness:.14,tessellation:48},scene);ring.material=warning;const beacon=MeshBuilder.CreateCylinder('poison-mark-beacon',{height:.7,diameterTop:0,diameterBottom:.4,tessellation:4},scene);beacon.parent=ring;beacon.position.y=2.8;beacon.material=warning;meshes.set('mark',ring);}ring.position.set(player.pos.x,.12,player.pos.z);
    banner.hidden=false;banner.textContent=`${player.id===myId?'YOU':player.name}: POISON in ${(Math.max(0,mark.detonatesAt-now)/1000).toFixed(1)}s - move away, then leave the cloud!`;
   }
  }else {banner.hidden=true;banner.textContent='';}
  for(const c of state.poisonClouds??[]){
   if(now>=c.expiresAt)continue;ids.add(c.id);let cloud=meshes.get(c.id);
   if(!cloud){cloud=MeshBuilder.CreateCylinder('poison-cloud-'+c.id,{diameter:c.radius*2,height:.035,tessellation:64},scene);const edge=MeshBuilder.CreateTorus('poison-radius',{diameter:c.radius*2,thickness:.1,tessellation:64},scene);edge.parent=cloud;edge.material=warning;
    for(let i=0;i<7;i++){const puff=MeshBuilder.CreateSphere('poison-mist',{diameter:1.7,segments:12},scene);puff.parent=cloud;const angle=i*Math.PI/3;puff.position.set(i?Math.cos(angle)*c.radius*.55:0,.45,i?Math.sin(angle)*c.radius*.55:0);puff.scaling.y=.5;}
    meshes.set(c.id,cloud);
   }
   cloud.position.set(c.pos.x,.08,c.pos.z);cloud.material=now<c.activeAt?safe:active;for(const puff of cloud.getChildMeshes().filter(m=>m.name==='poison-mist'))puff.material=cloud.material;
   if(!mark){banner.hidden=false;banner.textContent=now<c.activeAt?`POISON forming - leave radius! Damage in ${((c.activeAt-now)/1000).toFixed(1)}s`:`POISON - avoid green cloud (${Math.ceil((c.expiresAt-now)/1000)}s)`;}
  }
  for(const [id,mesh] of meshes)if(!ids.has(id)){mesh.dispose();meshes.delete(id);}
 }};
}
