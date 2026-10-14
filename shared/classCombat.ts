import type { Game } from './game';
import type { PlayerState,Vec2 } from './protocol';
import { SKILLS } from './protocol';
const distance=(a:Vec2,b:Vec2)=>Math.hypot(a.x-b.x,a.z-b.z);


export function classAbility(this:Game,p:PlayerState,slot:number,now:number,point:unknown,targetId:unknown){
    const skill=p.loadout[slot-1];
    if(!['targetedHeal','holyLight','lightningStorm','lightningShield','aimedShot','arrowRain','splitShot','fireball','fireMine'].includes(skill))return false;
    if(now<p.cooldowns[slot-1])return true;
    let pos:Vec2;
    if(point!==undefined){const v=point as Vec2;if(!v||typeof v.x!=='number'||typeof v.z!=='number'||!Number.isFinite(v.x)||!Number.isFinite(v.z)||Math.abs(v.x)>12||Math.abs(v.z)>12||distance(p.pos,v)>11)return true;pos={x:v.x,z:v.z};}
    else pos={...(this.targets().sort((a,b)=>distance(p.pos,a.pos)-distance(p.pos,b.pos))[0]?.pos??p.pos)};
    let ally:PlayerState|undefined,enemy:ReturnType<Game['targets']>[number]|undefined;
    if(skill==='targetedHeal'||skill==='lightningShield'){
      ally=targetId===undefined?p:this.players.get(String(targetId));if(!ally?.alive||distance(p.pos,ally.pos)>11)return true;pos={...ally.pos};
    }
    if(['holyLight','aimedShot','fireball'].includes(skill)){
      enemy=targetId===undefined?this.targets().sort((a,b)=>distance(pos,a.pos)-distance(pos,b.pos))[0]:this.targets().find(t=>t.id===targetId);
      if(!enemy||distance(p.pos,enemy.pos)>11)return true;pos={...enemy.pos};
    }
    p.cooldowns[slot-1]=now+SKILLS[skill].cooldown;
    if(skill==='aimedShot'||skill==='fireball'||skill==='lightningStorm'){
      p.cast={skill,slot,endsAt:now+(skill==='aimedShot'?1000:skill==='fireball'?2000:3000),target:pos,targetId:enemy?.id,nextTick:skill==='lightningStorm'?now+500:undefined};
    }else if(skill==='targetedHeal')ally!.hp=Math.min(ally!.maxHp,ally!.hp+40);
    else if(skill==='holyLight')this.damageTarget(enemy!.id,32);
    else if(skill==='splitShot'){
      for(const angle of [-.3,0,.3]){const dir={x:p.facing.x*Math.cos(angle)-p.facing.z*Math.sin(angle),z:p.facing.x*Math.sin(angle)+p.facing.z*Math.cos(angle)};for(const t of this.targets())if(this.beamHits(p.pos,dir,t.pos,10,.65))this.damageTarget(t.id,22)}
      pos={x:p.pos.x+p.facing.x*10,z:p.pos.z+p.facing.z*10};
    }else this.effects.push({id:this.uuid(),owner:p.id,skill,pos,targetId:ally?.id,next:now+(skill==='arrowRain'?400:1000),remaining:skill==='arrowRain'?3:6,expires:now+(skill==='fireMine'?12000:6500)});
    if(!['aimedShot','fireball'].includes(skill))this.emit({type:'abilityFx',skill,playerId:p.id,from:{...p.pos},to:pos});return true;
  }
export function tickClassEffects(this:Game,now:number){
    for(const p of this.players.values()){
      const c=p.cast;if(!c)continue;
      const move=this.moves.get(p.id);if(!p.alive||(move&&now-move.at<300&&Math.hypot(move.v.x,move.v.z)>0)){p.cast=undefined;continue;}
      if(c.skill==='lightningStorm')while(c.nextTick!<=Math.min(now,c.endsAt)){this.area(c.target,3,22);this.emit({type:'abilityFx',skill:c.skill,playerId:p.id,from:c.target,to:c.target});c.nextTick!+=500;}
      if(now<c.endsAt)continue;p.cast=undefined;
      if(c.skill==='lightningStorm')continue;
      const t=this.targets().find(t=>t.id===c.targetId);if(!t||distance(p.pos,t.pos)>11)continue;
      // Projectile travel is simulated on the server; impact position is fixed at release.
      this.effects.push({id:this.uuid(),owner:p.id,skill:c.skill,pos:{...t.pos},targetId:t.id,next:now+350,remaining:1,expires:now+1000});
      this.emit({type:'abilityFx',skill:c.skill,playerId:p.id,from:{...p.pos},to:{...t.pos}});
    }
    this.effects=this.effects.filter(e=>{
      const owner=this.players.get(e.owner);if(!owner?.alive||now>e.expires)return false;
      if(e.skill==='lightningShield'){const ally=this.players.get(e.targetId!);if(!ally?.alive)return false;e.pos={...ally.pos};}
      if(e.skill==='fireMine'){
        if(this.targets().some(t=>distance(e.pos,t.pos)<=2)){this.area(e.pos,3,95);this.emit({type:'abilityFx',skill:e.skill,playerId:e.owner,from:e.pos,to:e.pos});return false;}return true;
      }
      while(e.remaining&&now>=e.next){
        if(e.skill==='aimedShot'){const t=this.targets().find(t=>t.id===e.targetId);if(t&&distance(e.pos,t.pos)<=1.6)this.damageTarget(t.id,58);}
        else this.area(e.pos,e.skill==='fireball'?2:e.skill==='lightningShield'?3:3.5,e.skill==='fireball'?100:e.skill==='lightningShield'?14:28);
        if(e.skill!=='aimedShot')this.emit({type:'abilityFx',skill:e.skill,playerId:e.owner,from:e.pos,to:e.pos});e.remaining--;e.next+=e.skill==='arrowRain'?600:1000;
      }return e.remaining>0;
    });
  }
