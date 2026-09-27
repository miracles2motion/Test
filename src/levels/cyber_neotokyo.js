import * as THREE from 'three';
import { INK, makeInkMaterial } from '../render.js';
import {
  buildHoloPylon,
  buildNeonMarquee,
  buildWarningSign,
  buildCrateStack,
  buildToolRack,
  buildTechnicalFraming,
  buildTransitBus,
  buildTransitBench,
  buildUrbanDecals
} from '../prefabs.js';

/**
 * ============================================================================
 * CYBER NEOTOKYO (SHINJUKU ROOFTOPS) - cyber_neotokyo
 * ============================================================================
 * A rain-slicked, neon-drenched cyberpunk metropolis featuring multi-tier
 * corporate skyscraper rooftops, an automated kinetic maglev monorail train,
 * narrow Yokocho alleyways, heavy industrial HVAC cooling towers, and soaring
 * holographic telemetry billboards.
 *
 * Major Sectors:
 * 1. THE MONORAIL HIGH-LINE (Mid-Air, Y=8.0m): Elevated magnetic track beam with
 *    a kinetic commuter shuttle train moving back and forth, and transit platform.
 * 2. SKYBRIDGE CONCOURSE (Mid-Tier, Y=4.2m): Cantilevered pedestrian plaza
 *    connecting corporate towers with glass-frame skylights.
 * 3. NEON YOKOCHO ALLEY (West Lane, Y=0m to 3.2m): Dense street market with noodle
 *    stalls, vending machines, dumpster barricades, and steel fire escapes.
 * 4. HVAC SUBSTATION & COOLING TOWERS (East Lane, Y=0m to 7.0m): Industrial power
 *    plant with rotating turbine fan blades, coolant piping manifolds, and transformers.
 * 5. HOLO-BILLBOARD COMMUNICATIONS TOWER (North, Y=0m to 18.0m): Monumental corporate
 *    antenna spire with high sniper perches and wireframe advertisement frames.
 */
