# The Ink Seas: Comprehensive Map Architecture & Specification

A master structural, geometrical, and aesthetic blueprint for **The Ink Seas** (Map Key: `seas` / `pirates`), an epic high-seas naval tactical combat arena set across two colossal wooden sailing warships locked in close-quarters broadside grappling, surrounded by an undulating ocean of dark Prussian blue ink and sea-monster wreckage drawn on watermarked cartridge parchment.

Designed using the exact mathematical standards, coordinate bounds, vertical step ratios, and traversal loops of **Doodle District** (`district`), this specification establishes a flawless reference for implementing the naval combat map in `src/level.js` without geometric inconsistencies, blind traps, or collision bugs.

---

## Table of Contents
1. [Spatial Coordinates & World Bounds](#1-spatial-coordinates--world-bounds)
2. [Aesthetic & Ink Material System](#2-aesthetic--ink-material-system)
3. [Perimeter Enclosure & Ocean Boundaries](#3-perimeter-enclosure--ocean-boundaries)
4. [Sector 1: The Crimson Galleon "El Dorado" (West)](#4-sector-1-the-crimson-galleon-el-dorado-west)
5. [Sector 2: The Royal Navy Clipper "Invincible" (East)](#5-sector-2-the-royal-navy-clipper-invincible-east)
6. [Sector 3: The Shattered Mainmast Boarding Bridge & Flotsam (Center)](#6-sector-3-the-shattered-mainmast-boarding-bridge--flotsam-center)
7. [Sector 4: The Kraken's Wrath & Coral Outcroppings (North & South)](#7-sector-4-the-krakens-wrath--coral-outcroppings-north--south)
8. [Central Sector: The Sunken Cargo Trench & Waterlogged Drifts](#8-central-sector-the-sunken-cargo-trench--waterlogged-drifts)
9. [Overhead Rigging, Fighting Tops & Aerial Swing Traversal](#9-overhead-rigging-fighting-tops--aerial-swing-traversal)
10. [Stairway Mathematics, Companionway Ladders & Hull Slopes](#10-stairway-mathematics-companionway-ladders--hull-slopes)
11. [Solo vs. Arena Multiplayer Variations Matrix](#11-solo-vs-arena-multiplayer-variations-matrix)
12. [Spawn Points, Sniper Perches & Item Pickups](#12-spawn-points-sniper-perches--item-pickups)
13. [Level Designer Checklist & Anti-Bug Directives](#13-level-designer-checklist--anti-bug-directives)

---

## 1. Spatial Coordinates & World Bounds

The Ink Seas shares the exact Cartesian world grid as Doodle District to ensure 100% engine compatibility:

- **Origin `(0, 0, 0)`**: The geographical center of the open water channel between the two ships at ocean sea level.
- **X-Axis (East-West)**:
  - Negative X (`-X`): **West** (The Crimson Galleon "El Dorado", port quarterdeck, captain's cabin).
  - Positive X (`+X`): **East** (The Royal Navy Clipper "Invincible", starboard weather deck, clipper bow).
- **Y-Axis (Elevation / Vertical Tiers)**:
  - `y = -4.0`: Ocean floor & bilge water line (`killZ` water hazard threshold).
  - `y = -1.0 to 0.0`: Undulating ink wave surface datum level.
  - `y = 1.2`: Lower gun decks (cannon ports, powder magazines).
  - `y = 4.0`: Main weather decks & cargo hatch gratings.
  - `y = 6.8`: Forecastle deck (forward bow) & quarterdeck staging.
  - `y = 8.5`: Poop deck roof, captain's great cabin roof & helm platform.
  - `y = 14.0`: Lower yardarms & fighting tops tier 1 (sniper perches).
  - `y = 24.0`: Intermediate tops & topgallant yardarms.
  - `y = 34.0`: Mainmast crow's nests (premier vertical vantage points).
  - `y = 48.0`: Main skysail masthead cap & wind-vane pennants.
  - `y = 56.0`: Invisible sky containment lid (Solo).
  - `y = 88.0`: Geodesic typhoon compass dome apex (Arena).
- **Z-Axis (North-South)**:
  - Negative Z (`-Z`): **North** (Bowsprits, anchor hawse pipes, Kraken tentacle reach at `z = -46`).
  - Positive Z (`+Z`): **South** (Stern galleries, gilded transoms, rudder assemblies at `z = 46`).

### Boundary Envelopes
| Mode | Half-Span ($P$) | Total Dimensions | Wall Height ($PH$) | Wall Thickness ($T$) | Solo Player Start |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Solo Mode** | $55\text{ m}$ | $110 \times 110\text{ m}$ | $18\text{ m}$ | $6\text{ m}$ | `(-24.0, 4.0, 36.0)` facing North (`-z`) |
| **Arena Mode** | $68\text{ m}$ | $136 \times 136\text{ m}$ | $30\text{ m}$ | $6\text{ m}$ | 16 Symmetrical Arena Spawns |

---

## 2. Aesthetic & Ink Material System

All geometry in The Ink Seas is synthesized through procedural ballpoint pen and watercolor hatching (`src/render.js`), set against fibrous parchment with aged water stains and calligraphic cartographic compass roses:

- **`INK.BLUE` (ID: 0 - Deep Prussian Ocean & Clipper Hull)**:
  - Royal Navy Clipper "Invincible" outer lapstrake hull planks.
  - Wave crest geometries and undulating ink breakers.
  - Navy sailor uniform accents and sea officer cocked hats.
  - Perimeter containment storm walls.
- **`INK.RED` (ID: 1 - Crimson Buccaneer Lacquer)**:
  - Crimson Galleon "El Dorado" upper bulwarks and carved stern gallery.
  - Pirate jolly roger flags and blood-red ensigns.
  - Arena Geodesic Dome tempest eye keystone (`radius = 2.4` at `y = 90`).
  - Powder magazine explosive rum barrels.
- **`INK.ORANGE` (ID: 3 - Seasoned Oak, Teak & Brass Hardware)**:
  - Solid teak deck planking with tarred pitch caulking lines.
  - Ship helms, brass binnacle compasses, and ship belfries.
  - Giant Wooden Ruler boarding planks connecting the vessels.
  - All interactive rigging grapple rings and swinging boom anchors.
- **`INK.BLACK` (ID: 2 - Cast-Iron Ordnance & Standing Rigging)**:
  - 24-pounder naval smoothbore cannon barrels and trunnions.
  - Heavy wrought-iron anchor flukes and hawse chains.
  - Shrouds, climbable rope ratlines, stays, and halyards.
  - Cannonball pyramids and gunport iron portcullises.
- **`INK.GREEN` (ID: 4 - Kraken Emerald & Sea Moss)**:
  - The 4 colossal Kraken tentacles coiling around the ship hulls.
  - Seaweed-encrusted coral barrier reefs and barnacle clusters.
  - Glass rum bottles and apothecary lanterns.
- **`INK.PINK` (ID: 5 - Rubber Stationery Flotsam)**:
  - Giant pink bevelled eraser ship fenders hung over the ship gunwales.
  - Cork lifebuoys and sealed message-bottle sealing wax.

---

## 3. Perimeter Enclosure & Ocean Boundaries

### 3.1 The Undulating Ink Ocean Surface & Hazard Triggers
- **Ocean Plane**: A continuous expanse of 120 intersecting triangular wave crests in `INK.BLUE` centered at `y = -1.0`:
  - Top elevation fluctuates dynamically between `y = -1.4` and `y = -0.4`.
  - Waterlogged Physics: Players falling into the water experience a $40\%$ movement speed penalty and take continuous ink drowning damage if submerged below `y = -2.5` for over 5 seconds.
- **Perimeter Storm Walls**:
  - North Wall: `box(0, 0, -P, 2*P + T, PH, T)` in `INK.BLUE`.
  - South Wall: `box(0, 0, P, 2*P + T, PH, T)` in `INK.BLUE`.
  - West Wall: `box(-P, 0, 0, T, PH, 2*P + T)` in `INK.BLUE`.
  - East Wall: `box(P, 0, 0, T, PH, 2*P + T)` in `INK.BLUE`.

### 3.2 Anti-Camp Sky Containment (Solo Mode)
- **Invisible Vertical Storm Extensions**: 4 colliders starting at `y = 18.0`, height $40.0\text{ m}$ (reaching `y = 58.0`), tagged `{ noNav: true, noGrapple: true }`.
- **Sky Ceiling Lid**: `collider(0, 56.0, 0, 2*P + 40, 8.0, 2*P + 40, { noNav: true, noGrapple: true })`.
- **Maritime Compass Torus Ribs**:
  - Center: `(0, -20.0, 0)`, Radius: $R = 98.0\text{ m}$.
  - 6 vertical semi-circular nautical ribs in `INK.BLUE` rotated at $30^\circ$ increments.
  - 4 latitude navigation rings at heights `y = 30.0, 46.0, 60.0, 72.0`.

### 3.3 Perimeter Ledges & Sea Cliff Perches
8 elevated sniper and grapple platforms embedded into the boundary storm walls:
1. `[-42.0, 6.0, -51.2, 8.0, 0.4, 2.4]`: Northwest Coral Reef Outcropping.
2. `[42.0, 6.0, -51.2, 8.0, 0.4, 2.4]`: Northeast Shipwreck Shoal Shelf.
3. `[-51.2, 8.0, -20.0, 2.4, 0.4, 8.0]`: West Sea Fortress Bastion Ledge.
4. `[-51.2, 8.0, 20.0, 2.4, 0.4, 8.0]`: West Smuggler's Cove Lookout.
5. `[51.2, 8.0, -20.0, 2.4, 0.4, 8.0]`: East Admiral's Signal Platform.
6. `[51.2, 8.0, 20.0, 2.4, 0.4, 8.0]`: East Coastal Watchtower Platform.
7. `[-30.0, 6.0, 51.2, 8.0, 0.4, 2.4]`: Southwest Drifting Cargo Raft.
8. `[30.0, 6.0, 51.2, 8.0, 0.4, 2.4]`: Southeast Lighthouse Base Ledge.

### 3.4 Enemy Wave Spawn Portals
10 maritime spawn portals for Solo survival waves:
- 2 Galleon Lower Gunport Hatches: `(-28.0, 1.2, -18.0)` and `(-28.0, 1.2, 18.0)`.
- 2 Clipper Cargo Loading Ports: `(28.0, 1.2, -18.0)` and `(28.0, 1.2, 18.0)`.
- 2 North Kraken Whirlpool Vents: `(-10.0, -1.0, -48.0)` and `(10.0, -1.0, -48.0)`.
- 2 South Flotsam Cave Inlets: `(-12.0, -1.0, 48.0)` and `(12.0, -1.0, 48.0)`.
- 2 Bowsprit Hawse Hole Openings: `(-24.0, 3.0, -42.0)` and `(24.0, 3.0, -42.0)`.

---

## 4. Sector 1: The Crimson Galleon "El Dorado" (West)

The massive Spanish galleon stationed at `x = -24.0` spanning `z = -38.0 to 38.0`.

### 4.1 Hull Architecture & Decks
- **Hull Envelope**: Length $76.0\text{ m}$, Beam (width) $16.0\text{ m}$ (`x = -32.0 to -16.0`), Draft depth $4.0\text{ m}$.
  - Keel: `box(-24.0, -3.0, 0, 2.0, 2.0, 76.0)` in `INK.ORANGE`.
  - Rib frames: 18 curved frames `orientedCyl()` along the hull in `INK.ORANGE`.
- **Lower Gun Deck (`y = 1.2`)**:
  - Floor: `slab(-31.0, -32.0, -17.0, 32.0, 1.2, 0.4)` in `INK.ORANGE`.
  - 8 Port and Starboard Cannon Ports: Openings $1.4\text{ m} \times 1.4\text{ m}$ with hinged lids.
  - Net interior headroom: $2.4\text{ m}$ (forces claustrophobic close-quarters shotgun combat).
- **Main Weather Deck (`y = 4.0`)**:
  - Slab: `slab(-31.0, -22.0, -17.0, 18.0, 4.0, 0.4)` in `INK.ORANGE`.
  - Central Cargo Hatch: Opening $6.0\text{ m} \times 4.0\text{ m}$ with wooden grating.
  - Ship's Capstan: `cyl(-24.0, 4.0, 0, radius 1.4, height 1.6)` with 6 horizontal wooden bars.
- **Raised Forecastle (`y = 6.8`) & Poop Deck (`y = 8.5`)**:
  - Forecastle: `slab(-30.0, -38.0, -18.0, -22.0, 6.8, 0.4)` at the bow.
  - Poop Deck & Quarterdeck: `slab(-30.0, 18.0, -18.0, 38.0, 8.5, 0.4)` at the stern.
  - 8-Spoke Turned Helm: `ring(-24.0, 9.8, 30.0, 'z')` with bronze compass binnacle.

### 4.2 The Captain's Great Cabin
Located directly beneath the poop deck at `z = 20.0 to 36.0`:
- **Chamber Dimensions**: $12.0\text{ m wide} \times 16.0\text{ m long}$, ceiling height $3.9\text{ m}$.
- **Gilded Stern Transom Gallery**:
  - 7 multi-pane bay windows in `INK.BLUE` overlooking the sea.
  - 3 Faceted Brass Stern Lanterns mounted on exterior iron brackets: `cone(-24.0, 9.0, 38.5, radius 0.8, height 1.8)` in `INK.ORANGE`.
- **Tactical Interior Cover Props**:
  - Heavy Oak Navigation Table: `box(-24.0, 4.0, 28.0, 4.5, 1.2, 2.5)` in `INK.ORANGE`.
  - Scattered Ink Maps & Brass Sextant: Doodled cartographic items in `INK.BLACK`.
  - Sea Chest Stack: `box(-29.0, 4.0, 24.0, 2.0, 1.8, 3.2)` in `INK.ORANGE` providing chest-high cover.

---

## 5. Sector 2: The Royal Navy Clipper "Invincible" (East)

A sleek, razor-bowed naval warship stationed at `x = 24.0` spanning `z = -38.0 to 38.0`.

### 5.1 Hull Geometry & Forward Bowsprit
- **Hull Envelope**: Length $76.0\text{ m}$, Beam $14.0\text{ m}$ (`x = 17.0 to 31.0`). Finished in dark naval blue `INK.BLUE` with a crisp white waterline stripe in `INK.WHITE`.
- **The 14-Meter Bowsprit & Jib-Boom**:
  - Massive spar extending North over the water: `orientedCyl(24.0, 7.5, -38.0, 24.0, 12.0, -52.0, 0.45, INK.ORANGE)`.
  - Carved Golden Siren Figurehead mounted beneath the bowsprit: `sphere(24.0, 6.0, -39.0, radius 1.2)` in `INK.ORANGE`.
  - Tightrope Walkway: Players can sprint out along the bowsprit to execute aerial drop-attacks!
- **Starboard Weather Deck (`y = 4.0`)**:
  - Clean teak deck spanning `z = -20.0 to 22.0` with polished brass belaying pins.
  - Pyramid Cannonball Stacks: `box(28.5, 4.0, -10.0, 1.6, 1.2, 1.6)` in `INK.BLACK`.

### 5.2 24-Pounder Naval Artillery Batteries
Each ship is equipped with 6 fully modeled 24-pounder smoothbore cannons:
- **Cannon Barrel (Cast Iron)**:
  - Step-tapered tube: Length $3.6\text{ m}$, `cyl(x, 4.8, z, radius 0.35, height 3.6, axis='x')` in `INK.BLACK`.
  - Cascabel knob and breech ring with braided hemp recoil tackle rope.
- **Stepped Elm Truck Carriage**:
  - Four solid wooden truck wheels of diameter $0.7\text{ m}$ in `INK.ORANGE`.
  - Wooden carriage cheeks and elevating screw quoin.
  - Functional Combat Cover: Each cannon provides $1.4\text{ m}$ high solid ballistic cover.

---

## 6. Sector 3: The Shattered Mainmast Boarding Bridge & Flotsam (Center)

The pivotal central battleground connecting the two warships between `x = -16.0 and 16.0`.

### 6.1 The 32-Meter Shattered Mainmast Ramp
A colossal timber mast that has snapped and fallen diagonally across the divide:
- **Geometry**: Heavy tapered spar `orientedCyl(-16.0, 4.0, -6.0, 17.0, 4.0, 8.0, 0.75, INK.ORANGE)`.
- **Central Boarding Bridge Deck**:
  - Top flattened walkway: Width $2.2\text{ m}$, spanning from the Galleon gunwale straight to the Clipper deck.
  - Tangled Rigging Handrails: Slack rope lines running along both sides in `INK.BLACK`.
- **Giant Wooden School Ruler Extension**:
  - A 30cm drafting ruler (`INK.ORANGE`) lashed to the center of the mast with thick tarred rope rings:
  - Spans `x = -6.0 to 6.0, y = 4.2`, width $1.8\text{ m}$, thickness $0.3\text{ m}$, marked with millimeter ticks.

### 6.2 Floating Cargo Flotsam Islands
In the water directly beneath the mast, a cluster of floating supplies creates a low-level traversal route:
- **Floating Rum Cask Raft**: 4 giant oak barrels lashed together at `(0, -0.6, 4.0)` with a wooden plank deck.
- **Sealed Tea Chest Archipelago**: 3 buoyant crates creating hopping stones at `(-4.0, -0.4, -12.0)`, `(0, -0.4, -14.0)`, and `(4.0, -0.4, -12.0)`.

---

## 7. Sector 4: The Kraken's Wrath & Coral Outcroppings (North & South)

### 7.1 The 4 Emerald Kraken Tentacles
Gigantic mythical sea monster limbs erupting from the sea to crush the hulls and provide dynamic organic ramps:
- **Tentacle 1 (Northwest Galleon Bow)**:
  - Sweeps up from `(-14.0, -2.0, -28.0)` curling over the galleon rail to `(-22.0, 7.5, -24.0)`.
  - Formed from 6 segmented cylinders of radius $0.9\text{ m}$ tapering to $0.4\text{ m}$ in `INK.GREEN`.
  - Raised Suction Cup Rings: `ring()` details on the inner flank in `INK.BLACK`.
  - Serves as a curved, organic boarding ramp straight onto the Forecastle!
- **Tentacle 2 (Center Trench Spine)**:
  - Arches vertically out of the water at `(0, -1.0, -2.0)` reaching apex `y = 12.0` before coiling back down.
  - Apex Grapple Ring: `ring(0, 12.5, -2.0, 'x')` in `INK.ORANGE`.
- **Tentacles 3 & 4 (South Transoms)**:
  - Two grasping limbs wrapped around the rudders of both ships at `z = 40.0`.

---

## 8. Central Sector: The Sunken Cargo Trench & Waterlogged Drifts

The open waterway separating the ships between `x = -16.0 to 17.0` and `z = -38.0 to 38.0`:
- **Clearance Width**: Exactly $33.0\text{ m}$ separating the main gunwales.
- **Swinging Boarding Ropes**:
  - 4 heavy tarred hemp ropes suspended from the main yardarms of both ships down to `y = 6.0`.
  - Each rope ends in a sailor's eyelet loop with an orange grapple ring (`ring(x, 6.0, z, 'y')`).
  - Players can hook these swinging ropes to slingshot themselves across the broadside gap!

---

## 9. Overhead Rigging, Fighting Tops & Aerial Swing Traversal

### 9.1 Masts & Fighting Tops (Sniper Platforms)
Each ship possesses three towering masts (Fore, Main, and Mizzen):
- **Galleon Mainmast**:
  - Base at `(-24.0, 4.0, 0)`, Height $48.0\text{ m}$ (zenith at `y = 52.0`), `cyl(..., radius 0.9)`.
  - Lower Fighting Top (`y = 14.0`): Circular timber platform of diameter $5.5\text{ m}$ with solid barricades.
  - Upper Crow's Nest (`y = 34.0`): Deep wooden tub of diameter $3.2\text{ m}$, rim height $1.4\text{ m}$.
  - Grapple Ring Anchor: `ring(-24.0, 35.8, 0, 'y')` in `INK.ORANGE`.
- **Clipper Mainmast**:
  - Base at `(24.0, 4.0, 0)`, Height $48.0\text{ m}$, identical fighting tops and yardarms.

### 9.2 Climbable Rope Ratlines (Rigging Ladders)
- Triangular rope shroud ladders spanning from the outer gunwales at `y = 4.0` up to the fighting tops at `y = 14.0`:
  - Sloped ladder plane: Angle $72^\circ$, width $4.0\text{ m}$ tapering to $2.0\text{ m}$.
  - Horizontal rungs spaced every $0.4\text{ m}$ in `INK.BLACK`.
  - Players can run or climb up the ratlines to reach the aerial platforms without grappling!

---

## 10. Stairway Mathematics, Companionway Ladders & Hull Slopes

All shipboard stairs adhere strictly to character controller step resolution ($0.35\text{ m}$ max step rise):

### 10.1 Main Deck to Quarterdeck Companionway Stairs
Connecting Weather Deck (`y = 4.0`) to Quarterdeck (`y = 6.8`):
- **Flight Specifications (10 steps)**:
  - Height Rise: $2.8\text{ m} / 10 = 0.2800\text{ m}$.
  - Step Run: $0.45\text{ m}$.
  - Total Run: $4.5\text{ m}$.
  - Stair Width: $1.8\text{ m}$.
  - Slope Angle: $\arctan(0.28 / 0.45) = 31.8^\circ$.
  - Placement (Galleon): Starts at `(-21.0, 4.0, 13.5)`, ascends South to Landing at `(-21.0, 6.8, 18.0)`.

### 10.2 Gun Deck Companionway Ladder (Steep Ship's Ladder)
Connecting Gun Deck (`y = 1.2`) to Weather Deck (`y = 4.0`):
- **Flight Specifications (10 steps)**:
  - Height Rise: $2.8\text{ m} / 10 = 0.2800\text{ m}$.
  - Step Run: $0.35\text{ m}$ (steep marine ladder).
  - Heavy timber handrails along both sides in `INK.ORANGE`.

---

## 11. Solo vs. Arena Multiplayer Variations Matrix

| Feature | Solo Wave Survival (`!arena`) | Peer-to-Peer Arena Match (`arena`) |
| :--- | :--- | :--- |
| **Map Radius ($P$)** | $55\text{ m}$ ($110 \times 110\text{ m}$ total) | $68\text{ m}$ ($136 \times 136\text{ m}$ total) |
| **Boundary Height** | $18\text{ m}$ with invisible vertical blocker to $y = 58$ | $30\text{ m}$ perimeter sea cliffs |
| **Sky Enclosure** | Sky lid at $y = 56$ + 6 Blue Torus Arches | $120\text{ m}$ Geodesic Dome with Red Tempest Eye ($y=90$) |
| **Boarding Bridges** | 1 Shattered Mainmast + 1 Ruler Planks | **4 Symmetrical Boarding Bridges** + 2 High Yardarm Tightropes |
| **Suspended Platforms**| None | **5 Suspended Sail Cloth Platforms** hung from geodesic dome |
| **Kraken Menace** | Static climbable tentacle ramps | Animated swaying tentacles with knockback hazards |
| **Spawn System** | Fixed single player start at `(-24.0, 4.0, 36.0)` | 16 distributed naval arena spawns across both ships |

### 11.1 Arena Geodesic Dome & Suspended Rigging Platforms
In multiplayer Arena matches, the sky is covered by a massive maritime compass dome ($R = 120, C = -30$):
- 8 longitudinal Torus ribs rotated by $\pi / 8$ ($22.5^\circ$).
- 5 latitude rings at $y = 38, 54, 68, 80, 88$.
- Apex Tempest Sphere: radius $2.4$ at `(0, 90, 0)` in `INK.RED`.
- **5 Suspended Sail Cloth Platforms**:
  1. Center Zenith Overlook: `(0, 26.0, 0)`, size $8.0 \times 8.0\text{ m}$.
  2. Northwest Foretop Platform: `(-24.0, 22.0, -22.0)`, size $6.0 \times 6.0\text{ m}$.
  3. Southeast Mizzentop Platform: `(24.0, 22.0, 22.0)`, size $6.0 \times 6.0\text{ m}$.
  4. Northeast Bowsprit Overlook: `(18.0, 20.0, -38.0)`, size $5.0 \times 5.0\text{ m}$.
  5. Southwest Cabin Overlook: `(-18.0, 20.0, 38.0)`, size $5.0 \times 5.0\text{ m}$.
  - Each platform hangs from the dome via an `INK.BLACK` rigging cable and features an inverted orange grapple ring at `y - 1.3`.

---

## 12. Spawn Points, Sniper Perches & Item Pickups

### 12.1 Sniper Perches (`L.snipers`)
High-elevation tactical vantage points assigned to AI sniper units:
1. `(-24.0, 34.0, 0)`: Galleon Mainmast Crow's Nest.
2. `(24.0, 34.0, 0)`: Clipper Mainmast Crow's Nest.
3. `(-24.0, 14.0, -22.0)`: Galleon Foremast Fighting Top.
4. `(24.0, 14.0, 22.0)`: Clipper Mizzentop Platform.
5. `(-24.0, 8.5, 34.0)`: Galleon Poop Deck Helm Balustrade.
6. `(24.0, 12.0, -50.0)`: Clipper Bowsprit Capstan Peak.
7. `(0, 12.0, -2.0)`: Central Kraken Arch Tentacle Apex.
8. `(-42.0, 6.0, -51.2)`: Northwest Coral Reef Sniper Shelf.

### 12.2 Supply & Weapon Pickups (`L.pickups`)
1. Galleon Decks: `(-24.0, 4.0, 0)` [Capstan base], `(-24.0, 1.2, 0)` [Gun deck powder room], `(-24.0, 4.0, 28.0)` [Captain's table].
2. Clipper Decks: `(24.0, 4.0, -8.0)` [Cannonball stack], `(24.0, 6.8, -26.0)` [Forecastle belfry], `(24.0, 4.0, 18.0)` [Companionway].
3. Central Crossing: `(0, 4.2, 0)` [Shattered mast center], `(0, -0.4, 4.0)` [Floating rum cask raft].
4. Rigging Tops: `(-24.0, 14.0, 0)` [Galleon main top], `(24.0, 14.0, 0)` [Clipper main top].
5. Hull Flanks: `(-24.0, 6.8, -32.0)` [Galleon bowsprit], `(24.0, 6.8, 32.0)` [Clipper taffrail].

### 12.3 Symmetric Multiplayer Team Spawns (`L.teamSpawns`)
- **Red Team Spawns (West - The Crimson Buccaneers)**:
  - `(-24.0, 4.0, 24.0)` (Galleon Quarterdeck)
  - `(-24.0, 1.2, -10.0)` (Galleon Forward Gun Deck)
  - `(-24.0, 6.8, -30.0)` (Galleon Forecastle)
  - `(-30.0, 4.0, 0)` (Port Gunwale Rail)
  - `(-24.0, 14.0, 0)` (Galleon Main Fighting Top)
- **Blue Team Spawns (East - The Royal Navy Officers)**:
  - `(24.0, 4.0, -24.0)` (Clipper Forward Weather Deck)
  - `(24.0, 1.2, 10.0)` (Clipper After Gun Deck)
  - `(24.0, 6.8, 30.0)` (Clipper Quarterdeck Helm)
  - `(30.0, 4.0, 0)` (Starboard Gunwale Rail)
  - `(24.0, 14.0, 0)` (Clipper Main Fighting Top)

---

## 13. Level Designer Checklist & Anti-Bug Directives

1. **Water Hazard Surface & Swim Mechanics**:
   - The water boundary at `y = -2.5` must never trap players in infinite falling loops. Provide rope ladders hanging down into the water at coordinates `(-16.0, 0, 0)` and `(16.0, 0, 0)`.
2. **Deck & Headroom Clearances**:
   - Gun deck interior headroom must be at least $2.4\text{ m}$.
   - Captain's cabin door openings: Minimum width $2.2\text{ m}$, height $3.0\text{ m}$.
3. **Cover Height Hierarchy**:
   - Low Crouch Cover ($0.8\text{ m} - 1.2\text{ m}$): Coiled rope coils, low bulwark pin-rails, sea chests.
   - Chest Cover ($1.4\text{ m} - 1.6\text{ m}$): 24-pounder naval cannons, ship's capstan, hammock nettings.
   - Full Occlusion ($2.4\text{ m} - 3.4\text{ m}$): Mainmast timber trunks, deckhouse companionway hoods, stern cabin bulkheads.
4. **Continuous Flow Loops (No Dead Ends)**:
   - Fighting Tops: 2 descent routes (rope ratlines to deck, grapple swing to adjacent yardarm).
   - Gun Decks: 2 stairways (forward hatch and aft companionway).
   - Broadside Crossing: 3 separate paths (mainmast bridge, lower flotsam hopping stones, and high-altitude yardarm grapple swings).
5. **Physics & Navigation Tagging Discipline**:
   - Apply `{ noNav: true }` to sloped rope rigging, bowsprit tightropes, cannon barrels, and moving wave crests.
   - Apply `{ noGrapple: true }` to the outer perimeter sea walls and the sky containment ceiling.
   - Apply `{ noCollide: true }` to loose hanging sail canvas, decorative ship pennants, and water foam decals.
