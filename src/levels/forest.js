import * as THREE from 'three';
import { INK } from '../render.js';
import {
  buildAncientTree,
  buildPineTree,
  buildWillowTree,
  buildGiantMushroom,
  buildHollowLog,
  buildGrassClump,
  buildFernCluster,
  buildSuspensionBridge
} from '../prefabs.js';

/**
 * Map: THE COLOSSAL CANOPY (forest)
 * A colossal, multi-tiered primeval rainforest arena built entirely of
 * procedural biro ink geometry, gnarled ancient trees, climbable spiral trunk stairs,
 * hollow log tunnels, suspension rope bridges, and high-velocity canopy grapple swings.
 */
export function buildForest(B, arena = false) {
  const { L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = INK.ORANGE ?? 3, GR = INK.GREEN ?? 4, BK = INK.BLACK ?? 2, BL = INK.BLUE ?? 0, RD = INK.RED ?? 1;

  L.key = 'forest';
  const P = arena ? 68 : 55, PH = arena ? 30 : 18, T = 6;
  const D = P - 3;
  L.bounds = { minX: -P, maxX: P, minZ: -P, maxZ: P };

  // ==========================================================================
  // 1. FOUNDATION & PERIMETER TIMBER/PALISADE WALLS
  // ==========================================================================
  // Parquet soil & moss floor foundation
  box(0, -1.0, 0, 2 * P + T, 1.0, 2 * P + T, { ink: GR });
  
  // 4 Cardinal Palisade Walls
  box(0, 0, -P, 2 * P + T, PH, T, { ink: BK }); // North Granite Palisade
  box(0, 0, P, 2 * P + T, PH, T, { ink: BK });  // South Trailhead & Flume
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: BK }); // West Ancient Grove
  box(P, 0, 0, T, PH, 2 * P + T, { ink: BK });  // East Granite Crag

  // Peeled-log archway doorframes at the 4 cardinal exits
  const doorArch = (x, z, alongX) => {
    if (alongX) {
      cyl(x - 2.0, 0, z, 0.4, 4.0, { ink: OR, noCollide: true });
      cyl(x + 2.0, 0, z, 0.4, 4.0, { ink: OR, noCollide: true });
      cyl(x, 3.8, z, 0.4, 4.4, { axis: 'x', ink: OR, noCollide: true });
    } else {
      cyl(x, 0, z - 2.0, 0.4, 4.0, { ink: OR, noCollide: true });
      cyl(x, 0, z + 2.0, 0.4, 4.0, { ink: OR, noCollide: true });
      cyl(x, 3.8, z, 0.4, 4.4, { axis: 'z', ink: OR, noCollide: true });
    }
  };
  doorArch(-D, 0, false); doorArch(D, 0, false);
  doorArch(0, -D, true);  doorArch(0, D, true);

  if (!arena) {
    // Solo sky lid and unhookable upper boundary walls
    const NG = { noNav: true, noGrapple: true };
    collider(0, PH, -P, 2 * P + T, 40, T, NG); collider(0, PH, P, 2 * P + T, 40, T, NG);
    collider(-P, PH, 0, T, 40, 2 * P + T, NG); collider(P, PH, 0, T, 40, 2 * P + T, NG);
    collider(0, PH + 38, 0, 2 * P + 40, 8.0, 2 * P + 40, NG);
  }

  // ==========================================================================
  // 2. SPAWN COORDINATE MATRIX & TACTICAL OBJECTIVES
  // ==========================================================================
  // Solo Start at South Trailhead
  L.playerStart.set(0.0, 0.2, 44.0);

  // 8 Balanced Wave Spawners positioned in cover niches
  spawn(-38.0, 0.2, -38.0); // S1: Sector 1 Banyan Base
  spawn(-20.0, 6.7, -29.0); // S2: Sector 1 Canopy Deck
  spawn(38.0, 0.2, -38.0);  // S3: Sector 2 Conifer Ridge
  spawn(29.0, 8.7, -29.0);  // S4: Sector 2 Ranger Blind
  spawn(-38.0, 0.2, 38.0);  // S5: Sector 3 Hollow Log West
  spawn(-24.0, 0.2, 20.0);  // S6: Sector 3 Sunken Brook
  spawn(38.0, 0.2, 38.0);   // S7: Sector 4 Willow Base
  spawn(29.0, 7.2, 29.0);   // S8: Sector 4 Shelf Shroom

  // 4 Tactical Sniper Perches with dual access routes
  sniper(29.0, 8.8, -29.0);  // Ranger Eagle Blind (Overlooks Mid & Sector 3)
  sniper(-29.0, 6.8, -29.0); // Banyan High Bough (Overlooks North Stair)
  sniper(29.0, 7.3, 29.0);   // Willow Canopy Perch (Vine curtain concealed)
  sniper(0.0, 9.2, -48.0);   // North Waterfall Overlook (Dominates North-South axis)

  // Tactical Item Pickups
  pickup(0.0, 7.0, 0.0);     // Central Mega-Pickup at Grand Redwood Crossing
  pickup(-29.0, 6.7, -26.0); // Sector 1 Armor on Banyan platform
  pickup(29.0, 8.7, -26.0);  // Sector 2 Ammo Cache inside Ranger Blind
  pickup(-24.0, 0.2, 18.0);  // Sector 3 Health Core in Hollow Log Tunnel
  pickup(29.0, 0.4, 29.0);   // Sector 4 Druid Boon at base of Weeping Willow

  // ==========================================================================
  // 3. THE CENTRAL SECTOR: THE GRAND REDWOOD CROSSING & MID DECK
  // ==========================================================================
  // Colossal Titan Redwood Trunk extending from ground to upper canopy
  cyl(0, 0, 0, 2.8, 24.0, { seg: 16, ink: BK });

  // Elevated Mid Combat Terrace at Y = 6.5m (Cross-shaped 20x20m timber platform)
  const midY = 6.5;
  slab(-10, -10, 10, 10, midY, 0.45, { ink: OR });

  // Perimeter handrails around the center deck
  rail(-10, -10, 10, -10, midY, { ink: BK });
  rail(-10, 10, 10, 10, midY, { ink: BK });
  rail(-10, -10, -10, 10, midY, { ink: BK });
  rail(10, -10, 10, 10, midY, { ink: BK });

  // 4 Carved timber parapet cover bunkers on the center deck (waist-high 1.1m)
  box(-5.5, midY, 0, 1.4, 1.1, 3.4, { ink: GR, tag: 'cover' });
  box(5.5, midY, 0, 1.4, 1.1, 3.4, { ink: GR, tag: 'cover' });
  box(0, midY, -5.5, 3.4, 1.1, 1.4, { ink: GR, tag: 'cover' });
  box(0, midY, 5.5, 3.4, 1.1, 1.4, { ink: GR, tag: 'cover' });

  // Dual Grand Stairways connecting ground to center deck
  const stepRise = 0.2857, stepRun = 0.45;
  const numSteps = Math.round(midY / stepRise); // ~23 steps
  stairs(0, 0, -10 - numSteps * stepRun, '+z', numSteps, 3.2, { rise: midY / numSteps, run: stepRun, ink: OR });
  stairs(0, 0, 10 + numSteps * stepRun, '-z', numSteps, 3.2, { rise: midY / numSteps, run: stepRun, ink: OR });

  // ==========================================================================
  // 4. SECTOR 1 (NW): THE GREAT BANYAN BASTION & SPIRAL ASCENT
  // ==========================================================================
  // Colossal Ancient Banyan with buttress roots, climbable spiral steps, and canopy deck
  buildAncientTree(B, -29.0, 0, -29.0, {
    r: 2.0,
    h: 15.0,
    inkBark: BK,
    inkLeaves: GR
  });

  // Intermediate root buttress cover slabs around the banyan base
  box(-35.0, 0, -29.0, 1.2, 1.1, 3.0, { ink: BK, tag: 'cover' });
  box(-29.0, 0, -35.0, 3.0, 1.1, 1.2, { ink: BK, tag: 'cover' });

  // ==========================================================================
  // 5. SECTOR 2 (NE): THE ALPINE CONIFER RIDGE & RANGER BLIND
  // ==========================================================================
  // Elevated Granite Ridge base
  slab(20, -38, 38, -20, 3.5, 0.4, { ink: BK });
  const numSteps2 = Math.round(3.5 / stepRise);
  stairs(20 - numSteps2 * stepRun, 0, -29, '+x', numSteps2, 2.8, { rise: 3.5 / numSteps2, run: stepRun, ink: OR });

  // Conifer Trio (Pine spires providing vertical snipers and natural cover)
  buildPineTree(B, 25.0, 3.5, -25.0, { h: 14.0, inkBark: BK, inkLeaves: GR });
  buildPineTree(B, 33.0, 3.5, -25.0, { h: 16.0, inkBark: BK, inkLeaves: GR });
  buildPineTree(B, 29.0, 3.5, -33.0, { h: 18.0, inkBark: BK, inkLeaves: GR });

  // Ranger Lookout Blind elevated deck at Y = 8.5m
  box(29.0, 8.5, -29.0, 4.5, 0.4, 4.5, { ink: OR });
  rail(26.75, -31.25, 31.25, -31.25, 8.5, { ink: BK });
  rail(26.75, -26.75, 31.25, -26.75, 8.5, { ink: BK });

  // ==========================================================================
  // 6. SECTOR 3 (SW): SUNKEN BROOK & HOLLOW LOG LABYRINTH
  // ==========================================================================
  // Dual Hollow Log sprint-through tunnels (10-12m long defilade in open brook)
  buildHollowLog(B, -12.0, 0, 22.0, 12, { ink: BK });
  buildHollowLog(B, -28.0, 0, 12.0, 10, { ink: BK });

  // Giant Umbrella Mushroom tactical bounce platforms
  buildGiantMushroom(B, -12.0, 0, 34.0, { inkCap: RD, h: 4.8 });
  buildGiantMushroom(B, -34.0, 0, 10.0, { inkCap: RD, h: 3.6 });

  // Flank platform connecting to western logging flume
  slab(-38, 20, -20, 38, 3.2, 0.4, { ink: GR });
  const numSteps3 = Math.round(3.2 / stepRise);
  stairs(-20 + numSteps3 * stepRun, 0, 29, '-x', numSteps3, 2.8, { rise: 3.2 / numSteps3, run: stepRun, ink: OR });

  // ==========================================================================
  // 7. SECTOR 4 (SE): WEEPING WILLOW BOWER & SHROOM GLADE
  // ==========================================================================
  // Majestic Weeping Willow with trailing vine curtains breaking sightlines
  buildWillowTree(B, 29.0, 0, 29.0, {
    inkBark: BK,
    inkLeaves: GR
  });

  // Natural fern clusters and granite boulders
  buildFernCluster(B, 24.0, 0, 24.0, { ink: GR });
  buildFernCluster(B, 34.0, 0, 34.0, { ink: GR });
  box(29.0, 0, 35.0, 2.4, 1.1, 1.4, { ink: BK, tag: 'cover' });

  // Southeast anchor platform
  slab(20, 20, 38, 38, 3.2, 0.4, { ink: GR });
  const numSteps4 = Math.round(3.2 / stepRise);
  stairs(20 - numSteps4 * stepRun, 0, 29, '+x', numSteps4, 2.8, { rise: 3.2 / numSteps4, run: stepRun, ink: OR });

  // ==========================================================================
  // 8. SUSPENSION SKY-BRIDGES CONNECTING CANOPY DECK TO SECTORS
  // ==========================================================================
  // 4 Rope suspension walkways radiating from Mid to the 4 sectors at Y = 6.5m
  buildSuspensionBridge(B, -10.0, -10.0, -22.0, -22.0, midY, { inkWood: OR, inkRope: BK }); // To Sector 1
  buildSuspensionBridge(B, 10.0, -10.0, 22.0, -22.0, midY, { inkWood: OR, inkRope: BK });   // To Sector 2
  buildSuspensionBridge(B, -10.0, 10.0, -22.0, 22.0, midY, { inkWood: OR, inkRope: BK });   // To Sector 3
  buildSuspensionBridge(B, 10.0, 10.0, 22.0, 22.0, midY, { inkWood: OR, inkRope: BK });    // To Sector 4

  // ==========================================================================
  // 9. PROCEDURAL GROUND UNDERSTORY FLORA (CARPET OF REEDS & FERNS)
  // ==========================================================================
  const grassLocs = [
    [-15, -15], [15, -15], [-15, 15], [15, 15],
    [-30, 0], [30, 0], [0, -30], [0, 30],
    [-10, 30], [10, -30], [-30, 10], [30, -10]
  ];
  for (const [gx, gz] of grassLocs) {
    buildGrassClump(B, gx, 0, gz, 6, { ink: GR });
  }

  // ==========================================================================
  // 10. OVERHEAD 12-RING GRAPPLE SWING HIGHWAY & KINETIC PLANES
  // ==========================================================================
  // Master Central Apex Ring for colossal pendulum swings (above tree apex)
  ring(0, 25.5, 0, 'y');

  // 4 Suspension Bridge Midpoint Rings
  ring(-16.0, 10.5, -16.0, 'y');
  ring(16.0, 10.5, -16.0, 'y');
  ring(-16.0, 10.5, 16.0, 'y');
  ring(16.0, 10.5, 16.0, 'y');

  // 4 Sector Crown Grapple Rings
  ring(-29.0, 13.5, -23.5, 'z'); // Banyan Crown outer branch
  ring(29.0, 15.0, -29.0, 'y');  // Pine Ridge Apex
  ring(-29.0, 10.0, 29.0, 'z');  // Log Flume High Hook
  ring(29.0, 12.0, 29.0, 'y');   // Willow Crown

  // 3 Low Understory Flank Rings for high-speed evasion
  ring(-20.0, 5.0, 0, 'x');
  ring(20.0, 5.0, 0, 'x');
  ring(0, 5.0, -20.0, 'z');

  // Kinetic circling paper leaf gliders in upper canopy thermal
  planes(4, 38, 22, { ink: GR, speed: 0.08, scale: 0.9 });

  // Ground collision floor
  collider(0, -2, 0, 2 * P + 20, 2, 2 * P + 20);

  B.finish();
  return L;
}
