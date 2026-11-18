import {CLASS_DEFINITIONS,type ClassId} from './classes';
export const TALENT_NODE={id:'unyieldingForce',name:'Unyielding Force',ranks:1,damageBonus:.03,damageReduction:.03,description:'+3% damage dealt and 3% less damage taken'} as const;
export const TALENT_TREE=Object.fromEntries(Object.keys(CLASS_DEFINITIONS).map(id=>[id,{classId:id,nodes:[TALENT_NODE]}])) as unknown as Record<ClassId,{classId:string;nodes:readonly typeof TALENT_NODE[]}>;
export function talentDamage(amount:number,rank=1){return amount*(rank===1?1.03:1)}
export function talentMitigation(amount:number,rank=1){return amount*(rank===1 ? .97 : 1)}
