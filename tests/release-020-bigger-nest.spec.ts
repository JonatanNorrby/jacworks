import {test,expect} from '@playwright/test';
import {emptyInventory,type Inventory} from '../shared/inventory';

test('v0.1.10: Royal equipment appears in distinct Wardrobe slots and legacy offhand migrates',async({page,baseURL})=>{
 test.setTimeout(120000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const inv:Inventory=emptyInventory();
 inv.rewards={
  'royal-1':'antChitin','royal-2':'antChitin','royal-3':'antChitin','royal-4':'antChitin',
  'spore-1':'hardTruffleSpore','spore-2':'hardTruffleSpore','cylinder-1':'largeCylinder'
 };
 inv.broodTotems=1;inv.carapaceShields=1;inv.broodQuivers=1;inv.offhand='broodTotem';
 await page.addInitScript(({save})=>{
  localStorage.setItem('jacworks-inventory-v1',save);
  localStorage.setItem('jacworks-class-v1','shaman');
 },{save:JSON.stringify(inv)});
 await page.goto(baseURL+'/?room=gear020'+crypto.randomUUID().replaceAll('-').slice(0,16));
 await expect(page.locator('#room-panel')).toContainText('Connected',{timeout:30000});
 await page.getByRole('button',{name:'Wardrobe',exact:true}).click();
 const panel=page.locator('#inventory-panel');
 await expect(panel).toBeVisible();
 const tabs=panel.getByRole('navigation',{name:'Wardrobe equipment slots'});
 await expect(tabs.getByRole('button',{name:'Weapons (1)'})).toBeVisible();
 await expect(tabs.getByRole('button',{name:'Armour (1)'})).toBeVisible();
 await expect(tabs.getByRole('button',{name:'Offhand (1)'})).toBeVisible();
 await tabs.getByRole('button',{name:'Weapons (1)'}).click();
 await expect(panel.locator('.gear-card')).toHaveCount(1);
 await expect(panel.locator('.gear-card')).toContainText('Brood Totemstaff');
 await expect(panel.locator('.gear-card')).toContainText('Equipped');
 await tabs.getByRole('button',{name:'Armour (1)'}).click();
 await expect(panel.locator('.gear-card')).toContainText('Royal Carapace Plate');
 await tabs.getByRole('button',{name:'Offhand (1)'}).click();
 await expect(panel.locator('.gear-card')).toContainText('Brood Quiver');
 await tabs.getByRole('button',{name:'All (3)'}).click();
 await expect(panel.locator('.gear-card')).toHaveCount(3);
 expect(errors).toEqual([]);
});

test('v0.1.10: larger Nest fight and nine-node talent branches synchronize over browser multiplayer',async({page,baseURL})=>{
 test.setTimeout(120000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const cave:{queenZ:number;playerZ:number;workerX:number;version:string}[]=[];
 page.on('websocket',socket=>socket.on('framereceived',frame=>{
  try{
   const packet=JSON.parse(String(frame.payload));
   if(packet.type==='snapshot'&&packet.boss?.id==='antQueen'){
    const worker=packet.adds?.find((a:{kind:string})=>a.kind==='antWorker');
    const player=packet.players?.[0];
    if(worker&&player)cave.push({queenZ:packet.boss.pos.z,playerZ:player.pos.z,workerX:worker.pos.x,version:packet.serverVersion});
   }
  }catch{}
 }));
 await page.goto(baseURL+'/?room=nest020'+crypto.randomUUID().replaceAll('-').slice(0,16));
 await expect(page.locator('#room-panel')).toContainText('Connected',{timeout:30000});
 await page.getByRole('button',{name:'Talent Tree'}).click();
 const tree=page.locator('#talent-tree-panel');await expect(tree).toBeVisible();
 await expect(tree.locator('.talent-node')).toHaveCount(13);
 await expect(tree.locator('.talent-vertical-link')).toHaveCount(9);
 await tree.locator('.talent-class-tabs').getByRole('button',{name:'Shaman'}).click();
 await expect(tree).toContainText('Ancestral Shelter');
 await expect(tree).toContainText('Storm Mender');
 await tree.getByRole('button',{name:'Close talent tree'}).click();
 await page.getByRole('button',{name:'Propose boss'}).click();
 const select=page.getByRole('combobox',{name:'Boss encounter'});
 await expect(select.locator('option[value="antQueen"]')).toContainText('Nest · Ant Queen');
 await select.selectOption('antQueen');
 await page.getByRole('button',{name:'Propose encounter'}).click();
 await page.getByRole('button',{name:'Accept'}).click();
 await expect(page.locator('#boss-label')).toContainText('ANT QUEEN',{timeout:15000});
 await expect.poll(()=>cave.some(p=>p.version==='0.1.11'&&p.queenZ===10.5&&p.playerZ===-10.5&&Math.abs(p.workerX)>10),
 {timeout:10000}).toBeTruthy();
 expect(errors).toEqual([]);
});
