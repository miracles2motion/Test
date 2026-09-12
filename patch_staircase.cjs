const fs = require('fs');
let code = fs.readFileSync('src/levels/pirate_cove.js', 'utf8');

const oldRamps = `  // Ramps connecting ground to the Ironclad deck
  stairs(0, 0, -28, 10, 6, 12, 0, { ink: BL }); // North access ramp
  stairs(0, 0, 28, 10, 6, 12, 2, { ink: BL });  // South access ramp`;

const newRamps = `  // Ramps connecting ground to the Ironclad deck
  // User requested a single massive boarding staircase at one end for a King of the Hill flow
  stairs(0, 0, 25, 12, 8, 14, 2, { ink: BL });  // South massive boarding ramp (Y=0 to Y=8)`;

code = code.replace(oldRamps, newRamps);
fs.writeFileSync('src/levels/pirate_cove.js', code);
