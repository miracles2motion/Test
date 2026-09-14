// Game bootstrap: solo waves, free-for-all lobbies, checkpoints, scoring, screens and the loop.
// Online play is peer-to-peer: one player's browser hosts the lobby and keeps score, every
// player runs their own body, and each one tells the others what it did.
import * as THREE from 'three';
import { InkRenderer, INK, makeInkMaterial } from './render.js';
import { World } from './physics.js';
import { Input } from './input.js';
import { MobileControls } from './mobile.js';
import { buildLevel, LEVELS } from './level.js';
import { NavGrid } from './nav.js';
import { Effects } from './effects.js';
import { EnemyManager, BOSSES, TYPES } from './enemies.js';
import { Player } from './player.js';
import { RemotePlayer, encodeLocal } from './players.js';
import { Net } from './net.js';
import { HUD, CONTROLS_HTML } from './hud.js';
import { audio } from './audio.js';
import { rand, choose, clamp } from './util.js';
import { Rifle, Shotgun, Sniper, Revolver, Katana } from './weapons.js';
import { perfMonitor } from './perf/perf-monitor.js';
import { lodManager } from './perf/lod-manager.js';
import { instanceManager } from './perf/instance-manager.js';
import { spawnManager } from './spawns.js';

// Attempt to lock screen orientation to landscape on mobile
try {
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(() => {});
  }
} catch(e) {
  // Ignored
}

const canvas = document.getElementById('c');
const R = new InkRenderer(canvas);
const world = new World();
export const isMapPlayable = (k) => LEVELS.some((m) => m.key === k && !m.comingSoon);
export const getPlayableMaps = () => LEVELS.filter((m) => !m.comingSoon);
const knownMap = (k) => {
  if (k === 'desk') return 'classroom';
  const found = LEVELS.find((m) => m.key === k);
  if (found && !found.comingSoon) return found.key;
  const firstPlayable = LEVELS.find((m) => !m.comingSoon);
  return firstPlayable ? firstPlayable.key : 'district';
};
let mapKey = knownMap(localStorage.getItem('doodle_map') || 'district');
window.currentDifficulty = parseInt(localStorage.getItem('doodle_difficulty') || '2', 10);
let level = buildLevel(R.scene, world, mapKey, { arena: false });
let nav = new NavGrid(world, level.bounds, 1).build();
let loadedKey = mapKey, arenaLoaded = false;
let previewWeaponType = 'rifle', previewWeaponInst = null, weaponsReturnTo = 'map_select';
const previewWeaponGroup = new THREE.Group();
previewWeaponGroup.position.set(-0.1, 0, -0.6);
let previewDragX = 0, previewDragging = false, previewAutoRot = 0, previewManualRot = 0, previewIdleT = 0;
window.addEventListener('pointerdown', (e) => { if (screen === 'weapons_preview' && !e.target.closest('.wep-view-menu') && !e.target.closest('button')) { previewDragging = true; previewDragX = e.clientX; } });
window.addEventListener('pointermove', (e) => { if (previewDragging && screen === 'weapons_preview') { previewManualRot += (e.clientX - previewDragX) * 0.025; previewDragX = e.clientX; previewIdleT = 0; } });
window.addEventListener('pointerup', () => previewDragging = false);
window.addEventListener('pointercancel', () => previewDragging = false);
R.camera.add(previewWeaponGroup);

audio.setTune(mapKey);
// the map in play: solo uses the picked map, a match uses the host's choice; a rebuild wipes broken props
function setLevel(key, on, force = false) {
  if (!force && key === loadedKey && on === arenaLoaded) return; loadedKey = key; arenaLoaded = on;
  for (const m of level.meshes) { R.scene.remove(m); if (m.geometry) m.geometry.dispose(); if (m.traverse) m.traverse((o) => { if (o !== m && o.geometry) o.geometry.dispose(); }); }
  level.animated.length = 0; world.clear();
  level = buildLevel(R.scene, world, key, { arena: on }); nav = new NavGrid(world, level.bounds, 1).build();
  ctx.level = level; ctx.nav = nav; if (window.__game) { window.__game.level = level; window.__game.nav = nav; }
  audio.setTune(key);
}
const setArena = (on) => setLevel(knownMap(net.active ? (lobby.map || mapKey) : mapKey), on);
const input = new Input(canvas);
const mobile = new MobileControls(canvas, input);
mobile.onPause = () => {
  if (game.state === 'play') pause();
  else if (game.menu) resume();
};
function triggerScreenshot() {
  R.takeScreenshot((err) => {
    if (!err) {
      hud.tip('📸 Screenshot saved to Downloads!', 2.5);
    }
  });
}
mobile.onScreenshot = () => triggerScreenshot();
window.addEventListener('keydown', (e) => {
  if (e.key === '0' || e.code === 'Digit0' || e.code === 'Numpad0') {
    triggerScreenshot();
  }
});
const hud = new HUD(document.getElementById('hud'));
hud.onScreenVisibility = (shown) => {
  if (typeof mobile !== 'undefined' && mobile.setGameplayActive) {
    mobile.setGameplayActive(!shown);
  }
};
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (audio.ctx && audio.ctx.state === 'running') audio.ctx.suspend();
  } else {
    if (audio.ctx && audio.ctx.state === 'suspended') audio.ctx.resume();
  }
});


function fastClick(el, handler) {
  if (!el) return;
  let lastTriggerTime = 0;
  const trigger = (e) => {
    const now = Date.now();
    if (now - lastTriggerTime < 320) return;
    lastTriggerTime = now;
    handler(e);
  };

  let startX = 0, startY = 0, tracking = false;
  el.addEventListener('touchstart', (e) => {
    tracking = true;
    if (e.touches && e.touches[0]) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
  }, { passive: true });

  el.addEventListener('touchcancel', () => {
    tracking = false;
  }, { passive: true });

  el.addEventListener('touchend', (e) => {
    if (tracking) {
      tracking = false;
      if (e.changedTouches && e.changedTouches[0]) {
        const dx = Math.abs(e.changedTouches[0].clientX - startX);
        const dy = Math.abs(e.changedTouches[0].clientY - startY);
        if (dx > 14 || dy > 14) return;
      }
      trigger(e);
    }
  }, { passive: true });

  el.addEventListener('click', (e) => {
    trigger(e);
  });
}
const effects = new Effects(R.scene, world);
const ctx = { scene: R.scene, camera: R.camera, world, level, nav, input, hud, effects, audio, renderer: R };

// ---------------- persistent bits ----------------
let best = Number(localStorage.getItem('doodle_best') || 0);
let musicWanted = localStorage.getItem('doodle_music') !== '0';
let checkpoint = Number(localStorage.getItem('doodle_checkpoint') || 0);
let myName = (localStorage.getItem('doodle_name') || '').slice(0, 14) || 'doodle' + Math.floor(Math.random() * 90 + 10);
const settings = {
  sens: Number(localStorage.getItem('doodle_sens') || 100),
  aimSens: Number(localStorage.getItem('doodle_aim_sens') || 85),
  mobileSens: Number(localStorage.getItem('doodle_mobile_sens') || 100),
  invert: localStorage.getItem('doodle_invert') === '1',
  mobile: localStorage.getItem('doodle_mobile') ? localStorage.getItem('doodle_mobile') === '1' : (typeof window !== 'undefined' && ('ontouchstart' in window || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches))),
  mobileScale: Number(localStorage.getItem('doodle_mobile_scale') || 100),
  graphicsQuality: localStorage.getItem('doodle_graphics_quality') || 'high',
  resScale: Number(localStorage.getItem('doodle_res_scale') || 100),
};
function applySettings() {
  input.mouseSens = 0.0022 * settings.sens / 100;
  input.padSensX = 3.4 * settings.sens / 100;
  input.padSensY = 2.6 * settings.sens / 100;
  input.invertY = settings.invert;
  input.aimSensMultiplier = settings.aimSens / 100;

  localStorage.setItem('doodle_sens', String(settings.sens));
  localStorage.setItem('doodle_aim_sens', String(settings.aimSens));
  localStorage.setItem('doodle_mobile_sens', String(settings.mobileSens));
  localStorage.setItem('doodle_invert', settings.invert ? '1' : '0');
  localStorage.setItem('doodle_mobile', settings.mobile ? '1' : '0');
  localStorage.setItem('doodle_mobile_scale', String(settings.mobileScale));
  localStorage.setItem('doodle_graphics_quality', settings.graphicsQuality);
  localStorage.setItem('doodle_res_scale', String(settings.resScale));

  if (typeof mobile !== 'undefined') {
    mobile.setEnabled(settings.mobile);
    if (mobile.setSens) mobile.setSens(settings.mobileSens);
  }
  if (typeof R !== 'undefined' && R.setGraphicsQuality) {
    R.setGraphicsQuality(settings.graphicsQuality, settings.resScale);
  }
}

function applyMobileScale() {
  const v = settings.mobileScale;
  localStorage.setItem('doodle_mobile_scale', String(v));
  if (typeof mobile !== 'undefined' && mobile.setGlobalScale) mobile.setGlobalScale(v);
}
function isAppInstalled() {
  if (typeof window === 'undefined') return false;
  const isStandalone = (window.matchMedia && (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches
  )) || (window.navigator && window.navigator.standalone === true) ||
  localStorage.getItem('doodle_pwa_installed') === '1';
  return Boolean(isStandalone);
}
let deferredPrompt = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    if (isAppInstalled()) return;
    deferredPrompt = e;
    const mainInstall = document.getElementById('mainInstallBtn');
    if (mainInstall && !isAppInstalled()) mainInstall.style.display = 'flex';
  });

  window.addEventListener('appinstalled', () => {
    localStorage.setItem('doodle_pwa_installed', '1');
    deferredPrompt = null;
    const mainInstall = document.getElementById('mainInstallBtn');
    if (mainInstall) mainInstall.style.display = 'none';
  });

  if (window.matchMedia) {
    try {
      window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
        if (e.matches) {
          localStorage.setItem('doodle_pwa_installed', '1');
          const mainInstall = document.getElementById('mainInstallBtn');
          if (mainInstall) mainInstall.style.display = 'none';
        }
      });
    } catch (_) {}
  }
}
function triggerInstallApp() {
  if (isAppInstalled()) {
    toggleFullscreen();
    return;
  }
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        localStorage.setItem('doodle_pwa_installed', '1');
        deferredPrompt = null;
        const mainInstall = document.getElementById('mainInstallBtn');
        if (mainInstall) mainInstall.style.display = 'none';
        showStart();
      }
    });
  } else {
    toggleFullscreen();
    alert('To install on your home screen:\n• iOS / Safari: Tap Share -> "Add to Home Screen".\n• Android / Chrome / Edge: Tap browser menu (⋮) -> "Install App" or "Add to Home screen".');
  }
}
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }
}
// ---------------- game state ----------------
const FFA_TARGET = 20, FFA_TIME = 600, RESPAWN = 2.5;
let matchLeft = FFA_TIME, clockT = 0, clockRunning = false;
const mmss = (t) => { t = Math.max(0, Math.ceil(t)); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };
const game = ctx.game = {
  state: 'start', mode: 'solo', menu: false, time: 0, hitstopT: 0, hitstopScale: 1, wave: 0, score: 0, combo: 0, comboT: 0, kills: 0, intermission: 0, queue: [], spawnT: 0, maxAlive: 6, deathT: 0,
  focus: { active: false, t: 0, chain: 0, target: null, dash: null, arm: 0, ready: false }, katanaStreak: 0, boss: null, respawnT: 0, matchT: 0, over: null, overT: 0,
  hitstop(d, s) { this.hitstopT = Math.max(this.hitstopT, d); this.hitstopScale = s; },
  addScore(pts, label) { const mult = 1 + Math.min(this.combo, 9) * 0.25; const p = Math.round(pts * mult); this.score += p; if (label) hud.kill(label, p); hud.setScore(this.score, this.combo); },
  onPlayerDeath() { endFocus(); onLocalDeath(); },
};
const online = () => game.mode === 'ffa';
const enemies = ctx.enemies = new EnemyManager(ctx);
const player = ctx.player = new Player(ctx);
player.name = myName;
const net = new Net();
const remote = new Map();      // peer id -> RemotePlayer
const lobby = { players: new Map(), hostId: null, isPublic: true, status: '', code: '', map: null };
const scores = new Map();      // peer id -> { name, kills, deaths }
let screen = 'main';           // which start-screen panel is showing: main | online | lobby
window.__game = { ctx, game, player, enemies, nav, world, level, hud, effects, input, mobile, net, remote, lobby, scores };

// anything a bullet or a blade can hit besides enemies
ctx.targets = () => [player, ...remote.values()];
ctx.canHurt = (t) => online() && t !== player;
ctx.raycastPlayers = (o, d, maxDist) => {
  let best = null;
  for (const t of remote.values()) {
    if (!t.alive || !ctx.canHurt(t)) continue;
    for (let i = 0; i < t.hit.length; i++) {
      const c = t.hitSpheres[i], r = t.hit[i][1];
      _v.subVectors(c, o); const tca = _v.dot(d); if (tca < 0 || tca > maxDist) continue;
      const d2 = _v.lengthSq() - tca * tca; if (d2 > r * r) continue;
      const tt = tca - Math.sqrt(r * r - d2); if (tt < 0) continue;
      if (!best || tt < best.dist) best = { player: t, part: t.hit[i][0], dist: tt, point: new THREE.Vector3(o.x + d.x * tt, o.y + d.y * tt, o.z + d.z * tt) };
    }
    // a raised katana sits in front of the chest: a ray that reaches it before the body is turned aside
    if (t.blocking) {
      _bc.set(t.center.x + t.forward.x * 0.5, t.center.y + 0.3, t.center.z + t.forward.z * 0.5); const r = 0.42;
      _v.subVectors(_bc, o); const tca = _v.dot(d);
      if (tca > 0 && tca <= maxDist) { const d2 = _v.lengthSq() - tca * tca; if (d2 <= r * r) { const tt = tca - Math.sqrt(r * r - d2); if (tt >= 0 && (!best || best.player !== t || tt < best.dist)) best = { player: t, part: 'blade', dist: tt, point: new THREE.Vector3(o.x + d.x * tt, o.y + d.y * tt, o.z + d.z * tt) }; } }
    }
  }
  return best;
};
const _bc = new THREE.Vector3();
ctx.playersInArc = (pos, dir, range, cosHalf) => { const out = []; for (const t of remote.values()) { if (!t.alive || !ctx.canHurt(t)) continue; _v.subVectors(t.center, pos); const d = _v.length(); if (d > range + 0.3) continue; if (d > 0.3 && _v.normalize().dot(dir) < cosHalf) continue; if (!world.hasLineOfSight(pos, t.center)) continue; out.push(t); } return out; };
ctx.hitPlayer = (t, dmg, info) => {
  if (!ctx.canHurt(t) || !t.alive) return;
  // a raised katana facing you parries a slash outright and turns some bullets aside
  // the bullet met the blade itself: it glances off, and now and then comes straight back at you
  if (info.part === 'blade') {
    effects.strokeBurst(info.point, INK.ORANGE, 8, 6, { life: 0.22, size: 0.035 }); audio.shieldHit(t.center);
    const ret = Math.random() < 0.4;
    if (ret) {
      effects.tracer(info.point, player.eye, INK.RED, 0.03, 0.08); hud.tip('RETURNED', 0.9); input.rumble(0.5, 0.4, 90);
      player.lastHitBy = t.id; player.lastHit = { from: t.center.toArray(), crit: false, amount: dmg * 0.6, src: 'deflect' }; player.takeDamage(dmg * 0.6, t.center);
    } else hud.tip('DEFLECTED', 0.7);
    net.sendTo(t.id, 'parry', { ret, by: net.id });
    return;
  }
  const facing = t.blocking ? _v.subVectors(player.center, t.center).normalize().dot(t.forward) : -1;
  const frontHit = /^(head|torso|arm|fore)/.test(info.part || '');
  // a slash is only parried by a guard that just came up and faces you
  if (facing > 0.6 && frontHit && info.source === 'katana' && t.parryWindow) { effects.strokeBurst(info.point, INK.ORANGE, 10, 6, { life: 0.25, size: 0.04 }); audio.shieldHit(t.center); game.hitstop(0.08, 0.15); player.weapons[player.katanaIndex].cooldown = Math.max(player.weapons[player.katanaIndex].cooldown, 0.6); input.rumble(0.6, 0.3, 90); hud.tip('PARRIED', 0.9); return; }
  effects.blood(info.point, info.dir, clamp(0.4 + dmg / 80, 0.4, 1.6), { ink: INK.RED }); hud.hitmarker(false, info.crit); audio.hitEnemy(t.center); t.flash();
  net.sendTo(t.id, 'pdmg', { amount: Math.round(dmg), from: player.center.toArray().map((v) => +v.toFixed(1)), by: net.id, crit: !!info.crit, src: info.source });
};
// a slash through another player's rope cuts it: their client drops the hook
const _rp = new THREE.Vector3(), _rq = new THREE.Vector3();
ctx.cutRopes = (eye, dir, range) => {
  let cut = false;
  for (const r of remote.values()) {
    if (!r.alive || !r.grappling) continue;
    _rp.set(r.body.pos.x + r.right.x * 0.35, r.body.pos.y + 1.25, r.body.pos.z + r.right.z * 0.35);
    for (let i = 0; i <= 14; i++) {
      _rq.lerpVectors(_rp, r.gPoint, i / 14).sub(eye); const t = _rq.dot(dir); if (t < 0.3 || t > range) continue;
      const lat = Math.sqrt(Math.max(0, _rq.lengthSq() - t * t)); if (lat > 0.9) continue;
      _rq.add(eye); effects.strokeBurst(_rq, INK.ORANGE, 10, 5, { life: 0.25, size: 0.035 }); net.sendTo(r.id, 'cut', {}); hud.tip('ROPE CUT', 0.9); cut = true; break;
    }
  }
  return cut;
};
const _v = new THREE.Vector3();
// breakable props: bullets, blades and blasts break them, and everyone in a match sees it go
ctx.breakHit = (br, dmg, point, dir) => {
  if (!br.alive) return; br.hp -= dmg;
  if (br.hp <= 0) breakProp(br, dir, true); else { effects.strokeBurst(point, br.ink, 5, 4, { life: 0.2, size: 0.03 }); audio.shieldHit(point); }
};
ctx.breakablesInArc = (pos, dir, range, cosHalf) => level.breakables.filter((br) => { if (!br.alive) return false; _v.subVectors(br.pos, pos); const d = _v.length(); return d < range + 0.5 && (d < 0.4 || _v.divideScalar(d).dot(dir) > cosHalf); });
ctx.blastBreakables = (c, R) => { for (const br of level.breakables) if (br.alive && br.pos.distanceTo(c) < R * 0.9) breakProp(br, br.pos.clone().sub(c).normalize(), true); };
function breakProp(br, dir, local, quiet = false) {
  if (!br.alive) return; br.alive = false; world.removeBox(br.box);
  const g = br.group, pos = br.pos; const d = dir && dir.lengthSq() > 0.01 ? dir.clone().normalize() : new THREE.Vector3(rand(-1, 1), 1, rand(-1, 1)).normalize();
  if (quiet) { R.scene.remove(g); return; }
  g.updateMatrixWorld(true);
  for (const child of [...g.children]) {
    child.updateWorldMatrix(true, false); R.scene.attach(child);
    const v = d.clone().multiplyScalar(rand(2, 6)); v.x += rand(-3, 3); v.z += rand(-3, 3); v.y += rand(2.5, 6.5);
    effects.debris(child, child.position, v, new THREE.Vector3(rand(-9, 9), rand(-9, 9), rand(-9, 9)), { radius: 0.14, blood: false, life: rand(6, 9) });
  }
  R.scene.remove(g);
  const up = new THREE.Vector3(0, 1, 0);
  if (br.kind === 'pinata') {
    for (const ink of [INK.PINK, INK.ORANGE, INK.GREEN]) effects.strokeBurst(pos, ink, 16, 7, { life: 0.7, size: 0.05 });
    effects.explosion(pos, 2.5, INK.PINK); if (!net.active || net.isHost) for (let i = 0; i < 2; i++) spawnPickup('health', pos.clone().add(new THREE.Vector3(rand(-1.2, 1.2), 0, rand(-1.2, 1.2))));
    if (game.mode === 'solo') game.addScore(25, 'PIÑATA');
  } else if (br.kind === 'cactus') { effects.blood(pos, d, 1.4, { ink: INK.GREEN }); effects.bloodPool(new THREE.Vector3(pos.x, 0, pos.z), 1.1, INK.GREEN); }
  else { effects.strokeBurst(pos, br.ink, 12, 5, { life: 0.35, size: 0.04 }); effects.smoke(pos, up, 3); }
  audio.smash(pos, br.kind === 'barrel' || br.kind === 'crate' || br.kind === 'cactus');
  if (local && net.active) net.broadcast('brk', { id: br.id });
}
// every ray a gun fires this tick is sent to the others, who draw it as a tracer from the shooter's gun
const shotQueue = [];
ctx.onShot = (end) => { if (net.active && inMatch()) shotQueue.push(+end.x.toFixed(1), +end.y.toFixed(1), +end.z.toFixed(1)); };
const TRACER_THICK = { rifle: 0.02, shotgun: 0.014, sniper: 0.03 };
const _sm = new THREE.Vector3(), _se = new THREE.Vector3();

