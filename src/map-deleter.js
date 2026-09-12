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

  // Remove from LEVELS array (assumes no nested objects within the level config)
  const objRegex = new RegExp(`[\\s\\r\\n]*,?\\s*\\{[^{}]*?key:\\s*['"]${mapName}['"][^{}]*?\\},?`, 'g');
  levelCode = levelCode.replace(objRegex, '');

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
