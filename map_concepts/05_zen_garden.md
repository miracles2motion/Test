# The Zen Garden: Comprehensive Map Architecture & Specification

A master structural, geometrical, and aesthetic blueprint for **The Zen Garden** (Map Key: `zen_garden` / `garden` / `zen`), an epic tactical sanctuary combat arena set in an immense Muromachi-period Japanese temple estate drawn with traditional sumi-e brush washes, cinnabar vermilion lacquer, and kintsugi gold leaf on fibrous mulberry washi paper.

Featuring a 4-tiered timber Sanjū-no-tō pagoda crowned with a master calligrapher's hog-bristle brush finial and an acoustic temple bell (*bonshō*), an expansive raked gravel karesansui ocean with a giant war fan (*ōgi*) springboard jump-pad, a dense moso bamboo grove with nightingale creak-boards (*uguisubari*), an arched vermilion drum bridge spanning a dynamic ink koi stream, destructible rice paper shōji screens, and a kinetic bamboo deer-scarer (*shishi-odoshi*) water fountain.

Designed using the exact mathematical standards, coordinate bounds, vertical step ratios, and traversal loops of **Doodle District** (`district`), this specification establishes a flawless reference for implementing the Japanese garden map in `src/level.js` without geometric inconsistencies, blind traps, or collision bugs.

---

