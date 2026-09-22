import { INK } from './render.js';
import { createRNG } from './rebuild/prng.js';
import { annularDeck } from './spline-engine.js';
import { buildCreatureSkeleton, buildOrganicFish, buildBambooPlantation, buildTerracedRidge } from './anatomy-grammar.js';

export { buildCreatureSkeleton, buildOrganicFish, buildBambooPlantation, buildTerracedRidge };

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

  // 3. Climbable Spiral Trunk Steps (wrapping up to canopy platform at Y = y + 6.5, rise = 0.28m)
  const stepCount = 23;
  const stairSweep = Math.PI * 2.2;
  for (let i = 0; i < stepCount; i++) {
    const angle = (i / stepCount) * stairSweep;
    const stepY = y + (i + 1) * 0.28;
    const sx = x + Math.cos(angle) * (trunkR + 0.9);
    const sz = z + Math.sin(angle) * (trunkR + 0.9);
    box(sx, stepY, sz, 1.4, 0.28, 1.4, { ink: inkBark, tag: 'stairs' });
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
 * Tapered trunk, vertical bark ridges, 4-layer overlapping needle skirts, and rock base.
 */
export function buildPineTree(B, x, y, z, o = {}) {
  const { cyl, cone, box, facetedRock, ring } = B;
  const inkBark = o.inkBark ?? (INK.BLACK ?? 2);
  const inkLeaves = o.inkLeaves ?? (INK.GREEN ?? 4);
  const h = o.h ?? 16.0;
  const lean = o.lean ?? (Math.sin(x * 12.3 + z * 3.7) * 0.35);

  // 1. Tapered trunk in 2 segments
  const baseR = 0.52 * (h / 16.0);
  const midR = 0.38 * (h / 16.0);
  cyl(x, y, z, baseR, h * 0.52, { ink: inkBark });
  cyl(x + lean * 0.5, y + h * 0.5, z + lean * 0.5, midR, h * 0.52, { ink: inkBark, noCollide: true });

  // 2. Vertical bark ridge strips (for ballpoint outline/hatch definition)
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    box(x + Math.cos(a) * (baseR + 0.04), y + 0.5, z + Math.sin(a) * (baseR + 0.04), 0.08, h * 0.45, 0.08, { ink: inkBark, noCollide: true });
  }

  // 3. 4-Tiered Conical Needle Skirts with slight scale jitter & lean
  const tierCount = 4;
  for (let t = 0; t < tierCount; t++) {
    const fraction = (t + 1) / (tierCount + 1);
    const tierY = y + fraction * h + 1.0;
    const tierR = Math.max(1.4, (3.6 - t * 0.6) * (h / 16.0));
    const tierH = Math.max(1.8, (3.4 - t * 0.35) * (h / 16.0));
    const offsetX = lean * (fraction * 0.7);
    const offsetZ = lean * (fraction * 0.7);
    cone(x + offsetX, tierY, z + offsetZ, tierR, tierH, { ink: inkLeaves });
  }

  // 4. Base micro-cover: natural faceted rock
  facetedRock(x + 0.9, y, z + 0.5, 1.2, 0.85, 1.1, { ink: inkBark, tag: 'cover' });

  // 5. Apex Grapple Ring
  ring(x + lean, y + h + 0.6, z + lean, 'y');
}

/**
 * Procedural Suspended Timber Rope Bridge
 * Planks with subtle gaps, natural catenary sag (2-3%), round rope handrails, and vertical drop ties.
 */
