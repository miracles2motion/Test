const fs = require('fs');
let code = fs.readFileSync('src/levels/pirate_cove.js', 'utf8');

const injection = `
  // 6.5 The Sky-Bridges (Connecting Towers to the Central Roof)
  // These bridges use an L-shape to avoid diagonal AABB collider issues.
  
  // NW Bridge
  slab(-40, -45, -14, -41, 12, 1.0, { ink: BL }); // Flat catwalk East from tower
  stairs(-12, 12, -41, '+z', 16, 4, { rise: 0.25, run: 1.375, ink: BL }); // Ramp South up to Y=16 Roof
  box(-27, 12, -43, 2, 1.5, 4, { ink: OR }); // Bridge cover

  // NE Bridge
  slab(14, -45, 40, -41, 12, 1.0, { ink: BL }); // Flat catwalk West from tower
  stairs(12, 12, -41, '+z', 16, 4, { rise: 0.25, run: 1.375, ink: BL }); // Ramp South up to Y=16 Roof
  box(27, 12, -43, 2, 1.5, 4, { ink: OR }); // Bridge cover

  // SW Bridge
  slab(-40, 41, -14, 45, 12, 1.0, { ink: BL }); // Flat catwalk East from tower
  stairs(-12, 12, 41, '-z', 16, 4, { rise: 0.25, run: 1.375, ink: BL }); // Ramp North up to Y=16 Roof
  box(-27, 12, 43, 2, 1.5, 4, { ink: OR }); // Bridge cover

  // SE Bridge
  slab(14, 41, 40, 45, 12, 1.0, { ink: BL }); // Flat catwalk West from tower
  stairs(12, 12, 41, '-z', 16, 4, { rise: 0.25, run: 1.375, ink: BL }); // Ramp North up to Y=16 Roof
  box(27, 12, 43, 2, 1.5, 4, { ink: OR }); // Bridge cover

  // 7. Grapple Anchors`;

code = code.replace('  // 7. Grapple Anchors', injection);
fs.writeFileSync('src/levels/pirate_cove.js', code);
