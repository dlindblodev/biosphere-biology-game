// visuals.js — procedural 3D visualizations, one per chapter.
// Each builder returns a THREE.Group; attach group.userData.update = (t,dt)=>{}
// for per-frame animation. Visuals are placed at the center of each room and
// can be orbited by walking around them.

import * as THREE from "three";

const TAU = Math.PI * 2;

/* ---------- shared helpers ---------- */
export function makeLabel(text, color = "#e8f4f0", scale = 1) {
  const cnv = document.createElement("canvas");
  const pad = 24, fs = 48;
  const ctx = cnv.getContext("2d");
  ctx.font = `600 ${fs}px 'Exo 2', sans-serif`;
  const w = ctx.measureText(text).width;
  cnv.width = w + pad * 2; cnv.height = fs + pad * 2;
  ctx.font = `600 ${fs}px 'Exo 2', sans-serif`;
  ctx.fillStyle = "rgba(4,10,14,0.78)";
  roundRect(ctx, 0, 0, cnv.width, cnv.height, 18); ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 3; roundRect(ctx, 2, 2, cnv.width - 4, cnv.height - 4, 16); ctx.stroke();
  ctx.fillStyle = color; ctx.textBaseline = "middle"; ctx.textAlign = "center";
  ctx.fillText(text, cnv.width / 2, cnv.height / 2 + 2);
  const tex = new THREE.CanvasTexture(cnv); tex.anisotropy = 4;
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  spr.scale.set((cnv.width / cnv.height) * 0.9 * scale, 0.9 * scale, 1);
  spr.renderOrder = 999;
  return spr;
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function glow(color) {
  return new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.55, roughness: 0.35, metalness: 0.1 });
}
function ball(r, color, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 24), glow(color));
  m.position.set(x, y, z); return m;
}
function spin(group, sx = 0, sy = 0.3, sz = 0) {
  group.userData.update = (t) => { group.rotation.x += sx * 0.0; group.rotation.y = t * sy; group.rotation.z += sz * 0.0; };
  return group;
}

/* ===================================================================== */
const B = {};

// 1 — Introduction to Biology: levels of organization stacked + life ring
B.intro_life = () => {
  const g = new THREE.Group();
  const levels = ["Atom", "Molecule", "Cell", "Tissue", "Organ", "Organism"];
  const cols = [0x9bd, 0x6cf, 0x35d0a5, 0x4ad, 0x59f, 0x7ed957];
  levels.forEach((name, i) => {
    const y = i * 0.85 + 0.4;
    const r = 0.18 + i * 0.05;
    const node = new THREE.Group();
    for (let k = 0; k < i + 1; k++) {
      const a = (k / (i + 1)) * TAU;
      node.add(ball(r, cols[i], Math.cos(a) * (i * 0.12), 0, Math.sin(a) * (i * 0.12)));
    }
    node.position.y = y;
    node.userData.s = 0.4 + i * 0.1;
    node.userData.base = y;
    g.add(node);
    const lab = makeLabel(name, "#" + cols[i].toString(16).padStart(6, "0"), 0.8);
    lab.position.set(1.5, y, 0); g.add(lab);
  });
  g.userData.update = (t) => {
    g.children.forEach((c, i) => { if (c.isGroup) { c.rotation.y = t * (0.3 + i * 0.08); c.position.y = c.userData.base + Math.sin(t + i) * 0.04; } });
  };
  return g;
};

// 2 — Chemistry: water molecule with orbiting electrons + H-bond
B.chemistry = () => {
  const g = new THREE.Group();
  const O = ball(0.5, 0xff5a6a, 0, 0, 0); g.add(O);
  const h1 = ball(0.28, 0xdfe9ff, 0.62, 0.5, 0); const h2 = ball(0.28, 0xdfe9ff, -0.62, 0.5, 0);
  g.add(h1, h2);
  [[O, h1], [O, h2]].forEach(([a, b]) => {
    const bond = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1, 8), glow(0x6fa));
    g.add(bond); bond.userData.link = [a, b];
  });
  // electron cloud
  const elec = new THREE.Group();
  for (let i = 0; i < 10; i++) elec.add(ball(0.05, 0x9ad8ff, 0, 0, 0));
  g.add(elec);
  g.add(makeLabel("O", "#ffd0d6", 0.7).translateY(0).translateX(0));
  const lO = makeLabel("polar O⁻", "#ff8a98", 0.7); lO.position.set(0, -0.85, 0); g.add(lO);
  const lH = makeLabel("H⁺", "#cfe0ff", 0.6); lH.position.set(1.2, 0.8, 0); g.add(lH);
  g.userData.update = (t) => {
    g.children.forEach((c) => { if (c.userData.link) { const [a, b] = c.userData.link; const mid = a.position.clone().add(b.position).multiplyScalar(.5); c.position.copy(mid); c.scale.y = a.position.distanceTo(b.position); c.lookAt(b.position); c.rotateX(Math.PI / 2); } });
    elec.children.forEach((e, i) => { const a = t * 1.5 + i * (TAU / 10); const r = 0.78 + 0.1 * Math.sin(t + i); e.position.set(Math.cos(a) * r, Math.sin(a * 1.3) * 0.4, Math.sin(a) * r); });
    g.rotation.y = t * 0.25;
  };
  return g;
};

