// src/rebuild/prng.js
// 32-bit Seeded PRNG and Deterministic Random Utilities for Dream Rebuild
// Eliminates Math.random() so every generated map is reproducible by seed.

/**
 * 32-bit Mulberry32 PRNG generator.
 * Fast, high-quality distribution for procedural generation.
 * @param {number} a - 32-bit integer seed
 * @returns {() => number} Returns pseudo-random float in [0, 1)
 */
export function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministic string + index hash to 32-bit unsigned integer.
 * @param {string} str - Identifier (e.g. mapKey)
 * @param {number} [runIndex=0] - Run iteration index
 * @returns {number} 32-bit unsigned integer seed
 */
export function hashSeed(str, runIndex = 0) {
  const combined = `${str}:${runIndex}`;
  let hash = 2166136261;
  for (let i = 0; i < combined.length; i++) {
    hash ^= combined.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Create a seeded RNG suite for a generation run.
 * @param {string|number} seedOrKey - Map key or explicit numerical seed
 * @param {number} [runIndex=0] - Run index if string key is provided
 */
export function createRNG(seedOrKey, runIndex = 0) {
  const seed = typeof seedOrKey === 'number' ? (seedOrKey >>> 0) : hashSeed(String(seedOrKey), runIndex);
  const nextFloat = mulberry32(seed);

  return {
    seed,
    /** Float in [0, 1) */
    next: () => nextFloat(),
    /** Float in [min, max) */
    randFloat: (min, max) => min + nextFloat() * (max - min),
    /** Integer in [min, max] inclusive */
    randInt: (min, max) => Math.floor(min + nextFloat() * (max - min + 1)),
    /** Boolean with probability `p` of being true */
    randBool: (p = 0.5) => nextFloat() < p,
    /** Pick random item from array */
    randChoice: (arr) => {
      if (!arr || arr.length === 0) return null;
      return arr[Math.floor(nextFloat() * arr.length)];
    },
    /** Return new shuffled array */
    randShuffle: (arr) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(nextFloat() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }
  };
}
