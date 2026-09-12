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
When the Dream Orchestrator / Macro-Dreamer is invoked to decorate or synthesize structures (e.g. `npm run map:dream`), it must follow these constraints:
1. **Respect NavMesh & Flow:** Never block main arteries, ramps, or the L-Junction Sky-Bridges.
2. **Thematic Integrity (Pirate Cove):** Use maritime, pirate, and naval aesthetics (e.g., wooden crates, barrels, ship masts, cannons, ropes, rigging, cargo nets).
3. **Cover Playability:** Props should function as waist-high (Y=1.5) or full-cover (Y=3.0) tactical blocks, not just visual clutter.
4. **Pirate Cove Specific Blueprints (Geometric & Clean):**
   - **Rum Barrel Stacks:** Use clusters of `cyl(x, y, z, 0.8, 1.5, { ink: OR })` to create waist-high tactical cover on the East Docks. Group them tightly in logical shipping stacks (e.g., 3 on bottom, 2 on top).
   - **Tactical Cannons:** Use `box(x, y, z, 2, 1, 3, { ink: OR })` for the wooden carriage, and an oriented/rotated `cyl` (black iron barrel) protruding outward toward the central lanes. Place these on the West Catwalks looking down.
   - **Ship Masts & Crow's Nests:** Use extremely tall `cyl(x, y, z, 0.6, 16, { ink: BK })` for masts, capped with a hollow `box` or `slab` near the top acting as a Crow's Nest. Hang `ring` (grapple points) directly off these masts.
   - **Cargo Cranes:** Use L-shaped `box` structures on the docks. A vertical wooden pillar and a horizontal boom, suspending a cluster of shipping crates (`box`) underneath them to block long sniper sightlines.
   - **Mooring Bollards:** Small iron `cyl(x, y, z, 0.4, 0.8, { ink: BK })` placed right along the water's edge of the East Docks. Adds nautical flavor and acts as micro-cover.

5. **Advanced Geometry over Blocks:**
   - **Do NOT rely exclusively on `box()` for props.** We have a full geometric toolkit.
   - **Cylinders (`cyl(x, y, z, r, h, { axis: 'x'|'z' })`)**: Use for barrels, pipes, columns, ship masts, cannons, and bollards. The `axis` property allows them to lay horizontally!
   - **Spheres (`sphere(x, y, z, r, { ink })`)**: Use for cannonballs, buoys, or decorative round elements.
   - **Animated Planes (`planes(count, radius, height, { speed, scale, ink })`)**: Repurpose as circling seagulls, bats, or ambient atmospheric movement high above the play space.
