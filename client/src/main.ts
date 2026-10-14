import {
  ArcRotateCamera,
  Color3,
  Color4,
  Engine,
  GlowLayer,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import { DEFAULT_LOADOUT, ITEMS, SKILLS, baseLoadout } from "../../shared/protocol";
import type { Loadout, SkillId, ServerMessage, Snapshot, Telegraph } from "../../shared/protocol";

import { readInventory, countInventory, grantReward, craft, equipWeapon } from './inventory';
type ClientMode = "hub" | "encounter";

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;
const engine = new Engine(canvas, true);
const scene = new Scene(engine);
scene.clearColor = new Color4(0.025, 0.03, 0.04, 1);

const camera = new ArcRotateCamera("camera", -Math.PI / 2, 0.65, 27, new Vector3(0, 0, 0), scene);
camera.attachControl(canvas, true);
camera.inputs.clear();

const light = new HemisphericLight("light", new Vector3(0.15, 1, 0.1), scene);
light.intensity = 1.2;

const glow = new GlowLayer("glow", scene);
glow.intensity = 0.65;

const status = document.querySelector<HTMLElement>("#status")!;
const message = document.querySelector<HTMLElement>("#message")!;
const bossFill = document.querySelector<HTMLElement>("#boss-fill")!;
const hpFill = document.querySelector<HTMLElement>("#player-hp-fill")!;
const hpText = document.querySelector<HTMLElement>("#player-hp-text")!;
const abilitySlots = [...document.querySelectorAll<HTMLElement>(".ability-slot")];
const skillPanel=document.querySelector<HTMLElement>("#skill-panel")!;
const trainerPrompt=document.querySelector<HTMLElement>("#trainer-prompt")!;
const skillGrid=document.querySelector<HTMLElement>("#skill-grid")!;
const skillLoadout=document.querySelector<HTMLElement>("#skill-loadout")!;
let loadout:Loadout=[...DEFAULT_LOADOUT];
try{const saved=JSON.parse(localStorage.getItem("jacworks-loadout")??"null");loadout=baseLoadout(saved)}catch{}
let draft:Loadout=[...loadout];
let trainerOpen=false;
let hubPanelOpen=false;
let selectedBoss:'warden'|'yellowBall'='warden';
const inventoryKey='jacworks-inventory-v1';
const inventoryPanel=document.createElement('section');inventoryPanel.id='inventory-panel';inventoryPanel.className='hidden';document.body.append(inventoryPanel);
const inventoryDisplay=document.createElement('div');inventoryDisplay.id='inventory-display';document.body.append(inventoryDisplay);
let inventory=readInventory(localStorage.getItem(inventoryKey));
localStorage.setItem(inventoryKey,JSON.stringify(inventory));
function renderInventory(){inventoryDisplay.textContent=Object.entries(countInventory(inventory)).map(([id,n])=>ITEMS[id as keyof typeof ITEMS]+': '+n).join(' | ')}
function closeHubPanel(){hubPanelOpen=false;inventoryPanel.classList.add('hidden');keys.clear()}
function openHubPanel(kind:'gate'|'crafter'|'wardrobe'){
 hubPanelOpen=true;keys.clear();inventoryPanel.replaceChildren();inventoryPanel.classList.remove('hidden');
 const heading=document.createElement('h2');heading.textContent=kind==='gate'?'Expedition Gate':kind==='wardrobe'?'Wardrobe':'Crafter';inventoryPanel.append(heading);
 const copy=document.createElement('p');copy.textContent=kind==='gate'?'First entrant selects the shared room boss. An occupied room keeps its current boss.':kind==='wardrobe'?'Equipment changes Arc Blast into Arc Spear during encounters.':'Recipe: 1 Cylinder Tube + 1 Spherical Ball = 1 Primitive Wand';inventoryPanel.append(copy);
 if(kind==='gate'){
 const select=document.createElement('select');for(const [id,name] of [['warden','Warden'],['yellowBall','Yellow Ball']] as const){const o=document.createElement('option');o.value=id;o.textContent=name;o.selected=id===selectedBoss;select.append(o)}inventoryPanel.append(select);
 const button=document.createElement('button');button.textContent='Enter encounter';button.onclick=()=>{selectedBoss=select.value as typeof selectedBoss;closeHubPanel();enterEncounter()};inventoryPanel.append(button);
 }else if(kind==='wardrobe'){
 const slot=document.createElement('p');slot.textContent='Weapon: '+(inventory.weapon==='primitiveWand'?'Primitive Wand (Equipped)':'Empty');inventoryPanel.append(slot);
 const owned=document.createElement('p');owned.textContent='Owned Primitive Wands: '+countInventory(inventory).primitiveWand;inventoryPanel.append(owned);
 const button=document.createElement('button');button.textContent=inventory.weapon?'Unequip Primitive Wand':'Equip Primitive Wand';button.disabled=!inventory.weapon&&inventory.crafted<1;
 button.onclick=()=>{inventory=readInventory(localStorage.getItem(inventoryKey));if(equipWeapon(inventory,inventory.weapon?null:'primitiveWand')){localStorage.setItem(inventoryKey,JSON.stringify(inventory));renderInventory();openHubPanel('wardrobe')}};inventoryPanel.append(button);
 }else{
 const button=document.createElement('button');button.textContent='Craft Primitive Wand';const c=countInventory(inventory);button.disabled=c.cylinderTube<1||c.sphericalBall<1;
 button.onclick=()=>{inventory=readInventory(localStorage.getItem(inventoryKey));if(craft(inventory)){localStorage.setItem(inventoryKey,JSON.stringify(inventory));renderInventory();openHubPanel('crafter');const result=document.createElement('p');result.textContent='Crafted Primitive Wand! Added to inventory.';inventoryPanel.append(result)}};inventoryPanel.append(button);
 }
 const close=document.createElement('button');close.textContent='Close';close.onclick=closeHubPanel;inventoryPanel.append(close);
}
renderInventory();
addEventListener('storage',e=>{if(e.key===inventoryKey){inventory=readInventory(e.newValue);renderInventory();if(hubPanelOpen)closeHubPanel()}});
function renderSkills(){
  skillGrid.innerHTML=Object.entries(SKILLS).filter(([id])=>id!=="arcSpear").map(([id,s])=>`<div class="skill-node"><strong>${s.name}</strong><small>${s.description} · ${(s.cooldown/1000).toFixed(2)}s cooldown</small></div>`).join("");
  skillLoadout.replaceChildren();
  for(let i=0;i<4;i++){
    const wrap=document.createElement("div"),label=document.createElement("div"),select=document.createElement("select");
    label.className="skill-slot-label";label.textContent=`Slot ${i+1}`;select.className="skill-choice";
    for(const [id,skill] of Object.entries(SKILLS).filter(([id])=>id!=="arcSpear")){
      const option=document.createElement("option");option.value=id;option.textContent=skill.name;
      option.selected=id===draft[i];select.append(option);
    }
    select.onchange=()=>{
      const next=select.value as SkillId,other=draft.indexOf(next);
      if(other>=0&&other!==i)draft[other]=draft[i];
      draft[i]=next;renderSkills();
    };
    wrap.append(label,select);skillLoadout.append(wrap);
  }
}
function closeTrainer(save:boolean){
  if(save){loadout=[...draft];localStorage.setItem("jacworks-loadout",JSON.stringify(loadout))}
  trainerOpen=false;skillPanel.classList.add("hidden");keys.clear();
}
document.querySelector("#close-skills")!.addEventListener("click",()=>closeTrainer(false));
document.querySelector("#save-skills")!.addEventListener("click",()=>closeTrainer(true));
function openTrainer(){draft=[...loadout];trainerOpen=true;keys.clear();renderSkills();skillPanel.classList.remove("hidden")}
function renderAbilityBar(active:Loadout=loadout){abilitySlots.forEach((el,i)=>{const skill=SKILLS[active[i]];el.querySelector("strong")!.textContent=skill.name;el.querySelector("small")!.textContent=skill.description})}
renderAbilityBar();
const hubOnly = [...document.querySelectorAll<HTMLElement>(".hub-only")];
const encounterOnly = [...document.querySelectorAll<HTMLElement>(".encounter-only")];

const keys = new Set<string>();
const playerMeshes = new Map<string, Mesh>();
const telegraphMeshes = new Map<string, Mesh>();
const hubMeshes: Mesh[] = [];
const arenaMeshes: Mesh[] = [];

let mode: ClientMode = "hub";
let myId = "";
let snapshot: Snapshot | undefined;
let seq = 0;
let ws: WebSocket | null = null;
const fx: { mesh: Mesh; born: number; duration: number; start: Vector3; end: Vector3; kind: number }[] = [];


const material = (name: string, diffuse: Color3, emissive?: Color3, alpha = 1) => {
  const m = new StandardMaterial(name, scene);
  m.diffuseColor = diffuse;
  m.alpha = alpha;
  if (emissive) m.emissiveColor = emissive;
  return m;
};

const arcMat = material("arc-bolt-fx", new Color3(0.2, 0.75, 1), new Color3(0.15, 0.7, 1));
const novaMat = material("nova-fx", new Color3(0.65, 0.25, 1), new Color3(0.5, 0.12, 0.9), 0.65);
const dashMat = material("dash-fx", new Color3(0.1, 0.95, 0.95), new Color3(0.1, 0.6, 0.75), 0.6);
const spearMat=material("arc-spear-fx",new Color3(0.7,0.9,1),new Color3(0.4,0.8,1));
const holyMat=material("holy-nova-fx",new Color3(1,0.94,0.45),new Color3(0.9,0.8,0.2),0.7);
const guardMat = material("guard-fx", new Color3(0.25, 0.8, 1), new Color3(0.1, 0.5, 0.9), 0.32);
const hubGroundMat = material("hub-ground", new Color3(0.085, 0.105, 0.09));
const hubStoneMat = material("hub-stone", new Color3(0.18, 0.19, 0.17));
const hubAccentMat = material(
  "hub-accent",
  new Color3(0.24, 0.55, 0.72),
  new Color3(0.1, 0.42, 0.65),
);
const hubPlayerMat = material(
  "hub-player",
  new Color3(0.24, 0.6, 0.9),
  new Color3(0.05, 0.28, 0.55),
);

const arenaGroundMat = material("arena-ground", new Color3(0.075, 0.09, 0.12));
const arenaStoneMat = material("arena-stone", new Color3(0.19, 0.19, 0.2));
const bossMat = material("boss", new Color3(0.5, 0.06, 0.08), new Color3(0.28, 0.015, 0.025));
const meMat = material("me", new Color3(0.15, 0.65, 1), new Color3(0.03, 0.22, 0.48));
const otherMat = material("other", new Color3(0.25, 0.85, 0.45), new Color3(0.03, 0.24, 0.08));
const deadMat = material("dead", new Color3(0.18, 0.18, 0.18));
const dangerMat = material(
  "danger",
  new Color3(1, 0.25, 0.12),
  new Color3(0.45, 0.04, 0.01),
  0.32,
);

function pushHub<T extends Mesh>(mesh: T): T {
  hubMeshes.push(mesh);
  return mesh;
}

function pushArena<T extends Mesh>(mesh: T): T {
  arenaMeshes.push(mesh);
  return mesh;
}

const hubGround = pushHub(MeshBuilder.CreateGround("hub-ground", { width: 28, height: 24 }, scene));
hubGround.material = hubGroundMat;

const hubPath = pushHub(MeshBuilder.CreateBox("hub-path", { width: 5.5, height: 0.06, depth: 15 }, scene));
hubPath.position.set(0, 0.03, 1);
hubPath.material = hubStoneMat;

for (const [x, z] of [
  [-8.5, -5],
  [8.5, -5],
  [-8, 5.5],
  [8, 5.5],
] as const) {
  const ruin = pushHub(MeshBuilder.CreateBox(`hub-ruin-${x}-${z}`, { width: 2.2, height: 1.8, depth: 2.2 }, scene));
  ruin.position.set(x, 0.9, z);
  ruin.rotation.y = (x + z) * 0.05;
  ruin.material = hubStoneMat;
}

const portalDisc = pushHub(MeshBuilder.CreateCylinder("expedition-gate", { diameter: 4.2, height: 0.08, tessellation: 48 }, scene));
portalDisc.position.set(0, 0.05, -6.4);
portalDisc.material = hubAccentMat;

const portalRing = pushHub(MeshBuilder.CreateTorus("expedition-ring", { diameter: 4.8, thickness: 0.25, tessellation: 48 }, scene));
portalRing.position.set(0, 0.12, -6.4);
portalRing.material = hubAccentMat;

const hubPlayer = pushHub(MeshBuilder.CreateCapsule("hub-player", { height: 1.7, radius: 0.48 }, scene));
hubPlayer.position.set(0, 0.85, 6.2);
hubPlayer.material = hubPlayerMat;
function addNose(parent:Mesh){const nose=MeshBuilder.CreateBox(parent.name+'-nose',{width:.22,height:.22,depth:.55},scene);nose.parent=parent;nose.position.set(0,.25,.55);nose.material=holyMat;return nose}
addNose(hubPlayer);

const hubPlayerRing = pushHub(MeshBuilder.CreateTorus("hub-player-ring", { diameter: 1.55, thickness: 0.08, tessellation: 32 }, scene));
hubPlayerRing.position.set(0, 0.08, 6.2);
hubPlayerRing.material = hubPlayerMat;

const trainer=pushHub(MeshBuilder.CreateCapsule("skill-trainer",{height:2,radius:0.65},scene));
trainer.position.set(-4.3,1,3.5);trainer.material=holyMat;
const trainerBase=pushHub(MeshBuilder.CreateTorus("trainer-ring",{diameter:2.2,thickness:0.13},scene));
trainerBase.position.set(-4.3,0.08,3.5);trainerBase.material=holyMat;
const trainerStaff=pushHub(MeshBuilder.CreateCylinder("trainer-staff",{height:2.4,diameter:0.14},scene));
trainerStaff.position.set(-3.55,1.2,3.5);trainerStaff.material=hubAccentMat;
const crafter=pushHub(MeshBuilder.CreateCapsule('crafter',{height:2,radius:.65},scene));crafter.position.set(4.3,1,3.5);crafter.material=novaMat;
const craftingTable=pushHub(MeshBuilder.CreateBox('crafting-table',{width:1.8,height:.8,depth:1.2},scene));craftingTable.position.set(4.3,.4,2.3);craftingTable.material=hubStoneMat;
const tube=pushHub(MeshBuilder.CreateCylinder('tube-example',{diameter:.35,height:.6},scene));tube.position.set(3.9,1.1,2.3);tube.material=bossMat;
const ball=pushHub(MeshBuilder.CreateSphere('ball-example',{diameter:.45},scene));ball.position.set(4.7,1.05,2.3);ball.material=holyMat;
const wardrobe=pushHub(MeshBuilder.CreateBox('wardrobe',{width:2.2,height:2.8,depth:1},scene));wardrobe.position.set(5.5,1.4,-2.5);wardrobe.material=hubStoneMat;
for(const x of [4.95,6.05]){
 const door=pushHub(MeshBuilder.CreateBox('wardrobe-door',{width:1,height:2.5,depth:.1},scene));door.position.set(x,1.4,-3.06);door.material=hubAccentMat;
 const handle=pushHub(MeshBuilder.CreateSphere('wardrobe-handle',{diameter:.16},scene));handle.position.set(x+(x<5.5?.35:-.35),1.4,-3.18);handle.material=holyMat;
}
const arenaGround = pushArena(MeshBuilder.CreateGround("arena", { width: 26, height: 26 }, scene));
arenaGround.material = arenaGroundMat;

const arenaRing = pushArena(MeshBuilder.CreateTorus("arena-ring", { diameter: 24.4, thickness: 0.22, tessellation: 64 }, scene));
arenaRing.position.y = 0.06;
arenaRing.material = arenaStoneMat;

for (const [x, z] of [
  [-7.5, -7.5],
  [7.5, -7.5],
  [-7.5, 7.5],
  [7.5, 7.5],
] as const) {
  const pillar = pushArena(MeshBuilder.CreateBox(`arena-pillar-${x}-${z}`, { width: 2.2, height: 2.6, depth: 2.2 }, scene));
  pillar.position.set(x, 1.3, z);
  pillar.rotation.y = Math.PI / 4;
  pillar.material = arenaStoneMat;
}

const bossMesh = pushArena(MeshBuilder.CreateCylinder("boss", { diameter: 2.5, height: 2.9, tessellation: 12 }, scene));
bossMesh.position.y = 1.45;
bossMesh.material = bossMat;
const yellowMat=material('yellow-ball',new Color3(1,.85,.02),new Color3(.5,.32,0));
const yellowBoss=pushArena(MeshBuilder.CreateSphere('yellow-boss',{diameter:2.5,segments:24},scene));yellowBoss.material=yellowMat;
const dropTube=pushArena(MeshBuilder.CreateCylinder('cylinder-tube-drop',{diameter:.4,height:.65},scene));dropTube.material=bossMat;
const dropBall=pushArena(MeshBuilder.CreateSphere('spherical-ball-drop',{diameter:.5},scene));dropBall.material=yellowMat;

const bossRing = pushArena(MeshBuilder.CreateTorus("boss-ring", { diameter: 3.6, thickness: 0.11, tessellation: 48 }, scene));
bossRing.position.y = 0.08;
bossRing.material = bossMat;

function setMode(next: ClientMode) {
  closeHubPanel();keys.clear();
  if(trainerOpen)closeTrainer(false);
  mode = next;
  const inHub = mode === "hub";

  for (const mesh of hubMeshes) mesh.setEnabled(inHub);
  for (const mesh of arenaMeshes) mesh.setEnabled(!inHub);
  dropTube.setEnabled(false);dropBall.setEnabled(false);yellowBoss.setEnabled(false);
  for (const mesh of playerMeshes.values()) mesh.setEnabled(!inHub);
  for (const mesh of telegraphMeshes.values()) mesh.setEnabled(!inHub);
  for (const effect of fx) effect.mesh.setEnabled(!inHub);

  hubOnly.forEach((el) => el.classList.toggle("hidden", !inHub));
  encounterOnly.forEach((el) => el.classList.toggle("hidden", inHub));

  if (inHub) {
    status.textContent = "Sanctum Hub";
    renderAbilityBar();
    message.textContent = "";
    camera.radius = 27;
  } else {
    status.textContent = "Connecting to encounter…";
    camera.radius = 25;
  }
}

function clearEncounterMeshes() {
  for (const effect of fx) effect.mesh.dispose();
  fx.length = 0;
  for (const mesh of playerMeshes.values()) mesh.dispose();
  playerMeshes.clear();
  for (const mesh of telegraphMeshes.values()) mesh.dispose();
  telegraphMeshes.clear();
}

function enterEncounter() {
  if (mode === "encounter") return;
  setMode("encounter");
  connectEncounter();
}

function returnToHub() {
  if (mode === "hub") return;
  ws?.close();
  ws = null;
  snapshot = undefined;
  myId = "";
  clearEncounterMeshes();
  bossFill.style.width = "100%";
  hpFill.style.width = "100%";
  hpText.textContent = "100 / 100";
  hubPlayer.position.set(0, 0.85, 6.2);
  hubPlayerRing.position.set(0, 0.08, 6.2);
  setMode("hub");
}

function connectEncounter() {
  const wsProto = location.protocol === "https:" ? "wss" : "ws";
  const wsHost = location.hostname || "localhost";
  const localVite = location.port === "5173";
  const endpoint = localVite ? `${wsProto}://${wsHost}:8787` : `${wsProto}://${location.host}/ws`;
  const socket = new WebSocket(endpoint);
  ws = socket;

  socket.onopen = () => {
    if (ws !== socket) return;
    status.textContent = "Connected · press R when ready";
    socket.send(JSON.stringify({ type: "join", name: `Player-${Math.floor(Math.random() * 999)}`,loadout,boss:selectedBoss,inventory:readInventory(localStorage.getItem(inventoryKey)) }));
  };

  socket.onclose = () => {
    if (ws === socket && mode === "encounter") status.textContent = "Disconnected";
  };

  socket.onmessage = (event) => {
    if (ws !== socket || mode !== "encounter") return;

    const packet = JSON.parse(event.data) as ServerMessage;

    if (packet.type === "welcome") myId = packet.id;

    if (packet.type === "abilityFx") {
      spawnAbilityFx(packet.skill, packet.from, packet.to);
    }

    if (packet.type === "event") {
      message.textContent = packet.text;
      setTimeout(() => {
        if (message.textContent === packet.text) message.textContent = "";
      }, 1800);
    }

    if (packet.type === "snapshot") {
 inventory=readInventory(localStorage.getItem(inventoryKey));
 if(grantReward(inventory,packet.reward,myId)){localStorage.setItem(inventoryKey,JSON.stringify(inventory));renderInventory();message.textContent='Reward: '+ITEMS[packet.reward!.material];}
      snapshot = packet;
      bossFill.style.width = `${(packet.boss.hp / packet.boss.maxHp) * 100}%`;
      status.textContent = `${packet.phase.toUpperCase()} · ${packet.players.length} player(s) · ready ${packet.readyCount}/${packet.players.length}`;
      syncEncounter(packet);
      const me = packet.players.find((p) => p.id === myId);
      if (me) {
        renderAbilityBar(me.loadout);
        hpFill.style.width = `${Math.max(0, me.hp / me.maxHp * 100)}%`;
        hpText.textContent = `${Math.ceil(me.hp)} / ${me.maxHp}`;
      }
    }
  };
}

function syncEncounter(state: Snapshot) {
 const yellow=state.boss.id==='yellowBall';
 bossMesh.setEnabled(!yellow&&state.phase!=='won');yellowBoss.setEnabled(yellow&&state.phase!=='won');
 bossMesh.position.set(state.boss.pos.x,1.45,state.boss.pos.z);yellowBoss.position.set(state.boss.pos.x,1.25+state.boss.height,state.boss.pos.z);
 yellowBoss.rotation.x+=.12;bossRing.position.set(state.boss.pos.x,.08,state.boss.pos.z);bossRing.material=yellow?yellowMat:bossMat;
 document.querySelector('#boss-label')!.textContent=yellow?'YELLOW BALL':'THE WARDEN';
 dropTube.setEnabled(state.phase==='won'&&!yellow);dropBall.setEnabled(state.phase==='won'&&yellow);
 dropTube.position.set(state.boss.pos.x,.35,state.boss.pos.z);dropBall.position.set(state.boss.pos.x,.3,state.boss.pos.z);
  const playerIds = new Set(state.players.map((p) => p.id));

  for (const [id, mesh] of playerMeshes) {
    if (!playerIds.has(id)) {
      mesh.dispose();
      playerMeshes.delete(id);
    }
  }

  for (const p of state.players) {
    let mesh = playerMeshes.get(p.id);

    if (!mesh) {
      mesh = MeshBuilder.CreateCapsule(`player-${p.id}`, { height: 1.6, radius: 0.45 }, scene);
      addNose(mesh);
      playerMeshes.set(p.id, mesh);
    }

    mesh.setEnabled(mode === "encounter");
    mesh.position.set(p.pos.x, 0.8, p.pos.z);
    mesh.rotation.y=Math.atan2(p.facing.x,p.facing.z);
    mesh.material = p.alive ? (p.id === myId ? meMat : otherMat) : deadMat;
    mesh.scaling.y = p.guardUntil > state.now ? 1.25 : 1;
  }

  const telegraphIds = new Set(state.telegraphs.map((t) => t.id));

  for (const [id, mesh] of telegraphMeshes) {
    if (!telegraphIds.has(id)) {
      mesh.dispose();
      telegraphMeshes.delete(id);
    }
  }

  for (const telegraph of state.telegraphs) {
    if (!telegraphMeshes.has(telegraph.id)) {
      telegraphMeshes.set(telegraph.id, createTelegraph(telegraph));
    }
  }
}

function createTelegraph(t: Telegraph) {
  let mesh: Mesh;

  if (t.kind === "circle") {
    mesh = MeshBuilder.CreateCylinder(
      `telegraph-${t.id}`,
      { diameter: (t.radius ?? 1) * 2, height: 0.035, tessellation: 48 },
      scene,
    );
    mesh.position.set(t.pos.x, 0.04, t.pos.z);
  } else {
    mesh = MeshBuilder.CreateBox(
      `telegraph-${t.id}`,
      { width: t.width ?? 2, height: 0.035, depth: t.length ?? 8 },
      scene,
    );
    const direction = t.direction!;
    mesh.rotation.y = Math.atan2(direction.x, direction.z);
    mesh.position.set(
      t.pos.x + direction.x * (t.length ?? 8) / 2,
      0.04,
      t.pos.z + direction.z * (t.length ?? 8) / 2,
    );
  }

  mesh.material = dangerMat;
  return mesh;
}

function spawnAbilityFx(skill:SkillId, from: {x:number;z:number}, to: {x:number;z:number}) {
  const start = new Vector3(from.x, 1, from.z);
  const end = new Vector3(to.x, 1, to.z);
  let mesh: Mesh;
  let duration: number;
  if(skill==='lazor'){
 mesh=MeshBuilder.CreateBox('lazor-beam',{width:.7,height:.5,depth:Vector3.Distance(start,end)},scene);mesh.material=holyMat;mesh.position.copyFrom(Vector3.Center(start,end));mesh.rotation.y=Math.atan2(to.x-from.x,to.z-from.z);duration=450;
 } else if (skill === "arcBolt" || skill === "arcSpear") {
    mesh = skill === "arcSpear" ? MeshBuilder.CreateCylinder("arc-spear", {height:1.8,diameterTop:0,diameterBottom:0.35,tessellation:8},scene) : MeshBuilder.CreateSphere("arc-bolt", { diameter: 0.48, segments: 12 }, scene);
    mesh.material = skill === "arcSpear" ? spearMat : arcMat;
    if(skill==="arcSpear")mesh.rotation.x=Math.PI/2;
    duration = skill === "arcSpear" ? 500 : 360;
  } else if (skill === "dash") {
    mesh = MeshBuilder.CreateTorus("dash-trail", { diameter: 1.4, thickness: 0.2 }, scene);
    mesh.material = dashMat;
    mesh.rotation.x = Math.PI / 2;
    duration = 420;
  } else if (skill === "pulseNova" || skill === "holyNova") {
    mesh = MeshBuilder.CreateTorus("pulse-nova", { diameter: 1, thickness: 0.2, tessellation: 48 }, scene);
    mesh.material = skill === "holyNova" ? holyMat : novaMat;
    duration = 520;
  } else {
    mesh = MeshBuilder.CreateSphere("guard-shield", { diameter: 2.1, segments: 16 }, scene);
    mesh.material = guardMat;
    duration = 700;
  }
  if(skill!=='lazor')mesh.position.copyFrom(start);
  if (skill === "dash") mesh.position.copyFrom(end);
  fx.push({ mesh, born: performance.now(), duration, start, end, kind: skill === "arcBolt" || skill === "arcSpear" ? 1 : skill === "dash" ? 2 : skill === "pulseNova" || skill === "holyNova" ? 3 : 4 });
}

function updateEffects() {
  const now = performance.now();
  for (let i = fx.length - 1; i >= 0; i--) {
    const effect = fx[i];
    const t = Math.min(1, (now - effect.born) / effect.duration);
    if (t >= 1) {
      effect.mesh.dispose();
      fx.splice(i, 1);
      continue;
    }
    if (effect.kind === 1) {
      effect.mesh.position.copyFrom(Vector3.Lerp(effect.start, effect.end, t));
      effect.mesh.scaling.setAll(1 + 0.4 * Math.sin(t * Math.PI));
    } else if (effect.kind === 2) {
      effect.mesh.scaling.setAll(1 + t * 1.5);
      effect.mesh.visibility = 1 - t;
    } else if (effect.kind === 3) {
      effect.mesh.scaling.setAll(1 + t * 8);
      effect.mesh.visibility = 1 - t;
    } else {
      effect.mesh.scaling.setAll(1 + 0.15 * Math.sin(t * Math.PI));
      effect.mesh.visibility = 1 - t * 0.75;
    }
  }
}

function updateCooldowns() {
  const me = snapshot?.players.find(p => p.id === myId);
  const now = Date.now();
  for (let i = 0; i < abilitySlots.length; i++) {
    const remaining = mode === "encounter" && me ? Math.max(0, me.cooldowns[i] - now) : 0;
    const overlay = abilitySlots[i].querySelector<HTMLElement>(".cooldown-overlay")!;
    const label = abilitySlots[i].querySelector<HTMLElement>(".cooldown-text")!;
    overlay.style.transform = `scaleY(${remaining / SKILLS[me?.loadout[i]??loadout[i]].cooldown})`;
    label.textContent = remaining > 0 ? (remaining / 1000).toFixed(1) : "";
  }
}

function send(payload: unknown) {
  if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));
}

