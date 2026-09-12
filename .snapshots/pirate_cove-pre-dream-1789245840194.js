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

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-25, 0, 11) ===
  box(-25 - 2.5, 0, 11 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, 11 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 - 2.5, 0, 11 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, 11 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-25 - 3.0, 11 - 3.0, -25 + 3.0, 11 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-25, 0 + 5.9, 11 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-25, 0 + 5.9, 11 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-25, 0 + 8.3, 11 + 4.0, 'z');
  pickup(-25, 0 + 6.1, 11 - 1.5);

  // === MACRO STRUCTURE: Galleon Sterncastle at (-19, 0, -37) ===
  box(-19, 0, -37, 8.0, 2.0, 6.0, { ink: BL });
  box(-19, 0 + 2.0, -37, 7.5, 2.5, 5.5, { ink: OR });
  slab(-19 - 4.0, -37 - 3.2, -19 + 4.0, -37 + 3.2, 0 + 4.5, 0.3, { ink: OR });
  rail(-19 - 4.0, -37 - 3.2, -19 + 4.0, -37 - 3.2, 0 + 4.5, { ink: BK });
  rail(-19 - 4.0, -37 + 3.2, -19 + 4.0, -37 + 3.2, 0 + 4.5, { ink: BK });
  rail(-19 - 4.0, -37 - 3.2, -19 - 4.0, -37 + 3.2, 0 + 4.5, { ink: BK });
  box(-19, 0 + 4.8, -37, 1.0, 3.0, 0.5, { ink: BK });
  ring(-19, 0 + 9.3, -37, 'z');
  pickup(-19, 0 + 4.7, -37);

  // === MACRO STRUCTURE: Lighthouse Beacon at (-19, 0, 29) ===
  cyl(-19, 0, 29, 2.2, 5.5, { seg: 10, ink: BL });
  slab(-19 - 2.8, 29 - 2.8, -19 + 2.8, 29 + 2.8, 0 + 5.0, 0.3, { ink: OR });
  rail(-19 - 2.8, 29 - 2.8, -19 + 2.8, 29 - 2.8, 0 + 5.0, { ink: BK });
  rail(-19 - 2.8, 29 + 2.8, -19 + 2.8, 29 + 2.8, 0 + 5.0, { ink: BK });
  cyl(-19, 0 + 5.3, 29, 1.5, 1.5, { seg: 8, noCollide: true, ink: OR });
  ring(-19, 0 + 9.3, 29, 'z');
  pickup(-19, 0 + 5.2, 29);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Prop: Cargo Crate
  box(-23, 0, -31, 1.8, 1.8, 1.8, { ink: BL });
  box(-23, 0, -31, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Mooring Bollard
  cyl(-15, 0, -23, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-15, 0 + 1.0, -23, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Timber Stack
  box(-47, 0, -31, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Timber Stack
  box(-7, 0, -27, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Timber Stack
  box(-23, 4.5, -35, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Cargo Crate
  box(-47, 0, -39, 1.8, 1.8, 1.8, { ink: BL });
  box(-47, 0, -39, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Cargo Crate
  box(-19, 0, -31, 1.8, 1.8, 1.8, { ink: BL });
  box(-19, 0, -31, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Timber Stack
  box(-19, 0, -19, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Cargo Crate
  box(-43, 0, -35, 1.8, 1.8, 1.8, { ink: BL });
  box(-43, 0, -35, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Mooring Bollard
  cyl(-47, 0, -23, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-47, 0 + 1.0, -23, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Timber Stack
  box(-3, 0, -31, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Timber Stack
  box(-11, 0, -43, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Mooring Bollard
  cyl(-11, 0, -27, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-11, 0 + 1.0, -27, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Timber Stack
  box(-43, 0, -3, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Mooring Bollard
  cyl(-3, 0, -35, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-3, 0 + 1.0, -35, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Cargo Crate
  box(-11, 0, -39, 1.8, 1.8, 1.8, { ink: BL });
  box(-11, 0, -39, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Mooring Bollard
  cyl(-31, 0, -11, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-31, 0 + 1.0, -11, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Timber Stack
  box(-15, 0, -15, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Mooring Bollard
  cyl(-23, 0, -3, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-23, 0 + 1.0, -3, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Timber Stack
  box(-15, 4.5, -39, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Cargo Crate
  box(45, 0, -15, 1.8, 1.8, 1.8, { ink: BL });
  box(45, 0, -15, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Mooring Bollard
  cyl(41, 0, -31, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(41, 0 + 1.0, -31, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(33, 0, -43, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(33, 0 + 1.0, -43, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(29, 0, -15, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(29, 0 + 1.0, -15, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Timber Stack
  box(33, 0, -35, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Mooring Bollard
  cyl(29, 0, -19, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(29, 0 + 1.0, -19, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(33, 0, -7, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(33, 0 + 1.0, -7, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Cargo Crate
  box(33, 0, -47, 1.8, 1.8, 1.8, { ink: BL });
  box(33, 0, -47, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Cargo Crate
  box(41, 0, -7, 1.8, 1.8, 1.8, { ink: BL });
  box(41, 0, -7, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Timber Stack
  box(29, 0, -27, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Cargo Crate
  box(37, 0, -39, 1.8, 1.8, 1.8, { ink: BL });
  box(37, 0, -39, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Timber Stack
  box(37, 0, -15, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Mooring Bollard
  cyl(41, 0, -47, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(41, 0 + 1.0, -47, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(13, 0, -31, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(13, 0 + 1.0, -31, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(13, 0, -35, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(13, 0 + 1.0, -35, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Cargo Crate
  box(45, 0, -11, 1.8, 1.8, 1.8, { ink: BL });
  box(45, 0, -11, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Timber Stack
  box(49, 0, -3, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Mooring Bollard
  cyl(37, 0, -27, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(37, 0 + 1.0, -27, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Timber Stack
  box(29, 0, -3, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Timber Stack
  box(1, 0, -35, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Cargo Crate
  box(-11, 4.5, 9, 1.8, 1.8, 1.8, { ink: BL });
  box(-11, 4.5, 9, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Cargo Crate
  box(-39, 0, 9, 1.8, 1.8, 1.8, { ink: BL });
  box(-39, 0, 9, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Cargo Crate
  box(-43, 0, 5, 1.8, 1.8, 1.8, { ink: BL });
  box(-43, 0, 5, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Timber Stack
  box(-39, 0, 37, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Timber Stack
  box(-31, 0, 1, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Cargo Crate
  box(-19, 0, 41, 1.8, 1.8, 1.8, { ink: BL });
  box(-19, 0, 41, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Cargo Crate
  box(-7, 0, 25, 1.8, 1.8, 1.8, { ink: BL });
  box(-7, 0, 25, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Mooring Bollard
  cyl(-35, 0, 5, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-35, 0 + 1.0, 5, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Cargo Crate
  box(-47, 0, 25, 1.8, 1.8, 1.8, { ink: BL });
  box(-47, 0, 25, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Cargo Crate
  box(-43, 0, 49, 1.8, 1.8, 1.8, { ink: BL });
  box(-43, 0, 49, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Timber Stack
  box(-43, 0, 37, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Cargo Crate
  box(-35, 0, 45, 1.8, 1.8, 1.8, { ink: BL });
  box(-35, 0, 45, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Mooring Bollard
  cyl(-23, 0, 29, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-23, 0 + 1.0, 29, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Cargo Crate
  box(-15, 0, 25, 1.8, 1.8, 1.8, { ink: BL });
  box(-15, 0, 25, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Mooring Bollard
  cyl(-39, 0, 13, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-39, 0 + 1.0, 13, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(-11, 0, 37, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-11, 0 + 1.0, 37, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Timber Stack
  box(-27, 0, 41, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Timber Stack
  box(-47, 0, 9, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Cargo Crate
  box(-31, 0, 25, 1.8, 1.8, 1.8, { ink: BL });
  box(-31, 0, 25, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Cargo Crate
  box(-15, 0, 21, 1.8, 1.8, 1.8, { ink: BL });
  box(-15, 0, 21, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Mooring Bollard
  cyl(29, 0, 45, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(29, 0 + 1.0, 45, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Timber Stack
  box(21, 0, 1, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Timber Stack
  box(13, 0, 29, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Mooring Bollard
  cyl(21, 0, 33, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(21, 0 + 1.0, 33, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Timber Stack
  box(5, 0, 25, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Timber Stack
  box(37, 0, 45, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Timber Stack
  box(25, 0, 5, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Cargo Crate
  box(33, 0, 45, 1.8, 1.8, 1.8, { ink: BL });
  box(33, 0, 45, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Cargo Crate
  box(1, 0, 45, 1.8, 1.8, 1.8, { ink: BL });
  box(1, 0, 45, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Mooring Bollard
  cyl(9, 0, 29, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(9, 0 + 1.0, 29, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(29, 0, 33, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(29, 0 + 1.0, 33, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Cargo Crate
  box(41, 0, 5, 1.8, 1.8, 1.8, { ink: BL });
  box(41, 0, 5, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Mooring Bollard
  cyl(33, 0, 37, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(33, 0 + 1.0, 37, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Timber Stack
  box(9, 0, 33, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Cargo Crate
  box(41, 0, 9, 1.8, 1.8, 1.8, { ink: BL });
  box(41, 0, 9, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Cargo Crate
  box(5, 0, 29, 1.8, 1.8, 1.8, { ink: BL });
  box(5, 0, 29, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Mooring Bollard
  cyl(17, 0, 29, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(17, 0 + 1.0, 29, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Cargo Crate
  box(29, 0, 49, 1.8, 1.8, 1.8, { ink: BL });
  box(29, 0, 49, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Cargo Crate
  box(17, 0, 5, 1.8, 1.8, 1.8, { ink: BL });
  box(17, 0, 5, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Cargo Crate
  box(21, 0, 5, 1.8, 1.8, 1.8, { ink: BL });
  box(21, 0, 5, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });
  // === END DREAM AUTO-INJECTED PROPS ===

  B.finish();
  return L;
}
