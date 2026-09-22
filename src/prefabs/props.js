import * as THREE from 'three';
import { INK } from '../render.js';
import { rand, choose } from '../util.js';
import { splineTube, annularDeck, sweptRibbon } from '../spline-engine.js';
import { createRNG } from '../rebuild/prng.js';
export function buildCampfire(B, x, y, z, o = {}) {
  const { sphere, cyl, box, scene } = B;
  const stoneR = 0.85;

  // 1. Cobblestone Hearth Ring (8 river rocks)
  for (let i = 0; i < 8; i++) {
    const angle = i * (Math.PI / 4);
    const sx = x + Math.cos(angle) * stoneR;
    const sz = z + Math.sin(angle) * stoneR;
    sphere(sx, y + 0.22, sz, 0.22, { ink: INK.BLACK, tag: 'cover' });
  }

  // 2. Charred Wood Ash Bed
  cyl(x, y, z, 0.75, 0.1, { ink: INK.BLACK, noCollide: true });

  // 3. Crossed Charred Logs
  box(x, y + 0.25, z, 1.3, 0.18, 0.22, { ink: INK.BLACK, noCollide: true });
  box(x, y + 0.35, z, 0.22, 0.18, 1.3, { ink: INK.BLACK, noCollide: true });

  // 4. Glowing Red/Orange Embers Core
  sphere(x, y + 0.28, z, 0.35, { ink: INK.ORANGE, noCollide: true });
  sphere(x, y + 0.32, z, 0.18, { ink: INK.RED, noCollide: true });
  sphere(x, y + 0.36, z, 0.12, { ink: INK.ORANGE, noCollide: true });
}

export function buildWoodStack(B, x, y, z, w = 2.4, h = 1.1, d = 1.2, o = {}) {
  const { box } = B;
  const ink = o.ink ?? INK.ORANGE;

  // Main solid stacked log collider & visual body
  box(x, y, z, w, h, d, { ink, tag: 'cover' });

  // Lateral End Stakes holding the pile together
  box(x - w / 2 - 0.08, y, z, 0.12, h + 0.25, d + 0.1, { ink: INK.BLACK, noCollide: true });
  box(x + w / 2 + 0.08, y, z, 0.12, h + 0.25, d + 0.1, { ink: INK.BLACK, noCollide: true });

  // Top log trim
  box(x, y + h, z, w * 0.75, 0.16, d * 0.7, { ink, noCollide: true });
}

export function buildTrailSign(B, x, y, z, o = {}) {
  const { cyl, box } = B;
  const postH = o.h ?? 2.4;

  // Vertical wooden cedar post
  cyl(x, y, z, 0.12, postH, { ink: INK.ORANGE });

  // Primary Signboard
  box(x, y + postH - 0.3, z, 1.4, 0.28, 0.08, { ink: INK.ORANGE, noCollide: true });
  // Arrow tip
  box(x + 0.65, y + postH - 0.3, z, 0.2, 0.2, 0.09, { ink: INK.BLACK, noCollide: true });

  // Secondary Cross Signboard pointing in perpendicular direction
  box(x, y + postH - 0.65, z, 0.08, 0.26, 1.2, { ink: INK.ORANGE, noCollide: true });

  // Cobblestone ground base support
  cyl(x, y, z, 0.45, 0.25, { ink: INK.BLACK, tag: 'cover' });
}

export function buildChoppingBlock(B, x, y, z, o = {}) {
  const { cyl, box } = B;

  // Tree round chopping stump
  cyl(x, y, z, 0.55, 0.85, { ink: INK.ORANGE, tag: 'cover' });

  // Embedded Axe: Iron head embedded into top face
  box(x, y + 0.95, z, 0.38, 0.22, 0.08, { ink: INK.BLACK, noCollide: true });
  // Slanted wooden axe handle
  box(x + 0.25, y + 1.25, z, 0.65, 0.08, 0.06, { ink: INK.ORANGE, noCollide: true });

  // Scattered wood chips around base
  box(x + 0.6, y, z + 0.3, 0.3, 0.06, 0.2, { ink: INK.ORANGE, noCollide: true });
  box(x - 0.5, y, z - 0.4, 0.25, 0.05, 0.35, { ink: INK.ORANGE, noCollide: true });
}

export function buildSurveyTable(B, x, y, z, o = {}) {
  const { box, cyl } = B;

  // 4 Table legs
  box(x - 1.1, y, z - 0.6, 0.14, 1.0, 0.14, { ink: INK.BLACK, noCollide: true });
  box(x + 1.1, y, z - 0.6, 0.14, 1.0, 0.14, { ink: INK.BLACK, noCollide: true });
  box(x - 1.1, y, z + 0.6, 0.14, 1.0, 0.14, { ink: INK.BLACK, noCollide: true });
  box(x + 1.1, y, z + 0.6, 0.14, 1.0, 0.14, { ink: INK.BLACK, noCollide: true });

  // Cedar Tabletop (Y = y + 1.0)
  box(x, y + 1.0, z, 2.6, 0.12, 1.5, { ink: INK.ORANGE, tag: 'cover' });

  // Rolled parchment map on table
  cyl(x - 0.3, y + 1.1, z - 0.2, 0.12, 1.2, { axis: 'x', ink: INK.ORANGE, noCollide: true });

  // Brass surveyor's sighting compass / telescope on tripod
  cyl(x + 0.6, y + 1.1, z + 0.2, 0.14, 0.45, { ink: INK.BLACK, noCollide: true });
  box(x + 0.6, y + 1.45, z + 0.2, 0.65, 0.12, 0.12, { ink: INK.ORANGE, noCollide: true });

  // Kerosene Hurricane Lantern
  cyl(x - 0.8, y + 1.1, z + 0.3, 0.15, 0.4, { ink: INK.BLACK, noCollide: true });
  cyl(x - 0.8, y + 1.25, z + 0.3, 0.12, 0.22, { ink: INK.ORANGE, noCollide: true });
}

