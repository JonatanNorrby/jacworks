import type { Snapshot, Weapon } from './protocol';
export type Inventory={rewards:Record<string,'cylinderTube'|'sphericalBall'>;crafted:number;weapon:Weapon};
export const emptyInventory=():Inventory=>({rewards:{},crafted:0,weapon:null});
export function readInventory(raw:string|null):Inventory {
  try {
    const v=JSON.parse(raw??'null');if(!v||!v.rewards||typeof v.rewards!=='object'||!Number.isSafeInteger(v.crafted)||v.crafted<0)return emptyInventory();
    const rewards:Inventory['rewards']={};for(const [id,item] of Object.entries(v.rewards))if(item==='cylinderTube'||item==='sphericalBall')Object.defineProperty(rewards,id,{value:item,enumerable:true,writable:true,configurable:true});
    const result:Inventory={rewards,crafted:v.crafted,weapon:null};const counts=countInventory({...result,crafted:0,weapon:null});result.crafted=Math.min(result.crafted,counts.cylinderTube,counts.sphericalBall);result.weapon=v.weapon==='primitiveWand'&&result.crafted>0?'primitiveWand':null;return result;
  }catch{return emptyInventory();}
}
export function countInventory(v:Inventory) {const items=Object.values(v.rewards);return {cylinderTube:items.filter(x=>x==='cylinderTube').length-v.crafted,sphericalBall:items.filter(x=>x==='sphericalBall').length-v.crafted,primitiveWand:v.crafted};}
export function grantReward(v:Inventory,reward:Snapshot['reward'],playerId:string) {
  if(!reward||!reward.players.includes(playerId)||Object.hasOwn(v.rewards,reward.id))return false;
  v.rewards[reward.id]=reward.material;return true;
}
export function craft(v:Inventory) {const c=countInventory(v);if(c.cylinderTube<1||c.sphericalBall<1)return false;v.crafted++;return true;}

export function equipWeapon(v:Inventory,weapon:Weapon){if(weapon!==null&&(weapon!=='primitiveWand'||v.crafted<1))return false;v.weapon=weapon;return true;}
