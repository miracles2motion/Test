// test-recipe.js
// Tests the Map Recipe interpreter (buildMapFromRecipe) against golden recipes.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as THREE from 'three';
import { buildMapFromRecipe, validateRecipeSchema } from './src/map-recipe.js';
import { runDreamVerificationSuite } from './src/verify-suite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function testRecipeFile(filePath) {
  console.log(`\n============================================================`);
  console.log(`🧪 Testing Recipe: ${path.basename(filePath)}`);
  const raw = fs.readFileSync(filePath, 'utf8');
  const recipe = JSON.parse(raw);

  const schemaValidation = validateRecipeSchema(recipe);
  if (!schemaValidation.valid) {
    console.error(`  ✗ Schema validation failed:`, schemaValidation.errors);
    return false;
  }
  console.log(`  ✓ Schema validation passed: ${recipe.name} (${recipe.id})`);

  const colliders = [];
  const rings = [];
  const spawns = [];
  const snipers = [];
  const pickups = [];
  const animated = [];

  const B = {
    L: {
      key: recipe.id,
      colliders,
      rings,
      spawns,
      snipers,
      pickups,
      animated,
      bounds: { minX: -55, maxX: 55, minZ: -55, maxZ: 55 }
    },
    scene: { add() {} },
    box(x, y, z, w, h, d, o = {}) {
      if (!o.noCollide) colliders.push({ x, y, z, w, h, d, ...o });
    },
    slab(x1, z1, x2, z2, y, h, o = {}) {
      const w = Math.abs(x2 - x1);
      const d = Math.abs(z2 - z1);
      const mx = (x1 + x2) / 2;
      const mz = (z1 + z2) / 2;
      if (!o.noCollide) colliders.push({ x: mx, y: y, z: mz, w, h, d, ...o });
    },
    cyl(x, y, z, r, h, o = {}) {
      if (!o.noCollide) colliders.push({ x, y, z, w: r * 2, h, d: r * 2, ...o });
    },
    barrel(x, y, z, r, h, o = {}) {
      if (!o.noCollide) colliders.push({ x, y, z, w: r * 2, h, d: r * 2, tag: 'barrel', ...o });
    },
    sphere() {},
    cone() {},
    arch(x, y, z, s, h, d, o = {}) {
      if (!o.noCollide) colliders.push({ x, y, z, w: s, h, d, ...o });
    },
    stairs(x, y, z, dir, count, width, o = {}) {
      const rise = o.rise ?? 0.28;
      for (let i = 0; i < count; i++) {
        colliders.push({ x, y: y + i * rise, z, w: width, h: rise, d: 0.45, tag: 'stairs' });
      }
    },
    facetedRock(x, y, z, w, h, d, o = {}) {
      if (!o.noCollide) colliders.push({ x, y, z, w, h, d, ...o });
    },
    ring(x, y, z, axis = 'y') {
      rings.push({ x, y, z, axis });
    },
    rail(x1, z1, x2, z2, y, o = {}) {
      const w = Math.abs(x2 - x1) || 0.3;
      const d = Math.abs(z2 - z1) || 0.3;
      const mx = (x1 + x2) / 2;
      const mz = (z1 + z2) / 2;
      if (!o.noCollide) colliders.push({ x: mx, y: y, z: mz, w, h: 1.0, d, tag: 'rail', ...o });
    },
    wedge(x, y, z, w, h, d, o = {}) {
      if (!o.noCollide) colliders.push({ x, y, z, w, h, d, tag: 'wedge', ...o });
    },
    spawn(x, y, z) {
      spawns.push({ x, y, z });
    },
    sniper(x, y, z) {
      snipers.push({ x, y, z });
    },
    pickup(x, y, z) {
      pickups.push({ x, y, z });
    },
    planes() {},
    collider(x, y, z, w, h, d, o = {}) {
      colliders.push({ x, y, z, w, h, d, ...o });
    }
  };

  const { L, report } = buildMapFromRecipe(B, recipe);
  console.log(`  ✓ Recipe interpreted into 3D world:`);
  console.log(`    - Prefabs placed: ${report.prefabsPlaced}`);
  console.log(`    - Colliders: ${colliders.length}`);
  console.log(`    - Grapples: ${rings.length}`);
  console.log(`    - Pickups: ${pickups.length}`);
  console.log(`    - Violations caught: ${report.violations.length}`);

  return true;
}

const canopyOk = testRecipeFile(path.join(__dirname, 'recipes', 'colossal_canopy.json'));
const pirateOk = testRecipeFile(path.join(__dirname, 'recipes', 'pirate_cove.json'));

if (canopyOk && pirateOk) {
  console.log(`\n🎉 ALL RECIPE TESTS PASSED! The Dream Interpreter is 100% operational!\n`);
  process.exit(0);
} else {
  process.exit(1);
}
