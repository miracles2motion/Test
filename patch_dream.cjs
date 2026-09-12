const fs = require('fs');
let code = fs.readFileSync('dream.js', 'utf8');

// We want to add multiplier detection.
// Under // 3. Detect Map Name
const injection = `
// 4. Detect Multiplier (e.g. 2x, 3x)
let multiplier = 1;
const timesMatch = prompt.match(/(\\d+)x/);
if (timesMatch) {
  multiplier = parseInt(timesMatch[1], 10);
  if (multiplier < 1) multiplier = 1;
  if (multiplier > 10) multiplier = 10; // Cap it so it doesn't run forever
}
`;

code = code.replace("try {", injection + "\ntry {");

const loopInjection = `  console.log(\`✨ Dream understood your intent! Routing to:\`);
  console.log(\`   > \${command} (Running \${multiplier}x times)\n\`);
  
  for (let i = 0; i < multiplier; i++) {
    if (multiplier > 1) {
      console.log(\`\\n============================================================\`);
      console.log(\`🚀 DREAM CYCLE \${i + 1} OF \${multiplier}\`);
      console.log(\`============================================================\\n\`);
    }
    execSync(command, { stdio: 'inherit' });
  }`;

code = code.replace(/  console\.log\(`✨ Dream understood your intent! Routing to:`\);\n  console\.log\(`   > \${command}\\n`\);\n\n  execSync\(command, \{ stdio: 'inherit' \}\);/, loopInjection);

fs.writeFileSync('dream.js', code);
