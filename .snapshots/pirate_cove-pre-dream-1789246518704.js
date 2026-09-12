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

  // === MACRO STRUCTURE: Galleon Sterncastle at (-25, 0, -43) ===
  box(-25, 0, -43, 8.0, 2.0, 6.0, { ink: BL });
  box(-25, 0 + 2.0, -43, 7.5, 2.5, 5.5, { ink: OR });
  slab(-25 - 4.0, -43 - 3.2, -25 + 4.0, -43 + 3.2, 0 + 4.5, 0.3, { ink: OR });
  rail(-25 - 4.0, -43 - 3.2, -25 + 4.0, -43 - 3.2, 0 + 4.5, { ink: BK });
  rail(-25 - 4.0, -43 + 3.2, -25 + 4.0, -43 + 3.2, 0 + 4.5, { ink: BK });
  rail(-25 - 4.0, -43 - 3.2, -25 - 4.0, -43 + 3.2, 0 + 4.5, { ink: BK });
  box(-25, 0 + 4.8, -43, 1.0, 3.0, 0.5, { ink: BK });
  ring(-25, 0 + 9.3, -43, 'z');
  pickup(-25, 0 + 4.7, -43);

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

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-25, 0, 5) ===
  box(-25 - 2.5, 0, 5 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, 5 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 - 2.5, 0, 5 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, 5 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-25 - 3.0, 5 - 3.0, -25 + 3.0, 5 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-25, 0 + 5.9, 5 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-25, 0 + 5.9, 5 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-25, 0 + 8.3, 5 + 4.0, 'z');
  pickup(-25, 0 + 6.1, 5 - 1.5);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Prop: Dark Altar
  box(-19, 0, -31, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-19, 0 + 1.0, -31, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-47, 0, -31, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-47, 0 + 1.0, -31, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-47, 0, -39, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-47, 0 + 1.0, -39, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-15, 0, -19, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-15, 0 + 1.0, -19, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Bone Spike
  cyl(-11, 0, -27, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-11, 0 + 1.5, -27, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-11, 0 + 3.0, -27, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Bone Spike
  cyl(-3, 0, -35, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-3, 0 + 1.5, -35, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-3, 0 + 3.0, -35, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Dark Altar
  box(-15, 0, -23, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-15, 0 + 1.0, -23, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-11, 0, -43, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-11, 0 + 1.0, -43, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Bone Spike
  cyl(-3, 0, -31, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-3, 0 + 1.5, -31, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-3, 0 + 3.0, -31, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Dark Altar
  box(-15, 0, -15, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-15, 0 + 1.0, -15, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Shipyard Crane
  box(1, 0, -35, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(1, 0 + 8.0, -35 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(1, 0 + 4.0, -35 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(29-1.2, 0, -27-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29+1.2, 0, -27-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29-1.2, 0, -27+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29+1.2, 0, -27+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(29, 0 + 2.0, -27, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(13, 0, -31, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(13, 0 + 8.0, -31 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(13, 0 + 4.0, -31 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(41, 0, -47, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(41, 0 + 8.0, -47 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(41, 0 + 4.0, -47 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(29-1.2, 0, -15-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29+1.2, 0, -15-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29-1.2, 0, -15+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29+1.2, 0, -15+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(29, 0 + 2.0, -15, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(33-1.2, 0, -47-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33+1.2, 0, -47-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33-1.2, 0, -47+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33+1.2, 0, -47+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(33, 0 + 2.0, -47, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Massive Gold Pile
  cyl(-47, 0, 9, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-47, 0 + 0.6, 9, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-47, 0 + 1.1, 9, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Goods Stall
  box(-47, 0, 25, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-47, 0 + 1.5, 25, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-31, 0, 25, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-31, 0 + 1.5, 25, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-7, 0, 25, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-7, 0 + 0.6, 25, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-7, 0 + 1.1, 25, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-43, 0, 49, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-43, 0 + 0.6, 49, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-43, 0 + 1.1, 49, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-15, 0, 25, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-15, 0 + 0.6, 25, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-15, 0 + 1.1, 25, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-35, 0, 5, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-35, 0 + 0.6, 5, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-35, 0 + 1.1, 5, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-39, 0, 37, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-39, 0 + 0.6, 37, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-39, 0 + 1.1, 37, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-19, 0, 41, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-19, 0 + 0.6, 41, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-19, 0 + 1.1, 41, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Merchant Tent
  cyl(-39-1.8, 0, 9-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-39+1.8, 0, 9-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-39-1.8, 0, 9+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-39+1.8, 0, 9+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-39, 0 + 2.0, 9, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-39, 0 + 2.2, 9, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Massive Gold Pile
  cyl(-35, 0, 1, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-35, 0 + 0.6, 1, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-35, 0 + 1.1, 1, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-27, 0, 41, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-27, 0 + 0.6, 41, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-27, 0 + 1.1, 41, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-23, 0, 29, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-23, 0 + 0.6, 29, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-23, 0 + 1.1, 29, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Goods Stall
  box(-39, 0, 13, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-39, 0 + 1.5, 13, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-31, 0, 1, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-31, 0 + 1.5, 1, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Merchant Tent
  cyl(-15-1.8, 0, 29-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-15+1.8, 0, 29-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-15-1.8, 0, 29+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-15+1.8, 0, 29+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-15, 0 + 2.0, 29, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-15, 0 + 2.2, 29, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Massive Gold Pile
  cyl(-15, 0, 21, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-15, 0 + 0.6, 21, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-15, 0 + 1.1, 21, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Stone Watchtower
  box(13, 0, 29, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(13, 0 + 9.0, 29, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Cannon Battery Wall
  box(21, 0, 5, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(21 - 1.5, 0 + 1.4, 5 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(21 + 1.5, 0 + 1.4, 5 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(21, 0, 33, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(21, 0 + 2.0, 33, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(21, 0 + 1.0, 33, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(17, 0, 5, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(17, 0 + 9.0, 5, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Cannon Battery Wall
  box(5, 0, 25, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(5 - 1.5, 0 + 1.4, 25 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(5 + 1.5, 0 + 1.4, 25 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(29, 0, 49, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(29, 0 + 2.0, 49, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(29, 0 + 1.0, 49, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(33, 0, 37, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(33, 0 + 2.0, 37, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(33, 0 + 1.0, 37, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(5, 0, 29, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(5, 0 + 9.0, 29, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Stone Watchtower
  box(9, 0, 29, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(9, 0 + 9.0, 29, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(37, 0, 45, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(37, 0 + 2.0, 45, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(37, 0 + 1.0, 45, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(9, 0, 33, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(9, 0 + 2.0, 33, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(9, 0 + 1.0, 33, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(25, 0, 5, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(25, 0 + 2.0, 5, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(25, 0 + 1.0, 5, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(33, 0, 45, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(33, 0 + 9.0, 45, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Cannon Battery Wall
  box(29, 0, 33, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(29 - 1.5, 0 + 1.4, 33 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(29 + 1.5, 0 + 1.4, 33 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(41, 0, 5, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(41, 0 + 2.0, 5, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(41, 0 + 1.0, 5, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(41, 0, 9, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(41, 0 + 9.0, 9, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(17, 0, 29, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(17, 0 + 2.0, 29, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(17, 0 + 1.0, 29, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars
  // === END DREAM AUTO-INJECTED PROPS ===

  B.finish();
  return L;
}
