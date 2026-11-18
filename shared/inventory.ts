import type {Snapshot,Weapon} from './protocol';
import type {ClassId} from './classes';

export const SPOREBOUND_BONUS={poisonCloudDamage:8,poisonCloudRadius:1.5,poisonCloudTicks:3,range:7,healPerTick:16,healRange:2} as const;
export const SPOREFANG_BONUS={aimedShotDamage:100,aimedShotCastMs:2000,arrowRainDamage:35,arrowRainRadius:1.75,splitShotDamage:16,splitShotArrows:5} as const;
export const CLASS_ITEM_BONUS={priestHeal:55,roguePoisonTick:15,roguePoisonTicks:2,rogueHoodTickMultiplier:2,defenderBulwarkMs:8000,defenderDamageMultiplier:.35,fireWandCastMultiplier:.5,fireWandDamageMultiplier:.5,fireArmourProjectiles:3} as const;
export type Material='largeSphere'|'largeCylinder'|'cylinderTube'|'sphericalBall'|'conicalTaper'|'hardTruffleSpore'|'duoCore'|'duoSpore';
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
 bulwarkCrest:{largeCylinder:1,sphericalBall:1},
 nightshadeHood:{conicalTaper:2,hardTruffleSpore:1},
 shadowHat:{largeSphere:1,conicalTaper:1},
 emberWand:{cylinderTube:1,hardTruffleSpore:1},
 cinderweaveArmour:{largeCylinder:2,sphericalBall:1},
 twinTotemCapacitor:{duoCore:1,cylinderTube:1},fractureAegis:{duoSpore:1,largeCylinder:1},
 sporeglassBlade:{duoSpore:1,conicalTaper:1},twinrushBoots:{duoCore:1,largeSphere:1},
 haloOfRenewal:{duoSpore:1,largeSphere:1},splitConductor:{duoCore:1,sphericalBall:1},
 rottingFletching:{duoSpore:1,hardTruffleSpore:1},prismLens:{duoCore:1,conicalTaper:1}
} as const;
export type Gear=keyof typeof RECIPES;
export const GEAR_EFFECTS:Record<keyof typeof RECIPES,string>={
 redtubeArmour:'Warrior-only: 5% less boss damage and wider Sword Slash',
 primitiveWand:'Lightning Mage-only: Arc Blast becomes Arc Spear',
 pointyHat:'Three sequential Dash charges',
 pointyOrb:'Fire Mage-only: LAZOR applies burn and adds 2s cooldown',
 sporeboundTotem:'Fire Totem turns green, with a small poison cloud (1.5 radius, 8 damage per tick) and shorter 7-unit range',
 verdantMenderTotem:'Healing Totem heals 16 HP per pulse but range is halved to 2 units',
 sporefangQuiver:'Aimed Shot deals 100 damage but cast time doubles to 2 seconds',
 sporestormQuiver:'Arrow Rain deals 35 damage per wave but has half the radius',
 splitthornQuiver:'Split Shot fires five arrows instead of three, each dealing 16 instead of 22 damage',
 fleetfootBoots:'15% faster movement',
 mirewalkerBoots:'25% reduced poison cloud damage',
 sunlitReliquary:'Targeted Heal restores 55 HP instead of 40',
 venomFang:'Poison Enchant deals 15 damage per tick but applies half as many ticks (2 instead of 4)',
 bulwarkCrest:'Bulwark lasts 8 seconds and increases damage reduction from 50% to 65%',
 nightshadeHood:'Rogue head: doubles Poison Enchant tick count (stacks with Venom Fang)',
 shadowHat:'Priest head: Targeted Heal damages bosses instead of healing allies',
 emberWand:'Fire Mage weapon: Fireball deals half damage with half cast time',
 cinderweaveArmour:'Fire Mage armour: Fireball launches three projectiles instead of one',
 twinTotemCapacitor:'Shaman offhand: Earth Shock orders your active Fire Totem to strike its target for 20 extra damage',
 fractureAegis:'Defender offhand: Heroic Shield shares 20 absorb with a nearby third ally (stacks with Guardian Network)',
 sporeglassBlade:'Rogue weapon: Backstab plants a delayed 24-damage spore blast around the target',
 twinrushBoots:'Warrior boots: Charging Stab travels 7 units instead of 5',
 haloOfRenewal:'Priest head: Holy Nova leaves a three-tick healing field (5 HP to allies each second)',
 splitConductor:'Lightning Mage offhand: Arc Blast or Arc Spear forks a 25-damage bolt to a second nearby enemy',
 rottingFletching:'Ranger offhand: Arrow Rain leaves a three-tick poisonous spore field (6 damage each second)',
 prismLens:'Fire Mage offhand: LAZOR becomes two angled 60-damage beams instead of a single central beam'
};

