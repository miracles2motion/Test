import { INK } from './render.js';

// ============================================================================
// DOODLE STRIKE MASTER PREFABRICATED PROCEDURAL GEOMETRY LIBRARY
// High-fidelity compound structures, trees, vessels, flora, and architectural assets.
// ============================================================================

/**
 * Procedural Ancient Oak / Giant Banyan Tree
 * Features flaring buttress roots, climbable spiral trunk steps, 3D angled branches,
 * elevated canopy combat deck with foliage cover, organic leaf dome, and momentum grapple rings.
 */
export function buildAncientTree(B, x, y, z, o = {}) {
  const { box, slab, cyl, sphere, ring, rail, wedge, pickup } = B;
  const inkBark = o.inkBark ?? INK.ORANGE;
  const inkLeaves = o.inkLeaves ?? INK.GREEN;
  const trunkR = o.r ?? 1.8;
  const trunkH = o.h ?? 13.0;

  // 1. Buttress Roots (4 flaring anchor fins)
  wedge(x + trunkR + 1.2, y, z, 2.4, 2.2, 1.4, { dir: '+x', ink: inkBark });
  wedge(x - trunkR - 1.2, y, z, 2.4, 2.2, 1.4, { dir: '-x', ink: inkBark });
  wedge(x, y, z + trunkR + 1.2, 1.4, 2.2, 2.4, { dir: '+z', ink: inkBark });
  wedge(x, y, z - trunkR - 1.2, 1.4, 2.2, 2.4, { dir: '-z', ink: inkBark });

  // 2. Vertical Core Trunk
  cyl(x, y, z, trunkR, trunkH, { seg: 12, ink: inkBark });

  // 3. Climbable Spiral Trunk Steps (wrapping up to canopy platform at Y = y + 6.5)
  const stepCount = 8;
  for (let i = 0; i < stepCount; i++) {
    const angle = i * 0.72;
    const stepY = y + (i + 1) * 0.8;
    const sx = x + Math.cos(angle) * (trunkR + 0.9);
    const sz = z + Math.sin(angle) * (trunkR + 0.9);
    box(sx, stepY, sz, 1.6, 0.28, 1.6, { ink: inkBark, tag: 'stairs' });
  }

  // 4. Elevated Canopy Combat Deck (Y = y + 6.5)
  const deckY = y + 6.5;
  slab(x - 5.5, z - 5.5, x + 5.5, z + 5.5, deckY, 0.45, { ink: inkBark });

  // Protective timber perimeter rails
  rail(x - 5.5, z - 5.5, x + 5.5, z - 5.5, deckY, { ink: inkBark });
  rail(x - 5.5, z + 5.5, x + 5.5, z + 5.5, deckY, { ink: inkBark });
  rail(x - 5.5, z - 5.5, x - 5.5, z + 5.5, deckY, { ink: inkBark });
  rail(x + 5.5, z - 5.5, x + 5.5, z + 5.5, deckY, { ink: inkBark });

  // Waist-high tactical foliage cover blocks on the deck
  box(x - 3.8, deckY, z, 1.4, 1.1, 1.4, { ink: inkLeaves, tag: 'cover' });
  box(x + 3.8, deckY, z, 1.4, 1.1, 1.4, { ink: inkLeaves, tag: 'cover' });
  box(x, deckY, z - 3.8, 1.4, 1.1, 1.4, { ink: inkLeaves, tag: 'cover' });

  // 5. 3D Angled Branching Limbs reaching into quadrants
  cyl(x + 3.2, deckY + 2.5, z + 3.2, 0.55, 4.5, { axis: 'x', ink: inkBark });
  cyl(x - 3.2, deckY + 2.5, z - 3.2, 0.55, 4.5, { axis: 'x', ink: inkBark });
  cyl(x + 3.2, deckY + 2.5, z - 3.2, 0.55, 4.5, { axis: 'z', ink: inkBark });
  cyl(x - 3.2, deckY + 2.5, z + 3.2, 0.55, 4.5, { axis: 'z', ink: inkBark });

  // 6. Colossal Foliage Canopy Volume
  const crownY = y + trunkH + 2.2;
  sphere(x, crownY, z, 5.2, { ink: inkLeaves });
  sphere(x + 4.2, crownY - 1.2, z + 4.2, 3.6, { ink: inkLeaves, noCollide: true });
  sphere(x - 4.2, crownY - 1.2, z - 4.2, 3.6, { ink: inkLeaves, noCollide: true });
  sphere(x + 4.2, crownY - 1.2, z - 4.2, 3.6, { ink: inkLeaves, noCollide: true });
  sphere(x - 4.2, crownY - 1.2, z + 4.2, 3.6, { ink: inkLeaves, noCollide: true });

  // 7. Momentum Grapple Rings
  ring(x, crownY + 5.8, z, 'y'); // Apex high swing
  ring(x + 4.5, deckY + 1.8, z, 'z'); // Under-branch traversal ring
  ring(x - 4.5, deckY + 1.8, z, 'z'); // Opposite under-branch traversal ring

  // Tactical Reward on deck
  pickup(x, deckY + 0.3, z + 3.5);
}

