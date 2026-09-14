// test/test_rebuild_r0.mjs
// Verification suite for Phase R0: Deterministic PRNG and Thematic Memory Completeness

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRNG, hashSeed, mulberry32 } from '../src/rebuild/prng.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('🧪 Running Dream Rebuild Phase R0 Acceptance Suite...\n');

// 1. Test PRNG determinism
console.log('Test 1: PRNG Reproducibility & Distribution');
const rng1 = createRNG('space_station', 0);
const rng2 = createRNG('space_station', 0);

const seq1 = Array.from({ length: 20 }, () => rng1.next());
const seq2 = Array.from({ length: 20 }, () => rng2.next());

assert.deepStrictEqual(seq1, seq2, 'Same seed must produce identical sequences');
assert(seq1.every(n => n >= 0 && n < 1), 'All floats must be in [0, 1)');

// Check distinct seeds
const rng3 = createRNG('space_station', 1);
const seq3 = Array.from({ length: 20 }, () => rng3.next());
assert.notDeepStrictEqual(seq1, seq3, 'Different run index must produce different sequences');
console.log('  ✓ Deterministic PRNG verified (20 samples byte-identical)');

// 2. Test RNG Helpers
console.log('Test 2: RNG Helpers (randInt, randChoice, randShuffle)');
const intSample = Array.from({ length: 100 }, () => rng1.randInt(5, 10));
assert(intSample.every(n => Number.isInteger(n) && n >= 5 && n <= 10), 'randInt bounds check');

const choices = ['a', 'b', 'c', 'd'];
const chosen = Array.from({ length: 50 }, () => rng1.randChoice(choices));
assert(chosen.every(c => choices.includes(c)), 'randChoice membership');

const orig = [1, 2, 3, 4, 5, 6, 7, 8];
const shuffled = rng1.randShuffle(orig);
assert.strictEqual(shuffled.length, orig.length, 'randShuffle length');
assert.deepStrictEqual([...shuffled].sort(), [...orig].sort(), 'randShuffle contains all elements');
console.log('  ✓ Helper distributions within valid bounds');

// 3. Test Thematic Memory Schema & Safety Clearances
console.log('Test 3: Thematic Memory Schema & Safety Clearances');
const memPath = path.join(ROOT, '.agents', 'thematic-memory.json');
const mem = JSON.parse(fs.readFileSync(memPath, 'utf8'));

assert(mem.thematicArchetypes && typeof mem.thematicArchetypes === 'object', 'thematicArchetypes must be an object');
assert(mem.safetyClearances && typeof mem.safetyClearances === 'object', 'safetyClearances must be an object');
assert(mem.safetyClearances.walkwayPinch >= 1.8, 'walkwayPinch must be >= 1.8');
assert(mem.safetyClearances.stairHeadroom >= 2.0, 'stairHeadroom must be >= 2.0');

for (const [theme, t] of Object.entries(mem.thematicArchetypes)) {
  assert(Array.isArray(t.keywords) && t.keywords.length > 0, `Theme "${theme}" must have keywords`);
  assert(typeof t.layoutPrior === 'string', `Theme "${theme}" must have layoutPrior string`);
  assert(t.primaryInk && t.secondaryInk && t.accentInk && t.hazardInk, `Theme "${theme}" must have ink definitions`);
  assert(t.props && t.props.tier1_micro && t.props.tier2_meso && t.props.tier3_macro, `Theme "${theme}" must define Tier 1-3 props`);
}
console.log(`  ✓ Thematic memory schema and safety clearances verified`);

// 4. Test Half-Span Regex Support for Decimals in Scaffold
console.log('Test 4: Decimal regex parsing in map-scaffold');
const scaffoldCode = fs.readFileSync(path.join(ROOT, 'src', 'map-scaffold.js'), 'utf8');
assert(scaffoldCode.includes('Half-Span[^\\d]*(\\d+(?:\\.\\d+)?)'), 'Half-Span decimal regex must be present');
assert(scaffoldCode.includes('Wall Height[^\\d]*(\\d+(?:\\.\\d+)?)'), 'Wall Height decimal regex must be present');
console.log('  ✓ Decimal parsing active in map-scaffold.js');

console.log('\n🎉 PHASE R0 ACCEPTANCE GATE: 100% PASSED!\n');
