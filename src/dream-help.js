import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { syncRegistry } from './dream-registry-sync.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REGISTRY_PATH = path.join(__dirname, 'dream-features.json');

export function showDreamHelp(isCliDetailed = false) {
  // Always auto-sync before showing help to ensure it's up to date
  syncRegistry();

  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error('❌ Registry not found at src/dream-features.json');
    process.exit(1);
  }

  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));

  console.log(`🌌 DREAM ENGINE: CAPABILITIES & FEATURES`);
  console.log(`Unified AI Orchestrator, Self-Healing Geometry Engine & Procedural Detailer\n`);

  const icons = {
    orchestration: '🔱',
    diagnostics: '🔍',
    remediation: '🔧',
    learning: '🧠'
  };

  const titles = {
    orchestration: 'CORE ORCHESTRATION',
    diagnostics: 'ANALYSIS & DIAGNOSTICS',
    remediation: 'REMEDIATION & DETAILING',
    learning: 'SELF-LEARNING & MEMORY'
  };

  for (const [catKey, features] of Object.entries(registry)) {
    const icon = icons[catKey] || '📦';
    const title = titles[catKey] || catKey.toUpperCase();
    console.log(`${icon} ${title}`);
    
    // Deduplicate and filter core features
    const seenNames = new Set();
    for (const feat of features) {
      if (seenNames.has(feat.name)) continue;
      seenNames.add(feat.name);
      
      // Plain English format: Feature Name: Explanation
      console.log(` • ${feat.name}: ${feat.description}`);
    }
    console.log('');
  }

  console.log(`💬 NATURAL LANGUAGE USAGE:`);
  console.log(`You can talk to Dream directly:`);
  console.log(`• "dream inspect the library" -> Runs geometry and physics inspection`);
  console.log(`• "dream heal clockwork tower" -> Automatically repairs headroom and stairs`);
  console.log(`• "dream build maritime pirate_cove"-> Synthesizes a new map from scratch`);
  console.log(`• "dream teach / dream pending" -> Answers questions when Dream asks for help`);
  console.log(`• "dream ?" or "dream help" -> Displays this guide\n`);

  if (isCliDetailed) {
    console.log(`⚡ CLI COMMANDS REFERENCE:`);
    console.log(`----------------------------------------------------------------------`);
    console.log(`npm run map:god <name> [theme]    Build complete map from concept/scratch`);
    console.log(`npm run map:scaffold <name>       Create verified 3-lane balanced template`);
    console.log(`npm run map:inspect <name>        Fast AST physics & geometry audit`);
    console.log(`npm run map:heal <name>           Auto-carve headroom and fix stair physics`);
    console.log(`npm run map:inject <name>         Add collision-free tactical cover`);
    console.log(`npm run dream:teach resume <id>   Resolve pending consultation ticket`);
    console.log(`npm run audit:map <name>          Verify 12/12 Universal Detailing standard`);
    console.log(`npm run dream:sync                Auto-scan codebase and update registry`);
    console.log(`----------------------------------------------------------------------\n`);
  }
}

// If run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const showCli = args.includes('--cli') || args.includes('-c') || args.includes('--verbose') || args.includes('-v');
  showDreamHelp(showCli);
}
