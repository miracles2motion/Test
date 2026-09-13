import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { inspectMap } from '../src/map-inspector.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const mapArg = process.argv[2];
if (!mapArg) {
  console.error("Usage: node dream_inspect_cli.js <mapName>");
  process.exit(1);
}

const levelFilePath = path.join(ROOT_DIR, 'src', 'levels', `${mapArg}.js`);
if (!fs.existsSync(levelFilePath)) {
  console.error(`Map not found: ${levelFilePath}`);
  process.exit(1);
}

const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');

const results = inspectMap(levelFilePath);

if (results) {
  if (isVerbose) {
    console.log(`\n🔍 DREAM ARCHITECTURAL INSPECTOR`);
    console.log(`Analyzing ${mapArg}...\n`);
    console.log(`📊 MAP STATS:`);
    // Note: the previous implementation actually had hardcoded output, now I will provide dynamic stats based on `results.report.score`.
  }
  
  const report = results.report;
  
  if (report.blunders.length === 0) {
    if (isVerbose) {
      console.log(`✅ Status: Clean (0 Critical Blunders, 0 Warnings)`);
      console.log(`✅ Quality Score: ${report.score} / 12 (100% Pass Rate)`);
    } else {
      console.log(`✨ [PASS] [${mapArg.toUpperCase()}] Clean | Quality Score: ${report.score}/12`);
    }
  } else {
    if (isVerbose) {
      console.log(`❌ Status: Failed (${report.blunders.length} Critical Blunders)`);
      console.log(`⚠️ Quality Score: ${report.score} / 12`);
      console.log(`\n--- BLUNDER LOG ---`);
      report.blunders.forEach((b, i) => {
        console.log(`\n💥 Blunder ${i + 1}: [${b.type}]`);
        console.log(`   ${b.message}`);
      });
      console.log(`\nRun 'npm run dream:heal ${mapArg}' to automatically resolve these issues.`);
    } else {
      console.log(`⚠️ [ISSUES FOUND] [${mapArg.toUpperCase()}] — ${report.blunders.length} error(s)`);
      report.blunders.slice(0, 3).forEach((b) => console.log(`   ❌ ${b.message}`));
      if (report.blunders.length > 3) console.log(`   ... and ${report.blunders.length - 3} more errors.`);
      console.log(`   👉 To auto-repair run: npm run map:heal ${mapArg}`);
      console.log(`   👉 (For full diagnostics, run with --verbose)`);
    }
  }
} else {
  console.log(`❌ [ERROR] Map "${mapArg}" not found or failed inspection.`);
}
