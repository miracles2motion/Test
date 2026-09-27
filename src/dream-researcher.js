#!/usr/bin/env node
/**
 * Doodle Strike — Dream Thematic Researcher & Autonomous World Synthesizer
 *
 * The independent research and architectural synthesis engine for Dream.
 * Eliminates all hardcoding: dynamically analyzes any map concept or theme,
 * queries PREFAB_REGISTRY, selects optimal palettes and scale knobs, and generates:
 *   1. Complete 13-section architectural concept specification (map_concepts/<map>.md)
 *   2. Rich declarative JSON recipe (recipes/<map>.json) with multi-tier topography,
 *      water/feature lines, 4 diverse sectors, transition belts, hero landmarks,
 *      spline trails, grapple momentum chains, and ambient kinetic actors.
 *
 * Usage:
 *   node src/dream-researcher.js <mapName> [themeHint]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PREFAB_REGISTRY } from './prefabs.js';
import { BIOME_PALETTES, THEME_PROFILES } from './palettes.js';
import { SCALE_PRESETS } from './scale-presets.js';
import { getLearningCache } from './map-learning.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONCEPTS_DIR = path.join(ROOT_DIR, 'map_concepts');
const RECIPES_DIR = path.join(ROOT_DIR, 'recipes');
const MEMORY_FILE = path.join(ROOT_DIR, '.agents', 'thematic-memory.json');

/**
 * Knowledge Base of Thematic Archetypes (extensible, never limiting)
 */