export function buildSuspendedRopeBridge(B, x1, z1, x2, z2, y, o = {}) {
  const { box, cyl, collider } = B;
  const inkPlank = o.inkPlank ?? (INK.ORANGE ?? 3);
  const inkRope = o.inkRope ?? (INK.BLACK ?? 2);
  const width = o.width ?? 1.8;
  const maxSag = o.maxSag ?? 0.35;

  const dx = x2 - x1;
  const dz = z2 - z1;
  const len = Math.hypot(dx, dz);
  if (len < 1.0) return;

  const dirX = dx / len;
  const dirZ = dz / len;
  const perpX = -dirZ;
  const perpZ = dirX;

  const plankSpacing = 0.85;
  const numPlanks = Math.max(3, Math.floor(len / plankSpacing));
  const plankThickness = 0.22;

  // Segmented walkable colliders closely hugging the catenary sag curve (zero player floating)
  const segCount = Math.max(4, Math.round(len / 2.8));
  for (let s = 0; s < segCount; s++) {
    const tA = s / segCount, tB = (s + 1) / segCount;
    const tm = (tA + tB) / 2;
    const ym = y - Math.sin(tm * Math.PI) * maxSag;
    const sx = x1 + dx * tm, sz = z1 + dz * tm;
    const segLen = (len / segCount) + 0.15; // small overlap so player never falls through
    collider(sx, ym - 0.15, sz,
      Math.abs(dirX) > 0.5 ? segLen : width,
      0.35,
      Math.abs(dirX) > 0.5 ? width : segLen
    );
  }

  // Individual planks with downward catenary sag
  for (let i = 0; i <= numPlanks; i++) {
    const t = i / numPlanks;
    const px = x1 + dx * t;
    const pz = z1 + dz * t;
    const sag = Math.sin(t * Math.PI) * maxSag;
    const py = y - sag;

    box(px, py, pz,
      Math.abs(dirX) > 0.5 ? 0.65 : width,
      plankThickness,
      Math.abs(dirX) > 0.5 ? width : 0.65,
      { ink: inkPlank, noCollide: true }
    );
  }

  // Left and Right Rope Handrails
  const railH = 0.95;
  const subSegments = Math.max(4, Math.floor(len / 3.0));
  for (let s = 0; s < subSegments; s++) {
    const tA = s / subSegments;
    const tB = (s + 1) / subSegments;
    const xA = x1 + dx * tA, zA = z1 + dz * tA;
    const xB = x1 + dx * tB, zB = z1 + dz * tB;
    const yA = y - Math.sin(tA * Math.PI) * maxSag + railH;
    const yB = y - Math.sin(tB * Math.PI) * maxSag + railH;

    for (const side of [-1, 1]) {
      const rxA = xA + perpX * (width / 2) * side;
      const rzA = zA + perpZ * (width / 2) * side;
      const rxB = xB + perpX * (width / 2) * side;
      const rzB = zB + perpZ * (width / 2) * side;

      const mx = (rxA + rxB) / 2, my = (yA + yB) / 2, mz = (rzA + rzB) / 2;
      const segLen = Math.hypot(rxB - rxA, rzB - rzA);
      box(mx, my, mz,
        Math.abs(dirX) > 0.5 ? segLen : 0.12,
        0.12,
        Math.abs(dirX) > 0.5 ? 0.12 : segLen,
        { ink: inkRope, noCollide: true }
      );
    }
  }

  // Vertical rope suspension ties
  for (let i = 1; i < numPlanks; i += 3) {
    const t = i / numPlanks;
    const px = x1 + dx * t;
    const pz = z1 + dz * t;
    const py = y - Math.sin(t * Math.PI) * maxSag;

    for (const side of [-1, 1]) {
      const rx = px + perpX * (width / 2) * side;
      const rz = pz + perpZ * (width / 2) * side;
      cyl(rx, py + 0.1, rz, 0.04, railH, { ink: inkRope, noCollide: true });
    }
  }
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
  sphere(x, y + 0.36, z, 0.12, { ink: INK.ORANGE, noCollide: true });
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
 * Procedural Wooden Crate Stack - Universal Cover (Seeded Parametric Variety)
 * Generates unique crate arrangements, variable stack heights, and rotated micro-crates.
 */
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

/**
 * Procedural Transit Commuter Bus - 12m Urban Coach Landmark
 * Features 3D chassis, parametric liveries, destination LED head signs, roof variations, and mantleable bumper.
 */
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

/**
 * Procedural Terminal Clock Departure Tower - Urban Transit Landmark
 * Four-sided analog clock spire with destination split-flap schedule boards and high grapple ring.
 */
export function buildTerminalClockTower(B, x, y, z, o = {}) {
  const { box, slab, cyl, ring } = B;
  const inkStructure = o.inkStructure ?? (INK.BLUE ?? 0);
  const inkClock = o.inkClock ?? (INK.BLACK ?? 2);
  const inkAccent = o.inkAccent ?? (INK.ORANGE ?? 3);

  // 1. Foundation plinth
  slab(x - 2.2, z - 2.2, x + 2.2, z + 2.2, y, 0.6, { ink: inkStructure });

  // 2. Main vertical four-sided pillar
  box(x, y + 0.6, z, 2.8, 8.5, 2.8, { ink: inkStructure });

  // 3. Mezzanine balcony overlook at Y = y + 4.2
  slab(x - 3.2, z - 3.2, x + 3.2, z + 3.2, y + 4.2, 0.35, { ink: inkAccent });

  // 4. Four-sided departure split-flap boards
  for (const [dx, dz] of [[0, 1.42], [0, -1.42], [1.42, 0], [-1.42, 0]]) {
    box(x + dx, y + 5.2, z + dz, dx ? 0.08 : 2.2, 1.4, dz ? 0.08 : 2.2, { ink: inkAccent, noCollide: true });
  }

  // 5. Four-sided clock head at top
  box(x, y + 9.1, z, 3.4, 3.2, 3.4, { ink: inkStructure });
  for (const [dx, dz] of [[0, 1.72], [0, -1.72], [1.72, 0], [-1.72, 0]]) {
    cyl(x + dx, y + 10.7, z + dz, 1.1, 0.06, { axis: dx ? 'x' : 'z', ink: inkClock, noCollide: true });
  }

  // 6. Apex spire & Momentum Grapple Ring
  cyl(x, y + 12.3, z, 0.18, 5.0, { ink: inkClock, noCollide: true });
  ring(x, y + 17.5, z, 'y');
}

/**
 * Procedural Perforated Transit Waiting Bench - Tier 1 Micro Cover
 */
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

/**
 * Procedural Cantilever Passenger Shelter - Tier 2 Meso Tactical Prop
 */
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

/**
 * Procedural Space-Frame Concourse Arch - Swept Steel Tubular Roof (Airport & Grand Terminal Architecture)
 * True 3D curved structural rib arches, cross-bracing steel lattice, and skylight apertures.
 */
export function buildSpaceFrameConcourse(B, x, y, z, o = {}) {
  const { box, cyl, ring } = B;
  const inkSteel = o.inkSteel ?? (INK.BLUE ?? 0);
  const inkLattice = o.inkLattice ?? (INK.BLACK ?? 2);
  const span = o.span ?? 36.0;
  const length = o.length ?? 48.0;
  const apexH = o.apexH ?? 11.5;
  const archCount = Math.max(3, Math.floor(length / 12.0));

  const halfSpan = span / 2;
  const zStart = z - length / 2;
  const zStep = length / (archCount - 1);

  for (let a = 0; a < archCount; a++) {
    const curZ = zStart + a * zStep;
    const segments = 10;
    for (let s = 0; s < segments; s++) {
      const t1 = s / segments;
      const t2 = (s + 1) / segments;
      const ang1 = Math.PI * t1;
      const ang2 = Math.PI * t2;

      const px1 = x - Math.cos(ang1) * halfSpan;
      const py1 = y + Math.sin(ang1) * apexH;
      const px2 = x - Math.cos(ang2) * halfSpan;
      const py2 = y + Math.sin(ang2) * apexH;

      const segDx = px2 - px1;
      const segDy = py2 - py1;
      const segLen = Math.hypot(segDx, segDy);
      const midX = (px1 + px2) / 2;
      const midY = (py1 + py2) / 2;

      // Primary heavy tubular arch rib
      cyl(midX, midY, curZ, 0.22, segLen, { axis: 'x', ink: inkSteel, noCollide: true });

      // Cross-truss purlins connecting to next arch
      if (a < archCount - 1 && s % 2 === 0) {
        cyl(px1, py1, curZ + zStep / 2, 0.12, zStep, { axis: 'z', ink: inkLattice, noCollide: true });
      }
    }

    // Traversal grapple ring at the apex of each arch (skip if at center where clock tower stands)
    if (Math.hypot(x, curZ) > 4.0) {
      ring(x, y + apexH + 2.0, curZ, 'y');
    }
  }
}

/**
 * Procedural Tiled Transit Underpass & Subway Flank Corridor
 * Walkable subterranean / sunken corridor linking platforms with safety handrails and stairwells.
 */
export function buildTransitUnderpass(B, x, y, z, o = {}) {
  const { box, slab, rail } = B;
  const inkTile = o.inkTile ?? (INK.BLUE ?? 0);
  const inkStair = o.inkStair ?? (INK.BLACK ?? 2);
  const width = o.width ?? 3.8;
  const length = o.length ?? 24.0;
  const depth = o.depth ?? 2.8;

  // Subterranean floor slab
  slab(x - width / 2, z - length / 2, x + width / 2, z + length / 2, y - depth, 0.35, { ink: inkTile });

  // Retaining concrete side walls
  box(x - width / 2 - 0.2, y - depth, z, 0.4, depth + 1.0, length, { ink: inkStair });
  box(x + width / 2 + 0.2, y - depth, z, 0.4, depth + 1.0, length, { ink: inkStair });

  // Protective handrails along top openings
  rail(x - width / 2, z - length / 2, x - width / 2, z + length / 2, y, { ink: inkStair });
  rail(x + width / 2, z - length / 2, x + width / 2, z + length / 2, y, { ink: inkStair });

  // North entrance staircase (rising from y - depth up to y)
  const steps = 10;
  const rise = depth / steps;
  const run = 0.45;
  for (let i = 0; i < steps; i++) {
    const sY = y - depth + i * rise;
    const sZ = z - length / 2 + (i + 1) * run;
    box(x, sY, sZ, width - 0.4, rise, run, { ink: inkTile, tag: 'stairs' });
  }

  // South entrance staircase
  for (let i = 0; i < steps; i++) {
    const sY = y - depth + i * rise;
    const sZ = z + length / 2 - (i + 1) * run;
    box(x, sY, sZ, width - 0.4, rise, run, { ink: inkTile, tag: 'stairs' });
  }
}

/**
 * Procedural Urban Ground Decals: Oil Stains, Sewer Grates & Directional Traffic Markings
 * Anchors the transit terminal into the paper substrate, killing sterile boxiness.
 */
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
    builder: buildSuspendedRopeBridge,
    footprint: [3.0, 4.0, 14.0]
  },
  suspended_rope_bridge: {
    id: 'suspended_rope_bridge',
    name: 'Procedural Catenary Rope Bridge',
    tags: ['forest', 'maritime', 'bridge', 'rope', 'walkway'],
    builder: buildSuspendedRopeBridge,
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
  },
  parametric_tree: {
    id: 'parametric_tree',
    name: 'Parametric Organic Tree (Titan/Slender/Gnarled)',
    tags: ['forest', 'organic', 'tree', 'canopy', 'colossal', 'cover', 'grapple'],
    builder: generateParametricTree,
    footprint: [12.0, 30.0, 12.0]
  },
  curved_hollow_log: {
    id: 'curved_hollow_log',
    name: 'Curved Hollow Log Sprint Tunnel',
    tags: ['forest', 'log', 'tunnel', 'cqb', 'catwalk', 'corridor', 'cover'],
    builder: buildCurvedHollowLog,
    footprint: [6.0, 4.0, 18.0]
  },
  boulder_field: {
    id: 'boulder_field',
    name: 'Faceted Boulder Cover Field',
    tags: ['universal', 'rock', 'boulder', 'cover', 'tactical'],
    builder: buildBoulderField,
    footprint: [8.0, 3.0, 8.0]
  },
  giant_grass: {
    id: 'giant_grass',
    name: 'Giant Stalk Grass with Grapple Ring',
    tags: ['forest', 'grass', 'grapple', 'cover', 'nature', 'flora'],
    builder: buildGiantGrass,
    footprint: [2.5, 7.0, 2.5]
  },
  treehouse: {
    id: 'treehouse',
    name: 'Colossal Titan Treehouse Fortress',
    tags: ['forest', 'treehouse', 'colossal', 'tree', 'catwalk', 'cabin', 'grapple', 'landmark'],
    builder: buildTreehouse,
    footprint: [12.0, 26.0, 12.0]
  },
  creature_skeleton: {
    id: 'creature_skeleton',
    name: 'Leviathan Creature Skeleton Sprint Tunnel',
    tags: ['creature', 'skeleton', 'tunnel', 'defilade', 'ribcage', 'corridor'],
    builder: buildCreatureSkeleton,
    footprint: [6.0, 5.0, 24.0]
  },
  organic_fish: {
    id: 'organic_fish',
    name: 'Organic Swept Spline Fish Leviathan',
    tags: ['creature', 'fish', 'spline', 'loft', 'landmark'],
    builder: buildOrganicFish,
    footprint: [8.0, 6.0, 24.0]
  },
  bamboo_plantation: {
    id: 'bamboo_plantation',
    name: 'Dense Procedural Bamboo Plantation',
    tags: ['forest', 'bamboo', 'plantation', 'grove', 'cqb', 'cover'],
    builder: buildBambooPlantation,
    footprint: [24.0, 12.0, 24.0]
  },
  terraced_ridge: {
    id: 'terraced_ridge',
    name: 'Natural Terraced Rock Ledge Ridge',
    tags: ['nature', 'rock', 'terrace', 'elevation', 'traverse'],
    builder: buildTerracedRidge,
    footprint: [12.0, 5.0, 18.0]
  },
  atmospheric_beams: {
    id: 'atmospheric_beams',
    name: 'Crepuscular Sky Rays & Atmospheric Beams',
    tags: ['atmosphere', 'sky-rays', 'lighting', 'vfx'],
    builder: buildAtmosphericBeams,
    footprint: [14.0, 20.0, 14.0]
  },
  ink_splatters: {
    id: 'ink_splatters',
    name: 'Biro Ink Droplet & Splatter Decal Cluster',
    tags: ['vfx', 'ink', 'splatter', 'paper', 'decal'],
    builder: buildInkSplatters,
    footprint: [2.5, 0.1, 2.5]
  },
  technical_framing: {
    id: 'technical_framing',
    name: 'Drafting Paper Technical Framing & Elevation Stamp',
    tags: ['framing', 'paper-technical', 'drafting', 'brackets'],
    builder: buildTechnicalFraming,
    footprint: [8.0, 0.2, 8.0]
  },
  transit_bus: {
    id: 'transit_bus',
    name: 'Monumental 12m Transit Commuter Bus',
    tags: ['urban', 'bus', 'transit', 'vehicle', 'landmark', 'cover'],
    builder: buildTransitBus,
    footprint: [2.8, 3.2, 11.5]
  },
  terminal_clock_tower: {
    id: 'terminal_clock_tower',
    name: 'Central Terminal Clock & Schedule Departure Tower',
    tags: ['urban', 'clock', 'tower', 'transit', 'station', 'landmark'],
    builder: buildTerminalClockTower,
    footprint: [3.4, 15.6, 3.4]
  },
  transit_bench: {
    id: 'transit_bench',
    name: 'Perforated Transit Passenger Waiting Bench',
    tags: ['urban', 'bench', 'transit', 'cover', 'tactical'],
    builder: buildTransitBench,
    footprint: [1.9, 0.9, 0.6]
  },
  passenger_shelter: {
    id: 'passenger_shelter',
    name: 'Cantilever Passenger Boarding Shelter',
    tags: ['urban', 'shelter', 'canopy', 'transit', 'cover'],
    builder: buildPassengerShelter,
    footprint: [7.2, 3.4, 3.2]
  },
  space_frame_concourse: {
    id: 'space_frame_concourse',
    name: 'Curved Space-Frame Concourse Steel Arch',
    tags: ['urban', 'transit', 'arch', 'canopy', 'roof', 'landmark'],
    builder: buildSpaceFrameConcourse,
    footprint: [36.0, 12.0, 48.0]
  },
  transit_underpass: {
    id: 'transit_underpass',
    name: 'Tiled Subterranean Transit Underpass',
    tags: ['urban', 'transit', 'underpass', 'tunnel', 'stairs', 'cqb'],
    builder: buildTransitUnderpass,
    footprint: [4.0, 3.0, 24.0]
  },
  urban_decals: {
    id: 'urban_decals',
    name: 'Urban Ground Decals & Drainage Grates',
    tags: ['urban', 'transit', 'decal', 'pavement', 'drain'],
    builder: buildUrbanDecals,
    footprint: [4.0, 0.1, 4.0]
  },
  arcade_cabinet: {
    id: 'arcade_cabinet',
    name: 'Vintage Upright Arcade Cabinet Pod',
    tags: ['arcade', 'retro_arcade', 'cabinet', 'cover', 'cqb'],
    builder: buildArcadeCabinet,
    footprint: [2.4, 2.2, 1.8]
  },
  pinball_bumper: {
    id: 'pinball_bumper',
    name: 'Kinetic Pop-Bumper Jump Pad',
    tags: ['arcade', 'retro_arcade', 'bumper', 'jump', 'pinball'],
    builder: buildPinballBumper,
    footprint: [1.8, 1.4, 1.8]
  },
  locomotive_boiler: {
    id: 'locomotive_boiler',
    name: 'Victorian Locomotive Boiler & Running Gear',
    tags: ['train_depot', 'depot', 'boiler', 'locomotive', 'landmark'],
    builder: buildLocomotiveBoiler,
    footprint: [4.2, 4.4, 14.0]
  },
  water_tower: {
    id: 'water_tower',
    name: 'Elevated Riveted Water Tank Tower',
    tags: ['train_depot', 'depot', 'tower', 'water', 'landmark', 'sniper'],
    builder: buildWaterTower,
    footprint: [8.0, 15.0, 8.0]
  },
  bunsen_burner: {
    id: 'bunsen_burner',
    name: 'Colossal Laboratory Bunsen Burner',
    tags: ['chemistry_lab', 'lab', 'burner', 'flame', 'landmark', 'grapple'],
    builder: buildBunsenBurner,
    footprint: [5.0, 14.0, 5.0]
  }
};

