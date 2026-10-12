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
import type { ServerMessage, Snapshot, Telegraph } from "../../shared/protocol";

type ClientMode = "hub" | "encounter" | "game-dev" | "vfx-lab" | "character-lab";

const canvas = document.querySelector<HTMLCanvasElement>("#game")!;
const engine = new Engine(canvas, true);
const scene = new Scene(engine);
scene.clearColor = new Color4(0.025, 0.03, 0.04, 1);

const camera = new ArcRotateCamera("camera", -Math.PI / 2, 1.08, 27, new Vector3(0, 0, 0), scene);
camera.attachControl(canvas, true);
camera.inputs.clear();

const light = new HemisphericLight("light", new Vector3(0.15, 1, 0.1), scene);
light.intensity = 1.2;

const glow = new GlowLayer("glow", scene);
glow.intensity = 0.65;

const status = document.querySelector<HTMLElement>("#status")!;
const message = document.querySelector<HTMLElement>("#message")!;
const bossFill = document.querySelector<HTMLElement>("#boss-fill")!;
const hubOnly = [...document.querySelectorAll<HTMLElement>(".hub-only")];
const encounterOnly = [...document.querySelectorAll<HTMLElement>(".encounter-only")];
const gameDevMenu = document.querySelector<HTMLElement>("#game-dev-menu")!;
const vfxLabUi = document.querySelector<HTMLElement>("#vfx-lab-ui")!;
const characterLabUi = document.querySelector<HTMLElement>("#character-lab-ui")!;
const gameDevButtons = [
  document.querySelector<HTMLButtonElement>("#game-dev-button")!,
  document.querySelector<HTMLButtonElement>("#hub-game-dev-button")!,
];
const openVfxLabButton = document.querySelector<HTMLButtonElement>("#open-vfx-lab")!;
const openCharacterLabButton = document.querySelector<HTMLButtonElement>("#open-character-lab")!;
const backToHubButtons = [...document.querySelectorAll<HTMLButtonElement>(".back-to-hub")];
const backToDevButtons = [...document.querySelectorAll<HTMLButtonElement>(".back-to-dev")];
const vfxSpell = document.querySelector<HTMLSelectElement>("#vfx-spell")!;
const vfxLoop = document.querySelector<HTMLInputElement>("#vfx-loop")!;
const vfxSpeed = document.querySelector<HTMLInputElement>("#vfx-speed")!;
const vfxScale = document.querySelector<HTMLInputElement>("#vfx-scale")!;
const vfxCastButton = document.querySelector<HTMLButtonElement>("#vfx-cast")!;
const vfxResetButton = document.querySelector<HTMLButtonElement>("#vfx-reset")!;
const characterType = document.querySelector<HTMLSelectElement>("#character-type")!;
const characterScale = document.querySelector<HTMLInputElement>("#character-scale")!;
const characterRing = document.querySelector<HTMLInputElement>("#character-ring")!;
const characterHealth = document.querySelector<HTMLInputElement>("#character-health")!;
const characterHealthbar = document.querySelector<HTMLElement>("#character-healthbar")!;
const characterActionButtons = [...document.querySelectorAll<HTMLButtonElement>(".character-action")];

const keys = new Set<string>();
const playerMeshes = new Map<string, Mesh>();
const telegraphMeshes = new Map<string, Mesh>();
const hubMeshes: Mesh[] = [];
const arenaMeshes: Mesh[] = [];
const vfxLabMeshes: Mesh[] = [];
const characterLabMeshes: Mesh[] = [];
const transientVfx: LabFx[] = [];

type LabFx = {
  mesh: Mesh;
  age: number;
  delay: number;
  duration: number;
  from?: Vector3;
  to?: Vector3;
  grow?: number;
};

let mode: ClientMode = "hub";
let myId = "";
let snapshot: Snapshot | undefined;
let seq = 0;
let ws: WebSocket | null = null;

