const fs = require('fs');
let code = fs.readFileSync('src/map-injector.js', 'utf8');

const scatterLogic = `
console.log(\`✨ Found \${safePockets.length} potential City Lots.\`);

// Scatter some small cover barrels along the pathways (Y=0) to increase collider density
for(let i=0; i<150; i++) {
  const bx = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
  const bz = bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ);
  if (isBoxCollisionFree(bx, 0.0, bz, 1.0, 1.0, 1.0, 1.0)) {
     safePockets.push({
       x: bx, y: 0, z: bz,
       template: { gen: (x,y,z) => \`  box(\${x}, \${y}, \${z}, 1.2, 1.0, 1.2, { ink: OR }); // Scattered Crate\` }
     });
  }
}

const selectedProps = safePockets;
`;

code = code.replace("console.log(`✨ Found ${safePockets.length} potential City Lots.`);\n\nconst selectedProps = safePockets;", scatterLogic);

fs.writeFileSync('src/map-injector.js', code);
console.log('Added crates for density');
