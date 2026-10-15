import type {PoisonCloud,PoisonMark,PlayerState} from './protocol';
export const TRUFFLE_POISON={markDelay:5000,grace:1500,lifetime:10000,interval:1000,damage:8,radius:2.5,cooldown:20000,firstMark:6000} as const;
// Shared by Node and Durable Object hosts. Absolute deadlines survive late joins.
export class TrufflePoison {
 mark?:PoisonMark;
 clouds:PoisonCloud[]=[];
 nextMarkAt=0;
 private selection=0;
 start(now:number){this.clear();this.nextMarkAt=now+TRUFFLE_POISON.firstMark;}
 clear(){this.mark=undefined;this.clouds=[];this.nextMarkAt=0;this.selection=0;}
 remove(id:string){if(this.mark?.playerId===id)this.mark=undefined;}
 tick(now:number,players:PlayerState[],uuid:()=>string,hurt:(p:PlayerState,at:number,amount:number)=>void){
  const cfg=TRUFFLE_POISON;
  if(this.mark){
   const player=players.find(p=>p.id===this.mark!.playerId&&p.alive);
   if(!player)this.mark=undefined;
   else if(now>=this.mark.detonatesAt){
    // A stalled host resolves on its first tick after the exact deadline.
    // Start the grace/lifetime at actual spawn so a pause never removes escape time.
    const spawnedAt=now;
    this.clouds.push({id:uuid(),pos:{...player.pos},spawnedAt,activeAt:spawnedAt+cfg.grace,expiresAt:spawnedAt+cfg.lifetime,nextTickAt:spawnedAt+cfg.grace,radius:cfg.radius});
    this.mark=undefined;
   }
  }
  // Never catch up missed damage against a player's current position after a stall.
  // At most one pulse per cloud per simulation tick, with a full interval after it.
  this.clouds=this.clouds.filter(c=>now<c.expiresAt);
  for(const cloud of this.clouds)if(now>=cloud.nextTickAt){
   for(const p of players)if(p.alive&&Math.hypot(p.pos.x-cloud.pos.x,p.pos.z-cloud.pos.z)<=cloud.radius)hurt(p,now,cfg.damage);
   cloud.nextTickAt=now+cfg.interval;
  }
  if(!this.mark&&now>=this.nextMarkAt){
   const living=players.filter(p=>p.alive);
   if(living.length){const player=living[this.selection++%living.length];this.mark={playerId:player.id,markedAt:now,detonatesAt:now+cfg.markDelay};this.nextMarkAt=now+cfg.cooldown;}
  }
 }
}
