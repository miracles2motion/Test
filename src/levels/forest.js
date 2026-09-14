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
  buildSuspensionBridge,
  buildCampfire,
  buildWoodStack,
  buildTrailSign,
  buildChoppingBlock,
  buildLoggingCart,
  buildHollowStump,
  buildToadstoolCluster,
  buildSurveyTable
} from '../prefabs.js';

/**
 * Map: THE COLOSSAL CANOPY (forest)
 * A colossal, multi-tiered primeval rainforest arena built entirely of
 * procedural biro ink geometry, gnarled ancient trees, climbable spiral trunk stairs,
 * hollow log tunnels, suspension rope bridges, and high-velocity canopy grapple swings.
 * Richly densified with small tactical structures: ranger campfires, cordwood stacks,
 * woodcutter chopping blocks, logging carts, trail signposts, toadstool clusters,
 * stone cairns, and river boulders.
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
  pickup(0.0, 0.2, 40.0);    // Trailhead starter health pickup

  // ==========================================================================
  // 3. SOUTH TRAILHEAD: RANGER WAYPOINT & OUTPOST ENCOUNTER
  // ==========================================================================
  buildTrailSign(B, 3.5, 0, 42.0); // Directional fingerboard
  buildCampfire(B, -6.0, 0, 42.0);  // Stone hearth with charred logs & warm light
  buildChoppingBlock(B, -8.5, 0, 43.0); // Tree round with embedded woodcutter's axe
  buildWoodStack(B, -8.0, 0, 39.0, 2.6, 1.1, 1.2); // Trailhead cordwood cover
  buildToadstoolCluster(B, 4.5, 0, 44.0, 3); // Fly agaric toadstools
  sphere(-2.5, 0.35, 36.0, 0.65, { ink: BK, tag: 'cover' }); // Mossy trail boulder

  // ==========================================================================
  // 4. THE CENTRAL SECTOR: THE GRAND REDWOOD CROSSING & MID DECK
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

  // Mid Deck Tactical Furniture & Field Headquarters
  buildSurveyTable(B, 0, midY, -4.5); // Survey table with rolled maps, telescope, lantern
  buildWoodStack(B, -5.5, midY, 0, 1.4, 1.1, 3.2); // Cedar timber stack cover
  buildWoodStack(B, 5.5, midY, 0, 1.4, 1.1, 3.2);  // Cedar timber stack cover
  box(0, midY, 5.5, 3.4, 1.1, 1.4, { ink: GR, tag: 'cover' }); // South timber parapet

  // 4 Corner Timber Barrels with iron bands on Mid Deck
  const midBarrels = [[-7.5, -7.5], [7.5, -7.5], [-7.5, 7.5], [7.5, 7.5]];
  for (const [bx, bz] of midBarrels) {
    cyl(bx, midY, bz, 0.55, 1.2, { ink: OR, tag: 'cover' });
    cyl(bx, midY + 0.3, bz, 0.57, 0.08, { ink: BK, noCollide: true });
    cyl(bx, midY + 0.9, bz, 0.57, 0.08, { ink: BK, noCollide: true });
  }

  // Supply Crates on Mid Deck corners
  box(6.0, midY, -6.0, 1.2, 0.9, 1.2, { ink: OR, tag: 'cover' });
  box(-6.0, midY, 6.0, 1.2, 0.9, 1.2, { ink: OR, tag: 'cover' });

  // Stepped bracket fungus steps spiraling up the titan redwood trunk (parkour route)
  slab(2.8, -1.2, 4.6, 1.2, 2.0, 0.25, { ink: OR });
  slab(-1.2, 2.8, 1.2, 4.6, 3.5, 0.25, { ink: OR });
  slab(-4.6, -1.2, -2.8, 1.2, 5.0, 0.25, { ink: OR });

  // Dual Grand Stairways connecting ground to center deck
  stairs(0, 0, -20.35, '+z', 23, 3.2, { rise: 0.2826, run: 0.45, ink: OR });
  stairs(0, 0, 20.35, '-z', 23, 3.2, { rise: 0.2826, run: 0.45, ink: OR });

  // ==========================================================================
  // 5. SECTOR 1 (NW): THE GREAT BANYAN BASTION & DRUID STONE CIRCLE
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

  // Micro-Props: Hollow stump bunker, stone cairns & druid campfire
  buildHollowStump(B, -20.0, 0, -35.0, 1.3, 1.2);
  buildCampfire(B, -24.0, 0, -22.0); // Druid stone hearth
  buildTrailSign(B, -15.0, 0, -18.0);
  buildToadstoolCluster(B, -27.0, 0, -27.0, 3);
  
  // Stone Cairns (stacked river megaliths)
  sphere(-20.0, 0.35, -20.0, 0.55, { ink: BK, tag: 'cover' });
  sphere(-20.0, 0.85, -20.0, 0.4, { ink: BK, tag: 'cover' });
  sphere(-36.0, 0.35, -20.0, 0.55, { ink: BK, tag: 'cover' });
  sphere(-36.0, 0.85, -20.0, 0.4, { ink: BK, tag: 'cover' });

  // Decaying mossy log cover
  box(-34.0, 0, -34.0, 1.2, 0.9, 4.5, { ink: BK, tag: 'cover' });

  // ==========================================================================
  // 6. SECTOR 2 (NE): THE ALPINE CONIFER RIDGE & LUMBER OUTPOST
  // ==========================================================================
  // Elevated Granite Ridge base
  slab(20, -38, 38, -20, 3.5, 0.4, { ink: BK });
  stairs(14.6, 0, -29, '+x', 12, 2.8, { rise: 0.2917, run: 0.45, ink: OR });

  // Conifer Trio (Pine spires providing vertical snipers and natural cover)
  buildPineTree(B, 25.0, 3.5, -25.0, { h: 14.0, inkBark: BK, inkLeaves: GR });
  buildPineTree(B, 33.0, 3.5, -25.0, { h: 16.0, inkBark: BK, inkLeaves: GR });
  buildPineTree(B, 29.0, 3.5, -33.0, { h: 18.0, inkBark: BK, inkLeaves: GR });

  // Ranger Lookout Blind elevated deck at Y = 8.5m
  box(29.0, 8.5, -29.0, 4.5, 0.4, 4.5, { ink: OR });
  rail(26.75, -31.25, 31.25, -31.25, 8.5, { ink: BK });
  rail(26.75, -26.75, 31.25, -26.75, 8.5, { ink: BK });
  // Ranger blind gear: supply crate & lantern
  box(29.0, 8.5, -27.5, 1.2, 0.9, 1.2, { ink: OR, tag: 'cover' });
  cyl(30.2, 8.5, -27.5, 0.15, 0.45, { ink: BK, noCollide: true });

  // Ridge toadstools & mossy boulder
  buildToadstoolCluster(B, 23.5, 3.5, -23.5, 3);
  buildToadstoolCluster(B, 34.0, 3.5, -26.0, 3);
  sphere(22.0, 3.85, -34.0, 0.75, { ink: BK, tag: 'cover' });

  // Ground lumber outpost props at foot of ridge
  buildLoggingCart(B, 14.0, 0, -22.0); // Two-wheeled logging cart
  buildWoodStack(B, 14.0, 0, -35.0, 2.8, 1.1, 1.2); // Cordwood stack
  buildHollowStump(B, 22.0, 0, -14.0, 1.3, 1.2);
  buildTrailSign(B, 18.0, 0, -18.0);

  // ==========================================================================
  // 7. SECTOR 3 (SW): SUNKEN BROOK & HOLLOW LOG LABYRINTH
  // ==========================================================================
  // Dual Hollow Log sprint-through tunnels (10-12m long defilade in open brook)
  buildHollowLog(B, -12.0, 0, 22.0, 12, { ink: BK });
  buildHollowLog(B, -28.0, 0, 12.0, 10, { ink: BK });

  // Giant Umbrella Mushroom tactical bounce platforms
  buildGiantMushroom(B, -12.0, 0, 34.0, { inkCap: RD, h: 4.8 });
  buildGiantMushroom(B, -34.0, 0, 10.0, { inkCap: RD, h: 3.6 });

  // Flank platform connecting to western logging flume
  slab(-38, 20, -20, 38, 3.2, 0.4, { ink: GR });
  stairs(-15.05, 0, 29, '-x', 11, 2.8, { rise: 0.2909, run: 0.45, ink: OR });

  // Micro-Props: Hollow stump, cordwood cover, chopping block & stream boulders
  buildHollowStump(B, -34.0, 0, 24.0, 1.4, 1.2);
  buildWoodStack(B, -15.0, 0, 32.0, 2.4, 1.1, 1.2);
  buildChoppingBlock(B, -26.0, 0, 34.0);
  buildTrailSign(B, -16.0, 0, 14.0);
  buildToadstoolCluster(B, -11.0, 0, 36.0, 3);
  
  // Sunken stream river boulders
  sphere(-16.0, 0.45, 16.0, 0.75, { ink: BK, tag: 'cover' });
  sphere(-20.0, 0.4, 28.0, 0.65, { ink: BK, tag: 'cover' });

  // Rustic footbridge over the brook depression
  box(-20.0, 0.25, 14.0, 3.8, 0.2, 1.6, { ink: OR, tag: 'cover' });
  rail(-21.9, 13.2, -18.1, 13.2, 0.45, { ink: BK });
  rail(-21.9, 14.8, -18.1, 14.8, 0.45, { ink: BK });

  // ==========================================================================
  // 8. SECTOR 4 (SE): WEEPING WILLOW BOWER & SHROOM GLADE
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

  // Micro-Props: Logging cart, cordwood stack, hollow stump & boulders
  buildLoggingCart(B, 18.0, 0, 35.0);
  buildWoodStack(B, 34.0, 0, 20.0, 2.6, 1.1, 1.2);
  buildHollowStump(B, 22.0, 0, 18.0, 1.3, 1.2);
  buildToadstoolCluster(B, 30.0, 0, 27.5, 3);
  sphere(16.0, 0.45, 24.0, 0.75, { ink: BK, tag: 'cover' });
  sphere(35.0, 0.4, 38.0, 0.65, { ink: BK, tag: 'cover' });

  // Southeast anchor platform
  slab(20, 20, 38, 38, 3.2, 0.4, { ink: GR });
  stairs(15.05, 0, 29, '+x', 11, 2.8, { rise: 0.2909, run: 0.45, ink: OR });

  // ==========================================================================
  // 9. NORTH TRAILHEAD & WATERFALL APPROACH
  // ==========================================================================
  buildTrailSign(B, 3.0, 0, -42.0);
  buildWoodStack(B, -6.0, 0, -40.0, 2.8, 1.1, 1.2);
  buildHollowStump(B, 6.0, 0, -38.0, 1.3, 1.2);
  buildToadstoolCluster(B, -4.0, 0, -44.0, 3);
  sphere(0, 0.45, -34.0, 0.75, { ink: BK, tag: 'cover' });

  // ==========================================================================
  // 10. SUSPENSION SKY-BRIDGES CONNECTING CANOPY DECK TO SECTORS
  // ==========================================================================
  // 4 Rope suspension walkways radiating from Mid to the 4 sectors at Y = 6.5m
  buildSuspensionBridge(B, -10.0, -10.0, -22.0, -22.0, midY, { inkWood: OR, inkRope: BK }); // To Sector 1
  buildSuspensionBridge(B, 10.0, -10.0, 22.0, -22.0, midY, { inkWood: OR, inkRope: BK });   // To Sector 2
  buildSuspensionBridge(B, -10.0, 10.0, -22.0, 22.0, midY, { inkWood: OR, inkRope: BK });   // To Sector 3
  buildSuspensionBridge(B, 10.0, 10.0, 22.0, 22.0, midY, { inkWood: OR, inkRope: BK });    // To Sector 4

  // ==========================================================================
  // 11. PROCEDURAL GROUND UNDERSTORY FLORA (CARPET OF REEDS & FERNS)
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
  // 12. OVERHEAD 12-RING GRAPPLE SWING HIGHWAY & KINETIC PLANES
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

  
  

  
  
  
  // === DREAM AUTO-INJECTED MACRO STRUCTURES ===

  // === MACRO STRUCTURE: Ancient Oak Canopy at (-43, 0, -7) ===
  cyl(-43, 0, -7, 2.2, 7.0, { seg: 10, ink: BK });
  box(-43 - 2.8, 0, -7, 1.2, 2.0, 1.2, { ink: BK });
  box(-43 + 2.8, 0, -7, 1.2, 2.0, 1.2, { ink: BK });
  slab(-43 - 3.8, -7 - 3.8, -43 + 3.8, -7 + 3.8, 0 + 4.5, 0.4, { ink: GR });
  rail(-43 - 3.8, -7 - 3.8, -43 + 3.8, -7 - 3.8, 0 + 4.5, { ink: BK });
  rail(-43 - 3.8, -7 + 3.8, -43 + 3.8, -7 + 3.8, 0 + 4.5, { ink: BK });
  box(-43, 0 + 6.8, -7, 6.0, 2.0, 6.0, { noCollide: true, ink: GR });
  ring(-43, 0 + 9.2, -7, 'z');
  pickup(-43, 0 + 4.7, -7 + 2.0);

  // === MACRO STRUCTURE: Stonehenge Hollow Altar at (-43, 0, 41) ===
  box(-43 - 2.8, 0, 41, 1.2, 4.5, 1.2, { ink: BK });
  box(-43 + 2.8, 0, 41, 1.2, 4.5, 1.2, { ink: BK });
  slab(-43 - 3.5, 41 - 1.5, -43 + 3.5, 41 + 1.5, 0 + 4.5, 0.6, { ink: BK });
  cyl(-43, 0, 41, 1.6, 1.4, { seg: 8, ink: GR });
  slab(-43 - 2.0, 41 - 2.0, -43 + 2.0, 41 + 2.0, 0 + 1.4, 0.3, { ink: OR });
  ring(-43, 0 + 7.8, 41, 'z');
  pickup(-43, 0 + 1.6, 41);

  // === MACRO STRUCTURE: Ancient Oak Canopy at (-23.843001976331607, 0, -43.401118070459) ===
  cyl(-23.843001976331607, 0, -43.401118070459, 2.2, 7.0, { seg: 10, ink: BK });
  box(-23.843001976331607 - 2.8, 0, -43.401118070459, 1.2, 2.0, 1.2, { ink: BK });
  box(-23.843001976331607 + 2.8, 0, -43.401118070459, 1.2, 2.0, 1.2, { ink: BK });
  slab(-23.843001976331607 - 3.8, -43.401118070459 - 3.8, -23.843001976331607 + 3.8, -43.401118070459 + 3.8, 0 + 4.5, 0.4, { ink: GR });
  rail(-23.843001976331607 - 3.8, -43.401118070459 - 3.8, -23.843001976331607 + 3.8, -43.401118070459 - 3.8, 0 + 4.5, { ink: BK });
  rail(-23.843001976331607 - 3.8, -43.401118070459 + 3.8, -23.843001976331607 + 3.8, -43.401118070459 + 3.8, 0 + 4.5, { ink: BK });
  box(-23.843001976331607, 0 + 6.8, -43.401118070459, 6.0, 2.0, 6.0, { noCollide: true, ink: GR });
  ring(-23.843001976331607, 0 + 9.2, -43.401118070459, 'z');
  pickup(-23.843001976331607, 0 + 4.7, -43.401118070459 + 2.0);

  // === MACRO STRUCTURE: Stonehenge Hollow Altar at (-25, 0, -19) ===
  box(-25 - 2.8, 0, -19, 1.2, 4.5, 1.2, { ink: BK });
  box(-25 + 2.8, 0, -19, 1.2, 4.5, 1.2, { ink: BK });
  slab(-25 - 3.5, -19 - 1.5, -25 + 3.5, -19 + 1.5, 0 + 4.5, 0.6, { ink: BK });
  cyl(-25, 0, -19, 1.6, 1.4, { seg: 8, ink: GR });
  slab(-25 - 2.0, -19 - 2.0, -25 + 2.0, -19 + 2.0, 0 + 1.4, 0.3, { ink: OR });
  ring(-25, 0 + 7.8, -19, 'z');
  pickup(-25, 0 + 1.6, -19);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Prefab: Cordwood Fuel Stack (Waist-High Tactical Cover)
  buildWoodStack(B, -47.0, 0, -31.0);

  // Prefab: Canopy Survey Table & Field Instruments
  buildSurveyTable(B, -47.0, 0, 1.0);

  // Prefab: Run-Through Hollow Log Tunnel
  buildHollowLog(B, -47.0, 0, 17.0, 10);

  // Prefab: Weathered Trail Signpost
  buildTrailSign(B, -31.0, 0, -47.0);

  // Prefab: Weathered Trail Signpost
  buildTrailSign(B, -15.0, 0, -15.0);

  // Prefab: Hollow Tree Stump Ambush Bunker
  buildHollowStump(B, 17.0, 0, -15.0);

  // Prefab: Fly Agaric Toadstool Cluster
  buildToadstoolCluster(B, 33.0, 0, -31.0, 3);
  // === END DREAM AUTO-INJECTED PROPS ===
  B.finish();
  return L;
}
