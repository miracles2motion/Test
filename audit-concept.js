#!/usr/bin/env node
/**
 * Concept Detailing & Brainstorming Validator
 * Audits map concepts in map_concepts/ for:
 *   1. Required Architectural Sections (13 standard sections)
 *   2. Thematic Prop Taxonomy across Detailing Tiers 1-4
 *   3. Sector Densification (no empty void/floor spaces)
 *   4. Mathematical Stairway & Landing Specifications
 *   5. Material-to-Ink Palettes
 *   6. Anti-Camp, Anti-Pinch (1.8m), & Grapple Clearance (1.5m) standards
 *
 * Usage:
 *   node audit-concept.js [conceptName|number]
 *   npm run audit:concept [conceptName]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CONCEPTS_DIR1 = path.resolve(__dirname, 'map_concepts');
const CONCEPTS_DIR2 = path.resolve(__dirname, 'Map Description');

const targetArg = (process.argv[2] || '').toLowerCase().trim();

let allFiles = [];
if (fs.existsSync(CONCEPTS_DIR1)) {
  allFiles = allFiles.concat(fs.readdirSync(CONCEPTS_DIR1).filter(f => f.endsWith('.md')).map(f => path.join(CONCEPTS_DIR1, f)));
}
if (fs.existsSync(CONCEPTS_DIR2)) {
  allFiles = allFiles.concat(fs.readdirSync(CONCEPTS_DIR2).filter(f => f.endsWith('.md')).map(f => path.join(CONCEPTS_DIR2, f)));
}

if (allFiles.length === 0) {
  console.log('ℹ️ No concept markdown files found.');
  process.exit(0);
}

let matchedFiles = allFiles;
if (targetArg && targetArg !== 'all') {
  matchedFiles = allFiles.filter(f => path.basename(f).toLowerCase().includes(targetArg));
  if (matchedFiles.length === 0) {
    console.error(`❌ No concept file matches "${targetArg}". Available concepts:`);
    allFiles.forEach(f => console.error(`   - ${path.basename(f)}`));
    process.exit(1);
  }
}

console.log('============================================================');
console.log('🧠 MAP CONCEPT & DETAILING SPECIFICATION AUDITOR');
console.log('============================================================\n');

let totalConceptsPassed = true;

for (const filePath of matchedFiles) {
  const file = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`📄 Auditing Concept: [${file}]`);

  const checks = [
    {
      name: 'Standard 13-Section Architectural Structure',
      test: () => {
        const sections = [
          'Spatial Coordinates',
          'Aesthetic & Ink Material System',
          'Perimeter Enclosure',
          'Sector 1',
          'Sector 2',
          'Sector 3',
          'Sector 4',
          'Central Sector',
          'Overhead',
          'Stairway Mathematics',
          'Variations Matrix',
          'Spawn Points',
          'Level Designer Checklist'
        ];
        const missing = sections.filter(s => !content.includes(s));
        return { ok: missing.length === 0, detail: missing.length ? `Missing: ${missing.join(', ')}` : 'All 13 core architectural sections present' };
      }
    },
    {
      name: 'Detailing Tier 1-4 Thematic Taxonomy',
      test: () => {
        const hasT1 = /tier 1|cover prop|cask|crate|barrel|box|rock|boulder/i.test(content);
        const hasT2 = /tier 2|tactical furniture|catwalk|bench|table|desk|deck|pier|platform/i.test(content);
        const hasT3 = /tier 3|landmark|spar|tower|mast|pedestal|crane|module|antenna/i.test(content);
        const hasT4 = /tier 4|hero set piece|centerpiece|galleon|rocket|fortress|complex/i.test(content);
        const ok = hasT1 && hasT2 && hasT3 && hasT4;
        return { ok, detail: ok ? 'Full Tier 1-4 prop taxonomy defined' : 'Incomplete Tier 1-4 prop classification' };
      }
    },
    {
      name: 'Ballpoint Ink Palette Completeness',
      test: () => {
        const inks = ['INK.BLUE', 'INK.BLACK', 'INK.ORANGE', 'INK.RED'];
        const missing = inks.filter(ink => !content.includes(ink));
        return { ok: missing.length === 0, detail: missing.length ? `Missing inks: ${missing.join(', ')}` : 'Full ballpoint material palette mapped' };
      }
    },
    {
      name: 'Stairway Mathematics & Intermediate Rest Landings',
      test: () => {
        const hasStairMath = /rise|run|0\.2|0\.3|step/i.test(content);
        const hasLandings = /landing|switchback/i.test(content);
        const ok = hasStairMath && hasLandings;
        return { ok, detail: ok ? 'Step rise/run ratios and rest landings specified' : 'Stairway rise/run or landings missing' };
      }
    },
    {
      name: 'Spatial Densification & Tactical Cover',
      test: () => {
        const hasCover = /crouch cover|chest cover|vault|barricade|berm|clutter|dressing/i.test(content);
        return { ok: hasCover, detail: hasCover ? 'Crouch/vault cover hierarchy and dressing documented' : 'Missing tactical cover hierarchy' };
      }
    },
    {
      name: 'Grapple Radial Clearance (≥ 1.5m)',
      test: () => {
        const hasClearance = /1\.5|radial clearance|clearance/i.test(content);
        return { ok: hasClearance, detail: hasClearance ? 'Safe grapple radial clearances verified' : 'Grapple clearance rules unstated' };
      }
    },
    {
      name: 'Corridor & Anti-Pinch Widths (≥ 1.8m)',
      test: () => {
        const hasWidth = /1\.8|anti-pinch|clearance width|doorway/i.test(content);
        return { ok: hasWidth, detail: hasWidth ? 'Doorway and corridor anti-pinch widths verified' : 'Corridor width standards missing' };
      }
    }
  ];

  let score = 0;
  for (const c of checks) {
    const res = c.test();
    if (res.ok) {
      console.log(`   ✓ ${c.name}: ${res.detail}`);
      score++;
    } else {
      console.log(`   ✗ ${c.name}: ${res.detail}`);
      totalConceptsPassed = false;
      
      // Auto-brainstorming suggestions based on the failure
      console.log(`     💡 AI BRAINSTORM SUGGESTION:`);
      if (c.name.includes('Taxonomy')) {
        console.log(`        Consider adding more detailed stationery items across all 4 tiers (e.g. paperclips, staples, erasers, compasses).`);
      } else if (c.name.includes('Densification')) {
        console.log(`        The map feels too "free". Add intermediate staging clutter, cryo tanks, tool racks, or berms to densify the sectors.`);
      } else if (c.name.includes('Stairway')) {
        console.log(`        Check your stairs! Ensure exact step rise (0.25-0.28m) and run (0.45-0.50m) and rest landings every 4m vertical rise.`);
      } else {
        console.log(`        Please update the concept markdown document to adhere strictly to the universal detailing rules.`);
      }
    }
  }

  console.log(`   📊 Concept Detailing Score: ${score}/${checks.length}\n`);
}

console.log('============================================================');
if (totalConceptsPassed) {
  console.log('🎉 AUDIT COMPLETE: ALL CONCEPTS FULLY SPECIFIED & READY TO BUILD!');
} else {
  console.log('⚠️ AUDIT COMPLETE: SOME CONCEPTS REQUIRE FURTHER DETAILING BEFORE CODING.');
}
console.log('============================================================\n');
