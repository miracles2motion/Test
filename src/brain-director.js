// src/brain-director.js
import * as THREE from 'three';
import { clamp } from './util.js';

export const DOCTRINES = {
  FLUSH: 'FLUSH_CAMPER',
  AMBUSH: 'AMBUSH_RUSHER',
  FLAK: 'ANTI-AIR',
  RANGE_LOCK: 'RANGE_ENVELOPE_LOCK',
  NEUTRAL: 'NEUTRAL'
};

export class SquadCoordinator {
  constructor(mgr) {
    this.mgr = mgr;
    this.suppressors = new Set();
    this.interceptors = new Set();
  }

  update(dt, brain) {
    this.suppressors.clear();
    this.interceptors.clear();
    const diff = typeof window !== 'undefined' ? (window.currentDifficulty ?? 2) : 2;
    if (diff < 3) return; // Packs only on Extreme/God Mode

    let losEnemies = [];
    let allEnemies = [];
    for (const e of this.mgr.enemies) {
      if (e.alive && !e.T.boss && !e.T.flying && e.T.role !== 'kamikaze') {
        allEnemies.push(e);
        if (e.los) losEnemies.push(e);
      }
    }

    if (losEnemies.length >= 3) {
      // 1. Suppressor: Furthest back with LOS
      losEnemies.sort((a, b) => {
        const da = Math.hypot(a.body.pos.x - brain.playerPos.x, a.body.pos.z - brain.playerPos.z);
        const db = Math.hypot(b.body.pos.x - brain.playerPos.x, b.body.pos.z - brain.playerPos.z);
        return db - da;
      });
      this.suppressors.add(losEnemies[0].id);
      
      // 2. Interceptor (God Mode): Picks a non-LOS enemy to cut off retreat
      if (diff === 4 && brain.profile && brain.profile.spatialMemory) {
         let candidates = allEnemies.filter(e => !e.los && !this.suppressors.has(e.id));
         if (candidates.length > 0) {
            this.interceptors.add(candidates[0].id);
         }
      }

      // 3. Flankers
      let flankers = losEnemies.filter(e => e.T.canFlank && !this.suppressors.has(e.id));
      for (let i = 0; i < flankers.length; i++) {
        let sign = (i % 2 === 0) ? 1 : -1;
        let mag = (Math.floor(i / 2) + 1) * (Math.PI / 4);
        flankers[i].flankAngle = clamp(sign * mag, -Math.PI, Math.PI);
      }
    }
  }

  isSuppressor(e) { return this.suppressors.has(e.id); }
  isInterceptor(e) { return this.interceptors.has(e.id); }
}

export class BrainDirector {
  constructor(mgr) {
    this.mgr = mgr;
    this.doctrine = DOCTRINES.NEUTRAL;
    this._hud = null;
  }
  
  init(hud) {
    this._hud = hud;
  }

  evaluate(profile, learningRate) {
    if (!profile) return DOCTRINES.NEUTRAL;
    
    let newDoctrine = DOCTRINES.NEUTRAL;
    
    // Evaluate based on AEI v2.0 Profile Structure
    const k = profile.kinematics || {};
    const v = profile.verticality || {};
    const b = profile.ballistics || {};
    
    // Safely fallback to legacy flat format if properties missing
    const agg = k.velocityMean ?? (profile.aggression || 0);
    const stat = k.sprintDecay ?? (1.0 - (profile.mobility || 0));
    const air = v.groundToAirRatio ?? (profile.verticality || 0);
    
    const activeLoadout = b.activeLoadoutProfile || profile.weaponUsage || {};
    const wSnip = activeLoadout.sniper || 0;
    const wCQB = (activeLoadout.shotgun || 0) + (activeLoadout.katana || 0);

    if (agg < 0.25 && stat > 0.7) {
      newDoctrine = DOCTRINES.FLUSH;
    } else if (agg > 0.75 && stat < 0.3) {
      newDoctrine = DOCTRINES.AMBUSH;
    } else if (air > 0.6) {
      newDoctrine = DOCTRINES.FLAK;
    } else if (wSnip > 0.4 || wCQB > 0.4) {
      newDoctrine = DOCTRINES.RANGE_LOCK;
    }

    if (newDoctrine !== this.doctrine && this._hud && learningRate > 0 && newDoctrine !== DOCTRINES.NEUTRAL) {
      this._hud.tip(`[ALERT] >> SWARM SIGNATURE EVOLVING: EXECUTING DOCTRINE [${newDoctrine}]`, 4);
    }
    
    this.doctrine = newDoctrine;
    return this.doctrine;
  }
}