// ---------------- pickups ----------------
const pickups = []; let pickupId = 1;
const pmat = { ammo: makeInkMaterial({ ink: INK.BLUE }), health: makeInkMaterial({ ink: INK.GREEN }), cap: makeInkMaterial({ ink: INK.BLACK }), shell: makeInkMaterial({ ink: INK.ORANGE }) };
function makePickup(kind) {
  const g = new THREE.Group();
  if (kind === 'ammo') { g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.5, 10), pmat.ammo)); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.16, 8), pmat.cap); c.position.y = 0.33; g.add(c); const l = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.02), pmat.cap); l.position.set(0, 0, 0.24); g.add(l); }
  else if (level.key === 'mexico') { const sh = new THREE.CylinderGeometry(0.42, 0.42, 0.22, 12, 1, false, 0, Math.PI); sh.rotateZ(Math.PI / 2); sh.rotateX(-Math.PI / 2); g.add(new THREE.Mesh(sh, pmat.shell)); const f = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.2), pmat.health); f.position.y = 0.02; g.add(f); const m = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.08, 0.14), pmat.cap); m.position.y = 0.1; g.add(m); }
  else { g.add(new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.2), pmat.health), new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.2), pmat.health)); }
  return g;
}
function spawnPickup(kind, pos, id = null) {
  if (!pos) pos = (level && level.playerStart) ? level.playerStart.clone() : new THREE.Vector3(0, 1, 0);
  const m = makePickup(kind); m.position.copy(pos); m.position.y += 0.6; R.scene.add(m);
  const p = { id: id ?? pickupId++, kind, mesh: m, base: m.position.y, t: rand(0, 6), life: 45 }; pickups.push(p);
  if (net.isHost) net.send('pickup', { id: p.id, kind, pos: pos.toArray() });
  return p;
}
function removePickup(p) { R.scene.remove(p.mesh); const i = pickups.indexOf(p); if (i >= 0) pickups.splice(i, 1); }
function collectPickup(p) {
  if (p.kind === 'ammo') { player.addAmmoAll(0.4); player.grenades = Math.min(player.maxGrenades, player.grenades + 1); hud.kill('+AMMO · +GRENADE', 0); } else { player.hp = Math.min(player.maxHp, player.hp + 35); hud.kill(level.key === 'mexico' ? 'TACO · +35 HP' : '+35 HP', 0); }
  audio.pickup(); effects.strokeBurst(p.mesh.position, p.kind === 'ammo' ? INK.BLUE : INK.GREEN, 12, 4, { life: 0.3 });
}
function updatePickups(dt) {
  for (let i = pickups.length - 1; i >= 0; i--) {
    const p = pickups[i]; p.t += dt; p.mesh.position.y = p.base + Math.sin(p.t * 2.5) * 0.12; p.mesh.rotation.y += dt * 1.8;
    if (player.alive && p.mesh.position.distanceTo(player.center) < 1.5) {
      collectPickup(p); removePickup(p);
      if (net.active) net.send(net.isHost ? 'taken' : 'take', { id: p.id });
      continue;
    }
    if (!net.active || net.isHost) { p.life -= dt; if (p.life <= 0) { removePickup(p); if (net.isHost) net.send('taken', { id: p.id }); } }
  }
}
let pickupClock = 0;
function updateArenaPickups(dt) {
  if (!net.isHost) return; pickupClock -= dt;
  if (pickupClock <= 0 && pickups.length < 10) { pickupClock = 7; spawnPickup('ammo', choose(level.pickups)); }
}

// ---------------- solo waves ----------------
const ROSTER = [
  { t: 'grunt', from: 1, w: 10 }, { t: 'rusher', from: 2, w: 6 }, { t: 'bomber', from: 3, w: 3 },
  { t: 'sniper', from: 3, w: 4 }, { t: 'flyer', from: 4, w: 4 }, { t: 'heavy', from: 5, w: 4 }, { t: 'shield', from: 6, w: 4 },
];
const MODIFIERS = [
  { name: '', apply: () => { enemies.mods.speed = 1; enemies.mods.damage = 1; } },
  { name: 'CAFFEINATED · they move fast', apply: () => { enemies.mods.speed = 1.35; enemies.mods.damage = 0.85; } },
  { name: 'HEAVY INK · they hit harder', apply: () => { enemies.mods.speed = 0.9; enemies.mods.damage = 1.4; } },
  { name: 'SWARM · more of them, thinner', apply: () => { enemies.mods.speed = 1.15; enemies.mods.damage = 0.9; } },
];
const tips = () => [
  `hold <b>${hud.key('grapple')}</b> to reel in · tap it again to let go mid-swing`,
  `block with <b>${hud.key('block')}</b> and some of their bullets go back at them`,
  'kills in the air are worth more · stay off the floor',
  `<b>${hud.key('grenade')}</b> lobs a grenade · pickups give you more`,
  `press <b>${hud.key('jump')}</b> again in the air for a double jump`,
];
const bossFor = (n) => BOSSES[(Math.floor(n / 5) - 1) % BOSSES.length];
const enemyName = (t) => ({ boss: 'THE DOODLER', eraser: 'THE ERASER', inkblot: 'THE INKBLOT' })[t] || t.toUpperCase();
function startWave(n) {
  game.wave = n; game.queue = []; game.spawnT = 2; game.intermission = 0; game.boss = null; hud.setBoss(null, null);
  const boss = n > 0 && n % 5 === 0;
  const allowed = boss || n < 4 ? 1 : n < 6 ? 3 : MODIFIERS.length; const mod = MODIFIERS[Math.floor(Math.random() * allowed)];
  mod.apply(); enemies.mods.damage *= 1.2; hud.setModifier(mod.name);
  const swarm = mod.name.startsWith('SWARM');
  // the crowd on screen and the wave size both keep growing with the wave number
  game.maxAlive = Math.min(4 + Math.floor(n * 0.9) + (swarm ? 3 : 0), (swarm ? 22 : 18) + Math.floor(n / 3));
  let count = Math.round(Math.min(5 + n * 2.0, 32 + n) * (swarm ? 1.35 : 1));
  if (boss) { count = 7 + n; game.maxAlive += 2 + Math.floor(n / 5); game.queue.push(bossFor(n)); }
  const pool = ROSTER.filter((r) => n >= r.from).map((r) => ({ t: r.t, w: r.w * Math.min(1, 0.3 + 0.25 * (n - r.from)) }));
  if (level && level.customEnemies) {
    for (const [k, def] of Object.entries(level.customEnemies)) {
      if (!TYPES[k]) TYPES[k] = def;
      pool.push({ t: k, w: 8 });
    }
  }
  const total = pool.reduce((a, r) => a + r.w, 0);
  for (let i = 0; i < count; i++) { let r = Math.random() * total, t = pool[0].t; for (const c of pool) { r -= c.w; if (r <= 0) { t = c.t; break; } } game.queue.push(t); }
  if (boss) { hud.message('WAVE ' + n, enemyName(bossFor(n)) + ' IS COMING', 3); audio.bossRoar(player.center); }
  else hud.message('WAVE ' + n, n === 1 ? 'they are crawling off the page' : mod.name || choose(['ink harder', 'keep scribbling', 'stay off the ground', 'swing for it', 'return their bullets']), 2.6);
  audio.wave();
  if (n <= tips().length) hud.tip(tips()[n - 1], 7);
  player.grenades = Math.min(player.maxGrenades, player.grenades + 1);
  for (let i = 0; i < 7; i++) spawnPickup(i < 5 ? 'ammo' : 'health', choose(level.pickups));
  if (n >= 5 && n % 5 === 0 && n > checkpoint) { checkpoint = n; localStorage.setItem('doodle_checkpoint', String(n)); hud.kill('CHECKPOINT · WAVE ' + n, 0); }
}
function pickSpawn(type) {
  const spots = type === 'sniper' ? level.snipers : level.spawns; const pp = player.body.pos;
  if (type === 'flyer') { const a = Math.random() * Math.PI * 2, r = 22 + Math.random() * 10; return new THREE.Vector3(clamp(pp.x + Math.cos(a) * r, level.bounds.minX + 4, level.bounds.maxX - 4), pp.y + 12 + Math.random() * 6, clamp(pp.z + Math.sin(a) * r, level.bounds.minZ + 4, level.bounds.maxZ - 4)); }
  if (BOSSES.includes(type)) {
    const nav = enemies.ctx.nav;
    if (nav && nav.nodes && nav.nodes.length) {
      const groundY = level.playerStart ? level.playerStart.y : 0;
      const arenaNodes = nav.nodes.filter(n => {
        if (Math.abs(n.y - groundY) > 2.5) return false;
        if (!n.links || n.links.length < 3) return false;
        return !world.overlapsAABB(
          { x: n.x - 1.4, y: n.y + 0.1, z: n.z - 1.4 },
          { x: n.x + 1.4, y: n.y + 4.2, z: n.z + 1.4 }
        );
      });
      const farNodes = arenaNodes.filter(n => Math.hypot(n.x - pp.x, n.z - pp.z) > 18);
      const pool = farNodes.length ? farNodes : arenaNodes;
      if (pool.length) {
        const chosen = choose(pool);
        return new THREE.Vector3(chosen.x, chosen.y + 0.1, chosen.z);
      }
    }
    const fits = (sp) => !world.overlapsAABB({ x: sp.x - 1.3, y: sp.y + 0.1, z: sp.z - 1.3 }, { x: sp.x + 1.3, y: sp.y + 4.2, z: sp.z + 1.3 });
    const open = spots.filter((sp) => fits(sp)); const far = open.filter((sp) => sp.distanceTo(pp) > 18);
    if (far.length) return choose(far).clone(); if (open.length) return choose(open).clone();
    return level.playerStart.clone();
  }
  let cands = spots.filter((s) => { const d = s.distanceTo(pp); return d > 14 && d < 48; });
  if (cands.length < 2) cands = spots.filter((s) => s.distanceTo(pp) > 14);
  const threats = [{ pos: player.body.pos, eye: player.eye }];
  return spawnManager.pickBestSpawn(cands.length ? cands : spots, threats, world);
}
function updateWaves(dt) {
  if (game.intermission > 0) {
    game.intermission -= dt; hud.setWave(game.wave, Math.ceil(game.intermission), 'intermission'); hud.setTimer('');
    if (game.intermission <= 0) { startWave(game.wave + 1); }
    return;
  }
  if (game.queue.length && enemies.alive < game.maxAlive) {
    game.spawnT -= dt;
    if (game.spawnT <= 0) {
      game.spawnT = Math.max(0.7, 2.9 - game.wave * 0.13); const t = game.queue.shift(); const e = enemies.spawn(t, pickSpawn(t));
      if (e.T.boss) { const mul = 1 + 0.35 * Math.floor((game.wave - 5) / 15); e.hp = e.maxHp = Math.round(e.T.hp * mul); }
    }
  }
  if (!game.queue.length && enemies.alive === 0) {
    game.intermission = 8; hud.message('WAVE ' + game.wave + ' CLEARED', 'catch your breath · +' + 200 * game.wave, 2.5);
    game.addScore(200 * game.wave, null); audio.waveClear(); player.hp = Math.min(player.maxHp, player.hp + 40);
  }
  hud.setWave(game.wave, enemies.alive + game.queue.length);
}
enemies.onKill = (e, info, over) => {
  if (enemies.brain) enemies.brain.recordKill(e, info);
  game.kills++; game.combo++; game.comboT = 3.5;
  let label = e.T.name, pts = e.T.score;
  if (info.crit) { label = 'HEADSHOT'; pts += 60; }
  if (info.source === 'katana') { label = over ? 'SLICED' : 'CUT DOWN'; pts += 50; }
  if (info.source === 'focus') { label = 'EXECUTED'; pts += 150; }
  if (info.source === 'katana' || info.source === 'focus') { game.katanaStreak++; player.weapons[player.katanaIndex].addBlood(0.42); if (game.katanaStreak >= KATANA_CHARGE_KILLS) enterFocus(); }
  else if (info.source !== 'blast') game.katanaStreak = 0;
  if (info.source === 'deflect') { label = 'RETURN TO SENDER'; pts += 120; }
  if (info.source === 'fall') label = 'FELL OFF THE PAGE';
  else if (!player.body.onGround && info.source !== 'deflect') { label += ' · AIRBORNE'; pts += 40; }
  game.addScore(pts, label); audio.kill(!!info.crit || e.T.boss);
  const r = Math.random(); if (r < 0.5) spawnPickup('ammo', e.body.pos); else if (r < 0.62) spawnPickup('health', e.body.pos);
};
enemies.onBoss = (e) => { if (!e.alive) { hud.setBoss(null, null); game.boss = null; } else { game.boss = e; hud.setBoss(e.T.name, e.hp / e.maxHp); } };
player.onThrow = (d) => { 
  if (enemies.brain) enemies.brain.recordNade();
  if (net.active) net.broadcast('nade', d); 
};

// ---------------- focus slash (solo only) ----------------
const FOCUS_TIME = 2.6, FOCUS_SCALE = 0.26, FOCUS_RANGE = 24, FOCUS_MAX_CHAIN = 2, FOCUS_ARM = 0.18, DASH_SPEED = 46, KATANA_CHARGE_KILLS = 3;
const _fv = new THREE.Vector3();
function focusCandidate() {
  let best = null, bestScore = -1;
  for (const e of enemies.enemies) {
    if (!e.alive || e.state === 'spawn') continue;
    _fv.subVectors(e.center, player.eye); const d = _fv.length(); if (d > FOCUS_RANGE || d < 0.5) continue;
    const aim = _fv.divideScalar(d).dot(player.forward); if (aim < 0.4) continue;
    if (!world.hasLineOfSight(player.eye, e.center)) continue;
    const score = aim * 3 - d / FOCUS_RANGE; if (score > bestScore) { bestScore = score; best = e; }
  }
  return best;
}
function enterFocus() {
  if (online() || game.focus.chain >= FOCUS_MAX_CHAIN || !focusCandidate()) return;
  const fresh = !game.focus.active;
  game.focus.active = true; game.focus.t = FOCUS_TIME; game.focus.chain++; game.focus.arm = FOCUS_ARM; game.focus.ready = false;
  if (fresh) { audio.focusIn(); hud.tip(`<b>SLASH READY</b> · hold ${hud.key('focus')} to dash`, 2.2); }
}
function endFocus() { if (!game.focus.active && !game.focus.dash) return; game.focus.active = false; game.focus.target = null; game.focus.chain = 0; game.focus.dash = null; game.katanaStreak = 0; player.dashLock = false; hud.setFocusMark(null); }
function startFocusDash(target) { game.focus.dash = { target, t: 0, trail: player.center.clone(), lastTrail: 0 }; player.dashLock = true; player.body.vel.set(0, 0, 0); audio.dash(); player.kickFov(5); input.rumble(0.5, 0.4, 120); hud.setFocusMark(null); }
function marchBody(b, nx, nz, dist) {
  let moved = 0;
  for (let step = Math.min(0.22, dist); moved + 1e-4 < dist;) { const s2 = Math.min(step, dist - moved); b.pos.x += nx * s2; b.pos.z += nz * s2; if (world.overlapsBody(b)) { b.pos.y += 0.65; if (world.overlapsBody(b)) { b.pos.y -= 0.65; b.pos.x -= nx * s2; b.pos.z -= nz * s2; return moved; } } moved += s2; }
  return moved;
}
function updateFocusDash(dt) {
  const d = game.focus.dash; if (!d) return true;
  const target = d.target; d.t += dt;
  if (!target.alive || d.t > 1.2) { endDash(false); return true; }
  const b = player.body; const dx = target.body.pos.x - b.pos.x, dz = target.body.pos.z - b.pos.z; const flat = Math.hypot(dx, dz); const nx = dx / (flat || 1), nz = dz / (flat || 1);
  player.yaw = Math.atan2(-dx, -dz); _fv.subVectors(target.center, player.eye); player.pitch = clamp(Math.atan2(_fv.y, Math.hypot(_fv.x, _fv.z)), -1.2, 1.2);
  const want = Math.max(0, flat - 1.1); const moved = marchBody(b, nx, nz, Math.min(DASH_SPEED * dt, want));
  const aimY = target.body.pos.y + (target.T.flying ? 0.2 : 0); const dy = aimY - b.pos.y;
  if (Math.abs(dy) > 0.05) { const y = b.pos.y; b.pos.y += clamp(dy, -DASH_SPEED * dt, DASH_SPEED * dt); if (world.overlapsBody(b)) { b.pos.y = y; d.stuckY = (d.stuckY || 0) + dt; } else d.stuckY = 0; }
  d.lastTrail += dt; if (d.lastTrail > 0.02) { d.lastTrail = 0; effects.tracer(d.trail, player.center, INK.BLUE, 0.045, 0.28); d.trail.copy(player.center); effects.strokeBurst(player.center, INK.BLUE, 2, 5, { life: 0.22, size: 0.03 }); }
  const reach = Math.hypot(flat, Math.max(0, Math.abs(dy) - 0.6));
  if (reach <= 1.5) { focusExecute(target); return true; }
  if (moved < 1e-4 && want > 0.05 && (d.stuckY || 0) > 0.08) { endDash(true); return true; }
  return false;
}
function endDash(blocked) { player.dashLock = false; game.focus.dash = null; player.body.vel.set(0, 0, 0); if (blocked) { player.weapons[player.katanaIndex].startSlash(player._weaponState(false, false, 0)); audio.katanaSwing(); hud.tip('blocked · the dash did not reach', 1.2); } }
function focusExecute(target) {
  player.dashLock = false; game.focus.dash = null; player.body.vel.set(0, 0, 0);
  player.weapons[player.katanaIndex].startSlash(player._weaponState(false, false, 0));
  _fv.subVectors(target.center, player.eye); const dir = _fv.clone().normalize(); const chainBefore = game.focus.chain;
  enemies.damage(target, 100000, { point: target.center.clone(), dir, part: 'head', source: 'focus', crit: true });
  audio.focusSlash(); game.hitstop(0.1, 0.08); effects.shakeAmt += 0.35; input.rumble(0.9, 0.7, 140); player.kickFov(6); player.hp = Math.min(player.maxHp, player.hp + 6);
  if (game.focus.chain === chainBefore) game.focus.t = Math.min(game.focus.t, 0.35);
  game.focus.target = null; hud.setFocusMark(null);
}
function updateFocus(dt) {
  const f = game.focus; if (!f.active) return;
  if (f.dash) { updateFocusDash(dt); return; }
  f.t -= dt; f.arm -= dt; if (f.t <= 0 || !player.alive) { endFocus(); return; }
  const combo = (input.down('aim') && input.down('fire')) || input.down('dash'); if (!combo) f.ready = true;
  const target = focusCandidate(); f.target = target;
  if (!target) { hud.setFocusMark(null); return; }
  _fv.copy(target.center).project(R.camera);
  if (_fv.z < 1) hud.setFocusMark((_fv.x * 0.5 + 0.5) * window.innerWidth, (-_fv.y * 0.5 + 0.5) * window.innerHeight); else hud.setFocusMark(null);
  if (combo && f.ready && f.arm <= 0) { input.consume('fire'); startFocusDash(target); }
}

