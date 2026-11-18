import type {Game} from './game';
import type {AddState,PlayerState,Vec2} from './protocol';

export const ANT_QUEEN_HP=1200;
export const ROYAL_GUARD_HP=240;
export const ROYAL_DEATH_DAMAGE=300;
export const ANT_WAVE_INTERVAL_MS=9500;
export const ROCKFALL_INTERVAL_MS=12500;
export const ANT_ARENA_LIMIT=14.5;
export const ANT_QUEEN_POS:Vec2={x:0,z:10.5};

const at=(a:Vec2,b:Vec2)=>Math.hypot(a.x-b.x,a.z-b.z);

export function startAntQueen(this:Game,now:number){
 this.queenWave=0;this.royalsDefeated=0;
 this.nextAntWaveAt=now+1250;
 this.nextAntRockfallAt=now+6500;
 this.boss.pos={...ANT_QUEEN_POS};
 this.boss.hp=this.boss.maxHp=ANT_QUEEN_HP*this.bossScale;
 // Start opposite the nesting chambers rather than inside the queen's body.
 const players=[...this.players.values()];
 players.forEach((p,i)=>{p.pos={x:(i-(players.length-1)/2)*1.8,z:-10.5};p.facing={x:0,z:1}});
 this.system('Ant Queen: her carapace is invulnerable! Defeat Royal Guards to harm her.');
}
function spawnWorker(this:Game,wave:number,i:number):AddState{
 const side=i%2===0?-1:1;
 return {id:'ant-worker-'+this.uuid(),kind:'antWorker',pos:{x:side*(10.4+(i%3)*.5),z:3+(i%5)*1.1},
  hp:42,maxHp:42,radius:.48,attackAt:0};
}
function spawnRoyalGuard(this:Game,wave:number):AddState{
 return {id:'royal-guard-'+this.uuid(),kind:'royalGuard',pos:{x:wave%2?3.5:-3.5,z:7.8},
 hp:ROYAL_GUARD_HP*this.bossScale,maxHp:ROYAL_GUARD_HP*this.bossScale,radius:.92,attackAt:0};
}
export function tickAntQueen(this:Game,now:number){
 if(this.phase!=='fight'||(this.boss.id!=='antQueen'&&this.boss.id!=='chaosArena')||this.boss.hp<=0)return;
 if(this.boss.id==='chaosArena'&&!this.adds.some(a=>a.kind==='chaosBoss'&&a.bossId==='antQueen'&&a.hp>0))return;
 if(now>=this.nextAntWaveAt){
  this.queenWave++;
  const workers=this.adds.filter(a=>a.kind==='antWorker'&&a.hp>0).length;
  for(let i=0;i<Math.min(8,24-workers);i++)this.adds.push(spawnWorker.call(this,this.queenWave,i));
  if(!this.adds.some(a=>a.kind==='royalGuard'&&a.hp>0)&&this.royalsDefeated<ANT_QUEEN_HP/ROYAL_DEATH_DAMAGE)
    this.adds.push(spawnRoyalGuard.call(this,this.queenWave));
  this.nextAntWaveAt=now+ANT_WAVE_INTERVAL_MS;
  this.system('The Ant Queen sends wave '+this.queenWave+' from the tunnels! Hunt the armored Royal Guard.');
 }
 if(now>=this.nextAntRockfallAt){
  const targets=[...this.players.values()].filter(p=>p.alive);
  if(targets.length){
   // Two rockfall marks per selected player, limited so solo stays readable.
   const count=Math.min(4,Math.max(2,targets.length+1));
   for(let i=0;i<count;i++){
    const target=targets[i%targets.length];
    const angle=(i+this.queenWave)*Math.PI/3;
    const proposed={x:target.pos.x+(i?Math.cos(angle)*1.8:0),z:target.pos.z+(i?Math.sin(angle)*1.8:0)};
    const length=Math.hypot(proposed.x,proposed.z);
    const limit=this.arenaLimit();
    const pos=length>limit?{x:proposed.x*limit/length,z:proposed.z*limit/length}:proposed;
    this.telegraphs.push({id:'ant-rock-'+this.uuid(),kind:'circle',style:'rockfall',pos,radius:2,
     damage:26,resolvesAt:now+1750});
   }
   this.system('Ant Queen: rocks fall from the cave roof! Move out of the marked circles.');
  }
  this.nextAntRockfallAt=now+ROCKFALL_INTERVAL_MS;
 }
}
export function royalGuardKilled(this:Game,source:string|undefined){
 if((this.boss.id!=='antQueen'&&this.boss.id!=='chaosArena')||this.phase!=='fight')return;
 this.royalsDefeated++;
 if(this.boss.id==='chaosArena'){
   const queen=this.adds.find(a=>a.kind==='chaosBoss'&&a.bossId==='antQueen'&&a.hp>0);
   if(queen)queen.hp=Math.max(0,queen.hp-ROYAL_DEATH_DAMAGE*this.bossScale);
 }else this.boss.hp=Math.max(0,this.boss.hp-ROYAL_DEATH_DAMAGE*this.bossScale);
 this.emit({type:'event',text:'The fallen Royal Guard wounds the Queen! -'+ROYAL_DEATH_DAMAGE+' HP ('+this.royalsDefeated+'/4)'});
}
