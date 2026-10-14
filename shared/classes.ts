import { baseLoadout, encounterLoadout, SKILLS } from './protocol';
import type { Loadout, SkillId, Weapon } from './protocol';
// Stable IDs and eligibility seams; no final class roster or selection policy is implied.
export const PROTOTYPE_CLASS_ID='prototype' as const;
export type ClassId=keyof typeof CLASS_DEFINITIONS;
export type ClassDefinition={id:string;name:string;skills:readonly SkillId[]|null};
export const CLASS_DEFINITIONS={prototype:{id:PROTOTYPE_CLASS_ID,name:'Prototype',skills:null}} satisfies Record<string,ClassDefinition>;
export function skillEligible(definition:ClassDefinition,skill:SkillId){return definition.skills===null||definition.skills.includes(skill)}
export function eligibleLoadout(definition:ClassDefinition,value:unknown):Loadout {
 const selected=baseLoadout(value).filter(skill=>skillEligible(definition,skill));
 for(const skill of Object.keys(SKILLS) as SkillId[])if(skill!=='arcSpear'&&skillEligible(definition,skill)&&!selected.includes(skill)&&selected.length<4)selected.push(skill);
 if(selected.length!==4)throw new Error('A playable class must allow four base skills');
 return selected as Loadout;
}
// Eligibility applies to learned base skills before equipment transformations.
export function resolveClassLoadout(id:ClassId,value:unknown,weapon:Weapon):Loadout {return encounterLoadout(eligibleLoadout(CLASS_DEFINITIONS[id],value),weapon)}