function hubPortalDistance() {
  return Math.hypot(hubPlayer.position.x, hubPlayer.position.z + 6.4);
}

addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if(hubPanelOpen){if(key==='escape')closeHubPanel();return}
  if(trainerOpen){if(key==="escape")closeTrainer(false);return}
  keys.add(key);
  if(mode==='hub'&&key==='e'&&!event.repeat&&Math.hypot(hubPlayer.position.x-5.5,hubPlayer.position.z+2.5)<=2.6){openHubPanel('wardrobe');return}
  if(mode==='hub'&&key==='e'&&!event.repeat&&Math.hypot(hubPlayer.position.x-4.3,hubPlayer.position.z-3.5)<=2.6){openHubPanel('crafter');return}

  if(mode==="hub"&&key==="e"&&Math.hypot(hubPlayer.position.x+4.3,hubPlayer.position.z-3.5)<=2.6){openTrainer();return}
  if (mode === "hub" && key === "e" && hubPortalDistance() <= 3) {
    openHubPanel('gate');
    return;
  }

  if (mode !== "encounter") return;

  if (["1", "2", "3", "4"].includes(event.key)) {
    if (!event.repeat) send({ type: "ability", slot: Number(event.key) });
  }

  if (key === "r") send({ type: "ready" });
  if (key === "h") returnToHub();
});

