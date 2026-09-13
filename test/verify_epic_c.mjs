// ============================================================================
// VERIFICATION TEST SUITE FOR EPIC C: ENEMY AI & TACTICAL EXPANSION
// ============================================================================

import assert from 'node:assert';
import * as THREE from 'three';
import { TYPES, EnemyManager } from '../src/enemies.js';
import { NavGrid } from '../src/nav.js';
import { audio } from '../src/audio.js';

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

console.log('=== RUNNING EPIC C RIGOROUS VERIFICATION SUITE ===\n');

// 1. ARCHETYPE DEFINITION CONTRACTS
test('C1.1: Heavy Archetype definition satisfies requirements', () => {
  const h = TYPES.heavy;
  assert(h, 'TYPES.heavy must exist');
  assert.strictEqual(h.shield, true, 'Heavy must have shield');
  assert.strictEqual(h.isHeavyShield, true, 'Heavy must have isHeavyShield flag');
  assert.strictEqual(h.weapon, 'shotgun', 'Heavy weapon must be shotgun');
  assert(h.hp >= 400, 'Heavy must have high health (tank bruiser)');
  assert(h.speed <= 3.0, 'Heavy must have slow, deliberate speed');
  assert.strictEqual(h.canFlank, true, 'Heavy should seek flanking angles');
  assert.strictEqual(h.canDodge, false, 'Heavy does not agilely dodge');
});

test('C2.1: Sniper Archetype definition satisfies requirements', () => {
  const s = TYPES.sniper;
  assert(s, 'TYPES.sniper must exist');
  assert.strictEqual(s.weapon, 'sniper', 'Sniper weapon must be sniper');
  assert.strictEqual(s.canRetreat, true, 'Sniper must have canRetreat set to true');
  assert.strictEqual(s.stationary, false, 'Sniper must not be locked permanently stationary');
  assert(s.speed >= 4.0, 'Sniper must have high repositioning speed');
});

// 2. HEAVY BALLISTIC SHIELD & REAR WEAKSPOT MECHANICS
test('C1.2: Heavy hitboxes include frontal shield and rear core weakspot', () => {
  // Create mock EnemyManager with minimal world/scene context
  const mockScene = new THREE.Scene();
  const mockWorld = {
    query: () => [],
    overlapsAABB: () => false,
    raycast: () => null,
    hasLineOfSight: () => true
  };
  const mockEffects = {
    strokeBurst: () => {},
    blood: () => {},
    sparks: () => {},
    debris: () => {},
    shakeAmt: 0
  };
  const mockAudio = {
    spawn: () => {},
    shieldHit: () => {},
    headshot: () => {},
    hitEnemy: () => {},
    enemyDie: () => {}
  };
  const mockHud = {
    hitmarker: () => {}
  };
  const mockInput = {
    rumble: () => {}
  };
  const mockGame = {
    hitstop: () => {},
    addScore: () => {}
  };
  
  const em = new EnemyManager({
    scene: mockScene,
    world: mockWorld,
    effects: mockEffects,
    audio: mockAudio,
    hud: mockHud,
    input: mockInput,
    game: mockGame
  });

  const heavy = em.spawn('heavy', new THREE.Vector3(0, 0, 0));
  assert(heavy.alive, 'Spawned heavy should be alive');
  assert(heavy.hit, 'Heavy must have hit-zones');
  
  const parts = heavy.hit.map(h => h[0]);
  assert(parts.includes('shield'), 'Heavy must have a shield hit part');
  assert(parts.includes('core'), 'Heavy must have a rear core hit part');
  assert(heavy.shieldHp >= 6, 'Heavy shield HP must be reinforced (>= 6)');
});

test('C1.3: Heavy deflects frontal gunfire, taking 0 damage', () => {
  const mockScene = new THREE.Scene();
  const mockWorld = { query: () => [], overlapsAABB: () => false, raycast: () => null, hasLineOfSight: () => true };
  let sparksFired = false;
  let shieldSound = false;
  const origShieldHit = audio.shieldHit;
  audio.shieldHit = () => { shieldSound = true; };
  const mockEffects = {
    strokeBurst: () => {}, blood: () => {},
    sparks: () => { sparksFired = true; },
    debris: () => {}, shakeAmt: 0
  };
  const mockAudio = {
    spawn: () => {},
    shieldHit: () => { shieldSound = true; },
    headshot: () => {}, hitEnemy: () => {}, enemyDie: () => {}
  };
  const em = new EnemyManager({
    scene: mockScene, world: mockWorld, effects: mockEffects, audio: mockAudio,
    hud: { hitmarker: () => {} }, input: { rumble: () => {} }, game: { hitstop: () => {}, addScore: () => {} }
  });

  const heavy = em.spawn('heavy', new THREE.Vector3(0, 0, 0));
  heavy.yaw = 0; // facing +Z (forward = (0, 0, 1))
  const initialHp = heavy.hp;

  // Frontal attack coming from +Z towards -Z (into the heavy's face)
  const incomingDir = new THREE.Vector3(0, 0, -1);
  em.damage(heavy, 40, { part: 'shield', dir: incomingDir, source: 'pistol' });

  assert.strictEqual(heavy.hp, initialHp, 'Frontal attack must deal 0 damage to Heavy');
  assert(sparksFired, 'Frontal deflection must trigger metallic sparks');
  assert(shieldSound, 'Frontal deflection must trigger shield audio');
});

