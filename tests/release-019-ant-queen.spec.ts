import {test,expect} from '@playwright/test';

test('v0.1.9: Ant Queen has a northern Nest gate, live worker/royal waves and rockfall in the cave',async({page,baseURL})=>{
 test.setTimeout(120000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const seen:{wave:number;royals:number;workers:number;rockfall:number;bossHp:number;serverVersion:string}[]=[];
 page.on('websocket',socket=>socket.on('framereceived',frame=>{
  try{
   const packet=JSON.parse(String(frame.payload));
   if(packet.type==='snapshot'&&packet.boss?.id==='antQueen')seen.push({
    wave:packet.queenWave??0,royals:packet.adds?.filter((a:{kind:string})=>a.kind==='royalGuard').length??0,
    workers:packet.adds?.filter((a:{kind:string})=>a.kind==='antWorker').length??0,
    rockfall:packet.telegraphs?.filter((t:{style:string})=>t.style==='rockfall').length??0,
    bossHp:packet.boss.hp,serverVersion:packet.serverVersion??''
   });
  }catch{}
 }));
 await page.goto(baseURL+'/?room=ant019'+crypto.randomUUID().replaceAll('-').slice(0,18));
 await expect(page.locator('#room-panel')).toContainText('Connected',{timeout:30000});
 await page.getByRole('button',{name:'Propose boss'}).click();
 const select=page.getByRole('combobox',{name:'Boss encounter'});
 await expect(select.locator('option[value="antQueen"]')).toContainText('Nest · Ant Queen');
 await select.selectOption('antQueen');
 await page.getByRole('button',{name:'Propose encounter'}).click();
 await page.getByRole('button',{name:'Accept'}).click();
 await expect(page.locator('#boss-label')).toContainText('ANT QUEEN',{timeout:15000});
 await expect(page.locator('#boss-label')).toContainText('IMMUNE');
 await expect.poll(()=>seen.some(s=>s.wave>=1&&s.royals===1&&s.workers>=6),{timeout:8000}).toBeTruthy();
 await expect.poll(()=>seen.some(s=>s.rockfall>=2),{timeout:14000}).toBeTruthy();
 expect(seen.every(s=>s.bossHp===1200),'without Royal Guard deaths the queen remains immune').toBeTruthy();
 await expect(page.locator('#status')).toContainText('FIGHT');
 expect(errors).toEqual([]);
});

test('v0.1.9: Hard Warden encounter loads without browser errors',async({page,baseURL})=>{
 test.setTimeout(120000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('jacworks-class-v1','priest'));
 await page.goto(baseURL+'/?room=warden019'+crypto.randomUUID().replaceAll('-').slice(0,16));
 await expect(page.locator('#room-panel')).toContainText('Connected',{timeout:30000});
 await page.getByRole('button',{name:'Propose boss'}).click();
 await page.getByRole('combobox',{name:'Boss encounter'}).selectOption('hardWarden');
 await page.getByRole('button',{name:'Propose encounter'}).click();
 await page.getByRole('button',{name:'Accept'}).click();
 await expect(page.locator('#boss-label')).toContainText('HARD WARDEN',{timeout:15000});
 await expect(page.locator('#status')).toContainText('FIGHT');
 expect(errors).toEqual([]);
});
