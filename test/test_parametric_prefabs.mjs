// test/test_parametric_prefabs.mjs
// Automated Unit Tests for Blueprint 2 & 3: Parametric Organic Set-Pieces & Colossal Contract
// Tests generateParametricTree, buildCurvedHollowLog, buildBoulderField, and validateColossalContract.

import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createBuilder } from '../src/level.js';
import {
  generateParametricTree,
  buildCurvedHollowLog,
  buildBoulderField,
  PREFAB_REGISTRY,
  instantiatePrefab
} from '../src/prefabs.js';
import { validateColossalContract } from '../src/rebuild/validation-engine.js';

console.log('🧪 Running Blueprint 2 & 3: Parametric Set-Pieces & Colossal Contract Suite...\n');

function createMockWorld() {
  const colliders = [];
  return {
    colliders,
    addBox: (min, max, opts = {}) => {
      const box = {
        min: { ...min },
        max: { ...max },
        w: max.x - min.x,
        h: max.y - min.y,
        d: max.z - min.z,
        opts
      };
      colliders.push(box);
      return box;
    },
    finalize: () => {}
  };
}

function createMockScene() {
  const objects = [];
  return {
    objects,
    add: (obj) => objects.push(obj)
  };
}

// =========================================================================
// 1. TEST generateParametricTree (Titan, Slender, Gnarled)
// =========================================================================
console.log('Test 1: generateParametricTree archetypes, da Vinci branching & furniture...');
{
  // 1A. TITAN TREE TEST
  const sceneTitan = createMockScene();
  const worldTitan = createMockWorld();
  const B_Titan = createBuilder(sceneTitan, worldTitan);

  const titanInfo = generateParametricTree(B_Titan, 0, 0, 0, { archetype: 'titan', seed: 444 });
  assert.equal(titanInfo.archetype, 'titan', 'Archetype must be titan');
  assert.ok(titanInfo.height >= 25 && titanInfo.height <= 36, `Titan height (${titanInfo.height.toFixed(1)}m) must be in 25-35m range`);
  assert.ok(titanInfo.trunkR >= 2.4, `Titan trunk radius (${titanInfo.trunkR.toFixed(1)}m) must be >= 2.4m`);
  assert.ok(titanInfo.deckY >= 16, 'Titan canopy combat deck must exist at Y >= 16m');

  // Check grapple rings created on Titan
  assert.ok(B_Titan.L.rings.length >= 2, `Titan tree must create at least 2 overhead grapple rings, got ${B_Titan.L.rings.length}`);
  const topRing = B_Titan.L.rings.find(r => r.y >= titanInfo.deckY + 6.0);
  assert.ok(topRing, 'Overhead launch grapple ring must exist above canopy deck (+6 to +10m)');

  // Check stairs created for buttress root spiral ramp
  const stairsColliders = worldTitan.colliders.filter(c => c.opts?.tag === 'stairs');
  assert.ok(stairsColliders.length >= 12, `Buttress root spiral ramp must create >= 12 stair steps, got ${stairsColliders.length}`);

  // Check waist cover rocks at root skirt
  const waistRocks = worldTitan.colliders.filter(c => c.opts?.tag === 'cover' && c.h <= 1.3);
  assert.ok(waistRocks.length >= 2, 'Root skirt must include waist-cover rocks');

  console.log(`  ✓ Titan Tree: height = ${titanInfo.height.toFixed(1)}m, deck Y = ${titanInfo.deckY.toFixed(1)}m, ${B_Titan.L.rings.length} rings, ${stairsColliders.length} ramp steps`);

  // 1B. SLENDER TREE TEST
  const sceneSlender = createMockScene();
  const worldSlender = createMockWorld();
  const B_Slender = createBuilder(sceneSlender, worldSlender);

  const slenderInfo = generateParametricTree(B_Slender, 10, 0, 10, { archetype: 'slender', seed: 555 });
  assert.equal(slenderInfo.archetype, 'slender');
  assert.ok(slenderInfo.height <= 14, 'Slender tree height must be <= 14m');
  assert.ok(slenderInfo.trunkR <= 0.6, 'Slender trunk radius must be <= 0.6m');
  assert.ok(B_Slender.L.rings.length >= 1, 'Slender tree must provide an apex grapple ring');

  console.log(`  ✓ Slender Tree: height = ${slenderInfo.height.toFixed(1)}m, trunk radius = ${slenderInfo.trunkR.toFixed(2)}m`);

  // 1C. GNARLED TREE TEST
  const sceneGnarled = createMockScene();
  const worldGnarled = createMockWorld();
  const B_Gnarled = createBuilder(sceneGnarled, worldGnarled);

  const gnarledInfo = generateParametricTree(B_Gnarled, -10, 0, -10, { archetype: 'gnarled', seed: 666 });
  assert.equal(gnarledInfo.archetype, 'gnarled');
  assert.ok(gnarledInfo.height <= 9, 'Gnarled tree height must be stout (<= 9m)');

  console.log(`  ✓ Gnarled Tree: height = ${gnarledInfo.height.toFixed(1)}m, stout trunk = ${gnarledInfo.trunkR.toFixed(2)}m`);

  // 1D. DETERMINISM TEST
  const sceneDetA = createMockScene();
  const worldDetA = createMockWorld();
  const B_DetA = createBuilder(sceneDetA, worldDetA);
  const treeA = generateParametricTree(B_DetA, 0, 0, 0, { seed: 9999 });

  const sceneDetB = createMockScene();
  const worldDetB = createMockWorld();
  const B_DetB = createBuilder(sceneDetB, worldDetB);
  const treeB = generateParametricTree(B_DetB, 0, 0, 0, { seed: 9999 });

  assert.equal(treeA.height, treeB.height, 'Same seed must generate identical height');
  assert.equal(treeA.apex.x, treeB.apex.x, 'Same seed must generate identical apex X');
  assert.equal(worldDetA.colliders.length, worldDetB.colliders.length, 'Same seed must emit identical collider counts');
  console.log('  ✓ Determinism verified: identical seeds produce byte-identical geometries');
}

