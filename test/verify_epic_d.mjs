// ============================================================================
// VERIFICATION TEST SUITE FOR EPIC D: THE LEVEL ARCHITECTURE
// ============================================================================

import assert from 'node:assert';
import * as THREE from 'three';
import { buildLibrary } from '../src/levels/library.js';
import { MAP_BUILDERS, LEVELS } from '../src/level.js';
import { spawnManager } from '../src/spawns.js';
import { buildBookStack, buildDeskLamp, buildOpenBookRamp, buildInkwellCover } from '../src/prefabs.js';

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  [FAIL] ${name}:`, err.message);
    throw err;
  }
}

console.log('=== RUNNING EPIC D RIGOROUS VERIFICATION SUITE ===\n');

// Mock builder context for building maps and prefabs
function createMockBuilder() {
  const L = {
    key: '',
    spawns: [],
    snipers: [],
    pickups: [],
    rings: [],
    meshes: [],
    playerStart: new THREE.Vector3(0, 0, 0),
    bounds: { minX: -50, maxX: 50, minZ: -50, maxZ: 50 },
    arenaSpawns: [],
    teamSpawns: []
  };
  const boxes = [];
  const colliders = [];
  const cyls = [];
  const stairsList = [];
  const ringsList = [];

  const box = (x, y, z, w, h, d, o = {}) => {
    boxes.push({ x, y, z, w, h, d, o });
    if (!o.noCollide) colliders.push({ min: { x: x - w/2, y, z: z - d/2 }, max: { x: x + w/2, y: y + h, z: z + d/2 }, tag: o.tag });
  };
  const slab = (x1, z1, x2, z2, y, t = 0.4, o = {}) => {
    box((x1 + x2) / 2, y - t, (z1 + z2) / 2, Math.abs(x2 - x1), t, Math.abs(z2 - z1), o);
  };
  const cyl = (x, y, z, r, h, o = {}) => {
    cyls.push({ x, y, z, r, h, o });
    if (!o.noCollide) colliders.push({ min: { x: x - r, y, z: z - r }, max: { x: x + r, y: y + h, z: z + r }, tag: o.tag });
  };
  const stairs = (x, y, z, dir, steps, w, o = {}) => {
    stairsList.push({ x, y, z, dir, steps, w, o });
  };
  const ring = (x, y, z, axis = 'z') => {
    ringsList.push({ x, y, z, axis });
    L.rings.push(new THREE.Vector3(x, y, z));
  };
  const spawn = (x, y, z) => L.spawns.push(new THREE.Vector3(x, y, z));
  const sniper = (x, y, z) => L.snipers.push(new THREE.Vector3(x, y, z));
  const pickup = (x, y, z) => L.pickups.push(new THREE.Vector3(x, y, z));
  const planes = () => {};
  const rail = () => {};
  const sphere = (x, y, z, r, o = {}) => {};
  const barrel = () => {};
  const addGeo = () => {};
  const collider = (x, y, z, w, h, d, o = {}) => {
    colliders.push({ min: { x: x - w/2, y, z: z - d/2 }, max: { x: x + w/2, y: y + h, z: z + d/2 }, tag: o.tag });
  };
  const finish = () => L;

  return {
    B: { L, box, slab, cyl, stairs, ring, spawn, sniper, pickup, planes, rail, sphere, barrel, addGeo, collider, finish },
    L,
    boxes,
    colliders,
    cyls,
    stairsList,
    ringsList
  };
}

// 1. PREFAB LIBRARY VERIFICATION
test('D1.1: Library prefabs generate valid composite geometry', () => {
  const { B, boxes, cyls, stairsList, ringsList } = createMockBuilder();

  // Test buildBookStack
  const topY = buildBookStack(B, 0, 0, 0, 4, { w: 8, d: 10, thick: 1.0 });
  assert.strictEqual(topY, 4.0, 'Book stack of 4 with thickness 1.0 must reach Y=4.0');
  assert(boxes.length >= 4, 'Book stack must generate box geometry for each volume');

  // Test buildOpenBookRamp
  buildOpenBookRamp(B, 10, 0, 10, 6, 4, 8, '+z');
  assert(stairsList.length >= 1, 'Open book ramp must register a stepped climbing corridor');

  // Test buildDeskLamp
  buildDeskLamp(B, -15, 0, -15, { reachX: 6, reachZ: 0 });
  assert(cyls.length > 0, 'Desk lamp must have structural mast cylinders');
  assert(ringsList.length >= 2, 'Desk lamp must contain at least 2 grapple rings (canopy + knuckle)');

  // Test buildInkwellCover
  buildInkwellCover(B, 20, 0, 20);
  assert(cyls.some(c => c.o.seg === 8), 'Inkwell cover must generate octagonal cylinder geometry');
  assert(ringsList.some(r => r.x > 20), 'Inkwell quill must have a tip grapple ring');
});

// 2. THE LIBRARY LEVEL ARCHITECTURE VERIFICATION
test('D1.2: "The Library" map generates competitive 3-lane structure and layout', () => {
  const { B, L, boxes, colliders, cyls } = createMockBuilder();
  const level = buildLibrary(B, false);

  assert.strictEqual(level.key, 'library', 'Map key must be "library"');
  assert(level.bounds.maxX >= 50, 'Library map must have colossal perimeter bounds (>= 50m)');

  // Mid Lane: Grand Desktop Arena at Y = 6.0m
  const desktop = boxes.find(b => b.o.tag === 'desk');
  assert(desktop, 'Mid Lane must feature the Grand Desk arena platform');
  assert.strictEqual(desktop.y, 5.4, 'Desktop slab top surface must sit at Y=6.0m');

  // West Lane: Bookcase Catwalks with sniper perches
  assert(level.snipers.length >= 4, 'Map must contain elevated sniper perches');
  const westSnipers = level.snipers.filter(s => s.x < -30);
  assert(westSnipers.length >= 2, 'West Lane must feature high-ground bookcase sniper perches');
  assert(westSnipers.some(s => s.y >= 13.0), 'West Lane must feature high bookshelf perch at Y >= 13m');

  // East Lane: Under-Desk Catacombs
  const eastGroundSpawns = level.spawns.filter(s => s.x > 25 && s.y <= 1.0);
  assert(eastGroundSpawns.length >= 2, 'East Lane must feature under-desk catacomb spawns');

  // Vertical grapple points
  assert(level.rings.length >= 6, 'Library must have at least 6 grapple momentum swing anchors');
  assert(level.rings.some(r => r.y >= 14.0), 'Library must feature high-altitude aerial grapple rings');
});

test('D1.3: "The Library" map is registered in master MAP_BUILDERS and LEVELS catalog', () => {
  assert(typeof MAP_BUILDERS.library === 'function', 'MAP_BUILDERS.library must be a callable builder function');
  assert(typeof MAP_BUILDERS.tomes === 'function', 'MAP_BUILDERS.tomes alias must be a callable builder function');

  const libraryEntry = LEVELS.find(m => m.key === 'library');
  assert(libraryEntry, 'LEVELS catalog must contain "library"');
  assert.strictEqual(libraryEntry.category, 'colossal', 'Library category must be colossal');
  assert(!libraryEntry.comingSoon, 'The Library must be fully active and playable');
});

// 3. SPAWN MANAGER ANTI-SPAWN-TRAPPING & SIGHTLINE SAFETY VERIFICATION
test('D2.1: SpawnManager severely penalizes spawns within dangerous proximity (< 12m)', () => {
  const spotDanger = new THREE.Vector3(0, 0, 0);
  const spotSafe = new THREE.Vector3(0, 0, 25);

  const threats = [
    { pos: new THREE.Vector3(0, 0, 4) } // 4m away from spotDanger, 21m away from spotSafe
  ];

  const dangerScore = spawnManager.scoreSpawn(spotDanger, threats);
  const safeScore = spawnManager.scoreSpawn(spotSafe, threats);

  assert(dangerScore < 0, `Danger score (${dangerScore}) must be negative due to proximity penalty`);
  assert(safeScore > 50, `Safe score (${safeScore}) must be positive and healthy`);
  assert(safeScore > dangerScore + 300, 'Safe score must vastly outweigh danger score');
});

test('D2.2: SpawnManager penalizes unobstructed sightline to hostile aim vectors', () => {
  const spot = new THREE.Vector3(0, 0, 25);
  const threats = [{ pos: new THREE.Vector3(0, 0, 0) }];

  // World with direct line of sight
  const worldLOS = { hasLineOfSight: () => true };
  // World with blocked sightline (wall in between)
  const worldBlocked = { hasLineOfSight: () => false };

  const scoreWithLOS = spawnManager.scoreSpawn(spot, threats, worldLOS);
  const scoreBlocked = spawnManager.scoreSpawn(spot, threats, worldBlocked);

  assert(scoreBlocked > scoreWithLOS, `Blocked sightline (${scoreBlocked}) must score higher than direct LOS (${scoreWithLOS})`);
  assert.strictEqual(scoreBlocked - scoreWithLOS, spawnManager.losWeight, 'Difference must equal configured losWeight');
});

test('D2.3: SpawnManager pickBestSpawn never selects camp-trapped spawn point', () => {
  const spots = [
    new THREE.Vector3(0, 0, 2),   // Camped spot (2m from threat)
    new THREE.Vector3(0, 0, 5),   // Camped spot (5m from threat)
    new THREE.Vector3(0, 0, 26),  // Optimal tactical safe spot (26m from threat)
    new THREE.Vector3(0, 0, 30)   // Second safe spot (30m from threat)
  ];
  const threats = [{ pos: new THREE.Vector3(0, 0, 0) }];

  for (let i = 0; i < 20; i++) {
    const picked = spawnManager.pickBestSpawn(spots, threats);
    assert(picked.z >= 20, `Picked spawn point (z=${picked.z}) must be from the safe pool, never camped`);
  }
});

test('D2.4: SpawnManager evaluates team spawn flips when enemy forces breach base', () => {
  const team0Spawns = [new THREE.Vector3(0, 0, 40), new THREE.Vector3(5, 0, 42)];
  const team1Spawns = [new THREE.Vector3(0, 0, -40), new THREE.Vector3(5, 0, -42)];

  // Scenario 1: Balanced match, no spawn camping
  const normalPlayers = [
    { pos: new THREE.Vector3(0, 0, 30), team: 0 },
    { pos: new THREE.Vector3(0, 0, -30), team: 1 }
  ];
  const normalResult = spawnManager.evaluateSpawnFlip(team0Spawns, team1Spawns, normalPlayers);
  assert.strictEqual(normalResult.flipped, false, 'Normal match should not trigger spawn flip');
  assert.strictEqual(normalResult.team0Active, team0Spawns);

  // Scenario 2: Team 1 pushes deep into Team 0 base zone (<20m from team0 center)
  const campedPlayers = [
    { pos: new THREE.Vector3(0, 0, 39), team: 1 },
    { pos: new THREE.Vector3(2, 0, 41), team: 1 },
    { pos: new THREE.Vector3(0, 0, 35), team: 0 }
  ];
  const flipResult = spawnManager.evaluateSpawnFlip(team0Spawns, team1Spawns, campedPlayers);
  assert.strictEqual(flipResult.flipped, true, 'Base invasion must trigger team spawn flip');
  assert.strictEqual(flipResult.team0Active, team1Spawns, 'Team 0 should now spawn at opposite safe base');
  assert.strictEqual(flipResult.team1Active, team0Spawns, 'Team 1 spawn zone updated accordingly');
});

console.log(`\n================================================================`);
console.log(`EPIC D VERIFICATION PASSED: ${passedTests}/${totalTests} tests successful!`);
console.log(`================================================================\n`);