/**
 * Procedural Parametric Organic Tree Generator (Blueprint 2)
 * Kills the Static Clone Problem: generates Titan, Slender, or Gnarled trees
 * using continuous parameter spaces, da Vinci branch area preservation, and
 * rich tactical furniture (buttress root ramps, hollow trunk niche, canopy deck).
 */
export function generateParametricTree(B, x, y, z, o = {}) {
  const { box, slab, cyl, sphere, ring, rail, wedge, facetedRock, arch } = B;
  const numSeed = typeof o.seed === 'number' ? o.seed : (typeof o === 'number' ? o : 1337);
  const rng = createRNG(numSeed);
  const next = rng.next;

  const inkBark = o.inkBark ?? INK.BLACK;
  const inkLeaves = o.inkLeaves ?? INK.GREEN;
  const inkCover = o.inkCover ?? INK.ORANGE;

  // Phase A: Body Plan / Archetype Selection
  let archetype = o.archetype;
  if (!archetype) {
    const roll = next();
    if (roll < 0.40) archetype = 'titan';
    else if (roll < 0.75) archetype = 'slender';
    else archetype = 'gnarled';
  }

  let height, trunkR, leanDeg, taper, branches, crownR;
  if (archetype === 'titan') {
    height = o.height ?? (25 + next() * 10);      // 25 - 35m
    trunkR = o.trunkR ?? (2.4 + next() * 1.0);     // 2.4 - 3.4m
    leanDeg = o.lean ?? (next() * 4);             // 0 - 4 deg
    taper = 0.35;
    branches = 4 + Math.floor(next() * 3);        // 4 - 6 branches
    crownR = trunkR * 3.2;
  } else if (archetype === 'slender') {
    height = o.height ?? (9 + next() * 4);        // 9 - 13m
    trunkR = o.trunkR ?? (0.3 + next() * 0.2);     // 0.3 - 0.5m
    leanDeg = o.lean ?? (15 + next() * 10);       // 15 - 25 deg
    taper = 0.85;
    branches = 2 + Math.floor(next() * 3);        // 2 - 4 branches
    crownR = 3.2;
  } else {
    // Gnarled / Stout
    height = o.height ?? (5.5 + next() * 2.5);    // 5.5 - 8m
    trunkR = o.trunkR ?? (0.9 + next() * 0.5);     // 0.9 - 1.4m
    leanDeg = o.lean ?? (5 + next() * 10);        // 5 - 15 deg
    taper = 0.60;
    branches = 3 + Math.floor(next() * 2);        // 3 - 4 major limbs
    crownR = 4.2;
  }

  const leanAzimuth = next() * Math.PI * 2;
  const leanDirX = Math.cos(leanAzimuth);
  const leanDirZ = Math.sin(leanAzimuth);
  const totalLeanM = Math.tan(leanDeg * (Math.PI / 180)) * height;

  // Phase B: Segmented Trunk with smoothstep ease
  const segCount = archetype === 'titan' ? 7 : (archetype === 'slender' ? 5 : 4);
  const segH = height / segCount;
  let currY = y;
  const trunkNodes = [];

  for (let i = 0; i < segCount; i++) {
    const t = i / segCount;
    const r_i = Math.max(0.3, trunkR * Math.pow(Math.max(0.01, 1 - t * 0.7), taper));
    
    // Smoothstep ease profile for organic lean
    const ease = 3 * t * t - 2 * t * t * t;
    const drift = ease * totalLeanM;
    const noise = (next() - 0.5) * 0.3;
    const segX = x + leanDirX * (drift + noise);
    const segZ = z + leanDirZ * (drift + noise);

    cyl(segX, currY, segZ, r_i, segH, { seg: 10, ink: inkBark });
    trunkNodes.push({ x: segX, y: currY + segH / 2, z: segZ, r: r_i });
    currY += segH;
  }

  // Phase C: Branches using Leonardo da Vinci area preservation
  const branchSlots = Math.min(branches, trunkNodes.length - 1);
  for (let b = 0; b < branchSlots; b++) {
    const nodeIdx = Math.min(trunkNodes.length - 1, Math.floor(segCount * 0.45) + b);
    const parentNode = trunkNodes[nodeIdx];
    const bAngle = leanAzimuth + (b * (Math.PI * 2 / branchSlots)) + (next() - 0.5) * 0.4;
    const bLen = Math.max(3.0, (height - (parentNode.y - y)) * 0.55);
    // da Vinci area-preservation: child girth = parent * sqrt(1 / siblings)
    const bGirth = Math.max(0.35, parentNode.r * Math.sqrt(1 / Math.max(2, branchSlots)));
    const bx = parentNode.x + Math.cos(bAngle) * (bLen / 2 + parentNode.r);
    const bz = parentNode.z + Math.sin(bAngle) * (bLen / 2 + parentNode.r);
    const by = parentNode.y + bLen * 0.35;

    // Branch limb
    cyl(bx, by, bz, bGirth, bLen, { axis: Math.abs(Math.cos(bAngle)) > Math.abs(Math.sin(bAngle)) ? 'x' : 'z', ink: inkBark });

    // Standable branch tip perches
    if (archetype === 'titan' || next() > 0.4) {
      const tipX = parentNode.x + Math.cos(bAngle) * (bLen + parentNode.r);
      const tipZ = parentNode.z + Math.sin(bAngle) * (bLen + parentNode.r);
      slab(tipX - 1.2, tipZ - 1.2, tipX + 1.2, tipZ + 1.2, by + 0.3, 0.25, { ink: inkBark });
      ring(tipX, by + 4.5, tipZ, 'y');
    }
  }

  // Phase D: Foliage Crown
  const apexNode = trunkNodes[trunkNodes.length - 1];
  const crownOffset = archetype === 'slender' ? crownR * 0.3 : 0;
  const crownCenterX = apexNode.x + leanDirX * crownOffset;
  const crownCenterZ = apexNode.z + leanDirZ * crownOffset;
  const crownCenterY = currY;

  const clusterCount = archetype === 'titan' ? 8 : 5;
  for (let c = 0; c < clusterCount; c++) {
    const cAngle = (c / clusterCount) * Math.PI * 2 + next() * 0.5;
    const cDist = next() * (crownR * 0.7);
    const clX = crownCenterX + Math.cos(cAngle) * cDist;
    const clZ = crownCenterZ + Math.sin(cAngle) * cDist;
    const clY = crownCenterY + (next() - 0.3) * (crownR * 0.6);
    const clR = crownR * (0.55 + next() * 0.45);
    sphere(clX, clY, clZ, clR, { seg: 8, ink: inkLeaves, noCollide: true });
  }

  // Phase E: Tactical Furniture
  if (archetype === 'titan') {
    // 1. Buttress Root Spiral Ramp
    const revSteps = 16;
    for (let s = 0; s < revSteps; s++) {
      const sAngle = s * 0.42;
      const sY = y + s * 0.28;
      const sDist = trunkR + 0.9;
      const stepX = x + Math.cos(sAngle) * sDist;
      const stepZ = z + Math.sin(sAngle) * sDist;
      box(stepX, sY, stepZ, 1.8, 0.28, 1.8, { ink: inkBark, tag: 'stairs' });
    }

    // Intermediate rest landing at climb Y = 4.5m
    const landAngle = revSteps * 0.42;
    const landX = x + Math.cos(landAngle) * (trunkR + 1.4);
    const landZ = z + Math.sin(landAngle) * (trunkR + 1.4);
    slab(landX - 1.8, landZ - 1.8, landX + 1.8, landZ + 1.8, y + 4.5, 0.4, { ink: inkBark });

    // 2. Hollow Trunk Niche (CQB room inside trunk base)
    arch(x + trunkR * 0.95, y, z, 2.6, 3.2, 0.8, { ink: inkBark });
    facetedRock(x, y, z, 0.9, 1.0, 0.9, { ink: inkBark, cover: 'waist' });

    // 3. Canopy Combat Deck (Y = y + height * 0.68)
    const deckY = y + height * 0.68;
    const deckW = Math.max(8.0, trunkR * 3.5);
    slab(apexNode.x - deckW / 2, apexNode.z - deckW / 2, apexNode.x + deckW / 2, apexNode.z + deckW / 2, deckY, 0.45, { ink: inkBark });
    
    // Safety railings
    rail(apexNode.x - deckW / 2, apexNode.z - deckW / 2, apexNode.x + deckW / 2, apexNode.z - deckW / 2, deckY, { ink: inkBark });
    rail(apexNode.x - deckW / 2, apexNode.z + deckW / 2, apexNode.x + deckW / 2, apexNode.z + deckW / 2, deckY, { ink: inkBark });
    rail(apexNode.x - deckW / 2, apexNode.z - deckW / 2, apexNode.x - deckW / 2, apexNode.z + deckW / 2, deckY, { ink: inkBark });
    rail(apexNode.x + deckW / 2, apexNode.z - deckW / 2, apexNode.x + deckW / 2, apexNode.z + deckW / 2, deckY, { ink: inkBark });

    // Waist cover parapet rocks on deck
    facetedRock(apexNode.x - deckW * 0.3, deckY, apexNode.z, 1.2, 1.1, 1.0, { ink: inkCover, cover: 'waist' });
    facetedRock(apexNode.x + deckW * 0.3, deckY, apexNode.z, 1.2, 1.1, 1.0, { ink: inkCover, cover: 'waist' });

    // Overhead Grapple Rings (cleanly above tree crown and outward on branch)
    ring(apexNode.x, currY + 3.5, apexNode.z, 'y');
    ring(apexNode.x + trunkR + 2.5, deckY + 4.5, apexNode.z + trunkR + 2.5, 'x');

    // Root skirt waist cover rocks
    for (let r = 0; r < 4; r++) {
      const rAngle = (r / 4) * Math.PI * 2 + 0.3;
      const rx = x + Math.cos(rAngle) * (trunkR + 1.8);
      const rz = z + Math.sin(rAngle) * (trunkR + 1.8);
      facetedRock(rx, y, rz, 1.4, 1.1, 1.4, { ink: inkBark, cover: 'waist', seed: (numSeed + r * 17) });
    }
  } else if (archetype === 'gnarled') {
    facetedRock(x + trunkR + 1.2, y, z, 1.3, 1.0, 1.3, { ink: inkBark, cover: 'waist' });
    facetedRock(x - trunkR - 1.2, y, z, 1.3, 1.0, 1.3, { ink: inkBark, cover: 'waist' });
    ring(x, currY + 4.0, z, 'y');
  } else {
    ring(apexNode.x, currY + 3.5, apexNode.z, 'y');
  }

  return {
    archetype,
    height,
    trunkR,
    apex: { x: apexNode.x, y: currY, z: apexNode.z },
    deckY: archetype === 'titan' ? (y + height * 0.68) : null
  };
}

