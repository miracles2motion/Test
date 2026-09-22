# The Retro 80s Arcade & Pinball Hall: Comprehensive Map Architecture & Specification

A master structural, geometrical, and aesthetic blueprint for **The Retro 80s Arcade & Pinball Hall** (Map Key: `retro_arcade` / `arcade`), an electrifying tactile combat arena set within a sprawling, late-night neon amusement palace drawn with glowing fluorescent ink strokes, phosphorus vector scanlines, dynamic CRT barrel-distortion shaders, and carpet geometric tessellations on heavy midnight-indigo cardstock (`#0d0e15`).

Featuring a colossal, fully functional 16-meter tilted Pinball Table centerpiece with kinetic flippers and jump-pad pop bumpers, a sunken vector arcade pit (*Battlezone* / *Tempest* wireframes), an elevated prize redemption counter mezzanine, a four-lane skee-ball gallery, an operable dance-stage rhythm arena, suspended air-duct traverse gantries, and kinetic neon signage.

Designed using the exact mathematical standards, coordinate bounds, vertical step ratios, and traversal loops of **The Blueprint Castle** (`castle`) and **The Zen Garden** (`zen`), this specification establishes a flawless, uncompromised reference for implementing the retro arcade map in `src/level.js` without geometric inconsistencies, blind traps, or collision bugs.

---

