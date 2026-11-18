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
        if(ally!==p){const d=distance(p.pos,ally.pos);p.pos=chargeEnd(p.pos,{x:(ally.pos.x-p.pos.x)/d||0,z:(ally.pos.z-p.pos.z)/d||0},this.solidBoss(),this.adds,d,this.pillars(),this.arenaLimit());ally.shield=Math.max(ally.shield,40+(p.armour==='carapaceShield'?10:0));ally.shieldUntil=now+6000;
        if(this.talented(p,'aegisCommand'))ally.guardUntil=Math.max(ally.guardUntil,now+1200);
        }
        p.shield=Math.max(p.shield,80+(p.armour==='carapaceShield'?20:0));p.shieldUntil=now+6000;to={...p.pos};
        this.taunt(p.id,now,this.talented(p,'shieldSignal')?3500:2500);
        if(this.talented(p,'unbrokenLine')&&ally!==p){
          const index=p.loadout.indexOf('bulwark');
          if(index>=0)p.cooldowns[index]=Math.max(now,p.cooldowns[index]-1500);
        }
        const relay=(this.talented(p,'guardianNetwork')?20:0)+(p.offhand==='fractureAegis'?20:0);
        if(relay){
          const third=[...this.players.values()].filter(a=>a.alive&&a.id!==p.id&&a.id!==ally.id&&distance(a.pos,ally.pos)<=4)
            .sort((a,b)=>distance(a.pos,ally.pos)-distance(b.pos,ally.pos))[0];
          if(third){third.shield=Math.max(third.shield,relay);third.shieldUntil=now+6000;}
        }
        if(this.talented(p,'shelteredHearts'))this.heal(ally,12,p.id);
        if(this.talented(p,'shieldReprieve')&&ally!==p)this.heal(p,10,p.id);
      }else if(skill==='bulwark'){
        p.bulwarkUntil=now+(p.offhand==='bulwarkCrest'?CLASS_ITEM_BONUS.defenderBulwarkMs:6000);
        this.taunt(p.id,now,2600);
      }
      else if(skill==='poisonEnchant')p.poisonUntil=now+6000;
      else if(skill==='vanish'){
        p.invisibleUntil=now+4000;p.loadout[slot-1]='backstab';
        if(this.talented(p,'fadingStep'))this.threat.set(p.id,(this.threat.get(p.id)??0)*.5);
        if(this.talented(p,'shadowGuard')){p.shield=Math.max(p.shield,8);p.shieldUntil=now+4000;}
        if(this.talented(p,'shadowstep')&&p.dashCharges===0){
          p.dashCharges=1;if(p.head!=='pointyHat')p.dashRechargeAt=0;const dashSlot=p.loadout.indexOf('dash');if(dashSlot>=0)p.cooldowns[dashSlot]=0;
        }
      }
      else {
        for(const t of this.targets())if(this.visible(p.pos,t.pos)&&meleeHits(p.pos,p.facing,t.pos,2.8,.75)){
          // Boss faces its current target; rear attack requires opposite side of that facing.
          const victim=[...this.players.values()].filter(a=>a.alive&&a.invisibleUntil<=now).sort((a,b)=>distance(t.pos,a.pos)-distance(t.pos,b.pos))[0];
          const behind=!victim||((p.pos.x-t.pos.x)*(victim.pos.x-t.pos.x)+(p.pos.z-t.pos.z)*(victim.pos.z-t.pos.z))<0;
          const ambush=skill==='quickStab'&&p.invisibleUntil>now&&this.talented(p,'openingStrike');
          const strike=skill==='stab'?32:skill==='quickStab'?24+(ambush?16:0):skill==='backstab'&&behind?BACKSTAB.rear+(this.talented(p,'shadowAmbush')?20:0):BACKSTAB.normal;
          this.damageTarget(t.id,strike,p.id);
          if(skill==='stab'&&this.talented(p,'menacingStab'))this.addThreat(p.id,80);
          if(ambush){
            p.invisibleUntil=0;const vanish=p.loadout.indexOf('backstab');if(vanish>=0)p.loadout[vanish]='vanish';
            if(this.talented(p,'smokeReturn')){
              const dash=p.loadout.indexOf('dash');if(dash>=0)p.cooldowns[dash]=Math.max(now,p.cooldowns[dash]-1200);
              if(p.dashRechargeAt)p.dashRechargeAt=Math.max(now,p.dashRechargeAt-1200);
            }
          }
          if(skill==='backstab'&&behind&&this.talented(p,'cloakOfThorns')){
            p.shield=Math.max(p.shield,15);p.shieldUntil=now+2500;
          }
          if(skill==='backstab'&&behind&&this.talented(p,'rippleStab')){
            const other=this.targets().filter(x=>x.id!==t.id&&distance(x.pos,t.pos)<=3&&this.visible(t.pos,x.pos))
              .sort((a,b)=>distance(a.pos,t.pos)-distance(b.pos,t.pos))[0];
            if(other){this.damageTarget(other.id,18,p.id);this.emit({type:'abilityFx',skill:'backstab',playerId:p.id,from:t.pos,to:other.pos});}
          }
          if(skill==='backstab'&&p.weapon==='mandibleDagger'){
            this.effects.push({id:this.uuid(),owner:p.id,skill:'backstab',targetId:t.id,pos:{...t.pos},
              next:now+1000,remaining:2,expires:now+2700,mandibleBleed:true});
          }
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
    if(point!==undefined){const v=point as Vec2;if(!v||typeof v.x!=='number'||typeof v.z!=='number'||!Number.isFinite(v.x)||!Number.isFinite(v.z)||(Math.abs(v.x)>this.arenaLimit()||Math.abs(v.z)>this.arenaLimit()||(this.arenaLimit()>12&&Math.hypot(v.x,v.z)>this.arenaLimit()))||distance(p.pos,v)>11||!this.visible(p.pos,v)||this.pillars().some(c=>distance(c,v)<1.5))return true;pos={x:v.x,z:v.z};}
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
      if(second&&this.talented(p,'stormRebound')){
        const third=this.targets().filter(t=>t.id!==enemy!.id&&t.id!==second.id&&distance(t.pos,second.pos)<=5&&this.visible(second.pos,t.pos))
          .sort((a,b)=>distance(a.pos,second.pos)-distance(b.pos,second.pos))[0];
        if(third){
          this.damageTarget(third.id,10,p.id);this.emit({type:'abilityFx',skill,playerId:p.id,from:second.pos,to:third.pos});
          if(this.talented(p,'stormMender')){
            const ally=[...this.players.values()].filter(a=>a.alive&&a.hp<a.maxHp&&distance(a.pos,third.pos)<=5)
              .sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
            if(ally)this.heal(ally,10,p.id);
          }
        }
      }
      if(this.talented(p,'spiritEcho')){
        const healer=this.totems.find(t=>t.hp>0&&t.kind==='healingTotem'&&t.owner===p.id&&t.expires>now);
        if(healer){
          const ally=[...this.players.values()].filter(a=>a.alive&&a.hp<a.maxHp&&distance(a.pos,healer.pos)<=4)
            .sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
          if(ally)this.heal(ally,10,p.id);
        }
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
      p.cast={skill,slot,endsAt:now+(skill==='aimedShot'?(p.weapon==='sporefangQuiver'?SPOREFANG_BONUS.aimedShotCastMs:1000):skill==='fireball'?(p.weapon==='emberWand'?1000:2000):3000),target:pos,targetId:enemy?.id,nextTick:skill==='lightningStorm'?now+500:undefined};
    }else if(skill==='targetedHeal'){
      if(p.head==='shadowHat')this.damageTarget(enemy!.id,40,p.id);
      else{
        this.heal(ally!,p.offhand==='sunlitReliquary'?CLASS_ITEM_BONUS.priestHeal:40,p.id);
        if(this.talented(p,'blessingOfSpeed'))ally!.cooldowns=ally!.cooldowns.map(end=>Math.max(now,end-250));
        if(this.talented(p,'healingCascade'))for(const a of this.players.values())
          if(a.alive&&a.id!==ally!.id&&distance(a.pos,ally!.pos)<=4)this.heal(a,12,p.id);
        if(this.talented(p,'sacredEcho')&&ally!==p)this.heal(p,8,p.id);
        if(this.talented(p,'aegisMend')){ally!.shield=Math.max(ally!.shield,15);ally!.shieldUntil=now+5000;}
        if(this.talented(p,'secondBenediction')){
          const other=[...this.players.values()].filter(a=>a.alive&&a.id!==ally!.id&&a.hp<a.maxHp&&distance(a.pos,ally!.pos)<=4)
            .sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
          if(other){other.shield=Math.max(other.shield,10);other.shieldUntil=now+4000;}
        }
      }
    }
    else if(skill==='holyLight'){
      this.damageTarget(enemy!.id,32,p.id);
      if(this.talented(p,'prayerEcho'))this.heal(p,6,p.id);
      if(this.talented(p,'dawnFlare'))this.area(enemy!.pos,2,15,p.id);
      if(this.talented(p,'radiantAegis')){
        const other=[...this.players.values()].filter(a=>a.alive&&distance(a.pos,enemy!.pos)<=5)
          .sort((a,b)=>distance(a.pos,enemy!.pos)-distance(b.pos,enemy!.pos))[0];
        if(other){other.shield=Math.max(other.shield,12);other.shieldUntil=now+3000;}
      }
      if(p.offhand==='pheromoneChalice'){
        const friend=[...this.players.values()].filter(a=>a.alive&&a.hp<a.maxHp&&distance(a.pos,enemy!.pos)<=5)
          .sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
        if(friend)this.heal(friend,10,p.id);
      }
      if(this.talented(p,'avengingLight')){
        const ally=[...this.players.values()].filter(a=>a.alive&&a.hp<a.maxHp&&distance(a.pos,enemy!.pos)<=5)
          .sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
        if(ally)this.heal(ally,12,p.id);
      }
    }
    else if(skill==='splitShot'){
      const arrows=(p.head==='splitthornQuiver'?[-.5,-.25,0,.25,.5]:[-.3,0,.3]).map(a=>({angle:a,power:p.head==='splitthornQuiver'?SPOREFANG_BONUS.splitShotDamage:22}));
      if(this.talented(p,'splitVolley'))arrows.push({angle:-.7,power:16},{angle:.7,power:16});
      if(this.talented(p,'skirmishRhythm')&&(p.skirmishUntil??0)>now){
        arrows.push({angle:0,power:12});p.skirmishUntil=0;
      }
      const volleyTargets=new Set<string>();
      const broodHit=new Set<string>();
      for(const {angle,power} of arrows){
        const dir={x:p.facing.x*Math.cos(angle)-p.facing.z*Math.sin(angle),z:p.facing.x*Math.sin(angle)+p.facing.z*Math.cos(angle)};
        for(const t of this.targets()){
          const add=t.id==='boss'?undefined:this.adds.find(a=>a.id===t.id);
          const hitRadius=t.id==='boss'||add?.kind==='duoBoss'?1.3:add?.radius??.75;
          const forward=(t.pos.x-p.pos.x)*dir.x+(t.pos.z-p.pos.z)*dir.z;
          if(forward>0&&this.beamHits(p.pos,dir,t.pos,10,hitRadius)){
            this.damageTarget(t.id,power,p.id);volleyTargets.add(t.id);
            if(p.offhand==='broodQuiver'&&!broodHit.has(t.id)){
              broodHit.add(t.id);
              this.effects.push({id:this.uuid(),owner:p.id,skill:'splitShot',targetId:t.id,pos:{...t.pos},
                next:now+1000,remaining:2,expires:now+2700,broodVenom:true});
            }
          }
        }
        this.emit({type:'abilityFx',skill,playerId:p.id,from:{...p.pos},to:this.clip(p.pos,{x:p.pos.x+dir.x*10,z:p.pos.z+dir.z*10})});
      }
      if(volleyTargets.size&&this.talented(p,'evasiveVolley')){
        p.shield=Math.max(p.shield,8);p.shieldUntil=now+2000;
      }
      if(volleyTargets.size>=2&&this.talented(p,'quickRecovery'))p.cooldowns[slot-1]=Math.max(now,p.cooldowns[slot-1]-500);
      pos=this.clip(p.pos,{x:p.pos.x+p.facing.x*10,z:p.pos.z+p.facing.z*10});
    }else{
      if(skill==='lightningShield'&&ally&&this.talented(p,'chargedAegis')){
        ally.shield=Math.max(ally.shield,10);ally.shieldUntil=now+4000;
      }
      this.effects.push({id:this.uuid(),owner:p.id,skill,pos,targetId:ally?.id,next:now+(skill==='arrowRain'?400:1000),remaining:skill==='arrowRain'&&this.talented(p,'rainSurge')?4:skill==='arrowRain'?3:6,expires:now+(skill==='fireMine'?12000:6500)});
      if(skill==='arrowRain'&&p.boots==='rottingFletching')
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
        const owner=this.players.get(t.owner);
        const both=this.totems.some(other=>other.hp>0&&other.owner===t.owner&&other.kind==='fireTotem');
        const radius=owner?.offhand==='verdantMenderTotem'?SPOREBOUND_BONUS.healRange:4;
        for(const ally of this.players.values())if(ally.alive&&distance(t.pos,ally.pos)<=radius&&this.visible(t.pos,ally.pos))
          this.heal(ally,(owner?.offhand==='verdantMenderTotem'?SPOREBOUND_BONUS.healPerTick:8)+
            (owner&&this.talented(owner,'restorativeRhythm')?3:0)+
            (owner&&both&&this.talented(owner,'sacredGrove')?4:0),t.owner);
        if(owner&&this.talented(owner,'stoneSkinWard')){
          const wounded=[...this.players.values()].filter(a=>a.alive&&distance(a.pos,t.pos)<=radius)
            .sort((a,b)=>(a.hp/a.maxHp)-(b.hp/b.maxHp))[0];
          if(wounded){wounded.shield=Math.max(wounded.shield,6);wounded.shieldUntil=now+2000;}
        }
        this.emit({type:'abilityFx',skill:t.kind,playerId:t.owner,from:t.pos,to:t.pos});
      }else{
        const enemy=this.targets().filter(e=>distance(t.pos,e.pos)<=(t.poisoned?SPOREBOUND_BONUS.range:11)&&this.visible(t.pos,e.pos)).sort((a,b)=>distance(t.pos,a.pos)-distance(t.pos,b.pos))[0];
        if(enemy){
          if(t.poisoned)this.effects.push({id:this.uuid(),owner:t.owner,skill:'fireTotem',pos:{...enemy.pos},from:{...t.pos},next:now+350,remaining:SPOREBOUND_BONUS.poisonCloudTicks,expires:now+3500,poisonCloud:true,radius:SPOREBOUND_BONUS.poisonCloudRadius,damage:SPOREBOUND_BONUS.poisonCloudDamage});
          else this.effects.push({id:this.uuid(),owner:t.owner,skill:'fireTotem',pos:{...enemy.pos},from:{...t.pos},targetId:enemy.id,next:now+350,remaining:1,expires:now+1000});
          this.emit({type:'abilityFx',skill:'fireTotem',playerId:t.owner,from:{...t.pos},to:{...enemy.pos}});
          const owner=this.players.get(t.owner);
          if(owner&&this.talented(owner,'sacredGrove')&&this.totems.some(other=>other.hp>0&&other.owner===t.owner&&other.kind==='healingTotem'))
            this.damageTarget(enemy.id,8,t.owner);
          if(this.players.get(t.owner)?.weapon==='broodTotem'){
            const second=this.targets().filter(e=>e.id!==enemy.id&&distance(e.pos,enemy.pos)<=5&&this.visible(t.pos,e.pos))
              .sort((a,b)=>distance(a.pos,enemy.pos)-distance(b.pos,enemy.pos))[0];
            if(second){this.damageTarget(second.id,10,t.owner);this.emit({type:'abilityFx',skill:'fireTotem',playerId:t.owner,from:{...t.pos},to:{...second.pos}});}
          }
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
        if(this.talented(p,'stormShelter'))for(const ally of this.players.values())if(ally.alive&&distance(ally.pos,c.target)<=(this.talented(p,'stormWell')?4:3)){
          ally.shield=Math.max(ally.shield,15);ally.shieldUntil=now+4000;
        }
        if(this.talented(p,'stormRecovery'))for(const ally of this.players.values())
          if(ally.alive&&distance(ally.pos,c.target)<=(this.talented(p,'stormWell')?4:3))this.heal(ally,8,p.id);
        continue;
      }
      const t=this.targets().find(t=>t.id===c.targetId);if(!t||distance(p.pos,t.pos)>11)continue;
      // Projectile travel is simulated on the server; impact position is fixed at release.
      const impact=this.clip(p.pos,t.pos);
      const shots=c.skill==='fireball'&&p.armour==='cinderweaveArmour'?[-.9,0,.9]:[0];
      for(const offset of shots){
        const hit={x:Math.max(-this.arenaLimit(),Math.min(this.arenaLimit(),impact.x+offset)),z:impact.z};
        this.effects.push({id:this.uuid(),owner:p.id,skill:c.skill,pos:hit,from:{...p.pos},targetId:this.visible(p.pos,t.pos)?t.id:undefined,next:now+350,remaining:1,expires:now+1000});
        this.emit({type:'abilityFx',skill:c.skill,playerId:p.id,from:{...p.pos},to:hit});
      }
    }
    const spawnedEffects:typeof this.effects=[];
    this.effects=this.effects.filter(e=>{
      const owner=this.players.get(e.owner);if(!owner?.alive||now>e.expires)return false;
      if(e.skill==='lightningShield'){const ally=this.players.get(e.targetId!);if(!ally?.alive)return false;e.pos={...ally.pos};}
      if(e.skill==='fireMine'&&!e.afterglow){
        if(this.targets().some(t=>distance(e.pos,t.pos)<=(this.talented(owner,'volatileMines')?2.7:2)&&this.visible(e.pos,t.pos))){
          this.area(e.pos,this.talented(owner,'volatileMines')?4:3,95,e.owner);
          this.emit({type:'abilityFx',skill:e.skill,playerId:e.owner,from:e.pos,to:e.pos});
          if(this.talented(owner,'emberAfterglow'))
            spawnedEffects.push({id:this.uuid(),owner:e.owner,skill:'fireMine',pos:{...e.pos},next:now+1000,remaining:3,expires:now+3400,afterglow:true,talentAfterglow:true,radius:this.talented(owner,'blazingHorizon')?4:3,damage:8});
          if(owner.offhand==='moltenChitin')
            spawnedEffects.push({id:this.uuid(),owner:e.owner,skill:'fireMine',pos:{...e.pos},next:now+1000,remaining:2,expires:now+2600,afterglow:true,radius:3,damage:6});
          return false;
        }return true;
      }
      while(e.remaining&&now>=e.next){
        if(e.healingField){for(const ally of this.players.values())if(ally.alive&&distance(ally.pos,e.pos)<=4)this.heal(ally,e.damage??5,e.owner);}
        else if(e.sporeBlast)this.area(e.pos,2,24,e.owner);
        else if(e.mandibleBleed)this.damageTarget(e.targetId!,8,e.owner);
        else if(e.broodVenom)this.damageTarget(e.targetId!,5,e.owner);
        else if(e.afterglow){
          const hits=this.targets().some(t=>t.hp>0&&distance(t.pos,e.pos)<=(e.radius??3)&&this.visible(e.pos,t.pos));
          this.area(e.pos,e.radius??3,e.damage??8,e.owner);
          if(hits&&e.talentAfterglow&&this.talented(owner,'embersOfLife'))this.heal(owner,4,e.owner);
        }
        else if(e.poisonCloud)this.area(e.pos,e.radius??1.5,e.damage??8,e.owner);
        else if(e.skill==='poisonEnchant'){
          this.damageTarget(e.targetId!,(owner.offhand==='venomFang'?CLASS_ITEM_BONUS.roguePoisonTick:BACKSTAB.poisonTick)+(this.talented(owner,'venomCatalyst')?4:0),e.owner);
          if(this.talented(owner,'leechingVenom'))this.heal(owner,2,e.owner);
          if(this.talented(owner,'toxicEcho')){
            const victim=this.targets().find(t=>t.id===e.targetId);
            if(victim){
              const other=this.targets().filter(t=>t.id!==victim.id&&distance(t.pos,victim.pos)<=3&&this.visible(victim.pos,t.pos))
                .sort((a,b)=>distance(a.pos,victim.pos)-distance(b.pos,victim.pos))[0];
              if(other)this.damageTarget(other.id,3,e.owner);
            }
          }
        }
        else if(e.skill==='aimedShot'){
          const t=this.targets().find(t=>t.id===e.targetId);
          if(t&&distance(e.pos,t.pos)<=1.6&&(!e.from||this.visible(e.from,t.pos))){
            this.damageTarget(t.id,owner.weapon==='sporefangQuiver'?SPOREFANG_BONUS.aimedShotDamage:58,e.owner);
            if(this.talented(owner,'ricochetArrows')){
              const second=this.targets().filter(x=>x.id!==t.id&&distance(x.pos,t.pos)<=4&&this.visible(t.pos,x.pos))
                .sort((a,b)=>distance(a.pos,t.pos)-distance(b.pos,t.pos))[0];
              if(second){
                this.damageTarget(second.id,20,e.owner);this.emit({type:'abilityFx',skill:e.skill,playerId:e.owner,from:t.pos,to:second.pos});
                if(this.talented(owner,'thirdRicochet')){
                  const third=this.targets().filter(x=>x.id!==t.id&&x.id!==second.id&&distance(x.pos,second.pos)<=4&&this.visible(second.pos,x.pos))
                    .sort((a,b)=>distance(a.pos,second.pos)-distance(b.pos,second.pos))[0];
                  if(third){
                    this.damageTarget(third.id,12,e.owner);this.emit({type:'abilityFx',skill:e.skill,playerId:e.owner,from:second.pos,to:third.pos});
                    if(this.talented(owner,'returnShot')&&t.hp>0){
                      this.damageTarget(t.id,8,e.owner);
                      this.emit({type:'abilityFx',skill:e.skill,playerId:e.owner,from:third.pos,to:t.pos});
                    }
                  }
                }
              }
            }
          }
        }
        else if(e.skill==='fireball'&&!e.targetId){/* Projectile struck cover; no splash through it. */}
        else if(e.skill==='fireTotem'){const t=this.targets().find(t=>t.id===e.targetId);if(t&&distance(e.pos,t.pos)<=1.6&&(!e.from||this.visible(e.from,t.pos)))this.damageTarget(t.id,24,e.owner);}
        else this.area(e.pos,e.skill==='fireball'?(this.talented(owner,'wildfire')?2.5:2):e.skill==='arrowRain'?(owner.armour==='sporestormQuiver'?SPOREFANG_BONUS.arrowRainRadius:3.5)+(e.remaining===1&&this.talented(owner,'lastDownpour')?1:0):e.skill==='lightningShield'?(this.talented(owner,'thunderhead')?4:3):3.5,e.skill==='fireball'?(owner.armour==='cinderweaveArmour'?(owner.weapon==='emberWand'?24:48):(owner.weapon==='emberWand'?70:140)):e.skill==='lightningShield'?(this.talented(owner,'overchargedPulse')?18:14):e.skill==='arrowRain'?(e.remaining===1&&this.talented(owner,'rainSurge')?22:owner.armour==='sporestormQuiver'?SPOREFANG_BONUS.arrowRainDamage:28):28,e.owner);
        if(e.skill==='lightningShield'&&this.talented(owner,'conduitMender')){
          const ally=this.players.get(e.targetId!);if(ally?.alive)this.heal(ally,3,e.owner);
        }
        if(e.skill==='fireball'&&e.targetId){
          const hits=this.targets().filter(t=>distance(t.pos,e.pos)<=(this.talented(owner,'wildfire')?2.5:2)&&this.visible(e.pos,t.pos));
          if(hits.length){
            if(this.talented(owner,'ashShield')){owner.shield=Math.max(owner.shield,10);owner.shieldUntil=now+3000;}
            if(this.talented(owner,'rollingEmbers'))for(const t of hits){
              const key=e.owner+':'+t.id+':fireball';
              this.burns.set(key,{target:t.id,next:now+1000,remaining:2});
            }
            if(this.talented(owner,'flashIgnition')){
              const mine=this.effects.find(m=>m!==e&&m.owner===e.owner&&m.skill==='fireMine'&&!m.afterglow&&m.remaining>0&&distance(m.pos,e.pos)<=3.8);
              if(mine){
                this.area(mine.pos,3,95,e.owner);mine.remaining=0;
                this.emit({type:'abilityFx',skill:'fireMine',playerId:e.owner,from:mine.pos,to:mine.pos});
              }
            }
            if(this.talented(owner,'wildfire'))
              spawnedEffects.push({id:this.uuid(),owner:e.owner,skill:'fireball',pos:{...e.pos},next:now+1000,
                remaining:1,expires:now+1500,afterglow:true,radius:2.5,damage:8});
          }
        }
        if(e.skill==='arrowRain'&&!e.poisonCloud&&e.remaining===1&&this.talented(owner,'thornfall')){
          spawnedEffects.push({id:this.uuid(),owner:e.owner,skill:'arrowRain',pos:{...e.pos},next:now+1000,
            remaining:2,expires:now+2600,poisonCloud:true,radius:owner.armour==='sporestormQuiver'?SPOREFANG_BONUS.arrowRainRadius:3.5,damage:6});
        }
        if(e.skill==='arrowRain'&&!e.poisonCloud&&this.talented(owner,'rainOfMercy')){
          const radius=(owner.armour==='sporestormQuiver'?SPOREFANG_BONUS.arrowRainRadius:3.5)+(e.remaining===1&&this.talented(owner,'lastDownpour')?1:0);
          for(const ally of this.players.values())if(ally.alive&&distance(ally.pos,e.pos)<=radius)this.heal(ally,5,e.owner);
        }
        if(e.skill!=='aimedShot'&&e.skill!=='fireTotem')this.emit({type:'abilityFx',skill:e.skill,playerId:e.owner,from:e.pos,to:e.pos});e.remaining--;e.next+=e.skill==='arrowRain'?600:1000;
      }return e.remaining>0;
    });
    this.effects.push(...spawnedEffects);
  }