addEventListener("keyup", (event) => keys.delete(event.key.toLowerCase()));
addEventListener("blur",()=>keys.clear());

setInterval(() => {
  if (mode !== "encounter" || ws?.readyState !== WebSocket.OPEN) return;

  const x = (keys.has("d") ? 1 : 0) - (keys.has("a") ? 1 : 0);
  const z = (keys.has("w") ? 1 : 0) - (keys.has("s") ? 1 : 0);
  send({ type: "input", seq: seq++, move: { x, z } });
}, 50);

function updateHub(deltaSeconds: number) {
  const x = (keys.has("d") ? 1 : 0) - (keys.has("a") ? 1 : 0);
  const z = (keys.has("w") ? 1 : 0) - (keys.has("s") ? 1 : 0);
  const length = Math.hypot(x, z);

  if (length > 0) {
    const old=hubPlayer.position.clone();
    const speed = 5.4;
    hubPlayer.position.x += (x / length) * speed * deltaSeconds;
    hubPlayer.position.z += (z / length) * speed * deltaSeconds;
    hubPlayer.position.x = Math.max(-11.5, Math.min(11.5, hubPlayer.position.x));
    hubPlayer.position.z = Math.max(-9.5, Math.min(9.5, hubPlayer.position.z));
    hubPlayerRing.position.x = hubPlayer.position.x;
    hubPlayerRing.position.z = hubPlayer.position.z;
    const dx=hubPlayer.position.x-old.x,dz=hubPlayer.position.z-old.z;if(Math.hypot(dx,dz)>.001)hubPlayer.rotation.y=Math.atan2(dx,dz);
  }

  const nearTrainer=Math.hypot(hubPlayer.position.x+4.3,hubPlayer.position.z-3.5)<=2.6;
  trainerPrompt.classList.toggle("hidden",!nearTrainer);
  const nearGate = hubPortalDistance() <= 3;
  status.textContent = nearTrainer ? "Skill Trainer · press E" : nearGate ? "Expedition Gate · press E" : "Sanctum Hub";

  if(Math.hypot(hubPlayer.position.x-4.3,hubPlayer.position.z-3.5)<=2.6)status.textContent='Crafter - press E';
  if(Math.hypot(hubPlayer.position.x-5.5,hubPlayer.position.z+2.5)<=2.6)status.textContent='Wardrobe � press E';
  const pulse = 1 + Math.sin(performance.now() * 0.003) * 0.08;
  portalRing.scaling.set(pulse, 1, pulse);
}

setMode("hub");

engine.runRenderLoop(() => {
  const deltaSeconds = Math.min(engine.getDeltaTime() / 1000, 0.05);
  if (mode === "hub" && !trainerOpen && !hubPanelOpen) updateHub(deltaSeconds);
  else if (snapshot) {
    bossRing.rotation.y += deltaSeconds * 0.5;
  }
  updateEffects();
  updateCooldowns();
  scene.render();
});

addEventListener("resize", () => engine.resize());