// ---------------- free for all: spawning, death, scoring ----------------
const HOW = { rifle: 'rifle', shotgun: 'shotgun', sniper: 'sniper', katana: 'katana', grenade: 'grenade', deflect: 'their own bullet' };
const howWord = (src) => HOW[src] || null;
const spawnSpots = () => (level.arenaSpawns && level.arenaSpawns.length ? level.arenaSpawns : level.spawns);
function arenaSpawn() {
  const spots = spawnSpots();
  const others = [...remote.values()]
    .filter((r) => r.alive && r.root && r.root.visible)
    .map((r) => ({ pos: r.body.pos, eye: new THREE.Vector3(r.body.pos.x, r.body.pos.y + 1.6, r.body.pos.z), team: r.team }));
  return spawnManager.pickBestSpawn(spots, others, world, player.team);
}
// a spot for a late joiner: the one farthest from everybody already in the match
function farthestSpawnIndex() {
  const spots = spawnSpots(); const bodies = [player, ...remote.values()].filter((r) => r.alive); let best = 0, bd = -1;
  spots.forEach((s, i) => { const d = bodies.reduce((a, r) => Math.min(a, r.body.pos.distanceTo(s)), 999); if (d > bd) { bd = d; best = i; } });
  return best;
}
function onLocalDeath() {
  if (!online()) { 
    game.state = 'dying'; game.deathT = 0; 
    if (enemies.brain) enemies.brain.saveIfGodMode();
    return; 
  }
  const killer = player.lastHitBy || null; const h = player.lastHit || {};
  const dir = h.from ? player.center.clone().sub(new THREE.Vector3().fromArray(h.from)).normalize().toArray().map((v) => +v.toFixed(2)) : null;
  const how = killer ? howWord(h.src) : null;
  net.broadcast('pdead', { killer, dir, over: !!(h.crit || h.amount >= 90 || h.src === 'katana'), how, crit: !!h.crit });
  if (net.isHost) tallyDeath(net.id, killer);
  game.respawnT = RESPAWN; game.state = 'dying'; game.deathT = 0;
  const kn = killer && scores.get(killer) ? scores.get(killer).name : null;
  hud.kill(kn ? 'erased by ' + kn + (how ? ' · ' + how + (h.crit ? ' headshot' : '') : '') : 'erased', 0);
}
function respawnLocal() {
  player.reset(arenaSpawn()); player.name = myName; player.lastHitBy = null; player.lastHit = null; game.state = 'play'; player.shieldT = 2; hud.tip('spawn protection · 2s', 1.6);
  effects.strokeBurst(player.center, INK.BLUE, 24, 6, { life: 0.5, size: 0.03 }); audio.spawn(player.center);
}
function tallyDeath(victim, killer) {
  const v = scores.get(victim); if (v) v.deaths++;
  if (killer && killer !== victim) { const k = scores.get(killer); if (k) k.kills++; }
  sendScores(); checkWin();
}
function sendScores() { const rows = [...scores.entries()].map(([id, s]) => ({ id, ...s })); net.send('score', rows); applyScores(rows); }
function applyScores(rows) { scores.clear(); for (const r of rows) scores.set(r.id, { name: r.name, kills: r.kills, deaths: r.deaths }); refreshScoreHud(); }
function sortedScores() { return [...scores.entries()].sort((a, b) => b[1].kills - a[1].kills || a[1].deaths - b[1].deaths); }
function refreshScoreHud() {
  if (!online()) return;
  const rows = sortedScores(); const top = rows.slice(0, 3); const myIdx = rows.findIndex(([id]) => id === net.id);
  if (myIdx >= 3) top.push(rows[myIdx]);
  hud.setPvpScore(top.map(([id, sc]) => `<div class="row${id === net.id ? ' me' : ''}"><span class="rank">${rows.findIndex(([x]) => x === id) + 1}.</span><span>${esc(sc.name)}${id === net.id ? ' (you)' : ''}</span><b>${sc.kills}</b></div>`).join('') + `<div class="target">first to ${FFA_TARGET}</div>`);
  hud.setModifier('');
  if (!hud.el.board.hidden) hud.setBoard(boardHTML());
}
function boardHTML(title = 'FREE FOR ALL') {
  const rows = sortedScores();
  return `<h3>${title}</h3>${rows.map(([id, s]) => `<div class="${id === net.id ? 'me' : ''}"><span>${s.name}${id === net.id ? ' (you)' : ''}</span><span>${s.kills} kills · ${s.deaths} deaths</span></div>`).join('')}<div class="foot">first to ${FFA_TARGET} · ${mmss(matchLeft)} left · lobby ${String(net.aliasCode || net.code || '').replace(/-\d+$/, '')}</div>`;
}
function checkWin() {
  if (!net.isHost || !online() || game.over) return;
  let winner = null;
  for (const [id, s] of scores) if (s.kills >= FFA_TARGET) winner = { id, name: s.name };
  if (winner) { net.send('end', winner); endMatch(winner); }
}
function endMatch(winner) {
  game.over = winner; game.overT = 0; game.state = 'over'; endFocus(); input.exitLock(); hud.setBoard(null);
  const title = winner.id === net.id ? 'YOU WIN' : (winner.name || 'someone') + ' WINS';
  hud.setGameplayVisible(false); hud.showScreen(`<h1>${title}</h1><div class="scoreboard">${sortedScores().map(([id, s]) => `<div class="${id === net.id ? 'me' : ''}"><span>${s.name}</span><span>${s.kills} K · ${s.deaths} D</span></div>`).join('')}</div><div class="go" id="overGo">back to the lobby in a moment…</div>`);
}

// ---------------- networking ----------------
function addRemote(id, name) {
  if (remote.has(id)) { const r = remote.get(id); r.name = name; return r; }
  const rp = new RemotePlayer(ctx, id, name, 0, INK.RED);
  rp.onDamage = (t, amount, fromPos) => { if (!ctx.canHurt(t) || !t.alive) return; hud.hitmarker(false, false); net.sendTo(t.id, 'pdmg', { amount: Math.round(amount), from: fromPos ? fromPos.toArray().map((v) => +v.toFixed(1)) : null, by: net.id, src: 'grenade' }); };
  remote.set(id, rp); return rp;
}
function removeRemote(id) { const r = remote.get(id); if (r) { r.dispose(); remote.delete(id); } lobby.players.delete(id); scores.delete(id); }
function lobbyRows() { return [...lobby.players.entries()].map(([id, p]) => ({ id, name: p.name })); }
function broadcastLobby() { net.send('lobby', { players: lobbyRows(), hostId: net.id, isPublic: lobby.isPublic, map: lobby.map || mapKey, shown: net.aliasCode || net.code }); renderLobby(); }
const inMatch = () => ['play', 'dying', 'over'].includes(game.state);
net.onPeerLeave = (id) => { const nm = (lobby.players.get(id) || {}).name; removeRemote(id); broadcastLobby(); if (inMatch()) { hud.kill((nm || 'someone') + ' left', 0); sendScores(); } };
net.onDisconnect = () => { if (lobby.order && lobby.order.some((id) => id !== lobby.hostId)) migrateHost(); else leaveOnline('the host left the lobby'); };
// ---- host transfer: when the host goes, the earliest-joined player left takes over on a generation
// code (the old code is slow to free up on the signalling server); everyone else rejoins there
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let migrating = false;
async function migrateHost() { if (migrating) return; migrating = true; try { await _migrateHost(); } finally { migrating = false; } }
async function _migrateHost() {
  const oldHost = lobby.hostId, myId = net.id; const gen = (lobby.gen || 0) + 1; lobby.gen = gen;
  const base = (lobby.code || net.code || '').replace(/-\d+$/, ''); const code = base + '-' + gen;
  const roster = (lobby.order || []).filter((id) => id !== oldHost && lobby.players.has(id)); if (!roster.length || !base) { leaveOnline('the host left the lobby'); return; }
  const successor = roster[0]; const wasInMatch = inMatch();
  if (oldHost) { const r = remote.get(oldHost); if (r) r.dispose(); remote.delete(oldHost); lobby.players.delete(oldHost); scores.delete(oldHost); }
  hud.message('HOST LEFT', successor === myId ? 'you are hosting now' : 'moving to the new host…', 2.6);
  if (successor === myId) {
    let ok = false;
    for (let tries = 0; tries < 2 && !ok; tries++) { try { await net.host({ isPublic: lobby.isPublic, code }); ok = true; } catch (e) { await sleep(800); } }
    if (!ok) { leaveOnline('could not take over the lobby'); return; }
    const mine = lobby.players.get(myId) || { name: myName }; lobby.players.delete(myId); lobby.players.set(net.id, mine);
    const ms = scores.get(myId); scores.delete(myId); if (ms) scores.set(net.id, ms);
    lobby.hostId = net.id; lobby.code = code; lobby.order = [net.id, ...roster.filter((id) => id !== myId)]; net.accepting = true; game.clockStarted = clockRunning || matchLeft < FFA_TIME;
    net.onAlias = () => { broadcastLobby(); hud.kill('lobby code ' + base + ' is back', 0); }; net.claimAlias(base);
    if (game.state === 'over') { /* the results stay up; the host timer now runs here */ } else if (wasInMatch) { if (game.state !== 'play' && game.state !== 'dying') game.state = 'play'; refreshScoreHud(); } else { game.state = 'lobby'; screen = 'lobby'; showStart(); }
    broadcastLobby();
  } else {
    await sleep(1200);
    const deadline = performance.now() + 20000; let joined = false;
    while (!joined && performance.now() < deadline) { try { await net.join(code, { name: myName, prev: myId }); joined = true; } catch (e) { await sleep(1200); } }
    if (!joined) { leaveOnline('lost the match when the host left'); return; }
    lobby.code = code; if (!wasInMatch) { game.state = 'lobby'; screen = 'lobby'; showStart(); }
  }
}
net.on('refused', (d) => leaveOnline(d.reason));
net.hostName = myName;
net.onPeerJoin = (from, meta) => {
  const name = String(meta && meta.name || 'doodle').slice(0, 14);
  if (meta && meta.prev && meta.prev !== from) { const sc = scores.get(meta.prev); if (sc) { scores.delete(meta.prev); scores.set(from, sc); } const r = remote.get(meta.prev); if (r) r.dispose(); remote.delete(meta.prev); lobby.players.delete(meta.prev); if (lobby.order) lobby.order = lobby.order.filter((id) => id !== meta.prev); }
  lobby.players.set(from, { name }); addRemote(from, name); broadcastLobby();
  if (game.state === 'play' || game.state === 'dying') { if (!scores.has(from)) scores.set(from, { name, kills: 0, deaths: 0 }); net.sendTo(from, 'start', { late: true, spawn: farthestSpawnIndex(), map: lobby.map || mapKey, broken: level.breakables.filter((b) => !b.alive).map((b) => b.id) }); sendScores(); hud.kill(name + ' joined', 0); }
};
net.on('lobby', (d) => {
  lobby.hostId = d.hostId; lobby.isPublic = !!d.isPublic; lobby.code = net.code; lobby.shown = d.shown || net.code; if (d.map) lobby.map = knownMap(d.map); lobby.order = d.players.map((p) => p.id); lobby.players.clear();
  for (const p of d.players) lobby.players.set(p.id, { name: p.name });
  for (const p of d.players) if (p.id !== net.id) addRemote(p.id, p.name);
  for (const id of [...remote.keys()]) if (!lobby.players.has(id)) removeRemote(id);
  if (inMatch()) { for (const p of d.players) if (!scores.has(p.id)) scores.set(p.id, { name: p.name, kills: 0, deaths: 0 }); refreshScoreHud(); }
  renderLobby();
});
net.on('leave', (d) => { const nm = (lobby.players.get(d.id) || {}).name; removeRemote(d.id); if (inMatch()) hud.kill((nm || 'someone') + ' left', 0); renderLobby(); });
net.on('start', (d) => { if (net.isHost) return; if (d.map) lobby.map = knownMap(d.map); startMatch(!!d.late, d.spawns ? d.spawns[net.id] : d.spawn); if (d.broken) for (const id of d.broken) { const br = level.breakables[id]; if (br) breakProp(br, null, false, true); } });
net.on('startreq', () => { if (net.isHost && game.state === 'lobby') hostStart(); });
net.on('end', (d) => endMatch(d));
net.on('backtolobby', () => { if (!net.isHost) toLobbyScreen(); });
net.on('pickup', (d) => { if (!net.isHost) spawnPickup(d.kind, new THREE.Vector3().fromArray(d.pos), d.id); });
net.on('taken', (d) => { const p = pickups.find((x) => x.id === d.id); if (p) removePickup(p); });
net.on('take', (d) => { if (!net.isHost) return; const p = pickups.find((x) => x.id === d.id); if (p) { removePickup(p); net.send('taken', { id: d.id }); } });
net.on('ps', (d, from) => { const r = remote.get(from); if (r) { r.push(d, performance.now() / 1000); r.lastSeen = performance.now(); } });
net.on('pdmg', (d) => {
  if (!player.alive || game.state !== 'play' || player.shieldT > 0) return; player.lastHitBy = d.by || null; player.lastHit = { from: d.from || null, crit: !!d.crit, amount: d.amount, src: d.src };
  player.takeDamage(d.amount, d.from ? new THREE.Vector3().fromArray(d.from) : null);
});
net.on('pdead', (d, from) => {
  const r = remote.get(from); const vn = r ? r.name : 'someone'; const kn = d.killer && scores.get(d.killer) ? scores.get(d.killer).name : null;
  if (r) { r.ragdoll(d.dir ? new THREE.Vector3().fromArray(d.dir) : null, !!d.over); audio.enemyDie(r.center); }
  const how = d.how ? ' · ' + d.how + (d.crit ? ' headshot' : '') : '';
  if (d.killer === net.id) { game.kills++; game.addScore(100, 'ERASED ' + vn + how); audio.kill(true); }
  else hud.kill(kn ? kn + ' erased ' + vn + how : vn + ' fell off the page', 0);
  if (net.isHost) tallyDeath(from, d.killer);
});
net.on('nade', (d) => player.throwGrenade(d));
net.on('brk', (d) => { const br = level.breakables[d.id]; if (br) breakProp(br, null, false); });
net.on('parry', (d) => { audio.shieldHit(player.center); input.rumble(0.35, 0.3, 60); effects.strokeBurst(player.eye.clone().addScaledVector(player.forward, 0.5), INK.ORANGE, 8, 5, { life: 0.2, size: 0.03 }); hud.kill(d.ret ? 'RETURN TO SENDER' : 'DEFLECTED', d.ret ? 25 : 0); });
net.on('shots', (d, from) => {
  const r = remote.get(from); if (!r || !r.root || !r.alive) return;
  _sm.set(r.body.pos.x + r.right.x * 0.3 + r.forward.x * 0.8, r.body.pos.y + 1.35 + r.forward.y * 0.8, r.body.pos.z + r.right.z * 0.3 + r.forward.z * 0.8);
  const th = TRACER_THICK[d.k] || 0.02; const e = d.e || [];
  for (let i = 0; i + 2 < e.length; i += 3) { _se.set(e[i], e[i + 1], e[i + 2]); effects.tracer(_sm, _se, INK.BLUE, th, 0.06); }
  r.flash(); audio.remoteShot(d.k, _sm);
});
net.on('cut', () => { if (player.grapple.state !== 'idle') { player.detachGrapple(false); effects.strokeBurst(player.center, INK.ORANGE, 8, 4, { life: 0.25, size: 0.03 }); hud.tip('your rope got cut', 1.3); input.rumble(0.5, 0.3, 80); } });
net.on('score', (rows) => { if (!net.isHost) applyScores(rows); });
net.on('fell', (d, from) => { if (!net.isHost) return; const sc = scores.get(from); if (sc) { sc.kills = Math.max(0, sc.kills - 1); sendScores(); net.send('feed', { text: sc.name + ' fell off the page · -1' }); hud.kill(sc.name + ' fell off the page · -1', 0); } });
net.on('feed', (d) => hud.kill(String(d.text || ''), 0));
player.onFall = () => {
  if (!online() || !inMatch()) return;
  hud.kill('fell off the page · -1 kill', 0);
  if (net.isHost) { const sc = scores.get(net.id); if (sc) { sc.kills = Math.max(0, sc.kills - 1); sendScores(); net.send('feed', { text: sc.name + ' fell off the page · -1' }); } }
  else net.send('fell', {});
};
net.on('clock', (d) => { if (!net.isHost) { matchLeft = d.left; clockRunning = !!d.on; } });

