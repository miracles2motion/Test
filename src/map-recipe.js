// src/map-recipe.js
// The Map Recipe Engine & Interpreter for Dream System (File 07 Layer 2 & 3)
// Interprets pure data map recipes and generates production-ready, 100% compliant Doodle Strike maps.

import * as THREE from 'three';
import { INK } from './render.js';
import { BIOME_PALETTES, THEME_PROFILES } from './palettes.js';
import { SCALE_PRESETS } from './scale-presets.js';
import { createRNG, hashSeed } from './rebuild/prng.js';
import {
  PREFAB_REGISTRY,
  instantiatePrefab,
  buildBlobShadow,
  buildLeafLitter,
  buildWaterRipples,
  buildAtmosphericBeams,
  buildInkSplatters,
  buildTechnicalFraming
} from './prefabs.js';
import { sweptRibbon } from './spline-engine.js';
import {
  createRuleContext,
  reserveCorridor,
  reserveWater,
  reserveAscent,
  isAreaClear,
  poissonScatter,
  clusterScatter,
  grappleChain,
  detailRadius,
  validateAntiPinch,
  validateHeadroom,
  validateGrappleClearance,
  validateStepRise
} from './placement-grammar.js';

/**
 * Validates a recipe object against the Dream Master Recipe Schema.
 */
