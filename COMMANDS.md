# 🛠️ Doodle Strike Developer & AI Commands Cheatsheet

Quick reference for all validation, auditing, self-learning, scaffolding, and graduation commands.

---

## 1. 🔍 Auditing & Verification Commands

### Automated Self-Healing Map Audit
Audits a map for stairway headroom clearances, collider density (>=150), grapple clearances (>=1.5m), and vantage distributions. Use `--heal` to automatically carve out headroom voids.
```bash
npm run audit:map <mapKey>
npm run audit:map all
npm run audit:map <mapKey> -- --heal
```
*Examples:*
- `npm run audit:map clockwork`
- `npm run audit:map all -- --heal`

### Concept Detailing Audit
Audits a concept document in `map_concepts/` against the 13 required architectural sections, prop tier taxonomies, stairway mathematics, and material ink palettes.
```bash
npm run audit:concept [conceptName|all]
```
*Examples:*
- `npm run audit:concept seas`
- `npm run audit:concept all`

### Bot Flow & Traversal Simulator
Simulates bot navigation, grounded spawn verification, vantage line-of-sights, anti-camp open vectors, and grapple swing-chain reachability.
```bash
npm run map:simulate <mapKey|all>
```
*Examples:*
- `npm run map:simulate clockwork`
- `npm run map:simulate all`

### Architecture & Integrity Verification
Verifies all 16 core game modules, shader integrity, trademark compliance, and CSS structures.
```bash
npm run verify:integrity
```

---

## 2. 🏗️ Smart Scaffolding & Self-Learning System

### Thematic Neural Synthesizer (Concept Creator & Ideator)
Synthesizes a complete 13-section concept specification filled with micro, meso, macro, and kinetic props based on map name and learned archetypes (`.agents/thematic-memory.json`).
```bash
npm run map:dream <mapName> [themeCategory]
```
**Available Archetypes:** `zen`, `cyber`, `steampunk`, `colossal`, `maritime`
*Examples:*
- `npm run map:dream cyber_matrix cyber`
- `npm run map:dream brass_foundry steampunk`
- `npm run map:dream bamboo_sanctuary zen`

### Safe Spatial Prop Injector (Zero-Collision Densification)
Analyzes 3D voxel occupancy of an existing map, detects empty spatial voids, and safely injects thematic props (benches, lanterns, crates, rails) without ever colliding with stairs, doorways, or player spawns.
```bash
npm run map:inject <mapKey> [theme]
```
*Examples:*
- `npm run map:inject clockwork steampunk`
- `npm run map:inject zen zen`

### Smart Map Scaffolder
Generates a complete, standard-compliant map module (`src/levels/<name>.js`) and a corresponding concept specification (`map_concepts/XX_<name>.md`) with pre-calculated safe stairway geometry and grapple anchors.
```bash
npm run map:scaffold <mapName> [preset]
```
**Available Presets:**
- `urban`: Dense CQB, alleyways, fire escapes, rooftop terraces.
- `colossal`: Giant scale objects, high vertical jumps, long sniping lines of sight.
- `anomalous`: Surreal geometry, rotating elements, kinetic pads.
- `kinetic`: Machinery, pendulums, elevated hazards, precision hooks.

*Examples:*
- `npm run map:scaffold cyber_plaza urban`
- `npm run map:scaffold cathedral colossal`
- `npm run map:scaffold space_station anomalous`

### Self-Learning Rule Memory
Inspects and manages the persistent rule cache in `.agents/learning-cache.json`. Displays standard metric constraints and learned remedies from past audits.
```bash
npm run map:learn
npm run map:learn -- --history
```

### Map Packaging & Snapshot Export
Bundles a map's code, concept specifications, and metadata into a self-contained snapshot inside `.snapshots/`.
```bash
npm run map:pack <mapKey>
```
*Example:*
- `npm run map:pack clockwork`

### Map Graduation
Promotes a finished concept document from `map_concepts/` to `Map Description/` and cleans up numbering prefixes.
```bash
npm run graduate <mapNameOrNumber>
```
*Examples:*
- `npm run graduate 03`
- `npm run graduate clockwork`

---

## 3. 💬 Natural Language Prompt Commands

You can copy and paste any of these commands into your AI chat session:

### Mode 1: Check & Audit
- *"Check the Clockwork Tower map with auto-healing enabled."*
- *"Audit the concept doc for The Ink Seas."*
- *"Are there any collision or detailing issues on Doodle District?"*

### Mode 2: Build & Scaffold
- *"Scaffold a new map called Cyber Diner using the urban preset."*
- *"Build Blueprint Castle following the Universal Detailing Standard."*
- *"Upgrade the object detailing on Clockwork Tower."*

### Mode 3: Brainstorm & Ideate
- *"Brainstorm 3 new map concepts for Doodle Strike."*
- *"Brainstorm objects, props, and landmarks that suit The Ink Seas."*
- *"Write a complete concept document for Neon Dojo into map_concepts/."*

### Mode 4: Graduate & Promote
- *"Graduate Clockwork Tower to Map Description."*

---

## 4. 🚀 Development & Build

```bash
npm run dev        # Start development server at http://localhost:3000
npm run build      # Compile production build to dist/
npm run lint       # Lint and validate code
npm run help       # Display the interactive CLI help menu
```
