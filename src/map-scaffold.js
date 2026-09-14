#!/usr/bin/env node
/**
 * Doodle Strike - Smart Map Scaffolder (Concept-Aware God Mode)
 * Generates production-ready, 100% standard-compliant map code.
 *
 * God Mode Features:
 *   - Reads existing concept documents (map_concepts/ or Map Description/)
 *   - Extracts dimensions (bounds, height, tiers, stair math) from concept
 *   - Falls back to learned presets only if concept is missing or thin
 *
 * Usage:
 *   node src/map-scaffold.js <mapName> [preset]
 *   npm run map:scaffold cyber_diner urban
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getLearningCache } from './map-learning.js';
import { BIOME_PALETTES } from './palettes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const rawName = process.argv[2];
const presetArg = (process.argv[3] || 'urban').toLowerCase();

if (!rawName) {
  console.log(`
🏗️  Doodle Strike - Smart Map Scaffolding Engine (God Mode)
============================================================
Usage:
  npm run map:scaffold <mapName> [preset]
============================================================
`);
  process.exit(1);
}

// Format names
const key = rawName.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
const pascalName = key.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
const displayName = key.split('_').map((w) => w.toUpperCase()).join(' ');

const cache = getLearningCache();

// 1. Load Fallback Presets
const presetConfig = {
  urban: { category: 'urban', floorY: 0, tier2Y: 4.0, tier3Y: 8.5, bounds: { P: 55, PH: 18 } },
  colossal: { category: 'colossal', floorY: 0, tier2Y: 6.0, tier3Y: 14.0, bounds: { P: 80, PH: 30 } },
  anomalous: { category: 'anomalous', floorY: 0, tier2Y: 4.5, tier3Y: 9.0, bounds: { P: 55, PH: 18 } },
  kinetic: { category: 'anomalous', floorY: 0, tier2Y: 5.0, tier3Y: 10.0, bounds: { P: 60, PH: 24 } }
}[presetArg] || { category: 'urban', floorY: 0, tier2Y: 4.0, tier3Y: 8.5, bounds: { P: 55, PH: 18 } };

let conf = {
  ...presetConfig,
  recRise: cache?.rules?.stairway?.recommendedRise || 0.2857,
  recRun: cache?.rules?.stairway?.recommendedRun || 0.45
};

// 2. Parse Concept Document (if exists) to override presets
const CONCEPTS_DIR = path.join(ROOT_DIR, 'map_concepts');
const DESC_DIR = path.join(ROOT_DIR, 'Map Description');

function findConceptFile() {
  if (fs.existsSync(CONCEPTS_DIR)) {
    const files = fs.readdirSync(CONCEPTS_DIR).filter(f => f.endsWith('.md'));
    const match = files.find(f => f.toLowerCase().includes(key));
    if (match) return path.join(CONCEPTS_DIR, match);
  }
  if (fs.existsSync(DESC_DIR)) {
    const files = fs.readdirSync(DESC_DIR).filter(f => f.endsWith('.md'));
    const match = files.find(f => f.toLowerCase().replace(/-/g, '_').includes(key));
    if (match) return path.join(DESC_DIR, match);
  }
  return null;
}

const conceptFile = findConceptFile();
if (conceptFile) {
  console.log(`\n📖 Parsing Concept: ${path.basename(conceptFile)}`);
  const md = fs.readFileSync(conceptFile, 'utf8');

  // Extract bounds: check Half-Span in table first, or Coordinate Boundary
  const spanMatch = md.match(/Half-Span[^\d]*(\d+(?:\.\d+)?)/i);
  if (spanMatch) {
    conf.bounds.P = parseFloat(spanMatch[1]);
  } else {
    const boundsMatch = md.match(/Coordinate Boundary[^\n]*X:\s*\[([-\d.]+)[m]?,\s*([+\d.]+)[m]?\]/i);
    if (boundsMatch) {
      const minX = Math.abs(parseFloat(boundsMatch[1]));
      const maxX = Math.abs(parseFloat(boundsMatch[2]));
      conf.bounds.P = Math.max(minX, maxX);
    }
  }

  const phMatch = md.match(/Wall Height[^\d]*(\d+(?:\.\d+)?)/i);
  if (phMatch) {
    conf.bounds.PH = parseFloat(phMatch[1]);
  } else {
    const heightMatch = md.match(/Coordinate Boundary[^\n]*Y:\s*\[([-\d.]+)[m]?,\s*([+\d.]+)[m]?\]/i);
    if (heightMatch) {
      conf.bounds.PH = Math.abs(parseFloat(heightMatch[2]));
    }
  }

  // Extract Tiers
  const tier2Match = md.match(/Tier 2.*Y\s*=\s*([+\d.]+)/i) || md.match(/y\s*=\s*([+\d.]+)[^\n]*Tier 2/i);
  if (tier2Match) conf.tier2Y = parseFloat(tier2Match[1]);
  const tier3Match = md.match(/Tier 3.*Y\s*=\s*([+\d.]+)/i) || md.match(/y\s*=\s*([+\d.]+)[^\n]*Tier 3/i);
  if (tier3Match) conf.tier3Y = parseFloat(tier3Match[1]);

  // Extract Inks (handles both "Primary Ink: INK.GREEN" and "`INK.GREEN` (Primary Ink)")
  let primaryInkVar = 'BL';
  let secondaryInkVar = 'BK';
  let accentInkVar = 'OR';
  const pMatch = md.match(/Primary Ink[*\s:]*INK\.(\w+)/i) || md.match(/INK\.(\w+)[^\n]*Primary Ink/i);
  if (pMatch) {
    const name = pMatch[1].toUpperCase();
    if (name === 'GREEN') primaryInkVar = 'GR';
    else if (name === 'RED') primaryInkVar = 'RD';
    else if (name === 'BLACK') primaryInkVar = 'BK';
    else if (name === 'ORANGE') primaryInkVar = 'OR';
    else if (name === 'BLUE') primaryInkVar = 'BL';
  }
  const sMatch = md.match(/Secondary Ink[*\s:]*INK\.(\w+)/i) || md.match(/INK\.(\w+)[^\n]*Secondary Ink/i);
  if (sMatch) {
    const name = sMatch[1].toUpperCase();
    if (name === 'BLACK') secondaryInkVar = 'BK';
    else if (name === 'BLUE') secondaryInkVar = 'BL';
    else if (name === 'GREEN') secondaryInkVar = 'GR';
  }
  const aMatch = md.match(/Accent Ink[s]?[*\s:]*INK\.(\w+)/i) || md.match(/INK\.(\w+)[^\n]*Accent Ink/i);
  if (aMatch) {
    const name = aMatch[1].toUpperCase();
    if (name === 'ORANGE') accentInkVar = 'OR';
    else if (name === 'RED') accentInkVar = 'RD';
    else if (name === 'GREEN') accentInkVar = 'GR';
  }

  conf.primaryInkVar = primaryInkVar;
  conf.secondaryInkVar = secondaryInkVar;
  conf.accentInkVar = accentInkVar;

  console.log(`   ✓ Applied concept bounds: P=${conf.bounds.P}m, PH=${conf.bounds.PH}m`);
  console.log(`   ✓ Applied concept tiers: T2=${conf.tier2Y}m, T3=${conf.tier3Y}m`);
  console.log(`   ✓ Applied concept inks: Primary=${primaryInkVar}, Secondary=${secondaryInkVar}, Accent=${accentInkVar}`);
} else {
  conf.primaryInkVar = 'BL';
  conf.secondaryInkVar = 'BK';
  conf.accentInkVar = 'OR';
  console.log(`\n⚠️ No concept found. Using fallback ${presetArg} presets.`);
}

const primaryInk = conf.primaryInkVar;
const secondaryInk = conf.secondaryInkVar;
const accentInk = conf.accentInkVar;

const centerStepCount = Math.max(6, Math.round(conf.tier2Y / conf.recRise));
const centerRise = parseFloat((conf.tier2Y / centerStepCount).toFixed(4));
const quadStepCount = Math.max(6, Math.round((conf.tier2Y * 0.8) / conf.recRise));
const quadRise = parseFloat(((conf.tier2Y * 0.8) / quadStepCount).toFixed(4));
const sniperStepCount = Math.max(6, Math.round((conf.tier3Y * 0.85) / conf.recRise));
const sniperRise = parseFloat(((conf.tier3Y * 0.85) / sniperStepCount).toFixed(4));

const centerSouthZ = parseFloat((-10 - centerStepCount * conf.recRun).toFixed(3));
const centerNorthZ = parseFloat((10 + centerStepCount * conf.recRun).toFixed(3));
const nwStairX = parseFloat((-20 + quadStepCount * conf.recRun).toFixed(3));
const neStairX = parseFloat((20 - sniperStepCount * conf.recRun).toFixed(3));
const swStairX = parseFloat((-20 + quadStepCount * conf.recRun).toFixed(3));
const seStairX = parseFloat((20 - quadStepCount * conf.recRun).toFixed(3));

const isRecipeMode = process.argv.includes('--recipe');
const recipesDir = path.join(ROOT_DIR, 'recipes');
const recipeFilePath = path.join(recipesDir, `${key}.json`);

let activeRecipe = null;
if (fs.existsSync(recipeFilePath)) {
  try { activeRecipe = JSON.parse(fs.readFileSync(recipeFilePath, 'utf8')); } catch (e) {}
}

if (!activeRecipe && isRecipeMode) {
  if (!fs.existsSync(recipesDir)) fs.mkdirSync(recipesDir, { recursive: true });
  const memoryFile = path.join(ROOT_DIR, '.agents', 'thematic-memory.json');
  let mem = {};
  try { mem = JSON.parse(fs.readFileSync(memoryFile, 'utf8')); } catch (e) {}
  const arch = mem.thematicArchetypes?.[presetArg] || mem.thematicArchetypes?.[key];
  const landmarkPrefab = arch?.props?.tier3_macro?.[0] || (conf.category === 'colossal' ? 'ancient_tree' : 'book_stack');
  const paletteKey = BIOME_PALETTES[presetArg] ? presetArg : (conf.category === 'colossal' ? 'forest' : 'urban');

  activeRecipe = {
    id: key,
    name: displayName,
    version: 1,
    seed: 1337,
    scale: conf.category === 'colossal' ? 'colossal' : (conf.category === 'urban' ? 'urban' : 'anomalous'),
    bounds: { half: conf.bounds.P, wallH: conf.bounds.PH },
    palette: paletteKey,
    paper: { tint: '#f6f3e7', rules: true, lineSpacing: 50 },
    ground: { ink: conf.primaryInkVar || 'BL' },
    sectors: [
      { id: 'alpha', shape: 'disc', c: [-20, -20], rIn: 8, rOut: 14, reward: { pickup: true } },
      { id: 'beta', shape: 'disc', c: [20, 20], rIn: 8, rOut: 14, reward: { pickup: true } }
    ],
    landmarks: [
      { prefab: landmarkPrefab, at: [0, 0, 0], opts: {}, role: 'hub', beacon: true }
    ],
    spawns: { cardinal: 4, offset: 5 },
    pickups: [
      { at: [0, 0.4, 0], tier: 'legendary' }
    ]
  };
  fs.writeFileSync(recipeFilePath, JSON.stringify(activeRecipe, null, 2), 'utf8');
  console.log(`📜 Declarative Recipe compiled: recipes/${key}.json (100% data-driven, zero box walls)`);
}

// 3. Generate Level Code
let levelCode = '';
if (activeRecipe) {
  levelCode = `import { buildMapFromRecipe } from '../map-recipe.js';

/**
 * Map: ${displayName} (${key})
 * Pure Declarative Recipe Implementation (Dream Master Architecture)
 * 100% Data-Driven, Biome-Adaptive, and Standard-Compliant.
 */
