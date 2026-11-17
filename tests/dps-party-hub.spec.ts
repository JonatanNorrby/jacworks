import {test,expect} from '@playwright/test';

test('hub renders colored party roster, Hard Truffle boss selector and DPS interface without JS errors',async({page,baseURL})=>{
 test.setTimeout(120000);
 const errors:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(baseURL+'/?room=integration'+crypto.randomUUID().replaceAll('-','').slice(0,18));
 await expect(page.locator('#room-panel')).toContainText('Connected',{timeout:30000});
 await expect(page.locator('#game')).toBeVisible();
 await expect(page.locator('#room-roster .party-member')).toHaveCount(1);
 await expect(page.locator('#room-roster .party-health-text')).toContainText('100');
 await expect(page.locator('#room-roster .party-color')).toBeVisible();
 await expect(page.locator('#dps-meter')).toBeHidden();
 await page.getByRole('button',{name:'Propose boss'}).click();
 await expect(page.locator('#inventory-panel select')).toContainText('Hard Truffle Man');
 await page.screenshot({path:'test-results/dps-hub-sanity.png'});
 expect(errors).toEqual([]);
});