// ---- idle players: a warning, then out; a lobby with nobody active in it shuts down ----
const IDLE_FLAG = 30, IDLE_MATCH = 150, IDLE_LOBBY = 300, IDLE_WARN = 20;
let idleWarned = false, idleCheckT = 0;
function idleUpdate(dt) {
  if (!net.active) { idleWarned = false; return; }
  idleCheckT -= dt; if (idleCheckT > 0) return; idleCheckT = 1;
  const limit = inMatch() ? IDLE_MATCH : IDLE_LOBBY; const idle = input.idleSeconds;
  const othersActive = [...remote.values()].some((r) => !r.idle);
  // a host that still has active players stays; kicking it would end their match
  const canDrop = !net.isHost || !othersActive;
  if (idle > limit - IDLE_WARN && !idleWarned && canDrop) { idleWarned = true; hud.message('STILL THERE?', 'move or you get kicked for inactivity', 3); audio.empty(); }
  if (idle <= limit - IDLE_WARN) idleWarned = false;
  if (idle > limit && canDrop) { const back = net.isHost ? null : String(net.aliasCode || net.code || '').replace(/-\d+$/, ''); leaveOnline(net.isHost ? 'lobby closed: everyone was idle' : 'kicked for inactivity'); lobby.rejoinCode = back; if (back) showStart(); return; }
  // the host also clears out a client that has sat idle past the limit, in case its tab cannot do it itself
  if (net.isHost) for (const [id, r] of remote) if (r.idle && r.idleSince && performance.now() / 1000 - r.idleSince > limit - IDLE_FLAG + 15) { net.sendTo(id, 'kick', { reason: 'kicked for inactivity' }); const c = net.conns.get(id); setTimeout(() => { try { c && c.close(); } catch (e) { /* ignore */ } }, 500); }
}
net.on('kick', (d) => { const back = String(net.aliasCode || net.code || '').replace(/-\d+$/, ''); leaveOnline(d && d.reason || 'kicked'); lobby.rejoinCode = back; if (back) showStart(); });
let syncTick = 0;
function netUpdate(dt) {
  idleUpdate(dt);
  if (!net.active) return; const now = performance.now() / 1000; syncTick++;
  for (const r of remote.values()) r.update(dt, now);
  // a connection that died without saying so leaves a figure standing around: drop anyone silent too long
  if (inMatch() && !migrating) for (const [id, r] of remote) { if (r.lastSeen && performance.now() - r.lastSeen > 9000) { if (!net.isHost && id === net.hostId) { net.leave(); migrateHost(); break; } const nm = r.name; removeRemote(id); hud.kill(nm + ' lost connection', 0); if (net.isHost) { const c = net.conns.get(id); if (c) { try { c.close(); } catch (e) { /* ignore */ } net.conns.delete(id); } net.send('leave', { id }); broadcastLobby(); sendScores(); } } }
  if (syncTick % 3 === 0 && inMatch()) net.send('ps', encodeLocal(player, player.weaponIndex, { firing: player.firing, idle: input.idleSeconds > IDLE_FLAG }), true);
  if (shotQueue.length) net.broadcast('shots', { k: player.weapon.kind, e: shotQueue.splice(0) });
  if (net.isHost && inMatch() && remote.size > 0) game.clockStarted = true;
  const clockOn = inMatch() && !game.over && (net.isHost ? !!game.clockStarted : clockRunning);
  if (inMatch() && !game.over) { if (clockOn) matchLeft = Math.max(0, matchLeft - dt); if (net.isHost) { clockT -= dt; if (clockT <= 0) { clockT = 2; net.send('clock', { left: Math.round(matchLeft), on: clockOn }); } } hud.setTimer(clockOn ? mmss(matchLeft) : 'clock starts when someone joins'); }
  if (net.isHost && clockOn) { game.matchT += dt; if (matchLeft <= 0) { const rows = sortedScores(); const w = rows.length ? { id: rows[0][0], name: rows[0][1].name } : { id: net.id, name: myName }; net.send('end', w); endMatch(w); } }
}
function leaveOnline(reason) {
  net.leave(); for (const id of [...remote.keys()]) removeRemote(id); lobby.players.clear(); scores.clear(); hud.setBoard(null);
  if (game.state !== 'start') { game.state = 'start'; game.mode = 'solo'; setArena(false); resetGame(); hud.setGameplayVisible(false); }
  game.menu = false; lobby.status = reason || ''; screen = 'online'; showStart();
}
async function createLobby(isPublic) {
  setStatus('opening a lobby…');
  try { await net.host({ isPublic }); }
  catch (err) { setStatus(friendlyError(err)); unlockButtons(); return; }
  lobby.isPublic = isPublic; lobby.map = mapKey; lobby.players.clear(); lobby.players.set(net.id, { name: myName }); lobby.hostId = net.id; lobby.status = '';
  game.state = 'lobby'; screen = 'lobby'; showStart();
}
async function joinLobby(code) {
  setStatus('connecting…');
  try { await net.join(code, { name: myName }); } catch (err) { setStatus(friendlyError(err)); unlockButtons(); return; }
  lobby.isPublic = net.isPublic; lobby.status = ''; game.state = 'lobby'; screen = 'lobby'; showStart();
}
async function quickPlay() {
  try { await net.quickJoin({ name: myName }, setStatus); lobby.isPublic = true; lobby.status = ''; game.state = 'lobby'; screen = 'lobby'; showStart(); return; }
  catch (err) { if (!/no open public/.test(String(err.message))) { setStatus(friendlyError(err)); unlockButtons(); return; } }
  setStatus('no open lobbies · opening a public one for you…');
  await createLobby(true);
}
function friendlyError(err) {
  const m = String(err && err.message || err || ''); if (!m) return 'something went wrong';
  if (/networking library/.test(m)) return 'could not load the networking library · check your connection and reload';
  if (/timed out|signalling/.test(m)) return 'could not reach the matchmaking server · check your connection';
  if (/no lobby with that code/.test(m)) return 'no lobby with that code · check it with your friend';
  if (/no answer/.test(m)) return 'found the lobby but could not connect · one of you may be on a network that blocks it';
  if (/full/.test(m)) return 'that lobby is full · try another code';
  if (/leave the lobby/.test(m)) return 'leave your lobby first';
  return m;
}
function setStatus(t) { lobby.status = t; const el = hud.el.panel.querySelector('#status'); if (el) el.textContent = t; }

// ---------------- screens ----------------
let settingsTab = 'camera'; // 'camera' | 'graphics' | 'touch' | 'audio'
let settingsReturnTo = 'main'; // 'main' | 'pause'

function settingsScreenHTML() {
  const isGameActive = settingsReturnTo === 'pause' || (typeof game !== 'undefined' && game.state === 'play' && !game.over);
  const currentDpi = (typeof R !== 'undefined' && R.pixelRatio) ? R.pixelRatio.toFixed(2) : '1.50';
  const currentWidth = (typeof R !== 'undefined' && R.rt) ? R.rt.width : Math.round(window.innerWidth * ((typeof window !== 'undefined' && window.devicePixelRatio) || 1));
  const currentHeight = (typeof R !== 'undefined' && R.rt) ? R.rt.height : Math.round(window.innerHeight * ((typeof window !== 'undefined' && window.devicePixelRatio) || 1));

  return `<div class="ds-panel modal" id="settingsScreen" style="width: 800px; max-width: 95vw; margin: auto; max-height: 90vh; overflow-y: auto;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h1 style="margin: 0; font-family: var(--font-display); font-size: 32px;">SETTINGS</h1>
      <button type="button" class="ds-btn icon ghost" id="closeSettingsX" style="font-size:24px;">✕</button>
    </div>

    <!-- TABS -->
    <div style="display: flex; gap: 16px; border-bottom: 2px solid var(--ink); margin-bottom: 24px;">
      <div class="ds-tabs" style="display:flex; gap:16px;">
        <button type="button" class="tab-btn ds-btn ghost ${settingsTab === 'camera' ? 'active' : ''}" data-tab="camera">CONTROLS</button>
        <button type="button" class="tab-btn ds-btn ghost ${settingsTab === 'graphics' ? 'active' : ''}" data-tab="graphics">GRAPHICS${isGameActive ? ' 🔒' : ''}</button>
        <button type="button" class="tab-btn ds-btn ghost ${settingsTab === 'touch' ? 'active' : ''}" data-tab="touch">LAYOUT</button>
        <button type="button" class="tab-btn ds-btn ghost ${settingsTab === 'audio' ? 'active' : ''}" data-tab="audio">AUDIO</button>
      </div>
    </div>

    <div class="settings-body">
      <!-- 1. GRAPHICS -->
      <div class="tab-pane ${settingsTab === 'graphics' ? 'active' : ''}" id="pane-graphics" style="${settingsTab === 'graphics' ? 'display:block' : 'display:none'}">
        ${isGameActive ? `
        <div class="ds-panel" style="display:flex; align-items:flex-start; gap:12px; background:var(--paper-dim, #efe9d8); border:2px dashed var(--pencil, #55524a); border-radius:var(--r-sketch-md, 8px); padding:12px 16px; margin-bottom:20px;">
          <span style="font-size:24px; line-height:1; user-select:none;">🔒</span>
          <div style="font-family:var(--font-display, cursive); font-size:16px; line-height:1.3; color:var(--pencil, #55524a);">
            <b style="color:var(--ink, #1a30c0); font-size:18px; letter-spacing:0.04em;">GRAPHICS LOCKED DURING ACTIVE GAMEPLAY</b><br>
            To maintain a steady framerate and prevent WebGL shader recompiles during combat, graphics quality and resolution scale can only be adjusted from the Main Menu.
          </div>
        </div>
        ` : ''}
        <div style="margin-bottom: 24px;">
          <h3 style="margin: 0 0 8px 0; font-family: var(--font-display);">Quality Preset</h3>
          <div class="ds-seg" id="setPreset">
            <button class="${settings.graphicsQuality === 'auto' ? 'active' : ''}" data-val="auto" ${isGameActive ? 'disabled' : ''}>AUTO</button>
            <button class="${settings.graphicsQuality === 'low' ? 'active' : ''}" data-val="low" ${isGameActive ? 'disabled' : ''}>PERFORMANCE</button>
            <button class="${settings.graphicsQuality === 'medium' ? 'active' : ''}" data-val="medium" ${isGameActive ? 'disabled' : ''}>BALANCED</button>
            <button class="${settings.graphicsQuality === 'high' ? 'active' : ''}" data-val="high" ${isGameActive ? 'disabled' : ''}>QUALITY</button>
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <h3 style="margin: 0 0 8px 0; font-family: var(--font-display);">Resolution Scale</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <input type="range" class="ds-slider" id="setResScale" min="50" max="150" step="5" value="${settings.resScale}" ${isGameActive ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
            <b style="font-family: var(--font-display); font-size: 20px;" id="setResScaleV">${settings.resScale}%</b>
          </div>
          <div style="font-size: 14px; opacity: 0.8; margin-top: 4px;">Render Target: ${currentWidth} × ${currentHeight}</div>
        </div>

        <button class="ds-btn danger" id="resetSettingsBtn" ${isGameActive ? 'disabled' : ''}>RESET TO RECOMMENDED</button>
      </div>

      <!-- 2. CAMERA -->
      <div class="tab-pane ${settingsTab === 'camera' ? 'active' : ''}" id="pane-camera" style="${settingsTab === 'camera' ? 'display:block' : 'display:none'}">
        <div style="margin-bottom: 24px;">
          <h3 style="margin: 0 0 8px 0; font-family: var(--font-display);">Look Sensitivity</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <input type="range" class="ds-slider" id="setSens" min="20" max="300" step="5" value="${settings.sens}">
            <b style="font-family: var(--font-display); font-size: 20px;" id="setSensV">${settings.sens}%</b>
          </div>
        </div>
        <div style="margin-bottom: 24px;">
          <h3 style="margin: 0 0 8px 0; font-family: var(--font-display);">Aim Sensitivity</h3>
          <div style="display: flex; align-items: center; gap: 16px;">
            <input type="range" class="ds-slider" id="setAimSens" min="20" max="200" step="5" value="${settings.aimSens}">
            <b style="font-family: var(--font-display); font-size: 20px;" id="setAimSensV">${settings.aimSens}%</b>
          </div>
        </div>
        <div style="margin-bottom: 24px;">
          <div style="display:flex; align-items: center; gap: 12px;">
            <input type="checkbox" class="ds-toggle" id="setInv" ${settings.invert ? 'checked' : ''}>
            <span>Invert Y-Axis</span>
          </div>
        </div>
      </div>

      <!-- 3. LAYOUT / TOUCH -->
      <div class="tab-pane ${settingsTab === 'touch' ? 'active' : ''}" id="pane-touch" style="${settingsTab === 'touch' ? 'display:block' : 'display:none'}">
        <div style="margin-bottom: 24px;">
          <div style="display:flex; align-items: center; gap: 12px;">
            <input type="checkbox" class="ds-toggle" id="setMobile" ${settings.mobile ? 'checked' : ''}>
            <span>Enable Mobile Touch Controls</span>
          </div>
        </div>
        <button class="ds-btn secondary" id="btnCustomize">CUSTOMIZE LAYOUT</button>
      </div>

      <!-- 4. AUDIO -->
      <div class="tab-pane ${settingsTab === 'audio' ? 'active' : ''}" id="pane-audio" style="${settingsTab === 'audio' ? 'display:block' : 'display:none'}">
         <div style="margin-bottom: 24px;">
          <div style="display:flex; align-items: center; gap: 12px;">
            <input type="checkbox" class="ds-toggle" id="setMus" ${musicWanted ? 'checked' : ''}>
            <span>Background Music</span>
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div style="display: flex; gap: 16px; margin-top: 32px; justify-content: flex-end;">
      <button type="button" class="ds-btn ghost" id="backSettingsBtn">BACK</button>
      <button type="button" class="ds-btn primary" id="saveSettingsBtn">APPLY & CLOSE</button>
    </div>
  </div>`;
}

function wireSettingsScreen() {
  const box = hud.el.panel.querySelector('#settingsScreen');
  if (!box) return;
  box.addEventListener('click', (e) => e.stopPropagation());
  box.addEventListener('keydown', (e) => e.stopPropagation());

  // Tab switching
  const tabs = box.querySelectorAll('.tab-btn');
  tabs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetTab = btn.dataset.tab;
      if (!targetTab) return;
      settingsTab = targetTab;
      tabs.forEach(b => {
        b.classList.toggle('active', b.dataset.tab === targetTab);
        if(b.dataset.tab === targetTab) {
          b.style.boxShadow = 'var(--stamp) inset';
          b.style.background = 'var(--ink)';
          b.style.color = 'var(--paper)';
        } else {
          b.style.boxShadow = 'none';
          b.style.background = 'transparent';
          b.style.color = 'var(--ink)';
        }
      });
      box.querySelectorAll('.tab-pane').forEach(p => {
        p.style.display = p.id === 'pane-' + targetTab ? 'block' : 'none';
        p.classList.toggle('active', p.id === 'pane-' + targetTab);
      });
    });
  });

  const isGameActive = settingsReturnTo === 'pause' || (typeof game !== 'undefined' && game.state === 'play' && !game.over);

  // Graphics Preset
  const presetBtns = box.querySelectorAll('#setPreset button');
  presetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isGameActive || btn.disabled) return;
      const p = btn.dataset.val;
      if (!p) return;
      settings.graphicsQuality = p;
      presetBtns.forEach(b => b.classList.toggle('active', b.dataset.val === p));
      applySettings();
    });
  });

  // Camera Sliders
  const bindSlider = (id, prop) => {
    const el = box.querySelector('#' + id);
    const out = box.querySelector('#' + id + 'V');
    if (el) el.addEventListener('input', () => {
      if (isGameActive && id === 'setResScale') return;
      settings[prop] = Number(el.value);
      if (out) out.textContent = settings[prop] + '%';
      applySettings();
    });
  };
  bindSlider('setSens', 'sens');
  bindSlider('setAimSens', 'aimSens');
  bindSlider('setResScale', 'resScale');

  const bindToggle = (id, prop) => {
    const el = box.querySelector('#' + id);
    if (el) el.addEventListener('change', (e) => {
      settings[prop] = e.target.checked;
      applySettings();
    });
  };
  bindToggle('setInv', 'invert');
  bindToggle('setMobile', 'mobile');
  
  const m = box.querySelector('#setMus');
  if(m) m.addEventListener('change', (e) => {
    musicWanted = e.target.checked;
    localStorage.setItem('doodle_music', musicWanted ? '1' : '0');
  });


  const btnCust = box.querySelector('#btnCustomize');
  if (btnCust) {
    fastClick(btnCust, () => {
      hud.hideScreen();
      if (typeof mobile !== 'undefined' && mobile.enterEditMode) {
        mobile.enterEditMode(() => {
          screen = 'settings';
          showStart();
        });
      }
    });
  }

  const closeMenu = () => {
    if (settingsReturnTo === 'pause') showPause();
    else { screen = 'main'; showStart(); }
  };
  fastClick(box.querySelector('#saveSettingsBtn'), closeMenu);
  fastClick(box.querySelector('#closeSettingsX'), closeMenu);
  fastClick(box.querySelector('#backSettingsBtn'), closeMenu);
  fastClick(box.querySelector('#resetSettingsBtn'), () => {
    if (isGameActive) return;
    settings.graphicsQuality = 'auto';
    settings.resScale = 100;
    settings.sens = 100;
    settings.aimSens = 85;
    settings.invert = false;
    applySettings();
    showStart();
  });
}

function wireName(box) {
  const nb = box.querySelector('#setName'); if (!nb) return;
  nb.addEventListener('input', (e) => { myName = e.target.value.trim().slice(0, 14) || myName; localStorage.setItem('doodle_name', myName); player.name = myName; net.hostName = myName; });
}
function checkpointHTML() {
  if (checkpoint < 5) return '';
  let h = '<div class="checkpoints"><span>checkpoints</span>';
  for (let w = 5; w <= checkpoint; w += 5) h += `<button type="button" data-cp="${w}">WAVE ${w}</button>`;
  return h + '</div>';
}
function wireCheckpoints(onGo) { const box = hud.el.panel.querySelector('.checkpoints'); if (!box) return; box.addEventListener('click', (e) => { e.stopPropagation(); const b = e.target.closest('button'); if (b) onGo(Number(b.dataset.cp)); }); }
const mapName = (k) => (LEVELS.find((m) => m.key === k) || LEVELS[0]).name;
function mapHTML(sel, canPick) { 
  if (LEVELS.length < 2) return ''; 
  return `
    <div class="mapsel" id="mapsel" style="display: flex; overflow-x: auto; gap: 12px; padding: 12px 0; width: 100%; max-width: 600px; scrollbar-width: thin; scrollbar-color: var(--ink) transparent;">
      ${LEVELS.map(m => {
        const isActive = m.key === sel;
        const soon = m.comingSoon;
        return `
          <div class="map-card${isActive ? ' active' : ''}${soon ? ' coming-soon' : ''} mapbtn" ${soon ? '' : `data-map="${m.key}"`} ${canPick && !soon ? '' : 'disabled'} style="flex: 0 0 140px; height: 160px; padding: 8px; ${(canPick && !soon) ? '' : 'pointer-events: none; opacity: 0.5;'} ${soon ? 'filter: grayscale(100%);' : ''}">
            <div style="font-size:10px; opacity:0.8; margin-bottom:4px; text-align:left;">SEC-${m.category==='urban'?'01':m.category==='colossal'?'02':'03'}</div>
            <div style="flex:1; border: 2px dashed currentColor; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:${soon ? '12px' : '32px'}; opacity:0.6; margin-bottom:6px; background-image: linear-gradient(rgba(26, 48, 192, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(26, 48, 192, 0.2) 1px, transparent 1px); background-size: 8px 8px; ${soon ? 'font-weight:bold; letter-spacing:1px; text-align:center;' : ''}">${soon ? 'COMING<br>SOON' : getMapSVG(m.key)}</div>
            <div style="font-size:13px; line-height:1.1; font-weight:bold; text-align:left;">${m.name}</div>
            ${isActive ? '<div class="tape-corner" style="display:block; transform: scale(0.6) rotate(45deg); top:-10px; right:-10px;"></div>' : ''}
          </div>
        `;
      }).join('')}
    </div>
  `; 
}
function wireMap(onPick) {
  const box = hud.el.panel.querySelector('#mapsel');
  if (box) {
    box.addEventListener('click', (e) => {
      e.stopPropagation();
      const b = e.target.closest('.mapbtn');
      if (b && !b.hasAttribute('disabled') && b.dataset.map) onPick(b.dataset.map);
    });
  }

  const carousel = hud.el.panel.querySelector('.map-carousel');
  if (carousel) {
    carousel.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        carousel.scrollLeft += e.deltaY;
      }
    });
  }
}
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function updatePreviewWeapon() {
  if (screen !== 'weapons_preview') {
    previewWeaponGroup.visible = false;
    return;
  }
  previewWeaponGroup.visible = true;
  while(previewWeaponGroup.children.length > 0) {
    previewWeaponGroup.remove(previewWeaponGroup.children[0]);
  }
  const fakeCtx = { audio: { play: ()=>{} }, scene: previewWeaponGroup };
  if (previewWeaponType === 'rifle') previewWeaponInst = new Rifle(fakeCtx);
  else if (previewWeaponType === 'shotgun') previewWeaponInst = new Shotgun(fakeCtx);
  else if (previewWeaponType === 'sniper') previewWeaponInst = new Sniper(fakeCtx);
  else if (previewWeaponType === 'revolver') previewWeaponInst = new Revolver(fakeCtx);
  else if (previewWeaponType === 'katana') previewWeaponInst = new Katana(fakeCtx);
  if (previewWeaponInst) {
    previewWeaponInst.build();
    previewWeaponInst.root.position.set(0, 0, 0);
    previewWeaponInst.root.visible = true;
    previewWeaponGroup.add(previewWeaponInst.root);
  }
}