## Table of Contents
1. [Spatial Coordinates & World Bounds](#1-spatial-coordinates--world-bounds)
2. [Aesthetic & Ink Material System](#2-aesthetic--ink-material-system)
3. [Perimeter Enclosure & Neon Facade Boundaries](#3-perimeter-enclosure--neon-facade-boundaries)
4. [Sector 1: The Skee-Ball Gallery & Redemption Counter (North)](#4-sector-1-the-skee-ball-gallery--redemption-counter-north)
5. [Sector 2: Air Hockey Plaza & The Neon Snack Bar (South)](#5-sector-2-air-hockey-plaza--the-neon-snack-bar-south)
6. [Sector 3: The Sunken Vector CRT Pit & Cabinet Row (West)](#6-sector-3-the-sunken-vector-crt-pit--cabinet-row-west)
7. [Sector 4: The Rhythm Stage & Driving Simulators (East)](#7-sector-4-the-rhythm-stage--driving-simulators-east)
8. [Central Sector: The Monumental Tilted Pinball Machine (Center: X = 0, Z = 0)](#8-central-sector-the-monumental-tilted-pinball-machine-center-x--0-z--0)
9. [Overhead Air-Duct Gantries, Wireform Habitrails & Aerial Grapple Traversal](#9-overhead-air-duct-gantries-wireform-habitrails--aerial-grapple-traversal)
10. [Stairway Mathematics, Modular Ramps & Rest Landings](#10-stairway-mathematics-modular-ramps--rest-landings)
11. [Solo vs. Arena Multiplayer Variations Matrix](#11-solo-vs-arena-multiplayer-variations-matrix)
12. [Spawn Points, Sniper Perches & Item Pickups](#12-spawn-points-sniper-perches--item-pickups)
13. [Level Designer Checklist & Anti-Bug Directives](#13-level-designer-checklist--anti-bug-directives)

---

## 1. Spatial Coordinates & World Bounds

The Retro 80s Arcade shares the exact Cartesian world grid as Doodle District, Blueprint Castle, and Zen Garden to guarantee 100% engine compatibility:

- **Origin `(0, 0, 0)`**: The geometric center of the pinball machine lower apron between the twin flipper pivots at ground level.
- **X-Axis (East-West)**:
  - Negative X (`-X`): **West** (The Sunken Vector CRT Pit, vintage upright arcade rows, laser disc pods).
  - Positive X (`+X`): **East** (The Rhythm Dance Stage, deluxe hydraulic driving cockpits, prize crane machines).
- **Y-Axis (Elevation / Vertical Tiers)**:
  - `y = -2.0`: Sunken Vector Arcade Pit floor and token maintenance trenches.
  - `y = -1.0 to 0.0`: Foundation concrete slab beneath the patterned nylon arcade carpet.
  - `y = 0.0`: Main Arcade Ground Floor level (Datum plane).
  - `y = 0.85`: Lower pinball playfield apron surface (crouch cover plane).
  - `y = 2.4`: Upper pinball playfield arch deck and rollover lanes.
  - `y = 3.6`: Pinball backglass marquee header and scoreboard cabinet.
  - `y = 5.5`: Sector 1 Prize Redemption Counter Mezzanine & Observation Catwalk.
  - `y = 8.0`: Suspended industrial HVAC ventilation duct walkways and steel wireform bridges.
  - `y = 12.0`: Overhead prize crane gantry bridge rails and neon truss framework.
  - `y = 16.0`: Pinball backglass spire apex and illuminated `HIGH SCORE` marquee.
  - `y = 24.0`: Overhead space-frame ceiling containment boundary.
  - `y = 56.0`: Invisible sky containment lid (Solo mode).
  - `y = 88.0`: Geodesic neon wireframe compass dome apex (Arena mode).
- **Z-Axis (North-South)**:
  - Negative Z (`-Z`): **North** (The Skee-Ball Alley, Ticket Redemption Counter, and Prize Stockroom at `z = -38.0`).
  - Positive Z (`+Z`): **South** (The Air Hockey Plaza, Neon Snack Bar, and Token Changer Kiosks at `z = 38.0`).

### Boundary Envelopes
| Mode | Half-Span ($P$) | Total Dimensions | Wall Height ($PH$) | Wall Thickness ($T$) | Solo Player Start |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Solo Mode** | $55\text{ m}$ | $110 \times 110\text{ m}$ | $20\text{ m}$ | $6\text{ m}$ | `(0, 0.0, 36.0)` facing North (`-z`) |
| **Arena Mode** | $68\text{ m}$ | $136 \times 136\text{ m}$ | $32\text{ m}$ | $6\text{ m}$ | 16 Symmetrical Arena Spawns |

---

## 2. Aesthetic & Ink Material System

All geometry in The Retro 80s Arcade is synthesized through a specialized neon phosphorescence and dark substrate shader (`src/render.js`), set against midnight-indigo heavy cardstock (`#0d0e15`) printed with fluorescent 1980s geometric carpet triangles (`#181928` / `#221d3b`):

- **`INK.BLUE` (ID: 0 - Cobalt Vector Cyan `#00f0ff` & Steel Framework)**:
  - Vector CRT wireframe tank/asteroid obstacles in the sunken arena.
  - Structural space-frame ceiling trusses, HVAC sheet-metal ductwork, and steel wireform habitrails.
  - Ticket shredder cabinets, coin return trays, and redemption shelf frames.
- **`INK.BLACK` (ID: 2 - Matte Melamine Cabinetry `#12131a` & Rubber Bumpers)**:
  - Upright arcade cabinet side panels, coin doors, T-molding plastic edge trim.
  - Pinball cabinet wooden chassis, flipper rubber rings, and speaker grilles.
  - Skee-ball lane cork runaways and black polyurethane ball returns.
- **`INK.ORANGE` (ID: 3 - Radiant Amber Neon `#ffaa00` & Brass Coinage)**:
  - Illuminated marquee lightboxes, token hoppers, brass dollar-bill acceptors.
  - Pinball target drop banks, amber flasher bulbs, and wooden skee-ball scoring rings.
  - Giant 30cm wooden drafting ruler bridges spanning broken catwalk gaps.
  - All interactive grapple rings and dynamic swinging hoop anchors.
- **`INK.RED` (ID: 1 - Hot Cinnabar Magenta `#ff0055` & Laser Decals)**:
  - High Score 7-segment LED displays, arcade marquee graphics, coin slot reject buttons.
  - Active pinball pop bumpers, solenoid coil kicks, and red laser warning beacons.
  - Arena Geodesic Dome central neon polygon keystone (`radius = 2.4` at `y = 90`).
- **`INK.GREEN` (ID: 4 - Radioactive Emerald Vector `#00ff66` & Matrix Text)**:
  - Classic arcade scoreboard font (`CREDITS 00`, `INSERT COIN`, `1UP`).
  - Translucent plastic soda fountain cups, radar sweep grids on vector screens, and fire exit doors.

### 2.1 Thematic Prop Taxonomy (Detailing Tiers 1-4)
- **Tier 1 (Cover Props - 3-5 meshes each)**:
  - Polished brass token changer machines (`box()` housing + `box()` coin cup + illuminated `CHANGE` header in `INK.ORANGE`). Provides $1.2\text{m}$ chest cover.
  - Stacks of red vinyl swivel barstools with chrome pedestal bases (`cyl()` stem + `cyl()` seat cushion). Provides $0.85\text{m}$ crouch cover.
  - Crushed neon aluminum soda cans, discarded yellow ticket rolls, and cardboard popcorn tubs acting as non-colliding ambient ground dressing (`noCollide: true`).
  - Upright coin-op gumball and sticker dispensers with glass globes that burst into colorful ink marbles when shattered.
- **Tier 2 (Tactical Furniture & Walkways - 5-10 meshes each)**:
  - Clustered back-to-back arcade cabinet pods (4 cabinets per bank: `box()` bodies + angled `box()` marquees + CRT inset face + joystick/button control decks) providing solid $1.8\text{m}$ line-of-sight occlusion.
  - Illuminated Air Hockey tables with overhead scoring arches and perforated aluminum puck decks.
  - Skee-ball lane banks with cork ramps and concentric ringed target cages.
  - Suspended 30cm wooden drafting ruler catwalk bridges spanning upper mezzanine gaps with etched imperial millimeter calibrations.
- **Tier 3 (Landmark Anchor Props - 10-20 meshes each)**:
  - The Skee-Ball High-Tower Target Array with 100-point circular bullseye pocket and mechanical ball elevator.
  - The Giant Claw Prize Crane ($4.5\text{m} \times 4.5\text{m} \times 6.0\text{m}$) containing oversized plush teddy bears, operable motorized 3-prong drop claw, and glass showcase windows.
  - The Deluxe Hydraulic Sit-In Twin Driving Cockpits (*OutRun* style) mounted on active kinetic suspension rockers (`L.animated`).
  - The Vector Battlezone Periscope Tank pod with twin thumbstick controls and glowing green phosphor stereoscopic viewports.
- **Tier 4 (Hero Centerpiece - 25-45 meshes)**:
  - The Monumental 16-Meter Tilted Pinball Machine (*"Doodle Strike: Galactic Mayhem"*). Features a $16\text{m} \times 8\text{m}$ playfield inclined at $12^\circ$, operable solenoid twin flippers ($3.5\text{m}$ length each), 3 kinetic spring-loaded pop bumpers ($Y=1.5\text{m}$ to $2.2\text{m}$) that launch players vertically into the air on contact, multi-tier wireform metal habitrail habitrails (`splineTube`), a vertical drop-target bank of 4 reset plates, and a towering $6.5\text{m}$ backglass cabinet with animated 7-segment digital displays.

---

## 3. Perimeter Enclosure & Neon Facade Boundaries

### 3.1 Ground Slab & Retro Carpeting
- **Ground Foundation**: Continuous monolithic foundation slab `box(0, -1.0, 0, 2*P + T, 1.0, 2*P + T)` in `INK.BLUE`.
- **Nylon Carpet Tessellation**: Surface overlay at `y = 0.0` printed with deep blue and purple geometric diamond tessellations accented by hot pink and neon cyan squiggles, fully anti-aliased with no Z-fighting (`yOffset = 0.01`).
- **Perimeter Soundproofing Wall Enclosures**:
  - Boundary walls of height $20.0\text{ m}$ (Solo) / $32.0\text{ m}$ (Arena), thickness $6.0\text{ m}$ constructed from black acoustic acoustic baffle slats in `INK.BLACK` with recessed neon accent troughs in `INK.BLUE` and `INK.RED`.
  - North Wall: `box(0, 0, -P, 2*P + T, PH, T)` in `INK.BLACK`.
  - South Wall: `box(0, 0, P, 2*P + T, PH, T)` in `INK.BLACK`.
  - West Wall: `box(-P, 0, 0, T, PH, 2*P + T)` in `INK.BLACK`.
  - East Wall: `box(P, 0, 0, T, PH, 2*P + T)` in `INK.BLACK`.

### 3.2 Anti-Camp Sky Containment (Solo Mode)
- **Invisible Vertical Boundary Blockers**: 4 perimeter colliders rising from `y = 20.0` to `y = 58.0`, tagged `{ noNav: true, noGrapple: true }`.
- **Sky Ceiling Lid**: `collider(0, 56.0, 0, 2*P + 40, 8.0, 2*P + 40, { noNav: true, noGrapple: true })`.
- **Neon Truss Ceiling Ribs**:
  - Center: `(0, -20.0, 0)`, Radius: $R = 98.0\text{ m}$.
  - 8 glowing space-frame structural ribs in `INK.BLUE` forming barrel vaults across the ceiling.
  - 4 latitude neon containment conduits at heights `y = 28.0, 42.0, 54.0, 68.0`.

### 3.3 Perimeter Ledges & Observation Balconies
8 elevated sniper and grapple platforms integrated into the perimeter walls:
1. `[-36.0, 5.5, -51.2, 8.0, 0.4, 2.4]`: Northwest Redemption Storage Catwalk.
2. `[36.0, 5.5, -51.2, 8.0, 0.4, 2.4]`: Northeast Ticket Vault Mezzanine.
3. `[-51.2, 6.0, -18.0, 2.4, 0.4, 8.0]`: West Vector Rigging Balcony.
4. `[-51.2, 6.0, 18.0, 2.4, 0.4, 8.0]`: West Laser Disc Service Deck.
5. `[51.2, 6.0, -18.0, 2.4, 0.4, 8.0]`: East Rhythm Lighting Gantry.
6. `[51.2, 6.0, 18.0, 2.4, 0.4, 8.0]`: East Sim Rig Catwalk.
7. `[-24.0, 5.5, 51.2, 8.0, 0.4, 2.4]`: Southwest Snack Bar Storage Loft.
8. `[24.0, 5.5, 51.2, 8.0, 0.4, 2.4]`: Southeast Electrical Breaker Deck.

### 3.4 Enemy Wave Spawn Portals
10 themed arcade spawn portals for Solo survival waves:
- 2 Service Hallway Double Doors: `(-48.0, 0, -12.0)` and `(-48.0, 0, 12.0)`.
- 2 Neon Marquee Roof Maintenance Hatches: `(48.0, 0, -16.0)` and `(48.0, 0, 16.0)`.
- 2 Ticket Shredder Chutes behind Redemption: `(-14.0, 0, -51.2)` and `(14.0, 0, -51.2)`.
- 2 Soda Syrup Storage Roll-Up Shutters: `(-16.0, 0, 51.2)` and `(16.0, 0, 51.2)`.
- 2 Pinball Machine Under-Apron Ball Ejection Tunnels: `(-3.0, 0.2, -6.0)` and `(3.0, 0.2, -6.0)`.

---

## 4. Sector 1: The Skee-Ball Gallery & Redemption Counter (North)

A vibrant redemption and carnival prize concourse situated between `x = -24.0 to 24.0, z = -48.0 to -24.0`:

### 4.1 The Ticket Redemption Counter & Glass Showcases
- **The Counter Barricade (`z = -38.0`)**:
  - An elongated curved serving counter of length $28.0\text{ m}$, depth $1.6\text{ m}$, height $1.15\text{ m}$ (perfect chest cover) in `INK.BLACK` with brushed chrome kick-plates.
  - Fronted by illuminated glass display showcases holding retro treasures: lava lamps, digital wristwatches, plastic toy laser guns, and rolls of pink tickets.
  - Cashier register terminals and optical ticket bar-code scanners providing $0.4\text{m}$ head-peek cover.
- **The Giant Plush Bear Hero Prop (Tier 3 Landmark)**:
  - Mounted atop the center redemption canopy at `(0, 3.2, -42.0)`: a monumental $4.5\text{m}$ tall plush teddy bear with ballpoint felt hatching and button eyes in `INK.ORANGE`.
  - Serves as an unmistakable visual landmark visible from any sector in the arena.

### 4.2 The Skee-Ball Alley (Northwest: `x = -20.0 to -6.0, z = -32.0 to -20.0`)
- **4 Parallel Skee-Ball Lanes**:
  - Width: $1.8\text{ m}$ per lane, Total Length: $8.5\text{ m}$, Incline Ramp: $15^\circ$ slope rising from $y = 0.4$ to $y = 1.2$.
  - Cork ball runways flanked by wire-mesh divider fences ($1.6\text{ m}$ high) that block horizontal projectile trajectories while preserving sightlines.
  - High-Tower Scoring Target: Concentric circular wood rings ($10, 20, 30, 40, 50$, and dual $100$ point corner pockets) in `INK.ORANGE` and `INK.BLACK`.
  - Ball Return Troughs: Players can slide along the lower return gullies for quick cover transitions.

### 4.3 The Redemption Mezzanine Walkway (`y = 5.5`)
- A wide overhead catwalk ($3.2\text{ m}$ wide) spanning the entire northern wall from `x = -24.0` to `x = 24.0`.
- Protected by a $1.2\text{ m}$ high tubular steel railing in `INK.BLUE` with ticket-tape mesh inserts.
- Provides dominant long-range sniper sightlines overlooking the pinball playfield and central lanes.
- Linked to the ground floor via dual modular industrial switchback stairways on the east and west flanks.

---

## 5. Sector 2: Air Hockey Plaza & The Neon Snack Bar (South)

The bustling southern commons situated between `x = -24.0 to 24.0, z = 24.0 to 48.0`:

### 5.1 The Air Hockey Tournament Court
- **Two Full-Scale Air Hockey Tables**:
  - Placed symmetrically at `(-8.0, 0, 32.0)` and `(8.0, 0, 32.0)`.
  - Dimensions: Length $4.8\text{ m}$, Width $2.6\text{ m}$, Height $0.95\text{ m}$ (low crouch cover) in `INK.BLACK`.
  - Table Decks: White polished laminate with thousands of microscopic airflow micro-holes drawn with delicate dot hatching.
  - Overhead Scoreboard Gantry: Tubular steel arches spanning $3.2\text{ m}$ overhead at `y = 2.8` displaying red digital digit readouts (`7 - 5`).
  - Kinetic Puck Action: Floating aluminum pucks slide across table surfaces on impact, triggering chime sound effects.

### 5.2 The Neon Snack Bar & Soda Fountain Counter (`z = 44.0`)
- **Snack Bar Service Counter**:
  - Width: $22.0\text{ m}$, Depth $2.0\text{ m}$, Height $1.15\text{ m}$ in `INK.BLACK` topped with stainless steel laminate.
  - **Fountain Dispensers & Popcorn Poppers**:
    - 3-bay fountain drink dispenser with illuminated plastic flavor badges (`CHERRY`, `COLA`, `LIME`).
    - Commercial popcorn machine with transparent glass box, illuminated heat lamp, and mounded yellow popcorn kernels in `INK.ORANGE`.
- **Token Changer Kiosks & Vending Alcove**:
  - Bank of 4 heavy cast-iron dollar-bill changer machines ($1.4\text{ m} \times 0.8\text{ m} \times 1.8\text{ m}$) forming an impenetrable full-body cover bulwark.

---

## 6. Sector 3: The Sunken Vector CRT Pit & Cabinet Row (West)

A nostalgic, dimly lit competitive zone situated between `x = -48.0 to -20.0, z = -24.0 to 24.0`:

### 6.1 The Sunken Vector Arena Floor (`y = -2.0`)
- **Sunken Topography**:
  - A $24.0\text{ m} \times 36.0\text{ m}$ arena recessed $2.0\text{ m}$ below the main arcade floor, accessed via concrete perimeter steps and sloping access ramps.
  - Creates intense, multi-level close-quarters combat isolated from the high-ground pinball deck.
- **Wireframe Holographic Obstacles (Tier 3 Landmarks)**:
  - 3 monumental glowing wireframe vector obstacles rendered in pure `INK.BLUE` neon line shaders:
    - Center: A $4.0\text{ m}$ high vector tank turret (*Battlezone* homage) with revolving wireframe gun barrel.
    - Flanks: Two $3.2\text{ m}$ geometric geometric vector polyhedrons (*Tempest* web corridor).
    - Features no collision hulls on interior wire lines, allowing bullets to pass through while occluding enemy silhouettes!

### 6.2 The Classic Upright Cabinet Corridors
- **Two Parallel Rows of 12 Vintage Arcade Cabinets**:
  - Facing each other across a $3.2\text{ m}$ wide battle corridor (well above the $1.8\text{ m}$ anti-pinch standard).
  - Modeled with classic slanted marquees, 19-inch CRT monitors with spherical convex glass bulge shaders, and twin-stick control panels.
  - Destructible Marquees: Shooting cabinet headers shatters the back-lit acrylic, showering sparks and plunging the corridor into atmospheric shadows.
  - Side-panel artwork detailing: Pixelated alien invaders, cybernetic dragons, and pixel-art biro crosshatching.

---

## 7. Sector 4: The Rhythm Stage & Driving Simulators (East)

A high-energy interactive sector situated between `x = 20.0 to 48.0, z = -24.0 to 24.0`:

### 7.1 The Dance Dance Revolution Stage (`x = 34.0, z = 0`)
- **Elevated Twin Dance Platform**:
  - Dimensions: $6.0\text{ m} \times 4.0\text{ m}$, Height $0.5\text{ m}$ above floor level.
  - Steel tread-plate framing with 8 recessed translucent foot sensors (`UP`, `DOWN`, `LEFT`, `RIGHT`) in `INK.RED`, `INK.BLUE`, and `INK.ORANGE`.
  - Kinetic Lighting: Stepping onto arrow pads activates pulsing neon floor illumination and rhythm sound triggers in `L.animated`.
  - Chrome Rear Balance Bars: Twin $1.1\text{ m}$ high U-shaped tubular support bars providing tactical low crouch-cover.
- **The Mega CRT Video Wall**:
  - An array of $3 \times 3$ stacked 28-inch CRT monitors rising behind the stage to `y = 4.8\text{ m}`, displaying kinetic looping equalizer bars and dance motion animations.

### 7.2 Hydraulic Sit-In Twin Driving Simulators (`x = 32.0, z = -16.0`)
- Two dual-cockpit deluxe racing game cabinets with molded red fiberglass chassis, dual bucket seats, force-feedback steering wheels, and floor pedal boxes.
- Mounted on operational hydraulic actuator pistons that tilt dynamically in response to projectile impacts!
- Provides $1.4\text{ m}$ chest-high cover with peekholes through the open cockpit windshields.

### 7.3 The Giant Claw Prize Crane Machine (`x = 34.0, z = 18.0`)
- Enormous walk-in scale crane machine: $5.0\text{ m} \times 4.0\text{ m} \times 5.5\text{ m}$ with reinforced safety glass panels.
- Interior filled with colorful plush toys, giant dice, and an operable motorized overhead gantry with a 3-tine articulated steel grabbing claw suspended by high-tension aircraft cable.
- Apex grapple ring mounted to the top pulley trolley at `y = 5.8\text{ m}`.

---

## 8. Central Sector: The Monumental Tilted Pinball Machine (Center: X = 0, Z = 0)

The undisputed centerpiece and tactical focal point of the entire arena:

### 8.1 The Playfield Topography & Cabinet Geometry
- **Monumental Scale**:
  - Length: $20.0\text{ m}$ (`z = -10.0 to 10.0`), Width: $10.0\text{ m}$ (`x = -5.0 to 5.0`).
  - Tilted Incline: $12^\circ$ slope rising from the player apron at `z = 10.0, y = 0.85\text{ m}` to the upper arch at `z = -10.0, y = 2.95\text{ m}`.
  - Wooden side rails of height $0.6\text{ m}$ flanking the entire perimeter, providing perfect vault-over cover edges.
  - Tempered Glass Top: Collapsed in tactical breaches, allowing players to jump down directly onto the vibrant wooden playfield!

### 8.2 Kinetic Solenoid Flippers & Slingshot Kickers
- **Twin Solenoid Flippers (`x = -2.2 & 2.2, z = 7.5, y = 1.0`)**:
  - Length: $3.6\text{ m}$, Width: $0.6\text{ m}$ heavy-duty molded polyurethane bats in `INK.ORANGE` with red rubber traction bands.
  - Dynamic Motion (`L.animated`): Flippers pulse rhythmically on a 4-second cycle or trigger instantly when a player sprints across their tips, launching players $8.0\text{ m}$ forward toward the upper bumpers!
- **Angled Slingshot Kicker Bumpers**:
  - Flanking triangular kicker walls with high-tension rubber rings that rebound incoming grenades and projectiles at double velocity.

### 8.3 The Triad Pop-Bumpers (Jump-Pad Elevators)
- Three cylindrical pop-bumpers arranged in an inverted triangle at the upper playfield (`y = 2.2\text{ m} to 3.4\text{ m}`):
  - Left Bumper: `(-2.4, 2.2, -3.5)` in `INK.RED`.
  - Right Bumper: `(2.4, 2.2, -3.5)` in `INK.RED`.
  - Top Bumper: `(0, 2.6, -6.5)` in `INK.ORANGE`.
- **Mechanical Jump-Pad Physics**:
  - Stepping or landing on a pop bumper cap triggers a violent solenoid recoil animation (`L.animated`), flashing its internal tungsten lamp and launching the player $10.0\text{ m}$ straight up into the overhead wireform habitrails!

### 8.4 The Pinball Backglass Marquee & Scoreboard Tower (`z = -10.0`)
- A monumental vertical scoring cabinet rising from `y = 2.95\text{ m}` to `y = 10.5\text{ m}`:
  - Width: $10.0\text{ m}$, Depth: $2.4\text{ m}$ in heavy black textured melamine.
  - Illuminated Backglass Artwork: Hand-drawn biro battle illustration depicting space fighters attacking an alien mothership.
  - Digital Score Display: Giant glowing orange LED readouts cycling high scores (`999,999,990`).
  - Interior Maintenance Ladder: Rear iron rung ladder allowing players to climb inside the backbox to reach the highest sniper vantage platform at `y = 10.5\text{ m}`.

---

## 9. Overhead Air-Duct Gantries, Wireform Habitrails & Aerial Grapple Traversal

### 9.1 The Chrome Wireform Habitrail Rail System
- Curved metal ball-return habitrails constructed using `create3DSpline` and `splineTube`:
  - 4 continuous tubular chrome tracks ($0.35\text{ m}$ tube diameter, $1.2\text{ m}$ track gauge) swooping from the upper pinball rollover lanes around the perimeter of the room at `y = 7.5\text{ m}`.
  - Serves as narrow, high-risk, high-reward aerial tightrope balance walkways.
  - Overhanging kinetic giant pinballs ($1.2\text{ m}$ diameter chrome spheres) rolling along tracks.

### 9.2 Overhead HVAC Ventilation Duct Gantries
- Industrial rectangular sheet-metal ductwork spanning east-west and north-south:
  - Duct Dimensions: Width $2.4\text{ m}$, Height $1.6\text{ m}$ with reinforced external angle-iron flanges.
  - Walkable roof surface at `y = 8.0\text{ m}` complete with $1.1\text{ m}$ safety guide ropes and mesh walkways.
  - Intersects with Sector 1 Mezzanine and Sector 3 Vector Rigging Balconies.

### 9.3 Aerial Grapple Point Network
- 16 tactical grapple rings deployed throughout the overhead air space:
  - 4x Prize Crane trolley hoist rings (`ring(x, 12.0, z, 'y')`).
  - 4x Ceiling space-frame truss intersection nodes at `y = 14.0\text{ m}`.
  - 2x Pinball backbox marquee top anchors at `y = 11.0\text{ m}`.
  - 4x Wireform habitrail suspension drops at `y = 8.5\text{ m}`.
  - 2x Giant neon `ARCADE` sign letter frames at `y = 9.5\text{ m}`.
- **Grapple Radial Clearance**: Every grapple anchor guarantees a minimum $2.0\text{ m}$ clear radial sphere free of geometry collisions, comfortably exceeding the $1.5\text{ m}$ safety requirement.

---

## 10. Stairway Mathematics, Modular Ramps & Rest Landings

All vertical ascents and descents strictly obey the universal architectural character locomotion formula:

$$\text{Step Rise } = 0.25\text{m}, \quad \text{Step Run } = 0.48\text{m}, \quad \text{Clearance Corridor } \ge 2.2\text{m}$$

### Stairway Manifest
1. **Redemption Mezzanine Twin Switchback Stairs (North)**:
   - Connecting Ground Floor (`y = 0.0`) to Mezzanine Walkway (`y = 5.5`):
   - Flight 1: 11 steps ($2.75\text{ m}$ rise, $5.28\text{ m}$ run).
   - Intermediate Rest Landing: $2.4\text{ m} \times 2.4\text{ m}$ square platform at `y = 2.75`.
   - Flight 2: 11 steps reversing $180^\circ$ ($2.75\text{ m}$ rise, $5.28\text{ m}$ run).
   - Solid welded steel tread-plate with safety yellow nosing stripes and tubular handrails.
2. **Sunken Vector Pit Access Stairways & Ramps (West)**:
   - 4 symmetrical 8-step flights ($2.0\text{ m}$ total rise, $0.25\text{ m}$ rise / $0.48\text{ m}$ run) located at the four corners of the sunken pit.
   - Central wheelchair-accessible equipment ramp ($8^\circ$ slope, $2.4\text{ m}$ wide) allowing high-speed sliding entries directly into the vector arena.
3. **Pinball Side-Cabinet Service Ladders**:
   - Vertical steel rung ladders with cage surrounds at `(-6.0, 0, 0)` and `(6.0, 0, 0)` providing rapid vertical escape routes from the floor up to the pinball glass perimeter.

---

## 11. Solo vs. Arena Multiplayer Variations Matrix

| Feature | Solo Wave Survival (`!arena`) | Peer-to-Peer Arena Match (`arena`) |
| :--- | :--- | :--- |
| **Map Radius ($P$)** | $55\text{ m}$ ($110 \times 110\text{ m}$ total) | $68\text{ m}$ ($136 \times 136\text{ m}$ total) |
| **Boundary Height** | $20\text{ m}$ with invisible vertical blocker to $y = 58$ | $32\text{ m}$ perimeter acoustic baffle walls |
| **Sky Enclosure** | Flat sky lid at $y = 56$ + 8 Blue Neon Barrel Vaults | $120\text{ m}$ Geodesic Neon Wireframe Dome with Red Keystone ($y=90$) |
| **Pinball Flippers** | Periodic autonomous 4-second pulse cycle | Dynamic pressure-plate triggers activated by player footsteps |
| **Pop-Bumper Power** | Standard $8.0\text{ m}$ vertical launch | High-Velocity $14.0\text{ m}$ super-launch with aerial hang-time |
| **Suspended Platforms**| 2 HVAC Duct bridges | **5 Suspended Coin-Op Chandelier Platforms** hanging from dome |
| **Spawn System** | Fixed single player start at `(0, 0.0, 36.0)` | 16 distributed symmetrical arena spawns across all vertical tiers |

### 11.1 Arena Geodesic Dome & Suspended Coin-Op Platforms
In multiplayer Arena matches, the ceiling opens into a colossal neon wireframe geodesic dome ($R = 120, C = -30$):
- 8 longitudinal neon ribs in `INK.BLUE` rotated at $22.5^\circ$ intervals.
- 5 latitude rings at $y = 38, 54, 68, 80, 88$.
- Apex Keystone: Radius $2.4\text{ m}$ glowing in radioactive crimson at `(0, 90, 0)` in `INK.RED`.
- **5 Suspended Illuminated Chandelier Platforms**:
  1. Pinball Playfield Overlook: `(0, 18.0, 0)`, size $7.0 \times 7.0\text{ m}$ styled as a giant illuminated joystick plate.
  2. Northwest Skee-Ball Overlook: `(-22.0, 16.0, -24.0)`, size $5.5 \times 5.5\text{ m}$.
  3. Southeast Snack Bar Overlook: `(22.0, 16.0, 24.0)`, size $5.5 \times 5.5\text{ m}$.
  4. Northeast Rhythm Stage Overlook: `(24.0, 16.0, -24.0)`, size $5.0 \times 5.0\text{ m}$.
  5. Southwest Vector Pit Overlook: `(-22.0, 16.0, 24.0)`, size $5.0 \times 5.0\text{ m}$.
  - Each suspended platform hangs from the dome via heavy steel aircraft cables in `INK.BLACK` with an inverted orange grapple ring at `y - 1.3`.

---

## 12. Spawn Points, Sniper Perches & Item Pickups

### 12.1 Sniper Vantage Perches (`L.snipers`)
Tactical high-elevation positions designated for precision sharpshooters:
1. `(0, 10.5, -10.0)`: Pinball Backglass Scoreboard Roof Platform.
2. `(0, 5.5, -38.0)`: Redemption Counter Mezzanine Center Balcony.
3. `(-34.0, 6.0, -18.0)`: Northwest Vector Duct Gantry Overlook.
4. `(34.0, 5.5, 18.0)`: Giant Prize Crane Gantry Inspection Catwalk.
5. `(0, 8.0, 22.0)`: South HVAC Main Duct Cross-Walkway.
6. `(34.0, 4.8, 0)`: Mega CRT Video Wall Top Maintenance Ledge.
7. `(-20.0, 5.5, -32.0)`: Skee-Ball High-Tower Target Gantry.
8. `(20.0, 5.5, 32.0)`: Air Hockey Overhead Scorer Truss.

### 12.2 Tactical Pickups & Weapon Crates (`L.pickups`)
1. Pinball Center: `(0, 2.2, -1.0)` [Between the twin flippers - Legendary High-Caliber Revolver].
2. Pinball Backbox: `(0, 10.5, -10.0)` [Backglass roof locker - Thermal Sniper Rifle].
3. Vector Pit: `(-34.0, -2.0, 0)` [Inside wireframe tank turret - Heavy Plasma Core].
4. Redemption: `(0, 1.15, -38.0)` [Redemption showcase display - Oversized Medkit].
5. Rhythm Stage: `(34.0, 0.5, 0)` [Center dance pad sensor - Speed Boost Stim-Pack].
6. Snack Bar: `(0, 1.15, 44.0)` [Popcorn warming bin - Full Armor Vest].
7. Air Hockey: `(-8.0, 0.95, 32.0)` [Under Table 1 puck goal - High-Capacity Drum Magazine].
8. Skee-Ball: `(-16.0, 1.2, -28.0)` [100-Point Target Cup - Grenade Satchel].

### 12.3 Symmetric Multiplayer Team Spawns (`L.teamSpawns`)
- **Red Team Spawns (North - Redemption & Skee-Ball Sector)**:
  - `(0, 5.5, -36.0)` (Redemption Mezzanine Center)
  - `(-14.0, 0, -36.0)` (Skee-Ball Concourse West)
  - `(14.0, 0, -36.0)` (Ticket Vault Corridor East)
  - `(-8.0, 0, -24.0)` (Upper Pinball Arch Left Flank)
  - `(8.0, 0, -24.0)` (Upper Pinball Arch Right Flank)
- **Blue Team Spawns (South - Air Hockey & Snack Bar Sector)**:
  - `(0, 0, 42.0)` (Snack Bar Counter Threshold)
  - `(-12.0, 0, 32.0)` (Air Hockey Court West)
  - `(12.0, 0, 32.0)` (Air Hockey Court East)
  - `(-6.0, 0, 20.0)` (Lower Pinball Flipper Approach Left)
  - `(6.0, 0, 20.0)` (Lower Pinball Flipper Approach Right)

---

## 13. Level Designer Checklist & Anti-Bug Directives

1. **Anti-Pinch Corridor & Chokepoint Verification**:
   - All aisles between arcade cabinet rows, skee-ball lanes, and wall boundaries are verified $\ge 2.2\text{ m}$ wide, comfortably exceeding the mandatory $1.8\text{ m}$ anti-pinch threshold.
   - The gap between the twin pinball flippers is exactly $2.4\text{ m}$, preventing players from getting wedged between moving mechanical parts.
2. **Tactical Cover Height Hierarchy & Zero Empty Dead-Zones**:
   - Low Crouch Cover ($0.85\text{ m} - 0.95\text{ m}$): Air hockey tables, vinyl barstools, token changer bins, pinball side aprons.
   - Chest Cover ($1.15\text{ m} - 1.4\text{ m}$): Redemption serving counters, dance stage rear support bars, driving cockpit backs.
   - Full Occlusion ($1.8\text{ m} - 2.4\text{ m}$): Upright arcade cabinet clusters, vector wireframe tanks, ticket booth walls.
   - Every $15\text{ m} \times 15\text{ m}$ quadrant incorporates intermediate staging clutter (token carts, gumball machines, fallen ticket rolls) ensuring zero barren wastelands.
3. **Stairway Headroom & Step Kinematics**:
   - Minimum vertical headroom along all mezzanine stairs, service ladders, and vector pit steps is strictly $\ge 3.2\text{ m}$.
   - All steps adhere strictly to $rise = 0.25\text{ m}, run = 0.48\text{ m}$ with intermediate rest landings every $2.75\text{ m}$ vertical elevation change.
4. **0.3m Micro-Detail & Collision Tagging Discipline**:
   - Micro-details (joysticks, buttons, coin slots, neon tube clips, wireform rails, floor ticket rolls) must be explicitly flagged with `{ noCollide: true }`.
   - Apply `{ noNav: true }` to thin cabinet tops, pinball glass perimeter rails, wireform habitrails, and pop bumper caps.
   - Apply `{ noGrapple: true }` to the outer perimeter acoustic boundary walls and the sky containment ceiling.
5. **Dynamic Physics & Memory Allocations (`L.animated`)**:
   - All kinetic animations (flipper swings, pop-bumper recoils, flashing CRT monitors, rolling habitrail balls) must update existing mesh transformation matrices and UV offsets in-place.
   - Zero runtime memory allocations (`new THREE.Vector3()`) allowed in render and tick loops to guarantee a rock-solid 60 FPS.
6. **Universal Detailing Compliance**:
   - Audited against the Universal Detailing Standard to guarantee full Skeleton-Skin-Trim layering, complete ballpoint ink material mapping, and a concept detailing score of 12/12.
