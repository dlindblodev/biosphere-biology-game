// world.js — builds an immersive chapter "chamber": glossy reflective floor,
// energy-conduit walls, an open skylight to the stars, a holographic projector
// platform with a light beam, concept holo-pillars, the challenge console and
// a dissolving energy exit door. Returns a handle with interactables + updater.

import * as THREE from "three";
import { buildVisual, makeLabel } from "./visuals.js";

const ROOM = { w: 20, d: 26, h: 8 };

function hex(c) { return "#" + c.toString(16).padStart(6, "0"); }

// subtle emissive hex/grid panel texture for walls
function wallTexture(accent) {
  const c = document.createElement("canvas"); c.width = c.height = 512;
  const x = c.getContext("2d");
  x.fillStyle = "#070d14"; x.fillRect(0, 0, 512, 512);
  x.strokeStyle = "rgba(120,200,180,0.10)"; x.lineWidth = 2;
  for (let i = 0; i <= 512; i += 64) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 512); x.moveTo(0, i); x.lineTo(512, i); x.stroke(); }
  x.strokeStyle = "rgba(140,220,200,0.05)";
  for (let i = 32; i <= 512; i += 64) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 512); x.stroke(); }
  const tex = new THREE.CanvasTexture(c); tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export function buildRoom(scene, chapter, unitColor, state) {
  const group = new THREE.Group();
  scene.add(group);
  const accent = chapter.color;
  const aCol = new THREE.Color(accent);
  const interactables = [];
  const updaters = [];

  scene.fog = new THREE.FogExp2(0x04070e, 0.014);

  // ---------- lighting ----------
  group.add(new THREE.AmbientLight(0x9fc7d8, 0.35));
  const hemi = new THREE.HemisphereLight(0xbfe6ff, 0x0a1a18, 0.5); group.add(hemi);
  const key = new THREE.PointLight(accent, 2.4, 70, 1.5); key.position.set(0, ROOM.h - 1.2, 0); group.add(key);
  const holoLight = new THREE.PointLight(0xffffff, 2.2, 18, 2); holoLight.position.set(0, 3.4, 0); group.add(holoLight);
  const rim1 = new THREE.PointLight(0x4aa3ff, 1.0, 40, 2); rim1.position.set(-8, 4, -8); group.add(rim1);
  const rim2 = new THREE.PointLight(accent, 1.0, 40, 2); rim2.position.set(8, 4, 8); group.add(rim2);

  // ---------- floor (glossy, reflective via envMap) ----------
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM.w, ROOM.d),
    new THREE.MeshStandardMaterial({ color: 0x070f15, roughness: 0.18, metalness: 0.9, envMapIntensity: 0.8 })
  );
  floor.rotation.x = -Math.PI / 2; group.add(floor);
  const grid = new THREE.GridHelper(ROOM.d, 26, accent, 0x0e2630);
  grid.position.y = 0.02; grid.material.opacity = 0.28; grid.material.transparent = true; group.add(grid);

  // pulsing floor rings around the projector
  const floorRings = [];
  for (let i = 0; i < 3; i++) {
    const r = new THREE.Mesh(new THREE.RingGeometry(2.8 + i * 0.05, 2.95 + i * 0.05, 64),
      new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
    r.rotation.x = -Math.PI / 2; r.position.y = 0.03; group.add(r); floorRings.push(r);
  }
  updaters.push((t) => floorRings.forEach((r, i) => {
    const p = (t * 0.4 + i / 3) % 1; const s = 1 + p * 2.6;
    r.scale.set(s, s, s); r.material.opacity = 0.5 * (1 - p);
  }));

  // ---------- walls ----------
  const wallTex = wallTexture(accent);
  const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, color: 0x0a1620, roughness: 0.7, metalness: 0.4, side: THREE.DoubleSide });
  const mkWall = (w, h, x, y, z, ry) => {
    wallTex.repeat.set(w / 4, h / 4);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat.clone());
    m.material.map = wallTex.clone(); m.material.map.repeat.set(w / 4, h / 4); m.material.map.needsUpdate = true;
    m.position.set(x, y, z); m.rotation.y = ry; group.add(m); return m;
  };
  mkWall(ROOM.w, ROOM.h, 0, ROOM.h / 2, -ROOM.d / 2, 0);
  mkWall(ROOM.w, ROOM.h, 0, ROOM.h / 2, ROOM.d / 2, Math.PI);
  mkWall(ROOM.d, ROOM.h, -ROOM.w / 2, ROOM.h / 2, 0, Math.PI / 2);
  mkWall(ROOM.d, ROOM.h, ROOM.w / 2, ROOM.h / 2, 0, -Math.PI / 2);

  // vertical energy conduits on the side walls
  const conduits = [];
  const condMat = new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.85 });
  for (let s = -1; s <= 1; s += 2) {
    for (let i = -2; i <= 2; i++) {
      const cd = new THREE.Mesh(new THREE.BoxGeometry(0.12, ROOM.h - 1.5, 0.12), condMat.clone());
      cd.position.set(s * (ROOM.w / 2 - 0.1), ROOM.h / 2 - 0.4, i * 4.5);
      group.add(cd); conduits.push(cd);
    }
  }
  // animated data band along front & back walls
  const band = new THREE.Mesh(new THREE.BoxGeometry(ROOM.w - 0.4, 0.1, 0.05), new THREE.MeshBasicMaterial({ color: accent }));
  band.position.set(0, 3.2, -ROOM.d / 2 + 0.12); group.add(band);
  updaters.push((t) => { conduits.forEach((c, i) => c.material.opacity = 0.4 + 0.5 * Math.abs(Math.sin(t * 1.3 + i * 0.5))); });

  // ---------- open skylight (translucent energy field → stars above) ----------
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.w, ROOM.d, 1, 1),
    new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.05, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
  sky.rotation.x = Math.PI / 2; sky.position.y = ROOM.h; group.add(sky);
  // ceiling rim light
  const rim = new THREE.Mesh(new THREE.BoxGeometry(ROOM.w, 0.15, 0.15), new THREE.MeshBasicMaterial({ color: accent }));
  [[-ROOM.d / 2, 0], [ROOM.d / 2, Math.PI]].forEach(([z]) => { const r = rim.clone(); r.position.set(0, ROOM.h - 0.1, z); group.add(r); });
  updaters.push((t) => { sky.material.opacity = 0.04 + Math.sin(t * 0.5) * 0.02; });

  // ---------- corner columns ----------
  for (let sx = -1; sx <= 1; sx += 2) for (let sz = -1; sz <= 1; sz += 2) {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, ROOM.h, 8),
      new THREE.MeshStandardMaterial({ color: 0x0c1a24, roughness: 0.4, metalness: 0.7, envMapIntensity: 0.6 }));
    col.position.set(sx * (ROOM.w / 2 - 0.5), ROOM.h / 2, sz * (ROOM.d / 2 - 0.5)); group.add(col);
    const colGlow = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.37, 0.3, 8), new THREE.MeshBasicMaterial({ color: accent }));
    colGlow.position.set(col.position.x, 0.5, col.position.z); group.add(colGlow);
  }

  // ---------- atmosphere: drifting spores ----------
  const spores = makeSpores(accent, ROOM);
  group.add(spores.points); updaters.push(spores.update);

  // ---------- holographic projector platform ----------
  const dais = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.0, 0.4, 48),
    new THREE.MeshStandardMaterial({ color: 0x0c1c26, roughness: 0.3, metalness: 0.85, envMapIntensity: 0.9 }));
  dais.position.y = 0.2; group.add(dais);
  const daisRing = new THREE.Mesh(new THREE.TorusGeometry(2.65, 0.06, 10, 80), new THREE.MeshBasicMaterial({ color: accent }));
  daisRing.rotation.x = Math.PI / 2; daisRing.position.y = 0.42; group.add(daisRing);
  // light beam cone
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 2.4, 5.4, 32, 1, true),
    new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.06, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
  beam.position.y = 3.1; group.add(beam);
  // rising holo scan rings inside beam
  const scanRings = [];
  for (let i = 0; i < 4; i++) {
    const sr = new THREE.Mesh(new THREE.TorusGeometry(1, 0.02, 6, 48), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.4 }));
    sr.rotation.x = Math.PI / 2; group.add(sr); scanRings.push(sr);
  }
  updaters.push((t) => {
    daisRing.rotation.z = t * 0.3;
    beam.material.opacity = 0.05 + Math.sin(t * 1.5) * 0.025;
    scanRings.forEach((sr, i) => { const p = (t * 0.25 + i / 4) % 1; sr.position.y = 0.6 + p * 4.6; const w = 0.4 + (1 - p) * 1.8; sr.scale.set(w, w, w); sr.material.opacity = 0.45 * Math.sin(p * Math.PI); });
  });

  // ---------- central visualization (auto-framed inside the beam) ----------
  const visual = buildVisual(chapter.visual);
  group.add(visual);
  if (visual.userData.update) updaters.push((t, dt) => visual.userData.update(t, dt));
  frameVisual(visual, 3.2, 3.8); // center at y=3.2, fit within ~3.8 units

  // chamber title floating over the entry wall
  const title = makeLabel(chapter.room, hex(accent), 1.5);
  title.position.set(0, 6.2, -ROOM.d / 2 + 0.5); group.add(title);
  const subtitle = makeLabel("Chapter " + chapter.n + " · " + chapter.title, "#cfe1dc", 0.7);
  subtitle.position.set(0, 5.4, -ROOM.d / 2 + 0.5); group.add(subtitle);

  // ---------- concept holo-pillars ----------
  const NC = chapter.concepts.length;
  chapter.concepts.forEach((concept, i) => {
    const ang = Math.PI + (i - (NC - 1) / 2) * 0.62;
    const x = Math.cos(ang) * 7.0, z = Math.sin(ang) * 7.0 - 1.5;
    const station = new THREE.Group(); station.position.set(x, 0, z); group.add(station);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.22, 1.5, 12),
      new THREE.MeshStandardMaterial({ color: 0x0e2029, metalness: 0.8, roughness: 0.25, envMapIntensity: 0.8 }));
    post.position.y = 0.75; station.add(post);
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 0.15, 16), new THREE.MeshStandardMaterial({ color: 0x0c1a22, metalness: 0.8, roughness: 0.3 }));
    ped.position.y = 0.07; station.add(ped);
    const base = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.03, 8, 32), new THREE.MeshBasicMaterial({ color: accent }));
    base.rotation.x = Math.PI / 2; base.position.y = 1.55; station.add(base);
    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1),
      new THREE.MeshStandardMaterial({ color: accent, emissive: accent, emissiveIntensity: 1.1, flatShading: true, metalness: 0.3, roughness: 0.4 }));
    orb.position.y = 2.0; station.add(orb);
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.58, 32), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
    halo.position.y = 2.0; station.add(halo);
    const numLab = makeLabel("DATA " + (i + 1), hex(accent), 0.55); numLab.position.set(x, 2.85, z); group.add(numLab);
    updaters.push((t) => { orb.rotation.y = t * 0.9; orb.rotation.x = t * 0.4; orb.position.y = 2.0 + Math.sin(t * 1.5 + i) * 0.08; halo.position.y = orb.position.y; halo.lookAt(holoLight.position); halo.material.opacity = 0.3 + Math.abs(Math.sin(t + i)) * 0.3; });
    interactables.push({
      group: station, pos: new THREE.Vector3(x, 2.0, z), radius: 2.6, type: "concept",
      prompt: () => (state.readConcepts.has(i) ? "Review · " + concept.t : "Scan data node — " + concept.t),
      data: { concept, index: i, chapter }, orb, halo,
    });
  });

  // ---------- challenge console ----------
  const con = new THREE.Group(); con.position.set(-5.5, 0, 7.5); con.rotation.y = -0.5; group.add(con);
  const desk = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 0.9),
    new THREE.MeshStandardMaterial({ color: 0x0e2029, metalness: 0.7, roughness: 0.3, envMapIntensity: 0.7 }));
  desk.position.y = 0.5; con.add(desk);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.85), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.85, side: THREE.DoubleSide }));
  screen.position.set(0, 1.35, 0.1); screen.rotation.x = -0.42; con.add(screen);
  const screenGlow = new THREE.PointLight(accent, 0.8, 6, 2); screenGlow.position.set(0, 1.4, 0.4); con.add(screenGlow);
  const clab = makeLabel("◈ CHALLENGE", hex(accent), 0.75); clab.position.set(-5.5, 2.4, 7.5); group.add(clab);
  updaters.push((t) => { screen.material.opacity = (state.passed ? 0.3 : 0.55) + Math.sin(t * 3) * 0.2; });
  interactables.push({
    group: con, pos: new THREE.Vector3(-5.5, 1.3, 7.5), radius: 3.0, type: "challenge",
    prompt: () => (state.passed ? "Challenge complete ✓" : "Begin the Challenge — test your mastery"), data: { chapter },
  });

  // ---------- exit archway with dissolving energy field ----------
  const door = new THREE.Group(); door.position.set(0, 0, ROOM.d / 2 - 0.15); group.add(door);
  const archMat = new THREE.MeshStandardMaterial({ color: 0x0c1c24, metalness: 0.8, roughness: 0.25, envMapIntensity: 0.8 });
  const lpost = new THREE.Mesh(new THREE.BoxGeometry(0.5, 5.0, 0.6), archMat); lpost.position.set(-1.8, 2.5, 0); door.add(lpost);
  const rpost = lpost.clone(); rpost.position.x = 1.8; door.add(rpost);
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.5, 0.6), archMat); lintel.position.set(0, 4.8, 0); door.add(lintel);
  const field = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 4.6, 12, 18),
    new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.45, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
  field.position.set(0, 2.4, 0); door.add(field);
  const doorLights = [];
  for (let i = 0; i < 6; i++) { const dl = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), new THREE.MeshBasicMaterial({ color: accent })); dl.position.set(-1.8, 0.4 + i * 0.85, 0.35); door.add(dl); const dr = dl.clone(); dr.position.x = 1.8; door.add(dr); doorLights.push(dl, dr); }
  const doorLab = makeLabel(chapter.n === 21 ? "✦ COMPLETE ✦" : "EXIT ▸", hex(accent), 0.85); doorLab.position.set(0, 5.4, ROOM.d / 2 - 0.15); group.add(doorLab);
  const fieldBase = field.geometry.attributes.position.array.slice();
  updaters.push((t) => {
    const open = state.passed;
    field.material.opacity = open ? 0.08 + Math.sin(t * 3) * 0.04 : 0.4 + Math.sin(t * 2) * 0.06;
    // ripple the energy field
    const p = field.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) { const ox = fieldBase[i * 3], oy = fieldBase[i * 3 + 1]; p.setZ(i, Math.sin(ox * 2 + t * 3) * 0.08 + Math.cos(oy * 2 + t * 2) * 0.08); }
    p.needsUpdate = true;
    doorLights.forEach((d, i) => d.material.color.setHex(open ? 0x7dffce : accent));
  });
  interactables.push({
    group: door, pos: new THREE.Vector3(0, 2.2, ROOM.d / 2 - 1.4), radius: 3.4, type: "exit",
    prompt: () => (state.passed ? (chapter.n === 21 ? "Complete the Biosphere ▸" : "Proceed to next chamber ▸") : "Locked — pass the Challenge to open"),
    data: { chapter }, field,
  });

  return {
    group, interactables,
    bounds: { x: ROOM.w / 2 - 0.9, z: ROOM.d / 2 - 0.9 },
    update(t, dt) { for (const u of updaters) u(t, dt); },
    dispose() {
      scene.remove(group);
      group.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
      });
    },
    markConceptRead(index) {
      const it = interactables.find((i) => i.type === "concept" && i.data.index === index);
      if (it && it.orb) {
        it.orb.material.color.set(0x7dffce); it.orb.material.emissive.set(0x35d0a5); it.orb.material.emissiveIntensity = 0.5;
        if (it.halo) it.halo.material.color.set(0x7dffce);
      }
    },
  };
}

