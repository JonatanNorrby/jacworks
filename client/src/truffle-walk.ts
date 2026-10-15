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
 const arms=['L','R'].map(side=>({upper:find('Arm1.'+side)!,lower:find('Arm2.'+side)!,hand:find('IKHand.'+side)!}));
 const chest=find('Sprine02')!;
 const animated=[spine,chest,...arms.flatMap(a=>[a.upper,a.lower,a.hand]),...legs.flatMap(l=>[l.hip!,l.shin!,l.foot!])];
 if(animated.some(n=>!n))return undefined;
 const rest=animated.map(node=>({node,p:node.position.clone(),q:node.rotationQuaternion?.clone()}));
 root.computeWorldMatrix(true);
 const local=(n:TransformNode)=>Vector3.TransformCoordinates(n.getAbsolutePosition(),Matrix.Invert(root.computeWorldMatrix(true)));
 const chains=legs.map(l=>{
  const hip=l.hip!,shin=l.shin!,end=l.end!,foot=l.foot!;
  for(const n of [hip,shin,end,foot])n.computeWorldMatrix(true);
  const ankle=local(foot),toe=local(end),knee=local(shin),h=local(hip);
  return {hip,shin,end,foot,ankle,toe,neutralZ:h.z,upper:Vector3.Distance(h,knee),lower:Vector3.Distance(knee,toe)};
 });
 const armChains=arms.map(a=>{
  for(const n of [a.upper,a.lower,a.hand])n.computeWorldMatrix(true);
  const end=new TransformNode('smash-wrist-end',root.getScene());end.parent=a.lower;
  end.setAbsolutePosition(a.hand.getAbsolutePosition());
  return {...a,end,upperLength:Vector3.Distance(local(a.upper),local(a.lower)),lowerLength:Vector3.Distance(local(a.lower),local(a.hand)),restHand:local(a.hand)};
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
 return {leftFootY(){const foot=chains[0].foot;foot.computeWorldMatrix(true);return foot.getAbsolutePosition().y;},apply(distance:number,moving:boolean,smash?:{startedAt:number;impactAt:number;recoverAt:number;impacted?:boolean},now=0){
  // Reset to the sampled source idle pose, never accumulate quaternion deltas.
  for(const r of rest){r.node.position.copyFrom(r.p);if(r.q)r.node.rotationQuaternion!.copyFrom(r.q);}
  const active=!!smash&&now>=smash.startedAt&&now<smash.recoverAt;
  if(!moving&&!active)return;
  let crouch=0,pitch=0,raise=0,hit=0,weight=0;
  if(active&&smash){
   const smooth=(v:number)=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v)};
   const progress=(now-smash.startedAt)/(smash.impactAt-smash.startedAt);
   raise=smooth(progress/.72);hit=smooth((progress-.78)/.22);
   // Hold just above contact until the authoritative damage snapshot arrives.
   if(!smash.impacted)hit=Math.min(hit,.94);
   const recovery=smash.impacted?smooth((now-smash.impactAt)/(smash.recoverAt-smash.impactAt)):0;
   weight=1-recovery;crouch=(.12*raise+.32*hit)*weight;pitch=(-.22*raise+1.32*hit)*weight;
   spine.computeWorldMatrix(true);spine.setAbsolutePosition(spine.getAbsolutePosition().add(new Vector3(0,-crouch,0)));
   const parent=chest.parent as TransformNode;
   const axis=Vector3.TransformNormal(Vector3.TransformNormal(new Vector3(1,0,0),root.computeWorldMatrix(true)),Matrix.Invert(parent.computeWorldMatrix(true))).normalize();
   chest.rotationQuaternion=Quaternion.RotationAxis(axis,pitch).multiply(chest.rotationQuaternion!);
  }
  const phase=distance/WALK_DISTANCE*2*Math.PI;
  // Body motion is on the spine, not the model root, so planted feet stay down.
  if(moving&&!active){
   spine.computeWorldMatrix(true);
   const world=spine.getAbsolutePosition().add(new Vector3(0,-.07+.018*(1-Math.cos(phase*2)),0));
   spine.setAbsolutePosition(world);
   spine.rotationQuaternion=spine.rotationQuaternion!.multiply(Quaternion.RotationAxis(new Vector3(0,0,1),.025*Math.sin(phase)));
  }
  root.computeWorldMatrix(true);
  chains.forEach((c,i)=>{
   const step=moving&&!active?footStep(distance,i*.5):{forward:0,lift:0};
   const offset=new Vector3(0,step.lift,step.forward+(moving&&!active?c.neutralZ-c.toe.z:0));
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
  if(active){
   const world=root.computeWorldMatrix(true);
   for(const [i,a] of armChains.entries()){
    // Both fists rise over the cap, then drive forward and down. The hands
    // have independent controls in this rig: solve the deforming arm to them.
    const overhead=new Vector3(i===0?-.43:.43,2.65,-.12);
    const contact=new Vector3(i===0?-.5:.5,.12,1.05);
    const raised=Vector3.Lerp(a.restHand,overhead,raise);
    const desired=Vector3.Lerp(a.restHand,Vector3.Lerp(raised,contact,hit),weight);
    a.upper.computeWorldMatrix(true);const shoulder=a.upper.getAbsolutePosition();
    const delta=Vector3.TransformCoordinates(desired,world).subtract(shoulder);
    const axis=delta.normalizeToNew(),reach=Math.min(delta.length(),a.upperLength+a.lowerLength-.00001);
    const along=(a.upperLength*a.upperLength-a.lowerLength*a.lowerLength+reach*reach)/(2*reach);
    const bend=Vector3.TransformNormal(new Vector3(i===0?-1:1,0,-.4),world);
    bend.subtractInPlace(axis.scale(Vector3.Dot(bend,axis))).normalize();
    const knee=shoulder.add(axis.scale(along)).add(bend.scale(Math.sqrt(Math.max(0,a.upperLength*a.upperLength-along*along))));
    const target=shoulder.add(axis.scale(reach));
    aim(a.upper,a.lower,knee);aim(a.lower,a.end,target);a.hand.setAbsolutePosition(target);
   }
  }
 }};
}

