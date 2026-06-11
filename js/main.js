// main.js — BIOSPHERE entry point. Wires the renderer, player, world rooms,
// UI overlays, progress persistence and the chapter-to-chapter journey.
//
// Curriculum adapted from OpenStax "Concepts of Biology" (CC BY 4.0).

import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { UNITS, CHAPTERS, chapterByNumber, unitOf } from "./curriculum.js";
import { buildRoom } from "./world.js";
import { Player } from "./player.js";
import { UI } from "./ui.js";
import { createEnvironment } from "./env.js";
import { Audio } from "./audio.js";

const SAVE_KEY = "biosphere.save.v1";

/* ---------------- renderer / scene ---------------- */
const root = document.getElementById("scene-root");
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
root.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 400);

const player = new Player(camera, renderer.domElement);
scene.add(player.object);

// cosmic environment (sky, stars, reflection map) — persists across chapters
const environment = createEnvironment(renderer, scene);

// post-processing: bloom for the holographic glow
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.85, 0.6, 0.55);
composer.addPass(bloom);
composer.addPass(new OutputPass());

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

/* ---------------- progress ---------------- */
function loadProgress() {
  try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s && s.completed) return s; } catch (e) {}
  return { completed: [], maxUnlocked: 1, current: 1 };
}
function saveProgress() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(progress)); } catch (e) {} }
let progress = loadProgress();

/* ---------------- game state ---------------- */
let world = null;
let chapter = null;
let unit = null;
let chState = null;          // { readConcepts:Set, passed:bool }
let paused = true;
let suppressPause = false;   // true during warp transitions / finale
const clock = new THREE.Clock();

/* ---------------- pointer-lock handling ---------------- */
UI.onOverlayOpen = () => { player.enabled = false; if (player.controls.isLocked) player.unlock(); };
UI.onOverlayClose = () => { if (!UI.isMapOpen() && !UI.isOverlayOpen() && !paused) tryLock(); };

player.controls.addEventListener("lock", () => { player.enabled = true; paused = false; UI.setPrompt(""); Audio.start(); });
player.controls.addEventListener("unlock", () => {
  player.enabled = false;
  if (suppressPause) return;
  // genuine Esc with nothing else open → show the pause menu
  if (!UI.isOverlayOpen() && !UI.isMapOpen() && chapter) showPauseMenu();
});
function tryLock() { if (chapter && !UI.isOverlayOpen() && !UI.isMapOpen()) player.lock(); }
renderer.domElement.addEventListener("click", () => { if (chapter && !UI.isOverlayOpen() && !UI.isMapOpen()) tryLock(); });

/* ---------------- chapter loading ---------------- */
function loadChapter(n, { showIntro = true } = {}) {
  if (world) { world.dispose(); world = null; }
  chapter = chapterByNumber(n);
  unit = unitOf(n);
  progress.current = n;
  if (n > progress.maxUnlocked) progress.maxUnlocked = n;
  const alreadyDone = progress.completed.includes(n);
  chState = {
    readConcepts: new Set(alreadyDone ? chapter.concepts.map((_, i) => i) : []),
    passed: alreadyDone,
  };
  saveProgress();

  world = buildRoom(scene, chapter, unit.color, chState);
  player.bounds = world.bounds;
  // spawn at the entry wall, looking toward the room
  player.spawn(0, -(world.bounds.z - 1.5), 1);

  UI.showHUD();
  UI.setChapter(chapter, unit);
  UI.setObjectives(chapter, chState);

  if (showIntro) {
    UI.dialogue({
      tag: `Unit ${unit.n} · Chapter ${n} — ${chapter.room}`,
      title: chapter.title,
      bodyHTML:
        `<div class="helix"><div class="av"></div><div>${chapter.intro}</div></div>` +
        `<p style="color:var(--dim);font-size:14px">Scan the glowing <b style="color:var(--accent)">data nodes</b> to learn this chapter's concepts, then take on the <b style="color:var(--accent)">Challenge</b> to unlock the exit.</p>`,
      actions: [{ label: "Enter the chamber ▸", onClick: () => { UI.closeOverlay(); tryLock(); } }],
    });
  } else {
    tryLock();
  }
}

