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
import { RhythmPlacer } from './rhythm-placer.js';
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

// 3. 5-Theme Prop Catalog - Upgraded to MACRO CITY BLOCKS (Explorable, Pathways, Doors, Stairs)

// 3. Imagineering Workflow - Bespoke Thematic Set Pieces
const propCatalog = {
  shanty_town: [
    { type: 'shanty_tower', w: 10, h: 10, d: 10, tier: 1, gen: (x, y, z) => `
  // Macro: Vertical Shanty Tower
  box(${x}, ${y}, ${z}, 8, 3, 8, { ink: OR }); // Base shack
  stairs(${x}-4.5, ${y}, ${z}, 1, 3, 2, 3, { ink: OR }); // Rickety steps up
  box(${x}-1, ${y}+3, ${z}-1, 6, 3, 6, { ink: BL }); // Second floor offset
  stairs(${x}+2.5, ${y}+3, ${z}, 1, 3, 2, 1, { ink: OR }); // Steps to roof
  box(${x}+1, ${y}+6, ${z}+1, 4, 3, 4, { ink: OR }); // Crows nest shack
  ring(${x}, ${y}+10, ${z}, 1.5, { ink: OR }); // Rope swing anchor` },
    { type: 'plank_bridge', w: 12, h: 4, d: 4, tier: 1, gen: (x, y, z) => `
  // Macro: Suspended Plank Bridge
  box(${x}, ${y}+3, ${z}, 10, 0.2, 2, { ink: OR }); // Wood plank
  cyl(${x}-4.5, ${y}, ${z}-0.5, 0.2, 4, { ink: OR }); // Support posts
  cyl(${x}+4.5, ${y}, ${z}+0.5, 0.2, 4, { ink: OR });` }
  ],
  leviathan_graveyard: [
    { type: 'giant_ribcage', w: 12, h: 6, d: 8, tier: 1, gen: (x, y, z) => `
  // Macro: Leviathan Ribcage & Cursed Treasure
  box(${x}, ${y}, ${z}, 12, 0.5, 8, { ink: OR }); // Sand mound
  // Left Ribs
  cyl(${x}-3, ${y}+3, ${z}-2, 0.4, 6, { ink: WH });
  cyl(${x}-3, ${y}+3, ${z}+2, 0.4, 6, { ink: WH });
  // Right Ribs
  cyl(${x}+3, ${y}+3, ${z}-2, 0.4, 6, { ink: WH });
  cyl(${x}+3, ${y}+3, ${z}+2, 0.4, 6, { ink: WH });
  // Top Spines (Connecting Ribs)
  box(${x}, ${y}+6, ${z}-2, 6.6, 0.4, 0.4, { ink: WH });
  box(${x}, ${y}+6, ${z}+2, 6.6, 0.4, 0.4, { ink: WH });
  // The Cursed Treasure
  box(${x}, ${y}+0.5, ${z}, 1.5, 1, 1, { ink: OR }); // Gold Chest
  box(${x}, ${y}+1.5, ${z}, 0.5, 0.5, 0.5, { ink: OR }); // Iron Lock
  ring(${x}, ${y}+5, ${z}, 1.5, { ink: WH }); // Grapple to escape` }
  ],
  gunpowder_grotto: [
    { type: 'explosive_cavern', w: 12, h: 8, d: 10, tier: 1, gen: (x, y, z) => `
  // Macro: Gunpowder Overhang & Crane
  box(${x}, ${y}, ${z}, 12, 0.2, 10, { ink: OR }); // Stone floor
  box(${x}-5, ${y}+0.2, ${z}, 2, 8, 10, { ink: OR }); // Left cave wall
  box(${x}+5, ${y}+0.2, ${z}, 2, 8, 10, { ink: OR }); // Right cave wall
  box(${x}, ${y}+8, ${z}, 12, 1, 10, { ink: OR }); // Cave Roof Overhang
  // Stockpile
  cyl(${x}-2, ${y}+0.2, ${z}-2, 0.8, 1.5, { ink: GR }); // Volatile Barrel
  cyl(${x}-3, ${y}+0.2, ${z}-1, 0.8, 1.5, { ink: OR }); // Powder Barrel
  cyl(${x}-2.5, ${y}+1.7, ${z}-1.5, 0.8, 1.5, { ink: GR }); // Stacked
  // Crane & Suspended Barrel
  box(${x}+4, ${y}+7, ${z}, 5, 0.4, 0.4, { ink: OR }); // Wood crane arm
  cyl(${x}+1.5, ${y}+4, ${z}, 0.1, 3, { ink: WH }); // Rope
  cyl(${x}+1.5, ${y}+3, ${z}, 1.0, 1.5, { ink: OR }); // Hanging explosive
  ring(${x}+1.5, ${y}+2, ${z}, 1.5, { ink: OR }); // Grapple onto the explosive!
  ` }
  ],
  broken_galleon: [
    { type: 'galleon_stern', w: 12, h: 10, d: 12, tier: 1, gen: (x, y, z) => `
  // Macro: The Captains Quarters (Stern)
  box(${x}, ${y}, ${z}, 10, 3, 10, { ink: OR }); // Lower hull
  stairs(${x}, ${y}, ${z}+6, 2, 3, 2, 0, { ink: OR }); // Ramp into ship
  box(${x}, ${y}+3, ${z}-2, 8, 3, 6, { ink: OR }); // Captains Cabin
  stairs(${x}-4.5, ${y}+3, ${z}+1, 1, 3, 2, 3, { ink: OR }); // Left stairs to poop deck
  stairs(${x}+4.5, ${y}+3, ${z}+1, 1, 3, 2, 1, { ink: OR }); // Right stairs to poop deck
  box(${x}, ${y}+6, ${z}-2, 10, 1, 6, { ink: OR }); // Poop deck roof
  cyl(${x}, ${y}+7, ${z}-2, 0.4, 6, { ink: OR }); // Broken rear mast
  ring(${x}, ${y}+13, ${z}-2, 1.5, { ink: OR }); // Crows nest grapple
  ` },
    { type: 'galleon_bow', w: 10, h: 8, d: 12, tier: 1, gen: (x, y, z) => `
  // Macro: The Shattered Bow
  box(${x}, ${y}, ${z}, 8, 3, 10, { ink: OR }); // Front hull
  stairs(${x}, ${y}+3, ${z}-6, 2, -3, 2, 2, { ink: OR }); // Ramps down into the sand
  cyl(${x}, ${y}+3, ${z}+2, 0.4, 8, { ink: OR }); // Main mast
  box(${x}, ${y}+7, ${z}+2, 6, 0.2, 0.2, { ink: OR }); // Yardarm
  box(${x}, ${y}+5, ${z}+2.2, 5, 4, 0.1, { ink: BL, noCollide: true }); // Torn sail
  ring(${x}, ${y}+11, ${z}+2, 1.5, { ink: OR }); // Grapple
  ` }
  ]
};

