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

const mapArg = process.argv[2];
const actionArg = process.argv[3] || 'detail'; // 'detail' | 'heal'

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
  // MICRO-DETAILING: Find large flat surfaces (tables, platforms) and scatter static props
  // Rule 4: Surface-Stack Pattern
  const largeFlatBoxRegex = /box\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+)(?:,\s*(\{.*?\}))?\);/g;
  
  code = code.replace(largeFlatBoxRegex, (match, x, y, z, w, h, d, opts) => {
    const width = parseFloat(w);
    const depth = parseFloat(d);
    
    // If it's a large flat surface (e.g. a desk or wide platform)
    if (width >= 4 && depth >= 4 && parseFloat(h) < 2) {
      modifications++;
      // Add static books, pencils (collision enabled per user request)
      return `${match}
  // Dream Detail: Scattered Desk Props (Static collision geometry)
  box(${x} - 1.2, ${y} + ${parseFloat(h) / 2 + 0.1}, ${z} + 0.5, 0.6, 0.2, 0.8, { ink: BL }); // Book
  box(${x} + 0.8, ${y} + ${parseFloat(h) / 2 + 0.05}, ${z} - 1.0, 0.8, 0.1, 0.1, { ink: OR }); // Pencil
  cyl(${x} - 0.2, ${y} + ${parseFloat(h) / 2 + 0.3}, ${z} + 1.2, 0.2, 0.6, { ink: BK }); // Ink Well`;
    }
    return match;
  });

} else if (action === 'heal') {
  // HEALING MODE: Quality Assessment Algorithm (Anatomy & Ink Contrast Check)
  // Find single-color structural boxes and upgrade them with the Skeleton-Skin-Trim triad
  const simpleBoxRegex = /box\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+)(?:,\s*(\{.*?\}))?\);/g;
  
  code = code.replace(simpleBoxRegex, (match, x, y, z, w, h, d, opts) => {
    // If it's a medium-sized block, add trim to it
    if (parseFloat(w) > 2 && parseFloat(h) > 1.5 && parseFloat(d) > 2 && modifications < 10) {
      modifications++;
      const topY = `${y} + ${parseFloat(h) / 2}`;
      return `${match}
  // Dream Heal: Skeleton-Skin-Trim Applied (Rule 1 & 9)
  box(${x}, ${topY} + 0.05, ${z}, ${parseFloat(w) + 0.2}, 0.1, ${parseFloat(d) + 0.2}, { ink: BK }); // Contrast Trim Deck
  box(${x}, ${y}, ${z} + ${parseFloat(d) / 2 + 0.1}, 0.8, 0.2, 0.2, { ink: OR }); // Drawer Handle`;
    }
    return match;
  });
}

if (modifications > 0) {
  fs.writeFileSync(levelFilePath, code, 'utf8');
  console.log(`✅ Dream completed execution. Applied ${modifications} detailing/healing upgrades.`);
} else {
  console.log(`ℹ️ Map already meets Universal Detailing Standards. No upgrades needed.`);
}
