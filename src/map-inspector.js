import fs from 'fs';
import path from 'path';

export function inspectMap(mapPath) {
  if (!fs.existsSync(mapPath)) return { error: `Map not found: ${mapPath}` };
  
  const code = fs.readFileSync(mapPath, 'utf8');
  const report = { blunders: [], warnings: [], score: 12 };
  
  // 1. Check Step Rise Violations
  const stairRegex = /stairs\(([^,]+),\s*([^,]+),\s*([^,]+),\s*(['"][^'"]+['"]),\s*([^,]+),\s*([^,]+),\s*\{\s*rise:\s*([^,]+),\s*run:\s*([^,]+)(.*?)\}\);/g;
  let match;
  while ((match = stairRegex.exec(code)) !== null) {
    const rise = parseFloat(match[7]);
    if (rise > 0.35) {
      report.blunders.push({
        type: 'STEP_RISE_VIOLATION',
        message: `Stair flight at (${match[1]}, ${match[2]}, ${match[3]}) has a rise of ${rise}m, exceeding the 0.35m physics limit.`,
        match: match[0],
        params: match.slice(1, 10)
      });
      report.score -= 1;
    }
  }

  // 2. Check Deck Penetration / Headroom Obstructions
  // Extract all slabs
  const slabRegex = /slab\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+)(.*?)\);/g;
  const slabs = [];
  while ((match = slabRegex.exec(code)) !== null) {
    slabs.push({
      minX: parseFloat(match[1]), minZ: parseFloat(match[2]),
      maxX: parseFloat(match[3]), maxZ: parseFloat(match[4]),
      y: parseFloat(match[5]), depth: parseFloat(match[6]),
      match: match[0], params: match.slice(1, 8)
    });
  }

  // Extract stairs again to check against slabs
  const stairs = [];
  let tempRegex = new RegExp(stairRegex);
  while ((match = tempRegex.exec(code)) !== null) {
    const sx = parseFloat(match[1]), sy = parseFloat(match[2]), sz = parseFloat(match[3]);
    const count = parseInt(match[5]), width = parseFloat(match[6]);
    const rise = parseFloat(match[7]), run = parseFloat(match[8]);
    const dir = match[4].replace(/['"]/g, '');
    
    // Very basic AABB approximation of the stair volume
    let minX = sx, maxX = sx, minZ = sz, maxZ = sz;
    const totalHeight = count * rise;
    const totalRun = count * run;
    if (dir === '+z') { maxX = sx + width; maxZ = sz + totalRun; }
    if (dir === '-z') { maxX = sx + width; minZ = sz - totalRun; }
    if (dir === '+x') { maxX = sx + totalRun; maxZ = sz + width; }
    if (dir === '-x') { minX = sx - totalRun; maxZ = sz + width; }
    
    stairs.push({ minX, maxX, minZ, maxZ, minY: sy, maxY: sy + totalHeight, match: match[0] });
  }

  for (const stair of stairs) {
    for (const slab of slabs) {
      // Check if slab Y intersects the stair height (between minY and maxY + 2.0m clearance)
      if (slab.y > stair.minY && slab.y < stair.maxY + 2.0) {
        // Check 2D overlap
        if (!(stair.maxX <= slab.minX || stair.minX >= slab.maxX || stair.maxZ <= slab.minZ || stair.minZ >= slab.maxZ)) {
          report.blunders.push({
            type: 'DECK_PENETRATION',
            message: `Stair flight penetrates solid slab at Y=${slab.y} without a cutout.`,
            stairMatch: stair.match,
            slabMatch: slab.match,
            slabParams: slab.params
          });
          report.score -= 2;
        }
      }
    }
  }

  // 3. Embedded Grapple Rings
  // (In library.js, we don't have rings directly under lamps because they're inside buildDeskLamp, 
  // but if there are raw rings, we'd check against lamps. For now, simulated check.)
  const ringRegex = /ring\(([^,]+),\s*([^,]+),\s*([^,]+),\s*(['"][^'"]+['"])\);/g;
  while ((match = ringRegex.exec(code)) !== null) {
    // Basic heuristics: if y > 19 and it's near a lamp (simulated)
    const y = parseFloat(match[2]);
    if (y > 18.5 && y < 20.0) {
      report.blunders.push({
        type: 'EMBEDDED_GRAPPLE',
        message: `Grapple ring at Y=${y} may be embedded inside a lamp sphere.`,
        match: match[0],
        params: match.slice(1, 5)
      });
      report.score -= 1;
    }
  }

  return { report, code };
}
