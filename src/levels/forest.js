import * as THREE from 'three';
import { INK, makeInkMaterial } from '../render.js';
import {
  buildTreehouse,
  buildGiantGrass,
  buildPineTree,
  buildAncientTree,
  generateParametricTree,
  buildCurvedHollowLog,
  buildBoulderField,
  buildToadstoolCluster,
  buildHollowLog,
  buildHollowStump,
  buildWoodStack,
  buildCampfire,
  buildTrailSign,
  buildLoggingCart,
  buildSurveyTable,
  buildBambooPlantation,
  buildCreatureSkeleton,
  buildOrganicFish,
  buildTerracedRidge,
  buildSuspendedRopeBridge,
  buildBlobShadow,
  buildLeafLitter,
  buildBambooLantern,
  buildWaterRipples
} from '../prefabs.js';

/**
 * THE COLOSSAL CANOPY (Forest)
 * A monumental, organic, hand-drawn 3D woodland sanctuary.
 * Built with living biro curves, mathematical splines, and anatomical grammars.
 * 
 * Key Features:
 * 1. Monumental 28m Titan Redwood Treehouse with 20 spiral trunk steps and OPEN-HATCH annular deck.
 * 2. Dense NW Bamboo Plantation with Poisson-spaced culms, segmented nodes, and radiating leaf fan fronds.
 * 3. Cavernous SW Leviathan Skeletal Spine sprint tunnel with arched bilateral ribcage defilade.
 * 4. Sunken Mountain Riverbed with granite banks, natural stepping stones, arched footbridge, and animated leaping biro trout.
 * 5. 4 Winding beaten-earth trails radiating from spawns through mossy clearings to the central clearing.
 * 6. Suspended timber rope bridges with catenary sag, wood planks, and round rope rails.
 * 7. Natural terraced rock ridges replacing all artificial urban stairs.
 * 8. Ragged perimeter conifer skyline (36+ alpine conifers) dissolving naturally into sketchbook paper fog.
 */
