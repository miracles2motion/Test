// src/rebuild/vignette-composer.js
// Scene Vignette Composer for Dream Rebuild
// Composes coherent micro-scenes using prefabs anchored to the Surface Grid across all tiers.

import { createNode, NODE_TYPES } from './scene-tree-schema.js';
import { VIGNETTE_LIBRARY } from './vignette-library.js';

/**
 * Composes contextual vignettes onto the Scene Tree across all elevation tiers.
 * @param {object} tree - Scene Tree AST
 * @param {object} grid - Populated SurfaceGrid instance
 * @param {string} theme - Active map theme
 * @param {object} rng - Seeded PRNG instance
 */
export function composeVignettes(tree, grid, theme = 'space_station', rng) {
  const eligibleVignettes = Object.values(VIGNETTE_LIBRARY).filter(v =>
    v.themes.includes(theme) || v.themes.includes('universal')
  );

  if (eligibleVignettes.length === 0) return tree;

  const placedVignettes = [];
  let vigNodeId = 1;

  // Group tree zones
  const zones = tree.nodes.filter(n =>
    n.type === NODE_TYPES.ROOM ||
    n.type === NODE_TYPES.PLATFORM ||
    n.type === NODE_TYPES.TIER_FLOOR
  );

  for (const zoneNode of zones) {
    const targetY = zoneNode.transform.y || 0;
    const freeAnchors = grid.freeAnchors(zoneNode.id, targetY, 2.2);
    if (freeAnchors.length < 2) continue;

    // Pick a vignette template compatible with theme & tier
    const candidates = eligibleVignettes.filter(v => targetY === 0 || v.tierAny);
    if (candidates.length === 0) continue;

    const template = rng.randChoice(candidates);

    // Diversity Guard D1: Ensure >= 18m separation between same vignette types
    const anchor = rng.randChoice(freeAnchors);
    const tooClose = placedVignettes.some(pv =>
      pv.id === template.id && Math.hypot(pv.x - anchor.x, pv.z - anchor.z) < 18.0
    );
    if (tooClose) continue;

    // Place the vignette set-piece
    placedVignettes.push({ id: template.id, x: anchor.x, z: anchor.z, y: targetY });
    anchor.layer.flags.occupied = true;

    // Instantiate each slot from the template's fill pool
    const slotOffsets = [
      [0, 0],
      [1.4, 0],
      [-1.4, 0],
      [0, 1.4],
      [0, -1.4]
    ];

    for (let sIdx = 0; sIdx < template.slots.length; sIdx++) {
      const slot = template.slots[sIdx];
      const prefabName = rng.randChoice(slot.fills);
      const [ox, oz] = slotOffsets[sIdx % slotOffsets.length];

      tree.nodes.push(
        createNode(`vig_${template.id}_${vigNodeId++}`, NODE_TYPES.PROP_INSTANCE, {
          x: anchor.x + ox,
          y: targetY,
          z: anchor.z + oz
        }, {
          prefab: prefabName,
          slotRole: slot.role,
          vignette: template.id
        }, {
          theme,
          zone: zoneNode.id
        })
      );
    }
  }

  return tree;
}
