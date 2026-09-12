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

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-25, 0, -37) ===
  box(-25 - 2.5, 0, -37 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, -37 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 - 2.5, 0, -37 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, -37 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-25 - 3.0, -37 - 3.0, -25 + 3.0, -37 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-25, 0 + 5.9, -37 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-25, 0 + 5.9, -37 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-25, 0 + 8.3, -37 + 4.0, 'z');
  pickup(-25, 0 + 6.1, -37 - 1.5);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-25, 0, -19) ===
  box(-25 - 2.5, 0, -19 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, -19 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 - 2.5, 0, -19 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, -19 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-25 - 3.0, -19 - 3.0, -25 + 3.0, -19 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-25, 0 + 5.9, -19 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-25, 0 + 5.9, -19 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-25, 0 + 8.3, -19 + 4.0, 'z');
  pickup(-25, 0 + 6.1, -19 - 1.5);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-25, 0, -1) ===
  box(-25 - 2.5, 0, -1 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, -1 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 - 2.5, 0, -1 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, -1 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-25 - 3.0, -1 - 3.0, -25 + 3.0, -1 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-25, 0 + 5.9, -1 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-25, 0 + 5.9, -1 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-25, 0 + 8.3, -1 + 4.0, 'z');
  pickup(-25, 0 + 6.1, -1 - 1.5);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-25, 0, 17) ===
  box(-25 - 2.5, 0, 17 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, 17 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 - 2.5, 0, 17 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-25 + 2.5, 0, 17 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-25 - 3.0, 17 - 3.0, -25 + 3.0, 17 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-25, 0 + 5.9, 17 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-25, 0 + 5.9, 17 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-25, 0 + 8.3, 17 + 4.0, 'z');
  pickup(-25, 0 + 6.1, 17 - 1.5);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Macro: Suspended Plank Bridge
  box(-31, 0+3, -47, 10, 0.2, 2, { ink: OR }); // Wood plank
  cyl(-31-4.5, 0, -47-0.5, 0.2, 4, { ink: OR }); // Support posts
  cyl(-31+4.5, 0, -47+0.5, 0.2, 4, { ink: OR });

  // Macro: Leviathan Ribcage & Cursed Treasure
  box(1, 0, -47, 12, 0.5, 8, { ink: OR }); // Sand mound
  // Left Ribs
  cyl(1-3, 0+3, -47-2, 0.4, 6, { ink: OR });
  cyl(1-3, 0+3, -47+2, 0.4, 6, { ink: OR });
  // Right Ribs
  cyl(1+3, 0+3, -47-2, 0.4, 6, { ink: OR });
  cyl(1+3, 0+3, -47+2, 0.4, 6, { ink: OR });
  // Top Spines (Connecting Ribs)
  box(1, 0+6, -47-2, 6.6, 0.4, 0.4, { ink: OR });
  box(1, 0+6, -47+2, 6.6, 0.4, 0.4, { ink: OR });
  // The Cursed Treasure
  box(1, 0+0.5, -47, 1.5, 1, 1, { ink: OR }); // Gold Chest
  box(1, 0+1.5, -47, 0.5, 0.5, 0.5, { ink: OR }); // Iron Lock
  ring(1, 0+5, -47, 1.5, { ink: OR }); // Grapple to escape
  box(-4.8423364362219345, 0, -44.02655157351324, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(48.491189223740946, 0, -46.30505694167355, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-29.564643495367026, 0, -25.810658659046844, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-46.885224360516986, 0, 8.7335764003073, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-44.72454995479221, 0, 19.368473297373214, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-24.20116696308026, 0, -49.80441063965242, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(1.6916818716159128, 0, -35.20126943890354, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-9.700754349122164, 0, -31.406743668437198, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(5.65449864196956, 0, 47.581094139876456, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-17.86613720773569, 0, 33.55583644587257, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(27.28600139748586, 0, -11.281815303518599, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(27.844205091069085, 0, 29.454225553091476, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(14.379313640747924, 0, 33.596961142728716, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-19.21170869527281, 0, 40.39061364129806, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-22.99878781304264, 0, -9.872243481169491, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(30.062570873437778, 0, 36.63605548507287, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(20.79396457004073, 0, 30.39870615138679, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(44.94422173529141, 0, -37.99529502737402, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-45.93611077013693, 0, -37.4672327887415, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(13.840449357075443, 0, 45.61435964946449, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-33.57344708744806, 0, 6.159977531245566, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(16.960632886934718, 0, 17.702795869106637, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(46.23399416950406, 0, 36.470337087040534, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(21.7143668782345, 0, 27.245411598721773, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-19.575612418331943, 0, 45.77833333624898, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-9.732382288571102, 0, -28.812170967173472, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-39.1521598482787, 0, -44.061182665559535, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(38.30961413617341, 0, -50.149066712982815, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(12.562842858391292, 0, 28.436326533184612, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-13.326551023939338, 0, 46.005231343609196, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-33.37264420969707, 0, 49.45603945297364, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-19.410677101143392, 0, -7.188107708557602, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(42.79489663193574, 0, 0.28222092548711686, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-16.32338826927645, 0, -29.485798237375306, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-48.60958599888648, 0, 31.745891384995303, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-23.48276068424469, 0, 6.891466042295839, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-9.203357549483897, 0, -36.2015888905966, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-7.702180112682832, 0, 10.784003118707943, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(15.38637391093718, 0, 36.215066274307276, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-16.382712653084383, 0, -40.43425405687582, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-8.018218372962366, 0, -43.11296255256353, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-45.46209435507724, 0, 11.311549571113545, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-18.705635923123147, 0, 13.76648871197743, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-41.50385484014524, 0, -18.868834028797444, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(22.160020806095588, 0, -15.090831751649176, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(20.704023954392397, 0, 48.30319432105469, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-44.226065330539484, 0, 5.596949590816671, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(42.549703584619266, 0, -23.506298904042108, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(44.263035442505, 0, -36.10934764523461, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-14.813454817681183, 0, 24.47733943077536, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-25.279580704877574, 0, 7.446333479132946, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-41.559509358049766, 0, 30.9972202967364, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-49.219506536553105, 0, 3.379806112920228, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-25.04129779533853, 0, -29.853787786992314, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(26.752166377588935, 0, 34.87305861543197, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(25.69714085748612, 0, 12.772528682778812, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-14.825654879711848, 0, -48.78945245555682, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-22.867289092069534, 0, -37.22098744878333, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(12.184921500615957, 0, -1.7143599434982235, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-3.7366396287107904, 0, -37.97088988931344, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-45.5286847953065, 0, 10.98530474344507, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-23.584874236066245, 0, 49.52303354535802, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(32.04655271319868, 0, -34.909420023062594, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(27.123775317840227, 0, -17.488383723723082, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(2.5126048410834727, 0, 33.715757419164504, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-0.23381558514277145, 0, 40.778251657477725, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-34.902634430820825, 0, 3.349793138883335, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-17.55760256277516, 0, -13.879649066340605, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-44.439236004139815, 0, -45.70161931356799, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-20.880831658054788, 0, 48.356873175899906, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  // === END DREAM AUTO-INJECTED PROPS ===
  B.finish();
  return L;
}
