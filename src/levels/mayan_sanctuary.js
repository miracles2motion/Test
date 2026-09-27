import * as THREE from 'three';
import { INK, makeInkMaterial } from '../render.js';
import {
  buildBoulderField,
  buildFernCluster,
  buildBambooPlantation,
  buildDraftingTapeBridge,
  buildAtmosphericBeams,
  buildWaterRipples,
  buildSuspendedRopeBridge
} from '../prefabs.js';

/**
 * ============================================================================
 * MAYAN SANCTUARY (Reimagined & Architectural Masterpiece)
 * ============================================================================
 * A monumental Mesoamerican ancient temple complex set in a lush jungle cenote.
 * 
 * Major Sectors:
 * 1. THE KUKULKAN ACROPOLIS (North): A 4-tier stepped ziggurat pyramid (Y=0 to 11.8m)
 *    with dual axial staircases, serpent heads, and high summit sanctuary.
 * 2. THE SACRED CENOTE GORGE (East): A sunken limestone chasm with glowing azure
 *    water, stepping stones, and a high suspended timber/tape bridge.
 * 3. THE CEREMONIAL BALL COURT - POK-TA-POK (South): Tournament corridor with
 *    45° angled ramp embankments, spectator galleries, and vertical scoring rings.
 * 4. THE STELAE PLAZA & COLONNADE (West): Rhythmic rows of carved stone glyph pillars,
 *    sunken offering pit, and stone archways.
 * 5. CENTRAL DAIS (Mid): Contested elevated hub linking all 4 quadrants.
 */
