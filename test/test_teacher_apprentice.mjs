// test/test_teacher_apprentice.mjs
// Comprehensive test suite for Teacher-Apprentice Protocol (Blueprint 1)

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {
  evaluateExpression,
  validateRecipe,
  instantiateRecipe,
  createTeachRequest
} from '../src/rebuild/recipe-engine.js';
import {
  ingestRecipe,
  recordRecipeOutcome
} from '../src/rebuild/recipe-ingestion.js';
import { StandinDirector, generatePromptPacket } from '../src/rebuild/director-agent.js';
import { PREFAB_REGISTRY, instantiatePrefab } from '../src/prefabs.js';

console.log('🧪 Running Teacher-Apprentice Protocol Test Suite (Blueprint 1)...\n');

// ---------------------------------------------------------------------------
// 1. Expression Parser Math Tests
// ---------------------------------------------------------------------------
console.log('1. Testing evaluateExpression math & functions...');

assert.strictEqual(evaluateExpression('2 + 3 * 4'), 14);
assert.strictEqual(evaluateExpression('(2 + 3) * 4'), 20);
assert.strictEqual(evaluateExpression('10 - 4 - 2'), 4);
assert.strictEqual(evaluateExpression('15 % 4'), 3);
assert.strictEqual(evaluateExpression('-5 + 10'), 5);
assert.strictEqual(evaluateExpression('sqrt(16)'), 4);
assert.strictEqual(evaluateExpression('abs(-7.5)'), 7.5);
assert.strictEqual(evaluateExpression('min(3, 8, 1)'), 1);
assert.strictEqual(evaluateExpression('max(3, 8, 1)'), 8);
assert.strictEqual(evaluateExpression('clamp(15, 0, 10)'), 10);
assert.strictEqual(evaluateExpression('clamp(-5, 0, 10)'), 0);
assert.strictEqual(evaluateExpression('round(4.6)'), 5);
assert.strictEqual(evaluateExpression('floor(4.6)'), 4);

// Degree trig
assert.strictEqual(Math.round(evaluateExpression('sin(90)')), 1);
assert.strictEqual(Math.round(evaluateExpression('cos(0)')), 1);
assert.strictEqual(Math.round(evaluateExpression('cos(90)')), 0);

// Parameters and scope variables
const testScope = { height: 20, fronds: 8, i: 2 };
assert.strictEqual(evaluateExpression('@height - 0.4', testScope), 19.6);
assert.strictEqual(evaluateExpression('i * 360 / @fronds', testScope), 90);
assert.strictEqual(Math.round(evaluateExpression('cos(i * 360 / @fronds)', testScope)), 0);

console.log('   ✓ Arithmetic, functions, trig degrees, and @param lookups pass.');

// ---------------------------------------------------------------------------
// 2. Expression Parser Security & Rejection Tests
// ---------------------------------------------------------------------------
console.log('2. Testing evaluateExpression hostile payload rejections (Zero eval)...');

const hostilePayloads = [
  'process.exit(1)',
  '__proto__',
  'constructor',
  'function() { return 1; }()',
  'globalThis',
  'eval("2+2")',
  'alert(1)',
  'require("fs")',
  'import("fs")',
  '1; 2',
  '{}',
  '[]'
];

for (const hostile of hostilePayloads) {
  assert.throws(
    () => evaluateExpression(hostile, testScope),
    /is not whitelisted|Unknown variable|Invalid number|Unexpected character|Unexpected trailing/
  );
}
console.log('   ✓ All 12 hostile payloads safely rejected by grammar parser without eval.');

// ---------------------------------------------------------------------------
// 3. TeachRequest Schema Generation
// ---------------------------------------------------------------------------
console.log('3. Testing createTeachRequest generation...');

const teachReq = createTeachRequest({
  assetId: 'palm_tree',
  theme: 'beach',
  pausedScope: 'vignette:z_shore_e.slot_2',
  measuredContext: {
    tier: 0,
    availableAnchors: ['open_sand', 'lane_edge'],
    footprintAvailable: [6, 6],
    headroomToObstruction: 14.2,
    neededTacticalRoles: ['landmark_anchor', 'waist_cover'],
    geometryBudgetLeft: 140
  }
});

