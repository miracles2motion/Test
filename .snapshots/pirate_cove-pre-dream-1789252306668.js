import * as THREE from 'three';
import { INK } from '../render.js';

export function buildPirateCove(B, arena = false) {
  const { L, box, slab, stairs, cyl, ring, spawn, sniper, pickup } = B;
  const OR = INK.ORANGE ?? 3, GR = INK.GREEN ?? 4, BK = INK.BLACK ?? 2, BL = INK.BLUE ?? 0;
  
  L.key = 'pirate_cove';
  const P = arena ? 68 : 55, PH = arena ? 30 : 18, T = 6;
  L.bounds = { minX: -P, maxX: P, minZ: -P, maxZ: P };

  // 1. Foundation & Perimeter Walls
  box(0, -1.0, 0, 2 * P + T, 1.0, 2 * P + T, { ink: BK }); 
  box(0, 0, -P, 2 * P + T, PH, T, { ink: BL });
  box(0, 0, P, 2 * P + T, PH, T, { ink: BL });
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: BL });
  box(P, 0, 0, T, PH, 2 * P + T, { ink: BL });

  // 2. Spawn Bases
  box(-20, 0, -P + 12, 15, 6, 2, { ink: BL }); 
  box(20, 0, -P + 12, 15, 6, 2, { ink: BL }); 
  spawn(-20, 0, -35); spawn(20, 0, -35); 
  
  box(-20, 0, P - 12, 15, 6, 2, { ink: BL }); 
  box(20, 0, P - 12, 15, 6, 2, { ink: BL }); 
  spawn(-20, 0, 35); spawn(20, 0, 35);

  // 3. Central Centerpiece: Suspended Ironclad Drydock
  box(-12, 0, -18, 4, 16, 4, { ink: BL }); 
  box(12, 0, -18, 4, 16, 4, { ink: BL });  
  box(-12, 0, 18, 4, 16, 4, { ink: BL });  
  box(12, 0, 18, 4, 16, 4, { ink: BL });   
  pickup(0, 1, 0); 
  pickup(0, 0, -25); pickup(0, 0, 25); 

  // Tier 2: The Ironclad Hull
  box(0, 6, 0, 16, 2, 32, { ink: BK }); // Top is Y=8
  box(0, 6, -18, 16, 2, 4, { ink: BK }); // Top is Y=8
  
  // Single massive boarding staircase on South
  // Rises 8m over 12.8m. Starts exactly at Z=28.8, ending perfectly flush with Z=16.
  stairs(0, 0, 28.8, '-z', 32, 12, { rise: 0.25, run: 0.4, ink: BK }); // Ends at Y=8
  
  cyl(0, 8, -8, 2.5, 6, { ink: OR }); 
  cyl(0, 8, 8, 2.5, 6, { ink: OR });  
  pickup(0, 8.5, 0); 
  
  box(-6, 8, 0, 2, 1.5, 4, { ink: OR });
  box(6, 8, 0, 2, 1.5, 4, { ink: OR });

  // Tier 3: The Drydock Crane (Top is Y=18)
  box(0, 16, -18, 28, 2, 4, { ink: BL }); 
  box(0, 16, 18, 28, 2, 4, { ink: BL });  
  box(-12, 16, 0, 4, 2, 32, { ink: BL }); 
  box(12, 16, 0, 4, 2, 32, { ink: BL });  
  
  ring(0, 15, -18, 1.5, { ink: OR });
  ring(0, 15, 18, 1.5, { ink: OR });
  ring(0, 15, 0, 1.5, { ink: OR });

  // 4. West Flank (Lane 1: Sniper Alley & High Catwalk)
  slab(-40, -30, -30, 30, 5, 1.0, { ink: BL }); // Top is Y=6
  cyl(-38, 0, -20, 1, 5, { ink: BK });
  cyl(-32, 0, -20, 1, 5, { ink: BK });
  cyl(-38, 0, 20, 1, 5, { ink: BK });
  cyl(-32, 0, 20, 1, 5, { ink: BK });
  
  // Perfectly calculated ramps for Y=6 catwalk at Z=-30 and Z=30
  stairs(-35, 0, -39.6, '+z', 24, 10, { rise: 0.25, run: 0.4, ink: BL }); // Ends at Y=6
  stairs(-35, 0, 39.6, '-z', 24, 10, { rise: 0.25, run: 0.4, ink: BL });
  
  box(-32, 6, -15, 2, 1.5, 4, { ink: OR }); 
  box(-38, 6, 0, 2, 1.5, 4, { ink: OR });
  box(-32, 6, 15, 2, 1.5, 4, { ink: OR });
  
  pickup(-35, 6.5, 0); 
  pickup(-35, 0, -15); pickup(-35, 0, 15);

  // 5. East Flank (Lane 2: The Docks)
  slab(30, -30, 40, 30, 1, 1.0, { ink: BL }); // Top is Y=2
  cyl(32, 0, -20, 1, 1, { ink: BK });
  cyl(38, 0, -20, 1, 1, { ink: BK });
  cyl(32, 0, 20, 1, 1, { ink: BK });
  cyl(38, 0, 20, 1, 1, { ink: BK });
  
  // Perfectly calculated ramps for Y=2 dock
  stairs(35, 0, -33.2, '+z', 8, 10, { rise: 0.25, run: 0.4, ink: BL }); // Ends at Y=2
  stairs(35, 0, 33.2, '-z', 8, 10, { rise: 0.25, run: 0.4, ink: BL });
  
  box(32, 2, -20, 6, 3, 4, { ink: OR });
  box(38, 2, -10, 4, 3, 6, { ink: OR });
  box(32, 2, 0, 6, 3, 6, { ink: OR }); 
  box(38, 2, 10, 4, 3, 6, { ink: OR });
  box(32, 2, 20, 6, 3, 4, { ink: OR });
  
  pickup(35, 2.5, 0); 
  pickup(35, 0, -15); pickup(35, 0, 15);

  // 6. Sniper Nests
  const buildNest = (nx, nz, zDir, xDir) => {
    // Platform is 10x10. min = center - 5, max = center + 5
    slab(nx-5, nz-5, nx+5, nz+5, 11, 1.0, { ink: BL }); // Top is Y=12
    cyl(nx-4, 0, nz-4, 1, 11, { ink: BK });
    cyl(nx+4, 0, nz+4, 1, 11, { ink: BK });
    cyl(nx-4, 0, nz+4, 1, 11, { ink: BK });
    cyl(nx+4, 0, nz-4, 1, 11, { ink: BK });
    
    // Z-axis stairs (40 steps * 0.3 run = 12m). Rise = 0.3 * 40 = 12m.
    const zEdge = zDir === '+z' ? nz - 5 : nz + 5;
    const zStart = zDir === '+z' ? zEdge - 12 : zEdge + 12;
    const xPos = nx > 0 ? nx - 2 : nx + 2; 
    stairs(xPos, 0, zStart, zDir, 40, 6, { rise: 0.3, run: 0.3, ink: BL }); // Ends at Y=12

    // X-axis stairs
    const xEdge = xDir === '+x' ? nx - 5 : nx + 5;
    const xStart = xDir === '+x' ? xEdge - 12 : xEdge + 12;
    const zPos = nz > 0 ? nz - 2 : nz + 2;
    stairs(xStart, 0, zPos, xDir, 40, 6, { rise: 0.3, run: 0.3, ink: BL }); // Ends at Y=12
    
    const snX = nx + (nx < 0 ? 3 : -3);
    const snZ = nz + (nz < 0 ? 3 : -3);
    sniper(snX, 12, snZ);
    
    box(nx + (nx < 0 ? -2 : 2), 12, nz + (nz < 0 ? -2 : 2), 4, 1.2, 4, { ink: OR }); 
    ring(nx, 20, nz, 1.5, { ink: OR });
    pickup(nx, 12.5, nz);
  };

  buildNest(-45, -45, '+z', '+x'); // NW 
  buildNest(45, -45, '+z', '-x');  // NE 
  buildNest(-45, 45, '-z', '+x');  // SW 
  buildNest(45, 45, '-z', '-x');   // SE 

  // 6.5 The Sky-Bridges (Connecting Towers to the Central Roof)
  // Extended X limits to form a perfect L-landing pad with the stairs
  
  // NW Bridge
  slab(-40, -45, -10, -41, 11, 1.0, { ink: BL }); // Top is Y=12
  stairs(-12, 12, -41, '+z', 16, 4, { rise: 0.375, run: 1.375, ink: BL }); // Ends perfectly at Y=18 (Crane roof)
  box(-27, 12, -44, 2, 1.5, 2, { ink: OR }); // Cover shifted North so players can pass easily

  // NE Bridge
  slab(10, -45, 40, -41, 11, 1.0, { ink: BL }); 
  stairs(12, 12, -41, '+z', 16, 4, { rise: 0.375, run: 1.375, ink: BL }); 
  box(27, 12, -44, 2, 1.5, 2, { ink: OR });

  // SW Bridge
  slab(-40, 41, -10, 45, 11, 1.0, { ink: BL }); 
  stairs(-12, 12, 41, '-z', 16, 4, { rise: 0.375, run: 1.375, ink: BL }); 
  box(-27, 12, 44, 2, 1.5, 2, { ink: OR });

  // SE Bridge
  slab(10, 41, 40, 45, 11, 1.0, { ink: BL }); 
  stairs(12, 12, 41, '-z', 16, 4, { rise: 0.375, run: 1.375, ink: BL }); 
  box(27, 12, 44, 2, 1.5, 2, { ink: OR });

  // 7. Grapple Anchors
  ring(-25, 18, -25, 1.5, { ink: OR });
  ring(25, 18, -25, 1.5, { ink: OR });
  ring(-25, 18, 25, 1.5, { ink: OR });
  ring(25, 18, 25, 1.5, { ink: OR });
  
  for (let i = 0; i < 40; i++) {
    box(-20 + Math.random()*40, 0, -30 + Math.random()*60, 1, 1, 1, { ink: BK });
  }

  
  

  
  
  
  // === DREAM AUTO-INJECTED MACRO STRUCTURES ===

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-25, 0, 29) ===
  box(-25 - 2.5, 0, 29 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, 29 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 - 2.5, 0, 29 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, 29 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-25 - 3.0, 29 - 3.0, -25 + 3.0, 29 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-25, 0 + 5.9, 29 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-25, 0 + 5.9, 29 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-25, 0 + 8.3, 29 + 4.0, 'z');
  pickup(-25, 0 + 6.1, 29 - 1.5);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-7, 0, 35) ===
  box(-7 - 2.5, 0, 35 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-7 + 2.5, 0, 35 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-7 - 2.5, 0, 35 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-7 + 2.5, 0, 35 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-7 - 3.0, 35 - 3.0, -7 + 3.0, 35 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-7, 0 + 5.9, 35 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-7, 0 + 5.9, 35 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-7, 0 + 8.3, 35 + 4.0, 'z');
  pickup(-7, 0 + 6.1, 35 - 1.5);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-1, 0, -25) ===
  box(-1 - 2.5, 0, -25 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-1 + 2.5, 0, -25 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-1 - 2.5, 0, -25 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-1 + 2.5, 0, -25 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-1 - 3.0, -25 - 3.0, -1 + 3.0, -25 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-1, 0 + 5.9, -25 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-1, 0 + 5.9, -25 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-1, 0 + 8.3, -25 + 4.0, 'z');
  pickup(-1, 0 + 6.1, -25 - 1.5);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-1, 0, -7) ===
  box(-1 - 2.5, 0, -7 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-1 + 2.5, 0, -7 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-1 - 2.5, 0, -7 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-1 + 2.5, 0, -7 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-1 - 3.0, -7 - 3.0, -1 + 3.0, -7 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-1, 0 + 5.9, -7 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-1, 0 + 5.9, -7 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-1, 0 + 8.3, -7 + 4.0, 'z');
  pickup(-1, 0 + 6.1, -7 - 1.5);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===
  box(9.37829670860313, 0, -5.386622110712452, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-47.77357150322752, 0, 15.561246365408564, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-32.623932908553044, 0, -3.3056628863308077, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(2.765297517958757, 0, 36.872010097202576, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-3.6753289912101295, 0, 41.91172586468555, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-44.73515922116535, 0, -42.817807122733804, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-36.28615571944564, 0, -10.218081329112422, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(48.39395725122996, 0, 46.10532519469075, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-46.21558159190036, 0, 36.93395118902964, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-6.282165295287776, 0, -34.14428017263777, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-24.393459208990656, 0, 38.19218341498167, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-50.431940051685594, 0, 14.243855426932768, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(47.65963552377394, 0, 33.784068294704326, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-23.16467942165292, 0, -12.211738616889761, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(41.63404438665283, 0, -19.763134527243103, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-22.43225013369201, 0, 4.737440714510349, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-18.647627384630077, 0, 2.560427051649519, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(27.377525713019907, 0, 37.60291197382769, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(6.209595667772305, 0, 38.97914881091948, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(27.662674649887165, 0, -47.294774672652146, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(46.501117928477925, 0, 34.076409112574254, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(25.78488225364596, 0, 26.17859137275829, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-2.9771742324174113, 0, -40.623094057610835, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-24.925177965411976, 0, 35.91594680333661, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(46.209102164708554, 0, -13.905344655512728, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(8.372482884099043, 0, 22.360462179545266, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(28.029541845350792, 0, 3.7455247562516902, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(3.854920345821718, 0, -37.76179803578496, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(28.478494137820263, 0, -21.09453287315862, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(24.779732559080585, 0, 5.974928462297548, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(19.932745248191864, 0, -49.12655713026746, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-23.624722851528986, 0, 15.292103213581072, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-21.840323909557107, 0, 38.86391105597974, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(15.532887449634629, 0, -38.43656388179037, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(36.31970489363603, 0, 45.41177295196775, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(46.943908802941266, 0, -8.156228858228978, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-37.25489868217456, 0, 27.06555912179674, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-34.143504478808865, 0, -44.88560331675033, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-29.63359212325786, 0, 8.66488448978464, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-11.389034587172077, 0, -37.71447386161793, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-9.128837945152718, 0, -49.76982785734053, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-32.553505231871256, 0, 41.17832298129794, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-18.740647937698853, 0, -3.5536827827693642, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-18.128170891147022, 0, 2.598094012081461, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(20.583043793470523, 0, 21.910845198578073, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(46.34913689359118, 0, 33.12794200255074, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-19.09694778706647, 0, 29.77543450844199, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(18.7099795098474, 0, -9.907168354415262, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-32.64957904921046, 0, 27.826326482551053, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(33.16832958420338, 0, -40.86780555675568, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(25.00364124384933, 0, 21.38059580007399, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(11.200245938880158, 0, 10.987160992277651, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-47.97379272798661, 0, 17.71476318304242, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-18.87800550160972, 0, -24.088231290814942, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-43.307716620402154, 0, -43.39939400018183, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(17.040957390346833, 0, 32.64507067162863, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(4.051096260496138, 0, -27.66731575422728, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-47.70166380988603, 0, 29.276538024847127, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(9.41701507776591, 0, -36.41263930155126, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(14.402269529748509, 0, 25.142477839232285, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-48.567864960089345, 0, -17.072683392433547, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-30.53904206732809, 0, 17.404360294895625, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-21.40986853851487, 0, -26.662384043232848, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(30.305305303959543, 0, -42.48963161125828, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(13.756969346690198, 0, -6.581952763303981, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(19.29742420119551, 0, -11.583428980859473, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(39.66323367522419, 0, 43.75671622456288, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-41.494759801994455, 0, 6.5629372230619865, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(9.492670416123161, 0, 14.34706958528929, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(47.524427362911254, 0, 0.24451127278662455, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(35.062645369580494, 0, -48.780650073972026, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-0.9938474583905261, 0, 35.89068302373035, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(47.073889859531036, 0, 31.976496578217294, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  // === END DREAM AUTO-INJECTED PROPS ===
  B.finish();
  return L;
}
