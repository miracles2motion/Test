#!/usr/bin/env node
/**
 * Doodle Strike - Self-Learning & Architecture Memory Manager (God Mode)
 *
 * Active prevention system that learns from past failures AND successes.
 * Records failure blacklists, success registries, error rate tracking,
 * and auto-tightens constraints when patterns recur.
 *
 * Usage:
 *   node src/map-learning.js [action]
 *   npm run map:learn
 *   npm run map:learn -- --summary
 *   npm run map:learn -- --history
 *   npm run map:learn -- --blacklist
 *   npm run map:learn -- --errorrate
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CACHE_FILE = path.join(ROOT_DIR, '.agents', 'learning-cache.json');
const JOURNAL_FILE = path.join(ROOT_DIR, '.agents', 'dream-journal.json');

const DEFAULT_CACHE = {
  version: '2.0.0',
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
  learnedPatterns: [],
  history: [],
  // NEW: Active prevention systems
  failureBlacklist: {},       // { templateId: { count, lastFailure, reason } }
  successRegistry: {},        // { templateId: { count, lastSuccess, avgScore, positions: [] } }
  errorRateTracker: {
    windowSize: 20,
    runs: [],                 // last N run results: { timestamp, mapKey, success, score }
    currentRate: 0            // percentage of failures in window
  },
  ruleTighteningLog: []       // log of auto-tightened rules
};

export function getLearningCache() {
  if (!fs.existsSync(CACHE_FILE)) {
    fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(DEFAULT_CACHE, null, 2), 'utf8');
    return JSON.parse(JSON.stringify(DEFAULT_CACHE));
  }
  try {
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    // Ensure new fields exist for backward compat
    if (!cache.failureBlacklist) cache.failureBlacklist = {};
    if (!cache.successRegistry) cache.successRegistry = {};
    if (!cache.errorRateTracker) cache.errorRateTracker = { windowSize: 20, runs: [], currentRate: 0 };
    if (!cache.ruleTighteningLog) cache.ruleTighteningLog = [];
    return cache;
  } catch (err) {
    console.error('Error parsing learning cache, resetting to defaults:', err.message);
    return JSON.parse(JSON.stringify(DEFAULT_CACHE));
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

  if (cache.history.length > 200) cache.history = cache.history.slice(-200);
  saveLearningCache(cache);
}

// ============================================================
// GOD MODE: Active Prevention Systems
// ============================================================

/**
 * Blacklist a template that caused a failure.
 * After 3+ failures, the template is permanently blocked unless explicitly cleared.
 */
export function blacklistTemplate(templateId, reason, mapKey) {
  const cache = getLearningCache();
  const entry = cache.failureBlacklist[templateId] || { count: 0, failures: [] };
  entry.count++;
  entry.lastFailure = new Date().toISOString();
  entry.reason = reason;
  entry.failures.push({ mapKey, timestamp: new Date().toISOString(), reason });
  if (entry.failures.length > 10) entry.failures = entry.failures.slice(-10);
  cache.failureBlacklist[templateId] = entry;

  // Auto-tighten: if a pattern fails 3+ times, tighten related constraints
  if (entry.count >= 3) {
    autoTightenRules(cache, templateId, reason);
  }

  saveLearningCache(cache);
  recordLearnedPattern(mapKey, `blacklist-${templateId}`, `Template ${templateId} blacklisted: ${reason}`, 'autoBlacklist');
}

/**
 * Check if a template is blacklisted (3+ failures).
 */
export function isTemplateBlacklisted(templateId) {
  const cache = getLearningCache();
  const entry = cache.failureBlacklist[templateId];
  if (!entry) return false;
  return entry.count >= 3;
}

/**
 * Get all blacklisted template IDs.
 */
export function getBlacklistedTemplates() {
  const cache = getLearningCache();
  return Object.entries(cache.failureBlacklist)
    .filter(([, v]) => v.count >= 3)
    .map(([k]) => k);
}

/**
 * Register a successful template placement.
 */