// 3 — Cell: nucleus + organelles orbiting inside a membrane
B.cell = () => {
  const g = new THREE.Group();
  const membrane = new THREE.Mesh(new THREE.SphereGeometry(2.4, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x35d0a5, transparent: true, opacity: 0.12, side: THREE.DoubleSide, emissive: 0x35d0a5, emissiveIntensity: 0.2 }));
  g.add(membrane);
  const nucleus = ball(0.7, 0x6a7bff, 0, 0, 0); g.add(nucleus);
  const lab = makeLabel("Nucleus", "#aeb8ff", 0.8); lab.position.set(0, 1.0, 0); g.add(lab);
  const organelles = [
    ["Mitochondrion", 0xff7a5a, 0.34], ["Ribosome", 0xffe066, 0.12], ["Golgi", 0x9b7bff, 0.3],
    ["ER", 0x5ad6ff, 0.26], ["Lysosome", 0xff5aa6, 0.22], ["Vacuole", 0x7ed957, 0.4],
  ];
  organelles.forEach((o, i) => {
    const grp = new THREE.Group();
    const m = ball(o[2], o[1]); grp.add(m);
    const l = makeLabel(o[0], "#fff", 0.55); l.position.y = o[2] + 0.35; grp.add(l);
    grp.userData = { r: 1.0 + (i % 3) * 0.45, sp: 0.3 + i * 0.07, ph: i * 1.1, ty: (i % 2 ? 0.7 : -0.5) };
    g.add(grp);
  });
  g.userData.update = (t) => {
    g.children.forEach((c) => { if (c.userData.r) { const a = t * c.userData.sp + c.userData.ph; c.position.set(Math.cos(a) * c.userData.r, c.userData.ty * Math.sin(t * 0.5 + c.userData.ph), Math.sin(a) * c.userData.r); } });
    nucleus.rotation.y = t * 0.4;
  };
  return g;
};

// 4 — Energy: mitochondrion making ATP, glowing electron flow
B.energy = () => {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.9, 1.8, 8, 16),
    new THREE.MeshStandardMaterial({ color: 0xff7a5a, emissive: 0xff7a5a, emissiveIntensity: 0.3, transparent: true, opacity: 0.35 }));
  body.rotation.z = Math.PI / 2; g.add(body);
  // cristae folds
  const crista = new THREE.Group();
  for (let i = -2; i <= 2; i++) {
    const t = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.07, 8, 20, Math.PI), glow(0xffb347));
    t.position.x = i * 0.55; t.rotation.y = Math.PI / 2; crista.add(t);
  }
  g.add(crista);
  // ATP molecules spawning
  const atp = new THREE.Group(); g.add(atp);
  for (let i = 0; i < 14; i++) { const a = ball(0.13, 0x35d0a5); a.userData.ph = Math.random() * TAU; atp.add(a); }
  const lab = makeLabel("ATP ⚡", "#7df0cf", 0.9); lab.position.set(0, 1.7, 0); g.add(lab);
  const lab2 = makeLabel("Mitochondrion", "#ffb38a", 0.8); lab2.position.set(0, -1.7, 0); g.add(lab2);
  g.userData.update = (t) => {
    crista.rotation.x = t * 0.4;
    atp.children.forEach((a, i) => { const p = (t * 0.5 + i / 14) % 1; const ang = a.userData.ph; a.position.set(Math.cos(ang) * (0.3 + p * 2.6), (Math.sin(t + i) * 0.3) + p * 0.5, Math.sin(ang) * (0.3 + p * 2.6)); a.material.emissiveIntensity = 0.8 * (1 - p); a.scale.setScalar(1 - p * 0.7); });
    g.rotation.y = t * 0.18;
  };
  return g;
};

