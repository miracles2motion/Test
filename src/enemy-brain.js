import * as THREE from 'three';
import { clamp, damp } from './util.js';

class PlayerProfile {
  constructor() {
    this.aggression = 0.5;
    this.mobility = 0.5;
    this.verticality = 0.5;
    this.accuracy = 0.5;
    this.weaponUsage = { rifle: 0.25, shotgun: 0.25, sniper: 0.25, katana: 0.25 };
    
    // Kill Zone Heat Map (8x8 grid over typical map bounds)
    this.heatMap = new Float32Array(64);
    
    // Dodge direction bias: < 0 is left, > 0 is right
    this.dodgeBias = 0;
    
    // Grenade frequency
    this.nadesThrown = 0;
    this.lastReloadT = 0;
    this.reloadPauseAvg = 2.0;

    // Tracking state
    this._lastPos = new THREE.Vector3();
    this._lastVel = new THREE.Vector3();
    this._shots = 0;
    this._hits = 0;
  }

  load(data) {
    if (!data) return;
    try {
      const p = JSON.parse(data);
      this.aggression = p.aggression ?? 0.5;
      this.mobility = p.mobility ?? 0.5;
      this.verticality = p.verticality ?? 0.5;
      this.accuracy = p.accuracy ?? 0.5;
      if (p.weaponUsage) Object.assign(this.weaponUsage, p.weaponUsage);
      if (p.heatMap && p.heatMap.length === 64) {
        for (let i = 0; i < 64; i++) this.heatMap[i] = p.heatMap[i];
      }
      this.dodgeBias = p.dodgeBias ?? 0;
      this.reloadPauseAvg = p.reloadPauseAvg ?? 2.0;
    } catch (e) {
      console.warn("Failed to load PlayerProfile");
    }
  }

  save() {
    return JSON.stringify({
      aggression: this.aggression,
      mobility: this.mobility,
      verticality: this.verticality,
      accuracy: this.accuracy,
      weaponUsage: this.weaponUsage,
      heatMap: Array.from(this.heatMap),
      dodgeBias: this.dodgeBias,
      reloadPauseAvg: this.reloadPauseAvg
    });
  }

  _heatMapIndex(pos) {
    // Map -60..60 to 0..7
    let cx = Math.floor((pos.x + 60) / 15);
    let cz = Math.floor((pos.z + 60) / 15);
    cx = clamp(cx, 0, 7);
    cz = clamp(cz, 0, 7);
    return cz * 8 + cx;
  }
}

class SquadCoordinator {
  constructor(mgr) {
    this.mgr = mgr;
    this.packs = [];
    this.suppressors = new Set();
  }

  update(dt, brain) {
    this.suppressors.clear();
    const diff = typeof window !== 'undefined' ? (window.currentDifficulty ?? 2) : 2;
    if (diff < 3) return; // Packs only on Extreme/God Mode

    // Super simple pack formation: group enemies by LOS to player
    let losEnemies = [];
    for (const e of this.mgr.enemies) {
      if (e.alive && e.los && !e.T.boss && !e.T.flying && e.T.role !== 'kamikaze') {
        losEnemies.push(e);
      }
    }

    if (losEnemies.length >= 3) {
      // Pick a suppressor (furthest back)
      losEnemies.sort((a, b) => {
        const da = Math.hypot(a.body.pos.x - brain.playerPos.x, a.body.pos.z - brain.playerPos.z);
        const db = Math.hypot(b.body.pos.x - brain.playerPos.x, b.body.pos.z - brain.playerPos.z);
        return db - da; // Furthest first
      });
      this.suppressors.add(losEnemies[0].id);
      
      // Assign flank angles
      let flankers = losEnemies.filter(e => e.T.canFlank);
      for (let i = 0; i < flankers.length; i++) {
        // Spread angles evenly: -PI/2, PI/2, -PI/4, PI/4...
        let sign = (i % 2 === 0) ? 1 : -1;
        let mag = (Math.floor(i / 2) + 1) * (Math.PI / 4);
        flankers[i].flankAngle = clamp(sign * mag, -Math.PI, Math.PI);
      }
    }
  }