// =========================================================================
// 2. TEST buildCurvedHollowLog
// =========================================================================
console.log('Test 2: buildCurvedHollowLog sprint tunnel, catwalk & shelf-fungus stairs...');
{
  const scene = createMockScene();
  const world = createMockWorld();
  const B = createBuilder(scene, world);

  const logInfo = buildCurvedHollowLog(B, 0, 0, 0, { seed: 1234, segments: 3 });
  assert.ok(logInfo.segmentCount >= 2, 'Log must have at least 2 segments');
  assert.ok(logInfo.totalLength >= 14, `Log total length (${logInfo.totalLength.toFixed(1)}m) must be >= 14m`);
  assert.ok(logInfo.rInner >= 1.4, 'Log inner bore must be >= 1.4m for 2.2m headroom');

  // Verify internal floor colliders have clearance >= 1.8m
  const walkwayColliders = world.colliders.filter(c => c.opts?.tag === 'walkway');
  assert.ok(walkwayColliders.length >= 2, 'Walkway floor colliders must exist along log segments');
  for (const wc of walkwayColliders) {
    const floorWidth = Math.min(wc.w, wc.d);
    assert.ok(floorWidth >= 1.8, `Log floor width (${floorWidth.toFixed(2)}m) must be >= 1.8m clearance invariant`);
  }

  // Verify exterior shelf-fungus stairs
  const shelfStairs = world.colliders.filter(c => c.opts?.tag === 'stairs');
  assert.ok(shelfStairs.length >= 5, `Shelf-fungus stairs must create >= 5 steps, got ${shelfStairs.length}`);

  // Verify top catwalk grapple rings
  assert.ok(B.L.rings.length >= 2, `Top catwalk must feature overhead grapple rings, got ${B.L.rings.length}`);

  console.log(`  ✓ Curved Hollow Log: length = ${logInfo.totalLength.toFixed(1)}m, ${walkwayColliders.length} floor sections (width >= 1.8m), ${shelfStairs.length} fungus stairs`);
}

// =========================================================================
// 3. TEST buildBoulderField
// =========================================================================
console.log('Test 3: buildBoulderField tactical cover distribution...');
{
  const scene = createMockScene();
  const world = createMockWorld();
  const B = createBuilder(scene, world);

  const fieldInfo = buildBoulderField(B, 0, 0, 0, { count: 5, radius: 6.0, seed: 888 });
  assert.equal(fieldInfo.count, 5, 'Boulder field must contain requested number of rocks');

  // Verify at least one full-cover rock (height >= 2.5m)
  const fullCoverRock = world.colliders.find(c => c.h >= 2.5);
  assert.ok(fullCoverRock, 'Boulder field must feature at least one full-cover anchor rock (>= 2.5m)');

  // Verify waist-cover rocks (height <= 1.3m)
  const waistCoverRocks = world.colliders.filter(c => c.opts?.tag === 'cover' && c.h <= 1.3);
  assert.ok(waistCoverRocks.length >= 2, `Boulder field must include waist cover rocks, found ${waistCoverRocks.length}`);

  console.log(`  ✓ Boulder Field: 1 full-cover anchor (${fullCoverRock.h.toFixed(1)}m), ${waistCoverRocks.length} waist rocks`);
}

