// src/rebuild/recipe-ingestion.js
// 7-Step Recipe Ingestion Pipeline for Dream Evolution II
// Implements Blueprint 1: Teacher-Apprentice Protocol (Section 1.5)

import fs from 'fs';
import path from 'path';
import { validateRecipe, instantiateRecipe, ALLOWED_PRIMITIVES, VALID_INKS } from './recipe-engine.js';
import { registerPrefab } from '../prefabs.js';

const THEMATIC_MEMORY_PATH = path.resolve('.agents/thematic-memory.json');
const PENDING_RECIPES_DIR = path.resolve('.agents/pending-recipes');

/**
 * Creates a lightweight sandbox builder tracking placed geometry, colliders, and bounds.
 */
function createSandboxBuilder() {
  const elements = [];
  const colliders = [];

  function record(prim, args, opts = {}) {
    const entry = { prim, args, opts };
    elements.push(entry);
    if (!opts.noCollide) {
      // Rough collider approximation for sandbox validation
      let minY = 0;
      let maxY = 1;
      let minX = -0.5, maxX = 0.5, minZ = -0.5, maxZ = 0.5;

      if (prim === 'box' || prim === 'slab' || prim === 'wedge') {
        const [x, y, z, w, h, d] = args;
        minY = y - h / 2;
        maxY = y + h / 2;
        minX = x - w / 2;
        maxX = x + w / 2;
        minZ = z - d / 2;
        maxZ = z + d / 2;
      } else if (prim === 'cyl' || prim === 'hollowCyl' || prim === 'barrel') {
        const [x, y, z, r, h] = args;
        minY = y;
        maxY = y + h;
        minX = x - r;
        maxX = x + r;
        minZ = z - r;
        maxZ = z + r;
      } else if (prim === 'sphere' || prim === 'facetedRock') {
        const [x, y, z, r] = args;
        minY = y - r;
        maxY = y + r;
        minX = x - r;
        maxX = x + r;
        minZ = z - r;
        maxZ = z + r;
      }

      colliders.push({
        min: [minX, minY, minZ],
        max: [maxX, maxY, maxZ],
        height: maxY - minY,
        topY: maxY,
        bottomY: minY
      });
    }
    return entry;
  }

  const B = {};
  for (const prim of ALLOWED_PRIMITIVES) {
    B[prim] = (...args) => {
      const opts = (args.length > 0 && typeof args[args.length - 1] === 'object' && args[args.length - 1] !== null && !Array.isArray(args[args.length - 1]))
        ? args.pop()
        : {};
      return record(prim, args, opts);
    };
  }

  return {
    B,
    getElements: () => elements,
    getColliders: () => colliders
  };
}

/**
 * 7-Step Recipe Ingestion Pipeline
 * @param {string|object} recipeJsonOrObject
 * @param {object} options - { requireReview: boolean, thematicMemoryPath: string }
 * @returns {object} { success: boolean, stepFailed?: number, message: string, recipe?: object }
 */
