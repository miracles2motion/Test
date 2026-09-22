import * as THREE from 'three';
import { INK } from '../render.js';
import { rand, choose } from '../util.js';
import { splineTube, annularDeck, sweptRibbon } from '../spline-engine.js';
export function buildSuspendedRopeBridge(B, x1, z1, x2, z2, y, o = {}) {
  const { box, cyl, collider } = B;
  const inkPlank = o.inkPlank ?? (INK.ORANGE ?? 3);
  const inkRope = o.inkRope ?? (INK.BLACK ?? 2);
  const width = o.width ?? 1.8;
  const maxSag = o.maxSag ?? 0.35;

  const dx = x2 - x1;
  const dz = z2 - z1;
  const len = Math.hypot(dx, dz);
  if (len < 1.0) return;

  const dirX = dx / len;
  const dirZ = dz / len;
  const perpX = -dirZ;
  const perpZ = dirX;

  const plankSpacing = 0.85;
  const numPlanks = Math.max(3, Math.floor(len / plankSpacing));
  const plankThickness = 0.22;

  // Segmented walkable colliders closely hugging the catenary sag curve (zero player floating)
  const segCount = Math.max(4, Math.round(len / 2.8));
  for (let s = 0; s < segCount; s++) {
    const tA = s / segCount, tB = (s + 1) / segCount;
    const tm = (tA + tB) / 2;
    const ym = y - Math.sin(tm * Math.PI) * maxSag;
    const sx = x1 + dx * tm, sz = z1 + dz * tm;
    const segLen = (len / segCount) + 0.15; // small overlap so player never falls through
    collider(sx, ym - 0.15, sz,
      Math.abs(dirX) > 0.5 ? segLen : width,
      0.35,
      Math.abs(dirX) > 0.5 ? width : segLen
    );
  }

  // Individual planks with downward catenary sag
  for (let i = 0; i <= numPlanks; i++) {
    const t = i / numPlanks;
    const px = x1 + dx * t;
    const pz = z1 + dz * t;
    const sag = Math.sin(t * Math.PI) * maxSag;
    const py = y - sag;

    box(px, py, pz,
      Math.abs(dirX) > 0.5 ? 0.65 : width,
      plankThickness,
      Math.abs(dirX) > 0.5 ? width : 0.65,
      { ink: inkPlank, noCollide: true }
    );
  }

  // Left and Right Rope Handrails
  const railH = 0.95;
  const subSegments = Math.max(4, Math.floor(len / 3.0));
  for (let s = 0; s < subSegments; s++) {
    const tA = s / subSegments;
    const tB = (s + 1) / subSegments;
    const xA = x1 + dx * tA, zA = z1 + dz * tA;
    const xB = x1 + dx * tB, zB = z1 + dz * tB;
    const yA = y - Math.sin(tA * Math.PI) * maxSag + railH;
    const yB = y - Math.sin(tB * Math.PI) * maxSag + railH;

    for (const side of [-1, 1]) {
      const rxA = xA + perpX * (width / 2) * side;
      const rzA = zA + perpZ * (width / 2) * side;
      const rxB = xB + perpX * (width / 2) * side;
      const rzB = zB + perpZ * (width / 2) * side;

      const mx = (rxA + rxB) / 2, my = (yA + yB) / 2, mz = (rzA + rzB) / 2;
      const segLen = Math.hypot(rxB - rxA, rzB - rzA);
      box(mx, my, mz,
        Math.abs(dirX) > 0.5 ? segLen : 0.12,
        0.12,
        Math.abs(dirX) > 0.5 ? 0.12 : segLen,
        { ink: inkRope, noCollide: true }
      );
    }
  }

  // Vertical rope suspension ties
  for (let i = 1; i < numPlanks; i += 3) {
    const t = i / numPlanks;
    const px = x1 + dx * t;
    const pz = z1 + dz * t;
    const py = y - Math.sin(t * Math.PI) * maxSag;

    for (const side of [-1, 1]) {
      const rx = px + perpX * (width / 2) * side;
      const rz = pz + perpZ * (width / 2) * side;
      cyl(rx, py + 0.1, rz, 0.04, railH, { ink: inkRope, noCollide: true });
    }
  }
}