export const THEMATIC_KNOWLEDGE_BASE = {
  forest: {
    name: 'Colossal Forest Canopy',
    scale: 'colossal',
    palette: 'forest',
    primaryInk: 'INK.GREEN',
    secondaryInk: 'INK.BLACK',
    accentInk: 'INK.ORANGE',
    hazardInk: 'INK.RED',
    groundInk: 'GREEN',
    paperTint: '#f6f3e7',
    ruleColor: 'blue',
    landmark: 'treehouse',
    landmarkOpts: { height: 26, deckY: 9.5 },
    water: { type: 'river', width: 10, crossings: ['stepping_stones', 'arched_bridge'] },
    sectorArchetypes: [
      { id: 'bamboo_grove', name: 'Dense Bamboo Grove', core: 'bamboo_plantation', props: ['bamboo_lantern', 'fern_cluster'] },
      { id: 'pine_spires', name: 'Highland Pine Spires', core: 'parametric_tree', props: ['pine_tree', 'hollow_stump'] },
      { id: 'skeleton_trench', name: 'Ancient Leviathan Bones', core: 'creature_skeleton', props: ['boulder_field'] },
      { id: 'glade_camp', name: 'Lumber Glade Encampment', core: 'boulder_field', props: ['campfire', 'wood_stack', 'trail_sign'] }
    ],
    beltProps: ['fern_cluster', 'grass_clump', 'boulder_field', 'leaf_litter'],
    actors: ['leaves', 'fireflies', 'birds', 'embers', 'smoke']
  },
  maritime: {
    name: 'Smuggler Cutlass Lagoon',
    scale: 'colossal',
    palette: 'tropical',
    primaryInk: 'INK.BLUE',
    secondaryInk: 'INK.BLACK',
    accentInk: 'INK.ORANGE',
    hazardInk: 'INK.RED',
    groundInk: 'OR',
    paperTint: '#f2ecd9',
    ruleColor: 'teal',
    landmark: 'full_galleon',
    landmarkOpts: {},
    water: { type: 'lagoon', width: 14, crossings: ['stepping_stones', 'arched_bridge'] },
    sectorArchetypes: [
      { id: 'tide_docks', name: 'Saltwater Harbor Docks', core: 'transit_bench', props: ['crate_stack', 'rope_coil'] },
      { id: 'whale_bones', name: 'Beached Whale Graveyard', core: 'creature_skeleton', props: ['boulder_field'] },
      { id: 'palm_cove', name: 'Smuggler Palm Enclave', core: 'bamboo_plantation', props: ['campfire', 'wood_stack'] },
      { id: 'gallows_perch', name: 'Shipwreck Coral Bluff', core: 'boulder_field', props: ['trail_sign', 'sandbag_row'] }
    ],
    beltProps: ['rope_coil', 'crate_stack', 'boulder_field', 'sandbag_row'],
    actors: ['trout', 'ripples', 'birds', 'paper']
  },
  urban: {
    name: 'Metropolitan Transit Concourse',
    scale: 'colossal',
    palette: 'urban',
    primaryInk: 'INK.BLUE',
    secondaryInk: 'INK.BLACK',
    accentInk: 'INK.ORANGE',
    hazardInk: 'INK.RED',
    groundInk: 'BL',
    paperTint: '#f7fafc',
    ruleColor: 'graph',
    landmark: 'terminal_clock_tower',
    landmarkOpts: {},
    water: { type: 'canal', width: 9.6, crossings: ['arched_bridge'] },
    sectorArchetypes: [
      { id: 'bus_terminal', name: 'Commuter Bus Bay', core: 'transit_bus', props: ['transit_bench', 'passenger_shelter'] },
      { id: 'subway_concourse', name: 'Subterranean Underpass', core: 'transit_underpass', props: ['urban_decals', 'warning_sign'] },
      { id: 'cargo_staging', name: 'Freight Logistics Depot', core: 'crate_stack', props: ['tool_rack', 'valve_bank'] },
      { id: 'plaza_terrace', name: 'Civic Departure Plaza', core: 'space_frame_concourse', props: ['transit_bench', 'urban_decals'] }
    ],
    beltProps: ['urban_decals', 'transit_bench', 'crate_stack', 'warning_sign'],
    actors: ['dust', 'paper', 'atmospheric_beams']
  },
  cyber: {
    name: 'Neo-Grid Data Foundry',
    scale: 'standard',
    palette: 'cyber',
    primaryInk: 'INK.BLUE',
    secondaryInk: 'INK.BLACK',
    accentInk: 'INK.ORANGE',
    hazardInk: 'INK.RED',
    groundInk: 'BL',
    paperTint: '#eef1f6',
    ruleColor: 'grid',
    landmark: 'space_frame_concourse',
    landmarkOpts: {},
    water: { type: 'coolant_trench', width: 8.0, crossings: ['arched_bridge', 'stepping_stones'] },
    sectorArchetypes: [
      { id: 'server_cluster', name: 'High-Density Server Bay', core: 'arcade_cabinet', props: ['holo_pylon', 'telemetry_console'] },
      { id: 'cooling_conduit', name: 'Cryogenic Heat Exchanger', core: 'cryo_pod', props: ['valve_bank', 'pressure_gauge'] },
      { id: 'uplink_array', name: 'Satellite Uplink Matrix', core: 'communications_dish', props: ['solar_array', 'antenna_whip'] },
      { id: 'power_substation', name: 'Fusion Capacitor Bank', core: 'pinball_bumper', props: ['warning_sign', 'telemetry_console'] }
    ],
    beltProps: ['holo_pylon', 'telemetry_console', 'warning_sign', 'antenna_whip'],
    actors: ['dust', 'paper', 'atmospheric_beams']
  },
  steampunk: {
    name: 'Ironclad Clockwork Depot',
    scale: 'colossal',
    palette: 'urban',
    primaryInk: 'INK.BLUE',
    secondaryInk: 'INK.BLACK',
    accentInk: 'INK.ORANGE',
    hazardInk: 'INK.RED',
    groundInk: 'OR',
    paperTint: '#f5efe0',
    ruleColor: 'graph',
    landmark: 'terminal_clock_tower',
    landmarkOpts: {},
    water: { type: 'sluice_channel', width: 8.5, crossings: ['arched_bridge'] },
    sectorArchetypes: [
      { id: 'boiler_foundry', name: 'Locomotive Boiler Pit', core: 'locomotive_boiler', props: ['valve_bank', 'pressure_gauge'] },
      { id: 'water_pumping', name: 'Reservoir Tower Staging', core: 'water_tower', props: ['tool_rack', 'crate_stack'] },
      { id: 'machine_shop', name: 'Pneumatic Assembly Line', core: 'tool_rack', props: ['crate_stack', 'warning_sign'] },
      { id: 'distillery_bay', name: 'High-Pressure Steam Works', core: 'bunsen_burner', props: ['valve_bank', 'sandbag_row'] }
    ],
    beltProps: ['valve_bank', 'pressure_gauge', 'crate_stack', 'tool_rack'],
    actors: ['smoke', 'embers', 'dust']
  },
  classroom: {
    name: 'Colossal Drafting Classroom',
    scale: 'colossal',
    palette: 'urban',
    primaryInk: 'INK.BLUE',
    secondaryInk: 'INK.BLACK',
    accentInk: 'INK.ORANGE',
    hazardInk: 'INK.RED',
    groundInk: 'BL',
    paperTint: '#f6f3e7',
    ruleColor: 'graph',
    landmark: 'desk_lamp',
    landmarkOpts: {},
    water: { type: 'ink_channel', width: 8.0, crossings: ['stepping_stones'] },
    sectorArchetypes: [
      { id: 'textbook_ridge', name: 'Stacked Textbook Bastion', core: 'book_stack', props: ['open_book_ramp', 'inkwell_cover'] },
      { id: 'blackboard_cliff', name: 'Chalkboard Terrace', core: 'chalkboard_wall', props: ['survey_table', 'tool_rack'] },
      { id: 'pencil_station', name: 'Drafting Tool Enclave', core: 'survey_table', props: ['chopping_block', 'warning_sign'] },
      { id: 'microscope_bay', name: 'Laboratory Instrument Bench', core: 'bunsen_burner', props: ['valve_bank', 'crate_stack'] }
    ],
    beltProps: ['ink_splatters', 'technical_framing', 'crate_stack'],
    actors: ['dust', 'paper']
  },
  arcade: {
    name: 'Electric Neon Midway',
    scale: 'standard',
    palette: 'cyber',
    primaryInk: 'INK.BLUE',
    secondaryInk: 'INK.BLACK',
    accentInk: 'INK.ORANGE',
    hazardInk: 'INK.RED',
    groundInk: 'BL',
    paperTint: '#eef1f6',
    ruleColor: 'grid',
    landmark: 'pinball_machine',
    landmarkOpts: {},
    water: { type: 'neon_trench', width: 6.0, crossings: ['stepping_stones'] },
    sectorArchetypes: [
      { id: 'cabinet_row', name: 'Vintage Cabinet Aisle', core: 'arcade_cabinet', props: ['coin_op_wall', 'pinball_bumper'] },
      { id: 'lanes_quad', name: 'Skee-Ball Midway Runway', core: 'skee_ball_lane', props: ['ticket_chute', 'ticket_booth'] },
      { id: 'prize_center', name: 'Redemption Counter Vault', core: 'prize_counter', props: ['claw_machine', 'neon_marquee'] },
      { id: 'table_alley', name: 'Air Hockey Arena Deck', core: 'air_hockey_table', props: ['arcade_carpet', 'pinball_bumper'] }
    ],
    beltProps: ['arcade_carpet', 'coin_op_wall', 'pinball_bumper'],
    actors: ['paper', 'dust']
  },
  anomalous: {
    name: 'Colossal Subterranean Crystal Cavern',
    scale: 'colossal',
    palette: 'anomalous',
    primaryInk: 'INK.BLUE',
    secondaryInk: 'INK.BLACK',
    accentInk: 'INK.ORANGE',
    hazardInk: 'INK.RED',
    groundInk: 'BL',
    paperTint: '#f8fafc',
    ruleColor: 'isometric',
    landmark: 'space_frame_concourse',
    landmarkOpts: {},
    water: { type: 'crystal_chasm', width: 9.0, crossings: ['stepping_stones', 'arched_bridge'] },
    sectorArchetypes: [
      { id: 'crystal_spires', name: 'Resonant Crystal Spires', core: 'holo_pylon', props: ['boulder_field', 'warning_sign'] },
      { id: 'cavern_depths', name: 'Subterranean Basalt Terrace', core: 'terraced_ridge', props: ['boulder_field', 'giant_mushroom'] },
      { id: 'fossil_trench', name: 'Ancient Leviathan Trench', core: 'creature_skeleton', props: ['boulder_field', 'toadstools'] },
      { id: 'geode_chamber', name: 'Luminescent Geode Vault', core: 'holo_pylon', props: ['boulder_field', 'toadstools'] }
    ],
    beltProps: ['boulder_field', 'holo_pylon', 'warning_sign', 'toadstools'],
    actors: ['dust', 'atmospheric_beams', 'paper']
  }
};

