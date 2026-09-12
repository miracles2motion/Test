import * as THREE from 'three';
import { INK } from '../render.js';

/**
 * Map: PIRATE COVE (pirate_cove)
 * God Mode Scaffolding — Bounds and tiers synced with concept
 */
export function buildPirateCove(B, arena = false) {
  const { L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = INK.ORANGE ?? 3, GR = INK.GREEN ?? 4, BK = INK.BLACK ?? 2, BL = INK.BLUE ?? 0, RD = INK.RED ?? 1;

  L.key = 'pirate_cove';
  const P = arena ? 68 : 55, PH = arena ? 30 : 18, T = 6;
  const D = P - 3;
  L.bounds = { minX: -P, maxX: P, minZ: -P, maxZ: P };

  // 1. Foundation & Perimeter Walls
  box(0, -1.0, 0, 2 * P + T, 1.0, 2 * P + T, { ink: BL });
  box(0, 0, -P, 2 * P + T, PH, T, { ink: BL });
  box(0, 0, P, 2 * P + T, PH, T, { ink: BL });
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: BL });
  box(P, 0, 0, T, PH, 2 * P + T, { ink: BL });

  // Perimeter Doorways
  const doorFrame = (x, z, alongX) => {
    if (alongX) {
      box(x - 1.4, 0, z, 0.4, 3.4, 0.6, { noCollide: true, ink: BK });
      box(x + 1.4, 0, z, 0.4, 3.4, 0.6, { noCollide: true, ink: BK });
      box(x, 3.2, z, 3.2, 0.4, 0.6, { noCollide: true, ink: BK });
    } else {
      box(x, 0, z - 1.4, 0.6, 3.4, 0.4, { noCollide: true, ink: BK });
      box(x, 0, z + 1.4, 0.6, 3.4, 0.4, { noCollide: true, ink: BK });
      box(x, 3.2, z, 0.6, 0.4, 3.2, { noCollide: true, ink: BK });
    }
  };
  doorFrame(-D, 0, false); doorFrame(D, 0, false);
  doorFrame(0, -D, true); doorFrame(0, D, true);

  if (!arena) {
    const NG = { noNav: true, noGrapple: true };
    collider(0, PH, -P, 2 * P + T, 40, T, NG); collider(0, PH, P, 2 * P + T, 40, T, NG);
    collider(-P, PH, 0, T, 40, 2 * P + T, NG); collider(P, PH, 0, T, 40, 2 * P + T, NG);
    collider(0, PH + 38, 0, 2 * P + 40, 8.0, 2 * P + 40, NG);
  }

  // 2. Base Spawns & Vantages
  spawn(0, 0.2, D - 5);
  spawn(0, 0.2, -D + 5);
  spawn(-D + 5, 0.2, 0);
  spawn(D - 5, 0.2, 0);

  sniper(0, 9.3, 12);
  sniper(0, 9.3, -12);
  sniper(-30, 9.2, -D + 3);
  sniper(30, 9.2, D - 3);

  // Pickups
  pickup(0, 4.7, 0);
  pickup(0, 9.3, 0);
  pickup(-25, 3.9, -25);
  pickup(25, 3.9, 25);
  pickup(-14, 0.2, 6);
  pickup(14, 0.2, -6);

  // 3. Central Tier Dais
  box(0, 0, 0, 24, 4.5, 24, { ink: BL });
  slab(-12, -12, 12, 12, 4.5, 0.5, { ink: OR });
  
  // Connect stairs using learned math
  const rs = 0.2857, rn = 0.45;
  const stepCount = Math.ceil(4.5 / rs);
  const stairLength = stepCount * rn;
  stairs(0, 0, -12 - stairLength, '+z', stepCount, 3.2, { rise: rs, run: rn });
  stairs(0, 0, 12 + stairLength, '-z', stepCount, 3.2, { rise: rs, run: rn });

  // Ground collision floor
  collider(0, -2, 0, 100, 2, 100);
  L.playerStart.set(0, 0.2, D - 5); 
  
  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  // === DREAM AUTO-INJECTED MACRO STRUCTURES ===

  // === MACRO STRUCTURE: Galleon Sterncastle at (-43, 0, -13) ===
  box(-43, 0, -13, 8.0, 2.0, 6.0, { ink: BL });
  box(-43, 0 + 2.0, -13, 7.5, 2.5, 5.5, { ink: OR });
  slab(-43 - 4.0, -13 - 3.2, -43 + 4.0, -13 + 3.2, 0 + 4.5, 0.3, { ink: OR });
  rail(-43 - 4.0, -13 - 3.2, -43 + 4.0, -13 - 3.2, 0 + 4.5, { ink: BK });
  rail(-43 - 4.0, -13 + 3.2, -43 + 4.0, -13 + 3.2, 0 + 4.5, { ink: BK });
  rail(-43 - 4.0, -13 - 3.2, -43 - 4.0, -13 + 3.2, 0 + 4.5, { ink: BK });
  box(-43, 0 + 4.8, -13, 1.0, 3.0, 0.5, { ink: BK });
  ring(-43, 0 + 9.3, -13, 'z');
  pickup(-43, 0 + 4.7, -13);

  // === MACRO STRUCTURE: Lighthouse Beacon at (-37, 0, -43) ===
  cyl(-37, 0, -43, 2.2, 5.5, { seg: 10, ink: BL });
  slab(-37 - 2.8, -43 - 2.8, -37 + 2.8, -43 + 2.8, 0 + 5.0, 0.3, { ink: OR });
  rail(-37 - 2.8, -43 - 2.8, -37 + 2.8, -43 - 2.8, 0 + 5.0, { ink: BK });
  rail(-37 - 2.8, -43 + 2.8, -37 + 2.8, -43 + 2.8, 0 + 5.0, { ink: BK });
  cyl(-37, 0 + 5.3, -43, 1.5, 1.5, { seg: 8, noCollide: true, ink: OR });
  ring(-37, 0 + 9.3, -43, 'z');
  pickup(-37, 0 + 5.2, -43);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-37, 0, 23) ===
  box(-37 - 2.5, 0, 23 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-37 + 2.5, 0, 23 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-37 - 2.5, 0, 23 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-37 + 2.5, 0, 23 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-37 - 3.0, 23 - 3.0, -37 + 3.0, 23 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-37, 0 + 5.9, 23 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-37, 0 + 5.9, 23 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-37, 0 + 8.3, 23 + 4.0, 'z');
  pickup(-37, 0 + 6.1, 23 - 1.5);

  // === MACRO STRUCTURE: Galleon Sterncastle at (-31, 0, -25) ===
  box(-31, 0, -25, 8.0, 2.0, 6.0, { ink: BL });
  box(-31, 0 + 2.0, -25, 7.5, 2.5, 5.5, { ink: OR });
  slab(-31 - 4.0, -25 - 3.2, -31 + 4.0, -25 + 3.2, 0 + 4.5, 0.3, { ink: OR });
  rail(-31 - 4.0, -25 - 3.2, -31 + 4.0, -25 - 3.2, 0 + 4.5, { ink: BK });
  rail(-31 - 4.0, -25 + 3.2, -31 + 4.0, -25 + 3.2, 0 + 4.5, { ink: BK });
  rail(-31 - 4.0, -25 - 3.2, -31 - 4.0, -25 + 3.2, 0 + 4.5, { ink: BK });
  box(-31, 0 + 4.8, -25, 1.0, 3.0, 0.5, { ink: BK });
  ring(-31, 0 + 9.3, -25, 'z');
  pickup(-31, 0 + 4.7, -25);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Prop: Mooring Bollard
  cyl(-43, 4.5, -11, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-43, 4.5 + 1.0, -11, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Treasure Chest
  box(-31, 0, -11, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-31, 0 + 0.8, -11, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-31, 0 + 0.5, -11 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Treasure Chest
  box(-11, 0, -43, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-11, 0 + 0.8, -43, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-11, 0 + 0.5, -43 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Iron Cannon
  box(-47, 0, -23, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-47, 0 + 0.8, -23 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-47 - 0.7, 0 + 0.3, -23, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-47 + 0.7, 0 + 0.3, -23, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Timber Stack
  box(-43, 0, -35, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Timber Stack
  box(-47, 0, -31, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Rowboat
  box(-3, 0, -35, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-3 - 0.8, 0 + 0.4, -35, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-3 + 0.8, 0 + 0.4, -35, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-3, 0 + 0.4, -35 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-3, 0 + 0.4, -35 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-3, 0 + 0.6, -35, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Rowboat
  box(-15, 0, -15, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-15 - 0.8, 0 + 0.4, -15, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-15 + 0.8, 0 + 0.4, -15, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-15, 0 + 0.4, -15 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-15, 0 + 0.4, -15 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-15, 0 + 0.6, -15, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Rowboat
  box(-19, 0, -31, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-19 - 0.8, 0 + 0.4, -31, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-19 + 0.8, 0 + 0.4, -31, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-19, 0 + 0.4, -31 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-19, 0 + 0.4, -31 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-19, 0 + 0.6, -31, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Timber Stack
  box(-11, 0, -39, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Barrel Stack
  cyl(-43 - 0.5, 4.5, -15, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-43 + 0.5, 4.5, -15, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-43, 4.5 + 0.9, -15, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(-47, 0, -39, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-47, 0 + 0.8, -39, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-47, 0 + 0.5, -39 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(-23 - 0.5, 0, -3, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-23 + 0.5, 0, -3, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-23, 0 + 0.9, -3, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Barrel Stack
  cyl(-19 - 0.5, 0, -19, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-19 + 0.5, 0, -19, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-19, 0 + 0.9, -19, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(-15, 0, -23, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-15, 0 + 0.8, -23, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-15, 0 + 0.5, -23 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(-23 - 0.5, 0, -31, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-23 + 0.5, 0, -31, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-23, 0 + 0.9, -31, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(-3, 0, -31, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-3, 0 + 0.8, -31, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-3, 0 + 0.5, -31 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Timber Stack
  box(-11, 0, -27, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Rowboat
  box(-7, 0, -27, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-7 - 0.8, 0 + 0.4, -27, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-7 + 0.8, 0 + 0.4, -27, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-7, 0 + 0.4, -27 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-7, 0 + 0.4, -27 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-7, 0 + 0.6, -27, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Cargo Crate
  box(-43, 0, -3, 1.8, 1.8, 1.8, { ink: BL });
  box(-43, 0, -3, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Treasure Chest
  box(37, 0, -27, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(37, 0 + 0.8, -27, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(37, 0 + 0.5, -27 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Cargo Crate
  box(29, 0, -3, 1.8, 1.8, 1.8, { ink: BL });
  box(29, 0, -3, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Cargo Crate
  box(41, 0, -31, 1.8, 1.8, 1.8, { ink: BL });
  box(41, 0, -31, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Iron Cannon
  box(41, 0, -47, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(41, 0 + 0.8, -47 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(41 - 0.7, 0 + 0.3, -47, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(41 + 0.7, 0 + 0.3, -47, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Ship Mast
  cyl(1, 0, -35, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(1, 0 + 3.5, -35 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(1, 0 + 2.0, -35 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(37, 0, -39, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(37, 0 + 3.5, -39 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(37, 0 + 2.0, -39 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Treasure Chest
  box(13, 0, -35, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(13, 0 + 0.8, -35, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(13, 0 + 0.5, -35 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(29 - 0.5, 0, -15, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(29 + 0.5, 0, -15, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(29, 0 + 0.9, -15, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Timber Stack
  box(45, 0, -15, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Treasure Chest
  box(41, 0, -7, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(41, 0 + 0.8, -7, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(41, 0 + 0.5, -7 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Cargo Crate
  box(37, 0, -15, 1.8, 1.8, 1.8, { ink: BL });
  box(37, 0, -15, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Mooring Bollard
  cyl(49, 0, -3, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(49, 0 + 1.0, -3, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(33, 0, -35, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(33, 0 + 1.0, -35, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Treasure Chest
  box(45, 0, -11, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(45, 0 + 0.8, -11, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(45, 0 + 0.5, -11 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Ship Mast
  cyl(13, 0, -31, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(13, 0 + 3.5, -31 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(13, 0 + 2.0, -31 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(29, 0, -19, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(29, 0 + 3.5, -19 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(29, 0 + 2.0, -19 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Barrel Stack
  cyl(33 - 0.5, 0, -43, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(33 + 0.5, 0, -43, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(33, 0 + 0.9, -43, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Timber Stack
  box(33, 0, -7, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Treasure Chest
  box(29, 0, -27, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(29, 0 + 0.8, -27, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(29, 0 + 0.5, -27 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Rowboat
  box(33, 0, -47, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(33 - 0.8, 0 + 0.4, -47, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(33 + 0.8, 0 + 0.4, -47, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(33, 0 + 0.4, -47 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(33, 0 + 0.4, -47 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(33, 0 + 0.6, -47, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Cargo Crate
  box(-39, 0, 37, 1.8, 1.8, 1.8, { ink: BL });
  box(-39, 0, 37, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Ship Mast
  cyl(-43, 0, 5, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-43, 0 + 3.5, 5 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-43, 0 + 2.0, 5 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(-39, 0, 13, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-39, 0 + 3.5, 13 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-39, 0 + 2.0, 13 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(-35, 0, 5, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-35 - 0.8, 0 + 0.4, 5, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-35 + 0.8, 0 + 0.4, 5, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-35, 0 + 0.4, 5 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-35, 0 + 0.4, 5 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-35, 0 + 0.6, 5, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(-47, 0, 25, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-47, 0 + 3.5, 25 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-47, 0 + 2.0, 25 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Mooring Bollard
  cyl(-31, 0, 1, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-31, 0 + 1.0, 1, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Iron Cannon
  box(-23, 0, 29, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-23, 0 + 0.8, 29 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-23 - 0.7, 0 + 0.3, 29, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-23 + 0.7, 0 + 0.3, 29, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Rowboat
  box(-43, 0, 49, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-43 - 0.8, 0 + 0.4, 49, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-43 + 0.8, 0 + 0.4, 49, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-43, 0 + 0.4, 49 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-43, 0 + 0.4, 49 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-43, 0 + 0.6, 49, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Mooring Bollard
  cyl(-39, 0, 9, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-39, 0 + 1.0, 9, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Treasure Chest
  box(-19, 0, 41, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-19, 0 + 0.8, 41, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-19, 0 + 0.5, 41 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Rowboat
  box(-15, 0, 25, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-15 - 0.8, 0 + 0.4, 25, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-15 + 0.8, 0 + 0.4, 25, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-15, 0 + 0.4, 25 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-15, 0 + 0.4, 25 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-15, 0 + 0.6, 25, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Timber Stack
  box(-43, 0, 37, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Iron Cannon
  box(-11, 4.5, 9, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-11, 4.5 + 0.8, 9 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-11 - 0.7, 4.5 + 0.3, 9, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-11 + 0.7, 4.5 + 0.3, 9, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Cargo Crate
  box(-7, 0, 25, 1.8, 1.8, 1.8, { ink: BL });
  box(-7, 0, 25, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Iron Cannon
  box(-27, 0, 41, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-27, 0 + 0.8, 41 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-27 - 0.7, 0 + 0.3, 41, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-27 + 0.7, 0 + 0.3, 41, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(-11 - 0.5, 0, 37, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-11 + 0.5, 0, 37, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-11, 0 + 0.9, 37, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Mooring Bollard
  cyl(-47, 0, 9, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-47, 0 + 1.0, 9, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Barrel Stack
  cyl(-35 - 0.5, 0, 45, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-35 + 0.5, 0, 45, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-35, 0 + 0.9, 45, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(-15, 0, 21, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-15, 0 + 0.8, 21 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-15 - 0.7, 0 + 0.3, 21, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-15 + 0.7, 0 + 0.3, 21, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(-31 - 0.5, 0, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-31 + 0.5, 0, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-31, 0 + 0.9, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(21, 0, 5, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(21, 0 + 0.8, 5 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(21 - 0.7, 0 + 0.3, 5, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(21 + 0.7, 0 + 0.3, 5, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Mooring Bollard
  cyl(29, 0, 33, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(29, 0 + 1.0, 33, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Rowboat
  box(9, 0, 33, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(9 - 0.8, 0 + 0.4, 33, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(9 + 0.8, 0 + 0.4, 33, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(9, 0 + 0.4, 33 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(9, 0 + 0.4, 33 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(9, 0 + 0.6, 33, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Timber Stack
  box(29, 0, 45, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Treasure Chest
  box(41, 0, 5, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(41, 0 + 0.8, 5, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(41, 0 + 0.5, 5 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Timber Stack
  box(33, 0, 37, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Timber Stack
  box(9, 0, 29, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Treasure Chest
  box(13, 0, 29, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(13, 0 + 0.8, 29, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(13, 0 + 0.5, 29 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Timber Stack
  box(29, 0, 49, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Cargo Crate
  box(25, 0, 5, 1.8, 1.8, 1.8, { ink: BL });
  box(25, 0, 5, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Barrel Stack
  cyl(21 - 0.5, 0, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(21 + 0.5, 0, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(21, 0 + 0.9, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(5, 0, 29, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(5, 0 + 0.8, 29, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(5, 0 + 0.5, 29 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(17 - 0.5, 0, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(17 + 0.5, 0, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(17, 0 + 0.9, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(37, 0, 45, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(37, 0 + 0.8, 45, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(37, 0 + 0.5, 45 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Treasure Chest
  box(41, 0, 9, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(41, 0 + 0.8, 9, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(41, 0 + 0.5, 9 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Timber Stack
  box(17, 0, 29, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Mooring Bollard
  cyl(5, 0, 25, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(5, 0 + 1.0, 25, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Ship Mast
  cyl(1, 0, 45, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(1, 0 + 3.5, 45 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(1, 0 + 2.0, 45 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Treasure Chest
  box(21, 0, 33, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(21, 0 + 0.8, 33, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(21, 0 + 0.5, 33 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Cargo Crate
  box(33, 0, 45, 1.8, 1.8, 1.8, { ink: BL });
  box(33, 0, 45, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });
  // === END DREAM AUTO-INJECTED PROPS ===

  B.finish();
  return L;
}
