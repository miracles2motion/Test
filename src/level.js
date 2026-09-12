// Level construction. Two maps share one builder: everything is merged ink geometry plus
// axis-aligned box colliders, which is what the navigation grid is generated from.
import { buildCove } from './levels/cove.js';
import { buildHarborPort } from './levels/harbor_port.js';
import { buildPirateCove } from './levels/pirate_cove.js';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { makeInkMaterial, INK } from './render.js';
import { rand, choose, TAU } from './util.js';
import { buildHumanoid } from './enemies.js';
import { buildZen } from './levels/zen.js';

// Doodle Mexico is built and kept, but off the menu until it is ready; flip this to offer it again
export const MEXICO_READY = false;
export const LEVELS = [
  { key: 'district', name: 'DOODLE DISTRICT', blurb: 'streets, rooftops and fire escapes', category: 'urban', tags: ['FAST CQB', 'MEDIUM', 'EARTH'], env: 'Urban Streets', engagement: 'CQB / Grapple', hazard: 'Lethal Abyss', scale: 'Tier 1-3' },
  { key: 'classroom', name: 'THE GIANT CLASSROOM', blurb: 'towering desks, crashed paper planes, staplers & science lab', category: 'colossal', tags: ['VERTICAL', 'MASSIVE', 'EARTH'], env: 'Colossal', engagement: 'Sniping / Grapple', hazard: 'Fall Damage', scale: 'Tier 1-4' },
  { key: 'seas', name: 'THE INK SEAS', comingSoon: true, blurb: 'twin galleons, rigging, and kraken tentacles', category: 'colossal', tags: ['VERTICAL', 'TITANIC', 'MARITIME'], env: 'Maritime Combat', engagement: 'Ship-to-Ship / Grapple', hazard: 'Drowning', scale: 'Tier 1-5' },
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
    key: 'pirate_cove',
    name: 'PIRATE COVE',
    category: 'urban',
    tags: ['DREAM MODE', 'AUTO-GENERATED'],
    env: 'PIRATE COVE Environment',
    engagement: 'CQB & Vertical',
    hazard: 'TBD',
    scale: 'Tier 1-4',
    comingSoon: false
  },
  {
    key: 'harbor_port',
    name: 'HARBOR PORT',
    category: 'urban',
    tags: ['DREAM MODE', 'AUTO-GENERATED'],
    env: 'HARBOR PORT Environment',
    engagement: 'CQB & Vertical',
    hazard: 'TBD',
    scale: 'Tier 1-4',
    comingSoon: false
  },
  {
    key: 'cove',
    name: 'COVE',
    category: 'urban',
    tags: ['DREAM MODE', 'AUTO-GENERATED'],
    env: 'COVE Environment',
    engagement: 'CQB & Vertical',
    hazard: 'TBD',
    scale: 'Tier 1-4',
    comingSoon: false
  }
];

function createBuilder(scene, world) {
  const geos = {}; const L = { rings: [], spawns: [], snipers: [], pickups: [], animated: [], meshes: [], playerStart: new THREE.Vector3(0, 0, 42), bounds: { minX: -55, maxX: 55, minZ: -55, maxZ: 55 }, arenaSpawns: [], grappleMovers: [], breakables: [], key: 'district' };
  const addGeo = (g, ink) => (geos[ink] || (geos[ink] = [])).push(g);
  const collider = (x, y, z, w, h, d, o = {}) => world.addBox({ x: x - w / 2, y, z: z - d / 2 }, { x: x + w / 2, y: y + h, z: z + d / 2 }, { noNav: !!o.noNav, noShoot: !!o.noShoot, noGrapple: !!o.noGrapple, tag: o.tag });
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
      const merged = mergeGeometries(geos[ink], false);
      const mesh = new THREE.Mesh(merged, makeInkMaterial({ ink: Number(ink) }));
      mesh.matrixAutoUpdate = false; scene.add(mesh); L.meshes.push(mesh);
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
  return { L, addGeo, collider, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, finish, planes, scene, world };
}

// ============================ map 1: Doodle District ============================
function buildDistrict(B, arena = false) {
  const { L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider } = B;
  // ---------------- ground + perimeter ----------------
  // solo keeps the tight old block; a match gets a far wider arena, a dome and a hanging playground
  const P = arena ? 68 : 55, T = 6, PH = arena ? 30 : 18, E = P - 3.8, D = P - 3;
  L.bounds.minX = -P; L.bounds.maxX = P; L.bounds.minZ = -P; L.bounds.maxZ = P;
  box(0, -1, 0, 2 * P + T, 1, 2 * P + T);
  box(0, 0, -P, 2 * P + T, PH, T); box(0, 0, P, 2 * P + T, PH, T); box(-P, 0, 0, T, PH, 2 * P + T); box(P, 0, 0, T, PH, 2 * P + T);
  if (!arena) {
    // solo: the walls carry on upward unseen and unhookable, so their tops are not a place to camp, and a lid closes the sky
    const NG = { noNav: true, noGrapple: true };
    collider(0, PH, -P, 2 * P + T, 40, T, NG); collider(0, PH, P, 2 * P + T, 40, T, NG); collider(-P, PH, 0, T, 40, 2 * P + T, NG); collider(P, PH, 0, T, 40, 2 * P + T, NG);
    collider(0, 56, 0, 2 * P + 40, 8, 2 * P + 40, NG);
    const R = 96, C = -22;
    for (let k = 0; k < 6; k++) { const g = new THREE.TorusGeometry(R, 0.5, 5, 80, Math.PI); g.rotateY(k * Math.PI / 6); g.translate(0, C, 0); addGeo(g, INK.BLUE); }
    for (const h of [30, 46, 60, 70]) { const r = Math.sqrt(R * R - (h - C) * (h - C)); const g = new THREE.TorusGeometry(r, 0.4, 5, 96); g.rotateX(Math.PI / 2); g.translate(0, h, 0); addGeo(g, INK.BLUE); }
  }
  // ledges / balconies on the perimeter (grapple + stand)
  const ledges = [[-30, -E, 8, 1.6], [30, -E, 8, 1.6], [-E, 40, 1.6, 8], [E, -10, 1.6, 8], [-E, -30, 1.6, 6], [E, 35, 1.6, 6], [10, E, 8, 1.6], [-40, E, 6, 1.6]];
  for (const [x, z, w, d] of ledges) {
    box(x, 9, z, w, 0.4, d); box(x, 5.5, z, w, 0.4, d);
    if (arena) { box(x, 16, z, w, 0.4, d); ring(x, 20, z, 'y'); }
  }
  // spawn doorways in the perimeter (visual frames)
  const doorFrame = (x, z, alongX) => { if (alongX) { box(x - 1.2, 0, z, 0.3, 3.2, 0.5, { noCollide: true, ink: INK.BLACK }); box(x + 1.2, 0, z, 0.3, 3.2, 0.5, { noCollide: true, ink: INK.BLACK }); box(x, 3.0, z, 2.7, 0.3, 0.5, { noCollide: true, ink: INK.BLACK }); } else { box(x, 0, z - 1.2, 0.5, 3.2, 0.3, { noCollide: true, ink: INK.BLACK }); box(x, 0, z + 1.2, 0.5, 3.2, 0.3, { noCollide: true, ink: INK.BLACK }); box(x, 3.0, z, 0.5, 0.3, 2.7, { noCollide: true, ink: INK.BLACK }); } };
  for (const [x, z] of [[-D, 0], [D, 0], [-D, 30], [D, -30], [-D, -30], [D, 30]]) { doorFrame(x, z, false); spawn(x + (x < 0 ? 1.2 : -1.2), 0, z); }
  for (const [x, z] of [[0, -D], [0, D], [-30, D], [30, D]]) { doorFrame(x, z, true); spawn(x, 0, z + (z < 0 ? 1.2 : -1.2)); }
  if (arena) {
    // where a match drops people in: rooftops, the highway, the field edges and the outer ring
    for (const [x, y, z] of [[-34, 12.2, 12], [34, 12.2, 12], [-30, 7.2, -45], [16, 7.2, -45], [0, 7.4, -30], [-44, 0, -10], [44, 0, -10], [-40, 0, 40], [40, 0, 40], [0, 0, 55], [-58, 0, 0], [58, 0, 0], [0, 0, -58], [-54, 0, 54], [54, 0, -54]]) L.arenaSpawns.push(new THREE.Vector3(x, y, z));
    // a few low things on the field, nothing to hide a whole person
    box(-8, 0, 20, 3, 1, 1.2); box(10, 0, 26, 1.4, 1.2, 1.4); box(-12, 0, -8, 2.4, 0.8, 2.4); box(14, 0, -4, 2.4, 0.8, 2.4);
    for (const [x, z] of [[-56, 30], [56, -30], [30, -56], [-30, 56]]) { box(x, 0, z, 0.3, 7, 0.3, { noNav: true }); box(x, 7, z, 1.4, 0.3, 0.3, { noCollide: true }); addGeo(new THREE.SphereGeometry(0.45, 8, 6).translate(x + 0.7, 6.8, z), INK.ORANGE); }
    // the dome: ribs to look at, plus an invisible shell of bands that stops you and shrugs off the hook
    const R = 120, C = -30; const domeY = (x, z) => Math.sqrt(Math.max(1, R * R - x * x - z * z)) + C;
    for (let k = 0; k < 8; k++) { const g = new THREE.TorusGeometry(R, 0.6, 5, 96, Math.PI); g.rotateY(k * Math.PI / 8); g.translate(0, C, 0); addGeo(g, INK.BLUE); }
    for (const h of [38, 54, 68, 80, 88]) { const r = Math.sqrt(R * R - (h - C) * (h - C)); const g = new THREE.TorusGeometry(r, 0.5, 5, 128); g.rotateX(Math.PI / 2); g.translate(0, h, 0); addGeo(g, INK.BLUE); }
    addGeo(new THREE.SphereGeometry(2.4, 10, 8).translate(0, R + C, 0), INK.RED);
    const NG = { noNav: true, noGrapple: true };
    collider(0, 88, 0, 300, 10, 300, NG);
    for (let y0 = PH; y0 < 88; y0 += 4) { const inner = Math.sqrt(Math.max(0, R * R - (y0 + 4 - C) ** 2)); if (inner > P + T) continue; const o = inner + 80; collider(0, y0, -o, 320, 4, 160, NG); collider(0, y0, o, 320, 4, 160, NG); collider(-o, y0, 0, 160, 4, 320, NG); collider(o, y0, 0, 160, 4, 320, NG); }
    // a few pads hung from the dome, spread over the map so a swing has somewhere to land
    const cable = (x, y, z) => box(x, y, z, 0.12, Math.max(1, domeY(x, z) - y), 0.12, { noCollide: true, ink: INK.BLACK });
    const pad = (x, y, z, w, d) => { box(x, y, z, w, 0.5, d, { noNav: true }); cable(x, y + 0.5, z); ring(x, y - 1.3, z, 'y'); };
    for (const [x, y, z, w, d] of [[0, 24, 0, 8, 8], [-42, 18, -24, 6, 6], [44, 21, 30, 6, 6], [28, 27, -46, 5, 5], [-30, 30, 44, 5, 5]]) pad(x, y, z, w, d);
    // paper planes big enough to hook: they loop around the map at different heights
    planes(4, 30, 26, { scale: 1.7, rStep: 9, hStep: 6, speed: 0.11, ink: INK.BLUE });
  }

  // ---------------- central tower (solo only: a match wants the field open) ----------------
  if (!arena) {
    const W = 14, H = 4, hw = W / 2;
    for (let f = 1; f <= 4; f++) slab(-hw, -hw, hw, hw, f * H, 0.4);
    for (const [px, pz] of [[-6.6, -6.6], [6.6, -6.6], [-6.6, 6.6], [6.6, 6.6], [0, -6.6], [0, 6.6], [-6.6, 0], [6.6, 0]]) box(px, 0, pz, 0.8, 16, 0.8);
    for (let f = 1; f <= 3; f++) {
      const y = f * H;
      rail(-hw, hw, -1.5, hw, y); rail(1.5, hw, hw, hw, y); // south edge with a gap
      rail(-hw, -hw, hw, -hw, y); // west
      rail(hw, -hw, hw, hw, y); // east
      rail(-hw, -hw, -6.5, -hw, y); rail(3.5, -hw, hw, -hw, y); // north edge with landing gaps
    }
    // roof parapet with gaps, crane
    rail(-5, -hw, hw, -hw, 16); rail(-hw, hw, -1.5, hw, 16); rail(1.5, hw, hw, hw, 16); rail(-hw, -hw, -hw, hw, 16); rail(hw, -hw, hw, 3, 16);
    box(5.5, 16, 5.5, 1, 10, 1); box(5.5, 25.2, 5.5, 1.6, 1.4, 1.6, { noCollide: true });
    box(11.5, 25, 5.5, 16, 0.8, 0.8); box(1, 25, 5.5, 5, 0.8, 0.8); box(-0.5, 23.6, 5.5, 2, 1.6, 1.6);
    box(19, 20.5, 5.5, 0.08, 4.6, 0.08, { noCollide: true, ink: INK.BLACK });
    ring(19, 19.8, 5.5, 'x'); ring(19.5, 24.6, 5.5, 'z');   // only the crane keeps its rings
    // exterior switchback stairs on the north face (x runs -5..1.3, landings each side)
    // two-lane switchback: flights alternate between lanes so no flight sits directly under the next one
    let y = 0;
    for (let f = 0; f < 4; f++) {
      const dir = f % 2 === 0 ? '+x' : '-x'; const sx = dir === '+x' ? -5 : 1.3; const lane = f % 2 === 0 ? -8.3 : -10.3;
      stairs(sx, y, lane, dir, 14, 1.8); y += 4;
      const lx1 = dir === '+x' ? 1.3 : -8.6;
      const lx2 = dir === '+x' ? 4.9 : -5.0;
      slab(lx1, -13.0, lx2, -7, y, 0.4);
      rail(lx1, -13.0, lx2, -13.0, y);
      if (dir === '+x') rail(lx2, -13.0, lx2, -7.0, y);
      else rail(lx1, -13.0, lx1, -7.0, y);
    }
    spawn(0, 8, 0); spawn(0, 4, 3); sniper(0, 16, -3); pickup(0, 12, 0); pickup(-4, 8, 4); pickup(0, 16, 0);
  }

  // ---------------- building A (west): 3 floors, fire escape, ruler bridge to the tower ----------------
  {
    const x1 = -43, x2 = -25, z1 = 4, z2 = 20, H = 4;
    for (let f = 1; f <= 3; f++) slab(x1, z1, x2, z2, f * H, 0.4);
    // exterior walls with doors/windows
    wallZ(z1, z2, x2, 0, 12, 0.4, [[10, 13, 0, 3.2], [6, 9, 5, 7], [14, 17, 5, 7], [6, 9, 9, 11], [14, 17, 9, 11]]); // east face
    wallZ(z1, z2, x1, 0, 12, 0.4, [[8, 11, 0, 3.2], [8, 11, 4.5, 7.5], [8, 11, 8.5, 11.5]]); // west face
    wallX(x1, x2, z1, 0, 12, 0.4, [[-36, -33, 0, 3.2], [-40, -37, 5, 7], [-31, -28, 5, 7], [-36, -32, 8.5, 11.5]]); // north face
    wallX(x1, x2, z2, 0, 12, 0.4, [[-36, -32, 0, 3.2], [-31, -27, 0, 3.2], [-42, -39, 0, 3.2], [-37.2, -33.5, 4.05, 7.2], [-36, -32, 8.4, 11.4], [-41, -27, 4.6, 7.6], [-29, -25.5, 8.05, 11.2]]); // south face
    // interior partitions
    wallX(x1, x2, 12, 0, 4, 0.3, [[-40, -37.5], [-30, -27.5]]);
    wallX(x1, x2, 12, 4, 4, 0.3, [[-36, -32]]);
    wallZ(z1, z2, -34, 8, 4, 0.3, [[8, 11], [14, 17]]);
    // roof parapet with gaps
    rail(x1, z1, -37, z1, 12); rail(-31, z1, x2, z1, 12); rail(x1, z2, -37.4, z2, 12); rail(-34.4, z2, x2, z2, 12); rail(x1, z1, x1, z2, 12); rail(x2, z1, x2, 9, 12); rail(x2, 15, x2, z2, 12);
    // fire escape: switchback on the south face (z 21..23)
    let y = 0;
    for (let f = 0; f < 3; f++) {
      const dir = f % 2 === 0 ? '-x' : '+x'; const sx = dir === '-x' ? -28.5 : -34.8; const lane = f % 2 === 0 ? 21.2 : 23.2;
      stairs(sx, y, lane, dir, 14, 1.8); y += 4;
      const lx1 = dir === '-x' ? -38.4 : -28.5;
      const lx2 = dir === '-x' ? -34.8 : -24.9;
      slab(lx1, 20.2, lx2, 25.8, y, 0.4);
      rail(lx1, 25.8, lx2, 25.8, y);
      if (dir === '-x') rail(lx1, 20.2, lx1, 25.8, y);
      else rail(lx2, 20.2, lx2, 25.8, y);
    }
    // ruler bridge from the A roof: to the tower's third floor in solo, right across to building B in a match (y=12)
    { const bx2 = arena ? 24.2 : -7; const len = bx2 + 25.2;
      box((bx2 - 25.2) / 2, 11.6, 6, len, 0.4, 2.4, { ink: INK.ORANGE });
      for (let i = 0; i <= Math.floor(len); i++) box(-25 + i, 12, 5, 0.06, 0.02, i % 5 === 0 ? 0.6 : 0.35, { noCollide: true, ink: INK.BLACK });
      rail(-25, 7.2, bx2, 7.2, 12, { ink: INK.ORANGE }); if (arena) rail(-25, 4.8, bx2, 4.8, 12, { ink: INK.ORANGE }); }
    
    spawn(-34, 12, 12); spawn(-40, 0, 18); sniper(-27, 12, 6); pickup(-34, 4, 12); pickup(-30, 12, 16); pickup(-40, 8, 8);
  }

  // ---------------- building B (east): warehouse with catwalk + skylight ----------------
  {
    const x1 = 24, x2 = 44, z1 = 4, z2 = 20;
    // roof with a 6x6 skylight hole in the middle
    slab(x1, z1, x2, 9, 12, 0.4); slab(x1, 15, x2, z2, 12, 0.4); slab(x1, 9, 31, 15, 12, 0.4); slab(37, 9, x2, 15, 12, 0.4);
    wallZ(z1, z2, x1, 0, 12, 0.4, [[10, 14, 0, 3.6], [6, 9, 7, 10], [15, 18, 7, 10]]); // west face
    wallZ(z1, z2, x2, 0, 12, 0.4, [[7, 10, 0, 3.2], [14, 17, 0, 3.2], [8, 16, 7, 10]]); // east face
    wallX(x1, x2, z1, 0, 12, 0.4, [[32, 36, 0, 3.6], [27, 30, 7, 10], [38, 41, 7, 10]]); // north face
    wallX(x1, x2, z2, 0, 12, 0.4, [[26, 29, 0, 3.2], [39, 42, 0, 3.2], [33.5, 36.5, 4.05, 7.2], [25.5, 28.5, 8.05, 11.2], [32, 36, 8, 11]]); // south face
    // catwalk at y=6 around the inside walls (1.6 wide), interior stairs along the west wall
    slab(x1 + 0.4, z1 + 0.4, x1 + 2, 8.6, 6, 0.3); slab(x1 + 0.4, 18.0, x1 + 2, z2 - 0.4, 6, 0.3); slab(x2 - 2, z1 + 0.4, x2 - 0.4, z2 - 0.4, 6, 0.3);
    slab(x1 + 2, z1 + 0.4, x2 - 2, z1 + 2, 6, 0.3); slab(x1 + 2, z2 - 2, x2 - 2, z2 - 0.4, 6, 0.3);
    rail(x1 + 2, z1 + 2, x1 + 2, 9, 6); rail(x1 + 2, 15, x1 + 2, 17, 6); rail(x2 - 2, z1 + 2, x2 - 2, z2 - 2, 6);
    rail(x1 + 2, z1 + 2, 31, z1 + 2, 6); rail(37, z1 + 2, x2 - 2, z1 + 2, 6); rail(x1 + 2, z2 - 2, x2 - 2, z2 - 2, 6);
    stairs(26.2, 0, 8.6, '+z', 21, 1.6, { rise: 6 / 21, run: 0.45 }); // arrives at z=18.05, y=6 onto the catwalk
    // crates inside
    box(34, 0, 12, 2.4, 2.4, 2.4); box(36.4, 0, 12, 2.4, 1.2, 2.4); box(30, 0, 16, 1.6, 1.6, 1.6, { ink: INK.GREEN });
    // exterior switchback on the south face to the roof (z 21..23)
    let y = 0;
    for (let f = 0; f < 3; f++) {
      const dir = f % 2 === 0 ? '+x' : '-x'; const sx = dir === '+x' ? 27.5 : 33.8; const lane = f % 2 === 0 ? 21.2 : 23.2;
      stairs(sx, y, lane, dir, 14, 1.8); y += 4;
      const lx = dir === '+x' ? 34.9 : 26.4; slab(lx - 1.1, 20.2, lx + 1.1, 24.4, y, 0.4);
      rail(lx - 1.1, 24.4, lx + 1.1, 24.4, y);
    }
    rail(x1, z1, 31, z1, 12); rail(37, z1, x2, z1, 12); rail(x1, z2, 33.4, z2, 12); rail(36.4, z2, x2, z2, 12); rail(x2, z1, x2, z2, 12); rail(x1, z1, x1, 9, 12); rail(x1, 15, x1, z2, 12);
    // plank bridge tower floor 3 -> B roof
    box(15.5, 11.6, 6, 17.4, 0.4, 2.2); rail(7, 4.9, 24, 4.9, 12);
    
    spawn(34, 12, 18); spawn(40, 0, 8); sniper(26, 12, 18); pickup(34, 0, 12); pickup(34, 6, 19); pickup(42, 12, 6);
  }

  // ---------------- highway ----------------
  {
    const z = -30, y = 7;
    slab(-52, z - 4.5, 52, z + 4.5, y, 0.6);
    wallX(-52, 52, z - 4.3, y, 0.9, 0.4, [[-33, -29], [27, 31], [-2, 2]]); // north barrier gaps: bridges to houses
    wallX(-52, 52, z + 4.3, y, 0.9, 0.4, [[-36.5, -33], [33, 36.5]]); // south barrier gaps: stairs
    for (let x = -48; x <= 48; x += 12) box(x, 0, z, 1.4, 6.4, 1.4);
    stairs(-46.5, 0, z + 5.5, '+x', 25, 2, { rise: 0.28, run: 0.45 }); stairs(46.5, 0, z + 5.5, '-x', 25, 2, { rise: 0.28, run: 0.45 });
    
    // road markings
    for (let x = -50; x < 50; x += 4) box(x + 1, y, z, 2, 0.02, 0.2, { noCollide: true, ink: INK.BLACK });
    spawn(-48, y, z); spawn(48, y, z); sniper(0, y, z); pickup(-10, y, z); pickup(24, y, z);
  }

  // ---------------- row houses (north) ----------------
  {
    const z = -45;
    box(-30, 0, z, 14, 7, 10); box(-8, 0, z, 14, 11, 10); box(16, 0, z, 14, 7, 10);
    // bridges from the highway to house 1 and house 3 (y=7)
    box(-31, 6.7, -37.25, 2.6, 0.3, 5.5); box(29, 6.7, -37.25, 2.6, 0.3, 5.5); box(0, 6.7, -37.25, 2.6, 0.3, 5.5);
    rail(-32.3, -40, -32.3, -34.5, 7); rail(-29.7, -40, -29.7, -34.5, 7); rail(27.7, -40, 27.7, -34.5, 7); rail(30.3, -40, 30.3, -34.5, 7);
    // stairs house1 roof -> house2 roof (over the gap)
    stairs(-23, 7, z, '+x', 14, 2.2); slab(-16.9, z - 1.1, -15, z + 1.1, 11, 0.4);
    // stairs house3 roof -> house2 roof
    stairs(9, 7, z, '-x', 14, 2.2); slab(-1, z - 1.1, 2.9, z + 1.1, 11, 0.4);
    // chimneys, water tank, doodle antenna
    box(-33, 7, z - 3, 1.2, 1.6, 1.2); box(19, 7, z + 3, 1.2, 1.4, 1.2); cyl(-10, 11, z - 2.5, 1.4, 2.6, { seg: 14 });
    box(-5, 11, z + 3, 0.1, 4, 0.1, { noCollide: true, ink: INK.BLACK });
    
    spawn(-8, 11, z); spawn(-30, 7, z - 3); spawn(16, 7, z); sniper(-8, 11, z - 3); sniper(16, 7, z + 2); pickup(-8, 11, z + 2); pickup(-30, 7, z);
  }

  // ---------------- south plaza: containers, crates, bus, doodle props (solo only) ----------------
  if (!arena) {
    box(-14, 0, 34, 2.5, 2.6, 6.2, { ink: INK.GREEN }); box(-14, 2.6, 34, 2.5, 2.6, 6.2, { ink: INK.ORANGE });
    box(14, 0, 36, 6.2, 2.6, 2.5); box(17, 2.6, 36, 3, 2.6, 2.5, { ink: INK.GREEN });
    box(-6, 0, 28, 1.4, 1.4, 1.4); box(-4.5, 0, 28.5, 1.2, 1.2, 1.2); box(-5.3, 1.4, 28.2, 1.0, 1.0, 1.0);
    box(8, 0, 26, 1.6, 1.6, 1.6); box(9.6, 0, 26.4, 1.2, 1.2, 1.2);
    // bus
    box(24, 0.6, 40, 11, 3.2, 2.8); box(24, 0, 40, 10, 0.6, 2.6, { noCollide: true }); for (const x of [20, 28]) { cyl(x, 0, 41.5, 0.55, 0.4, { noCollide: true, seg: 10, ink: INK.BLACK }); cyl(x, 0, 38.5, 0.55, 0.4, { noCollide: true, seg: 10, ink: INK.BLACK }); }
    // giant pencil lying on the ground (orange body, black tip, pink eraser)
    { const g = new THREE.CylinderGeometry(0.8, 0.8, 16, 6); g.rotateZ(Math.PI / 2); g.translate(-30, 0.8, 44); addGeo(g, INK.ORANGE); collider(-30, 0, 44, 16, 1.6, 1.6);
      const tip = new THREE.ConeGeometry(0.8, 2.4, 6); tip.rotateZ(-Math.PI / 2); tip.translate(-20.8, 0.8, 44); addGeo(tip, INK.BLACK); collider(-20.8, 0, 44, 2.4, 1.6, 1.6);
      const er = new THREE.CylinderGeometry(0.82, 0.82, 1.6, 8); er.rotateZ(Math.PI / 2); er.translate(-38.8, 0.8, 44); addGeo(er, INK.PINK); collider(-38.8, 0, 44, 1.6, 1.64, 1.64); }
    // giant eraser block (pink) + coffee mug (blue) props to climb
    box(38, 0, 40, 6, 2.2, 3.2, { ink: INK.PINK }); box(38, 2.2, 40, 6, 0.8, 3.2, { ink: INK.BLUE });
    cyl(-40, 0, 32, 2.6, 3.4, { seg: 16 }); { const h = new THREE.TorusGeometry(1.4, 0.35, 8, 16); h.translate(-36.6, 1.8, 32); addGeo(h, INK.BLUE); }
    // lamp posts + benches
    for (const [x, z] of [[-10, 46], [10, 46], [-22, 24], [22, 24]]) { box(x, 0, z, 0.25, 6, 0.25); box(x, 6, z, 1.4, 0.3, 0.5, { noCollide: true }); }
    for (const [x, z] of [[-4, 46], [4, 46]]) { box(x, 0.4, z, 3, 0.15, 0.6); box(x, 0, z, 2.6, 0.4, 0.2, { noCollide: true }); }
    pickup(-6, 0, 36); pickup(6, 0, 36); pickup(-30, 1.6, 44); pickup(38, 3, 40); pickup(0, 0, 10);
    // scattered cover in the open middle areas
    box(-16, 0, -8, 2.2, 1.2, 2.2); box(18, 0, -10, 2.2, 1.6, 2.2); box(-20, 0, 8, 1.6, 1.0, 3); box(20, 0, -2, 3, 1.0, 1.6);
    box(-8, 0, -18, 4, 1.1, 1.2); box(8, 0, -18, 4, 1.1, 1.2); box(0, 0, 22, 5, 0.5, 1.4); box(-24, 0, -18, 2.4, 2.6, 2.4, { ink: INK.ORANGE }); box(26, 0, -18, 2.4, 2.6, 2.4, { ink: INK.GREEN });
  }

  // ---------------- sky doodles ----------------
  {
    sphere(-90, 110, -160, 12, { seg: 12 });
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; const g = new THREE.BoxGeometry(6, 0.7, 0.7); g.rotateZ(a); g.translate(-90 + Math.cos(a) * 19, 110 + Math.sin(a) * 19, -160); addGeo(g, INK.BLUE); }
    for (const [cx, cy, cz, s] of [[60, 70, -170, 1], [-20, 75, -190, 1.3], [140, 60, -80, 0.9], [-150, 65, 40, 1.1], [30, 80, 180, 1.2], [-90, 60, 170, 0.8]]) {
      for (let i = 0; i < 6; i++) sphere(cx + (i - 2.5) * 5 * s, cy + Math.sin(i * 1.7) * 2.5 * s, cz, (4 + (i % 3)) * s, { seg: 10 });
    }
  }

  L.teamSpawns = [[-40, 0, 18], [-34, 12, 12], [-48, 7, -30], [-52, 0, 30], [-30, 7, -48]].map(([x, y, z]) => new THREE.Vector3(x, y, z));
  L.teamSpawns = [L.teamSpawns, [[40, 0, 8], [34, 12, 18], [48, 7, -30], [52, 0, 30], [16, 7, -45]].map(([x, y, z]) => new THREE.Vector3(x, y, z))];
  if (!arena) planes(3, 30, 30, { rStep: 8, hStep: 6, scale: 1.4 });
  return B.finish();
}

