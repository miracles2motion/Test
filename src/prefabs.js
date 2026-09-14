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
 * Procedural Ranger Campfire Pit
 * Circle of 8 river stones around charred wood embers with warm atmospheric light.
 */
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

  // 5. Firelight Point Light
  if (scene && typeof THREE !== 'undefined') {
    const fireLight = new THREE.PointLight(0xff7722, 1.8, 18);
    fireLight.position.set(x, y + 0.8, z);
    scene.add(fireLight);
  }
}

/**
 * Procedural Cordwood Fuel Stack
 * Stack of cut timber logs creating reliable waist-high (1.1m) tactical cover.
 */
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

/**
 * Procedural Weathered Trail Signpost
 * Vertical post with directional fingerboards pointing toward map sectors.
 */
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

/**
 * Procedural Chopping Block with Embedded Woodcutter's Axe
 */
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

/**
 * Procedural Timber Logging Handcart
 * 2 spoked wheels, wooden bed, axle, push bars, carrying harvested wood.
 */
export function buildLoggingCart(B, x, y, z, o = {}) {
  const { box, cyl } = B;

  // Cart bed
  box(x, y + 0.6, z, 2.2, 0.6, 1.4, { ink: INK.ORANGE, tag: 'cover' });

  // Left & Right Wooden Spoked Wheels
  cyl(x, y + 0.55, z - 0.85, 0.55, 0.15, { axis: 'z', ink: INK.BLACK, tag: 'cover' });
  cyl(x, y + 0.55, z + 0.85, 0.55, 0.15, { axis: 'z', ink: INK.BLACK, tag: 'cover' });

  // Cargo: Split logs piled on cart (waist-high cover top at Y = y + 1.2m)
  box(x, y + 0.95, z, 2.0, 0.45, 1.2, { ink: INK.ORANGE, tag: 'cover' });

  // Push poles / handles extending backwards
  box(x - 1.5, y + 0.7, z - 0.4, 1.1, 0.08, 0.08, { ink: INK.BLACK, noCollide: true });
  box(x - 1.5, y + 0.7, z + 0.4, 1.1, 0.08, 0.08, { ink: INK.BLACK, noCollide: true });
}

/**
 * Procedural Hollow Tree Stump
 * Natural hollow wooden cylinder acting as a 1.2m ambush bunker.
 */
export function buildHollowStump(B, x, y, z, o = {}) {
  const { cyl, slab, box } = B;
  const r = o.r ?? 1.3;
  const h = o.h ?? 1.2;

  // Outer bark cylinder
  cyl(x, y, z, r, h, { ink: INK.ORANGE, tag: 'cover' });

  // Stepped moss lip on top
  box(x + r * 0.6, y + h, z, 0.6, 0.15, 0.6, { ink: INK.GREEN, noCollide: true });
  box(x - r * 0.6, y + h, z, 0.6, 0.15, 0.6, { ink: INK.GREEN, noCollide: true });
}

/**
 * Procedural Toadstool / Fly Agaric Cluster
 * Red spotted umbrella caps decorating forest floor and tree roots.
 */
export function buildToadstoolCluster(B, x, y, z, count = 3, o = {}) {
  const { cyl, sphere } = B;

  const offsets = [
    [0, 0, 0.7, 0.35],
    [0.55, 0.35, 0.5, 0.28],
    [-0.45, -0.4, 0.4, 0.22]
  ];

  for (let i = 0; i < Math.min(count, offsets.length); i++) {
    const [ox, oz, sh, cr] = offsets[i];
    const sx = x + ox, sz = z + oz;
    // White stipe stalk
    cyl(sx, y, sz, cr * 0.4, sh, { ink: INK.BLACK, noCollide: true });
    // Red dome cap
    sphere(sx, y + sh, sz, cr, { ink: INK.RED, noCollide: true });
    // White spot on cap apex
    sphere(sx, y + sh + cr * 0.85, sz, cr * 0.25, { ink: INK.ORANGE, noCollide: true });
  }
}

/**
 * Procedural Canopy Survey Table & Field Instruments
 * Tactical table on Mid deck with navigation map, brass telescope & lantern.
 */
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

