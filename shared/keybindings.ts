/** Browser-local shortcuts; these never travel over the multiplayer protocol. */
export const BINDING_STORAGE_KEY='jacworks-keybindings-v1';
export const DEFAULT_BINDINGS={
 forward:'w',back:'s',left:'a',right:'d',interact:'e',
 ability1:'1',ability2:'2',ability3:'3',ability4:'4',
 propose:'r',hub:'h',chat:'enter'
} as const;
export type BindingAction=keyof typeof DEFAULT_BINDINGS;
export type Bindings=Record<BindingAction,string>;
export const BINDING_ACTIONS=Object.keys(DEFAULT_BINDINGS) as BindingAction[];
export const BINDING_LABELS:Record<BindingAction,string>={
 forward:'Move forward',back:'Move backward',left:'Move left',right:'Move right',
 interact:'Interact',ability1:'Ability 1',ability2:'Ability 2',ability3:'Ability 3',ability4:'Ability 4',
 propose:'Propose / retry boss',hub:'Return to hub',chat:'Open room chat'
};
const RESERVED=new Set(['escape','tab','shift','control','alt','meta','dead','process','unidentified',
 'capslock','numlock','scrolllock','backspace','delete','insert','home','end','pageup','pagedown',
 'printscreen','pause','contextmenu']);
const NAMED=new Set(['enter','space','arrowup','arrowdown','arrowleft','arrowright']);
export function normalizeBinding(raw:string):string{
 if(raw===' '||raw.toLowerCase()==='spacebar')return 'space';
 return raw.toLowerCase();
}
export function allowedKey(key:string):boolean{
 if(RESERVED.has(key)||!key||key.length>24||/^f\d{1,2}$/.test(key))return false;
 return (key.length===1&&key.trim().length===1)||NAMED.has(key);
}
/** Shift is used for self-targeting, so Shift+1 still activates a '1' binding. */
export function pressedBindingKey(event:Pick<KeyboardEvent,'key'|'code'|'shiftKey'>):string{
 if(event.shiftKey&&/^Digit[0-9]$/.test(event.code))return event.code.slice(-1);
 return normalizeBinding(event.key);
}
export function displayKey(key:string):string{
 const names:Record<string,string>={space:'Space',enter:'Enter',arrowup:'↑',arrowdown:'↓',arrowleft:'←',arrowright:'→'};
 return names[key]??(key.length===1?key.toUpperCase():key);
}
/** Bad or colliding records are replaced with defaults, never partially applied. */
export function parseBindings(raw:string|null):Bindings{
 const defaults={...DEFAULT_BINDINGS} as Bindings;
 if(!raw)return defaults;
 try{
  const decoded:unknown=JSON.parse(raw);
  if(!decoded||typeof decoded!=='object'||Array.isArray(decoded))return defaults;
  const result={...defaults};
  for(const action of BINDING_ACTIONS){
   if(!Object.hasOwn(decoded,action))continue;
   const value=(decoded as Record<string,unknown>)[action];
   if(typeof value!=='string')return defaults;
   const key=normalizeBinding(value);
   if(!allowedKey(key))return defaults;
   result[action]=key;
  }
  if(new Set(Object.values(result)).size!==BINDING_ACTIONS.length)return defaults;
  return result;
 }catch{return defaults;}
}
export type RebindResult={bindings:Bindings;conflict:BindingAction|null;error:string|null};
export function rebind(bindings:Bindings,action:BindingAction,rawKey:string):RebindResult{
 const key=normalizeBinding(rawKey);
 if(!Object.hasOwn(DEFAULT_BINDINGS,action)||!allowedKey(key))
  return {bindings,conflict:null,error:'That key is reserved or unsupported. Choose a letter, number, punctuation, arrow, Space or Enter.'};
 const conflict=BINDING_ACTIONS.find(a=>a!==action&&bindings[a]===key)??null;
 if(conflict)return {bindings,conflict,error:null};
 return {bindings:{...bindings,[action]:key},conflict:null,error:null};
}