// 5 — Photosynthesis: chloroplast with sun rays + CO2→sugar
B.photosynthesis = () => {
  const g = new THREE.Group();
  const choro = new THREE.Mesh(new THREE.SphereGeometry(1.6, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0x2ecc71, emissive: 0x1d8d4f, emissiveIntensity: 0.35, transparent: true, opacity: 0.45 }));
  choro.scale.set(1.4, 1, 1); g.add(choro);
  // thylakoid stacks (grana)
  for (let s = 0; s < 4; s++) {
    const x = -0.9 + s * 0.6;
    for (let i = 0; i < 5; i++) { const d = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.07, 16), glow(0x1abc6b)); d.position.set(x, -0.4 + i * 0.18, (s % 2 ? 0.3 : -0.3)); g.add(d); }
  }
  // sun
  const sun = ball(0.45, 0xffe066, 0, 3.2, 0); g.add(sun);
  const rays = new THREE.Group(); g.add(rays);
  for (let i = 0; i < 8; i++) { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1, 6), glow(0xffe98a)); rays.add(r); r.userData.ph = i; }
  const lS = makeLabel("Sunlight", "#ffe98a", 0.8); lS.position.set(1.2, 3.2, 0); g.add(lS);
  const lC = makeLabel("Chloroplast", "#8ef0b8", 0.8); lC.position.set(0, -1.6, 0); g.add(lC);
  const lG = makeLabel("→ Sugar", "#7df0cf", 0.7); lG.position.set(2.4, 0, 0); g.add(lG);
  g.userData.update = (t) => {
    sun.material.emissiveIntensity = 0.6 + Math.sin(t * 2) * 0.2;
    rays.children.forEach((r, i) => { const p = (t * 0.6 + i / 8) % 1; r.position.set((i - 3.5) * 0.18, 3.0 - p * 3.2, 0); r.material.emissiveIntensity = 0.9 * (1 - p); });
    g.rotation.y = Math.sin(t * 0.2) * 0.4;
  };
  return g;
};

// 6 — Mitosis: chromosomes splitting, spindle, pinching cell
B.mitosis = () => {
  const g = new THREE.Group();
  const mem = new THREE.Mesh(new THREE.SphereGeometry(1.8, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0x4aa3ff, transparent: true, opacity: 0.14, emissive: 0x4aa3ff, emissiveIntensity: 0.2 }));
  g.add(mem);
  const chromo = new THREE.Group(); g.add(chromo);
  const cols = [0xff6f91, 0xffd166, 0x7ed957, 0x4aa3ff];
  for (let i = 0; i < 4; i++) {
    for (const side of [-1, 1]) {
      const c = new THREE.Mesh(new THREE.CapsuleGeometry(0.1, 0.5, 4, 8), glow(cols[i]));
      c.userData = { idx: i, side }; chromo.add(c);
    }
  }
  const lab = makeLabel("Anaphase: sisters separate", "#bcd8ff", 0.8); lab.position.set(0, 2.1, 0); g.add(lab);
  g.userData.update = (t) => {
    const phase = (Math.sin(t * 0.5) + 1) / 2; // 0 together → 1 apart
    chromo.children.forEach((c) => { const i = c.userData.idx, s = c.userData.side; const spread = phase * 1.2 * s; c.position.set((i - 1.5) * 0.35, spread, 0); c.rotation.z = 0.2 * s; });
    mem.scale.set(1, 1 + phase * 0.5, 1); // elongate then pinch
    mem.scale.x = 1 - phase * 0.25;
    g.rotation.y = t * 0.2;
  };
  return g;
};

// 7 — Meiosis: paired chromosomes crossing over
B.meiosis = () => {
  const g = new THREE.Group();
  const make = (color, x) => { const c = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 1.4, 4, 8), glow(color)); c.position.x = x; return c; };
  const pairs = new THREE.Group();
  const momCol = 0xff6f91, dadCol = 0x4aa3ff;
  const a = make(momCol, -0.25), b = make(dadCol, 0.25);
  pairs.add(a, b); g.add(pairs);
  // crossover spark
  const spark = ball(0.18, 0xffe066, 0, 0.2, 0); g.add(spark);
  const four = new THREE.Group(); g.add(four);
  for (let i = 0; i < 4; i++) { const c = make(i < 2 ? 0xff9bb0 : 0x8cc4ff, 0); c.userData.i = i; four.add(c); }
  const lab = makeLabel("Crossing over → 4 unique gametes", "#ffd0dc", 0.8); lab.position.set(0, 2.0, 0); g.add(lab);
  g.userData.update = (t) => {
    const ph = (Math.sin(t * 0.45) + 1) / 2;
    pairs.visible = ph < 0.5; four.visible = ph >= 0.5;
    spark.material.emissiveIntensity = 0.6 + Math.abs(Math.sin(t * 4)) * (ph < 0.5 ? 1 : 0);
    spark.visible = ph < 0.5 && ph > 0.2;
    four.children.forEach((c, i) => { const ang = (i / 4) * TAU; c.position.set(Math.cos(ang) * (ph * 1.3), 0, Math.sin(ang) * (ph * 1.3)); });
    g.rotation.y = t * 0.2;
  };
  return g;
};