/* ---------------- interaction ---------------- */
function interact(it) {
  if (!it) return;
  if (it.type === "concept") {
    Audio.scan();
    UI.showConcept(chapter, it.data.concept, false, null, () => {
      chState.readConcepts.add(it.data.index);
      world.markConceptRead(it.data.index);
      UI.setObjectives(chapter, chState);
    });
  } else if (it.type === "challenge") {
    if (chState.passed) {
      UI.dialogue({ tag: chapter.room, title: "Challenge already mastered ✓",
        bodyHTML: `<p>You've proven your understanding of <b>${chapter.title}</b>. The exit is open.</p>`,
        actions: [{ label: "Back", onClick: () => { UI.closeOverlay(); tryLock(); } }] });
      return;
    }
    UI.runQuiz(chapter, () => {
      chState.passed = true;
      if (!progress.completed.includes(chapter.n)) progress.completed.push(chapter.n);
      progress.maxUnlocked = Math.max(progress.maxUnlocked, Math.min(chapter.n + 1, 21));
      saveProgress();
      UI.setObjectives(chapter, chState);
      tryLock();
    });
  } else if (it.type === "exit") {
    if (!chState.passed) {
      UI.setPrompt("Locked — complete the <b>Challenge</b> first");
      return;
    }
    if (chapter.n === 21) { showFinale(); return; }
    transitionTo(chapter.n + 1);
  }
}

/* ---------------- transition ---------------- */
function transitionTo(n) {
  suppressPause = true;
  player.enabled = false;
  if (player.controls.isLocked) player.unlock();
  Audio.open(); Audio.warp();
  const warp = document.getElementById("warp");
  const nextRoom = chapterByNumber(n).room;
  document.getElementById("warp-label").textContent = "Entering · " + nextRoom;
  warp.classList.remove("hidden");
  // restart the CSS animation
  warp.classList.remove("go"); void warp.offsetWidth; warp.classList.add("go");
  setTimeout(() => { loadChapter(n, { showIntro: true }); }, 560);
  setTimeout(() => { warp.classList.add("hidden"); warp.classList.remove("go"); suppressPause = false; }, 1150);
}

function showFinale() {
  player.enabled = false; if (player.controls.isLocked) player.unlock();
  UI.dialogue({
    tag: "BIOSPHERE · Restored",
    title: "The Withering Ends",
    bodyHTML:
      `<div class="helix"><div class="av"></div><div>${chapter.clue}</div></div>` +
      `<p>You have journeyed through all <b>21 chapters</b> and <b>6 units</b> of life's story — from the atoms of the Molecular Forge to the living globe of the Vault of Life. Every learning objective of OpenStax <i>Concepts of Biology</i> is now yours.</p>` +
      `<p style="color:var(--dim)">The Biosphere hums, whole again. Life persists — as <b style="color:var(--accent)">organized energy, defended by understanding</b>.</p>`,
    actions: [
      { label: "Open the Journey Map", onClick: () => { UI.closeOverlay(); openMap(); } },
      { label: "Roam the Biosphere", ghost: true, onClick: () => { UI.closeOverlay(); tryLock(); } },
    ],
  });
}

/* ---------------- map ---------------- */
function openMap() {
  UI.showMap(UNITS, CHAPTERS, progress, chapter ? chapter.n : 1, goToChapter);
}
UI.bindMapClose(() => { UI.hideMap(); tryLock(); });

// travel to a chapter from the map (warps if already in-game)
function goToChapter(n) {
  if (n > progress.maxUnlocked) return;
  UI.hideMap();
  if (chapter) { transitionTo(n); return; }
  // coming from the main menu
  UI.hideMenu();
  paused = false;
  Audio.start();
  audioBtn.classList.add("show");
  loadChapter(n, { showIntro: true });
}

