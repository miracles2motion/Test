// Enemies: doodle humanoids (asdf-style stick figures with faces), flyers, bombers, shield bearers and a boss.
import * as THREE from 'three';
import { makeInkMaterial, setFill, INK } from './render.js';
import { makeBody, SEE_THROUGH } from './physics.js';
import { rand, randInt, clamp, damp, wrapAngle, angleLerp, choose, alignYAxis, TAU } from './util.js';
import { audio } from './audio.js';
import { EnemyBrain } from './enemy-brain.js';

const _v = new THREE.Vector3(), _v2 = new THREE.Vector3(), _v3 = new THREE.Vector3(), _d = new THREE.Vector3(), _q = new THREE.Quaternion(), _m = new THREE.Matrix4(), _s = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0), _eye = new THREE.Vector3(), _goal = new THREE.Vector3(), _aimV = new THREE.Vector3();
const nxOf = (dx, d) => dx / (d || 1), nzOf = (dz, d) => dz / (d || 1);

export const BOSSES = ['boss', 'eraser', 'inkblot'];
export const STATE_CODES = { spawn: 0, hunt: 1, stunned: 2, dead: 3 }; export const STATE_NAMES = ['spawn', 'hunt', 'stunned', 'dead'];
export const TYPES = {
  grunt: { role: 'ranged', canDodge: true, canCover: true, canRetreat: true, canFlank: true, hp: 100, speed: 5.2, weapon: 'rifle', range: 28, stop: 16, keep: 7, burst: 3, burstInt: 0.15, cool: [1.6, 2.6], dmg: 6, spread: 0.055, pspeed: 36, score: 100, scale: 1.0, name: 'GRUNT', hat: 'cap', build: { bodyW: 1, headS: 1, limbR: 0.032 } },
  rusher: { role: 'melee', canDodge: true, canCover: true, canRetreat: false, canFlank: true, berserker: true, hp: 70, speed: 7.6, weapon: 'blade', lunge: 2.9, reach: 3.0, standoff: 1.9, cool: [1.0, 1.5], dmg: 15, score: 120, scale: 0.95, name: 'RUSHER', hat: 'band', build: { bodyW: 0.82, headS: 0.95, limbR: 0.027 } },
  heavy: { role: 'ranged', canDodge: false, canCover: true, canRetreat: false, canFlank: true, hp: 420, speed: 2.8, weapon: 'shotgun', range: 18, stop: 9, keep: 5, pellets: 8, cool: [2.0, 2.8], dmg: 6, spread: 0.14, pspeed: 32, score: 300, scale: 1.35, name: 'HEAVY', hat: 'helmet', shield: true, isHeavyShield: true, build: { bodyW: 1.6, headS: 0.9, limbR: 0.055 } },
  sniper: { role: 'ranged', canDodge: true, canCover: true, canRetreat: true, canFlank: false, hp: 60, speed: 4.8, weapon: 'sniper', range: 90, stop: 90, keep: 15, aimTime: 1.6, cool: [2.6, 3.6], dmg: 24, spread: 0.005, pspeed: 98, score: 200, scale: 1.05, name: 'SNIPER', stationary: false, hat: 'hood', build: { bodyW: 0.78, headS: 0.92, limbR: 0.026 } },
  shield: { role: 'ranged', canDodge: false, canCover: true, canRetreat: true, canFlank: true, hp: 150, speed: 3.8, weapon: 'pistol', range: 20, stop: 8, keep: 4, burst: 2, burstInt: 0.2, cool: [1.8, 2.6], dmg: 5, spread: 0.06, pspeed: 34, score: 200, scale: 1.05, name: 'SHIELDBEARER', hat: 'helmet', shield: true, build: { bodyW: 1.2, headS: 0.9, limbR: 0.042 } },
  bomber: { role: 'kamikaze', canDodge: false, canCover: false, canRetreat: false, canFlank: false, hp: 26, speed: 6.5, weapon: 'bomb', fuseRange: 3.4, fuse: 1.05, blast: 4.2, dmg: 24, score: 150, scale: 0.9, name: 'INK BOMB', ink: INK.BLACK, model: 'bomber' },
  flyer: { role: 'aerial', canDodge: false, canCover: false, canRetreat: false, canFlank: false, hp: 40, speed: 6.2, weapon: 'dive', dmg: 10, cool: [2.8, 4.2], score: 140, scale: 1.5, name: 'PAPER WASP', flying: true, model: 'flyer' },
  boss: { role: 'boss', canDodge: false, canCover: false, canRetreat: false, canFlank: false, hp: 2600, speed: 3.2, weapon: 'boss', bossKind: 'doodler', range: 32, stop: 6, keep: 0, cool: [2.6, 3.6], dmg: 22, score: 2500, scale: 2.7, name: 'THE DOODLER', boss: true, ink: INK.BLACK, hat: 'crown', build: { bodyW: 1.35, headS: 1.15, limbR: 0.06 } },
  eraser: { role: 'boss', canDodge: false, canCover: false, canRetreat: false, canFlank: false, hp: 3400, speed: 4.2, weapon: 'boss', bossKind: 'eraser', range: 30, stop: 8, keep: 0, cool: [2.2, 3.2], dmg: 26, score: 3200, scale: 2.6, name: 'THE ERASER', boss: true, ink: INK.PINK, model: 'blob', build: {} },
  inkblot: { role: 'boss', canDodge: false, canCover: false, canRetreat: false, canFlank: false, hp: 3000, speed: 3.0, weapon: 'boss', bossKind: 'inkblot', range: 34, stop: 10, keep: 0, cool: [2.4, 3.4], dmg: 20, score: 3600, scale: 2.4, name: 'THE INKBLOT', boss: true, ink: INK.BLACK, model: 'blob', build: {} },
  forest_monkey: { role: 'ranged', canDodge: true, canCover: true, canRetreat: true, canFlank: true, leaper: true, tail: true, hp: 85, speed: 7.2, weapon: 'rifle', range: 26, stop: 12, keep: 6, burst: 3, burstInt: 0.12, cool: [1.2, 1.8], dmg: 5, spread: 0.06, pspeed: 40, score: 180, scale: 0.82, name: 'TREE MONKEY', hat: 'monkey', build: { bodyW: 0.72, headS: 0.88, limbR: 0.024 } },
  bamboo_stalker: { role: 'ranged', canDodge: true, canCover: true, canRetreat: true, canFlank: false, hp: 65, speed: 5.2, weapon: 'sniper', range: 85, stop: 85, keep: 16, aimTime: 1.4, cool: [2.2, 3.2], dmg: 22, spread: 0.006, pspeed: 92, score: 220, scale: 0.95, name: 'BAMBOO STALKER', stationary: false, hat: 'conical', build: { bodyW: 0.76, headS: 0.90, limbR: 0.025 } },
};

