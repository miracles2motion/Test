/**
 * Doodle Strike - 3D Geometry Validator & Dry-Run Safety Engine
 * 
 * Intercepts, dry-runs, and validates procedural Three.js geometry buffers,
 * API signatures (box, slab, stairs, ring, pickup), and vertex arrays
 * before writing generated structures to disk.
 */

import * as THREE from 'three';

export class GeometryValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Parses argument list from a function call taking into account nested parentheses and objects
   */
  splitArguments(argsStr) {
    const args = [];
    let cur = '';
    let depth = 0;
    for (let i = 0; i < argsStr.length; i++) {
      const ch = argsStr[i];
      if (ch === '(' || ch === '{' || ch === '[') depth++;
      else if (ch === ')' || ch === '}' || ch === ']') depth--;
      
      if (ch === ',' && depth === 0) {
        args.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    if (cur.trim()) args.push(cur.trim());
    return args;
  }

  /**
   * Validates raw code string for API parameter mismatches before execution.
   */
  validateCodeSyntax(codeSnippet) {
    const issues = [];

    // Check slab calls for parameter mismatches
    // Correct: slab(x1, z1, x2, z2, y, thickness, opts)
    const slabRegex = /slab\s*\(([\s\S]*?)\)(?=;|\n|$)/g;
    let match;
    while ((match = slabRegex.exec(codeSnippet)) !== null) {
      const args = this.splitArguments(match[1]);
      
      if (args.length < 5) {
        issues.push({ type: 'error', rule: 'slab-arity', msg: `slab() has too few arguments (${args.length}): "${match[0]}"` });
      } else if (args.length === 6 && args[5].startsWith('{')) {
        issues.push({ type: 'error', rule: 'slab-signature-mismatch', msg: `slab() received options object as thickness: "${match[0]}". Must be slab(x1, z1, x2, z2, y, thickness, opts)` });
      }
    }

    // Check box calls for proper dimensions
    const boxRegex = /box\s*\(([\s\S]*?)\)(?=;|\n|$)/g;
    while ((match = boxRegex.exec(codeSnippet)) !== null) {
      const args = this.splitArguments(match[1]);
      if (args.length < 6) {
        issues.push({ type: 'error', rule: 'box-arity', msg: `box() has too few arguments (${args.length}): "${match[0]}"` });
      }
    }

    return issues;
  }

  /**
   * Dry-runs a Three.js BufferGeometry to ensure zero NaNs, infinities,
   * or degenerate bounding spheres.
   */
  validateGeometryBuffer(geometry, label = 'Mesh') {
    if (!geometry || !geometry.isBufferGeometry) {
      return { valid: false, error: `${label} is not a valid BufferGeometry` };
    }

    const pos = geometry.attributes.position;
    if (!pos || !pos.array) {
      return { valid: false, error: `${label} missing position attribute` };
    }

    const arr = pos.array;
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      if (Number.isNaN(val)) {
        return { valid: false, error: `NaN vertex coordinate detected at index ${i} in ${label}` };
      }
      if (!Number.isFinite(val)) {
        return { valid: false, error: `Infinite vertex coordinate detected at index ${i} in ${label}` };
      }
    }

    try {
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();

      if (!geometry.boundingSphere || Number.isNaN(geometry.boundingSphere.radius)) {
        return { valid: false, error: `Bounding sphere calculation failed (NaN radius) in ${label}` };
      }

      if (geometry.boundingBox) {
        const { min, max } = geometry.boundingBox;
        if (Number.isNaN(min.x) || Number.isNaN(max.x) || Number.isNaN(min.y) || Number.isNaN(max.y)) {
          return { valid: false, error: `Bounding box calculation failed (NaN bounds) in ${label}` };
        }
      }
    } catch (e) {
      return { valid: false, error: `Three.js bounding calculation error: ${e.message}` };
    }

    return { valid: true };
  }

  /**
   * Executes a mock sandbox builder to simulate the level's Three.js scene creation
   * and tests all resultant geometries.
   */
  testSandboxExecution(codeBlock, inkColors = { BL: 1, OR: 2, BK: 3, RD: 4, GR: 5 }) {
    const geos = [];
    const colliders = [];

    const mockAddGeo = (g, ink) => geos.push({ g, ink });
    const mockCollider = (x, y, z, w, h, d, o = {}) => colliders.push({ x, y, z, w, h, d, o });

    const box = (x, y, z, w, h, d, o = {}) => {
      const sw = Number.isFinite(w) && w > 0 ? w : 0.4;
      const sh = Number.isFinite(h) && h > 0 ? h : 0.4;
      const sd = Number.isFinite(d) && d > 0 ? d : 0.4;
      const g = new THREE.BoxGeometry(sw, sh, sd);
      g.translate(x, y + sh / 2, z);
      mockAddGeo(g, o?.ink ?? 1);
      if (!o?.noCollide) mockCollider(x, y, z, sw, sh, sd, o);
    };

    const slab = (x1, z1, x2, z2, y, t = 0.4, o = {}) => {
      const st = typeof t === 'number' && Number.isFinite(t) ? t : 0.4;
      const so = typeof t === 'object' && t !== null && !o ? t : (o || {});
      box((x1 + x2) / 2, y - st, (z1 + z2) / 2, Math.abs(x2 - x1), st, Math.abs(z2 - z1), so);
    };

    const cyl = (x, y, z, r, h, o = {}) => {
      const g = new THREE.CylinderGeometry(r, r, h, o.seg || 8);
      g.translate(x, y + h / 2, z);
      mockAddGeo(g, o?.ink ?? 1);
    };

    const rail = (x1, z1, x2, z2, y, o = {}) => {
      const t = 0.08, rh = 1.0;
      const dx = x2 - x1, dz = z2 - z1;
      const len = Math.hypot(dx, dz);
      box((x1 + x2) / 2, y, (z1 + z2) / 2, Math.abs(dx) > Math.abs(dz) ? len : t, rh, Math.abs(dz) >= Math.abs(dx) ? len : t, o);
    };

    const ring = (x, y, z, orient = 'z', o = {}) => {};
    const pickup = (x, y, z) => {};

    const { BL, OR, BK, RD, GR } = inkColors;

    try {
      // Evaluate within sandbox scope
      const sandboxFn = new Function('box', 'slab', 'cyl', 'rail', 'ring', 'pickup', 'BL', 'OR', 'BK', 'RD', 'GR', codeBlock);
      sandboxFn(box, slab, cyl, rail, ring, pickup, BL, OR, BK, RD, GR);
    } catch (e) {
      return { valid: false, error: `Sandbox execution syntax error: ${e.message}` };
    }

    // Validate all generated geometries
    for (let i = 0; i < geos.length; i++) {
      const valResult = this.validateGeometryBuffer(geos[i].g, `Geometry[${i}]`);
      if (!valResult.valid) {
        return valResult;
      }
    }

    return { valid: true, geoCount: geos.length, colliderCount: colliders.length };
  }
}
