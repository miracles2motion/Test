import * as THREE from 'three';
import { INK } from '../render.js';
import {
  buildTreehouse,
  buildGiantGrass,
  buildPineTree,
  buildAncientTree,
  generateParametricTree,
  buildCurvedHollowLog,
  buildBoulderField,
  buildToadstoolCluster,
  buildHollowLog,
  buildHollowStump,
  buildWoodStack,
  buildCampfire,
  buildTrailSign,
  buildLoggingCart,
  buildSurveyTable
} from '../prefabs.js';

/**
 * THE COLOSSAL CANOPY (Forest)
 * A monumental, organic, hand-drawn 3D woodland sanctuary.
 * Features a 26m Titan Redwood Treehouse with spiral trunk stairs, 
 * high-altitude timber canopy bridges, curved hollow sprint logs,
 * giant stalk grasses with momentum grapple rings, mountain streams, and boulder defilade.
 */
export function buildForest(B, arena = false) {
  const { L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = INK.ORANGE ?? 3, GR = INK.GREEN ?? 4, BK = INK.BLACK ?? 2, BL = INK.BLUE ?? 0, RD = INK.RED ?? 1;

  L.key = 'forest';
  const P = arena ? 68 : 55, PH = arena ? 30 : 20, T = 6;
  const D = P - 3;
  L.bounds = { minX: -P, maxX: P, minZ: -P, maxZ: P };

  // ==================== 1. FOREST BED & PERIMETER BOUNDS ====================
  // Deep mossy forest ground floor (rich green & earth)
  box(0, -1.0, 0, 2 * P + T, 1.0, 2 * P + T, { ink: GR });

  // Perimeter Ancient Redwood Trunk Palisades (replaces sterile flat walls with vertical log palisades)
  box(0, 0, -P, 2 * P + T, PH, T, { ink: BK });
  box(0, 0, P, 2 * P + T, PH, T, { ink: BK });
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: BK });
  box(P, 0, 0, T, PH, 2 * P + T, { ink: BK });

  // Overhanging perimeter foliage canopy eaves (Trim)
  box(0, PH, -P, 2 * P + T + 2.0, 1.2, T + 2.0, { noCollide: true, ink: GR });
  box(0, PH, P, 2 * P + T + 2.0, 1.2, T + 2.0, { noCollide: true, ink: GR });
  box(-P, PH, 0, T + 2.0, 1.2, 2 * P + T + 2.0, { noCollide: true, ink: GR });
  box(P, PH, 0, T + 2.0, 1.2, 2 * P + T + 2.0, { noCollide: true, ink: GR });

  // Rustic Timber Arch Gateways
  const doorFrame = (x, z, alongX) => {
    if (alongX) {
      box(x - 1.6, 0, z, 0.6, 3.8, 0.8, { noCollide: true, ink: OR });
      box(x + 1.6, 0, z, 0.6, 3.8, 0.8, { noCollide: true, ink: OR });
      box(x, 3.6, z, 3.8, 0.6, 0.8, { noCollide: true, ink: OR });
    } else {
      box(x, 0, z - 1.6, 0.8, 3.8, 0.6, { noCollide: true, ink: OR });
      box(x, 0, z + 1.6, 0.8, 3.8, 0.6, { noCollide: true, ink: OR });
      box(x, 3.6, z, 0.8, 0.6, 3.8, { noCollide: true, ink: OR });
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

  // ==================== 2. MOUNTAIN STREAM BED (EAST FLANK) ====================
  // Winding clear blue mountain stream carving through the east glade
  slab(16.0, -45.0, 26.0, 45.0, 0.05, 0.05, { ink: BL });
  // Stepping stones across the stream
  slab(18.0, -2.0, 24.0, 2.0, 0.35, 0.35, { ink: BK });
  // Rustic timber arched footbridge spanning the river at Z = -15
  slab(15.0, -18.0, 27.0, -14.0, 0.8, 0.3, { ink: OR });
  rail(15.0, -18.0, 27.0, -18.0, 0.8, { ink: BK });
  rail(15.0, -14.0, 27.0, -14.0, 0.8, { ink: BK });

  // ==================== 3. HERO CENTERPIECE: COLOSSAL TITAN TREEHOUSE ====================
  // 26m Monumental Redwood with 20 spiral stairs, 10m timber deck at Y=9.5m, constructed cabin & 5-point grapple network
  buildTreehouse(B, 0, 0, 0, {
    trunkR: 3.2,
    height: 28.0,
    deckY: 9.5,
    inkBark: BK,
    inkWood: OR,
    inkLeaves: GR
  });

  // ==================== 4. HIGH-ALTITUDE CANOPY SKY-BRIDGES (Y = 9.5m) ====================
  // Timber catwalks radiating from the central Treehouse deck to outer tree bastions
  // North Skybridge: Center (0, 9.5, -5) -> North Bastion (0, 9.5, -26)
  slab(-1.5, -26.0, 1.5, -5.0, 9.5, 0.35, { ink: OR });
  rail(-1.5, -26.0, -1.5, -5.0, 9.5, { ink: BK });
  rail(1.5, -26.0, 1.5, -5.0, 9.5, { ink: BK });

  // South Skybridge: Center (0, 9.5, 5) -> South Outpost (0, 9.5, 26)
  slab(-1.5, 5.0, 1.5, 26.0, 9.5, 0.35, { ink: OR });
  rail(-1.5, 5.0, -1.5, 26.0, 9.5, { ink: BK });
  rail(1.5, 5.0, 1.5, 26.0, 9.5, { ink: BK });

  // West Skybridge: Center (-5, 9.5, 0) -> West Tree Perch (-24, 9.5, 0)
  slab(-24.0, -1.5, -5.0, 1.5, 9.5, 0.35, { ink: OR });
  rail(-24.0, -1.5, -5.0, -1.5, 9.5, { ink: BK });
  rail(-24.0, 1.5, -5.0, 1.5, 9.5, { ink: BK });

  // East Skybridge: Center (5, 9.5, 0) -> East Watchtower (24, 9.5, 0)
  slab(5.0, -1.5, 24.0, 1.5, 9.5, 0.35, { ink: OR });
  rail(5.0, -1.5, 24.0, -1.5, 9.5, { ink: BK });
  rail(5.0, 1.5, 24.0, 1.5, 9.5, { ink: BK });

  // Skybridge Overlook Platforms & Dual Stair Access to Ground
  // North Bastion Deck
  slab(-6.0, -32.0, 6.0, -26.0, 9.5, 0.4, { ink: OR });
  rail(-6.0, -32.0, 6.0, -32.0, 9.5, { ink: BK });
  rail(-6.0, -32.0, -6.0, -26.0, 9.5, { ink: BK });
  rail(6.0, -32.0, 6.0, -26.0, 9.5, { ink: BK });
  stairs(0, 0, -32.5, '-z', 18, 3.0, { rise: 0.28, run: 0.48, ink: OR });

  // South Outpost Deck
  slab(-6.0, 26.0, 6.0, 32.0, 9.5, 0.4, { ink: OR });
  rail(-6.0, 32.0, 6.0, 32.0, 9.5, { ink: BK });
  rail(-6.0, 26.0, -6.0, 32.0, 9.5, { ink: BK });
  rail(6.0, 26.0, 6.0, 32.0, 9.5, { ink: BK });
  stairs(0, 0, 32.5, '+z', 18, 3.0, { rise: 0.28, run: 0.48, ink: OR });

  // West Flank Tree Deck & Stairs
  slab(-30.0, -6.0, -24.0, 6.0, 9.5, 0.4, { ink: OR });
  rail(-30.0, -6.0, -30.0, 6.0, 9.5, { ink: BK });
  rail(-30.0, -6.0, -24.0, -6.0, 9.5, { ink: BK });
  rail(-30.0, 6.0, -24.0, 6.0, 9.5, { ink: BK });
  stairs(-30.5, 0, 0, '-x', 18, 3.0, { rise: 0.28, run: 0.48, ink: OR });

  // East Glade River Overlook Deck & Stairs
  slab(24.0, -6.0, 30.0, 6.0, 9.5, 0.4, { ink: OR });
  rail(30.0, -6.0, 30.0, 6.0, 9.5, { ink: BK });
  rail(24.0, -6.0, 30.0, -6.0, 9.5, { ink: BK });
  rail(24.0, 6.0, 30.0, 6.0, 9.5, { ink: BK });
  stairs(30.5, 0, 0, '+x', 18, 3.0, { rise: 0.28, run: 0.48, ink: OR });

  // ==================== 5. ANCIENT REDWOODS & PARAMETRIC TREES ====================
  // NW Titan Tree with spiral buttress roots
  generateParametricTree(B, -34.0, 0, -32.0, {
    archetype: 'titan',
    height: 28.0,
    trunkR: 2.8,
    seed: 201,
    inkBark: BK,
    inkLeaves: GR,
    inkCover: OR
  });

  // NE Ancient Pine Grove
  buildPineTree(B, 34.0, 0, -32.0, { h: 22.0, inkBark: BK, inkLeaves: GR });
  buildPineTree(B, 40.0, 0, -24.0, { h: 18.0, inkBark: BK, inkLeaves: GR });

  // SW Gnarled Redwood with hollow niche
  generateParametricTree(B, -34.0, 0, 32.0, {
    archetype: 'gnarled',
    height: 22.0,
    trunkR: 2.6,
    seed: 305,
    inkBark: BK,
    inkLeaves: GR,
    inkCover: OR
  });

  // SE Ancient Banyan Spire
  buildAncientTree(B, 34.0, 0, 32.0, { r: 2.2, h: 20.0, inkBark: BK, inkLeaves: GR });

  // Flanking perimeter pines (offset from cardinal stair corridors)
  buildPineTree(B, -44.0, 0, -18.0, { h: 24.0, inkBark: BK, inkLeaves: GR });
  buildPineTree(B, 44.0, 0, 18.0, { h: 24.0, inkBark: BK, inkLeaves: GR });
  buildPineTree(B, -18.0, 0, -44.0, { h: 24.0, inkBark: BK, inkLeaves: GR });
  buildPineTree(B, 18.0, 0, 44.0, { h: 24.0, inkBark: BK, inkLeaves: GR });

  // ==================== 6. CURVED HOLLOW LOG SPRINT TUNNEL (WEST LANE) ====================
  // Multi-segment sprint tube with 2.2m clear interior corridor & shelf-fungus steps
  buildCurvedHollowLog(B, -20.0, 0, -18.0, {
    segments: 3,
    segLen: 8.0,
    rInner: 1.6,
    rOuter: 2.1,
    initialAngle: Math.PI * 0.45,
    seed: 777,
    inkBark: BK,
    inkFoliage: GR,
    inkCover: OR
  });

  // Second straight hollow log on South Flank
  buildHollowLog(B, -15.0, 0, 22.0, 12.0);

  // ==================== 7. GIANT STALK GRASSES WITH MOMENTUM GRAPPLE RINGS ====================
  // Massive blades giving waist defilade crowned with aerial momentum grapple rings
  buildGiantGrass(B, -12.0, 0, -16.0, { height: 7.2, ink: GR, inkStem: BK });
  buildGiantGrass(B, 12.0, 0, -16.0, { height: 7.0, ink: GR, inkStem: BK });
  buildGiantGrass(B, -12.0, 0, 16.0, { height: 7.5, ink: GR, inkStem: BK });
  buildGiantGrass(B, 12.0, 0, 16.0, { height: 7.2, ink: GR, inkStem: BK });
  buildGiantGrass(B, -28.0, 0, 12.0, { height: 6.8, ink: GR, inkStem: BK });
  buildGiantGrass(B, 28.0, 0, -12.0, { height: 6.8, ink: GR, inkStem: BK });
  buildGiantGrass(B, 0.0, 0, -22.0, { height: 8.0, ink: GR, inkStem: BK });
  buildGiantGrass(B, 0.0, 0, 22.0, { height: 8.0, ink: GR, inkStem: BK });

  // ==================== 8. GRANITE BOULDER FIELDS & ROCK COVER ====================
  // Natural sketched granite cover rocks along riverbank and glades
  buildBoulderField(B, 24.0, 0, -2.0, { count: 6, radius: 7.0, seed: 88, ink: BK });
  buildBoulderField(B, -24.0, 0, 20.0, { count: 5, radius: 6.0, seed: 142, ink: BK });

  // ==================== 9. WOODLAND TACTICAL SET DRESSING ====================
  // Fly Agaric spotted toadstools (waist cover clusters)
  buildToadstoolCluster(B, -16.0, 0, -8.0, 4);
  buildToadstoolCluster(B, 16.0, 0, 8.0, 4);
  buildToadstoolCluster(B, -8.0, 0, 24.0, 3);

  // Natural ambush bunker stump
  buildHollowStump(B, -8.0, 0, -24.0);
  buildHollowStump(B, 8.0, 0, 24.0);

  // Cordwood fuel stacks (waist cover)
  buildWoodStack(B, -22.0, 0, -4.0);
  buildWoodStack(B, 22.0, 0, 4.0);

  // Campfires with crackling embers
  buildCampfire(B, -6.0, 0, -8.0);
  buildCampfire(B, 6.0, 0, 8.0);

  // Ranger trail signs & logging carts
  buildTrailSign(B, -4.0, 0, -18.0);
  buildTrailSign(B, 4.0, 0, 18.0);
  buildLoggingCart(B, -20.0, 0, 28.0);
  buildSurveyTable(B, 20.0, 0, -28.0);

  // ==================== 10. SPAWNS, PICKUPS & COMBAT NAVIGATION ====================
  spawn(0, 0.2, D - 5);
  spawn(0, 0.2, -D + 5);
  spawn(-D + 5, 0.2, 0);
  spawn(D - 5, 0.2, 0);

  // Snipers stationed on elevated tree decks
  sniper(0, 10.0, -29.0);
  sniper(0, 10.0, 29.0);
  sniper(-27.0, 10.0, 0);
  sniper(27.0, 10.0, 0);

  // High-value pickups
  pickup(0, 10.0, 0);           // Inside central Treehouse cabin
  pickup(0, 0.3, 0);            // Base of titan trunk
  pickup(20.0, 1.2, -16.0);     // On river footbridge
  pickup(-20.0, 4.0, -18.0);    // On curved hollow log roof
  pickup(-34.0, 12.0, -32.0);   // High in NW Titan redwood
  pickup(34.0, 12.0, 32.0);     // High in SE Banyan spire

  // High Canopy Aerial Grapple Highway (allows rapid gliding and zapping across the map)
  ring(0, 31.0, 0, 'y');        // Apex Treehouse swing (above 28m crown)
  ring(0, 16.0, -18.0, 'z');    // North airway
  ring(0, 16.0, 18.0, 'z');     // South airway
  ring(-18.0, 16.0, 0, 'x');    // West airway
  ring(18.0, 16.0, 0, 'x');     // East airway
  ring(-25.0, 18.0, -25.0, 'y');
  ring(25.0, 18.0, -25.0, 'y');
  ring(-25.0, 18.0, 25.0, 'y');
  ring(25.0, 18.0, 25.0, 'y');

  // Solid ground foundation collider
  collider(0, -2, 0, 2 * P + 20, 2, 2 * P + 20);
  L.playerStart.set(0, 0.2, D - 5);

  B.finish();
  return L;
}
