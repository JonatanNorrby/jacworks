import type {Game} from './game';
import {beamHits,distance} from './game';
import type {Vec2,Telegraph} from './protocol';
type Motion={kind:'roll'|'bounce';from:Vec2;to:Vec2;start:number;end:number;hit:Set<string>};
type Brain={next:number;step:number;chain:number;motion?:Motion};
const bounded=(p:Vec2)=>({x:Math.max(-10,Math.min(10,p.x)),z:Math.max(-10,Math.min(10,p.z))});
export const isBall=(g:Game)=>g.boss.id==='yellowBall'||g.boss.id==='hardYellowBall';
export class BallEncounter {
 brains=new Map<string,Brain>();
 private g:Game;
 constructor(g:Game){this.g=g;}
 bodies(){const g=this.g;return [{...g.boss,id:'boss',generation:0,radius:1.25},...g.adds].filter(b=>b.hp>0);}
 tick(now:number){
  const g=this.g,hard=g.boss.id==='hardYellowBall',limit=hard?3:1;
  // Freeze the roster: children cannot split or receive the parent's overkill this tick.
  for(const b of this.bodies())if((b.generation??0)<limit&&b.hp<=b.maxHp/2){
   if(b.id==='boss'){g.boss.hp=0;g.boss.height=0;g.motion=undefined;}else g.adds=g.adds.filter(a=>a.id!==b.id);
   this.brains.delete(b.id);g.telegraphs=g.telegraphs.filter(t=>t.ownerId!==b.id);
   for(const sign of [-1,1]){const generation=(b.generation??0)+1,radius=1.25*Math.pow(.72,generation),maxHp=b.maxHp/4;
    const id=g.uuid();g.adds.push({id,kind:'ball',generation,radius,height:0,pos:bounded({x:b.pos.x+sign*(radius+.3),z:b.pos.z}),hp:maxHp,maxHp,attackAt:now+1800});
    this.brains.set(id,{next:now+1800+(sign===1?500:0),step:0,chain:0});
   }
   g.emit({type:'event',text:'Yellow Ball splits into two!'});
  }
  const bodies=this.bodies();
  for(const [id] of this.brains)if(!bodies.some(b=>b.id===id))this.brains.delete(id);
  g.telegraphs=g.telegraphs.filter(t=>!t.ownerId||bodies.some(b=>b.id===t.ownerId));
  for(const body of bodies){
   const b=body.id==='boss'?g.boss:g.adds.find(a=>a.id===body.id)!;
   const generation=body.generation??0,radius=body.radius??1.25;
   let brain=this.brains.get(body.id);if(!brain){brain={next:g.next,step:0,chain:0};this.brains.set(body.id,brain);}
   const damage=hard?Math.max(12,36-generation*8):generation?24:48;
   if(brain.motion){const m=brain.motion,t=Math.max(0,Math.min(1,(now-m.start)/(m.end-m.start))),previous={...b.pos};
    b.pos={x:m.from.x+(m.to.x-m.from.x)*t,z:m.from.z+(m.to.z-m.from.z)*t};b.height=m.kind==='bounce'?Math.sin(t*Math.PI)*(4-generation*.65):0;
    const impact=(pos:Vec2)=>m.kind==='bounce'?t===1&&distance(pos,m.to)<=2.8-generation*.45:beamHits(previous,{x:(b.pos.x-previous.x)/(distance(previous,b.pos)||1),z:(b.pos.z-previous.z)/(distance(previous,b.pos)||1)},pos,distance(previous,b.pos),radius+.48);
    for(const p of g.players.values())if(p.alive&&!m.hit.has(p.id)&&impact(p.pos)){g.hurt(p,now,damage);m.hit.add(p.id);}
    for(const ttm of g.totems)if(impact(ttm.pos))ttm.hp=0;
    if(t===1){brain.motion=undefined;b.height=0;brain.next=brain.chain?now:now+(hard?1800+generation*450:1300);if(body.id==='boss')g.motion=undefined;}
   }
   const due=g.telegraphs.find(t=>t.ownerId===body.id&&t.resolvesAt<=now);
   if(due){const to=due.kind==='line'?{x:due.pos.x+due.direction!.x*10,z:due.pos.z+due.direction!.z*10}:due.pos;
    brain.motion={kind:due.kind==='line'?'roll':'bounce',from:{...b.pos},to:bounded(to),start:now,end:now+(due.kind==='line'?800-generation*100:1000-generation*100),hit:new Set()};
    if(body.id==='boss')g.motion=brain.motion;g.telegraphs=g.telegraphs.filter(t=>t!==due);
   }
   if(!brain.motion&&!g.telegraphs.some(t=>t.ownerId===body.id)&&now>=brain.next){
    const candidates=[...g.players.values()].filter(p=>p.alive&&p.invisibleUntil<=now);
    const target=[...candidates,...g.totems.filter(t=>t.hp>0)].sort((left,right)=>distance(left.pos,b.pos)-distance(right.pos,b.pos))[0];if(!target)continue;
    const roll=brain.chain===0&&brain.step++%2===0;
    if(!roll&&brain.chain===0)brain.chain=hard?3:1;
    if(!roll)brain.chain--;
    const d=distance(b.pos,target.pos)||1;
    const t:Telegraph=roll?{id:g.uuid(),ownerId:body.id,kind:'line',pos:{...b.pos},direction:{x:(target.pos.x-b.pos.x)/d,z:(target.pos.z-b.pos.z)/d},width:(radius+.48)*2,length:10,resolvesAt:now+1500}:{id:g.uuid(),ownerId:body.id,kind:'circle',pos:bounded(target.pos),radius:2.8-generation*.45,resolvesAt:now+(hard?1100:1500)};
    g.telegraphs.push(t);
    if(body.id==='boss')g.emit({type:'event',text:roll?'Yellow Ball: rolling charge!':hard?'Hard Yellow Ball: triple bounce!':'Yellow Ball: bouncing slam!'});
   }
  }
 }
}
