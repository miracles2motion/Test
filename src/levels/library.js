import * as THREE from 'three';
import { INK } from '../render.js';
import { buildBookStack, buildDeskLamp, buildOpenBookRamp, buildInkwellCover } from '../prefabs.js';

/**
 * Builds "THE LIBRARY" (Colossal Study Desk) map.
 * Scaled to make the player feel like a miniature ink figure traversing giant stationery,
 * towering tomes, ruler sky-bridges, and high-wire bookmark cables.
 * 
 * 3-Lane Tactical Layout:
 * - Mid Lane: The Grand Desk Arena (open wood surface with inkwells, eraser cover, and ruler bridges)
 * - West Lane: The Bookcase Catwalks & Shelves (vertical stepped books with sniper perches)
 * - East Lane: The Under-Desk Catacombs & Cable Ducts (low-clearance CQB flanking corridor)
 */
export function buildLibrary(B, arena = false) {
  const { L, box, slab, stairs, cyl, ring, spawn, sniper, pickup, planes, barrel, rail, addGeo, collider } = B;
  const OR = INK.ORANGE ?? 3;
  const GR = INK.GREEN ?? 4;
  const BK = INK.BLACK ?? 2;
  const BL = INK.BLUE ?? 0;
  const RD = INK.RED ?? 1;

  L.key = 'library';
  const P = arena ? 68 : 56;
  const PH = arena ? 34 : 24;
  const T = 6;
  L.bounds = { minX: -P, maxX: P, minZ: -P, maxZ: P };

  // ==================== 1. FOUNDATION & PERIMETER WALLS ====================
  // Ground floor base (Dark oak parquet floor at Y=0)
  box(0, -1.0, 0, 2 * P + T, 1.0, 2 * P + T, { ink: BK });

  // Perimeter library mahogany wood-paneled walls
  box(0, 0, -P, 2 * P + T, PH, T, { ink: BL });
  box(0, 0, P, 2 * P + T, PH, T, { ink: BL });
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: BL });
  box(P, 0, 0, T, PH, 2 * P + T, { ink: BL });

  // Ceiling collider (prevent sky escaping)
  collider(0, 56, 0, 2 * P + 40, 8, 2 * P + 40, { noNav: true, noGrapple: true });

  // ==================== 2. SPAWN BASES & START POSITIONS ====================
  // South Base (Player Spawn in Solo, Team 0 in Arena)
  L.playerStart = new THREE.Vector3(0, 0.2, 38);
  box(-18, 0, 40, 12, 4.0, 2.0, { ink: BL, tag: 'cover' });
  box(18, 0, 40, 12, 4.0, 2.0, { ink: BL, tag: 'cover' });
  spawn(-14, 0.2, 36);
  spawn(14, 0.2, 36);
  spawn(0, 0.2, 42);

  // North Base (Team 1 in Arena / Distant spawn points)
  box(-18, 0, -40, 12, 4.0, 2.0, { ink: BL, tag: 'cover' });
  box(18, 0, -40, 12, 4.0, 2.0, { ink: BL, tag: 'cover' });
  spawn(-14, 0.2, -36);
  spawn(14, 0.2, -36);
  spawn(0, 0.2, -42);

  // Define structured team spawn lists for multiplayer spawn manager
  L.teamSpawns = [
    [[-14, 0.2, 36], [14, 0.2, 36], [0, 0.2, 42], [-8, 0.2, 28], [8, 0.2, 28]].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    [[-14, 0.2, -36], [14, 0.2, -36], [0, 0.2, -42], [-8, 0.2, -28], [8, 0.2, -28]].map(([x, y, z]) => new THREE.Vector3(x, y, z))
  ];

  // ==================== 3. MID LANE: THE GRAND DESK ARENA (Y = 6.0m) ====================
  // 4 Colossal Brass/Wood Desk Legs supporting the desktop
  cyl(-24, 0, -22, 1.8, 6.0, { ink: BK });
  cyl(24, 0, -22, 1.8, 6.0, { ink: BK });
  cyl(-24, 0, 22, 1.8, 6.0, { ink: BK });
  cyl(24, 0, 22, 1.8, 6.0, { ink: BK });

  // Main Desktop Platform (spans X: -26 to 26, Z: -24 to 24 at Y = 6.0m)
  slab(-26, -24, 26, 24, 6.0, 0.6, { ink: OR, tag: 'desk' });

  // Central Desk Props & Mid-Height Cover on Desktop
  // Giant Inkwell Cover in center mid-field
  buildInkwellCover(B, 0, 6.0, 0, { r: 3.2, h: 2.0 });

  // Giant Vinyl Eraser blocks (waist-high and full-height cover)
  box(-8, 6.0, -8, 4.0, 1.8, 2.4, { ink: RD, tag: 'cover' });
  box(8, 6.0, 8, 4.0, 1.8, 2.4, { ink: RD, tag: 'cover' });

  // Heavy Brass Paperweight Dome on Desktop
  cyl(0, 6.0, -14, 2.5, 1.5, { seg: 16, ink: BK, tag: 'cover' });
  ring(0, 9.5, -14, 'y');

  // Giant Wooden Ruler Bridges connecting Desktop to surrounding perches
  // Diagonal ruler bridge spanning from desktop towards West bookcase
  slab(-26, -6, -14, -2, 6.2, 0.2, { ink: OR });
  // Horizontal ruler bridge extending across South
  slab(-12, 18, 12, 21, 6.2, 0.2, { ink: OR });

  // Ramps leading from Ground (Y=0) onto Desktop (Y=6.0m)
  // South approach ramp: Open Book Ramp (starts outside at Z=36, climbs to Y=6.0m at Z=24)
  buildOpenBookRamp(B, 0, 0, 36, 8, 6.0, 12, '-z', { ink: OR });
  // North approach ramp: Open Book Ramp (starts outside at Z=-36, climbs to Y=6.0m at Z=-24)
  buildOpenBookRamp(B, 0, 0, -36, 8, 6.0, 12, '+z', { ink: OR });

  // Desktop pickups
  pickup(0, 6.2, -6);
  pickup(0, 6.2, 6);
  pickup(-10, 6.2, 0);
  pickup(10, 6.2, 0);

  // Desktop spawns
  spawn(-6, 6.2, -12);
  spawn(6, 6.2, 12);
  spawn(-14, 6.2, 8);
  spawn(14, 6.2, -8);

  // ==================== 4. WEST LANE: THE BOOKCASE CATWALKS & SHELVES ====================
  // Massive stacked book tomes creating multi-tier vertical vantage points
  // Tier 1 Book Stack (Y=0 to 4.8m)
  buildBookStack(B, -38, 0, -18, 4, { w: 10, d: 14, thick: 1.2, inkSpine: BL });
  spawn(-38, 5.0, -18);
  pickup(-38, 5.0, -18);

  // Tier 2 Book Stack (Y=0 to 9.6m) - Elevated High-Ground
  buildBookStack(B, -40, 0, 6, 8, { w: 10, d: 12, thick: 1.2, inkSpine: RD });
  spawn(-40, 9.8, 6);
  pickup(-40, 9.8, 6);

  // Interconnecting Bookmark Catwalk (Spans from Tier 1 to Tier 2)
  slab(-42, -10, -36, 0, 6.4, 0.25, { ink: OR });
  rail(-42, -10, -36, -10, 6.4, { ink: BK });

  // Stair connection from ground to Tier 1 Book Stack (lands flush on Tier 1 at Y=4.8m, Z=-25.0)
  stairs(-38, 0, -31.75, '+z', 15, 4.0, { rise: 0.32, run: 0.45, ink: BK });

  // Catwalk connecting West Bookcase directly onto the Grand Desktop
  slab(-34, -4, -26, 0, 6.0, 0.3, { ink: BK });

  // Wall-mounted Bookshelf Ledge at Y = 14.0m (Ultimate Sniper Perch)
  box(-46, 14.0, 0, 6.0, 0.6, 36.0, { ink: BL, tag: 'cover' });
  // Dream Detail: Scattered Desk Props (Static collision geometry)
  box(-46 - 1.2, 14.0 + 0.4, 0 + 0.5, 0.6, 0.2, 0.8, { ink: BL }); // Book
  box(-46 + 0.8, 14.0 + 0.35, 0 - 1.0, 0.8, 0.1, 0.1, { ink: OR }); // Pencil
  cyl(-46 - 0.2, 14.0 + 0.6, 0 + 1.2, 0.2, 0.6, { ink: BK }); // Ink Well
  sniper(-46, 14.8, -10);
  sniper(-46, 14.8, 10);
  sniper(-40, 9.8, 6);
  pickup(-46, 14.8, 0);

  // Grapple rings along the West Bookcase Lane for rapid swing ascension
  ring(-38, 12.0, -18, 'y');
  ring(-40, 16.0, 6, 'y');
  ring(-42, 17.5, 0, 'y');

  // ==================== 5. EAST LANE: UNDER-DESK CATACOMBS & POWER CORDS ====================
  // Low-ceiling, fast-paced CQB flanking route underneath the main desk frame (Y = 0 to 4.5m)
  // Low-profile stationery storage boxes and pencil tins acting as tactical cover
  box(36, 0, -4, 5.0, 3.2, 6.0, { ink: GR, tag: 'cover' });
  box(38, 0, 12, 6.0, 2.6, 7.0, { ink: GR, tag: 'cover' });

  // Coiled heavy-duty desk power cable (horizontal cylinders for vaulting cover)
  cyl(30, 0, 0, 0.8, 16.0, { axis: 'z', seg: 12, ink: BK });
  cyl(36, 0, 2, 0.6, 12.0, { axis: 'x', seg: 12, ink: BK });

  // Footrest Platform beneath the desk (Y = 1.8m)
  slab(12, -14, 22, 14, 1.8, 0.4, { ink: BK });
  // Dream Heal: Normalized step rise
  stairs(17, 0, 18, '-z', 6, 3.0, { rise: 0.34, run: 0.53, ink: BK  });
  // Dream Heal: Normalized step rise
  stairs(17, 0, -18, '+z', 6, 3.0, { rise: 0.34, run: 0.53, ink: BK  });

  // East Side Book Stack leading up to Desktop height
  buildBookStack(B, 38, 0, -28, 5, { w: 9, d: 11, thick: 1.2, inkSpine: OR });
  // Stairs to East Book Stack (top surface at Y=6.0m, edge at Z=-22.5)
  stairs(38, 0, -14.4, '-z', 18, 3.5, { rise: 6.0 / 18, run: 0.45, ink: BK });
  spawn(38, 6.2, -28);
  pickup(38, 6.2, -28);

  // East Catacomb ground spawns & pickups
  spawn(34, 0.2, -6);
  spawn(34, 0.2, 6);
  pickup(34, 0.2, 0);
  pickup(17, 2.0, 0);

  // East Wall Bookshelf Ledge (East Counter-Sniper Perch at Y = 13.5m)
  box(46, 13.5, -4, 6.0, 0.6, 32.0, { ink: BL, tag: 'cover' });
  // Dream Detail: Scattered Desk Props (Static collision geometry)
  box(46 - 1.2, 13.5 + 0.4, -4 + 0.5, 0.6, 0.2, 0.8, { ink: BL }); // Book
  box(46 + 0.8, 13.5 + 0.35, -4 - 1.0, 0.8, 0.1, 0.1, { ink: OR }); // Pencil
  cyl(46 - 0.2, 13.5 + 0.6, -4 + 1.2, 0.2, 0.6, { ink: BK }); // Ink Well
  sniper(46, 14.3, -12);
  sniper(46, 14.3, 12);
  pickup(46, 14.3, 0);
  ring(46, 18.0, 0, 'x');

  // ==================== 6. AIRSPACE & COLOSSAL DESK LAMPS ====================
  // Northeast Colossal Articulated Architect's Lamp
  buildDeskLamp(B, 22, 6.0, -20, { reachX: -12.0, reachZ: 10.0, ink: BK });

  // Southwest Colossal Articulated Architect's Lamp
  buildDeskLamp(B, -22, 6.0, 20, { reachX: 12.0, reachZ: -10.0, ink: BK });

  // Hanging bookmark cable / wire platforms suspended from overhead
  const cable = (x, y, z, topY) => box(x, y, z, 0.12, Math.max(1, topY - y), 0.12, { noCollide: true, ink: BK });
  const pad = (x, y, z, w, d) => {
    box(x, y, z, w, 0.4, d, { tag: 'perch' });
    cable(x, y + 0.4, z, 48);
    ring(x, y - 1.2, z, 'y');
  };
  pad(0, 18.0, 0, 6.0, 6.0); // Center floating bookmark platform
  pad(-16, 15.0, -18, 5.0, 5.0);
  pad(16, 15.0, 18, 5.0, 5.0);

  sniper(0, 18.6, 0);
  pickup(0, 18.6, 0);

  // Overhead circulating paper planes for grapple mobility
  planes(3, 26, 24, { scale: 1.6, rStep: 8, hStep: 4, speed: 0.1, ink: BL });

  // Arena-specific spawn list mirroring all valid spawns
  L.arenaSpawns = [...L.spawns];

  
  

  
  
  
  

  
  
  
  

  
  
  
  

  
  
  
  

  
  
  
  // === DREAM AUTO-INJECTED MACRO STRUCTURES ===

  // === MACRO STRUCTURE: Sketchbook Rampart at (34, 0, 22) ===
  box(34, 0, 22, 8.0, 0.8, 5.0, { ink: BL });
  box(34 - 2.5, 0 + 0.8, 22, 3.0, 2.0, 4.5, { ink: BL });
  box(34 + 2.5, 0 + 0.8, 22, 3.0, 3.5, 4.5, { ink: BL });
  slab(34 - 4.2, 22 - 2.8, 34 + 4.2, 22 + 2.8, 0 + 3.5, 0.3, { ink: OR });
  rail(34 - 4.2, 22 - 2.8, 34 + 4.2, 22 - 2.8, 0 + 3.5, { ink: BK });
  box(34, 0 + 4.0, 22, 8.2, 0.2, 5.2, { noCollide: true, ink: BK });
  ring(34, 0 + 7.3, 22, 'y');
  pickup(34 - 2.0, 0 + 3.7, 22);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Macro: Stationery Storage Bunker
  box(-48, 0, -48, 7.0, 2.4, 7.0, { ink: BL });
  slab(-48 - 3.8, -48 - 3.8, -48 + 3.8, -48 + 3.8, 0 + 2.4, 0.3, { ink: OR });
  box(-48 - 2.5, 0 + 2.4, -48, 0.6, 1.2, 2.0, { ink: RD, tag: 'cover' });
  box(-48 + 2.0, 0 + 2.4, -48 + 1.5, 1.8, 1.0, 1.8, { ink: GR, tag: 'cover' });
  ring(-48, 0 + 6.5, -48, 'y');

  // Macro: Pencil Pot Redoubt
  cyl(-48, 0, 48, 3.0, 3.5, { seg: 10, ink: BK, tag: 'cover' });
  slab(-48 - 3.2, 48 - 3.2, -48 + 3.2, 48 + 3.2, 0 + 3.5, 0.3, { ink: OR });
  cyl(-48 - 1.0, 0 + 3.5, 48 - 1.0, 0.4, 2.5, { seg: 6, ink: OR });
  cyl(-48 + 1.2, 0 + 3.5, 48 + 0.8, 0.35, 2.8, { seg: 6, ink: BL });
  ring(-48, 0 + 7.2, 48, 'y');

  // Macro: Stationery Storage Bunker
  box(48, 0, -48, 7.0, 2.4, 7.0, { ink: BL });
  slab(48 - 3.8, -48 - 3.8, 48 + 3.8, -48 + 3.8, 0 + 2.4, 0.3, { ink: OR });
  box(48 - 2.5, 0 + 2.4, -48, 0.6, 1.2, 2.0, { ink: RD, tag: 'cover' });
  box(48 + 2.0, 0 + 2.4, -48 + 1.5, 1.8, 1.0, 1.8, { ink: GR, tag: 'cover' });
  ring(48, 0 + 6.5, -48, 'y');

  // Macro: Stationery Storage Bunker
  box(48, 0, -32, 7.0, 2.4, 7.0, { ink: BL });
  slab(48 - 3.8, -32 - 3.8, 48 + 3.8, -32 + 3.8, 0 + 2.4, 0.3, { ink: OR });
  box(48 - 2.5, 0 + 2.4, -32, 0.6, 1.2, 2.0, { ink: RD, tag: 'cover' });
  box(48 + 2.0, 0 + 2.4, -32 + 1.5, 1.8, 1.0, 1.8, { ink: GR, tag: 'cover' });
  ring(48, 0 + 6.5, -32, 'y');

  // Macro: Stationery Storage Bunker
  box(48, 0, -16, 7.0, 2.4, 7.0, { ink: BL });
  slab(48 - 3.8, -16 - 3.8, 48 + 3.8, -16 + 3.8, 0 + 2.4, 0.3, { ink: OR });
  box(48 - 2.5, 0 + 2.4, -16, 0.6, 1.2, 2.0, { ink: RD, tag: 'cover' });
  box(48 + 2.0, 0 + 2.4, -16 + 1.5, 1.8, 1.0, 1.8, { ink: GR, tag: 'cover' });
  ring(48, 0 + 6.5, -16, 'y');

  // Macro: Stationery Storage Bunker
  box(48, 0, 0, 7.0, 2.4, 7.0, { ink: BL });
  slab(48 - 3.8, 0 - 3.8, 48 + 3.8, 0 + 3.8, 0 + 2.4, 0.3, { ink: OR });
  box(48 - 2.5, 0 + 2.4, 0, 0.6, 1.2, 2.0, { ink: RD, tag: 'cover' });
  box(48 + 2.0, 0 + 2.4, 0 + 1.5, 1.8, 1.0, 1.8, { ink: GR, tag: 'cover' });
  ring(48, 0 + 6.5, 0, 'y');

  // Macro: Stationery Storage Bunker
  box(48, 0, 32, 7.0, 2.4, 7.0, { ink: BL });
  slab(48 - 3.8, 32 - 3.8, 48 + 3.8, 32 + 3.8, 0 + 2.4, 0.3, { ink: OR });
  box(48 - 2.5, 0 + 2.4, 32, 0.6, 1.2, 2.0, { ink: RD, tag: 'cover' });
  box(48 + 2.0, 0 + 2.4, 32 + 1.5, 1.8, 1.0, 1.8, { ink: GR, tag: 'cover' });
  ring(48, 0 + 6.5, 32, 'y');
  // === END DREAM AUTO-INJECTED PROPS ===
  B.finish();
  return L;
}
