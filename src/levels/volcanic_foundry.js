import * as THREE from 'three';
import { INK, makeInkMaterial } from '../render.js';
import {
  buildCrateStack,
  buildToolRack,
  buildWarningSign
} from '../prefabs.js';

/**
 * ============================================================================
 * VOLCANIC FOUNDRY (CALDERA SMELTER) - volcanic_foundry
 * ============================================================================
 * A colossal industrial steelworks constructed inside an active basalt caldera.
 * Features a monumental blast furnace, a moving overhead magma crucible cableway,
 * a sunken molten slag canal spanned by heavy grating bridges, and a heavy
 * container gantry crane.
 *
 * Major Sectors:
 * 1. THE MOLTEN SLAG CANAL (Mid, Y=-1.8m to 0m): Sunken basalt gorge carrying
 *    molten slag, spanned by industrial steel grating drawbridges and siphon pipes.
 * 2. GIGANTIC BLAST FURNACE TOWER (East Hero, Y=0m to 16.0m): Monumental smelting
 *    column with bustle pipe manifolds, external catwalk stairs, and charging hoppers.
 * 3. OVERHEAD MAGMA CRUCIBLE CABLEWAY (Mid-Air, Y=8.5m): Kinetic molten steel ladle
 *    suspended from overhead steel cableway, traveling across the central chasm.
 * 4. HEAVY GANTRY CRANE & CARGO MAZE (West Lane, Y=0m to 7.5m): Heavy rail gantry
 *    straddling stacks of steel shipping containers, with climbable access ladders.
 * 5. INGOT CASTING PLAZA (South, Y=0m): Cooling racks, ingot molds, and rail spurs.
 */
