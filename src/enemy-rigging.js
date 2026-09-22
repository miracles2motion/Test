import * as THREE from 'three';
import { INK, makeInkMaterial } from './render.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { rand, clamp, TAU } from './util.js';
import { V3, bx, blob, noodle, sph, mitten, shoe, doodleFace, buildHat } from './enemy-types.js';
import { audio } from './audio.js';
import { SEE_THROUGH } from './physics.js';

export function buildWeaponProp(gun, mat, solid, T) {
  if (T.weapon === 'blade') { bx(0.02, 0.05, 0.95, 0, 0.04, 0.42, mat, gun); bx(0.11, 0.11, 0.03, 0, 0.04, -0.06, solid, gun); bx(0.035, 0.045, 0.24, 0, 0.04, -0.19, solid, gun); }
  else if (T.weapon === 'shotgun') { bx(0.1, 0.13, 0.66, 0, 0.02, 0.2, mat, gun); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.5, 6), solid); b.rotation.x = Math.PI / 2; b.position.set(0, 0.08, 0.5); gun.add(b); }
  else if (T.weapon === 'sniper') { bx(0.075, 0.11, 0.6, 0, 0.02, 0.15, mat, gun); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.95, 6), solid); b.rotation.x = Math.PI / 2; b.position.set(0, 0.05, 0.72); gun.add(b); bx(0.06, 0.07, 0.22, 0, 0.13, 0.06, solid, gun); }
  else if (T.weapon === 'pistol') { bx(0.055, 0.09, 0.3, 0, 0.03, 0.13, mat, gun); bx(0.045, 0.11, 0.055, 0, -0.05, 0, solid, gun); }
  else if (T.weapon === 'boss') { const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.4, 7), makeInkMaterial({ ink: INK.ORANGE, shadeScale: 0, shadeBias: 1 })); pen.position.y = 0.7; gun.add(pen); const tip = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.38, 6), solid); tip.position.y = 2.08; gun.add(tip); const er = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.26, 8), makeInkMaterial({ ink: INK.PINK, shadeScale: 0, shadeBias: 1 })); er.position.y = -0.62; gun.add(er); }
  else { bx(0.085, 0.12, 0.5, 0, 0.02, 0.16, mat, gun); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.34, 6), solid); b.rotation.x = Math.PI / 2; b.position.set(0, 0.05, 0.52); gun.add(b); bx(0.05, 0.16, 0.09, 0, -0.09, 0.08, mat, gun); }
}