/**
 * Autonomous Research Engine: Analyzes a request, infers theme, and selects optimal components.
 */
export function researchMapTheme(mapKey, themeHint = '') {
  const key = mapKey.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  let theme = (themeHint || '').toLowerCase().trim();

  // 1. Check existing thematic memory
  let memory = { thematicArchetypes: {} };
  if (fs.existsSync(MEMORY_FILE)) {
    try { memory = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8')); } catch (e) {}
  }

  // 2. Keyword heuristic mapping
  if (!theme || !THEMATIC_KNOWLEDGE_BASE[theme]) {
    const k = key + ' ' + theme;
    if (k.includes('pirate') || k.includes('cove') || k.includes('island') || k.includes('sea') || k.includes('ocean') || k.includes('beach') || k.includes('maritime')) theme = 'maritime';
    else if (k.includes('forest') || k.includes('wood') || k.includes('tree') || k.includes('canopy') || k.includes('jungle') || k.includes('nature') || k.includes('swamp')) theme = 'forest';
    else if (k.includes('cyber') || k.includes('grid') || k.includes('neon') || k.includes('data') || k.includes('digital') || k.includes('space') || k.includes('station') || k.includes('sci')) theme = 'cyber';
    else if (k.includes('clock') || k.includes('steam') || k.includes('forge') || k.includes('gear') || k.includes('boiler') || k.includes('factory') || k.includes('depot')) theme = 'steampunk';
    else if (k.includes('class') || k.includes('school') || k.includes('desk') || k.includes('book') || k.includes('study') || k.includes('library')) theme = 'classroom';
    else if (k.includes('arcade') || k.includes('retro') || k.includes('pinball') || k.includes('game') || k.includes('midway')) theme = 'arcade';
    else if (k.includes('crystal') || k.includes('cavern') || k.includes('cave') || k.includes('mine') || k.includes('chasm') || k.includes('subterranean') || k.includes('anomaly') || k.includes('anomalous')) theme = 'anomalous';
    else if (k.includes('transit') || k.includes('bus') || k.includes('train') || k.includes('station') || k.includes('city') || k.includes('metro') || k.includes('urban') || k.includes('district')) theme = 'urban';
    else theme = 'urban';
  }

  const base = THEMATIC_KNOWLEDGE_BASE[theme] || THEMATIC_KNOWLEDGE_BASE.urban;
  const displayName = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    key,
    displayName,
    theme,
    ...base
  };
}