export const buildSuspensionBridge = buildSuspendedRopeBridge;

export function buildChalkboardWall(B, x, y, z, o = {}) {
  const { box } = B;
  const ink = o.ink ?? INK.BLUE;
  const inkFrame = o.inkFrame ?? INK.ORANGE;
  box(x - 1.2, y, z, 0.2, 2.8, 0.3, { ink: inkFrame, tag: 'cover' });
  box(x + 1.2, y, z, 0.2, 2.8, 0.3, { ink: inkFrame, tag: 'cover' });
  box(x, y + 0.8, z, 2.4, 1.6, 0.15, { ink, tag: 'cover' });
  box(x, y + 0.75, z + 0.12, 2.4, 0.08, 0.18, { ink: inkFrame, noCollide: true });
}

export function buildTerminalClockTower(B, x, y, z, o = {}) {
  const { box, slab, cyl, ring } = B;
  const inkStructure = o.inkStructure ?? (INK.BLUE ?? 0);
  const inkClock = o.inkClock ?? (INK.BLACK ?? 2);
  const inkAccent = o.inkAccent ?? (INK.ORANGE ?? 3);

  // 1. Foundation plinth
  slab(x - 2.2, z - 2.2, x + 2.2, z + 2.2, y, 0.6, { ink: inkStructure });

  // 2. Main vertical four-sided pillar
  box(x, y + 0.6, z, 2.8, 8.5, 2.8, { ink: inkStructure });

  // 3. Mezzanine balcony overlook at Y = y + 4.2
  slab(x - 3.2, z - 3.2, x + 3.2, z + 3.2, y + 4.2, 0.35, { ink: inkAccent });

  // 4. Four-sided departure split-flap boards
  for (const [dx, dz] of [[0, 1.42], [0, -1.42], [1.42, 0], [-1.42, 0]]) {
    box(x + dx, y + 5.2, z + dz, dx ? 0.08 : 2.2, 1.4, dz ? 0.08 : 2.2, { ink: inkAccent, noCollide: true });
  }

  // 5. Four-sided clock head at top
  box(x, y + 9.1, z, 3.4, 3.2, 3.4, { ink: inkStructure });
  for (const [dx, dz] of [[0, 1.72], [0, -1.72], [1.72, 0], [-1.72, 0]]) {
    cyl(x + dx, y + 10.7, z + dz, 1.1, 0.06, { axis: dx ? 'x' : 'z', ink: inkClock, noCollide: true });
  }

  // 6. Apex spire & Momentum Grapple Ring
  cyl(x, y + 12.3, z, 0.18, 5.0, { ink: inkClock, noCollide: true });
  ring(x, y + 17.5, z, 'y');
}

export function buildSpaceFrameConcourse(B, x, y, z, o = {}) {
  const { box, cyl, ring } = B;
  const inkSteel = o.inkSteel ?? (INK.BLUE ?? 0);
  const inkLattice = o.inkLattice ?? (INK.BLACK ?? 2);
  const span = o.span ?? 36.0;
  const length = o.length ?? 48.0;
  const apexH = o.apexH ?? 11.5;
  const archCount = Math.max(3, Math.floor(length / 12.0));

  const halfSpan = span / 2;
  const zStart = z - length / 2;
  const zStep = length / (archCount - 1);

  for (let a = 0; a < archCount; a++) {
    const curZ = zStart + a * zStep;
    const segments = 10;
    for (let s = 0; s < segments; s++) {
      const t1 = s / segments;
      const t2 = (s + 1) / segments;
      const ang1 = Math.PI * t1;
      const ang2 = Math.PI * t2;

      const px1 = x - Math.cos(ang1) * halfSpan;
      const py1 = y + Math.sin(ang1) * apexH;
      const px2 = x - Math.cos(ang2) * halfSpan;
      const py2 = y + Math.sin(ang2) * apexH;

      const segDx = px2 - px1;
      const segDy = py2 - py1;
      const segLen = Math.hypot(segDx, segDy);
      const midX = (px1 + px2) / 2;
      const midY = (py1 + py2) / 2;

      // Primary heavy tubular arch rib
      cyl(midX, midY, curZ, 0.22, segLen, { axis: 'x', ink: inkSteel, noCollide: true });

      // Cross-truss purlins connecting to next arch
      if (a < archCount - 1 && s % 2 === 0) {
        cyl(px1, py1, curZ + zStep / 2, 0.12, zStep, { axis: 'z', ink: inkLattice, noCollide: true });
      }
    }

    // Traversal grapple ring at the apex of each arch (skip if at center where clock tower stands)
    if (Math.hypot(x, curZ) > 4.0) {
      ring(x, y + apexH + 2.0, curZ, 'y');
    }
  }
}

