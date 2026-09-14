// src/rebuild/recipe-engine.js
// Declarative Recipe Engine for Dream Evolution II (Teacher-Apprentice Protocol)
// Implements dream-recipe/1.0 and dream-teach/1.0 with ZERO eval()

import { mulberry32, hashSeed } from './prng.js';

/**
 * Whitelisted primitive types available to recipes.
 */
export const ALLOWED_PRIMITIVES = new Set([
  'box',
  'slab',
  'cyl',
  'sphere',
  'ring',
  'barrel',
  'planes',
  'hollowCyl',
  'wedge',
  'facetedRock',
  'arch'
]);

/**
 * Valid semantic inks (LAW 2)
 */
export const VALID_INKS = new Set(['BL', 'BK', 'OR', 'RED', 'GR']);

/**
 * Mathematical helper functions whitelisted in the expression grammar.
 */
const WHITELISTED_FUNCS = {
  sin: (deg) => Math.sin((deg * Math.PI) / 180),
  cos: (deg) => Math.cos((deg * Math.PI) / 180),
  sqrt: (x) => {
    if (x < 0) throw new Error(`sqrt of negative number: ${x}`);
    return Math.sqrt(x);
  },
  abs: (x) => Math.abs(x),
  min: (...args) => Math.min(...args),
  max: (...args) => Math.max(...args),
  round: (x) => Math.round(x),
  floor: (x) => Math.floor(x),
  clamp: (v, min, max) => Math.min(Math.max(v, min), max)
};

/**
 * Recursive-descent expression tokenizer & parser.
 * Grammar:
 *   expr    := term (('+' | '-') term)*
 *   term    := factor (('*' | '/' | '%') factor)*
 *   factor  := ['-'] (number | '@'param | var | func '(' expr (',' expr)* ')' | '(' expr ')')
 * 
 * Absolutely zero eval(), Function(), or prototype traversal.
 */
export function evaluateExpression(exprInput, scope = {}) {
  if (typeof exprInput === 'number') {
    if (!Number.isFinite(exprInput)) throw new Error(`Non-finite number encountered: ${exprInput}`);
    return exprInput;
  }
  if (typeof exprInput !== 'string') {
    throw new Error(`Expression must be number or string, got ${typeof exprInput}`);
  }

  const str = exprInput.trim();
  if (str === '') throw new Error('Empty expression');

  // Fast path for pure numeric strings
  if (/^-?\d+(\.\d+)?$/.test(str)) {
    const n = parseFloat(str);
    if (!Number.isFinite(n)) throw new Error(`Non-finite number: ${str}`);
    return n;
  }

  // Tokenize
  let pos = 0;
  function peek() {
    while (pos < str.length && /\s/.test(str[pos])) pos++;
    return pos < str.length ? str[pos] : null;
  }

  function readNumber() {
    const start = pos;
    if (str[pos] === '-') pos++;
    while (pos < str.length && /[\d.]/.test(str[pos])) pos++;
    const numStr = str.slice(start, pos);
    const val = parseFloat(numStr);
    if (Number.isNaN(val)) throw new Error(`Invalid number "${numStr}" at pos ${start}`);
    return val;
  }

  function readIdent() {
    const start = pos;
    const isParam = str[pos] === '@';
    if (isParam) pos++;
    while (pos < str.length && /[a-zA-Z0-9_]/.test(str[pos])) pos++;
    const name = str.slice(start, pos);
    return { name, isParam };
  }

  function parseExpr() {
    let left = parseTerm();
    while (true) {
      const p = peek();
      if (p === '+' || p === '-') {
        pos++;
        const right = parseTerm();
        left = p === '+' ? left + right : left - right;
      } else {
        break;
      }
    }
    return left;
  }

  function parseTerm() {
    let left = parseFactor();
    while (true) {
      const p = peek();
      if (p === '*' || p === '/' || p === '%') {
        pos++;
        const right = parseFactor();
        if (p === '*') left = left * right;
        else if (p === '/') {
          if (right === 0) throw new Error('Division by zero in recipe expression');
          left = left / right;
        } else if (p === '%') {
          if (right === 0) throw new Error('Modulo by zero in recipe expression');
          left = left % right;
        }
      } else {
        break;
      }
    }
    return left;
  }

  function parseFactor() {
    const p = peek();
    if (p === null) throw new Error(`Unexpected end of expression at pos ${pos}`);

    // Unary minus
    if (p === '-') {
      pos++;
      return -parseFactor();
    }

    // Parentheses
    if (p === '(') {
      pos++;
      const val = parseExpr();
      if (peek() !== ')') throw new Error(`Expected ')' at pos ${pos}`);
      pos++;
      return val;
    }

    // Number
    if (/[\d.]/.test(p)) {
      return readNumber();
    }

    // Param, variable, or function call
    if (p === '@' || /[a-zA-Z_]/.test(p)) {
      const { name, isParam } = readIdent();
      const nextChar = peek();

      if (nextChar === '(') {
        // Function call
        if (isParam) throw new Error(`Parameter cannot be invoked as function: ${name}`);
        const fn = WHITELISTED_FUNCS[name];
        if (!fn) throw new Error(`Function "${name}" is not whitelisted. Allowed: ${Object.keys(WHITELISTED_FUNCS).join(', ')}`);
        pos++; // skip '('
        const args = [];
        if (peek() !== ')') {
          while (true) {
            args.push(parseExpr());
            const after = peek();
            if (after === ',') {
              pos++;
            } else if (after === ')') {
              break;
            } else {
              throw new Error(`Expected ',' or ')' at pos ${pos}`);
            }
          }
        }
        if (peek() !== ')') throw new Error(`Expected ')' after function arguments at pos ${pos}`);
        pos++; // skip ')'
        return fn(...args);
      }

      // Variable or param lookup
      if (isParam) {
        const rawName = name.slice(1);
        if (Object.prototype.hasOwnProperty.call(scope, rawName)) return Number(scope[rawName]);
        if (Object.prototype.hasOwnProperty.call(scope, name)) return Number(scope[name]);
        throw new Error(`Unknown recipe parameter "${name}" in expression "${exprInput}"`);
      }

      // Variable lookup
      if (Object.prototype.hasOwnProperty.call(scope, name)) {
        return Number(scope[name]);
      }
      throw new Error(`Unknown variable or identifier "${name}" in expression "${exprInput}"`);
    }

    throw new Error(`Unexpected character "${p}" at pos ${pos} in expression "${exprInput}"`);
  }

  const result = parseExpr();
  if (peek() !== null) {
    throw new Error(`Unexpected trailing characters "${str.slice(pos)}" in expression "${exprInput}"`);
  }
  if (!Number.isFinite(result)) {
    throw new Error(`Expression evaluated to non-finite result: ${result}`);
  }
  return result;
}

