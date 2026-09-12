---
name: universal-detailing-standard
description: Mandatory universal mesh and object detailing standard for all Doodle Strike maps. Defines anatomical construction tiers, material layering rules, micro-detail thresholds, and self-improving quality metrics. Every agent building or modifying any map MUST follow this specification.
---

# Universal Mesh & Object Detailing Standard

**Authority:** This skill is a MANDATORY rule for every agent, AI, or human constructing objects, meshes, props, or skeletal systems in any Doodle Strike map — past, present, or future. No map may ship without meeting these standards.

**Scope:** Graphics-quality agnostic. These rules govern the *structural composition* of objects, not the rendering quality. The biro ink renderer handles quality scaling independently. Every object built to this standard looks correct at minimum AND maximum quality.

---

## 1. The Detailing Philosophy

The Doodle District and Giant Classroom maps look alive because every object is built as if it were a **real physical thing drawn with a ballpoint pen**. A desk is not a flat box — it has legs, drawers, handles, a kneehole tunnel, and items resting on it. A pencil is not a cylinder — it has a hexagonal barrel, a ferrule band, a graphite tip, and an eraser nub.

**The Golden Rule:** *If you can name a part, it should be a mesh.*

---

## 2. The Seven Detailing Tiers

Every object in the game belongs to one of seven tiers. The tier determines how many sub-meshes, material layers, and micro-details it requires.

### Tier 0: Structural Shell (1-2 meshes)
The base collision hull. Walls, floors, ceilings, foundation slabs. One `box()` or `slab()` call with a single ink color. No detailing required.

**Example:** `box(0, -1, 0, 110, 1, 110, { ink: BL })` — foundation floor.

### Tier 1: Functional Prop (3-5 meshes)
An object you interact with but don't examine. Cover crates, oil drums, barricades, barrels. Must have:
- A **primary body** (the main shape)
- A **material distinction** (at least 2 ink colors)
- A **cap, lid, or accent** piece

**Example:** Oil drum = `cyl(body, INK.GREEN)` + `cyl(lid, INK.BLACK)` + `ring(rim)`.

### Tier 2: Tactical Furniture (5-10 meshes)
Objects that define combat flow. Desks, tables, bridges, catwalks, bookshelves. Must have:
- A **surface deck** (the walkable/usable face)
- **Structural supports** (legs, columns, brackets)
- **Edge trim or railings**
- At least one **tactical feature** (tunnel, gap, shelf, firing slot)

**Example:** Student desk = desktop slab + 4 tubular legs + under-desk wire basket + attached chair (seat + backrest + 4 chair legs) = 12 meshes.

### Tier 3: Landmark Prop (10-20 meshes)
Signature objects that players navigate by and remember. Giant pencils, buses, stapler tunnels, microscopes. Must have:
- **Full anatomical breakdown** (every named component is a mesh)
- **Material authenticity** (correct ink per material: wood = ORANGE, metal = BLACK, rubber = PINK)
- At least one **grapple ring or sniper perch**
- **Functional sub-geometry** (a tunnel, a ramp, a firing deck, or an overlook)

**Example:** Compound microscope = horseshoe base + pillar + specimen stage + body tube + eyepiece rim + eyepiece grapple ring = 6 meshes + ring.

### Tier 4: Hero Set Piece (20-40 meshes)
The centerpiece structures players talk about. The Teacher's Desk, the Grand Library, the Clockwork Gear Train. Must have:
- **Multi-tier vertical gameplay** (at least 2 elevation changes)
- **Interior/exterior duality** (you can be inside AND on top)
- **Dense prop furniture** on surfaces (items resting on desks, shelves, ledges)
- **Multiple grapple points and sniper perches**

### Tier 5: Environmental Dressing (1-3 meshes each, placed in groups)
Non-interactive visual enrichment. Floor markings, wall art, chalk equations, road dashes, parquet plank lines. Must be:
- `noCollide: true` (zero collision cost)
- Thin geometry (height ≤ 0.15m)
- Placed in **repeating rhythmic patterns** (every 2m, every 4m, etc.)