// ============================ map 3: The Giant Classroom ============================
function buildClassroom(B, arena = false) {
  const { L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = INK.ORANGE, GR = INK.GREEN, PK = INK.PINK, BK = INK.BLACK, BL = INK.BLUE, RD = INK.RED;
  L.key = 'classroom';
  // Solo player start facing North (-z) towards the green chalkboard
  L.playerStart.set(0, 0.5, 42);
  const P = arena ? 68 : 55, T = 6, PH = arena ? 30 : 18;
  const E = P - 3.8, D = P - 3;
  L.bounds.minX = -P; L.bounds.maxX = P; L.bounds.minZ = -P; L.bounds.maxZ = P;

  // Helper to place oriented cylinders for pens, pencils, lamp neck, telescope
  function orientedCyl(p1, p2, radius, seg = 6, ink = BK) {
    const v1 = p1 instanceof THREE.Vector3 ? p1 : new THREE.Vector3(...p1);
    const v2 = p2 instanceof THREE.Vector3 ? p2 : new THREE.Vector3(...p2);
    const dir = new THREE.Vector3().subVectors(v2, v1);
    const len = dir.length();
    if (len < 0.01) return;
    const g = new THREE.CylinderGeometry(radius, radius, len, seg);
    g.translate(0, len / 2, 0);
    const m = new THREE.Matrix4();
    const up = new THREE.Vector3(0, 1, 0);
    const nDir = dir.clone().normalize();
    const axis = new THREE.Vector3().crossVectors(up, nDir);
    if (axis.lengthSq() > 1e-5) {
      const angle = Math.acos(Math.max(-1, Math.min(1, up.dot(nDir))));
      m.makeRotationAxis(axis.normalize(), angle);
    } else if (up.dot(nDir) < -0.999) {
      m.makeRotationX(Math.PI);
    }
    m.setPosition(v1);
    g.applyMatrix4(m);
    addGeo(g, ink);
    return { dir, len };
  }

  // ---------------- 1. Ground & Perimeter Classroom Enclosure ----------------
  // Hardwood parquet floor foundation
  box(0, -1, 0, 2 * P + T, 1, 2 * P + T, { ink: BL });
  // Parquet plank inlay lines (visual only)
  for (let z = -P + 10; z < P; z += 12) {
    box(0, 0.01, z, 2 * P, 0.02, 0.2, { noCollide: true, ink: BL });
  }
  for (let x = -P + 10; x < P; x += 14) {
    box(x, 0.01, 0, 0.2, 0.02, 2 * P, { noCollide: true, ink: BL });
  }

  // Outer Perimeter Walls
  box(0, 0, -P, 2 * P + T, PH, T, { ink: BK }); // North blackboard wall
  box(0, 0, P, 2 * P + T, PH, T, { ink: BL });  // South door wall
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: BL }); // West window wall
  box(P, 0, 0, T, PH, 2 * P + T, { ink: BL });  // East corkboard wall

  // Wooden wainscoting baseboard trim along all 4 perimeter walls
  box(0, 0, -P + T / 2 + 0.3, 2 * P, 2.0, 0.6, { noCollide: true, ink: OR });
  box(0, 0, P - T / 2 - 0.3, 2 * P, 2.0, 0.6, { noCollide: true, ink: OR });
  box(-P + T / 2 + 0.3, 0, 0, 0.6, 2.0, 2 * P, { noCollide: true, ink: OR });
  box(P - T / 2 - 0.3, 0, 0, 0.6, 2.0, 2 * P, { noCollide: true, ink: OR });

  if (!arena) {
    // Solo anti-camp vertical wall colliders & sky lid
    const NG = { noNav: true, noGrapple: true };
    collider(0, PH, -P, 2 * P + T, 40, T, NG);
    collider(0, PH, P, 2 * P + T, 40, T, NG);
    collider(-P, PH, 0, T, 40, 2 * P + T, NG);
    collider(P, PH, 0, T, 40, 2 * P + T, NG);
    collider(0, 56, 0, 2 * P + 40, 8, 2 * P + 40, NG);

    // Ceiling arch ribs spanning the room
    const R = 92, C = -20;
    for (let k = 0; k < 5; k++) {
      const g = new THREE.TorusGeometry(R, 0.45, 5, 60, Math.PI);
      g.rotateY(k * Math.PI / 5);
      g.translate(0, C, 0);
      addGeo(g, BL);
    }
  }

  // Perimeter Balconies, Radiator Ledges & Window Sills
  // West Window Sills & Cast-Iron Radiators
  box(-E, 5.0, -30, 2.4, 0.4, 8.0, { ink: OR });
  box(-E - 0.5, 0, -30, 1.6, 5.0, 8.0, { ink: BL }); // Radiator unit 1
  ring(-E + 0.5, 8.0, -30, 'y');

  box(-E, 5.0, 10, 2.4, 0.4, 8.0, { ink: OR });
  box(-E - 0.5, 0, 10, 1.6, 5.0, 8.0, { ink: BL });  // Radiator unit 2
  ring(-E + 0.5, 8.0, 10, 'y');

  // East Corkboard Display Shelves
  box(E, 4.0, -25, 2.4, 0.4, 6.0, { ink: OR });
  ring(E - 0.5, 7.5, -25, 'y');
  box(E, 4.0, 15, 2.4, 0.4, 6.0, { ink: OR });
  ring(E - 0.5, 7.5, 15, 'y');
  // East Giant Cork Bulletin Board placed flush on inner wall face
  box(P - 3.1, 2.0, -5, 0.2, 12.0, 70.0, { noCollide: true, ink: OR });

  // South Wall Staging Ledges
  box(-25, 4.0, P - 3.2, 8.0, 0.4, 2.4, { ink: OR });
  box(25, 4.0, P - 3.2, 8.0, 0.4, 2.4, { ink: OR });

  // North High Map Display Rails
  box(-35, 12.0, -P + 3.2, 6.0, 0.4, 2.4, { ink: OR });
  box(35, 12.0, -P + 3.2, 6.0, 0.4, 2.4, { ink: OR });

  // Themed Spawn Portals & Doors
  const doorFrame = (x, z, alongX) => {
    if (alongX) {
      box(x - 1.4, 0, z, 0.35, 3.4, 0.6, { noCollide: true, ink: BK });
      box(x + 1.4, 0, z, 0.35, 3.4, 0.6, { noCollide: true, ink: BK });
      box(x, 3.2, z, 3.1, 0.35, 0.6, { noCollide: true, ink: BK });
    } else {
      box(x, 0, z - 1.4, 0.6, 3.4, 0.35, { noCollide: true, ink: BK });
      box(x, 0, z + 1.4, 0.6, 3.4, 0.35, { noCollide: true, ink: BK });
      box(x, 3.2, z, 0.6, 0.35, 3.1, { noCollide: true, ink: BK });
    }
  };
  for (const [x, z] of [[-D, -20], [-D, 20], [D, -15], [D, 25]]) {
    doorFrame(x, z, false);
    spawn(x + (x < 0 ? 1.8 : -1.8), 0.2, z);
  }
  for (const [x, z] of [[-38, -D], [38, -D], [0, D], [-28, D], [28, D]]) {
    doorFrame(x, z, true);
    spawn(x, 0.2, z + (z < 0 ? 1.8 : -1.8));
  }
  // Floor vent grates for enemy wave spawns
  spawn(-18, 0.2, 0);
  spawn(18, 0.2, 0);

  // ---------------- 2. Sector 1: The Blackboard Stage & Teacher's Sanctuary (North) ----------------
  // Green Slate Blackboard (z = -52, spans x = -45 to 45, y = 0 to 16)
  box(0, 0, -52, 90, 16, 1.2, { ink: BK });      // Dark wood perimeter frame
  box(0, 2.0, -51.4, 86, 13.5, 0.3, { ink: GR }); // Green slate writing surface
  // Chalk erased streaks for depth
  box(-20, 5.0, -51.3, 30, 8.0, 0.1, { noCollide: true, ink: GR });
  box(25, 3.0, -51.3, 25, 9.0, 0.1, { noCollide: true, ink: GR });
  
  box(0, 1.8, -50.6, 88, 0.4, 1.6, { ink: OR, noNav: true });  // Continuous running chalk rail ledge

  // Chalk sticks on the rail
  box(-12, 2.05, -50.6, 2.4, 0.3, 0.3, { noCollide: true, ink: OR });
  box(8, 2.05, -50.6, 2.0, 0.3, 0.3, { noCollide: true, ink: BL });
  box(-24, 2.05, -50.6, 1.8, 0.3, 0.3, { noCollide: true, ink: RD });
  // Felt erasers on the rail
  box(-4, 2.05, -50.6, 3.2, 0.7, 0.9, { ink: BK, noNav: true });
  box(18, 2.05, -50.6, 3.2, 0.7, 0.9, { ink: BK, noNav: true });
  box(-28, 2.05, -50.6, 3.2, 0.7, 0.9, { ink: BK, noNav: true });

  // Doodled chalk formulas, geometry and diagrams on the blackboard
  box(-18, 9.5, -51.2, 5.0, 0.12, 0.05, { noCollide: true, ink: OR }); // E = mc² line
  box(16, 10.5, -51.2, 6.0, 0.12, 0.05, { noCollide: true, ink: OR }); // Pythagorean formula
  box(0, 12.0, -51.2, 3.5, 0.12, 0.05, { noCollide: true, ink: OR });
  // Coordinate axes & quadratic parabola graph
  box(-28, 14.0, -51.2, 0.15, 8.0, 0.05, { noCollide: true, ink: OR }); // y-axis
  box(-28, 14.0, -51.2, 12.0, 0.15, 0.05, { noCollide: true, ink: OR }); // x-axis
  for (let px = -5; px <= 5; px += 1) {
    const py = 11.0 + (px * px) * 0.22;
    box(-28 + px, py, -51.2, 0.9, 0.12, 0.05, { noCollide: true, ink: OR });
  }
  // Circle geometry diagram with inscribed triangle and tangent secant
  {
    const circleGeom = new THREE.RingGeometry(3.0, 3.25, 24);
    circleGeom.translate(6, 15.5, -51.25);
    addGeo(circleGeom, OR);
  }
  box(6, 18.7, -51.2, 8.0, 0.15, 0.05, { noCollide: true, ink: OR }); // Tangent line
  orientedCyl([3.4, 14.0, -51.2], [8.6, 14.0, -51.2], 0.08, 4, OR);   // Inscribed base
  orientedCyl([3.4, 14.0, -51.2], [6.0, 18.5, -51.2], 0.08, 4, OR);   // Left side
  orientedCyl([8.6, 14.0, -51.2], [6.0, 18.5, -51.2], 0.08, 4, OR);   // Right side

  // Stick-figure chalk doodle gunfight in upper corner
  sphere(26, 16.5, -51.2, 0.5, { seg: 6, ink: BL, noCollide: true }); // Head 1
  box(26, 14.5, -51.2, 0.15, 1.6, 0.05, { noCollide: true, ink: BL }); // Body 1
  box(26.8, 14.8, -51.2, 1.4, 0.15, 0.05, { noCollide: true, ink: BL }); // Aiming rifle
  sphere(32, 16.5, -51.2, 0.5, { seg: 6, ink: RD, noCollide: true }); // Head 2
  box(32, 14.5, -51.2, 0.15, 1.6, 0.05, { noCollide: true, ink: RD }); // Body 2
  box(31.2, 14.8, -51.2, 1.4, 0.15, 0.05, { noCollide: true, ink: RD }); // Aiming rifle
  box(29, 14.8, -51.2, 0.6, 0.08, 0.05, { noCollide: true, ink: OR });  // Bullet tracer

  // Upper Blackboard Catwalk at y = 11.0m
  slab(-36, -50.8, 36, -49.2, 11.0, 0.4, { ink: BL });
  rail(-36, -49.2, 36, -49.2, 11.0, { ink: BK });
  // Vertical access ladders on chalkboard frame
  for (let yL = 2.2; yL <= 10.8; yL += 0.8) {
    box(-36.5, yL, -51.0, 1.8, 0.1, 0.2, { noCollide: true, ink: BK });
    box(36.5, yL, -51.0, 1.8, 0.1, 0.2, { noCollide: true, ink: BK });
  }

  // The Teacher's Executive Oak Desk (x: -16 to 16, z: -44 to -28, y = 0 to 8.0m)
  slab(-16, -44, 16, -28, 8.0, 0.6, { ink: OR }); // Solid oak desktop
  // Left 3-drawer pedestal
  box(-12, 0, -36, 8, 7.4, 15, { ink: OR });
  box(-12, 2.0, -28.3, 2.4, 0.3, 0.3, { noCollide: true, ink: BK });
  box(-12, 4.4, -28.3, 2.4, 0.3, 0.3, { noCollide: true, ink: BK });
  box(-12, 6.5, -28.3, 2.4, 0.3, 0.3, { noCollide: true, ink: BK });
  // Right 3-drawer pedestal
  box(12, 0, -36, 8, 7.4, 15, { ink: OR });
  box(12, 2.0, -28.3, 2.4, 0.3, 0.3, { noCollide: true, ink: BK });
  box(12, 4.4, -28.3, 2.4, 0.3, 0.3, { noCollide: true, ink: BK });
  box(12, 6.5, -28.3, 2.4, 0.3, 0.3, { noCollide: true, ink: BK });

  // Teacher's Desk East Flank: 3-tier Oak In/Out Grading Trays
  box(18, 0, -36, 4.2, 0.8, 5.2, { ink: OR });
  box(18, 0.9, -36, 4.2, 0.8, 5.2, { ink: OR });
  box(18, 1.8, -36, 4.2, 0.8, 5.2, { ink: OR });
  slab(16.5, -37.5, 20.2, -34.5, 2.7, 0.08, { ink: BL, noCollide: true }); // Spilled exam papers

  // Teacher's Desk West Flank: Open Leather Briefcase with jump-boost folder
  box(-18, 0, -36, 3.4, 2.2, 4.8, { ink: BK });
  {
    const lid = new THREE.BoxGeometry(3.2, 2.2, 0.3);
    lid.rotateX(-0.4);
    lid.translate(-18, 2.6, -38.2);
    addGeo(lid, BK);
  }
  box(-18, 0.8, -33.5, 2.6, 0.8, 2.6, { ink: RD });

  // Central Vaulted Kneehole Tunnel (x: -8 to 8, z: -44 to -28)
  // Left open with zero colliders from y = 0 to 7.4m: sprint straight through!

  // Teacher's Desk Ascent: Leaning Yellow Meter Stick Ramp from open central aisle to oak desktop (rise = 0.2857m for smooth sprint)
  stairs(14.0, 0, -15.4, '-z', 28, 2.4, { rise: 8.0 / 28, run: 0.45, ink: OR });
  slab(12.8, -32.0, 15.2, -28.0, 8.0, 0.6, { ink: OR }); // Top landing connecting onto oak desktop
  // Meter stick markings
  for (let i = 0; i < 28; i += 2) {
    const sy = i * (8.0 / 28), sz = -15.4 - i * 0.45;
    box(15.3, sy + 0.1, sz, 0.1, 0.3, 0.3, { noCollide: true, ink: BK });
  }

  // Teacher's Desk Props:
  // The Teacher's Red Apple (spherical cover with solid collider & red ink)
  sphere(0, 9.3, -34, 1.3, { seg: 12, ink: RD });
  collider(0, 8.0, -34, 2.6, 2.6, 2.6);
  box(0, 10.6, -34, 0.15, 0.7, 0.15, { noCollide: true, ink: GR }); // Stem

  // Brass Call Bell with grapple ring
  cyl(-10, 8.0, -32, 1.6, 1.4, { seg: 12, ink: OR });
  ring(-10, 10.0, -32, 'y');

  // Ceramic Pencil Cup & Writing Instruments
  cyl(10, 8.0, -32, 1.8, 2.8, { seg: 12, ink: BL });
  orientedCyl([10, 8.0, -32], [12, 14.5, -34], 0.42, 6, RD); // Red grading biro
  orientedCyl([10, 8.0, -32], [8, 14.0, -30], 0.38, 6, OR);  // Yellow pencil

  // Graded Test Papers stack
  box(-4, 8.0, -38, 7.0, 1.2, 5.0, { ink: BL });
  box(-4, 9.22, -38, 1.8, 0.05, 1.8, { noCollide: true, ink: RD }); // A+ 100%

  // Vintage Gooseneck Lamp (Sniper Tower)
  cyl(13, 8.0, -41, 1.8, 0.6, { seg: 10, ink: BK });
  orientedCyl([13, 8.6, -41], [11, 14.0, -39], 0.35, 6, OR);
  orientedCyl([11, 14.0, -39], [10, 18.2, -38], 0.35, 6, OR);
  cyl(10, 17.5, -38, 2.6, 2.0, { seg: 10, ink: GR }); // Green enamel shade
  ring(10, 19.8, -38, 'y'); // High sniper ring
  
  // Lamp Spot Light shining on the Teacher's Desk
  const lampLight = new THREE.PointLight(0xfff5cc, 2.5, 60);
  lampLight.position.set(10, 15.0, -38);
  scene.add(lampLight);

  // ---------------- 3. Sector 2: The Student Desk Archipelago (West) ----------------
  // 4 Student Desks: Desk 1 (-28, -18), Desk 2 (-28, 14), Desk 3 (-10, -18), Desk 4 (-10, 14)
  const desks = [
    [-28, -18, OR], // Desk 1 - Orange
    [-28, 14, PK],  // Desk 2 - Pink
    [-10, -18, GR], // Desk 3 - Green
    [-10, 14, OR]   // Desk 4 - Orange
  ];

  for (const [dx, dz, deskInk] of desks) {
    // Solid Formica Desktop at y = 7.0m
    slab(dx - 9, dz - 6, dx + 9, dz + 6, 7.0, 0.5, { ink: deskInk });
    // 4 Tubular Steel Legs
    cyl(dx - 8, 0, dz - 5, 0.6, 6.5, { seg: 8, ink: BL });
    cyl(dx + 8, 0, dz - 5, 0.6, 6.5, { seg: 8, ink: BL });
    cyl(dx - 8, 0, dz + 5, 0.6, 6.5, { seg: 8, ink: BL });
    cyl(dx + 8, 0, dz + 5, 0.6, 6.5, { seg: 8, ink: BL });
    // Under-Desk Wire Storage Basket at y = 4.0m (Accessible floor tier!)
    box(dx, 4.0, dz, 16.0, 0.25, 10.0, { ink: BK });
    // Attached Plywood School Chair
    slab(dx - 4, dz + 7, dx + 4, dz + 12, 3.6, 0.35, { ink: OR }); // Chair seat
    box(dx, 3.6, dz + 12, 8.0, 2.4, 0.35, { ink: OR });            // Chair backrest
    // Chair legs
    cyl(dx - 3.5, 0, dz + 8, 0.4, 3.25, { seg: 6, ink: BL });
    cyl(dx + 3.5, 0, dz + 8, 0.4, 3.25, { seg: 6, ink: BL });
    cyl(dx - 3.5, 0, dz + 11.5, 0.4, 3.25, { seg: 6, ink: BL });
    cyl(dx + 3.5, 0, dz + 11.5, 0.4, 3.25, { seg: 6, ink: BL });
  }

  // Stationery Bridges Between Student Desks
  // 1. 30cm Set-Square Triangle Bridge (Desk 1 -> Desk 3 at y = 7.0m)
  slab(-19, -20, -15, -14, 7.0, 0.35, { ink: OR });
  // 2. Giant Yellow Wooden Ruler Bridge (Desk 1 -> Desk 2, spanning z = -12 to 8 at y = 7.0m)
  slab(-30, -12, -26, 8, 7.0, 0.4, { ink: OR });
  rail(-30, -12, -30, 8, 7.0, { ink: BK });
  rail(-26, -12, -26, 8, 7.0, { ink: BK });
  // Bridge Cover: Standing Binder Clip midway
  box(-28.5, 7.0, -2, 2.6, 2.8, 1.6, { ink: BK }); // Binder clip body
  orientedCyl([-29.2, 9.8, -2], [-27.8, 9.8, -2], 0.15, 6, BL); // Clip wire
  // Ruler Centimeter Ticks
  for (let rz = -11; rz <= 7; rz += 2) {
    box(-28, 7.02, rz, 3.6, 0.02, 0.1, { noCollide: true, ink: BK });
  }
  ring(-28, 5.2, -2, 'y'); // Central under-ruler grapple ring

  // 3. Wire Spiral Notebook Bridge between Desk 3 and Desk 4
  slab(-12, -12, -8, 8, 7.0, 0.35, { ink: BK });

  // 4. Under-Desk Wire Basket Stealth Rat-Run (y = 4.0m sheltered flank corridors)
  // Desk 1 to Desk 2 under-desk wire bridge
  slab(-29.5, -12, -26.5, 8, 4.0, 0.25, { ink: BK });
  orientedCyl([-28, 4.0, -2], [-28, 7.0, -2], 0.08, 4, BK);
  // Desk 3 to Desk 4 under-desk wire bridge
  slab(-11.5, -12, -8.5, 8, 4.0, 0.25, { ink: BK });
  orientedCyl([-10, 4.0, -2], [-10, 7.0, -2], 0.08, 4, BK);
  // Chair-to-basket transition ramps (y = 3.6m chair to y = 4.0m basket)
  slab(-29, -12.5, -27, -11.0, 3.8, 0.15, { ink: OR });
  slab(-11, -12.5, -9, -11.0, 3.8, 0.15, { ink: OR });
  slab(-29, 19.0, -27, 20.5, 3.8, 0.15, { ink: OR });
  slab(-11, 19.0, -9, 20.5, 3.8, 0.15, { ink: OR });
  // Under-desk grapple anchor rings
  ring(-28, 4.6, -2, 'y');
  ring(-10, 4.6, -2, 'y');

  // Ground-to-Desk Ascent Ramps & Stairs:
  // Open "Advanced Physics" Hardcover Textbook Ramp beside Desk 2 (rise = 0.28m) - arriving at z = 14.25
  stairs(-39, 0, 3, '+z', 25, 3.2, { rise: 7.0 / 25, run: 0.45, ink: BL });
  slab(-40.5, 14.25, -37.0, 18.25, 7.0, 0.4, { ink: BL }); // Top landing transition to Desk 2

  // Stack of 3 Hardcover Textbooks beside Desk 1 (Algebra, Biology, History) forming natural stairs
  box(-21, 0, -18, 3.6, 1.3, 4.8, { ink: BL });
  box(-22, 1.3, -18, 3.4, 1.3, 4.6, { ink: GR });
  box(-23, 2.6, -18, 3.2, 1.2, 4.4, { ink: RD });

  // Slumped Canvas Student Backpack with shoulder strap ramp east of Desk 4 up to chair seat (y = 3.6m)
  box(0, 0, 21, 3.2, 2.4, 2.6, { ink: RD });
  stairs(0, 0, 16.0, '+z', 14, 1.4, { rise: 3.6 / 14, run: 0.36, ink: BK });

  // Geometry Drafting Compass A-Frame (sprint underneath or grapple apex)
  orientedCyl([-20.2, 0, -3], [-18, 5.2, -3], 0.28, 6, BL); // Steel needle leg
  orientedCyl([-15.8, 0, -3], [-18, 5.2, -3], 0.32, 6, OR); // Graphite pencil leg
  box(-18, 2.8, -3, 3.2, 0.3, 0.3, { ink: OR });            // Thumbwheel bar
  cyl(-18, 2.8, -3, 0.65, 0.3, { seg: 10, ink: OR });         // Knurled thumbwheel
  cyl(-18, 5.2, -3, 0.6, 0.8, { seg: 10, ink: BL });           // Hinge bolt
  ring(-18, 6.6, -3, 'y');                                    // Apex grapple ring

  // Curled Yellow Sticky-Note Pad (Post-It Vault Ramp) north-west of Desk 4 (outside under-desk wire corridor)
  box(-16, 0, 2, 4.4, 1.2, 4.4, { ink: OR });
  stairs(-16, 1.2, 0.2, '+z', 4, 3.8, { rise: 0.25, run: 0.8, ink: OR });

  // Desk Props:
  // Metal Hand-Cranked Pencil Sharpener (Desk 1)
  box(-26, 7.0, -22, 2.4, 3.2, 2.0, { ink: BK });
  ring(-26, 10.8, -22, 'x'); // Crank grapple point

  // Metal Domed Lunchbox & Thermos (Desk 2)
  box(-28, 7.0, 12, 4.2, 2.6, 2.8, { ink: BL });
  cyl(-31, 7.0, 12, 0.9, 3.5, { seg: 10, ink: RD }); // Thermos bottle
  cyl(-24, 7.0, 18, 0.6, 0.8, { seg: 8, ink: RD });  // Red plastic pushpin micro-cover

  // Open Tin Pencil Case with angled shield lid (Desk 3)
  box(-8, 7.0, -16, 3.4, 0.8, 4.8, { ink: BK });
  {
    const lid = new THREE.BoxGeometry(3.4, 2.6, 0.2);
    lid.rotateX(-0.5);
    lid.translate(-8, 8.2, -18.2);
    addGeo(lid, BK);
    collider(-8, 7.0, -18.2, 3.4, 2.6, 1.2);
  }
  orientedCyl([-14, 7.05, -22], [-14, 7.05, -18], 0.16, 4, BL); // Bent steel paperclip micro-cover

  // ---------------- 4. Sector 3: Science Lab & Grand Library Bookshelf (East) ----------------
  // Grand Library Bookshelf (x = 34 to 48, z = -20 to 24)
  slab(34, -20, 48, 24, 4.0, 0.5, { ink: OR });  // Shelf 1
  slab(34, -20, 48, 24, 8.0, 0.5, { ink: OR });  // Shelf 2
  slab(34, -20, 48, 24, 12.0, 0.5, { ink: OR }); // Shelf 3
  slab(34, -20, 48, 24, 16.0, 0.5, { ink: OR }); // Crown Roof Deck

  // Vertical structural partition panels
  box(41, 0, -20, 14, 16, 0.8, { ink: OR }); // North gable
  box(41, 0, 2, 14, 16, 0.8, { ink: OR });   // Center partition
  box(41, 0, 24, 14, 16, 0.8, { ink: OR });  // South gable

  // Colorful Bookshelves Content (giant encyclopedias with walk-through firing tunnels)
  const bookColors = [BL, GR, RD, OR];
  for (let sY of [0, 4.0, 8.0, 12.0]) {
    for (let bZ of [-16, -10, -4, 6, 12, 18]) {
      const c = bookColors[Math.abs(Math.floor(bZ * 7 + sY)) % bookColors.length];
      box(41, sY + 0.5, bZ, 12, 3.0, 4.0, { ink: c });
    }
  }

  // Exterior Staggered Switchback Stairs (x = 24.0 to 36.0, seamlessly linked to every shelf)
  // Two dedicated non-overlapping lanes with generous 4.6m side clearance to rails and 7m turnaround landings
  // Flight 1: 0 -> 4.0m (+z Southbound, inside lane x = 32.8)
  stairs(32.8, 0, -14.0, '+z', 14, 2.0, { rise: 4.0 / 14, run: 0.45, ink: OR });
  slab(24.0, -7.7, 36.0, -0.7, 4.0, 0.4, { ink: OR }); // Landing 1 (connects Flight 1 -> Flight 2 & Shelf 1)
  rail(24.0, -7.7, 24.0, -0.7, 4.0, { ink: BK });
  rail(24.0, -7.7, 28.5, -7.7, 4.0, { ink: BK });
  rail(24.0, -0.7, 34.0, -0.7, 4.0, { ink: BK });

  // Flight 2: 4.0 -> 8.0m (-z Northbound, outside lane x = 29.6)
  stairs(29.6, 4.0, -7.7, '-z', 14, 2.0, { rise: 4.0 / 14, run: 0.45, ink: OR });
  slab(24.0, -21.0, 36.0, -14.0, 8.0, 0.4, { ink: OR }); // Landing 2 (connects Flight 2 -> Flight 3 & Shelf 2)
  rail(24.0, -21.0, 24.0, -14.0, 8.0, { ink: BK });
  rail(24.0, -14.0, 28.5, -14.0, 8.0, { ink: BK });
  rail(24.0, -21.0, 34.0, -21.0, 8.0, { ink: BK });

  // Flight 3: 8.0 -> 12.0m (+z Southbound, inside lane x = 32.8)
  stairs(32.8, 8.0, -14.0, '+z', 14, 2.0, { rise: 4.0 / 14, run: 0.45, ink: OR });
  slab(24.0, -7.7, 36.0, -0.7, 12.0, 0.4, { ink: OR }); // Landing 3 (connects Flight 3 -> Flight 4 & Shelf 3)
  rail(24.0, -7.7, 24.0, -0.7, 12.0, { ink: BK });
  rail(24.0, -7.7, 28.5, -7.7, 12.0, { ink: BK });
  rail(24.0, -0.7, 34.0, -0.7, 12.0, { ink: BK });

  // Flight 4: 12.0 -> 16.0m (-z Northbound to Crown Deck, outside lane x = 29.6)
  stairs(29.6, 12.0, -7.7, '-z', 14, 2.0, { rise: 4.0 / 14, run: 0.45, ink: OR });
  slab(24.0, -21.0, 36.0, -14.0, 16.0, 0.4, { ink: OR }); // Landing 4 (connects Flight 4 -> Crown Deck)
  rail(24.0, -21.0, 24.0, -14.0, 16.0, { ink: BK });
  rail(24.0, -14.0, 28.5, -14.0, 16.0, { ink: BK });
  rail(24.0, -21.0, 34.0, -21.0, 16.0, { ink: BK });
  ring(41, 18.0, 2, 'y'); // Crown Deck central grapple ring

  // Science Lab Chemistry Counter (x: 22 to 44, z: -42 to -26, y = 7.0m)
  slab(22, -42, 44, -26, 7.0, 0.6, { ink: BK }); // Black epoxy resin counter
  // Stainless sink basin
  box(29, 4.0, -35, 6.0, 3.0, 6.0, { ink: BL });
  // Gooseneck faucet curving to y = 15.0m
  cyl(29, 7.0, -40, 0.45, 6.0, { ink: BL });
  orientedCyl([29, 13.0, -40], [29, 15.0, -37], 0.45, 6, BL);
  ring(29, 15.2, -37, 'y'); // Faucet nozzle sniper ring

  // Giant Erlenmeyer Flask with green fluid fill
  cyl(36, 7.0, -34, 3.2, 4.0, { seg: 10, ink: BL });
  cyl(36, 7.0, -34, 3.0, 2.8, { seg: 10, ink: GR }); // Fluid
  cyl(36, 11.0, -34, 1.2, 3.0, { seg: 10, ink: BL }); // Neck

  // Bunsen Burner & Gas Hose
  cyl(40, 7.0, -30, 1.8, 0.8, { seg: 10, ink: BK });
  cyl(40, 7.8, -30, 0.5, 3.5, { seg: 8, ink: OR });
  // Bunsen Burner Flame Doodle (blue inner cone, orange outer flame)
  {
    const flameOuter = new THREE.ConeGeometry(0.7, 2.2, 8);
    flameOuter.translate(40, 12.4, -30);
    addGeo(flameOuter, OR);
    const flameInner = new THREE.ConeGeometry(0.38, 1.3, 8);
    flameInner.translate(40, 11.9, -30);
    addGeo(flameInner, BL);
  }

  // Wooden Test Tube Rack with 4 colorful chemical solutions
  box(32, 7.0, -28, 4.4, 0.3, 1.3, { ink: OR });
  box(32, 8.4, -28, 4.4, 0.25, 1.3, { ink: OR });
  box(29.9, 7.0, -28, 0.25, 1.6, 1.3, { ink: OR });
  box(34.1, 7.0, -28, 0.25, 1.6, 1.3, { ink: OR });
  cyl(30.6, 7.3, -28, 0.25, 2.0, { seg: 8, ink: RD }); // Red solution
  cyl(31.5, 7.3, -28, 0.25, 2.0, { seg: 8, ink: GR }); // Green solution
  cyl(32.5, 7.3, -28, 0.25, 2.0, { seg: 8, ink: BL }); // Blue solution
  cyl(33.4, 7.3, -28, 0.25, 2.0, { seg: 8, ink: OR }); // Amber solution

  // Reagent Dropper Bottle with red suction bulb
  cyl(35, 7.0, -28, 0.8, 2.0, { seg: 8, ink: BK });
  sphere(35, 9.2, -28, 0.6, { seg: 8, ink: RD });

  // Compound Monocular Microscope (Sniper Tower)
  box(24, 7.0, -28, 4.5, 1.2, 4.5, { ink: BK }); // Horseshoe base
  cyl(24, 8.2, -28, 0.7, 4.0, { seg: 8, ink: BK });
  box(24, 12.0, -28, 4.0, 0.4, 4.0, { ink: BK }); // Specimen stage
  orientedCyl([24, 12.4, -28], [24, 21.0, -28], 0.9, 8, BK); // Body tube
  cyl(24, 20.5, -28, 1.4, 0.8, { seg: 10, ink: OR }); // Eyepiece rim
  ring(24, 22.0, -28, 'y'); // Microscope eyepiece grapple ring

  // ---------------- 5. Sector 4: Back of Class, Lockers & Double Doors (South) ----------------
  // Double Entrance Doors at (0, 0, 52)
  box(0, 0, 52, 14.0, 10.0, 1.2, { ink: OR });
  box(0, 4.0, 52.4, 11.0, 4.5, 0.2, { noCollide: true, ink: BL }); // Frosted glass
  box(0, 3.6, 51.5, 12.0, 0.4, 0.5, { ink: OR }); // Brass push-bar
  ring(0, 11.5, 50.8, 'y'); // Broken transom window grapple ring

  // Bank of Metal Student Lockers (x = 12 to 44, z = 44 to 48, Height 12.0m)
  box(28, 0, 46, 32.0, 12.0, 4.0, { ink: GR });
  // Top of lockers catwalk
  slab(12, 44, 44, 48, 12.0, 0.4, { ink: GR });
  // Red dodgeball cover on top
  sphere(20, 13.5, 46, 1.5, { seg: 12, ink: RD });
  collider(20, 12.0, 46, 3.0, 3.0, 3.0);
  // 3 Open Locker doors swinging into the room
  for (const lx of [18, 28, 38]) {
    box(lx, 0, 43, 0.3, 11.5, 3.0, { ink: BL });
    box(lx, 3.8, 44.5, 1.8, 0.3, 2.0, { ink: GR }); // Interior shelf
  }

  // Wooden Backpack Cubbies (x = -44 to -12, z = 44 to 48, Height 8.0m)
  box(-28, 0, 46, 32.0, 8.0, 4.0, { ink: OR });
  slab(-44, 44, -12, 48, 8.0, 0.4, { ink: OR }); // Top deck
  // Giant Canvas Backpacks
  box(-18, 2.5, 45, 4.5, 5.0, 3.2, { ink: RD }); // Red backpack
  box(-32, 2.5, 45, 4.5, 5.0, 3.2, { ink: BL }); // Blue backpack
  ring(-18, 8.5, 45, 'z');
  ring(-32, 8.5, 45, 'z');

  // Giant Wall Clock at (0, 22.0, 51.0)
  {
    const bezel = new THREE.CylinderGeometry(5.0, 5.0, 0.6, 24);
    bezel.rotateX(Math.PI / 2);
    bezel.translate(0, 22.0, 51.0);
    addGeo(bezel, BK);
  }
  box(1.8, 22.0, 50.4, 3.6, 0.3, 0.1, { noCollide: true, ink: BK }); // Hour hand
  box(0, 24.2, 50.4, 0.25, 4.4, 0.1, { noCollide: true, ink: BK }); // Minute hand
  ring(0, 26.5, 49.6, 'y'); // Minute hand tip ring
  slab(-2.5, 50.2, 2.5, 51.6, 27.0, 0.4, { ink: BK }); // Clock top sniper perch ledge

  // Animated Swinging Brass Clock Pendulum with dynamic aerial grapple point
  {
    const pendulumGroup = new THREE.Group();
    pendulumGroup.position.set(0, 18.0, 50.4);
    // Brass shaft
    const rodGeom = new THREE.CylinderGeometry(0.18, 0.18, 9.0, 8);
    rodGeom.translate(0, -4.5, 0);
    const rodMesh = new THREE.Mesh(rodGeom, makeInkMaterial({ ink: OR }));
    pendulumGroup.add(rodMesh);
    // Heavy brass disc bob
    const bobGeom = new THREE.CylinderGeometry(1.9, 1.9, 0.4, 16);
    bobGeom.rotateX(Math.PI / 2);
    bobGeom.translate(0, -9.0, 0);
    const bobMesh = new THREE.Mesh(bobGeom, makeInkMaterial({ ink: OR }));
    pendulumGroup.add(bobMesh);
    // Bob ring cut
    const bobRingGeom = new THREE.TorusGeometry(0.7, 0.14, 6, 16);
    bobRingGeom.translate(0, -9.0, 0);
    const bobRingMesh = new THREE.Mesh(bobRingGeom, makeInkMaterial({ ink: BK }));
    pendulumGroup.add(bobRingMesh);

    scene.add(pendulumGroup);
    L.meshes.push(pendulumGroup);

    // Mover object tracking the bob in world coordinates for dynamic grappling
    const bobMoverObj = new THREE.Object3D();
    bobMoverObj.position.set(0, 9.0, 50.4);
    scene.add(bobMoverObj);
    L.meshes.push(bobMoverObj);
    L.grappleMovers.push({ mesh: bobMoverObj, radius: 2.5 });

    L.animated.push({
      mesh: pendulumGroup,
      update: (t) => {
        const ang = Math.sin(t * 1.5) * 0.38;
        pendulumGroup.rotation.z = -ang;
        const bx = Math.sin(ang) * 9.0;
        const by = 18.0 - Math.cos(ang) * 9.0;
        bobMoverObj.position.set(bx, by, 50.4);
      }
    });
  }

  // ---------------- 6. Central Plaza: Crashed Paper Plane, Stapler & Cover Pods ----------------
  if (!arena) {
    // Central Plaza Floor Cover: Crumpled Paper & Dropped Erasers
    sphere(-12, 1.4, 5, 1.8, { seg: 6, ink: BL }); // Crumpled blue-ruled paper
    sphere(-16, 1.0, 18, 1.4, { seg: 5, ink: BL });
    sphere(22, 1.5, 0, 2.0, { seg: 6, ink: BL });
    box(14, 0, 10, 3, 1.2, 1.6, { ink: PK }); // Pink eraser barricade
    box(-5, 0, 28, 1.8, 1.0, 2.8, { ink: PK }); // Pink eraser barricade

    // The Crashed Giant Delta-Wing Paper Airplane at (2, 0, 8)
    // Sloped wing forming a natural ramp from y = 0 to 4.2m with rise = 0.28m
    stairs(2, 0, 2, '+z', 15, 4.0, { rise: 4.2 / 15, run: 0.45, ink: BL });
    box(2, 2.0, 11, 0.4, 3.5, 4.0, { ink: BL }); // Tail fin

    // Heavy-Duty Metal Desk Stapler Bunker in open Central Plaza at (8, 0, 22)
    box(8, 0, 22, 10.0, 0.8, 3.4, { ink: BK }); // Base
    {
      const arm = new THREE.BoxGeometry(9.0, 1.4, 3.0);
      arm.rotateZ(-0.25);
      arm.translate(7.5, 2.8, 22);
      addGeo(arm, BL);
      collider(7.5, 1.0, 22, 9.0, 2.2, 3.0);
    }
    // Chrome anvil head
    box(12, 2.6, 22, 2.4, 1.8, 3.0, { ink: BK });
    ring(8, 4.8, 22, 'x');

    // Giant Pink Bevelled Wedge Eraser at (8, 0, -6)
    box(8, 0, -6, 6.0, 2.2, 3.4, { ink: PK });

    // Stack of 3 Ring-Binder Notebooks in wide central cross-hallway at (-6, 0, 1)
    box(-6, 0.0, 1, 5.0, 0.9, 5.0, { ink: BL });
    box(-6.2, 0.9, 1.2, 4.8, 0.9, 4.8, { ink: RD });
    box(-5.8, 1.8, 0.8, 4.8, 0.9, 4.8, { ink: GR });

    // Heavy Green Scotch Tape Dispenser at (12, 0, 10)
    box(12, 0, 10, 4.0, 2.2, 7.5, { ink: GR });
    cyl(12, 2.2, 8.5, 2.2, 1.8, { seg: 14, ink: BL }); // Clear tape spool roll
    box(12, 2.2, 13.5, 3.8, 0.4, 0.6, { ink: BK });  // Serrated metal cutter blade
    slab(10.8, 8.8, 13.2, 13.5, 2.5, 0.06, { ink: BL, noCollide: true }); // Stretched adhesive strip

    // Overturned Metal Pencil Tin with spilled biros at (6, 0, -10)
    {
      const tinGeom = new THREE.CylinderGeometry(1.4, 1.4, 4.8, 12);
      tinGeom.rotateZ(Math.PI / 2);
      tinGeom.translate(6, 1.4, -10);
      addGeo(tinGeom, BL);
    }
    collider(6, 0, -10, 5.0, 2.8, 3.0);
    orientedCyl([7.5, 0.3, -10], [11.0, 0.3, -8.0], 0.22, 6, RD);
    orientedCyl([7.5, 0.3, -10.5], [10.5, 0.3, -12.5], 0.22, 6, BL);
    orientedCyl([7.0, 0.3, -11.5], [9.2, 0.3, -14.5], 0.22, 6, GR);

    // Standing Clear Plastic Protractor at (6, 0, 4)
    box(6, 0, 4, 6.0, 0.4, 0.6, { ink: BL });
    {
      const protractorArc = new THREE.TorusGeometry(3.0, 0.22, 4, 16, Math.PI);
      protractorArc.translate(6, 0.4, 4);
      addGeo(protractorArc, BL);
    }
    collider(6, 0, 4, 6.0, 3.2, 1.0);
    ring(6, 3.8, 4, 'z'); // Center crosshair origin hole ring

    // Giant Wire Wastepaper Basket & Crumpled Paper Balls in Southeast Corner at (44, 0, 34)
    cyl(44, 0, 34, 4.5, 0.4, { seg: 16, ink: BK }); // Solid base plate
    for (let a = 0; a < 8; a++) {
      const ang = a * Math.PI / 4;
      cyl(44 + Math.cos(ang) * 4.4, 0.4, 34 + Math.sin(ang) * 4.4, 0.12, 7.6, { seg: 4, ink: BK });
    }
    {
      const rimGeom = new THREE.TorusGeometry(4.5, 0.25, 5, 20);
      rimGeom.rotateX(Math.PI / 2);
      rimGeom.translate(44, 8.0, 34);
      addGeo(rimGeom, BK);
    }
    ring(44, 8.4, 34, 'y'); // Basket rim grapple ring
    // 4 climbable crumpled paper ball cover boulders
    sphere(43, 1.8, 33, 2.2, { seg: 8, ink: BL });
    collider(43, 0.4, 33, 3.4, 3.0, 3.4);
    sphere(45, 4.4, 35, 2.0, { seg: 8, ink: BL });
    collider(45, 3.2, 35, 3.0, 2.8, 3.0);
    sphere(39.5, 1.2, 31, 1.8, { seg: 8, ink: BL });
    collider(39.5, 0.2, 31, 2.8, 2.2, 2.8);
    sphere(46, 1.4, 28, 2.0, { seg: 8, ink: BL });
    collider(46, 0.2, 28, 3.0, 2.4, 3.0);
    pickup(44, 4.8, 34); // Hidden high-value pickup inside wastepaper basket
  } else {
    // Arena Mode: keep central runway clear for cross-fire, with low cover blocks
    box(8, 0, -6, 5.0, 1.4, 3.0, { ink: PK });
    box(-6, 0, 12, 6.0, 1.2, 4.0, { ink: BL });
  }

  // ---------------- 7. Overhead Ceiling Grid, Mobiles & Aerial Traversal ----------------
  // 3 Suspended Fluorescent Light Troffers (Walkable Catwalks with Underhung Rings)
  for (const [tx, ty] of [[-20, 22.0], [0, 24.0], [24, 22.0]]) {
    box(tx, ty, -5, 2.4, 0.6, 70.0, { ink: BL, noNav: true }); // Walkable top surface
    for (let rz = -30; rz <= 20; rz += 16) {
      ring(tx, ty - 0.8, rz, 'z'); // Underhung Tarzan swing rings
    }
  }

  // Overhead Solar System Mobile with solid colliders & proper planetary colors
  sphere(0, 26.0, 0, 3.5, { seg: 14, ink: OR }); // The Sun
  collider(0, 25.0, 0, 6.0, 2.0, 6.0);
  ring(0, 29.5, 0, 'y');
  ring(3.5, 26.0, 0, 'x');
  ring(-3.5, 26.0, 0, 'x');

  // Saturn with disc ring
  sphere(20, 24.0, 10, 2.2, { seg: 10, ink: OR });
  collider(20, 23.0, 10, 4.0, 1.6, 4.0);
  {
    const ringGeom = new THREE.TorusGeometry(3.6, 0.4, 4, 24);
    ringGeom.rotateX(Math.PI / 2.3);
    ringGeom.translate(20, 24.0, 10);
    addGeo(ringGeom, OR);
  }
  ring(20, 21.4, 10, 'y');

  // Jupiter
  sphere(14, 21.0, -22, 2.8, { seg: 10, ink: RD });
  collider(14, 20.0, -22, 4.8, 1.8, 4.8);
  ring(14, 18.0, -22, 'y');

  // Earth & Moon
  sphere(-18, 22.0, -12, 1.6, { seg: 8, ink: BL });
  collider(-18, 21.0, -12, 3.0, 1.4, 3.0);
  ring(-18, 20.0, -12, 'y');

  // Mars
  sphere(-12, 23.0, 20, 1.2, { seg: 8, ink: RD });
  collider(-12, 22.0, 20, 2.2, 1.2, 2.2);

  // ---------------- 8. Arena Mode Variations ----------------
  if (arena) {
    // Arena ceiling dome ribs & keystone ring
    const R = 92, C = -20;
    for (let k = 0; k < 8; k++) {
      const g = new THREE.TorusGeometry(R, 0.55, 5, 60, Math.PI);
      g.rotateY(k * Math.PI / 8);
      g.translate(0, C, 0);
      addGeo(g, BL);
    }
    cyl(0, 71, 0, 4.5, 3.2, { seg: 14, ink: RD });
    ring(0, 69.5, 0, 'y');
    // Dome boundary colliders to keep grappling inside
    for (let a = 0; a < 8; a++) {
      const ang = a * Math.PI / 4;
      const cx = Math.cos(ang) * 58, cz = Math.sin(ang) * 58;
      collider(cx, 32, cz, 24, 28, 24, { noNav: true, noGrapple: true });
    }
    collider(0, 75, 0, 80, 8, 80, { noNav: true, noGrapple: true });

    // 5 Suspended Hanging Notebook Platforms with corner cables
    const suspendedPads = [
      [-4, -4, 4, 4, 18.0, BL],
      [-33, -28, -27, -22, 16.0, OR],
      [27, -28, 33, -22, 16.0, BL],
      [-33, 22, -27, 28, 16.0, GR],
      [27, 22, 33, 28, 16.0, RD]
    ];
    for (const [x1, z1, x2, z2, py, col] of suspendedPads) {
      slab(x1, z1, x2, z2, py, 0.4, { ink: col });
      const mx = (x1 + x2) / 2, mz = (z1 + z2) / 2;
      ring(mx, py + 0.5, mz, 'y');
      orientedCyl([x1 + 0.2, py, z1 + 0.2], [x1 + 0.2, 48, z1 + 0.2], 0.06, 4, BK);
      orientedCyl([x2 - 0.2, py, z2 - 0.2], [x2 - 0.2, 48, z2 - 0.2], 0.06, 4, BK);
    }

    // Grand 60m Ruler Skybridge Spanning West Desks to East Bookshelf at y = 12.0m!
    slab(-28, -2, 34, 2, 12.0, 0.4, { ink: OR });
    rail(-28, -2, 34, -2, 12.0, { ink: BK });
    rail(-28, 2, 34, 2, 12.0, { ink: BK });
    ring(3, 10.2, 0, 'y');
  }

  // ---------------- 9. Tactical Snipers, Pickups & Spawns ----------------
  // Dedicated Sniper Perches
  sniper(10, 19.5, -38);  // Teacher's gooseneck lamp hood
  sniper(24, 21.3, -28);  // Microscope eyepiece rim
  sniper(41, 16.0, 2);    // Bookshelf crown deck
  sniper(-26, 10.2, -22); // Desk 1 sharpener roof
  sniper(0, 27.0, 50.8);  // South wall clock crown ledge
  sniper(28, 12.0, 46);   // Top of metal student lockers
  sniper(-28, 8.0, 46);   // Top of backpack cubbies
  sniper(0, 27.0, 0);     // Solar mobile Sun apex

  // Strategic Pickups
  pickup(0, 8.0, -34);    // Teacher's desk beside apple
  pickup(0, 0.2, -36);    // Inside central kneehole tunnel
  pickup(-28, 7.0, -18);  // Desk 1 surface
  pickup(-28, 4.0, -18);  // Desk 1 under-desk wire basket
  pickup(-10, 7.0, 14);   // Desk 4 textbook surface
  pickup(35.5, 4.0, -10); // Bookshelf shelf 1 walkway
  pickup(35.5, 8.0, 10);  // Bookshelf shelf 2 walkway
  pickup(38, 16.0, -15);  // Bookshelf crown deck
  pickup(30, 7.0, -35);   // Science lab sink edge
  pickup(2, arena ? 0.2 : 4.2, 8);      // Crashed paper airplane wing (or central floor in arena)
  pickup(8, arena ? 0.2 : 2.6, 22);     // Desk stapler head (or floor in arena)
  pickup(8, 2.2, -6);     // Pink wedge eraser
  pickup(28, 0.2, 43);    // Inside open locker door
  pickup(-16, 7.5, 45);   // Top of red canvas backpack

  // Team Spawns (Red & Blue)
  L.teamSpawns = [
    [[-12, 8.0, -36], [-28, 7.0, -18], [-38, 0.2, -20], [-28, 4.0, 14], [-4, 0.2, -30], [-19, 7.0, -15], [-28, 8.0, 46], [-32, 0.2, 30]].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    [[12, 8.0, -36], [36, 7.0, -30], [35.5, 4.0, 12], [28, 12.0, 46], [0, 0.2, 44], [4, 0.2, 22], [38, 16.0, 0], [30, 0.2, -10]].map(([x, y, z]) => new THREE.Vector3(x, y, z))
  ];

  // 16 Symmetrical Arena Match Spawns
  for (const [x, y, z] of [
    // Ground & Low tier
    [-38, 0.2, -20], [38, 0.2, -20], [-4, 0.2, -30], [4, 0.2, 22],
    [0, 0.2, 44], [-32, 0.2, 30], [30, 0.2, -10], [0, 0.2, -15],
    // Mid tier (Desks, Lockers & Cubbies)
    [-28, 7.0, -18], [36, 7.0, -30], [-10, 7.0, 14], [35.5, 4.0, 12],
    [-28, 8.0, 46], [28, 12.0, 46],
    // High tier
    [-12, 8.0, -36], [38, 16.0, 0]
  ]) {
    L.arenaSpawns.push(new THREE.Vector3(x, y, z));
  }

  // 4 Circling Paper Airplanes in Upper Airspace
  planes(4, 28, 22, { rStep: 6, hStep: 3, scale: 1.4, speed: 0.12 });

  return B.finish();
}

