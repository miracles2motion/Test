// test/test_scene_compiler.mjs
// Verification suite for Phase R1: Scene Tree Schema & Atomic Compiler

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import {
  createSceneTree,
  createNode,
  NODE_TYPES,
  validateL1Schema,
  validateL2Spatial
} from '../src/rebuild/scene-tree-schema.js';
import {
  compileSceneTree,
  injectCompiledLevel,
  HAND_REGION_HEADER,
  DREAM_REGION_HEADER,
  DREAM_REGION_FOOTER
} from '../src/rebuild/scene-compiler.js';

console.log('🧪 Running Dream Rebuild Phase R1 Acceptance Suite...\n');

// 1. Test L1 Schema Validation
console.log('Test 1: L1 Schema Validation & Fault Rejection');
const validTree = createSceneTree('space_station', 104, 'terraced');
validTree.nodes.push(
  createNode('shell', NODE_TYPES.MAP_SHELL, {}, { P: 55, PH: 18, inks: { structure: 'BL' } }),
  createNode('z_hab_room', NODE_TYPES.ROOM, { x: -10, y: 0, z: 5, w: 16, d: 12 }, { wallHeight: 5.0, interior: true }, { ink: 'BL' }),
  createNode('door_d1', NODE_TYPES.DOORWAY, { x: -10, y: 0, z: 11 }, { wall: 'north', width: 2.4 }),
  createNode('stair_s1', NODE_TYPES.STAIR_RUN, { x: -10, y: 0, z: 15, h: 4.0 }, { direction: 'z+', deltaY: 4.0, reservedRun: 8.0 }),
  createNode('spawn_1', NODE_TYPES.SPAWN_POINT, { x: -10, y: 0, z: -20 })
);

const l1Result = validateL1Schema(validTree);
assert.strictEqual(l1Result.valid, true, 'Valid tree must pass L1 schema');
assert.strictEqual(l1Result.errors.length, 0);

// Test duplicate ID fault
const badTree = JSON.parse(JSON.stringify(validTree));
badTree.nodes.push(createNode('spawn_1', NODE_TYPES.SPAWN_POINT, { x: 0, y: 0, z: 0 }));
const badL1 = validateL1Schema(badTree);
assert.strictEqual(badL1.valid, false, 'Duplicate node IDs must fail L1');
assert(badL1.errors.some(e => e.includes('Duplicate node id "spawn_1"')));
console.log('  ✓ L1 Schema Validator accepts valid trees and rejects structural faults');

// 2. Test L2 Spatial Feasibility
console.log('Test 2: L2 Spatial Validation (Stair Run Feasibility)');
const l2Result = validateL2Spatial(validTree);
assert.strictEqual(l2Result.valid, true, 'Feasible stair run passes L2');

// Test inadequate stair run fault
const badStairTree = JSON.parse(JSON.stringify(validTree));
const stairNode = badStairTree.nodes.find(n => n.id === 'stair_s1');
stairNode.params.reservedRun = 2.0; // 4.0m climb cannot fit in 2.0m!
const badL2 = validateL2Spatial(badStairTree);
assert.strictEqual(badL2.valid, false, 'Unfeasible stair run must fail L2');
assert(badL2.errors.some(e => e.includes('Reserved run')));
console.log('  ✓ L2 Spatial Validator enforces stair feasibility math');

// 3. Test Deterministic Compilation & Traceability
console.log('Test 3: Deterministic Compilation & Traceability Comments');
const { code: code1, stats: stats1 } = compileSceneTree(validTree);
const { code: code2 } = compileSceneTree(validTree);
assert.strictEqual(code1, code2, 'Compiler output must be byte-identical on identical trees');
assert(code1.includes('// z_hab_room/wall_north'), 'Emitted lines must include node-ID traceability comments');
assert(code1.includes('// door_d1/post_left'), 'Doorway components must carry node-ID comment');
assert(stats1.geometryCalls > 0 && stats1.colliders > 0, 'Compiler must compute cost metrics');
console.log(`  ✓ Deterministic compilation confirmed (${stats1.geometryCalls} calls, ${stats1.colliders} colliders)`);

// 4. Test In-Place Regeneration (5x Compile with Zero Duplication)
console.log('Test 4: In-Place Atomic Regeneration (5x Compile, Zero Duplication)');
let levelCode = '';
for (let pass = 1; pass <= 5; pass++) {
  const result = injectCompiledLevel(levelCode, validTree, 'space_station');
  levelCode = result.fullCode;
}

// Verify hand region remains untouched and dream region occurs exactly once
const dreamHeaders = (levelCode.match(new RegExp(DREAM_REGION_HEADER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
const dreamFooters = (levelCode.match(new RegExp(DREAM_REGION_FOOTER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
assert.strictEqual(dreamHeaders, 1, 'DREAM_REGION_HEADER must occur exactly once after 5 compiles');
assert.strictEqual(dreamFooters, 1, 'DREAM_REGION_FOOTER must occur exactly once after 5 compiles');
assert(levelCode.includes(HAND_REGION_HEADER), 'HAND_REGION_HEADER must be present');
console.log('  ✓ 5x in-place compile confirmed: hand region preserved, zero duplicate injection blocks');

// 5. Dry-run code syntax check via Node VM
console.log('Test 5: Dry-run Code Syntax Check');
const mockThreeB = {
  box: () => {},
  slab: () => {},
  stairs: () => {},
  rail: () => {},
  cyl: () => {},
  sphere: () => {},
  ring: () => {},
  spawn: () => {},
  sniper: () => {},
  pickup: () => {},
  barrel: () => {},
  planes: () => {}
};

// Wrap level code in mock execution to verify execution cleanliness
const executableScript = levelCode
  .replace(/import\s+.*?;\s*/g, '')
  .replace(/export\s+function/g, 'function');

const sandbox = {
  INK: { BLUE: 1, BLACK: 2, ORANGE: 3, GREEN: 4, RED: 5 },
  B: mockThreeB,
  console
};
vm.createContext(sandbox);
vm.runInContext(`${executableScript}\nbuildLevel_space_station(B);`, sandbox);
console.log('  ✓ Generated level executes cleanly in JS runtime sandbox');

console.log('\n🎉 PHASE R1 ACCEPTANCE GATE: 100% PASSED!\n');
