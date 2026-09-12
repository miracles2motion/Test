#!/usr/bin/env node
/**
 * Doodle Strike - Map Packaging & Snapshot Tool
 * Bundles map level code, concepts, and dependencies into a self-contained archive/snapshot.
 *
 * Usage:
 *   node src/map-pack.js <mapKey>
 *   npm run map:pack clockwork
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const mapArg = (process.argv[2] || '').toLowerCase().trim();

if (!mapArg) {
  console.log(`
📦 Doodle Strike - Map Packaging & Export Tool
============================================================
Usage:
  npm run map:pack <mapKey>

Examples:
  npm run map:pack clockwork
  npm run map:pack zen
  npm run map:pack classroom
============================================================
`);
  process.exit(1);
}

const levelsDir = path.join(ROOT_DIR, 'src', 'levels');
const conceptsDir = path.join(ROOT_DIR, 'map_concepts');
const descDir = path.join(ROOT_DIR, 'Map Description');
const snapshotsDir = path.join(ROOT_DIR, '.snapshots');

fs.mkdirSync(snapshotsDir, { recursive: true });

// Find Level Code
let levelFile = null;
if (fs.existsSync(path.join(levelsDir, `${mapArg}.js`))) {
  levelFile = path.join(levelsDir, `${mapArg}.js`);
}

// Find Concept File
let conceptFile = null;
if (fs.existsSync(conceptsDir)) {
  const matches = fs.readdirSync(conceptsDir).filter((f) => f.toLowerCase().includes(mapArg));
  if (matches.length > 0) conceptFile = path.join(conceptsDir, matches[0]);
}
if (!conceptFile && fs.existsSync(descDir)) {
  const matches = fs.readdirSync(descDir).filter((f) => f.toLowerCase().includes(mapArg));
  if (matches.length > 0) conceptFile = path.join(descDir, matches[0]);
}

console.log(`📦 Packaging Map [${mapArg.toUpperCase()}]...`);

const manifest = {
  key: mapArg,
  timestamp: new Date().toISOString(),
  files: {
    levelSource: levelFile ? path.relative(ROOT_DIR, levelFile) : 'embedded in src/level.js',
    conceptDoc: conceptFile ? path.relative(ROOT_DIR, conceptFile) : null
  },
  contents: {}
};

if (levelFile && fs.existsSync(levelFile)) {
  manifest.contents.levelSource = fs.readFileSync(levelFile, 'utf8');
}
if (conceptFile && fs.existsSync(conceptFile)) {
  manifest.contents.conceptDoc = fs.readFileSync(conceptFile, 'utf8');
}

const outPath = path.join(snapshotsDir, `${mapArg}-snapshot.json`);
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`✅ Map packaged successfully!`);
console.log(`   Snapshot File: .snapshots/${mapArg}-snapshot.json`);
console.log(`   Timestamp:     ${manifest.timestamp}`);
