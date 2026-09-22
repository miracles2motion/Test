# The High-School Chemistry Lab: Comprehensive Map Architecture & Specification

A master structural, geometrical, and aesthetic blueprint for **The High-School Chemistry Lab** (Map Key: `chemistry_lab` / `lab`), an intensely detailed science classroom combat arena set within a monumental high-school laboratory drawn with fine technical blue biro ink, black technical pen notes, vibrant chemical wash accents, and periodic table crosshatching on 5mm graph grid paper (`#f6f8fa`).

Featuring sunken epoxy wash sinks ($Y=-0.6\text{m}$), colossal chemical-resistant lab benches with reagent shelves, a monumental Tier 4 Bunsen Burner ($Y=14.0\text{m}$) with a kinetic cobalt-blue flame cone, helical glass condenser tubing splines with rising air bubbles, safety fume hood sniper catwalks ($Y=5.5\text{m}$), an 18-meter slate periodic table blackboard, and ceiling reagent pipe runs.

Designed using the exact mathematical standards, coordinate bounds, vertical step ratios, and traversal loops of **The Blueprint Castle** (`castle`) and **The Zen Garden** (`zen`), this specification establishes a flawless, uncompromised reference for implementing the chemistry lab map in `src/level.js` without geometric inconsistencies, blind traps, or collision bugs.

---

