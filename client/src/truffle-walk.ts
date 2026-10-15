import {Matrix,Quaternion,TransformNode,Vector3} from '@babylonjs/core';

// One complete left/right cycle per 0.64 metres. Stance occupies half the
// cycle: its foot retreats exactly as far as the authoritative root advances.
export const WALK_DISTANCE=.64;
export function footStep(distance:number,offset=0){
 const phase=((distance/WALK_DISTANCE+offset)%1+1)%1;
 return phase<.5?{forward:.16-phase*.64,lift:0,stance:true}:
  {forward:-.16+(phase-.5)*.64,lift:.12*Math.sin((phase-.5)*2*Math.PI),stance:false};
}

export function createTruffleWalk(root:TransformNode,nodes:TransformNode[]){
 const find=(name:string)=>nodes.find(n=>n.name===name);
 const spine=find('Sprine01');
 const legs=['L','R'].map(side=>({hip:find('Leg1.'+side),shin:find('Leg2.'+side),end:find('Leg2.'+side+'_end'),foot:find('IKLeg.'+side)}));
 if(!spine||legs.some(l=>!l.hip||!l.shin||!l.end||!l.foot))return undefined;
 const animated=[spine,...legs.flatMap(l=>[l.hip!,l.shin!,l.foot!])];
 const rest=animated.map(node=>({node,p:node.position.clone(),q:node.rotationQuaternion?.clone()}));
 root.computeWorldMatrix(true);
 const local=(n:TransformNode)=>Vector3.TransformCoordinates(n.getAbsolutePosition(),Matrix.Invert(root.computeWorldMatrix(true)));
 const chains=legs.map(l=>{
  const hip=l.hip!,shin=l.shin!,end=l.end!,foot=l.foot!;
  for(const n of [hip,shin,end,foot])n.computeWorldMatrix(true);
  const ankle=local(foot),toe=local(end),knee=local(shin),h=local(hip);
  return {hip,shin,end,foot,ankle,toe,neutralZ:h.z,upper:Vector3.Distance(h,knee),lower:Vector3.Distance(knee,toe)};
 });
 function aim(node:TransformNode,child:TransformNode,target:Vector3){
  const parent=node.parent as TransformNode;
  const inv=Matrix.Invert(parent.computeWorldMatrix(true));
  const direction=Vector3.TransformCoordinates(target,inv).subtract(node.position).normalize();
  const q=node.rotationQuaternion!;
  const current=child.position.normalizeToNew().applyRotationQuaternion(q);
  const delta=Quaternion.Identity();Quaternion.FromUnitVectorsToRef(current,direction,delta);
  node.rotationQuaternion=delta.multiply(q);node.computeWorldMatrix(true);
 }
 return {leftFootY(){const foot=chains[0].foot;foot.computeWorldMatrix(true);return foot.getAbsolutePosition().y;},apply(distance:number,moving:boolean){
  // Reset to the sampled source idle pose, never accumulate quaternion deltas.
  for(const r of rest){r.node.position.copyFrom(r.p);if(r.q)r.node.rotationQuaternion!.copyFrom(r.q);}
  if(!moving)return;
  const phase=distance/WALK_DISTANCE*2*Math.PI;
  // Body motion is on the spine, not the model root, so planted feet stay down.
  if(moving){
   spine.computeWorldMatrix(true);
   const world=spine.getAbsolutePosition().add(new Vector3(0,-.07+.018*(1-Math.cos(phase*2)),0));
   spine.setAbsolutePosition(world);
   spine.rotationQuaternion=spine.rotationQuaternion!.multiply(Quaternion.RotationAxis(new Vector3(0,0,1),.025*Math.sin(phase)));
  }
  root.computeWorldMatrix(true);
  chains.forEach((c,i)=>{
   const step=moving?footStep(distance,i*.5):{forward:0,lift:0};
   const offset=new Vector3(0,step.lift,step.forward+(moving?c.neutralZ-c.toe.z:0));
   const world=root.getWorldMatrix();
   const target=Vector3.TransformCoordinates(c.toe.add(offset),world);
   c.hip.computeWorldMatrix(true);
   const hip=c.hip.getAbsolutePosition();
   const dir=target.subtract(hip),d=dir.length(),axis=dir.normalize();
   const a=c.upper,b=c.lower,reach=Math.min(d,a+b-.00001);
   const along=(a*a-b*b+reach*reach)/(2*reach);
   const bend=Vector3.TransformNormal(new Vector3(0,0,1),world);
   bend.subtractInPlace(axis.scale(Vector3.Dot(bend,axis))).normalize();
   const knee=hip.add(axis.scale(along)).add(bend.scale(Math.sqrt(Math.max(0,a*a-along*along))));
   aim(c.hip,c.shin,knee);aim(c.shin,c.end,target);
   c.foot.setAbsolutePosition(Vector3.TransformCoordinates(c.ankle.add(offset),world));
  });
 }};
}