/**
 * Curved Hollow Log Sprint Tunnel (Blueprint 2 & 3)
 * Multi-segment fallen log corridor with honest 1.8m/2.2m clearance bore,
 * exterior shelf-fungus spiral stairs, and elevated top catwalk with parapets.
 */
export function buildCurvedHollowLog(B, x, y, z, o = {}) {
  const { hollowCyl, box, slab, rail, ring, facetedRock } = B;
  const numSeed = typeof o.seed === 'number' ? o.seed : (typeof o === 'number' ? o : 1337);
  const rng = createRNG(numSeed);
  const next = rng.next;

  const inkBark = o.inkBark ?? INK.BLACK;
  const inkFoliage = o.inkFoliage ?? INK.GREEN;
  const inkCover = o.inkCover ?? INK.ORANGE;

  const rInner = o.rInner ?? 1.5;   // Guaranteed 2.2m+ clear headroom
  const rOuter = o.rOuter ?? 1.9;
  const segCount = Math.max(2, Math.min(4, o.segments ?? (2 + Math.floor(next() * 2))));
  const segLen = o.segLen ?? (7.0 + next() * 3.0);

  let currX = x;
  let currY = y + rInner;
  let currZ = z;
  let angle = (o.initialAngle ?? (next() * Math.PI * 2));

  const logCenters = [];

  for (let s = 0; s < segCount; s++) {
    const dx = Math.cos(angle);
    const dz = Math.sin(angle);
    const dominantAxis = Math.abs(dx) > Math.abs(dz) ? 'x' : 'z';

    hollowCyl(currX, currY, currZ, rInner, rOuter, segLen, {
      axis: dominantAxis,
      floor: true,
      f: 0.5,
      bands: 3,
      ink: inkBark,
      bandInk: inkFoliage
    });

    logCenters.push({ x: currX, y: currY, z: currZ, axis: dominantAxis, len: segLen });

    // Top catwalk slab on the outer chord
    const catY = currY + rOuter;
    if (dominantAxis === 'x') {
      slab(currX - segLen / 2, currZ - rOuter * 0.6, currX + segLen / 2, currZ + rOuter * 0.6, catY, 0.3, { ink: inkBark });
      rail(currX - segLen / 2, currZ - rOuter * 0.6, currX + segLen / 2, currZ - rOuter * 0.6, catY, { ink: inkCover });
      rail(currX - segLen / 2, currZ + rOuter * 0.6, currX + segLen / 2, currZ + rOuter * 0.6, catY, { ink: inkCover });
      ring(currX, catY + 6.5, currZ, 'x');
    } else {
      slab(currX - rOuter * 0.6, currZ - segLen / 2, currX + rOuter * 0.6, currZ + segLen / 2, catY, 0.3, { ink: inkBark });
      rail(currX - rOuter * 0.6, currZ - segLen / 2, currX - rOuter * 0.6, currZ + segLen / 2, catY, { ink: inkCover });
      rail(currX + rOuter * 0.6, currZ - segLen / 2, currX + rOuter * 0.6, currZ + segLen / 2, catY, { ink: inkCover });
      ring(currX, catY + 6.5, currZ, 'z');
    }

    // Step to next segment with a 20-35 deg kink
    const kink = (next() > 0.5 ? 1 : -1) * (0.35 + next() * 0.25);
    angle += kink;
    currX += dx * (segLen * 0.85);
    currZ += dz * (segLen * 0.85);
  }

  // Exterior shelf-fungus spiral stairs climbing up the first segment
  const firstSeg = logCenters[0];
  const shelfCount = 7;
  for (let sh = 0; sh < shelfCount; sh++) {
    const sTheta = sh * 0.35;
    const shY = y + sh * 0.28;
    const shDist = rOuter + 0.4;
    const shX = firstSeg.x - (firstSeg.len / 3) + sh * 0.8;
    const shZ = firstSeg.z + Math.sin(sTheta) * shDist;
    box(shX, shY, shZ, 1.2, 0.25, 0.8, { ink: inkFoliage, tag: 'stairs' });
  }

  // Entrance and exit tactical cover boulders
  facetedRock(x - 2.5, y, z, 1.4, 1.0, 1.4, { ink: inkBark, cover: 'waist', seed: numSeed });
  const lastSeg = logCenters[logCenters.length - 1];
  facetedRock(lastSeg.x + 2.5, y, lastSeg.z, 1.4, 1.0, 1.4, { ink: inkBark, cover: 'waist', seed: numSeed + 55 });

  return {
    segmentCount: segCount,
    totalLength: segCount * segLen,
    rInner,
    rOuter,
    catwalkY: currY + rOuter
  };
}

