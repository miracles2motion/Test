// test/test_vignettes.mjs
// Verification suite for Phase R4: Vignette Composer & Micro-Prefabs

import assert from 'node:assert';
import { PREFAB_REGISTRY } from '../src/prefabs.js';
import { createSceneTree, createNode, NODE_TYPES } from '../src/rebuild/scene-tree-schema.js';
import { buildSurfaceGridFromTree } from '../src/rebuild/surface-grid.js';
import { composeVignettes } from '../src/rebuild/vignette-composer.js';
import { createRNG } from '../src/rebuild/prng.js';
import { compileSceneTree } from '../src/rebuild/scene-compiler.js';

console.log('🧪 Running Dream Rebuild Phase R4 Acceptance Suite...\n');

// 1. Test 12 New Micro-Prefabs Existence & Execution
console.log('Test 1: Verification of 12 New Micro-Prefabs in PREFAB_REGISTRY');
const newPrefabs = [
  'stone_lantern',
  'bamboo_fountain',
  'holo_pylon',
  'valve_bank',
  'pressure_gauge',
  'chalkboard_wall',
  'crate_stack',
  'sandbag_row',
  'antenna_whip',
  'rope_coil',
  'tool_rack',
  'warning_sign'
];

const mockB = {
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
  barrel: () => {}
};

for (const id of newPrefabs) {
  const entry = PREFAB_REGISTRY[id];
  assert(entry, `Prefab "${id}" must be registered in PREFAB_REGISTRY`);
  assert(typeof entry.builder === 'function', `Prefab "${id}" builder must be a function`);
  // Dry-run execute builder
  entry.builder(mockB, 0, 0, 0);
}
console.log(`  ✓ All ${newPrefabs.length} micro-prefabs verified and dry-run executed`);

// 2. Test Vignette Composition on Multi-Tier Tree
console.log('Test 2: Contextual Vignette Composition on Multi-Tier Surfaces');
const tree = createSceneTree('space_station', 101, 'terraced');
tree.nodes.push(
  createNode('shell', NODE_TYPES.MAP_SHELL, {}, { P: 50, PH: 18, inks: { structure: 'BL' } }),
  createNode('room_hab', NODE_TYPES.ROOM, { x: -15, y: 0, z: 0, w: 20, d: 20 }, { wallHeight: 5.0, interior: true }),
  createNode('deck_obs', NODE_TYPES.PLATFORM, { x: 15, y: 5.0, z: 0, w: 20, d: 20 }, { depth: 0.6 })
);

const grid = buildSurfaceGridFromTree(tree);
const rng = createRNG(42);

const preProps = tree.nodes.filter(n => n.type === NODE_TYPES.PROP_INSTANCE).length;
composeVignettes(tree, grid, 'space_station', rng);
const postProps = tree.nodes.filter(n => n.type === NODE_TYPES.PROP_INSTANCE).length;

assert(postProps > preProps, 'Vignette composer must place prop instances into the tree');

// Verify upper-tier dressing: check if any prop has Y=5.0
const elevatedProps = tree.nodes.filter(n => n.type === NODE_TYPES.PROP_INSTANCE && n.transform.y === 5.0);
assert(elevatedProps.length > 0, 'Vignettes must be composed on elevated Y=5.0m deck (kills barren upper tier defect)');
console.log(`  ✓ Composed ${postProps} contextual props (${elevatedProps.length} on elevated tier Y=5.0m)`);

// 3. Test Scene Tree Compilation with Prefab Imports
console.log('Test 3: Scene Tree Compilation with Deduplicated Prefab Imports');
const { code, importHeader, stats } = compileSceneTree(tree);
assert(code.includes('// === DREAM REGION'), 'Compiled code must contain Dream region');
assert(importHeader.includes('import {'), 'Import header must import referenced prefabs');
console.log(`  ✓ Compiled successfully with imports: ${importHeader.trim()}`);

console.log('\n🎉 PHASE R4 ACCEPTANCE GATE: 100% PASSED!\n');
