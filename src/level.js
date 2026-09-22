// Level construction. Two maps share one builder: everything is merged ink geometry plus
// axis-aligned box colliders, which is what the navigation grid is generated from.
import { buildRetroArcade } from './levels/retro_arcade.js';
import { buildDistrict } from './levels/district.js';
import { buildClassroom } from './levels/classroom.js';
import { buildClockwork } from './levels/clockwork.js';
import { buildStudio } from './levels/studio.js';
import { buildMexico } from './levels/mexico.js';
import { buildForest } from './levels/forest.js';
import { buildBusStation } from './levels/bus_station.js';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { makeInkMaterial, INK } from './render.js';
import { rand, choose, TAU } from './util.js';
import { buildHumanoid } from './enemies.js';
import { buildZen } from './levels/zen.js';
import { looseOctree } from './perf/loose-octree.js';
import { splineTube, annularDeck, sweptRibbon } from './spline-engine.js';

// Doodle Mexico is built and kept, but off the menu until it is ready; flip this to offer it again
export const MEXICO_READY = false;
export const LEVELS = [
  { key: 'district', name: 'DOODLE DISTRICT', blurb: 'streets, rooftops and fire escapes', category: 'urban', tags: ['FAST CQB', 'MEDIUM', 'EARTH'], env: 'Urban Streets', engagement: 'CQB / Grapple', hazard: 'Lethal Abyss', scale: 'Tier 1-3' },
  { key: 'classroom', name: 'THE GIANT CLASSROOM', blurb: 'towering desks, crashed paper planes, staplers & science lab', category: 'colossal', tags: ['VERTICAL', 'MASSIVE', 'EARTH'], env: 'Colossal', engagement: 'Sniping / Grapple', hazard: 'Fall Damage', scale: 'Tier 1-4' },
  { key: 'forest',
    customEnemies: {
      forest_monkey: {
        role: "ranged",
        canDodge: true,
        canCover: true,
        canRetreat: true,
        canFlank: true,
        leaper: true,
        tail: true,
        hp: 85,
        speed: 7.2,
        weapon: "rifle",
        range: 26,
        stop: 12,
        keep: 6,
        burst: 3,
        burstInt: 0.12,
        cool: [
          1.2,
          1.8
        ],
        dmg: 5,
        spread: 0.06,
        pspeed: 40,
        score: 180,
        scale: 0.82,
        name: "FOREST_MONKEY",
        hat: "monkey",
        build: {
          bodyW: 0.72,
          headS: 0.88,
          limbR: 0.024
        }
      },
      bamboo_stalker: {
        role: "ranged",
        canDodge: true,
        canCover: true,
        canRetreat: true,
        canFlank: false,
        hp: 65,
        speed: 5.2,
        weapon: "sniper",
        range: 85,
        stop: 85,
        keep: 16,
        aimTime: 1.4,
        cool: [
          2.2,
          3.2
        ],
        dmg: 22,
        spread: 0.006,
        pspeed: 92,
        score: 220,
        scale: 0.95,
        name: "BAMBOO_STALKER",
        stationary: false,
        hat: "conical",
        build: {
          bodyW: 0.76,
          headS: 0.9,
          limbR: 0.025
        }
      }
    }, name: 'THE COLOSSAL CANOPY', blurb: 'titan redwoods, constructed treehouse fortress, curved hollow logs & high grapple highway', category: 'colossal', tags: ['VERTICAL', 'MASSIVE', 'ORGANIC'], env: 'Colossal Redwood Forest', engagement: 'Sniping / Grapple', hazard: 'Abyssal Chasm below Y=-10.0m', scale: 'Tier 1-4' },
  { key: 'clockwork', name: 'CLOCKWORK TOWER', blurb: 'monolithic gears, pendulums and grinding cogs', category: 'anomalous', tags: ['FAST CQB', 'MEDIUM', 'HOROLOGICAL'], env: 'Kinetic Machinery', engagement: 'Platforming / CQB', hazard: 'Grinding Cogs below Y=-4.0m', scale: 'Tier 1-5' },
  { key: 'castle', name: 'BLUEPRINT CASTLE', comingSoon: true, blurb: 'drawbridges, donjon keeps and siege engines', category: 'urban', tags: ['LONG-RANGE', 'MASSIVE', 'EARTH'], env: 'Medieval Fortress', engagement: 'Siege / Sniping', hazard: 'Moat Abyss', scale: 'Tier 1-4' },
  { key: 'zen',
    customEnemies: {
      zen_ninja: {
        role: "melee",
        canDodge: true,
        canCover: true,
        canRetreat: false,
        canFlank: true,
        berserker: true,
        hp: 60,
        speed: 8.5,
        weapon: "blade",
        lunge: 3.5,
        reach: 3,
        standoff: 1.5,
        cool: [
          0.8,
          1.2
        ],
        dmg: 18,
        build: {
          bodyW: 0.8,
          headS: 0.9,
          limbR: 0.03
        },
        name: "ZEN NINJA",
        score: 150,
        scale: 1
      },
      shogun_heavy: {
        role: "ranged",
        canDodge: false,
        canCover: true,
        canRetreat: true,
        canFlank: true,
        hp: 350,
        speed: 2.8,
        weapon: "shotgun",
        range: 20,
        stop: 10,
        keep: 6,
        pellets: 8,
        cool: [
          2,
          3
        ],
        dmg: 6,
        spread: 0.1,
        pspeed: 30,
        build: {
          bodyW: 1.5,
          headS: 0.9,
          limbR: 0.05
        },
        name: "SHOGUN HEAVY",
        score: 150,
        scale: 1
      }
    }, name: 'THE ZEN GARDEN', blurb: 'serene pagodas, cherry blossoms and koi ponds', category: 'anomalous', tags: ['FAST CQB', 'MEDIUM', 'EARTH'], env: 'Temple Sanctuary', engagement: 'Stealth / CQB', hazard: 'None', scale: 'Tier 1-2' },
  ...(MEXICO_READY ? [{ key: 'mexico', name: 'DOODLE MEXICO', blurb: 'a sun-baked plaza · piñatas, tacos and mariachi', category: 'urban', tags: ['FAST CQB', 'MEDIUM', 'EARTH'], env: 'Sun-baked Plaza', engagement: 'CQB / Cover', hazard: 'None', scale: 'Tier 1-2' }] : []),
  {
    key: 'bus_station',
    name: 'CENTRAL BUS STATION',
    blurb: 'transit coaches, departure clock tower, passenger bays & luggage depots',
    category: 'urban',
    tags: ['FAST CQB', 'URBAN', 'TRANSIT'],
    env: 'Urban Transit Terminal',
    engagement: 'CQB & Vertical',
    hazard: 'Moving Traffic',
    scale: 'Tier 1-4',
    comingSoon: false
  },
  {
    key: 'retro_arcade',
    name: 'RETRO ARCADE & PINBALL',
    blurb: '16m tilted pinball table, vector CRT pit, air hockey plaza & neon skee-ball gallery',
    category: 'urban',
    tags: ['NEON 80S', 'KINETIC', 'AMUSEMENT'],
    env: 'Neon Amusement Palace',
    engagement: 'CQB & Vertical',
    hazard: 'Kinetic Bumpers & Pit Abyss',
    scale: 'Tier 1-4',
    comingSoon: false
  }
];

