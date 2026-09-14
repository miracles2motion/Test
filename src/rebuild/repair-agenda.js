// src/rebuild/repair-agenda.js
// Bounded Multi-Pass Auto-Repair Loop for Dream Rebuild
// Solves Root Cause 7: applies measured prescriptions as Scene Tree AST edits until the map passes.

import { createNode, NODE_TYPES } from './scene-tree-schema.js';
import { buildSurfaceGridFromTree } from './surface-grid.js';
import { validateGameplay } from './validation-engine.js';

/**
 * Runs a bounded multi-pass repair loop (max 5 passes) on a Scene Tree.
 * @param {object} tree - Scene Tree AST
 * @param {number} [maxPasses=5] - Maximum repair iterations
 * @returns {{ tree: object, passes: number, finalScore: number, passed: boolean }}
 */
export function executeRepairAgenda(tree, maxPasses = 5) {
  let passes = 0;
  let grid = buildSurfaceGridFromTree(tree);
  let report = validateGameplay(tree, grid);

  while (!report.passed && passes < maxPasses) {
    passes++;
    const appliedRx = new Set();

    for (const def of report.deficiencies) {
      const rx = def.prescription;
      if (!rx || appliedRx.has(def.id)) continue;

      if (rx.kind === 'addCoverVignette') {
        // Add tactical cover blocks in mid and lanes
        tree.nodes.push(
          createNode(`rx_cover_${passes}_1`, NODE_TYPES.COVER_BLOCK, { x: 4, y: 0, z: 4, w: 1.2, h: 1.2, d: 0.8 }, {}, { ink: 'OR' }),
          createNode(`rx_cover_${passes}_2`, NODE_TYPES.COVER_BLOCK, { x: -4, y: 0, z: -4, w: 1.2, h: 1.2, d: 0.8 }, {}, { ink: 'OR' })
        );
        appliedRx.add(def.id);
      } else if (rx.kind === 'movePickup') {
        const pickupNode = tree.nodes.find(n => n.id === rx.target);
        if (pickupNode) {
          // Relocate pickup to safe ground coordinates
          pickupNode.transform.x = 0;
          pickupNode.transform.y = 0;
          pickupNode.transform.z = 0;
          appliedRx.add(def.id);
        }
      } else if (rx.kind === 'issueStairDemand') {
        // Connect unreachable target with a stair run
        const targetNode = tree.nodes.find(n => n.id === rx.target);
        if (targetNode) {
          const deltaY = targetNode.transform.y || 4.0;
          tree.nodes.push(
            createNode(`rx_stair_${passes}`, NODE_TYPES.STAIR_RUN, {
              x: targetNode.transform.x,
              y: 0,
              z: targetNode.transform.z - 4.0,
              h: deltaY
            }, {
              direction: 'z+',
              deltaY,
              reservedRun: 8.0
            }, { ink: 'OR' })
          );
          appliedRx.add(def.id);
        }
      }
    }

    // Rebuild grid and re-validate
    grid = buildSurfaceGridFromTree(tree);
    report = validateGameplay(tree, grid);
  }

  return {
    tree,
    passes,
    finalScore: report.score,
    passed: report.passed,
    report
  };
}
