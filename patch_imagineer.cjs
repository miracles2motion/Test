const fs = require('fs');
let code = fs.readFileSync('src/map-injector.js', 'utf8');

const imagineerCode = `
// 3. Imagineering Workflow - Bespoke Thematic Set Pieces
const propCatalog = {
  shanty_town: [
    { type: 'shanty_tower', w: 10, h: 10, d: 10, tier: 1, gen: (x, y, z) => \`
  // Macro: Vertical Shanty Tower
  box(\${x}, \${y}, \${z}, 8, 3, 8, { ink: OR }); // Base shack
  stairs(\${x}-4.5, \${y}, \${z}, 1, 3, 2, 3, { ink: BK }); // Rickety steps up
  box(\${x}-1, \${y}+3, \${z}-1, 6, 3, 6, { ink: BL }); // Second floor offset
  stairs(\${x}+2.5, \${y}+3, \${z}, 1, 3, 2, 1, { ink: BK }); // Steps to roof
  box(\${x}+1, \${y}+6, \${z}+1, 4, 3, 4, { ink: OR }); // Crows nest shack
  ring(\${x}, \${y}+10, \${z}, 1.5, { ink: OR }); // Rope swing anchor\` },
    { type: 'plank_bridge', w: 12, h: 4, d: 4, tier: 1, gen: (x, y, z) => \`
  // Macro: Suspended Plank Bridge
  box(\${x}, \${y}+3, \${z}, 10, 0.2, 2, { ink: OR }); // Wood plank
  cyl(\${x}-4.5, \${y}, \${z}-0.5, 0.2, 4, { ink: BK }); // Support posts
  cyl(\${x}+4.5, \${y}, \${z}+0.5, 0.2, 4, { ink: BK });\` }
  ],
  leviathan_graveyard: [
    { type: 'giant_ribcage', w: 12, h: 6, d: 8, tier: 1, gen: (x, y, z) => \`
  // Macro: Leviathan Ribcage & Cursed Treasure
  box(\${x}, \${y}, \${z}, 12, 0.5, 8, { ink: BK }); // Sand mound
  // Left Ribs
  cyl(\${x}-3, \${y}+3, \${z}-2, 0.4, 6, { ink: WH });
  cyl(\${x}-3, \${y}+3, \${z}+2, 0.4, 6, { ink: WH });
  // Right Ribs
  cyl(\${x}+3, \${y}+3, \${z}-2, 0.4, 6, { ink: WH });
  cyl(\${x}+3, \${y}+3, \${z}+2, 0.4, 6, { ink: WH });
  // Top Spines (Connecting Ribs)
  box(\${x}, \${y}+6, \${z}-2, 6.6, 0.4, 0.4, { ink: WH });
  box(\${x}, \${y}+6, \${z}+2, 6.6, 0.4, 0.4, { ink: WH });
  // The Cursed Treasure
  box(\${x}, \${y}+0.5, \${z}, 1.5, 1, 1, { ink: OR }); // Gold Chest
  box(\${x}, \${y}+1.5, \${z}, 0.5, 0.5, 0.5, { ink: BK }); // Iron Lock
  ring(\${x}, \${y}+5, \${z}, 1.5, { ink: WH }); // Grapple to escape\` }
  ],
  gunpowder_grotto: [
    { type: 'explosive_cavern', w: 12, h: 8, d: 10, tier: 1, gen: (x, y, z) => \`
  // Macro: Gunpowder Overhang & Crane
  box(\${x}, \${y}, \${z}, 12, 0.2, 10, { ink: BK }); // Stone floor
  box(\${x}-5, \${y}+0.2, \${z}, 2, 8, 10, { ink: BK }); // Left cave wall
  box(\${x}+5, \${y}+0.2, \${z}, 2, 8, 10, { ink: BK }); // Right cave wall
  box(\${x}, \${y}+8, \${z}, 12, 1, 10, { ink: BK }); // Cave Roof Overhang
  // Stockpile
  cyl(\${x}-2, \${y}+0.2, \${z}-2, 0.8, 1.5, { ink: GR }); // Volatile Barrel
  cyl(\${x}-3, \${y}+0.2, \${z}-1, 0.8, 1.5, { ink: OR }); // Powder Barrel
  cyl(\${x}-2.5, \${y}+1.7, \${z}-1.5, 0.8, 1.5, { ink: GR }); // Stacked
  // Crane & Suspended Barrel
  box(\${x}+4, \${y}+7, \${z}, 5, 0.4, 0.4, { ink: OR }); // Wood crane arm
  cyl(\${x}+1.5, \${y}+4, \${z}, 0.1, 3, { ink: WH }); // Rope
  cyl(\${x}+1.5, \${y}+3, \${z}, 1.0, 1.5, { ink: OR }); // Hanging explosive
  ring(\${x}+1.5, \${y}+2, \${z}, 1.5, { ink: OR }); // Grapple onto the explosive!
  \` }
  ],
  broken_galleon: [
    { type: 'galleon_stern', w: 12, h: 10, d: 12, tier: 1, gen: (x, y, z) => \`
  // Macro: The Captains Quarters (Stern)
  box(\${x}, \${y}, \${z}, 10, 3, 10, { ink: OR }); // Lower hull
  stairs(\${x}, \${y}, \${z}+6, 2, 3, 2, 0, { ink: BK }); // Ramp into ship
  box(\${x}, \${y}+3, \${z}-2, 8, 3, 6, { ink: OR }); // Captains Cabin
  stairs(\${x}-4.5, \${y}+3, \${z}+1, 1, 3, 2, 3, { ink: BK }); // Left stairs to poop deck
  stairs(\${x}+4.5, \${y}+3, \${z}+1, 1, 3, 2, 1, { ink: BK }); // Right stairs to poop deck
  box(\${x}, \${y}+6, \${z}-2, 10, 1, 6, { ink: OR }); // Poop deck roof
  cyl(\${x}, \${y}+7, \${z}-2, 0.4, 6, { ink: BK }); // Broken rear mast
  ring(\${x}, \${y}+13, \${z}-2, 1.5, { ink: OR }); // Crows nest grapple
  \` },
    { type: 'galleon_bow', w: 10, h: 8, d: 12, tier: 1, gen: (x, y, z) => \`
  // Macro: The Shattered Bow
  box(\${x}, \${y}, \${z}, 8, 3, 10, { ink: OR }); // Front hull
  stairs(\${x}, \${y}+3, \${z}-6, 2, -3, 2, 2, { ink: BK }); // Ramps down into the sand
  cyl(\${x}, \${y}+3, \${z}+2, 0.4, 8, { ink: BK }); // Main mast
  box(\${x}, \${y}+7, \${z}+2, 6, 0.2, 0.2, { ink: BK }); // Yardarm
  box(\${x}, \${y}+5, \${z}+2.2, 5, 4, 0.1, { ink: BL, noCollide: true }); // Torn sail
  ring(\${x}, \${y}+11, \${z}+2, 1.5, { ink: OR }); // Grapple
  \` }
  ]
};
`;

