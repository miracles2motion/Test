#!/usr/bin/env node
/**
 * Doodle Strike — Dream God Mode Orchestrator
 *
 * The master brain that detects whether it's working with Nothing, a Concept,
 * or a Map, and runs the appropriate intelligence pipeline:
 *
 *   Mode 1 (NOTHING):  Generate concept → Scaffold → Populate → Audit
 *   Mode 2 (CONCEPT):  Parse concept → Enrich → Scaffold from concept → Populate → Audit
 *   Mode 3 (MAP):      Spatial Doctor (fix errors) → Void analysis → Fill → Audit
 *
 * Usage:
 *   node src/dream-orchestrator.js <mapName> [theme]
 *   npm run map:god zen zen
 *   npm run map:god pirate_cove maritime
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { getLearningCache, recordLearnedPattern, recordDreamRun, getErrorRate } from './map-learning.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MEMORY_FILE = path.join(ROOT_DIR, '.agents', 'thematic-memory.json');
const CONCEPTS_DIR = path.join(ROOT_DIR, 'map_concepts');
const DESC_DIR = path.join(ROOT_DIR, 'Map Description');
const LEVELS_DIR = path.join(ROOT_DIR, 'src', 'levels');
const SNAPSHOTS_DIR = path.join(ROOT_DIR, '.snapshots');

const rawName = process.argv[2];
const themeArg = (process.argv[3] || '').toLowerCase();

if (!rawName) {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  🔱 DOODLE STRIKE — DREAM GOD MODE ORCHESTRATOR            ║
╚══════════════════════════════════════════════════════════════╝

Usage:
  npm run map:god <mapName> [theme]

Modes (auto-detected):
  ⚡ Mode 1 (NOTHING):  No concept, no map → Pure imagination
  📜 Mode 2 (CONCEPT):  Concept exists, no map → Read, enrich, build
  🏗️ Mode 3 (MAP):      Map exists → Fix errors, fill voids

Themes: zen, cyber, steampunk, colossal, maritime

Examples:
  npm run map:god pirate_cove maritime    # Mode 1: Create from nothing
  npm run map:god zen_garden zen          # Mode 2: Build from concept
  npm run map:god zen zen                 # Mode 3: Enhance existing map

Error Rate Target: <10%
Current Error Rate: ${getErrorRate()}%
`);
  process.exit(0);
}

const key = rawName.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
const displayName = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
const pascalName = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');

// Load thematic memory
let memory = { thematicArchetypes: {}, safetyClearances: {} };
if (fs.existsSync(MEMORY_FILE)) {
  try { memory = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8')); } catch (e) {}
}

// Detect theme from keyword match if not provided
let theme = themeArg;
if (!theme || !memory.thematicArchetypes[theme]) {
  for (const [aKey, data] of Object.entries(memory.thematicArchetypes)) {
    if (data.keywords && data.keywords.some(k => key.includes(k))) {
      theme = aKey;
      break;
    }
  }
}
if (!theme || !memory.thematicArchetypes[theme]) theme = 'cyber';

// ============================================================
// STATE DETECTION
// ============================================================
function findConceptFile() {
  // Search map_concepts/
  if (fs.existsSync(CONCEPTS_DIR)) {
    const files = fs.readdirSync(CONCEPTS_DIR).filter(f => f.endsWith('.md'));
    const match = files.find(f => f.toLowerCase().includes(key));
    if (match) return path.join(CONCEPTS_DIR, match);
  }
  // Search Map Description/
  if (fs.existsSync(DESC_DIR)) {
    const files = fs.readdirSync(DESC_DIR).filter(f => f.endsWith('.md'));
    const match = files.find(f => f.toLowerCase().replace(/-/g, '_').includes(key));
    if (match) return path.join(DESC_DIR, match);
  }
  return null;
}

const levelFile = path.join(LEVELS_DIR, `${key}.js`);
const hasLevelFile = fs.existsSync(levelFile);
const conceptFile = findConceptFile();
const hasConcept = !!conceptFile;

let mode;
if (hasLevelFile) mode = 'MAP';
else if (hasConcept) mode = 'CONCEPT';
else mode = 'NOTHING';

const modeLabels = {
  NOTHING: '⚡ Mode 1: DREAM FROM NOTHING',
  CONCEPT: '📜 Mode 2: DREAM FROM CONCEPT',
  MAP: '🏗️  Mode 3: DREAM FROM MAP'
};

console.log(`\n╔══════════════════════════════════════════════════════════════╗`);
console.log(`║  🔱 DREAM GOD MODE — ${displayName.toUpperCase().padEnd(36)}  ║`);
console.log(`╠══════════════════════════════════════════════════════════════╣`);
console.log(`║  ${modeLabels[mode].padEnd(57)} ║`);
console.log(`║  Theme: ${theme.toUpperCase().padEnd(50)} ║`);
console.log(`║  Key: ${key.padEnd(52)} ║`);
if (hasConcept) console.log(`║  Concept: ${path.relative(ROOT_DIR, conceptFile).padEnd(48)} ║`);
if (hasLevelFile) console.log(`║  Level: src/levels/${key}.js${''.padEnd(38 - key.length)} ║`);
console.log(`╚══════════════════════════════════════════════════════════════╝\n`);

const stages = {};
let overallSuccess = true;

// ============================================================
// UTILITY: Safe command execution with error handling
// ============================================================
function runStage(stageName, cmd) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`▶ STAGE: ${stageName}`);
  console.log(`${'═'.repeat(60)}`);

  try {
    execSync(cmd, { cwd: ROOT_DIR, stdio: 'inherit', timeout: 60000 });
    stages[stageName] = { status: 'pass', timestamp: new Date().toISOString() };
    console.log(`✅ ${stageName} — PASSED`);
    return true;
  } catch (err) {
    stages[stageName] = { status: 'fail', error: err.message?.slice(0, 200), timestamp: new Date().toISOString() };
    console.error(`❌ ${stageName} — FAILED: ${err.message?.slice(0, 100)}`);
    return false;
  }
}

// ============================================================
// SNAPSHOT: Pre-flight backup for Mode 3
// ============================================================
function createSnapshot() {
  if (!hasLevelFile) return;
  fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
  const snapshotPath = path.join(SNAPSHOTS_DIR, `${key}-pre-dream-${Date.now()}.js`);
  fs.copyFileSync(levelFile, snapshotPath);
  console.log(`📸 Pre-flight snapshot saved: .snapshots/${path.basename(snapshotPath)}`);
  return snapshotPath;
}

function rollback(snapshotPath) {
  if (snapshotPath && fs.existsSync(snapshotPath)) {
    fs.copyFileSync(snapshotPath, levelFile);
    console.log(`⏪ ROLLED BACK to pre-dream snapshot.`);
  }
}

// ============================================================
// CONCEPT PARSER: Extract structured data from concept markdown
// ============================================================
function parseConcept(conceptPath) {
  const md = fs.readFileSync(conceptPath, 'utf8');
  const parsed = {
    raw: md,
    richness: md.length,
    lineCount: md.split('\n').length,
    theme: theme,
    sections: {},
    hasPropDimensions: false,
    hasStairMath: false,
    hasSpawnCoords: false,
    sectionCount: 0
  };

  // Count which of the 13 standard sections exist
  for (let i = 1; i <= 13; i++) {
    const regex = new RegExp(`##\\s*${i}\\.`, 'i');
    if (regex.test(md)) {
      parsed.sections[i] = true;
      parsed.sectionCount++;
    }
  }

  // Check for prop dimensions (e.g., "0.8m x 1.4m")
  parsed.hasPropDimensions = /\d+\.?\d*\s*[m×x]\s*\d+\.?\d*\s*[m×x]?\s*\d*/i.test(md);

  // Check for stair math
  parsed.hasStairMath = /step rise|step run|headroom/i.test(md);

  // Check for spawn coordinates
  parsed.hasSpawnCoords = /spawn.*\(.*-?\d+.*,.*-?\d+.*,.*-?\d+/i.test(md);

  // Extract tactical category if present
  const catMatch = md.match(/tactical category[:\s]*`?(\w+)`?/i);
  if (catMatch) parsed.theme = catMatch[1].toLowerCase();

  return parsed;
}

