// src/rebuild/scene-compiler.js
// Deterministic Scene Tree AST Compiler for Dream Rebuild
// Translates high-level semantic nodes into Three.js primitives with atomic region updates.

import { NODE_TYPES, TYPE_RANK, validateL1Schema, validateL2Spatial } from './scene-tree-schema.js';

export const HAND_REGION_HEADER = '// === HAND REGION (never touched by Dream) ===';
export const DREAM_REGION_HEADER = '// === DREAM REGION (regenerated WHOLESALE from the tree) ===';
export const DREAM_REGION_FOOTER = '// === END DREAM REGION ===';

/**
 * Format numerical values cleanly with at most 2 decimal places.
 */
function f(num) {
  if (num === undefined || num === null || isNaN(num)) return '0';
  const rounded = Number(num.toFixed(2));
  return String(rounded);
}

/**
 * Emitters for each node type.
 * Each emitter returns: { lines: string[], imports: string[], geometryCalls: number, colliders: number }
 */
const EMITTERS = {
  [NODE_TYPES.MAP_SHELL]: (node) => {
    const P = node.params.P || 55;
    const PH = node.params.PH || 18;
    const structureInk = node.params.inks?.structure || 'BL';
    const lines = [];

    lines.push(`  // Arena Shell: Ground floor slab & perimeter boundaries`);
    lines.push(`  slab(-${f(P)}, -${f(P)}, ${f(P)}, ${f(P)}, 0, 1.0, { ink: ${structureInk} }); // ${node.id}/ground`);
    lines.push(`  // Boundary Walls`);
    lines.push(`  box(0, ${f(PH / 2)}, ${f(P)}, ${f(P * 2)}, ${f(PH)}, 1.0, { ink: ${structureInk} }); // ${node.id}/wall_north`);
    lines.push(`  box(0, ${f(PH / 2)}, -${f(P)}, ${f(P * 2)}, ${f(PH)}, 1.0, { ink: ${structureInk} }); // ${node.id}/wall_south`);
    lines.push(`  box(${f(P)}, ${f(PH / 2)}, 0, 1.0, ${f(PH)}, ${f(P * 2)}, { ink: ${structureInk} }); // ${node.id}/wall_east`);
    lines.push(`  box(-${f(P)}, ${f(PH / 2)}, 0, 1.0, ${f(PH)}, ${f(P * 2)}, { ink: ${structureInk} }); // ${node.id}/wall_west`);

    return {
      lines,
      imports: [],
      geometryCalls: 5,
      colliders: 5
    };
  },

  [NODE_TYPES.TIER_FLOOR]: (node) => {
    const { x, y, z, w, d } = node.transform;
    const depth = node.params.depth || 0.6;
    const ink = node.tags.ink || 'BL';
    const x1 = x - w / 2;
    const x2 = x + w / 2;
    const z1 = z - d / 2;
    const z2 = z + d / 2;

    return {
      lines: [
        `  slab(${f(x1)}, ${f(z1)}, ${f(x2)}, ${f(z2)}, ${f(y)}, ${f(depth)}, { ink: ${ink} }); // ${node.id}`
      ],
      imports: [],
      geometryCalls: 1,
      colliders: 1
    };
  },

  [NODE_TYPES.PLATFORM]: (node) => {
    const { x, y, z, w, d } = node.transform;
    const depth = node.params.depth || 0.6;
    const ink = node.tags.ink || 'BL';
    const x1 = x - w / 2;
    const x2 = x + w / 2;
    const z1 = z - d / 2;
    const z2 = z + d / 2;
    const lines = [];

    lines.push(`  slab(${f(x1)}, ${f(z1)}, ${f(x2)}, ${f(z2)}, ${f(y)}, ${f(depth)}, { ink: ${ink} }); // ${node.id}`);
    let calls = 1;
    let cols = 1;

    if (node.params.supports && y > 0) {
      const colInk = node.params.columnInk || 'BK';
      const colRadius = node.params.columnRadius || 0.35;
      const offsets = [
        [-w / 2 + 1, -d / 2 + 1],
        [w / 2 - 1, -d / 2 + 1],
        [-w / 2 + 1, d / 2 - 1],
        [w / 2 - 1, d / 2 - 1]
      ];
      for (const [ox, oz] of offsets) {
        lines.push(`  cyl(${f(x + ox)}, ${f(y / 2)}, ${f(z + oz)}, ${f(colRadius)}, ${f(y)}, { ink: ${colInk} }); // ${node.id}/support`);
        calls++;
        cols++;
      }
    }

    return { lines, imports: [], geometryCalls: calls, colliders: cols };
  },

  [NODE_TYPES.ROOM]: (node) => {
    const { x, y, z, w, d } = node.transform;
    const wallH = node.params.wallHeight || 5.0;
    const wallT = node.params.wallThickness || 0.4;
    const ink = node.tags.ink || 'BL';
    const lines = [];

    lines.push(`  // Room: ${node.id} (${w}x${d} at Y=${y})`);
    if (node.params.interior) {
      lines.push(`  slab(${f(x - w / 2)}, ${f(z - d / 2)}, ${f(x + w / 2)}, ${f(z + d / 2)}, ${f(y)}, 0.4, { ink: ${ink} }); // ${node.id}/floor`);
    }

    // Four wall segments
    lines.push(`  box(${f(x)}, ${f(y + wallH / 2)}, ${f(z + d / 2)}, ${f(w)}, ${f(wallH)}, ${f(wallT)}, { ink: ${ink} }); // ${node.id}/wall_north`);
    lines.push(`  box(${f(x)}, ${f(y + wallH / 2)}, ${f(z - d / 2)}, ${f(w)}, ${f(wallH)}, ${f(wallT)}, { ink: ${ink} }); // ${node.id}/wall_south`);
    lines.push(`  box(${f(x + w / 2)}, ${f(y + wallH / 2)}, ${f(z)}, ${f(wallT)}, ${f(wallH)}, ${f(d)}, { ink: ${ink} }); // ${node.id}/wall_east`);
    lines.push(`  box(${f(x - w / 2)}, ${f(y + wallH / 2)}, ${f(z)}, ${f(wallT)}, ${f(wallH)}, ${f(d)}, { ink: ${ink} }); // ${node.id}/wall_west`);

    return {
      lines,
      imports: [],
      geometryCalls: node.params.interior ? 5 : 4,
      colliders: node.params.interior ? 5 : 4
    };
  },

  [NODE_TYPES.CORRIDOR]: (node) => {
    const { x, y, z, w, d } = node.transform;
    const ink = node.tags.ink || 'BL';
    const x1 = x - w / 2;
    const x2 = x + w / 2;
    const z1 = z - d / 2;
    const z2 = z + d / 2;

    return {
      lines: [
        `  slab(${f(x1)}, ${f(z1)}, ${f(x2)}, ${f(z2)}, ${f(y)}, 0.4, { ink: ${ink} }); // ${node.id}/walkway`
      ],
      imports: [],
      geometryCalls: 1,
      colliders: 1
    };
  },

  [NODE_TYPES.DOORWAY]: (node) => {
    const { x, y, z, w, h } = node.transform;
    const doorW = node.params.width || 2.4;
    const doorH = node.params.height || 3.0;
    const ink = node.tags.ink || 'OR';
    const lines = [];

    // Frame posts & lintel
    lines.push(`  // Doorway: ${node.id} (${doorW}m clear opening)`);
    lines.push(`  box(${f(x - doorW / 2)}, ${f(y + doorH / 2)}, ${f(z)}, 0.25, ${f(doorH)}, 0.5, { ink: ${ink}, noCollide: true }); // ${node.id}/post_left`);
    lines.push(`  box(${f(x + doorW / 2)}, ${f(y + doorH / 2)}, ${f(z)}, 0.25, ${f(doorH)}, 0.5, { ink: ${ink}, noCollide: true }); // ${node.id}/post_right`);
    lines.push(`  box(${f(x)}, ${f(y + doorH)}, ${f(z)}, ${f(doorW + 0.5)}, 0.35, 0.5, { ink: ${ink}, noCollide: true }); // ${node.id}/lintel`);

    return {
      lines,
      imports: [],
      geometryCalls: 3,
      colliders: 0
    };
  },

  [NODE_TYPES.STAIR_RUN]: (node) => {
    const { x, y, z } = node.transform;
    const dir = node.params.direction || 'z+';
    const deltaY = Math.abs(node.params.deltaY || node.transform.h || 4.0);
    const stepRise = node.params.stepRise || 0.2857;
    const stepRun = node.params.stepRun || 0.45;
    const width = node.params.width || 2.4;
    const ink = node.tags.ink || 'OR';
    const steps = Math.ceil(deltaY / stepRise);

    return {
      lines: [
        `  stairs(${f(x)}, ${f(y)}, ${f(z)}, '${dir}', ${steps}, ${f(width)}, { rise: ${f(stepRise)}, run: ${f(stepRun)}, ink: ${ink} }); // ${node.id}`
      ],
      imports: [],
      geometryCalls: 1,
      colliders: steps
    };
  },

  [NODE_TYPES.LANDING]: (node) => {
    const { x, y, z, w, d } = node.transform;
    const ink = node.tags.ink || 'BL';
    return {
      lines: [
        `  slab(${f(x - w / 2)}, ${f(z - d / 2)}, ${f(x + w / 2)}, ${f(z + d / 2)}, ${f(y)}, 0.4, { ink: ${ink} }); // ${node.id}`
      ],
      imports: [],
      geometryCalls: 1,
      colliders: 1
    };
  },

  [NODE_TYPES.RAILING]: (node) => {
    const { x1, z1, x2, z2, y } = node.params;
    const ink = node.tags.ink || 'BK';
    return {
      lines: [
        `  rail(${f(x1)}, ${f(z1)}, ${f(x2)}, ${f(z2)}, ${f(y)}, { ink: ${ink} }); // ${node.id}`
      ],
      imports: [],
      geometryCalls: 1,
      colliders: 1
    };
  },

  [NODE_TYPES.COVER_BLOCK]: (node) => {
    const { x, y, z, w, h, d } = node.transform;
    const ink = node.tags.ink || 'OR';
    return {
      lines: [
        `  box(${f(x)}, ${f(y + h / 2)}, ${f(z)}, ${f(w)}, ${f(h)}, ${f(d)}, { ink: ${ink}, tag: 'cover' }); // ${node.id}`
      ],
      imports: [],
      geometryCalls: 1,
      colliders: 1
    };
  },

  [NODE_TYPES.HOLLOW_CYL]: (node) => {
    const { x, y, z } = node.transform;
    const rInner = node.params.rInner || 1.5;
    const rOuter = node.params.rOuter || 1.9;
    const length = node.params.length || node.transform.d || 8;
    const axis = node.params.axis || 'z';
    const ink = node.tags.ink || 'BK';
    const floor = node.params.floor !== false;
    const bands = node.params.bands || 0;
    return {
      lines: [
        `  hollowCyl(${f(x)}, ${f(y)}, ${f(z)}, ${f(rInner)}, ${f(rOuter)}, ${f(length)}, { axis: '${axis}', ink: ${ink}, floor: ${floor}, bands: ${bands} }); // ${node.id}`
      ],
      imports: [],
      geometryCalls: 2,
      colliders: 4
    };
  },

  [NODE_TYPES.FACETED_ROCK]: (node) => {
    const { x, y, z } = node.transform;
    const rx = node.params.rx || (node.transform.w ? node.transform.w / 2 : 1.2);
    const ry = node.params.ry || node.transform.h || 1.0;
    const rz = node.params.rz || (node.transform.d ? node.transform.d / 2 : 1.2);
    const ink = node.tags.ink || 'BK';
    const cover = node.params.cover || node.tags.cover || 'waist';
    const seed = node.params.seed || 1337;
    return {
      lines: [
        `  facetedRock(${f(x)}, ${f(y)}, ${f(z)}, ${f(rx)}, ${f(ry)}, ${f(rz)}, { ink: ${ink}, cover: '${cover}', seed: ${seed} }); // ${node.id}`
      ],
      imports: [],
      geometryCalls: 1,
      colliders: 1
    };
  },

  [NODE_TYPES.ARCH]: (node) => {
    const { x, y, z } = node.transform;
    const span = node.params.span || node.transform.w || 3.0;
    const height = node.params.height || node.transform.h || 3.6;
    const depth = node.params.depth || node.transform.d || 1.0;
    const axis = node.params.axis || 'z';
    const ink = node.tags.ink || 'BL';
    return {
      lines: [
        `  arch(${f(x)}, ${f(y)}, ${f(z)}, ${f(span)}, ${f(height)}, ${f(depth)}, { axis: '${axis}', ink: ${ink} }); // ${node.id}`
      ],
      imports: [],
      geometryCalls: 10,
      colliders: 10
    };
  },

  [NODE_TYPES.WEDGE]: (node) => {
    const { x, y, z, w, h, d } = node.transform;
    const dir = node.params.dir || '+x';
    const ink = node.tags.ink || 'BL';
    const colliderType = node.params.collider || 'stepped';
    return {
      lines: [
        `  wedge(${f(x)}, ${f(y)}, ${f(z)}, ${f(w)}, ${f(h)}, ${f(d)}, { dir: '${dir}', ink: ${ink}, collider: '${colliderType}' }); // ${node.id}`
      ],
      imports: [],
      geometryCalls: 1,
      colliders: 4
    };
  },

  [NODE_TYPES.SPAWN_POINT]: (node) => {
    const { x, y, z } = node.transform;
    return {
      lines: [`  spawn(${f(x)}, ${f(y)}, ${f(z)}); // ${node.id}`],
      imports: [],
      geometryCalls: 1,
      colliders: 0
    };
  },

  [NODE_TYPES.SNIPER_POST]: (node) => {
    const { x, y, z } = node.transform;
    return {
      lines: [`  sniper(${f(x)}, ${f(y)}, ${f(z)}); // ${node.id}`],
      imports: [],
      geometryCalls: 1,
      colliders: 0
    };
  },

  [NODE_TYPES.PICKUP_POINT]: (node) => {
    const { x, y, z } = node.transform;
    return {
      lines: [`  pickup(${f(x)}, ${f(y)}, ${f(z)}); // ${node.id}`],
      imports: [],
      geometryCalls: 1,
      colliders: 0
    };
  },

  [NODE_TYPES.GRAPPLE_RING]: (node) => {
    const { x, y, z } = node.transform;
    const orient = node.params.orient || 'y';
    return {
      lines: [`  ring(${f(x)}, ${f(y)}, ${f(z)}, '${orient}'); // ${node.id}`],
      imports: [],
      geometryCalls: 1,
      colliders: 1
    };
  },

  [NODE_TYPES.PROP_INSTANCE]: (node) => {
    const { x, y, z } = node.transform;
    const prefabName = node.params.prefab;
    const extraArgs = node.params.args ? `, ${node.params.args.join(', ')}` : '';
    return {
      lines: [
        `  ${prefabName}(B, ${f(x)}, ${f(y)}, ${f(z)}${extraArgs}); // ${node.id}`
      ],
      imports: [prefabName],
      geometryCalls: node.params.estCalls || 5,
      colliders: node.params.estColliders || 5
    };
  },

  [NODE_TYPES.VIGNETTE_REF]: (node) => {
    const { x, y, z } = node.transform;
    const prefabName = node.params.primaryPrefab || 'box';
    return {
      lines: [
        `  // Vignette: ${node.params.vignette || node.id}`,
        `  ${prefabName}(B, ${f(x)}, ${f(y)}, ${f(z)}); // ${node.id}`
      ],
      imports: [prefabName],
      geometryCalls: 6,
      colliders: 6
    };
  },

  [NODE_TYPES.DETAIL_SCATTER]: (node) => {
    const { x, y, z } = node.transform;
    const ink = node.tags.ink || 'BK';
    return {
      lines: [
        `  sphere(${f(x)}, ${f(y + 0.3)}, ${f(z)}, 0.35, { ink: ${ink}, noCollide: true }); // ${node.id}/scatter`
      ],
      imports: [],
      geometryCalls: 1,
      colliders: 0
    };
  }
};

