import * as THREE from 'three';
import { INK, makeInkMaterial } from './render.js';
import { rand, choose, clamp, approach, damp, TAU, angleLerp, wrapAngle } from './util.js';
import { TYPES, STATE_CODES, BOSSES } from './enemy-types.js';

const _v = new THREE.Vector3(), _v2 = new THREE.Vector3(), _d = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0), _eye = new THREE.Vector3(), _goal = new THREE.Vector3(), _aimV = new THREE.Vector3(), _q = new THREE.Quaternion();
import { makeBody, SEE_THROUGH } from './physics.js';
import { audio } from './audio.js';
import { EnemyBrain } from './enemy-brain.js';
import { buildHumanoid, buildWeaponProp, buildBomber, buildFlyer, Projectiles } from './enemy-rigging.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { thinkBoss, thinkFlyer, animateFlyer, combatSlide, findCover, retreatToCover } from './enemy-bosses.js';

export class EnemyManager {
  constructor(ctx) {
    this.ctx = ctx; this.enemies = []; this.alive = 0; this.projectiles = new Projectiles(this); this.onKill = null; this.onBoss = null; this._sepT = 0; this._slot = 0; this.mods = { speed: 1, damage: 1 };
    // mirror mode: this peer is a client; the host owns AI, physics and health, we only render
    this.mirror = false; this.nextId = 1; this.onClientHit = null; this.onSpawn = null; this.byId = new Map();
    this.brain = new EnemyBrain(this);
  }
  // Everyone an enemy may go after. Solo play is just the local player.
  targets() { return this.ctx.targets ? this.ctx.targets() : [this.ctx.player]; }
  _pickTarget(e, dt) {
    e.retargetT = (e.retargetT ?? 0) - dt;
    if (e.target && e.target.alive && e.retargetT > 0) return e.target;
    e.retargetT = 0.5; let best = null, bd = Infinity;
    for (const t of this.targets()) { if (!t.alive) continue; const d = t.body.pos.distanceToSquared(e.body.pos); if (d < bd) { bd = d; best = t; } }
    e.target = best; return best;
  }
  nearestTarget(pos) { let best = null, bd = Infinity; for (const t of this.targets()) { if (!t.alive) continue; const d = t.body.pos.distanceToSquared(pos); if (d < bd) { bd = d; best = t; } } return best; }
  clear() { for (const e of this.enemies) { this._removeLaser(e); if (!e.rootDetached) this.ctx.scene.remove(e.root); } this.enemies.length = 0; this.alive = 0; this.byId.clear(); this.projectiles.clear(); }
  spawn(type, pos, id = null) {
    const T = TYPES[type]; const ink = T.ink ?? INK.RED;
    const mat = makeInkMaterial({ ink, shadeScale: 0, shadeBias: 1 });
    const solid = makeInkMaterial({ ink: T.ink === INK.BLACK ? INK.RED : INK.BLACK, fill: true, side: THREE.DoubleSide });
    const model = T.model === 'bomber' ? buildBomber(mat, solid, T) : T.model === 'blob' ? buildBomber(mat, solid, T, true) : T.model === 'flyer' ? buildFlyer(mat, solid, T) : buildHumanoid(mat, solid, T);
    const hw = T.flying ? 0.45 : T.boss ? 0.7 : Math.min(0.33 * T.scale, 0.9);
    const bHeight = T.flying ? 0.8 : T.boss ? 3.4 : 1.85 * T.scale;
    const bStep = T.boss ? 1.35 : 0.6;
    const e = { type, T, mat, root: model.root, parts: model.parts, J: model.J, tip: model.tip, face: model.face, hit: model.hit, hp: T.hp, maxHp: T.hp, alive: true, state: 'spawn', t: 0,
      body: makeBody(pos, hw, bHeight, bStep), center: new THREE.Vector3(), yaw: rand(0, TAU), yawT: 0, phase: rand(0, TAU), walk: 0, aimAmt: 0, flinch: 0, flashT: 0, flashOn: false,
      path: null, pathI: 0, pathT: 0, pathGoal: null, losT: 0, los: false, cool: rand(0.6, 1.4), burstLeft: 0, burstT: 0, aimT: 0, attackT: 0, attackHit: false, stunDur: 0, stuckT: 0, strafeDir: Math.random() < 0.5 ? 1 : -1, strafeT: rand(1, 2), deadT: 0,
      appAng: (this._slot++) * 2.39996, appR: 0, appT: rand(0, 2), keepMul: rand(0.75, 1.35), backoffT: 0,
      hitSpheres: model.hit.map(() => new THREE.Vector3()), fuseT: -1, shieldHp: T.isHeavyShield ? 6 : (T.shield ? 2 : 0), flyState: 'orbit', flyT: rand(0, 3), orbitDir: Math.random() < 0.5 ? 1 : -1, bossAtk: null, rootDetached: false,
      justHit: false, coverPoint: null, coverT: 0, retreating: false, lastKnownPos: null, panicT: 0, hasPanicked: false, dodgeCooldown: 0, soundAlert: null, flankAngle: rand(-1, 1) < 0 ? -Math.PI / 2 : Math.PI / 2, coordReady: false };
    e.id = id ?? this.nextId++; this.byId.set(e.id, e);
    e.body.alwaysStep = true; if (T.flying) e.body.noSnap = true; e.root.position.copy(pos); e.root.scale.setScalar(0.001);
    this.ctx.scene.add(e.root); this.enemies.push(e); this.alive++;
    if (this.onSpawn && !this.mirror) this.onSpawn(e);
    this.ctx.effects.strokeBurst(pos.clone().add(_v.set(0, 1, 0)), T.ink ?? INK.RED, T.boss ? 60 : 26, T.boss ? 10 : 6, { life: 0.5, size: 0.03 }); audio.spawn(pos);
    if (T.boss) { audio.bossRoar(pos); if (this.onBoss) this.onBoss(e); }
    return e;
  }
  nearestVisible(from, forward, cosHalf, maxDist) {
    let best = null, bestD = maxDist;
    for (const e of this.enemies) { if (!e.alive) continue; _v.subVectors(e.center, from); const d = _v.length(); if (d > bestD || d < 0.01) continue; if (_v.divideScalar(d).dot(forward) < cosHalf) continue; if (!this.ctx.world.hasLineOfSight(from, e.center, SEE_THROUGH)) continue; best = e; bestD = d; }
    return best;
  }
  raycast(o, d, maxDist, ignore = null) {
    let best = null;
    for (const e of this.enemies) {
      if (!e.alive || e === ignore) continue;
      for (let i = 0; i < e.hit.length; i++) {
        const c = e.hitSpheres[i], r = e.hit[i][1] * e.T.scale;
        _v.subVectors(c, o); const tca = _v.dot(d); if (tca < 0 || tca > maxDist) continue;
        const d2 = _v.lengthSq() - tca * tca; if (d2 > r * r) continue;
        const t = tca - Math.sqrt(r * r - d2); if (t < 0) continue;
        if (!best || t < best.dist) best = { enemy: e, part: e.hit[i][0], dist: t, point: new THREE.Vector3(o.x + d.x * t, o.y + d.y * t, o.z + d.z * t) };
      }
    }
    return best;
  }
  inArc(pos, dir, range, cosHalf) {
    const out = [];
    for (const e of this.enemies) { if (!e.alive) continue; _v.subVectors(e.center, pos); const d = _v.length() - (e.T.boss ? 1.2 : 0); if (d > range + 0.3) continue; if (d > 0.3 && _v.normalize().dot(dir) < cosHalf) continue; out.push({ enemy: e, dist: d }); }
    return out.sort((a, b) => a.dist - b.dist);
  }
  blastEnemies(point, radius, dmg, except) {
    for (const e of this.enemies) { if (!e.alive || e === except) continue; const d = e.center.distanceTo(point); if (d > radius) continue; _d.subVectors(e.center, point).normalize(); this.damage(e, dmg * (1 - d / radius * 0.6), { point: e.center.clone(), dir: _d.clone(), part: 'torso', source: 'blast', crit: false }); }
  }
  yank(e, target) {
    if (!e.alive) return; if (e.T.boss) { e.flinch = 1; return; }
    e.state = 'stunned'; e.t = 0; e.stunDur = 1.3; e.path = null; e.flyState = 'stunned';
    _d.subVectors(target, e.body.pos); const dist = _d.length(); _d.divideScalar(Math.max(dist, 0.01));
    e.body.vel.copy(_d).multiplyScalar(clamp(dist * 1.6, 10, 26)); e.body.vel.y = clamp(dist * 0.5, 4, 9); e.body.onGround = false;
    this.ctx.effects.blood(e.center, _d, 0.4);
  }
  damage(e, amount, info) {
    if (!e.alive) return;
    if (this.mirror) {
      // show the hit right away, let the host decide what it did
      if (info.part !== 'shield') { e.flinch = 1; e.flashT = 0.07; if (!e.flashOn) { setFill(e.mat, true); e.flashOn = true; } this.ctx.effects.blood(info.point || e.center, info.dir || _up, clamp(0.5 + amount / 70, 0.5, 2.2), { ink: e.T.ink === INK.BLACK ? INK.BLACK : INK.RED }); this.ctx.hud.hitmarker(false, info.crit); }
      if (this.onClientHit) this.onClientHit(e, amount, info);
      return;
    }
    if (info.part === 'core') {
      amount *= 2.2;
      info.crit = true;
      this.ctx.effects.sparks(info.point || e.center, info.dir ? info.dir.clone().negate() : _up, INK.BLUE, 14, 12);
      if (this.ctx.game && this.ctx.game.addScore) this.ctx.game.addScore(50, 'CORE FLANK');
    }

    if (e.T.isHeavyShield && e.J.shieldG && info.part !== 'core') {
      // Check facing angle vs incoming attack
      const fwdX = Math.sin(e.yaw), fwdZ = Math.cos(e.yaw);
      let dotFront = 0;
      if (info.dir) {
        dotFront = (-info.dir.x * fwdX) + (-info.dir.z * fwdZ);
      }
      const isFrontal = info.part === 'shield' || dotFront > 0.15;
      if (isFrontal) {
        this.ctx.effects.sparks(info.point || e.center, info.dir ? info.dir.clone().negate() : _up, INK.ORANGE, 10, 10);
        audio.shieldHit(info.point || e.center);
        if (info.source === 'katana' || info.source === 'blast') {
          e.shieldHp--;
          e.flinch = 1;
          if (e.shieldHp <= 0) this._breakShield(e);
        }
        this.ctx.hud.hitmarker(false, false);
        return; // Zero damage taken from the front!
      }
    } else if (info.part === 'shield') {
      this.ctx.effects.sparks(info.point, info.dir ? info.dir.clone().negate() : _up, INK.ORANGE, 8, 8); audio.shieldHit(info.point);
      if (info.source === 'katana' || info.source === 'blast') { e.shieldHp--; if (e.shieldHp <= 0) this._breakShield(e); }
      this.ctx.hud.hitmarker(false, false); return;
    }
    amount *= this.mods.damage;
    e.hp -= amount; e.flinch = 1; e.flashT = 0.07; e.justHit = true; if (!e.flashOn) { setFill(e.mat, true); e.flashOn = true; }
    const dir = info.dir || _d.set(0, 1, 0); const amt = clamp(0.5 + amount / 70, 0.5, 2.2) * (e.T.boss ? 1.6 : 1);
    this.ctx.effects.blood(info.point || e.center, dir, amt, { ink: e.T.ink === INK.BLACK ? INK.BLACK : INK.RED });
    if (info.crit) audio.headshot(e.center); else audio.hitEnemy(e.center);
    this.ctx.hud.hitmarker(e.hp <= 0, info.crit);
    if (info.source !== 'deflect') this.ctx.input.rumble(0.1, 0.3, 30);
    if (e.state === 'spawn') { e.state = 'hunt'; e.root.scale.setScalar(e.T.scale); }
    if (e.T.boss && this.onBoss) this.onBoss(e);
    if (e.hp <= 0) { this.ctx.game.hitstop(info.crit ? 0.05 : 0.025, 0.25); this.kill(e, info); }
  }
  _breakShield(e) {
    const g = e.J.shieldG; if (!g || !g.parent) return; g.updateWorldMatrix(true, false); this.ctx.scene.attach(g);
    this.ctx.effects.debris(g, g.position, new THREE.Vector3(rand(-3, 3), 4, rand(-3, 3)), new THREE.Vector3(rand(-6, 6), rand(-6, 6), rand(-6, 6)), { radius: 0.4, blood: false, life: 8 });
    e.hit = e.hit.filter((h) => h[0] !== 'shield'); e.hitSpheres = e.hit.map(() => new THREE.Vector3()); e.J.shieldG = null; audio.shieldHit(e.center); this.ctx.game.addScore(40, 'SHIELD BROKEN');
  }
  kill(e, info) {
    e.alive = false; e.state = 'dead'; e.deadT = 0; this.alive--; e.body.vel.set(0, 0, 0); this._removeLaser(e);
    const eff = this.ctx.effects, scene = this.ctx.scene; const inkC = e.T.ink === INK.BLACK ? INK.BLACK : INK.RED;
    if (e.face) { e.face.eyes.visible = false; e.face.xeyes.visible = true; }
    const dir = (info.dir || _d.set(0, 0.5, 0)).clone().normalize();
    if (e.T.weapon === 'bomb') { this._explodeBomber(e, 0.8); if (this.onKill) this.onKill(e, info, true); return; }
    audio.enemyDie(e.center);
    if (e.T.flying) {
      e.root.updateWorldMatrix(true, false); scene.attach(e.root); e.rootDetached = true;
      eff.debris(e.root, e.root.position, dir.clone().multiplyScalar(4).add(_v.set(rand(-2, 2), 1, rand(-2, 2))), new THREE.Vector3(rand(-9, 9), rand(-9, 9), rand(-9, 9)), { radius: 0.5, blood: true, life: 8 });
      eff.blood(e.center, dir, 1); if (this.onKill) this.onKill(e, info, true); return;
    }
    const over = -e.hp > e.maxHp * 0.35 || info.source === 'katana' || info.crit || info.source === 'deflect' || info.source === 'blast';
    const detach = (obj, extraVel, radius) => { if (!obj || !obj.parent) return; obj.updateWorldMatrix(true, false); scene.attach(obj); _v.copy(dir).multiplyScalar(rand(3, 7)).add(extraVel); _v.y += rand(2, 5); eff.debris(obj, obj.position, _v, new THREE.Vector3(rand(-8, 8), rand(-8, 8), rand(-8, 8)), { radius, blood: true, life: rand(7, 10) }); };
    if (over) {
      audio.gib(e.center); const J = e.J;
      if (info.crit || ((info.source === 'katana' || info.source === 'focus') && Math.random() < 0.35)) { detach(J.headG, _v2.set(rand(-2, 2), 3, rand(-2, 2)), 0.25); eff.fountain((e.parts.torso || e.root).getWorldPosition(new THREE.Vector3()).add(_v2.set(0, 0.35, 0)), _up, 0.9, inkC); }
      if (info.source === 'katana' || info.source === 'focus') {
        const r = Math.random();
        if (r < 0.4) detach(J.armR, _v2.set(rand(-3, 3), 2, rand(-3, 3)), 0.12); else if (r < 0.7) detach(J.armL, _v2.set(rand(-3, 3), 2, rand(-3, 3)), 0.12);
        else { detach(J.torso, _v2.set(rand(-2, 2), 2, rand(-2, 2)), 0.3); eff.fountain((e.parts.hips || e.parts.torso || e.root).getWorldPosition(new THREE.Vector3()), _up, 0.7, inkC); }
      } else if (info.source === 'deflect' || info.source === 'blast' || -e.hp > e.maxHp * 0.6) {
        const limbs = [J.armL, J.armR, J.legL, J.legR, J.torso]; const k = e.T.boss ? 5 : randInt(1, 2);
        for (let i = 0; i < k && limbs.length; i++) { const o = limbs.splice(randInt(0, limbs.length - 1), 1)[0]; detach(o, _v2.set(rand(-3, 3), 2, rand(-3, 3)), 0.15); }
      }
    }
    e.topple = { axis: Math.random() < 0.5 ? 'x' : 'z', sign: dir.z > 0 || Math.random() < 0.5 ? 1 : -1, t: 0 };
    eff.bloodPool(e.body.pos, rand(1.1, 1.8) * (e.T.boss ? 2.5 : 1), inkC); eff.blood(e.center, dir, 1.2, { ink: inkC });
    if (Math.random() < 0.6 && e.J.gun && e.J.gun.parent) detach(e.J.gun, _v2.set(rand(-2, 2), 2, rand(-2, 2)), 0.08);
    if (e.J.shieldG) this._breakShield(e);
    if (e.T.boss) { eff.explosion(e.center, 6, INK.BLACK); audio.explosion(e.center); if (this.onBoss) this.onBoss(e); }
    if (this.onKill) this.onKill(e, info, over);
  }
  _explodeBomber(e, scale = 1) {
    const T = e.T; const c = e.center.clone(); this.ctx.effects.explosion(c, T.blast * scale, INK.BLACK); audio.explosion(c);
    for (const P of this.targets()) { const d = P.center.distanceTo(c); if (P.alive && d < T.blast * scale) { P.takeDamage(T.dmg * this.mods.damage * Math.sqrt(1 - d / (T.blast * scale)), c); P.knockback(_v.subVectors(P.center, c).normalize(), 7); } }
    this.blastEnemies(c, T.blast * scale, 70, e);
    if (e.alive) { e.alive = false; e.state = 'dead'; this.alive--; if (this.onKill) this.onKill(e, { source: 'blast', dir: _up.clone() }, true); }
    this.ctx.scene.remove(e.root); e.rootDetached = true; e.deadT = 99;
  }
  eye(e, out) { return out.setFromMatrixPosition(e.parts.head.matrixWorld); }
  update(dt) {
    if (this.mirror) { this._updateMirror(dt); return; }
    if (this.ctx.player && this.brain) this.brain.updateProfile(this.ctx.player, dt);
    const ctx = this.ctx, world = ctx.world;
    for (const e of this.enemies) {
      e.t += dt;
      if (!e.alive) { this._updateDead(e, dt); continue; }
      const P = this._pickTarget(e, dt) || ctx.player; const pp = P.body.pos, pc = P.center;
      if (e.flashT > 0) { e.flashT -= dt; if (e.flashT <= 0 && e.flashOn) { setFill(e.mat, false); e.flashOn = false; } }
      e.flinch = damp(e.flinch, 0, 9, dt);
      if (e.state === 'spawn') {
        const f = clamp(e.t / 0.6, 0, 1); e.root.scale.setScalar(Math.max(0.001, f * e.T.scale * (1 + Math.sin(e.t * 60) * 0.12 * (1 - f))));
        e.root.position.copy(e.body.pos); e.root.rotation.y = e.yaw; this._syncHit(e);
        if (e.t >= 0.6) { e.state = 'hunt'; e.root.scale.setScalar(e.T.scale); }
        continue;
      }
      if (e.state === 'stunned' && e.laser) this._hideLaser(e);
      if (e.T.flying) { this._thinkFlyer(e, dt, pc, P); world.moveBody(e.body, dt); }
      else {
        if (e.state === 'stunned') { if (e.t > e.stunDur) e.state = 'hunt'; }
        else if (P.alive) this._think(e, dt, pp, pc, P); else this._wander(e, dt);
        e.body.vel.y -= 24 * dt; world.moveBody(e.body, dt);
      }
      if (e.body.pos.y < -6) { this.kill(e, { source: 'fall', dir: _up.clone() }); continue; }
      e.yaw = angleLerp(e.yaw, e.yawT, 1 - Math.exp(-10 * dt));
      e.root.position.copy(e.body.pos); e.root.rotation.y = e.yaw;
      // never let a body occupy the same space as the player
      if (!e.T.flying) {
        const pr = 0.36 + e.body.halfW + 0.12;
        const ox = e.body.pos.x - pp.x, oz = e.body.pos.z - pp.z; const o2 = ox * ox + oz * oz;
        if (o2 < pr * pr && Math.abs(e.body.pos.y - pp.y) < 1.7) {
          const od = Math.sqrt(o2) || 0.0001; const push = pr - od;
          e.body.pos.x += ox / od * push; e.body.pos.z += oz / od * push;
          if (world.overlapsBody(e.body)) { e.body.pos.x -= ox / od * push; e.body.pos.z -= oz / od * push; }
        }
      }
      if (e.T.flying) this._animateFlyer(e, dt); else this._animate(e, dt, pc);
      this._syncHit(e);
    }
    this._separate(dt); this.projectiles.update(dt);
    for (let i = this.enemies.length - 1; i >= 0; i--) { const e = this.enemies[i]; if (!e.alive && e.deadT > 9) { this._removeLaser(e); if (!e.rootDetached) this.ctx.scene.remove(e.root); this.enemies.splice(i, 1); } }
  }
  // --- network mirror ---
  // Compact per-enemy state the host sends every few frames; clients ease toward it.
  snapshot() {
    const out = [];
    for (const e of this.enemies) { if (!e.alive) continue; const b = e.body; out.push([e.id, +b.pos.x.toFixed(2), +b.pos.y.toFixed(2), +b.pos.z.toFixed(2), +e.yaw.toFixed(2), STATE_CODES[e.state] ?? 1, Math.round(e.hp), +e.aimAmt.toFixed(2), +e.attackT.toFixed(2), e.fuseT >= 0 ? 1 : 0, e.bossAtk ? 1 : 0]); }
    return out;
  }
  applySnapshot(arr, now) {
    for (const r of arr) {
      const e = this.byId.get(r[0]); if (!e || !e.alive) continue;
      e.snapA = e.snapB || { p: e.body.pos.clone(), yaw: e.yaw, t: now - 0.08 }; e.snapB = { p: new THREE.Vector3(r[1], r[2], r[3]), yaw: r[4], t: now };
      const st = STATE_NAMES[r[5]] || 'hunt'; if (e.state === 'spawn' && st !== 'spawn') { e.state = st; e.root.scale.setScalar(e.T.scale); } else if (e.state !== 'spawn') e.state = st;
      e.hp = r[6]; e.aimAmt = r[7]; e.attackT = r[8]; e.fuseT = r[9] ? 0.5 : -1; e.bossAtk = r[10] ? (e.bossAtk || { kind: 'stomp', t: 0.3 }) : null;
      if (e.T.boss && this.onBoss) this.onBoss(e);
    }
  }
  _updateMirror(dt) {
    const now = performance.now() / 1000, P = this.ctx.player;
    for (const e of this.enemies) {
      e.t += dt;
      if (!e.alive) { this._updateDead(e, dt); continue; }
      if (e.flashT > 0) { e.flashT -= dt; if (e.flashT <= 0 && e.flashOn) { setFill(e.mat, false); e.flashOn = false; } }
      e.flinch = damp(e.flinch, 0, 9, dt);
      if (e.state === 'spawn') { const f = clamp(e.t / 0.6, 0, 1); e.root.scale.setScalar(Math.max(0.001, f * e.T.scale * (1 + Math.sin(e.t * 60) * 0.12 * (1 - f)))); if (e.t >= 0.6) { e.state = 'hunt'; e.root.scale.setScalar(e.T.scale); } }
      if (e.snapA && e.snapB) {
        // render 100 ms behind the newest snapshot so movement stays smooth between packets
        const span = Math.max(0.02, e.snapB.t - e.snapA.t); const k = clamp((now - 0.1 - e.snapA.t) / span, 0, 1.2);
        _v.lerpVectors(e.snapA.p, e.snapB.p, k);
        e.body.vel.subVectors(_v, e.body.pos).divideScalar(Math.max(dt, 1e-3)).clampLength(0, 30);
        e.body.pos.copy(_v); e.body.onGround = Math.abs(e.body.vel.y) < 0.5;
        e.yaw = angleLerp(e.snapA.yaw, e.snapB.yaw, k);
      }
      e.root.position.copy(e.body.pos); e.root.rotation.y = e.yaw;
      if (e.T.flying) this._animateFlyer(e, dt); else this._animate(e, dt, P.center);
      if (e.T.weapon === 'sniper' && e.laser) e.laser.visible = e.aimAmt > 0.9;
      this._syncHit(e);
    }
    this.projectiles.update(dt);
    for (let i = this.enemies.length - 1; i >= 0; i--) { const e = this.enemies[i]; if (!e.alive && e.deadT > 9) { this._removeLaser(e); if (!e.rootDetached) this.ctx.scene.remove(e.root); this.byId.delete(e.id); this.enemies.splice(i, 1); } }
  }
  // the host tells us someone died; run the gore without touching scores
  killMirror(id, info) { const e = this.byId.get(id); if (!e || !e.alive) return; const cb = this.onKill; this.onKill = null; this.kill(e, { ...info, dir: info.dir ? new THREE.Vector3().fromArray(info.dir) : _up.clone(), point: info.point ? new THREE.Vector3().fromArray(info.point) : e.center.clone() }); this.onKill = cb; }
  _syncHit(e) { e.root.updateMatrixWorld(true); for (let i = 0; i < e.hit.length; i++) e.hitSpheres[i].setFromMatrixPosition(e.parts[e.hit[i][0]].matrixWorld); e.center.setFromMatrixPosition(e.parts.torso.matrixWorld); }
  _updateDead(e, dt) {
    e.deadT += dt; const tp = e.topple; if (!tp || e.rootDetached) return;
    if (tp.t < 1) { tp.t = Math.min(1, tp.t + dt * 2.2); const a = tp.sign * (Math.PI / 2) * (1 - Math.pow(1 - tp.t, 2)); if (tp.axis === 'x') e.J.hips.parent.rotation.x = a; else e.J.hips.parent.rotation.z = a; }
    if (e.deadT > 8.3) e.root.scale.setScalar(Math.max(0.001, (9 - e.deadT) / 0.7 * e.T.scale));
    e.root.rotation.y = e.yaw;
  }
  _separate(dt) {
    this._sepT -= dt; if (this._sepT > 0) return; this._sepT = 0.05; const es = this.enemies;
    for (let i = 0; i < es.length; i++) { const a = es[i]; if (!a.alive || a.T.flying) continue;
      for (let j = i + 1; j < es.length; j++) { const b = es[j]; if (!b.alive || b.T.flying) continue;
        const dx = b.body.pos.x - a.body.pos.x, dz = b.body.pos.z - a.body.pos.z; const d2 = dx * dx + dz * dz; const rr = a.body.halfW + b.body.halfW + 0.75; if (d2 > rr * rr || d2 < 1e-6 || Math.abs(b.body.pos.y - a.body.pos.y) > 1.5) continue;
        const d = Math.sqrt(d2); const push = (rr - d) * 9; a.body.vel.x -= dx / d * push; a.body.vel.z -= dz / d * push; b.body.vel.x += dx / d * push; b.body.vel.z += dz / d * push; } }
  }
  _steer(e, dt, gx, gz, speed, accel) {
    const b = e.body; let dx = gx - b.pos.x, dz = gz - b.pos.z; const l = Math.hypot(dx, dz);
    if (l < 1e-4) { b.vel.x = damp(b.vel.x, 0, 8, dt); b.vel.z = damp(b.vel.z, 0, 8, dt); return; }
    dx /= l; dz /= l; const a = (b.onGround ? accel : accel * 0.3) * dt; speed *= this.mods.speed;
    b.vel.x += clamp(dx * speed - b.vel.x, -a, a); b.vel.z += clamp(dz * speed - b.vel.z, -a, a); e.yawT = Math.atan2(dx, dz);
  }
  _groundAhead(e, dx, dz) {
    const diff = typeof window !== 'undefined' ? (window.currentDifficulty ?? 2) : 2;
    const waveMult = typeof game !== 'undefined' ? game.wave : 1;
    if (diff === 0 && Math.random() < Math.min(0.2 * waveMult, 0.8)) return true; // 20% chance * wave to ignore holes
    _v.set(e.body.pos.x + dx * 0.9, e.body.pos.y + 0.5, e.body.pos.z + dz * 0.9);
    return this.ctx.world.raycast(_v, _d.set(0, -1, 0), 3.5) !== null;
  }
  // Each enemy heads for its own slot around the player rather than the player's exact feet,
  // so a group fans out and arrives from different sides instead of forming one conga line.
  _approachPoint(e, dt, target, out) {
    e.appT -= dt;
    if (e.appT <= 0) {
      e.appT = rand(2.5, 5); e.appAng += rand(-0.7, 0.7);   // drift, keep the slot
      const melee = e.T.weapon === 'blade' || e.T.weapon === 'bomb';
      e.appR = melee ? rand(2, 4.5) : rand(4.5, 9);
    }
    const d = Math.hypot(target.x - e.body.pos.x, target.z - e.body.pos.z);
    // hold a minimum standoff so they close in on their own side instead of stacking on one point
    let r = clamp(d * 0.55, Math.min(2, d * 0.9), e.appR);
    // while climbing to a different level the route is often a narrow ramp, and a wide offset
    // walks them straight off the side of it, so aim much closer to the actual target
    if (Math.abs(target.y - e.body.pos.y) > 1.5) r = Math.min(r, 1.1);
    return out.set(target.x + Math.cos(e.appAng) * r, target.y, target.z + Math.sin(e.appAng) * r);
  }
  _follow(e, dt, target, speed) {
    const nav = this.ctx.nav, b = e.body; e.pathT -= dt;
    target = this._approachPoint(e, dt, target, _goal);
    const stale = !e.path || e.pathI >= e.path.length || (e.pathT <= 0 && (!e.pathGoal || e.pathGoal.distanceTo(target) > 3.5 || !e.path.complete));
    if (stale && (e.pathT <= 0 || !e.path)) {
      e.pathT = 0.8 + rand(0, 0.6); const p = nav ? nav.findPath(b.pos, target) : null;
      if (p && p.length) { e.path = p; e.pathI = 0; e.pathGoal = target.clone(); while (e.pathI < p.length - 1 && Math.hypot(p[e.pathI].x - b.pos.x, p[e.pathI].z - b.pos.z) < 0.7 && Math.abs(p[e.pathI].y - b.pos.y) < 1) e.pathI++; }
    }
    let goal = null;
    if (e.path && e.pathI < e.path.length) { const nd = e.path[e.pathI]; const hd = Math.hypot(nd.x - b.pos.x, nd.z - b.pos.z); if (hd < 0.5 && Math.abs(nd.y - b.pos.y) < 1.2) { e.pathI++; if (e.pathI < e.path.length) goal = e.path[e.pathI]; } else goal = nd; }
    if (!goal) goal = target;
    this._steer(e, dt, goal.x, goal.z, speed, 40);
    const hd = Math.hypot(goal.x - b.pos.x, goal.z - b.pos.z);
    if (b.onGround) {
      if (goal.y > b.pos.y + 0.5 && hd < 2.2) {
        const jumpH = goal.y - b.pos.y;
        b.vel.y = Math.min(8.8, 5.8 + jumpH * 1.5);
        b.onGround = false;
      }
      else if (b.hitWall) { e.stuckT += dt; if (e.stuckT > 0.35 && e.stuckT < 0.4) e.pathT = 0; if (e.stuckT > 0.9) { b.vel.y = 5.2; b.onGround = false; e.stuckT = 0; e.pathT = 0; } }
      else e.stuckT = 0;
    }
  }
  _wander(e, dt) { e.body.vel.x = damp(e.body.vel.x, 0, 6, dt); e.body.vel.z = damp(e.body.vel.z, 0, 6, dt); e.aimAmt = damp(e.aimAmt, 0, 5, dt); }
  _findCover(e, pp, pc) { return findCover(this, e, pp, pc); }
  _combatSlide(e, dx, dz, dist, diff) { return combatSlide(this, e, dx, dz, dist, diff); }
  _retreatToCover(e, dt, pp) { return retreatToCover(this, e, dt, pp); }

