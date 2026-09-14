# MAP CONCEPT 05: Ink Forest (forest)

## 1. Spatial Coordinates & Level Envelope
- **Coordinate Boundary**: X: [-55.0m, +55.0m], Z: [-55.0m, +55.0m], Y: [0.0m, 18.0m] (Solo) / [0.0m, 30.0m] (Arena).
- **Perimeter Thickness**: 6.0m solid outer ancient tree-line bounding hull.
- **Vertical Tiers**:
  - Tier 1 (Forest Floor / Roots & Clearings): Y = 0.0m
  - Tier 2 (Canopy Treehouse Decks & Rope Bridges): Y = 4.5m
  - Tier 3 (Apex Bough Overlooks & Watchtower Perches): Y = 9.0m

## 2. Aesthetic & Ink Material System
- **Environment Dossier**: Ink Forest — Ancient Arboreal & Canopy Warfare
- **Tactical Category**: `anomalous`
- **Engagement Profile**: Arboreal Catwalks, Hollow Log CQB & Aerial Grapple Swings
- **Primary Ink**: INK.GREEN (Dense pine canopies, mossy forest floor, leaf foliage)
- **Secondary Ink**: INK.BLACK (Gnarled oak trunks, bark texture, timber stairs & railings)
- **Accent Inks**: INK.ORANGE, INK.RED, INK.BLUE (Rope suspension bridges, grapple vine loops, woodland berries, hazard glades, shaded spring pools)

### 2.1 Thematic Prop Taxonomy (Detailing Tiers 1-4)
- **Tier 1 (Cover Props — 3-5 meshes each)**: mossy fallen log (horizontal cyl 1.2m), ink-stippled granite boulder cluster, hollow tree stump defilade, tangled root barrier.
  - Height range: 0.8m–1.3m providing waist-high bullet defilade.
  - Material: Primary + Secondary ink with accent moss trim.
- **Tier 2 (Tactical Furniture & Walkways — 5-10 meshes each)**: elevated canopy treehouse platform, suspended timber rope bridge, wooden corduroy trail walkway, ranger lookout blind.
  - Elevated platforms at Y = 1.2m–4.5m with gnarled timber posts and balustrades.
- **Tier 3 (Landmark Anchor Props — 10-20 meshes each)**: towering ancient oak trunk with spiral ramp, monolithic banyan root archway, elevated canopy watchtower platform, sunken glade stone altar.
  - Central sector landmarks providing multi-story traversal and vertical grapple anchors.
- **Tier 4 (Kinetic & Aerial Elements)**: swaying pine canopy boughs, falling paper leaves spiraling in breeze, creaking timber bridge ropes.
  - Dynamic elements at Y = 18.0m+ for aerial traversal.

## 3. Perimeter Enclosure & Gateways
- 4 Cardinal ancient petrified timber walls (Thickness = 6.0m, Height = 18.0m / 30.0m).
- 4 Cardinal gnarled root arch gateways with 2.8m clear vertical clearance and 1.8m width.
- Perimeter elevated woodland walkways at Y = 5.5m and Y = 9.0m for long-distance rifle coverage.
- 8 Perimeter branch ledge platforms for grapple traversal and elevated vantage.

## 4. Sector 1 (North-West) — Mossy Hollow
- High-density tactical cluster with sunken hollow log redoubt and tangled root barricades.
- Coordinates: X: [-45, -10], Z: [-45, -10].
- **Tier 1 Props**: mossy fallen log, granite boulder cluster.
- **Tier 2 Props**: wooden corduroy trail walkway.
- Low cover nodes (1.1m height) for waist-high bullet defilade.
- Flanking corridor connecting to Central Grove via hollow root tunnel.

## 5. Sector 2 (North-East) — Canopy Treehouse Glade
- Multi-level arboreal CQB zone with elevated wooden treehouse platform.
- Coordinates: X: [10, 45], Z: [-45, -10].
- **Tier 1 Props**: hollow tree stump defilade, tangled root barrier.
- **Tier 2 Props**: elevated canopy treehouse platform.
- Overhead grapple vine ring at Y = 11.5m for rapid vertical ingress.
- Elevated platform at Y = 3.5m with anti-camp open rear vector.

## 6. Sector 3 (South-West) — Banyan Root Warren
- Natural labyrinthine root arches and mossy boulder defilade corridors.
- Coordinates: X: [-45, -10], Z: [10, 45].
- **Tier 1 Props**: mossy fallen log, tangled root barrier.
- Sightlines directed toward Central Ancient Oak Dais.
- Intermediate cover blocks at 0.9m–1.2m height.

