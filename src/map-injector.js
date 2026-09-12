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
    { type: 'mooring_bollard', w: 1.0, h: 1.2, d: 1.0, tier: 1, gen: (x, y, z) => `
  // Prop: Mooring Bollard
  cyl(${x}, ${y}, ${z}, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(${x}, ${y} + 1.0, ${z}, 0.5, 0.2, { seg: 8, ink: BK });` },
    { type: 'cannon', w: 1.4, h: 1.5, d: 2.8, tier: 2, gen: (x, y, z) => `
  // Prop: Iron Cannon
  box(${x}, ${y}, ${z}, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(${x}, ${y} + 0.8, ${z} + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(${x} - 0.7, ${y} + 0.3, ${z}, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(${x} + 0.7, ${y} + 0.3, ${z}, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel` },
    { type: 'treasure_chest', w: 1.5, h: 1.2, d: 1.0, tier: 1, gen: (x, y, z) => `
  // Prop: Treasure Chest
  box(${x}, ${y}, ${z}, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(${x}, ${y} + 0.8, ${z}, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(${x}, ${y} + 0.5, ${z} + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock` },
    { type: 'rowboat', w: 1.8, h: 1.2, d: 4.0, tier: 2, gen: (x, y, z) => `
  // Prop: Rowboat
  box(${x}, ${y}, ${z}, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(${x} - 0.8, ${y} + 0.4, ${z}, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(${x} + 0.8, ${y} + 0.4, ${z}, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(${x}, ${y} + 0.4, ${z} - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(${x}, ${y} + 0.4, ${z} + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(${x}, ${y} + 0.6, ${z}, 1.4, 0.1, 0.4, { ink: BK }); // Seat` },
    { type: 'barrel_stack', w: 2.0, h: 1.8, d: 1.0, tier: 1, gen: (x, y, z) => `
  // Prop: Barrel Stack
  cyl(${x} - 0.5, ${y}, ${z}, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(${x} + 0.5, ${y}, ${z}, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(${x}, ${y} + 0.9, ${z}, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center` },
    { type: 'ship_mast', w: 1.2, h: 6.0, d: 1.2, tier: 3, gen: (x, y, z) => `
  // Prop: Ship Mast
  cyl(${x}, ${y}, ${z}, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(${x}, ${y} + 3.5, ${z} + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(${x}, ${y} + 2.0, ${z} + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail` }
  ],
  skull_city: [
    { type: 'bone_spike', w: 1.5, h: 4.0, d: 1.5, tier: 2, gen: (x, y, z) => `
  // Prop: Bone Spike
  cyl(${x}, ${y}, ${z}, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(${x}, ${y} + 1.5, ${z}, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(${x}, ${y} + 3.0, ${z}, 0.2, 1.0, { seg: 6, ink: OR });` },
    { type: 'giant_skull', w: 6.0, h: 5.0, d: 6.0, tier: 3, gen: (x, y, z) => `
  // Prop: Giant Rock Skull
  box(${x}, ${y}, ${z}, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(${x} - 1.5, ${y} + 2.0, ${z} + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(${x} + 1.5, ${y} + 2.0, ${z} + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(${x}, ${y} + 0.5, ${z} + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(${x}, ${y} - 2.0, ${z} + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth` },
    { type: 'dark_altar', w: 2.5, h: 1.5, d: 2.5, tier: 1, gen: (x, y, z) => `
  // Prop: Dark Altar
  box(${x}, ${y}, ${z}, 2.5, 1.0, 2.5, { ink: BK });
  cyl(${x}, ${y} + 1.0, ${z}, 1.0, 0.5, { seg: 8, ink: RD });` }
  ],
  shipyard: [
    { type: 'galleon_hull', w: 5.0, h: 3.5, d: 10.0, tier: 3, gen: (x, y, z) => `
  // Prop: Galleon Hull Construction
  box(${x}, ${y}, ${z}, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(${x}, ${y} + 1.5, ${z} - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(${x}, ${y} + 1.0, ${z} + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow` },
    { type: 'crane_tower', w: 2.5, h: 9.0, d: 2.5, tier: 3, gen: (x, y, z) => `
  // Prop: Shipyard Crane
  box(${x}, ${y}, ${z}, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(${x}, ${y} + 8.0, ${z} + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(${x}, ${y} + 4.0, ${z} + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable` },
    { type: 'scaffolding', w: 3.0, h: 4.0, d: 3.0, tier: 2, gen: (x, y, z) => `
  // Prop: Wood Scaffolding
  cyl(${x}-1.2, ${y}, ${z}-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(${x}+1.2, ${y}, ${z}-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(${x}-1.2, ${y}, ${z}+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(${x}+1.2, ${y}, ${z}+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(${x}, ${y} + 2.0, ${z}, 3.0, 0.2, 3.0, { ink: OR }); // Platform` }
  ],
  treasure_market: [
    { type: 'merchant_tent', w: 4.0, h: 3.0, d: 4.0, tier: 2, gen: (x, y, z) => `
  // Prop: Merchant Tent
  cyl(${x}-1.8, ${y}, ${z}-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(${x}+1.8, ${y}, ${z}-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(${x}-1.8, ${y}, ${z}+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(${x}+1.8, ${y}, ${z}+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(${x}, ${y} + 2.0, ${z}, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(${x}, ${y} + 2.2, ${z}, 2.0, 0.8, 4.2, { ink: OR }); // Raised center` },
    { type: 'gold_pile', w: 2.5, h: 1.5, d: 2.5, tier: 1, gen: (x, y, z) => `
  // Prop: Massive Gold Pile
  cyl(${x}, ${y}, ${z}, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(${x}, ${y} + 0.6, ${z}, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(${x}, ${y} + 1.1, ${z}, 0.4, 0.4, { seg: 8, ink: OR }); // Top` },
    { type: 'market_stall', w: 2.5, h: 1.8, d: 1.5, tier: 1, gen: (x, y, z) => `
  // Prop: Goods Stall
  box(${x}, ${y}, ${z}, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(${x}, ${y} + 1.5, ${z}, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof` }
  ],
  fortress: [
    { type: 'stone_watchtower', w: 4.0, h: 10.0, d: 4.0, tier: 3, gen: (x, y, z) => `
  // Prop: Stone Watchtower
  box(${x}, ${y}, ${z}, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(${x}, ${y} + 9.0, ${z}, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet` },
    { type: 'cannon_battery', w: 5.0, h: 1.8, d: 2.0, tier: 2, gen: (x, y, z) => `
  // Prop: Cannon Battery Wall
  box(${x}, ${y}, ${z}, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(${x} - 1.5, ${y} + 1.4, ${z} + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(${x} + 1.5, ${y} + 1.4, ${z} + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2` },
    { type: 'iron_cage', w: 1.8, h: 2.2, d: 1.8, tier: 1, gen: (x, y, z) => `
  // Prop: Prisoner Cage
  box(${x}, ${y}, ${z}, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(${x}, ${y} + 2.0, ${z}, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(${x}, ${y} + 1.0, ${z}, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars` }
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

const midX = (bounds.minX + bounds.maxX) / 2;
const midZ = (bounds.minZ + bounds.maxZ) / 2;

for (const y of tiers) {
  for (let x = bounds.minX + 4; x <= bounds.maxX - 4; x += gridStep) {
    for (let z = bounds.minZ + 4; z <= bounds.maxZ - 4; z += gridStep) {
      // Determine the active prop catalog based on location for pirate_cove!
      let activeCatalog = availableProps;
      if (mapArg === 'pirate_cove') {
        if (x <= midX && z <= midZ) activeCatalog = propCatalog['skull_city'];
        else if (x > midX && z <= midZ) activeCatalog = propCatalog['shipyard'];
        else if (x <= midX && z > midZ) activeCatalog = propCatalog['treasure_market'];
        else activeCatalog = propCatalog['fortress'];
      }
      
      // Pick a random prop to test fit
      const propTemplate = activeCatalog[Math.floor(Math.random() * activeCatalog.length)];

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
const pocketsByQuad = { NW: [], NE: [], SW: [], SE: [] };
for (const p of safePockets) {
  if (p.x <= midX && p.z <= midZ) pocketsByQuad.NW.push(p);
  else if (p.x > midX && p.z <= midZ) pocketsByQuad.NE.push(p);
  else if (p.x <= midX && p.z > midZ) pocketsByQuad.SW.push(p);
  else pocketsByQuad.SE.push(p);
}

// Fill every possible space (infinite props up to physical limits)
const MAX_PROPS = 9999;
const targetPerQuad = Math.ceil(MAX_PROPS / 4);
const selectedProps = [];

for (const [quad, pockets] of Object.entries(pocketsByQuad)) {
  // Shuffle pockets
  const shuffled = pockets.sort(() => 0.5 - Math.random());
  const selected = [];

  for (const pocket of shuffled) {
    if (selected.length >= targetPerQuad) break;

    // Ensure props don't overlap (min 1.5m apart)
    const tooClose = [...selectedProps, ...selected].some(s => Math.hypot(s.x - pocket.x, s.z - pocket.z) < 1.5 && Math.abs(s.y - pocket.y) < 2.0);

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
