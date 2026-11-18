import { meleeHits,chargeEnd } from './game';
import {SPOREBOUND_BONUS,SPOREFANG_BONUS,CLASS_ITEM_BONUS} from './inventory';
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
        const relay=(this.talented(p,'guardianNetwork')?20:0)+(p.offhand==='fractureAegis'?20:0);
        if(relay){
          const third=[...this.players.values()].filter(a=>a.alive&&a.id!==p.id&&a.id!==ally.id&&distance(a.pos,ally.pos)<=4)
            .sort((a,b)=>distance(a.pos,ally.pos)-distance(b.pos,ally.pos))[0];
          if(third){third.shield=Math.max(third.shield,relay);third.shieldUntil=now+6000;}
        }
        if(this.talented(p,'shelteredHearts'))this.heal(ally,12,p.id);
      }else if(skill==='bulwark')p.bulwarkUntil=now+(p.offhand==='bulwarkCrest'?CLASS_ITEM_BONUS.defenderBulwarkMs:6000);
      else if(skill==='poisonEnchant')p.poisonUntil=now+6000;
      else if(skill==='vanish'){
        p.invisibleUntil=now+4000;p.loadout[slot-1]='backstab';
        if(this.talented(p,'shadowstep')&&p.dashCharges===0){
          p.dashCharges=1;if(p.head!=='pointyHat')p.dashRechargeAt=0;const dashSlot=p.loadout.indexOf('dash');if(dashSlot>=0)p.cooldowns[dashSlot]=0;
        }
      }
      else {
        for(const t of this.targets())if(this.visible(p.pos,t.pos)&&meleeHits(p.pos,p.facing,t.pos,2.8,.75)){
          // Boss faces its current target; rear attack requires opposite side of that facing.
          const victim=[...this.players.values()].filter(a=>a.alive&&a.invisibleUntil<=now).sort((a,b)=>distance(t.pos,a.pos)-distance(t.pos,b.pos))[0];
          const behind=!victim||((p.pos.x-t.pos.x)*(victim.pos.x-t.pos.x)+(p.pos.z-t.pos.z)*(victim.pos.z-t.pos.z))<0;
          const strike=skill==='stab'?32:skill==='backstab'&&behind?BACKSTAB.rear+(this.talented(p,'shadowAmbush')?20:0):BACKSTAB.normal;
          this.damageTarget(t.id,strike,p.id);
          if(skill==='backstab'&&p.weapon==='sporeglassBlade'){
            this.effects.push({id:this.uuid(),owner:p.id,skill:'backstab',pos:{...t.pos},next:now+1000,remaining:1,expires:now+1600,sporeBlast:true});
          }
          if(p.poisonUntil>now){
            this.effects.push({id:this.uuid(),owner:p.id,skill:'poisonEnchant',targetId:t.id,pos:{...t.pos},next:now+1000,remaining:(p.offhand==='venomFang'?CLASS_ITEM_BONUS.roguePoisonTicks:BACKSTAB.poisonTicks)*(p.head==='nightshadeHood'?CLASS_ITEM_BONUS.rogueHoodTickMultiplier:1),expires:now+9500});
            if(this.talented(p,'venomSpread')){
              const second=this.targets().filter(x=>x.id!==t.id&&distance(x.pos,t.pos)<=3&&this.visible(t.pos,x.pos))
                .sort((a,b)=>distance(a.pos,t.pos)-distance(b.pos,t.pos))[0];
              if(second)this.effects.push({id:this.uuid(),owner:p.id,skill:'poisonEnchant',targetId:second.id,pos:{...second.pos},next:now+1000,remaining:2,expires:now+3100});
            }
          }
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
    if((skill==='targetedHeal'&&p.head!=='shadowHat')||skill==='lightningShield'){
      ally=targetId===undefined?p:this.players.get(String(targetId));if(!ally?.alive||distance(p.pos,ally.pos)>11)return true;pos={...ally.pos};
    }
    if(['holyLight','aimedShot','fireball','earthShock'].includes(skill)||(skill==='targetedHeal'&&p.head==='shadowHat')){
      enemy=targetId===undefined?this.targets().sort((a,b)=>distance(pos,a.pos)-distance(pos,b.pos))[0]:this.targets().find(t=>t.id===targetId);
      if(!enemy||distance(p.pos,enemy.pos)>11||!this.visible(p.pos,enemy.pos))return true;pos={...enemy.pos};
    }
    if(['fireTotem','healingTotem','fireMine','arrowRain','lightningStorm'].includes(skill)&&(distance(p.pos,pos)>11||!this.visible(p.pos,pos)||this.pillars().some(c=>distance(c,pos)<1.5)))return true;
    p.cooldowns[slot-1]=now+SKILLS[skill].cooldown;
    if(skill==='fireTotem'||skill==='healingTotem'){
      this.totems=this.totems.filter(t=>!(t.owner===p.id&&t.kind===skill));
      this.totems.push({id:this.uuid(),owner:p.id,kind:skill,pos,hp:1,next:now+1000,expires:now+15000,poisoned:skill==='fireTotem'&&p.offhand==='sporeboundTotem'});
    }else if(skill==='earthShock'){
      this.damageTarget(enemy!.id,36,p.id);
      const second=this.targets().filter(t=>t.id!==enemy!.id&&distance(t.pos,enemy!.pos)<=5&&this.visible(enemy!.pos,t.pos))
        .sort((a,b)=>distance(a.pos,enemy!.pos)-distance(b.pos,enemy!.pos))[0];
      if(second&&this.talented(p,'stormConduit')){
        this.damageTarget(second.id,18,p.id);
        this.emit({type:'abilityFx',skill,playerId:p.id,from:{...enemy!.pos},to:{...second.pos}});
      }
      if(this.talented(p,'livingCurrent')){
        const ally=[...this.players.values()].filter(a=>a.alive&&distance(a.pos,enemy!.pos)<=5&&a.hp<a.maxHp)
          .sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
        if(ally)this.heal(ally,12,p.id);
      }
      if(p.offhand==='twinTotemCapacitor'&&this.totems.some(t=>t.owner===p.id&&t.kind==='fireTotem'&&t.hp>0&&t.expires>now)){
        this.damageTarget(enemy!.id,20,p.id);
        const totem=this.totems.find(t=>t.owner===p.id&&t.kind==='fireTotem'&&t.hp>0&&t.expires>now)!;
        this.emit({type:'abilityFx',skill:'fireTotem',playerId:p.id,from:{...totem.pos},to:{...enemy!.pos}});
      }
    }
    else if(skill==='aimedShot'||skill==='fireball'||skill==='lightningStorm'){
      p.cast={skill,slot,endsAt:now+(skill==='aimedShot'?(p.offhand==='sporefangQuiver'?SPOREFANG_BONUS.aimedShotCastMs:1000):skill==='fireball'?(p.weapon==='emberWand'?1000:2000):3000),target:pos,targetId:enemy?.id,nextTick:skill==='lightningStorm'?now+500:undefined};
    }else if(skill==='targetedHeal'){
      if(p.head==='shadowHat')this.damageTarget(enemy!.id,40,p.id);
      else{
        this.heal(ally!,p.offhand==='sunlitReliquary'?CLASS_ITEM_BONUS.priestHeal:40,p.id);
        if(this.talented(p,'healingCascade'))for(const a of this.players.values())
          if(a.alive&&a.id!==ally!.id&&distance(a.pos,ally!.pos)<=4)this.heal(a,12,p.id);
        if(this.talented(p,'sacredEcho')&&ally!==p)this.heal(p,8,p.id);
      }
    }
    else if(skill==='holyLight'){
      this.damageTarget(enemy!.id,32,p.id);
      if(this.talented(p,'avengingLight')){
        const ally=[...this.players.values()].filter(a=>a.alive&&a.hp<a.maxHp&&distance(a.pos,enemy!.pos)<=5)
          .sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
        if(ally)this.heal(ally,12,p.id);
      }
    }
    else if(skill==='splitShot'){
      const arrows=(p.offhand==='splitthornQuiver'?[-.5,-.25,0,.25,.5]:[-.3,0,.3]).map(a=>({angle:a,power:p.offhand==='splitthornQuiver'?SPOREFANG_BONUS.splitShotDamage:22}));
      if(this.talented(p,'splitVolley'))arrows.push({angle:-.7,power:16},{angle:.7,power:16});
      for(const {angle,power} of arrows){const dir={x:p.facing.x*Math.cos(angle)-p.facing.z*Math.sin(angle),z:p.facing.x*Math.sin(angle)+p.facing.z*Math.cos(angle)};for(const t of this.targets())if(this.beamHits(p.pos,dir,t.pos,10,.65))this.damageTarget(t.id,power,p.id);this.emit({type:'abilityFx',skill,playerId:p.id,from:{...p.pos},to:this.clip(p.pos,{x:p.pos.x+dir.x*10,z:p.pos.z+dir.z*10})});}
      pos=this.clip(p.pos,{x:p.pos.x+p.facing.x*10,z:p.pos.z+p.facing.z*10});
    }else{
      this.effects.push({id:this.uuid(),owner:p.id,skill,pos,targetId:ally?.id,next:now+(skill==='arrowRain'?400:1000),remaining:skill==='arrowRain'&&this.talented(p,'rainSurge')?4:skill==='arrowRain'?3:6,expires:now+(skill==='fireMine'?12000:6500)});
      if(skill==='arrowRain'&&p.offhand==='rottingFletching')
        this.effects.push({id:this.uuid(),owner:p.id,skill,pos:{...pos},next:now+2600,remaining:3,expires:now+5700,poisonCloud:true,radius:2.5,damage:6});
    }
    if(!['aimedShot','fireball','splitShot'].includes(skill))this.emit({type:'abilityFx',skill,playerId:p.id,from:{...p.pos},to:pos});return true;
  }
export function tickClassEffects(this:Game,now:number){
    // Both combat and hub practice resolve the same earned-talent burst rules.
    for(const t of this.totems)this.burstTotem(t,now);
    this.totems=this.totems.filter(t=>t.hp>0&&now<t.expires&&!!this.players.get(t.owner)?.alive);
    for(const t of this.totems)while(now>=t.next&&t.next<t.expires){
      if(t.kind==='healingTotem'){
        for(const p of this.players.values())if(p.alive&&distance(t.pos,p.pos)<=(this.players.get(t.owner)?.offhand==='verdantMenderTotem'?SPOREBOUND_BONUS.healRange:4)&&this.visible(t.pos,p.pos))this.heal(p,this.players.get(t.owner)?.offhand==='verdantMenderTotem'?SPOREBOUND_BONUS.healPerTick:8,t.owner);
        this.emit({type:'abilityFx',skill:t.kind,playerId:t.owner,from:t.pos,to:t.pos});
      }else{
        const enemy=this.targets().filter(e=>distance(t.pos,e.pos)<=(t.poisoned?SPOREBOUND_BONUS.range:11)&&this.visible(t.pos,e.pos)).sort((a,b)=>distance(t.pos,a.pos)-distance(t.pos,b.pos))[0];
        if(enemy){
          if(t.poisoned)this.effects.push({id:this.uuid(),owner:t.owner,skill:'fireTotem',pos:{...enemy.pos},from:{...t.pos},next:now+350,remaining:SPOREBOUND_BONUS.poisonCloudTicks,expires:now+3500,poisonCloud:true,radius:SPOREBOUND_BONUS.poisonCloudRadius,damage:SPOREBOUND_BONUS.poisonCloudDamage});
          else this.effects.push({id:this.uuid(),owner:t.owner,skill:'fireTotem',pos:{...enemy.pos},from:{...t.pos},targetId:enemy.id,next:now+350,remaining:1,expires:now+1000});
          this.emit({type:'abilityFx',skill:'fireTotem',playerId:t.owner,from:{...t.pos},to:{...enemy.pos}});
        }
      }
      t.next+=1000;
    }

    for(const p of this.players.values()){
      const c=p.cast;if(!c)continue;
      const move=this.moves.get(p.id);if(!p.alive||(move&&now-move.at<300&&Math.hypot(move.v.x,move.v.z)>0)){p.cast=undefined;continue;}
      if(c.skill==='lightningStorm')while(c.nextTick!<=Math.min(now,c.endsAt)){
        this.area(c.target,this.talented(p,'stormWell')?4:3,22,p.id);
        this.emit({type:'abilityFx',skill:c.skill,playerId:p.id,from:c.target,to:c.target});
        c.nextTick!+=500;
      }
      if(now<c.endsAt)continue;p.cast=undefined;
      if(c.skill==='lightningStorm'){
        if(this.talented(p,'stormAftershock')){this.area(c.target,this.talented(p,'stormWell')?4:3,30,p.id);this.emit({type:'abilityFx',skill:c.skill,playerId:p.id,from:c.target,to:c.target});}
        continue;
      }
      const t=this.targets().find(t=>t.id===c.targetId);if(!t||distance(p.pos,t.pos)>11)continue;
      // Projectile travel is simulated on the server; impact position is fixed at release.
      const impact=this.clip(p.pos,t.pos);
      const shots=c.skill==='fireball'&&p.armour==='cinderweaveArmour'?[-.9,0,.9]:[0];
      for(const offset of shots){
        const hit={x:Math.max(-12,Math.min(12,impact.x+offset)),z:impact.z};
        this.effects.push({id:this.uuid(),owner:p.id,skill:c.skill,pos:hit,from:{...p.pos},targetId:this.visible(p.pos,t.pos)?t.id:undefined,next:now+350,remaining:1,expires:now+1000});
        this.emit({type:'abilityFx',skill:c.skill,playerId:p.id,from:{...p.pos},to:hit});
      }
    }
    const spawnedEffects:typeof this.effects=[];
    this.effects=this.effects.filter(e=>{
      const owner=this.players.get(e.owner);if(!owner?.alive||now>e.expires)return false;
      if(e.skill==='lightningShield'){const ally=this.players.get(e.targetId!);if(!ally?.alive)return false;e.pos={...ally.pos};}
      if(e.skill==='fireMine'){
        if(this.targets().some(t=>distance(e.pos,t.pos)<=(this.talented(owner,'volatileMines')?2.7:2)&&this.visible(e.pos,t.pos))){
          this.area(e.pos,this.talented(owner,'volatileMines')?4:3,95,e.owner);
          this.emit({type:'abilityFx',skill:e.skill,playerId:e.owner,from:e.pos,to:e.pos});
          if(this.talented(owner,'emberAfterglow'))
            spawnedEffects.push({id:this.uuid(),owner:e.owner,skill:'fireMine',pos:{...e.pos},next:now+1000,remaining:3,expires:now+3400,poisonCloud:true,radius:3,damage:8});
          return false;
        }return true;
      }
      while(e.remaining&&now>=e.next){
        if(e.healingField){for(const ally of this.players.values())if(ally.alive&&distance(ally.pos,e.pos)<=4)this.heal(ally,5,e.owner);}
        else if(e.sporeBlast)this.area(e.pos,2,24,e.owner);
        else if(e.poisonCloud)this.area(e.pos,e.radius??1.5,e.damage??8,e.owner);
        else if(e.skill==='poisonEnchant'){
          this.damageTarget(e.targetId!,owner.offhand==='venomFang'?CLASS_ITEM_BONUS.roguePoisonTick:BACKSTAB.poisonTick,e.owner);
          if(this.talented(owner,'leechingVenom'))this.heal(owner,2,e.owner);
        }
        else if(e.skill==='aimedShot'){
          const t=this.targets().find(t=>t.id===e.targetId);
          if(t&&distance(e.pos,t.pos)<=1.6&&(!e.from||this.visible(e.from,t.pos))){
            this.damageTarget(t.id,owner.offhand==='sporefangQuiver'?SPOREFANG_BONUS.aimedShotDamage:58,e.owner);
            if(this.talented(owner,'ricochetArrows')){
              const second=this.targets().filter(x=>x.id!==t.id&&distance(x.pos,t.pos)<=4&&this.visible(t.pos,x.pos))
                .sort((a,b)=>distance(a.pos,t.pos)-distance(b.pos,t.pos))[0];
              if(second){this.damageTarget(second.id,20,e.owner);this.emit({type:'abilityFx',skill:e.skill,playerId:e.owner,from:t.pos,to:second.pos});}
            }
          }
        }
        else if(e.skill==='fireball'&&!e.targetId){/* Projectile struck cover; no splash through it. */}
        else if(e.skill==='fireTotem'){const t=this.targets().find(t=>t.id===e.targetId);if(t&&distance(e.pos,t.pos)<=1.6&&(!e.from||this.visible(e.from,t.pos)))this.damageTarget(t.id,24,e.owner);}
        else this.area(e.pos,e.skill==='fireball'?2:e.skill==='arrowRain'?(owner.offhand==='sporestormQuiver'?SPOREFANG_BONUS.arrowRainRadius:3.5)+(e.remaining===1&&this.talented(owner,'lastDownpour')?1:0):e.skill==='lightningShield'?3:3.5,e.skill==='fireball'?(owner.weapon==='emberWand'?50:100):e.skill==='lightningShield'?14:e.skill==='arrowRain'?(e.remaining===1&&this.talented(owner,'rainSurge')?22:owner.offhand==='sporestormQuiver'?SPOREFANG_BONUS.arrowRainDamage:28):28,e.owner);
        if(e.skill!=='aimedShot'&&e.skill!=='fireTotem')this.emit({type:'abilityFx',skill:e.skill,playerId:e.owner,from:e.pos,to:e.pos});e.remaining--;e.next+=e.skill==='arrowRain'?600:1000;
      }return e.remaining>0;
    });
    this.effects.push(...spawnedEffects);
  }
