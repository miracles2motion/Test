import * as THREE from 'three';
import {
  buildAncientTree,
  buildPineTree,
  buildWillowTree,
  buildGiantMushroom,
  buildHollowLog,
  buildFernCluster,
  buildGrassClump,
  buildSuspensionBridge,
  buildFullGalleon,
  PREFAB_REGISTRY,
  instantiatePrefab
} from '../src/prefabs.js';
import { INK } from '../src/render.js';

console.log('=== VERIFYING PROCEDURAL 3D PREFABS & TEACHING REGISTRY ===\n');

// Mock Builder
function createMockBuilder() {
  const colliders = [];
  const rings = [];
  const pickups = [];
  const boxes = [];
  const cyls = [];
  const cones = [];
  const spheres = [];
  const stairs = [];

  const B = {
    box: (x, y, z, w, h, d, o = {}) => {
      boxes.push({ x, y, z, w, h, d, o });
      if (!o.noCollide) colliders.push({ type: 'box', x, y, z, w, h, d });
    },
    slab: (x1, z1, x2, z2, y, t = 0.4, o = {}) => {
      boxes.push({ x: (x1 + x2) / 2, y, z: (z1 + z2) / 2, w: Math.abs(x2 - x1), h: t, d: Math.abs(z2 - z1), o });
      if (!o.noCollide) colliders.push({ type: 'slab', y });
    },
    cyl: (x, y, z, r, h, o = {}) => {
      cyls.push({ x, y, z, r, h, o });
      if (!o.noCollide) colliders.push({ type: 'cyl', x, y, z, r, h });
    },
    cone: (x, y, z, r, h, o = {}) => {
      cones.push({ x, y, z, r, h, o });
      if (!o.noCollide) colliders.push({ type: 'cone', x, y, z, r, h });
    },
    sphere: (x, y, z, r, o = {}) => {
      spheres.push({ x, y, z, r, o });
    },
    wedge: (x, y, z, w, h, d, o = {}) => {
      if (!o.noCollide) colliders.push({ type: 'wedge', x, y, z, w, h, d });
    },
    rail: (x1, z1, x2, z2, y, o = {}) => {
      colliders.push({ type: 'rail', y });
    },
    stairs: (x, y, z, dir, steps, w, o = {}) => {
      stairs.push({ x, y, z, steps, w, o });
      colliders.push({ type: 'stairs', steps });
    },
    ring: (x, y, z, axis = 'z') => {
      rings.push({ x, y, z, axis });
    },
    pickup: (x, y, z) => {
      pickups.push({ x, y, z });
    },
    barrel: (x, y, z, r, h, o = {}) => {
      cyls.push({ x, y, z, r, h, o });
      colliders.push({ type: 'barrel', x, y, z });
    }
  };

  return { B, colliders, rings, pickups, boxes, cyls, cones, spheres, stairs };
}

let allPassed = true;

// [TEST 1] Ancient Tree
{
  const { B, colliders, rings, pickups } = createMockBuilder();
  buildAncientTree(B, 0, 0, 0);
  const ok = colliders.length > 10 && rings.length >= 3 && pickups.length >= 1;
  console.log(`[TEST 1] Ancient Tree: ${colliders.length} colliders, ${rings.length} rings, ${pickups.length} pickups => ${ok ? 'PASS' : 'FAIL'}`);
  if (!ok) allPassed = false;
}

// [TEST 2] Pine Tree
{
  const { B, colliders, rings, cones } = createMockBuilder();
  buildPineTree(B, 10, 0, 10);
  const ok = cones.length === 3 && rings.length >= 1 && colliders.length >= 2;
  console.log(`[TEST 2] Alpine Pine Tree: ${cones.length} cones, ${rings.length} rings, ${colliders.length} colliders => ${ok ? 'PASS' : 'FAIL'}`);
  if (!ok) allPassed = false;
}

// [TEST 3] Weeping Willow Tree
{
  const { B, rings, spheres, cyls } = createMockBuilder();
  buildWillowTree(B, -10, 0, 10);
  const ok = spheres.length >= 1 && rings.length >= 1 && cyls.length >= 8;
  console.log(`[TEST 3] Weeping Willow Tree: ${spheres.length} spheres, ${cyls.length} vine cylinders => ${ok ? 'PASS' : 'FAIL'}`);
  if (!ok) allPassed = false;
}

