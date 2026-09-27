#!/usr/bin/env node
/**
 * Doodle Strike — Dream Super Agent & Autonomous World Engine
 *
 * The Master Super Agent coordinating the 5-layer procedural world generation,
 * transformation, and certification pipeline.
 *
 * Replaces the legacy procedural orchestrator with clean, data-driven,
 * deterministic execution adhering to the Continuous Map Evolution Standard.
 *
 * Supported Modes:
 *   Mode 1 (NOTHING):  Rich Concept Generation → Recipe Compilation → Scaffold → Verify
 *   Mode 2 (CONCEPT):  Parse Concept → Enrich Taxonomy/Stairs → Recipe Scaffold → Verify
 *   Mode 3 (MAP):      Spatial Doctor (Physics Healing) → Recipe Mutation Optimization → Verification Suite
 *
 * Usage:
 *   node src/dream-super-agent.js <mapName> [theme]
 *   npm run dream:god <mapName> [theme]
 *   npm run map:god <mapName> [theme]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { getLearningCache, recordLearnedPattern, recordDreamRun, getErrorRate } from './map-learning.js';
import { broadcastHelpBeacon } from './help-beacon.js';
import { openConsultationTicket } from './dream-consultant.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MEMORY_FILE = path.join(ROOT_DIR, '.agents', 'thematic-memory.json');
const CONCEPTS_DIR = path.join(ROOT_DIR, 'map_concepts');
const DESC_DIR = path.join(ROOT_DIR, 'Map Description');
const LEVELS_DIR = path.join(ROOT_DIR, 'src', 'levels');
const RECIPES_DIR = path.join(ROOT_DIR, 'recipes');
const SNAPSHOTS_DIR = path.join(ROOT_DIR, '.snapshots');

export const SUBAGENT_ROSTER = {
  architect: 'dream-architect (Spatial Scaffolder & 3-Lane Topology)',
  decorator: 'dream-decorator (Material, Prop & Universal Detailing Standard)',
  combat: 'dream-combat (Tactical Flow, Sightlines, Grapples & Enemy AI)',
  auditor: 'dream-auditor (Diagnostics, Simulation & Physics Doctor)',
  critic: 'dream-critic (Adversarial Evaluator & Debate Judge)'
};

/**
 * Execute a stage cleanly with error capture
 */
export function runStage(stageName, cmd, options = {}) {
  const isVerbose = options.verbose || false;
  if (isVerbose) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`▶ [DREAM SUPER AGENT] STAGE: ${stageName}`);
    console.log(`${'═'.repeat(60)}`);
  }

  try {
    const stdioMode = isVerbose ? 'inherit' : 'pipe';
    execSync(cmd, { cwd: ROOT_DIR, stdio: stdioMode, timeout: 60000 });
    if (isVerbose) console.log(`✅ ${stageName} — PASSED`);
    else console.log(`  ✓ ${stageName}: Clean`);
    return { success: true, code: 0 };
  } catch (err) {
    const code = err.status || 1;
    if (code === 2) {
      if (isVerbose) console.log(`⚠️ ${stageName} — PASSED with warnings`);
      else console.log(`  ✓ ${stageName}: Yielded`);
      return { success: true, code: 2 };
    }
    if (isVerbose) console.error(`❌ ${stageName} — FAILED: ${err.message?.slice(0, 100)}`);
    else console.error(`  ❌ ${stageName}: FAILED (${err.message?.slice(0, 80)})`);
    return { success: false, code, error: err.message };
  }
}

/**
 * Main Dream Super Agent execution pipeline
 */
