import * as THREE from 'three';
import { INK } from './render.js';
import { create3DSpline, splineTube, sweptRibbon } from './spline-engine.js';
import { createRNG } from './rebuild/prng.js';

/**
 * DOODLE STRIKE ANATOMICAL GRAMMAR & PROCEDURAL ORGANIC ASSETS (Phase 2)
 * Eliminates the "box-stacking" primitive trap forever.
 * Provides biological and organic generative builders:
 *   1. buildCreatureSkeleton (Sprint-through ribcage defilade tunnel)
 *   2. buildOrganicFish (Swept spline leviathan with biro fin rays)
 *   3. buildBambooPlantation (Dense tactical bamboo grove with node rings)
 *   4. buildTerracedRidge (Layered rock ledges replacing urban stairs)
 */

/**
 * Generates an articulated Creature Skeleton Sprint Tunnel.
 * A vertebral spine carrying bilateral curved rib arches that players can sprint straight through.
 */
export function buildCreatureSkeleton(B, arg1, arg2, arg3, arg4) {
  const { cyl, arch, cone, ring, pickup } = B;
  let p1, p2, o;
  if (typeof arg1 === 'number') {
    const x = arg1;
    let y = 0, z = 0;
    if (typeof arg4 === 'object') {
      y = arg2; z = arg3; o = arg4;
    } else if (typeof arg3 === 'object') {
      z = arg2; o = arg3;
    } else {
      y = arg2 ?? 0; z = arg3 ?? 0; o = {};
    }
    const length = o.length ?? 24.0;
    const dir = o.dir ?? 'z';
    if (dir === 'x') {
      p1 = new THREE.Vector3(x - length / 2, y, z);
      p2 = new THREE.Vector3(x + length / 2, y, z);
    } else {
      p1 = new THREE.Vector3(x, y, z - length / 2);
      p2 = new THREE.Vector3(x, y, z + length / 2);
    }
  } else {
    p1 = Array.isArray(arg1) ? new THREE.Vector3(...arg1) : (arg1?.isVector3 ? arg1.clone() : new THREE.Vector3(0, 0, 0));
    p2 = Array.isArray(arg2) ? new THREE.Vector3(...arg2) : (arg2?.isVector3 ? arg2.clone() : new THREE.Vector3(0, 0, 20));
    o = typeof arg3 === 'object' ? arg3 : {};
  }
  const inkBone = o.inkBone ?? (INK.ORANGE ?? 3);
  const inkIron = o.inkIron ?? (INK.BLACK ?? 2);
  const ribPairs = Math.max(6, Math.min(16, o.ribPairs ?? 10));

  const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
  // Arch the spine upward in the middle for majestic profile
  mid.y += (o.archHeight ?? 4.5);

  const spinePoints = [
    p1,
    new THREE.Vector3().lerpVectors(p1, mid, 0.5).add(new THREE.Vector3(0, 1.0, 0)),
    mid,
    new THREE.Vector3().lerpVectors(mid, p2, 0.5).add(new THREE.Vector3(0, 0.8, 0)),
    p2
  ];

  const spline = create3DSpline(spinePoints, 0.5);
  const curveLength = spline.getLength();
  const samplePoints = spline.getSpacedPoints(ribPairs);
  const frenet = spline.computeFrenetFrames(ribPairs, false);

  // 1. Vertebral Column Discs
  for (let s = 0; s <= ribPairs; s++) {
    const pt = samplePoints[s];
    cyl(pt.x, pt.y - 0.4, pt.z, 0.65, 0.8, {
      seg: 8,
      ink: inkBone
    });
  }

  // 2. Bilateral Rib Arches (forming the sprint-through defilade tunnel)
  for (let s = 1; s < ribPairs; s++) {
    const pt = samplePoints[s];
    const t = s / ribPairs;
    // Rib envelope: expanding wide in chest, tapering at neck and tail
    const span = Math.max(3.2, 5.5 * Math.sin(t * Math.PI));
    const ribH = Math.max(2.8, 4.8 * Math.sin(t * Math.PI));

    // Span an arch centered over the corridor
    arch(pt.x, 0, pt.z, span, ribH, 0.45, {
      ink: inkBone,
      pillars: true,
      tag: 'skeleton_rib'
    });

    // Iron reinforcement band binding vertebrae (Trim)
    cyl(pt.x, pt.y + 0.2, pt.z, 0.25, span * 0.9, {
      axis: 'x',
      ink: inkIron,
      noCollide: true
    });
  }

  // 3. Faceted Cranium / Skull extending beyond the end of the ribcage
  const fwd = new THREE.Vector3().subVectors(p2, p1).normalize();
  const skullPt = p2.clone().addScaledVector(fwd, 2.5);
  cone(skullPt.x, 1.8, skullPt.z, 2.2, 3.8, { ink: inkBone, noCollide: true });
  // Eye sockets act as momentum grapple rings with safe clearance
  ring(skullPt.x - 1.2, 3.2, skullPt.z, 'z');
  ring(skullPt.x + 1.2, 3.2, skullPt.z, 'z');

  // Spine apex grapple ring
  ring(mid.x, mid.y + 3.2, mid.z, 'y');

  // Tactical Reward inside the belly of the beast
  pickup(mid.x, 0.4, mid.z);

  return {
    curveLength,
    ribCount: ribPairs * 2,
    headroom: 2.8
  };
}

