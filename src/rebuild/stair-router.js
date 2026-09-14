// src/rebuild/stair-router.js
// Stair Router & Railing Edge Synthesizer for Dream Rebuild
// Bridges vertical gaps with mathematically valid stairs, landings, and safety railings.

import { createNode, NODE_TYPES } from './scene-tree-schema.js';

/**
 * Routes stairs and safety railings on a Scene Tree using the Surface Grid.
 * @param {object} tree - Scene Tree AST
 * @param {object} grid - Populated SurfaceGrid instance
 */
export function routeStairsAndRailings(tree, grid) {
  const newNodes = [];
  let stairId = 100;
  let landingId = 100;
  let railId = 100;

  // 1. Synthesize Railings along dangerous drops (> 3.0m)
  for (const [key, layers] of grid.columns.entries()) {
    for (const layer of layers) {
      if (layer.surfaceY > 3.0 && layer.flags.isEdge && !layer.flags.occupied) {
        const { x, z } = grid.keyToCenterCoord(key);
        // Place railing segment on the edge cell
        newNodes.push(
          createNode(`rail_${railId++}`, NODE_TYPES.RAILING, {}, {
            x1: x - 0.9, z1: z,
            x2: x + 0.9, z2: z,
            y: layer.surfaceY
          }, { ink: 'BK' })
        );
      }
    }
  }

  // 2. Headroom & Landing check on existing stairRun nodes
  for (const node of tree.nodes) {
    if (node.type === NODE_TYPES.STAIR_RUN) {
      const deltaY = node.params.deltaY || 4.0;
      if (deltaY > 5.0) {
        // Split high climb with an intermediate landing
        const halfY = deltaY / 2;
        const landingNode = createNode(`landing_${landingId++}`, NODE_TYPES.LANDING, {
          x: node.transform.x,
          y: node.transform.y + halfY,
          z: node.transform.z,
          w: 2.4,
          d: 2.0
        }, {}, { ink: 'BL' });
        newNodes.push(landingNode);
      }
    }
  }

  tree.nodes.push(...newNodes);
  return tree;
}