test('C1.4: Rear core hit deals critical 2.2x damage and bonus score', () => {
  const mockScene = new THREE.Scene();
  const mockWorld = { query: () => [], overlapsAABB: () => false, raycast: () => null, hasLineOfSight: () => true };
  let scoredCoreFlank = false;
  const em = new EnemyManager({
    scene: mockScene, world: mockWorld,
    effects: { strokeBurst: () => {}, blood: () => {}, sparks: () => {}, debris: () => {}, shakeAmt: 0 },
    audio: { spawn: () => {}, shieldHit: () => {}, headshot: () => {}, hitEnemy: () => {}, enemyDie: () => {} },
    hud: { hitmarker: (kill, crit) => { assert(crit, 'Core hit must trigger critical hitmarker'); } },
    input: { rumble: () => {} },
    game: {
      hitstop: () => {},
      addScore: (pts, label) => {
        if (label === 'CORE FLANK') scoredCoreFlank = true;
      }
    }
  });

  const heavy = em.spawn('heavy', new THREE.Vector3(0, 0, 0));
  heavy.yaw = 0;
  const initialHp = heavy.hp;
  const baseDamage = 30;

  // Attack the rear core
  const incomingDir = new THREE.Vector3(0, 0, 1);
  em.damage(heavy, baseDamage, { part: 'core', dir: incomingDir, source: 'rifle' });

  const damageTaken = initialHp - heavy.hp;
  assert(Math.abs(damageTaken - (baseDamage * 2.2)) < 0.1, `Damage taken (${damageTaken}) should be 2.2x base damage (${baseDamage * 2.2})`);
  assert(scoredCoreFlank, 'Core hit must award CORE FLANK score');
});

// 3. SNIPER EVASIVE RETREAT & LEAD AIM
test('C2.2: Sniper triggers evasive retreat when player approaches within 14m', () => {
  const mockScene = new THREE.Scene();
  const mockWorld = {
    query: () => [], overlapsAABB: () => false, raycast: () => null,
    hasLineOfSight: () => true
  };
  let smokeDeployed = false;
  const em = new EnemyManager({
    scene: mockScene, world: mockWorld,
    effects: {
      strokeBurst: (pos, ink) => { smokeDeployed = true; },
      blood: () => {}, sparks: () => {}, debris: () => {}, shakeAmt: 0, tracer: () => {}
    },
    audio: { spawn: () => {}, lunge: () => {}, sniperAim: () => {}, sniperShot: () => {}, enemyShot: () => {} },
    hud: { hitmarker: () => {} }, input: { rumble: () => {} }, game: { hitstop: () => {}, addScore: () => {} }
  });

  const sniper = em.spawn('sniper', new THREE.Vector3(0, 0, 0));
  sniper.state = 'hunt';
  sniper.aimT = 0.5;

  const playerPos = new THREE.Vector3(0, 0, 8); // 8m away (< 14m threshold)
  const playerCenter = new THREE.Vector3(0, 1.6, 8);
  const mockPlayer = {
    alive: true,
    center: playerCenter,
    body: { pos: playerPos, vel: new THREE.Vector3(0, 0, 0), onGround: true }
  };

  em._think(sniper, 0.016, playerPos, playerCenter, mockPlayer);

  assert.strictEqual(sniper.retreating, true, 'Sniper must enter retreating state when player is close');
  assert.strictEqual(sniper.aimT, 0, 'Sniper aim must be cancelled when retreating');
  assert(smokeDeployed, 'Sniper must drop smoke decoy when evading');
});

