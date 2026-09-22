import * as THREE from 'three';
import { INK } from '../render.js';
import { choose, rand } from '../util.js';
import { buildHumanoid } from '../enemies.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// ============================ map 3: The Giant Classroom ============================
export function buildClassroom(B, arena = false) {
  const { L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = INK.ORANGE, GR = INK.GREEN, PK = INK.PINK, BK = INK.BLACK, BL = INK.BLUE, RD = INK.RED;
  L.key = 'classroom';
  // Solo player start facing North (-z) towards the green chalkboard
  L.playerStart.set(0, 0.5, 42);
  const P = arena ? 68 : 55, T = 6, PH = arena ? 30 : 18;
  const E = P - 3.8, D = P - 3;
  L.bounds.minX = -P; L.bounds.maxX = P; L.bounds.minZ = -P; L.bounds.maxZ = P;

  // Helper to place oriented cylinders for pens, pencils, lamp neck, telescope
  function orientedCyl(p1, p2, radius, seg = 6, ink = BK) {
    const v1 = p1 instanceof THREE.Vector3 ? p1 : new THREE.Vector3(...p1);
    const v2 = p2 instanceof THREE.Vector3 ? p2 : new THREE.Vector3(...p2);
    const dir = new THREE.Vector3().subVectors(v2, v1);
    const len = dir.length();
    if (len < 0.01) return;
    const g = new THREE.CylinderGeometry(radius, radius, len, seg);
    g.translate(0, len / 2, 0);
    const m = new THREE.Matrix4();
    const up = new THREE.Vector3(0, 1, 0);
    const nDir = dir.clone().normalize();
    const axis = new THREE.Vector3().crossVectors(up, nDir);
    if (axis.lengthSq() > 1e-5) {
      const angle = Math.acos(Math.max(-1, Math.min(1, up.dot(nDir))));
      m.makeRotationAxis(axis.normalize(), angle);
    } else if (up.dot(nDir) < -0.999) {
      m.makeRotationX(Math.PI);
    }
    m.setPosition(v1);
    g.applyMatrix4(m);
    addGeo(g, ink);
    return { dir, len };
  }

  // ---------------- 1. Ground & Perimeter Classroom Enclosure ----------------
  // Hardwood parquet floor foundation
  box(0, -1, 0, 2 * P + T, 1, 2 * P + T, { ink: BL });
  // Parquet plank inlay lines (visual only)
  for (let z = -P + 10; z < P; z += 12) {
    box(0, 0.01, z, 2 * P, 0.02, 0.2, { noCollide: true, ink: BL });
  }
  for (let x = -P + 10; x < P; x += 14) {
    box(x, 0.01, 0, 0.2, 0.02, 2 * P, { noCollide: true, ink: BL });
  }

  // Outer Perimeter Walls
  box(0, 0, -P, 2 * P + T, PH, T, { ink: BK }); // North blackboard wall
  box(0, 0, P, 2 * P + T, PH, T, { ink: BL });  // South door wall
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: BL }); // West window wall
  box(P, 0, 0, T, PH, 2 * P + T, { ink: BL });  // East corkboard wall

  // Wooden wainscoting baseboard trim along all 4 perimeter walls
  box(0, 0, -P + T / 2 + 0.3, 2 * P, 2.0, 0.6, { noCollide: true, ink: OR });
  box(0, 0, P - T / 2 - 0.3, 2 * P, 2.0, 0.6, { noCollide: true, ink: OR });
  box(-P + T / 2 + 0.3, 0, 0, 0.6, 2.0, 2 * P, { noCollide: true, ink: OR });
  box(P - T / 2 - 0.3, 0, 0, 0.6, 2.0, 2 * P, { noCollide: true, ink: OR });

  if (!arena) {
    // Solo anti-camp vertical wall colliders & sky lid
    const NG = { noNav: true, noGrapple: true };
    collider(0, PH, -P, 2 * P + T, 40, T, NG);
    collider(0, PH, P, 2 * P + T, 40, T, NG);
    collider(-P, PH, 0, T, 40, 2 * P + T, NG);
    collider(P, PH, 0, T, 40, 2 * P + T, NG);
    collider(0, 56, 0, 2 * P + 40, 8, 2 * P + 40, NG);

    // Ceiling arch ribs spanning the room
    const R = 92, C = -20;
    for (let k = 0; k < 5; k++) {
      const g = new THREE.TorusGeometry(R, 0.45, 5, 60, Math.PI);
      g.rotateY(k * Math.PI / 5);
      g.translate(0, C, 0);
      addGeo(g, BL);
    }
  }

  // Perimeter Balconies, Radiator Ledges & Window Sills
  // West Window Sills & Cast-Iron Radiators
  box(-E, 5.0, -30, 2.4, 0.4, 8.0, { ink: OR });
  box(-E - 0.5, 0, -30, 1.6, 5.0, 8.0, { ink: BL }); // Radiator unit 1
  ring(-E + 0.5, 8.0, -30, 'y');

  box(-E, 5.0, 10, 2.4, 0.4, 8.0, { ink: OR });
  box(-E - 0.5, 0, 10, 1.6, 5.0, 8.0, { ink: BL });  // Radiator unit 2
  ring(-E + 0.5, 8.0, 10, 'y');

  // East Corkboard Display Shelves
  box(E, 4.0, -25, 2.4, 0.4, 6.0, { ink: OR });
  ring(E - 0.5, 7.5, -25, 'y');
  box(E, 4.0, 15, 2.4, 0.4, 6.0, { ink: OR });
  ring(E - 0.5, 7.5, 15, 'y');
  // East Giant Cork Bulletin Board placed flush on inner wall face
  box(P - 3.1, 2.0, -5, 0.2, 12.0, 70.0, { noCollide: true, ink: OR });

  // South Wall Staging Ledges
  box(-25, 4.0, P - 3.2, 8.0, 0.4, 2.4, { ink: OR });
  box(25, 4.0, P - 3.2, 8.0, 0.4, 2.4, { ink: OR });

  // North High Map Display Rails
  box(-35, 12.0, -P + 3.2, 6.0, 0.4, 2.4, { ink: OR });
  box(35, 12.0, -P + 3.2, 6.0, 0.4, 2.4, { ink: OR });

  // Themed Spawn Portals & Doors
  const doorFrame = (x, z, alongX) => {
    if (alongX) {
      box(x - 1.4, 0, z, 0.35, 3.4, 0.6, { noCollide: true, ink: BK });
      box(x + 1.4, 0, z, 0.35, 3.4, 0.6, { noCollide: true, ink: BK });
      box(x, 3.2, z, 3.1, 0.35, 0.6, { noCollide: true, ink: BK });
    } else {
      box(x, 0, z - 1.4, 0.6, 3.4, 0.35, { noCollide: true, ink: BK });
      box(x, 0, z + 1.4, 0.6, 3.4, 0.35, { noCollide: true, ink: BK });
      box(x, 3.2, z, 0.6, 0.35, 3.1, { noCollide: true, ink: BK });
    }
  };
  for (const [x, z] of [[-D, -20], [-D, 20], [D, -15], [D, 25]]) {
    doorFrame(x, z, false);
    spawn(x + (x < 0 ? 1.8 : -1.8), 0.2, z);
  }
  for (const [x, z] of [[-38, -D], [38, -D], [0, D], [-28, D], [28, D]]) {
    doorFrame(x, z, true);
    spawn(x, 0.2, z + (z < 0 ? 1.8 : -1.8));
  }
  // Floor vent grates for enemy wave spawns
  spawn(-18, 0.2, 0);
  spawn(18, 0.2, 0);

  // ---------------- 2. Sector 1: The Blackboard Stage & Teacher's Sanctuary (North) ----------------
  // Green Slate Blackboard (z = -52, spans x = -45 to 45, y = 0 to 16)
  box(0, 0, -52, 90, 16, 1.2, { ink: BK });      // Dark wood perimeter frame
  box(0, 2.0, -51.4, 86, 13.5, 0.3, { ink: GR }); // Green slate writing surface
  // Chalk erased streaks for depth
  box(-20, 5.0, -51.3, 30, 8.0, 0.1, { noCollide: true, ink: GR });
  box(25, 3.0, -51.3, 25, 9.0, 0.1, { noCollide: true, ink: GR });
  
  box(0, 1.8, -50.6, 88, 0.4, 1.6, { ink: OR, noNav: true });  // Continuous running chalk rail ledge

  // Chalk sticks on the rail
  box(-12, 2.05, -50.6, 2.4, 0.3, 0.3, { noCollide: true, ink: OR });
  box(8, 2.05, -50.6, 2.0, 0.3, 0.3, { noCollide: true, ink: BL });
  box(-24, 2.05, -50.6, 1.8, 0.3, 0.3, { noCollide: true, ink: RD });
  // Felt erasers on the rail
  box(-4, 2.05, -50.6, 3.2, 0.7, 0.9, { ink: BK, noNav: true });
  box(18, 2.05, -50.6, 3.2, 0.7, 0.9, { ink: BK, noNav: true });
  box(-28, 2.05, -50.6, 3.2, 0.7, 0.9, { ink: BK, noNav: true });

  // Doodled chalk formulas, geometry and diagrams on the blackboard
  box(-18, 9.5, -51.2, 5.0, 0.12, 0.05, { noCollide: true, ink: OR }); // E = mc² line
  box(16, 10.5, -51.2, 6.0, 0.12, 0.05, { noCollide: true, ink: OR }); // Pythagorean formula
  box(0, 12.0, -51.2, 3.5, 0.12, 0.05, { noCollide: true, ink: OR });
  // Coordinate axes & quadratic parabola graph
  box(-28, 14.0, -51.2, 0.15, 8.0, 0.05, { noCollide: true, ink: OR }); // y-axis
  box(-28, 14.0, -51.2, 12.0, 0.15, 0.05, { noCollide: true, ink: OR }); // x-axis
  for (let px = -5; px <= 5; px += 1) {
    const py = 11.0 + (px * px) * 0.22;
    box(-28 + px, py, -51.2, 0.9, 0.12, 0.05, { noCollide: true, ink: OR });
  }
  // Circle geometry diagram with inscribed triangle and tangent secant
  {
    const circleGeom = new THREE.RingGeometry(3.0, 3.25, 24);
    circleGeom.translate(6, 15.5, -51.25);
    addGeo(circleGeom, OR);
  }
  box(6, 18.7, -51.2, 8.0, 0.15, 0.05, { noCollide: true, ink: OR }); // Tangent line
  orientedCyl([3.4, 14.0, -51.2], [8.6, 14.0, -51.2], 0.08, 4, OR);   // Inscribed base
  orientedCyl([3.4, 14.0, -51.2], [6.0, 18.5, -51.2], 0.08, 4, OR);   // Left side
  orientedCyl([8.6, 14.0, -51.2], [6.0, 18.5, -51.2], 0.08, 4, OR);   // Right side

  // Stick-figure chalk doodle gunfight in upper corner
  sphere(26, 16.5, -51.2, 0.5, { seg: 6, ink: BL, noCollide: true }); // Head 1
  box(26, 14.5, -51.2, 0.15, 1.6, 0.05, { noCollide: true, ink: BL }); // Body 1
  box(26.8, 14.8, -51.2, 1.4, 0.15, 0.05, { noCollide: true, ink: BL }); // Aiming rifle
  sphere(32, 16.5, -51.2, 0.5, { seg: 6, ink: RD, noCollide: true }); // Head 2
  box(32, 14.5, -51.2, 0.15, 1.6, 0.05, { noCollide: true, ink: RD }); // Body 2
  box(31.2, 14.8, -51.2, 1.4, 0.15, 0.05, { noCollide: true, ink: RD }); // Aiming rifle
  box(29, 14.8, -51.2, 0.6, 0.08, 0.05, { noCollide: true, ink: OR });  // Bullet tracer

  // Upper Blackboard Catwalk at y = 11.0m
  slab(-36, -50.8, 36, -49.2, 11.0, 0.4, { ink: BL });
  rail(-36, -49.2, 36, -49.2, 11.0, { ink: BK });
  // Vertical access ladders on chalkboard frame
  for (let yL = 2.2; yL <= 10.8; yL += 0.8) {
    box(-36.5, yL, -51.0, 1.8, 0.1, 0.2, { noCollide: true, ink: BK });
    box(36.5, yL, -51.0, 1.8, 0.1, 0.2, { noCollide: true, ink: BK });
  }

  // The Teacher's Executive Oak Desk (x: -16 to 16, z: -44 to -28, y = 0 to 8.0m)
  slab(-16, -44, 16, -28, 8.0, 0.6, { ink: OR }); // Solid oak desktop
  // Left 3-drawer pedestal
  box(-12, 0, -36, 8, 7.4, 15, { ink: OR });
  box(-12, 2.0, -28.3, 2.4, 0.3, 0.3, { noCollide: true, ink: BK });
  box(-12, 4.4, -28.3, 2.4, 0.3, 0.3, { noCollide: true, ink: BK });
  box(-12, 6.5, -28.3, 2.4, 0.3, 0.3, { noCollide: true, ink: BK });
  // Right 3-drawer pedestal
  box(12, 0, -36, 8, 7.4, 15, { ink: OR });
  box(12, 2.0, -28.3, 2.4, 0.3, 0.3, { noCollide: true, ink: BK });
  box(12, 4.4, -28.3, 2.4, 0.3, 0.3, { noCollide: true, ink: BK });
  box(12, 6.5, -28.3, 2.4, 0.3, 0.3, { noCollide: true, ink: BK });

  // Teacher's Desk East Flank: 3-tier Oak In/Out Grading Trays
  box(18, 0, -36, 4.2, 0.8, 5.2, { ink: OR });
  box(18, 0.9, -36, 4.2, 0.8, 5.2, { ink: OR });
  box(18, 1.8, -36, 4.2, 0.8, 5.2, { ink: OR });
  slab(16.5, -37.5, 20.2, -34.5, 2.7, 0.08, { ink: BL, noCollide: true }); // Spilled exam papers

  // Teacher's Desk West Flank: Open Leather Briefcase with jump-boost folder
  box(-18, 0, -36, 3.4, 2.2, 4.8, { ink: BK });
  {
    const lid = new THREE.BoxGeometry(3.2, 2.2, 0.3);
    lid.rotateX(-0.4);
    lid.translate(-18, 2.6, -38.2);
    addGeo(lid, BK);
  }
  box(-18, 0.8, -33.5, 2.6, 0.8, 2.6, { ink: RD });

  // Central Vaulted Kneehole Tunnel (x: -8 to 8, z: -44 to -28)
  // Left open with zero colliders from y = 0 to 7.4m: sprint straight through!

  // Teacher's Desk Ascent: Leaning Yellow Meter Stick Ramp from open central aisle to oak desktop (rise = 0.2857m for smooth sprint)
  stairs(14.0, 0, -15.4, '-z', 28, 2.4, { rise: 8.0 / 28, run: 0.45, ink: OR });
  slab(12.8, -32.0, 15.2, -28.0, 8.0, 0.6, { ink: OR }); // Top landing connecting onto oak desktop
  // Meter stick markings
  for (let i = 0; i < 28; i += 2) {
    const sy = i * (8.0 / 28), sz = -15.4 - i * 0.45;
    box(15.3, sy + 0.1, sz, 0.1, 0.3, 0.3, { noCollide: true, ink: BK });
  }

  // Teacher's Desk Props:
  // The Teacher's Red Apple (spherical cover with solid collider & red ink)
  sphere(0, 9.3, -34, 1.3, { seg: 12, ink: RD });
  collider(0, 8.0, -34, 2.6, 2.6, 2.6);
  box(0, 10.6, -34, 0.15, 0.7, 0.15, { noCollide: true, ink: GR }); // Stem

  // Brass Call Bell with grapple ring
  cyl(-10, 8.0, -32, 1.6, 1.4, { seg: 12, ink: OR });
  ring(-10, 10.0, -32, 'y');

  // Ceramic Pencil Cup & Writing Instruments
  cyl(10, 8.0, -32, 1.8, 2.8, { seg: 12, ink: BL });
  orientedCyl([10, 8.0, -32], [12, 14.5, -34], 0.42, 6, RD); // Red grading biro
  orientedCyl([10, 8.0, -32], [8, 14.0, -30], 0.38, 6, OR);  // Yellow pencil

  // Graded Test Papers stack
  box(-4, 8.0, -38, 7.0, 1.2, 5.0, { ink: BL });
  box(-4, 9.22, -38, 1.8, 0.05, 1.8, { noCollide: true, ink: RD }); // A+ 100%

  // Vintage Gooseneck Lamp (Sniper Tower)
  cyl(13, 8.0, -41, 1.8, 0.6, { seg: 10, ink: BK });
  orientedCyl([13, 8.6, -41], [11, 14.0, -39], 0.35, 6, OR);
  orientedCyl([11, 14.0, -39], [10, 18.2, -38], 0.35, 6, OR);
  cyl(10, 17.5, -38, 2.6, 2.0, { seg: 10, ink: GR }); // Green enamel shade
  ring(10, 19.8, -38, 'y'); // High sniper ring
  
  // Lamp Spot Light shining on the Teacher's Desk
  const lampLight = new THREE.PointLight(0xfff5cc, 2.5, 60);
  lampLight.position.set(10, 15.0, -38);
  scene.add(lampLight);

  // ---------------- 3. Sector 2: The Student Desk Archipelago (West) ----------------
  // 4 Student Desks: Desk 1 (-28, -18), Desk 2 (-28, 14), Desk 3 (-10, -18), Desk 4 (-10, 14)
  const desks = [
    [-28, -18, OR], // Desk 1 - Orange
    [-28, 14, PK],  // Desk 2 - Pink
    [-10, -18, GR], // Desk 3 - Green
    [-10, 14, OR]   // Desk 4 - Orange
  ];

  for (const [dx, dz, deskInk] of desks) {
    // Solid Formica Desktop at y = 7.0m
    slab(dx - 9, dz - 6, dx + 9, dz + 6, 7.0, 0.5, { ink: deskInk });
    // 4 Tubular Steel Legs
    cyl(dx - 8, 0, dz - 5, 0.6, 6.5, { seg: 8, ink: BL });
    cyl(dx + 8, 0, dz - 5, 0.6, 6.5, { seg: 8, ink: BL });
    cyl(dx - 8, 0, dz + 5, 0.6, 6.5, { seg: 8, ink: BL });
    cyl(dx + 8, 0, dz + 5, 0.6, 6.5, { seg: 8, ink: BL });
    // Under-Desk Wire Storage Basket at y = 4.0m (Accessible floor tier!)
    box(dx, 4.0, dz, 16.0, 0.25, 10.0, { ink: BK });
    // Attached Plywood School Chair
    slab(dx - 4, dz + 7, dx + 4, dz + 12, 3.6, 0.35, { ink: OR }); // Chair seat
    box(dx, 3.6, dz + 12, 8.0, 2.4, 0.35, { ink: OR });            // Chair backrest
    // Chair legs
    cyl(dx - 3.5, 0, dz + 8, 0.4, 3.25, { seg: 6, ink: BL });
    cyl(dx + 3.5, 0, dz + 8, 0.4, 3.25, { seg: 6, ink: BL });
    cyl(dx - 3.5, 0, dz + 11.5, 0.4, 3.25, { seg: 6, ink: BL });
    cyl(dx + 3.5, 0, dz + 11.5, 0.4, 3.25, { seg: 6, ink: BL });
  }

  // Stationery Bridges Between Student Desks
  // 1. 30cm Set-Square Triangle Bridge (Desk 1 -> Desk 3 at y = 7.0m)
  slab(-19, -20, -15, -14, 7.0, 0.35, { ink: OR });
  // 2. Giant Yellow Wooden Ruler Bridge (Desk 1 -> Desk 2, spanning z = -12 to 8 at y = 7.0m)
  slab(-30, -12, -26, 8, 7.0, 0.4, { ink: OR });
  rail(-30, -12, -30, 8, 7.0, { ink: BK });
  rail(-26, -12, -26, 8, 7.0, { ink: BK });
  // Bridge Cover: Standing Binder Clip midway
  box(-28.5, 7.0, -2, 2.6, 2.8, 1.6, { ink: BK }); // Binder clip body
  orientedCyl([-29.2, 9.8, -2], [-27.8, 9.8, -2], 0.15, 6, BL); // Clip wire
  // Ruler Centimeter Ticks
  for (let rz = -11; rz <= 7; rz += 2) {
    box(-28, 7.02, rz, 3.6, 0.02, 0.1, { noCollide: true, ink: BK });
  }
  ring(-28, 5.2, -2, 'y'); // Central under-ruler grapple ring

  // 3. Wire Spiral Notebook Bridge between Desk 3 and Desk 4
  slab(-12, -12, -8, 8, 7.0, 0.35, { ink: BK });

  // 4. Under-Desk Wire Basket Stealth Rat-Run (y = 4.0m sheltered flank corridors)
  // Desk 1 to Desk 2 under-desk wire bridge
  slab(-29.5, -12, -26.5, 8, 4.0, 0.25, { ink: BK });
  orientedCyl([-28, 4.0, -2], [-28, 7.0, -2], 0.08, 4, BK);
  // Desk 3 to Desk 4 under-desk wire bridge
  slab(-11.5, -12, -8.5, 8, 4.0, 0.25, { ink: BK });
  orientedCyl([-10, 4.0, -2], [-10, 7.0, -2], 0.08, 4, BK);
  // Chair-to-basket transition ramps (y = 3.6m chair to y = 4.0m basket)
  slab(-29, -12.5, -27, -11.0, 3.8, 0.15, { ink: OR });
  slab(-11, -12.5, -9, -11.0, 3.8, 0.15, { ink: OR });
  slab(-29, 19.0, -27, 20.5, 3.8, 0.15, { ink: OR });
  slab(-11, 19.0, -9, 20.5, 3.8, 0.15, { ink: OR });
  // Under-desk grapple anchor rings
  ring(-28, 4.6, -2, 'y');
  ring(-10, 4.6, -2, 'y');

  // Ground-to-Desk Ascent Ramps & Stairs:
  // Open "Advanced Physics" Hardcover Textbook Ramp beside Desk 2 (rise = 0.28m) - arriving at z = 14.25
  stairs(-39, 0, 3, '+z', 25, 3.2, { rise: 7.0 / 25, run: 0.45, ink: BL });
  slab(-40.5, 14.25, -37.0, 18.25, 7.0, 0.4, { ink: BL }); // Top landing transition to Desk 2

  // Stack of 3 Hardcover Textbooks beside Desk 1 (Algebra, Biology, History) forming natural stairs
  box(-21, 0, -18, 3.6, 1.3, 4.8, { ink: BL });
  box(-22, 1.3, -18, 3.4, 1.3, 4.6, { ink: GR });
  box(-23, 2.6, -18, 3.2, 1.2, 4.4, { ink: RD });

  // Slumped Canvas Student Backpack with shoulder strap ramp east of Desk 4 up to chair seat (y = 3.6m)
  box(0, 0, 21, 3.2, 2.4, 2.6, { ink: RD });
  stairs(0, 0, 16.0, '+z', 14, 1.4, { rise: 3.6 / 14, run: 0.36, ink: BK });

  // Geometry Drafting Compass A-Frame (sprint underneath or grapple apex)
  orientedCyl([-20.2, 0, -3], [-18, 5.2, -3], 0.28, 6, BL); // Steel needle leg
  orientedCyl([-15.8, 0, -3], [-18, 5.2, -3], 0.32, 6, OR); // Graphite pencil leg
  box(-18, 2.8, -3, 3.2, 0.3, 0.3, { ink: OR });            // Thumbwheel bar
  cyl(-18, 2.8, -3, 0.65, 0.3, { seg: 10, ink: OR });         // Knurled thumbwheel
  cyl(-18, 5.2, -3, 0.6, 0.8, { seg: 10, ink: BL });           // Hinge bolt
  ring(-18, 6.6, -3, 'y');                                    // Apex grapple ring

  // Curled Yellow Sticky-Note Pad (Post-It Vault Ramp) north-west of Desk 4 (outside under-desk wire corridor)
  box(-16, 0, 2, 4.4, 1.2, 4.4, { ink: OR });
  stairs(-16, 1.2, 0.2, '+z', 4, 3.8, { rise: 0.25, run: 0.8, ink: OR });

  // Desk Props:
  // Metal Hand-Cranked Pencil Sharpener (Desk 1)
  box(-26, 7.0, -22, 2.4, 3.2, 2.0, { ink: BK });
  ring(-26, 10.8, -22, 'x'); // Crank grapple point

  // Metal Domed Lunchbox & Thermos (Desk 2)
  box(-28, 7.0, 12, 4.2, 2.6, 2.8, { ink: BL });
  cyl(-31, 7.0, 12, 0.9, 3.5, { seg: 10, ink: RD }); // Thermos bottle
  cyl(-24, 7.0, 18, 0.6, 0.8, { seg: 8, ink: RD });  // Red plastic pushpin micro-cover

  // Open Tin Pencil Case with angled shield lid (Desk 3)
  box(-8, 7.0, -16, 3.4, 0.8, 4.8, { ink: BK });
  {
    const lid = new THREE.BoxGeometry(3.4, 2.6, 0.2);
    lid.rotateX(-0.5);
    lid.translate(-8, 8.2, -18.2);
    addGeo(lid, BK);
    collider(-8, 7.0, -18.2, 3.4, 2.6, 1.2);
  }
  orientedCyl([-14, 7.05, -22], [-14, 7.05, -18], 0.16, 4, BL); // Bent steel paperclip micro-cover

  // ---------------- 4. Sector 3: Science Lab & Grand Library Bookshelf (East) ----------------
  // Grand Library Bookshelf (x = 34 to 48, z = -20 to 24)
  slab(34, -20, 48, 24, 4.0, 0.5, { ink: OR });  // Shelf 1
  slab(34, -20, 48, 24, 8.0, 0.5, { ink: OR });  // Shelf 2
  slab(34, -20, 48, 24, 12.0, 0.5, { ink: OR }); // Shelf 3
  slab(34, -20, 48, 24, 16.0, 0.5, { ink: OR }); // Crown Roof Deck

  // Vertical structural partition panels
  box(41, 0, -20, 14, 16, 0.8, { ink: OR }); // North gable
  box(41, 0, 2, 14, 16, 0.8, { ink: OR });   // Center partition
  box(41, 0, 24, 14, 16, 0.8, { ink: OR });  // South gable

  // Colorful Bookshelves Content (giant encyclopedias with walk-through firing tunnels)
  const bookColors = [BL, GR, RD, OR];
  for (let sY of [0, 4.0, 8.0, 12.0]) {
    for (let bZ of [-16, -10, -4, 6, 12, 18]) {
      const c = bookColors[Math.abs(Math.floor(bZ * 7 + sY)) % bookColors.length];
      box(41, sY + 0.5, bZ, 12, 3.0, 4.0, { ink: c });
    }
  }

  // Exterior Staggered Switchback Stairs (x = 24.0 to 36.0, seamlessly linked to every shelf)
  // Two dedicated non-overlapping lanes with generous 4.6m side clearance to rails and 7m turnaround landings
  // Flight 1: 0 -> 4.0m (+z Southbound, inside lane x = 32.8)
  stairs(32.8, 0, -14.0, '+z', 14, 2.0, { rise: 4.0 / 14, run: 0.45, ink: OR });
  slab(24.0, -7.7, 36.0, -0.7, 4.0, 0.4, { ink: OR }); // Landing 1 (connects Flight 1 -> Flight 2 & Shelf 1)
  rail(24.0, -7.7, 24.0, -0.7, 4.0, { ink: BK });
  rail(24.0, -7.7, 28.5, -7.7, 4.0, { ink: BK });
  rail(24.0, -0.7, 34.0, -0.7, 4.0, { ink: BK });

  // Flight 2: 4.0 -> 8.0m (-z Northbound, outside lane x = 29.6)
  stairs(29.6, 4.0, -7.7, '-z', 14, 2.0, { rise: 4.0 / 14, run: 0.45, ink: OR });
  slab(24.0, -21.0, 36.0, -14.0, 8.0, 0.4, { ink: OR }); // Landing 2 (connects Flight 2 -> Flight 3 & Shelf 2)
  rail(24.0, -21.0, 24.0, -14.0, 8.0, { ink: BK });
  rail(24.0, -14.0, 28.5, -14.0, 8.0, { ink: BK });
  rail(24.0, -21.0, 34.0, -21.0, 8.0, { ink: BK });

  // Flight 3: 8.0 -> 12.0m (+z Southbound, inside lane x = 32.8)
  stairs(32.8, 8.0, -14.0, '+z', 14, 2.0, { rise: 4.0 / 14, run: 0.45, ink: OR });
  slab(24.0, -7.7, 36.0, -0.7, 12.0, 0.4, { ink: OR }); // Landing 3 (connects Flight 3 -> Flight 4 & Shelf 3)
  rail(24.0, -7.7, 24.0, -0.7, 12.0, { ink: BK });
  rail(24.0, -7.7, 28.5, -7.7, 12.0, { ink: BK });
  rail(24.0, -0.7, 34.0, -0.7, 12.0, { ink: BK });

  // Flight 4: 12.0 -> 16.0m (-z Northbound to Crown Deck, outside lane x = 29.6)
  stairs(29.6, 12.0, -7.7, '-z', 14, 2.0, { rise: 4.0 / 14, run: 0.45, ink: OR });
  slab(24.0, -21.0, 36.0, -14.0, 16.0, 0.4, { ink: OR }); // Landing 4 (connects Flight 4 -> Crown Deck)
  rail(24.0, -21.0, 24.0, -14.0, 16.0, { ink: BK });
  rail(24.0, -14.0, 28.5, -14.0, 16.0, { ink: BK });
  rail(24.0, -21.0, 34.0, -21.0, 16.0, { ink: BK });
  ring(41, 18.0, 2, 'y'); // Crown Deck central grapple ring

  // Science Lab Chemistry Counter (x: 22 to 44, z: -42 to -26, y = 7.0m)
  slab(22, -42, 44, -26, 7.0, 0.6, { ink: BK }); // Black epoxy resin counter
  // Stainless sink basin
  box(29, 4.0, -35, 6.0, 3.0, 6.0, { ink: BL });
  // Gooseneck faucet curving to y = 15.0m
  cyl(29, 7.0, -40, 0.45, 6.0, { ink: BL });
  orientedCyl([29, 13.0, -40], [29, 15.0, -37], 0.45, 6, BL);
  ring(29, 15.2, -37, 'y'); // Faucet nozzle sniper ring

  // Giant Erlenmeyer Flask with green fluid fill
  cyl(36, 7.0, -34, 3.2, 4.0, { seg: 10, ink: BL });
  cyl(36, 7.0, -34, 3.0, 2.8, { seg: 10, ink: GR }); // Fluid
  cyl(36, 11.0, -34, 1.2, 3.0, { seg: 10, ink: BL }); // Neck

  // Bunsen Burner & Gas Hose
  cyl(40, 7.0, -30, 1.8, 0.8, { seg: 10, ink: BK });
  cyl(40, 7.8, -30, 0.5, 3.5, { seg: 8, ink: OR });
  // Bunsen Burner Flame Doodle (blue inner cone, orange outer flame)
  {
    const flameOuter = new THREE.ConeGeometry(0.7, 2.2, 8);
    flameOuter.translate(40, 12.4, -30);
    addGeo(flameOuter, OR);
    const flameInner = new THREE.ConeGeometry(0.38, 1.3, 8);
    flameInner.translate(40, 11.9, -30);
    addGeo(flameInner, BL);
  }

  // Wooden Test Tube Rack with 4 colorful chemical solutions
  box(32, 7.0, -28, 4.4, 0.3, 1.3, { ink: OR });
  box(32, 8.4, -28, 4.4, 0.25, 1.3, { ink: OR });
  box(29.9, 7.0, -28, 0.25, 1.6, 1.3, { ink: OR });
  box(34.1, 7.0, -28, 0.25, 1.6, 1.3, { ink: OR });
  cyl(30.6, 7.3, -28, 0.25, 2.0, { seg: 8, ink: RD }); // Red solution
  cyl(31.5, 7.3, -28, 0.25, 2.0, { seg: 8, ink: GR }); // Green solution
  cyl(32.5, 7.3, -28, 0.25, 2.0, { seg: 8, ink: BL }); // Blue solution
  cyl(33.4, 7.3, -28, 0.25, 2.0, { seg: 8, ink: OR }); // Amber solution

  // Reagent Dropper Bottle with red suction bulb
  cyl(35, 7.0, -28, 0.8, 2.0, { seg: 8, ink: BK });
  sphere(35, 9.2, -28, 0.6, { seg: 8, ink: RD });

  // Compound Monocular Microscope (Sniper Tower)
  box(24, 7.0, -28, 4.5, 1.2, 4.5, { ink: BK }); // Horseshoe base
  cyl(24, 8.2, -28, 0.7, 4.0, { seg: 8, ink: BK });
  box(24, 12.0, -28, 4.0, 0.4, 4.0, { ink: BK }); // Specimen stage
  orientedCyl([24, 12.4, -28], [24, 21.0, -28], 0.9, 8, BK); // Body tube
  cyl(24, 20.5, -28, 1.4, 0.8, { seg: 10, ink: OR }); // Eyepiece rim
  ring(24, 22.0, -28, 'y'); // Microscope eyepiece grapple ring

  // ---------------- 5. Sector 4: Back of Class, Lockers & Double Doors (South) ----------------
  // Double Entrance Doors at (0, 0, 52)
  box(0, 0, 52, 14.0, 10.0, 1.2, { ink: OR });
  box(0, 4.0, 52.4, 11.0, 4.5, 0.2, { noCollide: true, ink: BL }); // Frosted glass
  box(0, 3.6, 51.5, 12.0, 0.4, 0.5, { ink: OR }); // Brass push-bar
  ring(0, 11.5, 50.8, 'y'); // Broken transom window grapple ring

  // Bank of Metal Student Lockers (x = 12 to 44, z = 44 to 48, Height 12.0m)
  box(28, 0, 46, 32.0, 12.0, 4.0, { ink: GR });
  // Top of lockers catwalk
  slab(12, 44, 44, 48, 12.0, 0.4, { ink: GR });
  // Red dodgeball cover on top
  sphere(20, 13.5, 46, 1.5, { seg: 12, ink: RD });
  collider(20, 12.0, 46, 3.0, 3.0, 3.0);
  // 3 Open Locker doors swinging into the room
  for (const lx of [18, 28, 38]) {
    box(lx, 0, 43, 0.3, 11.5, 3.0, { ink: BL });
    box(lx, 3.8, 44.5, 1.8, 0.3, 2.0, { ink: GR }); // Interior shelf
  }

  // Wooden Backpack Cubbies (x = -44 to -12, z = 44 to 48, Height 8.0m)
  box(-28, 0, 46, 32.0, 8.0, 4.0, { ink: OR });
  slab(-44, 44, -12, 48, 8.0, 0.4, { ink: OR }); // Top deck
  // Giant Canvas Backpacks
  box(-18, 2.5, 45, 4.5, 5.0, 3.2, { ink: RD }); // Red backpack
  box(-32, 2.5, 45, 4.5, 5.0, 3.2, { ink: BL }); // Blue backpack
  ring(-18, 8.5, 45, 'z');
  ring(-32, 8.5, 45, 'z');

  // Giant Wall Clock at (0, 22.0, 51.0)
  {
    const bezel = new THREE.CylinderGeometry(5.0, 5.0, 0.6, 24);
    bezel.rotateX(Math.PI / 2);
    bezel.translate(0, 22.0, 51.0);
    addGeo(bezel, BK);
  }
  box(1.8, 22.0, 50.4, 3.6, 0.3, 0.1, { noCollide: true, ink: BK }); // Hour hand
  box(0, 24.2, 50.4, 0.25, 4.4, 0.1, { noCollide: true, ink: BK }); // Minute hand
  ring(0, 26.5, 49.6, 'y'); // Minute hand tip ring
  slab(-2.5, 50.2, 2.5, 51.6, 27.0, 0.4, { ink: BK }); // Clock top sniper perch ledge

  // Animated Swinging Brass Clock Pendulum with dynamic aerial grapple point
  {
    const pendulumGroup = new THREE.Group();
    pendulumGroup.position.set(0, 18.0, 50.4);
    // Brass shaft
    const rodGeom = new THREE.CylinderGeometry(0.18, 0.18, 9.0, 8);
    rodGeom.translate(0, -4.5, 0);
    const rodMesh = new THREE.Mesh(rodGeom, makeInkMaterial({ ink: OR }));
    pendulumGroup.add(rodMesh);
    // Heavy brass disc bob
    const bobGeom = new THREE.CylinderGeometry(1.9, 1.9, 0.4, 16);
    bobGeom.rotateX(Math.PI / 2);
    bobGeom.translate(0, -9.0, 0);
    const bobMesh = new THREE.Mesh(bobGeom, makeInkMaterial({ ink: OR }));
    pendulumGroup.add(bobMesh);
    // Bob ring cut
    const bobRingGeom = new THREE.TorusGeometry(0.7, 0.14, 6, 16);
    bobRingGeom.translate(0, -9.0, 0);
    const bobRingMesh = new THREE.Mesh(bobRingGeom, makeInkMaterial({ ink: BK }));
    pendulumGroup.add(bobRingMesh);

    scene.add(pendulumGroup);
    L.meshes.push(pendulumGroup);

    // Mover object tracking the bob in world coordinates for dynamic grappling
    const bobMoverObj = new THREE.Object3D();
    bobMoverObj.position.set(0, 9.0, 50.4);
    scene.add(bobMoverObj);
    L.meshes.push(bobMoverObj);
    L.grappleMovers.push({ mesh: bobMoverObj, radius: 2.5 });

    L.animated.push({
      mesh: pendulumGroup,
      update: (t) => {
        const ang = Math.sin(t * 1.5) * 0.38;
        pendulumGroup.rotation.z = -ang;
        const bx = Math.sin(ang) * 9.0;
        const by = 18.0 - Math.cos(ang) * 9.0;
        bobMoverObj.position.set(bx, by, 50.4);
      }
    });
  }

  // ---------------- 6. Central Plaza: Crashed Paper Plane, Stapler & Cover Pods ----------------
  if (!arena) {
    // Central Plaza Floor Cover: Crumpled Paper & Dropped Erasers
    sphere(-12, 1.4, 5, 1.8, { seg: 6, ink: BL }); // Crumpled blue-ruled paper
    sphere(-16, 1.0, 18, 1.4, { seg: 5, ink: BL });
    sphere(22, 1.5, 0, 2.0, { seg: 6, ink: BL });
    box(14, 0, 10, 3, 1.2, 1.6, { ink: PK }); // Pink eraser barricade
    box(-5, 0, 28, 1.8, 1.0, 2.8, { ink: PK }); // Pink eraser barricade

    // The Crashed Giant Delta-Wing Paper Airplane at (2, 0, 8)
    // Sloped wing forming a natural ramp from y = 0 to 4.2m with rise = 0.28m
    stairs(2, 0, 2, '+z', 15, 4.0, { rise: 4.2 / 15, run: 0.45, ink: BL });
    box(2, 2.0, 11, 0.4, 3.5, 4.0, { ink: BL }); // Tail fin

    // Heavy-Duty Metal Desk Stapler Bunker in open Central Plaza at (8, 0, 22)
    box(8, 0, 22, 10.0, 0.8, 3.4, { ink: BK }); // Base
    {
      const arm = new THREE.BoxGeometry(9.0, 1.4, 3.0);
      arm.rotateZ(-0.25);
      arm.translate(7.5, 2.8, 22);
      addGeo(arm, BL);
      collider(7.5, 1.0, 22, 9.0, 2.2, 3.0);
    }
    // Chrome anvil head
    box(12, 2.6, 22, 2.4, 1.8, 3.0, { ink: BK });
    ring(8, 4.8, 22, 'x');

    // Giant Pink Bevelled Wedge Eraser at (8, 0, -6)
    box(8, 0, -6, 6.0, 2.2, 3.4, { ink: PK });

    // Stack of 3 Ring-Binder Notebooks in wide central cross-hallway at (-6, 0, 1)
    box(-6, 0.0, 1, 5.0, 0.9, 5.0, { ink: BL });
    box(-6.2, 0.9, 1.2, 4.8, 0.9, 4.8, { ink: RD });
    box(-5.8, 1.8, 0.8, 4.8, 0.9, 4.8, { ink: GR });

    // Heavy Green Scotch Tape Dispenser at (12, 0, 10)
    box(12, 0, 10, 4.0, 2.2, 7.5, { ink: GR });
    cyl(12, 2.2, 8.5, 2.2, 1.8, { seg: 14, ink: BL }); // Clear tape spool roll
    box(12, 2.2, 13.5, 3.8, 0.4, 0.6, { ink: BK });  // Serrated metal cutter blade
    slab(10.8, 8.8, 13.2, 13.5, 2.5, 0.06, { ink: BL, noCollide: true }); // Stretched adhesive strip

    // Overturned Metal Pencil Tin with spilled biros at (6, 0, -10)
    {
      const tinGeom = new THREE.CylinderGeometry(1.4, 1.4, 4.8, 12);
      tinGeom.rotateZ(Math.PI / 2);
      tinGeom.translate(6, 1.4, -10);
      addGeo(tinGeom, BL);
    }
    collider(6, 0, -10, 5.0, 2.8, 3.0);
    orientedCyl([7.5, 0.3, -10], [11.0, 0.3, -8.0], 0.22, 6, RD);
    orientedCyl([7.5, 0.3, -10.5], [10.5, 0.3, -12.5], 0.22, 6, BL);
    orientedCyl([7.0, 0.3, -11.5], [9.2, 0.3, -14.5], 0.22, 6, GR);

    // Standing Clear Plastic Protractor at (6, 0, 4)
    box(6, 0, 4, 6.0, 0.4, 0.6, { ink: BL });
    {
      const protractorArc = new THREE.TorusGeometry(3.0, 0.22, 4, 16, Math.PI);
      protractorArc.translate(6, 0.4, 4);
      addGeo(protractorArc, BL);
    }
    collider(6, 0, 4, 6.0, 3.2, 1.0);
    ring(6, 3.8, 4, 'z'); // Center crosshair origin hole ring

    // Giant Wire Wastepaper Basket & Crumpled Paper Balls in Southeast Corner at (44, 0, 34)
    cyl(44, 0, 34, 4.5, 0.4, { seg: 16, ink: BK }); // Solid base plate
    for (let a = 0; a < 8; a++) {
      const ang = a * Math.PI / 4;
      cyl(44 + Math.cos(ang) * 4.4, 0.4, 34 + Math.sin(ang) * 4.4, 0.12, 7.6, { seg: 4, ink: BK });
    }
    {
      const rimGeom = new THREE.TorusGeometry(4.5, 0.25, 5, 20);
      rimGeom.rotateX(Math.PI / 2);
      rimGeom.translate(44, 8.0, 34);
      addGeo(rimGeom, BK);
    }
    ring(44, 8.4, 34, 'y'); // Basket rim grapple ring
    // 4 climbable crumpled paper ball cover boulders
    sphere(43, 1.8, 33, 2.2, { seg: 8, ink: BL });
    collider(43, 0.4, 33, 3.4, 3.0, 3.4);
    sphere(45, 4.4, 35, 2.0, { seg: 8, ink: BL });
    collider(45, 3.2, 35, 3.0, 2.8, 3.0);
    sphere(39.5, 1.2, 31, 1.8, { seg: 8, ink: BL });
    collider(39.5, 0.2, 31, 2.8, 2.2, 2.8);
    sphere(46, 1.4, 28, 2.0, { seg: 8, ink: BL });
    collider(46, 0.2, 28, 3.0, 2.4, 3.0);
    pickup(44, 4.8, 34); // Hidden high-value pickup inside wastepaper basket
  } else {
    // Arena Mode: keep central runway clear for cross-fire, with low cover blocks
    box(8, 0, -6, 5.0, 1.4, 3.0, { ink: PK });
    box(-6, 0, 12, 6.0, 1.2, 4.0, { ink: BL });
  }

  // ---------------- 7. Overhead Ceiling Grid, Mobiles & Aerial Traversal ----------------
  // 3 Suspended Fluorescent Light Troffers (Walkable Catwalks with Underhung Rings)
  for (const [tx, ty] of [[-20, 22.0], [0, 24.0], [24, 22.0]]) {
    box(tx, ty, -5, 2.4, 0.6, 70.0, { ink: BL, noNav: true }); // Walkable top surface
    for (let rz = -30; rz <= 20; rz += 16) {
      ring(tx, ty - 0.8, rz, 'z'); // Underhung Tarzan swing rings
    }
  }

  // Overhead Solar System Mobile with solid colliders & proper planetary colors
  sphere(0, 26.0, 0, 3.5, { seg: 14, ink: OR }); // The Sun
  collider(0, 25.0, 0, 6.0, 2.0, 6.0);
  ring(0, 29.5, 0, 'y');
  ring(3.5, 26.0, 0, 'x');
  ring(-3.5, 26.0, 0, 'x');

  // Saturn with disc ring
  sphere(20, 24.0, 10, 2.2, { seg: 10, ink: OR });
  collider(20, 23.0, 10, 4.0, 1.6, 4.0);
  {
    const ringGeom = new THREE.TorusGeometry(3.6, 0.4, 4, 24);
    ringGeom.rotateX(Math.PI / 2.3);
    ringGeom.translate(20, 24.0, 10);
    addGeo(ringGeom, OR);
  }
  ring(20, 21.4, 10, 'y');

  // Jupiter
  sphere(14, 21.0, -22, 2.8, { seg: 10, ink: RD });
  collider(14, 20.0, -22, 4.8, 1.8, 4.8);
  ring(14, 18.0, -22, 'y');

  // Earth & Moon
  sphere(-18, 22.0, -12, 1.6, { seg: 8, ink: BL });
  collider(-18, 21.0, -12, 3.0, 1.4, 3.0);
  ring(-18, 20.0, -12, 'y');

  // Mars
  sphere(-12, 23.0, 20, 1.2, { seg: 8, ink: RD });
  collider(-12, 22.0, 20, 2.2, 1.2, 2.2);

  // ---------------- 8. Arena Mode Variations ----------------
  if (arena) {
    // Arena ceiling dome ribs & keystone ring
    const R = 92, C = -20;
    for (let k = 0; k < 8; k++) {
      const g = new THREE.TorusGeometry(R, 0.55, 5, 60, Math.PI);
      g.rotateY(k * Math.PI / 8);
      g.translate(0, C, 0);
      addGeo(g, BL);
    }
    cyl(0, 71, 0, 4.5, 3.2, { seg: 14, ink: RD });
    ring(0, 69.5, 0, 'y');
    // Dome boundary colliders to keep grappling inside
    for (let a = 0; a < 8; a++) {
      const ang = a * Math.PI / 4;
      const cx = Math.cos(ang) * 58, cz = Math.sin(ang) * 58;
      collider(cx, 32, cz, 24, 28, 24, { noNav: true, noGrapple: true });
    }
    collider(0, 75, 0, 80, 8, 80, { noNav: true, noGrapple: true });

    // 5 Suspended Hanging Notebook Platforms with corner cables
    const suspendedPads = [
      [-4, -4, 4, 4, 18.0, BL],
      [-33, -28, -27, -22, 16.0, OR],
      [27, -28, 33, -22, 16.0, BL],
      [-33, 22, -27, 28, 16.0, GR],
      [27, 22, 33, 28, 16.0, RD]
    ];
    for (const [x1, z1, x2, z2, py, col] of suspendedPads) {
      slab(x1, z1, x2, z2, py, 0.4, { ink: col });
      const mx = (x1 + x2) / 2, mz = (z1 + z2) / 2;
      ring(mx, py + 0.5, mz, 'y');
      orientedCyl([x1 + 0.2, py, z1 + 0.2], [x1 + 0.2, 48, z1 + 0.2], 0.06, 4, BK);
      orientedCyl([x2 - 0.2, py, z2 - 0.2], [x2 - 0.2, 48, z2 - 0.2], 0.06, 4, BK);
    }

    // Grand 60m Ruler Skybridge Spanning West Desks to East Bookshelf at y = 12.0m!
    slab(-28, -2, 34, 2, 12.0, 0.4, { ink: OR });
    rail(-28, -2, 34, -2, 12.0, { ink: BK });
    rail(-28, 2, 34, 2, 12.0, { ink: BK });
    ring(3, 10.2, 0, 'y');
  }

  // ---------------- 9. Tactical Snipers, Pickups & Spawns ----------------
  // Dedicated Sniper Perches
  sniper(10, 19.5, -38);  // Teacher's gooseneck lamp hood
  sniper(24, 21.3, -28);  // Microscope eyepiece rim
  sniper(41, 16.0, 2);    // Bookshelf crown deck
  sniper(-26, 10.2, -22); // Desk 1 sharpener roof
  sniper(0, 27.0, 50.8);  // South wall clock crown ledge
  sniper(28, 12.0, 46);   // Top of metal student lockers
  sniper(-28, 8.0, 46);   // Top of backpack cubbies
  sniper(0, 27.0, 0);     // Solar mobile Sun apex

  // Strategic Pickups
  pickup(0, 8.0, -34);    // Teacher's desk beside apple
  pickup(0, 0.2, -36);    // Inside central kneehole tunnel
  pickup(-28, 7.0, -18);  // Desk 1 surface
  pickup(-28, 4.0, -18);  // Desk 1 under-desk wire basket
  pickup(-10, 7.0, 14);   // Desk 4 textbook surface
  pickup(35.5, 4.0, -10); // Bookshelf shelf 1 walkway
  pickup(35.5, 8.0, 10);  // Bookshelf shelf 2 walkway
  pickup(38, 16.0, -15);  // Bookshelf crown deck
  pickup(30, 7.0, -35);   // Science lab sink edge
  pickup(2, arena ? 0.2 : 4.2, 8);      // Crashed paper airplane wing (or central floor in arena)
  pickup(8, arena ? 0.2 : 2.6, 22);     // Desk stapler head (or floor in arena)
  pickup(8, 2.2, -6);     // Pink wedge eraser
  pickup(28, 0.2, 43);    // Inside open locker door
  pickup(-16, 7.5, 45);   // Top of red canvas backpack

  // Team Spawns (Red & Blue)
  L.teamSpawns = [
    [[-12, 8.0, -36], [-28, 7.0, -18], [-38, 0.2, -20], [-28, 4.0, 14], [-4, 0.2, -30], [-19, 7.0, -15], [-28, 8.0, 46], [-32, 0.2, 30]].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    [[12, 8.0, -36], [36, 7.0, -30], [35.5, 4.0, 12], [28, 12.0, 46], [0, 0.2, 44], [4, 0.2, 22], [38, 16.0, 0], [30, 0.2, -10]].map(([x, y, z]) => new THREE.Vector3(x, y, z))
  ];

  // 16 Symmetrical Arena Match Spawns
  for (const [x, y, z] of [
    // Ground & Low tier
    [-38, 0.2, -20], [38, 0.2, -20], [-4, 0.2, -30], [4, 0.2, 22],
    [0, 0.2, 44], [-32, 0.2, 30], [30, 0.2, -10], [0, 0.2, -15],
    // Mid tier (Desks, Lockers & Cubbies)
    [-28, 7.0, -18], [36, 7.0, -30], [-10, 7.0, 14], [35.5, 4.0, 12],
    [-28, 8.0, 46], [28, 12.0, 46],
    // High tier
    [-12, 8.0, -36], [38, 16.0, 0]
  ]) {
    L.arenaSpawns.push(new THREE.Vector3(x, y, z));
  }

  // 4 Circling Paper Airplanes in Upper Airspace
  planes(4, 28, 22, { rStep: 6, hStep: 3, scale: 1.4, speed: 0.12 });

  return B.finish();
}