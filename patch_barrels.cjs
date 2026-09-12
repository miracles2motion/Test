const fs = require('fs');
let code = fs.readFileSync('src/map-injector.js', 'utf8');

const scatterLogic = `
console.log(\`✨ Found \${safePockets.length} potential City Lots.\`);

// Scatter some small cover barrels along the pathways (Y=0)
for(let i=0; i<120; i++) {
  const bx = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
  const bz = bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ);
  if (isBoxCollisionFree(bx, 0.0, bz, 1.0, 1.0, 1.0, 1.0)) {
     safePockets.push({
       x: bx, y: 0, z: bz,
       template: { gen: (x,y,z) => \`  box(\${x}, \${y}, \${z}, 1.0, 1.0, 1.0, { ink: BK }); // Pathway Cover\` }
     });
  }
}

const selectedProps = safePockets;
`;

code = code.replace("console.log(`✨ Found ${safePockets.length} potential City Lots.`);\n\nconst selectedProps = safePockets;", scatterLogic);

fs.writeFileSync('src/map-injector.js', code);