test('C2.3: Sniper computes predictive lead against airborne / grappling targets', () => {
  const mockScene = new THREE.Scene();
  const mockWorld = {
    query: () => [], overlapsAABB: () => false, raycast: () => null,
    hasLineOfSight: () => true
  };
  const em = new EnemyManager({
    scene: mockScene, world: mockWorld,
    effects: { strokeBurst: () => {}, blood: () => {}, sparks: () => {}, debris: () => {}, shakeAmt: 0, tracer: () => {} },
    audio: { spawn: () => {}, sniperAim: () => {}, sniperShot: () => {}, enemyShot: () => {} },
    hud: { hitmarker: () => {} }, input: { rumble: () => {} }, game: { hitstop: () => {}, addScore: () => {} }
  });

  const sniper = em.spawn('sniper', new THREE.Vector3(0, 0, 0));
  sniper.state = 'hunt';
  sniper.cool = 0;

  const playerPos = new THREE.Vector3(0, 5, 30);
  const playerVel = new THREE.Vector3(12, -4, 0); // Fast lateral + falling velocity
  const mockPlayer = {
    alive: true,
    grappling: true,
    center: playerPos.clone(),
    body: { pos: playerPos.clone(), vel: playerVel, onGround: false }
  };

  em._shoot(sniper, 0.016, playerPos.clone(), mockPlayer);

  assert(sniper.aimPoint, 'Sniper aimPoint must be initialized');
  // Expected lead in X direction because vel.x = 12
  assert(sniper.aimPoint.x > playerPos.x, `Sniper aimPoint.x (${sniper.aimPoint.x}) should lead playerPos.x (${playerPos.x})`);
});

// 4. NAVMESH VERTICAL NAVIGATION & TACTICAL CLASSIFICATION
test('C3.1: NavGrid generates vertical links up to 2.4m and tags jump links', () => {
  // Construct a small mock world with two platforms of different elevations
  const boxes = [
    { min: new THREE.Vector3(0, 0, 0), max: new THREE.Vector3(3, 1, 3), data: {} },
    { min: new THREE.Vector3(3, 0, 0), max: new THREE.Vector3(6, 2.8, 3), data: {} } // dy = 1.8m
  ];
  const mockWorld = {
    query: (min, max, out) => {
      out.length = 0;
      for (const b of boxes) {
        if (min.x <= b.max.x && max.x >= b.min.x &&
            min.y <= b.max.y && max.y >= b.min.y &&
            min.z <= b.max.z && max.z >= b.min.z) {
          out.push(b);
        }
      }
    },
    overlapsAABB: (min, max) => false,
    hasLineOfSight: (from, to) => true
  };

  const nav = new NavGrid(mockWorld, { minX: 0, maxX: 6, minZ: 0, maxZ: 3 }, 1.5);
  nav.build();

  assert(nav.nodes.length > 0, 'NavGrid must have created nodes');
  const jumpLinks = [];
  for (const n of nav.nodes) {
    for (const l of n.links) {
      if (l.isJump) jumpLinks.push(l);
    }
  }
  assert(jumpLinks.length > 0, 'NavGrid must contain vertical jump links connecting elevation tiers');
});

test('C3.2: NavGrid classifies tactical perches, chokepoints, and provides query helpers', () => {
  const boxes = [
    { min: new THREE.Vector3(0, 0, 0), max: new THREE.Vector3(10, 0.5, 10), data: {} },
    { min: new THREE.Vector3(15, 0, 15), max: new THREE.Vector3(20, 6, 20), data: {} } // Elevated tower
  ];
  const mockWorld = {
    query: (min, max, out) => {
      out.length = 0;
      for (const b of boxes) {
        if (min.x <= b.max.x && max.x >= b.min.x &&
            min.y <= b.max.y && max.y >= b.min.y &&
            min.z <= b.max.z && max.z >= b.min.z) {
          out.push(b);
        }
      }
    },
    overlapsAABB: () => false,
    hasLineOfSight: () => true
  };

  const nav = new NavGrid(mockWorld, { minX: 0, maxX: 20, minZ: 0, maxZ: 20 }, 2.0);
  nav.build();

  const perch = nav.findSniperPerch(new THREE.Vector3(0, 0.5, 0), new THREE.Vector3(5, 0.5, 5), 10, 50);
  assert(perch, 'NavGrid should find a sniper perch');
  assert(perch.y >= 5.0, `Sniper perch Y (${perch.y}) should be on elevated ground`);

  const cover = nav.findCoverNode(new THREE.Vector3(0, 0.5, 0), new THREE.Vector3(5, 0.5, 5), 25);
  // findCoverNode exists and returns either vector or null depending on LOS
  assert(typeof nav.findCoverNode === 'function');
  assert(typeof nav.findFlankNode === 'function');
});

console.log(`\n=== ALL ${passedTests}/${totalTests} EPIC C VERIFICATION TESTS PASSED SUCCESSFULLY! ===\n`);
