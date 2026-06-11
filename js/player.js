// player.js — first-person controller (pointer lock + WASD), proximity-based
// interaction targeting, and soft collision with room bounds.

import * as THREE from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

export class Player {
  constructor(camera, domElement) {
    this.camera = camera;
    this.controls = new PointerLockControls(camera, domElement);
    this.velocity = new THREE.Vector3();
    this.keys = {};
    this.height = 1.7;
    this.speed = 7.5;
    this.target = null;        // current interactable in focus
    this.enabled = false;
    this.bounds = { x: 8, z: 10 };

    window.addEventListener("keydown", (e) => { this.keys[e.code] = true; });
    window.addEventListener("keyup", (e) => { this.keys[e.code] = false; });
  }

  get object() { return this.controls.getObject ? this.controls.getObject() : this.camera; }

  lock() { this.controls.lock(); }
  unlock() { this.controls.unlock(); }

  spawn(x, z, lookZ = 1) {
    const o = this.object;
    o.position.set(x, this.height, z);
    this.velocity.set(0, 0, 0);
    // Three.js cameras look down -z by default; rotate by PI to face +z (room center)
    this.camera.rotation.set(0, lookZ > 0 ? Math.PI : 0, 0);
  }

  update(dt, interactables) {
    if (!this.enabled) return;
    const o = this.object;
    // movement relative to view
    const forward = (this.keys.KeyW ? 1 : 0) - (this.keys.KeyS ? 1 : 0);
    const strafe = (this.keys.KeyD ? 1 : 0) - (this.keys.KeyA ? 1 : 0);
    const damping = Math.exp(-9 * dt);
    this.velocity.x *= damping; this.velocity.z *= damping;
    const accel = this.speed * 9;
    if (forward || strafe) {
      const dir = new THREE.Vector3();
      this.camera.getWorldDirection(dir); dir.y = 0; dir.normalize();
      const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
      const move = new THREE.Vector3().addScaledVector(dir, forward).addScaledVector(right, strafe).normalize();
      this.velocity.addScaledVector(move, accel * dt);
    }
    const cap = this.speed;
    const hsp = Math.hypot(this.velocity.x, this.velocity.z);
    if (hsp > cap) { this.velocity.x *= cap / hsp; this.velocity.z *= cap / hsp; }
    o.position.x += this.velocity.x * dt;
    o.position.z += this.velocity.z * dt;
    o.position.y = this.height;

    // soft collision with room bounds
    o.position.x = Math.max(-this.bounds.x, Math.min(this.bounds.x, o.position.x));
    o.position.z = Math.max(-this.bounds.z, Math.min(this.bounds.z, o.position.z));
    // keep clear of central pedestal
    const distC = Math.hypot(o.position.x, o.position.z);
    if (distC < 3.0) { const a = Math.atan2(o.position.z, o.position.x); o.position.x = Math.cos(a) * 3.0; o.position.z = Math.sin(a) * 3.0; }

    // find focus interactable: nearest within radius and within view cone
    this.target = null;
    let best = Infinity;
    const camDir = new THREE.Vector3(); this.camera.getWorldDirection(camDir);
    for (const it of interactables) {
      const d = o.position.distanceTo(it.pos);
      if (d > it.radius) continue;
      const to = it.pos.clone().sub(o.position).normalize();
      const facing = to.dot(camDir);
      if (facing < 0.25) continue;        // must be looking roughly at it
      const score = d - facing * 2.0;
      if (score < best) { best = score; this.target = it; }
    }
  }
}
