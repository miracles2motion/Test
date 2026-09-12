const fs = require('fs');
let code = fs.readFileSync('src/levels/pirate_cove.js', 'utf8');

const oldMidLane = `  // 3. Central Chokepoint (Mid Lane)
  box(0, 0, 0, 16, 4, 16, { ink: BL }); // Central control platform
  stairs(0, 0, -10, 8, 4, 4, 0, { ink: BL }); // North ramp
  stairs(0, 0, 10, 8, 4, 4, 2, { ink: BL }); // South ramp
  stairs(-10, 0, 0, 4, 4, 8, 3, { ink: BL }); // West ramp
  stairs(10, 0, 0, 4, 4, 8, 1, { ink: BL }); // East ramp
  
  pickup(0, 4.5, 0); // High value target
  pickup(0, 0, -25); pickup(0, 0, 25); // Mid extensions
  
  // Mid Cover (Orange) - Placed safely away from center
  box(-6, 4, -4, 2, 1.5, 2, { ink: OR });
  box(6, 4, 4, 2, 1.5, 2, { ink: OR });`;

const newMidLane = `  // 3. Central Centerpiece: Suspended Ironclad Drydock
  // Tier 1: The Sea Fort Pillars (Allows clean ground-level running under the ship)
  box(-12, 0, -18, 4, 16, 4, { ink: BL }); // NW Pillar
  box(12, 0, -18, 4, 16, 4, { ink: BL });  // NE Pillar
  box(-12, 0, 18, 4, 16, 4, { ink: BL });  // SW Pillar
  box(12, 0, 18, 4, 16, 4, { ink: BL });   // SE Pillar
  
  pickup(0, 1, 0); // High value target in the hidden "Engine Room" (Ground level)
  pickup(0, 0, -25); pickup(0, 0, 25); // Mid lane extensions

  // Tier 2: The Ironclad Hull (Suspended at Y=6)
  box(0, 6, 0, 16, 2, 32, { ink: BK }); // Sleek, dark metal hull
  
  // The "Ramming Bows" (Using stairs facing outward to create sharp angled hulls)
  stairs(0, 6, -18, 16, 2, 4, 0, { ink: BK }); // North Bow
  stairs(0, 6, 18, 16, 2, 4, 2, { ink: BK });  // South Bow
  
  // Ramps connecting ground to the Ironclad deck
  stairs(0, 0, -28, 10, 6, 12, 0, { ink: BL }); // North access ramp
  stairs(0, 0, 28, 10, 6, 12, 2, { ink: BL });  // South access ramp
  
  // Deck Cover: Massive Cylindrical Smokestacks
  cyl(0, 8, -8, 2.5, 6, { ink: OR }); // North Smokestack
  cyl(0, 8, 8, 2.5, 6, { ink: OR });  // South Smokestack
  pickup(0, 8.5, 0); // Deck control reward
  
  // Deck Cover: Munitions crates
  box(-6, 8, 0, 2, 1.5, 4, { ink: OR });
  box(6, 8, 0, 2, 1.5, 4, { ink: OR });

  // Tier 3: The Drydock Crane (Connecting the pillars at Y=16)
  box(0, 16, -18, 28, 2, 4, { ink: BL }); // North Gantry
  box(0, 16, 18, 28, 2, 4, { ink: BL });  // South Gantry
  box(-12, 16, 0, 4, 2, 32, { ink: BL }); // West Gantry
  box(12, 16, 0, 4, 2, 32, { ink: BL });  // East Gantry
  
  // Central Crane Grapple Rings (Drops right onto the deck)
  ring(0, 15, -18, 1.5, { ink: OR });
  ring(0, 15, 18, 1.5, { ink: OR });
  ring(0, 15, 0, 1.5, { ink: OR });`;

code = code.replace(oldMidLane, newMidLane);
fs.writeFileSync('src/levels/pirate_cove.js', code);
