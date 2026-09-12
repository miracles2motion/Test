# The Clockwork Tower: Comprehensive Map Architecture & Specification

A master structural, geometrical, and aesthetic blueprint for **The Clockwork Tower** (Map Key: `clockwork` / `tower`), an epic vertical steampunk combat arena set within the cavernous interior of an immense horological clock monument filled with interlocking brass spur gears, reciprocating steam pistons, high-pressure copper steam manifolds, and a monumental 40-meter harmonic pendulum swinging over a fatal mechanical abyss.

Designed using the exact mathematical standards, coordinate bounds, vertical step ratios, and traversal loops of **Doodle District** (`district`), this specification establishes a flawless reference for implementing the horological combat map in `src/level.js` without geometric inconsistencies, blind traps, or collision bugs.

---

## Table of Contents
1. [Spatial Coordinates & World Bounds](#1-spatial-coordinates--world-bounds)
2. [Aesthetic & Ink Material System](#2-aesthetic--ink-material-system)
3. [Perimeter Enclosure & Tower Pit Boundaries](#3-perimeter-enclosure--tower-pit-boundaries)
4. [Sector 1: The Great Interlocking Spur Gear Train (North & Center)](#4-sector-1-the-great-interlocking-spur-gear-train-north--center)
5. [Sector 2: The 40-Meter Harmonic Pendulum & Escapement (Central Trench)](#5-sector-2-the-40-meter-harmonic-pendulum--escapement-central-trench)
6. [Sector 3: The Reciprocating Steam Piston & Valve Gallery (West)](#6-sector-3-the-reciprocating-steam-piston--valve-gallery-west)
7. [Sector 4: The Boiler Works, Copper Headers & Dial Faces (East)](#7-sector-4-the-boiler-works-copper-headers--dial-faces-east)
8. [Central Sector: The Clockmaker's Sanctuary & Balance Wheel Arbor](#8-central-sector-the-clockmakers-sanctuary--balance-wheel-arbor)
9. [Overhead Traveling Monorail Hoist & Kinetic Grapple Traversal](#9-overhead-traveling-monorail-hoist--kinetic-grapple-traversal)
10. [Stairway Mathematics, Ship Ladders & Industrial Catwalks](#10-stairway-mathematics-ship-ladders--industrial-catwalks)
11. [Solo vs. Arena Multiplayer Variations Matrix](#11-solo-vs-arena-multiplayer-variations-matrix)
12. [Spawn Points, Sniper Perches & Item Pickups](#12-spawn-points-sniper-perches--item-pickups)
13. [Level Designer Checklist & Anti-Bug Directives](#13-level-designer-checklist--anti-bug-directives)

---

> [!NOTE]
> **Implementation Status & Performance Deferrals:** 
> - **Scale Compression:** To ensure tight CQB gameplay, the implemented vertical scale is compressed. Gears Alpha, Beta, and Gamma are at `y = 1.6m` and `y = 3.6m` rather than `y = 6m` and `18m`.
> - **Performance Holds (DEFERRED):** All rotating gear deck colliders, moving piston colliders, flyball governor animations, and steam exhaust particle effects are strictly deferred to maintain a zero-allocation 16.6ms frame budget.
> - **Kill Pit:** Implemented as a central hole exposing the void (`y < -20`) rather than a full subterranean floor, ensuring clean death plane logic without extra animated hazard meshes.

---

## 1. Spatial Coordinates & World Bounds

The Clockwork Tower shares the exact Cartesian world grid as Doodle District to ensure 100% engine compatibility:

- **Origin `(0, 0, 0)`**: The geometric center of the central gear train arbor at the primary catwalk level.
- **X-Axis (East-West)**:
  - Negative X (`-X`): **West** (The Steam Piston Gallery, heavy cast-iron flywheels, slide valves).
  - Positive X (`+X`): **East** (The Cornish Boiler Works, flanged copper header pipes, pressure dials).
- **Y-Axis (Elevation / Vertical Tiers)**:
  - `y = -6.0`: The Fatal Grinding Pit & Molten Firebox (`killZ` hazard threshold).
  - `y = -2.0 to 0.0`: Subterranean maintenance catwalks & lower arbor bearings.
  - `y = 0.0`: Primary Horological Datum Level (Catwalk Tier 1).
  - `y = 6.0`: Great Spur Gear Alpha surface & Piston gallery mid-deck (Catwalk Tier 2).
  - `y = 12.0`: Intermediate Spur Gear Beta surface & Boiler manifold catwalk (Catwalk Tier 3).
  - `y = 18.0`: High Spur Gear Gamma surface & Balance wheel rim deck (Catwalk Tier 4).
  - `y = 24.0`: Escapement wheel anchor pallets & clock face numeral catwalk.
  - `y = 34.0`: Overhead Traveling Monorail crane hoist rail.
  - `y = 48.0`: Pendulum knife-edge suspension arbor & roof trusses.
  - `y = 52.0`: Belfry chime chamber & bell striking hammers.
  - `y = 56.0`: Invisible sky containment lid (Solo).
  - `y = 88.0`: Geodesic gear-tooth clock dome apex (Arena).
- **Z-Axis (North-South)**:
  - Negative Z (`-Z`): **North** (The Great Gear Train & Escapement Mechanism at `z = -38`).
  - Positive Z (`+Z`): **South** (The Boiler Wall, Pressure Gauges & Chime Bells at `z = 38`).

### Boundary Envelopes
| Mode | Half-Span ($P$) | Total Dimensions | Wall Height ($PH$) | Wall Thickness ($T$) | Solo Player Start |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Solo Mode** | $55\text{ m}$ | $110 \times 110\text{ m}$ | $24\text{ m}$ | $6\text{ m}$ | `(0, 0, 36.0)` facing North (`-z`) |
| **Arena Mode** | $68\text{ m}$ | $136 \times 136\text{ m}$ | $34\text{ m}$ | $6\text{ m}$ | 16 Symmetrical Arena Spawns |

---

## 2. Aesthetic & Ink Material System

All geometry in The Clockwork Tower is synthesized through procedural ballpoint pen and industrial copper/brass hatching (`src/render.js`), set against aged blueprint technical parchment:

- **`INK.ORANGE` (ID: 3 - Horological Brass & Polished Copper)**:
  - Massive involute spur gears, gear teeth, balance wheels, and pinion arbors.
  - High-pressure flanged copper steam header pipes (`radius = 0.45m to 0.85m`).
  - 40-meter pendulum convex brass bob and rating regulation nut.
  - All interactive grapple rings and dynamic swinging anchors.
- **`INK.BLACK` (ID: 2 - Cast-Iron Machinery & Structural Steel)**:
  - Piston cylinder blocks, crossheads, connecting rods, and crankshafts.
  - Expanded diamond-mesh steel catwalks, handrails, and industrial ship ladders.
  - Escapement anchor pallets, steel suspension spring leaves, and clock hands.
  - Steel cables, turnbuckles, and counterweight chains.
- **`INK.BLUE` (ID: 0 - Prussian Engineering Blueprint Blue)**:
  - Tower structural outer masonry columns, pilasters, and perimeter arches.
  - Diamond-plate platform decking and machinery foundation bedplates.
  - Giant translucent clock face dial glass with Roman numerals.
  - Perimeter containment boundary bulkheads.
- **`INK.RED` (ID: 1 - Thermal Pressure Red & Warning Accents)**:
  - Boiler combustion firebox doors and glowing furnace embers.
  - Emergency steam release pressure valves and high-temperature warning signs.
  - Arena Geodesic Dome central escapement keystone (`radius = 2.4` at `y = 90`).
  - Red warning beacons on overhead hoist monorails.
- **`INK.GREEN` (ID: 4 - Verdigris Patina & Mineral Oil)**:
  - Weathered bronze clock bells in the upper belfry.
  - Lubricating mineral oil reservoirs and sight-glass level indicators.
  - Patina-encrusted copper conduit brackets.
- **`INK.PINK` (ID: 5 - Rubber Stationery Shock Mounts)**:
  - Heavy vibration-damping industrial rubber mount pads beneath steam cylinders.
  - Piston bumper buffer stops at stroke endpoints.

---

## 3. Perimeter Enclosure & Tower Pit Boundaries

### 3.1 The Fatal Grinding Pit & Sub-Floor
- **The Abyss Hazard**:
  - The floor below `y = -4.0` opens into a subterranean chasm of interlocking grinding cogwheels and glowing boiler fireboxes.
  - Falling past `y = -5.0` triggers instant player death and ragdoll incineration.
- **Structural Catwalk Foundation**:
  - A criss-crossing network of steel I-beams `box(0, -1.0, 0, 2*P, 1.0, 4.0)` in `INK.BLACK` supporting the lower gear arbors.
- **Perimeter Industrial Enclosure Walls**:
  - North Wall: `box(0, 0, -P, 2*P + T, PH, T)` in `INK.BLUE`.
  - South Wall: `box(0, 0, P, 2*P + T, PH, T)` in `INK.BLUE`.
  - West Wall: `box(-P, 0, 0, T, PH, 2*P + T)` in `INK.BLUE`.
  - East Wall: `box(P, 0, 0, T, PH, 2*P + T)` in `INK.BLUE`.

### 3.2 Anti-Camp Sky Containment (Solo Mode)
- **Invisible Vertical Wall Extensions**: 4 colliders rising from `y = 24.0` to `y = 58.0`, tagged `{ noNav: true, noGrapple: true }`.
- **Sky Ceiling Lid**: `collider(0, 56.0, 0, 2*P + 40, 8.0, 2*P + 40, { noNav: true, noGrapple: true })`.
- **Clockwork Arch Torus Ribs**:
  - Center: `(0, -20.0, 0)`, Radius: $R = 98.0\text{ m}$.
  - 6 vertical semi-circular gear-tooth ribs in `INK.BLUE` rotated at $30^\circ$ increments.
  - 4 latitude containment rings at heights `y = 30.0, 46.0, 60.0, 72.0`.

### 3.3 Perimeter Observation Balconies & Pressure Stations
8 elevated sniper and grapple platforms embedded into the perimeter masonry walls:
1. `[-36.0, 8.0, -51.2, 8.0, 0.4, 2.4]`: Northwest Escapement Observation Balcony.
2. `[36.0, 8.0, -51.2, 8.0, 0.4, 2.4]`: Northeast Gear Train Maintenance Ledge.
3. `[-51.2, 12.0, -18.0, 2.4, 0.4, 8.0]`: West Cylinder Head Service Platform.
4. `[-51.2, 12.0, 18.0, 2.4, 0.4, 8.0]`: West Flywheel Governor Balcony.
5. `[51.2, 12.0, -18.0, 2.4, 0.4, 8.0]`: East Boiler Manifold High Catwalk.
6. `[51.2, 12.0, 18.0, 2.4, 0.4, 8.0]`: East Pressure Dial Inspection Shelf.
7. `[-28.0, 8.0, 51.2, 8.0, 0.4, 2.4]`: Southwest Pendulum Arc Observation Deck.
8. `[28.0, 8.0, 51.2, 8.0, 0.4, 2.4]`: Southeast Stoker's Coal Chute Platform.

### 3.4 Enemy Wave Spawn Portals
10 horological spawn portals for Solo survival waves:
- 2 Steam Cylinder Exhaust Ports: `(-52.0, 4.0, -12.0)` and `(-52.0, 4.0, 12.0)`.
- 2 Boiler Ash Removal Tunnels: `(52.0, 0, -12.0)` and `(52.0, 0, 12.0)`.
- 2 Escapement Weight Shaft Chutes: `(-14.0, 0, -52.0)` and `(14.0, 0, -52.0)`.
- 2 Southern Chime Hammer Corridors: `(-16.0, 0, 52.0)` and `(16.0, 0, 52.0)`.
- 2 Sub-Floor Oil Sump Culverts: `(0, -2.0, -24.0)` and `(0, -2.0, 24.0)`.

---

## 4. Sector 1: The Great Interlocking Spur Gear Train (North & Center)

The core kinetic monument dominating the northern sector, composed of three massive horizontal brass spur wheels rotating synchronously.

### 4.1 Gear Alpha (The Center Driver Cog)
- **Position & Dimensions**:
  - Center: `(0, 6.0, -12.0)`. Radius: $12.0\text{ m}$. Thickness: $1.2\text{ m}$.
  - Top Deck Elevation: `y = 6.6\text{ m}`.
  - Central Arbor Shaft: Solid steel cylinder `cyl(0, 0, -12.0, radius 1.8, height 18.0)` in `INK.BLACK`.
- **Anatomy of Gear Alpha**:
  - 36 Involute Gear Teeth: `box()` prisms along circumference, width $1.0\text{ m}$, depth $1.2\text{ m}$, height $1.2\text{ m}$ in `INK.ORANGE`.
  - 6 Curved Open Spokes: Pierced brass spoke arms leaving open floor cavities for vertical drop-attacks!
  - Continuous Rotation: Rotates clockwise at $\omega = 0.08\text{ rad/s}$ (shifting cover and perimeter jump alignments continuously).

### 4.2 Gear Beta (The Northwest Stepper Cog)
- **Position & Dimensions**:
  - Center: `(-18.0, 12.0, -24.0)`. Radius: $9.0\text{ m}$. Thickness: $1.0\text{ m}$.
  - Top Deck Elevation: `y = 12.5\text{ m}`.
  - Interlocks with Gear Alpha at `(-9.0, 6.0, -18.0)` via a vertical transfer pinion!
  - Rotates counter-clockwise at $\omega = -0.106\text{ rad/s}$.

### 4.3 Gear Gamma (The Northeast Crown Wheel)
- **Position & Dimensions**:
  - Center: `(18.0, 18.0, -24.0)`. Radius: $7.5\text{ m}$. Thickness: $1.0\text{ m}$.
  - Top Deck Elevation: `y = 18.5\text{ m}` (the premier northern sniper deck).
  - Equipped with perimeter brass safety railings and an orange grapple ring mounted at the arbor cap: `ring(18.0, 19.8, -24.0, 'y')`.

---

## 5. Sector 2: The 40-Meter Harmonic Pendulum & Escapement (Central Trench)

A monumental kinetic physics centerpiece spanning the central corridor from `y = 4.0` to `y = 48.0`.

### 5.1 The Giant Harmonic Pendulum
- **Suspension Geometry**:
  - Suspension Pivot: Hardened steel knife-edge block at `(0, 48.0, 6.0)`.
  - Gridiron Suspension Rod: Laminated zinc and brass thermal compensation bars `cyl(0, 24.0, 6.0, radius 0.45, height 40.0)` in `INK.ORANGE`.
- **The 6.8-Meter Convex Brass Bob**:
  - Positioned at the bottom of the rod: Lens-shaped disc of diameter $6.8\text{ m}$, thickness $2.2\text{ m}$ in `INK.ORANGE`.
  - Massive knurled rating regulation nut at the base with an integrated grapple ring: `ring(x(t), y(t) - 1.6, z(t), 'z')`.
- **Harmonic Trajectory Equation**:
  $$\theta(t) = \theta_0 \cdot \cos(\omega t), \quad \text{where } \theta_0 = 0.32\text{ rad } (\approx 18.3^\circ), \ \omega = 0.55\text{ rad/s}$$
  $$X(t) = 0 + L \cdot \sin(\theta(t)) = 40.0 \cdot \sin(\theta(t)) \quad (\text{swings } \pm 12.6\text{ m across the trench})$$
  $$Y(t) = 48.0 - L \cdot \cos(\theta(t)) = 48.0 - 40.0 \cdot \cos(\theta(t)) \quad (y \text{ rises from } 8.0\text{ m to } 12.0\text{ m})$$
  $$Z(t) = 6.0$$
- **Gameplay Mechanic**:
  - Registered in `L.grappleMovers` with hit collision radius $3.8\text{ m}$.
  - Players can hook the swinging bob to slingshot across the room or stand on top of the bob as an oscillating mobile sniper platform!

### 5.2 The Deadbeat Escapement Mechanism (y = 24.0 to 32.0)
- 30-tooth ratchet escape wheel of diameter $8.0\text{ m}$ mounted vertically at `(0, 26.0, -32.0)` in `INK.ORANGE`.
- Two articulated anchor pallets rocking back and forth with a crisp, reverberating "TICK-TOCK" sound effect triggering every second.

---

## 6. Sector 3: The Reciprocating Steam Piston & Valve Gallery (West)

An industrial sector stationed at `x = -32.0` spanning `z = -28.0 to 28.0`.

### 6.1 Twin Horizontal Steam Cylinders
Two heavy cast-iron power cylinders driving the main clockwork gear train:
- **Cylinder Envelope**:
  - Cylinder 1: `cyl(-32.0, 4.0, -14.0, radius 2.4, height 12.0, axis='z')` in `INK.BLACK`.
  - Cylinder 2: `cyl(-32.0, 4.0, 14.0, radius 2.4, height 12.0, axis='z')` in `INK.BLACK`.
  - Bolted cylinder head covers with brass stud nuts.
- **Reciprocating Crosshead Piston Rams**:
  - Steel piston rods of diameter $0.8\text{ m}$ extending horizontally toward the center.
  - Cycle Period: 3.2 seconds.
  - Piston Travel: Stroke length $4.5\text{ m}$ cycling between `x = -26.0` and `x = -21.5`.
  - Steam Exhaust Blast: Periodic bursts of white ink vapor venting every stroke (`noCollide: true`).

### 6.2 The Centrifugal Flyball Governor
- Mounted above the cylinders at `(-32.0, 12.0, 0)`:
  - Vertical rotating spindle with two heavy cast-iron flyballs suspended on scissor arms.
  - As the clock accelerates, the balls swing outward, actuating the throttle valve lever.
  - Upper Spindle Grapple Point: `ring(-32.0, 14.8, 0, 'y')` in `INK.ORANGE`.

---

## 7. Sector 4: The Boiler Works, Copper Headers & Dial Faces (East)

A thermal industrial sector stationed at `x = 32.0` spanning `z = -28.0 to 28.0`.

### 7.1 Twin Riveted Cornish Boilers
- **Boiler Bodies**:
  - Two massive horizontal cylindrical steam boilers: `cyl(32.0, 3.5, -14.0, radius 3.2, height 14.0, axis='z')` and `cyl(32.0, 3.5, 14.0, ...)` in `INK.BLACK`.
  - Overlapping riveted boiler plates with raised rivet heads in `INK.BLACK`.
- **Combustion Firebox Doors**:
  - Arched firebox doors at ground level: `box(32.0, 0.8, -6.5, 2.4, 1.8, 0.4)` in `INK.RED`.
  - Radiant amber heat glow lighting the lower catwalk floor.

### 7.2 Flanged Copper Steam Header Catwalks
High-pressure steam pipes engineered as elevated tightrope bridges:
- **Main Header Pipe**: Length $36.0\text{ m}$, `cyl(32.0, 10.0, 0, radius 0.65, height 36.0, axis='z')` in `INK.ORANGE`.
- **Top Walkway Surface**: Flattened steel grating strip of width $1.2\text{ m}$ mounted on top of the pipe at `y = 10.65\text{ m}`.
- **Bourdon Tube Pressure Dials**:
  - 3 giant circular brass pressure gauges of diameter $2.8\text{ m}$ mounted vertically along the wall with needles indicating boiler pressure.

---

## 8. Central Sector: The Clockmaker's Sanctuary & Balance Wheel Arbor

The central floor area between `x = -14.0 to 14.0, z = -14.0 to 14.0`:
- **The Balance Wheel Platform (`y = 0.0`)**:
  - A circular steel mesh deck of diameter $18.0\text{ m}$ surrounding the central pendulum trench.
  - Low handrail perimeter with brass stanchions in `INK.ORANGE`.
- **Tactical Prop Cover**:
  - Cast-Iron Gear Hoist Winch: `box(4.0, 0, 6.0, 2.2, 1.6, 1.8)` in `INK.BLACK`.
  - Lubricant Drum Trio: Three oil barrels of radius $0.6\text{ m}$, height $1.4\text{ m}$ in `INK.GREEN`.
  - Clockmaker's Workstation: Oak table with disassembled pinion gears, tweezers, and loupe eyepieces.

---

## 9. Overhead Traveling Monorail Hoist & Kinetic Grapple Traversal

### 9.1 The Electric Traveling Crane Monorail
An overhead motorized crane beam running North-South along the ceiling at `y = 34.0`:
- **Monorail I-Beam**:
  - Heavy steel girder spanning `z = -44.0 to 44.0` at `x = -4.0, y = 34.0`: `box(-4.0, 34.0, 0, 1.4, 1.8, 88.0)` in `INK.BLACK`.
- **Motorized Trolley & Hoist Hook**:
  - Trolley housing: `box(-4.0, 32.8, z(t), 3.2, 1.2, 2.8)` in `INK.BLUE`.
  - Suspended steel wire cable descending to `y = 22.0`.
  - Forged Steel Cargo Hook & Grapple Ring: `ring(-4.0, 21.5, z(t), 'x')` in `INK.ORANGE`.
- **Parametric Motion Equation**:
  $$Z(t) = 36.0 \cdot \sin(t \cdot 0.25)$$
  - Moves smoothly from the North Gear Train (`z = -36.0`) to the South Boilers (`z = 36.0`) every 25 seconds, allowing players to hitch a ride across the entire length of the facility!

---

## 10. Stairway Mathematics, Ship Ladders & Industrial Catwalks

All vertical stairways adhere strictly to swept-sphere character step physics ($0.35\text{ m}$ max step rise):

### 10.1 Main Boiler Catwalk Industrial Stairs
Connecting Ground Floor (`y = 0.0`) to Boiler Header Deck (`y = 6.0`):
- **Flight Specifications (21 steps)**:
  - Total Rise: $6.0\text{ m} / 21 = 0.2857\text{ m}$ per step.
  - Step Run: $0.45\text{ m}$.
  - Total Run: $9.45\text{ m}$.
  - Stair Width: $1.8\text{ m}$.
  - Slope Angle: $\arctan(0.2857 / 0.45) = 32.4^\circ$.
  - Placement: Starts at `(24.0, 0, 18.0)`, runs North to Landing at `(24.0, 6.0, 8.55)`.

### 10.2 West Piston Gallery Staggered Switchback Stairs
Connecting Ground Floor (`y = 0.0`) to Gear Beta Deck (`y = 12.0`):
- **Flight 1 (y = 0.0 to 6.0)**: Starts at `(-22.0, 0, -8.0)`, runs North in lane `x = -22.0`.
- **Intermediate Landing**: `slab(-24.0, -19.0, -20.0, -17.0, 6.0, 0.4)` in `INK.BLUE`.
- **Flight 2 (y = 6.0 to 12.0 - Staggered Lane)**:
  - **Staggered Lane Offset**: Shifted laterally to lane `x = -24.5` running South.
  - *Guarantees player's head never clips the underside of Flight 2!*

---

## 11. Solo vs. Arena Multiplayer Variations Matrix

| Feature | Solo Wave Survival (`!arena`) | Peer-to-Peer Arena Match (`arena`) |
| :--- | :--- | :--- |
| **Map Radius ($P$)** | $55\text{ m}$ ($110 \times 110\text{ m}$ total) | $68\text{ m}$ ($136 \times 136\text{ m}$ total) |
| **Boundary Height** | $24\text{ m}$ with invisible vertical blocker to $y = 58$ | $34\text{ m}$ perimeter industrial brick walls |
| **Sky Enclosure** | Sky lid at $y = 56$ + 6 Blue Gear Arches | $120\text{ m}$ Geodesic Dome with Red Escapement Keystone ($y=90$) |
| **Central Pit** | Open lethal gear abyss below $y = -4.0$ | **Safety Mesh Catch Grates** at $y = -2.0$ with thermal steam vents |
| **Gear Rotation** | Standard horological speeds | Accelerated combat speeds with dynamic platform shifts |
| **Suspended Platforms**| None | **5 Suspended Brass Balance Wheel Platforms** hung from dome |
| **Spawn System** | Fixed single player start at `(0, 0, 36.0)` | 16 distributed industrial arena spawns across all catwalks |

### 11.1 Arena Geodesic Dome & Suspended Horological Platforms
In multiplayer Arena matches, the sky is covered by a massive gear-tooth dome ($R = 120, C = -30$):
- 8 longitudinal Torus ribs rotated by $\pi / 8$ ($22.5^\circ$).
- 5 latitude rings at $y = 38, 54, 68, 80, 88$.
- Apex Escapement Keystone: radius $2.4$ at `(0, 90, 0)` in `INK.RED`.
- **5 Suspended Balance Wheel Platforms**:
  1. Center Zenith Overlook: `(0, 24.0, 0)`, size $8.0 \times 8.0\text{ m}$.
  2. Northwest Gear Beta Overlook: `(-28.0, 20.0, -22.0)`, size $6.0 \times 6.0\text{ m}$.
  3. Southeast Boiler Overlook: `(28.0, 20.0, 22.0)`, size $6.0 \times 6.0\text{ m}$.
  4. Northeast Crown Gear Overlook: `(24.0, 22.0, -32.0)`, size $5.0 \times 5.0\text{ m}$.
  5. Southwest Piston Gallery Overlook: `(-24.0, 22.0, 32.0)`, size $5.0 \times 5.0\text{ m}$.
  - Each platform hangs from the dome via an `INK.BLACK` steel cable and features an inverted orange grapple ring at `y - 1.3`.

---

## 12. Spawn Points, Sniper Perches & Item Pickups

### 12.1 Sniper Perches (`L.snipers`)
High-elevation tactical vantage points assigned to AI sniper units:
1. `(18.0, 18.5, -24.0)`: Gear Gamma Crown Rim.
2. `(-18.0, 12.5, -24.0)`: Gear Beta Northwest Arbor Balustrade.
3. `(0, 26.0, -32.0)`: Escapement Pallet Anchor Arch.
4. `(32.0, 10.65, 0)`: Flanged Copper Steam Header Walkway.
5. `(-32.0, 12.0, 0)`: Flyball Governor Platform.
6. `(0, 12.0, 6.0)`: Oscillating Pendulum Bob Apex (Dynamic).
7. `(-4.0, 32.8, 0)`: Traveling Crane Hoist Trolley (Dynamic).
8. `[-36.0, 8.0, -51.2]`: Northwest Perimeter Balcony.

### 12.2 Supply & Weapon Pickups (`L.pickups`)
1. Gear Train: `(0, 6.6, -12.0)` [Gear Alpha center], `(-18.0, 12.5, -24.0)` [Gear Beta deck], `(18.0, 18.5, -24.0)` [Gear Gamma deck].
2. Boiler Works: `(32.0, 3.5, 0)` [Between boilers], `(32.0, 10.65, -12.0)` [North steam header], `(32.0, 10.65, 12.0)` [South steam header].
3. Piston Gallery: `(-32.0, 4.0, 0)` [Governor base], `(-32.0, 0, -18.0)` [Cylinder 1 service pit], `(-32.0, 0, 18.0)` [Cylinder 2 service pit].
4. Center Floor: `(0, 0, 12.0)` [Clockmaker's desk], `(4.0, 0, 6.0)` [Gear hoist winch], `(-6.0, 0, 0)` [Balance wheel rim].
5. Catwalk Links: `(12.0, 6.0, 0)` [East transfer bridge], `(-12.0, 6.0, 0)` [West transfer bridge].

### 12.3 Symmetric Multiplayer Team Spawns (`L.teamSpawns`)
- **Red Team Spawns (North/West - Horological Mechanists)**:
  - `(-18.0, 12.5, -18.0)` (Gear Beta Assembly Deck)
  - `(-32.0, 0, -22.0)` (Piston Gallery Floor)
  - `(0, 6.6, -18.0)` (Gear Alpha North Perimeter)
  - `(-28.0, 6.0, 0)` (West Catwalk Mezzanine)
  - `(-10.0, 0, -32.0)` (Escapement Service Walkway)
- **Blue Team Spawns (South/East - Boilerworks Stokers)**:
  - `(32.0, 0, 22.0)` (Boiler Ash Floor)
  - `(32.0, 6.0, 0)` (Steam Header Landing)
  - `(0, 0, 28.0)` (South Clockmaker Courtyard)
  - `(24.0, 0, 8.0)` (East Catwalk Foot)
  - `(18.0, 6.0, 18.0)` (South Catwalk Mezzanine)

---

## 13. Level Designer Checklist & Anti-Bug Directives

1. **Gear Mesh & Pit Hazard Safety**:
   - The boundary below `y = -4.0` must instantly trigger lethal `killZ` resolution.
   - All rotating gear surfaces must utilize standard static floor colliders synchronized to their bounding boxes to prevent player physics vibration or slipping.
2. **Catwalk & Headroom Clearances**:
   - Minimum headroom beneath all overhead pipes and gears: $3.4\text{ m}$.
   - Catwalk doorway openings: Minimum width $2.2\text{ m}$, height $3.2\text{ m}$.
3. **Cover Height Hierarchy**:
   - Low Crouch Cover ($0.8\text{ m} - 1.2\text{ m}$): Lubricant oil drums, tool chests, pressure valve manifolds.
   - Chest Cover ($1.4\text{ m} - 1.6\text{ m}$): Piston crosshead guides, boiler firebox curbs, gear tooth blocks.
   - Full Occlusion ($2.4\text{ m} - 3.4\text{ m}$): Steam cylinder bodies, Cornish boiler shells, gear arbor columns.
4. **Continuous Flow Loops (No Dead Ends)**:
   - Gear Alpha: 3 entry points (stairway from ground, bridge from Gear Beta, grapple from overhead monorail).
   - Boiler Header Walkway: 2 escape routes (south stairs and north pipe slide).
   - Pendulum Pit: 4 grapple anchors allowing players to swing out of the trench from any orientation.
5. **Physics & Navigation Tagging Discipline**:
   - Apply `{ noNav: true }` to gear teeth edges, steam pipes, moving pendulum rods, and monorail hoist cables.
   - Apply `{ noGrapple: true }` to outer perimeter industrial walls and the sky containment ceiling.
   - Apply `{ noCollide: true }` to steam exhaust ink particles, pressure gauge dials, and gear lubrication decals.