/**
 * Procedural Alpine Pine / Coniferous Tree
 * Slender timber mast with tiered conical needle skirts and ground micro-cover.
 */
export function buildPineTree(B, x, y, z, o = {}) {
  const { cyl, cone, slab, ring } = B;
  const inkBark = o.inkBark ?? INK.ORANGE;
  const inkLeaves = o.inkLeaves ?? INK.GREEN;
  const h = o.h ?? 13.0;

  // Slender vertical trunk
  cyl(x, y, z, 0.45, h, { ink: inkBark });

  // 3-Tiered Conical Needle Skirts
  cone(x, y + 3.5, z, 4.0, 3.8, { ink: inkLeaves });
  cone(x, y + 6.8, z, 3.0, 3.4, { ink: inkLeaves });
  cone(x, y + 9.8, z, 2.0, 3.0, { ink: inkLeaves });

  // Base micro-cover: mossy boulder slab
  slab(x - 1.2, z - 1.2, x + 1.2, z + 1.2, y + 0.8, 0.8, { ink: INK.BLACK, tag: 'cover' });

  // Apex Grapple Ring
  ring(x, y + h + 0.5, z, 'y');
}

/**
 * Procedural Weeping Willow Tree
 * Bent arching trunk, broad canopy umbrella, and trailing vine tendrils breaking sightlines.
 */
export function buildWillowTree(B, x, y, z, o = {}) {
  const { cyl, sphere, ring } = B;
  const inkBark = o.inkBark ?? INK.ORANGE;
  const inkLeaves = o.inkLeaves ?? INK.GREEN;

  // Bent trunk with crook
  cyl(x, y, z, 0.9, 5.0, { ink: inkBark });
  cyl(x + 1.2, y + 4.5, z + 0.6, 0.65, 5.2, { ink: inkBark });

  // Broad drooping canopy umbrella
  sphere(x + 1.2, y + 10.0, z + 0.6, 5.5, { ink: inkLeaves });

  // Trailing vine tendrils (vertical thin cylinders breaking sniper lanes)
  for (let a = 0; a < 6; a++) {
    const rad = 4.2;
    const vx = x + 1.2 + Math.cos(a * 1.05) * rad;
    const vz = z + 0.6 + Math.sin(a * 1.05) * rad;
    cyl(vx, y + 2.5, vz, 0.12, 5.8, { ink: inkLeaves, noCollide: true });
  }

  ring(x + 1.2, y + 10.5, z + 0.6, 'y');
}

/**
 * Procedural Giant Mushroom Platform
 * Stipe stalk with wide umbrella cap platform acting as a sniper perch / bounce cap.
 */