  isSuppressor(e) {
    return this.suppressors.has(e.id);
  }
}

export class EnemyBrain {
  constructor(mgr) {
    this.mgr = mgr;
    this.profile = new PlayerProfile();
    this.coordinator = new SquadCoordinator(mgr);
    this.disposition = 'neutral';
    this.playerPos = new THREE.Vector3();
    this.learningRate = 0;
    this._hud = null;
    this._lastDisp = 'neutral';
    this._notified = false;
  }

  init(hudRef) {
    this._hud = hudRef;
    const diff = typeof window !== 'undefined' ? (window.currentDifficulty ?? 2) : 2;
    // 0 = Stupid, 1 = Easy, 2 = Hard, 3 = Extreme, 4 = God Mode
    this.learningRate = diff === 0 ? 0.0 : diff === 1 ? 0.05 : diff === 2 ? 0.15 : diff === 3 ? 0.35 : 0.80;

    if (diff === 4) {
      const saved = localStorage.getItem('doodle_brain');
      if (saved) {
        this.profile.load(saved);
        this._updateDisposition();
      }
    }
  }

  saveIfGodMode() {
    const diff = typeof window !== 'undefined' ? (window.currentDifficulty ?? 2) : 2;
    if (diff === 4) {
      localStorage.setItem('doodle_brain', this.profile.save());
    }
  }

  recordShot(weaponKind, hit) {
    if (this.learningRate === 0) return;
    this.profile._shots++;
    if (hit) this.profile._hits++;
    
    // Update accuracy EMA
    let currentAcc = this.profile._hits / this.profile._shots;
    this.profile.accuracy = damp(this.profile.accuracy, currentAcc, this.learningRate, 1.0);

    // Update weapon usage
    let total = 0;
    for (let k in this.profile.weaponUsage) {
      if (k === weaponKind) this.profile.weaponUsage[k] += this.learningRate;
      this.profile.weaponUsage[k] = damp(this.profile.weaponUsage[k], 0, this.learningRate * 0.1, 1.0); // Slight decay
      total += this.profile.weaponUsage[k];
    }
    // Normalize
    for (let k in this.profile.weaponUsage) {
      this.profile.weaponUsage[k] /= (total || 1);
    }
    
    this._updateDisposition();
  }

  recordNade() {
    this.profile.nadesThrown++;
  }

  recordKill(e, info) {
    if (this.learningRate === 0) return;
    const idx = this.profile._heatMapIndex(e.body.pos);
    this.profile.heatMap[idx] += 1.0;
  }

  updateProfile(player, dt) {
    if (!player.alive || this.learningRate === 0) return;
    this.playerPos.copy(player.center);

    // Mobility
    const speed = player.body.vel.length();
    const normalizedSpeed = clamp(speed / 15.0, 0, 1);
    this.profile.mobility = damp(this.profile.mobility, normalizedSpeed, this.learningRate, dt);

    // Verticality
    const isAirborne = !player.body.onGround || player.grapple.state !== 'idle';
    this.profile.verticality = damp(this.profile.verticality, isAirborne ? 1 : 0, this.learningRate, dt);

    // Aggression (moving towards enemies)
    let towards = 0;
    let total = 0;
    for (const e of this.mgr.enemies) {
      if (!e.alive) continue;
      total++;
      const distToEnemy = player.center.distanceTo(e.center);
      const velDir = player.body.vel.clone().normalize();
      const dirToEnemy = e.center.clone().sub(player.center).normalize();
      if (velDir.dot(dirToEnemy) > 0.5 && speed > 2.0) towards++;
    }
    const aggroFactor = total > 0 ? (towards / total) : 0.5;
    this.profile.aggression = damp(this.profile.aggression, aggroFactor, this.learningRate, dt);

    // Dodge bias
    if (speed > 5.0 && player.body.onGround) {
      const rightDot = player.body.vel.clone().normalize().dot(player.right);
      this.profile.dodgeBias = damp(this.profile.dodgeBias, rightDot, this.learningRate, dt);
    }

    // Update player heat map
    const idx = this.profile._heatMapIndex(player.center);
    this.profile.heatMap[idx] = damp(this.profile.heatMap[idx] || 0, 1.0, this.learningRate * 0.1, dt);
    
    // Decay heat map slightly
    for (let i = 0; i < 64; i++) {
        this.profile.heatMap[i] = damp(this.profile.heatMap[i], 0, 0.01, dt);
    }

    this._updateDisposition();
    this.coordinator.update(dt, this);
  }
  
