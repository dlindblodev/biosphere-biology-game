// world.js — builds a chapter "room": floor, walls, lighting, the central
// visualization, the concept stations the player reads, and the challenge
// console + exit door. Returns a handle with interactables and an updater.

import * as THREE from "three";
import { buildVisual, makeLabel } from "./visuals.js";

const ROOM = { w: 18, d: 22, h: 7 };

function hex(c) { return "#" + c.toString(16).padStart(6, "0"); }

export function buildRoom(scene, chapter, unitColor, state) {
  const group = new THREE.Group();
  scene.add(group);
  const accent = chapter.color;
  const interactables = [];
  const updaters = [];

  scene.fog = new THREE.FogExp2(0x05080c, 0.018);
  scene.background = new THREE.Color(0x05080c);

  // ---- lighting ----
  const amb = new THREE.AmbientLight(0xbfeae0, 0.7); group.add(amb);
  const key = new THREE.PointLight(accent, 2.0, 60, 1.4); key.position.set(0, ROOM.h - 1, 0); group.add(key);
  const fill = new THREE.DirectionalLight(0xaecfff, 0.6); fill.position.set(5, 8, 6); group.add(fill);
  const centerLight = new THREE.PointLight(0xffffff, 1.4, 22, 2); centerLight.position.set(0, 3.2, 0); group.add(centerLight);

  // ---- floor (reflective grid) ----
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x0a141a, roughness: 0.4, metalness: 0.6 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.w, ROOM.d), floorMat);
  floor.rotation.x = -Math.PI / 2; group.add(floor);
  const grid = new THREE.GridHelper(ROOM.d, 24, accent, 0x14303a);
  grid.position.y = 0.01; grid.material.opacity = 0.35; grid.material.transparent = true; group.add(grid);

  // ---- walls ----
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x0a1620, roughness: 0.85, metalness: 0.2, side: THREE.DoubleSide });
  const mkWall = (w, h, x, y, z, ry) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat); m.position.set(x, y, z); m.rotation.y = ry; group.add(m); return m; };
  mkWall(ROOM.w, ROOM.h, 0, ROOM.h / 2, -ROOM.d / 2, 0);          // front (entry behind)
  mkWall(ROOM.w, ROOM.h, 0, ROOM.h / 2, ROOM.d / 2, Math.PI);     // back (exit)
  mkWall(ROOM.d, ROOM.h, -ROOM.w / 2, ROOM.h / 2, 0, Math.PI / 2);
  mkWall(ROOM.d, ROOM.h, ROOM.w / 2, ROOM.h / 2, 0, -Math.PI / 2);
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.w, ROOM.d), wallMat); ceil.rotation.x = Math.PI / 2; ceil.position.y = ROOM.h; group.add(ceil);

  // accent trim strips along walls
  [-ROOM.d / 2 + 0.05, ROOM.d / 2 - 0.05].forEach((z, i) => {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(ROOM.w, 0.08, 0.08), new THREE.MeshBasicMaterial({ color: accent }));
    strip.position.set(0, 2.6, z); group.add(strip);
  });

  // floating motes for atmosphere
  const moteGeo = new THREE.BufferGeometry();
  const N = 140, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * ROOM.w; pos[i * 3 + 1] = Math.random() * ROOM.h; pos[i * 3 + 2] = (Math.random() - 0.5) * ROOM.d; }
  moteGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const motes = new THREE.Points(moteGeo, new THREE.PointsMaterial({ color: accent, size: 0.06, transparent: true, opacity: 0.5 }));
  group.add(motes);
  updaters.push((t) => { motes.rotation.y = t * 0.02; });

  // ---- central visualization on a pedestal ----
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.7, 0.3, 32), new THREE.MeshStandardMaterial({ color: 0x0d2029, metalness: 0.5, roughness: 0.4 }));
  pedestal.position.set(0, 0.15, 0); group.add(pedestal);
  const ringLight = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.04, 8, 60), new THREE.MeshBasicMaterial({ color: accent }));
  ringLight.rotation.x = Math.PI / 2; ringLight.position.y = 0.31; group.add(ringLight);

  const visual = buildVisual(chapter.visual);
  visual.position.set(0, 2.6, 0);
  visual.scale.setScalar(0.78);
  group.add(visual);
  if (visual.userData.update) updaters.push((t, dt) => visual.userData.update(t, dt));

  // room title on entry wall
  const title = makeLabel(chapter.room, hex(accent), 1.4);
  title.position.set(0, 5.4, -ROOM.d / 2 + 0.3); group.add(title);

  // ---- concept stations (read these to complete objectives) ----
  const conceptPositions = [];
  const NC = chapter.concepts.length;
  for (let i = 0; i < NC; i++) {
    const ang = Math.PI + (i - (NC - 1) / 2) * 0.7; // arc on the entry side
    conceptPositions.push([Math.cos(ang) * 6.2, Math.sin(ang) * 6.2 - 1]);
  }
  chapter.concepts.forEach((concept, i) => {
    const [x, z] = conceptPositions[i];
    const station = new THREE.Group(); station.position.set(x, 0, z); group.add(station);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 1.6, 12), new THREE.MeshStandardMaterial({ color: 0x123, metalness: 0.6, roughness: 0.3 }));
    post.position.y = 0.8; station.add(post);
    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 1), new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.6, flatShading: true, transparent: true, opacity: 0.9 }));
    orb.position.y = 1.9; station.add(orb);
    const numLab = makeLabel("DATA " + (i + 1), hex(accent), 0.55); numLab.position.set(x, 2.7, z); group.add(numLab);
    updaters.push((t) => { orb.rotation.y = t * 0.8; orb.position.y = 1.9 + Math.sin(t * 1.5 + i) * 0.08; });
    interactables.push({
      group: station, pos: new THREE.Vector3(x, 1.9, z), radius: 2.4,
      type: "concept",
      prompt: () => (state.readConcepts.has(i) ? "Review · " + concept.t : "Scan data node — " + concept.t),
      data: { concept, index: i, chapter },
      orb,
    });
  });

  // ---- challenge console (the quiz) ----
  const console3 = new THREE.Group(); console3.position.set(-4.5, 0, 6); group.add(console3);
  const desk = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.8), new THREE.MeshStandardMaterial({ color: 0x10242e, metalness: 0.5, roughness: 0.4 }));
  desk.position.y = 0.5; console3.add(desk);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.8), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.85 }));
  screen.position.set(0, 1.3, 0.05); screen.rotation.x = -0.4; console3.add(screen);
  const clab = makeLabel("CHALLENGE", hex(accent), 0.7); clab.position.set(-4.5, 2.3, 6); group.add(clab);
  updaters.push((t) => { screen.material.opacity = 0.55 + Math.sin(t * 3) * 0.25; });
  interactables.push({
    group: console3, pos: new THREE.Vector3(-4.5, 1.3, 6), radius: 2.6,
    type: "challenge",
    prompt: () => (state.passed ? "Challenge complete ✓" : "Begin the Challenge — test your mastery"),
    data: { chapter },
  });

  // ---- exit door (far wall) ----
  const door = new THREE.Group(); door.position.set(0, 0, ROOM.d / 2 - 0.2); group.add(door);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(3.4, 4.6, 0.4), new THREE.MeshStandardMaterial({ color: 0x0c1c24, metalness: 0.6, roughness: 0.3 }));
  frame.position.y = 2.3; door.add(frame);
  const panel = new THREE.Mesh(new THREE.BoxGeometry(2.8, 4.0, 0.2), new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 0.3, transparent: true, opacity: 0.5, metalness: 0.4 }));
  panel.position.set(0, 2.2, 0.2); door.add(panel);
  const doorLab = makeLabel("EXIT ▸", hex(accent), 0.8); doorLab.position.set(0, 4.9, ROOM.d / 2 - 0.2); group.add(doorLab);
  updaters.push((t) => {
    const open = state.passed;
    panel.material.opacity = open ? 0.12 + Math.sin(t * 2) * 0.05 : 0.55;
    panel.material.emissiveIntensity = open ? 0.7 : 0.2;
    panel.scale.y = open ? 0.1 : 1; // "retracts" when unlocked
    panel.position.y = open ? 0.3 : 2.2;
  });
  interactables.push({
    group: door, pos: new THREE.Vector3(0, 2.2, ROOM.d / 2 - 1.2), radius: 3.2,
    type: "exit",
    prompt: () => (state.passed
      ? (chapter.n === 21 ? "Complete the Biosphere ▸" : "Proceed to next chamber ▸")
      : "Locked — pass the Challenge to open"),
    data: { chapter },
  });

  return {
    group,
    interactables,
    bounds: { x: ROOM.w / 2 - 0.8, z: ROOM.d / 2 - 0.8 },
    update(t, dt) { updaters.forEach((u) => u(t, dt)); },
    dispose() {
      scene.remove(group);
      group.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); }); } });
    },
    markConceptRead(index) {
      const it = interactables.find((i) => i.type === "concept" && i.data.index === index);
      if (it && it.orb) { it.orb.material.emissiveIntensity = 0.2; it.orb.material.color.set(0x35d0a5); it.orb.material.emissive.set(0x35d0a5); }
    },
  };
}