const material = (name: string, diffuse: Color3, emissive?: Color3, alpha = 1) => {
  const m = new StandardMaterial(name, scene);
  m.diffuseColor = diffuse;
  m.alpha = alpha;
  if (emissive) m.emissiveColor = emissive;
  return m;
};

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
const labGroundMat = material("lab-ground", new Color3(0.055, 0.07, 0.085));
const labGridMat = material("lab-grid", new Color3(0.16, 0.19, 0.22), new Color3(0.03, 0.04, 0.05));
const labCasterMat = material("lab-caster", new Color3(0.2, 0.55, 0.96), new Color3(0.05, 0.2, 0.5));
const labDummyMat = material("lab-dummy", new Color3(0.34, 0.28, 0.23));
const arcMat = material("lab-arc", new Color3(0.32, 0.62, 1), new Color3(0.2, 0.48, 1), 0.9);
const novaMat = material("lab-nova", new Color3(0.55, 0.28, 1), new Color3(0.42, 0.12, 1), 0.55);
const guardMat = material("lab-guard", new Color3(0.3, 0.85, 1), new Color3(0.08, 0.45, 0.75), 0.45);
const enemyMat = material("lab-enemy", new Color3(0.55, 0.18, 0.12), new Color3(0.12, 0.02, 0.01));
const characterBossMat = material("lab-boss", new Color3(0.42, 0.06, 0.1), new Color3(0.18, 0.01, 0.025));

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

const hubPlayerRing = pushHub(MeshBuilder.CreateTorus("hub-player-ring", { diameter: 1.55, thickness: 0.08, tessellation: 32 }, scene));
hubPlayerRing.position.set(0, 0.08, 6.2);
hubPlayerRing.material = hubPlayerMat;

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

const bossRing = pushArena(MeshBuilder.CreateTorus("boss-ring", { diameter: 3.6, thickness: 0.11, tessellation: 48 }, scene));
bossRing.position.y = 0.08;
bossRing.material = bossMat;

function pushVfxLab<T extends Mesh>(mesh: T): T {
  vfxLabMeshes.push(mesh);
  return mesh;
}

function pushCharacterLab<T extends Mesh>(mesh: T): T {
  characterLabMeshes.push(mesh);
  return mesh;
}

const vfxGround = pushVfxLab(MeshBuilder.CreateGround("vfx-lab-ground", { width: 22, height: 18 }, scene));
vfxGround.material = labGroundMat;

for (let x = -10; x <= 10; x += 2) {
  const line = pushVfxLab(MeshBuilder.CreateBox(`vfx-grid-x-${x}`, { width: 0.025, height: 0.012, depth: 18 }, scene));
  line.position.set(x, 0.012, 0);
  line.material = labGridMat;
}
for (let z = -8; z <= 8; z += 2) {
  const line = pushVfxLab(MeshBuilder.CreateBox(`vfx-grid-z-${z}`, { width: 22, height: 0.012, depth: 0.025 }, scene));
  line.position.set(0, 0.012, z);
  line.material = labGridMat;
}

const vfxCaster = pushVfxLab(MeshBuilder.CreateCapsule("vfx-caster", { height: 1.8, radius: 0.5 }, scene));
vfxCaster.position.set(0, 0.9, 4.2);
vfxCaster.material = labCasterMat;

const vfxCasterRing = pushVfxLab(MeshBuilder.CreateTorus("vfx-caster-ring", { diameter: 1.7, thickness: 0.08, tessellation: 40 }, scene));
vfxCasterRing.position.set(0, 0.08, 4.2);
vfxCasterRing.material = labCasterMat;

const vfxDummy = pushVfxLab(MeshBuilder.CreateCylinder("vfx-dummy", { diameter: 1.35, height: 2.1, tessellation: 10 }, scene));
vfxDummy.position.set(0, 1.05, -3.6);
vfxDummy.material = labDummyMat;

const vfxDummyRing = pushVfxLab(MeshBuilder.CreateTorus("vfx-dummy-ring", { diameter: 2.1, thickness: 0.08, tessellation: 40 }, scene));
vfxDummyRing.position.set(0, 0.08, -3.6);
vfxDummyRing.material = dangerMat;