// 8 — Genetics: 3D Punnett square with pea-flower phenotypes
B.genetics = () => {
  const g = new THREE.Group();
  const labels = [["PP", 0x9b5de5], ["Pp", 0x9b5de5], ["Pp", 0x9b5de5], ["pp", 0xffffff]];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
    const i = r * 2 + c;
    const tile = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x12303a, emissive: 0x0a1a22, roughness: .6 }));
    tile.position.set((c - 0.5) * 1.05, 0, (r - 0.5) * 1.05); g.add(tile);
    const flower = ball(0.26, labels[i][1], (c - 0.5) * 1.05, 0.35, (r - 0.5) * 1.05); g.add(flower);
    const lab = makeLabel(labels[i][0], labels[i][1] === 0xffffff ? "#fff" : "#d9b8ff", 0.5); lab.position.set((c - 0.5) * 1.05, 0.85, (r - 0.5) * 1.05); g.add(lab);
  }
  // parent alleles
  ["P", "p"].forEach((s, i) => { const l = makeLabel(s, "#7df0cf", 0.6); l.position.set((i - 0.5) * 1.05, 0.2, -1.5); g.add(l); });
  ["P", "p"].forEach((s, i) => { const l = makeLabel(s, "#7df0cf", 0.6); l.position.set(-1.5, 0.2, (i - 0.5) * 1.05); g.add(l); });
  const title = makeLabel("3 purple : 1 white", "#d9b8ff", 0.85); title.position.set(0, 1.7, 0); g.add(title);
  spin(g, 0, 0.15);
  return g;
};

// 9 — DNA double helix
B.dna = () => {
  const g = new THREE.Group();
  const cols = { A: 0xff6f91, T: 0xffd166, C: 0x4aa3ff, G: 0x7ed957 };
  const pairFor = { A: "T", T: "A", C: "G", G: "C" };
  const bases = ["A", "T", "C", "G", "A", "G", "C", "T", "A", "C", "G", "T", "A", "T", "G", "C", "A", "G"];
  const N = bases.length, rise = 0.36, turn = 0.55;
  const back1 = [], back2 = [];
  bases.forEach((bp, i) => {
    const y = (i - N / 2) * rise, a = i * turn;
    const p1 = new THREE.Vector3(Math.cos(a) * 1.1, y, Math.sin(a) * 1.1);
    const p2 = new THREE.Vector3(Math.cos(a + Math.PI) * 1.1, y, Math.sin(a + Math.PI) * 1.1);
    back1.push(p1); back2.push(p2);
    g.add(ball(0.16, 0xcfd8e0, p1.x, p1.y, p1.z));
    g.add(ball(0.16, 0xcfd8e0, p2.x, p2.y, p2.z));
    // rungs split in two colored halves
    const mid = p1.clone().add(p2).multiplyScalar(0.5);
    [[p1, mid, cols[bp]], [p2, mid, cols[pairFor[bp]]]].forEach(([s, e, col]) => {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, s.distanceTo(e), 6), glow(col));
      r.position.copy(s.clone().add(e).multiplyScalar(0.5)); r.lookAt(e); r.rotateX(Math.PI / 2); g.add(r);
    });
  });
  const tube = (pts, col) => { const c = new THREE.CatmullRomCurve3(pts); g.add(new THREE.Mesh(new THREE.TubeGeometry(c, 80, 0.07, 6), glow(col))); };
  tube(back1, 0xb98cff); tube(back2, 0xb98cff);
  const lab = makeLabel("A–T   C–G", "#e8f4f0", 0.9); lab.position.set(1.8, 0, 0); g.add(lab);
  spin(g, 0, 0.4);
  return g;
};

// 10 — Biotech: plasmid ring + gel electrophoresis bands
B.biotech = () => {
  const g = new THREE.Group();
  const plasmid = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.1, 12, 60), glow(0xb98cff));
  plasmid.position.set(-1.7, 0.4, 0); g.add(plasmid);
  const insert = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.13, 12, 16, 1.2), glow(0x35d0a5));
  insert.position.copy(plasmid.position); g.add(insert);
  const lp = makeLabel("Plasmid + gene", "#d9c4ff", 0.7); lp.position.set(-1.7, 1.8, 0); g.add(lp);
  // gel: lanes with bands at different heights
  const gel = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x0a2a33, transparent: true, opacity: 0.4, emissive: 0x06181d }));
  gel.position.set(1.5, 0.4, 0); g.add(gel);
  const bandY = [[0.9, 0.2, -0.6], [0.6, -0.3], [1.0, 0.4, -0.2, -0.7]];
  bandY.forEach((bands, lane) => bands.forEach((y) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.05), glow(0x5ad6ff));
    b.position.set(1.5 + (lane - 1) * 0.7, 0.4 + y, 0.12); g.add(b);
  }));
  const lg = makeLabel("Gel: sort DNA by size", "#9fe6ff", 0.7); lg.position.set(1.5, 2.0, 0); g.add(lg);
  g.userData.update = (t) => { plasmid.rotation.z = t * 0.5; insert.rotation.z = t * 0.5; };
  return g;
};

