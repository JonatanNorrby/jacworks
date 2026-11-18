import {test,expect} from '@playwright/test';
test('version handshake and Hard Truffle proposal actually start a boss encounter',async({page,baseURL})=>{
 test.setTimeout(120000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(baseURL+'/?room=release'+crypto.randomUUID().replaceAll('-','').slice(0,18));
 await expect(page.locator('#room-panel')).toContainText('Connected',{timeout:30000});
 await page.locator('#options-button').click();
 await expect(page.locator('#game-version')).toContainText('Client 0.1.5+');
 await expect(page.locator('#game-version')).toContainText('Server 0.1.5');
 await page.locator('#options-panel').getByRole('button',{name:'Close'}).click();
 await page.getByRole('button',{name:'Propose boss'}).click();
 await page.getByRole('combobox',{name:'Boss encounter'}).selectOption('hardGreenCone');
 await page.getByRole('button',{name:'Propose encounter'}).click();
 await expect(page.locator('#encounter-vote')).toContainText('Hard Truffle Man',{timeout:15000});
 await page.getByRole('button',{name:'Accept'}).click();
 await expect(page.locator('#boss-label')).toContainText('HARD TRUFFLE MAN',{timeout:15000});
 expect(errors).toEqual([]);
});
