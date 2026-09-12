// DOM heads-up display drawn in "pen" style (multiplied over the paper canvas).
export class HUD {
  constructor(root) {
    this.root = root;
    root.innerHTML = `
      <div class="scope" id="scope"><div class="mask"></div><div class="ring"></div><div class="cx"></div><div class="cy"></div><div class="dot"></div></div>
      <div class="focus-meter" id="focusmeter"><div class="fm-label">KATANA</div><div class="fm-tube"><div class="fm-fill" id="fmfill"></div><i class="fm-f1"></i><i class="fm-f2"></i><i class="fm-f3"></i></div><div class="fm-ready" id="fmready">READY</div></div>
      <div class="focus-mark" id="focusmark"><i></i><i></i><i></i><i></i></div>
      <div class="crosshair" id="crosshair"><i class="ch-t"></i><i class="ch-b"></i><i class="ch-l"></i><i class="ch-r"></i><i class="ch-dot"></i></div>
      <div class="grapple-ret" id="gret"></div><div class="gstam" id="gstam" hidden><i id="gstamfill"></i></div>
      <div class="hitmarker" id="hitmarker"><i></i><i></i></div>
      <div class="dmg-ind" id="dmg"></div>
      <div class="hud-tl"><div class="score">SCORE <b id="score">0</b></div><div class="combo" id="combo"></div></div>
      <div class="hud-tr"><div class="wave">WAVE <b id="wave">1</b></div><div class="modifier" id="modifier"></div><div class="left"><b id="left">0</b> ENEMIES LEFT</div><div class="timer" id="timer"></div><div class="pvpscore" id="pvpscore" hidden></div></div><div class="board" id="board" hidden></div>
      <div class="bossbar" id="bossbar"><div class="bossname" id="bossname"></div><div class="bar big"><div class="fill red" id="bossfill"></div></div></div>
      <div class="hud-bl">
        <div class="health"><span>HEALTH</span><div class="bar"><div class="fill" id="hpfill"></div></div><span id="hpnum">100</span></div>
        <div class="ammo"><b id="mag">30</b><span id="reserve">/120</span><span class="reloading" id="reloading"></span><span class="nades" id="nades" title="Grenades"></span></div>
        <div class="tally" id="tally"></div>
      </div>
      <div class="hud-br"><div class="slots" id="slots"></div><div class="weapon" id="weapon">RIFLE</div><div class="hint" id="hint"></div></div>
      <div class="tip" id="tip"></div>
      <div class="message"><div class="msg-main" id="msg"></div><div class="msg-sub" id="msgsub"></div></div>
      <div class="killfeed" id="killfeed"></div>
      <div class="screen" id="screen"><div class="panel" id="panel"></div></div>`;
    const q = (id) => root.querySelector('#' + id);
    this.el = { crosshair: q('crosshair'), gret: q('gret'), hitmarker: q('hitmarker'), dmg: q('dmg'), score: q('score'), combo: q('combo'), wave: q('wave'), modifier: q('modifier'), left: q('left'), timer: q('timer'), hpfill: q('hpfill'), hpnum: q('hpnum'), mag: q('mag'), reserve: q('reserve'), reloading: q('reloading'), tally: q('tally'), weapon: q('weapon'), hint: q('hint'), slots: q('slots'), tip: q('tip'), msg: q('msg'), msgsub: q('msgsub'), killfeed: q('killfeed'), screen: q('screen'), panel: q('panel'), nades: q('nades'), scope: q('scope'), focusmark: q('focusmark'), focusmeter: q('focusmeter'), fmfill: q('fmfill'), bossbar: q('bossbar'), bossname: q('bossname'), bossfill: q('bossfill'), pvpscore: q('pvpscore'), board: q('board'), gstam: q('gstam'), gstamfill: q('gstamfill') };
    this._msgT = 0; this._scope = false; this._nades = -1; this._pad = false; this.onDevice = null; this._fmShow = false; this._fmFrac = -1; this._fmReady = false; this._lastTally = -1; this._lastSlots = ''; this._ads = false; this._mode = ''; this.onScreenClick = null; this.onScreenVisibility = null; this._tipT = 0;
    this.el.screen.addEventListener('click', (e) => {
      // Only resume/proceed if clicking directly on the backdrop or on an explicit .go prompt
      // Never trigger when interacting with .panel buttons, sliders, inputs, or content
      if (e.target === this.el.screen || e.target.closest('.go')) {
        if (this.onScreenClick) this.onScreenClick();
      }
    });
  }
  setFocusMeter(show, frac, ready, label = 'KATANA') {
    const m = this.el.focusmeter;
    if (show !== this._fmShow) { this._fmShow = show; m.classList.toggle('on', show); }
    if (!show) return;
    if (label !== this._fmLabel) { this._fmLabel = label; m.querySelector('.fm-label').textContent = label; }
    const f = Math.max(0, Math.min(1, frac));
    if (Math.abs(f - (this._fmFrac ?? -1)) > 0.005) { this._fmFrac = f; this.el.fmfill.style.height = (f * 100).toFixed(1) + '%'; }
    if (ready !== this._fmReady) { this._fmReady = ready; m.classList.toggle('ready', ready); }
  }
  setGrenades(n) { if (n === this._nades) return; this._nades = n; let h = ''; for (let i = 0; i < n; i++) h += '<i></i>'; this.el.nades.innerHTML = h; }
  setDevice(pad) { if (pad === this._pad) return; this._pad = pad; this.root.classList.toggle('pad', pad); if (this.onDevice) this.onDevice(pad); }
  key(action) { return (this._pad ? PAD_KEYS : KB_KEYS)[action] || action; }
  setScope(on) {
    if (on === this._scope) return;
    this._scope = on;
    this.el.scope.classList.toggle('on', on);
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.toggle('scoped', on);
    }
  }
  setFocusMark(x, y) {
    const m = this.el.focusmark;
    if (x == null) { m.classList.remove('on'); return; }
    m.classList.add('on'); m.style.transform = `translate(${x.toFixed(0)}px, ${y.toFixed(0)}px)`;
  }
  setSpread(px) { this.el.crosshair.style.setProperty('--s', px.toFixed(1) + 'px'); }
  setCrosshairMode(mode) { this._mode = mode; this._applyCross(); }
  setAds(on) { if (on === this._ads) return; this._ads = on; this._applyCross(); }
  _applyCross() { this.el.crosshair.className = 'crosshair ' + this._mode + (this._ads ? ' ads' : ''); }
  setGrappleStamina(f) { const show = f < 0.995; if (this.el.gstam.hidden === show) this.el.gstam.hidden = !show; if (show) { this.el.gstamfill.style.width = (f * 100).toFixed(0) + '%'; this.el.gstam.classList.toggle('low', f < 0.2); } }
  grappleTarget(state) { this.el.gret.className = 'grapple-ret' + (state === 1 ? ' on' : state === 2 ? ' on attached' : ''); }
  hitmarker(kill = false, crit = false) { const h = this.el.hitmarker; h.className = 'hitmarker' + (kill ? ' kill' : '') + (crit ? ' crit' : ''); void h.offsetWidth; h.classList.add('show'); }
  setAmmo(mag, reserve, magSize, reloading = false) {
    this.el.mag.textContent = mag; this.el.reserve.textContent = '/' + reserve; this.el.reloading.textContent = reloading ? ' RELOADING...' : '';
    if (mag !== this._lastTally) { this._lastTally = mag; let s = ''; for (let i = 0; i < Math.min(mag, 40); i++) s += '<i></i>'; this.el.tally.innerHTML = s; }
  }
  setKatana() { this.el.mag.textContent = '∞'; this.el.reserve.textContent = ''; this.el.reloading.textContent = ''; if (this._lastTally !== -1) { this.el.tally.innerHTML = ''; this._lastTally = -1; } }
  setWeapons(weapons, activeIndex) {
    const w = weapons[activeIndex];
    const key = `${activeIndex}:${w.isGun ? w.mag + '/' + w.reserve : 'inf'}`;
    if (key === this._lastSlots) return;
    this._lastSlots = key;
    this.el.slots.innerHTML = weapons.map((wp, i) => {
      const active = i === activeIndex;
      const ammo = wp.isGun ? wp.mag + '/' + wp.reserve : '∞';
      const empty = wp.isGun && wp.mag === 0 && wp.reserve === 0;
      return `<div class="slot${active ? ' active' : ''}${empty ? ' empty' : ''}"><span class="num">${i + 1}</span>${wp.name}<span class="sammo">${ammo}</span></div>`;
    }).join('');
  }
  setSlots(slots) {
    const key = slots.map((s) => `${s.name}|${s.active ? 1 : 0}|${s.ammo}`).join(';'); if (key === this._lastSlots) return; this._lastSlots = key;
    this.el.slots.innerHTML = slots.map((s, i) => `<div class="slot${s.active ? ' active' : ''}${s.empty ? ' empty' : ''}"><span class="num">${i + 1}</span>${s.name}<span class="sammo">${s.ammo}</span></div>`).join('');
  }
  setHealth(hp, max) { const f = Math.max(0, hp / max); this.el.hpfill.style.width = (f * 100).toFixed(1) + '%'; this.el.hpnum.textContent = Math.ceil(hp); this.root.classList.toggle('low', f < 0.3); }
  setBoard(html) { const on = !!html; this.el.board.hidden = !on; if (on) this.el.board.innerHTML = html; }
  setPvpScore(html) { const on = !!html; this.el.pvpscore.hidden = !on; if (on) this.el.pvpscore.innerHTML = html; this.el.wave.parentElement.hidden = on; this.el.left.parentElement.hidden = on; }
  setWave(n, left) { this.el.wave.textContent = n; this.el.left.textContent = left; }
  setModifier(text) { this.el.modifier.textContent = text || ''; }
  setTimer(text) { this.el.timer.textContent = text || ''; }
  setScore(score, combo) { this.el.score.textContent = score; this.el.combo.textContent = combo > 1 ? 'COMBO x' + combo : ''; }
  setWeapon(name, hint) { this.el.weapon.textContent = name; this.el.hint.textContent = hint || ''; }
  setBoss(name, frac) { if (frac == null) { this.el.bossbar.classList.remove('show'); return; } this.el.bossbar.classList.add('show'); this.el.bossname.textContent = name; this.el.bossfill.style.width = (Math.max(0, frac) * 100).toFixed(1) + '%'; }
  tip(text, dur = 5) { this.el.tip.innerHTML = text; this.el.tip.classList.add('show'); this._tipT = dur; }
  message(main, sub = '', dur = 2.2) { const m = this.el.msg; m.textContent = main; m.classList.remove('show'); void m.offsetWidth; m.classList.add('show'); this.el.msgsub.textContent = sub; this._msgT = dur; }
  kill(text, pts) {
    const d = document.createElement('div'); d.innerHTML = pts > 0 ? `${text} <span class="pts">+${pts}</span>` : text; this.el.killfeed.appendChild(d);
    setTimeout(() => d.remove(), 1700); while (this.el.killfeed.children.length > 6) this.el.killfeed.firstChild.remove();
  }
  damageFrom(angle) { const i = document.createElement('i'); i.style.transform = `rotate(${(angle * 180 / Math.PI).toFixed(1)}deg)`; this.el.dmg.appendChild(i); setTimeout(() => i.remove(), 1000); }
  showScreen(html, isMain = false) {
    this.el.panel.innerHTML = html;
    this.el.panel.classList.toggle('main-menu-panel', isMain);
    this.el.screen.classList.toggle('main-menu-screen', isMain);
    this.el.screen.classList.add('show');
    if (this.onScreenVisibility) this.onScreenVisibility(true);
  }
  hideScreen() {
    this.el.screen.classList.remove('show');
    if (this.onScreenVisibility) this.onScreenVisibility(false);
  }
  setGameplayVisible(v) { this.root.classList.toggle('nogame', !v); }
  update(dt) {
    if (this._msgT > 0) { this._msgT -= dt; if (this._msgT <= 0) { this.el.msg.classList.remove('show'); this.el.msgsub.textContent = ''; } }
    if (this._tipT > 0) { this._tipT -= dt; if (this._tipT <= 0) this.el.tip.classList.remove('show'); }
  }
}

