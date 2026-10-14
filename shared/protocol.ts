export type Vec2={x:number;z:number};
export const SKILLS={targetedHeal:{name:"Targeted Heal",description:"Heal ally or self for 40 within 11 units",cooldown:4500},holyLight:{name:"Holy Light",description:"32 single target holy damage",cooldown:900},lightningStorm:{name:"Lightning Storm",description:"Channel 3s: six 22 damage area pulses",cooldown:6500},lightningShield:{name:"Lightning Shield",description:"Ally/self: six nearby 14 damage pulses",cooldown:8000},aimedShot:{name:"Aimed Shot",description:"1s cast: 58 arrow damage",cooldown:1800},arrowRain:{name:"Arrow Rain",description:"Three targeted 28 damage waves",cooldown:5000},splitShot:{name:"Split Shot",description:"Three 22 damage arrows in a cone",cooldown:2200},fireball:{name:"Fireball",description:"2s cast: 100 damage, small area explosion",cooldown:2800},fireMine:{name:"Fire Mine",description:"Place a 95 damage proximity trap for 12s",cooldown:6500},swordSwing:{name:"Sword Slash",description:"38 damage frontal cleave - 3 units",cooldown:1100},chargingStab:{name:"Charging Stab",description:"Charge 5 units, then stab for 60 damage",cooldown:3600},lazor:{name:"LAZOR",description:"90 directional beam damage",cooldown:2400},arcBolt:{name:"Arc Blast",description:"18 ranged damage",cooldown:650},dash:{name:"Dash",description:"Move 3.5 units",cooldown:2600},pulseNova:{name:"Holy Nova",description:"45 close damage + heal nearby allies/self 18",cooldown:3200},guard:{name:"Guard",description:"75% mitigation for 1.6s",cooldown:4800},arcSpear:{name:"Arc Spear",description:"72 ranged damage",cooldown:2600},holyNova:{name:"Holy Nova",description:"Heal allies 25 HP within 4.5 units",cooldown:5000}} as const;
export type SkillId=keyof typeof SKILLS;
export type Loadout=[SkillId,SkillId,SkillId,SkillId];
export const DEFAULT_LOADOUT:Loadout=["arcBolt","dash","pulseNova","guard"];
export function validLoadout(v:unknown):v is Loadout{return Array.isArray(v)&&v.length===4&&v.every(x=>typeof x==="string"&&Object.prototype.hasOwnProperty.call(SKILLS,x))&&new Set(v).size===4}
export function baseLoadout(v:unknown):Loadout {
  if(!validLoadout(v))return [...DEFAULT_LOADOUT];
  const result:SkillId[]=v.map(x=>x==='arcSpear'?'arcBolt':x);
  const used=new Set<SkillId>();
  return result.map(x=>{if(used.has(x))x=(Object.keys(SKILLS) as SkillId[]).find(k=>k!=='arcSpear'&&!used.has(k)&&!result.includes(k))!;used.add(x);return x}) as Loadout;
}
export function encounterLoadout(base:Loadout,weapon:Weapon):Loadout{return base.map(x=>x==='arcBolt'&&weapon==='primitiveWand'?'arcSpear':x) as Loadout}
export type Weapon='primitiveWand'|null;
export type CastState={skill:SkillId;slot:number;endsAt:number;target:Vec2;targetId?:string;nextTick?:number};
export type PlayerState={id:string;name:string;classId:import("./classes").ClassId;pos:Vec2;facing:Vec2;hp:number;maxHp:number;alive:boolean;guardUntil:number;cast?:CastState;cooldowns:number[];loadout:Loadout;weapon:Weapon;head:'pointyHat'|null;offhand:'pointyOrb'|null;dashCharges:number;dashRechargeAt:number};
export type Telegraph={id:string;kind:"circle"|"line";pos:Vec2;radius?:number;direction?:Vec2;width?:number;length?:number;resolvesAt:number};
export type BossId="warden"|"yellowBall"|"greenCone";
export const ITEMS={cylinderTube:"Cylinder Tube",sphericalBall:"Spherical Ball",primitiveWand:"Primitive Wand",conicalTaper:"Conical Taper",pointyHat:"Pointy Hat",pointyOrb:"Pointy Orb"} as const;
export type AddState={id:string;pos:Vec2;hp:number;maxHp:number;attackAt:number};
export type CombatEffect={id:string;owner:string;skill:SkillId;pos:Vec2;targetId?:string;next:number;remaining:number;expires:number};
export type Snapshot={type:"snapshot";now:number;phase:"lobby"|"fight"|"won"|"wiped";players:PlayerState[];boss:{id:BossId;hp:number;maxHp:number;pos:Vec2;height:number};reward?:{id:string;material:"cylinderTube"|"sphericalBall"|"conicalTaper";players:string[]};adds:AddState[];telegraphs:Telegraph[];readyCount:number;effects:CombatEffect[]};
export type ClientMessage={type:"join";name:string;classId?:import("./classes").ClassId;loadout?:Loadout;boss?:BossId;inventory?:unknown}|{type:"input";seq:number;move:Vec2}|{type:"ability";slot:1|2|3|4;target?:Vec2;targetId?:string}|{type:"ready"};
export type ServerMessage=Snapshot|{type:"welcome";id:string}|{type:"event";text:string}|{type:"abilityFx";skill:SkillId;playerId:string;from:Vec2;to:Vec2};
