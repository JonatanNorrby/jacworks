import {test,expect} from '@playwright/test';
test('imported Mushroom and Rune Golem bodies stay centered on their actor anchors; Golem leaves its T-pose',async({page,baseURL})=>{
 test.setTimeout(120000);
 const errors:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(baseURL+'/?room=vis025'+crypto.randomUUID().slice(0,10));
 await expect(page.locator('#room-panel')).toContainText('Connected',{timeout:30000});
 const source=await(await page.request.get('/src/truffle.ts')).text();
 const core=source.match(/from "([^"]+@babylonjs_core[^"]*)"/)![1];
 await page.evaluate(async path=>{(window as any).scene=(await import(/* @vite-ignore */path)).EngineStore.LastCreatedScene},core);
 await page.getByRole('button',{name:'Game Dev',exact:true}).click();
 await page.locator('[data-dev-view="characters"]').click();
 for(const [entity,name,height] of [['enemy:cone-add','dev-entity-mushroom',1.28],['boss:fracturer','dev-entity-fracturer',3]] as const){
   await page.locator('#dev-entity').selectOption(entity);
   await expect.poll(()=>page.evaluate(n=>(window as any).scene.getMeshByName(n)?.metadata?.modelReady===true,name),{timeout:30000}).toBe(true);
   const body=await page.evaluate(n=>{
     const root=(window as any).scene.getMeshByName(n);
     const kids=root.getChildMeshes(false).filter((m:any)=>m.getTotalVertices()>0&&!m.name.includes('placeholder'));
     const model=kids.sort((a:any,b:any)=>b.getTotalVertices()-a.getTotalVertices())[0];
     model.computeWorldMatrix(true);
     const b=model.getBoundingInfo().boundingBox,anchor=root.getAbsolutePosition();
     const vertices=model.getVerticesData('position');
     let maxAbsX=0;for(let i=0;i<vertices.length;i+=3)maxAbsX=Math.max(maxAbsX,Math.abs(vertices[i]));
     return {dx:b.centerWorld.x-anchor.x,dz:b.centerWorld.z-anchor.z,minY:b.minimumWorld.y-anchor.y,height:b.maximumWorld.y-b.minimumWorld.y,maxAbsX,meshName:model.name};
   },name);
   expect(Math.abs(body.dx),entity).toBeLessThan(.25);
   expect(Math.abs(body.dz),entity).toBeLessThan(.25);
   expect(body.minY,entity).toBeGreaterThan(-.12);
   expect(body.minY,entity).toBeLessThan(.13);
   expect(body.height,entity).toBeGreaterThan(height*.9);
   expect(body.height,entity).toBeLessThan(height*1.12);
   if(entity==='boss:fracturer')expect(body.maxAbsX,'arms must be lowered').toBeLessThan(48);
 }
 const crystals=await page.evaluate(()=>{const s=(window as any).scene;return s.meshes.filter((m:any)=>m.name.startsWith('fracture-crystal-')).length;});
 expect(crystals).toBe(132);
 expect(errors).toEqual([]);
});