## 7. Sector 4 (South-East) — Ranger Watchtower Outpost
- Stepped timber outpost with elevated sniper nesting perch among pine boughs.
- Coordinates: X: [10, 45], Z: [10, 45].
- **Tier 2 Props**: ranger lookout blind, suspended timber rope bridge.
- Anti-camp open rear vector preventing entrenched camping.
- Sniper perch at Y = 5.5m with 3 open directional sightlines.

## 8. Central Sector (Ancient Oak Grove & Canopy Bridges)
- Central Tier 2 Dais (Y = 4.5m) connected via dual 14-step timber stairways.
- **Tier 3 Landmark**: towering ancient oak trunk with spiral ramp & monolithic banyan root archway.
- Apex canopy bridge (Y = 9.0m) overlooking all 4 quadrant lanes with 360° grapple sightlines.
- Central pickup node at Y = 4.7m on the mossy sacred altar.

## 9. Overhead & Aerial Traversals
- 7 Grapple rings positioned at safe distances (>= 1.5m) from structural colliders.
- **Kinetic Elements**: swaying pine canopy boughs, falling paper leaves spiraling in breeze, creaking timber bridge ropes.
- Dynamic paper leaves circling at Y = 22.0m for aerial hitching.
- Ring positions: (0, 13, 0), (-20, 12, -20), (20, 12, 20), (-20, 12, 20), (20, 12, -20), (0, 16, -32), (0, 16, 32).

## 10. Stairway Mathematics & Headroom Clearances
- **Step Rise**: 0.2857m (14 steps per 4.0m elevation rise).
- **Step Run**: 0.45m.
- **Required Headroom**: >= 2.0m continuous vertical clearance guaranteed.
- **Aperture Cutout**: Floor slabs above stair entries maintain full clearance without ceiling collisions.
- **Landing Rest**: Every 4.0m vertical rise includes intermediate rest landing (depth >= 1.2m).

## 11. Variations Matrix (Solo vs. Arena Match)
- **Solo**: Dense forest clearing, contained canopy sky lid at Y = 56m, wave spawner distribution across all 4 sectors.
- **Arena**: Expanded P = 68.0m perimeter, 9 balanced team spawn points, multi-branch arena canopy.

## 12. Spawn Points & Vantage Snipers
- **Solo Spawns** (8): (0, 0.2, 42), (0, 0.2, -42), (-40, 0.2, 0), (40, 0.2, 0), (-25, 3.4, -25), (25, 3.4, 25), (0, 4.7, 0), (0, 9.3, 0).
- **Sniper Vantages** (4): (0, 9.3, 12), (0, 9.3, -12), (-30, 9.2, -52), (30, 9.2, 52).
- **Pickups** (6): (0, 4.7, 0), (0, 9.3, 0), (-25, 3.4, -25), (25, 3.4, 25), (-14, 0.2, 6), (14, 0.2, -6).

## 13. Level Designer Checklist
- [x] All stairways maintain >= 2.0m vertical headroom.
- [x] Minimum 150 colliders registered for dense tactical geometry.
- [x] Grapple rings maintain >= 1.5m wall clearance.
- [x] Zero dead-end pinch points (< 1.8m width).
- [x] All 4 quadrants have ≥ 15 colliders each.
- [x] Cover blocks distributed across all sectors at 0.8m–1.3m heights.
- [x] Fire lanes cover ≥ 70% of playable floor area.

## 14. Map-Specific Bestiary (Enemy Intelligence Design)
- **Enemy 1: Canopy Stalker**: `{ role: 'melee', canDodge: true, canCover: true, canRetreat: false, canFlank: true, berserker: true, hp: 65, speed: 8.8, weapon: 'blade', lunge: 3.6, reach: 3.0, standoff: 1.5, cool: [0.8, 1.2], dmg: 18, build: { bodyW: 0.8, headS: 0.9, limbR: 0.03 } }`
- **Enemy 2: Treehouse Marksman**: `{ role: 'ranged', canDodge: true, canCover: true, canRetreat: true, canFlank: false, stationary: true, hp: 45, speed: 3.2, weapon: 'sniper', range: 80, stop: 80, keep: 22, aimTime: 1.4, cool: [2.2, 3.2], dmg: 26, build: { bodyW: 0.7, headS: 0.8, limbR: 0.02 } }`


## 14. Interactive Macro-Structures (Tier 3 & 4)
- **Ancient Oak Canopy (X=-43, Z=-43)**: Colossal ancient oak trunk with wrap-around canopy observation deck and high grapple vine.
- **Canopy Treehouse Outpost (X=-43, Z=-19)**: Elevated timber watchtower on massive tree trunks with thatched green canopy roof.
- **Stonehenge Hollow Altar (X=-43, Z=-1)**: Megalithic moss-covered standing stone portal with central glade hollow altar.
- **Ancient Oak Canopy (X=-43, Z=17)**: Colossal ancient oak trunk with wrap-around canopy observation deck and high grapple vine.
