const fs = require('fs');
let code = fs.readFileSync('src/levels/pirate_cove.js', 'utf8');
code = code.replace("B.finish();\n}", "B.finish();\n  return L;\n}");
fs.writeFileSync('src/levels/pirate_cove.js', code);