/**
 * Generates an Anatomical Biro Fish / River Leviathan.
 * Lofted spline body with radiating fin rays and an open mouth grapple arch.
 */
export function buildOrganicFish(B, x, y, z, o = {}) {
  const { arch, ring } = B;
  const len = o.length ?? 20.0;
  const inkBody = o.inkBody ?? (INK.BLUE ?? 0);
  const inkFin = o.inkFin ?? (INK.ORANGE ?? 3);
  const inkDark = o.inkDark ?? (INK.BLACK ?? 2);

  // 1. Lofted fish fuselage using splineTube
  splineTube(B, [
    [x, y + 1.2, z - len * 0.45],
    [x, y + 3.2, z - len * 0.15],
    [x, y + 3.8, z + len * 0.15],
    [x, y + 1.8, z + len * 0.45]
  ], {
    samples: 16,
    radiusProfile: (t) => 0.8 + Math.sin(t * Math.PI) * 2.8,
    hollow: true,
    floor: true,
    ink: inkBody
  });

  // 2. Radiating Fin Rays (Dorsal & Pectoral)
  sweptRibbon(B, [
    [x, y + 5.5, z - len * 0.15],
    [x, y + 8.5, z],
    [x, y + 5.0, z + len * 0.2]
  ], {
    samples: 8,
    width: 0.8,
    ink: inkFin
  });

  // Tail Caudal Fin Flukes
  sweptRibbon(B, [
    [x, y + 1.8, z + len * 0.45],
    [x - 1.5, y + 4.5, z + len * 0.6],
    [x + 1.5, y - 0.5, z + len * 0.6]
  ], {
    samples: 6,
    width: 1.2,
    ink: inkFin
  });

  // 3. Open Mouth Arch
  arch(x, y, z - len * 0.5, 3.4, 3.2, 1.2, {
    ink: inkDark,
    pillars: true
  });

  // Grapple mouth ring for vertical ingress (with safe vertical clearance)
  ring(x, y + 5.2, z - len * 0.5, 'y');
  ring(x, y + 7.5, z, 'z');

  return { length: len };
}

/**
 * Generates a Dense Procedural Bamboo Plantation.
 * Slender vertical bamboo culms with segmented node rings, leaf fan fronds,
 * and clear 1.8m+ navigable CQB firing channels.
 */
