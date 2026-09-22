# Lead Level Designer Workflow (Tactical & Gameplay First)
When requested to create or refine a map, the AI Agent MUST prioritize GAMEPLAY, FLOW, and READABILITY over complex thematic lore. Do not try to build complex abstract shapes (like skulls or ships) out of basic box primitives, as this creates visual noise and terrible pathing.

1. **The Tactical Blockout**:
   - Think in terms of competitive shooter design: 3-Lane layouts, central chokepoints (mid), and clear sightlines.
   - Use clean, easily readable geometry (slabs for floors, boxes for cover, clear ramps/stairs).
   - Color coding should mean something (e.g., Blue for structures, Orange for interactables/cover).
2. **Flow & Movement**:
   - Pathways must be explicitly clear and unobstructed.
   - Elevation changes must be deliberate (clear sniper nests with at least 2 ways up/down).
   - Grapple points should be mounted on high, clean architectural pillars to allow momentum swinging.
3. **User Collaboration**:
   - Pitch the tactical layout (lanes, chokepoints, high-ground) to the user before writing the code.

# Dream Synthesizer Guidelines (Prop & Structure AI)
When the Dream Orchestrator / Macro-Dreamer is invoked to decorate, synthesize, or upgrade maps (e.g. `npm run map:god`, `npm run map:dream`), it must adhere to the **Continuous Map Evolution Standard**:

1. **Every New Map Must Eclipse the Last (Continuous Evolution Law):**
   - No map may ever be built as a bare flat slab with scattered identical boxes.
   - Every map must match or exceed the standard of `Forest` and `Giant Classroom`:
     - Multi-tier vertical topography (sunken trenches/channels, raised plazas/platforms, suspended catwalks/bridges).
     - Full macro landmarks (minimum Tier 3-4 hero structures: treehouses, clock towers, space-frame arches, galleons, colossal desks).
     - Living kinetic ambient actors (`L.animated`: floating/drifting particles, wind-blown paper, flickering neon, water ripples).
     - Procedural ground washes and surface decals (oil stains, gravel paths, chalk formulas) to anchor objects to the paper substrate.

2. **The Anti-Repetition Law (No Cloned Meshes):**
   - Never spawn the exact same prefab 5 times with identical dimensions.
   - All clutter props (`buildCrateStack`, `buildTransitBench`, `buildToolRack`, etc.) must accept a deterministic seed (`seed + i * 137`) that mutates dimensions, stacking permutations, angles, and detail trims.

3. **Advanced Curved 3D Geometry Over Box Stacking:**
   - Use the full mathematical engine: `create3DSpline`, `splineTube`, `annularDeck`, and `sweptRibbon` from `src/spline-engine.js`.
   - Arches, space-frame concourses, curved logs, catenary rope bridges, and skeletal ribcages are mandatory for organic or monumental architecture.

4. **Transition Belts (Zero Empty Wastelands):**
   - The space between primary sectors must never be an empty void.
   - Place **Transition Belts**: inter-sector material runoffs, debris trails, dropped cargo, pipeline conduits, and directional pavement striping linking points of interest.

5. **Prefabrication Architecture (`src/prefabs.js`):**
   - For all complex compound structures, build them as reusable, parameterized generators in `src/prefabs.js` and register them in `PREFAB_REGISTRY`.
   - Never write raw 50-line compound box clusters inline in map files. Keep level files clean, readable, and composed of modular architectural building blocks.
