import type {Snapshot,Weapon} from './protocol';
import type {ClassId} from './classes';

export const SPOREBOUND_BONUS={fireDamage:30,healPerTick:10} as const;
export const SPOREFANG_BONUS={aimedShotDamage:70,arrowRainDamage:34,splitShotDamage:26} as const;
export const CLASS_ITEM_BONUS={priestHeal:55,roguePoisonTick:9,defenderBulwarkMs:8000} as const;
export type Material='largeSphere'|'largeCylinder'|'cylinderTube'|'sphericalBall'|'conicalTaper'|'hardTruffleSpore';
export const RECIPES={
 redtubeArmour:{largeCylinder:3},primitiveWand:{cylinderTube:1,sphericalBall:1},
 pointyHat:{conicalTaper:3},pointyOrb:{conicalTaper:1,sphericalBall:1},
 sporeboundTotem:{hardTruffleSpore:3},verdantMenderTotem:{hardTruffleSpore:2},
 sporefangQuiver:{largeCylinder:1,hardTruffleSpore:1},
 sporestormQuiver:{largeCylinder:1,hardTruffleSpore:1},
 splitthornQuiver:{largeCylinder:1,hardTruffleSpore:1},
 fleetfootBoots:{largeSphere:1,sphericalBall:1},mirewalkerBoots:{conicalTaper:2,hardTruffleSpore:1},
 sunlitReliquary:{largeSphere:1,conicalTaper:1},
 venomFang:{conicalTaper:1,cylinderTube:1},
 bulwarkCrest:{largeCylinder:1,sphericalBall:1}
} as const;
export type Gear=keyof typeof RECIPES;
export const GEAR_EFFECTS:Record<keyof typeof RECIPES,string>={
 redtubeArmour:'5% less boss damage and wider Sword Slash',
 primitiveWand:'Arc Blast becomes Arc Spear',
 pointyHat:'Three sequential Dash charges',
 pointyOrb:'LAZOR burn and cooldown tradeoff',
 sporeboundTotem:'Fire Totem projectiles deal 30 damage instead of 24',
 verdantMenderTotem:'Healing Totem pulses restore 10 HP instead of 8',
 sporefangQuiver:'Aimed Shot deals 70 damage instead of 58',
 sporestormQuiver:'Arrow Rain waves deal 34 damage instead of 28',
 splitthornQuiver:'Split Shot arrows deal 26 damage instead of 22',
 fleetfootBoots:'15% faster movement',
 mirewalkerBoots:'25% reduced poison cloud damage',
 sunlitReliquary:'Targeted Heal restores 55 HP instead of 40',
 venomFang:'Poison Enchant damage over time deals 9 per tick instead of 6',
 bulwarkCrest:'Bulwark lasts 8 seconds instead of 6'
};

