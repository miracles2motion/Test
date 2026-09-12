const fs = require('fs');
let code = fs.readFileSync('src/levels/pirate_cove.js', 'utf8');
code = code.replace(/ink: WH/g, 'ink: OR');
fs.writeFileSync('src/levels/pirate_cove.js', code);
console.log('Fixed pirate_cove.js');
