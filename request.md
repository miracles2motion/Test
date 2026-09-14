# 🧠 DOODLE STRIKE — DREAM EVOLUTION & COMPLETE ARCHITECTURAL BRIEF
## "From Rigid Box-Stacker to a Living, Organic, Hand-Drawn Colossal World"

**Document Type**: Master Technical Specification, System Census & Algorithmic Request for Frontier LLMs (Claude 3.7 Sonnet/Opus, OpenAI o3/GPT-4.5, Gemini 2.0 Pro)  
**Project**: Doodle Strike (3D Solo & Multiplayer Tactical Shooter)  
**Runtime**: Three.js, Custom Biro Ink Crosshatching Shaders, Node.js Procedural Pipeline, Seeded PRNG  
**Date**: 2026-09-14  

---

## TABLE OF CONTENTS
1. [Executive Summary & Core Mission](#1-executive-summary--core-mission)
2. [The Soul of Doodle Strike: Miniature Doodles in Colossal Worlds](#2-the-soul-of-doodle-strike-miniature-doodles-in-colossal-worlds)
3. [Exhaustive Inventory of Dream's Current Systems & Features](#3-exhaustive-inventory-of-dreams-current-systems--features)
   - 3.1 The NLP Command Router (`dream.js`)
   - 3.2 The God Mode Orchestrator & 3-Mode State Machine (`src/dream-orchestrator.js`)
   - 3.3 The Macro-Dreamer Volumetric Void Scanner (`src/macro-dreamer.js`)
   - 3.4 The Prefab Observer & Auto-Harvester (`src/prefab-observer.js`)
   - 3.5 The Self-Healing Spatial Doctor & Boolean AABB Carving (`src/audit-healer.js` / `src/dream-healer.js`)
   - 3.6 Diagnostic Telemetry & Map Inspection (`tools/dream_inspect_cli.js` / `src/map-inspector.js`)
   - 3.7 Self-Learning, Genetic Mutation & Dead-Zone Blacklists (`src/map-learning.js`)
   - 3.8 The Consultation Ticket System (`src/dream-consultant.js`)
   - 3.9 Detailing & Concept Audit Gates (`verify-detailing.js` / `audit-concept.js`)
   - 3.10 Map Promotion & Graduation Pipeline (`graduate-map.js`)
4. [The Modern Dream Rebuild Architecture (Phases R0–R6)](#4-the-modern-dream-rebuild-architecture-phases-r0r6)
   - 4.1 R0: Deterministic PRNG & Thematic Memory Prior
   - 4.2 R1: The Typed Scene Tree AST & Atomic Compiler
   - 4.3 R2: Concept Interpreter & Tactical Zone Graph (Invariants G1–G5)
   - 4.4 R3: Spatial Embedder (5 Strategies) & 3D Layered Surface Grid
   - 4.5 R4: Mathematical Stair Router & Multi-Tier Vignette Composer
   - 4.6 R5: Discrete Grid A* Validation Engine & Auto-Repair Agenda
   - 4.7 R6: Director Agent & Offline Prompt Packet Protocol
5. [The Concept Document Standard (The 13 Mandatory Sections)](#5-the-concept-document-standard-the-13-mandatory-sections)
6. [The Geometry Builder API (`B`) & Runtime Contracts](#6-the-geometry-builder-api-b--runtime-contracts)
   - 6.1 Complete Implementation of `createBuilder(scene, world)`
   - 6.2 Physics, Collision & Navigation Octree Integration
   - 6.3 Hand-Drawn Ink Shading & Semantic Palette
   - 6.4 Level File Architecture: Hand Region vs. Dream Region
7. [Current Data Schemas & State Files](#7-current-data-schemas--state-files)
   - 7.1 `.agents/thematic-memory.json`
   - 7.2 Scene Tree AST JSON Schema
   - 7.3 `.agents/learning-cache.json`
8. [The Deep Diagnosis: Where Dream Falls Short](#8-the-deep-diagnosis-where-dream-falls-short)
   - 8.1 The "Cardboard Box" Primitive Trap
   - 8.2 The Static Clone Problem
   - 8.3 The Knowledge Wall & Missing In-Flight Apprentice Loop
   - 8.4 The Missing Colossal Everyday Object Metaphor
9. [What We Need From You: The 4 Core Architectural Deliverables](#9-what-we-need-from-you-the-4-core-architectural-deliverables)
   - [Deliverable 1: The Interactive Teacher-Apprentice Ingestion Protocol](#deliverable-1-the-interactive-teacher-apprentice-ingestion-protocol)
   - [Deliverable 2: Parametric & Organic Procedural Shape Generators](#deliverable-2-parametric--organic-procedural-shape-generators)
   - [Deliverable 3: Colossal Scale Anatomy & Traversal Highways](#deliverable-3-colossal-scale-anatomy--traversal-highways)
   - [Deliverable 4: Geometry Engine Extension (New Organic Primitives)](#deliverable-4-geometry-engine-extension-new-organic-primitives)
10. [Target File Manifest & Integration Hooks](#10-target-file-manifest--integration-hooks)
11. [Copy-Paste Frontier LLM Master Prompt](#11-copy-paste-frontier-llm-master-prompt)

---

## 1. EXECUTIVE SUMMARY & CORE MISSION

We are upgrading **Dream**, the autonomous procedural generation engine for **Doodle Strike**. 

Currently, Dream possesses a robust 10-stage architectural pipeline, an AST-based scene compiler, competitive flow graph solvers, and automated collision healing. However, its visual and spatial output is trapped in a **"cardboard box dystopia"**:
- Organic elements (trees, logs, boulders, cliffs) are built out of rigid 90-degree rectangular boxes (`box()` and `slab()`).
- A fallen "hollow log" is four rectangular slabs forming a square tunnel.
- Every tree in a forest is an identical, hardcoded clone.
- Dream operates as an offline, local Node.js script with zero intrinsic real-world knowledge. When asked to dream an unlearned theme (e.g. `beach`, `canyon`, `submarine`), it halts and fails because it does not know what objects compose those environments or how to construct them out of 3D primitives.

**Our End Goal**: We want Dream to generate **rich, organic, hand-drawn 3D environments that look hand-sketched in a notebook by an authentic human artist**, while maintaining strict competitive shooter flow (3-lane layouts, $1.8\text{m}$ clearance, $2.2\text{m}$ vertical headroom, deliberate waist/full cover, and momentum grapple chains).

This document details Dream's entire existing codebase, pipeline, builder contracts, and data structures so you can design the missing systems without ambiguity.

---

## 2. THE SOUL OF DOODLE STRIKE: MINIATURE DOODLES IN COLOSSAL WORLDS

To design systems for Doodle Strike, you must understand its narrative, aesthetic, and mechanical foundations:

### 2.1 Narrative & Aesthetic Premise
1. **The Notebook Universe**: The game takes place directly on the ruled lines and grid pages of a school notebook.
2. **The Hand-Drawn Biro Pen Art Style**:
   - Everything is rendered using custom Three.js shaders that simulate authentic ballpoint pen (biro) sketches.
   - Shading and depth are conveyed exclusively through **directional ink crosshatching density**.
   - There are **no textures, no normal maps, no UV wraps, and no PBR materials**.
   - The palette is strictly governed by 5 semantic inks:
     - `INK.BLUE` (`0` / `#1a365d`): Primary structural foundations, heavy architectural frames, background paper lines.
     - `INK.BLACK` (`2` / `#111111`): Structural trim, door jambs, metal bands, cables, gunmetal mechanisms.
     - `INK.ORANGE` (`3` / `#c05621`): Tactical interactables, cover blocks, railings, momentum grapple rings.
     - `INK.GREEN` (`4` / `#22543d`): Foliage, nature, health pickups, soft ground cover, organic vines.
     - `INK.RED` (`1` / `#742a2a`): Hazard zones, explosive barrels, lethal drop markers, enemy spawn barriers.
3. **The Colossal Scale Premise**:
   - The player character is a miniature ink-drawn figure ($1.8\text{m}$ tall in engine units).
   - The environment is **monumentally oversized**:
     - **The Giant Classroom** (Gold-Standard Benchmark): A hardback textbook is an angled multi-story ramp; a yellow pencil is a colossal fallen log barricade; an eraser is a waist-high bunker; a desk is a towering fortress; an overhead desk lamp is an apex grapple perch.
     - **The Colossal Canopy** (Forest): Trees are not small game props—they are titan redwoods where root buttresses form labyrinthine canyon walls, a fallen hollow log is a sprint-through CQB corridor, shelf mushrooms form spiral staircases climbing the trunk, and the canopy is an elevated combat deck $20\text{m}$ in the air.
     - **The Library**: Stacks of encyclopedias form stepped battlements, open bookmark ribbons act as balance-beam catwalks, and inkwells provide circular waist cover.
     - **The Beach**: A conch shell is a fortified command bunker; driftwood branches form high-angle catwalks; sand ripples act as tactical defilade berms; a coconut is a spherical micro-boulder.

### 2.2 Tactical Movement & Combat Mechanics
- **High Mobility**: Sliding, double-jumping, wall-kicking, and high-speed momentum grapple swinging.
- **Torus Grapple Rings (`ring(x, y, z, orient)`)**: Orange rings hung from ceilings and overhead branches that players hook onto with grapple cables to convert vertical fall velocity into high-speed horizontal traversal.
- **Tactical Cover Standards**:
  - **Waist-High Cover**: Exactly $0.8\text{m} - 1.3\text{m}$ high. Allows crouch-peeking and shooting over edges.
  - **Full Cover**: Exactly $2.5\text{m} - 3.0\text{m}$ high. Blocks sniper sightlines completely.
- **Clearance & Headroom Invariants**:
  - Minimum **$1.8\text{m}$ horizontal clearance** in all corridors to prevent player snagging.
  - Minimum **$2.2\text{m}$ continuous vertical headroom** along all paths, ramps, and stairways to prevent collision snagging during high-speed slides.
  - Stair steps: Step rise $\le 0.30\text{m}$ (ideal $0.25-0.28\text{m}$), step run $\ge 0.45\text{m}$. Mandatory rest landings for vertical climbs $>5.0\text{m}$.

---

## 3. EXHAUSTIVE INVENTORY OF DREAM'S CURRENT SYSTEMS & FEATURES

Dream is not a single script; it is a full suite of interlocking command-line tools, spatial analyzers, and procedural modules:

```
                                  USER TERMINAL
                           "npm run dream 'god forest 2x'"
                                         │
                                         ▼
                             dream.js (NLP CLI Router)
                     Regex parser, multiplier loop, action router
                                         │
                                         ▼
                      src/dream-orchestrator.js (God Mode)
                   State Detection: Mode 1 | Mode 2 | Mode 3
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
  Mode 1: NOTHING                  Mode 2: CONCEPT                  Mode 3: MAP
  No concept, no level file.       Concept markdown exists.         Level .js file exists.
  1. Checks thematic-memory.       1. Parses 13-section doc         1. Runs Spatial Doctor
  2. Generates 13-section .md.     2. Extracts zones & tiers        2. Scans 3D empty voids
  3. Scaffolds new map file.       3. Scaffolds map geometry        3. Injects macro structures
  4. Triggers Rebuild Pipeline.    4. Triggers Rebuild Pipeline.    4. Carves AABB collisions
        │                                │                                │
        └────────────────────────────────┼────────────────────────────────┘
                                         ▼
                            src/rebuild/ (Phases R0-R6)
              [PRNG] → [Concept Interpreter] → [Zone Graph] → [Embedder]
                 → [Surface Grid] → [Stairs] → [Vignettes] → [A* Solver]
                                         │
                                         ▼
                           src/rebuild/scene-compiler.js
              Emits deterministic Three.js code into // === DREAM REGION ===
                                         │
                                         ▼
                       Quality Audits & Safety Verification
               npm run audit:concept  ──►  audit-concept.js (13 Sections)
               npm run audit:map      ──►  verify-detailing.js (Triad & 0.3m Rule)
               npm run map:simulate   ──►  src/map-simulate.js (Bot Flow Scorer)
                                         │
                                         ▼
                          Self-Learning & Cache Storage
              .agents/learning-cache.json (Successes, Dead-Zones, Mutations)
```

### 3.1 The NLP Command Router (`dream.js`)
- **CLI Entry Point**: Users invoke `npm run dream "<prompt>"`.
- **Multiplier Loops (`Nx`)**: Parses commands like `npm run dream "god forest 3x"`, looping generation 3 times sequentially to iterate and evolve layouts.
- **Action Detection**:
  - `god` / `godmode` $\to$ Routes to `npm run dream:god <map> [theme]`.
  - `heal` $\to$ Routes to `node src/map-refiner.js <map> heal`.
  - `detail` $\to$ Routes to `node src/map-refiner.js <map> detail`.
  - `macro` $\to$ Routes to `npm run dream:macro <map> [theme]`.
  - `inject` $\to$ Routes to `npm run dream:inject <map> [theme]`.
  - `inspect` / `audit` $\to$ Routes to `node tools/dream_inspect_cli.js <map>`.
  - `graduate` $\to$ Routes to `node graduate-map.js <map>`.
  - `teach` / `consult` $\to$ Routes to `node src/dream-consultant.js <cmd>`.
- **Dynamic Theme Resolution**: If no theme is explicitly passed, scans `.agents/thematic-memory.json` keywords and matching markdown concept files in `map_concepts/` and `Map Description/`.

### 3.2 The God Mode Orchestrator (`src/dream-orchestrator.js`)
Manages execution across three operational modes:
- **Mode 1 (NOTHING)**: Triggered when neither a concept markdown nor a level JS file exists. It looks up `.agents/thematic-memory.json` to synthesize an initial 13-section concept document, scaffolds a pristine level file, triggers the rebuild pipeline, and runs detailing audits.
- **Mode 2 (CONCEPT)**: Triggered when a concept document exists in `map_concepts/` or `Map Description/`, but no level JS file exists. Parses the document, builds spatial zones, routes stairways, inserts prefabs, and validates reachability.
- **Mode 3 (MAP)**: Triggered when an active level JS file exists. Activates the **Spatial Doctor**: detects broken colliders, fixes duplicate geometry, executes volumetric void analysis, injects missing macro-structures, and executes auto-remedy carving.
- **Timeout & Panic Recovery**: Implements strict timeouts (e.g. 60s). Catastrophic errors trigger an ASCII visual panic alert in the terminal.

### 3.3 The Macro-Dreamer Volumetric Void Scanner (`src/macro-dreamer.js`)
- **Purpose**: Scans existing level geometry looking for contiguous empty 3D spatial pockets (voids measuring $\ge 10\text{m} \times 7\text{m} \times 10\text{m}$).
- **Dry-Run Sandbox**: When a void is found, it instantiates candidate macro prefabs in a virtual Three.js sandbox to ensure they do not emit `NaN` coordinates or illegal bounds.
- **Dead-Zone Filtering**: Queries `.agents/learning-cache.json` to ensure the candidate position is not inside a known historical failure blacklist.
- **Injection**: Injects clean JavaScript calls into the target level file.

### 3.4 The Prefab Observer & Auto-Harvester (`src/prefab-observer.js`)
- **Purpose**: Reverse-engineers human level design.
- **Operation**: Scans map files for manual primitives added by human developers inside the `// === HAND REGION ===`.
- **Clustering**: Uses spatial clustering mathematics to identify groups of primitives within a $6.0\text{m}$ radius.
- **Auto-Extraction**: Converts absolute world coordinates into origin-relative offsets, synthesizes a new reusable JavaScript function (e.g. `buildCustomBunker(B, x, y, z)`), appends it to `src/prefabs.js`, and registers it into Dream's catalog.

### 3.5 The Self-Healing Spatial Doctor & Boolean AABB Carving (`src/audit-healer.js` / `src/dream-healer.js`)
- **Collision Detection**: Runs geometric intersection checks between all solid colliders in the map.
- **Auto-Remedy (`carveAABB`)**: When two colliders illegally intersect (e.g. a newly placed bunker intersecting a pre-existing ramp), it computes the boolean intersection volume, splits the lower-priority collider into non-overlapping sub-boxes, and updates the level file code in-place.

### 3.6 Diagnostic Telemetry & Map Inspection (`tools/dream_inspect_cli.js` / `src/map-inspector.js`)
- Provides instant command-line telemetry:
  - Total geometry count and collider volume.
  - Spawn balance: verifies all spawns are grounded ($Y \approx 0.2\text{m}$) and have clear sightline cover.
  - Sniper balance: verifies sniper nests have $\ge 2$ escape routes and unobstructed vantage angles.
  - Grapple chain continuity: measures distance between adjacent Torus rings ($<18\text{m}$ spacing).
  - Walkway clearances: flags any passage narrower than $1.8\text{m}$ or with headroom $<2.2\text{m}$.

### 3.7 Self-Learning, Genetic Mutation & Dead-Zone Blacklists (`src/map-learning.js`)
- **Persistent State**: Cached in `.agents/learning-cache.json`.
- **Success Registry**: Layouts and prop positions that score $>80/100$ in flow simulations are saved as high-confidence spatial templates.
- **Genetic Mutation**: When Dream re-uses a successful template, it rolls a **20% mutation chance** to shift X/Z coordinates by $\pm 1.5\text{m}$. If the mutated layout achieves a higher score, the memory is updated.
- **Failure Blacklist (Dead Zones)**: Coordinates where spawns hung in mid-air or players fell through geometry are blacklisted; the generator is forbidden from placing assets there.
- **Rolling Error Rate**: Tracks failure rates over rolling 20-run windows, dynamically tightening spatial padding rules if failures increase.

### 3.8 The Consultation Ticket System (`src/dream-consultant.js`)
- When Dream encounters an unlearned theme or missing architectural parameter, it creates a ticket in `.agents/tickets/`.
- CLI commands:
  - `npm run dream:teach` / `node src/dream-consultant.js list`: Lists unresolved tickets.
  - `node src/dream-consultant.js resolve <id> <data>`: Applies resolution and updates memory.

### 3.9 Detailing & Concept Audit Gates
- `npm run audit:concept [concept]`: Runs `audit-concept.js` to ensure concept markdown contains all 13 required sections, valid tier taxonomies, and proper stair rise/run math.
- `npm run audit:map [mapKey]`: Runs `verify-detailing.js` to enforce the **Universal Detailing Standard**:
  - **The Skeleton-Skin-Trim Triad**: Base structural frames (Skeleton), walkable surfaces (Skin), decorative trim (Trim).
  - **The 0.3m Detail Rule**: Any decorative prop feature with dimension $<0.3\text{m}$ MUST have `noCollide: true` to prevent physics glitches.
  - **Ink Palette Semantic Compliance**: Enforces that interactables use `INK.ORANGE`, hazard triggers use `INK.RED`, and structures use `INK.BLUE`/`INK.BLACK`.

### 3.10 Map Promotion & Graduation Pipeline (`graduate-map.js`)
- Promotes experimental Dream maps into production:
  - Registers the map into `LEVELS` array in `src/level.js`.
  - Imports and links the builder function in `MAP_BUILDERS`.
  - Generates SVG radar thumbnails and 200x100 blueprint dossier graphics for the UI lobby in `src/main.js`.
  - Removes `comingSoon: true` lock once the map passes all audit scores ($\ge 7.0/10$).

---

## 4. THE MODERN DREAM REBUILD ARCHITECTURE (PHASES R0–R6)

To eliminate hardcoded hacks, Dream was recently upgraded with a deterministic, modular pipeline located in `src/rebuild/`. All components have passed 100% of unit test suites:

### 4.1 R0: Deterministic PRNG & Thematic Memory Prior (`src/rebuild/prng.js`)
- Uses **Mulberry32**, a fast 32-bit seeded pseudo-random number generator:
  - `createRNG(seed)`: Returns predictable floats $[0, 1)$.
  - `hashSeed(str)`: Converts string map names into 32-bit seeds.
- Guarantees identical generation results across platforms for any given seed.

### 4.2 R1: The Typed Scene Tree AST & Atomic Compiler
- **AST Schema (`src/rebuild/scene-tree-schema.js`)**:
  - All level elements are represented as strongly-typed JSON nodes (`room`, `corridor`, `platform`, `cover_block`, `stairs_flight`, `grapple_ring`, `prop_instance`).
  - Implements L1 schema validation and L2 spatial overlap detection.
- **Deterministic Compiler (`src/rebuild/scene-compiler.js`)**:
  - Translates the Scene Tree AST directly into clean JavaScript Three.js calls.
  - Targets an isolated, atomic code section: `// === DREAM REGION ===` ... `// === END DREAM REGION ===`.
  - Human hand-crafted code in `// === HAND REGION ===` is permanently protected and never overwritten.

### 4.3 R2: Concept Interpreter & Tactical Zone Graph
- **Concept Interpreter (`src/rebuild/concept-interpreter.js`)**:
  - Parses markdown Sections 4–8 into a machine-readable `ZoneProgram`.
  - Extracts world bounds, lane assignments, tier elevations, and prop allocations.
- **Zone Graph (`src/rebuild/zone-graph.js`)**:
  - Synthesizes competitive 3-lane topology graphs enforcing invariants G1–G5:
    - **G1**: Spawns are placed in dedicated baseline zones with $\ge 25\text{m}$ separation.
    - **G2**: Mid zone connects to both spawns via at least 2 edge-disjoint paths.
    - **G3**: Flank lanes bypass Mid directly.
    - **G4**: Zero dead-ends across the play space.
    - **G5**: Sniper perches have valid sightlines into lanes but include flanking rear access.

### 4.4 R3: Spatial Embedder & 3D Layered Surface Grid
- **Spatial Embedder (`src/rebuild/spatial-embedder.js`)**:
  - Embeds zone graph nodes into continuous 3D bounding boxes.
  - Implements 5 distinct macro-layout strategies:
    - `arena_ring`: Circular concentric combat arena with perimeter vantage rings.
    - `warren`: Dense, angular CQB labyrinth with sudden sightline cuts.
    - `cathedral_cross`: Monumental cruciform layout with towering central nave and flanking aisles.
    - `terraced`: Stepped elevation plates descending from North to South.
    - `ravine`: Narrow, winding low chasm flanked by towering cliff catwalks.
  - Uses iterative AABB relaxation to prevent room collisions.
- **Surface Grid (`src/rebuild/surface-grid.js`)**:
  - Rasterizes 3D space into a 2m layered occupancy grid.
  - Tracks surface elevations ($Y$) and verifies continuous vertical headroom ($>2.2\text{m}$).

### 4.5 R4: Mathematical Stair Router & Multi-Tier Vignette Composer
- **Stair Router (`src/rebuild/stair-router.js`)**:
  - Calculates stair geometry: step rise $\le 0.30\text{m}$, step run $\ge 0.45\text{m}$.
  - Splits stair flights into intermediate rest landings for vertical ascents $>5.0\text{m}$.
  - Automatically synthesizes safety edge guardrails (`rail()`) along drop boundaries $>3.0\text{m}$.
- **Vignette Composer (`src/rebuild/vignette-composer.js`) & Library (`vignette-library.js`)**:
  - Places contextual micro-scenes from a prefab slot grammar across multiple elevations (Ground $Y=0$, Tier 2 $Y=4-6\text{m}$, Tier 3 $Y=8-12\text{m}$).

### 4.6 R5: Discrete Grid A* Validation Engine & Auto-Repair Agenda
- **Discrete Grid A* Solver (`src/rebuild/validation-engine.js`)**:
  - Solves pathfinding from every team spawn to Mid and across flank corridors.
  - Simulates jump capabilities (maximum jump height $2.5\text{m}$, slide gap distance $3.5\text{m}$).
  - Honest Scoring (0–100): Evaluates spawn separation, cover intervals, sniper balance, and grapple continuity.
- **Bounded Auto-Repair Agenda (`src/rebuild/repair-agenda.js`)**:
  - If validation finds disconnected zones or pinched hallways, executes up to 5 bounded repair passes (inserting connecting ramps, carving bottlenecks, adding cover).

### 4.7 R6: Director Agent & Offline Prompt Packet Protocol (`src/rebuild/director-agent.js`)
- Provides a deterministic offline fallback (`StandinDirector`) for running without LLMs.
- Generates structured Markdown prompt packets (`generatePromptPacket`) summarizing scene tree state, validation metrics, and repair agendas for frontier LLM consultation.

---

## 5. THE CONCEPT DOCUMENT STANDARD (THE 13 MANDATORY SECTIONS)

Every map generated or audited by Dream must comply with the 13-section technical concept standard:

| Section # | Title | Content & Purpose |
|---|---|---|
| **Section 1** | **Identity & Meta** | Map key, display name, tactical archetype (`urban`, `colossal`, `anomalous`), scale tier, env description. |
| **Section 2** | **Narrative Lore & Notebook Premise** | Notebook page context, hand-drawn stationery metaphors, colossal world scaling. |
| **Section 3** | **Palette & Biro Ink Hierarchy** | Precise mapping of structure, cover, mechanisms, nature, and hazards to the 5 INK constants. |
| **Section 4** | **Scale & Dimensional Geometry** | Playable bounding box ($X, Y, Z$), ground datum, player height ($1.8\text{m}$), perimeter boundary walls. |
| **Section 5** | **Macro Layout & 3-Lane Topology** | Mid lane, West flank, East flank, chokepoints, sightline cuts, cover distribution. |
| **Section 6** | **Elevation, Verticality & Headroom** | Tier 1 (Ground $Y=0$), Tier 2 ($Y=4-6\text{m}$), Tier 3 ($Y=8-12\text{m}$), continuous $2.2\text{m}$ headroom standard. |
| **Section 7** | **Quadrant & Sector Breakdown** | Detailed dimensions and tactical roles of NW, NE, SW, SE sectors and Mid hub. |
| **Section 8** | **Prop Taxonomy (Tiers 1–4)** | Tier 1 (Cover props), Tier 2 (Tactical furniture/catwalks), Tier 3 (Landmarks), Tier 4 (Hero set-pieces). |
| **Section 9** | **Stairway, Ramp & Landing Math** | Step rise ($0.25-0.28\text{m}$), run ($0.45-0.50\text{m}$), landing split rules, headroom clearances. |
| **Section 10** | **Grapple Line System** | Ring coordinate placements, overhead heights ($+6\text{m}$ to $+10\text{m}$), swing arc wall clearances. |
| **Section 11** | **Spawns, Objectives & Weapon Nodes** | Team 0 and Team 1 spawn baselines, capture point coordinates, sniper vantage perches. |
| **Section 12** | **Hazard & Kinetic Elements** | Lethal abyss fall zones, kinetic paper planes, rotating mechanisms, damage fields. |
| **Section 13** | **Quality Gate & Validation Checklist** | Explicit verification checkboxes: pinch clearances, headroom, spawn grounding, detail triad. |

---

## 6. THE GEOMETRY BUILDER API (`B`) & RUNTIME CONTRACTS

Every map in Doodle Strike is built by a function `buildLevel_<mapName>(B)`.  
The builder object `B` is instantiated in `src/level.js` via `createBuilder(scene, world)`.

### 6.1 Complete Implementation of `createBuilder` from `src/level.js`
Here is the exact production implementation currently driving the game:

```javascript
function createBuilder(scene, world) {
  const geos = {}; 
  const L = { 
    rings: [], spawns: [], snipers: [], pickups: [], animated: [], meshes: [], 
    playerStart: new THREE.Vector3(0, 0, 42), 
    bounds: { minX: -55, maxX: 55, minZ: -55, maxZ: 55 }, 
    arenaSpawns: [], grappleMovers: [], breakables: [], key: 'custom_map' 
  };
  
  const addGeo = (g, ink) => (geos[ink] || (geos[ink] = [])).push(g);

  // Physics Collider Registration
  const collider = (x, y, z, w, h, d, o = {}) => {
    const min = { x: x - w / 2, y, z: z - d / 2 };
    const max = { x: x + w / 2, y: y + h, z: z + d / 2 };
    looseOctree.addAABB([min.x, min.y, min.z], [max.x, max.y, max.z]);
    return world.addBox(min, max, { 
      noNav: !!o.noNav, 
      noShoot: !!o.noShoot, 
      noGrapple: !!o.noGrapple, 
      tag: o.tag 
    });
  };

  // 1. Box Primitive: Centered at (x, y + h/2, z) with size (w, h, d)
  function box(x, y, z, w, h, d, o = {}) {
    const sw = Number.isFinite(w) && w > 0 ? w : 0.4;
    const sh = Number.isFinite(h) && h > 0 ? h : 0.4;
    const sd = Number.isFinite(d) && d > 0 ? d : 0.4;
    const sx = Number.isFinite(x) ? x : 0;
    const sy = Number.isFinite(y) ? y : 0;
    const sz = Number.isFinite(z) ? z : 0;
    const g = new THREE.BoxGeometry(sw, sh, sd);
    g.translate(sx, sy + sh / 2, sz);
    addGeo(g, o?.ink ?? INK.BLUE);
    if (!o?.noCollide) collider(sx, sy, sz, sw, sh, sd, o);
  }

  // 2. Slab Primitive: Horizontal surface from (x1, z1) to (x2, z2) with top surface at y
  const slab = (x1, z1, x2, z2, y, t = 0.4, o = {}) => {
    const st = typeof t === 'number' && Number.isFinite(t) ? t : 0.4;
    const so = typeof t === 'object' && t !== null && !o ? t : (o || {});
    return box((x1 + x2) / 2, y - st, (z1 + z2) / 2, Math.abs(x2 - x1), st, Math.abs(z2 - z1), so);
  };

  // 3. Wall Segment Generators with Gaps
  function wallPieces(a1, a2, h, gaps) {
    const xs = new Set([a1, a2]);
    for (const g of gaps) { xs.add(Math.min(Math.max(g[0], a1), a2)); xs.add(Math.min(Math.max(g[1], a1), a2)); }
    const sorted = [...xs].sort((a, b) => a - b); const runs = new Map(); const out = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const s1 = sorted[i], s2 = sorted[i + 1]; if (s2 - s1 < 0.005) continue; const mid = (s1 + s2) / 2;
      const cuts = gaps.filter((g) => g[0] <= mid && g[1] >= mid).map((g) => [g[2] ?? 0, g[3] ?? h]).sort((a, b) => a[0] - b[0]);
      const pieces = []; let y = 0;
      for (const [gb, gt] of cuts) { if (gb > y + 0.005) pieces.push([y, gb]); y = Math.max(y, gt); }
      if (y < h - 0.005) pieces.push([y, h]);
      const keys = new Set();
      for (const [yb, yt] of pieces) { const k = yb.toFixed(3) + ',' + yt.toFixed(3); keys.add(k); const r = runs.get(k); if (r && Math.abs(r[1] - s1) < 0.005) r[1] = s2; else runs.set(k, [s1, s2, yb, yt]); }
      for (const [k, r] of [...runs]) if (!keys.has(k)) { out.push(r); runs.delete(k); }
    }
    for (const r of runs.values()) out.push(r);
    return out;
  }
  function wallX(x1, x2, z, y, h, t, gaps = [], o = {}) {
    for (const [a, b, yb, yt] of wallPieces(x1, x2, h, gaps)) box((a + b) / 2, y + yb, z, b - a, yt - yb, t, o);
  }
  function wallZ(z1, z2, x, y, h, t, gaps = [], o = {}) {
    for (const [a, b, yb, yt] of wallPieces(z1, z2, h, gaps)) box(x, y + yb, (a + b) / 2, t, yt - yb, b - a, o);
  }

  // 4. Stepped Stairs Flight
  function stairs(x, y, z, dir, steps, width, o = {}) {
    const rise = o.rise ?? 4 / 14, run = o.run ?? 0.45;
    const dx = dir === '+x' ? 1 : dir === '-x' ? -1 : 0, dz = dir === '+z' ? 1 : dir === '-z' ? -1 : 0;
    for (let i = 0; i < steps; i++) {
      const c = (i + 0.5) * run, h = (i + 1) * rise; const cx = x + dx * c, cz = z + dz * c;
      box(cx, y, cz, dx ? run + 0.004 : width, h, dz ? run + 0.004 : width, o);
    }
    const endPt = { x: x + dx * steps * run, z: z + dz * steps * run, y: y + steps * rise };
    if (!L.stairways) L.stairways = [];
    L.stairways.push({ start: { x, y, z }, end: endPt, steps, rise, run, width, dir, opts: o });
    return endPt;
  }

  // 5. Safety Guardrail: Axis-aligned posts + handrail
  function rail(x1, z1, x2, z2, y, o = {}) {
    const len = Math.hypot(x2 - x1, z2 - z1); const ax = Math.abs(x2 - x1) > Math.abs(z2 - z1);
    const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2;
    box(cx, y + 0.9, cz, ax ? len : 0.12, 0.12, ax ? 0.12 : len, { noCollide: true, ink: o.ink });
    const n = Math.max(1, Math.round(len / 2));
    for (let i = 0; i <= n; i++) { const t = i / n; box(x1 + (x2 - x1) * t, y, z1 + (z2 - z1) * t, 0.1, 0.9, 0.1, { noCollide: true, ink: o.ink }); }
    collider(cx, y, cz, ax ? len : 0.12, 1.0, ax ? 0.12 : len, { noNav: true, noShoot: true });
  }

  // 6. Cylinder Primitive: Vertical or Horizontal (axis: 'x' | 'z')
  function cyl(x, y, z, r, h, o = {}) {
    const g = new THREE.CylinderGeometry(r, r, h, o.seg ?? 12);
    if (o.axis === 'z') {
      g.rotateX(Math.PI / 2);
      g.translate(x, y, z);
      addGeo(g, o.ink ?? INK.BLUE);
      if (!o.noCollide) collider(x, y - r, z, r * 1.8, r * 2, h, o);
    } else if (o.axis === 'x') {
      g.rotateZ(Math.PI / 2);
      g.translate(x, y, z);
      addGeo(g, o.ink ?? INK.BLUE);
      if (!o.noCollide) collider(x, y - r, z, h, r * 2, r * 1.8, o);
    } else {
      g.translate(x, y + h / 2, z);
      addGeo(g, o.ink ?? INK.BLUE);
      if (!o.noCollide) collider(x, y, z, r * 1.6, h, r * 1.6, o);
    }
  }

  // 7. Composite Wooden Barrel with Iron Bands
  function barrel(x, y, z, r, h, o = {}) {
    cyl(x, y + h * 0.7, z, r * 0.85, h * 0.3, o);
    cyl(x, y + h * 0.3, z, r, h * 0.4, o);
    cyl(x, y, z, r * 0.85, h * 0.3, o);
    cyl(x, y + h * 0.25, z, r * 0.95, h * 0.05, { ink: INK.BLACK, noCollide: true });
    cyl(x, y + h * 0.7, z, r * 0.95, h * 0.05, { ink: INK.BLACK, noCollide: true });
  }

  // 8. Cone Primitive
  function cone(x, y, z, r, h, o = {}) {
    const g = new THREE.ConeGeometry(r, h, o.seg ?? 16);
    if (o.axis === 'z') g.rotateX(Math.PI / 2);
    else if (o.axis === 'x') g.rotateZ(-Math.PI / 2);
    else g.translate(0, h / 2, 0);
    g.translate(x, y, z);
    addGeo(g, o.ink ?? INK.BLUE);
    if (!o.noCollide) collider(x, y, z, r * 2, h, r * 2, o);
  }

  // 9. Wedge Primitive (Sloped Ramp)
  function wedge(x, y, z, w, h, d, o = {}) {
    const sw = Number.isFinite(w) && w > 0 ? w : 1;
    const sh = Number.isFinite(h) && h > 0 ? h : 1;
    const sd = Number.isFinite(d) && d > 0 ? d : 1;
    const g = new THREE.BoxGeometry(sw, sh, sd);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      if (pos.getX(i) > 0.001 && pos.getY(i) > 0.001) pos.setY(i, -sh / 2);
    }
    g.computeVertexNormals();
    g.translate(0, sh / 2, 0); 
    if (o.dir === '-x') g.rotateY(Math.PI);
    else if (o.dir === '+z') g.rotateY(-Math.PI / 2);
    else if (o.dir === '-z') g.rotateY(Math.PI / 2);
    g.translate(x, y, z);
    addGeo(g, o.ink ?? INK.BLUE);
    if (!o.noCollide) collider(x, y, z, sw, sh, sd, o);
  }

  // 10. Sphere Primitive
  function sphere(x, y, z, r, o = {}) { 
    const g = new THREE.SphereGeometry(r, o.seg ?? 10, o.seg ?? 8); 
    g.translate(x, y, z); 
    addGeo(g, o.ink ?? INK.BLUE); 
  }

  // 11. Torus Grapple Ring
  function ring(x, y, z, axis = 'z') {
    const g = new THREE.TorusGeometry(0.6, 0.1, 8, 20);
    if (axis === 'x') g.rotateY(Math.PI / 2); else if (axis === 'y') g.rotateX(Math.PI / 2);
    g.translate(x, y, z); 
    addGeo(g, INK.ORANGE);
    L.rings.push(new THREE.Vector3(x, y, z));
  }

  // 12. Gameplay Node Markers
  const spawn = (x, y, z) => L.spawns.push(new THREE.Vector3(x, y, z));
  const sniper = (x, y, z) => L.snipers.push(new THREE.Vector3(x, y, z));
  const pickup = (x, y, z) => L.pickups.push(new THREE.Vector3(x, y, z));

  // 13. Atmospheric Circling Paper Planes
  function planes(n, baseR, baseH, o = {}) {
    const sc = o.scale || 1;
    for (let i = 0; i < n; i++) {
      const g = new THREE.ConeGeometry(1.2 * sc, 4 * sc, 3); g.rotateX(Math.PI / 2);
      const m = new THREE.Mesh(g, makeInkMaterial({ ink: o.ink ?? INK.BLUE })); 
      scene.add(m); L.meshes.push(m);
      L.grappleMovers.push({ mesh: m, radius: 2.2 * sc });
      const r = baseR + i * (o.rStep ?? 12), h = baseH + i * (o.hStep ?? 6), ph = i * 2.1, sp = (o.speed ?? 0.11) + i * 0.01;
      L.animated.push({ 
        mesh: m, 
        update: (t) => { 
          const a = t * sp + ph; 
          m.position.set(Math.cos(a) * r, h + Math.sin(a * 2.3) * 3, Math.sin(a) * r * 0.7); 
          m.lookAt(Math.cos(a + 0.05) * r, h + Math.sin((a + 0.05) * 2.3) * 3, Math.sin(a + 0.05) * r * 0.7); 
          m.rotateZ(Math.sin(a * 3) * 0.6); 
        } 
      });
    }
  }

  // 14. Geometry Merging & Scene Finalization
  function finish() {
    for (const ink in geos) {
      const merged = mergeGeometries(geos[ink], false);
      const mesh = new THREE.Mesh(merged, makeInkMaterial({ ink: Number(ink) }));
      mesh.matrixAutoUpdate = false; 
      scene.add(mesh); 
      L.meshes.push(mesh);
    }
    world.finalize();
    return L;
  }

  return { L, addGeo, collider, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, barrel, cone, wedge, ring, spawn, sniper, pickup, finish, planes, scene, world };
}
```

### 6.2 Physics, Collision & Navigation Octree Integration
- Every physical object registers its axis-aligned bounding box into `looseOctree` (`looseOctree.addAABB(min, max)`).
- Colliders are stored in the physics simulation `world` via `world.addBox(min, max, opts)`.
- Player motion uses swept AABB collision tests with sliding along wall planes.
- **The Navigation Grid**: The AI bot navmesh is voxelized directly from the colliders in `world`. Any geometry marked `{ noNav: true }` is excluded from bot pathfinding.
- **The 0.3m Threshold Rule**: If a micro-detail has any dimension $<0.3\text{m}$, it must be flagged with `noCollide: true`. If small colliders are left active, player collision hulls snag on them during slides and jump-kicks.

### 6.3 Level File Architecture: Hand Region vs. Dream Region
Level files are organized to protect human creativity while enabling fully automated machine iteration:

```javascript
export function buildLevel_forest(B, arena = false) {
  const { L, box, slab, stairs, cyl, ring, spawn, sniper, pickup, planes, barrel, rail } = B;
  const BL = INK.BLUE, BK = INK.BLACK, OR = INK.ORANGE, GR = INK.GREEN, RD = INK.RED;

  L.key = 'forest';
  L.bounds = { minX: -55, maxX: 55, minZ: -55, maxZ: 55 };

  // ==================== HAND REGION (NEVER TOUCHED BY DREAM) ====================
  // Human architects write custom hero structures, story elements, or unique landmarks here.
  // Dream's parser is strictly forbidden from editing or deleting this section.
  
  // ==================== DREAM REGION (WHOLESALE REGENERATED) ====================
  // Auto-generated tactical blockout compiled from the Scene Tree AST.
  // When Dream runs a rebuild or repair pass, this entire block is replaced cleanly.
  // ==================== END DREAM REGION ====================

  return L;
}
```

---

## 7. CURRENT DATA SCHEMAS & STATE FILES

### 7.1 Thematic Memory (`.agents/thematic-memory.json`)
Dream loads this file on startup to determine layouts, ink hierarchies, prop choices, and safety clearances:

```json
{
  "thematicArchetypes": {
    "forest": {
      "keywords": ["forest", "woodland", "grove", "timber", "trees", "canopy"],
      "layoutPrior": "terraced",
      "primaryInk": "INK.GREEN",
      "secondaryInk": "INK.BLACK",
      "accentInk": "INK.ORANGE",
      "hazardInk": "INK.RED",
      "props": {
        "tier1_micro": ["campfire", "wood_stack", "chopping_block"],
        "tier2_meso": ["hollow_log_tunnel", "suspended_rope_bridge", "survey_table"],
        "tier3_macro": ["towering_ancient_banyan", "alpine_conifer_spire"],
        "tier4_kinetic": ["swaying_boughs", "gliding_paper_leaves"]
      }
    },
    "maritime": {
      "keywords": ["pirate", "cove", "docks", "ship", "ocean", "harbor", "beach"],
      "layoutPrior": "ravine",
      "primaryInk": "INK.BLUE",
      "secondaryInk": "INK.BLACK",
      "accentInk": "INK.ORANGE",
      "hazardInk": "INK.RED",
      "props": {
        "tier1_micro": ["rum_barrel_stack", "mooring_bollard", "cargo_net"],
        "tier2_meso": ["tactical_cannon", "cargo_crane_gantry", "driftwood_catwalk"],
        "tier3_macro": ["galleon_shipwreck", "crows_nest_mast"],
        "tier4_kinetic": ["circling_seagulls", "swinging_rigging"]
      }
    }
  },
  "safetyClearances": {
    "walkwayPinch": 1.8,
    "stairHeadroom": 2.2,
    "ringWallClearance": 1.5,
    "coverMinHeight": 0.8,
    "coverMaxHeight": 1.3
  }
}
```

### 7.2 Scene Tree AST JSON Schema (`src/rebuild/scene-tree-schema.js`)
The intermediate representation compiled into level JavaScript:

```json
{
  "schema": "dream-scene-tree/1.0",
  "map": "forest",
  "seed": 1337,
  "strategy": "terraced",
  "nodes": [
    {
      "id": "zone_mid_canopy",
      "type": "platform",
      "transform": { "x": 0, "y": 8.0, "z": 0, "w": 24, "h": 0.6, "d": 20 },
      "params": { "elevation": 8.0, "thickness": 0.6 },
      "tags": { "zone": "mid", "ink": "GR", "role": "combat_deck" },
      "children": ["cover_boulder_1", "grapple_overhead_1"],
      "cost": { "geometryCalls": 1, "colliders": 1 }
    },
    {
      "id": "cover_boulder_1",
      "type": "cover_block",
      "transform": { "x": -4.0, "y": 8.6, "z": 2.0, "w": 2.4, "h": 1.1, "d": 1.2 },
      "params": {},
      "tags": { "ink": "BK", "coverType": "waist" },
      "children": [],
      "cost": { "geometryCalls": 1, "colliders": 1 }
    }
  ]
}
```

### 7.3 Learning Cache (`.agents/learning-cache.json`)
The memory tracking historical successes, dead zones, and genetic mutations:

```json
{
  "successRegistry": {
    "forest_mid_bunker": { "x": 0, "y": 0, "z": 0, "score": 88.5, "usageCount": 12 }
  },
  "failureBlacklist": [
    { "map": "forest", "x": -22, "y": 14, "z": 10, "radius": 4.0, "reason": "ungrounded_spawn" }
  ],
  "rollingErrorRate": 4.5
}
```

---

## 8. THE DEEP DIAGNOSIS: WHERE DREAM FALLS SHORT

Despite the clean pipeline and test coverage, the actual output produced by Dream suffers from four fundamental flaws:

### 8.1 The "Cardboard Box" Primitive Trap
Because `box()` and `slab()` are the easiest primitives to compute, generators build **everything out of orthogonal rectangular boxes**.
- A "hollow log" is four flat slabs glued into a square tunnel.
- A "boulder" is a box or a smooth geometric sphere.
- A "cliff face" is a flat vertical box wall.
- **Why it looks terrible**: Putting hand-drawn biro ink crosshatching shaders over 90-degree laser-cut boxes makes environments look like cheap cardboard packaging. It completely destroys the illusion of an organic sketchbook doodle.

### 8.2 The Static Clone Problem
Prefabs in `src/prefabs.js` have rigid, hardcoded constants:
- `buildPineTree()` is always $12.0\text{m}$ high with a $0.8\text{m}$ trunk.
- When Dream populates a forest or park, every single tree is an identical twin.
- There is zero organic variation: no colossal ancient titan trees ($30\text{m}$ tall, $3.5\text{m}$ trunk diameter), no twisted gnarled trees, no wind-bent slender trees, and no varying root buttresses.

### 8.3 The Knowledge Wall & Missing In-Flight Apprentice Loop
Dream is an offline Node.js script. When a user prompts:  
`npm run dream "build beach on cove"`  
Because `"beach"` does not exist in `.agents/thematic-memory.json`:
- Dream halts and opens a consultation ticket.
- It cannot ask: *"What are the primary structures on a beach? How tall is a palm tree? What 3D primitives compose a coconut or a lifeguard tower?"*
- It cannot ingest a dynamic, machine-executable 3D recipe on the fly.

### 8.4 The Missing Colossal Everyday Object Metaphor
In hand-authored gold-standard maps like **The Giant Classroom** and **The Library**, small objects are transformed into colossal, playable terrain:
- A pencil is a massive fallen trunk acting as a ramp.
- A book is a multi-story fortress with pages forming stepped terraces.
- In contrast, Dream currently drops objects onto a flat floor as small decorative clutter, rather than turning them into **walkable, multi-tiered combat highways**.

---

## 9. WHAT WE NEED FROM YOU: THE 4 CORE ARCHITECTURAL BLUEPRINTS
*(Note: We do NOT need raw JavaScript codebase implementations from you. We need you to provide the comprehensive technical design, algorithmic formulas, schemas, and architectural blueprints in structured text/markdown format. Our local development team will translate your blueprints into code.)*

We need you to formulate and specify the following four systems:

---

### BLUEPRINT 1: The Interactive Teacher-Apprentice Dialog Protocol

Design the in-flight consultation and dynamic recipe ingestion system where Dream acts as an apprentice communicating with a directing AI (or human architect):

1. **The In-Flight Query Schema (`TeachRequest`)**:
   - When Dream encounters an unknown asset (e.g. `palm_tree`, `coconut`, `conch_shell`, `lifeguard_tower`), specify the exact JSON schema it should emit.
   - Detail what questions Dream must ask:
     - Real-world scale vs. miniature doodle scale ($1.8\text{m}$ character).
     - Tactical role (`waist_cover`, `full_cover`, `traversable_catwalk`, `landmark_anchor`).
     - Geometric primitive composition breakdown.
     - Ink hierarchy (`primary`, `secondary`, `interactable`, `hazard`).
     - Collision bounds, entry points, and safety clearance constraints.

2. **The Declarative Recipe Specification (`RecipeResponse`)**:
   - Design a declarative, JSON-serializable 3D recipe grammar that the directing teacher returns to Dream.
   - The recipe format must express 3D shapes using primitives (`box`, `slab`, `cyl`, `cone`, `sphere`, `wedge`, `ring`, `rail`, `barrel`, plus the new organic primitives below) with parametric offsets, rotation angles, ink tags, and collision flags.
   - Detail how this declarative grammar avoids risky `eval()` while allowing composite hierarchies (e.g. trunk + branches + foliage crown).

3. **Dynamic Memory Ingestion Workflow**:
   - Detail the step-by-step workflow for:
     - Ingesting and validating the `RecipeResponse`.
     - Registering the new asset into Dream's runtime catalog.
     - Appending it permanently to `.agents/thematic-memory.json` so Dream permanently retains the knowledge and never has to ask again.

---

### BLUEPRINT 2: Parametric & Organic Procedural Shape Mathematics

Provide the algorithmic design and mathematical formulas to eliminate static clones and rectangular organic props:

1. **Parametric Tree Generation Blueprint**:
   - Formulate the procedural mathematics and algorithm for:  
     `generateParametricTree(seed, opts = { scale, girth, height, lean, branchiness, foliageVolume })`
   - Explain how to procedurally calculate:
     - **Colossal Titan Tree**: Height $25-35\text{m}$, trunk radius $2.5-3.5\text{m}$, climbable buttress root ramps, hollow trunk niche, canopy combat platform at $Y=20\text{m}$, hanging grapple rings.
     - **Slender/Bent Tree**: Height $8-12\text{m}$, lean angle $15-25^\circ$, asymmetrical foliage crown.
     - **Stout/Gnarled Tree**: Height $5-7\text{m}$, thick trunk, multi-limb split, waist-high root cover.
   - Define how random seeds produce infinite organic variety while remaining 100% deterministic.

2. **Procedural Curved Hollow Log / Tunnel Blueprint**:
   - Provide the geometric and mathematical algorithm for a curved, round hollow log or pipe you can sprint through:
     - How to calculate the outer bark cylinder vs. inner hollow traversal bore ($>1.8\text{m}$ clear diameter).
     - How to generate stepped branch stubs / shelf fungi on the exterior acting as stairs to the top catwalk.
     - How to place parapet edges on top for elevated cover.

3. **Algorithmic Biro Sketch Jitter (Hand-Drawn Stylization)**:
   - Formulate how procedural shapes should introduce slight non-rectilinear angles, organic vertex displacement, and contour irregularities so 3D meshes look like authentic hand-drawn ink doodles rather than sterile CAD primitives.

---

### BLUEPRINT 3: Colossal Scale Anatomy & Traversal Highways

Provide the architectural rules and formulas for scaling everyday/natural objects into multi-tiered competitive shooter arenas:

1. **Colossal Transform Formulas**:
   - Mathematical guidelines for converting everyday shapes into playable geometry:
     - Ensuring interior sprint tunnels maintain $\ge 2.2\text{m}$ continuous vertical headroom.
     - Placing intermediate rest landings for climbs $>4.0\text{m}$ vertical rise.
     - Transforming the top surface of a colossal object into an active combat catwalk with $0.9\text{m} - 1.1\text{m}$ cover parapets.

2. **Grapple Highway Topology**:
   - Algorithmic rules for placing momentum grapple rings (`ring()`) relative to colossal set-pieces:
     - Wall clearance distances ($\ge 1.5\text{m}$).
     - Overhead launch heights ($+6.0\text{m}$ to $+10.0\text{m}$).
     - Swing arc validation ensuring swinging players never clip intermediate obstacles or branches.

---

### BLUEPRINT 4: Geometry Engine Extension (New Organic Primitives)

Specify the exact geometric construction, vertex math, and collision boundaries for four new organic primitives to be added to `createBuilder(scene, world)`:

1. `hollowCyl(x, y, z, rInner, rOuter, length, opts)`:
   - Geometric construction of an open-ended hollow cylinder laying on `'x'` or `'z'` axis, including inward and outward collision box approximation.
2. `wedge(x, y, z, w, h, d, opts)`:
   - Triangular prism geometry for smooth natural ramps, rock slopes, and angled roofs (`dir: 'x+' | 'x-' | 'z+' | 'z-'`).
3. `facetedRock(x, y, z, rx, ry, rz, opts)`:
   - Organic, multi-faceted sketched boulder (deformed polyhedron) with irregular flat facets providing waist-high or full cover.
4. `arch(x, y, z, span, height, depth, opts)`:
   - Curved archway geometry for cave openings, hollow trunks, and bridge spans.

---

## 10. TARGET ARCHITECTURAL MANIFEST

Your blueprints and specifications will guide the implementation across these workspace modules:

| Target File | System Component | How Your Blueprint Will Be Applied |
|---|---|---|
| [`src/level.js`](file:///c:/Users/dd/Desktop/Test/src/level.js) | Core Builder API (`createBuilder`) | We will implement the 4 organic primitives (`hollowCyl`, `wedge`, `facetedRock`, `arch`) based on your geometric math. |
| [`src/prefabs.js`](file:///c:/Users/dd/Desktop/Test/src/prefabs.js) | Reusable Set-Piece Library | We will implement the parametric tree, hollow log, and faceted boulder generators following your algorithms. |
| [`src/rebuild/scene-tree-schema.js`](file:///c:/Users/dd/Desktop/Test/src/rebuild/scene-tree-schema.js) | Scene Tree AST Schema | We will register the new organic node types defined in your schema. |
| [`src/rebuild/scene-compiler.js`](file:///c:/Users/dd/Desktop/Test/src/rebuild/scene-compiler.js) | Deterministic AST Compiler | We will add compiler emitters translating organic AST nodes into Three.js calls. |
| [`src/rebuild/director-agent.js`](file:///c:/Users/dd/Desktop/Test/src/rebuild/director-agent.js) | Teacher-Apprentice Layer | We will implement the `TeachRequest` generator and `RecipeResponse` ingestion parser per your protocol design. |
| [`.agents/thematic-memory.json`](file:///c:/Users/dd/Desktop/Test/.agents/thematic-memory.json) | Persistent Memory Bank | We will structure learned assets and thematic rules following your recipe format. |

---

## 11. COPY-PASTE FRONTIER LLM MASTER PROMPT

*Copy and paste the prompt below into Claude 3.7 Sonnet/Opus, OpenAI o3/GPT-4.5, or Gemini 2.0 Pro alongside this `request.md` file:*

```markdown
You are the Principal Technical Level Designer and Lead Procedural Generation Architect for Doodle Strike, a fast-paced 3D multiplayer tactical shooter rendered in a hand-drawn ballpoint pen (biro) notebook sketchbook aesthetic.

I have attached `request.md`, which contains the complete architectural breakdown of our procedural level generator ("Dream"):
1. The 10-stage execution pipeline, NLP router, God Mode orchestrator, and Rebuild suite (Phases R0-R6).
2. The exact Three.js builder API (`createBuilder` in `src/level.js`) with all current primitive signatures.
3. The Scene Tree AST schema and thematic memory formats.
4. The diagnosis of why Dream is failing (the Cardboard Box Trap, Static Clones, the Knowledge Wall, and missing colossal traversal).

IMPORTANT INSTRUCTION ON OUTPUT FORMAT:
DO NOT write raw JavaScript application code or dump large code files. We are not asking you to code our game.
Instead, provide a comprehensive architectural design and technical specification document (in structured Markdown / text format) explaining HOW we should build and solve these systems:

1. HOW the Interactive Teacher-Apprentice Protocol should work in-flight (the exact communication loop, questions Dream asks, `TeachRequest` and `RecipeResponse` declarative schemas, and how new concepts are permanently ingested into memory).
2. HOW to mathematically generate parametric organic shapes (trees of varying scales, curved hollow logs/pipes, faceted boulders, biro sketch jitter) without hardcoding.
3. HOW to transform everyday objects into colossal, multi-tier arenas with competitive flow, headroom, and grapple highways.
4. HOW the 4 new organic primitives (hollow cylinder, wedge ramp, faceted rock, arch) should be geometrically constructed, textured in biro ink, and given proper collision boundaries.

Our local development team will take your architectural specifications, mathematical formulas, and schemas to implement the code ourselves. Focus on deep design clarity, mathematical precision, and system architecture.
```

