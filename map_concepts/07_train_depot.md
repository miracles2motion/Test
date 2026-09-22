# The Steam Locomotive Depot: Comprehensive Map Architecture & Specification

A master structural, geometrical, and aesthetic blueprint for **The Steam Locomotive Depot** (Map Key: `train_depot` / `roundhouse` / `depot`), an epic Victorian industrial rail terminal combat arena set within a monumental brick-and-wrought-iron engine terminal drawn with deep carbon graphite shading, sepia drafting linen (`#f2ebd9`), blueprint steel lattice linework, and oxidized copper verdigris accents.

Featuring a 34-meter circular turntable pit ($Y=-2.2\text{m}$) with an operable rotating steel truss turntable bridge, a colossal 24-meter 4-6-2 Pacific Steam Locomotive ("The Iron Leviathan") with a walkable engineer's cab interior and glowing coal firebox, dual 15-ton overhead travelling gantry cranes with suspended catwalks ($Y=7.2\text{m}$), an elevated coaling stage with gravity hopper chutes, six radiating roundhouse service stalls with grease inspection trenches, an elevated riveted iron water tank tower ($Y=16.0\text{m}$), and kinetic steam blow-off exhaust plumes.

Designed using the exact mathematical standards, coordinate bounds, vertical step ratios, and traversal loops of **The Blueprint Castle** (`castle`) and **The Zen Garden** (`zen`), this specification establishes a flawless, uncompromised reference for implementing the steam locomotive depot in `src/level.js` without geometric inconsistencies, blind traps, or collision bugs.

---

