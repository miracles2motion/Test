import { ComponentGrammar } from '../src/component-grammar.js';
import { PrefabSynthesizer } from '../src/prefab-synthesizer.js';
import { HybridDetailingStandard } from '../src/hybrid-uds.js';

console.log("=== Testing Prefab Synthesizer & Hybrid UDS ===\n");

const grammar = new ComponentGrammar();
const synthesizer = new PrefabSynthesizer(grammar);

// 1. Synthesize a Bridge (15m span)
console.log("[Synthesizing Bridge (15m span)]");
const bridge = synthesizer.synthesize({ type: 'bridge', params: { span: 15 } });
console.log(`Generated Bridge ID: ${bridge.id}`);
console.log(`Components Assembled: ${bridge.components.length}`);
const bridgePillars = bridge.components.filter(c => c.atom === 'pillar').length;
console.log(`Calculated Pillars needed for 15m span: ${bridgePillars}\n`);

// 2. Synthesize a Ship Hull
console.log("[Synthesizing Ship Hull]");
const ship = synthesizer.synthesize({ type: 'ship_hull', params: { length: 40 } });
console.log(`Generated Ship ID: ${ship.id}`);
console.log(`Components Assembled: ${ship.components.length}`);
const shipCovers = ship.components.filter(c => c.role === 'remedial_cover').length;
console.log(`Tactical Validation: Found and added ${shipCovers} remedial deck covers to fix 'INSUFFICIENT_DECK_COVER'\n`);

// 3. Synthesize a Giant Pencil
console.log("[Synthesizing Giant Pencil (Classroom Prop)]");
const pencil = synthesizer.synthesize({ type: 'giant_pencil', params: { scale: 5 } });
console.log(`Generated Pencil ID: ${pencil.id}`);
console.log(`Components Assembled: ${pencil.components.length} (shaft, tip, eraser)\n`);

// 4. Test Hybrid Detailing Standard
console.log("[Testing Hybrid UDS Junction Validation]");
const uds = new HybridDetailingStandard();
const rigidPlatform = { role: 'viewing_deck', geometry: 'box', hasVisibleBrackets: false };
const organicTree = { role: 'world_tree', geometry: 'cylinder', isGrounded: true };

const violations = uds.validateJunction(rigidPlatform, organicTree);
console.log("Junction Validation Results:");
violations.forEach(v => console.log(`- [${v.severity}] ${v.type}: ${v.fix}`));

console.log("\n=== Test Complete ===");
