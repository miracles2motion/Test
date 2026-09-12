#!/usr/bin/env node
/**
 * Doodle Strike - Self-Learning & Architecture Memory Manager
 *
 * Captures audit failure patterns, logs remedies into .agents/learning-cache.json,
 * and feeds learned constraints directly back to map builders, auto-healer, and scaffolding engines.
 *
 * Usage:
 *   node src/map-learning.js [action]
 *   npm run map:learn
 *   npm run map:learn -- --summary
 *   npm run map:learn -- --record <ruleCategory> <patternDesc>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CACHE_FILE = path.join(ROOT_DIR, '.agents', 'learning-cache.json');

export function getLearningCache() {
  if (!fs.existsSync(CACHE_FILE)) {
    const defaultCache = {
      version: '1.0.0',
      updatedAt: new Date().toISOString(),
      rules: {
        stairway: {
          minRise: 0.2,
          maxRise: 0.32,
          recommendedRise: 0.2857,
          minRun: 0.4,
          maxRun: 0.5,
          recommendedRun: 0.45,
          requiredHeadroom: 2.0,
          sideClearance: 0.3,
          landingClearance: 1.2
        },
        rings: {
          minWallDistance: 1.5,
          minCeilingDistance: 0.5,
          autoNudgeOffset: 0.4
        },
        traversal: {
          minPinchWidth: 1.8,
          minDoorwayWidth: 1.8,
          minDoorwayHeight: 2.8,
          minLedgeDepth: 1.4,
          jumpOverMaxHeight: 1.2
        },
        density: {
          minColliders: 150,
          minSpawns: 4,
          minSnipers: 2,
          minPickups: 4,
          minRings: 4
        },
        geometry: {
          slabSignature: 'slab(x1, z1, x2, z2, y, thickness, opts)',
          boxSignature: 'box(x, y, z, w, h, d, opts)',
          ringSignature: 'ring(x, y, z, orient, opts)',
          dryRunVerificationRequired: true
        }
      },
      learnedPatterns: [
        {
          patternId: 'geometry-signature-mismatch',
          description: 'slab() must be called with bounding box (x1, z1, x2, z2, y, t, opts) rather than center-based parameters to prevent NaN thickness evaluations in Three.js BoxGeometry.',
          trigger: 'slab-signature-mismatch',
          autoRemedy: 'dryRunThreeJsBufferValidation',
          occurrences: 1,
          lastObserved: new Date().toISOString()
        }
      ],
      history: []
    };
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(defaultCache, null, 2), 'utf8');
    return defaultCache;
  }
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch (err) {
    console.error('Error parsing learning cache, resetting to defaults:', err.message);
    return {};
  }
}

export function saveLearningCache(cache) {
  cache.updatedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
}

/**
 * Record a learned remediation event from audit or runtime heal
 */
export function recordLearnedPattern(mapKey, patternId, description, autoRemedy) {
  const cache = getLearningCache();
  if (!cache.learnedPatterns) cache.learnedPatterns = [];
  if (!cache.history) cache.history = [];

  const existing = cache.learnedPatterns.find((p) => p.patternId === patternId);
  if (!existing) {
    cache.learnedPatterns.push({
      patternId,
      description,
      trigger: patternId,
      autoRemedy,
      occurrences: 1,
      lastObserved: new Date().toISOString()
    });
  } else {
    existing.occurrences = (existing.occurrences || 1) + 1;
    existing.lastObserved = new Date().toISOString();
  }

  cache.history.push({
    timestamp: new Date().toISOString(),
    mapKey,
    patternId,
    description
  });

  if (cache.history.length > 100) cache.history.shift();
  saveLearningCache(cache);
}

// CLI Execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const cache = getLearningCache();

  console.log('🧠 Doodle Strike - Self-Learning & Architecture Memory Manager');
  console.log('============================================================');
  console.log(`Cache Location: .agents/learning-cache.json`);
  console.log(`Last Updated:   ${cache.updatedAt || 'Never'}\n`);

  console.log('📐 Standard Metric Constraints:');
  console.log(`  • Stairway:   Rise [${cache.rules.stairway.minRise} - ${cache.rules.stairway.maxRise}]m (Rec: ${cache.rules.stairway.recommendedRise}m) | Run: ${cache.rules.stairway.recommendedRun}m | Headroom: ${cache.rules.stairway.requiredHeadroom}m`);
  console.log(`  • Rings:      Min Wall Clearance: ${cache.rules.rings.minWallDistance}m`);
  console.log(`  • Traversal:  Min Corridor Width: ${cache.rules.traversal.minPinchWidth}m | Doorway H: ${cache.rules.traversal.minDoorwayHeight}m`);
  console.log(`  • Density:    Min Colliders: ${cache.rules.density.minColliders} | Spawns: ${cache.rules.density.minSpawns}\n`);

  console.log(`📚 Active Learned Patterns (${cache.learnedPatterns?.length || 0}):`);
  (cache.learnedPatterns || []).forEach((p, idx) => {
    console.log(`  ${idx + 1}. [${p.patternId}] (Trigger: ${p.trigger})`);
    console.log(`     Desc:   ${p.description}`);
    console.log(`     Remedy: ${p.autoRemedy} (Hits: ${p.occurrences || 1})\n`);
  });

  if (args.includes('--history')) {
    console.log(`🕒 Learning History Log (Last 10 events):`);
    const hist = (cache.history || []).slice(-10);
    if (hist.length === 0) {
      console.log('   (No history events logged yet)');
    } else {
      hist.forEach((h) => console.log(`   • [${h.timestamp.slice(11, 19)}] [${h.mapKey}] ${h.patternId}: ${h.description}`));
    }
  }

  console.log('============================================================');
  console.log('💡 Tip: Run `npm run audit:map -- --heal` to automatically trigger learning & auto-repair.');
}
