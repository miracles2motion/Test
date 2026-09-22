// Game bootstrap: solo waves, free-for-all lobbies, checkpoints, scoring, screens and the loop.
// Online play is peer-to-peer: one player's browser hosts the lobby and keeps score, every
// player runs their own body, and each one tells the others what it did.
import { settingsScreenHTML, checkpointHTML, weaponsPreviewHTML, mapSelectHTML, mainHTML, onlineHTML, lobbyHTML, lobbyListHTML, menuBtnHTML } from './ui-templates.js';
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
import { synthesizeMapSVG } from './svg-synthesizer.js';
import { getMapSVG } from './map-svgs.js';
import { BotArenaManager } from './bot-arena.js';

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
let screen = 'main';
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


let screenTransitionUntil = 0;

function setScreenTransitionGuard(duration = 380) {
  screenTransitionUntil = Math.max(screenTransitionUntil, Date.now() + duration);
  if (hud && hud.el && hud.el.panel) {
    hud.el.panel.style.pointerEvents = 'none';
    setTimeout(() => {
      if (Date.now() >= screenTransitionUntil && hud.el && hud.el.panel) {
        hud.el.panel.style.pointerEvents = '';
      }
    }, duration);
  }
}

function fastClick(el, handler) {
  if (!el) return;
  let lastTriggerTime = 0;
  const trigger = (e) => {
    const now = Date.now();
    if (now < screenTransitionUntil) {
      if (e && e.preventDefault) e.preventDefault();
      if (e && e.stopImmediatePropagation) e.stopImmediatePropagation();
      else if (e && e.stopPropagation) e.stopPropagation();
      return;
    }
    if (now - lastTriggerTime < 320) return;
    lastTriggerTime = now;
    handler(e);
  };

  let startX = 0, startY = 0, tracking = false;
  el.addEventListener('touchstart', (e) => {
    if (Date.now() < screenTransitionUntil) return;
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
      if (Date.now() < screenTransitionUntil) return;
      if (e.changedTouches && e.changedTouches[0]) {
        const dx = Math.abs(e.changedTouches[0].clientX - startX);
        const dy = Math.abs(e.changedTouches[0].clientY - startY);
        if (dx > 14 || dy > 14) return;
      }
      if (e && e.preventDefault && e.cancelable) e.preventDefault();
      trigger(e);
    }
  }, { passive: false });

  el.addEventListener('click', (e) => {
    trigger(e);
  });
}
const effects = new Effects(R.scene, world);
const ctx = { scene: R.scene, camera: R.camera, world, level, nav, input, hud, effects, audio, renderer: R };

// ---------------- persistent bits ----------------
let best = Number(localStorage.getItem('doodle_best') || 0);
let bestForMap = JSON.parse(localStorage.getItem('doodle_best_map') || '{}');
let bestWaveForMap = JSON.parse(localStorage.getItem('doodle_best_wave_map') || '{}');
let renderQuality = localStorage.getItem('doodle_render_quality') || 'high';
let cameraFov = Number(localStorage.getItem('doodle_fov') || 75);
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
export const botArena = new BotArenaManager(ctx);
let arenaFormat = localStorage.getItem('doodle_arena_format') || '5v5';
window.__game = { ctx, game, player, enemies, nav, world, level, hud, effects, input, mobile, net, remote, lobby, scores, botArena };