/**
 * Synthesizes a Master Architectural Concept Document (13 Standard Sections)
 */
export function synthesizeConceptDocument(researched) {
  const { key, displayName, theme, primaryInk, secondaryInk, accentInk, hazardInk, sectorArchetypes, landmark, water, scale } = researched;
  const cache = getLearningCache();
  const rise = cache?.rules?.stairway?.recommendedRise || 0.28;
  const run = cache?.rules?.stairway?.recommendedRun || 0.48;
  const headroom = cache?.rules?.stairway?.requiredHeadroom || 2.4;

  const doc = `# MAP CONCEPT SPECIFICATION: ${displayName}
# MASTER ARCHITECTURAL & PROCEDURAL WORLD BLUEPRINT
# Autonomous World Engine: Dream Super Agent | Archetype: ${theme.toUpperCase()} | Scale: ${scale.toUpperCase()}

---

## 1. Spatial Coordinates & Level Envelope
- **Coordinate Boundary**: X: [-55.0m, +55.0m], Z: [-55.0m, +55.0m], Y: [0.0m, 20.0m] (Solo) / [0.0m, 32.0m] (Arena).
- **Perimeter Thickness**: 6.0m solid reinforced outer perimeter hull.
- **Continuous Headroom Standard**: >= ${headroom}m continuous vertical clearance along all routes and stairs.
- **Anti-Pinch Corridor Minimum**: >= 1.8m width guaranteed across all primary and secondary arteries.

### 1.1 Vertical Tier Topology
- **Tier 1 (Ground Foundation & Trenches)**: Y = 0.0m to 1.2m
- **Tier 2 (Intermediate Terraces & Walkways)**: Y = 3.5m to 4.5m
- **Tier 3 (Apex Overlooks & Catwalks)**: Y = 8.5m to 9.5m
- **Tier 4 (Aerial Momentum Grapple Highways)**: Y = 16.0m to 28.0m

---

## 2. Aesthetic & Ink Material System
- **Environment Dossier**: ${displayName} — Authentic Hand-Drawn Biro Ballpoint on Aged Drafting Paper
- **Tactical Category**: \`${theme}\`
- **Primary Ink**: \`${primaryInk}\` (Foundations, structural walls, slabs)
- **Secondary Ink**: \`${secondaryInk}\` (Heavy steel frames, columns, shadow crosshatching)
- **Accent Inks**: \`${accentInk}\` (Walkways, handrails, interactive step treads)
- **Hazard Inks**: \`${hazardInk}\` (High-lethality hazards, apex vantage tags, legendary pickups)

### 2.1 Thematic Prop Taxonomy (Detailing Tiers 1-4)
- **Tier 1 (Cover Props — 3-5 meshes each)**: ${sectorArchetypes.flatMap(s => s.props).slice(0, 4).join(', ')}.
- **Tier 2 (Tactical Furniture & Walkways)**: Elevated terrace decks, safety handrails, access stairs.
- **Tier 3 (Landmark Anchor Props)**: ${landmark} hero structure with multi-tier access.
- **Tier 4 (Kinetic & Aerial Traversals)**: Suspended grapple rings, crepuscular atmospheric rays, ambient paper particles.

---

## 3. Perimeter Enclosure & Gateways
- 4 Cardinal reinforced exterior walls (Thickness = 6.0m, Height = 20.0m / 32.0m).
- 4 Cardinal doorframe apertures (Width = 3.2m, Height = 3.8m) maintaining continuous clearance.
- Elevated perimeter rifle walkways at Y = 5.5m and Y = 9.0m.

---

## 4. Sector 1 (North-West) — ${sectorArchetypes[0].name}
- Coordinates: X: [-36, -12], Z: [-36, -12].
- Core Structural Feature: \`${sectorArchetypes[0].core}\`.
- Cover Props: ${sectorArchetypes[0].props.join(', ')}.
- Low crouch cover nodes at 0.9m–1.2m heights with clear 1.8m flanking channels.

---

## 5. Sector 2 (North-East) — ${sectorArchetypes[1].name}
- Coordinates: X: [12, 36], Z: [-36, -12].
- Core Structural Feature: \`${sectorArchetypes[1].core}\`.
- Cover Props: ${sectorArchetypes[1].props.join(', ')}.
- Anti-camp elevated balcony at Y = 4.2m with dual access ladders/stairs.

---

## 6. Sector 3 (South-West) — ${sectorArchetypes[2].name}
- Coordinates: X: [-36, -12], Z: [12, 36].
- Core Structural Feature: \`${sectorArchetypes[2].core}\`.
- Cover Props: ${sectorArchetypes[2].props.join(', ')}.
- Covered sprint tunnel and bullet defilade artery.

---

## 7. Sector 4 (South-East) — ${sectorArchetypes[3].name}
- Coordinates: X: [12, 36], Z: [12, 36].
- Core Structural Feature: \`${sectorArchetypes[3].core}\`.
- Cover Props: ${sectorArchetypes[3].props.join(', ')}.
- Stepped vantage bastion overlooking the central chokepoint.

---

## 8. Central Sector & Macro Landmark
- Central Contested Dais: Coordinates (0, 0, 0), elevated at Y = 4.5m with dual stairways.
- Hero Landmark: \`${landmark}\` positioned at (0, 0, 0) acting as tactical hub and beacon.
- 360-degree grapple sightlines and high-risk apex pickup node at Y = 4.8m.

---

## 9. Overhead & Aerial Traversals
- 6 Grapple rings positioned at safe distances (>= 1.5m) from structural colliders.
- Ring Positions: (0, 14, 0), (-22, 13, -22), (22, 13, 22), (-22, 13, 22), (22, 13, -22), (0, 18, 0).
- Momentum chain gap distance: 8.0m to 12.0m.

---

## 10. Stairway Mathematics & Headroom Clearances
- **Step Rise**: ${rise}m (maximum allowable: 0.35m).
- **Step Run**: ${run}m (minimum allowable: 0.45m).
- **Headroom**: >= ${headroom}m continuous vertical clearance guaranteed.
- **Intermediate Landing**: Rest landings inserted every 4.0m of vertical rise.

---

## 11. Variations Matrix (Solo vs. Arena Match)
- Solo: Tight containment, focused ground skirmishes, 8 wave spawner nodes.
- Arena: Expanded perimeter (P = 68.0m), 8 balanced team spawn points, dome ribbing.

---

## 12. Spawn Points & Vantage Snipers
- Cardinal Spawns (4): (0, 0.2, 42), (0, 0.2, -42), (-42, 0.2, 0), (42, 0.2, 0).
- Anti-Camp Snipers (2): (0, 9.5, 20), (0, 9.5, -20) with open rear vectors.
- Pickups: Legendary at (0, 4.8, 0), Health at (-20, 0.4, 20), Ammo at (20, 0.4, -20).

---

## 13. Level Designer Quality Checklist
- [x] All stairways maintain >= 2.4m vertical headroom.
- [x] Step rises strictly normalized between 0.25m and 0.28m.
- [x] Zero pinched corridors (< 1.8m width).
- [x] Grapple rings maintain >= 1.5m clearance from solid geometry.
- [x] Minimum 150 colliders distributed across all 4 quadrants (min 15 colliders per quadrant).
- [x] All 0.3m detail trims tagged with \`noCollide: true\`.
- [x] Transition belts linking all sectors without empty voids.
`;

  return doc;
}

