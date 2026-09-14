// src/bot-player.js
// Autonomous High-Performance AI Bot Combatant for Doodle Strike Arena Battles.
// Supports 1v1 to 5v5 Team Deathmatch and Free For All with God Mode combat intelligence.

import * as THREE from 'three';
import { makeInkMaterial, setFill, INK } from './render.js';
import { buildHumanoid, buildWeaponProp } from './enemies.js';
import { clamp, damp, angleLerp, rand, choose } from './util.js';

const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _d = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);

const WEAPONS = ['rifle', 'shotgun', 'sniper', 'blade'];
const HIT = [
  ['head', 0.3], ['torso', 0.33], ['hips', 0.2],
  ['armL', 0.11], ['armR', 0.11], ['foreL', 0.1], ['foreR', 0.1],
  ['legL', 0.13], ['legR', 0.13], ['shinL', 0.11], ['shinR', 0.11]
];

// Overhyped Banter Ticker Lines for God Mode AI
const HYPE_LINES = {
  kill: [
    "SIT DOWN!", "CLIPPED!", "OUTPLAYED!", "DON'T PEEK!", "DIFF!",
    "GET SHREDDED!", "FREE ELO!", "SENT TO THE SKETCHBOOK!", "CLEAN HEADSHOT!"
  ],
  streak: [
    "I'M UNSTOPPABLE!", "GOD-LIKE SPREE!", "WHO'S NEXT?!", "CARRYING THIS LOBBY!"
  ],
  retreat: [
    "FALLING BACK!", "NEED COVER!", "PLATING UP!", "RESETTING FIGHT!"
  ],
  flank: [
    "FLANKING BEHIND!", "PINCHING MID!", "CONTESTING HIGH GROUND!"
  ]
};

export class BotPlayer {
  constructor(ctx, id, name, team, ink, difficulty = 4) {
    this.ctx = ctx;
    this.id = id;
    this.name = name || `[BOT] ${id}`;
    this.team = team; // 'alpha' | 'bravo' | 'ffa'
    this.ink = ink;
    this.difficulty = difficulty; // 0: Easy, 2: Standard, 3: Extreme, 4: Overhyped God Mode

    this.isBot = true;
    this.alive = true;
    this.hp = 100;
    this.maxHp = 100;
    this.kills = 0;
    this.deaths = 0;
    this.streak = 0;

    // Movement & Physics
    this.body = {
      pos: new THREE.Vector3(0, 0, 0),
      vel: new THREE.Vector3(0, 0, 0),
      halfW: 0.35,
      height: 1.75,
      onGround: true
    };
    this.center = new THREE.Vector3();
    this.eye = new THREE.Vector3();
    this.forward = new THREE.Vector3(0, 0, -1);
    this.right = new THREE.Vector3(1, 0, 0);
    this.yaw = rand(0, Math.PI * 2);
    this.pitch = 0;
    this.speed = 7.5; // Base sprint speed

    // Combat States
    this.weapon = 'rifle';
    this.weaponIndex = 0;
    this.crouching = false;
    this.sliding = false;
    this.slideTimer = 0;
    this.blocking = false;
    this.parryWindow = false;
    this.parryTimer = 0;
    this.dodgeCooldown = 0;
    this.shootCooldown = 0;
    this.grappling = false;
    this.flashT = 0;
    this.deadT = 0;

    // AI Targeting & Pathing
    this.target = null;
    this.path = null;
    this.pathIndex = 0;
    this.pathTimer = 0;
    this.strafeDir = 1;
    this.strafeTimer = rand(0.5, 1.5);
    this.jumpTimer = rand(1.0, 3.0);
    this.banterTimer = rand(2.0, 5.0);

    // Hitboxes
    this.hit = HIT;
    this.hitSpheres = HIT.map(() => new THREE.Vector3());

    // Materials & Visuals
    this.mat = makeInkMaterial({ ink: this.ink, shadeScale: 0, shadeBias: 1 });
    this.solid = makeInkMaterial({ ink: INK.BLACK ?? 2, fill: true, side: THREE.DoubleSide });
    this.T = {
      weapon: this.weapon,
      scale: 1.0,
      hat: choose(['cap', 'beanie', 'beret', 'none']),
      build: { bodyW: 1.0, headS: 1.0, limbR: 0.033 }
    };

    this._buildModel();
  }

  _buildModel() {
    const model = buildHumanoid(this.mat, this.solid, this.T);
    this.root = model.root;
    this.parts = model.parts;
    this.J = model.J;
    this.face = model.face;

    // Overhead Nametag with Team Banner Flag
    this.tagG = new THREE.Group();
    this.root.add(this.tagG);
    this.tagG.position.y = 2.28;

    const flagGeo = new THREE.BoxGeometry(0.55, 0.22, 0.02);
    const flagMat = makeInkMaterial({ ink: this.ink, fill: true, side: THREE.DoubleSide });
    this.tagG.add(new THREE.Mesh(flagGeo, flagMat));

    this.ctx.scene.add(this.root);
    this.corpse = false;
  }

