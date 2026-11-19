import {test,expect} from '@playwright/test';
import {NETWORK_VERSION} from '../shared/protocol';
import {CHAOS_IMMOBILE_BOSSES,CHAOS_BASE_BOSSES} from '../shared/chaos';

type Position={x:number;z:number};
type Observation={
 phase:string;
 champions:Record<string,Position>;
 telegraphSources:string[];
};
test('v0.1.14: Warden and Queen remain stationary while Fracturer creeps while their real mechanics enter live snapshots',async({page,baseURL})=>{
 test.setTimeout(120000);
 const errors:string[]=[];
 page.on('pageerror',err=>errors.push(err.message));
 const observations:Observation[]=[];
 page.on('websocket',socket=>socket.on('framereceived',frame=>{
  try{
   const packet=JSON.parse(String(frame.payload));
   if(packet.type!=='snapshot'||packet.boss?.id!=='chaosArena')return;
   const champions=Object.fromEntries(packet.adds.filter((a:{kind?:string})=>a.kind==='chaosBoss')
     .map((a:{bossId:string;pos:Position})=>[a.bossId,a.pos]));
   observations.push({
    phase:packet.phase,champions,
    telegraphSources:packet.telegraphs.map((t:{sourceBossId?:string})=>t.sourceBossId).filter(Boolean)
   });
  }catch{}
 }));
 await page.addInitScript(()=>localStorage.setItem('jacworks-class-v1','warrior'));
 await page.goto(baseURL+'/?room=chaos023'+crypto.randomUUID().replaceAll('-').slice(0,12));
 await expect(page.locator('#room-panel')).toContainText('Connected',{timeout:30000});
 await page.locator('#options-button').click();
 await expect(page.locator('#game-version')).toContainText('Server '+NETWORK_VERSION);
 await page.locator('#options-panel').getByRole('button',{name:'Close'}).click();
 await page.getByRole('button',{name:'Propose boss'}).click();
 await page.getByRole('combobox',{name:'Boss encounter'}).selectOption('chaosArena');
 await page.getByRole('button',{name:'Propose encounter'}).click();
 await page.getByRole('button',{name:'Accept'}).click();
 await expect(page.locator('#boss-label')).toContainText('CHAOS ARENA',{timeout:15000});
 await expect.poll(()=>observations.some(o=>Object.keys(o.champions).length===5),{timeout:8000}).toBeTruthy();
 await expect.poll(()=>observations.some(o=>o.telegraphSources.includes('warden')),{timeout:9500}).toBeTruthy();
 await expect.poll(()=>observations.some(o=>o.telegraphSources.includes('fracturer')),{timeout:9000}).toBeTruthy();
 const full=observations.filter(o=>o.phase==='fight'&&Object.keys(o.champions).length===5);
 expect(full.length).toBeGreaterThan(3);
 for(const id of CHAOS_IMMOBILE_BOSSES){
  const initial=CHAOS_BASE_BOSSES.find(b=>b.id===id)!.pos;
  expect(full.every(o=>o.champions[id].x===initial.x&&o.champions[id].z===initial.z),id+' must never wander').toBeTruthy();
 }
 const first=full[0].champions.greenCone;
 expect(full.some(o=>Math.hypot(o.champions.greenCone.x-first.x,o.champions.greenCone.z-first.z)>.1),'Truffle actually moves').toBeTruthy();
 await expect(page.locator('#duo-health .duo-health-row')).toHaveCount(5);
 expect(errors).toEqual([]);
});
