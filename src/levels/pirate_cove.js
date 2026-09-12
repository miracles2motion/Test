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

  // === MACRO STRUCTURE: Galleon Sterncastle at (-43, 0, -25) ===
  box(-43, 0, -25, 8.0, 2.0, 6.0, { ink: BL });
  box(-43, 0 + 2.0, -25, 7.5, 2.5, 5.5, { ink: OR });
  slab(-43 - 4.0, -25 - 3.2, -43 + 4.0, -25 + 3.2, 0 + 4.5, 0.3, { ink: OR });
  rail(-43 - 4.0, -25 - 3.2, -43 + 4.0, -25 - 3.2, 0 + 4.5, { ink: BK });
  rail(-43 - 4.0, -25 + 3.2, -43 + 4.0, -25 + 3.2, 0 + 4.5, { ink: BK });
  rail(-43 - 4.0, -25 - 3.2, -43 - 4.0, -25 + 3.2, 0 + 4.5, { ink: BK });
  box(-43, 0 + 4.8, -25, 1.0, 3.0, 0.5, { ink: BK });
  ring(-43, 0 + 9.3, -25, 'z');
  pickup(-43, 0 + 4.7, -25);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-43, 0, -1) ===
  box(-43 - 2.5, 0, -1 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 + 2.5, 0, -1 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 - 2.5, 0, -1 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 + 2.5, 0, -1 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-43 - 3.0, -1 - 3.0, -43 + 3.0, -1 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-43, 0 + 5.9, -1 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-43, 0 + 5.9, -1 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-43, 0 + 8.3, -1 + 4.0, 'z');
  pickup(-43, 0 + 6.1, -1 - 1.5);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-43, 0, 41) ===
  box(-43 - 2.5, 0, 41 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 + 2.5, 0, 41 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 - 2.5, 0, 41 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 + 2.5, 0, 41 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-43 - 3.0, 41 - 3.0, -43 + 3.0, 41 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-43, 0 + 5.9, 41 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-43, 0 + 5.9, 41 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-43, 0 + 8.3, 41 + 4.0, 'z');
  pickup(-43, 0 + 6.1, 41 - 1.5);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-31, 0, -13) ===
  box(-31 - 2.5, 0, -13 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-31 + 2.5, 0, -13 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-31 - 2.5, 0, -13 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-31 + 2.5, 0, -13 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-31 - 3.0, -13 - 3.0, -31 + 3.0, -13 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-31, 0 + 5.9, -13 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-31, 0 + 5.9, -13 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-31, 0 + 8.3, -13 + 4.0, 'z');
  pickup(-31, 0 + 6.1, -13 - 1.5);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Macro: Suspended Plank Bridge
  box(-31, 0+3, -31, 10, 0.2, 2, { ink: OR }); // Wood plank
  cyl(-31-4.5, 0, -31-0.5, 0.2, 4, { ink: OR }); // Support posts
  cyl(-31+4.5, 0, -31+0.5, 0.2, 4, { ink: OR });

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
  ring(-31+1.5, 0+2, 1, 1.5, { ink: OR }); // Grapple onto the explosive!
  

  // Macro: Gunpowder Overhang & Crane
  box(-31, 0, 17, 12, 0.2, 10, { ink: OR }); // Stone floor
  box(-31-5, 0+0.2, 17, 2, 8, 10, { ink: OR }); // Left cave wall
  box(-31+5, 0+0.2, 17, 2, 8, 10, { ink: OR }); // Right cave wall
  box(-31, 0+8, 17, 12, 1, 10, { ink: OR }); // Cave Roof Overhang
  // Stockpile
  cyl(-31-2, 0+0.2, 17-2, 0.8, 1.5, { ink: GR }); // Volatile Barrel
  cyl(-31-3, 0+0.2, 17-1, 0.8, 1.5, { ink: OR }); // Powder Barrel
  cyl(-31-2.5, 0+1.7, 17-1.5, 0.8, 1.5, { ink: GR }); // Stacked
  // Crane & Suspended Barrel
  box(-31+4, 0+7, 17, 5, 0.4, 0.4, { ink: OR }); // Wood crane arm
  cyl(-31+1.5, 0+4, 17, 0.1, 3, { ink: OR }); // Rope
  cyl(-31+1.5, 0+3, 17, 1.0, 1.5, { ink: OR }); // Hanging explosive
  ring(-31+1.5, 0+2, 17, 1.5, { ink: OR }); // Grapple onto the explosive!
  

  // Macro: Gunpowder Overhang & Crane
  box(-31, 0, 33, 12, 0.2, 10, { ink: OR }); // Stone floor
  box(-31-5, 0+0.2, 33, 2, 8, 10, { ink: OR }); // Left cave wall
  box(-31+5, 0+0.2, 33, 2, 8, 10, { ink: OR }); // Right cave wall
  box(-31, 0+8, 33, 12, 1, 10, { ink: OR }); // Cave Roof Overhang
  // Stockpile
  cyl(-31-2, 0+0.2, 33-2, 0.8, 1.5, { ink: GR }); // Volatile Barrel
  cyl(-31-3, 0+0.2, 33-1, 0.8, 1.5, { ink: OR }); // Powder Barrel
  cyl(-31-2.5, 0+1.7, 33-1.5, 0.8, 1.5, { ink: GR }); // Stacked
  // Crane & Suspended Barrel
  box(-31+4, 0+7, 33, 5, 0.4, 0.4, { ink: OR }); // Wood crane arm
  cyl(-31+1.5, 0+4, 33, 0.1, 3, { ink: OR }); // Rope
  cyl(-31+1.5, 0+3, 33, 1.0, 1.5, { ink: OR }); // Hanging explosive
  ring(-31+1.5, 0+2, 33, 1.5, { ink: OR }); // Grapple onto the explosive!
  

  // Macro: Vertical Shanty Tower
  box(-15, 0, -31, 8, 3, 8, { ink: OR }); // Base shack
  stairs(-15-4.5, 0, -31, 1, 3, 2, 3, { ink: OR }); // Rickety steps up
  box(-15-1, 0+3, -31-1, 6, 3, 6, { ink: BL }); // Second floor offset
  stairs(-15+2.5, 0+3, -31, 1, 3, 2, 1, { ink: OR }); // Steps to roof
  box(-15+1, 0+6, -31+1, 4, 3, 4, { ink: OR }); // Crows nest shack
  ring(-15, 0+10, -31, 1.5, { ink: OR }); // Rope swing anchor

  // Macro: Suspended Plank Bridge
  box(-15, 0+3, -15, 10, 0.2, 2, { ink: OR }); // Wood plank
  cyl(-15-4.5, 0, -15-0.5, 0.2, 4, { ink: OR }); // Support posts
  cyl(-15+4.5, 0, -15+0.5, 0.2, 4, { ink: OR });

  // Macro: Gunpowder Overhang & Crane
  box(-15, 0, 33, 12, 0.2, 10, { ink: OR }); // Stone floor
  box(-15-5, 0+0.2, 33, 2, 8, 10, { ink: OR }); // Left cave wall
  box(-15+5, 0+0.2, 33, 2, 8, 10, { ink: OR }); // Right cave wall
  box(-15, 0+8, 33, 12, 1, 10, { ink: OR }); // Cave Roof Overhang
  // Stockpile
  cyl(-15-2, 0+0.2, 33-2, 0.8, 1.5, { ink: GR }); // Volatile Barrel
  cyl(-15-3, 0+0.2, 33-1, 0.8, 1.5, { ink: OR }); // Powder Barrel
  cyl(-15-2.5, 0+1.7, 33-1.5, 0.8, 1.5, { ink: GR }); // Stacked
  // Crane & Suspended Barrel
  box(-15+4, 0+7, 33, 5, 0.4, 0.4, { ink: OR }); // Wood crane arm
  cyl(-15+1.5, 0+4, 33, 0.1, 3, { ink: OR }); // Rope
  cyl(-15+1.5, 0+3, 33, 1.0, 1.5, { ink: OR }); // Hanging explosive
  ring(-15+1.5, 0+2, 33, 1.5, { ink: OR }); // Grapple onto the explosive!
  

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
  ring(1, 0+5, -31, 1.5, { ink: OR }); // Grapple to escape

  // Macro: The Shattered Bow
  box(1, 0, 33, 8, 3, 10, { ink: OR }); // Front hull
  stairs(1, 0+3, 33-6, 2, -3, 2, 2, { ink: OR }); // Ramps down into the sand
  cyl(1, 0+3, 33+2, 0.4, 8, { ink: OR }); // Main mast
  box(1, 0+7, 33+2, 6, 0.2, 0.2, { ink: OR }); // Yardarm
  box(1, 0+5, 33+2.2, 5, 4, 0.1, { ink: BL, noCollide: true }); // Torn sail
  ring(1, 0+11, 33+2, 1.5, { ink: OR }); // Grapple
  

  // Macro: Leviathan Ribcage & Cursed Treasure
  box(17, 0, -31, 12, 0.5, 8, { ink: OR }); // Sand mound
  // Left Ribs
  cyl(17-3, 0+3, -31-2, 0.4, 6, { ink: OR });
  cyl(17-3, 0+3, -31+2, 0.4, 6, { ink: OR });
  // Right Ribs
  cyl(17+3, 0+3, -31-2, 0.4, 6, { ink: OR });
  cyl(17+3, 0+3, -31+2, 0.4, 6, { ink: OR });
  // Top Spines (Connecting Ribs)
  box(17, 0+6, -31-2, 6.6, 0.4, 0.4, { ink: OR });
  box(17, 0+6, -31+2, 6.6, 0.4, 0.4, { ink: OR });
  // The Cursed Treasure
  box(17, 0+0.5, -31, 1.5, 1, 1, { ink: OR }); // Gold Chest
  box(17, 0+1.5, -31, 0.5, 0.5, 0.5, { ink: OR }); // Iron Lock
  ring(17, 0+5, -31, 1.5, { ink: OR }); // Grapple to escape

  // Macro: The Shattered Bow
  box(17, 0, 33, 8, 3, 10, { ink: OR }); // Front hull
  stairs(17, 0+3, 33-6, 2, -3, 2, 2, { ink: OR }); // Ramps down into the sand
  cyl(17, 0+3, 33+2, 0.4, 8, { ink: OR }); // Main mast
  box(17, 0+7, 33+2, 6, 0.2, 0.2, { ink: OR }); // Yardarm
  box(17, 0+5, 33+2.2, 5, 4, 0.1, { ink: BL, noCollide: true }); // Torn sail
  ring(17, 0+11, 33+2, 1.5, { ink: OR }); // Grapple
  

  // Macro: Leviathan Ribcage & Cursed Treasure
  box(33, 0, -31, 12, 0.5, 8, { ink: OR }); // Sand mound
  // Left Ribs
  cyl(33-3, 0+3, -31-2, 0.4, 6, { ink: OR });
  cyl(33-3, 0+3, -31+2, 0.4, 6, { ink: OR });
  // Right Ribs
  cyl(33+3, 0+3, -31-2, 0.4, 6, { ink: OR });
  cyl(33+3, 0+3, -31+2, 0.4, 6, { ink: OR });
  // Top Spines (Connecting Ribs)
  box(33, 0+6, -31-2, 6.6, 0.4, 0.4, { ink: OR });
  box(33, 0+6, -31+2, 6.6, 0.4, 0.4, { ink: OR });
  // The Cursed Treasure
  box(33, 0+0.5, -31, 1.5, 1, 1, { ink: OR }); // Gold Chest
  box(33, 0+1.5, -31, 0.5, 0.5, 0.5, { ink: OR }); // Iron Lock
  ring(33, 0+5, -31, 1.5, { ink: OR }); // Grapple to escape

  // Macro: Leviathan Ribcage & Cursed Treasure
  box(33, 0, -15, 12, 0.5, 8, { ink: OR }); // Sand mound
  // Left Ribs
  cyl(33-3, 0+3, -15-2, 0.4, 6, { ink: OR });
  cyl(33-3, 0+3, -15+2, 0.4, 6, { ink: OR });
  // Right Ribs
  cyl(33+3, 0+3, -15-2, 0.4, 6, { ink: OR });
  cyl(33+3, 0+3, -15+2, 0.4, 6, { ink: OR });
  // Top Spines (Connecting Ribs)
  box(33, 0+6, -15-2, 6.6, 0.4, 0.4, { ink: OR });
  box(33, 0+6, -15+2, 6.6, 0.4, 0.4, { ink: OR });
  // The Cursed Treasure
  box(33, 0+0.5, -15, 1.5, 1, 1, { ink: OR }); // Gold Chest
  box(33, 0+1.5, -15, 0.5, 0.5, 0.5, { ink: OR }); // Iron Lock
  ring(33, 0+5, -15, 1.5, { ink: OR }); // Grapple to escape

  // Macro: The Captains Quarters (Stern)
  box(33, 0, 1, 10, 3, 10, { ink: OR }); // Lower hull
  stairs(33, 0, 1+6, 2, 3, 2, 0, { ink: OR }); // Ramp into ship
  box(33, 0+3, 1-2, 8, 3, 6, { ink: OR }); // Captains Cabin
  stairs(33-4.5, 0+3, 1+1, 1, 3, 2, 3, { ink: OR }); // Left stairs to poop deck
  stairs(33+4.5, 0+3, 1+1, 1, 3, 2, 1, { ink: OR }); // Right stairs to poop deck
  box(33, 0+6, 1-2, 10, 1, 6, { ink: OR }); // Poop deck roof
  cyl(33, 0+7, 1-2, 0.4, 6, { ink: OR }); // Broken rear mast
  ring(33, 0+13, 1-2, 1.5, { ink: OR }); // Crows nest grapple
  

  // Macro: The Shattered Bow
  box(33, 0, 17, 8, 3, 10, { ink: OR }); // Front hull
  stairs(33, 0+3, 17-6, 2, -3, 2, 2, { ink: OR }); // Ramps down into the sand
  cyl(33, 0+3, 17+2, 0.4, 8, { ink: OR }); // Main mast
  box(33, 0+7, 17+2, 6, 0.2, 0.2, { ink: OR }); // Yardarm
  box(33, 0+5, 17+2.2, 5, 4, 0.1, { ink: BL, noCollide: true }); // Torn sail
  ring(33, 0+11, 17+2, 1.5, { ink: OR }); // Grapple
  

  // Macro: The Captains Quarters (Stern)
  box(33, 0, 33, 10, 3, 10, { ink: OR }); // Lower hull
  stairs(33, 0, 33+6, 2, 3, 2, 0, { ink: OR }); // Ramp into ship
  box(33, 0+3, 33-2, 8, 3, 6, { ink: OR }); // Captains Cabin
  stairs(33-4.5, 0+3, 33+1, 1, 3, 2, 3, { ink: OR }); // Left stairs to poop deck
  stairs(33+4.5, 0+3, 33+1, 1, 3, 2, 1, { ink: OR }); // Right stairs to poop deck
  box(33, 0+6, 33-2, 10, 1, 6, { ink: OR }); // Poop deck roof
  cyl(33, 0+7, 33-2, 0.4, 6, { ink: OR }); // Broken rear mast
  ring(33, 0+13, 33-2, 1.5, { ink: OR }); // Crows nest grapple
  
  box(11.802494230754618, 0, -31.70815655952189, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-50.00067809736688, 0, -45.509959614555285, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-47.40279886143968, 0, 48.950535988050746, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(50.23956370587047, 0, 25.57592275635558, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-30.986143136054178, 0, -9.247645273688164, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(4.677347253657928, 0, 13.890666704358935, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-38.940990367269876, 0, -47.62882478789674, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-15.120711923189887, 0, -15.460068261167315, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(24.573710695965914, 0, -7.220426931715608, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(22.946429575683197, 0, -21.4192874684721, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(44.04119052915506, 0, 48.07548571204366, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(23.07631860356767, 0, 23.99559641789712, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(25.63475745828073, 0, 13.27625096350836, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(30.473153331063585, 0, -46.247368718245596, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-28.50264874127658, 0, -32.54883971176804, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-4.630149998703509, 0, 28.604285034081187, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(45.01222264739667, 0, 4.051578061816969, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-28.205004096743988, 0, -0.562000239869711, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(44.33864976467474, 0, -48.24428146483247, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-48.25572498365439, 0, -17.751840683172368, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(43.705265864311116, 0, 25.693673499407694, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(49.04514200781905, 0, 22.692377172945086, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(16.09322998608107, 0, -25.251571380040115, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(46.54937925350664, 0, -26.54968725140002, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(15.274507521140237, 0, 1.582864778606968, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(17.785329697979193, 0, 11.835193176524086, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(39.26056331217249, 0, 50.29814700898328, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(28.737115512523417, 0, 0.09619726523489192, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-3.695176306685596, 0, 24.841246938666075, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-19.830878558262285, 0, 15.523562569007922, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(13.773673407964083, 0, -10.436190033452888, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-48.62058323273342, 0, -19.3613474825691, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(46.67231915639283, 0, -45.30763522742242, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(49.215020381746626, 0, -47.07704712102637, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(40.8058127694723, 0, 48.96469019848428, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(44.69734178427467, 0, -46.919106051368175, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-26.120225200860926, 0, -5.6648367515388856, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-27.676483577447428, 0, 5.077988027963947, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-46.78183005851095, 0, -49.090366066980465, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(38.32210848999267, 0, -44.00527140025954, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-34.5386907145552, 0, 12.02980336557151, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-5.399591263372372, 0, -17.907329563060607, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-15.11966199858081, 0, 7.780383293662723, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-34.530666246341035, 0, -13.073002743286573, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-28.970128917907473, 0, 38.885487101850714, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(10.805346359845302, 0, -47.41045407736271, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(26.29932811323117, 0, 27.649711485658983, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-42.68571352834954, 0, -8.047504859239872, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-2.6813402748556427, 0, -34.033353978851245, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-20.687011130950573, 0, 30.090827885994216, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(24.585830094761377, 0, -16.082975128763906, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(25.05356057141958, 0, -34.94357005288788, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(27.255418147276274, 0, -32.0646606990477, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(50.26536638168423, 0, 27.011035047817202, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(29.179762957920047, 0, -17.99448865845747, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(16.455470647293723, 0, 38.95346767932003, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-36.29687307212416, 0, 9.470137719191314, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-8.83327455769593, 0, 49.54306913724865, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-44.32807858037121, 0, 34.17615598448013, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(0.46031082678263147, 0, -32.1195014563301, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(7.5856359161635325, 0, 38.47963139380424, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-32.430109552043234, 0, -18.80798464122295, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-6.792591053335045, 0, 25.40271366680392, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-12.224688230209622, 0, 19.98492422412447, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(29.86575139141125, 0, -3.8592580958547913, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-26.76603792769034, 0, 25.449807866765823, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(42.61418831546446, 0, -47.79793127840035, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-23.010222941048866, 0, 21.846266968401707, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-28.109679798878457, 0, 31.636716131014893, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(26.816518232959922, 0, -20.586125589936536, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(34.856693868471964, 0, 23.8223059122582, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(47.39284139884501, 0, -6.810350696236554, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  // === END DREAM AUTO-INJECTED PROPS ===
  B.finish();
  return L;
}
