import { meleeHits,chargeEnd } from './game';
import type { Game } from './game';
import type { PlayerState,Vec2 } from './protocol';
import { SKILLS, BACKSTAB } from './protocol';
const distance=(a:Vec2,b:Vec2)=>Math.hypot(a.x-b.x,a.z-b.z);


export function classAbility(this:Game,p:PlayerState,slot:number,now:number,point:unknown,targetId:unknown){
    const skill=p.loadout[slot-1];
    if(['stab','bulwark','heroicShield','quickStab','vanish','backstab','poisonEnchant'].includes(skill)){
      if(now<p.cooldowns[slot-1]&&skill!=='backstab')return true;
      if(skill==='backstab'&&p.invisibleUntil<=now)return true;
      const from={...p.pos};let to={...p.pos};
      if(skill==='heroicShield'){
        const ally=targetId===undefined?p:this.players.get(String(targetId));if(!ally?.alive||distance(p.pos,ally.pos)>11)return true;
        if(ally!==p){const d=distance(p.pos,ally.pos);p.pos=chargeEnd(p.pos,{x:(ally.pos.x-p.pos.x)/d||0,z:(ally.pos.z-p.pos.z)/d||0},this.solidBoss(),this.adds,d,this.pillars());ally.shield=Math.max(ally.shield,40);ally.shieldUntil=now+6000;}
        p.shield=Math.max(p.shield,80);p.shieldUntil=now+6000;to={...p.pos};
      }else if(skill==='bulwark')p.bulwarkUntil=now+6000;
      else if(skill==='poisonEnchant')p.poisonUntil=now+6000;
      else if(skill==='vanish'){p.invisibleUntil=now+4000;p.loadout[slot-1]='backstab';}
      else {
        for(const t of this.targets())if(this.visible(p.pos,t.pos)&&meleeHits(p.pos,p.facing,t.pos,2.8,.75)){
          // Boss faces its current target; rear attack requires opposite side of that facing.
          const victim=[...this.players.values()].filter(a=>a.alive&&a.invisibleUntil<=now).sort((a,b)=>distance(t.pos,a.pos)-distance(t.pos,b.pos))[0];
          const behind=!victim||((p.pos.x-t.pos.x)*(victim.pos.x-t.pos.x)+(p.pos.z-t.pos.z)*(victim.pos.z-t.pos.z))<0;
          this.damageTarget(t.id,skill==='stab'?32:skill==='backstab'&&behind?BACKSTAB.rear:BACKSTAB.normal);
          if(p.poisonUntil>now)this.effects.push({id:this.uuid(),owner:p.id,skill:'poisonEnchant',targetId:t.id,pos:{...t.pos},next:now+1000,remaining:BACKSTAB.poisonTicks,expires:now+5000});
        }
        if(skill==='backstab'){p.invisibleUntil=0;p.loadout[slot-1]='vanish';}
        to={x:p.pos.x+p.facing.x*2.8,z:p.pos.z+p.facing.z*2.8};
      }
      if(skill!=='backstab')p.cooldowns[slot-1]=now+SKILLS[skill].cooldown;
      this.emit({type:'abilityFx',skill,playerId:p.id,from,to:['stab','quickStab','backstab'].includes(skill)?this.clip(from,to):to});return true;
    }
    if(!['targetedHeal','holyLight','lightningStorm','lightningShield','aimedShot','arrowRain','splitShot','fireball','fireMine','earthShock','fireTotem','healingTotem'].includes(skill))return false;
    if(now<p.cooldowns[slot-1])return true;
    let pos:Vec2;
    if(point!==undefined){const v=point as Vec2;if(!v||typeof v.x!=='number'||typeof v.z!=='number'||!Number.isFinite(v.x)||!Number.isFinite(v.z)||Math.abs(v.x)>12||Math.abs(v.z)>12||distance(p.pos,v)>11||!this.visible(p.pos,v)||this.pillars().some(c=>distance(c,v)<1.5))return true;pos={x:v.x,z:v.z};}
    else pos={...(this.targets().sort((a,b)=>distance(p.pos,a.pos)-distance(p.pos,b.pos))[0]?.pos??p.pos)};
    let ally:PlayerState|undefined,enemy:ReturnType<Game['targets']>[number]|undefined;
    if(skill==='targetedHeal'||skill==='lightningShield'){
      ally=targetId===undefined?p:this.players.get(String(targetId));if(!ally?.alive||distance(p.pos,ally.pos)>11)return true;pos={...ally.pos};
    }
    if(['holyLight','aimedShot','fireball','earthShock'].includes(skill)){
      enemy=targetId===undefined?this.targets().sort((a,b)=>distance(pos,a.pos)-distance(pos,b.pos))[0]:this.targets().find(t=>t.id===targetId);
      if(!enemy||distance(p.pos,enemy.pos)>11||!this.visible(p.pos,enemy.pos))return true;pos={...enemy.pos};
    }
    if(['fireTotem','healingTotem','fireMine','arrowRain','lightningStorm'].includes(skill)&&(distance(p.pos,pos)>11||!this.visible(p.pos,pos)||this.pillars().some(c=>distance(c,pos)<1.5)))return true;
    p.cooldowns[slot-1]=now+SKILLS[skill].cooldown;
    if(skill==='fireTotem'||skill==='healingTotem'){
      this.totems=this.totems.filter(t=>!(t.owner===p.id&&t.kind===skill));
      this.totems.push({id:this.uuid(),owner:p.id,kind:skill,pos,hp:1,next:now+1000,expires:now+15000});
    }else if(skill==='earthShock')this.damageTarget(enemy!.id,36);
    else if(skill==='aimedShot'||skill==='fireball'||skill==='lightningStorm'){
      p.cast={skill,slot,endsAt:now+(skill==='aimedShot'?1000:skill==='fireball'?2000:3000),target:pos,targetId:enemy?.id,nextTick:skill==='lightningStorm'?now+500:undefined};
    }else if(skill==='targetedHeal')ally!.hp=Math.min(ally!.maxHp,ally!.hp+40);
    else if(skill==='holyLight')this.damageTarget(enemy!.id,32);
    else if(skill==='splitShot'){
      for(const angle of [-.3,0,.3]){const dir={x:p.facing.x*Math.cos(angle)-p.facing.z*Math.sin(angle),z:p.facing.x*Math.sin(angle)+p.facing.z*Math.cos(angle)};for(const t of this.targets())if(this.beamHits(p.pos,dir,t.pos,10,.65))this.damageTarget(t.id,22);this.emit({type:'abilityFx',skill,playerId:p.id,from:{...p.pos},to:this.clip(p.pos,{x:p.pos.x+dir.x*10,z:p.pos.z+dir.z*10})});}
      pos=this.clip(p.pos,{x:p.pos.x+p.facing.x*10,z:p.pos.z+p.facing.z*10});
    }else this.effects.push({id:this.uuid(),owner:p.id,skill,pos,targetId:ally?.id,next:now+(skill==='arrowRain'?400:1000),remaining:skill==='arrowRain'?3:6,expires:now+(skill==='fireMine'?12000:6500)});
    if(!['aimedShot','fireball','splitShot'].includes(skill))this.emit({type:'abilityFx',skill,playerId:p.id,from:{...p.pos},to:pos});return true;
  }