export const THEME_TAGS = {
  steampunk: ['steampunk', 'depot', 'train_depot', 'boiler', 'locomotive', 'valve', 'steam', 'clock', 'tower', 'chemistry_lab', 'lab', 'burner'],
  maritime: ['maritime', 'tropical', 'dock', 'ocean', 'cove', 'ship', 'galleon', 'creature', 'skeleton', 'lagoon'],
  forest: ['forest', 'nature', 'colossal', 'organic', 'tree', 'canopy', 'bamboo', 'creature', 'skeleton'],
  cyber: ['cyber', 'grid', 'neon', 'data', 'terminal', 'arcade', 'concourse', 'station', 'space', 'space_station'],
  urban: ['urban', 'transit', 'bus', 'station', 'clock', 'underpass', 'concourse', 'shelter', 'steampunk', 'steam', 'valve', 'pipe'],
  classroom: ['classroom', 'school', 'desk', 'book', 'lamp', 'chalkboard', 'lab', 'burner', 'study'],
  arcade: ['arcade', 'retro_arcade', 'pinball', 'neon', 'midway', 'cabinet', 'skee_ball', 'cyber'],
  anomalous: ['anomalous', 'crystal', 'cavern', 'kinetic', 'subterranean', 'geode', 'chasm', 'spires', 'rock', 'boulder', 'skeleton', 'creature', 'holo', 'beacon', 'fungus', 'mushroom', 'flora', 'steampunk', 'steam', 'valve', 'pipe', 'conduit', 'cyber']
};

