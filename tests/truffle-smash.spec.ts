import {test,expect} from '@playwright/test';
test('real Truffle rig winds up, slams with arms and legs, recovers without root bounce',async({page},info)=>{
 const source=await(await page.request.get('/src/truffle.ts')).text();const core=source.match(/from "([^\"]+@babylonjs_core[^\"]*)"/)![1];
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/__smash',r=>r.fulfill({contentType:'text/html',body:`<canvas style="width:100vw;height:100vh"></canvas><script type="module">
 import {Engine,Scene,ArcRotateCamera,Vector3,HemisphericLight,MeshBuilder} from '${core}';import {createTruffle} from '/src/truffle.ts';
 const engine=new Engine(document.querySelector('canvas'),true),scene=new Scene(engine);new ArcRotateCamera('camera',-.9,1.2,6,new Vector3(0,1.3,0),scene);new HemisphericLight('light',new Vector3(0,1,0),scene);MeshBuilder.CreateGround('floor',{width:20,height:20},scene);
 const model=createTruffle(scene,{boss:true});let now=0,smash;window.rig={set(t){now=t;smash={startedAt:100,impactAt:1600,recoverAt:2250,impacted:t>=1600}},sample(){scene.render();return Object.fromEntries(['Sprine01','Arm1.L','Arm2.L','IKHand.L','Leg1.L','Leg2.L','IKLeg.L'].map(name=>{const n=scene.getTransformNodeByName(name);n.computeWorldMatrix(true);return [name,{q:n.rotationQuaternion.asArray(),p:n.getAbsolutePosition().asArray()}]}))}};
 engine.runRenderLoop(()=>{model.update({pos:{x:0,z:0},heading:0,stride:0,walking:false},true,smash,now);scene.render()});</script>`}));
 await page.goto('/__smash');await expect(page.locator('#truffle-boss-status')).toContainText('procedural skeletal walk',{timeout:30000});
 const samples:any[]=[];
 for(const t of [0,1150,1600,1900,2250]){await page.evaluate(t=>(window as any).rig.set(t),t);await page.waitForTimeout(100);samples.push(await page.evaluate(()=>(window as any).rig.sample()));await page.screenshot({path:info.outputPath(`smash-${t}.png`)});}
 for(const bone of ['Arm1.L','Arm2.L','Leg1.L','Leg2.L'])expect(samples[1][bone].q).not.toEqual(samples[0][bone].q);
 expect(samples[1]['IKHand.L'].p[1]).toBeGreaterThan(samples[2]['IKHand.L'].p[1]+.5);
 expect(Math.abs(samples[2]['IKLeg.L'].p[1]-samples[0]['IKLeg.L'].p[1])).toBeLessThan(.01);
 for(const bone of Object.keys(samples[0]))for(let i=0;i<3;i++)expect(samples[4][bone].p[i]).toBeCloseTo(samples[0][bone].p[i],4);
 expect(errors).toEqual([]);
});

test('Truffle encounter selection, Guide cleanup and late browser join',async({browser,baseURL},info)=>{
 const a=await browser.newPage(),b=await browser.newPage();const url=baseURL+'/?room=smash-'+crypto.randomUUID();
 try{
  await a.goto(url);await expect(a.locator('#room-panel')).toContainText('Connected');
  await expect(a.locator('#hub-card')).not.toContainText('procedural skeletal walk');
  await a.getByRole('button',{name:'Propose boss',exact:true}).click();
  await expect(a.locator('#inventory-panel select option[value="greenCone"]')).toHaveText('Truffle Man');
  await a.locator('#inventory-panel select').selectOption('greenCone');await a.getByRole('button',{name:'Propose encounter',exact:true}).click();
  await expect(a.locator('#encounter-vote')).toContainText('Truffle Man');await a.getByRole('button',{name:'Accept',exact:true}).click();
  await expect(a.locator('#boss-label')).toHaveText('TRUFFLE MAN');await expect(a.locator('#truffle-boss-status')).toContainText('procedural skeletal walk');
  await b.goto(url);await expect(b.locator('#boss-label')).toHaveText('TRUFFLE MAN');await expect(b.locator('#truffle-boss-status')).toContainText('procedural skeletal walk');
  await a.screenshot({path:info.outputPath('truffle-encounter.png')});
 }finally{await a.close();await b.close()}
});