export function buildTransitUnderpass(B, x, y, z, o = {}) {
  const { box, slab, rail } = B;
  const inkTile = o.inkTile ?? (INK.BLUE ?? 0);
  const inkStair = o.inkStair ?? (INK.BLACK ?? 2);
  const width = o.width ?? 3.8;
  const length = o.length ?? 24.0;
  const depth = o.depth ?? 2.8;

  // Subterranean floor slab
  slab(x - width / 2, z - length / 2, x + width / 2, z + length / 2, y - depth, 0.35, { ink: inkTile });

  // Retaining concrete side walls
  box(x - width / 2 - 0.2, y - depth, z, 0.4, depth + 1.0, length, { ink: inkStair });
  box(x + width / 2 + 0.2, y - depth, z, 0.4, depth + 1.0, length, { ink: inkStair });

  // Protective handrails along top openings
  rail(x - width / 2, z - length / 2, x - width / 2, z + length / 2, y, { ink: inkStair });
  rail(x + width / 2, z - length / 2, x + width / 2, z + length / 2, y, { ink: inkStair });

  // North entrance staircase (rising from y - depth up to y)
  const steps = 10;
  const rise = depth / steps;
  const run = 0.45;
  for (let i = 0; i < steps; i++) {
    const sY = y - depth + i * rise;
    const sZ = z - length / 2 + (i + 1) * run;
    box(x, sY, sZ, width - 0.4, rise, run, { ink: inkTile, tag: 'stairs' });
  }

  // South entrance staircase
  for (let i = 0; i < steps; i++) {
    const sY = y - depth + i * rise;
    const sZ = z + length / 2 - (i + 1) * run;
    box(x, sY, sZ, width - 0.4, rise, run, { ink: inkTile, tag: 'stairs' });
  }
}

export function buildTechnicalFraming(B, minX, minZ, maxX, maxZ, y, o = {}) {
  const { box } = B;
  const ink = o.ink ?? INK.BLACK;
  const bracketL = o.bracketLength ?? 1.2;
  const tickW = 0.06;
  const tickH = 0.02;

  // Northwest corner bracket
  box(minX + bracketL / 2, y + 0.02, minZ, bracketL, tickH, tickW, { ink, noCollide: true });
  box(minX, y + 0.02, minZ + bracketL / 2, tickW, tickH, bracketL, { ink, noCollide: true });

  // Northeast corner bracket
  box(maxX - bracketL / 2, y + 0.02, minZ, bracketL, tickH, tickW, { ink, noCollide: true });
  box(maxX, y + 0.02, minZ + bracketL / 2, tickW, tickH, bracketL, { ink, noCollide: true });

  // Southwest corner bracket
  box(minX + bracketL / 2, y + 0.02, maxZ, bracketL, tickH, tickW, { ink, noCollide: true });
  box(minX, y + 0.02, maxZ - bracketL / 2, tickW, tickH, bracketL, { ink, noCollide: true });

  // Southeast corner bracket
  box(maxX - bracketL / 2, y + 0.02, maxZ, bracketL, tickH, tickW, { ink, noCollide: true });
  box(maxX, y + 0.02, maxZ - bracketL / 2, tickW, tickH, bracketL, { ink, noCollide: true });

  // Center coordinate reticle mark (+)
  const midX = (minX + maxX) / 2;
  const midZ = (minZ + maxZ) / 2;
  box(midX, y + 0.02, midZ, 0.6, tickH, tickW, { ink, noCollide: true });
  box(midX, y + 0.02, midZ, tickW, tickH, 0.6, { ink, noCollide: true });
}


// --- PHANTOM B-KEYS RESTORED FOR BUS STATION ---