// 11 — Evolution: branching + finch beak variants under selection
B.evolution = () => {
  const g = new THREE.Group();
  // selection arrow of finches with growing beaks
  const cols = [0x7a5a3a, 0x9a6a3a, 0xba7a3a, 0xda8a3a];
  cols.forEach((c, i) => {
    const f = new THREE.Group();
    f.add(ball(0.3, c)); const beak = new THREE.Mesh(new THREE.ConeGeometry(0.1 + i * 0.05, 0.3 + i * 0.18, 8), glow(0xffcf66));
    beak.rotation.z = -Math.PI / 2; beak.position.x = 0.3 + (0.3 + i * 0.18) / 2; f.add(beak);
    f.position.set((i - 1.5) * 1.0, 0, 0); g.add(f);
  });
  // branching tree above
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.2, 6), glow(0xffb347)); trunk.position.y = 1.6; g.add(trunk);
  [[-0.7, 2.4], [0.7, 2.4], [-0.3, 2.0], [0.3, 2.0]].forEach(([x, y]) => {
    const br = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.8, 6), glow(0xffd28a));
    br.position.set(x * 0.7, y, 0); br.rotation.z = x > 0 ? -0.5 : 0.5; g.add(br);
    g.add(ball(0.12, 0xffe066, x, y + 0.4, 0));
  });
  const lab = makeLabel("Natural selection → adaptation", "#ffd9a8", 0.8); lab.position.set(0, -0.9, 0); g.add(lab);
  g.userData.update = (t) => { g.children.forEach((c, i) => { if (c.isGroup) c.position.y = Math.sin(t * 2 + i) * 0.08; }); };
  return g;
};

// 12 — Tree of life: three-domain phylogeny
B.tree = () => {
  const g = new THREE.Group();
  const root = ball(0.2, 0xffffff, 0, -1.5, 0); g.add(root);
  const domains = [["Bacteria", -1.6, 0x5ad6ff], ["Archaea", 0, 0xffd166], ["Eukarya", 1.6, 0x7ed957]];
  domains.forEach(([name, x, col]) => {
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 2.4, 6), glow(col));
    branch.position.set(x / 2, -0.3, 0); branch.lookAt(new THREE.Vector3(x, 1.2, 0)); branch.rotateX(Math.PI / 2); g.add(branch);
    // sub-twigs
    for (let i = 0; i < 4; i++) { const tw = ball(0.1 + Math.random() * 0.06, col, x + (Math.random() - 0.5) * 1.1, 1.0 + Math.random() * 1.0, (Math.random() - 0.5) * 0.6); g.add(tw); }
    const lab = makeLabel(name, "#" + col.toString(16).padStart(6, "0"), 0.7); lab.position.set(x, 2.4, 0); g.add(lab);
  });
  spin(g, 0, 0.15);
  return g;
};

// 13 — Microbes: bacteria rods/spirals, fungal hyphae, protist
B.microbes = () => {
  const g = new THREE.Group();
  // bacterium with flagellum
  const bac = new THREE.Group();
  bac.add(new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.7, 8, 12), glow(0x5ad6ff)));
  bac.position.set(-1.8, 0.3, 0); g.add(bac);
  const lab1 = makeLabel("Bacterium", "#9fe6ff", 0.6); lab1.position.set(-1.8, 1.2, 0); g.add(lab1);
  // fungal hyphae (branching lines)
  const fun = new THREE.Group();
  for (let i = 0; i < 12; i++) { const h = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 5), glow(0xe0b0ff)); h.position.set((Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 0.5); h.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3); fun.add(h); }
  fun.position.set(0, 0.3, 0); g.add(fun);
  const lab2 = makeLabel("Fungus (hyphae)", "#e6c4ff", 0.6); lab2.position.set(0, 1.4, 0); g.add(lab2);
  // protist blob
  const pro = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 1),
    new THREE.MeshStandardMaterial({ color: 0x7ed957, emissive: 0x3a7a2a, emissiveIntensity: 0.4, flatShading: true, transparent: true, opacity: 0.8 }));
  pro.position.set(1.8, 0.3, 0); g.add(pro);
  const lab3 = makeLabel("Protist", "#bff0a0", 0.6); lab3.position.set(1.8, 1.2, 0); g.add(lab3);
  g.userData.update = (t) => { bac.rotation.z = Math.sin(t * 3) * 0.2; pro.rotation.y = t; pro.scale.setScalar(1 + Math.sin(t * 2) * 0.08); fun.rotation.y = t * 0.3; };
  return g;
};

