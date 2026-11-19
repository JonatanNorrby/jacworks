import {test,expect} from '@playwright/test';
const saved={wins:['warden','yellowBall'],picks:{ranger:['unyieldingForce'],lightningMage:['unyieldingForce']}};
test('profile survives welcome snapshots before a slow first join, and class switch persists',async({page,baseURL})=>{
 test.setTimeout(120000);
 const snapshots:any[]=[];
 page.on('websocket',ws=>ws.on('framereceived',f=>{try{const p=JSON.parse(String(f.payload));if(p.type==='snapshot')snapshots.push(p)}catch{}}));
 await page.addInitScript(data=>{
   localStorage.setItem('jacworks-class-v1','ranger');
   localStorage.setItem('jacworks-talent-progress-v1',JSON.stringify(data));
   const Native=window.WebSocket;
   class SlowJoin extends Native {
     send(payload:any){if(typeof payload==='string'&&payload.includes('"type":"join"')){window.setTimeout(()=>super.send(payload),700)}else super.send(payload)}
   }
   (window as any).WebSocket=SlowJoin;
 },saved);
 await page.goto(baseURL+'/?room=profilefix'+crypto.randomUUID().slice(0,10));
 await expect(page.locator('#room-panel')).toContainText('Connected',{timeout:30000});
 await expect.poll(()=>snapshots.length).toBeGreaterThan(3);
 expect(snapshots.slice(0,4).some(s=>s.players.some((p:any)=>p.classId==='lightningMage'&&p.profileLoaded===false))).toBe(true);
 const preJoinSave=await page.evaluate(()=>JSON.parse(localStorage.getItem('jacworks-talent-progress-v1')??'null'));
 expect(preJoinSave.wins).toEqual(saved.wins);
 expect(preJoinSave.picks.ranger).toEqual(saved.picks.ranger);
 await expect.poll(()=>snapshots.some(s=>s.players.some((p:any)=>p.id&&p.classId==='ranger')),{timeout:8000}).toBe(true);
 const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('jacworks-talent-progress-v1')??'null'));
 expect(after.wins).toEqual(saved.wins);
 expect(after.picks.ranger).toEqual(saved.picks.ranger);
 await page.getByRole('button',{name:'Choose class'}).click();
 await page.getByRole('combobox',{name:'Class'}).selectOption('shaman');
 await page.getByRole('button',{name:'Save loadout'}).click();
 await expect.poll(()=>snapshots.some(s=>s.players.some((p:any)=>p.classId==='shaman')),{timeout:9000}).toBe(true);
 await expect.poll(()=>page.evaluate(()=>localStorage.getItem('jacworks-class-v1'))).toBe('shaman');
 await page.reload();
 await expect.poll(()=>snapshots.at(-1)?.players.some((p:any)=>p.classId==='shaman'),{timeout:10000}).toBe(true);
 const persisted=await page.evaluate(()=>JSON.parse(localStorage.getItem('jacworks-talent-progress-v1')??'null'));
 expect(persisted.wins).toEqual(saved.wins);
});
