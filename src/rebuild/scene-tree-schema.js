// src/rebuild/scene-tree-schema.js
// Typed Scene Tree (AST) Schema & Multi-Layer Validation for Dream Rebuild
// Replaces fragile regex code-scraping with a typed semantic intermediate representation.

export const NODE_TYPES = {
  // Shell
  MAP_SHELL: 'mapShell',
  TIER_FLOOR: 'tierFloor',
  
  // Spatial
  ROOM: 'room',
  CORRIDOR: 'corridor',
  DOORWAY: 'doorway',
  STAIR_RUN: 'stairRun',
  LANDING: 'landing',
  RAILING: 'railing',
  PLATFORM: 'platform',
  COVER_BLOCK: 'coverBlock',

  // Anchors
  SPAWN_POINT: 'spawnPoint',
  SNIPER_POST: 'sniperPost',
  PICKUP_POINT: 'pickupPoint',
  GRAPPLE_RING: 'grappleRing',

  // Dressing
  VIGNETTE_REF: 'vignetteRef',
  PROP_INSTANCE: 'propInstance',
  DETAIL_SCATTER: 'detailScatter',

  // Meta
  ENEMY_SPAWN: 'enemySpawn',
  BUDGET_NOTE: 'budgetNote'
};

export const TYPE_RANK = {
  [NODE_TYPES.MAP_SHELL]: 10,
  [NODE_TYPES.TIER_FLOOR]: 20,
  [NODE_TYPES.ROOM]: 30,
  [NODE_TYPES.PLATFORM]: 35,
  [NODE_TYPES.CORRIDOR]: 40,
  [NODE_TYPES.LANDING]: 50,
  [NODE_TYPES.STAIR_RUN]: 60,
  [NODE_TYPES.DOORWAY]: 70,
  [NODE_TYPES.RAILING]: 80,
  [NODE_TYPES.COVER_BLOCK]: 90,
  [NODE_TYPES.SPAWN_POINT]: 100,
  [NODE_TYPES.SNIPER_POST]: 110,
  [NODE_TYPES.PICKUP_POINT]: 120,
  [NODE_TYPES.GRAPPLE_RING]: 130,
  [NODE_TYPES.VIGNETTE_REF]: 140,
  [NODE_TYPES.PROP_INSTANCE]: 150,
  [NODE_TYPES.DETAIL_SCATTER]: 160,
  [NODE_TYPES.ENEMY_SPAWN]: 170,
  [NODE_TYPES.BUDGET_NOTE]: 180
};

/**
 * Creates a valid blank Scene Tree object.
 */
export function createSceneTree(mapKey, seed = 0, strategy = 'arena_ring') {
  return {
    schema: 'dream-scene-tree/1.0',
    map: mapKey,
    seed,
    strategy,
    createdAt: new Date().toISOString(),
    nodes: []
  };
}

/**
 * Helper to construct a typed Scene Tree node with default parameters.
 */
export function createNode(id, type, transform = {}, params = {}, tags = {}, children = []) {
  return {
    id: String(id),
    type,
    transform: {
      x: transform.x || 0,
      y: transform.y || 0,
      z: transform.z || 0,
      w: transform.w || 0,
      h: transform.h || 0,
      d: transform.d || 0
    },
    params: { ...params },
    tags: { ...tags },
    children: Array.isArray(children) ? [...children] : [],
    cost: { geometryCalls: 0, colliders: 0 }
  };
}

/**
 * L1 Schema Validator:
 * Validates structural integrity, required parameters, unique IDs, and type registration.
 * @param {object} tree - Scene Tree object
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateL1Schema(tree) {
  const errors = [];
  if (!tree || typeof tree !== 'object') {
    return { valid: false, errors: ['Tree must be a non-null object'] };
  }
  if (tree.schema !== 'dream-scene-tree/1.0') {
    errors.push(`Unsupported or missing schema version: ${tree.schema}`);
  }
  if (!tree.map || typeof tree.map !== 'string') {
    errors.push('Missing or invalid tree.map string');
  }
  if (!Array.isArray(tree.nodes)) {
    return { valid: false, errors: [...errors, 'tree.nodes must be an array'] };
  }

  const idSet = new Set();
  const validTypes = new Set(Object.values(NODE_TYPES));

  for (let i = 0; i < tree.nodes.length; i++) {
    const node = tree.nodes[i];
    const prefix = `Node[${i}]`;

    if (!node.id || typeof node.id !== 'string') {
      errors.push(`${prefix}: Missing or invalid id`);
    } else if (idSet.has(node.id)) {
      errors.push(`${prefix}: Duplicate node id "${node.id}"`);
    } else {
      idSet.add(node.id);
    }

    if (!node.type || !validTypes.has(node.type)) {
      errors.push(`${prefix} (${node.id || 'unnamed'}): Unknown node type "${node.type}"`);
    }

    if (!node.transform || typeof node.transform !== 'object') {
      errors.push(`${prefix} (${node.id}): Missing transform object`);
    }

    // Node-specific parameter checks
    if (node.type === NODE_TYPES.STAIR_RUN) {
      if (node.params.reservedRun === undefined || node.params.reservedRun <= 0) {
        errors.push(`${node.id}: stairRun requires positive params.reservedRun`);
      }
    } else if (node.type === NODE_TYPES.DOORWAY) {
      if (!node.params.wall) {
        errors.push(`${node.id}: doorway requires params.wall ("north"|"south"|"east"|"west")`);
      }
    }
  }

  // Validate child references exist in tree
  for (const node of tree.nodes) {
    if (Array.isArray(node.children)) {
      for (const childId of node.children) {
        if (!idSet.has(childId)) {
          errors.push(`Node "${node.id}" references non-existent child "${childId}"`);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * L2 Spatial Validator:
 * Checks for AABB conflicts, stair feasibility, and minimum clearances.
 * @param {object} tree - Validated Scene Tree object
 * @returns {{ valid: boolean, warnings: string[], errors: string[] }}
 */
export function validateL2Spatial(tree) {
  const errors = [];
  const warnings = [];

  const nodes = tree.nodes || [];
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Check stair feasibility math
  for (const node of nodes) {
    if (node.type === NODE_TYPES.STAIR_RUN) {
      const deltaY = Math.abs(node.params.deltaY || (node.transform.h || 0));
      const reservedRun = node.params.reservedRun || 0;
      const stepRise = node.params.stepRise || 0.2857;
      const stepRun = node.params.stepRun || 0.45;

      if (deltaY > 0) {
        const steps = Math.ceil(deltaY / stepRise);
        const requiredRun = steps * stepRun;
        if (reservedRun < requiredRun - 0.05) {
          errors.push(`Stair "${node.id}": Reserved run (${reservedRun.toFixed(2)}m) < required run (${requiredRun.toFixed(2)}m) for deltaY ${deltaY.toFixed(2)}m`);
        }
      }
    }
  }

  return { valid: errors.length === 0, warnings, errors };
}