// 14 — Plants: from moss to vascular tree to flower
B.plants = () => {
  const g = new THREE.Group();
  // ground tiers
  const moss = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 8), glow(0x2e7d32)); moss.scale.y = 0.4; moss.position.set(-2, 0, 0); g.add(moss);
  // fern/vascular
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.4, 6), glow(0x3a8a3a)); stem.position.set(0, 0.7, 0); g.add(stem);
  for (let i = 0; i < 5; i++) { const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5, 6), glow(0x4caf50)); const a = (i / 5) * TAU; leaf.position.set(Math.cos(a) * 0.3, 0.4 + i * 0.22, Math.sin(a) * 0.3); leaf.rotation.z = Math.PI / 2 * (Math.cos(a)); g.add(leaf); }
  // tree
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 1.6, 8), glow(0x6d4c2a)); trunk.position.set(2, 0.8, 0); g.add(trunk);
  const canopy = ball(0.7, 0x2e8b57, 2, 1.9, 0); g.add(canopy);
  // flower (latest)
  const fstem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 6), glow(0x4caf50)); fstem.position.set(0.9, 0.35, 0.9); g.add(fstem);
  for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU; const petal = ball(0.12, 0xff6f91, 0.9 + Math.cos(a) * 0.18, 0.75, 0.9 + Math.sin(a) * 0.18); g.add(petal); }
  g.add(ball(0.1, 0xffe066, 0.9, 0.75, 0.9));
  const labs = [["Moss", -2, 0.6], ["Vascular", 0, 1.7], ["Tree", 2, 2.8], ["Flower", 0.9, 1.2]];
  labs.forEach(([n, x, y]) => { const l = makeLabel(n, "#bff0a0", 0.6); l.position.set(x, y, n === "Flower" ? 0.9 : 0); g.add(l); });
  g.userData.update = (t) => { g.rotation.y = Math.sin(t * 0.2) * 0.3; canopy.scale.setScalar(1 + Math.sin(t) * 0.03); };
  return g;
};

// 15 — Animals: symmetry progression sponge→jelly→bilateral→vertebrate
B.animals = () => {
  const g = new THREE.Group();
  // sponge (no symmetry)
  const sp = new THREE.Mesh(new THREE.DodecahedronGeometry(0.45, 0), new THREE.MeshStandardMaterial({ color: 0xffa07a, emissive: 0x7a3a2a, emissiveIntensity: 0.3, flatShading: true })); sp.position.set(-2.4, 0.3, 0); g.add(sp);
  // jelly (radial)
  const jelly = new THREE.Group(); const bell = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 12, 0, TAU, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xff6f91, emissive: 0xaa3a5a, emissiveIntensity: 0.35, transparent: true, opacity: 0.7 })); jelly.add(bell);
  for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU; const tent = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.01, 0.6, 5), glow(0xff9bb0)); tent.position.set(Math.cos(a) * 0.3, -0.3, Math.sin(a) * 0.3); jelly.add(tent); }
  jelly.position.set(-0.8, 0.3, 0); g.add(jelly);
  // worm (bilateral)
  const worm = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 1.0, 6, 10), glow(0xff7a5a)); worm.rotation.z = Math.PI / 2; worm.position.set(0.8, 0.3, 0); g.add(worm);
  // fish (vertebrate)
  const fish = new THREE.Group(); const fb = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 12), glow(0x4aa3ff)); fb.scale.set(1.4, 0.8, 0.6); fish.add(fb);
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.5, 4), glow(0x4aa3ff)); tail.rotation.z = Math.PI / 2; tail.position.x = -0.6; fish.add(tail); fish.position.set(2.4, 0.3, 0); g.add(fish);
  [["Sponge", -2.4], ["Radial", -0.8], ["Bilateral", 0.8], ["Vertebrate", 2.4]].forEach(([n, x]) => { const l = makeLabel(n, "#cfe0ff", 0.6); l.position.set(x, 1.1, 0); g.add(l); });
  g.userData.update = (t) => { jelly.children.forEach((c, i) => { if (i > 0) c.rotation.x = Math.sin(t * 2 + i) * 0.3; }); worm.position.y = 0.3 + Math.sin(t * 2) * 0.05; fish.position.y = 0.3 + Math.sin(t * 3) * 0.08; fish.rotation.y = Math.sin(t) * 0.3; };
  return g;
};