export function buildFullGalleon(B, x, y, z, o = {}) {
  const { box, slab, cyl, wedge, ring, stairs, barrel, rail, pickup } = B;
  const W = INK.ORANGE; // Aged Oak Wood
  const BK = INK.BLACK;  // Cast Iron

  // 1. Core Hull & Waterline
  box(x, y, z, 12, 5.5, 32, { ink: W });

  // 2. Curved Wedge Bow
  wedge(x, y, z + 20, 12, 5.5, 8, { dir: '+z', ink: W });

  // 3. Protruding Bowsprit
  cyl(x, y + 6.2, z + 26, 0.4, 9.5, { axis: 'z', ink: BK });

  // 4. Raised Forecastle Deck (Forward)
  box(x, y + 5.5, z + 12, 11, 2.2, 7, { ink: W });
  rail(x - 5.5, z + 8.5, x - 5.5, z + 15.5, y + 7.7, { ink: BK });
  rail(x + 5.5, z + 8.5, x + 5.5, z + 15.5, y + 7.7, { ink: BK });

  // 5. Raised Sterncastle & Captain's Cabin (Aft)
  box(x, y + 5.5, z - 10, 11, 4.2, 11, { ink: W });
  // Poop deck roof / upper observation platform
  slab(x - 5.8, z - 16, x + 5.8, z - 4.5, y + 9.7, 0.4, { ink: W });
  // Aft viewing balcony railing
  rail(x - 5.5, z - 15.8, x + 5.5, z - 15.8, y + 9.7, { ink: BK });
  rail(x - 5.5, z - 15.8, x - 5.5, z - 4.8, y + 9.7, { ink: BK });
  rail(x + 5.5, z - 15.8, x + 5.5, z - 4.8, y + 9.7, { ink: BK });

  // 6. Midship Gun Deck & Broadside Cannons (Z = -4 to +8)
  for (let cz = -2; cz <= 6; cz += 4) {
    // Port battery (left)
    box(x - 6.6, y + 3.2, z + cz, 2.2, 0.9, 1.2, { ink: BK });
    // Starboard battery (right)
    box(x + 6.6, y + 3.2, z + cz, 2.2, 0.9, 1.2, { ink: BK });
  }

  // 7. Stairways Connecting Decks (Open gun deck with unobstructed vertical headroom)
  // Starboard stair up to Forecastle deck (y + 7.7 at z + 8.5)
  stairs(x + 2.8, y + 5.5, z + 5.35, '+z', 7, 1.8, { rise: 2.2 / 7, run: 0.45, ink: W });
  // Port stair up to Poop deck (y + 9.7 at z - 4.5)
  stairs(x - 2.8, y + 5.5, z + 1.8, '-z', 14, 1.8, { rise: 4.2 / 14, run: 0.45, ink: W });

  // 8. Triple Towering Masts
  // Foremast
  cyl(x, y + 7.7, z + 12, 0.6, 18, { ink: BK });
  box(x, y + 21, z + 12, 2.8, 1.0, 2.8, { ink: W }); // Crow's nest
  ring(x, y + 26.8, z + 12, 'y');

  // Mainmast
  cyl(x, y + 5.5, z + 2, 0.85, 24, { ink: BK });
  box(x, y + 26, z + 2, 3.5, 1.2, 3.5, { ink: W }); // Crow's nest
  ring(x, y + 30.8, z + 2, 'y');
  // Horizontal Sail Yard
  cyl(x, y + 18, z + 2, 0.4, 16, { axis: 'x', ink: BK });

  // Mizzenmast
  cyl(x, y + 9.7, z - 10, 0.6, 16, { ink: BK });
  box(x, y + 22, z - 10, 2.8, 1.0, 2.8, { ink: W }); // Crow's nest
  ring(x, y + 26.8, z - 10, 'y');

  // 9. Cargo Hold & Barrels on Gun Deck
  barrel(x + 3.2, y + 5.5, z, 0.8, 1.5, { ink: INK.ORANGE });
  barrel(x + 3.2, y + 5.5, z + 2.0, 0.8, 1.5, { ink: INK.ORANGE });
  barrel(x + 3.2, y + 7.0, z + 1.0, 0.8, 1.5, { ink: INK.ORANGE });
  box(x - 4.5, y + 5.5, z - 2.0, 1.4, 1.4, 1.4, { ink: BK, tag: 'cover' });

  // High-Value Tactical Objective on Poop Deck
  pickup(x, y + 10.0, z - 10.0);
}

export function buildCar(B, x, y, z, o = {}) {
  const { box, cyl } = B;
  const C = o.ink ?? INK.BLUE;

  // Body
  box(x, y + 0.5, z, 4, 1.5, 2, { ink: C });
  // Roof (smaller box on top)
  box(x - 0.5, y + 2, z, 2.5, 1.2, 1.8, { ink: C });

  // Wheels
  cyl(x - 1.5, y + 0.5, z - 1.1, 0.5, 0.2, { axis: 'z', ink: INK.BLACK });
  cyl(x + 1.5, y + 0.5, z - 1.1, 0.5, 0.2, { axis: 'z', ink: INK.BLACK });
  cyl(x - 1.5, y + 0.5, z + 1.1, 0.5, 0.2, { axis: 'z', ink: INK.BLACK });
  cyl(x + 1.5, y + 0.5, z + 1.1, 0.5, 0.2, { axis: 'z', ink: INK.BLACK });
}

export function buildBookStack(B, x, y, z, count = 3, o = {}) {
  const { box } = B;
  const baseW = o.w ?? 8;
  const baseD = o.d ?? 11;
  const thick = o.thick ?? 1.2;
  const inks = [INK.BLUE, INK.ORANGE, INK.RED, INK.BLACK];

  let curY = y;
  for (let i = 0; i < count; i++) {
    const w = baseW - i * 0.4;
    const d = baseD - i * 0.5;
    const bookInk = o.inkSpine != null ? o.inkSpine : inks[i % inks.length];

    // Hardback cover & spine
    box(x, curY, z, w, thick, d, { ink: bookInk, tag: 'cover' });
    // Paper block inside
    box(x + 0.2, curY + 0.1, z, w - 0.6, thick - 0.2, d - 0.4, { ink: INK.ORANGE, noCollide: true });

    curY += thick;
  }
  return curY;
}

export function buildOpenBookRamp(B, x, y, z, w = 6, rise = 3, run = 8, dir = '+z', o = {}) {
  const { stairs, box } = B;
  const steps = Math.max(4, Math.round(rise / 0.3));
  stairs(x, y, z, dir, steps, w, {
    rise: rise / steps,
    run: run / steps,
    ink: o.ink ?? INK.ORANGE
  });
  // Book spine trim
  if (dir === '+z' || dir === '-z') {
    box(x - w / 2, y, z + (dir === '+z' ? run / 2 : -run / 2), 0.4, rise, run, { ink: INK.BLACK });
    box(x + w / 2, y, z + (dir === '+z' ? run / 2 : -run / 2), 0.4, rise, run, { ink: INK.BLACK });
  } else {
    box(x + (dir === '+x' ? run / 2 : -run / 2), y, z - w / 2, run, rise, 0.4, { ink: INK.BLACK });
    box(x + (dir === '+x' ? run / 2 : -run / 2), y, z + w / 2, run, rise, 0.4, { ink: INK.BLACK });
  }
}

