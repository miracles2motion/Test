# Doodle Strike: Master Architecture Blueprint & Recovery Specification

## 1. System Architecture & Dependency Graph

Doodle Strike is a client-side WebGL first-person shooter built on Three.js (r128) rendered in a hand-drawn lined notebook / ballpoint biro pen aesthetic. It features real-time 3D physics, enemy state-machine AI, tactical mobile touch controls, Web Audio synthesis, and PeerJS peer-to-peer multiplayer.

```
                         index.html
                             │
                         main.js (Game Coordinator)
                             ├── audio.js (Web Audio Synth)
                             ├── render.js (InkRenderer: G-Buffer + Post-Shader)
                             ├── physics.js (Spatial Grid & AABB ColDetect)
                             ├── level.js (Geometry & Prop Builders)
                             ├── nav.js (A* Navigation Mesh)
                             ├── player.js (First-Person Movement & Grapple)
                             ├── weapons.js (Ballistics, Katana & Grenades)
                             ├── enemies.js (Enemy AI & Boss Encounters)
                             ├── effects.js (Particle Bursts & Inks)
                             ├── hud.js (HTML/SVG Dynamic Overlays)
                             ├── mobile.js (Tactical Touch & Layout Editor)
                             ├── input.js (PointerLock, Keyboard & Gamepad)
                             └── net.js (PeerJS Mesh Networking)
```

---

## 2. Main Loop & Lifecycle (`src/main.js`)

### State Machine
1. `TITLE / MENU`: Camera slowly orbits map showcase; shows game mode cards (Solo, Match), settings modal, controls accordion.
2. `PLAYING`: Standard loop running at up to 60-120Hz via `requestAnimationFrame`.
3. `PAUSED`: Simulation stops; audio pitch lowers; pause panel overlays; touch look disabled.
4. `GAMEOVER / VICTORY`: Slow-motion camera zoom; final scoreboard; restart trigger.

### Execution Flow within `step(dt)`:
```javascript
1. dt = clamp(clock.getDelta(), 0, 0.05); // Frame pacing protection
2. input.update();                       // Mouse delta, gamepad state
3. mobile.update(dt);                    // Joystick vector, touch drag look
4. player.update(dt);                    // Movement, collision, grapple, ADS
5. weapons.update(dt);                   // Fire cooldown, recoil recovery, animations
6. enemies.update(dt);                   // Pathfinding, sensory perception, attacks
7. physics.update(dt);                   // Dynamic props & grenade trajectories
8. effects.update(dt);                   // Particle life, ink splatters
9. net.update(dt);                       // P2P position broadcasts & reconciliation
10. hud.update(dt);                      // HP bar, ammo counter, crosshair spread
11. renderer.render(scene, camera);      // Post-processed biro shader composite
```

---

## 3. Player & Humanoid Systems (`src/player.js`, `src/players.js`)

### Movement & Mechanics
- **Ground Physics**: Velocity verlet with friction, air control, slope stepping, and stairs support via `src/physics.js`.
- **Tactical Moves**:
  - **Slide**: Crouching while moving above threshold triggers slide with reduced eye height (`0.65m`) and directional momentum.
  - **Dash**: High-velocity burst consuming stamina; triggers blur streak effect.
  - **Grapple Hook**: Raycasts against grapple rings; connects tension spring physics cable; swinging and vertical climb mechanics.
- **Optical Aim Synchronization**:
  - Camera pitch/yaw incorporates recoil (`recoilPitch`, `recoilYaw`).
  - `this.camera.getWorldDirection(this.forward)` guarantees that raycasts, bullets, and look direction are optically locked to crosshairs without parallax.

### Humanoid Mesh Generator (`buildHumanoid` in `src/enemies.js` & `src/players.js`):
- Stylized 3D ballpoint stick figure composed of line cylinders and paper torsos:
  - Head (sphere / hat), Torso, Limbs (upper arm, forearm, thigh, shin), Weapon socket.
  - Materials: Ink outlines with solid double-sided paper fills (`INK.BLACK`, `INK.BLUE`, `INK.RED`).

---

## 4. Enemy Hierarchy & Boss AI (`src/enemies.js`)

### Enemy Types
1. **Grunt**: Basic rifleman; seeks cover; bursts 3 shots at range.
2. **Rusher**: Agile katana charging unit; strafes and closes distance rapidly; executes high-damage melee swipes.
3. **Heavy**: Armored tank wielding shotgun; high health pool; close-quarters spread attacks.
4. **Sniper**: Elevated camper; projects a telegraph laser with a dodge window before instant high-damage hitscan shot.
5. **Shieldbearer**: Frontal ballistic riot shield immune to frontal fire; vulnerable only to flank attacks or parries.
6. **Ink Bomb**: Fast suicidal runner with ticking fuse; detonates in a large area-of-effect ink blast.
7. **Paper Wasp**: Airborne flier diving down in swoop trajectories.