## Table of Contents
1. [Spatial Coordinates & World Bounds](#1-spatial-coordinates--world-bounds)
2. [Aesthetic & Ink Material System](#2-aesthetic--ink-material-system)
3. [Perimeter Enclosure & Temple Wall Boundaries](#3-perimeter-enclosure--temple-wall-boundaries)
4. [Sector 1: The Ink Stream, Drum Bridge & Grand Torii (North)](#4-sector-1-the-ink-stream-drum-bridge--grand-torii-north)
5. [Sector 2: Karesansui (Raked Gravel Ocean) & Sacred Megaliths (East)](#5-sector-2-karesansui-raked-gravel-ocean--sacred-megaliths-east)
6. [Sector 3: The Dense Moso Bamboo Grove (Take-bayashi) (West)](#6-sector-3-the-dense-moso-bamboo-grove-take-bayashi-west)
7. [Sector 4: Chashitsu Tea Pavilion & Water Garden (South)](#7-sector-4-chashitsu-tea-pavilion--water-garden-south)
8. [Central Sector: The Four-Tiered Sanjū-no-tō Pagoda (Center: X = 0, Z = 0)](#8-central-sector-the-four-tiered-sanjū-no-tō-pagoda-center-x--0-z--0)
9. [Overhead Temple Trusses, Sōrin Spire & Kinetic Traversal](#9-overhead-temple-trusses-sōrin-spire--kinetic-traversal)
10. [Stairway Mathematics, Engawa Porches & Stone Stepping Trails](#10-stairway-mathematics-engawa-porches--stone-stepping-trails)
11. [Solo vs. Arena Multiplayer Variations Matrix](#11-solo-vs-arena-multiplayer-variations-matrix)
12. [Spawn Points, Sniper Perches & Item Pickups](#12-spawn-points-sniper-perches--item-pickups)
13. [Level Designer Checklist & Anti-Bug Directives](#13-level-designer-checklist--anti-bug-directives)

---

## 1. Spatial Coordinates & World Bounds

The Zen Garden shares the exact Cartesian world grid as Doodle District to ensure 100% engine compatibility:

- **Origin `(0, 0, 0)`**: The geographical center of the Pagoda sanctuary at ground floor level.
- **X-Axis (East-West)**:
  - Negative X (`-X`): **West** (The Dense Moso Bamboo Grove, slate stepping stones, moss clearings, destructible makiwara dummies).
  - Positive X (`+X`): **East** (The Karesansui Raked Gravel Ocean, Sentinel megaliths, Giant War Fan springboard jump-pad).
- **Y-Axis (Elevation / Vertical Tiers)**:
  - `y = -2.0`: Sinuous ink stream bed & koi pond floor.
  - `y = -1.2`: Water surface datum level with circular ripple zones.
  - `y = -1.0 to 0.0`: Courtyard gravel and stone foundation slab.
  - `y = 0.0`: Ground level (Raked sand, bamboo forest floor, and dojo training yard).
  - `y = 1.2`: Pagoda wraparound cedar Engawa veranda deck & Tea house floor.
  - `y = 4.8`: Arched Vermilion Drum Bridge (Taiko-bashi) apex.
  - `y = 8.0`: Pagoda Tier 1 Flared Roof eaves & Tokukyō timber brackets.
  - `y = 13.5`: Grand Torii Gate upper curved lintel (Kasagi) tightrope beam.
  - `y = 16.0`: Pagoda Tier 2 Mid-Level sniper balcony.
  - `y = 20.0`: Pagoda Great Temple Bell (*Bonshō*) suspended loft.
  - `y = 24.0`: Pagoda Tier 3 Upper roof deck & Onigawara demon ridge tiles.
  - `y = 28.0 to 34.0`: Master Calligrapher's Cedar Brush Finial & crowning grapple jewel (*Hōju*).
  - `y = 56.0`: Invisible sky containment lid (Solo).
  - `y = 88.0`: Geodesic mulberry washi paper dome apex (Arena).
- **Z-Axis (North-South)**:
  - Negative Z (`-Z`): **North** (The Ink Stream, Drum Bridge, Grand Torii at `z = -38.0`, Origami Crane Perches).
  - Positive Z (`+Z`): **South** (The Chashitsu Tea House, Shishi-odoshi Fountain, & Makiwara Training Yard at `z = 38.0`).

### Boundary Envelopes
| Mode | Half-Span ($P$) | Total Dimensions | Wall Height ($PH$) | Wall Thickness ($T$) | Solo Player Start |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Solo Mode** | $55\text{ m}$ | $110 \times 110\text{ m}$ | $18\text{ m}$ | $6\text{ m}$ | `(0, 1.2, 36.0)` facing North (`-z`) |
| **Arena Mode** | $68\text{ m}$ | $136 \times 136\text{ m}$ | $30\text{ m}$ | $6\text{ m}$ | 16 Symmetrical Arena Spawns |

---

## 2. Aesthetic & Ink Material System

All geometry in The Zen Garden is synthesized through a specialized sumi-e wash, vermilion cinnabar, and kintsugi gold shader (`src/render.js`), set against fibrous off-white mulberry washi paper (`#f6f3eb`):

- **`INK.BLACK` (ID: 2 - Sumi-e Charcoal `#1e2022` & River Granite)**:
  - Sanzon-seki metamorphic granite sentinel boulders and stepping stones.
  - Pagoda pitched ceramic roof tiles (*kawara*) and demon ridge tiles (*onigawara*).
  - Calligraphic brush stroke outlines, shōji screen lattice grilles, and gnarled pine bark.
  - Cast-iron stone lanterns (*Tōrō*) and ink grindstones (*Suzuri*).
- **`INK.ORANGE` (ID: 3 - Natural Hinoki Cypress, Temple Bronze & Kintsugi Gold `#cf9e38`)**:
  - Pagoda central cedar heart pillar (*shinbashira*) and structural rafters.
  - Engawa veranda polished cedar planks and wooden handrails.
  - Bronze Sōrin Spire rings, temple bell (*bonshō*), and hanging windchimes.
  - Kintsugi gold lacquer repair lines crisscrossing damaged stone paths.
  - Giant Wooden Drafting Ruler bridges spanning temple wall breaches.
  - All interactive grapple rings and dynamic swinging anchors.
- **`INK.RED` (ID: 1 - Sacred Cinnabar Lacquer `#c83e2b` & Torii Vermilion)**:
  - The Arched Vermilion Drum Bridge (Taiko-bashi) structure and balustrades.
  - The Monumental Grand Torii Gate pillars and lintels.
  - Giant War Fan (*Ōgi*) springboard ribs and red silk paper canopy.
  - Arena Geodesic Dome central cinnabar solar keystone (`radius = 2.4` at `y = 90`).
  - Red temple prayer ribbons tied to sacred pines and origami crane accents.
- **`INK.GREEN` (ID: 4 - Deep Bamboo Emerald `#4a7055` & Vibrant Moss)**:
  - The 65 cylindrical moso bamboo stalks and interlocking lanceolate leaves.
  - Velvet moss caps growing across the northern crevices of boulders.
  - Weeping willow branches overhanging the stream and bonsai cloud foliage pads.
- **`INK.BLUE` (ID: 0 - Deep Mineral River Bed & Night Sky)**:
  - Sinuous ink stream bed and quiet reflection pool floor.
  - Earthen plaster perimeter enclosure walls (*kaki*) foundation.

### 2.1 Thematic Prop Taxonomy (Detailing Tiers 1-4)
- **Tier 1 (Cover Props - 3-5 meshes each)**:
  - Cast-iron *tōrō* garden lanterns (`cyl()` base + `box()` light chamber in `INK.BK` + `cone()` roof cap with white ink smoke burst on destruction).
  - Ceramic sake barrels, rice straw bales, and folded origami cranes providing $0.8\text{m} - 1.2\text{m}$ low crouch cover.
  - Carved granite stone washbasins (*tsukubai*) and bamboo water ladles.
  - Straw training dummies (*makiwara*) and bamboo cutting bundles that slice diagonally when struck.
- **Tier 2 (Tactical Furniture & Walkways - 5-10 meshes each)**:
  - Polished Hinoki cypress Engawa veranda walkways ($y = 1.2$) with structural foundation posts and balustrades.
  - Low lacquered chabudai tea tables, tatami floor mats, and sliding rice paper *shōji* screens.
  - 30cm wooden drafting ruler bridges spanning water gullies with centimeter markings.
  - Single-file slate stepping stone trails (*tobi-ishi*) with kintsugi gold crack trails.
- **Tier 3 (Landmark Anchor Props - 10-20 meshes each)**:
  - The Arched Vermilion Drum Bridge (*Taiko-bashi*) with arched stringers and turned bronze finials.
  - The Sacred Sanzon-seki Granite Megalith triad in the raked sand ocean.
  - The Giant Folding War Fan (*Ōgi*) springboard jump-pad in the northeast courtyard.
  - The Kinetic Bamboo Shishi-odoshi water fountain with flume, pivot axle, and striking stone.
  - The Monumental Grand Torii Gate ($14\text{m}$ high) with curved Kasagi lintel.
- **Tier 4 (Hero Centerpiece - 20-40 meshes)**:
  - The 4-Tiered Sanjū-no-tō Pagoda with central suspended cedar heart pillar (*shinbashira*), 3 flared cantilevered roof eaves, Tokukyō bracket complexes, interior nightingale creak-boards (*uguisubari*), suspended bronze temple bell (*bonshō*), and the crowning master calligrapher's cedar brush finial ($y = 34\text{m}$).

---

## 3. Perimeter Enclosure & Temple Wall Boundaries

### 3.1 Ground Slab & Traditional Plaster Walls (Kaki)
- **Ground Foundation**: Single continuous slab `box(0, -1.0, 0, 2*P + T, 1.0, 2*P + T)` in `INK.BLUE`.
- **Traditional Earthen Plaster Enclosure Walls**:
  - Boundary walls of height $6.0\text{ m}$, thickness $1.2\text{ m}$ topped with pitched ceramic roof tiles (*kawara*) in `INK.BLACK`.
  - Circular and square viewing windows (*shōji* lattice grilles) providing sniper peekholes.
  - North Wall: `box(0, 0, -P, 2*P + T, PH, T)` in `INK.BLUE`.
  - South Wall: `box(0, 0, P, 2*P + T, PH, T)` in `INK.BLUE`.
  - West Wall: `box(-P, 0, 0, T, PH, 2*P + T)` in `INK.BLUE`.
  - East Wall: `box(P, 0, 0, T, PH, 2*P + T)` in `INK.BLUE`.

### 3.2 Anti-Camp Sky Containment (Solo Mode)
- **Invisible Vertical Boundary Extensions**: 4 colliders rising from `y = 18.0` to `y = 58.0`, tagged `{ noNav: true, noGrapple: true }`.
- **Sky Ceiling Lid**: `collider(0, 56.0, 0, 2*P + 40, 8.0, 2*P + 40, { noNav: true, noGrapple: true })`.
- **Calligraphic Torus Ribs**:
  - Center: `(0, -20.0, 0)`, Radius: $R = 98.0\text{ m}$.
  - 6 vertical semi-circular bamboo ribs in `INK.GREEN` rotated at $30^\circ$ increments.
  - 4 horizontal latitude containment rings at heights `y = 30.0, 46.0, 60.0, 72.0`.

### 3.3 Perimeter Ledges & Black Pine Canopies
8 elevated sniper and grapple platforms nestled in the boughs of gnarled Japanese black pines:
1. `[-34.0, 6.0, -51.2, 8.0, 0.4, 2.4]`: Northwest Pine Canopy Branch Shelf.
2. `[34.0, 6.0, -51.2, 8.0, 0.4, 2.4]`: Northeast Temple Gate Overlook.
3. `[-51.2, 6.0, -18.0, 2.4, 0.4, 8.0]`: West Bamboo Grove Treehouse Ledge.
4. `[-51.2, 6.0, 18.0, 2.4, 0.4, 8.0]`: West Moss Garden Observation Platform.
5. `[51.2, 6.0, -18.0, 2.4, 0.4, 8.0]`: East Raked Sand Sniper Nest.
6. `[51.2, 6.0, 18.0, 2.4, 0.4, 8.0]`: East Sacred Boulder High Perch.
7. `[-26.0, 6.0, 51.2, 8.0, 0.4, 2.4]`: Southwest Tea Garden Pine Branch.
8. `[26.0, 6.0, 51.2, 8.0, 0.4, 2.4]`: Southeast Washbasin Ledge.

### 3.4 Enemy Wave Spawn Portals
10 traditional Japanese garden spawn portals for Solo survival waves:
- 2 Bamboo Forest Culvert Vents: `(-52.0, 0, -10.0)` and `(-52.0, 0, 10.0)`.
- 2 East Temple Plaster Sliding Gates: `(52.0, 0, -14.0)` and `(52.0, 0, 14.0)`.
- 2 North Torii Riverbank Arches: `(-12.0, -1.2, -52.0)` and `(12.0, -1.2, -52.0)`.
- 2 South Tea Garden Bamboo Gateways: `(-14.0, 0, 52.0)` and `(14.0, 0, 52.0)`.
- 2 Pagoda Foundation Under-Floor Crawlspaces: `(-9.0, 0, 0)` and `(9.0, 0, 0)`.

---

## 4. Sector 1: The Ink Stream, Drum Bridge & Grand Torii (North)

A breathtaking water garden installation centered at `z = -32.0`:

### 4.1 The Sinuous Ink Stream & Ripple Zones
- A dark, meandering waterway running East-West from `x = -50.0` to `x = 50.0`:
  - Width: $7.0\text{ m}$ to $11.0\text{ m}$, Water Level: `y = -1.2\text{ m}`.
  - Stream bed lined with smooth rounded river pebbles and weeping water irises.
  - Real-time circular ink ripple particle nodes reacting to player footing and projectile impacts.
  - Floating folded paper water-lilies and origami koi swimming below the surface.

### 4.2 The Arched Vermilion Drum Bridge (Taiko-bashi)
Positioned at `(0, 0, -30.0)` spanning the river:
- **Arched Timber Span**:
  - Semicircular wooden bridge: Span $14.0\text{ m}$, Width $3.4\text{ m}$, Apex Height `y = 4.8\text{ m}`.
  - Radiant vermilion red cinnabar lacquer in `INK.RED`.
  - Sturdy balustrades topped with 8 turned bronze finial caps (*giboshi*) in `INK.ORANGE`.
  - Commands full line-of-sight over the northern water crossing.
  - Low road underpass: Player can wade beneath bridge timbers at `y = -1.2` for silent flank maneuvers.

### 4.3 The Monumental Grand Torii Gate (`z = -44.0`)
- **Myōjin-style Sacred Shinto Archway**:
  - Two massive cylindrical cedar pillars: Diameter $1.4\text{ m}$, Height $14.0\text{ m}$ canted slightly inward.
  - Curved upper lintel (*kasagi*) with upturned ends spanning $16.0\text{ m}$ at `y = 13.5\text{ m}` in `INK.RED`.
  - Central wooden nameplate tablet (*gakuzuka*) with gold ink calligraphy.
  - The upper crossbeam serves as an exposed, high-altitude tightrope beam for snipers!
  - 2 Origami Crane (*Tsuru*) perches mounted on the outer lintel tips with orange grapple rings.

---

## 5. Sector 2: Karesansui (Raked Gravel Ocean) & Sacred Megaliths (East)

An expansive $30.0\text{ m} \times 40.0\text{ m}$ dry-landscape arena centered at `x = 28.0`:

### 5.1 The Raked Gravel Ocean & Wave Patterns (Samon)
- **Crushed Granite Sand Sea**:
  - High-contrast white gravel ground plane drawn in fine carbon linework.
  - Linear combed furrows running North-South representing ocean currents.
  - Concentric circular ripple rings (*samon*) etched into the ground radiating outward from each rock arrangement.
  - Raised sand berm ridges ($0.6\text{m}$ high) offering natural low crouch-peeking cover.

### 5.2 The Sanzon-seki Sacred Stone Triad
A monumental Buddhist trinity stone grouping:
- **The Sentinel (Central Boulder)**:
  - Position: `(28.0, 0, 0)`. Height: $9.0\text{ m}$, Width: $4.2\text{ m}$, Depth: $3.6\text{ m}$.
  - Synthesized from 5 intersecting rounded polyhedra in `INK.BLACK`.
  - Top capped with an emerald moss patch of thickness $0.2\text{ m}$ in `INK.GREEN` providing high-traction footing for snipers.
- **The Attendants (Flanking Boulders)**:
  - North Attendant: `(28.0, 0, -6.5)`, Height $3.8\text{ m}$, leaning inward at $15^\circ$.
  - South Attendant: `(28.0, 0, 6.5)`, Height $4.8\text{ m}$, leaning inward at $20^\circ$.
  - Provides waist-high and chest-high cover pods across the open raked sand.

### 5.3 The Giant Folding War Fan (*Ōgi*) Springboard Jump-Pad
Positioned in the Northeast Courtyard at `(22.0, 0, -22.0)`:
- A massive, semi-unfurled hand-painted bamboo paper fan resting tilted against the rock garden.
- Step-on physics trigger: Vaulting onto the taut silk fan leaf catapults players $14\text{m}$ into the air directly onto the Pagoda Tier 2 balcony or across the gravel ocean.
- Painted with bold black sumi-e crests and cinnabar red lacquer ribs.

---

## 6. Sector 3: The Dense Moso Bamboo Grove (Take-bayashi) (West)

A dense, claustrophobic botanical forest spanning `x = -18.0 to -44.0, z = -25.0 to 25.0`:

### 6.1 Botanical Geometry & Culm Density
- **65 Segmented Moso Bamboo Stalks**:
  - Vertical cylinders of radius $0.20\text{ m}$ to $0.45\text{ m}$, heights $16.0\text{ m}$ to $24.0\text{ m}$ in `INK.GREEN`.
  - Swollen horizontal nodal rings (*fushi*) spaced every $1.4\text{ m}$ along the culm in `INK.BLACK`.
  - Interlocking canopy of long, lanceolate leaves casting broken shadow patterns across the forest floor.
- **Tactical Combat Dynamics**:
  - The bamboo stalks physically block player movement and bullet trajectories, but allow fleeting visual glimpses between culms.
  - High-canopy bamboo grapple nodes allow players to swing monkey-bar style through the tree line.
  - Muffles footstep acoustics, making the grove the ultimate hunting ground for Katana melee ambushes and suppressed shotgun sweeps!

### 6.2 The Winding Slate Stepping Trail (Tobi-ishi) & Kintsugi Veins
- A single-file meandering path of 24 flat natural slate stones traversing the grove:
  - Allows silent, rapid sprinting through the dense culms without colliding with tree trunks.
  - Inlaid with glowing kintsugi gold crack lines (`#cf9e38`) guiding players along high-speed flanking routes.

### 6.3 Smoke Lanterns (*Tōrō*) & Training Makiwara
- 4 Cast-iron stone lanterns (*Tōrō*) lining the bamboo clearing:
  - Shooting a lantern shatters its ceramic frame, releasing a dense, 6-second aromatic white ink smoke plume that blinds sniper sightlines.
- 3 Woven straw and bamboo test-cutting posts (*makiwara*):
  - Melee strikes or shotgun blasts slice through them with diagonal decals, causing the upper bundle to tumble away.

---

## 7. Sector 4: Chashitsu Tea Pavilion & Water Garden (South)

A rustic tea ceremony compound and dojo training yard centered at `z = 34.0`:

### 7.1 The Rustic Tea Ceremony House (Sōan Chashitsu)
- **Pavilion Footprint**: $10.0\text{ m} \times 8.0\text{ m}$ centered at `(0, 0, 34.0)`.
- **The Crawl-In Entrance (Nijiriguchi)**:
  - A tiny sliding entrance door of dimensions $0.85\text{ m} \times 0.85\text{ m}$ at `y = 1.2`.
  - **Tactical Ambush Threshold**: Forces players to fully crouch/slide to enter the tea house!
- **Interior Tatami Sanctuary**:
  - 4.5-mat woven tatami floor layout with black cloth borders in `INK.GREEN`.
  - Tokonoma alcove featuring a hanging landscape scroll (*kakemono*) and unglazed ceramic flower vase.
  - Destructible paper lattice *shōji* screen walls that can be shot through or sprint-slid through to breach rooms.

### 7.2 The Kinetic Shishi-odoshi (Bamboo Deer-Scarer)
- Located in the water garden beside the tea house at `(8.0, 0, 32.0)`:
  - Hollow bamboo rocker pipe mounted on an axle between two timber uprights.
  - Fed by a steady stream of ink water from an overhead bamboo flume.
  - **Kinetic Cycle**: Fills with water, pivots downward to pour out the water with an ink splash particle, and snaps back down, striking its base against a granite rock with a sharp, resonant "CLACK" every 5.0 seconds!

---

## 8. Central Sector: The Four-Tiered Sanjū-no-tō Pagoda (Center: X = 0, Z = 0)

The commanding architectural monument standing at `(0, 0, 0)`:

### 8.1 Structural Engineering & The Heart Pillar (Shinbashira)
- **Central Heart Pillar (Shinbashira)**:
  - A solid Japanese cedar trunk running uninterrupted through the structure: `cyl(0, 0, 0, radius 0.75, height 32.0)` in `INK.ORANGE`.
  - Suspended from the upper roof trusses down to the foundation, historically engineered to absorb seismic shockwaves.
  - Functions as the primary vertical grapple climbing spine for interior ascension!
- **The Four Flared Hip-and-Gable Roof Tiers (Irimoya-zukuri)**:
  - **Tier 1 Roof (`y = 8.0`)**: Span $20.0\text{ m} \times 20.0\text{ m}$, sweeping curved eaves curling gracefully upward at the four corners. Underside reveals authentic *tokukyō* timber bracket clusters in `INK.ORANGE`.
  - **Tier 2 Roof (`y = 16.0`)**: Span $16.0\text{ m} \times 16.0\text{ m}$, intermediate flared eaves sheltering a wraparound mid-level sniper balcony.
  - **Tier 3 Roof (`y = 20.0 to 24.0`)**: Span $12.0\text{ m} \times 12.0\text{ m}$, upper pitched roof housing the Great Temple Bell (*Bonshō*).
  - **Tier 4 Spire Apex (`y = 28.0 to 34.0`)**: Master Calligrapher's Cedar Brush Finial.

### 8.2 The Master Calligrapher's Cedar Brush Finial & Sōrin Spire (`y = 28.0 to 34.0`)
- Cast-bronze base with 9 sacred concentric rings (*kurin*), crowned by an enormous, hand-carved cedar and hog-bristle **Master Calligraphy Brush (*Fude*)** pointed skyward.
- Ultra-high-risk, $360^\circ$ vantage point for snipers.
- Crowning Jewel Grapple Anchor: `ring(0, 34.2, 0, 'y')` in `INK.ORANGE`.

### 8.3 The Acoustic Temple Bell (*Bonshō*) Loft (`y = 20.0`)
- Suspended bronze temple bell hung from the interior Tier 3 ceiling beams:
- Striking or grappling the bell emits a deep, resonant temple gong that triggers physical vibration and an acoustic wave across the entire sanctuary!

### 8.4 Nightingale Creak-Boards (*Uguisubari*) & Veranda (Engawa)
- **The Polished Cedar Engawa Veranda (`y = 1.2`)**:
  - Wraparound deck of width $2.4\text{ m}$ circling the perimeter of the pagoda ground floor.
  - Slab: `slab(-9.0, -9.0, 9.0, 9.0, 1.2, 0.3)` in `INK.ORANGE`.
  - Low wooden handrails and sliding exterior timber lattice screens (*mōkoshi*) that players can vault over or shoot through.
- **Nightingale Creak-Floor System**:
  - The interior corridor surrounding the central shrine is laid with historic Edo-period nightingale planks that emit rhythmic high-pitched wooden chirping when walked or sprinted on, alerting nearby players unless crouch-walking.
- **The Inner Altar Room**:
  - Gilded lotus dais at `(0, 1.2, -3.0)` holding a seated bronze Buddha statue.
  - Heavy cast-bronze incense urn (*kōro*) venting wisps of white ink smoke.
  - Suspended hollow wooden fish drum (*mokugyo*) and woven tatami meditation mats providing waist-high cover.

---

## 9. Overhead Temple Trusses, Sōrin Spire & Kinetic Traversal

### 9.1 Pagoda Eaves Grapple Spiral
- All 12 flared corner tips of the three Pagoda roof tiers are equipped with orange grapple rings:
  - Tier 1 Corners: `(±10.0, 8.2, ±10.0)`.
  - Tier 2 Corners: `(±8.0, 16.2, ±8.0)`.
  - Tier 3 Corners: `(±6.0, 24.2, ±6.0)`.
- Skilled players can chain grapples in a continuous rising spiral around the pagoda exterior without touching the stairs!

### 9.2 Billowing Carp Windsocks (*Koinobori*) & Hanging Paper Parasols (*Wagasa*)
- **High-Altitude Koinobori Flagpoles (`y = 25.0 to 32.0`)**:
  - 3 giant hand-painted silk carp windsocks billowing on tall bamboo poles across the courtyard.
  - Each carp mouth features an orange grapple ring, allowing long-distance pendulum swings from the pagoda balcony to the outer walls!
- **Suspended Paper Parasols (*Wagasa*)**:
  - Open red and white oiled-paper umbrellas hung between courtyard trees serving as mid-air springboards.

---

## 10. Stairway Mathematics, Engawa Porches & Stone Stepping Trails

All temple stairways adhere strictly to swept-sphere character step physics ($0.35\text{ m}$ max step rise):

### 10.1 Pagoda Ground-to-Engawa Ceremonial Steps
Connecting Ground (`y = 0.0`) to Engawa Veranda (`y = 1.2`):
- **Flight Specifications (4 steps on all 4 faces)**:
  - Height Rise: $1.2\text{ m} / 4 = 0.3000\text{ m}$.
  - Step Run: $0.45\text{ m}$.
  - Width: $3.2\text{ m}$.
  - Polished Hinoki cypress wood in `INK.ORANGE`.

### 10.2 Arched Drum Bridge & Riverbank Staircase Landings
Connecting Riverbanks (`y = 0.0`) to Drum Bridge Apex (`y = 4.8m`):
- **North & South Arched Flight Specifications (16 steps each)**:
  - Step Rise: $4.8\text{m} / 16 = 0.3000\text{m}$.
  - Step Run: $0.45\text{m}$. Width: $3.4\text{m}$.
  - Intermediate Rest Landing: Flush bridge crest landing at $y = 4.8\text{m}$ spanning $3.4\text{m} \times 3.0\text{m}$ with turned bronze finial railings.
  - Continuous vertical headroom clearance: $3.6\text{m}$ above all steps.

### 10.3 Interior Pagoda Shinbashira Switchback Stairs
Connecting Ground (`y = 1.2m`) to Tier 2 Balcony (`y = 16.0m`):
- Multi-tier switchback wooden flights wrapping the heart pillar:
  - Step Rise: $0.26\text{m}$, Step Run: $0.45\text{m}$, Width: $1.8\text{m}$.
  - Intermediate Rest Landings at $y = 8.0\text{m}$ (Tier 1 roof mezzanine) and $y = 16.0\text{m}$ (Tier 2 balcony) with safety balustrades.
  - Interior hatch openings equipped with safety handrails and ladder backup rungs.

---

## 11. Solo vs. Arena Multiplayer Variations Matrix

| Feature | Solo Wave Survival (`!arena`) | Peer-to-Peer Arena Match (`arena`) |
| :--- | :--- | :--- |
| **Map Radius ($P$)** | $55\text{ m}$ ($110 \times 110\text{ m}$ total) | $68\text{ m}$ ($136 \times 136\text{ m}$ total) |
| **Boundary Height** | $18\text{ m}$ with invisible vertical blocker to $y = 58$ | $30\text{ m}$ perimeter plaster walls with kawara tiles |
| **Sky Enclosure** | Sky lid at $y = 56$ + 6 Blue Bamboo Arches | $120\text{ m}$ Geodesic Dome with Red Cinnabar Sun ($y=90$) |
| **Pagoda Interior**| Altar room with Buddha statue and obstacles | Cleared open pavilion for fast multi-directional combat |
| **Raker Furrows** | Aesthetic ground texture | Raised physical berms providing low crouch cover |
| **Jump-Pads** | Giant Folding War Fan (*Ōgi*) springboard | Giant War Fan + 2 Supplementary Bamboo Springboards |
| **Suspended Platforms**| None | **5 Suspended Mulberry Paper Lantern Platforms** hung from dome |
| **Spawn System** | Fixed single player start at `(0, 1.2, 36.0)` | 16 distributed temple arena spawns across all sectors |

### 11.1 Arena Geodesic Dome & Suspended Lantern Platforms
In multiplayer Arena matches, the sky is covered by a massive mulberry washi dome ($R = 120, C = -30$):
- 8 longitudinal Torus ribs rotated by $\pi / 8$ ($22.5^\circ$).
- 5 latitude rings at $y = 38, 54, 68, 80, 88$.
- Apex Cinnabar Sun Sphere: radius $2.4$ at `(0, 90, 0)` in `INK.RED`.
- **5 Suspended Paper Lantern Platforms**:
  1. Center Zenith Overlook: `(0, 26.0, 0)`, size $8.0 \times 8.0\text{ m}$.
  2. Northwest Bamboo Canopy Overlook: `(-26.0, 20.0, -22.0)`, size $6.0 \times 6.0\text{ m}$.
  3. Southeast Tea House Overlook: `(26.0, 20.0, 22.0)`, size $6.0 \times 6.0\text{ m}$.
  4. Northeast Gravel Ocean Overlook: `(24.0, 20.0, -24.0)`, size $5.0 \times 5.0\text{ m}$.
  5. Southwest Stream Overlook: `(-24.0, 20.0, 24.0)`, size $5.0 \times 5.0\text{ m}$.
  - Each platform hangs from the dome via an `INK.BLACK` silk rope and features an inverted orange grapple ring at `y - 1.3`.

---

## 12. Spawn Points, Sniper Perches & Item Pickups

### 12.1 Sniper Perches (`L.snipers`)
High-elevation tactical vantage points assigned to AI sniper units:
1. `(0, 34.0, 0)`: Master Calligrapher's Cedar Brush Finial.
2. `(0, 24.0, 0)`: Pagoda Tier 3 Upper Roof Balcony.
3. `(0, 20.0, 0)`: Pagoda Great Temple Bell Loft.
4. `(0, 16.0, 0)`: Pagoda Tier 2 Mid-Level Balcony.
5. `(0, 13.5, -44.0)`: Grand Torii Gate Upper Kasagi Crossbeam.
6. `(28.0, 9.0, 0)`: Sentinel Megalith Moss Peak.
7. `(0, 4.8, -30.0)`: Vermilion Drum Bridge Apex.
8. `(-30.0, 12.0, 0)`: Bamboo Grove Interlocking Canopy Ledge.
9. `[-34.0, 6.0, -51.2]`: Northwest Pine Canopy Branch Shelf.

### 12.2 Supply & Weapon Pickups (`L.pickups`)
1. Pagoda: `(0, 1.2, 0)` [Altar dais], `(0, 16.0, 6.0)` [Tier 2 south balcony], `(0, 24.0, -4.0)` [Tier 3 north balcony], `(0, 20.0, 0)` [Temple Bell platform].
2. Raked Sand: `(28.0, 0, 0)` [Base of sentinel], `(28.0, 0, -12.0)` [Turtle island], `(28.0, 0, 12.0)` [Crane island], `(22.0, 0, -22.0)` [War Fan jump-pad].
3. Bamboo Grove: `(-28.0, 0, 0)` [Central clearing], `(-36.0, 0, -14.0)` [Stepping stone fork], `(-20.0, 0, 16.0)` [Bamboo culm cluster], `(-30.0, 0, 10.0)` [Makiwara dummy cache].
4. River Crossing: `(0, 4.8, -30.0)` [Drum bridge crest], `(0, 0, -44.0)` [Torii threshold], `(-16.0, -1.2, -32.0)` [River gravel shoals].
5. Tea Pavilion: `(0, 1.2, 34.0)` [Tatami center], `(8.0, 0, 32.0)` [Shishi-odoshi washbasin].

### 12.3 Symmetric Multiplayer Team Spawns (`L.teamSpawns`)
- **Red Team Spawns (North/East - Shinto Shrine Protectors)**:
  - `(0, 0, -46.0)` (Grand Torii Northern Approach)
  - `(28.0, 0, -16.0)` (Karesansui Sand North Edge)
  - `(0, 1.2, -7.0)` (Pagoda North Engawa Porch)
  - `(20.0, 0, -28.0)` (Riverbank Willow Grove)
  - `(28.0, 0, 0)` (Behind Great Sentinel Boulder)
- **Blue Team Spawns (South/West - Zen Temple Disciples)**:
  - `(0, 1.2, 38.0)` (Tea House Nijiriguchi Entry)
  - `(-28.0, 0, 16.0)` (Bamboo Forest South Clearing)
  - `(0, 1.2, 7.0)` (Pagoda South Engawa Porch)
  - `(-34.0, 0, 0)` (Deep Bamboo Meandering Trail)
  - `(8.0, 0, 34.0)` (Water Garden Stepping Stones)

---

## 13. Level Designer Checklist & Anti-Bug Directives

1. **Water Stream & Pond Recovery**:
   - River water at `y = -1.2` must not trap players. Provide riverbed stone ramps at `(-8.0, -1.2, -30.0)` and `(8.0, -1.2, -30.0)` leading back up to ground level.
2. **Doorways & Headroom Clearances**:
   - Pagoda sliding doors: Width $2.4\text{ m}$, height $3.2\text{ m}$.
   - Tea House Nijiriguchi: Width $0.85\text{ m}$, height $0.85\text{ m}$ (enforces crouch-slide without snagging).
   - Interior floor clearances: Minimum $3.6\text{ m}$ inside the pagoda.
3. **Cover Height Hierarchy**:
   - Low Crouch Cover ($0.8\text{ m} - 1.2\text{ m}$): Tsukubai stone basins, prayer cushions, low stone lanterns, sand berm furrows.
   - Chest Cover ($1.4\text{ m} - 1.6\text{ m}$): Pagoda Engawa handrails, Attendant boulders, Kasuga-dōrō lanterns.
   - Full Occlusion ($2.4\text{ m} - 3.4\text{ m}$): Pagoda heart pillar, Great Sentinel megalith, dense bamboo culm clumps.
4. **Continuous Flow Loops (No Dead Ends)**:
   - Pagoda: 4 ground entrances, exterior roof corner grapple spiral, interior ladder rungs, Tier 3 bell loft.
   - Bamboo Forest: 3 distinct parallel trails through the grove connecting north and south sectors.
   - Drum Bridge: 2 approach routes (bridge deck, stepping stones across the river rapids).
5. **Physics & Navigation Tagging Discipline**:
   - Apply `{ noNav: true }` to thin roof eaves, Torii gate top crossbeams, weeping willow boughs, and kinetic shishi-odoshi rocker pipe.
   - Apply `{ noGrapple: true }` to outer perimeter plaster walls and the sky containment ceiling.
   - Apply `{ noCollide: true }` to fallen cherry blossom petals, raked sand ripple markings, and rising incense smoke.
