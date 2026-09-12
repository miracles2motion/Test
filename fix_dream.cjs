const fs = require('fs');

let code = `#!/usr/bin/env node

/**
 * Dream Master NLP Router (Zero-Dependency Version)
 */
import { execSync } from 'child_process';
import process from 'process';

let prompt = process.argv.slice(2).join(' ').toLowerCase();
if (!prompt) {
  console.log('🌌 Dream NLP Router');
  process.exit(0);
}

console.log(\`\\n🧠 Dream is analyzing your request locally: "\${prompt}"...\\n\`);

// 1. Detect Multiplier (e.g. 2x, 3x)
let multiplier = 1;
const timesMatch = prompt.match(/(\\d+)x/);
if (timesMatch) {
  multiplier = parseInt(timesMatch[1], 10);
  if (multiplier < 1) multiplier = 1;
  if (multiplier > 10) multiplier = 10;
  prompt = prompt.replace(timesMatch[0], '').trim();
}

// 2. Detect Action
let action = 'god_mode';
if (prompt.includes('detail') || prompt.includes('micro')) action = 'detail';
else if (prompt.includes('heal') || prompt.includes('improve') || prompt.includes('upgrade') || prompt.includes('refine')) action = 'heal';
else if (prompt.includes('macro') || prompt.includes('building')) action = 'macro';
else if (prompt.includes('inject') || prompt.includes('prop')) action = 'inject';
else if (prompt.includes('delete') || prompt.includes('remove')) action = 'delete';

// 3. Detect Theme
const themes = ["urban", "cyber", "steampunk", "colossal", "maritime", "zen", "anomalous"];
let theme = 'urban';
for (const t of themes) {
  if (prompt.includes(t)) {
    theme = t;
    break;
  }
}
if (theme === 'urban') {
  if (prompt.includes('pirate') || prompt.includes('sea') || prompt.includes('ship')) theme = 'maritime';
  if (prompt.includes('shrine') || prompt.includes('garden') || prompt.includes('temple')) theme = 'zen';
  if (prompt.includes('factory') || prompt.includes('clock') || prompt.includes('gear')) theme = 'steampunk';
  if (prompt.includes('neon') || prompt.includes('tech') || prompt.includes('hacker')) theme = 'cyber';
}

// 4. Detect Map Name
let mapName = 'unknown_map';
const calledMatch = prompt.match(/called\\s+([a-z0-9_ -]+)/);
if (calledMatch) {
  mapName = calledMatch[1].trim().replace(/\\s+/g, '_');
} else {
  const words = prompt.split(' ');
  const mapIndex = words.indexOf('map');
  
  if (mapIndex !== -1 && mapIndex + 1 < words.length) {
    mapName = words[mapIndex + 1].replace(/[^a-z0-9_]/g, '');
  } else {
    // Check if pirate cove is in prompt
    if (prompt.includes('pirate cove')) {
      mapName = 'pirate_cove';
    } else {
      mapName = words[words.length - 1].replace(/[^a-z0-9_]/g, '');
    }
  }
}

try {
  let command = '';
  if (action === 'god_mode') command = \`npm run dream:god \${mapName} \${theme}\`;
  else if (action === 'detail') command = \`node src/map-refiner.js \${mapName} detail\`;
  else if (action === 'heal') command = \`node src/map-refiner.js \${mapName} heal\`;
  else if (action === 'macro') command = \`npm run dream:macro \${mapName} \${theme}\`;
  else if (action === 'inject') command = \`npm run dream:inject \${mapName} \${theme}\`;
  else if (action === 'delete') command = \`node src/map-deleter.js \${mapName}\`;

  console.log(\`✨ Dream understood your intent! Routing to:\`);
  console.log(\`   > \${command} (Running \${multiplier}x times)\\n\`);
  
  for (let i = 0; i < multiplier; i++) {
    if (multiplier > 1) {
      console.log(\`============================================================\`);
      console.log(\`🚀 DREAM CYCLE \${i + 1} OF \${multiplier}\`);
      console.log(\`============================================================\\n\`);
    }
    execSync(command, { stdio: 'inherit' });
  }
} catch (err) {
  console.error(\`\\n❌ Dream failed to execute: \${err.message}\`);
  process.exit(1);
}
`;

fs.writeFileSync('dream.js', code);
