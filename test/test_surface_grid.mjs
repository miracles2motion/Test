// test/test_surface_grid.mjs
// Verification suite for Phase R3: Surface Grid & Stair Router

import assert from 'node:assert';
import { createSceneTree, createNode, NODE_TYPES } from '../src/rebuild/scene-tree-schema.js';
import { SurfaceGrid, buildSurfaceGridFromTree } from '../src/rebuild/surface-grid.js';
import { routeStairsAndRailings } from '../src/rebuild/stair-router.js';

console.log('🧪 Running Dream Rebuild Phase R3 Acceptance Suite...\n');

// 1. Test Grid Rasterization & Headroom Calculation
console.log('Test 1: Multi-Tier Grid Rasterization & Headroom');
const tree = createSceneTree('space_station', 101, 'terraced');
tree.nodes.push(
  createNode('shell', NODE_TYPES.MAP_SHELL, {}, { P: 50, PH: 18, inks: { structure: 'BL' } }),
  // Elevated observation platform at Y=5.0m
  createNode('obs_deck', NODE_TYPES.PLATFORM, { x: 0, y: 5.0, z: 10, w: 12, d: 10 }, { depth: 0.6 }),
  // High crane perch at Y=10.0m directly above part of the deck
  createNode('high_perch', NODE_TYPES.PLATFORM, { x: 0, y: 10.0, z: 10, w: 6, d: 6 }, { depth: 0.6 })
);

const grid = buildSurfaceGridFromTree(tree);

// Check layer heights at (0, 10)
const layers = grid.surfaceAt(0, 10);
assert(layers.length >= 3, `Expected at least 3 layers at column (0, 10), got ${layers.length}`);
assert.strictEqual(layers[0].surfaceY, 0, 'Ground layer must be Y=0');
assert.strictEqual(layers[1].surfaceY, 5.0, 'Platform layer must be Y=5.0m');
assert.strictEqual(layers[2].surfaceY, 10.0, 'High perch layer must be Y=10.0m');

// Check computed vertical headroom
assert.strictEqual(layers[0].headroom, 5.0, 'Ground beneath platform must have 5.0m headroom');
assert.strictEqual(layers[1].headroom, 5.0, 'Platform beneath high perch must have 5.0m headroom');
assert.strictEqual(layers[2].headroom, 8.0, 'High perch beneath ceiling (PH=18) must have 8.0m headroom');
console.log('  ✓ Verified 3 distinct vertical layers and exact headroom calculations');

// 2. Test Multi-Tier Free Anchor Queries (Kills "Props Only at Y=0")
console.log('Test 2: Upper-Tier Anchor Discovery (Kills Vector C Defect)');
const groundAnchors = grid.freeAnchors(null, 0, 2.4);
const deckAnchors = grid.freeAnchors('obs_deck', 5.0, 2.4);
const perchAnchors = grid.freeAnchors('high_perch', 10.0, 2.4);

assert(groundAnchors.length > 0, 'Must find free anchors on ground');
assert(deckAnchors.length > 0, 'Must find free anchors on Y=5.0m deck (enables upper-tier dressing)');
assert(perchAnchors.length > 0, 'Must find free anchors on Y=10.0m perch');
console.log(`  ✓ Discovered ${deckAnchors.length} anchors on Y=5m and ${perchAnchors.length} anchors on Y=10m`);

// 3. Test Automatic Railing Synthesis for Elevated Falls
console.log('Test 3: Railing Synthesis on Dangerous Elevated Drops');
const preNodeCount = tree.nodes.length;
routeStairsAndRailings(tree, grid);
const postNodeCount = tree.nodes.length;

const rails = tree.nodes.filter(n => n.type === NODE_TYPES.RAILING);
assert(rails.length > 0, `Must synthesize safety railings along edge cells (found ${rails.length})`);
assert(rails.every(r => r.params.y >= 3.0), 'All generated railings must be on elevated drops >= 3m');
console.log(`  ✓ Synthesized ${rails.length} safety railings along elevated platform perimeters`);

console.log('\n🎉 PHASE R3 ACCEPTANCE GATE: 100% PASSED!\n');
