const fs = require('fs');
let code = fs.readFileSync('src/level.js', 'utf8');

code = code.replace(
  /key: 'pirate_cove',[\s\S]*?scale: 'Tier 1-4',/m,
  `key: 'pirate_cove',
    name: 'PIRATE COVE',
    category: 'colossal',
    tags: ['GROTTO', 'SHIPWRECK', 'VERTICAL'],
    env: 'A massive sunken grotto carved into the bones of the earth. Features a Smugglers Shanty Town, the Leviathans Graveyard, a highly volatile Gunpowder Grotto, and the shattered remains of a legendary Pirate Kings Galleon.',
    engagement: 'Asymmetrical Verticality & Hazards',
    hazard: 'Deep Water / Grapple Chasms',
    scale: 'Tier 1-4',`
);

fs.writeFileSync('src/level.js', code);
console.log('Patched registry in level.js');