### Tier 6: Sky Dressing (1-10 meshes)
Distant background objects. Clouds, sun, paper planes. Must be:
- Placed at ≥ 60m from the arena center
- Low polygon count (≤ 12 segments)
- Single ink color

---

## 3. Anatomical Construction Rules

These 12 rules define HOW to build each mesh component. They are extracted from the benchmark patterns in Doodle District and Giant Classroom.

### Rule 1: The Skeleton-Skin-Trim Triad
Every Tier 2+ object must have three layers:
1. **Skeleton:** The structural support that holds it up (legs, columns, pylons, brackets). Always `INK.BLACK` or `INK.BLUE`.
2. **Skin:** The primary surface (desktop, body panel, barrel). Uses the object's theme ink.
3. **Trim:** Edge accents, handles, labels, hardware. Contrasting ink from the skin. Usually `INK.BLACK` or `INK.ORANGE`.

### Rule 2: Material-to-Ink Mapping
| Real Material | Ink ID | Constant |
|---|---|---|
| Wood (oak, pine, plywood) | 3 | `INK.ORANGE` |
| Metal (steel, iron, brass, copper) | 2 | `INK.BLACK` |
| Paper, fabric, ceramic | 0 | `INK.BLUE` |
| Rubber, eraser, foam | 5 | `INK.PINK` |
| Glass, fluid, vegetation | 4 | `INK.GREEN` |
| Danger, heat, warning, blood | 1 | `INK.RED` |

### Rule 3: The 0.3m Detail Threshold
The smallest collidable detail is `0.3m` in any dimension. Below this:
- Use `noCollide: true` for visual-only sub-details
- Cosmetic trim lines: height `0.02m - 0.15m`
- Structural rails: height `1.0m`, width `0.06m`

### Rule 4: The Surface-Stack Pattern
For objects with items resting on a surface (desks, shelves, counters):
1. Place the surface slab at height `Y`
2. Place props starting at `Y` (not `Y + thickness`) — the engine auto-resolves
3. Distribute props with at least `2m` spacing to prevent visual clustering
4. Include at least one prop per `16m²` of surface

### Rule 5: The Grapple Ring Budget
- **Tier 1-2:** 0-1 grapple rings
- **Tier 3:** Exactly 1 grapple ring (on the highest or most dramatic point)
- **Tier 4:** 2-4 grapple rings (distributed across vertical tiers)
- Rings placed `1.3m - 3.5m` below the nearest landing surface

### Rule 6: The Kneehole/Tunnel Doctrine
Every Tier 3+ object that spans ≥ 6m horizontally MUST have a **sprint-through tunnel, archway, or kneehole** allowing players to pass through without climbing. Minimum clearance: `3.2m` wide × `2.5m` high.

### Rule 7: The Switchback Stair Formula
External staircases on buildings and large props:
- **Rise per step:** `0.2m - 0.35m` (smooth sprint, no stutter)
- **Run per step:** `0.4m - 0.6m`
- **Width:** `1.6m - 2.5m`
- **Flight length:** `12-28 steps` before a landing
- **Landings:** Include a railing on the exposed edge and a gap toward the destination

### Rule 8: The Drawer Handle Pattern
Repeated structural elements on vertical surfaces (locker doors, drawer fronts, window mullions):
- Space vertically by `2.0m - 2.6m`
- Use `box(x, y, z, 2.4, 0.3, 0.3, { noCollide: true, ink: BK })` for handles
- Use `box()` in a contrasting ink for panel insets

### Rule 9: The Ink Contrast Quota
Every Tier 2+ object must use **at least 2 distinct ink IDs**. Every Tier 3+ object must use **at least 3**. Never build an entire structure in a single color — it will look flat and lifeless under the biro crosshatching.

### Rule 10: The Breakable Prop Pattern
If an object is meant to be destroyed, it must:
- Register with `L.breakables` via the builder
- Have a visible "weak point" mesh in `INK.RED` or `INK.ORANGE`
- Contain at most 4 sub-meshes (performance budget for destruction)

