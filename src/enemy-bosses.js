import * as THREE from 'three';
import { INK } from './render.js';
import { rand, clamp, TAU } from './util.js';
import { audio } from './audio.js';

const SEE_THROUGH = (p) => p && (p.isFence || p.isGlass || p.isLowCover || p.noCollide || p.isSpike);

const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _d = new THREE.Vector3();

function damp(a, b, lambda, dt) {
  return a + (b - a) * (1 - Math.exp(-lambda * dt));
}

export function thinkBoss(mgr, e, dt, pp, pc, dist, dy, yawTo, P) {
  const T = e.T, b = e.body, ctx = mgr.ctx;
  const diff = typeof window !== 'undefined' ? (window.currentDifficulty ?? 2) : 2;

  // Environmental destruction: Boss smashes through breakable props in its path
  if (ctx.level && ctx.level.breakables && b.vel.lengthSq() > 0.5) {
    for (const br of ctx.level.breakables) {
      if (br.alive && br.mesh && br.mesh.position.distanceToSquared(b.pos) < 7.5) {
        br.alive = false;
        ctx.effects.explosion(br.mesh.position, 2.5, INK.BLACK);
        if (br.mesh.parent) br.mesh.parent.remove(br.mesh);
      }
    }
  }

  if (T.bossKind === 'eraser') return thinkEraser(mgr, e, dt, pp, pc, dist, dy, yawTo, P);
  if (T.bossKind === 'inkblot') return thinkInkblot(mgr, e, dt, pp, pc, dist, dy, yawTo, P);
  if (e.bossAtk) {
    const a = e.bossAtk; a.t += dt; e.yawT = yawTo; b.vel.x = damp(b.vel.x, 0, 5, dt); b.vel.z = damp(b.vel.z, 0, 5, dt);
    if (a.kind === 'stomp') {
      if (a.t > 0.75 && !a.done) {
        a.done = true; audio.stomp(e.center); ctx.effects.shakeAmt += 0.9; ctx.effects.explosion(b.pos.clone().add(_v.set(0, 0.2, 0)), 7, INK.BLACK);
        for (let i = 0; i < 24; i++) { const an = i / 24 * TAU; _v.set(b.pos.x + Math.cos(an) * 3, b.pos.y + 0.3, b.pos.z + Math.sin(an) * 3); _v2.set(Math.cos(an) * 14, 2, Math.sin(an) * 14); ctx.effects._spawn('stroke', _v, _v2, { size: 0.06, life: 0.4, ink: INK.BLACK, gravity: 4, stretch: 0.06, drag: 3 }); }
        for (const t of mgr.targets()) { const dd = Math.hypot(t.body.pos.x - b.pos.x, t.body.pos.z - b.pos.z); if (t.alive && dd < 7.5 && t.body.pos.y < b.pos.y + 2.5) { t.takeDamage(T.dmg * mgr.mods.damage, e.center); t.knockback(_d.subVectors(t.center, e.center).normalize(), 9); } }
        mgr.blastEnemies(b.pos, 6, 60, e);
      }
      if (a.t > 1.3) { e.bossAtk = null; e.cool = rand(T.cool[0], T.cool[1]); }
    } else {
      if (a.t > 0.6 && !a.done) { a.done = true; _v.setFromMatrixPosition(e.parts.head.matrixWorld); _v.y += 1; _d.subVectors(pc, _v); const l = _d.length(); _d.divideScalar(l); _d.y += l * 0.012; _d.normalize(); mgr.projectiles.fire(_v, _d, 24, T.dmg * 0.9, e, INK.BLACK, 0.4, 1); audio.enemyShot(e.center); }
      if (a.t > 1.0) { e.bossAtk = null; e.cool = rand(T.cool[0] * 0.6, T.cool[1] * 0.6); }
    }
    return;
  }
  e.aimAmt = damp(e.aimAmt, e.los ? 1 : 0, 6, dt);
  if (e.cool <= 0 && e.los) {
    // Titanic Leap Slam on God / Hard mode if player is camping or far
    if (diff >= 3 && (dist > 12 || Math.abs(dy) > 2.5) && b.onGround && Math.random() < 0.75) {
      let jumpY = 8.5;
      if (dy > 1.5) jumpY = Math.max(8.5, Math.sqrt(48 * dy) + 2);
      b.vel.x = ((pp.x - b.pos.x) / dist) * 16; b.vel.z = ((pp.z - b.pos.z) / dist) * 16; b.vel.y = jumpY; b.onGround = false;
      e.cool = rand(2.8, 4.0);
      audio.bossRoar(e.center); ctx.effects.shakeAmt += 0.8;
      return;
    }
    if (dist < 7.5 && Math.abs(dy) < 3.2) { e.bossAtk = { kind: 'stomp', t: 0, done: false }; audio.bossRoar(e.center); return; }
    if (dist < T.range) { e.bossAtk = { kind: 'throw', t: 0, done: false }; return; }
  }
  if (e.los && dist < 14 && Math.abs(dy) < 2) mgr._steer(e, dt, pp.x, pp.z, T.speed * 1.1, 30); else mgr._follow(e, dt, pp, T.speed * 1.1);
  if (e.los) e.yawT = yawTo;
}

