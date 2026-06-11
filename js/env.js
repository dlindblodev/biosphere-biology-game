// env.js — cosmic environment: nebula sky dome, twinkling starfield, and a
// PMREM-generated reflection map so metals/glass in the chambers catch light.

import * as THREE from "three";

function nebulaTexture(tint = 0x2a6c5a) {
  const c = document.createElement("canvas");
  c.width = 2048; c.height = 1024;
  const x = c.getContext("2d");
  // deep space base
  const base = x.createLinearGradient(0, 0, 0, c.height);
  base.addColorStop(0, "#01030a");
  base.addColorStop(0.5, "#04070f");
  base.addColorStop(1, "#02040b");
  x.fillStyle = base; x.fillRect(0, 0, c.width, c.height);
  // nebula clouds
  const clouds = [
    ["#0c4a3a", 0.18], ["#123a6e", 0.16], ["#3a1f5e", 0.14], ["#0a5a6e", 0.12],
  ];
  clouds.forEach(([col, a]) => {
    for (let i = 0; i < 7; i++) {
      const cx = Math.random() * c.width, cy = Math.random() * c.height * 0.9;
      const r = 180 + Math.random() * 420;
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, col); g.addColorStop(1, "rgba(0,0,0,0)");
      x.globalAlpha = a * (0.5 + Math.random() * 0.5);
      x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill();
    }
  });
  x.globalAlpha = 1;
  // distant star dust
  for (let i = 0; i < 1400; i++) {
    const px = Math.random() * c.width, py = Math.random() * c.height;
    const s = Math.random();
    x.fillStyle = `rgba(${200 + Math.random() * 55},${230 + Math.random() * 25},255,${0.3 + s * 0.7})`;
    x.fillRect(px, py, s < 0.92 ? 1 : 2, s < 0.92 ? 1 : 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.mapping = THREE.EquirectangularReflectionMapping;
  return tex;
}

export function createEnvironment(renderer, scene) {
  const group = new THREE.Group();

  // --- sky dome ---
  const sky = nebulaTexture();
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(120, 48, 32),
    new THREE.MeshBasicMaterial({ map: sky, side: THREE.BackSide, fog: false, depthWrite: false })
  );
  group.add(dome);

  // --- starfield (bright, additive, twinkling) ---
  const N = 1600;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), siz = new Float32Array(N);
  const palette = [[0.8, 0.95, 1], [0.6, 0.85, 1], [1, 0.85, 0.7], [0.7, 1, 0.9], [0.85, 0.8, 1]];
  for (let i = 0; i < N; i++) {
    const u = Math.random(), v = Math.random();
    const th = u * Math.PI * 2, ph = Math.acos(2 * v - 1);
    const r = 70 + Math.random() * 40;
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = Math.abs(r * Math.cos(ph)) * 0.9 + 6; // bias upward
    pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    const cc = palette[(Math.random() * palette.length) | 0];
    col[i * 3] = cc[0]; col[i * 3 + 1] = cc[1]; col[i * 3 + 2] = cc[2];
    siz[i] = 0.3 + Math.random() * 1.4;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  geo.setAttribute("size", new THREE.BufferAttribute(siz, 1));
  const starMat = new THREE.PointsMaterial({
    size: 1, vertexColors: true, transparent: true, opacity: 0.95,
    sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false,
  });
  const stars = new THREE.Points(geo, starMat);
  group.add(stars);

  // --- reflection environment (PMREM from a colored light scene) ---
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x05080c);
  const panels = [
    [0x1d8d72, -1, 0.2, 0], [0x2a5a9e, 1, 0.4, 0], [0x4a2a7e, 0, 0.8, -1], [0x0e5a6e, 0, -0.2, 1],
  ];
  panels.forEach(([c, x, y, z]) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(8, 8),
      new THREE.MeshBasicMaterial({ color: c }));
    m.position.set(x * 6, y * 6 + 2, z * 6); m.lookAt(0, 2, 0); envScene.add(m);
  });
  const envMap = pmrem.fromScene(envScene, 0.04).texture;
  envScene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  pmrem.dispose();

  scene.environment = envMap;
  scene.add(group);

  return {
    group, envMap,
    update(t) {
      stars.rotation.y = t * 0.004;
      starMat.opacity = 0.8 + Math.sin(t * 0.7) * 0.12;
    },
  };
}
