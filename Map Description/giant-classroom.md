# The Giant Classroom (Doodle Academy): Comprehensive Map Architecture & Specification

A master structural, geometrical, and aesthetic blueprint for **The Giant Classroom** (Map Key: `classroom` / `desk`), an epic tactical arena set in an immense, hyper-detailed school classroom drawn entirely in ballpoint pen ink on lined notebook paper.

Designed using the exact mathematical standards, coordinate bounds, vertical step ratios, and traversal loops of **Doodle District** (`district`), this specification establishes a flawless reference for implementing the giant school map without geometric inconsistencies, blind traps, or collision bugs.

---

## Table of Contents
1. [Spatial Coordinates & World Bounds](#1-spatial-coordinates--world-bounds)
2. [Aesthetic & Ink Material System](#2-aesthetic--ink-material-system)
3. [Perimeter Enclosure & Classroom Boundaries](#3-perimeter-enclosure--classroom-boundaries)
4. [Sector 1: The Blackboard Stage & Teacher's Sanctuary (North)](#4-sector-1-the-blackboard-stage--teachers-sanctuary-north)
5. [Sector 2: The Student Desk Archipelago (West)](#5-sector-2-the-student-desk-archipelago-west)
6. [Sector 3: The Science Lab & Grand Library Bookshelf (East)](#6-sector-3-the-science-lab--grand-library-bookshelf-east)
7. [Sector 4: The Back of Class, Lockers & Double Doors (South)](#7-sector-4-the-back-of-class-lockers--double-doors-south)
8. [Central Plaza: The Great Aisle, Crashed Plane & Stapler](#8-central-plaza-the-great-aisle-crashed-plane--stapler)
9. [Overhead Ceiling Grid, Mobiles & Aerial Grapple Traversal](#9-overhead-ceiling-grid-mobiles--aerial-grapple-traversal)
10. [Stairway Mathematics, Slopes & Structural Geometry](#10-stairway-mathematics-slopes--structural-geometry)
11. [Solo vs. Arena Multiplayer Variations](#11-solo-vs-arena-multiplayer-variations)
12. [Spawn Points, Sniper Perches & Item Pickups](#12-spawn-points-sniper-perches--item-pickups)
13. [Level Designer Checklist & Anti-Bug Directives](#13-level-designer-checklist--anti-bug-directives)

---

## 1. Spatial Coordinates & World Bounds

The Giant Classroom shares the exact Cartesian world grid as Doodle District to ensure 100% engine compatibility:

- **Origin `(0, 0, 0)`**: The center of the classroom floor in the middle of the main central aisle.
- **X-Axis (East-West)**:
  - Negative X (`-X`): **West** (The Student Desk Archipelago, window radiators, tall pencil cups).
  - Positive X (`+X`): **East** (The Grand Library Bookshelf, Science Lab Station, microscope).
- **Y-Axis (Elevation / Vertical Tiers)**:
  - `y = -1.0 to 0.0`: Hardwood parquet floor slab foundation.
  - `y = 0.0`: Parquet floor level (Street level equivalent).
  - `y = 0.8 to 1.6`: Low cover tier (Notebooks, fallen pencil boxes, erasers, chalk boxes).
  - `y = 3.6`: Intermediate platform tier (Student chair seats, locker benches, lower cubbies).
  - `y = 4.0`: Under-desk wire book baskets, first-tier bookshelf.
  - `y = 7.0`: Standard Student Desk Tabletops (Highway deck equivalent elevation).
  - `y = 8.0`: Second-tier bookshelf, Teacher's Oak Desk surface.
  - `y = 11.0`: Chalkboard mid-catwalk, Teacher's Podium surface, Science Lab fume hood.
  - `y = 12.0`: Third-tier bookshelf, top of giant lockers, Ruler Bridges deck.
  - `y = 16.0`: Fourth-tier bookshelf roof, Teacher's gooseneck lamp hood, upper chalkboard cornice.
  - `y = 20.0 to 24.0`: Suspended fluorescent lighting fixtures, ceiling fan blades, microscope eyepiece.
  - `y = 26.0 to 30.0`: Overhead Solar System Mobile & paper planes orbit.
  - `y = 56.0`: Invisible sky containment lid (Solo).
  - `y = 88.0`: Geodesic classroom ceiling truss apex (Arena).
- **Z-Axis (North-South)**:
  - Negative Z (`-Z`): **North** (The Green Slate Blackboard at `z = -52`, Teacher's Desk at `z = -36`).
  - Positive Z (`+Z`): **South** (Double Entrance Doors at `z = 52`, Lockers, Coat Cubbies at `z = 44`).

### Boundary Footprint
| Mode | Half-Span ($P$) | Total Dimensions | Wall Height ($PH$) | Wall Thickness ($T$) | Solo Player Start |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Solo Mode** | $55\text{ m}$ | $110 \times 110\text{ m}$ | $18\text{ m}$ | $6\text{ m}$ | `(0, 0, 42)` facing North (`-z`) |
| **Arena Mode** | $68\text{ m}$ | $136 \times 136\text{ m}$ | $30\text{ m}$ | $6\text{ m}$ | 16 Symmetric Arena Spawns |

---

## 2. Aesthetic & Ink Material System

The world is entirely synthesized through procedural ballpoint ink and stationery hatching (`src/render.js`):

- **`INK.BLUE` (ID: 0 - Classic Biro Blue)**:
  - Parquet floor wood grain lines.
  - Student desk tubular steel legs and chair frames.
  - Blue plastic ballpoint pen bodies and barrel clips.
  - Graph paper grids on open notebooks.
  - Window frame mullions and perimeter wall wainscoting.
- **`INK.GREEN` (ID: 4 - Slate Green)**:
  - The massive $90\text{ m}$ wide slate chalkboard writing surface.
  - Chemical liquid fill inside the giant glass beaker and Erlenmeyer flask.
  - Green school locker doors and book covers.
  - Felt desk blotter pad on the Teacher's desk.
- **`INK.ORANGE` (ID: 3 - Warm Stationery Amber)**:
  - Solid oak furniture (Teacher's desk, student desktops, library bookshelf shelves).
  - Giant Wooden Ruler Bridges with millimeter and centimeter tick lines.
  - Brass bells, door knobs, combination lock dials, and microscope adjusting gears.
  - Grapple rings and interactive swinging anchors.
- **`INK.BLACK` (ID: 2 - Fine Carbon Ink / Graphite)**:
  - Blackboard wooden frame and chalk-dust residue.
  - Mathematical formulas, Cartesian coordinate sketches, and cursive alphabet banners.
  - Steel cables, wire under-desk baskets, pencil lead cores, and clock hands.
  - Fluorescent light suspension chains and electrical conduits.
- **`INK.PINK` (ID: 5 - Rubber Eraser Pink)**:
  - Giant pink bevelled wedge erasers (climbing ramps and vault blocks).
  - Pencil eraser ferrule caps.
  - Pastel highlighters and student lunchbox accents.
- **`INK.RED` (ID: 1 - Teacher's Grading Ink)**:
  - Giant red grading pencil and correction marks ('A+', '100%', 'See Me!').
  - The Teacher's red desk apple.
  - Fire alarm pull station, Bunsen burner flame doodles, and emergency exit signs.

---

## 3. Perimeter Enclosure & Classroom Boundaries

The perimeter represents the four massive classroom walls: North chalkboard wall, South entrance wall, West bank of tall sash windows, and East corkboard display wall.

### 3.1 Perimeter Foundation & Walls
- **Floor Foundation**: Solid parquet slab `box(0, -1, 0, 2*P + T, 1, 2*P + T)` in `INK.BLUE`.
- **Wainscoting Trim**: A $2.0\text{ m}$ tall lower wooden baseboard running along the bottom of all four walls: `box(x, 0, z, w, 2.0, d)` in `INK.ORANGE`.
- **North Wall (`z = -P`)**: Dedicated to the Giant Blackboard array.
- **South Wall (`z = P`)**: Features the classroom exit double doors, transom windows, and fire extinguisher nook.
- **West Wall (`x = -P`)**: Features 4 giant arched school sash windows with blue cross-mullions:
  - Window sills at `y = 5.0\text{ m}` with accessible heating radiators beneath them.
- **East Wall (`x = P`)**: Features a giant cork bulletin board spanning $80\text{ m}$ with oversized pushpins, pinned student drawings, and periodic table posters.

### 3.2 Perimeter Balconies & Radiator Ledges
8 tactical perimeter jump ledges providing elevated sniper and grapple access:
1. `[-48, 5.0, -30, 2.4, 0.4, 8.0]`: West Window Sill & Cast-Iron Radiator 1.
2. `[-48, 5.0, 10, 2.4, 0.4, 8.0]`: West Window Sill & Cast-Iron Radiator 2.
3. `[48, 4.0, -25, 2.4, 0.4, 6.0]`: East Corkboard Display Shelf.
4. `[48, 4.0, 15, 2.4, 0.4, 6.0]`: East Science Supply Shelf.
5. `[-25, 4.0, 48, 8.0, 0.4, 2.4]`: South Wall Backpack Cubby Upper Ledge.
6. `[25, 4.0, 48, 8.0, 0.4, 2.4]`: South Wall Top-of-Locker Staging Platform.
7. `[-35, 12.0, -48, 6.0, 0.4, 2.4]`: Northwest High Map Display Rail.
8. `[35, 12.0, -48, 6.0, 0.4, 2.4]`: Northeast High Screen Projector Rail.

### 3.3 Enemy Spawn Portals
10 themed entrance openings where wave enemies spawn:
- 2 South Double Door Transom Vents: `(0, 0, 52)` and `(0, 6.5, 52)`.
- 2 West Window Air Draft Openings: `(-52, 5.0, -20)` and `(-52, 5.0, 20)`.
- 2 East Storage Supply Closet Doors: `(52, 0, -15)` and `(52, 0, 25)`.
- 2 North Chalkboard Sliding Secret Panels: `(-38, 0, -51)` and `(38, 0, -51)`.
- 2 Floor Heating Grate Vents: `(-18, 0, 0)` and `(18, 0, 0)`.

---

## 4. Sector 1: The Blackboard Stage & Teacher's Sanctuary (North)

The northern high-ground anchor of the map, commanding full line-of-sight over the room.

### 4.1 The Giant Green Slate Blackboard
- **Dimensions**: Spans `x = -45 to 45` (width $90\text{ m}$), height $16.0\text{ m}$, base at `y = 0.0`.
- **Wooden Frame**: Heavy dark wood trim `box(0, 0, -52, 90, 16, 1.2)` in `INK.BLACK`.
- **Writing Surface**: High-contrast slate `box(0, 2.0, -51.4, 86, 13.5, 0.3)` in `INK.GREEN`.
- **Chalk Rail**: Continuous horizontal running ledge `box(0, 1.8, -50.6, 88, 0.4, 1.6)` in `INK.ORANGE`.
  - Accessible as a narrow $1.6\text{ m}$ walkway at elevation `y = 1.8\text{ m}`!
- **Chalk Rail Props**:
  - 4 Giant White & Yellow Chalk Sticks: Cylinders `radius 0.35, length 3.0` lying on the rail.
  - 3 Giant Felt Chalkboard Erasers: `box(w: 3.2, h: 0.8, d: 1.2)` in `INK.BLACK` with yellow felt bases.
- **Doodled Blackboard Graphics (`noCollide: true`)**:
  - Left quadrant: Pythagorean theorem geometric triangle doodle and proof.
  - Center quadrant: Einstein's $E = mc^2$ and Cartesian coordinate grid.
  - Right quadrant: Giant cursive alphabet banner spanning `x = 10 to 40` at `y = 13.5`.

### 4.2 The Teacher's Executive Oak Desk
A massive two-pedestal teacher's desk acting as the fortress of Sector 1:
- **Footprint**: Centered at `(0, 0, -36)`. Width: $32.0\text{ m}$ (`x = -16 to 16`), Depth: $16.0\text{ m}$ (`z = -44 to -28`).
- **Oak Desktop Slab**: `slab(-16, -44, 16, -28, 8.0, 0.6)` in `INK.ORANGE`.
  - Top elevation: `y = 8.0\text{ m}`.
- **Left Pedestal (3 Drawers)**: `box(-12, 0, -36, 8, 7.4, 15)` in `INK.ORANGE`.
  - Brass handles at `y = 2.0, 4.0, 6.0` in `INK.BLACK`.
- **Right Pedestal (3 Drawers)**: `box(12, 0, -36, 8, 7.4, 15)` in `INK.ORANGE`.
- **The Central Kneehole Tunnel (Tactical Flank Passage)**:
  - The central opening from `x = -8 to 8`, `z = -44 to -28` is a vaulted open tunnel ($8.0\text{ m wide} \times 7.4\text{ m high}$)!
  - Players can sprint directly beneath the teacher's desk from the main room straight to the chalkboard wall, bypassing rooftop crossfire.

### 4.3 Teacher's Desk Tactile Props & Vantage Points
1. **The Teacher's Apple**:
   - `sphere(0, 9.3, -34, radius 1.5, seg: 14)` in `INK.RED`.
   - Leaf and stem extending to `y = 11.4` in `INK.GREEN`. Provides $3.0\text{ m}$ solid spherical cover on the desk.
2. **Brass Call Bell**:
   - Dome bell `cyl(-10, 8.0, -32, radius 1.8, height 1.6)` in `INK.ORANGE`.
   - Top plunge pin at `y = 10.0` with an orange grapple ring.
3. **Heavy Ceramic Pencil Cup & Writing Instruments**:
   - Cylindrical cup `cyl(10, 8.0, -32, radius 2.2, height 3.6)` in `INK.BLUE`.
   - Giant Red Grading Biro: Tilted cylinder `radius 0.45, length 10.0` leaning at $25^\circ$ reaching `y = 16.5`.
   - Yellow Hexagonal Graphite Pencil: Leaning opposite at $20^\circ$.
4. **Graded Test Paper Stack**:
   - Paper stack: `box(-4, 8.0, -38, 7.0, 1.2, 5.0)` in `INK.BLUE`.
   - Top sheet features giant red grade: **A+ 100%** drawn in `INK.RED`.
5. **Vintage Gooseneck Desk Lamp (Sniper Tower)**:
   - Heavy cast-iron base at `(13, 8.0, -41)`, `radius 2.0, height 0.6`.
   - Curved tubular brass neck arching from `(13, 8.6, -41)` up to `(10, 18.0, -38)`.
   - Conical Green Enamel Lamp Shade: `cone(10, 17.5, -38, radius 2.8, height 2.2)` in `INK.GREEN`.
   - The lamp shade interior hosts a sniper nest with an orange grapple ring mounted at `(10, 19.8, -38)`.

### 4.4 Blackboard Library Staircase & Walkway
- **Ascent to Teacher's Desk**:
  - Exterior stepped drawer handles and leaning meter stick ramp on the West face:
    - Meter stick ramp: Starts at `(-20, 0, -36)`, slopes at $28^\circ$, width $1.8\text{ m}$, arrives at desktop `y = 8.0`.
- **Upper Blackboard Catwalk (`y = 11.0`)**:
  - Suspended steel catwalk `slab(-36, -50.8, 36, -49.2, 11.0, 0.4)` running along the blackboard face.
  - Guardrail with $0.9\text{ m}$ posts in `INK.BLACK`.
  - Accessible via the gooseneck lamp jump or vertical ladder rungs embedded in the chalkboard frame.

---

## 5. Sector 2: The Student Desk Archipelago (West)

An intricate multi-level combat sector consisting of four giant student desks interconnected by stationery bridges, open books, and wire racks.

### 5.1 The 4 Student Desks (Cluster A, B, C, D)
- **Desk Dimensions**: Each desk is $18.0\text{ m wide} \times 12.0\text{ m deep}$.
  - Desk 1 (Northwest): Center `(-28, 0, -18)`.
  - Desk 2 (Southwest): Center `(-28, 0, 14)`.
  - Desk 3 (Inner North): Center `(-10, 0, -18)`.
  - Desk 4 (Inner South): Center `(-10, 0, 14)`.
- **Anatomy of Each Desk**:
  1. **4 Cylindrical Steel Legs**: `radius 0.6, height 7.0` at the four corners in `INK.BLUE`.
  2. **Solid Formica Desktop Slab**: `slab(x - 9, z - 6, x + 9, z + 6, 7.0, 0.5)` in `INK.ORANGE`.
     - Top elevation: **`y = 7.0\text{ m}`** (Matches Doodle District Elevated Highway elevation!).
  3. **Under-Desk Wire Storage Basket**:
     - Suspended horizontal wire grate at **`y = 4.0\text{ m}`**: `box(x, 4.0, z, 16.0, 0.2, 10.0)` in `INK.BLACK`.
     - Provides a full intermediate floor tier beneath each desk! Players can take cover in the wire basket or shoot between the legs.
  4. **Attached Student Chair**:
     - Welded tubular frame extending South from each desk.
     - Curved plywood seat slab at **`y = 3.6\text{ m}`**, size $6.0 \times 5.0\text{ m}$.
     - Backrest panel at `y = 5.8\text{ m}`, size $6.0 \times 2.0\text{ m}$.

### 5.2 The Stationery Bridges (Connecting Desks 1, 2, 3, 4)
- **Bridge 1: The 30cm Set-Square Triangle (Desk 1 $\rightarrow$ Desk 3)**:
  - Transparent amber plastic set square (`INK.ORANGE`) bridging the gap at `y = 7.0`.
  - Dimensions: Hypotenuse spanning from `(-19, 7.0, -18)` to `(-19, 7.0, -12)`, width $3.0\text{ m}$, thickness $0.3\text{ m}$.
- **Bridge 2: The Giant Yellow Wooden Ruler Bridge (Desk 1 $\rightarrow$ Desk 2)**:
  - Spans the north-south chasm between Desk 1 and Desk 2 (from `z = -12 to 8`).
  - Total length: $20.0\text{ m}$, Width: $2.4\text{ m}$, Thickness: $0.4\text{ m}$ at `y = 7.0` in `INK.ORANGE`.
  - Millimeter tick markings along both edges in `INK.BLACK`.
  - Guardrails along both sides with $0.9\text{ m}$ posts.
- **Bridge 3: The Spiral Notebook Spiral Bridge (Desk 3 $\rightarrow$ Desk 4)**:
  - Formed by a continuous helical coil of wire binding in `INK.BLACK`.

### 5.3 Ground-to-Desk Ascent Ramps
To guarantee seamless ground-to-rooftop traversal without relying exclusively on grappling:
- **The Open "Advanced Physics" Hardcover Textbook Ramp**:
  - Located beside Desk 2: Spans from ground `(-38, 0, 14)` up to desktop `(-37, 7.0, 14)`.
  - Open book form: Heavy cardboard covers angled like a tent gable ($28^\circ$ slope), width $3.2\text{ m}$.
  - Players can sprint smoothly from the parquet floor directly onto Desk 2!
- **The Leaning Plastic Protractor Ramp**:
  - Semi-circular protractor leaning against Desk 4: Base at `(0, 0, 14)`, top at `(-1, 7.0, 14)`, angle $31^\circ$.

### 5.4 Props on Student Desktops
- **Metal Hand-Cranked Pencil Sharpener (Desk 1)**:
  - Heavy cast-metal body `box(-26, 7.0, -22, 2.4, 3.2, 2.0)` in `INK.BLACK`.
  - Turning crank handle with spherical wooden grip at `y = 9.5` (orange grapple point).
- **Metal Lunchbox with Thermos (Desk 2)**:
  - Retro domed lunchbox: `box(-28, 7.0, 12, 4.2, 2.6, 2.8)` in `INK.BLUE`.
  - Cylindrical thermos bottle lying beside it: `radius 1.0, length 4.5` in `INK.RED`.
- **Tin Pencil Case (Open)**:
  - Open metal tin with hinged lid angled back at $45^\circ$, containing 6 colored pencils.
  - Lid acts as angled deflection shield against sniper fire from the chalkboard!

---

## 6. Sector 3: The Science Lab & Grand Library Bookshelf (East)

An expansive vertical stronghold balancing academic storage with chemistry laboratory high-ground.

### 6.1 The Grand Library Bookshelf
A four-tier towering oak bookcase standing along the eastern perimeter:
- **Footprint**: Spans from `x = 34 to 48` (width $14.0\text{ m}$), and `z = -20 to 24` (depth $44.0\text{ m}$).
- **4 Architectural Shelf Tiers**:
  - **Shelf 1**: `slab(34, -20, 48, 24, 4.0, 0.5)` in `INK.ORANGE` (Elevation: `y = 4.0\text{ m}`).
  - **Shelf 2**: `slab(34, -20, 48, 24, 8.0, 0.5)` in `INK.ORANGE` (Elevation: `y = 8.0\text{ m}`).
  - **Shelf 3**: `slab(34, -20, 48, 24, 12.0, 0.5)` in `INK.ORANGE` (Elevation: `y = 12.0\text{ m}`).
  - **Top Crown Roof Deck**: `slab(34, -20, 48, 24, 16.0, 0.5)` in `INK.ORANGE` (Elevation: `y = 16.0\text{ m}`).
- **Structural Uprights**: 3 massive vertical oak panels:
  - North wall: `(41, 0, -20, 14, 16, 0.8)`.
  - Center wall: `(41, 0, 2, 14, 16, 0.8)`.
  - South wall: `(41, 0, 24, 14, 16, 0.8)`.

### 6.2 Giant Books & Shelving Corridors
Each shelf is lined with oversized encyclopedias, dictionaries, and textbooks:
- **Upright Book Blocks**: `box(38, y, z, 6.0, 3.5, 3.0)` with colorful spines in `INK.BLUE`, `INK.GREEN`, and `INK.RED`.
- **Pulled-Out Book Tunnels**: Selected books are pushed forward or removed, creating sheltered interior firing tunnels through the bookshelf!
- **Leaning Domino Books**: Two massive volumes at Shelf 3 lean against each other at $35^\circ$, forming an A-frame walk-through gable.

### 6.3 Bookshelf Staggered Switchback Stairs
Following the **Staggered Dual-Lane Rule** from Doodle District, the exterior face of the bookshelf (`x = 32.0 to 34.0`) hosts a safe switchback staircase:

| Flight | Altitude Gain | Direction | Start Coords $(x, y, z)$ | Steps | Rise / Run | Landing Coords |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Flight 1** | $0.0 \rightarrow 4.0\text{ m}$ | `+z` (South) | `(32.5, 0.0, -16.0)` | 14 | $0.2857 / 0.45\text{ m}$ | `(32.5, 4.0, -9.7)` |
| **Flight 2** | $4.0 \rightarrow 8.0\text{ m}$ | `-z` (North) | `(30.5, 4.0, -9.7)` | 14 | $0.2857 / 0.45\text{ m}$ | `(30.5, 8.0, -16.0)` |
| **Flight 3** | $8.0 \rightarrow 12.0\text{ m}$ | `+z` (South) | `(32.5, 8.0, -16.0)` | 14 | $0.2857 / 0.45\text{ m}$ | `(32.5, 12.0, -9.7)` |
| **Flight 4** | $12.0 \rightarrow 16.0\text{ m}$| `-z` (North) | `(30.5, 12.0, -9.7)`| 14 | $0.2857 / 0.45\text{ m}$ | Arrives at Crown Deck |

- **Lane Separation**: Outer lane at `x = 30.5`, Inner lane at `x = 32.5`. Headroom clearance is 100% unobstructed.

### 6.4 The Science Lab Chemistry Counter
Located just north of the bookshelf: `x = 22 to 44`, `z = -42 to -26`:
- **Countertop Slab**: Heavy black epoxy resin slab at **`y = 7.0\text{ m}`**: `slab(22, -42, 44, -26, 7.0, 0.6)` in `INK.BLACK`.
- **Stainless Steel Sink Basin**: Recessed box from `x = 26 to 32`, `z = -38 to -32`, dropping down to `y = 4.0\text{ m}`.
- **Gooseneck Faucet (High Sniper Perch)**:
  - Vertical pipe `cyl(29, 7.0, -40, radius 0.45, height 6.0)` in `INK.BLUE`.
  - Arching spout curving over the sink up to `y = 15.0\text{ m}` with an orange grapple ring at the nozzle tip.
- **Glass Chemistry Apparatus**:
  1. **Giant Erlenmeyer Flask**:
     - Conical glass body: `cone(36, 7.0, -34, base radius 4.0, height 7.0)` in `INK.BLUE`.
     - Cylindrical neck: `cyl(36, 14.0, -34, radius 1.2, height 3.0)`.
     - Liquid level: Tinted green fluid fill up to `y = 11.0` in `INK.GREEN`.
  2. **Bunsen Burner**:
     - Heavy cast base at `(40, 7.0, -30)`, radius `1.8`, height `0.8` in `INK.BLACK`.
     - Brass chimney tube reaching `y = 11.5`.
     - Gas Supply Hose: Flexible rubber tubing `orientedCyl` curving across the counter to the gas valve. Players can tightrope-walk along the hose!
  3. **Compound Monocular Microscope**:
     - Massive steel and brass instrument standing from `y = 7.0` to **`y = 21.0\text{ m}`**!
     - Horseshoe base at `(24, 7.0, -28)`.
     - Stage platform at `y = 12.0` with stage clips.
     - Rotating objective nosepiece with 3 lenses at `y = 14.5`.
     - Angled ocular body tube reaching the eyepiece at `y = 21.0` (commands an unobstructed view over the entire classroom).

---

## 7. Sector 4: The Back of Class, Lockers & Double Doors (South)

The southern tactical zone characterized by student storage, lockers, entrance choke points, and vertical cubbies.

### 7.1 The Great Double Entrance Doors
- **Position**: Centered at `(0, 0, 52)` on the South wall.
- **Dimensions**: Width $14.0\text{ m}$ ($x = -7 \text{ to } 7$), Height $10.0\text{ m}$, Depth $1.2\text{ m}$.
- **Details**:
  - Vertical oak frame and center stile in `INK.ORANGE`.
  - Dual frosted glass window panels from `y = 4.0 to 8.5` in `INK.BLUE`.
  - Giant horizontal brass push-bars at `y = 3.6\text{ m}` in `INK.ORANGE` (jumpable ledges).
  - Overhead Transom Window: `box(0, 10.5, 52, 14.0, 2.5, 0.6)` in `INK.BLUE` (features a broken pane acting as an aerial grapple infiltration portal).

### 7.2 The Bank of Metal Student Lockers
Located along the South-East wall: `x = 12 to 44`, `z = 44 to 48`:
- **Dimensions**: Width $32.0\text{ m}$, Depth $4.0\text{ m}$, Height **$12.0\text{ m}$**.
- **16 Vertical Locker Bays**:
  - Alternating locker doors in `INK.GREEN` and `INK.BLUE`.
  - 3 Open Locker Doors swinging out at $75^\circ$ into the room:
    - Lockers at `x = 18`, `x = 28`, `x = 38` are open, providing vertical climb shelves and interior hideouts!
- **Top of Lockers Platform (`y = 12.0\text{ m}`)**:
  - Continuous running catwalk `slab(12, 44, 44, 48, 12.0, 0.4)` protected by rear wall.
  - Stored sports gear on top: Giant red dodgeball (`sphere(20, 13.5, 46, radius 1.5)` in `INK.RED`) and tennis ball canister providing crouch cover.

### 7.3 The Wooden Backpack Cubby Array
Located along the South-West wall: `x = -44 to -12`, `z = 44 to 48`:
- **Dimensions**: Width $32.0\text{ m}$, Depth $4.0\text{ m}$, Height **$8.0\text{ m}$**.
- **8 Lower Shoe Cubbies**: `y = 0 to 2.5\text{ m}` (crouch crawlspaces).
- **8 Main Backpack Hooks**: `y = 2.5 to 8.0\text{ m}`:
  - 4 Giant Fabric Backpacks hanging from pegs:
    - Red Canvas Backpack at `x = -16`: size `4.0 x 5.0 x 3.0` in `INK.RED`.
    - Blue Daypack at `x = -24`: size `4.0 x 5.0 x 3.0` in `INK.BLUE`.
    - Backpack zip pockets and shoulder straps provide natural climbing rungs from the floor up to the cubby roof!
- **Top of Cubbies Deck (`y = 8.0\text{ m}`)**:
  - Flat sniper ledge overlooking the South plaza and Desk 2.

### 7.4 The Giant Wall Clock
Mounted high on the South wall above the entrance doors:
- **Coordinates**: `(0, 22.0, 51.0)`.
- **Clock Bezel**: Circular rim `radius 5.0\text{ m}`, thickness `0.6\text{ m}` in `INK.BLACK`.
- **White Clock Face**: Roman numerals I through XII drawn in fine black ink.
- **Clock Hands**:
  - Hour Hand: Pointing at 3 o'clock (`box(1.8, 22.0, 50.4, 3.6, 0.3, 0.1)`).
  - Minute Hand: Pointing at 12 o'clock (`box(0, 24.2, 50.4, 0.25, 4.4, 0.1)`).
  - Minute hand tip features an orange grapple ring at `(0, 26.5, 50.4)`.

---

## 8. Central Plaza: The Great Aisle, Crashed Plane & Stapler

The central crossroads where all sectors meet, designed to balance open-range danger with tactical stationary cover.

### 8.1 The Great Central Aisle
- Spans from `z = 40` (South doors) to `z = -26` (Teacher's desk) along `x = -6 to 6`.
- Clear, unobstructed lane allowing players to sprint or slide across the map, with cover pods positioned every $12\text{ m}$.

### 8.2 The Crashed Giant Paper Airplane
A folded delta-wing paper airplane that has nose-dived into the parquet floor at `(2, 0, 8)`:
- **Geometry**: Constructed from two triangular folded paper wings inclined at $35^\circ$.
- **Dimensions**: Length $14.0\text{ m}$, Wingspan $12.0\text{ m}$, Tail Fin Height **$5.5\text{ m}$**.
- **Color**: White notebook paper with light blue ruled lines and red margin stripes.
- **Tactical Utility**:
  - The sloped starboard wing forms a natural $25^\circ$ ramp running from floor `y = 0` up to `y = 4.2\text{ m}`.
  - The hollow fold underneath creates a tunnel hideout with dual exit points.

### 8.3 The Heavy Duty Metal Desk Stapler
A full-scale office stapler placed at `(-4, 0, 22)`:
- **Base Plate**: `box(-4, 0, 22, 10.0, 0.8, 3.4)` in `INK.BLACK`.
- **Top Spring-Loaded Arm**: Angled metal lever rising from pivot `(-8, 0.8, 22)` to head `(0, 3.6, 22)` in `INK.BLUE`.
- **Chrome Staple Head**: `box(0, 2.8, 22, 2.2, 2.0, 3.2)` in `INK.BLACK`.
- **Tactical Utility**: Provides ideal $1.6\text{ m}$ chest-high cover in the southern approach, with an easy vault onto the stapler head.

### 8.4 Scattered Stationery Cover Pods
- **Giant Bevelled Pink Eraser**:
  - Located at `(8, 0, -6)`: `box(8, 0, -6, 6.0, 2.2, 3.4)` in `INK.PINK`.
  - Bevelled nose at $30^\circ$ allowing mantle-climbing.
- **Stack of 3 Ring-Binder Notebooks**:
  - Located at `(-8, 0, -4)`:
    - Binder 1 (Blue): `( -8, 0.0, -4, 5.0, 0.9, 6.0)` in `INK.BLUE`.
    - Binder 2 (Red): `( -8.2, 0.9, -3.8, 4.8, 0.9, 5.8)` in `INK.RED`.
    - Binder 3 (Green): `(-7.8, 1.8, -4.2, 4.8, 0.9, 5.8)` in `INK.GREEN`.
    - Total height: $2.7\text{ m}$. Stepped offsets allow players to climb to the top.
- **Spilled Paperclips Cluster**:
  - 4 oversized wire paperclips lying flat: `torus(x, 0.15, z, radius 1.2, tube 0.15)` in `INK.BLACK` (`noCollide: true`).

---

## 9. Overhead Ceiling Grid, Mobiles & Aerial Grapple Traversal

The high-altitude aerial layer that transforms the classroom into a 3D parkour arena.

### 9.1 Suspended Fluorescent Light Troffers
3 long industrial lighting banks hung from the ceiling by steel chains:
- **Light Bank 1 (West)**: Centered over Student Desks at `x = -20`, spanning `z = -40 to 30` at **`y = 22.0\text{ m}`**.
- **Light Bank 2 (Center)**: Centered over Main Aisle at `x = 0`, spanning `z = -40 to 30` at **`y = 24.0\text{ m}`**.
- **Light Bank 3 (East)**: Centered over Bookshelf & Lab at `x = 24`, spanning `z = -40 to 30` at **`y = 22.0\text{ m}`**.
- **Structure**: Sheet metal housing `w: 2.4, h: 0.6, d: 70.0` in `INK.BLUE`, with white glowing diffusers.
- **Traversal**:
  - The top surface of each troffer is a walkable catwalk ($2.4\text{ m}$ wide)!
  - Every $10\text{ m}$ along the bottom edge features an orange grapple ring (`L.rings`), allowing players to swing down the length of the room like Tarzan.

### 9.2 The Overhead Solar System Mobile
A science class ceiling mobile suspended from `(0, 30.0, 0)`:
- **Central Sun**: Papier-mâché glowing sphere `radius 3.5\text{ m}` at `(0, 26.0, 0)` in `INK.ORANGE` with 4 grapple rings.
- **Wire Arms**: Thin carbon steel rods `orientedCyl` extending outward to orbiting planets:
  1. **Earth & Moon**: Suspended at `(-18, 22.0, -12)`, planet radius $1.6\text{ m}$ in `INK.BLUE`.
  2. **Saturn with Rings**: Suspended at `(20, 24.0, 10)`, planet radius $2.2\text{ m}$ with flat disc ring `inner 2.6, outer 4.5` in `INK.ORANGE`.
  3. **Jupiter**: Suspended at `(14, 21.0, -22)`, planet radius $2.8\text{ m}$ with red storm spot.
  4. **Mars**: Suspended at `(-12, 23.0, 20)`, planet radius $1.1\text{ m}$ in `INK.RED`.
- **Gameplay**: Every planet features a solid physical collider and an inverted grapple ring underneath.

### 9.3 Circling Paper Airplanes (Kinematic Grapple Anchors)
Matching the signature aerial mechanic from Doodle District:
- **4 Autonomous Gliders**: Continually loop through the upper airspace of the classroom at speeds $0.4\text{ to }0.7\text{ rad/s}$.
- **Orbits**:
  - Glider 1: Elliptical orbit around the blackboard at `y = 20.0\text{ m}`.
  - Glider 2: Large circular sweep along the perimeter walls at `y = 25.0\text{ m}`.
  - Glider 3: Figure-8 loop crossing through the central aisle at `y = 18.0\text{ m}`.
  - Glider 4: Tight clockwise circle above the science lab at `y = 22.0\text{ m}`.
- **Hitboxes**: Registered in `L.grappleMovers`. Firing a grapple hook at any glider latches onto its moving matrix, dragging the player across the room at high velocity!

---

## 10. Stairway Mathematics, Slopes & Structural Geometry

To ensure 100% bug-free collision resolution with the character controller:

### 10.1 The Universal Step Formula
- Character maximum step-up tolerance: $\mathbf{0.35\text{ m}}$.
- Standardized step rise across the map: $\mathbf{0.2857\text{ m}}$ ($4.0\text{ m} / 14\text{ steps}$).
- Standardized step run: $\mathbf{0.45\text{ m}}$.
- Stair pitch angle: $\arctan(0.2857 / 0.45) \approx \mathbf{32.4^\circ}$.

### 10.2 Ramp & Wedge Slope Rules
- Book ramps, ruler bridges, and fallen pencils must NEVER exceed a **$33^\circ$ incline**.
- Any surface inclined beyond $35^\circ$ causes character controller gravity slide.
- Ramp transition thresholds must have flush floor joins (`y = 0.0` at base), never leaving a vertical lip exceeding $0.2\text{ m}$.

### 10.3 Doorway & Passage Clearances
- Minimum Doorway Width: **$2.4\text{ m}$** (standard double doors: $3.6\text{ m}$).
- Minimum Doorway Headroom: **$3.2\text{ m}$** (prevents player head snagging during sprints).
- Under-Desk Kneehole Tunnel: Clear width $8.0\text{ m}$, clear height $7.4\text{ m}$.

---

## 11. Solo vs. Arena Multiplayer Variations

| Architectural Element | Solo Wave Survival (`!arena`) | Peer-to-Peer Arena Match (`arena`) |
| :--- | :--- | :--- |
| **Map Half-Span ($P$)** | $55\text{ m}$ ($110 \times 110\text{ m}$ total) | $68\text{ m}$ ($136 \times 136\text{ m}$ total) |
| **Perimeter Wall Height** | $18\text{ m}$ with invisible vertical sky blocker to $y = 58$ | $30\text{ m}$ brick wainscoting |
| **Sky Enclosure** | Flat sky lid collider at $y = 56\text{ m}$ | Structural Geodesic Ceiling Truss with Red Keystone ($y = 90$) |
| **Central Aisle** | Features Crashed Paper Plane, Stapler, and Binder Stacks | Ground clear for high-speed cross-firing |
| **Cross-Room Bridges** | Segmented local bridges between adjacent desks | **$60\text{ m}$ Grand Ruler Skybridge** spanning directly from Desk 1 to Bookshelf! |
| **Suspended Platforms** | 3 Light banks + Solar mobile | **5 Suspended Hanging Notebook Platforms** anchored to ceiling truss |
| **Spawn Logic** | Fixed player start at `(0, 0, 42)` facing North | 16 Distributed Arena Spawns (8 Red Team, 8 Blue Team) |

### 11.1 Arena Suspended Notebook Platforms
5 additional battle platforms suspended in mid-air for competitive verticality:
1. Center Arena: Open Ring Binder at `(0, 18.0, 0)`, size $8.0 \times 8.0\text{ m}$.
2. Northwest: Yellow Legal Pad at `(-30, 16.0, -25)`, size $6.0 \times 6.0\text{ m}$.
3. Northeast: Graph Paper Pad at `(30, 16.0, -25)`, size $6.0 \times 6.0\text{ m}$.
4. Southwest: Geometry Sketchbook at `(-30, 16.0, 25)`, size $6.0 \times 6.0\text{ m}$.
5. Southeast: Music Staff Manuscript at `(30, 16.0, 25)`, size $6.0 \times 6.0\text{ m}$.

---

## 12. Spawn Points, Sniper Perches & Item Pickups

### 12.1 Dedicated Sniper Perches (`L.snipers`)
Elevated tactical positions assigned to AI sniper units:
1. `(10, 18.0, -38)`: Teacher's Gooseneck Lamp Hood (North vantage).
2. `(24, 21.0, -28)`: Microscope Eyepiece Rim (Northeast vantage).
3. `(41, 16.0, 2)`: Library Bookshelf Crown Deck Center (East vantage).
4. `(-28, 7.0, -18)`: Student Desk 1 Pencil Sharpener Roof (Northwest vantage).
5. `(0, 22.0, 50.4)`: South Wall Clock Minute Hand (South high perch).
6. `(28, 12.0, 46)`: Top of Metal Student Lockers (Southeast vantage).
7. `(-30, 8.0, 46)`: Top of Backpack Cubbies (Southwest vantage).
8. `(0, 26.0, 0)`: Solar System Mobile Sun Apex (Omnidirectional center).

### 12.2 Strategic Weapon & Ammo Pickups (`L.pickups`)
1. **Teacher's Desk**: `(0, 8.0, -36)` [Beside the apple], `(-10, 8.0, -34)` [Beside call bell].
2. **Kneehole Tunnel**: `(0, 0.2, -36)` [In the heart of the ground tunnel].
3. **Student Desks**:
   - `(-28, 7.0, -18)` [Desk 1 surface].
   - `(-28, 4.0, -18)` [Desk 1 wire basket interior].
   - `(-10, 7.0, 14)` [Desk 4 textbook].
4. **Library Bookshelf**:
   - `(41, 4.0, -10)` [Shelf 1 corridor].
   - `(41, 8.0, 10)` [Shelf 2 pulled book alcove].
   - `(41, 16.0, -15)` [Shelf 4 top deck].
5. **Science Lab**: `(30, 7.0, -35)` [Sink edge], `(40, 7.0, -30)` [Behind Bunsen burner].
6. **Central Plaza**:
   - `(2, 4.2, 8)` [On crashed paper plane wing].
   - `(-4, 3.6, 22)` [On top of stapler chrome head].
   - `(8, 2.2, -6)` [On giant pink eraser].
7. **South Lockers & Cubbies**: `(28, 0.2, 46)` [Inside open locker 7], `(-20, 8.0, 46)` [On top of red backpack].

### 12.3 Symmetric Multiplayer Team Spawns (`L.teamSpawns`)
- **Red Team Spawns (North & West / Academic Front)**:
  - `(-12, 8.0, -36)` (Teacher's desk left wing)
  - `(-28, 7.0, -18)` (Student Desk 1 roof)
  - `(-38, 0.2, -20)` (West window radiator base)
  - `(-28, 4.0, 14)` (Desk 2 wire basket)
  - `(-4, 0.2, -30)` (Kneehole tunnel entrance)
  - `(-19, 7.0, -15)` (Set-square bridge)
- **Blue Team Spawns (South & East / Storage & Lab)**:
  - `(12, 8.0, -36)` (Teacher's desk right wing)
  - `(36, 7.0, -30)` (Science lab counter)
  - `(41, 4.0, 12)` (Bookshelf shelf 1)
  - `(28, 12.0, 46)` (Top of lockers)
  - `(0, 0.2, 44)` (South entrance double doors)
  - `(4, 0.2, 22)` (Behind the desk stapler)

---

## 13. Level Designer Checklist & Anti-Bug Directives

When translating this specification into executable Three.js code in `src/level.js`:

1. **Tag All Thin Railings and Decorative Edges with `{ noNav: true }`**:
   - Never allow enemy pathfinders to calculate waypoints on thin wire basket meshes, lamp cords, or blackboard chalk rails.
2. **Tag Outer Ceilings and Lids with `{ noGrapple: true, noNav: true }`**:
   - Boundary wall vertical extensions and sky lids must have `noGrapple: true` to prevent players from latching outside the map boundary.
3. **Use the `orientedCyl` Helper for All Leaning Pens & Rulers**:
   - Never try to manually Euler-rotate cylinders. Use the normalized two-point direction vector constructor to ensure exact endpoints.
4. **Preserve Headroom Clearance on All Multi-Tier Structures**:
   - Never build a ceiling or upper shelf closer than **$3.2\text{ m}$** above a walkable floor.
5. **Enforce $0.2857\text{ m}$ Step Height on All Custom Stairs**:
   - Calculate step count as $N = \text{height} / 0.2857$. Never create staircases with steps larger than $0.32\text{ m}$.
6. **Double-Sided Colliders on Bridges**:
   - Bridges like rulers and textbooks must have colliders with thickness $\ge 0.3\text{ m}$ to prevent fast-falling players from tunneling through the geometry.
7. **Ensure Complete Loop Traversal**:
   - Verify every high platform (Student Desks, Bookshelf, Teacher's Desk, Lockers) has at least 2 distinct upward paths (stairs/ramps) and 2 downward jump/grapple escape paths.

---

*Specification created for Doodle Strike / Doodle District engine architecture. All measurements in game metric units.*