const characterGround = pushCharacterLab(MeshBuilder.CreateGround("character-lab-ground", { width: 18, height: 16 }, scene));
characterGround.material = labGroundMat;

const viewerRing = pushCharacterLab(MeshBuilder.CreateTorus("character-viewer-ring", { diameter: 4.2, thickness: 0.11, tessellation: 48 }, scene));
viewerRing.position.set(0, 0.08, 0);
viewerRing.material = labCasterMat;

const characterMesh = pushCharacterLab(MeshBuilder.CreateCapsule("viewer-character", { height: 2.3, radius: 0.62 }, scene));
characterMesh.position.set(0, 1.15, 0);
characterMesh.material = labCasterMat;

const enemyMesh = pushCharacterLab(MeshBuilder.CreateCylinder("viewer-enemy", { diameterTop: 0.8, diameterBottom: 1.55, height: 2.4, tessellation: 7 }, scene));
enemyMesh.position.set(0, 1.2, 0);
enemyMesh.material = enemyMat;

const bossViewerMesh = pushCharacterLab(MeshBuilder.CreateCylinder("viewer-boss", { diameterTop: 2.2, diameterBottom: 3.6, height: 4.2, tessellation: 9 }, scene));
bossViewerMesh.position.set(0, 2.1, 0);
bossViewerMesh.material = characterBossMat;

const bossCrown = pushCharacterLab(MeshBuilder.CreateTorus("viewer-boss-crown", { diameter: 3.0, thickness: 0.22, tessellation: 9 }, scene));
bossCrown.position.set(0, 4.15, 0);
bossCrown.material = characterBossMat;

let characterAction: "idle" | "attack" | "cast" | "hit" = "idle";
let characterActionTime = 0;
let vfxLoopTimer = 0;

function setMode(next: ClientMode) {
  mode = next;
  const inHub = mode === "hub";
  const inEncounter = mode === "encounter";
  const inGameDev = mode === "game-dev";
  const inVfxLab = mode === "vfx-lab";
  const inCharacterLab = mode === "character-lab";

  for (const mesh of hubMeshes) mesh.setEnabled(inHub);
  for (const mesh of arenaMeshes) mesh.setEnabled(inEncounter);
  for (const mesh of playerMeshes.values()) mesh.setEnabled(inEncounter);
  for (const mesh of telegraphMeshes.values()) mesh.setEnabled(inEncounter);
  for (const mesh of vfxLabMeshes) mesh.setEnabled(inVfxLab);
  for (const mesh of characterLabMeshes) mesh.setEnabled(inCharacterLab);

  hubOnly.forEach((el) => el.classList.toggle("hidden", !inHub));
  encounterOnly.forEach((el) => el.classList.toggle("hidden", !inEncounter));
  gameDevMenu.classList.toggle("hidden", !inGameDev);
  vfxLabUi.classList.toggle("hidden", !inVfxLab);
  characterLabUi.classList.toggle("hidden", !inCharacterLab);

  message.textContent = "";

  if (inHub) {
    status.textContent = "Sanctum Hub";
    camera.radius = 27;
  } else if (inEncounter) {
    status.textContent = "Connecting to encounter…";
    camera.radius = 25;
  } else if (inGameDev) {
    status.textContent = "Game Dev";
    camera.radius = 27;
  } else if (inVfxLab) {
    status.textContent = "Visual VFX Lab";
    camera.radius = 22;
  } else {
    status.textContent = "Character, Enemy & Boss Lab";
    camera.radius = 22;
    syncCharacterViewer();
  }
}

