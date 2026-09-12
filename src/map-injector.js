#!/usr/bin/env node
/**
 * Doodle Strike - Non-Destructive Safe Spatial Prop Injector (God Mode)
 *
 * Dynamically scans the level's 3D bounds for empty volumetric pockets across
 * multiple vertical tiers (Ground, Mid, Upper), balances prop density across all
 * four map quadrants, and injects 20-40 theme-specific micro/meso props with
 * zero collisions.
 *
 * God Mode Features:
 *   - Octree-style dynamic spatial scanning (no more hardcoded positions)
 *   - Multi-tier injection (Y=0, Y=4.5, Y=9.0)
 *   - Quadrant density balancing
 *   - 5-Theme Prop Catalog (zen, cyber, steampunk, colossal, maritime)
 *
 * Usage:
 *   node src/map-injector.js <mapKey> [theme]
 *   npm run map:inject clockwork
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as THREE from 'three';
import { buildLevel, MAP_BUILDERS } from './level.js';
import { recordLearnedPattern } from './map-learning.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const mapArg = (process.argv[2] || '').toLowerCase().trim();
const themeArg = (process.argv[3] || 'cyber').toLowerCase().trim();

if (!mapArg || !MAP_BUILDERS[mapArg]) {
  console.log(`
💉 Doodle Strike - Safe Spatial Prop Injector (God Mode)
============================================================
Usage:
  npm run map:inject <mapKey> [theme]
============================================================
`);
  process.exit(1);
}

console.log(`============================================================`);
console.log(`💉 DYNAMIC SPATIAL PROP INJECTOR (GOD MODE): [${mapArg.toUpperCase()}]`);
console.log(`============================================================\n`);

// 1. Build level in memory to gather colliders & layout
const colliders = [];
const mockWorld = {
  addBox: (min, max, opts) => {
    const col = { min, max, opts, size: { x: max.x - min.x, y: max.y - min.y, z: max.z - min.z } };
    colliders.push(col);
    return col;
  },
  finalize: () => {}
};
const mockScene = { add: () => {} };

const levelObj = buildLevel(mockScene, mockWorld, mapArg);
const bounds = levelObj.bounds || { minX: -50, maxX: 50, minZ: -50, maxZ: 50 };

// 2. Volumetric Spatial Safety Check
function isBoxCollisionFree(cx, cy, cz, w, h, d, minClearance = 0.5) {
  const minX = cx - w / 2 - minClearance;
  const maxX = cx + w / 2 + minClearance;
  const minY = cy;
  const maxY = cy + h + minClearance;
  const minZ = cz - d / 2 - minClearance;
  const maxZ = cz + d / 2 + minClearance;

  for (const c of colliders) {
    if (c.opts && (c.opts.noCollide || c.opts.noNav)) continue;
    if (minX < c.max.x && maxX > c.min.x && minY < c.max.y && maxY > c.min.y && minZ < c.max.z && maxZ > c.min.z) {
      return false;
    }
  }

  // Check spawns and snipers
  for (const sp of levelObj.spawns || []) {
    if (Math.hypot(cx - sp.x, cz - sp.z) < 2.0 && Math.abs(cy - sp.y) < 2.5) return false;
  }
  for (const sn of levelObj.snipers || []) {
    if (Math.hypot(cx - sn.x, cz - sn.z) < 2.0 && Math.abs(cy - sn.y) < 2.5) return false;
  }
  return true;
}

// 3. 5-Theme Prop Catalog
const propCatalog = {
  zen: [
    { type: 'toro_lantern', w: 0.8, h: 1.6, d: 0.8, tier: 1, gen: (x, y, z) => `
  // Prop: Tōrō Lantern
  box(${x}, ${y}, ${z}, 0.8, 0.4, 0.8, { ink: BL });
  box(${x}, ${y} + 0.4, ${z}, 0.4, 0.6, 0.4, { ink: BK });
  box(${x}, ${y} + 1.0, ${z}, 0.6, 0.4, 0.6, { ink: OR });
  box(${x}, ${y} + 1.4, ${z}, 0.9, 0.2, 0.9, { ink: BK });
  sphere(${x}, ${y} + 1.6, ${z}, 0.15, { noCollide: true, ink: OR });` },
    { type: 'tatami_bench', w: 2.2, h: 0.6, d: 0.8, tier: 2, gen: (x, y, z) => `
  // Prop: Tatami Bench
  box(${x} - 0.9, ${y}, ${z}, 0.3, 0.5, 0.6, { ink: BK });
  box(${x} + 0.9, ${y}, ${z}, 0.3, 0.5, 0.6, { ink: BK });
  box(${x}, ${y} + 0.5, ${z}, 2.2, 0.15, 0.8, { ink: BL });` },
    { type: 'shoji_screen', w: 2.4, h: 2.2, d: 0.4, tier: 2, gen: (x, y, z) => `
  // Prop: Shoji Divider
  box(${x}, ${y}, ${z}, 2.4, 2.2, 0.1, { ink: BL });
  box(${x}, ${y}, ${z}, 2.5, 2.3, 0.15, { noCollide: true, ink: BK });` },
    { type: 'water_basin', w: 1.2, h: 0.9, d: 1.2, tier: 1, gen: (x, y, z) => `
  // Prop: Tsukubai Basin
  cyl(${x}, ${y}, ${z}, 0.6, 0.8, { seg: 8, ink: BL });
  cyl(${x}, ${y} + 0.8, ${z}, 0.5, 0.1, { seg: 8, noCollide: true, ink: RD });` }
  ],
  cyber: [
    { type: 'holo_terminal', w: 1.2, h: 1.5, d: 1.0, tier: 1, gen: (x, y, z) => `
  // Prop: Holo-Terminal
  box(${x}, ${y}, ${z}, 1.2, 1.0, 1.0, { ink: BL });
  box(${x}, ${y} + 1.0, ${z} + 0.2, 1.0, 0.5, 0.1, { noCollide: true, ink: OR });` },
    { type: 'server_rack', w: 2.0, h: 2.2, d: 1.0, tier: 2, gen: (x, y, z) => `
  // Prop: Server Rack
  box(${x}, ${y}, ${z}, 2.0, 2.2, 1.0, { ink: BK });
  box(${x}, ${y} + 0.2, ${z} + 0.5, 1.8, 0.4, 0.1, { noCollide: true, ink: OR });
  box(${x}, ${y} + 1.0, ${z} + 0.5, 1.8, 0.4, 0.1, { noCollide: true, ink: OR });` },
    { type: 'conduit_node', w: 1.0, h: 2.5, d: 1.0, tier: 2, gen: (x, y, z) => `
  // Prop: Conduit Node
  cyl(${x}, ${y}, ${z}, 0.5, 2.5, { seg: 6, ink: BK });
  cyl(${x}, ${y} + 1.0, ${z}, 0.6, 0.5, { seg: 6, noCollide: true, ink: OR });` },
    { type: 'neon_sign', w: 2.5, h: 1.5, d: 0.4, tier: 1, gen: (x, y, z) => `
  // Prop: Neon Billboard
  box(${x}, ${y}, ${z}, 2.5, 1.5, 0.2, { ink: BL });
  box(${x}, ${y}, ${z} + 0.1, 2.3, 1.3, 0.1, { noCollide: true, ink: OR });` }
  ],
  steampunk: [
    { type: 'brass_boiler', w: 1.8, h: 2.4, d: 1.8, tier: 2, gen: (x, y, z) => `
  // Prop: Brass Boiler
  cyl(${x}, ${y}, ${z}, 0.9, 2.4, { seg: 8, ink: BL });
  cyl(${x}, ${y} + 2.4, ${z}, 0.3, 0.8, { seg: 6, ink: BK });` },
    { type: 'gear_housing', w: 2.2, h: 2.0, d: 1.0, tier: 2, gen: (x, y, z) => `
  // Prop: Gear Housing
  box(${x}, ${y}, ${z}, 2.2, 1.0, 1.0, { ink: BL });
  cyl(${x}, ${y} + 1.0, ${z}, 1.0, 0.4, { seg: 12, orient: 'z', ink: OR });` },
    { type: 'pressure_gauge', w: 0.6, h: 1.6, d: 0.6, tier: 1, gen: (x, y, z) => `
  // Prop: Pressure Gauge Pillar
  cyl(${x}, ${y}, ${z}, 0.3, 1.2, { seg: 6, ink: BK });
  cyl(${x}, ${y} + 1.2, ${z}, 0.4, 0.4, { seg: 8, ink: OR });` }
  ],
  colossal: [
    { type: 'eraser_block', w: 1.6, h: 0.8, d: 2.4, tier: 1, gen: (x, y, z) => `
  // Prop: Colossal Eraser
  box(${x}, ${y}, ${z}, 1.6, 0.8, 2.4, { ink: OR });` },
    { type: 'pencil_cup', w: 2.0, h: 2.5, d: 2.0, tier: 2, gen: (x, y, z) => `
  // Prop: Pencil Cup
  cyl(${x}, ${y}, ${z}, 1.0, 2.0, { seg: 8, ink: BL });
  cyl(${x} - 0.3, ${y} + 2.0, ${z}, 0.2, 1.5, { seg: 6, ink: OR });
  cyl(${x} + 0.3, ${y} + 2.0, ${z} + 0.3, 0.2, 1.2, { seg: 6, ink: BK });` },
    { type: 'stapler_ramp', w: 1.2, h: 1.5, d: 3.5, tier: 2, gen: (x, y, z) => `
  // Prop: Stapler Cover
  box(${x}, ${y}, ${z}, 1.2, 0.4, 3.5, { ink: BK });
  box(${x}, ${y} + 0.4, ${z} + 1.0, 1.0, 1.1, 1.5, { ink: BL });` }
  ],
  maritime: [
    { type: 'cargo_crate', w: 1.8, h: 1.8, d: 1.8, tier: 1, gen: (x, y, z) => `
  // Prop: Cargo Crate
  box(${x}, ${y}, ${z}, 1.8, 1.8, 1.8, { ink: BL });
  box(${x}, ${y}, ${z}, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });` },
    { type: 'mooring_bollard', w: 1.0, h: 1.2, d: 1.0, tier: 1, gen: (x, y, z) => `
  // Prop: Mooring Bollard
  cyl(${x}, ${y}, ${z}, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(${x}, ${y} + 1.0, ${z}, 0.5, 0.2, { seg: 8, ink: BK });` },
    { type: 'timber_stack', w: 3.0, h: 1.0, d: 1.2, tier: 2, gen: (x, y, z) => `
  // Prop: Timber Stack
  box(${x}, ${y}, ${z}, 3.0, 1.0, 1.2, { ink: OR });` }
  ]
};

const defaultProps = [
  { type: 'tactical_block', w: 1.6, h: 1.1, d: 1.2, tier: 1, gen: (x, y, z) => `  box(${x}, ${y}, ${z}, 1.6, 1.1, 1.2, { ink: BL });` },
  { type: 'tall_cover', w: 1.2, h: 2.2, d: 1.0, tier: 2, gen: (x, y, z) => `  box(${x}, ${y}, ${z}, 1.2, 2.2, 1.0, { ink: BL });` }
];

const availableProps = propCatalog[themeArg] || propCatalog['cyber'];

// 4. Dynamic Multi-Tier Spatial Scan
console.log(`📡 Scanning dynamic grid for micro/meso voids...`);

// Test Y=0 (Ground), Y=4.5 (Balconies), Y=9.0 (Catwalks)
const tiers = [0.0, 4.5, 9.0];
const gridStep = 4.0;
const safePockets = [];

for (const y of tiers) {
  for (let x = bounds.minX + 4; x <= bounds.maxX - 4; x += gridStep) {
    for (let z = bounds.minZ + 4; z <= bounds.maxZ - 4; z += gridStep) {
      // Pick a random prop to test fit
      const propTemplate = availableProps[Math.floor(Math.random() * availableProps.length)];

      if (isBoxCollisionFree(x, y, z, propTemplate.w, propTemplate.h, propTemplate.d, 1.0)) {
        // Double check there's a floor underneath this point
        let hasFloor = false;
        for (const c of colliders) {
          if (x >= c.min.x && x <= c.max.x && z >= c.min.z && z <= c.max.z) {
            if (Math.abs(c.max.y - y) <= 0.2) {
              hasFloor = true;
              break;
            }
          }
        }
        if (hasFloor) {
          safePockets.push({ x, y, z, template: propTemplate });
        }
      }
    }
  }
}

console.log(`✨ Found ${safePockets.length} potential safe prop injection nodes across ${tiers.length} vertical tiers.`);

// 5. Quadrant Density Balancing & Selection
const midX = (bounds.minX + bounds.maxX) / 2;
const midZ = (bounds.minZ + bounds.maxZ) / 2;

const pocketsByQuad = { NW: [], NE: [], SW: [], SE: [] };
for (const p of safePockets) {
  if (p.x <= midX && p.z <= midZ) pocketsByQuad.NW.push(p);
  else if (p.x > midX && p.z <= midZ) pocketsByQuad.NE.push(p);
  else if (p.x <= midX && p.z > midZ) pocketsByQuad.SW.push(p);
  else pocketsByQuad.SE.push(p);
}

// Select props, ensuring even distribution (target: ~80 total, ~20 per quad)
const MAX_PROPS = 80;
const targetPerQuad = Math.ceil(MAX_PROPS / 4);
const selectedProps = [];

for (const [quad, pockets] of Object.entries(pocketsByQuad)) {
  // Shuffle pockets
  const shuffled = pockets.sort(() => 0.5 - Math.random());
  const selected = [];

  for (const pocket of shuffled) {
    if (selected.length >= targetPerQuad) break;

    // Ensure props don't crowd each other (min 3m apart)
    const tooClose = [...selectedProps, ...selected].some(s => Math.hypot(s.x - pocket.x, s.z - pocket.z) < 3.0 && Math.abs(s.y - pocket.y) < 2.0);

    if (!tooClose) {
      selected.push(pocket);
    }
  }
  selectedProps.push(...selected);
}

console.log(`\n📦 Selected ${selectedProps.length} props for injection (balanced across quadrants):`);
console.log(`   NW: ${selectedProps.filter(p => p.x <= midX && p.z <= midZ).length} | NE: ${selectedProps.filter(p => p.x > midX && p.z <= midZ).length} | SW: ${selectedProps.filter(p => p.x <= midX && p.z > midZ).length} | SE: ${selectedProps.filter(p => p.x > midX && p.z > midZ).length}`);

if (selectedProps.length === 0) {
  console.log(`ℹ️ Map is already optimally densified (0 safe pockets found). Yielding to Refinement Mode.`);
  process.exit(2);
}

// 6. Read level code, inject right before B.finish()
const levelFilePath = path.join(ROOT_DIR, 'src', 'levels', `${mapArg}.js`);
if (fs.existsSync(levelFilePath)) {
  let code = fs.readFileSync(levelFilePath, 'utf8');

  // Remove existing prop block if re-running
  if (code.includes('// === DREAM AUTO-INJECTED THEMATIC PROPS ===')) {
    const regex = /\/\/ === DREAM AUTO-INJECTED THEMATIC PROPS ===[\s\S]*?\/\/ === END DREAM AUTO-INJECTED PROPS ===/g;
    code = code.replace(regex, '');
  }

  const generatedBlock = `
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===
${selectedProps.map(p => p.template.gen(p.x, p.y, p.z)).join('\n')}
  // === END DREAM AUTO-INJECTED PROPS ===
`;

  if (code.includes('B.finish();')) {
    code = code.replace('B.finish();', `${generatedBlock}\n  B.finish();`);
  } else {
    code += `\n${generatedBlock}`;
  }

  fs.writeFileSync(levelFilePath, code, 'utf8');
  console.log(`\n💾 Injected ${selectedProps.length} safe 3D props into src/levels/${mapArg}.js`);

  // Record learned pattern
  recordLearnedPattern(mapArg, 'dream-auto-injection', `Injected ${selectedProps.length} safe 3D props (God Mode, theme: ${themeArg})`, '3dPropInject');
}

console.log(`\n============================================================`);
console.log(`✅ SPATIAL INJECTION COMPLETE (GOD MODE)`);
console.log(`============================================================`);