  spawn(pos) {
    this.body.pos.copy(pos);
    this.body.pos.y = Math.max(this.body.pos.y, 0.2);
    this.body.vel.set(0, 0, 0);
    this.alive = true;
    this.hp = this.maxHp;
    this.deadT = 0;
    this.target = null;
    this.path = null;
    this.sliding = false;
    this.crouching = false;
    this.blocking = false;

    if (!this.root) {
      this._buildModel();
    }
    this.root.visible = true;
    this.root.position.copy(this.body.pos);
  }

  takeDamage(amount, fromPos, source = '') {
    if (!this.alive) return;

    // God Mode Katana Parry check
    if (this.blocking && this.parryWindow && fromPos) {
      _v.subVectors(fromPos, this.eye).normalize();
      if (_v.dot(this.forward) > 0.4) {
        this.ctx.effects?.strokeBurst(this.eye, INK.ORANGE ?? 3, 10, 6, { life: 0.25, size: 0.04 });
        this.ctx.audio?.shieldHit(this.center);
        return;
      }
    }

    this.hp -= amount;
    this.flashT = 0.08;
    setFill(this.mat, true);

    if (fromPos) {
      // Blood spatter in ink
      this.ctx.effects?.blood(this.center, _d.subVectors(this.center, fromPos).normalize(), 1.0);
    }

    // Reactive Dodge/Slide when shot on Extreme/God Mode
    if (this.difficulty >= 3 && this.dodgeCooldown <= 0 && this.body.onGround) {
      this.slideTimer = 0.55;
      this.sliding = true;
      this.dodgeCooldown = 1.4;
      _v.set((Math.random() - 0.5) * 8, 0, (Math.random() - 0.5) * 8);
      this.body.vel.add(_v);
    }

    if (this.hp <= 0) {
      this.die(fromPos);
    }
  }

  die(fromPos) {
    if (!this.alive) return;
    this.alive = false;
    this.deaths++;
    this.streak = 0;
    this.deadT = 0;

    const eff = this.ctx.effects;
    const dir = fromPos ? _d.subVectors(this.center, fromPos).normalize() : new THREE.Vector3(0, 0.5, 1);

    if (this.root) {
      this.root.updateWorldMatrix(true, false);
      this.ctx.scene.attach(this.root);
      _v.copy(dir).multiplyScalar(6 + Math.random() * 4);
      _v.y += 3.5 + Math.random() * 2;
      eff?.debris(this.root, this.root.position, _v, new THREE.Vector3(rand(-8, 8), rand(-8, 8), rand(-8, 8)), { radius: 0.55, blood: true, life: 6 });
      eff?.bloodPool(this.body.pos, 1.4, INK.RED ?? 1);
      this.root = null;
    }

    if (this.onDeath) {
      this.onDeath(this, fromPos);
    }
  }

  update(dt, matchTargets = []) {
    if (!this.alive) {
      this.deadT += dt;
      return;
    }

    if (this.flashT > 0) {
      this.flashT -= dt;
      if (this.flashT <= 0) setFill(this.mat, false);
    }

    // Cooldown timers
    this.shootCooldown -= dt;
    this.dodgeCooldown -= dt;
    this.strafeTimer -= dt;
    this.jumpTimer -= dt;
    this.pathTimer -= dt;
    this.banterTimer -= dt;
    if (this.slideTimer > 0) {
      this.slideTimer -= dt;
      if (this.slideTimer <= 0) this.sliding = false;
    }

    // 1. AI Decision Loop (Target Acquisition & State Machine)
    this._think(dt, matchTargets);

    // 2. Physics & Motion Integration
    this._move(dt);

    // 3. Aim & Weapon Firing
    this._combat(dt);

    // 4. Update Visual Transforms & Hitboxes
    this._updateVisuals(dt);
  }