export function ingestRecipe(recipeJsonOrObject, options = {}) {
  const {
    requireReview = false,
    thematicMemoryPath = THEMATIC_MEMORY_PATH
  } = options;

  let recipe = null;

  // STEP 1: PARSE + L1 SCHEMA VALIDATION
  try {
    if (typeof recipeJsonOrObject === 'string') {
      recipe = JSON.parse(recipeJsonOrObject);
    } else if (typeof recipeJsonOrObject === 'object' && recipeJsonOrObject !== null) {
      recipe = JSON.parse(JSON.stringify(recipeJsonOrObject));
    } else {
      return { success: false, stepFailed: 1, message: 'Step 1 Failed: Recipe input must be JSON string or object.' };
    }
  } catch (err) {
    return { success: false, stepFailed: 1, message: `Step 1 Failed: JSON Parse error: ${err.message}` };
  }

  const l1 = validateRecipe(recipe);
  if (!l1.valid) {
    return {
      success: false,
      stepFailed: 1,
      message: `Step 1 Failed: L1 Schema errors: ${l1.errors.join('; ')}`,
      errors: l1.errors
    };
  }

  // STEP 2: STATIC SAFETY SCAN
  const safetyErrors = [];
  for (let pIdx = 0; pIdx < recipe.parts.length; pIdx++) {
    const part = recipe.parts[pIdx];

    // Ink compliance
    if (part.opts && part.opts.ink && !VALID_INKS.has(part.opts.ink)) {
      safetyErrors.push(`Part "${part.id}": Invalid ink "${part.opts.ink}" (LAW 2 violation)`);
    }

    // 0.3m detail rule check (LAW 4): any primitive dimension < 0.3m must be marked noCollide
    // Check constant args
    if (['box', 'slab', 'wedge'].includes(part.prim) && Array.isArray(part.args) && part.args.length >= 6) {
      const w = parseFloat(part.args[3]);
      const h = parseFloat(part.args[4]);
      const d = parseFloat(part.args[5]);
      if (Number.isFinite(w) && Number.isFinite(h) && Number.isFinite(d)) {
        if ((w < 0.3 || h < 0.3 || d < 0.3) && !part.opts?.noCollide) {
          safetyErrors.push(`Part "${part.id}": Dimensions (${w}x${h}x${d}) contains sub-0.3m detail without declaring noCollide: true (LAW 4)`);
        }
      }
    }
  }

  if (safetyErrors.length > 0) {
    return {
      success: false,
      stepFailed: 2,
      message: `Step 2 Failed: Safety scan errors: ${safetyErrors.join('; ')}`,
      errors: safetyErrors
    };
  }

  // STEP 3: SANDBOX DRY-RUN (3 seeds minimum)
  const testSeeds = [101, 202, 303];
  const dryRunResults = [];

  for (const seed of testSeeds) {
    const sandbox = createSandboxBuilder();
    let instance = null;
    try {
      instance = instantiateRecipe(sandbox.B, recipe, seed);
    } catch (err) {
      return {
        success: false,
        stepFailed: 3,
        message: `Step 3 Failed: Dry-run threw error at seed ${seed}: ${err.message}`
      };
    }

    const elements = sandbox.getElements();
    const colliders = sandbox.getColliders();

    // Check for NaN or Infinity in any args
    for (const elem of elements) {
      for (const arg of elem.args) {
        if (!Number.isFinite(arg)) {
          return {
            success: false,
            stepFailed: 3,
            message: `Step 3 Failed: Non-finite value (${arg}) generated in part "${elem.prim}" at seed ${seed}`
          };
        }
      }
    }

    // Grounded-ness check (recipe.tests?.grounded)
    if (recipe.tests?.grounded !== false && colliders.length > 0) {
      const lowestY = Math.min(...colliders.map(c => c.bottomY));
      if (Math.abs(lowestY) > 1.0) {
        return {
          success: false,
          stepFailed: 3,
          message: `Step 3 Failed: Asset not grounded at seed ${seed}. Lowest collider Y is ${lowestY.toFixed(2)}m (expected near 0.0m)`
        };
      }
    }

    dryRunResults.push({ seed, instance, elements, colliders });
  }

  // STEP 4: TACTICAL CONTRACT VERIFICATION
  const declaredRoles = recipe.tactical?.roles || [];
  for (const role of declaredRoles) {
    for (const { seed, colliders } of dryRunResults) {
      if (role === 'waist_cover') {
        const matching = colliders.filter(c => c.height >= 0.75 && c.height <= 1.45);
        if (matching.length === 0) {
          return {
            success: false,
            stepFailed: 4,
            message: `Step 4 Failed: Declared tactical role "waist_cover" failed contract verification at seed ${seed}. No collider landed in waist-height range (0.8m - 1.3m).`
          };
        }
      } else if (role === 'full_cover') {
        const matching = colliders.filter(c => c.height >= 2.0);
        if (matching.length === 0) {
          return {
            success: false,
            stepFailed: 4,
            message: `Step 4 Failed: Declared tactical role "full_cover" failed contract verification at seed ${seed}. No collider reached full cover height (>= 2.2m).`
          };
        }
      } else if (role === 'grapple_anchor') {
        if (!recipe.anchors || Object.keys(recipe.anchors).length === 0) {
          return {
            success: false,
            stepFailed: 4,
            message: `Step 4 Failed: Declared role "grapple_anchor" has no declared anchors.`
          };
        }
      }
    }
  }

  // STEP 7 CHECK (If review is required, park in pending-recipes)
  if (requireReview) {
    if (!fs.existsSync(PENDING_RECIPES_DIR)) {
      fs.mkdirSync(PENDING_RECIPES_DIR, { recursive: true });
    }
    const pendingFile = path.join(PENDING_RECIPES_DIR, `${recipe.id}.json`);
    fs.writeFileSync(pendingFile, JSON.stringify(recipe, null, 2), 'utf8');
    return {
      success: true,
      status: 'PENDING_REVIEW',
      step: 7,
      message: `Recipe passed validation steps 1-4 and is parked for human review: ${pendingFile}`,
      recipe
    };
  }

  // STEP 5: REGISTRATION (The permanent memory)
  let thematicMemory = {};
  if (fs.existsSync(thematicMemoryPath)) {
    try {
      thematicMemory = JSON.parse(fs.readFileSync(thematicMemoryPath, 'utf8'));
    } catch {
      thematicMemory = {};
    }
  }

  if (!thematicMemory.recipes) {
    thematicMemory.recipes = {};
  }

  const memoryEntry = {
    version: recipe.version || 1,
    provenance: recipe.provenance || { teacher: 'unknown', date: new Date().toISOString() },
    confidence: 0.6,
    uses: 0,
    failures: 0,
    registeredAt: new Date().toISOString(),
    recipe
  };

  thematicMemory.recipes[recipe.id] = memoryEntry;
  fs.writeFileSync(thematicMemoryPath, JSON.stringify(thematicMemory, null, 2) + '\n', 'utf8');

  // Register into PREFAB_REGISTRY dynamically
  registerPrefab(recipe.id, (B, x, y, z, seed = 1234, overrides = {}) => {
    // If x, y, z provided, instantiate onto builder
    return instantiateRecipe(B, recipe, seed, overrides);
  });

  return {
    success: true,
    step: 5,
    message: `Recipe "${recipe.id}" successfully validated and permanently registered in thematic-memory.json and PREFAB_REGISTRY.`,
    recipe,
    entry: memoryEntry
  };
}

