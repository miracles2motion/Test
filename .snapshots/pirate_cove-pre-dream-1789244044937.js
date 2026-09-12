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

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-43, 0, -19) ===
  box(-43 - 2.5, 0, -19 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 + 2.5, 0, -19 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 - 2.5, 0, -19 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 + 2.5, 0, -19 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-43 - 3.0, -19 - 3.0, -43 + 3.0, -19 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-43, 0 + 5.9, -19 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-43, 0 + 5.9, -19 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-43, 0 + 8.3, -19 + 4.0, 'z');
  pickup(-43, 0 + 6.1, -19 - 1.5);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-31, 0, -7) ===
  box(-31 - 2.5, 0, -7 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-31 + 2.5, 0, -7 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-31 - 2.5, 0, -7 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-31 + 2.5, 0, -7 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-31 - 3.0, -7 - 3.0, -31 + 3.0, -7 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-31, 0 + 5.9, -7 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-31, 0 + 5.9, -7 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-31, 0 + 8.3, -7 + 4.0, 'z');
  pickup(-31, 0 + 6.1, -7 - 1.5);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-31, 0, 17) ===
  box(-31 - 2.5, 0, 17 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-31 + 2.5, 0, 17 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-31 - 2.5, 0, 17 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-31 + 2.5, 0, 17 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-31 - 3.0, 17 - 3.0, -31 + 3.0, 17 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-31, 0 + 5.9, 17 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-31, 0 + 5.9, 17 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-31, 0 + 8.3, 17 + 4.0, 'z');
  pickup(-31, 0 + 6.1, 17 - 1.5);

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
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Prop: Timber Stack
  box(-7, 0, -47, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Mooring Bollard
  cyl(-27, 0, -7, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-27, 0 + 1.0, -7, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Timber Stack
  box(-19, 0, -27, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Mooring Bollard
  cyl(-3, 0, -35, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-3, 0 + 1.0, -35, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Cargo Crate
  box(-31, 0, -11, 1.8, 1.8, 1.8, { ink: BL });
  box(-31, 0, -11, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Mooring Bollard
  cyl(-35, 0, -39, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-35, 0 + 1.0, -39, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Timber Stack
  box(-27, 0, -43, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Mooring Bollard
  cyl(-47, 0, -35, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-47, 0 + 1.0, -35, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Timber Stack
  box(9, 4.5, -11, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Cargo Crate
  box(33, 0, -43, 1.8, 1.8, 1.8, { ink: BL });
  box(33, 0, -43, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Mooring Bollard
  cyl(33, 0, -15, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(33, 0 + 1.0, -15, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Cargo Crate
  box(45, 0, -3, 1.8, 1.8, 1.8, { ink: BL });
  box(45, 0, -3, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Cargo Crate
  box(5, 4.5, -3, 1.8, 1.8, 1.8, { ink: BL });
  box(5, 4.5, -3, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Timber Stack
  box(49, 0, -27, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Mooring Bollard
  cyl(49, 0, -35, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(49, 0 + 1.0, -35, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Timber Stack
  box(45, 0, -19, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Cargo Crate
  box(-47, 0, 21, 1.8, 1.8, 1.8, { ink: BL });
  box(-47, 0, 21, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Timber Stack
  box(-19, 0, 33, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Mooring Bollard
  cyl(-35, 0, 5, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-35, 0 + 1.0, 5, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(-35, 0, 1, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(-35, 0 + 1.0, 1, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Timber Stack
  box(-43, 0, 13, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Cargo Crate
  box(-23, 0, 1, 1.8, 1.8, 1.8, { ink: BL });
  box(-23, 0, 1, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Timber Stack
  box(-47, 0, 17, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Cargo Crate
  box(-47, 0, 33, 1.8, 1.8, 1.8, { ink: BL });
  box(-47, 0, 33, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Timber Stack
  box(9, 0, 25, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Cargo Crate
  box(5, 0, 45, 1.8, 1.8, 1.8, { ink: BL });
  box(5, 0, 45, 1.9, 1.9, 1.9, { noCollide: true, ink: BK });

  // Prop: Mooring Bollard
  cyl(29, 0, 49, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(29, 0 + 1.0, 49, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(49, 0, 17, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(49, 0 + 1.0, 17, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Timber Stack
  box(37, 0, 25, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Timber Stack
  box(41, 0, 21, 3.0, 1.0, 1.2, { ink: OR });

  // Prop: Mooring Bollard
  cyl(9, 0, 49, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(9, 0 + 1.0, 49, 0.5, 0.2, { seg: 8, ink: BK });

  // Prop: Mooring Bollard
  cyl(9, 0, 41, 0.4, 1.0, { seg: 8, ink: BK });
  cyl(9, 0 + 1.0, 41, 0.5, 0.2, { seg: 8, ink: BK });

  // Additional props to reach >150 density
  for (let px = -40; px <= 40; px += 10) {
    for (let pz = -40; pz <= 40; pz += 10) {
      if (Math.abs(px) > 18 || Math.abs(pz) > 18) { // Avoid central dais
        box(px, 0, pz, 1.8, 1.8, 1.8, { ink: BL });
        cyl(px + 2, 0, pz, 0.4, 1.0, { seg: 8, ink: BK });
        box(px - 2, 0, pz, 1.0, 1.0, 1.0, { ink: OR });
      }
    }
  }

  // === END DREAM AUTO-INJECTED PROPS ===

  B.finish();
  return L;
}
