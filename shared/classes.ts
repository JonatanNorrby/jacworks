import { baseLoadout, encounterLoadout } from './protocol';
import type { Loadout, SkillId, Weapon } from './protocol';
export type ClassDefinition={id:string;name:string;skills:readonly SkillId[]};
export const CLASS_DEFINITIONS={
 shaman:{id:'shaman',name:'Shaman',skills:['earthShock','fireTotem','healingTotem','dash']},
 defender:{id:'defender',name:'Defender',skills:['stab','bulwark','heroicShield','dash']},
 rogue:{id:'rogue',name:'Rogue',skills:['quickStab','vanish','poisonEnchant','dash']},
 warrior:{id:'warrior',name:'Warrior',skills:['swordSwing','chargingStab','guard','dash']},
 priest:{id:'priest',name:'Priest',skills:['pulseNova','targetedHeal','holyLight','dash']},
 lightningMage:{id:'lightningMage',name:'Lightning Mage',skills:['arcBolt','lightningStorm','lightningShield','dash']},
 ranger:{id:'ranger',name:'Ranger',skills:['aimedShot','arrowRain','splitShot','dash']},
 fireMage:{id:'fireMage',name:'Fire Mage',skills:['fireball','lazor','fireMine','dash']},
} satisfies Record<string,ClassDefinition>;
export type ClassId=keyof typeof CLASS_DEFINITIONS;
export const DEFAULT_CLASS_ID:ClassId='lightningMage';
export function readClass(value:unknown):ClassId{return typeof value==='string'&&Object.hasOwn(CLASS_DEFINITIONS,value)?value as ClassId:DEFAULT_CLASS_ID}
export function skillEligible(definition:ClassDefinition,skill:SkillId){return definition.skills.includes(skill)}
export function eligibleLoadout(definition:ClassDefinition,value:unknown):Loadout {
 const selected=baseLoadout(value).filter(skill=>skillEligible(definition,skill));
 for(const skill of definition.skills)if(!selected.includes(skill)&&selected.length<4)selected.push(skill);
 if(selected.length!==4)throw new Error('A playable class must allow four base skills');
 return selected as Loadout;
}
export function gearEligible(id:ClassId,item:string){return (item==='redtubeArmour'&&['warrior','defender','rogue'].includes(id))||item==='pointyHat'||(item==='primitiveWand'&&['priest','lightningMage','fireMage'].includes(id))||(item==='pointyOrb'&&['lightningMage','fireMage'].includes(id))}
export function resolveClassLoadout(id:ClassId,value:unknown,weapon:Weapon):Loadout {return encounterLoadout(eligibleLoadout(CLASS_DEFINITIONS[id],value),id==='lightningMage'?weapon:null)}

export const CLASS_STORAGE_KEY='jacworks-class-v1';
export function loadClass(storage:Pick<Storage,'getItem'>):ClassId {try{return readClass(storage.getItem(CLASS_STORAGE_KEY))}catch{return DEFAULT_CLASS_ID}}
export function saveClass(storage:Pick<Storage,'setItem'>,id:ClassId){storage.setItem(CLASS_STORAGE_KEY,id)}