export function buildBambooPlantation(B, arg1, arg2, arg3, arg4, arg5) {
  const { cyl, ring, pickup } = B;
  let cx = arg1, cz = arg2, width = 24.0, depth = 24.0, o = {};
  if (typeof arg4 === 'object') {
    cz = arg3;
    o = arg4;
    width = o.width ?? (o.radius ? o.radius * 2 : 24.0);
    depth = o.depth ?? width;
  } else if (typeof arg3 === 'object') {
    o = arg3;
    width = o.width ?? (o.radius ? o.radius * 2 : 24.0);
    depth = o.depth ?? width;
  } else if (typeof arg3 === 'number' && typeof arg4 === 'number') {
    width = arg3;
    depth = arg4;
    o = typeof arg5 === 'object' ? arg5 : {};
  }
  const numSeed = typeof o.seed === 'number' ? o.seed : 4421;
  const rng = createRNG(numSeed);
  const next = rng.next;

  const inkCulm = o.inkCulm ?? (INK.GREEN ?? 4);
  const inkNode = o.inkNode ?? (INK.BLACK ?? 2);
  const culmCount = Math.max(16, Math.min(48, o.count ?? 28));

  const minX = cx - width / 2;
  const maxX = cx + width / 2;
  const minZ = cz - depth / 2;
  const maxZ = cz + depth / 2;

  const culms = [];
  const minSpacing = 1.9; // Guarantees >= 1.8m anti-pinch rule compliance

  // Poisson-disk-like rejection sampling for natural grove spacing
  for (let attempt = 0; attempt < culmCount * 4 && culms.length < culmCount; attempt++) {
    const rx = minX + 1.5 + next() * (width - 3.0);
    const rz = minZ + 1.5 + next() * (depth - 3.0);

    const tooClose = culms.some(c => Math.hypot(c.x - rx, c.z - rz) < minSpacing);
    if (!tooClose) {
      culms.push({ x: rx, z: rz });
    }
  }

  // Build each bamboo culm with segmented node rings
  for (let c = 0; c < culms.length; c++) {
    const pos = culms[c];
    const h = 7.0 + next() * 6.0; // 7m - 13m height
    const r = 0.22 + next() * 0.12; // Slender radius

    // Vertical Bamboo Cane (with noNav so bots navigate the corridors)
    cyl(pos.x, 0, pos.z, r, h, {
      seg: 8,
      ink: inkCulm,
      noNav: true
    });

    // 4 to 6 Segmented Node Rings along the culm (Bamboo signature aesthetic)
    const nodeCount = 4 + Math.floor(next() * 3);
    for (let n = 1; n <= nodeCount; n++) {
      const nodeY = (n / (nodeCount + 1)) * h;
      cyl(pos.x, nodeY, pos.z, r * 1.35, 0.12, {
        seg: 8,
        ink: inkNode,
        noCollide: true
      });
    }

    // Radiating leaf fan fronds at the apex (drooping Asian bamboo leaf blades)
    if (B.addGeo) {
      const leafCount = 4 + Math.floor(next() * 3);
      const baseAngle = next() * Math.PI * 2;
      for (let l = 0; l < leafCount; l++) {
        const leafAngle = baseAngle + (l / leafCount) * Math.PI * 2 + (next() - 0.5) * 0.25;
        const leafLen = 1.6 + next() * 0.8;
        const leafW = 0.22;
        const g = new THREE.BoxGeometry(leafW, 0.04, leafLen);
        g.rotateX(0.28); // droop downward slightly
        g.rotateY(leafAngle);
        g.translate(pos.x + Math.sin(leafAngle) * (leafLen * 0.4), h - 0.15, pos.z + Math.cos(leafAngle) * (leafLen * 0.4));
        B.addGeo(g, inkCulm);
      }
      // Small leaf tufts at upper 2 node rings
      for (let n = Math.max(1, nodeCount - 1); n <= nodeCount; n++) {
        const nodeY = (n / (nodeCount + 1)) * h;
        for (let t = 0; t < 2; t++) {
          const tuftAngle = next() * Math.PI * 2;
          const tuftLen = 0.85 + next() * 0.35;
          const g = new THREE.BoxGeometry(0.12, 0.03, tuftLen);
          g.rotateX(0.35); // drooping
          g.rotateY(tuftAngle);
          g.translate(pos.x + Math.sin(tuftAngle) * (tuftLen * 0.4), nodeY, pos.z + Math.cos(tuftAngle) * (tuftLen * 0.4));
          B.addGeo(g, inkCulm);
        }
      }
    }

    // Occasional overhead grapple ring on tallest bamboo culms
    if (h > 11.0 && c % 4 === 0) {
      ring(pos.x, h + 0.6, pos.z, 'y');
    }
  }

  // Bamboo grove center clearing with tactical reward
  pickup(cx, 0.3, cz);

  return {
    culmCount: culms.length,
    groveArea: width * depth,
    averageHeight: 10.0
  };
}