/* ---------------- help ---------------- */
function showHelp() {
  if (UI.isOverlayOpen() || UI.isMapOpen()) return;
  UI.dialogue({
    tag: "BIOSPHERE · How to Play",
    title: "Field Manual",
    bodyHTML:
      `<div class="helix"><div class="av"></div><div>Welcome, Cadet. You explore the BIOSPHERE in first person, ` +
      `one chamber per chapter of <i>Concepts of Biology</i>. Learn each chamber's concepts, pass its Challenge, ` +
      `and walk through the unlocked door to the next.</div></div>` +
      `<p style="margin-bottom:8px"><b style="color:var(--accent)">Your goal in each chamber</b></p>` +
      `<p style="margin-top:0">① Scan the glowing <b>DATA nodes</b> (press <b>E</b>) to read the concepts. ` +
      `② Activate the <b>◈ CHALLENGE</b> console and answer every question correctly to master the chapter. ` +
      `③ The <b>EXIT</b> door opens — step into it to warp onward.</p>` +
      `<p style="margin-bottom:8px"><b style="color:var(--accent)">Controls</b></p>` +
      `<table style="width:100%;border-collapse:collapse;font-size:15px">` +
      `<tr><td style="padding:4px 0;width:120px"><b>W A S D</b></td><td>Move</td></tr>` +
      `<tr><td style="padding:4px 0"><b>Mouse</b></td><td>Look around</td></tr>` +
      `<tr><td style="padding:4px 0"><b>E</b></td><td>Interact with the node you're facing</td></tr>` +
      `<tr><td style="padding:4px 0"><b>M</b></td><td>Open the Journey Map (travel between unlocked chambers)</td></tr>` +
      `<tr><td style="padding:4px 0"><b>H</b></td><td>Show this help</td></tr>` +
      `<tr><td style="padding:4px 0"><b>T</b> / ♪</td><td>Toggle sound</td></tr>` +
      `<tr><td style="padding:4px 0"><b>Esc</b></td><td>Pause &amp; open the menu (quit to title here)</td></tr>` +
      `</table>`,
    actions: [{ label: "Got it ▸", onClick: () => { UI.closeOverlay(); if (chapter) tryLock(); } }],
  });
}

/* ---------------- pause menu ---------------- */
function showPauseMenu() {
  UI.dialogue({
    tag: chapter ? `Unit ${unit.n} · Chapter ${chapter.n}` : "BIOSPHERE",
    title: "Paused",
    bodyHTML: `<p>The Biosphere holds its breath. ${chapter ? "You are in <b>" + chapter.room + "</b>." : ""}</p>`,
    actions: [
      { label: "Resume ▸", onClick: () => { UI.closeOverlay(); tryLock(); } },
      { label: "Journey Map", ghost: true, onClick: () => { UI.closeOverlay(); openMap(); } },
      { label: "How to Play", ghost: true, onClick: () => { UI.closeOverlay(); showHelp(); } },
      { label: "Quit to Title", ghost: true, onClick: () => quitToMenu() },
    ],
  });
}

function quitToMenu() {
  UI.closeOverlay();
  if (UI.isMapOpen()) UI.hideMap();
  if (world) { world.dispose(); world = null; }
  chapter = null; unit = null; chState = null;
  paused = true;
  UI.hideHUD();
  UI.setPrompt("");
  audioBtn.classList.remove("show");
  showStartMenu();
}