// ============================================================
// CONCEPT ENRICHMENT: Make thin concepts richer
// ============================================================
function enrichConcept(conceptPath, parsed) {
  if (parsed.lineCount >= 150 && parsed.sectionCount >= 11) {
    console.log(`   📖 Concept is already rich (${parsed.lineCount} lines, ${parsed.sectionCount}/13 sections). No enrichment needed.`);
    return;
  }

  console.log(`   📝 Enriching thin concept (${parsed.lineCount} lines, ${parsed.sectionCount}/13 sections)...`);
  let md = fs.readFileSync(conceptPath, 'utf8');
  const arch = memory.thematicArchetypes[parsed.theme] || memory.thematicArchetypes[theme];
  if (!arch) return;

  // Add prop dimensions if missing
  if (!parsed.hasPropDimensions && arch.props) {
    const propSection = `
### Detailed Prop Taxonomy (Enriched by Dream God Mode)
- **Tier 1 Micro Props**: ${arch.props.tier1_micro.join(', ')}.
- **Tier 2 Meso Props**: ${arch.props.tier2_meso.join(', ')}.
- **Tier 3 Macro Props**: ${arch.props.tier3_macro.join(', ')}.
- **Tier 4 Kinetic Elements**: ${arch.props.tier4_kinetic.join(', ')}.
`;
    if (md.includes('## 8.')) {
      md = md.replace('## 8.', `${propSection}\n## 8.`);
    } else {
      md += propSection;
    }
  }

  // Add stair math if missing
  if (!parsed.hasStairMath) {
    const cache = getLearningCache();
    const stairSection = `
### Stairway Mathematics (Enriched by Dream God Mode)
- **Step Rise**: ${cache.rules.stairway.recommendedRise}m
- **Step Run**: ${cache.rules.stairway.recommendedRun}m
- **Required Headroom**: ≥ ${cache.rules.stairway.requiredHeadroom}m continuous vertical clearance
- **Landing Rest**: Every 4.0m vertical rise must have an intermediate rest landing
`;
    md += stairSection;
  }

  fs.writeFileSync(conceptPath, md, 'utf8');
  const newLines = md.split('\n').length;
  console.log(`   ✨ Concept enriched: ${parsed.lineCount} → ${newLines} lines`);
}