export function buildVolcanicFoundry(B, arena = false) {
  const {
    L, box, slab, wallX, wallZ, stairs, rail, cyl, ring,
    spawn, sniper, pickup, planes, finish, facetedRock
  } = B;

  const OR = INK.ORANGE; // Molten Slag / Heat Glow / Crucible Steel
  const BK = INK.BLACK;  // Basalt Rock / Heavy Cast Iron / Soot
  const BL = INK.BLUE;   // Industrial Steel Framing / Sheet Metal
  const RD = INK.RED;    // High-Temperature Hazard Markings
  const GR = INK.GREEN;  // Coolant Indicators

  L.key = 'volcanic_foundry';
  L.playerStart.set(0, 0.5, 38);

  const P = arena ? 64 : 52;
  const PH = arena ? 28 : 22;
  const T = 5.0;
  L.bounds.minX = -P; L.bounds.maxX = P;
  L.bounds.minZ = -P; L.bounds.maxZ = P;

  // =========================================================================
  // 1. BEDROCK PLINTH & BASALT CALDERA WALLS
  // =========================================================================
  // Deep subterranean magma chamber bedrock floor (-2.4m)
  slab(-P, -P, P, P, -2.4, 0.6, { ink: BK, noCollide: false });

  // Perimeter basalt caldera volcanic walls
  wallZ(-P, -P, P, PH + 2.4, T, { ink: BK, yBase: -2.4 });
  wallZ(P, -P, P, PH + 2.4, T, { ink: BK, yBase: -2.4 });
  wallX(-P, P, -P, PH + 2.4, T, { ink: BK, yBase: -2.4 });
  wallX(-P, P, P, PH + 2.4, T, { ink: BK, yBase: -2.4 });

  // =========================================================================
  // 2. MAIN GROUND FLOORS (Y=0.0m) WITH CUTOUTS FOR SLAG CANAL & STAIRS
  // =========================================================================
  // North Smelting Terrace (Z: -P to -8.5 is solid)
  slab(-P, -P, P, -8.5, 0.0, 0.6, { ink: BK });
  // Floor sections between Z: -8.5 and -5.0 (excluding stair openings at X=[-24, -20] and X=[20, 24])
  slab(-P, -8.5, -24, -5.0, 0.0, 0.6, { ink: BK });
  slab(-20, -8.5, 20, -5.0, 0.0, 0.6, { ink: BK });
  slab(24, -8.5, P, -5.0, 0.0, 0.6, { ink: BK });

  // South Ingot Casting Terrace (Z: 8.5 to P is solid)
  slab(-P, 8.5, P, P, 0.0, 0.6, { ink: BK });
  // Floor sections between Z: 5.0 and 8.5 (excluding stair openings at X=[-24, -20] and X=[20, 24])
  slab(-P, 5.0, -24, 8.5, 0.0, 0.6, { ink: BK });
  slab(-20, 5.0, 20, 8.5, 0.0, 0.6, { ink: BK });
  slab(24, 5.0, P, 8.5, 0.0, 0.6, { ink: BK });

  // Molten Slag Basin Floor (-1.8m)
  slab(-P, -5.0, P, 5.0, -1.8, 0.4, { ink: BK });
  // Glowing Molten Slag Liquid Surface (-1.4m, noCollide)
  box(0, -1.4, 0, P * 2, 0.2, 9.6, { ink: OR, noCollide: true });

  // Slag Canal Retaining Skirt Walls (with doorway gaps for stairs and bridges)
  wallX(-P, P, -5.0, -1.8, 1.8, 0.6, [[-24, -20], [-4, 4], [20, 24]], { ink: BK });
  wallX(-P, P, 5.0, -1.8, 1.8, 0.6, [[-24, -20], [-4, 4], [20, 24]], { ink: BK });

  // Canal Embankment Access Stairs (rise 1.8 / 7 = 0.257m, run 0.45m, total run 3.15m)
  // South-West stair: starts inside canal at Z=5.0 (Y=-1.8m), climbs to Z=8.15 (Y=0.0m)
  stairs(-22, -1.8, 5.0, '+z', 7, 2.2, { rise: 1.8 / 7, run: 0.45, ink: BL });
  // South-East stair
  stairs(22, -1.8, 5.0, '+z', 7, 2.2, { rise: 1.8 / 7, run: 0.45, ink: BL });
  // North-West stair: starts inside canal at Z=-5.0 (Y=-1.8m), climbs to Z=-8.15 (Y=0.0m)
  stairs(-22, -1.8, -5.0, '-z', 7, 2.2, { rise: 1.8 / 7, run: 0.45, ink: BL });
  // North-East stair
  stairs(22, -1.8, -5.0, '-z', 7, 2.2, { rise: 1.8 / 7, run: 0.45, ink: BL });

  // Center Steel Grating Drawbridge spanning the Slag Canal (X: -3.5 to 3.5, Z: -5.5 to 5.5, Y=0.0m)
  slab(-3.5, -5.5, 3.5, 5.5, 0.05, 0.3, { ink: BL });
  rail(-3.5, -5.5, -3.5, 5.5, 0.25, { ink: OR });
  rail(3.5, -5.5, 3.5, 5.5, 0.25, { ink: OR });

  // Flanking Pipeline Siphon Truss Spanning the Canal (East Side, X=12, Y=3.5m)
  cyl(12, 3.5, 0, 0.6, 14.0, { axis: 'z', ink: OR });
  cyl(14, 3.5, 0, 0.6, 14.0, { axis: 'z', ink: OR });
  box(13, 1.6, -6, 3.2, 3.2, 1.2, { ink: BK });
  box(13, 1.6, 6, 3.2, 3.2, 1.2, { ink: BK });

  // =========================================================================
  // 2B. NORTH SLAG CRUSHING MILL & GEOTHERMAL VENT TOWER (X: -10 to 10, Z: -36 to -18)
  // =========================================================================
  // Heavy Ore Stamp Mill Housing (X=-4, Z=-26)
  box(-4, 0.0, -26, 7.0, 4.2, 8.0, { ink: BL });
  box(-4, 4.2, -26, 7.4, 0.4, 8.4, { ink: OR });
  cyl(-4, 4.6, -26, 1.2, 3.5, { ink: BK, noCollide: true });
  ring(-4, 9.5, -26, 'y');

  // Slag Granulation Cooling Trough & Vent Chimney (X=6, Z=-26)
  box(6, 0.0, -26, 6.0, 1.6, 8.0, { ink: BK });
  box(6, 1.4, -26, 5.2, 0.2, 7.2, { ink: OR, noCollide: true });
  cyl(6, 1.6, -26, 0.8, 6.5, { ink: BL, noCollide: true });

  // North Terrace Ingot Stacks & Iron Ingot Molds
  box(0, 0.0, -18, 4.5, 0.85, 2.2, { ink: OR, tag: 'cover' });
  box(-10, 0.0, -22, 3.2, 0.85, 2.0, { ink: OR, tag: 'cover' });

  // =========================================================================
  // 3. EAST LANE HERO LANDMARK: GIGANTIC BLAST FURNACE TOWER (X=24, Z=-26)
  // =========================================================================
  // Foundation Plinth (Y=0.0m to 1.5m, X: 14 to 34, Z: -36 to -16)
  slab(14, -36, 34, -16, 1.5, 1.5, { ink: BK });

  // Blast Furnace Cylinder Body (Center X=24, Z=-26, Radius 5.5m, Height 14.0m)
  cyl(24, 1.5, -26, 5.5, 14.0, { ink: BL });

  // Bustle Pipe Torus Ring wrapping the furnace base
  const bustlePipe = new THREE.TorusGeometry(6.2, 0.5, 10, 24);
  bustlePipe.rotateX(Math.PI / 2);
  bustlePipe.translate(24, 4.5, -26);
  const bpMesh = new THREE.Mesh(bustlePipe, makeInkMaterial(OR));
  B.scene.add(bpMesh);
  L.meshes.push(bpMesh);

  // Blast Furnace Mid-Observation Catwalk (Y=6.5m)
  slab(15, -35, 33, -17, 6.5, 0.4, { ink: BL });
  rail(15, -35, 33, -35, 6.7, { ink: OR });
  rail(15, -17, 33, -17, 6.7, { ink: OR });
  rail(15, -35, 15, -17, 6.7, { ink: OR });
  rail(33, -35, 33, -17, 6.7, { ink: OR });

  // Stairs from Foundation (1.5m) to Mid-Catwalk (6.5m, 19 steps, rise 0.263m, run 0.45m)
  // Direction '-z', starts at Z=-8.0, lands at Z=-16.55 flush at catwalk
  stairs(18, 1.5, -8.0, '-z', 19, 2.0, { rise: 5.0 / 19, run: 0.45, ink: BL });

  // High Charging Hopper Deck (Y=12.5m)
  // Cutout open stairwell on East side (X: 28 to 32, Z: -34 to -24)
  slab(16, -34, 28, -18, 12.5, 0.4, { ink: BL });
  slab(28, -24, 32, -18, 12.5, 0.4, { ink: BL });
  rail(16, -34, 28, -34, 12.7, { ink: OR });
  rail(16, -18, 32, -18, 12.7, { ink: OR });

  // Stairs from Mid-Catwalk (6.5m) to Charging Hopper Deck (12.5m, 22 steps, rise 0.2727m)
  // Direction '+z', starts at Z=-34.0, lands at Z=-24.1 flush at upper deck landing
  stairs(30, 6.5, -34.0, '+z', 22, 1.8, { rise: 6.0 / 22, run: 0.45, ink: BL });

  // Furnace Exhaust Bleeder Stacks
  cyl(21, 15.5, -26, 0.6, 6.0, { ink: BK, noCollide: true });
  cyl(27, 15.5, -26, 0.6, 6.0, { ink: BK, noCollide: true });
  ring(24, 22.0, -26, 'y'); // Apex Grapple Ring

  // =========================================================================
  // 4. MID-AIR HERO LANDMARK: OVERHEAD MAGMA CRUCIBLE CABLEWAY (Y=8.5m)
  // =========================================================================
  cyl(18, 8.5, 0, 0.1, 54.0, { axis: 'z', ink: BK, noCollide: true });
  box(18, 4.25, -28, 1.2, 8.5, 1.2, { ink: BL });
  box(18, 4.25, 28, 1.2, 8.5, 1.2, { ink: BL });

  // =========================================================================
  // 5. WEST LANE: HEAVY GANTRY CRANE & SHIPPING CONTAINER MAZE (X=-38 to -16)
  // =========================================================================
  box(-34, 0.15, 0, 0.4, 0.3, 70, { ink: OR });
  box(-18, 0.15, 0, 0.4, 0.3, 70, { ink: OR });

  // Heavy Gantry Crane Structure (Spans X: -35 to -17 at Z=-16, Height Y=7.5m)
  box(-34, 3.8, -16, 1.4, 7.6, 1.4, { ink: OR });
  box(-18, 3.8, -16, 1.4, 7.6, 1.4, { ink: OR });
  // Overhead Gantry Cross-Beam (Y=7.6m, visual framing)
  box(-26, 7.8, -16, 18.0, 1.4, 2.4, { ink: OR, noCollide: true });

  // Crane Operator Maintenance Catwalk (Y=8.5m, X: -33 to -18, Z: -18 to -14)
  slab(-33, -18, -18, -14, 8.5, 0.3, { ink: BL });
  rail(-33, -18, -18, -18, 8.7, { ink: BK });
  rail(-33, -14, -18, -14, 8.7, { ink: BK });

  // Crane Access Ladder / Stairs (Y=0.0m to 8.5m, 31 steps, rise 0.274m, run 0.45m)
  // Direction '+z', starts at Z=-31.95, lands at Z=-18.0 flush at catwalk
  stairs(-19, 0.0, -31.95, '+z', 31, 1.6, { rise: 8.5 / 31, run: 0.45, ink: BL });

  // Shipping Container Stacks
  box(-26, 1.4, -26, 6.0, 2.8, 12.0, { ink: BL, tag: 'cover' });
  box(-26, 4.2, -26, 6.0, 2.8, 8.0, { ink: OR, tag: 'cover' });

  box(-26, 1.4, 18, 6.0, 2.8, 12.0, { ink: GR, tag: 'cover' });
  box(-26, 4.2, 18, 6.0, 2.8, 8.0, { ink: RD, tag: 'cover' });

  // =========================================================================
  // 6. SOUTH INGOT CASTING PLAZA & WORKSHOPS (Z=18 to 44)
  // =========================================================================
  slab(-10, 22, 10, 34, 0.6, 0.6, { ink: BK });
  for (let bz = 24; bz <= 32; bz += 4) {
    box(-6, 0.9, bz, 3.5, 0.6, 1.2, { ink: BL });
    box(6, 0.9, bz, 3.5, 0.6, 1.2, { ink: BL });
  }

  buildCrateStack(B, -14, 0.4, 28, 501);
  buildCrateStack(B, 14, 0.4, 28, 502);
  buildToolRack(B, -12, 0.4, 20, 'z');
  buildToolRack(B, 12, 0.4, 20, 'z');
  buildWarningSign(B, 0, 0.4, 16, 'CAUTION: MOLTEN SLAG 1400C');

  // Ingot Stacks & Rail Trolleys in South Plaza
  box(-10, 0.0, 36, 4.0, 0.9, 2.5, { ink: OR, tag: 'cover' });
  box(10, 0.0, 36, 4.0, 0.9, 2.5, { ink: OR, tag: 'cover' });

  // Heavy Basalt Caldera Spire Outcrops (Corner framing & lava canal rocks)
  facetedRock(-44, 0.0, -44, 4.5, 8.5, 4.5, { ink: BK, cover: 'full', seed: 601 });
  facetedRock(44, 0.0, -44, 4.5, 8.5, 4.5, { ink: BK, cover: 'full', seed: 602 });
  facetedRock(-44, 0.0, 44, 4.5, 8.5, 4.5, { ink: BK, cover: 'full', seed: 603 });
  facetedRock(44, 0.0, 44, 4.5, 8.5, 4.5, { ink: BK, cover: 'full', seed: 604 });
  facetedRock(-10, -1.8, 0, 2.4, 3.2, 2.4, { ink: BK, cover: 'waist', seed: 605 });
  facetedRock(8, -1.8, 0, 2.4, 3.2, 2.4, { ink: BK, cover: 'waist', seed: 606 });

  // =========================================================================
  // 7. TACTICAL SPOTS, GRAPPLE RINGS, PICKUPS & LIGHTING
  // =========================================================================
  ring(0, 11.5, 0, 'y');        // Mid canal center high ring
  ring(18, 11.5, 0, 'y');       // Cableway center ring
  ring(-26, 11.5, -16, 'y');    // Gantry crane crosshead ring
  ring(-26, 7.5, -26, 'y');     // North container stack ring
  ring(-26, 7.5, 18, 'y');      // South container stack ring
  ring(18, 14.5, -17, 'y');     // Charging hopper deck ring in clear air
  ring(13, 5.5, 0, 'y');        // Siphon pipe bridge ring
  ring(-3.5, 3.5, 0, 'y');      // Drawbridge west pylon ring
  ring(3.5, 3.5, 0, 'y');       // Drawbridge east pylon ring
  ring(0, 5.5, 30, 'y');        // South ingot yard ring

  // Sniper Vantage Perches
  sniper(24, 13.0, -20);        // Blast Furnace High Charging Deck
  sniper(-26, 9.0, -15);        // Gantry Crane maintenance catwalk
  sniper(-26, 6.0, -26);        // High North Container roof
  sniper(13, 4.0, 0);           // Siphon pipeline crossover

  // Tactical Spawns
  spawn(0, 0.5, 38);            // South Ingot Plaza (Player Start)
  spawn(-26, 0.5, 30);          // South-West Crane Rail
  spawn(24, 0.5, 30);           // South-East Cableway Base
  spawn(-26, 0.5, -34);         // North-West Container Yard
  spawn(24, 2.0, -20);          // Blast Furnace Base Plinth
  spawn(0, 0.5, -24);           // North Smelting Terrace Mid
  spawn(24, 7.0, -26);          // Blast Furnace Mid-Catwalk
  spawn(-26, 9.0, -15);         // Gantry Crane High Catwalk

  // Pickups
  pickup(24, 13.0, -20, 'special'); // Blast Furnace Highest Perch
  pickup(0, 0.5, 0, 'damage');      // Center Drawbridge (CQB choke)
  pickup(-26, 9.0, -15, 'speed');   // Gantry Crane High Platform
  pickup(-26, 6.0, 18, 'shield');   // South Container Roof
  pickup(0, 0.5, 30, 'health');     // South Ingot Plaza safe approach
  pickup(0, 0.5, -30, 'health');    // North terrace safe approach

  // =========================================================================
  // 8. LIVING KINETIC AMBIENT ACTORS (L.animated)
  // =========================================================================
  if (B.scene && B.scene.add && L.animated) {
    const ladleGroup = new THREE.Group();
    const ladleGeom = new THREE.CylinderGeometry(1.4, 1.1, 2.2, 12);
    const ladleMat = makeInkMaterial(BK, { wireframe: true });
    const ladleMesh = new THREE.Mesh(ladleGeom, ladleMat);
    ladleMesh.position.y = -1.2;
    ladleGroup.add(ladleMesh);

    const lavaTop = new THREE.Mesh(
      new THREE.CircleGeometry(1.2, 12),
      makeInkMaterial(OR, { wireframe: true })
    );
    lavaTop.rotation.x = -Math.PI / 2;
    lavaTop.position.y = -0.15;
    ladleGroup.add(lavaTop);

    const hanger = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 1.0, 0.2),
      makeInkMaterial(BL, { wireframe: true })
    );
    hanger.position.y = -0.1;
    ladleGroup.add(hanger);

    ladleGroup.position.set(18, 8.5, 0);
    B.scene.add(ladleGroup);
    L.meshes.push(ladleGroup);

    L.animated.push({
      mesh: ladleGroup,
      update: (time) => {
        ladleGroup.position.z = Math.sin(time * 0.35) * 20.0;
        ladleGroup.rotation.x = Math.cos(time * 0.35) * 0.08;
      }
    });
  }

  planes(4, 28, 22, { rStep: 8, hStep: 4, scale: 1.3, speed: 0.15 });

  return finish();
}