export function validateRecipeSchema(recipe) {
  const errors = [];
  if (!recipe.id || typeof recipe.id !== 'string') errors.push('Recipe missing valid "id" string');
  if (!recipe.scale || !SCALE_PRESETS[recipe.scale]) errors.push(`Recipe has unknown scale "${recipe.scale}"`);
  if (!recipe.palette || (!BIOME_PALETTES[recipe.palette] && !THEME_PROFILES[recipe.palette])) errors.push(`Recipe has unknown palette "${recipe.palette}"`);
  if (!Array.isArray(recipe.landmarks) || recipe.landmarks.length === 0) errors.push('Recipe requires at least 1 landmark');
  if (!Array.isArray(recipe.sectors) || recipe.sectors.length === 0) errors.push('Recipe requires at least 1 sector');
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Interprets a map recipe and constructs the level geometry on builder B.
 * Follows the strict 10-step assembly pipeline (File 07 Layer 3).
 *
 * @param {object} B - The level builder interface
 * @param {object} recipe - The map recipe JSON/object
 * @param {boolean} [arena=false] - Whether to generate in extended arena mode
 * @returns {object} { L, report }
 */
export function buildMapFromRecipe(B, recipe, arena = false) {
  const validation = validateRecipeSchema(recipe);
  if (!validation.valid) {
    throw new Error(`Recipe Validation Failed:\n- ${validation.errors.join('\n- ')}`);
  }
  const { L, box, slab, cyl, sphere, ring, rail, wedge, spawn, sniper, pickup, planes, collider } = B;

  // 1. Resolve Scale Preset & Palette
  const preset = SCALE_PRESETS[recipe.scale] || SCALE_PRESETS.colossal;
  const themeKey = recipe.theme || recipe.palette || 'urban';
  const profile = THEME_PROFILES[themeKey] || THEME_PROFILES.urban;
  const palette = BIOME_PALETTES[profile.palette] || BIOME_PALETTES.urban;
  const GR = palette.GREEN ?? INK.GREEN ?? 4;
  const BK = palette.BLACK ?? INK.BLACK ?? 2;
  const OR = palette.ORANGE ?? INK.ORANGE ?? 3;
  const BL = palette.BLUE ?? INK.BLUE ?? 0;
  const RD = palette.RED ?? INK.RED ?? 1;

  L.key = recipe.id;
  const baseP = recipe.bounds?.half ?? preset.half;
  const P = arena ? baseP + 13 : baseP;
  const wallH = recipe.bounds?.wallH ?? preset.wallH;
  const PH = arena ? wallH + 10 : wallH;
  const T = 6;
  const D = P - 3;
  L.bounds = { minX: -P, maxX: P, minZ: -P, maxZ: P };

  const rng = createRNG(recipe.seed ?? 1337);
  const context = createRuleContext(preset, rng.next, recipe);

  const report = {
    recipeId: recipe.id,
    scale: recipe.scale,
    palette: recipe.palette,
    prefabsPlaced: 0,
    collidersCount: 0,
    grapplesCount: 0,
    pickupsCount: 0,
    violations: []
  };

  // 2. Lay Ground Foundation & Tint Influence Fields
  const groundInk = recipe.ground?.ink === 'OR' ? OR : (recipe.ground?.ink === 'BK' ? BK : GR);
  box(0, -1.0, 0, 2 * P + T, 1.0, 2 * P + T, { ink: groundInk });

  // Central hub clearing disc if specified
  if (recipe.ground?.clearing) {
    const clrR = recipe.ground.clearing.r ?? 8.0;
    const clrInk = recipe.ground.clearing.ink === 'GREEN' ? GR : OR;
    box(0, 0.008, 0, clrR * 2.0, 0.01, clrR * 2.0, { ink: clrInk, noCollide: true });
  }

  // Sector ground-tint washes (File 03 / File 07)
  if (Array.isArray(recipe.sectors)) {
    for (const sec of recipe.sectors) {
      if (sec.tint && sec.c) {
        const tintInk = sec.tint.ink === 'OR' ? OR : (sec.tint.ink === 'BL' ? BL : (sec.tint.ink === 'BK' ? BK : GR));
        const rx = sec.tint.rx ?? (sec.rIn ?? 8.0);
        const rz = sec.tint.rz ?? (sec.rOut ?? 10.0);
        box(sec.c[0], 0.009, sec.c[1], rx * 2.0, 0.01, rz * 2.0, {
          ink: tintInk,
          noCollide: true
        });
      }
    }
  }

  // 2b. Procedural 3D Topography / Multi-Tier Terracing
  if (recipe.ground?.terraces && Array.isArray(recipe.ground.terraces)) {
    for (const terr of recipe.ground.terraces) {
      const tx = terr.x ?? 0;
      const tz = terr.z ?? 0;
      const rx = terr.rx ?? 12.0;
      const rz = terr.rz ?? 12.0;
      const ty = terr.y ?? 2.8;
      const tInk = terr.ink === 'OR' ? OR : (terr.ink === 'BK' ? BK : GR);

      // Elevated terrace plateau slab
      slab(tx - rx, tz - rz, tx + rx, tz + rz, ty, 0.45, { ink: tInk });

      // Technical Drafting Framing on elevated terrace (Skill: light-mode-paper-technical)
      if (palette?.technicalFraming) {
        buildTechnicalFraming(B, tx - rx, tz - rz, tx + rx, tz + rz, ty, {
          ink: BK,
          bracketLength: Math.min(2.0, Math.min(rx, rz) * 0.3)
        });
      }

      // Reserve elevated space in placement context
      reserveAscent(context, tx, tz, Math.max(rx, rz) + 1.0, ty + 4.0);

      // Stepped contour rock borders
      const borderStep = terr.borderStep ?? 4.0;
      for (let bx = tx - rx; bx <= tx + rx; bx += borderStep) {
        box(bx, ty * 0.5, tz - rz - 0.4, borderStep * 0.95, ty, 0.8, { ink: BK });
        box(bx, ty * 0.5, tz + rz + 0.4, borderStep * 0.95, ty, 0.8, { ink: BK });
      }
      for (let bz = tz - rz; bz <= tz + rz; bz += borderStep) {
        box(tx - rx - 0.4, ty * 0.5, bz, 0.8, ty, borderStep * 0.95, { ink: BK });
        box(tx + rx + 0.4, ty * 0.5, bz, 0.8, ty, borderStep * 0.95, { ink: BK });
      }

      // Calculated access steps conforming to detailing standard (rise <= 0.28m, run >= 0.45m)
      const stepRise = 0.28;
      const stepRun = 0.48;
      const numSteps = Math.ceil(ty / stepRise);
      const stairDir = terr.stairDir ?? '+z';
      const stairW = terr.stairW ?? 3.2;

      for (let s = 0; s < numSteps; s++) {
        const sy = (s + 0.5) * stepRise;
        let sx = tx, sz = tz;
        if (stairDir === '+z') {
          sz = (tz + rz) + (s + 0.5) * stepRun;
        } else if (stairDir === '-z') {
          sz = (tz - rz) - (s + 0.5) * stepRun;
        } else if (stairDir === '+x') {
          sx = (tx + rx) + (s + 0.5) * stepRun;
        } else {
          sx = (tx - rx) - (s + 0.5) * stepRun;
        }
        box(sx, sy, sz, stairDir.includes('z') ? stairW : stepRun, stepRise, stairDir.includes('z') ? stepRun : stairW, {
          ink: BK,
          tag: 'stairs'
        });
      }
    }
  }

  // 3. Water Ribbon, Riverbanks & Crossings
  if (recipe.water && recipe.water.ribbon) {
    const wRib = recipe.water.ribbon;
    const wX = wRib.x ?? 0;
    const fromZ = wRib.from ?? -P + 4;
    const toZ = wRib.to ?? P - 4;
    const wLen = Math.abs(toZ - fromZ);
    const wMidZ = (fromZ + toZ) / 2;
    const wWidth = wRib.width ?? 9.6;
    const sink = wRib.sink ?? 0.04;

    // Water surface
    box(wX, -sink, wMidZ, wWidth, 0.01, wLen, { ink: BL, noCollide: true });
    // Reserve water zone so props do not spawn underwater
    reserveWater(context, wRib);

    // Granite Riverbanks
    if (recipe.water.banks) {
      const bankStep = recipe.water.banks.step ?? 6.0;
      const bankLen = recipe.water.banks.len ?? 7.2;
      for (let bz = fromZ; bz <= toZ; bz += bankStep) {
        // West bank
        box(wX - (wWidth * 0.5 + 0.4), 0.0, bz, 0.9, 0.45, bankLen, { ink: BK });
        // East bank
        box(wX + (wWidth * 0.5 + 0.4), 0.0, bz, 0.9, 0.45, bankLen, { ink: BK });
      }
    }

    // River Crossings
    if (Array.isArray(recipe.water.crossings)) {
      for (const cross of recipe.water.crossings) {
        if (cross.type === 'stepping_stones') {
          const cz = cross.z;
          const stoneCount = 4;
          for (let s = 0; s < stoneCount; s++) {
            const sx = wX - 3.0 + s * 2.0;
            const sz = cz + ((s % 2 === 0) ? 0.4 : -0.4);
            box(sx, 0.0, sz, 1.4, 0.38, 1.4, { ink: BK });
            buildWaterRipples(B, sx, sz, 1.6, { ink: BL });
          }
          reserveCorridor(context, wX - 4.5, cz, wX + 4.5, cz, 2.5);
        } else if (cross.type === 'arched_bridge') {
          const bz = cross.z;
          slab(wX - 4.8, bz - 1.6, wX + 4.8, bz + 1.6, 2.6, 0.35, { ink: OR });
          rail(wX - 4.8, bz - 1.6, wX + 4.8, bz - 1.6, 2.6, { ink: OR });
          rail(wX - 4.8, bz + 1.6, wX + 4.8, bz + 1.6, 2.6, { ink: OR });
          reserveCorridor(context, wX - 6.0, bz, wX + 6.0, bz, 3.2);
        }
      }
    }
  }

  // 4. Trails & Arteries (Reserve corridors early so props yield)
  if (recipe.trails) {
    const trailInk = recipe.trails.ink === 'OR' ? OR : BK;
    const trailW = recipe.trails.width ?? 2.4;

    // 4a. Spline-based smooth organic trail ribbons
    if (Array.isArray(recipe.trails.splines)) {
      for (const sp of recipe.trails.splines) {
        if (Array.isArray(sp.points) && sp.points.length >= 2) {
          const sInk = sp.ink === 'OR' ? OR : (sp.ink === 'BK' ? BK : trailInk);
          sweptRibbon(B, sp.points, {
            ink: sInk,
            width: sp.width ?? trailW,
            samples: sp.samples ?? 16
          });
          for (let i = 0; i < sp.points.length - 1; i++) {
            const p1 = sp.points[i];
            const p2 = sp.points[i + 1];
            reserveCorridor(context, p1[0], p1[2], p2[0], p2[2], (sp.width ?? trailW) + 0.8);
          }
        }
      }
    }

    // 4b. Segment-based linear routes
    if (Array.isArray(recipe.trails.routes)) {
      for (const route of recipe.trails.routes) {
        if (Array.isArray(route.via)) {
          for (let i = 0; i < route.via.length - 1; i++) {
            const [x1, z1] = route.via[i];
            const [x2, z2] = route.via[i + 1];
            const mx = (x1 + x2) / 2;
            const mz = (z1 + z2) / 2;

            box(mx, 0.012, mz, Math.max(trailW, Math.abs(x2 - x1) + 0.4), 0.01, Math.max(trailW, Math.abs(z2 - z1) + 0.4), {
              ink: trailInk,
              noCollide: true
            });

            reserveCorridor(context, x1, z1, x2, z2, trailW + 0.6);
          }
        }
      }
    }
  }

  // 5. Landmarks First (They own space; everything else yields)
  const landmarkPositions = [];
  if (Array.isArray(recipe.landmarks)) {
    for (const lm of recipe.landmarks) {
      const lx = lm.at[0] ?? 0;
      const ly = lm.at[1] && lm.at[2] !== undefined ? lm.at[1] : 0;
      const lz = lm.at[2] !== undefined ? lm.at[2] : (lm.at[1] ?? 0);
      landmarkPositions.push({ x: lx, z: lz, name: lm.prefab });

      // Reserve landmark zone
      reserveAscent(context, lx, lz, 15.0, 7.0);

      // Instantiate landmark
      const success = instantiatePrefab(B, lm.prefab, lx, ly, lz, lm.opts || {});
      if (success) report.prefabsPlaced++;

      // Ground Ink Droplet Splatters (Skill: create-game-vfx)
      buildInkSplatters(B, lx + 2.5, ly, lz + 2.5, {
        ink: BK,
        seed: recipe.seed + hashSeed(lm.prefab || 'lm')
      });

      // Atmospheric Sky Rays / Sun Shafts descending onto primary landmark (Skill: 3d-sky-rays)
      if (palette?.skyRays?.enabled && landmarkPositions.length === 1) {
        buildAtmosphericBeams(B, lx, ly, lz, {
          ink: palette.skyRays.tint === 'BLUE' ? BL : OR,
          dirX: palette.skyRays.dir[0],
          dirZ: palette.skyRays.dir[2],
          h: 22.0
        });
      }

      // Beacon ring
      if (lm.beacon) {
        ring(lx, ly + (lm.opts?.height ?? 26.0) + 2.0, lz, 'y');
        report.grapplesCount++;
      }
    }
  }

  // 6. Sectors & Field Sampling
  if (Array.isArray(recipe.sectors)) {
    for (const sec of recipe.sectors) {
      const cx = sec.c ? sec.c[0] : (sec.a ? (sec.a[0] + sec.b[0]) / 2 : 0);
      const cz = sec.c ? sec.c[1] : (sec.a ? (sec.a[1] + sec.b[1]) / 2 : 0);

      // 6a. Sector Core Prefab
      if (sec.core) {
        const coreOpts = { ...sec.core.opts, seed: recipe.seed + hashSeed(sec.id) };
        const ok = instantiatePrefab(B, sec.core.prefab, cx, 0, cz, coreOpts);
        if (ok) report.prefabsPlaced++;
      }

      // 6b. Sector Clutter & Tactical Props
      if (Array.isArray(sec.props)) {
        for (const propSpec of sec.props) {
          const count = propSpec.n ?? 1;
          const rIn = sec.rIn ?? 8;
          const rOut = sec.rOut ?? 14;

          const fieldFn = (x, z) => {
            const dist = Math.hypot(x - cx, z - cz);
            if (dist > rOut) return 0.0;
            if (dist < 2.5) return 0.2; // Keep center somewhat open
            return 1.0 - (dist - rIn) / (rOut - rIn + 0.1);
          };

          const pts = poissonScatter(
            fieldFn,
            count,
            3.2,
            rng.next,
            { minX: cx - rOut, maxX: cx + rOut, minZ: cz - rOut, maxZ: cz + rOut },
            context
          );

          for (let pIdx = 0; pIdx < pts.length; pIdx++) {
            const pt = pts[pIdx];
            const propOpts = {
              ...propSpec.opts,
              seed: recipe.seed + hashSeed(`${sec.id}_${propSpec.prefab}`, pIdx)
            };
            const ok = instantiatePrefab(B, propSpec.prefab, pt.x, 0, pt.z, propOpts);
            if (ok) {
              report.prefabsPlaced++;
              // Grounding blob shadow
              buildBlobShadow(B, pt.x, pt.z, 1.8, 1.8, { ink: BK });
            }
          }
        }
      }

      // 6c. Sector Tactical Reward
      if (sec.reward && sec.reward.pickup) {
        const isDuplicate = (L.pickups || []).some(existing => Math.hypot(existing.x - cx, existing.z - cz) < 2.0);
        if (!isDuplicate) {
          pickup(cx, 0.4, cz);
          report.pickupsCount++;
        }
      }
    }
  }

  // 7. Inter-Sector Belt Props (File 03 Transition Belts)
  if (Array.isArray(recipe.beltProps)) {
    for (const belt of recipe.beltProps) {
      if (Array.isArray(belt.prefabs)) {
        const secA = recipe.sectors.find(s => s.id === belt.between[0]);
        const secB = recipe.sectors.find(s => s.id === belt.between[1]);
        if (secA && secB && secA.c && secB.c) {
          const mx = (secA.c[0] + secB.c[0]) / 2;
          const mz = (secA.c[1] + secB.c[1]) / 2;
          for (let i = 0; i < belt.prefabs.length; i++) {
            const px = mx + (rng.next() - 0.5) * 6.0;
            const pz = mz + (rng.next() - 0.5) * 6.0;
            if (isAreaClear(context, px, pz, 1.5)) {
              instantiatePrefab(B, belt.prefabs[i], px, 0, pz, { seed: recipe.seed + i * 97 });
              report.prefabsPlaced++;
            }
          }
        }
      }
    }
  }

  // 8. Vertical Pass: Grapple Chains
  if (recipe.vertical && Array.isArray(recipe.vertical.grappleChains)) {
    for (const chain of recipe.vertical.grappleChains) {
      if (chain.from && chain.to) {
        const rings = grappleChain(chain.from, chain.to, preset);
        for (const r of rings) {
          ring(r.x, r.y, r.z, r.axis);
          report.grapplesCount++;
        }
      }
    }
  }

  // 9. Perimeter Enclosure (Natural conifer wall or architectural palisade)
  const wallStyle = recipe.perimeter?.style || profile.perimeter || 'architectural';
  if (wallStyle === 'conifer_wall') {
    // Plant outer conifer perimeter wall
    const treeSpacing = 7.0;
    for (let x = -P + 2; x <= P - 2; x += treeSpacing) {
      instantiatePrefab(B, 'pine_tree', x, 0, -P + 2, { h: 22, inkLeaves: GR, inkWood: BK });
      instantiatePrefab(B, 'pine_tree', x, 0, P - 2, { h: 22, inkLeaves: GR, inkWood: BK });
    }
    for (let z = -P + 8; z <= P - 8; z += treeSpacing) {
      instantiatePrefab(B, 'pine_tree', -P + 2, 0, z, { h: 22, inkLeaves: GR, inkWood: BK });
      instantiatePrefab(B, 'pine_tree', P - 2, 0, z, { h: 22, inkLeaves: GR, inkWood: BK });
    }

    // Outer boundary collision shields (invisible or drafting boundary)
    const NG = { noNav: true, noGrapple: true };
    collider(0, 0, -P, 2 * P + T, PH, T, NG);
    collider(0, 0, P, 2 * P + T, PH, T, NG);
    collider(-P, 0, 0, T, PH, 2 * P + T, NG);
    collider(P, 0, 0, T, PH, 2 * P + T, NG);
  } else {
    // Standard solid architectural boundary
    box(0, 0, -P, 2 * P + T, PH, T, { ink: BK });
    box(0, 0, P, 2 * P + T, PH, T, { ink: BK });
    box(-P, 0, 0, T, PH, 2 * P + T, { ink: BK });
    box(P, 0, 0, T, PH, 2 * P + T, { ink: BK });
  }

  // 10. Cardinal Base Spawns, 5v5 Team Spawns & Arena Parity
  spawn(0, 0.2, D - 5);
  spawn(0, 0.2, -D + 5);
  spawn(D - 5, 0.2, 0);
  spawn(-D + 5, 0.2, 0);

  // Set default player start
  if (L.playerStart) {
    L.playerStart.set(0, 0.2, D - 5);
  }

  // Symmetric 5v5 Multiplayer Team Spawns
  const teamAlpha = [
    [0, 0.2, -D + 6],
    [-16, 0.2, -D + 10],
    [16, 0.2, -D + 10],
    [-24, 0.2, -D + 16],
    [24, 0.2, -D + 16]
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z));

  const teamBravo = [
    [0, 0.2, D - 6],
    [16, 0.2, D - 10],
    [-16, 0.2, D - 10],
    [24, 0.2, D - 16],
    [-24, 0.2, D - 16]
  ].map(([x, y, z]) => new THREE.Vector3(x, y, z));

  L.teamSpawns = [teamAlpha, teamBravo];

  // Extended Arena Mode Feature Set (Vaulted Ribs & Balance Grapple Platforms)
  if (arena) {
    // Aerial Ceiling Containment Dome / Vaulted Arch Ribs
    const domeY = PH - 2.0;
    const domeR = P * 0.82;
    for (let rib = 0; rib < 4; rib++) {
      const ang = (rib / 4) * Math.PI;
      const rx1 = Math.cos(ang) * domeR;
      const rz1 = Math.sin(ang) * domeR;
      const rx2 = -rx1;
      const rz2 = -rz1;
      rail(rx1, rz1, rx2, rz2, domeY, { ink: BK, noCollide: true });
    }

    // Flanking Balance Grapple Platforms over Mid-Chokepoint (Y >= 8.5m)
    slab(-13, -3.5, -6, 3.5, 8.5, 0.4, { ink: OR });
    rail(-13, -3.5, -6, -3.5, 8.5, { ink: OR });
    rail(-13, 3.5, -6, 3.5, 8.5, { ink: OR });
    buildTechnicalFraming(B, -13, -3.5, -6, 3.5, 8.5, { ink: BK });
    ring(-9.5, 12.5, 0, 'y');
    report.grapplesCount++;

    slab(6, -3.5, 13, 3.5, 8.5, 0.4, { ink: OR });
    rail(6, -3.5, 13, -3.5, 8.5, { ink: OR });
    rail(6, 3.5, 13, 3.5, 8.5, { ink: OR });
    buildTechnicalFraming(B, 6, -3.5, 13, 3.5, 8.5, { ink: BK });
    ring(9.5, 12.5, 0, 'y');
    report.grapplesCount++;
  }

  if (Array.isArray(recipe.snipers) && recipe.snipers.length > 0) {
    for (const s of recipe.snipers) {
      if (Array.isArray(s)) sniper(s[0], s[1], s[2]);
    }
  } else {
    // Default elevated vantage markers ensuring >= 2 snipers for tactical sightlines
    const sniperY = preset.tier3Y ?? 9.0;
    sniper(0, sniperY, 12);
    sniper(0, sniperY, -12);
  }

  if (Array.isArray(recipe.pickups)) {
    for (const p of recipe.pickups) {
      if (Array.isArray(p.at)) {
        const isDuplicate = (L.pickups || []).some(existing => Math.hypot(existing.x - p.at[0], existing.z - p.at[2]) < 2.0);
        if (!isDuplicate) {
          pickup(p.at[0], p.at[1], p.at[2]);
          report.pickupsCount++;
        }
      }
    }
  }

  // 11. Animated Kinetic Actors (File 05 & File 07)
  if (Array.isArray(recipe.actors) && L.animated) {
    if (recipe.actors.includes('smoke')) {
      // Find smoke origin dynamically from sector or recipe data (never hardcoded)
      const smokeSec = Array.isArray(recipe.sectors) ? recipe.sectors.find(s => s.actors?.includes('smoke') && s.c) : null;
      const originX = smokeSec ? smokeSec.c[0] : (recipe.smokeOrigin ? recipe.smokeOrigin[0] : 0);
      const originY = smokeSec ? 1.2 : (recipe.smokeOrigin ? recipe.smokeOrigin[1] : 1.2);
      const originZ = smokeSec ? smokeSec.c[1] : (recipe.smokeOrigin ? recipe.smokeOrigin[2] : 0);

      if (smokeSec || recipe.smokeOrigin) {
        const smokePuffs = [];
        const smokeMat = new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.35 });
        for (let i = 0; i < 5; i++) {
          const mesh = new THREE.Mesh(new THREE.RingGeometry(0.2 + i * 0.15, 0.35 + i * 0.18, 8), smokeMat);
          mesh.rotation.x = -Math.PI / 2;
          mesh.position.set(originX, originY + i * 0.9, originZ);
          B.scene.add(mesh);
          if (L.meshes) L.meshes.push(mesh);
          smokePuffs.push({ mesh, baseY: originY + i * 0.9, phase: i * 1.2 });
        }
        L.animated.push({
          update: (time) => {
            for (const p of smokePuffs) {
              const prog = ((time * 0.7 + p.phase) % 4.0) / 4.0;
              p.mesh.position.y = p.baseY + prog * 3.5;
              const scale = 1.0 + prog * 2.2;
              p.mesh.scale.set(scale, scale, scale);
            }
          }
        });
      }
    }

    if (recipe.actors.includes('birds')) {
      // Atmospheric canopy birds
      const birds = [];
      const birdMat = new THREE.MeshBasicMaterial({ color: 0x111111, side: THREE.DoubleSide });
      for (let b = 0; b < 4; b++) {
        const bGeo = new THREE.BufferGeometry();
        const verts = new Float32Array([-0.7, 0, 0.4, 0, 0, -0.4, 0.7, 0, 0.4]);
        bGeo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
        const mesh = new THREE.Mesh(bGeo, birdMat);
        mesh.position.set(0, 27.0, 0);
        B.scene.add(mesh);
        if (L.meshes) L.meshes.push(mesh);
        birds.push({ mesh, radius: 36 + b * 2.5, speed: 0.22 + b * 0.03, phase: b * 1.57, y: 26.5 + b * 0.5 });
      }
      L.animated.push({
        update: (time) => {
          for (const b of birds) {
            const ang = time * b.speed + b.phase;
            b.mesh.position.x = Math.cos(ang) * b.radius;
            b.mesh.position.z = Math.sin(ang) * b.radius;
            b.mesh.position.y = b.y + Math.sin(time * 1.2 + b.phase) * 0.6;
            b.mesh.rotation.y = -ang + Math.PI / 2;
          }
        }
      });
    }
  }

  // 12. Run Placement Validation Checks (File 08)
  const pinchViolations = validateAntiPinch(L.colliders, preset.corridorMin);
  const headroomViolations = validateHeadroom(L.colliders, preset.headroomMin);
  const grappleViolations = validateGrappleClearance(L.rings, L.colliders, preset.grappleClearance);

  report.collidersCount = L.colliders ? L.colliders.length : 0;
  report.grapplesCount = L.rings ? L.rings.length : 0;
  report.violations = [...pinchViolations, ...headroomViolations, ...grappleViolations];

  return { L, report };
}