export const RECIPE = ${JSON.stringify(activeRecipe, null, 2)};

export function build${pascalName}(B, arena = false) {
  const result = buildMapFromRecipe(B, RECIPE, arena);
  B.finish();
  return result.L;
}
`;
} else {
  levelCode = `import * as THREE from 'three';
import { INK } from '../render.js';

/**
 * Map: ${displayName} (${key})
 * God Mode Scaffolding — Bounds and tiers synced with concept
 */
export function build${pascalName}(B, arena = false) {
  const { L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = INK.ORANGE ?? 3, GR = INK.GREEN ?? 4, BK = INK.BLACK ?? 2, BL = INK.BLUE ?? 0, RD = INK.RED ?? 1;

  L.key = '${key}';
  const P = arena ? ${conf.bounds.P + 13} : ${conf.bounds.P}, PH = arena ? ${conf.bounds.PH + 12} : ${conf.bounds.PH}, T = 6;
  const D = P - 3;
  L.bounds = { minX: -P, maxX: P, minZ: -P, maxZ: P };

  // 1. Foundation & Perimeter Walls
  box(0, -1.0, 0, 2 * P + T, 1.0, 2 * P + T, { ink: ${primaryInk} });
  box(0, 0, -P, 2 * P + T, PH, T, { ink: ${primaryInk} });
  box(0, 0, P, 2 * P + T, PH, T, { ink: ${primaryInk} });
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: ${primaryInk} });
  box(P, 0, 0, T, PH, 2 * P + T, { ink: ${primaryInk} });

  // Perimeter Doorways
  const doorFrame = (x, z, alongX) => {
    if (alongX) {
      box(x - 1.4, 0, z, 0.4, 3.4, 0.6, { noCollide: true, ink: ${secondaryInk} });
      box(x + 1.4, 0, z, 0.4, 3.4, 0.6, { noCollide: true, ink: ${secondaryInk} });
      box(x, 3.2, z, 3.2, 0.4, 0.6, { noCollide: true, ink: ${secondaryInk} });
    } else {
      box(x, 0, z - 1.4, 0.6, 3.4, 0.4, { noCollide: true, ink: ${secondaryInk} });
      box(x, 0, z + 1.4, 0.6, 3.4, 0.4, { noCollide: true, ink: ${secondaryInk} });
      box(x, 3.2, z, 0.6, 0.4, 3.2, { noCollide: true, ink: ${secondaryInk} });
    }
  };
  doorFrame(-D, 0, false); doorFrame(D, 0, false);
  doorFrame(0, -D, true); doorFrame(0, D, true);

  if (!arena) {
    const NG = { noNav: true, noGrapple: true };
    collider(0, PH, -P, 2 * P + T, 40, T, NG); collider(0, PH, P, 2 * P + T, 40, T, NG);
    collider(-P, PH, 0, T, 40, 2 * P + T, NG); collider(P, PH, 0, T, 40, 2 * P + T, NG);
    collider(0, PH + 38, 0, 2 * P + 40, 8.0, 2 * P + 40, NG);
  }

  // 2. Base Spawns & Vantages
  spawn(0, 0.2, D - 5);
  spawn(0, 0.2, -D + 5);
  spawn(-D + 5, 0.2, 0);
  spawn(D - 5, 0.2, 0);

  sniper(0, ${conf.tier3Y + 0.3}, 12);
  sniper(0, ${conf.tier3Y + 0.3}, -12);
  sniper(-30, ${conf.tier3Y + 0.2}, -D + 3);
  sniper(30, ${conf.tier3Y + 0.2}, D - 3);

  // Pickups
  pickup(0, ${conf.tier2Y + 0.2}, 0);
  pickup(0, ${conf.tier3Y + 0.3}, 0);
  pickup(-25, ${conf.tier2Y - 0.6}, -25);
  pickup(25, ${conf.tier2Y - 0.6}, 25);
  pickup(-14, 0.2, 6);
  pickup(14, 0.2, -6);

  // 3. Narrative Sector Topology & Central Feature
  const centerW = 20, centerD = 20, centerH = ${conf.tier2Y};
  slab(-centerW / 2, -centerD / 2, centerW / 2, centerD / 2, centerH, 0.45, { ink: ${accentInk} });
  rail(-centerW / 2, -centerD / 2, centerW / 2, -centerD / 2, centerH, { ink: ${secondaryInk} });
  rail(-centerW / 2, centerD / 2, centerW / 2, centerD / 2, centerH, { ink: ${secondaryInk} });
  rail(-centerW / 2, -centerD / 2, -centerW / 2, centerD / 2, centerH, { ink: ${secondaryInk} });
  rail(centerW / 2, -centerD / 2, centerW / 2, centerD / 2, centerH, { ink: ${secondaryInk} });

  // Center Cover nodes (waist-high)
  box(-4, centerH, 0, 1.4, 1.1, 3.2, { ink: ${primaryInk}, tag: 'cover' });
  box(4, centerH, 0, 1.4, 1.1, 3.2, { ink: ${primaryInk}, tag: 'cover' });
  box(0, centerH, -4, 3.2, 1.1, 1.4, { ink: ${primaryInk}, tag: 'cover' });
  box(0, centerH, 4, 3.2, 1.1, 1.4, { ink: ${primaryInk}, tag: 'cover' });
  
  // Dual Ascending Stairways connecting ground to center deck
  const rs = ${conf.recRise}, rn = ${conf.recRun};
  stairs(0, 0, ${centerSouthZ}, '+z', ${centerStepCount}, 3.2, { rise: ${centerRise}, run: ${conf.recRun}, ink: ${accentInk} });
  stairs(0, 0, ${centerNorthZ}, '-z', ${centerStepCount}, 3.2, { rise: ${centerRise}, run: ${conf.recRun}, ink: ${accentInk} });

  // 4. Tactical Quadrant Platforms & Flanking Lanes
  slab(-38, -38, -20, -20, ${conf.tier2Y * 0.8}, 0.4, { ink: ${primaryInk} });
  stairs(${nwStairX}, 0, -29, '-x', ${quadStepCount}, 2.8, { rise: ${quadRise}, run: ${conf.recRun}, ink: ${accentInk} });
  box(-29, ${conf.tier2Y * 0.8}, -23, 2.0, 1.1, 2.0, { ink: ${secondaryInk}, tag: 'cover' });

  slab(20, -38, 38, -20, ${conf.tier3Y * 0.85}, 0.4, { ink: ${primaryInk} });
  stairs(${neStairX}, 0, -29, '+x', ${sniperStepCount}, 2.8, { rise: ${sniperRise}, run: ${conf.recRun}, ink: ${accentInk} });
  box(29, ${conf.tier3Y * 0.85}, -23, 2.2, 1.1, 2.2, { ink: ${secondaryInk}, tag: 'cover' });

  slab(-38, 20, -20, 38, ${conf.tier2Y * 0.8}, 0.4, { ink: ${primaryInk} });
  stairs(${swStairX}, 0, 29, '-x', ${quadStepCount}, 2.8, { rise: ${quadRise}, run: ${conf.recRun}, ink: ${accentInk} });
  box(-29, ${conf.tier2Y * 0.8}, 23, 2.0, 1.1, 2.0, { ink: ${secondaryInk}, tag: 'cover' });

  slab(20, 20, 38, 38, ${conf.tier2Y * 0.8}, 0.4, { ink: ${primaryInk} });
  stairs(${seStairX}, 0, 29, '+x', ${quadStepCount}, 2.8, { rise: ${quadRise}, run: ${conf.recRun}, ink: ${accentInk} });
  box(29, ${conf.tier2Y * 0.8}, 23, 2.0, 1.1, 2.0, { ink: ${secondaryInk}, tag: 'cover' });

  // 5. Overhead Traversal Ring Network
  ring(0, ${conf.tier3Y + 3.5}, 0, 'y');
  ring(-29, ${conf.tier3Y + 3.0}, -29, 'y');
  ring(29, ${conf.tier3Y + 3.0}, -29, 'y');
  ring(-29, ${conf.tier3Y + 3.0}, 29, 'y');
  ring(29, ${conf.tier3Y + 3.0}, 29, 'y');

  // Ground collision floor
  collider(0, -2, 0, 2 * P + 20, 2, 2 * P + 20);
  L.playerStart.set(0, 0.2, D - 5); 
  
  B.finish();
  return L;
}
`;
}

const levelFilePath = path.join(ROOT_DIR, 'src', 'levels', `${key}.js`);
if (!fs.existsSync(levelFilePath)) {
  fs.mkdirSync(path.dirname(levelFilePath), { recursive: true });
  fs.writeFileSync(levelFilePath, levelCode, 'utf8');
  console.log(`✅ Scaffolded level module: src/levels/${key}.js`);
} else {
  if (isRecipeMode && activeRecipe) {
    fs.writeFileSync(levelFilePath, levelCode, 'utf8');
    console.log(`🔄 Updated level module with declarative recipe: src/levels/${key}.js`);
  } else {
    console.log(`⚠️ Level file already exists, skipping scaffold creation.`);
  }
}

// 4. Register in src/level.js
const levelManagerFile = path.join(ROOT_DIR, 'src', 'level.js');
if (fs.existsSync(levelManagerFile)) {
  let mgrCode = fs.readFileSync(levelManagerFile, 'utf8');

  // Add import if missing
  if (!mgrCode.includes(`import { build${pascalName} }`)) {
    const importStatement = `import { build${pascalName} } from './levels/${key}.js';\n`;
    const firstImportIndex = mgrCode.indexOf('import ');
    if (firstImportIndex !== -1) {
      mgrCode = mgrCode.slice(0, firstImportIndex) + importStatement + mgrCode.slice(firstImportIndex);
    } else {
      mgrCode = importStatement + mgrCode;
    }
  }

  // Add to MAP_BUILDERS
  if (!mgrCode.includes(`${key}: build${pascalName}`)) {
    const buildersRegex = /export const MAP_BUILDERS = {([\s\S]*?)};/;
    const match = mgrCode.match(buildersRegex);
    if (match) {
      const currentBuilders = match[1].replace(/\s+$/, '').replace(/,+$/, '');
      const newBuildersBlock = `export const MAP_BUILDERS = {${currentBuilders},\n  ${key}: build${pascalName}\n};`;
      mgrCode = mgrCode.replace(buildersRegex, newBuildersBlock);
    }
  }

  // Add to LEVELS array
  if (!mgrCode.includes(`key: '${key}'`)) {
    const levelsRegex = /export const LEVELS = \[([\s\S]*?)\];/;
    const match = mgrCode.match(levelsRegex);
    if (match) {
      const currentLevels = match[1].replace(/\s+$/, '');
      const newLevelEntry = `  {
    key: '${key}',
    name: '${displayName}',
    category: '${conf.category}',
    tags: ['DREAM MODE', 'AUTO-GENERATED'],
    env: '${displayName} Environment',
    engagement: 'CQB & Vertical',
    hazard: 'TBD',
    scale: 'Tier 1-4',
    comingSoon: false
  }`;
      const newLevelsBlock = `export const LEVELS = [${currentLevels}${currentLevels.endsWith(',') ? '' : ','}\n${newLevelEntry}\n];`;
      mgrCode = mgrCode.replace(levelsRegex, newLevelsBlock);
    }
  }

  fs.writeFileSync(levelManagerFile, mgrCode, 'utf8');
  console.log(`✅ Registered build${pascalName} in src/level.js MAP_BUILDERS registry.`);
}

console.log(`\n============================================================`);
console.log(`✅ SCAFFOLD COMPLETE. Map is ready for Dream God Mode injection.`);
console.log(`============================================================`);