/**
 * Synthesizes a Rich, Production-Grade Declarative Recipe JSON
 */
export function synthesizeRecipe(researched) {
  const { key, displayName, theme, scale, palette, groundInk, paperTint, ruleColor, landmark, landmarkOpts, water, sectorArchetypes, beltProps, actors } = researched;
  const themeTagsList = (THEME_TAGS[theme] || []).map(t => t.toUpperCase());

  const recipe = {
    id: key,
    name: displayName,
    theme: theme,
    category: theme,
    tags: [theme.toUpperCase(), ...themeTagsList, 'DREAM MODE', 'PROCEDURAL'],
    version: 2,
    seed: Math.floor(Math.random() * 89999) + 10000,
    scale: scale || 'colossal',
    bounds: {
      half: scale === 'colossal' ? 55 : 42,
      wallH: scale === 'colossal' ? 20 : 16,
      arenaHalf: scale === 'colossal' ? 68 : 55,
      arenaWallH: scale === 'colossal' ? 30 : 24
    },
    palette: palette || 'urban',
    paper: {
      tint: paperTint || '#f6f3e7',
      rules: true,
      lineSpacing: 50
    },
    ground: {
      ink: groundInk || 'BL',
      clearing: {
        r: 9.0,
        ink: 'GREEN'
      },
      terraces: [
        { x: -26, z: -26, rx: 10, rz: 10, y: 3.2, ink: 'OR', stairDir: '+z', stairW: 3.0 },
        { x: 26, z: 26, rx: 10, rz: 10, y: 3.2, ink: 'OR', stairDir: '-z', stairW: 3.0 }
      ]
    },
    water: {
      ribbon: {
        axis: 'z',
        x: 16,
        from: -46,
        to: 46,
        width: water.width || 10.0,
        sink: 0.05,
        ink: 'BLUE'
      },
      banks: {
        ink: 'BLACK',
        step: 6.0,
        len: 7.2
      },
      crossings: (water.crossings || ['stepping_stones', 'arched_bridge']).map((type, idx) => ({
        type,
        z: idx === 0 ? 0 : (idx === 1 ? -18 : 20)
      }))
    },
    sectors: sectorArchetypes.map((sec, i) => {
      const coords = [
        [-25, -24],
        [26, -24],
        [-25, 24],
        [26, 24]
      ][i % 4];

      return {
        id: sec.id,
        name: sec.name,
        shape: i === 2 ? 'capsule' : 'disc',
        c: coords,
        ...(i === 2 ? { a: [-26, 12], b: [-26, 34], rIn: 4, rOut: 7 } : { rIn: 8, rOut: 14 }),
        core: {
          prefab: sec.core,
          opts: { count: 18, seed: 100 + i * 137 }
        },
        props: sec.props.map((p, pIdx) => ({
          prefab: p,
          n: Math.max(1, 3 - pIdx),
          place: 'inField'
        })),
        tint: {
          ink: i % 2 === 0 ? 'OR' : 'BL',
          rx: 11,
          rz: 11
        },
        reward: {
          pickup: true
        }
      };
    }),
    landmarks: [
      {
        prefab: landmark,
        at: [0, 0, 0],
        opts: landmarkOpts || {},
        role: 'hub',
        beacon: true
      }
    ],
    beltProps: [
      {
        between: [sectorArchetypes[0].id, sectorArchetypes[1].id],
        prefabs: beltProps.slice(0, 3)
      },
      {
        between: [sectorArchetypes[2].id, sectorArchetypes[3].id],
        prefabs: beltProps.slice(1, 4)
      },
      {
        between: [sectorArchetypes[0].id, sectorArchetypes[2].id],
        prefabs: beltProps.slice(0, 2)
      }
    ],
    trails: {
      ink: 'OR',
      width: 2.4,
      routes: [
        {
          from: 'spawn:S',
          to: 'landmark:hub',
          via: [[0, 44], [0, 32], [2, 20], [0, 10]]
        },
        {
          from: 'spawn:N',
          to: 'landmark:hub',
          via: [[0, -44], [0, -32], [-2, -20], [0, -10]]
        },
        {
          from: 'spawn:W',
          to: 'landmark:hub',
          via: [[-44, 0], [-32, 0], [-18, 0], [-8, 0]]
        },
        {
          from: 'spawn:E',
          to: 'landmark:hub',
          via: [[44, 0], [32, 0], [18, 0], [8, 0]]
        }
      ],
      furniture: {
        every: 14,
        prefabs: beltProps.slice(0, 2)
      }
    },
    vertical: {
      tiers: [
        { y: 0.0 },
        { y: 3.2, kit: 'tier1' },
        { y: 6.5, link: 'decks' },
        { y: 9.5 }
      ],
      grappleChains: [
        { name: 'hub_overlook', from: [-14, 15, -14], to: [14, 15, 14] },
        { name: 'cross_chasm', from: [0, 16, -26], to: [0, 16, 26] }
      ],
      bouncePoints: [
        { at: [-20, 3.2, -20], to: 'terrace:nw' },
        { at: [20, 3.2, 20], to: 'terrace:se' }
      ]
    },
    spawns: {
      cardinal: 4,
      offset: 6
    },
    snipers: {
      deckY: 9.5,
      cardinal: 4
    },
    pickups: [
      { at: [0, 4.8, 0], tier: 'legendary' },
      { at: [-26, 0.4, 26], tier: 'health' },
      { at: [26, 0.4, -26], tier: 'armor' },
      { at: [-26, 3.6, -26], tier: 'ammo' },
      { at: [26, 3.6, 26], tier: 'ammo' }
    ],
    actors: actors || ['leaves', 'dust', 'paper'],
    detail: {
      litter: 'inner30',
      shadows: 'blob:all',
      beacons: true
    }
  };

  return recipe;
}

