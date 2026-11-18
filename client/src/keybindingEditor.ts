import {BINDING_ACTIONS,BINDING_LABELS,DEFAULT_BINDINGS,displayKey,normalizeBinding,rebind,type BindingAction,type Bindings} from '../../shared/keybindings';

/** Small, isolated settings component: no coupling to Babylon or game scene construction. */
export function createKeybindingEditor(optionsPanel:HTMLElement,initial:Bindings,onSave:(next:Bindings)=>void){
 let bindings={...initial},capture:BindingAction|null=null;
 const section=document.createElement('section');section.id='keybindings';section.setAttribute('aria-label','Keybindings');
 const heading=document.createElement('h3');heading.textContent='Keybindings';
 const description=document.createElement('p');description.textContent='Select an action and press a key. Escape cancels. One action per key; modifiers and browser shortcuts are reserved.';
 const feedback=document.createElement('p');feedback.id='keybinding-feedback';feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
 const grid=document.createElement('div');grid.className='keybinding-grid';
 const reset=document.createElement('button');reset.type='button';reset.textContent='Restore default keybindings';reset.id='reset-keybindings';
 section.append(heading,description,feedback,grid,reset);
 optionsPanel.insertBefore(section,optionsPanel.querySelector('button')!);
 function render(focus?:BindingAction){
  grid.replaceChildren();
  for(const action of BINDING_ACTIONS){
   const row=document.createElement('div');row.className='keybinding-row';
   const label=document.createElement('span');label.textContent=BINDING_LABELS[action];
   const button=document.createElement('button');button.type='button';button.className='keybinding-button';
   button.dataset.action=action;button.setAttribute('aria-label','Rebind '+BINDING_LABELS[action]);
   button.setAttribute('aria-pressed',String(action===capture));
   button.textContent=action===capture?'Press any key…':displayKey(bindings[action]);
   button.onclick=()=>{capture=action;feedback.textContent='Press a key for '+BINDING_LABELS[action]+'. Escape cancels.';render(action);};
   row.append(label,button);grid.append(row);
  }
  if(focus)grid.querySelector<HTMLButtonElement>('[data-action="'+focus+'"]')?.focus();
 }
 function cancel(){if(capture){capture=null;feedback.textContent='Keybinding change cancelled.';render();}}
 function keydown(event:KeyboardEvent):boolean{
  if(!capture)return false;
  event.preventDefault();event.stopImmediatePropagation();
  if(event.key==='Escape'){cancel();return true;}
  if(event.repeat||event.isComposing)return true;
  if(event.ctrlKey||event.altKey||event.metaKey||event.shiftKey){
   feedback.textContent='Modifier combinations are reserved. Press a single unmodified key or Escape.';
   return true;
  }
  const action=capture;
  const result=rebind(bindings,action,normalizeBinding(event.key));
  if(result.error){feedback.textContent=result.error;return true;}
  if(result.conflict){
   feedback.textContent=displayKey(normalizeBinding(event.key))+' is already used for '+BINDING_LABELS[result.conflict]+'. Choose another key or change that action first.';
   return true;
  }
  bindings=result.bindings;capture=null;onSave({...bindings});
  feedback.textContent=BINDING_LABELS[action]+' now uses '+displayKey(bindings[action])+'.';
  render(action);return true;
 }
 reset.onclick=()=>{
  bindings={...DEFAULT_BINDINGS};capture=null;onSave({...bindings});
  feedback.textContent='Default keybindings restored.';render();
 };
 function sync(next:Bindings){bindings={...next};capture=null;feedback.textContent='Keybindings updated from another tab.';render();}
 feedback.textContent='Bindings are stored in this browser.';
 render();
 return {keydown,cancel,sync,isCapturing:()=>capture!==null};
}