export function buildGiantMushroom(B, x, y, z, o = {}) {
  const { cyl, slab, cone, ring } = B;
  const inkCap = o.inkCap ?? INK.RED;
  const stalkH = o.h ?? 5.2;

  // Stalk
  cyl(x, y, z, 1.0, stalkH, { ink: INK.BLACK });

  // Walkable umbrella cap platform
  slab(x - 3.0, z - 3.0, x + 3.0, z + 3.0, y + stalkH, 0.5, { ink: inkCap });
  cone(x, y + stalkH + 0.5, z, 3.4, 1.6, { ink: inkCap, noCollide: true });

  // Step-stool micro spore cap at base
  cyl(x + 1.6, y, z + 0.4, 0.65, 1.2, { ink: inkCap, tag: 'cover' });

  // Grapple ring suspended under the cap brim with safe clearance
  ring(x + 2.2, y + stalkH - 1.2, z, 'y');
}

/**
 * Procedural Ballpoint Grass Tufts / Reeds
 * Dense stylized grass blades creating ground visual texture and crouch-height ink stippling.
 */
export function buildGrassClump(B, x, y, z, count = 6, o = {}) {
  const { box } = B;
  const ink = o.ink ?? INK.GREEN;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const gx = x + Math.cos(angle) * 0.45;
    const gz = z + Math.sin(angle) * 0.45;
    const gh = 0.55 + (i % 3) * 0.28;
    box(gx, y, gz, 0.09, gh, 0.24, { ink, noCollide: true });
  }
}

/**
 * Procedural Fern Cluster
 * Radiating arched fronds forming natural waist-high micro-cover.
 */
export function buildFernCluster(B, x, y, z, o = {}) {
  const { cyl, box } = B;
  const ink = o.ink ?? INK.GREEN;

  // Center root mound
  cyl(x, y, z, 0.7, 0.45, { ink: INK.BLACK, tag: 'cover' });

  // 4 radiating fronds
  for (let i = 0; i < 4; i++) {
    const angle = i * (Math.PI / 2);
    const fx = x + Math.cos(angle) * 1.1;
    const fz = z + Math.sin(angle) * 1.1;
    box(fx, y, fz, 0.85, 1.05, 0.85, { ink, tag: 'cover' });
  }
}

/**
 * Procedural Hollow Log Tunnel
 * Run-through hollow fallen trunk for high-speed crouch defilade.
 */
export function buildHollowLog(B, x, y, z, len = 10, o = {}) {
  const { box, slab, ring } = B;
  const ink = o.ink ?? INK.ORANGE;

  // Left and Right Bark Walls
  box(x - 1.5, y, z, 0.45, 2.6, len, { ink });
  box(x + 1.5, y, z, 0.45, 2.6, len, { ink });

  // Curved Roof
  box(x, y + 2.5, z, 3.4, 0.4, len, { ink });

  // Smooth interior dirt runway
  slab(x - 1.3, z - len / 2, x + 1.3, z + len / 2, y + 0.1, 0.2, { ink: INK.BLACK, noCollide: true });

  // Moss trim on the roof
  box(x, y + 2.9, z, 2.2, 0.2, len * 0.7, { ink: INK.GREEN, noCollide: true });

  // Entry and Exit Grapple Rings
  ring(x, y + 3.2, z - len / 2, 'z');
  ring(x, y + 3.2, z + len / 2, 'z');
}

/**
 * Procedural Suspended Timber Rope Bridge
 * Spans between two elevated platforms or tree canopies with wooden slats and guard ropes.
 */
export function buildSuspensionBridge(B, x1, z1, x2, z2, y, o = {}) {
  const { box, rail, ring } = B;
  const len = Math.hypot(x2 - x1, z2 - z1);
  const cx = (x1 + x2) / 2;
  const cz = (z1 + z2) / 2;
  const isAlongX = Math.abs(x2 - x1) > Math.abs(z2 - z1);

  // Walkway deck
  box(cx, y, cz, isAlongX ? len : 2.4, 0.35, isAlongX ? 2.4 : len, { ink: o.inkWood ?? INK.ORANGE });

  // Guard rails
  if (isAlongX) {
    rail(x1, z1 - 1.2, x2, z2 - 1.2, y + 0.3, { ink: o.inkRope ?? INK.BLACK });
    rail(x1, z1 + 1.2, x2, z2 + 1.2, y + 0.3, { ink: o.inkRope ?? INK.BLACK });
  } else {
    rail(x1 - 1.2, z1, x2 - 1.2, z2, y + 0.3, { ink: o.inkRope ?? INK.BLACK });
    rail(x1 + 1.2, z1, x2 + 1.2, z2, y + 0.3, { ink: o.inkRope ?? INK.BLACK });
  }

  // Center swing ring
  ring(cx, y + 4.8, cz, 'y');
}