export function buildHumanoid(mat, solid, T) {
  const root = new THREE.Group(); const parts = {}, J = {};
  const build = T.build || {};
  const bodyW = build.bodyW ?? 1, headS = build.headS ?? 1, limbR = build.limbR ?? 0.032;
  const jit = rand(0.95, 1.06); // every figure is drawn slightly differently
  const hips = new THREE.Group(); hips.position.y = 0.86; root.add(hips);
  parts.hips = new THREE.Object3D(); hips.add(parts.hips);
  if (T.tail) {
    const tailC = new THREE.QuadraticBezierCurve3(V3(0, 0, -0.16), V3(0, 0.28, -0.45), V3(0, 0.48, -0.32));
    hips.add(new THREE.Mesh(new THREE.TubeGeometry(tailC, 6, 0.024, 6, false), mat));
  }
  const torso = new THREE.Group(); torso.position.y = 0.04; hips.add(torso);
  blob(0.3 * bodyW, 0.3, 0.19 * bodyW, 0, 0.26, 0, mat, torso);
  parts.torso = new THREE.Object3D(); parts.torso.position.y = 0.26; torso.add(parts.torso);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.12, 6), mat); neck.position.y = 0.56; torso.add(neck);
  const headG = new THREE.Group(); headG.position.y = 0.62; torso.add(headG);
  const head = blob(0.275 * headS * jit, 0.3 * headS, 0.25 * headS, 0, 0.26, 0, mat, headG);
  parts.head = new THREE.Object3D(); parts.head.position.y = 0.26; headG.add(parts.head);
  const faceG = new THREE.Group(); faceG.position.y = 0.26; faceG.scale.setScalar(headS); headG.add(faceG);
  const fc = doodleFace(faceG, solid, { ez: 0.2 * headS + 0.06, smile: T.weapon === 'blade' });
  const hatG = new THREE.Group(); hatG.position.y = 0.26; hatG.scale.setScalar(headS); headG.add(hatG); buildHat(hatG, mat, solid, T);
  const shY = 0.46, shX = 0.26 * bodyW;
  const armL = noodle(0.3, limbR, mat, torso, -shX, shY, 0), armR = noodle(0.3, limbR, mat, torso, shX, shY, 0);
  const foreL = noodle(0.28, limbR * 0.92, mat, armL, 0, -0.3, 0), foreR = noodle(0.28, limbR * 0.92, mat, armR, 0, -0.3, 0);
  mitten(limbR * 2.3, mat, foreL, -0.3); mitten(limbR * 2.3, mat, foreR, -0.3);
  const legL = noodle(0.42, limbR * 1.15, mat, hips, -0.13 * bodyW, -0.02, 0), legR = noodle(0.42, limbR * 1.15, mat, hips, 0.13 * bodyW, -0.02, 0);
  const shinL = noodle(0.42, limbR * 1.05, mat, legL, 0, -0.42, 0), shinR = noodle(0.42, limbR * 1.05, mat, legR, 0, -0.42, 0);
  shoe(mat, shinL, -0.42, bodyW); shoe(mat, shinR, -0.42, bodyW);
  for (const [k, g] of [['armL', armL], ['armR', armR], ['foreL', foreL], ['foreR', foreR], ['legL', legL], ['legR', legR], ['shinL', shinL], ['shinR', shinR]]) parts[k] = g.userData.mid;
  const gun = new THREE.Group(); gun.position.set(0, -0.29, 0.07); foreR.add(gun); buildWeaponProp(gun, mat, solid, T);
  const tip = new THREE.Object3D(); tip.position.set(0, 0.05, T.weapon === 'blade' ? 0.92 : T.weapon === 'boss' ? 0.4 : 0.78); gun.add(tip);
  let shieldG = null;
  if (T.shield) {
    shieldG = new THREE.Group();
    if (T.isHeavyShield) {
      shieldG.position.set(-0.1, 0.3, 0.52); torso.add(shieldG);
      bx(1.35, 1.6, 0.12, 0, 0, 0, mat, shieldG);
      bx(1.15, 0.08, 0.16, 0, 0.35, 0.04, solid, shieldG);
      bx(1.15, 0.08, 0.16, 0, -0.35, 0.04, solid, shieldG);
      bx(0.08, 1.4, 0.16, 0, 0, 0.04, solid, shieldG);
      bx(0.55, 0.06, 0.16, 0, 0.52, 0, solid, shieldG);
      parts.shield = new THREE.Object3D(); shieldG.add(parts.shield);

      // Rear exposed power core (weakspot)
      const coreG = new THREE.Group(); coreG.position.set(0, 0.28, -0.32); torso.add(coreG);
      const coreMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.3, 8), makeInkMaterial({ ink: INK.BLUE, fill: true }));
      coreMesh.rotation.x = Math.PI / 2; coreG.add(coreMesh);
      bx(0.36, 0.4, 0.08, 0, 0, -0.06, solid, coreG);
      parts.core = new THREE.Object3D(); coreG.add(parts.core);
    } else {
      shieldG.position.set(-0.17, 0.34, 0.46); torso.add(shieldG);
      const plate = bx(0.92, 1.3, 0.07, 0, 0, 0, mat, shieldG);
      bx(0.62, 0.06, 0.09, 0, 0.26, 0.04, solid, shieldG); bx(0.06, 0.62, 0.09, 0, 0.26, 0.04, solid, shieldG);
      parts.shield = new THREE.Object3D(); shieldG.add(parts.shield);
    }
  }
  Object.assign(J, { hips, torso, headG, armL, armR, foreL, foreR, legL, legR, shinL, shinR, gun, shieldG });
  const hit = [['head', 0.3], ['torso', 0.33], ['hips', 0.2], ['armL', 0.11], ['armR', 0.11], ['foreL', 0.1], ['foreR', 0.1], ['legL', 0.13], ['legR', 0.13], ['shinL', 0.11], ['shinR', 0.11]];
  if (T.isHeavyShield) {
    hit.unshift(['shield', 0.85]);
    hit.push(['core', 0.28]);
  } else if (T.shield) {
    hit.unshift(['shield', 0.66]);
  }
  root.scale.setScalar(T.scale);
  return { root, parts, J, tip, face: fc, hit };
}
export function buildBomber(mat, solid, T, boss = false) {
  const root = new THREE.Group(); const parts = {}, J = {};
  const hips = new THREE.Group(); hips.position.y = 0.5; root.add(hips);
  const torso = new THREE.Group(); hips.add(torso);
  blob(0.44, 0.44, 0.44, 0, 0.32, 0, mat, torso);
  parts.torso = new THREE.Object3D(); parts.torso.position.y = 0.32; torso.add(parts.torso); parts.head = parts.torso;
  const headG = new THREE.Group(); headG.position.y = 0.32; torso.add(headG);
  const fc = doodleFace(headG, solid, { ex: 0.13, ey: 0.1, ez: 0.38, er: 0.06 });
  let spark = null;
  if (!boss) {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.14, 7), mat); cap.position.y = 0.76; torso.add(cap);
    const fuse = new THREE.Mesh(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(V3(0, 0.8, 0), V3(0.16, 1.0, 0), V3(0.24, 1.14, 0)), 5, 0.02, 5, false), solid); torso.add(fuse);
    spark = new THREE.Mesh(new THREE.SphereGeometry(0.075, 6, 5), makeInkMaterial({ ink: INK.ORANGE, fill: true })); spark.position.set(0.24, 1.14, 0); torso.add(spark);
  } else if (T.bossKind === 'inkblot') {
    for (let i = 0; i < 9; i++) { const a = (i / 9) * TAU; const sp = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.42, 5), mat); sp.position.set(Math.cos(a) * 0.42, 0.32 + Math.sin(a * 2.3) * 0.25, Math.sin(a) * 0.42); sp.lookAt(Math.cos(a) * 3, 0.32, Math.sin(a) * 3); sp.rotateX(Math.PI / 2); torso.add(sp); }
  } else {
    // a chunky rubber block on top: the eraser wears its own head
    bx(0.7, 0.32, 0.5, 0, 0.86, 0, mat, torso); bx(0.74, 0.05, 0.54, 0, 0.7, 0, solid, torso);
  }
  const armL = noodle(0.26, 0.03, mat, torso, -0.42, 0.42, 0), armR = noodle(0.26, 0.03, mat, torso, 0.42, 0.42, 0);
  mitten(0.07, mat, armL, -0.26); mitten(0.07, mat, armR, -0.26);
  const legL = noodle(0.26, 0.035, mat, hips, -0.16, -0.06, 0), legR = noodle(0.26, 0.035, mat, hips, 0.16, -0.06, 0);
  const shinL = noodle(0.24, 0.032, mat, legL, 0, -0.26, 0), shinR = noodle(0.24, 0.032, mat, legR, 0, -0.26, 0);
  shoe(mat, shinL, -0.24, 0.9); shoe(mat, shinR, -0.24, 0.9);
  Object.assign(J, { hips, torso, headG, armL, armR, foreL: armL, foreR: armR, legL, legR, shinL, shinR, gun: new THREE.Group(), spark });
  root.scale.setScalar(T.scale);
  const tip = spark || (() => { const o = new THREE.Object3D(); o.position.set(0, 0.5, 0.5); torso.add(o); return o; })();
  return { root, parts, J, tip, face: fc, hit: [['torso', 0.5]] };
}
export function buildFlyer(mat, solid, T) {
  const root = new THREE.Group(); const parts = {}, J = {};
  const body = new THREE.Group(); body.position.y = 0.6; root.add(body);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.32, 1.25, 3), mat); cone.rotation.x = Math.PI / 2; cone.position.z = 0.08; body.add(cone);
  parts.torso = new THREE.Object3D(); body.add(parts.torso); parts.head = parts.torso;
  const wl = bx(0.86, 0.025, 0.5, -0.48, 0.04, -0.14, mat, body), wr = bx(0.86, 0.025, 0.5, 0.48, 0.04, -0.14, mat, body);
  const headG = new THREE.Group(); headG.position.set(0, -0.06, 0.3); headG.scale.setScalar(0.72); body.add(headG);
  const fc = doodleFace(headG, solid, { ex: 0.11, ey: 0.02, ez: 0.16, er: 0.05 });
  const tail = bx(0.04, 0.28, 0.3, 0, 0.14, -0.62, mat, body);
  Object.assign(J, { body, wl, wr, headG, torso: body, gun: new THREE.Group() });
  root.scale.setScalar(T.scale);
  return { root, parts, J, tip: headG, face: fc, hit: [['torso', 0.48]] };
}