export function tickClassEffects(this:Game,now:number){
    this.totems=this.totems.filter(t=>t.hp>0&&now<t.expires&&!!this.players.get(t.owner)?.alive);
    for(const t of this.totems)while(now>=t.next&&t.next<t.expires){
      if(t.kind==='healingTotem'){
        for(const p of this.players.values())if(p.alive&&distance(t.pos,p.pos)<=4&&this.visible(t.pos,p.pos))p.hp=Math.min(p.maxHp,p.hp+8);
        this.emit({type:'abilityFx',skill:t.kind,playerId:t.owner,from:t.pos,to:t.pos});
      }else{
        const enemy=this.targets().filter(e=>distance(t.pos,e.pos)<=11&&this.visible(t.pos,e.pos)).sort((a,b)=>distance(t.pos,a.pos)-distance(t.pos,b.pos))[0];
        if(enemy){this.effects.push({id:this.uuid(),owner:t.owner,skill:'fireTotem',pos:{...enemy.pos},from:{...t.pos},targetId:enemy.id,next:now+350,remaining:1,expires:now+1000});this.emit({type:'abilityFx',skill:'fireTotem',playerId:t.owner,from:{...t.pos},to:{...enemy.pos}});}
      }
      t.next+=1000;
    }

    for(const p of this.players.values()){
      const c=p.cast;if(!c)continue;
      const move=this.moves.get(p.id);if(!p.alive||(move&&now-move.at<300&&Math.hypot(move.v.x,move.v.z)>0)){p.cast=undefined;continue;}
      if(c.skill==='lightningStorm')while(c.nextTick!<=Math.min(now,c.endsAt)){this.area(c.target,3,22);this.emit({type:'abilityFx',skill:c.skill,playerId:p.id,from:c.target,to:c.target});c.nextTick!+=500;}
      if(now<c.endsAt)continue;p.cast=undefined;
      if(c.skill==='lightningStorm')continue;
      const t=this.targets().find(t=>t.id===c.targetId);if(!t||distance(p.pos,t.pos)>11)continue;
      // Projectile travel is simulated on the server; impact position is fixed at release.
      this.effects.push({id:this.uuid(),owner:p.id,skill:c.skill,pos:this.clip(p.pos,t.pos),from:{...p.pos},targetId:this.visible(p.pos,t.pos)?t.id:undefined,next:now+350,remaining:1,expires:now+1000});
      this.emit({type:'abilityFx',skill:c.skill,playerId:p.id,from:{...p.pos},to:this.clip(p.pos,t.pos)});
    }
    this.effects=this.effects.filter(e=>{
      const owner=this.players.get(e.owner);if(!owner?.alive||now>e.expires)return false;
      if(e.skill==='lightningShield'){const ally=this.players.get(e.targetId!);if(!ally?.alive)return false;e.pos={...ally.pos};}
      if(e.skill==='fireMine'){
        if(this.targets().some(t=>distance(e.pos,t.pos)<=2&&this.visible(e.pos,t.pos))){this.area(e.pos,3,95);this.emit({type:'abilityFx',skill:e.skill,playerId:e.owner,from:e.pos,to:e.pos});return false;}return true;
      }
      while(e.remaining&&now>=e.next){
        if(e.skill==='poisonEnchant')this.damageTarget(e.targetId!,BACKSTAB.poisonTick);
        else if(e.skill==='aimedShot'){const t=this.targets().find(t=>t.id===e.targetId);if(t&&distance(e.pos,t.pos)<=1.6&&(!e.from||this.visible(e.from,t.pos)))this.damageTarget(t.id,58);}
        else if(e.skill==='fireball'&&!e.targetId){/* Projectile struck cover; no splash through it. */}
        else if(e.skill==='fireTotem'){const t=this.targets().find(t=>t.id===e.targetId);if(t&&distance(e.pos,t.pos)<=1.6&&(!e.from||this.visible(e.from,t.pos)))this.damageTarget(t.id,24);}
        else this.area(e.pos,e.skill==='fireball'?2:e.skill==='lightningShield'?3:3.5,e.skill==='fireball'?100:e.skill==='lightningShield'?14:28);
        if(e.skill!=='aimedShot'&&e.skill!=='fireTotem')this.emit({type:'abilityFx',skill:e.skill,playerId:e.owner,from:e.pos,to:e.pos});e.remaining--;e.next+=e.skill==='arrowRain'?600:1000;
      }return e.remaining>0;
    });
  }