/**
 * Procedural Articulated Photovoltaic Solar Array
 * Features dual rotatable solar wings with structural cross-struts,
 * central actuator mast, foundation battery buffer (tactical cover), and apex grapple ring.
 */
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

/**
 * Procedural Cryo-Stasis Sleeper Pod
 * Pressurized life-support stasis capsule with frost viewscreen,
 * diagnostic telemetry readout column, and biological conduit lines. Ideal waist-high cover.
 */
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

/**
 * Procedural Pressurized Airlock Hatch Bulkhead
 * Heavy reinforced pressure door frame with manual rotary dogging wheel,
 * emergency hazard beacon, and elevated grapple lintel.
 */
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

/**
 * Procedural Habitat Centrifuge Core Hub & Ring
 * Landmark anchor set piece: central rotation hub column, 4 radial structural spokes,
 * multi-tier walkable catwalk decks with safety railings, and high-altitude grapple ring.
 */
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

/**
 * Procedural Hydroponic Algae & Spirulina Growth Bay
 * Pressurized nutrient tank tub with bioluminescent fluid surface,
 * overhead UV grow light armature, and aeroponic valve manifold.
 */
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

/**
 * Procedural Deep-Space Communications Parabolic Dish
 * High-gain telemetry dish with lattice gimbal pedestal,
 * central feed horn mast, sub-reflector tip, and grappling anchor.
 */
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

/**
 * Procedural High-Pressure Oxygen Tank Rack
 * Cluster of 3 pressurized O2 cylinders secured inside a titanium protective roll-cage.
 * Optimal waist-high defilade barricade (1.1m - 1.3m).
 */
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

/**
 * Procedural Telemetry Flight Station & Avionics Terminal
 * Angled operator console with tactile keyboard, dual holo-monitors, and swivel seat.
 */
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

/**
 * Procedural Stone Lantern (Kasuga Toro) - Zen Theme
 */
export function buildStoneLantern(B, x, y, z, o = {}) {
  const { box, cyl, slab } = B;
  const ink = o.ink ?? INK.BLACK;
  const accent = o.inkAccent ?? INK.ORANGE;
  box(x, y, z, 0.8, 0.3, 0.8, { ink, tag: 'cover' });
  cyl(x, y + 0.3, z, 0.22, 0.7, { ink, tag: 'cover' });
  box(x, y + 1.0, z, 0.6, 0.45, 0.6, { ink: accent, tag: 'cover' });
  slab(x - 0.45, z - 0.45, x + 0.45, z + 0.45, y + 1.45, 0.18, { ink });
}

/**
 * Procedural Bamboo Rocking Fountain (Shishi-odoshi) - Zen Theme
 */
export function buildBambooFountain(B, x, y, z, o = {}) {
  const { box, cyl } = B;
  const ink = o.ink ?? INK.GREEN;
  const inkStone = o.inkStone ?? INK.BLACK;
  box(x, y, z, 0.9, 0.5, 0.9, { ink: inkStone, tag: 'cover' });
  cyl(x - 0.3, y, z + 0.5, 0.08, 1.1, { ink, noCollide: true });
  cyl(x + 0.3, y, z + 0.5, 0.08, 1.1, { ink, noCollide: true });
  cyl(x, y + 0.8, z + 0.2, 0.09, 0.85, { axis: 'z', ink, noCollide: true });
}

/**
 * Procedural Holographic Pylon Beacon - Cyber Theme
 */
export function buildHoloPylon(B, x, y, z, o = {}) {
  const { box, cyl, sphere } = B;
  const ink = o.ink ?? INK.BLUE;
  const accent = o.inkAccent ?? INK.ORANGE;
  box(x, y, z, 0.7, 0.8, 0.7, { ink, tag: 'cover' });
  cyl(x, y + 0.8, z, 0.15, 1.6, { ink, tag: 'cover' });
  box(x, y + 1.6, z, 0.4, 0.4, 0.08, { ink: accent, noCollide: true });
  sphere(x, y + 2.5, z, 0.2, { ink: accent, noCollide: true });
}

/**
 * Procedural Industrial Valve Manifold Bank - Steampunk Theme
 */
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