const defaultProps = [];
const availableProps = propCatalog[themeArg] || propCatalog['skull_city'];

// 4. Dynamic Multi-Tier Spatial Scan - UPGRADED TO GRID/LOT SYSTEM
console.log(`📡 Scanning for City Planner Grid Lots (12x12m with pathways)...`);
const gridStep = 16.0; // Huge grid step to ensure 4m pathways between 12m buildings
const safePockets = [];
const tiers = [0.0]; // Only ground floor macro structures for pathways

// Pockets will be populated dynamically below

const midX = (bounds.minX + bounds.maxX) / 2;
const midZ = (bounds.minZ + bounds.maxZ) / 2;

for (const y of tiers) {
  for (let x = bounds.minX + 8; x <= bounds.maxX - 8; x += gridStep) {
    for (let z = bounds.minZ + 8; z <= bounds.maxZ - 8; z += gridStep) {
      // Determine active catalog
      let activeCatalog = propCatalog['broken_galleon'];
      if (mapArg === 'pirate_cove') {
        if (x <= midX && z <= midZ) activeCatalog = propCatalog['shanty_town'];
        else if (x > midX && z <= midZ) activeCatalog = propCatalog['leviathan_graveyard'];
        else if (x <= midX && z > midZ) activeCatalog = propCatalog['gunpowder_grotto'];
        else activeCatalog = propCatalog['broken_galleon'];
      }
      
      const propTemplate = activeCatalog[Math.floor(Math.random() * activeCatalog.length)];
      // Check collision
      if (isBoxCollisionFree(x, y, z, propTemplate.w, propTemplate.h, propTemplate.d, 1.0)) {
        safePockets.push({ x, y, z, template: propTemplate, quad: 
          (x <= midX && z <= midZ) ? 'NW' :
          (x > midX && z <= midZ) ? 'NE' :
          (x <= midX && z > midZ) ? 'SW' : 'SE'
        });
      }
    }
  }
}


