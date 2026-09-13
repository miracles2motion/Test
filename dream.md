# Project Dream: The Autonomous AI Level Designer

**Project Dream** is an autonomous, self-learning procedural generation and architectural orchestration system built for the game **Doodle Strike**. 

It acts as an intelligent AI colleague capable of understanding natural language requests, synthesizing multi-story game environments, running "God Mode" simulations to score map flow, self-healing geometric collisions, and learning from its failures over time.

This document outlines the entire architecture, capabilities, and learning mechanisms of the Dream system.
---


## 1. Core Architecture

Dream is divided into several highly specialized modules that work together in a continuous pipeline.

### 1.1 The NLP Router (`dream.js`)
- **Purpose**: The entry point for user interaction.
- **Function**: It parses natural language terminal commands (e.g., `npm run dream "build a cyber city on district 3x"`). 
- **Capabilities**:
  - Infers the intended map, theme, and architectural intent using heuristic matching.
  - Supports multiplier loops (e.g., `3x`) to run the generation pipeline multiple times sequentially, allowing the AI to iterate and brute-force complex layouts until it achieves a high-quality score.
  - Routes the parsed payload to the Orchestrator.

### 1.2 The Master Pipeline (`src/dream-orchestrator.js`)
- **Purpose**: The central nervous system of Dream.
- **Function**: Executes the 3-mode pipeline:
  1. `NOTHING`: Baseline check.
  2. `CONCEPT`: Thematic ideation.
  3. `MAP`: Spatial generation and synthesis.
- **Capabilities**:
  - Manages strict timeouts (e.g., 60 seconds per generation).
  - Handles fatal crashes. If a completely novel, unrecognized error occurs, it triggers a massive visual alert in the console to demand human intervention.
  - Integrates the self-healing and quality scoring phases.

---

## 2. Spatial Synthesis & Architecture

### 2.1 The Macro-Dreamer (`src/macro-dreamer.js`)
- **Purpose**: 3D Volumetric Scanner and Synthesizer.
- **Function**: Scans existing level geometry looking for contiguous empty spatial pockets (e.g., voids measuring 10m x 7m x 10m).
- **Capabilities**:
  - Once a void is found, it selects a massive, multi-story themed prefab (like a `Cargo Crane Gantry` or `Neon Data Vault`).
  - Pre-validates the structure in a Three.js sandbox dry-run to ensure it doesn't cause NaNs or immediate fatal errors.
  - Checks the Failure Blacklist to ensure it doesn't build in known "Dead Zones".
  - Safely injects the raw Javascript generation code into the target map file.

### 2.2 The Observer (`src/prefab-observer.js`)
- **Purpose**: Auto-Harvester of User Creations.
- **Function**: Scans map files for manual geometry that the human developer added by hand (e.g., raw `box()`, `cyl()`, and `barrel()` calls).
- **Capabilities**:
  - Uses spatial clustering mathematics to group primitives that are placed within a 6-meter radius.
  - Automatically translates their absolute coordinates into relative coordinates.
  - Writes a brand-new, reusable Javascript function into `src/prefabs.js`.
  - Registers the new prefab into Dream's memory so Dream can use the human's custom design in future autonomous generations.

---

## 3. Auditing & Simulation

### 3.1 Self-Healing Auditor (`src/audit-healer.js`)
- **Purpose**: Spatial doctoring and geometric sanitization.
- **Function**: Runs a rigorous check (`verify-detailing.js`) against the generated map to ensure it meets the **Universal Detailing Standard**.
- **Capabilities**:
  - Detects overlapping colliders, pinched stairways (requiring 1.8m clearance), and inaccessible grapple points.
  - **Auto-Remedy System**: If a collision is found, it automatically calculates boolean intersections and performs a `carveAABB` operation, actively rewriting the level code to carve out intersecting geometry and fix the map before the user ever sees it.

### 3.2 Bot Flow Simulator (`src/map-simulate.js`)
- **Purpose**: "God Mode" competitive quality scorer.
- **Function**: Programmatically simulates AI bot traversal and calculates a weighted quality score (0-100) based on competitive shooter metrics.
- **Metrics Analyzed**:
  - **Spawn Safety**: Are spawns grounded? Are they protected from immediate sniper fire?
  - **Sniper Balance**: Do sniper perches have at least 3 open lines of sight, or are they camp-prone?
  - **Grapple Chains**: Are grapple rings close enough to chain momentum?
  - **Fire Lane Coverage**: Does the geometry allow for clear 3-lane chokepoints?
  - **Quadrant Density**: Is the map perfectly balanced, or is one side completely empty?

---

## 4. Self-Learning & Memory (`src/map-learning.js`)

Dream maintains a persistent state across generations via `.agents/learning-cache.json`. This allows it to learn from its mistakes and improve its designs over time.

### 4.1 Success Registry & Genetic Algorithms
- **Function**: When a macro-structure is placed and the map passes the simulator with a high score (e.g., > 80/100), its XYZ coordinates are saved to the `successRegistry`.
- **Genetic Mutation**: The next time Dream attempts to place that specific structure, it rolls a **20% genetic mutation chance**. If triggered, it shifts the X and Z coordinates by ±1.5 meters. If the new mutated position results in an even higher flow score, it overwrites the old memory.

### 4.2 Failure Blacklist & Dead Zones
- **Function**: During the flow simulation, if Dream detects terrible layout elements (e.g., ungrounded spawns hanging in mid-air, or snipers stuck facing a wall), it calculates the coordinates and flags them as a **Dead Zone**.
- **Result**: The coordinates are written to the `failureBlacklist`. The Macro-Dreamer is strictly forbidden from ever building structures in or around those coordinates again.

### 4.3 Dynamic Rule Tightening
- **Function**: Dream tracks its historical success/failure rate over a rolling window (e.g., the last 20 generation attempts).
- **Result**: If it detects repeating clusters of failures or dead zones, it will automatically "tighten its rules," adjusting internal parameters (like minimum spatial clearance required) to be more conservative until the success rate stabilizes.

---

## The Request for the LLM

**Goal**: Analyze this entire architecture and suggest advanced, highly technical upgrades to Dream's autonomous capabilities. 
Focus on:
1. Enhancing its spatial awareness and generation mathematics.
2. Evolving its machine learning, memory, and genetic mutation systems.
3. Adding new dimensions of autonomous simulation and heuristic scoring.
