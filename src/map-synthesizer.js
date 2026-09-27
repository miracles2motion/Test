#!/usr/bin/env node
/**
 * Doodle Strike - Thematic Neural Synthesizer (Concept Creator & Master Architect)
 *
 * Generates exhaustive, 100% compliant Master Architectural Concept Specifications
 * across 4 specialized tactical sectors with bespoke thematic enemy rosters,
 * exact spatial coordinate envelopes, and living biro ballpoint metaphors.
 *
 * Uses the Dream Researcher to ensure zero hardcoded forest bias.
 *
 * Usage:
 *   node src/map-synthesizer.js <mapName> [themeCategory]
 *   npm run dream:synthesize pirate_cove maritime
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { researchMapTheme, synthesizeConceptDocument } from './dream-researcher.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONCEPTS_DIR = path.join(ROOT_DIR, 'map_concepts');

export function generateMasterConceptDoc(mapKey, title, themeKey) {
  const researched = researchMapTheme(mapKey, themeKey);
  if (title) researched.displayName = title;
  return synthesizeConceptDocument(researched);
}

// CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rawName = process.argv[2];
  const themeArg = (process.argv[3] || '').toLowerCase();

  if (!rawName) {
    console.error('Usage: node src/map-synthesizer.js <mapName> [themeCategory]');
    process.exit(1);
  }

  const key = rawName.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const displayName = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  fs.mkdirSync(CONCEPTS_DIR, { recursive: true });
  const filePath = path.join(CONCEPTS_DIR, `${key}.md`);
  const content = generateMasterConceptDoc(key, displayName, themeArg);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✨ Master Architectural Concept Specification synthesized: map_concepts/${key}.md (${content.split('\n').length} lines)`);
}
