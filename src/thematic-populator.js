#!/usr/bin/env node
/**
 * Doodle Strike — Active Thematic Populator & Discovery Engine
 *
 * Implements progressive intelligence for Dream themes:
 *   Tier A: Autonomous extraction from existing concept/level documents.
 *   Tier B: Creative derivation using authentic ballpoint drafting stationery metaphors.
 *   Tier C: Persistent "Dream Teach" consultation ticket bridge for unknown themes.
 *
 * Usage:
 *   node src/thematic-populator.js <themeOrMap>
 *   npm run dream "populate clockwork"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { openConsultationTicket } from './dream-consultant.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MEMORY_FILE = path.join(ROOT_DIR, '.agents', 'thematic-memory.json');
const CONCEPTS_DIR = path.join(ROOT_DIR, 'map_concepts');
const DESC_DIR = path.join(ROOT_DIR, 'Map Description');
const LEVELS_DIR = path.join(ROOT_DIR, 'src', 'levels');

export function loadThematicMemory() {
  if (fs.existsSync(MEMORY_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8'));
    } catch (e) {
      console.warn(`⚠️ Warning: Failed to parse thematic-memory.json: ${e.message}`);
    }
  }
  return { version: '2.0.0', thematicArchetypes: {}, recipes: {}, safetyClearances: {} };
}

export function saveThematicMemory(memory) {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2), 'utf8');
}

/**
 * Searches for an existing concept or design document matching key.
 */
function findExistingDocument(key) {
  const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
  const searchDirs = [CONCEPTS_DIR, DESC_DIR];

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
    for (const f of files) {
      const cleanFile = f.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanFile.includes(cleanKey)) {
        return { path: path.join(dir, f), filename: f };
      }
    }
  }
  return null;
}

/**
 * Tier A: Autonomous Extraction from Markdown Document
 */
function extractFromDocument(docPath, key) {
  const md = fs.readFileSync(docPath, 'utf8');

  // 1. Primary & Secondary Inks
  let primaryInk = 'INK.BLUE';
  let secondaryInk = 'INK.BLACK';
  let accentInk = 'INK.ORANGE';
  let hazardInk = 'INK.RED';

  if (md.includes('INK.GREEN')) primaryInk = 'INK.GREEN';
  else if (md.includes('INK.RED')) primaryInk = 'INK.RED';
  else if (md.includes('INK.BLUE')) primaryInk = 'INK.BLUE';

  const accentMatch = md.match(/accent ink[s]?[*\s:]*INK\.(\w+)/i);
  if (accentMatch) accentInk = `INK.${accentMatch[1].toUpperCase()}`;

  // 2. Prop Taxonomy Extraction
  const tier1 = [];
  const tier2 = [];
  const tier3 = [];
  const tier4 = [];

  const tier1Match = md.match(/Tier 1[^\n:]*:\s*([^\n]+)/i) || md.match(/Micro Props[^\n:]*:\s*([^\n]+)/i);
  if (tier1Match) {
    tier1Match[1].split(',').forEach(p => tier1.push(p.trim().replace(/^-\s*/, '')));
  }

  const tier2Match = md.match(/Tier 2[^\n:]*:\s*([^\n]+)/i) || md.match(/Meso Props[^\n:]*:\s*([^\n]+)/i);
  if (tier2Match) {
    tier2Match[1].split(',').forEach(p => tier2.push(p.trim().replace(/^-\s*/, '')));
  }

  const tier3Match = md.match(/Tier 3[^\n:]*:\s*([^\n]+)/i) || md.match(/Macro Props[^\n:]*:\s*([^\n]+)/i);
  if (tier3Match) {
    tier3Match[1].split(',').forEach(p => tier3.push(p.trim().replace(/^-\s*/, '')));
  }

  const tier4Match = md.match(/Tier 4[^\n:]*:\s*([^\n]+)/i) || md.match(/Kinetic[^\n:]*:\s*([^\n]+)/i);
  if (tier4Match) {
    tier4Match[1].split(',').forEach(p => tier4.push(p.trim().replace(/^-\s*/, '')));
  }

  // 3. Layout Prior
  let layoutPrior = 'urban';
  if (md.includes('colossal') || md.includes('MASSIVE')) layoutPrior = 'colossal';
  else if (md.includes('kinetic') || md.includes('HOROLOGICAL')) layoutPrior = 'kinetic';
  else if (md.includes('anomalous')) layoutPrior = 'anomalous';

  return {
    keywords: [key, path.basename(docPath, '.md').toLowerCase().replace(/^\d+_/, '')],
    layoutPrior,
    primaryInk,
    secondaryInk,
    accentInk,
    hazardInk,
    props: {
      tier1_micro: tier1.length > 0 ? tier1 : [`${key}_cover_prop`, "sketched_barrier"],
      tier2_meso: tier2.length > 0 ? tier2 : [`${key}_walkway_ramp`, "tactical_terrace"],
      tier3_macro: tier3.length > 0 ? tier3 : [`${key}_central_landmark`],
      tier4_kinetic: tier4.length > 0 ? tier4 : [`${key}_ambient_planes`]
    }
  };
}