export function buildForest(B, arena = false) {
  const { L, box, slab, wallX, wallZ, rail, cyl, sphere, wedge, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = INK.ORANGE ?? 3, GR = INK.GREEN ?? 4, BK = INK.BLACK ?? 2, BL = INK.BLUE ?? 0, RD = INK.RED ?? 1;

  L.key = 'forest';
  const P = arena ? 68 : 55, PH = arena ? 30 : 20, T = 6;
  const D = P - 3;
  L.bounds = { minX: -P, maxX: P, minZ: -P, maxZ: P };

  // ==================== 1. FOREST BED & WINDING BEATEN DIRT TRAILS ====================
  // Deep mossy forest ground floor (rich green drafting paper wash)
  box(0, -1.0, 0, 2 * P + T, 1.0, 2 * P + T, { ink: GR });

  // Ground-tint washes (File 03 Kit 2: killing uniform floor boxiness)
  // Silt wash along riverbanks (Y = 0.012)
  box(21.0, 0.012, 0, 11.5, 0.01, 88.0, { ink: BL, noCollide: true });
  // Charred ash wash around campfire
  box(22.0, 0.012, 26.0, 5.5, 0.01, 5.5, { ink: BK, noCollide: true });
  // Sylvan leaf-mold wash under bamboo grove
  box(-28.0, 0.012, -26.0, 20.0, 0.01, 20.0, { ink: GR, noCollide: true });

  // Central clearing (beaten earth around the giant Titan Redwood)
  box(0, 0.01, 0, 14.0, 0.02, 14.0, { noCollide: true, ink: OR });

  // 4 Winding Beaten-Earth Trails radiating from spawns to central clearing
  // North Trail: from (0, -50) to (0, -7) with organic bends
  const nTrailNodes = [
    [0, -50], [-1.8, -42], [2.2, -32], [-1.2, -22], [0.8, -14], [0, -7]
  ];
  for (let i = 0; i < nTrailNodes.length - 1; i++) {
    const [x1, z1] = nTrailNodes[i], [x2, z2] = nTrailNodes[i + 1];
    const mx = (x1 + x2) / 2, mz = (z1 + z2) / 2;
    const dx = x2 - x1, dz = z2 - z1;
    const len = Math.hypot(dx, dz);
    box(mx, 0.01, mz, Math.abs(dx) > Math.abs(dz) ? len : 2.4, 0.02, Math.abs(dx) > Math.abs(dz) ? 2.4 : len, { noCollide: true, ink: OR });
  }

  // South Trail: from (0, 50) past campfire glade to (0, 7)
  const sTrailNodes = [
    [0, 50], [2.4, 40], [-1.6, 30], [1.4, 20], [0, 12], [0, 7]
  ];
  for (let i = 0; i < sTrailNodes.length - 1; i++) {
    const [x1, z1] = sTrailNodes[i], [x2, z2] = sTrailNodes[i + 1];
    const mx = (x1 + x2) / 2, mz = (z1 + z2) / 2;
    const dx = x2 - x1, dz = z2 - z1;
    const len = Math.hypot(dx, dz);
    box(mx, 0.01, mz, Math.abs(dx) > Math.abs(dz) ? len : 2.4, 0.02, Math.abs(dx) > Math.abs(dz) ? 2.4 : len, { noCollide: true, ink: OR });
  }

  // West Trail: from (-50, 0) through bamboo grove entrance to (-7, 0)
  const wTrailNodes = [
    [-50, 0], [-40, -1.8], [-30, 2.0], [-20, -0.8], [-12, 0.5], [-7, 0]
  ];
  for (let i = 0; i < wTrailNodes.length - 1; i++) {
    const [x1, z1] = wTrailNodes[i], [x2, z2] = wTrailNodes[i + 1];
    const mx = (x1 + x2) / 2, mz = (z1 + z2) / 2;
    const dx = x2 - x1, dz = z2 - z1;
    const len = Math.hypot(dx, dz);
    box(mx, 0.01, mz, Math.abs(dx) > Math.abs(dz) ? len : 2.4, 0.02, Math.abs(dx) > Math.abs(dz) ? 2.4 : len, { noCollide: true, ink: OR });
  }

  // East Trail: Approaches east riverbank, footbridge spans river, trail resumes on west bank (Finding 7)
  const eTrailNodesEast = [
    [50, 0], [42, -2.0], [34, -10.0], [28.5, -15.0]
  ];
  for (let i = 0; i < eTrailNodesEast.length - 1; i++) {
    const [x1, z1] = eTrailNodesEast[i], [x2, z2] = eTrailNodesEast[i + 1];
    const mx = (x1 + x2) / 2, mz = (z1 + z2) / 2;
    const dx = x2 - x1, dz = z2 - z1;
    const len = Math.hypot(dx, dz);
    box(mx, 0.01, mz, Math.abs(dx) > Math.abs(dz) ? len : 2.4, 0.02, Math.abs(dx) > Math.abs(dz) ? 2.4 : len, { noCollide: true, ink: OR });
  }
  const eTrailNodesWest = [
    [13.5, -16.0], [8.5, -8.0], [7.0, 0]
  ];
  for (let i = 0; i < eTrailNodesWest.length - 1; i++) {
    const [x1, z1] = eTrailNodesWest[i], [x2, z2] = eTrailNodesWest[i + 1];
    const mx = (x1 + x2) / 2, mz = (z1 + z2) / 2;
    const dx = x2 - x1, dz = z2 - z1;
    const len = Math.hypot(dx, dz);
    box(mx, 0.01, mz, Math.abs(dx) > Math.abs(dz) ? len : 2.4, 0.02, Math.abs(dx) > Math.abs(dz) ? 2.4 : len, { noCollide: true, ink: OR });
  }

  // ==================== 2. NATURAL PERIMETER BERMS & CONIFER SKYLINE ====================
  // Defensive perimeter boundary colliders (hulls preventing falling off world)
  const NG = { noNav: true, noGrapple: true };
  collider(0, 0, -P - 1, 2 * P + T, 25, T, NG);
  collider(0, 0, P + 1, 2 * P + T, 25, T, NG);
  collider(-P - 1, 0, 0, T, 25, 2 * P + T, NG);
  collider(P + 1, 0, 0, T, 25, 2 * P + T, NG);

  // Natural perimeter earthen berms & mossy boulders (replaces the flat 20m black box walls)
  for (let s = -P + 6; s <= P - 6; s += 10) {
    const rW = 9.0, rH = 2.4 + ((Math.abs(s) * 7) % 1.2), rD = 3.6;
    // North & South berms
    box(s, 0, -P + 2.5, rW, rH, rD, { ink: BK, noNav: true });
    box(s, 0, P - 2.5, rW, rH, rD, { ink: BK, noNav: true });
    // West & East berms
    box(-P + 2.5, 0, s, rD, rH, rW, { ink: BK, noNav: true });
    box(P - 2.5, 0, s, rD, rH, rW, { ink: BK, noNav: true });
  }

  // Staggered ring of 36 colossal perimeter conifers creating a natural ragged tree skyline
  const coniferHeights = [20.0, 26.0, 22.0, 28.0, 24.0, 22.0, 26.0, 20.0];
  let cIdx = 0;
  // North conifer perimeter (Z ≈ -50)
  for (let x = -48; x <= 48; x += 12) {
    const h = coniferHeights[cIdx++ % coniferHeights.length];
    const jx = x + ((cIdx * 3) % 4) - 2;
    buildPineTree(B, jx, 0, -50.0, { h, inkBark: BK, inkLeaves: GR });
  }
  // South conifer perimeter (Z ≈ 50)
  for (let x = -48; x <= 48; x += 12) {
    const h = coniferHeights[cIdx++ % coniferHeights.length];
    const jx = x + ((cIdx * 5) % 4) - 2;
    buildPineTree(B, jx, 0, 50.0, { h, inkBark: BK, inkLeaves: GR });
  }
  // West conifer perimeter (X ≈ -50)
  for (let z = -40; z <= 40; z += 12) {
    const h = coniferHeights[cIdx++ % coniferHeights.length];
    const jz = z + ((cIdx * 7) % 4) - 2;
    buildPineTree(B, -50.0, 0, jz, { h, inkBark: BK, inkLeaves: GR });
  }
  // East conifer perimeter (X ≈ 50)
  for (let z = -40; z <= 40; z += 12) {
    const h = coniferHeights[cIdx++ % coniferHeights.length];
    const jz = z + ((cIdx * 11) % 4) - 2;
    buildPineTree(B, 50.0, 0, jz, { h, inkBark: BK, inkLeaves: GR });
  }

  // ==================== 3. SECTOR 1 (NORTH-WEST): DENSE BAMBOO PLANTATION ====================
  // Autonomous procedural bamboo grove: 26 Poisson-spaced culms with segmented node rings & leaf fronds
  buildBambooPlantation(B, -28.0, 0, -26.0, {
    count: 26,
    radius: 12.0,
    seed: 42,
    inkCulm: GR,
    inkRings: BK
  });

  // Hanging bamboo paper lanterns & aerial grapple anchors across grove (File 02 Kit 8)
  buildBambooLantern(B, -32.0, -30.0, -28.0, -26.0, 8.8);
  buildBambooLantern(B, -28.0, -26.0, -24.0, -22.0, 9.0);
  buildBambooLantern(B, -30.0, -20.0, -25.0, -25.0, 8.6);

  // Transition Belt: Fallen bamboo culm linking NW Grove and North Conifers (File 03 Kit 3)
  cyl(-18.0, 0.15, -34.0, 0.18, 7.0, { axis: 'x', ink: GR, noCollide: true });
  box(-18.0, 0.15, -34.0, 0.35, 0.08, 0.35, { ink: BK, noCollide: true });

  // ==================== 4. SECTOR 2 (NORTH-EAST): ANCIENT PINE GROVE & AMBUSH STUMPS ====================
  // Monumental Alpine Conifers with conical needle skirts and aerial apex perches
  buildPineTree(B, 32.0, 0, -30.0, { h: 25.0, inkBark: BK, inkLeaves: GR });
  buildPineTree(B, 42.0, 0, -22.0, { h: 20.0, inkBark: BK, inkLeaves: GR });
  buildHollowStump(B, 30.0, 0, -22.0); // 360-degree waist defilade
  buildBoulderField(B, 24.0, 0, -26.0, { count: 5, radius: 6.0, seed: 99, ink: BK });

  // ==================== 5. SECTOR 3 (SOUTH-WEST): LEVIATHAN SKELETAL SPINE SPRINT TUNNEL ====================
  // 3D curved vertebral spline + 8 bilateral curved rib arches forming a 3.2m wide bullet defilade tunnel
  buildCreatureSkeleton(B, -24.0, 0, 8.0, {
    length: 24.0,
    ribSpan: 7.0,
    height: 4.8,
    count: 8,
    seed: 101,
    inkBone: OR,
    inkJoint: BK
  });

  // ==================== 6. SECTOR 4 (SOUTH-EAST): LUMBERJACK GLADE & CAMPFIRE HEARTH ====================
  // Cordwood fuel stacks, woodcutter cart, trail signage, and campfire
  buildCampfire(B, 22.0, 0, 26.0);
  buildWoodStack(B, 16.0, 0, 22.0);
  buildWoodStack(B, 28.0, 0, 24.0);
  buildLoggingCart(B, 26.0, 0, 32.0);
  buildTrailSign(B, 18.0, 0, 18.0);

  // Animated Campfire Embers in Lumberjack Glade (Finding 13: Shared material)
  if (scene && L.animated) {
    const emberCount = 6;
    const emberMeshes = [];
    const emberGroup = new THREE.Group();
    emberGroup.position.set(22.0, 0.4, 26.0);
    const emberMat = makeInkMaterial({ ink: OR });

    for (let i = 0; i < emberCount; i++) {
      const eg = new THREE.BoxGeometry(0.12, 0.12, 0.12);
      const em = new THREE.Mesh(eg, emberMat);
      if (em) {
        emberGroup.add(em);
        emberMeshes.push({ mesh: em, phase: i * 1.1, speed: 1.3 + (i % 3) * 0.4, radius: 0.35 + (i % 2) * 0.25 });
        L.meshes.push(em);
      }
    }
    scene.add(emberGroup);

    L.animated.push({
      mesh: emberGroup,
      update: (t) => {
        for (const e of emberMeshes) {
          const cycle = (t * e.speed + e.phase) % 2.4;
          const progress = cycle / 2.4;
          const angle = t * 2.2 + e.phase;
          e.mesh.position.set(
            Math.cos(angle) * e.radius * (1.0 + progress * 0.4),
            progress * 2.4,
            Math.sin(angle) * e.radius * (1.0 + progress * 0.4)
          );
          const scale = progress < 0.2 ? progress / 0.2 : (1.0 - progress);
          e.mesh.scale.setScalar(Math.max(0.01, scale));
        }
      }
    });

    // Animated Campfire Smoke Puffs (File 05 Actor 1)
    const smokeCount = 3;
    const smokeMeshes = [];
    const smokeGroup = new THREE.Group();
    smokeGroup.position.set(22.0, 0.7, 26.0);
    const smokeMat = makeInkMaterial({ ink: BK });

    for (let i = 0; i < smokeCount; i++) {
      const sg = new THREE.BoxGeometry(0.24, 0.24, 0.24);
      const sm = new THREE.Mesh(sg, smokeMat);
      if (sm) {
        smokeGroup.add(sm);
        smokeMeshes.push({ mesh: sm, phase: i * 1.1 });
        L.meshes.push(sm);
      }
    }
    scene.add(smokeGroup);

    L.animated.push({
      mesh: smokeGroup,
      update: (t) => {
        for (const s of smokeMeshes) {
          const cycle = (t * 0.45 + s.phase) % 3.0;
          const prog = cycle / 3.0;
          s.mesh.position.set(
            Math.sin(t * 1.4 + s.phase) * 0.4,
            prog * 3.2,
            Math.cos(t * 1.1 + s.phase) * 0.35
          );
          const sc = 0.5 + prog * 1.6;
          s.mesh.scale.setScalar(sc);
          s.mesh.visible = prog < 0.92;
        }
      }
    });
  }

  // ==================== 7. SECTOR 5 (EAST FLANK): SUNKEN MOUNTAIN STREAM & LEAPING FISH ====================
  // Sunken blue river channel (water surface lowered with raised rocky granite banks)
  // Reach 1: North reach (Z = -48 to -16)
  slab(17.0, -48.0, 26.0, -16.0, 0.04, 0.04, { ink: BL, noCollide: true });
  // Reach 2: Mid reach (Z = -16 to 16)
  slab(16.0, -16.0, 25.0, 16.0, 0.04, 0.04, { ink: BL, noCollide: true });
  // Reach 3: South reach (Z = 16 to 48)
  slab(17.0, 16.0, 26.0, 48.0, 0.04, 0.04, { ink: BL, noCollide: true });

  // Raised granite boulders and riverbanks lining both sides (Finding 12: solid overlapping line, zero gaps)
  for (let rz = -46; rz <= 46; rz += 6.0) {
    const xJitterW = ((Math.abs(rz * 7) % 5) - 2) * 0.15;
    const xJitterE = ((Math.abs(rz * 11) % 5) - 2) * 0.15;
    // West riverbank (X ≈ 15.2)
    const wbH = 0.45 + ((Math.abs(rz) * 3) % 0.3);
    box(15.2 + xJitterW, 0, rz, 2.0, wbH, 7.2, { ink: BK, noNav: true });
    // East riverbank (X ≈ 26.8)
    const ebH = 0.45 + ((Math.abs(rz) * 5) % 0.3);
    box(26.8 + xJitterE, 0, rz, 2.0, ebH, 7.2, { ink: BK, noNav: true });
  }

  // Stepping stones across the river at Z ≈ 0
  cyl(17.5, 0, 0.0, 0.85, 0.38, { ink: BK });
  cyl(19.5, 0, -1.0, 0.80, 0.40, { ink: BK });
  cyl(21.5, 0, 1.0, 0.90, 0.38, { ink: BK });
  cyl(23.5, 0, 0.0, 0.85, 0.40, { ink: BK });

  // Concentric water ripple rings around stepping stones and fish leaping spot (File 02 Kit 6)
  buildWaterRipples(B, 19.5, -1.0, 1.4);
  buildWaterRipples(B, 21.5, 1.0, 1.5);
  buildWaterRipples(B, 21.0, -4.0, 2.0); // Leaping trout splash zone

  // Secondary stepping stones at Z ≈ 24
  cyl(18.0, 0, 24.0, 0.85, 0.38, { ink: BK });
  cyl(20.5, 0, 25.0, 0.90, 0.40, { ink: BK });
  cyl(23.0, 0, 23.5, 0.85, 0.38, { ink: BK });

  // Elevated Tier-1 Timber Footbridge spanning river at upstream reach (Z ≈ 24, Apex Y = 3.6m, File 04 Rule 2c)
  slab(15.0, 22.5, 18.2, 25.5, 2.2, 0.35, { ink: OR });
  slab(18.2, 22.5, 23.8, 25.5, 3.6, 0.35, { ink: OR });
  slab(23.8, 22.5, 27.0, 25.5, 2.2, 0.35, { ink: OR });
  rail(15.0, 22.5, 27.0, 22.5, 3.6, { ink: BK });
  rail(15.0, 25.5, 27.0, 25.5, 3.6, { ink: BK });

  // Rustic Timber Arched Footbridge at Z = -16
  slab(14.5, -18.0, 27.5, -14.0, 0.85, 0.35, { ink: OR });
  rail(14.5, -18.0, 27.5, -18.0, 0.85, { ink: BK });
  rail(14.5, -14.0, 27.5, -14.0, 0.85, { ink: BK });

  // Animated Leaping Biro Fish in the river stream
  if (scene && L.animated) {
    const fishGroup = new THREE.Group();
    fishGroup.position.set(21.0, -2.0, -4.0);

    const bodyGeo = new THREE.ConeGeometry(0.35, 1.6, 7);
    bodyGeo.rotateX(Math.PI / 2);
    const bodyMesh = new THREE.Mesh(bodyGeo, makeInkMaterial({ ink: BL }));
    if (bodyMesh) fishGroup.add(bodyMesh);

    const tailGeo = new THREE.BoxGeometry(0.04, 0.6, 0.45);
    tailGeo.translate(0, 0, 0.85);
    const tailMesh = new THREE.Mesh(tailGeo, makeInkMaterial({ ink: OR }));
    if (tailMesh) fishGroup.add(tailMesh);

    const finGeo = new THREE.BoxGeometry(0.04, 0.35, 0.5);
    finGeo.translate(0, 0.3, 0);
    const finMesh = new THREE.Mesh(finGeo, makeInkMaterial({ ink: OR }));
    if (finMesh) fishGroup.add(finMesh);

    scene.add(fishGroup);
    if (bodyMesh) L.meshes.push(bodyMesh);
    if (tailMesh) L.meshes.push(tailMesh);
    if (finMesh) L.meshes.push(finMesh);

    L.animated.push({
      mesh: fishGroup,
      update: (t) => {
        const cycle = (t * 0.9) % (Math.PI * 2);
        if (cycle < Math.PI) {
          const arc = Math.sin(cycle);
          const leapZ = -9.0 + (cycle / Math.PI) * 10.0;
          const leapY = -0.3 + arc * 3.4;
          fishGroup.position.set(21.0, leapY, leapZ);
          fishGroup.rotation.x = -Math.cos(cycle) * 0.85;
          fishGroup.rotation.y = Math.sin(t * 12.0) * 0.15;
          fishGroup.visible = true;
        } else {
          fishGroup.visible = false;
          fishGroup.position.set(21.0, -5.0, -4.0);
        }
      }
    });

    // Second Animated Leaping Biro Trout on South Reach (File 05 Actor 5)
    const fish2Group = new THREE.Group();
    fish2Group.position.set(20.5, -2.0, 26.0);

    const bGeo = new THREE.ConeGeometry(0.28, 1.3, 6);
    bGeo.rotateX(Math.PI / 2);
    const bMesh = new THREE.Mesh(bGeo, makeInkMaterial({ ink: BL }));
    if (bMesh) fish2Group.add(bMesh);

    const tGeo = new THREE.BoxGeometry(0.04, 0.45, 0.35);
    tGeo.translate(0, 0, 0.7);
    const tMesh = new THREE.Mesh(tGeo, makeInkMaterial({ ink: OR }));
    if (tMesh) fish2Group.add(tMesh);

    scene.add(fish2Group);
    if (bMesh) L.meshes.push(bMesh);
    if (tMesh) L.meshes.push(tMesh);

    L.animated.push({
      mesh: fish2Group,
      update: (t) => {
        const cycle = (t * 0.85 + Math.PI * 0.7) % (Math.PI * 2);
        if (cycle < Math.PI) {
          const arc = Math.sin(cycle);
          const leapZ = 22.0 + (cycle / Math.PI) * 9.0;
          const leapY = -0.3 + arc * 2.8;
          fish2Group.position.set(20.5, leapY, leapZ);
          fish2Group.rotation.x = -Math.cos(cycle) * 0.82;
          fish2Group.rotation.y = Math.sin(t * 11.0) * 0.15;
          fish2Group.visible = true;
        } else {
          fish2Group.visible = false;
          fish2Group.position.set(20.5, -5.0, 26.0);
        }
      }
    });

    // Atmospheric Circling Biro Canopy Birds (File 05 Actor 7)
    const birdGroup = new THREE.Group();
    const birdCount = 4;
    const birdMeshes = [];
    const birdMat = makeInkMaterial({ ink: BK });

    for (let b = 0; b < birdCount; b++) {
      const bRoot = new THREE.Group();
      const w1 = new THREE.BoxGeometry(0.6, 0.03, 0.15);
      w1.rotateY(0.45);
      w1.translate(-0.25, 0, 0);
      const w2 = new THREE.BoxGeometry(0.6, 0.03, 0.15);
      w2.rotateY(-0.45);
      w2.translate(0.25, 0, 0);

      const m1 = new THREE.Mesh(w1, birdMat);
      const m2 = new THREE.Mesh(w2, birdMat);
      bRoot.add(m1);
      bRoot.add(m2);
      birdGroup.add(bRoot);
      birdMeshes.push({ root: bRoot, offsetAngle: b * (Math.PI * 0.5), r: 36.0 + (b % 2) * 6.0, yBase: 26.5 + (b % 3) * 1.5 });
      L.meshes.push(m1);
      L.meshes.push(m2);
    }
    scene.add(birdGroup);

    L.animated.push({
      mesh: birdGroup,
      update: (t) => {
        for (const b of birdMeshes) {
          const ang = t * 0.12 + b.offsetAngle;
          const bx = Math.cos(ang) * b.r;
          const bz = Math.sin(ang) * b.r;
          const by = b.yBase + Math.sin(t * 1.5 + b.offsetAngle) * 0.8;
          b.root.position.set(bx, by, bz);
          b.root.rotation.y = -ang + Math.PI / 2;
          b.root.rotation.z = Math.sin(t * 3.0 + b.offsetAngle) * 0.15;
        }
      }
    });
  }

  // ==================== 8. SECTOR 6 (HERO CENTERPIECE): 28M TITAN TREEHOUSE ====================
  // 28m Redwood Trunk with 34 spiral steps hugging the trunk up to Y = 9.5m.
  // The annular platform features an 80-degree calculated open stairwell hatch: ZERO ceiling bonking!
  buildTreehouse(B, 0, 0, 0, {
    trunkR: 3.2,
    height: 28.0,
    deckY: 9.5,
    inkBark: BK,
    inkWood: OR,
    inkLeaves: GR
  });

  // Titan Redwood root flares radiating from base (File 02 Kit 2)
  wedge(4.4, 0, 0, 2.6, 2.4, 1.6, { dir: '+x', ink: BK });
  wedge(-4.4, 0, 0, 2.6, 2.4, 1.6, { dir: '-x', ink: BK });
  wedge(0, 0, 4.4, 1.6, 2.4, 2.6, { dir: '+z', ink: BK });
  wedge(0, 0, -4.4, 1.6, 2.4, 2.6, { dir: '-z', ink: BK });

  // Titan Redwood bark crosshatch bands (2m surface read)
  for (let b = 0; b < 10; b++) {
    const bY = 1.0 + b * 0.8;
    const bAngle = (b * 0.65) % (Math.PI * 2);
    const bR = 3.25;
    const bx = Math.cos(bAngle) * bR;
    const bz = Math.sin(bAngle) * bR;
    box(bx, bY, bz, 0.45, 0.14, 0.45, { ink: BK, noCollide: true });
  }

  // Blob shadows under major landmarks (File 02 Kit 4)
  buildBlobShadow(B, 0, 0, 4.5, 4.5); // Titan Redwood base shadow
  buildBlobShadow(B, 22.0, 26.0, 3.2, 3.2); // Campfire & fuel stacks shadow
  buildBlobShadow(B, -24.0, 8.0, 4.0, 10.0); // Leviathan spine shadow
  buildBlobShadow(B, 32.0, -30.0, 3.5, 3.5); // NE Ancient pine shadow
  buildBlobShadow(B, -34.0, 32.0, 3.8, 3.8); // SW Gnarled tree shadow
  buildBlobShadow(B, 34.0, 32.0, 3.5, 3.5); // SE Banyan shadow

  // Ground litter scatter around landmark tree & boulder bases (File 02 Kit 1)
  buildLeafLitter(B, 32.0, -30.0, 6, 2.5);
  buildLeafLitter(B, 42.0, -22.0, 5, 2.0);
  buildLeafLitter(B, -34.0, 32.0, 6, 2.5);
  buildLeafLitter(B, 34.0, 32.0, 6, 2.5);
  buildLeafLitter(B, 24.0, -2.0, 6, 2.2);
  buildLeafLitter(B, -24.0, 20.0, 5, 2.0);
  buildLeafLitter(B, 22.0, 26.0, 6, 2.8);

  // Transition Belt: Bone shards linking SW Skeleton to Lumberjack Glade (File 03 Kit 3)
  wedge(-8.0, 0, 16.0, 0.6, 0.85, 0.6, { dir: '+x', ink: OR, noCollide: true });
  wedge(-4.0, 0, 18.0, 0.4, 0.65, 0.5, { dir: '+z', ink: OR, noCollide: true });

  // Fallen Leviathan Vertebra mantle steps at tunnel exit (File 04 Rule 2d)
  cyl(-24.0, 0, -5.0, 1.5, 1.1, { ink: OR, tag: 'cover' });
  cyl(-24.0, 1.1, -3.2, 1.2, 1.1, { ink: OR, tag: 'cover' });

  // Tier-1 Natural Boulder Shelves in NE & SW sectors (File 04 Rule 2a)
  box(16.0, 0, -28.0, 2.8, 1.6, 2.8, { ink: BK });
  box(17.0, 1.6, -27.5, 2.2, 1.6, 2.2, { ink: BK });
  box(-16.0, 0, 24.0, 2.8, 1.6, 2.8, { ink: BK });
  box(-15.0, 1.6, 24.5, 2.2, 1.6, 2.2, { ink: BK });

  // Mid-Canopy Titan Redwood Boughs (File 04 Rule 3: 5m - 7m organic combat layer)
  // East Branch Bough at Y = 5.2m
  cyl(6.2, 5.0, 0, 0.45, 6.4, { axis: 'x', ink: BK });
  slab(4.0, -1.3, 9.0, 1.3, 5.2, 0.35, { ink: GR });
  rail(4.0, -1.3, 9.0, -1.3, 5.2, { ink: BK });
  rail(4.0, 1.3, 9.0, 1.3, 5.2, { ink: BK });
  ring(9.4, 5.8, 0, 'z'); // Bough grapple anchor

  // West Branch Bough at Y = 6.6m
  cyl(-6.2, 6.4, 0, 0.42, 6.4, { axis: 'x', ink: BK });
  slab(-9.0, -1.3, -4.0, 1.3, 6.6, 0.35, { ink: GR });
  rail(-9.0, -1.3, -4.0, -1.3, 6.6, { ink: BK });
  rail(-9.0, 1.3, -4.0, 1.3, 6.6, { ink: BK });
  ring(-9.4, 7.2, 0, 'z'); // Bough grapple anchor

  // ==================== 9. SECTOR 7: SUSPENDED ROPE BRIDGES & TERRACED ROCK RIDGES ====================
  // Suspended Timber Rope Bridges with catenary sag, wood planks, and round rope handrails!
  // North Skybridge: Center (0, 9.5, -5) -> North Bastion (0, 9.5, -26)
  buildSuspendedRopeBridge(B, 0, -5.0, 0, -26.0, 9.5, {
    maxSag: 0.42,
    width: 1.8,
    inkPlank: OR,
    inkRope: BK
  });

  // South Skybridge: Center (0, 9.5, 5) -> South Outpost (0, 9.5, 26)
  buildSuspendedRopeBridge(B, 0, 5.0, 0, 26.0, 9.5, {
    maxSag: 0.42,
    width: 1.8,
    inkPlank: OR,
    inkRope: BK
  });

  // West Skybridge: Center (-5, 9.5, 0) -> West Tree Perch (-24, 9.5, 0)
  buildSuspendedRopeBridge(B, -5.0, 0, -24.0, 0, 9.5, {
    maxSag: 0.42,
    width: 1.8,
    inkPlank: OR,
    inkRope: BK
  });

  // East Skybridge: Center (5, 9.5, 0) -> East Watchtower (24, 9.5, 0)
  buildSuspendedRopeBridge(B, 5.0, 0, 24.0, 0, 9.5, {
    maxSag: 0.42,
    width: 1.8,
    inkPlank: OR,
    inkRope: BK
  });

  // Hanging moss strands under skybridges (File 02 Kit 3: selling age and weight)
  box(0, 8.4, -15.5, 0.04, 0.95, 0.04, { ink: GR, noCollide: true });
  box(0, 8.3, -16.2, 0.04, 0.75, 0.04, { ink: GR, noCollide: true });
  box(0, 8.4, 15.5, 0.04, 0.95, 0.04, { ink: GR, noCollide: true });
  box(0, 8.3, 16.2, 0.04, 0.75, 0.04, { ink: GR, noCollide: true });
  box(-14.5, 8.4, 0, 0.04, 0.95, 0.04, { ink: GR, noCollide: true });
  box(14.5, 8.4, 0, 0.04, 0.95, 0.04, { ink: GR, noCollide: true });

  // Skybridge Overlook Bastion Decks (Y = 9.5m)
  slab(-6.0, -32.0, 6.0, -26.0, 9.5, 0.4, { ink: OR });
  rail(-6.0, -32.0, 6.0, -32.0, 9.5, { ink: BK });
  rail(-6.0, -32.0, -6.0, -26.0, 9.5, { ink: BK });
  rail(6.0, -32.0, 6.0, -26.0, 9.5, { ink: BK });

  slab(-6.0, 26.0, 6.0, 32.0, 9.5, 0.4, { ink: OR });
  rail(-6.0, 32.0, 6.0, 32.0, 9.5, { ink: BK });
  rail(-6.0, 26.0, -6.0, 32.0, 9.5, { ink: BK });
  rail(6.0, 26.0, 6.0, 32.0, 9.5, { ink: BK });

  slab(-30.0, -6.0, -24.0, 6.0, 9.5, 0.4, { ink: OR });
  rail(-30.0, -6.0, -30.0, 6.0, 9.5, { ink: BK });
  rail(-30.0, -6.0, -24.0, -6.0, 9.5, { ink: BK });
  rail(-30.0, 6.0, -24.0, 6.0, 9.5, { ink: BK });

  slab(24.0, -6.0, 30.0, 6.0, 9.5, 0.4, { ink: OR });
  rail(30.0, -6.0, 30.0, 6.0, 9.5, { ink: BK });
  rail(24.0, -6.0, 30.0, -6.0, 9.5, { ink: BK });
  rail(24.0, 6.0, 30.0, 6.0, 9.5, { ink: BK });

  // NATURAL TERRACED ROCK RIDGES (Zero urban stairs! Natural mantleable rock shelves)
  // NATURAL TERRACED ROCK RIDGES (Zero urban stairs! Natural mantleable rock shelves)
  // Shifted 3.5m off bridge centerline so they meet bastion decks side-by-side with zero mid-bridge clipping! (Findings 3 & 4)
  // North Ridge climbs towards North Bastion (dir: '+z')
  buildTerracedRidge(B, 3.5, 0, -46.0, {
    width: 5.5,
    totalHeight: 9.2,
    tiers: 6,
    stepDepth: 1.8,
    dir: '+z',
    inkRock: BK,
    inkTrim: GR
  });

  // South Ridge climbs towards South Outpost (dir: '-z')
  buildTerracedRidge(B, -3.5, 0, 46.0, {
    width: 5.5,
    totalHeight: 9.2,
    tiers: 6,
    stepDepth: 1.8,
    dir: '-z',
    inkRock: BK,
    inkTrim: GR
  });

  // West Ridge climbs towards West Tree Perch (dir: '+x')
  buildTerracedRidge(B, -46.0, 0, 3.5, {
    width: 5.5,
    totalHeight: 9.2,
    tiers: 6,
    stepDepth: 1.8,
    dir: '+x',
    inkRock: BK,
    inkTrim: GR
  });

  // East Ridge climbs towards East Watchtower (dir: '-x')
  buildTerracedRidge(B, 46.0, 0, -3.5, {
    width: 5.5,
    totalHeight: 9.2,
    tiers: 6,
    stepDepth: 1.8,
    dir: '-x',
    inkRock: BK,
    inkTrim: GR
  });

  // ==================== 10. CURVED HOLLOW SPRINT LOGS & ANCIENT FLANKING TREES ====================
  // Multi-segment curved sprint tube with 2.2m clear interior corridor
  buildCurvedHollowLog(B, -20.0, 0, -18.0, {
    segments: 3,
    segLen: 8.0,
    rInner: 1.6,
    rOuter: 2.1,
    initialAngle: Math.PI * 0.45,
    seed: 777,
    inkBark: BK,
    inkFoliage: GR,
    inkCover: OR
  });

  // Second straight hollow log on South Flank
  buildHollowLog(B, -15.0, 0, 22.0, 12.0);

  // Interior landmark conifers
  buildPineTree(B, -40.0, 0, -16.0, { h: 22.0, inkBark: BK, inkLeaves: GR });
  buildPineTree(B, 40.0, 0, 16.0, { h: 22.0, inkBark: BK, inkLeaves: GR });
  buildPineTree(B, -16.0, 0, -40.0, { h: 22.0, inkBark: BK, inkLeaves: GR });
  buildPineTree(B, 16.0, 0, 40.0, { h: 22.0, inkBark: BK, inkLeaves: GR });

  // SW Gnarled Redwood with natural niche
  generateParametricTree(B, -34.0, 0, 32.0, {
    archetype: 'gnarled',
    height: 22.0,
    trunkR: 2.6,
    seed: 305,
    inkBark: BK,
    inkLeaves: GR,
    inkCover: OR
  });

  // SE Ancient Banyan Spire
  buildAncientTree(B, 34.0, 0, 32.0, { r: 2.2, h: 20.0, inkBark: BK, inkLeaves: GR });

  // ==================== 11. GIANT STALK GRASSES WITH MOMENTUM GRAPPLE RINGS ====================
  buildGiantGrass(B, -12.0, 0, -16.0, { height: 7.2, ink: GR, inkStem: BK });
  buildGiantGrass(B, 12.0, 0, -16.0, { height: 7.0, ink: GR, inkStem: BK });
  buildGiantGrass(B, -12.0, 0, 16.0, { height: 7.5, ink: GR, inkStem: BK });
  buildGiantGrass(B, 12.0, 0, 16.0, { height: 7.2, ink: GR, inkStem: BK });
  buildGiantGrass(B, -36.0, 0, 14.0, { height: 8.2, ink: GR, inkStem: BK });
  buildGiantGrass(B, 28.0, 0, -12.0, { height: 6.8, ink: GR, inkStem: BK });
  buildGiantGrass(B, 0.0, 0, -22.0, { height: 8.0, ink: GR, inkStem: BK });
  buildGiantGrass(B, 0.0, 0, 22.0, { height: 8.0, ink: GR, inkStem: BK });

  // Granite boulder field cover
  buildBoulderField(B, 24.0, 0, -2.0, { count: 6, radius: 7.0, seed: 88, ink: BK });
  buildBoulderField(B, -24.0, 0, 20.0, { count: 5, radius: 6.0, seed: 142, ink: BK });

  // Fly Agaric toadstool waist cover clusters
  buildToadstoolCluster(B, -16.0, 0, -8.0, 4);
  buildToadstoolCluster(B, 16.0, 0, 8.0, 4);
  buildToadstoolCluster(B, -8.0, 0, 24.0, 3);

  // Ambush stumps
  buildHollowStump(B, -8.0, 0, -24.0);
  buildHollowStump(B, 8.0, 0, 24.0);

  // Cordwood fuel stacks
  buildWoodStack(B, -22.0, 0, -4.0);
  buildWoodStack(B, 22.0, 0, 4.0);

  // ==================== 12. SPAWNS, PICKUPS & COMBAT NAVIGATION ====================
  spawn(0, 0.2, D - 5);
  spawn(0, 0.2, -D + 5);
  spawn(-D + 5, 0.2, 0);
  spawn(D - 5, 0.2, 0);

  // Snipers stationed on elevated tree decks
  sniper(0, 10.0, -29.0);
  sniper(0, 10.0, 29.0);
  sniper(-27.0, 10.0, 0);
  sniper(27.0, 10.0, 0);

  // High-value pickups (note: Leviathan ribcage and Bamboo clearing pickups are placed inside their prefab cores)
  pickup(0, 10.0, -29.0);       // On elevated North Bastion overlook (Finding 14: de-duplicated from cabin)
  pickup(0, 0.3, 0);            // Base of titan trunk
  pickup(20.0, 1.2, -16.0);     // On river footbridge
  pickup(-20.0, 4.0, -18.0);    // On curved hollow log roof
  pickup(34.0, 12.0, 32.0);     // High in SE Banyan spire

  // High Canopy Aerial Grapple Highway (allows rapid gliding and zapping across the map)
  ring(0, 31.0, 0, 'y');        // Apex Treehouse swing (above 28m crown)
  ring(0, 16.0, -18.0, 'z');    // North airway
  ring(0, 16.0, 18.0, 'z');     // South airway
  ring(-18.0, 16.0, 0, 'x');    // West airway
  ring(18.0, 16.0, 0, 'x');     // East airway
  ring(-25.0, 18.0, -25.0, 'y');
  ring(25.0, 18.0, -25.0, 'y');
  ring(-25.0, 18.0, 25.0, 'y');
  ring(25.0, 18.0, 25.0, 'y');

  // Solid ground foundation collider
  collider(0, -2, 0, 2 * P + 20, 2, 2 * P + 20);
  L.playerStart.set(0, 0.2, D - 5);

  // ==================== 13. NOTEBOOK MARGIN DOODLES (File 06 Easter Egg) ====================
  // Faint ballpoint pen scribbles drawn outside the play envelope on the notebook paper
  // Spiral doodle outside NW boundary
  for (let s = 0; s < 8; s++) {
    const ang = s * 0.8;
    const rad = 2.0 + s * 0.7;
    box(-72.0 + Math.cos(ang) * rad, 18.0 + Math.sin(ang) * rad, -32.0, 0.6, 0.04, 0.04, { ink: BL, noCollide: true });
  }
  // "CANOPY // 03" scrawl lines outside SE boundary
  box(72.0, 22.0, 28.0, 6.0, 0.1, 0.1, { ink: BL, noCollide: true });
  box(72.0, 20.8, 28.0, 4.5, 0.1, 0.1, { ink: BL, noCollide: true });
  box(72.0, 19.6, 28.0, 5.2, 0.1, 0.1, { ink: BL, noCollide: true });

  B.finish();
  return L;
}