function weaponsPreviewHTML() {

  return `
  <div class="ds-panel" style="width: 100%; max-width: 900px; margin: 40px auto; background: transparent; border: none; box-shadow: none;">
    <h1 style="font-family: var(--font-display); font-size: 48px; margin: 0; color: var(--ink);">WEAPON LOCKER</h1>
    <h2 style="font-family: var(--font-body); font-size: 16px; margin: 4px 0 32px 0; color: var(--ink);">preview your loadout</h2>
    
    <div class="weapons-menu ds-panel" id="weaponsMenu" style="display: flex; flex-direction: column; gap: 24px;">
      <div class="weapons-grid" style="display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;">
        <button type="button" class="ds-btn ${previewWeaponType === 'rifle' ? 'primary' : 'ghost'} lg preview-wep-card" data-wep="rifle">RIFLE</button>
        <button type="button" class="ds-btn ${previewWeaponType === 'shotgun' ? 'primary' : 'ghost'} lg preview-wep-card" data-wep="shotgun">SHOTGUN</button>
        <button type="button" class="ds-btn ${previewWeaponType === 'sniper' ? 'primary' : 'ghost'} lg preview-wep-card" data-wep="sniper">SNIPER</button>
        <button type="button" class="ds-btn ${previewWeaponType === 'katana' ? 'primary' : 'ghost'} lg preview-wep-card" data-wep="katana">KATANA</button>
      </div>
      
      <div style="background: var(--paper); border: 2px solid var(--ink); border-radius: var(--r-sketch-lg); padding: 24px; text-align: center; min-height: 200px;">
         <h3 style="font-family: var(--font-display); font-size: 32px; margin: 0 0 12px 0;">${previewWeaponType.toUpperCase()}</h3>
         <div style="font-family: var(--font-body); font-size: 16px; opacity: 0.8; max-width: 400px; margin: auto;">
            ${previewWeaponType === 'rifle' ? 'Fully automatic assault rifle. Balanced damage and fire rate. Best for mid-range engagements.' :
              previewWeaponType === 'shotgun' ? 'Pump-action scattergun. Devastating at close range. Slow fire rate.' :
              previewWeaponType === 'sniper' ? 'High-powered precision rifle. One shot kill on headshots. Long range.' :
              'Deadly blade for close-quarters combat. Dash-execute enemies when charged.'}
         </div>
      </div>
      
      <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
        <button type="button" class="ds-btn ghost md" id="backWeaponsBtn">BACK</button>
      </div>
    </div>
  </div>`;

}