export function createBuilder(scene, world) {
  const geos = {}; const L = { rings: [], spawns: [], snipers: [], pickups: [], animated: [], meshes: [], playerStart: new THREE.Vector3(0, 0, 42), bounds: { minX: -55, maxX: 55, minZ: -55, maxZ: 55 }, arenaSpawns: [], grappleMovers: [], breakables: [], key: 'district' };
  const addGeo = (g, ink) => (geos[ink] || (geos[ink] = [])).push(g);
  const collider = (x, y, z, w, h, d, o = {}) => {
    const min = { x: x - w / 2, y, z: z - d / 2 };
    const max = { x: x + w / 2, y: y + h, z: z + d / 2 };
    looseOctree.addAABB([min.x, min.y, min.z], [max.x, max.y, max.z]);
    return world.addBox(min, max, { noNav: !!o.noNav, noShoot: !!o.noShoot, noGrapple: !!o.noGrapple, tag: o.tag });
  };
  function box(x, y, z, w, h, d, o = {}) {
    // Defensive sanitization against NaN dimensions
    const sw = Number.isFinite(w) && w > 0 ? w : 0.4;
    const sh = Number.isFinite(h) && h > 0 ? h : 0.4;
    const sd = Number.isFinite(d) && d > 0 ? d : 0.4;
    const sx = Number.isFinite(x) ? x : 0;
    const sy = Number.isFinite(y) ? y : 0;
    const sz = Number.isFinite(z) ? z : 0;
    const g = new THREE.BoxGeometry(sw, sh, sd);
    g.translate(sx, sy + sh / 2, sz);
    addGeo(g, o?.ink ?? INK.BLUE);
    if (!o?.noCollide) collider(sx, sy, sz, sw, sh, sd, o);
  }
  const slab = (x1, z1, x2, z2, y, t = 0.4, o = {}) => {
    const st = typeof t === 'number' && Number.isFinite(t) ? t : 0.4;
    const so = typeof t === 'object' && t !== null && !o ? t : (o || {});
    return box((x1 + x2) / 2, y - st, (z1 + z2) / 2, Math.abs(x2 - x1), st, Math.abs(z2 - z1), so);
  }; // top surface at y
  // Wall pieces along an axis with rectangular gaps [a1, a2, yBottom = 0, yTop = h]; gaps may overlap.
  function wallPieces(a1, a2, h, gaps) {
    const xs = new Set([a1, a2]);
    for (const g of gaps) { xs.add(Math.min(Math.max(g[0], a1), a2)); xs.add(Math.min(Math.max(g[1], a1), a2)); }
    const sorted = [...xs].sort((a, b) => a - b); const runs = new Map(); const out = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const s1 = sorted[i], s2 = sorted[i + 1]; if (s2 - s1 < 0.005) continue; const mid = (s1 + s2) / 2;
      const cuts = gaps.filter((g) => g[0] <= mid && g[1] >= mid).map((g) => [g[2] ?? 0, g[3] ?? h]).sort((a, b) => a[0] - b[0]);
      const pieces = []; let y = 0;
      for (const [gb, gt] of cuts) { if (gb > y + 0.005) pieces.push([y, gb]); y = Math.max(y, gt); }
      if (y < h - 0.005) pieces.push([y, h]);
      const keys = new Set();
      for (const [yb, yt] of pieces) { const k = yb.toFixed(3) + ',' + yt.toFixed(3); keys.add(k); const r = runs.get(k); if (r && Math.abs(r[1] - s1) < 0.005) r[1] = s2; else runs.set(k, [s1, s2, yb, yt]); }
      for (const [k, r] of [...runs]) if (!keys.has(k)) { out.push(r); runs.delete(k); }
    }
    for (const r of runs.values()) out.push(r);
    return out;
  }
  function wallX(x1, x2, z, y, h, t, gaps = [], o = {}) {
    for (const [a, b, yb, yt] of wallPieces(x1, x2, h, gaps)) box((a + b) / 2, y + yb, z, b - a, yt - yb, t, o);
  }
  function wallZ(z1, z2, x, y, h, t, gaps = [], o = {}) {
    for (const [a, b, yb, yt] of wallPieces(z1, z2, h, gaps)) box(x, y + yb, (a + b) / 2, t, yt - yb, b - a, o);
  }
  function stairs(x, y, z, dir, steps, width, o = {}) {
    const rise = o.rise ?? 4 / 14, run = o.run ?? 0.45;
    const dx = dir === '+x' ? 1 : dir === '-x' ? -1 : 0, dz = dir === '+z' ? 1 : dir === '-z' ? -1 : 0;
    for (let i = 0; i < steps; i++) {
      const c = (i + 0.5) * run, h = (i + 1) * rise; const cx = x + dx * c, cz = z + dz * c;
      box(cx, y, cz, dx ? run + 0.004 : width, h, dz ? run + 0.004 : width, o);
    }
    const endPt = { x: x + dx * steps * run, z: z + dz * steps * run, y: y + steps * rise };
    if (!L.stairways) L.stairways = [];
    L.stairways.push({ start: { x, y, z }, end: endPt, steps, rise, run, width, dir, opts: o });
    return endPt;
  }
  // railing along an axis-aligned segment: visual posts + bar, one collider
  function rail(x1, z1, x2, z2, y, o = {}) {
    const len = Math.hypot(x2 - x1, z2 - z1); const ax = Math.abs(x2 - x1) > Math.abs(z2 - z1);
    const cx = (x1 + x2) / 2, cz = (z1 + z2) / 2;
    box(cx, y + 0.9, cz, ax ? len : 0.12, 0.12, ax ? 0.12 : len, { noCollide: true, ink: o.ink });
    const n = Math.max(1, Math.round(len / 2));
    for (let i = 0; i <= n; i++) { const t = i / n; box(x1 + (x2 - x1) * t, y, z1 + (z2 - z1) * t, 0.1, 0.9, 0.1, { noCollide: true, ink: o.ink }); }
    collider(cx, y, cz, ax ? len : 0.12, 1.0, ax ? 0.12 : len, { noNav: true, noShoot: true });
  }
  function cyl(x, y, z, r, h, o = {}) {
    const g = new THREE.CylinderGeometry(r, r, h, o.seg ?? 12);
    if (o.axis === 'z') {
      g.rotateX(Math.PI / 2);
      g.translate(x, y, z);
      addGeo(g, o.ink ?? INK.BLUE);
      if (!o.noCollide) collider(x, y - r, z, r * 1.8, r * 2, h, o);
    } else if (o.axis === 'x') {
      g.rotateZ(Math.PI / 2);
      g.translate(x, y, z);
      addGeo(g, o.ink ?? INK.BLUE);
      if (!o.noCollide) collider(x, y - r, z, h, r * 2, r * 1.8, o);
    } else {
      g.translate(x, y + h / 2, z);
      addGeo(g, o.ink ?? INK.BLUE);
      if (!o.noCollide) collider(x, y, z, r * 1.6, h, r * 1.6, o);
    }
  }

  function barrel(x, y, z, r, h, o = {}) {
    // A barrel has 3 sections: top, middle (fatter), bottom.
    // And two black iron bands.
    // Top wood section
    cyl(x, y + h * 0.7, z, r * 0.85, h * 0.3, o);
    // Middle wood section (fatter)
    cyl(x, y + h * 0.3, z, r, h * 0.4, o);
    // Bottom wood section
    cyl(x, y, z, r * 0.85, h * 0.3, o);
    
    // Metal band 1
    cyl(x, y + h * 0.25, z, r * 0.95, h * 0.05, { ink: INK.BLACK, noCollide: true });
    // Metal band 2
    cyl(x, y + h * 0.7, z, r * 0.95, h * 0.05, { ink: INK.BLACK, noCollide: true });
  }

  function cone(x, y, z, r, h, o = {}) {
    const g = new THREE.ConeGeometry(r, h, o.seg ?? 16);
    if (o.axis === 'z') {
      g.rotateX(Math.PI / 2);
      g.translate(x, y, z);
    } else if (o.axis === 'x') {
      g.rotateZ(-Math.PI / 2);
      g.translate(x, y, z);
    } else {
      g.translate(x, y + h / 2, z);
    }
    addGeo(g, o.ink ?? INK.BLUE);
    if (!o.noCollide) collider(x, y, z, r * 2, h, r * 2, o);
  }

  function wedge(x, y, z, w, h, d, o = {}) {
    const sw = Number.isFinite(w) && w > 0 ? w : 1;
    const sh = Number.isFinite(h) && h > 0 ? h : 1;
    const sd = Number.isFinite(d) && d > 0 ? d : 1;
    
    // Normalize direction notation: +x, -x, +z, -z, x+, x-, z+, z-
    const rawDir = String(o.dir || '+x').toLowerCase();
    const dir = rawDir === 'x+' ? '+x' : rawDir === 'x-' ? '-x' : rawDir === 'z+' ? '+z' : rawDir === 'z-' ? '-z' : rawDir;
    
    // Use BoxGeometry and deform it so it remains indexed and compatible with mergeGeometries
    const g = new THREE.BoxGeometry(sw, sh, sd);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      if (pos.getX(i) > 0.001 && pos.getY(i) > 0.001) {
        pos.setY(i, -sh / 2);
      }
    }
    g.computeVertexNormals();
    g.translate(0, sh / 2, 0); 
    
    if (dir === '-x') g.rotateY(Math.PI);
    else if (dir === '+z') g.rotateY(-Math.PI / 2);
    else if (dir === '-z') g.rotateY(Math.PI / 2);
    
    g.translate(x, y, z);
    addGeo(g, o.ink ?? INK.BLUE);
    
    if (!o.noCollide) {
      if (o.collider === 'solid') {
        collider(x, y, z, sw, sh, sd, o);
      } else {
        // Stepped collider approximation hugging the slope to eliminate phantom under-ramp blockers
        if (dir === '+x' || dir === '-x') {
          const K = Math.max(2, Math.min(16, Math.max(Math.ceil(sw / 0.5), Math.ceil(sh / 0.30))));
          const stepW = sw / K;
          for (let i = 0; i < K; i++) {
            const stepH = dir === '+x' ? ((K - i) / K) * sh : ((i + 1) / K) * sh;
            const cx = (x - sw / 2) + (i + 0.5) * stepW;
            collider(cx, y, z, stepW + 0.004, Math.max(0.1, stepH), sd, o);
          }
        } else {
          // +z or -z slope
          const K = Math.max(2, Math.min(16, Math.max(Math.ceil(sd / 0.5), Math.ceil(sh / 0.30))));
          const stepD = sd / K;
          for (let i = 0; i < K; i++) {
            const stepH = dir === '+z' ? ((K - i) / K) * sh : ((i + 1) / K) * sh;
            const cz = (z - sd / 2) + (i + 0.5) * stepD;
            collider(x, y, cz, sw, Math.max(0.1, stepH), stepD + 0.004, o);
          }
        }
      }
    }
  }

  function hollowCyl(x, y, z, rInner, rOuter, length, o = {}) {
    const ri = Number.isFinite(rInner) && rInner > 0 ? rInner : 1.5;
    const ro = Number.isFinite(rOuter) && rOuter > ri ? rOuter : ri + 0.4;
    const len = Number.isFinite(length) && length > 0 ? length : 8;
    const seg = o.seg ?? 10;
    const halfLen = len / 2;
    const axis = o.axis === 'x' ? 'x' : 'z';

    // Annular profile rotated around Lathe Y axis
    const pts = [
      new THREE.Vector2(ri, -halfLen),
      new THREE.Vector2(ro, -halfLen),
      new THREE.Vector2(ro, halfLen),
      new THREE.Vector2(ri, halfLen),
      new THREE.Vector2(ri, -halfLen)
    ];
    const g = new THREE.LatheGeometry(pts, seg);
    if (axis === 'x') {
      g.rotateZ(Math.PI / 2);
    } else {
      g.rotateX(Math.PI / 2);
    }
    g.translate(x, y, z);
    addGeo(g, o.ink ?? INK.BLACK);

    // Optional decorative exterior bark / moss bands
    if (o.bands && o.bands > 0) {
      const bandCount = Math.min(8, o.bands);
      const bandSpacing = len / (bandCount + 1);
      for (let b = 1; b <= bandCount; b++) {
        const bg = new THREE.CylinderGeometry(ro + 0.06, ro + 0.06, 0.2, seg);
        if (axis === 'x') {
          bg.rotateZ(Math.PI / 2);
          bg.translate(x - halfLen + b * bandSpacing, y, z);
        } else {
          bg.rotateX(Math.PI / 2);
          bg.translate(x, y, z - halfLen + b * bandSpacing);
        }
        addGeo(bg, o.bandInk ?? INK.GREEN);
      }
    }

    // Walkable flat floor slab inside tube
    const f = o.f ?? 0.5;
    const floorW = Math.max(1.8, 2 * Math.sqrt(Math.max(0.1, ri * ri - Math.pow(Math.max(0, ri - f), 2))));
    const floorY = y - ri + f;
    if (o.floor !== false) {
      if (axis === 'x') {
        box(x, floorY - 0.25, z, len, 0.25, floorW, { ink: o.floorInk ?? (o.ink ?? INK.BLACK), tag: 'walkway' });
      } else {
        box(x, floorY - 0.25, z, floorW, 0.25, len, { ink: o.floorInk ?? (o.ink ?? INK.BLACK), tag: 'walkway' });
      }
    }

    // Honest AABB collision blockers: ceiling and side walls
    if (!o.noCollide) {
      const ceilY = y + ri - 0.25;
      const wallOffset = floorW / 2 + (ro - ri) / 2;
      const wallThick = Math.max(0.3, ro - ri + 0.1);
      const wallH = ro * 2;
      if (axis === 'x') {
        // Ceiling blocker
        collider(x, ceilY, z, len, 0.3, floorW, { noNav: true });
        // Side walls along traversal chord
        collider(x, y - ro, z - wallOffset, len, wallH, wallThick, { noNav: true });
        collider(x, y - ro, z + wallOffset, len, wallH, wallThick, { noNav: true });
      } else {
        // Ceiling blocker
        collider(x, ceilY, z, floorW, 0.3, len, { noNav: true });
        // Side walls along traversal chord
        collider(x - wallOffset, y - ro, z, wallThick, wallH, len, { noNav: true });
        collider(x + wallOffset, y - ro, z, wallThick, wallH, len, { noNav: true });
      }
    }
  }

  function facetedRock(x, y, z, rx, ry, rz, o = {}) {
    let sx = Number.isFinite(rx) && rx > 0 ? rx : 1.2;
    let sy = Number.isFinite(ry) && ry > 0 ? ry : 1.0;
    let sz = Number.isFinite(rz) && rz > 0 ? rz : 1.2;

    // Tactical cover role height clamping
    if (o.cover === 'waist') {
      sy = Math.max(0.85, Math.min(1.25, sy));
    } else if (o.cover === 'full') {
      sy = Math.max(2.5, Math.min(3.0, sy));
    }

    const g = new THREE.IcosahedronGeometry(1, 0); // Subdivision 0: 12 vertices, 20 large facets
    g.scale(sx, sy, sz);

    const pos = g.attributes.position;
    const seed = o.seed ?? 1337;
    const amp = o.amp ?? 0.25;

    // Deterministic radial vertex displacement (keyed by position hash to preserve face joints)
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i), vy = pos.getY(i), vz = pos.getZ(i);
      const h = Math.abs(Math.sin(vx * 12.9898 + vy * 78.233 + vz * 37.719 + seed) * 43758.5453) % 1;
      const disp = 1.0 + (h - 0.5) * 2 * amp;
      pos.setXYZ(i, vx * disp, vy * disp, vz * disp);
    }

    // Planar cut clamping to create sharp hand-drawn crystalline facets
    const planeCount = Math.max(3, Math.min(6, o.facets ?? 4));
    const planes = [];
    for (let p = 0; p < planeCount; p++) {
      const angle = (p / planeCount) * Math.PI * 2 + (seed % 7) * 0.2;
      const nx = Math.cos(angle);
      const ny = (p % 2 === 0 ? 0.3 : -0.2);
      const nz = Math.sin(angle);
      const len = Math.hypot(nx, ny, nz);
      planes.push({ nx: nx / len, ny: ny / len, nz: nz / len, d: 0.8 * Math.min(sx, sz) });
    }

    for (let i = 0; i < pos.count; i++) {
      let vx = pos.getX(i), vy = pos.getY(i), vz = pos.getZ(i);
      for (const pl of planes) {
        const dot = vx * pl.nx + vy * pl.ny + vz * pl.nz;
        if (dot > pl.d) {
          const excess = dot - pl.d;
          vx -= pl.nx * excess;
          vy -= pl.ny * excess;
          vz -= pl.nz * excess;
        }
      }
      // Grounding: flatten underside so rocks sit cleanly on terrain
      if (vy < 0) vy = 0;
      pos.setXYZ(i, vx, vy, vz);
    }

    // Ensure non-indexed geometry so each face maintains distinct normals for pen-ink crosshatching
    const finalGeo = g.index ? g.toNonIndexed() : g;
    finalGeo.computeVertexNormals();
    finalGeo.translate(x, y, z);
    addGeo(finalGeo, o.ink ?? INK.BLACK);

    if (!o.noCollide && o.cover !== 'decor') {
      collider(x, y, z, sx * 1.5, sy, sz * 1.5, { tag: o.cover === 'waist' ? 'cover' : (o.tag ?? 'rock') });
    }
  }

  function arch(x, y, z, span, height, depth, o = {}) {
    const s = Math.max(2.4, Number.isFinite(span) ? span : 3.0);
    const h = Math.max(2.6, Number.isFinite(height) ? height : 3.6);
    const d = Number.isFinite(depth) ? depth : 1.0;
    const thick = o.thick ?? 0.6;
    const axis = o.axis === 'x' ? 'x' : 'z';

    // Roman semicircular arch: spring line at height hs
    const R = s / 2;
    const hs = Math.max(0.6, h - R);

    // Flanking pillars
    if (axis === 'z') {
      box(x - (s / 2 + thick / 2), y, z, thick, hs, d, { ink: o.ink ?? INK.BLUE });
      box(x + (s / 2 + thick / 2), y, z, thick, hs, d, { ink: o.ink ?? INK.BLUE });
    } else {
      box(x, y, z - (s / 2 + thick / 2), d, hs, thick, { ink: o.ink ?? INK.BLUE });
      box(x, y, z + (s / 2 + thick / 2), d, hs, thick, { ink: o.ink ?? INK.BLUE });
    }

    // Semicircular chorded arc segments
    const N = Math.max(6, Math.min(16, o.seg ?? 8));
    const arcR = R + thick / 2;
    const chordLen = 2 * arcR * Math.sin(Math.PI / (2 * N)) + 0.04;

    for (let i = 0; i < N; i++) {
      const a = ((i + 0.5) / N) * Math.PI; // from 0 to PI
      const cosA = Math.cos(a);
      const sinA = Math.sin(a);
      const arcX = -arcR * cosA;
      const arcY = hs + arcR * sinA;

      const chord = new THREE.BoxGeometry(chordLen, thick, d);
      chord.rotateZ(a - Math.PI / 2);
      if (axis === 'x') {
        chord.rotateY(Math.PI / 2);
        chord.translate(x, y + arcY, z + arcX);
      } else {
        chord.translate(x + arcX, y + arcY, z);
      }
      addGeo(chord, o.ink ?? INK.BLUE);

      if (!o.noCollide) {
        if (axis === 'x') {
          collider(x, y + arcY - thick / 2, z + arcX, d, thick, chordLen, { noNav: true });
        } else {
          collider(x + arcX, y + arcY - thick / 2, z, chordLen, thick, d, { noNav: true });
        }
      }
    }
    // OPENING EMITS ZERO COLLIDERS: player and bot nav path straight through the portal
  }

  function sphere(x, y, z, r, o = {}) { const g = new THREE.SphereGeometry(r, o.seg ?? 10, o.seg ?? 8); g.translate(x, y, z); addGeo(g, o.ink ?? INK.BLUE); }
  function ring(x, y, z, axis = 'z') {
    const g = new THREE.TorusGeometry(0.6, 0.1, 8, 20);
    if (axis === 'x') g.rotateY(Math.PI / 2); else if (axis === 'y') g.rotateX(Math.PI / 2);
    g.translate(x, y, z); addGeo(g, INK.ORANGE);
    L.rings.push(new THREE.Vector3(x, y, z));
  }
  const spawn = (x, y, z) => L.spawns.push(new THREE.Vector3(x, y, z));
  const sniper = (x, y, z) => L.snipers.push(new THREE.Vector3(x, y, z));
  const pickup = (x, y, z) => L.pickups.push(new THREE.Vector3(x, y, z));
  // ---------------- shared finish ----------------
  function finish() {
    for (const ink in geos) {
      const list = geos[ink];
      if (!list || list.length === 0) continue;
      const hasIndexed = list.some(g => !!g.index);
      const hasNonIndexed = list.some(g => !g.index);
      const uniformList = (hasIndexed && hasNonIndexed)
        ? list.map(g => g.index ? g.toNonIndexed() : g)
        : list;
      const anyHasUV = uniformList.some(g => !!g.attributes.uv);
      const allHaveUV = uniformList.every(g => !!g.attributes.uv);
      if (anyHasUV && !allHaveUV) {
        uniformList.forEach(g => {
          if (!g.attributes.uv) {
            const count = g.attributes.position.count;
            g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(count * 2), 2));
          }
        });
      }
      uniformList.forEach(g => {
        if (!g.attributes.normal) g.computeVertexNormals();
        for (const attrName in g.attributes) {
          if (attrName !== 'position' && attrName !== 'normal' && attrName !== 'uv') {
            g.deleteAttribute(attrName);
          }
        }
      });
      const merged = mergeGeometries(uniformList, false);
      if (merged) {
        const mesh = new THREE.Mesh(merged, makeInkMaterial({ ink: Number(ink) }));
        mesh.matrixAutoUpdate = false; scene.add(mesh); L.meshes.push(mesh);
      }
    }
    world.finalize();
    return L;
  }
  // a paper plane that loops overhead, purely decorative
  function planes(n, baseR, baseH, o = {}) {
    const sc = o.scale || 1;
    for (let i = 0; i < n; i++) {
      const g = new THREE.ConeGeometry(1.2 * sc, 4 * sc, 3); g.rotateX(Math.PI / 2);
      const m = new THREE.Mesh(g, makeInkMaterial({ ink: o.ink ?? INK.BLUE })); scene.add(m); L.meshes.push(m);
      L.grappleMovers.push({ mesh: m, radius: 2.2 * sc });
      const r = baseR + i * (o.rStep ?? 12), h = baseH + i * (o.hStep ?? 6), ph = i * 2.1, sp = (o.speed ?? 0.11) + i * 0.01;
      L.animated.push({ mesh: m, update: (t) => { const a = t * sp + ph; m.position.set(Math.cos(a) * r, h + Math.sin(a * 2.3) * 3, Math.sin(a) * r * 0.7); m.lookAt(Math.cos(a + 0.05) * r, h + Math.sin((a + 0.05) * 2.3) * 3, Math.sin(a + 0.05) * r * 0.7); m.rotateZ(Math.sin(a * 3) * 0.6); } });
    }
  }
  const B = { L, addGeo, collider, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, barrel, cone, wedge, hollowCyl, facetedRock, arch, ring, spawn, sniper, pickup, finish, planes, scene, world };
  B.splineTube = (pts, o) => splineTube(B, pts, o);
  B.annularDeck = (cx, cz, ri, ro, y, o) => annularDeck(B, cx, cz, ri, ro, y, o);
  B.sweptRibbon = (pts, o) => sweptRibbon(B, pts, o);
  return B;
}





// ============================ map 2: Doodle Mexico ============================
// A sun-baked pueblo: a plaza with a fountain and a floating sombrero, a bandstand full of mariachis,
// a church with a bell tower, adobe houses, a market of piñatas, a taco cart, and mesas all around.
// Pots, crates, barrels, cacti and piñatas all break.




export const MAP_BUILDERS = {
  district: buildDistrict,
  classroom: buildClassroom,
  desk: buildClassroom,
  clockwork: buildClockwork,
  tower: buildClockwork,
  zen: buildZen,
  garden: buildZen,
  studio: buildStudio,
  mexico: buildMexico,
  forest: buildForest,
  bus_station: buildBusStation,
  retro_arcade: buildRetroArcade
};

export function registerMapBuilder(key, builderFn) {
  if (typeof builderFn === 'function') {
    MAP_BUILDERS[key] = builderFn;
  }
}

export function buildLevel(scene, world, key = 'district', opts = {}) {
  const B = createBuilder(scene, world);
  const builder = MAP_BUILDERS[key];
  if (typeof builder === 'function') {
    return builder(B, !!opts.arena);
  }
  console.warn(`[buildLevel] Map "${key}" has no builder registered; falling back to "district".`);
  return buildDistrict(B, !!opts.arena);
}