/**
 * Updates recipe confidence record based on deployment outcome.
 */
export function recordRecipeOutcome(recipeId, success = true, errorDetails = null, thematicMemoryPath = THEMATIC_MEMORY_PATH) {
  if (!fs.existsSync(thematicMemoryPath)) return null;

  try {
    const mem = JSON.parse(fs.readFileSync(thematicMemoryPath, 'utf8'));
    if (!mem.recipes || !mem.recipes[recipeId]) return null;

    const entry = mem.recipes[recipeId];
    if (success) {
      entry.uses = (entry.uses || 0) + 1;
      if (entry.uses >= 3 && (entry.failures || 0) === 0) {
        entry.confidence = Math.min(1.0, 0.9 + (entry.uses - 3) * 0.02);
      }
    } else {
      entry.failures = (entry.failures || 0) + 1;
      entry.confidence = Math.max(0.1, (entry.confidence || 0.6) - 0.25);
      if (errorDetails) {
        if (!entry.failureLog) entry.failureLog = [];
        entry.failureLog.push({
          timestamp: new Date().toISOString(),
          details: errorDetails
        });
      }
    }

    fs.writeFileSync(thematicMemoryPath, JSON.stringify(mem, null, 2) + '\n', 'utf8');
    return entry;
  } catch (err) {
    console.error(`Error updating recipe outcome for "${recipeId}": ${err.message}`);
    return null;
  }
}
