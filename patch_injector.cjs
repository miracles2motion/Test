const fs = require('fs');

let code = fs.readFileSync('src/map-injector.js', 'utf8');

const newProps = `  skull_city: [
    { type: 'bone_spike', w: 1.5, h: 4.0, d: 1.5, tier: 2, gen: (x, y, z) => \`
  // Prop: Bone Spike
  cyl(\${x}, \${y}, \${z}, 0.6, 1.5, { seg: 6, ink: WH });
  cyl(\${x}, \${y} + 1.5, \${z}, 0.4, 1.5, { seg: 6, ink: WH });
  cyl(\${x}, \${y} + 3.0, \${z}, 0.2, 1.0, { seg: 6, ink: WH });\` },
    { type: 'giant_skull', w: 6.0, h: 5.0, d: 6.0, tier: 3, gen: (x, y, z) => \`
  // Prop: Giant Rock Skull
  box(\${x}, \${y}, \${z}, 6.0, 5.0, 6.0, { ink: BL }); // Main skull block
  box(\${x} - 1.5, \${y} + 2.0, \${z} + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Left eye socket
  box(\${x} + 1.5, \${y} + 2.0, \${z} + 2.5, 1.2, 1.2, 1.0, { ink: BK }); // Right eye socket
  box(\${x}, \${y} + 0.5, \${z} + 2.5, 0.8, 1.5, 1.0, { ink: BK }); // Nose cavity
  box(\${x}, \${y} - 2.0, \${z} + 2.5, 4.0, 1.0, 1.0, { ink: WH }); // Teeth\` },
    { type: 'dark_altar', w: 2.5, h: 1.5, d: 2.5, tier: 1, gen: (x, y, z) => \`
  // Prop: Dark Altar
  box(\${x}, \${y}, \${z}, 2.5, 1.0, 2.5, { ink: BK });
  cyl(\${x}, \${y} + 1.0, \${z}, 1.0, 0.5, { seg: 8, ink: RD });\` }
  ],
  shipyard: [
    { type: 'galleon_hull', w: 5.0, h: 3.5, d: 10.0, tier: 3, gen: (x, y, z) => \`
  // Prop: Galleon Hull Construction
  box(\${x}, \${y}, \${z}, 4.0, 3.0, 9.0, { ink: OR }); // Main wood hull
  box(\${x}, \${y} + 1.5, \${z} - 4.5, 5.0, 1.5, 2.0, { ink: OR }); // Stern castle
  box(\${x}, \${y} + 1.0, \${z} + 4.5, 4.0, 1.5, 2.5, { ink: OR }); // Bow\` },
    { type: 'crane_tower', w: 2.5, h: 9.0, d: 2.5, tier: 3, gen: (x, y, z) => \`
  // Prop: Shipyard Crane
  box(\${x}, \${y}, \${z}, 1.5, 9.0, 1.5, { ink: BK }); // Iron pillar
  box(\${x}, \${y} + 8.0, \${z} + 3.0, 1.0, 1.0, 6.0, { ink: BK }); // Crane arm
  cyl(\${x}, \${y} + 4.0, \${z} + 5.5, 0.2, 4.0, { seg: 4, ink: WH }); // Cable\` },
    { type: 'scaffolding', w: 3.0, h: 4.0, d: 3.0, tier: 2, gen: (x, y, z) => \`
  // Prop: Wood Scaffolding
  cyl(\${x}-1.2, \${y}, \${z}-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(\${x}+1.2, \${y}, \${z}-1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(\${x}-1.2, \${y}, \${z}+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  cyl(\${x}+1.2, \${y}, \${z}+1.2, 0.2, 4.0, { seg: 4, ink: OR });
  box(\${x}, \${y} + 2.0, \${z}, 3.0, 0.2, 3.0, { ink: OR }); // Platform\` }
  ],
  treasure_market: [
    { type: 'merchant_tent', w: 4.0, h: 3.0, d: 4.0, tier: 2, gen: (x, y, z) => \`
  // Prop: Merchant Tent
  cyl(\${x}-1.8, \${y}, \${z}-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(\${x}+1.8, \${y}, \${z}-1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(\${x}-1.8, \${y}, \${z}+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  cyl(\${x}+1.8, \${y}, \${z}+1.8, 0.1, 2.0, { seg: 4, ink: OR });
  box(\${x}, \${y} + 2.0, \${z}, 4.2, 0.2, 4.2, { ink: RD }); // Canopy Roof
  box(\${x}, \${y} + 2.2, \${z}, 2.0, 0.8, 4.2, { ink: WH }); // Raised center\` },
    { type: 'gold_pile', w: 2.5, h: 1.5, d: 2.5, tier: 1, gen: (x, y, z) => \`
  // Prop: Massive Gold Pile
  cyl(\${x}, \${y}, \${z}, 1.2, 0.6, { seg: 8, ink: OR }); // Base
  cyl(\${x}, \${y} + 0.6, \${z}, 0.8, 0.5, { seg: 8, ink: OR }); // Mid
  cyl(\${x}, \${y} + 1.1, \${z}, 0.4, 0.4, { seg: 8, ink: OR }); // Top\` },
    { type: 'market_stall', w: 2.5, h: 1.8, d: 1.5, tier: 1, gen: (x, y, z) => \`
  // Prop: Goods Stall
  box(\${x}, \${y}, \${z}, 2.5, 1.0, 1.5, { ink: OR }); // Table
  box(\${x}, \${y} + 1.5, \${z}, 2.7, 0.2, 1.7, { ink: BL }); // Mini roof\` }
  ],
  fortress: [
    { type: 'stone_watchtower', w: 4.0, h: 10.0, d: 4.0, tier: 3, gen: (x, y, z) => \`
  // Prop: Stone Watchtower
  box(\${x}, \${y}, \${z}, 4.0, 9.0, 4.0, { ink: BL }); // Main tower
  box(\${x}, \${y} + 9.0, \${z}, 4.5, 1.0, 4.5, { ink: BK }); // Top platform parapet\` },
    { type: 'cannon_battery', w: 5.0, h: 1.8, d: 2.0, tier: 2, gen: (x, y, z) => \`
  // Prop: Cannon Battery Wall
  box(\${x}, \${y}, \${z}, 5.0, 1.2, 2.0, { ink: BL }); // Stone wall
  cyl(\${x} - 1.5, \${y} + 1.4, \${z} + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 1
  cyl(\${x} + 1.5, \${y} + 1.4, \${z} + 0.5, 0.4, 1.8, { seg: 8, ink: BK }); // Cannon 2\` },
    { type: 'iron_cage', w: 1.8, h: 2.2, d: 1.8, tier: 1, gen: (x, y, z) => \`
  // Prop: Prisoner Cage
  box(\${x}, \${y}, \${z}, 1.8, 0.2, 1.8, { ink: BK }); // Base
  box(\${x}, \${y} + 2.0, \${z}, 1.8, 0.2, 1.8, { ink: BK }); // Top
  cyl(\${x}, \${y} + 1.0, \${z}, 1.6, 2.0, { seg: 8, ink: BK, noCollide: true }); // Bars\` }
  ]`;