// THE ERASER: a rubber brick that charges across the ground, then scrubs the page and calls
// in bombers. It wants to be close; keep moving and it skids past you.
export function thinkEraser(mgr, e, dt, pp, pc, dist, dy, yawTo, P) {
  const T = e.T, b = e.body, ctx = mgr.ctx; e.aimAmt = damp(e.aimAmt, 0, 6, dt);
  const diff = typeof window !== 'undefined' ? (window.currentDifficulty ?? 2) : 2;
  if (e.bossAtk) {
    const a = e.bossAtk; a.t += dt;
    if (a.kind === 'charge') {
      if (a.t < 0.7) { e.yawT = yawTo; b.vel.x = damp(b.vel.x, 0, 8, dt); b.vel.z = damp(b.vel.z, 0, 8, dt); if (a.t > 0.55 && !a.dir) { a.dir = new THREE.Vector3(pp.x - b.pos.x, 0, pp.z - b.pos.z).normalize(); audio.bossRoar(e.center); } }
      else if (a.t < 1.9) {
        // Dynamic steering during charge on God Mode
        if (diff >= 3) {
          _d.subVectors(pp, b.pos).setY(0).normalize();
          a.dir.lerp(_d, clamp(dt * (diff === 4 ? 4.5 : 2.5), 0, 1)).normalize();
        }
        b.vel.x = a.dir.x * 17 * mgr.mods.speed; b.vel.z = a.dir.z * 17 * mgr.mods.speed;
        for (const t of mgr.targets()) { if (!t.alive) continue; const d = Math.hypot(t.body.pos.x - b.pos.x, t.body.pos.z - b.pos.z); if (d < 2.6 && Math.abs(t.body.pos.y - b.pos.y) < 3 && !a.hit) { a.hit = true; t.takeDamage(T.dmg * mgr.mods.damage, e.center); t.knockback(_d.subVectors(t.center, e.center).setY(0.2).normalize(), 13); ctx.effects.shakeAmt += 0.5; } }
        if (b.hitWall) { a.t = 1.9; ctx.effects.strokeBurst(e.center, INK.PINK, 30, 9, { life: 0.4, size: 0.05 }); audio.stomp(e.center); ctx.effects.shakeAmt += 0.6; }
        if (Math.floor(a.t * 10) !== Math.floor((a.t - dt) * 10)) ctx.effects.strokeBurst(b.pos.clone().add(_v.set(0, 0.3, 0)), INK.PINK, 4, 3, { life: 0.35, size: 0.06 });
      } else { b.vel.x = damp(b.vel.x, 0, 4, dt); b.vel.z = damp(b.vel.z, 0, 4, dt); if (a.t > 2.7) { e.bossAtk = null; e.cool = rand(T.cool[0], T.cool[1]); e.charges = (e.charges || 0) + 1; } }
    } else {
      e.yawT = yawTo; b.vel.x = damp(b.vel.x, 0, 6, dt); b.vel.z = damp(b.vel.z, 0, 6, dt);
      if (a.t > 0.9 && !a.done) {
        a.done = true; audio.stomp(e.center); ctx.effects.shakeAmt += 0.8;
        ctx.effects.explosion(b.pos.clone().add(_v.set(0, 0.2, 0)), 6, INK.PINK);
        const live = mgr.enemies.filter((x) => x.alive && x.type === 'bomber').length;
        for (let i = 0; i < 2 && live + i < 4; i++) { const an = rand(0, TAU); const sp = mgr.spawn('bomber', b.pos.clone().add(_v.set(Math.cos(an) * 3, 0, Math.sin(an) * 3))); sp.state = 'hunt'; sp.root.scale.setScalar(sp.T.scale); }
        for (const t of mgr.targets()) { const d = Math.hypot(t.body.pos.x - b.pos.x, t.body.pos.z - b.pos.z); if (t.alive && d < 6.5 && t.body.pos.y < b.pos.y + 3) { t.takeDamage(T.dmg * 0.8 * mgr.mods.damage, e.center); t.knockback(_d.subVectors(t.center, e.center).normalize(), 9); } }
      }
      if (a.t > 1.6) { e.bossAtk = null; e.cool = rand(T.cool[0], T.cool[1]); }
    }
    return;
  }
  if (e.cool <= 0 && e.los) { if ((e.charges || 0) % 3 === 2 && dist < 12) { e.bossAtk = { kind: 'rub', t: 0, done: false }; e.charges++; return; } if (dist < T.range && dist > 3) { e.bossAtk = { kind: 'charge', t: 0, hit: false, dir: null }; return; } }
  if (e.los && dist < 16 && Math.abs(dy) < 2) mgr._steer(e, dt, pp.x, pp.z, T.speed * 1.1, 30); else mgr._follow(e, dt, pp, T.speed * 1.1);
  if (e.los) e.yawT = yawTo;
}