// ---------------- doodle model kit ----------------
// Everything below is drawn as pen strokes: limbs are slightly bowed tubes, bodies are
// flattened ovals and none of it is hatched, so enemies read as ink drawings on the page
// rather than as shaded 3D primitives.
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
function bx(w, h, d, x, y, z, mat, parent) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); parent.add(m); return m; }
function sph(r, x, y, z, mat, parent, seg = 8) { const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(4, seg - 2)), mat); m.position.set(x, y, z); parent.add(m); return m; }
// a flattened oval "drawn" body part
function blob(rx, ry, rz, x, y, z, mat, parent) { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 8), mat); m.scale.set(rx, ry, rz); m.position.set(x, y, z); parent.add(m); return m; }
// a limb: one slightly bowed stroke hanging from its pivot, with a marker at its middle for hit tests
function noodle(len, r, mat, parent, x, y, z, bow = 0.05) {
  const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
  const c = new THREE.QuadraticBezierCurve3(V3(0, 0, 0), V3(rand(-bow, bow), -len * 0.5, rand(-bow, bow) + bow * 0.6), V3(0, -len, 0));
  g.add(new THREE.Mesh(new THREE.TubeGeometry(c, 5, r, 6, false), mat));
  const mid = new THREE.Object3D(); mid.position.y = -len * 0.55; g.add(mid);
  g.userData.mid = mid; g.userData.len = len; return g;
}
function mitten(r, mat, parent, y) { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 7, 5), mat); m.position.y = y; m.scale.set(1, 1.15, 0.8); parent.add(m); return m; }
function shoe(mat, parent, y, s = 1) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.1 * s, 7, 5), mat); m.position.set(0, y, 0.06 * s); m.scale.set(1, 0.62, 1.9); parent.add(m); return m; }
// dot eyes, angry brows and a curved mouth, all solid ink so they read at a glance
function doodleFace(headG, solid, opts = {}) {
  const eyes = new THREE.Group(); headG.add(eyes);
  const ex = opts.ex ?? 0.1, ey = opts.ey ?? 0.03, ez = opts.ez ?? 0.25, er = opts.er ?? 0.045;
  for (const sx of [-1, 1]) {
    const e = sph(er, sx * ex, ey, ez, solid, eyes, 6); e.scale.set(0.85, 1.15, 0.7);
    const b = bx(0.115, 0.026, 0.026, sx * ex, ey + 0.11, ez - 0.01, solid, eyes); b.rotation.z = sx * -0.5;
  }
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.018, 4, 9, Math.PI * 0.9), solid);
  mouth.position.set(0, ey - 0.16, ez - 0.02); mouth.rotation.z = opts.smile ? Math.PI : 0; eyes.add(mouth);
  const xeyes = new THREE.Group(); headG.add(xeyes); xeyes.visible = false;
  for (const sx of [-1, 1]) for (const a of [0.8, -0.8]) { const c = bx(0.13, 0.024, 0.024, sx * ex, ey, ez, solid, xeyes); c.rotation.z = a; }
  const o = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.018, 4, 9), solid); o.position.set(0, ey - 0.17, ez - 0.02); xeyes.add(o);
  return { eyes, xeyes };
}
function buildHat(headG, mat, solid, T) {
  const h = T.hat;
  if (h === 'cap') { const c = new THREE.Mesh(new THREE.SphereGeometry(0.29, 10, 5, 0, TAU, 0, Math.PI * 0.5), mat); c.position.y = 0.05; c.scale.y = 0.62; headG.add(c); const brim = bx(0.34, 0.035, 0.24, 0, 0.05, 0.24, mat, headG); brim.rotation.x = -0.18; }
  else if (h === 'band') { const b = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.028, 5, 14), solid); b.rotation.x = Math.PI / 2; b.position.y = 0.11; headG.add(b); for (const [dx, dz, a] of [[0.24, -0.22, 0.5], [0.2, -0.3, -0.3]]) { const t = bx(0.04, 0.03, 0.4, dx, 0.08 - dz * 0.2, -0.26, solid, headG); t.rotation.y = a; } for (let i = 0; i < 4; i++) { const sp = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.2, 4), mat); sp.position.set(-0.12 + i * 0.08, 0.28, 0.02); sp.rotation.z = (i - 1.5) * 0.35; headG.add(sp); } }
  else if (h === 'helmet') { const c = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 6, 0, TAU, 0, Math.PI * 0.55), mat); c.position.y = 0.0; c.scale.y = 0.85; headG.add(c); const rim = new THREE.Mesh(new THREE.TorusGeometry(0.315, 0.03, 4, 14), mat); rim.rotation.x = Math.PI / 2; rim.position.y = -0.02; headG.add(rim); }
  else if (h === 'hood') { const c = new THREE.Mesh(new THREE.SphereGeometry(0.33, 10, 7, 0, TAU, 0, Math.PI * 0.62), mat); c.position.y = -0.02; c.scale.set(1.03, 1.15, 0.95); headG.add(c); const tail = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.5, 5), mat); tail.position.set(0, 0.16, -0.3); tail.rotation.x = 1.5; headG.add(tail); }
  else if (h === 'crown') { for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU; const sp = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.26, 4), mat); sp.position.set(Math.cos(a) * 0.22, 0.34, Math.sin(a) * 0.22); headG.add(sp); } const b = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.035, 4, 14), mat); b.rotation.x = Math.PI / 2; b.position.y = 0.24; headG.add(b); }
  else if (h === 'monkey') { for (const sx of [-1, 1]) { const ear = sph(0.11, sx * 0.28, 0.04, 0, mat, headG, 6); ear.scale.set(0.65, 1.1, 0.8); const inner = sph(0.06, sx * 0.28, 0.04, 0.02, solid, headG, 5); inner.scale.set(0.5, 0.9, 0.7); } }
  else if (h === 'conical') { const cone = new THREE.Mesh(new THREE.ConeGeometry(0.38, 0.16, 8), mat); cone.position.y = 0.32; headG.add(cone); const band = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.022, 4, 12), solid); band.rotation.x = Math.PI / 2; band.position.y = 0.26; headG.add(band); }
}
