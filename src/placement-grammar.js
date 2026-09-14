// src/placement-grammar.js
// Spatial Placement Grammar & Rulebook for Dream Engine (File 08)
// Guarantees anti-pinch corridors, headroom, Poisson spacing, and reservation safety as executable code.

/**
 * Creates a new RuleContext for map generation.
 */
export function createRuleContext(preset = {}, rng = Math.random, recipe = {}) {
  return {
    colliders: [],
    grapples: [],
    spawns: [],
    snipers: [],
    pickups: [],
    reservations: [], // { type: 'corridor'|'water'|'ascent', x1, z1, x2, z2, width, r }
    preset: {
      corridorMin: preset.corridorMin ?? 1.8,
      stepRiseMax: preset.stepRiseMax ?? 0.28,
      headroomMin: preset.headroomMin ?? 2.4,
      grappleGap: preset.grappleGap ?? [6.0, 14.0],
      grappleClearance: preset.grappleClearance ?? 1.5,
      ...preset
    },
    rng,
    recipe,
    violations: []
  };
}

// ============================================================================
// GENERATORS (Decide WHERE geometry may legally go)
// ============================================================================

/**
 * G1 — Poisson Disk Scatter with Field Masking & Reservation Checking
 */
export function poissonScatter(field, count, minDist, rng, bounds, context = null) {
  const pts = [];
  const maxAttempts = count * 10;
  const minX = bounds.minX ?? -40;
  const maxX = bounds.maxX ?? 40;
  const minZ = bounds.minZ ?? -40;
  const maxZ = bounds.maxZ ?? 40;

  for (let i = 0; i < maxAttempts && pts.length < count; i++) {
    const x = minX + rng() * (maxX - minX);
    const z = minZ + rng() * (maxZ - minZ);

    // 1. Sector field influence mask
    if (field && typeof field === 'function' && field(x, z) < 0.15) {
      continue;
    }

    // 2. Minimum distance to other points in this scatter
    const tooClose = pts.some(p => Math.hypot(p.x - x, p.z - z) < minDist);
    if (tooClose) continue;

    // 3. Corridor & water reservation check
    if (context && !isAreaClear(context, x, z, minDist * 0.5)) {
      continue;
    }

    pts.push({ x, z });
  }

  return pts;
}

/**
 * G2 — Clustered Scatter (Nature clusters props instead of uniform distribution)
 */
export function clusterScatter(field, rng, opts = {}, context = null, bounds = {}) {
  const clusters = opts.clusters ?? 3;
  const perCluster = opts.perCluster ?? 4;
  const radius = opts.radius ?? 3.5;
  const minDist = opts.minDist ?? 8.0;

  const anchors = poissonScatter(field, clusters, minDist, rng, bounds, context);
  const results = [];

  for (const anchor of anchors) {
    results.push({ x: anchor.x, z: anchor.z, isAnchor: true });
    for (let j = 0; j < perCluster; j++) {
      const angle = rng() * Math.PI * 2;
      const dist = (0.3 + rng() * 0.7) * radius;
      const px = anchor.x + Math.cos(angle) * dist;
      const pz = anchor.z + Math.sin(angle) * dist;

      if (context && !isAreaClear(context, px, pz, 0.4)) continue;
      results.push({ x: px, z: pz, isAnchor: false });
    }
  }

  return results;
}

/**
 * G3 — Reserve Traversal Corridor
 */
export function reserveCorridor(context, x1, z1, x2, z2, width = 2.4) {
  if (!context || !context.reservations) return;
  context.reservations.push({
    type: 'corridor',
    x1, z1, x2, z2,
    width: Math.max(width, context.preset?.corridorMin ?? 1.8)
  });
}

/**
 * G3b — Reserve Water Ribbon
 */
export function reserveWater(context, ribbon) {
  if (!context || !context.reservations) return;
  context.reservations.push({
    type: 'water',
    axis: ribbon.axis || 'z',
    coord: ribbon.x ?? ribbon.z ?? 0,
    from: ribbon.from ?? -50,
    to: ribbon.to ?? 50,
    width: ribbon.width ?? 9.6
  });
}

