# The Blueprint Castle: Comprehensive Map Architecture & Specification

A master structural, geometrical, and aesthetic blueprint for **The Blueprint Castle** (Map Key: `castle` / `blueprint`), an epic medieval fortification combat arena set within a monumental Norman stone fortress drawn with technical white drafting lines and cyan dimension callouts on deep Prussian blue architect's blueprint paper (`#0a1931`), featuring a multi-story Norman Donjon keep, perimeter curtain walls, fortified drum gatehouse, sunken dry moat, counterweight trebuchet, and subterranean sally port escape routes.

Designed using the exact mathematical standards, coordinate bounds, vertical step ratios, and traversal loops of **Doodle District** (`district`), this specification establishes a flawless reference for implementing the medieval blueprint map in `src/level.js` without geometric inconsistencies, blind traps, or collision bugs.

---

## Table of Contents
1. [Spatial Coordinates & World Bounds](#1-spatial-coordinates--world-bounds)
2. [Aesthetic & Ink Material System](#2-aesthetic--ink-material-system)
3. [Perimeter Enclosure & Dry Moat Boundaries](#3-perimeter-enclosure--dry-moat-boundaries)
4. [Sector 1: The Norman Grand Keep (Donjon) (North)](#4-sector-1-the-norman-grand-keep-donjon-north)
5. [Sector 2: The Gatehouse, Drawbridge & Portcullis (South)](#5-sector-2-the-gatehouse-drawbridge--portcullis-south)
6. [Sector 3: The Western Curtain Wall & Archer Bastions (West)](#6-sector-3-the-western-curtain-wall--archer-bastions-west)
7. [Sector 4: The Eastern Curtain Wall & Blacksmith's Forge (East)](#7-sector-4-the-eastern-curtain-wall--blacksmiths-forge-east)
8. [Central Sector: The Inner Bailey Courtyard & Siege Trebuchet](#8-central-sector-the-inner-bailey-courtyard--siege-trebuchet)
9. [Overhead Castle Hoardings, Flagstaffs & Aerial Grapple Traversal](#9-overhead-castle-hoardings-flagstaffs--aerial-grapple-traversal)
10. [Stairway Mathematics, Spiral Turrets & Ramparts](#10-stairway-mathematics-spiral-turrets--ramparts)
11. [Solo vs. Arena Multiplayer Variations Matrix](#11-solo-vs-arena-multiplayer-variations-matrix)
12. [Spawn Points, Sniper Perches & Item Pickups](#12-spawn-points-sniper-perches--item-pickups)
13. [Level Designer Checklist & Anti-Bug Directives](#13-level-designer-checklist--anti-bug-directives)

---

## 1. Spatial Coordinates & World Bounds

The Blueprint Castle shares the exact Cartesian world grid as Doodle District to ensure 100% engine compatibility:

- **Origin `(0, 0, 0)`**: The geographical center of the inner bailey cobblestone courtyard at ground level.
- **X-Axis (East-West)**:
  - Negative X (`-X`): **West** (The West Curtain Wall, Northwest Bastion, arrow loop gallery).
  - Positive X (`+X`): **East** (The East Curtain Wall, Blacksmith's Forge, Northeast Bastion).
- **Y-Axis (Elevation / Vertical Tiers)**:
  - `y = -4.0`: Sunken dry moat floor (`y = -4.0 to 0.0` dry moat trench).
  - `y = -1.0 to 0.0`: Courtyard cobblestone foundation slab.
  - `y = 0.0`: Inner Bailey ground level (Datum plane).
  - `y = 4.0`: Ground floor ceilings, sally port roof, lower forge awning.
  - `y = 7.0`: Curtain wall battlements & rampart wall-walks.
  - `y = 8.0`: Grand Keep First Floor (Great Banquet Hall).
  - `y = 12.0`: Gatehouse upper guardroom & archery slits.
  - `y = 16.0`: Grand Keep Second Floor (Royal Armory & Council Chamber).
  - `y = 20.0`: Corner Bastion turret rooftop battlements & hoardings.
  - `y = 24.0`: Grand Keep Rooftop battlements & machicolation floor.
  - `y = 32.0`: Grand Keep Watchtower Spire apex & heraldic flagstaff.
  - `y = 56.0`: Invisible sky containment lid (Solo).
  - `y = 88.0`: Geodesic architectural compass dome apex (Arena).
- **Z-Axis (North-South)**:
  - Negative Z (`-Z`): **North** (The Grand Keep Donjon at `z = -36.0`).
  - Positive Z (`+Z`): **South** (The Twin Drum Gatehouse & Drawbridge at `z = 36.0`).

### Boundary Envelopes
| Mode | Half-Span ($P$) | Total Dimensions | Wall Height ($PH$) | Wall Thickness ($T$) | Solo Player Start |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Solo Mode** | $55\text{ m}$ | $110 \times 110\text{ m}$ | $20\text{ m}$ | $6\text{ m}$ | `(0, 0, 24.0)` facing North (`-z`) |
| **Arena Mode** | $68\text{ m}$ | $136 \times 136\text{ m}$ | $32\text{ m}$ | $6\text{ m}$ | 16 Symmetrical Arena Spawns |

---

## 2. Aesthetic & Ink Material System

All geometry in The Blueprint Castle is rendered through a specialized technical architectural blueprint shader (`src/render.js`), featuring white structural drafting linework and cyan dimension annotations set against deep Prussian blue paper (`#0a1931`):

- **`INK.BLUE` (ID: 0 - Prussian Drafting Blue & Stone Masonry)**:
  - Primary castle ashlar stone walls, curtain walls, and round bastion masonry.
  - Keep massive pilaster buttresses and battered plinth foundations.
  - Perimeter containment walls and dry moat retaining escarpments.
- **`INK.WHITE` (ID: 6 / Default Linework - Architectural White Lines)**:
  - Masonry coursing joints, stone block borders, and cross-slit arrow loops.
  - Cartesian grid lines and 20-meter 32-point compass rose etched in the courtyard.
  - Architectural callouts, dimension lines, and scale markers (`1:100`).
- **`INK.ORANGE` (ID: 3 - Heavy Structural Timber & Bronze Accents)**:
  - Gatehouse heavy oak drawbridge and iron-banded timber gates.
  - Trebuchet counterweight pivoting throwing arm and winding winches.
  - Giant Wooden Drafting Ruler bridges spanning curtain wall gaps.
  - All interactive grapple rings and dynamic swinging anchors.
- **`INK.BLACK` (ID: 2 - Wrought Iron Hardware & Weapons)**:
  - Gatehouse spiked iron portcullis grille and suspension chains.
  - Weapon racks: Halberds, broadswords, chainmail suits, and crossbow bolts.
  - Trebuchet forged iron pivot axles and sling release trigger hooks.
  - Iron brazier stands and torch sconces.
- **`INK.RED` (ID: 1 - Royal Heraldic Crimson & Forge Fire)**:
  - Blacksmith forge glowing hearth charcoal and burning embers.
  - Heraldic castle banners, pennants, and shield crests.
  - Arena Geodesic Dome central architect's keystone (`radius = 2.4` at `y = 90`).
  - Red warning beacons on tower spires.
- **`INK.GREEN` (ID: 4 - Medieval Fiefdom Moss & Weathering)**:
  - Moisture moss creeping along the dry moat retaining walls.
  - Alchemical potion vials in the armory laboratory.

---

## 3. Perimeter Enclosure & Dry Moat Boundaries

### 3.1 The Sunken Dry Moat & Abatis Stakes
- **Moat Geometry**:
  - A continuous $10.0\text{ m}$ wide sunken dry moat encircling the castle walls from `y = -4.0 to 0.0`.
  - Escarpment (inner retaining wall): `box(x, -4.0, z, w, 4.0, d)` in `INK.BLUE`.
  - Counterscarp (outer retaining wall): `box(x, -4.0, z, w, 4.0, d)` in `INK.BLUE`.
- **Defensive Abatis Stakes**:
  - Rows of sharpened timber stakes `orientedCyl()` planted at $45^\circ$ angles along the moat floor in `INK.ORANGE`.
  - Hazard Mechanics: Landing on stakes inflicts 25 puncture damage; moat floor provides low-elevation flanking around the entire perimeter.
- **Perimeter Outer Walls**:
  - North Wall: `box(0, 0, -P, 2*P + T, PH, T)` in `INK.BLUE`.
  - South Wall: `box(0, 0, P, 2*P + T, PH, T)` in `INK.BLUE`.
  - West Wall: `box(-P, 0, 0, T, PH, 2*P + T)` in `INK.BLUE`.
  - East Wall: `box(P, 0, 0, T, PH, 2*P + T)` in `INK.BLUE`.

### 3.2 Anti-Camp Sky Containment (Solo Mode)
- **Invisible Vertical Wall Extensions**: 4 colliders rising from `y = 20.0` to `y = 58.0`, tagged `{ noNav: true, noGrapple: true }`.
- **Sky Ceiling Lid**: `collider(0, 56.0, 0, 2*P + 40, 8.0, 2*P + 40, { noNav: true, noGrapple: true })`.
- **Architectural Compass Torus Ribs**:
  - Center: `(0, -20.0, 0)`, Radius: $R = 98.0\text{ m}$.
  - 6 vertical semi-circular drafting ribs in `INK.BLUE` rotated at $30^\circ$ increments.
  - 4 latitude containment rings at heights `y = 30.0, 46.0, 60.0, 72.0`.

### 3.3 Perimeter Observation Balconies & Archer Shelves
8 elevated sniper and grapple platforms embedded into the perimeter boundary walls:
1. `[-38.0, 7.0, -51.2, 8.0, 0.4, 2.4]`: Northwest Moat Overlook Balcony.
2. `[38.0, 7.0, -51.2, 8.0, 0.4, 2.4]`: Northeast Donjon Archery Shelf.
3. `[-51.2, 7.0, -18.0, 2.4, 0.4, 8.0]`: West Sally Port Overlook.
4. `[-51.2, 7.0, 18.0, 2.4, 0.4, 8.0]`: West Outer Palisade Balcony.
5. `[51.2, 7.0, -18.0, 2.4, 0.4, 8.0]`: East Forge Supply Ledge.
6. `[51.2, 7.0, 18.0, 2.4, 0.4, 8.0]`: East Outer Barbican Shelf.
7. `[-24.0, 7.0, 51.2, 8.0, 0.4, 2.4]`: Southwest Drawbridge Approach Platform.
8. `[24.0, 7.0, 51.2, 8.0, 0.4, 2.4]`: Southeast Moat Drainage Ledge.

### 3.4 Enemy Wave Spawn Portals
10 medieval spawn portals for Solo survival waves:
- 2 Dry Moat Drainage Culverts: `(-42.0, -4.0, 0)` and `(42.0, -4.0, 0)`.
- 2 Subterranean Sally Port Tunnels: `(-22.0, -2.0, -36.0)` and `(22.0, -2.0, -36.0)`.
- 2 Gatehouse Murder Hole Vents: `(-6.0, 0, 48.0)` and `(6.0, 0, 48.0)`.
- 2 Keep Dungeon Iron Grate Vents: `(-12.0, 0, -48.0)` and `(12.0, 0, -48.0)`.
- 2 East Forge Coal Chute Openings: `(36.0, 0, 8.0)` and `(36.0, 0, 20.0)`.

---

## 4. Sector 1: The Norman Grand Keep (Donjon) (North)

The dominant vertical fortress anchor situated at `(0, 0, -36.0)`:

### 4.1 Donjon Architecture & Battered Plinth Base
- **Footprint**: Width $32.0\text{ m}$ (`x = -16.0 to 16.0`), Depth $24.0\text{ m}$ (`z = -48.0 to -24.0`).
- **Battered Stone Plinth (`y = 0.0 to 4.0`)**:
  - Outward-sloping ashlar stone base at $45^\circ$ angle: `box(0, 0, -36.0, 34.0, 4.0, 26.0)` in `INK.BLUE`.
- **4 Corner Pilaster Buttresses**:
  - Vertical square masonry piers `box(x, 0, z, 3.2, 24.0, 3.2)` at the four keep corners.
- **Three Internal Habitable Stories**:
  - Ground Floor Undercroft (`y = 0.0`): Barrel-vaulted stone storehouse with grain sacks and ale casks.
  - First Floor Great Hall (`y = 8.0`): `slab(-15.0, -47.0, 15.0, -25.0, 8.0, 0.4)` in `INK.BLUE`.
    - Features a massive $6.0\text{ m}$ stone hearth fireplace with burning embers in `INK.RED`.
    - Open hammerbeam ceiling trusses spanning overhead.
  - Second Floor Royal Armory (`y = 16.0`): Weapon display cases and council conference table.
- **Rooftop Battlements & Machicolations (`y = 24.0`)**:
  - Slab: `slab(-15.0, -47.0, 15.0, -25.0, 24.0, 0.4)` in `INK.BLUE`.
  - Crenellated Merlons: 18 stone battlements of height $1.4\text{ m}$ with central arrow slits.
  - Cantilevered Floor Murder Holes: Floor openings allowing defenders to drop grenades directly onto invaders below!
  - Watchtower Turret Spire: Corner tower ascending to `y = 32.0` with heraldic pennant flagstaff and grapple ring `ring(14.0, 32.5, -46.0, 'y')`.

---

## 5. Sector 2: The Gatehouse, Drawbridge & Portcullis (South)

The fortified southern gateway situated at `(0, 0, 36.0)`:

### 5.1 Twin Semicircular Drum Towers
- Two massive cylindrical drum towers flanking the entrance corridor:
  - West Drum Tower: `cyl(-8.0, 0, 36.0, radius 4.5, height 14.0)` in `INK.BLUE`.
  - East Drum Tower: `cyl(8.0, 0, 36.0, radius 4.5, height 14.0)` in `INK.BLUE`.
  - Upper battlements at `y = 14.0` with arrow loops commanding the south approach.

### 5.2 The Heavy Oak Drawbridge & Iron Portcullis
- **The Drawbridge**:
  - Heavy iron-banded timber bridge spanning the dry moat from `z = 36.0` to `z = 48.0`:
  - Deck: Length $12.0\text{ m}$, Width $3.6\text{ m}$, Thickness $0.5\text{ m}$ at `y = 0.0` in `INK.ORANGE`.
  - Stud-link iron suspension chains angled back to the upper gatehouse winches in `INK.BLACK`.
- **The Spiked Iron Portcullis**:
  - Vertical iron lattice grille `box(0, 0.8, 36.0, 3.2, 3.6, 0.2)` in `INK.BLACK`.
  - **Tactical Ambush Clearance**: The portcullis rests halfway open at height $0.9\text{ m}$!
  - *Forces players to execute a tactical crouch-slide to breach the inner courtyard, creating a thrilling ambush choke point!*

---

## 6. Sector 3: The Western Curtain Wall & Archer Bastions (West)

Stationed at `x = -16.0` connecting the keep directly to the gatehouse outer walls:
- **Curtain Wall Dimensions**: Length $60.0\text{ m}$ (`z = -24.0 to 36.0`), Width $3.0\text{ m}$, Height $7.0\text{ m}$ in `INK.BLUE`.
- **Rampart Wall-Walk (`y = 7.0`)**:
  - Flat stone walkway of width $2.2\text{ m}$ running the entire length.
  - Outer crenellated parapet: Height $1.4\text{ m}$ with 12 embrasures.
  - Inner safety rail: $0.9\text{ m}$ wrought-iron rail in `INK.BLACK`.
- **Northwest Corner Bastion (`-16.0, 0, -24.0`)**:
  - D-shaped bastion tower of diameter $8.0\text{ m}$ rising to `y = 12.0`.
  - Contains an interior spiral staircase connecting ground to rampart level.

---

## 7. Sector 4: The Eastern Curtain Wall & Blacksmith's Forge (East)

Stationed at `x = 16.0` balancing fortress defense with artisanal production:
- **East Curtain Wall**: Identical $7.0\text{ m}$ high stone rampart extending (`z = -24.0 to 36.0`) with wall-walk at `y = 7.0`.
- **The Open-Timber Blacksmith's Forge (`x = 20.0, z = 4.0`)**:
  - Timber Post Awning: 4 square posts supporting a cedar-shake shed roof at `y = 4.2`.
  - Stone Forge Hearth: `box(20.0, 0, 4.0, 3.2, 1.2, 2.4)` in `INK.BLUE` with glowing coals in `INK.RED`.
  - Giant Cast-Iron Anvil: `box(18.0, 0.8, 4.0, 1.2, 0.8, 0.6)` in `INK.BLACK` mounted on an oak tree stump.
  - Water Quenching Trough: `box(18.0, 0, 6.0, 1.2, 0.8, 2.2)` filled with dark ink water.

---

## 8. Central Sector: The Inner Bailey Courtyard & Siege Trebuchet

The open combat arena between `x = -16.0 to 16.0, z = -18.0 to 22.0`:

### 8.1 The Full-Scale Counterweight Siege Trebuchet
Positioned in the center of the bailey at `(0, 0, 2.0)`:
- **Heavy Timber A-Frame Chassis**:
  - Triangular oak trusses: Height $8.5\text{ m}$, Base $6.0\text{ m} \times 8.0\text{ m}$ in `INK.ORANGE`.
- **The Pivoting Throwing Arm**:
  - Heavy tapered beam of length $14.0\text{ m}$, pivoting at `y = 6.8`.
  - Counterweight Box: Heavy wooden hopper loaded with crushed stones at `(0, 3.5, 4.5)` in `INK.BLUE`.
  - Accessible Throwing Arm Ramp: Players can sprint up the sloped arm to reach an elevated sniper vantage point at `y = 9.5`!
  - Arm Tip Grapple Ring: `ring(0, 9.8, -3.0, 'z')` in `INK.ORANGE`.

### 8.2 Courtyard Supply Barricades
- Giant Wooden Ruler Bridge: A 30cm drafting ruler connecting the West Rampart `(-14.5, 7.0, 0)` across to the Trebuchet frame.
- Iron-Banded Shield Pavises: 4 tall wooden archer shields providing $1.6\text{ m}$ chest-high cover across the cobblestones.

---

## 9. Overhead Castle Hoardings, Flagstaffs & Aerial Grapple Traversal

### 9.1 Cantilevered Timber Hoardings
Covered wooden galleries projecting outward from the tops of the stone battlements:
- Supported by diagonal timber corbels extending $1.8\text{ m}$ over the dry moat.
- Slotted timber floor providing vertical murder holes for shooting down into the moat.
- Continuous running loop allowing players to sprint along the exterior perimeter.

---

## 10. Stairway Mathematics, Spiral Turrets & Ramparts

All castle stairways adhere strictly to swept-sphere character step physics ($0.35\text{ m}$ max step rise):

### 10.1 Northwest Bastion Helical Spiral Staircase
Connecting Courtyard Ground (`y = 0.0`) to Ramparts (`y = 7.0`) and Bastion Roof (`y = 12.0`):
- **Continuous Helical Ascent (24 steps for 7.0m rise)**:
  - Step Rise: $7.0\text{ m} / 24 = 0.2916\text{ m}$.
  - Step Angle Increment: $\Delta \theta = 15^\circ$ per step around central newel pillar `cyl(x, 0, z, radius 0.4)`.
  - Step Tread Width: $1.4\text{ m}$ (outer radius $1.8\text{ m}$).
  - *Engineers clockwise ascent giving right-handed sword-defenders the advantage!*

### 10.2 Grand Keep Forebuilding Grand Staircase
External ceremonial stone stairway ascending to the Keep First Floor entrance:
- **Flight Specifications (28 steps)**:
  - Height Rise: $8.0\text{ m} / 28 = 0.2857\text{ m}$.
  - Step Run: $0.45\text{ m}$.
  - Total Run: $12.6\text{ m}$.
  - Stair Width: $2.4\text{ m}$.
  - Slope Angle: $32.4^\circ$.
  - Placement: Starts at `(-16.0, 0, -22.0)`, runs North along the keep face arriving at landing `(-16.0, 8.0, -9.4)`.

---

## 11. Solo vs. Arena Multiplayer Variations Matrix

| Feature | Solo Wave Survival (`!arena`) | Peer-to-Peer Arena Match (`arena`) |
| :--- | :--- | :--- |
| **Map Radius ($P$)** | $55\text{ m}$ ($110 \times 110\text{ m}$ total) | $68\text{ m}$ ($136 \times 136\text{ m}$ total) |
| **Boundary Height** | $20\text{ m}$ with invisible vertical blocker to $y = 58$ | $32\text{ m}$ perimeter stone walls |
| **Sky Enclosure** | Sky lid at $y = 56$ + 6 Blue Compass Arches | $120\text{ m}$ Geodesic Dome with Red Architect Keystone ($y=90$) |
| **Portcullis State** | Halfway lowered ($0.9\text{ m}$ crouch gap) | Fully raised ($3.6\text{ m}$ open breach) |
| **Trebuchet Arm**| Static elevated sniper ramp | Dynamic swinging counterweight launching players |
| **Suspended Platforms**| None | **5 Suspended Iron Chandelier Platforms** hung from dome |
| **Spawn System** | Fixed single player start at `(0, 0, 24.0)` | 16 distributed medieval arena spawns across all tiers |

### 11.1 Arena Geodesic Dome & Suspended Chandelier Platforms
In multiplayer Arena matches, the sky is covered by a massive compass rose dome ($R = 120, C = -30$):
- 8 longitudinal Torus ribs rotated by $\pi / 8$ ($22.5^\circ$).
- 5 latitude rings at $y = 38, 54, 68, 80, 88$.
- Apex Keystone: radius $2.4$ at `(0, 90, 0)` in `INK.RED`.
- **5 Suspended Iron Chandelier Platforms**:
  1. Center Bailey Overlook: `(0, 22.0, 0)`, size $8.0 \times 8.0\text{ m}$.
  2. Northwest Keep Overlook: `(-22.0, 18.0, -24.0)`, size $6.0 \times 6.0\text{ m}$.
  3. Southeast Forge Overlook: `(22.0, 18.0, 24.0)`, size $6.0 \times 6.0\text{ m}$.
  4. Northeast Rampart Overlook: `(24.0, 18.0, -24.0)`, size $5.0 \times 5.0\text{ m}$.
  5. Southwest Gatehouse Overlook: `(-22.0, 18.0, 24.0)`, size $5.0 \times 5.0\text{ m}$.
  - Each platform hangs from the dome via an `INK.BLACK` chain and features an inverted orange grapple ring at `y - 1.3`.

---

## 12. Spawn Points, Sniper Perches & Item Pickups

### 12.1 Sniper Perches (`L.snipers`)
High-elevation tactical vantage points assigned to AI sniper units:
1. `(14.0, 32.0, -46.0)`: Grand Keep Watchtower Spire.
2. `(0, 24.0, -36.0)`: Grand Keep Main Roof Machicolation Center.
3. `(-8.0, 14.0, 36.0)`: West Gatehouse Drum Tower Battlement.
4. `(8.0, 14.0, 36.0)`: East Gatehouse Drum Tower Battlement.
5. `(-16.0, 7.0, 0)`: West Curtain Wall Center Merlon.
6. `(16.0, 7.0, 0)`: East Curtain Wall Center Merlon.
7. `(0, 9.5, -3.0)`: Trebuchet Throwing Arm Tip.
8. `[-38.0, 7.0, -51.2]`: Northwest Moat Overlook Balcony.

### 12.2 Supply & Weapon Pickups (`L.pickups`)
1. Grand Keep: `(0, 8.0, -36.0)` [Great Hall table], `(0, 16.0, -36.0)` [Armory weapon chest], `(0, 0, -36.0)` [Dungeon vault].
2. Gatehouse: `(0, 12.0, 36.0)` [Guardroom table], `(0, 0, 36.0)` [Portcullis passage], `(0, 0, 48.0)` [Drawbridge outer deck].
3. Courtyard: `(0, 0, 2.0)` [Trebuchet base], `(18.0, 0.8, 4.0)` [Forge anvil], `(-12.0, 0, 0)` [Courtyard supply cart].
4. Ramparts: `(-16.0, 7.0, -12.0)` [Northwest wall-walk], `(16.0, 7.0, 12.0)` [Southeast wall-walk].
5. Dry Moat: `(0, -4.0, 42.0)` [Under drawbridge], `(-32.0, -4.0, 0)` [West moat stake field].

### 12.3 Symmetric Multiplayer Team Spawns (`L.teamSpawns`)
- **Red Team Spawns (North - Castle Garrison)**:
  - `(0, 8.0, -32.0)` (Keep Great Hall Threshold)
  - `(0, 24.0, -36.0)` (Keep Rooftop Battlements)
  - `(-16.0, 7.0, -20.0)` (Northwest Ramparts)
  - `(-12.0, 0, -18.0)` (Bailey Undercroft Entry)
  - `(16.0, 0, -28.0)` (East Sally Port Corridor)
- **Blue Team Spawns (South - Besieging Army)**:
  - `(0, 0, 48.0)` (Drawbridge Outer Terminal)
  - `(0, 12.0, 36.0)` (Gatehouse Battlement Deck)
  - `(16.0, 7.0, 20.0)` (Southeast Ramparts)
  - `(0, 0, 18.0)` (South Bailey Courtyard)
  - `(20.0, 0, 8.0)` (Blacksmith Forge Yard)

---

## 13. Level Designer Checklist & Anti-Bug Directives

1. **Moat Hazard & Fall Recovery**:
   - The dry moat floor at `y = -4.0` must never trap players. Provide stone stairs at `(-16.0, -4.0, -24.0)` and `(16.0, -4.0, -24.0)` leading back up to courtyard level.
2. **Doorways & Headroom Clearances**:
   - Keep Great Hall entrance: Width $3.0\text{ m}$, height $3.4\text{ m}$.
   - Portcullis half-drop clearance: Exactly $0.9\text{ m}$ (enforces crouch-slide without head snagging).
   - Interior floor clearances: Minimum $3.6\text{ m}$ between stone slabs.
3. **Cover Height Hierarchy**:
   - Low Crouch Cover ($0.8\text{ m} - 1.2\text{ m}$): Blacksmith water trough, fallen stone ashlar blocks, weapon chests.
   - Chest Cover ($1.4\text{ m} - 1.6\text{ m}$): Crenellated merlons, archer pavise shields, forge hearth.
   - Full Occlusion ($2.4\text{ m} - 3.4\text{ m}$): Keep pilaster buttresses, gatehouse drum walls, timber hoarding screens.
4. **Continuous Flow Loops (No Dead Ends)**:
   - Keep Rooftop: 3 access routes (spiral stairs, exterior forebuilding stairs, grapple ring to spire).
   - Curtain Walls: Continuous unbroken loop around the bailey with connections to both gatehouse and keep.
   - Subterranean Sally Port: Connects the inner keep undercroft straight out to the dry moat floor.
5. **Physics & Navigation Tagging Discipline**:
   - Apply `{ noNav: true }` to thin battlements, trebuchet throwing arm, hoist chains, and dry moat abatis stakes.
   - Apply `{ noGrapple: true }` to the outer perimeter boundary walls and the sky containment ceiling.
   - Apply `{ noCollide: true }` to architectural dimension callout lines, compass rose decals, and burning forge smoke.