/**
 * Compile a Scene Tree AST into a clean JavaScript level builder function string.
 * @param {object} tree - The Scene Tree AST
 * @returns {{ code: string, stats: { geometryCalls: number, colliders: number, nodeCount: number } }}
 */
export function compileSceneTree(tree) {
  const l1 = validateL1Schema(tree);
  if (!l1.valid) {
    throw new Error(`Scene Tree L1 Validation Failed:\n  - ${l1.errors.join('\n  - ')}`);
  }

  const nodes = [...tree.nodes];
  // Deterministic stable ordering: sort by TYPE_RANK, then alphabetically by node id
  nodes.sort((a, b) => {
    const rankA = TYPE_RANK[a.type] || 999;
    const rankB = TYPE_RANK[b.type] || 999;
    if (rankA !== rankB) return rankA - rankB;
    return a.id.localeCompare(b.id);
  });

  const imports = new Set();
  const bodyLines = [];
  let totalGeometryCalls = 0;
  let totalColliders = 0;

  for (const node of nodes) {
    const emitter = EMITTERS[node.type];
    if (emitter) {
      const res = emitter(node);
      for (const line of res.lines) {
        bodyLines.push(line);
      }
      for (const imp of res.imports) {
        if (imp && imp !== 'box' && imp !== 'slab' && imp !== 'stairs' && imp !== 'cyl' && imp !== 'sphere' && imp !== 'ring') {
          imports.add(imp);
        }
      }
      node.cost = {
        geometryCalls: res.geometryCalls,
        colliders: res.colliders
      };
      totalGeometryCalls += res.geometryCalls;
      totalColliders += res.colliders;
    }
  }

  const importArray = Array.from(imports).sort();
  const importHeader = importArray.length > 0
    ? `import { ${importArray.join(', ')} } from '../prefabs.js';\n\n`
    : '';

  const dreamRegionContent = [
    `  ${DREAM_REGION_HEADER}`,
    `  // Generated by Dream Rebuild Compiler (Seed: ${tree.seed}, Strategy: ${tree.strategy})`,
    `  // Total Predicted Cost: ${totalGeometryCalls} geometry calls, ${totalColliders} colliders`,
    '',
    bodyLines.join('\n'),
    '',
    `  ${DREAM_REGION_FOOTER}`
  ].join('\n');

  return {
    code: dreamRegionContent,
    importHeader,
    stats: {
      geometryCalls: totalGeometryCalls,
      colliders: totalColliders,
      nodeCount: nodes.length
    }
  };
}

