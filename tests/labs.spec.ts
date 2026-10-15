import {test,expect} from '@playwright/test';

test('Labs retains live membership, votes, current scene and late loaded model',async({browser,baseURL},info)=>{
 let release=()=>{};
 const a=await browser.newContext(),b=await browser.newContext();
 try{
 const p=await a.newPage(),q=await b.newPage();const errors:string[]=[];p.on('pageerror',e=>errors.push(e.message));
 const source=await(await p.request.get('/src/truffle.ts')).text();const core=source.match(/from "([^\"]+@babylonjs_core[^\"]*)"/)![1];
 const held=new Promise<void>(resolve=>release=resolve);
 await p.route('**/assets/truffle-man/truffle.glb',async r=>{await held;await r.continue()});
 const room=crypto.randomUUID();await Promise.all([p.goto(baseURL+'/?room='+room,{waitUntil:'domcontentloaded'}),q.goto(baseURL+'/?room='+room,{waitUntil:'domcontentloaded'})]);
 await expect(p.locator('#room-panel')).toContainText('Connected · 2 players');
 await p.evaluate(async core=>{(window as any).scene=(await import(/* @vite-ignore */core)).EngineStore.LastCreatedScene},core);
 await p.getByRole('button',{name:'Game Dev',exact:true}).click();
 await expect(p.locator('.devlab-room-warning')).toContainText('Combat continues');
 const self=p.locator('#room-roster p').filter({hasText:'(you)'});const x=await self.getAttribute('data-x');
 await p.keyboard.down('d');await p.waitForTimeout(200);await p.keyboard.up('d');await expect(self).toHaveAttribute('data-x',x!);
 await p.evaluate(async core=>{const {Mesh}=await import(/* @vite-ignore */core);const s=(window as any).scene;
  const enabled=new Mesh('late-world-enabled',s),disabled=new Mesh('late-world-disabled',s),disposed=new Mesh('late-world-disposed',s);disabled.setEnabled(false);disposed.dispose();
  (window as any).suppressed=false;s.onBeforeRenderObservable.add(()=>{if(!document.querySelector('#game-dev-labs')?.classList.contains('hidden'))(window as any).suppressed=!enabled.isEnabled()&&!disabled.isEnabled()});
 },core);
 await expect.poll(()=>p.evaluate(()=>(window as any).suppressed)).toBe(true);
 await p.locator('[data-dev-view="characters"]').click();await p.locator('#dev-entity').selectOption('boss:greenCone');
 release();await expect(p.locator('#truffle-lab-status')).toContainText('procedural skeletal walk');
 await expect.poll(()=>p.evaluate(()=>(window as any).scene.transformNodes.find((n:any)=>n.name==='truffle-man'&&n.metadata?.gameDevLab)?.isEnabled())).toBe(true);
 await p.locator('#dev-health-bar').uncheck();await expect.poll(()=>p.evaluate(()=>(window as any).scene.getMeshByName('dev-health-bar').isEnabled())).toBe(false);
 await p.locator('[data-character-action="attack"]').click();await p.screenshot({path:info.outputPath('labs-truffle.png')});
 await p.locator('.devlab-characters [data-dev-action="menu"]').click();await p.locator('[data-dev-view="vfx"]').click();
 await p.locator('#dev-player-spell').selectOption('guard');await p.locator('#dev-vfx-speed').fill('0.25');await p.locator('#dev-vfx-scale').fill('2');await p.locator('[data-dev-action="play-vfx"]').click();
 await expect.poll(()=>p.evaluate(()=>(window as any).scene.meshes.some((m:any)=>m.metadata?.gameDevFx&&m.scaling.x>=2))).toBe(true);
 // Guard normally lives 700ms; quarter speed must keep it alive past that.
 await p.waitForTimeout(900);expect(await p.evaluate(()=>(window as any).scene.meshes.some((m:any)=>m.metadata?.gameDevFx))).toBe(true);
 await p.locator('#dev-vfx-speed').fill('2');await expect.poll(()=>p.evaluate(()=>(window as any).scene.meshes.some((m:any)=>m.metadata?.gameDevFx))).toBe(false);
 await p.locator('[data-vfx-tab="bosses"]').click();await p.locator('#dev-boss-mechanic').selectOption('green-adds');await p.locator('[data-dev-action="play-vfx"]').click();
 await expect.poll(()=>p.evaluate(()=>(window as any).scene.meshes.filter((m:any)=>m.name==='dev-mushroom-add-cap').length)).toBe(2);
 await q.getByRole('button',{name:'Propose boss',exact:true}).click();await q.locator('#inventory-panel select').selectOption('greenCone');await q.getByRole('button',{name:'Propose encounter',exact:true}).click();
 await p.getByRole('button',{name:'Accept',exact:true}).click();await expect(q.locator('#encounter-vote')).toContainText('1 / 2 accepted');await q.getByRole('button',{name:'Accept',exact:true}).click();
 await expect(p.locator('#game-dev-labs')).toBeVisible();await expect(q.locator('#boss-label')).toHaveText('TRUFFLE MAN');
 await p.keyboard.press('h');await p.keyboard.press('1');await expect(q.locator('#hub-card')).toBeHidden();
 await p.locator('[data-dev-action="close"]').click();await expect(p.locator('#boss-label')).toHaveText('TRUFFLE MAN');
 await expect(p.locator('#hub-card')).toBeHidden();await expect(p.locator('#room-panel')).toContainText('Connected · 2 players');
 expect(await p.evaluate(()=>{const s=(window as any).scene;return [s.getMeshByName('late-world-enabled').isEnabled(),s.getMeshByName('late-world-disabled').isEnabled(),!!s.getMeshByName('late-world-disposed')]})).toEqual([true,false,false]);
 await expect.poll(()=>p.evaluate(()=>(window as any).scene.transformNodes.filter((n:any)=>n.name==='truffle-man'&&n.isEnabled()).length)).toBe(1);
 await q.keyboard.press('h');await expect(p.locator('#hub-card')).toBeVisible();
 await p.getByRole('button',{name:'Game Dev',exact:true}).click();await q.getByRole('button',{name:'Propose boss',exact:true}).click();await q.getByRole('button',{name:'Propose encounter',exact:true}).click();await p.getByRole('button',{name:'Decline',exact:true}).click();
 await expect(q.locator('#encounter-vote')).toBeHidden();await p.locator('[data-dev-action="close"]').click();await expect(p.locator('#hub-card')).toBeVisible();
 expect(errors).toEqual([]);
 }finally{release();await a.close();await b.close()}
});