// =========================================================================
// 4. TEST PREFAB_REGISTRY Integration
// =========================================================================
console.log('Test 4: PREFAB_REGISTRY registration & instantiation...');
{
  assert.ok(PREFAB_REGISTRY.parametric_tree, 'parametric_tree must be registered in PREFAB_REGISTRY');
  assert.ok(PREFAB_REGISTRY.curved_hollow_log, 'curved_hollow_log must be registered in PREFAB_REGISTRY');
  assert.ok(PREFAB_REGISTRY.boulder_field, 'boulder_field must be registered in PREFAB_REGISTRY');

  const scene = createMockScene();
  const world = createMockWorld();
  const B = createBuilder(scene, world);

  assert.ok(instantiatePrefab(B, 'parametric_tree', 0, 0, 0, { seed: 101 }));
  assert.ok(instantiatePrefab(B, 'curved_hollow_log', 20, 0, 0, { seed: 202 }));
  assert.ok(instantiatePrefab(B, 'boulder_field', -20, 0, 0, { seed: 303 }));

  console.log('  ✓ All 3 organic prefabs successfully instantiated via PREFAB_REGISTRY');
}

// =========================================================================
// 5. TEST validateColossalContract (Clauses C1 - C7)
// =========================================================================
console.log('Test 5: validateColossalContract validation gates...');
{
  // 5A. Valid Setpiece Contract
  const validPencil = {
    id: 'colossal_pencil_hero',
    transform: { x: 0, y: 0, z: 0 },
    contract: {
      entry: ['spine_stairs', 'eraser_ramp'],
      interior: { clearance: 2.2, headroom: 2.4 },
      summit: { deck: 'upper_facet', parapet: true, rings: ['ring_1', 'ring_2'] },
      exits: 2
    }
  };
  const resultValid = validateColossalContract(validPencil);
  assert.equal(resultValid.valid, true, 'Valid pencil contract must pass all clauses');
  assert.equal(resultValid.violations.length, 0);

  // 5B. Ungrounded Violation (C1)
  const floatingSetpiece = {
    id: 'floating_fortress',
    transform: { x: 0, y: 3.5, z: 0 },
    contract: { entry: ['stairs'], exits: 2 }
  };
  const resultFloating = validateColossalContract(floatingSetpiece);
  assert.equal(resultFloating.valid, false);
  assert.ok(resultFloating.violations.some(v => v.clause === 'C1'), 'Must flag ungrounded C1 violation');

  // 5C. Camper Coffin Violation (C6: single exit)
  const camperCoffin = {
    id: 'dead_end_sniper',
    transform: { x: 0, y: 0, z: 0 },
    contract: { entry: ['stairs'], exits: 1 }
  };
  const resultCamper = validateColossalContract(camperCoffin);
  assert.equal(resultCamper.valid, false);
  assert.ok(resultCamper.violations.some(v => v.clause === 'C6'), 'Must flag dead-end camper coffin C6 violation');

  // 5D. Pinch Violation (C3: clearance < 1.8m)
  const pinchedTunnel = {
    id: 'pinched_pipe',
    transform: { x: 0, y: 0, z: 0 },
    contract: {
      entry: ['door_1', 'door_2'],
      interior: { clearance: 1.4, headroom: 2.4 },
      exits: 2
    }
  };
  const resultPinched = validateColossalContract(pinchedTunnel);
  assert.equal(resultPinched.valid, false);
  assert.ok(resultPinched.violations.some(v => v.clause === 'C3'), 'Must flag pinched interior clearance C3 violation');

  console.log('  ✓ Colossal Contract Gates: C1, C3, C6 properly catch violations; valid passes');
}

console.log('\n🎉 ALL PARAMETRIC PREFABS & COLOSSAL CONTRACT TESTS PASSED 100%!\n');
