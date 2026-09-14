#!/usr/bin/env node
// src/dream-mutator.js
// Brain 1: Best-of-N Mutation Search Engine for Dream (File 16 Section 2)
// Optimizes map layouts via deterministic simulated annealing with ZERO LLM API cost.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildMapFromRecipe, validateRecipeSchema } from './map-recipe.js';
import { runDreamVerificationSuite } from './verify-suite.js';
import { createRNG, hashSeed } from './rebuild/prng.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

/**
 * Mutates a candidate recipe along one random architectural axis (File 16 Section 2).
 */
export function mutateRecipe(baseRecipe, rng) {
  const recipe = JSON.parse(JSON.stringify(baseRecipe));
  const mutationType = Math.floor(rng() * 5);

  switch (mutationType) {
    case 0:
      // Jitter a sector center by 1-3m
      if (recipe.sectors && recipe.sectors.length > 0) {
        const sec = recipe.sectors[Math.floor(rng() * recipe.sectors.length)];
        if (sec.c) {
          sec.c[0] += (rng() - 0.5) * 4.0;
          sec.c[1] += (rng() - 0.5) * 4.0;
        }
      }
      break;

    case 1:
      // Jitter prop count or radius within schema limits
      if (recipe.sectors && recipe.sectors.length > 0) {
        const sec = recipe.sectors[Math.floor(rng() * recipe.sectors.length)];
        if (sec.props && sec.props.length > 0) {
          const prop = sec.props[Math.floor(rng() * sec.props.length)];
          if (prop.n !== undefined) {
            prop.n = Math.max(1, Math.min(8, prop.n + (rng() > 0.5 ? 1 : -1)));
          }
        }
      }
      break;

    case 2:
      // Jitter seed for procedural organic variation
      recipe.seed = (recipe.seed + Math.floor(rng() * 1000) + 1) % 100000;
      break;

    case 3:
      // Add or adjust grapple chain apex sag
      if (recipe.vertical?.grappleChains?.length > 0) {
        const chain = recipe.vertical.grappleChains[Math.floor(rng() * recipe.vertical.grappleChains.length)];
        if (chain.from && chain.to) {
          chain.from[1] = Math.max(12, chain.from[1] + (rng() - 0.5) * 2.0);
          chain.to[1] = Math.max(12, chain.to[1] + (rng() - 0.5) * 2.0);
        }
      }
      break;

    case 4:
      // Jitter clearing radius
      if (recipe.ground?.clearing) {
        recipe.ground.clearing.r = Math.max(6.0, Math.min(11.0, recipe.ground.clearing.r + (rng() - 0.5) * 2.0));
      }
      break;
  }

  return recipe;
}

/**
 * Runs Best-of-N Candidate Generation and Mutation Search (File 16).
 */
export function runBestOfNSearch(baseRecipe, N = 8, iterations = 10, initialSeed = 42) {
  const rngSuite = createRNG(initialSeed);
  const rng = rngSuite.next;

  let champion = {
    recipe: baseRecipe,
    score: evaluateRecipe(baseRecipe),
    iteration: 0
  };

  console.log(`\n🧠 Starting Brain 1 Mutation Search: N=${N} candidates, ${iterations} iterations`);
  console.log(`   Baseline Score: ${champion.score.fitness} / 100 (Violations: ${champion.score.violations.length})`);

  for (let cand = 1; cand <= N; cand++) {
    let current = mutateRecipe(baseRecipe, rng);
    let currentScore = evaluateRecipe(current);

    // Simulated annealing inner loop
    for (let iter = 1; iter <= iterations; iter++) {
      const candidate = mutateRecipe(current, rng);
      const score = evaluateRecipe(candidate);

      // Prefer fewer violations, then higher score
      const isBetter =
        score.violations.length < currentScore.violations.length ||
        (score.violations.length === currentScore.violations.length && score.fitness > currentScore.fitness);

      if (isBetter) {
        current = candidate;
        currentScore = score;
      }
    }

    const beatsChampion =
      currentScore.violations.length < champion.score.violations.length ||
      (currentScore.violations.length === champion.score.violations.length && currentScore.fitness > champion.score.fitness);

    if (beatsChampion) {
      champion = {
        recipe: current,
        score: currentScore,
        candidateIndex: cand
      };
      console.log(`   🏆 New Champion found on Candidate ${cand}: Fitness ${champion.score.fitness}/100`);
    }
  }

  return champion;
}