  _think(dt, matchTargets) {
    // Acquire / Validate Target
    if (!this.target || !this.target.alive || Math.random() < 0.05) {
      this.target = this._findBestTarget(matchTargets);
    }

    if (!this.target) return;

    // Distance to target
    const targetPos = this.target.center || this.target.body?.pos;
    if (!targetPos) return;

    const dist = Math.hypot(targetPos.x - this.body.pos.x, targetPos.z - this.body.pos.z);
    const dy = targetPos.y - this.body.pos.y;

    // Tactical Retreat if critical HP (< 30%) and God Mode active
    const shouldRetreat = this.difficulty >= 3 && this.hp < 30;

    // Strafe rhythm
    if (this.strafeTimer <= 0) {
      this.strafeDir = Math.random() < 0.5 ? -1 : 1;
      this.strafeTimer = rand(0.6, 1.8);
    }

    // Bunny-hop / evasive jump in God Mode
    if (this.difficulty === 4 && this.jumpTimer <= 0 && this.body.onGround && dist < 30) {
      this.body.vel.y = 8.5; // High athletic jump
      this.jumpTimer = rand(1.2, 2.5);
    }

    // Calculate desired movement direction
    _d.subVectors(targetPos, this.body.pos).setY(0);
    const len = _d.length();
    if (len > 0.01) _d.divideScalar(len);

    // Strafe perpendicular vector
    const strafeVec = new THREE.Vector3(-_d.z * this.strafeDir, 0, _d.x * this.strafeDir);

    const idealRange = this.weapon === 'shotgun' ? 7.0 : (this.weapon === 'blade' ? 2.2 : 16.0);

    let moveX = 0, moveZ = 0;

    if (shouldRetreat) {
      // Backpedal and seek distance
      moveX = -_d.x * 0.9 + strafeVec.x * 0.6;
      moveZ = -_d.z * 0.9 + strafeVec.z * 0.6;
    } else if (dist > idealRange + 2.0) {
      // Approach target + strafe
      moveX = _d.x * 0.75 + strafeVec.x * 0.55;
      moveZ = _d.z * 0.75 + strafeVec.z * 0.55;
    } else if (dist < idealRange - 2.0) {
      // Backpedal while firing
      moveX = -_d.x * 0.6 + strafeVec.x * 0.75;
      moveZ = -_d.z * 0.6 + strafeVec.z * 0.75;
    } else {
      // Pure circle-strafe
      moveX = strafeVec.x * 0.95;
      moveZ = strafeVec.z * 0.95;
    }

    // Apply movement acceleration
    const currentSpeed = (this.sliding ? this.speed * 1.5 : (this.crouching ? this.speed * 0.5 : this.speed)) * (this.difficulty >= 3 ? 1.15 : 1.0);
    this.body.vel.x = damp(this.body.vel.x, moveX * currentSpeed, 12, dt);
    this.body.vel.z = damp(this.body.vel.z, moveZ * currentSpeed, 12, dt);

    // Turn face smoothly toward target
    const targetYaw = Math.atan2(-(_d.x), -(_d.z));
    this.yaw = angleLerp(this.yaw, targetYaw, clamp(dt * 14, 0, 1));
    this.pitch = damp(this.pitch, Math.atan2(dy, Math.max(0.1, dist)), 12, dt);
  }

  _findBestTarget(matchTargets) {
    let best = null;
    let bestScore = -Infinity;

    for (const t of matchTargets) {
      if (!t || !t.alive || t === this) continue;
      // In team match, do NOT target teammates
      if (this.team !== 'ffa' && t.team === this.team) continue;

      const tPos = t.center || t.body?.pos;
      if (!tPos) continue;

      const d = Math.hypot(tPos.x - this.body.pos.x, tPos.z - this.body.pos.z);
      // Prefer closer targets, with bonus weight on human player
      let score = 100 - d;
      if (t.isLocal || t === this.ctx.player) score += 20;

      if (score > bestScore) {
        bestScore = score;
        best = t;
      }
    }
    return best;
  }

  _move(dt) {
    const b = this.body;
    const world = this.ctx.world;

    // Gravity
    b.vel.y -= 26.0 * dt;

    if (world && world.moveBody) {
      world.moveBody(b, dt);
    } else {
      // Fallback if no physics world exists
      b.pos.x += b.vel.x * dt;
      b.pos.y += b.vel.y * dt;
      b.pos.z += b.vel.z * dt;
      if (b.pos.y <= 0.0) {
        b.pos.y = 0.0;
        b.vel.y = 0;
        b.onGround = true;
      } else {
        b.onGround = false;
      }
    }
  }

  _combat(dt) {
    if (!this.target || !this.target.alive) return;

    const targetPos = this.target.center || this.target.body?.pos;
    if (!targetPos) return;

    const dist = Math.hypot(targetPos.x - this.body.pos.x, targetPos.z - this.body.pos.z);

    // Fire weapon if cooldown is ready
    if (this.shootCooldown <= 0 && dist < 45.0) {
      this._fireAtTarget(targetPos, dist);
    }
  }

