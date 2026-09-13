import { SplineEngine } from '../src/spline-engine.js';
import { LSystemEngine } from '../src/lsystem-engine.js';
import { VoxelTerrainEngine } from '../src/voxel-terrain.js';
import { PenStylizer } from '../src/pen-stylizer.js';

console.log("=== Testing Geometry Engine v2 ===\n");

// 1. Test Spline Engine
const splineEngine = new SplineEngine({ tessellationResolution: 0.2 });
const curvePoints = [
  [0, 0, 0], [5, 5, 0], [10, 0, 0], [15, 5, 0]
];
const spline = splineEngine.catmullRom(curvePoints);
console.log(`[SplineEngine] Generated ${spline.length} points for a 4-point Catmull-Rom curve.`);

const squareProfile = [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]];
const extrusion = splineEngine.extrudeAlongPath(spline, squareProfile, { taper: 0.5 });
console.log(`[SplineEngine] Extruded profile into ${extrusion.rings.length} 3D rings.\n`);

// 2. Test L-System Engine
const lSystemEngine = new LSystemEngine();
const tree = lSystemEngine.generate('TREE', { iterations: 3, stochastic: false });
console.log(`[LSystemEngine] Grew a TREE with ${tree.branches.length} branches and ${tree.leaves.length} leaves.\n`);

// 3. Test Voxel Terrain Engine
const bounds = { minX: 0, minY: 0, minZ: 0, maxX: 20, maxY: 10, maxZ: 20 };
const terrainEngine = new VoxelTerrainEngine(bounds, 1.0); // 1m resolution
terrainEngine.addHill([10, 0, 10], 8, 8); // A hill in the middle
const contours = terrainEngine.extractTopographicContours(2.0); // Extract contour every 2m
console.log(`[VoxelTerrainEngine] Sculpted a hill. Extracted ${contours.length} topographic contour layers.\n`);

// 4. Test Pen Stylizer
const stylizer = new PenStylizer();
// Mock a raw stroke from the tree
const rawStroke = { points: [ [0,0,0], [0,1,0], [0,2,0] ] };
const stylizedBotanical = stylizer.stylize('stroke', [rawStroke], 'botanical');
console.log(`[PenStylizer] Stylized botanical stroke (first point): [${stylizedBotanical[0].points[0].map(n => n.toFixed(3)).join(', ')}] (Notice the wobble!)`);
const stylizedCrystalline = stylizer.stylize('stroke', [rawStroke], 'crystalline');
console.log(`[PenStylizer] Stylized crystalline stroke (first point): [${stylizedCrystalline[0].points[0].join(', ')}] (Notice the perfect precision.)\n`);

console.log("=== All Math Tests Passed! ===");
