import {test,expect} from '@playwright/test';
test('Truffle model, shared patrol, late join and failed-load fallback',async({browser,baseURL},info)=>{
 const a=await browser.newContext(),b=await browser.newContext(),c=await browser.newContext();
 try{
 const p=await a.newPage(),q=await b.newPage(),r=await c.newPage();const errors:string[]=[];p.on('pageerror',e=>errors.push(e.message));
 const url=baseURL+'/?room=truffle-'+crypto.randomUUID();await p.goto(url);
 await expect(p.locator('#truffle-status')).toContainText(/procedural skeletal walk|procedural placeholder/);
 const status=p.locator('#truffle-status');const x=await status.getAttribute('data-x');await expect.poll(()=>status.getAttribute('data-x')).not.toBe(x);
 await q.goto(url);await expect(q.locator('#room-panel')).toContainText('2 players');
 await expect.poll(async()=>Math.abs(Number(await status.getAttribute('data-x'))-Number(await q.locator('#truffle-status').getAttribute('data-x')))).toBeLessThan(.15);
 await expect(q.locator('#truffle-status')).toContainText(/procedural skeletal walk|procedural placeholder/);
 await p.screenshot({path:info.outputPath('truffle-local-model.png')});
 await r.route('**/__local-assets/truffle.glb',route=>route.abort());await r.goto(url);
 await expect(r.locator('#truffle-status')).toContainText(/model unavailable|procedural placeholder/);assertNoErrors();
 function assertNoErrors(){expect(errors).toEqual([]);}
 }finally{await a.close();await b.close();await c.close();}
});
