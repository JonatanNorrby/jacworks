import {test,expect} from '@playwright/test';

test('v0.1.6: every class has a genuinely branched, arrow-linked talent graph',async({page,baseURL})=>{
 test.setTimeout(120000);
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto(baseURL+'/?room=talents016'+crypto.randomUUID().replaceAll('-','').slice(0,16));
 await expect(page.locator('#room-panel')).toContainText('Connected',{timeout:30000});
 await page.getByRole('button',{name:'Talent Tree'}).click();
 const tree=page.locator('#talent-tree-panel');
 await expect(tree).toBeVisible();
 const classes=['Shaman','Defender','Rogue','Warrior','Priest','Lightning Mage','Ranger','Fire Mage'];
 for(const name of classes){
   await tree.locator('.talent-class-tabs').getByRole('button',{name,exact:true}).click();
   await expect(tree.locator('.talent-tree-graph')).toBeVisible();
   await expect(tree.locator('.talent-branch')).toHaveCount(2);
   await expect(tree.locator('.talent-vertical-link')).toHaveCount(6);
   await expect(tree.locator('.talent-node')).toHaveCount(9);
   await expect(tree.locator('.talent-tree-root .talent-node')).toContainText('Unyielding Force');
   await expect(tree.locator('.talent-node').first()).toContainText('Rank 0 / 1');
   await expect(tree.locator('.talent-node.available')).toHaveCount(1);
   await expect(tree.locator('.talent-node.locked')).toHaveCount(8);
 }
 const edges=await tree.evaluate(element=>{
   const root=element.querySelector('.talent-tree-root')!;
   const branches=element.querySelector('.talent-branches')!;
   const vertical=element.querySelector('.talent-vertical-link')!;
   return {
     root:getComputedStyle(root,'::after').borderLeftWidth,
     fork:getComputedStyle(branches,'::before').borderTopWidth,
     child:getComputedStyle(vertical).borderLeftWidth,
     arrow:getComputedStyle(vertical,'::after').content
   };
 });
 expect(edges.root).not.toBe('0px');expect(edges.fork).not.toBe('0px');
 expect(edges.child).not.toBe('0px');expect(edges.arrow).toContain('▼');
 await tree.getByRole('button',{name:'Close talent tree'}).click();
 expect(errors).toEqual([]);
});