export class Projectiles {
  constructor(mgr) {
    this.mgr = mgr; this.list = []; this.max = 240; this.onFire = null;
    this.mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), makeInkMaterial({ ink: INK.RED, fill: true }), this.max);
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(this.max * 3), 3);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.mesh.frustumCulled = false; this.mesh.count = 0; mgr.ctx.scene.add(this.mesh);
  }
  fire(pos, dir, speed, dmg, owner, ink = INK.RED, thick = 0.045, blast = 0, id = null) {
    if (this.list.length >= this.max) this.list.shift();
    const p = { id: id ?? this.mgr.nextId++, pos: pos.clone(), prev: pos.clone(), vel: dir.clone().multiplyScalar(speed), dmg, owner, life: 4, deflected: false, ink, thick, origin: pos.clone(), blast };
    this.list.push(p);
    if (this.onFire && id === null) this.onFire(p);
    return p;
  }
  clear() { this.list.length = 0; this.mesh.count = 0; }
  deflectArc(origin, forward, range, cosHalf, player) {
    let n = 0;
    for (const p of this.list) { if (p.deflected) continue; _v.subVectors(p.pos, origin); const d = _v.length(); if (d > range) continue; if (d > 0.01 && _v.divideScalar(d).dot(forward) < cosHalf) continue; this._deflect(p, player, false); n++; }
    return n;
  }
  _deflect(p, player, perfect) {
    const mgr = this.mgr; p.deflected = true; p.ink = INK.BLUE; p.dmg *= perfect ? 3.5 : 2.2; p.life = 3;
    let target = null;
    if (perfect && p.owner && p.owner.alive) target = p.owner; else target = mgr.nearestVisible(player.eye, player.forward, Math.cos(0.7), 70) || (p.owner && p.owner.alive ? p.owner : null);
    const speed = p.vel.length() * 1.6; if (target) _d.subVectors(target.center, p.pos).normalize(); else _d.copy(player.forward);
    p.vel.copy(_d).multiplyScalar(speed); mgr.ctx.effects.sparks(p.pos, _d, INK.ORANGE, 10, 9); mgr.ctx.effects.strokeBurst(p.pos, INK.BLUE, 8, 4, { life: 0.2 });
  }
  _burst(p, point) { const ctx = this.mgr.ctx; ctx.effects.explosion(point, 2.5, INK.BLACK); audio.explosion(point); const P = ctx.player; const d = P.center.distanceTo(point); if (d < 3.5 && P.alive) { P.takeDamage(p.dmg * (1 - d / 3.5), point); P.knockback(_v.subVectors(P.center, point).normalize(), 6); } if (!this.mgr.mirror) this.mgr.blastEnemies(point, 3.5, p.dmg * 1.5, p.owner); }
  update(dt) {
    const mgr = this.mgr, ctx = mgr.ctx, world = ctx.world; const list = this.list; let n = 0;
    for (let i = 0; i < list.length; i++) {
      const p = list[i]; p.life -= dt; if (p.life <= 0) continue;
      p.prev.copy(p.pos); if (p.blast) p.vel.y -= 9 * dt; p.pos.addScaledVector(p.vel, dt);
      _d.subVectors(p.pos, p.prev); const len = _d.length(); if (len < 1e-6) { list[n++] = p; continue; } _d.divideScalar(len);
      const hw = world.raycast(p.prev, _d, len, SEE_THROUGH);
      if (hw) { if (p.blast) this._burst(p, hw.point); else { ctx.effects.bulletImpact(hw.point, hw.normal, p.ink); if (Math.random() < 0.5) audio.bulletImpact(hw.point); } continue; }
      if (!p.deflected) {
        // every peer runs the same projectile; only the local player takes damage from it here,
        // other players just make it disappear on this screen (their own client handles them)
        let consumed = false;
        for (const P of mgr.targets()) {
          if (!P.alive) continue;
          const catchR = Math.max(p.blast ? 0.9 : 0.5, P.isLocal ? P.blockRadius : 0);
          if (!this._segHitsPlayer(p.prev, p.pos, P, catchR)) continue;
          if (P.isLocal) {
            const def = P.tryDeflect(p);
            if (def) { if (def.ret) { this._deflect(p, P, def.perfect); list[n++] = p; } else { p.deflected = true; ctx.effects.strokeBurst(p.pos, INK.RED, 5, 6, { life: 0.18, size: 0.03 }); } consumed = true; break; }
            if (this._segHitsPlayer(p.prev, p.pos, P, p.blast ? 0.9 : 0.5)) { if (p.blast) this._burst(p, p.pos); else P.takeDamage(p.dmg, p.origin); consumed = true; break; }
          } else if (this._segHitsPlayer(p.prev, p.pos, P, p.blast ? 0.9 : 0.5)) { consumed = true; break; }
        }
        if (consumed) continue;
      } else {
        const he = mgr.raycast(p.prev, _d, len);
        if (he) { if (p.blast) this._burst(p, he.point); else mgr.damage(he.enemy, p.dmg, { point: he.point, dir: _d.clone(), part: he.part, source: 'deflect', crit: he.part === 'head' }); continue; }
      }
      list[n++] = p;
    }
    list.length = n;
    for (let i = 0; i < n; i++) {
      const p = list[i]; const sp = p.vel.length(); _v.copy(p.vel).divideScalar(sp); _q.setFromUnitVectors(_up, _v);
      _s.set(p.thick, p.blast ? p.thick : clamp(sp * 0.02, 0.35, 0.9), p.thick); _m.compose(p.pos, _q, _s); this.mesh.setMatrixAt(i, _m);
      const c = this.mesh.instanceColor.array; c[i * 3] = p.ink; c[i * 3 + 1] = 1; c[i * 3 + 2] = 0;
    }
    this.mesh.count = n; this.mesh.instanceMatrix.needsUpdate = true; this.mesh.instanceColor.needsUpdate = true;
  }
  _segHitsPlayer(a, b, P, r = 0.5) {
    const cy = P.center; _v.subVectors(b, a); const l2 = _v.lengthSq(); if (l2 < 1e-8) return false;
    for (const c of [cy, P.eye]) { const t = clamp(_v2.subVectors(c, a).dot(_v) / l2, 0, 1); _v3.copy(a).addScaledVector(_v, t); if (_v3.distanceToSquared(c) < r * r) return true; }
    _v3.copy(cy); _v3.y -= 0.55; const t = clamp(_v2.subVectors(_v3, a).dot(_v) / l2, 0, 1); _v2.copy(a).addScaledVector(_v, t); return _v2.distanceToSquared(_v3) < (r - 0.05) * (r - 0.05);
  }
}

