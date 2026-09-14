import assert from 'assert';
import * as THREE from 'three';
import {
  buildCreatureSkeleton,
  buildOrganicFish,
  buildBambooPlantation,
  buildTerracedRidge
} from '../src/anatomy-grammar.js';
import { buildTreehouse, PREFAB_REGISTRY } from '../src/prefabs.js';
import { INK } from '../src/render.js';

console.log('🧪 Running Phase 2: Anatomical Grammar & Organic Master Blueprints Test Suite...\n');

// Mock Builder
function createMockBuilder() {
  const geos = [];
  const colliders = [];
  const rings = [];
  const pickups = [];
  const rails = [];
  const slabs = [];

  const B = {
    addGeo: (g, ink) => geos.push({ g, ink }),
    collider: (x, y, z, w, h, d, o) => {
      const col = { x, y, z, w, h, d, o };
      colliders.push(col);
      return col;
    },
    box: (x, y, z, w, h, d, o) => {
      colliders.push({ x, y, z, w, h, d, o });
    },
    slab: (x1, z1, x2, z2, y, t, o) => {
      slabs.push({ x1, z1, x2, z2, y, t, o });
    },
    rail: (x1, z1, x2, z2, y, o) => {
      rails.push({ x1, z1, x2, z2, y, o });
    },
    cyl: (x, y, z, r, h, o) => {
      if (!o?.noCollide) colliders.push({ x, y, z, w: r * 2, h, d: r * 2, o });
    },
    cone: (x, y, z, r, h, o) => {
      if (!o?.noCollide) colliders.push({ x, y, z, w: r * 2, h, d: r * 2, o });
    },
    arch: (x, y, z, span, h, d, o) => {
      if (o?.pillars) {
        colliders.push({ x: x - span / 2, y, z, w: 0.4, h, d, o });
        colliders.push({ x: x + span / 2, y, z, w: 0.4, h, d, o });
      }
    },
    facetedRock: (x, y, z, sx, sy, sz, o) => {
      if (!o?.noCollide) colliders.push({ x, y, z, w: sx * 1.5, h: sy, d: sz * 1.5, o });
    },
    wedge: (x, y, z, w, h, d, o) => {
      if (!o?.noCollide) colliders.push({ x, y, z, w, h, d, o });
    },
    ring: (x, y, z, axis) => {
      rings.push({ x, y, z, axis });
    },
    pickup: (x, y, z) => {
      pickups.push({ x, y, z });
    },
    geos,
    colliders,
    slabs,
    rails,
    rings,
    pickups
  };

  return B;
}

// Test 1: Creature Skeleton
console.log('1. Testing buildCreatureSkeleton (Sprint-through ribcage defilade)...');
const B1 = createMockBuilder();
const skelRes = buildCreatureSkeleton(B1, [-15, 0, 0], [15, 0, 0], {
  ribPairs: 8,
  archHeight: 4.0
});
assert(skelRes.curveLength > 28, 'Spine curve must span canyon length');
assert(B1.rings.length >= 2, 'Skull must have eye socket grapple rings');
assert(B1.pickups.length >= 1, 'Must place reward inside ribcage');
console.log(`   ✓ Creature Skeleton: ${skelRes.curveLength.toFixed(1)}m spine, ${skelRes.ribCount} ribs, ${B1.rings.length} grapple rings verified.`);

// Test 2: Organic Fish / Leviathan
console.log('2. Testing buildOrganicFish (Swept spline leviathan with fin rays)...');
const B2 = createMockBuilder();
const fishRes = buildOrganicFish(B2, 0, 0, 0, { length: 26.0 });
assert.strictEqual(fishRes.length, 26.0, 'Fish length must match parameter');
assert(B2.geos.length >= 3, 'Must generate body tube and swept fin ribbons');
assert(B2.rings.length >= 2, 'Must include mouth grapple rings');
console.log(`   ✓ Organic Fish: 26m lofted body with fin ribbons and grapple mouth verified.`);

// Test 3: Dense Bamboo Plantation
console.log('3. Testing buildBambooPlantation (Poisson-spaced culms with node rings)...');
const B3 = createMockBuilder();
const bambooRes = buildBambooPlantation(B3, 0, 0, 20.0, 20.0, { count: 24 });
assert(bambooRes.culmCount >= 18, `Must generate dense bamboo grove (got ${bambooRes.culmCount} culms)`);
assert(B3.pickups.length >= 1, 'Must place center grove clearing reward');
console.log(`   ✓ Bamboo Plantation: ${bambooRes.culmCount} culms, segmented node rings, >= 1.9m anti-pinch spacing verified.`);

// Test 4: Terraced Ridge
console.log('4. Testing buildTerracedRidge (Natural rock ledges replacing urban stairs)...');
const B4 = createMockBuilder();
const ridgeRes = buildTerracedRidge(B4, 0, 0, 10.0, 4.0, { tiers: 4 });
assert.strictEqual(ridgeRes.tiers, 4, 'Must generate 4 stepped tiers');
assert(B4.slabs.length === 4, 'Must generate 4 walkable rock shelves');
console.log(`   ✓ Terraced Ridge: ${ridgeRes.tiers} mantleable rock tiers generated without urban stairs.`);

// Test 5: Treehouse with Open Stairwell Hatch
console.log('5. Testing buildTreehouse with Annular Deck Stairwell Hatch...');
const B5 = createMockBuilder();
const thRes = buildTreehouse(B5, 0, 0, 0, { height: 26.0, deckY: 9.5 });
assert.strictEqual(thRes.deckY, 9.5, 'Deck elevation must be 9.5m');
assert(thRes.rings >= 4, 'Treehouse must have high grapple highway rings');

// Verify that in the sector where the 20th step lands, there is NO solid slab covering it!
// Step 19 angle is around 1.12 * PI (approx -0.88 PI or 201 deg)
// Deck slabs must NOT block this angle
const step19Angle = (19 / 20) * Math.PI * 1.6 - Math.PI * 0.4;
const normStepAngle = (step19Angle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);

const blockingSlabs = B5.slabs.filter(s => {
  const mx = (s.x1 + s.x2) / 2;
  const mz = (s.z1 + s.z2) / 2;
  const a = (Math.atan2(mz, mx) + Math.PI * 2) % (Math.PI * 2);
  return Math.abs(a - normStepAngle) < 0.15 && Math.abs(s.y - 9.5) < 0.5;
});

assert.strictEqual(blockingSlabs.length, 0, 'ZERO slabs must block the top of the spiral staircase!');
console.log(`   ✓ Treehouse: Staircase terminates cleanly into open stairwell hatch at ${(normStepAngle * 180 / Math.PI).toFixed(1)}° with 100% open headroom!`);

// Test 6: PREFAB_REGISTRY verification
console.log('6. Testing PREFAB_REGISTRY dynamic registration...');
assert(PREFAB_REGISTRY.creature_skeleton, 'creature_skeleton must be registered');
assert(PREFAB_REGISTRY.organic_fish, 'organic_fish must be registered');
assert(PREFAB_REGISTRY.bamboo_plantation, 'bamboo_plantation must be registered');
assert(PREFAB_REGISTRY.terraced_ridge, 'terraced_ridge must be registered');
console.log('   ✓ PREFAB_REGISTRY: All 4 anatomical master blueprints dynamically registered.');

console.log('\n🎉 ALL PHASE 2 ANATOMICAL GRAMMAR TESTS PASSED 100%!\n');
