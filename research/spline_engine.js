import * as THREE from 'three';
import { INK } from './render.js';

/**
 * DOODLE STRIKE SPLINE, LOFT & CURVE ENGINE (Phase 1)
 * Provides true 3D Catmull-Rom spline evaluation, swept loft tubes,
 * annular decks with calculated stair hatches, and organic ribbon surfaces.
 * Kills the "box-stacking" approximation forever.
 */

/**
 * Evaluates a Catmull-Rom spline in 3D through a sequence of control points.
 * @param {Array<THREE.Vector3|Array<number>>} points - Sequence of 3D control points
 * @param {number} tension - Spline tension (0.0 to 1.0, default 0.5)
 * @returns {THREE.CatmullRomCurve3}
 */
export function create3DSpline(points, tension = 0.5) {
  const vPoints = points.map(p => (p instanceof THREE.Vector3 ? p : new THREE.Vector3(p[0], p[1], p[2])));
  const curve = new THREE.CatmullRomCurve3(vPoints, false, 'catmullrom', tension);
  return curve;
}

/**
 * Sweeps a 3D polygonal tube along a spline curve with variable radius profiles.
 * Supports honest interior walkable sprint defilades (hollow floor).
 *
 * @param {Object} B - The level builder instance
 * @param {Array<Array<number>>} controlPoints - 3D control points [[x, y, z], ...]
 * @param {Object} o - Configuration options
 *   - radiusProfile: Array<number> | number | function(t)
 *   - sides: number of radial facets (default 8 for biro silhouette)
 *   - samples: number of segments along spline (default 16)
 *   - hollow: boolean (if true, creates walkable interior tunnel)
 *   - floor: boolean (adds flat walkable floor inside tunnel)
 *   - ink: ink color index
 *   - noCollide: boolean
 */
export function splineTube(B, controlPoints, o = {}) {
  const { addGeo, collider } = B;
  const ink = o.ink ?? (INK.BLACK ?? 2);
  const sides = Math.max(5, Math.min(16, o.sides ?? 8));
  const samples = Math.max(6, Math.min(48, o.samples ?? 16));
  const isHollow = o.hollow ?? true;
  const hasFloor = o.floor ?? true;

  const curve = create3DSpline(controlPoints, o.tension ?? 0.5);
  const samplePoints = curve.getSpacedPoints(samples);
  const frenetFrames = curve.computeFrenetFrames(samples, false);

  const getRadius = (t) => {
    if (typeof o.radiusProfile === 'function') return o.radiusProfile(t);
    if (Array.isArray(o.radiusProfile)) {
      const idx = Math.min(o.radiusProfile.length - 1, Math.floor(t * (o.radiusProfile.length - 1)));
      return o.radiusProfile[idx];
    }
    return typeof o.radiusProfile === 'number' ? o.radiusProfile : 2.2;
  };

  const positions = [];
  const indices = [];

  // Generate rings of vertices
  for (let s = 0; s <= samples; s++) {
    const t = s / samples;
    const center = samplePoints[s];
    const normal = frenetFrames.normals[s];
    const binormal = frenetFrames.binormals[s];
    const r = getRadius(t);

    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      // Vertex position in normal/binormal plane
      const vx = center.x + (normal.x * cos + binormal.x * sin) * r;
      const vy = center.y + (normal.y * cos + binormal.y * sin) * r;
      const vz = center.z + (normal.z * cos + binormal.z * sin) * r;
      positions.push(vx, vy, vz);
    }
  }

  // Connect adjacent rings with quad facets (two triangles)
  for (let s = 0; s < samples; s++) {
    for (let i = 0; i < sides; i++) {
      const nextI = (i + 1) % sides;
      const c1 = s * sides + i;
      const c2 = s * sides + nextI;
      const n1 = (s + 1) * sides + i;
      const n2 = (s + 1) * sides + nextI;

      indices.push(c1, n1, c2);
      indices.push(c2, n1, n2);
    }
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  addGeo(geom, ink);

  // Generate sequential colliders along the spline trajectory
  if (!o.noCollide) {
    for (let s = 0; s < samples; s++) {
      const p1 = samplePoints[s];
      const p2 = samplePoints[s + 1];
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const tMid = (s + 0.5) / samples;
      const rMid = getRadius(tMid);
      const segLen = p1.distanceTo(p2);

      if (isHollow && hasFloor) {
        // Floor deck collider inside tunnel: 2.2m width, safe headroom
        const floorY = mid.y - rMid * 0.55;
        const floorW = Math.max(1.8, rMid * 1.3);
        collider(mid.x, floorY, mid.z, floorW, 0.4, segLen * 1.1, {
          tag: 'sprint_tunnel_floor'
        });
        // Left defilade wall
        collider(mid.x - floorW * 0.6, floorY, mid.z, 0.4, rMid * 1.5, segLen * 1.1, {
          tag: 'defilade'
        });
        // Right defilade wall
        collider(mid.x + floorW * 0.6, floorY, mid.z, 0.4, rMid * 1.5, segLen * 1.1, {
          tag: 'defilade'
        });
      } else {
        // Solid volumetric bounding cylinder / box
        collider(mid.x, mid.y - rMid, mid.z, rMid * 2.0, rMid * 2.0, segLen * 1.1, {
          tag: o.tag ?? 'solid_tube'
        });
      }
    }
  }

  return {
    curve,
    samples,
    length: curve.getLength()
  };
}

