import type { Snapshot, Weapon } from './protocol';
export type Material='largeCylinder'|'cylinderTube'|'sphericalBall'|'conicalTaper';
export type Gear='redtubeArmour'|'primitiveWand'|'pointyHat'|'pointyOrb';
export const RECIPES:Record<Gear,Partial<Record<Material,number>>>={redtubeArmour:{largeCylinder:3},primitiveWand:{cylinderTube:1,sphericalBall:1},pointyHat:{conicalTaper:3},pointyOrb:{conicalTaper:1,sphericalBall:1}};
export type Inventory={rewards:Record<string,Material>;crafted:number;hats:number;orbs:number;armours:number;armour:'redtubeArmour'|null;weapon:Weapon;head:'pointyHat'|null;offhand:'pointyOrb'|null};
export const emptyInventory=():Inventory=>({rewards:{},crafted:0,hats:0,orbs:0,armours:0,armour:null,weapon:null,head:null,offhand:null});
export function readInventory(raw:string|null):Inventory {
 try {
  const v=JSON.parse(raw??'null');if(!v||!v.rewards||typeof v.rewards!=='object'||Array.isArray(v.rewards))return emptyInventory();
  const result=emptyInventory();
  for(const [id,item] of Object.entries(v.rewards))if(item==='largeCylinder'||item==='cylinderTube'||item==='sphericalBall'||item==='conicalTaper')Object.defineProperty(result.rewards,id,{value:item,enumerable:true,writable:true,configurable:true});
  for(const [field,gear] of [['crafted','primitiveWand'],['hats','pointyHat'],['orbs','pointyOrb'],['armours','redtubeArmour']] as const){
   const n=Number.isSafeInteger(v[field])&&v[field]>=0?v[field]:0,c=countInventory(result);
   result[field]=Math.min(n,...Object.entries(RECIPES[gear]).map(([m,cost])=>Math.floor(c[m as Material]/cost!)));
  }
  result.armour=v.armour==='redtubeArmour'&&result.armours>0?'redtubeArmour':null;
  result.weapon=v.weapon==='primitiveWand'&&result.crafted>0?'primitiveWand':null;
  result.head=v.head==='pointyHat'&&result.hats>0?'pointyHat':null;
  result.offhand=v.offhand==='pointyOrb'&&result.orbs>0?'pointyOrb':null;return result;
 }catch{return emptyInventory()}
}
export function countInventory(v:Inventory) {
 const items=Object.values(v.rewards);return {largeCylinder:items.filter(x=>x==='largeCylinder').length-v.armours*3,redtubeArmour:v.armours,cylinderTube:items.filter(x=>x==='cylinderTube').length-v.crafted,sphericalBall:items.filter(x=>x==='sphericalBall').length-v.crafted-v.orbs,conicalTaper:items.filter(x=>x==='conicalTaper').length-v.hats*3-v.orbs,primitiveWand:v.crafted,pointyHat:v.hats,pointyOrb:v.orbs};
}
export function grantReward(v:Inventory,reward:Snapshot['reward'],playerId:string) {
 if(!reward||!reward.players.includes(playerId)||Object.hasOwn(v.rewards,reward.id))return false;
 Object.defineProperty(v.rewards,reward.id,{value:reward.material,enumerable:true,writable:true,configurable:true});return true;
}
export function craft(v:Inventory,gear:Gear='primitiveWand') {
 if(!Object.hasOwn(RECIPES,gear))return false;
 const c=countInventory(v);if(Object.entries(RECIPES[gear]).some(([m,n])=>c[m as Material]<n!))return false;
 v[gear==='primitiveWand'?'crafted':gear==='pointyHat'?'hats':gear==='redtubeArmour'?'armours':'orbs']++;return true;
}
export function equip(v:Inventory,slot:'weapon'|'head'|'offhand'|'armour',gear:Gear|null){
 const allowed={armour:'redtubeArmour',weapon:'primitiveWand',head:'pointyHat',offhand:'pointyOrb'} as const;
 if(!Object.hasOwn(allowed,slot)||gear!==null&&(gear!==allowed[slot]||countInventory(v)[gear]<1))return false;
 if(slot==='weapon')v.weapon=gear as Weapon;else if(slot==='head')v.head=gear as Inventory['head'];else if(slot==='armour')v.armour=gear as Inventory['armour'];else v.offhand=gear as Inventory['offhand'];return true;
}
export function equipWeapon(v:Inventory,weapon:Weapon){return equip(v,'weapon',weapon)}

export const GEAR_SLOTS={redtubeArmour:'armour',primitiveWand:'weapon',pointyHat:'head',pointyOrb:'offhand'} as const;
export function inventoryView(v:Inventory){const counts=countInventory(v);return {
 materials:(['largeCylinder','cylinderTube','sphericalBall','conicalTaper'] as const).map(id=>({id,count:counts[id]})),
 gear:(Object.keys(GEAR_SLOTS) as Gear[]).filter(id=>counts[id]>0).map(id=>({id,count:counts[id],slot:GEAR_SLOTS[id],equipped:v[GEAR_SLOTS[id]]===id}))
}}