  _updateDisposition() {
    const p = this.profile;
    let disp = 'neutral';
    
    if (p.aggression < 0.25 && p.mobility < 0.3) disp = 'flush';
    else if (p.aggression > 0.75 && p.mobility > 0.7) disp = 'ambush';
    else if (p.verticality > 0.6) disp = 'anti-air';
    else if (p.weaponUsage.sniper > 0.4) disp = 'gap-close';
    else if (p.weaponUsage.shotgun > 0.4) disp = 'kite';
    else if (p.weaponUsage.katana > 0.4) disp = 'spacing';

    this.disposition = disp;

    if (this._hud && disp !== this._lastDisp && this.learningRate > 0) {
      if (disp !== 'neutral') {
        const msg = {
          'flush': 'ENEMIES ADAPTING: FLUSHING CAMPER',
          'ambush': 'ENEMIES ADAPTING: PREPARING AMBUSHES',
          'anti-air': 'ENEMIES ADAPTING: ANTI-AIR FOCUS',
          'gap-close': 'ENEMIES ADAPTING: CLOSING DISTANCE',
          'kite': 'ENEMIES ADAPTING: MAINTAINING RANGE',
          'spacing': 'ENEMIES ADAPTING: AVOIDING MELEE'
        }[disp];
        if (msg) this._hud.tip(msg, 3);
      }
      this._lastDisp = disp;
    }
  }

  consult(e, dist, los) {
    const p = this.profile;
    const diff = typeof window !== 'undefined' ? (window.currentDifficulty ?? 2) : 2;
    
    let keepMulBias = 1.0;
    let strafeDirOverride = null;
    let dodgeChanceMul = 1.0;
    let suppress = false;

    // Apply disposition biases
    if (this.disposition === 'flush') {
      keepMulBias = 0.4;
      strafeDirOverride = 0; // Push straight in
      dodgeChanceMul = 0.5;
    } else if (this.disposition === 'ambush') {
      keepMulBias = 1.5;
      dodgeChanceMul = 1.5;
    } else if (this.disposition === 'kite' || this.disposition === 'spacing') {
      keepMulBias = 2.0;
    } else if (this.disposition === 'gap-close') {
      keepMulBias = 0.2;
      dodgeChanceMul = 2.0;
    }

    // Suppressive fire
    if (diff >= 3 && this.coordinator.isSuppressor(e)) {
      suppress = true;
    }

    // Nades spread
    if (p.nadesThrown > 3) {
      keepMulBias *= 1.3; // Spread out more
    }

    // In God Mode, don't cap the influence
    // In other modes, soft cap it if needed, but user said God mode is unfair.
    // For now, we apply it directly.

    return {
      keepMulBias,
      strafeDirOverride,
      dodgeChanceMul,
      suppress
    };
  }
  
  predictDodge(targetPos, flightTime) {
      if (Math.abs(this.profile.dodgeBias) > 0.3) {
          // Player strongly favors a direction
          // We can't perfectly predict their vector here without their 'right' vector, 
          // but we can bias the lead.
          return this.profile.dodgeBias * 2.0;
      }
      return 0;
  }
}