export function buildDeskLamp(B, x, y, z, o = {}) {
  const { cyl, box, ring, sphere } = B;
  const armInk = o.ink ?? INK.BLACK;
  const baseR = o.baseR ?? 4.0;

  // Heavy weighted round base
  cyl(x, y, z, baseR, 0.8, { ink: armInk, tag: 'cover' });

  // Lower vertical mast
  cyl(x, y + 0.8, z, 0.6, 12.0, { ink: armInk });
  // Lower knuckle elbow joint
  sphere(x, y + 12.8, z, 1.2, { ink: INK.ORANGE });

  const reachX = o.reachX ?? 8.0;
  const reachZ = o.reachZ ?? 0;
  const headY = y + 18.0;
  const midX = x + reachX * 0.5;
  const midZ = z + reachZ * 0.5;

  cyl(midX, y + 15.0, midZ, 0.5, 7.0, { ink: armInk });

  const lampX = x + reachX;
  const lampZ = z + reachZ;
  box(lampX, headY, lampZ, 5.0, 2.4, 5.0, { ink: INK.BLUE });
  sphere(lampX, headY - 0.8, lampZ, 1.4, { ink: INK.ORANGE, noCollide: true });

  ring(lampX, headY - 2.2, lampZ, 'y');
  ring(x, y + 13.8, z, 'z');
}

export function buildInkwellCover(B, x, y, z, o = {}) {
  const { cyl, ring } = B;
  const r = o.r ?? 2.8;
  const h = o.h ?? 1.8;

  cyl(x, y, z, r, h, { seg: 8, ink: INK.BLACK, tag: 'cover' });
  cyl(x, y + h, z, r * 0.6, 0.6, { ink: INK.ORANGE });
  cyl(x + 0.8, y + h + 0.6, z + 0.8, 0.18, 5.5, { axis: 'x', ink: INK.RED, noCollide: true });
  ring(x + 3.2, y + h + 3.2, z + 0.8, 'x');
}

export function buildSolarArray(B, x, y, z, o = {}) {
  const { box, slab, cyl, sphere, ring } = B;
  const inkHull = o.inkHull ?? INK.BLUE;
  const inkFrame = o.inkFrame ?? INK.BLACK;
  const inkAccent = o.inkAccent ?? INK.ORANGE;

  // 1. Foundation Battery Buffer Block (Tactical Cover: Y = y to y + 1.2m)
  box(x, y, z, 2.2, 1.2, 2.2, { ink: inkHull, tag: 'cover' });

  // 2. Central Structural Spindle Mast
  cyl(x, y + 1.2, z, 0.4, 4.2, { seg: 8, ink: inkFrame });

  // 3. Dual-Axis Rotary Gimbal Joint
  sphere(x, y + 4.8, z, 0.65, { ink: inkAccent });

  // 4. Horizontal Transverse Boom Arm
  box(x, y + 4.8, z, 10.8, 0.35, 0.35, { ink: inkFrame });

  // 5. Dual Photovoltaic Collector Wings (Left & Right)
  slab(x - 5.2, z - 1.2, x - 0.8, z + 1.2, y + 4.9, 0.12, { ink: inkHull, noCollide: true });
  slab(x + 0.8, z - 1.2, x + 5.2, z + 1.2, y + 4.9, 0.12, { ink: inkHull, noCollide: true });

  // Structural Grid Trusses
  box(x - 3.0, y + 5.0, z, 4.2, 0.08, 0.08, { ink: inkFrame, noCollide: true });
  box(x + 3.0, y + 5.0, z, 4.2, 0.08, 0.08, { ink: inkFrame, noCollide: true });

  // 6. Apex Grapple Ring
  ring(x, y + 6.2, z, 'y');
}

export function buildCryoPod(B, x, y, z, o = {}) {
  const { box, cyl } = B;
  const inkHull = o.inkHull ?? INK.BLUE;
  const inkFrame = o.inkFrame ?? INK.BLACK;
  const inkAccent = o.inkAccent ?? INK.ORANGE;

  // 1. Foundation Stasis Sled Cradle (Tactical Cover: 1.2m x 2.2m x 0.4m)
  box(x, y, z, 1.2, 0.4, 2.2, { ink: inkHull, tag: 'cover' });

  // 2. Sealed Capsule Chamber (Waist-high cover: 1.0m x 2.0m x 0.75m)
  box(x, y + 0.4, z, 1.0, 0.75, 2.0, { ink: inkFrame, tag: 'cover' });

  // 3. Frost Viewing Glass (Decorative visor)
  box(x, y + 1.1, z, 0.65, 0.15, 1.4, { ink: INK.BLUE, noCollide: true });

  // 4. Diagnostic Readout Column
  box(x + 0.65, y, z + 0.6, 0.35, 1.25, 0.35, { ink: inkAccent, tag: 'cover' });

  // 5. Cryo Refrigerant Conduit Lines
  cyl(x - 0.55, y + 0.2, z, 0.08, 1.8, { axis: 'z', ink: inkAccent, noCollide: true });
}

export function buildAirlockHatch(B, x, y, z, o = {}) {
  const { box, cyl, sphere, ring } = B;
  const inkHull = o.inkHull ?? INK.BLUE;
  const inkFrame = o.inkFrame ?? INK.BLACK;
  const inkAccent = o.inkAccent ?? INK.ORANGE;

  // 1. Bulkhead Jamb Frame
  box(x - 1.3, y, z, 0.6, 3.4, 0.8, { ink: inkHull });
  box(x + 1.3, y, z, 0.6, 3.4, 0.8, { ink: inkHull });
  box(x, y + 3.0, z, 3.2, 0.5, 0.8, { ink: inkHull });
  box(x, y, z, 3.2, 0.2, 0.8, { ink: inkHull });

  // 2. Reinforced Pressure Door (Full cover block)
  box(x, y + 0.2, z, 1.8, 2.6, 0.35, { ink: inkFrame, tag: 'cover' });

  // 3. Manual Rotary Wheel Lock
  cyl(x, y + 1.5, z + 0.25, 0.42, 0.08, { axis: 'z', ink: inkAccent, noCollide: true });

  // 4. Emergency Hazard Beacon
  sphere(x, y + 3.4, z, 0.22, { ink: INK.RED, noCollide: true });

  // 5. Overhead Grapple Ring
  ring(x, y + 4.2, z, 'z');
}