function getMapSVG(key, isDossier = false) {
  const c = 'currentColor';
  const alpha = isDossier ? '0.85' : '0.7';
  let paths = '';
  
  if (key === 'district') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <rect x="5" y="5" width="45" height="40" fill="none" stroke="${c}" stroke-width="1.5" />
        <rect x="60" y="5" width="80" height="40" fill="none" stroke="${c}" stroke-width="1.5" />
        <rect x="150" y="5" width="45" height="40" fill="none" stroke="${c}" stroke-width="1.5" />
        
        <rect x="5" y="55" width="60" height="40" fill="none" stroke="${c}" stroke-width="1.5" />
        <rect x="75" y="55" width="65" height="40" fill="none" stroke="${c}" stroke-width="1.5" />
        <rect x="150" y="55" width="45" height="40" fill="none" stroke="${c}" stroke-width="1.5" />
        
        <line x1="0" y1="50" x2="200" y2="50" stroke="${c}" stroke-dasharray="4 4" stroke-width="1"/>
        <line x1="55" y1="0" x2="55" y2="50" stroke="${c}" stroke-dasharray="4 4" stroke-width="1"/>
        <line x1="70" y1="50" x2="70" y2="100" stroke="${c}" stroke-dasharray="4 4" stroke-width="1"/>
        <line x1="145" y1="0" x2="145" y2="100" stroke="${c}" stroke-dasharray="4 4" stroke-width="1"/>
        
        <circle cx="30" cy="25" r="8" fill="none" stroke="${c}" stroke-width="1"/>
        <text x="30" y="28" font-family="monospace" font-size="8" text-anchor="middle" fill="${c}">A1</text>
        
        <circle cx="110" cy="75" r="8" fill="none" stroke="${c}" stroke-width="1"/>
        <text x="110" y="78" font-family="monospace" font-size="8" text-anchor="middle" fill="${c}">B2</text>
        
        <line x1="60" y1="10" x2="140" y2="10" stroke="${c}" stroke-width="0.5"/>
        <line x1="60" y1="8" x2="60" y2="12" stroke="${c}" stroke-width="0.5"/>
        <line x1="140" y1="8" x2="140" y2="12" stroke="${c}" stroke-width="0.5"/>
        <text x="100" y="8" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">120m</text>

        <rect x="175" y="75" width="10" height="10" fill="none" stroke="${c}" stroke-width="1"/>
        <rect x="178" y="78" width="4" height="4" fill="${c}"/>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <path d="M20 75 L20 45 L50 30 L80 45 L80 75 L50 90 Z" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M20 45 L50 60 L80 45" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M50 60 L50 90" fill="none" stroke="${c}" stroke-width="2"/>
        
        <path d="M30 55 L40 60 M30 65 L40 70 M60 60 L70 55 M60 70 L70 65" stroke="${c}" stroke-width="1.5"/>
        <path d="M35 37 L50 30 L65 37" fill="none" stroke="${c}" stroke-width="1"/>
        
        <path d="M10 50 L10 20 L30 10 L50 20" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="2 2"/>
        <path d="M10 20 L20 25 L30 20 L30 10" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        <path d="M20 25 L20 45" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        
        <path d="M90 50 L90 30 L70 20 L50 30" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="2 2"/>
        <path d="M90 30 L80 35 L70 30 L70 20" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        <path d="M80 35 L80 45" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
      </svg>`;
    }
  } else if (key === 'classroom') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <rect x="20" y="20" width="160" height="60" fill="none" stroke="${c}" stroke-width="2"/>
        <line x1="20" y1="20" x2="40" y2="40" stroke="${c}" stroke-width="1"/>
        <line x1="180" y1="20" x2="160" y2="40" stroke="${c}" stroke-width="1"/>
        <line x1="20" y1="80" x2="40" y2="60" stroke="${c}" stroke-width="1"/>
        <line x1="180" y1="80" x2="160" y2="60" stroke="${c}" stroke-width="1"/>
        <rect x="40" y="40" width="120" height="20" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        
        <path d="M60 70 L90 70 L85 50 L55 50 Z" fill="none" stroke="${c}" stroke-width="1.5"/>
        <path d="M60 70 L75 85 L90 70" fill="none" stroke="${c}" stroke-width="1.5"/>
        <path d="M75 85 L85 50" fill="none" stroke="${c}" stroke-width="1.5"/>
        
        <circle cx="140" cy="50" r="12" fill="none" stroke="${c}" stroke-width="1.5"/>
        <circle cx="140" cy="50" r="4" fill="none" stroke="${c}" stroke-width="1.5"/>
        <line x1="140" y1="38" x2="140" y2="30" stroke="${c}" stroke-width="1"/>
        <line x1="140" y1="62" x2="140" y2="70" stroke="${c}" stroke-width="1"/>
        
        <rect x="30" y="25" width="40" height="10" transform="rotate(-15 30 25)" fill="none" stroke="${c}" stroke-width="1"/>
        <line x1="35" y1="25" x2="35" y2="35" transform="rotate(-15 30 25)" stroke="${c}" stroke-width="0.5"/>
        <line x1="40" y1="25" x2="40" y2="35" transform="rotate(-15 30 25)" stroke="${c}" stroke-width="0.5"/>
        <line x1="45" y1="25" x2="45" y2="35" transform="rotate(-15 30 25)" stroke="${c}" stroke-width="0.5"/>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <rect x="10" y="20" width="80" height="60" rx="4" fill="none" stroke="${c}" stroke-width="2"/>
        <line x1="10" y1="30" x2="90" y2="30" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        <line x1="10" y1="40" x2="90" y2="40" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        <line x1="10" y1="50" x2="90" y2="50" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        <line x1="10" y1="60" x2="90" y2="60" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        <line x1="10" y1="70" x2="90" y2="70" stroke="${c}" stroke-width="1" stroke-dasharray="2 2"/>
        
        <path d="M30 65 L60 65 L55 35 L25 35 Z" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M30 65 L45 80 L60 65" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M45 80 L55 35" fill="none" stroke="${c}" stroke-width="2"/>
        
        <rect x="70" y="25" width="10" height="40" fill="none" stroke="${c}" stroke-width="2"/>
        <line x1="70" y1="30" x2="80" y2="30" stroke="${c}" stroke-width="1"/>
        <line x1="70" y1="35" x2="80" y2="35" stroke="${c}" stroke-width="1"/>
        <line x1="70" y1="40" x2="80" y2="40" stroke="${c}" stroke-width="1"/>
      </svg>`;
    }
  }

  if (key === 'seas') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <!-- Ocean Bounds & Wave Grid -->
        <rect x="20" y="15" width="160" height="70" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="2 3"/>
        <path d="M25 50 Q60 48 95 50 T165 50" fill="none" stroke="${c}" stroke-width="0.8" stroke-dasharray="1 3"/>

        <!-- West Galleon 'El Dorado' Hull & Quarterdeck -->
        <path d="M40 28 L62 30 L66 70 L44 72 Z" fill="none" stroke="${c}" stroke-width="1.8"/>
        <circle cx="53" cy="38" r="3" fill="none" stroke="${c}" stroke-width="1.2"/>
        <circle cx="53" cy="50" r="3.5" fill="none" stroke="${c}" stroke-width="1.4"/>
        <circle cx="53" cy="62" r="3" fill="none" stroke="${c}" stroke-width="1.2"/>
        <line x1="38" y1="50" x2="68" y2="50" stroke="${c}" stroke-width="1"/>

        <!-- East Clipper 'Invincible' Hull & Decks -->
        <path d="M138 30 L160 28 L156 72 L134 70 Z" fill="none" stroke="${c}" stroke-width="1.8"/>
        <circle cx="147" cy="38" r="3" fill="none" stroke="${c}" stroke-width="1.2"/>
        <circle cx="147" cy="50" r="3.5" fill="none" stroke="${c}" stroke-width="1.4"/>
        <circle cx="147" cy="62" r="3" fill="none" stroke="${c}" stroke-width="1.2"/>
        <line x1="132" y1="50" x2="162" y2="50" stroke="${c}" stroke-width="1"/>

        <!-- Central Shattered Mainmast Boarding Bridge -->
        <line x1="66" y1="50" x2="134" y2="50" stroke="${c}" stroke-width="2.5"/>
        <rect x="94" y="46" width="12" height="8" fill="none" stroke="${c}" stroke-width="1.2"/>
        <circle cx="100" cy="50" r="1.5" fill="${c}"/>

        <!-- Kraken Tentacles & Flotsam -->
        <path d="M96 26 Q108 18 102 12" fill="none" stroke="${c}" stroke-width="1.5"/>
        <path d="M104 74 Q112 82 106 88" fill="none" stroke="${c}" stroke-width="1.5"/>
        <circle cx="88" cy="36" r="2" fill="none" stroke="${c}" stroke-width="1"/>
        <circle cx="112" cy="64" r="2" fill="none" stroke="${c}" stroke-width="1"/>

        <text x="100" y="94" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">INK SEAS NAVAL CHART - 110m</text>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <!-- Waves -->
        <path d="M10 74 Q25 66 40 74 T70 74 T95 74" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M15 82 Q30 76 45 82 T75 82 T95 82" fill="none" stroke="${c}" stroke-width="1.5"/>

        <!-- Galleon Hull Silhouette -->
        <path d="M22 62 L32 74 L72 74 L80 62 Z" fill="none" stroke="${c}" stroke-width="2.5"/>
        <!-- Mainmast & Crow's Nest -->
        <line x1="50" y1="22" x2="50" y2="62" stroke="${c}" stroke-width="2.5"/>
        <line x1="34" y1="36" x2="66" y2="36" stroke="${c}" stroke-width="2"/>
        <line x1="38" y1="48" x2="62" y2="48" stroke="${c}" stroke-width="1.8"/>
        <rect x="46" y="30" width="8" height="6" fill="${c}"/>

        <!-- Jolly Roger Pennant -->
        <path d="M50 22 L62 27 L50 32 Z" fill="${c}"/>
        <!-- Kraken Tentacle Rise -->
        <path d="M82 72 Q92 56 86 44" fill="none" stroke="${c}" stroke-width="2"/>
      </svg>`;
    }
  } else if (key === 'clockwork') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <circle cx="100" cy="50" r="40" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="2 4"/>
        
        <circle cx="100" cy="30" r="15" fill="none" stroke="${c}" stroke-width="1.5"/>
        <path d="M100 15 L100 45 M85 30 L115 30 M89.4 19.4 L110.6 40.6 M89.4 40.6 L110.6 19.4" stroke="${c}" stroke-width="1"/>
        <circle cx="100" cy="30" r="3" fill="${c}"/>

        <circle cx="70" cy="65" r="20" fill="none" stroke="${c}" stroke-width="1.5"/>
        <path d="M70 45 L70 85 M50 65 L90 65 M55.9 50.9 L84.1 79.1 M55.9 79.1 L84.1 50.9" stroke="${c}" stroke-width="1"/>
        <circle cx="70" cy="65" r="3" fill="${c}"/>

        <circle cx="130" cy="65" r="20" fill="none" stroke="${c}" stroke-width="1.5"/>
        <path d="M130 45 L130 85 M110 65 L150 65 M115.9 50.9 L144.1 79.1 M115.9 79.1 L144.1 50.9" stroke="${c}" stroke-width="1"/>
        <circle cx="130" cy="65" r="3" fill="${c}"/>

        <rect x="25" y="30" width="15" height="40" fill="none" stroke="${c}" stroke-width="1.5"/>
        <line x1="40" y1="40" x2="55" y2="40" stroke="${c}" stroke-width="1.5"/>
        <line x1="40" y1="60" x2="55" y2="60" stroke="${c}" stroke-width="1.5"/>

        <rect x="160" y="30" width="15" height="40" fill="none" stroke="${c}" stroke-width="1.5"/>
        <circle cx="167.5" cy="40" r="4" fill="none" stroke="${c}" stroke-width="1"/>
        <circle cx="167.5" cy="60" r="4" fill="none" stroke="${c}" stroke-width="1"/>

        <path d="M100 50 L100 85" stroke="${c}" stroke-width="2"/>
        <ellipse cx="100" cy="85" rx="8" ry="4" fill="none" stroke="${c}" stroke-width="2"/>
        <line x1="80" y1="15" x2="120" y2="15" stroke="${c}" stroke-width="0.5"/>
        <line x1="80" y1="13" x2="80" y2="17" stroke="${c}" stroke-width="0.5"/>
        <line x1="120" y1="13" x2="120" y2="17" stroke="${c}" stroke-width="0.5"/>
        <text x="100" y="12" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">110m</text>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <circle cx="50" cy="35" r="16" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M50 19 L50 51 M34 35 L66 35" stroke="${c}" stroke-width="1.5"/>
        <circle cx="50" cy="35" r="3" fill="${c}"/>
        
        <circle cx="35" cy="65" r="18" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M35 47 L35 83 M17 65 L53 65 M22.3 52.3 L47.7 77.7 M22.3 77.7 L47.7 52.3" stroke="${c}" stroke-width="1.5"/>
        <circle cx="35" cy="65" r="3" fill="${c}"/>

        <circle cx="65" cy="65" r="18" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M65 47 L65 83 M47 65 L83 65 M52.3 52.3 L77.7 77.7 M52.3 77.7 L77.7 52.3" stroke="${c}" stroke-width="1.5"/>
        <circle cx="65" cy="65" r="3" fill="${c}"/>

        <line x1="10" y1="40" x2="20" y2="40" stroke="${c}" stroke-width="2"/>
        <line x1="10" y1="60" x2="20" y2="60" stroke="${c}" stroke-width="2"/>
        <line x1="80" y1="40" x2="90" y2="40" stroke="${c}" stroke-width="2"/>
        <line x1="80" y1="60" x2="90" y2="60" stroke="${c}" stroke-width="2"/>
      </svg>`;
    }
  } else if (key === 'castle') {
    paths = `<path d="M10 90 L10 40 L20 40 L20 50 L30 50 L30 30 L40 30 L40 50 L60 50 L60 30 L70 30 L70 50 L80 50 L80 40 L90 40 L90 90 Z" fill="none" stroke="${c}" stroke-width="3"/>
             <path d="M40 90 L40 60 A10 10 0 0 1 60 60 L60 90" fill="none" stroke="${c}" stroke-width="3"/>
             <path d="M5 90 L95 90" stroke="${c}" stroke-width="4"/>`;
  } else if (key === 'zen') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <!-- River stream and bridge -->
        <path d="M20 20 Q100 15 180 20" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="2 2"/>
        <path d="M90 15 L110 15 L108 25 L92 25 Z" fill="none" stroke="${c}" stroke-width="1.5"/>
        <path d="M100 8 L100 15" stroke="${c}" stroke-width="1.5"/>
        <path d="M92 10 L108 10" stroke="${c}" stroke-width="2"/>

        <!-- Central Sanju-no-to Pagoda -->
        <rect x="85" y="40" width="30" height="30" fill="none" stroke="${c}" stroke-width="2"/>
        <rect x="90" y="45" width="20" height="20" fill="none" stroke="${c}" stroke-width="1.5"/>
        <rect x="94" y="49" width="12" height="12" fill="none" stroke="${c}" stroke-width="1"/>
        <circle cx="100" cy="55" r="2" fill="${c}"/>
        <!-- Flared roof corners -->
        <line x1="82" y1="37" x2="88" y2="43" stroke="${c}" stroke-width="1.5"/>
        <line x1="118" y1="37" x2="112" y2="43" stroke="${c}" stroke-width="1.5"/>
        <line x1="82" y1="73" x2="88" y2="67" stroke="${c}" stroke-width="1.5"/>
        <line x1="118" y1="73" x2="112" y2="67" stroke="${c}" stroke-width="1.5"/>

        <!-- West Bamboo Grove -->
        <circle cx="45" cy="45" r="1.5" fill="${c}"/>
        <circle cx="55" cy="40" r="1.5" fill="${c}"/>
        <circle cx="40" cy="55" r="1.5" fill="${c}"/>
        <circle cx="50" cy="60" r="1.5" fill="${c}"/>
        <circle cx="60" cy="52" r="1.5" fill="${c}"/>
        <path d="M35 35 Q48 52 40 70" fill="none" stroke="${c}" stroke-width="0.8" stroke-dasharray="2 2"/>

        <!-- East Karesansui Gravel Ocean & Sentinel Megaliths -->
        <ellipse cx="150" cy="55" rx="18" ry="12" fill="none" stroke="${c}" stroke-width="0.8" stroke-dasharray="2 3"/>
        <ellipse cx="150" cy="55" rx="12" ry="8" fill="none" stroke="${c}" stroke-width="0.8" stroke-dasharray="2 3"/>
        <rect x="146" y="51" width="8" height="8" rx="2" fill="${c}"/>
        <circle cx="140" cy="58" r="2.5" fill="${c}"/>
        <circle cx="158" cy="50" r="2" fill="${c}"/>
        <!-- Northeast War Fan Jump-Pad -->
        <path d="M140 32 L152 24 A12 12 0 0 1 156 36 Z" fill="none" stroke="${c}" stroke-width="1.2"/>

        <!-- South Tea Pavilion -->
        <rect x="92" y="80" width="16" height="12" fill="none" stroke="${c}" stroke-width="1.5"/>
        <line x1="90" y1="78" x2="110" y2="78" stroke="${c}" stroke-width="2"/>

        <text x="100" y="98" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">110m SANCTUARY</text>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <!-- Pagoda roof tiers -->
        <path d="M15 42 Q50 34 85 42" fill="none" stroke="${c}" stroke-width="2.5"/>
        <path d="M25 58 Q50 50 75 58" fill="none" stroke="${c}" stroke-width="2.5"/>
        <path d="M32 74 Q50 68 68 74" fill="none" stroke="${c}" stroke-width="2.5"/>

        <!-- Central tower structure -->
        <line x1="38" y1="42" x2="38" y2="85" stroke="${c}" stroke-width="1.5"/>
        <line x1="62" y1="42" x2="62" y2="85" stroke="${c}" stroke-width="1.5"/>
        <line x1="20" y1="85" x2="80" y2="85" stroke="${c}" stroke-width="2"/>

        <!-- Sōrin Calligraphy Brush Spire -->
        <line x1="50" y1="12" x2="50" y2="36" stroke="${c}" stroke-width="2"/>
        <circle cx="50" cy="12" r="2.5" fill="${c}"/>
        <circle cx="50" cy="20" r="1.5" fill="none" stroke="${c}" stroke-width="1"/>
        <circle cx="50" cy="25" r="2" fill="none" stroke="${c}" stroke-width="1"/>
        <circle cx="50" cy="30" r="2.5" fill="none" stroke="${c}" stroke-width="1"/>

        <!-- Torii Accent -->
        <path d="M12 28 L28 26" stroke="${c}" stroke-width="1.5"/>
        <path d="M15 28 L15 36 M25 27 L25 36" stroke="${c}" stroke-width="1.2"/>
      </svg>`;
    }
  } else if (key === 'mexico') {
    paths = `<path d="M20 80 L80 80" stroke="${c}" stroke-width="4"/>
             <path d="M40 80 L40 30 A10 10 0 0 1 60 30 L60 80" fill="none" stroke="${c}" stroke-width="3"/>
             <path d="M40 50 L20 50 L20 40 M60 60 L80 60 L80 50" fill="none" stroke="${c}" stroke-width="3"/>`;
  } else if (key === 'library') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <!-- Grand Desk Arena -->
        <rect x="55" y="25" width="90" height="50" fill="none" stroke="${c}" stroke-width="1.8"/>
        <!-- Central Inkwell -->
        <circle cx="100" cy="50" r="8" fill="none" stroke="${c}" stroke-width="1.5"/>
        <line x1="97" y1="46" x2="114" y2="35" stroke="${c}" stroke-width="1.2"/>
        <!-- Open Book Ramps North & South -->
        <path d="M85 25 L100 15 L115 25" fill="none" stroke="${c}" stroke-width="1.2"/>
        <path d="M85 75 L100 85 L115 75" fill="none" stroke="${c}" stroke-width="1.2"/>
        <!-- West Bookcase Tier Stacks -->
        <rect x="20" y="20" width="22" height="28" fill="none" stroke="${c}" stroke-width="1.5"/>
        <rect x="18" y="52" width="24" height="28" fill="none" stroke="${c}" stroke-width="1.5"/>
        <line x1="42" y1="34" x2="55" y2="40" stroke="${c}" stroke-dasharray="2 2" stroke-width="1"/>
        <!-- East Under-Desk Catacombs -->
        <line x1="155" y1="30" x2="185" y2="30" stroke="${c}" stroke-dasharray="3 3" stroke-width="1.5"/>
        <line x1="155" y1="70" x2="185" y2="70" stroke="${c}" stroke-dasharray="3 3" stroke-width="1.5"/>
        <circle cx="170" cy="50" r="12" fill="none" stroke="${c}" stroke-width="1.2"/>
        <!-- Desk Lamps -->
        <circle cx="68" cy="32" r="4" fill="${c}"/>
        <circle cx="132" cy="68" r="4" fill="${c}"/>
        <text x="100" y="96" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">112m COLOSSAL STUDY</text>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <!-- Stacked books icon -->
        <rect x="25" y="65" width="50" height="12" rx="2" fill="none" stroke="${c}" stroke-width="2"/>
        <rect x="30" y="50" width="45" height="12" rx="2" fill="none" stroke="${c}" stroke-width="2"/>
        <rect x="22" y="35" width="55" height="12" rx="2" fill="none" stroke="${c}" stroke-width="2"/>
        <!-- Desk Lamp Silhouette -->
        <path d="M72 65 Q85 30 65 20 L58 26" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M52 22 L66 16 L62 30 Z" fill="${c}"/>
        <!-- Quill -->
        <line x1="28" y1="28" x2="42" y2="12" stroke="${c}" stroke-width="1.5"/>
      </svg>`;
    }
  } else if (key === 'paradise') {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '200px' : '90px'};">
        <!-- Paradise Oasis / Haven Blueprint -->
        <rect x="25" y="15" width="150" height="70" fill="none" stroke="${c}" stroke-width="1.8"/>
        <!-- Central Sanctuary Core -->
        <circle cx="100" cy="50" r="18" fill="none" stroke="${c}" stroke-width="1.5"/>
        <circle cx="100" cy="50" r="6" fill="${c}"/>
        <!-- Stepped terraces & walkways -->
        <line x1="45" y1="50" x2="82" y2="50" stroke="${c}" stroke-width="1.5"/>
        <line x1="118" y1="50" x2="155" y2="50" stroke="${c}" stroke-width="1.5"/>
        <line x1="100" y1="20" x2="100" y2="32" stroke="${c}" stroke-width="1.5"/>
        <line x1="100" y1="68" x2="100" y2="80" stroke="${c}" stroke-width="1.5"/>
        <!-- Corner bastion perches -->
        <rect x="35" y="25" width="16" height="16" fill="none" stroke="${c}" stroke-width="1.2"/>
        <rect x="149" y="25" width="16" height="16" fill="none" stroke="${c}" stroke-width="1.2"/>
        <rect x="35" y="59" width="16" height="16" fill="none" stroke="${c}" stroke-width="1.2"/>
        <rect x="149" y="59" width="16" height="16" fill="none" stroke="${c}" stroke-width="1.2"/>
        <text x="100" y="94" font-family="monospace" font-size="6" text-anchor="middle" fill="${c}">PARADISE SECTOR - 110m</text>
      </svg>`;
    } else {
      return `<svg viewBox="0 0 100 100" class="map-svg thumb" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 90px; max-height: 90px;">
        <!-- Sun & Oasis Haven -->
        <circle cx="50" cy="38" r="14" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M50 56 L50 82" stroke="${c}" stroke-width="3"/>
        <path d="M30 64 Q50 58 70 64" fill="none" stroke="${c}" stroke-width="2"/>
        <path d="M22 74 Q50 68 78 74" fill="none" stroke="${c}" stroke-width="2"/>
        <line x1="50" y1="18" x2="50" y2="12" stroke="${c}" stroke-width="2"/>
        <line x1="32" y1="24" x2="26" y2="18" stroke="${c}" stroke-width="2"/>
        <line x1="68" y1="24" x2="74" y2="18" stroke="${c}" stroke-width="2"/>
      </svg>`;
    }
  } else {
    if (isDossier) {
      return `<svg viewBox="0 0 200 100" class="map-svg blueprint" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: 200px;">
        <rect x="20" y="15" width="160" height="70" fill="none" stroke="${c}" stroke-width="1.5" stroke-dasharray="6 4"/>
        <circle cx="100" cy="50" r="16" fill="none" stroke="${c}" stroke-width="1.5"/>
        <path d="M100 30 L100 70 M80 50 L120 50" stroke="${c}" stroke-width="1"/>
        <line x1="20" y1="50" x2="180" y2="50" stroke="${c}" stroke-dasharray="2 4" stroke-width="0.8"/>
        <text x="100" y="80" font-family="monospace" font-size="8" text-anchor="middle" fill="${c}">SURVEY IN PROGRESS</text>
      </svg>`;
    }
    paths = `<rect x="20" y="20" width="60" height="60" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="10 5"/>
             <circle cx="50" cy="50" r="10" fill="${c}"/>`;
  }
  return `<svg viewBox="0 0 100 100" class="map-svg" style="opacity:${alpha}; stroke-linecap:round; stroke-linejoin:round; width:100%; height:100%; max-width: ${isDossier ? '140px' : '90px'}; max-height: ${isDossier ? '140px' : '90px'};">${paths}</svg>`;
}

function mapSelectHTML() {

  const curMap = LEVELS.find((m) => m.key === mapKey) || LEVELS[0];
  
  let cardsHTML = '';
  LEVELS.forEach(m => {
    const tagsHTML = (m.tags || []).map(t => `<div style="font-size: 10px; border: 1px solid var(--pencil); border-radius: 4px; padding: 2px 6px; color: var(--pencil);">${t}</div>`).join('');
    
    const active = m.key === mapKey ? 'var(--ink-wash)' : 'transparent';
    const border = m.key === mapKey ? 'var(--ink)' : 'var(--pencil)';
    const soon = m.comingSoon ? 'opacity: 0.6;' : '';
    const clickAttr = m.comingSoon ? '' : `data-map="${m.key}"`;
    const disabled = m.comingSoon ? 'disabled' : '';

    cardsHTML += `
      <div class="ds-panel mapbtn" ${clickAttr} ${disabled} style="background: ${active}; border-color: ${border}; ${soon} padding: 12px; cursor: pointer; display: flex; flex-direction: column; gap: 8px; flex: 0 0 240px; box-sizing: border-box; transition: transform 0.1s;">
        <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: bold; color: var(--pencil);">
          <span>${m.category === 'urban' ? 'SEC-01' : m.category === 'colossal' ? 'SEC-02' : 'SEC-03'}</span>
          <span>${m.env || ''}</span>
        </div>
        <div style="height: 120px; display: flex; align-items: center; justify-content: center; ${m.comingSoon ? 'font-size: 16px; font-weight: bold; letter-spacing: 2px; text-align: center;' : ''}">
          ${m.comingSoon ? 'COMING<br>SOON' : getMapSVG(m.key)}
        </div>
        <div style="font-family: var(--font-display); font-size: 24px; text-align: center; color: var(--ink);">${m.name}</div>
        <div style="display: flex; gap: 4px; flex-wrap: wrap; justify-content: center; margin-top: auto;">${tagsHTML}</div>
      </div>
    `;
  });

  const bestScore = Number(localStorage.getItem(`doodle_best_${mapKey}`)) || 0;
  const isLocked = !!curMap.comingSoon;
  const deployLabel = isLocked ? 'MISSION IN DEVELOPMENT' : 'DEPLOY TO MISSION';
  const deployDisabled = isLocked ? 'disabled' : '';
  
  const diffStyle = (d) => {
    if (window.currentDifficulty === d) return d === 4 ? 'background:var(--ink-red); color:var(--paper); border-color:var(--ink-red);' : 'background:var(--ink); color:var(--paper);';
    return d === 4 ? 'color:var(--ink-red); border-color:var(--ink-red);' : 'color:var(--ink); background:transparent;';
  };
  const diffBtn = (d, label) => `<button class="tactical-filter-btn ds-btn secondary sm" data-diff="${d}" style="${diffStyle(d)}">${label}</button>`;

  return `
  <div id="mapsel" style="width: 100%; max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; justify-content: center; gap: 24px; pointer-events: auto; height: 100%;">
    
    ${game.mode === 'solo' || game.mode === 'duel' ? `
    <div style="background: var(--ink-wash); border-radius: var(--r-sketch-md); padding: 12px 24px; display: flex; justify-content: center; gap: 24px; align-items: center;">
      <div style="font-size: 14px; opacity: 0.8; font-weight: bold; font-family: var(--font-display); letter-spacing: 2px;">AI DIFFICULTY</div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        ${diffBtn(0, 'STUPID')}${diffBtn(1, 'EASY')}${diffBtn(2, 'HARD')}${diffBtn(3, 'EXTREME')}${diffBtn(4, 'GOD MODE')}
      </div>
    </div>
    ` : ''}

    <div style="display: flex; gap: 24px; align-items: stretch; flex-grow: 1; min-height: 0;">
      
      <!-- CAROUSEL AREA (Left Side) -->
      <div class="map-carousel" style="flex-grow: 1; display: flex; align-items: stretch; gap: 16px; overflow-x: auto; padding-bottom: 12px; scrollbar-width: thin; scrollbar-color: var(--ink) transparent;">
        ${cardsHTML}
      </div>
      
      <!-- DOSSIER AREA (Right Side) -->
      <div class="ds-panel" style="width: 320px; flex-shrink: 0; display: flex; flex-direction: column; gap: 16px; overflow-y: auto;">
        <div style="font-family: var(--font-display); font-size: 28px; color: var(--ink); border-bottom: 2px dashed var(--ink-wash); padding-bottom: 8px;">${curMap.name}</div>
        <div style="min-height: 140px; display: flex; align-items: center; justify-content: center;">
           ${getMapSVG(curMap.key, true)}
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px; font-family: var(--font-mono); font-size: 14px;">
          <div style="display: flex; justify-content: space-between;"><span>ENV</span> <b>${curMap.env || 'Unknown'}</b></div>
          <div style="display: flex; justify-content: space-between;"><span>ENGAGE</span> <b>${curMap.engagement || 'Unknown'}</b></div>
          <div style="display: flex; justify-content: space-between;"><span>SCALE</span> <b>${curMap.scale || 'Unknown'}</b></div>
        </div>
        ${curMap.hazard && curMap.hazard !== 'None' ? `<div style="color: var(--ink-red); font-family: var(--font-mono); font-size: 12px; font-weight: bold; text-align: center; margin-top: 8px;">WARNING: ${curMap.hazard}</div>` : ''}
        ${bestScore > 0 ? `<div style="font-family: var(--font-display); font-size: 16px; text-align: center; border-top: 2px dashed var(--ink-wash); padding-top: 12px; margin-top: 8px;">BEST SCORE: ${bestScore}</div>` : ''}
        ${checkpointHTML()}
      </div>
    </div>

    <!-- BOTTOM BAR -->
    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid var(--ink); padding: 16px 20px; background: rgba(246,243,230,0.85); backdrop-filter: blur(8px); border-radius: var(--r-sketch-md); flex-shrink: 0;">
      <button class="ds-btn ghost md" id="backBtn">ESC / BACK</button>
      <div style="display: flex; gap: 16px;">
        <button class="ds-btn secondary md" id="weaponsBtn">WEAPONS</button>
        <button class="ds-btn ${isLocked ? 'ghost' : 'primary'} lg" id="startBtn" ${deployDisabled}>${deployLabel}</button>
      </div>
    </div>
  </div>
  `;

}

function mainHTML() {

  const isInstalled = isAppInstalled();
  const installDisplay = (!isInstalled && typeof deferredPrompt !== 'undefined' && deferredPrompt) ? 'flex' : 'none';
  
  return `
  <div class="floating-utilities">
    <button type="button" id="forceReloadBtn" class="floating-btn update-btn" title="Update App">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 2v6h-6"></path>
        <path d="M3 12a9 9 0 1 0 2.13-5.88L2 9"></path>
      </svg>
    </button>
    <button type="button" id="settingsBtn" class="floating-btn settings-btn" title="Settings">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
      </svg>
    </button>
  </div>
  <div style="width: 100%; max-width: 800px; margin: 0 auto; padding: 24px 0; display: flex; flex-direction: column; align-items: center;">
    <h1 style="font-family: var(--font-display); font-size: clamp(40px, 8vw, 64px); letter-spacing: 3px; line-height: 1; margin: 0; color: var(--ink); text-align: center;">DOODLE STRIKE</h1>
    <h2 style="font-family: var(--font-body); font-size: 20px; font-weight: normal; margin: 4px 0 48px 0; color: var(--ink); text-align: center;">TACTICAL INK SHOOTER</h2>
    
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; width: 100%;">
      <button type="button" id="soloBtn" class="ds-btn primary hero" style="transform: rotate(var(--tilt-a)); padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px;">
        <span style="font-size: 32px; letter-spacing: 2px;">SURVIVAL</span>
        <span style="font-size: 14px; font-family: var(--font-mono); opacity: 0.9; margin-top: 8px;">Wave Defense</span>
      </button>
      <button type="button" id="duelBtn" class="ds-btn secondary hero" style="transform: rotate(var(--tilt-b)); padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px;">
        <span style="font-size: 32px; letter-spacing: 2px;">1v1 DUEL</span>
        <span style="font-size: 14px; font-family: var(--font-mono); opacity: 0.9; margin-top: 8px;">vs AI Boss</span>
      </button>
      <button type="button" id="onlineBtn" class="ds-btn secondary hero" style="transform: rotate(var(--tilt-c)); padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px;">
        <span style="font-size: 32px; letter-spacing: 2px;">MULTIPLAYER</span>
        <span style="font-size: 14px; font-family: var(--font-mono); opacity: 0.9; margin-top: 8px;">Public / Private</span>
      </button>
      <button type="button" id="exploreBtn" class="ds-btn secondary hero" style="transform: rotate(var(--tilt-a)); padding: 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px;">
        <span style="font-size: 32px; letter-spacing: 2px;">FREE ROAM</span>
        <span style="font-size: 14px; font-family: var(--font-mono); opacity: 0.9; margin-top: 8px;">Zero Enemies</span>
      </button>
    </div>
  </div>
  ${!isInstalled ? `<button type="button" id="mainInstallBtn" class="ds-btn ghost md" style="position: absolute; top: 24px; left: 24px; display: ${installDisplay};">INSTALL APP</button>` : ''}
  `;

}
function onlineHTML() {

  return `
  <div style="width: 100%; max-width: 800px; margin: 0 auto; padding: 24px 0;">
    <h1 style="font-family: var(--font-display); font-size: 48px; margin: 0; color: var(--ink);">PLAY ONLINE</h1>
    <h2 style="font-family: var(--font-body); font-size: 16px; margin: 4px 0 32px 0; color: var(--ink);">free for all &bull; first to ${FFA_TARGET} &bull; up to 10 players</h2>
    
    <div class="online ds-panel" id="online" style="display: flex; flex-direction: column; gap: 24px;">
      
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-family: var(--font-display); font-size: 20px;">YOUR NAME</span>
        <input type="text" class="namebox ds-input" id="setName" maxlength="14" value="${esc(myName)}" style="flex-grow: 1; max-width: 200px; font-size: 20px;">
      </div>
      
      <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
        <button type="button" class="ds-btn primary lg" id="quickBtn">QUICK PLAY</button>
        <span style="opacity: 0.8; font-size: 14px;">jumps into an open public lobby, or opens one for you</span>
      </div>
      
      <div style="border-top: 2px dashed var(--ink-wash); margin: 8px 0; text-align: center;">
        <span style="background: var(--paper); padding: 0 16px; position: relative; top: -12px; font-family: var(--font-display);">OR</span>
      </div>
      
      <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
        <button type="button" class="ds-btn secondary md" id="createBtn">CREATE LOBBY</button>
        <div class="radio ds-seg" style="display: flex;">
          <label class="ds-btn ${lobby.isPublic ? 'active' : 'ghost'}"><input type="radio" name="vis" value="public" ${lobby.isPublic ? 'checked' : ''} style="display:none;"> PUBLIC</label>
          <label class="ds-btn ${lobby.isPublic ? 'ghost' : 'active'}"><input type="radio" name="vis" value="private" ${lobby.isPublic ? '' : 'checked'} style="display:none;"> PRIVATE (code)</label>
        </div>
      </div>
      
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-family: var(--font-display); font-size: 20px;">HAVE A CODE?</span>
        <input type="text" id="codeBox" class="ds-input" placeholder="CODE" maxlength="5" autocomplete="off" style="width: 100px; font-size: 20px; text-transform: uppercase;">
        <button type="button" class="ds-btn secondary md" id="joinBtn">JOIN</button>
      </div>
      
      <div class="lobbylist" id="lobbylist" style="margin-top: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-family: var(--font-display); font-size: 20px;">PUBLIC LOBBIES</span>
          <button type="button" class="ds-btn ghost sm" id="refreshBtn">REFRESH</button>
        </div>
        <div class="rows" id="lobbyRows" style="background: var(--ink-wash); border-radius: var(--r-sketch-md); padding: 12px; min-height: 100px;">
          ${lobbyListHTML()}
        </div>
      </div>
      
      <div class="status" id="status" style="font-family: var(--font-mono); color: var(--ink-red);">${esc(lobby.status || '')}</div>
      
      ${lobby.rejoinCode ? `<div class="row"><button type="button" class="ds-btn danger lg" id="rejoinBtn">REJOIN ${esc(lobby.rejoinCode)}</button></div>` : ''}
      
      <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
        <button type="button" class="ds-btn ghost md" id="backBtn">BACK TO MAIN MENU</button>
      </div>
    </div>
  </div>`;

}
function lobbyHTML() {

  const rows = lobbyRows(); const host = net.isHost; const n = rows.length;
  return `
  <div style="width: 100%; max-width: 800px; margin: 0 auto; padding: 24px 0;">
    <h1 style="font-family: var(--font-display); font-size: 48px; margin: 0; color: var(--ink);">LOBBY</h1>
    <h2 style="font-family: var(--font-body); font-size: 16px; margin: 4px 0 32px 0; color: var(--ink);">free for all &bull; first to ${FFA_TARGET} &bull; ${n}/${net.maxPlayers} players</h2>
    
    <div class="online ds-panel" id="online" style="display: flex; flex-direction: column; gap: 24px;">
      
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
            <span style="font-family: var(--font-display); font-size: 20px;">CODE</span>
            <span class="code" style="font-family: var(--font-mono); font-size: 24px; font-weight: bold; margin-left: 12px;">${String(net.isHost ? (net.aliasCode || net.code) : (lobby.shown || net.code) || '').replace(/-\d+$/, '')}</span>
        </div>
        <div class="hint" style="font-size: 14px; opacity: 0.8; max-width: 250px; text-align: right;">
            ${lobby.isPublic ? 'this lobby is public: anyone can quick play in, or type the code' : 'private lobby: friends type this code under PLAY ONLINE -> JOIN'}
        </div>
      </div>
      
      <div style="border-top: 2px dashed var(--ink-wash); margin: 8px 0;"></div>
      
      ${mapHTML(lobby.map || mapKey, host)}
      
      <div class="plist" style="background: var(--ink-wash); border-radius: var(--r-sketch-md); padding: 16px; display: flex; flex-direction: column; gap: 8px;">
        <div style="font-family: var(--font-display); font-size: 16px; opacity: 0.8; color: var(--ink);">PLAYERS</div>
        ${rows.map((p) => `<div class="${p.id === lobby.hostId ? 'host' : ''}${p.id === net.id ? ' me' : ''}" style="display:flex; justify-content:space-between; font-family: var(--font-mono); color: var(--ink);">
            <span>${esc(p.name)}</span>
            <span style="opacity:0.6;">${p.id === net.id ? 'YOU' : ''}</span>
        </div>`).join('')}
      </div>
      
      <div class="status" id="status" style="font-family: var(--font-mono); color: var(--ink-red);">${esc(lobby.status || '')}</div>
      <div class="hint" style="text-align: center; opacity: 0.8; font-size: 14px;">anyone can start &bull; ${n < 2 ? 'people can still join once it is running' : n + ' players in'}</div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; flex-wrap: wrap; gap: 12px;">
        <button type="button" class="ds-btn danger md" id="leaveBtn">LEAVE</button>
        <div style="display: flex; gap: 12px;">
            <button type="button" class="ds-btn secondary md" id="weaponsBtn">VIEW WEAPONS</button>
            <button type="button" class="ds-btn primary lg" id="startBtn">START MATCH</button>
        </div>
      </div>
    </div>
  </div>`;

}
let lobbyList = null, listBusy = false;
function lobbyListHTML() {

  if (listBusy) return '<div style="opacity:0.8;">looking…</div>';
  if (!lobbyList) return '<div style="opacity:0.8;">press refresh to look for open lobbies</div>';
  if (!lobbyList.length) return '<div style="opacity:0.8;">hit QUICK PLAY to join a lobby</div>';
  return lobbyList.map((l) => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed var(--ink-wash);">
      <div>
        <b style="font-family: var(--font-mono); font-size: 16px;">${esc(l.code)}</b>
        <span style="margin-left: 12px; opacity: 0.9;">${esc(l.hostName || 'someone')}'s lobby</span>
        <span style="margin-left: 12px; font-size: 14px; opacity: 0.7;">${l.players}/${l.max}${l.inMatch ? ' &bull; in match' : ''}</span>
      </div>
      ${l.full ? '<span style="opacity:0.5;">FULL</span>' : `<button type="button" class="ds-btn secondary sm" data-join="${esc(l.code)}">JOIN</button>`}
    </div>`).join('');

}
async function refreshLobbies() {
  if (listBusy || net.active) return; listBusy = true; const box = hud.el.panel.querySelector('#lobbyRows'); if (box) box.innerHTML = lobbyListHTML();
  let err = null; try { lobbyList = await net.listLobbies({ name: myName }); } catch (e) { lobbyList = []; err = e; }
  listBusy = false; const rows = hud.el.panel.querySelector('#lobbyRows'); if (rows) rows.innerHTML = err ? `<div class="hint">could not look: ${esc(friendlyError(err))}</div>` : lobbyListHTML();
}
function wireOnline() {
  const box = hud.el.panel.querySelector('#online'); if (!box) return;
  box.addEventListener('click', (e) => e.stopPropagation()); box.addEventListener('keydown', (e) => e.stopPropagation());
  const q = (id) => box.querySelector('#' + id); wireName(box);
  if (q('quickBtn')) q('quickBtn').addEventListener('click', () => { lockButtons(box); quickPlay(); });
  if (q('createBtn')) q('createBtn').addEventListener('click', () => { lockButtons(box); createLobby(box.querySelector('input[name=vis]:checked').value === 'public'); });
  if (q('joinBtn')) { q('joinBtn').addEventListener('click', () => { const c = q('codeBox').value.trim().toUpperCase(); if (!c) { setStatus('type the code your friend gave you'); return; } lockButtons(box); joinLobby(c); }); q('codeBox').addEventListener('keydown', (e) => { if (e.key === 'Enter') q('joinBtn').click(); }); }
  if (q('rejoinBtn')) q('rejoinBtn').addEventListener('click', () => { const c = lobby.rejoinCode; lobby.rejoinCode = null; lockButtons(box); joinLobby(c); });
  if (q('backBtn')) q('backBtn').addEventListener('click', () => { lobby.status = ''; lobby.rejoinCode = null; screen = 'main'; showStart(); });
  if (q('refreshBtn')) { q('refreshBtn').addEventListener('click', () => refreshLobbies()); if (!lobbyList && !listBusy) refreshLobbies(); }
  if (q('lobbyRows')) q('lobbyRows').addEventListener('click', (e) => { const b = e.target.closest('button[data-join]'); if (b) { lockButtons(box); joinLobby(b.dataset.join); } });
  wireMap((k) => { if (net.isHost) { lobby.map = k; broadcastLobby(); } });
  if (q('startBtn')) q('startBtn').addEventListener('click', () => { if (net.isHost) hostStart(); else { net.send('startreq', {}); setStatus('asking the host to start…'); } });
  if (q('weaponsBtn')) q('weaponsBtn').addEventListener('click', () => { weaponsReturnTo = 'lobby'; screen = 'weapons_preview'; showStart(); });
  if (q('leaveBtn')) q('leaveBtn').addEventListener('click', () => { lobby.rejoinCode = null; leaveOnline(''); });
}
function lockButtons(box) { for (const b of box.querySelectorAll('button')) if (b.id !== 'backBtn') b.disabled = true; }
function unlockButtons() { const box = hud.el.panel.querySelector('#online'); if (box) for (const b of box.querySelectorAll('button')) b.disabled = false; }
function renderLobby() { if (game.state === 'lobby') showStart(); }
function showStart() {
  hud.el.screen.onclick = null;
  hud.setGameplayVisible(false);
  if (game.state === 'lobby') screen = 'lobby';
  if (screen === 'main') {
    game.state = 'start';
    game.menu = false;
    setLevel('studio', false);
  } else setLevel(mapKey, false);
  
  let carouselScrollLeft = 0;
  if (screen === 'map_select') {
    const carousel = hud.el.panel.querySelector('.map-carousel');
    if (carousel) carouselScrollLeft = carousel.scrollLeft;
  }

  const html = screen === 'lobby' ? lobbyHTML() : screen === 'online' ? onlineHTML() : screen === 'settings' ? settingsScreenHTML() : screen === 'weapons_preview' ? weaponsPreviewHTML() : screen === 'map_select' ? mapSelectHTML() : mainHTML();
  
  // Tactical layout has its own class, does not use main-menu-panel
  const isMainMenu = ['main', 'map_select', 'online', 'lobby', 'settings', 'weapons_preview'].includes(screen);
  hud.showScreen(html, isMainMenu);
  
  if (screen === 'map_select') {
    const carousel = hud.el.panel.querySelector('.map-carousel');
    if (carousel && carouselScrollLeft > 0) {
      carousel.scrollLeft = carouselScrollLeft;
    }
  }

  updatePreviewWeapon();
  const p = hud.el.panel;
  if (screen === 'map_select') p.classList.add('tactical-layout');
  else p.classList.remove('tactical-layout');

  if (screen === 'main') {


    fastClick(p.querySelector('#soloBtn'), () => { game.mode = 'solo'; screen = 'map_select'; showStart(); });
    fastClick(p.querySelector('#duelBtn'), () => { game.mode = 'duel'; screen = 'map_select'; showStart(); });
    fastClick(p.querySelector('#exploreBtn'), () => { game.mode = 'explore'; screen = 'map_select'; showStart(); });
    fastClick(p.querySelector('#onlineBtn'), () => { screen = 'online'; showStart(); });
    fastClick(p.querySelector('#settingsBtn'), () => { settingsReturnTo = 'main'; screen = 'settings'; showStart(); });
    fastClick(p.querySelector('#forceReloadBtn'), () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(regs => {
          for (let r of regs) r.unregister();
        });
      }
      if ('caches' in window) {
        caches.keys().then(names => {
          for (let name of names) caches.delete(name);
        });
      }
      setTimeout(() => {
        window.location.href = window.location.href.split('?')[0] + '?t=' + Date.now();
      }, 100);
    });

    fastClick(p.querySelector('#mainInstallBtn'), () => triggerInstallApp());
  } else if (screen === 'map_select') {
    wireCheckpoints((w) => beginAtWave(w));
    wireMap((k) => {
      if (mapKey === k) return;
      mapKey = k;
      localStorage.setItem('doodle_map', k);
      showStart();
      setTimeout(() => {
        setLevel(k, false);
      }, 50);
    });
    fastClick(p.querySelector('#startBtn'), () => {
      const activeMap = LEVELS.find((m) => m.key === mapKey);
      if (activeMap && activeMap.comingSoon) {
        hud.tip('Mission in development · Select an active theater', 2.0);
        return;
      }
      if (game.mode === 'explore') beginExplore(); 
      else if (game.mode === 'duel') beginDuel();
      else begin();
    });
    fastClick(p.querySelector('#backBtn'), () => { screen = 'main'; showStart(); });
    fastClick(p.querySelector('#weaponsBtn'), () => { weaponsReturnTo = 'map_select'; screen = 'weapons_preview'; showStart(); });
    

    
    p.querySelectorAll('.tactical-filter-btn').forEach(btn => {
      fastClick(btn, () => {
        if (btn.hasAttribute('data-diff')) {
          window.currentDifficulty = parseInt(btn.dataset.diff, 10);
          localStorage.setItem('doodle_difficulty', window.currentDifficulty);
        } else if (btn.hasAttribute('data-filter')) {
          window.currentTacticalFilter = btn.dataset.filter;
        }
        showStart();
      });
    });
    wireControlsToggle();
    } else if (screen === 'weapons_preview') {
    const box = p.querySelector('#weaponsMenu');
    if (box) {
      box.addEventListener('click', (e) => e.stopPropagation());
      box.addEventListener('keydown', (e) => e.stopPropagation());
      box.querySelectorAll('.preview-wep-card').forEach(btn => {
        fastClick(btn, (e) => {
          previewWeaponType = btn.dataset.wep;
          showStart();
        });
      });
      fastClick(box.querySelector('#backWeaponsBtn'), () => {
        screen = weaponsReturnTo || 'map_select';
        showStart();
      });
    }
  } else if (screen === 'settings') {
    wireSettingsScreen();
  } else wireOnline();
}
function wireControlsToggle() {
  const btn = hud.el.panel.querySelector('#controlsToggle');
  const cols = hud.el.panel.querySelector('#controlsCols');
  if (!btn || !cols) return;
  const isMobileView = window.innerWidth < 768;
  // default hidden on mobile, visible on desktop
  if (isMobileView) {
    cols.style.display = 'none';
    btn.textContent = '🎮 Show Controls / Help';
  } else {
    // on desktop start hidden too per requirement
    cols.style.display = 'none';
    btn.textContent = '🎮 Show Controls / Help';
  }
  fastClick(btn, (e) => {
    const hidden = cols.style.display === 'none';
    cols.style.display = hidden ? '' : 'none';
    btn.textContent = hidden ? '🎮 Hide Controls / Help' : '🎮 Show Controls / Help';
  });
}
function showPause() {

  if (typeof mobile !== 'undefined' && mobile.setGameplayActive) mobile.setGameplayActive(false);
  
  const scrimOpen = `<div class="ds-panel modal" style="width: 400px; max-width: 95vw; margin: auto; text-align: center; display: flex; flex-direction: column; gap: 24px;">`;
  
  if (online()) {
    hud.showScreen(`${scrimOpen}
      <div>
        <h1 style="font-family: var(--font-display); font-size: 40px; margin: 0; color: var(--ink);">PAUSED</h1>
        <h2 style="font-family: var(--font-body); font-size: 16px; margin: 4px 0 0 0; color: var(--ink);">lobby ${String(net.aliasCode || net.code || '').replace(/-\d+$/, '')}</h2>
      </div>
      <div style="text-align: left; background: var(--ink-wash); padding: 12px; border-radius: var(--r-sketch-md);">
        ${sortedScores().map(([id, s]) => `<div class="${id === net.id ? 'me' : ''}" style="display:flex; justify-content:space-between; font-family:var(--font-mono); margin-bottom: 4px;"><span>${esc(s.name)}</span><span>${s.kills} K &bull; ${s.deaths} D</span></div>`).join('')}
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <button type="button" class="ds-btn primary md" id="resumeBtn">RESUME MATCH</button>
        <button type="button" class="ds-btn secondary md" id="pauseSettingsBtn">SETTINGS</button>
        <button type="button" class="ds-btn danger md" id="leaveBtn">LEAVE MATCH</button>
      </div>
    </div>`);
    
    fastClick(hud.el.panel.querySelector('#resumeBtn'), (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        hud.el.screen.onclick = null;
        if(this.onScreenClick) this.onScreenClick();
        else { game.menu = false; game.state = 'play'; hud.hideScreen(); audio.reelLoop(true); }
    });
    
    const psb = hud.el.panel.querySelector('#pauseSettingsBtn');
    if (psb) fastClick(psb, (e) => { settingsReturnTo = 'pause'; screen = 'settings'; showStart(); });
    const lb = hud.el.panel.querySelector('#leaveBtn');
    if (lb) fastClick(lb, (e) => { lobby.rejoinCode = null; leaveOnline(''); });
    return;
  }
  
  if (game.mode === 'explore') {
    hud.showScreen(`${scrimOpen}
      <div>
        <h1 style="font-family: var(--font-display); font-size: 40px; margin: 0; color: var(--ink);">TEST RUN</h1>
        <h2 style="font-family: var(--font-body); font-size: 16px; margin: 4px 0 0 0; color: var(--ink);">${knownMap(mapKey).toUpperCase()}</h2>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <button type="button" class="ds-btn primary md" id="resumeBtn">RESUME</button>
        <button type="button" class="ds-btn secondary md" id="pauseSettingsBtn">SETTINGS</button>
        <button type="button" class="ds-btn danger md" id="menuBtn">MAIN MENU</button>
      </div>
    </div>`);
    
    fastClick(hud.el.panel.querySelector('#resumeBtn'), (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      hud.el.screen.onclick = null;
      game.menu = false; game.state = 'play'; hud.hideScreen(); audio.reelLoop(true);
    });
    const psb = hud.el.panel.querySelector('#pauseSettingsBtn');
    if (psb) fastClick(psb, (e) => { settingsReturnTo = 'pause'; screen = 'settings'; showStart(); });
    wireMenuBtn();
    return;
  }
  
  hud.showScreen(`${scrimOpen}
    <div>
      <h1 style="font-family: var(--font-display); font-size: 40px; margin: 0; color: var(--ink);">PAUSED</h1>
      <h2 style="font-family: var(--font-body); font-size: 16px; margin: 4px 0 0 0; color: var(--ink);">wave ${game.wave} &bull; score ${game.score}</h2>
    </div>
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <button type="button" class="ds-btn primary md" id="resumeBtn">RESUME</button>
      <button type="button" class="ds-btn secondary md" id="pauseSettingsBtn">SETTINGS</button>
      <button type="button" class="ds-btn danger md" id="menuBtn">MAIN MENU</button>
    </div>
  </div>`);
  
  fastClick(hud.el.panel.querySelector('#resumeBtn'), (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    hud.el.screen.onclick = null;
    game.menu = false; game.state = 'play'; hud.hideScreen(); audio.reelLoop(true);
  });
  const psb = hud.el.panel.querySelector('#pauseSettingsBtn');
  if (psb) fastClick(psb, (e) => { settingsReturnTo = 'pause'; screen = 'settings'; showStart(); });
  wireMenuBtn();

}
function showClickToPlay() {

  hud.showScreen(`<div class="ds-panel modal" style="width: 400px; max-width: 95vw; margin: auto; text-align: center; display: flex; flex-direction: column; gap: 24px;">
    <div>
      <h1 style="font-family: var(--font-display); font-size: 40px; margin: 0; color: var(--ink);">MATCH ON</h1>
      <h2 style="font-family: var(--font-body); font-size: 16px; margin: 4px 0 0 0; color: var(--ink);">free for all &bull; first to ${FFA_TARGET}</h2>
    </div>
    <div class="go" style="font-family: var(--font-display); font-size: 24px; animation: blink 1.2s infinite; cursor: pointer;">CLICK ANYWHERE (or press ${hud.key('confirm')}) TO PLAY</div>
  </div>`);

}
function showDead() {
  hud.el.screen.onclick = null;
  hud.setGameplayVisible(false); 
  const nb = game.score > best; 
  if (nb) { best = game.score; localStorage.setItem('doodle_best', String(best)); }
  
  hud.showScreen(`<div class="ds-panel modal" style="width: 440px; max-width: 95vw; margin: auto; text-align: center; display: flex; flex-direction: column; gap: 24px;">
    <div>
      <h1 style="font-family: var(--font-display); font-size: 48px; margin: 0; color: var(--ink-red);">ERASED</h1>
      <h2 style="font-family: var(--font-body); font-size: 16px; margin: 4px 0 0 0; color: var(--ink);">survived ${game.wave} wave${game.wave === 1 ? '' : 's'}</h2>
    </div>
    
    <div style="background: var(--ink-wash); padding: 16px; border-radius: var(--r-sketch-md); display: flex; justify-content: space-around; font-family: var(--font-mono);">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 12px; color: var(--pencil);">KILLS</span>
        <span style="font-size: 24px; font-weight: bold; color: var(--ink);">${game.kills}</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <span style="font-size: 12px; color: var(--pencil);">SCORE</span>
        <span style="font-size: 24px; font-weight: bold; color: ${nb ? 'var(--ink-red)' : 'var(--ink)'};">${game.score}</span>
      </div>
    </div>
    
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <button type="button" class="ds-btn primary md" id="deadRetryBtn">RETRY (WAVE 1)</button>
      ${checkpointHTML()}
      <button type="button" class="ds-btn secondary md" id="menuBtn">MAIN MENU</button>
    </div>
  </div>`);
  
  const retryBtn = hud.el.panel.querySelector('#deadRetryBtn');
  if (retryBtn) fastClick(retryBtn, (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (e && e.preventDefault) e.preventDefault();
    begin();
  });
  wireCheckpoints((w) => beginAtWave(w)); 
  wireMenuBtn();

}
function showDuelEnd(won) {
  hud.el.screen.onclick = null;
  hud.setGameplayVisible(false);
  const getStyle = (d) => {
    if (window.currentDifficulty === d) return d === 4 ? 'background:var(--ink-red); color:var(--paper); border-color:var(--ink-red);' : 'background:var(--ink); color:var(--paper);';
    return d === 4 ? 'color:var(--ink-red); border-color:var(--ink-red);' : 'color:var(--ink); background:transparent;';
  };
  const btn = (d, label) => `<button class="ds-btn secondary sm" data-diff="${d}" style="${getStyle(d)}">${label}</button>`;
  
  hud.showScreen(`<div class="ds-panel modal" style="width: 500px; max-width: 95vw; margin: auto; text-align: center; display: flex; flex-direction: column; gap: 24px;">
    <div>
      <h1 style="font-family: var(--font-display); font-size: 48px; margin: 0; color: ${won ? 'var(--ink)' : 'var(--ink-red)'};">${won ? 'VICTORY' : 'DEFEATED'}</h1>
      <h2 style="font-family: var(--font-body); font-size: 16px; margin: 4px 0 0 0; color: var(--ink);">${won ? 'You successfully defeated the AI' : 'The AI erased you'}</h2>
    </div>
    
    <div style="background: var(--ink-wash); padding: 16px; border-radius: var(--r-sketch-md); display: flex; flex-direction: column; gap: 12px; align-items: center;">
      <div style="font-size: 12px; opacity: 0.8; font-family: var(--font-display); letter-spacing: 1px;">CHANGE DIFFICULTY</div>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;" id="duelDiffBtns">
        ${btn(0, 'STUPID')}${btn(1, 'EASY')}${btn(2, 'HARD')}${btn(3, 'EXTREME')}${btn(4, 'GOD MODE')}
      </div>
    </div>
    
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <button type="button" class="ds-btn primary md" id="retryBtn">RETRY MATCH</button>
      <button type="button" class="ds-btn secondary md" id="menuBtn">MAIN MENU</button>
    </div>
  </div>`);
  
  hud.el.screen.querySelectorAll('#duelDiffBtns button').forEach(b => {
    fastClick(b, () => {
      window.currentDifficulty = parseInt(b.dataset.diff, 10);
      localStorage.setItem('doodle_difficulty', window.currentDifficulty);
      showDuelEnd(won);
    });
  });
  fastClick(hud.el.screen.querySelector('#retryBtn'), (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (e && e.preventDefault) e.preventDefault();
    beginDuel();
  });
  wireMenuBtn();

}
function menuBtnHTML() { return '<div class="online menubtn"><div class="row"><button type="button" class="alt" id="menuBtn">MAIN MENU</button></div></div>'; }
function wireMenuBtn() {
  const b = hud.el.panel.querySelector('#menuBtn');
  if (b) fastClick(b, (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (e && e.preventDefault) e.preventDefault();
    toMainMenu();
  });
}
function toMainMenu() {
  hud.el.screen.onclick = null;
  game.state = 'start';
  game.mode = 'solo';
  game.menu = false;
  game.over = null;
  game.intermission = 0;
  game.queue.length = 0;
  audio.reelLoop(false);
  input.exitLock();
  enemies.clear();
  effects.clear();
  for (const p of pickups) R.scene.remove(p.mesh);
  pickups.length = 0;
  pickupClock = 0;
  setLevel('studio', false, true);
  player.reset(level.playerStart);
  player.hp = player.maxHp;
  hud.setGameplayVisible(false);
  hud.hideScreen();
  screen = 'main';
  showStart();
}
function toLobbyScreen() { net.inMatch = false; for (const r of remote.values()) r.lastSeen = performance.now(); setArena(true); resetGame(); game.state = 'lobby'; game.over = null; game.menu = false; hud.setGameplayVisible(false); hud.setBoard(null); screen = 'lobby'; showStart(); }

