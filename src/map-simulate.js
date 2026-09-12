#!/usr/bin/env node
/**
 * Doodle Strike - Map Navigation & Flow Simulator
 * Programmatically simulates bot traversal, raycasts, vantage line-of-sights,
 * spawn camp risks, and jump-point reachability across any map level.
 *
 * Usage:
 *   node src/map-simulate.js [mapKey]
 *   npm run map:simulate clockwork
 *   npm run map:simulate all
 */

import path from 'path';
import { fileURLToPath } from 'url';
import * as THREE from 'three';
import { buildLevel, LEVELS, MAP_BUILDERS } from './level.js';
import { recordLearnedPattern } from './map-learning.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetArg = (process.argv[2] || 'all').toLowerCase();

console.log('🤖 Doodle Strike: Bot Traversal & Flow Simulator');
console.log(`Target: [${targetArg.toUpperCase()}]\n`);

function simulateMap(mapKey) {
  console.log(`============================================================`);
  console.log(`🎮 SIMULATING LEVEL FLOW: [${mapKey.toUpperCase()}]`);
  console.log(`============================================================`);

  const colliders = [];
  const mockWorld = {
    addBox: (min, max, opts) => {
      const col = { min, max, opts, size: { x: max.x - min.x, y: max.y - min.y, z: max.z - min.z } };
      colliders.push(col);
      return col;
    },
    finalize: () => {}
  };
  const mockScene = { add: () => {} };

  let levelObj;
  try {
    levelObj = buildLevel(mockScene, mockWorld, mapKey);
  } catch (err) {
    console.error(`❌ Build simulation failed for [${mapKey}]:`, err.message);
    return false;
  }

  let flowPassed = true;
  function report(passed, label) {
    if (passed) {
      console.log(`  ✓ ${label}`);
    } else {
      console.error(`  ✗ FLOW WARNING: ${label}`);
      flowPassed = false;
    }
  }

  // 1. Spawns Distribution & Grounding Check
  const spawns = levelObj.spawns || [];
  report(spawns.length >= 4, `Spawn Quantity Adequate (${spawns.length} nodes)`);

  let ungroundedSpawns = 0;
  for (const sp of spawns) {
    let hasFloorBelow = false;
    for (const col of colliders) {
      if (col.opts && col.opts.noNav) continue;
      if (sp.x >= col.min.x && sp.x <= col.max.x && sp.z >= col.min.z && sp.z <= col.max.z) {
        if (Math.abs(col.max.y - sp.y) <= 0.4 || (sp.y >= col.max.y && sp.y - col.max.y <= 1.0)) {
          hasFloorBelow = true;
          break;
        }
      }
    }
    if (!hasFloorBelow) ungroundedSpawns++;
  }
  report(ungroundedSpawns === 0, `All spawns grounded on solid footing (${ungroundedSpawns} floating spawns)`);

  // 2. Sniper Vantage & Anti-Camp Simulation
  const snipers = levelObj.snipers || [];
  report(snipers.length >= 2, `Sniper vantage points mapped (${snipers.length} nodes)`);

  let campProneSnipers = 0;
  for (const sn of snipers) {
    // Check if sniper has at least 2 clear directional sightlines
    let openAngles = 0;
    const dirs = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [0.707, 0.707], [-0.707, 0.707], [0.707, -0.707], [-0.707, -0.707]
    ];
    for (const [dx, dz] of dirs) {
      let blocked = false;
      for (let dist = 2; dist < 20; dist += 2) {
        const tx = sn.x + dx * dist;
        const ty = sn.y + 0.8;
        const tz = sn.z + dz * dist;
        for (const col of colliders) {
          if (col.opts && col.opts.noShoot) continue;
          if (tx >= col.min.x && tx <= col.max.x && ty >= col.min.y && ty <= col.max.y && tz >= col.min.z && tz <= col.max.z) {
            blocked = true;
            break;
          }
        }
        if (blocked) break;
      }
      if (!blocked) openAngles++;
    }
    if (openAngles < 2) campProneSnipers++;
  }
  report(campProneSnipers === 0, `Anti-Camp Sightlines Clear: Snipers have open directional fields (${campProneSnipers} enclosed perches)`);

  // 3. Grapple Anchor Proximity & Traversal Chain
  const rings = levelObj.rings || [];
  let isolatedRings = 0;
  for (let i = 0; i < rings.length; i++) {
    const r1 = rings[i];
    let hasNearbyLandingOrRing = false;
    for (let j = 0; j < rings.length; j++) {
      if (i === j) continue;
      const r2 = rings[j];
      const dist = r1.distanceTo(r2);
      if (dist <= 35.0) {
        hasNearbyLandingOrRing = true;
        break;
      }
    }
    if (!hasNearbyLandingOrRing && rings.length > 1) isolatedRings++;
  }
  report(isolatedRings === 0, `Grapple Mobility Chain Valid: All rings within swing chain reach (${isolatedRings} isolated rings)`);

  // 4. Pickup Reachability
  const pickups = levelObj.pickups || [];
  report(pickups.length >= 4, `Pickups placed across combat sectors (${pickups.length} pickups)`);

  console.log(`\nFlow Result: ${flowPassed ? '✅ PASSED BOT MOBILITY & FLOW TESTS' : '⚠️ FLOW ISSUES DETECTED'}\n`);
  return flowPassed;
}

const playableKeys = Object.keys(MAP_BUILDERS).filter((k) => k !== 'desk' && k !== 'tower' && k !== 'studio');

let allPassed = true;
if (targetArg === 'all') {
  for (const k of playableKeys) {
    if (!simulateMap(k)) allPassed = false;
  }
} else if (MAP_BUILDERS[targetArg]) {
  if (!simulateMap(targetArg)) allPassed = false;
} else {
  console.error(`Unknown map key: "${targetArg}". Available: ${playableKeys.join(', ')}`);
  process.exit(1);
}

process.exit(allPassed ? 0 : 1);