export const KB_KEYS = { fire: 'LMB', aim: 'RMB', block: 'RMB', jump: 'Space', sprint: 'Shift', slide: 'C', dash: 'C', grapple: 'Q', melee: 'F', reload: 'R', grenade: 'G', focus: 'Both Mouse Buttons (or X)', next: 'Scroll', pause: 'Esc', confirm: 'Space', score: 'Tab' };
export const PAD_KEYS = { fire: 'R2', aim: 'L2', block: 'L2', jump: '✕', sprint: 'L3', slide: '○', dash: '○', grapple: 'L1', melee: 'R1', reload: '□', grenade: 'R3', focus: 'L2 + R2', next: '△', pause: 'Options', confirm: '✕', score: 'Create' };
export const TOUCH_KEYS = { fire: 'FIRE Btn', aim: 'AIM Btn', block: 'AIM Btn', jump: 'JUMP', sprint: 'SPRINT', slide: 'SLIDE', dash: 'DASH', grapple: 'GRAPPLE', melee: 'KATANA', reload: 'RELOAD', grenade: 'GRENADE', focus: 'FIRE + AIM', next: '1-4', pause: 'Esc', confirm: 'Tap', score: 'Tab' };

export const CONTROLS_HTML = `
<div class="controls-wrapper" id="controlsWrapper">
  <button type="button" class="controls-toggle" id="controlsToggle">🎮 Show Controls / Help</button>
  <div class="cols" id="controlsCols" style="display:none;">
    <div><div class="colhead">Mouse + Keyboard</div>
      <div><b>WASD</b> Move &nbsp; <b>Mouse</b> Look &nbsp; <b>Shift</b> Sprint</div>
      <div><b>LMB</b> Fire / Slash &nbsp; <b>RMB</b> Aim / Block</div>
      <div><b>Space</b> Jump (wall jump: press again on wall)</div>
      <div>Press <b>Space</b> again in air = Double Jump</div>
      <div><b>C / Ctrl</b> Slide on ground · Dash in air</div>
      <div><b>Q / E</b> Grapple: tap to swing, hold to reel, jump to launch</div>
      <div><b>F</b> Quick Katana &nbsp; <b>R</b> Reload &nbsp; <b>M</b> Music</div>
      <div><b>G</b> Grenade · Hold to throw further</div>
      <div><b>Tab</b> Scoreboard (online) &nbsp; <b>Esc</b> Pause</div>
      <div><b>Both Mouse Buttons</b> Dash Execute when charged</div>
      <div><b>1-4 / Scroll</b> Rifle · Shotgun · Sniper · Katana</div>
    </div>
    <div><div class="colhead">PS5 Controller</div>
      <div><b>Left Stick</b> Move &nbsp; <b>Right Stick</b> Look &nbsp; <b>L3</b> Sprint</div>
      <div><b>R2</b> Fire / Slash &nbsp; <b>L2</b> Aim / Block</div>
      <div><b>✕</b> Jump &nbsp; <b>○</b> Slide · Air Dash</div>
      <div><b>L1</b> Grapple (hold to reel, ✕ to launch)</div>
      <div><b>L2 + R2</b> Dash Execute when charged</div>
      <div><b>R1</b> Quick Katana, auto returns to gun</div>
      <div><b>□</b> Reload &nbsp; <b>△</b> Next Weapon</div>
      <div><b>R3 / D-pad Up</b> Grenade · Hold for distance</div>
      <div><b>Create</b> Scoreboard &nbsp; <b>Options</b> Pause</div>
    </div>
    <div><div class="colhead">📱 Mobile Touch Controls</div>
      <div><b>Left Joystick</b> Move · Drag direction, release to stop</div>
      <div><b>Right Half Drag</b> Look · Fluid follow</div>
      <div><b>🔫 FIRE</b> Fire / Slash · Big red button</div>
      <div><b>◎ AIM</b> Aim / Block</div>
      <div><b>JUMP</b> Jump · <b>SLIDE</b> Slide · <b>SPRINT</b> Sprint</div>
      <div><b>GRAPPLE</b> Grapple · <b>GRENADE</b> Grenade · <b>KATANA</b> Katana</div>
      <div><b>1-4</b> Switch weapons · Bottom center</div>
      <div>Auto-detects touch · No mouse lock needed</div>
    </div>
  </div>
</div>`;
