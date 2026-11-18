import {CLASS_DEFINITIONS,type ClassId} from './classes';
import type {BossId} from './protocol';

/** Prerequisite IDs are within the same class. The shared root is intentionally
 * purchased separately for each class, but all classes spend one shared pool. */
export const TALENT_NODES={
 unyieldingForce:{id:'unyieldingForce',name:'Unyielding Force',ranks:1,requires:null,description:'+3% damage dealt and 3% less damage taken'},
 partingGift:{id:'partingGift',name:'Parting Gift',ranks:1,requires:'unyieldingForce',description:'Totems explode for 30 damage in a 3-unit radius on natural expiry'},
 violentFarewell:{id:'violentFarewell',name:'Violent Farewell',ranks:1,requires:'partingGift',description:'Totems also explode for 30 damage if destroyed early'},
 stormConduit:{id:'stormConduit',name:'Storm Conduit',ranks:1,requires:'unyieldingForce',description:'Earth Shock chains to a second enemy within 5 units for 18 damage'},
 livingCurrent:{id:'livingCurrent',name:'Living Current',ranks:1,requires:'stormConduit',description:'Earth Shock also heals the most injured ally within 5 units of the target for 12'},
 guardianNetwork:{id:'guardianNetwork',name:'Guardian Network',ranks:1,requires:'unyieldingForce',description:'Heroic Shield shares 20 absorb with a third ally within 4 units of the target'},
 shelteredHearts:{id:'shelteredHearts',name:'Sheltered Hearts',ranks:1,requires:'guardianNetwork',description:'Heroic Shield restores 12 HP to its main target'},
 ironMarch:{id:'ironMarch',name:'Iron March',ranks:1,requires:'unyieldingForce',description:'Bulwark reduces movement by 25% instead of 50%'},
 retaliatoryShell:{id:'retaliatoryShell',name:'Retaliatory Shell',ranks:1,requires:'ironMarch',description:'Taking damage during Bulwark retaliates for 12 area damage within 3 units (1s internal cooldown)'},
 shadowAmbush:{id:'shadowAmbush',name:'Shadow Ambush',ranks:1,requires:'unyieldingForce',description:'Rear Backstab deals 20 additional damage'},
 shadowstep:{id:'shadowstep',name:'Shadowstep',ranks:1,requires:'shadowAmbush',description:'Casting Vanish refills one spent Dash charge'},
 venomSpread:{id:'venomSpread',name:'Contagion',ranks:1,requires:'unyieldingForce',description:'Poison Enchant stabs spread two poison ticks to a second nearby foe'},
 leechingVenom:{id:'leechingVenom',name:'Devouring Venom',ranks:1,requires:'venomSpread',description:'Each Poison Enchant damage tick restores 2 HP to you'},
 piercingCharge:{id:'piercingCharge',name:'Piercing Charge',ranks:1,requires:'unyieldingForce',description:'Charging Stab deals 22 damage to enemies passed along its route'},
 impactWave:{id:'impactWave',name:'Impact Wave',ranks:1,requires:'piercingCharge',description:'Charging Stab lands with an additional 18-damage 2.5-unit shockwave'},
 cleavingArc:{id:'cleavingArc',name:'Cleaving Arc',ranks:1,requires:'unyieldingForce',description:'Sword Slash gains more reach and a wider frontal arc'},
 defiantGuard:{id:'defiantGuard',name:'Defiant Guard',ranks:1,requires:'cleavingArc',description:'Guard heals the Warrior for 10 on activation'},
 healingCascade:{id:'healingCascade',name:'Healing Cascade',ranks:1,requires:'unyieldingForce',description:'Targeted Heal splashes 12 healing to other allies within 4 units of its target'},
 sacredEcho:{id:'sacredEcho',name:'Sacred Echo',ranks:1,requires:'healingCascade',description:'Healing someone else with Targeted Heal also heals you for 8'},
 widerNova:{id:'widerNova',name:'Expanding Nova',ranks:1,requires:'unyieldingForce',description:'Holy Nova gains 1-unit radius and heals 4 more'},
 avengingLight:{id:'avengingLight',name:'Avenging Light',ranks:1,requires:'widerNova',description:'Holy Light heals the lowest-health ally within 5 units of the target for 12'},
 forkedArc:{id:'forkedArc',name:'Forked Arc',ranks:1,requires:'unyieldingForce',description:'Arc Blast or Arc Spear jumps to a nearby second enemy for 40% of its damage'},
 arcOverload:{id:'arcOverload',name:'Arc Overload',ranks:1,requires:'forkedArc',description:'The chained arc may jump to a third enemy for 20% of original damage'},
 stormWell:{id:'stormWell',name:'Storm Well',ranks:1,requires:'unyieldingForce',description:'Lightning Storm increases its pulse radius from 3 to 4 units'},
 stormAftershock:{id:'stormAftershock',name:'Storm Aftershock',ranks:1,requires:'stormWell',description:'Lightning Storm ends with a bonus 30-damage area pulse'},
 splitVolley:{id:'splitVolley',name:'Split Volley',ranks:1,requires:'unyieldingForce',description:'Split Shot fires two additional outer 16-damage arrows'},
 ricochetArrows:{id:'ricochetArrows',name:'Ricochet Arrows',ranks:1,requires:'splitVolley',description:'Aimed Shot ricochets for 20 damage to a second enemy within 4 units'},
 rainSurge:{id:'rainSurge',name:'Rain Surge',ranks:1,requires:'unyieldingForce',description:'Arrow Rain gains a fourth 22-damage wave'},
 lastDownpour:{id:'lastDownpour',name:'Last Downpour',ranks:1,requires:'rainSurge',description:'Arrow Rain final wave has 1 extra unit of radius'},
 prismBeam:{id:'prismBeam',name:'Prism Beam',ranks:1,requires:'unyieldingForce',description:'LAZOR adds two 20-damage side beams angled outward'},
 searingBeam:{id:'searingBeam',name:'Searing Beam',ranks:1,requires:'prismBeam',description:'LAZOR hits apply two 8-damage burn ticks (or preserve a longer existing burn)'},
 volatileMines:{id:'volatileMines',name:'Volatile Mines',ranks:1,requires:'unyieldingForce',description:'Fire Mine triggers at 2.7 units and explodes over 4 units'},
 emberAfterglow:{id:'emberAfterglow',name:'Ember Afterglow',ranks:1,requires:'volatileMines',description:'Detonated Fire Mines leave three 8-damage area pulses at their location'},
 funeralBloom:{id:'funeralBloom',name:'Funeral Bloom',ranks:1,requires:'violentFarewell',description:'Totem death explosions also heal nearby living allies for 10'},
 stormRebound:{id:'stormRebound',name:'Storm Rebound',ranks:1,requires:'livingCurrent',description:'Earth Shock chain jumps to a third enemy within 5 units for 10 damage'},
 shieldReprieve:{id:'shieldReprieve',name:'Shield Reprieve',ranks:1,requires:'shelteredHearts',description:'Heroic Shield on another ally also heals the Defender for 10'},
 thunderShell:{id:'thunderShell',name:'Thunder Shell',ranks:1,requires:'retaliatoryShell',description:'Bulwark retaliation grows to 20 damage over a 4-unit area'},
 rippleStab:{id:'rippleStab',name:'Ripple Stab',ranks:1,requires:'shadowstep',description:'Rear Backstab also strikes one second nearby enemy for 18'},
 venomCatalyst:{id:'venomCatalyst',name:'Venom Catalyst',ranks:1,requires:'leechingVenom',description:'Poison Enchant ticks each deal 4 additional damage'},
 meteorWake:{id:'meteorWake',name:'Meteor Wake',ranks:1,requires:'impactWave',description:'Charging Stab impact wave becomes 22 damage across 3 units'},
 battleWard:{id:'battleWard',name:'Battle Ward',ranks:1,requires:'defiantGuard',description:'Guard grants the nearest other ally within 4 units a 20-HP shield for 2 seconds'},
 aegisMend:{id:'aegisMend',name:'Aegis Mend',ranks:1,requires:'sacredEcho',description:'Targeted Heal also grants 15 shield to its target for 5 seconds'},
 dawnFlare:{id:'dawnFlare',name:'Dawn Flare',ranks:1,requires:'avengingLight',description:'Holy Light triggers an additional 15-damage pulse within 2 units of its enemy target'},
 arcSurge:{id:'arcSurge',name:'Arc Surge',ranks:1,requires:'arcOverload',description:'Arc Overload third jump deals 15 bonus damage'},
 stormShelter:{id:'stormShelter',name:'Storm Shelter',ranks:1,requires:'stormAftershock',description:'A completed Lightning Storm gives nearby living allies 15 shield for 4 seconds'},
 thirdRicochet:{id:'thirdRicochet',name:'Third Ricochet',ranks:1,requires:'ricochetArrows',description:'Aimed Shot ricochets a third time for 12 damage'},
 rainOfMercy:{id:'rainOfMercy',name:'Rain of Mercy',ranks:1,requires:'lastDownpour',description:'Each Arrow Rain wave also heals allies inside its area for 5'},
 solarFlare:{id:'solarFlare',name:'Solar Flare',ranks:1,requires:'searingBeam',description:'LAZOR ends with an additional 18-damage, 2-unit blast'},
 blazingHorizon:{id:'blazingHorizon',name:'Blazing Horizon',ranks:1,requires:'emberAfterglow',description:'Ember Afterglow radius increases from 3 to 4 without increasing damage'}
} as const;
export type TalentId=keyof typeof TALENT_NODES;
export type TalentProgress={wins:BossId[];picks:Partial<Record<ClassId,TalentId[]>>};
export const emptyTalents=():TalentProgress=>({wins:[],picks:{}});
const BRANCHES={
 shaman:[['partingGift','violentFarewell','funeralBloom'],['stormConduit','livingCurrent','stormRebound']],
 defender:[['guardianNetwork','shelteredHearts','shieldReprieve'],['ironMarch','retaliatoryShell','thunderShell']],
 rogue:[['shadowAmbush','shadowstep','rippleStab'],['venomSpread','leechingVenom','venomCatalyst']],
 warrior:[['piercingCharge','impactWave','meteorWake'],['cleavingArc','defiantGuard','battleWard']],
 priest:[['healingCascade','sacredEcho','aegisMend'],['widerNova','avengingLight','dawnFlare']],
 lightningMage:[['forkedArc','arcOverload','arcSurge'],['stormWell','stormAftershock','stormShelter']],
 ranger:[['splitVolley','ricochetArrows','thirdRicochet'],['rainSurge','lastDownpour','rainOfMercy']],
 fireMage:[['prismBeam','searingBeam','solarFlare'],['volatileMines','emberAfterglow','blazingHorizon']]
} as const satisfies Record<ClassId,readonly (readonly TalentId[])[]>;
export const TALENT_TREE=Object.fromEntries((Object.keys(CLASS_DEFINITIONS) as ClassId[]).map(classId=>[
 classId,{classId,branches:BRANCHES[classId],nodes:[TALENT_NODES.unyieldingForce,...BRANCHES[classId].flat().map(id=>TALENT_NODES[id])]}
])) as unknown as Record<ClassId,{classId:ClassId;branches:readonly (readonly TalentId[])[];nodes:readonly (typeof TALENT_NODES[TalentId])[]}>;
export const TALENT_POINT_BOSSES=['warden','yellowBall','greenCone','fracturer','hardWarden','hardYellowBall','hardGreenCone','duoYellowWarden','duoTruffleFracturer','antQueen'] as const satisfies readonly BossId[];
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
  // Normalize regardless of supplied order: do not discard an earned child because
  // a browser serialized it before its prerequisite.
  const requestedIds=requested.filter((id):id is TalentId=>typeof id==='string'&&Object.hasOwn(TALENT_NODES,id));
  let changed=true;
  while(changed){changed=false;
   for(const id of requestedIds){
    if(kept.includes(id)||used>=wins.length||!TALENT_TREE[cls].nodes.some(n=>n.id===id))continue;
    const requirement=TALENT_NODES[id].requires;
    if(requirement&&!kept.includes(requirement))continue;
    kept.push(id);used++;changed=true;
   }
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
export function awardTalentWin(p:TalentProgress,boss:BossId){if(!(TALENT_POINT_BOSSES as readonly string[]).includes(boss)||p.wins.includes(boss))return false;p.wins.push(boss);return true;}
export function talentDamage(amount:number,rank=0){return amount*(rank===1?1.03:1)}
export function talentMitigation(amount:number,rank=0){return amount*(rank===1?.97:1)}