export function buildCentrifugeRing(B, x, y, z, o = {}) {
  const { box, slab, cyl, ring, rail, pickup } = B;
  const inkHull = o.inkHull ?? INK.BLUE;
  const inkFrame = o.inkFrame ?? INK.BLACK;
  const inkAccent = o.inkAccent ?? INK.ORANGE;

  // 1. Central Core Torus Spindle
  cyl(x, y, z, 1.8, 8.5, { seg: 10, ink: inkHull });

  // 2. Four Radial Structural Spokes (At Y = y + 4.5)
  box(x, y + 4.5, z, 11.0, 0.6, 0.6, { ink: inkFrame });
  box(x, y + 4.5, z, 0.6, 0.6, 11.0, { ink: inkFrame });

  // 3. Walkable Outer Habitat Deck Ring (North, South, East, West Slabs at Y = y + 4.5)
  slab(x - 5.5, z - 2.5, x - 3.5, z + 2.5, y + 4.5, 0.4, { ink: inkHull });
  slab(x + 3.5, z - 2.5, x + 5.5, z + 2.5, y + 4.5, 0.4, { ink: inkHull });
  slab(x - 2.5, z - 5.5, x + 2.5, z - 3.5, y + 4.5, 0.4, { ink: inkHull });
  slab(x - 2.5, z + 3.5, x + 2.5, z + 5.5, y + 4.5, 0.4, { ink: inkHull });

  // Perimeter Guard Rails
  rail(x - 5.5, z - 2.5, x - 5.5, z + 2.5, y + 4.5, { ink: inkAccent });
  rail(x + 5.5, z - 2.5, x + 5.5, z + 2.5, y + 4.5, { ink: inkAccent });
  rail(x - 2.5, z - 5.5, x + 2.5, z - 5.5, y + 4.5, { ink: inkAccent });
  rail(x - 2.5, z + 5.5, x + 2.5, z + 5.5, y + 4.5, { ink: inkAccent });

  // 4. Waist-High Tactical Cover Blocks on Deck
  box(x - 4.5, y + 4.9, z, 0.8, 1.1, 0.8, { ink: inkAccent, tag: 'cover' });
  box(x + 4.5, y + 4.9, z, 0.8, 1.1, 0.8, { ink: inkAccent, tag: 'cover' });

  // 5. Apex Momentum Swing Ring & Tactical Reward
  ring(x, y + 10.2, z, 'y');
  pickup(x, y + 4.9, z);
}

export function buildHydroponicTray(B, x, y, z, o = {}) {
  const { box, cyl } = B;
  const inkHull = o.inkHull ?? INK.BLUE;
  const inkFrame = o.inkFrame ?? INK.BLACK;
  const inkAccent = o.inkAccent ?? INK.ORANGE;

  // 1. Sealed Nutrient Tank Basin (Waist-high cover: 2.4m x 1.4m x 0.9m)
  box(x, y, z, 2.4, 0.9, 1.4, { ink: inkHull, tag: 'cover' });

  // 2. Algae Culture Surface (Bioluminescent green fluid)
  box(x, y + 0.82, z, 2.1, 0.1, 1.1, { ink: INK.GREEN, noCollide: true });

  // 3. Overhead UV Grow-Light Armature
  cyl(x - 1.0, y + 0.9, z, 0.05, 1.2, { ink: inkFrame, noCollide: true });
  cyl(x + 1.0, y + 0.9, z, 0.05, 1.2, { ink: inkFrame, noCollide: true });
  box(x, y + 2.05, z, 2.1, 0.12, 0.35, { ink: inkAccent, noCollide: true });

  // 4. Aeroponic Valve Manifold (Micro-cover side node)
  cyl(x + 1.25, y + 0.25, z, 0.16, 0.65, { ink: INK.RED, tag: 'cover' });
}

export function buildCommunicationsDish(B, x, y, z, o = {}) {
  const { box, cyl, sphere, ring } = B;
  const inkHull = o.inkHull ?? INK.BLUE;
  const inkFrame = o.inkFrame ?? INK.BLACK;
  const inkAccent = o.inkAccent ?? INK.ORANGE;

  // 1. Structural Lattice Pedestal (Cover base: 2.2m x 3.0m x 2.2m)
  box(x, y, z, 2.2, 3.0, 2.2, { ink: inkFrame, tag: 'cover' });

  // 2. Gimbal Elevation Rotor
  sphere(x, y + 3.0, z, 0.85, { ink: inkAccent });

  // 3. Parabolic Reflector Dish
  cyl(x, y + 4.4, z, 3.0, 0.55, { seg: 12, ink: inkHull });

  // 4. Transceiver Feed Horn Mast
  cyl(x, y + 4.9, z, 0.2, 2.0, { ink: inkFrame });
  sphere(x, y + 6.9, z, 0.35, { ink: inkAccent });

  // 5. Communications Grapple Ring
  ring(x, y + 8.2, z, 'z');
}

export function buildOxygenTankRack(B, x, y, z, o = {}) {
  const { box, cyl } = B;
  const inkHull = o.inkHull ?? INK.BLUE;
  const inkFrame = o.inkFrame ?? INK.BLACK;
  const inkAccent = o.inkAccent ?? INK.ORANGE;

  // 1. Skid Frame Cradle (Base foundation)
  box(x, y, z, 2.2, 0.3, 1.0, { ink: inkHull, tag: 'cover' });

  // 2. Three Pressurized Oxygen Cylinders (0.26m radius, 1.05m height)
  cyl(x - 0.65, y + 0.3, z, 0.26, 1.05, { ink: INK.BLUE, tag: 'cover' });
  cyl(x, y + 0.3, z, 0.26, 1.05, { ink: INK.BLUE, tag: 'cover' });
  cyl(x + 0.65, y + 0.3, z, 0.26, 1.05, { ink: INK.BLUE, tag: 'cover' });

  // 3. Manifold Pressure Distribution Pipe & Dial
  box(x, y + 1.25, z, 1.6, 0.08, 0.08, { ink: inkAccent, noCollide: true });
  cyl(x + 0.95, y + 1.25, z, 0.12, 0.06, { axis: 'x', ink: INK.RED, noCollide: true });

  // 4. Protective Roll-Cage Tubing
  box(x, y + 0.3, z - 0.45, 2.2, 1.1, 0.08, { ink: inkFrame, noCollide: true });
}

export function buildTelemetryConsole(B, x, y, z, o = {}) {
  const { box, cyl, wedge } = B;
  const inkHull = o.inkHull ?? INK.BLUE;
  const inkFrame = o.inkFrame ?? INK.BLACK;

  // 1. Avionics Equipment Base (Waist cover: 2.0m x 0.85m x 1.2m)
  box(x, y, z, 2.0, 0.85, 1.2, { ink: inkHull, tag: 'cover' });

  // 2. Sloped Instrument Panel
  wedge(x, y + 0.85, z, 1.8, 0.3, 0.7, { dir: '+z', ink: inkFrame, noCollide: true });

  // 3. Dual Diagnostic Holo-Monitors
  box(x - 0.5, y + 1.15, z - 0.2, 0.55, 0.4, 0.06, { ink: INK.ORANGE, noCollide: true });
  box(x + 0.5, y + 1.15, z - 0.2, 0.55, 0.4, 0.06, { ink: INK.BLUE, noCollide: true });

  // 4. Operator Stool (Micro-cover node)
  cyl(x, y, z + 0.9, 0.3, 0.65, { ink: inkFrame, tag: 'cover' });
}