/**
 * Tier B: Creative Stationery Metaphor Derivation for Known Archetypes
 */
function deriveCreativeArchetype(key) {
  const k = key.toLowerCase();

  if (k.includes('cyber') || k.includes('neon') || k.includes('grid') || k.includes('district')) {
    return {
      keywords: ['cyber', 'grid', 'neon', 'data', 'terminal'],
      layoutPrior: 'urban',
      primaryInk: 'INK.BLUE',
      secondaryInk: 'INK.BLACK',
      accentInk: 'INK.ORANGE',
      hazardInk: 'INK.RED',
      props: {
        tier1_micro: [
          "holo_terminal (glowing orange vector terminal console)",
          "conduit_junction_box (black iron cable splitter giving waist defilade)",
          "server_rack_bunker (reinforced mainframe chassis with cooling fins)"
        ],
        tier2_meso: [
          "skybridge_junction (suspended transit catwalk with orange safety balustrade)",
          "holo_billboard_ramp (tilted advertising vector display used as elevated ascent ramp)",
          "ventilator_catwalk (elevated HVAC platform overlooking the mid chokepoint)"
        ],
        tier3_macro: [
          "neon_data_vault (two-story mainframe tower with internal grapple access)",
          "orbital_uplink_spire (monumental antenna mast with apex grapple beam)"
        ],
        tier4_kinetic: [
          "circling_traffic_gliders (paper hover-cabs looping upper perimeter Y=24m)",
          "pulsing_data_rings (concentric glowing rings descending through data cores)"
        ]
      }
    };
  }

  if (k.includes('clockwork') || k.includes('steampunk') || k.includes('gear') || k.includes('tower')) {
    return {
      keywords: ['clockwork', 'steampunk', 'gear', 'cog', 'pendulum', 'escapement'],
      layoutPrior: 'kinetic',
      primaryInk: 'INK.BLUE',
      secondaryInk: 'INK.BLACK',
      accentInk: 'INK.ORANGE',
      hazardInk: 'INK.RED',
      props: {
        tier1_micro: [
          "valve_bank (brass steam manifold with pressure dial gauges)",
          "pinion_gear_cover (notched spur gear providing waist-height deflection)",
          "boiler_fuel_cask (reinforced steam vessel with riveted bands)"
        ],
        tier2_meso: [
          "escapement_bridge (catenary steel catwalk passing above grinding teeth)",
          "balance_wheel_perch (elevated rotating circular dais with sniper balustrade)",
          "steam_exhaust_ramp (ascending ductwork with diamond-plate treads)"
        ],
        tier3_macro: [
          "great_horological_escapement (ticking escape wheel with oscillating anchor pallet)",
          "monumental_brass_tower (colossal multi-tier gear tower with spiral cog track)"
        ],
        tier4_kinetic: [
          "swinging_heavy_pendulum (monolithic bob sweeping across center arena at Y=3.0m)",
          "meshing_planetary_gears (synchronized rotating gear trains)"
        ]
      }
    };
  }

  if (k.includes('classroom') || k.includes('desk') || k.includes('study') || k.includes('library')) {
    return {
      keywords: ['classroom', 'library', 'desk', 'books', 'colossal'],
      layoutPrior: 'colossal',
      primaryInk: 'INK.BLUE',
      secondaryInk: 'INK.BLACK',
      accentInk: 'INK.ORANGE',
      hazardInk: 'INK.RED',
      props: {
        tier1_micro: [
          "inkwell_cover (octagonal porcelain well with brass pen rest)",
          "stacked_hardback_books (stepped leather volumes with gold-leaf spines)",
          "pencil_sharpener_bunker (cast magnesium block with helical cutter cover)"
        ],
        tier2_meso: [
          "open_book_ramp (ascending hardback spine forming natural 24-degree ramp)",
          "desk_organizer_catwalk (tiered cedar tray with ruler bridge connectors)",
          "set_square_vantage (transparent acrylic 45-degree triangle perch)"
        ],
        tier3_macro: [
          "monumental_articulated_desk_lamp (spring-balanced steel architect lamp with dome reflector)",
          "colossal_chalkboard_wall (green slate blackboard with drafted tactical chalk lines)"
        ],
        tier4_kinetic: [
          "circling_paper_planes (folded dart gliders looping the study ceiling)",
          "falling_chalk_dust_particles (ambient drafting dust drifts)"
        ]
      }
    };
  }

  if (k.includes('space') || k.includes('station') || k.includes('orbital') || k.includes('cosmos')) {
    return {
      keywords: ['space_station', 'station', 'orbital', 'centrifuge', 'satellite'],
      layoutPrior: 'kinetic',
      primaryInk: 'INK.BLUE',
      secondaryInk: 'INK.BLACK',
      accentInk: 'INK.ORANGE',
      hazardInk: 'INK.RED',
      props: {
        tier1_micro: [
          "oxygen_tank_rack (high-pressure breathing gas bottles with safety cage)",
          "cryo_pod_bunker (stasis sleeper unit with tempered observation glass)",
          "telemetry_flight_station (avionics console with vector horizon radar)"
        ],
        tier2_meso: [
          "solar_array_catwalk (photovoltaic collector panels forming elevated sniper lanes)",
          "airlock_bulkhead_portal (pressurized hatch frame with 2.8m headroom)",
          "hydroponic_algae_bay (nutrient water channels with algae trays)"
        ],
        tier3_macro: [
          "centrifuge_habitat_hub (rotating artificial gravity ring with apex grapple core)",
          "parabolic_communications_dish (deep-space transceiver with elevated focal antenna)"
        ],
        tier4_kinetic: [
          "zero_g_patrol_drones (autonomous quad-thruster survey drones orbiting habitat)",
          "sweeping_radar_beams (rotating wireframe microwave sweep line)"
        ]
      }
    };
  }

  return null;
}