/**
 * L1 Schema Validator for dream-recipe/1.0
 */
export function validateRecipe(recipe) {
  const errors = [];

  if (!recipe || typeof recipe !== 'object') {
    return { valid: false, errors: ['Recipe must be a valid JSON object'] };
  }

  if (recipe.schema !== 'dream-recipe/1.0') {
    errors.push(`Invalid schema: expected "dream-recipe/1.0", got "${recipe.schema}"`);
  }

  if (!recipe.id || typeof recipe.id !== 'string' || !/^[a-z0-9_]+$/.test(recipe.id)) {
    errors.push(`Invalid or missing recipe.id: must be lowercase snake_case string`);
  }

  if (typeof recipe.version !== 'number' || recipe.version < 1) {
    errors.push(`Invalid recipe.version: must be positive integer`);
  }

  // Params check
  const params = recipe.params || {};
  if (typeof params !== 'object') {
    errors.push(`recipe.params must be an object`);
  } else {
    for (const [pName, pDef] of Object.entries(params)) {
      if (typeof pDef !== 'object') {
        errors.push(`Param "${pName}" must be an object with min, max, default`);
        continue;
      }
      if (typeof pDef.min !== 'number' || typeof pDef.max !== 'number' || typeof pDef.default !== 'number') {
        errors.push(`Param "${pName}" must have numeric min, max, and default`);
      } else if (pDef.min > pDef.max) {
        errors.push(`Param "${pName}" min (${pDef.min}) cannot exceed max (${pDef.max})`);
      }
    }
  }

  // Parts budget & verification
  const parts = recipe.parts;
  if (!Array.isArray(parts) || parts.length === 0) {
    errors.push(`recipe.parts must be a non-empty array`);
    return { valid: errors.length === 0, errors };
  }

  if (parts.length > 40) {
    errors.push(`L1 Budget violation: Recipe defines ${parts.length} parts (maximum allowed is 40)`);
  }

  let estimatedTotalCalls = 0;
  const mockScope = {};
  for (const [pName, pDef] of Object.entries(params)) {
    mockScope[pName] = pDef.default;
    mockScope['@' + pName] = pDef.default;
  }

  parts.forEach((part, idx) => {
    const partPath = `parts[${idx}] (${part.id || 'unnamed'})`;
    if (!part.id || typeof part.id !== 'string') {
      errors.push(`${partPath}: missing or invalid part.id`);
    }

    if (!part.prim || !ALLOWED_PRIMITIVES.has(part.prim)) {
      errors.push(`${partPath}: primitive "${part.prim}" is not in whitelist (${[...ALLOWED_PRIMITIVES].join(', ')})`);
    }

    if (!Array.isArray(part.args)) {
      errors.push(`${partPath}: part.args must be an array`);
    }

    // Foreach validation
    let iterations = 1;
    const partScope = { ...mockScope };
    if (part.foreach) {
      const { var: loopVar, from, to } = part.foreach;
      if (!loopVar || typeof loopVar !== 'string') {
        errors.push(`${partPath}: foreach must specify a string "var"`);
      }
      try {
        const fromVal = evaluateExpression(from, mockScope);
        const toVal = evaluateExpression(to, mockScope);
        iterations = Math.floor(toVal - fromVal + 1);
        if (iterations <= 0) {
          errors.push(`${partPath}: foreach evaluated to ${iterations} iterations (from: ${fromVal}, to: ${toVal})`);
        } else if (iterations > 24) {
          errors.push(`${partPath}: foreach bounded replication violation: evaluated to ${iterations} iterations (max allowed is 24)`);
        }
      } catch (err) {
        errors.push(`${partPath}: foreach bounds error: ${err.message}`);
      }
      partScope[loopVar] = 0;
    }
    estimatedTotalCalls += Math.max(1, iterations);

    // Validate args expressions
    if (Array.isArray(part.args)) {
      part.args.forEach((arg, aIdx) => {
        try {
          evaluateExpression(arg, partScope);
        } catch (err) {
          errors.push(`${partPath}.args[${aIdx}]: expression error: ${err.message}`);
        }
      });
    }

    // Validate opts
    if (part.opts) {
      if (typeof part.opts !== 'object') {
        errors.push(`${partPath}: part.opts must be an object`);
      } else {
        if (part.opts.ink && !VALID_INKS.has(part.opts.ink)) {
          errors.push(`${partPath}: ink "${part.opts.ink}" is invalid (must be one of: ${[...VALID_INKS].join(', ')})`);
        }
      }
    }

    // Validate tilt / rotate
    if (part.tilt) {
      if (!part.tilt.axis || !['x', 'z'].includes(part.tilt.axis)) {
        errors.push(`${partPath}: tilt.axis must be 'x' or 'z'`);
      }
      try {
        evaluateExpression(part.tilt.deg, partScope);
      } catch (err) {
        errors.push(`${partPath}: tilt.deg expression error: ${err.message}`);
      }
    }

    if (part.rotateY !== undefined) {
      try {
        evaluateExpression(part.rotateY, partScope);
      } catch (err) {
        errors.push(`${partPath}: rotateY expression error: ${err.message}`);
      }
    }
  });

  if (estimatedTotalCalls > 60) {
    errors.push(`L1 Budget violation: Estimated geometry calls (${estimatedTotalCalls}) exceeds maximum limit (60)`);
  }

  // Validate anchors
  if (recipe.anchors && typeof recipe.anchors === 'object') {
    for (const [aName, coords] of Object.entries(recipe.anchors)) {
      if (!Array.isArray(coords) || coords.length !== 3) {
        errors.push(`anchor "${aName}" must be a 3-element [x, y, z] array`);
      } else {
        coords.forEach((c, cIdx) => {
          try {
            evaluateExpression(c, mockScope);
          } catch (err) {
            errors.push(`anchor "${aName}"[${cIdx}] expression error: ${err.message}`);
          }
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    estimatedTotalCalls
  };
}

/**
 * Instantiates a declarative recipe onto builder B.
 * Fully deterministic: mulberry32(hash(recipe.id + ':' + seed))
 */
export function instantiateRecipe(B, recipe, seed = 1234, overrides = {}) {
  const l1 = validateRecipe(recipe);
  if (!l1.valid) {
    throw new Error(`Cannot instantiate invalid recipe [${recipe?.id}]: ${l1.errors.join('; ')}`);
  }

  const rng = mulberry32(hashSeed(`${recipe.id}:${seed}`));

  // 1. Draw each param uniformly in [min, max] (overridable)
  const resolvedParams = {};
  for (const [pName, pDef] of Object.entries(recipe.params || {})) {
    if (overrides[pName] !== undefined) {
      resolvedParams[pName] = overrides[pName];
    } else {
      const t = rng();
      resolvedParams[pName] = pDef.min + t * (pDef.max - pDef.min);
    }
    resolvedParams['@' + pName] = resolvedParams[pName];
  }

  const placedParts = [];
  const anchors = {};

  // 2. Expand and evaluate parts
  for (const part of recipe.parts) {
    const isLoop = !!part.foreach;
    const loopVar = isLoop ? part.foreach.var : null;
    let fromVal = 0;
    let toVal = 0;

    if (isLoop) {
      fromVal = Math.round(evaluateExpression(part.foreach.from, resolvedParams));
      toVal = Math.round(evaluateExpression(part.foreach.to, resolvedParams));
    }

    const start = isLoop ? fromVal : 0;
    const end = isLoop ? toVal : 0;

    for (let i = start; i <= end; i++) {
      const scope = { ...resolvedParams };
      if (isLoop) {
        scope[loopVar] = i;
      }

      const evalArgs = part.args.map(arg => evaluateExpression(arg, scope));
      const evalOpts = {};
      if (part.opts) {
        for (const [k, v] of Object.entries(part.opts)) {
          if (typeof v === 'string' && (v.startsWith('@') || /[\s+\-*/%]/.test(v))) {
            try {
              evalOpts[k] = evaluateExpression(v, scope);
            } catch {
              evalOpts[k] = v;
            }
          } else {
            evalOpts[k] = v;
          }
        }
      }

      if (part.tilt) {
        evalOpts.axis = part.tilt.axis;
        evalOpts.tiltDeg = evaluateExpression(part.tilt.deg, scope);
      }
      if (part.rotateY !== undefined) {
        evalOpts.rotateY = evaluateExpression(part.rotateY, scope);
      }

      // Invoke primitive on builder
      if (typeof B[part.prim] !== 'function') {
        throw new Error(`Builder does not support primitive "${part.prim}"`);
      }

      const primResult = B[part.prim](...evalArgs, evalOpts);
      placedParts.push({
        id: isLoop ? `${part.id}_${i}` : part.id,
        prim: part.prim,
        args: evalArgs,
        opts: evalOpts,
        result: primResult
      });
    }
  }

  // 3. Resolve anchors
  if (recipe.anchors) {
    for (const [aName, coords] of Object.entries(recipe.anchors)) {
      anchors[aName] = coords.map(c => evaluateExpression(c, resolvedParams));
    }
  }

  return {
    recipeId: recipe.id,
    seed,
    params: resolvedParams,
    partsCount: placedParts.length,
    parts: placedParts,
    anchors,
    tactical: recipe.tactical || {}
  };
}

/**
 * Creates a TeachRequest JSON structure (dream-teach/1.0).
 */
export function createTeachRequest({
  assetId,
  theme = 'general',
  pausedScope = 'vignette',
  kind = 'asset_gap',
  measuredContext = {},
  unansweredQuestions = [1, 2, 3, 4, 5, 6]
}) {
  const CANONICAL_QUESTIONS = {
    1: { id: 'scale', text: 'What is this in the notebook universe? (realHeightM, doodleHeightM, colossal, footprintM)' },
    2: { id: 'tacticalRole', text: 'What does it DO in a fight? (waist_cover, full_cover, traversable_catwalk, interior_corridor, landmark_anchor, grapple_anchor, hazard, pure_decor)' },
    3: { id: 'composition', text: 'How is it BUILT from primitives? (Provide dream-recipe/1.0 declarative JSON parts)' },
    4: { id: 'inkHierarchy', text: 'Which of the five inks, where? (Semantic palette: BL, BK, OR, RED, GR)' },
    5: { id: 'collision', text: 'What is solid? What is walkable? (Nav contract: solidParts, walkableParts, clearanceM, headroomM, noCollideSub03mParts)' },
    6: { id: 'variation', text: 'How does it VARY in nature? (Parametric min/max/default ranges)' }
  };

  const selectedQuestions = unansweredQuestions.map(qNum => CANONICAL_QUESTIONS[qNum]).filter(Boolean);

  const ticketId = `T-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

  return {
    schema: 'dream-teach/1.0',
    ticketId,
    trigger: {
      kind,
      assetId,
      theme,
      pausedScope,
      measuredContext: {
        tier: measuredContext.tier ?? 0,
        availableAnchors: measuredContext.availableAnchors || ['ground'],
        footprintAvailable: measuredContext.footprintAvailable || [6, 6],
        headroomToObstruction: measuredContext.headroomToObstruction || 15.0,
        neededTacticalRoles: measuredContext.neededTacticalRoles || ['landmark_anchor'],
        geometryBudgetLeft: measuredContext.geometryBudgetLeft || 140
      }
    },
    questions: selectedQuestions,
    budget: {
      maxParts: 40,
      maxGeometryCalls: 60
    },
    replyFormat: 'dream-recipe/1.0'
  };
}
