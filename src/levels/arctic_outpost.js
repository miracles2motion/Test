import * as THREE from 'three';
import { INK, makeInkMaterial } from '../render.js';
import {
  buildCrateStack,
  buildToolRack,
  buildWarningSign
} from '../prefabs.js';

/**
 * ============================================================================
 * ARCTIC OUTPOST (STATION BOREAS) - arctic_outpost
 * ============================================================================
 * A sub-zero naval research outpost and glacial drydock carved into a polar ice
 * shelf. Features a surfaced ballistic nuclear submarine "Leviathan", an early-
 * warning geodesic radar dome, a deep glacial crevasse with ice tunnels, and a
 * high-altitude geothermal drill derrick.
 *
 * Major Sectors:
 * 1. THE SUBMARINE DRYDOCK (Mid, Y=-1.8m to 6.5m): Sunken ice basin holding the
 *    surfaced 34m ballistic submarine "Leviathan" with climbable conning tower.
 * 2. GEODESIC RADAR DOME (East Hero, Y=0m to 14.0m): Elevated concrete bastion
 *    supporting a massive geodesic radar radome and rotating scanner array.
 * 3. GLACIAL CREVASSE & ICE CHASM (Mid-South, Y=-2.0m to 0m): Permafrost trench
 *    spanned by a heavy steel suspension bridge and subterranean ice tunnels.
 * 4. POLAR DRILL DERRICK (West Hero, Y=0m to 14.0m): 4-legged lattice steel
 *    derrick with rotating drill string mechanism and high sniper crown block.
 * 5. SOUTH RESEARCH HABITAT (South, Y=0m to 3.5m): Polar laboratory modules,
 *    fuel bladders, and snowcat vehicle maintenance bays.
 */
