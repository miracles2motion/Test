# The Colossal Canopy (Whispering Redwoods): Comprehensive Map Architecture & Specification

A master structural, geometrical, and tactical blueprint for **The Colossal Canopy** (Map Key: `forest` / `redwoods`), an epic vertical arena set within a primeval, titan-scale temperate rainforest drawn entirely in ballpoint pen ink, crosshatched shading, and stippled foliage on aged heavyweight notebook paper.

Designed using the exact mathematical standards, coordinate bounds, vertical step ratios, and traversal loops of **The Giant Classroom** (`classroom`) and **Doodle District** (`district`), this specification establishes a monumental reference for implementing the forest map with zero geometric inconsistencies, zero blind traps, and surgical competitive flow.

---

## Table of Contents
1. [Spatial Coordinates & World Bounds](#1-spatial-coordinates--world-bounds)
2. [Aesthetic & Ink Material System](#2-aesthetic--ink-material-system)
3. [Perimeter Enclosure & Mountainous Palisades](#3-perimeter-enclosure--mountainous-palisades)
4. [Sector 1: The Great Banyan Bastion & Spiral Ascent (North-West)](#4-sector-1-the-great-banyan-bastion--spiral-ascent-north-west)
5. [Sector 2: The Alpine Conifer Ridge & Ranger Blind (North-East)](#5-sector-2-the-alpine-conifer-ridge--ranger-blind-north-east)
6. [Sector 3: The Sunken Brook & Hollow Log Labyrinth (South-West)](#6-sector-3-the-sunken-brook--hollow-log-labyrinth-south-west)
7. [Sector 4: The Weeping Willow Bower & Shroom Glade (South-East)](#7-sector-4-the-weeping-willow-bower--shroom-glade-south-east)
8. [Central Sector: The Grand Redwood Crossing & Suspension Bridges](#8-central-sector-the-grand-redwood-crossing--suspension-bridges)
9. [Overhead Traversal Grid, Aerial Swing Highway & Kinetic Canopy](#9-overhead-traversal-grid-aerial-swing-highway--kinetic-canopy)
10. [Stairway Mathematics, Slopes & Structural Geometry](#10-stairway-mathematics-slopes--structural-geometry)
11. [Solo vs. Arena Multiplayer Variations](#11-solo-vs-arena-multiplayer-variations)
12. [Spawn Points, Sniper Perches & Item Pickups](#12-spawn-points-sniper-perches--item-pickups)
13. [Level Designer Checklist & Universal Detailing Compliance](#13-level-designer-checklist--universal-detailing-compliance)

---

## 1. Spatial Coordinates & World Bounds

The Colossal Canopy utilizes the master Cartesian world grid shared by Doodle District and The Giant Classroom, ensuring 100% collision, navmesh, and camera compatibility:

- **Origin `(0, 0, 0)`**: The center of the forest floor, located right at the base of the Titan Redwood Centerpiece at the crossing of the primary north-south brook and east-west logging trail.
- **X-Axis (East-West)**:
  - Negative X (`-X`): **West** (The Banyan Bastion, tangled buttress roots, hollow log tunnel system).
  - Positive X (`+X`): **East** (The Alpine Conifer Ridge, granite rock bluffs, ranger treehouse blind).
- **Y-Axis (Elevation / 3-Strata Verticality)**:
  - `y = -1.5 to 0.0`: The Whispering Brook riverbed trench, sunken root crawlways, mud flats.
  - `y = 0.0`: The Forest Floor Understory (Street level equivalent).
  - `y = 0.8 to 1.4`: Low tactical cover tier (Mossy boulders, cut corduroy logs, fern clusters, mushroom step-caps).
  - `y = 3.6`: Intermediate platform tier (Lower shelf fungus brackets, fallen timber arches, root saddles).
  - `y = 6.5`: Mid-Canopy Walkways & Treehouse Decks (Tabletop / Highway deck equivalent elevation).
  - `y = 8.5`: Ranger Lookout Blinds, upper bough fighting perches.
  - `y = 11.0`: Banyan secondary canopy platform, Waterfall Rock Overlook.
  - `y = 14.0`: Alpine Conifer Apex Sniper Perches, high suspension cable anchor beams.
  - `y = 18.0`: The Grand Redwood Crown apex observation deck.
  - `y = 22.0 to 28.0`: Upper thermal airspace with circling paper hawk and drifting leaf gliders.
  - `y = 56.0`: Invisible sky containment ceiling (Solo Mode).
  - `y = 88.0`: Living forest dome branch canopy apex (Arena Match).
- **Z-Axis (North-South)**:
  - Negative Z (`-Z`): **North** (The Great Granite Palisade & Whispering Waterfall at `z = -52`).
  - Positive Z (`+Z`): **South** (The Ancient Ranger Trailhead & Logging Flume at `z = +52`).

### Boundary Footprint
| Mode | Half-Span ($P$) | Total Dimensions | Wall Height ($PH$) | Wall Thickness ($T$) | Solo Player Start |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Solo Mode** | $55\text{ m}$ | $110 \times 110\text{ m}$ | $18\text{ m}$ | $6\text{ m}$ | `(0, 0.2, 44)` facing North (`-z`) |
| **Arena Match** | $68\text{ m}$ | $136 \times 136\text{ m}$ | $30\text{ m}$ | $6\text{ m}$ | 16 Balanced Team & Arena Spawns |

---

## 2. Aesthetic & Ink Material System

The entire environment is manifested through procedural biro ink and textured ballpoint draftsmanship (`src/render.js`):

- **`INK.GREEN` (Primary Ink - Foliage & Forest Life)**:
  - Towering redwood and banyan leaf crown spheres with organic ink stippling.
  - Layered conical alpine pine needle skirts with jagged silhouette hatching.
  - Dense ground fern frond clusters and mossy velvet caps over fallen logs.
  - Lush creeping ivy tendrils climbing up vertical trunk columns.
  - Water lily pads floating in the central brook pools.
- **`INK.BLACK` (Secondary Ink - Ancient Bark & Iron Rigging)**:
  - Deep longitudinal bark fissures and shadows on giant redwood trunks.
  - Gnarled root buttress crevices, shadow defilades, and hollow log interiors.
  - Cast-iron suspension bridge brackets, turnbuckles, and heavy anchor pins.
  - Steel cables, wire rope stays, and fine ballpoint crosshatching on granite cliffs.
  - Perimeter timber palisade framing and shadowed undercuts.
- **`INK.ORANGE` (Accent Ink - Aged Heartwood & Structural Timber)**:
  - Split cedar heartwood planks on elevated treehouse platforms.
  - Flexible timber suspension bridge slat decks with authentic catenary sag.
  - Freshly sawn timber stumps showing concentric growth ring doodles.
  - Giant amber tree sap nodules that catch light and indicate climbable grips.
  - Primary grapple rings and momentum swing anchors.
- **`INK.RED` (Hazard & Tactical Alert Ink)**:
  - Giant toxic Amanita muscaria mushroom caps with white stippled dots (tactical bounce platforms).
  - High-voltage ranger telephone wire insulators mounted to tree trunks.
  - Warning trail blaze markers ('BEAR TERRITORY', 'FALLING ROCK', 'STEEP DROP').
  - Firefly swarm embers drifting through dark understory pockets.
- **`INK.BLUE` (Hydrological & Slate Ink)**:
  - The Whispering Brook running in a shallow serpentine trench along the arena floor.
  - Cascading vertical waterfall sheets at the North Granite Cliff.
  - Slate flagstone pavers embedded in high-traffic trail crossings.

---

## 3. Perimeter Enclosure & Mountainous Palisades

Rather than a sterile grey box, the perimeter represents a towering primeval canyon basin hemmed in by sheer granite palisades and colossal boundary tree trunks:

- **North Wall (`z = -52.0m`)**: The Great Granite Palisade. A stepped rock escarpment with a central vertical waterfall slit (`x: [-6, 6]`) that drops into a plunge pool at $Y=0$. Flanked by elevated perimeter reconnaissance ledges at $Y=5.5\text{m}$ and $Y=9.0\text{m}$ accessible via rock scrambles.
- **South Wall (`z = +52.0m`)**: The Ranger Trailhead & Logging Flume. A massive log flume aqueduct running east-to-west supported by heavy timber trestle bents, with the solo player start positioned right at the trailhead gate.
- **West Wall (`x = -52.0m`)**: The Ancient Grove Barrier. A dense row of 4 colossal interlocking redwood trunks whose roots form natural vaulting ramps, with narrow defilade slots between them.
- **East Wall (`x = +52.0m`)**: The Granite Crag & Eagle Perch. A terraced rock wall with sheer climbing cracks and an overhanging sniper shelf at $Y=12.0\text{m}$ overlooking the eastern flank.
- **Cardinal Gateways**: Four 4.0m-wide arched trail apertures at $(0, -52)$, $(0, 52)$, $(-52, 0)$, and $(52, 0)$ framed with rustic peeled-log archways (`T = 6.0m`, `Clearance = 3.6m`).

---

## 4. Sector 1: The Great Banyan Bastion & Spiral Ascent (North-West)

A massive multi-tier stronghold anchored by a colossal Ancient Banyan Tree (`buildAncientTree`):

- **The Anchor Tree (`x = -29.0m, z = -29.0m`)**:
  - Base footprint: $14\text{m} \times 14\text{m}$ with 4 massive flaring root buttress fins extending outward to create natural 4-way cover niches.
  - Core trunk diameter: $3.6\text{m}$ of dense black-barked wood.
  - Hollow Root Cave: A crawl-through interior cavern at $Y=0$ with 2 openings allowing players to escape grenade spam or cross under fire.
- **The Spiral Trunk Staircase**:
  - 14 climbable wooden bracket steps spiraling seamlessly around the trunk from $Y=0.0\text{m}$ to the primary combat deck at $Y=6.5\text{m}$.
  - Step Rise: $0.28\text{m}$, Step Run: $0.48\text{m}$, Width: $1.6\text{m}$ with outer timber handrail.
  - Allows full non-grapple foot traversal to the high canopy.
- **The Canopy Combat Platform ($Y = 6.5\text{m}$)**:
  - An $11\text{m} \times 11\text{m}$ octagonal timber deck (`slab`) with perimeter railing and waist-high foliage planter parapets (`h = 1.1m`).
  - Contains an elevated sniper perch, an ammo crate pickup, and two direct suspension bridge jump-offs.
- **Foliage Crown & Grapple Ring**:
  - Overlapping green foliage spheres spanning $12\text{m}$ in diameter at $Y=14.0\text{m}$.
  - Under-bough swing ring at $( -29.0, 8.5, -29.0)$ allowing players to grapple-swing into the Central Crossing.

---

## 5. Sector 2: The Alpine Conifer Ridge & Ranger Blind (North-East)

The long-range reconnaissance and sniper crucible of the forest:

- **The Granite Ridge ($x = 22.0\text{m} \text{ to } 38.0\text{m}, z = -38.0\text{m} \text{ to } -20.0\text{m}$)**:
  - Stepped rock tier rising to $Y = 4.0\text{m}$ with flat mossy shelf slabs.
  - Approach ramps from both the central lane and the eastern perimeter.
- **The Conifer Trio (`buildPineTree`)**:
  - Three staggered Alpine Conifers ($h = 13.0\text{m}, 15.0\text{m}, 17.0\text{m}$) arranged in a tactical triangle.
  - Tiered conical needle skirts create natural sightline breaks, preventing snipers from locking down the entire map without exposing themselves.
  - Base boulders provide waist-high cover ($1.1\text{m}$) against ground attackers.
- **The Ranger Lookout Blind ($Y = 8.5\text{m}$)**:
  - An elevated wooden treehouse platform supported by three pine trunks.
  - Offers commanding cross-map sightlines toward Sector 3 (South-West) and the Central Dais.
  - **Dual Access**: Accessible via a steep timber ladder on the east face and a high suspension bridge from the center, preventing camper entrenchment.
  - Apex grapple ring mounted at $Y = 15.5\text{m}$ for high-velocity parachute/grapple drop-ins.

---

## 6. Sector 3: The Sunken Brook & Hollow Log Labyrinth (South-West)

The high-speed close-quarters combat (CQB) trench network:

- **The Whispering Brook Trench ($Y = -1.2\text{m}$)**:
  - A sunken riverbed cutting diagonally across the quadrant, providing head-down defilade below standard floor level.
  - Scattered stepping boulders and waist-high granite cover nodes.
- **The Hollow Log Tunnels (`buildHollowLog`)**:
  - **North Tunnel**: A $12.0\text{m}$ long hollow fallen cedar log (`x = -24.0, z = 18.0`) aligned north-to-south. Interior clearance is $2.4\text{m}$ wide and $2.2\text{m}$ high, allowing players to sprint through while completely shielded from canopy snipers.
  - **South Tunnel**: A $10.0\text{m}$ diagonal log bridging the brook trench to the western perimeter.
  - Both log roofs feature moss trims where daring players can run along the top at $Y=2.8\text{m}$.
- **The Giant Mushroom Cluster (`buildGiantMushroom`)**:
  - Three tiered red umbrella mushrooms with stippled white caps ($Y = 3.2\text{m}, 4.8\text{m}, 6.2\text{m}$).
  - Function as stepped jumping platforms allowing agile players to spring directly from the sunken brook onto the western log flume without using grapple.
- **Foliage Carpet**:
  - 8 procedural fern clusters and 12 grass clumps providing crouch-height concealment.

---

## 7. Sector 4: The Weeping Willow Bower & Shroom Glade (South-East)

An atmospheric, sightline-obscuring sanctuary engineered for ambushes and counter-flanks:

- **The Weeping Willow Anchor (`buildWillowTree`)**:
  - Located at $(x = 29.0\text{m}, z = 29.0\text{m})$.
  - Gnarled, arched trunk splitting into two curved boughs.
  - A massive $11\text{m}$-wide weeping umbrella canopy from which 8 vertical vine tendrils hang down to $Y=2.0\text{m}$.
  - The vine curtain breaks automated aim vectors and creates chaotic CQB line-of-sight baffles.
- **The Shelf Fungus Stairway**:
  - 6 overlapping stepped shelf mushrooms growing out of the willow trunk, functioning as an organic spiral stair to a hidden sniper perch at $Y = 7.0\text{m}$.
- **The Mossy Keel Log**:
  - A colossal half-buried horizontal tree trunk acting as a primary fire-trench barricade ($h = 1.2\text{m}, l = 16.0\text{m}$) angled toward Mid.
- **Tactical Health/Armor Shrine**:
  - A stone druidic altar hidden beneath the willow curtain containing a guaranteed Mega-Pickup.

---

## 8. Central Sector: The Grand Redwood Crossing & Suspension Bridges

The beating heart and central tactical crucible of the map:

- **The Titan Redwood (`x = 0, z = 0`)**:
  - A monolithic, colossal redwood trunk ($r = 2.8\text{m}$, height extending to $Y = 24.0\text{m}$) serving as the visual landmark visible from all four corners of the map.
- **The Grand Canopy Crossing Deck ($Y = 6.5\text{m}$)**:
  - A massive $20\text{m} \times 20\text{m}$ cross-shaped timber terrace built around the central redwood trunk.
  - Features waist-high carved timber parapets ($1.1\text{m}$), perimeter railings, and 4 corner cover bunkers.
  - Central floor cutout allows players on the deck to shoot straight down into the sunken brook below.
- **Dual Grand Stairways**:
  - **North Stair**: 14 steps ascending from the sunken riverbed at $(0, 0, -18)$ southward to the center deck at $(0, 6.5, -10)$.
  - **South Stair**: 14 steps ascending from the trailhead at $(0, 0, 18)$ northward to the center deck at $(0, 6.5, 10)$.
  - Step Rise: $0.2857\text{m}$, Step Run: $0.45\text{m}$, Width: $3.2\text{m}$.
- **The 4 Suspension Sky-Bridges (`buildSuspensionBridge`)**:
  - 4 slung timber rope walkways radiating outward from the Central Crossing to the four sector outposts:
    - **Bridge 1 (North-West)**: Spans $16\text{m}$ to Sector 1 Banyan Platform.
    - **Bridge 2 (North-East)**: Spans $18\text{m}$ to Sector 2 Conifer Ridge.
    - **Bridge 3 (South-West)**: Spans $16\text{m}$ to Sector 3 Log Flume.
    - **Bridge 4 (South-East)**: Spans $18\text{m}$ to Sector 4 Willow Perch.
  - Each bridge features authentic catenary sag, timber plank flooring (`w = 2.4m`), rope handrails (`h = 1.0m`), and a central swing ring.

---

## 9. Overhead Traversal Grid, Aerial Swing Highway & Kinetic Canopy

The Colossal Canopy features the most dynamic aerial mobility system in Doodle Strike:

- **The 12-Ring Grapple Network**:
  - **Central Apex Ring**: $(0, 14.5, 0, \text{'y'})$ — The master pivot point for colossal pendulum swings across the entire arena.
  - **4 Bridge Midpoint Rings**: Suspended over each suspension bridge at $Y = 10.5\text{m}$.
  - **4 Sector Crown Rings**: Suspended directly from the foliage crowns of Sectors 1, 2, 3, 4 at $Y = 12.0\text{m}$ to $15.5\text{m}$.
  - **3 Understory Flank Rings**: Mounted to horizontal branch arches at $Y = 5.0\text{m}$ for low-altitude evasion.
  - **All rings maintain $\ge 1.8\text{m}$ clearance** from any solid colliders to guarantee zero grapple snagging.
- **Kinetic Elements**:
  - **Paper Leaf Gliders (`planes`)**: 4 animated paper leaves orbiting the upper canopy at $Y = 22.0\text{m}$ on gentle thermal paths. Players can grapple onto these moving gliders for high-altitude orbital snipes.
  - **Swaying Rope Stays**: Dynamic cable lines connecting the central redwood to the perimeter cliffs.

---

## 10. Stairway Mathematics, Slopes & Structural Geometry

Strict adherence to the Universal Detailing and Architectural Guardian standard:

- **Standard Step Rise**: $0.2857\text{m}$ ($4.0\text{m} \div 14 \text{ steps}$).
- **Standard Step Run**: $0.45\text{m}$ (Total run for 14 steps = $6.30\text{m}$).
- **Intermediate Rest Landings**: Mandatory $2.4\text{m} \times 2.4\text{m}$ flat rest landing for every $4.0\text{m}$ of vertical elevation rise to reset jump fatigue and provide tactical switchback cover.
- **Headroom Guarantee**: A minimum continuous vertical clearance of $\ge 2.2\text{m}$ is enforced along all stairs, ramps, and spiral trunks.
- **Aperture Cutout Protocol**: Where stairways enter elevated timber decks, floor slabs maintain a minimum $2.0\text{m} \times 3.2\text{m}$ void cutout with protective balustrades to prevent head-glitch clipping.
- **Anti-Pinch Corridor Standard**: All woodland corridors, hollow log tunnels, and bridge decks maintain a minimum width of $\ge 1.8\text{m}$.
- **Tier 4 Hero Set Piece**: The colossal Grand Redwood Centerpiece and suspension bridge complex functions as the master Tier 4 hero set piece anchor of the map.

---

## 11. Variations Matrix (Solo vs. Arena Multiplayer Variations)

- **Solo Campaign Mode (`arena = false`)**:
  - Bounding half-span $P = 55\text{m}$ ($110 \times 110\text{m}$).
  - Sealed sky lid at $Y = 56.0\text{m}$ with dense branch ceiling to focus combat in the canopy.
  - 8 Solo wave spawners positioned in shadowed understory alcoves.
- **Arena Match Mode (`arena = true`)**:
  - Bounding half-span expanded to $P = 68\text{m}$ ($136 \times 136\text{m}$).
  - Perimeter elevated to $PH = 30.0\text{m}$.
  - 16 Symmetrical Team Spawns: 8 Team Alpha spawns on the South Logging Flume, 8 Team Omega spawns on the North Granite Cliff.
  - Domed canopy truss overhead allowing soaring high-altitude grapple duels.

---

## 12. Spawn Points, Sniper Perches & Item Pickups

### Spawn Coordinate Matrix
| ID | Type | Coordinates `(X, Y, Z)` | Tactical Sector | Cover Proximity |
| :--- | :--- | :--- | :--- | :--- |
| **P1** | Solo Start | `(0.0, 0.2, 44.0)` | South Trailhead | Log flume barricade |
| **S1** | Wave Spawn | `(-38.0, 0.2, -38.0)` | Sector 1 Banyan Base | Buttress root fin |
| **S2** | Wave Spawn | `(-20.0, 6.7, -29.0)` | Sector 1 Canopy Deck | Timber parapet |
| **S3** | Wave Spawn | `(38.0, 0.2, -38.0)` | Sector 2 Conifer Ridge | Granite boulder |
| **S4** | Wave Spawn | `(29.0, 8.7, -29.0)` | Sector 2 Ranger Blind | Lookout rail |
| **S5** | Wave Spawn | `(-38.0, 0.2, 38.0)` | Sector 3 Hollow Log West | Log mouth defilade |
| **S6** | Wave Spawn | `(-24.0, 0.2, 20.0)` | Sector 3 Sunken Brook | Riverbed bank |
| **S7** | Wave Spawn | `(38.0, 0.2, 38.0)` | Sector 4 Willow Base | Keel log trench |
| **S8** | Wave Spawn | `(29.0, 7.2, 29.0)` | Sector 4 Shelf Shroom | Willow canopy |

### Sniper Perches
1. **The Ranger Eagle Blind**: `(29.0, 8.8, -29.0)` — Overlooks Central Crossing and Sector 3.
2. **The Banyan High Bough**: `(-29.0, 6.8, -29.0)` — Overlooks North Stair and Western Flank.
3. **The Willow Canopy Perch**: `(29.0, 7.3, 29.0)` — Concealed behind hanging vine curtain.
4. **The North Waterfall Overlook**: `(0.0, 9.2, -48.0)` — Dominates the long north-south central axis.

### Tactical Item Pickups
- **Central Mega-Pickup**: `(0.0, 7.0, 0.0)` — Located at the center of the Grand Redwood Crossing.
- **Sector 1 Armor**: `(-29.0, 6.7, -26.0)` — On the Banyan combat platform.
- **Sector 2 Ammo Cache**: `(29.0, 8.7, -26.0)` — Inside the Ranger Blind.
- **Sector 3 Health Core**: `(-24.0, 0.2, 18.0)` — Centered inside the Hollow Log Tunnel.
- **Sector 4 Druid Boon**: `(29.0, 0.4, 29.0)` — Hidden at the base of the Weeping Willow.

---

## 13. Level Designer Checklist & Universal Detailing Compliance

Every element in The Colossal Canopy complies 100% with the Universal Detailing Standard:

- [x] **Skeleton-Skin-Trim Triad**: Every tree, log, and structure possesses structural load-bearing mass (Skeleton), walkable decks or foliage caps (Skin), and sub-0.3m non-colliding detail trim (Trim).
- [x] **Universal Micro-Detail Threshold**: All grass clumps, vine tendrils, moss fringes, and bark details $< 0.3\text{m}$ have `noCollide: true` to prevent navmesh snagging.
- [x] **Headroom Clearance**: Minimum $2.2\text{m}$ continuous vertical headroom across all stairs, ramps, and hollow logs.
- [x] **Anti-Pinch Corridors**: Zero movement choke points narrower than $1.8\text{m}$.
- [x] **Grapple Ring Clearances**: All 12 grapple rings maintain $\ge 1.8\text{m}$ clearance from walls and $\ge 0.8\text{m}$ from ceilings.
- [x] **Dense Tactical Geometry**: Total colliders exceed 220, ensuring high tactical cover density.
- [x] **Dual Access Guarantee**: Every elevated sniper perch and treehouse blind features at least two distinct ascent routes to prevent camping.


## 14. Interactive Macro-Structures (Tier 3 & 4)
- **Ancient Oak Canopy (X=-43, Z=-43)**: Colossal ancient oak trunk with wrap-around canopy observation deck and high grapple vine.
- **Canopy Treehouse Outpost (X=-43, Z=-19)**: Elevated timber watchtower on massive tree trunks with thatched green canopy roof.
- **Stonehenge Hollow Altar (X=-43, Z=5)**: Megalithic moss-covered standing stone portal with central glade hollow altar.
- **Stonehenge Hollow Altar (X=-43, Z=23)**: Megalithic moss-covered standing stone portal with central glade hollow altar.


## 14. Interactive Macro-Structures (Tier 3 & 4)
- **Ancient Oak Canopy (X=-43, Z=-7)**: Colossal ancient oak trunk with wrap-around canopy observation deck and high grapple vine.
- **Stonehenge Hollow Altar (X=-43, Z=41)**: Megalithic moss-covered standing stone portal with central glade hollow altar.
- **Ancient Oak Canopy (X=-23.843001976331607, Z=-43.401118070459)**: Colossal ancient oak trunk with wrap-around canopy observation deck and high grapple vine.
- **Stonehenge Hollow Altar (X=-25, Z=-19)**: Megalithic moss-covered standing stone portal with central glade hollow altar.
