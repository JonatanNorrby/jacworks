import {HARD_PILLARS} from './protocol';
import type {Vec2} from './protocol';
// The same radius and first intersection drive server hits and client endpoints.
export function clipPillars(from:Vec2,to:Vec2):Vec2 {
 const dx=to.x-from.x,dz=to.z-from.z,length=Math.hypot(dx,dz);if(!length)return {...from};
 let end=length;
 for(const c of HARD_PILLARS){const x=from.x-c.x,z=from.z-c.z,b=(x*dx+z*dz)/length,d=b*b-(x*x+z*z-1);if(x*x+z*z<=1){end=0;break;}if(d>=0){const hit=-b-Math.sqrt(d);if(hit>=0)end=Math.min(end,hit);}}
 return {x:from.x+dx/length*end,z:from.z+dz/length*end};
}
export function pillarOccludes(from:Vec2,to:Vec2){const end=clipPillars(from,to);return Math.hypot(end.x-from.x,end.z-from.z)<Math.hypot(to.x-from.x,to.z-from.z)-1e-8;}
