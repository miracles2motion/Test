const fs = require('fs');

let levelCode = fs.readFileSync('src/level.js', 'utf8');

// Strip out the bad 5x lines safely
const lines = levelCode.split('\n');
const cleaned = lines.filter(line => !line.includes('5x: build5x') && !line.includes('levels/5x.js'));

fs.writeFileSync('src/level.js', cleaned.join('\n'));
