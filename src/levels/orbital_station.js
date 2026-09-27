import * as THREE from 'three';
import { INK, makeInkMaterial } from '../render.js';
import {
  buildSolarArray,
  buildCommunicationsDish,
  buildCryoPod,
  buildOxygenTankRack,
  buildTelemetryConsole,
  buildHoloPylon,
  buildTechnicalFraming,
  buildAtmosphericBeams,
  buildCrateStack,
  buildToolRack,
  buildWarningSign
} from '../prefabs.js';

/**
 * ============================================================================
 * ORBITAL RESEARCH STATION (AEGIS-9) - orbital_station
 * ============================================================================
 * A deep-space orbital habitat and high-energy physics laboratory built
 * from technical drafting instruments, solar trusses, and pressurized modules.
 *
 * Major Sectors:
 * 1. THE FUSION REACTOR PIT (Mid): Sunken plasma containment core (Y=-1.8m)
 *    with magnetic confinement coils and elevated central bridge (Y=1.8m).
 * 2. CENTRIFUGE GRAVITY RING (Mid-High): Revolving annular deck (Y=4.2m)
 *    with 4 radial pressurized spokes connecting to the core hub.
 * 3. SOLAR WING TRUSSES (West Lane): Dual high-altitude photovoltaic catwalks
 *    (Y=5.6m to 10.0m) with solar panel arrays and communications mast.
 * 4. HYDROPONICS & EVA AIRLOCK (East Lane): Bio-dome pressurized arches,
 *    oxygen tank manifolds, cryo pods, and containment airlock doors.
 * 5. COMMAND TELEMETRY BRIDGE (North): Elevated bridge deck (Y=7.0m)
 *    with navigation holotanks and orbital telemetry arrays.
 * 6. SHUTTLE DOCKING BAY (South): Cargo transit staging area with freight
 *    containers and fueling umbilicals.
 */