// anything a bullet or a blade can hit besides enemies
ctx.targets = () => [player, ...botArena.bots.filter((b) => b.alive), ...remote.values()];
ctx.canHurt = (t) => {
  if (game.mode === 'arena') {
    if (!t.alive || t === player) return false;
    return botArena.format === 'ffa' || t.team !== player.team;
  }
  return online() && t !== player;
};
ctx.raycastPlayers = (o, d, maxDist) => {
  let best = null;
  const pool = [...remote.values(), ...botArena.bots];
  for (const t of pool) {
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
ctx.playersInArc = (pos, dir, range, cosHalf) => {
  const out = [];
  const pool = [...remote.values(), ...botArena.bots];
  for (const t of pool) {
    if (!t.alive || !ctx.canHurt(t)) continue;
    _v.subVectors(t.center, pos);
    const d = _v.length();
    if (d > range + 0.3) continue;
    if (d > 0.3 && _v.normalize().dot(dir) < cosHalf) continue;
    if (!world.hasLineOfSight(pos, t.center)) continue;
    out.push(t);
  }
  return out;
};
ctx.hitPlayer = (t, dmg, info) => {
  if (!ctx.canHurt(t) || !t.alive) return;
  // Bot target hit handling
  if (t.isBot) {
    effects.blood(info.point, info.dir, clamp(0.4 + dmg / 80, 0.4, 1.6), { ink: INK.RED });
    hud.hitmarker(false, info.crit);
    audio.hitEnemy(t.center);
    t.flash();
    t.takeDamage(dmg, player.center, info.source || 'gun');
    if (!t.alive) {
      botArena.handlePlayerKill(t);
    }
    return;
  }
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
  if (!net.isHost && game.mode !== 'arena') return; pickupClock -= dt;
  if (pickupClock <= 0 && pickups.length < 10) { pickupClock = 7; spawnPickup(Math.random() < 0.35 ? 'health' : 'ammo', choose(level.pickups)); }
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
  let spots = spawnSpots();
  if (game.mode === 'arena' && botArena.format !== 'ffa' && level.teamSpawns) {
    spots = player.team === 'alpha' ? level.teamSpawns[0] : level.teamSpawns[1];
  }
  const others = [...remote.values(), ...botArena.bots]
    .filter((r) => r.alive && r.root && r.root.visible)
    .map((r) => ({ pos: r.body.pos, eye: r.eye || new THREE.Vector3(r.body.pos.x, r.body.pos.y + 1.6, r.body.pos.z), team: r.team }));
  return spawnManager.pickBestSpawn(spots, others, world, player.team);
}
// a spot for a late joiner: the one farthest from everybody already in the match
function farthestSpawnIndex() {
  const spots = spawnSpots(); const bodies = [player, ...remote.values(), ...botArena.bots].filter((r) => r.alive); let best = 0, bd = -1;
  spots.forEach((s, i) => { const d = bodies.reduce((a, r) => Math.min(a, r.body.pos.distanceTo(s)), 999); if (d > bd) { bd = d; best = i; } });
  return best;
}
function onLocalDeath() {
  if (game.mode === 'arena') {
    game.respawnT = 3.0;
    game.state = 'dying';
    game.deathT = 0;
    const killer = player.lastHitBy || null;
    botArena.handleDeath(player, null, killer);
    return;
  }
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









let lobbyList = null, listBusy = false;

async function refreshLobbies() {
  if (listBusy || net.active) return; listBusy = true; const box = hud.el.panel.querySelector('#lobbyRows'); if (box) box.innerHTML = lobbyListHTML(buildUIContext());
  let err = null; try { lobbyList = await net.listLobbies({ name: myName }); } catch (e) { lobbyList = []; err = e; }
  listBusy = false; const rows = hud.el.panel.querySelector('#lobbyRows'); if (rows) rows.innerHTML = err ? `<div class="hint">could not look: ${esc(friendlyError(err))}</div>` : lobbyListHTML(buildUIContext());
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

function buildUIContext() {
  return { LEVELS, mapKey, game, window, arenaFormat, best, bestForMap, bestWaveForMap, musicWanted, renderQuality, isAppInstalled, deferredPrompt, mobile, player, previewWeaponType, previewWeaponInst, cameraFov, lobby, FFA_TARGET, FFA_TIME, net, myName, scores, checkpoint, settingsTab, settingsReturnTo, version: typeof version !== 'undefined' ? version : '1.0', getPlayableMaps, Object };
}
function showStart() {
  setScreenTransitionGuard(350);
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

  const html = screen === 'lobby' ? lobbyHTML(buildUIContext()) : screen === 'online' ? onlineHTML(buildUIContext()) : screen === 'settings' ? settingsScreenHTML(buildUIContext()) : screen === 'weapons_preview' ? weaponsPreviewHTML(buildUIContext()) : screen === 'map_select' ? mapSelectHTML(buildUIContext()) : mainHTML(buildUIContext());
  
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
    fastClick(p.querySelector('#duelBtn'), () => { game.mode = 'arena'; screen = 'map_select'; showStart(); });
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
      else if (game.mode === 'arena' || game.mode === 'duel') beginArenaMatch(arenaFormat, window.currentDifficulty);
      else begin();
    });
    fastClick(p.querySelector('#backBtn'), () => { screen = 'main'; showStart(); });
    fastClick(p.querySelector('#weaponsBtn'), () => { weaponsReturnTo = 'map_select'; screen = 'weapons_preview'; showStart(); });

    p.querySelectorAll('.tactical-format-btn').forEach(btn => {
      fastClick(btn, () => {
        if (btn.hasAttribute('data-format')) {
          arenaFormat = btn.dataset.format;
          localStorage.setItem('doodle_arena_format', arenaFormat);
          showStart();
        }
      });
    });

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
      ${checkpointHTML(buildUIContext())}
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
function showArenaEnd(results) {
  hud.el.screen.onclick = null;
  hud.setGameplayVisible(false);
  input.exitLock();
  game.state = 'over';

  const isPlayerWin = (results.winner === 'TEAM ALPHA') || (results.winner === (player.name || 'YOU'));
  const isDraw = results.winner === 'DRAW';
  const headerColor = isPlayerWin ? 'var(--ink-blue, #1a30c0)' : (isDraw ? 'var(--ink)' : 'var(--ink-red, #c02020)');
  const headerTitle = isPlayerWin ? 'VICTORY!' : (isDraw ? 'MATCH DRAW!' : 'DEFEAT!');

  const sortedStats = [...(results.stats || [])].sort((a, b) => b.kills - a.kills || a.deaths - b.deaths);
  const mvp = sortedStats[0] || { name: 'UNKNOWN', kills: 0 };

  const rowsHTML = sortedStats.map((s, idx) => {
    const isMe = s.team === 'player' || s.name === (player.name || 'YOU');
    const teamColor = s.team === 'alpha' ? 'color:var(--ink-blue, #1a30c0);' : (s.team === 'bravo' ? 'color:var(--ink-red, #c02020);' : '');
    return `
      <div style="display:flex; justify-content:space-between; padding:5px 8px; border-bottom:1px dashed var(--pencil); font-family:var(--font-mono); font-size:13px; ${isMe ? 'background:rgba(26,48,192,0.12); font-weight:bold;' : ''}">
        <span style="${teamColor}">${idx + 1}. ${s.name}${isMe ? ' (YOU)' : ''}</span>
        <span>${s.kills} K / ${s.deaths} D</span>
      </div>
    `;
  }).join('');

  hud.showScreen(`
    <div class="ds-panel modal" style="width:500px; max-width:95vw; margin:auto; text-align:center; display:flex; flex-direction:column; gap:16px;">
      <div>
        <h1 style="font-family:var(--font-display); font-size:44px; margin:0; color:${headerColor}; letter-spacing:2px;">${headerTitle}</h1>
        <h2 style="font-family:var(--font-mono); font-size:14px; margin:4px 0 0 0; color:var(--ink);">${results.winner} WON THE MATCH</h2>
      </div>

      ${botArena.format !== 'ffa' ? `
      <div style="display:flex; justify-content:center; gap:24px; font-family:var(--font-mono); font-size:22px; font-weight:bold; background:var(--ink-wash); padding:10px 20px; border-radius:var(--r-sketch-md);">
        <span style="color:var(--ink-blue, #1a30c0);">ALPHA: ${results.scoreAlpha}</span>
        <span style="opacity:0.5;">-</span>
        <span style="color:var(--ink-red, #c02020);">BRAVO: ${results.scoreBravo}</span>
      </div>
      ` : ''}

      <div style="font-size:12px; font-family:var(--font-mono); color:var(--ink-orange); font-weight:bold;">
        ⭐ MATCH MVP: ${mvp.name} (${mvp.kills} KILLS)
      </div>

      <div style="max-height:180px; overflow-y:auto; border:1px solid var(--ink); border-radius:4px; padding:4px;">
        ${rowsHTML}
      </div>

      <div style="display:flex; gap:12px; justify-content:center; margin-top:8px;">
        <button type="button" class="ds-btn primary md" id="arenaRetryBtn">PLAY AGAIN</button>
        <button type="button" class="ds-btn secondary md" id="menuBtn">MAIN MENU</button>
      </div>
    </div>
  `);

  const retryBtn = hud.el.panel.querySelector('#arenaRetryBtn');
  if (retryBtn) {
    fastClick(retryBtn, (e) => {
      if (e?.stopPropagation) e.stopPropagation();
      if (e?.preventDefault) e.preventDefault();
      beginArenaMatch(botArena.format, window.currentDifficulty);
    });
  }
  wireMenuBtn();
}

function wireMenuBtn() {
  const b = hud.el.panel.querySelector('#menuBtn');
  if (b) fastClick(b, (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopImmediatePropagation) e.stopImmediatePropagation();
    else if (e && e.stopPropagation) e.stopPropagation();
    setScreenTransitionGuard(420);
    toMainMenu();
  });
}
function toMainMenu() {
  setScreenTransitionGuard(420);
  hud.el.screen.onclick = null;
  if (typeof mobile !== 'undefined' && mobile.buttons) {
    for (const k in mobile.buttons) mobile.buttons[k] = false;
    if (mobile.buttonTaps) mobile.buttonTaps.clear();
  }
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
  if (typeof botArena !== 'undefined' && botArena.active) {
    for (const b of botArena.bots) {
      if (b.root && b.root.parent) R.scene.remove(b.root);
    }
    botArena.bots = [];
    botArena.active = false;
  }
  enemies.clear(); effects.clear(); for (const p of pickups) R.scene.remove(p.mesh); pickups.length = 0; pickupClock = 0;
  player.maxHp = online() ? 110 : 120; player.regenDelay = online() ? 4 : 4.5; player.regenRate = online() ? 14 : 11;
  player.reset(level.playerStart); player.name = myName; player.lastHitBy = null; player.lastHit = null; enemies.mods.speed = 1; enemies.mods.damage = 1; hud.setModifier(''); hud.setBoss(null, null); game.boss = null; endFocus(); game.katanaStreak = 0;
  game.score = 0; game.kills = 0; game.combo = 0; game.wave = 0; game.intermission = 0; game.queue = []; game.time = 0; game.over = null; game.matchT = 0; hud.setScore(0, 0); hud.setTimer(''); hud.setPvpScore(null); hud.setWave(1, 0); hud.setBoard(null);
  if (enemies.brain) enemies.brain.init(hud);
}
let _startingMatch = false; // grace flag: suppress onLockChange pause during match launch

function beginCommon() {
  try {
    if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
      window.screen.orientation.lock('landscape').catch(() => {});
    }
  } catch(_) {}
  audio.init();
  audio.resume();
  _startingMatch = true;
  setTimeout(() => { _startingMatch = false; }, 600);
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
function beginArenaMatch(format = arenaFormat, diff = window.currentDifficulty) {
  try {
    game.mode = 'arena';
    setArena(true);
    beginCommon();
    resetGame();
    player.reset(arenaSpawn());
    game.state = 'play';
    player.grenades = 5;
    for (const w of player.weapons) {
      if (w.isGun) {
        w.mag = w.magSize;
        w.reserve = 999;
      }
    }
    botArena.startMatch(format, diff ?? 4);
    botArena.onMatchEnd = (results) => showArenaEnd(results);
    hud.setWave('ARENA', 0, 'roam');
    hud.message(
      (format || arenaFormat).toUpperCase() + ' ARENA',
      'Defeat the enemy squad · First to ' + botArena.targetScore + ' kills',
      3.5
    );
  } catch (err) {
    console.error('[Launch] Arena Match Error:', err);
    hud.tip('Failed to start arena match: ' + err.message, 5);
  }
}
function beginDuel() { 
  beginArenaMatch('1v1', window.currentDifficulty);
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
function pause() { if ((game.state !== 'play' && !(game.state === 'dying' && (online() || game.mode === 'arena'))) || game.menu) return; if (!online() && game.mode !== 'arena') game.state = 'pause'; game.menu = true; showPause(); audio.reelLoop(false); }
function resume() {
  if (game.state === 'start' || game.state === 'dead' || game.state === 'over' || game.state === 'lobby') return;
  if (online() || game.mode === 'arena') {
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
input.onLockChange = (locked) => { if (_startingMatch) return; if (!locked && (game.state === 'play' || (game.state === 'dying' && (online() || game.mode === 'arena'))) && !game.menu && !input.usingGamepad && !input.isTouch && !mobile.enabled) pause(); };
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
  else if ((st === 'play' || (st === 'dying' && (online() || game.mode === 'arena'))) && input.pressed('pause')) { if (game.menu) resume(); else { pause(); input.exitLock(); } }
  else if ((st === 'play' || st === 'dying') && game.menu && (input.pressed('jump') || input.pressed('confirm'))) resume();
  if (input.pressed('music')) { musicWanted = !musicWanted; localStorage.setItem('doodle_music', musicWanted ? '1' : '0'); audio.musicOn(musicWanted); hud.tip(musicWanted ? 'music on' : 'music off', 1.5); }
  if (input.pressed('screenshot')) triggerScreenshot();
  if ((online() || game.mode === 'arena') && playing) {
    if (input.usingGamepad && input.pressed('score')) boardToggle = !boardToggle;
    const want = ((input.down('score') && !input.usingGamepad) || boardToggle) && !game.menu;
    if (want !== !hud.el.board.hidden) {
      if (game.mode === 'arena') {
        hud.setBoard(want ? botArena.boardHTML() : null);
      } else {
        hud.setBoard(want ? boardHTML() : null);
      }
    }
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
    if (game.mode === 'arena') {
      botArena.update(sdt);
      hud.setPvpScore(botArena.getHudScoreHTML());
    }
    if (st === 'play' && !online() && game.mode !== 'explore' && game.mode !== 'duel' && game.mode !== 'arena') updateWaves(sdt);
    if (st === 'play' && !online() && game.mode === 'duel') {
      if (enemies.alive <= 0 && game.time > 1) {
        game.state = 'over'; game.overT = 0;
        showDuelEnd(true); input.exitLock();
      }
    }
    if (online() || game.mode === 'arena') updateArenaPickups(dt);
    if (game.comboT > 0) { game.comboT -= sdt; if (game.comboT <= 0) { game.combo = 0; hud.setScore(game.score, 0); } }
    if (st === 'dying') {
      game.deathT += dt;
      if (online() || game.mode === 'arena') {
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
  for (const a of level.animated) {
    if (typeof a?.update === 'function') a.update(game.time);
    else if (typeof a === 'function') a(game.time);
  }
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