export function buildStoneLantern(B, x, y, z, o = {}) {
  const { box, cyl, slab } = B;
  const ink = o.ink ?? INK.BLACK;
  const accent = o.inkAccent ?? INK.ORANGE;
  box(x, y, z, 0.8, 0.3, 0.8, { ink, tag: 'cover' });
  cyl(x, y + 0.3, z, 0.22, 0.7, { ink, tag: 'cover' });
  box(x, y + 1.0, z, 0.6, 0.45, 0.6, { ink: accent, tag: 'cover' });
  slab(x - 0.45, z - 0.45, x + 0.45, z + 0.45, y + 1.45, 0.18, { ink });
}

export function buildBambooFountain(B, x, y, z, o = {}) {
  const { box, cyl } = B;
  const ink = o.ink ?? INK.GREEN;
  const inkStone = o.inkStone ?? INK.BLACK;
  box(x, y, z, 0.9, 0.5, 0.9, { ink: inkStone, tag: 'cover' });
  cyl(x - 0.3, y, z + 0.5, 0.08, 1.1, { ink, noCollide: true });
  cyl(x + 0.3, y, z + 0.5, 0.08, 1.1, { ink, noCollide: true });
  cyl(x, y + 0.8, z + 0.2, 0.09, 0.85, { axis: 'z', ink, noCollide: true });
}

export function buildHoloPylon(B, x, y, z, o = {}) {
  const { box, cyl, sphere } = B;
  const ink = o.ink ?? INK.BLUE;
  const accent = o.inkAccent ?? INK.ORANGE;
  box(x, y, z, 0.7, 0.8, 0.7, { ink, tag: 'cover' });
  cyl(x, y + 0.8, z, 0.15, 1.6, { ink, tag: 'cover' });
  box(x, y + 1.6, z, 0.4, 0.4, 0.08, { ink: accent, noCollide: true });
  sphere(x, y + 2.5, z, 0.2, { ink: accent, noCollide: true });
}

export function buildValveBank(B, x, y, z, o = {}) {
  const { box, cyl } = B;
  const ink = o.ink ?? INK.ORANGE;
  const inkFrame = o.inkFrame ?? INK.BLACK;
  box(x, y, z, 2.0, 0.6, 0.6, { ink, tag: 'cover' });
  [-0.6, 0, 0.6].forEach(ox => {
    cyl(x + ox, y + 0.6, z, 0.1, 0.4, { ink: inkFrame, tag: 'cover' });
    cyl(x + ox, y + 1.0, z, 0.25, 0.08, { axis: 'x', ink, noCollide: true });
  });
}

export function buildPressureGauge(B, x, y, z, o = {}) {
  const { box, cyl } = B;
  const ink = o.ink ?? INK.ORANGE;
  const inkFrame = o.inkFrame ?? INK.BLACK;
  cyl(x, y, z, 0.12, 1.1, { ink: inkFrame, tag: 'cover' });
  cyl(x, y + 1.1, z, 0.35, 0.12, { axis: 'z', ink, noCollide: true });
  box(x, y + 1.1, z + 0.08, 0.04, 0.22, 0.02, { ink: INK.RED, noCollide: true });
}

export function buildCrateStack(B, x, y, z, o = {}) {
  const { box } = B;
  const ink = o.ink ?? INK.ORANGE;
  const inkBand = o.inkBand ?? INK.BLACK;
  const seed = (typeof o.seed === 'number' ? o.seed : 101) + Math.floor(x * 17 + z * 31);
  const variant = Math.abs(seed) % 3;

  if (variant === 0) {
    // 3-crate pyramid (standard)
    box(x - 0.45, y, z, 0.85, 0.85, 0.85, { ink, tag: 'cover' });
    box(x + 0.45, y, z, 0.85, 0.85, 0.85, { ink, tag: 'cover' });
    box(x, y + 0.85, z, 0.85, 0.85, 0.85, { ink, tag: 'cover' });
    // Steel reinforcement band
    box(x, y + 0.85, z, 0.87, 0.12, 0.87, { ink: inkBand, noCollide: true });
  } else if (variant === 1) {
    // 4-crate cargo pallet stack (wider base)
    box(x - 0.5, y, z - 0.35, 0.9, 0.75, 0.7, { ink, tag: 'cover' });
    box(x + 0.5, y, z - 0.35, 0.9, 0.75, 0.7, { ink, tag: 'cover' });
    box(x, y, z + 0.45, 1.4, 0.75, 0.8, { ink, tag: 'cover' });
    box(x - 0.2, y + 0.75, z, 0.85, 0.75, 0.85, { ink, tag: 'cover' });
  } else {
    // Asymmetrical double crate with open lid packing foam
    box(x - 0.4, y, z, 0.95, 0.95, 0.95, { ink, tag: 'cover' });
    box(x + 0.55, y, z + 0.2, 0.75, 0.75, 0.75, { ink, tag: 'cover' });
    box(x - 0.4, y + 0.95, z, 0.8, 0.65, 0.8, { ink, tag: 'cover' });
    // Packing straw / foam accent
    box(x - 0.4, y + 1.6, z, 0.6, 0.08, 0.6, { ink: INK.BLUE ?? 0, noCollide: true });
  }
}

export function buildSandbagRow(B, x, y, z, o = {}) {
  const { box } = B;
  const ink = o.ink ?? INK.BLACK;
  box(x - 0.7, y, z, 0.65, 0.35, 0.45, { ink, tag: 'cover' });
  box(x, y, z, 0.65, 0.35, 0.45, { ink, tag: 'cover' });
  box(x + 0.7, y, z, 0.65, 0.35, 0.45, { ink, tag: 'cover' });
  box(x - 0.35, y + 0.35, z, 0.65, 0.35, 0.45, { ink, tag: 'cover' });
  box(x + 0.35, y + 0.35, z, 0.65, 0.35, 0.45, { ink, tag: 'cover' });
  box(x, y + 0.7, z, 0.65, 0.35, 0.45, { ink, tag: 'cover' });
}

export function buildAntennaWhip(B, x, y, z, o = {}) {
  const { box, cyl, sphere } = B;
  const ink = o.ink ?? INK.BLACK;
  const accent = o.inkAccent ?? INK.RED;
  box(x, y, z, 0.5, 0.6, 0.5, { ink, tag: 'cover' });
  cyl(x, y + 0.6, z, 0.08, 3.2, { ink, noCollide: true });
  sphere(x, y + 3.8, z, 0.15, { ink: accent, noCollide: true });
}

export function buildRopeCoil(B, x, y, z, o = {}) {
  const { cyl, ring } = B;
  const ink = o.ink ?? INK.ORANGE;
  cyl(x, y, z, 0.55, 0.25, { ink, tag: 'cover' });
  ring(x, y + 0.25, z, 'y');
}