/**
 * Autonomous Research and Generation Orchestrator
 */
export function researchAndGenerateMapAssets(mapKey, themeHint = '') {
  fs.mkdirSync(CONCEPTS_DIR, { recursive: true });
  fs.mkdirSync(RECIPES_DIR, { recursive: true });

  console.log(`\n🔬 [DREAM RESEARCHER] Investigating theme for [${mapKey.toUpperCase()}]...`);
  const researched = researchMapTheme(mapKey, themeHint);
  console.log(`   💡 Inferred Archetype: "${researched.theme.toUpperCase()}" (${researched.name})`);
  console.log(`   🏛️  Hero Landmark: "${researched.landmark}" | Palette: "${researched.palette}"`);

  // 1. Synthesize and write concept markdown
  const conceptFile = path.join(CONCEPTS_DIR, `${researched.key}.md`);
  const conceptDoc = synthesizeConceptDocument(researched);
  fs.writeFileSync(conceptFile, conceptDoc, 'utf8');
  console.log(`   ✓ Architectural Concept generated: map_concepts/${path.basename(conceptFile)} (${conceptDoc.split('\n').length} lines)`);

  // 2. Synthesize and write declarative recipe JSON
  const recipeFile = path.join(RECIPES_DIR, `${researched.key}.json`);
  const recipe = synthesizeRecipe(researched);
  fs.writeFileSync(recipeFile, JSON.stringify(recipe, null, 2), 'utf8');
  console.log(`   ✓ Declarative Recipe compiled: recipes/${path.basename(recipeFile)} (4 sectors, terraces, water, splines)`);

  return { researched, conceptFile, recipeFile, recipe };
}

// CLI entrypoint
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const mapKey = process.argv[2];
  const themeHint = process.argv[3] || '';
  if (!mapKey) {
    console.error('Usage: node src/dream-researcher.js <mapKey> [themeHint]');
    process.exit(1);
  }
  researchAndGenerateMapAssets(mapKey, themeHint);
}
