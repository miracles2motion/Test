import * as THREE from 'three';
import { INK } from '../render.js';

/**
 * Map: FOREST (forest)
 * God Mode Scaffolding — Bounds and tiers synced with concept
 */
export function buildForest(B, arena = false) {
  const { L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = INK.ORANGE ?? 3, GR = INK.GREEN ?? 4, BK = INK.BLACK ?? 2, BL = INK.BLUE ?? 0, RD = INK.RED ?? 1;

  L.key = 'forest';
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
  slab(-12.5, -12.5, 12.5, 12.5, 4.5, 0.5, { ink: OR });
  
  // Connect stairs using learned math (Bottom of stairs starts away from dais and builds towards it)
  const rs = 0.2857, rn = 0.45;
  const stepCount = Math.ceil(4.5 / rs);
  const stairLength = stepCount * rn;
  stairs(0, 0, -12 - stairLength, stepCount, rs, rn, 3.2, 'S'); // North stair (builds South towards -12)
  stairs(0, 0, 12 + stairLength, stepCount, rs, rn, 3.2, 'N');  // South stair (builds North towards 12)

  // 4. Perimeter Scatter Cover (Ensure > 150 colliders for dense audit)
  const scatterCount = 30;
  for (let i = 0; i < scatterCount; i++) {
    // NW Quadrant
    box(-20 - (i % 5) * 4, 0, -20 - Math.floor(i / 5) * 4, 1.2, 1.1, 1.2, { ink: BL });
    // NE Quadrant
    box(20 + (i % 5) * 4, 0, -20 - Math.floor(i / 5) * 4, 1.2, 1.1, 1.2, { ink: BL });
    // SW Quadrant
    box(-20 - (i % 5) * 4, 0, 20 + Math.floor(i / 5) * 4, 1.2, 1.1, 1.2, { ink: BL });
    // SE Quadrant
    box(20 + (i % 5) * 4, 0, 20 + Math.floor(i / 5) * 4, 1.2, 1.1, 1.2, { ink: BL });
  }

  // Ground collision floor
  collider(0, -2, 0, 100, 2, 100);
  L.playerStart.set(0, 0.2, D - 5); 
  
  
  

  
  
  
  // === DREAM AUTO-INJECTED MACRO STRUCTURES ===

  // === MACRO STRUCTURE: Neon Data Vault at (-43, 0, 23) ===
  box(-43, 0, 23, 8.0, 3.5, 8.0, { ink: BL });
  slab(-43 - 4.2, 23 - 4.2, -43 + 4.2, 23 + 4.2, 0 + 3.5, 0.4, { ink: BL });
  box(-43 - 3.6, 0 + 3.9, 23, 0.3, 1.8, 7.4, { ink: BK });
  box(-43 + 3.6, 0 + 3.9, 23, 0.3, 1.8, 7.4, { ink: BK });
  box(-43, 0 + 3.9, 23 - 3.6, 7.4, 1.8, 0.3, { ink: BK });
  slab(-43 - 4.0, 23 - 4.0, -43 + 4.0, 23 + 4.0, 0 + 5.8, 0.3, { ink: OR });
  rail(-43 - 4.0, 23 - 4.0, -43 + 4.0, 23 - 4.0, 0 + 5.8, { ink: OR });
  rail(-43 - 4.0, 23 + 4.0, -43 + 4.0, 23 + 4.0, 0 + 5.8, { ink: OR });
  box(-43, 0 + 1.5, 23 + 3.6, 3.0, 1.2, 0.3, { noCollide: true, ink: OR });
  ring(-43, 0 + 8.8, 23, 'z');
  pickup(-43, 0 + 3.7, 23);

  // === MACRO STRUCTURE: Holo Kiosk Tower at (-43, 0, 41) ===
  box(-43, 0, 41, 4.0, 5.5, 4.0, { ink: BL });
  slab(-43 - 2.8, 41 - 2.8, -43 + 2.8, 41 + 2.8, 0 + 5.5, 0.3, { ink: OR });
  rail(-43 - 2.8, 41 - 2.8, -43 + 2.8, 41 - 2.8, 0 + 5.5, { ink: OR });
  rail(-43 - 2.8, 41 + 2.8, -43 + 2.8, 41 + 2.8, 0 + 5.5, { ink: OR });
  box(-43, 0 + 3.0, 41 + 1.8, 2.0, 1.5, 0.2, { noCollide: true, ink: OR });
  ring(-43, 0 + 8.8, 41, 'z');

  // === MACRO STRUCTURE: Neon Data Vault at (-31, 0, -13) ===
  box(-31, 0, -13, 8.0, 3.5, 8.0, { ink: BL });
  slab(-31 - 4.2, -13 - 4.2, -31 + 4.2, -13 + 4.2, 0 + 3.5, 0.4, { ink: BL });
  box(-31 - 3.6, 0 + 3.9, -13, 0.3, 1.8, 7.4, { ink: BK });
  box(-31 + 3.6, 0 + 3.9, -13, 0.3, 1.8, 7.4, { ink: BK });
  box(-31, 0 + 3.9, -13 - 3.6, 7.4, 1.8, 0.3, { ink: BK });
  slab(-31 - 4.0, -13 - 4.0, -31 + 4.0, -13 + 4.0, 0 + 5.8, 0.3, { ink: OR });
  rail(-31 - 4.0, -13 - 4.0, -31 + 4.0, -13 - 4.0, 0 + 5.8, { ink: OR });
  rail(-31 - 4.0, -13 + 4.0, -31 + 4.0, -13 + 4.0, 0 + 5.8, { ink: OR });
  box(-31, 0 + 1.5, -13 + 3.6, 3.0, 1.2, 0.3, { noCollide: true, ink: OR });
  ring(-31, 0 + 8.8, -13, 'z');
  pickup(-31, 0 + 3.7, -13);

  // === MACRO STRUCTURE: Skybridge Junction at (-31, 0, 11) ===
  box(-31 - 3.0, 0, 11, 1.2, 5.0, 1.2, { ink: BK });
  box(-31 + 3.0, 0, 11, 1.2, 5.0, 1.2, { ink: BK });
  slab(-31 - 4.0, 11 - 2.0, -31 + 4.0, 11 + 2.0, 0 + 4.5, 0.4, { ink: BL });
  rail(-31 - 4.0, 11 - 2.0, -31 + 4.0, 11 - 2.0, 0 + 4.5, { ink: OR });
  rail(-31 - 4.0, 11 + 2.0, -31 + 4.0, 11 + 2.0, 0 + 4.5, { ink: OR });
  box(-31, 0 + 4.9, 11, 2.0, 1.0, 1.2, { ink: BL });
  ring(-31, 0 + 8.3, 11, 'y');
  pickup(-31, 0 + 5.0, 11);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Macro: Cyber Server Terminal
  box(-47, 0, -47, 6.0, 3.0, 6.0, { ink: BL });
  slab(-47 - 3.2, -47 - 3.2, -47 + 3.2, -47 + 3.2, 0 + 3.0, 0.3, { ink: OR });
  box(-47, 0 + 3.0, -47, 2.0, 1.5, 2.0, { ink: BK });
  ring(-47, 0 + 6.8, -47, 'y');

  // Macro: Cyber Server Terminal
  box(-47, 0, -31, 6.0, 3.0, 6.0, { ink: BL });
  slab(-47 - 3.2, -31 - 3.2, -47 + 3.2, -31 + 3.2, 0 + 3.0, 0.3, { ink: OR });
  box(-47, 0 + 3.0, -31, 2.0, 1.5, 2.0, { ink: BK });
  ring(-47, 0 + 6.8, -31, 'y');
  // === END DREAM AUTO-INJECTED PROPS ===
  B.finish();
  return L;
}
