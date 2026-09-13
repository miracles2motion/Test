# Doodle Strike: Epic Roadmap & Master Implementation Plan

This document serves as the absolute "Golden Context" for future AI sessions (e.g., in Google AI Studio). It outlines the completed work, strict architectural rules to prevent regressions, and the detailed implementation plan for the upcoming Epics.

## 🛑 AI Studio Directives (CRITICAL: DO NOT BREAK THE APP)
To whoever (or whichever AI) is continuing this project, **READ THIS CAREFULLY**:
1. **DOM Preservation:** Never destroy and recreate (`.innerHTML`) interactive UI elements without thoroughly rebinding ALL event listeners (`mousedown`, `touchstart`, etc.). This caused massive drag-and-drop bugs in Epic A.
2. **CSS Variables:** The project uses a strict design token system (`var(--ink)`, `var(--ink-red)`, `var(--paper)`). NEVER use raw hex codes. NEVER reference deprecated variables like `var(--red)`.
3. **Coordinate Math:** When writing drag-and-drop or pointer-lock logic, always calculate using absolute CSS pixels (`getComputedStyle`) instead of scaled `getBoundingClientRect()` to prevent UI jumping.
4. **Mobile vs Desktop:** Ensure touch (`e.changedTouches`) and mouse (`e.clientX`) fallbacks are always perfectly parallel. The game supports both seamlessly.

---

## 🏆 Completed: Epic A (The UI Foundation)
- Rebuilt Main Menu (Grid Layout), Map Selector (Horizontal Carousel), and Settings Overlay.
- Completely fixed and stabilized the Mobile Layout Editor (Drag & Drop, Scaling, Visibility, Opacity).
- Repaired Crosshair CSS (`var(--ink-red)` override).
- Unified `input.js` pointer-lock logic with hardware auto-detection.

---

## 🚀 Epic B: The Optimization & Caching Engine (Next Immediate Step)

### Goal
Doodle Strike is rendering complex procedural geometry. Epic B focuses on aggressively optimizing the engine to maintain a locked 60FPS on mobile devices and 144FPS+ on desktop, eliminating garbage collection (GC) stutters.

### Implementation Plan

#### 1. Geometry Instancing & Pooling (`src/graphics.js`)
- **Issue:** Currently, bullets, hit-markers, and repeated map props might be dynamically allocated and destroyed, causing GC spikes.
- **Action:** Implement an Object Pool for all projectiles (`pool.getBullet()`) and particle effects.
- **Action:** Convert repetitive map geometry (like basic boxes and barrels) into `THREE.InstancedMesh` to drastically reduce draw calls.

#### 2. Canvas & Render Resolution Scaling (`src/main.js`)
- **Issue:** High DPI mobile screens (Retina) try to render native 3D resolution, causing thermal throttling.
- **Action:** Implement a dynamic `pixelRatio` scaler. If FPS drops below 55, dynamically lower the `renderer.setPixelRatio()` to 0.75x to save performance.

#### 3. Asset & Material Caching
- **Issue:** The ballpoint pen shading (`MeshToonMaterial` with custom shader chunks) is expensive if recompiled.
- **Action:** Pre-compile and cache the 3 core materials (Ink, Red Ink, Paper) globally. Force all geometry to share these exact material instances.

---

## ⚔️ Epic C: Enemy AI & Tactical Expansion

### Goal
Expand the enemy roster using the strict `enemy-intelligence-design` guidelines to introduce tactical depth.

### Implementation Plan
1. **The 'Heavy' (Shielded Bruiser):**
   - High HP, slow movement.
   - Requires flanking; highly resistant to frontal assault.
2. **The 'Sniper' (Evasive Marksman):**
   - Retreats when approached (`canRetreat: true`).
   - High damage hitscan, clearly telegraphed by a laser sight.
3. **NavMesh Upgrades:**
   - Implement basic A* pathfinding nodes on the maps to allow enemies to navigate vertically and avoid getting stuck on corners.

---

## 🗺️ Epic D: The Level Architecture

### Goal
Add massive new maps built upon the `universal-detailing-standard`.

### Implementation Plan
1. **Colossal Scale Map (The Library):**
   - A map taking place on a giant desk with towering books as buildings and pencils as sniper bridges.
   - Utilize prefabs (`src/prefabs.js`) for complex props rather than raw geometry coding.
2. **Multiplayer Spawn Logic:**
   - Optimize spawn points to prevent spawn-trapping. Add an algorithmic check to spawn players in the safest quadrant.

---

## User Review Required
> [!IMPORTANT]
> Since you will be switching devices and using Google AI Studio, please commit and push this file to your repository now.
> In your new session, simply tell the AI: **"Read the implementation_plan.md file and begin executing Epic B."** This will ensure the new AI has all the context it needs without breaking anything.