// [TEST 4] Giant Mushroom
{
  const { B, colliders, rings } = createMockBuilder();
  buildGiantMushroom(B, 20, 0, 0);
  const ok = colliders.length >= 2 && rings.length >= 1;
  console.log(`[TEST 4] Giant Mushroom: ${colliders.length} colliders, ${rings.length} rings => ${ok ? 'PASS' : 'FAIL'}`);
  if (!ok) allPassed = false;
}

// [TEST 5] Hollow Log Tunnel
{
  const { B, colliders, rings } = createMockBuilder();
  buildHollowLog(B, 0, 0, -20, 12);
  const ok = colliders.length >= 3 && rings.length === 2;
  console.log(`[TEST 5] Hollow Log Tunnel: ${colliders.length} colliders, ${rings.length} mouth rings => ${ok ? 'PASS' : 'FAIL'}`);
  if (!ok) allPassed = false;
}

// [TEST 6] Full Pirate Galleon Warship
{
  const { B, colliders, rings, stairs, pickups } = createMockBuilder();
  buildFullGalleon(B, 0, 0, 0);
  const ok = colliders.length >= 12 && rings.length === 3 && stairs.length >= 2 && pickups.length >= 1;
  console.log(`[TEST 6] Full Pirate Galleon Warship: ${colliders.length} colliders, ${rings.length} crow's nest rings, ${stairs.length} stairways => ${ok ? 'PASS' : 'FAIL'}`);
  if (!ok) allPassed = false;
}

// [TEST 7] Grass Clumps and Fern Clusters
{
  const { B, boxes } = createMockBuilder();
  buildGrassClump(B, 5, 0, 5, 8);
  buildFernCluster(B, -5, 0, -5);
  const ok = boxes.length >= 12;
  console.log(`[TEST 7] Flora (Grass & Ferns): ${boxes.length} vegetative elements => ${ok ? 'PASS' : 'FAIL'}`);
  if (!ok) allPassed = false;
}

// [TEST 8] Dynamic Prefab Registry & Instantiate Helper
{
  const registeredKeys = Object.keys(PREFAB_REGISTRY);
  const hasTrees = registeredKeys.includes('ancient_tree') && registeredKeys.includes('pine_tree');
  const hasGalleon = registeredKeys.includes('full_galleon');
  const hasFlora = registeredKeys.includes('grass_clump') && registeredKeys.includes('fern_cluster');
  
  const { B, colliders } = createMockBuilder();
  const spawned = instantiatePrefab(B, 'ancient_tree', 30, 0, 30);
  const ok = hasTrees && hasGalleon && hasFlora && spawned && colliders.length > 5;
  console.log(`[TEST 8] PREFAB_REGISTRY: ${registeredKeys.length} registered prefabs, dynamic spawn => ${ok ? 'PASS' : 'FAIL'}`);
  if (!ok) allPassed = false;
}

// [TEST 9] Small Forest Tactical Structures & Micro-Props
{
  const { B, colliders, boxes, cyls } = createMockBuilder();
  const { buildCampfire, buildWoodStack, buildTrailSign, buildChoppingBlock, buildLoggingCart, buildHollowStump, buildToadstoolCluster, buildSurveyTable } = await import('../src/prefabs.js');
  buildCampfire(B, 0, 0, 0);
  buildWoodStack(B, 5, 0, 5);
  buildTrailSign(B, 10, 0, 10);
  buildChoppingBlock(B, 15, 0, 15);
  buildLoggingCart(B, 20, 0, 20);
  buildHollowStump(B, 25, 0, 25);
  buildToadstoolCluster(B, 30, 0, 30);
  buildSurveyTable(B, 35, 0, 35);
  const ok = colliders.length >= 8 && boxes.length >= 10 && cyls.length >= 8;
  console.log(`[TEST 9] Small Tactical Structures (Campfire, WoodStack, Cart, Stump, Table): ${colliders.length} colliders, ${boxes.length} boxes, ${cyls.length} cyls => ${ok ? 'PASS' : 'FAIL'}`);
  if (!ok) allPassed = false;
}

console.log('\n' + '='.repeat(60));
if (allPassed) {
  console.log('🎉 ALL 9 PROCEDURAL PREFAB VERIFICATION TESTS PASSED!');
  process.exit(0);
} else {
  console.error('❌ SOME PREFAB VERIFICATION TESTS FAILED!');
  process.exit(1);
}
