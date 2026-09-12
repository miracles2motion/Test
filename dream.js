#!/usr/bin/env node
/**
 * Dream Master NLP Router (Zero-Dependency Version)
 * Uses procedural keyword analysis to route commands locally without an API key!
 */

import { execSync } from 'child_process';
import process from 'process';

const prompt = process.argv.slice(2).join(' ').toLowerCase();

if (!prompt) {
  console.log(`
🌌 Dream NLP Router
============================================================
Talk to Dream in natural language.
Usage:
  npm run dream "build me a cyber map called neon district"
  npm run dream "heal my pirate cove map"
  npm run dream "inject macro structures into zen"
============================================================
`);
  process.exit(0);
}

console.log(`\n🧠 Dream is analyzing your request locally: "${prompt}"...\n`);

// 1. Detect Action
let action = 'god_mode'; // default
if (prompt.includes('heal') || prompt.includes('improve')) action = 'refine_heal';
else if (prompt.includes('upgrade') || prompt.includes('refine')) action = 'refine_upgrade';
else if (prompt.includes('macro') || prompt.includes('building')) action = 'macro';
else if (prompt.includes('inject') || prompt.includes('prop')) action = 'inject';

// 2. Detect Theme
const themes = ["urban", "cyber", "steampunk", "colossal", "maritime", "zen", "anomalous"];
let theme = 'urban'; // fallback
for (const t of themes) {
  if (prompt.includes(t)) {
    theme = t;
    break;
  }
}

// Infer theme from keywords if not explicitly stated
if (theme === 'urban') {
  if (prompt.includes('pirate') || prompt.includes('sea') || prompt.includes('ship')) theme = 'maritime';
  if (prompt.includes('shrine') || prompt.includes('garden') || prompt.includes('temple')) theme = 'zen';
  if (prompt.includes('factory') || prompt.includes('clock') || prompt.includes('gear')) theme = 'steampunk';
  if (prompt.includes('neon') || prompt.includes('tech') || prompt.includes('hacker')) theme = 'cyber';
}

// 3. Detect Map Name
// Looks for "called [name]" or "map [name]" or assumes the last word.
let mapName = 'unknown_map';
const calledMatch = prompt.match(/called\s+([a-z0-9_ -]+)/);
if (calledMatch) {
  mapName = calledMatch[1].trim().replace(/\s+/g, '_');
} else {
  // Try to find the word after "map"
  const words = prompt.split(' ');
  const mapIndex = words.indexOf('map');
  if (mapIndex !== -1 && mapIndex + 1 < words.length) {
    mapName = words[mapIndex + 1].replace(/[^a-z0-9_]/g, '');
  } else {
    // Just use the last word
    mapName = words[words.length - 1].replace(/[^a-z0-9_]/g, '');
  }
}

try {
  let command = '';
  
  if (action === 'god_mode') command = `npm run dream:god ${mapName} ${theme}`;
  else if (action === 'refine_heal') command = `node src/map-refiner.js ${mapName} ${theme} heal`;
  else if (action === 'refine_upgrade') command = `node src/map-refiner.js ${mapName} ${theme} upgrade`;
  else if (action === 'macro') command = `npm run dream:macro ${mapName} ${theme}`;
  else if (action === 'inject') command = `npm run dream:inject ${mapName} ${theme}`;

  console.log(`✨ Dream understood your intent! Routing to:`);
  console.log(`   > ${command}\n`);

  execSync(command, { stdio: 'inherit' });

} catch (err) {
  console.error(`\n❌ Dream failed to execute: ${err.message}`);
  process.exit(1);
}