export function registerSuccess(templateId, mapKey, score, position) {
  const cache = getLearningCache();
  const entry = cache.successRegistry[templateId] || { count: 0, totalScore: 0, positions: [] };
  entry.count++;
  entry.totalScore = (entry.totalScore || 0) + score;
  entry.avgScore = Math.round(entry.totalScore / entry.count);
  entry.lastSuccess = new Date().toISOString();
  if (position) {
    entry.positions.push({ mapKey, ...position });
    if (entry.positions.length > 20) entry.positions = entry.positions.slice(-20);
  }
  cache.successRegistry[templateId] = entry;
  saveLearningCache(cache);
}

/**
 * Get templates sorted by success score (best first).
 */
export function getTopTemplates(limit = 10) {
  const cache = getLearningCache();
  return Object.entries(cache.successRegistry)
    .sort(([, a], [, b]) => (b.avgScore || 0) - (a.avgScore || 0))
    .slice(0, limit)
    .map(([id, data]) => ({ id, ...data }));
}

/**
 * Record a dream run result and update error rate.
 */
export function recordDreamRun(mapKey, success, score, mode, stages) {
  const cache = getLearningCache();
  const tracker = cache.errorRateTracker;

  tracker.runs.push({
    timestamp: new Date().toISOString(),
    mapKey,
    success,
    score: score || 0,
    mode: mode || 'unknown'
  });

  // Keep only last N runs
  if (tracker.runs.length > tracker.windowSize) {
    tracker.runs = tracker.runs.slice(-tracker.windowSize);
  }

  // Calculate current error rate
  const failures = tracker.runs.filter(r => !r.success).length;
  tracker.currentRate = Math.round((failures / tracker.runs.length) * 100);

  saveLearningCache(cache);

  // Also write to dream journal
  writeDreamJournalEntry(mapKey, success, score, mode, stages);
}

/**
 * Get current error rate (percentage).
 */
export function getErrorRate() {
  const cache = getLearningCache();
  const tracker = cache.errorRateTracker;
  if (!tracker.runs || tracker.runs.length === 0) return 0;
  const failures = tracker.runs.filter(r => !r.success).length;
  return Math.round((failures / tracker.runs.length) * 100);
}

/**
 * Auto-tighten rules when a failure pattern hits 3+ occurrences.
 */
function autoTightenRules(cache, templateId, reason) {
  const tightening = { timestamp: new Date().toISOString(), templateId, reason, changes: [] };

  if (reason.includes('headroom') || reason.includes('stair')) {
    const old = cache.rules.stairway.requiredHeadroom;
    cache.rules.stairway.requiredHeadroom = Math.min(old + 0.2, 3.0);
    tightening.changes.push(`stairway.requiredHeadroom: ${old} → ${cache.rules.stairway.requiredHeadroom}`);
  }
  if (reason.includes('ring') || reason.includes('grapple') || reason.includes('clearance')) {
    const old = cache.rules.rings.minWallDistance;
    cache.rules.rings.minWallDistance = Math.min(old + 0.2, 2.5);
    tightening.changes.push(`rings.minWallDistance: ${old} → ${cache.rules.rings.minWallDistance}`);
  }
  if (reason.includes('collid') || reason.includes('overlap')) {
    const old = cache.rules.traversal.minPinchWidth;
    cache.rules.traversal.minPinchWidth = Math.min(old + 0.1, 2.5);
    tightening.changes.push(`traversal.minPinchWidth: ${old} → ${cache.rules.traversal.minPinchWidth}`);
  }

  if (tightening.changes.length > 0) {
    cache.ruleTighteningLog.push(tightening);
    if (cache.ruleTighteningLog.length > 50) cache.ruleTighteningLog = cache.ruleTighteningLog.slice(-50);
    console.log(`🔧 Auto-tightened rules due to recurring failure [${templateId}]:`);
    tightening.changes.forEach(c => console.log(`   ${c}`));
  }
}

/**
 * Write a dream journal entry.
 */
