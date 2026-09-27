import * as THREE from 'three';
import { INK, makeInkMaterial } from '../render.js';
import {
  buildFullGalleon,
  buildSuspendedRopeBridge,
  buildCrateStack,
  buildToolRack,
  buildRopeCoil,
  buildWarningSign,
  buildWaterRipples
} from '../prefabs.js';

/**
 * ============================================================================
 * PIRATE COVE (SMUGGLER'S HARBOR) - pirate_cove
 * ============================================================================
 * A colossal maritime battleground set in a subterranean sea cave and tidal
 * lagoon. Features a full 3-masted war galleon, a towering stone lighthouse,
 * cliffside stilt walkways, and high-altitude catenary rope suspension bridges.
 */
export function buildPirateCove(B, arena = false) {
  const {
    L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring,
    spawn, sniper, pickup, planes, finish, facetedRock
  } = B;

  const OR = INK.ORANGE; // Aged Oak Wood / Teak
  const GR = INK.GREEN;  // Algae / Moss / Foliage
  const BK = INK.BLACK;  // Cast Iron / Anchor Steel
  const BL = INK.BLUE;   // Ocean Lagoon Water / Slate Stone
  const RD = INK.RED;    // Smuggler's Red Wax / Signal Lights

  L.key = 'pirate_cove';
  L.playerStart.set(0, 0.5, 38);

  const P = arena ? 65 : 52;
  const PH = arena ? 26 : 18;
  const T = 5.0;
  L.bounds.minX = -P; L.bounds.maxX = P;
  L.bounds.minZ = -P; L.bounds.maxZ = P;

  // =========================================================================
  // 1. BEDROCK PLINTH & FOUNDATION SKIRTING (ZERO UNDER-WORLD LEAKS)
  // =========================================================================
  // Deep subterranean bedrock floor beneath the lagoon (-2.4m)
  slab(-P, -P, P, P, -2.4, 0.6, { ink: BL, noCollide: false });

  // Perimeter cliffside sea cave cavern walls
  wallZ(-P, -P, P, PH + 2.4, T, { ink: BK, yBase: -2.4 });
  wallZ(P, -P, P, PH + 2.4, T, { ink: BK, yBase: -2.4 });
  wallX(-P, P, -P, PH + 2.4, T, { ink: BK, yBase: -2.4 });
  wallX(-P, P, P, PH + 2.4, T, { ink: BK, yBase: -2.4 });

  // =========================================================================
  // 2. MAIN GROUND FLOORS (Y=0.0m) WITH CUTOUT SUNKEN LAGOON
  // =========================================================================
  // The sunken lagoon occupies X: [-22, 22], Z: [-24, 18], resting at Y=-1.8m.
  // North shoreline plaza
  slab(-P, -P, P, -24, 0.0, 0.6, { ink: BL });
  // South harbor promenade (Player start area)
  slab(-P, 18, P, P, 0.0, 0.6, { ink: BL });
  // West smuggler's coastal shelf
  slab(-P, -24, -22, 18, 0.0, 0.6, { ink: BL });
  // East lighthouse promontory shelf
  slab(22, -24, P, 18, 0.0, 0.6, { ink: BL });

  // Lagoon Basin Water Surface (-1.4m)
  box(0, -1.4, -3, 44, 0.2, 42, { ink: BL, noCollide: true });

  // Animated Water Ripples on Lagoon Surface
  buildWaterRipples(B, 0, -1.35, -3, { count: 8, radius: 18, ink: BL });

  // Lagoon Quayside Retaining Skirt Walls (with clear doorway gaps for stairs)
  // North retaining wall with gaps at X=[-20, -16] and X=[16, 20]
  wallX(-22, 22, -24, -1.8, 1.8, 0.6, [[-20, -16], [16, 20]], { ink: BK });
  // South retaining wall with gaps at X=[-20, -16] and X=[16, 20]
  wallX(-22, 22, 18, -1.8, 1.8, 0.6, [[-20, -16], [16, 20]], { ink: BK });
  // West retaining wall
  box(-22, -0.9, -3, 0.6, 1.8, 42, { ink: BK });
  // East retaining wall
  box(22, -0.9, -3, 0.6, 1.8, 42, { ink: BK });

  // Lagoon Access Staircases (4 quadrant stone slipways, rise 0.257m <= 0.28m)
  // South-West slipway: starts at Z=14.85, ends cleanly at Z=18.0 (run = 7 * 0.45 = 3.15m)
  stairs(-18, -1.8, 14.85, '+z', 7, 2.2, { rise: 1.8 / 7, run: 0.45, ink: BL });
  // South-East slipway
  stairs(18, -1.8, 14.85, '+z', 7, 2.2, { rise: 1.8 / 7, run: 0.45, ink: BL });
  // North-West slipway: starts at Z=-20.85, ends cleanly at Z=-24.0
  stairs(-18, -1.8, -20.85, '-z', 7, 2.2, { rise: 1.8 / 7, run: 0.45, ink: BL });
  // North-East slipway
  stairs(18, -1.8, -20.85, '-z', 7, 2.2, { rise: 1.8 / 7, run: 0.45, ink: BL });

  // =========================================================================
  // 3. MID HERO LANDMARK: THE WAR GALLEON "THE BLACK INK"
  // =========================================================================
  buildFullGalleon(B, 0, -1.0, -4, { ink: OR });

  // Tidal Harbor Boardwalks & Mooring Piers connecting docks to the Galleon
  slab(-3.5, 6, 3.5, 18, 0.2, 0.4, { ink: OR });
  for (let pz = 8; pz <= 16; pz += 4) {
    cyl(-3.0, -0.9, pz, 0.25, 2.0, { ink: BK });
    cyl(3.0, -0.9, pz, 0.25, 2.0, { ink: BK });
  }

  // West Flanking Gangplank (X: -12.0 to -6.0)
  slab(-12, -6, -6, -2, 2.2, 0.3, { ink: OR });
  // Stairs connecting West dock (-1.0m) to West Gangplank (2.2m)
  // 12 steps, rise = 3.2 / 12 = 0.267m, run = 0.45m (total run = 5.4m)
  // Direction '+x', starts at -17.4, ends at -12.0 flush with slab edge
  stairs(-17.4, -1.0, -4, '+x', 12, 2.0, { rise: 3.2 / 12, run: 0.45, ink: OR });

  // East Flanking Gangplank (X: 6.0 to 12.0)
  slab(6, -6, 12, -2, 2.2, 0.3, { ink: OR });
  // Direction '-x', starts at 17.4, ends at 12.0 flush with slab edge
  stairs(17.4, -1.0, -4, '-x', 12, 2.0, { rise: 3.2 / 12, run: 0.45, ink: OR });

  // Mooring Bollards on boardwalks
  cyl(-3.2, 0.5, 8, 0.2, 0.6, { ink: BK });
  cyl(3.2, 0.5, 8, 0.2, 0.6, { ink: BK });
  cyl(-3.2, 0.5, 15, 0.2, 0.6, { ink: BK });
  cyl(3.2, 0.5, 15, 0.2, 0.6, { ink: BK });

  // =========================================================================
  // 4. EAST LANE: SMUGGLER'S LIGHTHOUSE BASTION (X=26 to 46, Z=-34 to -12)
  // =========================================================================
  // Bastion Promenade Terrace (Y=4.2m)
  slab(26.2, -34, 46, -12, 4.2, 0.6, { ink: BL });
  // Fortress Skirting Foundation under the terrace (Y: 0.0 to 4.2, X: 26.4 to 46.0)
  box(36.2, 0.0, -23, 19.6, 4.2, 22, { ink: BK });

  // Ramparts along cliff edge
  wallZ(26.2, -34, -12, 1.1, 0.4, { ink: BK, yBase: 4.2 });
  wallX(26.2, 46, -12, 1.1, 0.4, { ink: BK, yBase: 4.2 });
  wallX(26.2, 46, -34, 1.1, 0.4, { ink: BK, yBase: 4.2 });

  // Bastion Access Stairs from Ground (Y=0.0m to Y=4.2m, 16 steps, rise 0.2625m)
  // Starts at X=19.0, ends at X=26.2 (run = 16 * 0.45 = 7.2m)
  stairs(19.0, 0.0, -18, '+x', 16, 2.4, { rise: 4.2 / 16, run: 0.45, ink: BL });

  // The Smuggler's Stone Lighthouse (Column from Y=4.2 to 12.2)
  cyl(36, 4.2, -23, 4.5, 8.0, { ink: BL });
  cyl(36, 12.2, -23, 5.8, 0.5, { ink: OR });
  rail(31, -23, 41, -23, 12.45, { ink: BK });

  // Lantern Glass Enclosure & Roof
  cyl(36, 12.7, -23, 3.8, 2.6, { ink: OR });
  cyl(36, 15.3, -23, 4.8, 2.4, { ink: GR });
  // Weather Vane Spire
  cyl(36, 17.7, -23, 0.15, 2.5, { ink: BK, noCollide: true });
  ring(36, 21.0, -23, 'y'); // Ring in clear air above roof

  // External Stone Stairs to Lighthouse Mid-Gallery (Y=4.2m to 8.2m)
  // Sits on top of the terrace (Y=4.2m), climbing to elevated balcony at Y=8.2m
  slab(30, -32, 42, -28, 8.2, 0.4, { ink: BL });
  // 15 steps, rise = 4.0 / 15 = 0.267m, run = 0.45m (total run = 6.75m)
  // Direction '-z', starts at Z=-21.25, ends at Z=-28.0 flush at balcony
  stairs(32, 4.2, -21.25, '-z', 15, 2.0, { rise: 4.0 / 15, run: 0.45, ink: BL });

  // Coast Guard Cannons on Bastion
  box(27.5, 4.8, -16, 2.4, 0.8, 1.2, { ink: BK });
  cyl(25.5, 5.1, -16, 0.35, 2.8, { axis: 'x', ink: BK });
  box(27.5, 4.8, -28, 2.4, 0.8, 1.2, { ink: BK });
  cyl(25.5, 5.1, -28, 0.35, 2.8, { axis: 'x', ink: BK });

  // Cannonball Pyramids
  sphere(29, 4.6, -16, 0.3, { ink: BK });
  sphere(29.5, 4.6, -16, 0.3, { ink: BK });
  sphere(29.25, 5.1, -16, 0.3, { ink: BK });

  // =========================================================================
  // 5. WEST LANE: SEA CAVE DISTILLERY & STILT TOWN (X=-44 to -26, Z=-36 to 5)
  // =========================================================================
  // Elevated Stilt Terrace 1: Rum Stash Platform (Y=3.5m)
  slab(-42, -26, -26, -10, 3.5, 0.4, { ink: OR });
  // Timber piles supporting Terrace 1 (positioned to not obstruct stairs)
  for (let px = -40; px <= -28; px += 6) {
    for (let pz = -22; pz <= -12; pz += 6) {
      cyl(px, 1.5, pz, 0.3, 3.5, { ink: BK, noCollide: true });
    }
  }
  rail(-42, -26, -26, -26, 3.7, { ink: BK });
  rail(-26, -26, -26, -10, 3.7, { ink: BK });
  rail(-42, -10, -26, -10, 3.7, { ink: BK });

  // Stilt Terrace Access Stairs (Ground 0.0m to 3.5m, 14 steps, rise 0.250m)
  // Direction '-z', starts at Z=-3.7, lands at Z=-10.0 (run = 14 * 0.45 = 6.3m)
  stairs(-32, 0.0, -3.7, '-z', 14, 2.2, { rise: 3.5 / 14, run: 0.45, ink: OR });

  // Elevated Stilt Terrace 2: Cavern Lookout (Y=6.2m, X=-44 to -30, Z=-36 to -28)
  slab(-44, -36, -30, -28, 6.2, 0.4, { ink: OR });
  // Stairs from Terrace 1 (3.5m) to Terrace 2 (6.2m, rise 2.7 / 10 = 0.27m, run 4.5m)
  // Direction '-z', starts at Z=-23.5, ends at Z=-28.0 flush with Terrace 2
  stairs(-36, 3.5, -23.5, '-z', 10, 2.0, { rise: 2.7 / 10, run: 0.45, ink: OR });

  // Smuggler's Cargo Crane & Hoist Tower (X=-26, Z=-14)
  cyl(-26, 5.0, -14, 0.4, 7.0, { ink: BK, noCollide: true });
  cyl(-22, 8.5, -14, 0.25, 8.0, { axis: 'x', ink: BK, noCollide: true });
  cyl(-18.5, 6.0, -14, 0.08, 4.0, { ink: BK, noCollide: true });
  box(-18.5, 3.6, -14, 1.4, 1.4, 1.4, { ink: OR });
  ring(-18.5, 9.2, -14, 'y'); // Clean air ring above cargo crate

  // Smuggler's Clutter
  buildCrateStack(B, -35, 3.9, -16, 1401);
  buildCrateStack(B, -30, 3.9, -18, 1402);
  buildRopeCoil(B, -38, 3.9, -20);
  buildToolRack(B, -40, 3.9, -12, 'z');

  // =========================================================================
  // 6. CATENARY ROPE SUSPENSION BRIDGES (AERIAL TIER, Y=6.2m to 8.2m)
  // =========================================================================
  // Bridge 1: Spans from Stilt Lookout (-30, -32) to North Pier (-8, -32) at Y=6.2m
  buildSuspendedRopeBridge(B, -30, -32, -8, -32, 6.2, { width: 2.2, maxSag: 0.35 });

  // North Overlook Stone Bridge Deck (Connecting East and West High Perches)
  slab(-8, -34, 8, -30, 6.2, 0.4, { ink: BL });
  rail(-8, -34, 8, -34, 6.4, { ink: BK });
  rail(-8, -30, 8, -30, 6.4, { ink: BK });

  // Bridge 2: Spans from North Overlook (8, -32) to Lighthouse Fortress (28, -32) at Y=6.2m
  buildSuspendedRopeBridge(B, 8, -32, 28, -32, 6.2, { width: 2.2, maxSag: 0.35 });

  // =========================================================================
  // 7. SOUTH HARBOR APPROACH & TRANSITION BELTS (Z=18 to 45)
  // =========================================================================
  // South-West Harbor Shack (Armory & Smuggler Depot)
  box(-14, 1.2, 26, 4.8, 2.4, 3.6, { ink: OR });
  // South-East Harbor Shack (Customs & Nav Office)
  box(14, 1.2, 26, 4.8, 2.4, 3.6, { ink: OR });

  // Anchor Monument in Center Harbor Plaza
  cyl(0, 1.8, 30, 0.4, 3.6, { ink: BK, noCollide: true });
  cyl(0, 3.2, 30, 0.25, 2.8, { axis: 'x', ink: BK, noCollide: true });
  ring(0, 5.8, 30, 'y'); // Ring raised above monument in clear air
  sphere(0, 0.4, 30, 0.8, { ink: BK, noCollide: true });

  // South-East Smuggler Watchtower (Macro Hero Structure at x=32, z=32, y=0)
  cyl(30, 1.75, 30, 0.25, 3.5, { ink: BK, noCollide: true });
  cyl(34, 1.75, 30, 0.25, 3.5, { ink: BK, noCollide: true });
  cyl(30, 1.75, 34, 0.25, 3.5, { ink: BK, noCollide: true });
  cyl(34, 1.75, 34, 0.25, 3.5, { ink: BK, noCollide: true });
  slab(29, 29, 35, 35, 3.5, 0.3, { ink: OR });
  rail(29, 29, 35, 29, 3.7, { ink: BK });
  rail(29, 35, 35, 35, 3.7, { ink: BK });
  rail(35, 29, 35, 35, 3.7, { ink: BK });
  // Watchtower Access Stairs (14 steps, rise 0.250m, run 0.45m, total run 6.3m)
  stairs(32, 0.0, 22.7, '+z', 14, 1.8, { rise: 3.5 / 14, run: 0.45, ink: OR });
  ring(32, 7.5, 32, 'y');

  // South-West Fishery Staging & Netting Pergola (x=-32, z=32)
  slab(-36, 28, -26, 36, 1.6, 0.3, { ink: OR });
  // 6 steps up to deck (rise 1.6/6 = 0.267m, run 0.45m, run 2.7m)
  stairs(-31, 0.0, 25.3, '+z', 6, 2.2, { rise: 1.6 / 6, run: 0.45, ink: OR });
  buildToolRack(B, -34, 1.9, 34, 'z');
  buildRopeCoil(B, -28, 1.9, 30);
  buildCrateStack(B, -28, 1.9, 34, 1842);

  // Smuggler Timber Palisades along Harbor Shoreline
  for (let px = -22; px <= -16; px += 1.5) {
    cyl(px, 1.2, 20, 0.2, 2.4, { ink: OR });
  }
  for (let px = 16; px <= 22; px += 1.5) {
    cyl(px, 1.2, 20, 0.2, 2.4, { ink: OR });
  }

  // =========================================================================
  // 7B. COASTAL SEA-STACKS & SHORELINE REEF BOULDERS (ANTI-SLOP ROCK MESHES)
  // =========================================================================
  facetedRock(-42, 0.0, 42, 4.5, 7.0, 4.5, { ink: BL, cover: 'full', seed: 401 });
  facetedRock(-38, 0.0, 44, 3.2, 4.5, 3.2, { ink: BL, cover: 'full', seed: 402 });
  facetedRock(42, 0.0, 42, 4.5, 7.0, 4.5, { ink: BL, cover: 'full', seed: 403 });
  facetedRock(38, 0.0, 44, 3.2, 4.5, 3.2, { ink: BL, cover: 'full', seed: 404 });
  facetedRock(-36, 0.0, -42, 5.0, 8.5, 5.0, { ink: BL, cover: 'full', seed: 405 });
  facetedRock(36, 0.0, -42, 5.0, 8.5, 5.0, { ink: BL, cover: 'full', seed: 406 });
  facetedRock(0, 0.0, -44, 6.5, 8.0, 4.2, { ink: BL, cover: 'full', seed: 407 });

  // North Shore Beached Skiff & Half-Buried Shipwreck Ribs (x=-14, z=-34)
  for (let i = 0; i < 5; i++) {
    const rx = -18 + i * 2.2;
    const rz = -34 + (i % 2) * 0.6;
    cyl(rx, 1.2, rz, 0.25, 2.4, { ink: OR });
    cyl(rx, 2.4, rz, 0.2, 1.8, { axis: 'x', ink: OR, noCollide: true });
  }

  // East Lane Grand Bastion Entrance Portal (framing bastion stairs at x=19, z=-18)
  box(18.5, 2.2, -15.5, 1.2, 4.4, 1.2, { ink: BL });
  box(18.5, 2.2, -20.5, 1.2, 4.4, 1.2, { ink: BL });
  box(18.5, 4.6, -18.0, 1.4, 0.8, 6.2, { ink: BL });

  // Clutter Stacks along the Transition Belts
  buildCrateStack(B, -8, 0.4, 32, 2011);
  buildCrateStack(B, 8, 0.4, 32, 2012);
  buildRopeCoil(B, -6, 0.4, 25);
  buildRopeCoil(B, 6, 0.4, 25);
  buildWarningSign(B, 4, 0.4, 20, 'DANGER: DEEP HARBOR');

  // =========================================================================
  // 8. TACTICAL SPOTS, GRAPPLE RINGS, PICKUPS & LIGHTING
  // =========================================================================
  ring(0, 29.5, -2, 'y');     // Mainmast top ring
  ring(-19, 9.0, -32, 'y');   // Suspension bridge 1 mid-span ring
  ring(18, 9.0, -32, 'y');    // Suspension bridge 2 mid-span ring
  ring(0, 9.0, -32, 'y');     // North overlook center ring
  ring(-14, 5.5, 26, 'y');    // West shack roof ring
  ring(14, 5.5, 26, 'y');     // East shack roof ring
  ring(-30, 10.0, -18, 'y');  // Stilt town high ring
  ring(28, 9.0, -18, 'y');    // Bastion terrace ring

  // Sniper Nests
  sniper(36, 12.5, -23);      // Lighthouse upper gallery
  sniper(0, 25.5, -2);        // Galleon mainmast crow's nest
  sniper(-42, 6.5, -34);      // Smuggler's cavern high lookout
  sniper(0, 6.5, -32);        // North stone arch overlook

  // Tactical Spawns (Balanced 3-lane distribution, avoiding mutual LOS)
  spawn(-28, 0.5, 34);        // South-West Harbor
  spawn(28, 0.5, 34);         // South-East Harbor
  spawn(-36, 3.8, -18);       // West Stilt Town
  spawn(36, 4.5, -20);        // East Lighthouse Bastion
  spawn(0, 4.8, -4);          // Galleon Gun Deck Choke
  spawn(-8, 6.5, -32);        // North High Bridge West
  spawn(8, 6.5, -32);         // North High Bridge East
  spawn(0, 0.5, -36);         // Far North Cavern Shore

  // Pickups (Risk-stratified placement)
  pickup(0, 26.5, -2, 'special');  // High-risk top crow's nest
  pickup(36, 13.0, -23, 'damage'); // Lighthouse sniper lantern
  pickup(0, 5.0, -4, 'speed');     // Galleon broadside mid-deck
  pickup(-34, 4.0, -14, 'shield'); // Smuggler's distillery rum cache
  pickup(0, 0.5, 24, 'health');    // South harbor safe approach
  pickup(0, 6.5, -32, 'special');  // North suspension bridge midpoint

  // =========================================================================
  // 9. LIVING KINETIC AMBIENT ACTORS (L.animated)
  // =========================================================================
  if (B.scene && B.scene.add && L.animated) {
    // 1. Rotating Lighthouse Searchlight Beam
    const beamGeom = new THREE.CylinderGeometry(0.3, 8.0, 36, 16, 1, true);
    const beamMat = makeInkMaterial(BL, { wireframe: true, transparent: true, opacity: 0.35 });
    const searchlightBeam = new THREE.Mesh(beamGeom, beamMat);
    searchlightBeam.position.set(36, 13.8, -23);
    searchlightBeam.rotation.z = Math.PI / 2;
    B.scene.add(searchlightBeam);
    L.meshes.push(searchlightBeam);

    // 2. Swaying Brass Bowsprit Lantern on Galleon
    const lanternPiv = new THREE.Group();
    lanternPiv.position.set(0, 5.5, 22);
    const lanternBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.9, 0.6),
      makeInkMaterial(OR, { wireframe: true })
    );
    lanternBody.position.y = -0.5;
    lanternPiv.add(lanternBody);
    B.scene.add(lanternPiv);
    L.meshes.push(lanternPiv);

    L.animated.push({
      mesh: searchlightBeam,
      update: (time) => {
        searchlightBeam.rotation.y = time * 0.45;
        lanternPiv.rotation.z = Math.sin(time * 1.8) * 0.12;
        lanternPiv.rotation.x = Math.cos(time * 1.4) * 0.08;
      }
    });
  }

  // Circling Sea Gulls Overhead
  planes(4, 28, 22, { rStep: 8, hStep: 4, scale: 1.2, speed: 0.14 });

  return finish();
}