// Extract everything before propCatalog
const topPart = code.split('const propCatalog = {')[0];

const middlePartRaw = code.split('const defaultProps =')[1];
const placementLogicRaw = middlePartRaw.split('const placementLogic =')[1]; // Wait, I didn't save it as a variable in the file.
// Let's just do a regex replace on the old catalog.

code = code.replace(/const propCatalog = \{[\s\S]*?\n\};\n/m, imagineerCode);

// Also update the zone assignments
code = code.replace(/activeCatalog = propCatalog\['skull_city'\];/g, "activeCatalog = propCatalog['shanty_town'];");
code = code.replace(/activeCatalog = propCatalog\['shipyard'\];/g, "activeCatalog = propCatalog['leviathan_graveyard'];");
code = code.replace(/activeCatalog = propCatalog\['treasure_market'\];/g, "activeCatalog = propCatalog['gunpowder_grotto'];");
code = code.replace(/activeCatalog = propCatalog\['fortress'\];/g, "activeCatalog = propCatalog['broken_galleon'];");

// Update scatter logic to use natural/wood colors for barrels
code = code.replace(/\{ ink: BK \}/g, "{ ink: OR }"); 

fs.writeFileSync('src/map-injector.js', code);
console.log('Patched map-injector.js with Imagineer Blueprints');
