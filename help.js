#!/usr/bin/env node
/**
 * Doodle Strike - Developer & AI Command Reference (CLI Help)
 * Run anytime with: npm run help  OR  node help.js
 */

console.log(`
================================================================================
   🖋️  DOODLE STRIKE: AGENT & DEVELOPER COMMAND CHEATSHEET
================================================================================

1. 🔍 AUDIT & VERIFY COMMANDS
--------------------------------------------------------------------------------
  • Verify code & architecture integrity (all 16 modules, trademarks, CSS):
      npm run verify:integrity
      (or: node .agents/skills/doodle-strike-architect/scripts/verify-integrity.js)

  • Audit a specific map for detailing, colliders, grapple clearances & 60fps:
      npm run audit:map <mapKey>
      (or: node .agents/skills/universal-detailing-standard/scripts/verify-detailing.js <mapKey>)
      Options:
        --heal, -h : Enable automated self-healing geometry & headroom carve-out!
      Examples:
        npm run audit:map clockwork
        npm run audit:map all -- --heal

  • Audit a concept document before coding (checks all 13 sections, prop tiers, stair math, clearances):
      npm run audit:concept [conceptName]
      (or: node audit-concept.js [conceptName|all])
      Examples:
        npm run audit:concept seas
        npm run audit:concept all

  • Simulate bot traversal flow, vantage sightlines & spawn safety:
      npm run map:simulate <mapKey|all>
      (or: node src/map-simulate.js <mapKey>)
      Example:
        npm run map:simulate clockwork

2. 🏗️ SMART SCAFFOLDING & SELF-LEARNING
--------------------------------------------------------------------------------
  • Synthesize creative concepts with high-density prop taxonomies (Tiers 1-4):
      npm run map:dream <mapName> [themeCategory]
      Themes: zen, cyber, steampunk, colossal, maritime
      Examples:
        npm run map:dream neon_metro cyber
        npm run map:dream clockwork_forge steampunk

  • Safely inject props into empty spatial pockets with zero collisions:
      npm run map:inject <mapKey> [theme]
      Examples:
        npm run map:inject clockwork steampunk
        npm run map:inject zen zen

  • Scaffold a new production-ready map with pre-calculated safe geometry & concept doc:
      npm run map:scaffold <mapName> [preset]
      Presets: urban, colossal, anomalous, kinetic
      Examples:
        npm run map:scaffold cyber_plaza urban
        npm run map:scaffold space_station anomalous

  • View & manage self-learning rule memory & pattern remedies:
      npm run map:learn
      (or: node src/map-learning.js --history)

  • Package a map level and its concept into an exportable snapshot:
      npm run map:pack <mapKey>
      (or: node src/map-pack.js <mapKey>)

  • Graduate a finished map from map_concepts/ to Map Description/:
      npm run graduate <mapName>
      (or: node graduate-map.js <mapName>)
      Example:
        npm run graduate clockwork

3. 💬 CHAT PROMPT COMMANDS (What you can say to any AI)
--------------------------------------------------------------------------------
  [MODE 1: CHECK & AUDIT]
    "Check the [Map Name] map with auto-healing"
    "Audit the concept doc for [Map Name]"
    "Are there any collision or detailing issues on [Map Name]?"

  [MODE 2: BUILD & SCAFFOLD]
    "Scaffold a new map called [Map Name] using the [urban/colossal/anomalous/kinetic] preset"
    "Build [Map Name] following the Universal Detailing Standard"
    "Upgrade the object detailing on [Map Name]"

  [MODE 3: BRAINSTORM & THEMATIC IDEATION]
    "Brainstorm 3 new map concepts for Doodle Strike"
    "Brainstorm objects, props, and landmarks that suit [Map Name]"
    "Write a complete concept document for [Idea Name] into map_concepts/"

  [MODE 4: GRADUATE & PROMOTE]
    "Graduate [Map Name] to Map Description"

4. 🚀 DEVELOPMENT COMMANDS
--------------------------------------------------------------------------------
  • Start dev server:       npm run dev        (runs at http://localhost:3000)
  • Build production:       npm run build
  • Lint check:             npm run lint
  • Show this help menu:    npm run help       (or: node help.js)

================================================================================
  Reference Standards & Learned Memory:
    - Detailing:  .agents/skills/universal-detailing-standard/SKILL.md
    - Memory:     .agents/learning-cache.json
    - Architect:  .agents/skills/doodle-strike-architect/SKILL.md
    - Rules:      .agents/rules/universal-detailing.md & architecture-guard.md
================================================================================
`);
