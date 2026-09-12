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
