import { INK } from './render.js';

// Reusable library of composite structures built from raw primitives.

/**
 * Builds a massive Pirate Galleon out of primitives.
 * @param {Object} B - The builder containing box, cyl, wedge, barrel, etc.
 * @param {number} x - Center X position
 * @param {number} y - Bottom Y position (waterline)
 * @param {number} z - Center Z position
 * @param {Object} o - Options (e.g. dir, ink)
 */
export function buildGalleon(B, x, y, z, o = {}) {
  const { box, cyl, wedge, ring, barrel } = B;
  const W = INK.ORANGE; // Wood
  const BK = INK.BLACK;
  
  // Hull Base
  box(x, y, z, 10, 6, 24, { ink: W }); 
  
  // Front Bow (sloping wedge)
  wedge(x, y, z + 15, 10, 6, 6, { dir: '+z', ink: W });
  
  // Rear Stern (raised captain's quarters)
  box(x, y + 6, z - 8, 10, 4, 8, { ink: W });
  wedge(x, y + 10, z - 8, 10, 2, 8, { dir: '-z', ink: W }); // Roof
  
  // Main Mast
  cyl(x, y + 6, z + 2, 0.8, 20, { ink: BK });
  // Crow's Nest
  box(x, y + 22, z + 2, 3, 1, 3, { ink: W });
  ring(x, y + 24, z + 2, 'z'); // Grapple point
  
  // Front Mast
  cyl(x, y + 6, z + 12, 0.6, 16, { ink: BK });
  box(x, y + 18, z + 12, 2.5, 1, 2.5, { ink: W });
  ring(x, y + 20, z + 12, 'z');
  
  // Sail Yards (horizontal crossbeams)
  cyl(x, y + 15, z + 2, 0.4, 14, { axis: 'x', ink: BK }); // Main yard
  cyl(x, y + 12, z + 12, 0.3, 10, { axis: 'x', ink: BK }); // Front yard
  
  // Cargo Barrels on deck
  barrel(x + 2, y + 6, z, 0.8, 1.5, { ink: INK.ORANGE });
  barrel(x - 2, y + 6, z + 4, 0.8, 1.5, { ink: INK.ORANGE });
  
  // Cannons poking out of the sides
  for (let cz = -4; cz <= 8; cz += 4) {
    // Port side (left)
    box(x - 5.5, y + 3, z + cz, 2, 1, 1, { ink: BK });
    // Starboard side (right)
    box(x + 5.5, y + 3, z + cz, 2, 1, 1, { ink: BK });
  }
}

/**
 * Builds an urban parked car.
 */
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

/**
 * Builds a stack of massive hardback books creating stepped tactical platforms.
 * @param {Object} B - Builder
 * @param {number} x - Center X
 * @param {number} y - Base Y
 * @param {number} z - Center Z
 * @param {number} count - Number of books stacked
 * @param {Object} o - Options: w, d, thick, inkSpine, inkPages
 */
export function buildBookStack(B, x, y, z, count = 3, o = {}) {
  const { box, slab } = B;
  const baseW = o.w ?? 8;
  const baseD = o.d ?? 11;
  const thick = o.thick ?? 1.2;
  const inks = [INK.BLUE, INK.ORANGE, INK.RED, INK.BLACK];

  let curY = y;
  for (let i = 0; i < count; i++) {
    const w = baseW - i * 0.4;
    const d = baseD - i * 0.5;
    const bookInk = (o.inkSpine != null) ? o.inkSpine : inks[i % inks.length];
    
    // Hardback cover & spine
    box(x, curY, z, w, thick, d, { ink: bookInk, tag: 'cover' });
    // Cream/parchment paper block inside
    box(x + 0.2, curY + 0.1, z, w - 0.6, thick - 0.2, d - 0.4, { ink: INK.ORANGE, noCollide: true });
    
    curY += thick;
  }
  return curY; // returns top surface Y
}

/**
 * Builds an open book ramp facilitating smooth ascent between floor and desk tiers.
 * @param {Object} B - Builder
 * @param {number} x - Center X
 * @param {number} y - Base Y
 * @param {number} z - Center Z
 * @param {number} w - Width
 * @param {number} rise - Height gained
 * @param {number} run - Length along direction
 * @param {string} dir - '+z' | '-z' | '+x' | '-x'
 */
export function buildOpenBookRamp(B, x, y, z, w = 6, rise = 3, run = 8, dir = '+z', o = {}) {
  const { stairs, box } = B;
  // Use stairs primitive for reliable stepped climbing on navmesh
  const steps = Math.max(4, Math.round(rise / 0.3));
  stairs(x, y, z, dir, steps, w, {
    rise: rise / steps,
    run: run / steps,
    ink: o.ink ?? INK.ORANGE
  });
  // Book spine spine trim
  if (dir === '+z' || dir === '-z') {
    box(x - w / 2, y, z + (dir === '+z' ? run / 2 : -run / 2), 0.4, rise, run, { ink: INK.BLACK });
    box(x + w / 2, y, z + (dir === '+z' ? run / 2 : -run / 2), 0.4, rise, run, { ink: INK.BLACK });
  } else {
    box(x + (dir === '+x' ? run / 2 : -run / 2), y, z - w / 2, run, rise, 0.4, { ink: INK.BLACK });
    box(x + (dir === '+x' ? run / 2 : -run / 2), y, z + w / 2, run, rise, 0.4, { ink: INK.BLACK });
  }
}

/**
 * Builds an oversized articulated architect's desk lamp with canopy and grapple ring.
 */
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

  // Angled cantilever arm reaching toward center
  const reachX = o.reachX ?? 8.0;
  const reachZ = o.reachZ ?? 0;
  const headY = y + 18.0;
  const midX = x + reachX * 0.5;
  const midZ = z + reachZ * 0.5;

  // Arm beam
  cyl(midX, y + 15.0, midZ, 0.5, 7.0, { ink: armInk });

  // Lamp shade / canopy (hollow box / inverted cone)
  const lampX = x + reachX;
  const lampZ = z + reachZ;
  box(lampX, headY, lampZ, 5.0, 2.4, 5.0, { ink: INK.BLUE });
  // Yellow/orange bulb light emitter
  sphere(lampX, headY - 0.8, lampZ, 1.4, { ink: INK.ORANGE, noCollide: true });

  // Grapple ring suspended directly underneath the lampshade for high-momentum swings
  ring(lampX, headY - 2.2, lampZ, 'y');
  // Second grapple ring at knuckle joint for approach angle
  ring(x, y + 13.8, z, 'z');
}

/**
 * Builds an octagonal glass inkwell waist-high tactical cover with quill pen perch.
 */
export function buildInkwellCover(B, x, y, z, o = {}) {
  const { cyl, box, ring } = B;
  const r = o.r ?? 2.8;
  const h = o.h ?? 1.8;

  // Octagonal ink bottle body
  cyl(x, y, z, r, h, { seg: 8, ink: INK.BLACK, tag: 'cover' });
  // Brass neck & rim
  cyl(x, y + h, z, r * 0.6, 0.6, { ink: INK.ORANGE });
  // Protruding quill pen dipping into the inkwell
  cyl(x + 0.8, y + h + 0.6, z + 0.8, 0.18, 5.5, { axis: 'x', ink: INK.RED, noCollide: true });
  // Grapple ring at the quill nib tip
  ring(x + 3.2, y + h + 3.2, z + 0.8, 'x');
}
