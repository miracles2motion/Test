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

## 🚀 CURRENT ACTIVE EPIC: Epic D (The Level Architecture)

### Completed Epics:
- **Epic B (Optimization & Caching Engine):** 100% COMPLETE & VERIFIED.
  - Device Tier Profiling (`device-tiers.js`, `device-probe.js`)
  - Budget Arbiter & Frame Cost Model (`budget-arbiter.js`)
  - Adaptive Performance Monitor & Quality Ladder (`perf-monitor.js`)
  - Content-Addressed Geometry Cache (`geometry-cache.js`)
  - Cell-Batched InstancedMesh Grouping (`instance-manager.js`)
  - Screen-Space Error LOD Grammar with amortized flushes (`lod-manager.js`)
  - Loose Octree Spatial Broadphase (`loose-octree.js`)
  - Pre-warmed Shell Enemy Object Pool with Concurrency Limiter (`enemy-pool.js`)
  - All 7 verification test suites passing green (`test/verify_epic_b.mjs`).

- **Epic C (Enemy AI & Tactical Expansion):** 100% COMPLETE & VERIFIED.
  - **The 'Heavy' (Shielded Bruiser):** Reinforced ballistic tower shield deflecting frontal gunfire, exposed rear ink power core weakspot ($2.2\times$ critical flank damage), concussive shotgun recoil with screen shake, high HP tank archetype.
  - **The 'Sniper' (Evasive Marksman):** Close-quarters evasion trigger ($<14\text{m}$) with ink smoke decoy deployment, tactical disengagement and repositioning to elevated perches/cover, predictive velocity lead-aim against grappling and airborne targets.
  - **NavMesh Upgrades:** Multi-tier vertical jump links connecting platforms up to $2.4\text{m}$, tactical node classification (`isPerch`, `isCover`, `isChoke`), tactical query search helpers (`findSniperPerch`, `findCoverNode`, `findFlankNode`).
  - All 9 verification test suites passing green (`test/verify_epic_c.mjs`).

---

## 🗺️ NEXT EPIC: Epic D (The Level Architecture)
**STATUS:** READY TO BEGIN ON USER CONFIRMATION.

### Goal
Add massive new maps built upon the `universal-detailing-standard`.

### Implementation Steps
1. **Colossal Scale Map (The Library):** A giant desk with towering books. Utilize prefabs (`src/prefabs.js`).
2. **Multiplayer Spawn Logic:** Optimize spawn points to prevent spawn-trapping.

---

> [!IMPORTANT]
> **AI STUDIO AGENT:** Acknowledge this document by confirming you have read `dream_phase7/`, `AGENTS.md`, and `tokens.css` before proposing your first code change for Epic B.
