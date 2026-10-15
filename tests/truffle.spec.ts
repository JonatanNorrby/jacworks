import {test,expect} from '@playwright/test';
test('Truffle model, shared patrol, late join and failed-load fallback',async({browser,baseURL},info)=>{
 const a=await browser.newContext(),b=await browser.newContext(),c=await browser.newContext();
 try{
 const p=await a.newPage(),q=await b.newPage(),r=await c.newPage();const errors:string[]=[];p.on('pageerror',e=>errors.push(e.message));
 const url=baseURL+'/?room=truffle-'+crypto.randomUUID();const modelResponse=p.waitForResponse(r=>r.url().endsWith('/assets/truffle-man/truffle.glb'));await p.goto(url);
 const response=await modelResponse;expect(response.status()).toBe(200);expect((await response.body()).subarray(0,4).toString()).toBe('glTF');
 await expect(p.locator('#truffle-status')).toContainText('procedural skeletal walk',{timeout:30000});
 const status=p.locator('#truffle-status');
 await expect(status).toHaveAttribute('data-rig','skeletal');
 const foot=await status.getAttribute('data-left-foot-y');await expect.poll(()=>status.getAttribute('data-left-foot-y')).not.toBe(foot);const x=await status.getAttribute('data-x');await expect.poll(()=>status.getAttribute('data-x')).not.toBe(x);
 await q.goto(url);await expect(q.locator('#room-panel')).toContainText('2 players');
 await expect.poll(async()=>Math.abs(Number(await status.getAttribute('data-x'))-Number(await q.locator('#truffle-status').getAttribute('data-x')))).toBeLessThan(.15);
 await expect(q.locator('#truffle-status')).toContainText('procedural skeletal walk',{timeout:30000});
 await p.screenshot({path:info.outputPath('truffle-public-model.png')});
 await r.route('**/assets/truffle-man/truffle.glb',route=>route.abort());await r.goto(url);
 await expect(r.locator('#truffle-status')).toContainText(/model unavailable|procedural placeholder/);assertNoErrors();
 function assertNoErrors(){expect(errors).toEqual([]);}
 }finally{await a.close();await b.close();await c.close();}
});

test('invalid successful response retains a usable fallback',async({page,baseURL})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/assets/truffle-man/truffle.glb',route=>route.fulfill({status:200,contentType:'text/html',body:'<html>not a GLB</html>'}));
 await page.goto(baseURL!);
 await expect(page.locator('#truffle-status')).toContainText('model unavailable - procedural placeholder',{timeout:20000});
 await expect(page.locator('#room-panel')).toContainText('Connected');
 expect(errors).toEqual([]);
});