export function buildCyberNeotokyo(B, arena = false) {
  const {
    L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring,
    spawn, sniper, pickup, planes, finish
  } = B;

  const OR = INK.ORANGE; // Amber Neon / Construction Trims
  const GR = INK.GREEN;  // Terminal Phosphor / Coolant Conduits
  const BK = INK.BLACK;  // Carbon Composite / Weathered Asphalt / Iron
  const BL = INK.BLUE;   // High-Tech Corporate Steel / Cyber Cyan
  const RD = INK.RED;    // High-Voltage Warning / Red Laser Signage

  L.key = 'cyber_neotokyo';
  L.playerStart.set(0, 0.5, 38);

  const P = arena ? 64 : 52;
  const PH = arena ? 26 : 20;
  const T = 5.0;
  L.bounds.minX = -P; L.bounds.maxX = P;
  L.bounds.minZ = -P; L.bounds.maxZ = P;

  // =========================================================================
  // 1. BEDROCK PLINTH & URBAN CHASM BOUNDS
  // =========================================================================
  // Sub-street sewer / service tunnel bedrock floor (-2.4m)
  slab(-P, -P, P, P, -2.4, 0.6, { ink: BK, noCollide: false });

  // Perimeter Megacity Skyscraper Curtain Walls
  wallZ(-P, -P, P, PH + 2.4, T, { ink: BK, yBase: -2.4 });
  wallZ(P, -P, P, PH + 2.4, T, { ink: BK, yBase: -2.4 });
  wallX(-P, P, -P, PH + 2.4, T, { ink: BK, yBase: -2.4 });
  wallX(-P, P, P, PH + 2.4, T, { ink: BK, yBase: -2.4 });

  // =========================================================================
  // 2. MAIN STREET LEVEL & PLAZAS (Y=0.0m)
  // =========================================================================
  // Asphalt Street Ground Surface
  slab(-P, -P, P, P, 0.0, 0.6, { ink: BK });

  // Central Avenue Drainage Grating Runoff (Mid Lane, Z: -36 to 36)
  slab(-2.5, -36, 2.5, 36, 0.05, 0.1, { ink: BL, noCollide: true });

  // South Transit Depot Plaza (Player Arrival Area, Z: 26 to 45)
  // Covered passenger shelter canopy
  box(0, 3.2, 34, 12, 0.3, 6, { ink: BL });
  cyl(-5.5, 0.0, 34, 0.25, 3.2, { ink: BK });
  cyl(5.5, 0.0, 34, 0.25, 3.2, { ink: BK });
  rail(-6, 31, 6, 31, 0.1, { ink: OR });
  buildTransitBench(B, -3.5, 0.0, 34);
  buildTransitBench(B, 3.5, 0.0, 34);
  buildWarningSign(B, 0, 0.1, 28, 'NEO-SHINJUKU METRO');

  // Parked Futuristic Transit Bus at Depot Curb
  buildTransitBus(B, 14, 0.0, 34, { busType: 'express', inkBody: OR, inkTrim: BK, inkGlass: BL, bikeRack: true });
  buildUrbanDecals(B, 14, 34, { inkOil: BK, inkMark: OR });
  buildUrbanDecals(B, 0, 24, { inkOil: BK, inkMark: BL });

  // Center Avenue Roadway Jersey Barriers (traversal chicanes)
  box(0, 0.45, 20, 0.5, 0.9, 10.0, { ink: BK });
  box(0, 0.45, -20, 0.5, 0.9, 10.0, { ink: BK });

  // =========================================================================
  // 3. MID HERO LANDMARK: ELEVATED MAGLEV MONORAIL (Y=8.0m)
  // =========================================================================
  // Monorail Track Guideway Beam (Runs straight through Mid from Z=-45 to +45 at Y=7.8m)
  box(0, 7.5, 0, 2.2, 0.6, 90, { ink: BL });
  // Guide rail fins on the monorail beam
  box(-1.0, 8.0, 0, 0.15, 0.4, 90, { ink: OR });
  box(1.0, 8.0, 0, 0.15, 0.4, 90, { ink: OR });

  // Massive Pylon Support Columns carrying the track (every 18m)
  for (let pz = -36; pz <= 36; pz += 18) {
    // Heavy concrete-reinforced pylon
    cyl(0, 0.0, pz, 1.2, 7.5, { ink: BK });
    // T-Crosshead support bracket
    box(0, 7.0, pz, 5.0, 0.8, 1.8, { ink: BL });
  }

  // Monorail Transit Station Platform (Mid Sector, X: -6.5 to -1.5, Z: -12 to 12 at Y=8.0m)
  slab(-7.5, -12, -1.5, 12, 8.0, 0.4, { ink: BL });
  rail(-7.5, -12, -7.5, 12, 8.2, { ink: OR });
  // Platform glass canopy roof
  slab(-8.0, -12, -1.0, 12, 11.2, 0.3, { ink: BL });
  // Canopy support pillars
  cyl(-7.2, 8.2, -8, 0.18, 3.0, { ink: BK });
  cyl(-7.2, 8.2, 0, 0.18, 3.0, { ink: BK });
  cyl(-7.2, 8.2, 8, 0.18, 3.0, { ink: BK });

  // Ticket Kiosks & Fare Gates on Platform
  box(-5.5, 8.2, -6, 1.2, 1.8, 0.8, { ink: BL });
  box(-5.5, 8.2, 6, 1.2, 1.8, 0.8, { ink: BL });

  // Monorail Station Access Stairs from Skybridge Plaza (Y=4.2m to 8.0m)
  // Rise = 3.8m, 15 steps (rise 0.2533m <= 0.28m, run 0.45m, total run 6.75m)
  // Direction '+z', starts at Z=-18.75, lands at Z=-12.0 flush at station platform
  stairs(-4.5, 4.2, -18.75, '+z', 15, 2.2, { rise: 3.8 / 15, run: 0.45, ink: BL });

  // =========================================================================
  // 4. MID-TIER PEDESTRIAN SKYBRIDGE PLAZA (Y=4.2m)
  // =========================================================================
  // Skybridge Concourse linking East and West towers across the street
  // Spans from X=-24 to X=24, Z=-28 to -14 at Y=4.2m
  slab(-24, -28, 24, -14, 4.2, 0.5, { ink: BL });
  rail(-24, -28, 24, -28, 4.4, { ink: BK });
  rail(-24, -14, -7.5, -14, 4.4, { ink: BK });
  rail(-1.5, -14, 24, -14, 4.4, { ink: BK });

  // Central Glass Atrium Skylight (Waist cover prop in middle of Skybridge)
  box(0, 4.4, -21, 6.0, 0.9, 4.0, { ink: OR });

  // Skybridge Access Stairs from Ground (Ground Y=0.0m to Skybridge Y=4.2m)
  // 16 steps, rise = 4.2 / 16 = 0.2625m, run = 0.45m (total run = 7.2m)
  // West Approach Stair: Direction '+z', starts at Z=-6.8, ends at Z=-14.0... wait:
  // Direction '-z', starts at Z=-6.8, lands at Z=-14.0 flush at Skybridge
  stairs(-16, 0.0, -6.8, '-z', 16, 2.4, { rise: 4.2 / 16, run: 0.45, ink: BL });
  // East Approach Stair: Direction '-z', starts at Z=-6.8, lands at Z=-14.0 flush
  stairs(16, 0.0, -6.8, '-z', 16, 2.4, { rise: 4.2 / 16, run: 0.45, ink: BL });

  // =========================================================================
  // 5. WEST LANE: NEON YOKOCHO ALLEY & ROOFTOP MARKET (X=-45 to -22)
  // =========================================================================
  // Ground-level Ramen Bar & Market Stalls (X=-36 to -26, Z=-6 to 18)
  box(-32, 1.4, -2, 6.0, 2.8, 4.0, { ink: OR });
  box(-32, 1.4, 8, 6.0, 2.8, 4.0, { ink: OR });
  // Countertops and bar stools
  box(-28.2, 0.6, -2, 1.2, 1.0, 3.4, { ink: BK });
  box(-28.2, 0.6, 8, 1.2, 1.0, 3.4, { ink: BK });

  // Neon Marquee Signs mounted over stalls
  buildNeonMarquee(B, -28, 3.6, -2, 'RAMEN ラーメン', { ink: OR });
  buildNeonMarquee(B, -28, 3.6, 8, 'CYBERNETICS', { ink: BL });

  // Vending Machine Cluster
  box(-24.5, 1.0, -2, 1.0, 2.0, 1.4, { ink: BL });
  box(-24.5, 1.0, 0, 1.0, 2.0, 1.4, { ink: RD });
  box(-24.5, 1.0, 2, 1.0, 2.0, 1.4, { ink: GR });

  // Streetlight Lantern Posts
  cyl(-22, 2.5, 0, 0.12, 5.0, { ink: BK });
  box(-21.2, 4.8, 0, 1.4, 0.3, 0.5, { ink: OR });
  cyl(-22, 2.5, 20, 0.12, 5.0, { ink: BK });
  box(-21.2, 4.8, 20, 1.4, 0.3, 0.5, { ink: OR });

  // West Rooftop Deck 1: Cyber Cafe Terrace (Y=3.4m, X=-44 to -24, Z=-36 to -22)
  slab(-44, -36, -24, -22, 3.4, 0.5, { ink: BL });
  rail(-44, -36, -24, -36, 3.6, { ink: BK });
  rail(-44, -22, -24, -22, 3.6, { ink: BK });

  // West Rooftop Deck 2: Upper Heli-Pad / Sniper Perch (Y=6.8m, X=-44 to -30, Z=-20 to -6)
  slab(-44, -20, -30, -6, 6.8, 0.5, { ink: BL });
  rail(-44, -20, -30, -20, 7.0, { ink: OR });
  rail(-44, -6, -30, -6, 7.0, { ink: OR });

  // Fire Escape Stairs connecting West Ground (0.0m) to Rooftop Deck 1 (3.4m)
  // 13 steps, rise = 3.4 / 13 = 0.2615m, run = 0.45m (total run = 5.85m)
  // Direction '-z', starts at Z=-16.15, lands at Z=-22.0 flush with Deck 1
  stairs(-26, 0.0, -16.15, '-z', 13, 1.8, { rise: 3.4 / 13, run: 0.45, ink: BK });

  // Industrial Dumpsters and Pallet Stacks along the alley
  buildCrateStack(B, -25, 0.4, 14, 301);
  buildCrateStack(B, -25, 0.4, 20, 302);
  buildToolRack(B, -35, 0.4, 14, 'x');

  // =========================================================================
  // 6. EAST LANE: HVAC SUBSTATION & COOLING TOWERS (X=22 to 45)
  // =========================================================================
  // Substation Electrical Generator Compound (Ground level)
  box(32, 1.8, 6, 8.0, 3.6, 12.0, { ink: BK });
  // High-voltage ceramic insulator bushings on generator roof
  for (let iz = 2; iz <= 10; iz += 3) {
    cyl(30, 3.8, iz, 0.3, 1.4, { ink: BL });
    cyl(34, 3.8, iz, 0.3, 1.4, { ink: BL });
  }

  // East Rooftop Tier 1: HVAC Maintenance Deck (Y=4.2m, X=24 to 44, Z=-36 to -18)
  slab(24, -36, 44, -18, 4.2, 0.5, { ink: BL });
  rail(24, -36, 44, -36, 4.4, { ink: BK });
  rail(44, -36, 44, -18, 4.4, { ink: BK });

  // Huge Industrial HVAC Cooling Cylinders on Deck (Radius 3.2m, Height 3.5m)
  cyl(34, 4.4, -27, 3.2, 3.5, { ink: BK });
  // Protective exhaust rim
  cyl(34, 7.9, -27, 3.5, 0.4, { ink: OR });

  // East Rooftop Tier 2: Water Chiller Reservoir (Y=7.2m, X=30 to 44, Z=-16 to 0)
  slab(30, -16, 44, 0, 7.2, 0.5, { ink: BL });
  rail(30, -16, 44, -16, 7.4, { ink: BK });
  rail(30, 0, 44, 0, 7.4, { ink: BK });

  // Stairs from HVAC Deck (4.2m) to Chiller Reservoir (7.2m)
  // 12 steps, rise = 3.0 / 12 = 0.250m, run = 0.45m (total run = 5.4m)
  // Direction '+z', starts at Z=-21.4, lands at Z=-16.0 flush with Tier 2
  stairs(32, 4.2, -21.4, '+z', 12, 2.0, { rise: 3.0 / 12, run: 0.45, ink: BL });

  // Heavy Coolant Conduit Pipes running along the ground
  cyl(24, 0.5, 6, 0.4, 20.0, { axis: 'z', ink: GR });
  cyl(25, 0.5, 6, 0.4, 20.0, { axis: 'z', ink: GR });

  // Substation Battery Bank & Transformer Vault (x=32, z=26)
  box(32, 1.5, 26, 7.0, 3.0, 10.0, { ink: BK });
  // Elevated Service Catwalk on top of Vault (Y=3.0m, X: 28 to 36, Z: 20 to 32)
  slab(28, 20, 36, 32, 3.0, 0.3, { ink: BL });
  rail(28, 20, 36, 20, 3.2, { ink: OR });
  rail(28, 32, 36, 32, 3.2, { ink: OR });
  rail(36, 20, 36, 32, 3.2, { ink: OR });

  // Catwalk Access Stairs from Ground (12 steps, rise = 3.0/12 = 0.250m, run = 0.45m, total run = 5.4m)
  // Direction '+z', starts at Z=14.6, lands at Z=20.0 flush with catwalk
  stairs(32, 0.0, 14.6, '+z', 12, 1.8, { rise: 3.0 / 12, run: 0.45, ink: BL });

  // Transformer Coils and High-Voltage Equipment
  cyl(30, 3.8, 24, 0.35, 1.4, { ink: BL });
  cyl(34, 3.8, 24, 0.35, 1.4, { ink: BL });
  buildWarningSign(B, 28, 0.1, 14, 'HIGH VOLTAGE 500kV');

  // Overhead Industrial Pipe Bridge spanning from Substation across the street (Y=6.5m)
  cyl(0, 6.5, 10, 0.35, 48.0, { axis: 'x', ink: GR, noCollide: true });
  cyl(0, 7.2, 10, 0.25, 48.0, { axis: 'x', ink: OR, noCollide: true });
  // Support stanchions
  cyl(-18, 3.25, 10, 0.3, 6.5, { ink: BK });
  cyl(18, 3.25, 10, 0.3, 6.5, { ink: BK });

  // =========================================================================
  // 7. HERO STRUCTURE: HOLO-BILLBOARD COMMUNICATIONS TOWER (North, Z=-42)
  // =========================================================================
  // Central Corporate Tower Base (X=-12 to 12, Z=-48 to -36, Y=0 to 14.0m)
  box(0, 6.0, -42, 22.0, 12.0, 10.0, { ink: BK });

  // Observation Gallery Catwalk (Y=12.2m)
  slab(-13, -48, 13, -34, 12.2, 0.4, { ink: BL });
  rail(-13, -34, 13, -34, 12.4, { ink: OR });

  // Monumental Holo-Billboard Frame (Y=12.6m to 18.0m, Width 16m)
  box(0, 15.3, -38, 16.0, 5.0, 0.4, { ink: BL, noCollide: true });
  // Lattice truss framing behind the billboard
  buildTechnicalFraming(B, -8, 12.6, -39, 16, 5.5, 1.2);

  // Communications Antenna Spire (Y=18.0m to 24.0m)
  cyl(0, 18.0, -42, 0.25, 6.0, { ink: BK, noCollide: true });
  ring(0, 24.5, -42, 'y'); // Apex Grapple Ring

  // =========================================================================
  // 8. TACTICAL SPOTS, GRAPPLE RINGS, PICKUPS & LIGHTING
  // =========================================================================
  // Grapple Ring Aerial Transit Network
  ring(0, 12.5, -12, 'y');     // North monorail station pylon ring
  ring(0, 12.5, 12, 'y');      // South monorail station pylon ring
  ring(0, 12.5, 30, 'y');      // South transit plaza ring
  ring(-37, 10.5, -13, 'y');   // West helipad aerial ring
  ring(34, 11.5, -27, 'y');    // East HVAC turbine top ring
  ring(-16, 8.5, -21, 'y');    // West Skybridge approach ring
  ring(16, 8.5, -21, 'y');     // East Skybridge approach ring
  ring(-28, 5.5, 6, 'y');      // Yokocho alley middle ring
  ring(32, 6.0, 6, 'y');       // Substation generator ring
  ring(0, 17.5, -34, 'y');     // Billboard center ring

  // Sniper Vantage Perches
  sniper(0, 12.5, -36);        // Corporate Tower observation catwalk
  sniper(-37, 7.2, -13);       // West rooftop helipad
  sniper(34, 7.5, -10);        // East chiller reservoir roof
  sniper(-4.5, 8.5, 0);        // Monorail platform center

  // Tactical Spawns (3-lane distribution, avoiding direct line-of-sight)
  spawn(0, 0.5, 36);           // South Plaza Depot (Player Start)
  spawn(-28, 0.5, 14);         // West Yokocho Alley
  spawn(32, 0.5, 14);          // East Substation Yard
  spawn(-16, 4.5, -21);        // West Skybridge
  spawn(16, 4.5, -21);         // East Skybridge
  spawn(-4.5, 8.5, 6);         // Monorail Station South
  spawn(-4.5, 8.5, -6);        // Monorail Station North
  spawn(0, 12.5, -36);         // North Tower Catwalk

  // Pickups (Risk-stratified placement)
  pickup(0, 12.5, -36, 'special');  // High-risk corporate tower balcony
  pickup(-4.5, 8.5, 0, 'damage');   // Monorail station center platform
  pickup(0, 4.5, -21, 'speed');     // Skybridge central glass atrium
  pickup(-32, 0.5, 2, 'health');    // Yokocho noodle shop counter
  pickup(32, 7.5, -8, 'shield');    // East chiller reservoir deck
  pickup(0, 0.5, 34, 'health');     // South transit station safe spawn

  // Neon Marquee Displays & Hologram Pylons
  buildHoloPylon(B, -12, 4.4, -18);
  buildHoloPylon(B, 12, 4.4, -18);
  buildNeonMarquee(B, -28, 3.8, -2, { text: 'RAMEN', ink: OR });
  buildNeonMarquee(B, -28, 3.8, 8, { text: 'CYBER', ink: BL });

  // =========================================================================
  // 9. LIVING KINETIC AMBIENT ACTORS (L.animated)
  // =========================================================================
  if (B.scene && B.scene.add && L.animated) {
    // 1. Kinetic Maglev Monorail Shuttle Train (Gliding smoothly along the beam)
    const trainGroup = new THREE.Group();
    // Train Car Chassis (Sits on top of the beam at Y=8.2m)
    const trainBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 2.0, 12.0),
      makeInkMaterial(BL, { wireframe: true })
    );
    trainBody.position.y = 1.0;
    trainGroup.add(trainBody);

    // Glowing front windshield / headlight
    const trainNose = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 1.4, 1.2),
      makeInkMaterial(OR, { wireframe: true })
    );
    trainNose.position.set(0, 1.0, 6.2);
    trainGroup.add(trainNose);

    trainGroup.position.set(0, 8.2, 0);
    B.scene.add(trainGroup);
    L.meshes.push(trainGroup);

    // 2. Spinning Industrial HVAC Turbine Fan Blades (Inside East cooling tower)
    const fanPivot = new THREE.Group();
    fanPivot.position.set(34, 7.6, -27);
    for (let b = 0; b < 4; b++) {
      const blade = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.1, 2.6),
        makeInkMaterial(BK, { wireframe: true })
      );
      blade.rotation.y = (b * Math.PI) / 2;
      fanPivot.add(blade);
    }
    B.scene.add(fanPivot);
    L.meshes.push(fanPivot);

    L.animated.push({
      mesh: trainGroup,
      update: (time) => {
        // Monorail train oscillating smoothly along the track between Z=-30 and Z=+30
        trainGroup.position.z = Math.sin(time * 0.4) * 28.0;

        // HVAC fan blades spinning continuously
        fanPivot.rotation.y = time * 8.0;
      }
    });
  }

  // Futuristic Traffic Sky-Cruisers Overhead
  planes(4, 30, 24, { rStep: 8, hStep: 4, scale: 1.3, speed: 0.16 });

  return finish();
}
