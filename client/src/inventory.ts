import type { Snapshot } from '../../shared/protocol';
export type Inventory={rewards:Record<string,'cylinderTube'|'sphericalBall'>;crafted:number};
export const emptyInventory=():Inventory=>({rewards:{},crafted:0});
export function readInventory(raw:string|null):Inventory {
  try {
    const v=JSON.parse(raw??'null');if(!v||!v.rewards||typeof v.rewards!=='object'||!Number.isSafeInteger(v.crafted)||v.crafted<0)return emptyInventory();
    const rewards:Inventory['rewards']={};for(const [id,item] of Object.entries(v.rewards))if(item==='cylinderTube'||item==='sphericalBall')Object.defineProperty(rewards,id,{value:item,enumerable:true,writable:true,configurable:true});
    const result={rewards,crafted:v.crafted};const counts=countInventory({...result,crafted:0});result.crafted=Math.min(result.crafted,counts.cylinderTube,counts.sphericalBall);return result;
  }catch{return emptyInventory();}
}
export function countInventory(v:Inventory) {const items=Object.values(v.rewards);return {cylinderTube:items.filter(x=>x==='cylinderTube').length-v.crafted,sphericalBall:items.filter(x=>x==='sphericalBall').length-v.crafted,oddContraption:v.crafted};}
export function grantReward(v:Inventory,reward:Snapshot['reward'],playerId:string) {
  if(!reward||!reward.players.includes(playerId)||Object.hasOwn(v.rewards,reward.id))return false;
  v.rewards[reward.id]=reward.material;return true;
}
export function craft(v:Inventory) {const c=countInventory(v);if(c.cylinderTube<1||c.sphericalBall<1)return false;v.crafted++;return true;}