### Rule 11: The Oriented Cylinder Rule
For any non-axis-aligned cylindrical object (leaning pencils, lamp necks, gooseneck faucets, diagonal pipes):
- Use `orientedCyl([x1,y1,z1], [x2,y2,z2], radius, segments, ink)`
- Connect two endpoints with a properly rotated `CylinderGeometry`
- Never approximate diagonals with rotated boxes — cylinders read as pipes/rods

### Rule 12: The Decorative Geometry Rule
For non-box shapes (circles, rings, cones, torus, spheres):
- Segment count: `6-16` for small props, `24-48` for large features
- Always use `addGeo()` to merge into the static ink buffer
- Never add these as `THREE.Mesh` — they must be baked into the geometry merge pass

### Rule 13: The Anti-Flicker & Z-Fighting Protocol
When two surfaces share an orientation plane (co-planar slabs, wall insets, baseboards, floor inlays):
- **Epsilon Offset:** Never place two parallel faces at the exact same coordinate. Apply a minimum offset of `0.02m` to `0.05m`.
- **Trim Protrusion:** Decorative trim, baseboards, and frame accents must protrude by at least `0.04m` from the host wall or floor.
- **Concentric Scales:** Floor rings, dials, and decals must sit at `y = surfaceY + 0.015m` with `noCollide: true`.

### Rule 14: Stair Headroom & Landing Flushness
To prevent player movement stutter, micro-snags, or sprint interruption:
- **Landing Flushness:** The top step of any flight must match the landing surface elevation within `±0.05m`. Never leave a lip or step-drop at the landing junction.
- **Headroom Corridor:** Every step along a flight must maintain a minimum vertical clearance of `3.0m` to any overhead beam, ceiling, or upper stair return.
- **Footing Threshold:** The base of any staircase must emerge onto solid ground or deck with at least `1.8m` of unobstructed run in front of the bottom step.

### Rule 15: The 1.8m Anti-Pinch Corridor Rule
To prevent player physics capsules and AI nav bots from becoming wedged or pinched between collidable props:
- **Passable Gaps:** Any intended doorway, alleyway, or path between two collidable objects must be **≥ 1.8m wide**.
- **Impassable Gaps:** If an opening is not meant to be walked through, keep the gap **< 0.35m** (or seal it with an invisible barrier) so players never attempt to squeeze through and get stuck.
- **Toe-Trap Prevention:** Adjacent platform slabs must either seamlessly fuse (`gap = 0`) or separate by a clear, intentional jump gap (**≥ 2.5m**). Never leave accidental `0.2m - 0.8m` gaps.

### Rule 16: Grapple Anchor Radial Clearance
To prevent players from clipping inside geometry or colliding with walls upon grapple arrival:
- All grapple rings must have **at least 1.5m radial clearance** from surrounding solid walls, columns, and ceilings.
- Grapple rings must never be placed inside recessed hollows shallower than `2.0m`.


---

## 4. Self-Learning Quality Metrics

This detailing standard includes a self-assessment system. After building or modifying any map, agents MUST run this mental checklist and record their score. The system self-improves by learning from each map's scoring.

### Quality Scorecard (Per Object)

| Metric | Points | How to Score |
|---|---|---|
| **Anatomy Completeness** | 0-3 | 0 = single box. 1 = has supports. 2 = has trim. 3 = full skeleton-skin-trim. |
| **Material Authenticity** | 0-2 | 0 = wrong ink. 1 = correct primary ink. 2 = correct primary + accent inks. |
| **Tactical Integration** | 0-3 | 0 = just cover. 1 = has a vantage point. 2 = has grapple. 3 = has tunnel + grapple + sniper perch. |
| **Visual Rhythm** | 0-2 | 0 = isolated. 1 = part of a group. 2 = repeating pattern with spacing. |
| **Collision Integrity** | 0-2 | 0 = missing colliders. 1 = all collidable parts have colliders. 2 = noCollide on all trim. |