### Boss System
1. **The Doodler**: Teleporting trickster firing rotating spirals of ink projectiles; spawns clone decoys.
2. **The Eraser**: Heavy area-denial boss creating sweeping erasure laser beams and shockwave rings.
3. **The Inkblot**: Multi-phase morphing gelatinous ink mass that splits into smaller sub-creatures upon taking damage.

### AI Decision Loop:
- Line-of-sight checks via `ctx.world.raycast`.
- Navigation mesh pathfinding using A* on convex polygons (`src/nav.js`).
- Hearing and visual awareness radius with alert state transitions: `IDLE` -> `SUSPICIOUS` -> `ALERT` -> `COMBAT` -> `FLEE`.

---

## 5. Environment & Level Generation (`src/level.js`)

### Maps
1. **Doodle District**:
   - Multi-level urban playground: asphalt streets, brick tenement rooftops, alleyways, grapple anchors on chimneys.
   - Dynamic elements: floating glider paper planes you can grapple onto.
2. **Doodle Mexico**:
   - Sun-drenched pueblo town: central plaza with fountain, floating decorative sombrero, church bell tower, adobe flat-top houses with stairs.
   - Breakable props: Clay pottery, crates, barrels, and piñatas that drop taco health pickups upon bullet impact.

---

## 6. Weapons & Ballistics Pipeline (`src/weapons.js`)

### Arsenal:
1. **Assault Rifle**: Automatic continuous fire; medium spread kick; high fire rate.
2. **Shotgun**: 8-pellet buckshot spread with hitstop freeze-frame on close-range impacts.
3. **Sniper Rifle**: High-magnification optical ADS scope with blur vignette; 1-shot headshot erasure.
4. **Katana**: Rapid slashing; guard parry reflecting incoming bullets; charge gauge for solo execution dash.
5. **Grenades**: Parabolic ballistic arc throwing; bounces off surfaces; leaves scorched ink craters.

---

## 7. Pen-and-Ink Rendering Pipeline (`src/render.js`)

### G-Buffer Pass
- Renders scene into HalfFloat RGBA WebGLRenderTarget:
  - `R`: Diffuse shading (`clamp(ndl * shadeScale + shadeBias, 0.0, 1.0)`).
  - `G`: Ink ID (`INK.BLUE`, `INK.RED`, `INK.BLACK`, etc.).
  - `B, A`: View-space normal `X, Y`.
  - `Depth`: 24-bit linear depth buffer.

### Post-Processing Shader (`postFrag`)
1. **Inverse-Depth Laplacian Outlines**:
   - `lap = abs(1.0/linDepth(zl) + 1.0/linDepth(zr) - 2.0*iw) + abs(1.0/linDepth(zu) + 1.0/linDepth(zd) - 2.0*iw)`
   - Second difference of `1/d` is strictly affine on any flat plane (including grazing floor planes), completely eliminating false-positive crevice floor bands while retaining razor-sharp silhouette edges.
2. **World-Anchored Biro Crosshatching**:
   - Reconstructs world-space position `wpos` from depth and inverse projection/view matrices.
   - Projects strokes onto primary dominant surface axis (`hp = an.y > max(an.x, an.z) ? wpos.xz : ...`).
   - Line spacing quantized to powers of two (`lod = exp2(floor(log2(...)))`), eliminating crawling during player movement.
   - Authentic fine ballpoint stroke width (`w = sp * 0.125`).
   - Three directional stroke sets (`d1`, `d2`, `d3`) layered smoothly over shadow zones.
   - Solid shadow floor cap softened to `smoothstep(0.10, 0.0, shade) * 0.28` to maintain paper air and prevent muddy black blotches.
3. **Paper Simulation**:
   - Lined paper ruled lines: Blue horizontal lines repeating at `uLineSpacing`.
   - Left margin: Red vertical line offset at `0.07 * uRes.x`.
   - Micro-procedural paper fiber grain wobble.
4. **Instant Screenshot Exporter**:
   - Canvas readback via `HTMLCanvasElement.toBlob()` and auto-downloading PNG. Key `0` or mobile `📸` button.

---

## 8. Tactical Mobile Touch Controls (`src/mobile.js`)

