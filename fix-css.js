const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf-8');

// Replace .main-menu-panel with .panel.main-menu-panel to increase specificity
css = css.replace(/\.main-menu-panel/g, '.panel.main-menu-panel');

// Add .main-menu-screen override
css += `\n.screen.main-menu-screen { background: transparent !important; }\n`;
fs.writeFileSync('style.css', css);