// Insert the new catalogs before '};' of propCatalog
code = code.replace("  ]\n};", "  ],\n" + newProps + "\n};");

// Now update the logic for the dynamic scan
const targetScanOld = `for (const y of tiers) {
  for (let x = bounds.minX + 4; x <= bounds.maxX - 4; x += gridStep) {
    for (let z = bounds.minZ + 4; z <= bounds.maxZ - 4; z += gridStep) {
      // Pick a random prop to test fit
      const propTemplate = availableProps[Math.floor(Math.random() * availableProps.length)];`;

const targetScanNew = `const midX = (bounds.minX + bounds.maxX) / 2;
const midZ = (bounds.minZ + bounds.maxZ) / 2;

for (const y of tiers) {
  for (let x = bounds.minX + 4; x <= bounds.maxX - 4; x += gridStep) {
    for (let z = bounds.minZ + 4; z <= bounds.maxZ - 4; z += gridStep) {
      // Determine the active prop catalog based on location for pirate_cove!
      let activeCatalog = availableProps;
      if (mapArg === 'pirate_cove') {
        if (x <= midX && z <= midZ) activeCatalog = propCatalog['skull_city'];
        else if (x > midX && z <= midZ) activeCatalog = propCatalog['shipyard'];
        else if (x <= midX && z > midZ) activeCatalog = propCatalog['treasure_market'];
        else activeCatalog = propCatalog['fortress'];
      }
      
      // Pick a random prop to test fit
      const propTemplate = activeCatalog[Math.floor(Math.random() * activeCatalog.length)];`;

code = code.replace(targetScanOld, targetScanNew);

// Remove the duplicate midX/midZ that was below
const midXmidZOld = `const midX = (bounds.minX + bounds.maxX) / 2;
const midZ = (bounds.minZ + bounds.maxZ) / 2;

const pocketsByQuad = { NW: [], NE: [], SW: [], SE: [] };`;

const midXmidZNew = `const pocketsByQuad = { NW: [], NE: [], SW: [], SE: [] };`;
code = code.replace(midXmidZOld, midXmidZNew);

fs.writeFileSync('src/map-injector.js', code);
console.log('Patched map-injector.js');
