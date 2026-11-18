import type {Snapshot,Weapon} from './protocol';
import type {ClassId} from './classes';

export const SPOREBOUND_BONUS={poisonCloudDamage:8,poisonCloudRadius:1.5,poisonCloudTicks:3,range:7,healPerTick:16,healRange:2} as const;
export const SPOREFANG_BONUS={aimedShotDamage:100,aimedShotCastMs:2000,arrowRainDamage:35,arrowRainRadius:1.75,splitShotDamage:16,splitShotArrows:5} as const;
export const CLASS_ITEM_BONUS={priestHeal:55,roguePoisonTick:18,roguePoisonTicks:2,rogueHoodTickMultiplier:2,defenderBulwarkMs:8000,defenderDamageMultiplier:.35,fireWandCastMultiplier:.5,fireWandDamageMultiplier:.5,fireArmourProjectiles:3} as const;
export type Material='chaosSigil'|'antChitin'|'largeSphere'|'largeCylinder'|'cylinderTube'|'sphericalBall'|'conicalTaper'|'hardTruffleSpore'|'duoCore'|'duoSpore';
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
 rottingFletching:{duoSpore:1,hardTruffleSpore:1},prismLens:{duoCore:1,conicalTaper:1},
 broodTotem:{antChitin:1,hardTruffleSpore:1},carapaceShield:{antChitin:1,largeCylinder:1},
 mandibleDagger:{antChitin:1,conicalTaper:1},antLegGreaves:{antChitin:1,largeSphere:1},
 pheromoneChalice:{antChitin:1,sphericalBall:1},antennaSpindle:{antChitin:1,cylinderTube:1},
 broodQuiver:{antChitin:1,hardTruffleSpore:1},moltenChitin:{antChitin:1,largeCylinder:1}
} as const;
export type Gear=keyof typeof RECIPES;
export const GEAR_EFFECTS:Record<keyof typeof RECIPES,string>={
 redtubeArmour:'Warrior-only: 5% less boss damage and wider Sword Slash',
 primitiveWand:'Lightning Mage-only: Arc Blast becomes Arc Spear',
 pointyHat:'Three sequential Dash charges',
 pointyOrb:'Fire Mage-only: LAZOR applies burn and adds 2s cooldown',
 sporeboundTotem:'Fire Totem turns green, with a small poison cloud (1.5 radius, 8 damage per tick) and shorter 7-unit range',
 verdantMenderTotem:'Healing Totem heals 16 HP per pulse but range is halved to 2 units',
 sporefangQuiver:'Ranger weapon: Aimed Shot deals 100 damage but cast time doubles to 2 seconds',
 sporestormQuiver:'Ranger armour: Arrow Rain deals 35 damage per wave but has half the radius',
 splitthornQuiver:'Ranger head: Split Shot fires five arrows instead of three, each dealing 16 instead of 22 damage',
 fleetfootBoots:'15% faster movement',
 mirewalkerBoots:'25% reduced poison cloud damage',
 sunlitReliquary:'Targeted Heal restores 55 HP instead of 40',
 venomFang:'Poison Enchant deals 18 damage per tick but applies half as many ticks (2 instead of 4)',
 bulwarkCrest:'Bulwark lasts 8 seconds and increases damage reduction from 50% to 65%',
 nightshadeHood:'Rogue head: doubles Poison Enchant tick count (stacks with Venom Fang)',
 shadowHat:'Priest head: Targeted Heal damages bosses instead of healing allies',
 emberWand:'Fire Mage weapon: Fireball deals 70 instead of 140 damage with half cast time (1s)',
 cinderweaveArmour:'Fire Mage armour: Fireball splits into 3 smaller 48-damage explosions (144 total on direct overlap, versus 140) for wider coverage',
 twinTotemCapacitor:'Shaman offhand: Earth Shock orders your active Fire Totem to strike its target for 20 extra damage',
 fractureAegis:'Defender offhand: Heroic Shield shares 20 absorb with a nearby third ally (stacks with Guardian Network)',
 sporeglassBlade:'Rogue weapon: Backstab plants a delayed 24-damage spore blast around the target',
 twinrushBoots:'Warrior boots: Charging Stab travels 7 units instead of 5',
 haloOfRenewal:'Priest head: Holy Nova leaves a three-tick healing field (5 HP to allies each second)',
 splitConductor:'Lightning Mage offhand: Arc Blast or Arc Spear forks a 25-damage bolt to a second nearby enemy',
 rottingFletching:'Ranger boots: Arrow Rain leaves a three-tick poisonous spore field (6 damage each second)',
 prismLens:'Fire Mage offhand: LAZOR becomes two angled 60-damage beams instead of a single central beam',
 broodTotem:'Shaman weapon: Fire Totem attacks another enemy within 5 units for 10 damage',
 carapaceShield:'Defender armour: Heroic Shield grants 20 extra self absorb and 10 additional absorb on another ally',
 mandibleDagger:'Rogue weapon: Backstab inflicts two 8-damage delayed mandible wounds',
 antLegGreaves:'Warrior boots: Charging Stab lands with 20 damage in a 2.5-unit area',
 pheromoneChalice:'Priest offhand: Holy Light also heals the most injured ally within 5 units of the enemy for 10',
 antennaSpindle:'Lightning Mage offhand: Arc Blast and Arc Spear jump to a second enemy for 16 damage',
 broodQuiver:'Ranger offhand: Split Shot inflicts two 5-damage venom ticks per struck target, once per volley',
 moltenChitin:'Fire Mage offhand: Fire Mines leave two independent 6-damage ember pulses'
};

