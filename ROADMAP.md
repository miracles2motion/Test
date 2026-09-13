# Doodle Strike: Master Handover Protocol & Epic Roadmap

**CRITICAL INSTRUCTION FOR AI STUDIO:** 
You are receiving a deeply complex, fragile, and highly optimized codebase. The previous agent spent an entire Epic merely stabilizing the UI architecture. 
**DO NOT ATTEMPT TO EXECUTE MULTIPLE EPICS AT ONCE.** You must execute these Epics **strictly sequentially**, starting exclusively with **Epic B**, and you must not begin Epic C until Epic B is 100% complete and verified by the user.

---

## 🛑 Phase 1: Context Gathering (MANDATORY FIRST STEP)
Before writing a single line of code, you MUST gather context. Run terminal commands or read the following files to understand the system:
1. **The Architecture Rules:** Read `.agents/AGENTS.md`. You must internalize the "Dream Synthesizer Guidelines", the "Golden Baseline Sanctuary", and the "Universal Mesh & Object Detailing Standard".
2. **Phase 7 Dream Aesthetics:** Read `src/tokens.css` and `style.css`. We recently completed "Phase 7" of the UI aesthetic. You MUST strictly use variables like `var(--ink)`, `var(--ink-red)`, and `var(--paper)`. Do NOT use raw hex codes, and do NOT use deprecated variables (e.g., `var(--red)`).
3. **The Core Engine:** Read `src/main.js` (State Machine/UI), `src/mobile.js` (Touch & Drag/Drop), and `src/graphics.js` (WebGL rendering). 

---

## 🛑 Phase 2: Architectural Safety Rules (DO NOT BREAK THE APP)
1. **DOM Preservation:** Never destroy and recreate (`.innerHTML`) interactive UI elements in `src/mobile.js` without thoroughly rebinding ALL event listeners (`mousedown`, `touchstart`, etc.).
2. **Coordinate Math:** When writing drag-and-drop or pointer-lock logic, always calculate using absolute CSS pixels (`getComputedStyle(btn).left`) instead of scaled bounding boxes (`getBoundingClientRect()`) to prevent UI jumping.
3. **Hardware Fallbacks:** Ensure touch (`e.changedTouches`) and mouse (`e.clientX`) fallbacks are always perfectly parallel.

---

## 🚀 CURRENT ACTIVE EPIC: Epic B (Optimization & Caching Engine)
**STATUS:** NOT STARTED. (Execute this first).

### Goal
Eliminate garbage collection (GC) stutters and maintain a locked 60FPS on mobile and 144FPS on desktop. 

### Implementation Steps
1. **Geometry Instancing & Pooling (`src/graphics.js`)**
   - **Context:** Currently, projectiles and repeated props are dynamically allocated/destroyed, causing massive GC spikes.
   - **Task:** Implement a global Object Pool for projectiles. Convert repetitive map geometry (crates, barrels) into `THREE.InstancedMesh`.
2. **Dynamic Resolution Scaling (`src/main.js`)**
   - **Context:** High DPI mobile screens thermally throttle when pushing native 3D resolutions.
   - **Task:** Implement a dynamic `pixelRatio` scaler. If FPS drops below 55, dynamically lower `renderer.setPixelRatio()` to 0.75x.
3. **Asset & Material Caching**
   - **Context:** The ballpoint pen shading (`MeshToonMaterial`) is expensive to compile.
   - **Task:** Pre-compile and globally cache the 3 core materials (Ink, Red Ink, Paper).

---

## ⚔️ FUTURE EPIC: Epic C (Enemy AI & Tactical Expansion)
**STATUS:** NOT STARTED. (Do not begin until Epic B is complete).

### Goal
Expand the enemy roster using the strict `enemy-intelligence-design` guidelines to introduce tactical depth.

### Implementation Steps
1. **The 'Heavy' (Shielded Bruiser):**
   - High HP, slow movement.
   - Requires flanking; highly resistant to frontal assault.
2. **The 'Sniper' (Evasive Marksman):**
   - Retreats when approached (`canRetreat: true`).
   - High damage hitscan, clearly telegraphed by a laser sight.
3. **NavMesh Upgrades:**
   - Implement basic A* pathfinding nodes on the maps to allow enemies to navigate vertically and avoid getting stuck on corners.

---

## 🗺️ FUTURE EPIC: Epic D (The Level Architecture)
**STATUS:** NOT STARTED. (Do not begin until Epic C is complete).

### Goal
Add massive new maps built upon the `universal-detailing-standard`.

### Implementation Steps
1. **Colossal Scale Map (The Library):**
   - A map taking place on a giant desk with towering books as buildings and pencils as sniper bridges.
   - Utilize prefabs (`src/prefabs.js`) for complex props rather than raw geometry coding.
2. **Multiplayer Spawn Logic:**
   - Optimize spawn points to prevent spawn-trapping. Add an algorithmic check to spawn players in the safest quadrant.

---

> [!IMPORTANT]
> **AI STUDIO AGENT:** Acknowledge this document by confirming you have read `AGENTS.md`, `tokens.css`, and `graphics.js` before proposing your first code change for Epic B.
