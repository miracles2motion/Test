// src/rebuild/spatial-embedder.js
// Spatial Layout Embedding & Scene Tree Node Generator for Dream Rebuild
// Transforms the abstract Zone Graph into placed 3D geometric nodes across 5 distinct strategies.

import { createSceneTree, createNode, NODE_TYPES } from './scene-tree-schema.js';
import { createRNG } from './prng.js';

/**
 * Check if two 2D AABBs overlap.
 */
function aabbOverlap(a, b, padding = 1.0) {
  return (
    Math.abs(a.x - b.x) * 2 < (a.w + b.w + padding * 2) &&
    Math.abs(a.z - b.z) * 2 < (a.d + b.d + padding * 2)
  );
}

/**
 * Embeds a Zone Program into physical coordinates and generates a Scene Tree AST.
 * @param {object} prog - The guaranteed tactical Zone Program
 * @param {object} [opts] - Options including seed, strategy, and mapKey
 * @returns {object} Scene Tree AST
 */
export function embedSpatialLayout(prog, opts = {}) {
  const mapKey = opts.mapKey || 'custom_map';
  const seed = opts.seed || 101;
  const strategy = opts.strategy || prog.strategyHint || 'arena_ring';
  const rng = createRNG(seed);

  const P = prog.bounds.P || 55;
  const PH = prog.bounds.PH || 18;
  const tree = createSceneTree(mapKey, seed, strategy);

  // 1. Add Map Shell (Floor & Perimeter Walls)
  tree.nodes.push(
    createNode('shell', NODE_TYPES.MAP_SHELL, {}, { P, PH, inks: prog.inks })
  );

  const placedZones = new Map();

  // 2. Initial Strategic Placement by Strategy
  const mid = prog.zones.find(z => z.role === 'arena') || prog.zones[0];
  const spawns = prog.zones.filter(z => z.role === 'spawn');
  const others = prog.zones.filter(z => z.id !== mid.id && z.role !== 'spawn');

  // Place Mid
  placedZones.set(mid.id, {
    x: 0,
    z: 0,
    y: mid.tier || 0,
    w: mid.footprint[0],
    d: mid.footprint[1],
    zone: mid
  });

  // Place Spawns & Other zones according to Strategy
  if (strategy === 'terraced') {
    // Stepped layout from South (low) to North (high)
    const zStep = (P * 1.4) / (prog.zones.length || 1);
    let curZ = -P * 0.7;
    for (let i = 0; i < spawns.length; i++) {
      const s = spawns[i];
      const x = (i % 2 === 0 ? -1 : 1) * (P * 0.5 + rng.randFloat(-4, 4));
      placedZones.set(s.id, { x, z: -P * 0.75, y: 0, w: s.footprint[0], d: s.footprint[1], zone: s });
    }
    for (let i = 0; i < others.length; i++) {
      const z = others[i];
      curZ += zStep;
      const x = ((i % 2 === 0 ? -1 : 1) * (P * 0.35)) + rng.randFloat(-5, 5);
      placedZones.set(z.id, { x, z: curZ, y: z.tier, w: z.footprint[0], d: z.footprint[1], zone: z });
    }
  } else if (strategy === 'cathedral_cross') {
    // Two perpendicular crossing axes
    const axisOffsets = [
      [0, P * 0.6], [0, -P * 0.6], [P * 0.6, 0], [-P * 0.6, 0]
    ];
    let offsetIdx = 0;
    for (const s of spawns) {
      const off = axisOffsets[offsetIdx++ % axisOffsets.length];
      placedZones.set(s.id, { x: off[0], z: off[1], y: 0, w: s.footprint[0], d: s.footprint[1], zone: s });
    }
    for (const o of others) {
      const off = axisOffsets[offsetIdx++ % axisOffsets.length];
      const jitterX = rng.randFloat(-8, 8);
      const jitterZ = rng.randFloat(-8, 8);
      placedZones.set(o.id, { x: off[0] * 0.6 + jitterX, z: off[1] * 0.6 + jitterZ, y: o.tier, w: o.footprint[0], d: o.footprint[1], zone: o });
    }
  } else {
    // Arena Ring / Warren / Ravine: Perimeter Radial Placement
    const spawnAngleStep = (Math.PI * 2) / Math.max(spawns.length, 2);
    for (let i = 0; i < spawns.length; i++) {
      const angle = i * spawnAngleStep + rng.randFloat(-0.2, 0.2);
      const radius = P * 0.72;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      placedZones.set(spawns[i].id, {
        x, z, y: spawns[i].tier || 0,
        w: spawns[i].footprint[0], d: spawns[i].footprint[1],
        zone: spawns[i]
      });
    }

    const otherAngleStep = (Math.PI * 2) / Math.max(others.length, 1);
    for (let i = 0; i < others.length; i++) {
      const angle = i * otherAngleStep + spawnAngleStep * 0.5 + rng.randFloat(-0.2, 0.2);
      const radius = P * (strategy === 'warren' ? 0.45 : 0.55);
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      placedZones.set(others[i].id, {
        x, z, y: others[i].tier || 0,
        w: others[i].footprint[0], d: others[i].footprint[1],
        zone: others[i]
      });
    }
  }

  // 3. Relaxation Loop: resolve AABB overlaps
  const placedList = Array.from(placedZones.values());
  for (let iter = 0; iter < 12; iter++) {
    let hadCollision = false;
    for (let i = 0; i < placedList.length; i++) {
      for (let j = i + 1; j < placedList.length; j++) {
        const a = placedList[i];
        const b = placedList[j];
        if (aabbOverlap(a, b, 2.0)) {
          hadCollision = true;
          // Calculate push vector
          let dx = b.x - a.x;
          let dz = b.z - a.z;
          const dist = Math.hypot(dx, dz) || 0.1;
          dx /= dist;
          dz /= dist;
          const push = 2.5;
          if (a.zone.role !== 'arena') {
            a.x -= dx * push;
            a.z -= dz * push;
          }
          if (b.zone.role !== 'arena') {
            b.x += dx * push;
            b.z += dz * push;
          }
        }
      }
    }
    // Clamp to arena bounds
    for (const item of placedList) {
      const halfW = item.w / 2;
      const halfD = item.d / 2;
      const maxExtent = P - 3;
      item.x = Math.max(-maxExtent + halfW, Math.min(maxExtent - halfW, item.x));
      item.z = Math.max(-maxExtent + halfD, Math.min(maxExtent - halfD, item.z));
    }
    if (!hadCollision) break;
  }

  // 4. Emit Spatial AST Nodes
  for (const item of placedList) {
    const { x, y, z, w, d, zone } = item;
    const ink = zone.tier > 0 ? prog.inks.accent : prog.inks.structure;

    if (zone.role === 'arena') {
      tree.nodes.push(createNode(zone.id, NODE_TYPES.PLATFORM, { x, y, z, w, d }, { depth: 0.8, supports: y > 0 }, { ink, zone: zone.id }));
    } else if (zone.role === 'vantage') {
      tree.nodes.push(createNode(zone.id, NODE_TYPES.PLATFORM, { x, y, z, w, d }, { depth: 0.6, supports: true }, { ink, zone: zone.id }));
      // Place sniper post on vantage
      tree.nodes.push(createNode(`sniper_${zone.id}`, NODE_TYPES.SNIPER_POST, { x: x + w * 0.25, y: y + 0.1, z: z + d * 0.25 }));
    } else if (zone.role === 'spawn') {
      tree.nodes.push(createNode(zone.id, NODE_TYPES.TIER_FLOOR, { x, y, z, w, d }, {}, { ink: prog.inks.structure, zone: zone.id }));
      tree.nodes.push(createNode(`spawn_${zone.id}`, NODE_TYPES.SPAWN_POINT, { x, y: y + 0.1, z }));
    } else if (zone.role === 'cqb_corridor') {
      tree.nodes.push(createNode(zone.id, NODE_TYPES.CORRIDOR, { x, y, z, w, d }, {}, { ink: prog.inks.structure, zone: zone.id }));
    } else {
      // Room
      tree.nodes.push(createNode(zone.id, NODE_TYPES.ROOM, { x, y, z, w, d }, { wallHeight: 5.0, interior: true }, { ink: prog.inks.structure, zone: zone.id }));
      // Add doorway to room
      tree.nodes.push(createNode(`door_${zone.id}`, NODE_TYPES.DOORWAY, { x, y, z: z + d / 2 }, { wall: 'north', width: 2.4 }, { ink: prog.inks.accent }));
    }

    // Add tactical cover blocks in populated zones
    if (zone.coverDensity > 0.4) {
      tree.nodes.push(
        createNode(`cov_${zone.id}_1`, NODE_TYPES.COVER_BLOCK, { x: x - w * 0.25, y, z: z - d * 0.25, w: 1.4, h: 1.2, d: 0.6 }, {}, { ink: prog.inks.accent })
      );
    }
  }

  // 5. Emit Stairs & Corridor Connections for Edges
  let stairIdx = 1;
  let corridorIdx = 1;

  for (const edge of prog.edges) {
    const posA = placedZones.get(edge.from);
    const posB = placedZones.get(edge.to);
    if (!posA || !posB) continue;

    const deltaY = Math.abs(posA.y - posB.y);
    const midX = (posA.x + posB.x) / 2;
    const midZ = (posA.z + posB.z) / 2;

    if (deltaY > 0.5) {
      // Connect with stairs
      const steps = Math.ceil(deltaY / 0.2857);
      const requiredRun = steps * 0.45;
      const dir = Math.abs(posB.z - posA.z) >= Math.abs(posB.x - posA.x)
        ? (posB.z >= posA.z ? 'z+' : 'z-')
        : (posB.x >= posA.x ? 'x+' : 'x-');

      tree.nodes.push(
        createNode(`stair_${stairIdx++}`, NODE_TYPES.STAIR_RUN, {
          x: midX,
          y: Math.min(posA.y, posB.y),
          z: midZ,
          h: deltaY
        }, {
          direction: dir,
          deltaY,
          reservedRun: requiredRun + 1.0,
          width: edge.width || 2.4
        }, {
          ink: prog.inks.accent
        })
      );
    } else {
      // Connect with a corridor walkway
      const length = Math.hypot(posB.x - posA.x, posB.z - posA.z);
      const isZAxis = Math.abs(posB.z - posA.z) >= Math.abs(posB.x - posA.x);
      tree.nodes.push(
        createNode(`corr_${corridorIdx++}`, NODE_TYPES.CORRIDOR, {
          x: midX,
          y: posA.y,
          z: midZ,
          w: isZAxis ? edge.width : length * 0.5,
          d: isZAxis ? length * 0.5 : edge.width
        }, {}, { ink: prog.inks.structure })
      );
    }
  }

  // 6. Add grapple rings over mid and vantage points
  tree.nodes.push(
    createNode('ring_mid', NODE_TYPES.GRAPPLE_RING, { x: 0, y: 14.0, z: 0 }, { orient: 'y' })
  );

  // 7. Add Weapon Pickups
  tree.nodes.push(
    createNode('pickup_mid', NODE_TYPES.PICKUP_POINT, { x: 0, y: placedZones.get(mid.id)?.y || 0, z: 0 }),
    createNode('pickup_flank_1', NODE_TYPES.PICKUP_POINT, { x: P * 0.35, y: 0, z: P * 0.35 }),
    createNode('pickup_flank_2', NODE_TYPES.PICKUP_POINT, { x: -P * 0.35, y: 0, z: -P * 0.35 })
  );

  return tree;
}
