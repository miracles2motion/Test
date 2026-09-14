import { buildPineTree, buildGiantMushroom, buildHollowLog, buildCampfire, buildWoodStack, buildTrailSign, buildChoppingBlock, buildLoggingCart, buildHollowStump, buildSurveyTable, buildGiantGrass, buildTreehouse, buildToadstoolCluster } from '../prefabs.js';
import * as THREE from 'three';
import { INK } from '../render.js';

/**
 * Map: FOREST (forest)
 * God Mode Scaffolding — Bounds and tiers synced with concept
 */
export function buildForest(B, arena = false) {
  const { L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = INK.ORANGE ?? 3, GR = INK.GREEN ?? 4, BK = INK.BLACK ?? 2, BL = INK.BLUE ?? 0, RD = INK.RED ?? 1;

  L.key = 'forest';
  const P = arena ? 68 : 55, PH = arena ? 30 : 18, T = 6;
  const D = P - 3;
  L.bounds = { minX: -P, maxX: P, minZ: -P, maxZ: P };

  // 1. Foundation & Perimeter Walls
  box(0, -1.0, 0, 2 * P + T, 1.0, 2 * P + T, { ink: GR });
  box(0, 0, -P, 2 * P + T, PH, T, { ink: GR });
  box(0, 0, P, 2 * P + T, PH, T, { ink: GR });
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: GR });
  box(P, 0, 0, T, PH, 2 * P + T, { ink: GR });

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

  // 3. Narrative Sector Topology & Central Feature
  // Centerpiece Crossing: Elevated combat terrace with perimeter circulation and dual access
  const centerW = 20, centerD = 20, centerH = 4.5;
  slab(-centerW / 2, -centerD / 2, centerW / 2, centerD / 2, centerH, 0.45, { ink: OR });
  rail(-centerW / 2, -centerD / 2, centerW / 2, -centerD / 2, centerH, { ink: BK });
  rail(-centerW / 2, centerD / 2, centerW / 2, centerD / 2, centerH, { ink: BK });
  rail(-centerW / 2, -centerD / 2, -centerW / 2, centerD / 2, centerH, { ink: BK });
  rail(centerW / 2, -centerD / 2, centerW / 2, centerD / 2, centerH, { ink: BK });

  // Center Cover nodes (waist-high)
  box(-4, centerH, 0, 1.4, 1.1, 3.2, { ink: GR, tag: 'cover' });
  box(4, centerH, 0, 1.4, 1.1, 3.2, { ink: GR, tag: 'cover' });
  box(0, centerH, -4, 3.2, 1.1, 1.4, { ink: GR, tag: 'cover' });
  box(0, centerH, 4, 3.2, 1.1, 1.4, { ink: GR, tag: 'cover' });
  
  // Dual Ascending Stairways connecting ground to center deck
  const rs = 0.2857, rn = 0.45;
  stairs(0, 0, -17.2, '+z', 16, 3.2, { rise: 0.2813, run: 0.45, ink: OR });
  stairs(0, 0, 17.2, '-z', 16, 3.2, { rise: 0.2813, run: 0.45, ink: OR });

  // 4. Tactical Quadrant Platforms & Flanking Lanes
  // NW Quadrant: Elevated Base Platform
  slab(-38, -38, -20, -20, 3.6, 0.4, { ink: GR });
  stairs(-14.15, 0, -29, '-x', 13, 2.8, { rise: 0.2769, run: 0.45, ink: OR });
  box(-29, 3.6, -23, 2.0, 1.1, 2.0, { ink: BK, tag: 'cover' });

  // NE Quadrant: Sniper Lookout Bastion
  slab(20, -38, 38, -20, 7.6499999999999995, 0.4, { ink: GR });
  stairs(7.85, 0, -29, '+x', 27, 2.8, { rise: 0.2833, run: 0.45, ink: OR });
  box(29, 7.6499999999999995, -23, 2.2, 1.1, 2.2, { ink: BK, tag: 'cover' });

  // SW Quadrant: CQB Crucible Defilade
  slab(-38, 20, -20, 38, 3.6, 0.4, { ink: GR });
  stairs(-14.15, 0, 29, '-x', 13, 2.8, { rise: 0.2769, run: 0.45, ink: OR });
  box(-29, 3.6, 23, 2.0, 1.1, 2.0, { ink: BK, tag: 'cover' });

  // SE Quadrant: Flank Anchor Platform
  slab(20, 20, 38, 38, 3.6, 0.4, { ink: GR });
  stairs(14.15, 0, 29, '+x', 13, 2.8, { rise: 0.2769, run: 0.45, ink: OR });
  box(29, 3.6, 23, 2.0, 1.1, 2.0, { ink: BK, tag: 'cover' });

  // 5. Overhead Traversal Ring Network
  ring(0, 12.5, 0, 'y');
  ring(-29, 12, -29, 'y');
  ring(29, 12, -29, 'y');
  ring(-29, 12, 29, 'y');
  ring(29, 12, 29, 'y');

  // Ground collision floor
  collider(0, -2, 0, 2 * P + 20, 2, 2 * P + 20);
  L.playerStart.set(0, 0.2, D - 5); 
  
  
  

  
  
  
  // === DREAM AUTO-INJECTED MACRO STRUCTURES ===

  // === MACRO STRUCTURE: Stonehenge Hollow Altar at (-36.092696469966754, 0, -42.29160233842477) ===
  box(-36.092696469966754 - 2.8, 0, -42.29160233842477, 1.2, 4.5, 1.2, { ink: BK });
  box(-36.092696469966754 + 2.8, 0, -42.29160233842477, 1.2, 4.5, 1.2, { ink: BK });
  slab(-36.092696469966754 - 3.5, -42.29160233842477 - 1.5, -36.092696469966754 + 3.5, -42.29160233842477 + 1.5, 0 + 4.5, 0.6, { ink: BK });
  cyl(-36.092696469966754, 0, -42.29160233842477, 1.6, 1.4, { seg: 8, ink: GR });
  slab(-36.092696469966754 - 2.0, -42.29160233842477 - 2.0, -36.092696469966754 + 2.0, -42.29160233842477 + 2.0, 0 + 1.4, 0.3, { ink: OR });
  ring(-36.092696469966754, 0 + 7.8, -42.29160233842477, 'z');
  pickup(-36.092696469966754, 0 + 1.6, -42.29160233842477);

  // === MACRO STRUCTURE: Stonehenge Hollow Altar at (-31, 0, 11) ===
  box(-31 - 2.8, 0, 11, 1.2, 4.5, 1.2, { ink: BK });
  box(-31 + 2.8, 0, 11, 1.2, 4.5, 1.2, { ink: BK });
  slab(-31 - 3.5, 11 - 1.5, -31 + 3.5, 11 + 1.5, 0 + 4.5, 0.6, { ink: BK });
  cyl(-31, 0, 11, 1.6, 1.4, { seg: 8, ink: GR });
  slab(-31 - 2.0, 11 - 2.0, -31 + 2.0, 11 + 2.0, 0 + 1.4, 0.3, { ink: OR });
  ring(-31, 0 + 7.8, 11, 'z');
  pickup(-31, 0 + 1.6, 11);

  // === MACRO STRUCTURE: Stonehenge Hollow Altar at (-24.201343854197933, 0, -13.467528440829113) ===
  box(-24.201343854197933 - 2.8, 0, -13.467528440829113, 1.2, 4.5, 1.2, { ink: BK });
  box(-24.201343854197933 + 2.8, 0, -13.467528440829113, 1.2, 4.5, 1.2, { ink: BK });
  slab(-24.201343854197933 - 3.5, -13.467528440829113 - 1.5, -24.201343854197933 + 3.5, -13.467528440829113 + 1.5, 0 + 4.5, 0.6, { ink: BK });
  cyl(-24.201343854197933, 0, -13.467528440829113, 1.6, 1.4, { seg: 8, ink: GR });
  slab(-24.201343854197933 - 2.0, -13.467528440829113 - 2.0, -24.201343854197933 + 2.0, -13.467528440829113 + 2.0, 0 + 1.4, 0.3, { ink: OR });
  ring(-24.201343854197933, 0 + 7.8, -13.467528440829113, 'z');
  pickup(-24.201343854197933, 0 + 1.6, -13.467528440829113);

  // === MACRO STRUCTURE: Stonehenge Hollow Altar at (-19, 0, -43) ===
  box(-19 - 2.8, 0, -43, 1.2, 4.5, 1.2, { ink: BK });
  box(-19 + 2.8, 0, -43, 1.2, 4.5, 1.2, { ink: BK });
  slab(-19 - 3.5, -43 - 1.5, -19 + 3.5, -43 + 1.5, 0 + 4.5, 0.6, { ink: BK });
  cyl(-19, 0, -43, 1.6, 1.4, { seg: 8, ink: GR });
  slab(-19 - 2.0, -43 - 2.0, -19 + 2.0, -43 + 2.0, 0 + 1.4, 0.3, { ink: OR });
  ring(-19, 0 + 7.8, -43, 'z');
  pickup(-19, 0 + 1.6, -43);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Prefab: Fly Agaric Toadstool Cluster
  buildToadstoolCluster(B, -47.0, 0, -31.0, 3);

  // Prefab: Canopy Survey Table & Field Instruments
  buildSurveyTable(B, -47.0, 0, -15.0);

  // Prefab: Run-Through Hollow Log Tunnel
  buildHollowLog(B, -47.0, 0, 17.0, 10);

  // Prefab: Cordwood Fuel Stack (Waist-High Tactical Cover)
  buildWoodStack(B, -31.0, 0, -31.0);

  // Prefab: Woodcutter's Chopping Block & Embedded Axe
  buildChoppingBlock(B, 17.0, 0, -47.0);
  // === END DREAM AUTO-INJECTED PROPS ===
  B.finish();
  return L;
}
