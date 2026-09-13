// verify_hud.mjs - Comprehensive verification for HUD & Wave Card formatting and stability
import assert from 'node:assert';
import fs from 'node:fs';

console.log('=== RUNNING HUD & WAVE CARD VERIFICATION SUITE ===\n');

// Mock a lightweight DOM environment for Node.js
class MockElement {
  constructor(tag, id = '', className = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.className = className;
    this.classList = {
      _classes: new Set(className ? className.split(/\s+/).filter(Boolean) : []),
      add(...cls) { cls.forEach(c => this._classes.add(c)); },
      remove(...cls) { cls.forEach(c => this._classes.delete(c)); },
      toggle(cls, force) {
        if (force === undefined) {
          if (this._classes.has(cls)) this._classes.delete(cls);
          else this._classes.add(cls);
        } else if (force) this._classes.add(cls);
        else this._classes.delete(cls);
      },
      contains(cls) { return this._classes.has(cls); }
    };
    this.children = [];
    this.parentElement = null;
    this._textContent = '';
    this.hidden = false;
    this.style = {
      setProperty: () => {},
      transform: '',
      height: '',
      width: ''
    };
    this._listeners = {};
  }

  get textContent() {
    if (this.children.length > 0) {
      return this.children.map(c => c.textContent).join('');
    }
    return this._textContent;
  }
  set textContent(v) {
    this._textContent = String(v);
    this.children = [];
  }

  get innerHTML() {
    return this.children.map(c => `<${c.tagName.toLowerCase()} id="${c.id}" class="${c.className}">${c.textContent}</${c.tagName.toLowerCase()}>`).join('');
  }
  set innerHTML(html) {
    this.children = parseSimpleHTML(html, this);
    this._textContent = '';
  }

  get offsetWidth() { return 100; }

  addEventListener(evt, fn) {
    if (!this._listeners[evt]) this._listeners[evt] = [];
    this._listeners[evt].push(fn);
  }

  querySelector(sel) {
    const all = this.querySelectorAll(sel);
    return all.length ? all[0] : null;
  }

  querySelectorAll(sel) {
    const results = [];
    const check = (el) => {
      let match = false;
      if (sel.startsWith('#') && el.id === sel.slice(1)) match = true;
      else if (sel.startsWith('.') && el.classList.contains(sel.slice(1))) match = true;
      else if (el.tagName.toLowerCase() === sel.toLowerCase()) match = true;

      if (match) results.push(el);
      for (const child of el.children) check(child);
    };
    for (const child of this.children) check(child);
    return results;
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }
}

function parseSimpleHTML(html, parent) {
  const root = new MockElement('root');
  const stack = [root];

  const tokenRegex = /<\/?([a-z0-9]+)([^>]*)>|([^<]+)/gi;
  let match;
  while ((match = tokenRegex.exec(html)) !== null) {
    const [full, tag, attrs, text] = match;
    if (text) {
      const clean = text.trim();
      if (clean && stack.length) {
        stack[stack.length - 1]._textContent += clean;
      }
    } else if (tag) {
      if (full.startsWith('</')) {
        // Closing tag
        if (stack.length > 1 && stack[stack.length - 1].tagName.toLowerCase() === tag.toLowerCase()) {
          stack.pop();
        }
      } else {
        // Opening tag
        const idMatch = /id=["']([^"']+)["']/i.exec(attrs || '');
        const classMatch = /class=["']([^"']+)["']/i.exec(attrs || '');
        const hiddenMatch = /hidden/i.exec(attrs || '');

        const el = new MockElement(tag, idMatch ? idMatch[1] : '', classMatch ? classMatch[1] : '');
        if (hiddenMatch) el.hidden = true;

        stack[stack.length - 1].appendChild(el);
        // Self closing tags or void tags
        const isSelfClosing = full.endsWith('/>') || ['i', 'br', 'hr', 'img', 'input'].includes(tag.toLowerCase()) && !full.includes('</');
        if (!isSelfClosing) {
          stack.push(el);
        }
      }
    }
  }

  root.children.forEach(c => c.parentElement = parent);
  return root.children;
}

// 1. Load and instantiate HUD
const { HUD } = await import('../src/hud.js');
const root = new MockElement('div', 'hud');
const hud = new HUD(root);

console.log('  [TEST 1] Verifying HUD initial DOM semantic structure');
assert(hud.el.waveCard, 'HUD must have waveCard reference');
assert(hud.el.wave, 'HUD must have #wave reference');
assert(hud.el.waveLbl, 'HUD must have #wave-lbl reference');
assert(hud.el.left, 'HUD must have #left reference');
assert(hud.el.leftLbl, 'HUD must have #left-lbl reference');
assert(hud.el.leftBox, 'HUD must have #left-box reference');
assert.strictEqual(hud.el.wave.textContent, '1', 'Initial wave should be 1');
assert.strictEqual(hud.el.left.textContent, '0', 'Initial left enemies should be 0');
console.log('  [PASS] Initial DOM structure validated\n');

