const fs = require('fs');

const code = `import * as THREE from 'three';
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
  box(-20, 0, -P + 12, 15, 6, 2, { ink: BL }); // L Wall
  box(20, 0, -P + 12, 15, 6, 2, { ink: BL }); // R Wall
  spawn(-20, 0, -35); spawn(20, 0, -35); 
  
  box(-20, 0, P - 12, 15, 6, 2, { ink: BL }); // L Wall
  box(20, 0, P - 12, 15, 6, 2, { ink: BL }); // R Wall
  spawn(-20, 0, 35); spawn(20, 0, 35);

  // 3. Central Centerpiece: Suspended Ironclad Drydock
  // Tier 1: Pillars
  box(-12, 0, -18, 4, 16, 4, { ink: BL }); 
  box(12, 0, -18, 4, 16, 4, { ink: BL });  
  box(-12, 0, 18, 4, 16, 4, { ink: BL });  
  box(12, 0, 18, 4, 16, 4, { ink: BL });   
  pickup(0, 1, 0); 
  pickup(0, 0, -25); pickup(0, 0, 25); 

  // Tier 2: The Ironclad Hull (Suspended at Y=6)
  box(0, 6, 0, 16, 2, 32, { ink: BK }); 
  
  // The "Ramming Bows" (Using slabs since stairs were messed up)
  slab(-8, 6, -22, 8, 8, 4, { ink: BK }); 
  slab(-8, 6, 16, 8, 8, 4, { ink: BK });  
  
  // Ramps connecting ground to the Ironclad deck
  // Single massive boarding staircase on South
  // stairs(x, y, z, dir, steps, width, {rise, run, ink})
  // We want to go from Y=0 to Y=8 over distance of ~12
  // Let's use 32 steps. Rise = 8/32 = 0.25. Run = 12/32 = 0.375.
  stairs(0, 0, 28, '-z', 32, 12, { rise: 0.25, run: 0.375, ink: BL });
  
  // Deck Cover
  cyl(0, 8, -8, 2.5, 6, { ink: OR }); 
  cyl(0, 8, 8, 2.5, 6, { ink: OR });  
  pickup(0, 8.5, 0); 
  
  box(-6, 8, 0, 2, 1.5, 4, { ink: OR });
  box(6, 8, 0, 2, 1.5, 4, { ink: OR });

  // Tier 3: The Drydock Crane (Y=16)
  box(0, 16, -18, 28, 2, 4, { ink: BL }); 
  box(0, 16, 18, 28, 2, 4, { ink: BL });  
  box(-12, 16, 0, 4, 2, 32, { ink: BL }); 
  box(12, 16, 0, 4, 2, 32, { ink: BL });  
  
  ring(0, 15, -18, 1.5, { ink: OR });
  ring(0, 15, 18, 1.5, { ink: OR });
  ring(0, 15, 0, 1.5, { ink: OR });

  // 4. West Flank (Lane 1: Sniper Alley & High Catwalk)
  slab(-40, 6, -30, -30, 8, 60, { ink: BL }); // Hollow catwalk
  cyl(-38, 0, -20, 1, 6, { ink: BK });
  cyl(-32, 0, -20, 1, 6, { ink: BK });
  cyl(-38, 0, 20, 1, 6, { ink: BK });
  cyl(-32, 0, 20, 1, 6, { ink: BK });
  
  // Ramp from North (goes South +z)
  stairs(-35, 0, -40, '+z', 24, 10, { rise: 0.25, run: 0.4, ink: BL }); 
  // Ramp from South (goes North -z)
  stairs(-35, 0, 40, '-z', 24, 10, { rise: 0.25, run: 0.4, ink: BL });
  
  box(-32, 8, -15, 2, 1.5, 4, { ink: OR }); 
  box(-38, 8, 0, 2, 1.5, 4, { ink: OR });
  box(-32, 8, 15, 2, 1.5, 4, { ink: OR });
  
  pickup(-35, 8.5, 0); 
  pickup(-35, 0, -15); pickup(-35, 0, 15);

  // 5. East Flank (Lane 2: The Docks)
  slab(30, 2, -30, 40, 4, 60, { ink: BL }); // Hollow dock
  cyl(32, 0, -20, 1, 2, { ink: BK });
  cyl(38, 0, -20, 1, 2, { ink: BK });
  cyl(32, 0, 20, 1, 2, { ink: BK });
  cyl(38, 0, 20, 1, 2, { ink: BK });
  
  // Ramp from North
  stairs(35, 0, -38, '+z', 8, 10, { rise: 0.25, run: 1.0, ink: BL });
  // Ramp from South
  stairs(35, 0, 38, '-z', 8, 10, { rise: 0.25, run: 1.0, ink: BL });
  
  box(32, 4, -20, 6, 3, 4, { ink: OR });
  box(38, 4, -10, 4, 3, 6, { ink: OR });
  box(32, 4, 0, 6, 3, 6, { ink: OR }); 
  box(38, 4, 10, 4, 3, 6, { ink: OR });
  box(32, 4, 20, 6, 3, 4, { ink: OR });
  
  pickup(35, 4.5, 0); 
  pickup(35, 0, -15); pickup(35, 0, 15);

  // 6. Sniper Nests
  const buildNest = (nx, nz, zDir, xDir) => {
    slab(nx-5, 12, nz-5, nx+5, 13, 10, { ink: BL }); // Y=12 Platform
    cyl(nx-4, 0, nz-4, 1, 12, { ink: BK });
    cyl(nx+4, 0, nz+4, 1, 12, { ink: BK });
    cyl(nx-4, 0, nz+4, 1, 12, { ink: BK });
    cyl(nx+4, 0, nz-4, 1, 12, { ink: BK });
    
    // Z-axis stairs
    const startZ = zDir === '+z' ? nz - 15 : nz + 15;
    stairs(nx, 0, startZ, zDir, 48, 6, { rise: 0.25, run: 0.25, ink: BL });

    // X-axis stairs
    const startX = xDir === '+x' ? nx - 15 : nx + 15;
    stairs(startX, 0, nz, xDir, 48, 6, { rise: 0.25, run: 0.25, ink: BL });
    
    const snX = nx + (nx < 0 ? 3 : -3);
    const snZ = nz + (nz < 0 ? 3 : -3);
    sniper(snX, 13, snZ);
    
    box(nx + (nx < 0 ? -2 : 2), 13, nz + (nz < 0 ? -2 : 2), 4, 1.2, 4, { ink: OR }); 
    ring(nx, 20, nz, 1.5, { ink: OR });
    pickup(nx, 13.5, nz);
  };

  buildNest(-40, -40, '+z', '+x'); // NW -> goes South, goes East
  buildNest(40, -40, '+z', '-x');  // NE -> goes South, goes West
  buildNest(-40, 40, '-z', '+x');  // SW -> goes North, goes East
  buildNest(40, 40, '-z', '-x');   // SE -> goes North, goes West

  // 7. Grapple Anchors
  ring(-25, 18, -25, 1.5, { ink: OR });
  ring(25, 18, -25, 1.5, { ink: OR });
  ring(-25, 18, 25, 1.5, { ink: OR });
  ring(25, 18, 25, 1.5, { ink: OR });
  ring(-15, 17, 0, 1.5, { ink: OR });
  ring(15, 17, 0, 1.5, { ink: OR });
  
  for (let i = 0; i < 40; i++) {
    box(-20 + Math.random()*40, 0, -30 + Math.random()*60, 1, 1, 1, { ink: BK });
  }

  B.finish();
  return L;
}
`;
fs.writeFileSync('src/levels/pirate_cove.js', code);
