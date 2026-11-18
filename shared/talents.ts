import {CLASS_DEFINITIONS,type ClassId} from './classes';
import type {BossId} from './protocol';

export const TALENT_NODES={
 unyieldingForce:{id:'unyieldingForce',name:'Unyielding Force',ranks:1,requires:null,description:'+3% damage dealt and 3% less damage taken'},
 partingGift:{id:'partingGift',name:'Parting Gift',ranks:1,requires:'unyieldingForce',description:'Your Fire or Healing Totem explodes for 30 damage when it expires'},
 violentFarewell:{id:'violentFarewell',name:'Violent Farewell',ranks:1,requires:'partingGift',description:'Your totems also explode for 30 damage if killed early'}
} as const;
export type TalentId=keyof typeof TALENT_NODES;
export type TalentProgress={wins:BossId[];picks:Partial<Record<ClassId,TalentId[]>>};
export const emptyTalents=():TalentProgress=>({wins:[],picks:{}});
export const TALENT_TREE=Object.fromEntries(Object.keys(CLASS_DEFINITIONS).map(classId=>[
 classId,{classId,nodes:classId==='shaman'?[TALENT_NODES.unyieldingForce,TALENT_NODES.partingGift,TALENT_NODES.violentFarewell]:[TALENT_NODES.unyieldingForce]}
])) as unknown as Record<ClassId,{classId:string;nodes:readonly (typeof TALENT_NODES[TalentId])[]}>;
export const TALENT_POINT_BOSSES=['warden','yellowBall','greenCone','fracturer','hardWarden','hardYellowBall','hardGreenCone','duoYellowWarden','duoTruffleFracturer'] as const satisfies readonly BossId[];
export const talentSpent=(p:TalentProgress)=>Object.values(p.picks).reduce((total,items)=>total+(items?.length??0),0);
export const talentAvailable=(p:TalentProgress)=>Math.max(0,p.wins.length-talentSpent(p));
export const hasTalent=(p:TalentProgress|undefined,cls:ClassId,node:TalentId)=>!!p?.picks[cls]?.includes(node);
export function readTalents(raw:unknown):TalentProgress{
 const source=typeof raw==='string'?(()=>{try{return JSON.parse(raw)}catch{return null}})():raw;
 if(!source||typeof source!=='object')return emptyTalents();
 const v=source as Record<string,unknown>;
 const wins=Array.isArray(v.wins)?[...new Set(v.wins.filter((id):id is BossId=>typeof id==='string'&&(TALENT_POINT_BOSSES as readonly string[]).includes(id)))]:[];
 const picks:TalentProgress['picks']={};let used=0;
 const record=v.picks&&typeof v.picks==='object'?v.picks as Record<string,unknown>:{};
 for(const cls of Object.keys(CLASS_DEFINITIONS) as ClassId[]){
  const requested=Array.isArray(record[cls])?record[cls] as unknown[]:[];
  const kept:TalentId[]=[];
  for(const item of requested){
   if(typeof item!=='string'||!Object.hasOwn(TALENT_NODES,item)||kept.includes(item as TalentId)||used>=wins.length)continue;
   const node=TALENT_NODES[item as TalentId];
   if(!TALENT_TREE[cls].nodes.some(n=>n.id===item)||node.requires&&!kept.includes(node.requires as TalentId))continue;
   kept.push(item as TalentId);used++;
  }
  if(kept.length)picks[cls]=kept;
 }
 return {wins,picks};
}
export function unlockTalent(p:TalentProgress,cls:ClassId,node:TalentId){
 if(!Object.hasOwn(CLASS_DEFINITIONS,cls)||!TALENT_TREE[cls].nodes.some(n=>n.id===node)||talentAvailable(p)<1||hasTalent(p,cls,node))return false;
 const required=TALENT_NODES[node].requires;
 if(required&&!hasTalent(p,cls,required))return false;
 (p.picks[cls]??=[]).push(node);return true;
}
export function respecTalents(p:TalentProgress,cls?:ClassId){if(cls&&Object.hasOwn(CLASS_DEFINITIONS,cls))delete p.picks[cls];else if(!cls)p.picks={};}
export function awardTalentWin(p:TalentProgress,boss:BossId){if(p.wins.includes(boss))return false;p.wins.push(boss);return true;}
export function talentDamage(amount:number,rank=0){return amount*(rank===1?1.03:1)}
export function talentMitigation(amount:number,rank=0){return amount*(rank===1 ? .97 : 1)}