console.log('  [TEST 2] Testing setWave across all states');
// State: active
hud.setWave(2, 5, 'active');
assert.strictEqual(hud.el.wave.textContent, '2');
assert.strictEqual(hud.el.left.textContent, '5');
assert.strictEqual(hud.el.leftLbl.textContent, 'ENEMIES LEFT');
assert.strictEqual(hud.el.leftBox.hidden, false);

// Singular enemy test
hud.setWave(2, 1, 'active');
assert.strictEqual(hud.el.left.textContent, '1');
assert.strictEqual(hud.el.leftLbl.textContent, 'ENEMY LEFT');

// State: intermission
hud.setWave(2, 8, 'intermission');
assert.strictEqual(hud.el.waveLbl.textContent, 'WAVE 2');
assert.strictEqual(hud.el.wave.textContent, 'CLEARED');
assert.strictEqual(hud.el.left.textContent, '8s');
assert.strictEqual(hud.el.leftLbl.textContent, 'NEXT WAVE IN');
assert.strictEqual(hud.el.leftBox.hidden, false);

// State: roam
hud.setWave('ROAM', 0, 'roam');
assert.strictEqual(hud.el.waveLbl.textContent, 'MODE');
assert.strictEqual(hud.el.wave.textContent, 'FREE ROAM');
assert.strictEqual(hud.el.leftBox.hidden, true);

// State: duel
hud.setWave('DUEL', 0, 'duel');
assert.strictEqual(hud.el.waveLbl.textContent, 'MODE');
assert.strictEqual(hud.el.wave.textContent, '1v1 DUEL');
assert.strictEqual(hud.el.left.textContent, 'AI');
assert.strictEqual(hud.el.leftLbl.textContent, 'TARGET');
assert.strictEqual(hud.el.leftBox.hidden, false);
console.log('  [PASS] All 4 states (active, intermission, roam, duel) update textContent cleanly\n');

console.log('  [TEST 3] Stress testing 1,000 frames of setWave in simulated game loop');
for (let frame = 0; frame < 1000; frame++) {
  const wave = Math.floor(frame / 100) + 1;
  const left = 10 - (frame % 10);
  hud.setWave(wave, left, 'active');
  assert(hud.el.wave !== null, 'hud.el.wave must never become null');
  assert(hud.el.left !== null, 'hud.el.left must never become null');
  assert(hud.el.wave.parentElement !== null, 'hud.el.wave must never be detached from DOM');
  assert.strictEqual(hud.el.wave.textContent, String(wave));
  assert.strictEqual(hud.el.left.textContent, String(left));
}
console.log('  [PASS] 1,000 frames executed without error or DOM node destruction\n');

console.log('  [TEST 4] Testing setPvpScore, setModifier, setTimer safety');
hud.setPvpScore('<div>PLAYER 10 - 5 OPPONENT</div>');
assert.strictEqual(hud.el.pvpscore.hidden, false);
assert(hud.el.waveBox.hidden, 'waveBox should be hidden during PvP display');
assert(hud.el.leftBox.hidden, 'leftBox should be hidden during PvP display');

hud.setPvpScore(null);
assert.strictEqual(hud.el.pvpscore.hidden, true);

hud.setModifier('SPEED DEMON');
assert.strictEqual(hud.el.modifier.textContent, 'SPEED DEMON');
assert.strictEqual(hud.el.modifier.hidden, false);

hud.setTimer('02:45');
assert.strictEqual(hud.el.timer.textContent, '02:45');
assert.strictEqual(hud.el.timer.hidden, false);
console.log('  [PASS] PvP, Modifier, and Timer handlers safe and functional\n');

console.log('  [TEST 5] Checking style.css for UI rules and pointer-events protection');
const css = fs.readFileSync(new URL('../style.css', import.meta.url), 'utf8');
assert(css.includes('.hud-tr'), 'style.css must contain .hud-tr styles');
assert(css.includes('.hud-tr.wave-card'), 'style.css must contain .hud-tr.wave-card styles');
assert(css.includes('pointer-events: none !important'), 'style.css must enforce pointer-events: none on HUD wave card');
assert(css.includes('calc(124px + env(safe-area-inset-right'), 'style.css must enforce responsive mobile clearance');
console.log('  [PASS] CSS formatting and pointer-events rules verified\n');

console.log('=== ALL 5/5 HUD & WAVE CARD TESTS PASSED! ===');
