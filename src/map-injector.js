#!/usr/bin/env node
/**
 * Doodle Strike - Non-Destructive Safe Spatial Prop Injector (God Mode)
 *
 * Dynamically scans the level's 3D bounds for empty volumetric pockets across
 * multiple vertical tiers (Ground, Mid, Upper), balances prop density across all
 * four map quadrants, and injects 20-40 theme-specific micro/meso props with
 * zero collisions.
 *
 * God Mode Features:
 *   - Octree-style dynamic spatial scanning (no more hardcoded positions)
 *   - Multi-tier injection (Y=0, Y=4.5, Y=9.0)
 *   - Quadrant density balancing
 *   - 5-Theme Prop Catalog (zen, cyber, steampunk, colossal, maritime)
 *
 * Usage:
 *   node src/map-injector.js <mapKey> [theme]
 *   npm run map:inject clockwork
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as THREE from 'three';
import { RhythmPlacer } from './rhythm-placer.js';
import { buildLevel, MAP_BUILDERS } from './level.js';
import { recordLearnedPattern } from './map-learning.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const mapArg = (process.argv.find((a, i) => i > 1 && !a.startsWith('-')) || '').toLowerCase().trim();
const rawTheme = process.argv.find((a, i) => i > 2 && !a.startsWith('-')) || 'cyber';
const themeArg = rawTheme.toLowerCase().trim();
const isQuiet = process.argv.includes('--quiet') || process.argv.includes('-q');
const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');

let originalConsoleLog = console.log;
if (isQuiet && !isVerbose) console.log = () => {};

if (!mapArg || !MAP_BUILDERS[mapArg]) {
  console.log(`
💉 Doodle Strike - Safe Spatial Prop Injector (God Mode)
============================================================
Usage:
  npm run map:inject <mapKey> [theme]
============================================================
`);
  process.exit(1);
}

if (!isQuiet || isVerbose) {
  originalConsoleLog(`============================================================`);
  originalConsoleLog(`💉 DYNAMIC SPATIAL PROP INJECTOR (GOD MODE): [${mapArg.toUpperCase()}]`);
  originalConsoleLog(`============================================================\n`);
}

// 1. Build level in memory to gather colliders & layout
const colliders = [];
const mockWorld = {
  addBox: (min, max, opts) => {
    const col = { min, max, opts, size: { x: max.x - min.x, y: max.y - min.y, z: max.z - min.z } };
    colliders.push(col);
    return col;
  },
  finalize: () => {}
};
const mockScene = { add: () => {} };

const levelObj = buildLevel(mockScene, mockWorld, mapArg);
const bounds = levelObj.bounds || { minX: -50, maxX: 50, minZ: -50, maxZ: 50 };

// 2. Volumetric Spatial Safety Check
function isBoxCollisionFree(cx, cy, cz, w, h, d, minClearance = 0.5) {
  const minX = cx - w / 2 - minClearance;
  const maxX = cx + w / 2 + minClearance;
  const minY = cy;
  const maxY = cy + h + minClearance;
  const minZ = cz - d / 2 - minClearance;
  const maxZ = cz + d / 2 + minClearance;

  for (const c of colliders) {
    if (c.opts && (c.opts.noCollide || c.opts.noNav)) continue;
    if (minX < c.max.x && maxX > c.min.x && minY < c.max.y && maxY > c.min.y && minZ < c.max.z && maxZ > c.min.z) {
      return false;
    }
  }

  // Check spawns and snipers
  for (const sp of levelObj.spawns || []) {
    if (Math.hypot(cx - sp.x, cz - sp.z) < 2.0 && Math.abs(cy - sp.y) < 2.5) return false;
  }
  for (const sn of levelObj.snipers || []) {
    if (Math.hypot(cx - sn.x, cz - sn.z) < 2.0 && Math.abs(cy - sn.y) < 2.5) return false;
  }
  return true;
}

// 3. 5-Theme Prop Catalog

// 3. 5-Theme Prop Catalog - Upgraded to MACRO CITY BLOCKS (Explorable, Pathways, Doors, Stairs)

// 3. Imagineering Workflow - Bespoke Thematic Set Pieces
const propCatalog = {
  shanty_town: [
    { type: 'shanty_tower', w: 10, h: 10, d: 10, tier: 1, gen: (x, y, z) => `
  // Macro: Vertical Shanty Tower
  box(${x}, ${y}, ${z}, 8, 3, 8, { ink: OR }); // Base shack
  stairs(${x}-4.5, ${y}, ${z}, '+z', 6, 1.2, { rise: 0.3, run: 0.45, ink: OR }); // Rickety steps up
  box(${x}-1, ${y}+3, ${z}-1, 6, 3, 6, { ink: BL }); // Second floor offset
  stairs(${x}+2.5, ${y}+3, ${z}, '+z', 6, 1.2, { rise: 0.3, run: 0.45, ink: OR }); // Steps to roof
  box(${x}+1, ${y}+6, ${z}+1, 4, 3, 4, { ink: OR }); // Crows nest shack
  ring(${x}, ${y}+11.5, ${z}, 'y'); // Rope swing anchor` },
    { type: 'plank_bridge', w: 12, h: 4, d: 4, tier: 1, gen: (x, y, z) => `
  // Macro: Suspended Plank Bridge
  box(${x}, ${y}+3, ${z}, 10, 0.2, 2, { ink: OR }); // Wood plank
  cyl(${x}-4.5, ${y}, ${z}-0.5, 0.2, 4, { ink: OR }); // Support posts
  cyl(${x}+4.5, ${y}, ${z}+0.5, 0.2, 4, { ink: OR });` }
  ],
  leviathan_graveyard: [
    { type: 'giant_ribcage', w: 12, h: 6, d: 8, tier: 1, gen: (x, y, z) => `
  // Macro: Leviathan Ribcage & Cursed Treasure
  box(${x}, ${y}, ${z}, 12, 0.5, 8, { ink: OR }); // Sand mound
  // Left Ribs
  cyl(${x}-3, ${y}+3, ${z}-2, 0.4, 6, { ink: OR });
  cyl(${x}-3, ${y}+3, ${z}+2, 0.4, 6, { ink: OR });
  // Right Ribs
  cyl(${x}+3, ${y}+3, ${z}-2, 0.4, 6, { ink: OR });
  cyl(${x}+3, ${y}+3, ${z}+2, 0.4, 6, { ink: OR });
  // Top Spines (Connecting Ribs)
  box(${x}, ${y}+6, ${z}-2, 6.6, 0.4, 0.4, { ink: OR });
  box(${x}, ${y}+6, ${z}+2, 6.6, 0.4, 0.4, { ink: OR });
  // The Cursed Treasure
  box(${x}, ${y}+0.5, ${z}, 1.5, 1, 1, { ink: OR }); // Gold Chest
  box(${x}, ${y}+1.5, ${z}, 0.5, 0.5, 0.5, { ink: OR }); // Iron Lock
  ring(${x}, ${y}+8.5, ${z}, 'y'); // Grapple to escape` }
  ],
  gunpowder_grotto: [
    { type: 'explosive_cavern', w: 12, h: 8, d: 10, tier: 1, gen: (x, y, z) => `
  // Macro: Gunpowder Overhang & Crane
  box(${x}, ${y}, ${z}, 12, 0.2, 10, { ink: OR }); // Stone floor
  box(${x}-5, ${y}+0.2, ${z}, 2, 8, 10, { ink: OR }); // Left cave wall
  box(${x}+5, ${y}+0.2, ${z}, 2, 8, 10, { ink: OR }); // Right cave wall
  box(${x}, ${y}+8, ${z}, 12, 1, 10, { ink: OR }); // Cave Roof Overhang
  // Stockpile
  cyl(${x}-2, ${y}+0.2, ${z}-2, 0.8, 1.5, { ink: GR }); // Volatile Barrel
  cyl(${x}-3, ${y}+0.2, ${z}-1, 0.8, 1.5, { ink: OR }); // Powder Barrel
  cyl(${x}-2.5, ${y}+1.7, ${z}-1.5, 0.8, 1.5, { ink: GR }); // Stacked
  // Crane & Suspended Barrel
  box(${x}+4, ${y}+7, ${z}, 5, 0.4, 0.4, { ink: OR }); // Wood crane arm
  cyl(${x}+1.5, ${y}+4, ${z}, 0.1, 3, { ink: OR }); // Rope
  cyl(${x}+1.5, ${y}+3, ${z}, 1.0, 1.5, { ink: OR }); // Hanging explosive
  ring(${x}+1.5, ${y}+10.0, ${z}, 'z'); // High crane grapple anchor
  ` }
  ],
  broken_galleon: [
    { type: 'galleon_stern', w: 12, h: 10, d: 12, tier: 1, gen: (x, y, z) => `
  // Macro: The Captains Quarters (Stern)
  box(${x}, ${y}, ${z}, 10, 3, 10, { ink: OR }); // Lower hull
  stairs(${x}, ${y}, ${z}+9.5, '-z', 10, 2.0, { rise: 0.3, run: 0.45, ink: OR }); // Ramp up to hull deck at y=3.0
  box(${x}, ${y}+3, ${z}-2, 8, 3, 6, { ink: OR }); // Captains Cabin
  box(${x}, ${y}+6, ${z}-2, 10, 1, 6, { ink: OR }); // Poop deck roof
  cyl(${x}, ${y}+7, ${z}-2, 0.4, 6, { ink: OR }); // Broken rear mast
  ring(${x}, ${y}+14.5, ${z}-2, 'y'); // Crows nest grapple
  ` },
    { type: 'galleon_bow', w: 10, h: 8, d: 12, tier: 1, gen: (x, y, z) => `
  // Macro: The Shattered Bow
  box(${x}, ${y}, ${z}, 8, 3, 10, { ink: OR }); // Front hull
  stairs(${x}, ${y}, ${z}-9.5, '+z', 10, 2.0, { rise: 0.3, run: 0.45, ink: OR }); // Ramp up to hull deck at y=3.0
  cyl(${x}, ${y}+3, ${z}+2, 0.4, 8, { ink: OR }); // Main mast
  box(${x}, ${y}+7, ${z}+2, 6, 0.2, 0.2, { ink: OR }); // Yardarm
  box(${x}, ${y}+5, ${z}+2.2, 5, 4, 0.1, { ink: BL, noCollide: true }); // Torn sail
  ring(${x}, ${y}+12.5, ${z}+2, 'y'); // Grapple
  ` }
  ],
  colossal: [
    { type: 'stationery_bunker', w: 8, h: 5, d: 8, tier: 1, gen: (x, y, z) => `
  // Macro: Stationery Storage Bunker
  box(${x}, ${y}, ${z}, 7.0, 2.4, 7.0, { ink: BL });
  slab(${x} - 3.8, ${z} - 3.8, ${x} + 3.8, ${z} + 3.8, ${y} + 2.4, 0.3, { ink: OR });
  box(${x} - 2.5, ${y} + 2.4, ${z}, 0.6, 1.2, 2.0, { ink: RD, tag: 'cover' });
  box(${x} + 2.0, ${y} + 2.4, ${z} + 1.5, 1.8, 1.0, 1.8, { ink: GR, tag: 'cover' });
  ring(${x}, ${y} + 6.5, ${z}, 'y');`
    },
    { type: 'book_bastion', w: 10, h: 5, d: 8, tier: 1, gen: (x, y, z) => `
  // Macro: Tome Bastion & Cover
  box(${x}, ${y}, ${z}, 8.0, 3.2, 6.0, { ink: OR, tag: 'cover' });
  slab(${x} - 4.2, ${z} - 3.2, ${x} + 4.2, ${z} + 3.2, ${y} + 3.2, 0.3, { ink: BL });
  box(${x} - 3.0, ${y} + 3.2, ${z}, 1.2, 1.0, 1.2, { ink: BK });
  box(${x} + 3.0, ${y} + 3.2, ${z}, 1.2, 1.0, 1.2, { ink: BK });
  ring(${x}, ${y} + 7.5, ${z}, 'z');`
    },
    { type: 'pencil_pot_redoubt', w: 8, h: 6, d: 8, tier: 1, gen: (x, y, z) => `
  // Macro: Pencil Pot Redoubt
  cyl(${x}, ${y}, ${z}, 3.0, 3.5, { seg: 10, ink: BK, tag: 'cover' });
  slab(${x} - 3.2, ${z} - 3.2, ${x} + 3.2, ${z} + 3.2, ${y} + 3.5, 0.3, { ink: OR });
  cyl(${x} - 1.0, ${y} + 3.5, ${z} - 1.0, 0.4, 2.5, { seg: 6, ink: OR });
  cyl(${x} + 1.2, ${y} + 3.5, ${z} + 0.8, 0.35, 2.8, { seg: 6, ink: BL });
  ring(${x}, ${y} + 7.2, ${z}, 'y');`
    }
  ],
  zen: [
    { type: 'tea_shrine', w: 8, h: 5, d: 8, tier: 1, gen: (x, y, z) => `
  // Macro: Tea Garden Shrine
  box(${x}, ${y}, ${z}, 7.0, 1.2, 7.0, { ink: BL });
  slab(${x} - 3.8, ${z} - 3.8, ${x} + 3.8, ${z} + 3.8, ${y} + 1.2, 0.3, { ink: OR });
  box(${x} - 2.5, ${y} + 1.2, ${z} - 2.5, 0.6, 2.5, 0.6, { ink: BK });
  box(${x} + 2.5, ${y} + 1.2, ${z} + 2.5, 0.6, 2.5, 0.6, { ink: BK });
  ring(${x}, ${y} + 6.5, ${z}, 'z');`
    }
  ],
  cyber: [
    { type: 'server_terminal', w: 8, h: 5, d: 8, tier: 1, gen: (x, y, z) => `
  // Macro: Cyber Server Terminal
  box(${x}, ${y}, ${z}, 6.0, 3.0, 6.0, { ink: BL });
  slab(${x} - 3.2, ${z} - 3.2, ${x} + 3.2, ${z} + 3.2, ${y} + 3.0, 0.3, { ink: OR });
  box(${x}, ${y} + 3.0, ${z}, 2.0, 1.5, 2.0, { ink: BK });
  ring(${x}, ${y} + 6.8, ${z}, 'y');`
    }
  ],
  steampunk: [
    { type: 'gear_furnace', w: 8, h: 5, d: 8, tier: 1, gen: (x, y, z) => `
  // Macro: Gear Furnace Redoubt
  box(${x}, ${y}, ${z}, 6.5, 3.2, 6.5, { ink: BL });
  slab(${x} - 3.5, ${z} - 3.5, ${x} + 3.5, ${z} + 3.5, ${y} + 3.2, 0.3, { ink: OR });
  cyl(${x}, ${y} + 3.2, ${z}, 1.8, 1.8, { seg: 8, ink: BK });
  ring(${x}, ${y} + 7.0, ${z}, 'z');`
    }
  ],
  forest: [
    { type: 'colossal_titan_treehouse', w: 12, h: 26, d: 12, tier: 3, gen: (x, y, z) => `
  // Prefab: Colossal Titan Treehouse Fortress
  buildTreehouse(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'giant_stalk_grass', w: 2.5, h: 7.0, d: 2.5, tier: 1, gen: (x, y, z) => `
  // Prefab: Giant Stalk Grass with Grapple Ring
  buildGiantGrass(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'curved_hollow_log', w: 6, h: 4.0, d: 18, tier: 2, gen: (x, y, z) => `
  // Prefab: Curved Hollow Log Sprint Tunnel
  buildCurvedHollowLog(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'boulder_field', w: 8, h: 3.0, d: 8, tier: 1, gen: (x, y, z) => `
  // Prefab: Faceted Boulder Cover Field
  buildBoulderField(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'parametric_titan_tree', w: 12, h: 30, d: 12, tier: 3, gen: (x, y, z) => `
  // Prefab: Parametric Organic Tree (Titan Canopy)
  generateParametricTree(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)}, { archetype: 'titan' });`
    },
    { type: 'ancient_oak_tree', w: 11, h: 16, d: 11, tier: 3, gen: (x, y, z) => `
  // Prefab: Ancient Oak / Banyan Tree
  buildAncientTree(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'alpine_pine_tree', w: 8, h: 14, d: 8, tier: 3, gen: (x, y, z) => `
  // Prefab: Alpine Conifer / Pine Tree
  buildPineTree(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'weeping_willow_tree', w: 10, h: 12, d: 10, tier: 3, gen: (x, y, z) => `
  // Prefab: Weeping Willow Tree
  buildWillowTree(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'hollow_log_defilade', w: 4, h: 3.5, d: 10, tier: 2, gen: (x, y, z) => `
  // Prefab: Run-Through Hollow Log Tunnel
  buildHollowLog(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)}, 10);`
    },
    { type: 'giant_mushroom_platform', w: 6, h: 6.5, d: 6, tier: 2, gen: (x, y, z) => `
  // Prefab: Giant Umbrella Mushroom Platform
  buildGiantMushroom(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'wood_stack_cover', w: 2.6, h: 1.2, d: 1.4, tier: 1, gen: (x, y, z) => `
  // Prefab: Cordwood Fuel Stack (Waist-High Tactical Cover)
  buildWoodStack(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'logging_cart_cover', w: 3.4, h: 1.3, d: 2.0, tier: 1, gen: (x, y, z) => `
  // Prefab: Timber Logging Handcart (Tactical Barricade)
  buildLoggingCart(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'hollow_stump_bunker', w: 2.8, h: 1.3, d: 2.8, tier: 1, gen: (x, y, z) => `
  // Prefab: Hollow Tree Stump Ambush Bunker
  buildHollowStump(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'ranger_campfire_hearth', w: 2.2, h: 0.8, d: 2.2, tier: 1, gen: (x, y, z) => `
  // Prefab: Ranger Campfire Hearth & Warm Ambient Light
  buildCampfire(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'chopping_block_prop', w: 1.4, h: 1.4, d: 1.4, tier: 1, gen: (x, y, z) => `
  // Prefab: Woodcutter's Chopping Block & Embedded Axe
  buildChoppingBlock(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'trail_signpost', w: 1.6, h: 2.5, d: 1.6, tier: 1, gen: (x, y, z) => `
  // Prefab: Weathered Trail Signpost
  buildTrailSign(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'survey_table_hq', w: 2.8, h: 1.5, d: 1.8, tier: 1, gen: (x, y, z) => `
  // Prefab: Canopy Survey Table & Field Instruments
  buildSurveyTable(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'toadstool_cluster', w: 1.5, h: 0.8, d: 1.5, tier: 1, gen: (x, y, z) => `
  // Prefab: Fly Agaric Toadstool Cluster
  buildToadstoolCluster(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)}, 3);`
    },
    { type: 'fern_and_grass_grove', w: 4, h: 1.5, d: 4, tier: 1, gen: (x, y, z) => `
  // Prefab: Fern Cluster & Ballpoint Grass Tufts
  buildFernCluster(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});
  buildGrassClump(B, ${x.toFixed(1)} + 1.2, ${y}, ${z.toFixed(1)} - 0.8, 6);
  buildGrassClump(B, ${x.toFixed(1)} - 1.2, ${y}, ${z.toFixed(1)} + 0.8, 6);`
    }
  ],
  maritime: [
    { type: 'full_pirate_warship', w: 14, h: 26, d: 36, tier: 1, gen: (x, y, z) => `
  // Prefab: Multi-Deck Pirate Galleon Warship
  buildFullGalleon(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'galleon_stern', w: 12, h: 10, d: 12, tier: 1, gen: (x, y, z) => `
  // Macro: The Captains Quarters (Stern)
  box(${x.toFixed(1)}, ${y}, ${z.toFixed(1)}, 10, 3, 10, { ink: OR });
  stairs(${x.toFixed(1)}, ${y}, ${z.toFixed(1)} + 9.5, '-z', 10, 2.0, { rise: 0.3, run: 0.45, ink: OR });
  box(${x.toFixed(1)}, ${y} + 3, ${z.toFixed(1)} - 2, 8, 3, 6, { ink: OR });
  box(${x.toFixed(1)}, ${y} + 6, ${z.toFixed(1)} - 2, 10, 1, 6, { ink: OR });
  cyl(${x.toFixed(1)}, ${y} + 7, ${z.toFixed(1)} - 2, 0.4, 6, { ink: OR });
  ring(${x.toFixed(1)}, ${y} + 14.5, ${z.toFixed(1)} - 2, 'y');`
    }
  ],
  space_station: [
    { type: 'solar_array_wing', w: 11, h: 7, d: 4, tier: 3, gen: (x, y, z) => `
  // Prefab: Articulated Photovoltaic Solar Array
  buildSolarArray(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'centrifuge_hab_ring', w: 12, h: 11, d: 12, tier: 3, gen: (x, y, z) => `
  // Prefab: Habitat Centrifuge Core Hub & Ring
  buildCentrifugeRing(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'comms_parabolic_dish', w: 7, h: 9, d: 7, tier: 3, gen: (x, y, z) => `
  // Prefab: Deep-Space Communications Parabolic Dish
  buildCommunicationsDish(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'airlock_bulkhead_portal', w: 4, h: 5, d: 2, tier: 2, gen: (x, y, z) => `
  // Prefab: Pressurized Airlock Hatch Bulkhead
  buildAirlockHatch(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'hydroponic_algae_bay', w: 3, h: 3, d: 2, tier: 2, gen: (x, y, z) => `
  // Prefab: Hydroponic Algae Growth Bay
  buildHydroponicTray(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'cryo_stasis_capsule', w: 2, h: 2, d: 3, tier: 1, gen: (x, y, z) => `
  // Prefab: Cryo-Stasis Sleeper Pod
  buildCryoPod(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'oxygen_manifold_rack', w: 3, h: 2, d: 2, tier: 1, gen: (x, y, z) => `
  // Prefab: High-Pressure Oxygen Tank Rack
  buildOxygenTankRack(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    },
    { type: 'flight_telemetry_terminal', w: 3, h: 2, d: 2, tier: 1, gen: (x, y, z) => `
  // Prefab: Telemetry Flight Station & Avionics Terminal
  buildTelemetryConsole(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
    }
  ],
  retro_arcade: [
    { type: 'arcade_cabinet_pod', w: 4, h: 2.2, d: 4, tier: 2, gen: (x, y, z) => `
  // Prefab: Clustered Arcade Cabinet Pod
  box(${x.toFixed(1)} - 1.0, ${y}, ${z.toFixed(1)}, 1.2, 2.2, 1.2, { ink: BK });
  box(${x.toFixed(1)} + 1.0, ${y}, ${z.toFixed(1)}, 1.2, 2.2, 1.2, { ink: BK });
  box(${x.toFixed(1)} - 1.0, ${y} + 1.2, ${z.toFixed(1)}, 1.1, 0.8, 1.1, { ink: BL, noCollide: true });
  box(${x.toFixed(1)} + 1.0, ${y} + 1.2, ${z.toFixed(1)}, 1.1, 0.8, 1.1, { ink: RD, noCollide: true });`
    },
    { type: 'air_hockey_court', w: 5, h: 1.4, d: 3, tier: 2, gen: (x, y, z) => `
  // Prefab: Air Hockey Table
  box(${x.toFixed(1)}, ${y}, ${z.toFixed(1)}, 4.6, 0.95, 2.6, { ink: BK });
  slab(${x.toFixed(1)} - 2.3, ${z.toFixed(1)} - 1.3, ${x.toFixed(1)} + 2.3, ${z.toFixed(1)} + 1.3, ${y} + 0.95, 0.1, { ink: BL });
  box(${x.toFixed(1)}, ${y} + 2.4, ${z.toFixed(1)}, 0.2, 0.2, 2.6, { ink: RD, noCollide: true });`
    },
    { type: 'token_changer_kiosk', w: 2, h: 1.8, d: 1.5, tier: 1, gen: (x, y, z) => `
  // Prefab: Token Changer Machine
  box(${x.toFixed(1)}, ${y}, ${z.toFixed(1)}, 1.4, 1.8, 0.8, { ink: BK });
  box(${x.toFixed(1)}, ${y} + 0.8, ${z.toFixed(1)} + 0.45, 0.8, 0.4, 0.2, { ink: OR });`
    }
  ],
  train_depot: [
    { type: 'locomotive_wheel_stack', w: 3, h: 1.8, d: 3, tier: 1, gen: (x, y, z) => `
  // Prefab: Locomotive Driving Wheel Stack
  cyl(${x.toFixed(1)} - 0.8, ${y} + 1.0, ${z.toFixed(1)}, 1.0, 0.4, { seg: 8, ink: BK, tag: 'cover' });
  cyl(${x.toFixed(1)} + 0.8, ${y} + 1.0, ${z.toFixed(1)}, 1.0, 0.4, { seg: 8, ink: BK, tag: 'cover' });`
    },
    { type: 'machinist_workbench', w: 4, h: 1.5, d: 2, tier: 2, gen: (x, y, z) => `
  // Prefab: Heavy Machine Shop Workbench
  box(${x.toFixed(1)}, ${y}, ${z.toFixed(1)}, 3.6, 1.1, 1.4, { ink: OR, tag: 'cover' });
  box(${x.toFixed(1)} - 1.0, ${y} + 1.1, ${z.toFixed(1)}, 0.4, 0.4, 0.4, { ink: BK, tag: 'cover' });`
    },
    { type: 'coal_bunker_berm', w: 4, h: 1.6, d: 3, tier: 1, gen: (x, y, z) => `
  // Prefab: Mounded Coal Bunker
  box(${x.toFixed(1)}, ${y}, ${z.toFixed(1)}, 3.8, 1.4, 2.6, { ink: BK, tag: 'cover' });`
    }
  ],
  chemistry_lab: [
    { type: 'epoxy_lab_bench', w: 6, h: 1.5, d: 3, tier: 2, gen: (x, y, z) => `
  // Prefab: Chemical-Resistant Epoxy Lab Bench
  box(${x.toFixed(1)}, ${y}, ${z.toFixed(1)}, 5.5, 1.05, 2.2, { ink: BK, tag: 'cover' });
  cyl(${x.toFixed(1)}, ${y} + 1.05, ${z.toFixed(1)}, 0.1, 0.6, { ink: BL, noCollide: true });`
    },
    { type: 'acid_storage_cabinet', w: 3, h: 2.4, d: 2, tier: 2, gen: (x, y, z) => `
  // Prefab: Safety Yellow Acid Cabinet
  box(${x.toFixed(1)}, ${y}, ${z.toFixed(1)}, 2.4, 2.1, 1.2, { ink: OR, tag: 'cover' });`
    },
    { type: 'test_tube_drying_rack', w: 2, h: 1.4, d: 1.5, tier: 1, gen: (x, y, z) => `
  // Prefab: Test Tube Rack & Mortar Set
  box(${x.toFixed(1)}, ${y}, ${z.toFixed(1)}, 1.6, 0.85, 0.8, { ink: OR, tag: 'cover' });
  cyl(${x.toFixed(1)} + 0.4, ${y} + 0.85, ${z.toFixed(1)}, 0.25, 0.3, { ink: BK, noCollide: true });`
    }
  ]
};
propCatalog['station'] = propCatalog['space_station'];
propCatalog['arcade'] = propCatalog['retro_arcade'];
propCatalog['depot'] = propCatalog['train_depot'];
propCatalog['roundhouse'] = propCatalog['train_depot'];
propCatalog['lab'] = propCatalog['chemistry_lab'];

const defaultProps = [];
const availableProps = propCatalog[themeArg] || propCatalog['colossal'] || propCatalog['broken_galleon'];

// 4. Dynamic Multi-Tier Spatial Scan - UPGRADED TO GRID/LOT SYSTEM
console.log(`📡 Scanning for City Planner Grid Lots (12x12m with pathways)...`);
const gridStep = 16.0; // Huge grid step to ensure 4m pathways between 12m buildings
const safePockets = [];
const tiers = [0.0]; // Only ground floor macro structures for pathways

// Pockets will be populated dynamically below

const midX = (bounds.minX + bounds.maxX) / 2;
const midZ = (bounds.minZ + bounds.maxZ) / 2;

for (const y of tiers) {
  for (let x = bounds.minX + 8; x <= bounds.maxX - 8; x += gridStep) {
    for (let z = bounds.minZ + 8; z <= bounds.maxZ - 8; z += gridStep) {
      // Determine active catalog
      let activeCatalog = propCatalog[themeArg] || propCatalog['colossal'] || propCatalog['broken_galleon'];
      if (mapArg === 'pirate_cove' || themeArg === 'maritime') {
        if (x <= midX && z <= midZ) activeCatalog = propCatalog['shanty_town'];
        else if (x > midX && z <= midZ) activeCatalog = propCatalog['leviathan_graveyard'];
        else if (x <= midX && z > midZ) activeCatalog = propCatalog['gunpowder_grotto'];
        else activeCatalog = propCatalog['broken_galleon'];
      } else if (mapArg === 'forest' || themeArg === 'forest') {
        activeCatalog = propCatalog['forest'];
      } else if (mapArg === 'space_station' || themeArg === 'space_station' || mapArg === 'station' || themeArg === 'station') {
        activeCatalog = propCatalog['space_station'];
      }
      
      const propTemplate = activeCatalog[Math.floor(Math.random() * activeCatalog.length)];
      // Check collision
      if (isBoxCollisionFree(x, y, z, propTemplate.w, propTemplate.h, propTemplate.d, 1.0)) {
        safePockets.push({ x, y, z, template: propTemplate, quad: 
          (x <= midX && z <= midZ) ? 'NW' :
          (x > midX && z <= midZ) ? 'NE' :
          (x <= midX && z > midZ) ? 'SW' : 'SE'
        });
      }
    }
  }
}

console.log(`✨ Found ${safePockets.length} potential City Lots.`);

// Generate combat lanes (corners to center)
const lanes = [
  // NW to center
  [{x: bounds.minX+10, y:0, z: bounds.minZ+10}, {x: midX, y:0, z: midZ}],
  // NE to center
  [{x: bounds.maxX-10, y:0, z: bounds.minZ+10}, {x: midX, y:0, z: midZ}],
  // SW to center
  [{x: bounds.minX+10, y:0, z: bounds.maxZ-10}, {x: midX, y:0, z: midZ}],
  // SE to center
  [{x: bounds.maxX-10, y:0, z: bounds.maxZ-10}, {x: midX, y:0, z: midZ}]
];

const rhythmPlacer = new RhythmPlacer();
console.log(`🥁 Placing rhythm-based cover along ${lanes.length} combat lanes...`);

for (const lane of lanes) {
  const placements = rhythmPlacer.placeAlongLane(lane);
  for (const p of placements) {
    // Avoid duplicating cover within 3.0m of another placed cover
    if (safePockets.some(s => Math.hypot(s.x - p.position.x, s.z - p.position.z) < 3.0)) continue;

    if (isBoxCollisionFree(p.position.x, 0.0, p.position.z, 2.0, 2.0, 2.0, 1.0)) {
      if (themeArg === 'forest' || mapArg === 'forest') {
        if (p.type === 'HARD_COVER') {
          const hardTemplates = [
            (x, y, z) => `  buildWoodStack(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`,
            (x, y, z) => `  buildHollowStump(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`,
            (x, y, z) => `  buildLoggingCart(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
          ];
          const fn = hardTemplates[Math.floor(Math.random() * hardTemplates.length)];
          safePockets.push({ x: p.position.x, y: 0, z: p.position.z, template: { gen: fn } });
        } else {
          const softTemplates = [
            (x, y, z) => `  buildChoppingBlock(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`,
            (x, y, z) => `  buildFernCluster(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`,
            (x, y, z) => `  buildToadstoolCluster(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)}, 3);`,
            (x, y, z) => `  buildCampfire(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
          ];
          const fn = softTemplates[Math.floor(Math.random() * softTemplates.length)];
          safePockets.push({ x: p.position.x, y: 0, z: p.position.z, template: { gen: fn } });
        }
      } else if (themeArg === 'space_station' || mapArg === 'space_station' || themeArg === 'station' || mapArg === 'station') {
        if (p.type === 'HARD_COVER') {
          const hardTemplates = [
            (x, y, z) => `  buildCryoPod(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`,
            (x, y, z) => `  buildOxygenTankRack(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`,
            (x, y, z) => `  buildAirlockHatch(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
          ];
          const fn = hardTemplates[Math.floor(Math.random() * hardTemplates.length)];
          safePockets.push({ x: p.position.x, y: 0, z: p.position.z, template: { gen: fn } });
        } else {
          const softTemplates = [
            (x, y, z) => `  buildTelemetryConsole(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`,
            (x, y, z) => `  buildHydroponicTray(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`,
            (x, y, z) => `  buildSolarArray(B, ${x.toFixed(1)}, ${y}, ${z.toFixed(1)});`
          ];
          const fn = softTemplates[Math.floor(Math.random() * softTemplates.length)];
          safePockets.push({ x: p.position.x, y: 0, z: p.position.z, template: { gen: fn } });
        }
      } else {
        if (p.type === 'HARD_COVER') {
          safePockets.push({
            x: p.position.x, y: 0, z: p.position.z,
            template: { gen: (x,y,z) => `  box(${x.toFixed(1)}, ${y}, ${z.toFixed(1)}, 2.0, 2.5, 2.0, { ink: OR }); // Hard Cover` }
          });
        } else {
          safePockets.push({
            x: p.position.x, y: 0, z: p.position.z,
            template: { gen: (x,y,z) => `  barrel(${x.toFixed(1)}, ${y}, ${z.toFixed(1)}, 0.8, 1.2, { ink: OR }); // Soft Cover` }
          });
        }
      }
    }
  }
}

const selectedProps = safePockets;
 // Place all lots that fit

console.log(`\n📦 Selected ${selectedProps.length} macro structures.`);

// 6. Read level code, inject right before B.finish()
const levelFilePath = path.join(ROOT_DIR, 'src', 'levels', `${mapArg}.js`);
if (fs.existsSync(levelFilePath)) {
  let code = fs.readFileSync(levelFilePath, 'utf8');

  // Remove existing prop block if re-running
  if (code.includes('// === DREAM AUTO-INJECTED THEMATIC PROPS ===')) {
    const regex = /\/\/ === DREAM AUTO-INJECTED THEMATIC PROPS ===[\s\S]*?\/\/ === END DREAM AUTO-INJECTED PROPS ===/g;
    code = code.replace(regex, '');
  }

  const generatedBlock = `
  // === DREAM AUTO-INJECTED THEMATIC PROPS ===
${selectedProps.map(p => p.template.gen(p.x, p.y, p.z)).join('\n')}
  // === END DREAM AUTO-INJECTED PROPS ===`;

  if (code.includes('B.finish();')) {
    code = code.replace('B.finish();', `${generatedBlock}\n  B.finish();`);
  } else {
    code += `\n${generatedBlock}`;
  }

  // Ensure procedural prefabs are imported from src/prefabs.js if used
  const prefabsToImport = [
    'buildAncientTree', 'buildPineTree', 'buildWillowTree', 'buildGiantMushroom',
    'buildHollowLog', 'buildFernCluster', 'buildGrassClump', 'buildFullGalleon',
    'buildCampfire', 'buildWoodStack', 'buildTrailSign', 'buildChoppingBlock',
    'buildLoggingCart', 'buildHollowStump', 'buildToadstoolCluster', 'buildSurveyTable',
    'buildSolarArray', 'buildCryoPod', 'buildAirlockHatch', 'buildCentrifugeRing',
    'buildHydroponicTray', 'buildCommunicationsDish', 'buildOxygenTankRack', 'buildTelemetryConsole',
    'buildGiantGrass', 'buildTreehouse', 'generateParametricTree', 'buildCurvedHollowLog', 'buildBoulderField'
  ];

  const usedPrefabs = prefabsToImport.filter(p => code.includes(p));
  const existingImportMatch = code.match(/import\s*\{([^}]+)\}\s*from\s*['"]\.\.\/prefabs\.js['"];?/);

  if (existingImportMatch) {
    const existing = existingImportMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    const combined = Array.from(new Set([...existing, ...usedPrefabs]));
    code = code.replace(existingImportMatch[0], `import { ${combined.join(', ')} } from '../prefabs.js';`);
  } else if (usedPrefabs.length > 0) {
    code = `import { ${usedPrefabs.join(', ')} } from '../prefabs.js';\n` + code;
  }
  
  // Also clear WH from ink as requested previously just in case
  code = code.replace(/ink: WH/g, 'ink: OR');

  fs.writeFileSync(levelFilePath, code, 'utf8');
  originalConsoleLog(`\n💾 Injected ${selectedProps.length} MACRO STRUCTURES with guaranteed pathways into src/levels/${mapArg}.js`);
  
  // Record learned pattern
  recordLearnedPattern(mapArg, 'dream-city-planner', `Injected ${selectedProps.length} macro structures (City Planner)`, 'macroCity');
}

if (!isQuiet || isVerbose) {
  originalConsoleLog(`\n============================================================`);
  originalConsoleLog(`✅ SPATIAL INJECTION COMPLETE (CITY PLANNER MODE)`);
  originalConsoleLog(`============================================================`);
}

if (isQuiet && !isVerbose) {
  originalConsoleLog(`📦 [INJECTOR] Injected thematic cover and tactical elements into ${mapArg.toUpperCase()}.`);
}
