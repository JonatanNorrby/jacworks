import type {Game} from './game';
import type {BossId,Vec2,AddState,Telegraph} from './protocol';
import {distance,partyBossMultiplier} from './game';

export const CHAOS_ARENA_LIMIT=21.5;
export const CHAOS_BASE_BOSSES=[
 {id:'warden',pos:{x:-12,z:7},hp:1800},
 {id:'yellowBall',pos:{x:12,z:7},hp:1800},
 {id:'greenCone',pos:{x:-12,z:-5},hp:1800},
 {id:'fracturer',pos:{x:12,z:-5},hp:2500},
 {id:'antQueen',pos:{x:0,z:15},hp:1200}
] as const satisfies readonly {id:BossId;pos:Vec2;hp:number}[];
export const CHAOS_BASE_HP=CHAOS_BASE_BOSSES.reduce((sum,b)=>sum+b.hp,0);
export type ChaosState={nextWarden:number;nextTruffle:number;wave:number;lastAt:number};
export const chaosBoss=(game:Game,id:BossId)=>game.adds.find(a=>a.kind==='chaosBoss'&&a.bossId===id&&a.hp>0);
export function startChaos(this:Game,now:number){
 this.chaosState={nextWarden:now+3000,nextTruffle:now+4500,wave:0,lastAt:now};
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
 this.fracturerSurge=undefined;this.fracturerSurgeIndex=0;this.nextFracturerSurgeAt=now+11000;
 this.poison.start(now);
 this.system('CHAOS ARENA! Warden, Yellow Ball, Truffle Man, Fracturer and the Ant Queen attack together. The Queen is immune until Royal Guards die!');
}
export function chaosHealth(this:Game){
 if(this.boss.id!=='chaosArena')return;
 this.boss.hp=this.adds.filter(a=>a.hp>0&&(a.kind==='chaosBoss'||a.kind==='ball'))
   .reduce((sum,a)=>sum+a.hp,0);
}
export function tickChaos(this:Game,now:number){
 const state=this.chaosState;if(!state||this.boss.id!=='chaosArena'||this.phase!=='fight')return;
 const dt=Math.max(0,Math.min(.25,(now-state.lastAt)/1000));state.lastAt=now;
 const alive=[...this.players.values()].filter(p=>p.alive&&p.invisibleUntil<=now);
 const warden=chaosBoss(this,'warden'),truffle=chaosBoss(this,'greenCone');
 if(warden&&alive.length&&now>=state.nextWarden){
  const target=this.selectTarget(now,warden.pos)??alive[0];
  const length=Math.max(1,distance(warden.pos,target.pos)),dir={x:(target.pos.x-warden.pos.x)/length,z:(target.pos.z-warden.pos.z)/length};
  this.telegraphs.push({id:this.uuid(),kind:'line',pos:{...warden.pos},direction:dir,width:3,length:14,resolvesAt:now+1500,damage:42} satisfies Telegraph);
  state.nextWarden=now+5200;this.system('Chaos Warden: sweeping strike!');
 }
 if(truffle){
  const target=this.selectTarget(now,truffle.pos)??alive[0];
  if(target){
   const d=distance(truffle.pos,target.pos);
   if(d>2.5){
    const step=Math.min(1.1*dt,d-2.5);
    truffle.pos={x:truffle.pos.x+(target.pos.x-truffle.pos.x)*step/d,z:truffle.pos.z+(target.pos.z-truffle.pos.z)*step/d};
   }
   if(now>=state.nextTruffle){
    this.telegraphs.push({id:this.uuid(),kind:'circle',pos:{...truffle.pos},radius:3.1,resolvesAt:now+1500,damage:40});
    state.nextTruffle=now+5500;this.system('Chaos Truffle Man: cave-floor slam!');
   }
  }
 }
 // The existing Fracturer cardinal eruption, Yellow Ball physics and Ant Queen
 // wave/rockfall brains continue in the main fight tick, with independent state.
 chaosHealth.call(this);
}