/* ---------------- input ---------------- */
window.addEventListener("keydown", (e) => {
  if (e.code === "KeyE" && player.enabled && player.target) { interact(player.target); }
  if (e.code === "KeyM") {
    if (UI.isOverlayOpen()) return;
    if (UI.isMapOpen()) { UI.hideMap(); tryLock(); } else { if (player.controls.isLocked) player.unlock(); openMap(); }
  }
  if (e.code === "KeyH") showHelp();
  if (e.code === "KeyT") toggleAudio();
  // secret: U while the Journey Map is open unlocks every chamber
  if (e.code === "KeyU" && UI.isMapOpen()) {
    progress.maxUnlocked = 21;
    saveProgress();
    openMap(); // re-render with everything unlocked + clickable
    UI.toast("✦ All 21 chambers unlocked — travel anywhere");
  }
});

/* ---------------- audio toggle ---------------- */
const audioBtn = document.getElementById("audio-btn");
function toggleAudio() {
  const muted = Audio.toggleMute();
  audioBtn.classList.toggle("muted", muted);
  audioBtn.textContent = muted ? "♪̸" : "♪";
}
audioBtn.addEventListener("click", () => { Audio.start(); toggleAudio(); });

/* ---------------- menu ---------------- */
function showStartMenu() {
  const hasSave = progress.completed.length > 0 || progress.current > 1;
  const story =
    `The year is far from now. Humanity's knowledge of life is preserved inside <b>BIOSPHERE</b> — ` +
    `a vast research arcology where every living thing is studied and kept. But a silent catastrophe, ` +
    `the <b style="color:var(--accent)">Withering</b>, is unravelling life itself, level by level: order ` +
    `collapsing into lifeless noise.<br><br>You are the last enrolled <b>cadet</b>. Guided by the station ` +
    `intelligence <b>HELIX</b>, you must move chamber by chamber — atom to biosphere — relearning what ` +
    `life is and restoring each shard of knowledge. Master a chamber's <b>Challenge</b>, and its door opens. ` +
    `Master all 21, and the Withering ends.`;
  const buttons = [];
  if (hasSave) {
    buttons.push({ label: `Continue — Chapter ${progress.current}`, onClick: () => beginGame(progress.current) });
    buttons.push({ label: "Restart journey", ghost: true, onClick: () => { progress = { completed: [], maxUnlocked: 1, current: 1 }; saveProgress(); beginGame(1); } });
  } else {
    buttons.push({ label: "Begin the journey ▸", onClick: () => beginGame(1) });
  }
  buttons.push({ label: "Journey map", ghost: true, onClick: () => openMap() });
  buttons.push({ label: "How to play", ghost: true, onClick: () => showHelp() });
  UI.showMenu(story, buttons);
}

function beginGame(n) {
  UI.hideMenu();
  paused = false;
  Audio.start();
  audioBtn.classList.add("show");
  loadChapter(n, { showIntro: true });
}

/* ---------------- loop ---------------- */
let lastTarget = null;
let lastStep = 0;
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  environment.update(t);
  if (world) world.update(t, dt);
  player.update(dt, world ? world.interactables : []);

  // footsteps synced to head-bob
  if (player.enabled) {
    const seg = Math.floor(player.bobPhase / Math.PI);
    if (seg !== lastStep) { if (Math.hypot(player.velocity.x, player.velocity.z) > 1.5) Audio.step(); lastStep = seg; }
  }

  // prompt + reticle from focus target
  if (player.enabled && player.target) {
    UI.setReticle(true);
    UI.setPrompt(`<b>E</b> ${player.target.prompt()}`);
    if (player.target !== lastTarget) { Audio.focus(); lastTarget = player.target; }
  } else if (player.enabled) {
    UI.setReticle(false);
    UI.setPrompt("");
    lastTarget = null;
  } else if (chapter && !UI.isOverlayOpen() && !UI.isMapOpen()) {
    // in-game but cursor released (e.g., re-lock blocked by browser cooldown)
    UI.setReticle(false);
    UI.setPrompt("<b>Click</b> to resume exploring · <b>Esc</b> for menu");
    lastTarget = null;
  }
  composer.render();
}

/* ---------------- boot ---------------- */
UI.hideLoading();
showStartMenu();
animate();
