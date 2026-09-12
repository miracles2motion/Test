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

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-43, 0, -25) ===
  box(-43 - 2.5, 0, -25 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 + 2.5, 0, -25 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 - 2.5, 0, -25 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 + 2.5, 0, -25 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-43 - 3.0, -25 - 3.0, -43 + 3.0, -25 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-43, 0 + 5.9, -25 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-43, 0 + 5.9, -25 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-43, 0 + 8.3, -25 + 4.0, 'z');
  pickup(-43, 0 + 6.1, -25 - 1.5);

  // === MACRO STRUCTURE: Galleon Sterncastle at (-43, 0, -7) ===
  box(-43, 0, -7, 8.0, 2.0, 6.0, { ink: BL });
  box(-43, 0 + 2.0, -7, 7.5, 2.5, 5.5, { ink: OR });
  slab(-43 - 4.0, -7 - 3.2, -43 + 4.0, -7 + 3.2, 0 + 4.5, 0.3, { ink: OR });
  rail(-43 - 4.0, -7 - 3.2, -43 + 4.0, -7 - 3.2, 0 + 4.5, { ink: BK });
  rail(-43 - 4.0, -7 + 3.2, -43 + 4.0, -7 + 3.2, 0 + 4.5, { ink: BK });
  rail(-43 - 4.0, -7 - 3.2, -43 - 4.0, -7 + 3.2, 0 + 4.5, { ink: BK });
  box(-43, 0 + 4.8, -7, 1.0, 3.0, 0.5, { ink: BK });
  ring(-43, 0 + 9.3, -7, 'z');
  pickup(-43, 0 + 4.7, -7);

  // === MACRO STRUCTURE: Lighthouse Beacon at (-37, 0, -43) ===
  cyl(-37, 0, -43, 2.2, 5.5, { seg: 10, ink: BL });
  slab(-37 - 2.8, -43 - 2.8, -37 + 2.8, -43 + 2.8, 0 + 5.0, 0.3, { ink: OR });
  rail(-37 - 2.8, -43 - 2.8, -37 + 2.8, -43 - 2.8, 0 + 5.0, { ink: BK });
  rail(-37 - 2.8, -43 + 2.8, -37 + 2.8, -43 + 2.8, 0 + 5.0, { ink: BK });
  cyl(-37, 0 + 5.3, -43, 1.5, 1.5, { seg: 8, noCollide: true, ink: OR });
  ring(-37, 0 + 9.3, -43, 'z');
  pickup(-37, 0 + 5.2, -43);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-37, 0, 23) ===
  box(-37 - 2.5, 0, 23 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-37 + 2.5, 0, 23 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-37 - 2.5, 0, 23 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-37 + 2.5, 0, 23 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-37 - 3.0, 23 - 3.0, -37 + 3.0, 23 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-37, 0 + 5.9, 23 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-37, 0 + 5.9, 23 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-37, 0 + 8.3, 23 + 4.0, 'z');
  pickup(-37, 0 + 6.1, 23 - 1.5);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Prop: Giant Rock Skull
  box(-27, 0, -47, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-27 - 1.5, 0 + 2.0, -47 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-27 + 1.5, 0 + 2.0, -47 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-27, 0 + 0.5, -47 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-27, 0 - 2.0, -47 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Dark Altar
  box(-31, 0, -31, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-31, 0 + 1.0, -31, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-35, 0, -31, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-35, 0 + 1.0, -31, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Bone Spike
  cyl(-3, 4.5, -7, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-3, 4.5 + 1.5, -7, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-3, 4.5 + 3.0, -7, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Dark Altar
  box(-7, 0, -35, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-7, 0 + 1.0, -35, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Giant Rock Skull
  box(-23, 0, -43, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-23 - 1.5, 0 + 2.0, -43 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-23 + 1.5, 0 + 2.0, -43 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-23, 0 + 0.5, -43 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-23, 0 - 2.0, -43 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Dark Altar
  box(-11, 0, -23, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-11, 0 + 1.0, -23, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Giant Rock Skull
  box(-23, 0, -23, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-23 - 1.5, 0 + 2.0, -23 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-23 + 1.5, 0 + 2.0, -23 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-23, 0 + 0.5, -23 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-23, 0 - 2.0, -23 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Dark Altar
  box(-3, 0, -43, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-3, 0 + 1.0, -43, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Giant Rock Skull
  box(-23, 0, -3, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-23 - 1.5, 0 + 2.0, -3 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-23 + 1.5, 0 + 2.0, -3 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-23, 0 + 0.5, -3 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-23, 0 - 2.0, -3 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Giant Rock Skull
  box(-31, 0, -23, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-31 - 1.5, 0 + 2.0, -23 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-31 + 1.5, 0 + 2.0, -23 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-31, 0 + 0.5, -23 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-31, 0 - 2.0, -23 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Bone Spike
  cyl(-43, 0, -39, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-43, 0 + 1.5, -39, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-43, 0 + 3.0, -39, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Bone Spike
  cyl(-11, 0, -31, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-11, 0 + 1.5, -31, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-11, 0 + 3.0, -31, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Bone Spike
  cyl(-19, 0, -3, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-19, 0 + 1.5, -3, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-19, 0 + 3.0, -3, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Dark Altar
  box(-27, 0, -35, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-27, 0 + 1.0, -35, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-39, 0, -15, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-39, 0 + 1.0, -15, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Bone Spike
  cyl(-15, 0, -31, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-15, 0 + 1.5, -31, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-15, 0 + 3.0, -31, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Dark Altar
  box(-27, 0, -19, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-27, 0 + 1.0, -19, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Bone Spike
  cyl(-3, 0, -47, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-3, 0 + 1.5, -47, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-3, 0 + 3.0, -47, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Bone Spike
  cyl(-27, 0, -31, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-27, 0 + 1.5, -31, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-27, 0 + 3.0, -31, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Dark Altar
  box(-15, 0, -43, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-15, 0 + 1.0, -43, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Bone Spike
  cyl(-7, 4.5, -7, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-7, 4.5 + 1.5, -7, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-7, 4.5 + 3.0, -7, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Dark Altar
  box(-47, 0, -43, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-47, 0 + 1.0, -43, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Giant Rock Skull
  box(-31, 0, -15, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-31 - 1.5, 0 + 2.0, -15 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-31 + 1.5, 0 + 2.0, -15 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-31, 0 + 0.5, -15 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-31, 0 - 2.0, -15 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Bone Spike
  cyl(-47, 0, -15, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-47, 0 + 1.5, -15, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-47, 0 + 3.0, -15, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Dark Altar
  box(-35, 0, -23, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-35, 0 + 1.0, -23, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-35, 0, -19, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-35, 0 + 1.0, -19, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-43, 0, -43, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-43, 0 + 1.0, -43, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Bone Spike
  cyl(-23, 0, -27, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-23, 0 + 1.5, -27, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-23, 0 + 3.0, -27, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Dark Altar
  box(-7, 0, -19, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-7, 0 + 1.0, -19, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Giant Rock Skull
  box(-35, 0, -11, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-35 - 1.5, 0 + 2.0, -11 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-35 + 1.5, 0 + 2.0, -11 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-35, 0 + 0.5, -11 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-35, 0 - 2.0, -11 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Giant Rock Skull
  box(-7, 4.5, -3, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-7 - 1.5, 4.5 + 2.0, -3 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-7 + 1.5, 4.5 + 2.0, -3 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-7, 4.5 + 0.5, -3 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-7, 4.5 - 2.0, -3 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Bone Spike
  cyl(-19, 0, -23, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-19, 0 + 1.5, -23, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-19, 0 + 3.0, -23, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Giant Rock Skull
  box(-27, 0, -23, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-27 - 1.5, 0 + 2.0, -23 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-27 + 1.5, 0 + 2.0, -23 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-27, 0 + 0.5, -23 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-27, 0 - 2.0, -23 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Giant Rock Skull
  box(-3, 4.5, -3, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-3 - 1.5, 4.5 + 2.0, -3 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-3 + 1.5, 4.5 + 2.0, -3 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-3, 4.5 + 0.5, -3 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-3, 4.5 - 2.0, -3 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Bone Spike
  cyl(-11, 4.5, -7, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-11, 4.5 + 1.5, -7, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-11, 4.5 + 3.0, -7, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Giant Rock Skull
  box(-11, 0, -35, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-11 - 1.5, 0 + 2.0, -35 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-11 + 1.5, 0 + 2.0, -35 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-11, 0 + 0.5, -35 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-11, 0 - 2.0, -35 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Bone Spike
  cyl(-27, 0, -27, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-27, 0 + 1.5, -27, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-27, 0 + 3.0, -27, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Dark Altar
  box(-39, 4.5, -7, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-39, 4.5 + 1.0, -7, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-11, 0, -39, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-11, 0 + 1.0, -39, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Giant Rock Skull
  box(-11, 4.5, -11, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-11 - 1.5, 4.5 + 2.0, -11 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-11 + 1.5, 4.5 + 2.0, -11 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-11, 4.5 + 0.5, -11 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-11, 4.5 - 2.0, -11 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Bone Spike
  cyl(-7, 4.5, -11, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-7, 4.5 + 1.5, -11, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-7, 4.5 + 3.0, -11, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Bone Spike
  cyl(-23, 0, -7, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-23, 0 + 1.5, -7, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-23, 0 + 3.0, -7, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Bone Spike
  cyl(-7, 0, -27, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-7, 0 + 1.5, -27, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-7, 0 + 3.0, -27, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Bone Spike
  cyl(-15, 0, -27, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-15, 0 + 1.5, -27, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-15, 0 + 3.0, -27, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Bone Spike
  cyl(-43, 0, -15, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-43, 0 + 1.5, -15, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-43, 0 + 3.0, -15, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Bone Spike
  cyl(-43, 0, -27, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-43, 0 + 1.5, -27, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-43, 0 + 3.0, -27, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Bone Spike
  cyl(-23, 0, -39, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-23, 0 + 1.5, -39, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-23, 0 + 3.0, -39, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Bone Spike
  cyl(-39, 0, -35, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-39, 0 + 1.5, -35, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-39, 0 + 3.0, -35, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Giant Rock Skull
  box(-35, 0, -15, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-35 - 1.5, 0 + 2.0, -15 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-35 + 1.5, 0 + 2.0, -15 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-35, 0 + 0.5, -15 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-35, 0 - 2.0, -15 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Bone Spike
  cyl(-27, 0, -15, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-27, 0 + 1.5, -15, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-27, 0 + 3.0, -15, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Dark Altar
  box(-31, 0, -7, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-31, 0 + 1.0, -7, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-23, 0, -35, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-23, 0 + 1.0, -35, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-31, 0, -39, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-31, 0 + 1.0, -39, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Bone Spike
  cyl(-47, 0, -35, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-47, 0 + 1.5, -35, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-47, 0 + 3.0, -35, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Dark Altar
  box(-27, 0, -39, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-27, 0 + 1.0, -39, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-39, 0, -19, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-39, 0 + 1.0, -19, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Giant Rock Skull
  box(-31, 0, -11, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-31 - 1.5, 0 + 2.0, -11 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-31 + 1.5, 0 + 2.0, -11 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-31, 0 + 0.5, -11 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-31, 0 - 2.0, -11 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Bone Spike
  cyl(-35, 0, -7, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-35, 0 + 1.5, -7, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-35, 0 + 3.0, -7, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Dark Altar
  box(-27, 0, -11, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-27, 0 + 1.0, -11, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Giant Rock Skull
  box(-35, 0, -35, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-35 - 1.5, 0 + 2.0, -35 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-35 + 1.5, 0 + 2.0, -35 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-35, 0 + 0.5, -35 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-35, 0 - 2.0, -35 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Bone Spike
  cyl(-27, 0, -7, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-27, 0 + 1.5, -7, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-27, 0 + 3.0, -7, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Giant Rock Skull
  box(-31, 0, -19, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-31 - 1.5, 0 + 2.0, -19 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-31 + 1.5, 0 + 2.0, -19 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-31, 0 + 0.5, -19 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-31, 0 - 2.0, -19 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Dark Altar
  box(-47, 0, -47, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-47, 0 + 1.0, -47, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Bone Spike
  cyl(-27, 0, -43, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-27, 0 + 1.5, -43, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-27, 0 + 3.0, -43, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Giant Rock Skull
  box(-35, 0, -27, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-35 - 1.5, 0 + 2.0, -27 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-35 + 1.5, 0 + 2.0, -27 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-35, 0 + 0.5, -27 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-35, 0 - 2.0, -27 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Bone Spike
  cyl(-7, 0, -39, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-7, 0 + 1.5, -39, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-7, 0 + 3.0, -39, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Bone Spike
  cyl(-7, 0, -31, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-7, 0 + 1.5, -31, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-7, 0 + 3.0, -31, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Bone Spike
  cyl(-47, 4.5, -7, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-47, 4.5 + 1.5, -7, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-47, 4.5 + 3.0, -7, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Giant Rock Skull
  box(-19, 0, -7, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-19 - 1.5, 0 + 2.0, -7 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-19 + 1.5, 0 + 2.0, -7 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-19, 0 + 0.5, -7 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-19, 0 - 2.0, -7 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Dark Altar
  box(-11, 0, -47, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-11, 0 + 1.0, -47, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-19, 0, -39, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-19, 0 + 1.0, -39, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-19, 0, -19, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-19, 0 + 1.0, -19, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Bone Spike
  cyl(-19, 0, -47, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-19, 0 + 1.5, -47, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-19, 0 + 3.0, -47, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Bone Spike
  cyl(-15, 0, -39, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-15, 0 + 1.5, -39, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-15, 0 + 3.0, -39, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Dark Altar
  box(-31, 0, -35, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-31, 0 + 1.0, -35, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-23, 0, -11, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-23, 0 + 1.0, -11, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-19, 0, -35, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-19, 0 + 1.0, -35, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Bone Spike
  cyl(-15, 0, -47, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-15, 0 + 1.5, -47, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-15, 0 + 3.0, -47, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Giant Rock Skull
  box(-11, 4.5, -3, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-11 - 1.5, 4.5 + 2.0, -3 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-11 + 1.5, 4.5 + 2.0, -3 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-11, 4.5 + 0.5, -3 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-11, 4.5 - 2.0, -3 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Dark Altar
  box(-23, 0, -15, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-23, 0 + 1.0, -15, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-19, 0, -43, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-19, 0 + 1.0, -43, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Bone Spike
  cyl(-23, 0, -19, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-23, 0 + 1.5, -19, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-23, 0 + 3.0, -19, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Bone Spike
  cyl(-11, 0, -15, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-11, 0 + 1.5, -15, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-11, 0 + 3.0, -15, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Dark Altar
  box(-31, 0, -27, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-31, 0 + 1.0, -27, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Dark Altar
  box(-7, 0, -43, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-7, 0 + 1.0, -43, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Bone Spike
  cyl(-43, 0, -35, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-43, 0 + 1.5, -35, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-43, 0 + 3.0, -35, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Dark Altar
  box(-31, 0, -3, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-31, 0 + 1.0, -3, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Bone Spike
  cyl(-31, 0, -43, 0.6, 1.5, { seg: 6, ink: OR });
  cyl(-31, 0 + 1.5, -43, 0.4, 1.5, { seg: 6, ink: OR });
  cyl(-31, 0 + 3.0, -43, 0.2, 1.0, { seg: 6, ink: OR });

  // Prop: Giant Rock Skull
  box(-23, 0, -47, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(-23 - 1.5, 0 + 2.0, -47 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(-23 + 1.5, 0 + 2.0, -47 + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(-23, 0 + 0.5, -47 + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(-23, 0 - 2.0, -47 + 2.5, 4.0, 1.0, 1.0, { ink: OR }); // Teeth

  // Prop: Dark Altar
  box(-7, 0, -47, 2.5, 1.0, 2.5, { ink: BK });
  cyl(-7, 0 + 1.0, -47, 1.0, 0.5, { seg: 8, ink: RD });

  // Prop: Shipyard Crane
  box(41, 0, -23, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(41, 0 + 8.0, -23 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(41, 0 + 4.0, -23 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(49, 0, -7, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(49, 0 + 8.0, -7 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(49, 0 + 4.0, -7 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Galleon Hull Construction
  box(37, 0, -7, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(37, 0 + 1.5, -7 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(37, 0 + 1.0, -7 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Shipyard Crane
  box(37, 0, -23, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(37, 0 + 8.0, -23 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(37, 0 + 4.0, -23 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(1-1.2, 9, -35-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(1+1.2, 9, -35-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(1-1.2, 9, -35+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(1+1.2, 9, -35+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(1, 9 + 2.0, -35, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(33, 0, -19, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(33, 0 + 8.0, -19 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(33, 0 + 4.0, -19 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(49, 0, -3, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(49, 0 + 8.0, -3 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(49, 0 + 4.0, -3 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Galleon Hull Construction
  box(37, 0, -35, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(37, 0 + 1.5, -35 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(37, 0 + 1.0, -35 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Wood Scaffolding
  cyl(33-1.2, 0, -27-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33+1.2, 0, -27-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33-1.2, 0, -27+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33+1.2, 0, -27+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(33, 0 + 2.0, -27, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(45-1.2, 0, -47-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(45+1.2, 0, -47-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(45-1.2, 0, -47+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(45+1.2, 0, -47+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(45, 0 + 2.0, -47, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(17, 0, -39, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(17, 0 + 8.0, -39 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(17, 0 + 4.0, -39 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(37-1.2, 0, -39-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(37+1.2, 0, -39-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(37-1.2, 0, -39+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(37+1.2, 0, -39+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(37, 0 + 2.0, -39, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(9-1.2, 0, -35-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(9+1.2, 0, -35-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(9-1.2, 0, -35+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(9+1.2, 0, -35+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(9, 0 + 2.0, -35, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(37, 0, -19, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(37, 0 + 8.0, -19 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(37, 0 + 4.0, -19 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Galleon Hull Construction
  box(9, 4.5, -7, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(9, 4.5 + 1.5, -7 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(9, 4.5 + 1.0, -7 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Wood Scaffolding
  cyl(9-1.2, 0, -31-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(9+1.2, 0, -31-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(9-1.2, 0, -31+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(9+1.2, 0, -31+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(9, 0 + 2.0, -31, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(29-1.2, 0, -43-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29+1.2, 0, -43-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29-1.2, 0, -43+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29+1.2, 0, -43+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(29, 0 + 2.0, -43, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(41, 0, -19, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(41, 0 + 8.0, -19 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(41, 0 + 4.0, -19 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(25, 0, -3, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(25, 0 + 8.0, -3 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(25, 0 + 4.0, -3 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Galleon Hull Construction
  box(21, 0, -31, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(21, 0 + 1.5, -31 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(21, 0 + 1.0, -31 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Galleon Hull Construction
  box(9, 0, -43, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(9, 0 + 1.5, -43 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(9, 0 + 1.0, -43 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Shipyard Crane
  box(21, 0, -39, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(21, 0 + 8.0, -39 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(21, 0 + 4.0, -39 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(25, 0, -11, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(25, 0 + 8.0, -11 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(25, 0 + 4.0, -11 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(25, 0, -19, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(25, 0 + 8.0, -19 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(25, 0 + 4.0, -19 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(17, 0, -43, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(17, 0 + 8.0, -43 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(17, 0 + 4.0, -43 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(17-1.2, 0, -11-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(17+1.2, 0, -11-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(17-1.2, 0, -11+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(17+1.2, 0, -11+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(17, 0 + 2.0, -11, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(1, 0, -43, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(1, 0 + 8.0, -43 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(1, 0 + 4.0, -43 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Galleon Hull Construction
  box(17, 0, -7, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(17, 0 + 1.5, -7 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(17, 0 + 1.0, -7 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Galleon Hull Construction
  box(29, 0, -39, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(29, 0 + 1.5, -39 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(29, 0 + 1.0, -39 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Galleon Hull Construction
  box(21, 0, -19, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(21, 0 + 1.5, -19 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(21, 0 + 1.0, -19 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Wood Scaffolding
  cyl(13-1.2, 0, -35-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(13+1.2, 0, -35-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(13-1.2, 0, -35+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(13+1.2, 0, -35+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(13, 0 + 2.0, -35, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Galleon Hull Construction
  box(5, 0, -27, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(5, 0 + 1.5, -27 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(5, 0 + 1.0, -27 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Wood Scaffolding
  cyl(1-1.2, 4.5, -7-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(1+1.2, 4.5, -7-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(1-1.2, 4.5, -7+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(1+1.2, 4.5, -7+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(1, 4.5 + 2.0, -7, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(1-1.2, 0, -23-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(1+1.2, 0, -23-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(1-1.2, 0, -23+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(1+1.2, 0, -23+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(1, 0 + 2.0, -23, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Galleon Hull Construction
  box(45, 0, -27, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(45, 0 + 1.5, -27 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(45, 0 + 1.0, -27 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Galleon Hull Construction
  box(45, 0, -19, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(45, 0 + 1.5, -19 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(45, 0 + 1.0, -19 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Wood Scaffolding
  cyl(21-1.2, 0, -27-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(21+1.2, 0, -27-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(21-1.2, 0, -27+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(21+1.2, 0, -27+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(21, 0 + 2.0, -27, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(21, 0, -11, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(21, 0 + 8.0, -11 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(21, 0 + 4.0, -11 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(9-1.2, 0, -15-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(9+1.2, 0, -15-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(9-1.2, 0, -15+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(9+1.2, 0, -15+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(9, 0 + 2.0, -15, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(5-1.2, 0, -43-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(5+1.2, 0, -43-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(5-1.2, 0, -43+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(5+1.2, 0, -43+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(5, 0 + 2.0, -43, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(5-1.2, 0, -35-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(5+1.2, 0, -35-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(5-1.2, 0, -35+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(5+1.2, 0, -35+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(5, 0 + 2.0, -35, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(9, 0, -27, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(9, 0 + 8.0, -27 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(9, 0 + 4.0, -27 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(17-1.2, 0, -35-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(17+1.2, 0, -35-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(17-1.2, 0, -35+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(17+1.2, 0, -35+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(17, 0 + 2.0, -35, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(13-1.2, 9, -31-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(13+1.2, 9, -31-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(13-1.2, 9, -31+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(13+1.2, 9, -31+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(13, 9 + 2.0, -31, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Galleon Hull Construction
  box(17, 0, -3, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(17, 0 + 1.5, -3 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(17, 0 + 1.0, -3 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Shipyard Crane
  box(21, 0, -7, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(21, 0 + 8.0, -7 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(21, 0 + 4.0, -7 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(29, 0, -11, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(29, 0 + 8.0, -11 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(29, 0 + 4.0, -11 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(25-1.2, 0, -47-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(25+1.2, 0, -47-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(25-1.2, 0, -47+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(25+1.2, 0, -47+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(25, 0 + 2.0, -47, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Galleon Hull Construction
  box(9, 4.5, -3, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(9, 4.5 + 1.5, -3 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(9, 4.5 + 1.0, -3 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Shipyard Crane
  box(9, 0, -19, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(9, 0 + 8.0, -19 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(9, 0 + 4.0, -19 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Galleon Hull Construction
  box(9, 4.5, -11, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(9, 4.5 + 1.5, -11 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(9, 4.5 + 1.0, -11 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Wood Scaffolding
  cyl(29-1.2, 0, -31-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29+1.2, 0, -31-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29-1.2, 0, -31+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29+1.2, 0, -31+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(29, 0 + 2.0, -31, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(25-1.2, 0, -7-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(25+1.2, 0, -7-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(25-1.2, 0, -7+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(25+1.2, 0, -7+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(25, 0 + 2.0, -7, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(9-1.2, 0, -23-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(9+1.2, 0, -23-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(9-1.2, 0, -23+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(9+1.2, 0, -23+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(9, 0 + 2.0, -23, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(45-1.2, 0, -11-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(45+1.2, 0, -11-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(45-1.2, 0, -11+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(45+1.2, 0, -11+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(45, 0 + 2.0, -11, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(29-1.2, 0, -19-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29+1.2, 0, -19-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29-1.2, 0, -19+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29+1.2, 0, -19+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(29, 0 + 2.0, -19, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Galleon Hull Construction
  box(33, 0, -3, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(33, 0 + 1.5, -3 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(33, 0 + 1.0, -3 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Shipyard Crane
  box(29, 0, -35, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(29, 0 + 8.0, -35 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(29, 0 + 4.0, -35 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Galleon Hull Construction
  box(5, 4.5, -3, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(5, 4.5 + 1.5, -3 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(5, 4.5 + 1.0, -3 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Galleon Hull Construction
  box(25, 0, -39, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(25, 0 + 1.5, -39 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(25, 0 + 1.0, -39 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Wood Scaffolding
  cyl(5-1.2, 0, -23-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(5+1.2, 0, -23-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(5-1.2, 0, -23+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(5+1.2, 0, -23+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(5, 0 + 2.0, -23, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(33, 0, -11, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(33, 0 + 8.0, -11 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(33, 0 + 4.0, -11 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Galleon Hull Construction
  box(29, 0, -7, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(29, 0 + 1.5, -7 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(29, 0 + 1.0, -7 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Wood Scaffolding
  cyl(33-1.2, 0, -39-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33+1.2, 0, -39-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33-1.2, 0, -39+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33+1.2, 0, -39+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(33, 0 + 2.0, -39, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Galleon Hull Construction
  box(45, 0, -15, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(45, 0 + 1.5, -15 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(45, 0 + 1.0, -15 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Galleon Hull Construction
  box(45, 0, -23, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(45, 0 + 1.5, -23 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(45, 0 + 1.0, -23 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Wood Scaffolding
  cyl(33-1.2, 0, -35-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33+1.2, 0, -35-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33-1.2, 0, -35+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33+1.2, 0, -35+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(33, 0 + 2.0, -35, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(5, 0, -47, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(5, 0 + 8.0, -47 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(5, 0 + 4.0, -47 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(21-1.2, 0, -43-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(21+1.2, 0, -43-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(21-1.2, 0, -43+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(21+1.2, 0, -43+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(21, 0 + 2.0, -43, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(37-1.2, 0, -3-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(37+1.2, 0, -3-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(37-1.2, 0, -3+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(37+1.2, 0, -3+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(37, 0 + 2.0, -3, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Galleon Hull Construction
  box(45, 0, -7, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(45, 0 + 1.5, -7 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(45, 0 + 1.0, -7 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Shipyard Crane
  box(37, 0, -27, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(37, 0 + 8.0, -27 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(37, 0 + 4.0, -27 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Galleon Hull Construction
  box(17, 0, -15, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(17, 0 + 1.5, -15 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(17, 0 + 1.0, -15 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Shipyard Crane
  box(41, 0, -31, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(41, 0 + 8.0, -31 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(41, 0 + 4.0, -31 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(13-1.2, 0, -39-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(13+1.2, 0, -39-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(13-1.2, 0, -39+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(13+1.2, 0, -39+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(13, 0 + 2.0, -39, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(25-1.2, 0, -23-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(25+1.2, 0, -23-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(25-1.2, 0, -23+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(25+1.2, 0, -23+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(25, 0 + 2.0, -23, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(13, 9, -27, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(13, 9 + 8.0, -27 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(13, 9 + 4.0, -27 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(5, 0, -31, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(5, 0 + 8.0, -31 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(5, 0 + 4.0, -31 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(33-1.2, 0, -7-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33+1.2, 0, -7-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33-1.2, 0, -7+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33+1.2, 0, -7+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(33, 0 + 2.0, -7, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(1-1.2, 9, -31-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(1+1.2, 9, -31-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(1-1.2, 9, -31+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(1+1.2, 9, -31+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(1, 9 + 2.0, -31, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(45, 0, -35, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(45, 0 + 8.0, -35 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(45, 0 + 4.0, -35 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(37, 0, -11, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(37, 0 + 8.0, -11 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(37, 0 + 4.0, -11 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(21, 0, -3, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(21, 0 + 8.0, -3 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(21, 0 + 4.0, -3 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(49, 0, -15, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(49, 0 + 8.0, -15 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(49, 0 + 4.0, -15 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(13, 0, -43, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(13, 0 + 8.0, -43 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(13, 0 + 4.0, -43 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(41-1.2, 0, -3-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(41+1.2, 0, -3-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(41-1.2, 0, -3+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(41+1.2, 0, -3+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(41, 0 + 2.0, -3, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(29, 0, -47, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(29, 0 + 8.0, -47 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(29, 0 + 4.0, -47 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Galleon Hull Construction
  box(21, 0, -35, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(21, 0 + 1.5, -35 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(21, 0 + 1.0, -35 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Shipyard Crane
  box(1, 4.5, -3, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(1, 4.5 + 8.0, -3 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(1, 4.5 + 4.0, -3 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(25, 0, -35, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(25, 0 + 8.0, -35 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(25, 0 + 4.0, -35 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(1-1.2, 0, -39-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(1+1.2, 0, -39-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(1-1.2, 0, -39+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(1+1.2, 0, -39+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(1, 0 + 2.0, -39, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(25-1.2, 0, -31-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(25+1.2, 0, -31-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(25-1.2, 0, -31+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(25+1.2, 0, -31+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(25, 0 + 2.0, -31, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(29-1.2, 0, -23-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29+1.2, 0, -23-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29-1.2, 0, -23+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(29+1.2, 0, -23+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(29, 0 + 2.0, -23, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(13-1.2, 0, -47-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(13+1.2, 0, -47-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(13-1.2, 0, -47+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(13+1.2, 0, -47+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(13, 0 + 2.0, -47, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(5, 0, -15, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(5, 0 + 8.0, -15 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(5, 0 + 4.0, -15 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Galleon Hull Construction
  box(41, 0, -7, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(41, 0 + 1.5, -7 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(41, 0 + 1.0, -7 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Wood Scaffolding
  cyl(33-1.2, 0, -43-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33+1.2, 0, -43-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33-1.2, 0, -43+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33+1.2, 0, -43+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(33, 0 + 2.0, -43, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(45, 0, -39, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(45, 0 + 8.0, -39 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(45, 0 + 4.0, -39 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(29, 0, -3, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(29, 0 + 8.0, -3 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(29, 0 + 4.0, -3 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(49, 0, -23, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(49, 0 + 8.0, -23 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(49, 0 + 4.0, -23 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(13-1.2, 0, -19-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(13+1.2, 0, -19-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(13-1.2, 0, -19+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(13+1.2, 0, -19+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(13, 0 + 2.0, -19, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(37-1.2, 0, -43-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(37+1.2, 0, -43-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(37-1.2, 0, -43+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(37+1.2, 0, -43+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(37, 0 + 2.0, -43, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(41, 0, -35, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(41, 0 + 8.0, -35 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(41, 0 + 4.0, -35 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(41-1.2, 0, -27-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(41+1.2, 0, -27-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(41-1.2, 0, -27+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(41+1.2, 0, -27+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(41, 0 + 2.0, -27, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Galleon Hull Construction
  box(21, 0, -15, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(21, 0 + 1.5, -15 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(21, 0 + 1.0, -15 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Wood Scaffolding
  cyl(37-1.2, 0, -31-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(37+1.2, 0, -31-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(37-1.2, 0, -31+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(37+1.2, 0, -31+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(37, 0 + 2.0, -31, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(49, 0, -47, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(49, 0 + 8.0, -47 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(49, 0 + 4.0, -47 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(5-1.2, 0, -39-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(5+1.2, 0, -39-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(5-1.2, 0, -39+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(5+1.2, 0, -39+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(5, 0 + 2.0, -39, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(21, 0, -23, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(21, 0 + 8.0, -23 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(21, 0 + 4.0, -23 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(41-1.2, 0, -15-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(41+1.2, 0, -15-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(41-1.2, 0, -15+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(41+1.2, 0, -15+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(41, 0 + 2.0, -15, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Galleon Hull Construction
  box(41, 9, -43, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(41, 9 + 1.5, -43 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(41, 9 + 1.0, -43 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Shipyard Crane
  box(17, 0, -47, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(17, 0 + 8.0, -47 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(17, 0 + 4.0, -47 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(25, 0, -43, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(25, 0 + 8.0, -43 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(25, 0 + 4.0, -43 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(37-1.2, 0, -15-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(37+1.2, 0, -15-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(37-1.2, 0, -15+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(37+1.2, 0, -15+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(37, 0 + 2.0, -15, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(17-1.2, 0, -23-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(17+1.2, 0, -23-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(17-1.2, 0, -23+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(17+1.2, 0, -23+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(17, 0 + 2.0, -23, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(33-1.2, 0, -23-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33+1.2, 0, -23-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33-1.2, 0, -23+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(33+1.2, 0, -23+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(33, 0 + 2.0, -23, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(9, 0, -47, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(9, 0 + 8.0, -47 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(9, 0 + 4.0, -47 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(9, 0, -39, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(9, 0 + 8.0, -39 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(9, 0 + 4.0, -39 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(5-1.2, 4.5, -11-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(5+1.2, 4.5, -11-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(5-1.2, 4.5, -11+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(5+1.2, 4.5, -11+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(5, 4.5 + 2.0, -11, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Wood Scaffolding
  cyl(49-1.2, 0, -11-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(49+1.2, 0, -11-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(49-1.2, 0, -11+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(49+1.2, 0, -11+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(49, 0 + 2.0, -11, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Shipyard Crane
  box(17, 0, -19, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(17, 0 + 8.0, -19 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(17, 0 + 4.0, -19 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Shipyard Crane
  box(13, 0, -15, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(13, 0 + 8.0, -15 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(13, 0 + 4.0, -15 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Wood Scaffolding
  cyl(41-1.2, 0, -11-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(41+1.2, 0, -11-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(41-1.2, 0, -11+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(41+1.2, 0, -11+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(41, 0 + 2.0, -11, 3.0, 0.2, 3.0, { ink: OR }); // Platform

  // Prop: Galleon Hull Construction
  box(45, 0, -3, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(45, 0 + 1.5, -3 - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(45, 0 + 1.0, -3 + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow

  // Prop: Shipyard Crane
  box(45, 0, -31, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(45, 0 + 8.0, -31 + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(45, 0 + 4.0, -31 + 5.5, 0.2, 4.0, { seg: 4, ink: OR }); // Cable

  // Prop: Goods Stall
  box(-15, 0, 33, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-15, 0 + 1.5, 33, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-31, 0, 21, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-31, 0 + 0.6, 21, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-31, 0 + 1.1, 21, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Merchant Tent
  cyl(-27-1.8, 0, 21-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-27+1.8, 0, 21-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-27-1.8, 0, 21+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-27+1.8, 0, 21+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-27, 0 + 2.0, 21, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-27, 0 + 2.2, 21, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Goods Stall
  box(-27, 0, 17, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-27, 0 + 1.5, 17, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-23, 0, 17, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-23, 0 + 1.5, 17, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-47, 0, 17, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-47, 0 + 0.6, 17, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-47, 0 + 1.1, 17, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Goods Stall
  box(-27, 0, 5, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-27, 0 + 1.5, 5, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-31, 0, 41, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-31, 0 + 1.5, 41, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-43, 0, 17, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-43, 0 + 1.5, 17, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-43, 0, 33, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-43, 0 + 1.5, 33, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-47, 0, 29, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-47, 0 + 0.6, 29, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-47, 0 + 1.1, 29, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-27, 0, 13, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-27, 0 + 0.6, 13, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-27, 0 + 1.1, 13, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Goods Stall
  box(-43, 0, 37, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-43, 0 + 1.5, 37, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-19, 0, 49, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-19, 0 + 1.5, 49, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Merchant Tent
  cyl(-39-1.8, 0, 17-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-39+1.8, 0, 17-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-39-1.8, 0, 17+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-39+1.8, 0, 17+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-39, 0 + 2.0, 17, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-39, 0 + 2.2, 17, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Merchant Tent
  cyl(-7-1.8, 0, 45-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-7+1.8, 0, 45-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-7-1.8, 0, 45+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-7+1.8, 0, 45+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-7, 0 + 2.0, 45, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-7, 0 + 2.2, 45, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Goods Stall
  box(-47, 0, 49, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-47, 0 + 1.5, 49, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-35, 0, 13, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-35, 0 + 1.5, 13, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-23, 0, 21, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-23, 0 + 0.6, 21, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-23, 0 + 1.1, 21, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Goods Stall
  box(-23, 0, 9, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-23, 0 + 1.5, 9, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-15, 0, 41, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-15, 0 + 0.6, 41, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-15, 0 + 1.1, 41, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Goods Stall
  box(-23, 0, 45, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-23, 0 + 1.5, 45, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-11, 0, 41, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-11, 0 + 1.5, 41, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-3, 0, 25, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-3, 0 + 0.6, 25, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-3, 0 + 1.1, 25, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Merchant Tent
  cyl(-15-1.8, 0, 17-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-15+1.8, 0, 17-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-15-1.8, 0, 17+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-15+1.8, 0, 17+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-15, 0 + 2.0, 17, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-15, 0 + 2.2, 17, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Massive Gold Pile
  cyl(-47, 0, 45, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-47, 0 + 0.6, 45, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-47, 0 + 1.1, 45, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-31, 0, 45, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-31, 0 + 0.6, 45, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-31, 0 + 1.1, 45, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Goods Stall
  box(-47, 0, 13, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-47, 0 + 1.5, 13, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-19, 0, 5, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-19, 0 + 1.5, 5, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-15, 0, 5, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-15, 0 + 0.6, 5, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-15, 0 + 1.1, 5, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-11, 0, 45, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-11, 0 + 0.6, 45, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-11, 0 + 1.1, 45, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-3, 4.5, 9, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-3, 4.5 + 0.6, 9, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-3, 4.5 + 1.1, 9, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Merchant Tent
  cyl(-35-1.8, 0, 33-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-35+1.8, 0, 33-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-35-1.8, 0, 33+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-35+1.8, 0, 33+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-35, 0 + 2.0, 33, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-35, 0 + 2.2, 33, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Massive Gold Pile
  cyl(-35, 0, 29, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-35, 0 + 0.6, 29, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-35, 0 + 1.1, 29, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Goods Stall
  box(-11, 0, 25, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-11, 0 + 1.5, 25, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Merchant Tent
  cyl(-23-1.8, 0, 37-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-23+1.8, 0, 37-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-23-1.8, 0, 37+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-23+1.8, 0, 37+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-23, 0 + 2.0, 37, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-23, 0 + 2.2, 37, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Massive Gold Pile
  cyl(-43, 0, 41, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-43, 0 + 0.6, 41, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-43, 0 + 1.1, 41, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Merchant Tent
  cyl(-39-1.8, 0, 1-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-39+1.8, 0, 1-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-39-1.8, 0, 1+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-39+1.8, 0, 1+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-39, 0 + 2.0, 1, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-39, 0 + 2.2, 1, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Merchant Tent
  cyl(-31-1.8, 0, 5-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-31+1.8, 0, 5-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-31-1.8, 0, 5+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-31+1.8, 0, 5+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-31, 0 + 2.0, 5, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-31, 0 + 2.2, 5, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Merchant Tent
  cyl(-3-1.8, 4.5, 5-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-3+1.8, 4.5, 5-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-3-1.8, 4.5, 5+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-3+1.8, 4.5, 5+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-3, 4.5 + 2.0, 5, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-3, 4.5 + 2.2, 5, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Massive Gold Pile
  cyl(-19, 0, 1, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-19, 0 + 0.6, 1, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-19, 0 + 1.1, 1, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-27, 0, 33, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-27, 0 + 0.6, 33, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-27, 0 + 1.1, 33, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-15, 0, 13, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-15, 0 + 0.6, 13, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-15, 0 + 1.1, 13, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Goods Stall
  box(-35, 0, 49, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-35, 0 + 1.5, 49, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Merchant Tent
  cyl(-35-1.8, 0, 17-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-35+1.8, 0, 17-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-35-1.8, 0, 17+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-35+1.8, 0, 17+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-35, 0 + 2.0, 17, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-35, 0 + 2.2, 17, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Massive Gold Pile
  cyl(-39, 0, 49, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-39, 0 + 0.6, 49, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-39, 0 + 1.1, 49, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Goods Stall
  box(-19, 0, 13, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-19, 0 + 1.5, 13, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-23, 0, 13, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-23, 0 + 1.5, 13, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-7, 0, 29, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-7, 0 + 0.6, 29, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-7, 0 + 1.1, 29, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Goods Stall
  box(-23, 0, 41, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-23, 0 + 1.5, 41, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-19, 0, 17, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-19, 0 + 1.5, 17, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Merchant Tent
  cyl(-23-1.8, 0, 25-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-23+1.8, 0, 25-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-23-1.8, 0, 25+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-23+1.8, 0, 25+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-23, 0 + 2.0, 25, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-23, 0 + 2.2, 25, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Merchant Tent
  cyl(-31-1.8, 0, 49-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-31+1.8, 0, 49-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-31-1.8, 0, 49+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-31+1.8, 0, 49+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-31, 0 + 2.0, 49, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-31, 0 + 2.2, 49, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Massive Gold Pile
  cyl(-15, 0, 49, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-15, 0 + 0.6, 49, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-15, 0 + 1.1, 49, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Goods Stall
  box(-3, 0, 33, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-3, 0 + 1.5, 33, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-15, 0, 9, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-15, 0 + 0.6, 9, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-15, 0 + 1.1, 9, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Merchant Tent
  cyl(-39-1.8, 0, 41-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-39+1.8, 0, 41-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-39-1.8, 0, 41+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-39+1.8, 0, 41+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-39, 0 + 2.0, 41, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-39, 0 + 2.2, 41, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Goods Stall
  box(-19, 0, 25, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-19, 0 + 1.5, 25, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-3, 0, 45, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-3, 0 + 1.5, 45, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-43, 0, 45, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-43, 0 + 0.6, 45, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-43, 0 + 1.1, 45, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-7, 4.5, 9, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-7, 4.5 + 0.6, 9, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-7, 4.5 + 1.1, 9, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-19, 0, 9, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-19, 0 + 0.6, 9, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-19, 0 + 1.1, 9, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Merchant Tent
  cyl(-43-1.8, 0, 21-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-43+1.8, 0, 21-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-43-1.8, 0, 21+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-43+1.8, 0, 21+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-43, 0 + 2.0, 21, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-43, 0 + 2.2, 21, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Goods Stall
  box(-3, 0, 21, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-3, 0 + 1.5, 21, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-11, 0, 17, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-11, 0 + 1.5, 17, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-47, 0, 21, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-47, 0 + 0.6, 21, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-47, 0 + 1.1, 21, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-27, 0, 49, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-27, 0 + 0.6, 49, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-27, 0 + 1.1, 49, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-7, 4.5, 5, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-7, 4.5 + 0.6, 5, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-7, 4.5 + 1.1, 5, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Merchant Tent
  cyl(-11-1.8, 0, 21-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-11+1.8, 0, 21-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-11-1.8, 0, 21+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-11+1.8, 0, 21+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-11, 0 + 2.0, 21, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-11, 0 + 2.2, 21, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Merchant Tent
  cyl(-3-1.8, 0, 41-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-3+1.8, 0, 41-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-3-1.8, 0, 41+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-3+1.8, 0, 41+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-3, 0 + 2.0, 41, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-3, 0 + 2.2, 41, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Goods Stall
  box(-3, 0, 29, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-3, 0 + 1.5, 29, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-23, 0, 33, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-23, 0 + 1.5, 33, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-11, 4.5, 1, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-11, 4.5 + 1.5, 1, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-19, 0, 33, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-19, 0 + 1.5, 33, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-7, 4.5, 1, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-7, 4.5 + 0.6, 1, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-7, 4.5 + 1.1, 1, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-31, 0, 9, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-31, 0 + 0.6, 9, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-31, 0 + 1.1, 9, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Merchant Tent
  cyl(-11-1.8, 4.5, 5-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-11+1.8, 4.5, 5-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-11-1.8, 4.5, 5+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-11+1.8, 4.5, 5+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-11, 4.5 + 2.0, 5, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-11, 4.5 + 2.2, 5, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Massive Gold Pile
  cyl(-19, 0, 21, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-19, 0 + 0.6, 21, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-19, 0 + 1.1, 21, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Goods Stall
  box(-27, 0, 9, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-27, 0 + 1.5, 9, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-47, 0, 37, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-47, 0 + 1.5, 37, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Merchant Tent
  cyl(-7-1.8, 0, 41-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-7+1.8, 0, 41-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-7-1.8, 0, 41+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-7+1.8, 0, 41+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-7, 0 + 2.0, 41, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-7, 0 + 2.2, 41, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Merchant Tent
  cyl(-43-1.8, 0, 1-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-43+1.8, 0, 1-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-43-1.8, 0, 1+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-43+1.8, 0, 1+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-43, 0 + 2.0, 1, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-43, 0 + 2.2, 1, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Goods Stall
  box(-43, 0, 5, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-43, 0 + 1.5, 5, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Merchant Tent
  cyl(-47-1.8, 0, 33-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-47+1.8, 0, 33-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-47-1.8, 0, 33+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-47+1.8, 0, 33+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-47, 0 + 2.0, 33, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-47, 0 + 2.2, 33, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Goods Stall
  box(-31, 0, 17, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-31, 0 + 1.5, 17, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-11, 0, 49, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-11, 0 + 0.6, 49, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-11, 0 + 1.1, 49, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Merchant Tent
  cyl(-23-1.8, 0, 49-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-23+1.8, 0, 49-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-23-1.8, 0, 49+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-23+1.8, 0, 49+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-23, 0 + 2.0, 49, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-23, 0 + 2.2, 49, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Merchant Tent
  cyl(-47-1.8, 0, 41-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-47+1.8, 0, 41-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-47-1.8, 0, 41+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-47+1.8, 0, 41+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-47, 0 + 2.0, 41, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-47, 0 + 2.2, 41, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Massive Gold Pile
  cyl(-11, 4.5, 9, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-11, 4.5 + 0.6, 9, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-11, 4.5 + 1.1, 9, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Goods Stall
  box(-23, 0, 1, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-23, 0 + 1.5, 1, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-7, 0, 49, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-7, 0 + 0.6, 49, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-7, 0 + 1.1, 49, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Goods Stall
  box(-35, 0, 41, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-35, 0 + 1.5, 41, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-31, 0, 33, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-31, 0 + 0.6, 33, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-31, 0 + 1.1, 33, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Merchant Tent
  cyl(-7-1.8, 0, 17-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-7+1.8, 0, 17-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-7-1.8, 0, 17+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-7+1.8, 0, 17+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-7, 0 + 2.0, 17, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-7, 0 + 2.2, 17, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Goods Stall
  box(-39, 0, 45, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-39, 0 + 1.5, 45, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-31, 0, 29, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-31, 0 + 0.6, 29, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-31, 0 + 1.1, 29, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Merchant Tent
  cyl(-15-1.8, 0, 37-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-15+1.8, 0, 37-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-15-1.8, 0, 37+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-15+1.8, 0, 37+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-15, 0 + 2.0, 37, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-15, 0 + 2.2, 37, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Massive Gold Pile
  cyl(-31, 0, 37, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-31, 0 + 0.6, 37, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-31, 0 + 1.1, 37, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Merchant Tent
  cyl(-39-1.8, 0, 29-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-39+1.8, 0, 29-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-39-1.8, 0, 29+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-39+1.8, 0, 29+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-39, 0 + 2.0, 29, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-39, 0 + 2.2, 29, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Merchant Tent
  cyl(-7-1.8, 0, 37-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-7+1.8, 0, 37-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-7-1.8, 0, 37+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-7+1.8, 0, 37+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-7, 0 + 2.0, 37, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-7, 0 + 2.2, 37, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Massive Gold Pile
  cyl(-47, 0, 5, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-47, 0 + 0.6, 5, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-47, 0 + 1.1, 5, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Merchant Tent
  cyl(-35-1.8, 0, 45-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-35+1.8, 0, 45-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-35-1.8, 0, 45+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-35+1.8, 0, 45+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-35, 0 + 2.0, 45, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-35, 0 + 2.2, 45, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Goods Stall
  box(-3, 0, 37, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-3, 0 + 1.5, 37, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-7, 0, 21, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-7, 0 + 0.6, 21, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-7, 0 + 1.1, 21, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Merchant Tent
  cyl(-19-1.8, 0, 37-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-19+1.8, 0, 37-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-19-1.8, 0, 37+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-19+1.8, 0, 37+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-19, 0 + 2.0, 37, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-19, 0 + 2.2, 37, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Merchant Tent
  cyl(-15-1.8, 0, 45-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-15+1.8, 0, 45-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-15-1.8, 0, 45+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-15+1.8, 0, 45+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-15, 0 + 2.0, 45, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-15, 0 + 2.2, 45, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Goods Stall
  box(-15, 0, 1, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-15, 0 + 1.5, 1, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-43, 0, 29, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-43, 0 + 0.6, 29, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-43, 0 + 1.1, 29, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Goods Stall
  box(-23, 0, 5, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-23, 0 + 1.5, 5, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-11, 0, 37, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-11, 0 + 1.5, 37, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Massive Gold Pile
  cyl(-35, 0, 37, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-35, 0 + 0.6, 37, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-35, 0 + 1.1, 37, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Merchant Tent
  cyl(-31-1.8, 0, 13-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-31+1.8, 0, 13-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-31-1.8, 0, 13+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-31+1.8, 0, 13+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-31, 0 + 2.0, 13, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-31, 0 + 2.2, 13, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Massive Gold Pile
  cyl(-19, 0, 45, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-19, 0 + 0.6, 45, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-19, 0 + 1.1, 45, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Merchant Tent
  cyl(-27-1.8, 0, 29-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-27+1.8, 0, 29-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-27-1.8, 0, 29+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-27+1.8, 0, 29+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-27, 0 + 2.0, 29, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-27, 0 + 2.2, 29, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Massive Gold Pile
  cyl(-43, 0, 25, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-43, 0 + 0.6, 25, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-43, 0 + 1.1, 25, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Massive Gold Pile
  cyl(-3, 4.5, 1, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-3, 4.5 + 0.6, 1, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-3, 4.5 + 1.1, 1, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Goods Stall
  box(-27, 0, 37, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-27, 0 + 1.5, 37, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Goods Stall
  box(-39, 0, 33, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(-39, 0 + 1.5, 33, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof

  // Prop: Merchant Tent
  cyl(-7-1.8, 0, 33-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-7+1.8, 0, 33-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-7-1.8, 0, 33+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-7+1.8, 0, 33+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-7, 0 + 2.0, 33, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-7, 0 + 2.2, 33, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Merchant Tent
  cyl(-27-1.8, 0, 45-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-27+1.8, 0, 45-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-27-1.8, 0, 45+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(-27+1.8, 0, 45+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(-27, 0 + 2.0, 45, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(-27, 0 + 2.2, 45, 2.0, 0.8, 4.2, { ink: OR }); // Raised center

  // Prop: Massive Gold Pile
  cyl(-3, 0, 49, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(-3, 0 + 0.6, 49, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(-3, 0 + 1.1, 49, 0.4, 0.4, { seg: 8, ink: OR }); // Top

  // Prop: Stone Watchtower
  box(49, 0, 29, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(49, 0 + 9.0, 29, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(1, 0, 33, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(1, 0 + 2.0, 33, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(1, 0 + 1.0, 33, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(29, 0, 25, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(29, 0 + 9.0, 25, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(1, 0, 41, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(1, 0 + 2.0, 41, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(1, 0 + 1.0, 41, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Cannon Battery Wall
  box(25, 0, 41, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(25 - 1.5, 0 + 1.4, 41 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(25 + 1.5, 0 + 1.4, 41 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Cannon Battery Wall
  box(21, 0, 41, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(21 - 1.5, 0 + 1.4, 41 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(21 + 1.5, 0 + 1.4, 41 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Cannon Battery Wall
  box(25, 0, 45, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(25 - 1.5, 0 + 1.4, 45 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(25 + 1.5, 0 + 1.4, 45 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(29, 0, 29, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(29, 0 + 2.0, 29, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(29, 0 + 1.0, 29, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(13, 0, 21, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(13, 0 + 2.0, 21, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(13, 0 + 1.0, 21, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(21, 0, 1, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(21, 0 + 2.0, 1, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(21, 0 + 1.0, 1, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Cannon Battery Wall
  box(37, 0, 17, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(37 - 1.5, 0 + 1.4, 17 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(37 + 1.5, 0 + 1.4, 17 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Stone Watchtower
  box(45, 0, 17, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(45, 0 + 9.0, 17, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Cannon Battery Wall
  box(21, 0, 21, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(21 - 1.5, 0 + 1.4, 21 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(21 + 1.5, 0 + 1.4, 21 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Stone Watchtower
  box(41, 0, 45, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(41, 0 + 9.0, 45, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(29, 0, 17, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(29, 0 + 2.0, 17, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(29, 0 + 1.0, 17, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(5, 0, 37, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(5, 0 + 2.0, 37, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(5, 0 + 1.0, 37, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Cannon Battery Wall
  box(33, 0, 1, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(33 - 1.5, 0 + 1.4, 1 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(33 + 1.5, 0 + 1.4, 1 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(37, 0, 41, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(37, 0 + 2.0, 41, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(37, 0 + 1.0, 41, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(29, 0, 45, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(29, 0 + 2.0, 45, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(29, 0 + 1.0, 45, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Cannon Battery Wall
  box(29, 0, 13, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(29 - 1.5, 0 + 1.4, 13 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(29 + 1.5, 0 + 1.4, 13 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Cannon Battery Wall
  box(33, 0, 9, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(33 - 1.5, 0 + 1.4, 9 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(33 + 1.5, 0 + 1.4, 9 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Stone Watchtower
  box(49, 0, 33, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(49, 0 + 9.0, 33, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Cannon Battery Wall
  box(33, 0, 21, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(33 - 1.5, 0 + 1.4, 21 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(33 + 1.5, 0 + 1.4, 21 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Stone Watchtower
  box(41, 0, 33, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(41, 0 + 9.0, 33, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(33, 0, 29, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(33, 0 + 2.0, 29, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(33, 0 + 1.0, 29, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(5, 0, 41, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(5, 0 + 2.0, 41, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(5, 0 + 1.0, 41, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Cannon Battery Wall
  box(17, 0, 9, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(17 - 1.5, 0 + 1.4, 9 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(17 + 1.5, 0 + 1.4, 9 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Stone Watchtower
  box(41, 0, 17, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(41, 0 + 9.0, 17, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Cannon Battery Wall
  box(13, 0, 17, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(13 - 1.5, 0 + 1.4, 17 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(13 + 1.5, 0 + 1.4, 17 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(29, 0, 21, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(29, 0 + 2.0, 21, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(29, 0 + 1.0, 21, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(25, 0, 25, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(25, 0 + 9.0, 25, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Stone Watchtower
  box(5, 0, 49, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(5, 0 + 9.0, 49, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Stone Watchtower
  box(41, 0, 29, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(41, 0 + 9.0, 29, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Cannon Battery Wall
  box(45, 0, 29, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(45 - 1.5, 0 + 1.4, 29 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(45 + 1.5, 0 + 1.4, 29 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(9, 0, 37, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(9, 0 + 2.0, 37, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(9, 0 + 1.0, 37, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(21, 0, 45, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(21, 0 + 2.0, 45, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(21, 0 + 1.0, 45, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(37, 0, 9, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(37, 0 + 2.0, 9, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(37, 0 + 1.0, 9, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(1, 0, 45, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(1, 0 + 9.0, 45, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(1, 0, 29, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(1, 0 + 2.0, 29, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(1, 0 + 1.0, 29, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(45, 0, 41, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(45, 0 + 2.0, 41, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(45, 0 + 1.0, 41, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Cannon Battery Wall
  box(45, 0, 33, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(45 - 1.5, 0 + 1.4, 33 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(45 + 1.5, 0 + 1.4, 33 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(45, 0, 25, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(45, 0 + 2.0, 25, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(45, 0 + 1.0, 25, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(9, 0, 41, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(9, 0 + 9.0, 41, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(21, 0, 37, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(21, 0 + 2.0, 37, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(21, 0 + 1.0, 37, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(29, 0, 5, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(29, 0 + 2.0, 5, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(29, 0 + 1.0, 5, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Cannon Battery Wall
  box(13, 0, 49, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(13 - 1.5, 0 + 1.4, 49 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(13 + 1.5, 0 + 1.4, 49 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Stone Watchtower
  box(41, 0, 49, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(41, 0 + 9.0, 49, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(49, 0, 9, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(49, 0 + 2.0, 9, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(49, 0 + 1.0, 9, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(9, 0, 45, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(9, 0 + 2.0, 45, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(9, 0 + 1.0, 45, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(21, 0, 13, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(21, 0 + 2.0, 13, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(21, 0 + 1.0, 13, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(1, 0, 37, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(1, 0 + 9.0, 37, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Cannon Battery Wall
  box(9, 0, 21, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(9 - 1.5, 0 + 1.4, 21 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(9 + 1.5, 0 + 1.4, 21 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(29, 0, 1, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(29, 0 + 2.0, 1, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(29, 0 + 1.0, 1, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(17, 0, 49, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(17, 0 + 9.0, 49, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Stone Watchtower
  box(45, 0, 45, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(45, 0 + 9.0, 45, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(13, 0, 41, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(13, 0 + 2.0, 41, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(13, 0 + 1.0, 41, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(25, 0, 29, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(25, 0 + 9.0, 29, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(17, 0, 13, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(17, 0 + 2.0, 13, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(17, 0 + 1.0, 13, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(17, 0, 33, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(17, 0 + 2.0, 33, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(17, 0 + 1.0, 33, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Cannon Battery Wall
  box(17, 0, 17, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(17 - 1.5, 0 + 1.4, 17 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(17 + 1.5, 0 + 1.4, 17 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(33, 0, 17, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(33, 0 + 2.0, 17, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(33, 0 + 1.0, 17, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(41, 0, 41, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(41, 0 + 2.0, 41, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(41, 0 + 1.0, 41, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Cannon Battery Wall
  box(37, 0, 29, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(37 - 1.5, 0 + 1.4, 29 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(37 + 1.5, 0 + 1.4, 29 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(49, 0, 25, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(49, 0 + 2.0, 25, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(49, 0 + 1.0, 25, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Cannon Battery Wall
  box(37, 0, 25, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(37 - 1.5, 0 + 1.4, 25 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(37 + 1.5, 0 + 1.4, 25 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Stone Watchtower
  box(45, 0, 37, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(45, 0 + 9.0, 37, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Stone Watchtower
  box(33, 0, 25, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(33, 0 + 9.0, 25, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(37, 0, 49, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(37, 0 + 2.0, 49, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(37, 0 + 1.0, 49, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Cannon Battery Wall
  box(17, 0, 37, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(17 - 1.5, 0 + 1.4, 37 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(17 + 1.5, 0 + 1.4, 37 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(9, 4.5, 9, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(9, 4.5 + 2.0, 9, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(9, 4.5 + 1.0, 9, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Cannon Battery Wall
  box(9, 0, 49, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(9 - 1.5, 0 + 1.4, 49 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(9 + 1.5, 0 + 1.4, 49 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(9, 4.5, 5, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(9, 4.5 + 2.0, 5, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(9, 4.5 + 1.0, 5, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(41, 0, 1, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(41, 0 + 9.0, 1, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Cannon Battery Wall
  box(41, 0, 25, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(41 - 1.5, 0 + 1.4, 25 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(41 + 1.5, 0 + 1.4, 25 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(29, 0, 41, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(29, 0 + 2.0, 41, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(29, 0 + 1.0, 41, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(33, 0, 13, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(33, 0 + 2.0, 13, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(33, 0 + 1.0, 13, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Cannon Battery Wall
  box(9, 0, 17, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(9 - 1.5, 0 + 1.4, 17 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(9 + 1.5, 0 + 1.4, 17 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Cannon Battery Wall
  box(37, 0, 13, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(37 - 1.5, 0 + 1.4, 13 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(37 + 1.5, 0 + 1.4, 13 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(37, 0, 37, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(37, 0 + 2.0, 37, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(37, 0 + 1.0, 37, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(25, 0, 9, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(25, 0 + 9.0, 9, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Stone Watchtower
  box(5, 4.5, 9, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(5, 4.5 + 9.0, 9, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Stone Watchtower
  box(1, 4.5, 1, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(1, 4.5 + 9.0, 1, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(37, 0, 33, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(37, 0 + 2.0, 33, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(37, 0 + 1.0, 33, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Cannon Battery Wall
  box(5, 4.5, 5, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(5 - 1.5, 4.5 + 1.4, 5 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(5 + 1.5, 4.5 + 1.4, 5 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Stone Watchtower
  box(49, 0, 21, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(49, 0 + 9.0, 21, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(25, 0, 17, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(25, 0 + 2.0, 17, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(25, 0 + 1.0, 17, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(21, 0, 25, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(21, 0 + 9.0, 25, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(17, 0, 45, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(17, 0 + 2.0, 45, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(17, 0 + 1.0, 45, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(17, 0, 21, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(17, 0 + 9.0, 21, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Stone Watchtower
  box(25, 0, 13, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(25, 0 + 9.0, 13, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Stone Watchtower
  box(9, 4.5, 1, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(9, 4.5 + 9.0, 1, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Stone Watchtower
  box(21, 0, 17, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(21, 0 + 9.0, 17, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(49, 0, 49, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(49, 0 + 2.0, 49, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(49, 0 + 1.0, 49, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Cannon Battery Wall
  box(1, 0, 49, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(1 - 1.5, 0 + 1.4, 49 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(1 + 1.5, 0 + 1.4, 49 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(29, 0, 9, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(29, 0 + 2.0, 9, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(29, 0 + 1.0, 9, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(49, 0, 37, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(49, 0 + 9.0, 37, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Cannon Battery Wall
  box(37, 0, 1, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(37 - 1.5, 0 + 1.4, 1 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(37 + 1.5, 0 + 1.4, 1 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(37, 0, 21, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(37, 0 + 2.0, 21, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(37, 0 + 1.0, 21, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(45, 0, 49, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(45, 0 + 2.0, 49, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(45, 0 + 1.0, 49, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(45, 0, 21, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(45, 0 + 9.0, 21, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(25, 0, 49, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(25, 0 + 2.0, 49, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(25, 0 + 1.0, 49, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Cannon Battery Wall
  box(17, 0, 41, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(17 - 1.5, 0 + 1.4, 41 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(17 + 1.5, 0 + 1.4, 41 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(45, 0, 1, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(45, 0 + 2.0, 1, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(45, 0 + 1.0, 1, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(21, 0, 29, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(21, 0 + 2.0, 29, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(21, 0 + 1.0, 29, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(25, 0, 21, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(25, 0 + 9.0, 21, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(5, 4.5, 1, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(5, 4.5 + 2.0, 1, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(5, 4.5 + 1.0, 1, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(49, 0, 5, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(49, 0 + 9.0, 5, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Stone Watchtower
  box(21, 0, 49, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(21, 0 + 9.0, 49, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Cannon Battery Wall
  box(13, 0, 45, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(13 - 1.5, 0 + 1.4, 45 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(13 + 1.5, 0 + 1.4, 45 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(29, 0, 37, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(29, 0 + 2.0, 37, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(29, 0 + 1.0, 37, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(5, 0, 45, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(5, 0 + 9.0, 45, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Prisoner Cage
  box(49, 0, 13, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(49, 0 + 2.0, 13, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(49, 0 + 1.0, 13, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(33, 0, 5, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(33, 0 + 2.0, 5, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(33, 0 + 1.0, 5, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(13, 0, 37, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(13, 0 + 2.0, 37, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(13, 0 + 1.0, 37, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Stone Watchtower
  box(25, 0, 1, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(25, 0 + 9.0, 1, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet

  // Prop: Cannon Battery Wall
  box(41, 0, 37, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(41 - 1.5, 0 + 1.4, 37 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(41 + 1.5, 0 + 1.4, 37 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Cannon Battery Wall
  box(41, 0, 21, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(41 - 1.5, 0 + 1.4, 21 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(41 + 1.5, 0 + 1.4, 21 + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2

  // Prop: Prisoner Cage
  box(49, 0, 45, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(49, 0 + 2.0, 45, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(49, 0 + 1.0, 45, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(25, 0, 37, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(25, 0 + 2.0, 37, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(25, 0 + 1.0, 37, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars

  // Prop: Prisoner Cage
  box(1, 4.5, 5, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(1, 4.5 + 2.0, 5, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(1, 4.5 + 1.0, 5, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars
  // === END DREAM AUTO-INJECTED PROPS ===

  B.finish();
  return L;
}