/**
 * Generates Natural Terraced Rock Ledges & Earthen Berms.
 * Completely replaces standalone urban staircases in outdoor natural biomes.
 */
export function buildTerracedRidge(B, arg1, arg2, arg3, arg4, arg5) {
  const { slab, facetedRock, wedge, ring } = B;
  let x = arg1, z = arg2, o = {};
  if (typeof arg4 === 'object') {
    z = arg3;
    o = arg4;
  } else if (typeof arg3 === 'object') {
    o = arg3;
  } else if (typeof arg5 === 'object') {
    o = arg5;
  }
  const width = o.width ?? (typeof arg3 === 'number' && typeof arg4 === 'number' ? arg3 : 12.0);
  const totalHeight = o.totalHeight ?? o.height ?? (typeof arg4 === 'number' ? arg4 : 4.5);
  const steps = Math.max(3, Math.min(8, o.tiers ?? 4));
  const tierRise = totalHeight / steps;
  const tierRun = (o.run ?? 3.5);
  const inkRock = o.inkRock ?? (INK.BLACK ?? 2);
  const inkGrass = o.inkGrass ?? (INK.GREEN ?? 4);

  const dirMap = {
    '+z': [0, 1],
    '-z': [0, -1],
    '+x': [1, 0],
    '-x': [-1, 0]
  };
  const rawDir = String(o.dir || '+z').toLowerCase();
  const dirKey = dirMap[rawDir] ? rawDir : '+z';
  const [ddx, ddz] = dirMap[dirKey];

  let currY = 0;
  let currX = x;
  let currZ = z;

  for (let t = 0; t < steps; t++) {
    currY += tierRise;
    currX += ddx * tierRun;
    currZ += ddz * tierRun;

    const cx0 = currX - ddx * tierRun * 0.5;
    const cz0 = currZ - ddz * tierRun * 0.5;
    const halfX = ddx !== 0 ? tierRun * 0.5 : width / 2;
    const halfZ = ddz !== 0 ? tierRun * 0.5 : width / 2;

    // Broad walkable earthen/rock shelf
    slab(
      cx0 - halfX,
      cz0 - halfZ,
      cx0 + halfX,
      cz0 + halfZ,
      currY,
      0.4,
      { ink: inkGrass }
    );

    // Natural faceted rock boulders lining the terrace perimeter (crouch cover)
    const perpX = -ddz * (width * 0.4);
    const perpZ = ddx * (width * 0.4);
    facetedRock(cx0 + perpX, currY, cz0 + perpZ, 1.4, 1.0, 1.4, {
      ink: inkRock,
      cover: 'waist'
    });
    facetedRock(cx0 - perpX, currY, cz0 - perpZ, 1.4, 1.0, 1.4, {
      ink: inkRock,
      cover: 'waist'
    });

    // Sloped transition wedge along the step edge for smooth mantling
    const wedgeX = currX - ddx * tierRun;
    const wedgeZ = currZ - ddz * tierRun;
    wedge(wedgeX, currY - tierRise, wedgeZ,
      ddx !== 0 ? 0.6 : width * 0.8,
      tierRise,
      ddz !== 0 ? 0.6 : width * 0.8,
      {
        dir: dirKey,
        ink: inkRock
      }
    );
  }

  return {
    totalRise: totalHeight,
    tiers: steps
  };
}
