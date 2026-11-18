import {TrufflePoison} from './trufflePoison';
import {TrufflePatrol,moveHubPlayer,TRUFFLE_RADIUS,PLAYER_RADIUS} from './truffle';
import {BallEncounter,isBall} from './balls';
import {startAntQueen,tickAntQueen,royalGuardKilled,ANT_QUEEN_HP,ANT_ARENA_LIMIT} from './antQueen';
import {startChaos,tickChaos,chaosHealth,CHAOS_ARENA_LIMIT,CHAOS_BASE_HP,type ChaosState,chaosBoss} from './chaos';
import { classAbility,tickClassEffects } from './classCombat';
import { DEFAULT_CLASS_ID, readClass, gearEligible, resolveClassLoadout } from './classes';
import { readInventory,CLASS_ITEM_BONUS } from './inventory';
import {talentDamage,talentMitigation,emptyTalents,readTalents,unlockTalent,respecTalents,awardTalentWin,hasTalent,TALENT_NODES} from './talents';
import type {TalentId} from './talents';
import { CHAT_INTERVAL_MS, cleanChat, DEFAULT_LOADOUT, SKILLS, WARRIOR_DAMAGE, NETWORK_VERSION } from './protocol';
import type { PlayerState, ServerMessage, Snapshot, Telegraph, Vec2, AddState, CardinalDirection } from './protocol';

export function fractureQuadrant(pos:Vec2,centralCorridor=3):number {if(Math.abs(pos.x)<=centralCorridor||Math.abs(pos.z)<=centralCorridor)return -1;return pos.x>=0?(pos.z>=0?0:3):(pos.z>=0?1:2)}
export const CARDINAL_DIRECTIONS=['north','east','south','west'] as const satisfies readonly CardinalDirection[];
/** The Fracturer's new pattern leaves exactly one 90-degree compass sector safe.
 * Its center-to-edge axial corridors never overlap the collapsing corner tiles. */
