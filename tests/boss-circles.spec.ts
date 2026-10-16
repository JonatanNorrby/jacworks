import {test,expect} from '@playwright/test';
import {BOSS_PEDESTALS} from '../shared/boss-layout';
test('walk to every difficulty pedestal, select its exact boss, and vote with another human',async({browser,baseURL},info)=>{
 test.setTimeout(180000);
 const a=await browser.newContext({viewport:{width:1440,height:1000}}),b=await browser.newContext();
 try{
 const p=await a.newPage(),q=await b.newPage();const errors:string[]=[];p.on('pageerror',e=>errors.push(e.message));q.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>localStorage.setItem('jacworks-name','Walker'));
 const url=baseURL+'/?room=circles-'+crypto.randomUUID();await p.goto(url);await q.goto(url);
 for(const page of [p,q])await expect(page.locator('#room-panel')).toContainText('Connected · 2 players');
 await p.screenshot({path:info.outputPath('difficulty-circles.png')});
 const player=p.locator('#room-roster p').filter({hasText:'Walker'});
 async function walk(x:number,z:number){
  for(const [axis,target,positive,negative] of [['z',z,'w','s'],['x',x,'d','a']] as const){
   for(let i=0;i<18;i++){const delta=target-Number(await player.getAttribute('data-'+axis));if(Math.abs(delta)<.35)break;const key=delta>0?positive:negative;await p.keyboard.down(key);await p.waitForTimeout(Math.min(700,Math.max(45,Math.abs(delta)/5.4*1000-25)));await p.keyboard.up(key);await p.waitForTimeout(130);}
   expect(Math.abs(target-Number(await player.getAttribute('data-'+axis)))).toBeLessThan(.6);
  }
 }
 // Travel up the open central aisle before crossing the north lawn.
 await walk(0,-6.5);
 for(const pedestal of BOSS_PEDESTALS){
  await walk(pedestal.pos.x,pedestal.pos.z);await expect(p.locator('#status')).toContainText(pedestal.difficulty+' · '+pedestal.name);
  await p.keyboard.press('e');const select=p.getByLabel('Boss encounter');await expect(select).toHaveValue(pedestal.id);await expect(select.locator('option')).toHaveCount(1);
  await p.getByRole('button',{name:'Propose encounter',exact:true}).click();for(const page of [p,q])await expect(page.locator('#encounter-vote h2')).toHaveText('Start '+pedestal.name+'?');
  await p.getByRole('button',{name:'Accept',exact:true}).click();await expect(q.locator('#encounter-vote')).toContainText('1 / 2 accepted');await q.getByRole('button',{name:'Decline',exact:true}).click();await expect(p.locator('#encounter-vote')).toBeHidden();
 }
 for(const station of [{x:5.5,z:-2.5,title:'Wardrobe'},{x:4.3,z:3.5,title:'Crafter'}]){
  await walk(station.x,station.z);await p.keyboard.press('e');await expect(p.locator('#inventory-panel h2')).toHaveText(station.title);await p.locator('#inventory-panel').getByRole('button',{name:'Close',exact:true}).click();
 }
 await walk(-4.3,3.5);await p.keyboard.press('e');await expect(p.getByRole('region',{name:'Skill Trainer'})).toBeVisible();await p.locator('#close-skills').click();
 // The global accessible picker contains the same complete, difficulty-grouped catalog.
 await p.getByRole('button',{name:'Propose boss',exact:true}).click();const select=p.getByLabel('Boss encounter');await expect(select.locator('optgroup')).toHaveCount(2);await expect(select.locator('option')).toHaveCount(5);await select.selectOption('hardYellowBall');await p.getByRole('button',{name:'Propose encounter',exact:true}).click();for(const page of [p,q])await page.getByRole('button',{name:'Accept',exact:true}).click();for(const page of [p,q])await expect(page.locator('#boss-label')).toContainText('HARD YELLOW BALL');
 expect(errors).toEqual([]);
 }finally{await a.close();await b.close();}
});
