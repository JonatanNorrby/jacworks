/** CPU pose for the static Rune Golem mesh from DiceFree.
 * Its GLB has no skeleton, skin or animation clips, and its original FBX
 * geometry is in a straight-armed T-pose. Coordinates here are mesh-local:
 * X = arm span, negative Z = height. This is rendering only, never hitboxes.
 */
const smooth=(v:number,lo:number,hi:number)=>{
 const t=Math.max(0,Math.min(1,(v-lo)/(hi-lo)));return t*t*(3-2*t);
};
export function poseGolemVertices(base:Float32Array,out:Float32Array,time:number,moving:boolean){
 const stride=3;
 const gait=time*.003;
 for(let i=0;i<base.length;i+=stride){
   const x=base[i],y=base[i+1],z=base[i+2];
   const side=x<0?-1:1,ax=Math.abs(x);
   // Hinge each outstretched arm down from the shoulder. Blend near the
   // shoulder seam instead of tearing the single connected mesh apart.
   const arm=smooth(ax,15,27)*(1-smooth(z,-48,-44));
   const angle=-side*(.98+.025*Math.sin(time*.0014)+(moving?.10*Math.sin(gait+side*Math.PI):0));
   const shoulderX=side*18.5,shoulderZ=-58;
   const dx=x-shoulderX,dz=z-shoulderZ;
   const posedX=shoulderX+Math.cos(angle)*dx+Math.sin(angle)*dz;
   const posedZ=shoulderZ-Math.sin(angle)*dx+Math.cos(angle)*dz;
   out[i]=x+(posedX-x)*arm;
   out[i+2]=z+(posedZ-z)*arm;
   // Heavy alternating steps. With no movement, the feet stay planted.
   const leg=smooth(ax,6,12)*(1-smooth(ax,20,25))*smooth(z,-43,-5);
   const phase=Math.sin(gait+(side<0?Math.PI:0));
   out[i+1]=y+(moving?phase*2.1*leg:0);
   out[i+2]+=(moving?Math.max(0,phase)*-1.0*leg:0);
 }
 return out;
}
