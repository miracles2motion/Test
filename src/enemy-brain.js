// src/enemy-brain.js
import * as THREE from 'three';
import { clamp, damp } from './util.js';
import { BrainDirector, SquadCoordinator, DOCTRINES } from './brain-director.js';
import { commitBrainState, loadBrainState } from './memory-store.js';

class VolumetricHeatmap {
  constructor(resolution = 64, decayRate = 0.005) {
    this.resolution = resolution;
    this.decayRate = decayRate;
    this.grid = new Float32Array(resolution);
  }
  
  _index(pos) {
    let cx = Math.floor((pos.x + 60) / 15);
    let cz = Math.floor((pos.z + 60) / 15);
    cx = clamp(cx, 0, 7);
    cz = clamp(cz, 0, 7);
    return cz * 8 + cx;
  }

  record(pos, amount = 1.0) {
    const idx = this._index(pos);
    this.grid[idx] += amount;
  }
  
  update(dt, learningRate) {
    for (let i = 0; i < this.resolution; i++) {
        this.grid[i] = damp(this.grid[i], 0, this.decayRate, dt);
    }
  }
  
  get(pos) {
    return this.grid[this._index(pos)];
  }
}

class PlayerProfile {
  constructor() {
    this.kinematics = { velocityMean: 0.0, sprintDecay: 0.0, vectorBias: 0.0 };
    this.verticality = { groundToAirRatio: 0.0, apexHangtime: 0.0, grappleFrequency: 0.0 };
    this.ballistics = { activeLoadoutProfile: { rifle: 0.25, shotgun: 0.25, sniper: 0.25, katana: 0.25 }, dpsOutputWindow: [], preferredRange: 0.0 };
    this.evasion = { leftDodgeBias: 0.5, rightDodgeBias: 0.5, slideRecoveryPacing: 0.0 };
    this.spatialMemory = new VolumetricHeatmap();

    // Internal tracking state
    this._shots = 0;
    this._hits = 0;
    this.nadesThrown = 0;
  }
}

export class EnemyBrain {
  constructor(mgr) {
    this.mgr = mgr;
    this.profile = new PlayerProfile();
    this.director = new BrainDirector(mgr);
    this.coordinator = new SquadCoordinator(mgr);
    this.playerPos = new THREE.Vector3();
    this.learningRate = 0;
    this._hud = null;
  }

  init(hudRef) {
    this._hud = hudRef;
    this.director.init(hudRef);
    const diff = typeof window !== 'undefined' ? (window.currentDifficulty ?? 2) : 2;
    // 0 = Stupid, 1 = Easy, 2 = Hard, 3 = Extreme, 4 = God Mode
    this.learningRate = diff === 0 ? 0.0 : diff === 1 ? 0.05 : diff === 2 ? 0.15 : diff === 3 ? 0.35 : 0.80;

    if (diff === 4) {
      const saved = loadBrainState();
      if (saved) {
        // safely assign saved fields to nested profile
        if (saved.kinematics) this.profile.kinematics = saved.kinematics;
        if (saved.verticality) this.profile.verticality = saved.verticality;
        if (saved.ballistics) this.profile.ballistics = saved.ballistics;
        if (saved.evasion) this.profile.evasion = saved.evasion;
        if (saved.spatialMemory && saved.spatialMemory.grid) {
          for (let i = 0; i < 64; i++) this.profile.spatialMemory.grid[i] = saved.spatialMemory.grid[i];
        } else if (saved.heatMap) { // Legacy fallback
          for (let i = 0; i < 64; i++) this.profile.spatialMemory.grid[i] = saved.heatMap[i];
        }
        
        // Legacy fallback properties mapping to AEI v2.0
        if (saved.aggression !== undefined) this.profile.kinematics.velocityMean = saved.aggression;
        if (saved.mobility !== undefined) this.profile.kinematics.sprintDecay = 1.0 - saved.mobility;
        if (saved.verticality !== undefined && typeof saved.verticality === 'number') this.profile.verticality.groundToAirRatio = saved.verticality;
        if (saved.dodgeBias !== undefined) {
           this.profile.evasion.leftDodgeBias = saved.dodgeBias < 0 ? 0.5 - saved.dodgeBias : 0.5;
           this.profile.evasion.rightDodgeBias = saved.dodgeBias > 0 ? 0.5 + saved.dodgeBias : 0.5;
        }

        this.director.evaluate(this.profile, this.learningRate);
      }
    }
  }

  saveIfGodMode() {
    const diff = typeof window !== 'undefined' ? (window.currentDifficulty ?? 2) : 2;
    if (diff === 4) {
      commitBrainState(this.profile);
    }
  }

  recordShot(weaponKind, hit) {
    if (this.learningRate === 0) return;
    this.profile._shots++;
    if (hit) this.profile._hits++;
    
    // DPS Output window tracker
    const now = performance.now();
    this.profile.ballistics.dpsOutputWindow.push(now);
    // filter older than 2s
    this.profile.ballistics.dpsOutputWindow = this.profile.ballistics.dpsOutputWindow.filter(t => now - t < 2000);
    
    let total = 0;
    const usage = this.profile.ballistics.activeLoadoutProfile;
    for (let k in usage) {
      if (k === weaponKind) usage[k] += this.learningRate;
      usage[k] = damp(usage[k], 0, this.learningRate * 0.1, 1.0);
      total += usage[k];
    }
    for (let k in usage) {
      usage[k] /= (total || 1);
    }
    
    this.director.evaluate(this.profile, this.learningRate);
  }

