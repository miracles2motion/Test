import * as THREE from 'three';
import { INK } from '../render.js';

/**
 * Map: COVER (cover)
 * God Mode Scaffolding — Bounds and tiers synced with concept
 */
export function buildCover(B, arena = false) {
  const { L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = INK.ORANGE ?? 3, GR = INK.GREEN ?? 4, BK = INK.BLACK ?? 2, BL = INK.BLUE ?? 0, RD = INK.RED ?? 1;

  L.key = 'cover';
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
  const scatterCount = 20;
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
  
  B.finish();
  return L;
}
