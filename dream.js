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
if (prompt.includes('populate') || prompt.includes('discover') || prompt.includes('archetype')) action = 'populate';
else if (prompt.includes('detail') || prompt.includes('micro')) action = 'detail';
else if (prompt.includes('heal') || prompt.includes('improve') || prompt.includes('upgrade') || prompt.includes('refine')) action = 'heal';
else if (prompt.includes('macro') || prompt.includes('building')) action = 'macro';
else if (prompt.includes('inject') || prompt.includes('prop')) action = 'inject';
else if (prompt.includes('delete') || prompt.includes('remove')) action = 'delete';
else if (prompt.includes('inspect') || prompt.includes('audit') || prompt.includes('check')) action = 'inspect';
else if (prompt.includes('graduate') || prompt.includes('promote')) action = 'graduate';

import fs from 'fs';
import path from 'path';

// 3. Load Thematic Memory & Archetypes
let memory = { thematicArchetypes: {} };
try {
  memory = JSON.parse(fs.readFileSync(path.resolve('.agents/thematic-memory.json'), 'utf8'));
} catch (e) {}

const knownThemes = Object.keys(memory.thematicArchetypes || {});
let theme = null;
for (const t of knownThemes) {
  if (prompt.includes(t)) {
    theme = t;
    break;
  }
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
  } else if (prompt.includes('pirate cove') || prompt.includes('pirate_cove')) {
    mapName = 'pirate_cove';
  } else if (prompt.includes('ink seas') || prompt.includes('the seas') || prompt.includes('seas')) {
    mapName = 'seas';
  } else if (prompt.includes('zen garden') || prompt.includes('zen')) {
    mapName = 'zen';
  } else if (prompt.includes('clockwork tower') || prompt.includes('clockwork')) {
    mapName = 'clockwork';
  } else if (prompt.includes('blueprint castle') || prompt.includes('castle')) {
    mapName = 'castle';
  } else if (prompt.includes('giant classroom') || prompt.includes('classroom')) {
    mapName = 'classroom';
  } else if (prompt.includes('forest') || prompt.includes('woodland')) {
    mapName = 'forest';
  } else if (prompt.includes('paradise')) {
    mapName = 'paradise';
  } else if (prompt.includes('library')) {
    mapName = 'library';
  } else if (prompt.includes('space station') || prompt.includes('space_station') || prompt.includes('space')) {
    mapName = 'space_station';
  } else if (prompt.includes('cover')) {
    mapName = 'cover';
  } else {
    const candidateWords = words.filter(w => !['god', 'godmode', 'detail', 'heal', 'macro', 'inject', 'inspect', 'graduate', 'the', 'a', 'an'].includes(w));
    if (candidateWords.length > 0) {
      mapName = candidateWords[candidateWords.length - 1].replace(/[^a-z0-9_]/g, '');
    } else {
      mapName = words[words.length - 1].replace(/[^a-z0-9_]/g, '');
    }
  }
}

const ACTION_KEYWORDS = ['god', 'godmode', 'mode', 'detail', 'heal', 'macro', 'inject', 'delete', 'inspect', 'audit', 'check', 'the', 'graduate', 'promote'];
if (ACTION_KEYWORDS.includes(mapName) || mapName === 'unknown_map' || !mapName) {
  console.log(`
🔱 [DREAM NLP ROUTER] Please specify a map name!

Usage:
  npm run dream "god <mapName> [theme]"
  npm run dream "graduate <mapName>"
  npm run dream "heal <mapName>"
  npm run dream "detail <mapName>"
  npm run dream "inspect <mapName>"

Registered Maps:
  - library (colossal)
  - paradise (urban)
  - pirate_cove (maritime)
  - clockwork (steampunk)
  - zen (zen)
  - classroom (colossal)
  - district (urban)
  - cover (urban)
`);
  process.exit(0);
}

// 4.1 Dynamic Map Theme Resolution (no hardcoding: derived from learned memory or concept docs)
if (!theme && memory.thematicArchetypes) {
  for (const [tKey, arch] of Object.entries(memory.thematicArchetypes)) {
    if (tKey === mapName || (arch.keywords && arch.keywords.some(k => mapName.includes(k) || prompt.includes(k)))) {
      theme = tKey;
      break;
    }
  }
}

// 4.2 Check existing concept files if still unknown
if (!theme) {
  const conceptDirs = [path.resolve('map_concepts'), path.resolve('Map Description')];
  for (const cDir of conceptDirs) {
    if (fs.existsSync(cDir)) {
      const files = fs.readdirSync(cDir);
      const matchFile = files.find(f => f.toLowerCase().includes(mapName.toLowerCase()) && f.endsWith('.md'));
      if (matchFile) {
        try {
          const content = fs.readFileSync(path.join(cDir, matchFile), 'utf8');
          const catMatch = content.match(/tactical category[:\s]*`?(\w+)`?/i) || content.match(/thematic archetype[:\s]*`?(\w+)`?/i);
          if (catMatch) {
            theme = catMatch[1].toLowerCase().trim();
            break;
          }
        } catch {}
      }
    }
  }
}

try {
  let command = '';
  const themeParam = theme ? ` ${theme}` : '';
  if (action === 'god_mode') command = `npm run dream:god ${mapName}${themeParam}`;
  else if (action === 'detail') command = `node src/map-refiner.js ${mapName} detail`;
  else if (action === 'heal') command = `node src/map-refiner.js ${mapName} heal`;
  else if (action === 'inspect') command = `node tools/dream_inspect_cli.js ${mapName}`;
  else if (action === 'macro') command = `npm run dream:macro ${mapName} ${theme}`;
  else if (action === 'inject') command = `npm run dream:inject ${mapName} ${theme}`;
  else if (action === 'delete') command = `node src/map-deleter.js ${mapName}`;
  else if (action === 'graduate') command = `node graduate-map.js ${mapName}`;
  else if (action === 'populate') command = `node src/thematic-populator.js ${mapName}`;

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
