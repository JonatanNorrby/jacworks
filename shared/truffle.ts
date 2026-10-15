import type {Vec2} from './protocol';
export const TRUFFLE_RADIUS=.85;
export const PLAYER_RADIUS=.48;
export type HubNpc={pos:Vec2;heading:number;walking:boolean;stride:number};
// West lawn: clear of ruins, spawn, gates and interaction stations.
const route:Vec2[]=[{x:-8,z:-2},{x:-5,z:-2},{x:-5,z:0},{x:-8,z:0}];
const dist=(a:Vec2,b:Vec2)=>Math.hypot(a.x-b.x,a.z-b.z);
export class TrufflePatrol {
 state:HubNpc={pos:{...route[0]},heading:Math.PI/2,walking:false,stride:0};
 private target=1;
 tick(dt:number,players:Vec2[]){
  const s=this.state;s.walking=false;
  // Bounded substeps, so the NPC also cannot pass through a stationary player.
  let left=Math.max(0,Math.min(.25,dt))*.8;
  while(left>1e-8){const goal=route[this.target],d=dist(s.pos,goal);if(d<1e-6){this.target=(this.target+1)%route.length;continue;}
   const step=Math.min(.04,left,d),dx=(goal.x-s.pos.x)/d,dz=(goal.z-s.pos.z)/d;
   const next={x:s.pos.x+dx*step,z:s.pos.z+dz*step};s.heading=Math.atan2(dx,dz);
   if(players.some(p=>dist(p,next)<TRUFFLE_RADIUS+PLAYER_RADIUS+.015))break;
   s.pos=next;s.walking=true;s.stride+=step;left-=step;
  }
 }
}
export function moveHubPlayer(pos:Vec2,delta:Vec2,npc:Vec2):Vec2 {
 let p={...pos};const steps=Math.max(1,Math.ceil(Math.hypot(delta.x,delta.z)/.04)),radius=TRUFFLE_RADIUS+PLAYER_RADIUS;
 for(let i=0;i<steps;i++){
  const next={x:Math.max(-11.5,Math.min(11.5,p.x+delta.x/steps)),z:Math.max(-9.5,Math.min(9.5,p.z+delta.z/steps))};
  // Stop at contact; never project a player to the opposite side of the NPC.
  if(dist(next,npc)>=radius)p=next;
 }
 return p;
}