/**
 * Faceted Boulder Cover Field (Blueprint 2 & 4)
 * Places a tactical cluster of faceted sketched boulders providing
 * waist cover, full cover, and unobstructed movement channels.
 */
export function buildBoulderField(B, x, y, z, o = {}) {
  const { facetedRock } = B;
  const numSeed = typeof o.seed === 'number' ? o.seed : (typeof o === 'number' ? o : 1337);
  const rng = createRNG(numSeed);
  const next = rng.next;

  const count = Math.max(3, Math.min(8, o.count ?? (4 + Math.floor(next() * 3))));
  const radius = o.radius ?? (5.0 + next() * 3.0);
  const ink = o.ink ?? INK.BLACK;

  // 1 Full cover anchor rock in center
  facetedRock(x + (next() - 0.5) * 2, y, z + (next() - 0.5) * 2, 2.0, 2.8, 2.0, {
    ink,
    cover: 'full',
    seed: numSeed + 1
  });

  // Surrounding waist cover rocks positioned with >= 1.8m clearance
  for (let i = 1; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (next() - 0.5) * 0.4;
    const dist = 2.4 + next() * (radius - 2.4);
    const rx = x + Math.cos(angle) * dist;
    const rz = z + Math.sin(angle) * dist;
    const isWaist = i < count - 1;
    const rockSeed = numSeed + i * 23;

    facetedRock(rx, y, rz, 1.2 + next() * 0.6, isWaist ? 1.0 : 0.5, 1.2 + next() * 0.6, {
      ink,
      cover: isWaist ? 'waist' : 'decor',
      seed: rockSeed
    });
  }

  return { count, radius };
}

