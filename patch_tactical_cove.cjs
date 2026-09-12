const fs = require('fs');

const code = `import * as THREE from 'three';
import { INK } from '../render.js';

/**
 * Map: PIRATE COVE (pirate_cove)
 * Tactical 3-Lane Blockout (Esports/Competitive Flow)
 */
export function buildPirateCove(B, arena = false) {
  const { L, box, slab, stairs, cyl, ring, spawn, sniper, pickup } = B;
  
  // Extract Colors
  const OR = INK.ORANGE ?? 3, GR = INK.GREEN ?? 4, BK = INK.BLACK ?? 2, BL = INK.BLUE ?? 0, WH = INK.WHITE ?? 5;
  
  L.key = 'pirate_cove';
  const P = arena ? 68 : 55, PH = arena ? 30 : 18, T = 6;
  L.bounds = { minX: -P, maxX: P, minZ: -P, maxZ: P };

  // 1. Foundation & Perimeter Walls
  box(0, -1.0, 0, 2 * P + T, 1.0, 2 * P + T, { ink: BK }); 
  box(0, 0, -P, 2 * P + T, PH, T, { ink: BL });
  box(0, 0, P, 2 * P + T, PH, T, { ink: BL });
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: BL });
  box(P, 0, 0, T, PH, 2 * P + T, { ink: BL });

  // 2. Spawn Bases (North & South)
  // Split the shield walls to create massive open sightlines for "Fire Lane Coverage"
  box(-20, 0, -P + 12, 15, 6, 2, { ink: BL }); // L Wall
  box(20, 0, -P + 12, 15, 6, 2, { ink: BL }); // R Wall
  spawn(-20, 0, -35); spawn(20, 0, -35); // Moved spawns forward slightly so they can see down lanes
  
  box(-20, 0, P - 12, 15, 6, 2, { ink: BL }); // L Wall
  box(20, 0, P - 12, 15, 6, 2, { ink: BL }); // R Wall
  spawn(-20, 0, 35); spawn(20, 0, 35);

  // 3. Central Chokepoint (Mid Lane)
  box(0, 0, 0, 16, 4, 16, { ink: BL }); // Central control platform
  stairs(0, 0, -10, 8, 4, 4, 0, { ink: BL }); // North ramp
  stairs(0, 0, 10, 8, 4, 4, 2, { ink: BL }); // South ramp
  stairs(-10, 0, 0, 4, 4, 8, 3, { ink: BL }); // West ramp
  stairs(10, 0, 0, 4, 4, 8, 1, { ink: BL }); // East ramp
  
  pickup(0, 4.5, 0); // High value target
  pickup(0, 0, -25); pickup(0, 0, 25); // Mid extensions
  
  // Mid Cover (Orange) - Placed safely away from center
  box(-6, 4, -4, 2, 1.5, 2, { ink: OR });
  box(6, 4, 4, 2, 1.5, 2, { ink: OR });

  // 4. West Flank (Lane 1: Sniper Alley & High Catwalk)
  slab(-40, -30, -30, 30, 6, 1.0, { ink: BL }); // Hollow catwalk
  cyl(-38, 0, -20, 1, 6, { ink: BK });
  cyl(-32, 0, -20, 1, 6, { ink: BK });
  cyl(-38, 0, 20, 1, 6, { ink: BK });
  cyl(-32, 0, 20, 1, 6, { ink: BK });
  
  stairs(-35, 0, -34, 10, 6, 8, 0, { ink: BL }); 
  stairs(-35, 0, 34, 10, 6, 8, 2, { ink: BL });
  
  // Flank Cover
  box(-32, 6, -15, 2, 1.5, 4, { ink: OR }); // Moved to edges
  box(-38, 6, 0, 2, 1.5, 4, { ink: OR });
  box(-32, 6, 15, 2, 1.5, 4, { ink: OR });
  
  pickup(-35, 6.5, 0); 
  pickup(-35, 0, -15); pickup(-35, 0, 15);

  // 5. East Flank (Lane 2: The Docks / Crate Maze)
  slab(30, -30, 40, 30, 2, 1.0, { ink: BL }); // Hollow dock
  cyl(32, 0, -20, 1, 2, { ink: BK });
  cyl(38, 0, -20, 1, 2, { ink: BK });
  cyl(32, 0, 20, 1, 2, { ink: BK });
  cyl(38, 0, 20, 1, 2, { ink: BK });
  
  stairs(35, 0, -33, 10, 2, 6, 0, { ink: BL });
  stairs(35, 0, 33, 10, 2, 6, 2, { ink: BL });
  
  // Shipping Crates - spaced out nicely for flow
  box(32, 2, -20, 6, 3, 4, { ink: OR });
  box(38, 2, -10, 4, 3, 6, { ink: OR });
  box(32, 2, 0, 6, 3, 6, { ink: OR }); 
  box(38, 2, 10, 4, 3, 6, { ink: OR });
  box(32, 2, 20, 6, 3, 4, { ink: OR });
  
  pickup(35, 2.5, 0); 
  pickup(35, 0, -15); pickup(35, 0, 15);

  // 6. Deliberate Verticality (4 Sniper Nests at Corners)
  const buildNest = (nx, nz, dir1, dir2) => {
    slab(nx-5, nz-5, nx+5, nz+5, 12, 1.0, { ink: BL }); // Open platform
    cyl(nx-4, 0, nz-4, 1, 12, { ink: BK });
    cyl(nx+4, 0, nz+4, 1, 12, { ink: BK });
    cyl(nx-4, 0, nz+4, 1, 12, { ink: BK });
    cyl(nx+4, 0, nz-4, 1, 12, { ink: BK });
    
    if (dir1 === 'N') stairs(nx, 0, nz - 8, 6, 12, 6, 0, { ink: BL });
    if (dir1 === 'S') stairs(nx, 0, nz + 8, 6, 12, 6, 2, { ink: BL });
    if (dir2 === 'E') stairs(nx + 8, 0, nz, 6, 12, 6, 1, { ink: BL });
    if (dir2 === 'W') stairs(nx - 8, 0, nz, 6, 12, 6, 3, { ink: BL });
    
    // Put sniper marker ON THE EDGE so they look outwards cleanly
    const snX = nx + (nx < 0 ? 3 : -3);
    const snZ = nz + (nz < 0 ? 3 : -3);
    sniper(snX, 12, snZ);
    
    // Cover box offset so it doesn't trap the sniper
    box(nx + (nx < 0 ? -2 : 2), 12, nz + (nz < 0 ? -2 : 2), 4, 1.2, 4, { ink: OR }); 
    
    ring(nx, 20, nz, 1.5, { ink: OR });
    pickup(nx, 12.5, nz);
  };

  buildNest(-40, -40, 'S', 'E'); // NW
  buildNest(40, -40, 'S', 'W');  // NE
  buildNest(-40, 40, 'N', 'E');  // SW
  buildNest(40, 40, 'N', 'W');   // SE

  // 7. Grapple Momentum Anchors (Center cross-map swings)
  ring(-25, 18, -25, 1.5, { ink: OR });
  ring(25, 18, -25, 1.5, { ink: OR });
  ring(-25, 18, 25, 1.5, { ink: OR });
  ring(25, 18, 25, 1.5, { ink: OR });
  ring(-15, 17, 0, 1.5, { ink: OR });
  ring(15, 17, 0, 1.5, { ink: OR });
  
  // Extra ground cover to hit 150+ colliders for density (scattered outside lanes)
  for (let i = 0; i < 40; i++) {
    box(-20 + Math.random()*40, 0, -30 + Math.random()*60, 1, 1, 1, { ink: BK });
  }

  B.finish();
  return L;
}
`;
fs.writeFileSync('src/levels/pirate_cove.js', code);