/**
 * Full Multi-Deck Pirate Galleon Warship
 * Curved wedge bow with bowsprit, open gun deck with broadside cannons,
 * raised forecastle, raised sterncastle with captain's cabin and aft balcony,
 * stairways, cargo hold with rum barrel stacks, and triple masts with crow's nests.
 */
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

  // 7. Internal Stairways Connecting Decks
  // Gun deck up to Forecastle
  stairs(x, y + 5.5, z + 8.2, '+z', 7, 2.4, { rise: 0.31, run: 0.45, ink: W });
  // Gun deck up to Poop Deck
  stairs(x, y + 5.5, z - 4.2, '-z', 13, 2.4, { rise: 0.32, run: 0.45, ink: W });

  // 8. Triple Towering Masts
  // Foremast
  cyl(x, y + 7.7, z + 12, 0.6, 18, { ink: BK });
  box(x, y + 21, z + 12, 2.8, 1.0, 2.8, { ink: W }); // Crow's nest
  ring(x, y + 23.5, z + 12, 'y');

  // Mainmast
  cyl(x, y + 5.5, z + 2, 0.85, 24, { ink: BK });
  box(x, y + 26, z + 2, 3.5, 1.2, 3.5, { ink: W }); // Crow's nest
  ring(x, y + 28.5, z + 2, 'y');
  // Horizontal Sail Yard
  cyl(x, y + 18, z + 2, 0.4, 16, { axis: 'x', ink: BK });

  // Mizzenmast
  cyl(x, y + 9.7, z - 10, 0.6, 16, { ink: BK });
  box(x, y + 22, z - 10, 2.8, 1.0, 2.8, { ink: W }); // Crow's nest
  ring(x, y + 24.5, z - 10, 'y');

  // 9. Cargo Hold & Barrels on Gun Deck
  barrel(x + 3.2, y + 5.5, z, 0.8, 1.5, { ink: INK.ORANGE });
  barrel(x + 3.2, y + 5.5, z + 2.0, 0.8, 1.5, { ink: INK.ORANGE });
  barrel(x + 3.2, y + 7.0, z + 1.0, 0.8, 1.5, { ink: INK.ORANGE });
  box(x - 3.2, y + 5.5, z + 1.0, 1.8, 1.4, 1.8, { ink: BK, tag: 'cover' });

  // High-Value Tactical Objective on Poop Deck
  pickup(x, y + 10.0, z - 10.0);
}

// Backwards-compatible alias for existing callers
export const buildGalleon = buildFullGalleon;

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
 */
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

/**
 * Builds an open book ramp facilitating smooth ascent between floor and desk tiers.
 */
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

/**
 * Builds an octagonal glass inkwell waist-high tactical cover with quill pen perch.
 */
export function buildInkwellCover(B, x, y, z, o = {}) {
  const { cyl, ring } = B;
  const r = o.r ?? 2.8;
  const h = o.h ?? 1.8;

  cyl(x, y, z, r, h, { seg: 8, ink: INK.BLACK, tag: 'cover' });
  cyl(x, y + h, z, r * 0.6, 0.6, { ink: INK.ORANGE });
  cyl(x + 0.8, y + h + 0.6, z + 0.8, 0.18, 5.5, { axis: 'x', ink: INK.RED, noCollide: true });
  ring(x + 3.2, y + h + 3.2, z + 0.8, 'x');
}