function writeDreamJournalEntry(mapKey, success, score, mode, stages) {
  let journal = { runs: [], stats: { totalRuns: 0, successes: 0, failures: 0, errorRate: 0, avgScore: 0 } };
  if (fs.existsSync(JOURNAL_FILE)) {
    try { journal = JSON.parse(fs.readFileSync(JOURNAL_FILE, 'utf8')); } catch (e) { /* reset */ }
  }

  const entry = {
    id: `dream-${String(journal.runs.length + 1).padStart(3, '0')}`,
    timestamp: new Date().toISOString(),
    mapKey,
    mode,
    success,
    score: score || 0,
    stages: stages || {}
  };

  journal.runs.push(entry);
  if (journal.runs.length > 100) journal.runs = journal.runs.slice(-100);

  // Update stats
  journal.stats.totalRuns = journal.runs.length;
  journal.stats.successes = journal.runs.filter(r => r.success).length;
  journal.stats.failures = journal.runs.filter(r => !r.success).length;
  journal.stats.errorRate = journal.stats.totalRuns > 0
    ? `${journal.stats.failures}/${journal.stats.totalRuns} (${Math.round((journal.stats.failures / journal.stats.totalRuns) * 100)}%)`
    : '0/0 (0%)';
  const scores = journal.runs.filter(r => r.score > 0).map(r => r.score);
  journal.stats.avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  fs.mkdirSync(path.dirname(JOURNAL_FILE), { recursive: true });
  fs.writeFileSync(JOURNAL_FILE, JSON.stringify(journal, null, 2), 'utf8');
}

// ============================================================
// CLI Execution
// ============================================================
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const cache = getLearningCache();

  console.log('🧠 Doodle Strike - Self-Learning & Architecture Memory Manager (God Mode)');
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

  // Blacklist display
  const blacklisted = getBlacklistedTemplates();
  if (blacklisted.length > 0 || args.includes('--blacklist')) {
    console.log(`🚫 Blacklisted Templates (${blacklisted.length}):`);
    blacklisted.forEach(id => {
      const entry = cache.failureBlacklist[id];
      console.log(`   • [${id}] — ${entry.count} failures — Reason: ${entry.reason}`);
    });
    console.log('');
  }

  // Error rate display
  const errorRate = getErrorRate();
  const tracker = cache.errorRateTracker;
  console.log(`📊 Dream Error Rate: ${errorRate}% (${tracker.runs?.length || 0} runs in window)`);
  if (errorRate > 10) {
    console.log(`   ⚠️ ERROR RATE ABOVE 10% TARGET — Dream needs attention!`);
  } else {
    console.log(`   ✅ Within target (<10%)`);
  }

  // Success registry
  const topTemplates = getTopTemplates(5);
  if (topTemplates.length > 0) {
    console.log(`\n🏆 Top Performing Templates:`);
    topTemplates.forEach((t, i) => {
      console.log(`   ${i + 1}. [${t.id}] — Avg Score: ${t.avgScore} — Used: ${t.count}x`);
    });
  }

  // Rule tightening log
  if (cache.ruleTighteningLog?.length > 0) {
    console.log(`\n🔧 Rule Auto-Tightening History (last 5):`);
    cache.ruleTighteningLog.slice(-5).forEach(t => {
      console.log(`   [${t.timestamp.slice(0, 19)}] Template: ${t.templateId}`);
      t.changes.forEach(c => console.log(`     → ${c}`));
    });
  }

  if (args.includes('--history')) {
    console.log(`\n🕒 Learning History Log (Last 10 events):`);
    const hist = (cache.history || []).slice(-10);
    if (hist.length === 0) {
      console.log('   (No history events logged yet)');
    } else {
      hist.forEach((h) => console.log(`   • [${h.timestamp.slice(11, 19)}] [${h.mapKey}] ${h.patternId}: ${h.description}`));
    }
  }

  console.log('\n============================================================');
  console.log('💡 Tip: Run `npm run map:god <name> [theme]` for God Mode dream pipeline.');
}
