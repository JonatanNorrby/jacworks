import type {Game} from './game';
import type {BossId,Vec2,AddState,Telegraph,PlayerState} from './protocol';
import {distance,partyBossMultiplier} from './game';

export const CHAOS_ARENA_LIMIT=21.5;
export const CHAOS_FRACTURE_CORRIDOR=5.5;
// Stationary champions stand on axial walkways, so Fracturer's sequential
// corner collapses never make a stationary boss inaccessible to melee players.
export const CHAOS_BASE_BOSSES=[
 {id:'warden',pos:{x:-12,z:0},hp:1800},
 {id:'yellowBall',pos:{x:12,z:7},hp:1800},
 {id:'greenCone',pos:{x:-12,z:-7},hp:1800},
 {id:'fracturer',pos:{x:12,z:0},hp:2500},
 {id:'antQueen',pos:{x:0,z:15},hp:1200}
] as const satisfies readonly {id:BossId;pos:Vec2;hp:number}[];
export const CHAOS_IMMOBILE_BOSSES=['warden','fracturer','antQueen'] as const;
export const CHAOS_BASE_HP=CHAOS_BASE_BOSSES.reduce((sum,b)=>sum+b.hp,0);
export type ChaosState={
 nextWarden:number;wardenPattern:number;
 nextFracturer:number;fracturerPattern:number;
 nextTruffle:number;truffleSmashes:number;truffleSmashUntil:number;lastAt:number
};
export const chaosBoss=(game:Game,id:BossId)=>game.adds.find(a=>a.kind==='chaosBoss'&&a.bossId===id&&a.hp>0);
export function startChaos(this:Game,now:number){
 this.chaosState={
  nextWarden:now+3000,wardenPattern:0,
  nextFracturer:now+3700,fracturerPattern:0,
  nextTruffle:now+4500,truffleSmashes:0,truffleSmashUntil:0,lastAt:now
 };
 this.bossScale=partyBossMultiplier(this.players.size);
 this.boss.pos={x:0,z:0};this.boss.hp=this.boss.maxHp=CHAOS_BASE_HP*this.bossScale;
 this.adds=CHAOS_BASE_BOSSES.map((entry):AddState=>({
  id:'chaos-'+entry.id+'-'+this.uuid(),kind:'chaosBoss',bossId:entry.id,
  pos:{...entry.pos},hp:entry.hp*this.bossScale,maxHp:entry.hp*this.bossScale,
  radius:entry.id==='yellowBall'?1.25:entry.id==='antQueen'?1.8:1.35,attackAt:now+2500
 }));
 const players=[...this.players.values()];
 players.forEach((p,i)=>{p.pos={x:(i-(players.length-1)/2)*2,z:-17};p.facing={x:0,z:1};});
 this.queenWave=0;this.royalsDefeated=0;this.nextAntWaveAt=now+1500;this.nextAntRockfallAt=now+6500;
 this.arenaCuts=[];this.nextCollapseAt=now+7000;
 this.fracturerSurge=undefined;this.fracturerSurgeIndex=0;this.nextFracturerSurgeAt=now+11000;
 this.poison.start(now);
 this.system('CHAOS ARENA! All five bosses use their normal mechanics. Warden, Fracturer and the Queen hold position; Yellow Ball and Truffle Man roam.');
}
export function chaosHealth(this:Game){
 if(this.boss.id!=='chaosArena')return;
 this.boss.hp=this.adds.filter(a=>a.hp>0&&(a.kind==='chaosBoss'||a.kind==='ball'))
   .reduce((sum,a)=>sum+a.hp,0);
}
function normalBossPattern(this:Game,boss:AddState,now:number,pattern:number,label:string,players:PlayerState[]){
 const target=this.selectTarget(now,boss.pos)??players[pattern%players.length];
 if(!target)return;
 boss.heading=Math.atan2(target.pos.x-boss.pos.x,target.pos.z-boss.pos.z);
 const length=Math.max(.001,distance(target.pos,boss.pos));
 const dir={x:(target.pos.x-boss.pos.x)/length,z:(target.pos.z-boss.pos.z)/length};
 // The normal Warden and Fracturer both use this same three-step pattern:
 // marked large circle, directed line, then small circle plus party scatter.
 let telegraph:Telegraph;
 if(pattern%3===1){
  telegraph={id:this.uuid(),kind:'line',pos:{...boss.pos},direction:dir,width:3,length:13,resolvesAt:now+1500};
 }else{
  const scatter=pattern%3===2;
  telegraph={id:this.uuid(),kind:'circle',pos:{...target.pos},radius:scatter?2.2:3.1,resolvesAt:now+1500};
  if(scatter)for(const p of players)if(p.id!==target.id)this.telegraphs.push({
   id:this.uuid(),kind:'circle',pos:{...p.pos},radius:2.2,resolvesAt:now+1500,sourceBossId:boss.bossId
  });
 }
 this.telegraphs.push({...telegraph,sourceBossId:boss.bossId});
 this.system(label+': '+(pattern%3===1?'sweeping line!':pattern%3===2?'party scatter!':'marked blast!'));
}
export function tickChaos(this:Game,now:number){
 const state=this.chaosState;if(!state||this.boss.id!=='chaosArena'||this.phase!=='fight')return;
 const dt=Math.max(0,Math.min(.25,(now-state.lastAt)/1000));state.lastAt=now;
 const alive=[...this.players.values()].filter(p=>p.alive&&p.invisibleUntil<=now);
 const warden=chaosBoss(this,'warden');
 if(warden&&alive.length){
  const target=this.selectTarget(now,warden.pos)??alive[0];
  warden.heading=Math.atan2(target.pos.x-warden.pos.x,target.pos.z-warden.pos.z);
 }
 if(warden&&alive.length&&now>=state.nextWarden){
  normalBossPattern.call(this,warden,now,state.wardenPattern++,'Chaos Warden',alive);
  state.nextWarden=now+3600;
 }
 const fracturer=chaosBoss(this,'fracturer');
 if(fracturer&&alive.length&&now>=state.nextFracturer){
  normalBossPattern.call(this,fracturer,now,state.fracturerPattern++,'Chaos Fracturer',alive);
  state.nextFracturer=now+3600;
 }
 const truffle=chaosBoss(this,'greenCone');
 if(truffle&&truffle.smash&&now>=truffle.smash.recoverAt)truffle.smash=undefined;
 if(truffle){
  const target=this.selectTarget(now,truffle.pos)??alive[0];
  if(target){
   const d=distance(truffle.pos,target.pos);
   // Match standalone Truffle's chase speed and stop-at-melee radius. The
   // generic add-chase loop must not move any chaos boss a second time.
   if(d>1.73&&now>=state.truffleSmashUntil){
    const step=Math.min(.9*dt,d-1.73);
    truffle.pos={x:truffle.pos.x+(target.pos.x-truffle.pos.x)*step/d,z:truffle.pos.z+(target.pos.z-truffle.pos.z)*step/d};
   }
   truffle.heading=Math.atan2(target.pos.x-truffle.pos.x,target.pos.z-truffle.pos.z);
   if(now>=state.nextTruffle){
    this.telegraphs.push({id:this.uuid(),kind:'circle',pos:{...truffle.pos},radius:3,resolvesAt:now+1500,damage:48,sourceBossId:'greenCone'});
    truffle.smash={startedAt:now,impactAt:now+1500,recoverAt:now+2150};
    state.truffleSmashUntil=now+2150;
    state.nextTruffle=now+3600;
    state.truffleSmashes++;
    this.system('Chaos Truffle Man: cave-floor smash!');
    // Standalone Truffle adds two small mushrooms on every third smash,
    // capped at six active mushrooms in Normal difficulty.
    if(state.truffleSmashes%3===0){
     let active=this.adds.filter(a=>!a.kind&&a.hp>0).length;
     for(const sign of [-1,1])if(active<6){
      const x=truffle.pos.x+sign*2,z=truffle.pos.z+sign*.5;
      const radius=Math.hypot(x,z),bounded=radius>CHAOS_ARENA_LIMIT-1?(CHAOS_ARENA_LIMIT-1)/radius:1;
      this.adds.push({id:'chaos-truffle-add-'+this.uuid(),pos:{x:x*bounded,z:z*bounded},hp:54,maxHp:54,attackAt:now+1500,radius:.45});
      active++;
     }
     this.system('Chaos Truffle Man calls mushroom reinforcements!');
    }
   }
  }
 }else this.poison.clear();
 // Yellow Ball's roll/bounce/split, Fracturer's cardinal eruptions and corner
 // collapses, and the Queen's workers/Royals/Rockfall tick in game.ts.
 chaosHealth.call(this);
}
