import * as THREE from 'three';
import { INK } from '../render.js';
import { rand, choose } from '../util.js';
import { splineTube, annularDeck, sweptRibbon } from '../spline-engine.js';
import { createRNG } from '../rebuild/prng.js';
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