export function buildOrbitalStation(B, arena = false) {
  const {
    L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring,
    spawn, sniper, pickup, planes, arch, wedge, finish
  } = B;

  const OR = INK.ORANGE;
  const GR = INK.GREEN;
  const BK = INK.BLACK;
  const BL = INK.BLUE;
  const RD = INK.RED;

  L.key = 'orbital_station';
  L.playerStart.set(0, 0.5, 42);

  const P = arena ? 68 : 55;
  const PH = arena ? 28 : 20;
  const T = 5.0; // Perimeter wall thickness
  L.bounds.minX = -P; L.bounds.maxX = P;
  L.bounds.minZ = -P; L.bounds.maxZ = P;

  // =========================================================================
  // 1. FOUNDATION BEDROCK & PRESSURIZED HULL ENCLOSURE
  // =========================================================================
  // Deep space-frame foundation plinth (seals underside of station at Y = -2.4m)
  slab(-58, -58, 58, 58, -2.4, 0.6, { ink: BK, noCollide: true });
  wallX(-P, P, P, -2.4, 2.4, T, [], { ink: BK, noCollide: true });
  wallX(-P, P, -P, -2.4, 2.4, T, [], { ink: BK, noCollide: true });
  wallZ(-P, P, -P, -2.4, 2.4, T, [], { ink: BK, noCollide: true });
  wallZ(-P, P, P, -2.4, 2.4, T, [], { ink: BK, noCollide: true });

  // Main Station Deck (Y = 0.0m) with clean rectangular cutouts for the Reactor Pit
  // Reactor Pit occupies X in [-14, 14], Z in [-14, 14]
  slab(-P, -P, P, -14, 0.0, 0.5, { ink: BL, tag: 'ground' });      // North quadrant deck
  slab(-P, 14, P, P, 0.0, 0.5, { ink: BL, tag: 'ground' });        // South quadrant deck
  slab(-P, -14, -14, 14, 0.0, 0.5, { ink: BL, tag: 'ground' });    // West wing deck
  slab(14, -14, P, 14, 0.0, 0.5, { ink: BL, tag: 'ground' });      // East wing deck

  // Technical Floor Striping & Hazard Markings (Drafting grid decals)
  for (let z = -40; z <= 40; z += 10) {
    box(-24, 0.012, z, 0.4, 0.01, 5.0, { ink: OR, noCollide: true });
    box(24, 0.012, z, 0.4, 0.01, 5.0, { ink: OR, noCollide: true });
  }

  // Outer Pressurized Station Hull Walls
  wallX(-P, P, P, 0, PH, T, [[-6, 6, 0, 8]], { ink: BK }); // South Shuttle Airway
  wallX(-P, P, -P, 0, PH, T, [], { ink: BK });             // North Deep Space Wall
  wallZ(-P, P, -P, 0, PH, T, [], { ink: BK });             // West Solar Wing Wall
  wallZ(-P, P, P, 0, PH, T, [], { ink: BK });              // East Airlock Wall

  // High Perimeter Service Catwalks (Y = 7.0m)
  slab(-P + T, -P + T, -P + T + 3.0, 15.0, 7.0, 0.4, { ink: OR, tag: 'walkway' });
  slab(-P + T, 27.0, -P + T + 3.0, P - T, 7.0, 0.4, { ink: OR, tag: 'walkway' });
  slab(P - T - 3.0, -P + T, P - T, 15.0, 7.0, 0.4, { ink: OR, tag: 'walkway' });
  slab(P - T - 3.0, 27.0, P - T, P - T, 7.0, 0.4, { ink: OR, tag: 'walkway' });

  // Perimeter Walkway Access Stairs (Rise: 0.28m, Run: 0.45m)
  stairs(-P + T + 1.5, 0, 15.0, '+z', 25, 2.4, { rise: 7.0 / 25, run: 0.46, ink: OR });
  stairs(P - T - 1.5, 0, 15.0, '+z', 25, 2.4, { rise: 7.0 / 25, run: 0.46, ink: OR });

  // Station Perimeter Parapet Battlement Panels (Technical Shrouds)
  for (let wz = -36; wz <= 36; wz += 8) {
    if (wz >= 13 && wz <= 27) continue;
    box(-P + T + 3.1, 7.0, wz, 0.35, 0.9, 1.4, { ink: BK, noCollide: true });
    box(-P + T + 3.1, 7.9, wz, 0.3, 0.3, 0.8, { ink: OR, noCollide: true });
    box(P - T - 3.1, 7.0, wz, 0.35, 0.9, 1.4, { ink: BK, noCollide: true });
    box(P - T - 3.1, 7.9, wz, 0.3, 0.3, 0.8, { ink: OR, noCollide: true });
  }

  // Structural Under-Chassis Cantilever Trusses supporting Perimeter Catwalks
  for (let wz = -36; wz <= 36; wz += 12) {
    box(-P + T + 1.5, 4.0, wz, 2.8, 0.4, 0.4, { ink: BK, noCollide: true });
    cyl(-P + T + 2.8, 2.0, wz, 0.15, 4.0, { ink: OR, noCollide: true });
    box(P - T - 1.5, 4.0, wz, 2.8, 0.4, 0.4, { ink: BK, noCollide: true });
    cyl(P - T - 2.8, 2.0, wz, 0.15, 4.0, { ink: OR, noCollide: true });
  }

  // =========================================================================
  // 2. HERO LANDMARK: SUNKEN FUSION REACTOR & PLASMA PIT (Mid: 0, 0)
  // =========================================================================
  const rX = 0, rZ = 0;
  // Sunken Containment Chamber Floor (Y = -1.8m, 26m x 26m)
  slab(-13, -13, 13, 13, -1.8, 0.4, { ink: BK, tag: 'ground' });

  // Chamber Retaining Walls from Y=-1.8m to 0.0m
  wallX(-13, 13, 13, -1.8, 1.8, 0.8, [[-4, 4, 0, 1.8]], { ink: BK });  // South access breach
  wallX(-13, 13, -13, -1.8, 1.8, 0.8, [[-4, 4, 0, 1.8]], { ink: BK }); // North access breach
  wallZ(-13, 13, -13, -1.8, 1.8, 0.8, [[-4, 4, 0, 1.8]], { ink: BK }); // West access breach
  wallZ(-13, 13, 13, -1.8, 1.8, 0.8, [[-4, 4, 0, 1.8]], { ink: BK });  // East access breach

  // 4 Cardinal Sloped Ramps descending into the Reactor Pit
  stairs(0, -1.8, 13.0, '-z', 6, 3.6, { rise: 1.8 / 6, run: 0.48, ink: OR });
  stairs(0, -1.8, -13.0, '+z', 6, 3.6, { rise: 1.8 / 6, run: 0.48, ink: OR });
  stairs(13.0, -1.8, 0, '-x', 6, 3.6, { rise: 1.8 / 6, run: 0.48, ink: OR });
  stairs(-13.0, -1.8, 0, '+x', 6, 3.6, { rise: 1.8 / 6, run: 0.48, ink: OR });

  // Central Plasma Core Reactor Column (Y = -1.8m to 3.6m)
  cyl(rX, -1.8, rZ, 3.2, 5.4, { seg: 16, ink: BK });
  // Glowing Toroidal Magnetic Confinement Coils
  cyl(rX, -0.6, rZ, 4.0, 0.4, { seg: 16, ink: OR, noCollide: true });
  cyl(rX, 1.2, rZ, 4.0, 0.4, { seg: 16, ink: OR, noCollide: true });

  // Central Walkable Core Catwalk Platform (Y = 1.8m, bridging across pit)
  box(0, 1.8, 0, 3.2, 0.4, 18.0, { ink: OR, tag: 'walkway' });
  rail(-1.6, -9.0, -1.6, 9.0, 1.8, { ink: BK });
  rail(1.6, -9.0, 1.6, 9.0, 1.8, { ink: BK });

  // Central Core Grapple Ring
  ring(0, 12.0, 0, 'z');
  pickup(0, 2.4, 0); // High-value weapon pickup at reactor center

  // =========================================================================
  // 3. HERO LANDMARK: CENTRIFUGE GRAVITY RING (Mid-High: Y = 4.2m)
  // =========================================================================
  // 4 Massive Radial Support Pylons
  box(-9, 0, -9, 1.6, 4.2, 1.6, { ink: BK });
  box(9, 0, -9, 1.6, 4.2, 1.6, { ink: BK });
  box(-9, 0, 9, 1.6, 4.2, 1.6, { ink: BK });
  box(9, 0, 9, 1.6, 4.2, 1.6, { ink: BK });

  // Elevated Centrifuge Skyway Deck (Octagonal / Quadrant Walkways at Y = 4.2m)
  slab(-18, -18, -6, -6, 4.2, 0.4, { ink: OR, tag: 'walkway' }); // NW Hub
  slab(6, -18, 18, -6, 4.2, 0.4, { ink: OR, tag: 'walkway' });  // NE Hub
  slab(-18, 6, -6, 18, 4.2, 0.4, { ink: OR, tag: 'walkway' });  // SW Hub
  slab(6, 6, 18, 18, 4.2, 0.4, { ink: OR, tag: 'walkway' });    // SE Hub

  // Connecting Mezzanine Bridges (Y = 4.2m)
  slab(-16, -2, -8, 2, 4.2, 0.4, { ink: OR, tag: 'walkway' }); // West radial link
  slab(8, -2, 16, 2, 4.2, 0.4, { ink: OR, tag: 'walkway' });   // East radial link
  slab(-2, -16, 2, -8, 4.2, 0.4, { ink: OR, tag: 'walkway' }); // North radial link
  slab(-2, 8, 2, 16, 4.2, 0.4, { ink: OR, tag: 'walkway' });   // South radial link

  // Dual Access Stairs from ground Y=0 to Centrifuge Hubs (Rise: 0.28m, Run: 0.45m)
  stairs(-12, 0, 24.5, '-z', 15, 2.4, { rise: 4.2 / 15, run: 0.45, ink: OR }); // South-West stair
  stairs(12, 0, 24.5, '-z', 15, 2.4, { rise: 4.2 / 15, run: 0.45, ink: OR });  // South-East stair

  // High Sniper Vantages on Centrifuge Mezzanine
  sniper(-12, 4.6, -12);
  sniper(12, 4.6, -12);

  // Centrifuge Grapple Rings for Rapid Orbital Traversal
  ring(-12, 9.5, -12, 'x');
  ring(12, 9.5, -12, 'x');
  ring(-12, 9.5, 12, 'x');
  ring(12, 9.5, 12, 'x');

  // =========================================================================
  // 4. WEST SECTOR: PHOTOVOLTAIC SOLAR TRUSSES & COMMS MAST (X in [-44, -20])
  // =========================================================================
  const solX = -32;
  // Raised Solar Inverter Terrace (Y = 2.0m, 22m x 16m)
  slab(-43, -20, -21, 6, 2.0, 0.4, { ink: BK, tag: 'walkway' });
  stairs(-17.85, 0, -7.0, '-x', 7, 3.0, { rise: 2.0 / 7, run: 0.45, ink: OR });

  // 3 Monolithic Photovoltaic Solar Arrays (Angled Drafting Wings)
  buildSolarArray(B, solX - 4, 2.0, -14, { inkPanel: BL, inkFrame: BK, rotY: 0.2 });
  buildSolarArray(B, solX - 4, 2.0, -2, { inkPanel: BL, inkFrame: BK, rotY: 0.2 });
  buildSolarArray(B, solX - 4, 2.0, 10, { inkPanel: BL, inkFrame: BK, rotY: 0.2 });

  // High Deep-Space Communications Dish (Y = 2.0m to 12.0m)
  buildCommunicationsDish(B, solX, 2.0, -12, { radius: 3.8, mastHeight: 8.5 });
  ring(solX, 13.5, -12, 'y'); // Apex mast grapple ring
  pickup(solX, 2.4, -2);

  // High Catwalk Truss over Solar Bay (Y = 6.0m)
  slab(-40, -18, -36, 12, 6.0, 0.4, { ink: OR, tag: 'walkway' });
  rail(-40, -18, -40, 12, 6.0, { ink: BK });
  rail(-36, -18, -36, 12, 6.0, { ink: BK });
  stairs(-38.0, 2.0, 18.0, '-z', 14, 2.0, { rise: 4.0 / 14, run: 0.45, ink: OR });
  sniper(-38.0, 6.4, -16.0);

  // =========================================================================
  // 5. EAST SECTOR: HYDROPONICS & PRESSURIZED AIRLOCK (X in [20, 44])
  // =========================================================================
  const bioX = 32;
  // Raised Biological Lab Terrace (Y = 1.6m, 22m x 18m)
  slab(21, -8, 43, 16, 1.6, 0.4, { ink: BK, tag: 'walkway' });
  stairs(18.3, 0, 4.0, '+x', 6, 3.2, { rise: 1.6 / 6, run: 0.45, ink: OR });

  // Hydroponics Bio-Arches (Curved Green Growth Bays)
  arch(bioX - 4, 1.6, -2, 3.4, 3.8, 0.8, { axis: 'x', ink: GR });
  arch(bioX - 4, 1.6, 6, 3.4, 3.8, 0.8, { axis: 'x', ink: GR });
  arch(bioX - 4, 1.6, 14, 3.4, 3.8, 0.8, { axis: 'x', ink: GR });

  // Bank of Cryo Pods & Oxygen Manifolds (Waist & Full Cover)
  buildCryoPod(B, bioX + 4, 1.6, -4, { inkPod: BL, inkGlass: OR });
  buildCryoPod(B, bioX + 4, 1.6, 0, { inkPod: BL, inkGlass: OR });
  buildCryoPod(B, bioX + 4, 1.6, 4, { inkPod: BL, inkGlass: OR });
  buildOxygenTankRack(B, bioX + 6, 1.6, 10, { count: 6, inkTank: RD, inkFrame: BK });

  // Airlock Decompression Chamber Portal (East Perimeter Wall Access)
  box(P - T - 1.0, 1.6, 4.0, 2.0, 3.2, 5.0, { ink: OR, tag: 'cover' });
  ring(bioX, 10.5, 4.0, 'z');
  pickup(bioX, 2.0, 4.0);

  // =========================================================================
  // 6. NORTH SECTOR: COMMAND TELEMETRY BRIDGE (Center: 0, -32)
  // =========================================================================
  const cmdZ = -32;
  // Raised Command Acropolis Terrace (Y = 3.6m, 28m x 16m)
  slab(-14, -40, 14, -24, 3.6, 0.4, { ink: BK, tag: 'walkway' });

  // Dual Command Bridge Approach Stairs (Rise: 0.277m, Run: 0.45m)
  stairs(-9.0, 0, -18.15, '-z', 13, 2.8, { rise: 3.6 / 13, run: 0.45, ink: OR });
  stairs(9.0, 0, -18.15, '-z', 13, 2.8, { rise: 3.6 / 13, run: 0.45, ink: OR });

  // Elevated Holographic Navigation Holotank (Central Hero Monument)
  buildHoloPylon(B, 0, 3.6, cmdZ, { radius: 2.2, height: 4.8, inkBeam: BL });
  buildTelemetryConsole(B, -4.5, 3.6, cmdZ + 3.0, { inkConsole: BK, inkDisplay: OR });
  buildTelemetryConsole(B, 4.5, 3.6, cmdZ + 3.0, { inkConsole: BK, inkDisplay: OR });

  // Command Telemetry Server Racks
  box(-10, 3.6, cmdZ, 1.4, 2.4, 4.0, { ink: BK, tag: 'cover' });
  box(10, 3.6, cmdZ, 1.4, 2.4, 4.0, { ink: BK, tag: 'cover' });

  // Overhanging Tactical Skybridge connecting Command Bridge to North Wall (Y = 7.0m)
  slab(-3.0, -50.0, 3.0, -40.0, 7.0, 0.4, { ink: OR, tag: 'walkway' });
  rail(-3.0, -50.0, -3.0, -40.0, 7.0, { ink: BK });
  rail(3.0, -50.0, 3.0, -40.0, 7.0, { ink: BK });
  stairs(0, 3.6, -34.6, '-z', 12, 2.2, { rise: 3.4 / 12, run: 0.45, ink: OR });

  sniper(0, 7.4, -44.0); // Apex Command sniper perch
  ring(0, 14.0, cmdZ, 'z');

  // =========================================================================
  // 7. SOUTH SECTOR: SHUTTLE DOCKING BAY & CARGO PLAZA (Center: 0, 32)
  // =========================================================================
  const dockZ = 32;
  // Docking Umbilical Staging Area (Y = 0.9m, 24m x 14m)
  box(0, 0, dockZ, 24, 0.9, 14, { ink: BK });
  slab(-12.4, dockZ - 7.4, 12.4, dockZ + 7.4, 1.0, 0.2, { ink: OR, noCollide: true });

  // 2 Cargo Access Ramps (climbing from ground Y=0 to Y=0.9m)
  stairs(-8.0, 0, dockZ - 10.35, '+z', 3, 3.2, { rise: 0.3, run: 0.45, ink: OR });
  stairs(8.0, 0, dockZ - 10.35, '+z', 3, 3.2, { rise: 0.3, run: 0.45, ink: OR });

  // Heavy Orbital Cargo Pod Stacks & Maintenance Tool Racks
  buildCrateStack(B, -7.0, 0.9, dockZ, { count: 5, ink: OR, seed: 401 });
  buildCrateStack(B, 7.0, 0.9, dockZ, { count: 5, ink: OR, seed: 402 });
  buildToolRack(B, -10.0, 0.9, dockZ + 4.0, { ink: BK });
  buildToolRack(B, 10.0, 0.9, dockZ + 4.0, { ink: BK });
  buildWarningSign(B, 0, 0.9, dockZ - 5.5, { text: 'EVA HAZARD', ink: RD });

  // Shuttle Fuel Manifold Umbilicals
  cyl(0, 0.4, dockZ + 6, 0.4, 16.0, { axis: 'x', ink: OR, noCollide: true });

  // Flanking Pressurized Freight Modules
  box(-24, 0.0, dockZ, 4.0, 2.4, 7.0, { ink: BL, tag: 'cover' });
  box(24, 0.0, dockZ, 4.0, 2.4, 7.0, { ink: BL, tag: 'cover' });
  ring(-24, 4.8, dockZ, 'y');
  ring(24, 4.8, dockZ, 'y');

  ring(0, 9.5, dockZ, 'y');
  pickup(0, 1.3, dockZ);

  // Atmospheric Zero-G Light Beams shining on Reactor Core
  buildAtmosphericBeams(B, 0, 1.8, 0, { radius: 5.0, height: 20.0 });

  // =========================================================================
  // 8. TACTICAL SPAWNS & SNIPERS
  // =========================================================================
  // 4 Cardinal Solo Spawns
  spawn(0, 0.2, 44);   // South Shuttle Bay (Player start)
  spawn(0, 0.2, -44);  // North Command Approach
  spawn(-44, 0.2, 0);  // West Solar Wing
  spawn(44, 0.2, 0);   // East Airlock

  // Symmetrical Team Spawns (Red & Blue)
  L.teamSpawns = [
    // Red Team (South & West)
    [[-10, 0.2, 38], [10, 0.2, 38], [-28, 0.2, 18], [-34, 2.2, -6],
     [0, 0.2, 42], [-14, 0.2, 28], [-20, 0.2, 32], [-4, 0.2, 36]].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    // Blue Team (North & East)
    [[-10, 0.2, -42], [10, 0.2, -42], [32, 1.8, -18], [34, 1.8, 6],
     [0, 0.2, -18], [14, 0.2, -28], [24, 0.2, -24], [4, 0.2, -40]].map(([x, y, z]) => new THREE.Vector3(x, y, z))
  ];

  for (const [x, y, z] of [
    [-10, 0.2, 38], [10, 0.2, 38], [-28, 0.2, 18], [-34, 2.2, -6],
    [0, 0.2, 42], [-14, 0.2, 28], [-20, 0.2, 32], [-4, 0.2, 36],
    [-10, 0.2, -42], [10, 0.2, -42], [32, 1.8, -18], [34, 1.8, 6],
    [0, 0.2, -18], [14, 0.2, -28], [24, 0.2, -24], [4, 0.2, -40]
  ]) {
    L.arenaSpawns.push(new THREE.Vector3(x, y, z));
  }

  // =========================================================================
  // 9. LIVING KINETIC ACTORS: REACTOR CONFINEMENT COIL PULSE & LIGHTING
  // =========================================================================
  if (B.scene && L.animated) {
    // 3 Toroidal Magnetic Field Rings rotating around the fusion core
    const plasmaGroup = new THREE.Group();
    plasmaGroup.position.set(0, 0.6, 0);

    const ringMat = makeInkMaterial({ ink: BL });
    const pRings = [];
    for (let r = 0; r < 3; r++) {
      const tg = new THREE.TorusGeometry(3.6 + r * 0.4, 0.12, 8, 24);
      const tm = new THREE.Mesh(tg, ringMat);
      tm.rotation.x = Math.PI / 2 + (r - 1) * 0.25;
      plasmaGroup.add(tm);
      L.meshes.push(tm);
      pRings.push({ mesh: tm, speed: 1.2 + r * 0.5 });
    }
    B.scene.add(plasmaGroup);

    // Dynamic blue-white reactor core PointLight
    let coreLight = null;
    if (typeof THREE.PointLight === 'function') {
      coreLight = new THREE.PointLight(0x44aaff, 2.0, 20, 2);
      coreLight.position.set(0, 1.2, 0);
      B.scene.add(coreLight);
    }

    L.animated.push({
      mesh: plasmaGroup,
      update: (t) => {
        for (let i = 0; i < pRings.length; i++) {
          const pr = pRings[i];
          pr.mesh.rotation.z = t * pr.speed;
        }
        if (coreLight) {
          coreLight.intensity = 1.8 + Math.sin(t * 8.0) * 0.4 + Math.cos(t * 14.0) * 0.2;
        }
      }
    });
  }

  // 4 Circling Deep-Space Survey Drones in Upper Orbit
  planes(4, 30, 24, { rStep: 8, hStep: 4, scale: 1.4, speed: 0.12 });

  return finish();
}
