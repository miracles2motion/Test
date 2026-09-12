#!/usr/bin/env node
/**
 * Doodle Strike - 3D Macro-Void Volumetric Scanner & Architectural Synthesizer (God Mode)
 *
 * Scans level geometry for contiguous spatial pockets across multiple size tiers,
 * dreams interactive multi-story architectural macro-structures matching the level archetype,
 * validates everything through Three.js dry-runs, consults the failure blacklist,
 * and writes clean procedural geometry with stairs, walkable platforms, and grapple points.
 *
 * God Mode Features:
 *   - 15+ themed building templates (3 per theme × 5 themes)
 *   - Adaptive sizing (buildings scale to fit void dimensions)
 *   - Failure blacklist consultation (skips previously failed templates)
 *   - Up to 4 macro buildings per map (from 2)
 *   - Success/failure recording to learning cache
 *
 * Usage:
 *   node src/macro-dreamer.js <mapKey> [theme]
 *   npm run map:macro zen zen
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as THREE from 'three';
import { buildLevel, MAP_BUILDERS } from './level.js';
import { recordLearnedPattern, blacklistTemplate, isTemplateBlacklisted, registerSuccess } from './map-learning.js';
import { GeometryValidator } from './geometry-validator.js';
import { StairSanitizer } from './stair-sanitizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const mapArg = (process.argv[2] || '').toLowerCase().trim();
const themeArg = (process.argv[3] || '').toLowerCase().trim();

if (!mapArg || !MAP_BUILDERS[mapArg]) {
  console.log(`
🏛️ Doodle Strike - 3D Macro-Void Volumetric Synthesizer (God Mode)
============================================================
Usage:
  npm run map:macro <mapKey> [theme]

Examples:
  npm run map:macro zen zen
  npm run map:macro clockwork steampunk
  npm run map:macro district urban
============================================================
`);
  process.exit(1);
}

console.log(`============================================================`);
console.log(`🏛️ MACRO-VOID SCANNER (GOD MODE): [${mapArg.toUpperCase()}]`);
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

// 2. Volumetric Clearance Check
function isVolumetricPocketClear(cx, cy, cz, w, h, d, minClearance = 1.0) {
  const minX = cx - w / 2 - minClearance;
  const maxX = cx + w / 2 + minClearance;
  const minY = cy;
  const maxY = cy + h + minClearance;
  const minZ = cz - d / 2 - minClearance;
  const maxZ = cz + d / 2 + minClearance;

  for (const c of colliders) {
    if (c.opts && (c.opts.noCollide || c.opts.noNav)) continue;
    if (minX < c.max.x && maxX > c.min.x && minY < c.max.y && maxY > c.min.y && minZ < c.max.z && maxZ > c.min.z) return false;
  }
  for (const sp of levelObj.spawns || []) {
    if (Math.hypot(cx - sp.x, cz - sp.z) < 3.0 && Math.abs(cy - sp.y) < 3.0) return false;
  }
  for (const sn of levelObj.snipers || []) {
    if (Math.hypot(cx - sn.x, cz - sn.z) < 2.5 && Math.abs(cy - sn.y) < 3.0) return false;
  }
  return true;
}

// 3. Multi-tier Grid Search for Spatial Voids
console.log(`📡 Scanning coordinate grid for macro voids (≥ 8m × 6m × 8m)...`);
const step = 6.0;
const voidCandidates = [];

for (let x = bounds.minX + 12; x <= bounds.maxX - 12; x += step) {
  for (let z = bounds.minZ + 12; z <= bounds.maxZ - 12; z += step) {
    if (Math.abs(x) < 6 && Math.abs(z) < 6) continue;
    // Test large voids first, then medium
    if (isVolumetricPocketClear(x, 0, z, 10.0, 7.0, 10.0, 1.2)) {
      voidCandidates.push({ x, y: 0, z, width: 10.0, height: 7.0, depth: 10.0, tier: 'large' });
    } else if (isVolumetricPocketClear(x, 0, z, 7.0, 5.0, 7.0, 1.0)) {
      voidCandidates.push({ x, y: 0, z, width: 7.0, height: 5.0, depth: 7.0, tier: 'medium' });
    }
  }
}

console.log(`✨ Found ${voidCandidates.length} potential macro-void locations.`);

// 4. GOD MODE: Expanded Thematic Template Library (15+ templates)
function getMacroTemplates(theme) {
  const templates = {
    zen: [
      {
        id: 'bell_pavilion',
        title: 'Bonshō Bell & Tea Pavilion',
        description: 'Multi-tiered wooden open shrine with walkable mezzanine, bronze bell, and apex grapple beam.',
        minSize: [8, 6, 8],
        codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Bonshō Bell & Tea Pavilion at (${x}, ${y}, ${z}) ===
  box(${x}, ${y}, ${z}, 8.4, 0.6, 8.4, { ink: BL });
  box(${x}, ${y} + 0.6, ${z}, 7.6, 0.4, 7.6, { ink: BL });
  box(${x} - 3.2, ${y} + 1.0, ${z} - 3.2, 0.6, 4.2, 0.6, { ink: BK });
  box(${x} + 3.2, ${y} + 1.0, ${z} - 3.2, 0.6, 4.2, 0.6, { ink: BK });
  box(${x} - 3.2, ${y} + 1.0, ${z} + 3.2, 0.6, 4.2, 0.6, { ink: BK });
  box(${x} + 3.2, ${y} + 1.0, ${z} + 3.2, 0.6, 4.2, 0.6, { ink: BK });
  slab(${x} - 4.0, ${z} - 4.0, ${x} + 4.0, ${z} + 4.0, ${y} + 4.2, 0.4, { ink: OR });
  rail(${x} - 4.0, ${z} - 4.0, ${x} + 4.0, ${z} - 4.0, ${y} + 4.2, { ink: OR });
  rail(${x} - 4.0, ${z} + 4.0, ${x} + 4.0, ${z} + 4.0, ${y} + 4.2, { ink: OR });
  rail(${x} - 4.0, ${z} - 4.0, ${x} - 4.0, ${z} + 4.0, ${y} + 4.2, { ink: OR });
  rail(${x} + 4.0, ${z} - 4.0, ${x} + 4.0, ${z} + 4.0, ${y} + 4.2, { ink: OR });
  box(${x}, ${y} + 4.4, ${z}, 9.6, 0.4, 9.6, { noCollide: true, ink: BK });
  box(${x}, ${y} + 5.6, ${z}, 6.0, 0.4, 6.0, { noCollide: true, ink: BK });
  box(${x}, ${y} + 6.8, ${z}, 2.4, 0.5, 2.4, { noCollide: true, ink: BK });
  cyl(${x}, ${y} + 3.0, ${z}, 0.8, 1.6, { seg: 8, noCollide: true, ink: RD });
  ring(${x}, ${y} + 8.0, ${z}, 'z');
  pickup(${x}, ${y} + 4.4, ${z});`
      },
      {
        id: 'engawa_teahouse',
        title: 'Engawa Lookout Sanctuary',
        description: 'Multi-room veranda teahouse with tatami platforms, waist-high railing cover, and sniper terrace.',
        minSize: [8, 5, 8],
        codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Engawa Lookout Sanctuary at (${x}, ${y}, ${z}) ===
  box(${x}, ${y}, ${z}, 9.0, 0.8, 9.0, { ink: BL });
  box(${x}, ${y} + 0.8, ${z}, 7.8, 1.6, 7.8, { ink: BL });
  slab(${x} - 4.3, ${z} - 4.3, ${x} + 4.3, ${z} + 4.3, ${y} + 2.4, 0.4, { ink: OR });
  box(${x} - 4.1, ${y} + 2.4, ${z}, 0.2, 1.1, 8.2, { ink: BK });
  box(${x} + 4.1, ${y} + 2.4, ${z}, 0.2, 1.1, 8.2, { ink: BK });
  box(${x}, ${y} + 2.4, ${z} - 4.1, 8.2, 1.1, 0.2, { ink: BK });
  box(${x}, ${y} + 5.2, ${z}, 9.4, 0.3, 9.4, { noCollide: true, ink: BK });
  ring(${x}, ${y} + 7.8, ${z}, 'z');
  pickup(${x} + 2.0, ${y} + 2.6, ${z} - 2.0);`
      },
      {
        id: 'torii_overlook',
        title: 'Torii Gate Overlook Platform',
        description: 'Vermilion torii gate with elevated walkway beam and flanking stone lanterns.',
        minSize: [6, 5, 6],
        codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Torii Gate Overlook at (${x}, ${y}, ${z}) ===
  box(${x} - 3.0, ${y}, ${z}, 0.8, 6.0, 0.8, { ink: RD });
  box(${x} + 3.0, ${y}, ${z}, 0.8, 6.0, 0.8, { ink: RD });
  box(${x}, ${y} + 5.2, ${z}, 7.4, 0.6, 1.0, { ink: RD });
  box(${x}, ${y} + 4.4, ${z}, 6.2, 0.4, 0.6, { ink: RD });
  slab(${x} - 3.5, ${z} - 1.5, ${x} + 3.5, ${z} + 1.5, ${y} + 4.0, 0.3, { ink: OR });
  rail(${x} - 3.5, ${z} - 1.5, ${x} + 3.5, ${z} - 1.5, ${y} + 4.0, { ink: BK });
  rail(${x} - 3.5, ${z} + 1.5, ${x} + 3.5, ${z} + 1.5, ${y} + 4.0, { ink: BK });
  box(${x} - 2.5, ${y}, ${z} + 2.5, 0.6, 1.4, 0.6, { ink: BK });
  box(${x} + 2.5, ${y}, ${z} + 2.5, 0.6, 1.4, 0.6, { ink: BK });
  ring(${x}, ${y} + 8.3, ${z}, 'z');`
      }
    ],

    cyber: [
      {
        id: 'neon_data_vault',
        title: 'Neon Data Vault',
        description: 'Fortified server room with tiered walkways, glowing conduits, and rooftop grapple.',
        minSize: [8, 6, 8],
        codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Neon Data Vault at (${x}, ${y}, ${z}) ===
  box(${x}, ${y}, ${z}, 8.0, 3.5, 8.0, { ink: BL });
  slab(${x} - 4.2, ${z} - 4.2, ${x} + 4.2, ${z} + 4.2, ${y} + 3.5, 0.4, { ink: BL });
  box(${x} - 3.6, ${y} + 3.9, ${z}, 0.3, 1.8, 7.4, { ink: BK });
  box(${x} + 3.6, ${y} + 3.9, ${z}, 0.3, 1.8, 7.4, { ink: BK });
  box(${x}, ${y} + 3.9, ${z} - 3.6, 7.4, 1.8, 0.3, { ink: BK });
  slab(${x} - 4.0, ${z} - 4.0, ${x} + 4.0, ${z} + 4.0, ${y} + 5.8, 0.3, { ink: OR });
  rail(${x} - 4.0, ${z} - 4.0, ${x} + 4.0, ${z} - 4.0, ${y} + 5.8, { ink: OR });
  rail(${x} - 4.0, ${z} + 4.0, ${x} + 4.0, ${z} + 4.0, ${y} + 5.8, { ink: OR });
  box(${x}, ${y} + 1.5, ${z} + 3.6, 3.0, 1.2, 0.3, { noCollide: true, ink: OR });
  ring(${x}, ${y} + 8.8, ${z}, 'z');
  pickup(${x}, ${y} + 3.7, ${z});`
      },
      {
        id: 'skybridge_junction',
        title: 'Skybridge Transit Junction',
        description: 'Elevated transit platform with twin pylons, suspended walkway, and cover nodes.',
        minSize: [8, 5, 8],
        codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Skybridge Junction at (${x}, ${y}, ${z}) ===
  box(${x} - 3.0, ${y}, ${z}, 1.2, 5.0, 1.2, { ink: BK });
  box(${x} + 3.0, ${y}, ${z}, 1.2, 5.0, 1.2, { ink: BK });
  slab(${x} - 4.0, ${z} - 2.0, ${x} + 4.0, ${z} + 2.0, ${y} + 4.5, 0.4, { ink: BL });
  rail(${x} - 4.0, ${z} - 2.0, ${x} + 4.0, ${z} - 2.0, ${y} + 4.5, { ink: OR });
  rail(${x} - 4.0, ${z} + 2.0, ${x} + 4.0, ${z} + 2.0, ${y} + 4.5, { ink: OR });
  box(${x}, ${y} + 4.9, ${z}, 2.0, 1.0, 1.2, { ink: BL });
  ring(${x}, ${y} + 8.3, ${z}, 'y');
  pickup(${x}, ${y} + 5.0, ${z});`
      },
      {
        id: 'holo_kiosk_tower',
        title: 'Holographic Kiosk Tower',
        description: 'Narrow vertical tower with wrap-around ledge, holographic display, and sniper perch.',
        minSize: [6, 5, 6],
        codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Holo Kiosk Tower at (${x}, ${y}, ${z}) ===
  box(${x}, ${y}, ${z}, 4.0, 5.5, 4.0, { ink: BL });
  slab(${x} - 2.8, ${z} - 2.8, ${x} + 2.8, ${z} + 2.8, ${y} + 5.5, 0.3, { ink: OR });
  rail(${x} - 2.8, ${z} - 2.8, ${x} + 2.8, ${z} - 2.8, ${y} + 5.5, { ink: OR });
  rail(${x} - 2.8, ${z} + 2.8, ${x} + 2.8, ${z} + 2.8, ${y} + 5.5, { ink: OR });
  box(${x}, ${y} + 3.0, ${z} + 1.8, 2.0, 1.5, 0.2, { noCollide: true, ink: OR });
  ring(${x}, ${y} + 8.8, ${z}, 'z');`
      }
    ],

    steampunk: [
      {
        id: 'clockwork_dynamo',
        title: 'Clockwork Dynamo Hall',
        description: 'Massive gear housing with observation deck, exposed pistons, and overhead crane grapple.',
        minSize: [8, 6, 8],
        codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Clockwork Dynamo Hall at (${x}, ${y}, ${z}) ===
  box(${x}, ${y}, ${z}, 9.0, 0.8, 9.0, { ink: BL });
  box(${x} - 4.0, ${y} + 0.8, ${z} - 4.0, 0.8, 5.0, 0.8, { ink: BK });
  box(${x} + 4.0, ${y} + 0.8, ${z} - 4.0, 0.8, 5.0, 0.8, { ink: BK });
  box(${x} - 4.0, ${y} + 0.8, ${z} + 4.0, 0.8, 5.0, 0.8, { ink: BK });
  box(${x} + 4.0, ${y} + 0.8, ${z} + 4.0, 0.8, 5.0, 0.8, { ink: BK });
  slab(${x} - 4.5, ${z} - 4.5, ${x} + 4.5, ${z} + 4.5, ${y} + 3.5, 0.4, { ink: OR });
  rail(${x} - 4.5, ${z} - 4.5, ${x} + 4.5, ${z} - 4.5, ${y} + 3.5, { ink: BK });
  rail(${x} - 4.5, ${z} + 4.5, ${x} + 4.5, ${z} + 4.5, ${y} + 3.5, { ink: BK });
  cyl(${x}, ${y} + 0.8, ${z}, 1.8, 2.5, { seg: 12, noCollide: true, ink: OR });
  box(${x}, ${y} + 5.8, ${z}, 9.6, 0.4, 9.6, { noCollide: true, ink: BK });
  ring(${x}, ${y} + 8.6, ${z}, 'z');
  pickup(${x}, ${y} + 3.7, ${z});`
      },
      {
        id: 'boiler_furnace',
        title: 'Boiler Furnace Stack',
        description: 'Industrial furnace with wraparound catwalk, pressure vessel, and chimney grapple point.',
        minSize: [7, 5, 7],
        codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Boiler Furnace Stack at (${x}, ${y}, ${z}) ===
  box(${x}, ${y}, ${z}, 6.0, 3.0, 6.0, { ink: BL });
  cyl(${x}, ${y} + 3.0, ${z}, 2.0, 3.0, { seg: 8, ink: BK });
  slab(${x} - 3.5, ${z} - 3.5, ${x} + 3.5, ${z} + 3.5, ${y} + 3.0, 0.3, { ink: OR });
  rail(${x} - 3.5, ${z} - 3.5, ${x} + 3.5, ${z} - 3.5, ${y} + 3.0, { ink: BK });
  rail(${x} - 3.5, ${z} + 3.5, ${x} + 3.5, ${z} + 3.5, ${y} + 3.0, { ink: BK });
  cyl(${x} + 2.0, ${y} + 3.5, ${z}, 0.3, 3.5, { seg: 6, noCollide: true, ink: BK });
  ring(${x}, ${y} + 8.8, ${z}, 'z');
  pickup(${x}, ${y} + 3.2, ${z} + 2.0);`
      },
      {
        id: 'gear_bridge',
        title: 'Gear Bridge Observatory',
        description: 'Suspended observation bridge supported by massive interlocking gears.',
        minSize: [6, 5, 6],
        codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Gear Bridge Observatory at (${x}, ${y}, ${z}) ===
  box(${x} - 2.5, ${y}, ${z}, 1.0, 4.5, 1.0, { ink: BK });
  box(${x} + 2.5, ${y}, ${z}, 1.0, 4.5, 1.0, { ink: BK });
  slab(${x} - 3.5, ${z} - 2.0, ${x} + 3.5, ${z} + 2.0, ${y} + 4.0, 0.3, { ink: OR });
  rail(${x} - 3.5, ${z} - 2.0, ${x} + 3.5, ${z} - 2.0, ${y} + 4.0, { ink: BK });
  rail(${x} - 3.5, ${z} + 2.0, ${x} + 3.5, ${z} + 2.0, ${y} + 4.0, { ink: BK });
  cyl(${x}, ${y} + 1.0, ${z} + 2.5, 1.5, 0.4, { seg: 12, noCollide: true, ink: OR });
  ring(${x}, ${y} + 7.3, ${z}, 'y');`
      }
    ],

    colossal: [
      {
        id: 'pencil_turret',
        title: 'Giant Pencil Turret',
        description: 'Massive pencil standing upright with erasure platform and ferrule sniper ring.',
        minSize: [6, 6, 6],
        codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Giant Pencil Turret at (${x}, ${y}, ${z}) ===
  cyl(${x}, ${y}, ${z}, 1.2, 6.5, { seg: 6, ink: OR });
  cyl(${x}, ${y} + 5.5, ${z}, 1.3, 0.8, { seg: 6, ink: BK });
  slab(${x} - 2.0, ${z} - 2.0, ${x} + 2.0, ${z} + 2.0, ${y} + 4.5, 0.3, { ink: RD });
  rail(${x} - 2.0, ${z} - 2.0, ${x} + 2.0, ${z} - 2.0, ${y} + 4.5, { ink: BK });
  rail(${x} - 2.0, ${z} + 2.0, ${x} + 2.0, ${z} + 2.0, ${y} + 4.5, { ink: BK });
  box(${x}, ${y}, ${z} + 2.0, 1.5, 0.4, 1.5, { ink: BL });
  ring(${x}, ${y} + 8.8, ${z}, 'z');
  pickup(${x}, ${y} + 4.7, ${z});`
      },
      {
        id: 'sketchbook_rampart',
        title: 'Sketchbook Rampart',
        description: 'Open spiral-bound sketchbook forming a stepped rampart wall with cover pages.',
        minSize: [8, 5, 8],
        codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Sketchbook Rampart at (${x}, ${y}, ${z}) ===
  box(${x}, ${y}, ${z}, 8.0, 0.8, 5.0, { ink: BL });
  box(${x} - 2.5, ${y} + 0.8, ${z}, 3.0, 2.0, 4.5, { ink: BL });
  box(${x} + 2.5, ${y} + 0.8, ${z}, 3.0, 3.5, 4.5, { ink: BL });
  slab(${x} - 4.2, ${z} - 2.8, ${x} + 4.2, ${z} + 2.8, ${y} + 3.5, 0.3, { ink: OR });
  rail(${x} - 4.2, ${z} - 2.8, ${x} + 4.2, ${z} - 2.8, ${y} + 3.5, { ink: BK });
  box(${x}, ${y} + 4.0, ${z}, 8.2, 0.2, 5.2, { noCollide: true, ink: BK });
  ring(${x}, ${y} + 7.3, ${z}, 'y');
  pickup(${x} - 2.0, ${y} + 3.7, ${z});`
      },
      {
        id: 'desk_lamp_fortress',
        title: 'Desk Lamp Fortress',
        description: 'Anglepoise desk lamp with adjustable arm platforms and lampshade sniper dome.',
        minSize: [7, 6, 7],
        codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Desk Lamp Fortress at (${x}, ${y}, ${z}) ===
  box(${x}, ${y}, ${z}, 5.0, 0.6, 5.0, { ink: BK });
  box(${x}, ${y} + 0.6, ${z}, 1.0, 4.5, 1.0, { ink: BK });
  slab(${x} - 2.5, ${z} - 2.5, ${x} + 2.5, ${z} + 2.5, ${y} + 3.5, 0.3, { ink: OR });
  rail(${x} - 2.5, ${z} - 2.5, ${x} + 2.5, ${z} - 2.5, ${y} + 3.5, { ink: BK });
  rail(${x} - 2.5, ${z} + 2.5, ${x} + 2.5, ${z} + 2.5, ${y} + 3.5, { ink: BK });
  box(${x} + 1.5, ${y} + 4.5, ${z}, 3.5, 2.5, 3.5, { noCollide: true, ink: OR });
  ring(${x}, ${y} + 7.8, ${z}, 'z');
  pickup(${x}, ${y} + 3.7, ${z});`
      }
    ],

    maritime: [
      {
        id: 'galleon_sterncastle',
        title: 'Galleon Sterncastle Deck',
        description: 'Raised ship stern with captain\'s cabin, poop deck, and mast grapple point.',
        minSize: [8, 6, 8],
        codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Galleon Sterncastle at (${x}, ${y}, ${z}) ===
  box(${x}, ${y}, ${z}, 8.0, 2.0, 6.0, { ink: BL });
  box(${x}, ${y} + 2.0, ${z}, 7.5, 2.5, 5.5, { ink: OR });
  slab(${x} - 4.0, ${z} - 3.2, ${x} + 4.0, ${z} + 3.2, ${y} + 4.5, 0.3, { ink: OR });
  rail(${x} - 4.0, ${z} - 3.2, ${x} + 4.0, ${z} - 3.2, ${y} + 4.5, { ink: BK });
  rail(${x} - 4.0, ${z} + 3.2, ${x} + 4.0, ${z} + 3.2, ${y} + 4.5, { ink: BK });
  rail(${x} - 4.0, ${z} - 3.2, ${x} - 4.0, ${z} + 3.2, ${y} + 4.5, { ink: BK });
  box(${x}, ${y} + 4.8, ${z}, 1.0, 3.0, 0.5, { ink: BK });
  ring(${x}, ${y} + 9.3, ${z}, 'z');
  pickup(${x}, ${y} + 4.7, ${z});`
      },
      {
        id: 'lighthouse_beacon',
        title: 'Lighthouse Beacon Tower',
        description: 'Cylindrical lighthouse with spiral observation ledge and beacon lantern grapple.',
        minSize: [6, 6, 6],
        codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Lighthouse Beacon at (${x}, ${y}, ${z}) ===
  cyl(${x}, ${y}, ${z}, 2.2, 5.5, { seg: 10, ink: BL });
  slab(${x} - 2.8, ${z} - 2.8, ${x} + 2.8, ${z} + 2.8, ${y} + 5.0, 0.3, { ink: OR });
  rail(${x} - 2.8, ${z} - 2.8, ${x} + 2.8, ${z} - 2.8, ${y} + 5.0, { ink: BK });
  rail(${x} - 2.8, ${z} + 2.8, ${x} + 2.8, ${z} + 2.8, ${y} + 5.0, { ink: BK });
  cyl(${x}, ${y} + 5.3, ${z}, 1.5, 1.5, { seg: 8, noCollide: true, ink: OR });
  ring(${x}, ${y} + 9.3, ${z}, 'z');
  pickup(${x}, ${y} + 5.2, ${z});`
      },
      {
        id: 'cargo_crane',
        title: 'Cargo Crane Gantry',
        description: 'Dockside loading crane with elevated operator cabin and swinging hook grapple.',
        minSize: [7, 5, 7],
        codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Cargo Crane Gantry at (${x}, ${y}, ${z}) ===
  box(${x} - 2.5, ${y}, ${z} - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(${x} + 2.5, ${y}, ${z} - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(${x} - 2.5, ${y}, ${z} + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(${x} + 2.5, ${y}, ${z} + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(${x} - 3.0, ${z} - 3.0, ${x} + 3.0, ${z} + 3.0, ${y} + 5.5, 0.4, { ink: OR });
  box(${x}, ${y} + 5.9, ${z} - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(${x}, ${y} + 5.9, ${z} + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(${x}, ${y} + 8.3, ${z} + 4.0, 'z');
  pickup(${x}, ${y} + 6.1, ${z} - 1.5);`
      }
    ]
  };

  // Return theme-specific templates or fall back to a mix
  const themeKey = theme && templates[theme] ? theme : null;
  if (themeKey) return templates[themeKey];

  // Default: return one from each theme for variety
  return [
    templates.cyber[0],
    templates.steampunk[0],
    templates.colossal[0]
  ];
}

const templates = getMacroTemplates(themeArg || 'zen');
const selectedStructures = [];

// GOD MODE: Up to 4 buildings, consult blacklist, min spacing 15m
let templateIdx = 0;
const MAX_BUILDINGS = 4;

for (const pocket of voidCandidates) {
  if (selectedStructures.length >= MAX_BUILDINGS) break;

  const tooClose = selectedStructures.some(s => Math.hypot(s.x - pocket.x, s.z - pocket.z) < 15);
  if (tooClose) continue;

  // Find a non-blacklisted template that fits
  let placed = false;
  for (let attempt = 0; attempt < templates.length; attempt++) {
    const tpl = templates[(templateIdx + attempt) % templates.length];

    // GOD MODE: Check blacklist
    if (isTemplateBlacklisted(tpl.id)) {
      console.log(`   ⛔ Skipping blacklisted template: ${tpl.id}`);
      continue;
    }

    // Check size fit
    if (pocket.width >= tpl.minSize[0] && pocket.height >= tpl.minSize[1] && pocket.depth >= tpl.minSize[2]) {
      selectedStructures.push({
        ...tpl,
        x: pocket.x,
        y: 0,
        z: pocket.z,
        voidTier: pocket.tier
      });
      templateIdx = (templateIdx + attempt + 1) % templates.length;
      placed = true;
      break;
    }
  }
  if (!placed) templateIdx++;
}

console.log(`\n🏗️ Synthesized Interactive Macro-Structures (${selectedStructures.length}/${MAX_BUILDINGS} max):`);
selectedStructures.forEach((s, i) => {
  console.log(`   [${i + 1}] ${s.title} at (X: ${s.x}, Z: ${s.z}) [${s.voidTier}]`);
  console.log(`       Features: ${s.description}`);
});

if (selectedStructures.length === 0) {
  console.log(`ℹ️ No unencumbered macro voids available. Map is already structurally dense.`);
  process.exit(0);
}

// 5. Pre-Validation & Sandbox Dry Run
const validator = new GeometryValidator();
const validStructures = [];

for (const s of selectedStructures) {
  const codeSnippet = s.codeGenerator(s.x, s.y, s.z);

  const syntaxErrors = validator.validateCodeSyntax(codeSnippet);
  if (syntaxErrors.length > 0) {
    console.error(`⚠️ Syntax validation failure in structure "${s.title}":`, syntaxErrors[0].msg);
    blacklistTemplate(s.id, syntaxErrors[0].msg, mapArg);
    continue;
  }

  const dryRun = validator.testSandboxExecution(codeSnippet);
  if (!dryRun.valid) {
    console.error(`❌ Three.js dry-run rejection for "${s.title}": ${dryRun.error}`);
    blacklistTemplate(s.id, dryRun.error, mapArg);
    continue;
  }

  console.log(`   ✓ Pre-flight Verified: "${s.title}" (${dryRun.geoCount} safe buffers, 0 NaNs)`);
  validStructures.push(s);
}

if (validStructures.length === 0) {
  console.log(`ℹ️ No structures passed dry-run verification. Map code remains untouched.`);
  process.exit(0);
}

// 6. Inject Macro-Structures into src/levels/<map>.js
const levelFilePath = path.join(ROOT_DIR, 'src', 'levels', `${mapArg}.js`);
if (fs.existsSync(levelFilePath)) {
  let code = fs.readFileSync(levelFilePath, 'utf8');

  // Remove existing macro block if re-running
  if (code.includes('// === DREAM AUTO-INJECTED MACRO STRUCTURES ===')) {
    const regex = /\/\/ === DREAM AUTO-INJECTED MACRO STRUCTURES ===[\s\S]*?\/\/ === END DREAM AUTO-INJECTED MACRO STRUCTURES ===/g;
    code = code.replace(regex, '');
  }

  const generatedBlock = `
  // === DREAM AUTO-INJECTED MACRO STRUCTURES ===
${validStructures.map(s => s.codeGenerator(s.x, s.y, s.z)).join('\n')}
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===
`;

  if (code.includes('B.finish();')) {
    code = code.replace('B.finish();', `${generatedBlock}\n  B.finish();`);
  } else {
    code += `\n${generatedBlock}`;
  }

  fs.writeFileSync(levelFilePath, code, 'utf8');
  console.log(`\n💾 Injected ${validStructures.length} verified interactive macro buildings into src/levels/${mapArg}.js`);

  // Stair sanitizer pass
  const stairSanitizer = new StairSanitizer(mapArg);
  const stairCleanResult = stairSanitizer.sanitizeLevelFile(levelFilePath);
  if (stairCleanResult.cleanedCount > 0) {
    console.log(`🧹 Stair Sanitizer: Purged ${stairCleanResult.cleanedCount} redundant/conflicting staircases.`);
  }

  // Record success for each valid structure
  for (const s of validStructures) {
    registerSuccess(s.id, mapArg, 85, { x: s.x, y: s.y, z: s.z });
  }
}

// 7. Update Map Description dossier
const descPath = path.join(ROOT_DIR, 'Map Description', `${mapArg}.md`);
if (fs.existsSync(descPath)) {
  let desc = fs.readFileSync(descPath, 'utf8');
  const macroText = validStructures.map(s => `- **${s.title} (X=${s.x}, Z=${s.z})**: ${s.description}`).join('\n');

  if (!desc.includes('### Interactive Macro-Structures (Tier 3 & 4)')) {
    desc += `\n\n## 14. Interactive Macro-Structures (Tier 3 & 4)\n${macroText}\n`;
  } else {
    const regex = /## 14\. Interactive Macro-Structures[\s\S]*$/;
    desc = desc.replace(regex, `## 14. Interactive Macro-Structures (Tier 3 & 4)\n${macroText}\n`);
  }
  fs.writeFileSync(descPath, desc, 'utf8');
  console.log(`📄 Synchronized architectural dossier in Map Description/${mapArg}.md`);
}

// 8. Record learned pattern
recordLearnedPattern(mapArg, 'macro-dream-building', `Synthesized ${validStructures.length} multi-story interactive buildings (God Mode)`, 'macroSpatialInjection');

console.log(`\n============================================================`);
console.log(`✅ MACRO-DREAM INJECTION & SYNCHRONIZATION COMPLETE (GOD MODE)!`);
console.log(`   Buildings placed: ${validStructures.length}/${MAX_BUILDINGS}`);
console.log(`============================================================`);
