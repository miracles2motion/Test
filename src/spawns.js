import * as THREE from 'three';
import { INK } from './render.js';

/**
 * Intelligent spawn point allocator with anti-spawn-camping and sightline safety scoring.
 * Evaluates candidates against active hostile positions, line of sight, and team clusters.
 */
export class SpawnManager {
  constructor(options = {}) {
    this.minSafeDist = options.minSafeDist ?? 12.0;
    this.optimalDist = options.optimalDist ?? 28.0;
    this.maxSafeDist = options.maxSafeDist ?? 65.0;
    this.losWeight = options.losWeight ?? 50.0;
    this.distWeight = options.distWeight ?? 2.0;
    this.teamWeight = options.teamWeight ?? 1.5;
  }

  /**
   * Scores a single spawn point against an array of threats.
   * Higher score = safer, more tactical spawn.
   * 
   * @param {THREE.Vector3} spot - Candidate spawn position
   * @param {Array<{pos: THREE.Vector3, eye?: THREE.Vector3, team?: number}>} threats - Active enemy/player threats
   * @param {Object} world - Physics / collision world (for hasLineOfSight)
   * @param {number} [friendlyTeam] - Friendly team ID (0 or 1) for team-based spawning
   * @returns {number} Score
   */
  scoreSpawn(spot, threats = [], world = null, friendlyTeam = null) {
    if (!threats || threats.length === 0) return 100.0;

    let minThreatDist = 9999;
    let totalHostileDist = 0;
    let hostileCount = 0;
    let visibleHostileCount = 0;
    let friendlyClusterDist = 0;
    let friendlyCount = 0;

    const spotHead = new THREE.Vector3(spot.x, spot.y + 1.6, spot.z);

    for (const t of threats) {
      const tPos = t.pos || t;
      const d = spot.distanceTo(tPos);
      const isHostile = friendlyTeam == null || t.team == null || t.team !== friendlyTeam;

      if (isHostile) {
        hostileCount++;
        totalHostileDist += d;
        if (d < minThreatDist) minThreatDist = d;

        // Line-of-sight check against threat's eye position
        if (world && typeof world.hasLineOfSight === 'function') {
          const eye = t.eye || new THREE.Vector3(tPos.x, tPos.y + 1.6, tPos.z);
          if (world.hasLineOfSight(eye, spotHead)) {
            visibleHostileCount++;
          }
        }
      } else {
        friendlyCount++;
        friendlyClusterDist += d;
      }
    }

    // Immediate severe penalty for being inside the danger zone (< minSafeDist)
    if (minThreatDist < this.minSafeDist) {
      return -500.0 + minThreatDist * 10;
    }

    // Distance scoring: Gaussian-like peak around optimal distance
    const avgHostileDist = hostileCount > 0 ? totalHostileDist / hostileCount : this.optimalDist;
    const distDeviation = Math.abs(avgHostileDist - this.optimalDist);
    let score = 100.0 - distDeviation * this.distWeight;

    // Line of sight penalty (spawn-camping avoidance)
    score -= visibleHostileCount * this.losWeight;

    // Friendly team cohesion bonus (spawn near teammates if not under fire)
    if (friendlyCount > 0) {
      const avgFriendDist = friendlyClusterDist / friendlyCount;
      if (avgFriendDist > 10.0 && avgFriendDist < 35.0) {
        score += 15.0;
      }
    }

    return score;
  }

  /**
   * Selects the best candidate spawn point from a list.
   * 
   * @param {Array<THREE.Vector3>} candidates - List of candidate Vector3 positions
   * @param {Array<{pos: THREE.Vector3, eye?: THREE.Vector3, team?: number}>} threats - Active threats
   * @param {Object} world - Physics world
   * @param {number} [friendlyTeam] - Friendly team ID
   * @returns {THREE.Vector3}
   */
  pickBestSpawn(candidates = [], threats = [], world = null, friendlyTeam = null) {
    if (!candidates || candidates.length === 0) {
      return new THREE.Vector3(0, 0, 0);
    }
    if (candidates.length === 1) return candidates[0].clone();

    const scored = candidates.map(spot => ({
      spot,
      score: this.scoreSpawn(spot, threats, world, friendlyTeam)
    }));

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    // Filter to top candidate pool (top 3 or all with positive scores)
    const validPool = scored.filter(s => s.score > 0);
    const pool = validPool.length >= 2 ? validPool.slice(0, 3) : scored.slice(0, Math.min(3, scored.length));

    // Random choice among top candidates to prevent predictable spawn-trapping loops
    const pick = pool[Math.floor(Math.random() * pool.length)].spot;
    return pick.clone();
  }

  /**
   * Determines if team spawn zones should flip when one team pushes deep into enemy territory.
   * 
   * @param {Array<THREE.Vector3>} team0Spawns - Team 0 spawn zone points
   * @param {Array<THREE.Vector3>} team1Spawns - Team 1 spawn zone points
   * @param {Array<{pos: THREE.Vector3, team: number}>} players - All active players
   * @returns {{flipped: boolean, team0Active: Array<THREE.Vector3>, team1Active: Array<THREE.Vector3>}}
   */
  evaluateSpawnFlip(team0Spawns, team1Spawns, players = []) {
    if (!team0Spawns || !team1Spawns || !team0Spawns.length || !team1Spawns.length) {
      return { flipped: false, team0Active: team0Spawns || [], team1Active: team1Spawns || [] };
    }

    const t0Center = this._calcCenter(team0Spawns);
    const t1Center = this._calcCenter(team1Spawns);

    // Check how many Team 1 players are deep in Team 0 territory
    let t1InT0Base = 0;
    let t0InT1Base = 0;

    for (const p of players) {
      if (!p || !p.pos) continue;
      const d0 = p.pos.distanceTo(t0Center);
      const d1 = p.pos.distanceTo(t1Center);
      if (p.team === 1 && d0 < 20.0) t1InT0Base++;
      if (p.team === 0 && d1 < 20.0) t0InT1Base++;
    }

    // If Team 1 is spawn-camping Team 0's base, flip spawns
    const shouldFlip = t1InT0Base >= 2 || (t1InT0Base > 0 && t0InT1Base === 0 && t1InT0Base >= players.filter(pl => pl.team === 1).length * 0.5);

    return {
      flipped: shouldFlip,
      team0Active: shouldFlip ? team1Spawns : team0Spawns,
      team1Active: shouldFlip ? team0Spawns : team1Spawns
    };
  }

  _calcCenter(points) {
    const sum = new THREE.Vector3(0, 0, 0);
    for (const p of points) sum.add(p);
    return sum.multiplyScalar(1 / Math.max(1, points.length));
  }
}

export const spawnManager = new SpawnManager();
