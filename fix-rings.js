import fs from 'fs';
let c = fs.readFileSync('src/macro-dreamer.js', 'utf8');
c = c.replace(/ring\(\$\{x\}, \$\{y\} \+ ([\d.]+),/g, (m, g1) => {
  return `ring(\${x}, \${y} + ${(parseFloat(g1) + 1.8).toFixed(1)},`;
});
fs.writeFileSync('src/macro-dreamer.js', c);
console.log('Fixed ring heights in macro-dreamer.js');
