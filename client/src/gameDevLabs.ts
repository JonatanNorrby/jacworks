import {
  ArcRotateCamera,
  Color3,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import { CLASS_DEFINITIONS } from "../../shared/classes";
import { SKILLS } from "../../shared/protocol";
import type { SkillId } from "../../shared/protocol";

type View = "menu" | "vfx" | "characters";

type PlayerPreview = {
  skill: SkillId;
  group: string;
};

type BossPreview = {
  id: string;
  boss: "warden" | "hardWarden" | "greenCone" | "yellowBall" | "hardYellowBall";
  name: string;
  description: string;
};

type LabAnimation = {
  mesh: Mesh;
  born: number;
  delay: number;
  duration: number;
  kind: "fade" | "grow" | "move" | "bounce" | "spawn";
  from?: Vector3;
  to?: Vector3;
  grow?: number;
  peak?: number;
};

type InstallOptions = {
  scene: Scene;
  camera: ArcRotateCamera;
  spawnAbilityFx: (skill: SkillId, from: { x: number; z: number }, to: { x: number; z: number }) => void;
  clearAbilityFx: () => void;
  onOpen?: () => void;
  onClose?: () => void;
};

const PLAYER_PREVIEWS: PlayerPreview[] = (() => {
  const entries: PlayerPreview[] = [];
  const seen = new Set<SkillId>();
  for (const definition of Object.values(CLASS_DEFINITIONS)) {
    for (const skill of definition.skills) {
      if (skill === "dash" || seen.has(skill)) continue;
      seen.add(skill);
      entries.push({ skill, group: definition.name });
    }
  }
  entries.push({ skill: "dash", group: "Shared" });
  entries.push({ skill: "backstab", group: "Rogue · Vanish form" });
  entries.push({ skill: "arcSpear", group: "Lightning Mage · Primitive Wand" });
  return entries;
})();

const BOSS_PREVIEWS: BossPreview[] = [
  { id: "warden-marked", boss: "warden", name: "Warden · Marked Blast", description: "Single targeted danger circle." },
  { id: "warden-spread", boss: "warden", name: "Warden · Spread Blast", description: "Multiple player markers resolve together." },
  { id: "warden-sweep", boss: "warden", name: "Warden · Directional Sweep", description: "Long directional line telegraph from the boss." },
  { id: "hard-scatter", boss: "hardWarden", name: "Hard Warden · Triple Scatter", description: "Three sequential target markers, spaced in time." },
  { id: "hard-large", boss: "hardWarden", name: "Hard Warden · Large Marked Blast", description: "Large targeted circle with reduced reaction space." },
  { id: "hard-cover", boss: "hardWarden", name: "Hard Warden · 360° Cover Sweep", description: "Arena-wide pulse intended to be blocked by the two pillars." },
  { id: "green-slam", boss: "greenCone", name: "Green Cone · Close-range Slam", description: "Short-range circle around the moving boss." },
  { id: "green-adds", boss: "greenCone", name: "Green Cone · Add Summon", description: "Two cone adds materialize beside the boss." },
  { id: "yellow-roll", boss: "yellowBall", name: "Yellow Ball · Rolling Charge", description: "Line warning followed by a rolling body attack." },
  { id: "yellow-bounce", boss: "yellowBall", name: "Yellow Ball · Bouncing Slam", description: "Targeted landing circle followed by an arcing bounce." },
  { id: "yellow-split", boss: "yellowBall", name: "Yellow Ball · Half-health Split", description: "The ball retires and becomes two smaller targets." },
  { id: "hard-yellow-roll", boss: "hardYellowBall", name: "Hard Yellow Ball · Rolling Charge", description: "Hard-tier rolling attack at the larger encounter pace." },
  { id: "hard-yellow-bounce", boss: "hardYellowBall", name: "Hard Yellow Ball · Triple Bounce", description: "Three chained landing warnings and bounce impacts." },
  { id: "hard-yellow-split", boss: "hardYellowBall", name: "Hard Yellow Ball · Three-generation Split", description: "Visualises the 1 → 2 → 4 → 8 split progression." },
];

const ENTITY_PREVIEWS = [
  ...Object.values(CLASS_DEFINITIONS).map((definition) => ({
    id: `class:${definition.id}`,
    label: `Character · ${definition.name}`,
    kind: "character" as const,
  })),
  { id: "enemy:cone-add", label: "Enemy · Cone Add", kind: "enemy" as const },
  { id: "enemy:fire-totem", label: "Enemy/Unit · Fire Totem", kind: "totem" as const },
  { id: "enemy:healing-totem", label: "Unit · Healing Totem", kind: "totem" as const },
  { id: "boss:warden", label: "Boss · Warden", kind: "boss" as const },
  { id: "boss:hardWarden", label: "Boss · Hard Warden", kind: "boss" as const },
  { id: "boss:greenCone", label: "Boss · Green Cone", kind: "boss" as const },
  { id: "boss:yellowBall", label: "Boss · Yellow Ball", kind: "boss" as const },
  { id: "boss:hardYellowBall", label: "Boss · Hard Yellow Ball", kind: "boss" as const },
];

export function installGameDevLabs(options: InstallOptions) {
  const { scene, camera } = options;
  const labMeshes = new Set<Mesh>();
  const savedMeshState = new Map<Mesh, boolean>();
  const animations: LabAnimation[] = [];
  let open = false;
  let view: View = "menu";
  let loopTimer = 0;
  let activeEntity: Mesh | null = null;
  let activeBoss: Mesh | null = null;
  let characterAction: "idle" | "attack" | "cast" | "hit" = "idle";
  let characterActionTime = 0;

  const mat = (name: string, diffuse: Color3, emissive?: Color3, alpha = 1) => {
    const material = new StandardMaterial(name, scene);
    material.diffuseColor = diffuse;
    material.alpha = alpha;
    if (emissive) material.emissiveColor = emissive;
    return material;
  };

  const groundMat = mat("dev-ground", new Color3(0.045, 0.055, 0.07));
  const gridMat = mat("dev-grid", new Color3(0.15, 0.18, 0.22), new Color3(0.025, 0.03, 0.04));
  const playerMat = mat("dev-player", new Color3(0.18, 0.58, 0.95), new Color3(0.04, 0.22, 0.5));
  const targetMat = mat("dev-target", new Color3(0.34, 0.28, 0.22));
  const dangerMat = mat("dev-danger", new Color3(1, 0.22, 0.1), new Color3(0.45, 0.035, 0.01), 0.34);
  const holyMat = mat("dev-holy", new Color3(1, 0.9, 0.35), new Color3(0.75, 0.55, 0.08), 0.68);
  const greenMat = mat("dev-green", new Color3(0.12, 0.78, 0.24), new Color3(0.02, 0.24, 0.04), 0.9);
  const yellowMat = mat("dev-yellow", new Color3(1, 0.82, 0.03), new Color3(0.5, 0.28, 0), 0.9);
  const bossMat = mat("dev-boss", new Color3(0.5, 0.055, 0.08), new Color3(0.25, 0.01, 0.02));
  const ringMat = mat("dev-ring", new Color3(0.25, 0.75, 1), new Color3(0.08, 0.35, 0.7), 0.7);

  const tag = <T extends Mesh>(mesh: T, group: "vfx" | "characters" | "both" = "both"): T => {
    mesh.metadata = { ...(mesh.metadata ?? {}), gameDevLab: true, gameDevGroup: group };
    labMeshes.add(mesh);
    mesh.setEnabled(false);
    return mesh;
  };

  const ground = tag(MeshBuilder.CreateGround("dev-lab-ground", { width: 24, height: 18 }, scene));
  ground.material = groundMat;
  for (let x = -12; x <= 12; x += 2) {
    const line = tag(MeshBuilder.CreateBox(`dev-grid-x-${x}`, { width: 0.018, height: 0.012, depth: 18 }, scene));
    line.position.set(x, 0.012, 0);
    line.material = gridMat;
  }
  for (let z = -8; z <= 8; z += 2) {
    const line = tag(MeshBuilder.CreateBox(`dev-grid-z-${z}`, { width: 24, height: 0.012, depth: 0.018 }, scene));
    line.position.set(0, 0.012, z);
    line.material = gridMat;
  }

  const caster = tag(MeshBuilder.CreateCapsule("dev-caster", { height: 1.8, radius: 0.5 }, scene), "vfx");
  caster.position.set(-2.3, 0.9, 4);
  caster.material = playerMat;
  const casterRing = tag(MeshBuilder.CreateTorus("dev-caster-ring", { diameter: 1.7, thickness: 0.08, tessellation: 36 }, scene), "vfx");
  casterRing.position.set(-2.3, 0.08, 4);
  casterRing.material = ringMat;

  const dummyPositions = [
    new Vector3(1.7, 0, -2.6),
    new Vector3(-2.5, 0, -2.2),
    new Vector3(4.5, 0, -1.8),
  ];
  const dummies = dummyPositions.map((position, i) => {
    const dummy = tag(MeshBuilder.CreateCylinder(`dev-dummy-${i}`, { diameter: 1.15, height: 1.9, tessellation: 10 }, scene), "vfx");
    dummy.position.set(position.x, 0.95, position.z);
    dummy.material = targetMat;
    return dummy;
  });

  const viewerRing = tag(MeshBuilder.CreateTorus("dev-viewer-ring", { diameter: 3.3, thickness: 0.11, tessellation: 48 }, scene), "characters");
  viewerRing.position.set(1.5, 0.08, 0);
  viewerRing.material = ringMat;

  const root = document.createElement("section");
  root.id = "game-dev-labs";
  root.className = "hidden";
  root.innerHTML = `
    <div class="devlab-topbar">
      <div>
        <div class="eyebrow">GAME DEV</div>
        <h1>Development Labs</h1>
      </div>
      <button type="button" data-dev-action="close">Return to Hub</button>
    </div>

    <div class="devlab-menu">
      <button type="button" class="devlab-card" data-dev-view="vfx">
        <strong>Visual VFX Lab</strong>
        <span>Inspect all ${PLAYER_PREVIEWS.length} active player spell/ability variants and all ${BOSS_PREVIEWS.length} boss mechanics.</span>
      </button>
      <button type="button" class="devlab-card" data-dev-view="characters">
        <strong>Character, Enemy &amp; Boss Lab</strong>
        <span>Inspect every current class silhouette, enemy unit and boss with quick presentation states.</span>
      </button>
    </div>

    <aside class="devlab-panel devlab-vfx hidden">
      <button type="button" class="devlab-back" data-dev-action="menu">← Labs</button>
      <div class="eyebrow">VISUAL VFX LAB</div>
      <h2>Production preview</h2>
      <div class="devlab-tabs">
        <button type="button" data-vfx-tab="players" class="active">Player abilities · ${PLAYER_PREVIEWS.length}</button>
        <button type="button" data-vfx-tab="bosses">Boss mechanics · ${BOSS_PREVIEWS.length}</button>
      </div>
      <label class="devlab-field player-vfx-control">Ability<select id="dev-player-spell"></select></label>
      <label class="devlab-field boss-vfx-control hidden">Boss mechanic<select id="dev-boss-mechanic"></select></label>
      <p id="dev-vfx-description"></p>
      <label class="devlab-check"><input id="dev-auto-loop" type="checkbox"/> Auto replay</label>
      <button type="button" class="devlab-primary" data-dev-action="play-vfx">Play preview</button>
      <button type="button" data-dev-action="clear-vfx">Clear</button>
      <p class="devlab-note">Player previews use the same <code>spawnAbilityFx</code> renderer as live combat. Boss previews recreate the authoritative telegraphs and movement patterns in isolation.</p>
    </aside>

    <aside class="devlab-panel devlab-characters hidden">
      <button type="button" class="devlab-back" data-dev-action="menu">← Labs</button>
      <div class="eyebrow">CHARACTER, ENEMY &amp; BOSS LAB</div>
      <h2>Silhouette viewer</h2>
      <label class="devlab-field">Entity<select id="dev-entity"></select></label>
      <label class="devlab-field">Scale<input id="dev-entity-scale" type="range" min="0.65" max="1.65" value="1" step="0.05"/></label>
      <label class="devlab-check"><input id="dev-target-ring" type="checkbox" checked/> Target ring</label>
      <div class="devlab-action-grid">
        <button type="button" data-character-action="idle">Idle</button>
        <button type="button" data-character-action="attack">Attack</button>
        <button type="button" data-character-action="cast">Cast</button>
        <button type="button" data-character-action="hit">Hit</button>
      </div>
      <p class="devlab-note">These are the current prototype silhouettes, not final art. The lab is for scale, readability and animation direction.</p>
    </aside>

    <div class="devlab-stage-label"></div>
  `;
  document.body.append(root);

  const playerSelect = root.querySelector<HTMLSelectElement>("#dev-player-spell")!;
  for (const preview of PLAYER_PREVIEWS) {
    const option = document.createElement("option");
    option.value = preview.skill;
    option.textContent = `${preview.group} · ${SKILLS[preview.skill].name}`;
    playerSelect.append(option);
  }

  const bossSelect = root.querySelector<HTMLSelectElement>("#dev-boss-mechanic")!;
  for (const preview of BOSS_PREVIEWS) {
    const option = document.createElement("option");
    option.value = preview.id;
    option.textContent = preview.name;
    bossSelect.append(option);
  }

  const entitySelect = root.querySelector<HTMLSelectElement>("#dev-entity")!;
  for (const entity of ENTITY_PREVIEWS) {
    const option = document.createElement("option");
    option.value = entity.id;
    option.textContent = entity.label;
    entitySelect.append(option);
  }

  const description = root.querySelector<HTMLElement>("#dev-vfx-description")!;
  const autoLoop = root.querySelector<HTMLInputElement>("#dev-auto-loop")!;
  const stageLabel = root.querySelector<HTMLElement>(".devlab-stage-label")!;
  const scaleInput = root.querySelector<HTMLInputElement>("#dev-entity-scale")!;
  const ringInput = root.querySelector<HTMLInputElement>("#dev-target-ring")!;
  let vfxTab: "players" | "bosses" = "players";

  const gameDevButton = document.createElement("button");
  gameDevButton.id = "game-dev-button";
  gameDevButton.type = "button";
  gameDevButton.textContent = "Game Dev";
  document.querySelector("#hub-card")?.append(gameDevButton);
  gameDevButton.addEventListener("click", openMenu);

  function currentPlayerPreview() {
    return PLAYER_PREVIEWS.find((entry) => entry.skill === playerSelect.value) ?? PLAYER_PREVIEWS[0];
  }

  function currentBossPreview() {
    return BOSS_PREVIEWS.find((entry) => entry.id === bossSelect.value) ?? BOSS_PREVIEWS[0];
  }

  function updateVfxCopy() {
    if (vfxTab === "players") {
      if (activeBoss && !activeBoss.isDisposed()) activeBoss.setEnabled(false);
      const preview = currentPlayerPreview();
      description.textContent = SKILLS[preview.skill].description;
      stageLabel.textContent = `${preview.group} · ${SKILLS[preview.skill].name}`;
    } else {
      const preview = currentBossPreview();
      description.textContent = preview.description;
      stageLabel.textContent = preview.name;
      setBossAppearance(preview.boss);
    }
  }

  function captureWorld() {
    savedMeshState.clear();
    for (const mesh of scene.meshes) {
      if (labMeshes.has(mesh) || mesh.metadata?.gameDevFx) continue;
      savedMeshState.set(mesh as Mesh, mesh.isEnabled());
      mesh.setEnabled(false);
    }
  }

  function suppressWorld() {
    for (const mesh of scene.meshes) {
      if (labMeshes.has(mesh) || mesh.metadata?.gameDevFx) continue;
      mesh.setEnabled(false);
    }
  }

  function restoreWorld() {
    for (const [mesh, enabled] of savedMeshState) {
      if (!mesh.isDisposed()) mesh.setEnabled(enabled);
    }
    savedMeshState.clear();
  }

  function enableLabGroup(group: "vfx" | "characters" | null) {
    for (const mesh of labMeshes) {
      if (mesh.isDisposed()) continue;
      const meshGroup = mesh.metadata?.gameDevGroup as string | undefined;
      mesh.setEnabled(group !== null && (meshGroup === "both" || meshGroup === group));
    }
    if (group !== "vfx" && activeBoss && !activeBoss.isDisposed()) activeBoss.setEnabled(false);
    if (group !== "characters" && activeEntity && !activeEntity.isDisposed()) activeEntity.setEnabled(false);
  }

  function openMenu() {
    if (!open) {
      options.onOpen?.();
      captureWorld();
      open = true;
    }
    view = "menu";
    resetTransient();
    enableLabGroup(null);
    root.classList.remove("hidden");
    root.querySelector(".devlab-menu")?.classList.remove("hidden");
    root.querySelector(".devlab-vfx")?.classList.add("hidden");
    root.querySelector(".devlab-characters")?.classList.add("hidden");
    stageLabel.textContent = "Choose a lab";
    camera.target.set(0, 0, 0);
    camera.radius = 25;
  }

  function openVfx() {
    view = "vfx";
    resetTransient();
    enableLabGroup("vfx");
    root.querySelector(".devlab-menu")?.classList.add("hidden");
    root.querySelector(".devlab-vfx")?.classList.remove("hidden");
    root.querySelector(".devlab-characters")?.classList.add("hidden");
    camera.target.set(0.8, 0, 0);
    camera.radius = 24;
    updateVfxCopy();
    if (vfxTab === "bosses") setBossAppearance(currentBossPreview().boss);
  }

  function openCharacters() {
    view = "characters";
    resetTransient();
    enableLabGroup("characters");
    root.querySelector(".devlab-menu")?.classList.add("hidden");
    root.querySelector(".devlab-vfx")?.classList.add("hidden");
    root.querySelector(".devlab-characters")?.classList.remove("hidden");
    camera.target.set(1.5, 0.7, 0);
    camera.radius = 18;
    rebuildEntity();
  }

  function close() {
    if (!open) return;
    resetTransient();
    disposeEntity();
    if (activeBoss && !activeBoss.isDisposed()) activeBoss.dispose();
    activeBoss = null;
    enableLabGroup(null);
    root.classList.add("hidden");
    open = false;
    restoreWorld();
    options.onClose?.();
  }

  function back() {
    if (!open) return;
    if (view === "menu") close();
    else openMenu();
  }

  function resetTransient() {
    options.clearAbilityFx();
    for (const animation of animations) {
      if (!animation.mesh.isDisposed()) animation.mesh.dispose();
    }
    animations.length = 0;
    for (const mesh of [...labMeshes]) {
      if (mesh.metadata?.gameDevTransient) {
        if (!mesh.isDisposed()) mesh.dispose();
        labMeshes.delete(mesh);
      }
    }
    if (activeBoss && !activeBoss.isDisposed()) activeBoss.setEnabled(view === "vfx");
    loopTimer = 0;
  }

  function transient<T extends Mesh>(mesh: T): T {
    tag(mesh, "vfx");
    mesh.metadata = { ...(mesh.metadata ?? {}), gameDevTransient: true };
    mesh.setEnabled(true);
    return mesh;
  }

  function addAnimation(animation: Omit<LabAnimation, "born">) {
    animation.mesh.setEnabled(animation.delay <= 0);
    animations.push({ ...animation, born: performance.now() });
  }

  function circle(x: number, z: number, radius: number, delay = 0, duration = 1500, material = dangerMat) {
    const mesh = transient(MeshBuilder.CreateCylinder("dev-circle", { diameter: radius * 2, height: 0.035, tessellation: 48 }, scene));
    mesh.position.set(x, 0.04, z);
    mesh.material = material;
    addAnimation({ mesh, delay, duration, kind: "fade" });
    return mesh;
  }

  function line(x: number, z: number, width: number, length: number, delay = 0, duration = 1500) {
    const mesh = transient(MeshBuilder.CreateBox("dev-line", { width, height: 0.035, depth: length }, scene));
    mesh.position.set(x, 0.04, z - length / 2);
    mesh.material = dangerMat;
    addAnimation({ mesh, delay, duration, kind: "fade" });
    return mesh;
  }

  function markNewAbilityFx(before: Set<Mesh>) {
    for (const mesh of scene.meshes) {
      if (!before.has(mesh as Mesh) && !labMeshes.has(mesh as Mesh)) {
        mesh.metadata = { ...(mesh.metadata ?? {}), gameDevFx: true };
      }
    }
  }

  function playPlayerPreview() {
    resetTransient();
    const skill = currentPlayerPreview().skill;
    const from = { x: -2.3, z: 4 };
    const target = { x: 1.7, z: -2.6 };
    const before = new Set(scene.meshes as Mesh[]);

    if (skill === "splitShot") {
      options.spawnAbilityFx(skill, from, { x: -0.6, z: -3.2 });
      options.spawnAbilityFx(skill, from, target);
      options.spawnAbilityFx(skill, from, { x: 4.0, z: -2.9 });
    } else if (["guard", "bulwark", "vanish", "poisonEnchant"].includes(skill)) {
      options.spawnAbilityFx(skill, from, from);
    } else if (["targetedHeal", "lightningShield", "heroicShield"].includes(skill)) {
      options.spawnAbilityFx(skill, from, { x: -0.2, z: 1.2 });
    } else if (skill === "dash") {
      options.spawnAbilityFx(skill, from, { x: -2.3, z: 0.5 });
    } else {
      options.spawnAbilityFx(skill, from, target);
    }

    markNewAbilityFx(before);
    loopTimer = 1.5;
  }

  function setBossAppearance(boss: BossPreview["boss"]) {
    if (activeBoss && !activeBoss.isDisposed()) activeBoss.dispose();
    if (boss === "greenCone") {
      activeBoss = tag(MeshBuilder.CreateCylinder("dev-green-boss", { height: 2.9, diameterTop: 0, diameterBottom: 2.5, tessellation: 24 }, scene), "vfx");
      activeBoss.material = greenMat;
      activeBoss.position.set(0, 1.45, -0.5);
    } else if (boss === "yellowBall" || boss === "hardYellowBall") {
      activeBoss = tag(MeshBuilder.CreateSphere("dev-yellow-boss", { diameter: boss === "hardYellowBall" ? 2.8 : 2.5, segments: 24 }, scene), "vfx");
      activeBoss.material = yellowMat;
      activeBoss.position.set(0, 1.25, -0.5);
    } else {
      activeBoss = tag(MeshBuilder.CreateCylinder("dev-warden-boss", { diameter: boss === "hardWarden" ? 2.8 : 2.5, height: boss === "hardWarden" ? 3.2 : 2.9, tessellation: 12 }, scene), "vfx");
      activeBoss.material = bossMat;
      activeBoss.position.set(0, boss === "hardWarden" ? 1.6 : 1.45, -0.5);
    }
    activeBoss.setEnabled(open && view === "vfx");
  }

  function movingBall(from: Vector3, to: Vector3, delay: number, duration: number, bounce = false, scale = 1) {
    const mesh = transient(MeshBuilder.CreateSphere("dev-moving-ball", { diameter: 2.5 * scale, segments: 20 }, scene));
    mesh.material = yellowMat;
    mesh.position.copyFrom(from);
    addAnimation({ mesh, delay, duration, kind: bounce ? "bounce" : "move", from, to, peak: bounce ? 4 * scale : undefined });
  }

  function spawnSplitGeneration(positions: Vector3[], size: number, delay: number, duration = 900) {
    for (const pos of positions) {
      const mesh = transient(MeshBuilder.CreateSphere("dev-split-ball", { diameter: 2.5 * size, segments: 18 }, scene));
      mesh.material = yellowMat;
      mesh.position.copyFrom(pos);
      mesh.scaling.setAll(0.05);
      addAnimation({ mesh, delay, duration, kind: "spawn", grow: 0.95 });
    }
  }

  function playBossPreview() {
    resetTransient();
    const preview = currentBossPreview();
    setBossAppearance(preview.boss);

    switch (preview.id) {
      case "warden-marked":
        circle(1.7, -2.6, 2.2);
        break;
      case "warden-spread":
        circle(1.7, -2.6, 3.1);
        circle(-2.5, -2.2, 3.1);
        circle(4.5, -1.8, 3.1);
        break;
      case "warden-sweep":
        line(0, -0.5, 3, 13);
        break;
      case "hard-scatter":
        circle(1.7, -2.6, 2.6, 0);
        circle(-2.5, -2.2, 2.6, 500);
        circle(4.5, -1.8, 2.6, 1000);
        break;
      case "hard-large":
        circle(1.7, -2.6, 4.2);
        break;
      case "hard-cover": {
        circle(0, -0.5, 8.5, 0, 1600);
        for (const x of [-4, 4]) {
          const pillar = transient(MeshBuilder.CreateCylinder("dev-hard-pillar", { diameter: 2, height: 3 }, scene));
          pillar.position.set(x, 1.5, 0);
          pillar.material = targetMat;
        }
        break;
      }
      case "green-slam":
        circle(0, -0.5, 3);
        break;
      case "green-adds":
        for (const x of [-2, 2]) {
          const add = transient(MeshBuilder.CreateCylinder("dev-cone-add", { height: 1.1, diameterTop: 0, diameterBottom: 0.9, tessellation: 16 }, scene));
          add.position.set(x, 0.55, -0.5);
          add.material = greenMat;
          add.scaling.setAll(0.05);
          addAnimation({ mesh: add, delay: 350, duration: 650, kind: "spawn", grow: 0.95 });
        }
        break;
      case "yellow-roll":
        line(0, -0.5, 3.5, 10);
        movingBall(new Vector3(0, 1.25, -0.5), new Vector3(0, 1.25, -7.5), 1500, 850);
        break;
      case "yellow-bounce":
        circle(1.7, -2.6, 2.8);
        movingBall(new Vector3(0, 1.25, -0.5), new Vector3(1.7, 1.25, -2.6), 1500, 1000, true);
        break;
      case "yellow-split":
        spawnSplitGeneration([new Vector3(-1.2, 0.9, -0.5), new Vector3(1.2, 0.9, -0.5)], 0.72, 700);
        break;
      case "hard-yellow-roll":
        line(0, -0.5, 3.7, 10, 0, 1200);
        movingBall(new Vector3(0, 1.4, -0.5), new Vector3(0, 1.4, -7.5), 1200, 700, false, 1.1);
        break;
      case "hard-yellow-bounce": {
        const points = [
          new Vector3(2.2, 1.1, -2.2),
          new Vector3(-2.2, 1.1, -4.1),
          new Vector3(1.4, 1.1, -6.1),
        ];
        points.forEach((point, i) => circle(point.x, point.z, 2.8, i * 950, 900));
        movingBall(new Vector3(0, 1.3, -0.5), points[0], 1100, 800, true);
        movingBall(points[0], points[1], 2050, 800, true);
        movingBall(points[1], points[2], 3000, 800, true);
        break;
      }
      case "hard-yellow-split":
        spawnSplitGeneration([new Vector3(-1.4, 1, -0.5), new Vector3(1.4, 1, -0.5)], 0.72, 500);
        spawnSplitGeneration(
          [new Vector3(-3, 0.75, -1), new Vector3(-1, 0.75, -1), new Vector3(1, 0.75, -1), new Vector3(3, 0.75, -1)],
          0.52,
          1500,
        );
        spawnSplitGeneration(
          [-5, -3.5, -2, -0.5, 1, 2.5, 4, 5.5].map((x) => new Vector3(x, 0.55, -2.2)),
          0.37,
          2600,
        );
        break;
    }

    loopTimer = preview.id === "hard-yellow-bounce" ? 4.4 : preview.id === "hard-yellow-split" ? 3.8 : 2.4;
  }

  function playCurrentVfx() {
    if (vfxTab === "players") playPlayerPreview();
    else playBossPreview();
  }

  function clearCurrentVfx() {
    resetTransient();
    if (vfxTab === "bosses") setBossAppearance(currentBossPreview().boss);
  }

  function disposeEntity() {
    if (activeEntity && !activeEntity.isDisposed()) activeEntity.dispose();
    activeEntity = null;
  }

  function entityMaterial(id: string) {
    if (id.includes("priest")) return holyMat;
    if (id.includes("shaman") || id.includes("lightningMage")) return ringMat;
    if (id.includes("fireMage") || id.includes("rogue")) return dangerMat;
    if (id.includes("ranger")) return greenMat;
    if (id.includes("warrior") || id.includes("defender")) return bossMat;
    if (id.includes("yellowBall")) return yellowMat;
    if (id.includes("greenCone") || id.includes("cone-add")) return greenMat;
    if (id.includes("totem")) return id.includes("healing") ? holyMat : dangerMat;
    return playerMat;
  }

  function rebuildEntity() {
    disposeEntity();
    const entry = ENTITY_PREVIEWS.find((item) => item.id === entitySelect.value) ?? ENTITY_PREVIEWS[0];
    const id = entry.id;

    if (id.includes("greenCone") || id.includes("cone-add")) {
      activeEntity = tag(MeshBuilder.CreateCylinder("dev-entity-cone", {
        height: id.includes("cone-add") ? 1.1 : 2.9,
        diameterTop: 0,
        diameterBottom: id.includes("cone-add") ? 0.9 : 2.5,
        tessellation: 20,
      }, scene), "characters");
      activeEntity.position.set(1.5, id.includes("cone-add") ? 0.55 : 1.45, 0);
    } else if (id.includes("yellowBall")) {
      activeEntity = tag(MeshBuilder.CreateSphere("dev-entity-ball", {
        diameter: id.includes("hardYellowBall") ? 2.8 : 2.5,
        segments: 24,
      }, scene), "characters");
      activeEntity.position.set(1.5, 1.3, 0);
    } else if (id.includes("totem")) {
      activeEntity = tag(MeshBuilder.CreateCylinder("dev-entity-totem", { height: 1.2, diameter: 0.55, tessellation: 8 }, scene), "characters");
      activeEntity.position.set(1.5, 0.6, 0);
    } else if (id.includes("warden")) {
      activeEntity = tag(MeshBuilder.CreateCylinder("dev-entity-warden", {
        diameter: id.includes("hardWarden") ? 2.8 : 2.5,
        height: id.includes("hardWarden") ? 3.2 : 2.9,
        tessellation: 12,
      }, scene), "characters");
      activeEntity.position.set(1.5, id.includes("hardWarden") ? 1.6 : 1.45, 0);
    } else {
      activeEntity = tag(MeshBuilder.CreateCapsule("dev-entity-character", { height: 1.8, radius: 0.5 }, scene), "characters");
      activeEntity.position.set(1.5, 0.9, 0);
    }

    activeEntity.material = entityMaterial(id);
    activeEntity.setEnabled(true);
    characterAction = "idle";
    characterActionTime = 0;
    syncEntityScale();
    stageLabel.textContent = entry.label;
  }

  function syncEntityScale() {
    if (!activeEntity) return;
    activeEntity.scaling.setAll(Number(scaleInput.value));
    viewerRing.scaling.setAll(Math.max(0.8, Number(scaleInput.value)));
    viewerRing.setEnabled(open && view === "characters" && ringInput.checked);
  }

  function updateAnimations(now: number) {
    for (let i = animations.length - 1; i >= 0; i--) {
      const animation = animations[i];
      const elapsed = now - animation.born;
      if (elapsed < animation.delay) continue;
      animation.mesh.setEnabled(true);
      const t = Math.min(1, (elapsed - animation.delay) / animation.duration);

      if (animation.kind === "fade") {
        animation.mesh.visibility = Math.max(0.15, 1 - Math.max(0, t - 0.72) / 0.28);
      } else if (animation.kind === "grow" || animation.kind === "spawn") {
        const scale = animation.kind === "spawn" ? 0.05 + (animation.grow ?? 0.95) * Math.sin(Math.min(1, t) * Math.PI / 2) : 1 + (animation.grow ?? 1) * t;
        animation.mesh.scaling.setAll(scale);
        if (animation.kind === "grow") animation.mesh.visibility = 1 - t;
      } else if ((animation.kind === "move" || animation.kind === "bounce") && animation.from && animation.to) {
        animation.mesh.position.copyFrom(Vector3.Lerp(animation.from, animation.to, t));
        if (animation.kind === "bounce") animation.mesh.position.y += Math.sin(t * Math.PI) * (animation.peak ?? 4);
        animation.mesh.rotation.x += 0.18;
      }

      if (t >= 1 && animation.kind !== "spawn") {
        animation.mesh.dispose();
        labMeshes.delete(animation.mesh);
        animations.splice(i, 1);
      }
    }
  }

  function tick(deltaSeconds: number) {
    if (!open) return;
    suppressWorld();
    const now = performance.now();
    updateAnimations(now);

    casterRing.rotation.y += deltaSeconds * 0.7;
    viewerRing.rotation.y += deltaSeconds * 0.35;
    if (activeBoss && !activeBoss.isDisposed() && view === "vfx") activeBoss.rotation.y += deltaSeconds * 0.2;

    if (view === "characters" && activeEntity) {
      characterActionTime += deltaSeconds;
      const id = entitySelect.value;
      const baseY = id.includes("totem") ? 0.6 : id.includes("yellowBall") ? 1.3 : id.includes("greenCone") ? 1.45 : id.includes("warden") ? (id.includes("hardWarden") ? 1.6 : 1.45) : id.includes("cone-add") ? 0.55 : 0.9;
      activeEntity.position.y = baseY + Math.sin(characterActionTime * 2.1) * 0.035;
      activeEntity.rotation.y += deltaSeconds * 0.24;
      if (characterAction === "attack") activeEntity.rotation.z = Math.sin(characterActionTime * 8) * 0.18;
      else if (characterAction === "hit") activeEntity.rotation.z = Math.sin(characterActionTime * 14) * 0.1;
      else if (characterAction === "cast") {
        const pulse = 1 + Math.max(0, Math.sin(characterActionTime * 5)) * 0.06;
        const scale = Number(scaleInput.value);
        activeEntity.scaling.setAll(scale * pulse);
        viewerRing.rotation.y += deltaSeconds * 2.2;
      } else {
        activeEntity.rotation.z *= 0.82;
        activeEntity.scaling.setAll(Number(scaleInput.value));
      }
    }

    if (view === "vfx" && autoLoop.checked) {
      loopTimer -= deltaSeconds;
      if (loopTimer <= 0) playCurrentVfx();
    }
  }

  root.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const button = target.closest<HTMLButtonElement>("button");
    if (!button) return;

    if (button.dataset.devView === "vfx") openVfx();
    if (button.dataset.devView === "characters") openCharacters();

    if (button.dataset.devAction === "close") close();
    if (button.dataset.devAction === "menu") openMenu();
    if (button.dataset.devAction === "play-vfx") playCurrentVfx();
    if (button.dataset.devAction === "clear-vfx") clearCurrentVfx();

    if (button.dataset.vfxTab === "players" || button.dataset.vfxTab === "bosses") {
      vfxTab = button.dataset.vfxTab;
      root.querySelectorAll<HTMLButtonElement>("[data-vfx-tab]").forEach((tab) => tab.classList.toggle("active", tab === button));
      root.querySelector(".player-vfx-control")?.classList.toggle("hidden", vfxTab !== "players");
      root.querySelector(".boss-vfx-control")?.classList.toggle("hidden", vfxTab !== "bosses");
      resetTransient();
      updateVfxCopy();
    }

    const action = button.dataset.characterAction;
    if (action === "idle" || action === "attack" || action === "cast" || action === "hit") {
      characterAction = action;
      characterActionTime = 0;
    }
  });

  playerSelect.addEventListener("change", () => {
    clearCurrentVfx();
    updateVfxCopy();
  });
  bossSelect.addEventListener("change", () => {
    clearCurrentVfx();
    updateVfxCopy();
  });
  entitySelect.addEventListener("change", rebuildEntity);
  scaleInput.addEventListener("input", syncEntityScale);
  ringInput.addEventListener("change", syncEntityScale);

  return {
    isOpen: () => open,
    back,
    tick,
    openMenu,
    playerAbilityCount: PLAYER_PREVIEWS.length,
    bossMechanicCount: BOSS_PREVIEWS.length,
  };
}