/**
 * Procedural Giant Stalk Grass with Apical Grapple Ring (Colossal Forest)
 * Radiating green blade clusters providing waist-high defilade at base,
 * with a monumental flexible central stalk crowned with an aerial momentum grapple ring.
 */
export function buildGiantGrass(B, x, y, z, o = {}) {
  const { box, wedge, cyl, ring } = B;
  const ink = o.ink ?? INK.GREEN;
  const inkStem = o.inkStem ?? INK.BLACK;
  const rng = createRNG(o.seed ?? Math.round(Math.abs(x * 31 + z * 17) + 101));
  const height = o.height ?? (5.5 + rng.next() * 2.5); // 5.5m - 8.0m deterministic

  // 1. Waist-high radiating blade cluster (cover)
  box(x - 0.4, y, z, 0.8, 1.1, 0.2, { ink, tag: 'cover' });
  box(x + 0.4, y, z, 0.8, 0.95, 0.2, { ink, tag: 'cover' });
  box(x, y, z - 0.4, 0.2, 1.05, 0.8, { ink, tag: 'cover' });
  box(x, y, z + 0.4, 0.2, 1.15, 0.8, { ink, tag: 'cover' });

  // 2. Slanted outer fronds using wedges
  wedge(x - 0.7, y + 0.5, z, 1.2, 0.25, 0.8, { dir: '-x', ink, noCollide: true });
  wedge(x + 0.7, y + 0.5, z, 1.2, 0.25, 0.8, { dir: '+x', ink, noCollide: true });

  // 3. Central Monumental Reed Stalk
  cyl(x, y, z, 0.18, height, { ink: inkStem, noCollide: true });

  // 4. Apical Momentum Grapple Ring for high-speed gliding and zapping
  ring(x, y + height + 0.3, z, 'y');

  return { height, ringY: y + height + 0.3 };
}

/**
 * Procedural Colossal Titan Treehouse (Colossal Forest Macro Landmark)
 * Monumental redwood trunk supporting a multi-level constructed wooden treehouse cabin,
 * spiral trunk staircase, wrap-around timber balcony with parapets, secondary escape route,
 * and high-altitude grapple highway rings (C1-C7 Colossal Contract compliant).
 */
