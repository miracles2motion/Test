# Doodle District: Comprehensive Map Architecture & Specification

An exhaustive structural, geometrical, and spatial breakdown of **Doodle District** (`district`), the flagship tactical first-person urban map in Doodle Strike / Doodle District.

This document records every coordinate, architectural element, stairway, wall, prop, loot placement, spawn point, and design principle implemented in `src/level.js` and supporting engine files. It is designed as the definitive reference blueprint for understanding how the map achieves its vertical flow, tactical balance, and geometric consistency—specifically to guide the refinement and debugging of maps like **The Giant Desk** (`desk`).

---

## Table of Contents
1. [Spatial Coordinates & World Bounds](#1-spatial-coordinates--world-bounds)
2. [Aesthetic & Ink Material System](#2-aesthetic--ink-material-system)
3. [Perimeter Enclosure & Boundary Engineering](#3-perimeter-enclosure--boundary-engineering)
4. [Central Tower & Construction Crane (Solo)](#4-central-tower--construction-crane-solo)
5. [Building A (West District - Multi-Story Residential)](#5-building-a-west-district---multi-story-residential)
6. [Building B (East District - Industrial Warehouse & Catwalk)](#6-building-b-east-district---industrial-warehouse--catwalk)
7. [The Elevated Highway (North Overpass)](#7-the-elevated-highway-north-overpass)
8. [The North Row Houses (Rooftops & Water Tower)](#8-the-north-row-houses-rooftops--water-tower)
9. [The South Plaza & Street-Level Courtyard](#9-the-south-plaza--street-level-courtyard)
10. [Sky Atmosphere & Aerial Grapple Mechanics](#10-sky-atmosphere--aerial-grapple-mechanics)
11. [Solo vs. Arena Multiplayer Variations](#11-solo-vs-arena-multiplayer-variations)
12. [Spawn Points, Sniper Perches & Item Pickups](#12-spawn-points-sniper-perches--item-pickups)
13. [Core Architectural Rules for Future Maps](#13-core-architectural-rules-for-future-maps)

---

## 1. Spatial Coordinates & World Bounds

Doodle District is built on a strict Cartesian grid using metric-equivalent units:

- **Origin `(0, 0, 0)`**: The geographical center of the district at street ground level.
- **X-Axis (East-West)**:
  - Negative X (`-X`): **West** (Building A, West highway ramp, pencil prop).
  - Positive X (`+X`): **East** (Building B warehouse, East highway ramp, city bus).
- **Y-Axis (Elevation / Altitude)**:
  - `y = -1.0 to 0.0`: Ground slab foundation.
  - `y = 0.0`: Street pavement level (Ground).
  - `y = 4.0`: First floor ceilings / Second story floors.
  - `y = 6.0`: Warehouse interior mezzanine catwalk.
  - `y = 7.0`: Elevated highway deck & Row houses 1 & 3 rooftops.
  - `y = 8.0`: Third story floors.
  - `y = 11.0`: Row house 2 (central brownstone) rooftop.
  - `y = 12.0`: Main rooftops of Building A and Building B / Ruler Bridge deck.
  - `y = 16.0`: Central Tower rooftop deck.
  - `y = 25.0`: Construction crane boom arm.
  - `y = 56.0`: Sky barrier ceiling collider (Solo).
  - `y = 88.0`: Geodesic dome apex collider (Arena).
- **Z-Axis (North-South)**:
  - Negative Z (`-Z`): **North** (Elevated Highway at `z = -30`, Row Houses at `z = -45`).
  - Positive Z (`+Z`): **South** (Courtyard, shipping containers, bus at `z = 24 to 46`, Player Solo spawn at `z = 42`).

### Boundary Envelopes
| Mode | Half-Span ($P$) | Total Footprint | Wall Height ($PH$) | Wall Thickness ($T$) | Player Solo Start |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Solo Mode** | $55\text{ units}$ | $110 \times 110\text{ m}$ | $18\text{ units}$ | $6\text{ units}$ | `(0, 0, 42)` facing North |
| **Arena Mode** | $68\text{ units}$ | $136 \times 136\text{ m}$ | $30\text{ units}$ | $6\text{ units}$ | Distributed Arena Spawns |

---

## 2. Aesthetic & Ink Material System

All geometry in Doodle District is rendered through a procedural ballpoint pen-on-notebook-paper shader (`src/render.js`). Geometry is merged by ink color to minimize draw calls:

- **`INK.BLUE` (ID: 0)**: Primary structural material. Represents authentic blue ballpoint biro ink. Used for building slabs, exterior walls, catwalks, highway deck, lamp posts, clouds, and perimeter walls.
- **`INK.RED` (ID: 1)**: Warning / Apex accent. Used for the Arena Geodesic Dome pinnacle sphere (`radius = 2.4` at `y = 90`).
- **`INK.BLACK` (ID: 2)**: Fine graphic ink / graphite. Used for doorframes, window mullions, antenna poles, highway dashed centerline markings, crane suspension cables, and ruler centimeter tick lines.
- **`INK.ORANGE` (ID: 3)**: High-visibility tactile props & interactables. Used for the iconic **Ruler Bridge**, grapple rings, pencil body, kiosk utility boxes, and upper shipping containers.
- **`INK.GREEN` (ID: 4)**: Industrial accent. Used for ground-level shipping containers, warehouse supply crates, and street utility boxes.
- **`INK.PINK` (ID: 5)**: Rubber stationery accent. Used for pencil eraser caps and the giant pink rubber eraser climbing block.

---

## 3. Perimeter Enclosure & Boundary Engineering

### 3.1 Ground Slab & Boundary Walls
- **Ground Foundation**: Single slab `box(0, -1, 0, 2*P + T, 1, 2*P + T)`. Spans `[-58, 58]` in Solo, ensuring no void leaks at map edges.
- **Outer Walls**:
  - North Wall: `box(0, 0, -P, 2*P + T, PH, T)`
  - South Wall: `box(0, 0, P, 2*P + T, PH, T)`
  - West Wall: `box(-P, 0, 0, T, PH, 2*P + T)`
  - East Wall: `box(P, 0, 0, T, PH, 2*P + T)`

### 3.2 Anti-Camp Sky Containment (Solo Mode)
To prevent players from grappling up onto the top of the 18-unit perimeter walls or shooting outside the map:
- **Invisible Vertical Wall Extensions**: 4 colliders starting at `y = 18`, height `40` (reaching `y = 58`), tagged with `{ noNav: true, noGrapple: true }`.
- **Sky Ceiling Lid**: `collider(0, 56, 0, 2*P + 40, 8, 2*P + 40, { noNav: true, noGrapple: true })`.
- **Sky Cage Rings (Visual Torus Ribs)**:
  - Center: `(0, -22, 0)`, Radius: `R = 96`.
  - 6 vertical semi-circular arch ribs rotated at $30^\circ$ increments (`k * PI / 6`) in `INK.BLUE`.
  - 4 horizontal latitude rings at heights `y = 30, 46, 60, 70` with mathematically computed radii $r = \sqrt{R^2 - (h - C)^2}$.

### 3.3 Perimeter Balconies & Ledges
8 elevated sniper/grapple ledges mounted into the boundary walls at coordinates:
1. `[-30, -51.2, 8, 1.6]` (North-West)
2. `[30, -51.2, 8, 1.6]` (North-East)
3. `[-51.2, 40, 1.6, 8]` (South-West)
4. `[51.2, -10, 1.6, 8]` (East-Central)
5. `[-51.2, -30, 1.6, 6]` (West-Central)
6. `[51.2, 35, 1.6, 6]` (South-East)
7. `[10, 51.2, 8, 1.6]` (South-Central)
8. `[-40, 51.2, 6, 1.6]` (South-West)

- **Structure**: Every ledge has a lower tier at `y = 5.5` (thickness `0.4`) and an upper tier at `y = 9.0` (thickness `0.4`).
- **Arena Additions**: Includes a high tier at `y = 16.0` and an overhead orange grapple ring at `y = 20.0` aligned along the Y-axis.

### 3.4 Enemy Spawn Doorways
10 themed spawn alcoves recessed into the perimeter walls where wave enemies enter the district:
- **6 Longitudinal Doors**: `(-52, 0)`, `(52, 0)`, `(-52, 30)`, `(52, -30)`, `(-52, -30)`, `(52, 30)`.
- **4 Latitudinal Doors**: `(0, -52)`, `(0, 52)`, `(-30, 52)`, `(30, 52)`.
- **Door Frame Geometry**:
  - Vertical jambs: `0.3 x 3.2 x 0.5` in `INK.BLACK` spaced `2.4m` apart.
  - Horizontal lintel: `2.7 x 0.3 x 0.5` at `y = 3.0`.
  - Enemy spawn node positioned `1.2m` inward from the portal.

---

## 4. Central Tower & Construction Crane (Solo)

The heart of Doodle District in Solo Mode. A four-story open steel-and-concrete frame building dominated by a working construction crane.

### 4.1 Frame & Dimensions
- **Footprint**: $14 \times 14\text{ m}$ square, centered from `x = -7 to 7`, `z = -7 to 7`.
- **Story Heights**: Exactly $4.0\text{ m}$ per story:
  - Floor 1: `y = 4.0` (slab thickness `0.4`).
  - Floor 2: `y = 8.0` (slab thickness `0.4`).
  - Floor 3: `y = 12.0` (slab thickness `0.4`) — connects to Building A & B bridges.
  - Floor 4 (Roof): `y = 16.0` (slab thickness `0.4`).
- **8 Structural Support Pillars**:
  - 4 Corner Columns: `(-6.6, -6.6)`, `(6.6, -6.6)`, `(-6.6, 6.6)`, `(6.6, 6.6)`.
  - 4 Mid-Face Columns: `(0, -6.6)`, `(0, 6.6)`, `(-6.6, 0)`, `(6.6, 0)`.
  - Column dimensions: `0.8 x 16.0 x 0.8` (spans ground to roof unbroken).

### 4.2 Floor Railings & Jump Gaps
Railings are $0.9\text{ m}$ high with posts every $2\text{ m}$ and a $1.0\text{ m}$ tall physics collider (`noNav: true, noShoot: true`):
- **Floors 1–3**:
  - South edge: `rail(-7, 7, -1.5, 7)` and `rail(1.5, 7, 7, 7)` leaving a $3.0\text{ m}$ central jump gap.
  - West & East edges: Continuous edge protection.
  - North edge: Gaps at `rail(-7, -7, -6.5, -7)` and `rail(3.5, -7, 7, -7)` leaving access for stair landings.
- **Roof Parapet (`y = 16`)**:
  - Strategically broken parapet allowing players to leap to adjacent bridges or drop down into courtyard cover.

### 4.3 The Construction Crane
Mounted on the Northeast corner of the tower roof:
- **Vertical Crane Mast**: Base at `(5.5, 16.0, 5.5)`, size `1.0 x 10.0 x 1.0` (reaches `y = 26.0`).
- **Operator Cabin**: Offset at `(5.5, 25.2, 5.5)`, size `1.6 x 1.4 x 1.6` (`noCollide: true`).
- **Forward Jib (Boom Arm)**: Extends East over the plaza: `(11.5, 25.0, 5.5)`, dimensions `16.0 x 0.8 x 0.8`.
- **Counter-Jib**: Extends West: `(1.0, 25.0, 5.5)`, dimensions `5.0 x 0.8 x 0.8`.
- **Concrete Counterweight**: `(-0.5, 23.6, 5.5)`, dimensions `2.0 x 1.6 x 1.6`.
- **Steel Hoist Cable**: Dropped from boom tip: `(19.0, 20.5, 5.5)`, thickness `0.08 x 4.6 x 0.08` in `INK.BLACK`.
- **Dual Grapple Rings**:
  - Hook Ring: `(19.0, 19.8, 5.5)` oriented along the X-axis (`INK.ORANGE`).
  - Boom Tip Ring: `(19.5, 24.6, 5.5)` oriented along the Z-axis (`INK.ORANGE`).
  - *Tactical Value*: Allows swinging directly from Building B roof onto the tower roof.

### 4.4 North Face Two-Lane Switchback Staircase
**Engineered Innovation**: To prevent stair flights from colliding with the flight directly above, the staircase uses an alternating dual-lane staggered layout:

| Flight | Altitude Gain | Direction | Start Coords $(x, y, z)$ | Steps | Rise / Run | Landing Coords | Landing Slab Bounds |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Flight 0** | $0.0 \rightarrow 4.0$ | `+x` (East) | `(-5.0, 0.0, -8.3)` | 14 | $0.2857 / 0.45$ | `x = 2.4, y = 4.0` | `x: [1.3, 3.5], z: [-11.4, -7.0]` |
| **Flight 1** | $4.0 \rightarrow 8.0$ | `-x` (West) | `(1.3, 4.0, -10.3)` | 14 | $0.2857 / 0.45$ | `x = -6.1, y = 8.0` | `x: [-7.2, -5.0], z: [-11.4, -7.0]` |
| **Flight 2** | $8.0 \rightarrow 12.0$ | `+x` (East) | `(-5.0, 8.0, -8.3)` | 14 | $0.2857 / 0.45$ | `x = 2.4, y = 12.0` | `x: [1.3, 3.5], z: [-11.4, -7.0]` |
| **Flight 3** | $12.0 \rightarrow 16.0$ | `-x` (West) | `(1.3, 12.0, -10.3)`| 14 | $0.2857 / 0.45$ | Arrives at Tower Roof | Roof Deck |

- **Lane Offset**: Inner lane is at `z = -8.3`; Outer lane is at `z = -10.3`.
- **Riser Precision**: $4.0\text{ m} / 14\text{ steps} = 0.2857\text{ m}$, perfectly within character step-up limits.

---

## 5. Building A (West District - Multi-Story Residential)

A 3-story residential/office complex featuring interior partitioned rooms, window firing slits, an exterior south fire escape, and the iconic **Ruler Bridge**.

### 5.1 Footprint & Slabs
- **Bounds**: `x: [-43, -25]`, `z: [4, 20]`. Total footprint: $18\text{ m wide} \times 16\text{ m deep}$.
- **Floor Slabs**: 3 levels at `y = 4.0, 8.0, 12.0` (thickness `0.4`).
- **Roof**: Flat accessible roof at `y = 12.0`.

### 5.2 Wall Fenestration & Openings (0.4m Wall Thickness)
- **East Face (`x = -25`, Facing Central Tower)**:
  - Ground Entrance: `z = [10, 13], y = [0, 3.2]`.
  - Floor 2 Windows: `z = [6, 9], y = [5, 7]` and `z = [14, 17], y = [5, 7]`.
  - Floor 3 Windows: `z = [6, 9], y = [9, 11]` and `z = [14, 17], y = [9, 11]`.
- **West Face (`x = -43`, Facing Outer Wall Alley)**:
  - Ground Service Door: `z = [8, 11], y = [0, 3.2]`.
  - Floor 2 Window: `z = [8, 11], y = [4.5, 7.5]`.
  - Floor 3 Window: `z = [8, 11], y = [8.5, 11.5]`.
- **North Face (`z = 4`, Facing Elevated Highway)**:
  - Ground Doorway: `x = [-36, -33], y = [0, 3.2]`.
  - Floor 2 Windows: `x = [-40, -37], y = [5, 7]` and `x = [-31, -28], y = [5, 7]`.
  - Floor 3 Window: `x = [-36, -32], y = [8.5, 11.5]`.
- **South Face (`z = 20`, Fire Escape Side)**:
  - 3 Ground Exits: `x = [-42, -39]`, `x = [-36, -32]`, `x = [-31, -27]` (all $3.2\text{ m}$ high).
  - Floor 2 Fire Doors & Windows: Doorway at `x = [-37.2, -33.5], y = [4.05, 7.2]`; Window at `x = [-41, -27], y = [4.6, 7.6]`.
  - Floor 3 Fire Doors & Windows: Doorway at `x = [-36, -32], y = [8.4, 11.4]`; Window at `x = [-29, -25.5], y = [8.05, 11.2]`.

### 5.3 Interior Room Partitions
- **Floor 1 (`y = 0 to 4`)**: Longitudinal wall along `z = 12` with two doorways at `x = [-40, -37.5]` and `x = [-30, -27.5]`.
- **Floor 2 (`y = 4 to 8`)**: Dividing wall along `z = 12` with central passage at `x = [-36, -32]`.
- **Floor 3 (`y = 8 to 12`)**: Latitudinal dividing wall along `x = -34` with dual doors at `z = [8, 11]` and `z = [14, 17]`.

### 5.4 South Face Exterior Fire Escape
An exterior structural steel switchback system mounted on the south wall (`z = 21.2 to 23.2`):
- **Flight 0 (Ground $\rightarrow$ F2)**: Starts at `(-28.5, 0, 21.2)`, runs `-x`, 14 steps, landing at `x = -35.9, y = 4.0`.
- **Flight 1 (F2 $\rightarrow$ F3)**: Starts at `(-34.8, 4, 23.2)`, runs `+x`, 14 steps, landing at `x = -27.4, y = 8.0`.
- **Flight 2 (F3 $\rightarrow$ Roof)**: Starts at `(-28.5, 8, 21.2)`, runs `-x`, 14 steps, landing at `x = -35.9, y = 12.0`.
- **Landings**: Cantilevered slabs `slab(lx - 1.1, 20.2, lx + 1.1, 24.4, y, 0.4)` protected by outer safety railings.

### 5.5 The Iconic Ruler Bridge
A giant school ruler deployed as a tactical high-ground pedestrian bridge at `y = 12.0`:
- **Color & Material**: Solid orange wood finish (`INK.ORANGE`) with black tick marks (`INK.BLACK`).
- **Dimensions**: Width $2.4\text{ m}$, thickness $0.4\text{ m}$.
- **Solo Mode Span**: Connects Building A roof (`x = -25`) to Central Tower Floor 3 (`x = -7`). Total length: $18.2\text{ m}$.
- **Arena Mode Span**: Extends uninterrupted across the entire central courtyard from Building A (`x = -25`) directly to Building B (`x = 24.2`). Total length: $49.4\text{ m}$!
- **Tick Marks**: Procedurally drawn along the north rim:
  - Centimeter ticks: `0.06 x 0.02 x 0.35` every $1.0\text{ m}$.
  - Major 5cm/10cm ticks: `0.06 x 0.02 x 0.60` every $5.0\text{ m}$.
- **Guardrails**: Handrails at $z = 7.2$ (and both $z = 4.8$ & $7.2$ in Arena) in `INK.ORANGE`.

---

## 6. Building B (East District - Industrial Warehouse & Catwalk)

A high-ceiling industrial warehouse building featuring a full interior mezzanine catwalk, open high-bay volume, and a central roof skylight breach.

### 6.1 Footprint & High-Bay Volume
- **Bounds**: `x: [24, 44]`, `z: [4, 20]`. Total footprint: $20\text{ m wide} \times 16\text{ m deep}$.
- **Clear Height**: Uninterrupted $12.0\text{ m}$ interior ceiling clearance from ground to roof slab.

### 6.2 Roof & 6x6m Central Skylight
- **Roof Slab**: Located at `y = 12.0`, constructed as 4 border slabs around a central opening:
  - North/South slabs: `slab(24, 4, 44, 9, 12)` and `slab(24, 15, 44, 20, 12)`.
  - East/West filler slabs: `slab(24, 9, 31, 15, 12)` and `slab(37, 9, 44, 15, 12)`.
- **Skylight Breach**: A $6 \times 6\text{ m}$ open aperture from `x = 31 to 37`, `z = 9 to 15`. Players can snipe directly down into the warehouse interior or grapple through the opening.

### 6.3 Warehouse Wall Apertures
- **West Face (`x = 24`, Facing Courtyard)**:
  - Cargo Roll-Up Door: `z = [10, 14], y = [0, 3.6]`.
  - Upper Clerestory Windows: `z = [6, 9], y = [7, 10]` and `z = [15, 18], y = [7, 10]`.
- **East Face (`x = 44`, Perimeter Alley)**:
  - Personnel Doors: `z = [7, 10], y = [0, 3.2]` and `z = [14, 17], y = [0, 3.2]`.
  - Industrial High Windows: `z = [8, 16], y = [7, 10]`.
- **North Face (`z = 4`, Highway Facing)**:
  - Main Bay Door: `x = [32, 36], y = [0, 3.6]`.
  - Clerestory Windows: `x = [27, 30], y = [7, 10]` and `x = [38, 41], y = [7, 10]`.
- **South Face (`z = 20`, Exterior Stair Side)**:
  - Dual Ground Doors: `x = [26, 29], y = [0, 3.2]` and `x = [39, 42], y = [0, 3.2]`.
  - Multi-tier Windows: `x = [33.5, 36.5], y = [4.05, 7.2]`, `x = [25.5, 28.5], y = [8.05, 11.2]`, and `x = [32, 36], y = [8, 11]`.

### 6.4 360-Degree Interior Mezzanine Catwalk (`y = 6.0`)
A complete elevated steel walkway hugging all four interior walls at $6.0\text{ m}$ elevation:
- **Walkway Slabs**: Width $1.6\text{ m}$, thickness $0.3\text{ m}$:
  - West strip: `slab(24.4, 4.4, 26.0, 19.6, 6)`.
  - East strip: `slab(42.0, 4.4, 43.6, 19.6, 6)`.
  - North strip: `slab(26.0, 4.4, 42.0, 6.0, 6)`.
  - South strip: `slab(26.0, 18.0, 42.0, 19.6, 6)`.
- **Catwalk Railings**: Mounted on the interior perimeter at `y = 6.0` with openings for stair access and drop-down vaults.
- **Interior Industrial Staircase**:
  - Starts at `(26.2, 0, 8.6)` along the west wall.
  - Orientation: Runs `+z` (South).
  - Steps: 21 steps with custom rise `6 / 21 = 0.2857\text{ m}` and run `0.45\text{ m}`. Width $1.6\text{ m}$.
  - Landing: Arrives at `z = 18.05, y = 6.0` flush with the South catwalk.

### 6.5 Interior Warehouse Cover & Props
- **Main Shipping Crate Stack**: `box(34, 0, 12, 2.4, 2.4, 2.4)` in `INK.BLUE`.
- **Stepped Crate**: `box(36.4, 0, 12, 2.4, 1.2, 2.4)` — provides a jump ramp onto the high crate.
- **Green Supply Crate**: `box(30, 0, 16, 1.6, 1.6, 1.6)` in `INK.GREEN`.

### 6.6 Exterior South Switchback & Plank Bridge
- **Exterior Stairs**: Symmetrical to Building A, running along the south wall (`x = 27.5 to 34.9`, `z = 21.2 to 23.2`) up to the roof at `y = 12.0`.
- **Timber Plank Bridge (Solo Mode)**:
  - Spans from Central Tower Floor 3 (`x = 7.0`) to Building B Roof (`x = 24.0`).
  - Dimensions: Center `(15.5, 11.6, 6.0)`, length $17.4\text{ m}$, thickness $0.4\text{ m}$, width $2.2\text{ m}$.
  - Side railing: `rail(7, 4.9, 24, 4.9, 12)`.

---

## 7. The Elevated Highway (North Overpass)

A massive east-west arterial overpass serving as the primary tactical bridge between the downtown district and the residential north row houses.

### 7.1 Dimensions & Pier Structure
- **Deck Elevation**: Top driving surface at `y = 7.0`. Thickness: $0.6\text{ m}$ (slab base at `y = 6.4`).
- **Span & Width**: Spans from `x = -52.0` to `52.0` (total length $104\text{ m}$). Width: $9.0\text{ m}$ (from `z = -34.5` to `-25.5`).
- **9 Support Piers**: Massive rectangular columns centered at `z = -30` spaced every $12\text{ m}$:
  - Coordinates: `x = -48, -36, -24, -12, 0, 12, 24, 36, 48`.
  - Dimensions: `1.4 x 6.4 x 1.4` (extends ground `y = 0` to underside of slab `y = 6.4`).

### 7.2 Barriers & Access Portals
- **North Concrete Barrier (`z = -34.3`)**: Height $0.9\text{ m}$, thickness $0.4\text{ m}$. Features 3 access gaps connecting to pedestrian footbridges:
  - West Bridge Gap: `x = [-33, -29]`.
  - Center Bridge Gap: `x = [-2, 2]`.
  - East Bridge Gap: `x = [27, 31]`.
- **South Concrete Barrier (`z = -25.7`)**: Height $0.9\text{ m}$, thickness $0.4\text{ m}$. Features 2 gaps for stair on-ramps:
  - West Stair Gap: `x = [-36.5, -33]`.
  - East Stair Gap: `x = [33, 36.5]`.

### 7.3 Ground-Level Access On-Ramps
Two symmetrical pedestrian stair ramps provide ground access to the highway deck:
- **West Staircase**: Starts at `(-46.5, 0, -24.5)`, runs `+x`, 25 steps (rise `0.28m`, run `0.45m`, width $2.0\text{ m}$) reaching `y = 7.0` at `x = -35.25`.
- **East Staircase**: Starts at `(46.5, 0, -24.5)`, runs `-x`, 25 steps reaching `y = 7.0` at `x = 35.25`.

### 7.4 Road Markings
- Dashed road centerlines in `INK.BLACK` (`2.0 x 0.02 x 0.2`) spaced every $4\text{ m}$ along `z = -30` from `x = -50` to `50`.

---

## 8. The North Row Houses (Rooftops & Water Tower)

A stepped residential block situated at `z = -45` behind the highway, offering varied rooftop combat, snipers' nests, and elevated vantage points.

### 8.1 Building Footprints
- **House 1 (West Brownstone)**: `box(-30, 0, -45, 14, 7, 10)`. Roof deck at `y = 7.0`.
- **House 2 (Central High Brownstone)**: `box(-8, 0, -45, 14, 11, 10)`. Roof deck at `y = 11.0`.
- **House 3 (East Brownstone)**: `box(16, 0, -45, 14, 7, 10)`. Roof deck at `y = 7.0`.

### 8.2 Pedestrian Overpass Footbridges (Highway $\rightarrow$ Houses)
3 skybridges spanning the void between the Elevated Highway (`z = -34.5`) and the Row Houses (`z = -40`):
- **West Bridge (Highway $\rightarrow$ House 1)**: `box(-31, 6.7, -37.25, 2.6, 0.3, 5.5)` with dual handrails at $x = -32.3$ and $x = -29.7$.
- **Center Bridge (Highway $\rightarrow$ House 2 base)**: `box(0, 6.7, -37.25, 2.6, 0.3, 5.5)`.
- **East Bridge (Highway $\rightarrow$ House 3)**: `box(29, 6.7, -37.25, 2.6, 0.3, 5.5)` with dual handrails at $x = 27.7$ and $x = 30.3$.

### 8.3 Rooftop Elevation Staircases
Because House 2 stands $4.0\text{ m}$ higher than Houses 1 and 3, two rooftop staircases bridge the elevation difference:
- **West Rooftop Stairs (House 1 $\rightarrow$ House 2)**: Starts at `(-23, 7, -45)`, runs `+x`, 14 steps, width $2.2\text{ m}$. Connects to landing `slab(-16.9, -46.1, -15, -43.9, 11, 0.4)`.
- **East Rooftop Stairs (House 3 $\rightarrow$ House 2)**: Starts at `(9, 7, -45)`, runs `-x`, 14 steps, width $2.2\text{ m}$. Connects to landing `slab(-1, -46.1, 2.9, -43.9, 11, 0.4)`.

### 8.4 Rooftop Architectural Detailing
- **House 1 Brick Chimney**: `box(-33, 7, -48, 1.2, 1.6, 1.2)`.
- **House 3 Brick Chimney**: `box(19, 7, -42, 1.2, 1.4, 1.2)`.
- **House 2 Cylindrical Water Tank**: `cyl(-10, 11, -47.5, radius 1.4, height 2.6, 14 segments)` in `INK.BLUE`. Serves as high sniper cover.
- **House 2 Radio Antenna**: `box(-5, 11, -42, 0.1, 4.0, 0.1)` in `INK.BLACK` (`noCollide: true`).

---

## 9. The South Plaza & Street-Level Courtyard

The open public square in the southern sector (`z = 24 to 46`) populated with cover props, transit vehicles, shipping containers, and giant stationery doodled objects.

### 9.1 Multi-Tier Shipping Containers
- **West Stack (`x = -14, z = 34`)**:
  - Lower Container: `(-14, 0, 34)`, size `2.5 x 2.6 x 6.2` in `INK.GREEN`.
  - Upper Container: `(-14, 2.6, 34)`, size `2.5 x 2.6 x 6.2` in `INK.ORANGE`.
  - Total height: $5.2\text{ m}$. Can be mantle-climbed from adjacent crates.
- **East Stack (`x = 14 to 17, z = 36`)**:
  - Lower Container: `(14, 0, 36)`, size `6.2 x 2.6 x 2.5` in `INK.BLUE`.
  - Upper Offset Container: `(17, 2.6, 36)`, size `3.0 x 2.6 x 2.5` in `INK.GREEN`.

### 9.2 City Transit Bus
A full-scale urban transit bus parked at `(24, 0, 40)`:
- **Main Cabin Body**: `box(24, 0.6, 40, 11.0, 3.2, 2.8)` in `INK.BLUE`.
- **Undercarriage Base**: `box(24, 0, 40, 10.0, 0.6, 2.6)` (`noCollide: true`).
- **4 Black Wheels**: Cylinders at `x = [20, 28]` and `z = [38.5, 41.5]`, radius `0.55`, width `0.4` in `INK.BLACK`.
- *Tactical Role*: Bus roof stands at `y = 3.8`, providing a mid-tier fighting platform and line-of-sight block.

### 9.3 Giant Stationery & Novelty Props
- **Giant Yellow/Orange Wooden Pencil**:
  - Position: Lying on pavement along the X-axis at `z = 44`.
  - Hexagonal Shaft: `cyl(-30, 0.8, 44, radius 0.8, length 16, 6 segments)` rotated on Z, in `INK.ORANGE`. Collider: `(-30, 0, 44, 16, 1.6, 1.6)`.
  - Graphite Lead Tip: Cone at `(-20.8, 0.8, 44)`, radius `0.8`, length `2.4` in `INK.BLACK`.
  - Rubber Eraser & Ferrule: Cylinder at `(-38.8, 0.8, 44)`, radius `0.82`, length `1.6` in `INK.PINK`.
  - *Gameplay*: Serves as $1.6\text{ m}$ chest-high cover and a walkable ramp.
- **Giant Pink Eraser Block**:
  - Base Block: `box(38, 0, 40, 6.0, 2.2, 3.2)` in `INK.PINK`.
  - Paper Sleeve Band: `box(38, 2.2, 40, 6.0, 0.8, 3.2)` in `INK.BLUE`.
  - Total height: $3.0\text{ m}$.
- **Giant Blue Coffee Mug**:
  - Mug Body: `cyl(-40, 0, 32, radius 2.6, height 3.4, 16 segments)` in `INK.BLUE`.
  - Torus Handle: `torus(-36.6, 1.8, 32, radius 1.4, tube 0.35)` in `INK.BLUE`.

### 9.4 Street Furniture & Tactical Low Cover
- **4 Street Light Poles**: `(-10, 46)`, `(10, 46)`, `(-22, 24)`, `(22, 24)`. Vertical post `0.25 x 6.0 x 0.25`, lamp fixture `1.4 x 0.3 x 0.5`.
- **2 Park Benches**: `(-4, 0.4, 46)` and `(4, 0.4, 46)`. Wood seat `3.0 x 0.15 x 0.6` at `y = 0.4`.
- **Low Concrete Road Barriers**:
  - `box(-8, 0, -18, 4.0, 1.1, 1.2)`
  - `box(8, 0, -18, 4.0, 1.1, 1.2)`
  - `box(0, 0, 22, 5.0, 0.5, 1.4)` (speed bump / low barrier).
- **Utility Kiosk Cubes**:
  - `box(-24, 0, -18, 2.4, 2.6, 2.4)` in `INK.ORANGE`.
  - `box(26, 0, -18, 2.4, 2.6, 2.4)` in `INK.GREEN`.
- **Scattered Plaza Wooden Crates**:
  - Stacked cluster at `(-6, 0, 28)`: 1.4m crate, 1.2m crate, and 1.0m crate stacked to `y = 2.4`.
  - Cluster at `(8, 0, 26)`: 1.6m crate and 1.2m crate.

---

## 10. Sky Atmosphere & Aerial Grapple Mechanics

### 10.1 Procedural Sun & Clouds
- **Doodle Sun**:
  - Center sphere at `(-90, 110, -160)` with radius `12` in `INK.BLUE`.
  - 12 radial beam rays: `box(6.0, 0.7, 0.7)` rotated along circular rim at radius `19.0`.
- **Cumulus Doodle Cloud Formations**:
  - 6 large cloud clusters placed around the horizon:
    1. `(60, 70, -170)` (scale 1.0)
    2. `(-20, 75, -190)` (scale 1.3)
    3. `(140, 60, -80)` (scale 0.9)
    4. `(-150, 65, 40)` (scale 1.1)
    5. `(30, 80, 180)` (scale 1.2)
    6. `(-90, 60, 170)` (scale 0.8)
  - Each cloud consists of 6 fused spheres of radii $4\text{ to }6\text{ units}$ creating soft irregular silhouette volumes.

### 10.2 Circling Paper Airplanes (Dynamic Grapple Points)
A signature gameplay mechanic where moving paper airplanes loop overhead and can be hooked by the player's grapple gun:
- **Geometry**: Folded delta-wing paper airplane constructed from `ConeGeometry(1.2 * sc, 4.0 * sc, 3)`.
- **Count & Scale**:
  - Solo Mode: 3 planes (`scale = 1.4`, base radius `30`, base height `30`).
  - Arena Mode: 4 planes (`scale = 1.7`, base radius `30`, base height `26`).
- **Dynamic Orbital Motion**:
  $$\theta(t) = t \cdot \text{speed} + \text{phase}$$
  $$X(t) = \cos(\theta) \cdot r, \quad Z(t) = \sin(\theta) \cdot r \cdot 0.7$$
  $$Y(t) = h + \sin(\theta \cdot 2.3) \cdot 3.0$$
  - Includes banking rotation (`rotateZ(sin(theta * 3) * 0.6)`) and continuous look-ahead orientation.
- **Grapple System Hook**:
  - Registered in `L.grappleMovers` with hit collision radius $2.2 \times \text{scale}$.
  - When the player fires a grapple hook at the plane, the anchor point tracks the plane's motion matrix, allowing players to swing high above the rooftops!

---

## 11. Solo vs. Arena Multiplayer Variations

| Feature | Solo Wave Survival (`!arena`) | Peer-to-Peer Arena Match (`arena`) |
| :--- | :--- | :--- |
| **Map Radius ($P$)** | $55\text{ m}$ ($110 \times 110\text{ m}$ total) | $68\text{ m}$ ($136 \times 136\text{ m}$ total) |
| **Boundary Height** | $18\text{ m}$ with invisible vertical blocker to $y = 58$ | $30\text{ m}$ perimeter walls |
| **Sky Enclosure** | Sky lid at $y = 56$ + 6 Blue Torus Arches | $120\text{ m}$ Geodesic Dome with Red Apex Keystone ($y=90$) |
| **Central Courtyard** | **Central Tower** (4 stories, switchbacks, crane) | **Open Courtyard Arena** (Central Tower removed) |
| **Ruler Bridge** | $18.2\text{ m}$ bridge connecting Building A to Central Tower | **$49.4\text{ m}$ continuous bridge** connecting Building A to B |
| **Timber Bridge** | $17.4\text{ m}$ bridge connecting Central Tower to Building B | Omitted |
| **Suspended Platforms**| None | **5 Suspended Cable Pads** hung from the geodesic dome |
| **South Plaza Props** | Bus, giant pencil, giant eraser, coffee mug, crates | Cleared for unobstructed combat & clear sightlines |
| **Spawn System** | Fixed single player start at `(0, 0, 42)` | 15 distributed arena spawn points across all elevations |

### 11.1 Arena Geodesic Dome & Suspended Sky Pads
In multiplayer Arena matches, the sky is covered by a massive structural dome ($R = 120, C = -30$):
- 8 longitudinal Torus ribs rotated by $\pi / 8$ ($22.5^\circ$).
- 5 latitude rings at $y = 38, 54, 68, 80, 88$.
- Apex Sphere: radius $2.4$ at `(0, 90, 0)` in `INK.RED`.
- **5 Suspended Hanging Platforms**:
  1. Center: `(0, 24, 0)`, size $8 \times 8\text{ m}$.
  2. Northwest: `(-42, 18, -24)`, size $6 \times 6\text{ m}$.
  3. Southeast: `(44, 21, 30)`, size $6 \times 6\text{ m}$.
  4. Northeast: `(28, 27, -46)`, size $5 \times 5\text{ m}$.
  5. Southwest: `(-30, 30, 44)`, size $5 \times 5\text{ m}$.
  - Each platform hangs from the dome via an `INK.BLACK` cable, has a $0.5\text{ m}$ thick deck, and features an inverted orange grapple ring at `y - 1.3`.

---

## 12. Spawn Points, Sniper Perches & Item Pickups

### 12.1 Sniper Perches (`L.snipers`)
High-elevation tactical vantage points assigned to AI sniper units:
1. `(0, 16, -3)`: Central Tower Roof parapet (Solo).
2. `(-27, 12, 6)`: Building A roof corner overlooking the Ruler Bridge.
3. `(26, 12, 18)`: Building B roof corner overlooking courtyard and catwalk.
4. `(0, 7, -30)`: Elevated Highway central pier overpass.
5. `(-8, 11, -48)`: House 2 roof ledge beside the water tank.
6. `(16, 7, -43)`: House 3 rooftop overpass.

### 12.2 Supply & Weapon Pickups (`L.pickups`)
1. Central Tower: `(0, 12, 0)` [F3], `(-4, 8, 4)` [F2], `(0, 16, 0)` [Roof].
2. Building A: `(-34, 4, 12)` [F2 interior], `(-30, 12, 16)` [Roof corner], `(-40, 8, 8)` [F3 room].
3. Building B: `(34, 0, 12)` [Warehouse crates], `(34, 6, 19)` [South catwalk], `(42, 12, 6)` [Roof skylight edge].
4. Elevated Highway: `(-10, 7, -30)` [West lane], `(24, 7, -30)` [East lane].
5. Row Houses: `(-8, 11, -43)` [House 2 roof], `(-30, 7, -45)` [House 1 roof].
6. South Plaza: `(-6, 0, 36)`, `(6, 0, 36)`, `(-30, 1.6, 44)` [On giant pencil], `(38, 3, 40)` [On giant eraser], `(0, 0, 10)` [Courtyard center].

### 12.3 Symmetric Multiplayer Team Spawns (`L.teamSpawns`)
- **Red Team Spawns (West/North)**:
  - `(-40, 0, 18)` (Building A ground interior)
  - `(-34, 12, 12)` (Building A roof deck)
  - `(-48, 7, -30)` (Highway West terminal)
  - `(-52, 0, 30)` (Southwest perimeter alley)
  - `(-30, 7, -48)` (House 1 roof deck)
- **Blue Team Spawns (East/South)**:
  - `(40, 0, 8)` (Building B warehouse floor)
  - `(34, 12, 18)` (Building B roof deck)
  - `(48, 7, -30)` (Highway East terminal)
  - `(52, 0, 30)` (Southeast perimeter alley)
  - `(16, 7, -45)` (House 3 roof deck)

---

## 13. Core Architectural Rules for Future Maps

To avoid the detailing inconsistencies found in maps like **The Giant Desk** (`desk`), all level designs must adhere to the mathematical and structural conventions established by Doodle District:

### 1. Step & Stair Mathematical Consistency
- **Step Rise Limit**: The game's character controller swept-sphere / AABB resolution (`src/physics.js`) smoothly negotiates step-ups up to $\approx 0.35\text{ m}$. Standard step rise MUST remain between **$0.28\text{ m}$ and $0.29\text{ m}$** (e.g., $4.0\text{ m} / 14\text{ steps} = 0.2857\text{ m}$, or $6.0\text{ m} / 21\text{ steps} = 0.2857\text{ m}$).
- **Step Run**: Must always be **$0.45\text{ m}$** to preserve realistic slope angle ($32^\circ$).
- **Stair Width**: Standard staircases must be between **$1.6\text{ m}$ and $2.2\text{ m}$** wide to prevent character snagging.
- **The Staggered Lane Rule**: When building vertical switchbacks (like the Central Tower or building fire escapes), **never place a flight directly above the flight beneath it**. Alternate lanes laterally by at least $2.0\text{ m}$ (`lane = -8.3` and `-10.3`). This guarantees the player's head never clips the underside of the upper flight.

### 2. Story Height & Clearance Standards
- **Standard Floor Height**: Exactly **$4.0\text{ m}$** floor-to-floor.
- **Slab Thickness**: Standard floor slabs must be **$0.4\text{ m}$** thick, leaving a clean net interior headroom of **$3.6\text{ m}$**.
- **Doorway Clearances**: All standard doors must have a minimum width of **$2.4\text{ m}$ to $3.0\text{ m}$** and a minimum height of **$3.2\text{ m}$** to ensure fast player traversal without getting caught on door frames.

### 3. Cover Height Hierarchy
Every piece of cover must fall into one of three functional combat heights:
- **Low Crouch Cover**: $0.8\text{ m}$ to $1.2\text{ m}$ (concrete barriers, small crates, park benches). Player can crouch behind and peek over when standing.
- **Chest Cover**: $1.4\text{ m}$ to $1.6\text{ m}$ (shipping crates, giant pencil, road divider). Protects standing players while allowing headshots or vaulting.
- **Full Visual & Ballistic Occlusion**: $2.4\text{ m}$ to $3.2\text{ m}$ (shipping containers, city bus, utility kiosks). Completely breaks enemy sightlines and forces flank routes.

### 4. Continuous Flow Loops (No Dead Ends)
- Every elevated platform, building, or rooftop MUST provide at least **two separate entry routes** and at least **one fast drop-off or grapple escape route**.
- For example, Building A roof can be accessed via:
  1. South fire escape stairs.
  2. North window ledge climbing.
  3. Ruler Bridge from the Central Tower.
  4. Grapple onto overhead circling paper planes.
  5. Dropping down safely into the courtyard onto the bus or container stacks.

### 5. Physics & Collision Tagging Discipline
- **`noNav: true`**: Must be applied to all thin railings, decorative lamp posts, crane cables, and aerial platforms to prevent enemy AI navigation mesh generators from generating invalid pathing nodes on narrow edges.
- **`noGrapple: true`**: Must be placed on map boundary lids and upper perimeter wall extensions to prevent players from latching out of bounds.
- **`noCollide: true`**: Reserved for non-physical aesthetic props (e.g. road dashed lines, crane operator cabin, bus undercarriage, antenna rods) to reduce physics query overhead.
- **Orientation of Rings**: Torus grapple rings must always have their axis perpendicular to the grapple approach vector (`'x'`, `'y'`, or `'z'`).

---

*Document compiled from source verification of `src/level.js`, `src/render.js`, and `src/physics.js`.*