export function buildToolRack(B, x, y, z, o = {}) {
  const { box } = B;
  const ink = o.ink ?? INK.BLACK;
  const accent = o.inkAccent ?? INK.ORANGE;
  box(x, y, z, 1.6, 1.4, 0.25, { ink, tag: 'cover' });
  box(x - 0.4, y + 0.5, z + 0.14, 0.08, 0.45, 0.05, { ink: accent, noCollide: true });
  box(x, y + 0.5, z + 0.14, 0.08, 0.35, 0.05, { ink: accent, noCollide: true });
  box(x + 0.4, y + 0.5, z + 0.14, 0.1, 0.4, 0.05, { ink: accent, noCollide: true });
}

export function buildWarningSign(B, x, y, z, o = {}) {
  const { box, cyl } = B;
  const ink = o.ink ?? INK.ORANGE;
  const inkPost = o.inkPost ?? INK.BLACK;
  cyl(x, y, z, 0.08, 1.3, { ink: inkPost, tag: 'cover' });
  box(x, y + 1.1, z, 0.55, 0.55, 0.06, { ink, noCollide: true });
}

export function buildTransitBus(B, x, y, z, o = {}) {
  const { box, cyl, ring } = B;
  const inkBody = o.inkBody ?? (INK.ORANGE ?? 3);
  const inkTrim = o.inkTrim ?? (INK.BLACK ?? 2);
  const inkGlass = o.inkGlass ?? (INK.BLUE ?? 0);
  const inkAccent = o.inkAccent ?? (INK.RED ?? 1);
  const busType = o.busType ?? 'commuter'; // 'commuter', 'express', 'airport', 'metro'

  // 1. Lower chassis & wheel wells
  box(x, y + 0.35, z, 2.8, 0.7, 11.5, { ink: inkTrim });

  // Front and rear heavy impact bumpers
  box(x, y + 0.35, z - 5.82, 2.84, 0.45, 0.3, { ink: inkTrim });
  box(x, y + 0.35, z + 5.82, 2.84, 0.45, 0.3, { ink: inkTrim });

  // 2. Main passenger cabin body
  box(x, y + 1.05, z, 2.76, 2.1, 11.4, { ink: inkBody, tag: 'cover' });

  // Parametric Livery Waistband Stripe (accents body color)
  box(x - 1.39, y + 0.95, z, 0.04, 0.22, 11.2, { ink: inkAccent, noCollide: true });
  box(x + 1.39, y + 0.95, z, 0.04, 0.22, 11.2, { ink: inkAccent, noCollide: true });

  // 3. Parametric Roof Equipment
  if (busType === 'express') {
    // Dual AC Pods + Roof Air Deflector
    box(x, y + 3.15, z - 2.5, 2.2, 0.45, 2.4, { ink: inkTrim });
    box(x, y + 3.15, z + 2.5, 2.2, 0.45, 2.4, { ink: inkTrim });
  } else if (busType === 'airport') {
    // Extended Luggage Racks with tie-down rails
    box(x, y + 3.15, z, 2.3, 0.4, 6.2, { ink: inkTrim });
    box(x, y + 3.35, z, 2.1, 0.2, 5.8, { ink: inkAccent, noCollide: true });
  } else {
    // Standard Commuter AC unit
    box(x, y + 3.15, z - 1.0, 2.2, 0.45, 3.8, { ink: inkTrim });
  }

  // 4. Windshield, Rear Window & Glowing Destination LED Signs
  box(x, y + 2.1, z - 5.72, 2.5, 1.1, 0.08, { ink: inkGlass, noCollide: true });
  box(x, y + 2.1, z + 5.72, 2.5, 1.1, 0.08, { ink: inkGlass, noCollide: true });

  // Front Destination Route Matrix Sign (Amber/Orange LED reader)
  box(x, y + 2.85, z - 5.74, 1.8, 0.32, 0.06, { ink: INK.ORANGE ?? 3, noCollide: true });

  // Passenger window banks
  box(x - 1.39, y + 2.1, z, 0.06, 0.95, 9.8, { ink: inkGlass, noCollide: true });
  box(x + 1.39, y + 2.1, z, 0.06, 0.95, 9.8, { ink: inkGlass, noCollide: true });

  // Front Bumper Bike Rack (Unique tactical micro-cover on select coaches)
  if (o.bikeRack) {
    box(x, y + 0.45, z - 6.2, 2.2, 0.5, 0.45, { ink: inkTrim, tag: 'cover' });
  }

  // 5. Rubber wheels (4 tandem pairs)
  for (const wz of [z - 3.4, z + 3.4]) {
    cyl(x - 1.4, y, wz, 0.52, 0.38, { axis: 'x', ink: inkTrim, noCollide: true });
    cyl(x + 1.4, y, wz, 0.52, 0.38, { axis: 'x', ink: inkTrim, noCollide: true });
  }

  // 6. Rooftop mantle & traversal grapple ring
  ring(x, y + 4.8, z, 'y');
}

export function buildTransitBench(B, x, y, z, o = {}) {
  const { box, collider } = B;
  const ink = o.ink ?? (INK.ORANGE ?? 3);
  const inkLegs = o.inkLegs ?? (INK.BLACK ?? 2);
  // Legs (visual mesh only)
  box(x - 0.85, y, z, 0.08, 0.45, 0.5, { ink: inkLegs, noCollide: true });
  box(x + 0.85, y, z, 0.08, 0.45, 0.5, { ink: inkLegs, noCollide: true });
  // Seat slab (visual mesh only)
  box(x, y + 0.45, z, 1.9, 0.08, 0.55, { ink, noCollide: true });
  // Backrest (visual mesh only)
  box(x, y + 0.53, z - 0.24, 1.9, 0.42, 0.08, { ink, noCollide: true });
  // Unified standard waist-high tactical collider (0.95m height)
  collider(x, y, z, 1.9, 0.95, 0.6, { tag: 'cover' });
}

export function buildPassengerShelter(B, x, y, z, o = {}) {
  const { box, slab, cyl } = B;
  const inkRoof = o.inkRoof ?? (INK.BLUE ?? 0);
  const inkFrame = o.inkFrame ?? (INK.BLACK ?? 2);

  // Vertical steel support columns
  cyl(x - 3.2, y, z - 1.2, 0.12, 3.2, { ink: inkFrame });
  cyl(x + 3.2, y, z - 1.2, 0.12, 3.2, { ink: inkFrame });

  // Tempered safety windbreak back panel
  box(x, y, z - 1.2, 6.8, 2.6, 0.08, { ink: inkRoof, tag: 'cover' });

  // Cantilever overhanging roof canopy
  slab(x - 3.6, z - 1.4, x + 3.6, z + 1.8, y + 3.2, 0.2, { ink: inkRoof });

  // Waiting bench underneath shelter
  buildTransitBench(B, x, y, z);
}