assert.strictEqual(teachReq.schema, 'dream-teach/1.0');
assert.ok(teachReq.ticketId.startsWith('T-'));
assert.strictEqual(teachReq.trigger.assetId, 'palm_tree');
assert.strictEqual(teachReq.trigger.theme, 'beach');
assert.strictEqual(teachReq.budget.maxParts, 40);
assert.strictEqual(teachReq.budget.maxGeometryCalls, 60);
assert.strictEqual(teachReq.questions.length, 6);
console.log('   ✓ TeachRequest conforms to dream-teach/1.0 specification.');

// ---------------------------------------------------------------------------
// 4. Recipe Validation (L1) Tests
// ---------------------------------------------------------------------------
console.log('4. Testing validateRecipe L1 schema & budget checks...');

const samplePalmTreeRecipe = {
  schema: 'dream-recipe/1.0',
  id: 'palm_tree',
  version: 1,
  provenance: { teacher: 'field_guide', date: '2026-09-14' },
  params: {
    height: { min: 14, max: 22, default: 18 },
    leanDeg: { min: -12, max: 12, default: 4 },
    trunkR: { min: 0.45, max: 0.7, default: 0.55 },
    fronds: { min: 6, max: 10, default: 8 }
  },
  parts: [
    {
      id: 'trunk',
      prim: 'cyl',
      args: [0, 0, 0, '@trunkR', '@height'],
      opts: { ink: 'BK' },
      tilt: { axis: 'z', deg: '@leanDeg' }
    },
    {
      id: 'crown_hub',
      prim: 'sphere',
      args: [0, '@height', 0, 0.5],
      opts: { ink: 'GR', noCollide: true }
    },
    {
      id: 'frond',
      foreach: { var: 'i', from: 0, to: '@fronds - 1' },
      prim: 'wedge',
      args: [
        'cos(i * 360 / @fronds) * 1.6',
        '@height - 0.4',
        'sin(i * 360 / @fronds) * 1.6',
        2.8,
        0.35,
        1.2
      ],
      opts: { ink: 'GR', noCollide: true },
      rotateY: 'i * 360 / @fronds'
    }
  ],
  anchors: {
    grapple_top: [0, '@height + 2', 0]
  },
  tactical: {
    roles: ['landmark_anchor', 'full_cover', 'grapple_anchor']
  },
  tests: { grounded: true }
};

const l1Valid = validateRecipe(samplePalmTreeRecipe);
assert.strictEqual(l1Valid.valid, true, `Valid recipe failed L1: ${l1Valid.errors.join(', ')}`);
assert.ok(l1Valid.estimatedTotalCalls <= 60);

// Foreach bomb test (>24 iterations)
const foreachBombRecipe = JSON.parse(JSON.stringify(samplePalmTreeRecipe));
foreachBombRecipe.parts[2].foreach.to = 100;
const bombResult = validateRecipe(foreachBombRecipe);
assert.strictEqual(bombResult.valid, false);
assert.ok(bombResult.errors.some(e => e.includes('bounded replication violation')));

// Unknown primitive test
const unknownPrimRecipe = JSON.parse(JSON.stringify(samplePalmTreeRecipe));
unknownPrimRecipe.parts[0].prim = 'bezierSplineExtrusion';
const primResult = validateRecipe(unknownPrimRecipe);
assert.strictEqual(primResult.valid, false);
assert.ok(primResult.errors.some(e => e.includes('not in whitelist')));

console.log('   ✓ Valid recipe passes L1; foreach bombs and unwhitelisted prims rejected.');

// ---------------------------------------------------------------------------
// 5. Instantiation Determinism (mulberry32)
// ---------------------------------------------------------------------------
console.log('5. Testing instantiateRecipe determinism...');

const mockBuilder = () => {
  const calls = [];
  const handler = (prim) => (...args) => calls.push({ prim, args });
  return {
    calls,
    B: {
      cyl: handler('cyl'),
      sphere: handler('sphere'),
      wedge: handler('wedge')
    }
  };
};

const b1 = mockBuilder();
const inst1 = instantiateRecipe(b1.B, samplePalmTreeRecipe, 4471);

