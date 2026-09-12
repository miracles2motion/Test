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

  // === MACRO STRUCTURE: Galleon Sterncastle at (-43, 0, -43) ===
  box(-43, 0, -43, 8.0, 2.0, 6.0, { ink: BL });
  box(-43, 0 + 2.0, -43, 7.5, 2.5, 5.5, { ink: OR });
  slab(-43 - 4.0, -43 - 3.2, -43 + 4.0, -43 + 3.2, 0 + 4.5, 0.3, { ink: OR });
  rail(-43 - 4.0, -43 - 3.2, -43 + 4.0, -43 - 3.2, 0 + 4.5, { ink: BK });
  rail(-43 - 4.0, -43 + 3.2, -43 + 4.0, -43 + 3.2, 0 + 4.5, { ink: BK });
  rail(-43 - 4.0, -43 - 3.2, -43 - 4.0, -43 + 3.2, 0 + 4.5, { ink: BK });
  box(-43, 0 + 4.8, -43, 1.0, 3.0, 0.5, { ink: BK });
  ring(-43, 0 + 9.3, -43, 'z');
  pickup(-43, 0 + 4.7, -43);

  // === MACRO STRUCTURE: Lighthouse Beacon at (-43, 0, -25) ===
  cyl(-43, 0, -25, 2.2, 5.5, { seg: 10, ink: BL });
  slab(-43 - 2.8, -25 - 2.8, -43 + 2.8, -25 + 2.8, 0 + 5.0, 0.3, { ink: OR });
  rail(-43 - 2.8, -25 - 2.8, -43 + 2.8, -25 - 2.8, 0 + 5.0, { ink: BK });
  rail(-43 - 2.8, -25 + 2.8, -43 + 2.8, -25 + 2.8, 0 + 5.0, { ink: BK });
  cyl(-43, 0 + 5.3, -25, 1.5, 1.5, { seg: 8, noCollide: true, ink: OR });
  ring(-43, 0 + 9.3, -25, 'z');
  pickup(-43, 0 + 5.2, -25);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-43, 0, -7) ===
  box(-43 - 2.5, 0, -7 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 + 2.5, 0, -7 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 - 2.5, 0, -7 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 + 2.5, 0, -7 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-43 - 3.0, -7 - 3.0, -43 + 3.0, -7 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-43, 0 + 5.9, -7 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-43, 0 + 5.9, -7 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-43, 0 + 8.3, -7 + 4.0, 'z');
  pickup(-43, 0 + 6.1, -7 - 1.5);

  // === MACRO STRUCTURE: Galleon Sterncastle at (-43, 0, 11) ===
  box(-43, 0, 11, 8.0, 2.0, 6.0, { ink: BL });
  box(-43, 0 + 2.0, 11, 7.5, 2.5, 5.5, { ink: OR });
  slab(-43 - 4.0, 11 - 3.2, -43 + 4.0, 11 + 3.2, 0 + 4.5, 0.3, { ink: OR });
  rail(-43 - 4.0, 11 - 3.2, -43 + 4.0, 11 - 3.2, 0 + 4.5, { ink: BK });
  rail(-43 - 4.0, 11 + 3.2, -43 + 4.0, 11 + 3.2, 0 + 4.5, { ink: BK });
  rail(-43 - 4.0, 11 - 3.2, -43 - 4.0, 11 + 3.2, 0 + 4.5, { ink: BK });
  box(-43, 0 + 4.8, 11, 1.0, 3.0, 0.5, { ink: BK });
  ring(-43, 0 + 9.3, 11, 'z');
  pickup(-43, 0 + 4.7, 11);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Macro: Bone Yard Platform
  box(-31, 0, -31, 8, 2.0, 8, { ink: BK }); // Raised platform
  stairs(-31-4.5, 0, -31, 1, 2.0, 2, 3, { ink: OR }); // Side stairs (West)
  stairs(-31+4.5, 0, -31, 1, 2.0, 2, 1, { ink: OR }); // Side stairs (East)
  cyl(-31-2, 0+2.0, -31-2, 0.5, 2.0, { seg:6, ink: OR }); // Spike
  cyl(-31+2, 0+2.0, -31-2, 0.5, 3.0, { seg:6, ink: OR }); // Spike
  cyl(-31-2, 0+2.0, -31+2, 0.5, 1.5, { seg:6, ink: OR }); // Spike
  cyl(-31+2, 0+2.0, -31+2, 0.5, 2.5, { seg:6, ink: OR }); // Spike

  // Macro: Bone Yard Platform
  box(-31, 0, -15, 8, 2.0, 8, { ink: BK }); // Raised platform
  stairs(-31-4.5, 0, -15, 1, 2.0, 2, 3, { ink: OR }); // Side stairs (West)
  stairs(-31+4.5, 0, -15, 1, 2.0, 2, 1, { ink: OR }); // Side stairs (East)
  cyl(-31-2, 0+2.0, -15-2, 0.5, 2.0, { seg:6, ink: OR }); // Spike
  cyl(-31+2, 0+2.0, -15-2, 0.5, 3.0, { seg:6, ink: OR }); // Spike
  cyl(-31-2, 0+2.0, -15+2, 0.5, 1.5, { seg:6, ink: OR }); // Spike
  cyl(-31+2, 0+2.0, -15+2, 0.5, 2.5, { seg:6, ink: OR }); // Spike

  // Macro: Bazaar Plaza with Tents
  box(-31, 0, 1, 10, 0.2, 10, { ink: BL }); // Rug/Plaza
  // Tent 1 (NW)
  box(-31-3, 0+0.2, 1-3, 3, 2, 3, { ink: OR });
  box(-31-3, 0+2.2, 1-3, 3.2, 0.2, 3.2, { ink: RD });
  // Tent 2 (NE)
  box(-31+3, 0+0.2, 1-3, 3, 2, 3, { ink: OR });
  box(-31+3, 0+2.2, 1-3, 3.2, 0.2, 3.2, { ink: OR });
  // Tent 3 (SW)
  box(-31-3, 0+0.2, 1+3, 3, 2, 3, { ink: OR });
  box(-31-3, 0+2.2, 1+3, 3.2, 0.2, 3.2, { ink: BL });
  // Center Gold
  cyl(-31, 0+0.2, 1, 1.5, 1.0, { seg:8, ink: OR });
  ring(-31, 0+4, 1, 1, { ink: OR }); // Grapple
  box(-31-2, 0+0.2, 1-2, 1, 1, 1, { ink: BK }); // Cover
  box(-31+2, 0+0.2, 1+2, 1, 1, 1, { ink: BK }); // Cover

  // Macro: Bazaar Plaza with Tents
  box(-31, 0, 17, 10, 0.2, 10, { ink: BL }); // Rug/Plaza
  // Tent 1 (NW)
  box(-31-3, 0+0.2, 17-3, 3, 2, 3, { ink: OR });
  box(-31-3, 0+2.2, 17-3, 3.2, 0.2, 3.2, { ink: RD });
  // Tent 2 (NE)
  box(-31+3, 0+0.2, 17-3, 3, 2, 3, { ink: OR });
  box(-31+3, 0+2.2, 17-3, 3.2, 0.2, 3.2, { ink: OR });
  // Tent 3 (SW)
  box(-31-3, 0+0.2, 17+3, 3, 2, 3, { ink: OR });
  box(-31-3, 0+2.2, 17+3, 3.2, 0.2, 3.2, { ink: BL });
  // Center Gold
  cyl(-31, 0+0.2, 17, 1.5, 1.0, { seg:8, ink: OR });
  ring(-31, 0+4, 17, 1, { ink: OR }); // Grapple
  box(-31-2, 0+0.2, 17-2, 1, 1, 1, { ink: BK }); // Cover
  box(-31+2, 0+0.2, 17+2, 1, 1, 1, { ink: BK }); // Cover

  // Macro: Bazaar Plaza with Tents
  box(-31, 0, 33, 10, 0.2, 10, { ink: BL }); // Rug/Plaza
  // Tent 1 (NW)
  box(-31-3, 0+0.2, 33-3, 3, 2, 3, { ink: OR });
  box(-31-3, 0+2.2, 33-3, 3.2, 0.2, 3.2, { ink: RD });
  // Tent 2 (NE)
  box(-31+3, 0+0.2, 33-3, 3, 2, 3, { ink: OR });
  box(-31+3, 0+2.2, 33-3, 3.2, 0.2, 3.2, { ink: OR });
  // Tent 3 (SW)
  box(-31-3, 0+0.2, 33+3, 3, 2, 3, { ink: OR });
  box(-31-3, 0+2.2, 33+3, 3.2, 0.2, 3.2, { ink: BL });
  // Center Gold
  cyl(-31, 0+0.2, 33, 1.5, 1.0, { seg:8, ink: OR });
  ring(-31, 0+4, 33, 1, { ink: OR }); // Grapple
  box(-31-2, 0+0.2, 33-2, 1, 1, 1, { ink: BK }); // Cover
  box(-31+2, 0+0.2, 33+2, 1, 1, 1, { ink: BK }); // Cover

  // Macro: Bone Yard Platform
  box(-15, 0, -31, 8, 2.0, 8, { ink: BK }); // Raised platform
  stairs(-15-4.5, 0, -31, 1, 2.0, 2, 3, { ink: OR }); // Side stairs (West)
  stairs(-15+4.5, 0, -31, 1, 2.0, 2, 1, { ink: OR }); // Side stairs (East)
  cyl(-15-2, 0+2.0, -31-2, 0.5, 2.0, { seg:6, ink: OR }); // Spike
  cyl(-15+2, 0+2.0, -31-2, 0.5, 3.0, { seg:6, ink: OR }); // Spike
  cyl(-15-2, 0+2.0, -31+2, 0.5, 1.5, { seg:6, ink: OR }); // Spike
  cyl(-15+2, 0+2.0, -31+2, 0.5, 2.5, { seg:6, ink: OR }); // Spike

  // Macro: Bazaar Plaza with Tents
  box(-15, 0, 33, 10, 0.2, 10, { ink: BL }); // Rug/Plaza
  // Tent 1 (NW)
  box(-15-3, 0+0.2, 33-3, 3, 2, 3, { ink: OR });
  box(-15-3, 0+2.2, 33-3, 3.2, 0.2, 3.2, { ink: RD });
  // Tent 2 (NE)
  box(-15+3, 0+0.2, 33-3, 3, 2, 3, { ink: OR });
  box(-15+3, 0+2.2, 33-3, 3.2, 0.2, 3.2, { ink: OR });
  // Tent 3 (SW)
  box(-15-3, 0+0.2, 33+3, 3, 2, 3, { ink: OR });
  box(-15-3, 0+2.2, 33+3, 3.2, 0.2, 3.2, { ink: BL });
  // Center Gold
  cyl(-15, 0+0.2, 33, 1.5, 1.0, { seg:8, ink: OR });
  ring(-15, 0+4, 33, 1, { ink: OR }); // Grapple
  box(-15-2, 0+0.2, 33-2, 1, 1, 1, { ink: BK }); // Cover
  box(-15+2, 0+0.2, 33+2, 1, 1, 1, { ink: BK }); // Cover

  // Macro: Dry Dock & Scaffolding
  box(1-4, 0, -31, 2, 4.0, 10, { ink: OR }); // Scaffolding L
  box(1+4, 0, -31, 2, 4.0, 10, { ink: OR }); // Scaffolding R
  box(1, 0, -31-4, 10, 4.0, 2, { ink: OR }); // Scaffolding Back
  stairs(1, 0, -31-5.5, 2, 4.0, 2, 2, { ink: BL }); // Back stairs up
  // Ship hull in middle
  box(1, 0, -31+1, 4, 2.5, 8, { ink: BK });
  box(1, 0+2.5, -31-2, 4, 1.0, 2, { ink: BK }); // Stern
  // Crane on left scaffolding
  cyl(1-4, 0+4, -31, 0.5, 4, { seg:8, ink: BK });
  box(1-1.5, 0+7.5, -31, 5, 0.5, 0.5, { ink: BK });
  ring(1-4, 0+7, -31, 1, { ink: OR }); // Grapple

  // Macro: Stone Keep & Walls
  box(1-5, 0, 33, 2, 3, 12, { ink: BL }); // West wall
  box(1+5, 0, 33, 2, 3, 12, { ink: BL }); // East wall
  box(1, 0, 33-5, 12, 3, 2, { ink: BL }); // North wall
  box(1-3.5, 0, 33+5, 5, 3, 2, { ink: BL }); // South wall L
  box(1+3.5, 0, 33+5, 5, 3, 2, { ink: BL }); // South wall R (3m door gap)
  // Inner Watchtower
  box(1, 0, 33-1, 4, 6, 4, { ink: BK });
  stairs(1, 0, 33+2.5, 2, 6, 4, 0, { ink: OR }); // Huge stairs leading to tower
  ring(1, 0+8, 33-1, 1, { ink: OR }); // Grapple
  box(1-3, 0, 33, 1, 1, 1, { ink: OR }); // Cover
  box(1+3, 0, 33, 1, 1, 1, { ink: OR }); // Cover

  // Macro: Dry Dock & Scaffolding
  box(17-4, 0, -31, 2, 4.0, 10, { ink: OR }); // Scaffolding L
  box(17+4, 0, -31, 2, 4.0, 10, { ink: OR }); // Scaffolding R
  box(17, 0, -31-4, 10, 4.0, 2, { ink: OR }); // Scaffolding Back
  stairs(17, 0, -31-5.5, 2, 4.0, 2, 2, { ink: BL }); // Back stairs up
  // Ship hull in middle
  box(17, 0, -31+1, 4, 2.5, 8, { ink: BK });
  box(17, 0+2.5, -31-2, 4, 1.0, 2, { ink: BK }); // Stern
  // Crane on left scaffolding
  cyl(17-4, 0+4, -31, 0.5, 4, { seg:8, ink: BK });
  box(17-1.5, 0+7.5, -31, 5, 0.5, 0.5, { ink: BK });
  ring(17-4, 0+7, -31, 1, { ink: OR }); // Grapple

  // Macro: Stone Keep & Walls
  box(17-5, 0, 33, 2, 3, 12, { ink: BL }); // West wall
  box(17+5, 0, 33, 2, 3, 12, { ink: BL }); // East wall
  box(17, 0, 33-5, 12, 3, 2, { ink: BL }); // North wall
  box(17-3.5, 0, 33+5, 5, 3, 2, { ink: BL }); // South wall L
  box(17+3.5, 0, 33+5, 5, 3, 2, { ink: BL }); // South wall R (3m door gap)
  // Inner Watchtower
  box(17, 0, 33-1, 4, 6, 4, { ink: BK });
  stairs(17, 0, 33+2.5, 2, 6, 4, 0, { ink: OR }); // Huge stairs leading to tower
  ring(17, 0+8, 33-1, 1, { ink: OR }); // Grapple
  box(17-3, 0, 33, 1, 1, 1, { ink: OR }); // Cover
  box(17+3, 0, 33, 1, 1, 1, { ink: OR }); // Cover

  // Macro: Dry Dock & Scaffolding
  box(33-4, 0, -31, 2, 4.0, 10, { ink: OR }); // Scaffolding L
  box(33+4, 0, -31, 2, 4.0, 10, { ink: OR }); // Scaffolding R
  box(33, 0, -31-4, 10, 4.0, 2, { ink: OR }); // Scaffolding Back
  stairs(33, 0, -31-5.5, 2, 4.0, 2, 2, { ink: BL }); // Back stairs up
  // Ship hull in middle
  box(33, 0, -31+1, 4, 2.5, 8, { ink: BK });
  box(33, 0+2.5, -31-2, 4, 1.0, 2, { ink: BK }); // Stern
  // Crane on left scaffolding
  cyl(33-4, 0+4, -31, 0.5, 4, { seg:8, ink: BK });
  box(33-1.5, 0+7.5, -31, 5, 0.5, 0.5, { ink: BK });
  ring(33-4, 0+7, -31, 1, { ink: OR }); // Grapple

  // Macro: Dry Dock & Scaffolding
  box(33-4, 0, -15, 2, 4.0, 10, { ink: OR }); // Scaffolding L
  box(33+4, 0, -15, 2, 4.0, 10, { ink: OR }); // Scaffolding R
  box(33, 0, -15-4, 10, 4.0, 2, { ink: OR }); // Scaffolding Back
  stairs(33, 0, -15-5.5, 2, 4.0, 2, 2, { ink: BL }); // Back stairs up
  // Ship hull in middle
  box(33, 0, -15+1, 4, 2.5, 8, { ink: BK });
  box(33, 0+2.5, -15-2, 4, 1.0, 2, { ink: BK }); // Stern
  // Crane on left scaffolding
  cyl(33-4, 0+4, -15, 0.5, 4, { seg:8, ink: BK });
  box(33-1.5, 0+7.5, -15, 5, 0.5, 0.5, { ink: BK });
  ring(33-4, 0+7, -15, 1, { ink: OR }); // Grapple

  // Macro: Stone Keep & Walls
  box(33-5, 0, 1, 2, 3, 12, { ink: BL }); // West wall
  box(33+5, 0, 1, 2, 3, 12, { ink: BL }); // East wall
  box(33, 0, 1-5, 12, 3, 2, { ink: BL }); // North wall
  box(33-3.5, 0, 1+5, 5, 3, 2, { ink: BL }); // South wall L
  box(33+3.5, 0, 1+5, 5, 3, 2, { ink: BL }); // South wall R (3m door gap)
  // Inner Watchtower
  box(33, 0, 1-1, 4, 6, 4, { ink: BK });
  stairs(33, 0, 1+2.5, 2, 6, 4, 0, { ink: OR }); // Huge stairs leading to tower
  ring(33, 0+8, 1-1, 1, { ink: OR }); // Grapple
  box(33-3, 0, 1, 1, 1, 1, { ink: OR }); // Cover
  box(33+3, 0, 1, 1, 1, 1, { ink: OR }); // Cover

  // Macro: Stone Keep & Walls
  box(33-5, 0, 17, 2, 3, 12, { ink: BL }); // West wall
  box(33+5, 0, 17, 2, 3, 12, { ink: BL }); // East wall
  box(33, 0, 17-5, 12, 3, 2, { ink: BL }); // North wall
  box(33-3.5, 0, 17+5, 5, 3, 2, { ink: BL }); // South wall L
  box(33+3.5, 0, 17+5, 5, 3, 2, { ink: BL }); // South wall R (3m door gap)
  // Inner Watchtower
  box(33, 0, 17-1, 4, 6, 4, { ink: BK });
  stairs(33, 0, 17+2.5, 2, 6, 4, 0, { ink: OR }); // Huge stairs leading to tower
  ring(33, 0+8, 17-1, 1, { ink: OR }); // Grapple
  box(33-3, 0, 17, 1, 1, 1, { ink: OR }); // Cover
  box(33+3, 0, 17, 1, 1, 1, { ink: OR }); // Cover

  // Macro: Stone Keep & Walls
  box(33-5, 0, 33, 2, 3, 12, { ink: BL }); // West wall
  box(33+5, 0, 33, 2, 3, 12, { ink: BL }); // East wall
  box(33, 0, 33-5, 12, 3, 2, { ink: BL }); // North wall
  box(33-3.5, 0, 33+5, 5, 3, 2, { ink: BL }); // South wall L
  box(33+3.5, 0, 33+5, 5, 3, 2, { ink: BL }); // South wall R (3m door gap)
  // Inner Watchtower
  box(33, 0, 33-1, 4, 6, 4, { ink: BK });
  stairs(33, 0, 33+2.5, 2, 6, 4, 0, { ink: OR }); // Huge stairs leading to tower
  ring(33, 0+8, 33-1, 1, { ink: OR }); // Grapple
  box(33-3, 0, 33, 1, 1, 1, { ink: OR }); // Cover
  box(33+3, 0, 33, 1, 1, 1, { ink: OR }); // Cover
  box(21.9406635510242, 0, 11.243232430801953, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-4.296964159395827, 0, -25.808908075174386, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(33.68184527829001, 0, -25.156050162909978, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(24.132342579270983, 0, -38.48946163843236, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(48.79893637332766, 0, 39.76050554804061, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-11.18967874833902, 0, 39.704963379317206, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(24.889040018540015, 0, -3.744474880670623, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(19.25687102166735, 0, -46.59880447716118, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(26.842755708738295, 0, -45.723773067221664, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-45.38742065174877, 0, 29.388760059652185, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-19.205600544176612, 0, -41.746517506727365, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(0.341683416858686, 0, 36.294107671483786, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(9.216930064940215, 0, -50.44600099442701, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-11.951011635800931, 0, 42.37587812226717, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(13.548587347359756, 0, 49.97626247312695, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-18.038670082338484, 0, 39.530528005548916, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(14.457056410883311, 0, -28.322209197565794, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(13.47495342798922, 0, 32.25143311228838, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(37.49138192177358, 0, -20.704578646329118, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(48.082270781105024, 0, 45.636873460208605, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-10.263070710279145, 0, 35.42775069463295, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-29.737672250198045, 0, 27.454503689465753, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(27.690279198256448, 0, -22.353951908932927, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-18.19990569773516, 0, 4.754500884254057, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(46.841421392182724, 0, 43.83009851358979, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-34.21913558119576, 0, -17.033742543971037, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-4.711992444090228, 0, -16.653649803757546, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-23.632912241628027, 0, 22.01198578259104, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(48.46774557896961, 0, 42.61840984489672, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-21.72178141646436, 0, -2.3251114565487967, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(49.326057997768075, 0, -46.138447838023396, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-13.771154907636287, 0, -6.804580036669456, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-29.878032289150745, 0, 20.675511065825688, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(39.48896024598987, 0, -8.573306144473989, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(3.170167309837815, 0, -13.613066693578254, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(10.754940618655382, 0, -47.05525413975641, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-12.082554165135925, 0, 28.028463574575795, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-4.9298951495146355, 0, -39.40573779122431, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(14.48801018156368, 0, 9.872580338806287, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(3.977998507083157, 0, 24.586020686256774, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(48.89820614346763, 0, -40.01723937878878, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-43.144126396048264, 0, 3.7208159485525627, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(6.558794050265803, 0, 35.87173120224523, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-46.54659459657492, 0, -12.284873681036643, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(9.48604714659784, 0, -33.01476375883967, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(6.469901578341506, 0, 16.347127110017354, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(44.82216752455173, 0, 22.725968090575634, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-22.814624357759094, 0, -12.737365103686976, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(34.253244313818996, 0, -34.20311955301305, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(24.54067127994564, 0, -22.45672110822172, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(31.46843619515802, 0, 38.21032748888929, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(38.08299261998803, 0, 47.13736561121294, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(27.894727670220732, 0, 23.680774722862424, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(18.75295694718713, 0, -45.85100480615992, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-28.076520548015772, 0, -37.39087684968254, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(29.111741576968384, 0, -25.384145128389875, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-33.786504459946826, 0, 42.27089586679483, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(26.236618441191936, 0, -36.803512529745355, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-13.92562553140749, 0, -20.720997460339014, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-33.87687392432741, 0, -29.24910311044135, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(33.7463980134565, 0, -6.494125440908093, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(27.830533317876018, 0, 35.85134776388668, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(29.721212645560144, 0, -31.977203442009, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-48.524986521913945, 0, -20.04444165858248, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-16.16178610425076, 0, 13.7411038776076, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-45.98438425226072, 0, 45.403301752848975, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(39.241155746249774, 0, 42.51689456659712, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-13.129667483952595, 0, 31.011164289687798, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-27.78284019522988, 0, 26.94424768720735, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-17.97374700702038, 0, -32.27331618421506, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-24.40566583615878, 0, -36.66452903140218, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(28.530986716099704, 0, -11.353852714394904, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(27.989947102966838, 0, -11.366003390409993, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-7.291668950465734, 0, -17.402889684331107, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-9.486113184288321, 0, -19.104067459194653, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-43.78477168508141, 0, 36.517990547107175, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-20.700917777633137, 0, 21.17236593031869, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-13.937075235045043, 0, -8.891552996120346, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(6.33160592160295, 0, -45.562913044323224, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(3.598083043179635, 0, 49.80500666803415, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(11.267611613128508, 0, 25.42547829872197, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(12.795811243085211, 0, 20.29969545999984, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-24.31830280554598, 0, 20.150889205245136, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-32.82398060286074, 0, 11.502677598551855, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-38.73979325341909, 0, -1.4223987982878086, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(36.345352628988636, 0, 28.055631802166545, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(-8.39095088587095, 0, 30.727041464338228, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  box(22.333391942846546, 0, 49.70849613712045, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover
  // === END DREAM AUTO-INJECTED PROPS ===
  B.finish();
  return L;
}
