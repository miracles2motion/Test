import { buildSolarArray, buildCryoPod, buildAirlockHatch, buildHydroponicTray, buildCommunicationsDish, buildOxygenTankRack, buildTelemetryConsole } from '../prefabs.js';
import * as THREE from 'three';
import { INK } from '../render.js';

/**
 * Map: SPACE STATION (space_station)
 * God Mode Scaffolding — Bounds and tiers synced with concept
 */
export function buildSpaceStation(B, arena = false) {
  const { L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = INK.ORANGE ?? 3, GR = INK.GREEN ?? 4, BK = INK.BLACK ?? 2, BL = INK.BLUE ?? 0, RD = INK.RED ?? 1;

  L.key = 'space_station';
  const P = arena ? 68 : 55, PH = arena ? 67 : 55, T = 6;
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

  sniper(0, 7.3, 12);
  sniper(0, 7.3, -12);
  sniper(-30, 7.2, -D + 3);
  sniper(30, 7.2, D - 3);

  // Pickups
  pickup(0, 3.7, 0);
  pickup(0, 7.3, 0);
  pickup(-25, 2.9, -25);
  pickup(25, 2.9, 25);
  pickup(-14, 0.2, 6);
  pickup(14, 0.2, -6);

  // 3. Narrative Sector Topology & Central Feature
  // Centerpiece Crossing: Elevated combat terrace with perimeter circulation and dual access
  const centerW = 20, centerD = 20, centerH = 3.5;
  slab(-centerW / 2, -centerD / 2, centerW / 2, centerD / 2, centerH, 0.45, { ink: OR });
  rail(-centerW / 2, -centerD / 2, centerW / 2, -centerD / 2, centerH, { ink: BK });
  rail(-centerW / 2, centerD / 2, centerW / 2, centerD / 2, centerH, { ink: BK });
  rail(-centerW / 2, -centerD / 2, -centerW / 2, centerD / 2, centerH, { ink: BK });
  rail(centerW / 2, -centerD / 2, centerW / 2, centerD / 2, centerH, { ink: BK });

  // Center Cover nodes (waist-high)
  box(-4, centerH, 0, 1.4, 1.1, 3.2, { ink: BL, tag: 'cover' });
  box(4, centerH, 0, 1.4, 1.1, 3.2, { ink: BL, tag: 'cover' });
  box(0, centerH, -4, 3.2, 1.1, 1.4, { ink: BL, tag: 'cover' });
  box(0, centerH, 4, 3.2, 1.1, 1.4, { ink: BL, tag: 'cover' });
  
  // Dual Ascending Stairways connecting ground to center deck
  const rs = 0.2857, rn = 0.45;
  stairs(0, 0, -15.4, '+z', 12, 3.2, { rise: 0.2917, run: 0.45, ink: OR });
  stairs(0, 0, 15.4, '-z', 12, 3.2, { rise: 0.2917, run: 0.45, ink: OR });

  // 4. Tactical Quadrant Platforms & Flanking Lanes
  // NW Quadrant: Elevated Base Platform
  slab(-38, -38, -20, -20, 2.8000000000000003, 0.4, { ink: BL });
  stairs(-15.5, 0, -29, '-x', 10, 2.8, { rise: 0.28, run: 0.45, ink: OR });
  box(-29, 2.8000000000000003, -23, 2.0, 1.1, 2.0, { ink: BK, tag: 'cover' });

  // NE Quadrant: Sniper Lookout Bastion
  slab(20, -38, 38, -20, 5.95, 0.4, { ink: BL });
  stairs(10.55, 0, -29, '+x', 21, 2.8, { rise: 0.2833, run: 0.45, ink: OR });
  box(29, 5.95, -23, 2.2, 1.1, 2.2, { ink: BK, tag: 'cover' });

  // SW Quadrant: CQB Crucible Defilade
  slab(-38, 20, -20, 38, 2.8000000000000003, 0.4, { ink: BL });
  stairs(-15.5, 0, 29, '-x', 10, 2.8, { rise: 0.28, run: 0.45, ink: OR });
  box(-29, 2.8000000000000003, 23, 2.0, 1.1, 2.0, { ink: BK, tag: 'cover' });

  // SE Quadrant: Flank Anchor Platform
  slab(20, 20, 38, 38, 2.8000000000000003, 0.4, { ink: BL });
  stairs(15.5, 0, 29, '+x', 10, 2.8, { rise: 0.28, run: 0.45, ink: OR });
  box(29, 2.8000000000000003, 23, 2.0, 1.1, 2.0, { ink: BK, tag: 'cover' });

  // 5. Overhead Traversal Ring Network
  ring(0, 10.5, 0, 'y');
  ring(-29, 10, -29, 'y');
  ring(29, 10, -29, 'y');
  ring(-29, 10, 29, 'y');
  ring(29, 10, 29, 'y');

  // Ground collision floor
  collider(0, -2, 0, 2 * P + 20, 2, 2 * P + 20);
  L.playerStart.set(0, 0.2, D - 5); 
  
  
  // === DREAM AUTO-INJECTED MACRO STRUCTURES ===

  // === MACRO STRUCTURE: Deep-Space Telemetry Bastion at (-43, 0, -13) ===
  box(-43 - 2.8, 0, -13 - 2.8, 0.8, 5.0, 0.8, { ink: BK });
  box(-43 + 2.8, 0, -13 - 2.8, 0.8, 5.0, 0.8, { ink: BK });
  box(-43 - 2.8, 0, -13 + 2.8, 0.8, 5.0, 0.8, { ink: BK });
  box(-43 + 2.8, 0, -13 + 2.8, 0.8, 5.0, 0.8, { ink: BK });
  slab(-43 - 3.5, -13 - 3.5, -43 + 3.5, -13 + 3.5, 0 + 4.5, 0.4, { ink: OR });
  rail(-43 - 3.5, -13 - 3.5, -43 + 3.5, -13 - 3.5, 0 + 4.5, { ink: OR });
  rail(-43 - 3.5, -13 + 3.5, -43 + 3.5, -13 + 3.5, 0 + 4.5, { ink: OR });
  cyl(-43, 0 + 4.9, -13, 2.4, 0.8, { seg: 8, ink: BL });
  cyl(-43, 0 + 5.7, -13, 0.25, 2.4, { ink: BK });
  ring(-43, 0 + 8.8, -13, 'z');
  pickup(-43, 0 + 4.9, -13 + 2.0);

  // === MACRO STRUCTURE: Orbital Centrifuge Habitat Hub at (-41.5418709332926, 0, 5.435419258615266) ===
  box(-41.5418709332926, 0, 5.435419258615266, 8.4, 0.8, 8.4, { ink: BL });
  cyl(-41.5418709332926, 0 + 0.8, 5.435419258615266, 1.8, 4.5, { seg: 8, ink: BL });
  slab(-41.5418709332926 - 4.2, 5.435419258615266 - 4.2, -41.5418709332926 + 4.2, 5.435419258615266 + 4.2, 0 + 4.0, 0.4, { ink: OR });
  rail(-41.5418709332926 - 4.2, 5.435419258615266 - 4.2, -41.5418709332926 + 4.2, 5.435419258615266 - 4.2, 0 + 4.0, { ink: OR });
  rail(-41.5418709332926 - 4.2, 5.435419258615266 + 4.2, -41.5418709332926 + 4.2, 5.435419258615266 + 4.2, 0 + 4.0, { ink: OR });
  box(-41.5418709332926, 0 + 4.8, 5.435419258615266, 2.0, 1.2, 2.0, { ink: BK });
  ring(-41.5418709332926, 0 + 8.8, 5.435419258615266, 'y');
  pickup(-41.5418709332926, 0 + 4.4, 5.435419258615266);

  // === MACRO STRUCTURE: Deep-Space Telemetry Bastion at (-24.25550381664977, 0, -14.34108568974164) ===
  box(-24.25550381664977 - 2.8, 0, -14.34108568974164 - 2.8, 0.8, 5.0, 0.8, { ink: BK });
  box(-24.25550381664977 + 2.8, 0, -14.34108568974164 - 2.8, 0.8, 5.0, 0.8, { ink: BK });
  box(-24.25550381664977 - 2.8, 0, -14.34108568974164 + 2.8, 0.8, 5.0, 0.8, { ink: BK });
  box(-24.25550381664977 + 2.8, 0, -14.34108568974164 + 2.8, 0.8, 5.0, 0.8, { ink: BK });
  slab(-24.25550381664977 - 3.5, -14.34108568974164 - 3.5, -24.25550381664977 + 3.5, -14.34108568974164 + 3.5, 0 + 4.5, 0.4, { ink: OR });
  rail(-24.25550381664977 - 3.5, -14.34108568974164 - 3.5, -24.25550381664977 + 3.5, -14.34108568974164 - 3.5, 0 + 4.5, { ink: OR });
  rail(-24.25550381664977 - 3.5, -14.34108568974164 + 3.5, -24.25550381664977 + 3.5, -14.34108568974164 + 3.5, 0 + 4.5, { ink: OR });
  cyl(-24.25550381664977, 0 + 4.9, -14.34108568974164, 2.4, 0.8, { seg: 8, ink: BL });
  cyl(-24.25550381664977, 0 + 5.7, -14.34108568974164, 0.25, 2.4, { ink: BK });
  ring(-24.25550381664977, 0 + 8.8, -14.34108568974164, 'z');
  pickup(-24.25550381664977, 0 + 4.9, -14.34108568974164 + 2.0);

  // === MACRO STRUCTURE: Orbital Centrifuge Habitat Hub at (-25, 0, 5) ===
  box(-25, 0, 5, 8.4, 0.8, 8.4, { ink: BL });
  cyl(-25, 0 + 0.8, 5, 1.8, 4.5, { seg: 8, ink: BL });
  slab(-25 - 4.2, 5 - 4.2, -25 + 4.2, 5 + 4.2, 0 + 4.0, 0.4, { ink: OR });
  rail(-25 - 4.2, 5 - 4.2, -25 + 4.2, 5 - 4.2, 0 + 4.0, { ink: OR });
  rail(-25 - 4.2, 5 + 4.2, -25 + 4.2, 5 + 4.2, 0 + 4.0, { ink: OR });
  box(-25, 0 + 4.8, 5, 2.0, 1.2, 2.0, { ink: BK });
  ring(-25, 0 + 8.8, 5, 'y');
  pickup(-25, 0 + 4.4, 5);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Prefab: Telemetry Flight Station & Avionics Terminal
  buildTelemetryConsole(B, -47.0, 0, -47.0);

  // Prefab: Pressurized Airlock Hatch Bulkhead
  buildAirlockHatch(B, -47.0, 0, -31.0);

  // Prefab: Pressurized Airlock Hatch Bulkhead
  buildAirlockHatch(B, -47.0, 0, 17.0);

  // Prefab: Hydroponic Algae Growth Bay
  buildHydroponicTray(B, -47.0, 0, 33.0);

  // Prefab: High-Pressure Oxygen Tank Rack
  buildOxygenTankRack(B, -31.0, 0, -47.0);

  // Prefab: Cryo-Stasis Sleeper Pod
  buildCryoPod(B, -31.0, 0, -15.0);

  // Prefab: Telemetry Flight Station & Avionics Terminal
  buildTelemetryConsole(B, -31.0, 0, 17.0);

  // Prefab: Hydroponic Algae Growth Bay
  buildHydroponicTray(B, -15.0, 0, -47.0);

  // Prefab: Telemetry Flight Station & Avionics Terminal
  buildTelemetryConsole(B, -15.0, 0, -15.0);

  // Prefab: Articulated Photovoltaic Solar Array
  buildSolarArray(B, -15.0, 0, 17.0);

  // Prefab: Telemetry Flight Station & Avionics Terminal
  buildTelemetryConsole(B, -15.0, 0, 33.0);

  // Prefab: Telemetry Flight Station & Avionics Terminal
  buildTelemetryConsole(B, 1.0, 0, -31.0);

  // Prefab: Hydroponic Algae Growth Bay
  buildHydroponicTray(B, 1.0, 0, 33.0);

  // Prefab: Pressurized Airlock Hatch Bulkhead
  buildAirlockHatch(B, 17.0, 0, -47.0);

  // Prefab: High-Pressure Oxygen Tank Rack
  buildOxygenTankRack(B, 17.0, 0, -15.0);

  // Prefab: Pressurized Airlock Hatch Bulkhead
  buildAirlockHatch(B, 17.0, 0, 1.0);

  // Prefab: Telemetry Flight Station & Avionics Terminal
  buildTelemetryConsole(B, 17.0, 0, 17.0);

  // Prefab: High-Pressure Oxygen Tank Rack
  buildOxygenTankRack(B, 33.0, 0, -47.0);

  // Prefab: Cryo-Stasis Sleeper Pod
  buildCryoPod(B, 33.0, 0, -31.0);

  // Prefab: Articulated Photovoltaic Solar Array
  buildSolarArray(B, 33.0, 0, -15.0);

  // Prefab: Deep-Space Communications Parabolic Dish
  buildCommunicationsDish(B, 33.0, 0, 1.0);

  // Prefab: Cryo-Stasis Sleeper Pod
  buildCryoPod(B, 33.0, 0, 17.0);
  buildAirlockHatch(B, 0.0, 0, 0.0);
  // === END DREAM AUTO-INJECTED PROPS ===
  B.finish();
  return L;
}
