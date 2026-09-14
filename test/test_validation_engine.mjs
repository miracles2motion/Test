// test/test_validation_engine.mjs
// Verification suite for Phase R5: Validation Engine & Auto-Repair Agenda

import assert from 'node:assert';
import { createSceneTree, createNode, NODE_TYPES } from '../src/rebuild/scene-tree-schema.js';
import { buildSurfaceGridFromTree } from '../src/rebuild/surface-grid.js';
import { validateGameplay, solvePath } from '../src/rebuild/validation-engine.js';
import { executeRepairAgenda } from '../src/rebuild/repair-agenda.js';

console.log('🧪 Running Dream Rebuild Phase R5 Acceptance Suite...\n');

// 1. Test Grid A* Pathfinding Solver
console.log('Test 1: Grid A* Pathfinding Solver Reachability');
const tree = createSceneTree('space_station', 101, 'terraced');
tree.nodes.push(
  createNode('shell', NODE_TYPES.MAP_SHELL, {}, { P: 40, PH: 18, inks: { structure: 'BL' } }),
  createNode('spawn_alpha', NODE_TYPES.SPAWN_POINT, { x: -20, y: 0, z: -20 }),
  createNode('pickup_mid', NODE_TYPES.PICKUP_POINT, { x: 0, y: 0, z: 0 })
);

const grid = buildSurfaceGridFromTree(tree);
const pathRes = solvePath(grid, { x: -20, z: -20 }, { x: 0, z: 0 });
assert.strictEqual(pathRes.reachable, true, 'Continuous ground plane must be walkable via A*');
assert(pathRes.steps > 0, 'Path must record positive step traversal');
console.log(`  ✓ A* Solver solved path in ${pathRes.steps} grid steps`);

// 2. Test Fault-Injection & Honest Gate Closure (Kills Fake 75+ Random Score)
console.log('Test 2: Fault Injection (Floating Void Pickup Must Close Gate)');
// Inject an unreachable pickup floating 100m outside bounds
tree.nodes.push(
  createNode('bad_pickup', NODE_TYPES.PICKUP_POINT, { x: 200, y: 0, z: 200 })
);

const brokenReport = validateGameplay(tree, grid);
assert.strictEqual(brokenReport.gates.R2_pickupsReachable, false, 'Unreachable pickup MUST fail Gate R2');
assert.strictEqual(brokenReport.passed, false, 'Map with unreachable objective MUST fail export gate');
assert(brokenReport.score < 75, `Failing map score must drop below 75 (got ${brokenReport.score})`);
console.log(`  ✓ Gate closed as expected on unreachable pickup (Score: ${brokenReport.score}, passed: false)`);

// 3. Test Bounded Multi-Pass Auto-Repair Loop
console.log('Test 3: Auto-Repair Agenda Loop (Multi-Pass Self-Healing)');
const repairResult = executeRepairAgenda(tree, 5);
assert(repairResult.passes >= 1, 'Repair agenda must run at least 1 corrective pass');
assert.strictEqual(repairResult.passed, true, 'Repaired map must pass quality gate');
assert(repairResult.finalScore >= 75, `Repaired score must meet export threshold (got ${repairResult.finalScore})`);
console.log(`  ✓ Repaired in ${repairResult.passes} pass(es) -> Final Score: ${repairResult.finalScore}/100 (PASSED)`);

console.log('\n🎉 PHASE R5 ACCEPTANCE GATE: 100% PASSED!\n');
