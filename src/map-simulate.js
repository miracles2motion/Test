#!/usr/bin/env node
/**
 * Doodle Strike - Map Navigation, Flow Simulator & Quality Scorer (God Mode)
 *
 * Programmatically simulates bot traversal, raycasts, vantage line-of-sights,
 * spawn camp risks, jump-point reachability, quadrant density balance,
 * fire-lane coverage, vertical tier coverage, and cover distribution.
 *
 * Returns a weighted 0-100 quality score instead of just pass/fail.
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetArg = (process.argv[2] || 'all').toLowerCase();

console.log('🤖 Doodle Strike: Bot Traversal, Flow Simulator & Quality Scorer (God Mode)');
console.log(`Target: [${targetArg.toUpperCase()}]\n`);

/**
 * Simulate and score a map. Returns { passed, score, metrics }.
 */
export function simulateAndScoreMap(mapKey) {
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
    return { passed: false, score: 0, metrics: {}, error: err.message };
  }

  const metrics = {};
  const weights = {
    spawnSafety: 0.15,
    sniperBalance: 0.10,
    grappleChain: 0.10,
    quadrantDensity: 0.15,
    fireLaneCoverage: 0.15,
    verticalCoverage: 0.10,
    coverDistribution: 0.10,
    pickupSpread: 0.05,
    colliderDensity: 0.10
  };

  // ============================================================
  // METRIC 1: Spawn Safety (15%)
  // ============================================================
  const spawns = levelObj.spawns || [];
  let spawnScore = 100;

  if (spawns.length < 4) {
    spawnScore = Math.max(0, (spawns.length / 4) * 60);
  }

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
  if (spawns.length > 0 && ungroundedSpawns > 0) {
    spawnScore -= (ungroundedSpawns / spawns.length) * 40;
  }
  metrics.spawnSafety = { score: Math.max(0, Math.round(spawnScore)), spawns: spawns.length, ungrounded: ungroundedSpawns };
  console.log(`  ${spawnScore >= 80 ? '✓' : '✗'} Spawn Safety: ${metrics.spawnSafety.score}/100 (${spawns.length} spawns, ${ungroundedSpawns} ungrounded)`);

  // ============================================================
  // METRIC 2: Sniper Balance (10%)
  // ============================================================
  const snipers = levelObj.snipers || [];
  let sniperScore = 100;

  if (snipers.length < 2) {
    sniperScore = Math.max(0, (snipers.length / 2) * 50);
  }

  let campProneSnipers = 0;
  for (const sn of snipers) {
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
    if (openAngles < 3) campProneSnipers++;
  }
  if (snipers.length > 0 && campProneSnipers > 0) {
    sniperScore -= (campProneSnipers / snipers.length) * 40;
  }
  metrics.sniperBalance = { score: Math.max(0, Math.round(sniperScore)), snipers: snipers.length, campProne: campProneSnipers };
  console.log(`  ${sniperScore >= 80 ? '✓' : '✗'} Sniper Balance: ${metrics.sniperBalance.score}/100 (${snipers.length} vantages, ${campProneSnipers} camp-prone)`);

  // ============================================================
  // METRIC 3: Grapple Chain Mobility (10%)
  // ============================================================
  const rings = levelObj.rings || [];
  let grappleScore = 100;

  if (rings.length < 4) {
    grappleScore = Math.max(0, (rings.length / 4) * 50);
  }

  let isolatedRings = 0;
  for (let i = 0; i < rings.length; i++) {
    const r1 = rings[i];
    let hasNearby = false;
    for (let j = 0; j < rings.length; j++) {
      if (i === j) continue;
      const dist = r1.distanceTo(rings[j]);
      if (dist <= 35.0) { hasNearby = true; break; }
    }
    if (!hasNearby && rings.length > 1) isolatedRings++;
  }
  if (rings.length > 0 && isolatedRings > 0) {
    grappleScore -= (isolatedRings / rings.length) * 50;
  }
  metrics.grappleChain = { score: Math.max(0, Math.round(grappleScore)), rings: rings.length, isolated: isolatedRings };
  console.log(`  ${grappleScore >= 80 ? '✓' : '✗'} Grapple Chain: ${metrics.grappleChain.score}/100 (${rings.length} rings, ${isolatedRings} isolated)`);

  // ============================================================
  // METRIC 4: Quadrant Density Balance (15%)
  // ============================================================
  const bounds = levelObj.bounds || { minX: -50, maxX: 50, minZ: -50, maxZ: 50 };
  const midX = (bounds.minX + bounds.maxX) / 2;
  const midZ = (bounds.minZ + bounds.maxZ) / 2;

  const quadCounts = { NW: 0, NE: 0, SW: 0, SE: 0 };
  const solidColliders = colliders.filter(c => !(c.opts && (c.opts.noCollide || c.opts.noNav)));
  for (const c of solidColliders) {
    const cx = (c.min.x + c.max.x) / 2;
    const cz = (c.min.z + c.max.z) / 2;
    if (cx <= midX && cz <= midZ) quadCounts.NW++;
    else if (cx > midX && cz <= midZ) quadCounts.NE++;
    else if (cx <= midX && cz > midZ) quadCounts.SW++;
    else quadCounts.SE++;
  }

  const quadValues = Object.values(quadCounts);
  const quadMax = Math.max(...quadValues, 1);
  const quadMin = Math.min(...quadValues);
  const emptyQuadrants = quadValues.filter(v => v < 5).length;

  let quadScore = 100;
  // Penalize imbalance
  const ratio = quadMin / quadMax;
  quadScore = Math.round(ratio * 80 + 20);
  // Heavy penalty for empty quadrants
  if (emptyQuadrants > 0) quadScore -= emptyQuadrants * 20;

  metrics.quadrantDensity = { score: Math.max(0, Math.min(100, quadScore)), counts: quadCounts, emptyQuadrants };
  console.log(`  ${quadScore >= 70 ? '✓' : '✗'} Quadrant Density: ${metrics.quadrantDensity.score}/100 (NW:${quadCounts.NW} NE:${quadCounts.NE} SW:${quadCounts.SW} SE:${quadCounts.SE})`);

  // ============================================================
  // METRIC 5: Fire Lane Coverage (15%)
  // ============================================================
  const sightSources = [...spawns, ...snipers];
  const gridSize = 8;
  let coveredCells = 0;
  let totalCells = 0;

  for (let x = bounds.minX + 10; x < bounds.maxX - 10; x += gridSize) {
    for (let z = bounds.minZ + 10; z < bounds.maxZ - 10; z += gridSize) {
      totalCells++;
      let linesOfSight = 0;
      for (const src of sightSources) {
        const dx = x - src.x, dz = z - src.z;
        const dist = Math.hypot(dx, dz);
        if (dist > 50 || dist < 2) continue;

        let blocked = false;
        const ndx = dx / dist, ndz = dz / dist;
        for (let d = 2; d < dist; d += 2) {
          const tx = src.x + ndx * d;
          const ty = src.y + 1.0;
          const tz = src.z + ndz * d;
          for (const col of solidColliders) {
            if (col.opts && col.opts.noCollide) continue;
            if (tx >= col.min.x && tx <= col.max.x && ty >= col.min.y && ty <= col.max.y && tz >= col.min.z && tz <= col.max.z) {
              blocked = true; break;
            }
          }
          if (blocked) break;
        }
        if (!blocked) linesOfSight++;
        if (linesOfSight >= 2) break;
      }
      if (linesOfSight >= 2) coveredCells++;
    }
  }

  const fireLaneRatio = totalCells > 0 ? coveredCells / totalCells : 0;
  const fireLaneScore = Math.min(100, Math.round(fireLaneRatio * 120)); // 83% coverage = 100 score
  metrics.fireLaneCoverage = { score: Math.max(0, fireLaneScore), covered: coveredCells, total: totalCells, percentage: Math.round(fireLaneRatio * 100) };
  console.log(`  ${fireLaneScore >= 70 ? '✓' : '✗'} Fire Lane Coverage: ${metrics.fireLaneCoverage.score}/100 (${metrics.fireLaneCoverage.percentage}% floor covered by ≥2 sightlines)`);

  // ============================================================
  // METRIC 6: Vertical Coverage (10%)
  // ============================================================
  const tiers = [
    { name: 'Ground (Y<3)', min: -1, max: 3 },
    { name: 'Mid (Y=3-8)', min: 3, max: 8 },
    { name: 'Upper (Y>8)', min: 8, max: 30 }
  ];
  let tiersWithGeometry = 0;
  for (const tier of tiers) {
    const geoInTier = solidColliders.filter(c => c.max.y > tier.min && c.min.y < tier.max);
    if (geoInTier.length >= 3) tiersWithGeometry++;
  }
  const verticalScore = Math.round((tiersWithGeometry / tiers.length) * 100);
  metrics.verticalCoverage = { score: verticalScore, tiersPopulated: tiersWithGeometry, totalTiers: tiers.length };
  console.log(`  ${verticalScore >= 70 ? '✓' : '✗'} Vertical Coverage: ${metrics.verticalCoverage.score}/100 (${tiersWithGeometry}/${tiers.length} tiers populated)`);

  // ============================================================
  // METRIC 7: Cover Distribution (10%)
  // ============================================================
  const coverBlocks = solidColliders.filter(c => {
    const h = c.size.y;
    return h >= 0.8 && h <= 1.3;
  });
  const coverPerQuad = { NW: 0, NE: 0, SW: 0, SE: 0 };
  for (const c of coverBlocks) {
    const cx = (c.min.x + c.max.x) / 2;
    const cz = (c.min.z + c.max.z) / 2;
    if (cx <= midX && cz <= midZ) coverPerQuad.NW++;
    else if (cx > midX && cz <= midZ) coverPerQuad.NE++;
    else if (cx <= midX && cz > midZ) coverPerQuad.SW++;
    else coverPerQuad.SE++;
  }
  const coverValues = Object.values(coverPerQuad);
  const quadsWithCover = coverValues.filter(v => v >= 1).length;
  let coverScore = Math.round((quadsWithCover / 4) * 70 + (coverBlocks.length >= 8 ? 30 : (coverBlocks.length / 8) * 30));
  metrics.coverDistribution = { score: Math.max(0, Math.min(100, coverScore)), total: coverBlocks.length, perQuad: coverPerQuad };
  console.log(`  ${coverScore >= 70 ? '✓' : '✗'} Cover Distribution: ${metrics.coverDistribution.score}/100 (${coverBlocks.length} waist-high blocks across ${quadsWithCover}/4 quadrants)`);

  // ============================================================
  // METRIC 8: Pickup Spread (5%)
  // ============================================================
  const pickups = levelObj.pickups || [];
  let pickupScore = 100;
  if (pickups.length < 4) {
    pickupScore = Math.max(0, Math.round((pickups.length / 4) * 60));
  }
  const pickupsPerQuad = { NW: 0, NE: 0, SW: 0, SE: 0 };
  for (const p of pickups) {
    if (p.x <= midX && p.z <= midZ) pickupsPerQuad.NW++;
    else if (p.x > midX && p.z <= midZ) pickupsPerQuad.NE++;
    else if (p.x <= midX && p.z > midZ) pickupsPerQuad.SW++;
    else pickupsPerQuad.SE++;
  }
  const pickupQuadsCovered = Object.values(pickupsPerQuad).filter(v => v >= 1).length;
  if (pickupQuadsCovered < 3 && pickups.length >= 4) pickupScore -= 20;
  metrics.pickupSpread = { score: Math.max(0, Math.round(pickupScore)), count: pickups.length, perQuad: pickupsPerQuad };
  console.log(`  ${pickupScore >= 70 ? '✓' : '✗'} Pickup Spread: ${metrics.pickupSpread.score}/100 (${pickups.length} pickups, ${pickupQuadsCovered}/4 quadrants)`);

  // ============================================================
  // METRIC 9: Collider Density (10%)
  // ============================================================
  const minTarget = 150;
  const densityScore = Math.min(100, Math.round((solidColliders.length / minTarget) * 100));
  metrics.colliderDensity = { score: densityScore, count: solidColliders.length, target: minTarget };
  console.log(`  ${densityScore >= 80 ? '✓' : '✗'} Collider Density: ${metrics.colliderDensity.score}/100 (${solidColliders.length}/${minTarget} colliders)`);

  // ============================================================
  // CALCULATE WEIGHTED TOTAL SCORE
  // ============================================================
  let totalScore = 0;
  totalScore += (metrics.spawnSafety.score * weights.spawnSafety);
  totalScore += (metrics.sniperBalance.score * weights.sniperBalance);
  totalScore += (metrics.grappleChain.score * weights.grappleChain);
  totalScore += (metrics.quadrantDensity.score * weights.quadrantDensity);
  totalScore += (metrics.fireLaneCoverage.score * weights.fireLaneCoverage);
  totalScore += (metrics.verticalCoverage.score * weights.verticalCoverage);
  totalScore += (metrics.coverDistribution.score * weights.coverDistribution);
  totalScore += (metrics.pickupSpread.score * weights.pickupSpread);
  totalScore += (metrics.colliderDensity.score * weights.colliderDensity);
  totalScore = Math.round(totalScore);

  const passed = totalScore >= 75;
  const grade = totalScore >= 90 ? 'S' : totalScore >= 80 ? 'A' : totalScore >= 70 ? 'B' : totalScore >= 60 ? 'C' : totalScore >= 50 ? 'D' : 'F';

  console.log(`\n╔══════════════════════════════════════╗`);
  console.log(`║  QUALITY SCORE: ${totalScore}/100  [GRADE: ${grade}]  ${passed ? '✅ PASS' : '❌ FAIL'}  ║`);
  console.log(`╚══════════════════════════════════════╝\n`);

  return { passed, score: totalScore, grade, metrics };
}

// Backward-compatible wrapper
function simulateMap(mapKey) {
  const result = simulateAndScoreMap(mapKey);
  return result.passed;
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