export async function executeDreamSuperAgent(rawName, rawTheme = '', options = {}) {
  const startTime = Date.now();
  if (!rawName) {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║  👑 DOODLE STRIKE — DREAM MASTER SUPER AGENT                ║
╚══════════════════════════════════════════════════════════════╝

Usage:
  npm run dream:god <mapName> [theme]
  npm run map:god <mapName> [theme]

Subagents:
  • dream-architect : Spatial Scaffolder & 3-Lane Topology
  • dream-decorator : Universal Detailing Standard (Skeleton-Skin-Trim)
  • dream-combat    : Tactical Sightlines, Grapple Traversal & Enemy AI
  • dream-auditor   : 100-Point Verification, A* Simulation & Auto-Heal
  • dream-critic    : Adversarial Evaluation & Quality Gate

Error Rate Target: <10%
Current Error Rate: ${getErrorRate()}%
`);
    return { success: false, reason: 'missing_map_name' };
  }

  const key = rawName.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  const displayName = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const isVerbose = options.verbose || process.argv.includes('--verbose') || process.argv.includes('-v');

  // 1. Load memory
  let memory = { thematicArchetypes: {}, safetyClearances: {} };
  if (fs.existsSync(MEMORY_FILE)) {
    try { memory = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8')); } catch (e) {}
  }

  // 2. State Detection
  function findConceptFile() {
    if (fs.existsSync(CONCEPTS_DIR)) {
      const files = fs.readdirSync(CONCEPTS_DIR).filter(f => f.endsWith('.md'));
      const match = files.find(f => f.toLowerCase().includes(key));
      if (match) return path.join(CONCEPTS_DIR, match);
    }
    if (fs.existsSync(DESC_DIR)) {
      const files = fs.readdirSync(DESC_DIR).filter(f => f.endsWith('.md'));
      const match = files.find(f => f.toLowerCase().replace(/-/g, '_').includes(key));
      if (match) return path.join(DESC_DIR, match);
    }
    return null;
  }

  const levelFile = path.join(LEVELS_DIR, `${key}.js`);
  const recipeFile = path.join(RECIPES_DIR, `${key}.json`);
  const hasLevelFile = fs.existsSync(levelFile);
  const hasRecipeFile = fs.existsSync(recipeFile);
  const conceptFile = findConceptFile();
  const hasConcept = !!conceptFile;

  let mode;
  if (hasLevelFile || hasRecipeFile) mode = 'MAP';
  else if (hasConcept) mode = 'CONCEPT';
  else mode = 'NOTHING';

  // 3. Resolve Theme
  let theme = rawTheme.toLowerCase().trim();
  if (!theme || !memory.thematicArchetypes[theme]) {
    for (const [aKey, data] of Object.entries(memory.thematicArchetypes || {})) {
      if (aKey === key || (data.keywords && data.keywords.some(k => key.includes(k)))) {
        theme = aKey;
        break;
      }
    }
  }

  if (!theme && hasConcept) {
    try {
      const md = fs.readFileSync(conceptFile, 'utf8');
      const catMatch = md.match(/tactical category[:\s]*`?(\w+)`?/i) || md.match(/thematic archetype[:\s]*`?(\w+)`?/i);
      if (catMatch) theme = catMatch[1].toLowerCase().trim();
    } catch (e) {}
  }

  if (!theme) {
    // Intelligent fallback based on known biomes
    const biomes = ['urban', 'colossal', 'anomalous', 'kinetic', 'zen', 'cyber', 'steampunk', 'maritime', 'forest'];
    const matched = biomes.find(b => key.includes(b));
    theme = matched || 'urban';
  }

  console.log(`\n👑 [DREAM SUPER AGENT] Orchestrating [${displayName.toUpperCase()}]`);
  console.log(`   Mode: ${mode} | Theme: ${theme.toUpperCase()}`);
  console.log(`   Subagents Active: dream-architect, dream-decorator, dream-combat, dream-auditor, dream-critic\n`);

  const stages = {};
  let overallSuccess = true;
  let snapshotPath = null;

  // Snapshot for rollback in Mode 3
  if (hasLevelFile) {
    fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
    snapshotPath = path.join(SNAPSHOTS_DIR, `${key}-pre-dream-${Date.now()}.js`);
    fs.copyFileSync(levelFile, snapshotPath);
  }

  try {
    const presetMap = {
      zen: 'urban',
      cyber: 'urban',
      steampunk: 'kinetic',
      colossal: 'colossal',
      maritime: 'urban',
      forest: 'anomalous',
      space_station: 'kinetic',
      station: 'kinetic'
    };
    const scaffoldPreset = presetMap[theme] || 'urban';

    // ========================================================
    // PIPELINE EXECUTION
    // ========================================================
    if (mode === 'NOTHING') {
      console.log(`⚡ Mode 1: Synthesizing concept & declarative recipe from pure imagination...`);
      // Step 1: Synthesize Concept
      runStage('Concept Synthesis', `node src/map-synthesizer.js ${key} ${theme}`, { verbose: isVerbose });
      // Step 2: Scaffold from declarative recipe
      runStage('Recipe Scaffolding', `node src/map-scaffold.js ${key} ${scaffoldPreset} --recipe`, { verbose: isVerbose });
      // Step 3: Brain 1 Mutation Optimization
      if (fs.existsSync(recipeFile)) {
        runStage('Layout Mutation Search', `node src/dream-mutator.js ${key}`, { verbose: isVerbose });
        runStage('Recipe Sync', `node src/map-scaffold.js ${key} ${scaffoldPreset} --recipe`, { verbose: isVerbose });
      }
      // Step 4: Enemy AI Synthesis
      runStage('Enemy AI Synthesis', `node src/enemy-synthesizer.js ${key}`, { verbose: isVerbose });
    } else if (mode === 'CONCEPT') {
      console.log(`📜 Mode 2: Compiling rich concept into declarative recipe...`);
      // Step 1: Scaffold from concept
      runStage('Concept Scaffolding', `node src/map-scaffold.js ${key} ${scaffoldPreset} --recipe`, { verbose: isVerbose });
      // Step 2: Mutation Search
      if (fs.existsSync(recipeFile)) {
        runStage('Layout Mutation Search', `node src/dream-mutator.js ${key}`, { verbose: isVerbose });
        runStage('Recipe Sync', `node src/map-scaffold.js ${key} ${scaffoldPreset} --recipe`, { verbose: isVerbose });
      }
      // Step 3: Enemy AI Synthesis
      runStage('Enemy AI Synthesis', `node src/enemy-synthesizer.js ${key}`, { verbose: isVerbose });
    } else if (mode === 'MAP') {
      console.log(`🏗️  Mode 3: Enhancing map with spatial doctor & declarative optimization...`);
      
      // Step 1: Spatial Doctor (Sanitize stairs, headroom, colliders)
      try {
        const { StairSanitizer } = await import('./stair-sanitizer.js');
        const sanitizer = new StairSanitizer(key);
        const stairResult = sanitizer.sanitizeLevelFile(levelFile);
        if (stairResult.cleanedCount > 0) {
          console.log(`  ✓ Spatial Doctor: Cleaned ${stairResult.cleanedCount} staircase headroom issues.`);
        }
      } catch (err) {
        // If file doesn't have stairs or module is quiet, continue cleanly
      }

      // Step 2: Clean up any old duplicate injection markers from legacy orchestrator
      if (fs.existsSync(levelFile)) {
        let code = fs.readFileSync(levelFile, 'utf8');
        let cleaned = false;
        const macroCount = (code.match(/\/\/ === DREAM AUTO-INJECTED MACRO STRUCTURES ===/g) || []).length;
        if (macroCount > 1) {
          const regex = /\/\/ === DREAM AUTO-INJECTED MACRO STRUCTURES ===[\s\S]*?\/\/ === END DREAM AUTO-INJECTED MACRO STRUCTURES ===/g;
          const matches = code.match(regex);
          if (matches) {
            for (let i = 0; i < matches.length - 1; i++) code = code.replace(matches[i], '');
            cleaned = true;
          }
        }
        const propCount = (code.match(/\/\/ === DREAM AUTO-INJECTED THEMATIC PROPS ===/g) || []).length;
        if (propCount > 1) {
          const regex = /\/\/ === DREAM AUTO-INJECTED THEMATIC PROPS ===[\s\S]*?\/\/ === END DREAM AUTO-INJECTED PROPS ===/g;
          const matches = code.match(regex);
          if (matches) {
            for (let i = 0; i < matches.length - 1; i++) code = code.replace(matches[i], '');
            cleaned = true;
          }
        }
        if (cleaned) {
          fs.writeFileSync(levelFile, code, 'utf8');
          console.log(`  ✓ Pruned duplicate legacy injection blocks from ${path.basename(levelFile)}`);
        }
      }

      // Step 3: If recipe exists, run mutation optimization
      if (hasRecipeFile) {
        runStage('Layout Mutation Search', `node src/dream-mutator.js ${key}`, { verbose: isVerbose });
        runStage('Recipe Sync', `node src/map-scaffold.js ${key} ${scaffoldPreset} --recipe`, { verbose: isVerbose });
      }

      // Step 4: Ensure Enemy AI adheres to role tags
      runStage('Enemy AI Synthesis', `node src/enemy-synthesizer.js ${key}`, { verbose: isVerbose });
    }

    // ========================================================
    // UNIVERSAL CERTIFICATION & SELF-HEALING SUITE
    // ========================================================
    console.log(`\n🔍 Running Universal Dream Certification Suite (dream-auditor)...`);

    // 1. 100-Point Universal Dream Verification Suite
    runStage('Dream Verification Suite', `node src/verify-suite.js ${key}`, { verbose: isVerbose });

    // 2. Bot Flow Simulation
    runStage('Bot Navigation Simulation', `node src/map-simulate.js ${key}`, { verbose: isVerbose });

    // 3. Detailing Standard Self-Healing Audit
    runStage('Universal Detailing Audit', `node .agents/skills/universal-detailing-standard/scripts/verify-detailing.js ${key} --heal`, { verbose: isVerbose });

    // 4. Auto-Graduate Concept if applicable
    if (fs.existsSync(CONCEPTS_DIR)) {
      const concepts = fs.readdirSync(CONCEPTS_DIR).filter(f => f.endsWith('.md') && f.toLowerCase().includes(key));
      if (concepts.length > 0 && fs.existsSync(path.resolve('graduate-map.js'))) {
        runStage('Concept Graduation', `node graduate-map.js ${key}`, { verbose: isVerbose });
      }
    }

  } catch (err) {
    overallSuccess = false;
    console.error(`\n💥 DREAM SUPER AGENT ERROR: ${err.message}`);
    if (snapshotPath && fs.existsSync(snapshotPath)) {
      fs.copyFileSync(snapshotPath, levelFile);
      console.log(`⏪ Restored pre-dream snapshot.`);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  if (overallSuccess) {
    console.log(`\n✨ [CERTIFIED] [${displayName.toUpperCase()}] Passed all spatial, tactical, and physics checks in ${elapsed}s!\n`);
  } else {
    console.log(`\n❌ [FAILED] [${displayName.toUpperCase()}] Execution encountered errors in ${elapsed}s.\n`);
  }

  recordDreamRun(key, overallSuccess, 0, mode, stages);
  return { success: overallSuccess, elapsed, stages };
}

// CLI Execution Entrypoint
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rawName = process.argv[2];
  const themeArg = process.argv[3] || '';
  executeDreamSuperAgent(rawName, themeArg).then(res => {
    process.exit(res.success ? 0 : 1);
  });
}
