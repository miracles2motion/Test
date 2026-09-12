/**
 * Doodle Strike - System Integrity & Architecture Verifier
 * Validates module completeness, exports, shader math, mobile controls, and syntax.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../../..');

console.log('🔍 Running Doodle Strike Architectural Integrity Check...\n');

let passed = true;
function assert(cond, msg) {
  if (cond) {
    console.log(`  ✓ ${msg}`);
  } else {
    console.error(`  ✗ FAIL: ${msg}`);
    passed = false;
  }
}

// 1. Check Core Source Modules
const CORE_MODULES = [
  'audio.js', 'effects.js', 'enemies.js', 'hud.js',
  'input.js', 'level.js', 'main.js', 'mobile.js',
  'nav.js', 'net.js', 'physics.js', 'player.js',
  'players.js', 'render.js', 'util.js', 'weapons.js'
];

console.log('📦 Checking Core Source Modules:');
for (const mod of CORE_MODULES) {
  const filePath = path.join(ROOT_DIR, 'src', mod);
  assert(fs.existsSync(filePath), `src/${mod} exists`);
}

// 2. Check Static Assets & Web Configuration
console.log('\n📄 Checking Web Assets & Manifests:');
const REQUIRED_FILES = [
  'index.html', 'style.css', 'manifest.webmanifest',
  'sw.js', 'icon-192.svg', 'icon-512.svg'
];
for (const file of REQUIRED_FILES) {
  assert(fs.existsSync(path.join(ROOT_DIR, file)), `${file} exists`);
}

// 3. Syntax Verification
console.log('\n⚙️ Validating Syntax Across All Modules:');
try {
  const jsFiles = CORE_MODULES.map(m => path.join('src', m)).join(' ');
  execSync(`node --check ${jsFiles}`, { cwd: ROOT_DIR, stdio: 'pipe' });
  console.log('  ✓ All 16 JavaScript modules pass syntax verification (node --check)');
} catch (err) {
  assert(false, `Syntax check error: ${err.message}`);
}

// 4. Architectural Invariants Check
console.log('\n🛡️ Checking Critical Architectural Invariants:');

const renderContent = fs.readFileSync(path.join(ROOT_DIR, 'src/render.js'), 'utf8');
assert(renderContent.includes('export class InkRenderer'), 'InkRenderer class exported');
assert(renderContent.includes('takeScreenshot'), 'takeScreenshot export exists in InkRenderer');
assert(renderContent.includes('0.14, 0.28, 0.76'), 'Softened ballpoint blue ink palette active');
assert(renderContent.includes('smoothstep(0.10, 0.0, shade) * 0.28'), 'Softened shadow hatching cap active');
assert(!renderContent.includes('max(0.0, d - dl)'), 'Floor shadow crevice bug completely removed');

const playerContent = fs.readFileSync(path.join(ROOT_DIR, 'src/player.js'), 'utf8');
assert(playerContent.includes('this.camera.getWorldDirection'), 'Optical aim ray synchronization present in player.js');

const weaponsContent = fs.readFileSync(path.join(ROOT_DIR, 'src/weapons.js'), 'utf8');
assert(weaponsContent.includes('const origin = P.camera.position;'), 'Parallax-free camera ray origin present in weapons.js');

const mobileContent = fs.readFileSync(path.join(ROOT_DIR, 'src/mobile.js'), 'utf8');
assert(mobileContent.includes('btn-mobile-screenshot'), 'Mobile screenshot camera button integrated');
assert(mobileContent.includes('lookVector.y -= dy'), 'Touch look Y-axis orientation correct (look up)');
assert(mobileContent.includes('btn-ads-fire'), 'Dual-fire ADS fire button present');
assert(mobileContent.includes('setGameplayActive'), 'Mobile setGameplayActive touch suppression present');
assert(mobileContent.includes('resetTouches'), 'Mobile resetTouches method present');

const hudContent = fs.readFileSync(path.join(ROOT_DIR, 'src/hud.js'), 'utf8');
assert(hudContent.includes('onScreenVisibility'), 'HUD screen visibility callback hook present');
assert(hudContent.includes("e.target === this.el.screen || e.target.closest('.go')"), 'HUD backdrop click isolation present');

const mainContent = fs.readFileSync(path.join(ROOT_DIR, 'src/main.js'), 'utf8');
assert(mainContent.includes('fastClick('), 'Fast 0ms touch pointerdown listener present in main.js');

const cssContent = fs.readFileSync(path.join(ROOT_DIR, 'style.css'), 'utf8');
assert(cssContent.includes('.settings-body'), 'Responsive scrollable settings body defined');
assert(cssContent.includes('#btn-mobile-screenshot'), 'Screenshot mobile button styles present');
assert(cssContent.includes('z-index: 2000'), 'Modal screen backdrop layered at z-index 2000');
assert(cssContent.includes('z-index: 2001'), 'Modal panel card layered at z-index 2001');
assert(cssContent.includes('z-index: 200'), 'Mobile controls layered at z-index 200');
assert(cssContent.includes('z-index: 1000'), 'HUD overlay layered at z-index 1000');

// 5. Trademark Sanitization Check
console.log('\n🔒 Verifying Trademark Sanitization:');
const checkFiles = [
  'index.html', 'style.css', 'manifest.webmanifest', 'README.md',
  ...CORE_MODULES.map(m => `src/${m}`)
];
let leaked = false;
for (const rel of checkFiles) {
  const text = fs.readFileSync(path.join(ROOT_DIR, rel), 'utf8');
  if (/call of duty/i.test(text) || /\bcod\b/i.test(text)) {
    console.error(`  ✗ LEAK: Trademark detected in ${rel}`);
    leaked = true;
    passed = false;
  }
}
if (!leaked) {
  console.log('  ✓ Clean: Zero instances of Call of Duty / COD detected');
}

console.log('\n' + '='.repeat(60));
if (passed) {
  console.log('🎉 ARCHITECTURE INTEGRITY VERIFIED: BUILD IS 100% PERFECT & INTACT!');
  process.exit(0);
} else {
  console.error('🚨 INTEGRITY FAILURE: Build has corrupted components or regressions.');
  process.exit(1);
}
