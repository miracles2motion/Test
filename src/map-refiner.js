#!/usr/bin/env node
/**
 * Doodle Strike - Map Refiner (God Mode)
 * Used when a map is fully densified and cannot accept new macro props safely.
 * Instead of injecting more, this module UPGRADES or HEALS existing geometry.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const mapArg = process.argv[2];
const themeArg = process.argv[3];
const actionArg = process.argv[4]; // 'upgrade' | 'heal'

if (!mapArg || !themeArg || !actionArg) {
  console.error("Usage: node map-refiner.js <mapName> <theme> <action>");
  process.exit(1);
}

const levelFilePath = path.join(ROOT_DIR, 'src', 'levels', `${mapArg}.js`);
if (!fs.existsSync(levelFilePath)) {
  console.error(`Map not found: ${levelFilePath}`);
  process.exit(1);
}

let code = fs.readFileSync(levelFilePath, 'utf8');
let modifications = 0;

if (actionArg === 'upgrade') {
  console.log(`\n💎 REFINEMENT [UPGRADE]: Swapping generic geometry for intricate thematic structures...`);
  
  // Find generic scatter cover: box(..., 1.2, 1.1, 1.2, { ink: BL })
  const genericRegex = /box\(([^,]+),\s*([^,]+),\s*([^,]+),\s*1\.2,\s*1\.1,\s*1\.2,\s*\{\s*ink:\s*BL\s*\}\);/g;
  
  code = code.replace(genericRegex, (match, x, y, z) => {
    modifications++;
    if (themeArg === 'cyber') {
      return `
    // Upgraded: Cyber Barricade
    box(${x}, ${y}, ${z}, 1.4, 1.0, 1.0, { ink: BK });
    box(${x}, ${y} + 0.8, ${z} + 0.2, 1.2, 0.4, 0.1, { noCollide: true, ink: OR });
    cyl(${x} - 0.6, ${y}, ${z}, 0.2, 1.5, { seg: 6, ink: BL });`;
    } else if (themeArg === 'zen') {
      return `
    // Upgraded: Zen Stone Lantern
    box(${x}, ${y}, ${z}, 0.8, 1.4, 0.8, { ink: BL });
    box(${x}, ${y} + 1.4, ${z}, 1.2, 0.3, 1.2, { ink: OR });
    box(${x}, ${y} + 1.7, ${z}, 0.6, 0.4, 0.6, { noCollide: true, ink: BK });
    sphere(${x}, ${y} + 2.1, ${z}, 0.3, { ink: RD });`;
    } else if (themeArg === 'maritime') {
      return `
    // Upgraded: Stacked Cargo Crates
    box(${x}, ${y}, ${z}, 1.2, 1.2, 1.2, { ink: OR });
    box(${x} - 0.2, ${y} + 1.2, ${z} + 0.1, 1.0, 1.0, 1.0, { ink: BL });
    box(${x}, ${y} + 2.2, ${z}, 0.5, 0.5, 0.5, { ink: BK });`;
    } else {
      // Default / Colossal / Steampunk
      return `
    // Upgraded: Reinforced Tech Pillar
    cyl(${x}, ${y}, ${z}, 0.8, 1.8, { seg: 8, ink: BL });
    box(${x}, ${y} + 0.4, ${z}, 1.8, 0.2, 0.2, { noCollide: true, ink: BK });
    box(${x}, ${y} + 1.2, ${z}, 1.8, 0.2, 0.2, { noCollide: true, ink: BK });`;
    }
  });

} else if (actionArg === 'heal') {
  console.log(`\n🩹 REFINEMENT [HEAL]: Adding micro-details to blank surfaces...`);
  
  // Find massive generic boxes (e.g. walls or platforms)
  const massiveBoxRegex = /box\(([^,]+),\s*([^,]+),\s*([^,]+),\s*24,\s*([^,]+),\s*24,\s*\{\s*ink:\s*BL\s*\}\);/g;
  
  code = code.replace(massiveBoxRegex, (match, x, y, z, h) => {
    modifications++;
    return `
  ${match}
  // Healed: Micro-detailing around massive block
  rail(${x} - 12.2, ${z} - 12.2, ${x} + 12.2, ${z} - 12.2, ${y} + ${h}, { ink: OR });
  rail(${x} - 12.2, ${z} + 12.2, ${x} + 12.2, ${z} + 12.2, ${y} + ${h}, { ink: OR });
  rail(${x} - 12.2, ${z} - 12.2, ${x} - 12.2, ${z} + 12.2, ${y} + ${h}, { ink: OR });
  rail(${x} + 12.2, ${z} - 12.2, ${x} + 12.2, ${z} + 12.2, ${y} + ${h}, { ink: OR });
  ring(${x}, ${y} + ${h} + 1.5, ${z}, 'y');`;
  });
}

if (modifications > 0) {
  fs.writeFileSync(levelFilePath, code, 'utf8');
  console.log(`✅ Refinement complete. Upgraded ${modifications} structural elements.`);
} else {
  console.log(`ℹ️ No structures found that matched the refinement criteria.`);
}