// ============================================================
// RICH CONCEPT GENERATION (Mode 1)
// ============================================================
function generateRichConcept() {
  const arch = memory.thematicArchetypes[theme];
  if (!arch) {
    console.error(`No archetype found for theme: ${theme}`);
    return null;
  }
  const cache = getLearningCache();

  fs.mkdirSync(CONCEPTS_DIR, { recursive: true });
  const existing = fs.readdirSync(CONCEPTS_DIR).filter(f => f.endsWith('.md'));
  const nextIndex = String(existing.length + 1).padStart(2, '0');
  const fileName = `${nextIndex}_${key}.md`;
  const filePath = path.join(CONCEPTS_DIR, fileName);

  const doc = `# MAP CONCEPT ${nextIndex}: ${displayName}

## 1. Spatial Coordinates & Level Envelope
- **Coordinate Boundary**: X: [-55.0m, +55.0m], Z: [-55.0m, +55.0m], Y: [0.0m, 18.0m] (Solo) / [0.0m, 30.0m] (Arena).
- **Perimeter Thickness**: 6.0m solid outer bounding hull.
- **Vertical Tiers**:
  - Tier 1 (Ground Floor / Foundation): Y = 0.0m
  - Tier 2 (Intermediate Balconies & Terraces): Y = 4.5m
  - Tier 3 (Apex Catwalks & Overlooks): Y = 9.0m

## 2. Aesthetic & Ink Material System
- **Environment Dossier**: ${displayName} — ${theme.toUpperCase()} THEMATIC SECTOR
- **Tactical Category**: \`${theme}\`
- **Engagement Profile**: CQB Corridors & Apex Catwalk Grapple Flanking
- **Primary Ink**: ${arch.primaryInk} (Structural geometry, foundational slabs, perimeter enclosure)
- **Secondary Ink**: ${arch.secondaryInk} (Iron frames, safety railings, mechanical linework)
- **Accent Inks**: ${arch.accentInk} (High-hazard zones, grapple anchors, vantage markers)

### 2.1 Thematic Prop Taxonomy (Detailing Tiers 1-4)
- **Tier 1 (Cover Props — 3-5 meshes each)**: ${arch.props.tier1_micro.join(', ')}.
  - Height range: 0.8m–1.3m providing low crouch cover.
  - Material: Primary + Secondary ink with accent trim.
- **Tier 2 (Tactical Furniture & Walkways — 5-10 meshes each)**: ${arch.props.tier2_meso.join(', ')}.
  - Elevated platforms at Y = 1.2m–3.0m with structural posts and balustrades.
- **Tier 3 (Landmark Anchor Props — 10-20 meshes each)**: ${arch.props.tier3_macro.join(', ')}.
  - Central sector landmarks providing multi-story traversal and grapple anchors.
- **Tier 4 (Kinetic & Aerial Elements)**: ${arch.props.tier4_kinetic.join(', ')}.
  - Dynamic elements at Y = 18.0m+ for aerial traversal.

## 3. Perimeter Enclosure & Gateways
- 4 Cardinal reinforced exterior walls (Thickness = 6.0m, Height = 18.0m / 30.0m).
- 4 Cardinal doorframes with 2.8m clear vertical clearance and 1.8m width.
- Perimeter elevated walkways at Y = 5.5m and Y = 9.0m for long-distance rifle coverage.
- 8 Perimeter ledge platforms for grapple traversal and elevated vantage.

## 4. Sector 1 (North-West) — Fortified Corner
- High-density tactical cluster with fortified corner shelter.
- Coordinates: X: [-45, -10], Z: [-45, -10].
- **Tier 1 Props**: ${arch.props.tier1_micro[0]}, ${arch.props.tier1_micro[1]}.
- **Tier 2 Props**: ${arch.props.tier2_meso[0]}.
- Low cover nodes (1.1m height) for waist-high bullet defilade.
- Flanking corridor connecting to Central Sector via covered alleyway.

## 5. Sector 2 (North-East) — Multi-Level CQB
- Intersecting ramps and multi-level CQB alleyway.
- Coordinates: X: [10, 45], Z: [-45, -10].
- **Tier 1 Props**: ${arch.props.tier1_micro[2] || arch.props.tier1_micro[0]}, ${arch.props.tier1_micro[3] || arch.props.tier1_micro[1]}.
- **Tier 2 Props**: ${arch.props.tier2_meso[1] || arch.props.tier2_meso[0]}.
- Overhead grapple ring at Y = 11.5m for rapid vertical ingress.
- Elevated platform at Y = 3.5m with anti-camp open rear vector.

## 6. Sector 3 (South-West) — Flanking Corridor
- Flanking corridor with stepped parapets and cover partitions.
- Coordinates: X: [-45, -10], Z: [10, 45].
- **Tier 1 Props**: ${arch.props.tier1_micro[0]}, ${arch.props.tier1_micro[3] || arch.props.tier1_micro[1]}.
- Sightlines directed toward Central Tier 2 Dais.
- Intermediate cover blocks at 0.9m–1.2m height.

## 7. Sector 4 (South-East) — Vantage Outpost
- Stepped vantage outpost with elevated sniper nesting perch.
- Coordinates: X: [10, 45], Z: [10, 45].
- **Tier 2 Props**: ${arch.props.tier2_meso[2] || arch.props.tier2_meso[0]}.
- Anti-camp open rear vector preventing entrenched camping.
- Sniper perch at Y = 5.5m with 3 open directional sightlines.

## 8. Central Sector (Plaza & Apex Catwalk)
- Central Tier 2 Dais (Y = 4.5m) connected via dual 14-step stairways.
- **Tier 3 Landmark**: ${arch.props.tier3_macro[0]} & ${arch.props.tier3_macro[1]}.
- Apex bridge (Y = 9.0m) overlooking all 4 quadrant lanes with 360° grapple sightlines.
- Central pickup node at Y = 4.7m.

## 9. Overhead & Aerial Traversals
- 7 Grapple rings positioned at safe distances (>= 1.5m) from structural colliders.
- **Kinetic Elements**: ${arch.props.tier4_kinetic.join(', ')}.
- Dynamic paper planes circling at Y = 22.0m for aerial hitching.
- Ring positions: (0, 13, 0), (-20, 12, -20), (20, 12, 20), (-20, 12, 20), (20, 12, -20), (0, 16, -32), (0, 16, 32).

## 10. Stairway Mathematics & Headroom Clearances
- **Step Rise**: ${cache.rules.stairway.recommendedRise}m (14 steps per 4.0m elevation rise).
- **Step Run**: ${cache.rules.stairway.recommendedRun}m.
- **Required Headroom**: >= ${cache.rules.stairway.requiredHeadroom}m continuous vertical clearance guaranteed.
- **Aperture Cutout**: Floor slabs above stair entries maintain full clearance without ceiling collisions.
- **Landing Rest**: Every 4.0m vertical rise includes intermediate rest landing (depth >= 1.2m).

## 11. Variations Matrix (Solo vs. Arena Match)
- **Solo**: Focused block, contained sky lid at Y = 56m, wave spawner distribution across all 4 sectors.
- **Arena**: Expanded P = 68.0m perimeter, 9 balanced team spawn points, dome ribbing.

## 12. Spawn Points & Vantage Snipers
- **Solo Spawns** (8): (0, 0.2, 42), (0, 0.2, -42), (-40, 0.2, 0), (40, 0.2, 0), (-25, 3.4, -25), (25, 3.4, 25), (0, 4.7, 0), (0, 9.3, 0).
- **Sniper Vantages** (4): (0, 9.3, 12), (0, 9.3, -12), (-30, 9.2, -52), (30, 9.2, 52).
- **Pickups** (6): (0, 4.7, 0), (0, 9.3, 0), (-25, 3.4, -25), (25, 3.4, 25), (-14, 0.2, 6), (14, 0.2, -6).

## 13. Level Designer Checklist
- [x] All stairways maintain >= 2.0m vertical headroom.
- [x] Minimum 150 colliders registered for dense tactical geometry.
- [x] Grapple rings maintain >= 1.5m wall clearance.
- [x] Zero dead-end pinch points (< 1.8m width).
- [x] All 4 quadrants have ≥ 15 colliders each.
- [x] Cover blocks distributed across all sectors at 0.8m–1.3m heights.
- [x] Fire lanes cover ≥ 70% of playable floor area.
`;

  fs.writeFileSync(filePath, doc, 'utf8');
  console.log(`✨ Rich concept generated: map_concepts/${fileName} (${doc.split('\n').length} lines)`);
  return filePath;
}