function clearEncounterMeshes() {
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

function openGameDev() {
  resetLabVfx();
  setMode("game-dev");
}

function openVfxLab() {
  resetLabVfx();
  vfxLoopTimer = 0;
  setMode("vfx-lab");
}

function openCharacterLab() {
  characterAction = "idle";
  characterActionTime = 0;
  setMode("character-lab");
}

function resetLabVfx() {
  for (const effect of transientVfx) effect.mesh.dispose();
  transientVfx.length = 0;
}

function addLabFx(mesh: Mesh, duration: number, delay = 0, from?: Vector3, to?: Vector3, grow = 0) {
  mesh.setEnabled(delay <= 0);
  transientVfx.push({ mesh, age: 0, delay, duration, from, to, grow });
}

function createLabRing(name: string, position: Vector3, diameter: number, mat: StandardMaterial, delay: number, duration: number, grow = 0) {
  const ring = MeshBuilder.CreateTorus(name, { diameter, thickness: 0.12, tessellation: 48 }, scene);
  ring.position.copyFrom(position);
  ring.material = mat;
  addLabFx(ring, duration, delay, undefined, undefined, grow);
}

function castLabSpell() {
  if (mode !== "vfx-lab") return;

  const speed = Number(vfxSpeed.value);
  const scale = Number(vfxScale.value);
  const caster = new Vector3(0, 0.35, 4.2);
  const target = new Vector3(0, 0.7, -3.6);

  if (vfxSpell.value === "arc") {
    createLabRing("arc-build", caster, 1.6 * scale, arcMat, 0, 0.34 / speed, 1.5);
    const bolt = MeshBuilder.CreateSphere("arc-bolt", { diameter: 0.65 * scale, segments: 12 }, scene);
    bolt.material = arcMat;
    bolt.position.copyFrom(caster);
    addLabFx(bolt, 0.58 / speed, 0.28 / speed, caster, target);
    createLabRing("arc-impact", new Vector3(0, 0.12, -3.6), 1.0 * scale, arcMat, 0.82 / speed, 0.42 / speed, 2.8);
  } else if (vfxSpell.value === "dash") {
    for (let i = 0; i < 5; i++) {
      const ghost = MeshBuilder.CreateCapsule(`dash-ghost-${i}`, { height: 1.6, radius: 0.43 }, scene);
      ghost.material = guardMat;
      ghost.scaling.setAll(scale);
      const z = 4.2 - i * 0.85;
      ghost.position.set(0, 0.8, z);
      addLabFx(ghost, (0.48 + i * 0.05) / speed, i * 0.045 / speed);
    }
    createLabRing("dash-land", new Vector3(0, 0.12, 0.6), 1.4 * scale, guardMat, 0.2 / speed, 0.4 / speed, 2.2);
  } else if (vfxSpell.value === "nova") {
    createLabRing("nova-one", new Vector3(0, 0.12, 4.2), 1.8 * scale, novaMat, 0, 0.7 / speed, 5.4);
    createLabRing("nova-two", new Vector3(0, 0.16, 4.2), 1.1 * scale, arcMat, 0.08 / speed, 0.6 / speed, 4.4);
  } else {
    createLabRing("guard-one", new Vector3(0, 0.9, 4.2), 1.65 * scale, guardMat, 0, 0.8 / speed, 0.35);
    createLabRing("guard-two", new Vector3(0, 1.2, 4.2), 2.1 * scale, guardMat, 0.08 / speed, 0.75 / speed, -0.2);
  }
}

function updateLabVfx(deltaSeconds: number) {
  const speed = Number(vfxSpeed.value);

  for (let i = transientVfx.length - 1; i >= 0; i--) {
    const effect = transientVfx[i];
    effect.age += deltaSeconds;

    if (effect.age < effect.delay) continue;
    effect.mesh.setEnabled(true);

    const t = Math.min(1, (effect.age - effect.delay) / effect.duration);
    if (effect.from && effect.to) {
      effect.mesh.position = Vector3.Lerp(effect.from, effect.to, t);
    }
    if (effect.grow) {
      const size = 1 + effect.grow * t;
      effect.mesh.scaling.setAll(Math.max(0.05, size));
    }
    effect.mesh.visibility = Math.max(0, 1 - Math.max(0, t - 0.65) / 0.35);

    if (t >= 1) {
      effect.mesh.dispose();
      transientVfx.splice(i, 1);
    }
  }

  if (vfxLoop.checked) {
    vfxLoopTimer -= deltaSeconds;
    if (vfxLoopTimer <= 0) {
      castLabSpell();
      vfxLoopTimer = 1.35 / speed;
    }
  } else {
    vfxLoopTimer = 0;
  }
}

function syncCharacterViewer() {
  const type = characterType.value;
  const scale = Number(characterScale.value);

  characterMesh.setEnabled(mode === "character-lab" && type === "character");
  enemyMesh.setEnabled(mode === "character-lab" && type === "enemy");
  bossViewerMesh.setEnabled(mode === "character-lab" && type === "boss");
  bossCrown.setEnabled(mode === "character-lab" && type === "boss");
  viewerRing.setEnabled(mode === "character-lab" && characterRing.checked);
  characterHealthbar.classList.toggle("hidden", mode !== "character-lab" || !characterHealth.checked);

  characterMesh.scaling.setAll(scale);
  enemyMesh.scaling.setAll(scale);
  bossViewerMesh.scaling.setAll(scale);
  bossCrown.scaling.setAll(scale);

  const ringScale = type === "boss" ? 1.35 * scale : scale;
  viewerRing.scaling.setAll(ringScale);
}

function updateCharacterLab(deltaSeconds: number) {
  characterActionTime += deltaSeconds;
  syncCharacterViewer();

  const type = characterType.value;
  const active = type === "character" ? characterMesh : type === "enemy" ? enemyMesh : bossViewerMesh;
  const baseY = type === "character" ? 1.15 : type === "enemy" ? 1.2 : 2.1;
  const pulse = Math.sin(characterActionTime * 2.2);

  active.position.y = baseY + pulse * 0.04;
  active.rotation.y += deltaSeconds * 0.22;

  if (characterAction === "attack") {
    active.rotation.z = Math.sin(characterActionTime * 8) * 0.18;
  } else if (characterAction === "cast") {
    active.scaling.y *= 1 + Math.max(0, Math.sin(characterActionTime * 5)) * 0.01;
    viewerRing.rotation.y += deltaSeconds * 2.5;
  } else if (characterAction === "hit") {
    active.rotation.z = Math.sin(characterActionTime * 14) * 0.08;
  } else {
    active.rotation.z *= 0.85;
  }

  if (type === "boss") {
    bossCrown.rotation.y -= deltaSeconds * 0.5;
  }
}

function returnToHub() {
  if (mode === "hub") return;
  ws?.close();
  ws = null;
  snapshot = undefined;
  myId = "";
  clearEncounterMeshes();
  bossFill.style.width = "100%";
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
    socket.send(JSON.stringify({ type: "join", name: `Player-${Math.floor(Math.random() * 999)}` }));
  };

  socket.onclose = () => {
    if (ws === socket && mode === "encounter") status.textContent = "Disconnected";
  };

  socket.onmessage = (event) => {
    if (ws !== socket || mode !== "encounter") return;

    const packet = JSON.parse(event.data) as ServerMessage;

    if (packet.type === "welcome") myId = packet.id;

    if (packet.type === "event") {
      message.textContent = packet.text;
      setTimeout(() => {
        if (message.textContent === packet.text) message.textContent = "";
      }, 1800);
    }

    if (packet.type === "snapshot") {
      snapshot = packet;
      bossFill.style.width = `${(packet.boss.hp / packet.boss.maxHp) * 100}%`;
      status.textContent = `${packet.phase.toUpperCase()} · ${packet.players.length} player(s) · ready ${packet.readyCount}/${packet.players.length}`;
      syncEncounter(packet);
    }
  };
}

