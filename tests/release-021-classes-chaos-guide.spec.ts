import {test,expect} from '@playwright/test';
import {emptyInventory,RECIPES,GEAR_SLOTS,craft,equipForClass,type Gear,type Material} from '../shared/inventory';

function savedGear(){
 const inv=emptyInventory(),ranger=['sporefangQuiver','sporestormQuiver','splitthornQuiver','rottingFletching','broodQuiver'] as const;
 let i=0;
 const all:Gear[]=[...ranger,'emberWand','cinderweaveArmour','pointyOrb'];
 for(const item of all)for(const [material,count] of Object.entries(RECIPES[item]))
  for(let n=0;n<count;n++)inv.rewards['receipt-'+i++]=material as Material;
 for(const item of all)if(!craft(inv,item))throw Error('missing recipe '+item);
 for(const item of ranger)if(!equipForClass(inv,'ranger',GEAR_SLOTS[item],item))throw Error('equip '+item);
 return JSON.stringify(inv);
}
test('v0.1.11: five Ranger slots restore after changing class, and guide lists actual material sources',async({page,baseURL})=>{
 test.setTimeout(120000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(raw=>{localStorage.setItem('jacworks-class-v1','ranger');localStorage.setItem('jacworks-inventory-v1',raw);},savedGear());
 await page.goto(baseURL+'/?room=equipment021'+crypto.randomUUID().replaceAll('-').slice(0,12));
 await expect(page.locator('#room-panel')).toContainText('Connected',{timeout:30000});
 await page.getByRole('button',{name:'Wardrobe',exact:true}).click();
 const panel=page.locator('#inventory-panel');
 const nav=panel.getByRole('navigation',{name:'Wardrobe equipment slots'});
 for(const slot of ['Weapons (2)','Head (1)','Offhand (2)','Armour (2)','Boots (1)']){
  await expect(nav.getByRole('button',{name:slot})).toBeVisible();
 }
 const all=await page.evaluate(()=>JSON.parse(localStorage.getItem('jacworks-inventory-v1')!));
 expect(all.weapon).toBe('sporefangQuiver');
 expect(all.armour).toBe('sporestormQuiver');
 expect(all.head).toBe('splitthornQuiver');
 expect(all.offhand).toBe('broodQuiver');
 expect(all.boots).toBe('rottingFletching');
 await panel.getByRole('button',{name:'Close'}).click();
 await page.getByRole('button',{name:'Choose class'}).click();
 await page.getByRole('combobox',{name:'Class'}).selectOption('fireMage');
 await page.getByRole('button',{name:'Save loadout'}).click();
 await page.getByRole('button',{name:'Wardrobe',exact:true}).click();
 const magePanel=page.locator('#inventory-panel');
 await magePanel.getByRole('navigation',{name:'Wardrobe equipment slots'}).getByRole('button',{name:'Weapons (2)'}).click();
 await magePanel.locator('.gear-card').filter({hasText:'Ember Wand'}).getByRole('button',{name:'Equip'}).click();
 await magePanel.getByRole('navigation',{name:'Wardrobe equipment slots'}).getByRole('button',{name:'Armour (2)'}).click();
 await magePanel.locator('.gear-card').filter({hasText:'Cinderweave Armour'}).getByRole('button',{name:'Equip'}).click();
 await magePanel.getByRole('button',{name:'Close'}).click();
 await page.getByRole('button',{name:'Choose class'}).click();
 await page.getByRole('combobox',{name:'Class'}).selectOption('ranger');
 await page.getByRole('button',{name:'Save loadout'}).click();
 const restored=await page.evaluate(()=>JSON.parse(localStorage.getItem('jacworks-inventory-v1')!));
 expect(restored).toMatchObject({weapon:'sporefangQuiver',head:'splitthornQuiver',offhand:'broodQuiver',armour:'sporestormQuiver',boots:'rottingFletching'});
 expect(restored.gearSets.fireMage).toMatchObject({weapon:'emberWand',armour:'cinderweaveArmour'});
 await page.getByRole('button',{name:'Guide',exact:true}).click();
 const guide=page.getByRole('dialog',{name:'Field Guide & Boss Codex'});
 await expect(guide).toBeVisible();
 await guide.getByRole('button',{name:'Materials'}).click();
 await expect(guide).toContainText('Royal Ant Chitin');
 await expect(guide).toContainText('Ant Queen · Nest');
 await expect(guide).toContainText('Chaos Sigil');
 await expect(guide).toContainText('Chaos Arena');
 await guide.getByRole('button',{name:'Classes'}).click();
 await expect(guide).toContainText('Ranger');
 await expect(guide).toContainText('Mobility and Split Shot');
 await guide.getByRole('button',{name:'Close'}).click();
 expect(errors).toEqual([]);
});
test('v0.1.11: Chaos gate launches five simultaneous bosses, codex discovers them through actual snapshots',async({page,baseURL})=>{
 test.setTimeout(120000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const captures:{boss:string;champions:string[];version:string;maxHp:number}[]=[];
 page.on('websocket',socket=>socket.on('framereceived',frame=>{
  try{
   const s=JSON.parse(String(frame.payload));
   if(s.type==='snapshot'&&s.boss?.id==='chaosArena')
    captures.push({boss:s.boss.id,champions:s.adds.filter((a:{kind?:string})=>a.kind==='chaosBoss').map((a:{bossId:string})=>a.bossId),version:s.serverVersion??'',maxHp:s.boss.maxHp});
  }catch{}
 }));
 await page.goto(baseURL+'/?room=chaos021'+crypto.randomUUID().replaceAll('-').slice(0,12));
 await expect(page.locator('#room-panel')).toContainText('Connected',{timeout:30000});
 await page.getByRole('button',{name:'Guide',exact:true}).click();
 let guide=page.getByRole('dialog',{name:'Field Guide & Boss Codex'});
 await guide.getByRole('button',{name:'Boss Codex'}).click();
 await expect(guide).toContainText('Unknown encounters');
 await guide.getByRole('button',{name:'Close'}).click();
 await page.getByRole('button',{name:'Propose boss'}).click();
 const selector=page.getByRole('combobox',{name:'Boss encounter'});
 await expect(selector.locator('option[value="chaosArena"]')).toContainText('Chaos');
 await selector.selectOption('chaosArena');
 await page.getByRole('button',{name:'Propose encounter'}).click();
 await page.getByRole('button',{name:'Accept'}).click();
 await expect(page.locator('#boss-label')).toContainText('CHAOS ARENA',{timeout:15000});
 await expect.poll(()=>captures.some(x=>x.champions.length===5),{timeout:8000}).toBeTruthy();
 await expect(page.locator('#duo-health .duo-health-row')).toHaveCount(5);
 await page.getByRole('button',{name:'Guide',exact:true}).click();
 guide=page.getByRole('dialog',{name:'Field Guide & Boss Codex'});
 await guide.getByRole('button',{name:'Boss Codex'}).click();
 await expect(guide).toContainText('Chaos Arena');
 await expect(guide).toContainText('All at Once');
 await expect(guide).not.toContainText('Unknown encounters');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('jacworks-guide-codex-v1')??'{}'));
 expect(saved.seen).toContain('chaosArena');
 expect(saved.loot??[]).not.toContain('chaosSigil','no loot before victory');
 await guide.getByRole('button',{name:'Close'}).click();
 expect(errors).toEqual([]);
});