export type EquipmentSlot='weapon'|'head'|'offhand'|'armour'|'boots';
export const EQUIPMENT_SLOTS=['weapon','head','offhand','armour','boots'] as const satisfies readonly EquipmentSlot[];
export const GEAR_SLOTS:Record<Gear,EquipmentSlot>={
 redtubeArmour:'armour',primitiveWand:'weapon',pointyHat:'head',pointyOrb:'offhand',
 sporeboundTotem:'offhand',verdantMenderTotem:'offhand',
 sporefangQuiver:'weapon',sporestormQuiver:'armour',splitthornQuiver:'head',
 fleetfootBoots:'boots',mirewalkerBoots:'boots',
 sunlitReliquary:'offhand',venomFang:'offhand',bulwarkCrest:'offhand',
 nightshadeHood:'head',shadowHat:'head',emberWand:'weapon',cinderweaveArmour:'armour',
 twinTotemCapacitor:'offhand',fractureAegis:'offhand',sporeglassBlade:'weapon',twinrushBoots:'boots',
 haloOfRenewal:'head',splitConductor:'offhand',rottingFletching:'boots',prismLens:'offhand',broodTotem:'weapon',carapaceShield:'armour',mandibleDagger:'weapon',antLegGreaves:'boots',pheromoneChalice:'offhand',antennaSpindle:'offhand',broodQuiver:'offhand',moltenChitin:'offhand'
};
export const GEAR_CLASS:Record<Gear,ClassId|'all'>={
 redtubeArmour:'warrior',primitiveWand:'lightningMage',pointyHat:'all',pointyOrb:'fireMage',
 sporeboundTotem:'shaman',verdantMenderTotem:'shaman',
 sporefangQuiver:'ranger',sporestormQuiver:'ranger',splitthornQuiver:'ranger',
 fleetfootBoots:'all',mirewalkerBoots:'all',sunlitReliquary:'priest',
 venomFang:'rogue',bulwarkCrest:'defender',nightshadeHood:'rogue',shadowHat:'priest',emberWand:'fireMage',cinderweaveArmour:'fireMage',
 twinTotemCapacitor:'shaman',fractureAegis:'defender',sporeglassBlade:'rogue',twinrushBoots:'warrior',
 haloOfRenewal:'priest',splitConductor:'lightningMage',rottingFletching:'ranger',prismLens:'fireMage',broodTotem:'shaman',carapaceShield:'defender',mandibleDagger:'rogue',antLegGreaves:'warrior',pheromoneChalice:'priest',antennaSpindle:'lightningMage',broodQuiver:'ranger',moltenChitin:'fireMage'
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
 rottingFletching:'rottingFletchings',prismLens:'prismLenses',broodTotem:'broodTotems',carapaceShield:'carapaceShields',mandibleDagger:'mandibleDaggers',antLegGreaves:'antLegPairs',pheromoneChalice:'pheromoneChalices',antennaSpindle:'antennaSpindles',broodQuiver:'broodQuivers',moltenChitin:'moltenChitins'
} as const;
export type Inventory={
 rewards:Record<string,Material>;
 gearSets:Partial<Record<ClassId,Partial<Record<EquipmentSlot,Gear|null>>>>;
 crafted:number;hats:number;orbs:number;armours:number;sporeTotems:number;sporeQuivers:number;
 fleetfootPairs:number;mirewalkerPairs:number;menderTotems:number;stormQuivers:number;thornQuivers:number;
 reliquaries:number;venomFangs:number;bulwarkCrests:number;
 nightshadeHoods:number;shadowHats:number;emberWands:number;cinderweaveArmours:number;
 twinCapacitors:number;fractureAegises:number;sporeglassBlades:number;twinrushPairs:number;
 renewalHalos:number;splitConductors:number;rottingFletchings:number;prismLenses:number;
 broodTotems:number;carapaceShields:number;mandibleDaggers:number;antLegPairs:number;
 pheromoneChalices:number;antennaSpindles:number;broodQuivers:number;moltenChitins:number;
 armour:'redtubeArmour'|'cinderweaveArmour'|'carapaceShield'|'sporestormQuiver'|null;weapon:Weapon;head:'pointyHat'|'nightshadeHood'|'shadowHat'|'haloOfRenewal'|'splitthornQuiver'|null;offhand:Exclude<Gear,'redtubeArmour'|'primitiveWand'|'pointyHat'|'fleetfootBoots'|'mirewalkerBoots'|'broodTotem'|'carapaceShield'|'sporefangQuiver'|'sporestormQuiver'|'splitthornQuiver'|'rottingFletching'>|null;
 boots:'fleetfootBoots'|'mirewalkerBoots'|'twinrushBoots'|'antLegGreaves'|'rottingFletching'|null;
};
export const emptyInventory=():Inventory=>({
 rewards:{},gearSets:{},crafted:0,hats:0,orbs:0,armours:0,sporeTotems:0,sporeQuivers:0,
 fleetfootPairs:0,mirewalkerPairs:0,menderTotems:0,stormQuivers:0,thornQuivers:0,
 reliquaries:0,venomFangs:0,bulwarkCrests:0,
 nightshadeHoods:0,shadowHats:0,emberWands:0,cinderweaveArmours:0,
 twinCapacitors:0,fractureAegises:0,sporeglassBlades:0,twinrushPairs:0,
 renewalHalos:0,splitConductors:0,rottingFletchings:0,prismLenses:0,
 broodTotems:0,carapaceShields:0,mandibleDaggers:0,antLegPairs:0,pheromoneChalices:0,antennaSpindles:0,broodQuivers:0,moltenChitins:0,
 armour:null,weapon:null,head:null,offhand:null,boots:null
});
export function countInventory(v:Inventory):Record<Material|Gear,number>{
 const totals={} as Record<Material|Gear,number>;
 for(const material of ['largeSphere','largeCylinder','cylinderTube','sphericalBall','conicalTaper','hardTruffleSpore','duoCore','duoSpore','antChitin','chaosSigil'] as Material[])
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
   if(['largeSphere','largeCylinder','cylinderTube','sphericalBall','conicalTaper','hardTruffleSpore','duoCore','duoSpore','antChitin','chaosSigil'].includes(String(material)))
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
  const oldRanger:{[key:string]:EquipmentSlot}={sporefangQuiver:'weapon',sporestormQuiver:'armour',splitthornQuiver:'head',rottingFletching:'boots'};
  for(const [gear,slot] of Object.entries(oldRanger)){
    if(saved.offhand===gear&&!result[slot]&&countInventory(result)[gear as Gear]>0)
      (result as unknown as Record<string,unknown>)[slot]=gear;
  }
  if(saved.gearSets&&typeof saved.gearSets==='object'&&!Array.isArray(saved.gearSets)){
    for(const [classId,selection] of Object.entries(saved.gearSets)){
      if(!['shaman','defender','rogue','warrior','priest','lightningMage','ranger','fireMage'].includes(classId)||!selection||typeof selection!=='object')continue;
      const set:Partial<Record<EquipmentSlot,Gear|null>>={};
      for(const slot of EQUIPMENT_SLOTS){
        const id=(selection as Record<string,unknown>)[slot];
        if(id===null)set[slot]=null;
        if(typeof id==='string'&&Object.hasOwn(RECIPES,id)&&GEAR_SLOTS[id as Gear]===slot&&
           (GEAR_CLASS[id as Gear]===classId||GEAR_CLASS[id as Gear]==='all')&&countInventory(result)[id as Gear]>0)set[slot]=id as Gear;
      }
      result.gearSets[classId as ClassId]=set;
    }
  }
  // v0.1.9 -> v0.1.10: migrate previously equipped Royal Ant gear into
  // its proper slot. Keep an existing legitimate weapon/armour if occupied.
  if(saved.offhand==='broodTotem'&&!result.weapon&&countInventory(result).broodTotem>0)result.weapon='broodTotem';
  if(saved.offhand==='carapaceShield'&&!result.armour&&countInventory(result).carapaceShield>0)result.armour='carapaceShield';
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
 materials:(['largeSphere','largeCylinder','cylinderTube','sphericalBall','conicalTaper','hardTruffleSpore','duoCore','duoSpore','antChitin','chaosSigil'] as const).map(id=>({id,count:counts[id]})),
 gear:(Object.keys(GEAR_SLOTS) as Gear[]).filter(id=>counts[id]>0).map(id=>({id,count:counts[id],slot:GEAR_SLOTS[id],equipped:v[GEAR_SLOTS[id]]===id}))
}}

