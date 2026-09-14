// src/rebuild/concept-interpreter.js
// Concept Document Interpreter for Dream Rebuild
// Finally parses Sections 4-8 into a machine-readable Zone Program.

import fs from 'node:fs';
import path from 'node:path';

function capture(text, regex, fallback = null) {
  const match = text.match(regex);
  return match ? match[1] : fallback;
}

function num(val, fallback = 0) {
  if (val === null || val === undefined) return fallback;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? fallback : parsed;
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

/**
 * Classifies the tactical role of a sector from its textual description.
 */
function classifyRole(heading, body) {
  const text = `${heading} ${body}`.toLowerCase();
  if (text.includes('spawn') || text.includes('staging') || text.includes('insertion')) return 'spawn';
  if (text.includes('sniper') || text.includes('perch') || text.includes('vantage') || text.includes('overlook')) return 'vantage';
  if (text.includes('cqb') || text.includes('corridor') || text.includes('hallway') || text.includes('alley') || text.includes('tunnel')) return 'cqb_corridor';
  if (text.includes('courtyard') || text.includes('plaza') || text.includes('square')) return 'courtyard';
  if (text.includes('arena') || text.includes('center') || text.includes('mid') || text.includes('hub')) return 'arena';
  if (text.includes('service') || text.includes('maintenance') || text.includes('hangar')) return 'service';
  return 'room';
}

/**
 * Parses dimensions like "20m x 15m" or "[24, 18]" from text.
 */
function parseFootprint(text, defaultW = 16, defaultD = 16) {
  const match = text.match(/(\d+(?:\.\d+)?)\s*(?:m|meters)?\s*[×x*]\s*(\d+(?:\.\d+)?)/i);
  if (match) {
    return [parseFloat(match[1]), parseFloat(match[2])];
  }
  return [defaultW, defaultD];
}

/**
 * Parses tier height from text (e.g. "Tier 2", "Y = 5.0m", "elevation 4.5m").
 */
function parseTierRef(text, tierTable = [0, 4.0, 8.5]) {
  const yMatch = text.match(/Y\s*=\s*([+\d.]+)/i) || text.match(/elevation\s*([+\d.]+)/i);
  if (yMatch) return parseFloat(yMatch[1]);
  if (/tier\s*3/i.test(text) && tierTable[2] !== undefined) return tierTable[2];
  if (/tier\s*2/i.test(text) && tierTable[1] !== undefined) return tierTable[1];
  return tierTable[0] || 0;
}

/**
 * Extracts sections 4 through 8 from markdown.
 */
function extractSectorSections(md) {
  const sections = [];
  const regex = /(?:^|\n)##\s*([4-8])\.\s*([^\n]+)([\s\S]*?)(?=(?:\n##\s*\d+\.|$))/gi;
  let match;
  while ((match = regex.exec(md)) !== null) {
    sections.push({
      num: parseInt(match[1], 10),
      heading: match[2].trim(),
      body: match[3].trim()
    });
  }
  return sections;
}

/**
 * Parse a concept markdown string into a typed Zone Program.
 * @param {string} md - Concept markdown content
 * @param {object} [themeDefaults] - Fallback theme parameters from thematic-memory.json
 * @returns {object} Typed Zone Program
 */
export function interpretConcept(md, themeDefaults = {}) {
  // 1. Extract bounds with decimal support
  const halfSpan = num(capture(md, /Half-Span[^\d]*(\d+(?:\.\d+)?)/i), 55);
  const wallHeight = num(capture(md, /Wall Height[^\d]*(\d+(?:\.\d+)?)/i), 18);

  // 2. Extract Tiers
  const tierTable = [0];
  const t2 = num(capture(md, /Tier 2[^\n]*Y\s*=\s*([+\d.]+)/i) || capture(md, /y\s*=\s*([+\d.]+)[^\n]*Tier 2/i), 4.0);
  const t3 = num(capture(md, /Tier 3[^\n]*Y\s*=\s*([+\d.]+)/i) || capture(md, /y\s*=\s*([+\d.]+)[^\n]*Tier 3/i), 8.5);
  tierTable.push(t2, t3);

  // 3. Extract Inks
  let primaryInk = 'BL';
  let accentInk = 'OR';
  if (/INK\.GREEN/i.test(md)) primaryInk = 'GR';
  else if (/INK\.RED/i.test(md)) primaryInk = 'RD';
  else if (/INK\.ORANGE/i.test(md)) primaryInk = 'OR';

  const prog = {
    bounds: { P: halfSpan, PH: wallHeight },
    tiers: tierTable,
    inks: { structure: primaryInk, accent: accentInk },
    strategyHint: themeDefaults.layoutPrior || 'arena_ring',
    zones: [],
    edges: []
  };

  // 4. Parse Sections 4-8
  const sectorSections = extractSectorSections(md);
  for (const sec of sectorSections) {
    const role = classifyRole(sec.heading, sec.body);
    const footprint = parseFootprint(sec.body, role === 'arena' ? 24 : 16, role === 'arena' ? 24 : 16);
    const tier = parseTierRef(sec.body, tierTable);

    prog.zones.push({
      id: `z_${sec.num}_${slugify(sec.heading)}`,
      role,
      name: sec.heading,
      footprint,
      tier,
      coverDensity: /high|dense/i.test(sec.body) ? 0.8 : (/low|sparse/i.test(sec.body) ? 0.3 : 0.5),
      wants: []
    });
  }

  // Fallback: If concept document is thin (< 4 zones), generate a guaranteed viable program
  if (prog.zones.length < 4) {
    prog.zones = [
      { id: 'z_mid', role: 'arena', name: 'Central Arena Hub', footprint: [24, 24], tier: 0, coverDensity: 0.6, wants: [] },
      { id: 'z_north', role: 'vantage', name: 'North Observation Deck', footprint: [18, 14], tier: t2, coverDensity: 0.5, wants: [] },
      { id: 'z_east', role: 'room', name: 'East Quarters', footprint: [16, 16], tier: 0, coverDensity: 0.7, wants: [] },
      { id: 'z_west', role: 'cqb_corridor', name: 'West Maintenance Alley', footprint: [8, 22], tier: 0, coverDensity: 0.8, wants: [] },
      { id: 'z_south', role: 'spawn', name: 'South Ingress Bay', footprint: [14, 14], tier: 0, coverDensity: 0.4, wants: [] }
    ];
  }

  return prog;
}
