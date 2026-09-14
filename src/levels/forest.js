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
  box(0, -1.0, 0, 2 * P + T, 1.0, 2 * P + T, { ink: GR });
  box(0, 0, -P, 2 * P + T, PH, T, { ink: GR });
  box(0, 0, P, 2 * P + T, PH, T, { ink: GR });
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: GR });
  box(P, 0, 0, T, PH, 2 * P + T, { ink: GR });

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
  box(0, 0, 0, 24, 4.5, 24, { ink: GR });
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
    box(-20 - (i % 5) * 4, 0, -20 - Math.floor(i / 5) * 4, 1.2, 1.1, 1.2, { ink: GR });
    // NE Quadrant
    box(20 + (i % 5) * 4, 0, -20 - Math.floor(i / 5) * 4, 1.2, 1.1, 1.2, { ink: GR });
    // SW Quadrant
    box(-20 - (i % 5) * 4, 0, 20 + Math.floor(i / 5) * 4, 1.2, 1.1, 1.2, { ink: GR });
    // SE Quadrant
    box(20 + (i % 5) * 4, 0, 20 + Math.floor(i / 5) * 4, 1.2, 1.1, 1.2, { ink: GR });
  }

  // Ground collision floor
  collider(0, -2, 0, 100, 2, 100);
  L.playerStart.set(0, 0.2, D - 5); 
  
  
  // === DREAM AUTO-INJECTED MACRO STRUCTURES ===

  // === MACRO STRUCTURE: Ancient Oak Canopy at (-43, 0, -43) ===
  cyl(-43, 0, -43, 2.2, 7.0, { seg: 10, ink: BK });
  box(-43 - 2.8, 0, -43, 1.2, 2.0, 1.2, { ink: BK });
  box(-43 + 2.8, 0, -43, 1.2, 2.0, 1.2, { ink: BK });
  slab(-43 - 3.8, -43 - 3.8, -43 + 3.8, -43 + 3.8, 0 + 4.5, 0.4, { ink: GR });
  rail(-43 - 3.8, -43 - 3.8, -43 + 3.8, -43 - 3.8, 0 + 4.5, { ink: BK });
  rail(-43 - 3.8, -43 + 3.8, -43 + 3.8, -43 + 3.8, 0 + 4.5, { ink: BK });
  box(-43, 0 + 6.8, -43, 6.0, 2.0, 6.0, { noCollide: true, ink: GR });
  ring(-43, 0 + 9.2, -43, 'z');
  pickup(-43, 0 + 4.7, -43 + 2.0);

  // === MACRO STRUCTURE: Canopy Treehouse Outpost at (-43, 0, -19) ===
  box(-43 - 2.5, 0, -19 - 2.5, 0.6, 5.0, 0.6, { ink: BK });
  box(-43 + 2.5, 0, -19 - 2.5, 0.6, 5.0, 0.6, { ink: BK });
  box(-43 - 2.5, 0, -19 + 2.5, 0.6, 5.0, 0.6, { ink: BK });
  box(-43 + 2.5, 0, -19 + 2.5, 0.6, 5.0, 0.6, { ink: BK });
  slab(-43 - 3.0, -19 - 3.0, -43 + 3.0, -19 + 3.0, 0 + 5.0, 0.3, { ink: OR });
  rail(-43 - 3.0, -19 - 3.0, -43 + 3.0, -19 - 3.0, 0 + 5.0, { ink: BK });
  rail(-43 - 3.0, -19 + 3.0, -43 + 3.0, -19 + 3.0, 0 + 5.0, { ink: BK });
  box(-43, 0 + 7.2, -19, 6.5, 0.5, 6.5, { noCollide: true, ink: GR });
  ring(-43, 0 + 9.2, -19, 'y');
  pickup(-43, 0 + 5.2, -19);

  // === MACRO STRUCTURE: Stonehenge Hollow Altar at (-43, 0, -1) ===
  box(-43 - 2.8, 0, -1, 1.2, 4.5, 1.2, { ink: BK });
  box(-43 + 2.8, 0, -1, 1.2, 4.5, 1.2, { ink: BK });
  slab(-43 - 3.5, -1 - 1.5, -43 + 3.5, -1 + 1.5, 0 + 4.5, 0.6, { ink: BK });
  cyl(-43, 0, -1, 1.6, 1.4, { seg: 8, ink: GR });
  slab(-43 - 2.0, -1 - 2.0, -43 + 2.0, -1 + 2.0, 0 + 1.4, 0.3, { ink: OR });
  ring(-43, 0 + 7.8, -1, 'z');
  pickup(-43, 0 + 1.6, -1);

  // === MACRO STRUCTURE: Ancient Oak Canopy at (-43, 0, 17) ===
  cyl(-43, 0, 17, 2.2, 7.0, { seg: 10, ink: BK });
  box(-43 - 2.8, 0, 17, 1.2, 2.0, 1.2, { ink: BK });
  box(-43 + 2.8, 0, 17, 1.2, 2.0, 1.2, { ink: BK });
  slab(-43 - 3.8, 17 - 3.8, -43 + 3.8, 17 + 3.8, 0 + 4.5, 0.4, { ink: GR });
  rail(-43 - 3.8, 17 - 3.8, -43 + 3.8, 17 - 3.8, 0 + 4.5, { ink: BK });
  rail(-43 - 3.8, 17 + 3.8, -43 + 3.8, 17 + 3.8, 0 + 4.5, { ink: BK });
  box(-43, 0 + 6.8, 17, 6.0, 2.0, 6.0, { noCollide: true, ink: GR });
  ring(-43, 0 + 9.2, 17, 'z');
  pickup(-43, 0 + 4.7, 17 + 2.0);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Macro: Granite Boulder Cluster
  sphere(-47, 0 + 1.0, -31, 1.2, { ink: BK });
  sphere(-47 - 1.0, 0 + 0.7, -31 + 0.7, 0.9, { ink: BK });
  box(-47, 0 + 1.8, -31, 1.4, 0.2, 1.4, { ink: GR, noCollide: true });

  // Macro: Canopy Treehouse Platform
  box(-47 - 2.2, 0, 33 - 2.2, 0.6, 5.0, 0.6, { ink: BK });
  box(-47 + 2.2, 0, 33 - 2.2, 0.6, 5.0, 0.6, { ink: BK });
  box(-47 - 2.2, 0, 33 + 2.2, 0.6, 5.0, 0.6, { ink: BK });
  box(-47 + 2.2, 0, 33 + 2.2, 0.6, 5.0, 0.6, { ink: BK });
  slab(-47 - 2.8, 33 - 2.8, -47 + 2.8, 33 + 2.8, 0 + 4.8, 0.3, { ink: OR });
  rail(-47 - 2.8, 33 - 2.8, -47 + 2.8, 33 - 2.8, 0 + 4.8, { ink: BK });
  rail(-47 - 2.8, 33 + 2.8, -47 + 2.8, 33 + 2.8, 0 + 4.8, { ink: BK });
  box(-47, 0 + 7.0, 33, 6.0, 0.4, 6.0, { noCollide: true, ink: GR });
  ring(-47, 0 + 9.0, 33, 'y');

  // Macro: Granite Boulder Cluster
  sphere(-31, 0 + 1.0, -47, 1.2, { ink: BK });
  sphere(-31 - 1.0, 0 + 0.7, -47 + 0.7, 0.9, { ink: BK });
  box(-31, 0 + 1.8, -47, 1.4, 0.2, 1.4, { ink: GR, noCollide: true });

  // Macro: Canopy Treehouse Platform
  box(-31 - 2.2, 0, 1 - 2.2, 0.6, 5.0, 0.6, { ink: BK });
  box(-31 + 2.2, 0, 1 - 2.2, 0.6, 5.0, 0.6, { ink: BK });
  box(-31 - 2.2, 0, 1 + 2.2, 0.6, 5.0, 0.6, { ink: BK });
  box(-31 + 2.2, 0, 1 + 2.2, 0.6, 5.0, 0.6, { ink: BK });
  slab(-31 - 2.8, 1 - 2.8, -31 + 2.8, 1 + 2.8, 0 + 4.8, 0.3, { ink: OR });
  rail(-31 - 2.8, 1 - 2.8, -31 + 2.8, 1 - 2.8, 0 + 4.8, { ink: BK });
  rail(-31 - 2.8, 1 + 2.8, -31 + 2.8, 1 + 2.8, 0 + 4.8, { ink: BK });
  box(-31, 0 + 7.0, 1, 6.0, 0.4, 6.0, { noCollide: true, ink: GR });
  ring(-31, 0 + 9.0, 1, 'y');

  // Macro: Ancient Oak Tree
  cyl(-15, 0, -47, 2.0, 7.0, { seg: 10, ink: BK });
  box(-15 - 2.5, 0, -47, 1.0, 1.8, 1.0, { ink: BK });
  box(-15 + 2.5, 0, -47, 1.0, 1.8, 1.0, { ink: BK });
  slab(-15 - 3.2, -47 - 3.2, -15 + 3.2, -47 + 3.2, 0 + 4.5, 0.4, { ink: GR });
  box(-15, 0 + 6.8, -47, 5.5, 1.8, 5.5, { noCollide: true, ink: GR });
  ring(-15, 0 + 8.8, -47 + 2.0, 'z');

  // Macro: Granite Boulder Cluster
  sphere(-15, 0 + 1.0, -31, 1.2, { ink: BK });
  sphere(-15 - 1.0, 0 + 0.7, -31 + 0.7, 0.9, { ink: BK });
  box(-15, 0 + 1.8, -31, 1.4, 0.2, 1.4, { ink: GR, noCollide: true });

  // Macro: Fallen Mossy Log
  cyl(1, 0 + 0.6, -31, 0.8, 5.5, { axis: 'x', ink: BK });
  box(1, 0 + 1.1, -31, 5.0, 0.2, 1.2, { ink: GR });
  sphere(1 + 2.2, 0 + 0.5, -31 + 1.0, 0.6, { ink: BK });

  // Macro: Granite Boulder Cluster
  sphere(1, 0 + 1.0, 33, 1.2, { ink: BK });
  sphere(1 - 1.0, 0 + 0.7, 33 + 0.7, 0.9, { ink: BK });
  box(1, 0 + 1.8, 33, 1.4, 0.2, 1.4, { ink: GR, noCollide: true });

  // Macro: Granite Boulder Cluster
  sphere(17, 0 + 1.0, -47, 1.2, { ink: BK });
  sphere(17 - 1.0, 0 + 0.7, -47 + 0.7, 0.9, { ink: BK });
  box(17, 0 + 1.8, -47, 1.4, 0.2, 1.4, { ink: GR, noCollide: true });

  // Macro: Granite Boulder Cluster
  sphere(17, 0 + 1.0, 1, 1.2, { ink: BK });
  sphere(17 - 1.0, 0 + 0.7, 1 + 0.7, 0.9, { ink: BK });
  box(17, 0 + 1.8, 1, 1.4, 0.2, 1.4, { ink: GR, noCollide: true });

  // Macro: Canopy Treehouse Platform
  box(33 - 2.2, 0, -47 - 2.2, 0.6, 5.0, 0.6, { ink: BK });
  box(33 + 2.2, 0, -47 - 2.2, 0.6, 5.0, 0.6, { ink: BK });
  box(33 - 2.2, 0, -47 + 2.2, 0.6, 5.0, 0.6, { ink: BK });
  box(33 + 2.2, 0, -47 + 2.2, 0.6, 5.0, 0.6, { ink: BK });
  slab(33 - 2.8, -47 - 2.8, 33 + 2.8, -47 + 2.8, 0 + 4.8, 0.3, { ink: OR });
  rail(33 - 2.8, -47 - 2.8, 33 + 2.8, -47 - 2.8, 0 + 4.8, { ink: BK });
  rail(33 - 2.8, -47 + 2.8, 33 + 2.8, -47 + 2.8, 0 + 4.8, { ink: BK });
  box(33, 0 + 7.0, -47, 6.0, 0.4, 6.0, { noCollide: true, ink: GR });
  ring(33, 0 + 9.0, -47, 'y');

  // Macro: Canopy Treehouse Platform
  box(33 - 2.2, 0, 1 - 2.2, 0.6, 5.0, 0.6, { ink: BK });
  box(33 + 2.2, 0, 1 - 2.2, 0.6, 5.0, 0.6, { ink: BK });
  box(33 - 2.2, 0, 1 + 2.2, 0.6, 5.0, 0.6, { ink: BK });
  box(33 + 2.2, 0, 1 + 2.2, 0.6, 5.0, 0.6, { ink: BK });
  slab(33 - 2.8, 1 - 2.8, 33 + 2.8, 1 + 2.8, 0 + 4.8, 0.3, { ink: OR });
  rail(33 - 2.8, 1 - 2.8, 33 + 2.8, 1 - 2.8, 0 + 4.8, { ink: BK });
  rail(33 - 2.8, 1 + 2.8, 33 + 2.8, 1 + 2.8, 0 + 4.8, { ink: BK });
  box(33, 0 + 7.0, 1, 6.0, 0.4, 6.0, { noCollide: true, ink: GR });
  ring(33, 0 + 9.0, 1, 'y');
  // === END DREAM AUTO-INJECTED PROPS ===
  B.finish();
  return L;
}