  _think(e, dt, pp, pc, P) {
    const T = e.T, b = e.body, ctx = this.ctx;
    const diff = typeof window !== 'undefined' ? (window.currentDifficulty ?? 2) : 2;
    const waveMult = typeof game !== 'undefined' ? game.wave : 1;
    const role = T.role;

    if (e.los && role !== 'aerial') e.lastKnownPos = pp.clone();

    if (diff === 0 && e.los && !e.hasPanicked && role !== 'kamikaze' && role !== 'aerial' && !T.boss) { e.panicT = rand(1.0, 2.0); e.hasPanicked = true; }
    if (e.panicT > 0) { e.panicT -= dt; this._wander(e, dt); e.justHit = false; return; }

    const dxReal = pp.x - b.pos.x, dzReal = pp.z - b.pos.z;
    const distReal = Math.hypot(dxReal, dzReal);

    let brainMods = { keepMulBias: 1, strafeDirOverride: null, dodgeChanceMul: 1, suppress: false, interceptor: false, doctrine: 'NEUTRAL' };
    if (this.brain) brainMods = this.brain.consult(e, distReal, e.los);
    
    if (brainMods.interceptor && this.brain && this.brain.profile.spatialMemory) {
        let maxIdx = -1, maxVal = 0;
        for (let i = 0; i < 64; i++) {
           if (this.brain.profile.spatialMemory.grid[i] > maxVal) { maxVal = this.brain.profile.spatialMemory.grid[i]; maxIdx = i; }
        }
        if (maxIdx >= 0) {
            let dest = new THREE.Vector3((maxIdx % 8) * 15 - 60 + 7.5, pp.y, Math.floor(maxIdx / 8) * 15 - 60 + 7.5);
            if (e.center.distanceTo(dest) > 5) { this._follow(e, dt, dest, T.speed * 1.2); return; }
        }
    }

    // Detect if player is aiming crosshair directly at this enemy
    let playerAimingAtMe = false;
    if (P && P.camera && e.los && distReal < 35) {
      P.camera.getWorldDirection(_aimV);
      _d.subVectors(e.center, P.eye).normalize();
      if (_aimV.dot(_d) > 0.985) playerAimingAtMe = true;
    }

    // Tactical combat slide: Trigger on damage impact or when locked into player's crosshair
    if (T.canDodge && b.onGround && e.dodgeCooldown <= 0) {
      if (e.justHit && diff >= 2) {
        this._combatSlide(e, dxReal, dzReal, distReal, diff);
      } else if (playerAimingAtMe && diff >= 3 && Math.random() < (diff === 4 ? 0.95 : 0.6) * brainMods.dodgeChanceMul * dt * 10) {
        this._combatSlide(e, dxReal, dzReal, distReal, diff);
      }
    }
    e.justHit = false;
    if (e.dodgeCooldown > 0) e.dodgeCooldown -= dt;

    // Grenade evasion (Extreme+ only, not for berserkers/kamikazes)
    if (diff >= 3 && !T.berserker && role !== 'kamikaze' && P.nades && P.nades.length) {
      let evading = false;
      for (const nade of P.nades) {
        if (nade.fuse > 0) { // live grenade
          const gd = Math.hypot(nade.pos.x - b.pos.x, nade.pos.z - b.pos.z);
          if (gd < 6 && Math.abs(nade.pos.y - b.pos.y) < 3.5) {
            const nx = (b.pos.x - nade.pos.x) / (gd || 1);
            const nz = (b.pos.z - nade.pos.z) / (gd || 1);
            this._steer(e, dt, b.pos.x + nx * 8, b.pos.z + nz * 8, T.speed * 1.5, 50);
            e.aimAmt = damp(e.aimAmt, 0, 8, dt);
            evading = true;
            break;
          }
        }
      }
      if (evading) return;
    }

    // Tactical Cover System:
    // 1. Critical health retreat to break line of sight
    const canCover = T.canCover && brainMods.doctrine !== 'FLUSH_CAMPER';
    if (diff >= 2 && e.hp / e.maxHp < (diff >= 4 ? 0.22 : 0.4) && canCover && !T.berserker) {
      if (!e.coverPoint && !e.retreating) {
        e.retreating = true;
        e.coverPoint = this._findCover(e, pp, pc);
        if (e.coverPoint) e.coverT = rand(2.0, 3.5);
      }
    }
    // 2. Tactical reload cover (Hard mode only, NOT God mode! God mode enemies relentlessly suppress)
    else if (diff === 3 && T.role === 'ranged' && T.canCover && e.cool > 0.8 && !e.coverPoint && e.los && distReal > 14) {
      e.coverPoint = this._findCover(e, pp, pc);
      if (e.coverPoint) e.coverT = Math.min(e.cool, 1.8);
    }

    if (e.coverPoint) {
      this._retreatToCover(e, dt, pp);
      return;
    }

    // Predictive aim scales by wave on Hard+ (2+)
    let targetX = pp.x, targetZ = pp.z;
    if (diff >= 2 && P.body && P.body.vel) {
      const predForce = diff >= 3 ? 0.25 * waveMult : 0.05 * waveMult;
      targetX += P.body.vel.x * clamp(predForce, 0, 1.4); targetZ += P.body.vel.z * clamp(predForce, 0, 1.4);
    }
    const dx = targetX - b.pos.x, dz = targetZ - b.pos.z; const dist = Math.hypot(dx, dz); const dy = pp.y - b.pos.y;
    e.losT -= dt; if (e.losT <= 0) { 
      let baseDelay = diff === 4 ? 0.02 : diff === 3 ? 0.08 : diff === 2 ? 0.12 : diff === 1 ? 0.18 : 0.35;
      if (diff >= 2) baseDelay = Math.max(0.015, baseDelay - (0.01 * waveMult));
      e.losT = baseDelay + rand(0, diff === 4 ? 0.02 : 0.08); e.los = ctx.world.hasLineOfSight(this.eye(e, _eye), pc, SEE_THROUGH); 
    }

    let coolMod = 1.0;
    if (diff >= 2) coolMod = Math.min(2.5, 1.0 + (0.05 * waveMult));
    else if (diff === 0) coolMod = Math.max(0.2, 0.8 - (0.05 * waveMult));
    e.cool -= dt * coolMod;
    const yawTo = Math.atan2(dx, dz);
    if (T.weapon === 'bomb') {
      if (e.fuseT >= 0) { e.fuseT -= dt; b.vel.x = damp(b.vel.x, 0, 4, dt); b.vel.z = damp(b.vel.z, 0, 4, dt); e.yawT = yawTo; e.flashT = 0.02; if (!e.flashOn) { setFill(e.mat, true); e.flashOn = true; } if (Math.floor(e.fuseT * 8) !== Math.floor((e.fuseT + dt) * 8)) audio.fuse(e.center); if (e.fuseT <= 0) this._explodeBomber(e); return; }
      if (dist < T.fuseRange && Math.abs(dy) < 2.2 && e.los) { e.fuseT = T.fuse; audio.fuse(e.center); return; }
      if (e.los && dist < 12 && Math.abs(dy) < 1.5) this._steer(e, dt, pp.x, pp.z, T.speed, 45); else this._follow(e, dt, pp, T.speed);
      return;
    }
    if (T.weapon === 'blade') {
      e.aimAmt = damp(e.aimAmt, 0, 8, dt);
      // back off after a swing instead of walking into the player
      if (e.backoffT > 0) {
        e.backoffT -= dt; e.yawT = yawTo;
        const a = 26 * dt;
        b.vel.x += clamp(-nxOf(dx, dist) * T.speed * 0.55 - b.vel.x, -a, a);
        b.vel.z += clamp(-nzOf(dz, dist) * T.speed * 0.55 - b.vel.z, -a, a);
        return;
      }
      if (e.attackT > 0) {
        e.attackT -= dt; b.vel.x = damp(b.vel.x, 0, 8, dt); b.vel.z = damp(b.vel.z, 0, 8, dt); e.yawT = yawTo;
        if (e.attackT < 0.18 && !e.attackHit) {
          e.attackHit = true;
          _v3.setFromMatrixPosition(e.tip.matrixWorld);
          for (let i = 0; i < 5; i++) {
            const a0 = -0.9 + i * 0.45, a1 = a0 + 0.45;
            _v.set(e.center.x + Math.sin(e.yaw + a0) * 1.5, e.center.y + 0.5 - i * 0.18, e.center.z + Math.cos(e.yaw + a0) * 1.5);
            _v2.set(e.center.x + Math.sin(e.yaw + a1) * 1.5, e.center.y + 0.5 - (i + 1) * 0.18, e.center.z + Math.cos(e.yaw + a1) * 1.5);
            ctx.effects.tracer(_v, _v2, INK.RED, 0.025, 0.16);
          }
          if (dist < T.reach && Math.abs(dy) < 1.7) {
            if (P.tryBlockMelee(e)) { e.state = 'stunned'; e.t = 0; e.stunDur = 1.1; b.vel.set(-dx / dist * 7, 3.5, -dz / dist * 7); }
            else P.takeDamage(T.dmg * this.mods.damage, e.center);
          } else audio.katanaSwing();
          e.cool = rand(T.cool[0], T.cool[1]); e.backoffT = diff === 4 ? 0.15 : rand(0.45, 0.75);
        }
        return;
      }
      if (dist < T.lunge && Math.abs(dy) < 1.7 && e.cool <= 0 && e.los) {
        e.attackT = 0.55; e.attackHit = false; audio.lunge(e.center);
        b.vel.x += (dx / dist) * (diff === 4 ? 4.5 : 2.5); b.vel.z += (dz / dist) * (diff === 4 ? 4.5 : 2.5);
        return;
      }
      if (e.los && dist < 9 && Math.abs(dy) < 1.6) {
        if (dist < T.standoff && Math.abs(dy) < 1.2) {
          const a = 24 * dt;
          b.vel.x += clamp(-(dx / dist) * T.speed * 0.4 - b.vel.x, -a, a);
          b.vel.z += clamp(-(dz / dist) * T.speed * 0.4 - b.vel.z, -a, a);
          e.yawT = yawTo;
        } else {
          const g = dist > 4.5 ? this._approachPoint(e, dt, pp, _goal) : pp;
          this._steer(e, dt, g.x, g.z, T.speed * (diff === 4 ? 1.2 : 1.0), 45);
          if (b.onGround && b.hitWall) { e.stuckT += dt; if (e.stuckT > 0.8) { b.vel.y = 4.8; e.stuckT = 0; } }
        }
      } else this._follow(e, dt, pp, T.speed * (diff === 4 ? 1.2 : 1.0));
      return;
    }
    if (T.weapon === 'boss') { this._thinkBoss(e, dt, pp, pc, dist, dy, yawTo, P); return; }
    if (T.weapon === 'sniper') {
      if (dist < 14.0 || e.retreating) {
        if (!e.retreating) {
          e.retreating = true;
          e.retreatT = rand(2.2, 3.4);
          this._hideLaser(e);
          e.aimT = 0;
          e.aimWarned = false;
          e.aimPoint = null;
          ctx.effects.strokeBurst(e.center, INK.BLACK, 18, 5, { life: 0.45, size: 0.05 });
          audio.lunge(e.center);
          const perch = ctx.nav ? ctx.nav.findSniperPerch(b.pos, pp, 20, 70) : null;
          e.coverPoint = perch || (ctx.nav ? ctx.nav.findCoverNode(b.pos, pp, 24) : null);
          if (!e.coverPoint) {
            e.coverPoint = new THREE.Vector3(b.pos.x - (dx / dist) * 18, b.pos.y, b.pos.z - (dz / dist) * 18);
          }
          if (b.onGround) this._combatSlide(e, -dx, -dz, dist, diff);
        }
        e.retreatT -= dt;
        if (e.coverPoint) this._follow(e, dt, e.coverPoint, T.speed * 1.35);
        if (e.retreatT <= 0 || dist > 26) {
          e.retreating = false;
          e.coverPoint = null;
        }
        e.yawT = yawTo;
        return;
      }
    }
    const inRange = e.los && dist < T.range;
    if (inRange) {
      e.aimAmt = damp(e.aimAmt, 1, diff === 4 ? 18 : 8, dt); e.yawT = yawTo;
      let mx = 0, mz = 0; const nx = dx / dist, nz = dz / dist;
      if (T.stationary) { mx = 0; mz = 0; }
      else if (dist > T.stop * e.keepMul * brainMods.keepMulBias) { 
        if (brainMods.doctrine === 'RANGE_ENVELOPE_LOCK' && dist > 18) {
             if (!e.zigT) e.zigT = 0;
             e.zigT -= dt;
             if (e.zigT <= 0) { e.zigT = 0.5; e.zigDir = (Math.random() > 0.5 ? 1 : -1) * rand(40, 80); }
             this._steer(e, dt, pp.x, pp.z, T.speed * 1.3, e.zigDir);
        }
        else if (diff === 4 && T.canFlank) { _v.copy(pp).addScaledVector(P.forward || _d.set(0,0,1), -8).applyAxisAngle(_up, e.flankAngle); this._follow(e, dt, _v, T.speed * 1.15); }
        else this._follow(e, dt, pp, T.speed * (diff === 4 ? 1.05 : 0.8)); 
        this._shoot(e, dt, pc, P, brainMods); e.yawT = yawTo; return; 
      }
      else if (Math.abs(dy) > 1.2) { this._follow(e, dt, pp, T.speed * 0.9); this._shoot(e, dt, pc, P, brainMods); e.yawT = yawTo; return; }
      else if (dist < T.keep * e.keepMul * brainMods.keepMulBias || brainMods.doctrine === 'AMBUSH_RUSHER') { mx = -nx; mz = -nz; }
      else if (dist > T.range * 0.7 && T.weapon === 'shotgun') { mx = nx; mz = nz; }
      else { e.strafeT -= dt; if (e.strafeT <= 0) { e.strafeT = rand(0.6, 1.6); e.strafeDir *= -1; } const sd = brainMods.strafeDirOverride !== null ? brainMods.strafeDirOverride : e.strafeDir; mx = -nz * sd; mz = nx * sd; }
      const spd = T.weapon === 'shotgun' ? T.speed * 1.1 : (diff === 4 ? T.speed * 0.9 : T.speed * 0.5);
      if ((mx || mz) && this._groundAhead(e, mx, mz)) {
        const a = 32 * dt;
        b.vel.x += clamp(mx * spd - b.vel.x, -a, a);
        b.vel.z += clamp(mz * spd - b.vel.z, -a, a);
      } else {
        b.vel.x = damp(b.vel.x, 0, 8, dt);
        b.vel.z = damp(b.vel.z, 0, 8, dt);
        if (mx !== 0 || mz !== 0) {
          const a = 28 * dt;
          b.vel.x += clamp(mx * T.speed * 0.7 - b.vel.x, -a, a);
          b.vel.z += clamp(mz * T.speed * 0.7 - b.vel.z, -a, a);
        } else {
          b.vel.x = damp(b.vel.x, 0, 8, dt);
          b.vel.z = damp(b.vel.z, 0, 8, dt);
        }
        this._shoot(e, dt, pc, P, brainMods);
        return;
      }
      this._shoot(e, dt, pc, P, brainMods.suppress);
    } else {
      if (diff >= 3 && e.lastKnownPos) e.aimAmt = damp(e.aimAmt, 1, 8, dt);
      else e.aimAmt = damp(e.aimAmt, 0, 5, dt);
      e.burstLeft = 0; e.aimT = 0; e.aimPoint = null; this._hideLaser(e);
      if (T.stationary && e.t < 5) { b.vel.x = damp(b.vel.x, 0, 8, dt); b.vel.z = damp(b.vel.z, 0, 8, dt); e.yawT = yawTo; }
      else {
        if (e.soundAlert) {
          const sd = Math.hypot(e.soundAlert.x - b.pos.x, e.soundAlert.z - b.pos.z);
          if (sd < 3.0) e.soundAlert = null;
          else this._follow(e, dt, e.soundAlert, T.speed * 1.1);
        } else if (e.lastKnownPos) {
          const ld = Math.hypot(e.lastKnownPos.x - b.pos.x, e.lastKnownPos.z - b.pos.z);
          if (ld < 2.5) { e.lastKnownPos = null; e.soundAlert = null; }
          else this._follow(e, dt, e.lastKnownPos, T.speed * 1.1);
        } else {
          this._follow(e, dt, pp, T.speed);
        }
      }
      if (e.los) e.yawT = yawTo;
    }
  }
  _thinkBoss(e, dt, pp, pc, dist, dy, yawTo, P) {
    return thinkBoss(this, e, dt, pp, pc, dist, dy, yawTo, P);
  }
  _thinkFlyer(e, dt, pc, P) {
    return thinkFlyer(this, e, dt, pc, P);
  }
  _flyTo(e, target, speed, accel, dt) { const b = e.body; _d.subVectors(target, b.pos); const l = _d.length(); if (l < 0.3) { b.vel.multiplyScalar(Math.max(0, 1 - 4 * dt)); return; } _d.divideScalar(l).multiplyScalar(speed * this.mods.speed); _v3.subVectors(_d, b.vel); const m = _v3.length(); if (m > accel * dt) _v3.multiplyScalar(accel * dt / m); b.vel.add(_v3); }
  _shoot(e, dt, pc, P, brainMods = {}) {
    const T = e.T, ctx = this.ctx; const muzzle = _v.setFromMatrixPosition(e.tip.matrixWorld);
    const diff = typeof window !== 'undefined' ? (window.currentDifficulty ?? 2) : 2;
    const waveMult = typeof game !== 'undefined' ? game.wave : 1;
    const suppress = brainMods.suppress || false;

    // Hard / Extreme / God Mode: Avoid Friendly Fire
    if (diff >= 2 && e.cool <= 0 && T.weapon !== 'sniper') {
      const distToP = pc.distanceTo(muzzle);
      _d.subVectors(pc, muzzle).normalize();
      const hitAlly = this.raycast(muzzle, _d, distToP, e);
      if (hitAlly) return; // Wait until ally is clear
    }

      // Anti-Air Doctrine vertical intercept
      if (brainMods.doctrine === 'ANTI-AIR' && P.body && P.body.vel.y < 0) {
        let fallPred = P.body.vel.y * 0.35;
        pc.y += fallPred; // Predict landing zone
        if (e.aimPoint) e.aimPoint.y += fallPred;
      }
      
      if (T.weapon === 'sniper') {
        if (e.cool > 0) { this._hideLaser(e); return; }
        e.aimT += dt;
        // The beam chases the player rather than being glued to them, and the shot goes exactly
        // where the beam is pointing - so if you keep moving once you see it, it misses.
        const dist = pc.distanceTo(muzzle);
        let targetPos = pc.clone();
        if (P && P.body && P.body.vel) {
          const isGrappling = !!P.grappling;
          const isAirborne = !P.body.onGround || Math.abs(P.body.vel.y) > 2;
          if (isGrappling || isAirborne) {
            const leadTime = clamp(dist / T.pspeed, 0.12, 0.42);
            targetPos.addScaledVector(P.body.vel, leadTime);
          }
        }
        let aimTimeMod = 1.0;
        if (diff >= 2) aimTimeMod = Math.max(0.2, 1.0 - (0.05 * waveMult));
        else if (diff === 0) aimTimeMod = Math.min(2.5, 1.2 + (0.1 * waveMult));
        const targetAimTime = T.aimTime * aimTimeMod * (suppress ? 0.7 : 1.0);

        if (!e.aimPoint) { e.aimPoint = targetPos.clone(); }
        else if (e.aimT < targetAimTime - 0.22) {
          // Track player smoothly until 0.22s grace dodge window locks the beam
          e.aimPoint.lerp(targetPos, 1 - Math.exp(-2.8 * dt * (diff >= 2 ? Math.min(3, 1 + waveMult * 0.1) : 1))); 
        }
        
        this._showLaser(e, muzzle, e.aimPoint, clamp(e.aimT / targetAimTime, 0, 1));
        if (e.aimT > targetAimTime * 0.45 && !e.aimWarned) {
          e.aimWarned = true;
          if (audio.stalkerAim) audio.stalkerAim(e.center); else audio.sniperAim(e.center);
        }
        if (e.aimT >= targetAimTime) {
          e.aimT = 0; e.aimWarned = false; e.cool = suppress ? rand(0.5, 1.0) : rand(T.cool[0], T.cool[1]);
          this._fireOne(e, muzzle, e.aimPoint, T.spread, T.pspeed, T.dmg, 0.07, P); audio.sniperShot(e.center);
          this._hideLaser(e); e.aimPoint = null;
        }
        return;
      }
      if (e.burstLeft > 0) {
        e.burstT -= dt;
        if (e.burstT <= 0) {
          e.burstT = suppress ? (T.burstInt * 0.7) : T.burstInt;
          e.burstLeft--;
          this._fireOne(e, muzzle, pc, T.spread, T.pspeed, T.dmg, 0.045, P);
          audio.enemyShot(e.center);
          if (T.leaper) ctx.effects.strokeBurst(muzzle, INK.BLACK, 3, 2, { life: 0.08, size: 0.035 });
          if (e.burstLeft === 0) e.cool = suppress ? rand(0.2, 0.6) : rand(T.cool[0], T.cool[1]);
        }
        return;
      }
      if (e.cool <= 0) {
        if (T.weapon === 'shotgun') {
          for (let i = 0; i < T.pellets; i++) this._fireOne(e, muzzle, pc, T.spread, T.pspeed * rand(0.85, 1.1), T.dmg, 0.05, P);
          audio.shotgun(e.center);
          e.cool = suppress ? rand(0.5, 1.0) : rand(T.cool[0], T.cool[1]);
          ctx.effects.strokeBurst(muzzle, INK.ORANGE, 8, 5, { life: 0.1, size: 0.04 });
          if (T.isHeavyShield) {
            ctx.effects.shakeAmt += 0.22;
          }
        }
        else { e.burstLeft = T.burst + (suppress ? 2 : 0); e.burstT = 0; }
      }
  }
  _showLaser(e, from, to, charge) {
    if (!e.laser) {
      e.laser = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 5), makeInkMaterial({ ink: INK.RED, fill: true }));
      e.laser.frustumCulled = false; this.ctx.scene.add(e.laser);
    }
    e.laser.visible = true;
    // stop the beam short of where it is pointing, otherwise a shot aimed at your face
    // renders as a red slab filling the screen instead of a thin telegraph line
    const d = _v2.subVectors(to, from); const len = d.length();
    if (len < 2) { e.laser.visible = false; return; }
    _v3.copy(from).addScaledVector(d, 1 - 1.6 / len);
    alignYAxis(e.laser, from, _v3, 0.006 + 0.012 * charge * charge);
  }
  _hideLaser(e) { if (e.laser) e.laser.visible = false; }
  _removeLaser(e) { if (e.laser) { this.ctx.scene.remove(e.laser); e.laser.geometry.dispose(); e.laser = null; } }
  _fireOne(e, muzzle, pc, spread, speed, dmg, thick, P = this.ctx.player) {
    const diff = typeof window !== 'undefined' ? (window.currentDifficulty ?? 2) : 2;
    _d.subVectors(pc, muzzle);
    const distToTarget = _d.length();
    _d.divideScalar(Math.max(distToTarget, 0.01));

    // Intelligent Projectile Lead: Predict player movement based on flight time
    if (diff >= 2 && P && P.body && P.body.vel) {
      const flightTime = distToTarget / Math.max(speed, 10);
      const leadAcc = diff === 4 ? 0.92 : diff === 3 ? 0.65 : 0.35;
      _v3.copy(P.body.vel).multiplyScalar(flightTime * leadAcc);
      _d.subVectors(pc, muzzle).add(_v3);
      _d.divideScalar(_d.length() || 1);
    }

    _d.y += rand(-0.15, 0.2);
    const sp = (diff === 4 ? spread * 0.75 : spread) * (1 + (P ? P.speed * 0.04 : 0));
    _d.x += rand(-sp, sp); _d.y += rand(-sp, sp); _d.z += rand(-sp, sp); _d.normalize();
    const finalSpeed = diff === 4 ? speed * 1.25 : speed;
    this.projectiles.fire(muzzle, _d, finalSpeed, dmg * this.mods.damage, e, INK.RED, thick);
    this.ctx.effects.strokeBurst(muzzle, INK.ORANGE, 4, 4, { life: 0.07, size: 0.03 });
  }
  _animateFlyer(e, dt) {
    return animateFlyer(e, dt);
  }
  _animate(e, dt, pc) {
    const b = e.body, J = e.J, T = e.T; const sp = Math.hypot(b.vel.x, b.vel.z);
    e.walk = damp(e.walk, clamp(sp / 4, 0, 1), 10, dt); const w = e.walk;
    e.phase += dt * (sp * 2.2 + (sp > 0.4 ? 3 : 0)); const s = Math.sin(e.phase), c = Math.cos(e.phase);
    J.legL.rotation.x = s * 0.9 * w; J.legR.rotation.x = -s * 0.9 * w; J.shinL.rotation.x = Math.max(0, c) * 1.1 * w; J.shinR.rotation.x = Math.max(0, -c) * 1.1 * w;
    if (!b.onGround) { J.legL.rotation.x = -0.5; J.legR.rotation.x = 0.6; J.shinL.rotation.x = 1.0; J.shinR.rotation.x = 0.5; }
    if (T.weapon === 'bomb' || T.model === 'blob') {
      J.armL.rotation.x = -2.4 + Math.sin(e.t * 20) * 0.4 * w; J.armR.rotation.x = -2.4 - Math.sin(e.t * 20) * 0.4 * w; J.torso.rotation.z = Math.sin(e.phase) * 0.12 * w; J.torso.rotation.x = -0.15 * w;
      if (J.spark) J.spark.scale.setScalar(0.7 + Math.random() * 0.8 + (e.fuseT >= 0 ? 1.5 : 0)); J.hips.position.y = 0.5 + Math.abs(c) * 0.08 * w;
      if (e.fuseT >= 0) { J.torso.rotation.x = Math.sin(e.t * 40) * 0.15; J.headG.rotation.y = Math.sin(e.t * 30) * 0.3; }
      return;
    }
    const aim = e.aimAmt;
    if (T.weapon === 'blade') {
      const at = e.attackT;
      const wind = at > 0.18 ? clamp((0.55 - at) / 0.37, 0, 1) : 0;      // arm goes up and back
      const strike = at > 0 && at <= 0.18 ? 1 - at / 0.18 : 0;           // then chops down
      J.armR.rotation.x = -0.8 * (1 - w) - s * 0.9 * w - wind * 2.2 + strike * 1.5;
      J.armR.rotation.z = -0.3 + wind * 0.7 - strike * 0.5;
      J.foreR.rotation.x = -0.9 - wind * 0.7 + strike * 0.5;
      J.armL.rotation.x = s * 1.1 * w - wind * 0.5; J.armL.rotation.z = 0.35 * w; J.foreL.rotation.x = -0.6 * w;
      J.torso.rotation.x = -0.3 * w + e.flinch * 0.35 - wind * 0.25 + strike * 0.55;
      J.torso.rotation.y = wind * 0.5 - strike * 0.6;
    } else if (T.weapon === 'boss') {
      const a = e.bossAtk; let raise = 0, slam = 0; if (a && a.kind === 'stomp') { raise = a.t < 0.75 ? clamp(a.t / 0.6, 0, 1) : 0; slam = a.t >= 0.75 ? 1 : 0; }
      if (a && a.kind === 'throw') { raise = a.t < 0.6 ? clamp(a.t / 0.5, 0, 1) : 0; }
      J.armR.rotation.x = -0.4 - s * 0.5 * w - raise * 2.4 + slam * 0.9; J.armR.rotation.z = -0.35; J.foreR.rotation.x = -0.6 - raise * 0.4;
      J.armL.rotation.x = s * 0.6 * w - raise * 0.8; J.armL.rotation.z = 0.35; J.foreL.rotation.x = -0.5; J.torso.rotation.x = -0.1 * w + e.flinch * 0.15 - raise * 0.3 + slam * 0.5;
    } else {
      J.armR.rotation.x = (-s * 1.0 * w) * (1 - aim) + (-1.35 + e.flinch * 0.35) * aim; J.armR.rotation.z = -0.25 * (1 - aim); J.foreR.rotation.x = -0.35 * (1 - aim) + -0.2 * aim;
      if (T.shield) { J.armL.rotation.x = -1.2; J.armL.rotation.y = 0.3; J.foreL.rotation.x = -0.9; }
      else { J.armL.rotation.x = (s * 1.0 * w) * (1 - aim) + -1.2 * aim; J.armL.rotation.y = 0.6 * aim; J.armL.rotation.z = 0.25 * (1 - aim); J.foreL.rotation.x = -0.4 * (1 - aim) + -0.5 * aim; }
      J.torso.rotation.x = -0.22 * w + e.flinch * 0.4; J.torso.rotation.y = -0.35 * aim; J.torso.rotation.z = Math.sin(e.phase) * 0.05 * w;
    }
    J.hips.position.y = 0.86 + Math.abs(c) * 0.07 * w + (b.onGround ? 0 : -0.05);
    _v.subVectors(pc, e.center); const yawTo = Math.atan2(_v.x, _v.z); J.headG.rotation.y = clamp(wrapAngle(yawTo - e.yaw) - (J.torso.rotation.y || 0), -1.1, 1.1);
    J.headG.rotation.x = clamp(-Math.atan2(_v.y, Math.hypot(_v.x, _v.z)), -0.6, 0.6) * 0.8; J.headG.rotation.z = Math.sin(e.phase * 0.5) * 0.06 * w;
    if (e.state === 'stunned') { J.torso.rotation.x = 0.6; J.armL.rotation.x = -2.5; J.armR.rotation.x = -2.5; J.legL.rotation.x = -0.8; J.legR.rotation.x = 0.9; }
  }
}
