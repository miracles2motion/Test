#!/usr/bin/env node
/**
 * Doodle Strike - Map Refiner (Density Matrix & Quality Assessment)
 * Applies the Universal Detailing Standard to maps.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

import { healMap } from './dream-healer.js';

const mapArg = process.argv.find((a, i) => i > 1 && !a.startsWith('-'));
const rawAction = process.argv.find((a, i) => i > 2 && !a.startsWith('-')) || 'detail';
const actionArg = rawAction; // 'detail' | 'heal'
const isQuiet = process.argv.includes('--quiet') || process.argv.includes('-q');
const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');

let originalConsoleLog = console.log;
if (isQuiet && !isVerbose) console.log = () => {};

if (!mapArg) {
  console.error("Usage: node map-refiner.js <mapName> [action]");
  process.exit(1);
}

const levelFilePath = path.join(ROOT_DIR, 'src', 'levels', `${mapArg}.js`);
if (!fs.existsSync(levelFilePath)) {
  console.error(`Map not found: ${levelFilePath}`);
  process.exit(1);
}

let code = fs.readFileSync(levelFilePath, 'utf8');

// --- 1. Density Matrix Analysis ---
const boxMatches = [...code.matchAll(/box\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+)(?:,\s*(\{.*?\}))?\)/g)];
const cylMatches = [...code.matchAll(/cyl\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+)(?:,\s*(\{.*?\}))?\)/g)];

const totalProps = boxMatches.length + cylMatches.length;
const densityThreshold = 120; // If more than 120 geometric primitives exist, map is dense
const isDense = totalProps > densityThreshold;

console.log(`\n📊 DENSITY MATRIX: Map has ${totalProps} geometric props.`);
let action = actionArg;

if (action === 'detail' && isDense) {
  console.log(`⚠️ SECTOR DENSITY EXCEEDS 70% THRESHOLD (Dense). Switching from DETAIL to HEAL mode to prevent clutter.`);
  action = 'heal';
} else if (action === 'detail') {
  console.log(`✅ Sector density is optimal. Proceeding with MICRO-DETAILING (Scattering Tier 1/2 props).`);
}

let modifications = 0;

if (action === 'detail') {
  // Determine map theme from memory
  let theme = 'colossal';
  try {
    const memory = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, '.agents', 'thematic-memory.json'), 'utf8'));
    for (const [tKey, arch] of Object.entries(memory.thematicArchetypes || {})) {
      if (tKey === mapArg || (arch.keywords && arch.keywords.some(k => mapArg.includes(k)))) {
        theme = tKey;
        break;
      }
    }
  } catch (e) {}

  // MICRO-DETAILING: Find large flat surfaces (tables, platforms) and scatter theme-authentic static props
  const largeFlatBoxRegex = /box\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+)(?:,\s*(\{.*?\}))?\);/g;
  
  code = code.replace(largeFlatBoxRegex, (match, x, y, z, w, h, d, opts) => {
    const width = parseFloat(w);
    const depth = parseFloat(d);
    
    // If it's a large flat surface (e.g. a desk or wide platform)
    if (width >= 4 && depth >= 4 && parseFloat(h) < 2) {
      modifications++;
      const topY = parseFloat(y) + parseFloat(h);
      
      if (theme === 'forest') {
        return `${match}
  // Dream Detail: Scattered Forest Micro-Props
  buildToadstoolCluster(B, ${x} - 1.2, ${topY}, ${z} + 0.5, 3);
  sphere(${x} + 0.8, ${topY} + 0.35, ${z} - 0.8, 0.45, { ink: BK, tag: 'cover' }); // River Stone
  box(${x} - 0.2, ${topY}, ${z} + 1.2, 0.6, 0.15, 0.4, { ink: OR, noCollide: true }); // Cedar Woodchip`;
      } else if (theme === 'maritime') {
        return `${match}
  // Dream Detail: Maritime Flotsam Props
  barrel(${x} - 1.0, ${topY}, ${z} + 0.5, 0.6, 1.0, { ink: OR }); // Rum Barrel
  cyl(${x} + 0.8, ${topY}, ${z} - 0.8, 0.25, 0.6, { ink: BK }); // Mooring Bollard
  sphere(${x} - 0.2, ${topY} + 0.2, ${z} + 1.0, 0.25, { ink: BK, noCollide: true }); // Cannonball`;
      } else if (theme === 'zen') {
        return `${match}
  // Dream Detail: Zen Garden Micro Props
  cyl(${x} - 1.0, ${topY}, ${z} + 0.5, 0.35, 0.7, { ink: BK, tag: 'cover' }); // Stone Lantern
  cyl(${x} + 0.8, ${topY}, ${z} - 0.8, 0.1, 1.4, { ink: GR, noCollide: true }); // Bamboo Shoot`;
      } else if (theme === 'space_station' || theme === 'station') {
        return `${match}
  // Dream Detail: Scattered Space Station Micro-Props
  box(${x} - 1.0, ${topY}, ${z} + 0.5, 0.7, 0.3, 0.5, { ink: BL, tag: 'cover' }); // Diagnostic Data Slate
  cyl(${x} + 0.8, ${topY}, ${z} - 0.8, 0.22, 0.85, { ink: OR, tag: 'cover' }); // Pressurized Cryo Canister
  sphere(${x} - 0.2, ${topY} + 0.25, ${z} + 0.9, 0.2, { ink: RD, noCollide: true }); // Emergency Warning Beacon`;
      } else {
        return `${match}
  // Dream Detail: Scattered Desk Props (Static collision geometry)
  box(${x} - 1.2, ${topY}, ${z} + 0.5, 0.6, 0.2, 0.8, { ink: BL }); // Book
  box(${x} + 0.8, ${topY}, ${z} - 1.0, 0.8, 0.1, 0.1, { ink: OR }); // Pencil
  cyl(${x} - 0.2, ${topY}, ${z} + 1.2, 0.2, 0.6, { ink: BK }); // Ink Well`;
      }
    }
    return match;
  });

  if (theme === 'forest' && modifications > 0 && !code.includes('buildToadstoolCluster')) {
    code = `import { buildToadstoolCluster } from '../prefabs.js';\n` + code;
  }

  if (modifications > 0) {
    fs.writeFileSync(levelFilePath, code, 'utf8');
    if (!isQuiet || isVerbose) originalConsoleLog(`✅ Dream completed execution. Applied ${modifications} detailing/healing upgrades.`);
  } else {
    if (!isQuiet || isVerbose) originalConsoleLog(`ℹ️ Map already meets Universal Detailing Standards. No upgrades needed.`);
  }

  if (isQuiet && !isVerbose) {
    originalConsoleLog(`🎨 [MAP REFINER] Refined [${mapArg}] with micro-details.`);
  }

} else if (action === 'heal') {
  // Pass control to the intelligent physics-based Dream Healer
  healMap(levelFilePath);
}