export function buildUrbanDecals(B, x, z, o = {}) {
  const { box, cyl } = B;
  const inkOil = o.inkOil ?? (INK.BLACK ?? 2);
  const inkMark = o.inkMark ?? (INK.ORANGE ?? 3);

  // 1. Engine oil drip puddle under coach engine bay (Y = 0.012)
  box(x, 0.012, z, 2.2, 0.01, 3.4, { ink: inkOil, noCollide: true });

  // 2. Iron storm drain sewer grate
  box(x + 1.8, 0.014, z - 1.2, 0.8, 0.01, 1.2, { ink: inkOil, noCollide: true });
  for (let g = -0.4; g <= 0.4; g += 0.2) {
    box(x + 1.8 + g, 0.015, z - 1.2, 0.04, 0.01, 1.1, { ink: inkMark, noCollide: true });
  }

  // 3. Directional lane traffic chevron
  box(x, 0.015, z + 2.4, 0.35, 0.01, 1.6, { ink: inkMark, noCollide: true });
}

export function buildCompoundParts(B, parts, rootX, rootY, rootZ, o = {}) {
  if (!Array.isArray(parts) || parts.length === 0) return false;
  const scale = o.scale ?? 1.0;
  const rotY = o.rotY ?? 0;
  const cos = Math.cos(rotY);
  const sin = Math.sin(rotY);

  const resolveInk = (inkVal) => {
    if (inkVal === 'OR') return INK.ORANGE ?? 3;
    if (inkVal === 'BK') return INK.BLACK ?? 2;
    if (inkVal === 'GR') return INK.GREEN ?? 4;
    if (inkVal === 'BL') return INK.BLUE ?? 0;
    if (inkVal === 'RD') return INK.RED ?? 1;
    if (typeof inkVal === 'number') return inkVal;
    return o.ink ?? (INK.BLACK ?? 2);
  };

  for (const part of parts) {
    const rawDx = (part.dx ?? 0) * scale;
    const rawDz = (part.dz ?? 0) * scale;
    const px = rootX + (rawDx * cos - rawDz * sin);
    const py = rootY + (part.dy ?? 0) * scale;
    const pz = rootZ + (rawDx * sin + rawDz * cos);

    const partInk = resolveInk(part.ink);
    const partOpts = {
      ink: partInk,
      noCollide: !!part.noCollide,
      tag: part.tag,
      ...part.opts
    };

    const type = (part.type || 'box').toLowerCase();
    if (type === 'box') {
      const bw = (part.w ?? part.sx ?? 1.0) * scale;
      const bh = (part.h ?? part.sy ?? 1.0) * scale;
      const bd = (part.d ?? part.sz ?? 1.0) * scale;
      B.box(px, py, pz, bw, bh, bd, partOpts);
    } else if (type === 'slab') {
      const halfW = ((part.w ?? part.sx ?? 2.0) * scale) * 0.5;
      const halfD = ((part.d ?? part.sz ?? 2.0) * scale) * 0.5;
      const th = (part.thickness ?? 0.4) * scale;
      B.slab(px - halfW, pz - halfD, px + halfW, pz + halfD, py, th, partOpts);
    } else if (type === 'cyl') {
      const cr = (part.r ?? 0.5) * scale;
      const ch = (part.h ?? 2.0) * scale;
      B.cyl(px, py, pz, cr, ch, { ...partOpts, axis: part.axis || 'y', seg: part.seg || 8 });
    } else if (type === 'sphere') {
      const sr = (part.r ?? 1.0) * scale;
      B.sphere(px, py, pz, sr, partOpts);
    } else if (type === 'barrel') {
      const br = (part.r ?? 0.8) * scale;
      const bh = (part.h ?? 1.5) * scale;
      if (typeof B.barrel === 'function') {
        B.barrel(px, py, pz, br, bh, partOpts);
      } else {
        B.cyl(px, py, pz, br, bh, { ...partOpts, axis: 'y' });
      }
    } else if (type === 'ring') {
      B.ring(px, py, pz, part.axis || 'y');
    } else if (type === 'rail') {
      const halfW = ((part.w ?? 2.0) * scale) * 0.5;
      const halfD = ((part.d ?? 2.0) * scale) * 0.5;
      B.rail(px - halfW, pz - halfD, px + halfW, pz + halfD, py, partOpts);
    } else if (type === 'wedge') {
      const ww = (part.w ?? 1.0) * scale;
      const wh = (part.h ?? 1.0) * scale;
      const wd = (part.d ?? 1.0) * scale;
      B.wedge(px, py, pz, ww, wh, wd, { ...partOpts, dir: part.dir || '+z' });
    } else if (PREFAB_REGISTRY[part.type]) {
      // Recursive sub-prefab assembly
      instantiatePrefab(B, part.type, px, py, pz, {
        ...part.opts,
        scale: scale * (part.scale ?? 1.0),
        rotY: rotY + (part.rotY ?? 0),
        ink: partInk
      });
    }
  }
  return true;
}

export function buildBlobShadow(B, x, z, rx = 2.0, rz = 2.0, o = {}) {
  const { box } = B;
  // Offset slightly opposite light direction (+x, -z)
  const ox = x + 0.35;
  const oz = z - 0.35;
  box(ox, 0.015, oz, rx * 2.0, 0.01, rz * 2.0, {
    ink: o.ink ?? INK.BLACK,
    noCollide: true
  });
}

export function buildBambooLantern(B, x1, z1, x2, z2, y = 8.5, o = {}) {
  const { box, cyl, ring } = B;
  const inkLantern = o.inkLantern ?? INK.ORANGE;
  const inkFrame = o.inkFrame ?? INK.BLACK;

  const mx = (x1 + x2) / 2;
  const mz = (z1 + z2) / 2;
  const span = Math.hypot(x2 - x1, z2 - z1);

  // Horizontal bamboo crossbar
  box(mx, y, mz, Math.abs(x2 - x1) > Math.abs(z2 - z1) ? span : 0.08, 0.08, Math.abs(x2 - x1) > Math.abs(z2 - z1) ? 0.08 : span, {
    ink: inkFrame,
    noCollide: true
  });

  // Hanging cord
  cyl(mx, y - 0.7, mz, 0.02, 0.7, { ink: inkFrame, noCollide: true });

  // Paper lantern box (warm orange)
  box(mx, y - 1.15, mz, 0.45, 0.55, 0.45, { ink: inkLantern, noCollide: true });
  // Iron top & bottom cap
  box(mx, y - 0.86, mz, 0.5, 0.04, 0.5, { ink: inkFrame, noCollide: true });
  box(mx, y - 1.44, mz, 0.5, 0.04, 0.5, { ink: inkFrame, noCollide: true });

  // Apical grapple ring for bamboo grove high-flying traversal
  ring(mx, y - 1.8, mz, 'y');
}