export function buildArcticOutpost(B, arena = false) {
  const {
    L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring,
    spawn, sniper, pickup, planes, finish, facetedRock
  } = B;

  const OR = INK.ORANGE; // Arctic Survival Orange / Signal Beacons / Brass
  const BK = INK.BLACK;  // High-Carbon Hull Steel / Dark Basalt / Ice Screws
  const BL = INK.BLUE;   // Glacial Ice Blue / Weathered Aluminum / Snow Pack

  L.key = 'arctic_outpost';
  L.playerStart.set(0, 0.5, 38);

  const P = arena ? 64 : 52;
  const PH = arena ? 28 : 22;
  const T = 5.0;
  L.bounds.minX = -P; L.bounds.maxX = P;
  L.bounds.minZ = -P; L.bounds.maxZ = P;

  // =========================================================================
  // 1. BEDROCK PLINTH & POLAR ICE WALLS
  // =========================================================================
  slab(-P, -P, P, P, -2.4, 0.6, { ink: BL, noCollide: false });

  wallZ(-P, -P, P, PH + 2.4, T, { ink: BK, yBase: -2.4 });
  wallZ(P, -P, P, PH + 2.4, T, { ink: BK, yBase: -2.4 });
  wallX(-P, P, -P, PH + 2.4, T, { ink: BK, yBase: -2.4 });
  wallX(-P, P, P, PH + 2.4, T, { ink: BK, yBase: -2.4 });

  // =========================================================================
  // 2. MAIN GROUND FLOORS (Y=0.0m) WITH CUTOUTS FOR DRYDOCK & STAIRS
  // =========================================================================
  // North Glacial Shelf (solid from -P to -26, split from -26 to -22 around stair)
  slab(-P, -P, P, -26.0, 0.0, 0.6, { ink: BL });
  slab(-P, -26.0, -2.5, -22.0, 0.0, 0.6, { ink: BL });
  slab(2.5, -26.0, P, -22.0, 0.0, 0.6, { ink: BL });

  // South Polar Promenade (solid from 22 to P, split from 18 to 22 around stair)
  slab(-P, 22.0, P, P, 0.0, 0.6, { ink: BL });
  slab(-P, 18.0, -2.5, 22.0, 0.0, 0.6, { ink: BL });
  slab(2.5, 18.0, P, 22.0, 0.0, 0.6, { ink: BL });

  // West & East shelves around drydock
  slab(-P, -22.0, -10.0, 18.0, 0.0, 0.6, { ink: BL });
  slab(10.0, -22.0, P, 18.0, 0.0, 0.6, { ink: BL });

  // Drydock Basin Ice Floor (-1.8m)
  slab(-10.0, -22.0, 10.0, 18.0, -1.8, 0.4, { ink: BL });

  // Drydock Basin Retaining Walls (with doorway gaps for slipway stairs)
  wallX(-10.0, 10.0, 18.0, -1.8, 1.8, 0.6, [[-2.5, 2.5]], { ink: BK });
  wallX(-10.0, 10.0, -22.0, -1.8, 1.8, 0.6, [[-2.5, 2.5]], { ink: BK });
  box(-10.0, -0.9, -2.0, 0.6, 1.8, 40.0, { ink: BK });
  box(10.0, -0.9, -2.0, 0.6, 1.8, 40.0, { ink: BK });

  // Drydock Access Slipway Stairs (rise 1.8 / 7 = 0.257m, run 0.45m, total run 3.15m)
  // South Slipway: starts inside basin at Z=18.0 (Y=-1.8m), climbs to Z=21.15 (Y=0.0m)
  stairs(0, -1.8, 18.0, '+z', 7, 2.4, { rise: 1.8 / 7, run: 0.45, ink: BL });
  // North Slipway: starts inside basin at Z=-22.0 (Y=-1.8m), climbs to Z=-25.15 (Y=0.0m)
  stairs(0, -1.8, -22.0, '-z', 7, 2.4, { rise: 1.8 / 7, run: 0.45, ink: BL });

  // =========================================================================
  // 3. MID HERO LANDMARK: BALLISTIC SUBMARINE "LEVIATHAN" (Center X=0, Z=-2)
  // =========================================================================
  // Streamlined Main Submarine Hull (Bottom Y=-0.6m, Deck at Y=2.4m, Height 3.0m)
  box(0, -0.6, -2, 7.0, 3.0, 30.0, { ink: BK });
  cyl(0, -0.6, -18, 3.5, 3.0, { ink: BK });
  cyl(0, -0.6, 14, 3.2, 3.0, { ink: BK });
  cyl(0, -0.6, 16.5, 2.6, 0.4, { axis: 'z', ink: OR });

  // Walkable Upper Outer Deck (Y=2.4m)
  slab(-2.8, -15, 2.8, 11, 2.4, 0.3, { ink: BK });
  rail(-2.8, -15, -2.8, 11, 2.6, { ink: OR });
  rail(2.8, -15, 2.8, 11, 2.6, { ink: OR });

  // Open Vertical Missile Hatch Silos (Waist cover on deck)
  for (let sz = -9; sz <= -1; sz += 4) {
    box(-1.6, 2.8, sz, 1.4, 0.8, 1.4, { ink: OR, tag: 'cover' });
    if (sz !== -5) {
      box(1.6, 2.8, sz, 1.4, 0.8, 1.4, { ink: OR, tag: 'cover' });
    }
  }

  // Conning Tower Sail (Center X=0, Z=4.0, Y=2.4m to 6.2m, Length 9.0m, Width 2.4m)
  // Sail is located from X: [-1.2, 1.2], Z: [-0.5, 8.5]
  box(0, 4.3, 4.0, 2.4, 3.8, 9.0, { ink: BK });

  // Conning Tower Bridge Observation Deck (Y=6.2m)
  slab(-1.4, 0.5, 1.4, 7.5, 6.2, 0.3, { ink: BL });
  rail(-1.4, 0.5, -1.4, 7.5, 6.4, { ink: OR });
  rail(1.4, 0.5, 1.4, 7.5, 6.4, { ink: OR });
  rail(-1.4, 0.5, 1.4, 0.5, 6.4, { ink: OR });

  // Periscope Masts
  cyl(-0.4, 7.8, 3.0, 0.12, 3.2, { ink: BK, noCollide: true });
  cyl(0.4, 8.2, 4.0, 0.12, 4.0, { ink: BK, noCollide: true });
  ring(0, 10.2, 4.0, 'y');

  // Boarding Gangplanks
  slab(-10, 5.5, -2.8, 8.5, 2.4, 0.3, { ink: OR });
  stairs(-14.05, 0.0, 7.0, '+x', 9, 2.0, { rise: 2.4 / 9, run: 0.45, ink: BL });

  slab(2.8, -8.5, 10, -5.5, 2.4, 0.3, { ink: OR });
  stairs(14.05, 0.0, -7.0, '-x', 9, 2.0, { rise: 2.4 / 9, run: 0.45, ink: BL });

  // Starboard Conning Tower Access Stairs (Mounts outside the sail along X=1.85m)
  // Starts at Z=-5.8 on sub deck (Y=2.4m), lands at Z=0.5 on bridge wing (Y=6.2m)
  // 14 steps, rise = 3.8 / 14 = 0.2714m, run = 0.45m (total run = 6.3m)
  stairs(1.85, 2.4, -5.8, '+z', 14, 1.1, { rise: 3.8 / 14, run: 0.45, ink: OR });

  // =========================================================================
  // 4. EAST LANE HERO LANDMARK: GEODESIC RADAR DOME (X=26, Z=-26)
  // =========================================================================
  // Concrete Radar Bastion Terrace (Y=4.2m, X: 16.2 to 36, Z: -36 to -16)
  slab(16.2, -36, 36, -16, 4.2, 0.6, { ink: BL });
  // Foundation under the terrace (Y: 0.0 to 4.2)
  box(26.2, 0.0, -26, 19.6, 4.2, 20.0, { ink: BK });
  rail(16.2, -36, 36, -36, 4.4, { ink: OR });
  rail(16.2, -16, 36, -16, 4.4, { ink: OR });
  rail(16.2, -36, 16.2, -16, 4.4, { ink: OR });

  // Bastion Access Stairs from Ground (Y=0.0m to 4.2m, 16 steps, rise 0.2625m, run 7.2m)
  // Starts at X=9.0, lands at X=16.2 flush at terrace
  stairs(9.0, 0.0, -26.0, '+x', 16, 2.4, { rise: 4.2 / 16, run: 0.45, ink: BL });

  // Structural Pylon supporting the Dome
  box(26, 6.35, -26, 6.0, 4.3, 6.0, { ink: BL });

  // Geodesic Radar Radome Sphere
  sphere(26, 11.5, -26, 4.5, { ink: BL });
  cyl(26, 16.2, -26, 0.2, 2.0, { ink: OR, noCollide: true });
  ring(26, 17.5, -26, 'y');

  // Upper Radar Operations Observation Gallery (Y=8.5m)
  slab(20, -32, 32, -20, 8.5, 0.4, { ink: BL });
  rail(20, -32, 32, -32, 8.7, { ink: OR });
  rail(20, -20, 32, -20, 8.7, { ink: OR });

  // Stairs from Bastion (4.2m) to Upper Gallery (8.5m, 16 steps, rise 0.2687m)
  stairs(22, 4.2, -12.8, '-z', 16, 2.0, { rise: 4.3 / 16, run: 0.45, ink: BL });

  // =========================================================================
  // 5. WEST LANE HERO LANDMARK: POLAR DRILL DERRICK (X=-26, Z=-26)
  // =========================================================================
  // Drilling Floor Substructure (Y=0.0m to 2.4m, X: -34 to -18, Z: -33.8 to -18)
  slab(-34, -33.8, -18, -18, 2.4, 0.6, { ink: BL });
  box(-26, 0.0, -25.9, 16.0, 2.4, 15.8, { ink: BK });

  // Stairs up to Drilling Floor (Y=0.0m to 2.4m, 9 steps, rise 0.2667m, run 4.05m)
  // Starts at Z=-37.85, lands at Z=-33.8 flush with floor
  stairs(-26, 0.0, -37.85, '+z', 9, 2.4, { rise: 2.4 / 9, run: 0.45, ink: BL });

  // 4 Lattice Derrick Legs
  box(-32, 8.2, -32, 1.0, 11.6, 1.0, { ink: OR });
  box(-20, 8.2, -32, 1.0, 11.6, 1.0, { ink: OR });
  box(-32, 8.2, -20, 1.0, 11.6, 1.0, { ink: OR });
  box(-20, 8.2, -20, 1.0, 11.6, 1.0, { ink: OR });

  // Cross-Trusses
  box(-26, 7.0, -32, 12.0, 0.6, 0.6, { ink: BL });
  box(-26, 7.0, -20, 12.0, 0.6, 0.6, { ink: BL });
  box(-32, 7.0, -26, 0.6, 0.6, 12.0, { ink: BL });
  box(-20, 7.0, -26, 0.6, 0.6, 12.0, { ink: BL });

  // High Crown Block Platform (Y=14.0m)
  slab(-29, -29, -23, -23, 14.0, 0.4, { ink: BL });
  rail(-29, -29, -23, -29, 14.2, { ink: OR });
  rail(-29, -23, -23, -23, 14.2, { ink: OR });
  ring(-26, 15.5, -26, 'y');

  // Drill String Pipe Casing
  cyl(-26, 2.4, -26, 0.4, 11.6, { ink: BK });

  // =========================================================================
  // 6. SOUTH RESEARCH HABITAT & PREFABS (Z=18 to 44)
  // =========================================================================
  cyl(-18, 2.2, 30, 2.6, 10.0, { axis: 'z', ink: BL });
  cyl(18, 2.2, 30, 2.6, 10.0, { axis: 'z', ink: BL });

  cyl(-8, 1.4, 32, 1.6, 3.2, { ink: OR });
  cyl(8, 1.4, 32, 1.6, 3.2, { ink: OR });

  buildCrateStack(B, -14, 0.4, 24, 601);
  buildCrateStack(B, 14, 0.4, 24, 602);
  buildToolRack(B, -10, 0.4, 24, 'z');
  buildToolRack(B, 10, 0.4, 24, 'z');
  buildWarningSign(B, 0, 0.4, 22, 'STATION BOREAS - SECTOR 7');

  // =========================================================================
  // 6B. EAST HELIPAD & ARCTIC SNOWCAT VEHICLE DEPOT (X: 22 to 40, Z: -8 to 16)
  // =========================================================================
  // Elevated Landing Deck (Y=2.2m)
  slab(24, -4, 38, 14, 2.2, 0.4, { ink: BL });
  rail(24, -4, 38, -4, 2.4, { ink: OR });
  rail(24, 14, 38, 14, 2.4, { ink: OR });
  rail(38, -4, 38, 14, 2.4, { ink: OR });

  // Helipad Access Stairs (8 steps, rise 0.275m, run 0.45m, total run 3.6m)
  stairs(31, 0.0, -7.6, '+z', 8, 2.0, { rise: 2.2 / 8, run: 0.45, ink: BL });

  // Parked Arctic Snowcat Exploration Vehicle on Helipad
  box(31, 2.6, 5, 4.2, 1.8, 6.5, { ink: OR, tag: 'cover' });
  cyl(28.5, 2.4, 5, 0.5, 5.8, { axis: 'z', ink: BK, noCollide: true });
  cyl(33.5, 2.4, 5, 0.5, 5.8, { axis: 'z', ink: BK, noCollide: true });
  ring(31, 6.8, 5, 'y'); // Clear air 2.4m above Snowcat roof

  // Windsock Mast & Floodlight Tower
  cyl(37, 2.2, 13, 0.12, 4.5, { ink: BK, noCollide: true });
  box(37, 6.5, 13, 0.6, 0.3, 0.6, { ink: OR, noCollide: true });

  // Heavy Fuel Pipeline Umbilicals
  cyl(18, 0.5, 0, 0.35, 24.0, { axis: 'z', ink: OR, noCollide: true });
  cyl(-18, 0.5, 0, 0.35, 24.0, { axis: 'z', ink: OR, noCollide: true });

  // Glacial Ice Hummocks & Iceberg Shards (Framing perimeter & drydock)
  facetedRock(-42, 0.0, -42, 5.0, 8.5, 5.0, { ink: BL, cover: 'full', seed: 701 });
  facetedRock(42, 0.0, -42, 5.0, 8.5, 5.0, { ink: BL, cover: 'full', seed: 702 });
  facetedRock(-42, 0.0, 42, 5.0, 8.5, 5.0, { ink: BL, cover: 'full', seed: 703 });
  facetedRock(42, 0.0, 42, 5.0, 8.5, 5.0, { ink: BL, cover: 'full', seed: 704 });
  facetedRock(-14, 0.0, 0, 3.2, 3.0, 3.2, { ink: BL, cover: 'waist', seed: 705 });
  facetedRock(14, 0.0, 0, 3.2, 3.0, 3.2, { ink: BL, cover: 'waist', seed: 706 });

  // =========================================================================
  // 7. TACTICAL SPOTS, GRAPPLE RINGS, PICKUPS & LIGHTING
  // =========================================================================
  ring(0, 10.2, 4.0, 'y');     // Conning tower mast ring
  ring(0, 6.5, -16, 'y');      // Submarine bow ring
  ring(0, 6.5, 12, 'y');       // Submarine stern ring
  ring(26, 17.5, -26, 'y');    // Radar radome apex ring
  ring(-26, 15.5, -26, 'y');   // Drill derrick crown ring
  ring(26, 10.5, -20, 'y');    // Radar gallery ring
  ring(-26, 5.0, -20, 'y');    // Drill floor ring
  ring(-18, 5.5, 30, 'y');     // West Quonset hut ring
  ring(18, 5.5, 30, 'y');      // East Quonset hut ring
  ring(0, 4.5, 26, 'y');       // South harbor plaza ring

  // Sniper Vantage Perches
  sniper(-26, 14.5, -26);      // Drill Derrick Crown Block
  sniper(26, 9.0, -20);        // Radar Operations Gallery
  sniper(0, 6.5, 4.0);         // Submarine Conning Tower Bridge
  sniper(0, 2.6, -12);         // Submarine Forward Missile Deck

  // Tactical Spawns
  spawn(0, 0.5, 38);           // South Base Promenade (Player Start)
  spawn(-26, 0.5, 28);         // South-West Hab Approach
  spawn(26, 0.5, 28);          // South-East Hab Approach
  spawn(-26, 2.8, -26);        // West Drill Rig Floor
  spawn(26, 4.8, -26);         // East Radar Bastion Terrace
  spawn(0, 2.8, -2);           // Submarine Main Deck Choke
  spawn(0, -1.3, -10);         // Sunken Drydock Ice Basin
  spawn(0, 6.5, 4.0);          // Conning Tower Bridge

  // Pickups
  pickup(-26, 14.5, -26, 'special'); // Derrick Crown Block
  pickup(0, 6.5, 4.0, 'damage');     // Conning Tower Bridge
  pickup(0, 2.8, -2, 'speed');       // Submarine Missile Deck
  pickup(26, 9.0, -20, 'shield');    // Radar Operations Gallery
  pickup(0, 0.5, 32, 'health');      // South Promenade safe approach
  pickup(0, -1.3, -10, 'health');    // Sunken Drydock Basin

  // =========================================================================
  // 8. LIVING KINETIC AMBIENT ACTORS (L.animated)
  // =========================================================================
  if (B.scene && B.scene.add && L.animated) {
    const radarPiv = new THREE.Group();
    radarPiv.position.set(26, 8.9, -20);
    const dishGeom = new THREE.CylinderGeometry(1.6, 1.2, 0.3, 12);
    dishGeom.rotateX(Math.PI / 2);
    const dishMat = makeInkMaterial(OR, { wireframe: true });
    const dishMesh = new THREE.Mesh(dishGeom, dishMat);
    radarPiv.add(dishMesh);
    B.scene.add(radarPiv);
    L.meshes.push(radarPiv);

    const drillPiv = new THREE.Group();
    drillPiv.position.set(-26, 3.2, -26);
    const rotaryTable = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.2, 0.4, 8),
      makeInkMaterial(OR, { wireframe: true })
    );
    drillPiv.add(rotaryTable);
    B.scene.add(drillPiv);
    L.meshes.push(drillPiv);

    L.animated.push({
      mesh: radarPiv,
      update: (time) => {
        radarPiv.rotation.y = time * 1.8;
        drillPiv.rotation.y = -time * 4.5;
      }
    });
  }

  planes(4, 28, 22, { rStep: 8, hStep: 4, scale: 1.2, speed: 0.13 });

  return finish();
}
