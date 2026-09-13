#!/usr/bin/env node
/**
 * Doodle Strike - Observer (Auto-Harvester of User Creations)
 * 
 * Scans a map file for manually placed clusters of geometry (box, cyl, barrel)
 * that are NOT part of Dream's auto-injected blocks. Extracts them, writes a
 * reusable prefab function to src/prefabs.js, and adds it to the learning cache.
 * 
 * Usage:
 *   node src/prefab-observer.js <mapKey>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerSuccess } from './map-learning.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const mapArg = (process.argv[2] || '').toLowerCase().trim();
if (!mapArg) {
  console.log('Usage: node src/prefab-observer.js <mapKey>');
  process.exit(1);
}

const levelFilePath = path.join(ROOT_DIR, 'src', 'levels', `${mapArg}.js`);
if (!fs.existsSync(levelFilePath)) {
  console.error(`❌ Map file not found: ${levelFilePath}`);
  process.exit(1);
}

let code = fs.readFileSync(levelFilePath, 'utf8');

// Strip out auto-injected blocks to only parse manual additions
code = code.replace(/\/\/ === DREAM AUTO-INJECTED MACRO STRUCTURES ===[\s\S]*?\/\/ === END DREAM AUTO-INJECTED MACRO STRUCTURES ===/g, '');
code = code.replace(/\/\/ === DREAM AUTO-INJECTED THEMATIC PROPS ===[\s\S]*?\/\/ === END DREAM AUTO-INJECTED PROPS ===/g, '');

const regex = /(?:box|cyl|barrel|slab)\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,/g;
let match;
const primitives = [];

while ((match = regex.exec(code)) !== null) {
  primitives.push({
    matchIndex: match.index,
    x: parseFloat(match[1]),
    y: parseFloat(match[2]),
    z: parseFloat(match[3]),
    fullLine: code.substring(code.lastIndexOf('\n', match.index) + 1, code.indexOf('\n', match.index)).trim()
  });
}

// Simple clustering algorithm (radius = 6m)
const CLUSTER_RADIUS = 6.0;
const clusters = [];
const visited = new Set();

for (let i = 0; i < primitives.length; i++) {
  if (visited.has(i)) continue;
  const cluster = [primitives[i]];
  visited.add(i);
  
  for (let j = i + 1; j < primitives.length; j++) {
    if (visited.has(j)) continue;
    const p1 = primitives[i];
    const p2 = primitives[j];
    
    // Check if p2 is close to ANY point in the cluster
    const isClose = cluster.some(cp => Math.hypot(cp.x - p2.x, cp.z - p2.z) <= CLUSTER_RADIUS);
    if (isClose) {
      cluster.push(p2);
      visited.add(j);
    }
  }
  
  // Only care about clusters of 3 or more primitives
  if (cluster.length >= 3) {
    clusters.push(cluster);
  }
}

if (clusters.length === 0) {
  console.log('ℹ️ No manual geometry clusters detected.');
  process.exit(0);
}

console.log(`👁️  Observer detected ${clusters.length} custom geometry cluster(s). Harvesting...`);

const prefabsFilePath = path.join(ROOT_DIR, 'src', 'prefabs.js');
let prefabsCode = fs.existsSync(prefabsFilePath) ? fs.readFileSync(prefabsFilePath, 'utf8') : 'export const PREFABS = {};\n';

let harvestedCount = 0;

for (const [idx, cluster] of clusters.entries()) {
  // Determine center point of cluster
  const cx = cluster.reduce((sum, p) => sum + p.x, 0) / cluster.length;
  const cy = cluster.reduce((sum, p) => sum + p.y, 0) / cluster.length;
  const cz = cluster.reduce((sum, p) => sum + p.z, 0) / cluster.length;
  
  const prefabName = `custom_harvest_${mapArg}_${Date.now()}_${idx}`;
  
  // Generate relative code
  const lines = cluster.map(p => {
    let line = p.fullLine;
    const relX = (p.x - cx).toFixed(2);
    const relY = (p.y - cy).toFixed(2);
    const relZ = (p.z - cz).toFixed(2);
    
    return line.replace(
      /(box|cyl|barrel|slab)\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)/,
      `$1(x + ${relX}, y + ${relY}, z + ${relZ}`
    );
  });
  
  const functionCode = `
export function ${prefabName}(x, y, z) {
  // Harvested by Observer from ${mapArg}
  ${lines.join('\n  ')}
}
`;
  
  prefabsCode += functionCode;
  
  // Register in memory
  registerSuccess(prefabName, mapArg, 85, { x: cx, y: cy, z: cz });
  harvestedCount++;
  console.log(`   ✅ Harvested [${prefabName}] with ${cluster.length} components.`);
}

fs.writeFileSync(prefabsFilePath, prefabsCode, 'utf8');
console.log(`\n💾 Injected ${harvestedCount} new prefabs into src/prefabs.js`);