export function buildTransitBus(B, x, y, z, o = {}) {
  const { box, cyl, collider } = B;
  const inkB = o.inkBody || 2; // BK default?
  const inkT = o.inkTrim || 2;
  const inkG = o.inkGlass || 3;
  const seed = (Math.abs(x) + Math.abs(z)) * 137;
  // Bus body
  box(x, y + 2.5, z, 3.2, 3.5, 9.6, { ink: inkB });
  box(x, y + 0.5, z, 3.1, 1.0, 9.5, { ink: inkT }); // bumper rim
  // Windows
  box(x, y + 3.2, z, 3.25, 1.2, 7.6, { ink: inkG, noCollide: true });
  // Wheels
  for(let wz of [-3.5, 3.5]) {
    for(let wx of [-1.5, 1.5]) {
      cyl(x + wx, y + 0.6, z + wz, 0.6, 0.4, { ink: 2, rx: Math.PI/2 });
    }
  }
  // Gameplay
  collider(x, y + 2.5, z, 3.2, 3.5, 9.6);
}

export function buildTerminalClockTower(B, x, y, z, o = {}) {
  const { box, cyl, collider } = B;
  const ink = o.ink || 2;
  // Tower base
  box(x, y - 6, z, 6, 12, 6, { ink });
  // Clock face
  cyl(x, y + 1.5, z + 3.1, 2, 0.4, { ink: 4, rx: Math.PI/2 }); // BL
  cyl(x, y + 1.5, z - 3.1, 2, 0.4, { ink: 4, rx: Math.PI/2 }); // BL
  cyl(x + 3.1, y + 1.5, z, 2, 0.4, { ink: 4, rz: Math.PI/2 });
  cyl(x - 3.1, y + 1.5, z, 2, 0.4, { ink: 4, rz: Math.PI/2 });
  // Spire
  box(x, y + 5, z, 2, 4, 2, { ink });
  collider(x, y, z, 6, 24, 6);
}

export function buildTransitBench(B, x, y, z, o = {}) {
  const { box, collider } = B;
  const ink = o.ink || 2;
  box(x, y + 0.4, z, 2.4, 0.1, 0.8, { ink });
  box(x, y + 0.9, z - 0.4, 2.4, 0.8, 0.1, { ink });
  box(x - 1.1, y + 0.4, z, 0.1, 0.8, 0.8, { ink });
  box(x + 1.1, y + 0.4, z, 0.1, 0.8, 0.8, { ink });
  collider(x, y + 0.5, z, 2.4, 1.0, 0.9);
}

export function buildPassengerShelter(B, x, y, z, o = {}) {
  const { box, collider } = B;
  const ink = o.ink || 2;
  // Roof
  box(x, y + 3, z, 4, 0.2, 2.5, { ink });
  // Back glass
  box(x, y + 1.5, z - 1.2, 3.8, 2.8, 0.1, { ink: 3 }); // BL
  // Pillars
  box(x - 1.8, y + 1.5, z, 0.2, 3, 0.2, { ink });
  box(x + 1.8, y + 1.5, z, 0.2, 3, 0.2, { ink });
  collider(x, y + 1.5, z, 4, 3, 2.5);
}

export function buildTechnicalFraming(B, x1, y1, x2, y2, y3, o = {}) {
  const { box, collider } = B;
  const ink = o.ink || 2;
  const r = o.bracketLength || 1.8;
  const cx = (x1 + x2) / 2;
  const cz = y3; 
  const lenX = Math.abs(x2 - x1);
  const lenZ = Math.abs(y2 - y1);
  box(cx, y3 + 0.5, (y1 + y2)/2, lenX + r, 1.0, lenZ + r, { ink });
  collider(cx, y3 + 0.5, (y1 + y2)/2, lenX + r, 1.0, lenZ + r);
}

export function buildAtmosphericBeams(B, x, y, z, o = {}) {
  const { cyl } = B;
  const ink = o.ink || 4; // OR/BL
  const h = o.h || 20.0;
  cyl(x, y + h/2, z, 0.8, h, { ink, noCollide: true });
}

export function buildInkSplatters(B, x, y, z, o = {}) {
  const { box } = B;
  // Just some flat boxes for ink splatters
  box(x, y, z, 2.0, 0.05, 2.0, { ink: o.ink || 2, noCollide: true });
}
