// Tactical touch controls: floating joystick, aim-while-firing,
// ergonomic thumb layouts, customizable positions, and haptic feedback.

export const BTN_NAMES = {
  joystick: 'Movement Joystick',
  pause: 'Menu / Pause Button',
  sprint: 'Sprint Button',
  dash: 'Dash Button',
  adsfire: '1-Tap ADS Fire Button',
  hipfire: 'Hip Fire Button',
  aim: 'Aim / Scope Button',
  jump: 'Jump Button',
  crouch: 'Slide / Crouch Button',
  reload: 'Reload Button',
  melee: 'Katana / Melee Button',
  grenade: 'Grenade Button',
  grapple: 'Grapple Hook Button',
  weaponbar: 'Weapon Switcher Bar',
  screenshot: 'Screenshot Camera Button'
};

export class MobileControls {
  constructor(canvasOrInput, inputMaybe) {
    const input = inputMaybe || canvasOrInput;
    this.canvas = inputMaybe ? canvasOrInput : null;
    this.input = input;

    this.moveTouchId = null;
    this.lookTouchId = null;
    this.aimLookTouches = new Map(); // touchId -> {x, y} for fire/aim button dragging

    this.moveVector = { x: 0, y: 0 };
    this.lookVector = { x: 0, y: 0 };
    this.lastLookPos = { x: 0, y: 0 };

    this.buttons = {};
    this.buttonTouches = new Map();
    this.buttonTaps = new Set();
    this.isAimLocked = false; // Tactical style sticky ADS toggle
    this.lastTouchTime = 0; // Guard against synthetic mousedown/click events from touches

    this.joystickCenter = { x: 0, y: 0 };
    this.joystickDefault = { x: 0, y: 0 };
    this.joystickRadius = 55;

    this.sens = 1.0;
    this.editMode = false;
    this.dragState = null;
    this.onPause = null;
    this.onScreenshot = null;
    this.onEditExit = null;

    // Load settings
    this.settings = this.loadSettings();
    this.enabled = this.settings.enabled;

    this.createDOM();
    this.applyLayout();
    this.bindEvents();
    this.updateVisibility();
    this.initOrientationCheck();

    if (this.enabled && input && input.requestLock) {
      input.isTouch = true;
      const origRequest = input.requestLock.bind(input);
      const origExit = input.exitLock ? input.exitLock.bind(input) : () => {};
      input.requestLock = () => {
        if (this.isTouchDevice() && this.enabled) return;
        origRequest();
      };
      input.exitLock = () => {
        if (this.isTouchDevice() && this.enabled) return;
        origExit();
      };
    }
    input.mobile = this;
    this.input = input;
  }

  isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(pointer: coarse)').matches;
  }

  loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem('doodle_mobile_settings') || '{}');
      const isTouch = this.isTouchDevice();
      // If version is older than 2, reset layout to default layout
      const layout = (saved.v === 3 && saved.layout) ? saved.layout : {};
      return {
        v: 3,
        enabled: saved.enabled !== undefined ? saved.enabled : isTouch,
        scale: saved.scale || 1.0,
        layout,
        opacity: saved.opacity || 0.92
      };
    } catch {
      return { v: 3, enabled: this.isTouchDevice(), scale: 1.0, layout: {}, opacity: 0.92 };
    }
  }

  saveSettings() {
    localStorage.setItem('doodle_mobile_settings', JSON.stringify(this.settings));
  }

  createDOM() {
    const container = document.createElement('div');
    container.id = 'mobile-controls';
    container.innerHTML = `
      <div id="joy-area">
        <div id="joy-base" class="draggable" data-btn="joystick">
          <div class="joy-sprint-zone">▲ SPRINT</div>
          <div id="joy-stick"></div>
          <span class="edit-label">JOYSTICK</span>
        </div>
      </div>

      <div id="look-area"></div>

      <div id="action-buttons">
        <!-- Top Pause / Menu Button -->
        <button class="mob-btn top-btn draggable" data-action="pause" data-btn="pause" id="btn-pause" title="Menu">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          <span class="edit-label">MENU</span>
        </button>

        <!-- Top Quick Screenshot Button -->
        <button class="mob-btn top-btn draggable" data-action="screenshot" data-btn="screenshot" id="btn-mobile-screenshot" title="Capture Screenshot">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          <span class="edit-label">SCREENSHOT</span>
        </button>

        <!-- Movement Utility Buttons (Left) -->
        <button class="mob-btn small draggable" data-action="sprint" data-btn="sprint" id="btn-sprint">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <i>SPRINT</i><span class="edit-label">SPRINT</span>
        </button>
        <button class="mob-btn small draggable" data-action="dash" data-btn="dash" id="btn-dash">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
          <i>DASH</i><span class="edit-label">DASH</span>
        </button>

        <!-- Tactical Two Fire Buttons -->
        <!-- 1. 1-Tap ADS Fire Button: Aims and fires at the same time -->
        <button class="mob-btn adsfire-btn draggable" data-action="adsfire" data-btn="adsfire" id="btn-ads-fire">
          <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="12" cy="12" r="9"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <line x1="12" y1="1" x2="12" y2="5"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="1" y1="12" x2="5" y2="12"/>
            <line x1="19" y1="12" x2="23" y2="12"/>
          </svg>
          <i class="btn-lbl">ADS FIRE</i>
          <span class="edit-label">ADS FIRE</span>
        </button>

        <!-- 2. Hip Fire Button: Instant hipfire without scoping -->
        <button class="mob-btn hipfire-btn draggable" data-action="hipfire" data-btn="hipfire" id="btn-hip-fire">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 2c-2.2 2.5-3 6-3 10v7c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-7c0-4-.8-7.5-3-10z"/>
            <path d="M6 13l-3 2m0-4l3 2m12-2l3-2m0 4l-3-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <i class="btn-lbl">HIP FIRE</i>
          <span class="edit-label">HIP FIRE</span>
        </button>

        <!-- Aim / Scope Button: Aim down sights without firing -->
        <button class="mob-btn aim-btn draggable" data-action="aim" data-btn="aim" id="btn-aim">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="8"/>
            <line x1="12" y1="2" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
          </svg>
          <i class="btn-lbl">AIM</i>
          <span class="edit-label">AIM</span>
        </button>

        <button class="mob-btn act-btn draggable" data-action="jump" data-btn="jump" id="btn-jump">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 15l-6-6-6 6"/><path d="M18 9l-6-6-6 6"/></svg>
          <i>JUMP</i><span class="edit-label">JUMP</span>
        </button>

        <button class="mob-btn act-btn draggable" data-action="crouch" data-btn="crouch" id="btn-crouch">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M6 9l6 6 6-6"/><path d="M6 15l6 6 6-6"/></svg>
          <i>SLIDE</i><span class="edit-label">SLIDE</span>
        </button>

        <button class="mob-btn act-btn draggable" data-action="reload" data-btn="reload" id="btn-reload">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73.81"/></svg>
          <i>RELOAD</i><span class="edit-label">RELOAD</span>
        </button>

        <button class="mob-btn util-btn draggable" data-action="melee" data-btn="melee" id="btn-melee">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="19" y1="5" x2="5" y2="19"/><polyline points="15 5 19 5 19 9"/><polyline points="5 15 5 19 9 19"/></svg>
          <i>KATANA</i><span class="edit-label">KATANA</span>
        </button>

        <button class="mob-btn util-btn draggable" data-action="grenade" data-btn="grenade" id="btn-grenade">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="10" y="2" width="4" height="3" rx="1"/><circle cx="12" cy="14" r="7"/><line x1="12" y1="7" x2="12" y2="21"/><line x1="5" y1="14" x2="19" y2="14"/></svg>
          <i>GRENADE</i><span class="edit-label">GRENADE</span>
        </button>

        <button class="mob-btn util-btn draggable" data-action="grapple" data-btn="grapple" id="btn-grapple">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="21"/><path d="M5 14c0 3.87 3.13 7 7 7s7-3.13 7-7"/></svg>
          <i>GRAPPLE</i><span class="edit-label">GRAPPLE</span>
        </button>
      </div>

      <!-- Bottom Weapon Switcher Bar -->
      <div id="mob-weapon-bar" class="draggable" data-btn="weaponbar">
        <span class="edit-label">WEAPON BAR</span>
        <button class="mob-wep-btn active" data-action="slot1" id="btn-wep-1" title="Assault Rifle">
          <div class="wep-meta"><span class="wep-slot">1</span><span class="wep-name">RIFLE</span></div>
          <svg class="wep-icon" viewBox="0 0 70 28">
            <path d="M4 17 L12 17 L15 13 L28 13 L30 11 L48 11 L48 13 L64 13 L64 15 L48 15 L48 17 L36 17 L34 23 L28 23 L30 17 L22 17 L16 23 L10 23 L12 17 L4 17 Z" fill="currentColor"/>
            <rect x="64" y="13.5" width="4" height="2" fill="currentColor"/>
            <rect x="32" y="9" width="10" height="2" rx="0.5" fill="currentColor"/>
            <rect x="23" y="17" width="2" height="3" fill="currentColor"/>
          </svg>
        </button>
        <button class="mob-wep-btn" data-action="slot2" id="btn-wep-2" title="Pump Shotgun">
          <div class="wep-meta"><span class="wep-slot">2</span><span class="wep-name">SHOTGUN</span></div>
          <svg class="wep-icon" viewBox="0 0 70 28">
            <path d="M4 18 L12 18 L16 15 L32 15 L66 15 L66 17 L32 17 L32 19 L62 19 L62 20 L32 20 L30 22 L20 22 L22 18 L12 18 L6 22 L4 22 Z" fill="currentColor"/>
            <rect x="38" y="18" width="12" height="4" rx="1" fill="currentColor"/>
          </svg>
        </button>
        <button class="mob-wep-btn" data-action="slot3" id="btn-wep-3" title="Sniper Rifle">
          <div class="wep-meta"><span class="wep-slot">3</span><span class="wep-name">SNIPER</span></div>
          <svg class="wep-icon" viewBox="0 0 70 28">
            <path d="M4 17 L14 17 L18 14 L30 14 L68 14 L68 16 L30 16 L28 22 L24 22 L26 16 L18 16 L12 21 L6 21 Z" fill="currentColor"/>
            <path d="M22 10 L42 10 L44 8 L48 8 L48 12 L44 12 L42 10 Z" fill="currentColor"/>
            <rect x="25" y="8" width="5" height="4" fill="currentColor"/>
            <rect x="31" y="10" width="8" height="2" fill="currentColor"/>
            <rect x="27" y="12" width="2" height="2" fill="currentColor"/>
            <rect x="39" y="12" width="2" height="2" fill="currentColor"/>
            <rect x="67" y="13" width="3" height="4" rx="0.5" fill="currentColor"/>
          </svg>
        </button>
        <button class="mob-wep-btn" data-action="slot4" id="btn-wep-4" title="Katana Blade">
          <div class="wep-meta"><span class="wep-slot">4</span><span class="wep-name">KATANA</span></div>
          <svg class="wep-icon" viewBox="0 0 70 28">
            <path d="M20 14 Q40 13 62 10 Q66 10 68 11 Q63 15 40 16 Q20 16 20 16 Z" fill="currentColor"/>
            <ellipse cx="20" cy="15" rx="1.5" ry="5" fill="currentColor"/>
            <path d="M6 17 L19 15 L19 16 L6 18 Z" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
            <rect x="20" y="13.5" width="2.5" height="3" fill="#e62238"/>
          </svg>
        </button>
      </div>

      <div id="edit-overlay">
        <div class="edit-header">
          <div class="edit-title-row">
            <h3>🎮 Customize Layout</h3>
            <span id="edit-selected-name">No button selected <span class="subtle">(Tap any button to select & resize)</span></span>
          </div>
          <div class="edit-actions">
            <button id="edit-scale-down" type="button" title="Make selected button smaller">A- Size</button>
            <button id="edit-scale-up" type="button" title="Make selected button larger">A+ Size</button>
            <button id="edit-reset-btn" type="button" title="Reset selected button to default" disabled>Reset Selected</button>
            <button id="edit-reset" type="button" title="Reset all buttons to default">Reset All</button>
            <button id="edit-save" type="button" class="primary">Save & Done</button>
          </div>
        </div>
        <div class="edit-footer">
          <span>👆 Drag any button or joystick to reposition</span>
          <span>• Tap to select & use A- / A+ to scale</span>
          <span>• Layout saved automatically</span>
        </div>
      </div>
    `;

    document.body.appendChild(container);
    this.dom = {
      container,
      base: container.querySelector('#joy-base'),
      stick: container.querySelector('#joy-stick'),
      joyArea: container.querySelector('#joy-area'),
      lookArea: container.querySelector('#look-area'),
      weaponBar: container.querySelector('#mob-weapon-bar'),
      editOverlay: container.querySelector('#edit-overlay')
    };

    this.recordDefaultJoystick();
  }

  recordDefaultJoystick() {
    requestAnimationFrame(() => {
      if (!this.dom || !this.dom.base) return;
      const rect = this.dom.base.getBoundingClientRect();
      this.joystickDefault.x = rect.left + rect.width / 2;
      this.joystickDefault.y = rect.top + rect.height / 2;
      this.joystickCenter.x = this.joystickDefault.x;
      this.joystickCenter.y = this.joystickDefault.y;
    });
  }

  applyLayout() {
    this.dom.container.style.setProperty('--global-scale', this.settings.scale);

    const allDraggables = this.dom.container.querySelectorAll('.draggable');
    allDraggables.forEach(el => {
      const btnId = el.dataset.btn;
      const layout = this.settings.layout && this.settings.layout[btnId];
      if (layout) {
        if (layout.x !== undefined) {
          el.style.setProperty('left', layout.x + '%', 'important');
          el.style.setProperty('right', 'auto', 'important');
        } else {
          el.style.removeProperty('left');
          el.style.removeProperty('right');
        }
        if (layout.y !== undefined) {
          el.style.setProperty('top', layout.y + '%', 'important');
          el.style.setProperty('bottom', 'auto', 'important');
        } else {
          el.style.removeProperty('top');
          el.style.removeProperty('bottom');
        }
        if (layout.scale !== undefined) {
          el.style.setProperty('transform', `scale(${layout.scale})`, 'important');
        } else {
          el.style.removeProperty('transform');
        }
        if (layout.x !== undefined || layout.y !== undefined) {
          el.style.setProperty('position', 'absolute', 'important');
        }
      } else {
        el.style.removeProperty('left');
        el.style.removeProperty('top');
        el.style.removeProperty('right');
        el.style.removeProperty('bottom');
        el.style.removeProperty('transform');
        el.style.removeProperty('position');
      }
    });
    this.recordDefaultJoystick();
  }

  resetTouches() {
    this.moveTouchId = null;
    this.lookTouchId = null;
    this.aimLookTouches.clear();
    this.moveVector.x = 0;
    this.moveVector.y = 0;
    this.lookVector.x = 0;
    this.lookVector.y = 0;
    this.buttonTouches.clear();
    this.buttonTaps.clear();
    for (const k in this.buttons) {
      if (k === 'aim' && this.isAimLocked) continue;
      this.buttons[k] = false;
    }
    if (this.dom && this.dom.container) {
      this.dom.container.querySelectorAll('.pressed').forEach(el => {
        if (el.dataset.action === 'aim' && this.isAimLocked) return;
        el.classList.remove('pressed');
      });
      if (this.dom.base) this.dom.base.classList.remove('active', 'sprinting');
      if (this.dom.stick) this.dom.stick.style.transform = 'translate(0px, 0px)';
    }
  }

  setGameplayActive(active) {
    this.gameplayActive = active;
    if (!this.dom || !this.dom.container) return;
    if (active && this.settings.enabled) {
      this.dom.container.classList.remove('menu-active');
      this.dom.container.style.display = 'block';
    } else {
      this.cancelAim();
      this.dom.container.classList.add('menu-active');
      this.dom.container.style.display = 'none';
      this.resetTouches();
    }
  }

  updateVisibility() {
    if (this.settings.enabled) {
      this.dom.container.classList.add('show');
      this.dom.container.classList.remove('disabled');
      if (this.gameplayActive === false) {
        this.dom.container.classList.add('menu-active');
        this.dom.container.style.display = 'none';
      } else {
        this.dom.container.classList.remove('menu-active');
        this.dom.container.style.display = 'block';
      }
    } else {
      this.dom.container.classList.remove('show');
      this.dom.container.classList.add('disabled');
      this.dom.container.style.display = 'none';
    }
  }

  setEnabled(enabled) {
    this.settings.enabled = enabled;
    this.saveSettings();
    this.updateVisibility();
    this.input.isTouch = enabled;
  }

  setSens(sensPercent) {
    this.sens = Math.max(0.2, Math.min(3.0, (sensPercent || 100) / 100));
  }

  setScale(scale) {
    this.settings.scale = Math.max(0.6, Math.min(1.6, scale));
    this.saveSettings();
    this.applyLayout();
  }

  setGlobalScale(percent) {
    const s = Math.max(0.6, Math.min(1.6, percent / 100));
    this.settings.scale = s;
    this.saveSettings();
    this.applyLayout();
  }

  toggleEdit(onExit) {
    if (this.editMode) this.exitEditMode();
    else this.enterEditMode(onExit);
  }

  enterEditMode(onExit) {
    this.onEditExit = onExit || null;
    this.editMode = true;
    this.dom.container.classList.add('edit-mode', 'show');
    this.dom.container.classList.remove('disabled');
    this.dom.editOverlay.style.display = 'block';
    this.selectedBtn = null;
    this.applyLayout();
    this.updateSelectionUI();
  }

  exitEditMode() {
    this.editMode = false;
    this.dom.container.classList.remove('edit-mode');
    this.dom.editOverlay.style.display = 'none';
    if (this.selectedBtn) {
      this.selectedBtn.classList.remove('selected', 'dragging');
      this.selectedBtn = null;
    }
    this.saveSettings();
    this.applyLayout();
    this.recordDefaultJoystick();
    this.updateVisibility();
    if (this.onEditExit) {
      const cb = this.onEditExit;
      this.onEditExit = null;
      cb();
    }
  }

  resetSelected() {
    if (!this.selectedBtn) return;
    const btnId = this.selectedBtn.dataset.btn;
    if (this.settings.layout && this.settings.layout[btnId]) {
      delete this.settings.layout[btnId];
      this.saveSettings();
    }
    this.selectedBtn.style.removeProperty('left');
    this.selectedBtn.style.removeProperty('top');
    this.selectedBtn.style.removeProperty('right');
    this.selectedBtn.style.removeProperty('bottom');
    this.selectedBtn.style.removeProperty('transform');
    this.selectedBtn.style.removeProperty('position');
    this.recordDefaultJoystick();
    this.updateSelectionUI();
  }

  resetLayout() {
    this.settings.layout = {};
    this.settings.scale = 1.0;
    this.saveSettings();
    const allDraggables = this.dom.container.querySelectorAll('.draggable');
    allDraggables.forEach(el => {
      el.style.removeProperty('left');
      el.style.removeProperty('top');
      el.style.removeProperty('right');
      el.style.removeProperty('bottom');
      el.style.removeProperty('transform');
      el.style.removeProperty('position');
      el.classList.remove('selected', 'dragging');
    });
    this.selectedBtn = null;
    this.applyLayout();
    this.recordDefaultJoystick();
    this.updateSelectionUI();
  }

  updateSelectionUI() {
    const label = document.getElementById('edit-selected-name');
    const resetBtn = document.getElementById('edit-reset-btn');
    if (!label) return;
    if (!this.selectedBtn) {
      label.innerHTML = 'No button selected <span class="subtle">(Tap any button to select & resize)</span>';
      if (resetBtn) resetBtn.disabled = true;
      return;
    }
    const btnId = this.selectedBtn.dataset.btn;
    const name = BTN_NAMES[btnId] || btnId;
    const custom = (this.settings.layout && this.settings.layout[btnId]) || {};
    const scaleVal = custom.scale !== undefined ? custom.scale : this.settings.scale;
    const scalePct = Math.round(scaleVal * 100);
    const posText = (custom.x !== undefined && custom.y !== undefined) ? `at (${custom.x}%, ${custom.y}%)` : 'default position';
    label.innerHTML = `Selected: <b>${name}</b> • Size: <b>${scalePct}%</b> • ${posText}`;
    if (resetBtn) resetBtn.disabled = false;
  }

  vibrate(ms = 15) {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(ms);
      }
    } catch (_) {}
  }

  setActiveWeapon(index) {
    if (this._lastWepIndex === index) return;
    this._lastWepIndex = index;
    if (!this._wepButtons) {
      this._wepButtons = Array.from(this.dom.container.querySelectorAll('.mob-wep-btn'));
    }
    for (let i = 0; i < this._wepButtons.length; i++) {
      this._wepButtons[i].classList.toggle('active', i === index);
    }
  }

  applyLookDelta(dx, dy) {
    // Standard mobile touch camera:
    // Swipe Right -> camera turns Right (dx > 0 => yaw decreases => -dx)
    // Swipe Left  -> camera turns Left  (dx < 0 => yaw increases => -dx)
    // Swipe Up    -> camera looks Up   (dy < 0 => pitch increases => -dy)
    // Swipe Down  -> camera looks Down (dy > 0 => pitch decreases => -dy)
    const baseSens = 0.0028 * this.sens;
    const dist = Math.hypot(dx, dy);
    // Dynamic acceleration: smooth micro-aiming, crisp fast 180 turns
    const accel = dist > 14 ? 1.22 : (dist > 6 ? 1.08 : 1.0);

    this.lookVector.x -= dx * baseSens * accel;
    this.lookVector.y -= dy * baseSens * accel;
  }

  bindEvents() {
    const joyArea = this.dom.joyArea;

    // Floating Joystick: anchors wherever left thumb touches down
    joyArea.addEventListener('touchstart', (e) => {
      if (this.editMode) return;
      e.preventDefault();
      for (const touch of e.changedTouches) {
        if (this.moveTouchId === null && touch.clientX < window.innerWidth * 0.48) {
          this.moveTouchId = touch.identifier;
          // Dynamically position joystick base under thumb
          this.joystickCenter.x = touch.clientX;
          this.joystickCenter.y = touch.clientY;
          this.dom.base.style.left = touch.clientX + 'px';
          this.dom.base.style.top = touch.clientY + 'px';
          this.dom.base.style.right = 'auto';
          this.dom.base.style.bottom = 'auto';
          this.dom.base.style.transform = `translate(-50%, -50%) scale(${this.settings.scale})`;
          this.dom.base.classList.add('active');

          this.handleMoveTouch(touch);
        }
      }
    }, { passive: false });

    joyArea.addEventListener('touchmove', (e) => {
      if (this.editMode) return;
      e.preventDefault();
      for (const touch of e.changedTouches) {
        if (touch.identifier === this.moveTouchId) {
          this.handleMoveTouch(touch);
        }
      }
    }, { passive: false });

    const endMove = (e) => {
      if (this.editMode) return;
      for (const touch of e.changedTouches) {
        if (touch.identifier === this.moveTouchId) {
          this.moveTouchId = null;
          this.moveVector.x = 0;
          this.moveVector.y = 0;
          this.buttons.sprint = false;
          this.dom.stick.style.transform = 'translate(-50%, -50%)';
          this.dom.base.classList.remove('active');
          this.dom.base.classList.remove('sprinting');

          // Reset back to resting position smoothly
          const joyLayout = this.settings.layout && this.settings.layout['joystick'];
          if (joyLayout && joyLayout.x !== undefined && joyLayout.y !== undefined) {
            this.dom.base.style.setProperty('left', joyLayout.x + '%', 'important');
            this.dom.base.style.setProperty('top', joyLayout.y + '%', 'important');
            this.dom.base.style.setProperty('right', 'auto', 'important');
            this.dom.base.style.setProperty('bottom', 'auto', 'important');
            this.dom.base.style.setProperty('position', 'absolute', 'important');
            if (joyLayout.scale !== undefined) {
              this.dom.base.style.setProperty('transform', `scale(${joyLayout.scale})`, 'important');
            } else {
              this.dom.base.style.removeProperty('transform');
            }
          } else {
            this.dom.base.style.removeProperty('left');
            this.dom.base.style.removeProperty('top');
            this.dom.base.style.removeProperty('right');
            this.dom.base.style.removeProperty('bottom');
            this.dom.base.style.removeProperty('transform');
            this.dom.base.style.removeProperty('position');
          }
          this.recordDefaultJoystick();
        }
      }
    };
    joyArea.addEventListener('touchend', endMove, { passive: false });
    joyArea.addEventListener('touchcancel', endMove, { passive: false });

    // Look Area (Right screen swipe)
    const lookArea = this.dom.lookArea;
    lookArea.addEventListener('touchstart', (e) => {
      if (this.editMode) return;
      e.preventDefault();
      for (const touch of e.changedTouches) {
        if (this.lookTouchId === null && touch.clientX > window.innerWidth * 0.35) {
          if (touch.target.closest('.mob-btn') || touch.target.closest('.mob-wep-btn')) continue;
          this.lookTouchId = touch.identifier;
          this.lastLookPos.x = touch.clientX;
          this.lastLookPos.y = touch.clientY;
        }
      }
    }, { passive: false });

    lookArea.addEventListener('touchmove', (e) => {
      if (this.editMode) return;
      e.preventDefault();
      for (const touch of e.changedTouches) {
        if (touch.identifier === this.lookTouchId) {
          const dx = touch.clientX - this.lastLookPos.x;
          const dy = touch.clientY - this.lastLookPos.y;
          this.applyLookDelta(dx, dy);
          this.lastLookPos.x = touch.clientX;
          this.lastLookPos.y = touch.clientY;
        }
      }
    }, { passive: false });

    const endLook = (e) => {
      if (this.editMode) return;
      for (const touch of e.changedTouches) {
        if (touch.identifier === this.lookTouchId) this.lookTouchId = null;
      }
    };
    lookArea.addEventListener('touchend', endLook, { passive: false });
    lookArea.addEventListener('touchcancel', endLook, { passive: false });

    // Bind action and weapon buttons
    const allButtons = this.dom.container.querySelectorAll('.mob-btn, .mob-wep-btn');
    allButtons.forEach(btn => {
      const action = btn.dataset.action;

      btn.addEventListener('touchstart', (e) => {
        if (this.editMode) {
          e.preventDefault();
          e.stopPropagation();
          this.startDrag(btn, e.changedTouches[0]);
          this.selectButton(btn);
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        this.lastTouchTime = Date.now();

        for (const touch of e.changedTouches) {
          this.buttonTouches.set(touch.identifier, action);

          // Tactical Aim-while-firing & Aim-while-aiming
          if (action === 'fire' || action === 'aim' || action === 'adsfire' || action === 'hipfire') {
            this.aimLookTouches.set(touch.identifier, { x: touch.clientX, y: touch.clientY });
          }
        }

        // Tactical Aim Toggle (Sticky ADS)
        if (action === 'aim') {
          this.toggleAim();
          btn.classList.add('pressed');
          return;
        }

        // Auto-cancel ADS when sprinting or switching weapon
        if (action === 'sprint' || action.startsWith('slot') || action === 'melee') {
          if (this.isAimLocked) this.cancelAim();
        }

        if (action === 'pause') {
          this.vibrate(20);
          if (this.onPause) this.onPause();
          return;
        }

        if (action === 'screenshot') {
          this.vibrate(25);
          if (this.onScreenshot) this.onScreenshot();
          return;
        }

        this.buttons[action] = true;
        this.buttonTaps.add(action);
        btn.classList.add('pressed');
        this.vibrate(action === 'adsfire' || action === 'hipfire' || action === 'fire' ? 18 : 10);
      }, { passive: false });

      btn.addEventListener('touchmove', (e) => {
        if (this.editMode) return;
        // Drag-to-aim while holding Fire or Aim button
        for (const touch of e.changedTouches) {
          if (this.aimLookTouches.has(touch.identifier)) {
            const last = this.aimLookTouches.get(touch.identifier);
            const dx = touch.clientX - last.x;
            const dy = touch.clientY - last.y;
            this.applyLookDelta(dx, dy);
            last.x = touch.clientX;
            last.y = touch.clientY;
          }
        }
      }, { passive: false });

      const endBtnTouch = (e) => {
        if (this.editMode) {
          this.endDrag(e);
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        this.lastTouchTime = Date.now();

        for (const touch of e.changedTouches) {
          this.buttonTouches.delete(touch.identifier);
          this.aimLookTouches.delete(touch.identifier);
        }

        let stillPressed = false;
        for (const [, act] of this.buttonTouches) {
          if (act === action) stillPressed = true;
        }

        if (!stillPressed) {
          btn.classList.remove('pressed');
          if (action !== 'aim' || !this.isAimLocked) {
            this.buttons[action] = false;
          }
        }
      };

      btn.addEventListener('touchend', endBtnTouch, { passive: false });
      btn.addEventListener('touchcancel', endBtnTouch, { passive: false });

      // Desktop mouse fallback for testing
      btn.addEventListener('mousedown', (e) => {
        if (this.editMode) return;
        // Prevent synthetic mouse events triggered shortly after touch
        if (Date.now() - this.lastTouchTime < 650) return;
        e.preventDefault();
        e.stopPropagation();

        if (action === 'pause') {
          if (this.onPause) this.onPause();
          return;
        }
        if (action === 'screenshot') {
          if (this.onScreenshot) this.onScreenshot();
          return;
        }
        if (action === 'aim') {
          this.toggleAim();
          return;
        }
        if (action === 'sprint' || action.startsWith('slot') || action === 'melee') {
          if (this.isAimLocked) this.cancelAim();
        }
        this.buttons[action] = true;
        this.buttonTaps.add(action);
        btn.classList.add('pressed');
      });

      btn.addEventListener('mouseup', (e) => {
        if (this.editMode) return;
        if (Date.now() - this.lastTouchTime < 650) return;
        btn.classList.remove('pressed');
        if (action !== 'aim' || !this.isAimLocked) {
          this.buttons[action] = false;
        }
      });

      btn.addEventListener('mouseleave', (e) => {
        if (this.editMode || this.dragState) return;
        btn.classList.remove('pressed');
        if (action !== 'aim' || !this.isAimLocked) {
          this.buttons[action] = false;
        }
      });
    });

    // Bind ALL draggable elements uniformly for Edit Mode (Touch + Mouse)
    const draggables = this.dom.container.querySelectorAll('.draggable');
    draggables.forEach(el => {
      el.addEventListener('touchstart', (e) => {
        if (!this.editMode) return;
        e.preventDefault();
        e.stopPropagation();
        this.selectButton(el);
        this.startDrag(el, e.changedTouches[0]);
      }, { passive: false });

      el.addEventListener('mousedown', (e) => {
        if (!this.editMode) return;
        e.preventDefault();
        e.stopPropagation();
        this.selectButton(el);
        this.startDrag(el, e);
      });
    });

    // Window-level move handlers so dragging never drops when moving quickly
    const handleMoveAll = (e) => {
      if (!this.editMode || !this.dragState) return;
      if (e.type === 'touchmove') {
        e.preventDefault();
        for (const touch of e.changedTouches) {
          if (touch.identifier === this.dragState.touchId) this.handleDrag(touch);
        }
      } else if (e.type === 'mousemove' && this.dragState.touchId === 'mouse') {
        e.preventDefault();
        this.handleDrag(e);
      }
    };
    window.addEventListener('touchmove', handleMoveAll, { passive: false });
    window.addEventListener('mousemove', handleMoveAll);

    // Window-level release handlers
    const handleEndAll = (e) => {
      if (!this.editMode || !this.dragState) return;
      if (e.type === 'touchend' || e.type === 'touchcancel') {
        for (const touch of e.changedTouches) {
          if (touch.identifier === this.dragState.touchId) this.endDrag(e);
        }
      } else if (this.dragState.touchId === 'mouse') {
        this.endDrag(e);
      }
    };
    window.addEventListener('touchend', handleEndAll, { passive: false });
    window.addEventListener('touchcancel', handleEndAll, { passive: false });
    window.addEventListener('mouseup', handleEndAll);

    // Edit overlay controls
    document.getElementById('edit-scale-down')?.addEventListener('click', () => this.scaleSelected(-0.1));
    document.getElementById('edit-scale-up')?.addEventListener('click', () => this.scaleSelected(0.1));
    document.getElementById('edit-reset-btn')?.addEventListener('click', () => this.resetSelected());
    document.getElementById('edit-reset')?.addEventListener('click', () => this.resetLayout());
    document.getElementById('edit-save')?.addEventListener('click', () => this.exitEditMode());

    // Window resize
    window.addEventListener('resize', () => {
      this.recordDefaultJoystick();
    });
  }

  // Tactical Aim Visual Toggle (Red 'X' Button)
  updateAimButtonVisual(locked) {
    const btn = this.dom.container?.querySelector('#btn-aim');
    if (!btn) return;
    btn.classList.toggle('aim-locked', locked);
    this.dom.container?.classList.toggle('in-ads', locked);
    if (locked) {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
        <i class="btn-lbl" style="color:#ffffff;font-weight:900;letter-spacing:0.5px;">CANCEL</i>
        <span class="edit-label">AIM</span>
      `;
    } else {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="8"/>
          <line x1="12" y1="2" x2="12" y2="22"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
        </svg>
        <i class="btn-lbl">AIM</i>
        <span class="edit-label">AIM</span>
      `;
    }
  }

  setAimLocked(locked) {
    this.isAimLocked = !!locked;
    this.buttons['aim'] = !!locked;
    this.updateAimButtonVisual(!!locked);
    if (this.input && this.input.stickyAimActive !== !!locked) {
      this.input.stickyAimActive = !!locked;
    }
  }

  cancelAim() {
    if (!this.isAimLocked && (!this.input || !this.input.stickyAimActive)) return;
    this.isAimLocked = false;
    this.buttons['aim'] = false;
    this.updateAimButtonVisual(false);
    if (this.input) {
      this.input.stickyAimActive = false;
    }
  }

  toggleAim() {
    if (this.isAimLocked) {
      this.cancelAim();
      this.vibrate(14);
    } else {
      this.setAimLocked(true);
      this.buttonTaps.add('aim');
      this.vibrate(18);
    }
  }

  handleMoveTouch(touch) {
    const dx = touch.clientX - this.joystickCenter.x;
    const dy = touch.clientY - this.joystickCenter.y;
    const dist = Math.hypot(dx, dy);
    const maxDist = this.joystickRadius;

    let nx = dx / maxDist;
    let ny = dy / maxDist;

    if (dist > maxDist) {
      const angle = Math.atan2(dy, dx);
      nx = Math.cos(angle);
      ny = Math.sin(angle);
    }

    this.moveVector.x = nx;
    this.moveVector.y = -ny;

    // Auto-Sprint: pushing joystick firmly up activates sprint
    const isPushingForward = ny < -0.75 && Math.abs(nx) < 0.65;
    if (isPushingForward) {
      this.buttons.sprint = true;
      this.dom.base.classList.add('sprinting');
    } else {
      this.buttons.sprint = false;
      this.dom.base.classList.remove('sprinting');
    }

    const stickDist = Math.min(dist, maxDist);
    const stickAngle = Math.atan2(dy, dx);
    const sx = Math.cos(stickAngle) * stickDist;
    const sy = Math.sin(stickAngle) * stickDist;
    this.dom.stick.style.transform = `translate(calc(-50% + ${sx}px), calc(-50% + ${sy}px))`;
  }

  selectButton(btn) {
    if (this.selectedBtn) this.selectedBtn.classList.remove('selected');
    this.selectedBtn = btn;
    if (btn) btn.classList.add('selected');
    this.updateSelectionUI();
  }

  startDrag(btn, touchOrMouse) {
    const rect = btn.getBoundingClientRect();
    const isTouch = touchOrMouse.identifier !== undefined;
    const clientX = touchOrMouse.clientX;
    const clientY = touchOrMouse.clientY;

    this.dragState = {
      btn,
      btnId: btn.dataset.btn,
      touchId: isTouch ? touchOrMouse.identifier : 'mouse',
      startX: clientX,
      startY: clientY,
      origLeft: rect.left,
      origTop: rect.top,
      btnWidth: rect.width || btn.offsetWidth || 50,
      btnHeight: rect.height || btn.offsetHeight || 50
    };
    btn.classList.add('dragging');
  }

  handleDrag(touchOrMouse) {
    if (!this.dragState) return;
    const dx = touchOrMouse.clientX - this.dragState.startX;
    const dy = touchOrMouse.clientY - this.dragState.startY;
    const btn = this.dragState.btn;
    const btnId = this.dragState.btnId;

    const newLeft = this.dragState.origLeft + dx;
    const newTop = this.dragState.origTop + dy;

    const btnWidth = this.dragState.btnWidth;
    const btnHeight = this.dragState.btnHeight;

    // Clamp coordinates safely within the visible window (below the header)
    const clampedX = Math.max(2, Math.min(window.innerWidth - btnWidth - 2, newLeft));
    const clampedY = Math.max(48, Math.min(window.innerHeight - btnHeight - 2, newTop));

    const xPercent = Number(((clampedX / window.innerWidth) * 100).toFixed(2));
    const yPercent = Number(((clampedY / window.innerHeight) * 100).toFixed(2));

    btn.style.setProperty('left', xPercent + '%', 'important');
    btn.style.setProperty('top', yPercent + '%', 'important');
    btn.style.setProperty('right', 'auto', 'important');
    btn.style.setProperty('bottom', 'auto', 'important');
    btn.style.setProperty('position', 'absolute', 'important');

    if (!this.settings.layout[btnId]) this.settings.layout[btnId] = {};
    this.settings.layout[btnId].x = xPercent;
    this.settings.layout[btnId].y = yPercent;
  }

  endDrag(e) {
    if (!this.dragState) return;
    const btn = this.dragState.btn;
    btn.classList.remove('dragging');
    this.dragState = null;
    this.saveSettings();
    this.recordDefaultJoystick();
    this.updateSelectionUI();
  }

  scaleSelected(delta) {
    if (!this.selectedBtn) {
      this.setScale(this.settings.scale + delta);
      this.updateSelectionUI();
      return;
    }
    const btnId = this.selectedBtn.dataset.btn;
    if (!this.settings.layout[btnId]) this.settings.layout[btnId] = {};
    const current = this.settings.layout[btnId].scale !== undefined ? this.settings.layout[btnId].scale : this.settings.scale;
    const newScale = Math.max(0.5, Math.min(2.2, Number((current + delta).toFixed(2))));
    this.settings.layout[btnId].scale = newScale;
    this.selectedBtn.style.setProperty('transform', `scale(${newScale})`, 'important');
    this.saveSettings();
    this.updateSelectionUI();
  }

  getMove() { return this.moveVector; }

  getLook() {
    const l = { x: this.lookVector.x, y: this.lookVector.y };
    this.lookVector.x = 0;
    this.lookVector.y = 0;
    return l;
  }

  initOrientationCheck() {
    let prompt = document.getElementById('portrait-prompt');
    if (!prompt) {
      prompt = document.createElement('div');
      prompt.id = 'portrait-prompt';
      prompt.innerHTML = `
        <div class="portrait-card">
          <div class="phone-rotate-icon">📱↻</div>
          <h2>Rotate to Landscape</h2>
          <p>Touch controls require landscape mode. Please turn your phone sideways.</p>
          <button type="button" id="btn-portrait-dismiss">Continue in Portrait</button>
        </div>
      `;
      document.body.appendChild(prompt);

      let dismissed = false;
      const dismissBtn = prompt.querySelector('#btn-portrait-dismiss');
      if (dismissBtn) {
        dismissBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          dismissed = true;
          prompt.classList.remove('show');
        });
      }

      const check = () => {
        if (!this.enabled || !this.isTouchDevice()) {
          prompt.classList.remove('show');
          return;
        }
        const isPortrait = window.innerHeight > window.innerWidth;
        if (isPortrait) {
          if (!dismissed) prompt.classList.add('show');
        } else {
          dismissed = false;
          prompt.classList.remove('show');
        }
        this.recordDefaultJoystick();
      };

      window.addEventListener('resize', check);
      window.addEventListener('orientationchange', check);
      if (window.screen && window.screen.orientation) {
        window.screen.orientation.addEventListener('change', check);
      }
      check();
    }
  }

  getButton(action) {
    const isDown = !!this.buttons[action];
    const wasTapped = this.buttonTaps.has(action);
    if (wasTapped) this.buttonTaps.delete(action);
    return isDown || wasTapped;
  }
}
