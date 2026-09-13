import fs from 'fs';
import { inspectMap } from './map-inspector.js';

export function healMap(mapPath) {
  console.log(`\n🏥 DREAM HEALER: Analyzing ${mapPath}...`);
  let { report, code } = inspectMap(mapPath);
  
  if (report.blunders.length === 0) {
    console.log(`✅ Map is structurally sound. No physics blunders found.`);
    return code;
  }

  console.log(`⚠️ Detected ${report.blunders.length} architectural blunders. Initiating auto-heal...`);
  
  let modifications = 0;

  // Fix Step Rise Violations
  const riseBlunders = report.blunders.filter(b => b.type === 'STEP_RISE_VIOLATION');
  for (const b of riseBlunders) {
    const [sx, sy, sz, dir, countStr, widthStr, riseStr, runStr, rest] = b.params;
    const oldRise = parseFloat(riseStr);
    const oldCount = parseInt(countStr);
    const totalHeight = oldRise * oldCount;
    
    // Recalculate to meet <= 0.35m
    const newRise = 0.34;
    const newCount = Math.ceil(totalHeight / newRise);
    // Adjust run to preserve total horizontal length if possible, or just default to 0.5
    const oldRun = parseFloat(runStr);
    const totalRun = oldRun * oldCount;
    const newRun = (totalRun / newCount).toFixed(2);
    
    const newMatch = `stairs(${sx}, ${sy}, ${sz}, ${dir}, ${newCount}, ${widthStr}, { rise: ${newRise}, run: ${newRun}${rest} });`;
    code = code.replace(b.match, `// Dream Heal: Normalized step rise\n  ${newMatch}`);
    modifications++;
  }

  // Fix Deck Penetrations
  const deckBlunders = report.blunders.filter(b => b.type === 'DECK_PENETRATION');
  // Simple heuristic fix for the monolithic library desk penetration:
  for (const b of deckBlunders) {
    const [minX, minZ, maxX, maxZ, y, depth, opts] = b.slabParams;
    // We split the large monolithic slab into 3 pieces (Left, Center, Right) to create stairwells
    if (parseFloat(minX) === -26 && parseFloat(maxX) === 26) {
      const leftSlab = `slab(${minX}, ${minZ}, -4.5, ${maxZ}, ${y}, ${depth}${opts});`;
      const rightSlab = `slab(4.5, ${minZ}, ${maxX}, ${maxZ}, ${y}, ${depth}${opts});`;
      const centerSlab = `slab(-4.5, -12, 4.5, 12, ${y}, ${depth}${opts});`;
      
      const replacement = `// Dream Heal: Split monolithic deck to carve stairwell headroom\n  ${leftSlab}\n  ${rightSlab}\n  ${centerSlab}`;
      code = code.replace(b.slabMatch, replacement);
      modifications++;
    }
  }

  // Fix Embedded Grapple Rings
  const grappleBlunders = report.blunders.filter(b => b.type === 'EMBEDDED_GRAPPLE');
  for (const b of grappleBlunders) {
    const [x, yStr, z, dir] = b.params;
    const newY = (parseFloat(yStr) - 1.5).toFixed(1);
    const newMatch = `ring(${x}, ${newY}, ${z}, ${dir});`;
    code = code.replace(b.match, `// Dream Heal: Lowered embedded ring\n  ${newMatch}`);
    modifications++;
  }

  if (modifications > 0) {
    fs.writeFileSync(mapPath, code, 'utf8');
    console.log(`✅ Dream applied ${modifications} structural geometry fixes!`);
  }
  
  return code;
}
