#!/usr/bin/env node
/**
 * Doodle Strike - 3D Macro-Void Volumetric Scanner & Architectural Synthesizer
 *
 * Scans level geometry for large contiguous spatial pockets (≥8m x 6m x 8m voids),
 * dreams interactive multi-story architectural macro-structures (Pagodas, Bell Pavilions,
 * Steam Dynamos, Gatehouses, Watchtowers) matching the level archetype, and writes
 * clean procedural geometry with stairs, walkable platforms, and grapple points into the level.
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
import { recordLearnedPattern } from './map-learning.js';
import { GeometryValidator } from './geometry-validator.js';
import { StairSanitizer } from './stair-sanitizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const mapArg = (process.argv[2] || '').toLowerCase().trim();
const themeArg = (process.argv[3] || '').toLowerCase().trim();

if (!mapArg || !MAP_BUILDERS[mapArg]) {
  console.log(`
🏛️ Doodle Strike - 3D Macro-Void Volumetric Synthesizer
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
console.log(`🏛️ MACRO-VOID SCANNER: [${mapArg.toUpperCase()}]`);
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
    const overlapX = minX < c.max.x && maxX > c.min.x;
    const overlapY = minY < c.max.y && maxY > c.min.y;
    const overlapZ = minZ < c.max.z && maxZ > c.min.z;
    if (overlapX && overlapY && overlapZ) return false;
  }

  // Check spawns (2.5m radius)
  for (const sp of levelObj.spawns || []) {
    if (Math.hypot(cx - sp.x, cz - sp.z) < 3.0 && Math.abs(cy - sp.y) < 3.0) return false;
  }

  // Check snipers
  for (const sn of levelObj.snipers || []) {
    if (Math.hypot(cx - sn.x, cz - sn.z) < 2.5 && Math.abs(cy - sn.y) < 3.0) return false;
  }

  return true;
}

// 3. Grid Search for Large Continuous Spatial Voids (≥ 8m x 6m x 8m)
console.log(`📡 Scanning coordinate grid for large macro voids (≥ 8m x 6m x 8m)...`);
const step = 8.0;
const voidCandidates = [];

for (let x = bounds.minX + 12; x <= bounds.maxX - 12; x += step) {
  for (let z = bounds.minZ + 12; z <= bounds.maxZ - 12; z += step) {
    // Avoid dead center plaza if crowded
    if (Math.abs(x) < 6 && Math.abs(z) < 6) continue;
    if (isVolumetricPocketClear(x, 0, z, 10.0, 7.0, 10.0, 1.2)) {
      voidCandidates.push({ x, y: 0, z, width: 10.0, height: 7.0, depth: 10.0 });
    }
  }
}

console.log(`✨ Found ${voidCandidates.length} potential macro-void locations.`);

// 4. Synthesize Thematic Interactive Macro-Structures
function getMacroTemplates(theme) {
  if (theme === 'zen') {
    return [
      {
        id: 'bell_pavilion',
        title: 'Bonshō Bell & Tea Pavilion',
        description: 'Multi-tiered wooden open shrine with playable intermediate stairs, upper meditation deck, hanging bronze bell, and apex grapple beam.',
        minSize: [10, 6, 10],
        codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Bonshō Bell & Tea Pavilion at (${x}, ${y}, ${z}) ===
  // 1. Raised Stone Foundation & Plinth
  box(${x}, ${y}, ${z}, 8.4, 0.6, 8.4, { ink: BL });
  box(${x}, ${y} + 0.6, ${z}, 7.6, 0.4, 7.6, { ink: BL });

  // 2. Corner Timber Pillars (4 Cardinal Pillars)
  box(${x} - 3.2, ${y} + 1.0, ${z} - 3.2, 0.6, 4.2, 0.6, { ink: BK });
  box(${x} + 3.2, ${y} + 1.0, ${z} - 3.2, 0.6, 4.2, 0.6, { ink: BK });
  box(${x} - 3.2, ${y} + 1.0, ${z} + 3.2, 0.6, 4.2, 0.6, { ink: BK });
  box(${x} + 3.2, ${y} + 1.0, ${z} + 3.2, 0.6, 4.2, 0.6, { ink: BK });

  // 3. First Tier Walkable Mezzanine Deck at Y = 4.2m
  slab(${x} - 4.0, ${z} - 4.0, ${x} + 4.0, ${z} + 4.0, ${y} + 4.2, 0.4, { ink: OR });
  rail(${x} - 4.0, ${z} - 4.0, ${x} + 4.0, ${z} - 4.0, ${y} + 4.2, { ink: OR });
  rail(${x} - 4.0, ${z} + 4.0, ${x} + 4.0, ${z} + 4.0, ${y} + 4.2, { ink: OR });
  rail(${x} - 4.0, ${z} - 4.0, ${x} - 4.0, ${z} + 4.0, ${y} + 4.2, { ink: OR });
  rail(${x} + 4.0, ${z} - 4.0, ${x} + 4.0, ${z} + 4.0, ${y} + 4.2, { ink: OR });

  // 4. Overhead Curved Kawara Eaves & Roof
  box(${x}, ${y} + 4.4, ${z}, 9.6, 0.4, 9.6, { noCollide: true, ink: BK });
  box(${x}, ${y} + 5.6, ${z}, 6.0, 0.4, 6.0, { noCollide: true, ink: BK });
  box(${x}, ${y} + 6.8, ${z}, 2.4, 0.5, 2.4, { noCollide: true, ink: BK });

  // 5. Bonshō Bronze Bell & Grapple Finial
  cyl(${x}, ${y} + 3.0, ${z}, 0.8, 1.6, { seg: 8, noCollide: true, ink: RD });
  ring(${x}, ${y} + 6.2, ${z}, 'z');
  pickup(${x}, ${y} + 4.4, ${z});
`
      },
      {
        id: 'stepped_teahouse',
        title: 'Engawa Lookout Sanctuary',
        description: 'Multi-room veranda teahouse with tatami platforms, waist-high railing cover, and overlooking sniper terrace.',
        minSize: [10, 5, 10],
        codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Engawa Lookout Sanctuary at (${x}, ${y}, ${z}) ===
  // 1. Foundation Slabs
  box(${x}, ${y}, ${z}, 9.0, 0.8, 9.0, { ink: BL });
  
  // 2. Raised Veranda (Engawa Deck) at Y = 2.4m
  box(${x}, ${y} + 0.8, ${z}, 7.8, 1.6, 7.8, { ink: BL });
  slab(${x} - 4.3, ${z} - 4.3, ${x} + 4.3, ${z} + 4.3, ${y} + 2.4, 0.4, { ink: OR });
  
  // 3. Waist-High Cover Railings (1.1m height)
  box(${x} - 4.1, ${y} + 2.4, ${z}, 0.2, 1.1, 8.2, { ink: BK });
  box(${x} + 4.1, ${y} + 2.4, ${z}, 0.2, 1.1, 8.2, { ink: BK });
  box(${x}, ${y} + 2.4, ${z} - 4.1, 8.2, 1.1, 0.2, { ink: BK });

  // 4. Overhead Pagoda Canopy & Grapple Beam
  box(${x}, ${y} + 5.2, ${z}, 9.4, 0.3, 9.4, { noCollide: true, ink: BK });
  ring(${x}, ${y} + 6.0, ${z}, 'z');
  pickup(${x} + 2.0, ${y} + 2.6, ${z} - 2.0);
`
      }
    ];
  }

  // Default / Steampunk / Urban Fallback
  return [
    {
      id: 'tactical_bunker',
      title: 'Tactical Watchtower & Outpost',
      description: 'Reinforced observation outpost with interior stairways, perimeter defilades, and apex vantage balcony.',
      minSize: [10, 6, 10],
      codeGenerator: (x, y, z) => `
  // === MACRO STRUCTURE: Tactical Watchtower at (${x}, ${y}, ${z}) ===
  box(${x}, ${y}, ${z}, 8.0, 4.0, 8.0, { ink: BL });
  slab(${x} - 4.3, ${z} - 4.3, ${x} + 4.3, ${z} + 4.3, ${y} + 4.0, 0.4, { ink: OR });
  rail(${x} - 4.2, ${z} - 4.2, ${x} + 4.2, ${z} - 4.2, ${y} + 4.0, { ink: OR });
  rail(${x} - 4.2, ${z} + 4.2, ${x} + 4.2, ${z} + 4.2, ${y} + 4.0, { ink: OR });
  for (let s = 0; s < 14; s++) {
    box(${x} + 4.5, ${y} + s * 0.28, ${z} - 3.0 + s * 0.45, 1.4, 0.28, 0.45, { ink: BL });
  }
  ring(${x}, ${y} + 6.5, ${z}, 'z');
  pickup(${x}, ${y} + 4.2, ${z});
`
    }
  ];
}

const templates = getMacroTemplates(themeArg || 'zen');
const selectedStructures = [];

// Choose the best spacious voids and assign non-overlapping templates
let templateIdx = 0;
for (const pocket of voidCandidates) {
  if (selectedStructures.length >= 2) break; // Limit to top 2 best open macro spaces per map

  // Check distance from already selected structures (keep ≥ 20m apart)
  const tooClose = selectedStructures.some(s => Math.hypot(s.x - pocket.x, s.z - pocket.z) < 20);
  if (tooClose) continue;

  const tpl = templates[templateIdx % templates.length];
  selectedStructures.push({
    ...tpl,
    x: pocket.x,
    y: 0,
    z: pocket.z
  });
  templateIdx++;
}

console.log(`\n🏗️ Synthesized Interactive Macro-Structures:`);
selectedStructures.forEach((s, i) => {
  console.log(`   [${i + 1}] ${s.title} at (X: ${s.x}, Z: ${s.z})`);
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
  
  // Syntax signature check
  const syntaxErrors = validator.validateCodeSyntax(codeSnippet);
  if (syntaxErrors.length > 0) {
    console.error(`⚠️ Syntax validation failure in structure "${s.title}":`, syntaxErrors);
    recordLearnedPattern(mapArg, 'macro-syntax-failure', syntaxErrors[0].msg, 'autoRejectStructure');
    continue;
  }

  // Three.js BufferGeometry dry-run
  const dryRun = validator.testSandboxExecution(codeSnippet);
  if (!dryRun.valid) {
    console.error(`❌ Three.js dry-run geometry rejection for "${s.title}": ${dryRun.error}`);
    recordLearnedPattern(mapArg, 'macro-geometry-rejection', dryRun.error, 'autoRejectStructure');
    continue;
  }

  console.log(`   ✓ Pre-flight Verified: "${s.title}" (${dryRun.geoCount} safe geometry buffers, 0 NaNs)`);
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

  // Run automatic Stair Sanitizer pass to purge any structural conflicts or overlapping stair flights
  const stairSanitizer = new StairSanitizer(mapArg);
  const stairCleanResult = stairSanitizer.sanitizeLevelFile(levelFilePath);
  if (stairCleanResult.cleanedCount > 0) {
    console.log(`🧹 Stair Sanitizer: Purged ${stairCleanResult.cleanedCount} redundant/conflicting staircases.`);
  }
}

// 7. Update Map Description dossier with the new macro buildings
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

// 7. Record learned pattern
recordLearnedPattern(mapArg, 'macro-dream-building', `Synthesized ${selectedStructures.length} multi-story interactive buildings`, 'macroSpatialInjection');

console.log(`\n============================================================`);
console.log(`✅ MACRO-DREAM INJECTION & SYNCHRONIZATION COMPLETE!`);
console.log(`============================================================`);