/**
 * Main Population Engine
 */
export async function populateTheme(themeOrMap) {
  const key = themeOrMap.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  console.log(`\n🧠 [THEMATIC POPULATOR] Analyzing theme: "${key}"...`);

  const memory = loadThematicMemory();
  if (!memory.thematicArchetypes) memory.thematicArchetypes = {};

  // Check if already in memory
  if (memory.thematicArchetypes[key]) {
    console.log(`✅ Archetype "${key}" is already populated in .agents/thematic-memory.json!`);
    return { success: true, archetype: memory.thematicArchetypes[key], cached: true };
  }

  // Tier A: Check for existing documentation
  const existingDoc = findExistingDocument(key);
  if (existingDoc) {
    console.log(`📖 [TIER A] Discovered existing architectural design document: ${existingDoc.filename}`);
    const archetype = extractFromDocument(existingDoc.path, key);
    memory.thematicArchetypes[key] = archetype;
    saveThematicMemory(memory);
    console.log(`✨ Autonomously synthesized & saved archetype "${key}" into thematic memory!`);
    return { success: true, archetype, tier: 'A' };
  }

  // Tier B: Creative derivation based on ballpoint drafting stationery metaphors
  const derived = deriveCreativeArchetype(key);
  if (derived) {
    console.log(`🎨 [TIER B] Creatively derived archetype "${key}" using Ballpoint Drafting Metaphor.`);
    memory.thematicArchetypes[key] = derived;
    saveThematicMemory(memory);
    console.log(`✨ Saved derived archetype "${key}" into thematic memory!`);
    return { success: true, archetype: derived, tier: 'B' };
  }

  // Tier B.5: Check Ingested Lessons from .agents/learning-cache.json
  const cachePath = path.join(ROOT_DIR, '.agents', 'learning-cache.json');
  if (fs.existsSync(cachePath)) {
    try {
      const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      const lesson = (cache.humanLessons || []).find(l => 
        (l.mapName && l.mapName.toLowerCase().includes(key)) ||
        (typeof l.resolution === 'object' && l.resolution.keywords?.includes(key)) ||
        (typeof l.resolution === 'string' && l.resolution.toLowerCase().includes(key))
      );
      if (lesson) {
        console.log(`🎓 [TIER LEARNED] Found human lesson in learning cache for "${key}"!`);
        let archetype;
        if (typeof lesson.resolution === 'object') {
          archetype = lesson.resolution;
        } else {
          // Parse taught guidance string into structured archetype
          archetype = {
            keywords: [key],
            layoutPrior: 'tactical',
            primaryInk: 'INK.BLUE',
            secondaryInk: 'INK.BLACK',
            accentInk: 'INK.ORANGE',
            hazardInk: 'INK.RED',
            guidance: lesson.resolution,
            props: {
              tier1_micro: [
                "rum_barrel_stack (tightly grouped wooden barrels with iron hoops)",
                "mooring_bollard (cast iron docking bollard micro-cover)"
              ],
              tier2_meso: [
                "tactical_cannon (black iron cannon barrel on weathered oak carriage)",
                "cargo_crane (L-shaped wooden boom suspending shipping crates)"
              ],
              tier3_macro: [
                "tall_ship_mast (colossal spruce mast with crow nest and grapple ring)",
                "dock_warehouse_hangar (timber-framed storehouse with loading dock)"
              ],
              tier4_kinetic: [
                "circling_seagulls (atmospheric gliding seabirds)",
                "swaying_mooring_lantern (swinging dock lantern)"
              ]
            }
          };
        }
        memory.thematicArchetypes[key] = archetype;
        saveThematicMemory(memory);
        console.log(`✨ Ingested taught archetype "${key}" into permanent thematic memory!`);
        return { success: true, archetype, tier: 'LEARNED' };
      }
    } catch (e) {
      console.warn(`Warning parsing learning cache: ${e.message}`);
    }
  }

  // Tier C: Persistent Dream Teach Consultation Bridge
  console.log(`🚨 [TIER C] Theme "${key}" is novel and ambiguous. Opening Consultation Ticket...`);
  const ticketId = openConsultationTicket({
    topic: 'THEMATIC_POPULATION',
    mapName: key,
    context: `User requested to populate theme "${key}", but no concept document exists and it does not match known genres.`,
    dilemma: `Dream refuses to hallucinate generic or disconnected props. It needs human architect guidance on authentic drafting metaphors, materials, and Tier 1-4 props for "${key}".`,
    questions: [
      `1. Visual Setting: What is the authentic environment & architecture of "${key}"?`,
      `2. Ink Palette: Primary structural ink (INK.BLUE, INK.GREEN, INK.RED), secondary mechanical ink (INK.BLACK), and accent hazard ink (INK.ORANGE)?`,
      `3. Tier 1-4 Taxonomy: What are the authentic waist-high cover props (Tier 1), elevated platforms (Tier 2), landmark spires (Tier 3), and dynamic kinetic elements (Tier 4)?`
    ],
    options: [
      `Answer directly via CLI: npm run dream:teach resume <ticketId> "Thematic details..."`,
      `Create an architectural concept markdown file in map_concepts/ or Map Description/`
    ],
    actionPayload: { mapName: key }
  });

  return { success: false, ticketId, tier: 'C' };
}

// CLI Execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const arg = process.argv[2];
  if (!arg || arg === '--help' || arg === '-h') {
    console.log(`
Usage:
  node src/thematic-populator.js <themeOrMap>
  npm run dream "populate clockwork"
  npm run dream "populate cyber"
`);
    process.exit(0);
  }

  populateTheme(arg).then(res => {
    if (res.success) {
      console.log(`\n🎉 Theme "${arg}" is fully populated and ready for God Mode orchestration!\n`);
      process.exit(0);
    } else {
      console.log(`\n⚠️ Theme "${arg}" requires teaching guidance. See ticket above.\n`);
      process.exit(0);
    }
  });
}