/**
 * Procedural Brass Pressure Gauge - Steampunk Theme
 */
export function buildPressureGauge(B, x, y, z, o = {}) {
  const { box, cyl } = B;
  const ink = o.ink ?? INK.ORANGE;
  const inkFrame = o.inkFrame ?? INK.BLACK;
  cyl(x, y, z, 0.12, 1.1, { ink: inkFrame, tag: 'cover' });
  cyl(x, y + 1.1, z, 0.35, 0.12, { axis: 'z', ink, noCollide: true });
  box(x, y + 1.1, z + 0.08, 0.04, 0.22, 0.02, { ink: INK.RED, noCollide: true });
}

/**
 * Procedural Slate Chalkboard Wall - Colossal Theme
 */
export function buildChalkboardWall(B, x, y, z, o = {}) {
  const { box } = B;
  const ink = o.ink ?? INK.BLUE;
  const inkFrame = o.inkFrame ?? INK.ORANGE;
  box(x - 1.2, y, z, 0.2, 2.8, 0.3, { ink: inkFrame, tag: 'cover' });
  box(x + 1.2, y, z, 0.2, 2.8, 0.3, { ink: inkFrame, tag: 'cover' });
  box(x, y + 0.8, z, 2.4, 1.6, 0.15, { ink, tag: 'cover' });
  box(x, y + 0.75, z + 0.12, 2.4, 0.08, 0.18, { ink: inkFrame, noCollide: true });
}

/**
 * Procedural Wooden Crate Stack - Universal Cover
 */
export function buildCrateStack(B, x, y, z, o = {}) {
  const { box } = B;
  const ink = o.ink ?? INK.ORANGE;
  box(x - 0.45, y, z, 0.85, 0.85, 0.85, { ink, tag: 'cover' });
  box(x + 0.45, y, z, 0.85, 0.85, 0.85, { ink, tag: 'cover' });
  box(x, y + 0.85, z, 0.85, 0.85, 0.85, { ink, tag: 'cover' });
}

/**
 * Procedural Sandbag Barricade Row - Universal Tactical Cover
 */
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

/**
 * Procedural Whip Antenna Post - Universal Comms
 */
export function buildAntennaWhip(B, x, y, z, o = {}) {
  const { box, cyl, sphere } = B;
  const ink = o.ink ?? INK.BLACK;
  const accent = o.inkAccent ?? INK.RED;
  box(x, y, z, 0.5, 0.6, 0.5, { ink, tag: 'cover' });
  cyl(x, y + 0.6, z, 0.08, 3.2, { ink, noCollide: true });
  sphere(x, y + 3.8, z, 0.15, { ink: accent, noCollide: true });
}

/**
 * Procedural Manila Hemp Rope Coil - Maritime / Industrial
 */
export function buildRopeCoil(B, x, y, z, o = {}) {
  const { cyl, ring } = B;
  const ink = o.ink ?? INK.ORANGE;
  cyl(x, y, z, 0.55, 0.25, { ink, tag: 'cover' });
  ring(x, y + 0.25, z, 'y');
}

/**
 * Procedural Workshop Tool Rack - Industrial / Maintenance
 */
export function buildToolRack(B, x, y, z, o = {}) {
  const { box } = B;
  const ink = o.ink ?? INK.BLACK;
  const accent = o.inkAccent ?? INK.ORANGE;
  box(x, y, z, 1.6, 1.4, 0.25, { ink, tag: 'cover' });
  box(x - 0.4, y + 0.5, z + 0.14, 0.08, 0.45, 0.05, { ink: accent, noCollide: true });
  box(x, y + 0.5, z + 0.14, 0.08, 0.35, 0.05, { ink: accent, noCollide: true });
  box(x + 0.4, y + 0.5, z + 0.14, 0.1, 0.4, 0.05, { ink: accent, noCollide: true });
}

/**
 * Procedural Hazard Caution Warning Sign - Universal
 */
