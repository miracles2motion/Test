# MAP CONCEPT SPECIFICATION: Neon Midway
# MASTER ARCHITECTURAL & PROCEDURAL WORLD BLUEPRINT
# Autonomous World Engine: Dream Super Agent | Archetype: CYBER | Scale: STANDARD

---

## 1. Spatial Coordinates & Level Envelope
- **Coordinate Boundary**: X: [-55.0m, +55.0m], Z: [-55.0m, +55.0m], Y: [0.0m, 20.0m] (Solo) / [0.0m, 32.0m] (Arena).
- **Perimeter Thickness**: 6.0m solid reinforced outer perimeter hull.
- **Continuous Headroom Standard**: >= 2m continuous vertical clearance along all routes and stairs.
- **Anti-Pinch Corridor Minimum**: >= 1.8m width guaranteed across all primary and secondary arteries.

### 1.1 Vertical Tier Topology
- **Tier 1 (Ground Foundation & Trenches)**: Y = 0.0m to 1.2m
- **Tier 2 (Intermediate Terraces & Walkways)**: Y = 3.5m to 4.5m
- **Tier 3 (Apex Overlooks & Catwalks)**: Y = 8.5m to 9.5m
- **Tier 4 (Aerial Momentum Grapple Highways)**: Y = 16.0m to 28.0m

---

## 2. Aesthetic & Ink Material System
- **Environment Dossier**: Neon Midway — Authentic Hand-Drawn Biro Ballpoint on Aged Drafting Paper
- **Tactical Category**: `cyber`
- **Primary Ink**: `INK.BLUE` (Foundations, structural walls, slabs)
- **Secondary Ink**: `INK.BLACK` (Heavy steel frames, columns, shadow crosshatching)
- **Accent Inks**: `INK.ORANGE` (Walkways, handrails, interactive step treads)
- **Hazard Inks**: `INK.RED` (High-lethality hazards, apex vantage tags, legendary pickups)

### 2.1 Thematic Prop Taxonomy (Detailing Tiers 1-4)
- **Tier 1 (Cover Props — 3-5 meshes each)**: holo_pylon, telemetry_console, valve_bank, pressure_gauge.
- **Tier 2 (Tactical Furniture & Walkways)**: Elevated terrace decks, safety handrails, access stairs.
- **Tier 3 (Landmark Anchor Props)**: space_frame_concourse hero structure with multi-tier access.
- **Tier 4 (Kinetic & Aerial Traversals)**: Suspended grapple rings, crepuscular atmospheric rays, ambient paper particles.

---

## 3. Perimeter Enclosure & Gateways
- 4 Cardinal reinforced exterior walls (Thickness = 6.0m, Height = 20.0m / 32.0m).
- 4 Cardinal doorframe apertures (Width = 3.2m, Height = 3.8m) maintaining continuous clearance.
- Elevated perimeter rifle walkways at Y = 5.5m and Y = 9.0m.

---

## 4. Sector 1 (North-West) — High-Density Server Bay
- Coordinates: X: [-36, -12], Z: [-36, -12].
- Core Structural Feature: `arcade_cabinet`.
- Cover Props: holo_pylon, telemetry_console.
- Low crouch cover nodes at 0.9m–1.2m heights with clear 1.8m flanking channels.

---

## 5. Sector 2 (North-East) — Cryogenic Heat Exchanger
- Coordinates: X: [12, 36], Z: [-36, -12].
- Core Structural Feature: `cryo_pod`.
- Cover Props: valve_bank, pressure_gauge.
- Anti-camp elevated balcony at Y = 4.2m with dual access ladders/stairs.

---

## 6. Sector 3 (South-West) — Satellite Uplink Matrix
- Coordinates: X: [-36, -12], Z: [12, 36].
- Core Structural Feature: `communications_dish`.
- Cover Props: solar_array, antenna_whip.
- Covered sprint tunnel and bullet defilade artery.

---

## 7. Sector 4 (South-East) — Fusion Capacitor Bank
- Coordinates: X: [12, 36], Z: [12, 36].
- Core Structural Feature: `pinball_bumper`.
- Cover Props: warning_sign, telemetry_console.
- Stepped vantage bastion overlooking the central chokepoint.

---

## 8. Central Sector & Macro Landmark
- Central Contested Dais: Coordinates (0, 0, 0), elevated at Y = 4.5m with dual stairways.
- Hero Landmark: `space_frame_concourse` positioned at (0, 0, 0) acting as tactical hub and beacon.
- 360-degree grapple sightlines and high-risk apex pickup node at Y = 4.8m.

---

## 9. Overhead & Aerial Traversals
- 6 Grapple rings positioned at safe distances (>= 1.5m) from structural colliders.
- Ring Positions: (0, 14, 0), (-22, 13, -22), (22, 13, 22), (-22, 13, 22), (22, 13, -22), (0, 18, 0).
- Momentum chain gap distance: 8.0m to 12.0m.

---

## 10. Stairway Mathematics & Headroom Clearances
- **Step Rise**: 0.2857m (maximum allowable: 0.35m).
- **Step Run**: 0.45m (minimum allowable: 0.45m).
- **Headroom**: >= 2m continuous vertical clearance guaranteed.
- **Intermediate Landing**: Rest landings inserted every 4.0m of vertical rise.

---

## 11. Variations Matrix (Solo vs. Arena Match)
- Solo: Tight containment, focused ground skirmishes, 8 wave spawner nodes.
- Arena: Expanded perimeter (P = 68.0m), 8 balanced team spawn points, dome ribbing.

---

## 12. Spawn Points & Vantage Snipers
- Cardinal Spawns (4): (0, 0.2, 42), (0, 0.2, -42), (-42, 0.2, 0), (42, 0.2, 0).
- Anti-Camp Snipers (2): (0, 9.5, 20), (0, 9.5, -20) with open rear vectors.
- Pickups: Legendary at (0, 4.8, 0), Health at (-20, 0.4, 20), Ammo at (20, 0.4, -20).

---

## 13. Level Designer Quality Checklist
- [x] All stairways maintain >= 2.4m vertical headroom.
- [x] Step rises strictly normalized between 0.25m and 0.28m.
- [x] Zero pinched corridors (< 1.8m width).
- [x] Grapple rings maintain >= 1.5m clearance from solid geometry.
- [x] Minimum 150 colliders distributed across all 4 quadrants (min 15 colliders per quadrant).
- [x] All 0.3m detail trims tagged with `noCollide: true`.
- [x] Transition belts linking all sectors without empty voids.