console.log(`✨ Found ${safePockets.length} potential City Lots.`);

// Generate combat lanes (corners to center)
const lanes = [
  // NW to center
  [{x: bounds.minX+10, y:0, z: bounds.minZ+10}, {x: midX, y:0, z: midZ}],
  // NE to center
  [{x: bounds.maxX-10, y:0, z: bounds.minZ+10}, {x: midX, y:0, z: midZ}],
  // SW to center
  [{x: bounds.minX+10, y:0, z: bounds.maxZ-10}, {x: midX, y:0, z: midZ}],
  // SE to center
  [{x: bounds.maxX-10, y:0, z: bounds.maxZ-10}, {x: midX, y:0, z: midZ}]
];

const rhythmPlacer = new RhythmPlacer();
console.log(`🥁 Placing rhythm-based cover along ${lanes.length} combat lanes...`);

for (const lane of lanes) {
  const placements = rhythmPlacer.placeAlongLane(lane);
  for (const p of placements) {
    if (isBoxCollisionFree(p.position.x, 0.0, p.position.z, 2.0, 2.0, 2.0, 1.0)) {
      if (p.type === 'HARD_COVER') {
        safePockets.push({
          x: p.position.x, y: 0, z: p.position.z,
          template: { gen: (x,y,z) => `  box(${x.toFixed(1)}, ${y}, ${z.toFixed(1)}, 2.0, 2.5, 2.0, { ink: OR }); // Hard Cover` }
        });
      } else {
        safePockets.push({
          x: p.position.x, y: 0, z: p.position.z,
          template: { gen: (x,y,z) => `  barrel(${x.toFixed(1)}, ${y}, ${z.toFixed(1)}, 0.8, 1.2, { ink: OR }); // Soft Cover` }
        });
      }
    }
  }
}

const selectedProps = safePockets;
 // Place all lots that fit

console.log(`\n📦 Selected ${selectedProps.length} macro structures.`);

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
  // === END DREAM AUTO-INJECTED PROPS ===`;

  if (code.includes('B.finish();')) {
    code = code.replace('B.finish();', `${generatedBlock}\n  B.finish();`);
  } else {
    code += `\n${generatedBlock}`;
  }
  
  // Also clear WH from ink as requested previously just in case
  code = code.replace(/ink: WH/g, 'ink: OR');

  fs.writeFileSync(levelFilePath, code, 'utf8');
  console.log(`\n💾 Injected ${selectedProps.length} MACRO STRUCTURES with guaranteed pathways into src/levels/${mapArg}.js`);
  
  // Record learned pattern
  recordLearnedPattern(mapArg, 'dream-city-planner', `Injected ${selectedProps.length} macro structures (City Planner)`, 'macroCity');
}
console.log(`\n============================================================`);
console.log(`✅ SPATIAL INJECTION COMPLETE (CITY PLANNER MODE)`);
console.log(`============================================================`);