export function buildAtmosphericBeams(B, x, y, z, o = {}) {
  const { box, wedge, cyl } = B;
  const ink = o.ink ?? INK.ORANGE;
  const beamHeight = o.h ?? 18.0;
  const spread = o.spread ?? 4.5;
  const dirX = o.dirX ?? -0.4;
  const dirZ = o.dirZ ?? 0.35;

  // 3 staggered angled light rays forming a luminous beam shaft cluster
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const bx = x + Math.cos(angle) * (spread * 0.5) + dirX * (beamHeight * 0.4);
    const bz = z + Math.sin(angle) * (spread * 0.5) + dirZ * (beamHeight * 0.4);
    const by = y + beamHeight * 0.5;

    // Slender angled light beam
    cyl(bx, by, bz, 0.12, beamHeight, {
      ink,
      noCollide: true,
      seg: 6
    });

    // Ambient dust mote / light pollen marker near mid-height
    box(bx + 0.3, by + (i - 1) * 2.0, bz - 0.2, 0.18, 0.18, 0.18, {
      ink,
      noCollide: true
    });
  }
}

export function buildInkSplatters(B, x, y, z, o = {}) {
  const { box } = B;
  const ink = o.ink ?? INK.BLUE;
  const radius = o.radius ?? 1.4;
  const seed = typeof o.seed === 'number' ? o.seed : Math.round(Math.abs(x * 17 + z * 31));
  const rng = createRNG(seed);
  const next = rng.next;
  const count = o.count ?? 5;

  // Central impact core ink bleed
  box(x, y + 0.015, z, 0.32, 0.01, 0.32, { ink, noCollide: true });

  // Radiating droplet flecks
  for (let i = 0; i < count; i++) {
    const angle = next() * Math.PI * 2;
    const dist = 0.3 + next() * (radius - 0.3);
    const sx = x + Math.cos(angle) * dist;
    const sz = z + Math.sin(angle) * dist;
    const szSize = 0.08 + next() * 0.14;
    box(sx, y + 0.016 + i * 0.001, sz, szSize, 0.01, szSize, { ink, noCollide: true });
  }
}

export function buildArcadeCabinet(B, x, y, z, o = {}) {
  const { box } = B;
  const inkBody = o.inkBody ?? INK.BLACK;
  const inkScreen = o.inkScreen ?? INK.BLUE;
  const inkMarquee = o.inkMarquee ?? INK.RED;

  box(x, y, z, 1.2, 2.2, 1.1, { ink: inkBody });
  box(x, y + 1.2, z + 0.1, 1.0, 0.7, 0.2, { ink: inkScreen, noCollide: true });
  box(x, y + 2.0, z, 1.1, 0.3, 0.4, { ink: inkMarquee, noCollide: true });
}

export function buildPinballBumper(B, x, y, z, o = {}) {
  const { cyl, ring } = B;
  const inkBase = o.inkBase ?? INK.ORANGE;
  const inkCap = o.inkCap ?? INK.RED;

  cyl(x, y, z, 0.9, 0.4, { seg: 10, ink: inkBase });
  cyl(x, y + 0.4, z, 0.7, 0.8, { seg: 10, ink: inkCap, tag: 'cover' });
  cyl(x, y + 1.2, z, 1.1, 0.2, { seg: 12, ink: inkBase });
  ring(x, y + 3.8, z, 'y');
}

export function buildLocomotiveBoiler(B, x, y, z, o = {}) {
  const { cyl, box, ring } = B;
  const inkBoiler = o.inkBoiler ?? INK.BLACK;
  const inkBrass = o.inkBrass ?? INK.ORANGE;

  // Longitudinal cylindrical boiler
  cyl(x, y + 1.8, z, 1.2, 10.0, { seg: 12, ink: inkBoiler });
  // Smokebox stack
  cyl(x, y + 3.2, z - 4.0, 0.35, 1.4, { seg: 8, ink: inkBoiler });
  // Steam dome
  cyl(x, y + 3.2, z + 1.0, 0.5, 0.8, { seg: 8, ink: inkBrass });
  // Running board platform
  box(x, y + 0.8, z, 3.2, 0.3, 10.5, { ink: inkBoiler, tag: 'cover' });
  // Apex Grapple
  ring(x, y + 5.2, z - 4.0, 'z');
}

export function buildBunsenBurner(B, x, y, z, o = {}) {
  const { cyl, ring, box } = B;
  const inkBase = o.inkBase ?? INK.BLACK;
  const inkBrass = o.inkBrass ?? INK.ORANGE;
  const inkFlame = o.inkFlame ?? INK.BLUE;

  // Cast iron circular base
  cyl(x, y, z, 2.4, 0.6, { seg: 12, ink: inkBase });
  // Brass barrel
  cyl(x, y + 0.6, z, 0.9, 6.0, { seg: 10, ink: inkBrass });
  // Flame reduction cone (visual only)
  cyl(x, y + 6.6, z, 0.6, 3.5, { seg: 8, ink: inkFlame, noCollide: true });
  // Collar grapple ring
  ring(x, y + 6.8, z, 'z');
}

export function buildPinballMachine(B, x, y, z, o = {}) {
  const { box, slab, cyl, ring } = B;
  const inkChassis = o.inkChassis ?? INK.BLACK;
  const inkPlayfield = o.inkPlayfield ?? INK.BLUE;
  const inkBackglass = o.inkBackglass ?? INK.RED;
  const inkTrim = o.inkTrim ?? INK.ORANGE;

  // 1. Tilted Playfield Table Cabinet (16m long, 8m wide, rises from 0.85m to 3.6m)
  slab(x - 4.0, z - 8.0, x + 4.0, z + 8.0, y + 0.85, 0.4, { ink: inkPlayfield });
  // Side wooden rails
  box(x - 4.1, y + 0.5, z, 0.4, 1.4, 16.2, { ink: inkChassis, tag: 'cover' });
  box(x + 4.1, y + 0.5, z, 0.4, 1.4, 16.2, { ink: inkChassis, tag: 'cover' });
  // Front apron (crouch cover)
  box(x, y + 0.5, z + 8.1, 8.4, 1.2, 0.4, { ink: inkTrim, tag: 'cover' });

  // 2. Colossal Scoreboard Backglass Cabinet (North end at z - 8.5, Y = 3.6m to 12.0m)
  box(x, y + 3.6, z - 8.6, 8.8, 8.4, 2.2, { ink: inkChassis });
  box(x, y + 5.0, z - 7.4, 7.6, 6.0, 0.3, { ink: inkBackglass, noCollide: true });

  // 3. Kinetic Bumpers on Playfield
  cyl(x - 2.0, y + 1.25, z - 2.0, 0.9, 1.1, { seg: 10, ink: inkTrim, tag: 'cover' });
  cyl(x + 2.0, y + 1.25, z - 2.0, 0.9, 1.1, { seg: 10, ink: inkTrim, tag: 'cover' });
  cyl(x, y + 1.65, z - 5.0, 1.1, 1.1, { seg: 10, ink: inkBackglass, tag: 'cover' });

  // 4. Overhead Grapple Ring
  ring(x, y + 14.0, z - 8.6, 'z');
  ring(x, y + 6.0, z + 2.0, 'y');
}