/**
 * G3c — Reserve Ascent / Drop Column
 */
export function reserveAscent(context, x, z, toY, radius = 3.2) {
  if (!context || !context.reservations) return;
  context.reservations.push({
    type: 'ascent',
    x, z, toY, r: radius
  });
}

/**
 * Check if a location (x, z) with clear radius `r` intersects any reservations.
 */
export function isAreaClear(context, x, z, r = 1.0) {
  if (!context || !context.reservations) return true;

  for (const res of context.reservations) {
    if (res.type === 'corridor') {
      // Distance from point (x, z) to line segment (x1, z1)-(x2, z2)
      const dist = distToSegment(x, z, res.x1, res.z1, res.x2, res.z2);
      if (dist < (res.width * 0.5 + r)) return false;
    } else if (res.type === 'water') {
      if (res.axis === 'z') {
        if (z >= Math.min(res.from, res.to) - r && z <= Math.max(res.from, res.to) + r) {
          if (Math.abs(x - res.coord) < (res.width * 0.5 + r)) return false;
        }
      } else {
        if (x >= Math.min(res.from, res.to) - r && x <= Math.max(res.from, res.to) + r) {
          if (Math.abs(z - res.coord) < (res.width * 0.5 + r)) return false;
        }
      }
    } else if (res.type === 'ascent') {
      if (Math.hypot(x - res.x, z - res.z) < (res.r + r)) return false;
    }
  }

  return true;
}

/**
 * Helper: Distance from point to line segment
 */
function distToSegment(px, pz, x1, z1, x2, z2) {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const lenSq = dx * dx + dz * dz;
  if (lenSq === 0) return Math.hypot(px - x1, pz - z1);

  let t = ((px - x1) * dx + (pz - z1) * dz) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * dx;
  const projZ = z1 + t * dz;
  return Math.hypot(px - projX, pz - projZ);
}

/**
 * G4 — Grapple Chain Synthesizer
 * Synthesizes a valid chain of grapple rings between points obeying spacing & height rules.
 */
export function grappleChain(from, to, preset = {}) {
  const [x1, y1, z1] = from;
  const [x2, y2, z2] = to;
  const dist = Math.hypot(x2 - x1, z2 - z1);
  const gapBand = preset.grappleGap ?? [6.0, 14.0];
  const targetGap = (gapBand[0] + gapBand[1]) * 0.5;
  const count = Math.max(1, Math.round(dist / targetGap));
  const rings = [];

  for (let i = 1; i <= count; i++) {
    const t = i / (count + 1);
    const rx = x1 + (x2 - x1) * t;
    const rz = z1 + (z2 - z1) * t;
    // Catenary or parabolic arch curve for mid-air apex
    const sag = Math.sin(t * Math.PI) * 1.5;
    const ry = y1 + (y2 - y1) * t + sag;
    rings.push({ x: rx, y: ry, z: rz, axis: 'y' });
  }

  return rings;
}

/**
 * G5 — Detail Radius Multiplier (File 02 & File 08)
 */
export function detailRadius(x, z, context = null, landmarks = []) {
  let mult = 1.0;

  // 1. Proximity to landmarks (x3 within 8m)
  for (const lm of landmarks) {
    const dist = Math.hypot(x - lm.x, z - lm.z);
    if (dist < 8.0) {
      mult = Math.max(mult, 3.0);
    }
  }

  // 2. Proximity to trails
  if (context && context.reservations) {
    for (const res of context.reservations) {
      if (res.type === 'corridor') {
        const d = distToSegment(x, z, res.x1, res.z1, res.x2, res.z2);
        if (d < 4.0) mult = Math.max(mult, 1.5);
      }
    }
  }

  return mult;
}

// ============================================================================
// VALIDATORS (Ensure placed geometry conforms to strict architectural laws)
// ============================================================================

/**
 * V1 — Anti-Pinch Corridor Sweep
 */
