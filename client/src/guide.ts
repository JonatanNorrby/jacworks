import {CLASS_DEFINITIONS} from '../../shared/classes';
import {BOSS_CIRCLES} from '../../shared/boss-layout';
import {MATERIAL_SOURCES,CODEX_BOSS_NAMES,CODEX_MECHANICS,readCodex,observeCodex} from '../../shared/codex';
import type {BossId,Snapshot} from '../../shared/protocol';
import {SKILLS} from '../../shared/protocol';
import {TALENT_TREE} from '../../shared/talents';

export const CODEX_STORAGE_KEY='jacworks-guide-codex-v1';
const branches:Record<string,string>={
 shaman:'Totem detonations · Lightning chains · Restoration & spirit totems',
 defender:'Shield networks · Bulwark retaliation · Threat & party protection',
 rogue:'Rear attacks · Poison spreading · Stealth and misdirection',
 warrior:'Charging attacks · Guard support · Front-line leadership',
 priest:'Targeted healing · Holy damage · Group sanctuary',
 lightningMage:'Forked lightning · Storm fields · Lightning Shield support',
 ranger:'Aimed Shot ricochets · Arrow Rain · Mobility and Split Shot',
 fireMage:'LAZOR · Fire Mines · Fireball and lingering embers'
};
export function createGuideDialog(storage:Pick<Storage,'getItem'|'setItem'>,onOpen:()=>void){
 let progress=readCodex(storage.getItem(CODEX_STORAGE_KEY));
 let selected='Overview';
 const button=document.createElement('button');button.id='guide-button';button.type='button';button.textContent='Guide';
 button.setAttribute('aria-haspopup','dialog');document.body.append(button);
 const dialog=document.createElement('dialog');dialog.id='guide-panel';dialog.setAttribute('aria-labelledby','guide-title');
 const header=document.createElement('header');const title=document.createElement('h2');title.id='guide-title';title.textContent='Field Guide & Boss Codex';
 const close=document.createElement('button');close.type='button';close.textContent='Close';close.setAttribute('aria-label','Close guide');
 close.onclick=()=>dialog.close();header.append(title,close);dialog.append(header);
 const nav=document.createElement('nav');nav.className='guide-tabs';nav.setAttribute('aria-label','Guide chapters');dialog.append(nav);
 const body=document.createElement('section');body.className='guide-scroll';dialog.append(body);document.body.append(dialog);
 const addText=(heading:string,copy:string)=>{
  const article=document.createElement('article');const h=document.createElement('h3');h.textContent=heading;
  const p=document.createElement('p');p.textContent=copy;article.append(h,p);body.append(article);
 };
 function render(){
  body.replaceChildren();nav.replaceChildren();
  for(const chapter of ['Overview','Boss Codex','Materials','Classes','Combat'] as const){
   const tab=document.createElement('button');tab.type='button';tab.textContent=chapter;tab.setAttribute('aria-pressed',String(chapter===selected));
   tab.onclick=()=>{selected=chapter;render()};nav.append(tab);
  }
  if(selected==='Overview'){
   addText('Start in the Sanctum Hub','Choose your class and four skills at the Trainer, craft items from encounter materials, and equip them in the Wardrobe. Each class remembers its own gear choices.');
   addText('Start a fight','Choose a boss at an encounter circle or through Propose boss. Every connected player must accept. After a win or wipe, return to the hub to try again.');
   addText('Learn by doing','The Boss Codex begins incomplete. It records bosses and mechanics you have seen, and loot that has actually dropped for you. It does not reveal encounter solutions in advance.');
   addText('Party scaling','Boss health is locked when an encounter begins: solo 100%, two players 150%, three 200%, four 250% of base HP. Movement mechanics still matter.');
  }else if(selected==='Boss Codex'){
   addText('Discovered encounters',progress.seen.length+' encountered. Fights and mechanics only become readable here after you have observed them.');
   for(const circle of BOSS_CIRCLES)for(const [id] of circle.bosses){
    if(!progress.seen.includes(id))continue;
    const article=document.createElement('article'),h=document.createElement('h3');h.textContent=CODEX_BOSS_NAMES[id]+' · '+circle.difficulty;article.append(h);
    const known=progress.mechanics[id]??[];
    const p=document.createElement('p');p.textContent=known.length?known.length+' discovered mechanic(s):':'No mechanics observed yet.';article.append(p);
    for(const key of known){const row=document.createElement('p');const strong=document.createElement('strong');strong.textContent=CODEX_MECHANICS[key].name+': ';
      row.append(strong,document.createTextNode(CODEX_MECHANICS[key].description));article.append(row);}
    const loot=Object.entries(MATERIAL_SOURCES).filter(([material,entry])=>entry.boss===id&&progress.loot.includes(material as keyof typeof MATERIAL_SOURCES));
    for(const [material,entry] of loot){const p=document.createElement('p');p.textContent='Discovered loot: '+entry.name;article.append(p);}
    body.append(article);
   }
   if(!progress.seen.length)addText('Unknown encounters','Enter a fight to begin recording the bosses you meet.');
  }else if(selected==='Materials'){
   addText('Crafting sources','These locations are public recipe information. Your Boss Codex only records actual drops after you receive them.');
   for(const [,item] of Object.entries(MATERIAL_SOURCES))addText(item.name,'Earned from: '+item.source);
  }else if(selected==='Classes'){
   for(const [id,definition] of Object.entries(CLASS_DEFINITIONS)){
    const specials=TALENT_TREE[id as keyof typeof TALENT_TREE];
    addText(definition.name,branches[id]+'. Four skills: '+definition.skills.map(skill=>SKILLS[skill].name).join(', ')+'. '+specials.branches.length+' talent branches.');
   }
  }else{
   addText('Threat and target control','Damaging bosses builds threat. Effective healing creates less threat. Warriors can pull enemy attention with Guard; Defenders use Bulwark and Heroic Shield. Tanks can direct normal boss targeting, but marked ground attacks still affect everyone.');
   addText('Stay alive','Guard, Bulwark, shielding, movement and position all matter. Avoid warning circles and lines; effects resolve on the server even if your camera is looking elsewhere.');
   addText('Equipment combos','Items modify existing abilities and occupy weapon, head, offhand, armour or boots slots. Ranger gear now spans all five. Change class at the Trainer to restore that class’s equipped build.');
  }
 }
 const open=()=>{onOpen();render();if(!dialog.open)dialog.showModal();close.focus();};
 button.onclick=open;
 dialog.addEventListener('close',()=>button.focus());
 return {button,dialog,open,close:()=>{if(dialog.open)dialog.close();},
  isOpen:()=>dialog.open,
  getProgress:()=>readCodex(progress),
  observe:(snapshot:Snapshot,playerId:string)=>{
   if(!playerId)return;
   if(observeCodex(progress,snapshot,playerId)){
    storage.setItem(CODEX_STORAGE_KEY,JSON.stringify(progress));
    if(dialog.open)render();
   }
  }
 };
}