// ============================ map 2: Doodle Mexico ============================
// A sun-baked pueblo: a plaza with a fountain and a floating sombrero, a bandstand full of mariachis,
// a church with a bell tower, adobe houses, a market of piñatas, a taco cart, and mesas all around.
// Pots, crates, barrels, cacti and piñatas all break.
function buildMexico(B, arena = false) {
  const { L, box, slab, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = INK.ORANGE, GR = INK.GREEN, PK = INK.PINK, BK = INK.BLACK, BL = INK.BLUE;
  L.key = 'mexico'; L.playerStart.set(0, 0, 16); const P = 62; L.bounds = { minX: -P, maxX: P, minZ: -P, maxZ: P };
  const mat = (ink, fill = false) => makeInkMaterial({ ink, fill, side: fill ? THREE.DoubleSide : THREE.FrontSide });
  const mesh = (geo, ink, fill = false) => new THREE.Mesh(geo, mat(ink, fill));
  // a prop that can be broken: its own meshes (so they can fly off) and a tagged collider
  const breakable = (kind, x, y, z, w, h, d, build, o = {}) => {
    const g = new THREE.Group(); build(g); g.position.set(x, y, z); scene.add(g); L.meshes.push(g);
    const br = { id: L.breakables.length, kind, group: g, hp: o.hp ?? 1, pos: new THREE.Vector3(x, y + h / 2, z), alive: true, ink: o.ink ?? OR, box: null };
    br.box = collider(x, y, z, w, h, d, { noNav: true }); br.box.data.breakable = br; L.breakables.push(br); return br;
  };
  const pot = (x, z, big = false) => breakable('pot', x, 0, z, big ? 1.2 : 0.9, big ? 1.3 : 0.9, big ? 1.2 : 0.9, (g) => {
    const r = big ? 0.55 : 0.4, h = big ? 1.2 : 0.85;
    g.add(mesh(new THREE.CylinderGeometry(r * 0.75, r, h, 9).translate(0, h / 2, 0), OR)); g.add(mesh(new THREE.TorusGeometry(r * 0.72, 0.05, 5, 12).rotateX(Math.PI / 2).translate(0, h, 0), BK));
    g.add(mesh(new THREE.TorusGeometry(r * 0.98, 0.04, 4, 12).rotateX(Math.PI / 2).translate(0, h * 0.45, 0), PK));
  }, { hp: 1, ink: OR });
  const crate = (x, z) => breakable('crate', x, 0, z, 1.1, 1.1, 1.1, (g) => {
    g.add(mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1).translate(0, 0.55, 0), BL)); for (const k of [-1, 1]) g.add(mesh(new THREE.BoxGeometry(1.14, 0.12, 0.12).translate(0, 0.55 + k * 0.35, 0.56), BK));
  }, { hp: 30, ink: BL });
  const barrel = (x, z) => breakable('barrel', x, 0, z, 1.1, 1.2, 1.1, (g) => {
    g.add(mesh(new THREE.CylinderGeometry(0.5, 0.45, 1.2, 10).translate(0, 0.6, 0), OR)); for (const y of [0.25, 0.95]) g.add(mesh(new THREE.TorusGeometry(0.5, 0.04, 4, 14).rotateX(Math.PI / 2).translate(0, y, 0), BK));
  }, { hp: 30, ink: OR });
  const cactus = (x, z, h = 2.6) => breakable('cactus', x, 0, z, 0.9, h, 0.9, (g) => {
    g.add(mesh(new THREE.CylinderGeometry(0.28, 0.34, h, 8).translate(0, h / 2, 0), GR));
    g.add(mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.9, 7).translate(0.6, h * 0.55, 0), GR)); g.add(mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.7, 7).rotateZ(Math.PI / 2).translate(0.35, h * 0.38, 0), GR));
    g.add(mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.7, 7).translate(-0.55, h * 0.7, 0), GR)); g.add(mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.6, 7).rotateZ(Math.PI / 2).translate(-0.3, h * 0.55, 0), GR));
    g.add(mesh(new THREE.SphereGeometry(0.16, 6, 5).translate(0, h + 0.05, 0), PK));
  }, { hp: 40, ink: GR });
  // a piñata: a striped donkey hung on a string, bursting with candy
  const pinata = (x, y, z) => breakable('pinata', x, y, z, 1.1, 0.9, 0.6, (g) => {
    g.add(mesh(new THREE.BoxGeometry(0.9, 0.5, 0.45).translate(0, 0.55, 0), PK)); for (const k of [-0.3, 0, 0.3]) g.add(mesh(new THREE.BoxGeometry(0.1, 0.52, 0.47).translate(k, 0.55, 0), k ? GR : OR));
    g.add(mesh(new THREE.BoxGeometry(0.34, 0.3, 0.3).translate(0.6, 0.72, 0), PK)); g.add(mesh(new THREE.BoxGeometry(0.1, 0.22, 0.08).translate(0.62, 0.95, 0.1), OR)); g.add(mesh(new THREE.BoxGeometry(0.1, 0.22, 0.08).translate(0.62, 0.95, -0.1), OR));
    for (const [lx, lz] of [[-0.3, 0.15], [-0.3, -0.15], [0.3, 0.15], [0.3, -0.15]]) g.add(mesh(new THREE.BoxGeometry(0.12, 0.34, 0.12).translate(lx, 0.15, lz), PK));
    g.add(mesh(new THREE.BoxGeometry(0.03, 2.2, 0.03).translate(0, 1.85, 0), BK));
  }, { hp: 1, ink: PK });

  // ---------------- ground and the mesas around the edge ----------------
  box(0, -1, 0, 2 * P + 10, 1, 2 * P + 10);
  const mesa = (x, z, w, d) => { box(x, 0, z, w, 11, d); box(x + rand(-1.2, 1.2), 11, z + rand(-1.2, 1.2), w * 0.78, 7, d * 0.78); box(x + rand(-1, 1), 18, z + rand(-1, 1), w * 0.5, 5, d * 0.5); };
  for (let i = -2; i <= 2; i++) { mesa(i * 24, -P, 19, 8); mesa(i * 24, P, 19, 8); mesa(-P, i * 24, 8, 19); mesa(P, i * 24, 8, 19); }
  // trails between the mesas are where the doodles come from
  for (let i = -2; i < 2; i++) { spawn(i * 24 + 12, 0, -P + 5); spawn(i * 24 + 12, 0, P - 5); spawn(-P + 5, 0, i * 24 + 12); spawn(P - 5, 0, i * 24 + 12); }
  // an invisible lid so nobody leaves through the sky; the hook will not bite it
  collider(0, 62, 0, 2 * P + 40, 6, 2 * P + 40, { noNav: true, noGrapple: true });

  // ---------------- the plaza: paving, a fountain, and a sombrero floating above it ----------------
  slab(-24, -24, 24, 24, 0.15, 0.15);
  cyl(0, 0, 0, 5.5, 1.1); cyl(0, 1.1, 0, 1.2, 2.6); cyl(0, 3.7, 0, 2.4, 0.5); sphere(0, 5.4, 0, 0.7, { ink: BL }); ring(0, 7.2, 0, 'y');
  addGeo(new THREE.CylinderGeometry(5.1, 5.1, 0.08, 20).translate(0, 1.1, 0), BL);
  for (let k = 0; k < 8; k++) { const a = (k / 8) * TAU; addGeo(new THREE.CylinderGeometry(0.06, 0.06, 2.6, 5).rotateZ(0.35).rotateY(a).translate(Math.cos(a) * 1.7, 5.0, Math.sin(a) * 1.7), BL); }
  cyl(0, 13, 0, 8, 0.45, { ink: OR }); cyl(0, 13.45, 0, 3.2, 3, { ink: OR }); addGeo(new THREE.CylinderGeometry(3.3, 3.3, 0.5, 16).translate(0, 13.9, 0), PK);
  for (let k = 0; k < 6; k++) { const a = (k / 6) * TAU; ring(Math.cos(a) * 7.2, 12.2, Math.sin(a) * 7.2, 'y'); }
  ring(0, 17.5, 0, 'y');

  // ---------------- the bandstand, with a mariachi band that never stops ----------------
  cyl(0, 0, -26, 6.5, 1.2); stairs(0, 0, -18.2, '-z', 4, 4.5, { rise: 0.3, run: 0.55 });
  for (let k = 0; k < 8; k++) { const a = (k / 8) * TAU + Math.PI / 8; cyl(Math.cos(a) * 5.6, 1.2, -26 + Math.sin(a) * 5.6, 0.22, 4.2, { noCollide: true, ink: OR }); }
  addGeo(new THREE.ConeGeometry(7.6, 3.2, 8).translate(0, 7.0, -26), OR); collider(0, 5.4, -26, 9, 0.5, 9, { noNav: true }); addGeo(new THREE.CylinderGeometry(7.6, 7.6, 0.3, 8).translate(0, 5.55, -26), BL); ring(0, 9.4, -26, 'y');
  const mariachi = (x, z, yaw, guitar) => {
    const m = buildHumanoid(makeInkMaterial({ ink: BK, shadeScale: 0, shadeBias: 1 }), makeInkMaterial({ ink: BK, fill: true, side: THREE.DoubleSide }), { weapon: 'rifle', scale: 1, hat: 'none', build: { bodyW: 1.05, headS: 1, limbR: 0.034 } });
    const J = m.J; while (J.gun.children.length) J.gun.remove(J.gun.children[0]);
    // sombrero: a wide brim and a tall crown; a guitar or a trumpet in the hands
    const hat = new THREE.Group(); hat.add(mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.05, 14), OR), mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.28, 10).translate(0, 0.16, 0), OR), mesh(new THREE.TorusGeometry(0.24, 0.03, 4, 12).rotateX(Math.PI / 2).translate(0, 0.06, 0), PK)); hat.position.y = 0.5; J.headG.add(hat);
    if (guitar) { J.gun.add(mesh(new THREE.BoxGeometry(0.34, 0.12, 0.5).translate(0, 0.02, 0.05), OR), mesh(new THREE.BoxGeometry(0.06, 0.05, 0.7).translate(0, 0.06, 0.55), BK)); J.armR.rotation.x = -0.9; J.armL.rotation.x = -1.0; J.armL.rotation.y = 0.5; J.foreL.rotation.x = -0.9; }
    else { J.gun.add(mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.55, 7).rotateX(Math.PI / 2).translate(0, 0.02, 0.25), OR), mesh(new THREE.CylinderGeometry(0.14, 0.05, 0.16, 8).rotateX(Math.PI / 2).translate(0, 0.02, 0.55), OR)); J.armR.rotation.x = -1.6; J.armL.rotation.x = -1.5; J.armL.rotation.y = 0.4; J.foreL.rotation.x = -0.4; J.headG.rotation.x = -0.25; }
    m.root.position.set(x, 1.2, z); m.root.rotation.y = yaw; scene.add(m.root); L.meshes.push(m.root);
    L.animated.push({ mesh: m.root, update: (t) => { const s = Math.sin(t * 6 + x); m.root.position.y = 1.2 + Math.max(0, s) * 0.08; J.hips.parent.rotation.z = s * 0.04; if (guitar) J.foreR.rotation.x = -0.5 + Math.sin(t * 9 + x) * 0.25; else J.headG.rotation.z = Math.sin(t * 4 + x) * 0.08; } });
  };
  mariachi(-2.6, -27.5, 0.4, true); mariachi(0, -28.5, 0, false); mariachi(2.6, -27.5, -0.4, true);

  // ---------------- the church: a nave, a bell tower you can climb, a domed second tower ----------------
  box(0, 0, 44, 24, 11, 16); box(0, 11, 44, 24, 1.6, 4.5); box(0, 12.6, 44, 3, 1.2, 3); box(0, 13.8, 44, 0.3, 2.2, 0.3); box(0, 15.2, 44, 1.4, 0.3, 0.3);
  slab(-7, 33.5, 7, 36.5, 0.8, 0.8); box(-3.2, 0, 35.8, 0.5, 5.4, 0.5, { noCollide: true, ink: BK }); box(3.2, 0, 35.8, 0.5, 5.4, 0.5, { noCollide: true, ink: BK }); addGeo(new THREE.TorusGeometry(3.2, 0.25, 6, 16, Math.PI).translate(0, 5.4, 35.8), BK);
  for (const x of [-8, 8]) for (const y of [3, 7]) box(x, y, 35.9, 1.6, 2.2, 0.3, { noCollide: true, ink: BK });
  box(-10, 0, 46, 6, 26, 6); for (const [dx, dz] of [[-2.5, -2.5], [2.5, -2.5], [-2.5, 2.5], [2.5, 2.5]]) box(-10 + dx, 26, 46 + dz, 0.6, 4, 0.6);
  box(-10, 30, 46, 7.2, 0.6, 7.2); box(-10, 30.6, 46, 0.3, 3, 0.3); box(-10, 32.4, 46, 1.6, 0.3, 0.3); sphere(-10, 28.2, 46, 0.95, { ink: OR }); ring(-10, 27.4, 42.2, 'y'); ring(-10, 34.2, 46, 'y');
  for (const y of [8, 15, 21]) { box(-10, y, 42.4, 6, 0.4, 1.3, { ink: OR }); box(-13.6, y + 3, 46, 1.3, 0.4, 6, { ink: OR }); }
  box(10, 0, 46, 6, 15, 6); sphere(10, 17.4, 46, 3.6, { ink: OR }); collider(10, 15, 46, 6, 5, 6, { noNav: true }); box(10, 20.8, 46, 0.3, 2, 0.3); ring(10, 23.4, 46, 'y');
  for (const y of [6, 11]) box(13.6, y, 46, 1.3, 0.4, 6, { ink: OR });

  // ---------------- adobe houses east and west, flat roofs with stairs, colored doors ----------------
  const house = (x, z, w, d, h, door, side) => {
    box(x, 0, z, w, h, d); box(x, h, z, w + 0.6, 0.35, d + 0.6, { ink: OR }); rail(x - w / 2, z - d / 2, x + w / 2, z - d / 2, h + 0.35, { ink: OR });
    const dx = side * (w / 2 + 0.01); box(x + dx, 0, z, 0.15, 2.6, 1.4, { noCollide: true, ink: door }); box(x + dx, 2.6, z, 0.15, 0.3, 1.8, { noCollide: true, ink: BK });
    for (const wz of [z - d * 0.32, z + d * 0.32]) box(x + dx, 1.6, wz, 0.12, 1.1, 1.1, { noCollide: true, ink: BK });
    const n = Math.round(h / 0.3); stairs(x - side * (w / 2 + 0.3), 0, z + d / 2 + 0.9, side > 0 ? '+x' : '-x', n, 1.6, { rise: h / n, run: 0.42 });
    box(x, h + 0.35, z + d / 2 - 1.2, 2.2, 0.9, 1.4, { ink: OR }); ring(x, h + 3.2, z, 'y');
  };
  house(-40, -20, 11, 9, 6, GR, 1); house(-40, -4, 9, 8, 5, PK, 1); house(-40, 14, 12, 10, 7.5, OR, 1);
  house(40, -18, 12, 9, 7, PK, -1); house(40, 0, 9, 8, 5.5, GR, -1); house(40, 16, 11, 10, 6.5, OR, -1);
  // strings of papel picado across the plaza, with rings hung along them
  const banner = (x1, y1, z1, x2, y2, z2, n) => {
    for (let i = 0; i <= n; i++) { const t = i / n, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t - Math.sin(t * Math.PI) * 1.2, z = z1 + (z2 - z1) * t; if (i < n) { const dx = (x2 - x1) / n, dz = (z2 - z1) / n; addGeo(new THREE.BoxGeometry(Math.hypot(dx, dz) + 0.05, 0.05, 0.05).rotateY(-Math.atan2(dz, dx)).translate(x + dx / 2, y, z + dz / 2), BK); } if (i % 2 === 1) addGeo(new THREE.BoxGeometry(0.7, 0.55, 0.02).rotateY(-Math.atan2(z2 - z1, x2 - x1)).translate(x, y - 0.32, z), [PK, GR, OR][i % 3]); if (i === Math.floor(n / 2)) ring(x, y - 1.2, z, 'y'); }
  };
  banner(-34.5, 6.4, -20, -8, 30.6, 42, 22); banner(34.5, 7.4, -18, 8, 21.2, 42, 22); banner(-34.5, 5.4, -4, 34.5, 5.9, 0, 26); banner(-34.5, 7.9, 14, 34.5, 6.9, 16, 26);

  // ---------------- the market: stalls under striped canopies, piñatas hanging, pots and crates about ----------------
  const stall = (x, z, w, d, yaw) => {
    box(x, 0, z, w, 0.9, d); for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) box(x + sx * (w / 2 - 0.15), 0, z + sz * (d / 2 - 0.15), 0.14, 2.9, 0.14, { noCollide: true, ink: BK });
    for (let i = 0; i < 5; i++) addGeo(new THREE.BoxGeometry(w + 0.6, 0.06, (d + 0.6) / 5).translate(x, 2.95, z - (d + 0.6) / 2 + (i + 0.5) * (d + 0.6) / 5), i % 2 ? PK : OR);
    collider(x, 2.9, z, w + 0.6, 0.12, d + 0.6, { noNav: true });
  };
  stall(-20, 22, 4.5, 2.4); stall(-13, 22, 4.5, 2.4); stall(20, 22, 4.5, 2.4); stall(13, 22, 4.5, 2.4); stall(-24, -12, 2.4, 4.5); stall(26, -8, 2.4, 4.5);
  pinata(-20, 1.3, 22); pinata(13, 1.3, 22); pinata(-24, 1.3, -12); pinata(26, 1.3, -8); pinata(0, 6.4, 8); pinata(-9, 9.5, 12); pinata(9, 9.5, 12);
  for (const [x, z] of [[-17.5, 24.5], [-9.5, 24.5], [16.5, 24.5], [23.5, 24.5], [-27.5, -9], [-27.5, -15], [29, -5], [29, -11]]) crate(x, z);
  for (const [x, z] of [[-33, -14], [-33, -12.6], [-33, -6], [-33, 10], [-33, 20], [33, -12], [33, -3], [33, 6], [33, 22], [-6, 30], [6, 30], [-18, 31], [18, 31], [-3, -33], [3, -33]]) pot(x, z, Math.random() < 0.3);
  for (const [x, z] of [[-18, -30], [18, -30], [-30, 30], [30, 30]]) barrel(x, z);

  // ---------------- the taco cart: the best tacos on the page, and where the healing comes from ----------------
  box(24, 0, 4, 3.2, 1.3, 1.6, { ink: OR }); box(24, 1.3, 4, 3.4, 0.9, 1.8, { ink: BL }); box(22.5, 0, 4, 0.14, 3.6, 0.14, { noCollide: true, ink: BK }); box(25.5, 0, 4, 0.14, 3.6, 0.14, { noCollide: true, ink: BK });
  for (let i = 0; i < 4; i++) addGeo(new THREE.BoxGeometry(3.6, 0.06, 0.55).translate(24, 3.62, 3 + i * 0.55), i % 2 ? GR : OR);
  addGeo(new THREE.CylinderGeometry(0.34, 0.34, 0.14, 12).rotateZ(Math.PI / 2).translate(23.1, 0.34, 3.1), BK); addGeo(new THREE.CylinderGeometry(0.34, 0.34, 0.14, 12).rotateZ(Math.PI / 2).translate(24.9, 0.34, 3.1), BK);
  { const g = new THREE.CylinderGeometry(0.7, 0.7, 0.35, 12, 1, false, 0, Math.PI); g.rotateZ(Math.PI / 2); g.rotateX(-Math.PI / 2); g.translate(24, 4.6, 4); addGeo(g, OR); addGeo(new THREE.BoxGeometry(1.3, 0.14, 0.3).translate(24, 4.62, 4), GR); addGeo(new THREE.BoxGeometry(1.1, 0.1, 0.2).translate(24, 4.76, 4), BK); }
  for (const [x, z] of [[22, 6.5], [26, 6.5], [24, 1.5]]) pickup(x, 0, z);

  // ---------------- cacti and rocks in the dust outside the plaza ----------------
  for (const [x, z, h] of [[-46, -40, 2.8], [-50, -28, 2.2], [-48, 30, 3.0], [-44, 44, 2.4], [46, -44, 2.6], [50, -30, 2.2], [48, 34, 3.2], [44, 46, 2.5], [-30, -48, 2.8], [30, -48, 2.4], [-28, 48, 2.6], [28, 50, 2.9], [12, -44, 2.2], [-12, -44, 2.6]]) cactus(x, z, h);
  for (const [x, z, r] of [[-52, -46, 2.2], [52, 48, 2.6], [-52, 48, 1.8], [52, -48, 2.0], [0, -52, 1.6], [0, 52, 1.6]]) { sphere(x, r * 0.55, z, r, { ink: BL }); collider(x, 0, z, r * 1.5, r * 1.2, r * 1.5); }
  // a few low walls and a well for cover between the plaza and the market
  box(-12, 0, -12, 8, 1.1, 0.5, { ink: OR }); box(12, 0, -12, 8, 1.1, 0.5, { ink: OR }); box(-30, 0, 34, 0.5, 1.1, 8, { ink: OR }); box(30, 0, 34, 0.5, 1.1, 8, { ink: OR });
  cyl(-14, 0, 8, 1.3, 1.0); box(-14, 1, 8, 0.15, 2.0, 0.15, { noCollide: true, ink: BK }); box(-14, 3, 8, 2.2, 0.3, 0.3, { noCollide: true, ink: BK });

  // ---------------- where things are: perches, pickups, match spawns ----------------
  for (const [x, y, z] of [[-10, 30.6, 46], [10, 15, 46], [-40, 7.5, 14], [40, 7, -18], [0, 5.9, -26], [0, 13.45, 0]]) sniper(x, y, z);
  for (const [x, y, z] of [[0, 1.25, 8], [-20, 0, 0], [20, 0, -14], [0, 0, -36], [-40, 6, -20], [40, 5.5, 0], [0, 11, 44], [0, 13.5, 0], [-24, 0, 24], [24, 0, 24]]) pickup(x, y, z);
  for (const [x, y, z] of [[-40, 6.2, -20], [40, 7.2, -18], [-40, 7.7, 14], [40, 6.7, 16], [0, 11.2, 44], [0, 5.6, -26], [-46, 0, 0], [46, 0, 0], [0, 0, -50], [-30, 0, 46], [30, 0, 46], [0, 13.6, 0], [-10, 30.8, 46]]) L.arenaSpawns.push(new THREE.Vector3(x, y, z));

  // ---------------- sky: a fat sun, far mesas, paper planes ----------------
  addGeo(new THREE.SphereGeometry(14, 14, 10).translate(70, 95, -150), OR);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; const g = new THREE.BoxGeometry(7, 0.9, 0.9); g.rotateZ(a); g.translate(70 + Math.cos(a) * 21, 95 + Math.sin(a) * 21, -150); addGeo(g, OR); }
  for (const [x, z, w, h] of [[-120, -160, 60, 30], [40, -190, 90, 36], [150, -120, 70, 26], [-170, 60, 50, 24], [160, 90, 80, 30], [-60, 190, 100, 34]]) { addGeo(new THREE.BoxGeometry(w, h, 30).translate(x, h / 2, z), BL); addGeo(new THREE.BoxGeometry(w * 0.6, h * 0.5, 22).translate(x, h + h * 0.25, z), BL); }
  planes(3, 30, 26, { rStep: 8, hStep: 6, scale: 1.4 });
  B.finish(); return L;
}