export type EquipmentSlot='weapon'|'head'|'offhand'|'armour'|'boots';
export const GEAR_SLOTS:Record<Gear,EquipmentSlot>={
 redtubeArmour:'armour',primitiveWand:'weapon',pointyHat:'head',pointyOrb:'offhand',
 sporeboundTotem:'offhand',verdantMenderTotem:'offhand',
 sporefangQuiver:'offhand',sporestormQuiver:'offhand',splitthornQuiver:'offhand',
 fleetfootBoots:'boots',mirewalkerBoots:'boots',
 sunlitReliquary:'offhand',venomFang:'offhand',bulwarkCrest:'offhand'
};
export const GEAR_CLASS:Record<Gear,ClassId|'all'>={
 redtubeArmour:'all',primitiveWand:'all',pointyHat:'all',pointyOrb:'all',
 sporeboundTotem:'shaman',verdantMenderTotem:'shaman',
 sporefangQuiver:'ranger',sporestormQuiver:'ranger',splitthornQuiver:'ranger',
 fleetfootBoots:'all',mirewalkerBoots:'all',sunlitReliquary:'priest',
 venomFang:'rogue',bulwarkCrest:'defender'
};
const COUNTERS={
 redtubeArmour:'armours',primitiveWand:'crafted',pointyHat:'hats',pointyOrb:'orbs',
 sporeboundTotem:'sporeTotems',verdantMenderTotem:'menderTotems',
 sporefangQuiver:'sporeQuivers',sporestormQuiver:'stormQuivers',splitthornQuiver:'thornQuivers',
 fleetfootBoots:'fleetfootPairs',mirewalkerBoots:'mirewalkerPairs',
 sunlitReliquary:'reliquaries',venomFang:'venomFangs',bulwarkCrest:'bulwarkCrests'
} as const;
export type Inventory={
 rewards:Record<string,Material>;
 crafted:number;hats:number;orbs:number;armours:number;sporeTotems:number;sporeQuivers:number;
 fleetfootPairs:number;mirewalkerPairs:number;menderTotems:number;stormQuivers:number;thornQuivers:number;
 reliquaries:number;venomFangs:number;bulwarkCrests:number;
 armour:'redtubeArmour'|null;weapon:Weapon;head:'pointyHat'|null;offhand:Exclude<Gear,'redtubeArmour'|'primitiveWand'|'pointyHat'|'fleetfootBoots'|'mirewalkerBoots'>|null;
 boots:'fleetfootBoots'|'mirewalkerBoots'|null;
};
export const emptyInventory=():Inventory=>({
 rewards:{},crafted:0,hats:0,orbs:0,armours:0,sporeTotems:0,sporeQuivers:0,
 fleetfootPairs:0,mirewalkerPairs:0,menderTotems:0,stormQuivers:0,thornQuivers:0,
 reliquaries:0,venomFangs:0,bulwarkCrests:0,
 armour:null,weapon:null,head:null,offhand:null,boots:null
});
export function countInventory(v:Inventory):Record<Material|Gear,number>{
 const totals={} as Record<Material|Gear,number>;
 for(const material of ['largeSphere','largeCylinder','cylinderTube','sphericalBall','conicalTaper','hardTruffleSpore'] as Material[])
  totals[material]=Object.values(v.rewards).filter(m=>m===material).length;
 for(const gear of Object.keys(RECIPES) as Gear[]){
  const n=v[COUNTERS[gear]]??0;
  totals[gear]=n;
  for(const [material,cost] of Object.entries(RECIPES[gear]))totals[material as Material]-=n*cost;
 }
 return totals;
}
export function readInventory(raw:string|null):Inventory {
 try{
  const saved=JSON.parse(raw??'null');
  if(!saved||typeof saved!=='object'||!saved.rewards||typeof saved.rewards!=='object'||Array.isArray(saved.rewards))return emptyInventory();
  const result=emptyInventory();
  for(const [receipt,material] of Object.entries(saved.rewards))
   if(['largeSphere','largeCylinder','cylinderTube','sphericalBall','conicalTaper','hardTruffleSpore'].includes(String(material)))
    Object.defineProperty(result.rewards,receipt,{value:material,enumerable:true,writable:true,configurable:true});
  // Allocation order keeps existing crafted items before new recipes, avoiding negative material balances.
  for(const gear of Object.keys(RECIPES) as Gear[]){
   const field=COUNTERS[gear],requested=saved[field];
   if(!Number.isSafeInteger(requested)||requested<0)continue;
   const available=countInventory(result);
   const capacity=Math.min(...Object.entries(RECIPES[gear]).map(([m,n])=>Math.floor(available[m as Material]/n)));
   result[field]=Math.max(0,Math.min(requested,capacity));
  }
  for(const slot of ['armour','weapon','head','offhand','boots'] as EquipmentSlot[]){
   const selected=saved[slot];
   if(typeof selected==='string'&&selected in RECIPES&&GEAR_SLOTS[selected as Gear]===slot&&countInventory(result)[selected as Gear]>0)
    (result as unknown as Record<string,unknown>)[slot]=selected;
  }
  return result;
 }catch{return emptyInventory()}
}
export function grantReward(v:Inventory,reward:Snapshot['reward'],playerId:string){
 if(!reward||!reward.players.includes(playerId)||Object.hasOwn(v.rewards,reward.id))return false;
 Object.defineProperty(v.rewards,reward.id,{value:reward.material,enumerable:true,writable:true,configurable:true});return true;
}
export function craft(v:Inventory,gear:Gear='primitiveWand'){
 if(!Object.hasOwn(RECIPES,gear))return false;
 const counts=countInventory(v);
 if(Object.entries(RECIPES[gear]).some(([m,cost])=>counts[m as Material]<cost))return false;
 v[COUNTERS[gear]]++;return true;
}
export function equip(v:Inventory,slot:EquipmentSlot,gear:Gear|null){
 if(gear!==null&&(!Object.hasOwn(RECIPES,gear)||GEAR_SLOTS[gear]!==slot||countInventory(v)[gear]<1))return false;
 (v as unknown as Record<string,unknown>)[slot]=gear;return true;
}
export function equipWeapon(v:Inventory,weapon:Weapon){return equip(v,'weapon',weapon)}
export function inventoryView(v:Inventory){const counts=countInventory(v);return{
 materials:(['largeSphere','largeCylinder','cylinderTube','sphericalBall','conicalTaper','hardTruffleSpore'] as const).map(id=>({id,count:counts[id]})),
 gear:(Object.keys(GEAR_SLOTS) as Gear[]).filter(id=>counts[id]>0).map(id=>({id,count:counts[id],slot:GEAR_SLOTS[id],equipped:v[GEAR_SLOTS[id]]===id}))
}}
