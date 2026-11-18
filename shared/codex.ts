import type {BossId,MaterialReward,Snapshot} from './protocol';
import type {Material} from './inventory';
import {BOSS_CIRCLES} from './boss-layout';

export const MATERIAL_SOURCES:Record<Material,{name:string;source:string;boss:BossId}>={
 cylinderTube:{name:'Cylinder Tube',source:'Warden · Normal',boss:'warden'},
 largeCylinder:{name:'Large Cylinder',source:'Hard Warden',boss:'hardWarden'},
 sphericalBall:{name:'Spherical Ball',source:'Yellow Ball · Normal',boss:'yellowBall'},
 largeSphere:{name:'Large Sphere',source:'Hard Yellow Ball',boss:'hardYellowBall'},
 conicalTaper:{name:'Conical Taper',source:'Truffle Man (Normal) or The Fracturer',boss:'greenCone'},
 hardTruffleSpore:{name:'Corrupted Truffle Spore',source:'Hard Truffle Man',boss:'hardGreenCone'},
 duoCore:{name:'Twin Core',source:'Warden + Yellow Ball · Double',boss:'duoYellowWarden'},
 duoSpore:{name:'Fractured Spore',source:'Truffle Man + Fracturer · Double',boss:'duoTruffleFracturer'},
 antChitin:{name:'Royal Ant Chitin',source:'Ant Queen · Nest (defeat the full encounter)',boss:'antQueen'},
 chaosSigil:{name:'Chaos Sigil',source:'Chaos Arena · defeat all five bosses',boss:'chaosArena'}
};
export const CODEX_BOSS_NAMES=Object.fromEntries(BOSS_CIRCLES.flatMap(c=>c.bosses.map(([id,name])=>[id,name]))) as Record<BossId,string>;
export const CODEX_MECHANICS={
 lineSweep:{name:'Line Sweep',description:'A long directional warning predicts the Warden’s sweeping strike.'},
 pillarCover:{name:'Pillar Cover',description:'A sweeping blast is coming; the stone pillars can break its line of sight.'},
 collapseIn:{name:'Collapse In',description:'The Hard Warden marks the distant arena while a close ring remains clear.'},
 rollingCharge:{name:'Rolling Charge',description:'Yellow Ball telegraphs a roll toward its target.'},
 bouncingSlam:{name:'Bouncing Slam',description:'Yellow Ball marks a landing point before dropping from above.'},
 splitting:{name:'Ball Division',description:'A damaged Yellow Ball creates smaller, independently moving fragments.'},
 sporeMark:{name:'Spore Mark',description:'Truffle Man marks players before poisonous growth erupts.'},
 truffleSlam:{name:'Truffle Slam',description:'Truffle Man pauses for a visible close-range ground strike.'},
 cardinalEruption:{name:'Cardinal Eruption',description:'The Fracturer warns that three compass sectors will become unsafe.'},
 crumblingGround:{name:'Crumbling Ground',description:'The Fracturer marks corners of the arena before they break away.'},
 workerWaves:{name:'Worker Waves',description:'Small ants emerge in successive waves from the tunnels.'},
 royalGuard:{name:'Royal Guard',description:'The armored ant dies and the Queen visibly loses some of her HP.'},
 rockfall:{name:'Falling Rocks',description:'Impact circles signal falling cave stones.'},
 chaosCombined:{name:'All at Once',description:'Several independently moving boss threats are active at the same time.'}
} as const;
export type MechanicId=keyof typeof CODEX_MECHANICS;
export type CodexProgress={seen:BossId[];mechanics:Partial<Record<BossId,MechanicId[]>>;loot:Material[]};
const bosses=new Set<string>(Object.keys(CODEX_BOSS_NAMES));
const materials=new Set<string>(Object.keys(MATERIAL_SOURCES));
const mechanics=new Set<string>(Object.keys(CODEX_MECHANICS));
export const emptyCodex=():CodexProgress=>({seen:[],mechanics:{},loot:[]});
export function readCodex(raw:unknown):CodexProgress{
 let val:unknown=raw;
 if(typeof val==='string'){try{val=JSON.parse(val)}catch{val=null}}
 if(!val||typeof val!=='object')return emptyCodex();
 const record=val as Record<string,unknown>,known=Array.isArray(record.seen)?record.seen:[],seen=[...new Set(known.filter((b):b is BossId=>typeof b==='string'&&bosses.has(b)))];
 const loot=[...new Set((Array.isArray(record.loot)?record.loot:[]).filter((m):m is Material=>typeof m==='string'&&materials.has(m)))];
 const result:CodexProgress={seen,loot,mechanics:{}};
 if(record.mechanics&&typeof record.mechanics==='object')for(const [boss,items] of Object.entries(record.mechanics)){
   if(bosses.has(boss)&&Array.isArray(items))result.mechanics[boss as BossId]=[...new Set(items.filter((m):m is MechanicId=>typeof m==='string'&&mechanics.has(m)))];
 }
 return result;
}
function reveal(p:CodexProgress,boss:BossId,key:MechanicId){
 if(!p.seen.includes(boss))p.seen.push(boss);
 const list=p.mechanics[boss]??=[];if(!list.includes(key)){list.push(key);p.mechanics[boss]=list;}
}
export function observeCodex(p:CodexProgress,s:Snapshot,playerId:string):boolean{
 if(s.phase!=='fight'&&s.phase!=='won')return false;
 const before=JSON.stringify(p),id=s.boss.id;
 if(!p.seen.includes(id))p.seen.push(id);
 if(id==='chaosArena'){
   reveal(p,'chaosArena','chaosCombined');
   for(const a of s.adds)if(a.kind==='chaosBoss'&&a.bossId&&!p.seen.includes(a.bossId))p.seen.push(a.bossId);
 }
 const observed=(boss:BossId,key:MechanicId)=>reveal(p,boss,key);
 const marks=s.telegraphs;
 const boss=id==='chaosArena'?undefined:id;
 const group=(v:BossId)=>boss===v||(id==='chaosArena'&&s.adds.some(a=>a.kind==='chaosBoss'&&a.bossId===v));
 if(group('warden')||group('hardWarden')||group('duoYellowWarden')){
  if(marks.some(t=>t.kind==='line'&&!t.ownerId))observed(id==='chaosArena'?'warden':boss!,'lineSweep');
  if(marks.some(t=>t.sweep))observed('hardWarden','pillarCover');
  if(s.hardWardenCall)observed('hardWarden','collapseIn');
 }
 if(group('yellowBall')||group('hardYellowBall')||group('duoYellowWarden')){
  if(marks.some(t=>t.ownerId&&t.kind==='line'))observed(id==='chaosArena'?'yellowBall':boss!,'rollingCharge');
  if(marks.some(t=>t.ownerId&&t.kind==='circle'))observed(id==='chaosArena'?'yellowBall':boss!,'bouncingSlam');
  if(s.adds.some(a=>a.kind==='ball'))observed(id==='chaosArena'?'yellowBall':boss!,'splitting');
 }
 if(group('greenCone')||group('hardGreenCone')||group('duoTruffleFracturer')){
  if(s.poisonMarks?.length)observed(id==='chaosArena'?'greenCone':boss!,'sporeMark');
  if(s.boss.smash)observed(id==='chaosArena'?'greenCone':boss!,'truffleSlam');
 }
 if(group('fracturer')||group('duoTruffleFracturer')){
  if(s.fracturerSurge)observed('fracturer','cardinalEruption');
  if(s.arenaCuts?.length)observed('fracturer','crumblingGround');
 }
 if(group('antQueen')){
  if((s.queenWave??0)>0)observed('antQueen','workerWaves');
  if((s.royalsDefeated??0)>0)observed('antQueen','royalGuard');
  if(marks.some(t=>t.style==='rockfall'))observed('antQueen','rockfall');
 }
 for(const r of [s.reward,...(s.bonusRewards??[])]){
  if(r?.players.includes(playerId)&&materials.has(r.material as Material)&&!p.loot.includes(r.material as Material))p.loot.push(r.material as Material);
 }
 return JSON.stringify(p)!==before;
}