/** Presets are browser-local equipment selections, not extra copies of gear.
 * Craft ownership and slot/class validity are rechecked upon activation. */
export function rememberClassGear(v:Inventory,classId:ClassId){
 const set:Partial<Record<EquipmentSlot,Gear|null>>={};
 for(const slot of EQUIPMENT_SLOTS){
  const id=v[slot] as Gear|null;
  set[slot]=id&&GEAR_CLASS[id]!=='all'&&GEAR_CLASS[id]!==classId?null:id;
 }
 v.gearSets[classId]=set;
}
export function activateClassGear(v:Inventory,classId:ClassId){
 if(!v.gearSets[classId])rememberClassGear(v,classId);
 const set=v.gearSets[classId]!;
 for(const slot of EQUIPMENT_SLOTS){
  const id=set[slot];
  const valid=id&&Object.hasOwn(RECIPES,id)&&GEAR_SLOTS[id]===slot&&
    (GEAR_CLASS[id]===classId||GEAR_CLASS[id]==='all')&&countInventory(v)[id]>0?id:null;
  (v as unknown as Record<string,unknown>)[slot]=valid;
 }
 return v;
}
export function equipForClass(v:Inventory,classId:ClassId,slot:EquipmentSlot,gear:Gear|null){
 if(gear&&GEAR_CLASS[gear]!=='all'&&GEAR_CLASS[gear]!==classId)return false;
 if(!equip(v,slot,gear))return false;
 rememberClassGear(v,classId);
 return true;
}
