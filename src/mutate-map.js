/**
 * Doodle Strike - Genetic Mutation Engine
 * 
 * Takes a high-scoring map "DNA" from the evolution cache and applies
 * random genetic variance to its properties to breed a new generation.
 */

import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), '.agents', 'evolution-cache.json');

/**
 * Loads the best available DNA for a given map category.
 */
export function getBestDNA(theme) {
  if (!fs.existsSync(CACHE_FILE)) return null;
  try {
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    const candidates = cache.filter(c => c.theme === theme || !theme);
    if (candidates.length === 0) return null;
    
    // Sort by score descending
    candidates.sort((a, b) => b.score - a.score);
    return candidates[0];
  } catch (e) {
    return null;
  }
}

/**
 * Applies a 10% random mutation to the DNA.
 */
export function mutateDNA(dna) {
  const mutant = JSON.parse(JSON.stringify(dna));
  mutant.generation = (mutant.generation || 1) + 1;
  mutant.parentScore = dna.score;
  mutant.score = 0; // Needs to be re-evaluated
  
  console.log(`🧬 Mutating [Gen ${dna.generation || 1}] DNA (Score: ${dna.score}) -> [Gen ${mutant.generation}]`);

  // Mutate Spawns (shift them by 1-2 meters randomly)
  if (mutant.spawns && mutant.spawns.length > 0) {
    mutant.spawns.forEach(sp => {
      if (Math.random() < 0.3) { // 30% chance to mutate a given spawn
        sp.x += (Math.random() * 4 - 2);
        sp.z += (Math.random() * 4 - 2);
        console.log(`   - Mutated spawn coordinate to (${sp.x.toFixed(1)}, ${sp.z.toFixed(1)})`);
      }
    });
  }

  // Mutate Macro Placements (Swap a prefab for another, or shift position)
  if (mutant.macros && mutant.macros.length > 0) {
    mutant.macros.forEach(macro => {
      if (Math.random() < 0.2) { // 20% chance to mutate macro
        macro.x += (Math.random() * 6 - 3);
        macro.z += (Math.random() * 6 - 3);
        console.log(`   - Shifted macro structure at (${macro.x.toFixed(1)}, ${macro.z.toFixed(1)})`);
      }
    });
  }
  
  // Mutate Cover Density
  if (mutant.coverDensity) {
    mutant.coverDensity += (Math.random() * 0.2 - 0.1);
    mutant.coverDensity = Math.max(0.1, Math.min(1.0, mutant.coverDensity));
  } else {
    mutant.coverDensity = 0.5 + (Math.random() * 0.2 - 0.1);
  }

  return mutant;
}