// ============================================================================
// DYNAMIC PREFAB REGISTRY & TEACHING CATALOG
// Allows Dream to query, inspect, and instantiate any 3D compound structure.
// ============================================================================
export const PREFAB_REGISTRY = {
  ancient_tree: {
    id: 'ancient_tree',
    name: 'Ancient Banyan / Oak Tree',
    tags: ['forest', 'nature', 'woodland', 'jungle', 'tree'],
    builder: buildAncientTree,
    footprint: [11.0, 18.0, 11.0]
  },
  pine_tree: {
    id: 'pine_tree',
    name: 'Alpine Conifer / Pine Tree',
    tags: ['forest', 'pine', 'nature', 'mountain', 'tree'],
    builder: buildPineTree,
    footprint: [8.0, 14.0, 8.0]
  },
  willow_tree: {
    id: 'willow_tree',
    name: 'Weeping Willow Tree',
    tags: ['forest', 'willow', 'swamp', 'water', 'tree'],
    builder: buildWillowTree,
    footprint: [11.0, 12.0, 11.0]
  },
  giant_mushroom: {
    id: 'giant_mushroom',
    name: 'Giant Umbrella Mushroom Platform',
    tags: ['forest', 'fungus', 'swamp', 'nature'],
    builder: buildGiantMushroom,
    footprint: [6.0, 7.0, 6.0]
  },
  hollow_log: {
    id: 'hollow_log',
    name: 'Run-Through Hollow Log Tunnel',
    tags: ['forest', 'log', 'cover', 'tunnel'],
    builder: buildHollowLog,
    footprint: [4.0, 3.5, 10.0]
  },
  grass_clump: {
    id: 'grass_clump',
    name: 'Stylized Ballpoint Grass Clump',
    tags: ['forest', 'flora', 'grass', 'underbrush'],
    builder: buildGrassClump,
    footprint: [1.2, 0.8, 1.2]
  },
  fern_cluster: {
    id: 'fern_cluster',
    name: 'Radiating Arched Fern Fronds',
    tags: ['forest', 'flora', 'fern', 'cover'],
    builder: buildFernCluster,
    footprint: [2.5, 1.2, 2.5]
  },
  suspension_bridge: {
    id: 'suspension_bridge',
    name: 'Suspended Timber Rope Bridge',
    tags: ['forest', 'maritime', 'bridge', 'walkway'],
    builder: buildSuspensionBridge,
    footprint: [3.0, 4.0, 14.0]
  },
  full_galleon: {
    id: 'full_galleon',
    name: 'Multi-Deck Pirate Galleon Warship',
    tags: ['maritime', 'ship', 'pirate', 'ocean', 'harbor'],
    builder: buildFullGalleon,
    footprint: [14.0, 30.0, 40.0]
  },
  book_stack: {
    id: 'book_stack',
    name: 'Stepped Hardback Book Stack',
    tags: ['colossal', 'classroom', 'library', 'desk'],
    builder: buildBookStack,
    footprint: [8.0, 4.0, 11.0]
  },
  open_book_ramp: {
    id: 'open_book_ramp',
    name: 'Ascending Book Ramp',
    tags: ['colossal', 'classroom', 'library', 'ramp'],
    builder: buildOpenBookRamp,
    footprint: [6.0, 3.5, 8.0]
  },
  desk_lamp: {
    id: 'desk_lamp',
    name: 'Monumental Articulated Desk Lamp',
    tags: ['colossal', 'classroom', 'lamp', 'overlook'],
    builder: buildDeskLamp,
    footprint: [16.0, 22.0, 8.0]
  },
  inkwell_cover: {
    id: 'inkwell_cover',
    name: 'Octagonal Inkwell Cover',
    tags: ['colossal', 'classroom', 'inkwell', 'cover'],
    builder: buildInkwellCover,
    footprint: [6.0, 3.0, 6.0]
  }
};

/**
 * Instantiates any registered prefab by ID or thematic keyword.
 */
export function instantiatePrefab(B, prefabId, x, y, z, o = {}) {
  const entry = PREFAB_REGISTRY[prefabId];
  if (!entry || typeof entry.builder !== 'function') {
    console.warn(`[PREFAB] Unknown prefab ID "${prefabId}". Available:`, Object.keys(PREFAB_REGISTRY));
    return false;
  }
  entry.builder(B, x, y, z, o);
  return true;
}
