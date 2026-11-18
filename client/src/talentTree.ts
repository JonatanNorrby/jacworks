import {CLASS_DEFINITIONS,type ClassId} from '../../shared/classes';
import {TALENT_TREE,TALENT_NODE} from '../../shared/talents';

export function createTalentTree(){
 const overlay=document.createElement('section');overlay.id='talent-tree-panel';overlay.className='hidden';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Talent tree');
 const header=document.createElement('header');const title=document.createElement('h2');title.textContent='Talent Tree';
 const closeButton=document.createElement('button');closeButton.textContent='Close';closeButton.setAttribute('aria-label','Close talent tree');header.append(title,closeButton);
 const tabs=document.createElement('nav');tabs.className='talent-class-tabs';tabs.setAttribute('aria-label','Class talent trees');
 const content=document.createElement('div');content.className='talent-nodes';
 overlay.append(header,tabs,content);document.body.append(overlay);
 let isOpen=false;let selected:ClassId='shaman';
 function showClass(id:ClassId){
   selected=id;tabs.replaceChildren();content.replaceChildren();
   for(const [classId,definition] of Object.entries(CLASS_DEFINITIONS)){
     const tab=document.createElement('button');tab.textContent=definition.name;tab.setAttribute('aria-pressed',String(classId===selected));
     tab.onclick=()=>showClass(classId as ClassId);tabs.append(tab);
   }
   const definition=CLASS_DEFINITIONS[selected];const tree=TALENT_TREE[selected];
   const subtitle=document.createElement('p');subtitle.textContent=definition.name+' · Starting talent tree';content.append(subtitle);
   for(const node of tree.nodes){
     const card=document.createElement('article');card.className='talent-node';
     const name=document.createElement('strong');name.textContent=node.name;
     const rank=document.createElement('span');rank.textContent='Rank 1 / 1 · Unlocked';rank.className='talent-rank';
     const info=document.createElement('p');info.textContent=node.description;
     card.append(name,rank,info);content.append(card);
   }
   const note=document.createElement('p');note.className='talent-note';note.textContent='The starter node is active for every class. Future talent ranks and branches can be added here.';content.append(note);
 }
 function close(){overlay.classList.add('hidden');isOpen=false;}
 function open(id:ClassId){showClass(id);overlay.classList.remove('hidden');isOpen=true;closeButton.focus();}
 closeButton.onclick=close;
 overlay.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();close()}});
 return {open,close,isOpen:()=>isOpen,node:TALENT_NODE};
}
