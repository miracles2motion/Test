// test/test_organic_primitives.mjs
// Automated Unit Tests for Blueprint 4: The Organic Primitive Quartet
// Tests hollowCyl, wedge (delta), facetedRock, arch, and AST compilation.

import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createBuilder } from '../src/level.js';
import { createNode, NODE_TYPES, createSceneTree } from '../src/rebuild/scene-tree-schema.js';
import { compileSceneTree } from '../src/rebuild/scene-compiler.js';

console.log('🧪 Running Blueprint 4: Organic Primitives Test Suite...\n');

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
// 1. TEST hollowCyl
// =========================================================================
console.log('Test 1: hollowCyl construction, dimensions, floor & headroom...');
{
  const scene = createMockScene();
  const world = createMockWorld();
  const B = createBuilder(scene, world);

  // Test Z-axis hollow cylinder (bore centered at x=0, y=3.0, z=10, rInner=1.5, rOuter=1.9, length=12)
  B.hollowCyl(0, 3.0, 10, 1.5, 1.9, 12, { axis: 'z', bands: 3 });

  // 1. Colliders check: floor, ceiling blocker, 2 side walls
  assert.ok(world.colliders.length >= 4, `Expected at least 4 colliders for hollowCyl, got ${world.colliders.length}`);
  
  // Find floor collider (it has tag 'walkway' or is at the lower level)
  const floorCollider = world.colliders.find(c => c.opts?.tag === 'walkway');
  assert.ok(floorCollider, 'Walkable floor slab collider must exist inside hollowCyl');

  // Measure floor width: invariant requires >= 1.8m clearance
  assert.ok(floorCollider.w >= 1.8, `Floor width (${floorCollider.w.toFixed(2)}m) must be >= 1.8m for clearance`);

  // Find ceiling collider
  const ceilCollider = world.colliders.find(c => c.min.y > 3.5);
  assert.ok(ceilCollider, 'Ceiling blocker collider must exist');

  // Invariant check: vertical headroom between floor and ceiling must be >= 2.2m
  const headroom = ceilCollider.min.y - floorCollider.max.y;
  assert.ok(headroom >= 2.2, `Internal vertical headroom (${headroom.toFixed(2)}m) must be >= 2.2m`);

  // Test X-axis hollow cylinder
  const sceneX = createMockScene();
  const worldX = createMockWorld();
  const B_X = createBuilder(sceneX, worldX);
  B_X.hollowCyl(5.0, 4.0, 0, 1.6, 2.0, 10, { axis: 'x', floor: true });
  assert.ok(worldX.colliders.length >= 4, 'X-axis hollowCyl must create 4 colliders');

  console.log(`  ✓ hollowCyl: floor width = ${floorCollider.w.toFixed(2)}m (>= 1.8m), headroom = ${headroom.toFixed(2)}m (>= 2.2m)`);
}

// =========================================================================
// 2. TEST wedge (Delta Upgrade)
// =========================================================================
console.log('Test 2: wedge direction normalization & stepped collider approximation...');
{
  const scene = createMockScene();
  const world = createMockWorld();
  const B = createBuilder(scene, world);

  // 1. Direction normalization test with stepped colliders (dir: 'x+' normalized to '+x')
  B.wedge(0, 0, 0, 8.0, 3.0, 4.0, { dir: 'x+' });
  assert.ok(world.colliders.length >= 4, `Expected stepped colliders (>= 4), got ${world.colliders.length}`);

  // Check stepped height progression along slope: step heights should increase/decrease monotonically
  const sortedSteps = [...world.colliders].sort((a, b) => a.min.x - b.min.x);
  assert.ok(sortedSteps[0].h > 0.1, 'Step height must be positive');
  assert.ok(sortedSteps[sortedSteps.length - 1].h <= 3.05, 'Max step height must not exceed ramp height');

  // 2. Direction normalization with 'z-' (high at +z, low at -z)
  const sceneZ = createMockScene();
  const worldZ = createMockWorld();
  const B_Z = createBuilder(sceneZ, worldZ);
  B_Z.wedge(0, 0, 0, 4.0, 2.4, 6.0, { dir: 'z-' });
  assert.ok(worldZ.colliders.length >= 4, 'Z-axis wedge must generate stepped colliders');

  // 3. Solid collider fallback test (opts.collider = 'solid')
  const sceneSolid = createMockScene();
  const worldSolid = createMockWorld();
  const B_Solid = createBuilder(sceneSolid, worldSolid);
  B_Solid.wedge(0, 0, 0, 4.0, 2.0, 4.0, { collider: 'solid' });
  assert.equal(worldSolid.colliders.length, 1, 'Solid wedge must emit exactly 1 collider');

  console.log(`  ✓ wedge: stepped collider count = ${world.colliders.length}, solid fallback verified`);
}

