# 🧠 DREAM SYSTEM — COMPLETE TECHNICAL AUDIT & CAPABILITY REPORT

**Project**: Doodle Strike  
**Date**: 2026-09-14  
**Purpose**: Feed to a powerful LLM for system upgrade recommendations  
**Scope**: Every module, data flow, template, limitation, and root cause of Dream's quality ceiling

---

## TABLE OF CONTENTS

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Module-by-Module Deep Dive](#2-module-by-module-deep-dive)
3. [Data Files & Memory Systems](#3-data-files--memory-systems)
4. [The Full Pipeline Execution Flow](#4-the-full-pipeline-execution-flow)
5. [Template Library Inventory](#5-template-library-inventory)
6. [Prefab System Inventory](#6-prefab-system-inventory)
7. [Quality Assurance & Audit Tools](#7-quality-assurance--audit-tools)
8. [Quantitative Comparison: Dream Output vs. Giant Classroom](#8-quantitative-comparison-dream-output-vs-giant-classroom)
9. [Root Cause Analysis: Why Dream Fails](#9-root-cause-analysis-why-dream-fails)
10. [Known Bugs & Technical Debt](#10-known-bugs--technical-debt)
11. [What Dream CANNOT Do Today](#11-what-dream-cannot-do-today)
12. [Geometry Primitive API Reference](#12-geometry-primitive-api-reference)
13. [File Manifest](#13-file-manifest)
14. [Architectural Upgrade Vectors & Design Challenges](#14-architectural-upgrade-vectors--design-challenges)
15. [Turnkey Meta-Prompt for External Frontier LLMs](#15-turnkey-meta-prompt-for-external-frontier-llms)

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

Dream is a **fully offline, zero-LLM, deterministic** procedural map generation pipeline for a 3D tactical shooter game (Doodle Strike) rendered through Three.js with a hand-drawn biro/ballpoint pen art style.

### High-Level Data Flow
```
User Command (CLI)
    │
    ▼
dream.js (NLP Router)
    │  ── Parses natural language, detects action, map name, theme
    ▼
dream-orchestrator.js (God Mode Brain)
    │  ── Detects Mode 1 (NOTHING), Mode 2 (CONCEPT), Mode 3 (MAP)
    │
    ├──► map-scaffold.js      (Generates boilerplate level .js file)
    ├──► macro-dreamer.js      (Injects 2-4 large thematic buildings)
    ├──► map-injector.js       (Injects 15-30 props across map quadrants)
    ├──► enemy-synthesizer.js  (Extracts enemies from concept markdown)
    ├──► map-simulate.js       (Bot traversal simulation & scoring)
    └──► verify-detailing.js   (Self-healing audit pass)
           │
           ▼
    src/levels/<mapName>.js    (Final generated level module)
```

### Key Constraint
**Dream has NO access to any LLM/AI model at runtime.** The `CreativeDebateEngine` and `EnemyDebateEngine` modules exist but use **mock/stub** functions. All generation is pure string-template concatenation and spatial scanning.

---

## 2. MODULE-BY-MODULE DEEP DIVE

### 2.1 `dream.js` — NLP Router (198 lines, 8KB)

**Role**: CLI entry point. Parses human text like `"god forest"`, `"inspect space_station"`, `"heal zen"` and routes to the correct sub-command.

**How it works**:
1. Keyword matching against hardcoded action words (`god`, `inspect`, `heal`, `detail`, `inject`, `macro`, `delete`, `graduate`)
2. Map name extraction via:
   - `called <name>` pattern
   - Word after `map` keyword
   - Hardcoded name aliases (`pirate cove`, `zen garden`, `clockwork`, `forest`, `space station`, etc.)
   - Fallback: last non-action word in prompt
3. Theme resolution via `thematic-memory.json` archetype keyword matching
4. Supports `Nx` multiplier (e.g. `"god forest 3x"` runs pipeline 3 times)

**Limitations**:
- Theme resolution is fragile. New maps with unknown names hit fallback and often fail
- Map name aliases are hardcoded (lines 83-112) — adding a new map requires code changes
- No fuzzy matching, no semantic understanding

---

### 2.2 `dream-orchestrator.js` — God Mode Brain (838 lines, 38KB)

**Role**: The master pipeline controller. Detects the starting state and runs the appropriate sequence.

**Three Modes**:

| Mode | Trigger | Pipeline |
|------|---------|----------|
| Mode 1: NOTHING | No concept file, no level file | Generate concept → Scaffold → Macro inject → Prop inject → Enemy synth → Simulate → Audit |
| Mode 2: CONCEPT | Concept `.md` exists, no level file | Parse concept → Enrich if thin → Scaffold → Macro inject → Prop inject → Enemy synth → Simulate → Audit |
| Mode 3: MAP | Level `.js` already exists | Snapshot backup → Spatial Doctor (fix dupes, stair sanitize) → Macro inject → Prop inject → Simulate → Audit |

**Concept Parser** (lines 271-308):
- Counts which of 13 standard sections exist via regex `##\s*N\.`
- Checks for prop dimensions pattern `\d+\.?\d*\s*[m×x]\s*\d+`
- Checks for stair math keywords
- Checks for spawn coordinates
- Returns `{ lineCount, sectionCount, hasPropDimensions, hasStairMath }`

**Concept Enrichment** (lines 313-356):
- If concept has < 150 lines or < 11/13 sections, appends boilerplate prop taxonomy and stair math from `learning-cache.json`
- Does NOT create new sector layouts, new landmarks, or spatial coordinates
- Just appends generic text bullets

**Rich Concept Generation** (Mode 1, lines 381-505):
- Generates a ~100-line concept doc from thematic-memory archetype data
- Uses hardcoded template text with variable interpolation (prop names, ink colors, step rise/run)
- All concepts share the EXACT SAME structural layout: 4 corner sectors, 1 center, same spawn coordinates, same stair math
- **CRITICAL FLAW**: Every auto-generated concept is structurally identical regardless of theme

**Key Infrastructure**:
- `runStage()`: Wraps `execSync()` with timeout (60s), error handling, consultation ticket filing
- `createSnapshot()` / `rollback()`: File-level backup/restore for Mode 3
- `cleanupWorkspace()`: Deletes duplicate concept files and graduated concepts
- Records every run to `dream-journal.json` and `learning-cache.json`

---

### 2.3 `map-scaffold.js` — Level Code Generator (359 lines, 16KB)

**Role**: Generates the initial `src/levels/<key>.js` file with boilerplate geometry.

**What it generates** (ALWAYS the same structure):
1. Floor slab (`box(0, -1, 0, ...)`)
2. 4 perimeter walls
3. 4 cardinal doorframes (purely decorative, `noCollide: true`)
4. Sky lid colliders (prevent escape)
5. 4 spawns near wall centers
6. 4 sniper vantage points
7. 6 pickup locations
8. 1 center elevated platform (20x20m slab at tier2 height)
9. 4 center cover blocks (waist-high)
10. 2 dual stairways (north/south) to center platform
11. 4 quadrant platforms (NW, NE, SW, SE) with 1 stairway each
12. 5 overhead grapple rings
13. Ground collision floor

**Concept Awareness**:
- Parses concept doc for bounds (`P`), wall height (`PH`), tier heights, ink colors
- Falls back to presets: `urban`, `colossal`, `anomalous`, `kinetic`
- Precomputes stair step counts and rise/run from tier heights

**CRITICAL LIMITATION**: 
- The scaffold is a **fixed architectural template**. It ALWAYS produces:
  - Identical 4-quadrant layout with center elevated crossing
  - Same doorframe positions
  - Same spawn locations (relative to bounds)
  - Same grapple ring constellation
- No multi-story buildings, no corridors, no rooms, no asymmetric layouts
- **This is the #1 reason all Dream maps look the same**

---

### 2.4 `macro-dreamer.js` — Macro Building Injector (712 lines, 33KB)

**Role**: Scans the level for empty volumetric pockets and injects 2-4 large thematic buildings.

**Void Scanning Algorithm**:
1. Builds the level in memory via `buildLevel()` mock (collects AABB colliders)
2. Grid-scans from `bounds.minX + 12` to `maxX - 12` in 6m steps
3. Tests each position for clearance: `isVolumetricPocketClear(x, 0, z, w, h, d, minClearance)`
4. Checks against colliders, spawns (3m clearance), snipers (2.5m clearance)
5. Tests large (10x7x10m) then medium (7x5x7m) voids

**Template Library** (7 themes x 3 templates each = 21 templates):
- `zen`: bell_pavilion, engawa_teahouse, torii_overlook
- `cyber`: neon_data_vault, skybridge_junction, holo_kiosk_tower
- `steampunk`: clockwork_dynamo, boiler_furnace, gear_bridge
- `colossal`: pencil_turret, sketchbook_rampart, desk_lamp_fortress
- `maritime`: galleon_sterncastle, lighthouse_beacon, cargo_crane
- `forest`: ancient_oak_canopy, canopy_treehouse_outpost, stone_henge_hollow
- `space_station`: centrifuge_hab_module, solar_array_mast, deep_space_comms_gantry

**Each template is a hardcoded string function** like:
```js
codeGenerator: (x, y, z) => `
  box(${x}, ${y}, ${z}, 8.4, 0.6, 8.4, { ink: BL });
  box(${x} - 3.2, ${y} + 1.0, ${z} - 3.2, 0.6, 4.2, 0.6, { ink: BK });
  ...
  ring(${x}, ${y} + 8.0, ${z}, 'z');
  pickup(${x}, ${y} + 4.4, ${z});`
```

**Selection Logic**:
- Uses `NegativeSpaceProfiler` to classify void shape (atrium, corridor, shaft, etc.)
- Matches templates to void archetype
- Skips blacklisted templates (3+ previous failures)
- Maximum 4 buildings, minimum 15m separation
- Optional genetic mutation: 20% chance of +/-1.5m position jitter for successful templates

**Pre-Validation**: Each template runs through `GeometryValidator`:
1. `validateCodeSyntax()` — regex-based API signature checking
2. `testSandboxExecution()` — dry-run execution to detect NaN/Infinity values

**Injection**: Replaces or inserts between `// === DREAM AUTO-INJECTED MACRO STRUCTURES ===` markers before `B.finish()`.

**CRITICAL LIMITATIONS**:
- Only 3 templates per theme. After 2-3 runs, all placements look identical
- Templates are ~8-12 geometry calls each — very simple structures (4 pillars + 1 slab + 1 ring)
- No internal rooms, no corridors, no windows, no multi-floor interiors
- Buildings have no stairs connecting them to ground (no player pathing)
- No concept document influence on building design — just theme keyword matching
- All buildings are essentially "elevated platform on pillars with grapple ring"

---

### 2.5 `map-injector.js` — Prop Injector (525 lines, 25KB)

**Role**: Fills remaining empty spaces with thematic props (Tier 1-2 scale).

**Scanning Algorithm**:
1. Builds level in memory (same as macro-dreamer)
2. Grid-scans in 16m steps for "city lots"
3. For each grid cell, randomly picks a prop template from the theme catalog
4. Tests volumetric clearance (`isBoxCollisionFree`) with 1m padding
5. Also runs `RhythmPlacer` along 4 diagonal combat lanes (corners to center) to place cover

**Prop Catalogs** (per theme):
- `forest`: 14 prop types (ancient_oak_tree to fern_and_grass_grove), most call `buildXxx()` prefabs
- `space_station`: 8 prop types (solar_array_wing to flight_telemetry_terminal), call prefab functions
- `maritime`: 2 inline prop types + 1 prefab (galleon)
- `colossal`: 3 inline prop types (stationery_bunker, book_bastion, pencil_pot_redoubt)
- `zen`: 1 inline prop type (tea_shrine)
- `cyber`: 1 inline prop type (server_terminal)
- `steampunk`: 1 inline prop type (gear_furnace)

**Lane Cover Placement**:
- `RhythmPlacer` generates positions at beat intervals along spawn-to-center paths
- Hard cover: `buildCryoPod`, `buildOxygenTankRack`, `buildAirlockHatch` (for space_station)
- Soft cover: `buildTelemetryConsole`, `buildHydroponicTray`, `buildSolarArray`
- Fallback themes get generic `box()` and `barrel()` calls

**Import Management**: Auto-detects which `buildXxx` functions are used and adds import statement

**CRITICAL LIMITATIONS**:
- Props are placed ONLY on ground level (Y=0). No props on elevated platforms, catwalks, or upper tiers
- Random selection means prop distribution is chaotic — might place 5 identical solar arrays
- No understanding of spatial composition, visual storytelling, or meaningful prop clusters
- 16m grid step means very sparse placement — large gaps between props
- `zen`, `cyber`, `steampunk` each have only 1 prop type in the catalog
- The function that determines which catalog to use is a chain of `if/else if` on theme string — fragile

---

### 2.6 `map-refiner.js` — Micro-Detail & Heal Pass (137 lines, 6KB)

**Role**: Applies micro-detail scattering to large flat surfaces OR heals structural blunders.

**Detail Mode**:
- Regex-scans for `box()` calls with width >= 4 and depth >= 4 and height < 2
- On each matching flat surface, appends 2-3 tiny decorative props on top:
  - `forest`: toadstool cluster, river stone, cedar woodchip
  - `maritime`: rum barrel, bollard, cannonball
  - `space_station`: data slate, cryo canister, warning beacon
  - Default: book, pencil, ink well
- Has a **syntax error** on line 101: missing closing brace for `zen` theme block

**Heal Mode**: Delegates to `dream-healer.js`

**CRITICAL LIMITATIONS**:
- Detail scatter is trivially simple — 2-3 tiny `noCollide` decorations
- Only triggers on surfaces that match the regex exactly (misses slabs, cylinders, etc.)
- The zen theme handler has a syntax bug (unclosed brace) that prevents it from working

---

### 2.7 `map-inspector.js` — Static Analysis Inspector (100 lines, 4KB)

**Role**: Regex-based static analysis of level `.js` source code.

**Checks**:
1. **Step Rise Violation**: Finds `stairs()` calls where `rise > 0.35m` (physics limit)
2. **Deck Penetration**: Finds stairs whose AABB overlaps slabs (headroom collision)
3. **Embedded Grapple Ring**: Rings at Y between 18.5m and 20.0m (might be inside lamp geometry)

**Scoring**: Starts at 12, subtracts 1 per step rise violation, 2 per deck penetration, 1 per embedded ring.

**CRITICAL LIMITATIONS**:
- Only checks 3 things. No checks for: prop overlaps, spawn accessibility, pathfinding connectivity, cover distribution, sightline balance, quadrant density
- Uses `parseFloat()` on regex captures — fails on expressions like `${y} + 4.5` or variable names
- Embedded grapple check is hardcoded for classroom lamp heights (18.5-20m) — meaningless for other maps
- Cannot detect floating props, unreachable platforms, or dead ends

---

### 2.8 `dream-healer.js` — Auto-Fix Engine (72 lines, 3KB)

**Role**: Automatically fixes blunders detected by `map-inspector.js`.

**Fixes**:
1. **Step Rise Violation**: Recalculates to `rise: 0.34m` with adjusted step count
2. **Deck Penetration**: Splits monolithic slab into 3 pieces — BUT only for the specific case where `minX === -26 && maxX === 26` (hardcoded for a specific library desk)
3. **Embedded Ring**: Lowers ring Y by 1.5m

**CRITICAL LIMITATIONS**:
- Deck penetration fix is hardcoded for ONE specific slab geometry
- No general-purpose slab splitting, no stairwell carving algorithm
- Entire file is 72 lines — minimal healing capability

---

### 2.9 `map-simulate.js` — Bot Traversal Simulator (254 lines, 10KB)

**Role**: Simulates bot traversal paths and computes a 0-100 quality score.

**Bot Archetypes**: `RUSHER` (speed-focused), `SNIPER` (sightline-focused), plus generics

**Simulation**:
1. Generates 3-waypoint paths from each spawn to midpoint to center
2. Runs `MovementPhysicsModel.simulateTraversal()` for each path
3. Rusher score = momentum carry average
4. Sniper score = sightline tensor field exposure check at spawns
5. Others = `75 + Math.random() * 20 - 10` (literally random!)
6. `AdversarialBotEngine.calculateBalanceScore()` averages results
7. Subtracts exploit penalties (head glitch = -10, god spot = -15)

**Pass Threshold**: Score >= 75

**CRITICAL LIMITATIONS**:
- Paths are trivial 3-point straight lines (spawn to midpoint to center) — no actual pathfinding
- No A* or navmesh — bots don't navigate around obstacles
- Generic bot archetype score is `75 + random` — literally meaningless
- Simulation never actually detects that a platform is unreachable
- `SightlineTensorField` uses a 4m-resolution grid — very coarse
- Quality score almost always passes because the random baseline is ~75

---

### 2.10 `map-learning.js` — Self-Learning Memory (452 lines, 16KB)

**Role**: Records successes, failures, blacklists, error rates, and auto-tightens constraints.

**Data Stores**:
- `learning-cache.json`: Rules, learned patterns, failure blacklist, success registry, error rate tracker, dead zones
- `dream-journal.json`: Run history log

**Key Functions**:
- `blacklistTemplate(id, reason)`: After 3 failures, template is permanently blocked
- `isCoordinateBlacklisted(x, z, mapKey)`: Checks dead zones
- `registerSuccess(id, mapKey, score, position)`: Tracks successful placements
- `autoTightenRules()`: If a pattern fails 3+ times, tightens constraints:
  - Headroom failure: +0.2m required headroom (max 3.0m)
  - Ring failure: +0.2m wall clearance (max 2.5m)
  - Collision: +0.1m pinch width (max 2.5m)

**CRITICAL LIMITATIONS**:
- Learning is purely parametric (tightening numeric thresholds)
- No learning of spatial patterns, design principles, or composition rules
- Blacklisting is binary (template fully blocked or fully available)
- No concept of "this template works well in corners but not centers"
- Error rate tracker uses a rolling window of 20 runs — too small for meaningful trends

---

### 2.11 `prefabs.js` — Procedural Prefab Library (1078 lines, 39KB)

**Role**: Reusable procedural geometry functions that generate complex multi-mesh props.

**29 registered prefabs** including:
- Trees: `buildAncientTree`, `buildPineTree`, `buildWillowTree`
- Forest: `buildGiantMushroom`, `buildHollowLog`, `buildCampfire`, `buildWoodStack`, etc.
- Maritime: `buildFullGalleon`
- Space Station: `buildSolarArray`, `buildCryoPod`, `buildAirlockHatch`, `buildCentrifugeRing`, `buildHydroponicTray`, `buildCommunicationsDish`, `buildOxygenTankRack`, `buildTelemetryConsole`

**Each prefab** is a function like:
```js
export function buildCryoPod(B, x, y, z) {
  const { box, cyl, sphere } = B;
  box(x, y, z, 1.2, 1.8, 0.8, { ink: BL }); // Pod chassis
  cyl(x, y + 0.9, z, 0.5, 0.6, { seg: 8, ink: OR }); // Visor dome
  box(x + 0.7, y + 0.4, z, 0.15, 1.0, 0.5, { ink: BK }); // Status panel
}
```

**These are the game's building blocks.** Each prefab typically uses 3-8 geometry primitives.

---

### 2.12 `enemy-synthesizer.js` — Enemy Extraction (156 lines, 6KB)

**Role**: Parses Section 14 of concept docs and extracts enemy definitions for injection into `level.js`.

**How it works**:
1. Regex extracts `**Enemy N: Name**: \`{...}\`` patterns from concept markdown
2. Parses the JS object literal via `new Function('return ' + codeStr)()`
3. Injects into the LEVELS array in `level.js`

---

### 2.13 Supporting Modules Summary

| Module | Lines | Role |
|--------|-------|------|
| `geometry-validator.js` | 182 | Validates code syntax + sandbox dry-run |
| `stair-sanitizer.js` | 107 | Removes duplicate/conflicting stair calls |
| `negative-space.js` | 101 | Classifies void shapes (atrium/corridor/shaft) |
| `rhythm-placer.js` | 79 | Beat-interval cover placement along lanes |
| `exploit-detector.js` | 116 | Finds head-glitch and god-spot positions |
| `sightline-field.js` | 110 | Computes exposure tensor on grid |
| `movement-model.js` | 86 | Physics-based traversal simulation |
| `adversarial-bots.js` | 85 | Bot archetype definitions |
| `mutate-map.js` | 73 | Genetic mutation of map DNA |
| `creative-debate.js` | 132 | Art Director vs Level Designer debate (**MOCK — NOT FUNCTIONAL**) |
| `dream-consultant.js` | 277 | Consultation ticket system for unknown concepts |
| `dream-healer.js` | 72 | Auto-fix structural blunders |
| `dream-registry-sync.js` | 72 | Syncs MAP_BUILDERS with level files |

---

## 3. DATA FILES & MEMORY SYSTEMS

### 3.1 `.agents/thematic-memory.json` (135 lines, 5KB)
Contains thematic archetype definitions. Currently only 3 themes defined:
- `forest` (8 keywords, full Tier 1-4 prop taxonomy)
- `space_station` (8 keywords, full Tier 1-4)
- `station` (alias for space_station, 3 keywords)

**Missing themes that exist as macro-dreamer templates but NOT in thematic-memory**:
- `zen`, `cyber`, `steampunk`, `colossal`, `maritime` — these exist only as hardcoded template arrays inside `macro-dreamer.js` and `map-injector.js`

### 3.2 `.agents/learning-cache.json`
Stores numeric rules, failure blacklists, success registries, error rate windows.

### 3.3 `.agents/dream-journal.json`
Historical log of Dream runs with success/failure status.

### 3.4 `map_concepts/*.md` and `Map Description/*.md`
Architectural concept documents (150-301 lines each). Dream reads these to extract bounds, tier heights, ink colors, and prop taxonomy.

---

## 4. THE FULL PIPELINE EXECUTION FLOW

When the user runs `npm run dream "god space_station"`:

```
1. dream.js parses "god space_station"
   → action = god_mode, mapName = space_station
   → Loads thematic-memory.json, finds theme = space_station
   → Runs: npm run dream:god space_station space_station

2. dream-orchestrator.js receives (space_station, space_station)
   → findConceptFile() → finds map_concepts/03_space_station.md
   → Level file doesn't exist → Mode 2: CONCEPT
   → parseConcept() → 301 lines, 13/13 sections → "already rich"
   → enrichConcept() → skipped (>= 150 lines)
   
3. scaffoldFromConcept()
   → map-scaffold.js reads concept, extracts P=55, PH=18, tier2=5.0, tier3=10.0
   → Generates FIXED TEMPLATE with these parameters
   → Writes src/levels/space_station.js (identical layout to every other Dream map)
   → Registers in src/level.js MAP_BUILDERS
   
4. macro-dreamer.js (space_station, space_station)
   → Builds level in memory, collects colliders
   → Grid-scans 6m steps for voids >= 8x6x8m
   → Finds ~8-15 void candidates
   → Picks max 4 non-overlapping (15m min separation)
   → Uses only 3 templates: centrifuge_hab_module, solar_array_mast, deep_space_comms_gantry
   → Injects code strings between markers
   
5. map-injector.js (space_station, space_station)
   → Grid-scans 16m steps for prop lots
   → Randomly picks from 8 space_station prop types
   → Also places cover along 4 diagonal lanes
   → Injects ~20-25 buildXxx() calls
   
6. enemy-synthesizer.js (space_station)
   → Finds concept doc, looks for Section 14
   → Extracts enemy definitions if present
   
7. map-simulate.js (space_station)
   → Generates trivial spawn-to-center paths
   → Runs mock physics/sightline simulation
   → Score ≈ 75-90 (almost always passes)
   
8. verify-detailing.js (space_station)
   → Counts colliders, stairs, grapples, spawns
   → Passes if sufficient counts exist
```

---

## 5. TEMPLATE LIBRARY INVENTORY

### Macro Building Templates (macro-dreamer.js)

| Theme | Template ID | Geometry Calls | Description |
|-------|------------|----------------|-------------|
| zen | bell_pavilion | 16 | Open shrine with bell, mezzanine, grapple |
| zen | engawa_teahouse | 8 | Veranda teahouse with tatami, railing |
| zen | torii_overlook | 10 | Vermilion gate with elevated walkway |
| cyber | neon_data_vault | 10 | Server room with tiered walkways |
| cyber | skybridge_junction | 7 | Twin pylons with suspended walkway |
| cyber | holo_kiosk_tower | 6 | Narrow tower with display |
| steampunk | clockwork_dynamo | 10 | Gear housing with observation deck |
| steampunk | boiler_furnace | 7 | Furnace with wraparound catwalk |
| steampunk | gear_bridge | 7 | Suspended bridge with gears |
| colossal | pencil_turret | 7 | Pencil standing upright |
| colossal | sketchbook_rampart | 7 | Spiral-bound rampart wall |
| colossal | desk_lamp_fortress | 7 | Anglepoise lamp with platforms |
| maritime | galleon_sterncastle | 8 | Ship stern with cabin |
| maritime | lighthouse_beacon | 6 | Cylindrical lighthouse |
| maritime | cargo_crane | 8 | Dockside loading crane |
| forest | ancient_oak_canopy | 8 | Oak trunk with canopy deck |
| forest | canopy_treehouse_outpost | 8 | Timber watchtower |
| forest | stone_henge_hollow | 6 | Standing stone portal |
| space_station | centrifuge_hab_module | 8 | Rotary torus with avionics core |
| space_station | solar_array_mast | 10 | Solar wing tower |
| space_station | deep_space_comms_gantry | 11 | Parabolic reflector platform |

**Total: 21 unique macro templates across 7 themes (3 per theme)**

### Prop Templates (map-injector.js)

| Theme | Count | Notable Props |
|-------|-------|---------------|
| forest | 14 | Trees, mushrooms, logs, campfire, carts, stumps, ferns, toadstools |
| space_station | 8 | Solar array, centrifuge, comms dish, airlock, hydroponic, cryo pod, O2 rack, console |
| maritime | 2+pirate subthemes | Galleon, shanty towers, ribcages, grotto, plank bridges |
| colossal | 3 | Stationery bunker, book bastion, pencil pot |
| zen | 1 | Tea shrine |
| cyber | 1 | Server terminal |
| steampunk | 1 | Gear furnace |

---

## 6. PREFAB SYSTEM INVENTORY

### Registered Prefabs in PREFAB_REGISTRY (src/prefabs.js)

| # | Function | Category | Geometry Calls | Description |
|---|----------|----------|----------------|-------------|
| 1 | buildAncientTree | Forest | ~25 | Ancient banyan with spiral trunk |
| 2 | buildPineTree | Forest | ~5 | Alpine conifer |
| 3 | buildWillowTree | Forest | ~10 | Weeping willow with vines |
| 4 | buildGiantMushroom | Forest | ~4 | Umbrella mushroom platform |
| 5 | buildHollowLog | Forest | ~5 | Pass-through log tunnel |
| 6 | buildCampfire | Forest | ~4 | Stone hearth |
| 7 | buildWoodStack | Forest | ~4 | Cordwood stack |
| 8 | buildLoggingCart | Forest | ~5 | Timber handcart |
| 9 | buildHollowStump | Forest | ~3 | Ambush bunker stump |
| 10 | buildChoppingBlock | Forest | ~3 | Woodcutter's block |
| 11 | buildTrailSign | Forest | ~3 | Weathered signpost |
| 12 | buildSurveyTable | Forest | ~4 | Map table with telescope |
| 13 | buildToadstoolCluster | Forest | ~varies | Spotted mushrooms |
| 14 | buildFernCluster | Forest | ~varies | Fern fronds |
| 15 | buildGrassClump | Forest | ~varies | Grass tufts |
| 16 | buildFullGalleon | Maritime | ~30 | Full pirate warship |
| 17 | buildSolarArray | Space | ~6 | Photovoltaic array |
| 18 | buildCryoPod | Space | ~4 | Cryo-stasis capsule |
| 19 | buildAirlockHatch | Space | ~5 | Bulkhead door |
| 20 | buildCentrifugeRing | Space | ~8 | Habitat centrifuge |
| 21 | buildHydroponicTray | Space | ~4 | Algae growth bay |
| 22 | buildCommunicationsDish | Space | ~6 | Parabolic antenna |
| 23 | buildOxygenTankRack | Space | ~5 | O2 cylinder rack |
| 24 | buildTelemetryConsole | Space | ~4 | Flight terminal |
| 25-29 | Various desk props | Colossal | ~3 each | Desk lamps, staplers, etc. |

---

## 7. QUALITY ASSURANCE & AUDIT TOOLS

| Tool | Command | What it Checks |
|------|---------|----------------|
| Concept Audit | `npm run audit:concept <name>` | 13 sections, Tier 1-4 taxonomy, ink palette, stair math, clearances |
| Map Audit | `npm run audit:map <key>` | Collider count, stair count, grapple count, spawn/sniper presence |
| Dream Inspect | `npm run dream "inspect <key>"` | Step rise violations, deck penetration, embedded rings |
| Bot Simulation | `npm run map:simulate <key>` | Trivial bot traversal scoring (largely random) |
| Prefab Test | `node test/verify_procedural_prefabs.mjs` | Verifies all 29 prefabs produce valid geometry |
| Integrity | `npm run verify:integrity` | Golden baseline file checksums |

---

## 8. QUANTITATIVE COMPARISON: DREAM OUTPUT vs. GIANT CLASSROOM

### Giant Classroom (Hand-Authored, src/level.js inline function)

| Metric | Value |
|--------|-------|
| Lines of code | **782** |
| Bytes | **36,531** |
| `box()` calls | **120** |
| `cyl()` calls | **33** |
| `slab()` calls | **31** |
| `sphere()` calls | **17** |
| `ring()` calls (grapple) | **31** |
| `rail()` calls | **17** |
| `stairs()` calls | **9** |
| `spawn()` calls | **4** |
| `pickup()` calls | **15** |
| `sniper()` calls | **8** |
| Total colliders (audit) | **381** |
| Total grapple rings (audit) | **39** |

### Space Station (Dream-Generated, src/levels/space_station.js)

| Metric | Value |
|--------|-------|
| Lines of code | **241** |
| Bytes | **10,428** |
| `box()` calls | **31** |
| `cyl()` calls | **6** |
| `slab()` calls | **9** |
| `sphere()` calls | **0** |
| `ring()` calls (grapple) | **9** |
| `rail()` calls | **0** (none in level file itself) |
| `stairs()` calls | **6** |
| `build*()` prefab calls | **24** |
| `spawn()` calls | **4** |
| `pickup()` calls | **10** |
| `sniper()` calls | **4** |
| Total colliders (audit) | **206** |
| Total grapple rings (audit) | **17** |

### The Gap

| Metric | Classroom | Space Station | Ratio |
|--------|-----------|---------------|-------|
| Code volume | 36KB | 10KB | **3.5x** |
| Direct geometry calls | 263 | 52 | **5.1x** |
| Total colliders | 381 | 206 | **1.8x** |
| Grapple rings | 39 | 17 | **2.3x** |
| Spatial complexity | Multi-story classrooms, desks, bookshelves, chalkboards, pencils at all heights | Flat ground plane + 4 corner platforms + a few prefabs | **Incomparable** |

---

## 9. ROOT CAUSE ANALYSIS: WHY DREAM FAILS

### ROOT CAUSE 1: Fixed Scaffold Template (THE BIGGEST PROBLEM)

Every Dream map starts from `map-scaffold.js` which generates THE SAME LAYOUT:
- 4 walls, 4 doorframes, center elevated slab, 4 corner platforms, grapple rings on top
- The scaffold determines 80% of the map's feel. Macro/prop injection adds garnish, not structure.

**The Giant Classroom was hand-designed with:**
- Unique room layouts (teacher's desk area, reading nook, art corner)
- Multi-story interior spaces with internal stairs
- Dense prop clusters forming corridors and lanes
- Over 100 intentionally placed box() calls creating walls, desks, shelves

**Dream's scaffold creates an empty arena with platforms.**

### ROOT CAUSE 2: No Spatial Composition Intelligence

Dream has zero understanding of:
- **Rooms and corridors**: It can't create enclosed spaces with doors and windows
- **Interior architecture**: No concept of "wall, door opening, adjacent room"
- **Vertical layering**: Props are placed only at Y=0. Upper platforms are empty
- **Sightline design**: No deliberate long sightlines or intentional cover corridors
- **Narrative flow**: No concept of player journey from A to B to C
- **Asymmetry**: Every quadrant is structurally identical

### ROOT CAUSE 3: Template Poverty

- Only 3 macro building templates per theme
- Only 1-3 prop templates for most themes (zen: 1, cyber: 1, steampunk: 1)
- Every template is a simple "box pedestal + platform + grapple ring" pattern
- No templates for: corridors, bridges connecting buildings, interior rooms, multi-story structures, staircases between levels

### ROOT CAUSE 4: Concept Documents Are Decorative, Not Structural

The concept document system has rich text about prop names, ink colors, and stair math. But:
- **The scaffold ignores 90% of the concept**: It only extracts bounds (P), wall height (PH), tier heights, and ink colors
- **Sector descriptions** (Sections 4-8) describe "fortified corner" and "CQB alleyway" but nothing reads or acts on this
- **There is no system that converts concept text into geometry placement instructions**
- The concept is a "wish document" — Dream cannot fulfill the wishes

### ROOT CAUSE 5: No LLM Integration (CreativeDebateEngine is a Stub)

`creative-debate.js` has a `CreativeDebateEngine` class that's supposed to pit an Art Director against a Level Designer through LLM conversation rounds. **It uses mock functions that return hardcoded blueprints.** There is no actual AI reasoning about spatial design.

### ROOT CAUSE 6: Simulation is Meaningless

The quality score from `map-simulate.js` is largely random:
- Generic bot archetypes score `75 + random * 20`
- Paths are trivial straight lines, not real navigation
- No navmesh, no pathfinding, no reachability analysis
- Score almost always passes (75+), providing no useful signal

### ROOT CAUSE 7: No Multi-Pass Refinement

Dream runs each stage exactly once in sequence. There is no:
- "This area looks empty, add more cover"
- "These two buildings are too similar, replace one"
- "The east side has 80 colliders, the west has 20, rebalance"
- "The center platform has no cover, add some"
- Iterative improvement loop

---

## 10. KNOWN BUGS & TECHNICAL DEBT

1. **`map-refiner.js` line 101**: Missing closing brace in zen theme block — causes syntax parse issues when `action === 'detail'` for zen maps
2. **`map-inspector.js` line 41**: Previously had `tempRegex` undefined (was fixed, but fragile)
3. **`map-inspector.js` `parseFloat` brittleness**: Fails on template expressions like `${y} + 4.5` — only works on precomputed literal numbers
4. **`dream.js` line 136**: Registered map list is hardcoded and out of date
5. **Duplicate injection blocks**: If Dream runs twice on the same map (Mode 3), it can create nested or duplicate `// === DREAM AUTO-INJECTED ===` blocks
6. **Thematic memory incomplete**: Only `forest`, `space_station`, and `station` have entries. Other themes (`zen`, `cyber`, `steampunk`, `colossal`, `maritime`) exist only as hardcoded template arrays
7. **`map-scaffold.js` concept parsing**: Half-Span regex only captures integers, misses decimals
8. **Import statement duplication**: `map-injector.js` can prepend duplicate import lines if run multiple times

---

## 11. WHAT DREAM CANNOT DO TODAY

1. Create enclosed rooms or corridors
2. Design multi-story buildings with interior stairs and floors  
3. Place props on elevated platforms (upper tiers always empty)
4. Create asymmetric layouts (non-mirrored quadrants)
5. Generate unique architectural silhouettes per map
6. Connect buildings with bridges, catwalks, or tunnels
7. Create intentional sightlines or cover lanes
8. Read and interpret concept document sector descriptions
9. Learn from successful hand-authored maps (Giant Classroom, etc.)
10. Use any AI/LLM for spatial reasoning
11. Create doors, windows, or wall openings in buildings
12. Vary vertical placement (everything is Y=0)
13. Cluster related props into meaningful scenes
14. Create terrain variation (everything is flat)
15. Recognize and avoid placing identical props next to each other
16. Create staircases between macro buildings and the ground
17. Design based on player flow (no navmesh, no pathfinding)
18. Produce maps that feel hand-designed or authored

---

## 12. GEOMETRY PRIMITIVE API REFERENCE

These are the available primitives Dream can use when generating level code:

```
box(x, y, z, w, h, d, opts)        — Axis-aligned rectangular solid
slab(x1, z1, x2, z2, y, depth, opts)  — Flat walkable platform (XZ plane)
stairs(x, y, z, dir, count, width, { rise, run, ink })  — Stepped incline
rail(x1, z1, x2, z2, y, opts)       — Railing/guardrail line
cyl(x, y, z, r, h, opts)            — Cylinder (columns, pipes, masts)
sphere(x, y, z, r, opts)            — Sphere
ring(x, y, z, orient)               — Grapple ring anchor point
spawn(x, y, z)                      — Player spawn location
sniper(x, y, z)                     — Sniper vantage point
pickup(x, y, z)                     — Weapon/ammo pickup location
collider(x, y, z, w, h, d, opts)    — Invisible collision volume
barrel(x, y, z, r, h, opts)         — Composite barrel (cylinder + bands)
planes(count, radius, height, opts)  — Animated circling planes
cone(x, y, z, r, h, opts)           — Cone shape
```

Opts include: `{ ink: BL|BK|OR|GR|RD, noCollide: true, tag: 'cover' }`

---

## 13. FILE MANIFEST

### Dream Pipeline Core
| File | Lines | Bytes | Role |
|------|-------|-------|------|
| `dream.js` | 198 | 8,141 | CLI NLP Router |
| `src/dream-orchestrator.js` | 838 | 37,781 | God Mode Pipeline Controller |
| `src/map-scaffold.js` | 359 | 15,722 | Level Boilerplate Generator |
| `src/macro-dreamer.js` | 712 | 32,672 | Macro Building Void Scanner and Injector |
| `src/map-injector.js` | 525 | 25,169 | Prop and Cover Injector |
| `src/map-refiner.js` | 137 | 5,899 | Micro-Detail and Heal |
| `src/enemy-synthesizer.js` | 156 | 5,602 | Enemy Extraction from Concept |
| `src/map-simulate.js` | 254 | 10,103 | Bot Traversal Simulator |
| `src/map-learning.js` | 452 | 16,146 | Self-Learning Memory Manager |
| `src/prefabs.js` | 1,078 | 38,840 | Procedural Prefab Library |
| **Total** | **4,709** | **196,075** | |

### Dream Support Modules
| File | Lines | Bytes | Role |
|------|-------|-------|------|
| `src/map-inspector.js` | 100 | 3,995 | Static Analysis |
| `src/dream-healer.js` | 72 | 2,981 | Auto-Fix Engine |
| `src/geometry-validator.js` | 182 | 6,542 | Syntax and Dry-Run Validation |
| `src/stair-sanitizer.js` | 107 | 4,293 | Stair Conflict Resolver |
| `src/negative-space.js` | 101 | 3,191 | Void Shape Classifier |
| `src/rhythm-placer.js` | 79 | 2,674 | Beat-Interval Cover Placement |
| `src/exploit-detector.js` | 116 | 3,969 | Head-Glitch and God-Spot Detection |
| `src/sightline-field.js` | 110 | 3,181 | Exposure Tensor Grid |
| `src/movement-model.js` | 86 | 2,840 | Physics Traversal Model |
| `src/adversarial-bots.js` | 85 | 2,868 | Bot Archetypes |
| `src/mutate-map.js` | 73 | 2,349 | Genetic Mutation |
| `src/creative-debate.js` | 132 | 5,157 | **MOCK** Art/Design Debate |
| `src/dream-consultant.js` | 277 | 11,261 | Consultation Ticket System |
| `src/dream-registry-sync.js` | 72 | 2,535 | Registry Synchronizer |
| `src/map-synthesizer.js` | 211 | 9,729 | Map Synthesizer |
| **Total** | **1,803** | **67,565** | |

### Data Files
| File | Role |
|------|------|
| `.agents/thematic-memory.json` | Theme archetype definitions (3 themes) |
| `.agents/learning-cache.json` | Rules, blacklists, success registry |
| `.agents/dream-journal.json` | Run history log |
| `.agents/evolution-cache.json` | Best DNA for genetic mutation |
| `map_concepts/*.md` | Concept documents (8 files) |
| `Map Description/*.md` | Graduated concept documents |

---

## 14. ARCHITECTURAL UPGRADE VECTORS & DESIGN CHALLENGES

When presenting this report to an advanced LLM, here are the 5 architectural vectors where Dream urgently requires redesign:

### Vector A: From Monolithic Quad-Scaffold to Spatial Grammar Graph
- **Current state**: `map-scaffold.js` prints an identical 4-quadrant symmetric box arena every time.
- **Needed architecture**: A graph-based spatial layout generator (Room & Corridor Grammars / 3D BSP / Wave Function Collapse). The system must support asymmetric layouts, interior rooms, courtyards, narrow choke alleys, multi-level atriums, and themed structural footprints.

### Vector B: Concept-to-Geometry Compiler (Semantic Parser)
- **Current state**: Concept documents contain rich 13-section tactical descriptions, but the code only extracts bounds ($P$) and tier heights ($Y$). Sections 4-8 (Quadrant designs, CQB corridors, Sniper perches) are ignored.
- **Needed architecture**: An intermediate Scene Description Tree (JSON AST) where concept documents or an LLM planner generate high-level semantic nodes (`{ type: "corridor", from: [x1,z1], to: [x2,z2], coverDensity: 0.4 }`, `{ type: "room", interior: true, stairsTo: "upper_deck" }`), which the builder transforms into valid collision and mesh geometry.

### Vector C: Multi-Tier Verticality & Spatial Anchoring
- **Current state**: Props are placed exclusively at $Y=0$. Upper platforms generated by the scaffold remain barren. Macro structures sit disconnected from ground navigation.
- **Needed architecture**: A 3D Spatial Occupancy / Surface Grid that detects any walkable horizontal surface ($Y > 0$), validates vertical headroom ($3.0\text{m}$ clearance), anchors stairs seamlessly from surface to surface, and populates multi-level balconies and sniper nests with authentic cover.

### Vector D: Real Pathfinding NavMesh & Sightline Analysis
- **Current state**: `map-simulate.js` uses straight-line pseudo-traversal and returns a semi-random score (`75 + random * 20`).
- **Needed architecture**: A discrete 2D/3D grid A* reachability solver. It must test:
  1. Can player walk from Spawn A to Spawn B without jumping or flying?
  2. Are all pickup items reachable via stairs/ramps?
  3. Are there unbroken $50\text{m}+$ line-of-sight death corridors that lack tactical cover?
  4. Is there continuous cover at $10-15\text{m}$ tactical intervals?

### Vector E: LLM Orchestration Engine (Replacing Mock Debates)
- **Current state**: `creative-debate.js` is a hardcoded stub returning pre-canned strings.
- **Needed architecture**: A structured LLM API integration layer (or offline agentic prompt protocol) where an LLM agent acts as:
  - **Level Architect**: Generates the 3D spatial layout JSON.
  - **Set Dresser**: Populates thematic prop clusters and storytelling details.
  - **Gameplay Auditor**: Evaluates sightlines and flow against competitive shooter principles.

---

## 15. TURNKEY META-PROMPT FOR EXTERNAL FRONTIER LLMs

Copy and paste the block below directly into an advanced LLM (Claude 3.7 Sonnet / Opus, OpenAI o3 / GPT-4.5, Gemini 2.0 Pro) along with this `report.md` file:

```markdown
You are a Principal Technical Level Designer and Lead Procedural Generation Architect specializing in competitive 3D tactical shooters and procedural geometry engines.

I have attached a comprehensive technical report (`report.md`) auditing "Dream", an automated procedural map generation engine for our 3D tactical shooter game (Doodle Strike). Doodle Strike is built with Three.js, using low-poly hand-drawn ballpoint/biro ink aesthetics.

### THE PROBLEM:
Despite having rich geometric primitives (`box`, `slab`, `cyl`, `barrel`, `sphere`, `stairs`, `ring`), 29 procedural prefabs, and a multi-stage pipeline, Dream produces generic, repetitive, flat "arena box" maps. It fails to match the spatial variety, verticality, and architectural density of our hand-crafted gold-standard level ("Giant Classroom", 782 LOC, multi-tier rooms, complex interior cover).

### YOUR MISSION:
Read the attached `report.md` carefully and provide a comprehensive, production-ready Architectural Upgrade Blueprint to transform Dream into a world-class procedural level generator. Specifically, address:

1. **Spatial Layout Engine Redesign**:
   - How should we replace the hardcoded 4-quadrant scaffold (`map-scaffold.js`) with an intelligent procedural spatial generator (e.g., Room Graph, 3D BSP, Shape Grammars, or WFC)? Provide concrete algorithmic architecture.
2. **Intermediate Scene Representation (AST)**:
   - Design a clean JSON intermediate format that bridges natural language concepts / LLM prompts and deterministic Three.js geometry compilation.
3. **True Multi-Tier Verticality & Navigability**:
   - Specify how to detect and populate elevated surfaces ($Y > 0$), calculate automatic, collision-safe stairs/ramps between levels, and place high-ground cover.
4. **Prop & Scene Composition Engine**:
   - Move away from random scattered props toward "prop vignettes" and contextual clustering (e.g. shipping stations, barricades, control rooms). Provide the schema and placement rules.
5. **Deterministic Gameplay Validation (True NavMesh & Sightlines)**:
   - Provide concrete, lightweight JavaScript algorithms for A* reachability, sightline raycasting/grid sampling, and cover density validation to replace the current random simulation score.
6. **Implementation Roadmap**:
   - Break down the overhaul into prioritized, high-leverage implementation phases with minimal disruption to the existing Three.js rendering pipeline.
```

---

*END OF REPORT — Feed this document to an advanced LLM for system upgrade analysis*
