import {test,expect} from '@playwright/test';

test('actual rig alternates feet, plants stance and returns to idle',async({page},info)=>{
 const source=await (await page.request.get('/src/truffle.ts')).text();
 const core=source.match(/from "([^"]+@babylonjs_core[^"]*)"/)![1];
 page.on('pageerror',e=>console.log('PAGE_ERROR',e.message));
 await page.route('**/__truffle-walk-test',r=>r.fulfill({contentType:'text/html',body:`<style>body{margin:0}canvas{width:100vw;height:100vh}</style><div id="hub-card"></div><canvas id="view"></canvas><script type="module">
 import {Engine,Scene,ArcRotateCamera,Vector3,HemisphericLight,MeshBuilder} from '${core}';
 import {createTruffle} from '/src/truffle.ts';
 const engine=new Engine(document.querySelector('canvas'),true),scene=new Scene(engine);
 const camera=new ArcRotateCamera('camera',-.9,1.25,4,new Vector3(0,.8,0),scene);new HemisphericLight('light',new Vector3(0,1,0),scene);MeshBuilder.CreateGround('ground',{width:20,height:20},scene);
 const truffle=createTruffle(scene);let state={pos:{x:0,z:0},heading:0,walking:false,stride:0};
 window.rig={scene,set(s){state=s},sample(){scene.render();return Object.fromEntries(['IKLeg.L','IKLeg.R','Leg1.L','Leg2.L','Leg2.L_end','Leg1.R','Leg2.R','Leg2.R_end'].map(name=>{const n=scene.getTransformNodeByName(name);n.computeWorldMatrix(true);return [name,n.getAbsolutePosition().asArray()]}))}};
 engine.runRenderLoop(()=>{truffle.update(state,true);scene.render()});
 </script>`}));
 await page.goto('/__truffle-walk-test');await expect(page.locator('#truffle-status')).toContainText('procedural skeletal walk');
 const samples=[];
 for(const d of [0,.08,.16,.24,.32,.40,.48,.56,.64]){
  await page.evaluate(d=>(window as any).rig.set({pos:{x:0,z:d},heading:0,walking:true,stride:d}),d);
  await page.waitForTimeout(350);samples.push(await page.evaluate(()=>(window as any).rig.sample()));
  if([0,.16,.32,.48].includes(d))await page.screenshot({path:info.outputPath(`walk-${d}.png`)});
 }

 // Left foot remains planted for first half-cycle; right foot is lifted.
 expect(Math.abs(samples[0]['IKLeg.L'][2]-samples[3]['IKLeg.L'][2])).toBeLessThan(.012);
 expect(samples[2]['IKLeg.R'][1]-samples[0]['IKLeg.R'][1]).toBeGreaterThan(.09);
 expect(samples[6]['IKLeg.L'][1]-samples[4]['IKLeg.L'][1]).toBeGreaterThan(.09);
 // Deforming shin endpoint follows the separately rigged foot, not just its control.
 for(const sample of samples)for(const side of ['L','R']){
  const delta=sample['Leg2.'+side+'_end'].map((v:number,i:number)=>v-sample['IKLeg.'+side][i]);
  expect(Math.hypot(...delta)).toBeLessThan(.006);
 }
 await page.evaluate(()=>(window as any).rig.set({pos:{x:0,z:.64},heading:0,walking:false,stride:.64}));await page.waitForTimeout(200);
 const idle=await page.evaluate(()=>(window as any).rig.sample());await page.waitForTimeout(300);
 expect(await page.evaluate(()=>(window as any).rig.sample())).toEqual(idle);
});

