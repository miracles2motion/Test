# Pirate Galleon Shipwreck & Coral Reef: Comprehensive Map Architecture & Specification

A master structural, geometrical, and aesthetic blueprint for **Pirate Galleon Shipwreck & Coral Reef** (Map Key: `shipwreck_reef` / `galleon` / `shipwreck`), a monumental maritime battlefield combat arena set within a treacherous tidal lagoon drawn with oceanic indigo ink washes, turquoise coastal contours, weathered nautical parchment (`#faf3e0`), and 18th-century cartographic copperplate flourishes.

Featuring a sunken tidal lagoon sandbar ($Y=-1.8\text{m}$), a colossal 46-meter three-masted wooden pirate galleon ("The Black Corsair") shattered across a towering limestone sea stack, multi-level walkable gun decks ($Y=1.5\text{m}$ and $Y=4.8\text{m}$), an ornate 3-story stern castle with the captain's great cabin interior, curved catenary rope suspension bridges (`create3DSpline`), high crow's nest sniper perches ($Y=16.0\text{m}$), and kinetic ocean wave wash actors.

Designed using the exact mathematical standards, coordinate bounds, vertical step ratios, and traversal loops of **The Blueprint Castle** (`castle`) and **The Zen Garden** (`zen`), this specification establishes a flawless, uncompromised reference for implementing the shipwreck reef map in `src/level.js` without geometric inconsistencies, blind traps, or collision bugs.

---

