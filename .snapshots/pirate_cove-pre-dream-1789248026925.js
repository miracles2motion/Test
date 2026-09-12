import * as THREE from 'three';
import { INK } from '../render.js';

/**
 * Map: PIRATE COVE (pirate_cove)
 * God Mode Scaffolding — Bounds and tiers synced with concept
 */
export function buildPirateCove(B, arena = false) {
  const { L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = INK.ORANGE ?? 3, GR = INK.GREEN ?? 4, BK = INK.BLACK ?? 2, BL = INK.BLUE ?? 0, RD = INK.RED ?? 1;

  L.key = 'pirate_cove';
  const P = arena ? 68 : 55, PH = arena ? 30 : 18, T = 6;
  const D = P - 3;
  L.bounds = { minX: -P, maxX: P, minZ: -P, maxZ: P };

  // 1. Foundation & Perimeter Walls
  box(0, -1.0, 0, 2 * P + T, 1.0, 2 * P + T, { ink: BL });
  box(0, 0, -P, 2 * P + T, PH, T, { ink: BL });
  box(0, 0, P, 2 * P + T, PH, T, { ink: BL });
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: BL });
  box(P, 0, 0, T, PH, 2 * P + T, { ink: BL });

  // Perimeter Doorways
  const doorFrame = (x, z, alongX) => {
    if (alongX) {
      box(x - 1.4, 0, z, 0.4, 3.4, 0.6, { noCollide: true, ink: BK });
      box(x + 1.4, 0, z, 0.4, 3.4, 0.6, { noCollide: true, ink: BK });
      box(x, 3.2, z, 3.2, 0.4, 0.6, { noCollide: true, ink: BK });
    } else {
      box(x, 0, z - 1.4, 0.6, 3.4, 0.4, { noCollide: true, ink: BK });
      box(x, 0, z + 1.4, 0.6, 3.4, 0.4, { noCollide: true, ink: BK });
      box(x, 3.2, z, 0.6, 0.4, 3.2, { noCollide: true, ink: BK });
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

  // 2. Base Spawns & Vantages
  spawn(0, 0.2, D - 5);
  spawn(0, 0.2, -D + 5);
  spawn(-D + 5, 0.2, 0);
  spawn(D - 5, 0.2, 0);

  sniper(0, 9.3, 12);
  sniper(0, 9.3, -12);
  sniper(-30, 9.2, -D + 3);
  sniper(30, 9.2, D - 3);

  // Pickups
  pickup(0, 4.7, 0);
  pickup(0, 9.3, 0);
  pickup(-25, 3.9, -25);
  pickup(25, 3.9, 25);
  pickup(-14, 0.2, 6);
  pickup(14, 0.2, -6);

  // 3. Central Tier Dais
  box(0, 0, 0, 24, 4.5, 24, { ink: BL });
  slab(-12, -12, 12, 12, 4.5, 0.5, { ink: OR });
  
  // Connect stairs using learned math
  const rs = 0.2857, rn = 0.45;
  const stepCount = Math.ceil(4.5 / rs);
  const stairLength = stepCount * rn;
  stairs(0, 0, -12 - stairLength, '+z', stepCount, 3.2, { rise: rs, run: rn });
  stairs(0, 0, 12 + stairLength, '-z', stepCount, 3.2, { rise: rs, run: rn });

  // Ground collision floor
  collider(0, -2, 0, 100, 2, 100);
  L.playerStart.set(0, 0.2, D - 5); 
  
  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  
  
  

  
  
  
  // === DREAM AUTO-INJECTED MACRO STRUCTURES ===

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-43, 0, 23) ===
  box(-43 - 2.5, 0, 23 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 + 2.5, 0, 23 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 - 2.5, 0, 23 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-43 + 2.5, 0, 23 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-43 - 3.0, 23 - 3.0, -43 + 3.0, 23 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-43, 0 + 5.9, 23 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-43, 0 + 5.9, 23 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-43, 0 + 8.3, 23 + 4.0, 'z');
  pickup(-43, 0 + 6.1, 23 - 1.5);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-31, 0, -43) ===
  box(-31 - 2.5, 0, -43 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-31 + 2.5, 0, -43 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-31 - 2.5, 0, -43 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-31 + 2.5, 0, -43 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-31 - 3.0, -43 - 3.0, -31 + 3.0, -43 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-31, 0 + 5.9, -43 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-31, 0 + 5.9, -43 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-31, 0 + 8.3, -43 + 4.0, 'z');
  pickup(-31, 0 + 6.1, -43 - 1.5);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-19, 0, -19) ===
  box(-19 - 2.5, 0, -19 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-19 + 2.5, 0, -19 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-19 - 2.5, 0, -19 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-19 + 2.5, 0, -19 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-19 - 3.0, -19 - 3.0, -19 + 3.0, -19 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-19, 0 + 5.9, -19 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-19, 0 + 5.9, -19 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-19, 0 + 8.3, -19 + 4.0, 'z');
  pickup(-19, 0 + 6.1, -19 - 1.5);

  // === MACRO STRUCTURE: Cargo Crane Gantry at (-13, 0, -43) ===
  box(-13 - 2.5, 0, -43 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-13 + 2.5, 0, -43 - 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-13 - 2.5, 0, -43 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  box(-13 + 2.5, 0, -43 + 2.5, 0.8, 6.0, 0.8, { ink: BK });
  slab(-13 - 3.0, -43 - 3.0, -13 + 3.0, -43 + 3.0, 0 + 5.5, 0.4, { ink: OR });
  box(-13, 0 + 5.9, -43 - 1.5, 2.5, 1.8, 2.5, { ink: BL });
  box(-13, 0 + 5.9, -43 + 2.5, 0.6, 0.6, 3.0, { ink: BK });
  ring(-13, 0 + 8.3, -43 + 4.0, 'z');
  pickup(-13, 0 + 6.1, -43 - 1.5);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===
  box(-42.169542296574434, 0, -10.59737593797172, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-41.3818369523918, 0, -45.47187557111256, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(11.05888817334332, 0, -18.09078213995278, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(41.28964979464271, 0, 24.716524612788405, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-5.627259859011119, 0, -48.31262793861709, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-2.242532214047955, 0, -21.610546726223653, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-7.235883499676746, 0, -28.51174865669362, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(48.98893344289917, 0, -11.363657341246501, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-41.223168688472974, 0, 48.65634881651846, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(18.62205647946108, 0, 15.265718023812866, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(8.221553077811414, 0, -39.000367604968574, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-6.5872679544140595, 0, 19.629027293711545, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-41.85804080593781, 0, -41.99048345722014, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-46.853554465224484, 0, 5.606635140095655, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-46.63313742002835, 0, -32.78640095358877, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-14.67730715752446, 0, -4.262307822373572, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(20.1713143225236, 0, 13.633814172300319, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(49.85556909063847, 0, 0.4912152775974903, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-19.694538640597344, 0, -5.565653387377566, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(46.39235711859848, 0, 39.079986036728926, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(38.256247263156865, 0, -47.656868671130574, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-18.810595620247213, 0, -21.951539015510285, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-31.53246918995293, 0, -24.694956152681595, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(22.30360256531, 0, 46.378789435520716, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-41.33057584235995, 0, 12.529130593717895, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(20.990144299952107, 0, 40.55800243616517, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-16.402465339897034, 0, -48.929882657928374, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-31.37784341609554, 0, -6.776124081760031, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(39.576261822859706, 0, 9.426770787423166, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(46.75107894647934, 0, 11.377687279094232, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(29.620865040124244, 0, -7.591736979274884, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(36.353034262986256, 0, -46.95147156924524, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-17.67750680296202, 0, -45.05068815769438, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-41.205581181197076, 0, 27.590728539579615, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(4.9337406305380895, 0, 46.990561647087176, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(8.798328840530779, 0, -39.12989861433954, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(4.941194857280195, 0, -43.0808873493747, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(12.923893495463673, 0, 42.79296206537467, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(41.71031346291443, 0, 7.91724693964251, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(1.110239499803967, 0, -49.28273406395296, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-40.81533621004395, 0, 34.405505973962775, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(3.102927299775935, 0, -18.3872889384698, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(19.192841580085016, 0, 42.4000789745743, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(21.046222144481305, 0, -41.584362797182834, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-2.3863321890231717, 0, 40.67841681905391, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(34.70104812255916, 0, -46.673308315581586, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-37.75959349676555, 0, -5.589160863648807, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(-29.726507504960303, 0, 47.82070778953735, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(50.207496551452294, 0, -6.971017852153942, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(23.871314424063286, 0, 3.884238590772206, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  box(16.55789334798405, 0, -5.270381218873624, 1.0, 1.0, 1.0, { ink: OR }); // Pathway Cover
  // === END DREAM AUTO-INJECTED PROPS ===
  B.finish();
  return L;
}