// 16 — Body systems: translucent figure with system rings
B.body = () => {
  const g = new THREE.Group();
  const fig = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 1.6, 8, 16),
    new THREE.MeshStandardMaterial({ color: 0xff6f91, transparent: true, opacity: 0.18, emissive: 0xff6f91, emissiveIntensity: 0.15 }));
  fig.position.y = 0.4; g.add(fig);
  g.add(ball(0.42, 0xff6f91, 0, 1.6, 0)); // head
  // heart
  const heart = ball(0.22, 0xff3a5a, 0, 0.8, 0.2); g.add(heart);
  // lungs
  g.add(ball(0.18, 0x5ad6ff, -0.25, 0.9, 0.1)); g.add(ball(0.18, 0x5ad6ff, 0.25, 0.9, 0.1));
  // circulatory rings
  const rings = new THREE.Group(); g.add(rings);
  for (let i = 0; i < 3; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.7 + i * 0.12, 0.015, 8, 40), glow(0xffd166)); r.rotation.x = Math.PI / 2; r.position.y = 0.4; rings.add(r); }
  const lab = makeLabel("Homeostasis: systems in balance", "#ffd0dc", 0.8); lab.position.set(0, 2.4, 0); g.add(lab);
  g.userData.update = (t) => { const beat = 1 + Math.abs(Math.sin(t * 3)) * 0.25; heart.scale.setScalar(beat); rings.rotation.y = t * 0.4; };
  return g;
};

// 17 — Immune: pathogen swarmed by antibodies
B.immune = () => {
  const g = new THREE.Group();
  const path = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 1),
    new THREE.MeshStandardMaterial({ color: 0x9b2d2d, emissive: 0xff3a3a, emissiveIntensity: 0.4, flatShading: true }));
  g.add(path);
  // spikes
  for (let i = 0; i < 14; i++) { const s = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.2, 5), glow(0xff6a6a)); const a = (i / 14) * TAU, b = Math.acos(2 * (i / 14) - 1); s.position.set(Math.sin(b) * Math.cos(a) * 0.6, Math.cos(b) * 0.6, Math.sin(b) * Math.sin(a) * 0.6); s.lookAt(s.position.clone().multiplyScalar(2)); s.rotateX(Math.PI / 2); g.add(s); }
  // antibodies (Y shapes approximated)
  const abs = new THREE.Group(); g.add(abs);
  for (let i = 0; i < 10; i++) { const y = new THREE.Group(); y.add(new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.3, 5), glow(0x35d0a5))); const a1 = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.2, 5), glow(0x7df0cf)); a1.position.set(0.06, 0.2, 0); a1.rotation.z = -0.6; const a2 = a1.clone(); a2.position.x = -0.06; a2.rotation.z = 0.6; y.add(a1, a2); y.userData.ph = Math.random() * TAU; abs.add(y); }
  const lab = makeLabel("Antibodies target the pathogen", "#9bf0d0", 0.8); lab.position.set(0, 1.6, 0); g.add(lab);
  g.userData.update = (t) => { path.rotation.y = t * 0.5; abs.children.forEach((y, i) => { const a = t * 0.8 + y.userData.ph, r = 1.4 - (Math.sin(t + i) * 0.5 + 0.5) * 0.6; y.position.set(Math.cos(a) * r, Math.sin(a * 1.3) * 0.5, Math.sin(a) * r); y.lookAt(0, 0, 0); }); };
  return g;
};

// 18 — Development: zygote cleaving to morula/blastula
B.development = () => {
  const g = new THREE.Group();
  const cells = new THREE.Group(); g.add(cells);
  const seed = ball(0.7, 0xff9bb0, 0, 0, 0); cells.add(seed);
  const lab = makeLabel("Zygote → cleavage → embryo", "#ffd0dc", 0.8); lab.position.set(0, 1.6, 0); g.add(lab);
  let stage = 0;
  g.userData.update = (t) => {
    const s = Math.floor((t * 0.4) % 4); // 0..3 stages
    if (s !== stage) {
      stage = s; cells.clear();
      const n = [1, 2, 4, 16][s], r = [0.7, 0.5, 0.4, 0.25][s];
      for (let i = 0; i < n; i++) { const b = Math.acos(1 - 2 * (i + 0.5) / n), a = TAU * 0.618 * i; const rr = n === 1 ? 0 : 0.6; cells.add(ball(r, 0xff9bb0, Math.sin(b) * Math.cos(a) * rr, Math.cos(b) * rr, Math.sin(b) * Math.sin(a) * rr)); }
    }
    cells.rotation.y = t * 0.4;
  };
  return g;
};