// ---------------- run control ----------------
function resetGame() {
  if (level.breakables.some((b) => !b.alive)) setLevel(loadedKey, arenaLoaded, true);
  enemies.clear(); effects.clear(); for (const p of pickups) R.scene.remove(p.mesh); pickups.length = 0; pickupClock = 0;
  player.maxHp = online() ? 110 : 120; player.regenDelay = online() ? 4 : 4.5; player.regenRate = online() ? 14 : 11;
  player.reset(level.playerStart); player.name = myName; player.lastHitBy = null; player.lastHit = null; enemies.mods.speed = 1; enemies.mods.damage = 1; hud.setModifier(''); hud.setBoss(null, null); game.boss = null; endFocus(); game.katanaStreak = 0;
  game.score = 0; game.kills = 0; game.combo = 0; game.wave = 0; game.intermission = 0; game.queue = []; game.time = 0; game.over = null; game.matchT = 0; hud.setScore(0, 0); hud.setTimer(''); hud.setPvpScore(null); hud.setWave(1, 0); hud.setBoard(null);
  if (enemies.brain) enemies.brain.init(hud);
}
function beginCommon() {
  try {
    if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
      window.screen.orientation.lock('landscape').catch(() => {});
    }
  } catch(_) {}
  audio.init();
  audio.resume();
  if (!input.usingGamepad && !input.isTouch && !mobile.enabled) input.requestLock();
  if (musicWanted && !audio.musicPlaying) audio.musicOn(true);
  hud.hideScreen();
  hud.setGameplayVisible(true);
  game.menu = false;
}
function begin() {
  try {
    game.mode = 'solo';
    setArena(false);
    beginCommon();
    resetGame();
    startWave(1);
    game.state = 'play';
  } catch (err) {
    console.error('[Launch] Solo Start Error:', err);
    hud.tip('Failed to start mission: ' + err.message, 5);
  }
}
function beginDuel() { 
  try {
    game.mode = 'duel'; setArena(false); beginCommon(); resetGame(); game.state = 'play'; 
    player.grenades = 5;
    for (const w of player.weapons) { if (w.isGun) { w.mag = w.magSize; w.reserve = 999; } }
    hud.setWave('DUEL', 0, 'duel'); hud.message('1 V 1', 'Defeat the AI', 3.5);
    hud.tip('AI Difficulty: ' + (window.currentDifficulty === 4 ? 'GOD MODE' : window.currentDifficulty === 3 ? 'EXTREME' : window.currentDifficulty === 0 ? 'STUPID' : 'STANDARD'), 4);
    const diff = window.currentDifficulty ?? 2;
    const normalPool = ['rusher', 'heavy', 'shield', 'sniper', 'grunt'];
    const t = Math.random() < 0.1 ? 'boss' : normalPool[Math.floor(Math.random() * normalPool.length)];
    const spots = (typeof spawnSpots === 'function' ? spawnSpots() : []);
    const spawnPt = spots.length > 0 ? spots[Math.floor(Math.random()*spots.length)] : (typeof arenaSpawn === 'function' ? arenaSpawn() : level.playerStart.clone());
    spawnPt.y += 2;
    enemies.spawn(t, spawnPt);
  } catch (err) {
    console.error('[Launch] Duel Start Error:', err);
    hud.tip('Failed to start duel: ' + err.message, 5);
  }
}
function beginExplore() {
  try {
    game.mode = 'explore';
    setArena(false);
    beginCommon();
    resetGame();
    game.state = 'play';
    for (const w of player.weapons) {
      if (w.isGun) {
        w.mag = w.magSize;
        w.reserve = 999;
      }
    }
    player.grenades = 5;
    hud.setWave('ROAM', 0, 'roam');
    hud.message('TEST RUN', 'Free Roam · Zero enemies · Explore the map', 3.5);
    hud.tip(`Map: ${knownMap(mapKey).toUpperCase()} · Press Menu or ESC to pause`, 5);
  } catch (err) {
    console.error('[Launch] Explore Start Error:', err);
    hud.tip('Failed to start explore: ' + err.message, 5);
  }
}
function beginAtWave(n) { game.mode = 'solo'; setArena(false); beginCommon(); resetGame(); startWave(n); game.state = 'play'; }
function jumpToWave(n) { enemies.clear(); effects.clear(); enemies.mods.speed = 1; enemies.mods.damage = 1; endFocus(); game.intermission = 0; game.queue = []; startWave(n); hud.hideScreen(); hud.setGameplayVisible(true); game.state = 'play'; game.menu = false; audio.reelLoop(false); }
function hostStart() {
  scores.clear(); for (const [id, p] of lobby.players) scores.set(id, { name: p.name, kills: 0, deaths: 0 });
  // deal everyone a different spot, shuffled so the same people do not always start together
  setArena(true); const order = spawnSpots().map((_, i) => i); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  const spawns = {}; [...lobby.players.keys()].forEach((id, i) => { spawns[id] = order[i % order.length]; });
  net.send('start', { spawns, map: lobby.map || mapKey }); startMatch(false, spawns[net.id]); sendScores();
}
function startMatch(late, spawnIdx) {
  net.inMatch = true; game.mode = 'ffa'; setArena(true); resetGame(); matchLeft = FFA_TIME; clockT = 0; game.clockStarted = false;
  // nobody sends snapshots in the lobby, so the silence clock restarts here or the sweep would drop everyone
  for (const r of remote.values()) r.lastSeen = performance.now();
  if (!scores.size) for (const [id, p] of lobby.players) scores.set(id, { name: p.name, kills: 0, deaths: 0 });
  const spots = spawnSpots(); player.reset(spawnIdx != null && spots[spawnIdx] ? spots[spawnIdx].clone() : arenaSpawn()); beginCommon(); game.state = 'play'; screen = 'lobby'; player.shieldT = 2;
  refreshScoreHud(); hud.message('FREE FOR ALL', late ? 'you joined a match in progress' : 'first to ' + FFA_TARGET + ' · ' + Math.round(FFA_TIME / 60) + ' minutes · everyone is fair game', 3);
  hud.tip(`hold <b>${hud.key('score')}</b> for the scoreboard`, 5);
  // a match started by someone else's click cannot grab the mouse: ask for a click
  setTimeout(() => { if (game.state === 'play' && !input.pointerLocked && !input.usingGamepad && !input.isTouch && !mobile.enabled) { game.menu = true; showClickToPlay(); } }, 250);
}
function pause() { if ((game.state !== 'play' && !(game.state === 'dying' && online())) || game.menu) return; if (!online()) game.state = 'pause'; game.menu = true; showPause(); audio.reelLoop(false); }
function resume() {
  if (game.state === 'start' || game.state === 'dead' || game.state === 'over' || game.state === 'lobby') return;
  if (online()) {
    game.menu = false;
    if (game.state === 'dying' && game.respawnT <= 0) game.respawnArm = input.lastActive;
    hud.hideScreen();
    hud.setGameplayVisible(true);
    if (!input.usingGamepad && !input.isTouch && !mobile.enabled) input.requestLock();
    return;
  }
  if (game.mode === 'explore') {
    beginCommon();
    game.state = 'play';
    return;
  }
  if (game.state === 'pause') {
    game.menu = false;
    game.state = 'play';
    hud.hideScreen();
    hud.setGameplayVisible(true);
    audio.reelLoop(true);
    if (!input.usingGamepad && !input.isTouch && !mobile.enabled) input.requestLock();
    return;
  }
  begin();
}
Object.assign(window.__game, { startWave, updateWaves, begin, beginDuel, beginExplore, beginAtWave, jumpToWave, resetGame, spawnPickup, focusCandidate, enterFocus, pickSpawn, startMatch, createLobby, joinLobby, quickPlay, leaveOnline, hostStart });
hud.onScreenClick = () => {
  const st = game.state;
  if (st === 'over') { if (net.isHost) { net.send('backtolobby', {}); toLobbyScreen(); } return; }
  if (st === 'lobby' || st === 'start' || st === 'dead') return;
  if ((st === 'play' || st === 'dying') && game.menu) { resume(); return; }
  if (st === 'pause') resume();
};
canvas.addEventListener('click', () => { if (game.state === 'play' && !game.menu && !input.pointerLocked && !input.usingGamepad && !input.isTouch && !mobile.enabled) input.requestLock(); });
input.onLockChange = (locked) => { if (!locked && (game.state === 'play' || (game.state === 'dying' && online())) && !game.menu && !input.usingGamepad && !input.isTouch && !mobile.enabled) pause(); };
input.onDeviceChange = (pad) => { hud.setDevice(pad); hud.setWeapon(player.weapon.name, player.weapon.hint); };
window.addEventListener('pagehide', () => { if (net.active) net.leave(); });
window.addEventListener('beforeunload', (e) => { if (game.state === 'play' || game.state === 'dying') { e.preventDefault(); e.returnValue = ''; } });
// browsers only let audio start on a gesture; any press wakes the context if it went to sleep
for (const ev of ['pointerdown', 'keydown', 'touchstart']) window.addEventListener(ev, () => { audio.init(); audio.resume(); }, { passive: true });
hud.setDevice(input.usingGamepad); applySettings(); hud.setWeapon(player.weapon.name, player.weapon.hint); showStart();