export function buildTreehouse(B, x, y, z, o = {}) {
  const { box, slab, cyl, ring, rail, pickup } = B;
  const inkBark = o.inkBark ?? INK.BLACK;
  const inkWood = o.inkWood ?? INK.ORANGE;
  const inkLeaves = o.inkLeaves ?? INK.GREEN;

  const trunkR = o.trunkR ?? 2.8;
  const totalH = o.height ?? 26.0;
  const deckY = y + (o.deckY ?? 9.5);

  // 1. Massive Redwood Trunk Base (Y = y to y + totalH)
  cyl(x, y, z, trunkR, totalH, { seg: 12, ink: inkBark });

  // 2. Spiral Trunk Staircase (Ground to Deck: 34 steps, rise=0.28m, flush deck exit)
  const stepCount = 34;
  const sweep = Math.PI * 2.2;
  const startAngle = -Math.PI * 0.4;
  for (let s = 0; s < stepCount; s++) {
    const angle = startAngle + (s / stepCount) * sweep;
    const stepR = trunkR + 0.7;
    const sx = x + Math.cos(angle) * stepR;
    const sz = z + Math.sin(angle) * stepR;
    const sy = y + s * 0.28;
    box(sx, sy, sz, 1.3, 0.28, 1.3, { ink: inkWood, tag: 'stair' });
  }

  // 3. Main Constructed Timber Deck Platform at Y = deckY (curved annular deck with open stairwell hatch)
  const deckR = trunkR + 3.4;
  annularDeck(B, x, z, trunkR, deckR, deckY, {
    segments: 16,
    thickness: 0.45,
    hatchAngleStart: Math.PI * 1.55,
    hatchAngleEnd: Math.PI * 1.95,
    ink: inkWood
  });

  // 4. Constructed Wooden Cabin Shelter (North quadrant of deck)
  const cabinX = x;
  const cabinZ = z + 2.4;
  const cabinY = deckY + 0.45;
  // Back wall
  box(cabinX, cabinY, cabinZ + 2.0, 5.0, 3.2, 0.35, { ink: inkWood });
  // Side walls
  box(cabinX - 2.4, cabinY, cabinZ, 0.35, 3.2, 4.0, { ink: inkWood });
  box(cabinX + 2.4, cabinY, cabinZ, 0.35, 3.2, 4.0, { ink: inkWood });
  // Front wall with 2.2m clear doorway opening
  box(cabinX - 1.6, cabinY, cabinZ - 2.0, 1.4, 3.2, 0.35, { ink: inkWood });
  box(cabinX + 1.6, cabinY, cabinZ - 2.0, 1.4, 3.2, 0.35, { ink: inkWood });
  box(cabinX, cabinY + 2.7, cabinZ - 2.0, 2.0, 0.5, 0.35, { ink: inkWood }); // door lintel
  // Overhanging timber roof
  slab(cabinX - 3.0, cabinZ - 2.6, cabinX + 3.0, cabinZ + 2.6, cabinY + 3.2, 0.3, { ink: inkLeaves });

  // 5. Tactical Cover Blocks & Reward on Deck
  box(x - 3.6, deckY + 0.45, z - 2.0, 1.1, 1.1, 0.8, { ink: inkWood, tag: 'cover' });
  box(x + 3.6, deckY + 0.45, z - 2.0, 1.1, 1.1, 0.8, { ink: inkWood, tag: 'cover' });
  pickup(cabinX, cabinY + 0.4, cabinZ);

  // 6. Secondary Exit Route (West egress ladder/ramp conforming to Colossal Contract C6)
  slab(x - 7.5, z - 1.2, x - 5.0, z + 1.2, deckY - 1.5, 0.3, { ink: inkWood });
  cyl(x - 6.2, y, z, 0.15, deckY - 1.5, { ink: inkBark, noCollide: true });

  // 7. High-Altitude Grapple Highway Rings (for gliding, swinging, and zapping)
  ring(x, deckY + 4.5, z - 5.5, 'z');
  ring(x, deckY + 5.0, z + 5.5, 'z');
  ring(x, y + totalH + 2.5, z, 'y');
  ring(x + 4.5, y + totalH + 3.0, z, 'x');
  ring(x - 4.5, y + totalH + 3.0, z, 'x');

  return {
    deckY,
    cabinPos: [cabinX, cabinY, cabinZ],
    rings: 5
  };
}

/**
 * Registers a new prefab or declarative recipe dynamically into the registry.
 */
export function registerPrefab(id, builderFn, metadata = {}) {
  PREFAB_REGISTRY[id] = {
    id,
    name: metadata.name || id,
    tags: metadata.tags || ['recipe', 'taught'],
    builder: builderFn,
    footprint: metadata.footprint || [4.0, 4.0, 4.0],
    ...metadata
  };
  return PREFAB_REGISTRY[id];
}

/**
 * Compiles and instantiates a declarative compound prefab definition (parts array).
 */
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

/**
 * Instantiates any registered prefab by ID or thematic keyword.
 * Supports procedural builder functions and declarative compound prefab recipes.
 */
export function instantiatePrefab(B, prefabId, x, y, z, o = {}) {
  // Direct compound object pass { parts: [...] }
  if (typeof prefabId === 'object' && Array.isArray(prefabId.parts)) {
    return buildCompoundParts(B, prefabId.parts, x, y, z, o);
  }

  // Caller passed parts override in options
  if (Array.isArray(o.parts)) {
    return buildCompoundParts(B, o.parts, x, y, z, o);
  }

  let entry = PREFAB_REGISTRY[prefabId];
  if (!entry && typeof prefabId === 'string') {
    const norm = prefabId.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    entry = PREFAB_REGISTRY[norm];
    if (!entry) {
      // Find key or tag match
      for (const [k, v] of Object.entries(PREFAB_REGISTRY)) {
        if (norm.includes(k) || k.includes(norm) || (v.tags && v.tags.some(t => norm.includes(t)))) {
          entry = v;
          break;
        }
      }
    }
  }

  if (!entry) {
    // Ultimate graceful fallback: book_stack for urban/colossal or crate_stack
    entry = PREFAB_REGISTRY['crate_stack'] || PREFAB_REGISTRY['book_stack'];
    if (!entry) {
      console.warn(`[PREFAB] Unknown prefab ID "${prefabId}". Available:`, Object.keys(PREFAB_REGISTRY));
      return false;
    }
  }

  // Compound parts array on registered prefab
  if (Array.isArray(entry.parts)) {
    return buildCompoundParts(B, entry.parts, x, y, z, { ...entry.opts, ...o });
  }

  if (typeof entry.builder === 'function') {
    entry.builder(B, x, y, z, o);
    return true;
  }

  console.warn(`[PREFAB] Registered prefab ID "${prefabId}" has neither builder function nor parts definition.`);
  return false;
}

// ============================================================================
// MICRO-DETAIL & POLISH GENERATORS (File 02 & File 03 Kits)
// ============================================================================

/**
 * Procedural Scribble Blob Shadow
 * Grounds 3D props in an ink-drawn world with a diegetic shadow footprint.
 */
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

/**
 * Procedural Ground Litter Cluster
 * Tiny leaf flakes, twigs, and pebbles scattered around tree/boulder bases.
 */
export function buildLeafLitter(B, x, z, count = 5, radius = 1.6, o = {}) {
  // File 10 Fix 4: Micro-detail build-time distance culling beyond fog engagement horizon
  if (Math.hypot(x, z) > 50.0 && !o.force) return;
  const { box } = B;
  const rng = createRNG(o.seed ?? Math.round(Math.abs(x * 43 + z * 29) + 7));
  const next = rng.next;
  const inkLeaves = o.inkLeaves ?? INK.GREEN;
  const inkDark = o.inkDark ?? INK.BLACK;

  for (let i = 0; i < count; i++) {
    const angle = next() * Math.PI * 2;
    const dist = 0.4 + next() * radius;
    const lx = x + Math.cos(angle) * dist;
    const lz = z + Math.sin(angle) * dist;
    const lw = 0.2 + next() * 0.25;
    const ld = 0.15 + next() * 0.2;
    box(lx, 0.018 + i * 0.002, lz, lw, 0.01, ld, {
      ink: (i % 2 === 0) ? inkLeaves : inkDark,
      noCollide: true
    });
  }

  // 1 small fallen twig
  const tang = next() * Math.PI * 2;
  const tdist = 0.3 + next() * (radius * 0.8);
  const tx = x + Math.cos(tang) * tdist;
  const tz = z + Math.sin(tang) * tdist;
  box(tx, 0.022, tz, 0.6 + next() * 0.4, 0.02, 0.04, {
    ink: inkDark,
    noCollide: true
  });
}

