# Universal Detailing Rule (Mandatory for All Maps)

Every agent, AI, or developer creating or modifying maps, meshes, props, or skeletal systems in Doodle Strike MUST follow this standard.

## Canonical Skill Reference
For the complete technical specification, metrics, and quality scorecard, always read:
`.agents/skills/universal-detailing-standard/SKILL.md`

## Core Invariants
1. **Graphics-Quality Agnostic**:
   Detailing governs the *structural anatomy* of objects (sub-meshes, trim, skeletal framing), not the pixel/shader quality. Every prop must look complete at both Low and Ultra graphics settings.
2. **The Skeleton-Skin-Trim Triad**:
   Every Tier 2+ tactical object (furniture, walkways, machinery, buildings) must possess:
   - **Skeleton**: Structural support / legs / chassis (`INK.BLACK` or `INK.BLUE`)
   - **Skin**: Primary walkable or visible body surface
   - **Trim**: Distinctive edge banding, handles, rivets, or accents in contrasting ink
3. **The Golden Rule**:
   *If you can name a part, it should be a distinct mesh.* (A boiler is not just a cylinder — it has firebox doors, pressure gauges, pipe flanges, and mounting feet).
4. **Material-to-Ink Mapping**:
   - Wood / Copper / Rust / Paperboard: `INK.ORANGE` (3)
   - Iron / Steel / Hardware / Structural wire: `INK.BLACK` (2)
   - Blueprint / Ceramic / Ink surface: `INK.BLUE` (0)
   - Rubber / Gaskets / Dampers: `INK.PINK` (5)
   - Glass / Vegetation / Coolant: `INK.GREEN` (4)
   - Heat / Fuel / Warning / Weakpoints: `INK.RED` (1)
5. **Collision & Performance Rules**:
   - Small trim (< 0.3m) MUST use `noCollide: true`.
   - Never use `new THREE.Mesh` for static map props; always use builder helpers or `addGeo()` to bake into static geometry buffers.
   - Zero object allocations inside animation loops (`L.animated`).
6. **Spatial Topology, Clearance & Anti-Flicker**:
   - **No Z-Fighting / Co-Planar Overlaps**: Parallel and intersecting surfaces must maintain a `0.02m - 0.05m` epsilon offset.
   - **Stair Landing Flushness**: The top step must land flush within `±0.05m` of the destination deck with a continuous `3.0m` vertical headroom corridor.
   - **The 1.8m Anti-Pinch Corridor**: Walkable doorways and passages between colliders must be `≥ 1.8m` wide. Impassable gaps must be `< 0.35m` to prevent player wedging.
   - **Platform Gaps (Toe Traps)**: Platforms must either fuse seamlessly or separate by a deliberate `≥ 2.5m` jump gap.
   - **Grapple Clearance**: Grapple anchors require `≥ 1.5m` radial clearance from walls and ceilings.
   - **Tunnel Clearance**: Any structure spanning ≥ 6m horizontally MUST provide a sprint-through tunnel (minimum 3.2m wide × 2.5m high).
7. **Self-Improving Quality Scorecard**:
   - Every Tier 2+ object must achieve a quality score of ≥ 7.0 / 12 (Target: 10-12 benchmark quality).
   - Safety ceiling: Max 20 meshes per Tier 3 object, max 40 meshes per Tier 4 object to guarantee 60 FPS pacing.

## Agent Intent Triggers: How Agents Must Interpret User Commands
When any developer or user issues map-related requests, agents MUST categorize them into one of these two operational modes:

### Mode 1: CHECK / AUDIT
* **User says:** "Check map X", "Audit map X", "Verify map X detailing", "Look into map X quality", "Are there issues on map X?"
* **Agent Action:**
  1. If coded: Run `node .agents/skills/universal-detailing-standard/scripts/verify-detailing.js <mapName>` and analyze colliders, grapple clearances, and animation allocations.
  2. If concept: Read `map_concepts/<mapName>.md`, check against the 7 tiers, material-to-ink palette, 1.8m corridors, and 3.0m stair headroom, then output a structured audit report.

### Mode 2: BUILD / IMPLEMENT
* **User says:** "Build map X", "Detail map X", "Upgrade map X", "Construct map X", "Add objects to map X"
* **Agent Action:**
  1. Follow the Skeleton-Skin-Trim triad for all Tier 2+ geometry.
  2. Enforce zero dynamic allocations in animations.
  3. Ensure all micro-trim (< 0.3m) uses `noCollide: true`.
  4. Immediately verify with `node .agents/skills/universal-detailing-standard/scripts/verify-detailing.js <mapName>` to guarantee ≥ 7.0 score before finishing.

### Mode 3: BRAINSTORM & THEMATIC CONCEPT DIVERSIFICATION
* **User says:** "Brainstorm map concepts", "Give me ideas for a map", "What objects suit map X?", "Think about objects and props for map X", "Add more to concept X", "Improve concept X"
* **Agent Action:**
  1. **Aesthetic Anchoring:** Anchor all brainstormed ideas strictly to the **drawn-on-notebook ballpoint pen aesthetic** (blue, red, black, orange highlighter, green, pink eraser inks) and **fast vertical CQB grapple platforming**.
  2. **Thematic Object Taxonomy:** For any map theme, brainstorm specific bespoke props across the 4 physical tiers:
     - *Tier 1 (Cover Props):* Low barriers, crates, canisters, toolboxes, paperweights, pencil sharpeners, ink pots, rubber erasers.
     - *Tier 2 (Tactical Furniture & Walkways):* Desks, drafting tables, catwalks, scaffoldings, bookshelves, piers, ruler bridges.
     - *Tier 3 (Landmark Props):* Giant stationery, microscopes, pendulum anchors, telescopes, stapler tunnels, radio dish pedestals.
     - *Tier 4 (Hero Centerpiece):* Multi-story vertical set pieces with interior/exterior traversal and grapple perches.
  3. **Sector Densification Guarantee:** Ensure every quadrant has intermediate staging clutter, cryo/fuel manifolds, storage lockers, rock berms, and multi-tier bridge crossovers so no open ground is left empty or bare.
  4. **Stairway & Landing Standard:** All concept stairs must explicitly specify step rise ($0.25-0.28\text{m}$), step run ($0.45-0.50\text{m}$), intermediate rest landings for every $4\text{m}$ vertical rise, and $3.0\text{m}$ continuous vertical headroom.
  5. **Concept Output & Auditing:** When generating or updating a specification in `map_concepts/<number>_<map_name>.md`, run `npm run audit:concept <name>` to verify that all 13 sections, prop tiers, and clearances pass.



