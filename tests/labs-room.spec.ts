import {test,expect} from '@playwright/test';

test('Labs restores hub after a live-room fight starts and is reset by another player',async({browser,baseURL},info)=>{
 const a=await browser.newContext(),b=await browser.newContext();
 try{
 const p=await a.newPage(),q=await b.newPage(),room=crypto.randomUUID();
 await Promise.all([p.goto(baseURL+'/?room='+room),q.goto(baseURL+'/?room='+room)]);
 await expect(p.locator('#room-panel')).toContainText('Connected · 2 players');
 const id=await p.locator('#room-roster p').filter({hasText:'(you)'}).getAttribute('data-player-id');
 await p.getByRole('button',{name:'Game Dev',exact:true}).click();await p.locator('[data-dev-view="characters"]').click();await p.locator('#dev-entity').selectOption('boss:greenCone');
 await expect(p.locator('#truffle-lab-status')).toContainText('procedural skeletal walk');
 await q.getByRole('button',{name:'Propose boss',exact:true}).click();await q.locator('#inventory-panel select').selectOption('greenCone');await q.getByRole('button',{name:'Propose encounter',exact:true}).click();
 await p.getByRole('button',{name:'Accept',exact:true}).click();await expect(q.locator('#encounter-vote')).toContainText('1 / 2 accepted');await q.getByRole('button',{name:'Accept',exact:true}).click();
 await expect(q.locator('#boss-label')).toHaveText('TRUFFLE MAN');await expect(q.locator('#hub-card')).toBeHidden();
 await q.keyboard.press('h');await expect(q.locator('#hub-card')).toBeVisible();await expect(p.locator('#game-dev-labs')).toBeVisible();
 await p.locator('[data-dev-action="close"]').click();await expect(p.locator('#hub-card')).toBeVisible();await expect(p.locator('#room-panel')).toContainText('Connected · 2 players');
 await expect(p.locator('#room-roster p').filter({hasText:'(you)'})).toHaveAttribute('data-player-id',id!);
 await expect(p.locator('#truffle-status')).toContainText('procedural skeletal walk');await p.screenshot({path:info.outputPath('restored-live-hub.png')});
 }finally{await a.close();await b.close()}
});
