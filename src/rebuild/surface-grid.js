// src/rebuild/surface-grid.js
// Layered 3D Surface & Occupancy Grid for Dream Rebuild
// Solves Vector C: provides awareness of walkable surfaces and headroom across all tiers (Y=0, 5, 10).

import { NODE_TYPES } from './scene-tree-schema.js';

export const CELL_SIZE = 2.0; // 2m x 2m grid resolution

/**
 * Surface Grid represents discrete horizontal layers of the game level.
 */
export class SurfaceGrid {
  /**
   * @param {number} halfSpan - Half-span P of the map (e.g. 55)
   * @param {number} wallHeight - Max ceiling height PH (e.g. 18)
   */
  constructor(halfSpan = 55, wallHeight = 18) {
    this.P = halfSpan;
    this.PH = wallHeight;
    this.cellSize = CELL_SIZE;
    this.dim = Math.ceil((halfSpan * 2) / CELL_SIZE);
    // 2D grid of column arrays: map Key "col_row" -> Array of layers [{ surfaceY, headroom, flags, zoneRef }]
    this.columns = new Map();
  }

  coordToKey(x, z) {
    const col = Math.floor((x + this.P) / this.cellSize);
    const row = Math.floor((z + this.P) / this.cellSize);
    return `${col}_${row}`;
  }

  keyToCenterCoord(key) {
    const [col, row] = key.split('_').map(Number);
    const x = col * this.cellSize - this.P + this.cellSize / 2;
    const z = row * this.cellSize - this.P + this.cellSize / 2;
    return { x, z };
  }

  /**
   * Register a walkable horizontal surface slab into the grid.
   */
  addSurface(x1, z1, x2, z2, surfaceY, zoneRef = null) {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minZ = Math.min(z1, z2);
    const maxZ = Math.max(z1, z2);

    for (let x = minX; x <= maxX; x += this.cellSize) {
      for (let z = minZ; z <= maxZ; z += this.cellSize) {
        const key = this.coordToKey(x, z);
        let layers = this.columns.get(key);
        if (!layers) {
          layers = [];
          this.columns.set(key, layers);
        }
        // Avoid duplicate exact layer heights
        if (!layers.some(l => Math.abs(l.surfaceY - surfaceY) < 0.2)) {
          layers.push({
            surfaceY,
            headroom: this.PH - surfaceY,
            flags: { walkable: true, occupied: false, isEdge: false },
            zoneRef
          });
          // Sort layers ascending by height
          layers.sort((a, b) => a.surfaceY - b.surfaceY);
        }
      }
    }
  }

  /**
   * Calculate vertical headroom and edge boundaries across all registered cells.
   */
  finalize() {
    for (const [key, layers] of this.columns.entries()) {
      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        if (i < layers.length - 1) {
          layer.headroom = layers[i + 1].surfaceY - layer.surfaceY;
        } else {
          layer.headroom = this.PH - layer.surfaceY;
        }

        // Edge detection: check if neighbor cells have lower surface height
        const { x, z } = this.keyToCenterCoord(key);
        const neighbors = [
          this.coordToKey(x + this.cellSize, z),
          this.coordToKey(x - this.cellSize, z),
          this.coordToKey(x, z + this.cellSize),
          this.coordToKey(x, z - this.cellSize)
        ];

        let hasFall = false;
        for (const nKey of neighbors) {
          const nLayers = this.columns.get(nKey);
          if (!nLayers || !nLayers.some(nl => Math.abs(nl.surfaceY - layer.surfaceY) < 0.5)) {
            hasFall = true;
            break;
          }
        }
        layer.flags.isEdge = hasFall;
      }
    }
  }

  /**
   * Query all surface layers at world (x, z).
   */
  surfaceAt(x, z) {
    const key = this.coordToKey(x, z);
    return this.columns.get(key) || [];
  }

  /**
   * Query headroom above surface at (x, z, y).
   */
  headroom(x, z, y) {
    const layers = this.surfaceAt(x, z);
    const match = layers.find(l => Math.abs(l.surfaceY - y) < 0.5);
    return match ? match.headroom : 0;
  }

  /**
   * Returns free anchor cells for placing vignettes or cover in a zone at elevation Y.
   */
  freeAnchors(zoneRef, targetY = 0, minHeadroom = 2.4) {
    const free = [];
    for (const [key, layers] of this.columns.entries()) {
      for (const layer of layers) {
        if (
          (!zoneRef || layer.zoneRef === zoneRef) &&
          Math.abs(layer.surfaceY - targetY) < 0.5 &&
          layer.headroom >= minHeadroom &&
          !layer.flags.occupied
        ) {
          const { x, z } = this.keyToCenterCoord(key);
          free.push({ x, z, surfaceY: layer.surfaceY, headroom: layer.headroom, isEdge: layer.flags.isEdge, layer });
        }
      }
    }
    return free;
  }
}

/**
 * Builds a SurfaceGrid directly from Scene Tree AST nodes.
 */
export function buildSurfaceGridFromTree(tree) {
  const shell = tree.nodes.find(n => n.type === NODE_TYPES.MAP_SHELL);
  const P = shell?.params?.P || 55;
  const PH = shell?.params?.PH || 18;

  const grid = new SurfaceGrid(P, PH);

  // Add ground floor
  grid.addSurface(-P, -P, P, P, 0, 'ground');

  // Add all platforms, rooms, tier floors, and corridors
  for (const node of tree.nodes) {
    const { x, y, z, w, d } = node.transform;
    if (w > 0 && d > 0) {
      if (
        node.type === NODE_TYPES.PLATFORM ||
        node.type === NODE_TYPES.TIER_FLOOR ||
        node.type === NODE_TYPES.ROOM ||
        node.type === NODE_TYPES.CORRIDOR ||
        node.type === NODE_TYPES.LANDING
      ) {
        grid.addSurface(x - w / 2, z - d / 2, x + w / 2, z + d / 2, y, node.id);
      }
    }
  }

  grid.finalize();
  return grid;
}