  recordNade() {
    this.profile.nadesThrown++;
  }

  recordKill(e, info) {
    if (this.learningRate === 0) return;
    this.profile.spatialMemory.record(e.body.pos, 1.0);
  }

  updateProfile(player, dt) {
    if (!player.alive || this.learningRate === 0) return;
    this.playerPos.copy(player.center);

    const speed = player.body.vel.length();
    const normalizedSpeed = clamp(speed / 15.0, 0, 1);
    
    // Kinematics updates
    this.profile.kinematics.velocityMean = damp(this.profile.kinematics.velocityMean, normalizedSpeed, this.learningRate, dt);
    
    let towards = 0, total = 0;
    for (const e of this.mgr.enemies) {
      if (!e.alive) continue;
      total++;
      const velDir = player.body.vel.clone().normalize();
      const dirToEnemy = e.center.clone().sub(player.center).normalize();
      if (velDir.dot(dirToEnemy) > 0.5 && speed > 2.0) towards++;
    }
    const aggroFactor = total > 0 ? (towards / total) : 0.5;
    this.profile.kinematics.vectorBias = damp(this.profile.kinematics.vectorBias, aggroFactor, this.learningRate, dt);

    // Verticality updates
    const isAirborne = !player.body.onGround || player.grapple.state !== 'idle';
    this.profile.verticality.groundToAirRatio = damp(this.profile.verticality.groundToAirRatio, isAirborne ? 1 : 0, this.learningRate, dt);
    
    if (player.grapple.state === 'on' || player.grapple.state === 'fly') {
      this.profile.verticality.grappleFrequency = damp(this.profile.verticality.grappleFrequency, 1.0, this.learningRate, dt);
    } else {
      this.profile.verticality.grappleFrequency = damp(this.profile.verticality.grappleFrequency, 0.0, this.learningRate * 0.1, dt);
    }
    
    if (isAirborne && player.body.vel.y > -2 && player.body.vel.y < 2) {
      this.profile.verticality.apexHangtime = damp(this.profile.verticality.apexHangtime, 1.0, this.learningRate, dt);
    } else {
      this.profile.verticality.apexHangtime = damp(this.profile.verticality.apexHangtime, 0.0, this.learningRate, dt);
    }

    // Evasion updates
    if (speed > 5.0 && player.body.onGround) {
      const rightDot = player.body.vel.clone().normalize().dot(player.right);
      if (rightDot > 0) {
        this.profile.evasion.rightDodgeBias = damp(this.profile.evasion.rightDodgeBias, rightDot, this.learningRate, dt);
      } else {
        this.profile.evasion.leftDodgeBias = damp(this.profile.evasion.leftDodgeBias, -rightDot, this.learningRate, dt);
      }
    }

    // Spatial Memory
    this.profile.spatialMemory.record(player.center, dt * this.learningRate * 0.1);
    this.profile.spatialMemory.update(dt, this.learningRate);

    this.director.evaluate(this.profile, this.learningRate);
    this.coordinator.update(dt, this);
  }

  consult(e, dist, los) {
    const diff = typeof window !== 'undefined' ? (window.currentDifficulty ?? 2) : 2;
    
    let keepMulBias = 1.0;
    let strafeDirOverride = null;
    let dodgeChanceMul = 1.0;
    let suppress = false;
    
    const doc = this.director.doctrine;

    if (doc === DOCTRINES.FLUSH) {
      keepMulBias = 0.4;
      strafeDirOverride = 0; // Push straight in
      dodgeChanceMul = 0.5;
    } else if (doc === DOCTRINES.AMBUSH) {
      keepMulBias = 1.5;
      dodgeChanceMul = 1.5;
    } else if (doc === DOCTRINES.RANGE_LOCK) {
      keepMulBias = 0.2;
      dodgeChanceMul = 2.0;
    } else if (doc === DOCTRINES.FLAK) {
       // Anti-air, logic heavily handled in predictive aim _fireOne
       keepMulBias = 1.2;
    }

    if (diff >= 3 && this.coordinator.isSuppressor(e)) {
      suppress = true;
    }
    
    let interceptor = false;
    if (diff === 4 && this.coordinator.isInterceptor(e)) {
      interceptor = true;
    }

    if (this.profile.nadesThrown > 3) {
      keepMulBias *= 1.3;
    }

    return {
      keepMulBias,
      strafeDirOverride,
      dodgeChanceMul,
      suppress,
      interceptor,
      doctrine: doc
    };
  }
  
  predictDodge(targetPos, flightTime) {
      const left = this.profile.evasion.leftDodgeBias;
      const right = this.profile.evasion.rightDodgeBias;
      if (left > 0.7 || right > 0.7) {
          return right > left ? 1.0 : -1.0;
      }
      return 0;
  }
}