const b2 = mockBuilder();
const inst2 = instantiateRecipe(b2.B, samplePalmTreeRecipe, 4471);

assert.strictEqual(inst1.partsCount, inst2.partsCount);
assert.strictEqual(inst1.params.height, inst2.params.height);
assert.deepStrictEqual(b1.calls, b2.calls);

console.log('   ✓ Recipe instantiation is 100% deterministic with identical output across calls.');

// ---------------------------------------------------------------------------
// 6. 7-Step Ingestion Pipeline
// ---------------------------------------------------------------------------
console.log('6. Testing 7-step recipe ingestion pipeline...');

const tempMemoryFile = path.resolve('.agents/test-thematic-memory.json');
fs.writeFileSync(tempMemoryFile, JSON.stringify({ thematicArchetypes: {}, recipes: {} }), 'utf8');

try {
  const ingestResult = ingestRecipe(samplePalmTreeRecipe, {
    thematicMemoryPath: tempMemoryFile
  });

  assert.strictEqual(ingestResult.success, true, `Ingestion failed: ${ingestResult.message}`);
  assert.strictEqual(ingestResult.step, 5);

  // Check memory write
  const memoryData = JSON.parse(fs.readFileSync(tempMemoryFile, 'utf8'));
  assert.ok(memoryData.recipes.palm_tree);
  assert.strictEqual(memoryData.recipes.palm_tree.confidence, 0.6);

  // Check dynamic PREFAB_REGISTRY registration
  assert.ok(PREFAB_REGISTRY.palm_tree, 'palm_tree should be dynamically registered in PREFAB_REGISTRY');
  const dynamicBuilder = mockBuilder();
  const instantiated = instantiatePrefab(dynamicBuilder.B, 'palm_tree', 0, 0, 0, { seed: 555 });
  assert.strictEqual(instantiated, true);
  assert.ok(dynamicBuilder.calls.length > 5);

  // Check confidence telemetry update
  recordRecipeOutcome('palm_tree', true, null, tempMemoryFile);
  recordRecipeOutcome('palm_tree', true, null, tempMemoryFile);
  const updatedEntry = recordRecipeOutcome('palm_tree', true, null, tempMemoryFile);
  assert.ok(updatedEntry.confidence >= 0.9, `Confidence should be >= 0.9 after 3 successes: ${updatedEntry.confidence}`);
} finally {
  if (fs.existsSync(tempMemoryFile)) fs.unlinkSync(tempMemoryFile);
}

console.log('   ✓ 7-step ingestion, dynamic prefab instantiation, and confidence telemetry verified.');

// ---------------------------------------------------------------------------
// 7. Standin Director & Cousin-Substitution Reflex
// ---------------------------------------------------------------------------
console.log('7. Testing Standin Director cousin-substitution reflex...');

const standin = new StandinDirector();
const dummyTree = { map: 'test', seed: 101, strategy: 'balanced', nodes: [] };
const proposals = await standin.propose({
  tree: dummyTree,
  agenda: [],
  theme: 'forest',
  assetGap: 'banana_tree'
});

const standinProp = proposals.find(p => p.kind === 'cousinStandin');
assert.ok(standinProp, 'StandinDirector should produce a cousinStandin proposal');
assert.strictEqual(standinProp.requestedAsset, 'banana_tree');
assert.strictEqual(standinProp.substitutedAsset, 'parametric_tree');
assert.strictEqual(standinProp.confidence, 0.5);

// Test Field Guide teaching prompt packet
const teachPacket = generatePromptPacket(dummyTree, { score: 85, deficiencies: [], passed: true }, 'beach', {
  teachRequest: teachReq
});

assert.ok(teachPacket.includes('DREAM FIELD GUIDE TEACHING PACKET'));
assert.ok(teachPacket.includes('palm_tree'));
assert.ok(teachPacket.includes('dream-recipe/1.0'));

console.log('   ✓ Standin Director substitutes cousin asset without halting, prompt packet generated.');

console.log('\n🎉 ALL TEACHER-APPRENTICE PROTOCOL TESTS PASSED 100%!\n');
