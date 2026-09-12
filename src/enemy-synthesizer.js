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
  
  const keyMatch = new RegExp(`key\\s*:\\s*['"]${mapKey}['"]`, 'i').exec(levelJs);
  if (!keyMatch) {
    console.error(`   ❌ Could not find level definition for '${mapKey}' in level.js`);
    return false;
  }
  
  // Format the enemies object back to JS code
  const entriesStr = Object.entries(customEnemies).map(([k, v]) => {
    const jsonStr = JSON.stringify(v, null, 2).replace(/"([^"]+)":/g, '$1:');
    return `      ${k}: ${jsonStr.split('\n').join('\n      ')}`;
  }).join(',\n');
  const enemiesCode = `\n    customEnemies: {\n${entriesStr}\n    }`;

  const keyPos = keyMatch.index;
  // Look ahead from keyPos for customEnemies before the next map entry "key:"
  const nextKeyPos = levelJs.indexOf('key:', keyPos + keyMatch[0].length);
  const searchSlice = nextKeyPos !== -1 ? levelJs.slice(keyPos, nextKeyPos) : levelJs.slice(keyPos, keyPos + 4000);
  
  const ceIndexInSlice = searchSlice.indexOf('customEnemies');
  if (ceIndexInSlice !== -1) {
    // customEnemies already exists! Find its outer curly braces via bracket counting
    const ceGlobalPos = keyPos + ceIndexInSlice;
    const braceStart = levelJs.indexOf('{', ceGlobalPos);
    let depth = 0;
    let braceEnd = -1;
    for (let i = braceStart; i < levelJs.length; i++) {
      if (levelJs[i] === '{') depth++;
      else if (levelJs[i] === '}') {
        depth--;
        if (depth === 0) {
          braceEnd = i;
          break;
        }
      }
    }
    if (braceEnd !== -1) {
      // Check if followed by a comma
      let replaceEnd = braceEnd + 1;
      let trailing = '';
      if (levelJs[replaceEnd] === ',') {
        replaceEnd++;
        trailing = ',';
      }
      levelJs = levelJs.slice(0, ceGlobalPos) + `customEnemies: {\n${entriesStr}\n    }${trailing}` + levelJs.slice(replaceEnd);
    }
  } else {
    // Insert customEnemies right after key: '...'
    let insertPos = keyPos + keyMatch[0].length;
    let leadingComma = '';
    if (levelJs[insertPos] === ',') {
      insertPos++;
      leadingComma = ',';
    } else {
      leadingComma = ',';
    }
    levelJs = levelJs.slice(0, insertPos) + `${leadingComma}${enemiesCode},` + levelJs.slice(insertPos);
  }

  // Sanitize any potential duplicate commas
  levelJs = levelJs.replace(/,\s*,/g, ',');

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
