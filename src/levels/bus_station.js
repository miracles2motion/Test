import * as THREE from 'three';
import { INK } from '../render.js';
import {
  buildTransitBus,
  buildTerminalClockTower,
  buildTransitBench,
  buildPassengerShelter,
  buildToolRack,
  buildCrateStack,
  buildWarningSign,
  buildTechnicalFraming,
  buildAtmosphericBeams,
  buildInkSplatters
} from '../prefabs.js';

/**
 * CENTRAL BUS STATION (bus_station)
 * Full 3D Hand-Crafted Monumental Urban Transit Terminal Architecture.
 *
 * Architecture & Spatial Flow:
 * 1. Grand Concrete Terminal Concourse:
 *    - North & South arrival terminal façades with glass curtain walls, ticket turnstiles, and information booths.
 *    - Raised Passenger Boarding Platforms (Y = 0.45m) with tactile yellow warning safety curbs.
 * 2. Twin Transit Bus Boarding Bays:
 *    - West Bay (Bay 1): 2 Full 12m Transit Coaches with mantleable roofs, side luggage hatches, and wheel cover.
 *    - East Bay (Bay 2): 2 Full 12m Commuter Express Buses with glass passenger cabins and roof AC pods.
 * 3. Central Mezzanine Skybridge (Tier 2 @ Y = 4.8m):
 *    - 5m wide pedestrian elevated walkway spanning East to West across the terminal.
 *    - Dual access stairways (rise: 0.28m, run: 0.45m) with handrails and intermediate landings.
 * 4. Four-Sided Central Departure Clock Spire (Tier 3 @ Y = 16.0m):
 *    - Giant analog station clock with split-flap destination schedule displays.
 *    - High-altitude apex momentum grapple ring for zipping across the terminal.
 * 5. Cantilevered Steel Bay Canopies & Shelters:
 *    - Massive corrugated steel roofs protecting the passenger islands from rain/fire.
 * 6. Baggage Depots & Turnstile Plazas:
 *    - Stainless-steel luggage trolley stacks, ticket vending machines, and waiting benches.
 */
