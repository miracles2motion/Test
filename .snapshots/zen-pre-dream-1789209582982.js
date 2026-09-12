import * as THREE from 'three';
import { INK } from '../render.js';

export function buildZen(B, arena = false) {
  const { L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = INK.ORANGE ?? 3, GR = INK.GREEN ?? 4, PK = 5, BK = INK.BLACK ?? 2, BL = INK.BLUE ?? 0, RD = INK.RED ?? 1;

  L.key = 'zen';
  const P = arena ? 68 : 55, PH = arena ? 30 : 18, T = 6;
  const D = P - 3;
  L.bounds = { minX: -P, maxX: P, minZ: -P, maxZ: P };

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

  // ==================== 1. GROUND & PERIMETER PLASTER WALLS (KAKI) ====================
  // Ground foundation slabs carved around the recessed Ink Stream riverbed (Z = -37m to -27m)
  box(0, -1.0, -47.0, 2 * P + T, 1.0, 20.0, { ink: BL }); // North terrain (Z: -57 to -37)
  box(0, -1.0, 15.0, 2 * P + T, 1.0, 84.0, { ink: BL });  // South terrain (Z: -27 to +57)

  // Perimeter Earthen Plaster Enclosure Walls (Kaki) with pitched ceramic roof tiles (kawara)
  box(0, 0, -P, 2 * P + T, PH, T, { ink: BL }); // North wall
  box(0, 0, P, 2 * P + T, PH, T, { ink: BL });  // South wall
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: BL }); // West wall
  box(P, 0, 0, T, PH, 2 * P + T, { ink: BL });  // East wall

  // Kawara ceramic roof tiles atop perimeter walls
  box(0, PH, -P, 2 * P + T + 1.2, 0.8, T + 1.2, { noCollide: true, ink: BK });
  box(0, PH, P, 2 * P + T + 1.2, 0.8, T + 1.2, { noCollide: true, ink: BK });
  box(-P, PH, 0, T + 1.2, 0.8, 2 * P + T + 1.2, { noCollide: true, ink: BK });
  box(P, PH, 0, T + 1.2, 0.8, 2 * P + T + 1.2, { noCollide: true, ink: BK });

  // Traditional sliding gate doorways
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
  doorFrame(-D, 24, false); doorFrame(D, -24, false);

  if (!arena) {
    // Solo anti-camp sky containment
    const NG = { noNav: true, noGrapple: true };
    collider(0, PH, -P, 2 * P + T, 40, T, NG);
    collider(0, PH, P, 2 * P + T, 40, T, NG);
    collider(-P, PH, 0, T, 40, 2 * P + T, NG);
    collider(P, PH, 0, T, 40, 2 * P + T, NG);
    collider(0, 56.0, 0, 2 * P + 40, 8.0, 2 * P + 40, NG);

    // Calligraphic Torus Ribs
    const R = 98.0, C = -20.0;
    for (let k = 0; k < 6; k++) {
      const g = new THREE.TorusGeometry(R, 0.45, 5, 80, Math.PI);
      g.rotateY(k * Math.PI / 6);
      g.translate(0, C, 0);
      addGeo(g, GR);
    }
    for (const h of [30, 46, 60, 72]) {
      const r = Math.sqrt(Math.max(1, R * R - (h - C) * (h - C)));
      const g = new THREE.TorusGeometry(r, 0.35, 5, 96);
      g.rotateX(Math.PI / 2);
      g.translate(0, h, 0);
      addGeo(g, GR);
    }
  }

  // Perimeter Ledges & Black Pine Tree Boughs (8 vantage perches)
  const ledges = [
    [-34.0, 6.0, -P + 3.8, 8.0, 2.4],
    [34.0, 6.0, -P + 3.8, 8.0, 2.4],
    [-P + 3.8, 6.0, -18.0, 2.4, 8.0],
    [-P + 3.8, 6.0, 18.0, 2.4, 8.0],
    [P - 3.8, 6.0, -18.0, 2.4, 8.0],
    [P - 3.8, 6.0, 18.0, 2.4, 8.0],
    [-26.0, 6.0, P - 3.8, 8.0, 2.4],
    [26.0, 6.0, P - 3.8, 8.0, 2.4]
  ];
  for (const [lx, ly, lz, lw, ld] of ledges) {
    box(lx, ly, lz, lw, 0.4, ld, { ink: OR });
    rail(lx - lw / 2, lz - ld / 2, lx + lw / 2, lz - ld / 2, ly, { ink: OR });
    rail(lx - lw / 2, lz + ld / 2, lx + lw / 2, lz + ld / 2, ly, { ink: OR });
  }

  // ==================== 2. CENTRAL SECTOR: SANJŪ-NO-TŌ PAGODA (0, 0, 0) ====================
  // Central Cedar Heart Pillar (Shinbashira)
  cyl(0, 0, 0, 0.75, 32.0, { ink: OR });

  // Ground Level Raised Veranda (Engawa) at Y = 1.2m
  slab(-9.0, -9.0, 9.0, 9.0, 1.2, 0.3, { ink: OR });

  // Foundation Corner & Perimeter Support Pillars
  for (const px of [-8.5, -3.0, 3.0, 8.5]) {
    for (const pz of [-8.5, -3.0, 3.0, 8.5]) {
      cyl(px, 0, pz, 0.25, 1.2, { ink: OR });
    }
  }

  // 4 Ceremonial 4-Step Stairways connecting Ground (Y=0) to Engawa Deck (Y=1.2)
  // Step rise = 0.30m, Step run = 0.45m
  stairs(0, 0, -10.8, '+z', 4, 3.4, { rise: 0.30, run: 0.45, ink: OR }); // North entrance
  stairs(0, 0, 10.8, '-z', 4, 3.4, { rise: 0.30, run: 0.45, ink: OR });  // South entrance
  stairs(-10.8, 0, 0, '+x', 4, 3.4, { rise: 0.30, run: 0.45, ink: OR }); // West entrance
  stairs(10.8, 0, 0, '-x', 4, 3.4, { rise: 0.30, run: 0.45, ink: OR });  // East entrance

  // Engawa Balustrades with entry openings
  rail(-9.0, -9.0, -2.0, -9.0, 1.2, { ink: OR }); rail(2.0, -9.0, 9.0, -9.0, 1.2, { ink: OR });
  rail(-9.0, 9.0, -2.0, 9.0, 1.2, { ink: OR });   rail(2.0, 9.0, 9.0, 9.0, 1.2, { ink: OR });
  rail(-9.0, -9.0, -9.0, -2.0, 1.2, { ink: OR }); rail(-9.0, 2.0, -9.0, 9.0, 1.2, { ink: OR });
  rail(9.0, -9.0, 9.0, -2.0, 1.2, { ink: OR });   rail(9.0, 2.0, 9.0, 9.0, 1.2, { ink: OR });

  // Ground Sanctuary Enclosure Walls with 4 Sliding Shōji Portals
  wallX(-6.5, 6.5, -6.5, 1.2, 5.5, 0.3, [[-1.8, 1.8, 0, 3.6]], { ink: BK });
  wallX(-6.5, 6.5, 6.5, 1.2, 5.5, 0.3, [[-1.8, 1.8, 0, 3.6]], { ink: BK });
  wallZ(-6.5, 6.5, -6.5, 1.2, 5.5, 0.3, [[-1.8, 1.8, 0, 3.6]], { ink: BK });
  wallZ(-6.5, 6.5, 6.5, 1.2, 5.5, 0.3, [[-1.8, 1.8, 0, 3.6]], { ink: BK });

  // Central Altar Shrine: Buddha Gilded Lotus Dais & Kōro Incense Burner
  box(0, 1.2, -3.2, 2.4, 0.6, 1.6, { ink: OR }); // Lotus altar base
  cyl(0, 1.8, -3.2, 0.6, 1.4, { ink: OR });      // Buddha statue form
  cyl(0, 1.2, -1.2, 0.4, 0.8, { ink: BK });      // Cast-bronze Kōro incense urn
  box(-2.4, 1.2, 0, 1.4, 0.15, 1.4, { ink: GR }); // Tatami meditation cushions
  box(2.4, 1.2, 0, 1.4, 0.15, 1.4, { ink: GR });

  // Interior Switchback Stairs wrapping Shinbashira (Ground Y=1.2 -> Tier 1 Y=8.0)
  // Flight 1A: Y=1.2 -> Y=4.6m (12 steps, rise=0.283m, run=0.40m, width=1.6m)
  stairs(-3.5, 1.2, -4.5, '+x', 12, 1.6, { rise: 0.2833, run: 0.40, ink: OR });
  slab(1.3, -5.5, 5.0, -2.5, 4.6, 0.3, { ink: OR }); // Intermediate rest landing 1
  // Flight 1B: Y=4.6 -> Y=8.0m (12 steps, rise=0.283m, run=0.40m, width=1.6m)
  stairs(3.8, 4.6, -2.5, '+z', 12, 1.6, { rise: 0.2833, run: 0.40, ink: OR });

  // Pagoda Tier 1 Mezzanine Deck at Y = 8.0m with Open Stairwell Well
  slab(-10.0, -10.0, 10.0, -2.8, 8.0, 0.4, { ink: BK }); // North floor slab
  slab(-10.0, 2.5, 10.0, 10.0, 8.0, 0.4, { ink: BK });  // South floor slab
  slab(-10.0, -2.8, 2.6, 2.5, 8.0, 0.4, { ink: BK });   // West floor wing
  slab(5.0, -2.8, 10.0, 2.5, 8.0, 0.4, { ink: BK });    // East floor wing
  // Protective balustrades guarding Tier 1 stairwell aperture
  rail(2.6, -2.8, 2.6, 2.5, 8.0, { ink: OR });
  rail(2.6, -2.8, 5.0, -2.8, 8.0, { ink: OR });

  // Tokukyō cantilevered brackets & decorative eave borders
  for (const bx of [-9.5, 0, 9.5]) {
    for (const bz of [-9.5, 0, 9.5]) {
      box(bx, 7.2, bz, 0.8, 0.8, 0.8, { noCollide: true, ink: OR });
    }
  }

  // Tier 1 Roof Corner Grapple Rings (4 Rings with safe 1.2m clearance above roof slab)
  ring(-10.0, 9.6, -10.0, 'y');
  ring(10.0, 9.6, -10.0, 'y');
  ring(-10.0, 9.6, 10.0, 'y');
  ring(10.0, 9.6, 10.0, 'y');

  // Interior Stairs Flight 2: Mezzanine Y=8.0 -> Balcony Y=16.0
  // Flight 2A: Y=8.0 -> Y=12.0m (12 steps, rise=0.333m, run=0.40m, width=1.6m)
  stairs(1.3, 8.0, 4.5, '-x', 12, 1.6, { rise: 0.3333, run: 0.40, ink: OR });
  slab(-5.5, 2.5, -3.5, 5.5, 12.0, 0.3, { ink: OR }); // Intermediate rest landing 2
  // Flight 2B: Y=12.0 -> Y=16.0m (12 steps, rise=0.333m, run=0.40m, width=1.6m)
  stairs(-3.8, 12.0, 2.5, '-z', 12, 1.6, { rise: 0.3333, run: 0.40, ink: OR });

  // Pagoda Tier 2 Mid-Level Balcony at Y = 16.0m with Open Stairwell Well
  slab(-7.5, -7.5, 7.5, -2.5, 16.0, 0.4, { ink: OR }); // North balcony
  slab(-7.5, 2.8, 7.5, 7.5, 16.0, 0.4, { ink: OR });   // South balcony
  slab(-2.6, -2.5, 7.5, 2.8, 16.0, 0.4, { ink: OR });  // East balcony
  slab(-7.5, -2.5, -5.0, 2.8, 16.0, 0.4, { ink: OR }); // West balcony wing
  // Balcony perimeter rails
  rail(-7.5, -7.5, 7.5, -7.5, 16.0, { ink: OR });
  rail(-7.5, 7.5, 7.5, 7.5, 16.0, { ink: OR });
  rail(-7.5, -7.5, -7.5, 7.5, 16.0, { ink: OR });
  rail(7.5, -7.5, 7.5, 7.5, 16.0, { ink: OR });
  // Protective interior well railings
  rail(-2.6, -2.5, -2.6, 2.8, 16.0, { ink: OR });
  rail(-5.0, 2.8, -2.6, 2.8, 16.0, { ink: OR });

  // Tier 2 Corner Grapple Rings (4 Rings with safe clearance)
  ring(-8.0, 17.6, -8.0, 'y');
  ring(8.0, 17.6, -8.0, 'y');
  ring(-8.0, 17.6, 8.0, 'y');
  ring(8.0, 17.6, 8.0, 'y');

  // Interior Stairs Flight 3: Balcony Y=16.0 -> Temple Bell Loft Y=20.0
  // Flight 3: 12 steps, rise=0.333m, run=0.40m, width=1.5m
  stairs(-2.5, 16.0, -4.0, '+x', 12, 1.5, { rise: 0.3333, run: 0.40, ink: OR });

  // Tier 3 Great Temple Bell Loft (Bonshō) at Y = 20.0m with Stairwell Well
  slab(-5.5, -2.8, 5.5, 5.5, 20.0, 0.4, { ink: OR });   // South floor
  slab(-5.5, -5.5, -2.8, -2.8, 20.0, 0.4, { ink: OR }); // West north corner
  slab(2.5, -5.5, 5.5, -2.8, 20.0, 0.4, { ink: OR });  // East north corner
  rail(-5.5, -5.5, 5.5, -5.5, 20.0, { ink: OR });
  rail(-5.5, 5.5, 5.5, 5.5, 20.0, { ink: OR });
  rail(-5.5, -5.5, -5.5, 5.5, 20.0, { ink: OR });
  rail(5.5, -5.5, 5.5, 5.5, 20.0, { ink: OR });
  rail(-2.8, -2.8, 2.5, -2.8, 20.0, { ink: OR }); // Interior well rail

  // Suspended Bronze Temple Bell (Bonshō)
  cyl(0, 20.8, 0, 1.2, 2.2, { ink: OR });
  sphere(0, 23.0, 0, 1.1, { ink: OR });
  box(0, 23.4, 0, 0.3, 1.2, 0.3, { noCollide: true, ink: BK }); // Hanging yoke

  // Interior Stairs Flight 4: Temple Bell Loft Y=20.0 -> Upper Roof Deck Y=24.0
  // Flight 4: 12 steps, rise=0.333m, run=0.40m, width=1.4m
  stairs(3.8, 20.0, -2.5, '+z', 12, 1.4, { rise: 0.3333, run: 0.40, ink: OR });

  // Pagoda Tier 3 Upper Roof Deck at Y = 24.0m with Stairwell Well
  slab(-4.5, -4.5, 2.6, 4.5, 24.0, 0.4, { ink: BK });  // West floor
  slab(2.6, -4.5, 4.5, -2.8, 24.0, 0.4, { ink: BK }); // East north corner
  slab(2.6, 2.5, 4.5, 4.5, 24.0, 0.4, { ink: BK });   // East south corner
  rail(2.6, -2.8, 2.6, 2.5, 24.0, { ink: BK });        // Well rail

  // Tier 3 Corner Grapple Rings (4 Rings with safe clearance)
  ring(-5.5, 25.6, -5.5, 'y');
  ring(5.5, 25.6, -5.5, 'y');
  ring(-5.5, 25.6, 5.5, 'y');
  ring(5.5, 25.6, 5.5, 'y');

  // Master Calligrapher's Cedar Brush Finial & Sōrin Spire (Y = 28.0m -> 34.0m)
  cyl(0, 24.4, 0, 0.4, 4.0, { ink: OR }); // Spire shaft
  for (const ry of [25.0, 25.8, 26.6, 27.4, 28.2]) {
    cyl(0, ry, 0, 0.7, 0.15, { ink: OR }); // Concentric Kurin rings
  }
  // The Giant Calligraphy Brush (Fude) Apex
  cyl(0, 28.5, 0, 0.3, 3.5, { ink: OR }); // Cedar brush handle
  cyl(0, 32.0, 0, 0.5, 2.0, { ink: BK }); // Hog-bristle brush tip
  cone(0, 33.5, 0, 0.5, 1.5, BK);          // Fine brush point
  ring(0, 35.2, 0, 'y');                  // Crowning Spire Grapple Jewel (Hōju)

  function cone(x, y, z, r, h, ink = BK) {
    const g = new THREE.ConeGeometry(r, h, 8);
    g.translate(x, y + h / 2, z);
    addGeo(g, ink);
  }

  // ==================== 3. SECTOR 1: INK STREAM, DRUM BRIDGE & GRAND TORII (NORTH) ====================
  // Sinuous Ink Stream Channel (Y = -1.8m to -1.0m, recessed trench)
  box(0, -1.8, -32.0, 2 * P + T, 0.8, 10.0, { ink: BL }); // Riverbed trench

  // Riverbank Stone Ramps for seamless recovery (Y = -1.2m -> 0.0m)
  stairs(-10.0, -1.2, -28.8, '+z', 4, 3.0, { rise: 0.30, run: 0.45, ink: BK });
  stairs(10.0, -1.2, -28.8, '+z', 4, 3.0, { rise: 0.30, run: 0.45, ink: BK });
  stairs(-10.0, -1.2, -35.2, '-z', 4, 3.0, { rise: 0.30, run: 0.45, ink: BK });
  stairs(10.0, -1.2, -35.2, '-z', 4, 3.0, { rise: 0.30, run: 0.45, ink: BK });

  // Floating Water-Lilies & River Stepping Stones
  for (const [rx, rz] of [[-24.0, -32.0], [-18.0, -31.0], [18.0, -33.0], [24.0, -32.0], [32.0, -31.5]]) {
    cyl(rx, -1.2, rz, 1.1, 0.4, { seg: 8, ink: BK });
  }

  // Arched Vermilion Drum Bridge (Taiko-bashi) across Ink Stream at (0, 0, -32.0)
  // Step Rise: 0.30m, Step Run: 0.45m connecting Ground (Y=0) to Bridge Apex (Y=3.0m)
  stairs(0, 0, -24.5, '-z', 10, 3.4, { rise: 0.30, run: 0.45, ink: RD }); // South flight ascending to apex
  slab(-1.7, -35.0, 1.7, -29.0, 3.0, 0.35, { ink: RD });                 // Flush crest landing (6.0m span)
  stairs(0, 0, -39.5, '+z', 10, 3.4, { rise: 0.30, run: 0.45, ink: RD }); // North flight ascending to apex

  // Bridge Balustrades & Bronze Finials (Giboshi)
  rail(-1.7, -39.5, -1.7, -24.5, 3.0, { ink: RD });
  rail(1.7, -39.5, 1.7, -24.5, 3.0, { ink: RD });
  for (const gz of [-39.0, -35.0, -32.0, -29.0, -25.0]) {
    sphere(-1.7, 4.0, gz, 0.25, { ink: OR });
    sphere(1.7, 4.0, gz, 0.25, { ink: OR });
  }

  // Monumental Grand Torii Gate at (0, 0, -44.0)
  cyl(-5.5, 0, -44.0, 0.7, 14.0, { ink: RD }); // West Pillar
  cyl(5.5, 0, -44.0, 0.7, 14.0, { ink: RD });  // East Pillar
  box(0, 10.5, -44.0, 13.0, 0.8, 0.8, { ink: RD }); // Lower Nuki beam
  box(0, 13.5, -44.0, 16.0, 1.1, 1.2, { ink: RD }); // Upper Kasagi lintel (walkable)
  rail(-7.5, -44.0, 7.5, -44.0, 13.5, { ink: RD });  // Balustrade wire
  ring(-7.5, 15.2, -44.0, 'z'); // Origami Crane Perch West
  ring(7.5, 15.2, -44.0, 'z');  // Origami Crane Perch East

  // ==================== 4. SECTOR 2: KARESANSUI GRAVEL OCEAN & WAR FAN JUMP-PAD (EAST) ====================
  // Concentric Sand Wave Berms for low crouch cover
  for (let wx = 18.0; wx <= 42.0; wx += 6.0) {
    box(wx, 0, 0, 0.5, 0.6, 32.0, { noCollide: true, ink: BL });
  }

  // Sanzon-seki Sacred Stone Triad
  // Central Great Sentinel Boulder
  box(28.0, 0, 0, 4.2, 9.0, 3.6, { ink: BK });
  box(28.0, 8.8, 0, 3.8, 0.3, 3.2, { ink: GR }); // Emerald moss cap sniper perch
  ring(28.0, 10.2, 0, 'y'); // Megalith grapple apex

  // Flanking Attendant Boulders
  box(28.0, 0, -7.0, 3.0, 4.2, 2.6, { ink: BK });
  box(28.0, 0, 7.0, 3.2, 5.0, 2.8, { ink: BK });

  // Secondary Boulder Islets (Turtle & Crane Islands)
  box(36.0, 0, -14.0, 3.4, 2.2, 2.8, { ink: BK });
  box(36.0, 0, 14.0, 3.2, 2.6, 3.0, { ink: BK });

  // Giant Folding War Fan (Ōgi) Springboard Jump-Pad at (22.0, 0, -22.0)
  box(22.0, 0, -22.0, 4.5, 0.4, 4.5, { ink: RD }); // Fan base
  box(22.0, 0.4, -22.0, 4.0, 0.2, 4.0, { ink: OR }); // Springboard surface
  ring(22.0, 6.0, -22.0, 'y'); // Launch aim guide ring
  L.breakables.push({
    pos: new THREE.Vector3(22.0, 0.4, -22.0),
    radius: 2.8,
    type: 'springboard',
    jumpVelocity: 18.0
  });

  // Kinetic Sand Rake (Kumade) prop
  box(38.0, 0, -4.0, 0.3, 2.4, 0.3, { ink: OR });
  box(38.0, 0, -4.0, 2.2, 0.3, 0.8, { ink: OR });

  // ==================== 5. SECTOR 3: MOSO BAMBOO FOREST & DOJO TRAINING (WEST) ====================
  // 50+ Segmented Moso Bamboo Stalks
  const bambooSpots = [];
  for (let bx = -42.0; bx <= -18.0; bx += 3.8) {
    for (let bz = -22.0; bz <= 22.0; bz += 4.2) {
      if (Math.abs(bx + 30.0) < 3.0 && Math.abs(bz) < 4.0) continue; // Keep central clearing open
      const bh = 18.0 + (Math.sin(bx * 3 + bz) * 4.0);
      cyl(bx, 0, bz, 0.32, bh, { seg: 6, ink: GR });
      // Nodal rings
      for (let ny = 1.4; ny < bh; ny += 2.0) {
        cyl(bx, ny, bz, 0.36, 0.08, { noCollide: true, seg: 6, ink: BK });
      }
      bambooSpots.push([bx, bh, bz]);
    }
  }

  // High-Canopy Bamboo Grapple Nodes (6 nodes for aerial swinging between stalk clusters)
  for (const [gx, gy, gz] of [[-36.0, 15.0, -16.0], [-24.0, 15.0, -16.0], [-32.0, 15.0, 2.0], [-20.0, 15.0, 2.0], [-36.0, 15.0, 16.0], [-24.0, 15.0, 16.0]]) {
    ring(gx, gy, gz, 'y');
  }

  // Winding Slate Stepping Trail (Tobi-ishi) with Kintsugi Gold Veins
  let stoneZ = -22.0;
  for (let i = 0; i < 18; i++) {
    const sx = -30.0 + Math.sin(i * 0.7) * 4.0;
    box(sx, 0.02, stoneZ, 1.2, 0.08, 1.2, { noCollide: true, ink: BK });
    box(sx, 0.04, stoneZ, 0.1, 0.02, 1.0, { noCollide: true, ink: OR }); // Kintsugi gold vein
    stoneZ += 2.4;
  }

  // Cast-Iron Smoke Lanterns (Tōrō) & Destructible Straw Makiwara Training Dummies
  for (const [tx, tz] of [[-32.0, -10.0], [-32.0, 10.0], [-24.0, -16.0], [-24.0, 16.0]]) {
    cyl(tx, 0, tz, 0.4, 0.6, { ink: BK });
    box(tx, 0.6, tz, 0.8, 0.8, 0.8, { ink: BK });
    cone(tx, 1.4, tz, 0.9, 0.6, BK);
  }

  // 3 Makiwara Training Dummies
  for (const [mx, mz] of [[-28.0, -4.0], [-28.0, 0.0], [-28.0, 4.0]]) {
    cyl(mx, 0, mz, 0.28, 1.8, { ink: OR });
    cyl(mx, 0.8, mz, 0.34, 0.8, { ink: GR });
  }

  // ==================== 6. SECTOR 4: CHASHITSU TEA HOUSE & SHISHI-ODOSHI (SOUTH) ====================
  // Tea Ceremony House at (0, 0, 36.0)
  slab(-5.0, 31.0, 5.0, 41.0, 1.2, 0.3, { ink: OR }); // Raised Tatami Deck
  stairs(0, 0, 29.2, '+z', 4, 3.2, { rise: 0.30, run: 0.45, ink: OR }); // Entry steps

  // Tea House Walls with Sliding Shōji & Entrance Portal
  wallX(-5.0, 5.0, 31.0, 1.2, 4.0, 0.25, [[-1.2, 1.2, 0, 2.8]], { ink: BK }); // Entrance portal
  wallX(-5.0, 5.0, 41.0, 1.2, 4.0, 0.25, [], { ink: BK });
  wallZ(31.0, 41.0, -5.0, 1.2, 4.0, 0.25, [[34.0, 38.0, 0, 2.8]], { ink: BK });
  wallZ(31.0, 41.0, 5.0, 1.2, 4.0, 0.25, [[34.0, 38.0, 0, 2.8]], { ink: BK });

  // Thatched Roof Pavilion Cap
  box(0, 5.2, 36.0, 11.2, 0.8, 11.2, { ink: BK });
  ring(0, 7.0, 36.0, 'y'); // Tea House Roof Grapple Ring with clear clearance

  // Low Tea Table (Chabudai) & Tatami Mat Borders
  box(0, 1.2, 36.0, 2.2, 0.45, 1.6, { ink: BK });
  box(0, 1.2, 36.0, 4.4, 0.05, 4.4, { noCollide: true, ink: GR });

  // Kinetic Shishi-odoshi (Bamboo Deer-Scarer) at (8.0, 0, 32.0)
  // Static Flume & Pivot Uprights
  cyl(7.2, 0, 32.0, 0.12, 1.8, { ink: GR });
  cyl(8.8, 0, 32.0, 0.12, 1.8, { ink: GR });
  box(8.0, 1.6, 32.0, 1.8, 0.1, 0.1, { ink: OR }); // Axle
  box(8.0, 0, 30.8, 1.2, 0.6, 1.2, { ink: BK });    // Striking stone

  // Animated Pivoting Bamboo Tube (Zero-allocation in update)
  const fountainGroup = new THREE.Group();
  fountainGroup.position.set(8.0, 1.6, 32.0);
  const rockerGeo = new THREE.CylinderGeometry(0.14, 0.14, 2.2, 8);
  rockerGeo.rotateX(Math.PI / 2);
  const rockerMesh = new THREE.Mesh(rockerGeo, B.makeInkMaterial ? B.makeInkMaterial({ ink: GR }) : undefined);
  if (rockerMesh) {
    fountainGroup.add(rockerMesh);
    scene.add(fountainGroup);
    L.meshes.push(rockerMesh);
    L.animated.push({
      mesh: fountainGroup,
      update: (t) => {
        // 5-second rhythmic tip-and-clack cycle
        const cycle = (t * 0.8) % Math.PI;
        const angle = cycle > Math.PI * 0.75 ? Math.sin((cycle - Math.PI * 0.75) * 4) * 0.45 : 0;
        fountainGroup.rotation.x = angle;
      }
    });
  }

  // ==================== 7. AERIAL KOINOBORI CARP WINDSOCKS ====================
  // 3 High-Altitude Carp Windsock Flagpoles (Y = 25m -> 32m)
  for (const [kx, kz] of [[-18.0, -18.0], [18.0, -18.0], [0, 22.0]]) {
    cyl(kx, 0, kz, 0.35, 28.0, { ink: OR });
    box(kx, 27.5, kz, 3.2, 0.8, 0.8, { noCollide: true, ink: RD }); // Carp mouth
    ring(kx, 29.2, kz, 'y'); // Carp grapple harness above mast head
  }

  // ==================== 8. MULTIPLAYER ARENA ENHANCEMENTS ====================
  if (arena) {
    // Arena Geodesic Dome with Cinnabar Sun Keystone
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
    sphere(0, 90, 0, 2.4, { ink: RD }); // Apex Cinnabar Sun

    // 5 Suspended Paper Lantern Platforms
    const sPlats = [
      [0, 26, 0, 8, 8],
      [-26, 20, -22, 6, 6],
      [26, 20, 22, 6, 6],
      [24, 20, -24, 5, 5],
      [-24, 20, 24, 5, 5]
    ];
    for (const [px, py, pz, pw, pd] of sPlats) {
      slab(px - pw / 2, pz - pd / 2, px + pw / 2, pz + pd / 2, py, 0.4, { ink: OR });
      ring(px, py - 1.3, pz, 'y');
      orientedCyl([px, py, pz], [px, 88, pz], 0.08, 4, BK);
    }

    const rs = [
      [0, 1.2, 38.0], [0, 0, -46.0], [28.0, 0, -16.0], [-28.0, 0, 16.0],
      [0, 1.2, -7.0], [0, 1.2, 7.0], [20.0, 0, -28.0], [-34.0, 0, 0],
      [28.0, 0, 0], [8.0, 0, 34.0], [-22.0, 0, -22.0], [22.0, 0, -22.0],
      [0, 26, 0], [-26, 20, -22], [26, 20, 22], [0, 16.0, 6.0]
    ];
    rs.forEach((pos) => spawn(...pos));
    L.arenaSpawns = [...L.spawns];
  } else {
    // Solo Wave Spawns
    spawn(0, 1.2, 36.0); // Player Start
    spawn(0, 0, -46.0);
    spawn(28.0, 0, -16.0);
    spawn(-28.0, 0, 16.0);
    spawn(0, 1.2, -7.0);
    spawn(0, 1.2, 7.0);
    spawn(20.0, 0, -28.0);
    spawn(-34.0, 0, 0);
    spawn(28.0, 0, 0);
    spawn(8.0, 0, 34.0);
  }

  // Player Start Position
  L.playerStart.set(0, 1.2, 36.0);

  // Symmetric Multiplayer Team Spawns
  L.teamSpawns = [
    [[0, 0, -46.0], [28.0, 0, -16.0], [0, 1.2, -7.0], [20.0, 0, -28.0], [28.0, 0, 0]].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    [[0, 1.2, 38.0], [-28.0, 0, 16.0], [0, 1.2, 7.0], [-34.0, 0, 0], [8.0, 0, 34.0]].map(([x, y, z]) => new THREE.Vector3(x, y, z))
  ];

  // Sniper Vantage Perches
  sniper(0, 34.0, 0);       // Master Calligrapher Brush Finial
  sniper(0, 24.0, 0);       // Pagoda Tier 3 Balcony
  sniper(0, 20.0, 0);       // Temple Bell Loft
  sniper(0, 16.0, 0);       // Pagoda Tier 2 Balcony
  sniper(0, 13.5, -44.0);   // Grand Torii Crossbeam
  sniper(28.0, 9.0, 0);     // Sentinel Megalith Moss Peak
  sniper(0, 4.8, -32.0);    // Vermilion Drum Bridge Apex
  sniper(-30.0, 12.0, 0);   // Bamboo Grove Canopy Ledge
  sniper(-34.0, 6.0, -P + 3.8); // Northwest Pine Ledge

  // Pickups Distributed across all sectors & tiers
  pickup(0, 1.2, 0);         // Pagoda Altar Dais
  pickup(0, 16.0, 6.0);      // Tier 2 Balcony South
  pickup(0, 24.0, -4.0);     // Tier 3 Balcony North
  pickup(0, 20.0, 0);        // Temple Bell Platform
  pickup(28.0, 0, 0);        // Sentinel Boulder Base
  pickup(28.0, 0, -12.0);    // Raked Sand Ocean North
  pickup(22.0, 0, -22.0);    // War Fan Jump-Pad Base
  pickup(-28.0, 0, 0);       // Bamboo Grove Central Clearing
  pickup(-36.0, 0, -14.0);   // Stepping Stone North Fork
  pickup(-30.0, 0, 10.0);    // Makiwara Training Cache
  pickup(0, 4.8, -32.0);     // Drum Bridge Crest
  pickup(0, 0, -44.0);       // Grand Torii Threshold
  pickup(0, 1.2, 36.0);      // Tea Pavilion Tatami Center
  pickup(8.0, 0, 32.0);      // Shishi-odoshi Fountain Base

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  

  
  // === DREAM AUTO-INJECTED MACRO STRUCTURES ===

  // === MACRO STRUCTURE: Bonshō Bell & Tea Pavilion at (-31, 0, -31) ===
  box(-31, 0, -31, 8.4, 0.6, 8.4, { ink: BL });
  box(-31, 0 + 0.6, -31, 7.6, 0.4, 7.6, { ink: BL });
  box(-31 - 3.2, 0 + 1.0, -31 - 3.2, 0.6, 4.2, 0.6, { ink: BK });
  box(-31 + 3.2, 0 + 1.0, -31 - 3.2, 0.6, 4.2, 0.6, { ink: BK });
  box(-31 - 3.2, 0 + 1.0, -31 + 3.2, 0.6, 4.2, 0.6, { ink: BK });
  box(-31 + 3.2, 0 + 1.0, -31 + 3.2, 0.6, 4.2, 0.6, { ink: BK });
  slab(-31 - 4.0, -31 - 4.0, -31 + 4.0, -31 + 4.0, 0 + 4.2, 0.4, { ink: OR });
  rail(-31 - 4.0, -31 - 4.0, -31 + 4.0, -31 - 4.0, 0 + 4.2, { ink: OR });
  rail(-31 - 4.0, -31 + 4.0, -31 + 4.0, -31 + 4.0, 0 + 4.2, { ink: OR });
  rail(-31 - 4.0, -31 - 4.0, -31 - 4.0, -31 + 4.0, 0 + 4.2, { ink: OR });
  rail(-31 + 4.0, -31 - 4.0, -31 + 4.0, -31 + 4.0, 0 + 4.2, { ink: OR });
  box(-31, 0 + 4.4, -31, 9.6, 0.4, 9.6, { noCollide: true, ink: BK });
  box(-31, 0 + 5.6, -31, 6.0, 0.4, 6.0, { noCollide: true, ink: BK });
  box(-31, 0 + 6.8, -31, 2.4, 0.5, 2.4, { noCollide: true, ink: BK });
  cyl(-31, 0 + 3.0, -31, 0.8, 1.6, { seg: 8, noCollide: true, ink: RD });
  ring(-31, 0 + 8.0, -31, 'z');
  pickup(-31, 0 + 4.4, -31);

  // === MACRO STRUCTURE: Torii Gate Overlook at (-13, 0, -37) ===
  box(-13 - 3.0, 0, -37, 0.8, 6.0, 0.8, { ink: RD });
  box(-13 + 3.0, 0, -37, 0.8, 6.0, 0.8, { ink: RD });
  box(-13, 0 + 5.2, -37, 7.4, 0.6, 1.0, { ink: RD });
  box(-13, 0 + 4.4, -37, 6.2, 0.4, 0.6, { ink: RD });
  slab(-13 - 3.5, -37 - 1.5, -13 + 3.5, -37 + 1.5, 0 + 4.0, 0.3, { ink: OR });
  rail(-13 - 3.5, -37 - 1.5, -13 + 3.5, -37 - 1.5, 0 + 4.0, { ink: BK });
  rail(-13 - 3.5, -37 + 1.5, -13 + 3.5, -37 + 1.5, 0 + 4.0, { ink: BK });
  box(-13 - 2.5, 0, -37 + 2.5, 0.6, 1.4, 0.6, { ink: BK });
  box(-13 + 2.5, 0, -37 + 2.5, 0.6, 1.4, 0.6, { ink: BK });
  ring(-13, 0 + 8.3, -37, 'z');

  // === MACRO STRUCTURE: Torii Gate Overlook at (-13, 0, -19) ===
  box(-13 - 3.0, 0, -19, 0.8, 6.0, 0.8, { ink: RD });
  box(-13 + 3.0, 0, -19, 0.8, 6.0, 0.8, { ink: RD });
  box(-13, 0 + 5.2, -19, 7.4, 0.6, 1.0, { ink: RD });
  box(-13, 0 + 4.4, -19, 6.2, 0.4, 0.6, { ink: RD });
  slab(-13 - 3.5, -19 - 1.5, -13 + 3.5, -19 + 1.5, 0 + 4.0, 0.3, { ink: OR });
  rail(-13 - 3.5, -19 - 1.5, -13 + 3.5, -19 - 1.5, 0 + 4.0, { ink: BK });
  rail(-13 - 3.5, -19 + 1.5, -13 + 3.5, -19 + 1.5, 0 + 4.0, { ink: BK });
  box(-13 - 2.5, 0, -19 + 2.5, 0.6, 1.4, 0.6, { ink: BK });
  box(-13 + 2.5, 0, -19 + 2.5, 0.6, 1.4, 0.6, { ink: BK });
  ring(-13, 0 + 8.3, -19, 'z');

  // === MACRO STRUCTURE: Bonshō Bell & Tea Pavilion at (-13, 0, 41) ===
  box(-13, 0, 41, 8.4, 0.6, 8.4, { ink: BL });
  box(-13, 0 + 0.6, 41, 7.6, 0.4, 7.6, { ink: BL });
  box(-13 - 3.2, 0 + 1.0, 41 - 3.2, 0.6, 4.2, 0.6, { ink: BK });
  box(-13 + 3.2, 0 + 1.0, 41 - 3.2, 0.6, 4.2, 0.6, { ink: BK });
  box(-13 - 3.2, 0 + 1.0, 41 + 3.2, 0.6, 4.2, 0.6, { ink: BK });
  box(-13 + 3.2, 0 + 1.0, 41 + 3.2, 0.6, 4.2, 0.6, { ink: BK });
  slab(-13 - 4.0, 41 - 4.0, -13 + 4.0, 41 + 4.0, 0 + 4.2, 0.4, { ink: OR });
  rail(-13 - 4.0, 41 - 4.0, -13 + 4.0, 41 - 4.0, 0 + 4.2, { ink: OR });
  rail(-13 - 4.0, 41 + 4.0, -13 + 4.0, 41 + 4.0, 0 + 4.2, { ink: OR });
  rail(-13 - 4.0, 41 - 4.0, -13 - 4.0, 41 + 4.0, 0 + 4.2, { ink: OR });
  rail(-13 + 4.0, 41 - 4.0, -13 + 4.0, 41 + 4.0, 0 + 4.2, { ink: OR });
  box(-13, 0 + 4.4, 41, 9.6, 0.4, 9.6, { noCollide: true, ink: BK });
  box(-13, 0 + 5.6, 41, 6.0, 0.4, 6.0, { noCollide: true, ink: BK });
  box(-13, 0 + 6.8, 41, 2.4, 0.5, 2.4, { noCollide: true, ink: BK });
  cyl(-13, 0 + 3.0, 41, 0.8, 1.6, { seg: 8, noCollide: true, ink: RD });
  ring(-13, 0 + 8.0, 41, 'z');
  pickup(-13, 0 + 4.4, 41);
  // === END DREAM AUTO-INJECTED MACRO STRUCTURES ===

  
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===

  // Prop: Tatami Bench
  box(-47 - 0.9, 0, -39, 0.3, 0.5, 0.6, { ink: BK });
  box(-47 + 0.9, 0, -39, 0.3, 0.5, 0.6, { ink: BK });
  box(-47, 0 + 0.5, -39, 2.2, 0.15, 0.8, { ink: BL });

  // Prop: Tatami Bench
  box(-15 - 0.9, 0, -39, 0.3, 0.5, 0.6, { ink: BK });
  box(-15 + 0.9, 0, -39, 0.3, 0.5, 0.6, { ink: BK });
  box(-15, 0 + 0.5, -39, 2.2, 0.15, 0.8, { ink: BL });

  // Prop: Shoji Divider
  box(-39, 0, -7, 2.4, 2.2, 0.1, { ink: BL });
  box(-39, 0, -7, 2.5, 2.3, 0.15, { noCollide: true, ink: BK });

  // Prop: Tsukubai Basin
  cyl(-11, 0, -27, 0.6, 0.8, { seg: 8, ink: BL });
  cyl(-11, 0 + 0.8, -27, 0.5, 0.1, { seg: 8, noCollide: true, ink: RD });

  // Prop: Tatami Bench
  box(-39 - 0.9, 0, -3, 0.3, 0.5, 0.6, { ink: BK });
  box(-39 + 0.9, 0, -3, 0.3, 0.5, 0.6, { ink: BK });
  box(-39, 0 + 0.5, -3, 2.2, 0.15, 0.8, { ink: BL });

  // Prop: Tōrō Lantern
  box(-7, 0, -39, 0.8, 0.4, 0.8, { ink: BL });
  box(-7, 0 + 0.4, -39, 0.4, 0.6, 0.4, { ink: BK });
  box(-7, 0 + 1.0, -39, 0.6, 0.4, 0.6, { ink: OR });
  box(-7, 0 + 1.4, -39, 0.9, 0.2, 0.9, { ink: BK });
  sphere(-7, 0 + 1.6, -39, 0.15, { noCollide: true, ink: OR });

  // Prop: Tatami Bench
  box(-19 - 0.9, 0, -39, 0.3, 0.5, 0.6, { ink: BK });
  box(-19 + 0.9, 0, -39, 0.3, 0.5, 0.6, { ink: BK });
  box(-19, 0 + 0.5, -39, 2.2, 0.15, 0.8, { ink: BL });

  // Prop: Tōrō Lantern
  box(-7, 0, -15, 0.8, 0.4, 0.8, { ink: BL });
  box(-7, 0 + 0.4, -15, 0.4, 0.6, 0.4, { ink: BK });
  box(-7, 0 + 1.0, -15, 0.6, 0.4, 0.6, { ink: OR });
  box(-7, 0 + 1.4, -15, 0.9, 0.2, 0.9, { ink: BK });
  sphere(-7, 0 + 1.6, -15, 0.15, { noCollide: true, ink: OR });

  // Prop: Tōrō Lantern
  box(29, 0, -47, 0.8, 0.4, 0.8, { ink: BL });
  box(29, 0 + 0.4, -47, 0.4, 0.6, 0.4, { ink: BK });
  box(29, 0 + 1.0, -47, 0.6, 0.4, 0.6, { ink: OR });
  box(29, 0 + 1.4, -47, 0.9, 0.2, 0.9, { ink: BK });
  sphere(29, 0 + 1.6, -47, 0.15, { noCollide: true, ink: OR });

  // Prop: Tatami Bench
  box(17 - 0.9, 0, -39, 0.3, 0.5, 0.6, { ink: BK });
  box(17 + 0.9, 0, -39, 0.3, 0.5, 0.6, { ink: BK });
  box(17, 0 + 0.5, -39, 2.2, 0.15, 0.8, { ink: BL });

  // Prop: Shoji Divider
  box(17, 0, -23, 2.4, 2.2, 0.1, { ink: BL });
  box(17, 0, -23, 2.5, 2.3, 0.15, { noCollide: true, ink: BK });

  // Prop: Shoji Divider
  box(1, 0, -15, 2.4, 2.2, 0.1, { ink: BL });
  box(1, 0, -15, 2.5, 2.3, 0.15, { noCollide: true, ink: BK });

  // Prop: Shoji Divider
  box(21, 0, -39, 2.4, 2.2, 0.1, { ink: BL });
  box(21, 0, -39, 2.5, 2.3, 0.15, { noCollide: true, ink: BK });

  // Prop: Tatami Bench
  box(5 - 0.9, 0, -23, 0.3, 0.5, 0.6, { ink: BK });
  box(5 + 0.9, 0, -23, 0.3, 0.5, 0.6, { ink: BK });
  box(5, 0 + 0.5, -23, 2.2, 0.15, 0.8, { ink: BL });

  // Prop: Tsukubai Basin
  cyl(25, 0, -43, 0.6, 0.8, { seg: 8, ink: BL });
  cyl(25, 0 + 0.8, -43, 0.5, 0.1, { seg: 8, noCollide: true, ink: RD });

  // Prop: Tatami Bench
  box(9 - 0.9, 0, -27, 0.3, 0.5, 0.6, { ink: BK });
  box(9 + 0.9, 0, -27, 0.3, 0.5, 0.6, { ink: BK });
  box(9, 0 + 0.5, -27, 2.2, 0.15, 0.8, { ink: BL });

  // Prop: Shoji Divider
  box(-11, 0, 25, 2.4, 2.2, 0.1, { ink: BL });
  box(-11, 0, 25, 2.5, 2.3, 0.15, { noCollide: true, ink: BK });

  // Prop: Tatami Bench
  box(-19 - 0.9, 0, 29, 0.3, 0.5, 0.6, { ink: BK });
  box(-19 + 0.9, 0, 29, 0.3, 0.5, 0.6, { ink: BK });
  box(-19, 0 + 0.5, 29, 2.2, 0.15, 0.8, { ink: BL });

  // Prop: Tōrō Lantern
  box(-27, 0, 45, 0.8, 0.4, 0.8, { ink: BL });
  box(-27, 0 + 0.4, 45, 0.4, 0.6, 0.4, { ink: BK });
  box(-27, 0 + 1.0, 45, 0.6, 0.4, 0.6, { ink: OR });
  box(-27, 0 + 1.4, 45, 0.9, 0.2, 0.9, { ink: BK });
  sphere(-27, 0 + 1.6, 45, 0.15, { noCollide: true, ink: OR });

  // Prop: Shoji Divider
  box(-27, 0, 33, 2.4, 2.2, 0.1, { ink: BL });
  box(-27, 0, 33, 2.5, 2.3, 0.15, { noCollide: true, ink: BK });

  // Prop: Tatami Bench
  box(-3 - 0.9, 0, 13, 0.3, 0.5, 0.6, { ink: BK });
  box(-3 + 0.9, 0, 13, 0.3, 0.5, 0.6, { ink: BK });
  box(-3, 0 + 0.5, 13, 2.2, 0.15, 0.8, { ink: BL });

  // Prop: Shoji Divider
  box(-11, 0, 49, 2.4, 2.2, 0.1, { ink: BL });
  box(-11, 0, 49, 2.5, 2.3, 0.15, { noCollide: true, ink: BK });

  // Prop: Tsukubai Basin
  cyl(-19, 0, 41, 0.6, 0.8, { seg: 8, ink: BL });
  cyl(-19, 0 + 0.8, 41, 0.5, 0.1, { seg: 8, noCollide: true, ink: RD });

  // Prop: Tōrō Lantern
  box(-15, 0, 1, 0.8, 0.4, 0.8, { ink: BL });
  box(-15, 0 + 0.4, 1, 0.4, 0.6, 0.4, { ink: BK });
  box(-15, 0 + 1.0, 1, 0.6, 0.4, 0.6, { ink: OR });
  box(-15, 0 + 1.4, 1, 0.9, 0.2, 0.9, { ink: BK });
  sphere(-15, 0 + 1.6, 1, 0.15, { noCollide: true, ink: OR });

  // Prop: Tatami Bench
  box(49 - 0.9, 0, 49, 0.3, 0.5, 0.6, { ink: BK });
  box(49 + 0.9, 0, 49, 0.3, 0.5, 0.6, { ink: BK });
  box(49, 0 + 0.5, 49, 2.2, 0.15, 0.8, { ink: BL });

  // Prop: Shoji Divider
  box(13, 0, 37, 2.4, 2.2, 0.1, { ink: BL });
  box(13, 0, 37, 2.5, 2.3, 0.15, { noCollide: true, ink: BK });

  // Prop: Tsukubai Basin
  cyl(9, 0, 13, 0.6, 0.8, { seg: 8, ink: BL });
  cyl(9, 0 + 0.8, 13, 0.5, 0.1, { seg: 8, noCollide: true, ink: RD });

  // Prop: Tatami Bench
  box(21 - 0.9, 0, 13, 0.3, 0.5, 0.6, { ink: BK });
  box(21 + 0.9, 0, 13, 0.3, 0.5, 0.6, { ink: BK });
  box(21, 0 + 0.5, 13, 2.2, 0.15, 0.8, { ink: BL });

  // Prop: Shoji Divider
  box(21, 0, 21, 2.4, 2.2, 0.1, { ink: BL });
  box(21, 0, 21, 2.5, 2.3, 0.15, { noCollide: true, ink: BK });

  // Prop: Tatami Bench
  box(49 - 0.9, 0, 5, 0.3, 0.5, 0.6, { ink: BK });
  box(49 + 0.9, 0, 5, 0.3, 0.5, 0.6, { ink: BK });
  box(49, 0 + 0.5, 5, 2.2, 0.15, 0.8, { ink: BL });

  // Prop: Shoji Divider
  box(45, 0, 49, 2.4, 2.2, 0.1, { ink: BL });
  box(45, 0, 49, 2.5, 2.3, 0.15, { noCollide: true, ink: BK });

  // Prop: Tatami Bench
  box(1 - 0.9, 0, 25, 0.3, 0.5, 0.6, { ink: BK });
  box(1 + 0.9, 0, 25, 0.3, 0.5, 0.6, { ink: BK });
  box(1, 0 + 0.5, 25, 2.2, 0.15, 0.8, { ink: BL });
  // === END DREAM AUTO-INJECTED PROPS ===

  B.finish();
  return L;
}