export function fractureCardinal(pos:Vec2):CardinalDirection {
 if(Math.abs(pos.x)>Math.abs(pos.z))return pos.x>0?'east':'west';
 return pos.z>0?'north':'south';
}
export const distance = (a: Vec2, b: Vec2) => Math.hypot(a.x-b.x, a.z-b.z);
export const bossBaseHp=(boss:Snapshot['boss']['id'])=>boss==='chaosArena'?CHAOS_BASE_HP:boss==='hardWarden'?3000:boss==='hardYellowBall'?2400:boss==='hardGreenCone'?3000:boss==='antQueen'?ANT_QUEEN_HP:boss==='fracturer'?2500:1800;
export const partyBossMultiplier=(playerCount:number)=>1+Math.max(0,playerCount-1)*.5;
const clamp = (n: number,limit=12) => Math.max(-limit, Math.min(limit,n));
const unit = (v: Vec2): Vec2 => { const l=Math.hypot(v.x,v.z); return l ? {x:v.x/l,z:v.z/l} : {x:0,z:0}; };
export function beamHits(from:Vec2, dir:Vec2, target:Vec2, length=14, radius=1.6) {
  const x=target.x-from.x,z=target.z-from.z,t=Math.max(0,Math.min(length,x*dir.x+z*dir.z));
  return Math.hypot(x-dir.x*t,z-dir.z*t)<=radius;
}
import { HARD_PILLARS } from './protocol';
export { HARD_PILLARS } from './protocol';
import {clipPillars,pillarOccludes} from './cover';
export {pillarOccludes} from './cover';
// Sweep in small steps to prevent tunnelling, then project onto the collision boundary for sliding.
export function moveSolid(pos:Vec2, delta:Vec2, boss:Vec2,pillars:Vec2[]=[],bossRadius=1.73,arenaLimit=12):Vec2 {
  let p={...pos}; const steps=Math.max(1,Math.ceil(Math.hypot(delta.x,delta.z)/.08));
  for(let i=0;i<steps;i++) {
    p={x:clamp(p.x+delta.x/steps,arenaLimit),z:clamp(p.z+delta.z/steps,arenaLimit)};
    if(arenaLimit>12){const radius=Math.hypot(p.x,p.z);if(radius>arenaLimit)p={x:p.x*arenaLimit/radius,z:p.z*arenaLimit/radius};}
    for(const body of [boss,...pillars]){const radius=body===boss?bossRadius:1.48;const dx=p.x-body.x,dz=p.z-body.z,l=Math.hypot(dx,dz);
    if(l<radius)p={x:clamp(body.x+(l?dx/l:1)*radius,arenaLimit),z:clamp(body.z+(l?dz/l:0)*radius,arenaLimit)};}
  } return p;
}
// Center-based 120-degree cleave; a stab uses a narrower forward reach.
export function meleeHits(from:Vec2,dir:Vec2,target:Vec2,reach=3,cosine=.5){
 const d=distance(from,target);return d>0&&d<=reach&&((target.x-from.x)*dir.x+(target.z-from.z)*dir.z)/d>=cosine;
}
// Charge stops at the first solid body rather than sliding or tunnelling through it.
export function chargeEnd(from:Vec2,dir:Vec2,boss:Vec2,adds:AddState[],length=5,pillars:Vec2[]=[],arenaLimit=12):Vec2 {
 let p={...from};for(let travelled=0;travelled<length;travelled+=.05){
  const step=Math.min(.05,length-travelled),next={x:p.x+dir.x*step,z:p.z+dir.z*step};
  if(Math.abs(next.x)>arenaLimit||Math.abs(next.z)>arenaLimit||(arenaLimit>12&&Math.hypot(next.x,next.z)>arenaLimit)||distance(next,boss)<1.73||pillars.some(c=>distance(next,c)<1.48)||adds.some(a=>a.hp>0&&distance(next,a.pos)<(a.radius??.42)+.48))break;
  p=next;
 }return p;
}
type Motion={kind:'roll'|'bounce';from:Vec2;to:Vec2;start:number;end:number;hit:Set<string>};
export class Game {
  queenWave=0;royalsDefeated=0;nextAntWaveAt=0;nextAntRockfallAt=0;
  hardWardenCall:import('./protocol').Snapshot['hardWardenCall'];nextHardWardenCallAt=0;
  arenaCuts:import('./protocol').ArenaCut[]=[];fracturerSurge:import('./protocol').FracturerSurge|undefined;nextFracturerSurgeAt=0;fracturerSurgeIndex=0;nextCollapseAt=0;nextDuoAt=0;bonusRewards:NonNullable<Snapshot['reward']>[]=[];talentAward:Snapshot['talentAward'];
  trainingDummies:import('./protocol').TrainingDummy[]=[{id:'west-1',pos:{x:-11,z:-2},hp:500,maxHp:500,respawnAt:0},{id:'west-2',pos:{x:-11,z:0},hp:500,maxHp:500,respawnAt:0},{id:'west-3',pos:{x:-11,z:2},hp:500,maxHp:500,respawnAt:0}];
  poison=new TrufflePoison();
  bossScale=1;chaosState?:ChaosState;
  threat=new Map<string,number>();
  forcedTarget?:{id:string;until:number};
  currentTargetId?:string;
  addThreat(id:string,amount:number){if(this.phase!=='fight'||!this.players.get(id)?.alive||amount<=0)return;
    const player=this.players.get(id)!;
    const factor=player.classId==='defender'?1.5:player.classId==='warrior'?1.25:1;
    this.threat.set(id,(this.threat.get(id)??0)+amount*factor);
  }
  taunt(id:string,now:number,duration:number){
    if(!this.players.get(id)?.alive)return;
    const top=Math.max(0,...this.threat.values());
    this.threat.set(id,Math.max(this.threat.get(id)??0,top+80));
    this.forcedTarget={id,until:now+duration};this.currentTargetId=id;
  }
  selectTarget(now:number,from:Vec2,visibleOnly=true){
    const candidates=[...this.players.values()].filter(p=>p.alive&&(!visibleOnly||p.invisibleUntil<=now));
    const forced=this.forcedTarget&&this.forcedTarget.until>now?candidates.find(p=>p.id===this.forcedTarget!.id):undefined;
    if(forced)return forced;
    if(!candidates.some(p=>(this.threat.get(p.id)??0)>0))return undefined;
    const scored=candidates.sort((a,b)=>{
      const va=(this.threat.get(a.id)??0)/(1+distance(a.pos,from)*.025),vb=(this.threat.get(b.id)??0)/(1+distance(b.pos,from)*.025);
      return vb-va||distance(a.pos,from)-distance(b.pos,from);
    });
    const leader=scored[0],current=candidates.find(p=>p.id===this.currentTargetId);
    if(!leader)return;
    const currentScore=current?(this.threat.get(current.id)??0)/(1+distance(current.pos,from)*.025):0;
    const leaderScore=(this.threat.get(leader.id)??0)/(1+distance(leader.pos,from)*.025);
    const chosen=current&&currentScore>0&&leaderScore<currentScore*1.15?current:leader;
    this.currentTargetId=chosen.id;return chosen;
  }
  meterStartedAt=0;meterElapsedMs=0;damageTotals=new Map<string,number>();healingTotals=new Map<string,number>();
  recordDamage(source:string|undefined,amount:number){if(source&&amount>0&&this.phase==='fight')this.damageTotals.set(source,(this.damageTotals.get(source)??0)+amount);}
  heal(target:PlayerState,amount:number,source?:string){if(!target.alive||amount<=0)return 0;const before=target.hp;target.hp=Math.min(target.maxHp,target.hp+amount);const restored=target.hp-before;if(source&&restored>0&&this.phase==='fight')this.healingTotals.set(source,(this.healingTotals.get(source)??0)+restored);if(source)this.addThreat(source,restored*.35);return restored;}
  burstTotem(t:import('./protocol').TotemState,now:number){
    const owner=this.players.get(t.owner);
    if(!owner?.alive)return;
    const expired=now>=t.expires,broken=t.hp<=0;
    if(!(expired||broken)||!hasTalent(owner.talents,'shaman','partingGift')||!(expired||hasTalent(owner.talents,'shaman','violentFarewell')))return;
    if(this.phase==='fight')this.area(t.pos,3,30,t.owner);
    else if(this.phase==='lobby')for(const dummy of this.trainingDummies)if(dummy.hp>0&&distance(dummy.pos,t.pos)<=3){
      dummy.hp=Math.max(0,dummy.hp-30);
      if(dummy.hp===0)dummy.respawnAt=now+5000;
    }
    if(this.talented(owner,'funeralBloom'))for(const ally of this.players.values())
      if(ally.alive&&distance(ally.pos,t.pos)<=3)this.heal(ally,10,t.owner);
    if(this.talented(owner,'ancestralShelter'))for(const ally of this.players.values())
      if(ally.alive&&distance(ally.pos,t.pos)<=3){ally.shield=Math.max(ally.shield,10);ally.shieldUntil=now+4000;}
    this.emit({type:'abilityFx',skill:'pulseNova',playerId:t.owner,from:{...t.pos},to:{...t.pos}});
  }
  hubNpc=new TrufflePatrol();
  balls=new BallEncounter(this);
  players=new Map<string,PlayerState>();
  moves=new Map<string,{v:Vec2;at:number;seq:number}>();
  ready=new Set<string>(); phase:Snapshot['phase']='lobby';
  selectionLocked=false;
  vote?:import('./protocol').EncounterVote;
  voteSerial=0;
  totems:import('./protocol').TotemState[]=[];
  scatter:{at:number;targetId:string}[]=[];
  initialized=new Set<string>();
  chatSent=new Map<string,number>();
  system(text:string){this.emit({type:"chat",senderId:null,name:"System",text})}
  effects:import('./protocol').CombatEffect[]=[];
  adds:AddState[]=[];lastTick=0;burns=new Map<string,{target:string;next:number;remaining:number}>();
  boss:Snapshot['boss']={id:'warden',hp:1800,maxHp:1800,pos:{x:0,z:0},height:0};
  telegraphs:Telegraph[]=[]; reward:Snapshot['reward']; next=0; mechanic=0; fightId=''; motion?:Motion;
  emit:(m:ServerMessage)=>void;
  uuid:()=>string;
  readonly liveTalents:boolean;
  talented(p:PlayerState,node:TalentId){return this.liveTalents&&hasTalent(p.talents,p.classId,node);}
  constructor(emit:(m:ServerMessage)=>void,uuid:()=>string,liveTalents=false) {this.emit=emit;this.uuid=uuid;this.liveTalents=liveTalents;}
  add(id:string) {
    this.cancelVote();
    const p:PlayerState={id,name:'Player',classId:DEFAULT_CLASS_ID,pos:{x:0,z:8},facing:{x:0,z:-1},hp:100,maxHp:100,alive:true,guardUntil:0,bulwarkUntil:0,invisibleUntil:0,poisonUntil:0,shield:0,shieldUntil:0,armour:null,cooldowns:[0,0,0,0],loadout:resolveClassLoadout(DEFAULT_CLASS_ID,DEFAULT_LOADOUT,null),weapon:null,head:null,offhand:null,boots:null,dashCharges:1,dashRechargeAt:0,talents:emptyTalents()};
    if(this.phase==='lobby')p.pos={x:this.players.size%5*1.2,z:8};
    else if(this.boss.id==='antQueen'){p.pos={x:(this.players.size%4-1.5)*1.3,z:-10.5};p.facing={x:0,z:1};}
    else if(this.boss.id==='chaosArena'){p.pos={x:(this.players.size%4-1.5)*2,z:-17};p.facing={x:0,z:1};}
    this.players.set(id,p);return p;
  }
  remove(id:string) {const p=this.players.get(id);if(p&&this.initialized.has(id))this.system(`${p.name} left the room.`);this.chatSent.delete(id);this.poison.remove(id);this.cancelVote();this.totems=this.totems.filter(t=>t.owner!==id);this.effects=this.effects.filter(e=>e.owner!==id);this.initialized.delete(id);this.players.delete(id);this.moves.delete(id);this.ready.delete(id);if(!this.players.size){this.boss.id='warden';this.reset();this.selectionLocked=false;}}
  reset() {
    this.queenWave=0;this.royalsDefeated=0;this.nextAntWaveAt=0;this.nextAntRockfallAt=0;this.hardWardenCall=undefined;this.nextHardWardenCallAt=0;
    this.arenaCuts=[];this.fracturerSurge=undefined;this.nextFracturerSurgeAt=0;this.fracturerSurgeIndex=0;this.nextCollapseAt=0;this.nextDuoAt=0;this.bonusRewards=[];this.talentAward=undefined;
    this.poison.clear();this.threat.clear();this.forcedTarget=undefined;this.currentTargetId=undefined;this.bossScale=1;this.chaosState=undefined;this.meterStartedAt=0;this.meterElapsedMs=0;this.damageTotals.clear();this.healingTotals.clear();
    this.balls=new BallEncounter(this);this.vote=undefined;this.scatter=[];this.totems=[];
    this.effects=[];for(const p of this.players.values()){p.cast=undefined;this.clearBuffs(p);p.skirmishUntil=undefined;}this.adds=[];this.burns.clear();this.lastTick=0;this.phase='lobby';this.boss.hp=this.boss.maxHp=bossBaseHp(this.boss.id);this.boss.pos={x:0,z:0};this.boss.height=0;this.motion=undefined;this.boss.smash=undefined;this.boss.stride=0;this.boss.walking=false;this.boss.heading=0;
    this.telegraphs=[];this.ready.clear();this.reward=undefined;this.moves.clear();let i=0;
    for(const p of this.players.values()) {const a=i++/this.players.size*Math.PI*2;p.pos={x:Math.cos(a)*7,z:Math.sin(a)*7};if(distance(p.pos,this.hubNpc.state.pos)<TRUFFLE_RADIUS+PLAYER_RADIUS)p.pos={x:0,z:8};p.hp=100;p.alive=true;p.cooldowns=[0,0,0,0];p.guardUntil=0;this.clearBuffs(p);p.dashCharges=p.head==='pointyHat'?3:1;p.dashRechargeAt=0;p.retaliationAt=undefined;p.skirmishUntil=undefined;}
  }
  message(id:string,m:unknown,now=Date.now()) {
    const p=this.players.get(id);if(!p||!m||typeof m!=='object')return;
    const v=m as Record<string,unknown>;
    if(v.type==='chat'){
      const text=cleanChat(v.text),last=this.chatSent.get(id);
      if(text&&(last===undefined||now-last>=CHAT_INTERVAL_MS)){this.chatSent.set(id,now);this.emit({type:'chat',senderId:id,name:p.name,text});}return;
    }
    if(v.type==='join'&&(!this.vote||!this.vote.accepted.includes(id))&&(!this.initialized.has(id)||(this.phase!=='fight'&&!this.ready.has(id)))) {
      const first=!this.initialized.has(id);this.initialized.add(id);
      if(typeof v.name==='string')p.name=cleanChat(v.name,24)||'Player';
      if(first)this.system(`${p.name} joined the room.`);
      const inventory=readInventory(JSON.stringify(v.inventory??null));
      this.clearBuffs(p);p.classId=readClass(v.classId);p.cast=undefined;p.cooldowns=[0,0,0,0];
      p.armour=inventory.armour&&gearEligible(p.classId,inventory.armour)?inventory.armour:null;p.weapon=inventory.weapon&&gearEligible(p.classId,inventory.weapon)?inventory.weapon:null;p.head=inventory.head&&gearEligible(p.classId,inventory.head)?inventory.head:null;p.offhand=inventory.offhand&&gearEligible(p.classId,inventory.offhand)?inventory.offhand:null;p.boots=inventory.boots&&gearEligible(p.classId,inventory.boots)?inventory.boots:null;p.dashCharges=p.head==='pointyHat'?3:1;p.dashRechargeAt=0;
      p.loadout=resolveClassLoadout(p.classId,v.loadout,p.weapon);
      // Progress is validated on rejoin. Room victories remain authoritative during a session.
      // Apply the browser save on first join only. Later loadout/gear syncs must
      // never overwrite talent purchases or first-clear rewards earned in this room.
      if(first)p.talents=readTalents(v.talents);
      // First entrant owns the selection. All later entrants use the room's boss.
      if(this.phase==='lobby'&&!this.selectionLocked&&(v.boss==='warden'||v.boss==='hardWarden'||v.boss==='hardYellowBall'||v.boss==='yellowBall'||v.boss==='greenCone'||v.boss==='hardGreenCone'||v.boss==='fracturer'||v.boss==='antQueen'||v.boss==='chaosArena'||v.boss==='duoYellowWarden'||v.boss==='duoTruffleFracturer')) {this.boss.id=v.boss;this.boss.hp=this.boss.maxHp=bossBaseHp(v.boss);this.selectionLocked=true;}
    }
    if(v.type==='talent'&&this.phase==='lobby'&&typeof v.classId==='string'&&typeof v.action==='string'){
      const cls=v.classId as import('./classes').ClassId;
      if(v.action==='respec')respecTalents(p.talents??=emptyTalents(),cls);
      else if(v.action==='unlock'&&typeof v.nodeId==='string'&&Object.hasOwn(TALENT_NODES,v.nodeId))unlockTalent(p.talents??=emptyTalents(),cls,v.nodeId as TalentId);
      return;
    }
    if(v.type==='practice'&&this.phase==='lobby'&&Number.isInteger(v.slot)&&Number(v.slot)>=1&&Number(v.slot)<=4){
      const slot=Number(v.slot)-1,skill=p.loadout[slot];
      if(!skill||!p.alive||now<p.cooldowns[slot])return;
      const dummy=typeof v.dummyId==='string'?this.trainingDummies.find(d=>d.id===v.dummyId&&d.hp>0&&distance(p.pos,d.pos)<=8):undefined;
      const from={...p.pos};
      let to=dummy?{...dummy.pos}:{x:Math.max(-12,Math.min(12,p.pos.x+p.facing.x*3)),z:Math.max(-10,Math.min(10,p.pos.z+p.facing.z*3))};
      if(skill==='dash'){p.pos=moveHubPlayer(p.pos,{x:p.facing.x*3.5,z:p.facing.z*3.5},this.hubNpc.state.pos);to={...p.pos};p.dashCharges=0;p.dashRechargeAt=now+SKILLS.dash.cooldown;}
      else if(skill==='targetedHeal')this.heal(p,p.offhand==='sunlitReliquary'?55:40,p.id);
      else if(skill==='fireTotem'||skill==='healingTotem'){
        this.totems=this.totems.filter(t=>t.owner!==id||t.kind!==skill);
        this.totems.push({id:this.uuid(),owner:id,kind:skill,pos:{...to},hp:1,next:now+1000,expires:now+15000,poisoned:skill==='fireTotem'&&p.offhand==='sporeboundTotem'});
      }
      else if(skill==='pulseNova'||skill==='holyNova'){
        const heal=skill==='pulseNova'?18:skill==='holyNova'?25:p.offhand==='verdantMenderTotem'?16:8;
        for(const ally of this.players.values())if(distance(ally.pos,p.pos)<=4.5)this.heal(ally,heal,p.id);
      }else if(skill==='bulwark')p.bulwarkUntil=now+(p.offhand==='bulwarkCrest'?8000:6000);
      else if(skill==='guard')p.guardUntil=now+1600;
      else if(skill==='vanish')p.invisibleUntil=now+4000;
      else if(skill==='poisonEnchant')p.poisonUntil=now+6000;
      const damage:Partial<Record<import('./protocol').SkillId,number>>={earthShock:36,stab:32,quickStab:32,backstab:42,holyLight:32,aimedShot:58,arrowRain:84,splitShot:66,fireball:140,fireMine:95,swordSwing:WARRIOR_DAMAGE.swordSwing,chargingStab:WARRIOR_DAMAGE.chargingStab,lazor:90,arcBolt:18,arcSpear:72,pulseNova:45,lightningStorm:132,lightningShield:84,fireTotem:24};
      let amount=damage[skill]??0;
      if(p.weapon==='sporefangQuiver'&&skill==='aimedShot')amount=100;
      if(p.armour==='sporestormQuiver'&&skill==='arrowRain')amount=105;
      if(p.head==='splitthornQuiver'&&skill==='splitShot')amount=80;
      if(p.offhand==='sporeboundTotem'&&skill==='fireTotem')amount=24;
      if(dummy&&amount>0){dummy.hp=Math.max(0,dummy.hp-amount);if(dummy.hp===0)dummy.respawnAt=now+5000;}
      p.cooldowns[slot]=now+SKILLS[skill].cooldown;
      this.emit({type:'abilityFx',skill,playerId:id,from,to});
      return;
    }
    if(v.type==='input'&&Number.isSafeInteger(v.seq)&&Number(v.seq)>=0&&v.move&&typeof v.move==='object') {
      const move=v.move as Vec2;
      if(typeof move.x==='number'&&typeof move.z==='number'&&Number.isFinite(move.x)&&Number.isFinite(move.z)&&Math.abs(move.x)<=1&&Math.abs(move.z)<=1) {
        const old=this.moves.get(id);if(!old||Number(v.seq)>old.seq)this.moves.set(id,{v:unit(move),at:now,seq:Number(v.seq)});
      }
    }
    if(v.type==='hub'){this.cancelVote();if(this.phase!=='lobby'){this.reset();this.system('Returned to the hub.');}return;}
    if(v.type==='propose'){if(typeof v.boss==='string'&&['warden','hardWarden','hardYellowBall','yellowBall','greenCone','hardGreenCone','fracturer','antQueen','chaosArena','duoYellowWarden','duoTruffleFracturer'].includes(v.boss)){if(this.phase==='fight')this.system('Cannot propose a new boss during an encounter.');else if(this.vote)this.system('A boss vote is already active; accept or decline it first.');else this.propose(v.boss as Snapshot['boss']['id'],now);}else this.system('Unknown boss selection. Reload the game and check the deployed version.');}
    // Legacy ready may propose, but cannot cast an acceptance without the current proposal ID.
    if(v.type==='ready'&&!this.vote&&this.phase!=='fight')this.propose(this.boss.id,now);
    if(v.type==='vote'&&this.vote&&v.proposalId===this.vote.id&&typeof v.accept==='boolean'&&now<this.vote.expires&&this.vote.voters.includes(id)){
      if(!v.accept){this.cancelVote();return;}
      if(!this.vote.accepted.includes(id))this.vote.accepted.push(id);
      if(this.vote.accepted.length===this.vote.voters.length){const boss=this.vote.boss;if(this.phase!=='lobby')this.reset();this.vote=undefined;this.boss.id=boss;this.bossScale=partyBossMultiplier(this.players.size);this.threat.clear();this.forcedTarget=undefined;this.currentTargetId=undefined;
        this.boss.hp=this.boss.maxHp=bossBaseHp(boss)*this.bossScale;this.phase='fight';this.arenaCuts=[];this.fracturerSurge=undefined;this.fracturerSurgeIndex=0;this.nextFracturerSurgeAt=now+11000;this.bonusRewards=[];this.talentAward=undefined;this.nextDuoAt=now+4500;this.nextHardWardenCallAt=boss==='hardWarden'?now+14000:0;this.nextCollapseAt=boss==='fracturer'||boss==='duoTruffleFracturer'?now+7000:0;this.meterStartedAt=now;this.meterElapsedMs=0;this.damageTotals.clear();this.healingTotals.clear();this.system('Encounter started: '+boss);this.poison=new TrufflePoison(boss==='hardGreenCone');if(boss==='greenCone'||boss==='hardGreenCone'||boss==='duoTruffleFracturer')this.poison.start(now);this.lastTick=now;this.fightId=this.uuid();this.next=now+2200;this.mechanic=0;if(boss==='duoYellowWarden'||boss==='duoTruffleFracturer'){this.boss.pos={x:-3,z:0};this.adds=[{id:'duo-partner',kind:'duoBoss',bossId:boss==='duoYellowWarden'?'yellowBall':'fracturer',pos:{x:3,z:0},hp:(boss==='duoYellowWarden'?1800:2500)*this.bossScale,maxHp:(boss==='duoYellowWarden'?1800:2500)*this.bossScale,attackAt:now+4500}];}if(boss==='antQueen')startAntQueen.call(this,now);if(boss==='chaosArena')startChaos.call(this,now);for(const key of this.players.keys())this.initialized.add(key);}
    }
    if(v.type==='ability'&&this.phase==='fight'&&p.alive&&Number.isInteger(v.slot)&&Number(v.slot)>=1&&Number(v.slot)<=4)this.ability(p,Number(v.slot),now,v.target,v.targetId);
  }
  cancelVote(){if(this.vote){this.vote=undefined;this.ready.clear();this.emit({type:'event',text:'Encounter vote cancelled.'});this.system('Encounter vote cancelled.');}}
  propose(boss:Snapshot['boss']['id'],now:number){
    if(this.phase==='fight'||this.vote)return;
    this.system('Boss vote opened: '+boss);
    this.vote={id:this.uuid()+':'+(++this.voteSerial),boss,expires:now+30000,voters:[...this.players.keys()],accepted:[]};
  }
  visible(from:Vec2,to:Vec2){return this.boss.id!=='hardWarden'||!pillarOccludes(from,to)}
  clip(from:Vec2,to:Vec2){return this.boss.id==='hardWarden'?clipPillars(from,to):{...to};}
  ability(p:PlayerState,slot:number,now:number,point?:unknown,targetId?:unknown) {
    const skill=p.loadout[slot-1];if(p.cast&&skill!=='dash')return;if(skill==='dash')p.cast=undefined;
    if(this.classAbility(p,slot,now,point,targetId))return;this.recharge(p,now);if(skill==='dash'?p.dashCharges===0:now<p.cooldowns[slot-1])return;
    const d=distance(p.pos,this.boss.pos);
    const target=this.targets().sort((a,b)=>distance(p.pos,a.pos)-distance(p.pos,b.pos))[0];
    if((skill==='arcBolt'||skill==='arcSpear')&&(!target||distance(p.pos,target.pos)>11))return;
    p.cooldowns[slot-1]=now+SKILLS[skill].cooldown+(skill==='lazor'&&p.offhand==='pointyOrb'?2000:0);const from={...p.pos};let to={...p.pos},damage=0;
    if(skill==='dash'){p.dashCharges--;if(!p.dashRechargeAt)p.dashRechargeAt=now+SKILLS.dash.cooldown;p.cooldowns[slot-1]=p.dashCharges?0:p.dashRechargeAt;}
    if(skill==='dash'){
      p.pos=this.movePlayer(p.pos,{x:p.facing.x*3.5,z:p.facing.z*3.5});
      if(this.talented(p,'windStep')){p.shield=Math.max(p.shield,12);p.shieldUntil=now+4000;}
      if(this.talented(p,'skirmishRhythm'))p.skirmishUntil=now+3000;
    }
    if(skill==='chargingStab')p.pos=chargeEnd(from,p.facing,this.solidBoss(),this.adds,p.boots==='twinrushBoots'?7:5,this.pillars(),this.arenaLimit());
    if(skill==='swordSwing'||skill==='chargingStab') {
      const origin=skill==='chargingStab'?p.pos:from,reach=skill==='chargingStab'?2.2:p.armour==='redtubeArmour'?4:this.talented(p,'cleavingArc')?3.7:3,angle=skill==='chargingStab'?.85:p.armour==='redtubeArmour'?0:this.talented(p,'cleavingArc')?.15:.5;
      to={x:origin.x+p.facing.x*reach,z:origin.z+p.facing.z*reach};
      if(this.visible(origin,this.boss.pos)&&meleeHits(origin,p.facing,this.boss.pos,reach,angle))damage=skill==='swordSwing'?WARRIOR_DAMAGE.swordSwing:WARRIOR_DAMAGE.chargingStab;
      for(const a of this.adds)if(a.hp>0&&this.visible(origin,a.pos)&&meleeHits(origin,p.facing,a.pos,reach,angle))this.damageTarget(a.id,skill==='swordSwing'?WARRIOR_DAMAGE.swordSwing:WARRIOR_DAMAGE.chargingStab,p.id);
      if(skill==='swordSwing'&&this.talented(p,'frontlineLeader')&&p.guardUntil>now&&
          this.targets().some(t=>this.visible(origin,t.pos)&&meleeHits(origin,p.facing,t.pos,reach,angle))){
        const ally=[...this.players.values()].filter(a=>a.alive&&a.hp<a.maxHp&&distance(a.pos,p.pos)<=4)
          .sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
        if(ally)this.heal(ally,8,p.id);
      }
    }
    if(skill==='chargingStab'){
      if(this.talented(p,'rallyingAdvance')){
        const ally=[...this.players.values()].filter(a=>a.alive&&a.id!==p.id&&distance(a.pos,p.pos)<=4)
          .sort((a,b)=>distance(a.pos,p.pos)-distance(b.pos,p.pos))[0];
        if(ally){ally.shield=Math.max(ally.shield,12);ally.shieldUntil=now+3000;}
      }
      const travel=distance(from,p.pos);
      if(this.talented(p,'piercingCharge'))for(const t of this.targets())
        if(this.visible(from,t.pos)&&beamHits(from,p.facing,t.pos,travel,1.1))this.damageTarget(t.id,22,p.id);
      if(this.talented(p,'seismicRenewal')){
        const radius=3;
        const hits=this.targets().filter(t=>t.hp>0&&distance(p.pos,t.pos)<=radius&&this.visible(p.pos,t.pos)).length;
        if(hits)this.heal(p,Math.min(20,hits*5),p.id);
      }
      if(this.talented(p,'impactWave'))this.area(p.pos,this.talented(p,'meteorWake')?3:2.5,this.talented(p,'meteorWake')?22:18,p.id);
      if(p.boots==='antLegGreaves')this.area(p.pos,2.5,20,p.id);
    }
    // Prism Lens replaces LAZOR's central beam; Prism Beam adds weaker flanking rays.
    if(skill==='lazor'){
      const prism=p.offhand==='prismLens';
      const rays=prism?[[-.23,60],[.23,60]]:[[0,90]];
      if(this.talented(p,'prismBeam'))rays.push([-.36,20],[.36,20]);
      let flareTarget:Vec2|undefined;
      for(const [angle,power] of rays){
        const dir={x:p.facing.x*Math.cos(angle)-p.facing.z*Math.sin(angle),z:p.facing.x*Math.sin(angle)+p.facing.z*Math.cos(angle)};
        for(const t of this.targets())if(this.beamHits(from,dir,t.pos,14,prism?1.05:1.6)){
          this.damageTarget(t.id,power,p.id);
          if(!flareTarget)flareTarget={...t.pos};
          const ticks=p.offhand==='pointyOrb'?4:this.talented(p,'searingBeam')?2:0;
          if(ticks){const key=p.id+':'+t.id,old=this.burns.get(key);this.burns.set(key,{target:t.id,next:now+1000,remaining:Math.max(old?.remaining??0,ticks)});}
        }
        this.emit({type:'abilityFx',skill,playerId:p.id,from,to:this.clip(from,{x:from.x+dir.x*14,z:from.z+dir.z*14})});
      }
      if(this.talented(p,'solarFlare')&&flareTarget)this.area(flareTarget,2,18,p.id);
      if(this.talented(p,'solarAegis')&&flareTarget){p.shield=Math.max(p.shield,15);p.shieldUntil=now+3000;}
      return;
    }
    if(skill==='arcBolt'||skill==='arcSpear') {damage=this.visible(from,target.pos)?(skill==='arcBolt'?18:72):0;to=this.clip(from,target.pos);}
    if(skill==='pulseNova'){
      const radius=this.talented(p,'widerNova')?5.5:4.5;
      for(const a of this.players.values())if(a.alive&&this.visible(p.pos,a.pos)&&distance(a.pos,p.pos)<=radius){
        this.heal(a,this.talented(p,'widerNova')?22:18,p.id);
        if(this.talented(p,'sereneNova')){a.shield=Math.max(a.shield,8);a.shieldUntil=now+3000;}
      }
      if(this.talented(p,'sanctuaryPulse'))this.effects.push({id:this.uuid(),owner:p.id,skill:'pulseNova',pos:{...p.pos},next:now+1000,remaining:1,expires:now+1600,healingField:true,damage:8});
      if(d<=radius-.3&&this.visible(from,this.boss.pos))damage=45;
      if(p.head==='haloOfRenewal')this.effects.push({id:this.uuid(),owner:p.id,skill:'pulseNova',pos:{...p.pos},next:now+1000,remaining:3,expires:now+3500,healingField:true});
    }
    if(skill==='guard'){
      p.guardUntil=now+(this.talented(p,'holdGround')?2000:1600);this.taunt(p.id,now,2000);
      if(this.talented(p,'battleCry'))this.addThreat(p.id,80);
      if(this.talented(p,'defiantGuard'))this.heal(p,10,p.id);
      if(this.talented(p,'battleWard')){
        const ally=[...this.players.values()].filter(a=>a.id!==p.id&&a.alive&&distance(a.pos,p.pos)<=4)
          .sort((a,b)=>distance(a.pos,p.pos)-distance(b.pos,p.pos))[0];
        if(ally){ally.shield=Math.max(ally.shield,20);ally.shieldUntil=now+2000;}
      }
      if(this.talented(p,'guardianRiposte')){
        const enemy=this.targets().filter(t=>distance(t.pos,p.pos)<=2.5&&this.visible(p.pos,t.pos))
          .sort((a,b)=>distance(a.pos,p.pos)-distance(b.pos,p.pos))[0];
        if(enemy)this.damageTarget(enemy.id,12,p.id);
      }
    }
    if(skill==='holyNova'){
      for(const a of this.players.values())if(a.alive&&this.visible(p.pos,a.pos)&&distance(a.pos,p.pos)<=4.5){
        this.heal(a,25,p.id);
        if(this.talented(p,'sereneNova')){a.shield=Math.max(a.shield,8);a.shieldUntil=now+3000;}
      }
      if(this.talented(p,'sanctuaryPulse'))this.effects.push({id:this.uuid(),owner:p.id,skill:'holyNova',pos:{...p.pos},next:now+1000,remaining:1,expires:now+1600,healingField:true,damage:8});
    }
    if(skill==='arcBolt'||skill==='arcSpear'){
      this.damageTarget(target.id,damage,p.id);
      const second=this.targets().filter(t=>t.id!==target.id&&distance(target.pos,t.pos)<=5&&this.visible(target.pos,t.pos))
        .sort((a,b)=>distance(target.pos,a.pos)-distance(target.pos,b.pos))[0];
      if(second){
        if(p.offhand==='splitConductor')this.damageTarget(second.id,25,p.id);
        if(p.offhand==='antennaSpindle')this.damageTarget(second.id,16,p.id);
        if(this.talented(p,'forkedArc')){
          this.damageTarget(second.id,damage*.4,p.id);
          this.emit({type:'abilityFx',skill,playerId:p.id,from:target.pos,to:second.pos});
          if(this.talented(p,'arcOverload')){
            const third=this.targets().filter(t=>t.id!==target.id&&t.id!==second.id&&distance(second.pos,t.pos)<=5&&this.visible(second.pos,t.pos))
              .sort((a,b)=>distance(second.pos,a.pos)-distance(second.pos,b.pos))[0];
            if(third){
              this.damageTarget(third.id,damage*.2+(this.talented(p,'arcSurge')?15:0),p.id);
              this.emit({type:'abilityFx',skill,playerId:p.id,from:second.pos,to:third.pos});
              if(this.talented(p,'arcWard')){p.shield=Math.max(p.shield,12);p.shieldUntil=now+4000;}
            }
          }
        }else if(p.offhand==='splitConductor'||p.offhand==='antennaSpindle')this.emit({type:'abilityFx',skill,playerId:p.id,from:target.pos,to:second.pos});
      }
    }
    else this.damageTarget('boss',damage,p.id);
    for(const a of this.adds)if(a.hp>0&&skill==='pulseNova'&&this.visible(from,a.pos)&&distance(from,a.pos)<=(this.talented(p,'widerNova')?5.2:4.2))this.damageTarget(a.id,45,p.id);
    this.emit({type:'abilityFx',skill,playerId:p.id,from,to:skill==='dash'?{...p.pos}:['lazor','swordSwing','chargingStab'].includes(skill)?this.clip(from,to):to});
  }
  beamHits=(from:Vec2,dir:Vec2,target:Vec2,length=14,radius=1.6)=>{
    const end=this.clip(from,{x:from.x+dir.x*length,z:from.z+dir.z*length}),reach=distance(from,end);
    // A wide beam cannot damage an exposed target beyond its blocked centre ray.
    return this.visible(from,target)&&(reach>=length-1e-8||(target.x-from.x)*dir.x+(target.z-from.z)*dir.z<=reach)&&beamHits(from,dir,target,reach,radius);
  };
  targets(){return [{id:'boss',pos:this.boss.pos,hp:this.boss.hp},...this.adds]
    .filter(t=>t.hp>0&&!(t.id==='boss'&&(this.boss.id==='antQueen'||this.boss.id==='chaosArena'))&&
      !(this.boss.id==='chaosArena'&&'kind' in t&&t.kind==='chaosBoss'&&t.bossId==='antQueen'));}
  damageTarget(id:string,amount:number,source?:string){
    if(id==='boss'&&(this.boss.id==='antQueen'||this.boss.id==='chaosArena'))return;
    if(this.boss.id==='chaosArena'&&this.adds.some(a=>a.id===id&&a.kind==='chaosBoss'&&a.bossId==='antQueen'))return;
    const t=id==='boss'?this.boss:this.adds.find(a=>a.id===id);if(!t||t.hp<=0)return;
    const generation=id==='boss'?0:this.adds.find(a=>a.id===id)?.generation??0;
    const splitBall=isBall(this)||(this.boss.id==='chaosArena'&&id!=='boss'&&((t as AddState).kind==='ball'||(t as AddState).bossId==='yellowBall'))||(this.boss.id==='duoYellowWarden'&&id!=='boss'&&((t as AddState).kind==='ball'||(t as AddState).bossId==='yellowBall'));
    const floor=splitBall&&generation<(this.boss.id==='hardYellowBall'?3:1)?t.maxHp/2:0;
    const previous=t.hp;t.hp=Math.max(floor,t.hp-talentDamage(amount,this.liveTalents&&source&&hasTalent(this.players.get(source)?.talents,this.players.get(source)!.classId,'unyieldingForce')?1:0));this.recordDamage(source,previous-t.hp);if(source)this.addThreat(source,previous-t.hp);
    if((this.boss.id==='antQueen'||this.boss.id==='chaosArena')&&id!=='boss'&&previous>0&&t.hp<=0&&(t as AddState).kind==='royalGuard')royalGuardKilled.call(this,source);
  }
  area(pos:Vec2,radius:number,damage:number,source?:string){for(const t of this.targets())if(distance(pos,t.pos)<=radius&&this.visible(pos,t.pos))this.damageTarget(t.id,damage,source)}
  classAbility(p:PlayerState,slot:number,now:number,point:unknown,targetId:unknown){return classAbility.call(this,p,slot,now,point,targetId)}
  tickClassEffects(now:number){
    // Vanish is a temporary skill swap, even if Backstab never connects.
    for(const p of this.players.values())if(p.invisibleUntil>0&&p.invisibleUntil<=now){
      p.invisibleUntil=0;
      const slot=p.loadout.indexOf('backstab');if(slot>=0)p.loadout[slot]='vanish';
    }
    tickClassEffects.call(this,now);
  }
  recharge(p:PlayerState,now:number) {
    const max=p.head==='pointyHat'?3:1;
    // Spending another charge never restarts the current sequential recharge.
    while(p.dashRechargeAt&&now>=p.dashRechargeAt) {
      p.dashCharges++;
      p.dashRechargeAt=p.dashCharges<max?p.dashRechargeAt+SKILLS.dash.cooldown:0;
    }
    const slot=p.loadout.indexOf('dash');
    if(slot>=0)p.cooldowns[slot]=p.dashCharges?0:p.dashRechargeAt;
  }
  arenaLimit(){if(this.phase!=='fight')return 12;return this.boss.id==='chaosArena'?CHAOS_ARENA_LIMIT:this.boss.id==='antQueen'?ANT_ARENA_LIMIT:12;}
  movePlayer(pos:Vec2,delta:Vec2){
    let p={...pos};const steps=Math.max(1,Math.ceil(Math.hypot(delta.x,delta.z)/.08));
    for(let i=0;i<steps;i++){
      p=moveSolid(p,{x:delta.x/steps,z:delta.z/steps},this.solidBoss(),this.pillars(),1.73,this.arenaLimit());
      for(const a of this.adds)if((a.kind==='ball'||a.kind==='duoBoss'||a.kind==='chaosBoss')&&a.hp>0)p=moveSolid(p,{x:0,z:0},a.pos,[],(a.radius??.9)+.48,this.arenaLimit());
    }return p;
  }
  solidBoss(){return this.boss.hp>0&&this.boss.id!=='chaosArena'?this.boss.pos:{x:1000,z:1000}}
  pillars(){return this.boss.id==='hardWarden'?HARD_PILLARS:[]}
  clearBuffs(p:PlayerState){p.bulwarkUntil=p.invisibleUntil=p.poisonUntil=p.shield=p.shieldUntil=0;const i=p.loadout.indexOf('backstab');if(i>=0)p.loadout[i]='vanish';}
  hurt(p:PlayerState,now:number,amount=this.boss.id==='hardWarden'?64:48,bossDamage=true) {
    let damage=talentMitigation(amount,this.liveTalents&&hasTalent(p.talents,p.classId,'unyieldingForce')?1:0)*(p.guardUntil>now?.25:1)*(p.bulwarkUntil>now?(p.offhand==='bulwarkCrest'?CLASS_ITEM_BONUS.defenderDamageMultiplier:.5):1)*(bossDamage&&p.armour==='redtubeArmour'?.95:1)*
      ([...this.players.values()].some(a=>a.id!==p.id&&a.alive&&a.bulwarkUntil>now&&
        this.talented(a,'fortressAura')&&distance(a.pos,p.pos)<=4)?.85:1);
    if(p.shieldUntil<=now)p.shield=0;const absorbed=Math.min(p.shield,damage);p.shield-=absorbed;damage-=absorbed;
    if(amount>0&&p.bulwarkUntil>now&&this.talented(p,'retaliatoryShell')&&now>=(p.retaliationAt??-Infinity)+1000){
      p.retaliationAt=now;
      if(this.phase==='fight')this.area(p.pos,this.talented(p,'thunderShell')?4:3,this.talented(p,'thunderShell')?20:12,p.id);
      if(this.talented(p,'bulwarkResonance')){
        const ally=[...this.players.values()].filter(a=>a.alive&&distance(a.pos,p.pos)<=4)
          .sort((a,b)=>distance(a.pos,p.pos)-distance(b.pos,p.pos))[0];
        if(ally){ally.shield=Math.max(ally.shield,10);ally.shieldUntil=now+2500;}
      }
    }
    p.hp=Math.max(0,p.hp-damage);p.alive=p.hp>0;if(!p.alive){p.cast=undefined;this.clearBuffs(p);}
  }
  schedule(now:number) {
    const alive=[...this.players.values()].filter(p=>p.alive&&p.invisibleUntil<=now);const candidates=this.boss.id==='hardWarden'&&(this.mechanic+1)%3===0?alive:[...alive,...this.totems.filter(t=>t.hp>0)];if(!candidates.length)return;
    const target=this.selectTarget(now,this.boss.pos)??candidates[this.mechanic%candidates.length];this.mechanic++;let t:Telegraph;
    const dir=unit({x:target.pos.x-this.boss.pos.x,z:target.pos.z-this.boss.pos.z});
    if((this.boss.id==='greenCone'||this.boss.id==='hardGreenCone'||this.boss.id==='duoTruffleFracturer')) {
      t={id:this.uuid(),kind:'circle',pos:{...this.boss.pos},radius:this.boss.id==='hardGreenCone'?3.5:3,resolvesAt:now+(this.boss.id==='hardGreenCone'?1200:1500)};
      this.boss.heading=Math.atan2(dir.x,dir.z);
      this.boss.smash={startedAt:now,impactAt:t.resolvesAt,recoverAt:t.resolvesAt+650};
      this.emit({type:'event',text:'Truffle Man: close-range smash!'});
      if(this.mechanic%(this.boss.id==='hardGreenCone'?2:3)===0){const hard=this.boss.id==='hardGreenCone';const max=hard?12:6;const spots=hard?[[-3,-2],[-1,-3],[1,-3],[3,-2],[-3,2],[-1,3],[1,3],[3,2]]:[[-2,0],[2,0]];for(let i=0;i<spots.length&&this.adds.length<max;i++){const [dx,dz]=spots[(i+this.mechanic)%spots.length];this.adds.push({id:this.uuid(),pos:{x:clamp(this.boss.pos.x+dx),z:clamp(this.boss.pos.z+dz)},hp:hard?100:54,maxHp:hard?100:54,attackAt:now+1500});}}
    } else if(this.boss.id==='hardWarden') {
      const kind=this.mechanic%3;
      t={id:this.uuid(),kind:'circle',pos:kind===2?{...this.boss.pos}:{...target.pos},radius:kind===2?35:kind===1?4.2:2.6,resolvesAt:now+1500,sweep:kind===2};
      if(kind===0)for(let i=1;i<=2;i++)this.scatter.push({at:now+i*500,targetId:target.id});
      this.emit({type:'event',text:kind===2?'Hard Warden: hide behind a pillar!':kind===0?'Triple scatter - move!':'Large marked blast!'});
    } else {
      const line=this.mechanic%3===2;
      t=line?{id:this.uuid(),kind:'line',pos:{...this.boss.pos},direction:dir,width:3,length:13,resolvesAt:now+1500}:{id:this.uuid(),kind:'circle',pos:{...target.pos},radius:this.mechanic%3?3.1:2.2,resolvesAt:now+1500};
      this.emit({type:'event',text:line?'Warden sweep!':'Marked blast — move!'});
      if(this.mechanic%3===0)for(const p of alive)if(p!==target)this.telegraphs.push({...t,id:this.uuid(),pos:{...p.pos}});
    }
    this.telegraphs.push(t);this.next=now+(this.boss.id==='hardGreenCone'?2900:3600);
  }
  tick(now=Date.now()):Snapshot {
    if(this.vote&&now>=this.vote.expires)this.cancelVote();
    if(this.phase==='lobby') {
      for(const d of this.trainingDummies)if(d.hp<=0&&now>=d.respawnAt)d.hp=d.maxHp;
      for(const p of this.players.values())this.recharge(p,now);
      for(const t of this.totems)this.burstTotem(t,now);
      this.totems=this.totems.filter(t=>t.hp>0&&now<t.expires&&this.players.has(t.owner));
      for(const t of this.totems)if(t.kind==='healingTotem'&&now>=t.next){const owner=this.players.get(t.owner);const radius=owner?.offhand==='verdantMenderTotem'?2:4;const amount=owner?.offhand==='verdantMenderTotem'?16:8;for(const p of this.players.values())if(p.alive&&distance(p.pos,t.pos)<=radius)this.heal(p,amount,t.owner);t.next=now+1000;}
      const dt=Math.max(0,Math.min(.25,(now-this.lastTick)/1000));this.lastTick=now;
      this.hubNpc.tick(dt,[...this.players.values()].map(p=>p.pos));
      for(const p of this.players.values()) {
        const move=this.moves.get(p.id);
        if(move&&now-move.at<250){p.pos=moveHubPlayer(p.pos,{x:move.v.x*5.4*dt*(p.boots==='fleetfootBoots'?1.15:1),z:move.v.z*5.4*dt*(p.boots==='fleetfootBoots'?1.15:1)},this.hubNpc.state.pos);if(Math.hypot(move.v.x,move.v.z)>0)p.facing={...move.v};}
      }
    }
    if(this.phase==='fight') {
      const dt=Math.max(0,Math.min(.25,(now-this.lastTick)/1000));this.lastTick=now;
      for(const p of this.players.values()){this.recharge(p,now);if(p.invisibleUntil<=now){const i=p.loadout.indexOf('backstab');if(i>=0)p.loadout[i]='vanish';}if(p.shieldUntil<=now)p.shield=0;}
      this.tickClassEffects(now);
      if(this.boss.id==='antQueen'||this.boss.id==='chaosArena')tickAntQueen.call(this,now);
      if(this.boss.id==='chaosArena')tickChaos.call(this,now);
      // Each caster refreshes only their own four-tick burn on a target.
      for(const [key,b] of this.burns) {
        while(b.remaining>0&&now>=b.next) {
          this.damageTarget(b.target,8,key.split(':')[0]);
          b.remaining--;b.next+=1000;
        }
        if(!b.remaining)this.burns.delete(key);
      }
      const fracturerCorners=(this.boss.id==='fracturer'&&this.boss.hp>0)||
        (this.boss.id==='chaosArena'&&!!chaosBoss(this,'fracturer'))||
        (this.boss.id==='duoTruffleFracturer'&&this.adds.some(a=>a.kind==='duoBoss'&&a.bossId==='fracturer'&&a.hp>0));
      const collapseCorridor=this.boss.id==='chaosArena'?5.5:3;
      if(fracturerCorners){
        if(this.arenaCuts.length<4&&now>=this.nextCollapseAt){
          const quadrant=this.arenaCuts.length;
          this.arenaCuts.push({quadrant,warnAt:now,collapseAt:now+2200});
          this.nextCollapseAt=now+8000;
          this.system('The Fracturer: a corner is collapsing! Move to the central pathways.');
        }
        for(const cut of this.arenaCuts)if(now>=cut.collapseAt){
          for(const p of this.players.values())if(p.alive&&fractureQuadrant(p.pos,collapseCorridor)===cut.quadrant){
            p.pos={x:Math.sign(p.pos.x)*(collapseCorridor-.2),z:Math.sign(p.pos.z)*(collapseCorridor-.2)};
            this.hurt(p,now,25);
          }
        }
      }
      // When Fracturer falls in Chaos, previously collapsed floor tiles
      // reopen; no invisible collision or lingering phantom eruption.
      if(this.boss.id==='chaosArena'&&!chaosBoss(this,'fracturer'))this.arenaCuts=[];
      const activeFracturer=(this.boss.id==='fracturer'&&this.boss.hp>0)||(this.boss.id==='chaosArena'&&!!chaosBoss(this,'fracturer'))||
        (this.boss.id==='duoTruffleFracturer'&&this.adds.some(a=>a.kind==='duoBoss'&&a.bossId==='fracturer'&&a.hp>0));
      if(!activeFracturer)this.fracturerSurge=undefined;
      else if(!this.fracturerSurge&&now>=this.nextFracturerSurgeAt){
        const safeDirection=CARDINAL_DIRECTIONS[this.fracturerSurgeIndex++%CARDINAL_DIRECTIONS.length];
        this.fracturerSurge={safeDirection,warnAt:now,resolvesAt:now+3200,resolved:false};
        this.nextFracturerSurgeAt=now+16000;
        this.system('The Fracturer: three quarters of the arena are about to erupt! SAFE '+safeDirection.toUpperCase()+'!');
      }
      const alive=[...this.players.values()].filter(p=>p.alive);
      const chase=(pos:Vec2,speed:number,stop:number)=>{
        const target=this.selectTarget(now,pos)??[...alive.filter(p=>p.alive&&p.invisibleUntil<=now),...this.totems.filter(t=>t.hp>0)].sort((a,b)=>distance(pos,a.pos)-distance(b.pos,pos))[0];if(target){const d=distance(pos,target.pos),step=Math.min(speed*dt,Math.max(0,d-stop)),dir=unit({x:target.pos.x-pos.x,z:target.pos.z-pos.z});pos.x=clamp(pos.x+dir.x*step,this.arenaLimit());pos.z=clamp(pos.z+dir.z*step,this.arenaLimit());
      if(this.arenaLimit()>12){const radial=distance(pos,{x:0,z:0});if(radial>this.arenaLimit()){pos.x*=this.arenaLimit()/radial;pos.z*=this.arenaLimit()/radial;}}}return target;};
      if((this.boss.id==='greenCone'||this.boss.id==='hardGreenCone'||this.boss.id==='duoTruffleFracturer')){
        const before={...this.boss.pos};this.boss.walking=false;
        if(!this.telegraphs.length&&this.boss.hp>0&&(!this.boss.smash||now>=this.boss.smash.recoverAt))chase(this.boss.pos,.9,1.73);
        const travelled=distance(before,this.boss.pos);this.boss.stride=(this.boss.stride??0)+travelled;this.boss.walking=travelled>0;
        if(travelled>0)this.boss.heading=Math.atan2(this.boss.pos.x-before.x,this.boss.pos.z-before.z);
      }
      this.adds=this.adds.filter(a=>a.hp>0);
      // The five Chaos champions have independent behavior: three anchored,
      // Yellow Ball animated by BallEncounter, and Truffle by tickChaos.
      // Only actual minions may chase and deal contact damage.
      for(const a of this.adds.filter(a=>a.kind!=='ball'&&a.kind!=='duoBoss'&&a.kind!=='chaosBoss')){
        const ant=a.kind==='antWorker'||a.kind==='royalGuard';
        const speed=a.kind==='antWorker'?2.5:a.kind==='royalGuard'?1.6:1.7;
        const target=chase(a.pos,speed,a.kind==='royalGuard'?1.2:.85);
        if(target&&distance(a.pos,target.pos)<=(a.kind==='royalGuard'?1.5:1.1)&&now>=a.attackAt){
          if('alive' in target)this.hurt(target,now,a.kind==='royalGuard'?20:a.kind==='antWorker'?7:12,false);
          else target.hp=0;
          a.attackAt=now+(ant?1500:1200);
        }
      }
      for(const p of this.players.values()) {
        if(!p.alive)continue;const input=this.moves.get(p.id),v=input&&now-input.at<300?input.v:{x:0,z:0},old={...p.pos};
        p.pos=this.movePlayer(p.pos,{x:v.x*.22*(p.bulwarkUntil>now?(this.talented(p,'ironMarch')?.75:.5):1)*(p.boots==='fleetfootBoots'?1.15:1),z:v.z*.22*(p.bulwarkUntil>now?(this.talented(p,'ironMarch')?.75:.5):1)*(p.boots==='fleetfootBoots'?1.15:1)});
        if(fracturerCorners&&this.arenaCuts.some(c=>now>=c.collapseAt&&fractureQuadrant(p.pos,collapseCorridor)===c.quadrant))p.pos=old;
        const actual={x:p.pos.x-old.x,z:p.pos.z-old.z};if(Math.hypot(actual.x,actual.z)>.001)p.facing=unit(actual);
      }
      if(this.boss.id==='warden'||this.boss.id==='hardWarden'||this.boss.id==='duoYellowWarden'){
        const victim=this.selectTarget(now,this.boss.pos)??[...this.players.values()].filter(p=>p.alive&&p.invisibleUntil<=now).sort((a,b)=>distance(a.pos,this.boss.pos)-distance(b.pos,this.boss.pos))[0];
        if(victim)this.boss.heading=Math.atan2(victim.pos.x-this.boss.pos.x,victim.pos.z-this.boss.pos.z);
      }
      if(this.fracturerSurge&&!this.fracturerSurge.resolved&&now>=this.fracturerSurge.resolvesAt){
        this.fracturerSurge.resolved=true;
        const safe=this.fracturerSurge.safeDirection;
        for(const p of this.players.values())if(p.alive&&fractureCardinal(p.pos)!==safe)this.hurt(p,now,55);
        for(const t of this.totems)if(t.hp>0&&fractureCardinal(t.pos)!==safe)t.hp=0;
        this.emit({type:'event',text:'The Fracturer: the unsafe quarters erupt!'});
      }
      if(this.fracturerSurge&&now>=this.fracturerSurge.resolvesAt+750)this.fracturerSurge=undefined;
      if(this.boss.id==='hardWarden'&&this.boss.hp>0){
        if(!this.hardWardenCall&&now>=this.nextHardWardenCallAt&&!this.telegraphs.some(t=>t.resolvesAt>now)){
          this.hardWardenCall={warnAt:now,resolvesAt:now+2700,resolved:false,safeRadius:4.3};
          this.nextHardWardenCallAt=now+16000;
          this.next=Math.max(this.next,now+4100); // avoid contradictory simultaneous sweep warnings
          this.system('Hard Warden: COLLAPSE IN! Stay close to the Warden or take damage!');
        }
        if(this.hardWardenCall&&!this.hardWardenCall.resolved&&now>=this.hardWardenCall.resolvesAt){
          this.hardWardenCall.resolved=true;
          for(const p of this.players.values())if(p.alive&&distance(p.pos,this.boss.pos)>this.hardWardenCall.safeRadius)this.hurt(p,now,46);
          this.emit({type:'event',text:'Hard Warden: Collapse In explodes!'});
        }
        if(this.hardWardenCall&&now>=this.hardWardenCall.resolvesAt+650)this.hardWardenCall=undefined;
      }
      if(isBall(this)||this.boss.id==='duoYellowWarden'||this.boss.id==='chaosArena')this.balls.tick(now);
      if(this.boss.id==='chaosArena')chaosHealth.call(this);
      if(!isBall(this)&&this.boss.id!=='antQueen'&&this.boss.id!=='chaosArena'&&this.boss.hp>0&&now>=this.next)this.schedule(now);
      const partner=this.adds.find(a=>a.kind==='duoBoss'&&a.hp>0);
      if(partner&&partner.bossId!=='yellowBall'&&now>=this.nextDuoAt){const live=[...this.players.values()].filter(p=>p.alive);if(live.length){const target=live[this.mechanic%live.length];this.telegraphs.push({id:this.uuid(),kind:'circle',pos:{...target.pos},radius:2.8,resolvesAt:now+1500});this.system('Fracturer prepares a blast!');}this.nextDuoAt=now+4700;}
      if(((this.boss.id==='greenCone'||this.boss.id==='hardGreenCone'||this.boss.id==='duoTruffleFracturer')&&this.boss.hp>0)||(this.boss.id==='chaosArena'&&!!chaosBoss(this,'greenCone')))this.poison.tick(now,[...this.players.values()],this.uuid,(p,at,amount)=>this.hurt(p,at,p.boots==='mirewalkerBoots'?amount*.75:amount));
      const deployment=this.scatter[0];
      if(deployment&&deployment.at<=now){
        this.scatter.shift();
        // Preserve marker separation even after a stalled tick. Never deploy two at once.
        if(this.scatter[0])this.scatter[0].at=Math.max(this.scatter[0].at,now+500);
        const tracked=this.players.get(deployment.targetId)??this.totems.find(t=>t.id===deployment.targetId);
        const target=tracked&&('alive' in tracked?tracked.alive&&tracked.invisibleUntil<=now:tracked.hp>0)?tracked:[...this.players.values()].find(p=>p.alive&&p.invisibleUntil<=now);
        if(target)this.telegraphs.push({id:this.uuid(),kind:'circle',pos:{...target.pos},radius:2.6,resolvesAt:now+1500});
      }

      // A defeated Chaos champion cannot leave phantom queued attacks behind.
      if(this.boss.id==='chaosArena')
        this.telegraphs=this.telegraphs.filter(t=>!t.sourceBossId||!!chaosBoss(this,t.sourceBossId));
      for(const t of this.telegraphs.filter(t=>!t.ownerId&&t.resolvesAt<=now)) {
        // Publish the actual damage tick; a stalled server must not show an early slam.
        if((this.boss.id==='greenCone'||this.boss.id==='hardGreenCone'||this.boss.id==='duoTruffleFracturer')&&this.boss.smash&&!this.boss.smash.impacted){this.boss.smash.impactAt=now;this.boss.smash.recoverAt=now+650;this.boss.smash.impacted=true;}
        for(const ttm of this.totems)if(ttm.hp>0&&(!t.sweep||!pillarOccludes(t.pos,ttm.pos))&&(t.kind==='circle'?distance(ttm.pos,t.pos)<=t.radius!:beamHits(t.pos,t.direction!,ttm.pos,t.length!,t.width!/2)))ttm.hp=0;for(const p of this.players.values())if(p.alive&&(!t.sweep||!pillarOccludes(t.pos,p.pos))&&(t.kind==='circle'?distance(p.pos,t.pos)<=t.radius!:beamHits(t.pos,t.direction!,p.pos,t.length!,t.width!/2)))this.hurt(p,now,t.damage??(this.boss.id==='hardGreenCone'?64:undefined));
      }
      this.telegraphs=this.telegraphs.filter(t=>t.resolvesAt>now);
      if(this.phase==='fight')this.meterElapsedMs=Math.max(0,now-this.meterStartedAt);
      if(this.boss.hp<=0&&(!isBall(this)||!this.adds.some(a=>a.hp>0))&&!this.adds.some(a=>(a.kind==='duoBoss'||a.kind==='ball')&&a.hp>0)) {
        this.phase='won';this.fracturerSurge=undefined;this.hardWardenCall=undefined;this.system('Victory!');this.poison.clear();this.scatter=[];this.totems=[];this.effects=[];for(const p of this.players.values()){p.cast=undefined;this.clearBuffs(p);p.skirmishUntil=undefined;}this.adds=[];this.burns.clear();this.motion=undefined;this.boss.height=0;this.telegraphs=[];
        this.bonusRewards=[];
        const newlyEarned=[...this.players.values()].filter(p=>awardTalentWin(p.talents??=emptyTalents(),this.boss.id)).map(p=>p.id);
        this.talentAward={boss:this.boss.id,players:newlyEarned};
        this.reward={id:this.fightId,material:this.boss.id==='chaosArena'?'chaosSigil':this.boss.id==='antQueen'?'antChitin':this.boss.id==='duoYellowWarden'?'duoCore':this.boss.id==='duoTruffleFracturer'?'duoSpore':this.boss.id==='hardYellowBall'?'largeSphere':this.boss.id==='hardWarden'?'largeCylinder':this.boss.id==='warden'?'cylinderTube':this.boss.id==='yellowBall'?'sphericalBall':this.boss.id==='hardGreenCone'?'hardTruffleSpore':'conicalTaper',players:[...this.players.keys()]};
        this.emit({type:'event',text:'Victory! Material added to inventory. R: retry · H: hub'});
      } else if([...this.players.values()].every(p=>!p.alive)){this.phase='wiped';this.fracturerSurge=undefined;this.hardWardenCall=undefined;this.system('Party wiped. Propose a retry or return to the hub.');this.poison.clear();this.scatter=[];this.totems=[];this.effects=[];for(const p of this.players.values()){p.cast=undefined;this.clearBuffs(p);}}
    }
    return {type:'snapshot',now,serverVersion:NETWORK_VERSION,talentAward:this.talentAward,trainingDummies:structuredClone(this.trainingDummies),arenaCuts:structuredClone(this.arenaCuts),queenWave:this.boss.id==='antQueen'||this.boss.id==='chaosArena'?this.queenWave:undefined,royalsDefeated:this.boss.id==='antQueen'||this.boss.id==='chaosArena'?this.royalsDefeated:undefined,hardWardenCall:this.hardWardenCall?{...this.hardWardenCall}:undefined,fracturerSurge:this.fracturerSurge?{...this.fracturerSurge}:undefined,supportedBosses:['warden','hardWarden','yellowBall','hardYellowBall','greenCone','hardGreenCone','fracturer','antQueen','chaosArena','duoYellowWarden','duoTruffleFracturer'],damageMeter:{startedAt:this.meterStartedAt,elapsedMs:this.meterElapsedMs,entries:[...this.damageTotals].map(([playerId,damage])=>({playerId,damage}))},healingMeter:{startedAt:this.meterStartedAt,elapsedMs:this.meterElapsedMs,entries:[...this.healingTotals].map(([playerId,healing])=>({playerId,healing}))},poisonMark:this.poison.mark?structuredClone(this.poison.mark):undefined,poisonMarks:structuredClone(this.poison.marks),poisonClouds:structuredClone(this.poison.clouds),hubNpc:this.phase==='lobby'?structuredClone(this.hubNpc.state):undefined,phase:this.phase,players:[...this.players.values()],boss:this.boss,adds:this.adds,telegraphs:this.telegraphs,readyCount:this.vote?.accepted.length??0,vote:this.vote,totems:this.totems,reward:this.reward,bonusRewards:this.bonusRewards,effects:this.effects};
  }
}
