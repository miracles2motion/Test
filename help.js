#!/usr/bin/env node
/**
 * Doodle Strike - Developer & AI Command Reference (CLI Help)
 * Run anytime with: npm run help  OR  node help.js
 */

console.log(`
================================================================================
🎮 DOODLE STRIKE - QUICK REFERENCE GUIDE
================================================================================

💬 DREAM NATURAL LANGUAGE COMMANDS:
  • dream inspect <map>       Inspect map geometry, stairs, and grapple points
  • dream heal <map>          Auto-carve headroom and fix stair physics
  • dream build <theme> <map> Build a brand new map from scratch
  • dream teach / pending     Answer Dream when it asks for design guidance
  • dream ?                   Show the complete plain-English Dream feature guide

🗺️ REGISTERED MAPS:
  district, classroom, seas, clockwork, castle, zen, pirate_cove, library

⚡ COMMON NPM CLI COMMANDS:
  • Start game:               npm run dev
  • Build production:         npm run build
  • Plain-English Dream Help: npm run dream:help
  • Fast Map Inspection:      npm run map:inspect [mapName]
  • Auto-Repair Map:          npm run map:heal <mapName>
  • Verify 12/12 Quality:     npm run audit:map [mapName]
  • Create 3-Lane Scaffold:   npm run map:scaffold <mapName> [preset]
  • Sync Feature Registry:    npm run dream:sync
================================================================================
`);
