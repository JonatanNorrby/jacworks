import {CLASS_DEFINITIONS,type ClassId} from '../../shared/classes';
import {TALENT_TREE,emptyTalents,talentAvailable,talentSpent,hasTalent,type TalentId,type TalentProgress} from '../../shared/talents';

type Action=(action:'unlock'|'respec',classId:ClassId,nodeId?:TalentId)=>void;
export function createTalentTree(onAction:Action){
 const overlay=document.createElement('section');overlay.id='talent-tree-panel';overlay.className='hidden';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Talent tree');
 const header=document.createElement('header'),title=document.createElement('h2');title.textContent='Talent Tree';
 const closeButton=document.createElement('button');closeButton.textContent='Close';closeButton.setAttribute('aria-label','Close talent tree');header.append(title,closeButton);
 const totals=document.createElement('p');totals.className='talent-points';totals.setAttribute('aria-live','polite');
 const tabs=document.createElement('nav');tabs.className='talent-class-tabs';tabs.setAttribute('aria-label','Class talent trees');
 const content=document.createElement('div');content.className='talent-nodes';
 const controls=document.createElement('div');controls.className='talent-controls';
 const respec=document.createElement('button');respec.type='button';respec.textContent='Respec this class · Free';
 respec.onclick=()=>onAction('respec',selected);
 controls.append(respec);
 overlay.append(header,totals,tabs,content,controls);document.body.append(overlay);
 let isOpen=false,selected:ClassId='shaman',progress:TalentProgress=emptyTalents();
 function showClass(id:ClassId){
   selected=id;tabs.replaceChildren();content.replaceChildren();
   totals.textContent=`Talent points: ${talentAvailable(progress)} available · ${talentSpent(progress)} spent · ${progress.wins.length} unique encounters cleared`;
   for(const [classId,definition] of Object.entries(CLASS_DEFINITIONS)){
     const tab=document.createElement('button');tab.type='button';tab.textContent=definition.name;tab.setAttribute('aria-pressed',String(classId===selected));tab.onclick=()=>showClass(classId as ClassId);tabs.append(tab);
   }
   const subtitle=document.createElement('p');subtitle.textContent=CLASS_DEFINITIONS[selected].name+' · Talent tree';content.append(subtitle);
   for(const node of TALENT_TREE[selected].nodes){
     const unlocked=hasTalent(progress,selected,node.id);
     const required=node.requires;
     const prereq=required?hasTalent(progress,selected,required):true;
     const card=document.createElement('article');card.className='talent-node'+(unlocked?' unlocked':' locked');
     const name=document.createElement('strong');name.textContent=node.name;
     const rank=document.createElement('span');rank.className='talent-rank';rank.textContent='Rank '+(unlocked?1:0)+' / 1'+(unlocked?' · Active':' · Inactive');
     const info=document.createElement('p');info.textContent=node.description;
     card.append(name,rank,info);
     if(required){const prerequisite=document.createElement('small');prerequisite.textContent='Requires: '+(TALENT_TREE[selected].nodes.find(n=>n.id===required)?.name??required);card.append(prerequisite)}
     const unlock=document.createElement('button');unlock.type='button';unlock.textContent=unlocked?'Unlocked':'Spend 1 point';
     unlock.disabled=unlocked||!prereq||talentAvailable(progress)<1;
     unlock.onclick=()=>onAction('unlock',selected,node.id);card.append(unlock);
     content.append(card);
   }
   respec.disabled=!(progress.picks[selected]?.length);
   const note=document.createElement('p');note.className='talent-note';note.textContent='Earn 1 point the first time you defeat each unique encounter. Repeats give no additional points. Respecs are free.';content.append(note);
 }
 function update(next:TalentProgress){progress=next;if(isOpen)showClass(selected)}
 function close(){overlay.classList.add('hidden');isOpen=false}
 function open(id:ClassId){showClass(id);overlay.classList.remove('hidden');isOpen=true;closeButton.focus()}
 closeButton.onclick=close;
 overlay.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();close()}});
 return {open,close,update,isOpen:()=>isOpen};
}