export function buildBusStation(B, arena = false) {
  const { L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = INK.ORANGE ?? 3, GR = INK.GREEN ?? 4, BK = INK.BLACK ?? 2, BL = INK.BLUE ?? 0, RD = INK.RED ?? 1;

  L.key = 'bus_station';
  const P = arena ? 68 : 55, PH = arena ? 26 : 18, T = 6;
  const D = P - 3;
  L.bounds = { minX: -P, maxX: P, minZ: -P, maxZ: P };

  // =========================================================================
  // 1. GROUND ASPHALT FOUNDATION & TERMINAL RETAINING ENCLOSURE
  // =========================================================================
  // Dark asphalt terminal floor
  box(0, -1.0, 0, 2 * P + T, 1.0, 2 * P + T, { ink: BK });

  // Terminal Pavement Markings & Painted Bus Roadways (Y = 0.012)
  box(-22, 0.012, 0, 18, 0.01, 86, { ink: BK, noCollide: true }); // West bay roadway
  box(22, 0.012, 0, 18, 0.01, 86, { ink: BK, noCollide: true });  // East bay roadway
  box(0, 0.012, 0, 14, 0.01, 86, { ink: BL, noCollide: true });   // Central passenger plaza apron

  // Yellow & White Roadway Striping
  for (let z = -38; z <= 38; z += 8) {
    box(-22, 0.015, z, 0.4, 0.01, 4.0, { ink: OR, noCollide: true });
    box(22, 0.015, z, 0.4, 0.01, 4.0, { ink: OR, noCollide: true });
  }

  // Terminal Boundary Walls (Architectural concrete enclosure with high glass bays)
  box(0, 0, -P, 2 * P + T, PH, T, { ink: BL });
  box(0, 0, P, 2 * P + T, PH, T, { ink: BL });
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: BL });
  box(P, 0, 0, T, PH, 2 * P + T, { ink: BL });

  // Upper boundary glass clerestory windows along walls (Skill: light-mode-paper-technical)
  for (let x = -40; x <= 40; x += 20) {
    box(x, 10, -P + 2.8, 14, 4.5, 0.2, { ink: BK, noCollide: true });
    box(x, 10, P - 2.8, 14, 4.5, 0.2, { ink: BK, noCollide: true });
  }

  // Anti-Camp Sky Ceiling Barrier
  collider(0, PH + 4, 0, 2 * P + 20, 6, 2 * P + 20, { noNav: true, noGrapple: true });

  // =========================================================================
  // 2. RAISED PASSENGER BOARDING PLATFORMS (TIER 1)
  // =========================================================================
  // West Boarding Platform (Island between West bus lanes and center plaza)
  slab(-12, -40, -4, 40, 0.45, 0.45, { ink: BL });
  // Platform tactile safety edge (Yellow/Orange curb strips)
  box(-12, 0.46, 0, 0.35, 0.02, 80, { ink: OR, noCollide: true });
  box(-4, 0.46, 0, 0.35, 0.02, 80, { ink: OR, noCollide: true });

  // East Boarding Platform (Island between center plaza and East bus lanes)
  slab(4, -40, 12, 40, 0.45, 0.45, { ink: BL });
  box(4, 0.46, 0, 0.35, 0.02, 80, { ink: OR, noCollide: true });
  box(12, 0.46, 0, 0.35, 0.02, 80, { ink: OR, noCollide: true });

  // North & South Crosswalk Ramps connecting platforms across bus bays
  for (const z of [-32, 0, 32]) {
    slab(-22, z - 2.0, -12, z + 2.0, 0.25, 0.25, { ink: BL });
    slab(12, z - 2.0, 22, z + 2.0, 0.25, 0.25, { ink: BL });
    // Zebra crosswalk stripes
    for (let s = -20; s <= -14; s += 2) box(s, 0.016, z, 0.8, 0.01, 3.4, { ink: OR, noCollide: true });
    for (let s = 14; s <= 20; s += 2) box(s, 0.016, z, 0.8, 0.01, 3.4, { ink: OR, noCollide: true });
  }

  // =========================================================================
  // 3. FULL TRANSIT COACH FLEET (TIER 3 MACRO VEHICLES)
  // =========================================================================
  // West Bay Coach 1 (Northbound Commuter Express)
  buildTransitBus(B, -22, 0, -22, { inkBody: OR, inkTrim: BK, inkGlass: BL });

  // West Bay Coach 2 (Southbound Airport Shuttle)
  buildTransitBus(B, -22, 0, 22, { inkBody: BL, inkTrim: BK, inkGlass: OR });

  // East Bay Coach 3 (Regional Metro Coach)
  buildTransitBus(B, 22, 0, -22, { inkBody: BL, inkTrim: BK, inkGlass: OR });

  // East Bay Coach 4 (Cross-Country Cruiser)
  buildTransitBus(B, 22, 0, 22, { inkBody: OR, inkTrim: BK, inkGlass: BL });

  // =========================================================================
  // 4. PASSENGER SHELTERS, BENCHES & KIOSKS (TIER 1 & 2 DRESSING)
  // =========================================================================
  // West Platform Passenger Shelters
  buildPassengerShelter(B, -8, 0.45, -20);
  buildPassengerShelter(B, -8, 0.45, 20);

  // East Platform Passenger Shelters
  buildPassengerShelter(B, 8, 0.45, -20);
  buildPassengerShelter(B, 8, 0.45, 20);

  // Freestanding Waiting Benches along platforms
  buildTransitBench(B, -8, 0.45, -8);
  buildTransitBench(B, -8, 0.45, 8);
  buildTransitBench(B, 8, 0.45, -8);
  buildTransitBench(B, 8, 0.45, 8);

  // Ticket Vending Machine Batteries (providing 1.3m chest cover)
  for (const [kx, kz] of [[-7, -35], [7, -35], [-7, 35], [7, 35]]) {
    box(kx, 0.45, kz, 1.2, 1.4, 0.8, { ink: BL, tag: 'cover' });
    box(kx, 1.2, kz + 0.35, 0.7, 0.4, 0.08, { ink: OR, noCollide: true }); // Screen
  }

  // Luggage Trolley Stacks (providing authentic waist defilade)
  for (const [lx, lz] of [[-10, -14], [10, -14], [-10, 14], [10, 14]]) {
    box(lx, 0.45, lz, 1.4, 1.1, 2.2, { ink: BK, tag: 'cover' });
    box(lx, 0.85, lz, 1.2, 0.6, 2.0, { ink: OR, noCollide: true });
  }

  // Luggage Conveyor Baggage Carousel Islands (South Terminal)
  slab(-24, 30, -18, 38, 0.45, 0.45, { ink: BL });
  box(-21, 0.9, 34, 4.0, 0.45, 1.2, { ink: BK, tag: 'cover' });
  slab(18, 30, 24, 38, 0.45, 0.45, { ink: BL });
  box(21, 0.9, 34, 4.0, 0.45, 1.2, { ink: BK, tag: 'cover' });

  // Stainless Steel Turnstile Gates (4 at North Entrance, 4 at South Entrance)
  for (const tz of [-42, 42]) {
    for (let tx = -6; tx <= 6; tx += 3) {
      box(tx, 0.45, tz, 0.25, 1.05, 1.2, { ink: BK, tag: 'cover' });
      box(tx, 1.0, tz, 0.8, 0.08, 0.08, { ink: OR, noCollide: true }); // tripod turnstile arm
    }
  }

  // Timetable Stanchion Totems & Route Maps along concourse
  for (const [sx, sz] of [[-6, -26], [6, -26], [-6, 26], [6, 26], [-16, 0], [16, 0]]) {
    box(sx, 0.45, sz, 0.5, 2.1, 0.5, { ink: BK, tag: 'cover' });
    box(sx, 1.2, sz, 0.54, 0.9, 0.54, { ink: OR, noCollide: true }); // timetable poster
  }

  // Workshop & Maintenance Tool Racks along outer perimeter bays
  buildToolRack(B, -30, 0, -10);
  buildToolRack(B, -30, 0, 10);
  buildToolRack(B, 30, 0, -10);
  buildToolRack(B, 30, 0, 10);
  buildToolRack(B, -30, 0, -20);
  buildToolRack(B, 30, 0, -20);

  // Shipping crate clusters in corner service docks
  buildCrateStack(B, -32, 0, -32);
  buildCrateStack(B, 32, 0, -32);
  buildCrateStack(B, -32, 0, 32);
  buildCrateStack(B, 32, 0, 32);
  buildCrateStack(B, -34, 0, -16);
  buildCrateStack(B, 34, 0, 16);

  // Passenger recycling & waste receptacles (providing micro-cover)
  for (const [wx, wz] of [[-11, -30], [11, -30], [-11, 30], [11, 30], [-11, 0], [11, 0]]) {
    box(wx, 0.45, wz, 0.6, 0.95, 0.6, { ink: GR, tag: 'cover' });
  }

  // Caution warning signage
  buildWarningSign(B, -15, 0, -38);
  buildWarningSign(B, 15, 0, -38);
  buildWarningSign(B, -15, 0, 38);
  buildWarningSign(B, 15, 0, 38);

  // =========================================================================
  // 5. ELEVATED MEZZANINE CONCOURSE SKYBRIDGE (TIER 2 @ Y = 4.8m)
  // =========================================================================
  // Main Skybridge Deck spanning across the entire station from X = -28 to X = +28
  const skyY = 4.8;
  slab(-28, -4.5, 28, 4.5, skyY, 0.4, { ink: BL });

  // Safety Handrails along the Skybridge
  rail(-28, -4.5, 28, -4.5, skyY, { ink: BK });
  rail(-28, 4.5, 28, 4.5, skyY, { ink: BK });

  // Structural Support Columns under Skybridge
  for (const cx of [-20, -8, 8, 20]) {
    cyl(cx, 0, -4.2, 0.35, skyY, { ink: BK });
    cyl(cx, 0, 4.2, 0.35, skyY, { ink: BK });
  }

  // West Access Stairs (Rising from West Platform Y=0.45m to Skybridge Y=4.8m)
  // 15 steps @ rise: 0.29m, run: 0.45m
  const westSteps = 15;
  const westRise = (skyY - 0.45) / westSteps;
  for (let i = 0; i < westSteps; i++) {
    const stepY = 0.45 + i * westRise;
    const stepZ = -4.5 - (i + 1) * 0.45;
    box(-8, stepY, stepZ, 3.2, westRise, 0.45, { ink: BL, tag: 'stairs' });
  }
  // Stair handrails
  rail(-9.6, -4.5, -9.6, -4.5 - westSteps * 0.45, 0.45, { ink: BK, noCollide: true });
  rail(-6.4, -4.5, -6.4, -4.5 - westSteps * 0.45, 0.45, { ink: BK, noCollide: true });

  // East Access Stairs (Rising from East Platform Y=0.45m to Skybridge Y=4.8m)
  for (let i = 0; i < westSteps; i++) {
    const stepY = 0.45 + i * westRise;
    const stepZ = 4.5 + (i + 1) * 0.45;
    box(8, stepY, stepZ, 3.2, westRise, 0.45, { ink: BL, tag: 'stairs' });
  }
  rail(6.4, 4.5, 6.4, 4.5 + westSteps * 0.45, 0.45, { ink: BK, noCollide: true });
  rail(9.6, 4.5, 9.6, 4.5 + westSteps * 0.45, 0.45, { ink: BK, noCollide: true });

  // Waiting benches & kiosk on the Skybridge concourse
  buildTransitBench(B, -18, skyY, 0);
  buildTransitBench(B, 18, skyY, 0);
  box(-14, skyY, 0, 1.2, 1.4, 0.8, { ink: BL, tag: 'cover' });
  box(14, skyY, 0, 1.2, 1.4, 0.8, { ink: BL, tag: 'cover' });

  // Technical Drafting Framing on Skybridge (Skill: light-mode-paper-technical)
  buildTechnicalFraming(B, -28, -4.5, 28, 4.5, skyY, { ink: BK, bracketLength: 1.8 });

  // =========================================================================
  // 6. MONUMENTAL CENTRAL TERMINAL CLOCK TOWER (TIER 3 LANDMARK)
  // =========================================================================
  // Positioned directly at the center of the station concourse
  buildTerminalClockTower(B, 0, skyY, 0, {
    inkStructure: BL,
    inkClock: BK,
    inkAccent: OR
  });

  // Giant Split-Flap Departure Timetable Ribbon suspended above the Skybridge
  box(0, skyY + 3.2, -3.8, 12.0, 1.6, 0.35, { ink: BK });
  box(0, skyY + 3.2, 3.8, 12.0, 1.6, 0.35, { ink: BK });
  for (let x = -5.0; x <= 5.0; x += 1.8) {
    box(x, skyY + 3.2, -3.6, 1.5, 0.25, 0.05, { ink: OR, noCollide: true });
    box(x, skyY + 3.2, 3.6, 1.5, 0.25, 0.05, { ink: OR, noCollide: true });
  }

  // =========================================================================
  // 7. CANTILEVER BAY CANOPY ROOFS (TIER 3 OVERHEAD COVER)
  // =========================================================================
  // West Bus Bay Canopy (Roof spanning Y = 8.5m protecting boarding coach)
  const canopyY = 8.5;
  slab(-30, -32, -14, 32, canopyY, 0.3, { ink: BL });
  for (let z = -24; z <= 24; z += 16) {
    cyl(-22, 0, z, 0.28, canopyY, { ink: BK, noCollide: true });
  }
  // Cantilever angled truss beams
  for (let z = -28; z <= 28; z += 14) {
    cyl(-14, canopyY - 1.2, z, 0.12, 3.8, { axis: 'x', ink: BK, noCollide: true });
    cyl(-30, canopyY - 1.2, z, 0.12, 3.8, { axis: 'x', ink: BK, noCollide: true });
  }

  // East Bus Bay Canopy
  slab(14, -32, 30, 32, canopyY, 0.3, { ink: BL });
  for (let z = -24; z <= 24; z += 16) {
    cyl(22, 0, z, 0.28, canopyY, { ink: BK, noCollide: true });
  }
  for (let z = -28; z <= 28; z += 14) {
    cyl(14, canopyY - 1.2, z, 0.12, 3.8, { axis: 'x', ink: BK, noCollide: true });
    cyl(30, canopyY - 1.2, z, 0.12, 3.8, { axis: 'x', ink: BK, noCollide: true });
  }

  // =========================================================================
  // 8. TRAVERSAL GRAPPLE HIGHWAY & ATMOSPHERIC SKY RAYS
  // =========================================================================
  // Elevated grapple rings positioned with clear radial headroom (>= 2.5m from slabs)
  ring(-22, canopyY + 3.0, -22, 'y'); // Over West Bus 1 canopy
  ring(-22, canopyY + 3.0, 22, 'y');  // Over West Bus 2 canopy
  ring(22, canopyY + 3.0, -22, 'y');  // Over East Bus 3 canopy
  ring(22, canopyY + 3.0, 22, 'y');   // Over East Bus 4 canopy
  ring(-14, skyY + 4.5, 0, 'z');      // Skybridge West portal
  ring(14, skyY + 4.5, 0, 'z');       // Skybridge East portal
  ring(0, skyY + 5.0, -20, 'x');      // Concourse North overlook
  ring(0, skyY + 5.0, 20, 'x');       // Concourse South overlook

  // Crepuscular Atmospheric Sky Rays streaming through skylights (Skill: 3d-sky-rays)
  buildAtmosphericBeams(B, 0, skyY, 0, { ink: OR, h: 22.0 });
  buildAtmosphericBeams(B, -22, 0, 0, { ink: BL, h: 18.0 });
  buildAtmosphericBeams(B, 22, 0, 0, { ink: BL, h: 18.0 });

  // Ink Splatters on ground pavement (Skill: create-game-vfx)
  buildInkSplatters(B, 0, 0.02, 12, { ink: BK, seed: 404 });
  buildInkSplatters(B, -22, 0.02, -10, { ink: BK, seed: 505 });
  buildInkSplatters(B, 22, 0.02, 10, { ink: BK, seed: 606 });

  // =========================================================================
  // 9. SPAWNS, SNIPERS & TACTICAL ITEM PICKUPS
  // =========================================================================
  // Balanced player spawns around terminal concourse
  spawn(0, 0.45, D - 6);   // South main entrance portal (Player start)
  spawn(0, 0.45, -D + 6);  // North arrivals terminal portal
  spawn(-D + 6, 0.45, 0);  // West maintenance dock
  spawn(D - 6, 0.45, 0);   // East express terminal

  if (L.playerStart) {
    L.playerStart.set(0, 0.45, D - 6);
  }

  // 5v5 Team Spawns
  const teamAlpha = [
    [0, 0.45, -D + 8],
    [-8, 0.45, -D + 12],
    [8, 0.45, -D + 12],
    [-18, 0.45, -D + 16],
    [18, 0.45, -D + 16]
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z));

  const teamBravo = [
    [0, 0.45, D - 8],
    [8, 0.45, D - 12],
    [-8, 0.45, D - 12],
    [18, 0.45, D - 16],
    [-18, 0.45, D - 16]
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z));

  L.teamSpawns = [teamAlpha, teamBravo];

  // Sniper Perches (Elevated overlooks with safe line of sight)
  sniper(-22, 3.2, -22); // West Coach 1 roof vantage
  sniper(22, 3.2, 22);   // East Coach 4 roof vantage
  sniper(0, skyY + 4.2, 0); // Skybridge Clock Mezzanine overlook

  // Tactical Pickups distributed across all tiers
  pickup(0, skyY + 4.5, 0);     // Central Clock Tower Mezzanine (Legendary weapon)
  pickup(-22, 3.3, -22);        // West Coach Roof (Armor Shard)
  pickup(22, 3.3, 22);          // East Coach Roof (Armor Shard)
  pickup(-8, 0.5, 0);           // West Passenger Island (Health Kit)
  pickup(8, 0.5, 0);            // East Passenger Island (Health Kit)
  pickup(-28, 0.5, -28);        // NW Cargo Dock (Ammo Crate)
  pickup(28, 0.5, 28);          // SE Cargo Dock (Ammo Crate)

  B.finish();
  return L;
}
