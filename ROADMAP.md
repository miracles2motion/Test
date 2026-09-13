# Doodle Strike: Master Handover Protocol & Epic Roadmap

**CRITICAL INSTRUCTION FOR AI STUDIO:** 
You are receiving a deeply complex, fragile, and highly optimized codebase. The previous agent spent an entire Epic merely stabilizing the UI architecture. 
**DO NOT ATTEMPT TO EXECUTE MULTIPLE EPICS AT ONCE.** You must execute these Epics **strictly sequentially**, starting exclusively with **Epic B**, and you must not begin Epic C until Epic B is 100% complete and verified by the user.

---

## 🛑 Phase 1: Context Gathering (MANDATORY FIRST STEP)
Before writing a single line of code, you MUST gather context. Run terminal commands or read the following files to understand the system:
1. **The Epic B Blueprint (CRITICAL):** Read the contents of the `dream_phase7/` directory. This folder contains the exact architectural breakdown of Epic B (Systems 01 through 08, covering Budget Arbiters, Instance Synthesizers, and LOD Grammars). You MUST follow these design docs.
2. **The Architecture Rules:** Read `.agents/AGENTS.md`. You must internalize the "Dream Synthesizer Guidelines", the "Golden Baseline Sanctuary", and the "Universal Mesh & Object Detailing Standard".
3. **Phase 7 Dream Aesthetics:** Read `src/tokens.css` and `style.css` (or `dream_phase7/12_ui_design_bible.txt`). We recently completed "Phase 7" of the UI aesthetic. You MUST strictly use variables like `var(--ink)`, `var(--ink-red)`, and `var(--paper)`. Do NOT use raw hex codes, and do NOT use deprecated variables (e.g., `var(--red)`).
4. **The Core Engine:** Read `src/main.js` (State Machine/UI), `src/mobile.js` (Touch & Drag/Drop), and `src/graphics.js` (WebGL rendering). 

---

## 🛑 Phase 2: Architectural Safety Rules (DO NOT BREAK THE APP)
1. **DOM Preservation:** Never destroy and recreate (`.innerHTML`) interactive UI elements in `src/mobile.js` without thoroughly rebinding ALL event listeners (`mousedown`, `touchstart`, etc.).
2. **Coordinate Math:** When writing drag-and-drop or pointer-lock logic, always calculate using absolute CSS pixels (`getComputedStyle(btn).left`) instead of scaled bounding boxes (`getBoundingClientRect()`) to prevent UI jumping.
3. **Hardware Fallbacks:** Ensure touch (`e.changedTouches`) and mouse (`e.clientX`) fallbacks are always perfectly parallel.

---

## 🚀 CURRENT ACTIVE EPIC: Epic B (Optimization & Caching Engine)
**STATUS:** NOT STARTED. (Execute this first).

### Goal
Eliminate garbage collection (GC) stutters and maintain a locked 60FPS on mobile and 144FPS on desktop by implementing the **Dream Phase 7 Engine upgrades**.

### Implementation Steps
1. **Read the `dream_phase7/` docs:** Specifically 01 through 08, which dictate the implementation of the System Budget Arbiter, Instance Synthesizer, and Collision Octree.
2. **Geometry Instancing & Pooling (`src/graphics.js`):**
   - Implement a global Object Pool for projectiles and enemies (System 06). 
   - Convert repetitive map geometry (crates, barrels) into `THREE.InstancedMesh` (System 02).
3. **Dynamic Resolution Scaling (`src/main.js`):**
   - Implement the Adaptive Monitor (System 04) to dynamically lower `renderer.setPixelRatio()` if FPS drops below 55.

---

## ⚔️ FUTURE EPIC: Epic C (Enemy AI & Tactical Expansion)
**STATUS:** NOT STARTED. (Do not begin until Epic B is complete).

### Goal
Expand the enemy roster using the strict `enemy-intelligence-design` tags.

### Implementation Steps
1. **The 'Heavy' (Shielded Bruiser):** Slow movement, requires flanking.
2. **The 'Sniper' (Evasive Marksman):** Retreats when approached (`canRetreat: true`).
3. **NavMesh Upgrades:** Basic A* pathfinding nodes on maps for vertical navigation.

---

## 🗺️ FUTURE EPIC: Epic D (The Level Architecture)
**STATUS:** NOT STARTED. (Do not begin until Epic C is complete).

### Goal
Add massive new maps built upon the `universal-detailing-standard`.

### Implementation Steps
1. **Colossal Scale Map (The Library):** A giant desk with towering books. Utilize prefabs (`src/prefabs.js`).
2. **Multiplayer Spawn Logic:** Optimize spawn points to prevent spawn-trapping.

---

> [!IMPORTANT]
> **AI STUDIO AGENT:** Acknowledge this document by confirming you have read `dream_phase7/`, `AGENTS.md`, and `tokens.css` before proposing your first code change for Epic B.
