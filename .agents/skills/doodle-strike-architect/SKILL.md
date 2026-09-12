---
name: doodle-strike-architect
description: Master architectural guardian and disaster recovery agent for Doodle Strike. Contains the complete blueprint for characters, enemies, environment, game loop, biro rendering pipeline, mobile controls, and automated recovery procedures to heal and restore the pristine build upon any fatal failure.
---

# Doodle Strike: Master Architecture Guardian & Disaster Recovery Agent

This agent serves as the single source of architectural truth, system preservation, and emergency recovery for Doodle Strike.

When any fatal error, corruption, visual regression, or breaking change occurs, invoke this agent and run its diagnostic tools to immediately heal and restore the codebase to its verified golden state.

---

## Complete System Architecture

Read the comprehensive technical specification in:
- [Architecture Blueprint & Recovery Specification](./references/architecture-blueprint.md)

### 1. Core Module Breakdown
- **Game Engine & Lifecycle**: [src/main.js](file:///c:/Users/dd/Desktop/Test/src/main.js) (Game loop, physics step, state machine, asset preload)
- **Player & Humanoid**: [src/player.js](file:///c:/Users/dd/Desktop/Test/src/player.js), [src/players.js](file:///c:/Users/dd/Desktop/Test/src/players.js) (Movement, slide, grapple, aim synchronization)
- **Enemy Hierarchy & AI**: [src/enemies.js](file:///c:/Users/dd/Desktop/Test/src/enemies.js), [src/nav.js](file:///c:/Users/dd/Desktop/Test/src/nav.js) (7 enemy archetypes, 3 bosses, navmesh pathfinding)
- **Environment & Maps**: [src/level.js](file:///c:/Users/dd/Desktop/Test/src/level.js), [src/physics.js](file:///c:/Users/dd/Desktop/Test/src/physics.js) (Doodle District, Doodle Mexico, breakable props)
- **Weapons & Ballistics**: [src/weapons.js](file:///c:/Users/dd/Desktop/Test/src/weapons.js), [src/effects.js](file:///c:/Users/dd/Desktop/Test/src/effects.js) (Rifle, shotgun, sniper, katana, grenade)
- **Pen-and-Ink Rendering**: [src/render.js](file:///c:/Users/dd/Desktop/Test/src/render.js) (G-buffer, inverse-depth Laplacian outlines, biro crosshatching)
- **Tactical Mobile Controls**: [src/mobile.js](file:///c:/Users/dd/Desktop/Test/src/mobile.js), [style.css](file:///c:/Users/dd/Desktop/Test/style.css) (Dual-fire, joystick, layout customizer)
- **HUD & Responsive UI Architecture**: [src/hud.js](file:///c:/Users/dd/Desktop/Test/src/hud.js), [style.css](file:///c:/Users/dd/Desktop/Test/style.css) (Responsive viewports, Z-index hierarchy, touch event isolation, instant `pointerdown` fastClick, collapsible controls accordion)
- **Audio Synthesizer**: [src/audio.js](file:///c:/Users/dd/Desktop/Test/src/audio.js) (Pure procedural Web Audio synth)
- **Networking**: [src/net.js](file:///c:/Users/dd/Desktop/Test/src/net.js) (PeerJS P2P multiplayer mesh)

---

## Disaster Recovery & Build Restoration Workflow

When encountering a crash, build failure, or visual bug, execute the following recovery protocol:

### Step 1: Run Architectural Integrity Verification
Run the verification script from the repository root:
```powershell
node .agents/skills/doodle-strike-architect/scripts/verify-integrity.js
```
The script validates:
1. Complete existence of all 16 core modules and web assets.
2. Complete JavaScript syntax validation via `node --check`.
3. Shader math invariants (biro stroke width `w = sp * 0.125`, softened blue palette, zero crevice shadow bugs).
4. Raycast aim alignment and parallax-free camera origins.
5. Touch input orientation and layout containment.
6. Zero trademark leaks.

### Step 2: Run Unit Test Suites
```powershell
node scratch/test_screenshot.js
node scratch/test_settings.js
node scratch/test_layout.js
node scratch/test_extended_features.js
```

### Step 3: Emergency Baseline Reset (Golden Snapshot)
If a fatal corruption or regression cannot be manually reconciled, restore immediately to the golden baseline commit `01541ad`:
```powershell
git reset --hard 01541ad
```
This restores all 16 modules, styles, shaders, and controls to the exact, tested, pristine working state.

---

## Golden Architectural Invariants

Always preserve these foundational invariants:
1. **Zero Allocations in Game Loop**: Never instantiate `new THREE.Vector3()`, `new THREE.Matrix4()`, or object literals inside `step()`, `player.update()`, or render loops.
2. **Optical Camera Raycasting**: Weapons must cast rays using `player.camera.position` and `this.camera.getWorldDirection(d)` to ensure shot trajectory perfectly matches the on-screen crosshair.
3. **World-Anchored Biro Crosshatching**: Post-processing shader hatching coordinates must be derived from reconstructed world-space positions (`wpos`) rather than screen coordinates.
4. **Soft Ballpoint Shading**: Shadow ink cap must remain delicate (`smoothstep(0.10, 0.0, shade) * 0.28`), allowing the paper fibers and ruled lines to breathe through strokes.
5. **No Trademark Terms**: Never introduce trademarked commercial franchise titles ("Call of Duty", "COD", etc.) into code, comments, UI strings, or documentation.
6. **Strict Z-Index Hierarchy & Touch Containment**: `#hud` (1000) < `.screen` (2000) < `.panel` (2001), with `#mobile-controls` at 200. Mobile look/joystick touch zones must NEVER capture input over menus; `setGameplayActive(false)` must be triggered when screens are shown.
7. **Zero-Latency Interaction**: All interactive UI elements must use `fastClick` (`pointerdown`) rather than standard click to guarantee 0ms responsive touch response across all screen sizes.
