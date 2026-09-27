import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as THREE from 'three';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { buildLevel, LEVELS } from '../src/level.js';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const mapKey = (process.argv[2] || 'classroom').toLowerCase();
const mapDef = LEVELS.find(m => m.key === mapKey);

console.log(`\n🗺️  Exporting map [${mapKey.toUpperCase()}] for Blender...`);

const scene = new THREE.Scene();
const colliders = [];
const mockWorld = {
  addBox: (min, max, opts) => {
    const col = { min, max, opts, size: { x: max.x - min.x, y: max.y - min.y, z: max.z - min.z } };
    colliders.push(col);
    return col;
  },
  finalize: () => {}
};

let levelObj;
try {
  levelObj = buildLevel(scene, mockWorld, mapKey);
} catch (err) {
  console.error(`❌ Failed to build level [${mapKey}]:`, err);
  process.exit(1);
}

// 1. Export OBJ
const exporter = new OBJExporter();
const objData = exporter.parse(scene);
const objPath = path.resolve(ROOT_DIR, 'assets', 'models', `${mapKey}.obj`);
fs.mkdirSync(path.dirname(objPath), { recursive: true });
fs.writeFileSync(objPath, objData, 'utf-8');
console.log(`✅ OBJ exported: ${objPath} (${(objData.length / 1024 / 1024).toFixed(2)} MB)`);

// 2. Export Metadata
const meta = {
  key: mapKey,
  name: mapDef?.name || mapKey,
  bounds: levelObj.bounds || { minX: -55, maxX: 55, minZ: -55, maxZ: 55 },
  rings: (levelObj.rings || []).map(r => ({ x: r.x, y: r.y, z: r.z })),
  spawns: (levelObj.spawns || []).map(s => ({ x: s.x, y: s.y, z: s.z })),
  snipers: (levelObj.snipers || []).map(s => ({ x: s.x, y: s.y, z: s.z })),
  pickups: (levelObj.pickups || []).map(p => ({ x: p.x, y: p.y, z: p.z })),
  playerStart: levelObj.playerStart ? { x: levelObj.playerStart.x, y: levelObj.playerStart.y, z: levelObj.playerStart.z } : { x: 0, y: 0.5, z: 42 }
};

const metaPath = path.resolve(ROOT_DIR, 'assets', 'models', `${mapKey}_meta.json`);
fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf-8');
console.log(`✅ Metadata exported: ${metaPath}`);

// 3. Trigger Blender Bridge Python loader
const pythonLoader = path.resolve(ROOT_DIR, 'tools', 'import_map_blender.py');
try {
  execSync(`python "${pythonLoader}" "${mapKey}"`, { stdio: 'inherit' });
} catch (err) {
  console.error('❌ Error executing Blender import script:', err);
  process.exit(1);
}
