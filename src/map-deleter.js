import fs from 'fs';
import path from 'path';

const mapName = process.argv[2];
if (!mapName) {
  console.error("❌ No map name provided for deletion.");
  process.exit(1);
}

const ROOT_DIR = process.cwd();
const levelJsPath = path.join(ROOT_DIR, 'src', 'levels', `${mapName}.js`);
const mainLevelFile = path.join(ROOT_DIR, 'src', 'level.js');

console.log(`\n🗑️ Dream is purging the map: ${mapName}...`);

let success = true;

// 1. Delete level file
if (fs.existsSync(levelJsPath)) {
  fs.unlinkSync(levelJsPath);
  console.log(`   ✓ Deleted ${levelJsPath}`);
} else {
  console.log(`   - Map file ${levelJsPath} not found, skipping.`);
}

// 2. Remove from src/level.js
if (fs.existsSync(mainLevelFile)) {
  let levelCode = fs.readFileSync(mainLevelFile, 'utf8');

  // Remove import statement
  const importRegex = new RegExp(`import\\s+\\{\\s*\\w+\\s*\\}\\s+from\\s+['"]\\.\\/levels\\/${mapName}\\.js['"];?\\r?\\n?`, 'g');
  levelCode = levelCode.replace(importRegex, '');

  // Remove from MAP_BUILDERS object (handles trailing commas nicely by matching up to the key)
  const builderRegex = new RegExp(`[\\s\\r\\n]+${mapName}:\\s*\\w+,?`, 'g');
  levelCode = levelCode.replace(builderRegex, '');

  // Remove from LEVELS array (with robust balanced brace matching for nested customEnemies)
  const keyPattern = new RegExp(`key:\\s*['"]${mapName}['"]`);
  const match = levelCode.match(keyPattern);
  if (match) {
    const keyPos = match.index;
    // Find the opening brace '{' before this keyPos
    let startPos = -1;
    let braceDepth = 0;
    for (let i = keyPos; i >= 0; i--) {
      if (levelCode[i] === '}') braceDepth++;
      else if (levelCode[i] === '{') {
        if (braceDepth === 0) {
          startPos = i;
          break;
        } else {
          braceDepth--;
        }
      }
    }

    if (startPos !== -1) {
      // Find matching closing brace
      let endPos = -1;
      let depth = 0;
      for (let i = startPos; i < levelCode.length; i++) {
        if (levelCode[i] === '{') depth++;
        else if (levelCode[i] === '}') {
          depth--;
          if (depth === 0) {
            endPos = i + 1;
            break;
          }
        }
      }

      if (endPos !== -1) {
        // Also consume trailing comma and whitespace
        while (endPos < levelCode.length && (levelCode[endPos] === ',' || levelCode[endPos] === ' ' || levelCode[endPos] === '\t')) {
          endPos++;
        }
        // If there was a preceding comma and no trailing comma, consume preceding comma
        while (startPos > 0 && (levelCode[startPos - 1] === ' ' || levelCode[startPos - 1] === '\t')) {
          startPos--;
        }
        if (startPos > 0 && levelCode[startPos - 1] === ',') {
          startPos--;
        }

        levelCode = levelCode.slice(0, startPos) + levelCode.slice(endPos);
      }
    }
  }

  fs.writeFileSync(mainLevelFile, levelCode);
  console.log(`   ✓ Removed ${mapName} from src/level.js`);
}

// 3. Delete snapshots
const snapshotsDir = path.join(ROOT_DIR, '.snapshots');
if (fs.existsSync(snapshotsDir)) {
  const files = fs.readdirSync(snapshotsDir);
  files.forEach(f => {
    if (f.startsWith(`${mapName}-`) || f.startsWith(`${mapName}_`)) {
      fs.unlinkSync(path.join(snapshotsDir, f));
      console.log(`   ✓ Deleted snapshot ${f}`);
    }
  });
}

// 4. Delete concepts
const conceptsDir = path.join(ROOT_DIR, 'map_concepts');
if (fs.existsSync(conceptsDir)) {
  const files = fs.readdirSync(conceptsDir);
  files.forEach(f => {
    // Exact match: 10_cove.md, not 10_pirate_cove.md
    if (f.match(new RegExp(`^\\d+_${mapName}\\.md$`)) || f === `${mapName}.md`) {
      fs.unlinkSync(path.join(conceptsDir, f));
      console.log(`   ✓ Deleted concept ${f}`);
    }
  });
}

console.log(`\n✅ ${mapName} has been completely removed from the Dream Engine.\n`);
process.exit(0);