function syncEncounter(state: Snapshot) {
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
      playerMeshes.set(p.id, mesh);
    }

    mesh.setEnabled(mode === "encounter");
    mesh.position.set(p.pos.x, 0.8, p.pos.z);
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

function send(payload: unknown) {
  if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));
}

function hubPortalDistance() {
  return Math.hypot(hubPlayer.position.x, hubPlayer.position.z + 6.4);
}

addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  keys.add(key);

  if (key === "escape") {
    if (mode === "vfx-lab" || mode === "character-lab") {
      resetLabVfx();
      setMode("game-dev");
      return;
    }
    if (mode === "game-dev") {
      setMode("hub");
      return;
    }
  }

  if (mode === "hub" && key === "e" && hubPortalDistance() <= 3) {
    enterEncounter();
    return;
  }

  if (mode !== "encounter") return;

  if (["1", "2", "3", "4"].includes(event.key)) {
    send({ type: "ability", slot: Number(event.key) });
  }

  if (key === "r") send({ type: "ready" });
  if (key === "h") returnToHub();
});

gameDevButtons.forEach((button) => button.addEventListener("click", openGameDev));
openVfxLabButton.addEventListener("click", openVfxLab);
openCharacterLabButton.addEventListener("click", openCharacterLab);
backToHubButtons.forEach((button) => button.addEventListener("click", () => setMode("hub")));
backToDevButtons.forEach((button) => button.addEventListener("click", () => {
  resetLabVfx();
  setMode("game-dev");
}));
vfxCastButton.addEventListener("click", castLabSpell);
vfxResetButton.addEventListener("click", resetLabVfx);
characterType.addEventListener("change", () => {
  characterAction = "idle";
  characterActionTime = 0;
  syncCharacterViewer();
});
characterScale.addEventListener("input", syncCharacterViewer);
characterRing.addEventListener("change", syncCharacterViewer);
characterHealth.addEventListener("change", syncCharacterViewer);
characterActionButtons.forEach((button) => button.addEventListener("click", () => {
  characterAction = (button.dataset.action ?? "idle") as "idle" | "attack" | "cast" | "hit";
  characterActionTime = 0;
}));