export function validateAntiPinch(colliders = [], corridorMin = 1.8) {
  const violations = [];
  const solids = colliders.filter(c => !c.noNav && !c.noCollide && c.h >= 0.8);

  for (let i = 0; i < solids.length; i++) {
    const a = solids[i];
    for (let j = i + 1; j < solids.length; j++) {
      const b = solids[j];
      // Check if both colliders are on similar elevation
      const yOverlap = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
      if (yOverlap <= 0.2) continue;

      // Compute horizontal distance between AABBs
      const dx = Math.max(0, Math.max(a.x - a.w * 0.5, b.x - b.w * 0.5) - Math.min(a.x + a.w * 0.5, b.x + b.w * 0.5));
      const dz = Math.max(0, Math.max(a.z - a.d * 0.5, b.z - b.d * 0.5) - Math.min(a.z + a.d * 0.5, b.z + b.d * 0.5));
      const gap = Math.hypot(dx, dz);

      if (gap > 0.05 && gap < corridorMin) {
        violations.push({
          type: 'anti-pinch',
          gap: parseFloat(gap.toFixed(2)),
          min: corridorMin,
          colliderA: a,
          colliderB: b
        });
      }
    }
  }

  return violations;
}

/**
 * V2 — Continuous Headroom Cast
 */
export function validateHeadroom(colliders = [], headroomMin = 2.4) {
  const violations = [];
  const walkables = colliders.filter(c => !c.noNav && c.w >= 0.8 && c.d >= 0.8);
  const ceilings = colliders.filter(c => !c.noCollide);

  for (const walk of walkables) {
    const topY = walk.y + walk.h;
    for (const ceil of ceilings) {
      if (ceil === walk) continue;
      // Overlap in XZ plane
      const xOverlap = Math.min(walk.x + walk.w * 0.5, ceil.x + ceil.w * 0.5) - Math.max(walk.x - walk.w * 0.5, ceil.x - ceil.w * 0.5);
      const zOverlap = Math.min(walk.z + walk.d * 0.5, ceil.z + ceil.d * 0.5) - Math.max(walk.z - walk.d * 0.5, ceil.z - ceil.d * 0.5);

      if (xOverlap > 0.4 && zOverlap > 0.4) {
        const ceilBottom = ceil.y;
        const clearance = ceilBottom - topY;
        if (clearance > 0.1 && clearance < headroomMin) {
          violations.push({
            type: 'headroom',
            clearance: parseFloat(clearance.toFixed(2)),
            min: headroomMin,
            surface: walk,
            ceiling: ceil
          });
        }
      }
    }
  }

  return violations;
}

/**
 * V3 — Grapple Clearance Validation
 */
export function validateGrappleClearance(rings = [], colliders = [], minClearance = 1.5) {
  const violations = [];
  const solids = colliders.filter(c => !c.noCollide);

  for (const ring of rings) {
    for (const c of solids) {
      // Approximate distance from ring point to box
      const cx = Math.max(c.x - c.w * 0.5, Math.min(ring.x, c.x + c.w * 0.5));
      const cy = Math.max(c.y, Math.min(ring.y, c.y + c.h));
      const cz = Math.max(c.z - c.d * 0.5, Math.min(ring.z, c.z + c.d * 0.5));
      const dist = Math.hypot(ring.x - cx, ring.y - cy, ring.z - cz);

      if (dist < minClearance) {
        violations.push({
          type: 'grapple-clearance',
          dist: parseFloat(dist.toFixed(2)),
          ring,
          collider: c
        });
      }
    }
  }

  return violations;
}

/**
 * V4 — Step Rise Verification
 */
export function validateStepRise(steps = [], maxRise = 0.28) {
  const violations = [];
  for (let i = 1; i < steps.length; i++) {
    const rise = steps[i].y - steps[i - 1].y;
    if (rise > maxRise + 0.02) {
      violations.push({
        type: 'step-rise',
        rise: parseFloat(rise.toFixed(3)),
        max: maxRise,
        stepIndex: i
      });
    }
  }
  return violations;
}