export function buildWarningSign(B, x, y, z, o = {}) {
  const { box, cyl } = B;
  const ink = o.ink ?? INK.ORANGE;
  const inkPost = o.inkPost ?? INK.BLACK;
  cyl(x, y, z, 0.08, 1.3, { ink: inkPost, tag: 'cover' });
  box(x, y + 1.1, z, 0.55, 0.55, 0.06, { ink, noCollide: true });
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
  },
  campfire: {
    id: 'campfire',
    name: 'Ranger Campfire Pit',
    tags: ['forest', 'camp', 'fire', 'light', 'outpost'],
    builder: buildCampfire,
    footprint: [2.0, 0.8, 2.0]
  },
  wood_stack: {
    id: 'wood_stack',
    name: 'Cordwood Fuel Stack',
    tags: ['forest', 'wood', 'cover', 'lumber'],
    builder: buildWoodStack,
    footprint: [2.6, 1.2, 1.4]
  },
  trail_sign: {
    id: 'trail_sign',
    name: 'Weathered Trail Signpost',
    tags: ['forest', 'sign', 'waypoint', 'trail'],
    builder: buildTrailSign,
    footprint: [1.6, 2.5, 1.6]
  },
  chopping_block: {
    id: 'chopping_block',
    name: 'Woodcutters Chopping Block & Axe',
    tags: ['forest', 'camp', 'axe', 'lumber', 'cover'],
    builder: buildChoppingBlock,
    footprint: [1.4, 1.4, 1.4]
  },
  logging_cart: {
    id: 'logging_cart',
    name: 'Timber Logging Handcart',
    tags: ['forest', 'cart', 'lumber', 'transport', 'cover'],
    builder: buildLoggingCart,
    footprint: [3.4, 1.3, 2.0]
  },
  hollow_stump: {
    id: 'hollow_stump',
    name: 'Hollow Tree Stump Bunker',
    tags: ['forest', 'stump', 'cover', 'bunker'],
    builder: buildHollowStump,
    footprint: [2.8, 1.3, 2.8]
  },
  toadstools: {
    id: 'toadstools',
    name: 'Fly Agaric Toadstool Cluster',
    tags: ['forest', 'mushroom', 'flora', 'decoration'],
    builder: buildToadstoolCluster,
    footprint: [1.5, 0.8, 1.5]
  },
  survey_table: {
    id: 'survey_table',
    name: 'Canopy Survey Table & Instruments',
    tags: ['forest', 'table', 'survey', 'furniture', 'cover'],
    builder: buildSurveyTable,
    footprint: [2.8, 1.5, 1.8]
  },
  solar_array: {
    id: 'solar_array',
    name: 'Articulated Photovoltaic Solar Array',
    tags: ['space_station', 'station', 'space', 'solar', 'power', 'cover'],
    builder: buildSolarArray,
    footprint: [11.0, 6.5, 3.5]
  },
  cryo_pod: {
    id: 'cryo_pod',
    name: 'Cryo-Stasis Sleeper Pod',
    tags: ['space_station', 'station', 'space', 'stasis', 'pod', 'cover'],
    builder: buildCryoPod,
    footprint: [1.8, 1.3, 2.4]
  },
  airlock_hatch: {
    id: 'airlock_hatch',
    name: 'Pressurized Airlock Hatch Bulkhead',
    tags: ['space_station', 'station', 'space', 'airlock', 'door', 'hatch'],
    builder: buildAirlockHatch,
    footprint: [3.4, 4.2, 1.2]
  },
  centrifuge_ring: {
    id: 'centrifuge_ring',
    name: 'Habitat Centrifuge Core Hub & Ring',
    tags: ['space_station', 'station', 'space', 'centrifuge', 'hab', 'landmark'],
    builder: buildCentrifugeRing,
    footprint: [12.0, 10.5, 12.0]
  },
  hydroponic_tray: {
    id: 'hydroponic_tray',
    name: 'Hydroponic Algae Growth Bay',
    tags: ['space_station', 'station', 'space', 'hydroponic', 'algae', 'cover'],
    builder: buildHydroponicTray,
    footprint: [2.8, 2.2, 1.6]
  },
  communications_dish: {
    id: 'communications_dish',
    name: 'Deep-Space Communications Parabolic Dish',
    tags: ['space_station', 'station', 'space', 'antenna', 'dish', 'comms'],
    builder: buildCommunicationsDish,
    footprint: [6.5, 8.5, 6.5]
  },
  oxygen_tank_rack: {
    id: 'oxygen_tank_rack',
    name: 'High-Pressure Oxygen Tank Rack',
    tags: ['space_station', 'station', 'space', 'oxygen', 'gas', 'tank', 'cover'],
    builder: buildOxygenTankRack,
    footprint: [2.4, 1.4, 1.2]
  },
  telemetry_console: {
    id: 'telemetry_console',
    name: 'Telemetry Flight Station & Avionics Terminal',
    tags: ['space_station', 'station', 'space', 'terminal', 'console', 'computer', 'cover'],
    builder: buildTelemetryConsole,
    footprint: [2.2, 1.4, 1.8]
  },
  stone_lantern: {
    id: 'stone_lantern',
    name: 'Stone Lantern (Kasuga Toro)',
    tags: ['zen', 'shrine', 'garden', 'lantern', 'cover'],
    builder: buildStoneLantern,
    footprint: [0.8, 1.6, 0.8]
  },
  bamboo_fountain: {
    id: 'bamboo_fountain',
    name: 'Bamboo Rocking Water Fountain',
    tags: ['zen', 'garden', 'bamboo', 'water', 'fountain'],
    builder: buildBambooFountain,
    footprint: [1.0, 1.2, 1.0]
  },
  holo_pylon: {
    id: 'holo_pylon',
    name: 'Holographic Pylon Beacon',
    tags: ['cyber', 'beacon', 'holo', 'pylon', 'cover'],
    builder: buildHoloPylon,
    footprint: [0.7, 2.7, 0.7]
  },
  valve_bank: {
    id: 'valve_bank',
    name: 'Industrial Steam Valve Manifold Bank',
    tags: ['steampunk', 'steam', 'valve', 'pipe', 'cover'],
    builder: buildValveBank,
    footprint: [2.0, 1.1, 0.8]
  },
  pressure_gauge: {
    id: 'pressure_gauge',
    name: 'Brass Dial Pressure Gauge',
    tags: ['steampunk', 'steam', 'dial', 'gauge', 'cover'],
    builder: buildPressureGauge,
    footprint: [0.7, 1.5, 0.3]
  },
  chalkboard_wall: {
    id: 'chalkboard_wall',
    name: 'Slate Chalkboard Wall',
    tags: ['colossal', 'classroom', 'chalkboard', 'cover'],
    builder: buildChalkboardWall,
    footprint: [2.6, 2.8, 0.6]
  },
  crate_stack: {
    id: 'crate_stack',
    name: 'Wooden Shipping Crate Stack',
    tags: ['universal', 'crate', 'cover', 'cargo', 'box'],
    builder: buildCrateStack,
    footprint: [1.8, 1.7, 1.0]
  },
  sandbag_row: {
    id: 'sandbag_row',
    name: 'Canvas Sandbag Barricade Row',
    tags: ['universal', 'sandbag', 'cover', 'barricade'],
    builder: buildSandbagRow,
    footprint: [2.1, 1.0, 0.9]
  },
  antenna_whip: {
    id: 'antenna_whip',
    name: 'Whip Antenna Comms Post',
    tags: ['universal', 'antenna', 'comms', 'mast'],
    builder: buildAntennaWhip,
    footprint: [0.6, 4.0, 0.6]
  },
  rope_coil: {
    id: 'rope_coil',
    name: 'Manila Hemp Rope Coil',
    tags: ['maritime', 'rope', 'hawser', 'cover'],
    builder: buildRopeCoil,
    footprint: [1.1, 0.3, 1.1]
  },
  tool_rack: {
    id: 'tool_rack',
    name: 'Workshop Equipment & Tool Rack',
    tags: ['universal', 'tools', 'rack', 'cover'],
    builder: buildToolRack,
    footprint: [1.6, 1.4, 0.4]
  },
  warning_sign: {
    id: 'warning_sign',
    name: 'Hazard Caution Warning Sign',
    tags: ['universal', 'sign', 'hazard', 'caution'],
    builder: buildWarningSign,
    footprint: [0.6, 1.4, 0.2]
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