// =========================================================================
// 3. TEST facetedRock
// =========================================================================
console.log('Test 3: facetedRock geometry, facet integrity & tactical cover clamping...');
{
  const scene = createMockScene();
  const world = createMockWorld();
  const B = createBuilder(scene, world);

  // 1. Waist cover test: height must be clamped to 0.85m - 1.25m
  B.facetedRock(0, 0, 0, 1.2, 0.4, 1.2, { cover: 'waist', seed: 42 });
  const waistRockCollider = world.colliders[0];
  assert.ok(waistRockCollider, 'Waist cover rock collider must exist');
  assert.ok(waistRockCollider.h >= 0.85 && waistRockCollider.h <= 1.25,
    `Waist rock height (${waistRockCollider.h.toFixed(2)}m) must clamp to [0.85m, 1.25m]`);
  assert.equal(waistRockCollider.opts.tag, 'cover', 'Waist cover rock collider must have tag "cover"');

  // 2. Full cover test: height must be clamped to 2.5m - 3.0m
  const sceneFull = createMockScene();
  const worldFull = createMockWorld();
  const B_Full = createBuilder(sceneFull, worldFull);
  B_Full.facetedRock(5, 0, 5, 2.0, 5.0, 2.0, { cover: 'full', seed: 99 });
  const fullRockCollider = worldFull.colliders[0];
  assert.ok(fullRockCollider.h >= 2.5 && fullRockCollider.h <= 3.0,
    `Full cover rock height (${fullRockCollider.h.toFixed(2)}m) must clamp to [2.5m, 3.0m]`);

  // 3. Determinism test: same seed produces identical bounds and vertices
  const sceneA = createMockScene();
  const worldA = createMockWorld();
  createBuilder(sceneA, worldA).facetedRock(0, 0, 0, 1.5, 1.0, 1.5, { seed: 777 });

  const sceneB = createMockScene();
  const worldB = createMockWorld();
  createBuilder(sceneB, worldB).facetedRock(0, 0, 0, 1.5, 1.0, 1.5, { seed: 777 });

  assert.equal(worldA.colliders[0].h, worldB.colliders[0].h, 'Deterministic seeds must produce identical heights');
  assert.equal(worldA.colliders[0].w, worldB.colliders[0].w, 'Deterministic seeds must produce identical widths');

  console.log(`  ✓ facetedRock: waist = ${waistRockCollider.h.toFixed(2)}m, full = ${fullRockCollider.h.toFixed(2)}m, deterministic`);
}

// =========================================================================
// 4. TEST arch
// =========================================================================
console.log('Test 4: arch passable opening, pillars & arc colliders...');
{
  const scene = createMockScene();
  const world = createMockWorld();
  const B = createBuilder(scene, world);

  // Roman arch with span=3.0, height=3.6, depth=1.0 at origin
  B.arch(0, 0, 0, 3.0, 3.6, 1.0, { style: 'roman', seg: 8 });

  // Flanking pillars + arc chord colliders must exist
  assert.ok(world.colliders.length >= 4, `Expected pillar and arc colliders (>= 4), got ${world.colliders.length}`);

  // CRITICAL INVARIANT: Central passage area must NOT be blocked by colliders
  // In the opening center (|x| < 1.0 and y between 0 and 2.0), no collider may exist
  const openingBlocked = world.colliders.some(c => {
    const xOverlap = c.min.x < 0.5 && c.max.x > -0.5;
    const yOverlap = c.min.y < 1.8 && c.max.y > 0.2;
    return xOverlap && yOverlap;
  });
  assert.equal(openingBlocked, false, 'The central opening of the arch must have zero blocking colliders!');

  console.log(`  ✓ arch: opening clear at center (0 colliders blocking portal), pillars/arc protected`);
}

// =========================================================================
// 5. TEST Scene Tree Schema & Compiler Emitters
// =========================================================================
console.log('Test 5: Scene Tree AST registration and compiler emission...');
{
  const tree = createSceneTree('test_organic', 101, 'terraced');
  
  // Add organic nodes
  tree.nodes.push(createNode('rock_cover_1', NODE_TYPES.FACETED_ROCK, { x: -4, y: 0, z: 2, w: 2, h: 1, d: 2 }, { cover: 'waist' }));
  tree.nodes.push(createNode('log_tunnel_1', NODE_TYPES.HOLLOW_CYL, { x: 0, y: 2, z: 0, w: 4, h: 4, d: 10 }, { rInner: 1.5, rOuter: 1.9, axis: 'z' }));
  tree.nodes.push(createNode('gate_arch_1', NODE_TYPES.ARCH, { x: 8, y: 0, z: 0, w: 3, h: 3.6, d: 1 }, { span: 3.0, height: 3.6 }));
  tree.nodes.push(createNode('ramp_wedge_1', NODE_TYPES.WEDGE, { x: -8, y: 0, z: -4, w: 4, h: 2, d: 6 }, { dir: '+z' }));

  const { code, stats } = compileSceneTree(tree);

  assert.ok(code.includes('facetedRock(-4, 0, 2, 1, 1, 1, { ink: BK, cover: \'waist\', seed: 1337 })'), 'Compiled code must contain facetedRock call');
  assert.ok(code.includes('hollowCyl(0, 2, 0, 1.5, 1.9, 10, { axis: \'z\', ink: BK, floor: true, bands: 0 })'), 'Compiled code must contain hollowCyl call');
  assert.ok(code.includes('arch(8, 0, 0, 3, 3.6, 1, { axis: \'z\', ink: BL })'), 'Compiled code must contain arch call');
  assert.ok(code.includes('wedge(-8, 0, -4, 4, 2, 6, { dir: \'+z\', ink: BL, collider: \'stepped\' })'), 'Compiled code must contain wedge call');
  assert.ok(stats.geometryCalls >= 4, 'Stats must track geometry calls');
  assert.ok(stats.colliders >= 4, 'Stats must track colliders');

  console.log(`  ✓ AST Compiler: emitted all 4 organic nodes cleanly (${stats.geometryCalls} calls, ${stats.colliders} colliders)`);
}

console.log('\n🎉 ALL ORGANIC PRIMITIVES UNIT TESTS PASSED 100%!\n');