## Table of Contents
1. [Spatial Coordinates & World Bounds](#1-spatial-coordinates--world-bounds)
2. [Aesthetic & Ink Material System](#2-aesthetic--ink-material-system)
3. [Perimeter Enclosure & Fume Hoods](#3-perimeter-enclosure--fume-hoods)
4. [Sector 1: Chemical Storage Vault & Acid Cabinets (North)](#4-sector-1-chemical-storage-vault--acid-cabinets-north)
5. [Sector 2: Emergency Shower & Eyewash Station (South)](#5-sector-2-emergency-shower--eyewash-station-south)
6. [Sector 3: Analytical Balance & Centrifuge Bench (West)](#6-sector-3-analytical-balance--centrifuge-bench-west)
7. [Sector 4: Periodic Table Chalkboard & Lecture Amphitheater (East)](#7-sector-4-periodic-table-chalkboard--lecture-amphitheater-east)
8. [Central Sector: Grand Demonstration Island & Colossal Bunsen Burner (Center: X = 0, Z = 0)](#8-central-sector-grand-demonstration-island--colossal-bunsen-burner-center-x--0-z--0)
9. [Overhead Retort Stands, Helical Condenser Splines & Aerial Grapple Traversal](#9-overhead-retort-stands-helical-condenser-splines--aerial-grapple-traversal)
10. [Stairway Mathematics, Modular Steps & Rest Landings](#10-stairway-mathematics-modular-steps--rest-landings)
11. [Solo vs. Arena Multiplayer Variations Matrix](#11-solo-vs-arena-multiplayer-variations-matrix)
12. [Spawn Points, Sniper Perches & Item Pickups](#12-spawn-points-sniper-perches--item-pickups)
13. [Level Designer Checklist & Anti-Bug Directives](#13-level-designer-checklist--anti-bug-directives)

---

## 1. Spatial Coordinates & World Bounds

The High-School Chemistry Lab shares the exact Cartesian world grid as Doodle District, Blueprint Castle, and Zen Garden to ensure 100% engine compatibility:

- **Origin `(0, 0, 0)`**: The center brass nozzle of the Great Bunsen Burner on the teacher's elevated demonstration island at classroom floor level.
- **X-Axis (East-West)**:
  - Negative X (`-X`): **West** (The Analytical Balances, Centrifuge Benches, Spectrophotometers, Glassware Drying Racks).
  - Positive X (`+X`): **East** (The Tiered Lecture Amphitheater, Periodic Table Slate Blackboard, Student Desks).
- **Y-Axis (Elevation / Vertical Tiers)**:
  - `y = -0.6`: Sunken acid-resistant epoxy sink basins and floor drainage gutters.
  - `y = -1.0 to 0.0`: Monolithic concrete sub-floor foundation slab beneath the vinyl laboratory tiles.
  - `y = 0.0`: Main classroom floor datum plane (5mm blue grid pattern).
  - `y = 1.05`: Student black epoxy lab bench deck surface (standard chest cover plane).
  - `y = 1.2, 2.4, 3.6`: Stepped lecture amphitheater seating tiers.
  - `y = 2.1`: Secondary reagent bottle shelf runner.
  - `y = 3.6`: Demonstration desk splash screen brow and distillation scaffold.
  - `y = 5.5`: Tier 2 Industrial Fume Hood Catwalks & Overhead Vent Mezzanine.
  - `y = 8.5`: Bunsen Burner barrel collar and primary grapple ring.
  - `y = 10.5`: Distillation column condenser bridge and high reagent conduit.
  - `y = 14.0`: Apex of the Colossal Bunsen Burner flame grapple anchor ring.
  - `y = 22.0`: Ceiling acoustic tile grid and fluorescent light fixtures.
  - `y = 56.0`: Invisible sky containment lid (Solo mode).
  - `y = 88.0`: Geodesic chemical valence bond dome apex (Arena mode).
- **Z-Axis (North-South)**:
  - Negative Z (`-Z`): **North** (The Hazardous Chemical Storage Vault, Lockable Yellow Acid Cabinets at `z = -38.0`).
  - Positive Z (`+Z`): **South** (The Emergency Deluge Shower, Eyewash Washdown Basin at `z = 38.0`).

### Boundary Envelopes
| Mode | Half-Span ($P$) | Total Dimensions | Wall Height ($PH$) | Wall Thickness ($T$) | Solo Player Start |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Solo Mode** | $50\text{ m}$ | $100 \times 100\text{ m}$ | $20\text{ m}$ | $5\text{ m}$ | `(0, 0.0, 38.0)` facing North (`-z`) |
| **Arena Mode** | $64\text{ m}$ | $128 \times 128\text{ m}$ | $28\text{ m}$ | $5\text{ m}$ | 16 Symmetrical Arena Spawns |

---

## 2. Aesthetic & Ink Material System

All geometry in The High-School Chemistry Lab is synthesized through a technical scientific drafting shader (`src/render.js`), set against technical 5mm graph grid paper (`#f6f8fa`) with vibrant chemical stains and chalk annotations:

- **`INK.BLUE` (ID: 0 - Technical Blue Biro `#1b3b6f` & Borosilicate Glass)**:
  - Borosilicate glassware contours (beakers, Erlenmeyer flasks, Liebig condensers, graduated cylinders).
  - Steel retort stand rods, epoxy lab bench tubular steel frames, reagent shelf brackets.
  - Water delivery swan-neck faucets, coolant jackets, and inner cobalt flame reduction cone.
- **`INK.BLACK` (ID: 2 - Technical Carbon Pen `#1a1a1d` & Black Epoxy)**:
  - Chemical-resistant black epoxy resin bench tops (`1.05m` height).
  - Chemical molecular formulas ($H_2SO_4$, $KMnO_4$, $CH_3COOH$) and chalk notes.
  - Volumetric graduation lines on glass cylinders, rubber stopper bungs, and neoprene hoses.
  - Gas manifold shut-off ball valves and Bunsen burner heavy cast-iron base.
- **`INK.ORANGE` (ID: 3 - Burnished Brass `#c47c1b` & Reagent Hazards)**:
  - Gas turret shut-off taps, brass Bunsen air regulator collars, copper distillation coils.
  - Hardwood test tube drying racks and test tube wooden clamps.
  - Hydrochloric acid hazard warning diamonds and potassium dichromate solution washes.
  - Giant 30cm wooden drafting ruler bridges spanning broken catwalk gaps.
  - All interactive grapple rings and dynamic swinging anchors.
- **`INK.RED` (ID: 1 - Emergency Crimson `#ba181b` & Oxidation Flame)**:
  - Emergency safety shower pull triangles, eyewash push paddles, master gas shutoff mushrooms.
  - Bunsen outer oxidation flame envelope, explosive hazard diamond placards, and Bunsen pilot lights.
  - Arena Geodesic Dome central benzene ring keystone (`radius = 2.4` at `y = 90`).
- **`INK.GREEN` (ID: 4 - Nickel Sulfate Emerald `#2d6a4f` & Safety Badges)**:
  - Glowing copper sulfate and nickel solutions inside volumetric flasks.
  - Emergency exit signboards, first-aid kit crosses, and chemical neutralization floor trays.

### 2.1 Thematic Prop Taxonomy (Detailing Tiers 1-4)
- **Tier 1 (Cover Props - 3-5 meshes each)**:
  - Chemical carboys wrapped in protective wicker baskets (`cyl()` glass vessel + `box()` outer crate). Provides $1.1\text{m}$ chest cover.
  - Heavy ceramic mortar and pestle sets ($0.85\text{m}$ crouch cover) resting on bench tops.
  - Hardwood test tube racks holding 12 borosilicate test tubes with colorful liquid meniscus levels.
  - Translucent plastic chemical wash bottles and glass dropper bottles with rubber squeeze bulbs.
- **Tier 2 (Tactical Furniture & Walkways - 5-10 meshes each)**:
  - Standard Student Lab Benches ($8.0\text{m} \times 2.4\text{m} \times 1.05\text{m}$) in black epoxy resin with central utility troughs, gas turrets, and duplex power outlets.
  - Steel swivel lab stools with adjustable screw stems (`cyl()` base + `cyl()` black vinyl seat).
  - 30cm wooden drafting ruler catwalk bridges spanning broken fume hood balconies.
  - Glassware pegboard drying boards mounted on wall piers with angled timber pegs.
- **Tier 3 (Landmark Anchor Props - 10-20 meshes each)**:
  - The Industrial Walk-In Fume Hood Unit ($5.0\text{m} \times 3.0\text{m} \times 4.2\text{m}$) with sliding vertical laminated safety glass sash, explosion-proof interior lighting, and exhaust blower.
  - The Analytical Balance Anti-Vibration Granite Table ($10.0\text{m} \times 3.5\text{m} \times 1.1\text{m}$) carrying dual glass draft shield balance enclosures.
  - The Stepped Lecture Amphitheater (3 tiers, $18.0\text{m}$ wide) rising to $Y=3.6\text{m}$ with oak lecture desks.
  - The Colossal 18-Meter Slate Periodic Table Blackboard covered in hand-penciled element properties.
- **Tier 4 (Hero Centerpiece - 30-55 meshes)**:
  - The Monumental Teacher's Demonstration Bunsen Burner ($Y=14.0\text{m}$):
    - **Base & Cast-Iron Flange**: Heavy circular cast-iron base plate ($4.8\text{m}$ diameter, $0.6\text{m}$ height) with knurled brass air shutter collar.
    - **Burner Barrel**: Seamless drawn brass tube ($1.8\text{m}$ diameter) extending vertically from $Y=1.35\text{m}$ to $Y=8.5\text{m}$.
    - **Dual-Nested Kinetic Flame Lofts (`L.animated`)**: Inner cobalt blue reduction cone (`INK.BLUE`, $Y=8.5\text{m}$ to $11.5\text{m}$) and roaring outer oxidation mantle (`INK.ORANGE`/`INK.RED`, $Y=8.5\text{m}$ to $14.0\text{m}$) with flickering vertex noise and upward convective thermal updrafts that propel gliding players.
    - **Apex Grapple Collar**: Brass safety collar ring at $Y=9.0\text{m}$ enabling high-velocity slingshot traversal across the entire lab arena.

---

## 3. Perimeter Enclosure & Fume Hoods

### 3.1 Ground Slab & Glazed Subway Tile Base
- **Monolithic Foundation**: Continuous concrete slab `box(0, -1.0, 0, 2*P + T, 1.0, 2*P + T)` in `INK.BLUE`.
- **Vinyl Tile Classroom Floor**: Surface overlay at `y = 0.0` printed with a 5mm graph paper grid pattern accented by acid stain discolorations and wash marks.
- **Perimeter Glazed Tile Walls**:
  - Boundary walls of height $20.0\text{ m}$ (Solo) / $28.0\text{ m}$ (Arena), thickness $5.0\text{ m}$ lined with white ceramic subway tiles ($Y=0.0\text{m}$ to $4.0\text{m}$) with charcoal mortar lines in `INK.BLACK`.
  - North Wall: `box(0, 0, -P, 2*P + T, PH, T)` in `INK.BLUE`.
  - South Wall: `box(0, 0, P, 2*P + T, PH, T)` in `INK.BLUE`.
  - West Wall: `box(-P, 0, 0, T, PH, 2*P + T)` in `INK.BLUE`.
  - East Wall: `box(P, 0, 0, T, PH, 2*P + T)` in `INK.BLUE`.

### 3.2 Anti-Camp Sky Containment (Solo Mode)
- **Invisible Vertical Boundary Blockers**: 4 perimeter colliders rising from `y = 20.0` to `y = 58.0`, tagged `{ noNav: true, noGrapple: true }`.
- **Sky Ceiling Lid**: `collider(0, 56.0, 0, 2*P + 40, 8.0, 2*P + 40, { noNav: true, noGrapple: true })`.
- **Ceiling Pipe Manifold Ribs**:
  - Center: `(0, -20.0, 0)`, Radius: $R = 98.0\text{ m}$.
  - 8 overhead chemical distribution conduits in `INK.BLUE` running across the ceiling grid.
  - 4 latitude containment loops at heights `y = 26.0, 38.0, 50.0, 64.0`.

### 3.3 Perimeter Ledges & Fume Hood Mezzanines
8 elevated sniper and grapple platforms integrated into the perimeter walls:
1. `[-32.0, 5.5, -46.2, 8.0, 0.4, 2.4]`: Northwest Acid Storage Inspection Mezzanine.
2. `[32.0, 5.5, -46.2, 8.0, 0.4, 2.4]`: Northeast Chemical Prep Room Balcony.
3. `[-46.2, 5.5, -16.0, 2.4, 0.4, 8.0]`: West Exhaust Duct Service Walkway.
4. `[-46.2, 5.5, 16.0, 2.4, 0.4, 8.0]`: West Centrifuge Maintenance Deck.
5. `[46.2, 5.5, -16.0, 2.4, 0.4, 8.0]`: East Lecture Projection Gantry.
6. `[46.2, 5.5, 16.0, 2.4, 0.4, 8.0]`: East Chalkboard Upper Catwalk.
7. `[-22.0, 5.5, 46.2, 8.0, 0.4, 2.4]`: Southwest Safety Equipment Loft.
8. `[22.0, 5.5, 46.2, 8.0, 0.4, 2.4]`: Southeast Decontamination Observation Deck.

### 3.4 Enemy Wave Spawn Portals
10 themed science laboratory spawn portals for Solo survival waves:
- 2 Acid Fume Exhaust Damper Vents: `(-42.0, 5.5, 0)` and `(42.0, 5.5, 0)`.
- 2 Chemical Supply Dumbwaiter Hatches: `(-16.0, 0, -46.2)` and `(16.0, 0, -46.2)`.
- 2 Decontamination Shower Drainage Grates: `(-8.0, -0.6, 42.0)` and `(8.0, -0.6, 42.0)`.
- 2 Hazardous Waste Disposal Air-Locks: `(-46.2, 0, -20.0)` and `(-46.2, 0, 20.0)`.
- 2 Demonstration Island Sub-Floor Utility Access: `(-4.0, 0, 0)` and `(4.0, 0, 0)`.

---

## 4. Sector 1: Chemical Storage Vault & Acid Cabinets (North)

A secure hazardous storage compound situated between `x = -22.0 to 22.0, z = -46.0 to -22.0`:

### 4.1 Reinforced Safety Acid & Flammable Cabinets
- **Row of 6 Heavy Steel Storage Cabinets (`z = -38.0`)**:
  - Dimensions: Width $2.4\text{ m}$, Depth $1.2\text{ m}$, Height $2.1\text{ m}$ (solid full-body cover) in safety yellow crosshatching (`INK.ORANGE`).
  - Modeled with flush paddle latches, continuous piano hinges, and prominent red warning decals (`FLAMMABLE - KEEP FIRE AWAY` in `INK.RED`).
  - **Pressurized Nitrogen Hazard Cylinders**:
    - High-pressure cryogenic cylinders ($0.4\text{m}$ diameter, $1.8\text{m}$ tall) strapped to cabinet flanks. Piercing a cylinder releases a directional freezing plume that chills and decelerates player locomotion!

### 4.2 Reagent Stockroom Shelving Bays
- Industrial steel wire shelving racks stocked with amber glass Winchester quart bottles, ceramic acid jugs, and plastic powder containers.
- Provides $1.2\text{m}$ chest-high cover with peekholes between shelf tiers.

---

## 5. Sector 2: Emergency Shower & Eyewash Station (South)

A high-visibility safety washdown facility situated between `x = -22.0 to 22.0, z = 22.0 to 46.0`:

### 5.1 The Monumental Emergency Deluge Shower (`z = 38.0`)
- **Overhead Deluge Showerhead (Tier 3 Landmark)**:
  - Stainless steel 10-inch shower head suspended at $Y=4.5\text{m}$ from a vertical yellow supply pipe.
  - Heavy stainless steel triangular pull rod hanging down to $Y=2.1\text{m}$.
  - **Sunken Washdown Basin ($Y = -0.6\text{m}$)**:
    - A $6.0\text{m} \times 6.0\text{m}$ recessed basin surrounded by $0.35\text{m}$ high containment berms.
    - Floor fitted with stainless steel drainage grates with kinetic falling water droplet splash rings (`L.animated`).

### 5.2 The Pedestal Eyewash Washbasin
- Dual-nozzle polished chrome eyewash fountain ($1.1\text{m}$ height) with foot-pedal actuator and push flag in `INK.GREEN`.
- Flanked by stainless steel towel dispensers and chemical spill neutralization sand buckets ($0.85\text{m}$ crouch cover).

---

## 6. Sector 3: Analytical Balance & Centrifuge Bench (West)

A precision scientific instrumentation sector situated between `x = -46.0 to -18.0, z = -22.0 to 22.0`:

### 6.1 The Anti-Vibration Granite Balance Table
- **Monumental Granite Island (`x = -32.0`)**:
  - Dimensions: Length $12.0\text{ m}$, Width $3.6\text{ m}$, Height $1.1\text{ m}$ (solid chest cover) cut from solid polished black granite.
  - Carries 4 precision analytical balances housed in glass draft shield cubes ($0.6\text{m} \times 0.6\text{m} \times 0.7\text{m}$) with sliding side doors.
  - Balances display fluctuating digital readout figures in neon green ink (`0.0000g`).

### 6.2 Floor Centrifuge Battery & Glassware Carts
- Two colossal high-speed refrigerated floor centrifuges with heavy armor-plated hinged lids ($1.8\text{m}$ diameter, $1.2\text{m}$ height).
- Stainless steel mobile glassware transport carts loaded with graduated cylinders and pyrex beakers ($0.9\text{m}$ crouch cover).

---

## 7. Sector 4: Periodic Table Chalkboard & Lecture Amphitheater (East)

A grand educational amphitheater situated between `x = 18.0 to 46.0, z = -22.0 to 22.0`:

### 7.1 The Stepped Lecture Amphitheater
- **3 Stepped Seating Tiers**:
  - Rising from floor datum ($Y=0.0\text{m}$) to $Y=1.2\text{m}$, $Y=2.4\text{m}$, and $Y=3.6\text{m}$.
  - Tier Depth: $3.2\text{ m}$ per step, fitted with continuous oak lecture desks and fixed swivel stools in `INK.ORANGE`.
  - Commands dominant cascading sightlines westward across the entire classroom.

### 7.2 The 18-Meter Slate Periodic Table Mega-Board (`x = 44.0`)
- **Monumental Classroom Blackboard (Tier 3 Landmark)**:
  - Width: $18.0\text{ m}$, Height: $8.0\text{ m}$ extending from $Y=1.2\text{m}$ to $Y=9.2\text{m}$.
  - Framed in dark stained American walnut with chalk rails holding felt erasers and chalk sticks.
  - Surface detailed with the complete 118-element periodic table, atomic masses, electron configurations, and reaction kinetics formulas in fine white and yellow chalk hatching.

---

## 8. Central Sector: Grand Demonstration Island & Colossal Bunsen Burner (Center: X = 0, Z = 0)

The commanding centerpiece and high-mobility gravity well of the entire laboratory:

### 8.1 The Raised Hexagonal Demonstration Stage
- **Stage Geometry**:
  - Hexagonal island spanning $14.0\text{ m}$ across, raised to $Y=0.75\text{m}$ above the classroom floor.
  - Edged with bullnose epoxy curbing and textured rubber safety treads.
  - Flanked by twin sunken dilution basins ($3.5\text{m} \times 2.0\text{m} \times 0.6\text{m}$ deep) with tall chrome swan-neck faucets.

### 8.2 The Colossal Bunsen Burner ("The Prometheus Pillar")
- **Hero Centerpiece Dimensions**:
  - Heavy cast-iron circular base plate ($4.8\text{m}$ diameter, $0.6\text{m}$ height) with knurled brass air shutter collar.
  - Seamless drawn brass chimney barrel ($1.8\text{m}$ diameter) ascending to $Y=8.5\text{m}$.
  - Primary grapple ring anchored to the brass chimney collar at $Y=8.8\text{m}$.
- **Dynamic Roaring Flame Cone (`L.animated`)**:
  - Dual-nested wireframe flame lofts:
    - Inner Cobalt Reduction Cone (`INK.BLUE`): Height $3.0\text{m}$ ($Y=8.5\text{m}$ to $11.5\text{m}$).
    - Outer Oxidation Mantle (`INK.ORANGE` / `INK.RED`): Height $5.5\text{m}$ ($Y=8.5\text{m}$ to $14.0\text{m}$).
  - Flame vertices dance dynamically with organic noise formulas, creating an intense convective thermal updraft that launches gliding and grappling players into the ceiling rafters!

---

## 9. Overhead Retort Stands, Helical Condenser Splines & Aerial Grapple Traversal

### 9.1 Swept 3D Helical Glass Condenser Coils
- Borosilicate glass spiral condenser coils modeled using `create3DSpline` and `splineTube`:
  - Helical coils ($0.35\text{m}$ tube diameter, $2.4\text{m}$ coil radius) looping between the teacher's distillation rack and the north storage mezzanine.
  - Rendered with transparent double-line biro outlines and rising bubble particle animations (`L.animated`).
  - Serves as narrow tightrope balance paths for aerial infiltrators!

### 9.2 Overhead Fume Exhaust Duct Catwalks
- Circular galvanized steel exhaust ductwork ($1.4\text{m}$ diameter) running along the northern perimeter with attached $1.8\text{m}$ wide maintenance catwalks at $Y=5.5\text{m}$.

### 9.3 Aerial Grapple Point Network
- 16 tactical grapple rings deployed throughout the overhead airspace:
  - 2x Bunsen Burner apex collar rings at `y = 8.8\text{ m}`.
  - 4x Retort stand boss-head clamps at `y = 6.5\text{ m}`.
  - 4x Swan-neck faucet spouts at `y = 3.2\text{ m}`.
  - 4x Ceiling gas manifold T-junctions at `y = 10.5\text{ m}`.
  - 2x Periodic Table upper frame suspension eyes at `y = 9.2\text{ m}`.
- **Grapple Radial Clearance**: Every grapple anchor maintains a clean $2.0\text{ m}$ spherical clearance free of geometry, safely exceeding the $1.5\text{ m}$ requirement.

---

## 10. Stairway Mathematics, Modular Steps & Rest Landings

All vertical transitions strictly adhere to the universal architectural locomotion standard:

$$\text{Step Rise } = 0.25\text{m}, \quad \text{Step Run } = 0.48\text{m}, \quad \text{Clearance Corridor } \ge 2.2\text{m}$$

### Stairway Manifest
1. **Lecture Amphitheater Access Steps (East)**:
   - 3 stepped runs of 5 steps each ($1.25\text{ m}$ rise per flight) connecting floor datum (`y = 0.0`) to tiers at `y = 1.2`, `y = 2.4`, and `y = 3.6`.
   - Broad $2.4\text{ m}$ stair width with polished brass tubular handrails in `INK.ORANGE`.
2. **North Fume Hood Mezzanine Switchback Stairway**:
   - Connecting Ground Floor (`y = 0.0`) to Mezzanine Walkway (`y = 5.5`):
   - Flight 1: 11 steps ($2.75\text{ m}$ rise, $5.28\text{ m}$ run).
   - Intermediate Rest Landing: $2.4\text{ m} \times 2.4\text{ m}$ square platform at `y = 2.75`.
   - Flight 2: 11 steps reversing $180^\circ$ ($2.75\text{ m}$ rise, $5.28\text{ m}$ run).
   - Non-slip perforated steel treads with safety yellow nosings.
3. **Demonstration Island Accessible Ramps**:
   - Gentle $8^\circ$ slopes rising $0.75\text{ m}$ over $5.5\text{ m}$ run with ribbed rubber safety treads.

---

## 11. Solo vs. Arena Multiplayer Variations Matrix

| Feature | Solo Wave Survival (`!arena`) | Peer-to-Peer Arena Match (`arena`) |
| :--- | :--- | :--- |
| **Map Radius ($P$)** | $50\text{ m}$ ($100 \times 100\text{ m}$ total) | $64\text{ m}$ ($128 \times 128\text{ m}$ total) |
| **Boundary Height** | $20\text{ m}$ with invisible vertical blocker to $y = 58$ | $28\text{ m}$ perimeter glazed subway tile walls |
| **Sky Enclosure** | Acoustic ceiling lid at $y = 56$ + 8 Blue Pipe Vaults | $120\text{ m}$ Geodesic Benzene Ring Dome with Red Keystone ($y=90$) |
| **Bunsen Flame** | Medium Flame ($H = 10.5\text{m}$) | Roaring Blue Jet Flame ($H = 14.0\text{m}$) with convective updrafts |
| **Chemical Hazards** | Static visual reagent puddles | Dynamic cryogenic frost plumes and caustic acid smoke traps |
| **Suspended Platforms**| 2 Fume Hood Catwalks | **5 Suspended Retort Ring Platforms** hanging from dome |
| **Spawn System** | Fixed single player start at `(0, 0.0, 38.0)` | 16 distributed symmetrical arena spawns across all vertical tiers |

### 11.1 Arena Geodesic Dome & Suspended Chemical Platforms
In multiplayer Arena matches, the ceiling opens into a monumental benzene-ring molecular dome ($R = 120, C = -30$):
- 8 longitudinal hexagonal valence bond ribs in `INK.BLUE` rotated at $22.5^\circ$ intervals.
- 5 latitude rings at $y = 38, 54, 68, 80, 88$.
- Apex Keystone: Radius $2.4\text{ m}$ styled as a glowing red triple-bond nucleus at `(0, 90, 0)` in `INK.RED`.
- **5 Suspended Iron Retort Ring Platforms**:
  1. Demonstration Island Overlook: `(0, 18.0, 0)`, size $7.0 \times 7.0\text{ m}$ styled as a giant laboratory wire gauze pad.
  2. Northwest Acid Storage Overlook: `(-22.0, 16.0, -24.0)`, size $5.5 \times 5.5\text{ m}$.
  3. Southeast Safety Shower Overlook: `(22.0, 16.0, 24.0)`, size $5.5 \times 5.5\text{ m}$.
  4. Northeast Lecture Overlook: `(24.0, 16.0, -24.0)`, size $5.0 \times 5.0\text{ m}$.
  5. Southwest Centrifuge Overlook: `(-22.0, 16.0, 24.0)`, size $5.0 \times 5.0\text{ m}$.
  - Each platform hangs from the dome via heavy steel retort rods in `INK.BLACK` with an inverted orange grapple ring at `y - 1.3`.

---

## 12. Spawn Points, Sniper Perches & Item Pickups

### 12.1 Sniper Vantage Perches (`L.snipers`)
Tactical high-elevation positions designated for precision sharpshooters:
1. `(0, 8.8, 0)`: Bunsen Burner Upper Barrel Collar Deck.
2. `(0, 5.5, -40.0)`: Fume Hood Center Exhaust Catwalk.
3. `(36.0, 3.6, 0)`: Top Tier of Lecture Amphitheater behind teacher's podium.
4. `(-32.0, 5.5, 0)`: Centrifuge Ventilation Catwalk Overlook.
5. `(44.0, 5.5, -16.0)`: Periodic Table Upper Slate Frame Catwalk.
6. `(0, 5.5, 38.0)`: Emergency Shower Supply Pipe Gantry.
7. `(-32.0, 1.1, -18.0)`: Analytical Balance Granite Table High Step.
8. `(22.0, 5.5, 24.0)`: Southeast Reagent Storage Loft.

### 12.2 Tactical Pickups & Weapon Crates (`L.pickups`)
1. Bunsen Center: `(0, 0.75, 0)` [On burner base plate - Legendary High-Caliber Chemical Rifle].
2. Sunken Sink: `(0, -0.6, 12.0)` [Under teacher's dilution faucet - Heavy Armor Core].
3. Acid Storage: `(-16.0, 0, -38.0)` [Inside lockable yellow acid cabinet - Cryogenic Freeze Grenades].
4. Lecture Hall: `(28.0, 1.2, -12.0)` [Tier 1 student desk - Medical Stim-Pack].
5. Safety Shower: `(0, -0.6, 38.0)` [Shower drain pan - Full Shield Generator].
6. Centrifuge Bench: `(-32.0, 1.1, 14.0)` [Beside refrigerated centrifuge - High-Capacity Drum Magazine].
7. Fume Hood: `(0, 5.5, -40.0)` [Exhaust damper shelf - Precision Sniper Optic].
8. Prep Room: `(22.0, 0, -38.0)` [Glassware cart shelf - Armor Shard].

### 12.3 Symmetric Multiplayer Team Spawns (`L.teamSpawns`)
- **Red Team Spawns (North - Chemical Storage & Fume Hood Sector)**:
  - `(0, 5.5, -38.0)` (North Fume Hood Catwalk Center)
  - `(-16.0, 0, -36.0)` (West Acid Cabinet Bay)
  - `(16.0, 0, -36.0)` (East Reagent Stockroom Bay)
  - `(-8.0, 0, -22.0)` (North Student Bench A Left Flank)
  - `(8.0, 0, -22.0)` (North Student Bench B Right Flank)
- **Blue Team Spawns (South - Safety Shower & Washdown Sector)**:
  - `(0, 0, 42.0)` (Decontamination Shower Archway)
  - `(-14.0, 0, 34.0)` (West Eyewash Station Court)
  - `(14.0, 0, 34.0)` (East Neutralization Basin Court)
  - `(-6.0, 0, 20.0)` (South Student Bench C Approach)
  - `(6.0, 0, 20.0)` (South Student Bench D Approach)

---

## 13. Level Designer Checklist & Anti-Bug Directives

1. **Anti-Pinch Corridor & Chokepoint Verification**:
   - All aisles between student lab benches, balance tables, and perimeter walls are verified $\ge 2.2\text{ m}$ wide, strictly exceeding the $1.8\text{ m}$ anti-pinch threshold.
   - Doorway thresholds through fume hoods and chemical storage vaults are verified at $2.4\text{ m}$ clear width.
2. **Sink Hazard & Trench Fall Recovery**:
   - Sunken sink basins at `y = -0.6\text{m}` are shallow enough ($0.6\text{m}$) for players to step out instantly without jump mantling, while providing effective low-elevation crouch cover.
3. **Tactical Cover Height Hierarchy & Zero Empty Dead-Zones**:
   - Low Crouch Cover ($0.85\text{ m} - 0.95\text{ m}$): Ceramic mortars, glassware carts, swivel stools, washbasins.
   - Chest Cover ($1.05\text{ m} - 1.2\text{ m}$): Black epoxy lab benches, balance tables, acid cabinet sills.
   - Full Occlusion ($2.1\text{ m} - 4.2\text{ m}$): Yellow chemical safety cabinets, walk-in fume hoods, periodic table piers.
   - Every $15\text{ m} \times 15\text{ m}$ quadrant incorporates intermediate staging clutter (test tube racks, burette stands, reagent carboys) ensuring zero barren wastelands.
4. **0.3m Micro-Detail & Collision Tagging Discipline**:
   - Micro-details (beakers, flasks, stopcocks, gas nozzles, valve handles, chalk pieces, periodic table grid text) must be explicitly flagged with `{ noCollide: true }`.
   - Apply `{ noNav: true }` to thin reagent shelves, condenser glass tubing, and Bunsen burner outer flame envelopes.
   - Apply `{ noGrapple: true }` to the outer perimeter glazed tile boundary walls and the sky containment ceiling.
5. **Dynamic Physics & Memory Allocations (`L.animated`)**:
   - All kinetic animations (flickering flame lofts, rising fluid bubbles, dripping water droplets, fluctuating digital scales) must update existing geometry vertex buffers in-place.
   - Zero runtime heap memory allocations in animation loops to maintain a rock-solid 60 FPS.
6. **Universal Detailing Compliance**:
   - Audited against the Universal Detailing Standard to guarantee full Skeleton-Skin-Trim layering, complete ballpoint ink material mapping, and a concept detailing score of 12/12.
