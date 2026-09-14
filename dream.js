#!/usr/bin/env node

/**
 * Dream Master NLP Router (Zero-Dependency Version)
 */
import { execSync } from 'child_process';
import process from 'process';
import { listPendingTickets, resolveConsultationTicket } from './src/dream-consultant.js';

let prompt = process.argv.slice(2).join(' ').toLowerCase().trim();
if (!prompt || prompt === '?' || prompt === 'help' || prompt === '--help' || prompt === '-h' || prompt.includes('what can dream do') || prompt.includes('dream help') || prompt.includes('capabilities')) {
  execSync('npm run dream:help', { stdio: 'inherit' });
  process.exit(0);
}

if (prompt.startsWith('teach') || prompt.startsWith('learn') || prompt.startsWith('consult') || prompt.startsWith('pending') || prompt.startsWith('resume')) {
  let subPrompt = prompt;
  if (prompt.startsWith('teach ') || prompt.startsWith('learn ') || prompt.startsWith('consult ')) {
    subPrompt = prompt.split(' ').slice(1).join(' ');
  }
  const parts = subPrompt.split(' ');
  
  if (subPrompt === 'pending' || subPrompt === 'teach' || subPrompt === 'consult' || subPrompt === 'list' || subPrompt === '') {
    execSync('node src/dream-consultant.js list', { stdio: 'inherit' });
    process.exit(0);
  } else {
    execSync(`node src/dream-consultant.js ${parts[0]} ${parts.slice(1).join(' ')}`, { stdio: 'inherit' });
    process.exit(0);
  }
}

console.log(`\n🧠 Dream is analyzing your request locally: "${prompt}"...\n`);

// 1. Detect Multiplier (e.g. 2x, 3x)
let multiplier = 1;
const timesMatch = prompt.match(/(\d+)x/);
if (timesMatch) {
  multiplier = parseInt(timesMatch[1], 10);
  if (multiplier < 1) multiplier = 1;
  if (multiplier > 10) multiplier = 10;
  prompt = prompt.replace(timesMatch[0], '').trim();
}

// 2. Detect Action
let action = 'god_mode';
if (prompt.includes('detail') || prompt.includes('micro')) action = 'detail';
else if (prompt.includes('heal') || prompt.includes('improve') || prompt.includes('upgrade') || prompt.includes('refine')) action = 'heal';
else if (prompt.includes('macro') || prompt.includes('building')) action = 'macro';
else if (prompt.includes('inject') || prompt.includes('prop')) action = 'inject';
else if (prompt.includes('delete') || prompt.includes('remove')) action = 'delete';
else if (prompt.includes('inspect') || prompt.includes('audit') || prompt.includes('check')) action = 'inspect';

// 3. Detect Theme
const themes = ["urban", "cyber", "steampunk", "colossal", "maritime", "zen", "anomalous"];
let theme = 'urban';
for (const t of themes) {
  if (prompt.includes(t)) {
    theme = t;
    break;
  }
}
if (theme === 'urban') {
  if (prompt.includes('pirate') || prompt.includes('sea') || prompt.includes('ship')) theme = 'maritime';
  if (prompt.includes('shrine') || prompt.includes('garden') || prompt.includes('temple')) theme = 'zen';
  if (prompt.includes('factory') || prompt.includes('clock') || prompt.includes('gear')) theme = 'steampunk';
  if (prompt.includes('neon') || prompt.includes('tech') || prompt.includes('hacker')) theme = 'cyber';
}

// 4. Detect Map Name
let mapName = 'unknown_map';
const calledMatch = prompt.match(/called\s+([a-z0-9_ -]+)/);
if (calledMatch) {
  mapName = calledMatch[1].trim().replace(/\s+/g, '_');
} else {
  const words = prompt.split(' ');
  const mapIndex = words.indexOf('map');
  
  if (mapIndex !== -1 && mapIndex + 1 < words.length) {
    mapName = words[mapIndex + 1].replace(/[^a-z0-9_]/g, '');
  } else {
    // Check if pirate cove is in prompt
    if (prompt.includes('pirate cove')) {
      mapName = 'pirate_cove';
    } else {
      mapName = words[words.length - 1].replace(/[^a-z0-9_]/g, '');
    }
  }
}

const ACTION_KEYWORDS = ['god', 'godmode', 'mode', 'detail', 'heal', 'macro', 'inject', 'delete', 'inspect', 'audit', 'check', 'the'];
if (ACTION_KEYWORDS.includes(mapName) || mapName === 'unknown_map' || !mapName) {
  console.log(`
🔱 [DREAM NLP ROUTER] Please specify a map name!

Usage:
  npm run dream "god <mapName> [theme]"
  npm run dream "heal <mapName>"
  npm run dream "detail <mapName>"
  npm run dream "inspect <mapName>"

Registered Maps:
  - library (colossal)
  - pirate_cove (maritime)
  - clockwork (steampunk)
  - zen (zen)
  - classroom (colossal)
  - district (urban)
  - cover (urban)
`);
  process.exit(0);
}

// 4.1 Authoritative Map-to-Theme Lookup (prevents theme mismatches)
const MAP_THEMES = {
  library: 'colossal',
  classroom: 'colossal',
  desk: 'colossal',
  tomes: 'colossal',
  pirate_cove: 'maritime',
  seas: 'maritime',
  clockwork: 'steampunk',
  tower: 'steampunk',
  zen: 'zen',
  garden: 'zen',
  district: 'urban',
  castle: 'urban',
  mexico: 'urban'
};

if (MAP_THEMES[mapName] && !themes.some(t => prompt.includes(t))) {
  theme = MAP_THEMES[mapName];
}

try {
  let command = '';
  if (action === 'god_mode') command = `npm run dream:god ${mapName} ${theme}`;
  else if (action === 'detail') command = `node src/map-refiner.js ${mapName} detail`;
  else if (action === 'heal') command = `node src/map-refiner.js ${mapName} heal`;
  else if (action === 'inspect') command = `node tools/dream_inspect_cli.js ${mapName}`;
  else if (action === 'macro') command = `npm run dream:macro ${mapName} ${theme}`;
  else if (action === 'inject') command = `npm run dream:inject ${mapName} ${theme}`;
  else if (action === 'delete') command = `node src/map-deleter.js ${mapName}`;

  console.log(`✨ Dream understood your intent! Routing to:`);
  console.log(`   > ${command} (Running ${multiplier}x times)\n`);
  
  for (let i = 0; i < multiplier; i++) {
    if (multiplier > 1) {
      console.log(`============================================================`);
      console.log(`🚀 DREAM CYCLE ${i + 1} OF ${multiplier}`);
      console.log(`============================================================\n`);
    }
    execSync(command, { stdio: 'inherit' });
  }
} catch (err) {
  console.error(`\n❌ Dream failed to execute: ${err.message}`);
  process.exit(1);
}