  _fireAtTarget(targetPos, dist) {
    const isGod = this.difficulty === 4;
    const cooldownTime = isGod ? 0.22 : 0.45;
    this.shootCooldown = cooldownTime;

    // Predictive aim with projectile leading
    const aimTarget = targetPos.clone();
    if (this.target.body?.vel && isGod) {
      const bulletSpeed = 45.0;
      const travelTime = dist / bulletSpeed;
      aimTarget.addScaledVector(this.target.body.vel, travelTime * 0.8);
    }

    // Aim spread
    const spreadAmt = isGod ? 0.03 : 0.09;
    aimTarget.x += (Math.random() - 0.5) * spreadAmt * dist;
    aimTarget.y += (Math.random() - 0.5) * spreadAmt * dist;
    aimTarget.z += (Math.random() - 0.5) * spreadAmt * dist;

    // Firing line
    _d.subVectors(aimTarget, this.eye).normalize();

    // Damage Raycast
    const damage = isGod ? 14 : 9;
    const hitW = this.ctx.world?.raycast(this.eye, _d, 60.0);
    const hit = this.ctx.raycastPlayers ? this.ctx.raycastPlayers(this.eye, _d, 60.0) : null;
    
    let hitPoint = aimTarget;
    let hitSomething = false;
    const wDist = hitW ? hitW.dist : Infinity;

    if (hit && hit.player && hit.player !== this && hit.dist < wDist) {
      hitPoint = hit.point;
      hitSomething = true;
      if (this.team === 'ffa' || hit.player.team !== this.team) {
        hit.player.takeDamage(damage, hit.point, this.weapon);
        if (!hit.player.alive) {
          this.kills++;
          this.streak++;
          this._emitBanter('kill');
        }
      }
    } else if (this.target === this.ctx.player) {
      // Direct raycast to local player
      const pEye = this.ctx.player.eye;
      const pDist = this.eye.distanceTo(pEye);
      const toPlayer = _v.subVectors(pEye, this.eye).normalize();
      if (_d.dot(toPlayer) > 0.94 && pDist < 50.0 && pDist < wDist) {
        hitPoint = this.ctx.player.center;
        hitSomething = true;
        this.ctx.player.lastHitBy = this.id;
        this.ctx.player.lastHit = { from: this.eye.toArray(), crit: false, amount: damage, src: 'bot' };
        this.ctx.player.takeDamage(damage, this.eye);
        if (this.ctx.player.hp <= 0) {
          this.kills++;
          this.streak++;
          this._emitBanter('kill');
        }
      }
    }

    if (hitW && !hitSomething) {
      hitPoint = hitW.point;
      this.ctx.effects?.bulletImpact(hitW.point, hitW.normal);
    }

    // Muzzle flash & audio
    this.ctx.audio?.remoteShot(this.weapon, this.eye);
    this.ctx.effects?.tracer(this.eye, hitPoint, this.ink, 0.02, 0.12);
  }

  _emitBanter(category) {
    if (!this.onBanter) return;
    const pool = HYPE_LINES[category] || HYPE_LINES.kill;
    const line = choose(pool);
    this.onBanter(this, line, category);
  }

  _updateVisuals(dt) {
    this.body.height = this.crouching ? 1.05 : 1.75;
    this.eye.set(this.body.pos.x, this.body.pos.y + (this.crouching ? 0.88 : 1.6), this.body.pos.z);
    this.center.set(this.body.pos.x, this.body.pos.y + this.body.height * 0.55, this.body.pos.z);

    this.forward.set(
      -Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      -Math.cos(this.yaw) * Math.cos(this.pitch)
    );
    this.right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    if (!this.root) return;

    this.root.position.copy(this.body.pos);
    this.root.rotation.y = this.yaw + Math.PI;

    // Update animations
    const sp = Math.hypot(this.body.vel.x, this.body.vel.z);
    this.walk = damp(this.walk || 0, clamp(sp / 4, 0, 1), 10, dt);
    const w = this.walk;
    this.phase = (this.phase || 0) + dt * (sp * 2.2 + (sp > 0.4 ? 3 : 0));
    const s = Math.sin(this.phase), c = Math.cos(this.phase);

    if (this.J) {
      this.J.legL.rotation.x = s * 0.9 * w;
      this.J.legR.rotation.x = -s * 0.9 * w;
      this.J.shinL.rotation.x = Math.max(0, c) * 1.1 * w;
      this.J.shinR.rotation.x = Math.max(0, -c) * 1.1 * w;
      if (!this.body.onGround) {
        this.J.legL.rotation.x = -0.5;
        this.J.legR.rotation.x = 0.6;
        this.J.shinL.rotation.x = 1.0;
        this.J.shinR.rotation.x = 0.5;
      }
    }

    this.root.updateMatrixWorld(true);

    // Update Hit Spheres
    for (let i = 0; i < HIT.length; i++) {
      const partName = HIT[i][0];
      if (this.parts && this.parts[partName]) {
        this.hitSpheres[i].setFromMatrixPosition(this.parts[partName].matrixWorld);
      } else {
        this.hitSpheres[i].copy(this.center);
      }
    }
  }
}
