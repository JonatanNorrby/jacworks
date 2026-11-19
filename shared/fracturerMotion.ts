import type {Vec2} from './protocol';

/** Slow enough to read every telegraph. Applies in Normal, Double and Chaos. */
export const FRACTURER_CRAWL_SPEED=.16;
export const FRACTURER_STOP_DISTANCE=3.15;

export function creepFracturer(position:Vec2,target:Vec2,dt:number,corridor:number,arenaLimit:number):Vec2{
 const dx=target.x-position.x,dz=target.z-position.z,d=Math.hypot(dx,dz);
 if(!Number.isFinite(d)||d<=FRACTURER_STOP_DISTANCE||dt<=0)return {...position};
 const step=Math.min(FRACTURER_CRAWL_SPEED*Math.min(dt,.25),d-FRACTURER_STOP_DISTANCE);
 let x=position.x+dx/d*step,z=position.z+dz/d*step;
 // Keep slow boss on the central cross; collapsing corners never block melee.
 if(Math.abs(x)>corridor&&Math.abs(z)>corridor){
  if(Math.abs(position.x)>=corridor&&Math.abs(position.z)<corridor)
   z=Math.sign(z)*corridor;
  else if(Math.abs(position.z)>=corridor&&Math.abs(position.x)<corridor)
   x=Math.sign(x)*corridor;
  else if(Math.abs(x)>Math.abs(z))z=Math.sign(z)*corridor;
  else x=Math.sign(x)*corridor;
 }
 const radial=Math.hypot(x,z);
 if(radial>arenaLimit-.7){const scale=(arenaLimit-.7)/radial;x*=scale;z*=scale;}
 // Geometry correction must never teleport the boss faster than its creep.
 const moved=Math.hypot(x-position.x,z-position.z);
 if(moved>step&&moved>0){x=position.x+(x-position.x)*step/moved;z=position.z+(z-position.z)*step/moved;}
 return {x,z};
}