1. **Dual-Fire Architecture**:
   - `#btn-ads-fire`: 1-Tap ADS zoom + fire button with drag-to-aim camera tracking.
   - `#btn-hip-fire`: Instant hip-fire button for close-range combat.
2. **Virtual Analog Joystick**: Dynamic follow origin, deadzone clamping, and normalized vector emission.
3. **Touch Look Tracker**: Full right 62% screen drag zone with positive Y orientation (`lookVector.y -= dy` for look up).
4. **Layout Customizer**: Interactive drag-and-drop editor with per-button scaling, persisted in `localStorage('doodle_mobile_settings')`.
5. **Anti-Cutoff Responsive Viewports**: `.screen` container with `overflow-y: auto`, `overscroll-behavior: contain`, and sticky navigation bars.

---

## 9. Responsive UI HUD Architecture & Touch Event Isolation (`src/hud.js`, `src/mobile.js`, `style.css`)

### Layering & Z-Index Hierarchy Contract
To guarantee that game HUD elements, touch controls, and menu panels never clash or swallow pointer events:
- **WebGL Canvas (`canvas#c`)**: `position: fixed; inset: 0; z-index: 1;`
- **Mobile Touch Controls (`#mobile-controls`)**: `z-index: 200`
- **HUD In-Game Overlay (`#hud`)**: `z-index: 1000; pointer-events: none;`
- **Modal Screen Backdrop (`.screen`)**: `z-index: 2000; pointer-events: auto;`
- **Interactive Menu Card (`.panel`)**: `z-index: 2001; pointer-events: auto;`

### Touch Interception Suppression Pipeline
1. In `src/mobile.js`: `setGameplayActive(active)` and `resetTouches()`:
   - When any menu or pause screen opens (`active === false`), `#mobile-controls` is assigned `display: none !important; pointer-events: none !important;`.
   - Clears active touch identifiers so lingering finger touches never cause continuous firing or spinning upon unpausing.
   - Prevents `#look-area` (60% screen) and `#joy-area` (40% screen) from intercepting touch events over menu cards.
2. In `src/hud.js`: `onScreenVisibility(shown)` callback:
   - Automatically informs the mobile control coordinator whenever screens show or hide.

### Accidental Unpause Guard & Click Bubbling Protection
- The `.screen` click listener strictly tests `if (e.target === s || e.target.classList.contains('go'))`.
- Taps, button clicks, and slider adjustments inside `.panel` are fully isolated and never trigger accidental resumes or menu dismissals.

### Zero-Latency Touch Interaction Model (`fastClick`)
- Replaces standard click handlers with `pointerdown` listeners across all HUD buttons (`fastClick(el, handler)`).
- Provides instant 0ms touch trigger response on iOS/Safari, Android/Chrome, and Desktop.

### Adaptive Mobile Viewports
- Panels use dynamic viewport unit clamping: `max-height: calc(100vh - 16px); max-height: calc(100dvh - 16px);`.
- Touch scrolling enabled with `-webkit-overflow-scrolling: touch` and `overscroll-behavior: contain`.
- Controls help section (`#controlsToggle` and `#controlsCols`) defaults to collapsed on mobile viewports (<768px) to preserve screen real estate.

---

## 10. Audio Synth (`src/audio.js`)

Pure Web Audio API procedural synthesis with zero external audio assets:
- Gunshots: White noise bursts convolved with frequency modulation and decay curves.
- Bullet Whiz & Ricochet: High-frequency sine sweeps with rapid exponential decay.
- Footsteps: Low-frequency filtered noise impulses.
- Katana Swings & Parries: Metallic harmonic resonant filters.
- Mariachi Band (Doodle Mexico): Procedural trumpet, guitarron, and vihuela multi-voice chord arpeggiator.

---

## 11. Disaster Recovery Runbook & Fatal Failure Healing

When a fatal runtime error, crash, or code corruption occurs:

### Step 1: Run Architectural Verification
```powershell
node .agents/skills/doodle-strike-architect/scripts/verify-integrity.js
```
The script immediately pinpoints missing modules, syntax errors, shader regressions, or trademark leaks.

### Step 2: Run Module Unit Test Suites
```powershell
node scratch/test_screenshot.js
node scratch/test_settings.js
node scratch/test_layout.js
node scratch/test_extended_features.js
```

### Step 3: Emergency Baseline Reset (If code corrupted beyond repair)
Baseline Golden Commit: `01541ad`
```powershell
git reset --hard 01541ad
```
This guarantees an immediate 100% restoration to the pristine, fully-functional, trademark-free build.