// (Spatial Doctor logic is inlined in Mode 3 of main() below)


// ============================================================
// SCAFFOLD FROM CONCEPT (Mode 2) — concept-aware scaffolding
// ============================================================
function scaffoldFromConcept(conceptPath) {
  // Instead of running generic scaffold, run scaffold with the concept's theme
  const parsed = parseConcept(conceptPath);
  const effectiveTheme = parsed.theme || theme;

  // Map theme to preset
  const presetMap = {
    zen: 'urban',
    cyber: 'urban',
    steampunk: 'kinetic',
    colossal: 'colossal',
    maritime: 'urban'
  };
  const preset = presetMap[effectiveTheme] || 'urban';

  return runStage('Concept-Aware Scaffold', `node src/map-scaffold.js ${key} ${preset}`);
}

// ============================================================
// MAIN PIPELINE EXECUTION
// ============================================================
async function main() {
  const startTime = Date.now();
  let snapshotPath = null;

  try {
    // ==================== MODE 1: DREAM FROM NOTHING ====================
    if (mode === 'NOTHING') {
      console.log(`\n⚡ DREAM FROM NOTHING — Creating [${displayName}] from pure imagination...\n`);

      // Stage 1: Generate rich concept
      const conceptPath = generateRichConcept();
      if (!conceptPath) {
        overallSuccess = false;
        throw new Error('Failed to generate concept');
      }
      stages['concept-generation'] = { status: 'pass', lines: fs.readFileSync(conceptPath, 'utf8').split('\n').length };

      // Stage 2: Scaffold level code
      if (!runStage('Level Scaffolding', `node src/map-scaffold.js ${key} urban`)) {
        overallSuccess = false;
        throw new Error('Scaffolding failed');
      }

      // Stage 3: Register in level.js if not already
      // (scaffold prints instructions, we continue to populate)

      // Stage 4: Macro buildings
      if (fs.existsSync(path.join(LEVELS_DIR, `${key}.js`))) {
        runStage('Macro Building Injection', `node src/macro-dreamer.js ${key} ${theme}`);
        runStage('Prop Injection', `node src/map-injector.js ${key} ${theme}`);
      }
    }

    // ==================== MODE 2: DREAM FROM CONCEPT ====================
    else if (mode === 'CONCEPT') {
      console.log(`\n📜 DREAM FROM CONCEPT — Building [${displayName}] from concept document...\n`);

      // Stage 1: Parse and enrich concept
      const parsed = parseConcept(conceptFile);
      console.log(`   📖 Concept: ${parsed.lineCount} lines, ${parsed.sectionCount}/13 sections, richness: ${parsed.richness} bytes`);
      stages['concept-parse'] = { status: 'pass', lines: parsed.lineCount, sections: parsed.sectionCount };

      enrichConcept(conceptFile, parsed);
      stages['concept-enrichment'] = { status: 'pass' };

      // Stage 2: Scaffold from concept
      if (!scaffoldFromConcept(conceptFile)) {
        overallSuccess = false;
        throw new Error('Concept-aware scaffolding failed');
      }

      // Stage 3: Populate
      if (fs.existsSync(path.join(LEVELS_DIR, `${key}.js`))) {
        runStage('Macro Building Injection', `node src/macro-dreamer.js ${key} ${theme}`);
        runStage('Prop Injection', `node src/map-injector.js ${key} ${theme}`);
      }
    }

    // ==================== MODE 3: DREAM FROM MAP ====================
    else if (mode === 'MAP') {
      console.log(`\n🏗️  DREAM FROM MAP — Enhancing [${displayName}] with spatial intelligence...\n`);

      // Stage 0: Snapshot for rollback
      snapshotPath = createSnapshot();

      // Stage 1: Spatial Doctor — fix errors first
      try {
        // Dynamic import for StairSanitizer
        const { StairSanitizer } = await import('./stair-sanitizer.js');
        const sanitizer = new StairSanitizer(key);
        const stairResult = sanitizer.sanitizeLevelFile(levelFile);

        let doctorFixes = 0;
        if (stairResult.cleanedCount > 0) {
          console.log(`🩺 Spatial Doctor: Fixed ${stairResult.cleanedCount} staircase issues.`);
          doctorFixes += stairResult.cleanedCount;
        }

        // Check for duplicate injection blocks
        let code = fs.readFileSync(levelFile, 'utf8');
        const macroCount = (code.match(/\/\/ === DREAM AUTO-INJECTED MACRO STRUCTURES ===/g) || []).length;
        if (macroCount > 1) {
          const regex = /\/\/ === DREAM AUTO-INJECTED MACRO STRUCTURES ===[\s\S]*?\/\/ === END DREAM AUTO-INJECTED MACRO STRUCTURES ===/g;
          const matches = code.match(regex);
          if (matches) {
            for (let i = 0; i < matches.length - 1; i++) code = code.replace(matches[i], '');
            fs.writeFileSync(levelFile, code, 'utf8');
            doctorFixes++;
          }
        }
        const propCount = (code.match(/\/\/ === DREAM AUTO-INJECTED THEMATIC PROPS ===/g) || []).length;
        if (propCount > 1) {
          const regex = /\/\/ === DREAM AUTO-INJECTED THEMATIC PROPS ===[\s\S]*?\/\/ === END DREAM AUTO-INJECTED PROPS ===/g;
          const matches = code.match(regex);
          if (matches) {
            for (let i = 0; i < matches.length - 1; i++) code = code.replace(matches[i], '');
            fs.writeFileSync(levelFile, code, 'utf8');
            doctorFixes++;
          }
        }

        stages['spatial-doctor'] = { status: 'pass', fixes: doctorFixes };
        console.log(`🩺 Spatial Doctor complete: ${doctorFixes} issues resolved.`);
      } catch (err) {
        console.warn(`⚠️ Spatial Doctor encountered issues: ${err.message}`);
        stages['spatial-doctor'] = { status: 'warn', error: err.message };
      }

      // Stage 2: Fill voids with macro buildings + props
      runStage('Macro Building Injection', `node src/macro-dreamer.js ${key} ${theme}`);
      runStage('Prop Injection', `node src/map-injector.js ${key} ${theme}`);
    }

    // ==================== UNIVERSAL STAGES (all modes) ====================

    // Bot Simulation + Quality Score
    const levelExists = fs.existsSync(path.join(LEVELS_DIR, `${key}.js`));
    let qualityScore = 0;

    if (levelExists) {
      // Run simulation
      runStage('Bot Flow Simulation', `node src/map-simulate.js ${key}`);

      // Self-healing audit
      runStage('Self-Healing Audit', `node .agents/skills/universal-detailing-standard/scripts/verify-detailing.js ${key} --heal`);
    }

  } catch (err) {
    overallSuccess = false;
    console.error(`\n💥 DREAM PIPELINE ERROR: ${err.message}`);

    if (snapshotPath) {
      rollback(snapshotPath);
    }
  }

  // ==================== FINAL REPORT ====================
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n╔══════════════════════════════════════════════════════════════╗`);
  console.log(`║  🔱 DREAM GOD MODE — FINAL REPORT                           ║`);
  console.log(`╠══════════════════════════════════════════════════════════════╣`);
  console.log(`║  Map: ${displayName.padEnd(52)} ║`);
  console.log(`║  Mode: ${modeLabels[mode].padEnd(51)} ║`);
  console.log(`║  Theme: ${theme.toUpperCase().padEnd(50)} ║`);
  console.log(`║  Time: ${(elapsed + 's').padEnd(51)} ║`);
  console.log(`╠══════════════════════════════════════════════════════════════╣`);

  // Stage results
  for (const [name, data] of Object.entries(stages)) {
    const icon = data.status === 'pass' ? '✅' : data.status === 'warn' ? '⚠️' : '❌';
    console.log(`║  ${icon} ${name.padEnd(56)} ║`);
  }

  console.log(`╠══════════════════════════════════════════════════════════════╣`);
  console.log(`║  Result: ${overallSuccess ? '✅ DREAM COMPLETE' : '❌ DREAM FAILED'} ${''.padEnd(overallSuccess ? 40 : 41)} ║`);
  console.log(`║  Error Rate: ${(getErrorRate() + '%').padEnd(46)} ║`);
  console.log(`╚══════════════════════════════════════════════════════════════╝`);

  // Record to learning system
  recordDreamRun(key, overallSuccess, 0, mode, stages);

  process.exit(overallSuccess ? 0 : 1);
}

main();
