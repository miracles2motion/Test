import * as THREE from 'three';
import { INK } from '../render.js';
import { choose, rand } from '../util.js';
import { buildHumanoid } from '../enemies.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export function buildClockwork(B, arena = false) {
  const { L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = 3, GR = 4, PK = 5, BK = 2, BL = 0, RD = 1;

  function orientedCyl(p1, p2, radius, seg = 6, ink = BK) {
    const v1 = p1 instanceof THREE.Vector3 ? p1 : new THREE.Vector3(...p1);
    const v2 = p2 instanceof THREE.Vector3 ? p2 : new THREE.Vector3(...p2);
    const dir = new THREE.Vector3().subVectors(v2, v1);
    const len = dir.length();
    if (len < 0.01) return;
    const g = new THREE.CylinderGeometry(radius, radius, len, seg);
    g.translate(0, len / 2, 0);
    g.rotateX(Math.PI / 2);
    g.lookAt(dir);
    g.translate(v1.x, v1.y, v1.z);
    addGeo(g, ink);
  }

  // Composite circular collider for smooth footing on circular gears and hubs
  function circleCollider(cx, cy, cz, r, h, o = {}) {
    collider(cx, cy, cz, r * 1.45, h, r * 1.95, o);
    collider(cx, cy, cz, r * 1.95, h, r * 1.45, o);
    collider(cx, cy, cz, r * 1.72, h, r * 1.72, o);
  }

  L.key = 'clockwork';
  // Player spawns firmly on the South Mezzanine observation deck, looking North into the great clock
  L.playerStart.set(0, 0.5, 36);

  const P = arena ? 68 : 55, T = 6, PH = arena ? 34 : 24;
  L.bounds.minX = -P; L.bounds.maxX = P; L.bounds.minZ = -P; L.bounds.maxZ = P;

  // ==================== 0. SOLID FOUNDATION FLOOR & PERIMETER ====================
  // Lethal Grinding Pit (hole in the center floor x: -8 to 8, z: -16 to 4)
  slab(-P - T/2, -P - T/2, -8, P + T/2, 0, 1, { ink: BL }); // West
  slab(8, -P - T/2, P + T/2, P + T/2, 0, 1, { ink: BL }); // East
  slab(-8, -P - T/2, 8, -16, 0, 1, { ink: BL }); // North
  slab(-8, 4, 8, P + T/2, 0, 1, { ink: BL }); // South

  // Decorative cog edge and pit glow
  { const pitE1 = new THREE.BoxGeometry(16, 1, 0.4); pitE1.translate(0, -0.5, -16); addGeo(pitE1, OR); }
  { const pitE2 = new THREE.BoxGeometry(16, 1, 0.4); pitE2.translate(0, -0.5, 4); addGeo(pitE2, OR); }
  { const pitE3 = new THREE.BoxGeometry(0.4, 1, 20); pitE3.translate(-8, -0.5, -6); addGeo(pitE3, OR); }
  { const pitE4 = new THREE.BoxGeometry(0.4, 1, 20); pitE4.translate(8, -0.5, -6); addGeo(pitE4, OR); }
  box(0, -3, -6, 16, 0.1, 20, { ink: RD, noCollide: true }); // Red glowing abyss
  rail(-8, 4, 8, 4, 0, { ink: OR }); // South warning rail
  rail(-8, -16, 8, -16, 0, { ink: OR }); // North warning rail

  // Perimeter enclosing walls anchored firmly into the floor
  box(0, 0, -P, 2 * P + T, PH, T, { ink: BL });
  box(0, 0, P, 2 * P + T, PH, T, { ink: BL });
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: BL });
  box(P, 0, 0, T, PH, 2 * P + T, { ink: BL });

  if (!arena) {
    const NG = { noNav: true, noGrapple: true };
    collider(0, PH, -P, 2 * P + T, 40, T, NG);
    collider(0, PH, P, 2 * P + T, 40, T, NG);
    collider(-P, PH, 0, T, 40, 2 * P + T, NG);
    collider(P, PH, 0, T, 40, 2 * P + T, NG);
    collider(0, 56, 0, 2 * P + 40, 8, 2 * P + 40, NG);

    // Solo Mode Clockwork Arch Ribs
    const R = 98, C = -20;
    for (let k = 0; k < 6; k++) {
      const g = new THREE.TorusGeometry(R, 0.45, 5, 60, Math.PI);
      g.rotateY(k * Math.PI / 6); g.translate(0, C, 0); addGeo(g, BL);
    }
    for (const h of [30, 46, 60, 72]) {
      if (h - C > R) continue;
      const r = Math.sqrt(R * R - (h - C) * (h - C));
      const g = new THREE.TorusGeometry(r, 0.4, 5, 96);
      g.rotateX(Math.PI / 2); g.translate(0, h, 0); addGeo(g, BL);
    }
  }

  // 8 Perimeter Observation Balconies
  const P_BALCS = [
    [-36, 8, -51.2, 8, 2.4, 'y'], [36, 8, -51.2, 8, 2.4, 'y'],
    [-51.2, 12, -18, 2.4, 8, 'x'], [-51.2, 12, 18, 2.4, 8, 'x'],
    [51.2, 12, -18, 2.4, 8, 'x'], [51.2, 12, 18, 2.4, 8, 'x'],
    [-28, 8, 51.2, 8, 2.4, 'y'], [28, 8, 51.2, 8, 2.4, 'y']
  ];
  for (const [bx, by, bz, bw, bd, ax] of P_BALCS) {
    box(bx, by, bz, bw, 0.4, bd, { ink: BL });
    const inX = Math.abs(bx) > 40 ? (bx > 0 ? bx - 1.8 : bx + 1.8) : bx;
    const inZ = Math.abs(bz) > 40 ? (bz > 0 ? bz - 1.8 : bz + 1.8) : bz;
    ring(inX, by + 3.5, inZ, ax);
  }

  // Decorative brass floor inlays & concentric measurement scales
  for (const r of [12, 22, 34]) {
    const g = new THREE.TorusGeometry(r, 0.08, 4, 48);
    g.rotateX(Math.PI / 2);
    g.translate(0, 0.02, -6);
    addGeo(g, OR);
  }

  // ==================== 1. TIER 0: WORKSHOP & SOUTH MEZZANINE (y = 0.0 - 0.5m) ====================
  // South Observation Mezzanine
  slab(-22, 28, 22, P - 3, 0.5, 0.5, { ink: BL });
  rail(-22, 28, -6, 28, 0.5, { ink: BK });
  rail(6, 28, 22, 28, 0.5, { ink: BK });

  // Wide 2-step stair connecting Ground (y=0) to South Mezzanine (y=0.5)
  stairs(0, 0, 26.5, '+z', 2, 6, { rise: 0.25, run: 0.75, ink: BK });

  // Clockmaker's Desk & Workshop Props on South Mezzanine
  box(0, 0.5, 42, 5, 1.2, 2, { ink: OR });
  box(0, 1.7, 42, 4.6, 0.1, 1.6, { ink: BK, noCollide: true });
  // Hoist winch on West side
  box(-9, 0.5, 34, 2.4, 2.0, 1.8, { ink: BK });
  // Oil drums and parts crates
  cyl(9, 0.5, 34, 0.6, 1.4, { ink: GR });
  cyl(10.4, 0.5, 34, 0.6, 1.4, { ink: GR });
  cyl(9.7, 0.5, 35.3, 0.6, 1.4, { ink: GR });
  box(12, 0.5, 38, 2, 1.6, 2, { ink: OR });
  box(-12, 0.5, 38, 1.8, 1.4, 1.8, { ink: OR });

  // Ground-Level Tactical Cover between sectors
  box(4, 0, 6, 2.2, 1.6, 1.8, { ink: BK }); // Gear hoist winch
  cyl(-22, 0, 12, 0.6, 1.4, { ink: GR }); cyl(-23.4, 0, 12, 0.6, 1.4, { ink: GR }); // Oil drums
  cyl(22, 0, 12, 0.6, 1.4, { ink: GR });
  cyl(-22, 0, -28, 0.45, 2.5, { axis: 'z', ink: OR }); // Copper pipe segments
  cyl(22, 0, -28, 0.45, 2.5, { axis: 'z', ink: OR });
  box(-12, 0, -4, 2.4, 1.2, 1.6, { ink: BL }); // Tool chest
  box(12, 0, -4, 2.4, 1.2, 1.6, { ink: BL }); // Tool chest

  // Central Balance Wheel flush inlay in the South workshop hub (spaced clearly from Gear Alpha)
  cyl(0, 0, 16, 6, 0.2, { seg: 24, ink: BL });
  circleCollider(0, 0, 16, 6, 0.2, { tag: 'hub' });
  ring(0, 3.8, 16, 'y');
  for (let s = 0; s < 6; s++) {
    const a = s * (Math.PI / 3);
    box(Math.cos(a) * 3.0, 0.2, 16 + Math.sin(a) * 3.0, 0.35, 0.1, 5.5, { noCollide: true, ink: OR });
  }

  // ==================== 2. TIER 1: MAIN DRIVER COG ALPHA (y = 1.6m) ====================
  // Colossal central gear brought down to human combat scale: walking surface at y = 1.6m
  const alphaR = 10.5, alphaX = 0, alphaZ = -6, alphaY = 0, alphaH = 1.6;
  cyl(alphaX, alphaY, alphaZ, alphaR, alphaH, { seg: 28, ink: OR, noCollide: true });
  circleCollider(alphaX, alphaY, alphaZ, alphaR, alphaH, { tag: 'gear' });

  // Low decorative brass arbor hub with grapple point
  cyl(alphaX, alphaH, alphaZ, 1.4, 2.2, { ink: BK, noCollide: true });
  ring(alphaX, alphaH + 2.5, alphaZ, 'y');

  function gearTooth(cx, cy, cz, r, angle, w, h, d, ink) {
    const x = cx + Math.cos(angle) * r;
    const z = cz + Math.sin(angle) * r;
    const g = new THREE.BoxGeometry(w, h, d);
    g.rotateY(-angle);
    g.translate(x, cy + h / 2, z);
    addGeo(g, ink);
    collider(x, cy, z, Math.min(w, d), h, Math.min(w, d), { tag: 'gear' });
  }

  // Walkable teeth around Gear Alpha - leaving open bays at the 4 cardinal stair landings
  const teethAlpha = 16;
  for (let i = 0; i < teethAlpha; i++) {
    // Skip teeth at the 4 cardinal landing directions (i = 0, 4, 8, 12) so stairs enter unobstructed
    if (i % 4 === 0) continue;
    gearTooth(alphaX, alphaY, alphaZ, alphaR + 0.4, i * (Math.PI * 2 / teethAlpha), 1.6, alphaH, 1.6, OR);
  }

  // --- 4 DIRECT ACCESSIBLE STAIRWAYS ONTO GEAR ALPHA (from all directions) ---
  // South Approach (from Workshop Floor Hub)
  stairs(0, 0, 8.5, '-z', 8, 3.2, { rise: alphaH / 8, run: 0.5, ink: BK });
  // East Approach (from East Boiler Sector)
  stairs(14.5, 0, alphaZ, '-x', 8, 3.0, { rise: alphaH / 8, run: 0.5, ink: BK });
  // West Approach (from West Piston Sector)
  stairs(-14.5, 0, alphaZ, '+x', 8, 3.0, { rise: alphaH / 8, run: 0.5, ink: BK });
  // North Approach (from North Ground)
  stairs(0, 0, -20.5, '+z', 8, 3.2, { rise: alphaH / 8, run: 0.5, ink: BK });

  // ==================== 3. TIER 2: INTERLOCKING COGS BETA & GAMMA (y = 3.6m) ====================
  // Gear Beta (West)
  const betaR = 8.0, betaX = -18, betaZ = -20, betaY = 0, betaH = 3.6;
  cyl(betaX, betaY, betaZ, betaR, betaH, { seg: 24, ink: OR, noCollide: true });
  // Composite deck colliders for Gear Beta leaving East stairwell entry (x: -14.5 to -10, z: -16 to -12.5) open for stair ascent
  slab(-25.5, -27.5, -14.5, -12.5, betaH, 0.4, { tag: 'gear' }); // Main gear body west of stair
  slab(-14.5, -27.5, -10.5, -16.0, betaH, 0.4, { tag: 'gear' }); // North-east gear quadrant
  slab(-14.5, -12.5, -10.5, -12.0, betaH, 0.4, { tag: 'gear' }); // South-east gear quadrant
  cyl(betaX, betaH, betaZ, 1.2, 2.0, { ink: BK, noCollide: true });
  ring(betaX, betaH + 2.2, betaZ, 'y');
  const teethBeta = 12;
  for (let i = 0; i < teethBeta; i++) {
    // Skip tooth at stair entry opening (around angle ~ 0 / East)
    if (i === 11 || i === 0 || i === 1) continue;
    gearTooth(betaX, betaH - 0.4, betaZ, betaR + 0.5, (i + 0.5) * (Math.PI * 2 / teethBeta), 1.6, 0.4, 1.6, OR);
  }

  // Intermediate landing connecting Gear Alpha (y=1.6) to Gear Beta stairs
  slab(-14, -18, -10, -14, alphaH, 0.4, { ink: BK });
  // Direct stairs climbing West onto Gear Beta (y=3.6)
  stairs(-10.5, alphaH, -14.2, '-x', 7, 2.8, { rise: (betaH - alphaH) / 7, run: 0.55, ink: BK });

  // Gear Gamma (East)
  const gammaR = 8.0, gammaX = 18, gammaZ = -20, gammaY = 0, gammaH = 3.6;
  cyl(gammaX, gammaY, gammaZ, gammaR, gammaH, { seg: 24, ink: OR, noCollide: true });
  // Composite deck colliders for Gear Gamma leaving West stairwell entry (x: 10 to 14.5, z: -16 to -12.5) open for stair ascent
  slab(14.5, -27.5, 25.5, -12.5, gammaH, 0.4, { tag: 'gear' }); // Main gear body east of stair
  slab(10.5, -27.5, 14.5, -16.0, gammaH, 0.4, { tag: 'gear' }); // North-west gear quadrant
  slab(10.5, -12.0, 14.5, -11.5, gammaH, 0.4, { tag: 'gear' }); // South-west gear quadrant
  cyl(gammaX, gammaH, gammaZ, 1.2, 2.0, { ink: BK, noCollide: true });
  ring(gammaX, gammaH + 2.2, gammaZ, 'y');
  const teethGamma = 12;
  for (let i = 0; i < teethGamma; i++) {
    // Skip tooth at stair entry opening (around angle ~ PI / West)
    if (i === 4 || i === 5 || i === 6 || i === 7) continue;
    gearTooth(gammaX, gammaH - 0.4, gammaZ, gammaR + 0.5, (i + 0.5) * (Math.PI * 2 / teethGamma), 1.6, 0.4, 1.6, OR);
  }

  // Intermediate landing connecting Gear Alpha (y=1.6) to Gear Gamma stairs
  slab(10, -18, 14, -14, alphaH, 0.4, { ink: BK });
  // Direct stairs climbing East onto Gear Gamma (y=3.6)
  stairs(10.5, alphaH, -14.2, '+x', 7, 2.8, { rise: (gammaH - alphaH) / 7, run: 0.55, ink: BK });

  // High Transverse Catwalk connecting Gear Beta directly to Gear Gamma across center (y = 3.6m)
  slab(-18, -22, 18, -18, betaH, 0.4, { ink: BK });
  // South catwalk railing with openings for side stairs
  rail(-18, -18, -12, -18, betaH, { ink: BL });
  rail(-6, -18, 6, -18, betaH, { ink: BL });
  rail(12, -18, 18, -18, betaH, { ink: BL });
  // North catwalk railing with open gaps for Escapement stairs
  rail(-18, -22, -12, -22, betaH, { ink: BL });
  rail(-7, -22, 7, -22, betaH, { ink: BL });
  rail(12, -22, 18, -22, betaH, { ink: BL });

  // Catwalk connecting Gear Beta to West Piston Platform
  slab(-28, -22, -18, -18, betaH, 0.4, { ink: BK });
  // Catwalk connecting Gear Gamma to East Boiler Platform
  slab(18, -22, 28, -18, gammaH, 0.4, { ink: BK });

  // ==================== 4. WEST SECTOR: PISTON ENGINES & SERVICE DECK ====================
  // Elevated Piston Platform at y = 3.6m
  slab(-46, -30, -28, 0, betaH, 0.4, { ink: BK });
  // South railing with open landing threshold for service stairs at x = -32
  rail(-46, 0, -34, 0, betaH, { ink: BL });
  rail(-30, 0, -28, 0, betaH, { ink: BL });
  rail(-46, -30, -46, 0, betaH, { ink: BL });

  // Stairs from Ground (y=0) to West Piston Platform (y=3.6) arriving at open threshold
  stairs(-32, 0, 7.5, '-z', 12, 2.5, { rise: betaH / 12, run: 0.6, ink: BK });

  // Rubber vibration mount pads
  box(-41, betaH, -20, 6.4, 0.2, 2.4, { ink: PK });
  box(-41, betaH, -8, 6.4, 0.2, 2.4, { ink: PK });

  // Piston Cylinder Housings & Bolted head covers
  cyl(-41, betaH + 1.2, -20, 1.5, 6, { axis: 'z', seg: 16, ink: BK });
  cyl(-44, betaH + 1.2, -20, 1.6, 0.4, { axis: 'z', seg: 16, ink: BK });
  cyl(-41, betaH + 1.2, -8, 1.5, 6, { axis: 'z', seg: 16, ink: BK });
  cyl(-44, betaH + 1.2, -8, 1.6, 0.4, { axis: 'z', seg: 16, ink: BK });

  // Crosshead guide bars
  box(-41, betaH + 0.3, -14, 0.4, 0.3, 8, { ink: BK, noCollide: true });
  box(-41, betaH + 0.3, -2, 0.4, 0.3, 8, { ink: BK, noCollide: true });

  // Animated sliding pistons stroking visibly across the deck
  const pistonGroup = new THREE.Group();
  scene.add(pistonGroup);
  const pistonRodGeom = new THREE.BoxGeometry(1.6, 0.8, 2.2);
  const m1 = new THREE.Mesh(pistonRodGeom, makeInkMaterial({ ink: OR }));
  m1.position.set(-41, betaH + 1.2, -14);
  const m2 = new THREE.Mesh(pistonRodGeom, makeInkMaterial({ ink: OR }));
  m2.position.set(-41, betaH + 1.2, -2);
  pistonGroup.add(m1, m2);
  L.meshes.push(m1, m2);

  L.animated.push({
    mesh: pistonGroup,
    update: (t) => {
      const cycle = Math.sin(t * (Math.PI * 2 / 2.8));
      m1.position.z = -14 + cycle * 1.8;
      m2.position.z = -2 + cycle * 1.8;
    }
  });

  // Flyball Governor on West Deck
  cyl(-35, betaH, -14, 0.4, 4.0, { ink: BK, noCollide: true });
  sphere(-36.2, betaH + 2.8, -14, 0.65, { ink: OR });
  sphere(-33.8, betaH + 2.8, -14, 0.65, { ink: OR });
  ring(-35, betaH + 4.2, -14, 'y');

  // ==================== 5. EAST SECTOR: BOILER ROOM & STEAM MANIFOLD ====================
  // Elevated Boiler Platform at y = 3.6m
  slab(28, -30, 46, 0, gammaH, 0.4, { ink: BK });
  // South railing with open landing threshold for service stairs at x = 32
  rail(28, 0, 30, 0, gammaH, { ink: BL });
  rail(34, 0, 46, 0, gammaH, { ink: BL });
  rail(46, -30, 46, 0, gammaH, { ink: BL });

  // Stairs from Ground (y=0) to East Boiler Platform (y=3.6) arriving at open threshold
  stairs(32, 0, 7.5, '-z', 12, 2.5, { rise: gammaH / 12, run: 0.6, ink: BK });

  // Steam Boilers resting on brick firebox foundations
  box(37, 0, -18, 4.5, 2.0, 9, { ink: RD });
  box(34.7, 0.2, -18, 0.2, 1.6, 2.4, { ink: RD, noCollide: true }); // Firebox doors
  box(37, 0, -6, 4.5, 2.0, 9, { ink: RD });
  box(34.7, 0.2, -6, 0.2, 1.6, 2.4, { ink: RD, noCollide: true }); // Firebox doors
  cyl(37, 3.2, -18, 2.2, 10, { axis: 'z', seg: 16, ink: BL });
  cyl(37, 3.2, -6, 2.2, 10, { axis: 'z', seg: 16, ink: BL });

  // Steam manifold pipes & grapple valve
  orientedCyl([37, 5.4, -18], [37, 5.4, -6], 0.35, 8, BK);
  ring(37, 6.2, -12, 'y');

  // Flanged copper steam header catwalk
  cyl(37, 9.4, -12, 0.65, 20, { axis: 'z', ink: OR });
  slab(36.4, -22, 37.6, -2, 10.05, 0.1, { ink: BK }); // Walking surface
  
  // 3 Bourdon tube pressure dials
  for (const dz of [-18, -12, -6]) {
    const dial = new THREE.CylinderGeometry(1.4, 1.4, 0.4, 16);
    dial.rotateZ(Math.PI / 2); dial.translate(50.8, 8, dz); addGeo(dial, OR);
  }

  // ==================== 6. TIER 3: NORTH ESCAPEMENT MEZZANINE (y = 5.8m) ====================
  // North Escapement Mezzanine extended forward to z = -26.5m so stairs land flush onto solid floor
  const escH = 5.8;
  slab(-20, -48, 20, -26.5, escH, 0.4, { ink: BK });
  // Mezzanine front balustrade with stair openings
  rail(-20, -26.5, -12, -26.5, escH, { ink: BL });
  rail(-7, -26.5, 7, -26.5, escH, { ink: BL });
  rail(12, -26.5, 20, -26.5, escH, { ink: BL });

  // Dual sweeping staircases connecting Transverse Catwalk (y=3.6) directly to Escapement Mezzanine (y=5.8)
  // West Stair: starts at z = -22.0, runs 4.5m to z = -26.5
  stairs(-9.5, betaH, -22.0, '-z', 8, 2.5, { rise: (escH - betaH) / 8, run: 0.56, ink: BK });
  // East Stair: starts at z = -22.0, runs 4.5m to z = -26.5
  stairs(9.5, gammaH, -22.0, '-z', 8, 2.5, { rise: (escH - gammaH) / 8, run: 0.56, ink: BK });

  // Upright Ticking Escape Wheel on North Wall
  const escapeWheelGeom = new THREE.CylinderGeometry(3.2, 3.2, 0.5, 24);
  escapeWheelGeom.rotateX(Math.PI / 2);
  const escapeWheelMesh = new THREE.Mesh(escapeWheelGeom, makeInkMaterial({ ink: OR }));
  escapeWheelMesh.position.set(0, escH + 3.2, -47);
  scene.add(escapeWheelMesh);
  L.meshes.push(escapeWheelMesh);

  // Escapement Anchor Pallets
  const anchorGeom = new THREE.BoxGeometry(4.8, 0.35, 0.6);
  const anchorMesh = new THREE.Mesh(anchorGeom, makeInkMaterial({ ink: BK }));
  anchorMesh.position.set(0, escH + 6.2, -47);
  scene.add(anchorMesh);
  L.meshes.push(anchorMesh);

  let lastTick = -1;
  L.animated.push({
    mesh: escapeWheelMesh,
    update: (t) => {
      const tick = Math.floor(t * 2.5);
      escapeWheelMesh.rotation.z = -tick * (Math.PI / 12);
      anchorMesh.rotation.z = Math.sin(t * 2.5 * Math.PI) * 0.16;
      if (tick !== lastTick) {
        lastTick = tick;
        if (typeof window !== 'undefined' && window.audio && window.audio.ctx) {
          try { window.audio.tone({ freq: 800, dur: 0.03, gain: 0.05, type: 'square' }); } catch(e){}
        }
      }
    }
  });

  ring(0, escH + 1.2, -28, 'y'); // Balustrade sniper perch grapple ring

  // Grand Clock Face visual on North Wall
  const clockDialGeom = new THREE.TorusGeometry(5.5, 0.25, 6, 48);
  clockDialGeom.translate(0, escH + 4.5, -P + 0.3);
  addGeo(clockDialGeom, OR);
  // Clock hands
  box(0, escH + 5.5, -P + 0.4, 0.2, 3.2, 0.1, { ink: BK, noCollide: true });
  box(1.2, escH + 4.5, -P + 0.4, 2.2, 0.2, 0.1, { ink: BK, noCollide: true });

  // ==================== 7. DYNAMIC EYE-LEVEL MACHINERY ====================
  // 1. Swinging Heavy Pendulum - brought down so bob sweeps across the arena at y = 2.2m - 3.2m
  const pendGroup = new THREE.Group();
  pendGroup.position.set(0, 16, 4);
  scene.add(pendGroup);

  const rodGeom = new THREE.CylinderGeometry(0.3, 0.3, 13.5, 8);
  rodGeom.translate(0, -6.75, 0);
  const rodMesh = new THREE.Mesh(rodGeom, makeInkMaterial({ ink: OR }));
  pendGroup.add(rodMesh);
  L.meshes.push(rodMesh);

  const largeBobGeom = new THREE.CylinderGeometry(2.4, 2.4, 1.6, 24);
  largeBobGeom.rotateX(Math.PI / 2);
  largeBobGeom.translate(0, -13.5, 0);
  const bobMesh = new THREE.Mesh(largeBobGeom, makeInkMaterial({ ink: OR }));
  pendGroup.add(bobMesh);
  L.meshes.push(bobMesh);

  // Dedicated world-space tracker for the swinging pendulum bob (for dynamic grappling)
  const pendulumTracker = new THREE.Object3D();
  pendulumTracker.position.set(0, 2.5, 4);
  scene.add(pendulumTracker);
  L.meshes.push(pendulumTracker);
  L.grappleMovers.push({ mesh: pendulumTracker, radius: 3.0 });

  L.animated.push({
    mesh: pendGroup,
    update: (t) => {
      const theta = 0.35 * Math.cos(0.9 * t);
      pendGroup.rotation.z = theta;
      const bobWorldX = Math.sin(theta) * 13.5;
      const bobWorldY = 16.0 - Math.cos(theta) * 13.5;
      pendulumTracker.position.set(bobWorldX, bobWorldY, 4.0);
    }
  });

  // 2. Overhead Monorail Crane - track at y = 8.5m, hook at y = 5.2m
  box(0, 8.5, -6, 1.2, 1.2, 60, { ink: BK }); // Track beam
  const trolleyGroup = new THREE.Group();
  scene.add(trolleyGroup);

  const trolleyMesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.9, 2.2), makeInkMaterial({ ink: BL }));
  trolleyMesh.position.set(0, 8.0, 0);
  trolleyGroup.add(trolleyMesh);
  L.meshes.push(trolleyMesh);

  const hookMesh = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.18, 8, 16), makeInkMaterial({ ink: OR }));
  hookMesh.position.set(0, 5.2, 0);
  trolleyGroup.add(hookMesh);
  L.meshes.push(hookMesh);

  const cableGeom = new THREE.CylinderGeometry(0.08, 0.08, 2.8, 4);
  cableGeom.translate(0, 6.6, 0);
  const cableMesh = new THREE.Mesh(cableGeom, makeInkMaterial({ ink: BK }));
  trolleyGroup.add(cableMesh);
  L.meshes.push(cableMesh);

  // Dedicated world-space tracker for the overhead crane hook (for dynamic grappling)
  const craneTracker = new THREE.Object3D();
  craneTracker.position.set(0, 5.2, -6);
  scene.add(craneTracker);
  L.meshes.push(craneTracker);
  L.grappleMovers.push({ mesh: craneTracker, radius: 2.2 });

  L.animated.push({
    mesh: trolleyGroup,
    update: (t) => {
      const trolleyZ = -6 + 22 * Math.sin(t * 0.35);
      trolleyGroup.position.z = trolleyZ;
      craneTracker.position.set(0, 5.2, trolleyZ);
    }
  });

  // ==================== 8. SPAWNS, PICKUPS & SNIPERS ====================
  if (arena) {
    // Arena Geodesic Dome rings & ribs
    const R = 120, C = -30;
    for (let k = 0; k < 8; k++) {
      const g = new THREE.TorusGeometry(R, 0.55, 5, 60, Math.PI);
      g.rotateY(k * Math.PI / 8); g.translate(0, C, 0); addGeo(g, BL);
    }
    for (const h of [38, 54, 68, 80, 88]) {
      const rad = Math.sqrt(Math.max(1, R * R - (h - C) * (h - C)));
      const g = new THREE.TorusGeometry(rad, 0.35, 6, 64);
      g.rotateX(Math.PI / 2); g.translate(0, h, 0); addGeo(g, BL);
    }
    sphere(0, 90, 0, 2.4, { ink: RD }); // Apex keystone

    // 5 Suspended Balance Wheel Platforms
    const sPlats = [
      [0, 24, 0, 8, 8], [-28, 20, -22, 6, 6], [28, 20, 22, 6, 6], [24, 22, -32, 5, 5], [-24, 22, 32, 5, 5]
    ];
    for (const [px, py, pz, pw, pd] of sPlats) {
      slab(px - pw/2, pz - pd/2, px + pw/2, pz + pd/2, py, 0.4, { ink: OR });
      ring(px, py - 1.3, pz, 'y');
      orientedCyl([px, py, pz], [px, 88, pz], 0.08, 4, BK); // Cable
    }

    const rs = [
      [0, 0.5, 36], [-18, 3.8, -20], [18, 3.8, -20], [0, 1.8, -6],
      [-36, 3.8, -12], [36, 3.8, -12], [0, 6.0, -38],
      [-36, 8, -50], [36, 8, -50], [-50, 12, -18], [50, 12, 18],
      [0, 24, 0], [-28, 20, -22], [28, 20, 22], [-24, 22, 32], [24, 22, -32]
    ];
    rs.forEach((pos) => spawn(...pos));
    L.arenaSpawns = [...L.spawns];
  } else {
    // Solo wave spawns
    spawn(0, 0.2, 22); spawn(-14, 0.2, 24); spawn(14, 0.2, 24); spawn(0, 1.8, -6);
    spawn(-18, 3.8, -20); spawn(18, 3.8, -20); spawn(-36, 3.8, -12); spawn(36, 3.8, -12); spawn(0, 6.0, -38);
  }

  L.teamSpawns = [
    [[-18, 3.8, -20], [-36, 3.8, -12], [0, 1.8, -6], [-28, 3.6, 0], [-10, 5.8, -32]].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    [[36, 3.8, -12], [37, 10.0, -12], [0, 0.5, 28], [24, 0.5, 8], [18, 3.6, 18]].map(([x, y, z]) => new THREE.Vector3(x, y, z))
  ];

  // Sniper Perches (well elevated with pristine line of sight)
  sniper(0, 6.0, -38); sniper(-18, 3.8, -20); sniper(18, 3.8, -20);
  sniper(-36, 3.8, -12); sniper(36, 3.8, -12); sniper(0, 0.5, 36);
  sniper(37, 10.0, -12); sniper(-36, 8, -50);

  // Pickups distributed across all three tiers
  pickup(0, 1.8, -6); pickup(-18, 3.8, -20); pickup(18, 3.8, -20); pickup(0, 6.0, -38);
  pickup(-36, 3.8, -12); pickup(36, 3.8, -12); pickup(0, 0.5, 36); pickup(0, 0.2, 14);
  pickup(-20, 0.2, 0); pickup(20, 0.2, 0); pickup(37, 10.0, -12); pickup(4, 0.2, 6);
  pickup(-50, 12, -18); pickup(50, 12, 18);

  B.finish();
  return L;
}