function evaluateRecipe(recipe) {
  const colliders = [];
  const rings = [];
  const spawns = [];
  const snipers = [];
  const pickups = [];
  const animated = [];

  const B = {
    L: { key: recipe.id, colliders, rings, spawns, snipers, pickups, animated, bounds: { minX: -55, maxX: 55, minZ: -55, maxZ: 55 } },
    scene: { add() {} },
    box(x, y, z, w, h, d, o = {}) { if (!o.noCollide) colliders.push({ x, y, z, w, h, d, ...o }); },
    slab(x1, z1, x2, z2, y, h, o = {}) { if (!o.noCollide) colliders.push({ x: (x1 + x2) / 2, y, z: (z1 + z2) / 2, w: Math.abs(x2 - x1), h, d: Math.abs(z2 - z1), ...o }); },
    cyl(x, y, z, r, h, o = {}) { if (!o.noCollide) colliders.push({ x, y, z, w: r * 2, h, d: r * 2, ...o }); },
    barrel(x, y, z, r, h, o = {}) { if (!o.noCollide) colliders.push({ x, y, z, w: r * 2, h, d: r * 2, ...o }); },
    sphere() {},
    cone() {},
    arch(x, y, z, s, h, d, o = {}) { if (!o.noCollide) colliders.push({ x, y, z, w: s, h, d, ...o }); },
    stairs(x, y, z, dir, count, width, o = {}) { for (let i = 0; i < count; i++) colliders.push({ x, y: y + i * 0.28, z, w: width, h: 0.28, d: 0.45, tag: 'stairs' }); },
    facetedRock(x, y, z, w, h, d, o = {}) { if (!o.noCollide) colliders.push({ x, y, z, w, h, d, ...o }); },
    ring(x, y, z, axis = 'y') { rings.push({ x, y, z, axis }); },
    rail(x1, z1, x2, z2, y, o = {}) { if (!o.noCollide) colliders.push({ x: (x1 + x2) / 2, y, z: (z1 + z2) / 2, w: Math.abs(x2 - x1) || 0.3, h: 1.0, d: Math.abs(z2 - z1) || 0.3, tag: 'rail', ...o }); },
    wedge(x, y, z, w, h, d, o = {}) { if (!o.noCollide) colliders.push({ x, y, z, w, h, d, tag: 'wedge', ...o }); },
    spawn(x, y, z) { spawns.push({ x, y, z }); },
    sniper(x, y, z) { snipers.push({ x, y, z }); },
    pickup(x, y, z) { pickups.push({ x, y, z }); },
    planes() {},
    collider(x, y, z, w, h, d, o = {}) { colliders.push({ x, y, z, w, h, d, ...o }); }
  };

  const { L, report } = buildMapFromRecipe(B, recipe);
  const audit = runDreamVerificationSuite(L, colliders);

  return {
    fitness: audit.score,
    violations: report.violations || [],
    prefabsPlaced: report.prefabsPlaced,
    collidersCount: colliders.length
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let rawArg = process.argv[2] || 'colossal_canopy';
  let recipePath = rawArg;
  if (!fs.existsSync(recipePath)) {
    const candidate = path.join(ROOT_DIR, 'recipes', `${rawArg}.json`);
    if (fs.existsSync(candidate)) recipePath = candidate;
    else if (fs.existsSync(path.join(ROOT_DIR, 'recipes', rawArg))) recipePath = path.join(ROOT_DIR, 'recipes', rawArg);
  }

  const base = JSON.parse(fs.readFileSync(recipePath, 'utf8'));
  const res = runBestOfNSearch(base, 4, 5);
  console.log(`\n🎉 Best-of-N Mutation Search Complete! Final Score: ${res.score.fitness} / 100`);
  if (res.score.fitness >= (base.fitness || 0) && res.recipe) {
    fs.writeFileSync(recipePath, JSON.stringify(res.recipe, null, 2), 'utf8');
  }
}