/**
 * Procedural Hanging Bamboo Lantern & Grapple Node
 * Paper lantern strung between bamboo culms providing aerial grapple navigation.
 */
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

/**
 * Concentric Water Ripple Rings
 * Visual ripples radiating around river stepping stones and splashing trout.
 */
export function buildWaterRipples(B, x, z, r = 1.4, o = {}) {
  const { box } = B;
  const ink = o.ink ?? INK.BLUE;
  const y = 0.045; // Just flush above water surface

  // 4 thin perimeter arc segments forming a circular ripple ring
  const d = r * 0.707;
  box(x, y, z + r, r * 1.2, 0.01, 0.05, { ink, noCollide: true });
  box(x, y, z - r, r * 1.2, 0.01, 0.05, { ink, noCollide: true });
  box(x + r, y, z, 0.05, 0.01, r * 1.2, { ink, noCollide: true });
  box(x - r, y, z, 0.05, 0.01, r * 1.2, { ink, noCollide: true });
}

/**
 * Crepuscular Sky Rays & Atmospheric Beams (Skills: 3d-sky-rays & create-game-vfx)
 * Beautiful sun shafts and desk-lamp light cones piercing through canopies and high structures.
 * Uses angled non-colliding translucent visual guide prisms and crossbars.
 */
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

/**
 * Procedural Biro Ink Droplets & Splatters (Skill: create-game-vfx)
 * Authentic ballpoint ink bleed decals on paper floors at impact nodes or landmark entrances.
 */
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

/**
 * Drafting Paper Technical Framing (Skill: light-mode-paper-technical)
 * Precise technical corner L-brackets, coordinate ticks, and elevation stamps
 * on tactical platforms and arenas.
 */
export function buildTechnicalFraming(B, minX, minZ, maxX, maxZ, y, o = {}) {
  const { box } = B;
  const ink = o.ink ?? INK.BLACK;
  const bracketL = o.bracketLength ?? 1.2;
  const tickW = 0.06;
  const tickH = 0.02;

  // Northwest corner bracket
  box(minX + bracketL / 2, y + 0.02, minZ, bracketL, tickH, tickW, { ink, noCollide: true });
  box(minX, y + 0.02, minZ + bracketL / 2, tickW, tickH, bracketL, { ink, noCollide: true });

  // Northeast corner bracket
  box(maxX - bracketL / 2, y + 0.02, minZ, bracketL, tickH, tickW, { ink, noCollide: true });
  box(maxX, y + 0.02, minZ + bracketL / 2, tickW, tickH, bracketL, { ink, noCollide: true });

  // Southwest corner bracket
  box(minX + bracketL / 2, y + 0.02, maxZ, bracketL, tickH, tickW, { ink, noCollide: true });
  box(minX, y + 0.02, maxZ - bracketL / 2, tickW, tickH, bracketL, { ink, noCollide: true });

  // Southeast corner bracket
  box(maxX - bracketL / 2, y + 0.02, maxZ, bracketL, tickH, tickW, { ink, noCollide: true });
  box(maxX, y + 0.02, maxZ - bracketL / 2, tickW, tickH, bracketL, { ink, noCollide: true });

  // Center coordinate reticle mark (+)
  const midX = (minX + maxX) / 2;
  const midZ = (minZ + maxZ) / 2;
  box(midX, y + 0.02, midZ, 0.6, tickH, tickW, { ink, noCollide: true });
  box(midX, y + 0.02, midZ, tickW, tickH, 0.6, { ink, noCollide: true });
}

/**
 * Procedural Arcade Cabinet Pod
 */
export function buildArcadeCabinet(B, x, y, z, o = {}) {
  const { box } = B;
  const inkBody = o.inkBody ?? INK.BLACK;
  const inkScreen = o.inkScreen ?? INK.BLUE;
  const inkMarquee = o.inkMarquee ?? INK.RED;

  box(x, y, z, 1.2, 2.2, 1.1, { ink: inkBody });
  box(x, y + 1.2, z + 0.1, 1.0, 0.7, 0.2, { ink: inkScreen, noCollide: true });
  box(x, y + 2.0, z, 1.1, 0.3, 0.4, { ink: inkMarquee, noCollide: true });
}

/**
 * Procedural Kinetic Pop-Bumper Jump Pad
 */
export function buildPinballBumper(B, x, y, z, o = {}) {
  const { cyl, ring } = B;
  const inkBase = o.inkBase ?? INK.ORANGE;
  const inkCap = o.inkCap ?? INK.RED;

  cyl(x, y, z, 0.9, 0.4, { seg: 10, ink: inkBase });
  cyl(x, y + 0.4, z, 0.7, 0.8, { seg: 10, ink: inkCap, tag: 'cover' });
  cyl(x, y + 1.2, z, 1.1, 0.2, { seg: 12, ink: inkBase });
  ring(x, y + 3.8, z, 'y');
}

/**
 * Procedural Locomotive Boiler Loft
 */
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

/**
 * Procedural Riveted Water Tank Tower
 */
export function buildWaterTower(B, x, y, z, o = {}) {
  const { box, slab, rail, cyl, ring } = B;
  const inkLegs = o.inkLegs ?? INK.BLACK;
  const inkTank = o.inkTank ?? INK.BLUE;
  const inkDeck = o.inkDeck ?? INK.ORANGE;

  // 4 Legs
  box(x - 2.8, y, z - 2.8, 0.8, 7.5, 0.8, { ink: inkLegs });
  box(x + 2.8, y, z - 2.8, 0.8, 7.5, 0.8, { ink: inkLegs });
  box(x - 2.8, y, z + 2.8, 0.8, 7.5, 0.8, { ink: inkLegs });
  box(x + 2.8, y, z + 2.8, 0.8, 7.5, 0.8, { ink: inkLegs });

  // Balcony deck
  slab(x - 3.8, z - 3.8, x + 3.8, z + 3.8, y + 7.5, 0.4, { ink: inkDeck });
  rail(x - 3.8, z - 3.8, x + 3.8, z - 3.8, y + 7.5, { ink: inkLegs });
  rail(x - 3.8, z + 3.8, x + 3.8, z + 3.8, y + 7.5, { ink: inkLegs });
  rail(x - 3.8, z - 3.8, x - 3.8, z + 3.8, y + 7.5, { ink: inkLegs });
  rail(x + 3.8, z - 3.8, x + 3.8, z + 3.8, y + 7.5, { ink: inkLegs });

  // Tank cylinder
  cyl(x, y + 7.9, z, 2.6, 4.5, { seg: 12, ink: inkTank });
  ring(x, y + 13.5, z, 'y');
}

/**
 * Procedural Laboratory Bunsen Burner
 */
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