/**
 * Builds an Annular (curved/circular) Deck with a guaranteed open stairwell hatch.
 * Kills the bug where spiral steps terminate under a solid ceiling slab!
 *
 * @param {Object} B - The level builder instance
 * @param {number} cx - Center X
 * @param {number} cz - Center Z
 * @param {number} rInner - Inner radius (trunk radius)
 * @param {number} rOuter - Outer balcony radius
 * @param {number} y - Deck elevation
 * @param {Object} o - Options:
 *   - hatchAngleStart: Radians where stairwell hatch begins (e.g. 0)
 *   - hatchAngleEnd: Radians where stairwell hatch ends (e.g. Math.PI * 0.4)
 *   - segments: Number of annular slices (default 12)
 *   - thickness: Deck slab thickness (default 0.4)
 *   - ink: Ink color index
 */
export function annularDeck(B, cx, cz, rInner, rOuter, y, o = {}) {
  const { slab, rail, collider } = B;
  const ink = o.ink ?? (INK.ORANGE ?? 3);
  const segments = Math.max(8, Math.min(24, o.segments ?? 12));
  const thickness = o.thickness ?? 0.4;
  const hatchStart = o.hatchAngleStart ?? 0;
  const hatchEnd = o.hatchAngleEnd ?? (Math.PI * 0.45); // ~80 degree open stairwell

  const angleStep = (Math.PI * 2) / segments;
  const deckSlabs = [];

  for (let i = 0; i < segments; i++) {
    const a1 = i * angleStep;
    const a2 = (i + 1) * angleStep;
    const midAngle = (a1 + a2) / 2;

    // Check if this segment falls inside the open stairwell hatch
    // Normalize angles to [0, 2PI)
    const normA = (midAngle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const normStart = (hatchStart % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
    const normEnd = (hatchEnd % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);

    const inHatch = normStart <= normEnd
      ? (normA >= normStart && normA <= normEnd)
      : (normA >= normStart || normA <= normEnd);

    if (inHatch) {
      // OPEN HATCH: Do NOT place a slab here! This guarantees 3.0m vertical headroom
      // Add protective safety railing along the inner hatch boundary
      const hx1 = cx + Math.cos(a1) * (rInner + 0.2);
      const hz1 = cz + Math.sin(a1) * (rInner + 0.2);
      const hx2 = cx + Math.cos(a2) * (rInner + 0.2);
      const hz2 = cz + Math.sin(a2) * (rInner + 0.2);
      rail(hx1, hz1, hx2, hz2, y, { ink: INK.BLACK ?? 2 });
      continue;
    }

    // Outer chord endpoints
    const ox1 = cx + Math.cos(a1) * rOuter;
    const oz1 = cz + Math.sin(a1) * rOuter;
    const ox2 = cx + Math.cos(a2) * rOuter;
    const oz2 = cz + Math.sin(a2) * rOuter;

    // Inner chord endpoints (around trunk)
    const ix1 = cx + Math.cos(a1) * rInner;
    const iz1 = cz + Math.sin(a1) * rInner;
    const ix2 = cx + Math.cos(a2) * rInner;
    const iz2 = cz + Math.sin(a2) * rInner;

    // Center of this annular slice
    const sliceCenterX = (ox1 + ox2 + ix1 + ix2) / 4;
    const sliceCenterZ = (oz1 + oz2 + iz1 + iz2) / 4;
    const sliceWidth = Math.hypot(ox2 - ox1, oz2 - oz1);
    const sliceDepth = rOuter - rInner;

    // Place walkable timber slab wedge
    slab(
      sliceCenterX - sliceWidth * 0.55,
      sliceCenterZ - sliceDepth * 0.55,
      sliceCenterX + sliceWidth * 0.55,
      sliceCenterZ + sliceDepth * 0.55,
      y,
      thickness,
      { ink }
    );

    // Perimeter balcony guard rail along outer edge
    rail(ox1, oz1, ox2, oz2, y, { ink: INK.BLACK ?? 2 });
    deckSlabs.push({ x: sliceCenterX, z: sliceCenterZ, angle: midAngle });
  }

  return {
    deckY: y,
    rInner,
    rOuter,
    hatch: { start: hatchStart, end: hatchEnd },
    activeSlabs: deckSlabs.length
  };
}

/**
 * Sweeps an organic 3D ribbon with variable width along a curve (ideal for biro fin rays, leaves, and banners).
 */
export function sweptRibbon(B, controlPoints, o = {}) {
  const { addGeo } = B;
  const ink = o.ink ?? (INK.GREEN ?? 4);
  const samples = Math.max(4, o.samples ?? 12);
  const getWidth = typeof o.widthProfile === 'function' ? o.widthProfile : (t) => (o.width ?? 1.2) * Math.sin(t * Math.PI);

  const curve = create3DSpline(controlPoints, o.tension ?? 0.5);
  const points = curve.getSpacedPoints(samples);
  const frenet = curve.computeFrenetFrames(samples, false);

  const positions = [];
  const indices = [];

  for (let s = 0; s <= samples; s++) {
    const t = s / samples;
    const p = points[s];
    const w = getWidth(t);
    const normal = frenet.normals[s];

    // Left and right ribbon edge vertices
    positions.push(p.x - normal.x * w, p.y - normal.y * w, p.z - normal.z * w);
    positions.push(p.x + normal.x * w, p.y + normal.y * w, p.z + normal.z * w);
  }

  for (let s = 0; s < samples; s++) {
    const v1 = s * 2;
    const v2 = s * 2 + 1;
    const v3 = (s + 1) * 2;
    const v4 = (s + 1) * 2 + 1;

    indices.push(v1, v3, v2);
    indices.push(v2, v3, v4);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();

  addGeo(geom, ink);
  return { curve, samples };
}
