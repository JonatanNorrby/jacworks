import {TrufflePoison} from './trufflePoison';
import {TrufflePatrol,moveHubPlayer,TRUFFLE_RADIUS,PLAYER_RADIUS} from './truffle';
import {BallEncounter,isBall} from './balls';
import { classAbility,tickClassEffects } from './classCombat';
import { DEFAULT_CLASS_ID, readClass, gearEligible, resolveClassLoadout } from './classes';
import { readInventory } from './inventory';
import { DEFAULT_LOADOUT, SKILLS } from './protocol';
import type { PlayerState, ServerMessage, Snapshot, Telegraph, Vec2, AddState } from './protocol';

export const distance = (a: Vec2, b: Vec2) => Math.hypot(a.x-b.x, a.z-b.z);
const clamp = (n: number) => Math.max(-12, Math.min(12,n));
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
export function moveSolid(pos:Vec2, delta:Vec2, boss:Vec2,pillars:Vec2[]=[],bossRadius=1.73):Vec2 {
  let p={...pos}; const steps=Math.max(1,Math.ceil(Math.hypot(delta.x,delta.z)/.08));
  for(let i=0;i<steps;i++) {
    p={x:clamp(p.x+delta.x/steps),z:clamp(p.z+delta.z/steps)};
    for(const body of [boss,...pillars]){const radius=body===boss?bossRadius:1.48;const dx=p.x-body.x,dz=p.z-body.z,l=Math.hypot(dx,dz);
    if(l<radius)p={x:clamp(body.x+(l?dx/l:1)*radius),z:clamp(body.z+(l?dz/l:0)*radius)};}
  } return p;
}
// Center-based 120-degree cleave; a stab uses a narrower forward reach.
export function meleeHits(from:Vec2,dir:Vec2,target:Vec2,reach=3,cosine=.5){
 const d=distance(from,target);return d>0&&d<=reach&&((target.x-from.x)*dir.x+(target.z-from.z)*dir.z)/d>=cosine;
}
// Charge stops at the first solid body rather than sliding or tunnelling through it.
export function chargeEnd(from:Vec2,dir:Vec2,boss:Vec2,adds:AddState[],length=5,pillars:Vec2[]=[]):Vec2 {
 let p={...from};for(let travelled=0;travelled<length;travelled+=.05){
  const step=Math.min(.05,length-travelled),next={x:p.x+dir.x*step,z:p.z+dir.z*step};
  if(Math.abs(next.x)>12||Math.abs(next.z)>12||distance(next,boss)<1.73||pillars.some(c=>distance(next,c)<1.48)||adds.some(a=>a.hp>0&&distance(next,a.pos)<(a.radius??.42)+.48))break;
  p=next;
 }return p;
}
type Motion={kind:'roll'|'bounce';from:Vec2;to:Vec2;start:number;end:number;hit:Set<string>};
export class Game {
  poison=new TrufflePoison();
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
  effects:import('./protocol').CombatEffect[]=[];
  adds:AddState[]=[];lastTick=0;burns=new Map<string,{target:string;next:number;remaining:number}>();
  boss:Snapshot['boss']={id:'warden',hp:1800,maxHp:1800,pos:{x:0,z:0},height:0};
  telegraphs:Telegraph[]=[]; reward:Snapshot['reward']; next=0; mechanic=0; fightId=''; motion?:Motion;
  emit:(m:ServerMessage)=>void;
  uuid:()=>string;
  constructor(emit:(m:ServerMessage)=>void,uuid:()=>string) {this.emit=emit;this.uuid=uuid;}
  add(id:string) {
    this.cancelVote();
    const p:PlayerState={id,name:'Player',classId:DEFAULT_CLASS_ID,pos:{x:0,z:8},facing:{x:0,z:-1},hp:100,maxHp:100,alive:true,guardUntil:0,bulwarkUntil:0,invisibleUntil:0,poisonUntil:0,shield:0,shieldUntil:0,armour:null,cooldowns:[0,0,0,0],loadout:resolveClassLoadout(DEFAULT_CLASS_ID,DEFAULT_LOADOUT,null),weapon:null,head:null,offhand:null,dashCharges:1,dashRechargeAt:0};
    if(this.phase==='lobby')p.pos={x:this.players.size%5*1.2,z:8};
    this.players.set(id,p);return p;
  }
  remove(id:string) {this.poison.remove(id);this.cancelVote();this.totems=this.totems.filter(t=>t.owner!==id);this.effects=this.effects.filter(e=>e.owner!==id);this.initialized.delete(id);this.players.delete(id);this.moves.delete(id);this.ready.delete(id);if(!this.players.size){this.boss.id='warden';this.reset();this.selectionLocked=false;}}
  reset() {
    this.poison.clear();
    this.balls=new BallEncounter(this);this.vote=undefined;this.scatter=[];this.totems=[];
    this.effects=[];for(const p of this.players.values()){p.cast=undefined;this.clearBuffs(p);}this.adds=[];this.burns.clear();this.lastTick=0;this.phase='lobby';this.boss.hp=this.boss.maxHp=this.boss.id==='hardWarden'?3000:this.boss.id==='hardYellowBall'?2400:1800;this.boss.pos={x:0,z:0};this.boss.height=0;this.motion=undefined;this.boss.smash=undefined;this.boss.stride=0;this.boss.walking=false;
    this.telegraphs=[];this.ready.clear();this.reward=undefined;this.moves.clear();let i=0;
    for(const p of this.players.values()) {const a=i++/this.players.size*Math.PI*2;p.pos={x:Math.cos(a)*7,z:Math.sin(a)*7};if(distance(p.pos,this.hubNpc.state.pos)<TRUFFLE_RADIUS+PLAYER_RADIUS)p.pos={x:0,z:8};p.hp=100;p.alive=true;p.cooldowns=[0,0,0,0];p.guardUntil=0;this.clearBuffs(p);p.dashCharges=p.head?3:1;p.dashRechargeAt=0;}
  }
  message(id:string,m:unknown,now=Date.now()) {
    const p=this.players.get(id);if(!p||!m||typeof m!=='object')return;
    const v=m as Record<string,unknown>;
    if(v.type==='join'&&(!this.vote||!this.vote.accepted.includes(id))&&(!this.initialized.has(id)||(this.phase!=='fight'&&!this.ready.has(id)))) {
      this.initialized.add(id);
      if(typeof v.name==='string')p.name=v.name.slice(0,24);
      const inventory=readInventory(JSON.stringify(v.inventory??null));
      this.clearBuffs(p);p.classId=readClass(v.classId);p.cast=undefined;p.cooldowns=[0,0,0,0];
      p.armour=gearEligible(p.classId,'redtubeArmour')?inventory.armour:null;p.weapon=gearEligible(p.classId,'primitiveWand')?inventory.weapon:null;p.head=inventory.head;p.offhand=gearEligible(p.classId,'pointyOrb')?inventory.offhand:null;p.dashCharges=p.head?3:1;p.dashRechargeAt=0;
      p.loadout=resolveClassLoadout(p.classId,v.loadout,p.weapon);
      // First entrant owns the selection. All later entrants use the room's boss.
      if(this.phase==='lobby'&&!this.selectionLocked&&(v.boss==='warden'||v.boss==='hardWarden'||v.boss==='hardYellowBall'||v.boss==='yellowBall'||v.boss==='greenCone')) {this.boss.id=v.boss;this.boss.hp=this.boss.maxHp=v.boss==='hardWarden'?3000:v.boss==='hardYellowBall'?2400:1800;this.selectionLocked=true;}
    }
    if(v.type==='input'&&Number.isSafeInteger(v.seq)&&Number(v.seq)>=0&&v.move&&typeof v.move==='object') {
      const move=v.move as Vec2;
      if(typeof move.x==='number'&&typeof move.z==='number'&&Number.isFinite(move.x)&&Number.isFinite(move.z)&&Math.abs(move.x)<=1&&Math.abs(move.z)<=1) {
        const old=this.moves.get(id);if(!old||Number(v.seq)>old.seq)this.moves.set(id,{v:unit(move),at:now,seq:Number(v.seq)});
      }
    }
    if(v.type==='hub'){this.cancelVote();if(this.phase!=='lobby')this.reset();return;}
    if(v.type==='propose'&&typeof v.boss==='string'&&['warden','hardWarden','hardYellowBall','yellowBall','greenCone'].includes(v.boss))this.propose(v.boss as Snapshot['boss']['id'],now);
    // Legacy ready may propose, but cannot cast an acceptance without the current proposal ID.
    if(v.type==='ready'&&!this.vote&&this.phase!=='fight')this.propose(this.boss.id,now);
    if(v.type==='vote'&&this.vote&&v.proposalId===this.vote.id&&typeof v.accept==='boolean'&&now<this.vote.expires&&this.vote.voters.includes(id)){
      if(!v.accept){this.cancelVote();return;}
      if(!this.vote.accepted.includes(id))this.vote.accepted.push(id);
      if(this.vote.accepted.length===this.vote.voters.length){const boss=this.vote.boss;if(this.phase!=='lobby')this.reset();this.vote=undefined;this.boss.id=boss;this.boss.hp=this.boss.maxHp=boss==='hardWarden'?3000:boss==='hardYellowBall'?2400:1800;this.phase='fight';if(boss==='greenCone')this.poison.start(now);this.lastTick=now;this.fightId=this.uuid();this.next=now+2200;this.mechanic=0;for(const key of this.players.keys())this.initialized.add(key);}
    }
    if(v.type==='ability'&&this.phase==='fight'&&p.alive&&Number.isInteger(v.slot)&&Number(v.slot)>=1&&Number(v.slot)<=4)this.ability(p,Number(v.slot),now,v.target,v.targetId);
  }
  cancelVote(){if(this.vote){this.vote=undefined;this.ready.clear();this.emit({type:'event',text:'Encounter vote cancelled.'});}}
  propose(boss:Snapshot['boss']['id'],now:number){
    if(this.phase==='fight'||this.vote)return;
    this.vote={id:this.uuid()+':'+(++this.voteSerial),boss,expires:now+30000,voters:[...this.players.keys()],accepted:[]};
  }
  visible(from:Vec2,to:Vec2){return this.boss.id!=='hardWarden'||!pillarOccludes(from,to)}
  clip(from:Vec2,to:Vec2){return this.boss.id==='hardWarden'?clipPillars(from,to):{...to};}
  ability(p:PlayerState,slot:number,now:number,point?:unknown,targetId?:unknown) {
    const skill=p.loadout[slot-1];if(p.cast&&skill!=='dash')return;if(skill==='dash')p.cast=undefined;
    if(this.classAbility(p,slot,now,point,targetId))return;this.recharge(p,now);if(skill==='dash'?p.dashCharges===0:now<p.cooldowns[slot-1])return;
    const d=distance(p.pos,this.boss.pos);
    const target=[{id:'boss',pos:this.boss.pos,hp:this.boss.hp},...this.adds].filter(t=>t.hp>0).sort((a,b)=>distance(p.pos,a.pos)-distance(p.pos,b.pos))[0];
    if((skill==='arcBolt'||skill==='arcSpear')&&(!target||distance(p.pos,target.pos)>11))return;
    p.cooldowns[slot-1]=now+SKILLS[skill].cooldown+(skill==='lazor'&&p.offhand?2000:0);const from={...p.pos};let to={...p.pos},damage=0;
    if(skill==='dash'){p.dashCharges--;if(!p.dashRechargeAt)p.dashRechargeAt=now+SKILLS.dash.cooldown;p.cooldowns[slot-1]=p.dashCharges?0:p.dashRechargeAt;}
    if(skill==='dash')p.pos=this.movePlayer(p.pos,{x:p.facing.x*3.5,z:p.facing.z*3.5});
    if(skill==='chargingStab')p.pos=chargeEnd(from,p.facing,this.solidBoss(),this.adds,5,this.pillars());
    if(skill==='swordSwing'||skill==='chargingStab') {
      const origin=skill==='chargingStab'?p.pos:from,reach=skill==='chargingStab'?2.2:p.armour?4:3,angle=skill==='chargingStab'?.85:p.armour?0:.5;
      to={x:origin.x+p.facing.x*reach,z:origin.z+p.facing.z*reach};
      if(this.visible(origin,this.boss.pos)&&meleeHits(origin,p.facing,this.boss.pos,reach,angle))damage=skill==='swordSwing'?38:60;
      for(const a of this.adds)if(a.hp>0&&this.visible(origin,a.pos)&&meleeHits(origin,p.facing,a.pos,reach,angle))this.damageTarget(a.id,skill==='swordSwing'?38:60);
    }
    if(skill==='lazor') {to={x:from.x+p.facing.x*14,z:from.z+p.facing.z*14};if(this.beamHits(from,p.facing,this.boss.pos))damage=90;}
    if(skill==='arcBolt'||skill==='arcSpear') {damage=this.visible(from,target.pos)?(skill==='arcBolt'?18:72):0;to=this.clip(from,target.pos);}
    if(skill==='pulseNova'){for(const a of this.players.values())if(a.alive&&this.visible(p.pos,a.pos)&&distance(a.pos,p.pos)<=4.5)a.hp=Math.min(a.maxHp,a.hp+18);if(d<=4.2&&this.visible(from,this.boss.pos))damage=45;}if(skill==='guard')p.guardUntil=now+1600;
    if(skill==='holyNova')for(const a of this.players.values())if(a.alive&&this.visible(p.pos,a.pos)&&distance(a.pos,p.pos)<=4.5)a.hp=Math.min(100,a.hp+25);
    if(skill==='arcBolt'||skill==='arcSpear'){this.damageTarget(target.id,damage)}
    else this.damageTarget('boss',damage);
    for(const a of this.adds)if(a.hp>0&&((skill==='lazor'&&this.beamHits(from,p.facing,a.pos))||(skill==='pulseNova'&&this.visible(from,a.pos)&&distance(from,a.pos)<=4.2)))this.damageTarget(a.id,skill==='lazor'?90:45);
    if(skill==='lazor'&&p.offhand)for(const t of [{id:'boss',pos:this.boss.pos,hp:this.boss.hp},...this.adds])if(t.hp>0&&this.beamHits(from,p.facing,t.pos))this.burns.set(p.id+':'+t.id,{target:t.id,next:now+1000,remaining:4});
    this.emit({type:'abilityFx',skill,playerId:p.id,from,to:skill==='dash'?{...p.pos}:['lazor','swordSwing','chargingStab'].includes(skill)?this.clip(from,to):to});
  }
  beamHits=(from:Vec2,dir:Vec2,target:Vec2,length=14,radius=1.6)=>{
    const end=this.clip(from,{x:from.x+dir.x*length,z:from.z+dir.z*length}),reach=distance(from,end);
    // A wide beam cannot damage an exposed target beyond its blocked centre ray.
    return this.visible(from,target)&&(reach>=length-1e-8||(target.x-from.x)*dir.x+(target.z-from.z)*dir.z<=reach)&&beamHits(from,dir,target,reach,radius);
  };
  targets(){return [{id:'boss',pos:this.boss.pos,hp:this.boss.hp},...this.adds].filter(t=>t.hp>0)}
  damageTarget(id:string,amount:number){const t=id==='boss'?this.boss:this.adds.find(a=>a.id===id);if(!t||t.hp<=0)return;
    const generation=id==='boss'?0:this.adds.find(a=>a.id===id)?.generation??0;
    const floor=isBall(this)&&generation<(this.boss.id==='hardYellowBall'?3:1)?t.maxHp/2:0;
    t.hp=Math.max(floor,t.hp-amount);
  }
  area(pos:Vec2,radius:number,damage:number){for(const t of this.targets())if(distance(pos,t.pos)<=radius&&this.visible(pos,t.pos))this.damageTarget(t.id,damage)}
  classAbility(p:PlayerState,slot:number,now:number,point:unknown,targetId:unknown){return classAbility.call(this,p,slot,now,point,targetId)}
  tickClassEffects(now:number){tickClassEffects.call(this,now)}
  recharge(p:PlayerState,now:number) {
    const max=p.head?3:1;
    // Spending another charge never restarts the current sequential recharge.
    while(p.dashRechargeAt&&now>=p.dashRechargeAt) {
      p.dashCharges++;
      p.dashRechargeAt=p.dashCharges<max?p.dashRechargeAt+SKILLS.dash.cooldown:0;
    }
    const slot=p.loadout.indexOf('dash');
    if(slot>=0)p.cooldowns[slot]=p.dashCharges?0:p.dashRechargeAt;
  }
  movePlayer(pos:Vec2,delta:Vec2){
    let p={...pos};const steps=Math.max(1,Math.ceil(Math.hypot(delta.x,delta.z)/.08));
    for(let i=0;i<steps;i++){
      p=moveSolid(p,{x:delta.x/steps,z:delta.z/steps},this.solidBoss(),this.pillars());
      for(const a of this.adds)if(a.kind==='ball'&&a.hp>0)p=moveSolid(p,{x:0,z:0},a.pos,[],(a.radius??.9)+.48);
    }return p;
  }
  solidBoss(){return this.boss.hp>0?this.boss.pos:{x:1000,z:1000}}
  pillars(){return this.boss.id==='hardWarden'?HARD_PILLARS:[]}
  clearBuffs(p:PlayerState){p.bulwarkUntil=p.invisibleUntil=p.poisonUntil=p.shield=p.shieldUntil=0;const i=p.loadout.indexOf('backstab');if(i>=0)p.loadout[i]='vanish';}
  hurt(p:PlayerState,now:number,amount=this.boss.id==='hardWarden'?64:48,bossDamage=true) {
    let damage=amount*(p.guardUntil>now?.25:1)*(p.bulwarkUntil>now?.5:1)*(bossDamage&&p.armour?.95:1);
    if(p.shieldUntil<=now)p.shield=0;const absorbed=Math.min(p.shield,damage);p.shield-=absorbed;damage-=absorbed;
    p.hp=Math.max(0,p.hp-damage);p.alive=p.hp>0;if(!p.alive){p.cast=undefined;this.clearBuffs(p);}
  }
  schedule(now:number) {
    const alive=[...this.players.values()].filter(p=>p.alive&&p.invisibleUntil<=now);const candidates=this.boss.id==='hardWarden'&&(this.mechanic+1)%3===0?alive:[...alive,...this.totems.filter(t=>t.hp>0)];if(!candidates.length)return;
    const target=candidates[this.mechanic++%candidates.length];let t:Telegraph;
    const dir=unit({x:target.pos.x-this.boss.pos.x,z:target.pos.z-this.boss.pos.z});
    if(this.boss.id==='greenCone') {
      t={id:this.uuid(),kind:'circle',pos:{...this.boss.pos},radius:3,resolvesAt:now+1500};
      this.boss.heading=Math.atan2(dir.x,dir.z);
      this.boss.smash={startedAt:now,impactAt:t.resolvesAt,recoverAt:t.resolvesAt+650};
      this.emit({type:'event',text:'Truffle Man: close-range smash!'});
      if(this.mechanic%3===0&&this.adds.length<6)for(const offset of [-1,1].slice(0,6-this.adds.length))this.adds.push({id:this.uuid(),pos:{x:clamp(this.boss.pos.x+offset*2),z:this.boss.pos.z},hp:54,maxHp:54,attackAt:now+1500});
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
    this.telegraphs.push(t);this.next=now+3600;
  }
  tick(now=Date.now()):Snapshot {
    if(this.vote&&now>=this.vote.expires)this.cancelVote();
    if(this.phase==='lobby') {
      const dt=Math.max(0,Math.min(.25,(now-this.lastTick)/1000));this.lastTick=now;
      this.hubNpc.tick(dt,[...this.players.values()].map(p=>p.pos));
      for(const p of this.players.values()) {
        const move=this.moves.get(p.id);
        if(move&&now-move.at<250){p.pos=moveHubPlayer(p.pos,{x:move.v.x*5.4*dt,z:move.v.z*5.4*dt},this.hubNpc.state.pos);if(Math.hypot(move.v.x,move.v.z)>0)p.facing={...move.v};}
      }
    }
    if(this.phase==='fight') {
      const dt=Math.max(0,Math.min(.25,(now-this.lastTick)/1000));this.lastTick=now;
      for(const p of this.players.values()){this.recharge(p,now);if(p.invisibleUntil<=now){const i=p.loadout.indexOf('backstab');if(i>=0)p.loadout[i]='vanish';}if(p.shieldUntil<=now)p.shield=0;}
      this.tickClassEffects(now);
      // Each caster refreshes only their own four-tick burn on a target.
      for(const [key,b] of this.burns) {
        while(b.remaining>0&&now>=b.next) {
          this.damageTarget(b.target,8);
          b.remaining--;b.next+=1000;
        }
        if(!b.remaining)this.burns.delete(key);
      }
      const alive=[...this.players.values()].filter(p=>p.alive);
      const chase=(pos:Vec2,speed:number,stop:number)=>{const target=[...alive.filter(p=>p.alive&&p.invisibleUntil<=now),...this.totems.filter(t=>t.hp>0)].sort((a,b)=>distance(pos,a.pos)-distance(pos,b.pos))[0];if(target){const d=distance(pos,target.pos),step=Math.min(speed*dt,Math.max(0,d-stop)),dir=unit({x:target.pos.x-pos.x,z:target.pos.z-pos.z});pos.x=clamp(pos.x+dir.x*step);pos.z=clamp(pos.z+dir.z*step);}return target;};
      if(this.boss.id==='greenCone'){
        const before={...this.boss.pos};this.boss.walking=false;
        if(!this.telegraphs.length&&this.boss.hp>0&&(!this.boss.smash||now>=this.boss.smash.recoverAt))chase(this.boss.pos,.9,1.73);
        const travelled=distance(before,this.boss.pos);this.boss.stride=(this.boss.stride??0)+travelled;this.boss.walking=travelled>0;
        if(travelled>0)this.boss.heading=Math.atan2(this.boss.pos.x-before.x,this.boss.pos.z-before.z);
      }
      this.adds=this.adds.filter(a=>a.hp>0);
      for(const a of this.adds.filter(a=>a.kind!=='ball')){const target=chase(a.pos,1.7,.85);if(target&&distance(a.pos,target.pos)<=1.1&&now>=a.attackAt){if('alive' in target)this.hurt(target,now,12,false);else target.hp=0;a.attackAt=now+1200;}}
      for(const p of this.players.values()) {
        if(!p.alive)continue;const input=this.moves.get(p.id),v=input&&now-input.at<300?input.v:{x:0,z:0},old={...p.pos};
        p.pos=this.movePlayer(p.pos,{x:v.x*.22*(p.bulwarkUntil>now?.5:1),z:v.z*.22*(p.bulwarkUntil>now?.5:1)});
        const actual={x:p.pos.x-old.x,z:p.pos.z-old.z};if(Math.hypot(actual.x,actual.z)>.001)p.facing=unit(actual);
      }
      if(isBall(this))this.balls.tick(now);else if(now>=this.next)this.schedule(now);
      if(this.boss.id==='greenCone'&&this.boss.hp>0)this.poison.tick(now,[...this.players.values()],this.uuid,(p,at,amount)=>this.hurt(p,at,amount));
      const deployment=this.scatter[0];
      if(deployment&&deployment.at<=now){
        this.scatter.shift();
        // Preserve marker separation even after a stalled tick. Never deploy two at once.
        if(this.scatter[0])this.scatter[0].at=Math.max(this.scatter[0].at,now+500);
        const tracked=this.players.get(deployment.targetId)??this.totems.find(t=>t.id===deployment.targetId);
        const target=tracked&&('alive' in tracked?tracked.alive&&tracked.invisibleUntil<=now:tracked.hp>0)?tracked:[...this.players.values()].find(p=>p.alive&&p.invisibleUntil<=now);
        if(target)this.telegraphs.push({id:this.uuid(),kind:'circle',pos:{...target.pos},radius:2.6,resolvesAt:now+1500});
      }

      for(const t of this.telegraphs.filter(t=>!t.ownerId&&t.resolvesAt<=now)) {
        // Publish the actual damage tick; a stalled server must not show an early slam.
        if(this.boss.id==='greenCone'&&this.boss.smash&&!this.boss.smash.impacted){this.boss.smash.impactAt=now;this.boss.smash.recoverAt=now+650;this.boss.smash.impacted=true;}
        for(const ttm of this.totems)if(ttm.hp>0&&(!t.sweep||!pillarOccludes(t.pos,ttm.pos))&&(t.kind==='circle'?distance(ttm.pos,t.pos)<=t.radius!:beamHits(t.pos,t.direction!,ttm.pos,t.length!,t.width!/2)))ttm.hp=0;for(const p of this.players.values())if(p.alive&&(!t.sweep||!pillarOccludes(t.pos,p.pos))&&(t.kind==='circle'?distance(p.pos,t.pos)<=t.radius!:beamHits(t.pos,t.direction!,p.pos,t.length!,t.width!/2)))this.hurt(p,now);
      }
      this.telegraphs=this.telegraphs.filter(t=>t.resolvesAt>now);
      if(this.boss.hp<=0&&(!isBall(this)||!this.adds.some(a=>a.hp>0))) {
        this.phase='won';this.poison.clear();this.scatter=[];this.totems=[];this.effects=[];for(const p of this.players.values()){p.cast=undefined;this.clearBuffs(p);}this.adds=[];this.burns.clear();this.motion=undefined;this.boss.height=0;this.telegraphs=[];
        this.reward={id:this.fightId,material:this.boss.id==='hardYellowBall'?'largeSphere':this.boss.id==='hardWarden'?'largeCylinder':this.boss.id==='warden'?'cylinderTube':this.boss.id==='yellowBall'?'sphericalBall':'conicalTaper',players:[...this.players.keys()]};
        this.emit({type:'event',text:'Victory! Material added to inventory. R: retry · H: hub'});
      } else if([...this.players.values()].every(p=>!p.alive)){this.phase='wiped';this.poison.clear();this.scatter=[];this.totems=[];this.effects=[];for(const p of this.players.values()){p.cast=undefined;this.clearBuffs(p);}}
    }
    return {type:'snapshot',now,poisonMark:this.poison.mark?structuredClone(this.poison.mark):undefined,poisonClouds:structuredClone(this.poison.clouds),hubNpc:this.phase==='lobby'?structuredClone(this.hubNpc.state):undefined,phase:this.phase,players:[...this.players.values()],boss:this.boss,adds:this.adds,telegraphs:this.telegraphs,readyCount:this.vote?.accepted.length??0,vote:this.vote,totems:this.totems,reward:this.reward,effects:this.effects};
  }
}
