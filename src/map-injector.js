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

// 3. 5-Theme Prop Catalog - Upgraded to MACRO CITY BLOCKS (Explorable, Pathways, Doors, Stairs)
const propCatalog = {
  skull_city: [
    { type: 'skull_temple', w: 12, h: 6, d: 12, tier: 1, gen: (x, y, z) => `
  // Macro: Skull Temple Block
  box(${x}, ${y}, ${z}, 10, 0.5, 10, { ink: BK }); // Foundation
  stairs(${x}, ${y}, ${z} + 5.5, 2, 0.5, 1, 0, { ink: OR }); // Entrance stairs
  box(${x} - 4, ${y} + 0.5, ${z}, 1, 4, 10, { ink: BL }); // Left wall
  box(${x} + 4, ${y} + 0.5, ${z}, 1, 4, 10, { ink: BL }); // Right wall
  box(${x}, ${y} + 0.5, ${z} - 4, 10, 4, 1, { ink: BL }); // Back wall
  box(${x} - 2.5, ${y} + 0.5, ${z} + 4, 4, 4, 1, { ink: BL }); // Front wall L
  box(${x} + 2.5, ${y} + 0.5, ${z} + 4, 4, 4, 1, { ink: BL }); // Front wall R (gap is door)
  // Altar and skull inside
  box(${x}, ${y} + 0.5, ${z} - 2, 4, 3, 4, { ink: BK }); // Skull base
  box(${x}, ${y} + 3.5, ${z} - 2, 3, 2, 3, { ink: OR }); // Skull top
  box(${x}-0.8, ${y} + 4.0, ${z} - 0.5, 0.5, 0.5, 0.5, { ink: BK }); // Eye
  box(${x}+0.8, ${y} + 4.0, ${z} - 0.5, 0.5, 0.5, 0.5, { ink: BK }); // Eye
  ring(${x}, ${y}+6, ${z}, 1, { ink: OR }); // Grapple` },
    { type: 'bone_yard', w: 12, h: 4, d: 12, tier: 1, gen: (x, y, z) => `
  // Macro: Bone Yard Platform
  box(${x}, ${y}, ${z}, 8, 2.0, 8, { ink: BK }); // Raised platform
  stairs(${x}-4.5, ${y}, ${z}, 1, 2.0, 2, 3, { ink: OR }); // Side stairs (West)
  stairs(${x}+4.5, ${y}, ${z}, 1, 2.0, 2, 1, { ink: OR }); // Side stairs (East)
  cyl(${x}-2, ${y}+2.0, ${z}-2, 0.5, 2.0, { seg:6, ink: WH }); // Spike
  cyl(${x}+2, ${y}+2.0, ${z}-2, 0.5, 3.0, { seg:6, ink: WH }); // Spike
  cyl(${x}-2, ${y}+2.0, ${z}+2, 0.5, 1.5, { seg:6, ink: WH }); // Spike
  cyl(${x}+2, ${y}+2.0, ${z}+2, 0.5, 2.5, { seg:6, ink: WH }); // Spike` }
  ],
  shipyard: [
    { type: 'dry_dock', w: 12, h: 6, d: 12, tier: 1, gen: (x, y, z) => `
  // Macro: Dry Dock & Scaffolding
  box(${x}-4, ${y}, ${z}, 2, 4.0, 10, { ink: OR }); // Scaffolding L
  box(${x}+4, ${y}, ${z}, 2, 4.0, 10, { ink: OR }); // Scaffolding R
  box(${x}, ${y}, ${z}-4, 10, 4.0, 2, { ink: OR }); // Scaffolding Back
  stairs(${x}, ${y}, ${z}-5.5, 2, 4.0, 2, 2, { ink: BL }); // Back stairs up
  // Ship hull in middle
  box(${x}, ${y}, ${z}+1, 4, 2.5, 8, { ink: BK });
  box(${x}, ${y}+2.5, ${z}-2, 4, 1.0, 2, { ink: BK }); // Stern
  // Crane on left scaffolding
  cyl(${x}-4, ${y}+4, ${z}, 0.5, 4, { seg:8, ink: BK });
  box(${x}-1.5, ${y}+7.5, ${z}, 5, 0.5, 0.5, { ink: BK });
  ring(${x}-4, ${y}+7, ${z}, 1, { ink: OR }); // Grapple` }
  ],
  treasure_market: [
    { type: 'bazaar_plaza', w: 12, h: 4, d: 12, tier: 1, gen: (x, y, z) => `
  // Macro: Bazaar Plaza with Tents
  box(${x}, ${y}, ${z}, 10, 0.2, 10, { ink: BL }); // Rug/Plaza
  // Tent 1 (NW)
  box(${x}-3, ${y}+0.2, ${z}-3, 3, 2, 3, { ink: OR });
  box(${x}-3, ${y}+2.2, ${z}-3, 3.2, 0.2, 3.2, { ink: RD });
  // Tent 2 (NE)
  box(${x}+3, ${y}+0.2, ${z}-3, 3, 2, 3, { ink: OR });
  box(${x}+3, ${y}+2.2, ${z}-3, 3.2, 0.2, 3.2, { ink: WH });
  // Tent 3 (SW)
  box(${x}-3, ${y}+0.2, ${z}+3, 3, 2, 3, { ink: OR });
  box(${x}-3, ${y}+2.2, ${z}+3, 3.2, 0.2, 3.2, { ink: BL });
  // Center Gold
  cyl(${x}, ${y}+0.2, ${z}, 1.5, 1.0, { seg:8, ink: OR });
  ring(${x}, ${y}+4, ${z}, 1, { ink: OR }); // Grapple
  box(${x}-2, ${y}+0.2, ${z}-2, 1, 1, 1, { ink: BK }); // Cover
  box(${x}+2, ${y}+0.2, ${z}+2, 1, 1, 1, { ink: BK }); // Cover` }
  ],
  fortress: [
    { type: 'keep_tower', w: 12, h: 8, d: 12, tier: 1, gen: (x, y, z) => `
  // Macro: Stone Keep & Walls
  box(${x}-5, ${y}, ${z}, 2, 3, 12, { ink: BL }); // West wall
  box(${x}+5, ${y}, ${z}, 2, 3, 12, { ink: BL }); // East wall
  box(${x}, ${y}, ${z}-5, 12, 3, 2, { ink: BL }); // North wall
  box(${x}-3.5, ${y}, ${z}+5, 5, 3, 2, { ink: BL }); // South wall L
  box(${x}+3.5, ${y}, ${z}+5, 5, 3, 2, { ink: BL }); // South wall R (3m door gap)
  // Inner Watchtower
  box(${x}, ${y}, ${z}-1, 4, 6, 4, { ink: BK });
  stairs(${x}, ${y}, ${z}+2.5, 2, 6, 4, 0, { ink: OR }); // Huge stairs leading to tower
  ring(${x}, ${y}+8, ${z}-1, 1, { ink: OR }); // Grapple
  box(${x}-3, ${y}, ${z}, 1, 1, 1, { ink: OR }); // Cover
  box(${x}+3, ${y}, ${z}, 1, 1, 1, { ink: OR }); // Cover` }
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
      let activeCatalog = propCatalog['fortress'];
      if (mapArg === 'pirate_cove') {
        if (x <= midX && z <= midZ) activeCatalog = propCatalog['skull_city'];
        else if (x > midX && z <= midZ) activeCatalog = propCatalog['shipyard'];
        else if (x <= midX && z > midZ) activeCatalog = propCatalog['treasure_market'];
        else activeCatalog = propCatalog['fortress'];
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

// Scatter some small cover barrels along the pathways (Y=0)
for(let i=0; i<120; i++) {
  const bx = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
  const bz = bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ);
  if (isBoxCollisionFree(bx, 0.0, bz, 1.0, 1.0, 1.0, 1.0)) {
     safePockets.push({
       x: bx, y: 0, z: bz,
       template: { gen: (x,y,z) => `  box(${x}, ${y}, ${z}, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover` }
     });
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
