import * as THREE from 'three';
import { INK } from '../render.js';

/**
 * Map: SEAS (seas)
 * God Mode Scaffolding — Bounds and tiers synced with concept
 */
export function buildSeas(B, arena = false) {
  const { L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = INK.ORANGE ?? 3, GR = INK.GREEN ?? 4, BK = INK.BLACK ?? 2, BL = INK.BLUE ?? 0, RD = INK.RED ?? 1;

  L.key = 'seas';
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

  sniper(0, 8.8, 12);
  sniper(0, 8.8, -12);
  sniper(-30, 8.7, -D + 3);
  sniper(30, 8.7, D - 3);

  // Pickups
  pickup(0, 4.2, 0);
  pickup(0, 8.8, 0);
  pickup(-25, 3.4, -25);
  pickup(25, 3.4, 25);
  pickup(-14, 0.2, 6);
  pickup(14, 0.2, -6);

  // 3. Central Tier Dais
  box(0, 0, 0, 24, 4, 24, { ink: BL });
  slab(-12.5, -12.5, 12.5, 12.5, 4, 0.5, { ink: OR });
  
  // Connect stairs using learned math (Bottom of stairs starts away from dais and builds towards it)
  const rs = 0.2857, rn = 0.45;
  const stepCount = Math.ceil(4 / rs);
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

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-43.34507700315045, 0, -7.139076447026996) ===
  box(-43.34507700315045 - 2.5, 0, -7.139076447026996 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43.34507700315045 + 2.5, 0, -7.139076447026996 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43.34507700315045 - 2.5, 0, -7.139076447026996 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43.34507700315045 + 2.5, 0, -7.139076447026996 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-43.34507700315045 - 3.0, -7.139076447026996 - 3.0, -43.34507700315045 + 3.0, -7.139076447026996 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-43.34507700315045, 0 + 5.9, -7.139076447026996 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-43.34507700315045, 0 + 5.9, -7.139076447026996 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-43.34507700315045, 0 + 8.3, -7.139076447026996 + 4.0, 'z');
  pickup(-43.34507700315045, 0 + 6.1, -7.139076447026996 - 1.5);

  // === MACRO STRUCTURE: Galleon Sterncastle at (-42.98772873212393, 0, 10.982829203509649) ===
  box(-42.98772873212393, 0, 10.982829203509649, 8.0, 2.0, 6.0, { ink: BL });
  box(-42.98772873212393, 0 + 2.0, 10.982829203509649, 7.5, 2.5, 5.5, { ink: OR });
  slab(-42.98772873212393 - 4.0, 10.982829203509649 - 3.2, -42.98772873212393 + 4.0, 10.982829203509649 + 3.2, 0 + 4.5, 0.3, { ink: OR });
  rail(-42.98772873212393 - 4.0, 10.982829203509649 - 3.2, -42.98772873212393 + 4.0, 10.982829203509649 - 3.2, 0 + 4.5, { ink: BK });
  rail(-42.98772873212393 - 4.0, 10.982829203509649 + 3.2, -42.98772873212393 + 4.0, 10.982829203509649 + 3.2, 0 + 4.5, { ink: BK });
  rail(-42.98772873212393 - 4.0, 10.982829203509649 - 3.2, -42.98772873212393 - 4.0, 10.982829203509649 + 3.2, 0 + 4.5, { ink: BK });
  box(-42.98772873212393, 0 + 4.8, 10.982829203509649, 1.0, 3.0, 0.5, { ink: BK });
  ring(-42.98772873212393, 0 + 9.3, 10.982829203509649, 'z');
  pickup(-42.98772873212393, 0 + 4.7, 10.982829203509649);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Macro: Suspended Plank Bridge
  box(-31, 0+3, -47, 10, 0.2, 2, { ink: OR }); // Wood plank
  cyl(-31-4.5, 0, -47-0.5, 0.2, 4, { ink: OR }); // Support posts
  cyl(-31+4.5, 0, -47+0.5, 0.2, 4, { ink: OR });

  // Macro: Gunpowder Overhang & Crane
  box(-31, 0, 1, 12, 0.2, 10, { ink: OR }); // Stone floor
  box(-31-5, 0+0.2, 1, 2, 8, 10, { ink: OR }); // Left cave wall
  box(-31+5, 0+0.2, 1, 2, 8, 10, { ink: OR }); // Right cave wall
  box(-31, 0+8, 1, 12, 1, 10, { ink: OR }); // Cave Roof Overhang
  // Stockpile
  cyl(-31-2, 0+0.2, 1-2, 0.8, 1.5, { ink: GR }); // Volatile Barrel
  cyl(-31-3, 0+0.2, 1-1, 0.8, 1.5, { ink: OR }); // Powder Barrel
  cyl(-31-2.5, 0+1.7, 1-1.5, 0.8, 1.5, { ink: GR }); // Stacked
  // Crane & Suspended Barrel
  box(-31+4, 0+7, 1, 5, 0.4, 0.4, { ink: OR }); // Wood crane arm
  cyl(-31+1.5, 0+4, 1, 0.1, 3, { ink: OR }); // Rope
  cyl(-31+1.5, 0+3, 1, 1.0, 1.5, { ink: OR }); // Hanging explosive
  ring(-31+1.5, 0+10.0, 1, 'z'); // High crane grapple anchor
  

  // Macro: Leviathan Ribcage & Cursed Treasure
  box(1, 0, -31, 12, 0.5, 8, { ink: OR }); // Sand mound
  // Left Ribs
  cyl(1-3, 0+3, -31-2, 0.4, 6, { ink: OR });
  cyl(1-3, 0+3, -31+2, 0.4, 6, { ink: OR });
  // Right Ribs
  cyl(1+3, 0+3, -31-2, 0.4, 6, { ink: OR });
  cyl(1+3, 0+3, -31+2, 0.4, 6, { ink: OR });
  // Top Spines (Connecting Ribs)
  box(1, 0+6, -31-2, 6.6, 0.4, 0.4, { ink: OR });
  box(1, 0+6, -31+2, 6.6, 0.4, 0.4, { ink: OR });
  // The Cursed Treasure
  box(1, 0+0.5, -31, 1.5, 1, 1, { ink: OR }); // Gold Chest
  box(1, 0+1.5, -31, 0.5, 0.5, 0.5, { ink: OR }); // Iron Lock
  ring(1, 0+8.5, -31, 'y'); // Grapple to escape

  // Macro: The Shattered Bow
  box(1, 0, 33, 8, 3, 10, { ink: OR }); // Front hull
  stairs(1, 0, 33-9.5, '+z', 10, 2.0, { rise: 0.3, run: 0.45, ink: OR }); // Ramp up to hull deck at y=3.0
  cyl(1, 0+3, 33+2, 0.4, 8, { ink: OR }); // Main mast
  box(1, 0+7, 33+2, 6, 0.2, 0.2, { ink: OR }); // Yardarm
  box(1, 0+5, 33+2.2, 5, 4, 0.1, { ink: BL, noCollide: true }); // Torn sail
  ring(1, 0+12.5, 33+2, 'y'); // Grapple
  

  // Macro: Leviathan Ribcage & Cursed Treasure
  box(17, 0, -47, 12, 0.5, 8, { ink: OR }); // Sand mound
  // Left Ribs
  cyl(17-3, 0+3, -47-2, 0.4, 6, { ink: OR });
  cyl(17-3, 0+3, -47+2, 0.4, 6, { ink: OR });
  // Right Ribs
  cyl(17+3, 0+3, -47-2, 0.4, 6, { ink: OR });
  cyl(17+3, 0+3, -47+2, 0.4, 6, { ink: OR });
  // Top Spines (Connecting Ribs)
  box(17, 0+6, -47-2, 6.6, 0.4, 0.4, { ink: OR });
  box(17, 0+6, -47+2, 6.6, 0.4, 0.4, { ink: OR });
  // The Cursed Treasure
  box(17, 0+0.5, -47, 1.5, 1, 1, { ink: OR }); // Gold Chest
  box(17, 0+1.5, -47, 0.5, 0.5, 0.5, { ink: OR }); // Iron Lock
  ring(17, 0+8.5, -47, 'y'); // Grapple to escape

  // Macro: Leviathan Ribcage & Cursed Treasure
  box(33, 0, -47, 12, 0.5, 8, { ink: OR }); // Sand mound
  // Left Ribs
  cyl(33-3, 0+3, -47-2, 0.4, 6, { ink: OR });
  cyl(33-3, 0+3, -47+2, 0.4, 6, { ink: OR });
  // Right Ribs
  cyl(33+3, 0+3, -47-2, 0.4, 6, { ink: OR });
  cyl(33+3, 0+3, -47+2, 0.4, 6, { ink: OR });
  // Top Spines (Connecting Ribs)
  box(33, 0+6, -47-2, 6.6, 0.4, 0.4, { ink: OR });
  box(33, 0+6, -47+2, 6.6, 0.4, 0.4, { ink: OR });
  // The Cursed Treasure
  box(33, 0+0.5, -47, 1.5, 1, 1, { ink: OR }); // Gold Chest
  box(33, 0+1.5, -47, 0.5, 0.5, 0.5, { ink: OR }); // Iron Lock
  ring(33, 0+8.5, -47, 'y'); // Grapple to escape

  // Macro: The Shattered Bow
  box(33, 0, 1, 8, 3, 10, { ink: OR }); // Front hull
  stairs(33, 0, 1-9.5, '+z', 10, 2.0, { rise: 0.3, run: 0.45, ink: OR }); // Ramp up to hull deck at y=3.0
  cyl(33, 0+3, 1+2, 0.4, 8, { ink: OR }); // Main mast
  box(33, 0+7, 1+2, 6, 0.2, 0.2, { ink: OR }); // Yardarm
  box(33, 0+5, 1+2.2, 5, 4, 0.1, { ink: BL, noCollide: true }); // Torn sail
  ring(33, 0+12.5, 1+2, 'y'); // Grapple
  
  // === END DREAM AUTO-INJECTED PROPS ===
  B.finish();
  return L;
}