/**
 * Updates or generates an existing level module file atomically.
 * If the file exists, preserves the HAND REGION and rewrites only the DREAM REGION.
 */
export function injectCompiledLevel(existingCode, tree, levelName = 'custom_map') {
  const { code: dreamCode, importHeader, stats } = compileSceneTree(tree);

  if (!existingCode || !existingCode.includes(HAND_REGION_HEADER)) {
    // Generate full level file boilerplate from scratch
    const fullLevel = [
      `// src/levels/${tree.map}.js`,
      `// Auto-generated level by Dream Rebuild Compiler`,
      `import { INK } from '../render.js';`,
      importHeader,
      `export function buildLevel_${tree.map}(B) {`,
      `  const { box, slab, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, barrel, planes, wedge, hollowCyl, facetedRock, arch } = B;`,
      `  const BL = INK.BLUE, BK = INK.BLACK, OR = INK.ORANGE, GR = INK.GREEN, RD = INK.RED;`,
      '',
      `  ${HAND_REGION_HEADER}`,
      `  // Human level designer geometry goes here and is permanently preserved`,
      '',
      dreamCode,
      `}`,
      ''
    ].join('\n');

    return { fullCode: fullLevel, stats };
  }

  // File exists: atomically replace the DREAM REGION
  const dreamStartIdx = existingCode.indexOf(DREAM_REGION_HEADER);
  const dreamEndIdx = existingCode.indexOf(DREAM_REGION_FOOTER);

  let updatedCode;
  if (dreamStartIdx !== -1 && dreamEndIdx !== -1) {
    const beforeDream = existingCode.slice(0, dreamStartIdx);
    const afterDream = existingCode.slice(dreamEndIdx + DREAM_REGION_FOOTER.length);
    updatedCode = beforeDream + dreamCode + afterDream;
  } else {
    // Append dream region right before the closing function brace
    const lastBraceIdx = existingCode.lastIndexOf('}');
    if (lastBraceIdx !== -1) {
      updatedCode = existingCode.slice(0, lastBraceIdx) + '\n' + dreamCode + '\n' + existingCode.slice(lastBraceIdx);
    } else {
      updatedCode = existingCode + '\n' + dreamCode;
    }
  }

  return { fullCode: updatedCode, stats };
}
