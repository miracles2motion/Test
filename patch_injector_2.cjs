const fs = require('fs');
let code = fs.readFileSync('src/map-injector.js', 'utf8');

// Replace WH with OR (or BK) in the new props we added
code = code.replace(/ink: WH/g, 'ink: OR');

fs.writeFileSync('src/map-injector.js', code);
console.log('Patched map-injector.js (removed WH)');
