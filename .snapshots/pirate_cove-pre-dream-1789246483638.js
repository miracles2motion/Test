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

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-31, 0, 35) ===
  box(-31 - 2.5, 0, 35 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-31 + 2.5, 0, 35 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-31 - 2.5, 0, 35 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-31 + 2.5, 0, 35 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-31 - 3.0, 35 - 3.0, -31 + 3.0, 35 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-31, 0 + 5.9, 35 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-31, 0 + 5.9, 35 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-31, 0 + 8.3, 35 + 4.0, 'z');
  pickup(-31, 0 + 6.1, 35 - 1.5);

  // === MACRO STRUCTURE: Galleon Sterncastle at (-25, 0, -43) ===
  box(-25, 0, -43, 8.0, 2.0, 6.0, { ink: BL });
  box(-25, 0 + 2.0, -43, 7.5, 2.5, 5.5, { ink: OR });
  slab(-25 - 4.0, -43 - 3.2, -25 + 4.0, -43 + 3.2, 0 + 4.5, 0.3, { ink: OR });
  rail(-25 - 4.0, -43 - 3.2, -25 + 4.0, -43 - 3.2, 0 + 4.5, { ink: BK });
  rail(-25 - 4.0, -43 + 3.2, -25 + 4.0, -43 + 3.2, 0 + 4.5, { ink: BK });
  rail(-25 - 4.0, -43 - 3.2, -25 - 4.0, -43 + 3.2, 0 + 4.5, { ink: BK });
  box(-25, 0 + 4.8, -43, 1.0, 3.0, 0.5, { ink: BK });
  ring(-25, 0 + 9.3, -43, 'z');
  pickup(-25, 0 + 4.7, -43);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-25, 0, -13) ===
  box(-25 - 2.5, 0, -13 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, -13 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 - 2.5, 0, -13 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, -13 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-25 - 3.0, -13 - 3.0, -25 + 3.0, -13 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-25, 0 + 5.9, -13 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-25, 0 + 5.9, -13 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-25, 0 + 8.3, -13 + 4.0, 'z');
  pickup(-25, 0 + 6.1, -13 - 1.5);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-25, 0, 5) ===
  box(-25 - 2.5, 0, 5 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, 5 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 - 2.5, 0, 5 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, 5 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-25 - 3.0, 5 - 3.0, -25 + 3.0, 5 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-25, 0 + 5.9, 5 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-25, 0 + 5.9, 5 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-25, 0 + 8.3, 5 + 4.0, 'z');
  pickup(-25, 0 + 6.1, 5 - 1.5);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Prop: Rowboat
  box(-15, 0, -39, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-15 - 0.8, 0 + 0.4, -39, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-15 + 0.8, 0 + 0.4, -39, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-15, 0 + 0.4, -39 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-15, 0 + 0.4, -39 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-15, 0 + 0.6, -39, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Rowboat
  box(-47, 0, -7, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-47 - 0.8, 0 + 0.4, -7, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-47 + 0.8, 0 + 0.4, -7, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-47, 0 + 0.4, -7 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-47, 0 + 0.4, -7 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-47, 0 + 0.6, -7, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Barrel Stack
  cyl(-43 - 0.5, 0, -39, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-43 + 0.5, 0, -39, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-43, 0 + 0.9, -39, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Mooring Bollard
  cyl(-11, 0, -19, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-11, 0 + 1.0, -19, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Barrel Stack
  cyl(-47 - 0.5, 0, -3, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-47 + 0.5, 0, -3, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-47, 0 + 0.9, -3, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Ship Mast
  cyl(-35, 0, -23, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-35, 0 + 3.5, -23 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-35, 0 + 2.0, -23 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Barrel Stack
  cyl(-31 - 0.5, 0, -7, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-31 + 0.5, 0, -7, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-31, 0 + 0.9, -7, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Ship Mast
  cyl(-47, 0, -11, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-47, 0 + 3.5, -11 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-47, 0 + 2.0, -11 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Treasure Chest
  box(-15, 0, -7, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-15, 0 + 0.8, -7, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-15, 0 + 0.5, -7 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Iron Cannon
  box(-7, 4.5, -7, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-7, 4.5 + 0.8, -7 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-7 - 0.7, 4.5 + 0.3, -7, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-7 + 0.7, 4.5 + 0.3, -7, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(-15 - 0.5, 0, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-15 + 0.5, 0, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-15, 0 + 0.9, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Mooring Bollard
  cyl(-11, 0, -47, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-11, 0 + 1.0, -47, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Barrel Stack
  cyl(-15 - 0.5, 0, -43, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-15 + 0.5, 0, -43, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-15, 0 + 0.9, -43, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Barrel Stack
  cyl(-19 - 0.5, 0, -43, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-19 + 0.5, 0, -43, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-19, 0 + 0.9, -43, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(-7, 4.5, -3, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-7, 4.5 + 0.8, -3, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-7, 4.5 + 0.5, -3 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Rowboat
  box(-11, 0, -23, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-11 - 0.8, 0 + 0.4, -23, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-11 + 0.8, 0 + 0.4, -23, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-11, 0 + 0.4, -23 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-11, 0 + 0.4, -23 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-11, 0 + 0.6, -23, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Treasure Chest
  box(-35, 0, -31, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-35, 0 + 0.8, -31, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-35, 0 + 0.5, -31 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Treasure Chest
  box(-19, 0, -15, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-19, 0 + 0.8, -15, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-19, 0 + 0.5, -15 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Iron Cannon
  box(-31, 0, -15, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-31, 0 + 0.8, -15 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-31 - 0.7, 0 + 0.3, -15, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-31 + 0.7, 0 + 0.3, -15, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Rowboat
  box(-39, 0, -7, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-39 - 0.8, 0 + 0.4, -7, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-39 + 0.8, 0 + 0.4, -7, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-39, 0 + 0.4, -7 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-39, 0 + 0.4, -7 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-39, 0 + 0.6, -7, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Iron Cannon
  box(-35, 0, -27, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-35, 0 + 0.8, -27 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-35 - 0.7, 0 + 0.3, -27, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-35 + 0.7, 0 + 0.3, -27, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(-7 - 0.5, 0, -39, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-7 + 0.5, 0, -39, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-7, 0 + 0.9, -39, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(-15, 0, -3, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-15, 0 + 0.8, -3 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-15 - 0.7, 0 + 0.3, -3, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-15 + 0.7, 0 + 0.3, -3, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Iron Cannon
  box(-43, 0, -7, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-43, 0 + 0.8, -7 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-43 - 0.7, 0 + 0.3, -7, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-43 + 0.7, 0 + 0.3, -7, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Iron Cannon
  box(-3, 0, -43, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-3, 0 + 0.8, -43 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-3 - 0.7, 0 + 0.3, -43, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-3 + 0.7, 0 + 0.3, -43, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Mooring Bollard
  cyl(-39, 0, -43, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-39, 0 + 1.0, -43, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Rowboat
  box(-11, 0, -31, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-11 - 0.8, 0 + 0.4, -31, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-11 + 0.8, 0 + 0.4, -31, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-11, 0 + 0.4, -31 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-11, 0 + 0.4, -31 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-11, 0 + 0.6, -31, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Mooring Bollard
  cyl(-39, 0, -11, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-39, 0 + 1.0, -11, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Barrel Stack
  cyl(-43 - 0.5, 0, -19, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-43 + 0.5, 0, -19, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-43, 0 + 0.9, -19, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(-39, 0, -27, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-39, 0 + 0.8, -27 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-39 - 0.7, 0 + 0.3, -27, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-39 + 0.7, 0 + 0.3, -27, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Rowboat
  box(-19, 0, -39, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-19 - 0.8, 0 + 0.4, -39, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-19 + 0.8, 0 + 0.4, -39, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-19, 0 + 0.4, -39 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-19, 0 + 0.4, -39 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-19, 0 + 0.6, -39, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(-39, 0, -3, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-39, 0 + 3.5, -3 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-39, 0 + 2.0, -3 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Iron Cannon
  box(-7, 4.5, -11, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-7, 4.5 + 0.8, -11 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-7 - 0.7, 4.5 + 0.3, -11, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-7 + 0.7, 4.5 + 0.3, -11, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Mooring Bollard
  cyl(-39, 0, -39, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-39, 0 + 1.0, -39, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Treasure Chest
  box(-35, 0, -7, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-35, 0 + 0.8, -7, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-35, 0 + 0.5, -7 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(-3 - 0.5, 0, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-3 + 0.5, 0, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-3, 0 + 0.9, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(-23, 0, -19, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-23, 0 + 0.8, -19 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-23 - 0.7, 0 + 0.3, -19, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-23 + 0.7, 0 + 0.3, -19, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Ship Mast
  cyl(-7, 0, -23, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-7, 0 + 3.5, -23 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-7, 0 + 2.0, -23 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Treasure Chest
  box(-47, 0, -15, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-47, 0 + 0.8, -15, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-47, 0 + 0.5, -15 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(-31 - 0.5, 0, -31, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-31 + 0.5, 0, -31, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-31, 0 + 0.9, -31, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(-35, 0, -35, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-35, 0 + 0.8, -35, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-35, 0 + 0.5, -35 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Ship Mast
  cyl(-35, 0, -43, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-35, 0 + 3.5, -43 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-35, 0 + 2.0, -43 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Iron Cannon
  box(-47, 0, -19, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-47, 0 + 0.8, -19 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-47 - 0.7, 0 + 0.3, -19, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-47 + 0.7, 0 + 0.3, -19, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(-31 - 0.5, 0, -23, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-31 + 0.5, 0, -23, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-31, 0 + 0.9, -23, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Barrel Stack
  cyl(-3 - 0.5, 4.5, -7, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-3 + 0.5, 4.5, -7, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-3, 4.5 + 0.9, -7, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(-39, 0, -31, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-39, 0 + 0.8, -31, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-39, 0 + 0.5, -31 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Iron Cannon
  box(-43, 0, -43, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-43, 0 + 0.8, -43 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-43 - 0.7, 0 + 0.3, -43, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-43 + 0.7, 0 + 0.3, -43, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Treasure Chest
  box(-7, 0, -31, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-7, 0 + 0.8, -31, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-7, 0 + 0.5, -31 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Iron Cannon
  box(-7, 0, -43, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-7, 0 + 0.8, -43 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-7 - 0.7, 0 + 0.3, -43, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-7 + 0.7, 0 + 0.3, -43, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Ship Mast
  cyl(-39, 0, -15, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-39, 0 + 3.5, -15 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-39, 0 + 2.0, -15 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Barrel Stack
  cyl(-31 - 0.5, 0, -19, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-31 + 0.5, 0, -19, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-31, 0 + 0.9, -19, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Ship Mast
  cyl(-27, 0, -3, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-27, 0 + 3.5, -3 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-27, 0 + 2.0, -3 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Mooring Bollard
  cyl(-7, 0, -47, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-7, 0 + 1.0, -47, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Iron Cannon
  box(-43, 0, -47, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-43, 0 + 0.8, -47 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-43 - 0.7, 0 + 0.3, -47, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-43 + 0.7, 0 + 0.3, -47, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Treasure Chest
  box(-3, 0, -39, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-3, 0 + 0.8, -39, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-3, 0 + 0.5, -39 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(-15 - 0.5, 0, -11, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-15 + 0.5, 0, -11, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-15, 0 + 0.9, -11, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(-31, 0, -43, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-31, 0 + 0.8, -43 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-31 - 0.7, 0 + 0.3, -43, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-31 + 0.7, 0 + 0.3, -43, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Iron Cannon
  box(-23, 0, -23, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-23, 0 + 0.8, -23 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-23 - 0.7, 0 + 0.3, -23, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-23 + 0.7, 0 + 0.3, -23, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Iron Cannon
  box(-43, 0, -15, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-43, 0 + 0.8, -15 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-43 - 0.7, 0 + 0.3, -15, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-43 + 0.7, 0 + 0.3, -15, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Treasure Chest
  box(-35, 0, -47, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-35, 0 + 0.8, -47, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-35, 0 + 0.5, -47 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Mooring Bollard
  cyl(-11, 4.5, -11, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-11, 4.5 + 1.0, -11, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Ship Mast
  cyl(-39, 0, -47, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-39, 0 + 3.5, -47 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-39, 0 + 2.0, -47 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(-27, 0, -35, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-27, 0 + 3.5, -35 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-27, 0 + 2.0, -35 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(-39, 0, -19, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-39, 0 + 3.5, -19 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-39, 0 + 2.0, -19 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(-23, 0, -7, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-23, 0 + 3.5, -7 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-23, 0 + 2.0, -7 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(-3, 0, -23, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-3 - 0.8, 0 + 0.4, -23, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-3 + 0.8, 0 + 0.4, -23, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-3, 0 + 0.4, -23 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-3, 0 + 0.4, -23 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-3, 0 + 0.6, -23, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Barrel Stack
  cyl(-7 - 0.5, 0, -19, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-7 + 0.5, 0, -19, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-7, 0 + 0.9, -19, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(-27, 0, -7, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-27, 0 + 0.8, -7 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-27 - 0.7, 0 + 0.3, -7, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-27 + 0.7, 0 + 0.3, -7, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(-23 - 0.5, 0, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-23 + 0.5, 0, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-23, 0 + 0.9, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(-35, 0, -19, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-35, 0 + 0.8, -19, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-35, 0 + 0.5, -19 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Iron Cannon
  box(-35, 0, -39, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-35, 0 + 0.8, -39 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-35 - 0.7, 0 + 0.3, -39, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-35 + 0.7, 0 + 0.3, -39, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Rowboat
  box(-19, 0, -11, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-19 - 0.8, 0 + 0.4, -11, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-19 + 0.8, 0 + 0.4, -11, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-19, 0 + 0.4, -11 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-19, 0 + 0.4, -11 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-19, 0 + 0.6, -11, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Treasure Chest
  box(-31, 0, -3, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-31, 0 + 0.8, -3, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-31, 0 + 0.5, -3 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Treasure Chest
  box(-15, 0, -31, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-15, 0 + 0.8, -31, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-15, 0 + 0.5, -31 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Ship Mast
  cyl(-35, 0, -11, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-35, 0 + 3.5, -11 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-35, 0 + 2.0, -11 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Mooring Bollard
  cyl(-47, 0, -27, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-47, 0 + 1.0, -27, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(-27, 0, -19, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-27, 0 + 1.0, -19, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Treasure Chest
  box(-11, 0, -35, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-11, 0 + 0.8, -35, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-11, 0 + 0.5, -35 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Mooring Bollard
  cyl(-11, 4.5, -3, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-11, 4.5 + 1.0, -3, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Ship Mast
  cyl(-35, 0, -15, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-35, 0 + 3.5, -15 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-35, 0 + 2.0, -15 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(-19, 0, -47, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-19 - 0.8, 0 + 0.4, -47, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-19 + 0.8, 0 + 0.4, -47, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-19, 0 + 0.4, -47 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-19, 0 + 0.4, -47 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-19, 0 + 0.6, -47, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(-47, 0, -35, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-47, 0 + 3.5, -35 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-47, 0 + 2.0, -35 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Treasure Chest
  box(-7, 0, -15, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-7, 0 + 0.8, -15, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-7, 0 + 0.5, -15 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(-43 - 0.5, 0, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-43 + 0.5, 0, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-43, 0 + 0.9, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(-27, 0, -23, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-27, 0 + 0.8, -23 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-27 - 0.7, 0 + 0.3, -23, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-27 + 0.7, 0 + 0.3, -23, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Iron Cannon
  box(-23, 0, -35, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-23, 0 + 0.8, -35 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-23 - 0.7, 0 + 0.3, -35, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-23 + 0.7, 0 + 0.3, -35, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Ship Mast
  cyl(-15, 0, -35, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-15, 0 + 3.5, -35 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-15, 0 + 2.0, -35 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Barrel Stack
  cyl(-35 - 0.5, 0, -3, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-35 + 0.5, 0, -3, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-35, 0 + 0.9, -3, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(-3, 4.5, -3, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-3, 4.5 + 0.8, -3, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-3, 4.5 + 0.5, -3 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Iron Cannon
  box(-19, 0, -3, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-19, 0 + 0.8, -3 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-19 - 0.7, 0 + 0.3, -3, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-19 + 0.7, 0 + 0.3, -3, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Ship Mast
  cyl(-47, 0, -43, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-47, 0 + 3.5, -43 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-47, 0 + 2.0, -43 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Iron Cannon
  box(-19, 0, -7, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-19, 0 + 0.8, -7 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-19 - 0.7, 0 + 0.3, -7, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-19 + 0.7, 0 + 0.3, -7, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Iron Cannon
  box(-3, 0, -47, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-3, 0 + 0.8, -47 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-3 - 0.7, 0 + 0.3, -47, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-3 + 0.7, 0 + 0.3, -47, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Ship Mast
  cyl(-27, 0, -27, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-27, 0 + 3.5, -27 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-27, 0 + 2.0, -27 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Barrel Stack
  cyl(-15 - 0.5, 0, -47, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-15 + 0.5, 0, -47, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-15, 0 + 0.9, -47, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Barrel Stack
  cyl(-31 - 0.5, 0, -39, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-31 + 0.5, 0, -39, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-31, 0 + 0.9, -39, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Mooring Bollard
  cyl(-23, 4.5, -43, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-23, 4.5 + 1.0, -43, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Ship Mast
  cyl(-11, 4.5, -7, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-11, 4.5 + 3.5, -7 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-11, 4.5 + 2.0, -7 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Treasure Chest
  box(-19, 0, -23, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-19, 0 + 0.8, -23, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-19, 0 + 0.5, -23 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(-11 - 0.5, 0, -15, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-11 + 0.5, 0, -15, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-11, 0 + 0.9, -15, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Ship Mast
  cyl(-19, 0, -27, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-19, 0 + 3.5, -27 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-19, 0 + 2.0, -27 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Iron Cannon
  box(-47, 0, -47, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-47, 0 + 0.8, -47 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-47 - 0.7, 0 + 0.3, -47, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-47 + 0.7, 0 + 0.3, -47, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(-43 - 0.5, 0, -31, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-43 + 0.5, 0, -31, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-43, 0 + 0.9, -31, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(-39, 0, -35, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-39, 0 + 0.8, -35 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-39 - 0.7, 0 + 0.3, -35, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-39 + 0.7, 0 + 0.3, -35, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Iron Cannon
  box(-7, 0, -35, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-7, 0 + 0.8, -35 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-7 - 0.7, 0 + 0.3, -35, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-7 + 0.7, 0 + 0.3, -35, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Iron Cannon
  box(-31, 0, -27, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-31, 0 + 0.8, -27 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-31 - 0.7, 0 + 0.3, -27, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-31 + 0.7, 0 + 0.3, -27, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(-31 - 0.5, 0, -47, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-31 + 0.5, 0, -47, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-31, 0 + 0.9, -47, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Mooring Bollard
  cyl(-19, 0, -35, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-19, 0 + 1.0, -35, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Ship Mast
  cyl(-39, 0, -23, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-39, 0 + 3.5, -23 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-39, 0 + 2.0, -23 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Barrel Stack
  cyl(-31 - 0.5, 0, -35, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-31 + 0.5, 0, -35, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-31, 0 + 0.9, -35, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Rowboat
  box(-27, 0, -31, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-27 - 0.8, 0 + 0.4, -31, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-27 + 0.8, 0 + 0.4, -31, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-27, 0 + 0.4, -31 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-27, 0 + 0.4, -31 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-27, 0 + 0.6, -31, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Treasure Chest
  box(-43, 0, -23, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-43, 0 + 0.8, -23, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-43, 0 + 0.5, -23 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Rowboat
  box(5, 0, -19, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(5 - 0.8, 0 + 0.4, -19, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(5 + 0.8, 0 + 0.4, -19, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(5, 0 + 0.4, -19 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(5, 0 + 0.4, -19 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(5, 0 + 0.6, -19, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Rowboat
  box(49, 0, -31, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(49 - 0.8, 0 + 0.4, -31, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(49 + 0.8, 0 + 0.4, -31, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(49, 0 + 0.4, -31 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(49, 0 + 0.4, -31 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(49, 0 + 0.6, -31, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Rowboat
  box(5, 4.5, -3, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(5 - 0.8, 4.5 + 0.4, -3, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(5 + 0.8, 4.5 + 0.4, -3, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(5, 4.5 + 0.4, -3 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(5, 4.5 + 0.4, -3 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(5, 4.5 + 0.6, -3, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Barrel Stack
  cyl(45 - 0.5, 0, -7, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(45 + 0.5, 0, -7, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(45, 0 + 0.9, -7, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Mooring Bollard
  cyl(45, 0, -23, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(45, 0 + 1.0, -23, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(45, 0, -39, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(45, 0 + 1.0, -39, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Iron Cannon
  box(45, 0, -43, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(45, 0 + 0.8, -43 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(45 - 0.7, 0 + 0.3, -43, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(45 + 0.7, 0 + 0.3, -43, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Rowboat
  box(9, 4.5, -11, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(9 - 0.8, 4.5 + 0.4, -11, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(9 + 0.8, 4.5 + 0.4, -11, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(9, 4.5 + 0.4, -11 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(9, 4.5 + 0.4, -11 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(9, 4.5 + 0.6, -11, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Treasure Chest
  box(45, 0, -27, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(45, 0 + 0.8, -27, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(45, 0 + 0.5, -27 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(49 - 0.5, 0, -7, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(49 + 0.5, 0, -7, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(49, 0 + 0.9, -7, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Barrel Stack
  cyl(41 - 0.5, 0, -3, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(41 + 0.5, 0, -3, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(41, 0 + 0.9, -3, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Rowboat
  box(1, 4.5, -3, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(1 - 0.8, 4.5 + 0.4, -3, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(1 + 0.8, 4.5 + 0.4, -3, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(1, 4.5 + 0.4, -3 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(1, 4.5 + 0.4, -3 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(1, 4.5 + 0.6, -3, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Treasure Chest
  box(37, 0, -3, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(37, 0 + 0.8, -3, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(37, 0 + 0.5, -3 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Mooring Bollard
  cyl(49, 0, -23, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(49, 0 + 1.0, -23, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Ship Mast
  cyl(33, 0, -23, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(33, 0 + 3.5, -23 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(33, 0 + 2.0, -23 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(29, 0, -35, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(29, 0 + 3.5, -35 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(29, 0 + 2.0, -35 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Mooring Bollard
  cyl(33, 0, -19, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(33, 0 + 1.0, -19, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Barrel Stack
  cyl(33 - 0.5, 0, -11, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(33 + 0.5, 0, -11, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(33, 0 + 0.9, -11, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Ship Mast
  cyl(45, 0, -31, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(45, 0 + 3.5, -31 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(45, 0 + 2.0, -31 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Barrel Stack
  cyl(29 - 0.5, 0, -47, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(29 + 0.5, 0, -47, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(29, 0 + 0.9, -47, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Rowboat
  box(49, 0, -15, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(49 - 0.8, 0 + 0.4, -15, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(49 + 0.8, 0 + 0.4, -15, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(49, 0 + 0.4, -15 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(49, 0 + 0.4, -15 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(49, 0 + 0.6, -15, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(41, 0, -23, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(41, 0 + 3.5, -23 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(41, 0 + 2.0, -23 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(45, 0, -35, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(45, 0 + 3.5, -35 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(45, 0 + 2.0, -35 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(41, 0, -39, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(41, 0 + 3.5, -39 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(41, 0 + 2.0, -39 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Iron Cannon
  box(41, 0, -19, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(41, 0 + 0.8, -19 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(41 - 0.7, 0 + 0.3, -19, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(41 + 0.7, 0 + 0.3, -19, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Mooring Bollard
  cyl(17, 0, -15, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(17, 0 + 1.0, -15, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Rowboat
  box(21, 0, -7, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(21 - 0.8, 0 + 0.4, -7, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(21 + 0.8, 0 + 0.4, -7, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(21, 0 + 0.4, -7 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(21, 0 + 0.4, -7 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(21, 0 + 0.6, -7, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Treasure Chest
  box(5, 4.5, -7, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(5, 4.5 + 0.8, -7, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(5, 4.5 + 0.5, -7 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Treasure Chest
  box(49, 0, -35, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(49, 0 + 0.8, -35, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(49, 0 + 0.5, -35 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(25 - 0.5, 0, -35, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(25 + 0.5, 0, -35, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(25, 0 + 0.9, -35, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(25, 0, -31, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(25, 0 + 0.8, -31 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(25 - 0.7, 0 + 0.3, -31, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(25 + 0.7, 0 + 0.3, -31, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(9 - 0.5, 4.5, -7, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(9 + 0.5, 4.5, -7, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(9, 4.5 + 0.9, -7, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Ship Mast
  cyl(9, 0, -27, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(9, 0 + 3.5, -27 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(9, 0 + 2.0, -27 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(25, 0, -7, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(25 - 0.8, 0 + 0.4, -7, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(25 + 0.8, 0 + 0.4, -7, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(25, 0 + 0.4, -7 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(25, 0 + 0.4, -7 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(25, 0 + 0.6, -7, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(17, 0, -43, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(17, 0 + 3.5, -43 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(17, 0 + 2.0, -43 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(29, 0, -43, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(29, 0 + 3.5, -43 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(29, 0 + 2.0, -43 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(21, 0, -31, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(21 - 0.8, 0 + 0.4, -31, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(21 + 0.8, 0 + 0.4, -31, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(21, 0 + 0.4, -31 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(21, 0 + 0.4, -31 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(21, 0 + 0.6, -31, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(29, 0, -31, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(29, 0 + 3.5, -31 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(29, 0 + 2.0, -31 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(49, 0, -11, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(49, 0 + 3.5, -11 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(49, 0 + 2.0, -11 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Treasure Chest
  box(17, 0, -35, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(17, 0 + 0.8, -35, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(17, 0 + 0.5, -35 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Mooring Bollard
  cyl(1, 0, -43, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(1, 0 + 1.0, -43, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Ship Mast
  cyl(41, 0, -35, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(41, 0 + 3.5, -35 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(41, 0 + 2.0, -35 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(5, 0, -43, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(5 - 0.8, 0 + 0.4, -43, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(5 + 0.8, 0 + 0.4, -43, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(5, 0 + 0.4, -43 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(5, 0 + 0.4, -43 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(5, 0 + 0.6, -43, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(29, 0, -7, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(29, 0 + 3.5, -7 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(29, 0 + 2.0, -7 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(25, 0, -23, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(25 - 0.8, 0 + 0.4, -23, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(25 + 0.8, 0 + 0.4, -23, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(25, 0 + 0.4, -23 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(25, 0 + 0.4, -23 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(25, 0 + 0.6, -23, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Mooring Bollard
  cyl(37, 0, -31, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(37, 0 + 1.0, -31, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(5, 0, -15, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(5, 0 + 1.0, -15, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Treasure Chest
  box(25, 0, -19, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(25, 0 + 0.8, -19, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(25, 0 + 0.5, -19 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Mooring Bollard
  cyl(21, 0, -3, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(21, 0 + 1.0, -3, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Iron Cannon
  box(21, 0, -27, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(21, 0 + 0.8, -27 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(21 - 0.7, 0 + 0.3, -27, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(21 + 0.7, 0 + 0.3, -27, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Treasure Chest
  box(37, 0, -23, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(37, 0 + 0.8, -23, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(37, 0 + 0.5, -23 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Ship Mast
  cyl(13, 0, -43, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(13, 0 + 3.5, -43 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(13, 0 + 2.0, -43 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Barrel Stack
  cyl(21 - 0.5, 0, -47, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(21 + 0.5, 0, -47, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(21, 0 + 0.9, -47, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Barrel Stack
  cyl(5 - 0.5, 4.5, -11, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(5 + 0.5, 4.5, -11, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(5, 4.5 + 0.9, -11, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Mooring Bollard
  cyl(9, 0, -31, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(9, 0 + 1.0, -31, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Ship Mast
  cyl(17, 0, -7, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(17, 0 + 3.5, -7 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(17, 0 + 2.0, -7 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(9, 0, -15, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(9, 0 + 3.5, -15 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(9, 0 + 2.0, -15 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(5, 0, -23, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(5, 0 + 3.5, -23 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(5, 0 + 2.0, -23 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(1, 0, -39, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(1, 0 + 3.5, -39 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(1, 0 + 2.0, -39 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(9, 0, -39, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(9 - 0.8, 0 + 0.4, -39, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(9 + 0.8, 0 + 0.4, -39, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(9, 0 + 0.4, -39 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(9, 0 + 0.4, -39 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(9, 0 + 0.6, -39, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(13, 0, -15, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(13, 0 + 3.5, -15 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(13, 0 + 2.0, -15 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(25, 0, -39, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(25, 0 + 3.5, -39 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(25, 0 + 2.0, -39 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(1, 0, -23, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(1 - 0.8, 0 + 0.4, -23, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(1 + 0.8, 0 + 0.4, -23, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(1, 0 + 0.4, -23 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(1, 0 + 0.4, -23 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(1, 0 + 0.6, -23, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Treasure Chest
  box(17, 0, -11, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(17, 0 + 0.8, -11, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(17, 0 + 0.5, -11 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Ship Mast
  cyl(33, 0, -31, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(33, 0 + 3.5, -31 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(33, 0 + 2.0, -31 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Mooring Bollard
  cyl(13, 0, -19, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(13, 0 + 1.0, -19, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(29, 0, -11, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(29, 0 + 1.0, -11, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(9, 0, -47, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(9, 0 + 1.0, -47, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Iron Cannon
  box(5, 0, -35, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(5, 0 + 0.8, -35 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(5 - 0.7, 0 + 0.3, -35, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(5 + 0.7, 0 + 0.3, -35, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Iron Cannon
  box(41, 0, -11, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(41, 0 + 0.8, -11 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(41 - 0.7, 0 + 0.3, -11, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(41 + 0.7, 0 + 0.3, -11, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Treasure Chest
  box(5, 0, -31, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(5, 0 + 0.8, -31, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(5, 0 + 0.5, -31 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Treasure Chest
  box(45, 0, -3, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(45, 0 + 0.8, -3, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(45, 0 + 0.5, -3 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Mooring Bollard
  cyl(5, 0, -39, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(5, 0 + 1.0, -39, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Ship Mast
  cyl(33, 0, -39, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(33, 0 + 3.5, -39 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(33, 0 + 2.0, -39 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Mooring Bollard
  cyl(13, 0, -23, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(13, 0 + 1.0, -23, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(41, 0, -15, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(41, 0 + 1.0, -15, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(13, 0, -39, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(13, 0 + 1.0, -39, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Treasure Chest
  box(17, 0, -3, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(17, 0 + 0.8, -3, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(17, 0 + 0.5, -3 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Rowboat
  box(37, 0, -19, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(37 - 0.8, 0 + 0.4, -19, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(37 + 0.8, 0 + 0.4, -19, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(37, 0 + 0.4, -19 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(37, 0 + 0.4, -19 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(37, 0 + 0.6, -19, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Treasure Chest
  box(21, 0, -35, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(21, 0 + 0.8, -35, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(21, 0 + 0.5, -35 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Mooring Bollard
  cyl(25, 0, -47, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(25, 0 + 1.0, -47, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Ship Mast
  cyl(21, 0, -11, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(21, 0 + 3.5, -11 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(21, 0 + 2.0, -11 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(49, 0, -19, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(49 - 0.8, 0 + 0.4, -19, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(49 + 0.8, 0 + 0.4, -19, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(49, 0 + 0.4, -19 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(49, 0 + 0.4, -19 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(49, 0 + 0.6, -19, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(9, 4.5, -3, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(9, 4.5 + 3.5, -3 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(9, 4.5 + 2.0, -3 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(9, 0, -43, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(9, 0 + 3.5, -43 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(9, 0 + 2.0, -43 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Mooring Bollard
  cyl(9, 0, -35, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(9, 0 + 1.0, -35, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Iron Cannon
  box(1, 0, -31, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(1, 0 + 0.8, -31 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(1 - 0.7, 0 + 0.3, -31, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(1 + 0.7, 0 + 0.3, -31, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Rowboat
  box(1, 4.5, -7, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(1 - 0.8, 4.5 + 0.4, -7, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(1 + 0.8, 4.5 + 0.4, -7, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(1, 4.5 + 0.4, -7 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(1, 4.5 + 0.4, -7 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(1, 4.5 + 0.6, -7, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(41, 0, -27, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(41, 0 + 3.5, -27 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(41, 0 + 2.0, -27 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Barrel Stack
  cyl(21 - 0.5, 0, -23, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(21 + 0.5, 0, -23, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(21, 0 + 0.9, -23, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Barrel Stack
  cyl(13 - 0.5, 0, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(13 + 0.5, 0, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(13, 0 + 0.9, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(37, 0, -47, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(37, 0 + 0.8, -47 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(37 - 0.7, 0 + 0.3, -47, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(37 + 0.7, 0 + 0.3, -47, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(49 - 0.5, 0, -39, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(49 + 0.5, 0, -39, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(49, 0 + 0.9, -39, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Mooring Bollard
  cyl(9, 0, -19, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(9, 0 + 1.0, -19, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Treasure Chest
  box(17, 0, -31, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(17, 0 + 0.8, -31, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(17, 0 + 0.5, -31 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(17 - 0.5, 0, -47, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(17 + 0.5, 0, -47, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(17, 0 + 0.9, -47, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(45, 0, -19, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(45, 0 + 0.8, -19 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(45 - 0.7, 0 + 0.3, -19, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(45 + 0.7, 0 + 0.3, -19, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Treasure Chest
  box(1, 0, -27, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(1, 0 + 0.8, -27, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(1, 0 + 0.5, -27 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Mooring Bollard
  cyl(25, 0, -15, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(25, 0 + 1.0, -15, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Iron Cannon
  box(49, 0, -43, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(49, 0 + 0.8, -43 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(49 - 0.7, 0 + 0.3, -43, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(49 + 0.7, 0 + 0.3, -43, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Mooring Bollard
  cyl(17, 0, -39, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(17, 0 + 1.0, -39, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Barrel Stack
  cyl(37 - 0.5, 0, -43, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(37 + 0.5, 0, -43, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(37, 0 + 0.9, -43, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(33, 0, -15, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(33, 0 + 0.8, -15, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(33, 0 + 0.5, -15 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(5 - 0.5, 0, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(5 + 0.5, 0, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(5, 0 + 0.9, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Ship Mast
  cyl(37, 0, -7, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(37, 0 + 3.5, -7 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(37, 0 + 2.0, -7 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Iron Cannon
  box(25, 0, -3, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(25, 0 + 0.8, -3 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(25 - 0.7, 0 + 0.3, -3, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(25 + 0.7, 0 + 0.3, -3, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Rowboat
  box(5, 0, -47, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(5 - 0.8, 0 + 0.4, -47, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(5 + 0.8, 0 + 0.4, -47, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(5, 0 + 0.4, -47 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(5, 0 + 0.4, -47 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(5, 0 + 0.6, -47, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Mooring Bollard
  cyl(37, 0, -35, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(37, 0 + 1.0, -35, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Treasure Chest
  box(33, 0, -27, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(33, 0 + 0.8, -27, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(33, 0 + 0.5, -27 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Ship Mast
  cyl(17, 0, -27, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(17, 0 + 3.5, -27 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(17, 0 + 2.0, -27 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Treasure Chest
  box(9, 0, -23, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(9, 0 + 0.8, -23, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(9, 0 + 0.5, -23 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Treasure Chest
  box(21, 0, -15, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(21, 0 + 0.8, -15, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(21, 0 + 0.5, -15 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Treasure Chest
  box(25, 0, -27, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(25, 0 + 0.8, -27, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(25, 0 + 0.5, -27 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(29 - 0.5, 0, -23, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(29 + 0.5, 0, -23, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(29, 0 + 0.9, -23, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(29, 0, -39, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(29, 0 + 0.8, -39, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(29, 0 + 0.5, -39 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Mooring Bollard
  cyl(21, 0, -19, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(21, 0 + 1.0, -19, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Treasure Chest
  box(25, 0, -11, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(25, 0 + 0.8, -11, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(25, 0 + 0.5, -11 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Mooring Bollard
  cyl(25, 0, -43, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(25, 0 + 1.0, -43, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Rowboat
  box(21, 0, -39, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(21 - 0.8, 0 + 0.4, -39, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(21 + 0.8, 0 + 0.4, -39, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(21, 0 + 0.4, -39 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(21, 0 + 0.4, -39 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(21, 0 + 0.6, -39, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Barrel Stack
  cyl(49 - 0.5, 0, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(49 + 0.5, 0, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(49, 0 + 0.9, -27, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Ship Mast
  cyl(17, 0, -19, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(17, 0 + 3.5, -19 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(17, 0 + 2.0, -19 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(49, 0, -47, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(49 - 0.8, 0 + 0.4, -47, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(49 + 0.8, 0 + 0.4, -47, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(49, 0 + 0.4, -47 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(49, 0 + 0.4, -47 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(49, 0 + 0.6, -47, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Treasure Chest
  box(17, 0, -23, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(17, 0 + 0.8, -23, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(17, 0 + 0.5, -23 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(37 - 0.5, 0, -11, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(37 + 0.5, 0, -11, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(37, 0 + 0.9, -11, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(45, 0, -47, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(45, 0 + 0.8, -47 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(45 - 0.7, 0 + 0.3, -47, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(45 + 0.7, 0 + 0.3, -47, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Iron Cannon
  box(33, 0, -3, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(33, 0 + 0.8, -3 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(33 - 0.7, 0 + 0.3, -3, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(33 + 0.7, 0 + 0.3, -3, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Mooring Bollard
  cyl(21, 0, -43, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(21, 0 + 1.0, -43, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Treasure Chest
  box(13, 0, -47, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(13, 0 + 0.8, -47, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(13, 0 + 0.5, -47 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Treasure Chest
  box(41, 0, -43, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(41, 0 + 0.8, -43, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(41, 0 + 0.5, -43 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(-3 - 0.5, 0, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-3 + 0.5, 0, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-3, 0 + 0.9, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(-19, 0, 9, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-19, 0 + 0.8, 9 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-19 - 0.7, 0 + 0.3, 9, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-19 + 0.7, 0 + 0.3, 9, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(-47 - 0.5, 0, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-47 + 0.5, 0, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-47, 0 + 0.9, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Mooring Bollard
  cyl(-19, 0, 45, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-19, 0 + 1.0, 45, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Rowboat
  box(-3, 0, 37, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-3 - 0.8, 0 + 0.4, 37, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-3 + 0.8, 0 + 0.4, 37, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-3, 0 + 0.4, 37 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-3, 0 + 0.4, 37 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-3, 0 + 0.6, 37, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Rowboat
  box(-47, 0, 21, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-47 - 0.8, 0 + 0.4, 21, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-47 + 0.8, 0 + 0.4, 21, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-47, 0 + 0.4, 21 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-47, 0 + 0.4, 21 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-47, 0 + 0.6, 21, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Barrel Stack
  cyl(-35 - 0.5, 0, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-35 + 0.5, 0, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-35, 0 + 0.9, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Ship Mast
  cyl(-19, 0, 1, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-19, 0 + 3.5, 1 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-19, 0 + 2.0, 1 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Iron Cannon
  box(-7, 4.5, 5, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-7, 4.5 + 0.8, 5 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-7 - 0.7, 4.5 + 0.3, 5, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-7 + 0.7, 4.5 + 0.3, 5, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Treasure Chest
  box(-43, 0, 21, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-43, 0 + 0.8, 21, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-43, 0 + 0.5, 21 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Rowboat
  box(-43, 0, 9, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-43 - 0.8, 0 + 0.4, 9, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-43 + 0.8, 0 + 0.4, 9, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-43, 0 + 0.4, 9 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-43, 0 + 0.4, 9 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-43, 0 + 0.6, 9, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Barrel Stack
  cyl(-27 - 0.5, 0, 29, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-27 + 0.5, 0, 29, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-27, 0 + 0.9, 29, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Rowboat
  box(-23, 0, 49, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-23 - 0.8, 0 + 0.4, 49, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-23 + 0.8, 0 + 0.4, 49, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-23, 0 + 0.4, 49 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-23, 0 + 0.4, 49 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-23, 0 + 0.6, 49, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Treasure Chest
  box(-27, 0, 25, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-27, 0 + 0.8, 25, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-27, 0 + 0.5, 25 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(-19 - 0.5, 0, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-19 + 0.5, 0, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-19, 0 + 0.9, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Barrel Stack
  cyl(-7 - 0.5, 4.5, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-7 + 0.5, 4.5, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-7, 4.5 + 0.9, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Rowboat
  box(-31, 0, 41, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-31 - 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-31 + 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-31, 0 + 0.4, 41 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-31, 0 + 0.4, 41 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-31, 0 + 0.6, 41, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Mooring Bollard
  cyl(-7, 0, 21, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-7, 0 + 1.0, 21, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(-15, 0, 17, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-15, 0 + 1.0, 17, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Iron Cannon
  box(-15, 0, 41, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-15, 0 + 0.8, 41 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-15 - 0.7, 0 + 0.3, 41, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-15 + 0.7, 0 + 0.3, 41, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Rowboat
  box(-39, 0, 49, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-39 - 0.8, 0 + 0.4, 49, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-39 + 0.8, 0 + 0.4, 49, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-39, 0 + 0.4, 49 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-39, 0 + 0.4, 49 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-39, 0 + 0.6, 49, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(-35, 0, 17, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-35, 0 + 3.5, 17 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-35, 0 + 2.0, 17 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(-7, 0, 29, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-7, 0 + 3.5, 29 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-7, 0 + 2.0, 29 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Treasure Chest
  box(-15, 0, 45, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-15, 0 + 0.8, 45, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-15, 0 + 0.5, 45 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Ship Mast
  cyl(-3, 0, 45, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-3, 0 + 3.5, 45 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-3, 0 + 2.0, 45 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(-23, 0, 25, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-23, 0 + 3.5, 25 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-23, 0 + 2.0, 25 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Treasure Chest
  box(-43, 0, 25, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-43, 0 + 0.8, 25, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-43, 0 + 0.5, 25 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Iron Cannon
  box(-47, 0, 41, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-47, 0 + 0.8, 41 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-47 - 0.7, 0 + 0.3, 41, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-47 + 0.7, 0 + 0.3, 41, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(-31 - 0.5, 0, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-31 + 0.5, 0, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-31, 0 + 0.9, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(-3, 4.5, 5, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-3, 4.5 + 0.8, 5 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-3 - 0.7, 4.5 + 0.3, 5, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-3 + 0.7, 4.5 + 0.3, 5, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(-23 - 0.5, 0, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-23 + 0.5, 0, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-23, 0 + 0.9, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Barrel Stack
  cyl(-31 - 0.5, 0, 13, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-31 + 0.5, 0, 13, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-31, 0 + 0.9, 13, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Mooring Bollard
  cyl(-11, 0, 41, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-11, 0 + 1.0, 41, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Barrel Stack
  cyl(-23 - 0.5, 0, 13, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-23 + 0.5, 0, 13, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-23, 0 + 0.9, 13, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Mooring Bollard
  cyl(-15, 0, 9, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-15, 0 + 1.0, 9, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Rowboat
  box(-39, 0, 25, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-39 - 0.8, 0 + 0.4, 25, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-39 + 0.8, 0 + 0.4, 25, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-39, 0 + 0.4, 25 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-39, 0 + 0.4, 25 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-39, 0 + 0.6, 25, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Treasure Chest
  box(-7, 0, 17, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-7, 0 + 0.8, 17, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-7, 0 + 0.5, 17 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Iron Cannon
  box(-15, 0, 13, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-15, 0 + 0.8, 13 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-15 - 0.7, 0 + 0.3, 13, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-15 + 0.7, 0 + 0.3, 13, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Treasure Chest
  box(-3, 0, 25, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-3, 0 + 0.8, 25, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-3, 0 + 0.5, 25 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Ship Mast
  cyl(-43, 0, 45, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-43, 0 + 3.5, 45 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-43, 0 + 2.0, 45 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(-11, 0, 29, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-11 - 0.8, 0 + 0.4, 29, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-11 + 0.8, 0 + 0.4, 29, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-11, 0 + 0.4, 29 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-11, 0 + 0.4, 29 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-11, 0 + 0.6, 29, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(-39, 0, 1, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-39, 0 + 3.5, 1 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-39, 0 + 2.0, 1 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(-31, 0, 29, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-31 - 0.8, 0 + 0.4, 29, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-31 + 0.8, 0 + 0.4, 29, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-31, 0 + 0.4, 29 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-31, 0 + 0.4, 29 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-31, 0 + 0.6, 29, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Barrel Stack
  cyl(-23 - 0.5, 0, 37, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-23 + 0.5, 0, 37, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-23, 0 + 0.9, 37, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Barrel Stack
  cyl(-39 - 0.5, 0, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-39 + 0.5, 0, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-39, 0 + 0.9, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(-11, 0, 45, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-11, 0 + 0.8, 45 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-11 - 0.7, 0 + 0.3, 45, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-11 + 0.7, 0 + 0.3, 45, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Iron Cannon
  box(-23, 0, 41, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-23, 0 + 0.8, 41 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-23 - 0.7, 0 + 0.3, 41, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-23 + 0.7, 0 + 0.3, 41, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Mooring Bollard
  cyl(-47, 0, 13, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-47, 0 + 1.0, 13, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Rowboat
  box(-11, 4.5, 5, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-11 - 0.8, 4.5 + 0.4, 5, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-11 + 0.8, 4.5 + 0.4, 5, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-11, 4.5 + 0.4, 5 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-11, 4.5 + 0.4, 5 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-11, 4.5 + 0.6, 5, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(-27, 0, 13, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-27, 0 + 3.5, 13 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-27, 0 + 2.0, 13 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(-39, 0, 17, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-39 - 0.8, 0 + 0.4, 17, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-39 + 0.8, 0 + 0.4, 17, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-39, 0 + 0.4, 17 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-39, 0 + 0.4, 17 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-39, 0 + 0.6, 17, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Iron Cannon
  box(-11, 0, 25, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-11, 0 + 0.8, 25 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-11 - 0.7, 0 + 0.3, 25, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-11 + 0.7, 0 + 0.3, 25, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Rowboat
  box(-3, 0, 29, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-3 - 0.8, 0 + 0.4, 29, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-3 + 0.8, 0 + 0.4, 29, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-3, 0 + 0.4, 29 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-3, 0 + 0.4, 29 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-3, 0 + 0.6, 29, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Treasure Chest
  box(-11, 0, 33, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-11, 0 + 0.8, 33, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-11, 0 + 0.5, 33 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Iron Cannon
  box(-11, 0, 21, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-11, 0 + 0.8, 21 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-11 - 0.7, 0 + 0.3, 21, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-11 + 0.7, 0 + 0.3, 21, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Mooring Bollard
  cyl(-43, 0, 17, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-43, 0 + 1.0, 17, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Rowboat
  box(-43, 0, 41, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-43 - 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-43 + 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-43, 0 + 0.4, 41 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-43, 0 + 0.4, 41 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-43, 0 + 0.6, 41, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Treasure Chest
  box(-47, 0, 45, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-47, 0 + 0.8, 45, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-47, 0 + 0.5, 45 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Mooring Bollard
  cyl(-15, 0, 49, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-15, 0 + 1.0, 49, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Ship Mast
  cyl(-15, 0, 1, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-15, 0 + 3.5, 1 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-15, 0 + 2.0, 1 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(-23, 0, 21, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-23, 0 + 3.5, 21 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-23, 0 + 2.0, 21 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Treasure Chest
  box(-7, 0, 33, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-7, 0 + 0.8, 33, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-7, 0 + 0.5, 33 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Mooring Bollard
  cyl(-35, 0, 49, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-35, 0 + 1.0, 49, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Rowboat
  box(-19, 0, 49, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-19 - 0.8, 0 + 0.4, 49, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-19 + 0.8, 0 + 0.4, 49, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-19, 0 + 0.4, 49 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-19, 0 + 0.4, 49 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-19, 0 + 0.6, 49, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Rowboat
  box(-31, 0, 49, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-31 - 0.8, 0 + 0.4, 49, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-31 + 0.8, 0 + 0.4, 49, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-31, 0 + 0.4, 49 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-31, 0 + 0.4, 49 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-31, 0 + 0.6, 49, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Iron Cannon
  box(-43, 0, 29, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-43, 0 + 0.8, 29 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-43 - 0.7, 0 + 0.3, 29, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-43 + 0.7, 0 + 0.3, 29, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Treasure Chest
  box(-11, 4.5, 1, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-11, 4.5 + 0.8, 1, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-11, 4.5 + 0.5, 1 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(-43 - 0.5, 0, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-43 + 0.5, 0, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-43, 0 + 0.9, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Mooring Bollard
  cyl(-19, 0, 25, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-19, 0 + 1.0, 25, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Rowboat
  box(-19, 0, 29, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-19 - 0.8, 0 + 0.4, 29, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-19 + 0.8, 0 + 0.4, 29, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-19, 0 + 0.4, 29 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-19, 0 + 0.4, 29 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-19, 0 + 0.6, 29, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Mooring Bollard
  cyl(-47, 0, 29, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-47, 0 + 1.0, 29, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Rowboat
  box(-31, 0, 21, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-31 - 0.8, 0 + 0.4, 21, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-31 + 0.8, 0 + 0.4, 21, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-31, 0 + 0.4, 21 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-31, 0 + 0.4, 21 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-31, 0 + 0.6, 21, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Mooring Bollard
  cyl(-43, 0, 33, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-43, 0 + 1.0, 33, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Ship Mast
  cyl(-7, 0, 37, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-7, 0 + 3.5, 37 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-7, 0 + 2.0, 37 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Mooring Bollard
  cyl(-15, 0, 33, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-15, 0 + 1.0, 33, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Iron Cannon
  box(-35, 0, 29, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-35, 0 + 0.8, 29 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-35 - 0.7, 0 + 0.3, 29, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-35 + 0.7, 0 + 0.3, 29, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Iron Cannon
  box(-15, 0, 37, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-15, 0 + 0.8, 37 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-15 - 0.7, 0 + 0.3, 37, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-15 + 0.7, 0 + 0.3, 37, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Treasure Chest
  box(-11, 0, 17, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-11, 0 + 0.8, 17, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-11, 0 + 0.5, 17 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Mooring Bollard
  cyl(-39, 0, 5, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-39, 0 + 1.0, 5, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Barrel Stack
  cyl(-3 - 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-3 + 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-3, 0 + 0.9, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Ship Mast
  cyl(-39, 0, 41, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-39, 0 + 3.5, 41 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-39, 0 + 2.0, 41 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(-39, 0, 45, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-39 - 0.8, 0 + 0.4, 45, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-39 + 0.8, 0 + 0.4, 45, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-39, 0 + 0.4, 45 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-39, 0 + 0.4, 45 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-39, 0 + 0.6, 45, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Iron Cannon
  box(-19, 0, 33, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-19, 0 + 0.8, 33 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-19 - 0.7, 0 + 0.3, 33, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-19 + 0.7, 0 + 0.3, 33, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Iron Cannon
  box(-47, 0, 17, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-47, 0 + 0.8, 17 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-47 - 0.7, 0 + 0.3, 17, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-47 + 0.7, 0 + 0.3, 17, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Mooring Bollard
  cyl(-15, 0, 5, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-15, 0 + 1.0, 5, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Iron Cannon
  box(-19, 0, 21, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-19, 0 + 0.8, 21 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-19 - 0.7, 0 + 0.3, 21, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-19 + 0.7, 0 + 0.3, 21, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(-7 - 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-7 + 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-7, 0 + 0.9, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Rowboat
  box(-39, 0, 21, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-39 - 0.8, 0 + 0.4, 21, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-39 + 0.8, 0 + 0.4, 21, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-39, 0 + 0.4, 21 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-39, 0 + 0.4, 21 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-39, 0 + 0.6, 21, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(-7, 0, 41, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-7, 0 + 3.5, 41 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-7, 0 + 2.0, 41 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Iron Cannon
  box(-31, 0, 45, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-31, 0 + 0.8, 45 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-31 - 0.7, 0 + 0.3, 45, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-31 + 0.7, 0 + 0.3, 45, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Mooring Bollard
  cyl(-19, 0, 13, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-19, 0 + 1.0, 13, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Iron Cannon
  box(-7, 4.5, 9, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-7, 4.5 + 0.8, 9 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-7 - 0.7, 4.5 + 0.3, 9, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-7 + 0.7, 4.5 + 0.3, 9, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(-31 - 0.5, 0, 17, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-31 + 0.5, 0, 17, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-31, 0 + 0.9, 17, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Rowboat
  box(-3, 0, 41, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-3 - 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-3 + 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-3, 0 + 0.4, 41 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-3, 0 + 0.4, 41 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-3, 0 + 0.6, 41, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Barrel Stack
  cyl(-47 - 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-47 + 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-47, 0 + 0.9, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(-35, 0, 13, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-35, 0 + 0.8, 13 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-35 - 0.7, 0 + 0.3, 13, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-35 + 0.7, 0 + 0.3, 13, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Ship Mast
  cyl(-47, 0, 37, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-47, 0 + 3.5, 37 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-47, 0 + 2.0, 37 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Barrel Stack
  cyl(-3 - 0.5, 4.5, 9, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-3 + 0.5, 4.5, 9, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-3, 4.5 + 0.9, 9, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Ship Mast
  cyl(-27, 0, 17, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-27, 0 + 3.5, 17 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-27, 0 + 2.0, 17 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Barrel Stack
  cyl(-3 - 0.5, 4.5, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-3 + 0.5, 4.5, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-3, 4.5 + 0.9, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Barrel Stack
  cyl(-11 - 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-11 + 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-11, 0 + 0.9, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Barrel Stack
  cyl(-35 - 0.5, 0, 41, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-35 + 0.5, 0, 41, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-35, 0 + 0.9, 41, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(-19, 0, 37, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-19, 0 + 0.8, 37, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-19, 0 + 0.5, 37 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Ship Mast
  cyl(-23, 0, 45, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-23, 0 + 3.5, 45 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-23, 0 + 2.0, 45 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Treasure Chest
  box(-7, 0, 45, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-7, 0 + 0.8, 45, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-7, 0 + 0.5, 45 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Treasure Chest
  box(-31, 0, 33, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-31, 0 + 0.8, 33, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-31, 0 + 0.5, 33 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Ship Mast
  cyl(-35, 0, 21, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-35, 0 + 3.5, 21 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-35, 0 + 2.0, 21 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(-19, 0, 17, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-19 - 0.8, 0 + 0.4, 17, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-19 + 0.8, 0 + 0.4, 17, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-19, 0 + 0.4, 17 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-19, 0 + 0.4, 17 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-19, 0 + 0.6, 17, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Rowboat
  box(-27, 0, 21, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-27 - 0.8, 0 + 0.4, 21, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-27 + 0.8, 0 + 0.4, 21, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-27, 0 + 0.4, 21 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-27, 0 + 0.4, 21 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-27, 0 + 0.6, 21, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(-47, 0, 33, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-47, 0 + 3.5, 33 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-47, 0 + 2.0, 33 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(-27, 0, 45, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-27, 0 + 3.5, 45 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-27, 0 + 2.0, 45 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Treasure Chest
  box(-35, 0, 9, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(-35, 0 + 0.8, 9, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(-35, 0 + 0.5, 9 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Ship Mast
  cyl(-23, 0, 17, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(-23, 0 + 3.5, 17 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(-23, 0 + 2.0, 17 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(-31, 0, 9, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-31 - 0.8, 0 + 0.4, 9, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-31 + 0.8, 0 + 0.4, 9, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-31, 0 + 0.4, 9 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-31, 0 + 0.4, 9 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-31, 0 + 0.6, 9, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Rowboat
  box(-39, 0, 29, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(-39 - 0.8, 0 + 0.4, 29, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(-39 + 0.8, 0 + 0.4, 29, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(-39, 0 + 0.4, 29 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(-39, 0 + 0.4, 29 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(-39, 0 + 0.6, 29, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Barrel Stack
  cyl(-43 - 0.5, 0, 13, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(-43 + 0.5, 0, 13, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(-43, 0 + 0.9, 13, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(-27, 0, 49, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(-27, 0 + 0.8, 49 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(-27 - 0.7, 0 + 0.3, 49, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(-27 + 0.7, 0 + 0.3, 49, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Mooring Bollard
  cyl(-31, 0, 37, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-31, 0 + 1.0, 37, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Barrel Stack
  cyl(45 - 0.5, 0, 29, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(45 + 0.5, 0, 29, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(45, 0 + 0.9, 29, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Barrel Stack
  cyl(5 - 0.5, 0, 17, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(5 + 0.5, 0, 17, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(5, 0 + 0.9, 17, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Mooring Bollard
  cyl(17, 0, 17, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(17, 0 + 1.0, 17, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Barrel Stack
  cyl(33 - 0.5, 0, 17, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(33 + 0.5, 0, 17, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(33, 0 + 0.9, 17, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Rowboat
  box(33, 0, 13, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(33 - 0.8, 0 + 0.4, 13, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(33 + 0.8, 0 + 0.4, 13, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(33, 0 + 0.4, 13 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(33, 0 + 0.4, 13 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(33, 0 + 0.6, 13, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Barrel Stack
  cyl(33 - 0.5, 0, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(33 + 0.5, 0, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(33, 0 + 0.9, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Ship Mast
  cyl(37, 0, 29, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(37, 0 + 3.5, 29 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(37, 0 + 2.0, 29 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Iron Cannon
  box(41, 0, 13, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(41, 0 + 0.8, 13 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(41 - 0.7, 0 + 0.3, 13, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(41 + 0.7, 0 + 0.3, 13, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Iron Cannon
  box(37, 0, 25, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(37, 0 + 0.8, 25 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(37 - 0.7, 0 + 0.3, 25, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(37 + 0.7, 0 + 0.3, 25, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Rowboat
  box(37, 0, 41, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(37 - 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(37 + 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(37, 0 + 0.4, 41 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(37, 0 + 0.4, 41 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(37, 0 + 0.6, 41, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Mooring Bollard
  cyl(17, 0, 45, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(17, 0 + 1.0, 45, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(49, 0, 41, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(49, 0 + 1.0, 41, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Rowboat
  box(17, 0, 49, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(17 - 0.8, 0 + 0.4, 49, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(17 + 0.8, 0 + 0.4, 49, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(17, 0 + 0.4, 49 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(17, 0 + 0.4, 49 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(17, 0 + 0.6, 49, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Treasure Chest
  box(21, 0, 45, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(21, 0 + 0.8, 45, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(21, 0 + 0.5, 45 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Ship Mast
  cyl(17, 0, 1, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(17, 0 + 3.5, 1 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(17, 0 + 2.0, 1 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Barrel Stack
  cyl(49 - 0.5, 0, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(49 + 0.5, 0, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(49, 0 + 0.9, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Barrel Stack
  cyl(13 - 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(13 + 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(13, 0 + 0.9, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Mooring Bollard
  cyl(17, 0, 25, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(17, 0 + 1.0, 25, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(21, 0, 9, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(21, 0 + 1.0, 9, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Barrel Stack
  cyl(5 - 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(5 + 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(5, 0 + 0.9, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Mooring Bollard
  cyl(25, 0, 21, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(25, 0 + 1.0, 21, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Iron Cannon
  box(5, 4.5, 1, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(5, 4.5 + 0.8, 1 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(5 - 0.7, 4.5 + 0.3, 1, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(5 + 0.7, 4.5 + 0.3, 1, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Rowboat
  box(37, 0, 13, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(37 - 0.8, 0 + 0.4, 13, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(37 + 0.8, 0 + 0.4, 13, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(37, 0 + 0.4, 13 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(37, 0 + 0.4, 13 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(37, 0 + 0.6, 13, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(1, 0, 37, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(1, 0 + 3.5, 37 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(1, 0 + 2.0, 37 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Treasure Chest
  box(5, 4.5, 5, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(5, 4.5 + 0.8, 5, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(5, 4.5 + 0.5, 5 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Rowboat
  box(49, 0, 45, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(49 - 0.8, 0 + 0.4, 45, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(49 + 0.8, 0 + 0.4, 45, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(49, 0 + 0.4, 45 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(49, 0 + 0.4, 45 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(49, 0 + 0.6, 45, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Rowboat
  box(41, 0, 41, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(41 - 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(41 + 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(41, 0 + 0.4, 41 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(41, 0 + 0.4, 41 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(41, 0 + 0.6, 41, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Iron Cannon
  box(49, 0, 25, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(49, 0 + 0.8, 25 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(49 - 0.7, 0 + 0.3, 25, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(49 + 0.7, 0 + 0.3, 25, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Mooring Bollard
  cyl(1, 0, 29, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(1, 0 + 1.0, 29, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Rowboat
  box(1, 0, 41, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(1 - 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(1 + 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(1, 0 + 0.4, 41 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(1, 0 + 0.4, 41 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(1, 0 + 0.6, 41, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(37, 0, 33, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(37, 0 + 3.5, 33 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(37, 0 + 2.0, 33 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Barrel Stack
  cyl(21 - 0.5, 0, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(21 + 0.5, 0, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(21, 0 + 0.9, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Barrel Stack
  cyl(13 - 0.5, 0, 17, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(13 + 0.5, 0, 17, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(13, 0 + 0.9, 17, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Mooring Bollard
  cyl(5, 0, 21, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(5, 0 + 1.0, 21, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(37, 0, 9, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(37, 0 + 1.0, 9, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Barrel Stack
  cyl(5 - 0.5, 0, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(5 + 0.5, 0, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(5, 0 + 0.9, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Ship Mast
  cyl(1, 0, 25, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(1, 0 + 3.5, 25 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(1, 0 + 2.0, 25 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Iron Cannon
  box(5, 4.5, 9, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(5, 4.5 + 0.8, 9 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(5 - 0.7, 4.5 + 0.3, 9, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(5 + 0.7, 4.5 + 0.3, 9, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Mooring Bollard
  cyl(45, 0, 45, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(45, 0 + 1.0, 45, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Iron Cannon
  box(25, 0, 17, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(25, 0 + 0.8, 17 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(25 - 0.7, 0 + 0.3, 17, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(25 + 0.7, 0 + 0.3, 17, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Ship Mast
  cyl(29, 0, 41, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(29, 0 + 3.5, 41 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(29, 0 + 2.0, 41 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Treasure Chest
  box(45, 0, 25, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(45, 0 + 0.8, 25, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(45, 0 + 0.5, 25 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(1 - 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(1 + 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(1, 0 + 0.9, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Ship Mast
  cyl(33, 0, 21, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(33, 0 + 3.5, 21 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(33, 0 + 2.0, 21 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Mooring Bollard
  cyl(9, 0, 25, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(9, 0 + 1.0, 25, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Treasure Chest
  box(33, 0, 41, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(33, 0 + 0.8, 41, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(33, 0 + 0.5, 41 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Rowboat
  box(37, 0, 21, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(37 - 0.8, 0 + 0.4, 21, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(37 + 0.8, 0 + 0.4, 21, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(37, 0 + 0.4, 21 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(37, 0 + 0.4, 21 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(37, 0 + 0.6, 21, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Iron Cannon
  box(17, 0, 41, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(17, 0 + 0.8, 41 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(17 - 0.7, 0 + 0.3, 41, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(17 + 0.7, 0 + 0.3, 41, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Treasure Chest
  box(29, 0, 21, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(29, 0 + 0.8, 21, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(29, 0 + 0.5, 21 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Iron Cannon
  box(9, 4.5, 9, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(9, 4.5 + 0.8, 9 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(9 - 0.7, 4.5 + 0.3, 9, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(9 + 0.7, 4.5 + 0.3, 9, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Rowboat
  box(17, 0, 13, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(17 - 0.8, 0 + 0.4, 13, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(17 + 0.8, 0 + 0.4, 13, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(17, 0 + 0.4, 13 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(17, 0 + 0.4, 13 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(17, 0 + 0.6, 13, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Iron Cannon
  box(29, 0, 29, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(29, 0 + 0.8, 29 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(29 - 0.7, 0 + 0.3, 29, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(29 + 0.7, 0 + 0.3, 29, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(1 - 0.5, 4.5, 9, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(1 + 0.5, 4.5, 9, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(1, 4.5 + 0.9, 9, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(9, 0, 21, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(9, 0 + 0.8, 21, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(9, 0 + 0.5, 21 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Iron Cannon
  box(5, 0, 41, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(5, 0 + 0.8, 41 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(5 - 0.7, 0 + 0.3, 41, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(5 + 0.7, 0 + 0.3, 41, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(13 - 0.5, 0, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(13 + 0.5, 0, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(13, 0 + 0.9, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Ship Mast
  cyl(9, 0, 45, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(9, 0 + 3.5, 45 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(9, 0 + 2.0, 45 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Mooring Bollard
  cyl(9, 0, 17, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(9, 0 + 1.0, 17, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Treasure Chest
  box(41, 0, 17, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(41, 0 + 0.8, 17, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(41, 0 + 0.5, 17 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Treasure Chest
  box(1, 0, 21, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(1, 0 + 0.8, 21, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(1, 0 + 0.5, 21 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(33 - 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(33 + 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(33, 0 + 0.9, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(49, 0, 13, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(49, 0 + 0.8, 13 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(49 - 0.7, 0 + 0.3, 13, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(49 + 0.7, 0 + 0.3, 13, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(45 - 0.5, 0, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(45 + 0.5, 0, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(45, 0 + 0.9, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Barrel Stack
  cyl(5 - 0.5, 0, 45, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(5 + 0.5, 0, 45, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(5, 0 + 0.9, 45, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Ship Mast
  cyl(13, 0, 41, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(13, 0 + 3.5, 41 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(13, 0 + 2.0, 41 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(49, 0, 9, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(49 - 0.8, 0 + 0.4, 9, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(49 + 0.8, 0 + 0.4, 9, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(49, 0 + 0.4, 9 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(49, 0 + 0.4, 9 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(49, 0 + 0.6, 9, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Rowboat
  box(21, 0, 41, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(21 - 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(21 + 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(21, 0 + 0.4, 41 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(21, 0 + 0.4, 41 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(21, 0 + 0.6, 41, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Rowboat
  box(17, 0, 33, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(17 - 0.8, 0 + 0.4, 33, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(17 + 0.8, 0 + 0.4, 33, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(17, 0 + 0.4, 33 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(17, 0 + 0.4, 33 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(17, 0 + 0.6, 33, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Iron Cannon
  box(49, 0, 33, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(49, 0 + 0.8, 33 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(49 - 0.7, 0 + 0.3, 33, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(49 + 0.7, 0 + 0.3, 33, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(45 - 0.5, 0, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(45 + 0.5, 0, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(45, 0 + 0.9, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(45, 0, 21, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(45, 0 + 0.8, 21 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(45 - 0.7, 0 + 0.3, 21, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(45 + 0.7, 0 + 0.3, 21, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Rowboat
  box(49, 0, 37, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(49 - 0.8, 0 + 0.4, 37, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(49 + 0.8, 0 + 0.4, 37, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(49, 0 + 0.4, 37 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(49, 0 + 0.4, 37 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(49, 0 + 0.6, 37, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Mooring Bollard
  cyl(13, 0, 37, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(13, 0 + 1.0, 37, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Barrel Stack
  cyl(41 - 0.5, 0, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(41 + 0.5, 0, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(41, 0 + 0.9, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Barrel Stack
  cyl(49 - 0.5, 0, 29, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(49 + 0.5, 0, 29, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(49, 0 + 0.9, 29, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(25, 0, 25, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(25, 0 + 0.8, 25 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(25 - 0.7, 0 + 0.3, 25, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(25 + 0.7, 0 + 0.3, 25, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Rowboat
  box(49, 0, 1, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(49 - 0.8, 0 + 0.4, 1, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(49 + 0.8, 0 + 0.4, 1, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(49, 0 + 0.4, 1 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(49, 0 + 0.4, 1 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(49, 0 + 0.6, 1, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(41, 0, 33, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(41, 0 + 3.5, 33 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(41, 0 + 2.0, 33 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Iron Cannon
  box(25, 0, 9, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(25, 0 + 0.8, 9 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(25 - 0.7, 0 + 0.3, 9, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(25 + 0.7, 0 + 0.3, 9, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(41 - 0.5, 0, 37, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(41 + 0.5, 0, 37, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(41, 0 + 0.9, 37, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(25, 0, 29, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(25, 0 + 0.8, 29, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(25, 0 + 0.5, 29 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Rowboat
  box(45, 0, 9, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(45 - 0.8, 0 + 0.4, 9, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(45 + 0.8, 0 + 0.4, 9, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(45, 0 + 0.4, 9 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(45, 0 + 0.4, 9 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(45, 0 + 0.6, 9, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Barrel Stack
  cyl(29 - 0.5, 0, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(29 + 0.5, 0, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(29, 0 + 0.9, 25, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Rowboat
  box(37, 0, 1, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(37 - 0.8, 0 + 0.4, 1, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(37 + 0.8, 0 + 0.4, 1, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(37, 0 + 0.4, 1 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(37, 0 + 0.4, 1 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(37, 0 + 0.6, 1, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Treasure Chest
  box(45, 0, 13, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(45, 0 + 0.8, 13, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(45, 0 + 0.5, 13 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Iron Cannon
  box(21, 0, 21, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(21, 0 + 0.8, 21 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(21 - 0.7, 0 + 0.3, 21, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(21 + 0.7, 0 + 0.3, 21, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Mooring Bollard
  cyl(13, 0, 45, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(13, 0 + 1.0, 45, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Treasure Chest
  box(29, 0, 5, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(29, 0 + 0.8, 5, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(29, 0 + 0.5, 5 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Iron Cannon
  box(29, 0, 37, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(29, 0 + 0.8, 37 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(29 - 0.7, 0 + 0.3, 37, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(29 + 0.7, 0 + 0.3, 37, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Iron Cannon
  box(49, 0, 17, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(49, 0 + 0.8, 17 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(49 - 0.7, 0 + 0.3, 17, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(49 + 0.7, 0 + 0.3, 17, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Ship Mast
  cyl(45, 0, 17, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(45, 0 + 3.5, 17 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(45, 0 + 2.0, 17 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Rowboat
  box(1, 4.5, 1, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(1 - 0.8, 4.5 + 0.4, 1, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(1 + 0.8, 4.5 + 0.4, 1, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(1, 4.5 + 0.4, 1 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(1, 4.5 + 0.4, 1 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(1, 4.5 + 0.6, 1, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Barrel Stack
  cyl(21 - 0.5, 0, 13, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(21 + 0.5, 0, 13, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(21, 0 + 0.9, 13, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Rowboat
  box(41, 0, 45, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(41 - 0.8, 0 + 0.4, 45, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(41 + 0.8, 0 + 0.4, 45, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(41, 0 + 0.4, 45 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(41, 0 + 0.4, 45 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(41, 0 + 0.6, 45, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(25, 0, 41, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(25, 0 + 3.5, 41 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(25, 0 + 2.0, 41 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Barrel Stack
  cyl(1 - 0.5, 0, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(1 + 0.5, 0, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(1, 0 + 0.9, 33, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Rowboat
  box(33, 0, 25, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(33 - 0.8, 0 + 0.4, 25, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(33 + 0.8, 0 + 0.4, 25, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(33, 0 + 0.4, 25 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(33, 0 + 0.4, 25 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(33, 0 + 0.6, 25, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Rowboat
  box(5, 0, 37, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(5 - 0.8, 0 + 0.4, 37, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(5 + 0.8, 0 + 0.4, 37, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(5, 0 + 0.4, 37 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(5, 0 + 0.4, 37 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(5, 0 + 0.6, 37, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Barrel Stack
  cyl(49 - 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(49 + 0.5, 0, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(49, 0 + 0.9, 49, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(25, 0, 13, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(25, 0 + 0.8, 13, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(25, 0 + 0.5, 13 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Rowboat
  box(9, 0, 41, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(9 - 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(9 + 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(9, 0 + 0.4, 41 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(9, 0 + 0.4, 41 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(9, 0 + 0.6, 41, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Rowboat
  box(45, 0, 41, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(45 - 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(45 + 0.8, 0 + 0.4, 41, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(45, 0 + 0.4, 41 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(45, 0 + 0.4, 41 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(45, 0 + 0.6, 41, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(9, 4.5, 1, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(9, 4.5 + 3.5, 1 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(9, 4.5 + 2.0, 1 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Barrel Stack
  cyl(1 - 0.5, 4.5, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(1 + 0.5, 4.5, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(1, 4.5 + 0.9, 5, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Mooring Bollard
  cyl(49, 0, 21, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(49, 0 + 1.0, 21, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Ship Mast
  cyl(21, 0, 49, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(21, 0 + 3.5, 49 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(21, 0 + 2.0, 49 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Barrel Stack
  cyl(21 - 0.5, 0, 29, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(21 + 0.5, 0, 29, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(21, 0 + 0.9, 29, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Ship Mast
  cyl(41, 0, 1, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(41, 0 + 3.5, 1 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(41, 0 + 2.0, 1 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Iron Cannon
  box(17, 0, 21, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(17, 0 + 0.8, 21 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(17 - 0.7, 0 + 0.3, 21, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(17 + 0.7, 0 + 0.3, 21, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Rowboat
  box(29, 0, 9, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(29 - 0.8, 0 + 0.4, 9, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(29 + 0.8, 0 + 0.4, 9, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(29, 0 + 0.4, 9 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(29, 0 + 0.4, 9 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(29, 0 + 0.6, 9, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Barrel Stack
  cyl(13 - 0.5, 0, 21, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(13 + 0.5, 0, 21, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(13, 0 + 0.9, 21, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(25, 0, 45, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(25, 0 + 0.8, 45, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(25, 0 + 0.5, 45 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Treasure Chest
  box(45, 0, 37, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(45, 0 + 0.8, 37, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(45, 0 + 0.5, 37 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Barrel Stack
  cyl(25 - 0.5, 0, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(25 + 0.5, 0, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(25, 0 + 0.9, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Treasure Chest
  box(17, 0, 9, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(17, 0 + 0.8, 9, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(17, 0 + 0.5, 9 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Ship Mast
  cyl(45, 0, 5, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(45, 0 + 3.5, 5 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(45, 0 + 2.0, 5 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Mooring Bollard
  cyl(25, 0, 49, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(25, 0 + 1.0, 49, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Iron Cannon
  box(13, 0, 33, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(13, 0 + 0.8, 33 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(13 - 0.7, 0 + 0.3, 33, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(13 + 0.7, 0 + 0.3, 33, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Rowboat
  box(37, 0, 49, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(37 - 0.8, 0 + 0.4, 49, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(37 + 0.8, 0 + 0.4, 49, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(37, 0 + 0.4, 49 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(37, 0 + 0.4, 49 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(37, 0 + 0.6, 49, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Treasure Chest
  box(21, 0, 37, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(21, 0 + 0.8, 37, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(21, 0 + 0.5, 37 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Treasure Chest
  box(41, 0, 49, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(41, 0 + 0.8, 49, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(41, 0 + 0.5, 49 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Mooring Bollard
  cyl(33, 0, 33, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(33, 0 + 1.0, 33, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Ship Mast
  cyl(45, 0, 49, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(45, 0 + 3.5, 49 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(45, 0 + 2.0, 49 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Ship Mast
  cyl(9, 4.5, 5, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(9, 4.5 + 3.5, 5 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(9, 4.5 + 2.0, 5 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Mooring Bollard
  cyl(41, 0, 29, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(41, 0 + 1.0, 29, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Treasure Chest
  box(33, 0, 9, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(33, 0 + 0.8, 9, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(33, 0 + 0.5, 9 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Rowboat
  box(37, 0, 17, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(37 - 0.8, 0 + 0.4, 17, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(37 + 0.8, 0 + 0.4, 17, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(37, 0 + 0.4, 17 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(37, 0 + 0.4, 17 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(37, 0 + 0.6, 17, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Ship Mast
  cyl(29, 0, 1, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(29, 0 + 3.5, 1 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(29, 0 + 2.0, 1 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Barrel Stack
  cyl(33 - 0.5, 0, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(33 + 0.5, 0, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(33, 0 + 0.9, 1, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(37, 0, 37, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(37, 0 + 0.8, 37 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(37 - 0.7, 0 + 0.3, 37, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(37 + 0.7, 0 + 0.3, 37, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Barrel Stack
  cyl(33 - 0.5, 0, 29, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(33 + 0.5, 0, 29, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(33, 0 + 0.9, 29, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Rowboat
  box(37, 0, 5, 1.4, 0.4, 3.6, { ink: OR }); // Hull base
  box(37 - 0.8, 0 + 0.4, 5, 0.2, 0.6, 4.0, { ink: OR }); // Port side
  box(37 + 0.8, 0 + 0.4, 5, 0.2, 0.6, 4.0, { ink: OR }); // Starboard side
  box(37, 0 + 0.4, 5 - 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Stern
  box(37, 0 + 0.4, 5 + 1.8, 1.4, 0.6, 0.2, { ink: OR }); // Bow
  box(37, 0 + 0.6, 5, 1.4, 0.1, 0.4, { ink: BK }); // Seat

  // Prop: Barrel Stack
  cyl(41 - 0.5, 0, 21, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Left
  cyl(41 + 0.5, 0, 21, 0.45, 1.0, { seg: 8, ink: OR }); // Bottom Right
  cyl(41, 0 + 0.9, 21, 0.45, 1.0, { seg: 8, ink: OR }); // Top Center

  // Prop: Iron Cannon
  box(29, 0, 13, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(29, 0 + 0.8, 13 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(29 - 0.7, 0 + 0.3, 13, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(29 + 0.7, 0 + 0.3, 13, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Iron Cannon
  box(17, 0, 37, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(17, 0 + 0.8, 37 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(17 - 0.7, 0 + 0.3, 37, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(17 + 0.7, 0 + 0.3, 37, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel

  // Prop: Ship Mast
  cyl(25, 0, 33, 0.4, 6.0, { seg: 8, ink: OR }); // Main mast pole
  box(25, 0 + 3.5, 33 + 0.2, 3.5, 0.2, 0.2, { ink: BK }); // Cross yardarm
  box(25, 0 + 2.0, 33 + 0.3, 3.0, 3.0, 0.1, { noCollide: true, ink: BL }); // Furled sail

  // Prop: Mooring Bollard
  cyl(21, 0, 17, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(21, 0 + 1.0, 17, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(25, 0, 37, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(25, 0 + 1.0, 37, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Treasure Chest
  box(29, 0, 17, 1.5, 0.8, 1.0, { ink: OR }); // Base
  cyl(29, 0 + 0.8, 17, 0.5, 1.5, { seg: 8, ink: OR }); // Rounded Lid
  box(29, 0 + 0.5, 17 + 0.5, 0.3, 0.4, 0.1, { ink: BK }); // Lock

  // Prop: Iron Cannon
  box(9, 0, 49, 1.4, 0.6, 2.0, { ink: OR }); // Wooden base
  cyl(9, 0 + 0.8, 49 + 0.4, 0.5, 2.8, { seg: 8, ink: BK }); // Cannon barrel
  cyl(9 - 0.7, 0 + 0.3, 49, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  cyl(9 + 0.7, 0 + 0.3, 49, 0.4, 0.2, { seg: 8, ink: BK }); // Wheel
  // === END DREAM AUTO-INJECTED PROPS ===

  B.finish();
  return L;
}
