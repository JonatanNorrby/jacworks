export const BINDING_STORAGE_KEY='jacworks-keybindings-v1';
export const DEFAULT_BINDINGS={
 forward:'w',back:'s',left:'a',right:'d',interact:'e',
 ability1:'1',ability2:'2',ability3:'3',ability4:'4',
 propose:'r',hub:'h',chat:'enter'
} as const;
export type BindingAction=keyof typeof DEFAULT_BINDINGS;
export type Bindings=Record<BindingAction,string>;
export const BINDING_LABELS:Record<BindingAction,string>={
 forward:'Move forward',back:'Move backward',left:'Move left',right:'Move right',
 interact:'Interact',ability1:'Ability 1',ability2:'Ability 2',ability3:'Ability 3',
 ability4:'Ability 4',propose:'Propose boss',hub:'Return to hub',chat:'Open chat'
};
export const BINDING_ACTIONS=Object.keys(DEFAULT_BINDINGS) as BindingAction[];
export function normalizeBinding(key:string):string {
 if(key===' ')return 'space';
 return key.toLowerCase();
}
export function parseBindings(raw:string|null):Bindings {
 const defaults={...DEFAULT_BINDINGS} as Bindings;
 if(!raw)return defaults;
 try {
  const data:unknown=JSON.parse(raw);
  if(!data||typeof data!=='object')return defaults;
  const candidate={...defaults};
  for(const action of BINDING_ACTIONS){
   const value=(data as Record<string,unknown>)[action];
   if(typeof value==='string'&&allowedKey(normalizeBinding(value)))candidate[action]=normalizeBinding(value);
  }
  if(new Set(Object.values(candidate)).size===BINDING_ACTIONS.length)return candidate;
 }catch{}
 return defaults;
}
export function allowedKey(key:string):boolean {
 return !!key&&key.length<=20&&!['escape','tab','shift','control','alt','meta','dead','process','unidentified'].includes(key)
 &&!key.startsWith('arrow');
}
export function rebind(bindings:Bindings,action:BindingAction,key:string):{bindings:Bindings;conflict:BindingAction|null;error:string|null}{
 const normalized=normalizeBinding(key);
 if(!allowedKey(normalized))return {bindings,conflict:null,error:'That key is reserved or unsupported.'};
 const conflict=BINDING_ACTIONS.find(a=>a!==action&&bindings[a]===normalized)??null;
 if(conflict)return {bindings,conflict,error:null};
 return {bindings:{...bindings,[action]:normalized},conflict:null,error:null};
}
export function displayKey(key:string):string {
 if(key==='space')return 'Space';
 if(key==='enter')return 'Enter';
 return key.length===1?key.toUpperCase():key[0].toUpperCase()+key.slice(1);
}
