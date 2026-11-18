import {test,expect} from '@playwright/test';

test('v0.1.3 lets a player select a double encounter and inspect the healing meter',async({page,baseURL})=>{
 test.setTimeout(120000);
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(baseURL+'/?room=duo'+crypto.randomUUID().replaceAll('-','').slice(0,18));
 await expect(page.locator('#room-panel')).toContainText('Connected',{timeout:30000});
 await page.locator('#options-button').click();
 await expect(page.locator('#game-version')).toContainText('Client 0.1.3+');
 await expect(page.locator('#game-version')).toContainText('Server 0.1.3');
 await page.locator('#options-panel').getByRole('button',{name:'Close'}).click();
 await expect(page.locator('#abilities')).toBeVisible();
 await page.getByRole('button',{name:'Propose boss'}).click();
 await page.getByRole('combobox',{name:'Boss encounter'}).selectOption('duoYellowWarden');
 await page.getByRole('button',{name:'Propose encounter'}).click();
 await expect(page.locator('#encounter-vote')).toContainText('Yellow Ball + Warden',{timeout:15000});
 await page.getByRole('button',{name:'Accept'}).click();
 await expect(page.locator('#boss-label')).toHaveText('WARDEN + YELLOW BALL',{timeout:15000});
 await expect(page.locator('#dps-meter')).toBeVisible();
 await page.locator('#dps-meter').getByRole('button',{name:'Healing'}).click();
 await expect(page.locator('#dps-meter').getByRole('button',{name:'Healing'})).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('#dps-rows')).toContainText('Waiting for healing');
 expect(errors).toEqual([]);
});