## Table of Contents
1. [Spatial Coordinates & World Bounds](#1-spatial-coordinates--world-bounds)
2. [Aesthetic & Ink Material System](#2-aesthetic--ink-material-system)
3. [Perimeter Enclosure & Roundhouse Brickwork](#3-perimeter-enclosure--roundhouse-brickwork)
4. [Sector 1: Heavy Machine Lathe Shop & Boiler Works (North)](#4-sector-1-heavy-machine-lathe-shop--boiler-works-north)
5. [Sector 2: The Coaling Stage & Elevated Trestle Ramps (South)](#5-sector-2-the-coaling-stage--elevated-trestle-ramps-south)
6. [Sector 3: The Locomotive Engine Stalls & Drop Pits (West)](#6-sector-3-the-locomotive-engine-stalls--drop-pits-west)
7. [Sector 4: Water Tower & Telegraph Signal Gantry (East)](#7-sector-4-water-tower--telegraph-signal-gantry-east)
8. [Central Sector: The Turntable Pit & Pacific 4-6-2 Leviathan (Center: X = 0, Z = 0)](#8-central-sector-the-turntable-pit--pacific-4-6-2-leviathan-center-x--0-z--0)
9. [Overhead Travelling Gantry Cranes, Trusses & Aerial Grapple Traversal](#9-overhead-travelling-gantry-cranes-trusses--aerial-grapple-traversal)
10. [Stairway Mathematics, Modular Steps & Rest Landings](#10-stairway-mathematics-modular-steps--rest-landings)
11. [Solo vs. Arena Multiplayer Variations Matrix](#11-solo-vs-arena-multiplayer-variations-matrix)
12. [Spawn Points, Sniper Perches & Item Pickups](#12-spawn-points-sniper-perches--item-pickups)
13. [Level Designer Checklist & Anti-Bug Directives](#13-level-designer-checklist--anti-bug-directives)

---

## 1. Spatial Coordinates & World Bounds

The Steam Locomotive Depot shares the exact Cartesian world grid as Doodle District, Blueprint Castle, and Zen Garden to ensure 100% engine compatibility:

- **Origin `(0, 0, 0)`**: The center vertical pivot bearing of the 34-meter circular turntable at track rail level.
- **X-Axis (East-West)**:
  - Negative X (`-X`): **West** (The Semicircular Roundhouse Engine Stalls 1-6, wheel drop pits, locomotive tenders).
  - Positive X (`+X`): **East** (The Elevated Riveted Water Tower, coal bunkering bins, telegraph signal gantry).
- **Y-Axis (Elevation / Vertical Tiers)**:
  - `y = -2.2`: Sunken circular turntable pit bed and underground grease inspection trenches.
  - `y = -1.0 to 0.0`: Heavy crushed granite ballast foundation bed.
  - `y = 0.0`: Main railway yard track ballast datum plane.
  - `y = 0.65`: Raised brick locomotive servicing platform decks (low cover curb).
  - `y = 1.4`: Locomotive driving wheel running board deck (crouch cover).
  - `y = 2.4`: Locomotive engineer cab floor and coal tender top deck.
  - `y = 4.2`: Locomotive boiler roof shell apex and smokebox brow.
  - `y = 7.2`: Tier 2 Travelling Gantry Crane Catwalks & Machine Shop Mezzanines.
  - `y = 12.0`: Coaling stage upper hopper track and telegraph signal bridge.
  - `y = 16.0`: Riveted Water Tower catwalk balcony and high sniper observation deck.
  - `y = 22.0`: Apex grapple rings on locomotive gantry cranes.
  - `y = 28.0`: Upper clerestory skylight roof containment boundary.
  - `y = 56.0`: Invisible sky containment lid (Solo mode).
  - `y = 88.0`: Geodesic cast-iron architectural compass dome apex (Arena mode).
- **Z-Axis (North-South)**:
  - Negative Z (`-Z`): **North** (The Heavy Machine Lathe Shop, Wheel Drop Pit, and Forge at `z = -38.0`).
  - Positive Z (`+Z`): **South** (The High Coaling Stage, Elevated Hopper Incline, and Marshalling Yards at `z = 38.0`).

### Boundary Envelopes
| Mode | Half-Span ($P$) | Total Dimensions | Wall Height ($PH$) | Wall Thickness ($T$) | Solo Player Start |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Solo Mode** | $55\text{ m}$ | $110 \times 110\text{ m}$ | $22\text{ m}$ | $6\text{ m}$ | `(0, 0.65, 42.0)` facing North (`-z`) |
| **Arena Mode** | $68\text{ m}$ | $136 \times 136\text{ m}$ | $32\text{ m}$ | $6\text{ m}$ | 16 Symmetrical Arena Spawns |

---

## 2. Aesthetic & Ink Material System

All geometry in The Steam Locomotive Depot is synthesized through an authentic Victorian industrial railway shader (`src/render.js`), set against warm sepia drafting linen (`#f2ebd9`) with heavy carbon soot gradients and blueprint steel linework:

- **`INK.BLACK` (ID: 2 - Carbon Soot Graphite `#1c1d21` & Cast Iron)**:
  - Pacific 4-6-2 boiler barrel, smokebox, 80-inch driving wheels, cowcatcher pilot.
  - Heavy rail tracks (dual parallel steel rails elevated $0.03\text{m}$ above roadbed ballast).
  - Anvil blocks, blacksmith forges, coal piles, and grease-stained pit walls.
  - Roundhouse cast-iron structural columns and soot-blackened smoke hoods (*jacks*).
- **`INK.BLUE` (ID: 0 - Victorian Blueprint Steel `#0047ab` & Corrugated Sheeting)**:
  - Pratt and Warren steel roof trusses supporting the terminal clerestory glass roof.
  - Heavy 15-ton travelling crane box girders and overhead catwalk railings.
  - Elevated riveted cylindrical water tank shell and structural cross-bracing.
  - Boilerplate sheet metal patch plates and locomotive tender water bunker bodies.
- **`INK.ORANGE` (ID: 3 - Rusted Copper `#b85d19`, Pitch Timber & Burnished Brass)**:
  - Creosote-soaked timber railroad cross-ties ($2.6\text{m} \times 0.25\text{m} \times 0.18\text{m}$) spaced every $0.6\text{m}$.
  - Heavy oak buffer stop beams, wooden coaling chute planks, and workbenches.
  - Locomotive polished brass bell, boiler steam dome, whistle, and steam pressure gauges.
  - Giant 30cm wooden drafting ruler bridges spanning broken catwalk gaps.
  - All interactive grapple rings and dynamic swinging crane hooks.
- **`INK.RED` (ID: 1 - Locomotive Crimson `#a62424` & Firebox Combustion)**:
  - Locomotive front and rear buffer beams, danger clearance boundary markings.
  - Active coal firebox combustion hearth glowing behind slotted iron firedoors (`L.animated`).
  - Red railway switch stand target lamps, track end red lanterns, and steam pressure limit needles.
  - Arena Geodesic Dome central steam safety valve keystone (`radius = 2.4` at `y = 90`).
- **`INK.GREEN` (ID: 4 - Weathered Copper Verdigris `#3f7a63` & Lantern Jewels)**:
  - Oxidized copper roof caps on roundhouse cupolas and clerestory louvers.
  - Railway semaphore signal lenses (Clear / Green aspect) and locomotive oil headlamp lenses.

### 2.1 Thematic Prop Taxonomy (Detailing Tiers 1-4)
- **Tier 1 (Cover Props - 3-5 meshes each)**:
  - Pyramidal stacks of 80-inch locomotive driving wheel sets (`cyl()` axle + twin spoked wheel disks). Provides $1.2\text{m}$ chest cover.
  - Heavy cast-iron rail jacks, oiler cans, grease barrels, and wooden wrench crates ($0.85\text{m}$ crouch cover).
  - Mounded coal heaps on the coaling platform with authentic angled repose slopes ($35^\circ$).
  - Heavy steel anvil blocks mounted on white oak timber logs (`box()` horn + `box()` base).
- **Tier 2 (Tactical Furniture & Walkways - 5-10 meshes each)**:
  - Raised brick passenger and servicing platforms ($Y=0.65\text{m}$) with bullnose stone curbing.
  - Heavy oak machinist workbenches with bench vises, metal lathes, and pegboards.
  - 30cm wooden drafting ruler catwalk bridges spanning the turntable pit gaps with millimeter callouts.
  - Movable wooden locomotive boiler maintenance step stands on cast-iron casters.
- **Tier 3 (Landmark Anchor Props - 10-20 meshes each)**:
  - The Elevated Riveted Water Tank Tower ($16.0\text{m}$ tall) featuring a $6.0\text{m}$ diameter cylindrical iron tank, 4-leg cross-braced steel trestle, radial observation balcony, and operable canvas water delivery spout.
  - The High Coaling Stage Gantry ($12.0\text{m}$ high) with inclined timber trestle approach ramps, 4 gravity-feed steel hopper chutes, and chain hoist tackle.
  - The Twin Telegraph Signal Bridge spanning 3 tracks with dual operable semaphore arms and iron access ladders.
- **Tier 4 (Hero Centerpiece - 35-65 meshes)**:
  - The Monumental 24-Meter Pacific 4-6-2 Steam Locomotive ("The Iron Leviathan") resting on the turntable bridge:
    - **Boiler & Running Gear**: Swept cylindrical boiler loft (`splineTube`, length $14.0\text{m}$, diameter $2.2\text{m}$), forward conical smokebox door with locking dog handles, working front cowcatcher pilot, 2 leading pilot wheels, 6 colossal 80-inch spoked driving wheels with side connecting rods, and 2 trailing truck wheels.
    - **Walkable Cab Interior**: Fully modeled $3.5\text{m} \times 3.0\text{m} \times 2.4\text{m}$ engineer's cab interior at $Y=2.4\text{m}$, featuring dual wooden crew seats, throttle lever, reverser gear quadrant, sight glass water tubes, brass boiler pressure gauges, and open firebox door with dynamic interior fire glow.
    - **Coal Tender**: 12-wheel bogie tender loaded with faceted black coal heaps, water filling hatch, and rear ladder.

---

## 3. Perimeter Enclosure & Roundhouse Brickwork

### 3.1 Ground Slab & Track Ballast System
- **Monolithic Foundation**: Continuous concrete foundation slab `box(0, -1.0, 0, 2*P + T, 1.0, 2*P + T)` in `INK.BLUE`.
- **Crushed Granite Ballast Overlay**: Heavy charcoal stippled surface at `y = 0.0` overlaid with 8 radial track paths radiating from the central turntable toward the engine stalls.
- **Victorian Industrial Brick Walls**:
  - Exterior perimeter walls of height $22.0\text{ m}$ (Solo) / $32.0\text{ m}$ (Arena), thickness $6.0\text{ m}$ in red-brown English bond brickwork in `INK.BLACK` with decorative ashlar stone plinths and corbelled cornices in `INK.BLUE`.
  - North Wall: `box(0, 0, -P, 2*P + T, PH, T)` in `INK.BLACK`.
  - South Wall: `box(0, 0, P, 2*P + T, PH, T)` in `INK.BLACK`.
  - West Wall: `box(-P, 0, 0, T, PH, 2*P + T)` in `INK.BLACK`.
  - East Wall: `box(P, 0, 0, T, PH, 2*P + T)` in `INK.BLACK`.

### 3.2 Anti-Camp Sky Containment (Solo Mode)
- **Invisible Vertical Boundary Blockers**: 4 perimeter colliders rising from `y = 22.0` to `y = 58.0`, tagged `{ noNav: true, noGrapple: true }`.
- **Sky Ceiling Lid**: `collider(0, 56.0, 0, 2*P + 40, 8.0, 2*P + 40, { noNav: true, noGrapple: true })`.
- **Wrought-Iron Arch Ribs**:
  - Center: `(0, -20.0, 0)`, Radius: $R = 98.0\text{ m}$.
  - 8 arched Victorian railway roof trusses in `INK.BLUE` forming a monumental train hall vault.
  - 4 horizontal purlin tie-rods at heights `y = 30.0, 44.0, 56.0, 70.0`.

### 3.3 Perimeter Ledges & Crane Runway Balconies
8 elevated sniper and grapple platforms mounted to the terminal perimeter walls:
1. `[-36.0, 7.2, -51.2, 8.0, 0.4, 2.4]`: Northwest Machine Shop Crane Balcony.
2. `[36.0, 7.2, -51.2, 8.0, 0.4, 2.4]`: Northeast Boiler Parts Storage Loft.
3. `[-51.2, 7.2, -18.0, 2.4, 0.4, 8.0]`: West Roundhouse Stall 1 Clerestory Ledge.
4. `[-51.2, 7.2, 18.0, 2.4, 0.4, 8.0]`: West Roundhouse Stall 6 Inspection Catwalk.
5. `[51.2, 7.2, -18.0, 2.4, 0.4, 8.0]`: East Coal Bunker High Rampart.
6. `[51.2, 7.2, 18.0, 2.4, 0.4, 8.0]`: East Water Service Platform.
7. `[-24.0, 7.2, 51.2, 8.0, 0.4, 2.4]`: Southwest Marshalling Yard Gantry.
8. `[24.0, 7.2, 51.2, 8.0, 0.4, 2.4]`: Southeast Yardmaster Office Deck.

### 3.4 Enemy Wave Spawn Portals
10 themed industrial railway spawn portals for Solo survival waves:
- 2 Grease Inspection Sub-Floor Tunnels: `(-38.0, -2.2, -12.0)` and `(-38.0, -2.2, 12.0)`.
- 2 Forge Flue Exhaust Openings: `(0, 0, -51.2)` and `(-18.0, 0, -51.2)`.
- 2 Coaling Stage Hopper Chutes: `(14.0, 0, 51.2)` and `(-14.0, 0, 51.2)`.
- 2 Roundhouse Maintenance Brick Portals: `(-51.2, 0, -24.0)` and `(-51.2, 0, 24.0)`.
- 2 Water Tower Base Valve Vaults: `(38.0, 0, 16.0)` and `(38.0, 0, 28.0)`.

---

## 4. Sector 1: Heavy Machine Lathe Shop & Boiler Works (North)

A dense industrial engineering workshop situated between `x = -24.0 to 24.0, z = -48.0 to -24.0`:

### 4.1 The Industrial Wheel Lathes & Heavy Machine Beds
- **Twin 10-Meter Wheel Lathes (`z = -36.0`)**:
  - Two massive cast-iron lathe beds placed at `(-10.0, 0, -36.0)` and `(10.0, 0, -36.0)`.
  - Dimensions: Length $8.5\text{ m}$, Width $2.2\text{ m}$, Height $1.35\text{ m}$ (solid chest cover) in `INK.BLACK`.
  - Modeled with stepped headstocks, lead-screws, faceplates gripping locomotive wheel assemblies, and tool carriages.
  - Flanked by metal shaving troughs filled with coiled steel turnings (`noCollide: true`).

### 4.2 The Steam Hammer Forge & Crucible Hearth
- **Heavy Counter-Blow Steam Hammer (`(0, 0, -42.0)`)**:
  - Monumental $6.5\text{m}$ tall cast-iron A-frame frame in `INK.BLACK` housing a vertical steam cylinder and drop ram.
  - Solid anvil die at $Y=1.0\text{m}$ resting on white oak foundation timbers.
  - Flanking coal hearth with forced-air blast tuyeres and glowing orange coke embers (`INK.RED`).

### 4.3 Overhead Mezzanine Tool Crib (`y = 7.2`)
- An elevated steel deck spanning the entire north wall from `x = -24.0` to `x = 24.0`.
- Racks of oversized locomotive wrenches, reamers, tap-and-die sets, and spare brass fittings.
- Overlooks the turntable pit and boiler works, providing commanding sniper coverage down the central tracks.

---

## 5. Sector 2: The Coaling Stage & Elevated Trestle Ramps (South)

A colossal fuel handling facility situated between `x = -24.0 to 24.0, z = 24.0 to 48.0`:

### 5.1 The High Timber Coaling Stage (`z = 38.0`)
- **Elevated Coaling Platform ($Y = 6.0\text{m}$ to $12.0\text{m}$)**:
  - Massive heavy-timber trestle structure: Length $32.0\text{ m}$, Width $8.0\text{ m}$ constructed from $0.4\text{m} \times 0.4\text{m}$ creosote timbers in `INK.ORANGE`.
  - **4 Steel Gravity Hopper Chutes**:
    - Projecting downward over the coal tracks at a $45^\circ$ angle.
    - Each chute ($2.8\text{m} \times 1.8\text{m}$) features counterbalanced lever gates and hanging chain pulls.
    - Walkable chutes serve as high-speed slide ramps allowing players to drop silently from the high trestle directly onto the coal tender!
- **Mounded Coal Bunkers**:
  - Divided stone bins filled with hundreds of tons of jagged anthracite coal in `INK.BLACK`, creating dynamic $1.4\text{m}$ undulating chest-cover berms.

### 5.2 The Marshalling Yard Ground Tracks
- Two parallel servicing tracks flanked by raised brick boarding curbs ($Y=0.65\text{m}$).
- Cluttered with steel coal carts on 2-foot narrow gauge tracks, hand winches, and coal shovels.

---

## 6. Sector 3: The Locomotive Engine Stalls & Drop Pits (West)

A grand semicircular engine shed situated between `x = -48.0 to -20.0, z = -24.0 to 24.0`:

### 6.1 The 6-Bay Roundhouse Radial Stalls
- **Radial Bay Architecture**:
  - 6 engine stalls (Stalls 1 through 6) fanning out from the turntable pivot at $15^\circ$ angular increments.
  - Semicircular exterior curved brick wall ($R = 46.0\text{ m}$) punctuated by tall arched multipane industrial windows.
  - Roof supported by 12 slender cast-iron fluted columns ($0.5\text{m}$ diameter, $7.2\text{m}$ tall) with Corinthian capitals in `INK.BLACK`.
- **Smoke Jacks (Exhaust Hoods)**:
  - Suspended inverted wooden pyramidal smoke hoods hanging over each track at $Y=5.5\text{m}$ leading to exterior brick chimneys.

### 6.2 Underground Grease Inspection Trenches (`y = -2.2`)
- Continuous $1.4\text{ m}$ wide, $2.2\text{ m}$ deep masonry pits running down the center of each stall track.
- Equipped with cast-iron rung wall ladders, recessed oil lantern niches, and duckboard floor grating.
- Allows players to travel completely concealed beneath parked locomotives for stealth flanking routes!

---

## 7. Sector 4: Water Tower & Telegraph Signal Gantry (East)

A critical railway utility and communication center situated between `x = 20.0 to 48.0, z = -24.0 to 24.0`:

### 7.1 The Elevated Riveted Water Tank Tower (`x = 34.0, z = 0`)
- **Tower Structural Geometry (Tier 3 Landmark)**:
  - 4-column battered steel lattice trestle rising from $Y=0.0\text{m}$ to $Y=10.0\text{m}$ with tension diagonal tie-rods.
  - **The Water Tank**: A cylindrical riveted iron vessel ($6.5\text{m}$ diameter, $4.5\text{m}$ height) with dome roof, extending from $Y=10.0\text{m}$ to $Y=14.5\text{m}$ in `INK.BLUE`.
  - **Radial Observation Balcony ($Y=10.0\text{m}$)**: A $1.2\text{m}$ wide cantilevered steel walkway encircling the tank with safety pipe railings, providing a 360-degree sniper vantage point.
  - **The Water Delivery Crane**: Swiveling counterweighted steel delivery pipe with a flexible canvas spout reaching over the east refueling track.

### 7.2 The Multi-Track Telegraph Signal Gantry (`x = 30.0, z = -18.0`)
- An overhead Pratt steel truss bridge spanning $16.0\text{ m}$ across 3 rail tracks at $Y=6.5\text{m}$.
- Features 4 operable mechanical semaphore signal arms (Upper Quadrant, `INK.RED` and `INK.GREEN`) operated by iron pull-rods.
- Accessible via a vertical steel rung safety ladder on the east pier.

---

## 8. Central Sector: The Turntable Pit & Pacific 4-6-2 Leviathan (Center: X = 0, Z = 0)

The colossal heartbeat and dynamic focal point of the entire rail terminal:

### 8.1 The 34-Meter Circular Turntable Pit
- **Sunken Pit Geometry**:
  - Diameter: $34.0\text{ m}$ ($R = 17.0\text{ m}$), Depth: $2.2\text{ m}$ (`y = -2.2\text{ m}` bed).
  - Enclosed by a circular dressed ashlar stone retaining wall with coping stones in `INK.BLACK`.
  - Center Pivot Bearing: A massive cast-iron truncated conical pedestal ($3.2\text{m}$ base diameter) with hardened steel spherical roller bearings.
  - Circular Ring Rail: Continuous circular steel rail ($R = 15.5\text{ m}$) bolted to stone foundation pads in the pit bed.

### 8.2 The Rotating Steel Truss Turntable Bridge
- **Through-Truss Bridge Structure**:
  - Length: $32.0\text{ m}$, Width: $4.5\text{ m}$ carrying a standard-gauge track down its center.
  - Twin Warren steel trusses rising $3.5\text{ m}$ on both sides of the track deck, providing full chest-high cover along the bridge perimeter.
  - End Support Trucks: 4 steel wheels riding along the circular pit ring rail.
  - **Operator's Cabin**: A small glazed wood-paneled cab at the east truss center containing mechanical clutch levers and hand brakes.

### 8.3 The Hero Locomotive: The Pacific 4-6-2 "Iron Leviathan"
- **Boiler & Running Gear Dimensions**:
  - Length: $24.0\text{ m}$ (engine + tender), Width: $3.2\text{ m}$, Height: $4.4\text{ m}$.
  - Heavy cast steel frames carrying three pairs of $2.03\text{m}$ (80-inch) spoked driving wheels with counterweights, eccentric cranks, and polished steel Walschaerts valve gear.
  - Swept cylindrical boiler barrel (`splineTube`) detailed with rivet bands, copper sand dome, and brass steam safety valves.
- **Walkable Engineer's Cab Interior (`y = 2.4`)**:
  - Stepping inside reveals a complete, authentic Victorian steam locomotive cockpit:
    - Master steam throttle lever and screw reverser wheel in `INK.ORANGE`.
    - Twin water level sight glasses with brass guard rods.
    - Open cast-iron firebox doors revealing incandescent burning coke coal in `INK.RED` (`L.animated`).
- **Kinetic Steam Blow-Off Exhaust (`L.animated`)**:
  - Twin steam relief valves pop rhythmically, ejecting billowing plumes of white-hot steam particles that obscure line-of-sight across the central bridge!

---

## 9. Overhead Travelling Gantry Cranes, Trusses & Aerial Grapple Traversal

### 9.1 Dual 15-Ton Overhead Travelling Gantry Cranes
- Two heavy box-girder crane bridges spanning east-west across the terminal:
  - Crane 1 (North): Positioned at $Z = -18.0\text{m}$, Elevation $Y = 7.2\text{m}$.
  - Crane 2 (South): Positioned at $Z = 18.0\text{m}$, Elevation $Y = 7.2\text{m}$.
  - Bridge Span: $44.0\text{ m}$ in heavy riveted steel lattice (`INK.BLUE`).
  - Full-length $1.8\text{ m}$ wide steel grating walkways with $1.1\text{ m}$ safety railings.
  - Motorized Trolley & Hoist Blocks: Traversing hoist trolley with heavy 4-part steel wire ropes and forged iron grapple hooks hanging at $Y=4.2\text{m}$.

### 9.2 Giant 30cm Drafting Ruler Bridges
- Two oversized wooden drafting rulers ($0.45\text{m}$ wide, $12.0\text{m}$ long) spanning high gaps between the crane catwalks and the coaling stage with etched imperial millimeter calibrations.

### 9.3 Aerial Grapple Point Network
- 16 tactical grapple rings deployed throughout the upper airspace:
  - 4x Crane hoist block hooks (`ring(x, 4.5, z, 'y')`).
  - 4x Locomotive smoke jack support brackets at `y = 6.8\text{ m}`.
  - 2x Locomotive boiler steam dome collar at `y = 4.6\text{ m}`.
  - 2x Water Tower apex dome rings at `y = 15.0\text{ m}`.
  - 4x Clerestory roof truss tie-plate rings at `y = 10.5\text{ m}`.
- **Grapple Radial Clearance**: All grapple anchors maintain a clean $2.0\text{ m}$ spherical clearance free of geometry, strictly exceeding the $1.5\text{ m}$ safety threshold.

---

## 10. Stairway Mathematics, Modular Steps & Rest Landings

All vertical transitions strictly adhere to the universal architectural standard:

$$\text{Step Rise } = 0.25\text{m}, \quad \text{Step Run } = 0.48\text{m}, \quad \text{Clearance Corridor } \ge 2.2\text{m}$$

### Stairway Manifest
1. **Turntable Pit Perimeter Access Stairs**:
   - 4 symmetrical stone stairways (9 steps each) connecting the ground floor (`y = 0.0`) to the pit floor (`y = -2.2`):
   - Step Rise: $2.2\text{ m} / 9 = 0.244\text{ m}$, Step Run: $0.48\text{ m}$.
   - Heavy granite treads with chiseled non-slip bullnose edges and wrought-iron safety rails.
2. **Coaling Stage Trestle Switchback Stairway (South)**:
   - Connecting Ground Floor (`y = 0.0`) to Upper Coaling Deck (`y = 7.2`):
   - Flight 1: 15 steps ($3.6\text{ m}$ rise, $7.2\text{ m}$ run).
   - Intermediate Rest Landing: $2.4\text{ m} \times 2.4\text{ m}$ platform at `y = 3.6`.
   - Flight 2: 15 steps reversing $180^\circ$ ($3.6\text{ m}$ rise, $7.2\text{ m}$ run).
   - Creosote-soaked timber stringers with cast-iron tread plates.
3. **Machine Shop Mezzanine Steel Stairway (North)**:
   - Welded industrial channel-iron stringers with perforated diamond-plate steps rising to `y = 7.2` with intermediate rest landing at `y = 3.6`.

---

## 11. Solo vs. Arena Multiplayer Variations Matrix

| Feature | Solo Wave Survival (`!arena`) | Peer-to-Peer Arena Match (`arena`) |
| :--- | :--- | :--- |
| **Map Radius ($P$)** | $55\text{ m}$ ($110 \times 110\text{ m}$ total) | $68\text{ m}$ ($136 \times 136\text{ m}$ total) |
| **Boundary Height** | $22\text{ m}$ with invisible vertical blocker to $y = 58$ | $32\text{ m}$ perimeter Victorian brick walls |
| **Sky Enclosure** | Clerestory roof lid at $y = 56$ + 8 Blue Truss Arches | $120\text{ m}$ Geodesic Cast-Iron Dome with Red Keystone ($y=90$) |
| **Turntable State** | Aligned north-south with locked brakes | Dynamic motorized rotation ($90^\circ$ swing every 20 seconds) |
| **Locomotives** | 1 Pacific Locomotive + 1 Tender | 1 Pacific + 2 Shunting Switchers + 4 Freight Boxcars |
| **Suspended Platforms**| 2 Crane Catwalks | **5 Suspended Iron Maintenance Cages** hanging from dome |
| **Spawn System** | Fixed single player start at `(0, 0.65, 42.0)` | 16 distributed symmetrical arena spawns across all vertical tiers |

### 11.1 Arena Geodesic Dome & Suspended Maintenance Platforms
In multiplayer Arena matches, the terminal roof opens into a monumental cast-iron geodesic dome ($R = 120, C = -30$):
- 8 longitudinal arched iron ribs in `INK.BLUE` rotated at $22.5^\circ$ increments.
- 5 latitude rings at $y = 38, 54, 68, 80, 88$.
- Apex Keystone: Radius $2.4\text{ m}$ glowing in combustion crimson at `(0, 90, 0)` in `INK.RED`.
- **5 Suspended Iron Maintenance Platforms**:
  1. Turntable Center Overlook: `(0, 18.0, 0)`, size $7.5 \times 7.5\text{ m}$ styled as a suspended wheel drop hoist.
  2. Northwest Machine Shop Overlook: `(-22.0, 16.0, -24.0)`, size $5.5 \times 5.5\text{ m}$.
  3. Southeast Coaling Overlook: `(22.0, 16.0, 24.0)`, size $5.5 \times 5.5\text{ m}$.
  4. Northeast Water Tower Overlook: `(24.0, 16.0, -24.0)`, size $5.0 \times 5.0\text{ m}$.
  5. Southwest Roundhouse Overlook: `(-22.0, 16.0, 24.0)`, size $5.0 \times 5.0\text{ m}$.
  - Each suspended cage hangs from the dome via heavy forged iron chains in `INK.BLACK` with an inverted orange grapple ring at `y - 1.3`.

---

## 12. Spawn Points, Sniper Perches & Item Pickups

### 12.1 Sniper Vantage Perches (`L.snipers`)
Tactical high-elevation positions designated for precision sharpshooters:
1. `(34.0, 10.0, 0)`: Water Tank Tower Radial Balcony (360-degree terminal domination).
2. `(0, 7.2, -18.0)`: North Travelling Crane Cab Catwalk.
3. `(0, 7.2, 18.0)`: South Travelling Crane Cab Catwalk.
4. `(30.0, 6.5, -18.0)`: Telegraph Signal Bridge Catwalk.
5. `(0, 12.0, 38.0)`: High Coaling Stage Upper Hopper Deck.
6. `(-38.0, 7.2, 0)`: Roundhouse Stall 3 Clerestory Roof Ledge.
7. `(0, 4.4, -2.0)`: Locomotive Cab Roof Spoilers.
8. `(0, 7.2, -44.0)`: Machine Shop Upper Tool Mezzanine.

### 12.2 Tactical Pickups & Weapon Crates (`L.pickups`)
1. Locomotive Cab: `(0, 2.4, 0)` [On engineer's seat - Legendary High-Caliber Anti-Materiel Rifle].
2. Turntable Pit: `(0, -2.2, 0)` [Center pivot bearing maintenance niche - Heavy Armor Vest].
3. Machine Shop: `(-10.0, 1.35, -36.0)` [Wheel lathe tool bed - Medical Stim-Pack].
4. Coaling Stage: `(0, 6.0, 38.0)` [Coal hopper control deck - High-Capacity Drum Magazine].
5. Water Tower: `(34.0, 0, 0)` [Base water valve vault - Grenade Satchel].
6. Roundhouse Stall 2: `(-28.0, 0, -12.0)` [Inspection pit tool bench - Armor Shard].
7. Signal Gantry: `(30.0, 6.5, -18.0)` [Signal lever box - Precision Optics Scope].
8. Forge Hearth: `(0, 0.8, -42.0)` [Blacksmith anvil base - Thermal Explosive Satchel].

### 12.3 Symmetric Multiplayer Team Spawns (`L.teamSpawns`)
- **Red Team Spawns (North - Machine Shop & Forge Sector)**:
  - `(0, 7.2, -40.0)` (Machine Shop Upper Mezzanine)
  - `(-16.0, 0.65, -36.0)` (West Lathe Floor Bay)
  - `(16.0, 0.65, -36.0)` (East Crucible Floor Bay)
  - `(-8.0, 0, -22.0)` (North Turntable Approach Track)
  - `(8.0, 0, -22.0)` (North Servicing Track 2)
- **Blue Team Spawns (South - Coaling Stage & Marshalling Sector)**:
  - `(0, 6.0, 42.0)` (Coaling Stage Upper Deck)
  - `(-14.0, 0.65, 34.0)` (West Coal Marshalling Platform)
  - `(14.0, 0.65, 34.0)` (East Coal Marshalling Platform)
  - `(-6.0, 0, 20.0)` (South Turntable Approach Track)
  - `(6.0, 0, 20.0)` (South Servicing Track 1)

---

## 13. Level Designer Checklist & Anti-Bug Directives

1. **Anti-Pinch Corridor & Chokepoint Verification**:
   - All walkways between locomotive boilers, roundhouse walls, and pit curbs are verified $\ge 2.2\text{ m}$ wide, strictly exceeding the $1.8\text{ m}$ anti-pinch threshold.
   - The gap between parked locomotives in adjacent stalls is exactly $2.4\text{ m}$, preventing players from getting trapped against driving wheels.
2. **Turntable Hazard & Pit Fall Recovery**:
   - The sunken pit at `y = -2.2\text{m}` must never soft-lock fallen players: 4 perimeter stone stairs and 2 central pit ladders provide immediate recovery back to rail level.
3. **Tactical Cover Height Hierarchy & Zero Empty Dead-Zones**:
   - Low Crouch Cover ($0.85\text{ m} - 0.95\text{ m}$): Brick platform curbs, tool carts, grease barrels, rail jacks.
   - Chest Cover ($1.15\text{ m} - 1.4\text{ m}$): Wheel lathe beds, coal bunker timber walls, wheel sets, anvil blocks.
   - Full Occlusion ($2.2\text{ m} - 4.4\text{ m}$): Locomotive boiler shells, tender bodies, brick columns, coaling chutes.
   - Every $15\text{ m} \times 15\text{ m}$ quadrant incorporates intermediate staging clutter (rail spikes, tool racks, oil drums) ensuring zero barren wastelands.
4. **0.3m Micro-Detail & Collision Tagging Discipline**:
   - Micro-details (rail spikes, fishplates, rivet heads, whistle levers, gauge needles, valve handles) must be explicitly flagged with `{ noCollide: true }`.
   - Apply `{ noNav: true }` to thin boiler catwalks, crane hoist ropes, semaphore arms, and water delivery spouts.
   - Apply `{ noGrapple: true }` to the outer perimeter brick boundary walls and the sky containment ceiling.
5. **Dynamic Physics & Memory Allocations (`L.animated`)**:
   - All kinetic animations (turntable rotation, firebox embers, steam plumes, moving crane trolleys) must reuse pre-allocated vertex arrays and matrices.
   - Zero runtime heap memory allocations in animation loops to maintain a rock-solid 60 FPS.
6. **Universal Detailing Compliance**:
   - Audited against the Universal Detailing Standard to guarantee full Skeleton-Skin-Trim layering, complete ballpoint ink material mapping, and a concept detailing score of 12/12.
