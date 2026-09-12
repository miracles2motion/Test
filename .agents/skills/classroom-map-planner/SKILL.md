---
name: classroom-map-planner
description: Master spatial planner for the Giant Classroom map in Doodle Strike. Governs coordinate zoning, asset scale dimensions, non-overlapping spatial budgets, and stairway clearance corridors.
---

# Classroom Map Planner: Spatial Architecture & Zoning

This skill defines the mathematical coordinate layout, spatial budget, asset scale ratios, and non-overlapping placement rules for **The Giant Classroom** map in Doodle Strike.

---

## 1. Map Footprint & Global Geometry

| Parameter | Value | Details |
|---|---|---|
| **Arena Footprint** | `110m × 110m` | `minX: -55, maxX: 55, minZ: -55, maxZ: 55` |
| **Perimeter Walls** | Height `18m`, Thickness `6m` | Green Chalkboard on North; Classroom walls with corkboard trim on East, West, South |
| **Ground Plane** | `y = 0` | Polished wooden classroom parquet floor (ink lined texture) |
| **Standard Verticality Tiers** | `y = 0` (Floor), `y = 3.0m` (Chair Seats), `y = 5.5m` (Student Desks & Ruler Bridge), `y = 6.5m` (Teacher Desk), `y = 9.2m` (Book Tier 2), `y = 12.8m` (Book Apex) | Multi-tier elevation hierarchy for fluid grapple traversal |

---

## 2. Master Coordinate Zoning (Strict Non-Overlapping Budget)

Every sector has a reserved bounding box with guaranteed open corridors:

### Sector 1: The Chalkboard & Teacher's Desk (North)
- **North Wall Chalkboard**: `x: -45..45, z: -55..-50, y: 0..16m`
- **Teacher's Oak Desk**: `x: -16..16, z: -44..-28, y: 0..6.5m`
  - Left Drawer Pedestal: `x: -16..-8, z: -44..-28, y: 0..6.5m`
  - Right Drawer Pedestal: `x: 8..16, z: -44..-28, y: 0..6.5m`
  - Central Kneehole Tunnel: `x: -8..8, z: -44..-28, y: 0..5.2m` (Clear walk-through tunnel!)
- **Buffer Zone**: 4m clear margin around the teacher's desk.

### Sector 2: The Hardcover Textbook Citadel (North-West)
- **Library Bounding Box**: `x: -44..-20, z: -48..-26, y: 0..12.8m`
  - Book 1 (Encyclopedia): `x: -44..-20, z: -48..-28, y: 0..5.0m`
  - Book 2 (Physics): `x: -42..-22, z: -46..-30, y: 5.0..9.2m`
  - Book 3 (Atlas): `x: -40..-24, z: -44..-32, y: 9.2..12.8m`
- **Switchback Stairway Corridor**: `x: -19..-14, z: -46..-24` (Dedicated clearance zone, flush landings at `y = 5.0m` and `y = 9.2m`).

### Sector 3: Student Desk Rows & 30cm Ruler Bridge (Center)
- **West Student Desk**: `x: -42..-16, z: -12..10, y: 5.5m`
  - Attached Plywood Chair Step: `x: -29, z: 12..16, y: 3.0m`
- **East Student Desk**: `x: 16..42, z: -12..10, y: 5.5m`
  - Attached Plywood Chair Step: `x: 29, z: 12..16, y: 3.0m`
- **Central North-South Aisle**: `x: -8..8, z: -28..30` (Unobstructed 16m wide thoroughfare from South spawn to Teacher's desk!)
- **30cm Wooden Ruler Bridge**: `x: -38..38, z: -1.8..1.8, y: 5.5m` (Spans directly from West desk to East desk across the aisle).

### Sector 4: Art, Craft & Stationery Stations (South-East & South-West)
- **School Backpack Shelter**: `x: -40..-20, z: 22..40, y: 0..10m`
- **Metal Desk Stapler Bunker**: `x: 20..36, z: 20..36, y: 0..5.5m`
- **Open Stainless Steel Scissors**: `x: -10..2, z: 24..34, y: 0..4.4m`
- **Two-Tone Pink/Blue Erasers**: `x: -18..-6, z: 36..44, y: 0..2.4m`
- **Post-It Note Kicker Ramp**: `x: -4..4, z: 42..48, y: 0..3.6m`

### Sector 5: Clear Spawn Zone
- **Player Spawn Point**: `(0, 0.5, 30)` facing `-z` (North).
- **Clearance**: Minimum 10m radius clear of any colliding geometry at spawn height.

---

## 3. Stairway & Ramp Clearance Rules
1. **Never overlap stairways**: Every stairway bounding box must be isolated with at least 1.5m clearance on non-connecting sides.
2. **Flush Landings**: The top step must transition into an explicit `slab` platform sharing the exact elevation of the target floor (`delta y = 0.0`).
3. **Walkable Slopes**: Giant pens and pencils used as ramps must have stepped box colliders with maximum step height `0.35m` to enable seamless sprint-sliding without snagging.
