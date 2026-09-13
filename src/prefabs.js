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
