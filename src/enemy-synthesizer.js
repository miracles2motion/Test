#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const LEVELS_FILE = path.join(ROOT_DIR, 'src', 'level.js');

export function extractEnemiesFromConcept(conceptContent) {
  // Find Section 14
  const bestiaryMatch = conceptContent.match(/## 14\. Map-Specific Bestiary[\s\S]*?(?=## 15|$)/i);
  if (!bestiaryMatch) return null;

  const section = bestiaryMatch[0];
  const enemies = {};

  // Extract each enemy definition: - **Enemy 1: Ninja**: `{ role: ... }`
  const enemyRegex = /\*\*(?:Enemy\s*\d*:\s*)?([^*]+)\*\*(?:[^`{]*)(`?\{[^`]*\}`?)/gi;
  
  let match;
  while ((match = enemyRegex.exec(section)) !== null) {
    let name = match[1].trim();
    const key = name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    let codeStr = match[2].trim();
    
    // Strip backticks if present
    if (codeStr.startsWith('`') && codeStr.endsWith('`')) {
      codeStr = codeStr.substring(1, codeStr.length - 1).trim();
    }
    
    try {
      // Validate that it's a valid JS object syntax
      // Use Function instead of eval or JSON.parse since the LLM might write `{ role: 'melee' }` without quotes on keys
      const obj = new Function('return ' + codeStr)();
      
      // Inject required aesthetic/gameplay properties if missing
      obj.name = name.toUpperCase();
      if (!obj.score) obj.score = 150;
      if (!obj.scale) obj.scale = 1.0;
      
      enemies[key] = obj;
      console.log(`   👾 Extracted Custom Enemy: ${name} (${key})`);
    } catch (e) {
      console.error(`   ⚠️ Failed to parse enemy JSON for ${name}: ${e.message}`);
    }
  }

  return Object.keys(enemies).length > 0 ? enemies : null;
}

export function injectEnemiesIntoLevel(mapKey, customEnemies) {
  let levelJs = fs.readFileSync(LEVELS_FILE, 'utf8');
  
  // We will just inject it right after the key property to avoid complex brace parsing
  const keyRegex = new RegExp(`key\\s*:\\s*'${mapKey}'`, 'i');
  if (!keyRegex.test(levelJs)) {
    console.error(`   ❌ Could not find level definition for '${mapKey}' in level.js`);
    return false;
  }
  
  // Format the enemies object back to JS code
  const enemiesCode = `\n    customEnemies: {\n` + Object.entries(customEnemies).map(([k, v]) => {
    const jsonStr = JSON.stringify(v, null, 2).replace(/"([^"]+)":/g, '$1:');
    return `      ${k}: ${jsonStr.split('\\n').join('\\n      ')}`;
  }).join(',\n') + `\n    },`;

  // Check if it already exists, if so we don't handle overwrite easily with this method, 
  // but we can just do a basic replace for now or assume it's fresh for each run
  
  levelJs = levelJs.replace(new RegExp(`(key\\s*:\\s*'${mapKey}')`, 'i'), `$1,${enemiesCode}`);
  fs.writeFileSync(LEVELS_FILE, levelJs, 'utf8');
  console.log(`   💉 Injected ${Object.keys(customEnemies).length} custom enemies into level.js for map '${mapKey}'`);
  return true;
}

// Allow running standalone
if (process.argv[1] === __filename) {
  const mapKey = process.argv[2];
  if (!mapKey) {
    console.log('Usage: node src/enemy-synthesizer.js <mapKey>');
    process.exit(1);
  }
  
  const conceptPath = path.join(ROOT_DIR, 'map_concepts', fs.readdirSync(path.join(ROOT_DIR, 'map_concepts')).find(f => f.includes(mapKey)));
  if (!conceptPath) {
    console.error(`Concept not found for ${mapKey}`);
    process.exit(1);
  }
  
  const content = fs.readFileSync(conceptPath, 'utf8');
  const enemies = extractEnemiesFromConcept(content);
  
  if (enemies) {
    injectEnemiesIntoLevel(mapKey, enemies);
  } else {
    console.log('No custom enemies found in concept.');
  }
}