// THE INKBLOT: hops around the arena, sprays fans of bursting ink, and shakes wasps loose.
export function thinkInkblot(mgr, e, dt, pp, pc, dist, dy, yawTo, P) {
  const T = e.T, b = e.body, ctx = mgr.ctx; e.aimAmt = damp(e.aimAmt, e.los ? 1 : 0, 6, dt);
  if (e.bossAtk) {
    const a = e.bossAtk; a.t += dt; e.yawT = yawTo; b.vel.x = damp(b.vel.x, 0, 6, dt); b.vel.z = damp(b.vel.z, 0, 6, dt);
    if (a.kind === 'spray') {
      if (a.t > 0.6 && a.shots < 9 && a.t > 0.6 + a.shots * 0.09) {
        _v.setFromMatrixPosition(e.parts.torso.matrixWorld); _v.y += 0.8;
        const base = Math.atan2(pp.x - b.pos.x, pp.z - b.pos.z); const an = base + (a.shots - 4) * 0.19;
        _d.set(Math.sin(an), 0.18 + rand(-0.05, 0.05), Math.cos(an)).normalize();
        mgr.projectiles.fire(_v, _d, 20, T.dmg * 0.55 * mgr.mods.damage, e, INK.BLACK, 0.3, 1); a.shots++; if (a.shots === 1) audio.enemyShot(e.center);
      }
      if (a.t > 1.8) { e.bossAtk = null; e.cool = rand(T.cool[0], T.cool[1]); e.sprays = (e.sprays || 0) + 1; }
    } else {
      if (a.t > 0.8 && !a.done) {
        a.done = true; audio.bossRoar(e.center); ctx.effects.strokeBurst(e.center, INK.BLACK, 40, 10, { life: 0.5, size: 0.05 });
        const live = mgr.enemies.filter((x) => x.alive && x.type === 'flyer').length;
        for (let i = 0; i < 3 && live + i < 6; i++) { const sp = mgr.spawn('flyer', e.center.clone().add(_v.set(rand(-2, 2), 2 + i, rand(-2, 2)))); sp.state = 'hunt'; sp.root.scale.setScalar(sp.T.scale); }
      }
      if (a.t > 1.4) { e.bossAtk = null; e.cool = rand(T.cool[0], T.cool[1]); }
    }
    return;
  }
  // it moves in hops: a big jump toward you every couple of seconds, a slam of ink on landing
  e.hopT = (e.hopT ?? 1) - dt;
  if (b.onGround && e.hopT <= 0 && dist > 4) { e.hopT = rand(1.6, 2.4); const nx = (pp.x - b.pos.x) / dist, nz = (pp.z - b.pos.z) / dist; b.vel.set(nx * 11, 13, nz * 11); b.onGround = false; e.hopping = true; }
  if (e.hopping && b.onGround) { e.hopping = false; audio.stomp(e.center); ctx.effects.shakeAmt += 0.4; ctx.effects.bloodPool(b.pos, 3.5, INK.BLACK); for (const t of mgr.targets()) { const d = Math.hypot(t.body.pos.x - b.pos.x, t.body.pos.z - b.pos.z); if (t.alive && d < 4.5 && Math.abs(t.body.pos.y - b.pos.y) < 2.5) { t.takeDamage(T.dmg * 0.7 * mgr.mods.damage, e.center); t.knockback(_d.subVectors(t.center, e.center).normalize(), 8); } } }
  if (e.cool <= 0 && e.los) { if ((e.sprays || 0) % 3 === 2) { e.bossAtk = { kind: 'summon', t: 0, done: false }; e.sprays++; return; } if (dist < T.range) { e.bossAtk = { kind: 'spray', t: 0, shots: 0 }; return; } }
  if (!e.hopping) { if (e.los && dist < 14 && Math.abs(dy) < 2) mgr._steer(e, dt, pp.x, pp.z, T.speed, 30); else mgr._follow(e, dt, pp, T.speed); }
  if (e.los) e.yawT = yawTo;
}

