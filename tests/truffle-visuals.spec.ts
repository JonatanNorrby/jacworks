import {test,expect} from '@playwright/test';

test('actual encounter renders a double-size boss and procedural mushroom summons',async({page},info)=>{
 const source=await(await page.request.get('/src/truffle.ts')).text();const core=source.match(/from "([^\"]+@babylonjs_core[^\"]*)"/)![1];
 await page.route('**/src/truffle.ts',async route=>{const res=await route.fetch();const body=(await res.text()).replace('container.scaling.setAll(scale);','container.metadata={boss:options.boss,oldScale:Math.min(3.4/size.y,2.5/Math.hypot(size.x,size.z))};container.scaling.setAll(scale);');await route.fulfill({response:res,body});});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 // Observe the real scene; exercise the normal room/vote/summoning path.
 await page.goto('/?room=visual-'+crypto.randomUUID());
 await page.evaluate(async core=>{(window as any).scene=(await import(/* @vite-ignore */core)).EngineStore.LastCreatedScene},core);
 await expect(page.locator('#truffle-status')).toContainText('procedural skeletal walk');
 const hub=await page.evaluate(()=>{const s=(window as any).scene;return s.getTransformNodeByName('truffle-model').scaling.x});
 await page.getByRole('button',{name:'Propose boss',exact:true}).click();await page.locator('#inventory-panel select').selectOption('greenCone');await page.getByRole('button',{name:'Propose encounter',exact:true}).click();await page.getByRole('button',{name:'Accept',exact:true}).click();
 await expect(page.locator('#truffle-boss-status')).toContainText('procedural skeletal walk');
 await expect(page.locator('#boss-label')).toHaveText('TRUFFLE MAN');
 await expect.poll(()=>page.evaluate(()=>(window as any).scene.transformNodes.find((n:any)=>n.name==='truffle-model'&&n.metadata?.boss)?.isEnabled())).toBe(true);
 const scale=await page.evaluate(()=>{const s=(window as any).scene;const models=s.transformNodes.filter((n:any)=>n.name==='truffle-model');return models.map((n:any)=>({enabled:n.isEnabled(),scale:n.scaling.x,oldScale:n.metadata?.oldScale,boss:n.metadata?.boss}))});
 const boss=scale.find((n:any)=>n.boss)!;expect(boss.scale/boss.oldScale).toBeCloseTo(2,8);
 await expect.poll(()=>page.evaluate(()=>(window as any).scene.meshes.filter((m:any)=>m.name.startsWith('mushroom-add-')&&m.name.endsWith('-cap')).length),{timeout:45000}).toBeGreaterThan(0);
 const geometry=await page.evaluate(()=>{const s=(window as any).scene;return {cones:s.meshes.filter((m:any)=>m.name.startsWith('cone-add-')).length,adds:s.meshes.filter((m:any)=>m.name.startsWith('mushroom-add-')&&!m.parent).map((m:any)=>({y:m.position.y,scale:m.scaling.x,children:m.getChildMeshes().map((c:any)=>({name:c.name,vertices:c.getTotalVertices(),color:c.material.diffuseColor.asArray(),scale:c.scaling.asArray()}))}))}});
 expect(geometry.cones).toBe(0);expect(geometry.adds.length).toBeGreaterThan(0);
 for(const a of geometry.adds){expect(a.y).toBe(0);expect(a.scale).toBeCloseTo(1.1/1.91);expect(a.children).toHaveLength(3);expect(a.children.find((c:any)=>c.name.endsWith('-cap'))!.color).toEqual([.48,.22,.08]);expect(a.children.find((c:any)=>c.name.endsWith('-stem'))!.vertices).toBeGreaterThan(100);expect(a.children.find((c:any)=>c.name==='add-health')!.scale[0]).toBeGreaterThan(0);}
 console.log(JSON.stringify({hub,scale,geometry}));await page.screenshot({path:info.outputPath('boss-mushroom-summons.png')});expect(errors).toEqual([]);
});