**Score Interpretation:**
- **10-12:** Benchmark quality (Doodle District level). Ship it.
- **7-9:** Acceptable. Look for missing trim or a grapple ring.
- **4-6:** Below standard. Add skeleton supports, trim layer, and tactical features.
- **0-3:** Reject. Object is a bare box. Rebuild from scratch.

### Self-Improvement Protocol

1. **After every map build:** Score every Tier 2+ object. Record the average.
2. **Minimum average to ship:** 7.0 across all scored objects.
3. **Regression guard:** If a map's average drops below the previous map's average by more than 1.0 point, halt and review.
4. **Learning log:** Append observations to the map's concept doc under a `## Detailing Audit` section:
   - Which objects scored below 7?
   - What was missing?
   - What pattern could be reused from the highest-scoring objects?
5. **Safety ceiling:** Never add more than **40 meshes per Tier 4 object** or **20 meshes per Tier 3 object**. This prevents runaway detailing that hurts frame budget.

---

## 5. Universal Checklist (Pre-Ship Gate)

Before any map is committed, verify:

- [ ] Every Tier 2+ object uses the Skeleton-Skin-Trim triad
- [ ] Material-to-Ink mapping is correct for all surfaces
- [ ] At least 2 distinct ink colors per Tier 2+ object
- [ ] At least 3 distinct ink colors per Tier 3+ object
- [ ] All non-collidable trim uses `noCollide: true`
- [ ] Grapple ring budget is within spec for each tier
- [ ] Every 6m+ horizontal span has a sprint-through tunnel
- [ ] Stair rise is between 0.2m and 0.35m
- [ ] Stair landings are flush (±0.05m) with 3.0m continuous vertical headroom
- [ ] Walkable openings and doors adhere to ≥ 1.8m anti-pinch corridor rule
- [ ] No co-planar overlapping surfaces (minimum 0.02m - 0.05m epsilon to prevent z-fighting)
- [ ] Grapple rings have ≥ 1.5m radial clearance from solid colliders
- [ ] No `new THREE.Mesh()` for static decorative geometry (use `addGeo()`)
- [ ] No allocations inside animation callbacks
- [ ] Object quality scorecard average ≥ 7.0
- [ ] Surface props distributed at ≥ 2m spacing
- [ ] Sky dressing placed at ≥ 60m from center
- [ ] Floor/wall dressing uses `noCollide: true` and height ≤ 0.15m

---

## 6. Reference Benchmarks

### Highest-Scoring Objects (Score: 12/12)
- **Giant Classroom: Teacher's Oak Desk** — Full anatomy (desktop + 2 pedestals + 6 drawer handles + kneehole tunnel + red apple + brass bell + pencil cup + graded papers + gooseneck lamp + meter stick ramp). 4 ink colors. Grapple ring on lamp. Sprint tunnel through center.
- **Doodle District: Building A** — 3 floors + fire escape switchback + interior partitions + roof parapet + ruler bridge + window/door cutouts + multiple spawns/snipers/pickups.
- **Giant Classroom: Grand Library Bookshelf** — 4 shelf tiers + structural partitions + color-coded books + 4-flight switchback staircase with landings/railings + crown deck grapple ring.

### Lowest Acceptable Objects (Score: 7/12)
- **Clockwork Tower: Oil Drum Trio** — `cyl()` body + `cyl()` lid implied by height + `INK.GREEN` ink = anatomy 1 + material 2 + tactical 1 (low cover) + rhythm 2 (group of 3) + collision 1 = 7.

---

## 7. Versioning & Immutability

- **Version:** 1.0 (established from Doodle District + Giant Classroom benchmarks)
- **Immutable:** This file may NOT be modified without explicit developer command: *"update the detailing standard"*
- **Future versions:** Create `universal-detailing-standard-2.0/` as a separate skill
- **Self-learning updates:** Recorded in individual map concept docs, NOT in this file
