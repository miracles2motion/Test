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

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-25, 0, 11) ===
  box(-25 - 2.5, 0, 11 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, 11 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 - 2.5, 0, 11 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, 11 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-25 - 3.0, 11 - 3.0, -25 + 3.0, 11 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-25, 0 + 5.9, 11 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-25, 0 + 5.9, 11 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-25, 0 + 8.3, 11 + 4.0, 'z');
  pickup(-25, 0 + 6.1, 11 - 1.5);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-25, 0, 35) ===
  box(-25 - 2.5, 0, 35 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, 35 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 - 2.5, 0, 35 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, 35 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-25 - 3.0, 35 - 3.0, -25 + 3.0, 35 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-25, 0 + 5.9, 35 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-25, 0 + 5.9, 35 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-25, 0 + 8.3, 35 + 4.0, 'z');
  pickup(-25, 0 + 6.1, 35 - 1.5);

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

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-1, 0, -37) ===
  box(-1 - 2.5, 0, -37 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-1 + 2.5, 0, -37 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-1 - 2.5, 0, -37 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-1 + 2.5, 0, -37 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-1 - 3.0, -37 - 3.0, -1 + 3.0, -37 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-1, 0 + 5.9, -37 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-1, 0 + 5.9, -37 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-1, 0 + 8.3, -37 + 4.0, 'z');
  pickup(-1, 0 + 6.1, -37 - 1.5);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Macro: Suspended Plank Bridge
  box(-15, 0+3, -47, 10, 0.2, 2, { ink: OR }); // Wood plank
  cyl(-15-4.5, 0, -47-0.5, 0.2, 4, { ink: OR }); // Support posts
  cyl(-15+4.5, 0, -47+0.5, 0.2, 4, { ink: OR });

  // Macro: The Captains Quarters (Stern)
  box(17, 0, 33, 10, 3, 10, { ink: OR }); // Lower hull
  stairs(17, 0, 33+6, 2, 3, 2, 0, { ink: OR }); // Ramp into ship
  box(17, 0+3, 33-2, 8, 3, 6, { ink: OR }); // Captains Cabin
  stairs(17-4.5, 0+3, 33+1, 1, 3, 2, 3, { ink: OR }); // Left stairs to poop deck
  stairs(17+4.5, 0+3, 33+1, 1, 3, 2, 1, { ink: OR }); // Right stairs to poop deck
  box(17, 0+6, 33-2, 10, 1, 6, { ink: OR }); // Poop deck roof
  cyl(17, 0+7, 33-2, 0.4, 6, { ink: OR }); // Broken rear mast
  ring(17, 0+13, 33-2, 1.5, { ink: OR }); // Crows nest grapple
  
  box(17.953790348744803, 0, 6.28468637750845, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-17.27456469513516, 0, -36.966645313889785, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(15.62622235339829, 0, -16.21822681695754, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(32.53891742866311, 0, 38.607624887886345, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(4.2754694037735845, 0, 32.02836709569871, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(23.343237083336717, 0, -31.78525302808791, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(18.41690195395212, 0, -11.383691342476304, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-50.14415928756693, 0, 33.119449664761234, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(18.732586761526832, 0, -5.319165103444639, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(43.13103363594287, 0, -21.002418974284524, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-30.257698879902673, 0, -8.941923834772595, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-24.138045061677538, 0, 47.84090223184259, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-12.999573257376866, 0, -28.85681183902895, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-26.436991292218334, 0, -25.37705122472531, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-22.04254477472643, 0, 26.179221768102096, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(6.300759191325753, 0, 30.355056644589695, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(26.711911988882818, 0, 27.1026941497623, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(34.043015505568604, 0, 38.89010475520591, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-30.72845254567777, 0, -7.941599336874582, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-10.554825435728283, 0, 1.056045149266744, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(14.124196765126186, 0, -25.937316215701852, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-42.42726096551827, 0, -2.3605125391451054, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-16.815926179720286, 0, -8.30588889947171, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(13.390020127694925, 0, 5.960138623766781, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-37.579531057731856, 0, 43.86363850815664, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-18.55931087635159, 0, -20.171277773673545, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-39.695685328552266, 0, -23.649331916146828, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-0.5994504615189058, 0, 3.336330407570891, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(15.621186240393854, 0, 21.341158039077285, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(15.322981876496925, 0, 12.410918640428307, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-49.2191037505167, 0, -12.331292329335852, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(25.150262283233673, 0, 10.977897360662482, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(18.06627763539072, 0, 29.199413732928235, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(13.966322729655204, 0, 34.84511097275093, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-16.515993213369185, 0, -30.736546986741047, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(25.186205423808957, 0, -15.15557342469122, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(16.88973959572671, 0, 20.441837833947872, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-50.428816276748854, 0, -1.8040145895381983, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-8.887926187828548, 0, 40.98338358036743, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-46.92381115617178, 0, 19.38232650307104, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(11.506787322289128, 0, 5.3884441673551535, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-19.944195815425182, 0, -17.429822472927356, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-50.188923368179964, 0, 34.24389047152364, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-40.37543116442755, 0, -21.297155217987736, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-20.639480850513735, 0, -48.497940623182004, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(36.06207031865672, 0, 40.47521137154256, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-24.701651050834187, 0, 18.611406361128473, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(23.950768572963426, 0, -33.685934598812324, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(41.91811377317701, 0, -22.28655610995734, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-17.396967170537827, 0, 3.7446577055582964, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(14.635897099031737, 0, 10.859114110775991, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-25.587931315118247, 0, -28.57381384886686, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(5.094749218498272, 0, 33.946970957064494, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(31.611398543332243, 0, -36.09595066039954, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-30.502372469460852, 0, 9.71364818705689, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(17.46800102162331, 0, 48.73203862774717, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-35.592444065059425, 0, 43.22750188453341, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(41.5859645854742, 0, -18.81581567499112, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(9.661832382282114, 0, -0.4079508444686155, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-18.6554930691088, 0, -28.966283809003556, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(15.816390789045172, 0, 47.152005567253525, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-26.747233422041127, 0, -32.908733086921636, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(44.558182161449054, 0, 44.58892373149297, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(6.4341203902944955, 0, 41.1221957611058, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(8.159256590112477, 0, -6.0096102873225945, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  // === END DREAM AUTO-INJECTED PROPS ===
  B.finish();
  return L;
}
