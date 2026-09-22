import * as THREE from 'three';
import { INK } from '../render.js';
import { instantiatePrefab } from '../prefabs.js';

export function buildRetroArcade(B, arena = false) {
  const { L, box, slab, cyl, sphere, ring, spawn, sniper, pickup, planes, collider, scene } = B;
  const OR = INK.ORANGE ?? 3;
  const GR = INK.GREEN ?? 4;
  const BK = INK.BLACK ?? 2;
  const BL = INK.BLUE ?? 0;
  const RD = INK.RED ?? 1;

  L.key = 'retro_arcade';
  
  // 1. Spatial Coordinates & World Bounds
  const P = arena ? 68 : 55;
  const PH = arena ? 32 : 20;
  const T = 6;
  const D = P - 3;
  L.bounds = { minX: -P, maxX: P, minZ: -P, maxZ: P };

  // 3. Perimeter Enclosure & Neon Facade Boundaries
  // Ground Slab
  box(0, -1.0, 0, 2 * P + T, 1.0, 2 * P + T, { ink: BL });
  
  // Arcade Carpet
  instantiatePrefab(B, 'arcade_carpet', 0, 0, 0, { w: 2*P, d: 2*P });

  // Perimeter Soundproofing Walls
  box(0, 0, -P, 2 * P + T, PH, T, { ink: BK });
  box(0, 0, P, 2 * P + T, PH, T, { ink: BK });
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: BK });
  box(P, 0, 0, T, PH, 2 * P + T, { ink: BK });

  // Anti-Camp Sky Containment (Solo Mode)
  if (!arena) {
    const NG = { noNav: true, noGrapple: true };
    collider(0, 56.0, 0, 2 * P + 40, 8.0, 2 * P + 40, NG);
    collider(0, 20.0, -P, 2 * P + 40, 38.0, T, NG);
    collider(0, 20.0, P, 2 * P + 40, 38.0, T, NG);
    collider(-P, 20.0, 0, T, 38.0, 2 * P + 40, NG);
    collider(P, 20.0, 0, T, 38.0, 2 * P + 40, NG);
    
    // Neon Truss Ceiling Ribs (approximate representation)
    const R = 98.0;
    // ... ceiling features can be elaborated further if needed.
  }

  // 3.3 Perimeter Ledges & Observation Balconies
  const ledges = [
    [-36.0, 5.5, -51.2, 8.0, 0.4, 2.4],
    [36.0, 5.5, -51.2, 8.0, 0.4, 2.4],
    [-51.2, 6.0, -18.0, 2.4, 0.4, 8.0],
    [-51.2, 6.0, 18.0, 2.4, 0.4, 8.0],
    [51.2, 6.0, -18.0, 2.4, 0.4, 8.0],
    [51.2, 6.0, 18.0, 2.4, 0.4, 8.0],
    [-24.0, 5.5, 51.2, 8.0, 0.4, 2.4],
    [24.0, 5.5, 51.2, 8.0, 0.4, 2.4]
  ];
  for (const l of ledges) {
    box(l[0], l[1], l[2], l[3], l[4], l[5], { ink: BK });
    ring(l[0], l[1] + 2.0, l[2] + (l[2] > 0 ? -l[5]/2 - 0.5 : l[5]/2 + 0.5), 'z'); // Add grapple rings on ledges properly avoiding colliders
    sniper(l[0], l[1] + 1.2, l[2]);
  }

  // 4. Sector 1: Skee-Ball Gallery & Redemption Counter (North)
  instantiatePrefab(B, 'prize_counter', 0, 0, -38.0, { w: 28.0, ink: BK });
  instantiatePrefab(B, 'skee_ball_lane', -16.0, 0, -28.0, {});
  instantiatePrefab(B, 'skee_ball_lane', -12.0, 0, -28.0, {});
  instantiatePrefab(B, 'skee_ball_lane', -8.0, 0, -28.0, {});
  
  // 5. Sector 2: Air Hockey Plaza & Neon Snack Bar (South)
  instantiatePrefab(B, 'air_hockey_table', -8.0, 0, 32.0, {});
  instantiatePrefab(B, 'air_hockey_table', 8.0, 0, 32.0, {});
  // Snack bar counter
  box(0, 0, 44.0, 22.0, 1.15, 2.0, { ink: BK });
  
  // Token Changer Kiosks
  instantiatePrefab(B, 'coin_op_wall', -20.0, 0, 44.0, { w: 8.0 });

  // 6. Sector 3: Sunken Vector CRT Pit & Cabinet Row (West)
  // Sunken Pit at y = -2.0
  box(-30.0, -2.0, 0, 16.0, 1.0, 16.0, { ink: BL });
  instantiatePrefab(B, 'arcade_cabinet', -30.0, -1.0, -4.0, {});
  instantiatePrefab(B, 'arcade_cabinet', -30.0, -1.0, 4.0, {});

  // 7. Sector 4: Rhythm Stage & Driving Simulators (East)
  // Stage platform
  box(30.0, 0, 0, 12.0, 0.6, 12.0, { ink: BK });
  // Claw machine
  instantiatePrefab(B, 'claw_machine', 28.0, 0, 12.0, {});

  // 8. Central Sector: Monumental Tilted Pinball Machine
  instantiatePrefab(B, 'hero_pinball_machine', 0, 0, 0, {});

  // 12. Spawns, Pickups & Navigation
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    spawn(Math.cos(a) * D, 0.2, Math.sin(a) * D);
  }
  
  // 10 themed arcade spawn portals
  spawn(-48.0, 0.2, -12.0);
  spawn(-48.0, 0.2, 12.0);
  spawn(48.0, 0.2, -16.0);
  spawn(48.0, 0.2, 16.0);
  spawn(-14.0, 0.2, -51.2);
  spawn(14.0, 0.2, -51.2);
  spawn(-16.0, 0.2, 51.2);
  spawn(16.0, 0.2, 51.2);
  spawn(-3.0, 0.4, -6.0);
  spawn(3.0, 0.4, -6.0);

  // Player Start
  if (L.playerStart) {
    L.playerStart.set(0, 0.2, 36.0);
  }

  // Pickups
  pickup(0, 1.2, 0);
  pickup(-30.0, 0.2, 0);
  pickup(30.0, 1.2, 0);
  pickup(0, 0.2, -35.0);

  B.finish();
  return L;
}
