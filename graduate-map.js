#!/usr/bin/env node
/**
 * Doodle Strike - Map Graduation Utility
 * Automatically moves a concept doc from map_concepts/ to Map Description/
 * and formats the filename properly (kebab-case without number prefixes).
 *
 * Usage:
 *   node graduate-map.js <conceptNumberOrName>
 *
 * Examples:
 *   node graduate-map.js 03
 *   node graduate-map.js clockwork
 *   node graduate-map.js 04_blueprint_castle.md
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname);

const arg = process.argv[2];
if (!arg) {
  console.log(`
Usage:
  node graduate-map.js <conceptNumberOrName>

Examples:
  node graduate-map.js 03
  node graduate-map.js clockwork
  node graduate-map.js 04_blueprint_castle.md
`);
  process.exit(1);
}

const conceptsDir = path.join(ROOT_DIR, 'map_concepts');
const descDir = path.join(ROOT_DIR, 'Map Description');

if (!fs.existsSync(descDir)) {
  fs.mkdirSync(descDir, { recursive: true });
}

const files = fs.readdirSync(conceptsDir).filter(f => f.endsWith('.md'));
const targetFile = files.find(f => {
  const norm = f.toLowerCase();
  const query = arg.toLowerCase();
  return norm.includes(query);
});

if (!targetFile) {
  console.error(`❌ Could not find concept file matching "${arg}" in map_concepts/`);
  console.log(`Available concepts:\n  ${files.join('\n  ')}`);
  process.exit(1);
}

// Convert "03_clockwork_tower.md" -> "clockwork-tower.md"
const cleanName = targetFile
  .replace(/^\d+[-_]?/, '') // remove leading digits & separator
  .replace(/_/g, '-')       // snake_case to kebab-case
  .toLowerCase();

const srcPath = path.join(conceptsDir, targetFile);
const destPath = path.join(descDir, cleanName);

console.log(`🚀 Graduating map concept:`);
console.log(`   Source:      map_concepts/${targetFile}`);
console.log(`   Destination: Map Description/${cleanName}`);

try {
  // Use git mv if tracked, else fs rename
  try {
    execSync(`git mv "${path.relative(ROOT_DIR, srcPath)}" "${path.relative(ROOT_DIR, destPath)}"`, { cwd: ROOT_DIR, stdio: 'pipe' });
  } catch (e) {
    fs.renameSync(srcPath, destPath);
  }

  console.log(`\n✅ Successfully graduated to Map Description/${cleanName}!`);
  console.log(`\n📋 MAP REGISTRATION CHECKLIST FOR NEW MAP:`);
  console.log(`   1. [src/level.js] LEVELS array: ensure 'comingSoon: false' (or omit) once built.`);
  console.log(`   2. [src/level.js] MAP_BUILDERS: register your builder function (e.g. key: buildMyMap).`);
  console.log(`   3. [src/main.js]  getMapSVG(): provide thumbnail and blueprint SVG paths.`);
  console.log(`   4. Verify: run 'npm run audit:map all' to guarantee zero crashes and full standard compliance.`);
  console.log(`\n   Run 'git status' and commit your changes.`);
} catch (err) {
  console.error(`❌ Error graduating map: ${err.message}`);
  process.exit(1);
}
