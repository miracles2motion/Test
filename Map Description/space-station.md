# The Orbital Citadel (Station Zero-G): Master Space Station Architecture & Tactical Specification

A master structural, geometrical, and aesthetic blueprint for **The Orbital Citadel** (Map Key: `space_station` / `station`), an epic sci-fi tactical arena set in an immense, hyper-detailed deep-space orbital station drawn entirely in ballpoint pen ink on technical millimeter blueprint paper.

Designed using the exact mathematical standards, coordinate bounds, vertical step ratios, and traversal loops of **Doodle District** (`district`) and **The Giant Classroom** (`classroom`), this specification establishes a peerless architectural standard that defeats and exceeds Giant Classroom in scale, verticality, tactile ballpoint drafting metaphors, and competitive flow.

---

## Table of Contents
1. [Spatial Coordinates & World Bounds](#1-spatial-coordinates--world-bounds)
2. [Aesthetic & Ink Material System](#2-aesthetic--ink-material-system)
3. [Perimeter Enclosure & Pressure Hull Decompression Boundaries](#3-perimeter-enclosure--pressure-hull-decompression-boundaries)
4. [Sector 1: Cryo-Stasis Sleeper Bay & Life Support Sanctuary (North-West)](#4-sector-1-cryo-stasis-sleeper-bay--life-support-sanctuary-north-west)
5. [Sector 2: Hydroponic Flora Biosphere & Algae Vat Laboratory (North-East)](#5-sector-2-hydroponic-flora-biosphere--algae-vat-laboratory-north-east)
6. [Sector 3: Avionics Hub, Telemetry Control & Flight Computer Vault (South-West)](#6-sector-3-avionics-hub-telemetry-control--flight-computer-vault-south-west)
7. [Sector 4: EVA Airlock Decompression Chamber & Cargo Gantry (South-East)](#7-sector-4-eva-airlock-decompression-chamber--cargo-gantry-south-east)
8. [Central Sector: The Centrifuge Torus, Tokamak Core & Observation Bridge](#8-central-sector-the-centrifuge-torus-tokamak-core--observation-bridge)
9. [Overhead Solar Array Wings, Communications Dish & Aerial Grapple Umbilicals](#9-overhead-solar-array-wings-communications-dish--aerial-grapple-umbilicals)
10. [Stairway Mathematics, Slopes & Structural Geometry](#10-stairway-mathematics-slopes--structural-geometry)
11. [Solo vs. Arena Multiplayer Variations](#11-solo-vs-arena-multiplayer-variations)
12. [Spawn Points, Sniper Perches & Item Pickups](#12-spawn-points-sniper-perches--item-pickups)
13. [Level Designer Checklist & Anti-Bug Directives](#13-level-designer-checklist--anti-bug-directives)
14. [Map-Specific Bestiary (Enemy Intelligence Design Standard)](#14-map-specific-bestiary-enemy-intelligence-design-standard)

---

## 1. Spatial Coordinates & World Bounds

The Orbital Citadel adheres to the engine's canonical Cartesian world grid to guarantee complete physics and bot navigation compatibility:

- **Origin `(0, 0, 0)`**: The center of the magnetic fusion Tokamak core floor in the Central Observation Plaza.
- **X-Axis (Port-Starboard / West-East)**:
  - Negative X (`-X`): **Port Side / West** (Sector 1 Cryo-Stasis Bay & Sector 3 Avionics Hub).
  - Positive X (`+X`): **Starboard Side / East** (Sector 2 Hydroponic Biosphere & Sector 4 EVA Airlock Cargo Gantry).
- **Y-Axis (Elevation / Vertical Tiers)**:
  - `y = -1.0 to 0.0`: Double-hulled titanium composite foundation deck.
  - `y = 0.0`: Primary Pressure Hull Floor level (Deck 1 - Main Tactical Deck).
  - `y = 0.8 to 1.3`: Waist-high tactical cover tier (Cryo-pod sleeper cradles, oxygen cylinder manifold racks, flight consoles).
  - `y = 3.5 to 4.5`: Tier 2 Intermediate Deck (Grated magnetic catwalks, service gantries, airlock portal lintels).
  - `y = 4.5`: Central Centrifuge Habitation Torus Walkway & Solar Array battery buffer.
  - `y = 7.0 to 9.0`: Tier 3 Apex Overlook (Reactor observation bridge, solar wing rotational gantry, sniper roost).
  - `y = 10.0 to 12.0`: Parabolic communications reflector apex platform, high-gain telemetry boom.
  - `y = 16.0 to 24.0`: Suspended orbital umbilical cables, docking clamps, solar photovoltaic collector wings.
  - `y = 28.0 to 36.0`: Kinetic orbital micrometeoroid deflector arrays, surveying orbital drones orbit.
  - `y = 56.0`: Invisible vacuum containment shield ceiling (Solo).
  - `y = 88.0`: Geodesic pressurized station dome zenith (Arena).
- **Z-Axis (Fore-Aft / North-South)**:
  - Negative Z (`-Z`): **Fore / North** (Cryo-Stasis Bay & Hydroponic Biosphere at `z = -45` to `-15`).
  - Positive Z (`+Z`): **Aft / South** (Avionics Hub & EVA Cargo Airlock at `z = 15` to `45`).

### Boundary Footprint
| Mode | Half-Span ($P$) | Total Dimensions | Wall Height ($PH$) | Wall Thickness ($T$) | Solo Player Start |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Solo Mode** | $55\text{ m}$ | $110 \times 110\text{ m}$ | $24\text{ m}$ | $6\text{ m}$ | `(0, 0.2, 42)` facing North (`-z`) |
| **Arena Mode** | $68\text{ m}$ | $136 \times 136\text{ m}$ | $36\text{ m}$ | $6\text{ m}$ | 16 Balanced Orbital Docking Spawns |

---

## 2. Aesthetic & Ink Material System

The entire orbital complex is rendered through intricate drafting stationery and ballpoint technical linework (`src/render.js`):

- **`INK.BLUE` (Primary Ink - Titanium Alloy & Blueprint Steel)**:
  - Exterior pressure hull plating and ribbed bulkheads.
  - Pressurized corridor floors and magnetic deck grating.
  - Cryo-stasis capsule frames and frost viewing visors.
  - Giant photovoltaic solar cell collector wafers.
  - Deep-space parabolic communications dish reflector.
- **`INK.BLACK` (Secondary Ink - Carbon-Fiber Struts & Heavy Machinery)**:
  - Centrifuge rotation gantry trusses and structural I-beams.
  - Safety handrails, magnetic gantry balustrades, and ladder rungs.
  - Heavy airlock dogging mechanisms and hydraulic piston sleeves.
  - Conduit pipe runs, high-voltage bus bars, and wire bundle ties.
  - Technical engineering callouts, millimeter grid lines, and hatch labels.
- **`INK.ORANGE` (Accent Ink - Telemetry, Solar Heat Shield & Brass Instruments)**:
  - Solar array pivot gimbal housings and rotational actuators.
  - Holographic cockpit telemetry consoles, CRT vector displays, and keypads.
  - Brass drafting compass needle radio masts and orientation gyro spheres.
  - Momentum grapple anchor rings (`ring()`) and elevated zipline eyebolts.
  - Tactical pick-up canister pedestals and repair kit nodes.
- **`INK.GREEN` (Biological Support & Algae Fluids)**:
  - Hydroponic spirulina growth troughs and pressurized nutrient baths.
  - Life support atmospheric scrubbing canisters.
  - Biosphere observation window tinting and bio-hazard diagnostic LED bars.
- **`INK.RED` (Hazard Warnings & Emergency Decompression Alerts)**:
  - Airlock decompression warning beacons and siren strobes.
  - High-pressure oxygen/nitrogen cylinder danger markings.
  - Radiation hazard trefoil badges around the Tokamak fusion core.
  - Emergency EVA manual hatch release wheels and override levers.

---

## 3. Perimeter Enclosure & Pressure Hull Decompression Boundaries

The outer boundary is framed by 4 massive double-walled space station pressure hull bulkheads ($6.0\text{ m}$ thickness, $24.0\text{ m}$ vertical height):

- **North Bulkhead (Fore)**: Reinforced observation wall with armored quartz viewports looking into deep space stars.
- **South Bulkhead (Aft)**: Primary docking umbilical gateway with dual heavy pressurized airlock vestibules.
- **West Bulkhead (Port)**: Cryogenic coolant exchange matrix with protruding radiator cooling fins.
- **East Bulkhead (Starboard)**: Solar transmission bus conduits connecting external solar panel arrays to the main grid.
- **Perimeter Elevated Service Gantry**: Continuous elevated magnetic catwalk running along the perimeter at $Y = 5.5\text{ m}$ and $Y = 9.0\text{ m}$, providing continuous 360° sniper sightlines and vertical flank paths.
- **Emergency Pressure Gateways**: 4 Cardinal reinforced doorframes ($3.2\text{ m}$ width, $3.4\text{ m}$ height) with guaranteed $\ge 2.8\text{ m}$ vertical headroom and zero pinch obstructions.

---

## 4. Sector 1: Cryo-Stasis Sleeper Bay & Life Support Sanctuary (North-West)

- **Coordinates**: $X \in [-45, -12]$, $Z \in [-45, -12]$, $Y \in [0, 9.0]$.
- **Architectural Role**: Low-temperature defensive bunker and staging area for crew hibernation.
- **Tactical Dynamics**: Tight CQB corridor flanking lanes winding through stasis pod pods and cryogenic coolant towers.
- **Tier 1 Micro Props**:
  - 4x `buildCryoPod` ($1.2\text{ m} \times 2.2\text{ m} \times 1.1\text{ m}$): Stasis sleeper capsules with frost visors and diagnostic monitors providing waist-high defilade.
  - 3x `buildOxygenTankRack` ($2.2\text{ m} \times 1.0\text{ m} \times 1.3\text{ m}$): Clustered O2 cylinders in protective roll-cages.
  - Scattered diagnostic data slates and medical telemetry monitors ($0.7\text{ m} \times 0.3\text{ m}$).
- **Tier 2 Meso Props**:
  - Elevated stasis observation mezzanine at $Y = 4.0\text{ m}$ with timbered blue titanium floor and black carbon railings.
  - Connecting airlock hatch portal (`buildAirlockHatch`) leading toward the Central Tokamak Core.
- **Tier 3 Macro Set Piece**:
  - Cryogenic Coolant Condenser Tower ($4.5\text{ m} \times 7.5\text{ m} \times 4.5\text{ m}$): Multi-stage cooling column with spiral exterior maintenance steps and overhead grapple point.
- **Combat Cover Guarantee**: Minimum 35 distinct colliders, 8 low-crouch positions, and 2 distinct escape routes to prevent spawn-camping.

---

## 5. Sector 2: Hydroponic Flora Biosphere & Algae Vat Laboratory (North-East)

- **Coordinates**: $X \in [12, 45]$, $Z \in [-45, -12]$, $Y \in [0, 9.0]$.
- **Architectural Role**: Pressurized agricultural bio-dome and oxygen recycling center.
- **Tactical Dynamics**: Open-canopy gunfights over stepped nutrient tanks, interspersed with hanging UV grow lights.
- **Tier 1 Micro Props**:
  - 4x `buildHydroponicTray` ($2.4\text{ m} \times 1.4\text{ m} \times 1.1\text{ m}$): Algae culture beds with green bioluminescent nutrient fluid and overhead UV lamps.
  - 2x Aeroponic nutrient distributor cylinders ($0.35\text{ m}$ radius, $1.2\text{ m}$ height).
  - Micro-cover seed vaults and biological specimen containers.
- **Tier 2 Meso Props**:
  - Stepped biological testing catwalk ($12\text{ m} \times 3\text{ m}$ at $Y = 3.8\text{ m}$) with perimeter guardrails.
  - High-pressure atmospheric scrubber intake gantry.
- **Tier 3 Macro Set Piece**:
  - Biome Climate Regulator Dome ($6.0\text{ m} \times 8.0\text{ m} \times 6.0\text{ m}$): Glass geodesic biosphere hub with internal sniper perch and momentum grapple ring.
- **Vertical Traversal**: Dual stairways with $0.28\text{ m}$ rise connecting the ground bio-troughs to the elevated research catwalk.

---

## 6. Sector 3: Avionics Hub, Telemetry Control & Flight Computer Vault (South-West)

- **Coordinates**: $X \in [-45, -12]$, $Z \in [12, 45]$, $Y \in [0, 9.0]$.
- **Architectural Role**: Orbital navigation, telemetry processing, and long-range communications hub.
- **Tactical Dynamics**: Labyrinthine server racks and control consoles creating narrow 90-degree sightline ambushes.
- **Tier 1 Micro Props**:
  - 4x `buildTelemetryConsole` ($2.0\text{ m} \times 1.2\text{ m} \times 1.2\text{ m}$): Angled flight terminals with illuminated holo-monitors and operator stools.
  - 3x Magnetic tape memory banks ($1.4\text{ m} \times 1.2\text{ m} \times 0.6\text{ m}$).
  - Portable avionics diagnostic carts with coiled wire harnesses.
- **Tier 2 Meso Props**:
  - Suspended server maintenance bridge at $Y = 4.2\text{ m}$ overlooking the mainframe banks.
  - Enclosed flight director glass cupola with anti-camp open rear vectors.
- **Tier 3 Macro Set Piece**:
  - Deep-Space Communications Gantry (`buildCommunicationsDish` at $X = -28, Z = 28$): Massive $6.5\text{ m}$ wide parabolic antenna on a lattice tower with apex grapple ring at $Y = 11.5\text{ m}$.
- **Tactical Utility**: Contains prime solo weapon cache node at $Y = 4.4\text{ m}$.

---

## 7. Sector 4: EVA Airlock Decompression Chamber & Cargo Gantry (South-East)

- **Coordinates**: $X \in [12, 45]$, $Z \in [12, 45]$, $Y \in [0, 9.0]$.
- **Architectural Role**: Space-walk egress port, cargo container handling, and primary station airlock.
- **Tactical Dynamics**: Heavy steel cover blocks, freight ramps, and industrial overhead crane gantries.
- **Tier 1 Micro Props**:
  - 3x Pressurized space-suit locker units ($1.2\text{ m} \times 1.3\text{ m} \times 0.8\text{ m}$, waist cover).
  - 4x Titanium shipping crates ($1.5\text{ m} \times 1.2\text{ m} \times 1.5\text{ m}$) with yellow hazard stenciling.
  - 2x High-pressure airlock pump manifolds with pressure gauges.
- **Tier 2 Meso Props**:
  - Cargo crane gantry bridge ($14\text{ m}$ length at $Y = 5.0\text{ m}$) with suspended cargo harness.
  - Dual reinforced blast airlocks (`buildAirlockHatch`) framing the South-East gateway.
- **Tier 3 Macro Set Piece**:
  - Orbital Docking Spire & Airlock Hub ($8.0\text{ m} \times 9.5\text{ m} \times 8.0\text{ m}$): Heavy exterior docking sleeve with walkable roof and grapple anchor ring.
- **Traversal Loop**: Ramp connecting the cargo floor directly to the perimeter elevated walkway.

---

## 8. Central Sector: The Centrifuge Torus, Tokamak Core & Observation Bridge

- **Coordinates**: $X \in [-12, 12]$, $Z \in [-12, 12]$, $Y \in [0, 14.0]$.
- **Architectural Role**: The beating heart of the station; a revolving habitat centrifuge torus anchored around a magnetic Tokamak reactor.
- **Central Core Features**:
  - **The Fusion Tokamak Pillar**: Cylindrical magnetic reactor column ($R = 2.2\text{ m}$, $H = 12.0\text{ m}$) drawn in deep biro blue with hazard red core illumination.
  - **The Centrifuge Habitat Ring (`buildCentrifugeRing`)**:
    - Central hub at $Y = 0$ to $8.5\text{ m}$.
    - 4 Radial structural spokes connecting outward to an elevated circular observation deck at $Y = 4.5\text{ m}$.
    - 4 Quadrant platform slabs with perimeter safety railings (`rail()`) and waist-high defensive consoles.
  - **Apex Observation Bridge (Tier 3)**:
    - Suspended command catwalk at $Y = 9.0\text{ m}$ crossing directly over the Tokamak core.
    - Provides unobstructed 360° rifle sightlines into all 4 quadrant sectors.
    - Protected by waist-high carbon ballistic baffles ($H = 1.1\text{ m}$).
  - **Central Reward**: Mega item pickup floating directly above the reactor core at $(0, 4.7, 0)$.

---

## 9. Overhead Solar Array Wings, Communications Dish & Aerial Grapple Umbilicals

- **Photovoltaic Solar Arrays (`buildSolarArray`)**:
  - Dual massive solar wing structures deployed at East and West perimeters ($11.0\text{ m}$ span each).
  - Rotational spindle mounts with gimbal actuators at $Y = 4.8\text{ m}$.
  - Walkable solar truss booms allowing daring high-altitude grapple jumps.
- **Aerial Grapple Umbilicals & Rings**:
  - 8 Strategic momentum grapple rings positioned with $\ge 1.5\text{ m}$ clearance from all colliders:
    - Apex Reactor Ring: `(0, 13.5, 0)` facing `'y'` (High momentum central swing).
    - North-West Cryo Ring: `(-25, 11.5, -25)` facing `'z'`.
    - North-East Biome Ring: `(25, 11.5, -25)` facing `'z'`.
    - South-West Comms Ring: `(-25, 11.5, 25)` facing `'y'`.
    - South-East Cargo Ring: `(25, 11.5, 25)` facing `'y'`.
    - Fore Observation Ring: `(0, 15.0, -35)` facing `'z'`.
    - Aft Docking Ring: `(0, 15.0, 35)` facing `'z'`.
- **Tier 4 Kinetic Elements**:
  - Circling technical survey paper planes / orbital telemetry drones at $Y = 24.0\text{ m}$ catching solar wind thermal drafts.

---

## 10. Stairway Mathematics, Slopes & Structural Geometry

All vertical transitions strictly adhere to the Universal Detailing Standard and engine swept-sphere physics:

- **Step Rise**: Fixed at exact literal $0.2813\text{ m}$ (never dynamic division string, strictly between $0.20\text{ m}$ and $0.32\text{ m}$).
- **Step Run**: Fixed at $0.45\text{ m}$ (well above the $0.30\text{ m}$ minimum threshold).
- **Headroom Clearances**: Strictly guaranteed $\ge 2.5\text{ m}$ continuous vertical clearance above every step.
- **Aperture Cutout Guarantee**: All elevated deck slabs (`slab()`) above stairways include full geometric clearances to eliminate head-bonk collisions.
- **Stair Flight Dimensions**:
  - Central Dais Stairways: 2 flights of 16 steps each, width $= 3.2\text{ m}$, rise $= 0.2813\text{ m}$, run $= 0.45\text{ m}$.
  - Quadrant Catwalk Stairways: 4 flights of 13 steps each, width $= 2.8\text{ m}$, connecting each sector floor to its Tier 2 platform.
- **Landing Rest Rule**: Every stairway landing terminates flush with an underlying structural collider within $\pm 0.3\text{ m}$ vertical tolerance.

---

## 11. Variations Matrix (Solo vs. Arena Multiplayer)

- **Solo Campaign Mode**:
  - Playable perimeter bounds: $P = 55.0\text{ m}$ ($110 \times 110\text{ m}$).
  - Contained vacuum ceiling lid at $Y = 56.0\text{ m}$ to prevent projectile escape.
  - Progressive 5-wave alien/cyborg invasion logic utilizing all 8 sector spawners.
- **Arena Multiplayer Mode**:
  - Expanded boundary footprint: $P = 68.0\text{ m}$ ($136 \times 136\text{ m}$).
  - Perimeter wall height raised to $PH = 36.0\text{ m}$.
  - 16 Symmetrical team spawns located around the exterior docking bays.
  - Additional perimeter solar wing catwalks enabled for high-altitude sniper duels.

---

## 12. Spawn Points, Sniper Perches & Item Pickups

### Solo Player & Bot Spawns (8 Distributed Spawns)
1. **Player Start (South Aft Docking Airlock)**: `(0, 0.2, 42)` facing North (`-z`).
2. **North Observation Bay**: `(0, 0.2, -42)` facing South (`+z`).
3. **West Cryo Corridor**: `(-38, 0.2, 0)` facing East (`+x`).
4. **East Biosphere Corridor**: `(38, 0.2, 0)` facing West (`-x`).
5. **Sector 1 Hibernation Alcove**: `(-25, 3.8, -25)`.
6. **Sector 2 Algae Testing Balcony**: `(25, 3.8, -25)`.
7. **Central Tokamak Dais**: `(0, 4.7, 0)`.
8. **Apex Command Overlook Bridge**: `(0, 9.3, 0)`.

### Designated Sniper Vantage Perches (4 Perches)
1. **North Observation Spire**: `(0, 9.3, -14)` (Covers Central Dais and North sectors).
2. **South Docking Gantry**: `(0, 9.3, 14)` (Covers Aft entrance and Cargo bay).
3. **Port Comms Mast**: `(-28, 9.2, 28)` (Long rifle sightline down Port flank).
4. **Starboard Biosphere Crown**: `(28, 9.2, -28)` (Overlooks greenhouse corridors).

### Tactical Resource Pickups (6 Pickups)
1. **Tokamak Core Supercharge (Mega Weapon)**: `(0, 4.7, 0)`.
2. **Apex Command Armor Buffer**: `(0, 9.3, 0)`.
3. **Sector 1 Cryo Stasis Health Syringe**: `(-25, 3.6, -25)`.
4. **Sector 2 Bio-Nutrient Stimpack**: `(25, 3.6, -25)`.
5. **Port Avionics Plasma Core**: `(-14, 0.2, 8)`.
6. **Starboard EVA Airlock Repair Kit**: `(14, 0.2, -8)`.

---

## 13. Level Designer Checklist & Anti-Bug Directives

- [x] **Universal Detailing Standard**: All props follow the Skeleton-Skin-Trim triad, with visual micro-trims tagged with `{ noCollide: true }`.
- [x] **0.3m Detail Threshold**: Objects smaller than $0.3\text{ m}$ thickness do not generate physical colliders to prevent character jitter.
- [x] **Stairway Headroom**: All stair flights have $\ge 2.5\text{ m}$ continuous vertical headspace.
- [x] **No Dead-End Traps**: Minimum walkway corridor width is $2.4\text{ m}$ (well exceeding the $1.8\text{ m}$ anti-pinch standard).
- [x] **Grapple Ring Clearances**: All 8 grapple rings have $\ge 1.5\text{ m}$ clearance from adjacent structural walls.
- [x] **Collider Density**: Total registered colliders exceeds 200, ensuring a rich, dense tactical arena.
- [x] **Quadrant Density Balance**: Every sector has $\ge 35$ colliders and $\ge 6$ waist-high cover positions.
- [x] **Sightline Discipline**: No single sightline exceeds $65\text{ m}$ without intermediate macro/meso cover occlusion.

---

## 14. Map-Specific Bestiary (Enemy Intelligence Design Standard)

Adhering strictly to `.agents/skills/enemy-intelligence-design/SKILL.md`, all enemies include mandatory role-based intelligence tags:

- **Enemy 1: Orbital Cyborg Rusher (Station Security Sentry)**:
  `{ role: 'melee', canDodge: true, canCover: true, canRetreat: false, canFlank: true, berserker: true, hp: 70, speed: 9.0, weapon: 'blade', lunge: 3.8, reach: 3.2, standoff: 1.5, cool: [0.7, 1.1], dmg: 22, score: 180, scale: 1.05, build: { bodyW: 0.85, headS: 0.9, limbR: 0.035 } }`
  - *Behavior*: Aggressive cybernetic defense unit that slides under airlock lintels, flanks along magnetic catwalks, and closes distance with lethal shock batons.

- **Enemy 2: EVA Railgun Sniper (Solar Array Marksman)**:
  `{ role: 'ranged', canDodge: true, canCover: true, canRetreat: true, canFlank: false, stationary: true, hp: 55, speed: 3.2, weapon: 'sniper', range: 90, stop: 85, keep: 25, aimTime: 1.4, cool: [2.2, 3.2], dmg: 30, score: 220, scale: 0.95, build: { bodyW: 0.7, headS: 0.8, limbR: 0.02 } }`
  - *Behavior*: Perches high on solar wing booms and communications gantries, utilizing long-range particle beams to suppress center lanes. Retreats behind carbon panels when returned fire occurs.

- **Enemy 3: Zero-G Skimmer Drone (Patrol Interceptor)**:
  `{ role: 'aerial', canDodge: false, canCover: false, canRetreat: false, canFlank: false, hp: 45, speed: 6.5, weapon: 'shotgun', range: 25, stop: 12, keep: 8, aimTime: 0.8, cool: [1.2, 1.8], dmg: 16, score: 160, scale: 0.85, build: { bodyW: 0.6, headS: 0.7, limbR: 0.025 } }`
  - *Behavior*: Agile aerial drone utilizing dedicated flight brain to strafe player positions from overhead vacuum vectors.
