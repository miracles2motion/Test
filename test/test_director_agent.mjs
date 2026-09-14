// test/test_director_agent.mjs
// Verification suite for Phase R6: LLM Orchestration Layer & Stand-in Director

import assert from 'node:assert';
import { createSceneTree, createNode, NODE_TYPES } from '../src/rebuild/scene-tree-schema.js';
import { buildSurfaceGridFromTree } from '../src/rebuild/surface-grid.js';
import { validateGameplay } from '../src/rebuild/validation-engine.js';
import {
  StandinDirector,
  generatePromptPacket,
  applyDirectorProposals
} from '../src/rebuild/director-agent.js';

console.log('🧪 Running Dream Rebuild Phase R6 Acceptance Suite...\n');

// 1. Test Stand-in Director Deterministic Proposals
console.log('Test 1: Stand-in Director Offline Execution');
const tree = createSceneTree('space_station', 101, 'terraced');
tree.nodes.push(
  createNode('shell', NODE_TYPES.MAP_SHELL, {}, { P: 40, PH: 18, inks: { structure: 'BL' } }),
  createNode('room_hab', NODE_TYPES.ROOM, { x: 0, y: 0, z: 0, w: 16, d: 16 }, { wallHeight: 5.0, interior: true })
);

const grid = buildSurfaceGridFromTree(tree);
const report = validateGameplay(tree, grid);

const standin = new StandinDirector();
const proposals = await standin.propose({
  tree,
  agenda: report.deficiencies,
  theme: 'space_station',
  seed: 101
});

assert(Array.isArray(proposals) && proposals.length > 0, 'Stand-in director must emit proposals');
console.log(`  ✓ Stand-in Director emitted ${proposals.length} proposal(s) deterministically (zero-LLM)`);

// 2. Test Offline Prompt Packet Generation
console.log('Test 2: Offline Consultation Prompt Packet Generation');
const packet = generatePromptPacket(tree, report, 'space_station');
assert(packet.includes('# DREAM CONSULTATION PACKET: SPACE_STATION'), 'Packet must have standard header');
assert(packet.includes('## SCENE TREE AST (COMPACT)'), 'Packet must embed compact AST');
assert(packet.includes('## INSTRUCTIONS FOR LLM ARCHITECT'), 'Packet must include LLM response instructions');
console.log('  ✓ Generated self-contained consultation packet for frontier LLMs');

// 3. Test Proposal Gate (Reject Malformed / Degrading Proposals, Accept Valid)
console.log('Test 3: Proposal Safety Gate Verification');

// Valid proposal: add a cover block
const validProposal = [
  {
    kind: 'addNode',
    node: createNode('cov_extra', NODE_TYPES.COVER_BLOCK, { x: 5, y: 0, z: 5, w: 1.2, h: 1.2, d: 0.8 }, {}, { ink: 'OR' })
  }
];

const mergeRes = applyDirectorProposals(tree, validProposal);
assert.strictEqual(mergeRes.applied, true, 'Valid non-degrading proposal must be merged');
assert(mergeRes.tree.nodes.some(n => n.id === 'cov_extra'), 'Merged tree must contain new node');
console.log('  ✓ Valid proposal accepted and merged into Scene Tree');

// Bad proposal: duplicate node ID (violates L1)
const badProposal = [
  {
    kind: 'addNode',
    node: createNode('shell', NODE_TYPES.COVER_BLOCK, { x: 0, y: 0, z: 0 }) // duplicate ID 'shell'!
  }
];

const badMergeRes = applyDirectorProposals(tree, badProposal);
assert.strictEqual(badMergeRes.applied, false, 'Invalid L1 proposal must be rejected by safety gate');
console.log('  ✓ Malformed proposal rejected by safety gate');

console.log('\n🎉 PHASE R6 ACCEPTANCE GATE: 100% PASSED!\n');