## Table of Contents
1. [Spatial Coordinates & World Bounds](#1-spatial-coordinates--world-bounds)
2. [Aesthetic & Ink Material System](#2-aesthetic--ink-material-system)
3. [Perimeter Enclosure & Coastal Cliffs](#3-perimeter-enclosure--coastal-cliffs)
4. [Sector 1: The Stern Castle & Captain's Quarters (North)](#4-sector-1-the-stern-castle--captains-quarters-north)
5. [Sector 2: Impaled Bow Reef & Figurehead Spar (South)](#5-sector-2-impaled-bow-reef--figurehead-spar-south)
6. [Sector 3: Lower Gun Battery Deck & Powder Hold (West)](#6-sector-3-lower-gun-battery-deck--powder-hold-west)
7. [Sector 4: Limestone Sea Stack & Smuggler's Grotto (East)](#7-sector-4-limestone-sea-stack--smugglers-grotto-east)
8. [Central Sector: Keel Fracture, Skeletal Ribs & Mainmast (Center: X = 0, Z = 0)](#8-central-sector-keel-fracture-skeletal-ribs--mainmast-center-x--0-z--0)
9. [Overhead Rigging, Catenary Rope Bridges & Aerial Grapple Traversal](#9-overhead-rigging-catenary-rope-bridges--aerial-grapple-traversal)
10. [Stairway Mathematics, Modular Steps & Rest Landings](#10-stairway-mathematics-modular-steps--rest-landings)
11. [Solo vs. Arena Multiplayer Variations Matrix](#11-solo-vs-arena-multiplayer-variations-matrix)
12. [Spawn Points, Sniper Perches & Item Pickups](#12-spawn-points-sniper-perches--item-pickups)
13. [Level Designer Checklist & Anti-Bug Directives](#13-level-designer-checklist--anti-bug-directives)

---

## 1. Spatial Coordinates & World Bounds

The Pirate Galleon Shipwreck shares the exact Cartesian world grid as Doodle District, Blueprint Castle, and Zen Garden to ensure 100% engine compatibility:

- **Origin `(0, 0, 0)`**: The intersection of the ship's broken main oak keel beam and the waterline at the central limestone reef outcrop.
- **X-Axis (East-West / Port-Starboard)**:
  - Negative X (`-X`): **West / Port** (The Submerged Lower Gun Deck, Ballast Stone Mounds, Canted Keel Ledge).
  - Positive X (`+X`): **East / Starboard** (The Limestone Sea Stack Pinnacle, Smuggler's Cove, Natural Stone Arch).
- **Y-Axis (Elevation / Vertical Tiers)**:
  - `y = -1.8`: Sunken tidal lagoon sandbar floor and submerged kelp trench.
  - `y = -1.0 to 0.0`: Submerged seabed reef foundation slab.
  - `y = 0.0`: Waterline datum plane (frothing wave ripples and foam wash).
  - `y = 1.5`: Lower gun deck planking and exposed coral reef walking shelves.
  - `y = 4.8`: Main weather deck and forward forecastle deck (crouch cover plane).
  - `y = 7.8`: Elevated quarterdeck and poop deck rail.
  - `y = 10.5`: Captain's upper stern balcony and sea arch crest.
  - `y = 12.0`: Limestone sea stack natural summit plateau.
  - `y = 16.0`: Mainmast lower fighting top / crow's nest sniper perch.
  - `y = 22.0`: Apex of the snapped foremast and upper yardarm grapple rings.
  - `y = 30.0`: Upper nautical cartographic cloud boundary.
  - `y = 56.0`: Invisible sky containment lid (Solo mode).
  - `y = 88.0`: Geodesic navigation chart compass dome apex (Arena mode).
- **Z-Axis (North-South / Stern-Bow)**:
  - Negative Z (`-Z`): **North / Stern** (The Shattered Stern Castle, Great Cabin, and Rudder Gudgeon at `z = -42.0`).
  - Positive Z (`+Z`): **South / Bow** (The Impaled Bow Reef, Siren Figurehead, and Outer Shallows at `z = 42.0`).

### Boundary Envelopes
| Mode | Half-Span ($P$) | Total Dimensions | Wall Height ($PH$) | Wall Thickness ($T$) | Solo Player Start |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Solo Mode** | $55\text{ m}$ | $110 \times 110\text{ m}$ | $24\text{ m}$ | $6\text{ m}$ | `(0, 0.5, 42.0)` facing North (`-z`) |
| **Arena Mode** | $70\text{ m}$ | $140 \times 140\text{ m}$ | $32\text{ m}$ | $6\text{ m}$ | 16 Symmetrical Arena Spawns |

---

## 2. Aesthetic & Ink Material System

All geometry in Pirate Galleon Shipwreck is synthesized through an 18th-century nautical cartographic shader (`src/render.js`), set against aged nautical navigation chart paper (`#faf3e0`) with deep indigo hull washes and copperplate etching:

- **`INK.BLUE` (ID: 0 - Oceanic Indigo `#1d3557` & Water Contours)**:
  - Ocean depth sounding contours, tidal swell lines, and compass rhumb lines.
  - Weathered English oak ship hull planking, transom frames, and shattered timber knees.
  - Submerged reef trenches, deep water channels, and sea cave shadows.
- **`INK.BLACK` (ID: 2 - Cast Iron `#111215` & Naval Armaments)**:
  - Cast-iron 24-pounder naval cannons, cannonball pyramids, anchor chains.
  - Forged iron pintles, gudgeons, capstan pawls, and pirate skull-and-crossbones insignia.
  - Ship's wheel spokes, leaded-glass stern window mullions, and gunpowder barrel hoops.
- **`INK.ORANGE` (ID: 3 - Weathered Teak `#9c6644` & Manila Hemp Rigging)**:
  - Pitch-tarred teak deck planking, spruce masts, topgallant yardarms, and bowsprit spar.
  - Three-strand Manila hemp standing rigging, shroud ratlines, and catenary suspension ropes.
  - Brass binnacle compass cabinets, ship's bell, and copper hull sheathing plates.
  - Giant 30cm wooden drafting ruler bridges spanning broken deck gaps.
  - All interactive grapple rings and dynamic swinging rope anchors.
- **`INK.RED` (ID: 1 - Battle Ensign Crimson `#b7094c` & Powder Kegs)**:
  - Torn red Jolly Roger battle flags, crimson pennants, and danger firing arcs.
  - Highly volatile gunpowder keg hazard stamps (`DANGER - GUNPOWDER` in `INK.RED`).
  - Compass rose north cardinal arrow and warning beacon flares.
  - Arena Geodesic Dome central mariner's astrolabe keystone (`radius = 2.4` at `y = 90`).
- **`INK.GREEN` (ID: 4 - Reef Emerald `#2b9348` & Sea Flora)**:
  - Living brain coral heads, branching staghorn coral shelves, and kelp forests.
  - Verdigris copper lantern frames and mossy limestone sea cave ledges.

### 2.1 Thematic Prop Taxonomy (Detailing Tiers 1-4)
- **Tier 1 (Cover Props - 3-5 meshes each)**:
  - Heavy white oak rum casks (`cyl()` barrel + 4 `ring()` iron hoops). Provides $1.1\text{m}$ chest cover.
  - Pyramidal stacks of 24-pounder solid cast-iron cannonballs ($0.85\text{m}$ crouch cover) resting in timber shot-garlands.
  - Weathered canvas sail rolls tied with tarred marline twine, resting against gunwales.
  - Barnacle-encrusted wooden sea chests and ballast stone piles serving as non-colliding ground dressing.
- **Tier 2 (Tactical Furniture & Walkways - 5-10 meshes each)**:
  - Double-deck naval cannon batteries (8 operable 24-pounder cannons: `cyl()` bronze barrel + 4-wheeled wooden truck carriage + elevation wedge).
  - Heavy ship's capstan winch ($1.8\text{m}$ diameter, $1.2\text{m}$ height) with radial wooden handspikes.
  - 30cm wooden drafting ruler catwalk bridges spanning broken deck breaches with imperial nautical calibrations.
  - Captain's great cabin chart table with navigational dividers, sextants, and rolled parchment maps.
- **Tier 3 (Landmark Anchor Props - 10-20 meshes each)**:
  - The Ornate Carved Siren Figurehead protruding $6.5\text{m}$ forward from the shattered bow over the foaming surf.
  - The Limestone Karst Sea Stack Tower ($12.0\text{m}$ high) with natural eroded archway bridge and smuggler's cave grotto.
  - The Giant Hexagonal Brass Stern Lantern ($2.5\text{m}$ tall) mounted on the stern castle taffrail with an internal amber glow.
  - The 18-Meter Bowsprit Spar tightrope walkway extending out over the tidal shallows.
- **Tier 4 (Hero Centerpiece - 40-70 meshes)**:
  - The Monumental 46-Meter Three-Masted Wooden Pirate Galleon ("The Black Corsair"):
    - **Shattered Keel & Ribs**: Broken spine fractured across the limestone reef, exposing swept skeletal oak framing ribs (`splineTube`, `sweptRibbon`, $Y=-1.8\text{m}$ to $Y=4.8\text{m}$) forming a cathedral-like timber skeleton.
    - **The 3-Story Stern Castle**: Fully modeled architectural complex featuring lower steerage ($Y=1.5\text{m}$), Captain's Great Cabin ($8.0\text{m} \times 6.0\text{m} \times 2.8\text{m}$ at $Y=4.8\text{m}$), and upper poop deck ($Y=7.8\text{m}$) with leaded-glass stern gallery windows.
    - **The Great Mainmast ($Y=16.0\text{m}$)**: Colossal spruce mast ($1.8\text{m}$ diameter) carrying the octagonal timber fighting top crow's nest, snapped topmast dangling at $45^\circ$, and catenary rope suspension bridges.

---

## 3. Perimeter Enclosure & Coastal Cliffs

### 3.1 Ground Slab & Tidal Lagoon Bed
- **Monolithic Foundation**: Continuous seabed slab `box(0, -2.5, 0, 2*P + T, 1.0, 2*P + T)` in `INK.BLUE`.
- **Tidal Shallows & Sandbar Overlay**: Sandy seabed surface at `y = -1.8` with exposed coral reef shelves at `y = 0.0` to `y = 1.5`, featuring real-time foam wash particle ripples (`L.animated`).
- **Limestone Karst Sea Cliffs**:
  - Boundary cliffs of height $24.0\text{ m}$ (Solo) / $32.0\text{ m}$ (Arena), thickness $6.0\text{ m}$ in layered, chiseled limestone in `INK.BLUE` with weathered sea crevices and bird nesting ledges in `INK.GREEN`.
  - North Wall: `box(0, 0, -P, 2*P + T, PH, T)` in `INK.BLUE`.
  - South Wall: `box(0, 0, P, 2*P + T, PH, T)` in `INK.BLUE`.
  - West Wall: `box(-P, 0, 0, T, PH, 2*P + T)` in `INK.BLUE`.
  - East Wall: `box(P, 0, 0, T, PH, 2*P + T)` in `INK.BLUE`.

### 3.2 Anti-Camp Sky Containment (Solo Mode)
- **Invisible Vertical Boundary Blockers**: 4 perimeter colliders rising from `y = 24.0` to `y = 58.0`, tagged `{ noNav: true, noGrapple: true }`.
- **Sky Ceiling Lid**: `collider(0, 56.0, 0, 2*P + 40, 8.0, 2*P + 40, { noNav: true, noGrapple: true })`.
- **Nautical Chart Compass Ribs**:
  - Center: `(0, -20.0, 0)`, Radius: $R = 98.0\text{ m}$.
  - 8 arched navigational rhumb-line ribs in `INK.BLUE` radiating from the center.
  - 4 latitude degree rings at heights `y = 28.0, 42.0, 56.0, 70.0`.

### 3.3 Perimeter Ledges & Sea Cliff Shelves
8 elevated sniper and grapple platforms carved into the perimeter limestone cliffs:
1. `[-36.0, 7.5, -51.2, 8.0, 0.4, 2.4]`: Northwest Smuggler's Lookout Shelf.
2. `[36.0, 7.5, -51.2, 8.0, 0.4, 2.4]`: Northeast Sea Cave Upper Balcony.
3. `[-51.2, 8.0, -18.0, 2.4, 0.4, 8.0]`: West Barrier Reef Sniper Ledge.
4. `[-51.2, 8.0, 18.0, 2.4, 0.4, 8.0]`: West Coral Terrace Platform.
5. `[51.2, 8.0, -18.0, 2.4, 0.4, 8.0]`: East Sea Stack Climbing Ledge.
6. `[51.2, 8.0, 18.0, 2.4, 0.4, 8.0]`: East Smuggler Cache Balcony.
7. `[-24.0, 7.5, 51.2, 8.0, 0.4, 2.4]`: Southwest Outer Breaker Shelf.
8. `[24.0, 7.5, 51.2, 8.0, 0.4, 2.4]`: Southeast Coral Atoll Overlook.

### 3.4 Enemy Wave Spawn Portals
10 themed maritime pirate spawn portals for Solo survival waves:
- 2 Submerged Sea Cave Tunnels: `(-46.0, -1.8, -14.0)` and `(46.0, -1.8, -14.0)`.
- 2 Smuggler's Grotto Iron Gateways: `(38.0, 0.5, 18.0)` and `(38.0, 0.5, -18.0)`.
- 2 Stern Gallery Broken Window Breaches: `(-6.0, 4.8, -48.0)` and `(6.0, 4.8, -48.0)`.
- 2 Bow Reef Tidal Blow-Holes: `(-14.0, 0, 46.0)` and `(14.0, 0, 46.0)`.
- 2 Galleon Bilge Hold Keel Openings: `(-4.0, -1.5, 0)` and `(4.0, -1.5, 0)`.

---

## 4. Sector 1: The Stern Castle & Captain's Quarters (North)

A multi-tiered naval fortress situated between `x = -20.0 to 20.0, z = -48.0 to -24.0`:

### 4.1 The 3-Story Stern Castle Architecture
- **Three Stepped Wooden Decks**:
  - Lower Deck / Steerage (`y = 1.5`): Rudder post machinery, tiller ropes, and bread room barrels.
  - Main Deck / Captain's Great Cabin (`y = 4.8`): Grand stateroom ($8.0\text{m} \times 6.0\text{m} \times 2.8\text{m}$) enclosed by leaded-glass windows looking out over the north lagoon.
  - Upper Poop Deck (`y = 7.8`): Outdoor weather deck carrying the heavy double ship's wheel, binnacle brass housing, and brass swivel guns.
- **The Giant Brass Stern Lantern (Tier 3 Landmark)**:
  - Hexagonal brass lantern ($2.5\text{m}$ tall) at `(0, 9.5, -44.0)` glowing with internal amber candlelight.

### 4.2 Captain's Stateroom Interior & Tactical Ambush Cover
- Complete walkable interior accessible through shattered oak doors:
  - Mahogany chart table ($3.2\text{m} \times 1.8\text{m} \times 0.95\text{m}$) providing solid crouch-cover.
  - Hanging gimbal oil lamps swinging with dynamic ship sway physics (`L.animated`).
  - Iron-banded captain's treasure chest filled with gold ink doubloons and gemstones.

---

## 5. Sector 2: Impaled Bow Reef & Figurehead Spar (South)

A dramatic maritime shipwreck zone situated between `x = -20.0 to 20.0, z = 24.0 to 48.0`:

### 5.1 The Impaled Bow & Forecastle Deck
- **Bow Angle & Topography**:
  - The galleon's forward bow is impaled upward onto a jagged limestone reef at a $25^\circ$ angle, rising from $Y=1.5\text{m}$ to $Y=6.5\text{m}$ at the forecastle beakhead.
  - Cathead timber beams projecting outward carrying heavy forged iron anchors ($2.8\text{m}$ long).

### 5.2 The Siren Figurehead & 18-Meter Bowsprit Spar
- **The Siren Figurehead (Tier 3 Landmark)**:
  - Hand-carved sea siren figurehead in weathered white oak with an outstretched trident protruding forward to $Z=46.0\text{m}, Y=6.2\text{m}$.
- **The Bowsprit Spar Tightrope Walkway**:
  - Tapered spruce timber spar ($18.0\text{ m}$ length, $0.5\text{m}$ base diameter) extending over the churning tidal shallows.
  - Serves as an exposed, high-adrenaline sniper tightrope walk leading to an apex grapple ring at `(0, 8.5, 48.0)`.

---

## 6. Sector 3: Lower Gun Battery Deck & Powder Hold (West)

A claustrophobic combat deck situated between `x = -48.0 to -18.0, z = -22.0 to 22.0`:

### 6.1 The 8-Gun Battery Deck (`y = 1.5`)
- **Port Broadside Battery**:
  - A partially flooded gun deck carrying four operable 24-pounder bronze cannons poking through open square gunports.
  - Cannons rest on 4-wheeled oak carriages with rope recoil breeching tackle and elevation quoin wedges.
  - Wooden shot-garlands holding pyramids of black iron cannonballs ($0.85\text{m}$ crouch cover).

### 6.2 The Submerged Powder Magazine Hold (`y = -1.5`)
- Flooded bilge hold lined with copper sheathing and stacked gunpowder kegs marked with skull stencils.
- Piercing a powder keg detonates a concussive shockwave that shatters nearby timber bulkheads!

---

## 7. Sector 4: Limestone Sea Stack & Smuggler's Grotto (East)

A towering geological labyrinth situated between `x = 18.0 to 48.0, z = -22.0 to 22.0`:

### 7.1 The Limestone Sea Stack Pinnacle (`x = 32.0, z = 0`)
- **Karst Sea Stack Tower (Tier 3 Landmark)**:
  - Vertical eroded limestone spire rising from $Y=-1.8\text{m}$ to a flat summit plateau at $Y=12.0\text{m}$.
  - Carved with hand-hewn steps and resting ledges, providing an impregnable eastern sniper stronghold.
- **The Natural Limestone Arch Bridge**:
  - A sweeping eroded stone arch ($3.2\text{ m}$ wide) spanning $18.0\text{ m}$ from the sea stack summit across to the ship's shattered main deck at $Y=7.5\text{m}$.

### 7.2 The Smuggler's Grotto & Hidden Cache Cave
- A hollow cave grotto inside the base of the sea stack at $Y=0.5\text{m}$, stocked with rum barrels, canvas hammocks, and flintlock pistol racks.

---

## 8. Central Sector: Keel Fracture, Skeletal Ribs & Mainmast (Center: X = 0, Z = 0)

The shattered naval epicenter and vertical gravity well of the entire map:

### 8.1 The Broken Midships & Skeletal Hull Ribs
- **Keel Fracture Trench**:
  - The galleon's hull is broken clean in half across the central reef, creating an open water channel ($Y=-1.8\text{m}$) where players can swim or crouch-wade beneath the crossfire.
  - Massive curved oak framing ribs (`splineTube` and `sweptRibbon`, $0.4\text{m} \times 0.4\text{m}$ cross-section) rise from the keel like prehistoric ribcages, providing rhythmic $1.4\text{m}$ chest cover.

### 8.2 The Great Mainmast & Fighting Top Crow's Nest ($Y=16.0\text{m}$)
- **Hero Centerpiece Dimensions**:
  - Monumental spruce mainmast ($1.8\text{m}$ base diameter) stepped into the keel at $Y=-0.5\text{m}$ and soaring to $Y=24.0\text{m}$.
  - **The Main Fighting Top (Crow's Nest)**:
    - Octagonal timber platform ($3.8\text{m}$ diameter) at $Y=16.0\text{m}$ with rope-net railings, swivel gun pivot, and 360-degree aerial domination.
  - **The Snapped Topmast**:
    - Upper topmast snaps at $Y=18.0\text{m}$, dangling downward at a $45^\circ$ angle suspended by frayed rigging shrouds.

---

## 9. Overhead Rigging, Catenary Rope Bridges & Aerial Grapple Traversal

### 9.1 Catenary Suspension Rope Bridges
- Two swaying suspension footbridges constructed using `create3DSpline` catenary curves:
  - **Bridge Alpha**: Connects the Stern Castle ($Y=7.8\text{m}$) to the Mainmast Crow's Nest ($Y=16.0\text{m}$).
  - **Bridge Bravo**: Connects the Forecastle ($Y=5.5\text{m}$) to the East Limestone Sea Stack Summit ($Y=12.0\text{m}$).
  - Modeled with timber foot-planks, hemp guide ropes, and swaying kinetic physics (`L.animated`).

### 9.2 Giant 30cm Drafting Ruler Bridges
- Two oversized wooden drafting rulers ($0.45\text{m}$ wide, $12.0\text{m}$ long) spanning high gaps across the shattered midships deck with etched imperial nautical calibrations.

### 9.3 Aerial Grapple Point Network
- 18 precision grapple rings positioned along rigging stays and yardarms:
  - 4x Main yardarm yard ends at `y = 14.0\text{ m}`.
  - 2x Crow's nest perimeter hoops at `y = 16.5\text{ m}`.
  - 4x Limestone sea arch hanging stalactite anchors at `y = 13.0\text{ m}`.
  - 4x Broken mast shroud spreader bars at `y = 10.5\text{ m}`.
  - 4x Bowsprit martingale stays at `y = 5.5\text{ m}`.
- **Grapple Radial Clearance**: Every grapple anchor guarantees a minimum $2.0\text{ m}$ clear radial sphere free of geometry, safely exceeding the $1.5\text{ m}$ requirement.

---

## 10. Stairway Mathematics, Modular Steps & Rest Landings

All vertical ascents and descents strictly obey the universal architectural locomotion formula:

$$\text{Step Rise } = 0.25\text{m}, \quad \text{Step Run } = 0.48\text{m}, \quad \text{Clearance Corridor } \ge 2.2\text{m}$$

### Stairway Manifest
1. **Stern Castle Companionway Twin Stairs (North)**:
   - Twin companionway stairs (12 steps each) connecting the main weather deck (`y = 4.8`) to the poop deck (`y = 7.8`):
   - Step Rise: $3.0\text{ m} / 12 = 0.25\text{ m}$, Step Run: $0.48\text{ m}$.
   - Turned mahogany banister balusters in `INK.ORANGE` with non-slip grooved treads.
2. **Limestone Sea Stack Carved Stone Stairway (East)**:
   - Hand-hewn stone steps cut directly into the limestone rock face rising to $Y=12.0\text{m}$:
   - Flight 1: 12 steps ($3.0\text{ m}$ rise) to intermediate rest landing ($2.5\text{ m} \times 2.5\text{ m}$) at `y = 6.0`.
   - Flight 2: 12 steps ($3.0\text{ m}$ rise) to sea stack summit at `y = 12.0`.
3. **Gun Deck Companionway Ladder (West)**:
   - Ship's hold companionway steps connecting the sunken bilge hold (`y = -1.0`) to the lower gun deck (`y = 1.5`).

---

## 11. Solo vs. Arena Multiplayer Variations Matrix

| Feature | Solo Wave Survival (`!arena`) | Peer-to-Peer Arena Match (`arena`) |
| :--- | :--- | :--- |
| **Map Radius ($P$)** | $55\text{ m}$ ($110 \times 110\text{ m}$ total) | $70\text{ m}$ ($140 \times 140\text{ m}$ total) |
| **Boundary Height** | $24\text{ m}$ with invisible vertical blocker to $y = 58$ | $32\text{ m}$ perimeter limestone cliffs |
| **Sky Enclosure** | Chart ceiling lid at $y = 56$ + 8 Blue Rhumb Arches | $120\text{ m}$ Geodesic Mariner's Astrolabe Dome with Red Keystone ($y=90$) |
| **Ship Wreckage** | 1 Central Galleon Hull | 1 Galleon + 2 Beached Sloop Wrecks + Outer Sandbar |
| **Tidal Swell** | Gentle wave wash ($H = 0.4\text{m}$) | Dynamic tidal surge with shifting water levels ($H = 1.2\text{m}$) |
| **Suspended Platforms**| 2 Catenary Rope Bridges | **5 Suspended Crow's Nest Chandelier Platforms** hanging from dome |
| **Spawn System** | Fixed single player start at `(0, 0.5, 42.0)` | 16 distributed symmetrical arena spawns across all vertical tiers |

### 11.1 Arena Geodesic Dome & Suspended Maritime Platforms
In multiplayer Arena matches, the sky opens into a monumental mariner's astrolabe geodesic dome ($R = 120, C = -30$):
- 8 longitudinal navigational rhumb-line ribs in `INK.BLUE` rotated at $22.5^\circ$ intervals.
- 5 latitude degree rings at $y = 38, 54, 68, 80, 88$.
- Apex Keystone: Radius $2.4\text{ m}$ styled as a glowing brass astrolabe ring at `(0, 90, 0)` in `INK.RED`.
- **5 Suspended Crow's Nest Platforms**:
  1. Main Deck Center Overlook: `(0, 20.0, 0)`, size $7.0 \times 7.0\text{ m}$ styled as a suspended topsail yardarm.
  2. Northwest Stern Overlook: `(-22.0, 16.0, -24.0)`, size $5.5 \times 5.5\text{ m}$.
  3. Southeast Bow Reef Overlook: `(22.0, 16.0, 24.0)`, size $5.5 \times 5.5\text{ m}$.
  4. Northeast Sea Stack Overlook: `(24.0, 16.0, -24.0)`, size $5.0 \times 5.0\text{ m}$.
  5. Southwest Gun Deck Overlook: `(-22.0, 16.0, 24.0)`, size $5.0 \times 5.0\text{ m}$.
  - Each suspended platform hangs from the dome via tarred hemp Manila ropes in `INK.BLACK` with an inverted orange grapple ring at `y - 1.3`.

---

## 12. Spawn Points, Sniper Perches & Item Pickups

### 12.1 Sniper Vantage Perches (`L.snipers`)
Tactical high-elevation positions designated for precision sharpshooters:
1. `(0, 16.0, 0)`: Mainmast Crow's Nest (360-degree maritime lagoon domination).
2. `(32.0, 12.0, 0)`: East Limestone Sea Stack Summit Plateau.
3. `(0, 7.8, -42.0)`: Stern Castle Poop Deck Taffrail.
4. `(0, 8.5, 48.0)`: Bowsprit Spar Apex Tip.
5. `(32.0, 7.5, 8.0)`: Natural Sea Arch Bridge Crest.
6. `(-22.0, 4.8, 0)`: Port Gun Deck Roof Ledge.
7. `(0, 6.5, 34.0)`: Forecastle Beakhead Balcony.
8. `(36.0, 7.5, -36.0)`: Northeast Sea Cave Upper Overlook.

### 12.2 Tactical Pickups & Weapon Crates (`L.pickups`)
1. Crow's Nest: `(0, 16.0, 0)` [Inside lookout locker - Legendary Long-Range Flintlock Sniper].
2. Submerged Keel: `(0, -1.8, 0)` [Inside barnacle-encrusted treasure chest - Full Shield Core].
3. Captain's Cabin: `(0, 4.8, -36.0)` [On mahogany chart table - Oversized Medkit].
4. Gun Deck: `(-22.0, 1.5, 0)` [Between cannons 2 and 3 - Heavy Explosive Ammo Crate].
5. Smuggler's Grotto: `(22.0, 0.5, 12.0)` [Rum cask storage alcove - High-Capacity Drum Magazine].
6. Forecastle: `(0, 4.8, 24.0)` [Beside anchor windlass - Armor Shard].
7. Sea Stack: `(32.0, 12.0, 0)` [Stone summit cache - Precision Spyglass Optic].
8. Stern Rudder: `(0, 1.5, -46.0)` [Under rudder gudgeon - Grenade Satchel].

### 12.3 Symmetric Multiplayer Team Spawns (`L.teamSpawns`)
- **Red Team Spawns (North - Stern Castle & Captain's Sector)**:
  - `(0, 7.8, -40.0)` (Stern Castle Poop Deck)
  - `(-14.0, 4.8, -32.0)` (Captain's Stateroom Port Threshold)
  - `(14.0, 4.8, -32.0)` (Captain's Stateroom Starboard Threshold)
  - `(-8.0, 1.5, -24.0)` (Lower Steerage Deck West)
  - `(8.0, 1.5, -24.0)` (Lower Steerage Deck East)
- **Blue Team Spawns (South - Bow Reef & Tidal Sector)**:
  - `(0, 0.5, 44.0)` (Sandy Beachhead Reef Portal)
  - `(-14.0, 1.5, 34.0)` (West Tidal Shallows Shelf)
  - `(14.0, 1.5, 34.0)` (East Coral Terrace Shelf)
  - `(-6.0, 4.8, 22.0)` (Forecastle Approach Left)
  - `(6.0, 4.8, 22.0)` (Forecastle Approach Right)

---

## 13. Level Designer Checklist & Anti-Bug Directives

1. **Anti-Pinch Corridor & Chokepoint Verification**:
   - All gangways, gun decks, and sea cave corridors are verified $\ge 2.2\text{ m}$ wide, strictly exceeding the $1.8\text{ m}$ anti-pinch threshold.
   - Doorway thresholds through the Captain's Great Cabin and steerage bulkheads are verified at $2.4\text{ m}$ clear width.
2. **Water Hazard & Lagoon Fall Recovery**:
   - The sunken lagoon floor at `y = -1.8\text{m}` must never trap fallen players: 4 sloping sandbar ramps and 2 timber ladder nets provide immediate recovery back onto the ship's gun deck.
3. **Tactical Cover Height Hierarchy & Zero Empty Dead-Zones**:
   - Low Crouch Cover ($0.85\text{ m} - 0.95\text{ m}$): Cannonball shot-garlands, sea chests, ballast stones, brain coral domes.
   - Chest Cover ($1.1\text{ m} - 1.4\text{ m}$): Oak rum casks, capstan winches, cannon carriages, shattered deck bulwarks.
   - Full Occlusion ($2.2\text{ m} - 4.8\text{ m}$): Ship framing ribs, mast trunks, stern castle bulkheads, sea stack rock faces.
   - Every $15\text{ m} \times 15\text{ m}$ quadrant incorporates intermediate staging clutter (cargo nets, fallen spars, driftwood, kelp clusters) ensuring zero barren wastelands.
4. **0.3m Micro-Detail & Collision Tagging Discipline**:
   - Micro-details (cannon trunnions, rope knots, rigging belaying pins, barnacle shells, chart instruments) must be explicitly flagged with `{ noCollide: true }`.
   - Apply `{ noNav: true }` to thin catenary rope bridge handrails, bowsprit tightropes, and mast shroud ratlines.
   - Apply `{ noGrapple: true }` to the outer perimeter limestone cliff boundary walls and the sky containment ceiling.
5. **Dynamic Physics & Memory Allocations (`L.animated`)**:
   - All kinetic animations (wave foam wash, swinging catenary footbridges, flickering lanterns, sea spray particles) must update existing vertex buffers and matrices in-place.
   - Zero runtime heap memory allocations in animation loops to maintain a rock-solid 60 FPS.
6. **Universal Detailing Compliance**:
   - Audited against the Universal Detailing Standard to guarantee full Skeleton-Skin-Trim layering, complete ballpoint ink material mapping, and a concept detailing score of 12/12.
