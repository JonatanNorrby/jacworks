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
 blazingHorizon:{id:'blazingHorizon',name:'Blazing Horizon',ranks:1,requires:'emberAfterglow',description:'Ember Afterglow radius increases from 3 to 4 without increasing damage'},
 ancestralShelter:{id:'ancestralShelter',name:'Ancestral Shelter',ranks:1,requires:'funeralBloom',description:'When your totem explodes, nearby living allies also gain a 10-HP shield for 4s'},
 stormMender:{id:'stormMender',name:'Storm Mender',ranks:1,requires:'stormRebound',description:'When Earth Shock chains to a third enemy, heal the most injured ally within 5 of it for 10'},
 aegisCommand:{id:'aegisCommand',name:'Aegis Command',ranks:1,requires:'shieldReprieve',description:'Heroic Shield on an ally also grants that ally 1.2s of Guard damage mitigation'},
 bulwarkResonance:{id:'bulwarkResonance',name:'Bulwark Resonance',ranks:1,requires:'thunderShell',description:'Your Bulwark retaliation also shields the nearest living ally (or yourself) for 10 HP over 2.5s'},
 cloakOfThorns:{id:'cloakOfThorns',name:'Cloak of Thorns',ranks:1,requires:'rippleStab',description:'A successful rear Backstab gives you a 15-HP shield for 2.5s'},
 toxicEcho:{id:'toxicEcho',name:'Toxic Echo',ranks:1,requires:'venomCatalyst',description:'Each Poison Enchant tick deals 3 splash damage to one other nearby enemy within 3'},
 seismicRenewal:{id:'seismicRenewal',name:'Seismic Renewal',ranks:1,requires:'meteorWake',description:'Charging Stab impact heals you for 5 per enemy caught in the shockwave, up to 20'},
 guardianRiposte:{id:'guardianRiposte',name:'Guardian Riposte',ranks:1,requires:'battleWard',description:'Guard also strikes the nearest enemy within 2.5 units for 12 damage'},
 secondBenediction:{id:'secondBenediction',name:'Second Benediction',ranks:1,requires:'aegisMend',description:'Targeted Heal shields one additional injured ally within 4 of its target for 10 HP over 4s'},
 radiantAegis:{id:'radiantAegis',name:'Radiant Aegis',ranks:1,requires:'dawnFlare',description:'Holy Light grants the nearest living ally within 5 of its enemy target a 12-HP shield for 3s'},
 arcWard:{id:'arcWard',name:'Arc Ward',ranks:1,requires:'arcSurge',description:'When a third Lightning chain jump hits, grant yourself a 12-HP shield for 4s'},
 stormRecovery:{id:'stormRecovery',name:'Storm Recovery',ranks:1,requires:'stormShelter',description:'Completing Lightning Storm additionally heals allies in its final area for 8'},
 returnShot:{id:'returnShot',name:'Return Shot',ranks:1,requires:'thirdRicochet',description:'Aimed Shot third ricochet sends an 8-damage arrow back to its original target if still alive'},
 thornfall:{id:'thornfall',name:'Thornfall',ranks:1,requires:'rainOfMercy',description:'Arrow Rain final wave leaves two 6-damage poison pulses in the same area'},
 solarAegis:{id:'solarAegis',name:'Solar Aegis',ranks:1,requires:'solarFlare',description:'LAZOR hitting at least one enemy also grants you a 15-HP shield for 3s'},
 embersOfLife:{id:'embersOfLife',name:'Embers of Life',ranks:1,requires:'blazingHorizon',description:'Each Ember Afterglow pulse that hits an enemy heals you for 4'},
 restorativeRhythm:{id:'restorativeRhythm',name:'Restorative Rhythm',ranks:1,requires:'unyieldingForce',description:'Healing Totem heals 3 more per pulse'},
 stoneSkinWard:{id:'stoneSkinWard',name:'Stone-Skin Ward',ranks:1,requires:'restorativeRhythm',description:'Healing Totem pulses shield the most injured ally within range for 6 HP over 2s'},
 spiritEcho:{id:'spiritEcho',name:'Spirit Echo',ranks:1,requires:'stoneSkinWard',description:'Earth Shock triggers an immediate 10-HP Healing Totem pulse to its most injured nearby ally'},
 sacredGrove:{id:'sacredGrove',name:'Sacred Grove',ranks:1,requires:'spiritEcho',description:'While both totem types are active, Fire Totem attacks deal 8 extra damage and Healing Totem heals 4 more'},
 menacingStab:{id:'menacingStab',name:'Menacing Stab',ranks:1,requires:'unyieldingForce',description:'Stab gives you 80 additional threat against the boss'},
 shieldSignal:{id:'shieldSignal',name:'Shield Signal',ranks:1,requires:'menacingStab',description:'Heroic Shield forces the boss to attack you one second longer'},
 fortressAura:{id:'fortressAura',name:'Fortress Aura',ranks:1,requires:'shieldSignal',description:'Bulwark also reduces damage to allies within 4 units by 15%'},
 unbrokenLine:{id:'unbrokenLine',name:'Unbroken Line',ranks:1,requires:'fortressAura',description:'Shielding an ally with Heroic Shield reduces your remaining Bulwark cooldown by 1.5s'},
 fadingStep:{id:'fadingStep',name:'Fading Step',ranks:1,requires:'unyieldingForce',description:'Vanish cuts your accumulated threat in half'},
 shadowGuard:{id:'shadowGuard',name:'Shadow Guard',ranks:1,requires:'fadingStep',description:'Vanish grants an 8-HP shield for 4 seconds'},
 openingStrike:{id:'openingStrike',name:'Opening Strike',ranks:1,requires:'shadowGuard',description:'Quick Stab during Vanish gains 16 damage and breaks stealth'},
 smokeReturn:{id:'smokeReturn',name:'Smoke Return',ranks:1,requires:'openingStrike',description:'Opening Strike refunds 1.2 seconds of Dash cooldown'},
 battleCry:{id:'battleCry',name:'Battle Cry',ranks:1,requires:'unyieldingForce',description:'Guard creates 80 additional threat against the boss'},
 holdGround:{id:'holdGround',name:'Hold Ground',ranks:1,requires:'battleCry',description:'Guard lasts an extra 0.4 seconds'},
 rallyingAdvance:{id:'rallyingAdvance',name:'Rallying Advance',ranks:1,requires:'holdGround',description:'Charging Stab shields the nearest other ally within 4 units for 12 over 3s'},
 frontlineLeader:{id:'frontlineLeader',name:'Frontline Leader',ranks:1,requires:'rallyingAdvance',description:'Sword Slash during Guard heals the nearest injured ally within 4 for 8'},
 sereneNova:{id:'sereneNova',name:'Serene Nova',ranks:1,requires:'unyieldingForce',description:'Holy Nova shields nearby allies for 8 over 3 seconds'},
 blessingOfSpeed:{id:'blessingOfSpeed',name:'Blessing of Speed',ranks:1,requires:'sereneNova',description:'Targeted Heal reduces the target ally remaining cooldowns by 0.25s'},
 prayerEcho:{id:'prayerEcho',name:'Prayer Echo',ranks:1,requires:'blessingOfSpeed',description:'Holy Light also restores 6 HP to its caster'},
 sanctuaryPulse:{id:'sanctuaryPulse',name:'Sanctuary Pulse',ranks:1,requires:'prayerEcho',description:'Holy Nova leaves an extra delayed 8-HP group heal pulse'},
 chargedAegis:{id:'chargedAegis',name:'Charged Aegis',ranks:1,requires:'unyieldingForce',description:'Lightning Shield grants its primary ally 10 HP absorb for 4s'},
 overchargedPulse:{id:'overchargedPulse',name:'Overcharged Pulse',ranks:1,requires:'chargedAegis',description:'Lightning Shield pulses deal 4 additional damage'},
 conduitMender:{id:'conduitMender',name:'Conduit Mender',ranks:1,requires:'overchargedPulse',description:'Each Lightning Shield pulse heals its protected ally for 3'},
 thunderhead:{id:'thunderhead',name:'Thunderhead',ranks:1,requires:'conduitMender',description:'Lightning Shield pulse radius grows from 3 to 4 units'},
 evasiveVolley:{id:'evasiveVolley',name:'Evasive Volley',ranks:1,requires:'unyieldingForce',description:'Landing at least one Split Shot arrow gives you an 8 HP shield for 2s'},
 quickRecovery:{id:'quickRecovery',name:'Quick Recovery',ranks:1,requires:'evasiveVolley',description:'Hitting two distinct targets with Split Shot refunds 0.5s of its cooldown'},
 windStep:{id:'windStep',name:'Wind Step',ranks:1,requires:'quickRecovery',description:'Dash also grants a 12 HP shield for 4s'},
 skirmishRhythm:{id:'skirmishRhythm',name:'Skirmish Rhythm',ranks:1,requires:'windStep',description:'After Dash, the next Split Shot within 3s fires one extra central 12-damage arrow'},
 rollingEmbers:{id:'rollingEmbers',name:'Rolling Embers',ranks:1,requires:'unyieldingForce',description:'Fireball hits apply two delayed 8-damage burn ticks'},
 flashIgnition:{id:'flashIgnition',name:'Flash Ignition',ranks:1,requires:'rollingEmbers',description:'Fireball hitting an enemy near one of your Fire Mines triggers that mine immediately'},
 ashShield:{id:'ashShield',name:'Ash Shield',ranks:1,requires:'flashIgnition',description:'A Fireball hit grants the caster a 10 HP shield for 3s'},
 wildfire:{id:'wildfire',name:'Wildfire',ranks:1,requires:'ashShield',description:'Fireball impact radius increases to 2.5 and adds one delayed 8-damage ember pulse'}
} as const;
export type TalentId=keyof typeof TALENT_NODES;
export type TalentProgress={wins:BossId[];picks:Partial<Record<ClassId,TalentId[]>>};
export const emptyTalents=():TalentProgress=>({wins:[],picks:{}});
const BRANCHES={
 shaman:[['restorativeRhythm','stoneSkinWard','spiritEcho','sacredGrove'],['partingGift','violentFarewell','funeralBloom','ancestralShelter'],['stormConduit','livingCurrent','stormRebound','stormMender']],
 defender:[['menacingStab','shieldSignal','fortressAura','unbrokenLine'],['guardianNetwork','shelteredHearts','shieldReprieve','aegisCommand'],['ironMarch','retaliatoryShell','thunderShell','bulwarkResonance']],
 rogue:[['fadingStep','shadowGuard','openingStrike','smokeReturn'],['shadowAmbush','shadowstep','rippleStab','cloakOfThorns'],['venomSpread','leechingVenom','venomCatalyst','toxicEcho']],
 warrior:[['battleCry','holdGround','rallyingAdvance','frontlineLeader'],['piercingCharge','impactWave','meteorWake','seismicRenewal'],['cleavingArc','defiantGuard','battleWard','guardianRiposte']],
 priest:[['sereneNova','blessingOfSpeed','prayerEcho','sanctuaryPulse'],['healingCascade','sacredEcho','aegisMend','secondBenediction'],['widerNova','avengingLight','dawnFlare','radiantAegis']],
 lightningMage:[['chargedAegis','overchargedPulse','conduitMender','thunderhead'],['forkedArc','arcOverload','arcSurge','arcWard'],['stormWell','stormAftershock','stormShelter','stormRecovery']],
 ranger:[['evasiveVolley','quickRecovery','windStep','skirmishRhythm'],['splitVolley','ricochetArrows','thirdRicochet','returnShot'],['rainSurge','lastDownpour','rainOfMercy','thornfall']],
 fireMage:[['rollingEmbers','flashIgnition','ashShield','wildfire'],['prismBeam','searingBeam','solarFlare','solarAegis'],['volatileMines','emberAfterglow','blazingHorizon','embersOfLife']]
} as const satisfies Record<ClassId,readonly (readonly TalentId[])[]>;
export const TALENT_TREE=Object.fromEntries((Object.keys(CLASS_DEFINITIONS) as ClassId[]).map(classId=>[
 classId,{classId,branches:BRANCHES[classId],nodes:[TALENT_NODES.unyieldingForce,...BRANCHES[classId].flat().map(id=>TALENT_NODES[id])]}
])) as unknown as Record<ClassId,{classId:ClassId;branches:readonly (readonly TalentId[])[];nodes:readonly (typeof TALENT_NODES[TalentId])[]}>;
export const TALENT_POINT_BOSSES=['warden','yellowBall','greenCone','fracturer','hardWarden','hardYellowBall','hardGreenCone','duoYellowWarden','duoTruffleFracturer','antQueen','chaosArena'] as const satisfies readonly BossId[];
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
