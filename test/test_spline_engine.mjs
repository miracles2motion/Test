import assert from 'assert';
import * as THREE from 'three';
import { create3DSpline, splineTube, annularDeck, sweptRibbon } from '../src/spline-engine.js';
import { INK } from '../src/render.js';

console.log('🧪 Running Phase 1: Spline, Loft & Curve Geometry Engine Test Suite...\n');

// Mock Builder
function createMockBuilder() {
  const geos = [];
  const colliders = [];
  const rails = [];
  const slabs = [];

  const B = {
    addGeo: (g, ink) => geos.push({ g, ink }),
    collider: (x, y, z, w, h, d, o) => {
      const col = { x, y, z, w, h, d, o };
      colliders.push(col);
      return col;
    },
    slab: (x1, z1, x2, z2, y, t, o) => {
      const s = { x1, z1, x2, z2, y, t, o };
      slabs.push(s);
      return s;
    },
    rail: (x1, z1, x2, z2, y, o) => {
      const r = { x1, z1, x2, z2, y, o };
      rails.push(r);
      return r;
    },
    geos,
    colliders,
    slabs,
    rails
  };

  return B;
}

// Test 1: create3DSpline
console.log('1. Testing 3D Catmull-Rom Spline Curve generation...');
const pts = [[-20, 0, -10], [0, 5, 0], [20, 2, 10], [30, 0, 25]];
const curve = create3DSpline(pts, 0.5);
assert(curve instanceof THREE.CatmullRomCurve3, 'Must return a THREE.CatmullRomCurve3');
const len = curve.getLength();
assert(len > 50, `Spline length must be > 50m (got ${len.toFixed(1)}m)`);
console.log(`   ✓ 3D Spline smooth curve length: ${len.toFixed(1)}m verified.`);

// Test 2: splineTube
console.log('2. Testing splineTube swept 3D geometry & interior corridor...');
const B1 = createMockBuilder();
const tubeRes = splineTube(B1, pts, {
  sides: 8,
  samples: 12,
  radiusProfile: (t) => 2.0 + Math.sin(t * Math.PI) * 1.5,
  hollow: true,
  floor: true,
  ink: INK.BLACK
});

assert.strictEqual(B1.geos.length, 1, 'splineTube must emit exactly 1 merged buffer geometry');
const posAttr = B1.geos[0].g.getAttribute('position');
assert(posAttr.count > 50, `Must generate vertex ring mesh (got ${posAttr.count} vertices)`);
assert(B1.colliders.length > 10, `Must generate sequential corridor colliders (got ${B1.colliders.length})`);

// Verify sprint tunnel floor width >= 1.8m
const floorColliders = B1.colliders.filter(c => c.o?.tag === 'sprint_tunnel_floor');
assert(floorColliders.length > 0, 'Must generate walkable floor colliders inside tube');
for (const fc of floorColliders) {
  assert(fc.w >= 1.8, `Interior floor width must be >= 1.8m (got ${fc.w.toFixed(2)}m)`);
}
console.log(`   ✓ splineTube: ${posAttr.count} vertices, ${floorColliders.length} floor colliders with width >= 1.8m verified.`);

// Test 3: annularDeck with calculated open stairwell hatch
console.log('3. Testing annularDeck stairwell hatch opening (no solid ceiling trap)...');
const B2 = createMockBuilder();
// Stairwell hatch from 0 to 0.45*PI (~80 deg)
const hatchStart = 0;
const hatchEnd = Math.PI * 0.45;
const deckRes = annularDeck(B2, 0, 0, 3.0, 7.0, 9.5, {
  segments: 16,
  thickness: 0.4,
  hatchAngleStart: hatchStart,
  hatchAngleEnd: hatchEnd,
  ink: INK.ORANGE
});

assert(B2.slabs.length > 0, 'Must generate annular deck slabs');
assert(B2.slabs.length < 16, 'Slabs count must be less than segments due to open hatch');

// Verify that in the hatch angular sector, ZERO slabs are placed
for (const s of B2.slabs) {
  const slabMidX = (s.x1 + s.x2) / 2;
  const slabMidZ = (s.z1 + s.z2) / 2;
  const angle = (Math.atan2(slabMidZ, slabMidX) + Math.PI * 2) % (Math.PI * 2);
  const insideHatch = (angle >= hatchStart && angle <= hatchEnd);
  assert(!insideHatch, `Slab generated inside stairwell hatch at angle ${(angle * 180 / Math.PI).toFixed(1)}°!`);
}
console.log(`   ✓ annularDeck: ${B2.slabs.length}/16 segments active. Hatch from 0° to ${(hatchEnd * 180 / Math.PI).toFixed(1)}° is 100% open with unobstructed headroom!`);

// Test 4: sweptRibbon
console.log('4. Testing sweptRibbon organic ribbon surface generation...');
const B3 = createMockBuilder();
const ribbonRes = sweptRibbon(B3, [[0, 0, 0], [5, 2, 5], [10, 0, 10]], {
  samples: 8,
  width: 1.5,
  ink: INK.GREEN
});
assert.strictEqual(B3.geos.length, 1, 'sweptRibbon must emit 1 ribbon geometry');
const ribbonPos = B3.geos[0].g.getAttribute('position');
assert.strictEqual(ribbonPos.count, 18, '9 ribbon rungs x 2 vertices = 18 vertices');
console.log(`   ✓ sweptRibbon: ${ribbonPos.count} ribbon vertices generated cleanly.`);

console.log('\n🎉 ALL PHASE 1 SPLINE & CURVE ENGINE TESTS PASSED 100%!\n');