addEventListener("keyup", (event) => keys.delete(event.key.toLowerCase()));

setInterval(() => {
  if (mode !== "encounter" || ws?.readyState !== WebSocket.OPEN) return;

  const x = (keys.has("d") ? 1 : 0) - (keys.has("a") ? 1 : 0);
  const z = (keys.has("s") ? 1 : 0) - (keys.has("w") ? 1 : 0);
  send({ type: "input", seq: seq++, move: { x, z } });
}, 50);

function updateHub(deltaSeconds: number) {
  const x = (keys.has("d") ? 1 : 0) - (keys.has("a") ? 1 : 0);
  const z = (keys.has("s") ? 1 : 0) - (keys.has("w") ? 1 : 0);
  const length = Math.hypot(x, z);

  if (length > 0) {
    const speed = 5.4;
    hubPlayer.position.x += (x / length) * speed * deltaSeconds;
    hubPlayer.position.z += (z / length) * speed * deltaSeconds;
    hubPlayer.position.x = Math.max(-11.5, Math.min(11.5, hubPlayer.position.x));
    hubPlayer.position.z = Math.max(-9.5, Math.min(9.5, hubPlayer.position.z));
    hubPlayerRing.position.x = hubPlayer.position.x;
    hubPlayerRing.position.z = hubPlayer.position.z;
  }

  const nearGate = hubPortalDistance() <= 3;
  status.textContent = nearGate ? "Expedition Gate · press E" : "Sanctum Hub";

  const pulse = 1 + Math.sin(performance.now() * 0.003) * 0.08;
  portalRing.scaling.set(pulse, 1, pulse);
}

setMode("hub");

engine.runRenderLoop(() => {
  const deltaSeconds = Math.min(engine.getDeltaTime() / 1000, 0.05);
  if (mode === "hub") updateHub(deltaSeconds);
  else if (mode === "encounter" && snapshot) {
    bossRing.rotation.y += deltaSeconds * 0.5;
  } else if (mode === "vfx-lab") {
    updateLabVfx(deltaSeconds);
    vfxCasterRing.rotation.y += deltaSeconds * 0.6;
    vfxDummyRing.rotation.y -= deltaSeconds * 0.35;
  } else if (mode === "character-lab") {
    updateCharacterLab(deltaSeconds);
  }
  scene.render();
});

addEventListener("resize", () => engine.resize());
