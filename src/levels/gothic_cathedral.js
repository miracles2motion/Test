import * as THREE from 'three';
import { INK, makeInkMaterial } from '../render.js';
import {
  buildCrateStack,
  buildToolRack,
  buildWarningSign
} from '../prefabs.js';

/**
 * ============================================================================
 * GOTHIC CATHEDRAL (CATHEDRAL OF ASH & QUILL) - gothic_cathedral
 * ============================================================================
 * A monumental gothic cathedral built from pointed rib vaults, compound stone
 * colonnades, high triforium galleries, exterior flying buttresses, a high
 * belfry tower with a swinging bronze bell, and a sunken subterranean crypt.
 *
 * Major Sectors:
 * 1. THE GRAND NAVE (Mid, Y=0.0m to 12.0m): Central vaulted hall flanked by
 *    stone pillars, rows of wooden pews, and the raised high altar (Y=1.2m).
 * 2. SUBTERRANEAN CRYPT (Mid-Sunken, Y=-1.8m): Under-altar burial vault with
 *    stone sarcophagi and flanking stealth tunnel passages.
 * 3. THE BELFRY CLOCK TOWER (West Hero, Y=0.0m to 18.0m): Massive square bell tower
 *    with interior stairs, high open belfry, and kinetic swinging bronze bell.
 * 4. TRIFORIUM & ORGAN LOFT (Air, Y=5.5m): Upper perimeter gallery running along
 *    the nave walls, connecting the pipe organ to the rose window gallery.
 * 5. EXTERIOR FLYING BUTTRESSES (East & Roofline, Y=4.0m to 8.5m): Walkable
 *    curved stone arches supporting the high clerestory roof.
 */
