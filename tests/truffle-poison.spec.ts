import {test,expect} from '@playwright/test';

test('live poison countdown, reconnect and cloud share authoritative deadlines',async({browser,baseURL},info)=>{
 const a=await browser.newPage(),b=await browser.newPage();const url=baseURL+'/?room=poison-'+crypto.randomUUID();
 const observe=()=>{const Native=window.WebSocket;window.WebSocket=class extends Native{constructor(url:string|URL,protocols?:string|string[]){super(url,protocols);(window as any).socket=this;this.addEventListener('message',e=>{const p=JSON.parse(e.data);if(p.type==='snapshot')(window as any).last=p;if(p.type==='welcome')(window as any).selfId=p.id;});}};};
 try{
  await a.addInitScript(observe);await b.addInitScript(observe);await Promise.all([a.goto(url),b.goto(url)]);await expect(a.locator('#room-panel')).toContainText('Connected \u00b7 2 players');
  await a.getByRole('button',{name:'Propose boss',exact:true}).click();await a.locator('#inventory-panel select').selectOption('greenCone');await a.getByRole('button',{name:'Propose encounter',exact:true}).click();await a.getByRole('button',{name:'Accept',exact:true}).click();await b.getByRole('button',{name:'Accept',exact:true}).click();
  await expect(a.locator('#poison-status')).toContainText('POISON in',{timeout:20000});
  const mark=await a.evaluate(()=>(window as any).last.poisonMark);await expect(b.locator('#poison-status')).toContainText('POISON in');
  // Reconnect the unmarked browser during the countdown, retaining the marked player.
  const reconnect=await a.evaluate(()=>(window as any).selfId)===mark.playerId?b:a;
  const previousId=await reconnect.evaluate(()=>(window as any).selfId);await reconnect.evaluate(()=>(window as any).socket.close());await expect.poll(()=>reconnect.evaluate(()=>(window as any).selfId),{timeout:15000}).not.toBe(previousId);await expect(reconnect.locator('#room-panel')).toContainText('Connected \u00b7 2 players');
  await expect.poll(()=>reconnect.evaluate(()=>(window as any).last.poisonMark)).toEqual(mark);
  await expect.poll(()=>a.evaluate(()=>(window as any).last.poisonClouds.length),{timeout:10000}).toBe(1);
  const clouds=await a.evaluate(()=>(window as any).last.poisonClouds);await expect.poll(()=>b.evaluate(()=>(window as any).last.poisonClouds)).toEqual(clouds);
  await expect(a.locator('#poison-status')).toContainText('avoid green cloud');await a.screenshot({path:info.outputPath('live-active-cloud.png')});
  await a.keyboard.press('h');await expect(a.locator('#poison-status')).toBeHidden();await expect(b.locator('#poison-status')).toBeHidden();
 }finally{await a.close();await b.close();}
});

test('poison visuals show radius, track mark, switch grace to damage and clean up expiry',async({page},info)=>{
 const source=await(await page.request.get('/src/truffle.ts')).text(),core=source.match(/from "([^\"]+@babylonjs_core[^\"]*)"/)![1];
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/__poison',r=>r.fulfill({contentType:'text/html',body:`<style>body{margin:0}canvas{width:100vw;height:100vh}</style><canvas></canvas><script type="module">
 import {Engine,Scene,ArcRotateCamera,Vector3,HemisphericLight,MeshBuilder} from '${core}';import {createTrufflePoisonVisuals} from '/src/truffle-poison.ts';
 const engine=new Engine(document.querySelector('canvas'),true),scene=new Scene(engine);new ArcRotateCamera('camera',.9,.8,15,new Vector3(0,0,0),scene);new HemisphericLight('light',new Vector3(0,1,0),scene);MeshBuilder.CreateGround('floor',{width:24,height:24},scene);MeshBuilder.CreateCapsule('player',{height:1.6,radius:.45},scene).position.set(0,.8,0);
 const v=createTrufflePoisonVisuals(scene);let now=1000;const state={boss:{id:'greenCone'},phase:'fight',players:[{id:'a',name:'Alice',alive:true,pos:{x:0,z:0}}],poisonMark:{playerId:'a',markedAt:1000,detonatesAt:6000},poisonClouds:[]};
 window.fixture={scene,state,set(t){now=t},sample(){return scene.meshes.filter(m=>m.name.startsWith('poison-')).map(m=>({name:m.name,pos:m.position.asArray(),material:m.material?.name,width:m.getBoundingInfo().boundingBox.extendSize.x*2}));}};engine.runRenderLoop(()=>{v.sync(state,true,'a',now);scene.render()});</script>`}));
 await page.goto('/__poison');await expect(page.locator('#poison-status')).toContainText('5.0s');await page.screenshot({path:info.outputPath('poison-mark.png')});
 await page.evaluate(()=>{const f=(window as any).fixture;f.state.players[0].pos={x:4,z:1};f.set(5000);});await expect(page.locator('#poison-status')).toContainText('1.0s');
 expect((await page.evaluate(()=>(window as any).fixture.sample())).find((m:any)=>m.name==='poison-mark').pos).toEqual([4,.12,1]);
 await page.evaluate(()=>{const f=(window as any).fixture;f.state.poisonMark=undefined;f.state.poisonClouds=[{id:'test',pos:{x:4,z:1},spawnedAt:6000,activeAt:7500,expiresAt:16000,radius:2.5,nextTickAt:7500}];f.set(6000);});
 await expect(page.locator('#poison-status')).toContainText('Damage in 1.5s');let cloud=(await page.evaluate(()=>(window as any).fixture.sample())).find((m:any)=>m.name==='poison-cloud-test');expect(cloud.material).toBe('poison-grace');expect(cloud.width).toBeCloseTo(5);await page.screenshot({path:info.outputPath('poison-grace.png')});
 await page.evaluate(()=>(window as any).fixture.set(7500));await expect(page.locator('#poison-status')).toContainText('avoid green cloud');cloud=(await page.evaluate(()=>(window as any).fixture.sample())).find((m:any)=>m.name==='poison-cloud-test');expect(cloud.material).toBe('poison-active');await page.screenshot({path:info.outputPath('poison-active.png')});
 await page.evaluate(()=>(window as any).fixture.set(16000));await expect(page.locator('#poison-status')).toBeHidden();expect(await page.evaluate(()=>(window as any).fixture.sample())).toEqual([]);expect(errors).toEqual([]);
});
