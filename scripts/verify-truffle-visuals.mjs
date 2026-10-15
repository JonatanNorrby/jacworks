import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
const url=process.env.VISUAL_URL??'http://localhost:5173';
const browser=await chromium.launch({args:['--use-angle=swiftshader']});const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
// Add a read-only scene handle to the served bundle; rendering and network traffic are unchanged.
await page.route('**/assets/index-*.js',async route=>{const res=await route.fetch();let body=await res.text();const fn=body.match(/function (\w+)\(\w+,\w+=\{\}\)\{.{0,150}new \w+\("truffle-man"/);if(fn){const call=body.match(new RegExp('const \\w+='+fn[1]+'\\((\\w+)\\),'));assert(call,'scene call');body+=';window.__scene='+call[1]+';';}await route.fulfill({response:res,body});});
try{
 await page.goto(url+'/?room=visual-qa-'+Date.now());await page.locator('#room-panel').filter({hasText:'Connected'}).waitFor();await page.waitForFunction(()=>document.querySelector('#truffle-status')?.textContent.includes('procedural skeletal walk'));
 await page.screenshot({path:'test-results/live-hub.png'});
 await page.getByRole('button',{name:'Propose boss',exact:true}).click();await page.locator('#inventory-panel select').selectOption('greenCone');await page.getByRole('button',{name:'Propose encounter',exact:true}).click();await page.getByRole('button',{name:'Accept',exact:true}).click();
 await page.waitForFunction(()=>window.__scene?.meshes.some(m=>m.name.startsWith('mushroom-add-')&&m.name.endsWith('-cap')),{},{timeout:60000});
 const geometry=await page.evaluate(()=>{const s=window.__scene;return {models:s.transformNodes.filter(n=>n.name==='truffle-model').map(n=>({enabled:n.isEnabled(),scale:n.scaling.x})),mushrooms:s.meshes.filter(m=>m.name.startsWith('mushroom-add-')&&!m.parent).map(m=>({pos:m.position.asArray(),scale:m.scaling.asArray(),parts:m.getChildMeshes().map(c=>({name:c.name,vertices:c.getTotalVertices(),color:c.material.diffuseColor.asArray()}))})),cones:s.meshes.filter(m=>m.name.startsWith('cone-add-')).length}});
 assert.equal(geometry.cones,0);assert(geometry.mushrooms.length>0);for(const m of geometry.mushrooms){assert.equal(m.parts.length,3);assert(m.parts.some(p=>p.name.endsWith('-stem')));assert(m.parts.some(p=>p.name.endsWith('-cap')))}
 assert.equal(geometry.models.filter(m=>m.enabled).length,1);
 await page.screenshot({path:'test-results/live-boss-adds.png'});assert.deepEqual(errors,[]);console.log(JSON.stringify({url,geometry,errors}));
 await page.getByRole('button',{name:'Options',exact:true}).click();await page.getByRole('button',{name:'Credits',exact:true}).click();const text=await page.getByRole('dialog',{name:'Credits / Licenses'}).innerText();assert(text.includes('dotflare'));assert(text.includes('BABAGANOOSH99'));await page.screenshot({path:'test-results/live-credits.png'});
}finally{await browser.close()}