export type EquipmentSlot='weapon'|'head'|'offhand'|'armour'|'boots';
export const GEAR_SLOTS:Record<Gear,EquipmentSlot>={
 redtubeArmour:'armour',primitiveWand:'weapon',pointyHat:'head',pointyOrb:'offhand',
 sporeboundTotem:'offhand',verdantMenderTotem:'offhand',
 sporefangQuiver:'offhand',sporestormQuiver:'offhand',splitthornQuiver:'offhand',
 fleetfootBoots:'boots',mirewalkerBoots:'boots',
 sunlitReliquary:'offhand',venomFang:'offhand',bulwarkCrest:'offhand',
 nightshadeHood:'head',shadowHat:'head',emberWand:'weapon',cinderweaveArmour:'armour',
 twinTotemCapacitor:'offhand',fractureAegis:'offhand',sporeglassBlade:'weapon',twinrushBoots:'boots',
 haloOfRenewal:'head',splitConductor:'offhand',rottingFletching:'offhand',prismLens:'offhand'
};
export const GEAR_CLASS:Record<Gear,ClassId|'all'>={
 redtubeArmour:'warrior',primitiveWand:'lightningMage',pointyHat:'all',pointyOrb:'fireMage',
 sporeboundTotem:'shaman',verdantMenderTotem:'shaman',
 sporefangQuiver:'ranger',sporestormQuiver:'ranger',splitthornQuiver:'ranger',
 fleetfootBoots:'all',mirewalkerBoots:'all',sunlitReliquary:'priest',
 venomFang:'rogue',bulwarkCrest:'defender',nightshadeHood:'rogue',shadowHat:'priest',emberWand:'fireMage',cinderweaveArmour:'fireMage',
 twinTotemCapacitor:'shaman',fractureAegis:'defender',sporeglassBlade:'rogue',twinrushBoots:'warrior',
 haloOfRenewal:'priest',splitConductor:'lightningMage',rottingFletching:'ranger',prismLens:'fireMage'
};
const COUNTERS={
 redtubeArmour:'armours',primitiveWand:'crafted',pointyHat:'hats',pointyOrb:'orbs',
 sporeboundTotem:'sporeTotems',verdantMenderTotem:'menderTotems',
 sporefangQuiver:'sporeQuivers',sporestormQuiver:'stormQuivers',splitthornQuiver:'thornQuivers',
 fleetfootBoots:'fleetfootPairs',mirewalkerBoots:'mirewalkerPairs',
 sunlitReliquary:'reliquaries',venomFang:'venomFangs',bulwarkCrest:'bulwarkCrests',
 nightshadeHood:'nightshadeHoods',shadowHat:'shadowHats',emberWand:'emberWands',cinderweaveArmour:'cinderweaveArmours',
 twinTotemCapacitor:'twinCapacitors',fractureAegis:'fractureAegises',sporeglassBlade:'sporeglassBlades',
 twinrushBoots:'twinrushPairs',haloOfRenewal:'renewalHalos',splitConductor:'splitConductors',
 rottingFletching:'rottingFletchings',prismLens:'prismLenses'
} as const;
export type Inventory={
 rewards:Record<string,Material>;
 crafted:number;hats:number;orbs:number;armours:number;sporeTotems:number;sporeQuivers:number;
 fleetfootPairs:number;mirewalkerPairs:number;menderTotems:number;stormQuivers:number;thornQuivers:number;
 reliquaries:number;venomFangs:number;bulwarkCrests:number;
 nightshadeHoods:number;shadowHats:number;emberWands:number;cinderweaveArmours:number;
 twinCapacitors:number;fractureAegises:number;sporeglassBlades:number;twinrushPairs:number;
 renewalHalos:number;splitConductors:number;rottingFletchings:number;prismLenses:number;
 armour:'redtubeArmour'|'cinderweaveArmour'|null;weapon:Weapon;head:'pointyHat'|'nightshadeHood'|'shadowHat'|'haloOfRenewal'|null;offhand:Exclude<Gear,'redtubeArmour'|'primitiveWand'|'pointyHat'|'fleetfootBoots'|'mirewalkerBoots'>|null;
 boots:'fleetfootBoots'|'mirewalkerBoots'|'twinrushBoots'|null;
};
export const emptyInventory=():Inventory=>({
 rewards:{},crafted:0,hats:0,orbs:0,armours:0,sporeTotems:0,sporeQuivers:0,
 fleetfootPairs:0,mirewalkerPairs:0,menderTotems:0,stormQuivers:0,thornQuivers:0,
 reliquaries:0,venomFangs:0,bulwarkCrests:0,
 nightshadeHoods:0,shadowHats:0,emberWands:0,cinderweaveArmours:0,
 twinCapacitors:0,fractureAegises:0,sporeglassBlades:0,twinrushPairs:0,
 renewalHalos:0,splitConductors:0,rottingFletchings:0,prismLenses:0,
 armour:null,weapon:null,head:null,offhand:null,boots:null
});
export function countInventory(v:Inventory):Record<Material|Gear,number>{
 const totals={} as Record<Material|Gear,number>;
 for(const material of ['largeSphere','largeCylinder','cylinderTube','sphericalBall','conicalTaper','hardTruffleSpore','duoCore','duoSpore'] as Material[])
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
   if(['largeSphere','largeCylinder','cylinderTube','sphericalBall','conicalTaper','hardTruffleSpore','duoCore','duoSpore'].includes(String(material)))
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
 materials:(['largeSphere','largeCylinder','cylinderTube','sphericalBall','conicalTaper','hardTruffleSpore','duoCore','duoSpore'] as const).map(id=>({id,count:counts[id]})),
 gear:(Object.keys(GEAR_SLOTS) as Gear[]).filter(id=>counts[id]>0).map(id=>({id,count:counts[id],slot:GEAR_SLOTS[id],equipped:v[GEAR_SLOTS[id]]===id}))
}}
