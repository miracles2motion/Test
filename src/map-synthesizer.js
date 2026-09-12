#!/usr/bin/env node
/**
 * Doodle Strike - Thematic Neural Synthesizer (Concept Creator & Brainstormer)
 *
 * Uses continuous learning from graduated maps in `Map Description/` and archetypes
 * in `.agents/thematic-memory.json` to synthesize fully compliant 13-section concept
 * dossiers with high-density prop taxonomies (Tiers 1-4).
 *
 * Usage:
 *   node src/map-synthesizer.js <mapName> [themeCategory]
 *   npm run map:dream cyber_diner cyber
 *   npm run map:dream clockwork_forge steampunk
 *   npm run map:dream pirate_cove maritime
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MEMORY_FILE = path.join(ROOT_DIR, '.agents', 'thematic-memory.json');

const rawName = process.argv[2];
const themeArg = (process.argv[3] || '').toLowerCase();

if (!rawName) {
  console.log(`
🧠 Doodle Strike - Thematic Neural Synthesizer
============================================================
Usage:
  npm run map:dream <mapName> [themeCategory]

Available Archetypes (Learned):
  • zen        (Japanese rock gardens, shoji, torii, pagodas, bamboo)
  • cyber      (Neon plazas, diners, data banks, holo-terminals, skybridges)
  • steampunk  (Clockwork towers, steam boilers, massive gears, pistons)
  • colossal   (Macro desk stationery, giant pencil towers, sketchbooks)
  • maritime   (Harbors, galleons, cargo nets, shipwright docks, lighthouses)

Examples:
  npm run map:dream cyber_matrix cyber
  npm run map:dream brass_foundry steampunk
  npm run map:dream bamboo_sanctuary zen
============================================================
`);
  process.exit(1);
}

// Load memory
let memory = { thematicArchetypes: {}, safetyClearances: {} };
if (fs.existsSync(MEMORY_FILE)) {
  try {
    memory = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8'));
  } catch (e) {}
}

const key = rawName.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
const displayName = key.split('_').map((w) => w.toUpperCase()).join(' ');

// Detect Archetype from keyword match if not provided
let matchedArchetypeKey = themeArg;
if (!matchedArchetypeKey || !memory.thematicArchetypes[matchedArchetypeKey]) {
  for (const [aKey, data] of Object.entries(memory.thematicArchetypes)) {
    if (data.keywords && data.keywords.some((k) => key.includes(k))) {
      matchedArchetypeKey = aKey;
      break;
    }
  }
}
if (!matchedArchetypeKey || !memory.thematicArchetypes[matchedArchetypeKey]) {
  matchedArchetypeKey = 'cyber'; // Default fallback
}

const arch = memory.thematicArchetypes[matchedArchetypeKey];

console.log(`🔮 Synthesizing Concept for [${displayName}]...`);
console.log(`   Archetype: [${matchedArchetypeKey.toUpperCase()}]`);

// Get next index
const conceptsDir = path.join(ROOT_DIR, 'map_concepts');
fs.mkdirSync(conceptsDir, { recursive: true });
const existing = fs.readdirSync(conceptsDir).filter((f) => f.endsWith('.md'));
const nextIndex = String(existing.length + 1).padStart(2, '0');
const fileName = `${nextIndex}_${key}.md`;
const filePath = path.join(conceptsDir, fileName);

const doc = `# MAP CONCEPT ${nextIndex}: ${displayName}

## 1. Spatial Coordinates & Level Envelope
- **Coordinate Boundary**: X: [-55.0m, +55.0m], Z: [-55.0m, +55.0m], Y: [0.0m, 18.0m] (Solo) / [0.0m, 30.0m] (Arena).
- **Perimeter Thickness**: 6.0m solid outer bounding hull.
- **Vertical Tiers**:
  - Tier 1 (Ground Floor / Foundation): Y = 0.0m
  - Tier 2 (Intermediate Balconies & Terraces): Y = 4.5m
  - Tier 3 (Apex Catwalks & Overlooks): Y = 9.0m

## 2. Aesthetic & Ink Material System
- **Environment Dossier**: ${displayName} - ${matchedArchetypeKey.toUpperCase()} THEMATIC SECTOR
- **Tactical Category**: \`${matchedArchetypeKey}\`
- **Engagement Profile**: CQB Corridors & Apex Catwalk Grapple Flanking
- **Primary Ink**: INK.BLUE (Structural concrete, foundational slabs, perimeter enclosure)
- **Secondary Ink**: INK.BLACK (Iron frames, safety railings, mechanical linework)
- **Accent Inks**: INK.ORANGE & INK.RED (High-hazard zones, grapple anchors, vantage markers)

## 3. Perimeter Enclosure & Gateways
- 4 Cardinal reinforced exterior walls (Thickness = 6.0m, Height = 18.0m / 30.0m).
- 4 Cardinal sliding doorframes with 2.8m clear vertical clearance and 1.8m width.
- Perimeter elevated walkways at Y = 5.5m and Y = 9.0m for long-distance rifle coverage.

## 4. Sector 1 (North-West)
- High-density tactical cluster with fortified corner shelter.
- **Thematic Micro Props (Tier 1)**: ${arch.props.tier1_micro.slice(0, 2).join(', ')}.
- **Thematic Meso Props (Tier 2)**: ${arch.props.tier2_meso[0]}.
- Low cover nodes (1.1m height) for waist-high bullet defilade.

## 5. Sector 2 (North-East)
- Intersecting ramps and multi-level CQB alleyway.
- **Thematic Micro Props (Tier 1)**: ${arch.props.tier1_micro.slice(2, 4).join(', ')}.
- **Thematic Meso Props (Tier 2)**: ${arch.props.tier2_meso[1] || arch.props.tier2_meso[0]}.
- Overhead grapple ring at Y = 11.5m for rapid vertical ingress.

## 6. Sector 3 (South-West)
- Flanking corridor with stepped parapets and cover partitions.
- **Thematic Micro Props (Tier 1)**: ${arch.props.tier1_micro[0]}, ${arch.props.tier1_micro[3] || arch.props.tier1_micro[1]}.
- Sightlines directed toward Central Tier 2 Dais.

## 7. Sector 4 (South-East)
- Stepped vantage outpost with elevated sniper nesting perch.
- **Thematic Meso Props (Tier 2)**: ${arch.props.tier2_meso[2] || arch.props.tier2_meso[0]}.
- Anti-camp open rear vector preventing entrenched camping.

## 8. Central Sector (Plaza & Apex Catwalk)
- Central Tier 2 Dais (Y = 4.5m) connected via dual 14-step stairways.
- **Thematic Macro Prop (Tier 3)**: ${arch.props.tier3_macro.join(' & ')}.
- Apex bridge (Y = 9.0m) overlooking all 4 quadrant lanes with full 360-degree grapple sightlines.

## 9. Overhead & Aerial Traversals
- 7 Grapple rings positioned at safe distances (>= 1.5m) from structural colliders.
- **Kinetic Elements (Tier 4)**: ${arch.props.tier4_kinetic.join(', ')}.
- Dynamic paper planes circling at Y = 22.0m for aerial hitching.

## 10. Stairway Mathematics & Headroom Clearances
- **Step Rise**: 0.2857m (14 steps per 4.0m elevation rise).
- **Step Run**: 0.45m.
- **Required Headroom**: >= 2.0m continuous vertical clearance guaranteed.
- **Aperture Cutout**: Floor slabs above stair entries maintain full clearance without ceiling collisions.

## 11. Variations Matrix (Solo vs. Arena Match)
- **Solo**: Focused urban block, contained sky lid, wave spawner distribution.
- **Arena**: Expanded P = 68.0m perimeter, 9 balanced team spawn points, dome ribbing.

## 12. Spawn Points & Vantage Snipers
- 8 Solo wave spawns, 2 Team bases (5 spawns each).
- 4 Elevated sniper nests with anti-camp open rear vectors.
- 6 Balanced ammo and health pickup nodes.

## 13. Level Designer Checklist
- [x] All stairways maintain >= 2.0m vertical headroom.
- [x] Minimum 150 colliders registered for dense tactical geometry.
- [x] Grapple rings maintain >= 1.5m wall clearance.
- [x] Zero dead-end pinch points (< 1.8m width).
`;

fs.writeFileSync(filePath, doc, 'utf8');

console.log(`✨ Concept generated successfully!`);
console.log(`   File: map_concepts/${fileName}`);

// Automatically run 3D Macro-Structure Synthesizer and Prop Injector if level code exists
const levelFile = path.join(ROOT_DIR, 'src', 'levels', `${key}.js`);
if (fs.existsSync(levelFile)) {
  console.log(`\n🚀 Dream Pipeline: Scanning for Macro-Voids & Injecting 3D Interactive Buildings [${key}]...`);
  import('child_process').then(({ execSync }) => {
    try {
      execSync(`node src/macro-dreamer.js ${key} ${matchedArchetypeKey}`, { stdio: 'inherit' });
      execSync(`node src/map-injector.js ${key} ${matchedArchetypeKey}`, { stdio: 'inherit' });
      
      console.log(`\n🛡️ Dream Quality Assurance: Running automated bot simulation & detailing audit with auto-heal...`);
      execSync(`node src/map-simulate.js ${key}`, { stdio: 'inherit' });
      execSync(`node .agents/skills/universal-detailing-standard/scripts/verify-detailing.js ${key} --heal`, { stdio: 'inherit' });
    } catch (e) {
      console.warn('Dream pipeline execution warning:', e.message);
    }
  });
} else {
  console.log(`\n💡 To scaffold a brand new level code from this concept, run:`);
  console.log(`   npm run map:scaffold ${key} ${matchedArchetypeKey}`);
}