// Auto-frame any visualization: measure its real bounds (after one update tick
// so animated layouts are populated), then center it at `centerY` and scale it
// uniformly to fit within `fit` world units. Keeps every chamber consistent.
function frameVisual(visual, centerY, fit) {
  if (visual.userData.update) { try { visual.userData.update(0.001, 0.016); } catch (e) {} }
  visual.updateWorldMatrix(true, true);
  const box = new THREE.Box3();
  visual.traverse((o) => { if ((o.isMesh || o.isPoints || o.isLine) && o.geometry) box.expandByObject(o); });
  if (box.isEmpty()) { visual.position.set(0, centerY, 0); return; }
  const size = new THREE.Vector3(); box.getSize(size);
  const center = new THREE.Vector3(); box.getCenter(center);
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const s = fit / maxDim;
  visual.scale.setScalar(s);
  visual.position.set(-center.x * s, centerY - center.y * s, -center.z * s);
}

function makeSpores(accent, ROOM) {
  const N = 90;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3), seed = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * ROOM.w; pos[i * 3 + 1] = Math.random() * ROOM.h; pos[i * 3 + 2] = (Math.random() - 0.5) * ROOM.d;
    seed[i] = Math.random() * 100;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color: accent, size: 0.09, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false });
  const points = new THREE.Points(geo, mat);
  const base = pos.slice();
  return {
    points,
    update(t) {
      const p = geo.attributes.position;
      for (let i = 0; i < N; i++) {
        p.setX(i, base[i * 3] + Math.sin(t * 0.3 + seed[i]) * 0.6);
        p.setY(i, ((base[i * 3 + 1] + t * 0.25 + seed[i]) % ROOM.h));
        p.setZ(i, base[i * 3 + 2] + Math.cos(t * 0.25 + seed[i]) * 0.6);
      }
      p.needsUpdate = true;
    },
  };
}
