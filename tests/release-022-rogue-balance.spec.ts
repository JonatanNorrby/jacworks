import {test,expect} from '@playwright/test';
import {NETWORK_VERSION} from '../shared/protocol';

test('v0.1.12: Rogue gains stronger melee tooltips, and Vanish restores the correct skill when unused',async({page,baseURL})=>{
 test.setTimeout(120000);
 const errors:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(()=>{localStorage.setItem('jacworks-class-v1','rogue');});
 await page.goto(baseURL+'/?room=rogue022'+crypto.randomUUID().replaceAll('-').slice(0,14));
 await expect(page.locator('#room-panel')).toContainText('Connected',{timeout:30000});
 // Class loadouts are rearrangeable: discover the live binding instead of
 // assuming every saved profile keeps Vanish in a particular number slot.
 const first=page.locator('#abilities .ability-slot').filter({hasText:'Quick Stab'});
 await expect(first.locator('strong')).toHaveText('Quick Stab');
 await expect(first).toHaveAttribute('title',/32 damage/);
 const vanishSlot=await page.locator('#abilities .ability-slot').filter({hasText:'Vanish'}).getAttribute('data-slot');
 expect(vanishSlot).toBeTruthy();
 const second=page.locator('#abilities .ability-slot[data-slot="'+vanishSlot+'"]');
 await expect(second.locator('strong')).toHaveText('Vanish');
 await page.locator('#options-button').click();
 await expect(page.locator('#game-version')).toContainText('Server '+NETWORK_VERSION);
 await page.locator('#options-panel').getByRole('button',{name:'Close'}).click();
 await page.getByRole('button',{name:'Propose boss'}).click();
 await page.getByRole('combobox',{name:'Boss encounter'}).selectOption('warden');
 await page.getByRole('button',{name:'Propose encounter'}).click();
 await page.getByRole('button',{name:'Accept'}).click();
 await expect(page.locator('#boss-wrap')).toBeVisible({timeout:15000});
 await expect(page.locator('#dps-meter')).toBeVisible();
 await expect(page.locator('#boss-label')).toContainText('WARDEN');
 await page.locator('#game').focus();
 await page.keyboard.press(vanishSlot!);
 await expect(second.locator('strong')).toHaveText('Backstab',{timeout:3000});
 await expect(second).toHaveAttribute('title',/110 from rear/);
 await expect(second.locator('strong')).toHaveText('Vanish',{timeout:6500});
 await expect(second.locator('.cooldown-text')).not.toBeEmpty();
 expect(errors).toEqual([]);
});