export function thinkFlyer(mgr, e, dt, pc, P) {
  const T = e.T, b = e.body, ctx = mgr.ctx; e.flyT -= dt; e.cool -= dt;
  const want = _v2;
  if (e.flyState === 'stunned') { b.vel.y -= 20 * dt; if (b.onGround || e.t > 2.2) { e.flyState = 'climb'; e.flyT = 1.2; e.state = 'hunt'; } }
  else if (e.flyState === 'orbit') {
    const ang = Math.atan2(b.pos.x - pc.x, b.pos.z - pc.z) + e.orbitDir * 0.45; const rad = 11;
    want.set(pc.x + Math.sin(ang) * rad, pc.y + 6 + Math.sin(e.t * 1.3) * 1.5, pc.z + Math.cos(ang) * rad);
    mgr._flyTo(e, want, T.speed, 22, dt);
    if (e.cool <= 0 && P.alive && ctx.world.hasLineOfSight(e.center, pc, SEE_THROUGH)) { e.flyState = 'dive'; e.flyT = 1.6; e.diveHit = false; audio.flyerDive(e.center); }
    if (Math.random() < dt * 1.5) audio.flyerBuzz(e.center);
  } else if (e.flyState === 'dive') {
    want.copy(pc); mgr._flyTo(e, want, 16, 28, dt);
    const d = e.center.distanceTo(pc);
    if (d < 1.4 && !e.diveHit) { e.diveHit = true; if (P.tryBlockMelee(e)) { e.flyState = 'stunned'; e.state = 'stunned'; e.t = 0; b.vel.set(-b.vel.x * 0.3, -3, -b.vel.z * 0.3); } else if (P.alive) { P.takeDamage(T.dmg * mgr.mods.damage, e.center); P.knockback(_d.copy(b.vel).normalize(), 3); } }
    if (e.flyT <= 0 || e.diveHit || b.hitWall) { e.flyState = 'climb'; e.flyT = 1.1; e.cool = rand(T.cool[0], T.cool[1]); }
  } else {
    want.set(pc.x + (b.pos.x - pc.x) * 1.5, pc.y + 8, pc.z + (b.pos.z - pc.z) * 1.5); mgr._flyTo(e, want, T.speed, 18, dt);
    if (e.flyT <= 0) e.flyState = 'orbit';
  }
  // avoid geometry: look ahead and above the ground
  const sp = b.vel.length();
  if (sp > 0.5) { _d.copy(b.vel).divideScalar(sp); const h = ctx.world.raycast(e.center, _d, 3.5); if (h) { b.vel.addScaledVector(h.normal, 14 * dt); b.vel.y += 12 * dt; } }
  const g = ctx.world.raycast(e.center, _v.set(0, -1, 0), 2.5); if (g) b.vel.y += 12 * dt;
  _d.copy(b.vel); if (_d.lengthSq() > 0.1) e.yawT = Math.atan2(_d.x, _d.z);
}

export function combatSlide(mgr, e, dx, dz, dist, diff) {
  const b = e.body;
  e.dodgeCooldown = diff === 4 ? rand(1.2, 1.7) : diff === 3 ? rand(2.0, 2.8) : rand(3.0, 4.2);
  let perpX = -dz / dist, perpZ = dx / dist;
  if (Math.random() < 0.5) { perpX = -perpX; perpZ = -perpZ; }
  if (diff >= 3 && !mgr._groundAhead(e, perpX, perpZ)) { perpX = -perpX; perpZ = -perpZ; }
  const slideSpeed = diff === 4 ? 12 : 9.5;
  b.vel.x += perpX * slideSpeed;
  b.vel.z += perpZ * slideSpeed;
  b.vel.y = (e.T && e.T.leaper) ? Math.max(b.vel.y, 7.8) : Math.max(b.vel.y, 0.4);
}