export function buildMayanSanctuary(B, arena = false) {
  const {
    L, box, slab, wallX, wallZ, stairs, rail, cyl, ring,
    spawn, sniper, pickup, planes, arch, facetedRock, finish
  } = B;

  const OR = INK.ORANGE;
  const GR = INK.GREEN;
  const BK = INK.BLACK;
  const BL = INK.BLUE;
  const RD = INK.RED;

  L.key = 'mayan_sanctuary';
  // Player spawns at South entrance courtyard facing North towards the towering Pyramid
  L.playerStart.set(0, 0.5, 42);

  const P = arena ? 68 : 55;
  const PH = arena ? 30 : 20;
  L.bounds.minX = -P; L.bounds.maxX = P;
  L.bounds.minZ = -P; L.bounds.maxZ = P;

  // =========================================================================
  // 1. FOUNDATION & PERIMETER LIMESTONE ENCLOSURE
  // =========================================================================
  // Base ground substrate
  slab(-P, -P, P, P, 0.0, 0.5, { ink: GR, tag: 'ground' });

  // 4 Cardinal Megalith Perimeter Walls
  const T = 5.0; // Wall thickness
  // South Wall with Grand Portal
  wallX(-P, P, P, 0, PH, T, [[-6, 6, 0, 8]], { ink: BK });
  // North Wall behind Pyramid
  wallX(-P, P, -P, 0, PH, T, [], { ink: BK });
  // West Wall
  wallZ(-P, P, -P, 0, PH, T, [], { ink: BK });
  // East Wall
  wallZ(-P, P, P, 0, PH, T, [], { ink: BK });

  // Elevated Perimeter Sniper Walkways (Y = 7.0m)
  // West Walkway (split to provide open stairwell for ascending stairs)
  slab(-P + T, -P + T, -P + T + 3.0, 15.0, 7.0, 0.4, { ink: OR, tag: 'walkway' });
  slab(-P + T, 27.0, -P + T + 3.0, P - T, 7.0, 0.4, { ink: OR, tag: 'walkway' });
  // East Walkway (split to provide open stairwell for ascending stairs)
  slab(P - T - 3.0, -P + T, P - T, 15.0, 7.0, 0.4, { ink: OR, tag: 'walkway' });
  slab(P - T - 3.0, 27.0, P - T, P - T, 7.0, 0.4, { ink: OR, tag: 'walkway' });
  // South Wall Walkway
  slab(-P + T, -P + T, P - T, -P + T + 3.0, 7.0, 0.4, { ink: OR, tag: 'walkway' });

  // 4 Corner Megalith Bastion Platforms (Y = 7.0m, 6m x 6m corners with high parapets)
  slab(-P + T, -P + T, -P + T + 6.0, -P + T + 6.0, 7.0, 0.4, { ink: OR, tag: 'walkway' }); // NW Bastion
  slab(P - T - 6.0, -P + T, P - T, -P + T + 6.0, 7.0, 0.4, { ink: OR, tag: 'walkway' });   // NE Bastion
  slab(-P + T, P - T - 6.0, -P + T + 6.0, P - T, 7.0, 0.4, { ink: OR, tag: 'walkway' });   // SW Bastion
  slab(P - T - 6.0, P - T - 6.0, P - T, P - T, 7.0, 0.4, { ink: OR, tag: 'walkway' });   // SE Bastion

  // Bastion Stone Braziers (Waist-high cover)
  box(-P + T + 3.0, 7.0, -P + T + 3.0, 1.2, 1.0, 1.2, { ink: BK, tag: 'cover' });
  box(P - T - 3.0, 7.0, -P + T + 3.0, 1.2, 1.0, 1.2, { ink: BK, tag: 'cover' });
  box(-P + T + 3.0, 7.0, P - T - 3.0, 1.2, 1.0, 1.2, { ink: BK, tag: 'cover' });
  box(P - T - 3.0, 7.0, P - T - 3.0, 1.2, 1.0, 1.2, { ink: BK, tag: 'cover' });

  // Walkway access stairs (West & East perimeters)
  stairs(-P + T + 1.5, 0, 15, '+z', 24, 2.5, { rise: 7.0 / 24, run: 0.5, ink: OR });
  stairs(P - T - 1.5, 0, 15, '+z', 24, 2.5, { rise: 7.0 / 24, run: 0.5, ink: OR });

  // =========================================================================
  // 2. HERO LANDMARK: THE KUKULKAN PYRAMID ACROPOLIS (North)
  // Center: (0, 0, -24)
  // =========================================================================
  const pyrX = 0;
  const pyrZ = -24;

  // Tier 1: 30m x 30m base platform (Y = 0 to 2.0m)
  // Split into West & East wings with an open central 4.4m corridor for stairs
  box(pyrX - 8.6, 0, pyrZ, 12.8, 2.0, 30, { ink: BK });
  box(pyrX + 8.6, 0, pyrZ, 12.8, 2.0, 30, { ink: BK });
  slab(pyrX - 15.4, pyrZ - 15.4, pyrX + 15.4, pyrZ + 15.4, 2.1, 0.2, { ink: OR, noCollide: true });

  // Tier 2: 24m x 24m terrace (Y = 2.0 to 4.0m)
  box(pyrX - 7.1, 2.0, pyrZ, 9.8, 2.0, 24, { ink: BK });
  box(pyrX + 7.1, 2.0, pyrZ, 9.8, 2.0, 24, { ink: BK });
  slab(pyrX - 12.4, pyrZ - 12.4, pyrX + 12.4, pyrZ + 12.4, 4.1, 0.2, { ink: OR, noCollide: true });

  // Tier 3: 18m x 18m terrace (Y = 4.0 to 6.0m)
  box(pyrX - 5.6, 4.0, pyrZ, 6.8, 2.0, 18, { ink: BK });
  box(pyrX + 5.6, 4.0, pyrZ, 6.8, 2.0, 18, { ink: BK });
  slab(pyrX - 9.4, pyrZ - 9.4, pyrX + 9.4, pyrZ + 9.4, 6.1, 0.2, { ink: OR, noCollide: true });

  // Tier 4: 12m x 12m summit terrace (Y = 6.0 to 8.0m)
  box(pyrX - 4.1, 6.0, pyrZ, 3.8, 2.0, 12, { ink: BK });
  box(pyrX + 4.1, 6.0, pyrZ, 3.8, 2.0, 12, { ink: BK });
  slab(pyrX - 6.3, pyrZ - 6.3, pyrX + 6.3, pyrZ + 6.3, 8.1, 0.2, { ink: OR, noCollide: true });

  // Solid foundation directly under the High Temple summit
  box(pyrX, 0, pyrZ, 4.4, 7.6, 8.0, { ink: BK, noNav: true });
  // Walkable Summit Platform Landing (Y = 8.0m, Z in [-30, -18])
  slab(pyrX - 6.0, pyrZ - 6.0, pyrX + 6.0, pyrZ + 6.0, 8.0, 0.4, { ink: OR });

  // Summit High Temple Sanctuary (Y = 8.0m to 11.6m)
  // Outer temple walls with cardinal doorways
  wallX(pyrX - 3.8, pyrX + 3.8, pyrZ + 3.6, 8.0, 3.6, 0.6, [[-1.2, 1.2, 0, 2.8]], { ink: BK }); // South entrance
  wallX(pyrX - 3.8, pyrX + 3.8, pyrZ - 3.6, 8.0, 3.6, 0.6, [[-1.2, 1.2, 0, 2.8]], { ink: BK }); // North entrance
  wallZ(pyrZ - 3.6, pyrZ + 3.6, pyrX - 3.8, 8.0, 3.6, 0.6, [[-1.2, 1.2, 0, 2.8]], { ink: BK }); // West entrance
  wallZ(pyrZ - 3.6, pyrZ + 3.6, pyrX + 3.8, 8.0, 3.6, 0.6, [[-1.2, 1.2, 0, 2.8]], { ink: BK }); // East entrance

  // Slanted Mansard Roofcomb Crest (Y = 11.6m to 13.2m)
  slab(pyrX - 4.2, pyrZ - 4.2, pyrX + 4.2, pyrZ + 4.2, 11.6, 0.4, { ink: OR });
  box(pyrX, 11.6, pyrZ, 5.0, 1.6, 5.0, { ink: BK });
  box(pyrX, 13.2, pyrZ, 2.0, 1.2, 4.0, { ink: OR, noCollide: true }); // Crest finial

  // Ceremonial Altar in the Temple center
  box(pyrX, 8.0, pyrZ, 1.6, 0.9, 1.6, { ink: OR, tag: 'cover' });
  // Legendary Weapon Pickup at apex altar
  pickup(pyrX, 9.2, pyrZ);

  // --- DUAL AXIAL STAIRWAYS (Anti-Camp 2-Way Flow) ---
  // South Grand Staircase (Base Z=-9.0, Y=0 to Summit Landing Z=-18.0, Y=8.0m)
  // Run = 9.0m, Steps = 24 -> rise = 8.0 / 24 = 0.3333m, run = 0.375m
  const stairW = 4.0;
  stairs(pyrX, 0, -9.0, '-z', 24, stairW, { rise: 8.0 / 24, run: 0.375, ink: OR });

  // Flanking Stepped Stone Balustrades (South)
  for (let b = 0; b < 4; b++) {
    const bZ = -9.0 - (b + 0.5) * 2.25;
    const bH = (b + 1) * 2.0 + 0.4;
    box(pyrX - stairW / 2 - 0.3, 0, bZ, 0.6, bH, 2.3, { ink: BK, noCollide: true });
    box(pyrX + stairW / 2 + 0.3, 0, bZ, 0.6, bH, 2.3, { ink: BK, noCollide: true });
  }

  // Carved Serpent Head Pedestals at foot of South Staircase (Z = -8.5)
  box(pyrX - 2.6, 0, -8.5, 1.2, 1.2, 1.0, { ink: OR, tag: 'cover' });
  cyl(pyrX - 2.6, 1.2, -8.5, 0.4, 0.6, { ink: BK, noCollide: true });
  box(pyrX + 2.6, 0, -8.5, 1.2, 1.2, 1.0, { ink: OR, tag: 'cover' });
  cyl(pyrX + 2.6, 1.2, -8.5, 0.4, 0.6, { ink: BK, noCollide: true });

  // North Rear Escape Stair (Base Z=-39.0, Y=0 to Summit Landing Z=-30.0, Y=8.0m)
  stairs(pyrX, 0, -39.0, '+z', 24, stairW, { rise: 8.0 / 24, run: 0.375, ink: OR });

  // Flanking Stepped Stone Balustrades (North)
  for (let b = 0; b < 4; b++) {
    const bZ = -39.0 + (b + 0.5) * 2.25;
    const bH = (b + 1) * 2.0 + 0.4;
    box(pyrX - stairW / 2 - 0.3, 0, bZ, 0.6, bH, 2.3, { ink: BK, noCollide: true });
    box(pyrX + stairW / 2 + 0.3, 0, bZ, 0.6, bH, 2.3, { ink: BK, noCollide: true });
  }

  // 4 Symmetrical Fire Braziers on Tier 2 Terraces (Waist-high cover)
  const bDist = 10.5;
  box(pyrX - bDist, 2.0, pyrZ - bDist, 1.1, 1.1, 1.1, { ink: OR, tag: 'cover' });
  box(pyrX + bDist, 2.0, pyrZ - bDist, 1.1, 1.1, 1.1, { ink: OR, tag: 'cover' });
  box(pyrX - bDist, 2.0, pyrZ + bDist, 1.1, 1.1, 1.1, { ink: OR, tag: 'cover' });
  box(pyrX + bDist, 2.0, pyrZ + bDist, 1.1, 1.1, 1.1, { ink: OR, tag: 'cover' });

  // Ceremonial Staircase Flanking Braziers at Tier 1 (Z = -10.5)
  box(pyrX - 3.2, 2.0, -10.5, 0.9, 0.9, 0.9, { ink: OR, tag: 'cover' });
  box(pyrX + 3.2, 2.0, -10.5, 0.9, 0.9, 0.9, { ink: OR, tag: 'cover' });

  // Apex Grapple Ring above Temple Roof
  ring(pyrX, 15.8, pyrZ, 'z');

  // =========================================================================
  // 3. THE SACRED CENOTE GORGE & SUBTERRANEAN CAVERN (East)
  // X in [16, 44], Z in [-38, 18]
  // =========================================================================
  const cenX = 28;
  const cenZ = -10;
  const cenW = 14;
  const cenL = 50;

  // Sunken water chasm (-2.2m sink)
  slab(cenX - cenW / 2, cenZ - cenL / 2, cenX + cenW / 2, cenZ + cenL / 2, -2.0, 0.4, { ink: BL, tag: 'water' });

  // Cascading Limestone Ledge Banks
  // West Bank (descending from ground Y=0 to water Y=-2.0)
  slab(cenX - cenW / 2 - 3.5, cenZ - cenL / 2, cenX - cenW / 2, cenZ + cenL / 2, -1.0, 0.6, { ink: BK });
  // East Bank
  slab(cenX + cenW / 2, cenZ - cenL / 2, cenX + cenW / 2 + 3.5, cenZ + cenL / 2, -1.0, 0.6, { ink: BK });

  // Cascading Limestone Waterfall Steps at North End of Gorge
  slab(cenX - 4.5, cenZ - cenL / 2 - 2, cenX + 4.5, cenZ - cenL / 2 + 4, -0.6, 0.6, { ink: BK });
  slab(cenX - 4.0, cenZ - cenL / 2 + 2, cenX + 4.0, cenZ - cenL / 2 + 8, -1.3, 0.7, { ink: BK });

  // Subterranean Limestone Cave Shrine into the East Bluff (X=36, Z=-10)
  box(cenX + cenW / 2 + 2.5, -2.0, cenZ, 4.0, 2.6, 8.0, { ink: BK });
  box(cenX + cenW / 2 + 2.5, -2.0, cenZ, 1.4, 0.9, 1.4, { ink: OR, tag: 'cover' }); // Cave altar

  // Natural Granite Stepping Stones across Cenote
  facetedRock(B, cenX - 3, -1.8, cenZ - 12, 1.6, 1.2, 1.6, { ink: BK, cover: 'step' });
  facetedRock(B, cenX + 1, -1.8, cenZ - 10, 1.8, 1.4, 1.8, { ink: BK, cover: 'step' });
  facetedRock(B, cenX - 2, -1.8, cenZ + 8, 1.5, 1.2, 1.5, { ink: BK, cover: 'step' });
  facetedRock(B, cenX + 2, -1.8, cenZ + 10, 1.7, 1.3, 1.7, { ink: BK, cover: 'step' });

  // Water Ripple VFX Decals
  buildWaterRipples(B, cenX, -1.95, cenZ - 11, { count: 3 });
  buildWaterRipples(B, cenX, -1.95, cenZ + 9, { count: 3 });

  // High Suspended Timber Rope Bridge spanning Cenote Gorge (Y = 4.4m)
  // Connects Pyramid East Terrace (X=15) to East Jungle Bluff (X=40)
  buildSuspendedRopeBridge(B, 15.0, 4.4, -24.0, 39.0, 4.4, -24.0, { ink: OR, sag: 0.6, walkwayW: 2.2 });

  // Translucent Drafting Tape Footbridge at Mid-Gorge (Y = 0.5m)
  buildDraftingTapeBridge(B, cenX - 8, 0.3, 0, cenX + 8, 0.3, 0, { width: 2.6, tapeColor: '#f0e68c' });

  // Cenote Aerial Momentum Grapple Chain (3 rings)
  ring(cenX - 2, 11.5, cenZ - 16, 'x');
  ring(cenX + 3, 12.0, cenZ, 'x');
  ring(cenX - 1, 11.5, cenZ + 16, 'x');

  // Health Pickup in Cenote Grotto under bridge
  pickup(cenX, -1.5, cenZ);

  // =========================================================================
  // 3B. HERO LANDMARK: EL CARACOL ASTRONOMICAL OBSERVATORY (North-East)
  // X in [18, 42], Z in [-44, -24]
  // =========================================================================
  const obsX = 29;
  const obsZ = -34;

  // Raised Astronomical Terrace (Y = 2.4m, 21m x 16m)
  slab(19, -42, 40, -26, 2.4, 0.5, { ink: OR, tag: 'walkway' });

  // West Access Stairway (climbing +x from Central Plaza onto Terrace at X=19)
  stairs(15.4, 0, obsZ, '+x', 8, 3.2, { rise: 2.4 / 8, run: 0.45, ink: OR });

  // Concentric Cylindrical Drum Tower (Lower Drum: Y = 2.4m to 6.0m, r=4.2m)
  cyl(obsX, 2.4, obsZ, 4.2, 3.6, { seg: 16, ink: BK });
  // Upper Observation Catwalk Terrace (Y = 6.0m, r=4.8m)
  slab(obsX - 4.8, obsZ - 4.8, obsX + 4.8, obsZ + 4.8, 6.0, 0.4, { ink: OR, tag: 'walkway' });
  rail(obsX - 4.8, obsZ - 4.8, obsX + 4.8, obsZ - 4.8, 6.0, { ink: BK });
  rail(obsX - 4.8, obsZ + 4.8, obsX + 4.8, obsZ + 4.8, 6.0, { ink: BK });
  rail(obsX - 4.8, obsZ - 4.8, obsX - 4.8, obsZ + 4.8, 6.0, { ink: BK });
  rail(obsX + 4.8, obsZ - 4.8, obsX + 4.8, obsZ + 4.8, 6.0, { ink: BK });

  // Upper Dome Observatory Chamber (Y = 6.0m to 9.2m, r=2.8m)
  cyl(obsX, 6.0, obsZ, 2.8, 3.2, { seg: 14, ink: BK });
  // Conical Spire Dome (Y = 9.2m to 11.6m)
  cyl(obsX, 9.2, obsZ, 1.4, 2.4, { seg: 10, ink: OR, noCollide: true });

  // 4 Solar Solstice Observation Portals (Cardinal Slits)
  box(obsX, 7.2, obsZ - 3.0, 1.0, 1.4, 0.4, { ink: BK, noCollide: true });
  box(obsX, 7.2, obsZ + 3.0, 1.0, 1.4, 0.4, { ink: BK, noCollide: true });
  box(obsX - 3.0, 7.2, obsZ, 0.4, 1.4, 1.0, { ink: BK, noCollide: true });
  box(obsX + 3.0, 7.2, obsZ, 0.4, 1.4, 1.0, { ink: BK, noCollide: true });

  // Observatory Apex Grapple Ring
  ring(obsX, 12.5, obsZ, 'y');
  // Sniper vantage on Observation Balcony
  sniper(obsX, 6.4, obsZ + 4.2);
  pickup(obsX, 6.4, obsZ - 4.2);

  // =========================================================================
  // 4. THE CEREMONIAL BALL COURT - POK-TA-POK (South)
  // X in [-20, 20], Z in [18, 38]
  // =========================================================================
  const courtZ = 28;
  const courtW = 38; // East-West corridor length
  const courtD = 14; // North-South width

  // Sunken Court Floor
  slab(-courtW / 2, courtZ - courtD / 2, courtW / 2, courtZ + courtD / 2, 0.0, 0.4, { ink: GR });

  // Sloping 45° Ramp Embankments on North and South sides
  // South Embankment Wall
  for (let s = 0; s < 8; s++) {
    const rH = (s + 1) * 0.45;
    const rZ = courtZ + courtD / 2 + s * 0.5;
    box(0, 0, rZ, courtW, rH, 0.55, { ink: BK });
  }
  // Elevated South Spectator Gallery at Y = 3.6m
  slab(-courtW / 2, courtZ + courtD / 2 + 4.0, courtW / 2, courtZ + courtD / 2 + 8.0, 3.6, 0.4, { ink: OR, tag: 'walkway' });

  // North Embankment Wall
  for (let s = 0; s < 8; s++) {
    const rH = (s + 1) * 0.45;
    const rZ = courtZ - courtD / 2 - s * 0.5;
    box(0, 0, rZ, courtW, rH, 0.55, { ink: BK });
  }
  // Elevated North Spectator Gallery at Y = 3.6m
  slab(-courtW / 2, courtZ - courtD / 2 - 8.0, courtW / 2, courtZ - courtD / 2 - 4.0, 3.6, 0.4, { ink: OR, tag: 'walkway' });

  // Gallery Safety Rails
  rail(-courtW / 2, courtZ + courtD / 2 + 4.0, courtW / 2, courtZ + courtD / 2 + 4.0, 3.6, { ink: BK });
  rail(-courtW / 2, courtZ - courtD / 2 - 4.0, courtW / 2, courtZ - courtD / 2 - 4.0, 3.6, { ink: BK });

  // TWO VERTICAL STONE SCORING RINGS (Hoops mounted at Y=5.4m with grapple rings!)
  // North Hoop
  cyl(0, 5.4, courtZ - courtD / 2 - 0.2, 1.2, 0.4, { axis: 'z', ink: OR, noCollide: true });
  ring(0, 5.4, courtZ - courtD / 2 - 0.2, 'z');

  // South Hoop
  cyl(0, 5.4, courtZ + courtD / 2 + 0.2, 1.2, 0.4, { axis: 'z', ink: OR, noCollide: true });
  ring(0, 5.4, courtZ + courtD / 2 + 0.2, 'z');

  // East & West End-Zone Monumental Stone Archways
  arch(-courtW / 2 + 2, 0, courtZ, 4.0, 4.2, 1.2, { axis: 'z', ink: BK });
  arch(courtW / 2 - 2, 0, courtZ, 4.0, 4.2, 1.2, { axis: 'z', ink: BK });

  // Ball Court Ammo Pickups
  pickup(-14, 0.4, courtZ);
  pickup(14, 0.4, courtZ);

  // =========================================================================
  // 4B. HERO SECTOR: THE SACRED MERCADO & GRANARY (South-East)
  // X in [18, 42], Z in [12, 32]
  // =========================================================================
  const granX = 30;
  const granZ = 24;

  // Central Granary Watchtower (6m x 6m x 4.2m)
  box(granX, 0, granZ, 6.0, 4.2, 6.0, { ink: BK });
  slab(27.0, 21.0, 33.0, 27.0, 4.2, 0.4, { ink: OR, tag: 'walkway' });
  rail(27.0, 21.0, 28.5, 21.0, 4.2, { ink: BK });
  rail(31.5, 21.0, 33.0, 21.0, 4.2, { ink: BK });
  rail(27.0, 27.0, 33.0, 27.0, 4.2, { ink: BK });
  rail(27.0, 21.0, 27.0, 27.0, 4.2, { ink: BK });
  rail(33.0, 21.0, 33.0, 27.0, 4.2, { ink: BK });

  // Granary Roof Access Stairs (climbing +z from Z=14.7 to Z=21.0 onto roof deck)
  // 14 steps, rise = 4.2 / 14 = 0.30m, run = 0.45m
  stairs(granX, 0, 14.7, '+z', 14, 2.2, { rise: 4.2 / 14, run: 0.45, ink: OR });
  sniper(granX, 4.6, granZ); // Granary sniper vantage

  // Row of 4 Artisan Merchant Stalls (Timber canopy & stone counters)
  const stallZs = [14, 19, 25, 30];
  for (let s = 0; s < stallZs.length; s++) {
    const sZ = stallZs[s];
    // Stone vendor counter (waist-high cover)
    box(21, 0, sZ, 1.4, 0.9, 2.6, { ink: OR, tag: 'cover' });
    // Timber canopy posts & roof
    box(21, 2.6, sZ, 2.2, 0.15, 3.2, { ink: BK, noCollide: true });
    cyl(20.2, 0, sZ - 1.3, 0.08, 2.6, { ink: BK, noCollide: true });
    cyl(21.8, 0, sZ - 1.3, 0.08, 2.6, { ink: BK, noCollide: true });
    cyl(20.2, 0, sZ + 1.3, 0.08, 2.6, { ink: BK, noCollide: true });
    cyl(21.8, 0, sZ + 1.3, 0.08, 2.6, { ink: BK, noCollide: true });
  }

  // Terracotta Storage Urns & Indigo Dye Vats in Mercado Plaza
  cyl(24, 0, 16, 0.7, 1.1, { ink: RD, tag: 'cover' });
  cyl(24, 0, 23, 0.7, 1.1, { ink: BL, tag: 'cover' });
  ring(granX, 8.5, granZ, 'z');
  pickup(21, 1.0, 19);

  // =========================================================================
  // 4C. HERO SECTOR: THE TEMAZCAL & WATER LILY POOLS (South-West)
  // X in [-40, -22], Z in [24, 44]
  // =========================================================================
  const temX = -31;
  const temZ = 34;

  // Sunken Limestone Basin (Y = -1.0m, 16m x 16m)
  slab(-40, 26, -22, 42, -0.8, 0.4, { ink: BL, tag: 'water' });
  // Sunken Perimeter Basin Stone Walkway
  slab(-42, 24, -20, 26, -0.2, 0.4, { ink: BK });
  slab(-42, 42, -20, 44, -0.2, 0.4, { ink: BK });
  slab(-42, 26, -40, 42, -0.2, 0.4, { ink: BK });
  slab(-22, 26, -20, 42, -0.2, 0.4, { ink: BK });

  // Domed Stone Steam Lodge (Sweat Chamber: r=3.4m, Y = -0.8 to 2.4m)
  cyl(temX, -0.8, temZ, 3.4, 3.2, { seg: 14, ink: BK });
  // Low Arched Entrance Portal
  arch(temX, -0.8, temZ + 3.4, 2.2, 2.0, 0.8, { axis: 'z', ink: OR });
  // Central Volcanic Basalt Hearth (Heated river stones)
  box(temX, -0.8, temZ, 1.6, 0.8, 1.6, { ink: OR, tag: 'cover' });

  // Floating Water Lily Stepping Stones across the reflecting pool
  facetedRock(B, temX + 4.5, -0.7, temZ - 4.0, 1.4, 0.5, 1.4, { ink: GR, cover: 'step' });
  facetedRock(B, temX + 6.0, -0.7, temZ, 1.5, 0.5, 1.5, { ink: GR, cover: 'step' });
  facetedRock(B, temX + 4.5, -0.7, temZ + 4.0, 1.4, 0.5, 1.4, { ink: GR, cover: 'step' });

  // Water Ripple VFX Decals in Temazcal Pool
  buildWaterRipples(B, temX + 5.0, -0.75, temZ - 2.0, { count: 2 });
  buildWaterRipples(B, temX + 5.0, -0.75, temZ + 2.0, { count: 2 });

  // Temazcal Apex Grapple Ring
  ring(temX, 7.5, temZ, 'y');
  pickup(temX, 0.2, temZ);

  // =========================================================================
  // 5. THE STELAE PLAZA & COLONNADE (West)
  // X in [-42, -14], Z in [-14, 26]
  // =========================================================================
  const plazaX = -28;
  const plazaZ = 6;

  // Raised Plaza Terrace (Y = 1.2m)
  slab(plazaX - 12, plazaZ - 16, plazaX + 12, plazaZ + 16, 1.2, 0.4, { ink: OR });
  // Access Steps from Central Court (climbing -x onto Plaza terrace at X=-16)
  stairs(-14.0, 0, plazaZ, '-x', 4, 4.0, { rise: 0.3, run: 0.5, ink: OR });

  // 8 MONUMENTAL INSCRIBED STONE STELAE (Rhythmic cover grid)
  const stelaeLocs = [
    [-34, -6], [-28, -6], [-22, -6],
    [-34, 4],  [-22, 4],
    [-34, 14], [-28, 14], [-22, 14]
  ];
  for (let i = 0; i < stelaeLocs.length; i++) {
    const [sx, sz] = stelaeLocs[i];
    // Stela pillar: 1.2m x 1.2m base, 2.8m high
    box(sx, 1.2, sz, 1.2, 2.8, 1.2, { ink: BK, tag: 'cover' });
    // Decorative top cap
    box(sx, 4.0, sz, 1.5, 0.3, 1.5, { ink: OR, noCollide: true });
  }

  // Sunken Ceremonial Offering Pit in Plaza Center
  box(plazaX, 0.0, plazaZ, 4.0, 1.2, 4.0, { ink: BK });
  // Fire Brazier in center of pit
  box(plazaX, 1.2, plazaZ, 1.4, 0.8, 1.4, { ink: OR, tag: 'cover' });
  pickup(plazaX, 2.2, plazaZ); // Offering pickup

  // West Colonnade Stone Arches & Portico
  arch(-40, 1.2, -4, 3.2, 3.8, 0.8, { axis: 'x', ink: BK });
  arch(-40, 1.2, 8, 3.2, 3.8, 0.8, { axis: 'x', ink: BK });
  arch(-40, 1.2, 18, 3.2, 3.8, 0.8, { axis: 'x', ink: BK });
  // Portico Architrave Beam overhead (Sheltered Colonnade Corridor)
  box(-40, 4.4, 7, 1.6, 0.5, 26, { ink: BK, noCollide: true });
  slab(-41, -6, -39, 20, 4.6, 0.2, { ink: OR, noCollide: true }); // Colonnade roof trim

  // Plaza Grapple Rings
  ring(plazaX, 11.0, plazaZ - 10, 'y');
  ring(plazaX, 11.0, plazaZ + 10, 'y');

  // =========================================================================
  // 5B. HERO LANDMARK: THE SCRIBE'S ROYAL PALACE (North-West)
  // X in [-40, -18], Z in [-42, -26]
  // =========================================================================
  const palX = -29;
  const palZ = -34;

  // Raised Palace Terrace (Y = 2.0m, 22m x 16m)
  slab(-40, -42, -18, -26, 2.0, 0.4, { ink: OR, tag: 'walkway' });

  // East Access Stairway (climbing -x from Central Plaza onto Palace terrace at X=-18)
  stairs(-15.3, 0, palZ, '-x', 6, 3.2, { rise: 2.0 / 6, run: 0.45, ink: OR });

  // Royal Corbelled Arch Vault Chambers (3 interconnected vaulted halls)
  arch(palX - 5.0, 2.0, palZ, 3.6, 3.6, 1.2, { axis: 'x', ink: BK });
  arch(palX, 2.0, palZ, 3.6, 3.6, 1.2, { axis: 'x', ink: BK });
  arch(palX + 5.0, 2.0, palZ, 3.6, 3.6, 1.2, { axis: 'x', ink: BK });

  // Palace Corbelled Roof Deck (Y = 5.6m)
  slab(-38, -40, -20, -28, 5.6, 0.4, { ink: BK, tag: 'walkway' });

  // Scribe's Inscribed Glyph Stelae & Stone Drafting Tables
  box(palX - 3.0, 2.0, palZ - 4.0, 2.2, 0.9, 1.2, { ink: OR, tag: 'cover' }); // Scribe desk
  box(palX + 3.0, 2.0, palZ - 4.0, 2.2, 0.9, 1.2, { ink: OR, tag: 'cover' }); // Scribe desk
  box(palX, 2.0, palZ + 4.0, 1.4, 2.8, 1.4, { ink: BK, tag: 'cover' }); // Central royal glyph stela

  // High Elevated Skybridge connecting Palace Roof to West Wall Walkway (Y = 7.0m)
  slab(-47, -36, -38, -32, 7.0, 0.4, { ink: OR, tag: 'walkway' });
  rail(-47, -36, -38, -36, 7.0, { ink: BK });
  rail(-47, -32, -38, -32, 7.0, { ink: BK });

  // Palace Roof to Skybridge Access Stairway (5 steps, rise = 1.4 / 5 = 0.28m, run = 0.45m)
  stairs(-35.75, 5.6, palZ, '-x', 5, 2.0, { rise: 1.4 / 5, run: 0.45, ink: OR });

  // Palace Grapple Ring above Courtyard
  ring(palX, 9.5, palZ, 'x');
  pickup(palX, 2.2, palZ);

  // =========================================================================
  // 6. CENTRAL CONTESTED DAIS & JUNGLE ATRIUM (Center: 0, 0, 0)
  // =========================================================================
  // Raised Central Dais (Y = 1.6m, 10m x 10m)
  box(0, 0, 0, 10, 1.6, 10, { ink: BK });
  slab(-5.3, -5.3, 5.3, 5.3, 1.7, 0.3, { ink: OR, noCollide: true });

  // 4 Cardinal Access Stairs to Central Dais (Uniform 5-step flights)
  // Run = 2.25m, Rise = 1.6 / 5 = 0.32m, Step Run = 0.45m
  stairs(0, 0, 7.25, '-z', 5, 3.6, { rise: 1.6 / 5, run: 0.45, ink: OR }); // South
  stairs(0, 0, -7.25, '+z', 5, 3.6, { rise: 1.6 / 5, run: 0.45, ink: OR }); // North
  stairs(7.25, 0, 0, '-x', 5, 3.6, { rise: 1.6 / 5, run: 0.45, ink: OR }); // East
  stairs(-7.25, 0, 0, '+x', 5, 3.6, { rise: 1.6 / 5, run: 0.45, ink: OR }); // West

  // Central Carved Monolith Column
  box(0, 1.6, 0, 2.0, 3.4, 2.0, { ink: OR, tag: 'cover' });
  // Central Ring overhead for aerial pass-through
  ring(0, 12.0, 0, 'z');

  // =========================================================================
  // 7. CEREMONIAL TZOMPANTLI (Skull Rack Platform) & PLAZA MONUMENTS
  // West Plaza Corridor (X=-12, Z=-16)
  // =========================================================================
  // Raised Stone Skull Platform (8m x 4m, Y=0.9m)
  box(-12, 0.0, -16, 8.0, 0.9, 4.0, { ink: BK, tag: 'cover' });
  slab(-16.2, -18.2, -7.8, -13.8, 1.0, 0.2, { ink: OR, noCollide: true });
  // 4 Vertical Wooden Impalement Posts
  cyl(-14.5, 0.9, -16, 0.12, 1.8, { ink: BK, noCollide: true });
  cyl(-12.5, 0.9, -16, 0.12, 1.8, { ink: BK, noCollide: true });
  cyl(-10.5, 0.9, -16, 0.12, 1.8, { ink: BK, noCollide: true });
  cyl(-8.5, 0.9, -16, 0.12, 1.8, { ink: BK, noCollide: true });
  // Sacrificial Flint Dagger Cache Pickup
  pickup(-11.5, 1.2, -16);

  // Crepuscular Atmospheric Sun Rays shining onto Central Dais
  buildAtmosphericBeams(B, 0, 1.6, 0, { radius: 6.0, height: 18.0 });

  // Organic Jungle Fern Clusters & Bamboo Groves anchoring corners
  buildFernCluster(B, -8, 0, -10, { count: 6 });
  buildFernCluster(B, 8, 0, -10, { count: 6 });
  buildFernCluster(B, -10, 0, 10, { count: 5 });
  buildFernCluster(B, 10, 0, 10, { count: 5 });
  buildBoulderField(B, -12, 0, -18, { count: 8, seed: 101 });
  buildBambooPlantation(B, -28, 0, -32, { culms: 18 });

  // =========================================================================
  // 7. SNIPER VANTAGES & TACTICAL SPAWNS
  // =========================================================================
  // Anti-Camp Sniper Perches (Wide open rear vectors)
  sniper(pyrX, 8.4, pyrZ + 5.0); // Temple South Portico overlooking mid
  sniper(0, 4.0, courtZ + courtD / 2 + 5.5); // South Gallery overlooking ball court
  sniper(-P + T + 1.5, 7.4, 0); // West High Wall
  sniper(P - T - 1.5, 7.4, 0);  // East High Wall

  // 4 Cardinal Solo Spawns
  spawn(0, 0.2, 42);   // South Courtyard (Player start)
  spawn(0, 0.2, -44);  // North Pyramid Rear
  spawn(-42, 0.2, 0);  // West Stelae Flank
  spawn(42, 0.2, 0);   // East Cenote Bluff

  // Balanced Team Spawns (Red & Blue)
  L.teamSpawns = [
    // Red Team (South & West)
    [[-10, 0.2, 38], [10, 0.2, 38], [-28, 1.4, 18], [-32, 1.4, -6],
     [0, 0.2, 42], [-14, 0.2, 28], [-20, 3.8, 32], [-4, 0.2, 36]].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    // Blue Team (North & East)
    [[-10, 0.2, -42], [10, 0.2, -42], [32, 0.2, -18], [36, 0.2, 6],
     [0, 2.4, -12], [14, 0.2, -28], [24, 4.6, -24], [4, 0.2, -40]].map(([x, y, z]) => new THREE.Vector3(x, y, z))
  ];

  // 16 Symmetrical Arena Spawns
  for (const [x, y, z] of [
    [-10, 0.2, 38], [10, 0.2, 38], [-28, 1.4, 18], [-32, 1.4, -6],
    [0, 0.2, 42], [-14, 0.2, 28], [-20, 3.8, 32], [-4, 0.2, 36],
    [-10, 0.2, -42], [10, 0.2, -42], [32, 0.2, -18], [36, 0.2, 6],
    [0, 2.4, -12], [14, 0.2, -28], [24, 4.6, -24], [4, 0.2, -40]
  ]) {
    L.arenaSpawns.push(new THREE.Vector3(x, y, z));
  }

  // 4 Circling Paper Planes in Upper Sky
  planes(4, 32, 22, { rStep: 8, hStep: 4, scale: 1.5, speed: 0.1 });

  return finish();
}
