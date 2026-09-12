import * as THREE from 'three';
import { INK } from '../render.js';

export function buildPirateCove(B, arena = false) {
  const { L, box, slab, stairs, cyl, ring, spawn, sniper, pickup } = B;
  const OR = INK.ORANGE ?? 3, GR = INK.GREEN ?? 4, BK = INK.BLACK ?? 2, BL = INK.BLUE ?? 0;
  
  L.key = 'pirate_cove';
  const P = arena ? 68 : 55, PH = arena ? 30 : 18, T = 6;
  L.bounds = { minX: -P, maxX: P, minZ: -P, maxZ: P };

  // 1. Foundation & Perimeter Walls
  box(0, -1.0, 0, 2 * P + T, 1.0, 2 * P + T, { ink: BK }); 
  box(0, 0, -P, 2 * P + T, PH, T, { ink: BL });
  box(0, 0, P, 2 * P + T, PH, T, { ink: BL });
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: BL });
  box(P, 0, 0, T, PH, 2 * P + T, { ink: BL });

  // 2. Spawn Bases
  box(-20, 0, -P + 12, 15, 6, 2, { ink: BL }); 
  box(20, 0, -P + 12, 15, 6, 2, { ink: BL }); 
  spawn(-20, 0, -35); spawn(20, 0, -35); 
  
  box(-20, 0, P - 12, 15, 6, 2, { ink: BL }); 
  box(20, 0, P - 12, 15, 6, 2, { ink: BL }); 
  spawn(-20, 0, 35); spawn(20, 0, 35);

  // 3. Central Centerpiece: Suspended Ironclad Drydock
  box(-12, 0, -18, 4, 16, 4, { ink: BL }); 
  box(12, 0, -18, 4, 16, 4, { ink: BL });  
  box(-12, 0, 18, 4, 16, 4, { ink: BL });  
  box(12, 0, 18, 4, 16, 4, { ink: BL });   
  pickup(0, 1, 0); 
  pickup(0, 0, -25); pickup(0, 0, 25); 

  // Tier 2: The Ironclad Hull
  box(0, 6, 0, 16, 2, 32, { ink: BK }); 
  box(0, 6, -18, 16, 2, 4, { ink: BK }); 
  
  // Single massive boarding staircase on South
  // Rises 8m over 12.8m. Starts exactly at Z=28.8, ending perfectly flush with Z=16.
  stairs(0, 0, 28.8, '-z', 32, 12, { rise: 0.25, run: 0.4, ink: BK });
  
  cyl(0, 8, -8, 2.5, 6, { ink: OR }); 
  cyl(0, 8, 8, 2.5, 6, { ink: OR });  
  pickup(0, 8.5, 0); 
  
  box(-6, 8, 0, 2, 1.5, 4, { ink: OR });
  box(6, 8, 0, 2, 1.5, 4, { ink: OR });

  // Tier 3: The Drydock Crane
  box(0, 16, -18, 28, 2, 4, { ink: BL }); 
  box(0, 16, 18, 28, 2, 4, { ink: BL });  
  box(-12, 16, 0, 4, 2, 32, { ink: BL }); 
  box(12, 16, 0, 4, 2, 32, { ink: BL });  
  
  ring(0, 15, -18, 1.5, { ink: OR });
  ring(0, 15, 18, 1.5, { ink: OR });
  ring(0, 15, 0, 1.5, { ink: OR });

  // 4. West Flank (Lane 1: Sniper Alley & High Catwalk)
  // FIXED: slab signature is (x1, z1, x2, z2, y, depth, opts)
  slab(-40, -30, -30, 30, 6, 1.0, { ink: BL }); 
  cyl(-38, 0, -20, 1, 6, { ink: BK });
  cyl(-32, 0, -20, 1, 6, { ink: BK });
  cyl(-38, 0, 20, 1, 6, { ink: BK });
  cyl(-32, 0, 20, 1, 6, { ink: BK });
  
  // Perfectly calculated ramps for Y=6 catwalk at Z=-30 and Z=30
  stairs(-35, 0, -39.6, '+z', 24, 10, { rise: 0.25, run: 0.4, ink: BL }); 
  stairs(-35, 0, 39.6, '-z', 24, 10, { rise: 0.25, run: 0.4, ink: BL });
  
  box(-32, 7, -15, 2, 1.5, 4, { ink: OR }); 
  box(-38, 7, 0, 2, 1.5, 4, { ink: OR });
  box(-32, 7, 15, 2, 1.5, 4, { ink: OR });
  
  pickup(-35, 7.5, 0); 
  pickup(-35, 0, -15); pickup(-35, 0, 15);

  // 5. East Flank (Lane 2: The Docks)
  // FIXED: slab signature is (x1, z1, x2, z2, y, depth, opts)
  slab(30, -30, 40, 30, 2, 1.0, { ink: BL }); 
  cyl(32, 0, -20, 1, 2, { ink: BK });
  cyl(38, 0, -20, 1, 2, { ink: BK });
  cyl(32, 0, 20, 1, 2, { ink: BK });
  cyl(38, 0, 20, 1, 2, { ink: BK });
  
  // Perfectly calculated ramps for Y=2 dock
  stairs(35, 0, -33.2, '+z', 8, 10, { rise: 0.25, run: 0.4, ink: BL });
  stairs(35, 0, 33.2, '-z', 8, 10, { rise: 0.25, run: 0.4, ink: BL });
  
  box(32, 3, -20, 6, 3, 4, { ink: OR });
  box(38, 3, -10, 4, 3, 6, { ink: OR });
  box(32, 3, 0, 6, 3, 6, { ink: OR }); 
  box(38, 3, 10, 4, 3, 6, { ink: OR });
  box(32, 3, 20, 6, 3, 4, { ink: OR });
  
  pickup(35, 3.5, 0); 
  pickup(35, 0, -15); pickup(35, 0, 15);

  // 6. Sniper Nests
  const buildNest = (nx, nz, zDir, xDir) => {
    // Platform is 10x10. min = center - 5, max = center + 5
    slab(nx-5, nz-5, nx+5, nz+5, 12, 1.0, { ink: BL });
    cyl(nx-4, 0, nz-4, 1, 12, { ink: BK });
    cyl(nx+4, 0, nz+4, 1, 12, { ink: BK });
    cyl(nx-4, 0, nz+4, 1, 12, { ink: BK });
    cyl(nx+4, 0, nz-4, 1, 12, { ink: BK });
    
    // Z-axis stairs (40 steps * 0.3 run = 12m). Rise = 0.3 * 40 = 12m.
    const zEdge = zDir === '+z' ? nz - 5 : nz + 5;
    const zStart = zDir === '+z' ? zEdge - 12 : zEdge + 12;
    const xPos = nx > 0 ? nx - 2 : nx + 2; 
    stairs(xPos, 0, zStart, zDir, 40, 6, { rise: 0.3, run: 0.3, ink: BL });

    // X-axis stairs
    const xEdge = xDir === '+x' ? nx - 5 : nx + 5;
    const xStart = xDir === '+x' ? xEdge - 12 : xEdge + 12;
    const zPos = nz > 0 ? nz - 2 : nz + 2;
    stairs(xStart, 0, zPos, xDir, 40, 6, { rise: 0.3, run: 0.3, ink: BL });
    
    const snX = nx + (nx < 0 ? 3 : -3);
    const snZ = nz + (nz < 0 ? 3 : -3);
    sniper(snX, 13, snZ);
    
    box(nx + (nx < 0 ? -2 : 2), 13, nz + (nz < 0 ? -2 : 2), 4, 1.2, 4, { ink: OR }); 
    ring(nx, 20, nz, 1.5, { ink: OR });
    pickup(nx, 13.5, nz);
  };

  buildNest(-45, -45, '+z', '+x'); // NW 
  buildNest(45, -45, '+z', '-x');  // NE 
  buildNest(-45, 45, '-z', '+x');  // SW 
  buildNest(45, 45, '-z', '-x');   // SE 


  // 6.5 The Sky-Bridges (Connecting Towers to the Central Roof)
  // These bridges use an L-shape to avoid diagonal AABB collider issues.
  
  // NW Bridge
  slab(-40, -45, -14, -41, 12, 1.0, { ink: BL }); // Flat catwalk East from tower
  stairs(-12, 12, -41, '+z', 16, 4, { rise: 0.25, run: 1.375, ink: BL }); // Ramp South up to Y=16 Roof
  box(-27, 12, -43, 2, 1.5, 4, { ink: OR }); // Bridge cover

  // NE Bridge
  slab(14, -45, 40, -41, 12, 1.0, { ink: BL }); // Flat catwalk West from tower
  stairs(12, 12, -41, '+z', 16, 4, { rise: 0.25, run: 1.375, ink: BL }); // Ramp South up to Y=16 Roof
  box(27, 12, -43, 2, 1.5, 4, { ink: OR }); // Bridge cover

  // SW Bridge
  slab(-40, 41, -14, 45, 12, 1.0, { ink: BL }); // Flat catwalk East from tower
  stairs(-12, 12, 41, '-z', 16, 4, { rise: 0.25, run: 1.375, ink: BL }); // Ramp North up to Y=16 Roof
  box(-27, 12, 43, 2, 1.5, 4, { ink: OR }); // Bridge cover

  // SE Bridge
  slab(14, 41, 40, 45, 12, 1.0, { ink: BL }); // Flat catwalk West from tower
  stairs(12, 12, 41, '-z', 16, 4, { rise: 0.25, run: 1.375, ink: BL }); // Ramp North up to Y=16 Roof
  box(27, 12, 43, 2, 1.5, 4, { ink: OR }); // Bridge cover

  // 7. Grapple Anchors
  ring(-25, 18, -25, 1.5, { ink: OR });
  ring(25, 18, -25, 1.5, { ink: OR });
  ring(-25, 18, 25, 1.5, { ink: OR });
  ring(25, 18, 25, 1.5, { ink: OR });
  
  for (let i = 0; i < 40; i++) {
    box(-20 + Math.random()*40, 0, -30 + Math.random()*60, 1, 1, 1, { ink: BK });
  }

  B.finish();
  return L;
}