function buildStudio(B) {
  const { L, box, collider } = B;
  L.key = 'studio';
  // A clean white infinity studio for the main menu showcase
  // We don't draw a solid floor since the background is already paper-white.
  
  // Create a subtle grid pattern on the floor using BLUE ink
  for(let i = -50; i <= 50; i += 10) {
    box(i, 0.05, 0, 0.2, 0.1, 100, { noCollide: true, ink: 0 }); // INK.BLUE = 0
    box(0, 0.05, i, 100, 0.1, 0.2, { noCollide: true, ink: 0 });
  }

  // Put a physical floor collider under the player
  collider(0, -2, 0, 100, 2, 100);
  
  // Position player center-right for the showcase camera
  L.playerStart.set(0, 0, 0); 
  
  B.finish();
  return L;
}

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
  pirate_cove: buildPirateCove,
  harbor_port: buildHarborPort,
  cove: buildCove
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
export function buildClockwork(B, arena = false) {
  const { L, box, slab, wallX, wallZ, stairs, rail, cyl, sphere, ring, spawn, sniper, pickup, planes, addGeo, collider, scene } = B;
  const OR = 3, GR = 4, PK = 5, BK = 2, BL = 0, RD = 1;

  function orientedCyl(p1, p2, radius, seg = 6, ink = BK) {
    const v1 = p1 instanceof THREE.Vector3 ? p1 : new THREE.Vector3(...p1);
    const v2 = p2 instanceof THREE.Vector3 ? p2 : new THREE.Vector3(...p2);
    const dir = new THREE.Vector3().subVectors(v2, v1);
    const len = dir.length();
    if (len < 0.01) return;
    const g = new THREE.CylinderGeometry(radius, radius, len, seg);
    g.translate(0, len / 2, 0);
    g.rotateX(Math.PI / 2);
    g.lookAt(dir);
    g.translate(v1.x, v1.y, v1.z);
    addGeo(g, ink);
  }

  // Composite circular collider for smooth footing on circular gears and hubs
  function circleCollider(cx, cy, cz, r, h, o = {}) {
    collider(cx, cy, cz, r * 1.45, h, r * 1.95, o);
    collider(cx, cy, cz, r * 1.95, h, r * 1.45, o);
    collider(cx, cy, cz, r * 1.72, h, r * 1.72, o);
  }

  L.key = 'clockwork';
  // Player spawns firmly on the South Mezzanine observation deck, looking North into the great clock
  L.playerStart.set(0, 0.5, 36);

  const P = arena ? 68 : 55, T = 6, PH = arena ? 34 : 24;
  L.bounds.minX = -P; L.bounds.maxX = P; L.bounds.minZ = -P; L.bounds.maxZ = P;

  // ==================== 0. SOLID FOUNDATION FLOOR & PERIMETER ====================
  // Lethal Grinding Pit (hole in the center floor x: -8 to 8, z: -16 to 4)
  slab(-P - T/2, -P - T/2, -8, P + T/2, 0, 1, { ink: BL }); // West
  slab(8, -P - T/2, P + T/2, P + T/2, 0, 1, { ink: BL }); // East
  slab(-8, -P - T/2, 8, -16, 0, 1, { ink: BL }); // North
  slab(-8, 4, 8, P + T/2, 0, 1, { ink: BL }); // South

  // Decorative cog edge and pit glow
  { const pitE1 = new THREE.BoxGeometry(16, 1, 0.4); pitE1.translate(0, -0.5, -16); addGeo(pitE1, OR); }
  { const pitE2 = new THREE.BoxGeometry(16, 1, 0.4); pitE2.translate(0, -0.5, 4); addGeo(pitE2, OR); }
  { const pitE3 = new THREE.BoxGeometry(0.4, 1, 20); pitE3.translate(-8, -0.5, -6); addGeo(pitE3, OR); }
  { const pitE4 = new THREE.BoxGeometry(0.4, 1, 20); pitE4.translate(8, -0.5, -6); addGeo(pitE4, OR); }
  box(0, -3, -6, 16, 0.1, 20, { ink: RD, noCollide: true }); // Red glowing abyss
  rail(-8, 4, 8, 4, 0, { ink: OR }); // South warning rail
  rail(-8, -16, 8, -16, 0, { ink: OR }); // North warning rail

  // Perimeter enclosing walls anchored firmly into the floor
  box(0, 0, -P, 2 * P + T, PH, T, { ink: BL });
  box(0, 0, P, 2 * P + T, PH, T, { ink: BL });
  box(-P, 0, 0, T, PH, 2 * P + T, { ink: BL });
  box(P, 0, 0, T, PH, 2 * P + T, { ink: BL });

  if (!arena) {
    const NG = { noNav: true, noGrapple: true };
    collider(0, PH, -P, 2 * P + T, 40, T, NG);
    collider(0, PH, P, 2 * P + T, 40, T, NG);
    collider(-P, PH, 0, T, 40, 2 * P + T, NG);
    collider(P, PH, 0, T, 40, 2 * P + T, NG);
    collider(0, 56, 0, 2 * P + 40, 8, 2 * P + 40, NG);

    // Solo Mode Clockwork Arch Ribs
    const R = 98, C = -20;
    for (let k = 0; k < 6; k++) {
      const g = new THREE.TorusGeometry(R, 0.45, 5, 60, Math.PI);
      g.rotateY(k * Math.PI / 6); g.translate(0, C, 0); addGeo(g, BL);
    }
    for (const h of [30, 46, 60, 72]) {
      if (h - C > R) continue;
      const r = Math.sqrt(R * R - (h - C) * (h - C));
      const g = new THREE.TorusGeometry(r, 0.4, 5, 96);
      g.rotateX(Math.PI / 2); g.translate(0, h, 0); addGeo(g, BL);
    }
  }

  // 8 Perimeter Observation Balconies
  const P_BALCS = [
    [-36, 8, -51.2, 8, 2.4, 'y'], [36, 8, -51.2, 8, 2.4, 'y'],
    [-51.2, 12, -18, 2.4, 8, 'x'], [-51.2, 12, 18, 2.4, 8, 'x'],
    [51.2, 12, -18, 2.4, 8, 'x'], [51.2, 12, 18, 2.4, 8, 'x'],
    [-28, 8, 51.2, 8, 2.4, 'y'], [28, 8, 51.2, 8, 2.4, 'y']
  ];
  for (const [bx, by, bz, bw, bd, ax] of P_BALCS) {
    box(bx, by, bz, bw, 0.4, bd, { ink: BL });
    const inX = Math.abs(bx) > 40 ? (bx > 0 ? bx - 1.8 : bx + 1.8) : bx;
    const inZ = Math.abs(bz) > 40 ? (bz > 0 ? bz - 1.8 : bz + 1.8) : bz;
    ring(inX, by + 3.5, inZ, ax);
  }

  // Decorative brass floor inlays & concentric measurement scales
  for (const r of [12, 22, 34]) {
    const g = new THREE.TorusGeometry(r, 0.08, 4, 48);
    g.rotateX(Math.PI / 2);
    g.translate(0, 0.02, -6);
    addGeo(g, OR);
  }

  // ==================== 1. TIER 0: WORKSHOP & SOUTH MEZZANINE (y = 0.0 - 0.5m) ====================
  // South Observation Mezzanine
  slab(-22, 28, 22, P - 3, 0.5, 0.5, { ink: BL });
  rail(-22, 28, -6, 28, 0.5, { ink: BK });
  rail(6, 28, 22, 28, 0.5, { ink: BK });

  // Wide 2-step stair connecting Ground (y=0) to South Mezzanine (y=0.5)
  stairs(0, 0, 26.5, '+z', 2, 6, { rise: 0.25, run: 0.75, ink: BK });

  // Clockmaker's Desk & Workshop Props on South Mezzanine
  box(0, 0.5, 42, 5, 1.2, 2, { ink: OR });
  box(0, 1.7, 42, 4.6, 0.1, 1.6, { ink: BK, noCollide: true });
  // Hoist winch on West side
  box(-9, 0.5, 34, 2.4, 2.0, 1.8, { ink: BK });
  // Oil drums and parts crates
  cyl(9, 0.5, 34, 0.6, 1.4, { ink: GR });
  cyl(10.4, 0.5, 34, 0.6, 1.4, { ink: GR });
  cyl(9.7, 0.5, 35.3, 0.6, 1.4, { ink: GR });
  box(12, 0.5, 38, 2, 1.6, 2, { ink: OR });
  box(-12, 0.5, 38, 1.8, 1.4, 1.8, { ink: OR });

  // Ground-Level Tactical Cover between sectors
  box(4, 0, 6, 2.2, 1.6, 1.8, { ink: BK }); // Gear hoist winch
  cyl(-22, 0, 12, 0.6, 1.4, { ink: GR }); cyl(-23.4, 0, 12, 0.6, 1.4, { ink: GR }); // Oil drums
  cyl(22, 0, 12, 0.6, 1.4, { ink: GR });
  cyl(-22, 0, -28, 0.45, 2.5, { axis: 'z', ink: OR }); // Copper pipe segments
  cyl(22, 0, -28, 0.45, 2.5, { axis: 'z', ink: OR });
  box(-12, 0, -4, 2.4, 1.2, 1.6, { ink: BL }); // Tool chest
  box(12, 0, -4, 2.4, 1.2, 1.6, { ink: BL }); // Tool chest

  // Central Balance Wheel flush inlay in the South workshop hub (spaced clearly from Gear Alpha)
  cyl(0, 0, 16, 6, 0.2, { seg: 24, ink: BL });
  circleCollider(0, 0, 16, 6, 0.2, { tag: 'hub' });
  ring(0, 3.8, 16, 'y');
  for (let s = 0; s < 6; s++) {
    const a = s * (Math.PI / 3);
    box(Math.cos(a) * 3.0, 0.2, 16 + Math.sin(a) * 3.0, 0.35, 0.1, 5.5, { noCollide: true, ink: OR });
  }

  // ==================== 2. TIER 1: MAIN DRIVER COG ALPHA (y = 1.6m) ====================
  // Colossal central gear brought down to human combat scale: walking surface at y = 1.6m
  const alphaR = 10.5, alphaX = 0, alphaZ = -6, alphaY = 0, alphaH = 1.6;
  cyl(alphaX, alphaY, alphaZ, alphaR, alphaH, { seg: 28, ink: OR, noCollide: true });
  circleCollider(alphaX, alphaY, alphaZ, alphaR, alphaH, { tag: 'gear' });

  // Low decorative brass arbor hub with grapple point
  cyl(alphaX, alphaH, alphaZ, 1.4, 2.2, { ink: BK, noCollide: true });
  ring(alphaX, alphaH + 2.5, alphaZ, 'y');

  function gearTooth(cx, cy, cz, r, angle, w, h, d, ink) {
    const x = cx + Math.cos(angle) * r;
    const z = cz + Math.sin(angle) * r;
    const g = new THREE.BoxGeometry(w, h, d);
    g.rotateY(-angle);
    g.translate(x, cy + h / 2, z);
    addGeo(g, ink);
    collider(x, cy, z, Math.min(w, d), h, Math.min(w, d), { tag: 'gear' });
  }

  // Walkable teeth around Gear Alpha - leaving open bays at the 4 cardinal stair landings
  const teethAlpha = 16;
  for (let i = 0; i < teethAlpha; i++) {
    // Skip teeth at the 4 cardinal landing directions (i = 0, 4, 8, 12) so stairs enter unobstructed
    if (i % 4 === 0) continue;
    gearTooth(alphaX, alphaY, alphaZ, alphaR + 0.4, i * (Math.PI * 2 / teethAlpha), 1.6, alphaH, 1.6, OR);
  }

  // --- 4 DIRECT ACCESSIBLE STAIRWAYS ONTO GEAR ALPHA (from all directions) ---
  // South Approach (from Workshop Floor Hub)
  stairs(0, 0, 8.5, '-z', 8, 3.2, { rise: alphaH / 8, run: 0.5, ink: BK });
  // East Approach (from East Boiler Sector)
  stairs(14.5, 0, alphaZ, '-x', 8, 3.0, { rise: alphaH / 8, run: 0.5, ink: BK });
  // West Approach (from West Piston Sector)
  stairs(-14.5, 0, alphaZ, '+x', 8, 3.0, { rise: alphaH / 8, run: 0.5, ink: BK });
  // North Approach (from North Ground)
  stairs(0, 0, -20.5, '+z', 8, 3.2, { rise: alphaH / 8, run: 0.5, ink: BK });

  // ==================== 3. TIER 2: INTERLOCKING COGS BETA & GAMMA (y = 3.6m) ====================
  // Gear Beta (West)
  const betaR = 8.0, betaX = -18, betaZ = -20, betaY = 0, betaH = 3.6;
  cyl(betaX, betaY, betaZ, betaR, betaH, { seg: 24, ink: OR, noCollide: true });
  // Composite deck colliders for Gear Beta leaving East stairwell entry (x: -14.5 to -10, z: -16 to -12.5) open for stair ascent
  slab(-25.5, -27.5, -14.5, -12.5, betaH, 0.4, { tag: 'gear' }); // Main gear body west of stair
  slab(-14.5, -27.5, -10.5, -16.0, betaH, 0.4, { tag: 'gear' }); // North-east gear quadrant
  slab(-14.5, -12.5, -10.5, -12.0, betaH, 0.4, { tag: 'gear' }); // South-east gear quadrant
  cyl(betaX, betaH, betaZ, 1.2, 2.0, { ink: BK, noCollide: true });
  ring(betaX, betaH + 2.2, betaZ, 'y');
  const teethBeta = 12;
  for (let i = 0; i < teethBeta; i++) {
    // Skip tooth at stair entry opening (around angle ~ 0 / East)
    if (i === 11 || i === 0 || i === 1) continue;
    gearTooth(betaX, betaH - 0.4, betaZ, betaR + 0.5, (i + 0.5) * (Math.PI * 2 / teethBeta), 1.6, 0.4, 1.6, OR);
  }

  // Intermediate landing connecting Gear Alpha (y=1.6) to Gear Beta stairs
  slab(-14, -18, -10, -14, alphaH, 0.4, { ink: BK });
  // Direct stairs climbing West onto Gear Beta (y=3.6)
  stairs(-10.5, alphaH, -14.2, '-x', 7, 2.8, { rise: (betaH - alphaH) / 7, run: 0.55, ink: BK });

  // Gear Gamma (East)
  const gammaR = 8.0, gammaX = 18, gammaZ = -20, gammaY = 0, gammaH = 3.6;
  cyl(gammaX, gammaY, gammaZ, gammaR, gammaH, { seg: 24, ink: OR, noCollide: true });
  // Composite deck colliders for Gear Gamma leaving West stairwell entry (x: 10 to 14.5, z: -16 to -12.5) open for stair ascent
  slab(14.5, -27.5, 25.5, -12.5, gammaH, 0.4, { tag: 'gear' }); // Main gear body east of stair
  slab(10.5, -27.5, 14.5, -16.0, gammaH, 0.4, { tag: 'gear' }); // North-west gear quadrant
  slab(10.5, -12.0, 14.5, -11.5, gammaH, 0.4, { tag: 'gear' }); // South-west gear quadrant
  cyl(gammaX, gammaH, gammaZ, 1.2, 2.0, { ink: BK, noCollide: true });
  ring(gammaX, gammaH + 2.2, gammaZ, 'y');
  const teethGamma = 12;
  for (let i = 0; i < teethGamma; i++) {
    // Skip tooth at stair entry opening (around angle ~ PI / West)
    if (i === 4 || i === 5 || i === 6 || i === 7) continue;
    gearTooth(gammaX, gammaH - 0.4, gammaZ, gammaR + 0.5, (i + 0.5) * (Math.PI * 2 / teethGamma), 1.6, 0.4, 1.6, OR);
  }

  // Intermediate landing connecting Gear Alpha (y=1.6) to Gear Gamma stairs
  slab(10, -18, 14, -14, alphaH, 0.4, { ink: BK });
  // Direct stairs climbing East onto Gear Gamma (y=3.6)
  stairs(10.5, alphaH, -14.2, '+x', 7, 2.8, { rise: (gammaH - alphaH) / 7, run: 0.55, ink: BK });

  // High Transverse Catwalk connecting Gear Beta directly to Gear Gamma across center (y = 3.6m)
  slab(-18, -22, 18, -18, betaH, 0.4, { ink: BK });
  // South catwalk railing with openings for side stairs
  rail(-18, -18, -12, -18, betaH, { ink: BL });
  rail(-6, -18, 6, -18, betaH, { ink: BL });
  rail(12, -18, 18, -18, betaH, { ink: BL });
  // North catwalk railing with open gaps for Escapement stairs
  rail(-18, -22, -12, -22, betaH, { ink: BL });
  rail(-7, -22, 7, -22, betaH, { ink: BL });
  rail(12, -22, 18, -22, betaH, { ink: BL });

  // Catwalk connecting Gear Beta to West Piston Platform
  slab(-28, -22, -18, -18, betaH, 0.4, { ink: BK });
  // Catwalk connecting Gear Gamma to East Boiler Platform
  slab(18, -22, 28, -18, gammaH, 0.4, { ink: BK });

  // ==================== 4. WEST SECTOR: PISTON ENGINES & SERVICE DECK ====================
  // Elevated Piston Platform at y = 3.6m
  slab(-46, -30, -28, 0, betaH, 0.4, { ink: BK });
  // South railing with open landing threshold for service stairs at x = -32
  rail(-46, 0, -34, 0, betaH, { ink: BL });
  rail(-30, 0, -28, 0, betaH, { ink: BL });
  rail(-46, -30, -46, 0, betaH, { ink: BL });

  // Stairs from Ground (y=0) to West Piston Platform (y=3.6) arriving at open threshold
  stairs(-32, 0, 7.5, '-z', 12, 2.5, { rise: betaH / 12, run: 0.6, ink: BK });

  // Rubber vibration mount pads
  box(-41, betaH, -20, 6.4, 0.2, 2.4, { ink: PK });
  box(-41, betaH, -8, 6.4, 0.2, 2.4, { ink: PK });

  // Piston Cylinder Housings & Bolted head covers
  cyl(-41, betaH + 1.2, -20, 1.5, 6, { axis: 'z', seg: 16, ink: BK });
  cyl(-44, betaH + 1.2, -20, 1.6, 0.4, { axis: 'z', seg: 16, ink: BK });
  cyl(-41, betaH + 1.2, -8, 1.5, 6, { axis: 'z', seg: 16, ink: BK });
  cyl(-44, betaH + 1.2, -8, 1.6, 0.4, { axis: 'z', seg: 16, ink: BK });

  // Crosshead guide bars
  box(-41, betaH + 0.3, -14, 0.4, 0.3, 8, { ink: BK, noCollide: true });
  box(-41, betaH + 0.3, -2, 0.4, 0.3, 8, { ink: BK, noCollide: true });

  // Animated sliding pistons stroking visibly across the deck
  const pistonGroup = new THREE.Group();
  scene.add(pistonGroup);
  const pistonRodGeom = new THREE.BoxGeometry(1.6, 0.8, 2.2);
  const m1 = new THREE.Mesh(pistonRodGeom, makeInkMaterial({ ink: OR }));
  m1.position.set(-41, betaH + 1.2, -14);
  const m2 = new THREE.Mesh(pistonRodGeom, makeInkMaterial({ ink: OR }));
  m2.position.set(-41, betaH + 1.2, -2);
  pistonGroup.add(m1, m2);
  L.meshes.push(m1, m2);

  L.animated.push({
    mesh: pistonGroup,
    update: (t) => {
      const cycle = Math.sin(t * (Math.PI * 2 / 2.8));
      m1.position.z = -14 + cycle * 1.8;
      m2.position.z = -2 + cycle * 1.8;
    }
  });

  // Flyball Governor on West Deck
  cyl(-35, betaH, -14, 0.4, 4.0, { ink: BK, noCollide: true });
  sphere(-36.2, betaH + 2.8, -14, 0.65, { ink: OR });
  sphere(-33.8, betaH + 2.8, -14, 0.65, { ink: OR });
  ring(-35, betaH + 4.2, -14, 'y');

  // ==================== 5. EAST SECTOR: BOILER ROOM & STEAM MANIFOLD ====================
  // Elevated Boiler Platform at y = 3.6m
  slab(28, -30, 46, 0, gammaH, 0.4, { ink: BK });
  // South railing with open landing threshold for service stairs at x = 32
  rail(28, 0, 30, 0, gammaH, { ink: BL });
  rail(34, 0, 46, 0, gammaH, { ink: BL });
  rail(46, -30, 46, 0, gammaH, { ink: BL });

  // Stairs from Ground (y=0) to East Boiler Platform (y=3.6) arriving at open threshold
  stairs(32, 0, 7.5, '-z', 12, 2.5, { rise: gammaH / 12, run: 0.6, ink: BK });

  // Steam Boilers resting on brick firebox foundations
  box(37, 0, -18, 4.5, 2.0, 9, { ink: RD });
  box(34.7, 0.2, -18, 0.2, 1.6, 2.4, { ink: RD, noCollide: true }); // Firebox doors
  box(37, 0, -6, 4.5, 2.0, 9, { ink: RD });
  box(34.7, 0.2, -6, 0.2, 1.6, 2.4, { ink: RD, noCollide: true }); // Firebox doors
  cyl(37, 3.2, -18, 2.2, 10, { axis: 'z', seg: 16, ink: BL });
  cyl(37, 3.2, -6, 2.2, 10, { axis: 'z', seg: 16, ink: BL });

  // Steam manifold pipes & grapple valve
  orientedCyl([37, 5.4, -18], [37, 5.4, -6], 0.35, 8, BK);
  ring(37, 6.2, -12, 'y');

  // Flanged copper steam header catwalk
  cyl(37, 9.4, -12, 0.65, 20, { axis: 'z', ink: OR });
  slab(36.4, -22, 37.6, -2, 10.05, 0.1, { ink: BK }); // Walking surface
  
  // 3 Bourdon tube pressure dials
  for (const dz of [-18, -12, -6]) {
    const dial = new THREE.CylinderGeometry(1.4, 1.4, 0.4, 16);
    dial.rotateZ(Math.PI / 2); dial.translate(50.8, 8, dz); addGeo(dial, OR);
  }

  // ==================== 6. TIER 3: NORTH ESCAPEMENT MEZZANINE (y = 5.8m) ====================
  // North Escapement Mezzanine extended forward to z = -26.5m so stairs land flush onto solid floor
  const escH = 5.8;
  slab(-20, -48, 20, -26.5, escH, 0.4, { ink: BK });
  // Mezzanine front balustrade with stair openings
  rail(-20, -26.5, -12, -26.5, escH, { ink: BL });
  rail(-7, -26.5, 7, -26.5, escH, { ink: BL });
  rail(12, -26.5, 20, -26.5, escH, { ink: BL });

  // Dual sweeping staircases connecting Transverse Catwalk (y=3.6) directly to Escapement Mezzanine (y=5.8)
  // West Stair: starts at z = -22.0, runs 4.5m to z = -26.5
  stairs(-9.5, betaH, -22.0, '-z', 8, 2.5, { rise: (escH - betaH) / 8, run: 0.56, ink: BK });
  // East Stair: starts at z = -22.0, runs 4.5m to z = -26.5
  stairs(9.5, gammaH, -22.0, '-z', 8, 2.5, { rise: (escH - gammaH) / 8, run: 0.56, ink: BK });

  // Upright Ticking Escape Wheel on North Wall
  const escapeWheelGeom = new THREE.CylinderGeometry(3.2, 3.2, 0.5, 24);
  escapeWheelGeom.rotateX(Math.PI / 2);
  const escapeWheelMesh = new THREE.Mesh(escapeWheelGeom, makeInkMaterial({ ink: OR }));
  escapeWheelMesh.position.set(0, escH + 3.2, -47);
  scene.add(escapeWheelMesh);
  L.meshes.push(escapeWheelMesh);

  // Escapement Anchor Pallets
  const anchorGeom = new THREE.BoxGeometry(4.8, 0.35, 0.6);
  const anchorMesh = new THREE.Mesh(anchorGeom, makeInkMaterial({ ink: BK }));
  anchorMesh.position.set(0, escH + 6.2, -47);
  scene.add(anchorMesh);
  L.meshes.push(anchorMesh);

  let lastTick = -1;
  L.animated.push({
    mesh: escapeWheelMesh,
    update: (t) => {
      const tick = Math.floor(t * 2.5);
      escapeWheelMesh.rotation.z = -tick * (Math.PI / 12);
      anchorMesh.rotation.z = Math.sin(t * 2.5 * Math.PI) * 0.16;
      if (tick !== lastTick) {
        lastTick = tick;
        if (typeof window.audio !== 'undefined' && window.audio.ctx) {
          try { window.audio.tone({ freq: 800, dur: 0.03, gain: 0.05, type: 'square' }); } catch(e){}
        }
      }
    }
  });

  ring(0, escH + 1.2, -28, 'y'); // Balustrade sniper perch grapple ring

  // Grand Clock Face visual on North Wall
  const clockDialGeom = new THREE.TorusGeometry(5.5, 0.25, 6, 48);
  clockDialGeom.translate(0, escH + 4.5, -P + 0.3);
  addGeo(clockDialGeom, OR);
  // Clock hands
  box(0, escH + 5.5, -P + 0.4, 0.2, 3.2, 0.1, { ink: BK, noCollide: true });
  box(1.2, escH + 4.5, -P + 0.4, 2.2, 0.2, 0.1, { ink: BK, noCollide: true });

  // ==================== 7. DYNAMIC EYE-LEVEL MACHINERY ====================
  // 1. Swinging Heavy Pendulum - brought down so bob sweeps across the arena at y = 2.2m - 3.2m
  const pendGroup = new THREE.Group();
  pendGroup.position.set(0, 16, 4);
  scene.add(pendGroup);

  const rodGeom = new THREE.CylinderGeometry(0.3, 0.3, 13.5, 8);
  rodGeom.translate(0, -6.75, 0);
  const rodMesh = new THREE.Mesh(rodGeom, makeInkMaterial({ ink: OR }));
  pendGroup.add(rodMesh);
  L.meshes.push(rodMesh);

  const largeBobGeom = new THREE.CylinderGeometry(2.4, 2.4, 1.6, 24);
  largeBobGeom.rotateX(Math.PI / 2);
  largeBobGeom.translate(0, -13.5, 0);
  const bobMesh = new THREE.Mesh(largeBobGeom, makeInkMaterial({ ink: OR }));
  pendGroup.add(bobMesh);
  L.meshes.push(bobMesh);

  // Dedicated world-space tracker for the swinging pendulum bob (for dynamic grappling)
  const pendulumTracker = new THREE.Object3D();
  pendulumTracker.position.set(0, 2.5, 4);
  scene.add(pendulumTracker);
  L.meshes.push(pendulumTracker);
  L.grappleMovers.push({ mesh: pendulumTracker, radius: 3.0 });

  L.animated.push({
    mesh: pendGroup,
    update: (t) => {
      const theta = 0.35 * Math.cos(0.9 * t);
      pendGroup.rotation.z = theta;
      const bobWorldX = Math.sin(theta) * 13.5;
      const bobWorldY = 16.0 - Math.cos(theta) * 13.5;
      pendulumTracker.position.set(bobWorldX, bobWorldY, 4.0);
    }
  });

  // 2. Overhead Monorail Crane - track at y = 8.5m, hook at y = 5.2m
  box(0, 8.5, -6, 1.2, 1.2, 60, { ink: BK }); // Track beam
  const trolleyGroup = new THREE.Group();
  scene.add(trolleyGroup);

  const trolleyMesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.9, 2.2), makeInkMaterial({ ink: BL }));
  trolleyMesh.position.set(0, 8.0, 0);
  trolleyGroup.add(trolleyMesh);
  L.meshes.push(trolleyMesh);

  const hookMesh = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.18, 8, 16), makeInkMaterial({ ink: OR }));
  hookMesh.position.set(0, 5.2, 0);
  trolleyGroup.add(hookMesh);
  L.meshes.push(hookMesh);

  const cableGeom = new THREE.CylinderGeometry(0.08, 0.08, 2.8, 4);
  cableGeom.translate(0, 6.6, 0);
  const cableMesh = new THREE.Mesh(cableGeom, makeInkMaterial({ ink: BK }));
  trolleyGroup.add(cableMesh);
  L.meshes.push(cableMesh);

  // Dedicated world-space tracker for the overhead crane hook (for dynamic grappling)
  const craneTracker = new THREE.Object3D();
  craneTracker.position.set(0, 5.2, -6);
  scene.add(craneTracker);
  L.meshes.push(craneTracker);
  L.grappleMovers.push({ mesh: craneTracker, radius: 2.2 });

  L.animated.push({
    mesh: trolleyGroup,
    update: (t) => {
      const trolleyZ = -6 + 22 * Math.sin(t * 0.35);
      trolleyGroup.position.z = trolleyZ;
      craneTracker.position.set(0, 5.2, trolleyZ);
    }
  });

  // ==================== 8. SPAWNS, PICKUPS & SNIPERS ====================
  if (arena) {
    // Arena Geodesic Dome rings & ribs
    const R = 120, C = -30;
    for (let k = 0; k < 8; k++) {
      const g = new THREE.TorusGeometry(R, 0.55, 5, 60, Math.PI);
      g.rotateY(k * Math.PI / 8); g.translate(0, C, 0); addGeo(g, BL);
    }
    for (const h of [38, 54, 68, 80, 88]) {
      const rad = Math.sqrt(Math.max(1, R * R - (h - C) * (h - C)));
      const g = new THREE.TorusGeometry(rad, 0.35, 6, 64);
      g.rotateX(Math.PI / 2); g.translate(0, h, 0); addGeo(g, BL);
    }
    sphere(0, 90, 0, 2.4, { ink: RD }); // Apex keystone

    // 5 Suspended Balance Wheel Platforms
    const sPlats = [
      [0, 24, 0, 8, 8], [-28, 20, -22, 6, 6], [28, 20, 22, 6, 6], [24, 22, -32, 5, 5], [-24, 22, 32, 5, 5]
    ];
    for (const [px, py, pz, pw, pd] of sPlats) {
      slab(px - pw/2, pz - pd/2, px + pw/2, pz + pd/2, py, 0.4, { ink: OR });
      ring(px, py - 1.3, pz, 'y');
      orientedCyl([px, py, pz], [px, 88, pz], 0.08, 4, BK); // Cable
    }

    const rs = [
      [0, 0.5, 36], [-18, 3.8, -20], [18, 3.8, -20], [0, 1.8, -6],
      [-36, 3.8, -12], [36, 3.8, -12], [0, 6.0, -38],
      [-36, 8, -50], [36, 8, -50], [-50, 12, -18], [50, 12, 18],
      [0, 24, 0], [-28, 20, -22], [28, 20, 22], [-24, 22, 32], [24, 22, -32]
    ];
    rs.forEach((pos) => spawn(...pos));
    L.arenaSpawns = [...L.spawns];
  } else {
    // Solo wave spawns
    spawn(0, 0.2, 22); spawn(-14, 0.2, 24); spawn(14, 0.2, 24); spawn(0, 1.8, -6);
    spawn(-18, 3.8, -20); spawn(18, 3.8, -20); spawn(-36, 3.8, -12); spawn(36, 3.8, -12); spawn(0, 6.0, -38);
  }

  L.teamSpawns = [
    [[-18, 3.8, -20], [-36, 3.8, -12], [0, 1.8, -6], [-28, 3.6, 0], [-10, 5.8, -32]].map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    [[36, 3.8, -12], [37, 10.0, -12], [0, 0.5, 28], [24, 0.5, 8], [18, 3.6, 18]].map(([x, y, z]) => new THREE.Vector3(x, y, z))
  ];

  // Sniper Perches (well elevated with pristine line of sight)
  sniper(0, 6.0, -38); sniper(-18, 3.8, -20); sniper(18, 3.8, -20);
  sniper(-36, 3.8, -12); sniper(36, 3.8, -12); sniper(0, 0.5, 36);
  sniper(37, 10.0, -12); sniper(-36, 8, -50);

  // Pickups distributed across all three tiers
  pickup(0, 1.8, -6); pickup(-18, 3.8, -20); pickup(18, 3.8, -20); pickup(0, 6.0, -38);
  pickup(-36, 3.8, -12); pickup(36, 3.8, -12); pickup(0, 0.5, 36); pickup(0, 0.2, 14);
  pickup(-20, 0.2, 0); pickup(20, 0.2, 0); pickup(37, 10.0, -12); pickup(4, 0.2, 6);
  pickup(-50, 12, -18); pickup(50, 12, 18);

  B.finish();
  return L;
}