export function findCover(mgr, e, pp, pc) {
  const b = e.body, nav = mgr.ctx.nav, world = mgr.ctx.world;
  const eyeTarget = pc || pp;
  if (nav && nav.nodes && nav.nodes.length) {
    const c = nav.cell;
    const cx = Math.floor((b.pos.x - nav.minX) / c);
    const cz = Math.floor((b.pos.z - nav.minZ) / c);
    const r = 14;
    let bestNode = null;
    let bestScore = Infinity;
    for (let iz = Math.max(0, cz - r); iz <= Math.min(nav.nz - 1, cz + r); iz += 2) {
      for (let ix = Math.max(0, cx - r); ix <= Math.min(nav.nx - 1, cx + r); ix += 2) {
        const cand = nav.cells[iz * nav.nx + ix];
        if (!cand) continue;
        for (const id of cand) {
          const n = nav.nodes[id];
          const dy = n.y - b.pos.y;
          if (dy < -2.0 || dy > 2.5) continue;
          const distToEnemy = Math.hypot(n.x - b.pos.x, n.z - b.pos.z);
          if (distToEnemy < 3.5 || distToEnemy > 18.0) continue;
          const distToPlayer = Math.hypot(n.x - pp.x, n.z - pp.z);
          if (distToPlayer < 7.0) continue;
          _v.set(n.x, n.y + 1.2, n.z);
          if (!world.hasLineOfSight(_v, eyeTarget, SEE_THROUGH)) {
            const score = distToEnemy - (distToPlayer * 0.3);
            if (score < bestScore) {
              bestScore = score;
              bestNode = new THREE.Vector3(n.x, n.y, n.z);
            }
          }
        }
      }
    }
    if (bestNode) return bestNode;
  }
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    _d.set(Math.cos(a), 0, Math.sin(a));
    const hit = world.raycast(b.pos, _d, 16, SEE_THROUGH);
    if (hit && hit.distance > 3) {
      _v.copy(hit.point).addScaledVector(hit.normal, 1.2);
      if (Math.hypot(_v.x - pp.x, _v.z - pp.z) > 6.0 && !world.hasLineOfSight(_v, eyeTarget, SEE_THROUGH)) {
        return _v.clone();
      }
    }
  }
  return null;
}

export function retreatToCover(mgr, e, dt, pp) {
  const b = e.body;
  const distSq = b.pos.distanceToSquared(e.coverPoint);
  const inCover = distSq < 3.5 || (!e.los && distSq < 9.0);
  if (inCover) {
    e.coverT -= dt;
    b.vel.x = damp(b.vel.x, 0, 8, dt);
    b.vel.z = damp(b.vel.z, 0, 8, dt);
    if (pp) e.yawT = Math.atan2(pp.x - b.pos.x, pp.z - b.pos.z);
    if (e.coverT <= 0 || (e.T.role === 'ranged' && e.cool <= 0 && e.hp / e.maxHp > 0.35)) {
      e.coverT = 0;
      e.coverPoint = null;
      if (e.retreating) { e.retreating = false; e.cool = 0; }
    }
  } else {
    mgr._follow(e, dt, e.coverPoint, e.T.speed * 1.35);
    e.aimAmt = damp(e.aimAmt, 0, 8, dt);
  }
}

export function animateFlyer(e, dt) {
  const J = e.J, b = e.body; e.phase += dt * 14; const flap = Math.sin(e.phase) * 0.35;
  J.wl.rotation.z = flap; J.wr.rotation.z = -flap; const roll = clamp(-(b.vel.x * Math.cos(e.yaw) - b.vel.z * Math.sin(e.yaw)) * 0.05, -0.8, 0.8);
  J.body.rotation.z = damp(J.body.rotation.z, roll, 6, dt); J.body.rotation.x = damp(J.body.rotation.x, clamp(-b.vel.y * 0.06, -0.6, 0.6), 6, dt); J.body.position.y = 0.6 + Math.sin(e.t * 3) * 0.1;
  if (e.flyState === 'stunned') J.body.rotation.z += dt * 12;
}