// ---------------- loop ----------------
let last = performance.now(), boardToggle = false, lockTipT = 0.5, musicHealT = 2;
function tick(now) { requestAnimationFrame(tick); step(now); }
// browsers starve animation frames in hidden tabs; a host that alt-tabs would freeze everyone's
// match, so a coarse timer runs extra steps (never extra frame chains) while that happens
setInterval(() => { if (net.active && performance.now() - last > 300) step(performance.now()); }, 250);
function step(now) {
  // never more than 50 ms a step: a bigger jump (a tab coming back) makes the springs in the view model fly apart
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  input.update(dt);
  const st = game.state; const playing = st === 'play' || st === 'dying';
  if (st === 'start' || st === 'pause' || st === 'dead' || st === 'over') { if (input.pressed('jump') || input.pressed('confirm') || (st === 'pause' && input.pressed('pause'))) hud.onScreenClick(); }
  else if ((st === 'play' || (st === 'dying' && online())) && input.pressed('pause')) { if (game.menu) resume(); else { pause(); input.exitLock(); } }
  else if ((st === 'play' || st === 'dying') && game.menu && (input.pressed('jump') || input.pressed('confirm'))) resume();
  if (input.pressed('music')) { musicWanted = !musicWanted; localStorage.setItem('doodle_music', musicWanted ? '1' : '0'); audio.musicOn(musicWanted); hud.tip(musicWanted ? 'music on' : 'music off', 1.5); }
  if (input.pressed('screenshot')) triggerScreenshot();
  if (online() && playing) {
    if (input.usingGamepad && input.pressed('score')) boardToggle = !boardToggle;
    const want = ((input.down('score') && !input.usingGamepad) || boardToggle) && !game.menu; if (want !== !hud.el.board.hidden) hud.setBoard(want ? boardHTML() : null);
  } else boardToggle = false;
  if (st === 'play' && !game.menu && !input.pointerLocked && !input.usingGamepad && !input.isTouch && !mobile.enabled) { lockTipT -= dt; if (lockTipT <= 0) { lockTipT = 2.5; hud.tip('click the page to grab the mouse', 2); } }
  if (mobile && mobile.enabled && mobile.setActiveWeapon) mobile.setActiveWeapon(player.weaponIndex);
  if (screen === 'weapons_preview' && previewWeaponInst) {
    const isMobile = window.innerWidth <= 768;
    previewWeaponGroup.position.set(isMobile ? 0 : -0.15, isMobile ? 0.15 : 0, isMobile ? -0.7 : -0.6);
    if (!previewDragging) {
      previewIdleT += dt;
      if (previewIdleT > 1.5) previewAutoRot += dt * 0.5;
    }
    previewWeaponInst.root.rotation.y = previewAutoRot + previewManualRot;
  }
  let scale = 1;
  if (game.hitstopT > 0) { game.hitstopT -= dt; scale = game.hitstopScale; }
  else if (game.focus.active) scale = FOCUS_SCALE;
  const sdt = dt * scale;
  if (st === 'play' && !online()) updateFocus(dt); else endFocus();
  if (playing) {
    game.time += sdt; if (player.shieldT > 0) player.shieldT -= dt;
    musicHealT -= dt; if (musicHealT <= 0) { musicHealT = 2; if (musicWanted && st === 'play' && !audio.musicPlaying && audio.ctx) audio.musicOn(true); if (input.anyInput) audio.resume(); }
    {
      const B = level.bounds, bp = player.body.pos;
      if (bp.x < B.minX - 8 || bp.x > B.maxX + 8 || bp.z < B.minZ - 8 || bp.z > B.maxZ + 8 || bp.y > 150 || bp.y < -20) {
        if (game.mode === 'explore') {
          player.reset(level.playerStart);
          player.hp = player.maxHp;
          hud.setHealth(player.hp, player.maxHp);
          hud.tip('Reset to start position', 2);
        } else {
          bp.y = -100;
        }
      }
    }
    player.update(sdt); enemies.update(sdt); effects.update(sdt); updatePickups(sdt); netUpdate(dt);
    if (st === 'play' && !online() && game.mode !== 'explore' && game.mode !== 'duel') updateWaves(sdt);
    if (st === 'play' && !online() && game.mode === 'duel') {
      if (enemies.alive <= 0 && game.time > 1) {
        game.state = 'over'; game.overT = 0;
        showDuelEnd(true); input.exitLock();
      }
    }
    if (online()) updateArenaPickups(dt);
    if (game.comboT > 0) { game.comboT -= sdt; if (game.comboT <= 0) { game.combo = 0; hud.setScore(game.score, 0); } }
    if (st === 'dying') {
      game.deathT += dt;
      if (online()) {
        const before = Math.ceil(game.respawnT); game.respawnT -= dt; const left = Math.ceil(game.respawnT);
        if (left > 0) { if (left !== before || game.deathT <= dt) hud.message(String(left), 'back on the page in', 1.1); }
        else if (before > 0) { game.respawnArm = input.lastActive; game.promptT = 0; }
        else if (!game.menu) {
          // waiting on a press: any key, button or click brings you back; pause opens the menu instead
          game.promptT -= dt; if (game.promptT <= 0) { game.promptT = 1.4; hud.message('READY', `press ${hud.key('confirm')} · any button or click to respawn`, 1.5); }
          if (input.lastActive !== game.respawnArm && !input.pressed('pause') && !input.down('pause')) respawnLocal();
        }
      }
      else if (game.deathT > 1.7) { 
        game.state = 'dead'; 
        if (game.mode === 'duel') showDuelEnd(false); else showDead(); 
        input.exitLock(); 
      }
    }
  } else {
    game.time += dt; if (st === 'start' || st === 'dead' || st === 'lobby' || st === 'over') player.idleCam(game.time, dt); effects.update(dt); if (net.active) netUpdate(dt);
    if (st === 'over') { game.overT += dt; if (net.isHost && game.overT > 8) { net.send('backtolobby', {}); toLobbyScreen(); } else if (!net.isHost && game.overT > 15) { toLobbyScreen(); } }
  }
  for (const a of level.animated) a.update(game.time);
  audio.setListener(player.eye, player.right);
  const w = player.weapon; if (w.isGun) hud.setAmmo(w.mag, w.reserve, w.magSize, w.reloading); else hud.setKatana();
  hud.setWeapons(player.weapons, player.weaponIndex);
  hud.setGrenades(player.grenades); hud.setGrappleStamina(player.grapStam); hud.setHealth(player.hp, player.maxHp); hud.setSpread(w.spreadPx); hud.update(dt);
  if (online()) hud.setFocusMeter(playing, player.grapStam, false, 'GRAPPLE');
  else hud.setFocusMeter(playing && (w.kind === 'katana' || game.katanaStreak > 0 || game.focus.active), game.focus.active ? 1 : clamp(game.katanaStreak / KATANA_CHARGE_KILLS, 0, 1), game.focus.active, 'KATANA');
  if (game.boss) { if (game.boss.alive) hud.setBoss(game.boss.T.name, game.boss.hp / game.boss.maxHp); else { hud.setBoss(null, null); game.boss = null; } }
  audio.setIntensity(clamp((enemies.alive + game.queue.length + remote.size * 2) / 12, 0, 1) * (game.intermission > 0 ? 0.25 : 1));
  lodManager.update(R.camera.position);
  lodManager.flush(3);
  perfMonitor.setCombatState(playing && (enemies.alive > 0 || game.boss != null));
  R.render(game.time, { hurt: player.hurtFx, flash: player.flashFx, slow: scale < 1 ? 1 : 0, lowHp: player.alive && player.hp < 30 ? 1 - player.hp / 30 : 0 });
  perfMonitor.tick(dt * 1000, now);
}
requestAnimationFrame(tick);
