import { ArcRotateCamera, Color3, Color4, Engine, HemisphericLight, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";
import type { ServerMessage, Snapshot, Telegraph } from "../../shared/protocol";

const canvas=document.querySelector<HTMLCanvasElement>("#game")!, engine=new Engine(canvas,true), scene=new Scene(engine);
scene.clearColor=new Color4(.035,.045,.07,1);
const camera=new ArcRotateCamera("camera",-Math.PI/2,1.05,25,new Vector3(0,0,0),scene); camera.attachControl(canvas,true); camera.inputs.clear();
new HemisphericLight("light",new Vector3(.2,1,.1),scene).intensity=1.2;
const ground=MeshBuilder.CreateGround("arena",{width:26,height:26},scene), gm=new StandardMaterial("ground",scene);gm.diffuseColor=new Color3(.09,.12,.16);ground.material=gm;
const bossMesh=MeshBuilder.CreateCylinder("boss",{diameter:2.4,height:2.8},scene), bm=new StandardMaterial("bossmat",scene);bm.diffuseColor=new Color3(.55,.08,.1);bossMesh.material=bm;bossMesh.position.y=1.4;
const playerMeshes=new Map<string,Mesh>(), telegraphMeshes=new Map<string,Mesh>(); let myId="", snapshot:Snapshot|undefined, seq=0;
const status=document.querySelector("#status")!, message=document.querySelector("#message")!, fill=document.querySelector<HTMLElement>("#boss-fill")!;
const wsProto=location.protocol==="https:"?"wss":"ws", wsHost=location.hostname||"localhost", ws=new WebSocket(`${wsProto}://${wsHost}:8787`);
ws.onopen=()=>{status.textContent="Connected";ws.send(JSON.stringify({type:"join",name:`Player-${Math.floor(Math.random()*999)}`}))};
ws.onclose=()=>status.textContent="Disconnected";
ws.onmessage=e=>{const m=JSON.parse(e.data) as ServerMessage;if(m.type==="welcome")myId=m.id;if(m.type==="event"){message.textContent=m.text;setTimeout(()=>{if(message.textContent===m.text)message.textContent=""},1800)}if(m.type==="snapshot"){snapshot=m;fill.style.width=`${m.boss.hp/m.boss.maxHp*100}%`;status.textContent=`${m.phase.toUpperCase()} · ${m.players.length} player(s) · ready ${m.readyCount}/${m.players.length}`;sync(m)}};
const mat=(name:string,c:Color3)=>{const m=new StandardMaterial(name,scene);m.diffuseColor=c;return m};
const meMat=mat("me",new Color3(.15,.65,1)),otherMat=mat("other",new Color3(.25,.85,.45)),deadMat=mat("dead",new Color3(.18,.18,.18)),dangerMat=mat("danger",new Color3(1,.25,.12));dangerMat.alpha=.35;
function sync(s:Snapshot){const ids=new Set(s.players.map(p=>p.id));for(const [id,m] of playerMeshes)if(!ids.has(id)){m.dispose();playerMeshes.delete(id)}for(const p of s.players){let m=playerMeshes.get(p.id);if(!m){m=MeshBuilder.CreateCapsule("player",{height:1.6,radius:.45},scene);playerMeshes.set(p.id,m)}m.position.set(p.pos.x,.8,p.pos.z);m.material=p.alive?(p.id===myId?meMat:otherMat):deadMat;m.scaling.y=p.guardUntil>s.now?1.25:1}const tids=new Set(s.telegraphs.map(t=>t.id));for(const [id,m] of telegraphMeshes)if(!tids.has(id)){m.dispose();telegraphMeshes.delete(id)}for(const t of s.telegraphs)if(!telegraphMeshes.has(t.id)){const m=createTelegraph(t);telegraphMeshes.set(t.id,m)}}
function createTelegraph(t:Telegraph){let m:Mesh;if(t.kind==="circle"){m=MeshBuilder.CreateCylinder("telegraph",{diameter:(t.radius??1)*2,height:.03},scene);m.position.set(t.pos.x,.03,t.pos.z)}else{m=MeshBuilder.CreateBox("telegraph",{width:t.width??2,height:.03,depth:t.length??8},scene);const d=t.direction!;m.rotation.y=Math.atan2(d.x,d.z);m.position.set(t.pos.x+d.x*(t.length??8)/2,.03,t.pos.z+d.z*(t.length??8)/2)}m.material=dangerMat;return m}
const keys=new Set<string>();addEventListener("keydown",e=>{keys.add(e.key.toLowerCase());if(["1","2","3","4"].includes(e.key))ws.send(JSON.stringify({type:"ability",slot:Number(e.key)}));if(e.key.toLowerCase()==="r")ws.send(JSON.stringify({type:"ready"}))});addEventListener("keyup",e=>keys.delete(e.key.toLowerCase()));
setInterval(()=>{if(ws.readyState!==WebSocket.OPEN)return;const x=(keys.has("d")?1:0)-(keys.has("a")?1:0),z=(keys.has("s")?1:0)-(keys.has("w")?1:0);ws.send(JSON.stringify({type:"input",seq:seq++,move:{x,z}}))},50);
engine.runRenderLoop(()=>scene.render());addEventListener("resize",()=>engine.resize());