// 19 — Population: predator/prey curves + animal markers
B.population = () => {
  const g = new THREE.Group();
  // logistic S-curve made of beads
  const prey = new THREE.Group(); g.add(prey);
  for (let i = 0; i < 30; i++) { const x = (i / 29) * 4 - 2; const y = 2 / (1 + Math.exp(-(i - 14) * 0.5)) - 0.5; prey.add(ball(0.06, 0x7ed957, x, y, 0)); }
  const pred = new THREE.Group(); g.add(pred);
  for (let i = 0; i < 30; i++) { const x = (i / 29) * 4 - 2; const y = Math.sin(i * 0.4) * 0.5 + 0.5; pred.add(ball(0.06, 0xff6f91, x, y, 0.3)); }
  // carrying-capacity line
  const cap = new THREE.Mesh(new THREE.BoxGeometry(4, 0.02, 0.02), glow(0xffd166)); cap.position.set(0, 1.5, 0); g.add(cap);
  const lc = makeLabel("Carrying capacity", "#ffe08a", 0.6); lc.position.set(2.6, 1.5, 0); g.add(lc);
  const l1 = makeLabel("Prey (S-curve)", "#bff0a0", 0.6); l1.position.set(-1.8, 2.0, 0); g.add(l1);
  g.userData.update = (t) => { prey.children.forEach((b, i) => { b.material.emissiveIntensity = 0.4 + 0.6 * Math.max(0, Math.sin(t * 2 - i * 0.2)); }); g.rotation.y = Math.sin(t * 0.15) * 0.25; };
  return g;
};

// 20 — Ecosystem: energy pyramid + sun
B.ecosystem = () => {
  const g = new THREE.Group();
  const tiers = [["Producers", 0x7ed957, 2.2, 0], ["Herbivores", 0xffd166, 1.5, 0.7], ["Carnivores", 0xff7a5a, 0.9, 1.4], ["Apex", 0xff3a5a, 0.45, 2.0]];
  tiers.forEach(([n, c, w, y]) => {
    const box = new THREE.Mesh(new THREE.BoxGeometry(w, 0.5, w),
      new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.3, transparent: true, opacity: 0.8 }));
    box.position.y = y - 0.5; g.add(box);
    const l = makeLabel(n, "#" + c.toString(16).padStart(6, "0"), 0.55); l.position.set(w / 2 + 1.0, y - 0.5, 0); g.add(l);
  });
  const sun = ball(0.4, 0xffe066, -2.2, 2.0, 0); g.add(sun);
  const ls = makeLabel("10% energy per level →", "#ffe98a", 0.6); ls.position.set(0, 2.7, 0); g.add(ls);
  // recycled-matter ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.03, 8, 60), glow(0x5ad6ff)); ring.rotation.x = Math.PI / 2; ring.position.y = -0.3; g.add(ring);
  g.userData.update = (t) => { sun.material.emissiveIntensity = 0.6 + Math.sin(t * 2) * 0.2; ring.rotation.z = t * 0.3; };
  return g;
};

// 21 — Conservation: globe of biomes with species lights
B.conservation = () => {
  const g = new THREE.Group();
  const globe = new THREE.Mesh(new THREE.SphereGeometry(1.6, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0x1b6e4a, emissive: 0x0c3a26, emissiveIntensity: 0.3, roughness: 0.7 }));
  g.add(globe);
  const atmos = new THREE.Mesh(new THREE.SphereGeometry(1.75, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0x5ad6ff, transparent: true, opacity: 0.12, side: THREE.BackSide }));
  g.add(atmos);
  const lights = new THREE.Group(); g.add(lights);
  const cols = [0x7ed957, 0xffd166, 0xff6f91, 0x5ad6ff, 0xb98cff];
  for (let i = 0; i < 60; i++) { const b = Math.acos(1 - 2 * (i + 0.5) / 60), a = TAU * 0.618 * i; const sp = ball(0.05, cols[i % 5], Math.sin(b) * Math.cos(a) * 1.65, Math.cos(b) * 1.65, Math.sin(b) * Math.sin(a) * 1.65); sp.userData.ph = Math.random() * TAU; lights.add(sp); }
  const lab = makeLabel("Protect biodiversity", "#bff0a0", 0.9); lab.position.set(0, 2.2, 0); g.add(lab);
  g.userData.update = (t) => { globe.rotation.y = t * 0.15; lights.rotation.y = t * 0.15; lights.children.forEach((s, i) => s.material.emissiveIntensity = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + s.userData.ph))); };
  return g;
};

export const VISUALS = B;

export function buildVisual(key) {
  const fn = VISUALS[key] || VISUALS.cell;
  return fn();
}