export function buildGothicCathedral(B, arena = false) {
  const {
    L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring,
    spawn, sniper, pickup, planes, arch, finish
  } = B;

  const OR = INK.ORANGE; // Weathered Oak / Gold Trim / Organ Pipes
  const GR = INK.GREEN;  // Algae Stains / Verdigris Bronze Bell
  const BK = INK.BLACK;  // Heavy Ironwork / Slate Shingles / Ash
  const BL = INK.BLUE;   // Chiseled Cathedral Limestone
  const RD = INK.RED;    // Sacred Candlelight / Stained Glass Accents

  L.key = 'gothic_cathedral';
  L.playerStart.set(0, 0.5, 38);

  const P = arena ? 64 : 52;
  const PH = arena ? 28 : 22;
  const T = 5.0;
  L.bounds.minX = -P; L.bounds.maxX = P;
  L.bounds.minZ = -P; L.bounds.maxZ = P;

  // =========================================================================
  // 1. BEDROCK PLINTH & CATHEDRAL FOUNDATION
  // =========================================================================
  // Sub-crypt bedrock foundation floor (-2.4m)
  slab(-P, -P, P, P, -2.4, 0.6, { ink: BL, noCollide: false });

  // Cathedral Exterior Enclosing Walls
  wallZ(-P, -P, P, PH + 2.4, T, { ink: BK, yBase: -2.4 });
  wallZ(P, -P, P, PH + 2.4, T, { ink: BK, yBase: -2.4 });
  wallX(-P, P, -P, PH + 2.4, T, { ink: BK, yBase: -2.4 });
  wallX(-P, P, P, PH + 2.4, T, { ink: BK, yBase: -2.4 });

  // =========================================================================
  // 2. MAIN NAVE FLOOR (Y=0.0m) WITH SUNKEN CRYPT CUTOUT
  // =========================================================================
  // The crypt occupies X: [-10, 10], Z: [-32, -14], at Y=-1.8m
  // South Nave / Narthex floor (Player Start Area, Z: -10 to P)
  slab(-P, -10, P, P, 0.0, 0.6, { ink: BL });
  // Flanking floor slabs around the South stair opening (Z: -14 to -10)
  slab(-P, -14, -2.5, -10, 0.0, 0.6, { ink: BL });
  slab(2.5, -14, P, -10, 0.0, 0.6, { ink: BL });

  // Far North Apse ambulatory floor (Z: -P to -36)
  slab(-P, -P, P, -36, 0.0, 0.6, { ink: BL });
  // Flanking floor slabs around the North stair opening (Z: -36 to -32)
  slab(-P, -36, -2.5, -32, 0.0, 0.6, { ink: BL });
  slab(2.5, -36, P, -32, 0.0, 0.6, { ink: BL });

  // West side aisle floor around crypt (X: -P to -10, Z: -32 to -14)
  slab(-P, -32, -10, -14, 0.0, 0.6, { ink: BL });
  // East side aisle floor around crypt (X: 10 to P, Z: -32 to -14)
  slab(10, -32, P, -14, 0.0, 0.6, { ink: BL });

  // Crypt Basin Floor (-1.8m)
  slab(-10, -32, 10, -14, -1.8, 0.4, { ink: BK });

  // Crypt Retaining Skirt Walls (with open doorway gaps for stairs)
  wallX(-10, 10, -14, -1.8, 1.8, 0.6, [[-2.5, 2.5]], { ink: BK });
  wallX(-10, 10, -32, -1.8, 1.8, 0.6, [[-2.5, 2.5]], { ink: BK });
  box(-10, -0.9, -23, 0.6, 1.8, 18, { ink: BK });
  box(10, -0.9, -23, 0.6, 1.8, 18, { ink: BK });

  // Crypt Access Stairs (rise 1.8 / 7 = 0.257m, run 0.45m, total run 3.15m)
  // South Stair: starts inside crypt at Z=-14.0 (Y=-1.8m), climbs to Z=-10.85 (Y=0.0m)
  stairs(0, -1.8, -14.0, '+z', 7, 2.4, { rise: 1.8 / 7, run: 0.45, ink: BL });
  // North Stair: starts inside crypt at Z=-32.0 (Y=-1.8m), climbs to Z=-35.15 (Y=0.0m)
  stairs(0, -1.8, -32.0, '-z', 7, 2.4, { rise: 1.8 / 7, run: 0.45, ink: BL });

  // Inside the Crypt: Stone Sarcophagi & Vault Pillars
  box(-5, -1.1, -23, 2.0, 1.2, 4.2, { ink: BL });
  box(5, -1.1, -23, 2.0, 1.2, 4.2, { ink: BL });
  box(0, -1.1, -23, 2.0, 1.2, 4.2, { ink: OR });

  cyl(-5, -1.8, -18, 0.4, 2.8, { ink: BK });
  cyl(5, -1.8, -18, 0.4, 2.8, { ink: BK });
  cyl(-5, -1.8, -28, 0.4, 2.8, { ink: BK });
  cyl(5, -1.8, -28, 0.4, 2.8, { ink: BK });

  // =========================================================================
  // 3. MID SECTOR: GRAND NAVE COLONNADE & HIGH ALTAR
  // =========================================================================
  for (let z = -6; z <= 24; z += 6) {
    cyl(-8, 0.0, z, 0.75, 12.0, { ink: BL });
    cyl(8, 0.0, z, 0.75, 12.0, { ink: BL });
    arch(0, 10.0, z, 16.0, 3.2, 0.8, { axis: 'x', ink: BL });
  }

  // Wooden Church Pews flanking the central aisle
  for (let z = -4; z <= 20; z += 4) {
    box(-4.5, 0.5, z, 4.5, 0.9, 0.6, { ink: OR, tag: 'cover' });
    box(4.5, 0.5, z, 4.5, 0.9, 0.6, { ink: OR, tag: 'cover' });
  }

  // Raised High Altar Platform (North Apse, Y=1.2m, X: -6 to 6, Z: -44 to -37)
  slab(-7, -44, 7, -37, 1.2, 0.4, { ink: BL });
  box(0, 1.8, -40, 4.0, 1.1, 1.8, { ink: OR });

  // Stairs up to Altar Platform (Y=0.0m to 1.2m, 5 steps, rise 0.24m, run 2.25m)
  // Direction '-z', starts at Z=-34.75, ends at Z=-37.0 flush with altar slab
  stairs(0, 0.0, -34.75, '-z', 5, 2.4, { rise: 1.2 / 5, run: 0.45, ink: BL });

  // =========================================================================
  // 4. HERO STRUCTURE: THE BELFRY CLOCK TOWER (West Facade, X=-24 to -12, Z=18 to 30)
  // =========================================================================
  wallX(-24, -12, 17.4, 0.0, 18.0, 0.8, [], { ink: BL });
  wallX(-24, -12, 30.0, 0.0, 18.0, 0.8, [], { ink: BL });
  wallZ(17.4, 30.0, -24.0, 0.0, 18.0, 0.8, [], { ink: BL });
  wallZ(17.4, 30.0, -12.0, 0.0, 18.0, 0.8, [[22, 26, 0, 3.5]], { ink: BL });

  // Belfry Tower Intermediate Landing (Y=5.5m)
  // West side corridor landing and north apron (open stairwell at X: -17 to -12, Z: 18 to 27)
  slab(-23.6, 17.8, -17.0, 29.6, 5.5, 0.4, { ink: BL });
  slab(-17.0, 27.0, -12.4, 29.6, 5.5, 0.4, { ink: BL });

  // Stairs from Ground (0.0m) to Landing (5.5m, 20 steps, rise 0.275m, run 0.45m)
  // Direction '+z', starts at Z=18.0, ends at Z=27.0 inside tower
  stairs(-15, 0.0, 18.0, '+z', 20, 1.8, { rise: 5.5 / 20, run: 0.45, ink: BL });

  // Upper Bell Chamber Floor (Y=12.0m)
  // East side floor and south landing apron (open stairwell at X: -23.6 to -18.0, Z: 18.0 to 29.6)
  slab(-18.0, 17.8, -12.4, 29.6, 12.0, 0.4, { ink: BL });
  slab(-23.6, 17.4, -18.0, 18.0, 12.0, 0.4, { ink: BL });

  // Stairs from Landing (5.5m) to Bell Chamber (12.0m, 24 steps, rise 0.2708m, run 0.45m)
  // Direction '-z', starts at Z=28.8, ends at Z=18.0 flush at landing apron
  stairs(-20.5, 5.5, 28.8, '-z', 24, 1.8, { rise: 6.5 / 24, run: 0.45, ink: BL });

  // High Open Belfry Arches (Y=12.0m to 16.0m)
  rail(-23.6, 18.0, -12.4, 18.0, 12.2, { ink: BK });
  rail(-23.6, 29.6, -12.4, 29.6, 12.2, { ink: BK });
  rail(-23.6, 18.0, -23.6, 29.6, 12.2, { ink: BK });
  rail(-12.4, 18.0, -12.4, 29.6, 12.2, { ink: BK });

  // Tower Roof & Cross Spire
  cyl(-18, 18.0, 24, 6.0, 4.0, { ink: BK, noCollide: true });
  cyl(-18, 21.0, 24, 0.15, 3.5, { ink: OR, noCollide: true });
  ring(-18, 24.5, 24, 'y');

  // =========================================================================
  // 5. MID-TIER: TRIFORIUM GALLERY & HIGH ORGAN LOFT (Y=5.5m)
  // =========================================================================
  // West Triforium Catwalk (X: -13 to -9, Z: -12 to 24)
  slab(-13, -12, -9, 24, 5.5, 0.4, { ink: BL });
  rail(-9, -12, -9, 24, 5.7, { ink: BK });

  // East Triforium Catwalk (split to leave open stairwell for access stairs)
  slab(9, 6.0, 13, 24, 5.5, 0.4, { ink: BL });
  slab(9, -12, 13, -4.0, 5.5, 0.4, { ink: BL });
  rail(9, -12, 9, -4.0, 5.7, { ink: BK });
  rail(9, 6.0, 9, 24, 5.7, { ink: BK });

  // South High Organ Loft (Connecting East & West Triforium)
  slab(-13, 24, 13, 30, 5.5, 0.4, { ink: BL });
  rail(-9, 24, 9, 24, 5.7, { ink: OR });

  // Pipe Organ
  box(0, 7.5, 29, 6.0, 4.0, 1.2, { ink: OR });
  for (let ox = -2.5; ox <= 2.5; ox += 0.5) {
    const pipeH = 3.0 + Math.abs(ox) * 0.8;
    cyl(ox, 7.5 + pipeH / 2, 28.2, 0.18, pipeH, { ink: OR, noCollide: true });
  }

  // East Triforium Access Stairs (Y=0.0m to 5.5m, 20 steps, rise 0.275m)
  // Direction '+z', starts at Z=-3.0, ends at Z=6.0 flush with East gallery
  stairs(11, 0.0, -3.0, '+z', 20, 2.0, { rise: 5.5 / 20, run: 0.45, ink: BL });

  // =========================================================================
  // 6. EXTERIOR FLYING BUTTRESSES (East Flank, X=13 to 26, Y=3.5m to 8.5m)
  // =========================================================================
  for (let z = -6; z <= 18; z += 12) {
    box(24, 4.0, z, 2.4, 8.0, 2.4, { ink: BL });
    arch(18.5, 7.0, z, 11.0, 2.5, 1.0, { axis: 'z', ink: BL });
    ring(24, 12.8, z, 'y');
  }

  // Exterior Cloister Walkway
  buildCrateStack(B, 20, 0.4, -14, 401);
  buildToolRack(B, 26, 0.4, 0, 'z');
  buildWarningSign(B, 18, 0.4, 16, 'CLOISTER SANCTUARY');

  // =========================================================================
  // 7. TACTICAL SPOTS, GRAPPLE RINGS, PICKUPS & LIGHTING
  // =========================================================================
  ring(0, 14.5, 0, 'y');       // Center nave apex vault ring
  ring(0, 14.5, 18, 'y');      // South nave vault ring
  ring(0, 14.5, -18, 'y');     // North apse vault ring
  ring(0, 9.5, 27, 'y');       // Organ loft apex ring
  ring(0, 4.5, -38, 'y');      // Altar canopy ring
  ring(-11, 8.5, 6, 'y');      // West triforium ring
  ring(11, 8.5, 6, 'y');       // East triforium ring
  ring(-18, 14.5, 24, 'y');    // Belfry chamber center ring

  // Sniper Vantage Perches
  sniper(-18, 12.5, 24);       // High Belfry window
  sniper(0, 6.0, 26);          // High Organ loft
  sniper(0, 1.6, -40);         // Raised high altar
  sniper(24, 8.2, 6);          // East flying buttress pinnacle

  // Tactical Spawns
  spawn(0, 0.5, 36);           // South Narthex (Player Start)
  spawn(0, -1.3, -23);         // Sunken Subterranean Crypt
  spawn(-18, 6.0, 24);         // Belfry Tower Intermediate Landing
  spawn(-18, 12.5, 24);        // Upper Bell Chamber
  spawn(-11, 6.0, 6);          // West Triforium Catwalk
  spawn(11, 6.0, 6);           // East Triforium Catwalk
  spawn(0, 1.6, -40);          // High Altar Platform
  spawn(20, 0.5, -6);          // East Cloister Garden

  // Pickups
  pickup(-18, 12.5, 24, 'special'); // Belfry Sniper Perch
  pickup(0, -1.3, -23, 'damage');   // Center Crypt Sarcophagus
  pickup(0, 6.0, 26, 'speed');      // Organ Loft console
  pickup(0, 1.6, -40, 'shield');    // High Altar
  pickup(0, 0.5, 20, 'health');     // South nave safe approach
  pickup(20, 0.5, -6, 'health');    // East cloister courtyard

  // =========================================================================
  // 8. LIVING KINETIC AMBIENT ACTORS (L.animated)
  // =========================================================================
  if (B.scene && B.scene.add && L.animated) {
    const bellGroup = new THREE.Group();
    bellGroup.position.set(-18, 14.5, 24);

    const bellGeom = new THREE.CylinderGeometry(0.6, 1.6, 2.2, 16);
    const bellMat = makeInkMaterial(GR, { wireframe: true });
    const bellMesh = new THREE.Mesh(bellGeom, bellMat);
    bellMesh.position.y = -1.1;
    bellGroup.add(bellMesh);

    const clapperMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 8, 8),
      makeInkMaterial(BK, { wireframe: true })
    );
    clapperMesh.position.y = -2.2;
    bellGroup.add(clapperMesh);

    B.scene.add(bellGroup);
    L.meshes.push(bellGroup);

    L.animated.push({
      mesh: bellGroup,
      update: (time) => {
        bellGroup.rotation.z = Math.sin(time * 1.5) * 0.35;
      }
    });
  }

  planes(4, 28, 22, { rStep: 8, hStep: 4, scale: 1.2, speed: 0.12 });

  return finish();
}
