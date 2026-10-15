import {test,expect} from '@playwright/test';
test('three humans share visible hub, vote, reconnect and isolated rooms',async({browser,baseURL},testInfo)=>{
 const contexts=await Promise.all([0,1,2,3].map(()=>browser.newContext()));
 try{
 const pages=await Promise.all(contexts.map(c=>c.newPage()));
 const code=crypto.randomUUID();const names=['Alice','Bob','Chris','Other'];
 await Promise.all(pages.map(async(p,i)=>{await p.addInitScript(name=>{
   localStorage.setItem('jacworks-name',name);
   const Native=window.WebSocket;
   window.WebSocket=class extends Native {constructor(url:string|URL,protocols?:string|string[]){super(url,protocols);(window as any).testSocket=this}};
 },names[i]);await p.goto(baseURL+'/?room='+code+(i===3?'-other':''))}));
 const group=pages.slice(0,3),other=pages[3];
 for(const p of group){await expect(p.locator('#room-panel')).toContainText('Connected · 3 players');for(const n of names.slice(0,3))await expect(p.locator('#room-roster')).toContainText(n)}
 await expect(other.locator('#room-panel')).toContainText('Connected · 1 players');
 const bob=group[0].locator('#room-roster p').filter({hasText:'Bob'});
 const before=Number(await bob.getAttribute('data-x'));
 await group[1].keyboard.down('d');await group[1].waitForTimeout(200);await group[1].keyboard.up('d');
 for(const p of group)await expect.poll(async()=>Number(await p.locator('#room-roster p').filter({hasText:'Bob'}).getAttribute('data-x'))).toBeGreaterThan(before);
 await group[0].screenshot({path:testInfo.outputPath('three-player-hub.png')});
 async function propose(){await group[0].getByRole('button',{name:'Propose boss',exact:true}).click();await group[0].getByRole('button',{name:'Propose encounter',exact:true}).click();for(const p of group)await expect(p.locator('#encounter-vote')).toBeVisible();await expect(other.locator('#encounter-vote')).toBeHidden()}
 await propose();for(const p of group.slice(0,2))await p.getByRole('button',{name:'Accept',exact:true}).click();
 for(const p of group)await expect(p.locator('#encounter-vote')).toContainText('2 / 3 accepted');
 await group[2].getByRole('button',{name:'Decline',exact:true}).click();for(const p of group)await expect(p.locator('#encounter-vote')).toBeHidden();
 await propose();await contexts[2].setOffline(true);await group[2].evaluate(()=>(window as any).testSocket.close());
 await expect(group[2].locator('#room-panel')).toContainText('Disconnected',{timeout:15000});
 for(const p of group.slice(0,2))await expect(p.locator('#encounter-vote')).toBeHidden();
 await contexts[2].setOffline(false);for(const p of group)await expect(p.locator('#room-panel')).toContainText('Connected · 3 players',{timeout:15000});
 await propose();for(const p of group)await p.getByRole('button',{name:'Accept',exact:true}).click();
 for(const p of group){await expect(p.locator('#hub-card')).toBeHidden();await expect(p.locator('#status')).toContainText('FIGHT')}
 await expect(other.locator('#hub-card')).toBeVisible();
 await group[0].keyboard.press('h');for(const p of group)await expect(p.locator('#hub-card')).toBeVisible();
 await propose();await group[2].reload();for(const p of group)await expect(p.locator('#encounter-vote')).toBeHidden();
 for(const p of group)await expect(p.locator('#room-panel')).toContainText('Connected · 3 players');
 await propose();await group[2].evaluate(()=>(window as any).testSocket.onmessage=null);
 // An open socket with no snapshots must recover too, rather than retain a stale vote.
 for(const p of group.slice(0,2))await expect(p.locator('#encounter-vote')).toBeHidden({timeout:15000});
 for(const p of group)await expect(p.locator('#room-panel')).toContainText('Connected · 3 players',{timeout:15000});
 for(const p of group)await expect(p.locator('#room-roster')).toContainText('Chris');
 }finally{await Promise.all(contexts.map(c=>c.close()))}
});
test('bare visits create private rooms and sharing the resulting URL joins one room',async({browser,baseURL})=>{
 const a=await browser.newContext(),b=await browser.newContext();
 try{
 const first=await a.newPage(),second=await b.newPage();await Promise.all([first.goto(baseURL!),second.goto(baseURL!)]);
 await expect(first.locator('#room-panel')).toContainText('Connected · 1 players');await expect(second.locator('#room-panel')).toContainText('Connected · 1 players');
 expect(new URL(first.url()).searchParams.get('room')).not.toBe(new URL(second.url()).searchParams.get('room'));
 await second.goto(first.url());for(const p of [first,second])await expect(p.locator('#room-panel')).toContainText('Connected · 2 players');
 }finally{await a.close();await b.close()}
});
