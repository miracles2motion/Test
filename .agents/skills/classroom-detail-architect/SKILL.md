---
name: classroom-detail-architect
description: Architectural detailing and artistic rendering guidelines for classroom props in Doodle Strike. Governs biro-ink crosshatching, chalkboard scribbles, book spine embossed gold leaf, pencil ferrules, and material authenticity.
---

# Classroom Detail Architect: Material Authenticity & Biro Detailing

This skill defines the artistic rendering guidelines, prop anatomy, and biro pen-and-ink detailing required to match the benchmark visual excellence of Doodle District.

---

## 1. Classroom Material Palette (INK IDs)

| Ink ID | Constant | Visual Aesthetic | Classroom Applications |
|---|---|---|---|
| `0` | `INK.BLUE` | Crisp blue ballpoint pen | Notebook page lines, blue pen barrels, ink spill lakes, student desk steel frames, atlas covers |
| `1` | `INK.RED` | Red grading pen / marker | Silk bookmark ribbons, teacher's grading pen, scissor handles, red book covers, apple |
| `2` | `INK.BLACK` | Graphite lead / black biro | Chalkboard frames, textbook leatherette, pencil leads, ferrule crimp rings, staple strips, scissor blades |
| `3` | `INK.ORANGE` | Yellow wood / highlighter | No. 2 HB pencil wooden barrels, wooden ruler bridge, post-it note pads, compass legs |
| `4` | `INK.GREEN` | Green slate / felt | Chalkboard writing surface, felt board erasers, mathematics textbook covers |
| `5` | `INK.PINK` | Pink rubber eraser | Pencil eraser nubs, bevel rubber blocks |

---

## 2. Prop Detailing Standards

### A. The Green Slate Chalkboard (`z = -54`)
- Outer dark wood frame (`box` with thickness `0.4m`, depth `0.6m`, `INK.BLACK`).
- Inner green slate writing board (`box` in `INK.GREEN`).
- Wooden chalk rail along bottom (`y = 2.0m`, depth `1.2m`).
- Chalk sticks (`cyl` radius `0.15m`, length `1.8m`) resting on rail in white/yellow ink.
- Felt chalkboard erasers (`box` width `2.2m`, height `0.8m`, depth `1.0m`).
- White biro chalk equations and diagrams sketched across the board:
  - `E = mc²`
  - `a² + b² = c²`
  - Stick figure graduation doodle.

### B. Giant Hardcover Textbooks
- Hardcover front and back boards extending `0.5m` past the paper pages.
- Inset paper page block with grooved lines along exposed edges.
- Rounded convex cylindrical spine (`CylinderGeometry` half-arc).
- 4 raised gold embossed decorative ribs (`INK.ORANGE`) wrapping the spine.
- Dark spine title plaque (`box` in `INK.BLACK`).
- Crimson silk bookmark ribbon (`INK.RED`) draping from pages down to the floor.

### C. Giant Ballpoint Biro Pens
- Hexagonal 6-faceted translucent barrel (`CylinderGeometry(0.7, 0.7, len, 6)`).
- Thin inner ink reservoir tube visible through the barrel.
- White/brass tapering nose cone.
- Tungsten carbide spherical ball point (`SphereGeometry`).
- Cap at rear with long curved pocket clip acting as an elevated catwalk.

### D. Giant Wooden No. 2 HB Pencils
- Hexagonal yellow body (`CylinderGeometry(0.65, 0.65, len, 6)` in `INK.ORANGE`).
- Stamped label "★ NO. 2 / HB ★" in dark ink dashes along the flat facet.
- Carved wooden cone tip showing sculpted wood facets.
- Sharp black graphite lead point.
- Crimped metal ferrule band with 3 raised rings (`INK.BLACK`).
- Rounded pink rubber eraser nub (`INK.PINK`).

### E. The Teacher's Oak Desk & Center Kneehole Tunnel
- Solid oak desktop slab (`y = 6.5m`, width `32m`, depth `16m`).
- Left and right drawer pedestal columns with brass cup handles.
- Center 8m wide vaulted kneehole tunnel allowing high-speed sprint-through traversal.
- Teacher's brass bell and red apple on top of the desk.

### F. The Metal Desk Stapler
- Heavy cast-iron base plate with anvil crimp grooves.
- Lifted upper magazine arm angled at 18°, exposing a row of shiny metal staples.
- Walk-through covered tunnel underneath the jaw.
- Rear hinge block with stairs up to the sniper firing deck on the magazine roof.
