// ============================================================================
// VERIFICATION TEST SUITE FOR EPIC B (DREAM PHASE 7 SYSTEMS)
// ============================================================================

import assert from 'node:assert';
import { DEVICE_TIERS } from '../src/perf/device-tiers.js';
import { BudgetLedger } from '../src/perf/budget-arbiter.js';
import { GeometryCache } from '../src/perf/geometry-cache.js';
import { LODManager } from '../src/perf/lod-manager.js';
import { LooseOctree, COLLISION_LOD } from '../src/perf/loose-octree.js';
import { EnemyPoolManager } from '../src/perf/enemy-pool.js';
import { AdaptivePerformanceMonitor, PERF_CONFIG } from '../src/perf/perf-monitor.js';

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${name}:`, err.message);
    throw err;
  }
}

console.log('=== RUNNING EPIC B RIGOROUS VERIFICATION SUITE ===\n');

// 1. DEVICE TIERS
test('Device Tiers contracts exist and have required budget keys', () => {
  const tiers = ['TIER_S', 'TIER_A', 'TIER_B', 'TIER_C'];
  for (const t of tiers) {
    const tier = DEVICE_TIERS[t];
    assert(tier, `Missing tier ${t}`);
    assert(typeof tier.triangleBudget === 'number' && tier.triangleBudget > 0);
    assert(typeof tier.drawCallBudget === 'number' && tier.drawCallBudget > 0);
    assert(typeof tier.instanceBudget === 'number' && tier.instanceBudget > 0);
    assert(typeof tier.enemyBudget === 'number' && tier.enemyBudget > 0);
    assert(tier.k && typeof tier.k.drawCall === 'number');
    assert(tier.k && typeof tier.k.triangle === 'number');
  }
});

// 2. BUDGET ARBITER
test('Budget Ledger correctly estimates frame ms and flags contract overruns', () => {
  const ledger = new BudgetLedger('TIER_B');
  // Record light scene
  ledger.recordArchetype(20000, 5);
  ledger.recordDrawCall(20);
  ledger.recordColliders(50, 4);
  ledger.recordEnemies(4);

  const cleanAudit = ledger.audit();
  assert(cleanAudit.passed === true, 'Light scene should pass TIER_B budget');

  // Push scene to extreme overrun
  ledger.recordArchetype(500000, 200);
  ledger.recordDrawCall(300);
  ledger.recordColliders(500, 1);
  ledger.recordEnemies(30);

  const failAudit = ledger.audit();
  assert(failAudit.passed === false, 'Extreme scene should fail TIER_B budget');
  assert(failAudit.overruns.length > 0, 'Should list specific overruns');
  assert(failAudit.overruns.some(o => o.metric === 'drawCallBudget'));
  assert(failAudit.overruns.some(o => o.metric === 'triangleBudget'));
});

// 3. GEOMETRY CACHE
test('Geometry Cache handles parameter hashing, cache hits, and LRU touch', () => {
  const cache = new GeometryCache(100);
  const key1 = cache.key('tree', 'pine', { iterations: 3, seed: 42 });
  const key2 = cache.key('tree', 'pine', { iterations: 3, seed: 42 });
  const key3 = cache.key('tree', 'pine', { iterations: 4, seed: 42 });

  assert.strictEqual(key1, key2, 'Identical params must yield identical hash');
  assert.notStrictEqual(key1, key3, 'Different iterations must yield different hash');

  let buildCount = 0;
  const builder = () => {
    buildCount++;
    return { geometry: { dispose: () => {} }, material: { dispose: () => {} } };
  };

  const entry1 = cache.acquire(key1, builder, 500);
  assert.strictEqual(buildCount, 1);
  const entry2 = cache.acquire(key1, builder, 500);
  assert.strictEqual(buildCount, 1, 'Cache hit must not re-execute buildFn');
  assert.strictEqual(entry1, entry2);

  cache.clear();
  assert.strictEqual(cache.entries.size, 0);
  assert.strictEqual(cache.memoryUsedMB, 0);
});

// 4. LOD MANAGER & AMORTIZED SWAPS
test('LOD Manager computes projected pixel heights, hysteresis, and flushes max 3 swaps/frame', () => {
  const lod = new LODManager();
  lod.setViewport(1080, 70);

  const dummyLOD0 = { visible: true };
  const dummyLOD1 = { visible: false };
  const dummyLOD2 = { visible: false };

  const record = lod.register({
    lod0: dummyLOD0,
    lod1: dummyLOD1,
    lod2: dummyLOD2,
    pos: [0, 0, 10], // 10 units in front of camera
    radius: 2.0,
  });

  assert.strictEqual(record.currentLOD, 0);
  assert.strictEqual(dummyLOD0.visible, true);

  // Move camera far away (e.g. 200m)
  lod.update({ x: 0, y: 0, z: -190 }); // dist ~ 200m -> projHeight should drop below h01 and h12
  assert(lod.swapQueue.length > 0, 'Should have enqueued a swap');

  // Register 5 more distant objects
  for (let i = 0; i < 5; i++) {
    lod.register({
      lod0: { visible: true },
      lod1: { visible: false },
      lod2: { visible: false },
      pos: [i * 10, 0, 200],
      radius: 1.0,
    });
  }
  lod.update({ x: 0, y: 0, z: 0 }); // dist 200m

  const queueLenBefore = lod.swapQueue.length;
  assert(queueLenBefore >= 4, 'Should have multiple queued swaps');

  // Test amortized flush: max 3 per frame
  lod.flush(3);
  assert.strictEqual(lod.swapQueue.length, queueLenBefore - 3, 'Must flush at most 3 swaps in a single frame');
});

// 5. LOOSE OCTREE
test('Loose Octree stores primitives, performs cell-local queries, and adheres to zero-allocation query buffers', () => {
  const octree = new LooseOctree();
  
  // Add capsule and AABB at (10, 0, 10)
  const capId = octree.addCapsule([9, 0, 10], [11, 0, 10], 1.0, COLLISION_LOD.FULL);
  const aabbId = octree.addAABB([8, 0, 8], [12, 4, 12], COLLISION_LOD.AABB);

  // Query nearby at (10, 0, 10)
  const res1 = octree.queryNear(10, 10, COLLISION_LOD.AABB);
  assert(res1.capsules.some(c => c.id === capId), 'Query should find local capsule');
  assert(res1.aabbs.some(a => a.id === aabbId), 'Query should find local AABB');

  // Query far away at (150, 0, 150)
  const res2 = octree.queryNear(150, 150, COLLISION_LOD.AABB);
  assert.strictEqual(res2.capsules.length, 0, 'Far query should find no capsules');
  assert.strictEqual(res2.aabbs.length, 0, 'Far query should find no AABBs');

  // Verify result array reference stability (zero-allocation)
  assert.strictEqual(res1.capsules, res2.capsules, 'Query buffer must be reused in-place');
});

// 6. ENEMY POOL MANAGER
test('Enemy Pool clamps concurrency budget and auto-spawns from queue upon release', () => {
  const pool = new EnemyPoolManager(2); // budget of 2 active enemies
  
  const e1 = pool.spawn('grunt', [0, 0, 0]);
  assert(e1 !== null && e1.state === 'ACTIVE');
  assert.strictEqual(pool.activeCount, 1);

  const e2 = pool.spawn('grunt', [5, 0, 0]);
  assert(e2 !== null && e2.state === 'ACTIVE');
  assert.strictEqual(pool.activeCount, 2);

  // Attempt 3rd spawn -> should exceed budget and be placed in pending queue
  const e3 = pool.spawn('grunt', [10, 0, 0]);
  assert.strictEqual(e3, null, 'Must return null when concurrency budget reached');
  assert.strictEqual(pool.pendingQueue.length, 1, 'Should buffer in pendingQueue');

  // Release e1 -> should immediately awaken e3 from queue
  pool.release(e1);
  assert.strictEqual(pool.activeCount, 2, 'Active count should remain at 2 as pending enemy awakens');
  assert.strictEqual(pool.pendingQueue.length, 0, 'Pending queue should be drained');

  pool.clear();
  assert.strictEqual(pool.activeCount, 0);
});

// 7. ADAPTIVE PERFORMANCE MONITOR
test('Adaptive Performance Monitor calculates p95/p50, respects combat deferral, and steps ladder', () => {
  const monitor = new AdaptivePerformanceMonitor();
  monitor.setFrameInterval(16.67);

  // Feed 240 frames of 16.0ms (healthy 60fps)
  for (let i = 0; i < 240; i++) {
    monitor.tick(16.0, i * 16.67);
  }
  const { p50, p95 } = monitor.percentiles();
  assert(Math.abs(p50 - 16.0) < 0.1, `p50 should be ~16.0ms, got ${p50}`);
  assert(Math.abs(p95 - 16.0) < 0.1, `p95 should be ~16.0ms, got ${p95}`);
  assert.strictEqual(monitor.rung, 0, 'Should remain at Rung 0 under healthy frames');

  // Test combat deferral
  monitor.setCombatState(true);
  // Feed bad frames (22ms, well above 18.2ms threshold)
  let now = 5000;
  for (let i = 0; i < 240; i++) {
    now += 22;
    monitor.tick(22, now);
  }
  assert.strictEqual(monitor.rung, 0, 'Should not downgrade non-critical rung during active combat');
  assert(monitor.deferredRung !== null, 'Should have recorded deferred rung');

  // Exit combat -> deferred rung must be applied
  monitor.setCombatState(false);
  assert(monitor.rung > 0, 'Deferred rung should apply once combat finishes');
  assert.strictEqual(monitor.deferredRung, null);

  // Test emergency survival mode on catastrophic stall (p95 > 40ms sustained)
  for (let i = 0; i < 120; i++) {
    now += 45;
    monitor.tick(45.0, now);
  }
  assert.strictEqual(monitor.rung, 5, 'Must trigger Rung 5 survival mode on sustained >40ms stall');
  assert.strictEqual(monitor.quality.survivalMode, true);
  assert.strictEqual(monitor.quality.shadows, false);
});

console.log(`\n=== ALL ${passedTests}/${totalTests} TESTS PASSED! ===`);
